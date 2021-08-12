import { ProjectService } from 'src/app/service/project.service';
import { Project } from 'src/app/models/project.model';
import { ViewProjectService } from '../../service/view-project.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Iteration } from '../../models/iteration.model';
import { BatchTemplate } from 'src/app/models/batch.model';
import { PhaseService } from 'src/app/service/phase.service';
import { Location } from '@angular/common';
import { Tag } from '../../models/tag.model';
import { ProjectTagManagementService } from 'src/app/service/project-tag-management.service';
import {LoginServiceService} from '../../service/login-service.service';
import { StatusService } from 'src/app/service/status.service';
import { Status } from 'src/app/models/status.model';
import { Phase } from 'src/app/models/phase.models';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectDetailComponent implements OnInit {
  public desiredId = 1;
  public projects?: Project[] = [];

  public project?: Project;

  sendBatch?: BatchTemplate;
  iteration?: Iteration;

  constructor(
    public data: ProjectTagManagementService,
    private viewProjectService: ViewProjectService,
    private projectService: ProjectService,

    private router: ActivatedRoute,
    private route: Router,
    private location: Location,
    private phaseService: PhaseService,
    private statusService: StatusService,
    private loginService: LoginServiceService
  ) {}

  public statuses: Status[] = [];
  public phases: Phase[] = [];

  submitted = false;

  // TODO needs logic
  onSubmit(): void {
    this.submitted = true;
  }

  ngOnInit(): void {
    // Check if user is logged in, otherwise redirect.
    if (!this.loginService.checkSessionLogin()) {
      this.route.navigate(['/homepage-login']);
    }
    this.statusService.getAllStatus().subscribe((d) => {
      this.statuses = d;
    });
    this.phaseService.getAllPhases().subscribe((d) => {
      this.phases = d.map((k) => {
        delete (k as any)['iterations'];
        return k;
      });
    });
    this.project = this.projectService.getCurrentProject();
    if (this.project.id === 0) {
      this.route.navigate(['']);
    }
  }

  phaseChange(e: any) {
    if (!this.project?.iterations?.length) {
      return;
    }
    const idx = this.project?.iterations.length! - 1;
    this.project.iterations[idx].phase =
      this.phases.find((d) => {
        return d.id == e.target.value;
      }) || null;
  }

  statusChange(e: any) {
    if (!this.project) {
      return;
    }
    this.project.status = this.statuses.find((d) => {
      return d.id == e.target.value;
    })!;
  }

  // Update Project in the backend
  public submit(): void {
    if (!this.project) {
      return;
    }

    if (this.sendBatch) {
      // TODO change final parameter to a phase
      this.iteration = new Iteration(
        this.sendBatch.batchId,
        this.project,
        this.sendBatch.id,
        this.sendBatch.startDate,
        this.sendBatch.endDate,
        null
      );
    }
    this.projectService.updateProject(this.project).subscribe((data) => {
      this.project = data;
      this.route.navigate(['viewProject']);
    });
  }

  goBack(): void {
    this.location.back();
  }
}
