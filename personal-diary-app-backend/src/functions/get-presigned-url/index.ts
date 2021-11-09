import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'diary-entries/{diaryEntryId}/attachment',
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
        's3:PutObject',
        's3:GetObject',
        's3:\'*\''
      ],
      Resource: "arn:aws:s3:::${self:provider.environment.ATTACHMENT_S3_BUCKET}/*"
    }
  ]
}
