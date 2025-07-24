import { Component, Input, OnInit } from '@angular/core';
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

  allLogos: any[] = [];
  filteredLogos: any[] = [];
  categories: string[] = [];
  activeCategory: string | null = null;

  ngOnInit(): void {
    this.allLogos = this.partners.flatMap(p => p.logos);
    this.categories = this.partners.map(p => p.category);
    this.filterLogos(null);
  }

  filterLogos(category: string | null): void {
    this.activeCategory = category;
    if (category) {
      const selectedPartner = this.partners.find(p => p.category === category);
      this.filteredLogos = selectedPartner ? selectedPartner.logos : [];
    } else {
      this.filteredLogos = this.allLogos;
    }
  }
}
