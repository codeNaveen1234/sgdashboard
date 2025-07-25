import { Component, Input, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.html',
  styleUrls: ['./carousel.css']
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
  @Input() slides: any[] = [];
  @Input() styles: any = {};
  @Input() title: string = '';

  @ViewChild('carouselTrack') carouselTrack!: ElementRef;

  currentSlide = 0;
  private intervalId: any;

  ngAfterViewInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  startAutoPlay(): void {
    this.stopAutoPlay(); // Ensure no multiple intervals are running
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  stopAutoPlay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.updateSlidePosition();
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.updateSlidePosition();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.updateSlidePosition();
    this.startAutoPlay(); // Restart autoplay when manually navigating
  }

  updateSlidePosition(): void {
    const track = this.carouselTrack.nativeElement;
    track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
  }
}
