import { ClientMessage } from './../models/clientMessage.model';
import { catchError, tap } from 'rxjs/operators';
import { Tag } from './../models/tag.model';

import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { REGISTRY_URL } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  httpOptions2 = {
    headers: new HttpHeaders({'Content-Type': 'text/plain'})
  };

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${REGISTRY_URL}tag`);
  }


  public registerTag(newTag: Tag): Observable<string> {
    return this.http.post<Tag>(`${REGISTRY_URL}tag`, newTag)
      .pipe(
        tap(_ => console.log('posting tag..')),
        catchError(this.handleError<any>('registerTag'))
        );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to a remote logging infrastructure
      // this.logger.error("WE ENCOUNTERED AN ERROR IN " + operation);
      console.error(error); // we'll just log it to the console
      // TODO: better job transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // we want to ensure that the app keeps running by returning an empty result
      return of(result as T);
    };
  }
}
