import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private activeTheme = signal('light');

  constructor() { }

  getTheme() {
    return this.activeTheme.asReadonly();
  }

  setTheme(theme: string) {
    this.activeTheme.set(theme);
  }
}