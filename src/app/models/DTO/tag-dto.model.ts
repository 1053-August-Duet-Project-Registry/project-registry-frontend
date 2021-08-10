export class TagDTO {
    name: string;
    description : string;
    isEnable : boolean;
    constructor (name: string, description : string, isEnable : boolean){
        this.name =name;
        this.description =description;
        this.isEnable = isEnable;
    }
}
