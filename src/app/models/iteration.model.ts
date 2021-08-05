import { NumberFormatStyle } from '@angular/common';
import { Project } from './project.model';

export class Iteration{
    id: number;
    batchId: string;
    project?: Project;
    startDate: string;
    endDate: string;


constructor(batchId: string, project: Project, id: number, startDate: string, endDate: string) {
    this.batchId = batchId;
    this.project = project;
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
    }
}

// Iteration model in the backend need: id, batchId, startDate, endDate

// Project model in the backend hasn't have a batch id yet. Project model used for Detail page
// group to submit which will needs a batchId, or batchBatchId.
