import { createLogger } from "src/utils/logger";
import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createDynamoDBClient } from "./utils";
import { DiaryEntryItem } from "src/models/diary-entry-item";
import { DiaryEntryUpdate } from "src/models/diary-entry-update";

const AWSXRay = require("aws-xray-sdk");
if (process.env.IS_OFFLINE) {
    AWSXRay.setContextMissingStrategy("LOG_ERROR");
}
const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('DiaryEntryRepository');

export class DiaryEntryRepository {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(logger, XAWS),
        private readonly diaryEntriesTable = process.env.DIARY_ENTRIES_TABLE
    ) {}

    async getDiaryEntries(userId: string): Promise<DiaryEntryItem[]> {
        logger.info(`Getting diary entries for user ${userId}`);
        const result = await this.docClient.query({
            TableName: this.diaryEntriesTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
            ':userId': userId
            },
            ScanIndexForward: false
        }).promise();

        return result.Items as DiaryEntryItem[];
    }
    
    async getDiaryEntry(userId: string, diaryEntryId: string): Promise<DiaryEntryItem> {
        logger.info(`Getting diary entries for user ${userId}`);
        const result = await this.docClient.query({
            TableName: this.diaryEntriesTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
            ':userId': userId
            },
            ScanIndexForward: false
        }).promise();

        const diaryEntries = result.Items as DiaryEntryItem[];

        return diaryEntries.find(diaryEntry => diaryEntry.diaryEntryId === diaryEntryId);
    }


    async createDiaryEntry(diaryEntry: DiaryEntryItem): Promise<DiaryEntryItem> {
        logger.info(`Creating diary entry with id ${diaryEntry.diaryEntryId}`);
        await this.docClient.put({
            TableName: this.diaryEntriesTable,
            Item: diaryEntry
        }).promise();

        return diaryEntry;
    }

    async updateDiaryEntry(diaryEntry: DiaryEntryUpdate, diaryEntryId: string, userId: string): Promise<void>{
        logger.info(`Updating diaryEntry with id ${diaryEntryId}`);
        await this.docClient.update({
            TableName: this.diaryEntriesTable,
            Key: {
                diaryEntryId,
                userId
            },
            ExpressionAttributeNames: {
                '#diaryEntry_title': 'title',
            },
            ExpressionAttributeValues: {
                ':title': diaryEntry.title,
                ':updatedAt': diaryEntry.updatedAt,
                ':description': diaryEntry.description,
            },
            UpdateExpression: 'SET #diaryEntry_title = :title, updatedAt = :updatedAt, description = :description',
            ReturnValues: 'ALL_NEW',
        }).promise();
    } 

    async deleteDiaryEntry(diaryEntryId: string, userId: string): Promise<void>{
        logger.info(`Deleting diaryEntry with id ${diaryEntryId}`);
        await this.docClient.delete({
            TableName: this.diaryEntriesTable,
            Key: {
                diaryEntryId,
                userId
            }
        }).promise();
    }
}