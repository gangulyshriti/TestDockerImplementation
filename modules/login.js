const crypto = require('crypto');

const pHandler = require('../helpers/PromiseHandler'),
    responseManager = require('../helpers/ResponseManager'),
    headerConstants = require('../constants/HeaderConstants'),
    utilityManager = require('../helpers/Utility'),
    appConstants = require('../constants/AppConstants');

const userModel = require('../models/User');
exports.login = async function(req, res) {
    const extra = {
        res: res
    };
    //register codes go here
    if (req.body && req.body.email && req.body.password) {
        const {email, password} = req.body;
        // validate email
        const validEmail = utilityManager.validateEmail(email);
        if (!validEmail) {
            utilityManager.throwError(appConstants.ERROR_MESSAGES.INVALID_EMAIL, appConstants.ERROR_MESSAGES.VALIDATION_ERROR, res, headerConstants.FAIL.BAD_REQUEST);
        } else {
            // save user in db
            const [findOneError, findOneResponse] = await pHandler(userModel.findOne(
                {
                    email
                }
            ));
            if (findOneError) {
                console.log('findOneError', typeof findOneError.code);
                utilityManager.throwError(appConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, appConstants.ERROR_MESSAGES.REGISTRATION_ERROR, res, headerConstants.FAIL.SERVER_ERROR);
            }
            console.log('findOneResponse', findOneResponse);
            if (findOneResponse === null) {
                utilityManager.throwError(appConstants.ERROR_MESSAGES.INVALID_CREDENTIALS, appConstants.ERROR_MESSAGES.VALIDATION_ERROR, res, headerConstants.FAIL.BAD_REQUEST);
            } else {
                const hash = crypto.pbkdf2Sync(password, findOneResponse.privateKey, 1000, 16, 'sha256').toString('hex');
                if (hash === findOneResponse.password) {
                    console.log('findOneResponse', findOneResponse);
                    const loginTokenData = findOneResponse.name + findOneResponse.email;
                    const loginToken = crypto.pbkdf2Sync(loginTokenData, findOneResponse.privateKey, 1000, 16, 'sha256').toString('hex');
                    const [updateError, updateResponse] = await pHandler(userModel.update(
                        {
                            email
                        },
                        {
                            $set: {
                                loginToken 
                            }
                        }
                    ));
                    findOneResponse.loginToken = loginToken;
                    responseManager(null, findOneResponse, extra);
                } else {
                    utilityManager.throwError(appConstants.ERROR_MESSAGES.INVALID_CREDENTIALS, appConstants.ERROR_MESSAGES.VALIDATION_ERROR, res, headerConstants.FAIL.BAD_REQUEST);
                }
            }
        }
    } else {
        utilityManager.throwError(appConstants.ERROR_MESSAGES.ALL_FIELDS_REQUIRED, appConstants.ERROR_MESSAGES.VALIDATION_ERROR, res, headerConstants.FAIL.BAD_REQUEST);
    }
};
