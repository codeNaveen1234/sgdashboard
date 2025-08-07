import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CountryView } from '../../pages/country-view/country-view';
import { CarouselComponent } from '../carousel/carousel';
import { IndicatorCardComponent } from '../indicator-card/indicator-card';
import { PartnerLogosComponent } from '../partner-logos/partner-logos';
import { LineChartComponent } from '../../components/line-chart/line-chart';
import { PieChartComponent } from '../../components/pie-chart/pie-chart';
import * as d3 from 'd3';
import { environment } from '../../../../environments/environment';
import { COMMUNITY_LED_IMPROVEMENT } from '../../../constants/urlConstants';

@Component({
  selector: 'app-district-improvements',
  standalone:true,
  imports:[CommonModule, RouterModule, IndicatorCardComponent, PartnerLogosComponent, CarouselComponent, LineChartComponent, PieChartComponent,CountryView],
  templateUrl: './district-improvements.component.html',
  styleUrls: ['./district-improvements.component.css']
})
export class DistrictImprovementsComponent implements OnInit {
  pageData: any = {};

  constructor() { }

  ngOnInit(): void {
    this.fetchPageData();
  }

  fetchPageData(): void {
    d3.json(`${environment.storageURL}/${environment.bucketName}/${environment.folderName}/${COMMUNITY_LED_IMPROVEMENT}`).then((data: any) => {
      this.pageData = data;
      this.prepareLogosForScrolling();
    }).catch((error: any) => {
      console.error('Error loading page data:', error);
    });
  }

  prepareLogosForScrolling(): void {
    const partnerLogosSection = this.pageData.sections.find((s:any) => s.type === 'partner-logos');
    if (partnerLogosSection && partnerLogosSection.partners) {
      this.pageData.allLogos = partnerLogosSection.partners.flatMap((p:any) => p.logos);
    }
  }
}
