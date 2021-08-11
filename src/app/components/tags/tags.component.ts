import { ClientMessage } from './../../models/clientMessage.model';
import { Tag } from './../../models/tag.model';
import {Location} from '@angular/common'
import { TagService } from './../../service/tag.service';
import { ProjectService } from './../../service/project.service';
import {Router} from '@angular/router'
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
  public project?:Project;

  faEdit = faEdit;
  ngOnInit(): void {
    this.getAllTags();
    this.project = this.projectService.getCurrentProject();
    this.selectedTagArr.forEach(e => {
      this.selectedTagNames.push(e.name);
    })
  }
  
  
  visible = true;
  multiple = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<Tag[]>;
  selectedTagNames: string[] = [];
  //store tags of current project, this will be passed to other teams
  @Input() selectedTagArr: Tag[] = [];
  temp: Tag[] = [];

  @ViewChild('tagInput')
  tagInput!: any;
  @ViewChild('auto')
  matAutocomplete!: MatAutocomplete;


  public tagsNames: Tag[] = [];
  public tags: Tag[] = [];
  public errorDetected: boolean = false;


  constructor(public router: Router, public projectService: ProjectService, public tagService: TagService, config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
    
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tagName: Tag | null) => tagName ? this._filter(tagName) : this.tagsNames.slice()));
  }


  //closeResult = '';

  open(content: any) {
    this.modalService.open(content)
  }

  Tag() {
    console.log(this.tags);
  }

  getAllTags() {
    this.tagService.getAllTags().subscribe(data => {
      this.tags = data;
      data.forEach(tag => {
        this.tagsNames.push(tag);
      })
    })
  };
  private _filter(value: any): Tag[] {
    // const filterValue = value;
    const a: Tag = new Tag(0, value, '');
    return this.tagsNames.filter(tagName => tagName.name == a.name);
  }

  //tagName.indexOf(filterValue) === 0
  add(event: MatChipInputEvent): void {
    console.log('add is called')
    const input = event.input;
    const value = event.value;
    console.log('value' + value);

    if((value || '').trim()){
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

  remove(tagName: string): void {
    const index = this.selectedTagNames.indexOf(tagName);
    if (index >= 0) {
      this.selectedTagNames.splice(index, 1);
    }
    for(let i = 0; i < this.selectedTagArr.length; i++){
      
      this.selectedTagArr = this.selectedTagArr.filter( e => e.name !== tagName);
      if(this.project != undefined){
        this.project.tags = this.project.tags.filter(e=>e.name != tagName);
      }
    }
    console.log(this.selectedTagNames);
    //when i come back i will do here
    // for(let i = 0; i < this.selectedTagArr.length; i++){
    //   if(this.selectedTagArr[i].name === tagName){
    //     continue
    //   }
    // }
    
  }

selected(event: MatAutocompleteSelectedEvent): void {
   // let index = this.selectedTagNames.indexOf(event.option.value);

    if(!this.selectedTagArr.includes(event.option.value))
    {
      this.selectedTagNames.push(event.option.viewValue);
    }
  }

  //filter out own selected method
filterSelectedTag(tag: Tag): void {
    if (!this.selectedTagArr.includes(tag)){
    this.selectedTagArr.push(tag);}
  }
  public tag1: Tag = new Tag(0, '','');
  //public clientMessage: ClientMessage = new ClientMessage('');

message : string = "";


public registerTagFromService(): void {
  for(let i = 0; i < this.tags.length; i++){
    if(this.tags[i].name == this.tag1.name){
      this.message = "Tag is already exist"
      return ;
    }
  }

  this.tagService.registerTag(this.tag1).subscribe(data => this.message, 
          error => this.message = "INVALID FIELD");
          this.message = "Tag is successfully created";
         // this.router.navigate(['tag']);
          
         setTimeout(() => {
           this.tag1.name="";
           this.tag1.description="";
           this.getAllTags();
        }, 2000);
          
  // this.tags.forEach(e => {
  //   if(this.tag1.name !== e.name){
  //     console.log('object');
  //     this.tagService.registerTag(this.tag1).subscribe(data => this.message, 
  //       error => this.message = "INVALID FIELD");
  //   }else{
  //     alert('same');
  //     return;
  //   }
  // })
}






}

