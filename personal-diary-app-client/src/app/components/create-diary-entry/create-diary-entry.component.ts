import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DiaryEntryRequest } from '../../models/diary-entry-request';

@Component({
  selector: 'app-create-diary-entry',
  templateUrl: './create-diary-entry.component.html',
  styleUrls: ['./create-diary-entry.component.scss']
})
export class CreateDiaryEntryComponent implements OnInit {
  titleField = '';
  descriptionField = '';
  @Output() diaryEntryCreatedOrUpdated: EventEmitter<DiaryEntryRequest> = new EventEmitter<DiaryEntryRequest>();
  @Output() cancelled: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isEditForm = false;
  @Input() entryToUpdate: DiaryEntryRequest | undefined;

  constructor() { }

  ngOnInit(): void {
    if (this.isEditForm && this.entryToUpdate) {
      this.titleField = this.entryToUpdate.title;
      this.descriptionField = this.entryToUpdate.description;
    }
  }

  submit() {
    this.diaryEntryCreatedOrUpdated.emit({
      title: this.titleField,
      description: this.descriptionField
    });
  }

  cancel() {
    this.cancelled.emit(true);
  }

}
