import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recoverpwd1Component } from './recoverpwd1.component';

describe('Recoverpwd1Component', () => {
  let component: Recoverpwd1Component;
  let fixture: ComponentFixture<Recoverpwd1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Recoverpwd1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Recoverpwd1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
