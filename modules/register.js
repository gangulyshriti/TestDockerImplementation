// node modules
const crypto = require('crypto');

// helper files
const pHandler = require('../helpers/PromiseHandler'),
    responseManager = require('../helpers/ResponseManager'),
    headerConstants = require('../constants/HeaderConstants'),
    utilityManager = require('../helpers/Utility'),
    appConstants = require('../constants/AppConstants');
// models
const userModel = require('../models/User');

exports.register = async function(req, res) {
    const extra = {
        res: res
    };
    //register codes go here

    if (req.body && req.body.email && req.body.name && req.body.password) {
        const {email, name, password} = req.body;
        // validate email
        const validEmail = utilityManager.validateEmail(email);
        if (!validEmail) {
            utilityManager.throwError(appConstants.ERROR_MESSAGES.INVALID_EMAIL, appConstants.ERROR_MESSAGES.VALIDATION_ERROR, res, headerConstants.FAIL.BAD_REQUEST);
        } else {
            // save user in db
            const privateKey = crypto.randomBytes(16).toString('hex');
            const hash = crypto.pbkdf2Sync(password, privateKey, 1000, 16, 'sha256').toString('hex');
            const [insertError, insertResponse] = await pHandler(userModel.create(
                {
                    email,
                    name,
                    password: hash,
                    privateKey
                }
            ));
            if (insertError) {
                console.log('insertError', typeof insertError.code);
                if (insertError.code === 11000) {
                    utilityManager.throwError(appConstants.ERROR_MESSAGES.ALREADY_REGISTERED, appConstants.ERROR_MESSAGES.REGISTRATION_ERROR, res, headerConstants.FAIL.SERVER_ERROR);
                } else {
                    utilityManager.throwError(appConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, appConstants.ERROR_MESSAGES.REGISTRATION_ERROR, res, headerConstants.FAIL.SERVER_ERROR);
                }
            }
            console.log('insertResponse', insertResponse);
            responseManager(null, insertResponse, extra);
        }
    } else {
        utilityManager.throwError(appConstants.ERROR_MESSAGES.ALL_FIELDS_REQUIRED, appConstants.ERROR_MESSAGES.VALIDATION_ERROR, res, headerConstants.FAIL.BAD_REQUEST);
    }
};
