import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tag } from '../models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectTagManagementService {
/* This service class is to update a array that is used to inject into project object to update/create a new project
behaviorSubject initial value is an empty array
on each specific component, set this initial array to the
existing array tag if an existing project otherwise if new, this array is just empty
 */
  private tagArray = new BehaviorSubject<Tag[]>([]);
  currentTagArray = this.tagArray.asObservable();
  public universalTags = [new Tag(3, 'tag1', 'description', true),
    new Tag(4, 'tag2', 'i want my mommy', false)];

  constructor() { }
  // simply overwrites previous tag to new one
  updateTagArray(arr: Tag[]): void{
    this.tagArray.next(arr);
  }
}
