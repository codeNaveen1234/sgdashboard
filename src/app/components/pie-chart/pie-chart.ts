import { Component, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, MatCardModule],
  templateUrl: './pie-chart.html',
  styleUrls: ['./pie-chart.css']
})
export class PieChartComponent {
  private _pieData: any[] = [];

  @Input()
  set pieData(value: any[]) {
    // Sanitize data: Convert empty or invalid values to 0
    this._pieData = value.map(item => ({
      name: item.name || 'Unknown',
      value: Number(item.value) || 0 // Convert to number, default to 0 if invalid
    }));
  }

  get pieData(): any[] {
    return this._pieData;
  }

  // options
  showLegend = true;
  showLabels = true;

  // Custom color scheme
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#8979fe', // Red for Infrastructure and resources
      '#3dc3e0', // Teal for School structure and practices
      '#feb962', // Blue for Leadership
      '#698ef7', // Green for Pedagogy
      '#ffe502', // Yellow for Assessment and Evaluation
      '#D4A5A5'  // Pink for Community Engagement
    ]
  };

  // Custom label formatting to show percentage
  labelFormatting = (data: any,values:any) => {
    const total = this.pieData.reduce((sum, item) => sum + item.value, 0);
    const name = data;
    const value = this.pieData.find((element:any) => element.name == data);
    const percentage = total > 0 ? ((value.value / total) * 100).toFixed(1) : 0;
    return `${name} (${percentage}%)`;
  };

  tooltipText = (data: any) => {
    const total = this.pieData.reduce((sum, item) => sum + item.value, 0);
    const name = data.data.name;
    const percentage = total > 0 ? ((data.data.value / total) * 100).toFixed(1) : 0;
    return `${name} (${percentage}%)`;
  };
}
