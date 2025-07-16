import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IndicatorCardComponent } from '../../components/indicator-card/indicator-card';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, IndicatorCardComponent],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent implements OnInit {

  indicatorData = [
    { value: 15000, label: 'MIs Activated/Initiated' },
    { value: 5000, label: 'Leaders Driving Improvements' },
    { value: 10000, label: 'Schools Driving Improvements' },
    { value: 25, label: 'Momentum Partners Mobilizing Action' },
    { value: 10, label: 'Strategic Partners' },
    { value: 500, label: 'Community-Led Improvements' },
    { value: '75%', label: 'Funds Mobilised' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
