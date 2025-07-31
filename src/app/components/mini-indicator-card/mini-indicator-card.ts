import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mini-indicator-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-indicator-card.html',
  styleUrls: ['./mini-indicator-card.css']
})
export class MiniIndicatorCardComponent {
  @Input() value: string | number = '';
  @Input() label: string = '';
}
