import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { RatedImage } from './rated-image.class';
import * as env from '../environments/environment';

@Injectable()
export class ImageService {
	baseUrl:string = env.environment.baseUrl;
	apiUrl:string = `${this.baseUrl}/api/images`;

	constructor(private http: Http) { }

	getImage(id:number): Observable<RatedImage> {
		return this.http.get(`${this.apiUrl}/${id}`)
			.map( response => this.extractImage(response))
			.catch(this.handleError);
	}

	getNextNonTrashedImage(id:number, direction:number): Observable<RatedImage> {
		return this.http.get(`${this.apiUrl}/${id}?direction=${direction}`)
			.map( response => this.extractImage(response))
			.catch(this.handleError);
	}

	rateImage(id:number, rating:string): Observable<RatedImage> {
		return this.http.get(`${this.apiUrl}/${id}/rate?rating=${rating}`)
			.map( response => this.extractImage(response))
			.catch(this.handleError);
	}

	private extractImage(res: Response): RatedImage {
		let body = res.json(),
			image:RatedImage = new RatedImage();

		image.id = body.id;
		image.rating = body.rating;
		image.url = `${this.baseUrl}${body.url}`;
		image.height = `${body.height}px`;
		image.width = `${body.width}px`;
		image.totalImages = +body.total;

		return image;
	}

	private handleError(error: Response | any) {
		 console.error(error);
		let errorBody = error.json(),
			errorMessage = errorBody ? errorBody.message : 'unknown error; check console';

		return Observable.throw(errorMessage);
	}
}
