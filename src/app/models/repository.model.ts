import { Organization } from './organization.model';

export class Repository {
    id: number;
    name: string;
    url: string;
    organizaition: Organization ;
    constructor( id: number, name: string, url: string, organization: Organization){
        this.id = id ;
        this.name = name;
        this.url = url;
        this.organizaition = organization;
    }
}
