import { ClientMessage } from './../../models/clientMessage.model';
import { Tag } from './../../models/tag.model';
import { Location } from '@angular/common';
import { TagService } from './../../service/tag.service';
import { ProjectService } from './../../service/project.service';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
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


    // may not be needed
   /*this.filteredTags = this.tagCtrl.valueChanges
      .pipe(startWith(null),
      map((tagName: Tag | null) => tagName ? this._filter(tagName) : this.tagsNames.slice()));*/
  }

  public project?: Project;

  faEdit = faEdit;

  // TODO determine which of these fields can be deleted.
  visible = true;
  multiple = true;
  selectable = true;
  // removable = true;
  // separatorKeysCodes: number[] = [ENTER, COMMA];
 // tagCtrl = new FormControl();
  // may not be needed
  // filteredTags: Observable<Tag[]>;
  selectedTagNames: string[] = [];
  // store tags of current project, this will be passed to other teams. IS NOT an @Input()
  /*@Input()*/ selectedTagArr: Tag[] = [new Tag(3, 'tag1', 'description', true),
    new Tag(4, 'tag2', 'i want my mommy', false)]; // [];
  temp: Tag[] = [];


  @ViewChild('tagInput')
  tagInput!: any;
  @ViewChild('auto')
  matAutocomplete!: MatAutocomplete;


  public tagsNames: Tag[] = [];
  public tags: Tag[] = [];
  public errorDetected = false;
  public tag1: Tag = new Tag(0, '', '', true);
  // public clientMessage: ClientMessage = new ClientMessage('');

  message = '';
  ngOnInit(): void {
    this.getAllTags();
    this.project = this.projectService.getCurrentProject();
    this.selectedTagArr.forEach(e => {
      this.selectedTagNames.push(e.name);
    });
  }

  open(content: any) {
    this.modalService.open(content);
  }

  // I don't think this is needed?
  Tag() {
    console.log(this.tags);
  }

  getAllTags() {
    // temporary hardcoding
    this.tags = [new Tag(3, 'tag1', 'description')];
    this.tagsNames = this.tags;


      /*
      * This block gets tags from the db
      */
    // this.tagService.getAllTags().subscribe(data => {
    //   this.tags = data;
    //   data.forEach(tag => {
    //     this.tagsNames.push(tag);
    //   });
    // });
  }

  private _filter(value: any): Tag[] {
    // const filterValue = value;
    const a: Tag = new Tag(0, value, '', true);
    return this.tagsNames.filter(tagName => tagName.name === a.name);
  }

  // tagName.indexOf(filterValue) === 0
  add(event: MatChipInputEvent): void {
    console.log('add is called');
    // seems like this isn't used so is it not needed?
    const input = event.input ? event.input : '';
    const value = event.value;

    if ((value || '').trim()){
      this.tagsNames.forEach(names => {
        if (names.name === event.value && !this.selectedTagNames.includes(value.trim()))
          this.selectedTagNames.push(value.trim());
      });
    }
    // may not be needed
    // this.tagCtrl.setValue(null);
  }

  remove(tagName: Tag): void {
    this.selectedTagArr = this.selectedTagArr.filter(tag => tag.name !== tagName.name);

    this.data.universalTags = this.data.universalTags.filter(tag => tag.name !== tagName.name);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.selectedTagArr.includes(event.option.value))
      this.selectedTagNames.push(event.option.viewValue);
  }

    // filter out own selected method
  filterSelectedTag(tag: Tag): void {
    if (!this.selectedTagArr.includes(tag)){
    this.selectedTagArr.push(tag); }
  }

 // takes the information from the create-new-tag-form in the html and makes a new tag
  // the check for tag already in use not working, unsure why
public registerTagFromService(): void {
    if (this.tag1.name === ''){
      this.message = 'Tag must have a name';
      return;
    }
    // make sure the new tag name does not exist already
    for (const loopTag of this.tags){
    if (loopTag.name === this.tag1.name){
      this.message = `The ${this.tag1.name} tag already exists`;
      return ;
    }
  }
  // adds tags to the list of tags in the box for tags
    this.selectedTagArr.push(new Tag(0, this.tag1.name, this.tag1.description, true));

  // adds tags to the mat-chip list of tags
  // available to access project data from anywhere
  // project is from project.service.ts
    if (this.project) {
      this.project.tags.push(new Tag(0, this.tag1.name, this.tag1.description, true));
    }
    this.data.universalTags.push(new Tag(0, this.tag1.name, this.tag1.description, true));

    if (this.project) {
      this.tags = this.project.tags;
    }

  // lets the user know the tag was created successfully
    this.message = `The ${this.tag1.name} tag was created`;

    setTimeout(() => {
      this.message = '';
      this.tag1.name = '';
      this.tag1.description = '';
      this.getAllTags(); },
    3000);

  }



}

