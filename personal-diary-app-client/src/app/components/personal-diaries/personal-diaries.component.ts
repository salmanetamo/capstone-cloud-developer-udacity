import { Component, OnInit } from '@angular/core';
import { DiaryEntriesService } from '../../services/diary-entries.service';
import { DiaryEntryItem } from '../../models/diary-entry-item';
import { DiaryEntryRequest } from '../../models/diary-entry-request';
import * as Buffer from 'buffer';

@Component({
  selector: 'app-personal-diaries',
  templateUrl: './personal-diaries.component.html',
  styleUrls: ['./personal-diaries.component.scss']
})
export class PersonalDiariesComponent implements OnInit {
  diaryEntries: DiaryEntryItem[] = [];
  selectedDiary: DiaryEntryItem | undefined = undefined;
  loading = false;
  showCreateDiaryEntryForm = false;
  showEditDiaryEntryForm = false;
  showUploadAttachmentForm = false;

  constructor(private diaryEntriesService: DiaryEntriesService) { }

  ngOnInit(): void {
    this.getDiaryEntries();
  }

  getDiaryEntries() {
    this.loading = true;
    this.diaryEntriesService.getDiaryEntries().subscribe(diaryEntries => {
      this.diaryEntries = diaryEntries;
      this.selectedDiary = this.diaryEntries[0];
      this.loading = false;
    });
  }

  createDiaryEntry(event: DiaryEntryRequest) {
    this.loading = true;
    this.diaryEntriesService.createDiaryEntry(event).subscribe(_ => {
      this.getDiaryEntries();
      this.showCreateDiaryEntryForm = false;
    });
  }

  updateDiaryEntry(diaryEntryId: string, event: DiaryEntryRequest) {
    this.loading = true;
    this.diaryEntriesService.updateDiaryEntry(diaryEntryId, event).subscribe(_ => {
      this.getDiaryEntries();
      this.showEditDiaryEntryForm = false;
    });
  }

  deleteDiaryEntry(diaryEntryId: string) {
    this.loading = true;
    this.diaryEntriesService.deleteDiaryEntry(diaryEntryId).subscribe(_ => {
      this.getDiaryEntries();
    });
  }

  uploadAttachment(diaryEntryId: string, event: File) {
    this.loading = true;
    this.diaryEntriesService.getUploadUrl(diaryEntryId).subscribe(uploadUrl => {
      this.diaryEntriesService.uploadFile(uploadUrl, event).subscribe(_ => {
        this.getDiaryEntries();
        this.showUploadAttachmentForm = false;
      });
    });
  }

  getDiaryEntryToUpdateRequest(): DiaryEntryRequest {
    return {
      title: this.selectedDiary?.title ?? "",
      description: this.selectedDiary?.description ?? ""
    };
  }

  toggleShowCreateDiaryEntryForm() {
    this.showCreateDiaryEntryForm = !this.showCreateDiaryEntryForm;
  }

  toggleShowEditDiaryEntryForm(diaryEntry: DiaryEntryItem) {
    this.showEditDiaryEntryForm = !this.showEditDiaryEntryForm;
    if (this.showEditDiaryEntryForm) {
      this.selectedDiary = diaryEntry;
    }
  }

  toggleShowUploadAttachmentForm(diaryEntry: DiaryEntryItem) {
    this.showUploadAttachmentForm = !this.showUploadAttachmentForm;
    if (this.showUploadAttachmentForm) {
      this.selectedDiary = diaryEntry;
    }
  }

  setSelectedDiary(diaryEntry: DiaryEntryItem) {
    this.selectedDiary = diaryEntry;
  }

  hideForms() {
    this.showCreateDiaryEntryForm = false;
    this.showEditDiaryEntryForm = false;
    this.showUploadAttachmentForm = false;
  }
}
