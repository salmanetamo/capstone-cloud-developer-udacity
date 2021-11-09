import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyResult } from 'aws-lambda';
import { createAttachmentPresignedUrl } from 'src/services/attachment-service';

const getPresignedUrlHandler = async (event): Promise<APIGatewayProxyResult> => {
  const diaryEntryId = event.pathParameters.diaryEntryId
  
  const url = await createAttachmentPresignedUrl(diaryEntryId);
  
  return formatJSONResponse({uploadUrl: url}, 201);
}

export const main = middyfy(getPresignedUrlHandler);
