import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CountryView } from '../../pages/country-view/country-view';
import { CarouselComponent } from '../carousel/carousel';
import { IndicatorCardComponent } from '../indicator-card/indicator-card';
import { PartnerLogosComponent } from '../partner-logos/partner-logos';
import { LineChartComponent } from '../../components/line-chart/line-chart';
import { PieChartComponent } from '../../components/pie-chart/pie-chart';
import * as d3 from 'd3';
import { environment } from '../../../../environments/environment';
import { COMMUNITY_LED_IMPROVEMENT } from '../../../constants/urlConstants';
import { ProgramsReportListComponent } from '../programs-report-list/programs-report-list.component';

@Component({
  selector: 'app-district-improvements',
  standalone:true,
  imports:[CommonModule, RouterModule, IndicatorCardComponent, PartnerLogosComponent, CarouselComponent, LineChartComponent, PieChartComponent,CountryView, ProgramsReportListComponent],
  templateUrl: './district-improvements.component.html',
  styleUrls: ['./district-improvements.component.css']
})
export class DistrictImprovementsComponent implements OnInit {
  pageData: any = {};
  district:string = '';
  districtCode:string = '';
  metrics:any = [];
  pieChart:any = [];
  stateName:string ='';
  stateCode:string = '';
  programsList:any = [];
  pageConfig:any = '';

  constructor(private route:ActivatedRoute) {
    this.route.paramMap.subscribe((params:any) => {
      this.district = params.get('district') || "";
      this.districtCode = params.get("dt-code")
      this.stateName = params.get('state');
      this.stateCode = params.get('st-code')
    });
    route.data.subscribe((data:any)=>{
      this.pageConfig = data
    })
  }

  ngOnInit(): void {
    this.getImprovementsData();
  }

  getImprovementsData() {
    d3.json(`${environment.storageURL}/${environment.bucketName}/${environment.folderName}/districts/${this.districtCode}/metrics.json`).then((data: any) => {
      this.metrics = data.metrics
      d3.json(`${environment.storageURL}/${environment.bucketName}/${environment.folderName}/districts/${this.districtCode}/pie-chart.json`).then((data: any) => {
        this.pieChart = data.data;
        this.getProgramsList()
      }).catch((error: any) => {
        console.error('Error loading page data:', error);
      });
    }).catch((error: any) => {
      console.error('Error loading page data:', error);
    });
  }

  getProgramsList() {
    d3.json(`${environment.storageURL}/${environment.bucketName}/${environment.folderName}/districts/${this.districtCode}/${this.pageConfig.type == "communityDetails" ? 'SLC.json':'WLC.json'}`).then((data: any) => {
      console.log(data);
      this.programsList = data;
      this.fetchPageData();
    }).catch((error: any) => {
      console.error('Error loading page data:', error);
    });
  }

  fetchPageData(): void {
    d3.json('/assets/leaders-improvement-district-details.json').then((data: any) => {
      this.pageData = data;
      this.pageData.forEach((element:any) => {
        if(element.type == "data-indicators") {
          this.metrics.map((metric:any) => {
            element.indicators.push(
              {...{"icon":"assets/icons/group.svg"},...metric}
            )
          })
        }
        if(element.type == "pie-chart") {
          element.data = this.pieChart
        }
      });
      console.log(this.pageData);
    }).catch((error: any) => {
      console.error('Error loading page data:', error);
    });
  }
}
