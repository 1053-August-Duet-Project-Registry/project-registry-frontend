import { BatchTemplate } from './../../models/batch.model';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IterationService } from 'src/app/service/iteration.service';
import { forkJoin, Subscription } from 'rxjs';
import { Iteration } from 'src/app/models/iteration.model';
import { Project } from 'src/app/models/project.model';

@Component({
  selector: 'app-iteration',
  templateUrl: './iteration.component.html',
  styleUrls: ['./iteration.component.css']
})
export class IterationComponent implements OnInit, OnDestroy {

  // array of batchTemplates to put the 2 batch IDs into
  theBatches: BatchTemplate[] = [];

  sub: Subscription = new Subscription(); // just for clean up memory purpose

  // Send data to the parent component
  @Output() sendBatch: EventEmitter<BatchTemplate> = new EventEmitter<BatchTemplate>();

  // Don't change this string value, it connected to the logic, the app will throw err.
  // It's a placeholder/ first value for the selectBatch option
  seletedIdAndBatchId = 'Batches';
constructor(private iterationService: IterationService) { }

ngOnInit(): void {
  this.httpGet();
}

// Clean up memory
ngOnDestroy(): void{
  this.sub.unsubscribe();
}

selectBatch(){
  // skip placeholder value
  if (this.seletedIdAndBatchId !== 'Batches'){
    const separateBatchAndId = this.seletedIdAndBatchId.split('|');
    // id:number, batchId: string, skill:string,location:string, startDate:string, endDate:string
    this.sendBatch.emit(new BatchTemplate(Number(separateBatchAndId[0]), separateBatchAndId[1], '', '',
      separateBatchAndId[2], separateBatchAndId[3]));

  }
}

  // make a call to the API to retrieve all batches
  httpGet(){
    // this.http.get(environment.gameDealApi+ "?id=" + i)
      this.sub = this.iterationService.getBatchServiceMock().subscribe(batches => this.theBatches = batches);
    /*let a;
      forkJoin([this.iterationService.getBatchServiceMock(), this.iterationService.getBatchService()]).subscribe(data => {
        //this.theBatches = data as batchTemplate[] // cast t
        a =  ([] as batchTemplate[]).concat(...data);
        console.log("dsdsd get", a )
      })  */
  }

}
