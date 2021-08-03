import { ClientMessage } from './../../models/clientMessage.model';
import { Tag } from './../../models/tag.model';
import {Location} from '@angular/common';
import { TagService } from './../../service/tag.service';
import { ProjectService } from './../../service/project.service';
import {Router} from '@angular/router';
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
import {ProjectTagManagementService} from '../../service/project-tag-management.service';


@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class TagsComponent implements OnInit {

  constructor(public router: Router, public projectService: ProjectService, public tagService: TagService,
              config: NgbModalConfig, private modalService: NgbModal, public data: ProjectTagManagementService) {
    config.backdrop = 'static';
    config.keyboard = false;

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tagName: Tag | null) => tagName ? this._filter(tagName) : this.tagsNames.slice()));
  }

  public project?: Project;

  faEdit = faEdit;

  // TODO determine which of these fields can be deleted.
  visible = true;
  multiple = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<Tag[]>;
  selectedTagNames: string[] = [];
  // store tags of current project, this will be passed to other teams
  @Input() selectedTagArr: Tag[] = [new Tag(3, 'tag1', 'description'), new Tag(4, 'tag2', 'i want my mommy')]; // [];
  temp: Tag[] = [];


  @ViewChild('tagInput')
  tagInput!: any;
  @ViewChild('auto')
  matAutocomplete!: MatAutocomplete;

  closeResult = '';

  public tagsNames: Tag[] = [];
  public tags: Tag[] = [];
  public errorDetected = false;
  public tag1: Tag = new Tag(0, '', '');
  // public clientMessage: ClientMessage = new ClientMessage('');

message = '';
  ngOnInit(): void {
    this.getAllTags();
    this.project = this.projectService.getCurrentProject();
    this.selectedTagArr.forEach(e => {
      this.selectedTagNames.push(e.name);
    });
  }



  open(content: any): void {
    this.modalService.open(content);
  }

  Tag(): void {
    console.log(this.tags);
  }

   getAllTags(): void {

   this.tags = [new Tag(3, 'tag1', 'description'), new Tag(4, 'tag2', 'i want my mommy')];
   this.tagsNames = this.tags;



     /*this.tagService.getAllTags().subscribe(data => {
       this.tags = data;
       data.forEach(tag => {
         this.tagsNames.push(tag);
       });
     });*/
  }

  private _filter(value: any): Tag[] {
    // const filterValue = value;
    const a: Tag = new Tag(0, value, '');
    return this.tagsNames.filter(tagName => tagName.name === a.name);
  }

  // tagName.indexOf(filterValue) === 0
  add(event: MatChipInputEvent): void {
    console.log('add is called');
    const input = event.input;
    const value = event.value;
    console.log('value' + value);

    if ((value || '').trim()){
      this.tagsNames.forEach(names => {

        if (names.name === event.value)
        {
          if (!this.selectedTagNames.includes(value.trim())){

            this.selectedTagNames.push(value.trim());
          }
        }
      });



    }
    if (input) {
      input.value = '';
    }
    this.tagCtrl.setValue(null);
  }

  remove(tagName: Tag): void {
    this.selectedTagArr = this.selectedTagArr.filter(tag => tag.name !== tagName.name);

    this.data.universalTags = this.data.universalTags.filter(tag => tag.name !== tagName.name);

    // this.data.updateTagArray(this.selectedTagArr);

    // this.data.updateTagArray(this.data.universalTags);
  }

  // remove(tagName: string): void {
  //   const index = this.selectedTagNames.indexOf(tagName);
  //   if (index >= 0) {
  //     this.selectedTagNames.splice(index, 1);
  //   }
  //   for (let i = 0; i < this.selectedTagArr.length; i++){
  //
  //     this.selectedTagArr = this.selectedTagArr.filter( e => e.name !== tagName);
  //     if (this.project !== undefined){
  //       this.project.tags = this.project.tags.filter(e => e.name != tagName);
  //     }
  //   }
  //   console.log(this.selectedTagNames);
  //   // TODO figure out wtf this note means and if it needs fixed.
  //   // when i come back i will do here
  //   // for(let i = 0; i < this.selectedTagArr.length; i++){
  //   //   if(this.selectedTagArr[i].name === tagName){
  //   //     continue
  //   //   }
  //   // }
  //
  // }

selected(event: MatAutocompleteSelectedEvent): void {
   // let index = this.selectedTagNames.indexOf(event.option.value);

    if (!this.selectedTagArr.includes(event.option.value))
    {
      this.selectedTagNames.push(event.option.viewValue);
    }
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
    this.selectedTagArr.push(new Tag(0, this.tag1.name, this.tag1.description));
  // this.project?.tags.push(new Tag(3, this.tag1.name, this.tag1.description));

  // adds tags to the (tags x) list of tags
  // available to access project data from anywhere
  // project is from project.service.ts
    this.project?.tags.push(new Tag(0, this.tag1.name, this.tag1.description));

    this.data.universalTags.push(new Tag(0, this.tag1.name, this.tag1.description));

  // @ts-ignore
    this.tags = this.project.tags;
  /*this.tagService.registerTag(this.tag1).subscribe(data => this.message,
          error => this.message = 'INVALID FIELD');
  this.message = 'Tag is successfully created';
         // this.router.navigate(['tag']);
*/  // lets the user know the tag was created successfully
    this.message = `The ${this.tag1.name} tag was created`;

    setTimeout(() => {
      this.message = '';
      this.tag1.name = '';
      this.tag1.description = '';
      this.getAllTags(); },
    3000);

  }



}

