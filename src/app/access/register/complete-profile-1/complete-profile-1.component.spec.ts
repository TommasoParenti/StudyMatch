import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteProfile1Component } from './complete-profile-1.component';

describe('CompleteProfile1Component', () => {
  let component: CompleteProfile1Component;
  let fixture: ComponentFixture<CompleteProfile1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompleteProfile1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteProfile1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
