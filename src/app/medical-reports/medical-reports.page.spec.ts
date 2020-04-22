import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MedicalReportsPage } from './medical-reports.page';

describe('MedicalReportsPage', () => {
  let component: MedicalReportsPage;
  let fixture: ComponentFixture<MedicalReportsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalReportsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
