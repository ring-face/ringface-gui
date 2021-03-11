import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaysEventsComponent } from './days-events.component';

describe('DaysEventsComponent', () => {
  let component: DaysEventsComponent;
  let fixture: ComponentFixture<DaysEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaysEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaysEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
