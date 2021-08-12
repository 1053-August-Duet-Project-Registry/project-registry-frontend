import { Tag } from '../../models/tag.model';
import { TagService } from '../../service/tag.service';
import { ProjectService } from '../../service/project.service';
import { Router } from '@angular/router';
import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Project } from 'src/app/models/project.model';
import { ProjectTagManagementService } from '../../service/project-tag-management.service';
import { TagDTO } from 'src/app/models/DTO/tag-dto.model';

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

  // takes the information from the create-new-tag-form in the html and makes a new tag
  public registerTag(): void {
    const newTag = new TagDTO(this.tag1.name, this.tag1.description, true);

    // if input is empty, return with message
    if (newTag.name === ''){
      this.message = 'Tag must have a name';
      return;
    }

    // if tag name already exists, return with message
    for (const tag of this.tags) {
      if (tag.isEnabled && tag.name === newTag.name) {
        this.message = `The ${newTag.name} tag already exists`;
        return;
      }
    }

    this.tagService.createTag(newTag).subscribe(t => {

      // lets the user know the tag was created successfully
      this.message = `The ${newTag.name} tag was created`;
      this.tags.push(t);
      this.data.universalTags.push(t);

      // this.project?.tags.push(newTag);
      this.selectedTagArr.push(t);
    });


    setTimeout(() => {
      this.message = '';
      this.tag1.name = '';
      this.tag1.description = '';
      window.location.reload(); },
    2000);
  }
}
