import { Component, OnInit } from '@angular/core';
import { IterationService } from 'src/app/service/iteration.service';
import { LoginServiceService } from 'src/app/service/login-service.service';
import { PhaseService } from 'src/app/service/phase.service';
import { ProjectTagManagementService } from 'src/app/service/project-tag-management.service';
import { TagService } from 'src/app/service/tag.service';
import { ProjectService } from 'src/app/service/project.service';
import { ViewProjectService } from 'src/app/service/view-project.service';

@Component({
  selector: 'app-test-services',
  templateUrl: './test-services.component.html',
  styleUrls: ['./test-services.component.css']
})
export class TestServicesComponent implements OnInit {

  constructor(
    private iServ: IterationService,
    private loginServ: LoginServiceService,
    private PhaseServ: PhaseService,
    private PTServ: ProjectService,
    private TServ : TagService,
    private VPServ : ViewProjectService,
    private ProjectServ : ProjectService 
  ) { }

  ngOnInit(): void {
    
  }
  id?:number



  //////////// Connecting IterationServices
  getIterationById(e:any){
    console.log(this.id);
    this.id? this.iServ.getIterationById(this.id).subscribe( i => console.log(i) ) : console.log("non id provided");
  }
  getIterations(e:any){
    console.log(e);
    this.iServ.getAllIterations().subscribe( i => console.log(i) )
  }
  
  createIteration (e:any){
    console.log("create")
  }
  updateIteration (e:any){
    console.log("update")
  }
  deleteIteration (e:any){
    console.log("delete")
  }


  //////////// Connecting PhaseServices

  getAllPhases(e:any){
    this.PhaseServ.getAllPhases().subscribe(p => console.log(p) );
  }

  getPhaseById(e:any){
    console.log(this.id);
    this.id? this.PhaseServ.getPhaseById(this.id).subscribe(p => console.log(p) ) : console.log("non id provided");
  }

  /////////// Connecting TagServices

  getAllTags(e:any){
    this.TServ.getAllTags().subscribe(p => console.log(p) );
  }

  getTagById(e:any){
    console.log(this.id);
    this.id? this.TServ.getTagById(this.id).subscribe(p => console.log(p) ) : console.log("non id provided");
  }

  createTag (e:any){
    console.log("create")
  }

  /////////// Connecting View Project Services

  getProjectById(e:any){
    console.log(this.id);
    this.id? this.VPServ.getProjectById(this.id).subscribe( i => console.log(i) ) : console.log("non id provided");
  }
  getProjects(e:any){
    console.log(e);
    this.VPServ.getAllProjects().subscribe( i => console.log(i) )
  }
  
  createProject (e:any){
    console.log("create")
  }
  updateProject (e:any){
    console.log("update")
  }
  deleteProject (e:any){
    console.log("delete")
  }
}
