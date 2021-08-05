import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { REGISTRY_URL } from 'src/environments/environment';
//import { Phase } from '../models/phase';
import { Status } from '../models/status';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class StatusService implements OnInit {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  public status: Status[] = [];
  ngOnInit(): void {
    this.getStatus();
  }

  public getStatus() {
    return this.http.get<Status[]>(`${REGISTRY_URL}status`, this.httpOptions)
      .pipe(
        catchError(this.handleError<Phase[]>('getStatus', []))
      ).subscribe(data => {
        this.status = data;
        console.log(this.status);
      });
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
