import { Component, OnInit } from '@angular/core';
import { Tag } from '../../models/tag.model';
import { TagService } from 'src/app/service/tag.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatOption } from '@angular/material/core';
import { ProjectTagManagementService } from 'src/app/service/project-tag-management.service';
import { element } from 'protractor';
import { ProjectDetailComponent } from '../project-detail/project-detail.component';

// import 'rxjs/add/operator/debounceTime'
// import 'rxjs/add/operator/map'
// import 'rxjs/add/operator/distinctUntilChanged'

@Component({
  selector: 'app-add-tags-search-bar',
  templateUrl: './add-tags-search-bar.component.html',
  styleUrls: ['./add-tags-search-bar.component.css']
})

export class AddTagsSearchBarComponent implements OnInit {

  selectedTag!: Tag;
  allSelectedTags: string[] = [];
  allSelectedTagsObject: Tag[] = [];
  myControl = new FormControl();
  options: string[] = [];
  tags: Tag[] = [];
  filteredOptions!: Observable<string[]>;

  searchTags: string[] = [];

  constructor(private TagsService: TagService, private data: ProjectTagManagementService,
              private projectDetails: ProjectDetailComponent) { }

  ngOnInit(): void{
    // searchTags are used in the _filter function
    this.TagsService.getAllTags().subscribe(tags => this.searchTags = tags.map(tag => tag.name));

    this.getTags();

    this.filteredOptions = this.myControl.valueChanges
      .pipe(startWith(''), map(value => this._filter(value)));
  }

  // gets all tags from service and calls getTagNames function
  getTags(): void {
    this.TagsService.getAllTags().subscribe(tag => {
      this.tags = tag.filter(tagEnabled => tagEnabled.isEnabled);

      this.getTagNames(this.tags);
    });
  }

  // extracts the name property from tags object and pushes into array of strings
  getTagNames(arr: any): void {
    for (const tag of arr){
      this.options.push(tag.name);
    }
  }

 private _filter(value: string): string[]{
   const filterValue = value.toLowerCase();
   return this.searchTags.filter(option => option.toLowerCase().includes(filterValue));
 }

 /* this method puts the selected tag into the project from project-detail,
    option.value only fires when a valid tag is selected from the option list,
  */
 onTagSelected(option: MatOption): void {

   // get the tag name from option.value as a string
   const tagName: string = option.value;

   // use the tag name to filter all but one tag out of all tags and assign it to selectTag
   const selectTag: Tag = this.tags.filter(x => x.name === tagName)[0];

   // put the selected tag into the project found in project-details component
   this.projectDetails.project?.tags.push(selectTag);

 }
}
