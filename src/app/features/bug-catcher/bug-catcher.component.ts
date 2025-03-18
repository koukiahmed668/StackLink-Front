import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CodeChallenge {
  code: string;
  bugs: { line: number; description: string; }[];
  foundBugs: number[];
  language: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  title: string;
}

@Component({
  selector: 'app-bug-catcher',
  templateUrl: './bug-catcher.component.html',
  styleUrls: ['./bug-catcher.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class BugCatcherComponent implements OnInit {
  challenges: CodeChallenge[] = [
    // JavaScript Challenges
    {
      language: 'JavaScript',
      title: 'Shopping Cart Total',
      difficulty: 'Easy',
      code: `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
  return total
}

function applyDiscount(total, discountCode) {
  if (discountCode = "SAVE10") {
    return total * 0.9;
  } else if (discountCode == "SAVE20") {
    return total * 0.8;
  }
}

const cart = [
  { id: 1, name: "Keyboard", price: 45.99 },
  { id: 2, name: "Mouse", price: 29.99 },
  { id: 3, name: "Monitor", price: 159.99 }
];

const total = calculateTotal(cart);
const discountedTotal = applyDiscount(total, "SAVE10");
console.log("Your total is: " + discountedTotal);`,
      bugs: [
        { line: 3, description: 'Loop goes out of bounds with <= instead of <' },
        { line: 6, description: 'Missing semicolon at the end of the return statement' },
        { line: 10, description: 'Assignment operator (=) used instead of comparison operator (==)' },
        { line: 14, description: 'No return statement for other discount codes' }
      ],
      foundBugs: []
    },
    {
      language: 'JavaScript',
      title: 'Event Listener Manager',
      difficulty: 'Medium',
      code: `class EventManager {
  constructor() {
    this.events = {};
  }
  
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
    return this;
  }
  
  off(eventName, callback) {
    if (!this.events[eventName]) {
      return this;
    }
    
    this.events[eventName] = this.events[eventName].filter(
      cb => cb != callback
    );
    
    return this;
  }
  
  emit(eventName, data) {
    if (!this.events[eventName]) {
      return this;
    }
    
    const callbacks = this.events[eventName];
    for (var i = 0; i < callbacks.length(); i++) {
      callbacks[i](data);
    }
    
    return;
  }
}

const manager = new EventManager();
const logMessage = (message) => console.log('Log:', message);
const showError = (message) => console.error('Error:', message);

manager.on('message', logMessage)
manager.on('error', showError);

manager.emit('message', 'Hello World');
manager.off('error');
manager.emit('error', 'Something went wrong');`,
      bugs: [
        { line: 16, description: 'Using loose equality (!=) instead of strict equality (!==)' },
        { line: 27, description: 'Using var instead of let/const for loop variable' },
        { line: 27, description: 'Calling .length as a function instead of accessing the property' },
        { line: 32, description: 'Using return without a value, should return this for chaining' },
        { line: 39, description: 'Missing semicolon after statement' },
        { line: 42, description: 'off() method requires callback parameter but none is provided' }
      ],
      foundBugs: []
    },
    
    // Python Challenges
    {
      language: 'Python',
      title: 'Data Processor',
      difficulty: 'Easy',
      code: `def find_max(numbers):
    max_value = numbers[0]
    for num in numbers:
        if num < max_value:
            max_value = num
    return max_value

def filter_even_numbers(numbers):
    even_numbers = []
    for num in numbers:
        if num % 2 == 0
            even_numbers.append(num)
    return even_numbers

numbers = [5, 8, 12, 3, 7, 9, 15]
max_number = find_max(numbers)
even_list = filter_even_numbers(numbers)
print(f"Max number: {max_number}")
print(f"Even numbers: {even_list}")`,
      bugs: [
        { line: 4, description: 'Comparison should be > for finding maximum, not <' },
        { line: 11, description: 'Missing colon after if statement' },
        { line: 15, description: 'Function will return minimum value, not maximum' }
      ],
      foundBugs: []
    },
    {
      language: 'Python',
      title: 'Student Management System',
      difficulty: 'Medium',
      code: `class Student:
    def __init__(self, name, age, grades=[]):
        self.name = name
        self.age = age
        self.grades = grades
    
    def add_grade(self, grade):
        self.grades.append(grade)
    
    def get_average_grade(self):
        return sum(self.grades) / len(self.grades)

class Course:
    def __init__(self, name, max_students):
        self.name = name
        self.max_students = max_students
        self.students = []
    
    def add_student(self, student):
        if len(self.students) < self.max_students
            self.students.append(student)
            return True
        return False
    
    def get_average_grade(self):
        total = 0
        for student in self.students:
            total += student.get_average_grade
        return total / len(self.students)


math_course = Course("Mathematics", 2)
john = Student("John", 19)
jane = Student("Jane", 18)

john.add_grade(85)
john.add_grade(90)
jane.add_grade(95)
jane.add_grade(100)

math_course.add_student(john)
math_course.add_student(jane)

print(f"Course Average: {math_course.get_average_grade()}")`,
      bugs: [
        { line: 2, description: 'Mutable default argument (grades=[]) can cause unexpected behavior' },
        { line: 19, description: 'Missing colon after if statement' },
        { line: 27, description: 'Accessing get_average_grade as a property instead of calling the method' },
        { line: 28, description: 'Division by zero error if there are no students' }
      ],
      foundBugs: []
    },
    
    // Java Challenges
    {
      language: 'Java',
      title: 'Banking System',
      difficulty: 'Medium',
      code: `public class BankAccount {
    private String accountNumber;
    private double balance;
    private String ownerName;
    
    public BankAccount(String accountNumber, String ownerName) {
        this.accountNumber = accountNumber;
        this.ownerName = ownerName;
        balance = 0.0;
    }
    
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    
    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            amount -= balance;
            return true;
        }
        return false;
    }
    
    public double getBalance() {
        return balance;
    }
}

public class Bank {
    private BankAccount[] accounts;
    private int numberOfAccounts;
    
    public Bank(int maxAccounts) {
        accounts = new BankAccount[maxAccounts];
        numberOfAccounts = 0;
    }
    
    public void addAccount(BankAccount account) {
        if (numberOfAccounts < accounts.length) {
            accounts[numberOfAccounts] = account;
            numberOfAccounts++;
        }
    }
    
    public BankAccount findAccount(String accountNumber) {
        for (int i = 0; i <= numberOfAccounts; i++) {
            if (accounts[i].getAccountNumber().equals(accountNumber)) {
                return accounts[i];
            }
        }
        return null;
    }
}`,
      bugs: [
        { line: 17, description: 'Subtracting amount from balance incorrectly, should be "balance -= amount"' },
        { line: 44, description: 'Loop bound should be < numberOfAccounts, not <= (to avoid index out of bounds)' },
        { line: 45, description: 'Missing getAccountNumber() method in BankAccount class' }
      ],
      foundBugs: []
    },
    
    // C# Challenges
    {
      language: 'C#',
      title: 'Game Character Controller',
      difficulty: 'Hard',
      code: `using System;
using System.Collections.Generic;

public class Character
{
    public string Name { get; private set; }
    public int Health { get; private set; }
    public int MaxHealth { get; private set; }
    public List<Item> Inventory { get; private set; }
    
    public Character(string name, int maxHealth)
    {
        Name = name;
        MaxHealth = maxHealth;
        Health = MaxHealth;
        Inventory = new List<Item>();
    }
    
    public void TakeDamage(int amount)
    {
        if (amount < 0) return;
        
        Health -= amount;
        if (Health < 0) Health = 0;
    }
    
    public void Heal(int amount)
    {
        if (amount < 0) return;
        
        Health += amount;
        if (Health > MaxHealth);
            Health = MaxHealth;
    }
    
    public void AddItem(Item item)
    {
        if (item != null)
            Inventory.Add(item);
    }
    
    public bool UseItem(string itemName)
    {
        for (int i = 0; i < Inventory.Count; i++)
        {
            if (Inventory[i].Name = itemName)
            {
                if (Inventory[i].Use(this))
                {
                    Inventory.RemoveAt(i);
                    return true;
                }
            }
        }
        return false;
    }
}

public class Item
{
    public string Name { get; private set; }
    public string Description { get; private set; }
    
    public Item(string name, string description)
    {
        Name = name;
        Description = description;
    }
    
    public virtual bool Use(Character character)
    {
        return false;
    }
}

public class HealthPotion : Item
{
    private int HealAmount { get; set; }
    
    public HealthPotion(int healAmount) : base("Health Potion", "Restores health")
    {
        HealAmount = healAmount;
    }
    
    public override bool Use(Character character)
    {
        character.Heal(HealAmount);
        return true;
    }
}`,
      bugs: [
        { line: 30, description: 'Unnecessary semicolon after if statement creating empty block' },
        { line: 43, description: 'Using assignment (=) instead of comparison (==) in if condition' },
        { line: 48, description: 'No null check before accessing Inventory[i]' }
      ],
      foundBugs: []
    }
  ];

  currentChallengeIndex: number = 0;
  selectedLine: number | null = null;
  score: number = 0;
  gameComplete: boolean = false;
  message: string = '';
  
  // Enhanced features
  availableLanguages: string[] = ['All', 'JavaScript', 'Python', 'Java', 'C#'];
  selectedLanguage: string = 'All';
  availableDifficulties: string[] = ['All', 'Easy', 'Medium', 'Hard'];
  selectedDifficulty: string = 'All';
  filteredChallenges: CodeChallenge[] = [];
  remainingHints: number = 3;
  showHint: boolean = false;
  currentHint: string = '';
  achievements: { id: string, name: string, description: string, unlocked: boolean }[] = [
    { id: 'first-bug', name: 'Bug Squasher', description: 'Find your first bug', unlocked: false },
    { id: 'perfect-challenge', name: 'Perfect Eye', description: 'Find all bugs in a challenge without mistakes', unlocked: false },
    { id: 'js-master', name: 'JavaScript Pro', description: 'Complete all JavaScript challenges', unlocked: false },
    { id: 'python-master', name: 'Python Pro', description: 'Complete all Python challenges', unlocked: false },
    { id: 'all-languages', name: 'Polyglot', description: 'Find bugs in all programming languages', unlocked: false },
    { id: 'hard-challenge', name: 'Bug Hunter', description: 'Complete a hard difficulty challenge', unlocked: false }
  ];
  newAchievements: string[] = [];
  stats: {
    bugsFound: number;
    mistakesMade: number;
    challengesCompleted: number;
    languagesCompleted: string[];
  } = {
    bugsFound: 0,
    mistakesMade: 0,
    challengesCompleted: 0,
    languagesCompleted: []
  };
  showStats: boolean = false;
  mistakesInCurrentChallenge: number = 0;
  
  ngOnInit(): void {
    this.loadSavedData();
    this.filterChallenges();
  }
  
  loadSavedData(): void {
    const savedStats = localStorage.getItem('bugCatcherStats');
    if (savedStats) {
      this.stats = JSON.parse(savedStats);
    }
    
    const savedAchievements = localStorage.getItem('bugCatcherAchievements');
    if (savedAchievements) {
      this.achievements = JSON.parse(savedAchievements);
    }
  }
  
  saveData(): void {
    localStorage.setItem('bugCatcherStats', JSON.stringify(this.stats));
    localStorage.setItem('bugCatcherAchievements', JSON.stringify(this.achievements));
  }
  
  filterChallenges(): void {
    this.filteredChallenges = this.challenges.filter(challenge => {
      const languageMatch = this.selectedLanguage === 'All' || challenge.language === this.selectedLanguage;
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

  get currentChallenge(): CodeChallenge {
    return this.filteredChallenges[this.currentChallengeIndex];
  }

  get codeLines(): string[] {
    return this.currentChallenge?.code.split('\n') || [];
  }

  selectLine(lineIndex: number): void {
    this.selectedLine = lineIndex;
    this.showHint = false;
  }

  submitBug(): void {
    if (this.selectedLine === null) {
      this.message = 'Please select a line first';
      return;
    }

    const actualLine = this.selectedLine + 1; // Convert to 1-indexed for bug checks
    
    // Check if this line contains a bug
    const isBug = this.currentChallenge.bugs.some(bug => bug.line === actualLine);
    const alreadyFound = this.currentChallenge.foundBugs.includes(actualLine);
    
    if (isBug && !alreadyFound) {
      this.currentChallenge.foundBugs.push(actualLine);
      this.score += 10;
      this.stats.bugsFound++;
      this.message = 'Correct! Bug found.';
      
      // Check first bug achievement
      if (!this.achievements.find(a => a.id === 'first-bug')?.unlocked) {
        this.unlockAchievement('first-bug');
      }
      
      // Check if all bugs in current challenge are found
      if (this.currentChallenge.foundBugs.length === this.currentChallenge.bugs.length) {
        this.stats.challengesCompleted++;
        
        // Check perfect challenge achievement
        if (this.mistakesInCurrentChallenge === 0 && !this.achievements.find(a => a.id === 'perfect-challenge')?.unlocked) {
          this.unlockAchievement('perfect-challenge');
        }
        
        // Check language-specific achievements
        const language = this.currentChallenge.language;
        if (!this.stats.languagesCompleted.includes(language)) {
          this.stats.languagesCompleted.push(language);
        }
        
        // JavaScript Pro achievement
        if (language === 'JavaScript' && 
            this.challenges.filter(c => c.language === 'JavaScript').every(c => c.foundBugs.length === c.bugs.length) &&
            !this.achievements.find(a => a.id === 'js-master')?.unlocked) {
          this.unlockAchievement('js-master');
        }
        
        // Python Pro achievement
        if (language === 'Python' && 
            this.challenges.filter(c => c.language === 'Python').every(c => c.foundBugs.length === c.bugs.length) &&
            !this.achievements.find(a => a.id === 'python-master')?.unlocked) {
          this.unlockAchievement('python-master');
        }
        
        // Polyglot achievement
        if (this.stats.languagesCompleted.length >= this.availableLanguages.length - 1 && // -1 for 'All'
            !this.achievements.find(a => a.id === 'all-languages')?.unlocked) {
          this.unlockAchievement('all-languages');
        }
        
        // Hard challenge achievement
        if (this.currentChallenge.difficulty === 'Hard' && 
            !this.achievements.find(a => a.id === 'hard-challenge')?.unlocked) {
          this.unlockAchievement('hard-challenge');
        }
        
        if (this.currentChallengeIndex < this.filteredChallenges.length - 1) {
          this.message = 'Challenge complete! Moving to next challenge.';
          setTimeout(() => {
            this.currentChallengeIndex++;
            this.selectedLine = null;
            this.mistakesInCurrentChallenge = 0;
          }, 1500);
        } else {
          this.gameComplete = true;
          this.message = 'Congratulations! You found all bugs.';
        }
      }
    } else if (alreadyFound) {
      this.message = 'You already found this bug!';
    } else {
      this.score = Math.max(0, this.score - 5);
      this.stats.mistakesMade++;
      this.mistakesInCurrentChallenge++;
      this.message = 'No bug on this line. Try again!';
    }
    
    this.saveData();
    
    setTimeout(() => {
      this.selectedLine = null;
    }, 1000);
  }

  getBugDescription(lineNumber: number): string | null {
    const bug = this.currentChallenge.bugs.find(bug => bug.line === lineNumber);
    return bug ? bug.description : null;
  }

  resetGame(): void {
    this.currentChallengeIndex = 0;
    this.resetChallenge();
    this.score = 0;
    this.gameComplete = false;
    this.remainingHints = 3;
    
    // Reset foundBugs for all challenges
    this.challenges.forEach(challenge => {
      challenge.foundBugs = [];
    });
  }
  
  resetChallenge(): void {
    this.selectedLine = null;
    this.message = '';
    this.showHint = false;
    this.currentHint = '';
    this.mistakesInCurrentChallenge = 0;
  }
  
  getHint(): void {
    if (this.remainingHints <= 0) {
      this.message = 'No hints remaining!';
      return;
    }
    
    // Find the next unfound bug
    const unfoundBugs = this.currentChallenge.bugs.filter(
      bug => !this.currentChallenge.foundBugs.includes(bug.line)
    );
    
    if (unfoundBugs.length > 0) {
      const bugToHint = unfoundBugs[0];
      this.currentHint = `Check around line ${bugToHint.line}`;
      this.showHint = true;
      this.remainingHints--;
    } else {
      this.currentHint = 'You\'ve found all the bugs in this challenge!';
      this.showHint = true;
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
  
  toggleStats(): void {
    this.showStats = !this.showStats;
  }
  
  skipChallenge(): void {
    if (this.currentChallengeIndex < this.filteredChallenges.length - 1) {
      this.currentChallengeIndex++;
      this.resetChallenge();
    } else {
      this.message = 'This is the last challenge available.';
    }
  }
} 