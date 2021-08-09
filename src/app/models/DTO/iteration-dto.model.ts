import { NumberFormatStyle } from "@angular/common";
import { Phase } from "../phase.models";
import { Project } from "../project.model";


export class IterationDTO {
    id: number;
    batchId: string;
    project?: Project;
    startDate: string;
    endDate: string;
    phase?: Phase
    

constructor(batchId:string, project:Project, id: number, startDate: string, endDate: string, phase: Phase) {
    this.batchId = batchId;
    this.project = project;
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
    this.phase = phase;
    }
}
