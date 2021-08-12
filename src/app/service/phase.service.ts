import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { REGISTRY_URL } from 'src/environments/environment';
import { Phase } from '../models/phase.models';

@Injectable({
  providedIn: 'root'
})
export class PhaseService implements OnInit {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  public phases: Phase[] = [];

  // look into this when you get a chance
  // tslint:disable-next-line:contextual-lifecycle
  ngOnInit(): void {
    // this.getAllPhases();
  }

  getAllPhases(): Observable<Phase[]>{
    return this.http.get<Phase[]>(`${ REGISTRY_URL }phase`)
    // .pipe(
    //   catchError(this.handleError<Phase[]>('getPhase', []))
    // ).subscribe(data => {
    //   this.phases = data;
    //   console.log(this.phases);
    // })
    ;
  }

  getPhaseById(id: number): Observable<Phase>{
    return this.http.get<Phase>(`${ REGISTRY_URL }phase/id/${id}`);
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
