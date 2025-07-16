import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryView } from './country-view';

describe('CountryView', () => {
  let component: CountryView;
  let fixture: ComponentFixture<CountryView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
