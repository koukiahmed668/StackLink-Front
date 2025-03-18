import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeKey = 'dark-mode-enabled';
  private isDarkModeSubject = new BehaviorSubject<boolean>(true);
  isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    // Check local storage first
    const storedPreference = localStorage.getItem(this.darkModeKey);
    
    if (storedPreference !== null) {
      const isDarkMode = storedPreference === 'true';
      this.setTheme(isDarkMode);
      return;
    }
    
    // If no stored preference, use dark mode as default (instead of system preference)
    this.setTheme(true);
    
    // Still listen for changes to system preference, but only if no explicit preference is set
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem(this.darkModeKey) === null) {
        this.setTheme(e.matches);
      }
    });
  }

  toggleTheme(): void {
    const isDarkMode = !this.isDarkModeSubject.value;
    this.setTheme(isDarkMode);
  }

  setTheme(isDarkMode: boolean): void {
    // Update DOM
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Update state and save preference
    this.isDarkModeSubject.next(isDarkMode);
    localStorage.setItem(this.darkModeKey, String(isDarkMode));
  }
} 