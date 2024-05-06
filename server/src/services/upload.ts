import fsExtra from 'fs-extra';
import path from 'path';

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

  async fileExists(filePath: string) {
    return fsExtra.existsSync(filePath);
  }

  async moveFile(oldPath: string, newPath: string) {
    fsExtra.moveSync(oldPath, newPath);
  }

  async copyFile(oldPath: string, newPath: string) {
    fsExtra.copySync(oldPath, newPath);
  }

  async readDirectory(directoryPath: string) {
    return fsExtra.readdirSync(directoryPath);
  }

  async readFile(filePath: string) {
    return fsExtra.readFileSync(filePath);
  }

  async writeFile(filePath: string, data: any) {
    fsExtra
      .writeFile(filePath, data)
      .then(() => {
        console.log('File written successfully');
      })
      .catch((error) => {
        console.log('Error writing file: ', error);
      });
  }
}

export default UploadService;
