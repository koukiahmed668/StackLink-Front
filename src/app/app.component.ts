import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from './layout/main/main.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'stacklink-frontend';
  
  constructor(private themeService: ThemeService) {
    // ThemeService is injected here to ensure it's initialized at app startup
  }
}
