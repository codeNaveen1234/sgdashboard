import { Component, OnInit, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from './core/services/theme';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, DashboardComponent],
  template: `
    <header class="app-header">
      <nav class="container">
        <a href="https://shikshagraha.org/" target="_blank" class="logo"><img src='assets/icons/main_logo.svg'></a>
        <div class="nav-links">
          <a routerLink="/">Home</a>
          <a routerLink="/dashboard">Dashboard</a>
          <a routerLink="/network-health">Network Health</a>
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
