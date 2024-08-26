import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesGComponent } from './messages-g.component';

describe('MessagesGComponent', () => {
  let component: MessagesGComponent;
  let fixture: ComponentFixture<MessagesGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessagesGComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
