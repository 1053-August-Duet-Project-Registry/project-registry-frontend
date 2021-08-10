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
  getIterationById(e:any){
    console.log(this.id);
  }
  getIteration(e:any){
    console.log(e);
    this.iServ.getIteration().subscribe( i => console.log(i) )
  }


}
