const multer = require("multer");
const path = require("path");

module.exports = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (file.fieldname === "image") {
                cb(null, path.resolve(__dirname, "./img")); // Pasta para imagens
            } else if (file.fieldname === "audio") {
                cb(null, path.resolve(__dirname, "./audio")); // Pasta para áudios
            }
        },
        filename: (req, file, cb) => {
            cb(null, Date.now().toString() + "_" + file.originalname);
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowedExtensions = {
            image: ["image/png", "image/jpg", "image/jpeg"],
            audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3"],
        };

        const fileType = allowedExtensions[file.fieldname];
        if (fileType && fileType.includes(file.mimetype)) {
            return cb(null, true);
        }
        return cb(
            new Error(`Arquivo do tipo ${file.mimetype} não suportado no campo ${file.fieldname}.`),
            false
        );
    },
});
