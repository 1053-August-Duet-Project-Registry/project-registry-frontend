import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-tags',
  templateUrl: './add-tags.component.html',
  styleUrls: ['./add-tags.component.css']
})
export class AddTagsComponent implements OnInit {
  // this component is a parent component of add-tags-added-tags and add-tags-search-bar component

  constructor() { }

  ngOnInit(): void {
  }

}
