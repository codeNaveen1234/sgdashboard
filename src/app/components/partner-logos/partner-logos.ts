import { Component, input, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-partner-logos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partner-logos.html',
  styleUrls: ['./partner-logos.css']
})
export class PartnerLogosComponent implements OnInit {
  @Input() partners: any[] = [];
  @Input() styles: any = {};
  @Input() title: string = '';
  @Input() showFilters:boolean = false;

  allLogos: any[] = [];
  filteredLogos: any[] = [];
  categories: string[] = [];
  activeCategory: string | null = null;

  ngOnInit(): void {
    this.allLogos = this.partners;
    this.categories = [
  ...new Set(
    this.partners.map(p => p.category).filter(category => category && category.trim() !== ""))];
    this.filterLogos(null);
  }

  filterLogos(category: string | null): void {
    this.activeCategory = category;
    if (category) {
      this.filteredLogos = this.allLogos.filter(logo => logo.category === category);
    } else {
      this.filteredLogos = this.allLogos;
    }
  }
}
