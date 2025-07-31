import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictImprovementsComponent } from './district-improvements.component';

describe('DistrictImprovementsComponent', () => {
  let component: DistrictImprovementsComponent;
  let fixture: ComponentFixture<DistrictImprovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistrictImprovementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistrictImprovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
