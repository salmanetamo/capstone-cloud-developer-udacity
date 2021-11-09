import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyResult } from 'aws-lambda';
import { getUserId } from 'src/services/auth-service';
import { getDiaryEntry } from 'src/services/diary-entry-service';

const getDiaryEntryHandler = async (event): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event.headers);
  const diaryEntryId = event.pathParameters.diaryEntryId
  const diaryEntry = await getDiaryEntry(userId, diaryEntryId);
  
  return formatJSONResponse({
    item: diaryEntry,
  }, 200);
}

export const main = middyfy(getDiaryEntryHandler);
