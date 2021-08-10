import { Component, OnInit } from '@angular/core';
import { StatusService } from 'src/app/service/status.service';
import { Status } from 'src/app/models/status.model'

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  constructor(private viewStatusService: StatusService) { 

  }
public statuses: Status[] = [];

  ngOnInit(): void {
    // disappears without this console.log? don't remove for now
    console.log(this.getProjectStatus());
    this.getProjectStatus
  }

  public getProjectStatus() {
    this.viewStatusService.getStatus().subscribe(statuses => this.statuses = statuses);
  }

}
