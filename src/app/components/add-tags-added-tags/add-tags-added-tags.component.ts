import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project.model';
import { Tag } from 'src/app/models/tag.model';
import { ProjectService } from 'src/app/service/project.service';
import { TagService } from './../../service/tag.service';
import { AddTagsSearchBarComponent } from '../add-tags-search-bar/add-tags-search-bar.component'
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ProjectTagManagementService } from 'src/app/service/project-tag-management.service';

@Component({
  selector: 'app-add-tags-added-tags',
  templateUrl: './add-tags-added-tags.component.html',
  styleUrls: ['./add-tags-added-tags.component.css']
})
export class AddTagsAddedTagsComponent implements OnInit {

  // Constructor for add-tags-added-tags
  constructor(public router: Router, /*public universalTags: TagsComponent,*/ public projectService: ProjectService,
              public tagService: TagService, config: NgbModalConfig, /* private modalService: NgbModal,*/
              public data: ProjectTagManagementService, /*private SearchBarComponent: AddTagsSearchBarComponent*/) {
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
    this.tagService.getAllTags().subscribe(tags => this.selectedTagArr = tags.filter(t => t.isEnabled));
    this.data.updateTagArray(this.selectedTagArr);
  }

  ngOnChange(): void {

  }

  // removes tags
  remove(tagNoMore: Tag): void {
    this.tagService.disableTag(tagNoMore).subscribe(() => {
      // changes the display of tags on screen
      this.data.updateTagArray(this.selectedTagArr);
      this.selectedTagArr = this.selectedTagArr.filter(tag => tag.name !== tagNoMore.name);
      if (this.project) {
        this.project.tags = this.project.tags.filter(tag => tag.name !== tagNoMore.name);
      }
    });

    /* 
    * this dependency causes an error in the constructor
    */
    // const index: number = this.SearchBarComponent.searchTags.indexOf(tagNoMore.name);
    // this.SearchBarComponent.searchTags.splice(index, 1);
  }
}
