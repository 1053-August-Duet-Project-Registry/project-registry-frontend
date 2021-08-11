import { Component, OnInit } from '@angular/core';
import { StatusService } from 'src/app/service/status.service';
import { Status } from 'src/app/models/status.model';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  constructor(private statusService: StatusService) {}

public statuses: Status[] = [];

  ngOnInit(): void {
    // disappears without this console.log? don't remove for now
    console.log(this.getProjectStatus());
    this.getProjectStatus();
  }

  public getProjectStatus(): void {
    this.statusService.getAllStatus().subscribe(statuses => this.statuses = statuses);
  }

}
