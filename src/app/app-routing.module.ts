import { ProjectLoginComponent } from './components/project-login/project-login.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewProjectsComponent } from './components/view-projects/view-projects.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { AddTagsComponent } from './components/add-tags/add-tags.component';


const routes: Routes = [
  {path: '', redirectTo: '/homepage-login', pathMatch: 'full'},
  {path: 'viewProject', component: ViewProjectsComponent},
  {path: 'create-project', component: CreateProjectComponent},
  {path: 'view-projects', component: ViewProjectsComponent},
  {path: 'project-detail', component: ProjectDetailComponent},
  {path: 'project-detail/:id', component: ProjectDetailComponent},
  {path: 'homepage-login' , component: ProjectLoginComponent},
  {path: 'timeline' , component: TimelineComponent},
  {path: 'app', component: AddTagsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
