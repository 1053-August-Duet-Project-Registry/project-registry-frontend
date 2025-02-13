import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { batchTemplate } from 'src/app/models/batch.model';
import { REGISTRY_URL } from 'src/environments/environment';
import { Iteration } from '../models/iteration.model';

@Injectable({
  providedIn: 'root'
})
export class IterationService {

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": 'application/json',
      "Access-Control-Allow-Origin" : "http://localhost:4200/",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT"
        })
  }

  //url for the API containing batches
  apiUrl = "https://caliber2-mock.revaturelabs.com/mock/training/batch";

  constructor(private http: HttpClient) { }

  getBatchService(): Observable<batchTemplate[]>{
    return this.http.get<batchTemplate[]>(`${REGISTRY_URL}iteration`)
  }

  getIteration(): Observable<Iteration[]>{
    return this.http.get<Iteration[]>(`${ REGISTRY_URL }iteration`)
  }

  getBatchServiceMock(): Observable<batchTemplate[]>{
    return this.http.get<batchTemplate[]>(this.apiUrl)
  }

  getIterationMock(): Observable<Iteration[]>{
    return this.http.get<Iteration[]>(this.apiUrl)
  }

  sendIteration(iteration: Iteration): Observable<Iteration> {
    console.log("Here is the iteration we're about to send: " + JSON.stringify(iteration));
    return this.http.post<Iteration>(`http://localhost:8080/api/iteration` , iteration , this.httpOptions) ;
    //.pipe(catchError(this.handleError<ClientMessage>('New Order', undefined)));
   }

}
