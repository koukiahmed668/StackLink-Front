import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TrendingReposComponent } from './trending-repos/trending-repos.component';

const routes: Routes = [
  {
    path: '',
    component: TrendingReposComponent
  }
];

@NgModule({
  declarations: [
    TrendingReposComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class TrendingReposModule { }
