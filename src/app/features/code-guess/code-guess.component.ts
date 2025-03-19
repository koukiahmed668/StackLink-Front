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
    { word: 'SWIFT', category: 'Languages', hint: 'Apple\'s language for iOS/macOS' },
    { word: 'KOTLIN', category: 'Languages', hint: 'Modern Android language' },
    { word: 'PYTHON', category: 'Languages', hint: 'Known for readability and versatility' },
    { word: 'RUST', category: 'Languages', hint: 'Memory-safe systems language' },
    { word: 'SCALA', category: 'Languages', hint: 'Mix of OOP and functional on JVM' },
    { word: 'JAVA', category: 'Languages', hint: 'Write once, run anywhere' },
    { word: 'CSHARP', category: 'Languages', hint: 'Microsoft\'s .NET language' },
    { word: 'GOLANG', category: 'Languages', hint: 'Google\'s efficient language' },
    { word: 'RUBY', category: 'Languages', hint: 'Designed for programmer happiness' },
    { word: 'PHP', category: 'Languages', hint: 'Server-side web scripting' },
    { word: 'PERL', category: 'Languages', hint: 'Text processing & regex' },
    { word: 'BASH', category: 'Languages', hint: 'Unix shell scripting' },
    { word: 'LUA', category: 'Languages', hint: 'Embedded scripting language' },
    { word: 'CPP', category: 'Languages', hint: 'C with classes' },
    { word: 'DART', category: 'Languages', hint: 'Used with Flutter' },
    { word: 'JAVASCRIPT', category: 'Languages', hint: 'Web browser scripting' },
    { word: 'TYPESCRIPT', category: 'Languages', hint: 'JavaScript with types' },
    { word: 'HASKELL', category: 'Languages', hint: 'Purely functional language' },
    { word: 'CLOJURE', category: 'Languages', hint: 'Modern Lisp on JVM' },
    { word: 'ERLANG', category: 'Languages', hint: 'Built for concurrency' },
    { word: 'GROOVY', category: 'Languages', hint: 'Dynamic JVM language' },
    { word: 'FORTRAN', category: 'Languages', hint: 'Old scientific computing language' },
    { word: 'COBOL', category: 'Languages', hint: 'Business-oriented legacy language' },
    
    // Frameworks & Libraries
    { word: 'REACT', category: 'Frameworks', hint: 'UI library with virtual DOM' },
    { word: 'ANGULAR', category: 'Frameworks', hint: 'Google\'s TypeScript framework' },
    { word: 'SVELTE', category: 'Frameworks', hint: 'Compiles at build time' },
    { word: 'JQUERY', category: 'Frameworks', hint: 'Simplifies DOM manipulation' },
    { word: 'FLASK', category: 'Frameworks', hint: 'Lightweight Python web framework' },
    { word: 'DJANGO', category: 'Frameworks', hint: 'Batteries-included Python framework' },
    { word: 'SPRING', category: 'Frameworks', hint: 'Java enterprise framework' },
    { word: 'RAILS', category: 'Frameworks', hint: 'Ruby web framework with conventions' },
    { word: 'EXPRESS', category: 'Frameworks', hint: 'Minimal Node.js web framework' },
    { word: 'NEXT', category: 'Frameworks', hint: 'React with server-side rendering' },
    { word: 'LARAVEL', category: 'Frameworks', hint: 'Elegant PHP framework' },
    { word: 'VUE', category: 'Frameworks', hint: 'Progressive JS framework' },
    { word: 'NUXT', category: 'Frameworks', hint: 'Higher-level Vue framework' },
    { word: 'BOOTSTRAP', category: 'Frameworks', hint: 'Popular CSS framework' },
    { word: 'EMBER', category: 'Frameworks', hint: 'Opinionated JS framework' },
    { word: 'FASTAPI', category: 'Frameworks', hint: 'Fast Python API framework' },
    { word: 'METEOR', category: 'Frameworks', hint: 'Full-stack JS platform' },
    { word: 'GATSBY', category: 'Frameworks', hint: 'React-based static site generator' },
    { word: 'XAMARIN', category: 'Frameworks', hint: '.NET for mobile apps' },
    { word: 'FLUTTER', category: 'Frameworks', hint: 'Google\'s UI toolkit for mobile' },
    
    // Concepts
    { word: 'CLASS', category: 'Concepts', hint: 'OOP blueprint for objects' },
    { word: 'ARRAY', category: 'Concepts', hint: 'Collection of elements' },
    { word: 'STACK', category: 'Concepts', hint: 'LIFO data structure' },
    { word: 'QUEUE', category: 'Concepts', hint: 'FIFO data structure' },
    { word: 'GRAPH', category: 'Concepts', hint: 'Nodes connected by edges' },
    { word: 'TREE', category: 'Concepts', hint: 'Hierarchical data structure' },
    { word: 'CONST', category: 'Concepts', hint: 'Declares unchangeable values' },
    { word: 'AWAIT', category: 'Concepts', hint: 'Pauses for Promise resolution' },
    { word: 'YIELD', category: 'Concepts', hint: 'Used in generator functions' },
    { word: 'ASYNC', category: 'Concepts', hint: 'For asynchronous functions' },
    { word: 'PROPS', category: 'Concepts', hint: 'Component input in React' },
    { word: 'HOOKS', category: 'Concepts', hint: 'Function component features' },
    { word: 'STATE', category: 'Concepts', hint: 'Data that changes over time' },
    { word: 'LOOP', category: 'Concepts', hint: 'Repeats a code block' },
    { word: 'DEBUG', category: 'Concepts', hint: 'Finding and fixing bugs' },
    { word: 'VAR', category: 'Concepts', hint: 'Function-scoped variable' },
    { word: 'MAP', category: 'Concepts', hint: 'Key-value data structure' },
    { word: 'HASH', category: 'Concepts', hint: 'Fixed-size data conversion' },
    { word: 'CODE', category: 'Concepts', hint: 'Computer instructions' },
    { word: 'ALGORITHM', category: 'Concepts', hint: 'Step-by-step problem solution' },
    { word: 'RECURSION', category: 'Concepts', hint: 'Function calling itself' },
    { word: 'LAMBDA', category: 'Concepts', hint: 'Anonymous function' },
    { word: 'PATTERN', category: 'Concepts', hint: 'Reusable design solution' },
    { word: 'PROMISE', category: 'Concepts', hint: 'Async operation result' },
    { word: 'THREAD', category: 'Concepts', hint: 'Execution unit in a process' },
    { word: 'MUTEX', category: 'Concepts', hint: 'Mutual exclusion lock' },
    { word: 'STATIC', category: 'Concepts', hint: 'Class-level not instance-level' },
    { word: 'API', category: 'Concepts', hint: 'Interface between software' },
    
    // Tools
    { word: 'VSCODE', category: 'Tools', hint: 'Microsoft\'s code editor' },
    { word: 'GITHUB', category: 'Tools', hint: 'Web-based Git hosting' },
    { word: 'GITLAB', category: 'Tools', hint: 'DevOps platform with Git' },
    { word: 'DOCKER', category: 'Tools', hint: 'Container platform' },
    { word: 'JENKINS', category: 'Tools', hint: 'CI/CD automation server' },
    { word: 'JIRA', category: 'Tools', hint: 'Issue tracking software' },
    { word: 'BABEL', category: 'Tools', hint: 'JavaScript compiler' },
    { word: 'WEBPACK', category: 'Tools', hint: 'JS module bundler' },
    { word: 'NGINX', category: 'Tools', hint: 'Web server and proxy' },
    { word: 'REDIS', category: 'Tools', hint: 'In-memory data store' },
    { word: 'MYSQL', category: 'Tools', hint: 'Popular relational database' },
    { word: 'MONGO', category: 'Tools', hint: 'NoSQL document database' },
    { word: 'GIT', category: 'Tools', hint: 'Version control system' },
    { word: 'NPM', category: 'Tools', hint: 'Node package manager' },
    { word: 'YARN', category: 'Tools', hint: 'Alternative to NPM' },
    { word: 'KUBERNETES', category: 'Tools', hint: 'Container orchestration' },
    { word: 'TRAVIS', category: 'Tools', hint: 'CI service for GitHub' },
    { word: 'FIGMA', category: 'Tools', hint: 'Collaborative design tool' },
    { word: 'POSTMAN', category: 'Tools', hint: 'API testing platform' },
    { word: 'ESLINT', category: 'Tools', hint: 'JavaScript linter' },
    { word: 'JEST', category: 'Tools', hint: 'JS testing framework' },
    { word: 'HEROKU', category: 'Tools', hint: 'Cloud platform as a service' },
    { word: 'AWS', category: 'Tools', hint: 'Amazon\'s cloud services' }
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
  completeHint: boolean = false;
  
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
    this.completeHint = false;
    
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
            // Get the full definition
            const fullDefinition = meanings[0].definitions[0].definition;
            
            // Shorten the hint - take first part of definition up to 30 chars
            if (fullDefinition.length > 30) {
              // Try to cut at a sensible point (period, comma, or space)
              const periodIndex = fullDefinition.indexOf('.', 20);
              const commaIndex = fullDefinition.indexOf(',', 20);
              const spaceIndex = fullDefinition.indexOf(' ', 25);
              
              let cutIndex = 30;
              if (periodIndex > 0 && periodIndex < 40) cutIndex = periodIndex + 1;
              else if (commaIndex > 0 && commaIndex < 35) cutIndex = commaIndex + 1;
              else if (spaceIndex > 0 && spaceIndex < 35) cutIndex = spaceIndex;
              
              hint = fullDefinition.substring(0, cutIndex).trim();
              // Add ellipsis if we cut the definition
              if (hint.length < fullDefinition.length) hint += '...';
            } else {
              hint = fullDefinition;
            }
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
    if (!this.showHint) {
      // First click: show basic hint
      this.showHint = true;
      this.completeHint = false;
      this.stats.hintsUsed++;
      this.saveData();
    } else if (this.guesses.length >= 4 && !this.completeHint) {
      // Second click after 4+ guesses: show enhanced hint
      this.completeHint = true;
    } else {
      // Hide hint completely
      this.showHint = false;
      this.completeHint = false;
    }
  }
  
  getEnhancedHint(): string {
    if (!this.currentWordHint) return '';
    
    const category = this.wordPool.find(w => w.word === this.selectedWord)?.category || '';
    
    if (this.completeHint) {
      // Add the first letter hint to the regular hint
      return `${this.currentWordHint} (Starts with "${this.selectedWord[0]}")`;
    }
    
    return this.currentWordHint;
  }
} 