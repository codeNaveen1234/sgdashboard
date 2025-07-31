import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener, Input } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalysing-network-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalysing-network-1.html',
  styleUrl: './catalysing-network-1.css'
})
export class CatalysingNetwork1 implements OnInit {
  @ViewChild('networkMapContainer') private mapContainer!: ElementRef;
  @Input() showDetails: boolean = false;
  @Input() isPartnerShowable: boolean = true;

  networkData: any
  markerConfigList: any = {
    momentum: { hqIcon: "./assets/marker-icons/hq-circle.svg", icon: "./assets/marker-icons/circle.svg", color: "#572E91" },
    strategic: { hqIcon: "./assets/marker-icons/hq-square.svg", icon: "./assets/marker-icons/square.svg", color: "orange" },
    collaborator: { hqIcon: "./assets/marker-icons/hq-triangle.svg", icon: "./assets/marker-icons/triangle.svg", color: "red" },
    anchor: { hqIcon: "./assets/marker-icons/hq-diamond.svg", icon: "./assets/marker-icons/diamond.svg", color: "pink" }
  }
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getNetworkData()
  }

  goToNetworkPage() {
    if (!this.isPartnerShowable) {
      this.router.navigate(['/network-health']);
    }
  }

  getNetworkData() {
    d3.json('/assets/network-data.json').then((networkData: any) => {
      this.networkData = networkData;
      console.log(this.networkData)
      if (this.networkData) {
        this.drawMap();
      }
    }).catch((error: any) => {
      console.error('Error loading indicator data:', error);
    });
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
        .data(this.networkData?.impactData.filter((d: any) => d.source && d.target))
        .enter().append('path')
        .attr('class', 'network-line')
        .attr('d', (d: any) => {
          const sourceCoords = projection(d.source.coords);
          const targetCoords = projection(d.target.coords);

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
        .attr('stroke', (d: any) => d.color) // Use color from data // Use gradient for dotted lines, blue for glow, purple for arrowhead, red for multi-dash
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

      const iconData = this.networkData.impactData.flatMap((d: any) => {
        const icons = [];
        if (d.source) {
          icons.push({ iconUrl: this.markerConfigList[d.source.icon].icon, coordinates: d.source.coords, partner_ids: d.source.partner_id });
        }
        if (d.target) {
          icons.push({ iconUrl: this.markerConfigList[d.target.icon].icon, coordinates: d.target.coords, partner_ids: d.target.partner_id });
        }
        return icons;
      });

      const tooltip = d3.select('#tooltip');

      svg.on('click', () => {
        tooltip.style('display', 'none');
      });

      svg.selectAll('image.node-icon')
        .data(iconData)
        .enter()
        .append('image')
        .attr('class', 'node-icon')
        .attr('xlink:href', (d: any) => d.iconUrl)
        .attr('x', (d: any) => projection(d.coordinates)![0] - 12)
        .attr('y', (d: any) => projection(d.coordinates)![1] - 12)
        .attr('width', 20)
        .attr('height', 20)
        .each(function(d: any) {
          const icon = d3.select(this);
          const x = projection(d.coordinates)![0];
          const y = projection(d.coordinates)![1];
          
          function rotate() {
            icon.transition()
              .duration(2000)
              .ease(d3.easeLinear)
              .attrTween('transform', () => {
                const i = d3.interpolate(0, 360);
                return (t) => `rotate(${i(t)}, ${x}, ${y})`;
              })
              .on('end', rotate);
          }
          rotate();
        })
        .on('click', (event, d: any) => {
          if (this.isPartnerShowable) {
            event.stopPropagation();
            const [x, y] = d3.pointer(event);
            const partnerDetails = d.partner_ids.map((id: any) => this.networkData?.partners.find((p: { id: any; }) => p.id === id));
            tooltip.style('display', 'block')
              .html(partnerDetails.map((p: any) => `<a href="${p.website}" target="_blank"><ul style="list-style-type: none; padding: 0; margin: 0; cursor: pointer;"><li><img src="${p.src}" width="12" height="12" /><span> ${p.name}</span></li></ul></a>`).join(''))
              .style('left', (x + 10) + 'px')
              .style('top', (y - 28) + 'px');
          }
        });

    }).catch((error: any) => {
      console.error('Error loading or processing the TopoJSON data:', error);
    });
  }
}