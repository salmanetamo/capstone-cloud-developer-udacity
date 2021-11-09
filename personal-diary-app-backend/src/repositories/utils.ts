import { Logger } from "winston";

export function createDynamoDBClient(logger: Logger, XAWS) {
    if (process.env.IS_OFFLINE) {
        logger.info('Creating DynamoDB client locally');
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}