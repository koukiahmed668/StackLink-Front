import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface GameProgress {
  gameId: string;
  completedLevels: number[];
  achievements: string[];
  lastPlayed: Date;
  totalScore: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  gameId: string;
  requirement: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameProgressService {
  private progressSubject = new BehaviorSubject<GameProgress[]>([]);
  public progress$ = this.progressSubject.asObservable();

  private achievements: Achievement[] = [
    {
      id: 'code-guess-master',
      title: 'Code Master',
      description: 'Complete all levels in Code Guess',
      icon: '🏆',
      gameId: 'code-guess',
      requirement: 'Complete all levels'
    },
    
  ];

  constructor() {
    this.loadProgress();
  }

  private loadProgress() {
    const storedProgress = localStorage.getItem('gameProgress');
    if (storedProgress) {
      this.progressSubject.next(JSON.parse(storedProgress));
    }
  }

  private saveProgress(progress: GameProgress[]) {
    localStorage.setItem('gameProgress', JSON.stringify(progress));
    this.progressSubject.next(progress);
  }

  getProgress(gameId: string): Observable<GameProgress | undefined> {
    return this.progress$.pipe(
      map(progress => progress.find(p => p.gameId === gameId))
    );
  }

  updateProgress(gameId: string, level: number, score: number): void {
    const currentProgress = this.progressSubject.value;
    const gameProgress = currentProgress.find(p => p.gameId === gameId);

    if (gameProgress) {
      if (!gameProgress.completedLevels.includes(level)) {
        gameProgress.completedLevels.push(level);
      }
      gameProgress.totalScore += score;
      gameProgress.lastPlayed = new Date();
    } else {
      currentProgress.push({
        gameId,
        completedLevels: [level],
        achievements: [],
        lastPlayed: new Date(),
        totalScore: score
      });
    }

    this.saveProgress(currentProgress);
    this.checkAchievements(gameId);
  }

  private checkAchievements(gameId: string): void {
    const currentProgress = this.progressSubject.value;
    const gameProgress = currentProgress.find(p => p.gameId === gameId);
    if (!gameProgress) return;

    const gameAchievements = this.achievements.filter(a => a.gameId === gameId);
    
    gameAchievements.forEach(achievement => {
      if (!gameProgress.achievements.includes(achievement.id)) {
        // Check if achievement requirements are met
        if (this.hasMetRequirement(gameProgress, achievement)) {
          gameProgress.achievements.push(achievement.id);
        }
      }
    });

    this.saveProgress(currentProgress);
  }

  private hasMetRequirement(progress: GameProgress, achievement: Achievement): boolean {
    switch (achievement.id) {
      case 'code-guess-master':
        return progress.completedLevels.length >= 10; // Assuming 10 levels total
      default:
        return false;
    }
  }

  getAchievements(gameId: string): Achievement[] {
    return this.achievements.filter(a => a.gameId === gameId);
  }

  getUserAchievements(gameId: string): Observable<string[]> {
    return this.getProgress(gameId).pipe(
      map(progress => progress?.achievements || [])
    );
  }

  resetProgress(gameId: string): void {
    const currentProgress = this.progressSubject.value;
    const updatedProgress = currentProgress.filter(p => p.gameId !== gameId);
    this.saveProgress(updatedProgress);
  }

  resetAllProgress(): void {
    this.saveProgress([]);
  }
} 