import type { AWS } from '@serverless/typescript';
import {
  Auth,
  CreateDiaryEntry,
  UpdateDiaryEntry,
  GetDiaryEntry,
  GetDiaryEntries,
  DeleteDiaryEntry,
  GetPresignedUrl 
} from './src/functions/index';


const serverlessConfiguration: AWS = {
  org: 'salmanetamo',
  app: 'personal-diary-app',
  service: 'personal-diary-app-backend',
  frameworkVersion: '2',
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
    },
    ['serverless-offline']: {
      port: 3003
    },
    dynamodb: {
      start: {
        port: 8000,
        inMemory: true,
        migrate: true
      },
      stages: [
        'dev'
      ]
    }
  },
  plugins: [
    'serverless-esbuild',
    'serverless-plugin-tracing',
    'serverless-iam-roles-per-function',
    'serverless-dynamodb-local',
    'serverless-offline'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',

      JWKS_URL: 'https://dev-lswwbacj.us.auth0.com/.well-known/jwks.json',
      DIARY_ENTRIES_TABLE: 'DiaryEntries-${self:provider.stage}',
      ATTACHMENT_S3_BUCKET: 'salmane-personal-diary-images-${self:provider.stage}',
      SIGNED_URL_EXPIRATION: '300'
    },
    lambdaHashingVersion: '20201221',
    stage: "${opt:stage, 'dev'}",
    region: 'ap-south-1',
    logs: {
      restApi: true
    },
    tracing: {
      lambda: true,
      apiGateway: true
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'xray:PutTelemetryRecords',
          'xray:PutTraceSegments'
        ],
        Resource: "*"
      }
    ]
  },
  functions: {
    Auth,
    CreateDiaryEntry,
    UpdateDiaryEntry,
    GetDiaryEntry,
    GetDiaryEntries,
    DeleteDiaryEntry,
    GetPresignedUrl
  },
  resources: {
    Resources: {
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
            'gatewayresponse.header.Access-Control-Allow-Methods': "'GET,OPTIONS,POST'"
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          }
        },
      },
      DiaryEntriesTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: 'userId',
              AttributeType: 'S'
            },
            {
              AttributeName: 'diaryEntryId',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'userId',
              KeyType: 'HASH'
            },
            {
              AttributeName: 'diaryEntryId',
              KeyType: 'RANGE'
            }
          ],
          BillingMode: 'PAY_PER_REQUEST',
          TableName: "${self:provider.environment.DIARY_ENTRIES_TABLE}"
        }
      },
      AttachmentsBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: "${self:provider.environment.ATTACHMENT_S3_BUCKET}",
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: [
                  '*'
                ],
                AllowedHeaders: [
                  '*'
                ],
                AllowedMethods: [
                  'GET',
                  'PUT',
                  'POST',
                  'DELETE',
                  'HEAD'
                ],
                MaxAge: '3000'
              }
            ]
          }
        }
      },
      BucketPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          PolicyDocument: {
            Id: 'MyPolicy',
            Version: "2012-10-17",
            Statement: [
              {
                Sid: 'PublicReadForGetBucketObjects',
                Effect: 'Allow',
                Principal: '*',
                Action: [
                  "s3:GetObject",
                  "s3:PutObject",
                  "s3:PutObjectAcl",
                  "s3:DeleteObject"
                ],
                Resource: 'arn:aws:s3:::${self:provider.environment.ATTACHMENT_S3_BUCKET}/*'
              }
            ]
          },
          Bucket: {
            Ref: 'AttachmentsBucket'
          }
        }
      }
    }
  },
  package: {
    individually: true
  }
};

module.exports = serverlessConfiguration;
