import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { CommonModule } from '@angular/common';
import { IndicatorCardComponent } from '../../components/indicator-card/indicator-card';
import { MiniIndicatorCardComponent } from '../../components/mini-indicator-card/mini-indicator-card';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-country-view',
  standalone: true,
  imports: [CommonModule, MiniIndicatorCardComponent],
  templateUrl: './country-view.html',
  styleUrls: ['./country-view.css']
})
export class CountryView implements OnInit, AfterViewInit {
  @ViewChild('indiaMapContainer') private mapContainer!: ElementRef;

  indicatorData = [
    { value: 20, label: 'No. of districts with active missions' },
    { value: 25, label: 'No. of momentum partners' },
    { value: 15000, label: 'No. of MIs activated/initiated' },
    { value: 5000, label: 'No. of leaders driving improvements' },
    { value: 10000, label: 'No. of Schools driving improvements' },
    { value: 500, label: 'Community-Led Improvements' },
  ];

  constructor(private router: Router) { } // Inject Router

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.drawMap();
  }

  private resizeTimeout: any;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => this.drawMap(), 200);
  }

  private drawMap(): void {
    d3.select('#india-map-container svg').remove();

    const container = this.mapContainer.nativeElement;
    const containerWidth = container.offsetWidth;
    const height = containerWidth * 0.6;

    d3.json('/assets/india.json').then((india: any) => {
      const states = topojson.feature(india, india.objects.states) as any;
      
      const projection = d3.geoMercator().fitSize([containerWidth, height], states);
      const path = d3.geoPath().projection(projection);

      const svg = d3.select('#india-map-container')
        .append('svg')
        .attr('width', containerWidth)
        .attr('height', height)
        .attr('viewBox', `0 0 ${containerWidth} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

      svg.selectAll('path')
        .data(states.features)
        .enter().append('path')
        .attr('d', path as any)
        .attr('fill', (d: any) => {
          if (d.properties.st_nm === 'Tamil Nadu' || d.properties.st_nm === 'Uttar Pradesh') {
            return '#572e91';
          } else {
            return '#ccc';
          }
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .on('click', (event: any, d: any) => {
          const stateName = d.properties.st_nm;
          this.router.navigate(['/district-view', stateName]);
        });
    }).catch((error: any) => {
      console.error('Error loading or processing the TopoJSON data:', error);
    });
  }
}