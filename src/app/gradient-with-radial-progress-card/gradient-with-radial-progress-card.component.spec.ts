import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GradientWithRadialProgressCardComponent } from './gradient-with-radial-progress-card.component';

describe('GradientWithRadialProgressCardComponent', () => {
  let component: GradientWithRadialProgressCardComponent;
  let fixture: ComponentFixture<GradientWithRadialProgressCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradientWithRadialProgressCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GradientWithRadialProgressCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
