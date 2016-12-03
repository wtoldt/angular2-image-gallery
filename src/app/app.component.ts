import { Component, OnInit, ElementRef } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { ImageService } from './image.service';
import { RatedImage } from './rated-image.class';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
	imageEl:HTMLElement;
	image: RatedImage;
	index:number = 0;
	fullscreenMode:boolean = false;
	loading:boolean = false;
	skipTrashed: boolean = false;

	constructor(
		private el:ElementRef,
		private imageService:ImageService) { }

	ngOnInit() {
		this.imageService.getImage(this.index)
			.subscribe( (image:RatedImage) => this.handleImageChange(image));

		Observable.fromEvent(window, 'resize')
			.debounceTime(200)
			.subscribe( () => {
				this.resize();
			});

		Observable.fromEvent(document, 'keydown')
		.debounceTime(200)
		.subscribe( event => {
			this.handleKeydown(event);
		});

	}

	handleImageChange(image:RatedImage) {
		this.image = image;
		this.index = +image.id;
		this.loading = true;
		Observable.fromEvent(this.imageEl, 'load')
			.subscribe( () => {
				this.loading = false;
			});
			this.resize();
	}

	handleKeydown(event) {
		if (event.key === 'ArrowRight') {
			this.nextImage();
		} else if (event.key === 'ArrowLeft') {
			this.prevImage();
		} else if (event.key === 'ArrowUp') {
			this.toggleRating('love');
		} else if (event.key === 'ArrowDown') {
			this.toggleRating('trash');
		} else if (event.key === 'r') {
			this.toggleRating('react');
		} else if (event.key === 'f') {
			this.toggleFullscreenMode(!this.fullscreenMode);
		}
	}

	resize() {
		let nativeEl:HTMLElement = this.el.nativeElement,
			cardTitleEl:HTMLElement = <HTMLElement> nativeEl.querySelector('mdl-card-title'),
			layoutContent:HTMLElement = <HTMLElement> nativeEl.querySelector('.mdl-layout__content'),
			cardTitlePadding:number = 16*2,
			layoutHeight = (+nativeEl.querySelector('mdl-layout-content').clientHeight) - 150,
			cardWidth = cardTitleEl.clientWidth - 16*2;

		this.imageEl = <HTMLElement> nativeEl.querySelector('#image');
		if (this.fullscreenMode) {
			this.imageEl.style.maxHeight = ``;
			this.imageEl.style.maxWidth = ``;
			this.imageEl.style.height = `${this.image.height}px`;
			this.imageEl.style.width = `${this.image.width}px`;
			layoutContent.style.overflowX = 'scroll';
		} else {
			this.imageEl.style.height = ``;
			this.imageEl.style.width = ``;
			this.imageEl.style.maxHeight = `${layoutHeight}px`;
			this.imageEl.style.maxWidth = `${cardWidth}px`;
			layoutContent.style.overflowX = ``;
		}

		this.imageEl.setAttribute('src', this.image.url);
	}

	rateImage(rating:string) {
		this.imageService.rateImage(this.index, rating)
			.subscribe( (image:RatedImage) => this.handleImageChange(image));
	}

	toggleRating(rating:string) {
		if (this.image.rating === 'unrated') {
			this.rateImage(rating);
		} else {
			this.rateImage('unrated');
		}
	}

	prevImage() {
		if (this.skipTrashed) {
			this.imageService.getNextNonTrashedImage(this.index -1, -1)
				.subscribe( (image:RatedImage) => this.handleImageChange(image));
		} else {
			this.imageService.getImage(this.index -1)
				.subscribe( (image:RatedImage) => this.handleImageChange(image));
		}
	}

	nextImage() {
		if (this.skipTrashed) {
			this.imageService.getNextNonTrashedImage(this.index +1, +1)
				.subscribe( (image:RatedImage) => this.handleImageChange(image));
		} else {
			this.imageService.getImage(this.index +1)
				.subscribe( (image:RatedImage) => this.handleImageChange(image));
		}
	}

	toggleFullscreenMode(fullscreen:boolean) {
		this.fullscreenMode = fullscreen;
		this.resize();
	}

	onKeypress(event) {
		console.log(event);
	}
}
