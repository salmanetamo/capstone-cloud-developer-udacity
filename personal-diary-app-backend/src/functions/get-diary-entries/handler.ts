import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyResult } from 'aws-lambda';
import { getUserId } from 'src/services/auth-service';
import { getDiaryEntries } from 'src/services/diary-entry-service';


const getDiaryEntriesHandler = async (event): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event.headers);
  const diaryEntries = await getDiaryEntries(userId);
  
  return formatJSONResponse({
    items: diaryEntries,
  }, 200);
}

export const main = middyfy(getDiaryEntriesHandler);
