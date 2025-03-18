import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-trending-repos',
  templateUrl: './trending-repos.component.html',
  styleUrls: ['./trending-repos.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class TrendingReposComponent implements OnInit {
  isDarkMode$: Observable<boolean>;

  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  ngOnInit(): void {
    // Component initialization
  }
}
