import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeGuessComponent } from '../code-guess/code-guess.component';
import { BugCatcherComponent } from '../bug-catcher/bug-catcher.component';
import { AlgorithmRunnerComponent } from '../algorithm-runner/algorithm-runner.component';
import { ThemeService } from '../../core/services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dev-games',
  templateUrl: './dev-games.component.html',
  styleUrls: ['./dev-games.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CodeGuessComponent,
    BugCatcherComponent,
    AlgorithmRunnerComponent
  ]
})
export class DevGamesComponent implements OnInit {
  activeGameIndex: number = 0;
  isDarkMode$: Observable<boolean>;
  
  games = [
    {
      id: 'code-guess',
      name: 'Code Guess',
      description: 'Guess the coding term in 6 tries',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
    },
    {
      id: 'bug-catcher',
      name: 'Bug Catcher',
      description: 'Find the bugs in the code snippets',
      icon: 'M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11'
    },
    {
      id: 'algorithm-runner',
      name: 'Algorithm Runner',
      description: 'Race against time to solve coding challenges',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  ];
  
  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  ngOnInit(): void {
    // Component initialization
  }
  
  setActiveGame(index: number): void {
    this.activeGameIndex = index;
  }
} 