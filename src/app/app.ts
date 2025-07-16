import { Component, OnInit, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from './core/services/theme';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <header class="app-header">
      <nav class="container">
        <a routerLink="/" class="logo">Shikshagraha</a>
        <div class="nav-links">
          <a routerLink="/national-view">National View</a>
          <a routerLink="/catalysing-networks">Catalysing Networks</a>
          <button (click)="toggleTheme()" class="theme-toggle-button">Toggle Theme</button>
        </div>
      </nav>
    </header>
    <main class="app-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {
    effect(() => {
      document.documentElement.className = `${this.themeService.getTheme()()}-theme`;
    });
  }

  ngOnInit(): void {
  }

  toggleTheme() {
    const currentTheme = this.themeService.getTheme()();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.themeService.setTheme(newTheme);
  }
}