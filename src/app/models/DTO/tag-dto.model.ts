export class TagDTO {
    name: string;
    description : string;
    isEnabled : boolean;
    constructor (name: string, description : string, isEnabled : boolean){
        this.name =name;
        this.description =description;
        this.isEnabled = isEnabled;
    }
}
