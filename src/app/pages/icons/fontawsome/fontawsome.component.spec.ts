import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontawsomeComponent } from './fontawsome.component';

describe('FontawsomeComponent', () => {
  let component: FontawsomeComponent;
  let fixture: ComponentFixture<FontawsomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FontawsomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FontawsomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
