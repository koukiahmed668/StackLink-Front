import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
  author: string;
}

export interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  published_at: string;
  user: {
    name: string;
    username: string;
  };
  tags: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly GITHUB_API = 'https://api.github.com';
  private readonly NEWS_API = 'https://newsapi.org/v2';
  private readonly DEVTO_API = 'https://dev.to/api';

  constructor(private http: HttpClient) {}

  // GitHub API Methods
  getTrendingRepos(language?: string): Observable<GitHubRepo[]> {
    const query = language ? `language:${language}` : 'stars:>1000';
    return this.http.get<{ items: GitHubRepo[] }>(
      `${this.GITHUB_API}/search/repositories?q=${query}&sort=stars&order=desc`
    ).pipe(
      map(response => response.items),
      catchError(() => of([]))
    );
  }

  getUserRepos(username: string): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(
      `${this.GITHUB_API}/users/${username}/repos`
    ).pipe(
      catchError(() => of([]))
    );
  }

  // News API Methods
  getTechNews(category?: string): Observable<NewsArticle[]> {
    const query = category ? `&category=${category}` : '';
    return this.http.get<{ articles: NewsArticle[] }>(
      `${this.NEWS_API}/top-headlines?country=us${query}`
    ).pipe(
      map(response => response.articles),
      catchError(() => of([]))
    );
  }

  // DevTo API Methods
  getDevToArticles(tag?: string): Observable<DevToArticle[]> {
    const query = tag ? `?tag=${tag}` : '';
    return this.http.get<DevToArticle[]>(
      `${this.DEVTO_API}/articles${query}`
    ).pipe(
      catchError(() => of([]))
    );
  }

  // Error handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
} 