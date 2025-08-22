import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';
import * as d3 from 'd3';
import { LANDING_PAGE } from '../../../constants/urlConstants';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-program-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './program-details.html',
  styleUrl: './program-details.css'
})
export class ProgramDetails {
  baseUrl: any = `${environment.storageURL}/${environment.bucketName}/${environment.folderName}`
  programData = {
    state_name: "Bihar",
    district_name: "Banka",
    program_type: "SLC",
    name_of_the_program: "Peer-Review Teaching Model",
    about_the_program_objective:
      "The intervention aims to make children in grades 1-3 FLN competent and enhance agency-related skills (such as communication, confidence, problem-solving, and ownership) among Student Champions (Grades 4–5) through a structured Peer-Review Teaching Model. This model promotes student-led teaching and learning, supported by regular peer learning sessions within classrooms.",
    impact_of_the_program:
      "1. 2 out of 3 children in the district become NIPUN (66% of students achieving FLN competencies)\n2. At least 60% student champions (grade 4-5) show improvement by at least one point in agency-related skills (communication, confidence, Problem solving, collaboration, empathy and ownership)",
    stakeholders_doing_the_program: "CRPs, SLs, and teachers",
    pictures_from_the_program:
      "https://drive.google.com/drive/folders/1yQxiuiSdiQrZBM82kRW6feevSN_APZmu?usp=drive_link",
    mi_inititated_from_the_program__total_no_of_mi_startedinprogresssubmitted_or_if_done_via_google_form_then_no_of_responses_submitted: 936,
    status_of_the_program: "Ongoing",
    name_of_the_partner_leading_the_program: ["Involve", "Alohomora"],
    report_link: null,
    logo_urls: [
      "https://storage.googleapis.com/dev-sg-dashboard/sg-dashboard/partners/SLC/WhatsApp Image 2025-08-08 at 9.17.03 AM (1).jpeg",
      "https://storage.googleapis.com/dev-sg-dashboard/sg-dashboard/partners/SLC/WhatsApp Image 2025-08-08 at 9.17.03 AM.jpeg",
      "https://storage.googleapis.com/dev-sg-dashboard/sg-dashboard/partners/SLC/WhatsApp Image 2025-08-08 at 9.17.02 AM.jpeg",
      "https://storage.googleapis.com/dev-sg-dashboard/sg-dashboard/partners/SLC/WhatsApp Image 2025-08-08 at 9.17.03 AM (1).jpeg",
      "https://storage.googleapis.com/dev-sg-dashboard/sg-dashboard/partners/SLC/WhatsApp Image 2025-08-08 at 9.17.03 AM.jpeg",
      "https://storage.googleapis.com/dev-sg-dashboard/sg-dashboard/partners/SLC/WhatsApp Image 2025-08-08 at 9.17.02 AM.jpeg"
    ]
  };


  @ViewChild('galleryTrack') galleryTrack!: ElementRef;

  constructor(private location: Location) { }
  currentSlide = 0;
  public displayImages: string[] = [];
  private transitionEndListener: any;
  visibleSlides = 4; // how many images visible at once
  partnerDetails: any

  ngOnInit(): void {
    this.displayImages = this.programData.logo_urls || [];
    this.getPartnerDetails()
  }

  ngAfterViewInit(): void {
    this.transitionEndListener = () => this.onTransitionEnd();
    this.galleryTrack.nativeElement.addEventListener('transitionend', this.transitionEndListener);
  }

  getPartnerDetails() {

    d3.json(`${environment.storageURL}/${environment.bucketName}/${environment.folderName}/${LANDING_PAGE}`).then((data: any) => {
      this.partnerDetails = data;
      const partners = data.find((item: { type: string; }) => item.type === "partner-logos")?.partners || [];
      console.log(partners);
      this.partnerDetails = partners.filter((p: { name: string; }) =>
        this.programData.name_of_the_partner_leading_the_program.includes(p.name)
      );
      console.log(this.partnerDetails)
    }).catch((error: any) => {
      console.error('Error loading page data:', error);
    });

  }




  ngOnDestroy(): void {
    if (this.galleryTrack && this.galleryTrack.nativeElement && this.transitionEndListener) {
      this.galleryTrack.nativeElement.removeEventListener('transitionend', this.transitionEndListener);
    }
  }

  onTransitionEnd(): void {
    if (this.currentSlide === this.programData.logo_urls.length) {
      this.currentSlide = 0;
      this.updateSlidePosition(false);
    }
  }

  nextSlide(): void {
    if (this.currentSlide < this.programData.logo_urls.length - this.visibleSlides) {
      this.currentSlide++;
    } else {
      this.currentSlide = 0; // loop back
    }
    this.updateSlidePosition();
  }

  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    } else {
      this.currentSlide = this.programData.logo_urls.length - this.visibleSlides;
    }
    this.updateSlidePosition();
  }

  updateSlidePosition(animate = true): void {
    const track = this.galleryTrack.nativeElement;
    track.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
    const slideWidth = 100 / this.visibleSlides; // 25% in CSS
    track.style.transform = `translateX(-${this.currentSlide * slideWidth}%)`;
  }

  goBack(): void {
    this.location.back(); // navigates to the previous page
  }

  get impactText(): string {
    if (!this.programData?.impact_of_the_program) return '';
    // Replace "1." "2." etc. with "•"
    return this.programData.impact_of_the_program.replace(/\d+\./g, '•');
  }

}
