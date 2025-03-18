import { Component, OnDestroy, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  sampleInput: string;
  sampleOutput: string;
  testCases: { input: string; expectedOutput: string; }[];
  starterCode: string;
  solution: string;
  language: 'javascript' | 'python' | 'java' | 'csharp';
  hints?: string[];
}

interface LeaderboardEntry {
  name: string;
  score: number;
  challengesCompleted: number;
  totalTime: number;
}

@Component({
  selector: 'app-algorithm-runner',
  templateUrl: './algorithm-runner.component.html',
  styleUrls: ['./algorithm-runner.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class AlgorithmRunnerComponent implements OnDestroy, OnInit, AfterViewChecked {
  @ViewChild('codeEditor') codeEditor!: ElementRef;
  
  challenges: Challenge[] = [
    {
      id: 'reverse-string',
      title: 'Reverse a String',
      description: 'Write a function that reverses a string. The input string is given as an array of characters.',
      difficulty: 'Easy',
      sampleInput: '"hello"',
      sampleOutput: '"olleh"',
      testCases: [
        { input: '"hello"', expectedOutput: '"olleh"' },
        { input: '"world"', expectedOutput: '"dlrow"' },
        { input: '"algorithm"', expectedOutput: '"mhtirogla"' }
      ],
      starterCode: `function reverseString(str) {
  // Your code here
  
}`,
      solution: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
      language: 'javascript',
      hints: [
        'Try using string splitting to convert to array',
        'Arrays have a reverse() method',
        'Join the array back to a string'
      ]
    },
    {
      id: 'palindrome',
      title: 'Check Palindrome',
      description: 'Write a function that checks if a given string is a palindrome. A palindrome is a word that reads the same backward as forward.',
      difficulty: 'Easy',
      sampleInput: '"racecar"',
      sampleOutput: 'true',
      testCases: [
        { input: '"racecar"', expectedOutput: 'true' },
        { input: '"hello"', expectedOutput: 'false' },
        { input: '"A man a plan a canal Panama"', expectedOutput: 'true' }
      ],
      starterCode: `function isPalindrome(str) {
  // Your code here
  
}`,
      solution: `function isPalindrome(str) {
  const formattedStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return formattedStr === formattedStr.split('').reverse().join('');
}`,
      language: 'javascript',
      hints: [
        'Remember to handle uppercase and special characters',
        'You may need to normalize the string first',
        'You can compare a string with its reversed version'
      ]
    },
    {
      id: 'fizzbuzz',
      title: 'FizzBuzz',
      description: 'Write a function that returns an array with numbers from 1 to n. For multiples of 3, use "Fizz" instead of the number. For multiples of 5, use "Buzz". For numbers that are multiples of both 3 and 5, use "FizzBuzz".',
      difficulty: 'Easy',
      sampleInput: '15',
      sampleOutput: '[1, 2, "Fizz", 4, "Buzz", "Fizz", 7, 8, "Fizz", "Buzz", 11, "Fizz", 13, 14, "FizzBuzz"]',
      testCases: [
        { input: '5', expectedOutput: '[1, 2, "Fizz", 4, "Buzz"]' },
        { input: '15', expectedOutput: '[1, 2, "Fizz", 4, "Buzz", "Fizz", 7, 8, "Fizz", "Buzz", 11, "Fizz", 13, 14, "FizzBuzz"]' }
      ],
      starterCode: `function fizzBuzz(n) {
  // Your code here
  
}`,
      solution: `function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      result.push("FizzBuzz");
    } else if (i % 3 === 0) {
      result.push("Fizz");
    } else if (i % 5 === 0) {
      result.push("Buzz");
    } else {
      result.push(i);
    }
  }
  return result;
}`,
      language: 'javascript',
      hints: [
        'Use the modulo operator (%) to check divisibility',
        'Check for FizzBuzz case first (divisible by both 3 and 5)',
        'Remember to return an array of values'
      ]
    },
    {
      id: 'two-sum',
      title: 'Two Sum',
      description: 'Given an array of integers and a target, return indices of the two numbers such that they add up to the target.',
      difficulty: 'Medium',
      sampleInput: 'nums = [2, 7, 11, 15], target = 9',
      sampleOutput: '[0, 1]',
      testCases: [
        { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]' },
        { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]' },
        { input: '[3, 3], 6', expectedOutput: '[0, 1]' }
      ],
      starterCode: `function twoSum(nums, target) {
  // Your code here
  
}`,
      solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      language: 'javascript',
      hints: [
        'Consider using a hash map for O(n) time complexity',
        'For each number, check if its complement (target - num) exists',
        'Remember to return the indices, not the values'
      ]
    },
    {
      id: 'python-sum-array',
      title: 'Sum of Array',
      description: 'Write a function that calculates the sum of all numbers in a list.',
      difficulty: 'Easy',
      sampleInput: '[1, 2, 3, 4, 5]',
      sampleOutput: '15',
      testCases: [
        { input: '[1, 2, 3, 4, 5]', expectedOutput: '15' },
        { input: '[10, 20, 30]', expectedOutput: '60' },
        { input: '[-5, 5]', expectedOutput: '0' }
      ],
      starterCode: `def sum_array(numbers):
    # Your code here
    pass`,
      solution: `def sum_array(numbers):
    return sum(numbers)`,
      language: 'python',
      hints: [
        'Python has a built-in sum() function',
        'You can also use a loop to add each element',
        'Check for edge cases like empty lists'
      ]
    },
    {
      id: 'java-binary-search',
      title: 'Binary Search',
      description: 'Implement binary search in Java to find the position of a target value in a sorted array.',
      difficulty: 'Medium',
      sampleInput: 'arr = [1, 3, 5, 7, 9], target = 5',
      sampleOutput: '2',
      testCases: [
        { input: 'new int[]{1, 3, 5, 7, 9}, 5', expectedOutput: '2' },
        { input: 'new int[]{1, 3, 5, 7, 9}, 9', expectedOutput: '4' },
        { input: 'new int[]{1, 3, 5, 7, 9}, 6', expectedOutput: '-1' }
      ],
      starterCode: `public class Solution {
    public static int binarySearch(int[] arr, int target) {
        // Your code here
        return -1;
    }
}`,
      solution: `public class Solution {
    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) {
                return mid;
            }
            
            if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1;
    }
}`,
      language: 'java',
      hints: [
        'Use two pointers for the left and right boundaries',
        'Calculate the middle element using (left + right) / 2',
        'Adjust boundaries based on comparison with target'
      ]
    },
    {
      id: 'csharp-fibonacci',
      title: 'Fibonacci Sequence',
      description: 'Write a C# function to generate the nth Fibonacci number.',
      difficulty: 'Medium',
      sampleInput: '6',
      sampleOutput: '8',
      testCases: [
        { input: '0', expectedOutput: '0' },
        { input: '1', expectedOutput: '1' },
        { input: '6', expectedOutput: '8' },
        { input: '10', expectedOutput: '55' }
      ],
      starterCode: `using System;

public class Solution
{
    public static int Fibonacci(int n)
    {
        // Your code here
        return 0;
    }
}`,
      solution: `using System;

public class Solution
{
    public static int Fibonacci(int n)
    {
        if (n <= 1)
            return n;
            
        int a = 0, b = 1, c = 0;
        for (int i = 2; i <= n; i++)
        {
            c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}`,
      language: 'csharp',
      hints: [
        'Consider base cases (n=0, n=1) first',
        'You can use either recursion or iteration',
        'Iterative solution is more efficient for large n values'
      ]
    }
  ];

  userCode: string = '';
  currentChallengeIndex: number = 0;
  output: string = '';
  timerValue: number = 300; // 5 minutes in seconds
  timerInterval: any;
  gameStarted: boolean = false;
  gameComplete: boolean = false;
  submitted: boolean = false;
  testResults: { passed: boolean, input: string, expected: string, actual: string }[] = [];
  
  // Enhanced features
  isDarkMode: boolean = false;
  fontSize: number = 14;
  codeHighlighted: boolean = false;
  availableLanguages: string[] = ['All', 'JavaScript', 'Python', 'Java', 'C#'];
  selectedLanguage: string = 'All';
  availableDifficulties: string[] = ['All', 'Easy', 'Medium', 'Hard'];
  selectedDifficulty: string = 'All';
  filteredChallenges: Challenge[] = [];
  showHint: boolean = false;
  currentHintIndex: number = 0;
  username: string = localStorage.getItem('algorithmRunnerUsername') || '';
  showUsernamePrompt: boolean = !localStorage.getItem('algorithmRunnerUsername');
  leaderboard: LeaderboardEntry[] = [];
  showLeaderboard: boolean = false;
  achievements: { id: string, name: string, description: string, unlocked: boolean }[] = [
    { id: 'first-solve', name: 'First Steps', description: 'Solve your first challenge', unlocked: false },
    { id: 'all-easy', name: 'Warmed Up', description: 'Solve all easy challenges', unlocked: false },
    { id: 'all-medium', name: 'Code Warrior', description: 'Solve all medium challenges', unlocked: false },
    { id: 'all-languages', name: 'Polyglot', description: 'Solve challenges in all languages', unlocked: false },
    { id: 'speed-demon', name: 'Speed Demon', description: 'Solve a challenge in under 60 seconds', unlocked: false },
    { id: 'no-hints', name: 'Self Sufficient', description: 'Solve a challenge without using hints', unlocked: false }
  ];
  stats: {
    challengesCompleted: number;
    timeSpent: number;
    languagesUsed: string[];
    fastestSolve: number;
  } = {
    challengesCompleted: 0,
    timeSpent: 0,
    languagesUsed: [],
    fastestSolve: Infinity
  };
  showStats: boolean = false;
  showAchievements: boolean = false;
  newAchievements: string[] = [];
  elapsedTime: number = 0;
  
  // Expose Math and Infinity to the template
  readonly Math = Math;
  readonly Infinity = Infinity;
  
  constructor() { }

  ngOnInit(): void {
    this.loadSavedData();
    this.filterChallenges();
    this.loadLeaderboard();
  }
  
  ngAfterViewChecked(): void {
    if (this.codeEditor && !this.codeHighlighted) {
      this.highlightCode();
      this.codeHighlighted = true;
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
  
  loadSavedData(): void {
    const savedStats = localStorage.getItem('algorithmRunnerStats');
    if (savedStats) {
      this.stats = JSON.parse(savedStats);
    }
    
    const savedAchievements = localStorage.getItem('algorithmRunnerAchievements');
    if (savedAchievements) {
      this.achievements = JSON.parse(savedAchievements);
    }
  }
  
  saveData(): void {
    localStorage.setItem('algorithmRunnerStats', JSON.stringify(this.stats));
    localStorage.setItem('algorithmRunnerAchievements', JSON.stringify(this.achievements));
  }
  
  loadLeaderboard(): void {
    const savedLeaderboard = localStorage.getItem('algorithmRunnerLeaderboard');
    if (savedLeaderboard) {
      this.leaderboard = JSON.parse(savedLeaderboard);
    }
  }
  
  saveLeaderboard(): void {
    localStorage.setItem('algorithmRunnerLeaderboard', JSON.stringify(this.leaderboard));
  }
  
  filterChallenges(): void {
    this.filteredChallenges = this.challenges.filter(challenge => {
      const languageMatch = this.selectedLanguage === 'All' || 
                           (this.selectedLanguage === 'JavaScript' && challenge.language === 'javascript') ||
                           (this.selectedLanguage === 'Python' && challenge.language === 'python') ||
                           (this.selectedLanguage === 'Java' && challenge.language === 'java') ||
                           (this.selectedLanguage === 'C#' && challenge.language === 'csharp');
      
      const difficultyMatch = this.selectedDifficulty === 'All' || challenge.difficulty === this.selectedDifficulty;
      
      return languageMatch && difficultyMatch;
    });
    
    if (this.filteredChallenges.length > 0) {
      this.currentChallengeIndex = 0;
      this.resetChallenge();
    }
  }
  
  selectLanguage(language: string): void {
    this.selectedLanguage = language;
    this.filterChallenges();
  }
  
  selectDifficulty(difficulty: string): void {
    this.selectedDifficulty = difficulty;
    this.filterChallenges();
  }
  
  saveUsername(): void {
    if (this.username.trim()) {
      localStorage.setItem('algorithmRunnerUsername', this.username);
      this.showUsernamePrompt = false;
    }
  }

  get currentChallenge(): Challenge {
    return this.filteredChallenges[this.currentChallengeIndex];
  }
  
  get currentHint(): string {
    return this.currentChallenge?.hints?.[this.currentHintIndex] || 'No hints available';
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timerValue / 60);
    const seconds = this.timerValue % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  
  get formattedElapsedTime(): string {
    const minutes = Math.floor(this.elapsedTime / 60);
    const seconds = this.elapsedTime % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  startChallenge(): void {
    this.userCode = this.currentChallenge.starterCode;
    this.gameStarted = true;
    this.elapsedTime = 0;
    this.startTimer();
    this.highlightCode();
  }

  startTimer(): void {
    this.stopTimer(); // Clear any existing timer
    this.timerInterval = setInterval(() => {
      if (this.timerValue > 0) {
        this.timerValue--;
        this.elapsedTime++;
      } else {
        this.submitCode();
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  resetTimer(): void {
    this.timerValue = 300; // Reset to 5 minutes
    this.elapsedTime = 0;
  }
  
  resetChallenge(): void {
    this.userCode = this.currentChallenge?.starterCode || '';
    this.output = '';
    this.submitted = false;
    this.testResults = [];
    this.showHint = false;
    this.currentHintIndex = 0;
    this.codeHighlighted = false;
    this.resetTimer();
  }

  submitCode(): void {
    this.submitted = true;
    this.stopTimer();
    
    // Execute the user's code with the test cases
    this.testResults = [];
    let allPassed = true;
    
    for (const testCase of this.currentChallenge.testCases) {
      try {
        // Create a function from the user's code and adjust based on language
        let result;
        
        if (this.currentChallenge.language === 'javascript') {
          const userFunction = new Function('return ' + this.userCode)();
          
          // Extract function name from the code
          const funcNameMatch = this.userCode.match(/function\s+([a-zA-Z0-9_]+)/);
          const functionName = funcNameMatch ? funcNameMatch[1] : '';
          
          if (!functionName) {
            throw new Error('Could not extract function name from code');
          }
          
          // Parse input for JavaScript safely without using eval
          let input;
          try {
            // Use Function constructor instead of direct eval
            input = new Function('return ' + testCase.input)();
          } catch (error: any) {
            throw new Error('Could not parse input: ' + error.message);
          }
          
          result = userFunction(input);
        } else if (this.currentChallenge.language === 'python') {
          // For demo purposes, we're only showing the UI for Python
          // In a real app, you'd need server-side execution
          result = "Python execution not available in client-side";
        } else if (this.currentChallenge.language === 'java') {
          // For demo purposes, we're only showing the UI for Java
          result = "Java execution not available in client-side";
        } else if (this.currentChallenge.language === 'csharp') {
          // For demo purposes, we're only showing the UI for C#
          result = "C# execution not available in client-side";
        }
        
        const actual = JSON.stringify(result);
        const expected = testCase.expectedOutput;
        const passed = actual === expected;
        
        if (!passed) {
          allPassed = false;
        }
        
        this.testResults.push({
          passed,
          input: testCase.input,
          expected,
          actual
        });
      } catch (error: any) {
        this.testResults.push({
          passed: false,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: 'Error: ' + error.message
        });
        allPassed = false;
      }
    }
    
    if (allPassed) {
      // Update stats
      this.stats.challengesCompleted++;
      this.stats.timeSpent += this.elapsedTime;
      
      // Track languages used
      const language = this.getLanguageDisplayName(this.currentChallenge.language);
      if (!this.stats.languagesUsed.includes(language)) {
        this.stats.languagesUsed.push(language);
      }
      
      // Track fastest solve
      if (this.elapsedTime < this.stats.fastestSolve) {
        this.stats.fastestSolve = this.elapsedTime;
      }
      
      // Check achievements
      this.checkAchievements();
      
      // Update leaderboard
      this.updateLeaderboard();
      
      if (this.currentChallengeIndex < this.filteredChallenges.length - 1) {
        this.output = 'All tests passed! Moving to next challenge.';
        setTimeout(() => {
          this.currentChallengeIndex++;
          this.submitted = false;
          this.resetTimer();
          this.userCode = this.currentChallenge.starterCode;
          this.startTimer();
          this.codeHighlighted = false;
          setTimeout(() => this.highlightCode(), 100);
        }, 2000);
      } else {
        this.output = 'Congratulations! You completed all challenges!';
        this.gameComplete = true;
      }
    } else {
      this.output = 'Some tests failed. Try again!';
    }
    
    this.saveData();
  }
  
  checkAchievements(): void {
    this.newAchievements = [];
    
    // First solve
    if (!this.achievements.find(a => a.id === 'first-solve')?.unlocked) {
      this.unlockAchievement('first-solve');
    }
    
    // All easy challenges
    const easyDone = this.challenges
      .filter(c => c.difficulty === 'Easy')
      .every(c => this.stats.challengesCompleted > 0);
    
    if (easyDone && !this.achievements.find(a => a.id === 'all-easy')?.unlocked) {
      this.unlockAchievement('all-easy');
    }
    
    // All medium challenges
    const mediumDone = this.challenges
      .filter(c => c.difficulty === 'Medium')
      .every(c => this.stats.challengesCompleted > 0);
    
    if (mediumDone && !this.achievements.find(a => a.id === 'all-medium')?.unlocked) {
      this.unlockAchievement('all-medium');
    }
    
    // All languages
    if (this.stats.languagesUsed.length >= 4 && 
        !this.achievements.find(a => a.id === 'all-languages')?.unlocked) {
      this.unlockAchievement('all-languages');
    }
    
    // Speed demon
    if (this.elapsedTime <= 60 && 
        !this.achievements.find(a => a.id === 'speed-demon')?.unlocked) {
      this.unlockAchievement('speed-demon');
    }
    
    // No hints
    if (this.currentHintIndex === 0 && !this.showHint &&
        !this.achievements.find(a => a.id === 'no-hints')?.unlocked) {
      this.unlockAchievement('no-hints');
    }
  }
  
  unlockAchievement(id: string): void {
    const achievement = this.achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      this.newAchievements.push(achievement.name);
      setTimeout(() => {
        this.newAchievements = this.newAchievements.filter(a => a !== achievement.name);
      }, 3000);
    }
  }
  
  updateLeaderboard(): void {
    // Only update if user has a name
    if (!this.username) return;
    
    const existingEntry = this.leaderboard.find(entry => entry.name === this.username);
    
    if (existingEntry) {
      existingEntry.score += 100 - Math.min(this.elapsedTime, 90); // More points for faster solutions
      existingEntry.challengesCompleted++;
      existingEntry.totalTime += this.elapsedTime;
    } else {
      this.leaderboard.push({
        name: this.username,
        score: 100 - Math.min(this.elapsedTime, 90),
        challengesCompleted: 1,
        totalTime: this.elapsedTime
      });
    }
    
    // Sort by score (descending)
    this.leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top 10
    if (this.leaderboard.length > 10) {
      this.leaderboard = this.leaderboard.slice(0, 10);
    }
    
    this.saveLeaderboard();
  }

  resetGame(): void {
    this.currentChallengeIndex = 0;
    this.output = '';
    this.gameStarted = false;
    this.gameComplete = false;
    this.submitted = false;
    this.resetTimer();
    this.stopTimer();
    this.testResults = [];
    this.showHint = false;
    this.currentHintIndex = 0;
  }

  skipChallenge(): void {
    if (this.currentChallengeIndex < this.filteredChallenges.length - 1) {
      this.currentChallengeIndex++;
      this.submitted = false;
      this.resetTimer();
      this.userCode = this.currentChallenge.starterCode;
      this.startTimer();
      this.codeHighlighted = false;
      setTimeout(() => this.highlightCode(), 100);
    } else {
      this.output = 'This is the last challenge!';
    }
  }

  showSolution(): void {
    this.userCode = this.currentChallenge.solution;
    this.codeHighlighted = false;
    setTimeout(() => this.highlightCode(), 100);
  }
  
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.codeHighlighted = false;
    setTimeout(() => this.highlightCode(), 100);
  }
  
  increaseFontSize(): void {
    if (this.fontSize < 20) {
      this.fontSize++;
    }
  }
  
  decreaseFontSize(): void {
    if (this.fontSize > 10) {
      this.fontSize--;
    }
  }
  
  getNextHint(): void {
    if (this.currentChallenge?.hints && this.currentHintIndex < this.currentChallenge.hints.length - 1) {
      this.currentHintIndex++;
    }
    this.showHint = true;
  }
  
  getPrevHint(): void {
    if (this.currentHintIndex > 0) {
      this.currentHintIndex--;
    }
  }
  
  toggleHint(): void {
    this.showHint = !this.showHint;
  }
  
  toggleLeaderboard(): void {
    this.showLeaderboard = !this.showLeaderboard;
  }
  
  toggleStats(): void {
    this.showStats = !this.showStats;
    this.showAchievements = false;
  }
  
  toggleAchievements(): void {
    this.showAchievements = !this.showAchievements;
    this.showStats = false;
  }
  
  getLanguageDisplayName(language: string): string {
    switch (language) {
      case 'javascript': return 'JavaScript';
      case 'python': return 'Python';
      case 'java': return 'Java';
      case 'csharp': return 'C#';
      default: return language;
    }
  }
  
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  }
  
  formatAverageTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  }
  
  allTestsPassed(): boolean {
    return this.testResults.length > 0 && this.testResults.every(t => t.passed);
  }
  
  highlightCode(): void {
    setTimeout(() => {
      if (this.codeEditor?.nativeElement) {
        Prism.highlightElement(this.codeEditor.nativeElement);
      }
    }, 0);
  }
} 