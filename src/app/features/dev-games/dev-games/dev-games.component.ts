import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { Observable } from 'rxjs';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'coding' | 'database' | 'regex';
}

@Component({
  selector: 'app-dev-games',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Developer Games</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let game of games" 
             class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div class="p-6">
            <div class="flex items-center mb-4">
              <span class="text-3xl mr-3">{{ game.icon }}</span>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ game.title }}</h2>
            </div>
            
            <p class="text-gray-600 dark:text-gray-300 mb-4">{{ game.description }}</p>
            
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 rounded-full text-sm"
                    [ngClass]="{
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': game.difficulty === 'easy',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': game.difficulty === 'medium',
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': game.difficulty === 'hard'
                    }">
                {{ game.difficulty | titlecase }}
              </span>
              
              <a [routerLink]="game.route"
                 class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Play Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DevGamesComponent implements OnInit {
  isDarkMode$: Observable<boolean>;

  games: Game[] = [
    {
      id: 'code-guess',
      title: 'Code Guess',
      description: 'Test your knowledge of programming languages, frameworks, and tools in this word-guessing game.',
      icon: '💻',
      route: '/dev-games/code-guess',
      difficulty: 'easy',
      category: 'coding'
    },
    {
      id: 'bug-catcher',
      title: 'Bug Catcher',
      description: 'Find the bugs in the code snippets',
      icon: '🐛',
      route: '/dev-games/bug-catcher',
      difficulty: 'medium',
      category: 'coding'
    },
    {
      id: 'algorithm-runner',
      title: 'Algorithm Runner',
      description: 'Race against time to solve coding challenges',
      icon: '🏃‍♂️',
      route: '/dev-games/algorithm-runner',
      difficulty: 'hard',
      category: 'coding'
    }
  ];

  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  ngOnInit() {
    // Initialize component
  }
} 