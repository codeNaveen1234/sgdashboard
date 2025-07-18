import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-global-map-3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-map-3.html',
  styleUrls: ['./global-map-3.css']
})
export class GlobalMap3 implements OnInit, AfterViewInit {
  @ViewChild('mapContainer') private mapContainer!: ElementRef;

  // Sample data for major cities
  private cities = [
    { name: 'New York', coordinates: [-74.0060, 40.7128] },
    { name: 'London', coordinates: [-0.1278, 51.5074] },
    { name: 'Tokyo', coordinates: [139.6917, 35.6895] },
    { name: 'Sydney', coordinates: [151.2093, -33.8688] },
    { name: 'Cairo', coordinates: [31.2357, 30.0444] },
    { name: 'Mumbai', coordinates: [72.8777, 19.0760] },
    { name: 'Sao Paulo', coordinates: [-46.6333, -23.5505] }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.drawInteractiveMap();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.drawInteractiveMap();
  }

  private drawInteractiveMap(): void {
    d3.select('#map-container-3 svg').remove();
    d3.select('.tooltip').remove();

    const container = this.mapContainer.nativeElement;
    const width = container.offsetWidth;
    const height = width * 0.5;

    if (width === 0) return;

    const svg = d3.select('#map-container-3')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const projection = d3.geoMercator()
      .scale(width / (2 * Math.PI))
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip');

    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((world: any) => {
      const countries = topojson.feature(world, world.objects.countries) as any;

      // Draw the countries
      svg.append('g')
        .selectAll('path')
        .data(countries)
        .enter().append('path')
        .attr('class', 'country')
        .attr('d', path as any);

      // Draw the markers for cities
      svg.append('g')
        .selectAll('circle.marker')
        .data(this.cities)
        .enter().append('circle')
        .attr('class', 'marker')
        .attr('cx', d => projection(d.coordinates as [number, number])![0])
        .attr('cy', d => projection(d.coordinates as [number, number])![1])
        .attr('r', 5)
        .on('mouseover', (event, d) => {
          tooltip.transition().style('opacity', .9);
          tooltip.html(d.name)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', () => {
          tooltip.transition().style('opacity', 0);
        });

    }).catch(err => console.error('Error loading data:', err));
  }
}
