import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { DiaryEntryRequest } from 'src/requests/diary-entry-request';
import { getUserId } from 'src/services/auth-service';
import { updateDiaryEntry } from 'src/services/diary-entry-service';

import schema from '../../requests/diary-entry-schema';

const updateDiaryEntryHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const diaryEntryRequest: DiaryEntryRequest = event.body;
  const userId = getUserId(event.headers);
  const diaryEntryId = event.pathParameters.diaryEntryId;
  
  await updateDiaryEntry(diaryEntryRequest, diaryEntryId, userId);
  
  return formatJSONResponse({}, 200);
}

export const main = middyfy(updateDiaryEntryHandler);
