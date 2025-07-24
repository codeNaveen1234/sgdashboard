import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalysing-network-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalysing-network-1.html',
  styleUrl: './catalysing-network-1.css'
})
export class CatalysingNetwork1 implements OnInit, AfterViewInit {
  @ViewChild('networkMapContainer') private mapContainer!: ElementRef;

  // Dummy data for network lines (example: connecting major cities)
  networkData = [
    // Existing Data
    {
      source: [77.2090, 28.6139], target: [72.8777, 19.0760],
      lineType: 'multi-dash',
      sourceIcon: '/assets/icons/source-icon.png',
      targetIcon: '/assets/icons/target-icon.jpg',
      partners: [{ name: 'Partner A', icon: '/assets/icons/target-icon.jpg' }, { name: 'Partner B', icon: '/assets/icons/target-icon.jpg' }],
      curvature: 0.3
    }, // Delhi to Mumbai

    {
      source: [75.7139, 15.3173], target: [94.5624, 26.1584],
      lineType: 'multi-dash',
      sourceIcon: '/assets/icons/source-icon.png',
      targetIcon: '/assets/icons/target-icon.jpg',
      partners: [{ name: 'Partner C', icon: '/assets/icons/target-icon.jpg' }, { name: 'Partner D', icon: '/assets/icons/target-icon.jpg' }],
      curvature: 0.3
    }, // Karnataka to Nagaland

    {
      source: [90.4336, 27.5142], target: [77.5946, 12.9716],
      lineType: 'multi-dash',
      sourceIcon: '/assets/icons/source-icon.png',
      targetIcon: '/assets/icons/target-icon.jpg',
      partners: [{ name: 'Partner E', icon: '/assets/icons/target-icon.jpg' }],
      curvature: 0.3
    }, // Bhutan to Karnataka

    {
      source: [45.3182, 2.0469], target: [75.7873, 26.9124],
      lineType: 'multi-dash',
      sourceIcon: '/assets/icons/source-icon.png',
      targetIcon: '/assets/icons/target-icon.jpg',
      partners: [{ name: 'Partner F', icon: '/assets/icons/target-icon.jpg' }, { name: 'Partner G', icon: '/assets/icons/target-icon.jpg' }, { name: 'Partner H', icon: '/assets/icons/target-icon.jpg' }],
      curvature: 0.3
    }, // Somalia (Mogadishu) to Rajasthan (Jaipur)

    {
      source: [51.3890, 35.6892], target: [76.9366, 8.5241],
      lineType: 'multi-dash',
      sourceIcon: '/assets/icons/source-icon.png',
      targetIcon: '/assets/icons/target-icon.jpg',
      partners: [{ name: 'Partner I', icon: '/assets/icons/target-icon.jpg' }],
      curvature: 0.3
    }, // Iran (Tehran) to Kerala (Thiruvananthapuram)

    {
      source: [116.4074, 39.9042], target: [77.5946, 12.9716],
      lineType: 'multi-dash',
      sourceIcon: '/assets/icons/source-icon.png',
      targetIcon: '/assets/icons/target-icon.jpg',
      partners: [{ name: 'Partner J', icon: '/assets/icons/target-icon.jpg' }, { name: 'Partner K', icon: '/assets/icons/target-icon.jpg' }],
      curvature: 0.8 // Special high curvature for this line
    }, // China (Beijing) to Karnataka (Bangalore)

    // Additional Internal Connections
    {
      source: [77.2090, 28.6139], target: [75.7873, 26.9124],
      lineType: 'multi-dash',
      sourceIcon: '/assets/icons/source-icon.png',
      targetIcon: '/assets/icons/target-icon.jpg',
      partners: [{ name: 'Partner L', icon: '/assets/icons/target-icon.jpg' }],
      curvature: 0.3
    }, // Delhi to Jaipur (Rajasthan)

    {
      source: [88.3639, 22.5726], target: [79.0193, 21.1458],
      lineType: 'multi-dash',
      sourceIcon: '/assets/icons/source-icon.png',
      targetIcon: '/assets/icons/target-icon.jpg',
      partners: [{ name: 'Partner M', icon: '/assets/icons/target-icon.jpg' }],
      curvature: 0.3
    }, // Kolkata (West Bengal) to Maharashtra (Nagpur)

    {
      source: [77.2090, 28.6139], target: [88.3639, 22.5726],
      lineType: 'solid',
      sourceIcon: '/assets/icons/source-icon.png',
      targetIcon: '/assets/icons/target-icon.jpg',
      partners: [{ name: 'Partner N', icon: '/assets/icons/target-icon.jpg' }],
      curvature: 0.3
    }, // Delhi to Kolkata

    {
      source: [72.8777, 19.0760], target: [78.4867, 17.3850],
      lineType: 'multi-dash',
      sourceIcon: '/assets/icons/source-icon.png',
      targetIcon: '/assets/icons/target-icon.jpg',
      partners: [{ name: 'Partner O', icon: '/assets/icons/target-icon.jpg' }],
      curvature: 0.3
    }, // Mumbai to Hyderabad

    {
      source: [80.9462, 26.8467], target: [76.9366, 8.5241],
      lineType: 'solid',
      sourceIcon: '/assets/icons/source-icon.png',
      targetIcon: '/assets/icons/target-icon.jpg',
      partners: [{ name: 'Partner P', icon: '/assets/icons/target-icon.jpg' }],
      curvature: 0.3
    }, // Lucknow (Uttar Pradesh) to Kerala
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
    const containerHeight = container.offsetHeight;

    d3.json('/assets/india.json').then((india: any) => {
      const states = topojson.feature(india, india.objects.states) as any;

      const projection = d3.geoMercator().fitSize([containerWidth, containerHeight], states);
      const path = d3.geoPath().projection(projection);

      const svg = d3.select('#network-map-container')
        .append('svg')
        .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
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
        .attr('fill', '#ffcc99')
        .attr('stroke', '#000')
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

          const midX = (sourceCoords[0] + targetCoords[0]) / 2;
          const midY = (sourceCoords[1] + targetCoords[1]) / 2;

          let controlPoint: [number, number];

          const currentCurvature = d.curvature !== undefined ? d.curvature : 0.3; // Default curvature

          if (currentCurvature === 0) {
            // Straight line
            controlPoint = [midX, midY];
          } else {
            // Curved line
            const dx = targetCoords[0] - sourceCoords[0]; // Difference in X
            const dy = targetCoords[1] - sourceCoords[1]; // Difference in Y

            // Adjust the control point to always push the curve upwards
            controlPoint = [
              midX, // Keep the X coordinate the same as the midpoint for a symmetric curve
              midY - Math.abs(dy) * currentCurvature // Pull the control point upwards by the magnitude of dy
            ];
          }


          return lineGenerator([sourceCoords, controlPoint, targetCoords]);
        })
        .attr('fill', 'none')
        .attr('stroke', (d: any) => d.lineType === 'dotted' ? 'url(#line-gradient)' : (d.lineType === 'glow' ? 'blue' : (d.lineType === 'multi-dash' ? 'red' : 'purple'))) // Use gradient for dotted lines, blue for glow, purple for arrowhead, red for multi-dash
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
        .each(function (d: any) {
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

      // Add icons at source and target points
      const iconData = this.networkData.flatMap((d: any) => [
        { icon: d.sourceIcon, coordinates: d.source, partners: d.partners },
        { icon: d.targetIcon, coordinates: d.target, partners: d.partners },
      ]);

      const tooltip = d3.select('#tooltip');

      svg.on('click', () => {
        tooltip.style('display', 'none');
      });

      svg.selectAll('image.node-icon')
        .data(iconData)
        .enter()
        .append('image')
        .attr('class', 'node-icon')
        .attr('xlink:href', (d: any) => d.icon)
        .attr('x', (d: any) => projection(d.coordinates)![0] - 12)
        .attr('y', (d: any) => projection(d.coordinates)![1] - 12)
        .attr('width', 24)
        .attr('height', 24)
        .on('click', (event, d: any) => {
          event.stopPropagation();
          const [x, y] = d3.pointer(event);
          tooltip.style('display', 'block')
            .html(d.partners.map((p: { icon: any; name: any; }) => `<ul style="list-style-type: none; padding: 0; margin: 0;"><li><img src="${p.icon}" width="12" height="12" /><span> ${p.name}</span></li></ul>`).join(''))
            .style('left', (x + 10) + 'px')
            .style('top', (y - 28) + 'px');
        });

    }).catch((error: any) => {
      console.error('Error loading or processing the TopoJSON data:', error);
    });
  }
}
