import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project.model';
import { Tag } from 'src/app/models/tag.model';
import { ProjectService } from 'src/app/service/project.service';
import { TagService } from '../../service/tag.service';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ProjectTagManagementService } from 'src/app/service/project-tag-management.service';

@Component({
  selector: 'app-add-tags-added-tags',
  templateUrl: './add-tags-added-tags.component.html',
  styleUrls: ['./add-tags-added-tags.component.css']
})
export class AddTagsAddedTagsComponent implements OnInit {

  // Constructor for add-tags-added-tags
  constructor(public router: Router, public projectService: ProjectService,
              public tagService: TagService, config: NgbModalConfig, public data: ProjectTagManagementService) {

    config.backdrop = 'static';

    // unknown use
    config.keyboard = false;
  }
  public project?: Project;

  /* **********
   Chip events
   ********** */
  multiple = true;
  selectable = true;
  removable = true;

  // store tags of current project
  selectedTagArr: Tag[] = [];

  ngOnInit(): void {
    this.project = this.projectService.getCurrentProject();
    // gets all tags and adds them to view
    this.tagService.getAllTags().subscribe(tags => this.selectedTagArr = tags.filter(t => t.isEnabled));
    this.data.updateTagArray(this.selectedTagArr);
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

  }
}
