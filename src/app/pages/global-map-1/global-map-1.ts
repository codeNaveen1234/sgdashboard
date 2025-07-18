import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { geoRobinson } from 'd3-geo-projection';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-global-map-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-map-1.html',
  styleUrls: ['./global-map-1.css']
})
export class GlobalMap1 implements OnInit, AfterViewInit {
  @ViewChild('mapContainer') private mapContainer!: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.drawMap();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.drawMap();
  }

  private drawMap(): void {
    d3.select('#map-container svg').remove();

    const container = this.mapContainer.nativeElement;
    const width = container.offsetWidth;
    const height = width * 0.6;

    if (width === 0 || height === 0) {
      // Don't draw if the container isn't visible yet
      return;
    }

    const svg = d3.select('#map-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

const projection = geoRobinson()
  .scale(150)
  .translate([width / 2, height / 2]);


    const path = d3.geoPath().projection(projection);

    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json').then((world: any) => {
      const countries = topojson.feature(world, world.objects.countries) as any;

      const map = svg.append('g');

      map.append('path')
        .datum({ type: 'Sphere' } as any)
        .attr('class', 'ocean')
        .style('fill', '#a9d0f5')
        .attr('d', path);

      map.selectAll('path.country')
        .data(countries.features)
        .enter().append('path')
        .attr('class', (d: any) => {
          return d.properties.name === 'India' ? 'country india' : 'country';
        })
        .attr('d', path as any)
        .attr('fill', (d: any) => {
          return d.properties.name === 'India' ? '#ff5722' : '#ccc';
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5);

    }).catch(error => {
      console.error('Error loading world map data:', error);
    });
  }
}
