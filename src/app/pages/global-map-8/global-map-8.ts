import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { CommonModule } from '@angular/common';

interface LineDataType {
  type: "LineString";
  coordinates: [number[], number[]];
}

interface ConnectionLineData {
  sourceCountry: string;
  targetCountry: string;
  color: string;
  lineStyle: 'straight' | 'dotted' | 'dashed';
}



@Component({
  selector: 'app-global-map-8',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-map-8.html',
  styleUrls: ['./global-map-8.css']
})
export class GlobalMap8 implements OnInit, AfterViewInit {
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

        // Define patterns for dotted fill
        const defs = svg.append('defs');

        // Grey dots pattern
        defs.append('pattern')
          .attr('id', 'grey-dots')
          .attr('width', 5) // Size of the pattern unit
          .attr('height', 5)
          .attr('patternUnits', 'userSpaceOnUse')
          .append('circle')
          .attr('cx', 1)
          .attr('cy', 1)
          .attr('r', 0.5) // Radius of each dot
          .attr('fill', '#555'); // Darker grey dot color

        // Red dots pattern for India
        defs.append('pattern')
          .attr('id', 'red-dots')
          .attr('width', 5)
          .attr('height', 5)
          .attr('patternUnits', 'userSpaceOnUse')
          .append('circle')
          .attr('cx', 1)
          .attr('cy', 1)
          .attr('r', 0.5)
          .attr('fill', 'red'); // Red dot color
    
        const projection = d3.geoMercator()
          .scale(width / (2 * Math.PI))
          .translate([width / 2, height / 1.5]);
    
        const path = d3.geoPath().projection(projection);
    
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip');

        const connectionLines: ConnectionLineData[] = [
          { sourceCountry: 'United Kingdom', targetCountry: 'India', color: 'blue', lineStyle: 'straight' },
          { sourceCountry: 'Canada', targetCountry: 'India', color: 'green', lineStyle: 'dotted' },
          { sourceCountry: 'China', targetCountry: 'India', color: 'purple', lineStyle: 'dashed' },
          { sourceCountry: 'United States', targetCountry: 'India', color: 'orange', lineStyle: 'straight' },
          { sourceCountry: 'Russia', targetCountry: 'India', color: 'cyan', lineStyle: 'dotted' },
        ];
    
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
            .attr('fill', 'white') // Explicitly set ocean fill to white
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
                return 'brown'; // Solid red fill for India
              }
              return 'url(#grey-dots)'; // Fill other countries with grey dots
            })
            .attr('stroke', '#555') // Solid stroke color for outlines
            .attr('stroke-width', 0.5) // Default stroke width for outlines
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

          // Draw connection lines
          connectionLines.forEach(connection => {
            const sourceCountry = countries.find((d: any) => d.properties.name === connection.sourceCountry);
            const targetCountry = countries.find((d: any) => d.properties.name === connection.targetCountry);

            if (sourceCountry && targetCountry) {
              const sourceCoords = d3.geoCentroid(sourceCountry as any);
              const targetCoords = d3.geoCentroid(targetCountry as any);

              const lineData: LineDataType = {
                type: "LineString",
                coordinates: [sourceCoords, targetCoords]
              };

              const linePath = svg.append('path')
                .datum(lineData)
                .attr('class', 'connection-line')
                .attr('d', path as any)
                .attr('fill', 'none')
                .attr('stroke', connection.color)
                .attr('stroke-width', 1.5);

              // Apply line style
              if (connection.lineStyle === 'dotted') {
                linePath.attr('stroke-dasharray', '4,4');
              } else if (connection.lineStyle === 'dashed') {
                linePath.attr('stroke-dasharray', '8,4');
              }

              // Animation
              const totalLength = (linePath.node() as SVGPathElement).getTotalLength();

              const repeatAnimation = () => {
                linePath
                  .attr('stroke-dashoffset', totalLength) // Start at the end
                  .transition()
                  .duration(5000) // Animation duration
                  .ease(d3.easeLinear)
                  .attrTween('stroke-dashoffset', function() {
                    return function(t) {
                      return String(totalLength * (1 - t));
                    };
                  })
                  .on('end', () => {
                    // After drawing, reset and redraw
                    linePath
                      .transition()
                      .duration(5000)
                      .ease(d3.easeLinear)
                      .attrTween('stroke-dashoffset', function() {
                        return function(t) {
                          return String(totalLength * t);
                        };
                      })
                      .on('end', repeatAnimation); // Loop back
                  });
              };

              repeatAnimation(); // Start the animation

              // Add start and end dots
              const startDot = svg.append('circle')
                .attr('cx', projection(sourceCoords)![0])
                .attr('cy', projection(sourceCoords)![1])
                .attr('r', 4)
                .attr('fill', connection.color)
                .attr('stroke', 'white')
                .attr('stroke-width', 1.5)
                .on('mouseover', (event: any) => {
                  tooltip.transition().style('opacity', .9);
                  tooltip.html(`From: <strong>${connection.sourceCountry}</strong>`);
                })
                .on('mousemove', (event: any) => {
                  tooltip.style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
                })
                .on('mouseout', () => {
                  tooltip.transition().style('opacity', 0);
                });

              const endDot = svg.append('circle')
                .attr('cx', projection(targetCoords)![0])
                .attr('cy', projection(targetCoords)![1])
                .attr('r', 4)
                .attr('fill', connection.color)
                .attr('stroke', 'white')
                .attr('stroke-width', 1.5)
                .on('mouseover', (event: any) => {
                  tooltip.transition().style('opacity', .9);
                  tooltip.html(`To: <strong>${connection.targetCountry}</strong>`);
                })
                .on('mousemove', (event: any) => {
                  tooltip.style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
                })
                .on('mouseout', () => {
                  tooltip.transition().style('opacity', 0);
                });

              // Tooltip for the line itself
              linePath
                .on('mouseover', (event: any) => {
                  tooltip.transition().style('opacity', .9);
                  tooltip.html(`From: <strong>${connection.sourceCountry}</strong> to <strong>${connection.targetCountry}</strong>`);
                })
                .on('mousemove', (event: any) => {
                  tooltip.style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
                })
                .on('mouseout', () => {
                  tooltip.transition().style('opacity', 0);
                });
            }
          });

        }).catch(err => console.error('Error loading data:', err));
      }
}
