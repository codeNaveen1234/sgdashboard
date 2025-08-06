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
  private isDrawing = false;

  networkData: any
  markerConfigList: any = {
    momentum: { hqIcon: "./assets/marker-icons/hq-circle.svg", icon: "./assets/marker-icons/circle.svg", color: "#572E91" },
    strategic: { hqIcon: "./assets/marker-icons/hq-square.svg", icon: "./assets/marker-icons/square.svg", color: "orange" },
    collaborator: { hqIcon: "./assets/marker-icons/hq-triangle.svg", icon: "./assets/marker-icons/triangle.svg", color: "red" },
    anchor: { hqIcon: "./assets/marker-icons/hq-diamond.svg", icon: "./assets/marker-icons/diamond.svg", color: "pink" }
  }
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.getNetworkData().then(() => {
      if (this.networkData) {
        this.drawMap();
      }
    });
  }

  goToNetworkPage() {
    if (!this.isPartnerShowable) {
      this.router.navigate(['/network-health']);
    }
  }

  getNetworkData(): Promise<void> {
    return d3.json('/assets/network-data.json')
      .then((networkData: any) => {
        this.networkData = networkData;
      })
      .catch((error: any) => {
        console.error('Error loading network data:', error);
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.drawMap();
  }

  private drawMap(): void {
    if (this.isDrawing) return;
    this.isDrawing = true;

    // Clear existing content to prevent multiple maps on resize
    d3.select(this.mapContainer.nativeElement).selectAll('*').remove();

    const container = this.mapContainer.nativeElement;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    d3.json('/assets/india.json').then((india: any) => {
      const states = topojson.feature(india, india.objects.states) as any;

      const projection = d3.geoMercator().fitSize([containerWidth, containerHeight], states);
      const path = d3.geoPath().projection(projection);

      const svg = d3.select(this.mapContainer.nativeElement)
        .append('svg')
        .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

      const defs = svg.append('defs');
      const gradient = defs.append('linearGradient')
        .attr('id', 'line-gradient')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '0%');

      gradient.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(0,255,0,0)');
      gradient.append('stop').attr('offset', '50%').attr('stop-color', 'green');
      gradient.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(0,255,0,0)');

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

      const getCoords = (location: any) => {
        if (location.coords) return location.coords;

        let locationName = location.stateName || location.countryName;
        if (locationName) {
          locationName = locationName.trim().toLowerCase();
          if (locationName === 'india') return d3.geoCentroid(states);

          const feature = states.features.find((f: any) =>
            f.properties && f.properties.st_nm && f.properties.st_nm.trim().toLowerCase() === locationName
          );
          if (feature) return d3.geoCentroid(feature);

          if (location.countryName) {
            return projection.invert ? projection.invert([containerWidth / 2, 0]) : [0, 0];
          }
        }
        console.warn(`Location not found for`, location);
        return null;
      };

      const lineGenerator = d3.line().curve(d3.curveBundle.beta(0.85));

      svg.selectAll('path.network-line')
        .data(this.networkData?.impactData.filter((d: any) => d.source && d.target))
        .enter().append('path')
        .attr('class', 'network-line')
        .attr('d', (d: any) => {
          const sourceCoords = getCoords(d.source);
          const targetCoords = getCoords(d.target);
          if (!sourceCoords || !targetCoords) return null;

          const projectedSource = projection(sourceCoords);
          const projectedTarget = projection(targetCoords);
          if (!projectedSource || !projectedTarget) return null;

          const midX = (projectedSource[0] + projectedTarget[0]) / 2;
          const midY = (projectedSource[1] + projectedTarget[1]) / 2;

          let controlPoint: [number, number];
          const currentCurvature = d.curvature !== undefined ? d.curvature : 0.3;

          if (currentCurvature === 0) {
            controlPoint = [midX, midY];
          } else {
            const dx = projectedTarget[0] - projectedSource[0];
            const dy = projectedTarget[1] - projectedSource[1];
            controlPoint = [midX, midY - Math.abs(dy) * currentCurvature];
          }

          return lineGenerator([projectedSource, controlPoint, projectedTarget]);
        })
        .attr('fill', 'none')
        .attr('stroke', (d: any) => d.color)
        .attr('stroke-width', 2)
        .attr('opacity', 0.7)
        .attr('stroke-dasharray', (d: any) => {
          if (d.lineType === 'dotted' || d.lineType === 'arrowhead') return '10,10';
          else if (d.lineType === 'multi-dash') return '20, 5, 10, 5';
          else return '0,0';
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
                .transition().duration(2000).ease(d3.easeLinear)
                .attr('stroke-dashoffset', 0)
                .on('end', repeat);
            }
            repeat();
          } else if (d.lineType === 'glow') {
            const originalPath = d3.select(this);
            function repeat() {
              originalPath
                .attr('stroke-width', 2).attr('opacity', 0.2)
                .transition().duration(1500).ease(d3.easeLinear)
                .attr('stroke-width', 8).attr('opacity', 1)
                .transition().duration(1500).ease(d3.easeLinear)
                .attr('stroke-width', 2).attr('opacity', 0.2)
                .on('end', repeat);
            }
            repeat();
          } else if (d.lineType === 'multi-dash') {
            const totalLength = (this as SVGPathElement).getTotalLength();
            const pathElement = d3.select(this);
            function repeat() {
              pathElement
                .attr('stroke-dashoffset', totalLength)
                .transition().duration(5000).ease(d3.easeLinear)
                .attr('stroke-dashoffset', 0)
                .on('end', repeat);
            }
            repeat();
          }
        });

      const iconData = this.networkData.impactData.flatMap((d: any) => {
        const icons = [];
        if (d.source) {
          const coords = getCoords(d.source);
          if (coords) {
            icons.push({ iconUrl: this.markerConfigList[d.source.icon].icon, coordinates: coords, partner_ids: d.source.partner_id });
          }
        }
        if (d.target) {
          const coords = getCoords(d.target);
          if (coords) {
            icons.push({ iconUrl: this.markerConfigList[d.target.icon].icon, coordinates: coords, partner_ids: d.target.partner_id });
          }
        }
        return icons;
      });

      const tooltip = d3.select('#tooltip');
      svg.on('click', () => tooltip.style('display', 'none'));

      svg.selectAll('image.node-icon')
        .data(iconData)
        .enter().append('image')
        .attr('class', 'node-icon')
        .attr('xlink:href', (d: any) => d.iconUrl)
        .attr('x', (d: any) => {
          const projected = projection(d.coordinates);
          return projected ? projected[0] - 12 : -9999;
        })
        .attr('y', (d: any) => {
          const projected = projection(d.coordinates);
          return projected ? projected[1] - 12 : -9999;
        })
        .attr('width', 20)
        .attr('height', 20)
        .each(function (d: any) {
          const icon = d3.select(this);
          const projected = projection(d.coordinates);
          if (!projected) return;
          const x = projected[0];
          const y = projected[1];

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
            const partnerDetails = d.partner_ids.map((id: any) =>
              this.networkData?.partners.find((p: { id: any }) => p.id === id)
            );
            tooltip.style('display', 'block')
              .html(partnerDetails.map((p: any) =>
                `<a href="${p.website}" target="_blank"><ul style="list-style-type: none; padding: 0; margin: 0; cursor: pointer;"><li><img src="${p.src}" width="12" height="12" /><span> ${p.name}</span></li></ul></a>`
              ).join(''))
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 28) + 'px');
          }
        });

      this.isDrawing = false;
    }).catch((error: any) => {
      console.error('Error loading or processing the TopoJSON data:', error);
      this.isDrawing = false;
    });
  }
}