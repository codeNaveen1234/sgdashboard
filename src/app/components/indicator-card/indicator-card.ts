import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-indicator-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './indicator-card.html',
  styleUrls: ['./indicator-card.css']
})
export class IndicatorCardComponent {
  @Input() value: string | number = '';
  @Input() label: string = '';
  @Input() icon: string = '';
}
