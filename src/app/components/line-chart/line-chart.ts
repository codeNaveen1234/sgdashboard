import { Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports:[NgxChartsModule, MatCardModule, MatButtonModule,],
  templateUrl: './line-chart.html',
  styleUrls: ['./line-chart.css']
})
export class LineChartComponent {
  currentYear = '2023';

  allData: Record<string, any[]> = {
    '2021': [
      {
        name: 'Production',
        series: [
          { name: 'Jan', value: 40 },
          { name: 'Feb', value: 55 },
          { name: 'Mar', value: 60 },
          { name: 'Apr', value: 50 },
          { name: 'May', value: 70 }
        ]
      }
    ],
    '2022': [
      {
        name: 'Production',
        series: [
          { name: 'Jan', value: 45 },
          { name: 'Feb', value: 60 },
          { name: 'Mar', value: 65 },
          { name: 'Apr', value: 55 },
          { name: 'May', value: 75 }
        ]
      }
    ],
    '2023': [
      {
        name: 'Production',
        series: [
          { name: 'Jan', value: 50 },
          { name: 'Feb', value: 65 },
          { name: 'Mar', value: 70 },
          { name: 'Apr', value: 60 },
          { name: 'May', value: 80 }
        ]
      }
    ]
  };

  get chartData() {
    return this.allData[this.currentYear];
  }

  xAxisLabel = 'Month';
  yAxisLabel = 'Percentage';

  view: [number, number] = [500, 300];
}
