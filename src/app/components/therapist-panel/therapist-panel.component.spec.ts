import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistPanelComponent } from './therapist-panel.component';

describe('TherapistPanelComponent', () => {
  let component: TherapistPanelComponent;
  let fixture: ComponentFixture<TherapistPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TherapistPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TherapistPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
