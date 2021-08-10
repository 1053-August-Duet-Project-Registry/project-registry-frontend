import { User } from "../user.model";
import {Tag } from "../tag.model"

export class ProjectDTO {
    name : string;
    status : string;
    description : string;
    owner : User;
    tags: Tag[];
}
