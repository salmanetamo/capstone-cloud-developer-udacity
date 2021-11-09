import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DiaryEntryItem } from '../../models/diary-entry-item';

@Component({
  selector: 'app-upload-diary-item-attachment',
  templateUrl: './upload-diary-item-attachment.component.html',
  styleUrls: ['./upload-diary-item-attachment.component.scss']
})
export class UploadDiaryItemAttachmentComponent implements OnInit {
  @Input() diaryEntry: DiaryEntryItem | undefined;
  @Output() cancelled: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() fileUploaded: EventEmitter<File> = new EventEmitter<File>();
  fileName = '';

  constructor() { }

  ngOnInit(): void {
  }


  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileUploaded.emit(file);
    }
  }

  cancel() {
    this.cancelled.emit(true);
  }
}
