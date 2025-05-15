import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private client: S3Client;
  private bucket = 'lumina-dataa';
  private prefix = 'posts-data/';

  constructor(cfg: ConfigService) {
    this.client = new S3Client({
      region: cfg.get('AWS_REGION'),
      // credenciales tomadas de env o ~/.aws/credentials
    });
  }

  async uploadFile(file: Express.Multer.File, keySuffix: string): Promise<string> {
    const key = `${this.prefix}${keySuffix}-${Date.now()}`;
    await this.client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    }));
    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }

  async deleteFile(url: string): Promise<void> {
    const base = `https://${this.bucket}.s3.amazonaws.com/`;
    if (!url.startsWith(base)) return;
    const Key = url.slice(base.length);
    await this.client.send(new DeleteObjectCommand({
      Bucket: this.bucket,
      Key,
    }));
  }
}
