import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Phase } from 'src/app/models/phase';
import { Project } from 'src/app/models/project.model';
// import { Role } from 'src/app/models/role.model';
// import { Status } from 'src/app/models/status.model';
import { Tag } from 'src/app/models/tag.model';
// import { User } from 'src/app/models/user.model';
import { ProjectService } from 'src/app/service/project.service';
// import { ClientMessage } from './../../models/clientMessage.model';
// import { Location } from '@angular/common';
import { TagService } from './../../service/tag.service';
// import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ViewChild, AfterViewInit, OnChanges, DoCheck, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
// import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
// import { map, startWith } from 'rxjs/operators';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// import { Output, EventEmitter } from '@angular/core';
import { ProjectTagManagementService } from 'src/app/service/project-tag-management.service';
// import { TagsComponent } from '../tags/tags.component';

@Component({
  selector: 'app-add-tags-added-tags',
  templateUrl: './add-tags-added-tags.component.html',
  styleUrls: ['./add-tags-added-tags.component.css']
})
export class AddTagsAddedTagsComponent implements OnInit {

  // Constructor for add-tags-added-tags
  constructor(public router: Router, /*public universalTags: TagsComponent,*/ public projectService: ProjectService,
              public tagService: TagService, config: NgbModalConfig, /* private modalService: NgbModal,*/
              public data: ProjectTagManagementService) {
    config.backdrop = 'static';

    // unknown use
    config.keyboard = false;

    /*this.filteredTags = this.tagCtrl.valueChanges
      .pipe(startWith(null),
      map((tagName: Tag | null) => tagName ? this._filter(tagName) : this.tagsNames.slice()));*/
  }
  public project?: Project;

  /* **********
   Chip events
   ********** */
  visible = true;
  multiple = true;
  selectable = true;
  removable = true;

  tagCtrl = new FormControl();

  // store tags of current project
  selectedTagArr: Tag[] = [];

  // testing to see if the @ViewChild does anything here. So far, no it does not
 // @ViewChild('tagInput')
  tagInput!: any;

 // @ViewChild('auto')
  // looks like matAutocomplete is not used yet
  matAutocomplete!: MatAutocomplete;

  ngOnInit(): void {
    this.project = this.projectService.getCurrentProject();
    // gets all tags and adds them to view
    this.tagService.getAllTags().subscribe(tags => this.selectedTagArr = tags);
    this.data.updateTagArray(this.selectedTagArr);
  }

  ngOnChange(): void {

  }

  // removes tags from view not from persistent storage
  remove(tagNoMore: Tag): void {
    this.selectedTagArr = this.selectedTagArr.filter(tag => tag.name !== tagNoMore.name);

    // removes tags from project not from persistent storage
    if (this.project) {
      this.project.tags = this.project.tags.filter(tag => tag.name !== tagNoMore.name);
    }
    console.log('calling to \'disable\' a tag in the database');
    this.tagService.disableTag(tagNoMore);

    // changes the display of tags on screen
    this.data.updateTagArray(this.selectedTagArr);
  }
}
