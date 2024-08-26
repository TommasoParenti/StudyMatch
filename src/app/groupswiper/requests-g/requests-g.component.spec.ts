import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsGComponent } from './requests-g.component';

describe('RequestsGComponent', () => {
  let component: RequestsGComponent;
  let fixture: ComponentFixture<RequestsGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestsGComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
