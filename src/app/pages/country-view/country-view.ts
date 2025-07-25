import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener, input, Input } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { IndicatorCardComponent } from '../../components/indicator-card/indicator-card';
import { MiniIndicatorCardComponent } from '../../components/mini-indicator-card/mini-indicator-card';
import { Router } from '@angular/router'; // Import Router
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-country-view',
  standalone: true,
  imports: [CommonModule, MiniIndicatorCardComponent, KeyValuePipe, MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './country-view.html',
  styleUrls: ['./country-view.css']
})
export class CountryView implements OnInit, AfterViewInit {
  @ViewChild('indiaMapContainer') private mapContainer!: ElementRef;
  @Input() showDetails: boolean = false;
  @Input() showVariations: boolean = false;
  @Input() legends: any = [];
  @Input() selections: any = [];

  indicatorData: { value: number | string; label: string }[] = [];

  constructor(private router: Router) { } // Inject Router

  ngOnInit(): void {
    this.fetchIndicatorData();
  }

  fetchIndicatorData(stateCode?: string): void {
    d3.json('/assets/district-view-indicators.json').then((data: any) => {
      const statesData = data.result.states;
      const labels = data.result.meta.labels;
      const details = stateCode ? statesData[stateCode]?.details : statesData.default.details;
      if (details) {
        this.indicatorData = details.map((item: any) => ({
          value: item.value,
          label: labels[item.code]
        }));
      } else {
        this.indicatorData = [];
      }
    }).catch((error: any) => {
      console.error('Error loading indicator data:', error);
    });
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

    Promise.all([
      d3.json('/assets/india.json'),
      d3.json('/assets/district-view-indicators.json')
    ]).then(([india, indicatorData]: [any, any]) => {
      const statesData = indicatorData.result.states;
      const legends = indicatorData.result.meta.legends;
      this.legends = legends;
      const activeStates = Object.keys(statesData).filter(key => key !== 'default');
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
          const stateCode = d.properties.st_code;
          const stateInfo = statesData[stateCode];
          if (stateInfo) {
            return legends[stateInfo.type]?.color || '#ccc';
          } else {
            return '#ccc';
          }
        })
        .attr('stroke', '#000')
        .attr('stroke-width', 1)
        .style('cursor', (d: any) => {
          const stateCode = d.properties.st_code;
          return statesData[stateCode] ? 'pointer' : 'default';
        })
        .on('mouseover', (event: any, d: any) => {
          const stateCode = d.properties.st_code;
          const stateInfo = statesData[stateCode];
          if (stateInfo) {
            this.fetchIndicatorData(stateCode);
          }
        })
        .on('mouseout', (event: any, d: any) => {
          this.fetchIndicatorData();
        })
        .on('click', (event: any, d: any) => {
          const stateCode = d.properties.st_code;
          const stateInfo = statesData[stateCode];
          if (stateInfo) {
            this.fetchIndicatorData(stateCode);
            const stateName = stateInfo.label;
            if (stateName) {
              this.router.navigate(['/state-view', stateName]);
            }
          }
        })
        .append('title')
        .text((d: any) => {
          const stateCode = d.properties.st_code;
          const stateInfo = statesData[stateCode];
          return stateInfo?.label || d.properties.st_nm || 'Unknown';
        });
    }).catch((error: any) => {
      console.error('Error loading or processing data:', error);
    });
  }
}
