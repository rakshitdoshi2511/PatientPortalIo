import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ValidateUserPage } from './validate-user.page';

describe('ValidateUserPage', () => {
  let component: ValidateUserPage;
  let fixture: ComponentFixture<ValidateUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateUserPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ValidateUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
