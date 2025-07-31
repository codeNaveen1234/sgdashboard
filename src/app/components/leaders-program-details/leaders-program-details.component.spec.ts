import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadersProgramDetailsComponent } from './leaders-program-details.component';

describe('LeadersProgramDetailsComponent', () => {
  let component: LeadersProgramDetailsComponent;
  let fixture: ComponentFixture<LeadersProgramDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadersProgramDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadersProgramDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
