import { Component, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, MatCardModule],
  templateUrl: './pie-chart.html',
  styleUrls: ['./pie-chart.css']
})
export class PieChartComponent {
  pieData = [
    { name: 'Solar', value: 35 },
    { name: 'Wind', value: 25 },
    { name: 'Hydro', value: 20 },
    { name: 'Biomass', value: 10 },
    { name: 'Other', value: 10 }
  ];

  view: [number, number] = [400, 300]; // width x height

  // options
  showLegend = true;
  showLabels = true;
}
