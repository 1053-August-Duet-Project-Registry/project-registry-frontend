import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { REGISTRY_URL } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Project } from '../models/project.model';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag.model';
import { Phase } from '../models/phase.models';
import { Status } from '../models/status.model';
import { ProjectDTO } from '../models/DTO/project-dto.model';

@Injectable({
  providedIn: 'root'
})

export class ViewProjectService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAllProjects():Observable<Project[]>{
    return this.http.get<Project[]>(`${REGISTRY_URL}project`);
  }

  getProjectById( id:number ): Observable<Project>{
    return this.http.get<Project>(`${ REGISTRY_URL }project/id/${id}`);
  }

  createProject( newProject : ProjectDTO ) : Observable<any>{
    return this.http.post<Project>(`${REGISTRY_URL}project`,newProject);
  }

  updateProject( updatedProject : ProjectDTO , id: number ) : Observable<any>{
    return this.http.put<Project>(`${REGISTRY_URL}project/id/${id}`,updatedProject)
  }

  deleteProject( id:number ): Observable<any>{
    return this.http.delete<any>(`${ REGISTRY_URL }project/id/${id}`);
  }

  
  // the following functions are created by previous team. Because of the restr

  /* Return all the projects from DB**/
  public GetAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${REGISTRY_URL}project`, this.httpOptions)
      .pipe(
        catchError(this.handleError<Project[]>('GetProject', []))
      );
  }

  /* intended to get all status type projects in the DB**/
  public GetAllProjectStatus(): Observable<Project[]> {
    return this.http.get<Project[]>(`${REGISTRY_URL}project`, this.httpOptions)
      .pipe(
        catchError(this.handleError<Project[]>('GetProject', []))
      );
  }

  // Return all the available type of tags
  public GetAllProjectTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${REGISTRY_URL}tag`, this.httpOptions)
      .pipe(
        catchError(this.handleError<Tag[]>('GetTag', []))
      );
  }

  // Return all the available phases
  public GetAllProjectPhase(): Observable<Phase[]> {
    return this.http.get<Phase[]>(`${REGISTRY_URL}phase`, this.httpOptions)
      .pipe(
        catchError(this.handleError<Phase[]>('GetPhase', []))
      );
  }


  

  public getAllStatuses(): Observable<Status[]> {
    return this.http.get<Status[]>(`${REGISTRY_URL}status`, this.httpOptions)
      .pipe(
        catchError(this.handleError<Status[]>('GetPhase', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log it to the console if something goes wrong
      return of(result as T);
    };
  }
}
