import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { CommonModule } from '@angular/common';
import { INDIA } from '../../../constants/urlConstants';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-catalysing-networks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalysing-networks.html',
  styleUrl: './catalysing-networks.css'
})
export class CatalysingNetworks implements OnInit, AfterViewInit {
  @ViewChild('networkMapContainer') private mapContainer!: ElementRef;

  // Dummy data for network lines (example: connecting major cities)
  networkData = [
    { source: [77.2090, 28.6139], target: [72.8777, 19.0760], lineType: 'solid' }, // Delhi to Mumbai
    { source: [77.2090, 28.6139], target: [80.2707, 13.0827], lineType: 'solid' }, // Delhi to Chennai
    { source: [72.8777, 19.0760], target: [88.3639, 22.5726], lineType: 'solid' }, // Mumbai to Kolkata
    { source: [80.2707, 13.0827], target: [77.5946, 12.9716], lineType: 'solid' }, // Chennai to Bangalore
    { source: [88.3639, 22.5726], target: [77.5946, 12.9716], lineType: 'solid' }, // Kolkata to Bangalore
    { source: [77.2090, 28.6139], target: [75.7139, 30.7353], lineType: 'dotted' }, // Delhi to Chandigarh
    { source: [72.8777, 19.0760], target: [73.8567, 18.5204], lineType: 'dotted' }, // Mumbai to Pune
    { source: [80.2707, 13.0827], target: [76.9500, 11.0168], lineType: 'dotted' }, // Chennai to Coimbatore
    { source: [88.3639, 22.5726], target: [85.8409, 20.2961], lineType: 'dotted' }, // Kolkata to Bhubaneswar
    { source: [77.5946, 12.9716], target: [74.8801, 15.3173], lineType: 'dotted' }, // Bangalore to Hubli
    { source: [77.2090, 28.6139], target: [78.0419, 27.1767], lineType: 'dotted' }, // Delhi to Agra
    { source: [72.8777, 19.0760], target: [76.0856, 15.3000], lineType: 'dotted' }, // Mumbai to Goa
    { source: [80.2707, 13.0827], target: [78.4867, 17.3850], lineType: 'dotted' }, // Chennai to Hyderabad
    { source: [88.3639, 22.5726], target: [85.3131, 23.3441], lineType: 'dotted' }, // Kolkata to Ranchi
    { source: [77.5946, 12.9716], target: [76.6413, 12.2958], lineType: 'dotted' }, // Bangalore to Mysore
    { source: [76.2711, 10.8505], target: [76.5762, 33.7782], lineType: 'glow' }, // Kerala to Jammu and Kashmir (approx. coords)
    { source: [71.1924, 22.2587], target: [76.5762, 33.7782], lineType: 'arrowhead' }, // Gujarat to Jammu and Kashmir (approx. coords)
    { source: [75.7139, 15.3173], target: [94.5624, 26.1584], lineType: 'multi-dash' }, // Karnataka to Nagaland
  ];

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
    d3.select('#network-map-container svg').remove();

    const container = this.mapContainer.nativeElement;
    const containerWidth = container.offsetWidth;
    const height = containerWidth * 0.8; // Adjust height as needed

    d3.json(`${environment.storageURL}/${environment.bucketName}/${environment.folderName}/${INDIA}`).then((india: any) => {
      const states = topojson.feature(india, india.objects.states) as any;
      
      const projection = d3.geoMercator().fitSize([containerWidth, height], states);
      const path = d3.geoPath().projection(projection);

      const svg = d3.select('#network-map-container')
        .append('svg')
        .attr('width', containerWidth)
        .attr('height', height)
        .attr('viewBox', `0 0 ${containerWidth} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

      // Define a linear gradient for the running lines
      const defs = svg.append('defs');

      const gradient = defs.append('linearGradient')
        .attr('id', 'line-gradient')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '0%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', 'rgba(0,255,0,0)'); // Transparent green

      gradient.append('stop')
        .attr('offset', '50%')
        .attr('stop-color', 'green'); // Solid green

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', 'rgba(0,255,0,0)'); // Transparent green

      // Define arrowhead marker
      defs.append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-5 -5 10 10')
        .attr('refX', 5)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .append('path')
        .attr('d', 'M 0,0 m -5,-5 L 5,0 L -5,5 Z')
        .attr('fill', 'purple');

      svg.selectAll('path')
        .data(states.features)
        .enter().append('path')
        .attr('d', path as any)
        .attr('fill', '#ccc')
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5);

      // Draw network lines
      const lineGenerator = d3.line()
        .curve(d3.curveBundle.beta(0.85)); // Adjust beta for more or less curvature

      svg.selectAll('path.network-line')
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
        .attr('stroke', (d: any) => d.lineType === 'dotted' ? 'url(#line-gradient)' : (d.lineType === 'glow' ? 'blue' : (d.lineType === 'arrowhead' ? 'purple' : 'red'))) // Use gradient for dotted lines, blue for glow, purple for arrowhead, red for multi-dash
        .attr('stroke-width', 2)
        .attr('opacity', 0.7)
        .attr('stroke-dasharray', (d: any) => {
          if (d.lineType === 'dotted' || d.lineType === 'arrowhead') {
            return '10,10';
          } else if (d.lineType === 'multi-dash') {
            return '20, 5, 10, 5'; // Example: long dash, short gap, medium dash, short gap
          } else {
            return '0,0';
          }
        })
        .attr('marker-end', (d: any) => d.lineType === 'arrowhead' ? 'url(#arrowhead)' : '')
        .each(function(d: any) {
          if (d.lineType === 'dotted' || d.lineType === 'arrowhead') {
            const totalLength = (this as SVGPathElement).getTotalLength();
            const pathElement = d3.select(this);

            function repeat() {
              pathElement
                .attr('stroke-dasharray', totalLength + ' ' + totalLength)
                .attr('stroke-dashoffset', totalLength)
                .transition()
                .duration(2000) // Animation duration
                .ease(d3.easeLinear)
                .attr('stroke-dashoffset', 0)
                .on('end', repeat); // Loop the animation
            }
            repeat();
          } else if (d.lineType === 'glow') {
            const originalPath = d3.select(this);
            const totalLength = (this as SVGPathElement).getTotalLength();

            function repeat() {
              originalPath
                .attr('stroke-width', 2)
                .attr('opacity', 0.2)
                .transition()
                .duration(1500) // Pulse duration
                .ease(d3.easeLinear)
                .attr('stroke-width', 8) // Max glow width
                .attr('opacity', 1)
                .transition()
                .duration(1500) // Fade duration
                .ease(d3.easeLinear)
                .attr('stroke-width', 2)
                .attr('opacity', 0.2)
                .on('end', repeat); // Loop the animation
            }
            repeat();
          } else if (d.lineType === 'multi-dash') {
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

      // Add animated circles at source and target points
      svg.selectAll('circle.node-point')
        .data(this.networkData.flatMap((d: any) => [d.source, d.target]))
        .enter().append('circle')
        .attr('class', 'node-point')
        .attr('cx', (d: any) => projection(d)![0])
        .attr('cy', (d: any) => projection(d)![1])
        .attr('r', 5) // Initial radius
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('opacity', 0.8)
        .each(function() {
          const circle = d3.select(this);
          (function repeat() {
            circle.transition()
              .duration(1000)
              .attr('r', 8) // Max radius
              .attr('opacity', 0.2)
              .ease(d3.easeSinOut)
              .transition()
              .duration(1000)
              .attr('r', 5) // Back to initial radius
              .attr('opacity', 0.8)
              .ease(d3.easeSinIn)
              .on('end', repeat);
          })();
        });

    }).catch((error: any) => {
      console.error('Error loading or processing the TopoJSON data:', error);
    });
  }
}
