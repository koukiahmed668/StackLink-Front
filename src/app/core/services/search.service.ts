import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

export interface SearchResult {
  type: 'repo' | 'article' | 'user';
  id: string;
  title: string;
  description: string;
  url: string;
  metadata: {
    stars?: number;
    language?: string;
    author?: string;
    date?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchQuerySubject = new BehaviorSubject<string>('');
  public searchResults$ = this.searchQuerySubject.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(query => this.performSearch(query))
  );

  constructor(private http: HttpClient) {}

  private performSearch(query: string): Observable<SearchResult[]> {
    if (!query.trim()) {
      return new BehaviorSubject([]);
    }

    // TODO: Replace with actual API endpoint
    return this.http.get<SearchResult[]>(`/api/search?q=${encodeURIComponent(query)}`);
  }

  search(query: string): void {
    this.searchQuerySubject.next(query);
  }

  getRecentSearches(): string[] {
    return JSON.parse(localStorage.getItem('recentSearches') || '[]');
  }

  saveSearch(query: string): void {
    const recentSearches = this.getRecentSearches();
    const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  }

  clearRecentSearches(): void {
    localStorage.removeItem('recentSearches');
  }
} 