import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiatTransactionsComponent } from './fiat-transactions.component';

describe('FiatTransactionsComponent', () => {
  let component: FiatTransactionsComponent;
  let fixture: ComponentFixture<FiatTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiatTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiatTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
