import { Phase } from './phase';
import { Status } from './status.model';
import { Tag } from './tag.model';
import { User } from './user.model';

export class Project{
    id: number;
    name: string;
    status: Status;
    description: string;
    owner: User;
    tags: Tag[];
    phase: Phase;

    constructor(id: number, name: string, status: Status, description: string, owner: User, tags: Tag[], phase: Phase){
        this.id = id;
        this.name = name;
        this.status = status;
        this.description = description;
        this.owner = owner;
        this.tags = tags;
        this.phase = phase;
    }

}
