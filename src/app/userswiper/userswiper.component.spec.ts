import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserswiperComponent } from './userswiper.component';

describe('UserswiperComponent', () => {
  let component: UserswiperComponent;
  let fixture: ComponentFixture<UserswiperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserswiperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserswiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
