import { Project } from "../project.model";
import { Repository } from "../repository.model";

export class OrganizaionDTO {
    id : number;
    name: string;
    project?: Project;
    repositopries?: Repository[];
    constructor ( id: number, name : string, project : Project, repositories : Repository[] ) {
        this.id =id;
        this.name = name;
        this.project = project;
        this.repositopries = repositories;
    }
}
