import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-global-map-7',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-map-7.html',
  styleUrls: ['./global-map-7.css']
})
export class Global7Map implements OnInit, AfterViewInit {
  @ViewChild('globeContainer') private globeContainer!: ElementRef;

  networkData = [
    { source: [-118.2437, 34.0522], target: [76.2711, 10.8505], lineType: 'multi-dash' }, // Los Angeles to Kerala
    { source: [55.2962, 25.2770], target: [72.1362, 22.3094], lineType: 'multi-dash' }, // Dubai to Gujarat
    { source: [8.2275, 46.8182], target: [72.8774, 19.0761], lineType: 'multi-dash' }, // Switzerland to Mumbai
    { source: [0, -90], target: [75.0856, 30.7353], lineType: 'multi-dash' }, // Antarctica to Punjab
    { source: [0, 90], target: [94.5624, 26.1584], lineType: 'multi-dash' }, // Arctic to Nagaland
    { source: [24.6727, -28.4793], target: [77.5712, 32.0842], lineType: 'multi-dash' }, // South Africa to Himachal Pradesh
  ];

  private tooltip: any;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.tooltip = d3.select("#tooltip");
    this.drawGlobe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.drawGlobe();
  }

  private getContinent(countryName: string): string {
    // This is a simplified mapping for demonstration purposes.
    // A more robust solution would involve a comprehensive dataset.
    const continentMap: { [key: string]: string } = {
      'India': 'Asia',
      'United States': 'North America',
      'Canada': 'North America',
      'Mexico': 'North America',
      'Brazil': 'South America',
      'Argentina': 'South America',
      'United Kingdom': 'Europe',
      'France': 'Europe',
      'Germany': 'Europe',
      'China': 'Asia',
      'Japan': 'Asia',
      'Australia': 'Oceania',
      'Egypt': 'Africa',
      'South Africa': 'Africa',
      'Nigeria': 'Africa',
      'Russia': 'Europe/Asia',
      'Antarctica': 'Antarctica'
    };
    return continentMap[countryName] || 'Unknown';
  }

  private drawGlobe(): void {
    d3.select('#globe-container svg').remove();

    const container = this.globeContainer.nativeElement;
    const width = container.offsetWidth;
    const height = width; // Make it a square for a circular globe

    const svg = d3.select('#globe-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const projection = d3.geoOrthographic()
      .scale(width / 2 - 10)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection);

    // Load world map data
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json').then((world: any) => {
      const countries = topojson.feature(world, world.objects.countries) as any;

      const globe = svg.append('g');

      let rotation: [number, number, number] = [-80, -20, 0]; // Initial rotation

      // Set initial rotation to show India
      projection.rotate(rotation);

      // Add drag functionality
      svg.call(d3.drag<SVGSVGElement, unknown>()
        .on("start", (event: any) => {
          const projRotation = projection.rotate();
          rotation = [projRotation[0], projRotation[1], projRotation[2]];
        })
        .on("drag", (event: any) => {
          rotation[0] += event.dx * 0.2; // Only rotate horizontally (longitude)
          projection.rotate(rotation);
          globe.selectAll('path').attr('d', path as any);
          lines.selectAll('path.network-line')
            .attr('d', (d: any) => {
              const sourceCoords = projection(d.source);
              const targetCoords = projection(d.target);

              if (!sourceCoords || !targetCoords) return null;

              const midX = (sourceCoords[0] + targetCoords[0]) / 2;
              const midY = (sourceCoords[1] + targetCoords[1]) / 2;
              const controlPoint: [number, number] = [midX + (targetCoords[1] - sourceCoords[1]) * 0.2, midY - (targetCoords[0] - sourceCoords[0]) * 0.2];

              return lineGenerator([sourceCoords, controlPoint, targetCoords]);
            });
          lines.selectAll('circle.marker')
            .attr('cx', (d: any) => projection(d)![0])
            .attr('cy', (d: any) => projection(d)![1]);
        }));

      // Draw the ocean
      globe.append('path')
        .datum({ type: 'Sphere' } as any)
        .attr('class', 'ocean')
        .attr('d', path);

      // Draw the countries
      globe.selectAll('path.country')
        .data(countries.features)
        .enter().append('path')
        .attr('class', (d: any) => {
          return d.properties.name === 'India' ? 'country india' : 'country';
        })
        .attr('d', path as any)
        .on("mouseover", (event: any, d: any) => {
          const countryName = d.properties.name;
          const continent = this.getContinent(countryName);
          this.tooltip.html(`Country: ${countryName}<br>Continent: ${continent}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px")
            .style("display", "block");
        })
        .on("mouseout", () => {
          this.tooltip.style("display", "none");
        });

      // Draw network lines
      const lineGenerator = d3.line()
        .curve(d3.curveBasis);

      const lines = svg.append('g').attr('class', 'network-lines');

      lines.selectAll('path.network-line')
        .data(this.networkData)
        .enter().append('path')
        .attr('class', 'network-line')
        .attr('d', (d: any) => {
          const sourceCoords = projection(d.source);
          const targetCoords = projection(d.target);

          if (!sourceCoords || !targetCoords) return null;

          // Calculate a control point for curvature
          const midX = (sourceCoords[0] + targetCoords[0]) / 2;
          const midY = (sourceCoords[1] + targetCoords[1]) / 2;
          const controlPoint: [number, number] = [midX + (targetCoords[1] - sourceCoords[1]) * 0.2, midY - (targetCoords[0] - sourceCoords[0]) * 0.2];

          return lineGenerator([sourceCoords, controlPoint, targetCoords]);
        })
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('stroke-width', 3)
        .attr('opacity', 0.5)
        .attr('stroke-dasharray', (d: any) => {
          if (d.lineType === 'multi-dash') {
            return '30, 5, 10, 5'; // Example: long dash, short gap, medium dash, short gap
          } else {
            return '0,0';
          }
        })
        .each(function(d: any) {
          if (d.lineType === 'multi-dash') {
            const totalLength = (this as SVGPathElement).getTotalLength();
            const pathElement = d3.select(this);

            function repeat() {
              pathElement
                .attr('stroke-dashoffset', totalLength)
                .transition()
                .duration(5000) // Animation duration
                .ease(d3.easeLinear)
                .attr('stroke-dashoffset', 0)
                .on('end', repeat); // Loop the animation
            }
            repeat();
          }
        });

      // Add markers at start and end points
      lines.selectAll('circle.marker')
        .data(this.networkData.map((d: any) => [d.source, d.target]).flat())
        .enter().append('circle')
        .attr('class', 'marker')
        .attr('cx', (d: any) => projection(d)![0])
        .attr('cy', (d: any) => projection(d)![1])
        .attr('r', 3) // Radius of the marker
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5);
    });
  }
}