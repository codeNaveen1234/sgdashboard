import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalysingNetworks } from './catalysing-network-1';

describe('CatalysingNetworks', () => {
  let component: CatalysingNetworks;
  let fixture: ComponentFixture<CatalysingNetworks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalysingNetworks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalysingNetworks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
