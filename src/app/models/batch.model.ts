export class BatchTemplate {
  id: number;
  batchId: string;
  startDate: string;
  skill: string;
  location: string;
  endDate: string;

  constructor(id: number, batchId: string, skill: string, location: string, startDate: string, endDate: string){
      this.id = id;
      this.batchId = batchId;
      this.startDate = startDate;
      this.skill = skill;
      this.location = location;
      this.endDate = endDate;
  }
}
