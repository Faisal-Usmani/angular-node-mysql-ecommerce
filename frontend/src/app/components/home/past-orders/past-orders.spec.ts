import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastOrders } from './past-orders';

describe('PastOrders', () => {
  let component: PastOrders;
  let fixture: ComponentFixture<PastOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
