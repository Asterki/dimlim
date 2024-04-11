import fsExtra from 'fs-extra';
import sharp from 'sharp';
import path from 'path';

import { v4 as uuidv4 } from 'uuid';


class UploadService {
    private static instance: UploadService | null = null;

    public static getInstance() {
        if (!this.instance) this.instance = new UploadService();
        return this.instance;
    }

    async uploadFile(file: any) {
        // Upload file to cloud storage
    }

    async deleteFile(file: any) {
        // Delete file from cloud storage
    }

    async compressImage(file: any) {
        // Compress image
    }

    async saveImage(file: any) {
        // Save image
    }

    async updateProfilePicture(file: any) {
        // Update user's profile picture
    }

    async deleteOldProfilePicture(file: any) {
        // Delete old profile picture
    }

    async createDirectory(file: any) {
        // Create directory
    }

    async uploadProfilePicture(file: any) {
        // Upload profile picture
    }

    async deleteProfilePicture(file: any) {
        // Delete profile picture
    }
}

export default UploadService;