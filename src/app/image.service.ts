import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { RatedImage } from './rated-image.class';

@Injectable()
export class ImageService {

	constructor(private http: Http) { }

	getImage(id:number): Observable<RatedImage> {
		//return http.get('http://localhost/api/ImageService')
		return null;
	}
}
