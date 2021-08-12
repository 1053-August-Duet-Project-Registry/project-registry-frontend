import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { BatchTemplate } from 'src/app/models/batch.model';
import { REGISTRY_URL } from 'src/environments/environment';
import { Iteration } from '../models/iteration.model';
import { IterationDTO } from '../models/DTO/iteration-dto.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IterationService {

  // url for the API containing batches
  apiUrl = 'https://caliber2-mock.revaturelabs.com/mock/training/batch';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' : 'http://localhost:4200/',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT'
        })
  };


  constructor(private http: HttpClient) { }
  getAllIterations(): Observable<Iteration[]>{
    return this.http.get<Iteration[]>(`${ REGISTRY_URL }iteration`);
  }

  getIterationById(id: number): Observable<Iteration> {
    return this.http.get<Iteration>(`${ REGISTRY_URL }iteration/id/${id}`);
  }

  createIteration(newInteration: IterationDTO): Observable<any> {
    return this.http.post<any>(`${ REGISTRY_URL }iteration`, newInteration);
  }

  updateIteration(updateIteration: IterationDTO, id: number): Observable<any>{
    return this.http.put<any>(`${ REGISTRY_URL }iteration`, updateIteration);
  }

  deleteIteration(id: number): Observable<any>{
    return this.http.delete<any>(`${ REGISTRY_URL }iteration/id/${id}`);
  }

  getIteration(): Observable<Iteration[]>{
    return this.http.get<Iteration[]>(`${ REGISTRY_URL }iteration`);
  }

  getBatchService(): Observable<BatchTemplate[]> {
    return forkJoin([
      this.http.get<BatchTemplate[]>(`${REGISTRY_URL}iteration`),
      this.http.get<BatchTemplate[]>(this.apiUrl),
    ]).pipe(
      map((d) => {
        d[0].forEach((iteration) => {
          const foundBatch = d[1].find((n) => {
            return n.batchId === iteration.batchId ? n : undefined;
          });
          iteration.location = foundBatch?.location ?? 'Unknown';
          iteration.skill = foundBatch?.skill ?? 'Unknown';

          // Not using the start/end date coming from Caliber because those
          // dates are ancient and also our own database currently contain
          // startDate and endDate for a particular batch.  If you want to use
          // the dates from Caliber uncomment the following:
          // iteration.startDate =
          //   foundBatch?.startDate ?? new Date().toUTCString();
          // iteration.endDate = foundBatch?.endDate ?? new Date().toUTCString();
        });
        return d[0];
      })
    );
  }

  getBatchServiceMock(): Observable<BatchTemplate[]>{
    return this.http.get<BatchTemplate[]>(this.apiUrl);
  }

  getIterationMock(): Observable<Iteration[]>{
    return this.http.get<Iteration[]>(this.apiUrl);
  }

  // sendIteration(iteration: Iteration): Observable<Iteration> {
  //   console.log("Here is the iteration we're about to send: " + JSON.stringify(iteration));
  //   return this.http.post<Iteration>(`http://localhost:8080/api/iteration` , iteration , this.httpOptions) ;
  //   //.pipe(catchError(this.handleError<ClientMessage>('New Order', undefined)));
  //  }

}
