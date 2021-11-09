import * as AWS from 'aws-sdk';

const AWSXRay = require("aws-xray-sdk");
if (process.env.IS_OFFLINE) {
    AWSXRay.setContextMissingStrategy("LOG_ERROR");
}
const XAWS = AWSXRay.captureAWS(AWS);
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
});

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export async function createAttachmentPresignedUrl(diaryEntryId: string): Promise<string> {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: `${diaryEntryId}.jpg`,
        Expires: parseInt(urlExpiration)
    });
}

export function getAttachmentUrl(diaryEntryId: string) {
    return `https://${bucketName}.s3.amazonaws.com/${diaryEntryId}`
}