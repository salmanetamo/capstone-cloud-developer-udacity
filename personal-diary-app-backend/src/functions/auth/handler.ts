import { APIGatewayTokenAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { createLogger } from 'src/utils/logger'
import { verifyToken } from 'src/services/auth-service'
import { middyfy } from '@libs/lambda';

const logger = createLogger('Auth0Authorizer');

export const auth0Authorizer = async (
    event: APIGatewayTokenAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
    logger.info('Authorizing a user', event.authorizationToken)
    try {
        const jwtToken = await verifyToken(event.authorizationToken)
        logger.info('User was authorized', jwtToken)

        return {
            principalId: jwtToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        }
    } catch (e) {
        logger.error('User not authorized', { error: e.message })

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        }
    }
}

export const main = middyfy(auth0Authorizer);
