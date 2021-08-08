import { Phase } from "./phase.models";
import { Status } from "./status.model";
import { Tag } from "./tag.model";
import { User } from "./user.model";

export class Project{
    id: number;
    name: string;
    status:Status;
    description: string;
    owner: User;
    tags: Tag[];

    constructor(id:number, name:string, status:Status, description:string, owner:User, tags:Tag[]){
        this.id = id;
        this.name = name;
        this.status = status;
        this.description = description
        this.owner = owner;
        this.tags = tags;
    }

}
