const appConstants = require('../constants/AppConstants');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req, file, callback){
        const filenameArr = file.originalname.split('.');
        callback(null, filenameArr[0].replace(/\s/g,'') + '-' + Date.now() + '.' + filenameArr[1]);
    }
})
const upload = multer({ 
    storage,
    fileFilter: function (req, file, callback) {
        const imageTypes = ['image/jpeg','image/gif','image/png','image/jpg','image/tif'];
        if (imageTypes.includes(file.mimetype)) {
            callback(null, true)
        } else {
            return callback(new Error(appConstants.ERROR_MESSAGES.INVALID_FILE));
        }
        if (req.headers.token) {
            callback(null, true);
        } else {
            return callback(new Error(appConstants.ERROR_MESSAGES.UNAUTHORIZED_ACCESS));
        }
    }
 });
const type = upload.single('image');

const picture = require('../modules/post.js');
module.exports = function(app){
    app.post('/postPicture', type, picture.postPicture);
};
