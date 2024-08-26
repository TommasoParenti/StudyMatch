import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupswiperComponent } from './groupswiper.component';

describe('GroupswiperComponent', () => {
  let component: GroupswiperComponent;
  let fixture: ComponentFixture<GroupswiperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupswiperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupswiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
