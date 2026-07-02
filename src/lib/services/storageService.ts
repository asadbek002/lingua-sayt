import fs from "fs/promises";
import path from "path";

export interface UploadResult {
  fileUrl: string;
  filePath: string;
}

export interface StorageService {
  uploadFile(buffer: Buffer, filename: string, mimeType: string): Promise<UploadResult>;
  deleteFile(filePath: string): Promise<void>;
}

class LocalStorageService implements StorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), "uploads", "applications");
  }

  async uploadFile(buffer: Buffer, filename: string, _mimeType: string): Promise<UploadResult> {
    await fs.mkdir(this.uploadDir, { recursive: true });

    const timestamp = Date.now();
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueFilename = `${timestamp}_${safeFilename}`;
    const filePath = path.join(this.uploadDir, uniqueFilename);

    await fs.writeFile(filePath, buffer);

    return {
      fileUrl: `/api/files/${uniqueFilename}`,
      filePath,
    };
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch {
      // File may not exist
    }
  }
}

// Future: class S3StorageService implements StorageService { ... }
// Future: class CloudflareR2StorageService implements StorageService { ... }

export const storageService: StorageService = new LocalStorageService();
