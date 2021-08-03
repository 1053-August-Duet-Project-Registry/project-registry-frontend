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


@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class TagsComponent implements OnInit {

  constructor(public router: Router, public projectService: ProjectService, public tagService: TagService,
              config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tagName: Tag | null) => tagName ? this._filter(tagName) : this.tagsNames.slice())
    );
  }

  // The current project being viewed/edited
  public project?: Project;

  faEdit = faEdit;

  tagCtrl = new FormControl();
  filteredTags: Observable<Tag[]>;
  selectedTagNames: string[] = [];
  // array of tags attached to current project
  @Input() selectedTagArr: Tag[] = [new Tag(3, 'tag1', 'description')];

  @ViewChild('tagInput')
  tagInput!: any;
  @ViewChild('auto')
  matAutocomplete!: MatAutocomplete;
  message = '';

  public tagsNames: Tag[] = [];
  // contains all tags found in the db
  public tags: Tag[] = [];
  public errorDetected = false;
  // contains the text entered in the description and name input boxes
  public tag1: Tag = new Tag(0, '', '');

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

  getAllTags() {
    this.tagService.getAllTags().subscribe(data => {
      this.tags = data;
      this.selectedTagArr = data;
      this.tagsNames = data;
    });
  }

  private _filter(value: any): Tag[] {
    const a: Tag = new Tag(0, value, '');
    return this.tagsNames.filter(tagName => tagName.name == a.name);
  }

  // tagName.indexOf(filterValue) === 0
  add(event: MatChipInputEvent): void {
    console.log('add is called');
    // seems like this variable isn't used so is it not needed?
    const input = event.input ? event.input : '';
    const value = event.value;

    if ((value || '').trim()){
      this.tagsNames.forEach(names => {
        if (names.name === event.value && !this.selectedTagNames.includes(value.trim()))
          this.selectedTagNames.push(value.trim());
      });
    }
    this.tagCtrl.setValue(null);
  }

  remove(tagName: string): void {
    const index = this.selectedTagNames.indexOf(tagName);
    if (index >= 0) {
      this.selectedTagNames.splice(index, 1);
    }
    for (let i = 0; i < this.selectedTagArr.length; i++){
      this.selectedTagArr = this.selectedTagArr.filter( e => e.name !== tagName);
      if (this.project !== undefined)
        this.project.tags = this.project.tags.filter(e => e.name != tagName);
    }
    // TODO figure out wtf this note means and if it needs fixed.
    // when i come back i will do here
    // for(let i = 0; i < this.selectedTagArr.length; i++){
    //   if(this.selectedTagArr[i].name === tagName){
    //     continue
    //   }
    // }

  }

  // TODO not used...
  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.selectedTagArr.includes(event.option.value))
      this.selectedTagNames.push(event.option.viewValue);
  }

  public registerTagFromService(): void {
    const newTag = new Tag(0, this.tag1.name, this.tag1.description);

    for (let i = 0; i < this.tags.length; i++){
      if (this.tags[i].name.toLowerCase() === newTag.name.toLowerCase()) {
        this.message = 'Tag already exists';
        return;
      }
    }

    this.tags.push(newTag);

    // adds tag to the list of tags in the box for tags
    this.selectedTagArr.push(newTag);

    // adds the tag to the current project
    this.project?.tags.push(newTag);
    /*this.tagService.registerTag(this.tag1).subscribe(data => this.message,
            error => this.message = 'INVALID FIELD');
    this.message = 'Tag is successfully created';
          // this.router.navigate(['tag']);

    setTimeout(() => {
            this.tag1.name = '';
            this.tag1.description = '';
            this.getAllTags(); },
      2000);*/

    // this resets the message in case it was set if a user entered a duplicate tag name 
    this.message = '';
  }
}

