import { AppSettings } from './../app.settings';
import { ILocalidad } from './../interfaces/ILocalidad';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, RequestMethod, Response } from '@angular/http';
import { Server } from './../../../node_modules/andes-shared/src/lib/server/server.service';
import 'rxjs/add/operator/toPromise';

import {Observable} from 'rxjs/Rx';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LocalidadService {

   private localidadUrl = AppSettings.API_ENDPOINT + '/core/tm/localidades';  // URL to web api

   constructor(private server: Server, private http: Http) {}

    getXProvincia(provincia: String): Observable<ILocalidad[]> {
    console.log(this.localidadUrl +"?provincia=" + provincia);
       return this.http.get(this.localidadUrl +"?provincia=" + provincia)
           .map((res:Response) => res.json())
           .catch(this.handleError); //...errors if any*/
   }

  handleError(error: any){
        console.log(error.json());
        return Observable.throw(error.json().error || 'Server error');
    }

   
}