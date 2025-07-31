import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityProgramDetailsComponent } from './community-program-details.component';

describe('CommunityProgramDetailsComponent', () => {
  let component: CommunityProgramDetailsComponent;
  let fixture: ComponentFixture<CommunityProgramDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunityProgramDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityProgramDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
