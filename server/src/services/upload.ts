import fsExtra from "fs-extra";
import sharp from "sharp";
import path from "path";

import { v4 as uuidv4 } from "uuid";

class UploadService {
    private static instance: UploadService | null = null;

    public static getInstance() {
        if (!this.instance) this.instance = new UploadService();
        return this.instance;
    }

    async uploadFile(folderPath: string, fileName: string, rawData: any) {
        fsExtra.writeFile(path.join(__dirname, folderPath, fileName), rawData, function (err: any) {
            if (err) console.log(err);
        });
    }

    async deleteFile(file: string) {
        fsExtra.unlinkSync(file);
    }

    async createDirectory(folderPath: string) {
        // Create directory
        fsExtra.mkdirpSync(folderPath);
    }

    async deleteDirectory(folderPath: string) {
        // Delete directory
        fsExtra.removeSync(folderPath);
    }


}

export default UploadService;
