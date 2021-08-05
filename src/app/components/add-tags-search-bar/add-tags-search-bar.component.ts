import { Component, OnInit } from '@angular/core';
import {Tag} from '../../models/tag.model';
import { TagService } from 'src/app/service/tag.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatOption } from '@angular/material/core';
import { ProjectTagManagementService } from 'src/app/service/project-tag-management.service';
import { element } from 'protractor';
// import 'rxjs/add/operator/debounceTime'
// import 'rxjs/add/operator/map'
// import 'rxjs/add/operator/distinctUntilChanged'

@Component({
  selector: 'app-add-tags-search-bar',
  templateUrl: './add-tags-search-bar.component.html',
  styleUrls: ['./add-tags-search-bar.component.css']
})

export class AddTagsSearchBarComponent implements OnInit {
currentTags!: Tag[];

selectedTag!: Tag;
allSelectedTags: string[] = [];
allSelectedTagsObject: Tag[] = [];
myControl = new FormControl();
options: string[] = [];
tags: Tag[] = [];
filteredOptions!: Observable<string[]>;
  constructor(private TagsService: TagService, private tagManage: ProjectTagManagementService) {

  }
ngOnInit(): void{
    this.tagManage.currentTagArray.subscribe(arr => this.currentTags = arr);

    this.getTags();
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''), map(value => this._filter(value))
      );
  }

  // gets all tags from service and calls getTagNames function
  getTags(){
    this.TagsService.getAllTags().subscribe(tag => {
      this.tags = tag;

      this.getTagNames(this.tags);

    });
  }
  // extracts the name property from tags object and pushes into array of strings
  getTagNames(arr: any){
    for (const tag of arr){
     // console.log(arr[i])
      this.options.push(tag.name);
    }
  }

 private _filter(value: string): string[]{
   const filterValue = value.toLowerCase();
   return this.options.filter(option => option.toLowerCase().includes(filterValue));
 }

 /* this gets the value of the selected tag, option.value only fires when a valid tag is selected,
 this will get array index of the object we will push for further processing
 */
 onTagSelected(option: MatOption){
  const tagName = (ele: any) => ele.name === option.value;

  const index = this.tags.findIndex(tagName);
  if (!this.currentTags.find(tagName)){
      this.currentTags.push(this.tags[index]);
  }

  // this.tagManage.updateTagArray(this.currentTags.concat(this.allSelectedTagsObject));


 }

}
