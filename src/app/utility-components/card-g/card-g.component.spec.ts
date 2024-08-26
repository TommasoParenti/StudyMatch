import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGComponent } from './card-g.component';

describe('CardGComponent', () => {
  let component: CardGComponent;
  let fixture: ComponentFixture<CardGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardGComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
