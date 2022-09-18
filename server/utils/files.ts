import zlib from "zlib";
import fs from "fs";

const compressFile = (location: string) => {
    const fileStream = fs.createReadStream(location);

    fileStream.pipe(zlib.createGzip()).pipe(fs.createWriteStream(`${location}.gz`));
};

export { compressFile };
