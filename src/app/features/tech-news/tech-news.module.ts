import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TechNewsComponent } from './tech-news/tech-news.component';

const routes: Routes = [
  {
    path: '',
    component: TechNewsComponent
  }
];

@NgModule({
  declarations: [
    TechNewsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class TechNewsModule { }
