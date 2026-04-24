import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveCustomers } from './live-customers';

describe('LiveCustomers', () => {
  let component: LiveCustomers;
  let fixture: ComponentFixture<LiveCustomers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveCustomers],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveCustomers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
