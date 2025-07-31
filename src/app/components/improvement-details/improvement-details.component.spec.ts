import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementDetailsComponent } from './improvement-details.component';

describe('ImprovementDetailsComponent', () => {
  let component: ImprovementDetailsComponent;
  let fixture: ComponentFixture<ImprovementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprovementDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImprovementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
