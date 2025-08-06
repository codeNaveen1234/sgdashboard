import { Component, OnInit } from '@angular/core';
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
  imports: [CommonModule, RouterModule, IndicatorCardComponent, PartnerLogosComponent, CarouselComponent, CountryView, CatalysingNetwork1,GlobalMap2, Global7Map],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css'],
  animations: [
    trigger('zoomInOut', [
      state('start', style({ transform: 'scale(1)' })),
      state('zoomed', style({ transform: 'scale(1.2)' })),
      transition('start => zoomed', [animate('500ms ease-in-out')]),
    ])
  ]
})
export class LandingComponent implements OnInit {

  pageData: any = [];
  showFirst = true;

  constructor() { }

  ngOnInit(): void {
    this.fetchPageData();
  }

   ngAfterViewInit() {
    setTimeout(() => {
      this.showFirst = false;
    }, 1000); // Switch after 2 seconds
  }

  fetchPageData(): void {
    d3.json('/assets/landing-page.json').then((data: any) => {
      this.pageData = data;
    }).catch((error: any) => {
      console.error('Error loading page data:', error);
    });
  }

}
