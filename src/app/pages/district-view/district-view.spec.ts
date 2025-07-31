import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictView } from './district-view';

describe('DistrictView', () => {
  let component: DistrictView;
  let fixture: ComponentFixture<DistrictView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistrictView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistrictView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
