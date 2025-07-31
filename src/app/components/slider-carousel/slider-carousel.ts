import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slider-carousel',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './slider-carousel.html',
  styleUrls: ['./slider-carousel.scss']
})
export class SliderCarouselComponent {

  slides = [
    {
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      name: 'Namium Ipsium',
      org: 'Org Name/Link'
    },
    {
      message: 'Ut enim ad minim veniam, quis nostrud exercitation...',
      name: 'Namium Ipsium',
      org: 'Org Name/Link'
    },
    {
      message: 'Sed do eiusmod tempor incididunt ut labore et dolore...',
      name: 'Namium Ipsium',
      org: 'Org Name/Link'
    },
    {
      message: 'New slide content...',
      name: 'Namium Ipsium',
      org: 'Org Name/Link'
    },
    {
      message: 'New slide content...',
      name: 'Namium Ipsium',
      org: 'Org Name/Link'
    },
    {
      message: 'New slide content...',
      name: 'Namium Ipsium',
      org: 'Org Name/Link'
    }
  ];

  currentIndex = 0;

  getTransform() {
    return `translateX(-${this.currentIndex * 300}px)`;
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextSlide() {
    if (this.currentIndex < this.slides.length - 3) {
      this.currentIndex++;
    }
  }
}
