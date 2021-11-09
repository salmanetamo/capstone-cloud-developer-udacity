import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'delete',
        path: 'diary-entries/{diaryEntryId}',
        cors: true,
        authorizer: {
          name: 'Auth',
        }
      }
    }
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:DeleteItem',
      ],
      Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.DIARY_ENTRIES_TABLE}"
    }
  ]
}
