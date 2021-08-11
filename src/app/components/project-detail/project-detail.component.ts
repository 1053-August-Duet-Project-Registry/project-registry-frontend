import { Observable } from 'rxjs';
import { ProjectService } from 'src/app/service/project.service';
import { Project } from 'src/app/models/project.model';
import { ViewProjectService } from '../../service/view-project.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Iteration } from '../../models/iteration.model';

import { Status } from 'src/app/models/status.model';
import { User } from 'src/app/models/user.model';
import { Role } from 'src/app/models/role.model';
import { BatchTemplate } from 'src/app/models/batch.model';

import { IterationService } from 'src/app/service/iteration.service';
import { Phase } from 'src/app/models/phase.models';
import { PhaseService } from 'src/app/service/phase.service';
import { ViewProjectsComponent } from '../view-projects/view-projects.component';
import { Location } from '@angular/common';
import { Tag } from '../../models/tag.model';
import { ProjectTagManagementService } from 'src/app/service/project-tag-management.service';
import {LoginServiceService} from '../../service/login-service.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})

export class ProjectDetailComponent implements OnInit {

   arr!: Tag[];
  public desiredId = 1;
  public projects?: Project[] = [];

  public project?: Project;

  sendBatch?: BatchTemplate;
  iteration?: Iteration ;
  tempIteration?: Iteration ;

  constructor(
              public data: ProjectTagManagementService,
              private viewProjectService: ViewProjectService,
              private projectService: ProjectService,

              private router: ActivatedRoute,
              private route: Router,
              private location: Location,
              private phaseService: PhaseService,
              private loginService: LoginServiceService) { }


  // In future link to status table?
  public statusMap: Record<string, number> = {
    IN_ITERATION: 1,
    CODE_FREEZE: 2,
    CODE_REVIEW: 3,
    NEEDS_CLEANUP: 4,
    READY_FOR_ITERATION: 5,
    ACTIVE: 6,
    NEEDS_ATTENTION: 7,
    ARCHIVED: 8,
  };


  public statuses = ['ACTIVE', 'NEEDS_ATTENTION', 'ARCHIVED', 'CODE_REVIEW'];
  public phases = ['BACKLOG_GENERATED', 'TRAINER_APPROVED', 'HANDOFF_SCHEDULED',
    'RESOURCE_ALLOCATION', 'CHECKPOINT_MEETING', 'CODE_REVIEW', 'COMPLETE'];



  // Temporary model

  model = new Project(1,  'name', new Status(1, 'name'), 'sample desc',
    new User(1, 'username', new Role(1, 'string')), [], []);

  submitted = false;

  // needs logic
  onSubmit(): void { this.submitted = true; }

  changeBatch(value: BatchTemplate): void {
    this.sendBatch = value;
    console.log(this.sendBatch);
  }

  ngOnInit(): void {

    // Check if user is logged in, otherwise redirect.
    if (! this.loginService.checkSessionLogin()) {
      this.route.navigate(['/homepage-login']);
    }

    this.data.currentTagArray.subscribe(arr => this.arr = arr);

    this.phaseService.getPhases();
    this.project = this.projectService.getCurrentProject();
    if (this.project.id === 0){
      this.route.navigate(['']);
    }
  }

  // Update Project in the backend
  public submit(): void {
    if (!this.project){ return; }

    if (this.sendBatch){
      // TODO change final parameter to a phase
      this.iteration = new Iteration(this.sendBatch.batchId, this.project, this.sendBatch.id,
        this.sendBatch.startDate, this.sendBatch.endDate, null);
    }

    // Setting the status id
    this.project.status.id = this.statusMap[this.project.status.name];

    // umm idek
    // if (this.project !== undefined){
    //   const phaseFound = this.phaseService.phases.find(p => {
    //     if (!this.project){
    //       return false;
    //     }
    //   });
    //   if (phaseFound !== undefined) {
    //     this.project.iterations[this.project.iterations.length - 1].phase = phaseFound;
    //   }
    // }
    this.project.tags = this.arr;

    this.projectService.updateProject(this.project).subscribe((data) => {
      this.project = data;
      this.route.navigate(['viewProject']);
    });
  }

  goBack(): void {
    this.location.back();
  }

}
