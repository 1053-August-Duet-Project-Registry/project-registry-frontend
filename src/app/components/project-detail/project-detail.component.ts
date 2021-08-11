import { Observable } from 'rxjs';
import { ProjectService } from 'src/app/service/project.service';
import { Project } from 'src/app/models/project.model';
import { ViewProjectService } from './../../service/view-project.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Iteration } from '../../models/iteration.model';

import { Status } from 'src/app/models/status.model';
import { User } from 'src/app/models/user.model';
import { Role } from 'src/app/models/role.model';
import { batchTemplate } from 'src/app/models/batch.model';

import { IterationService } from 'src/app/service/iteration.service';
import { Phase } from 'src/app/models/phase';
import { PhaseService } from 'src/app/service/phase.service';
import { ViewProjectsComponent } from '../view-projects/view-projects.component';
import { Location } from '@angular/common';
import {Tag} from "../../models/tag.model"
import { ProjectTagManagementService } from 'src/app/service/project-tag-management.service';





@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})




export class ProjectDetailComponent implements OnInit {

   arr!:Tag[];

  constructor(
              public data: ProjectTagManagementService,
              private viewProjectService:ViewProjectService,
              private projectService:ProjectService,

              private router:ActivatedRoute,
              private route: Router,
              private location: Location,
              private phaseService: PhaseService) { }


  //In future link to status table?
  public statusMap:Record<string, number>={
    IN_ITERATION:1,
    CODE_FREEZE:2,
    CODE_REVIEW:3,
    NEEDS_CLEANUP:4,
    READY_FOR_ITERATION:5,
    ACTIVE:6,
    NEEDS_ATTENTION:7,
    ARCHIVED:8,
  };


  public statuses = ['ACTIVE', 'NEEDS_ATTENTION', 'ARCHIVED', 'CODE_REVIEW'];
  public phases = ['BACKLOG_GENERATED', 'TRAINER_APPROVED', 'HANDOFF_SCHEDULED', 'RESOURCE_ALLOCATION', 'CHECKPOINT_MEETING', 'CODE_REVIEW','COMPLETE']



  //Temporary model
  model = new Project(1, "name", new Status(1, "name", "desc"), "sample desc", new User(1, "username", new Role(1, "string")), [], new Phase(1, "BACKLOG_GENERATED", "CoE has completed the iterations backlog, awaiting trainer approval"));

  submitted = false;

  onSubmit() { this.submitted = true; }

  //needed?
  // submitted = false;
  // onSubmit() { this.submitted = true; }



  // ----------- Group5 Iterator: Passing batch to detail-project
  sendBatch ?: batchTemplate;
  iteration?: Iteration ;
  tempIteration?: Iteration ;



  // set emit event value to batchIdNum and batchBatchIdStr
  // CHECK CONSOLE FOR ID AND BATCHID

  changeBatch(value:batchTemplate){
    this.sendBatch = value;
    console.log(this.sendBatch);
  }

  // ------------ end Group5 Iterator: Passing batch to view-projec


                            //change to this once project is connected
  public desiredId:number=1 //this.router.snapshot.params['id'];
  public projects?:Project[]=[]

  // Group 5: accidently mess up and forget what it used to be. So we put ?
  public project?:Project ;



  ngOnInit(): void {

    this.data.currentTagArray.subscribe(arr => this.arr = arr);

    this.phaseService.getPhases();
    this.project = this.projectService.getCurrentProject();
    if(this.project.id==0){
      this.route.navigate([''])
    }
    console.log(this.project);
    console.log(this.arr);
  }

  //Update Project in the backend
  public submit():void{

    // Team5 space
    //batchId:String, batchProject:Project, id: String, startDate: string, endDate: string
    if (this.sendBatch && this.project){
      this.iteration = new Iteration(this.sendBatch.batchId, this.project, this.sendBatch.id, this.sendBatch.startDate, this.sendBatch.endDate);
      console.log(this.iteration);

    }

    // -- End team5 space

    //Check that button is connected

    //console.log("submit");

    if (this.project){

      //Setting the status id
      this.project.status.id=this.statusMap[this.project.status.name];
      console.log(`status sending: ${this.project.status.name}`);

      if(this.project != undefined)
      {
        console.log(this.project.phase.kind)
        var phaseFound = this.phaseService.phases.find(p=>{
          console.log(p);
          console.log(p.kind)
          if(this.project){

            return p.kind==this.project.phase.kind
          }
          else {
            return false
          }
        });
        console.log(phaseFound)
        if(phaseFound!=undefined)
          this.project.phase = phaseFound;
      }
      //check TS updates
      //this.project.name="rideForceTest";

      this.project.tags = this.arr;

      this.projectService.updateProject(this.project).subscribe((data)=>{
        this.project=data;
        console.log(data)
        this.route.navigate(['viewProject']);
      });
    }
    //
    // window.location.href = "http://localhost:4200/";
  }

  goBack():void {
    this.location.back()
  }

}
