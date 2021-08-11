import { User } from '../user.model';
import { Tag } from '../tag.model';
import { Status } from '../status.model';

export class ProjectDTO {
    name: string;
    status: Status;
    description: string;
    owner: User;
    tags: Tag[];

    constructor(name: string, status: Status, description: string, owner: User, tags: Tag[]){
        this.name = name;
        this.status = status;
        this.description = description;
        this.owner = owner;
        this.tags = tags;
    }
}
