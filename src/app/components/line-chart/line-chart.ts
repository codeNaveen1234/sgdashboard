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

  @Input() allData: Record<string, any[]> = {};

  get chartData() {
    return this.allData[this.currentYear];
  }

  xAxisLabel = 'Month';
  yAxisLabel = 'Percentage';

  view: [number, number] = [500, 300];
}
