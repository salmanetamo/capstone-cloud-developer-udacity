import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyResult } from 'aws-lambda';
import { getUserId } from 'src/services/auth-service';
import { deleteDiaryEntry } from 'src/services/diary-entry-service';

const deleteDiaryEntryHandler = async (event): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event.headers);
  const diaryEntryId = event.pathParameters.diaryEntryId
  await deleteDiaryEntry(diaryEntryId, userId);
  
  return formatJSONResponse({}, 200);
}

export const main = middyfy(deleteDiaryEntryHandler);
