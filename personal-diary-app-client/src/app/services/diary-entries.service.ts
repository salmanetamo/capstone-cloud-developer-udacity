import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DiaryEntryItem } from '../models/diary-entry-item';
import { DiaryEntryRequest } from '../models/diary-entry-request';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiaryEntriesService {
  apiEndpoint = environment.apiEndpoint;

  constructor(private http: HttpClient) { }

  getDiaryEntries(): Observable<DiaryEntryItem[]> {
    console.log('Fetching diary-entries')

    return this.http.get<{ items: DiaryEntryItem[] }>(`${this.apiEndpoint}/diary-entries`, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).pipe(
      map(response => {
        console.log(response.items)
        return response.items
      })
    );
  }

  getDiaryEntry(diaryEntryId: string): Observable<DiaryEntryItem[]> {
    console.log('Fetching diary-entries')

    return this.http.get<DiaryEntryItem[]>(`${this.apiEndpoint}/diary-entries/${diaryEntryId}`, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }

  createDiaryEntry(newDiaryEntry: DiaryEntryRequest): Observable<DiaryEntryItem> {
    return this.http.post<DiaryEntryItem>(`${this.apiEndpoint}/diary-entries`,  JSON.stringify(newDiaryEntry), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  updateDiaryEntry(diaryEntryId: string, updatedDiaryEntry: DiaryEntryRequest): Observable<void> {
    return this.http.put<void>(`${this.apiEndpoint}/diary-entries/${diaryEntryId}`, JSON.stringify(updatedDiaryEntry), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  deleteDiaryEntry(diaryEntryId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiEndpoint}/diary-entries/${diaryEntryId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  getUploadUrl(diaryEntryId: string): Observable<string> {
    return this.http.post<{ uploadUrl: string }>(`${this.apiEndpoint}/diary-entries/${diaryEntryId}/attachment`, '', {
      headers: {
        'Content-Type': 'application/json',
      }
    }).pipe(
      map(response => {
        console.log(response.uploadUrl)
        return response.uploadUrl
      })
    );
  }

  uploadFile(uploadUrl: string, file: File): Observable<void> {
    return this.http.put<void>(uploadUrl, file)
  }
}
