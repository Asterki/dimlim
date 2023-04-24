import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDestination = process.env.NODE_ENV == "development" ? "../../data/avatars" : "../../../data/avatars";
        cb(null, path.join(__dirname, uploadDestination));
    },
    filename: (req: any, file: any, cb: any) => {
        cb(null, `${req.user.userID}.png`);
    },
});

const avatarUpload = multer({
    storage: storage,
    limits: {
        fieldSize: 8000000,
        files: 1,
    },
    fileFilter: (req: any, file: any, cb: multer.FileFilterCallback) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") return cb(null, true);

        return cb(new Error("invalid-file-type"));
    },
});

export { avatarUpload };