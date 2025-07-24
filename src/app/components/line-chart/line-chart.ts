import { Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports:[NgxChartsModule, MatCardModule],
  templateUrl: './line-chart.html',
  styleUrls: ['./line-chart.css']
})
export class LineChartComponent {
  chartData = [
    {
      name: 'Series 1',
      series: [
        { name: 'Jan', value: 50 },
        { name: 'Feb', value: 70 },
        { name: 'Mar', value: 60 },
        { name: 'Apr', value: 55 },
        { name: 'May', value: 75 }
      ]
    }
  ];

  xAxisLabel = 'Months';
  yAxisLabel = 'Percentage';
}
