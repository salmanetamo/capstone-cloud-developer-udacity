import schema from '../../requests/diary-entry-schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'diary-entries',
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
        'dynamodb:PutItem',
      ],
      Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.DIARY_ENTRIES_TABLE}"
    }
  ]
}
