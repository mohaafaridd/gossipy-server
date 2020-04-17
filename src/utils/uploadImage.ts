import * as AWS from 'aws-sdk'
import * as path from 'path'
import * as crypto from 'crypto'
import { ReadStream } from 'fs'

interface File {
  filename: string
  mimetype: string
  encoding: string
  createReadStream(): ReadStream
}

export type IFile = Promise<File>

AWS.config.update({
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
})

const s3 = new AWS.S3()

export const uploadImage = async (file: IFile, folder: string) => {
  const { filename, createReadStream } = await file
  // s3 variables
  const fileExtension = path.parse(filename).ext
  const Key = `${folder}/${crypto
    .randomBytes(20)
    .toString('hex')}${fileExtension}`
  const stream = createReadStream()

  const params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_S3_BUCKET_NAME || '',
    Body: stream,
    Key,
  }

  await s3.upload(params).promise()

  return Key
}
