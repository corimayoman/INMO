import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private s3: AWS.S3;
  private bucket: string;
  private cdnUrl: string;

  constructor(private config: ConfigService) {
    this.s3 = new AWS.S3({
      endpoint: config.get('S3_ENDPOINT'),
      accessKeyId: config.get('S3_ACCESS_KEY'),
      secretAccessKey: config.get('S3_SECRET_KEY'),
      region: config.get('S3_REGION', 'us-east-1'),
      s3ForcePathStyle: true,
    });
    this.bucket = config.get('S3_BUCKET', 'worldpropertyfinder');
    this.cdnUrl = config.get('CDN_URL', '');
  }

  async uploadImage(buffer: Buffer, originalName: string, folder = 'listings'): Promise<{ url: string; thumbnailUrl: string }> {
    const id = uuidv4();
    const ext = 'webp';
    const key = `${folder}/${id}.${ext}`;
    const thumbKey = `${folder}/${id}-thumb.${ext}`;

    // Process and optimize image
    const [optimized, thumbnail] = await Promise.all([
      sharp(buffer).resize(1920, 1080, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer(),
      sharp(buffer).resize(400, 300, { fit: 'cover' }).webp({ quality: 75 }).toBuffer(),
    ]);

    await Promise.all([
      this.s3.putObject({ Bucket: this.bucket, Key: key, Body: optimized, ContentType: 'image/webp', ACL: 'public-read' }).promise(),
      this.s3.putObject({ Bucket: this.bucket, Key: thumbKey, Body: thumbnail, ContentType: 'image/webp', ACL: 'public-read' }).promise(),
    ]);

    return {
      url: `${this.cdnUrl}/${key}`,
      thumbnailUrl: `${this.cdnUrl}/${thumbKey}`,
    };
  }

  async uploadFile(buffer: Buffer, filename: string, contentType: string, folder = 'documents'): Promise<string> {
    const id = uuidv4();
    const ext = filename.split('.').pop();
    const key = `${folder}/${id}.${ext}`;

    await this.s3.putObject({ Bucket: this.bucket, Key: key, Body: buffer, ContentType: contentType, ACL: 'public-read' }).promise();
    return `${this.cdnUrl}/${key}`;
  }

  async deleteFile(url: string) {
    const key = url.replace(`${this.cdnUrl}/`, '');
    await this.s3.deleteObject({ Bucket: this.bucket, Key: key }).promise();
  }
}
