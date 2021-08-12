import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { REGISTRY_URL } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Status } from '../models/status.model';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Tag } from '../models/tag.model';
import { ProjectDTO } from '../models/DTO/project-dto.model';
import { Iteration } from '../models/iteration.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  // This is left by the previous teams.
  // It's might be for testing purpose before connecting with backend
  public currentProject: Project = new Project(0, '', new Status(1, 'IN_ITERATION'),
    '', new User(1, 'william', new Role(1, 'admin')),
    [new Tag(-1, 'Revature', 'Made by Revature', true),
      new Tag(-2, 'Java', 'server language', true)], []);

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  public createProject(newProject: ProjectDTO): Observable<Project> {
    return this.http.post<Project>(`${REGISTRY_URL}project`, newProject, this.httpOptions)
      .pipe(
        tap(_ => console.log('posting project..')),
        catchError(this.handleError<any>('createProject'))
        );
  }

  public updateProject(project: Project): Observable<Project> {
    const obs: any[] = [
      this.http.put(
        `${REGISTRY_URL}project/id/${project.id}`,
        project,
        this.httpOptions
      ),
    ];
    const numOfIterations = project.iterations.length;
    let lastIterationIdx: number;
    if (numOfIterations > 0) {
      lastIterationIdx = project.iterations.length - 1;
      const currentIteration = project.iterations[lastIterationIdx];
      currentIteration.project = { ...project, iterations: [] };
      obs.push(this.http.put<Iteration>(
        `${REGISTRY_URL}iteration/id/${currentIteration.id}`,
        currentIteration,
        this.httpOptions
      ))
    }
    return forkJoin(obs).pipe(
      map((d: any[]) => {
        if (numOfIterations > 0) {
          d[0].iterations[lastIterationIdx] = d[1]
        }
        return d[0]
      }),
    ) as Observable<Project>;
  }

  public deleteProject( id: number ): Observable<Project> {
    return this.http.delete<any>(`${REGISTRY_URL}project/id/${id}`)
      .pipe(
        tap(_ => console.log('deleting project..')),
        catchError(this.handleError<any>('deleteProject'))
        );
  }

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

  public setCurrentProject(project: Project): void {
    window.localStorage.setItem('currentProject', JSON.stringify(project));
    this.currentProject = project;
  }

  public getCurrentProject(): Project {
    if (this.currentProject.id === 0)
    {
      const currentProjectString = window.localStorage.getItem('currentProject');
      if (currentProjectString != null) {
        return JSON.parse(currentProjectString);
      }
    }
    return this.currentProject;
  }
}
