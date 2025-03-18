import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CodeGuessComponent } from './code-guess.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    CodeGuessComponent
  ],
  exports: [
    CodeGuessComponent
  ]
})
export class CodeGuessModule { } 