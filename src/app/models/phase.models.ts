export class Phase {
  id: number;
  kind:string;
  description: string;

  constructor(id:number, kind:string, description:string){
      this.id = id;
      this.kind=kind;
      this.description = description;
  }
}
