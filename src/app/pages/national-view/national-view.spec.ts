import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalView } from './national-view';

describe('NationalView', () => {
  let component: NationalView;
  let fixture: ComponentFixture<NationalView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NationalView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NationalView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
