import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDiaryItemAttachmentComponent } from './upload-diary-item-attachment.component';

describe('UploadDiaryItemAttachmentComponent', () => {
  let component: UploadDiaryItemAttachmentComponent;
  let fixture: ComponentFixture<UploadDiaryItemAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadDiaryItemAttachmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDiaryItemAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
