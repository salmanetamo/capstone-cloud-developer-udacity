import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDiariesComponent } from './personal-diaries.component';

describe('PersonalDiariesComponent', () => {
  let component: PersonalDiariesComponent;
  let fixture: ComponentFixture<PersonalDiariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalDiariesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDiariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
