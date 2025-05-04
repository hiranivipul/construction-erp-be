import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../../config';

export class S3Service {
    private s3Client: S3Client;
    private bucketName: string;

    constructor() {
        this.s3Client = new S3Client({
            region: 'ap-south-1',
            credentials: {
                accessKeyId: config.aws.accessKeyId,
                secretAccessKey: config.aws.secretAccessKey,
            },
            forcePathStyle: false,
        });
        this.bucketName = config.aws.s3.bucketName;
    }

    async uploadFile(
        file: Buffer,
        key: string,
        contentType: string,
    ): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file,
            ContentType: contentType,
        });

        await this.s3Client.send(command);
        return key;
    }

    async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        return getSignedUrl(this.s3Client, command, { expiresIn });
    }

    async deleteFile(key: string): Promise<void> {
        try {
            console.log('Attempting to delete file with key:', key);
            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });
            await this.s3Client.send(command);
            console.log('Successfully deleted file:', key);
        } catch (error) {
            console.error('Error deleting file from S3:', error);
            throw error;
        }
    }
}
