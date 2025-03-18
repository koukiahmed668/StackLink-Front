import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home/home.component';
import { TrendingReposComponent } from './features/trending-repos/trending-repos/trending-repos.component';
import { TechNewsComponent } from './features/tech-news/tech-news/tech-news.component';
import { PortfoliosComponent } from './features/portfolios/portfolios/portfolios.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DevGamesComponent } from './features/dev-games/dev-games.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'developer-games',
    redirectTo: 'dev-games'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'trending-repos',
    loadComponent: () => import('./features/trending-repos/trending-repos/trending-repos.component').then(c => c.TrendingReposComponent)
  },
  {
    path: 'tech-news',
    loadComponent: () => import('./features/tech-news/tech-news/tech-news.component').then(c => c.TechNewsComponent)
  },
  {
    path: 'portfolios',
    loadComponent: () => import('./features/portfolios/portfolios/portfolios.component').then(c => c.PortfoliosComponent)
  },
  {
    path: 'dev-games',
    loadComponent: () => import('./features/dev-games/dev-games.component').then(c => c.DevGamesComponent)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(c => c.RegisterComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
