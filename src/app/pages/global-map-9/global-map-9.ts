import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

@Component({
  selector: 'app-global-map-9',
  templateUrl: './global-map-9.html',
  styleUrls: ['./global-map-9.css'],
  standalone: true,
})
export class GlobalMap9Component implements OnInit, AfterViewInit {
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.createMap();
  }

  private createMap(): void {
    const width = 960;
    const height = 600;

    const svg = d3.select('#map-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Define a pattern for dotted fill
    svg.append('defs').append('pattern')
      .attr('id', 'dotted-gray')
      .attr('width', 4).attr('height', 4) // Smaller pattern for denser dots
      .attr('patternUnits', 'userSpaceOnUse')
      .append('circle')
      .attr('cx', 1).attr('cy', 1).attr('r', 1) // Larger radius and adjusted center
      .attr('fill', '#888'); // Darker gray

    const projection = d3.geoMercator()
      .scale(150)
      .center([0, 20])
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Load world map data
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((world: any) => {
      // Load India map data
      d3.json('assets/india_accurate.json').then((india: any) => {
        const countries = topojson.feature(world, world.objects.countries) as any;

        svg.append('g')
          .attr('class', 'countries')
          .selectAll('path')
          .data(countries.features)
          .enter().append('path')
          .attr('d', (d: any) => path(d))
          .attr('fill', (d: any) => {
            // Check if the country is India (based on its ID or name)
            // World Atlas uses numeric IDs for countries. India's ID is 356.
            // You might need to adjust this based on the actual data.
            if (d.id === 356) { // Assuming 356 is India's ID in world-atlas
              return 'red'; // Highlight India
            } else {
              return 'url(#dotted-gray)'; // Gray out other countries with dotted pattern
            }
          })
          .attr('stroke', (d: any) => d.id === 356 ? 'black' : '#fff')
          .attr('stroke-width', (d: any) => d.id === 356 ? 1.5 : 0.5);

        // Overlay India with more accurate data if needed, or just rely on the world map's India
        // For this example, we'll just use the world map's India and color it.
        // If you want to use the more accurate india_accurate.json, you'd draw it separately
        // and ensure its projection aligns.

        // Load and draw accurate India map
        d3.json('assets/india_accurate.json').then((indiaAccurate: any) => {
          const indiaFeatures = topojson.feature(indiaAccurate, indiaAccurate.objects.india) as any; // Assuming 'india' is the object name in your TopoJSON

          svg.append('g')
            .attr('class', 'india-accurate')
            .selectAll('path')
            .data(indiaFeatures.features)
            .enter().append('path')
            .attr('d', (d: any) => path(d))
            .attr('fill', 'red')
            .attr('stroke', 'black')
            .attr('stroke-width', 0.5);
        }).catch(error => console.error('Error loading accurate India data:', error));

      }).catch(error => console.error('Error loading India data:', error));
    }).catch(error => console.error('Error loading world data:', error));
  }
}
