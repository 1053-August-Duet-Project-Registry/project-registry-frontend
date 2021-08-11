import { catchError, tap } from 'rxjs/operators';
import { Tag } from '../models/tag.model';
import { TagDTO } from '../models/DTO/tag-dto.model';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { REGISTRY_URL } from '../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${REGISTRY_URL}tag`);
  }

  getTagById(id: number): Observable<Tag>{
    return this.http.get<Tag>(`${ REGISTRY_URL }tag/id/${id}`);
  }

  createTag( newTag: TagDTO ): Observable<Tag>{
    console.log(newTag);
    return this.http.post<any>(`${REGISTRY_URL}tag`, newTag)
    .pipe(
      tap(_ => console.log('posting tag..')),
      catchError(this.handleError<any>('registerTag'))
      );
  }

  public disableTag(tag: Tag): Observable<Tag> {
    return this.http.put<Tag>(`${REGISTRY_URL}tag/id/${tag.id}/disable`, {});
  }

  // find the correct typedef
  private handleError<T>(operation = 'operation', result?: T): any {
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
