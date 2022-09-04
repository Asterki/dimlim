import zlib from "zlib";
import fs from "fs";

let compressFile = (location: string) => {
    try {
        let fileStream = fs.createReadStream(location);

        fileStream.pipe(zlib.createGzip()).pipe(fs.createWriteStream(`${location}.gz`));
    } catch (err) {
        throw err;
    }
};

export { compressFile };
