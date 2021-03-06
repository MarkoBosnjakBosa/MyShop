const multer = require("multer");
var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, "temporary");
    },
    filename: function (request, file, callback) {
        var fileArray = file.originalname.split(".");
        var fileName = fileArray[0] + "_" + Date.now() + "." + fileArray[1];
        callback(null, fileName);
    },
});
var upload = multer({
    storage: storage,
    fileFilter: function (request, file, callback) {
        if(file.mimetype.match("image.*")) {
            callback(null, true);
        } else {
            request.extensionValidationError = true;
            return callback(null, false, request.extensionValidationError);
        }
    }
});
module.exports = upload;