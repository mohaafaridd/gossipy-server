import * as AWS from 'aws-sdk'
import * as path from 'path'
import * as crypto from 'crypto'
import sharp from 'sharp'
import { ReadStream } from 'fs'
import { Readable } from 'stream'

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
  try {
    const { filename, createReadStream } = await file
    // s3 variables
    const fileExtension = path.parse(filename).ext
    const Key = `${folder}/${crypto
      .randomBytes(20)
      .toString('hex')}${fileExtension}`

    const transformer = sharp().resize(500, 500)
    const stream = createReadStream().pipe(transformer)

    const params = {
      ACL: 'public-read',
      Bucket: process.env.AWS_S3_BUCKET_NAME || '',
      Body: stream,
      Key,
    }

    await s3.upload(params).promise()

    return Key
  } catch {
    return `${folder}/default.png`
  }
}
