import { DiaryEntryItem } from "src/models/diary-entry-item";
import { DiaryEntryRepository } from "src/repositories/diary-entry-repository";
import { DiaryEntryRequest } from "src/requests/diary-entry-request";
import { createLogger } from "src/utils/logger";
import * as uuid from 'uuid';
import { getAttachmentUrl } from "./attachment-service";


const diaryEntriesAccess = new DiaryEntryRepository();
const logger = createLogger('DiaryEntryService');

export async function getDiaryEntries(userId: string): Promise<DiaryEntryItem[]> {
    logger.info(`getdiaryEntriesForUser ${userId} start...`);
    return diaryEntriesAccess.getDiaryEntries(userId);
}

export async function getDiaryEntry(userId: string, diaryEntryId: string): Promise<DiaryEntryItem> {
    logger.info(`getDiaryEntry with userId: ${userId} and diaryEntryId: ${diaryEntryId} start...`);
    return diaryEntriesAccess.getDiaryEntry(userId, diaryEntryId);
}

export async function createDiaryEntry(createDiaryEntryRequest: DiaryEntryRequest, userId: string): Promise<DiaryEntryItem> {
    logger.info('creatediaryEntry start...');
    const diaryEntryId = uuid.v4();
    const url = getAttachmentUrl(diaryEntryId);
    const now = new Date().toISOString();

    return diaryEntriesAccess.createDiaryEntry({
        diaryEntryId,
        userId,
        title: createDiaryEntryRequest.title,
        updatedAt: now,
        createdAt: now,
        attachmentUrl: `${url}.jpg`,
        description: createDiaryEntryRequest.description
    });
}

export async function updateDiaryEntry(updatediaryEntryRequest: DiaryEntryRequest, diaryEntryId: string, userId: string): Promise<void> {
    logger.info('updatediaryEntry start...');
    return diaryEntriesAccess.updateDiaryEntry(
        {
            updatedAt: new Date().toISOString(),
            title: updatediaryEntryRequest.title,
            description: updatediaryEntryRequest.description
        },
        diaryEntryId,
        userId
    );
}

export async function deleteDiaryEntry(diaryEntryId: string, userId: string): Promise<void> {
    logger.info('deletediaryEntry start...');
    return diaryEntriesAccess.deleteDiaryEntry(diaryEntryId, userId);
}
