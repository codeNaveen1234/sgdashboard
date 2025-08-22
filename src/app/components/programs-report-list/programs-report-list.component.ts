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

  constructor(private router:Router) {}

  programs = [
    {
      "state_name": "Bihar",
      "district_name": "Banka",
      "program_type": "SLC",
      "name_of_the_program": " Peer-Review Teaching Model",
      "about_the_program_objective": "The intervention aims to make children in grades 1-3 FLN competent and enhance agency-related skills (such as communication, confidence, problem-solving, and ownership) among Student Champions (Grades 4–5) through a structured Peer-Review Teaching Model. This model promotes student-led teaching and learning, supported by regular peer learning sessions within classrooms.",
      "impact_of_the_program": "1. 2 out of 3 children in the district become NIPUN (66% of students achieving FLN competencies)                \n2. At least 60% student champions (grade 4-5) show improvement by at least one point in agency-related skills (communication, confidence, Problem solving,collaboration,  empathy and ownership)",
      "stakeholders_doing_the_program": "CRPs, SLs, and teachers",
      "pictures_from_the_program": "https://drive.google.com/drive/folders/1yQxiuiSdiQrZBM82kRW6feevSN_APZmu?usp=drive_link",
      "mi_inititated_from_the_program__total_no_of_mi_startedinprogresssubmitted_or_if_done_via_google_form_then_no_of_responses_submitted": 936.0,
      "status_of_the_program": "Ongoing",
      "name_of_the_partner_leading_the_program": [
        "Involve"
      ],
      "report_link": null,
      "logo_urls": [
        "https://storage.googleapis.com/dev-sg-dashboard/sg-dashboard/partners/SLC/WhatsApp Image 2025-08-08 at 9.17.03 AM (1).jpeg",
        "https://storage.googleapis.com/dev-sg-dashboard/sg-dashboard/partners/SLC/WhatsApp Image 2025-08-08 at 9.17.03 AM.jpeg",
        "https://storage.googleapis.com/dev-sg-dashboard/sg-dashboard/partners/SLC/WhatsApp Image 2025-08-08 at 9.17.02 AM.jpeg"
      ]
    },
    {
      "state_name": "Bihar",
      "district_name": "Banka",
      "program_type": "SLC",
      "name_of_the_program": " Peer-Review Teaching Model",
      "about_the_program_objective": "The intervention aims to make children in grades 1-3 FLN competent and enhance agency-related skills (such as communication, confidence, problem-solving, and ownership) among Student Champions (Grades 4–5) through a structured Peer-Review Teaching Model. This model promotes student-led teaching and learning, supported by regular peer learning sessions within classrooms.",
      "impact_of_the_program": "1. 2 out of 3 children in the district become NIPUN (66% of students achieving FLN competencies)                \n2. At least 60% student champions (grade 4-5) show improvement by at least one point in agency-related skills (communication, confidence, Problem solving,collaboration,  empathy and ownership)",
      "stakeholders_doing_the_program": "CRPs, SLs, and teachers",
      "pictures_from_the_program": "https://drive.google.com/drive/folders/1yQxiuiSdiQrZBM82kRW6feevSN_APZmu?usp=drive_link",
      "mi_inititated_from_the_program__total_no_of_mi_startedinprogresssubmitted_or_if_done_via_google_form_then_no_of_responses_submitted": 936.0,
      "status_of_the_program": "Ongoing",
      "name_of_the_partner_leading_the_program": [
        "Involve"
      ],
      "report_link": null,
      "logo_urls": [
        "https://storage.googleapis.com/dev-sg-dashboard/sg-dashboard/partners/SLC/WhatsApp Image 2025-08-08 at 9.17.03 AM (1).jpeg",
        "https://storage.googleapis.com/dev-sg-dashboard/sg-dashboard/partners/SLC/WhatsApp Image 2025-08-08 at 9.17.03 AM.jpeg",
        "https://storage.googleapis.com/dev-sg-dashboard/sg-dashboard/partners/SLC/WhatsApp Image 2025-08-08 at 9.17.02 AM.jpeg"
      ]
    },
    {
      "state_name": "Bihar",
      "district_name": "Banka",
      "program_type": "SLC",
      "name_of_the_program": " Peer-Review Teaching Model",
      "about_the_program_objective": "The intervention aims to make children in grades 1-3 FLN competent and enhance agency-related skills (such as communication, confidence, problem-solving, and ownership) among Student Champions (Grades 4–5) through a structured Peer-Review Teaching Model. This model promotes student-led teaching and learning, supported by regular peer learning sessions within classrooms.",
      "impact_of_the_program": "1. 2 out of 3 children in the district become NIPUN (66% of students achieving FLN competencies)                \n2. At least 60% student champions (grade 4-5) show improvement by at least one point in agency-related skills (communication, confidence, Problem solving,collaboration,  empathy and ownership)",
      "stakeholders_doing_the_program": "CRPs, SLs, and teachers",
      "pictures_from_the_program": "https://drive.google.com/drive/folders/1yQxiuiSdiQrZBM82kRW6feevSN_APZmu?usp=drive_link",
      "mi_inititated_from_the_program__total_no_of_mi_startedinprogresssubmitted_or_if_done_via_google_form_then_no_of_responses_submitted": 936.0,
      "status_of_the_program": "Ongoing",
      "name_of_the_partner_leading_the_program": [
        "Involve"
      ],
      "report_link": null,
      "logo_urls": [
        "https://storage.googleapis.com/dev-sg-dashboard/sg-dashboard/partners/SLC/WhatsApp Image 2025-08-08 at 9.17.03 AM (1).jpeg",
        "https://storage.googleapis.com/dev-sg-dashboard/sg-dashboard/partners/SLC/WhatsApp Image 2025-08-08 at 9.17.03 AM.jpeg",
        "https://storage.googleapis.com/dev-sg-dashboard/sg-dashboard/partners/SLC/WhatsApp Image 2025-08-08 at 9.17.02 AM.jpeg"
      ]
    },
    {
      "state_name": "Bihar",
      "district_name": "Banka",
      "program_type": "SLC",
      "name_of_the_program": " Peer-Review Teaching Model",
      "about_the_program_objective": "The intervention aims to make children in grades 1-3 FLN competent and enhance agency-related skills (such as communication, confidence, problem-solving, and ownership) among Student Champions (Grades 4–5) through a structured Peer-Review Teaching Model. This model promotes student-led teaching and learning, supported by regular peer learning sessions within classrooms.",
      "impact_of_the_program": "1. 2 out of 3 children in the district become NIPUN (66% of students achieving FLN competencies)                \n2. At least 60% student champions (grade 4-5) show improvement by at least one point in agency-related skills (communication, confidence, Problem solving,collaboration,  empathy and ownership)",
      "stakeholders_doing_the_program": "CRPs, SLs, and teachers",
      "pictures_from_the_program": "https://drive.google.com/drive/folders/1yQxiuiSdiQrZBM82kRW6feevSN_APZmu?usp=drive_link",
      "mi_inititated_from_the_program__total_no_of_mi_startedinprogresssubmitted_or_if_done_via_google_form_then_no_of_responses_submitted": 936.0,
      "status_of_the_program": "Ongoing",
      "name_of_the_partner_leading_the_program": [
        "Involve"
      ],
      "report_link": null,
      "logo_urls": [
        "https://storage.googleapis.com/dev-sg-dashboard/sg-dashboard/partners/SLC/WhatsApp Image 2025-08-08 at 9.17.03 AM (1).jpeg",
        "https://storage.googleapis.com/dev-sg-dashboard/sg-dashboard/partners/SLC/WhatsApp Image 2025-08-08 at 9.17.03 AM.jpeg",
        "https://storage.googleapis.com/dev-sg-dashboard/sg-dashboard/partners/SLC/WhatsApp Image 2025-08-08 at 9.17.02 AM.jpeg"
      ]
    }
  ]

  scrollLeft(event: any) {
    const container = (event.target as HTMLElement).parentElement!.querySelector('.carousel-track');
    container!.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(event: any) {
    const container = (event.target as HTMLElement).parentElement!.querySelector('.carousel-track');
    container!.scrollBy({ left: 300, behavior: 'smooth' });
  }

  openCommunityDetails() {
    this.router.navigate(['/community-led-improvements']);
  }
}
