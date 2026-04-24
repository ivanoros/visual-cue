import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveCustomer } from './live-customer';

describe('LiveCustomer', () => {
  let component: LiveCustomer;
  let fixture: ComponentFixture<LiveCustomer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveCustomer],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveCustomer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
