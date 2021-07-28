import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BatchTemplate } from 'src/app/models/batch.model';
import { Iteration } from 'src/app/models/iteration.model';
import { Phase } from 'src/app/models/phase';
import { Tag } from 'src/app/models/tag.model';
import { IterationService } from 'src/app/service/iteration.service';
import { ProjectService } from 'src/app/service/project.service';
import { ViewProjectService } from 'src/app/service/view-project.service';
import { Project } from '../../models/project.model';

export interface statusFilter { }

@Component({
  selector: 'app-view-projects',
  templateUrl: './view-projects.component.html',
  styleUrls: ['./view-projects.component.css'],
})
export class ViewProjectsComponent implements OnInit {

  // --------------------  End Group5 Iterator: Passing batch to detail-project --------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------


  constructor(private viewProjectService: ViewProjectService, private projectService: ProjectService, private iterationService: IterationService, private route: Router, private location: Location) {
    let numberOfTimesAround = 0;
    route.events.subscribe(val => {
      if (location.path() == '/project-detail' && numberOfTimesAround < 1) {
        console.log('running');
        this.getProjects();
        numberOfTimesAround++;
      }
    });

  }
  public projects: Project[] = []; // will be used by dataSource for the table
  public filteredProjects: Project[] = [];
  public tag: Tag[] = [];
  public status: string[] = []; // should be statuses.....cmon guys
  public filteredTags: Project[] = [];
  public filteredPhase: Project[] = [];
  public filteredStatuses: Project[] = []; // should be more descriptive: projectsFilteredByStatus:
  public phase: Phase[] = [];
  public dataSource: MatTableDataSource<Project> | any; // source of data for the material based component: table

  public tagSelected: null;
  public phaseSelected: null;
  public statusSelected = 'ACTIVE';

  // based on project.model.ts
  displayedColumns: string[] = [
    'id',
    'name',
    'status',
    'phase',
    'description',
    'owner',
    'tags',
    'iteration'
  ];

  @ViewChild(MatSort) sort: MatSort | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  // ----------------------------------------------------------------------------------------------------------------------------------
  // --------------------  Group5 Iterator: Passing batch to detail-project -----------------------------------------------------------
  sendBatch?: BatchTemplate;
  allIterations: Iteration[] = [];
  sub: Subscription = new Subscription();
  iteration?: Iteration;
  allBatches?: BatchTemplate[];
  selectedBatch?: string;
  filteredByIteration?: Project[];
  // message
  iterationSuccess?: string;
  iterationError?: string;

  static getProjectsStatic() {
  }

  changeBatch(value: BatchTemplate) {
    this.sendBatch = value as BatchTemplate;
    console.log(this.sendBatch);
  }

  getBatches() {
    this.iterationService.getBatchServiceMock().subscribe(data => this.allBatches = data);
  }

  getIteration() {
    console.log('all iteration');
    this.iterationService.getIteration().subscribe(iteration => {
      this.allIterations = iteration;
      console.log('all', this.allIterations);
    });

  }

  sendIteration(row: Project) {
    if (this.sendBatch) {
      console.log(this.sendBatch);
      this.iteration = new Iteration(this.sendBatch.batchId, row as Project, this.sendBatch.id, this.sendBatch.startDate, this.sendBatch.endDate);

      let haventIterate: Boolean = true;
      for (let i = 0; i < this.allIterations.length; i++) {
        if (this.allIterations[i].batchId == this.sendBatch.batchId) {
          haventIterate = false;
        }
      }

      if (this.allIterations.length > 0) {
        for (let i = 0; i < this.allIterations.length; i++) {
          const projects: Project = this.allIterations[i].project as Project;
          console.log(row.id, projects.id, this.sendBatch.batchId, this.allIterations[i].batchId, this.allIterations.length);
          if (row.id != projects.id && this.sendBatch.batchId == this.allIterations[i].batchId) {

            this.iterationService.sendIteration(this.iteration).subscribe(data => this.iterationSuccess = `Successfully iterate project ${data.project?.name.toUpperCase()} of ${data.project?.owner.username.toUpperCase()} to batch ${data.startDate} ${data.batchId}`);
            this.getIteration();
            this.selectedBatch = this.sendBatch.batchId;
            this.iterationError = '';
            break;

          } else {
            if (haventIterate == true) {
              this.iterationService.sendIteration(this.iteration).subscribe(data => this.iterationSuccess = `Successfully iterate project ${data.project?.name.toUpperCase()} of ${data.project?.owner.username.toUpperCase()} to batch ${data.startDate} ${data.batchId}`);
              this.getIteration();
              this.iterationError = '';
              break;
            } else {
              haventIterate = this.allIterations[i].batchId == this.sendBatch.batchId;
              console.log('same id same batch');
              this.iterationSuccess = '';
              this.iterationError = `Project ${row.name.toUpperCase()} had already been assigned to batch ${this.sendBatch.batchId}`;
              break;
            }
          }
        }
      } else {
        this.iterationService.sendIteration(this.iteration).subscribe(data => this.iterationSuccess = `Successfully iterate project ${data.project?.name.toUpperCase()} of ${data.project?.owner.username.toUpperCase()} to batch ${data.startDate} ${data.batchId}`);
        this.getIteration();
        console.log('first time');

      }

    }
  }

  filterIteration(event: MatSelectChange): void {
    console.log('FilterIteration method: (event.value): ' + event.value);

    if (this.allIterations && this.allIterations.length > 0) {
      const filtered: Project[] = [];

      for (let i = 0; i < this.allIterations.length; i++) {
        if (this.allIterations[i].batchId == event.value) {
          filtered.push(this.allIterations[i].project as Project);
          console.log('itera', this.allIterations[i].project as Project);
        }
      }
      console.log('iteration project', filtered);
      this.dataSource = new MatTableDataSource(filtered);
    } else { console.log('error: no iterators receive from the database'); }

  }

  ngOnInit(): void {
    // console.log("onInIt");
    // console.log("ngOnInit selected Status: " + this.statusSelected);
    this.getProjectsInit();
    this.getProjectTags();
    this.getProjectPhase();
    // this.getProjectStatus();
    this.getAllStatuses();
    this.getIteration(); // group 5 getIteration, save them to allBatches (a seperate Iteration class without project object)
    this.getBatches();

    this.filterStatus();
    this.dataSource = new MatTableDataSource(this.projects); // want to send in a filtered group
    // console.log("ngOnInit projects: " + this.projects);
    // perhaps a different method?
  }


  ngAfterViewInit() {
    // this.getProjects();
    // this.getProjectTags();
    // this.getProjectPhase();
    // this.getProjectStatus();
    this.dataSource = new MatTableDataSource(this.projects);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Filter the columns
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // todo add all filters, chain with if

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // returns all the projects in DB
  public getProjectsInit(): void {
    console.log('getProjects method: ');
    this.viewProjectService.GetAllProjects().subscribe((report) => {
      this.projects = report as Project[];
      // console.log("this.projects =");
      // console.log(this.projects);

      this.dataSource.data = this.projects.filter(p => p.status.name == 'ACTIVE');
      // console.log("datasource: ");
      // console.log(this.dataSource.data);
    });
  }

  public getProjects(): void {
    console.log('getProjects method: ');
    this.viewProjectService.GetAllProjects().subscribe((report) => {
      this.projects = report as Project[];
      // console.log("this.projects =");
      // console.log(this.projects);

      this.dataSource.data = this.projects;
      // console.log("datasource: ");
      // console.log(this.dataSource.data);
    });
  }

  // return all tags from db
  getProjectTags(): void {
    this.viewProjectService
      .GetAllProjectTags()
      .subscribe((data) => (this.tag = data));
    console.log(this.tag);
  }

  // return all phase from db
  getProjectPhase(): void {
    this.viewProjectService
      .GetAllProjectPhase()
      .subscribe((data) => {
        (this.phase = data);
        console.log(this.phase);
      });
  }

  // grabs all of the statuses
  getAllStatuses(): void {
    this.viewProjectService.getAllStatuses()
      .subscribe((data) => {
        for (const d of data) {
          this.status.push(d.name);
        }
        console.log('getAllStatuses Method: ');
        console.log(this.status);
      });
  }

  getProjectStatus(): void {
    this.viewProjectService.GetAllProjectStatus().subscribe((data) => {
      this.projects = data;
      this.projects.forEach((project) => {
        console.log(project.status.name);

        if (!this.status.includes(project.status.name)) {
          this.status.push(project.status.name);
        }
      });
      console.log(this.status);
    });
  }

  filterProjectsByStatus() {
    if (this.statusSelected === '') {
      this.filteredProjects = this.projects;
    } else {
      // grabbed projects array
      console.log(this.projects);
      this.filteredStatuses = []; // need more descriptive name here
      for (const project of this.projects) {
        // finds projects with status name the same as selected status
        console.log(project);

        if (project.status.name === this.statusSelected) {
          this.filteredStatuses.push(project);
        }
      }
    }
  }

  filterStatus(event?: MatSelectChange): void {
    // //grabbed changed status value
    // this.statusSelected = event.value;
    if (event) {
      console.log('Filter Status Method: (with event): ' + this.statusSelected);
      this.filterProjectsByStatus();
    } else {
      console.log('Filter Status Method: (w/o event): ' + this.statusSelected);
      this.filterProjectsByStatus();
    }

    this.filterResults();
  }

  // filterStatus(): void {
  //   // //grabbed changed status value
  //   //this.statusSelected = event.value;
  //   console.log("Filter Status Method: (with event): " + this.statusSelected);
  //   this.filterProjectsByStatus();
  //   this.filterResults();
  // }

  filterTag(event: MatSelectChange): void {
    // this.tagSelected = event.value;
    console.log(this.tagSelected);

    if (this.tagSelected === 'noTag') {
      this.filteredProjects = this.projects;
    } else {
      this.filteredTags = [];
      for (const i of this.projects) {
        for (const j of i.tags) {
          if (j.name === this.tagSelected) {
            this.filteredTags.push(i);
          }
        }
      }
    }
    console.log(this.filteredTags);
    this.filterResults();
  }

  filterPhase(event: MatSelectChange): void {
    console.log(this.phaseSelected);
    if (this.phaseSelected === 'noPhase') {
      this.filteredProjects = this.projects;
    } else {
      // grabbed projects array
      console.log(this.projects);
      this.filteredPhase = [];
      for (const i of this.projects) {
        // finds projects with status name the same as selected status
        console.log(i);
        if (i.phase.kind === this.phaseSelected) {
          this.filteredPhase.push(i);
        }
      }
    }
    this.filterResults();
  }

  filterResults(): void {
    let temp: Project[] = [];
    if (
      this.tagSelected != null &&
      this.statusSelected !== '' &&
      this.tagSelected !== 'noTag' &&
      this.statusSelected !== 'noStatus'
    ) {
      console.log('filterResults Method: (this.filteredTags): ' + this.filteredTags);
      temp = this.filteredTags.filter((x) => this.filteredStatuses.includes(x));
    } else if (this.tagSelected != null && this.tagSelected != 'noTag') {
      temp = this.filteredTags;
      console.log(this.dataSource);
    } else if (
      this.statusSelected !== '' &&
      this.statusSelected !== 'noStatus'
    ) {
      temp = this.filteredStatuses;
      console.log(this.dataSource);
    } else {
      temp = this.projects;
      console.log(this.dataSource);
    }

    if (this.phaseSelected != null && this.phaseSelected != 'noStatus') {
      this.dataSource = new MatTableDataSource(
        this.filteredPhase.filter((x) => temp.includes(x))
      );
    }
    else {
      this.dataSource = new MatTableDataSource(temp);
    }
  }

  reset() {
    console.log('Page resets');
    this.dataSource = new MatTableDataSource(this.projects);
    this.filteredProjects = [];
    this.filteredTags = [];
    this.filteredPhase = [];
    this.filteredStatuses = [];

    this.statusSelected = '';
    this.tagSelected = null;
    this.phaseSelected = null;
    this.selectedBatch = '';
  }

  // TODO this method is current non-functional.
  rowClicked(projectId: number) {
    let currentProject: Project | undefined;
    if (projectId) {
       currentProject = this.projects.find(p => p.id === projectId);
    }

    console.log(currentProject);
    if (currentProject !== undefined) {
      this.projectService.setCurrentProject(currentProject);
    }
    // TODO do something with this promise, most likely navigate to the appropriate project page.
    this.route.navigateByUrl('project-detail');
  }
}
