export interface DiaryEntryItem {
    userId: string;
    diaryEntryId: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    attachmentUrl?: string;
}