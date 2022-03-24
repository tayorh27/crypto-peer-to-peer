import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenTransactionsComponent } from './token-transactions.component';

describe('TokenTransactionsComponent', () => {
  let component: TokenTransactionsComponent;
  let fixture: ComponentFixture<TokenTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
