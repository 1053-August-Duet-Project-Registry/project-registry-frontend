import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Phase } from 'src/app/models/phase';
import { Project } from 'src/app/models/project.model';
import { Role } from 'src/app/models/role.model';
import { Status } from 'src/app/models/status.model';
import { Tag } from 'src/app/models/tag.model';
import { User } from 'src/app/models/user.model';
import { ProjectService } from 'src/app/service/project.service';
import { ClientMessage } from './../../models/clientMessage.model';
import { Location } from '@angular/common';
import { TagService } from './../../service/tag.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ViewChild, AfterViewInit, OnChanges, DoCheck, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Output, EventEmitter } from '@angular/core';
import { ProjectTagManagementService } from 'src/app/service/project-tag-management.service';
import { TagsComponent } from '../tags/tags.component';

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

  // arr!: Tag[];
  // separatorKeysCodes: number[] = [ENTER, COMMA];

  /* **********
   Chip events
   ********** */
  visible = true;
  multiple = true;
  selectable = true;
  removable = true;

  tagCtrl = new FormControl();

  // do we need this?
  // filteredTags: Observable<Tag[]>;

  // do we need this?
  /*selectedTagNames: string[] = [];*/

  // do we need this?
  // To hold all tags? used in view-projects as part of the displayedColumns (maybe?)
 // public tags: Tag[] = [];

<<<<<<< HEAD
=======
  // store tags of current project, this will be passed to other teams
  @Input() selectedTagArr: Tag[] = [];
>>>>>>> Feature-Tags

  // store tags of current project, this will be passed to other teams
  selectedTagArr: Tag[] = []; // [new Tag(3, 'tag1', 'description'), new Tag(4, 'tag2', 'i want my mommy')];

  // testing to see if the @ViewChild does anything here. So far, no it does not
 // @ViewChild('tagInput')
  tagInput!: any;

 // @ViewChild('auto')
  // looks like matAutocomplete is not used yet
  matAutocomplete!: MatAutocomplete;


  public tagsNames: Tag[] = [];
 // not in use anywhere yet, might not need
  // public errorDetected = false;

  ngOnInit(): void {
    this.data.currentTagArray.subscribe(selectedTagArr => this.selectedTagArr = selectedTagArr);
    this.project = this.projectService.getCurrentProject();

<<<<<<< HEAD
    // this adds a tag that can be removed from the screen from the current project
    if (this.project){
      this.selectedTagArr = this.project.tags;
      // in case the current project cannot be found the universal tags will show
    } else {
      this.selectedTagArr = this.data.universalTags; // this.project.tags; // this.global.globalTags;
    }
    // do we need this?
    /*this.selectedTagArr.forEach(e => {
      this.selectedTagNames.push(e.name);
    });*/
=======
    // gets all tags and adds them to view
    this.tagService.getAllTags().forEach(tags => this.selectedTagArr = tags);

    this.selectedTagArr.forEach(e => {
      this.selectedTagNames.push(e.name);
    });
>>>>>>> Feature-Tags

    this.data.updateTagArray(this.selectedTagArr);

  }

  ngOnChange(): void {

  }


  private _filter(value: Tag): Tag[] {
    return this.tagsNames.filter(tagName => tagName.name === '');
  }


  // removes tags from view not from persistent storage
  remove(tagName: Tag): void {
    this.selectedTagArr = this.selectedTagArr.filter(tag => tag.name !== tagName.name);

<<<<<<< HEAD
    // removes tags from project not from persistent storage
    if (this.project){
      this.project.tags = this.project.tags.filter(tag => tag.name !== tagName.name);
  }

    // changes the display of tags on screen
    this.data.updateTagArray(this.selectedTagArr);
=======
>>>>>>> Feature-Tags

    this.data.updateTagArray(this.selectedTagArr);
  }

}
