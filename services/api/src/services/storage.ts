import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
});

export async function uploadResumeToS3(file: Express.Multer.File) {
  const key = `resumes/${uuidv4()}-${file.originalname}`;
  await s3.putObject({
    Bucket: process.env.S3_BUCKET_NAME || "hr-resumes",
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "private",
  }).promise();
  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
}

export async function uploadFileToS3(buffer: Buffer, key: string, contentType: string) {
  await s3.putObject({
    Bucket: process.env.S3_BUCKET_NAME || "hr-resumes",
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: "private",
  }).promise();
  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
}
