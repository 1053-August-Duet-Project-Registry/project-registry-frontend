import { Project } from './project.model';
import { Repository } from './repository.model';

export class Organization {
    id: number;
    name: string;
    project: Project;
    repositories?: Repository[];

    constructor( id: number, name: string, project: Project, repositories: Repository[]){
        this.id = id;
        this.name = name;
        this.project = project;
        this.repositories = repositories;
    }
}
