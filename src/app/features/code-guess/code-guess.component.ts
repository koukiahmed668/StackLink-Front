import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { Observable, lastValueFrom } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface GuessResult {
  letter: string;
  state: 'correct' | 'present' | 'absent';
}

type Category = 'All' | 'Languages' | 'Frameworks' | 'Concepts' | 'Tools' | 'General';

interface WordWithHint {
  word: string;
  category: Category;
  hint?: string;
}

@Component({
  selector: 'app-code-guess',
  templateUrl: './code-guess.component.html',
  styleUrls: ['./code-guess.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ]
})
export class CodeGuessComponent implements OnInit {
  isDarkMode$: Observable<boolean>;
  wordPool: { word: string, category: Category, hint?: string }[] = [
    // Languages
    { word: 'SWIFT', category: 'Languages', hint: 'Apple\'s programming language for iOS and macOS development' },
    { word: 'KOTLIN', category: 'Languages', hint: 'Modern language developed by JetBrains, official for Android' },
    { word: 'PYTHON', category: 'Languages', hint: 'Interpreted language known for readability and versatility' },
    { word: 'RUST', category: 'Languages', hint: 'Systems language focused on safety and performance' },
    { word: 'SCALA', category: 'Languages', hint: 'Combines object-oriented and functional programming on the JVM' },
    { word: 'JAVA', category: 'Languages', hint: 'Object-oriented language with "write once, run anywhere" philosophy' },
    { word: 'CSHARP', category: 'Languages', hint: 'Microsoft\'s language for .NET platform, pronounced "C-sharp"' },
    { word: 'GOLANG', category: 'Languages', hint: 'Developed at Google, focused on simplicity and efficiency' },
    { word: 'RUBY', category: 'Languages', hint: 'Dynamic language designed for programmer happiness' },
    { word: 'PHP', category: 'Languages', hint: 'Server-side scripting language for web development' },
    { word: 'PERL', category: 'Languages', hint: 'Text processing language known for regular expressions' },
    { word: 'BASH', category: 'Languages', hint: 'Unix shell and command language' },
    { word: 'LUA', category: 'Languages', hint: 'Lightweight embedded scripting language' },
    { word: 'CPP', category: 'Languages', hint: 'Extension of C with object-oriented features' },
    { word: 'DART', category: 'Languages', hint: 'Developed by Google, used with Flutter framework' },
    { word: 'JAVASCRIPT', category: 'Languages', hint: 'Scripting language for the web, runs in browsers' },
    { word: 'TYPESCRIPT', category: 'Languages', hint: 'Adds static typing to JavaScript' },
    { word: 'HASKELL', category: 'Languages', hint: 'Purely functional programming language' },
    { word: 'CLOJURE', category: 'Languages', hint: 'Modern Lisp dialect on the JVM' },
    { word: 'ERLANG', category: 'Languages', hint: 'Functional language designed for concurrent systems' },
    { word: 'GROOVY', category: 'Languages', hint: 'Dynamic language for the Java platform' },
    { word: 'FORTRAN', category: 'Languages', hint: 'One of the oldest programming languages, used in scientific computing' },
    { word: 'COBOL', category: 'Languages', hint: 'Business-oriented language from the 1950s, still used in legacy systems' },
    
    // Frameworks & Libraries
    { word: 'REACT', category: 'Frameworks', hint: 'Facebook\'s JavaScript library for building user interfaces' },
    { word: 'ANGULAR', category: 'Frameworks', hint: 'Google\'s TypeScript-based web framework' },
    { word: 'SVELTE', category: 'Frameworks', hint: 'Compiler-based framework that does the work at build time' },
    { word: 'JQUERY', category: 'Frameworks', hint: 'JavaScript library that simplifies DOM manipulation' },
    { word: 'FLASK', category: 'Frameworks', hint: 'Lightweight web framework for Python' },
    { word: 'DJANGO', category: 'Frameworks', hint: 'High-level Python web framework with "batteries included"' },
    { word: 'SPRING', category: 'Frameworks', hint: 'Java platform providing infrastructure support' },
    { word: 'RAILS', category: 'Frameworks', hint: 'Ruby web application framework using MVC pattern' },
    { word: 'EXPRESS', category: 'Frameworks', hint: 'Minimal Node.js web application framework' },
    { word: 'NEXT', category: 'Frameworks', hint: 'React framework for production with server-side rendering' },
    { word: 'LARAVEL', category: 'Frameworks', hint: 'PHP web framework with elegant syntax' },
    { word: 'VUE', category: 'Frameworks', hint: 'Progressive JavaScript framework for building UIs' },
    { word: 'NUXT', category: 'Frameworks', hint: 'Higher-level framework built on Vue.js' },
    { word: 'BOOTSTRAP', category: 'Frameworks', hint: 'Popular CSS framework for responsive design' },
    { word: 'EMBER', category: 'Frameworks', hint: 'JavaScript framework for ambitious web applications' },
    { word: 'FASTAPI', category: 'Frameworks', hint: 'Modern Python web framework with automatic docs' },
    { word: 'METEOR', category: 'Frameworks', hint: 'Full-stack JavaScript platform for web and mobile' },
    { word: 'GATSBY', category: 'Frameworks', hint: 'React-based static site generator' },
    { word: 'XAMARIN', category: 'Frameworks', hint: 'Microsoft\'s platform for building mobile apps with .NET' },
    { word: 'FLUTTER', category: 'Frameworks', hint: 'Google\'s UI toolkit for building natively compiled applications' },
    
    // Concepts
    { word: 'CLASS', category: 'Concepts', hint: 'Blueprint for creating objects in OOP' },
    { word: 'ARRAY', category: 'Concepts', hint: 'Data structure to store a collection of elements' },
    { word: 'STACK', category: 'Concepts', hint: 'LIFO (Last In, First Out) data structure' },
    { word: 'QUEUE', category: 'Concepts', hint: 'FIFO (First In, First Out) data structure' },
    { word: 'GRAPH', category: 'Concepts', hint: 'Data structure with nodes and edges' },
    { word: 'TREE', category: 'Concepts', hint: 'Hierarchical data structure with nodes and branches' },
    { word: 'CONST', category: 'Concepts', hint: 'Keyword to declare constants that cannot be reassigned' },
    { word: 'AWAIT', category: 'Concepts', hint: 'Used to pause execution until a Promise resolves' },
    { word: 'YIELD', category: 'Concepts', hint: 'Keyword used in generators to pause and resume function execution' },
    { word: 'ASYNC', category: 'Concepts', hint: 'Keyword to define functions that return Promises' },
    { word: 'PROPS', category: 'Concepts', hint: 'Properties passed to components in React' },
    { word: 'HOOKS', category: 'Concepts', hint: 'Functions that let you use state in functional components' },
    { word: 'STATE', category: 'Concepts', hint: 'Data that changes over time in an application' },
    { word: 'LOOP', category: 'Concepts', hint: 'Control structure that repeats a block of code' },
    { word: 'DEBUG', category: 'Concepts', hint: 'Process of finding and fixing errors in code' },
    { word: 'VAR', category: 'Concepts', hint: 'Keyword for declaring variables with function scope' },
    { word: 'MAP', category: 'Concepts', hint: 'Data structure that stores key-value pairs' },
    { word: 'HASH', category: 'Concepts', hint: 'Function that converts data to a fixed-size value' },
    { word: 'CODE', category: 'Concepts', hint: 'Set of instructions for computers to follow' },
    { word: 'ALGORITHM', category: 'Concepts', hint: 'Step-by-step procedure for solving a problem' },
    { word: 'RECURSION', category: 'Concepts', hint: 'Process where a function calls itself' },
    { word: 'LAMBDA', category: 'Concepts', hint: 'Anonymous function expression' },
    { word: 'PATTERN', category: 'Concepts', hint: 'Reusable solution to a common problem in software design' },
    { word: 'PROMISE', category: 'Concepts', hint: 'Object representing eventual completion of an async operation' },
    { word: 'THREAD', category: 'Concepts', hint: 'Smallest unit of execution in a process' },
    { word: 'MUTEX', category: 'Concepts', hint: 'Mechanism for ensuring mutual exclusion in concurrent systems' },
    { word: 'STATIC', category: 'Concepts', hint: 'Keyword for elements belonging to a class rather than instances' },
    { word: 'API', category: 'Concepts', hint: 'Interface allowing different software to communicate' },
    
    // Tools
    { word: 'VSCODE', category: 'Tools', hint: 'Microsoft\'s free, open-source code editor' },
    { word: 'GITHUB', category: 'Tools', hint: 'Web-based platform for version control using Git' },
    { word: 'GITLAB', category: 'Tools', hint: 'Web-based DevOps platform with Git repository manager' },
    { word: 'DOCKER', category: 'Tools', hint: 'Platform for developing and deploying applications in containers' },
    { word: 'JENKINS', category: 'Tools', hint: 'Open-source automation server for CI/CD pipelines' },
    { word: 'JIRA', category: 'Tools', hint: 'Issue tracking and project management tool' },
    { word: 'BABEL', category: 'Tools', hint: 'JavaScript compiler that converts modern JS to backwards compatible versions' },
    { word: 'WEBPACK', category: 'Tools', hint: 'Module bundler for JavaScript applications' },
    { word: 'NGINX', category: 'Tools', hint: 'Web server that can also be used as reverse proxy and load balancer' },
    { word: 'REDIS', category: 'Tools', hint: 'In-memory data structure store used as database or cache' },
    { word: 'MYSQL', category: 'Tools', hint: 'Popular open-source relational database management system' },
    { word: 'MONGO', category: 'Tools', hint: 'Document-oriented NoSQL database' },
    { word: 'GIT', category: 'Tools', hint: 'Distributed version control system' },
    { word: 'NPM', category: 'Tools', hint: 'Package manager for JavaScript' },
    { word: 'YARN', category: 'Tools', hint: 'Alternative package manager for JavaScript' },
    { word: 'KUBERNETES', category: 'Tools', hint: 'Container orchestration system for automating deployment' },
    { word: 'TRAVIS', category: 'Tools', hint: 'CI/CD service used to build and test projects hosted on GitHub' },
    { word: 'FIGMA', category: 'Tools', hint: 'Cloud-based design and prototyping tool' },
    { word: 'POSTMAN', category: 'Tools', hint: 'API platform for building and testing APIs' },
    { word: 'ESLINT', category: 'Tools', hint: 'Static code analysis tool for JavaScript' },
    { word: 'JEST', category: 'Tools', hint: 'JavaScript testing framework focused on simplicity' },
    { word: 'HEROKU', category: 'Tools', hint: 'Cloud platform as a service for deploying applications' },
    { word: 'AWS', category: 'Tools', hint: 'Amazon\'s cloud computing platform' }
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
  categories: Category[] = ['All', 'Languages', 'Frameworks', 'Concepts', 'Tools', 'General'];
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
    { id: 'daily-5', name: 'Daily Player', description: 'Complete 5 daily challenges', unlocked: false },
    { id: 'hint-win', name: 'Guided Victory', description: 'Win a game after using a hint', unlocked: false },
    { id: 'general-win', name: 'General Knowledge', description: 'Win with a general word', unlocked: false }
  ];
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: number[];
    categoriesWon: Category[];
    dailyChallengesCompleted: number;
    hintsUsed: number;
  } = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
    categoriesWon: [],
    dailyChallengesCompleted: 0,
    hintsUsed: 0
  };
  
  showStats: boolean = false;
  showAchievements: boolean = false;
  newAchievements: string[] = [];
  
  // Add word length property
  wordLength: number = 5;
  
  // Add properties for hints
  currentWordHint: string = '';
  showHint: boolean = false;
  
  // Add property for API words
  generalWords: WordWithHint[] = [];
  isLoadingWords: boolean = false;
  
  constructor(private themeService: ThemeService, private http: HttpClient) {
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
    this.loadGeneralWords();
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
    
    // Wait until we have words in the pool
    if (this.wordPool.length === 0) {
      setTimeout(() => this.checkDailyChallenge(), 500);
      return;
    }
    
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
    this.showHint = false;
    this.startNewGame();
  }
  
  toggleDailyChallenge(): void {
    this.isDailyChallenge = !this.isDailyChallenge;
    this.showHint = false;
    this.resetGame();
  }
  
  startNewGame(): void {
    this.resetGame();
    
    // Clear any achievement notifications
    this.newAchievements = [];
    
    // If the word pool is empty (perhaps still loading), wait a bit
    if (this.wordPool.length === 0) {
      setTimeout(() => this.startNewGame(), 500);
      return;
    }
    
    if (this.isDailyChallenge) {
      if (this.dailyCompleted) {
        this.showStats = true;
        return;
      }
      this.selectedWord = this.dailyWord;
      // Find hint for the selected word
      this.findHintForSelectedWord();
    } else {
      let filteredWords = this.wordPool;
      
      if (this.selectedCategory !== 'All') {
        filteredWords = this.wordPool.filter(w => w.category === this.selectedCategory);
      }
      
      if (filteredWords.length === 0) {
        // Fallback to all words if no words in selected category
        filteredWords = this.wordPool;
      }
      
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      const selectedWordObj = filteredWords[randomIndex];
      this.selectedWord = selectedWordObj.word;
      
      // Store the hint if available
      this.currentWordHint = selectedWordObj.hint || '';
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
    this.showHint = false;
    
    // Clear achievement notifications
    this.newAchievements = [];
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
    
    // Hint usage win
    if (!this.achievements.find(a => a.id === 'hint-win')?.unlocked && this.stats.hintsUsed > 0 && this.won) {
      this.unlockAchievement('hint-win');
    }
    
    // General word win
    const currentWordObj = this.wordPool.find(w => w.word === this.selectedWord);
    if (!this.achievements.find(a => a.id === 'general-win')?.unlocked && 
        currentWordObj?.category === 'General' && this.won) {
      this.unlockAchievement('general-win');
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
  
  // Load general words from API
  loadGeneralWords(): void {
    this.isLoadingWords = true;
    
    // Using the Free Dictionary API to get words and definitions
    // We'll fetch common words and store their definitions as hints
    const commonWords = ['apple', 'house', 'happy', 'music', 'ocean', 'dream', 'smile', 'light', 'earth', 'paper',
                         'water', 'bread', 'green', 'cloud', 'table', 'river', 'movie', 'plant', 'night', 'beach'];
                         
    // Using a random selection of words
    const wordsToFetch = commonWords.sort(() => 0.5 - Math.random()).slice(0, 10);
    
    const requests = wordsToFetch.map(async (word) => {
      try {
        const response = await lastValueFrom(
          this.http.get<any[]>(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        );
        
        if (response && response.length > 0) {
          const meanings = response[0].meanings;
          let hint = '';
          
          if (meanings && meanings.length > 0 && meanings[0].definitions.length > 0) {
            hint = meanings[0].definitions[0].definition;
          }
          
          return {
            word: word.toUpperCase(),
            category: 'General' as Category,
            hint: hint
          } as WordWithHint;
        }
        return null;
      } catch (error) {
        console.error(`Error fetching definition for ${word}:`, error);
        return null;
      }
    });
    
    Promise.all(requests)
      .then(results => {
        const validResults: WordWithHint[] = [];
        
        for (const result of results) {
          if (result !== null) {
            validResults.push(result);
          }
        }
        
        this.generalWords = validResults;
        
        // Add these to the word pool
        this.wordPool = [
          ...this.wordPool,
          ...this.generalWords
        ];
        
        this.isLoadingWords = false;
      });
  }
  
  findHintForSelectedWord(): void {
    // Find the hint for the selected word
    const wordObject = this.wordPool.find(w => w.word === this.selectedWord);
    this.currentWordHint = wordObject?.hint || '';
  }
  
  toggleHint(): void {
    this.showHint = !this.showHint;
    
    if (this.showHint) {
      this.stats.hintsUsed++;
      this.saveData();
    }
  }
} 