const multer = require("multer");

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload_pic = multer({ storage: storage });

module.exports = { upload_pic };