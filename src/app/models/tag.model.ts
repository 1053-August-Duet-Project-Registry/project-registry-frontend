export class Tag {
    id: number;
    name: string;
    description: string;
    enabled: boolean;

<<<<<<< HEAD
    constructor(id:number, name:string, description:string, enabled : boolean){
=======
    constructor(id: number, name: string, description: string){
>>>>>>> 65761c9f30f3488d46c8c10b1cef60a2424b8676
        this.id = id;
        this.name = name;
        this.description = description;
        this.enabled = enabled;
    }
}
