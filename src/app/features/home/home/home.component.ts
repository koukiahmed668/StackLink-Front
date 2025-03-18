import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ]
})
export class HomeComponent implements OnInit {
  isDarkMode$: Observable<boolean>;
  
  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }
  
  ngOnInit(): void {
    // Component initialization
  }
}
