import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BatchTemplate } from 'src/app/models/batch.model';
import { REGISTRY_URL } from 'src/environments/environment';
import { Iteration } from '../models/iteration.model';
import { IterationDTO } from '../models/DTO/iteration-dto.model';

@Injectable({
  providedIn: 'root'
})
export class IterationService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' : 'http://localhost:4200/',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT'
        })
  };

  

  constructor(private http: HttpClient) { }
  getIterations(): Observable<Iteration[]>{
    return this.http.get<Iteration[]>(`${ REGISTRY_URL }iteration`);
  }

  getIterationById(id:number): Observable<Iteration> {
    return this.http.get<Iteration>(`${ REGISTRY_URL }iteration/id/${id}`);
  }

  createIteration(newInteration:IterationDTO) : Observable<any> {
    return this.http.post<any>(`${ REGISTRY_URL }iteration`,newInteration);
  }

  updateIteration(updateIteration: IterationDTO, id:number) : Observable<any>{
    return this.http.put<any>(`${ REGISTRY_URL }iteration`, updateIteration)
  }

  deleteIteration(id:number): Observable<any>{
    return this.http.delete<any>(`${ REGISTRY_URL }iteration/id/${id}`)
  } 


  // url for the API containing batches
  apiUrl = "https://caliber2-mock.revaturelabs.com/mock/training/batch";
  getBatchService(): Observable<BatchTemplate[]>{
    return this.http.get<BatchTemplate[]>(`${REGISTRY_URL}iteration`)
  }

  getBatchServiceMock(): Observable<BatchTemplate[]>{
    return this.http.get<BatchTemplate[]>(this.apiUrl)
  }

  getIterationMock(): Observable<Iteration[]>{
    return this.http.get<Iteration[]>(this.apiUrl)
  }

  // sendIteration(iteration: Iteration): Observable<Iteration> {
  //   console.log("Here is the iteration we're about to send: " + JSON.stringify(iteration));
  //   return this.http.post<Iteration>(`http://localhost:8080/api/iteration` , iteration , this.httpOptions) ;
  //   //.pipe(catchError(this.handleError<ClientMessage>('New Order', undefined)));
  //  }

}
