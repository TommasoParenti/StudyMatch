import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteProfile2Component } from './complete-profile-2.component';

describe('CompleteProfile2Component', () => {
  let component: CompleteProfile2Component;
  let fixture: ComponentFixture<CompleteProfile2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompleteProfile2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteProfile2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
