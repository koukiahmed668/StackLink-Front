import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PortfoliosComponent } from './portfolios/portfolios.component';

const routes: Routes = [
  {
    path: '',
    component: PortfoliosComponent
  }
];

@NgModule({
  declarations: [
    PortfoliosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class PortfoliosModule { }
