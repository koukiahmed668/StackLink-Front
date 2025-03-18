import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { Observable } from 'rxjs';

interface GuessResult {
  letter: string;
  state: 'correct' | 'present' | 'absent';
}

type Category = 'All' | 'Languages' | 'Frameworks' | 'Concepts' | 'Tools';

@Component({
  selector: 'app-code-guess',
  templateUrl: './code-guess.component.html',
  styleUrls: ['./code-guess.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class CodeGuessComponent implements OnInit {
  isDarkMode$: Observable<boolean>;
  wordPool: { word: string, category: Category }[] = [
    // Languages
    { word: 'SWIFT', category: 'Languages' },
    { word: 'KOTLIN', category: 'Languages' },
    { word: 'PYTHON', category: 'Languages' },
    { word: 'RUST', category: 'Languages' },
    { word: 'SCALA', category: 'Languages' },
    { word: 'JAVA', category: 'Languages' },
    { word: 'CSHARP', category: 'Languages' },
    { word: 'GOLANG', category: 'Languages' },
    { word: 'RUBY', category: 'Languages' },
    { word: 'PHP', category: 'Languages' },
    { word: 'PERL', category: 'Languages' },
    { word: 'BASH', category: 'Languages' },
    { word: 'LUA', category: 'Languages' },    // 3 letters
    { word: 'CPP', category: 'Languages' },    // 3 letters
    { word: 'DART', category: 'Languages' },   // 4 letters
    { word: 'JAVASCRIPT', category: 'Languages' }, // 10 letters
    { word: 'TYPESCRIPT', category: 'Languages' }, // 10 letters
    
    // Frameworks & Libraries
    { word: 'REACT', category: 'Frameworks' },
    { word: 'ANGULAR', category: 'Frameworks' },
    { word: 'SVELTE', category: 'Frameworks' },
    { word: 'JQUERY', category: 'Frameworks' },
    { word: 'FLASK', category: 'Frameworks' },
    { word: 'DJANGO', category: 'Frameworks' },
    { word: 'SPRING', category: 'Frameworks' },
    { word: 'RAILS', category: 'Frameworks' },
    { word: 'EXPRESS', category: 'Frameworks' },
    { word: 'NEXT', category: 'Frameworks' },
    { word: 'LARAVEL', category: 'Frameworks' },
    { word: 'VUE', category: 'Frameworks' },    // 3 letters
    { word: 'NUXT', category: 'Frameworks' },   // 4 letters
    { word: 'BOOTSTRAP', category: 'Frameworks' }, // 9 letters
    
    // Concepts
    { word: 'CLASS', category: 'Concepts' },
    { word: 'ARRAY', category: 'Concepts' },
    { word: 'STACK', category: 'Concepts' },
    { word: 'QUEUE', category: 'Concepts' },
    { word: 'GRAPH', category: 'Concepts' },
    { word: 'TREE', category: 'Concepts' },
    { word: 'CONST', category: 'Concepts' },
    { word: 'AWAIT', category: 'Concepts' },
    { word: 'YIELD', category: 'Concepts' },
    { word: 'ASYNC', category: 'Concepts' },
    { word: 'PROPS', category: 'Concepts' },
    { word: 'HOOKS', category: 'Concepts' },
    { word: 'STATE', category: 'Concepts' },
    { word: 'LOOP', category: 'Concepts' },
    { word: 'DEBUG', category: 'Concepts' },
    { word: 'VAR', category: 'Concepts' },     // 3 letters
    { word: 'MAP', category: 'Concepts' },     // 3 letters
    { word: 'HASH', category: 'Concepts' },    // 4 letters
    { word: 'CODE', category: 'Concepts' },    // 4 letters
    { word: 'ALGORITHM', category: 'Concepts' }, // 9 letters
    { word: 'RECURSION', category: 'Concepts' },  // 9 letters
    
    // Tools
    { word: 'VSCODE', category: 'Tools' },
    { word: 'GITHUB', category: 'Tools' },
    { word: 'GITLAB', category: 'Tools' },
    { word: 'DOCKER', category: 'Tools' },
    { word: 'JENKINS', category: 'Tools' },
    { word: 'JIRA', category: 'Tools' },
    { word: 'BABEL', category: 'Tools' },
    { word: 'WEBPACK', category: 'Tools' },
    { word: 'NGINX', category: 'Tools' },
    { word: 'REDIS', category: 'Tools' },
    { word: 'MYSQL', category: 'Tools' },
    { word: 'MONGO', category: 'Tools' },
    { word: 'GIT', category: 'Tools' },     // 3 letters
    { word: 'NPM', category: 'Tools' },     // 3 letters
    { word: 'YARN', category: 'Tools' },    // 4 letters
    { word: 'KUBERNETES', category: 'Tools' }  // 10 letters
  ];
  
  selectedWord: string = '';
  guesses: string[] = [];
  currentGuess: string = '';
  maxAttempts: number = 6;
  gameOver: boolean = false;
  won: boolean = false;
  errorMessage: string = '';
  keyboard: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];
  letterStates: { [key: string]: string } = {};
  
  // New features
  categories: Category[] = ['All', 'Languages', 'Frameworks', 'Concepts', 'Tools'];
  selectedCategory: Category = 'All';
  streakCount: number = 0;
  isDailyChallenge: boolean = false;
  dailyWord: string = '';
  dailyCompleted: boolean = false;
  achievements: { id: string, name: string, description: string, unlocked: boolean }[] = [
    { id: 'first-win', name: 'First Victory', description: 'Win your first game', unlocked: false },
    { id: 'streak-3', name: 'On Fire', description: 'Win 3 games in a row', unlocked: false },
    { id: 'streak-5', name: 'Unstoppable', description: 'Win 5 games in a row', unlocked: false },
    { id: 'guess-1', name: 'Lucky Guess', description: 'Guess the word on first try', unlocked: false },
    { id: 'all-categories', name: 'Jack of All Trades', description: 'Win at least once in each category', unlocked: false },
    { id: 'daily-5', name: 'Daily Player', description: 'Complete 5 daily challenges', unlocked: false }
  ];
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: number[];
    categoriesWon: Category[];
    dailyChallengesCompleted: number;
  } = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
    categoriesWon: [],
    dailyChallengesCompleted: 0
  };
  
  showStats: boolean = false;
  showAchievements: boolean = false;
  newAchievements: string[] = [];
  
  // Add word length property
  wordLength: number = 5;
  
  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }
  
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.gameOver) {
      return;
    }

    const key = event.key.toUpperCase();
    
    // Handle Enter key
    if (key === 'ENTER') {
      this.submitGuess();
      event.preventDefault();
    } 
    // Handle Backspace key
    else if (key === 'BACKSPACE' || key === 'DELETE' || event.key === 'Backspace' || event.key === 'Delete') {
      this.currentGuess = this.currentGuess.slice(0, -1);
      event.preventDefault();
    } 
    // Handle letter keys
    else if (this.currentGuess.length < this.wordLength && /^[A-Z]$/.test(key)) {
      this.currentGuess += key;
      event.preventDefault();
    }
  }
  
  ngOnInit(): void {
    this.loadSavedData();
    this.checkDailyChallenge();
    this.startNewGame();
  }
  
  loadSavedData(): void {
    const savedStats = localStorage.getItem('codeGuessStats');
    if (savedStats) {
      this.stats = JSON.parse(savedStats);
    }
    
    const savedAchievements = localStorage.getItem('codeGuessAchievements');
    if (savedAchievements) {
      this.achievements = JSON.parse(savedAchievements);
    }
  }
  
  saveData(): void {
    localStorage.setItem('codeGuessStats', JSON.stringify(this.stats));
    localStorage.setItem('codeGuessAchievements', JSON.stringify(this.achievements));
  }
  
  checkDailyChallenge(): void {
    const today = new Date().toISOString().split('T')[0];
    const lastDailyDate = localStorage.getItem('codeGuessDailyDate');
    
    if (lastDailyDate !== today) {
      // Reset daily challenge
      localStorage.setItem('codeGuessDailyDate', today);
      localStorage.removeItem('codeGuessDailyCompleted');
      this.dailyCompleted = false;
      
      // Generate a deterministic word based on the date
      const dateHash = this.hashCode(today);
      const wordIndex = Math.abs(dateHash) % this.wordPool.length;
      this.dailyWord = this.wordPool[wordIndex].word;
    } else {
      // Check if today's challenge is already completed
      this.dailyCompleted = localStorage.getItem('codeGuessDailyCompleted') === 'true';
      
      // Retrieve today's word
      const dateHash = this.hashCode(today);
      const wordIndex = Math.abs(dateHash) % this.wordPool.length;
      this.dailyWord = this.wordPool[wordIndex].word;
    }
  }
  
  hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
  
  selectCategory(category: Category): void {
    this.selectedCategory = category;
    this.startNewGame();
  }
  
  toggleDailyChallenge(): void {
    this.isDailyChallenge = !this.isDailyChallenge;
    this.resetGame();
  }
  
  startNewGame(): void {
    this.resetGame();
    
    if (this.isDailyChallenge) {
      if (this.dailyCompleted) {
        this.showStats = true;
        return;
      }
      this.selectedWord = this.dailyWord;
    } else {
      let filteredWords = this.wordPool;
      
      if (this.selectedCategory !== 'All') {
        filteredWords = this.wordPool.filter(w => w.category === this.selectedCategory);
      }
      
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      this.selectedWord = filteredWords[randomIndex].word;
    }
    
    // Set the word length based on the selected word
    this.wordLength = this.selectedWord.length;
  }
  
  resetGame(): void {
    this.guesses = [];
    this.currentGuess = '';
    this.gameOver = false;
    this.won = false;
    this.errorMessage = '';
    this.letterStates = {};
  }
  
  handleKeyboardInput(key: string): void {
    if (this.gameOver) {
      return;
    }
    
    if (key === 'ENTER') {
      this.submitGuess();
    } else if (key === 'BACKSPACE') {
      this.currentGuess = this.currentGuess.slice(0, -1);
    } else if (this.currentGuess.length < this.wordLength && /^[A-Z]$/.test(key)) {
      this.currentGuess += key;
    }
  }
  
  submitGuess(): void {
    if (this.currentGuess.length !== this.wordLength) {
      this.errorMessage = `Word must be ${this.wordLength} letters`;
      setTimeout(() => this.errorMessage = '', 2000);
      return;
    }
    
    this.guesses.push(this.currentGuess);
    
    // Update letter states for keyboard
    for (let i = 0; i < this.currentGuess.length; i++) {
      const letter = this.currentGuess[i];
      
      if (letter === this.selectedWord[i]) {
        this.letterStates[letter] = 'correct';
      } else if (this.selectedWord.includes(letter) && this.letterStates[letter] !== 'correct') {
        this.letterStates[letter] = 'present';
      } else if (!this.letterStates[letter]) {
        this.letterStates[letter] = 'absent';
      }
    }
    
    if (this.currentGuess === this.selectedWord) {
      this.gameOver = true;
      this.won = true;
      this.updateStats(true);
      this.checkAchievements();
      
      if (this.isDailyChallenge) {
        localStorage.setItem('codeGuessDailyCompleted', 'true');
        this.dailyCompleted = true;
        this.stats.dailyChallengesCompleted++;
      }
    } else if (this.guesses.length >= this.maxAttempts) {
      this.gameOver = true;
      this.updateStats(false);
    }
    
    this.currentGuess = '';
  }
  
  getStateForLetter(guess: string, position: number): string {
    const letter = guess[position];
    
    if (letter === this.selectedWord[position]) {
      return 'correct';
    } else if (this.selectedWord.includes(letter)) {
      return 'present';
    }
    return 'absent';
  }
  
  updateStats(won: boolean): void {
    this.stats.gamesPlayed++;
    
    if (won) {
      this.stats.gamesWon++;
      this.stats.currentStreak++;
      this.stats.maxStreak = Math.max(this.stats.currentStreak, this.stats.maxStreak);
      this.stats.guessDistribution[this.guesses.length - 1]++;
      
      const category = this.wordPool.find(w => w.word === this.selectedWord)?.category;
      if (category && !this.stats.categoriesWon.includes(category)) {
        this.stats.categoriesWon.push(category);
      }
    } else {
      this.stats.currentStreak = 0;
    }
    
    this.saveData();
  }
  
  checkAchievements(): void {
    this.newAchievements = [];
    
    // First win
    if (!this.achievements.find(a => a.id === 'first-win')?.unlocked && this.stats.gamesWon > 0) {
      this.unlockAchievement('first-win');
    }
    
    // Win streaks
    if (!this.achievements.find(a => a.id === 'streak-3')?.unlocked && this.stats.currentStreak >= 3) {
      this.unlockAchievement('streak-3');
    }
    
    if (!this.achievements.find(a => a.id === 'streak-5')?.unlocked && this.stats.currentStreak >= 5) {
      this.unlockAchievement('streak-5');
    }
    
    // First guess
    if (!this.achievements.find(a => a.id === 'guess-1')?.unlocked && this.guesses.length === 1 && this.won) {
      this.unlockAchievement('guess-1');
    }
    
    // All categories
    if (!this.achievements.find(a => a.id === 'all-categories')?.unlocked && 
        this.stats.categoriesWon.length >= this.categories.length - 1) { // -1 for 'All'
      this.unlockAchievement('all-categories');
    }
    
    // Daily challenges
    if (!this.achievements.find(a => a.id === 'daily-5')?.unlocked && this.stats.dailyChallengesCompleted >= 5) {
      this.unlockAchievement('daily-5');
    }
    
    this.saveData();
  }
  
  unlockAchievement(id: string): void {
    const achievement = this.achievements.find(a => a.id === id);
    if (achievement) {
      achievement.unlocked = true;
      this.newAchievements.push(achievement.name);
    }
  }
  
  shareResults(): void {
    let result = `Code Guess ${this.isDailyChallenge ? 'Daily' : ''} - ${this.guesses.length}/${this.maxAttempts}\n\n`;
    
    for (const guess of this.guesses) {
      for (let i = 0; i < guess.length; i++) {
        const state = this.getStateForLetter(guess, i);
        if (state === 'correct') {
          result += '🟩';
        } else if (state === 'present') {
          result += '🟨';
        } else {
          result += '⬛';
        }
      }
      result += '\n';
    }
    
    navigator.clipboard.writeText(result)
      .then(() => {
        this.errorMessage = 'Results copied to clipboard!';
        setTimeout(() => this.errorMessage = '', 2000);
      })
      .catch(() => {
        this.errorMessage = 'Failed to copy results';
        setTimeout(() => this.errorMessage = '', 2000);
      });
  }
  
  toggleStats(): void {
    this.showStats = !this.showStats;
    this.showAchievements = false;
  }
  
  toggleAchievements(): void {
    this.showAchievements = !this.showAchievements;
    this.showStats = false;
  }
  
  getWinPercentage(): number {
    if (this.stats.gamesPlayed === 0) return 0;
    return Math.round((this.stats.gamesWon / this.stats.gamesPlayed) * 100);
  }
  
  getMaxGuessDistribution(): number {
    return Math.max(...this.stats.guessDistribution, 1);
  }
} 