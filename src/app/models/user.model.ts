import { Role } from './role.model';

export class User {
    id: number;
    username: string;
    role: Role;

    constructor(id: number, username: string, role: Role){
        this.id = id;
        this.username = username;
        this.role = role;
    }
}
