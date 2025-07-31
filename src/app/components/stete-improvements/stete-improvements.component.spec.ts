import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteteImprovementsComponent } from './stete-improvements.component';

describe('SteteImprovementsComponent', () => {
  let component: SteteImprovementsComponent;
  let fixture: ComponentFixture<SteteImprovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SteteImprovementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SteteImprovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
