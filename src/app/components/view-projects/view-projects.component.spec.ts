import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProjectsComponent } from './view-projects.component';

describe('ViewProjectsComponent', () => {
  let component: ViewProjectsComponent;
  let fixture: ComponentFixture<ViewProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProjectsComponent ]
    })
    .compileComponents();
  });

  // it('should display list of projects'), async () => {
  //   await component.getProjects();
  //   expect
  // }

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  xit('should create', () => {

    expect(component).toBeTruthy();
  });
});
