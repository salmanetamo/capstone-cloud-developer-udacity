import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDiaryEntryComponent } from './create-diary-entry.component';

describe('CreateDiaryEntryComponent', () => {
  let component: CreateDiaryEntryComponent;
  let fixture: ComponentFixture<CreateDiaryEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDiaryEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDiaryEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
