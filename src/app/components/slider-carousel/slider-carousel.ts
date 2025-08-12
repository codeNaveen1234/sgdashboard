import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-slider-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider-carousel.html',
  styleUrls: ['./slider-carousel.scss']
})
export class SliderCarouselComponent {
  slides = [
    {
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris Lorem ipsum dolor sit amet,',
      name: 'Namium Ipsum',
      designation:'Designation',
      org: 'Org Name/Link'
    },
    {
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris Lorem ipsum dolor sit amet,',
      name: 'Namium Ipsum',
      designation:'Designation',
      org: 'Org Name/Link'
    },
    {
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris Lorem ipsum dolor sit amet,',
      name: 'Namium Ipsum',
      designation:'Designation',
      org: 'Org Name/Link'
    },
        {
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris Lorem ipsum dolor sit amet,',
      name: 'Namium Ipsum',
      designation:'Designation',
      org: 'Org Name/Link'
    },
    {
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris Lorem ipsum dolor sit amet,',
      name: 'Namium Ipsum',
      designation:'Designation',
      org: 'Org Name/Link'
    }
  ];

  colors = ['#00c853', '#aa00ff', '#2979ff']; // Green, Purple, Blue
  currentIndex = 0;

  getTransform() {
    return `translateX(-${this.currentIndex * 320}px)`;
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
