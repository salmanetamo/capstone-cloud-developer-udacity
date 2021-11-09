import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { DiaryEntryRequest } from 'src/requests/diary-entry-request';
import { getUserId } from 'src/services/auth-service';
import { createDiaryEntry } from 'src/services/diary-entry-service';

import schema from '../../requests/diary-entry-schema';

const createDiaryEntryHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const diaryEntryRequest: DiaryEntryRequest = event.body;
  const userId = getUserId(event.headers);
  const newDiaryEntry = await createDiaryEntry(diaryEntryRequest, userId);
  
  return formatJSONResponse({ item: newDiaryEntry }, 201);
}

export const main = middyfy(createDiaryEntryHandler);
