import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { REGISTRY_URL } from 'src/environments/environment';
import { Status } from '../models/status.model';


@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' : 'http://localhost:4200/',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT' })
  };

  public status: Status[] = [];

  public getStatus(): Observable<Status[]> {
    return this.http.get<Status[]>(`${REGISTRY_URL}status`, this.httpOptions)
      .pipe(  
        catchError(this.handleError<Status[]>('getStatus', []))
      );
  }

  getAllStatus(): Observable<Status[]> {
    return this.http.get<Status[]>(`${REGISTRY_URL}status`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // this.logger.error("WE ENCOUNTERED AN ERROR IN " + operation);
      console.error(error); // we'll just log it to the console

      console.log(`${operation} failed: ${error.message}`);

      // we want to ensure that the app keeps running by returning an empty result
      return of(result as T);
    };
  }
}
