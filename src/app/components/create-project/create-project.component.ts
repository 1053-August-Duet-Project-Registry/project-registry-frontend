import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Phase } from 'src/app/models/phase.models';
import { Project } from 'src/app/models/project.model';
import { ProjectDTO } from 'src/app/models/DTO/project-dto.model';
import { Role } from 'src/app/models/role.model';
import { Status } from 'src/app/models/status.model';
import { Tag } from 'src/app/models/tag.model';
import { User } from 'src/app/models/user.model';
import { ProjectService } from 'src/app/service/project.service';
import { LoginServiceService } from 'src/app/service/login-service.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})

export class CreateProjectComponent implements OnInit {
 public newProject: ProjectDTO = new ProjectDTO ('',
    new Status(1, 'IN_ITERATION'), '',
    new User(1, 'william', new Role(1, 'admin')),
    [new Tag(-4, 'GIT', 'This project used GIT', true)]);
  public projectName = '';
  public projectDescription = '';


  public errorDetected = false;
  constructor(public projectService: ProjectService,
              private route: Router, public loginService: LoginServiceService) { }

  ngOnInit(): void {
    // Check if user is logged in, otherwise redirect.
    if (!this.loginService.checkSessionLogin()) {
      this.route.navigate(['/homepage-login']);
    }
  }

  public registerProject(): void {
    this.newProject.name = this.projectName;
    this.newProject.description = this.projectDescription;
    console.log(this.newProject);
    this.projectService.createProject(this.newProject)
      .subscribe(project => {
        if (project.name === this.projectName){
          this.projectService.setCurrentProject(project);
          console.log('It someone problem!');
          this.route.navigate(['/project-detail']);
          this.errorDetected = false;
        }
        else {
          this.errorDetected = true;
          const errorElement = document.getElementById('errorText');
          if (errorElement){
            errorElement.innerHTML = 'An error Occurred';
          }
        }
      });
  }

}
