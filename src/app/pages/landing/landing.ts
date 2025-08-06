import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IndicatorCardComponent } from '../../components/indicator-card/indicator-card';
import * as d3 from 'd3';

import { PartnerLogosComponent } from '../../components/partner-logos/partner-logos';
import { CarouselComponent } from '../../components/carousel/carousel';
import { CountryView } from '../country-view/country-view';
import { CatalysingNetwork1 } from '../catalysing-network-1/catalysing-network-1';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { GlobalMap2 } from '../global-map-2/global-map-2';
import { Global7Map } from '../global-map-7/global-map-7';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, IndicatorCardComponent, PartnerLogosComponent, CarouselComponent, CountryView, CatalysingNetwork1, GlobalMap2, Global7Map],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css'],
  animations: [
    trigger('zoomFade', [
      state('in', style({ transform: 'scale(1)', opacity: 1 })),
      state('out', style({ transform: 'scale(1.2)', opacity: 0 })),
      transition('in => out', [animate('1000ms ease-out')]),
    ]),
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', [animate('1000ms ease-in')]),
    ])
  ]
})
export class LandingComponent implements OnInit, AfterViewInit {

  pageData: any = [];
  
  isGlobalMapVisible = true; 
  animationState: 'in' | 'out' = 'in';

  constructor() { }

  ngOnInit(): void {
    this.fetchPageData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.animationState = 'out';
    }, 1000); 

    setTimeout(() => {
      this.isGlobalMapVisible = false;
    }, 1200);
  }

  fetchPageData(): void {
    d3.json('/assets/landing-page.json').then((data: any) => {
      this.pageData = data;
    }).catch((error: any) => {
      console.error('Error loading page data:', error);
    });
  }

}
