import schema from '../../requests/diary-entry-schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'put',
        path: 'diary-entries/{diaryEntryId}',
        cors: true,
        authorizer: {
          name: 'Auth',
        },
        request: {
          schema: {
            'application/json': schema
          }
        }
      }
    }
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:UpdateItem',
      ],
      Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.DIARY_ENTRIES_TABLE}"
    }
  ]
}
