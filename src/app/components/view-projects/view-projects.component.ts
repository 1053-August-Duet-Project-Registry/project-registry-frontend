import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ConditionalExpr } from '@angular/compiler';
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
import { Phase } from 'src/app/models/phase.models';
import { Status } from 'src/app/models/status.model';
import { Tag } from 'src/app/models/tag.model';
import { IterationService } from 'src/app/service/iteration.service';
import { ProjectService } from 'src/app/service/project.service';
import { ViewProjectService } from 'src/app/service/view-project.service';
import { StatusService } from 'src/app/service/status.service';
import { TagService } from 'src/app/service/tag.service';
import { Project } from '../../models/project.model';
import { LoginServiceService } from '../../service/login-service.service';
import { PhaseService } from '../../service/phase.service';

export interface statusFilter { }

@Component({
  selector: 'app-view-projects',
  templateUrl: './view-projects.component.html',
  styleUrls: ['./view-projects.component.css'],
})
export class ViewProjectsComponent implements OnInit {


  constructor(private viewProjectService: ViewProjectService, private projectService: ProjectService,
              private iterationService: IterationService, private route: Router, private location: Location, private statusService: StatusService, private tagService: TagService, 
              private loginService: LoginServiceService, private phaseService: PhaseService) {

    let numberOfTimesAround = 0;
    route.events.subscribe(val => {
      if (location.path() === '/project-detail' && numberOfTimesAround < 1) {
        console.log('running');
        this.getProjects();
        numberOfTimesAround++;
      }
    });
  }
  public projects: Project[] = [];
  public filteredProjects: Project[] = [];
  public tag: Tag[] = [];
  public status: string[] = []; // should be statuses.....cmon guys
  public owners: string[] = [];
  public filteredOwners: Project[] = [];
  public statuses: Status[] = [] //added statuses to pull all statuses from backend
  public filteredTags: Project[] = [];
  public filteredPhase: Project[] = [];
  public filteredStatuses: Project[] = []; // should be more descriptive: projectsFilteredByStatus:
  public phase: Phase[] = [];

  public dataSource: MatTableDataSource<Project> = new MatTableDataSource; // source of data for the material based component: table
  public hardcodeStatuses: string[] = [];
  public tagSelected: string | undefined | null;
  public phaseSelected: string | undefined | null;
  public ownerSelected: string | undefined | null;
  
  public statusSelected = 'noStatus';



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

  sendBatch?: BatchTemplate;
  allIterations: Iteration[] = [];
  sub: Subscription = new Subscription();
  iteration?: Iteration;
  allBatches?: BatchTemplate[];
  selectedBatch?: string;
  filteredByIteration?: Project[];
  iterationSuccess?: string;
  iterationError?: string;
  

  changeBatch(value: BatchTemplate): void {
    this.sendBatch = value as BatchTemplate;
  }

  getBatches(): void {
    this.iterationService.getBatchServiceMock()
      .subscribe((data: BatchTemplate[] | undefined) => this.allBatches = data);
  }

  getIteration(): void {
    console.log('all iteration');
    this.iterationService.getIteration().subscribe((iteration: Iteration[]) => {
      this.allIterations = iteration;
    });


  }

  sendIteration(row: Project): void {
    if (this.sendBatch) {
      // TODO add phase to last param instead of null
      this.iteration = new Iteration(this.sendBatch.batchId, row as Project, this.sendBatch.id,
        this.sendBatch.startDate, this.sendBatch.endDate, null);

      let haventIterate = true;
      for (const anIteration of this.allIterations) {
        if (anIteration.batchId === this.sendBatch.batchId) {
          haventIterate = false;
        }
      }

      // commented out doesn't work as is since there's no iterations to go off of
      // if (this.allIterations.length > 0) {
      //   for (let i = 0; i < this.allIterations.length; i++) {
      //     let projects: Project = this.allIterations[i].project as Project
      //     console.log(row.id, projects.id, this.sendBatch.batchId, this.allIterations[i].batchId, this.allIterations.length)
      //     if (row.id != projects.id && this.sendBatch.batchId == this.allIterations[i].batchId) {

      //       this.iterationService.sendIteration(this.iteration)
      //       .subscribe((data: { project: { name: string; owner: { username: string; }; };
      //       startDate: any; batchId: any; }) => this.iterationSuccess =
      //       `Successfully iterate project ${data.project?.name.toUpperCase()} of ${data.project?.owner.username.toUpperCase()}
      //       to batch ${data.startDate} ${data.batchId}`);
      //       this.getIteration()
      //       this.selectedBatch = this.sendBatch.batchId
      //       this.iterationError = ''
      //       break;

      //     } else {
      //       if (haventIterate == true) {
      //         this.iterationService.sendIteration(this.iteration)
      //         .subscribe((data: { project: { name: string; owner: { username: string; }; };
      //         startDate: any; batchId: any; }) => this.iterationSuccess =
      //         `Successfully iterate project ${data.project?.name.toUpperCase()} of ${data.project?.owner.username.toUpperCase()}
      //         to batch ${data.startDate} ${data.batchId}`);
      //         this.getIteration()
      //         this.iterationError = ''
      //         break;
      //       } else {
      //         haventIterate = this.allIterations[i].batchId == this.sendBatch.batchId
      //         console.log("same id same batch")
      //         this.iterationSuccess = ''
      //         this.iterationError = `Project ${row.name.toUpperCase()} had already been assigned to batch ${this.sendBatch.batchId}`;
      //         break;
      //       }
      //     }
      //   }
      // } else {
      //   this.iterationService.sendIteration(this.iteration)
      //   .subscribe((data: { project: { name: string; owner: { username: string; }; };
      //   startDate: any; batchId: any; }) => this.iterationSuccess =
      //   `Successfully iterate project ${data.project?.name.toUpperCase()} of ${data.project?.owner.username.toUpperCase()}
      //   to batch ${data.startDate} ${data.batchId}`);
      //   this.getIteration()
      //   console.log("first time")

      // }


    }
  }

  filterIteration(event: MatSelectChange): void {
    if (this.allIterations && this.allIterations.length > 0) {
      const filtered: Project[] = [];

      for (const iteration of this.allIterations) {
        if (iteration.batchId === event.value) {
          filtered.push(iteration.project as Project);
        }
      }
      this.dataSource = new MatTableDataSource(filtered);
    }
  }


  ngOnInit(): void {


    // Check if user is logged in, otherwise redirect.
    if (! this.loginService.checkSessionLogin()) {
      this.route.navigate(['/homepage-login']);
    }

    this.getProjectsInit();

    this.getProjectTags();
    this.getProjectOwners();
    this.getAllStatuses();
    //this.getAllProjectStatuses();

    this.getPhases();

    /*
    * commented out other functions since they eventually call on filterResults which breaks table
    */
    
    // mattabledataasource determines what goes in table on page/ functions put project data into datasource
    this.dataSource = new MatTableDataSource(this.projects); // want to send in a filtered group

    // console.log("ngOnInit projects: " + this.projects);
    // perhaps a different method?

  }

  /*ngAfterViewInit() {
    // this.getProjects();
    // this.getProjectTags();
    // this.getProjectPhase();
    // this.getProjectStatus();
    // this.dataSource = new MatTableDataSource(this.projects);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }*/

  ngOnChanges(): void {
    this.filterProjectsByStatus();

  }
  // Filter the columns
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  // returns all the projects in DB
  public getProjectsInit(): void {
    /*
    * This code is to get the projects from localhost:8085
    */
    this.viewProjectService.GetAllProjects().subscribe((report: any) => {
       this.projects = report as Project[];
      //changed this to make sure if any functions use report data it would get the project mock data
      report as Project[];
      report = this.projects;
      this.dataSource.data = this.projects;
    });
  }

  public getProjects(): void {
    console.log('getProjects method: ');
    this.viewProjectService.GetAllProjects().subscribe((report: any) => {

      this.projects = report as Project[];

      this.dataSource.data = this.projects;
    });
  }

  // return all tags from db
  getProjectTags(): void {
    this.viewProjectService
      .GetAllProjectTags()
      .subscribe((data: Tag[]) => (this.tag = data));
  }
  getProjectOwners(): void 
  {
    this.viewProjectService.GetAllProjects().subscribe( (data : any ) => {
      data.forEach((element: any) => {
        if(!this.owners.includes(element.owner.username))
            this.owners.push(element.owner.username);
      });
    }) 
  }

  //get all tags from backend
  getTags(): void {
    this.tagService.getAllTags().subscribe((data: Tag[]) => {
      this.tag = data;
      console.log(this.tag);
    })
    // his.statusService.getAllStatus().subscribe((data: Status[]) => {
    //   this.statuses = data;
    //   console.log(this.statuses)
  }

  // return all phase from db
  getProjectPhase(): void {
    this.viewProjectService
      .GetAllProjectPhase()
      .subscribe((data: Phase[]) => {
        (this.phase = data);
      });
  }

  // get all phases from backend
  getPhases(): void {
    this.phaseService.getAllPhases().subscribe((data: Phase[]) => {
      this.phase = data;
      console.log(this.phase)
    })
  }

  // grabs all of the statuses
  getAllStatuses(): void {
    this.viewProjectService.getAllStatuses()
      .subscribe((data: any) => {
        for (const d of data) {
          this.status.push(d.name);
        }
      });

      console.log(this.status);

  }

  //gets all statuses from backend
  getAllProjectStatuses(): void {
    this.statusService.getAllStatus().subscribe((data: Status[]) => {
      this.statuses = data;
      console.log(this.statuses)
    })
  }

  getProjectStatus(): void {
    this.dataSource.data.forEach((project: Project) => {
      if (!this.status.includes(project.status.name)) {
        this.status.push(project.status.name);
      }
    });
  }


  filterProjectsByOwners(event: MatSelectChange) 
  {
    console.log(this.ownerSelected);
    if (this.ownerSelected=== 'noOwner') {
      this.getProjects();
    }
    else  {
        this.filteredOwners = [];
      for (const i of this.projects) {
          if (i.owner.username === this.ownerSelected) {
            this.filteredOwners.push(i);
        }
      }
    }
    this.filterResults();
    console.log(this.filteredOwners);
  }
  // this function filters by status correctly, if disabled filtering status doesn't work
  filterProjectsByStatus(): void {
    console.log(this.statusSelected);

    if (this.statusSelected === 'noStatus') {
      this.getProjects();
    } else {
      this.filteredStatuses = [];

      // finds projects with status name the same as selected status
      for (const project of this.projects) {
        if (project.status.name === this.statusSelected) {
          this.filteredStatuses.push(project);
        }
      }
    }
    console.log(this.filteredStatuses);
  }

  filterStatus(event?: MatSelectChange): void {
    this.filterProjectsByStatus();
    this.filterResults();
  }

  filterTag(event: MatSelectChange): void {
    if (this.tagSelected === 'noTag') {
      this.getProjectsInit();
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
    this.filterResults();

    // temp to make sure tag filtering works
    //this.dataSource = new MatTableDataSource(this.filteredProjects); // want to send in a filtered group
  }

  filterPhase(event: MatSelectChange): void {
    if (this.phaseSelected === 'noPhase') {
      this.filteredProjects = this.dataSource.data;
    } else {
      this.filteredPhase = [];
      for (const i of this.projects) {
       // finds projects with status name the same as selected status
        // if (i.iterations[0]?.phase.kind === this.phaseSelected) {
        //   this.filteredPhase.push(i);
        // }
      }
    }
    this.filterResults();
  }

  // function that causes issues with filtering, anything that hits this will fail atm
  filterResults(): void {
    let temp: Project[] = [];
    if (
      this.tagSelected != null &&
      this.statusSelected !== '' &&
      this.tagSelected !== 'noTag' &&
      this.statusSelected !== 'noStatus'
    ) {
      temp = this.filteredTags.filter((x) => this.filteredStatuses.includes(x));
    } else if (this.tagSelected != null && this.tagSelected !== 'noTag') {
      temp = this.filteredTags;
    } else if (this.ownerSelected != null && this.ownerSelected != 'noOwner') {
      temp = this.filteredOwners;
    }else if (
      this.statusSelected !== '' &&
      this.statusSelected !== 'noStatus'
    ) {
      temp = this.filteredStatuses;
    } else {
      temp = this.dataSource.data;
    }

    if (this.phaseSelected != null && this.phaseSelected !== 'noStatus') {
      this.dataSource = new MatTableDataSource(
        this.filteredPhase.filter((x) => temp.includes(x))
      );
    }
    else {
      this.dataSource = new MatTableDataSource(temp);
    }
  }

  reset(): void {
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
  rowClicked(projectId: number): void {
    let currentProject: Project | undefined;
    if (projectId) {
      currentProject = this.dataSource.data.find(p => p.id === projectId);
    }

    if (currentProject !== undefined) {
      this.projectService.setCurrentProject(currentProject);
    }
    // TODO do something with this promise, most likely navigate to the appropriate project page.
    this.route.navigateByUrl('project-detail');
  }

  
}