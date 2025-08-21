import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-metrics-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metrics-list.html',
  styleUrls: ['./metrics-list.css']
})
export class MetricsListComponent {
  @Input() data: any;
  @Input() path: any;
  @Input() replaceCode?: any
  dataFetchPath:any
  baseUrl:any = `${environment.storageURL}/${environment.bucketName}/${environment.folderName}`
  finalData:any = []

  constructor(){}

  ngOnInit(){
    this.dataFetchPath = this.replaceCode ? this.path.replace('{code}', this.replaceCode.toString()) : this.path
    this.fetchData()
  }

  fetchData(){
    d3.json(`${this.baseUrl}${this.dataFetchPath}`).then((data:any)=>{
      this.updateData(data.metrics)
    }).catch((err:any)=>{
      console.error("Error loading pie-chart data ",err)
    })
  }

  updateData(fetchedData: any){
    this.finalData = this.data.map((item: any) => {
      const matchedData = fetchedData.find((v: any) => v.identifier === item.identifier);
      return {
        ...item,
        value: matchedData ? matchedData.value : 0
      };
    });
  }
}
