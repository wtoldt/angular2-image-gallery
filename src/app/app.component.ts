import { Component, OnInit, ElementRef } from '@angular/core';

import { MdlSnackbarService } from 'angular2-mdl';

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
		private imageService:ImageService,
		private mdlSnackbarService: MdlSnackbarService) { }

	ngOnInit() {
		this.imageService.getImage(this.index)
			.subscribe( (image:RatedImage) => this.handleImageChange(image));

		Observable.fromEvent(window, 'resize')
			.debounceTime(200)
			.subscribe( () => {
				this.resize();
			});

		Observable.fromEvent(document, 'keyup')
		.debounceTime(200)
		.subscribe( event => {
			this.handleKeyup(event);
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

	handleKeyup(event) {
		if ((event.key === 'ArrowRight' && !this.fullscreenMode)
			|| (event.key === 'ArrowRight' && (event.ctrlKey || event.shiftKey) && this.fullscreenMode)) {
			this.nextImage();

		} else if ((event.key === 'ArrowLeft' && !this.fullscreenMode)
			|| (event.key === 'ArrowLeft' && (event.ctrlKey || event.shiftKey) && this.fullscreenMode)) {
			this.prevImage();

		} else if ((event.key === 'ArrowUp' && !this.fullscreenMode)
			|| (event.key === 'ArrowUp' && (event.ctrlKey || event.shiftKey) && this.fullscreenMode)) {
			this.toggleRating('love');

		} else if ((event.key === 'ArrowDown' && !this.fullscreenMode)
			|| (event.key === 'ArrowDown' && (event.ctrlKey || event.shiftKey) && this.fullscreenMode)) {
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
		this.toast(`${rating}ed ${this.image.id}`);
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

	jumpToImage(index: number) {
		if (index) {
			this.index = index;
			this.imageService.getImage(this.index)
				.subscribe( (image:RatedImage) => this.handleImageChange(image));
		}
	}

	toggleFullscreenMode(fullscreen:boolean) {
		this.fullscreenMode = fullscreen;
		this.resize();
	}

	toast(message:string) {
		this.mdlSnackbarService.showToast(message);
	}
}
