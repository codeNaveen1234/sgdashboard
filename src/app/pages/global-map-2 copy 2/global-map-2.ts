import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { CommonModule } from '@angular/common';

interface NetworkDataItem {
  source: [number, number];
  target: [number, number];
  color: string;
  dasharray: string;
}

@Component({
  selector: 'app-global-map-2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-map-2.html',
  styleUrls: ['./global-map-2.css']
})
export class GlobalMap2 implements OnInit, AfterViewInit {
  @ViewChild('mapContainer') private mapContainer!: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.drawChoroplethMap();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.drawChoroplethMap();
  }

  private drawChoroplethMap(): void {
    d3.select('#map-container-2 svg').remove();
    d3.select('.tooltip').remove();

    const container = this.mapContainer.nativeElement;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    if (width === 0 || height === 0) return;

    const svg = d3.select('#map-container-2')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const projection = d3.geoMercator()
      .scale(width / (2 * Math.PI))
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip');

    Promise.all([
      d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'),
      d3.csv('https://raw.githubusercontent.com/dbouquin/IS_608/master/NanosatDB_munging/Countries-Continents.csv')
    ]).then(([world, continentData]) => {
      // @ts-ignore
      const countries = topojson.feature(world, world.objects.countries).features;

      const continentMap = new Map(continentData.map((d: any) => [d.Country, d.Continent]));

      console.log("All country names:", countries.map((c: any) => c.properties.name));

      // Draw the ocean
      svg.append('path')
        .datum({ type: 'Sphere' } as any)
        .attr('class', 'ocean')
        .attr('d', path as any)
        .on('mouseover', (event: any) => {
          tooltip.transition().style('opacity', .9);
          tooltip.html(`<strong>Ocean</strong>`);
        })
        .on('mousemove', (event: any) => {
          tooltip.style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', () => {
          tooltip.transition().style('opacity', 0);
        });

      svg.append('g')
        .selectAll('path')
        .data(countries)
        .enter().append('path')
        .attr('class', 'country')
        .attr('d', path as any)
        .attr('fill', (d: any) => {
          if (d.properties.name === 'India') {
            return '#ffcc99'; // Highlight color for India
          }
          // const continent = continentMap.get(d.properties.name);
          // return continent ? colorScale(continent) : '#ccc'; 
          return '#e6e3e3ff'; // Grey color for all other countries
        })
        .on('mouseover', (event, d: any) => {
          const continent = continentMap.get(d.properties.name) || 'N/A';
          tooltip.transition().style('opacity', .9);
          tooltip.html(`<strong>${d.properties.name}</strong><br/>Continent: ${continent}`);
        })
        .on('mousemove', (event: any) => {
          tooltip.style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', () => {
          tooltip.transition().style('opacity', 0);
        });

      const india = countries.find((d: any) => d.properties.name === 'India');

      // const networkData: NetworkDataItem[] = [];

      // networkData.forEach(connection => {
      //   const lineData = [{
      //     type: "LineString",
      //     coordinates: [connection.source, connection.target]
      //   }];

      //   const line = svg.append('g')
      //     .selectAll('path.communication-line')
      //     .data(lineData)
      //     .enter().append('path')
      //     .attr('class', 'communication-line')
      //     .attr('d', path as any)
      //     .attr('fill', 'none')
      //     .attr('stroke', connection.color)
      //     .attr('stroke-width', 2)
      //     .attr('stroke-dasharray', connection.dasharray);

      //   const totalLength = line.node()?.getTotalLength();
      //   if (totalLength) {
      //     line
      //       .attr("stroke-dasharray", totalLength + " " + totalLength)
      //       .attr("stroke-dashoffset", totalLength)
      //       .transition()
      //       .duration(5000)
      //       .ease(d3.easeLinear)
      //       .attr("stroke-dashoffset", 0)
      //       .on("end", () => {
      //         line.transition()
      //           .duration(5000)
      //           .ease(d3.easeLinear)
      //           .attr("stroke-dashoffset", -totalLength)
      //           .on("end", () => {
      //             // Loop the animation
      //             line.transition()
      //               .duration(0)
      //               .attr("stroke-dashoffset", totalLength)
      //               .transition()
      //               .duration(5000)
      //               .ease(d3.easeLinear)
      //               .attr("stroke-dashoffset", 0)
      //               .on("end", () => {
      //                 // Loop the animation
      //                 line.transition()
      //                   .duration(5000)
      //                   .ease(d3.easeLinear)
      //                   .attr("stroke-dashoffset", -totalLength)
      //                   .on("end", () => {
      //                     // Loop the animation
      //                     line.transition()
      //                       .duration(0)
      //                       .attr("stroke-dashoffset", totalLength)
      //                       .transition()
      //                       .duration(5000)
      //                       .ease(d3.easeLinear)
      //                       .attr("stroke-dashoffset", 0);
      //                   });
      //               });
      //           });
      //       });
      //   }
      // });

    }).catch(err => console.error('Error loading data:', err));
  }
}