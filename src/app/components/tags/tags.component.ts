// import { ClientMessage } from './../../models/clientMessage.model';
import { Tag } from './../../models/tag.model';
// import { Location } from '@angular/common';
import { TagService } from './../../service/tag.service';
import { ProjectService } from './../../service/project.service';
import { Router } from '@angular/router';
// import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ViewChild, OnInit, AfterViewInit, OnChanges, DoCheck, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Project } from 'src/app/models/project.model';
import { ProjectTagManagementService } from '../../service/project-tag-management.service';


@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class TagsComponent implements OnInit {

  constructor(public router: Router, public projectService: ProjectService,
              public tagService: TagService, config: NgbModalConfig, private modalService: NgbModal,
              public data: ProjectTagManagementService) {
    config.backdrop = 'static';

    // prevents the closing of the create-new-tag pop-up window by pressing the Esc key
    config.keyboard = false;
  }

  // The current project being viewed/edited
  public project?: Project;

  faEdit = faEdit;

  tagCtrl = new FormControl();
  @ViewChild('tagInput')
  tagInput!: any;
  @ViewChild('auto')
  matAutocomplete!: MatAutocomplete;
  message = '';
  // contains all tags found in the db
  public tags: Tag[] = [];
  // array of tags attached to current project
  @Input() selectedTagArr: Tag[] = [];
  public errorDetected = false;



  // contains the text entered in the description and name input boxes
  public tag1: Tag = new Tag(0, '', '', true);
  ngOnInit(): void {
    this.getAllTags();
    this.project = this.projectService.getCurrentProject();
  }

  open(content: any): void {
    this.modalService.open(content);
  }

  getAllTags(): void {
    this.tagService.getAllTags().subscribe(tags => {
      this.tags = tags;
      this.data.universalTags = tags;
    });


  }

  // private _filter(value: any): Tag[] {
  //   const a: Tag = new Tag(0, value, '', true);
  //   return this.tagsNames.filter(tagName => tagName.name === a.name);
  // }

  add(event: MatChipInputEvent): void {
    // TODO finish this
    // if (this.project) {
    //   this.project.tags.push(newTag);
    // }
  }

  /*
  * I don't think this is needed
  */
  // remove(tagName: Tag): void {
  //   this.selectedTagArr = this.selectedTagArr.filter(tag => tag.name !== tagName.name);

  //   this.data.universalTags = this.data.universalTags.filter(tag => tag.name !== tagName.name);

  //   // TODO remove tag from db (use tag.service.ts)
  //   // this.tagService

  //   // this.data.updateTagArray(this.selectedTagArr);

  //   // this.data.updateTagArray(this.data.universalTags);
  // }

  // TODO not used...
  selected(event: MatAutocompleteSelectedEvent): void {

  }

  // takes the information from the create-new-tag-form in the html and makes a new tag
  public registerTag(): void {
    const newTag = new Tag(0, this.tag1.name, this.tag1.description, true);

    // if input is empty, return
    if (newTag.name === ''){
      this.message = 'Tag must have a name';
      return;
    }
    // if tag name already exists, return
    if (this.tags.map(tag => tag.name).includes(newTag.name)) {
      this.message = `The ${newTag.name} tag already exists`;
      return;
    }

    this.tagService.registerTag(newTag).subscribe(_ => {
      // lets the user know the tag was created successfully
      this.message = `The ${newTag.name} tag was created`;
      this.tags.push(newTag);
      this.data.universalTags.push(newTag);
      // this.project?.tags.push(newTag);
      this.selectedTagArr.push(newTag);
    });

    // TODO maybe exit out of "add tag" window in this function?
    setTimeout(() => {
      this.message = '';
      this.tag1.name = '';
      this.tag1.description = '';
      // this.getAllTags();
      window.location.reload(); },
    2000);
  }
}
