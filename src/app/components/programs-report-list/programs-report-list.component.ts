import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-programs-report-list',
  standalone: true,
  imports: [CommonModule,MatCardModule],
  templateUrl: './programs-report-list.component.html',
  styleUrl: './programs-report-list.component.css'
})
export class ProgramsReportListComponent {

  @Input() headerText:string = 'Programs List';
  @Input() CommunityButton:boolean = false;
  @Input() pageConfig:any;

  constructor(private router:Router) {}

  @Input() programs:any = []

  scrollLeft(event: any) {
    event.stopPropagation(); //Prevent a parent element’s event handler from firing
    const container = (event.target as HTMLElement).parentElement!.querySelector('.carousel-track');
    container!.scrollBy({ left: -300, behavior: 'smooth' });
  }

  openReport(report:any) {
    if(report.report_link) {
      window.open(report.report_link,'_blank')
    }
    else {
      this.router.navigate(['/program-details'], { state: { report } });
    }
  }

  scrollRight(event: any) {
    event.stopPropagation();
    const container = (event.target as HTMLElement).parentElement!.querySelector('.carousel-track');
    container!.scrollBy({ left: 300, behavior: 'smooth' });
  }

  openCommunityDetails() {
    this.router.navigate(['/community-led-improvements']);
  }
}
