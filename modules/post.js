// helper files
const pHandler = require('../helpers/PromiseHandler'),
    responseManager = require('../helpers/ResponseManager'),
    headerConstants = require('../constants/HeaderConstants'),
    utilityManager = require('../helpers/Utility'),
    appConstants = require('../constants/AppConstants');
// models
const postModel = require('../models/Post'),
    userModel = require('../models/User');

exports.postPicture = async function(req, res) {
    const extra = {
        res: res
    };
    if (req.headers.token) {
        if (req.body && req.body.description && req.file && req.file.path) {
            const [findOneError, findOneResponse] = await pHandler(userModel.findOne(
                {
                    loginToken: req.headers.token
                }
            ));
            if (findOneError) {
                console.log('findOneError', typeof findOneError.code);
                utilityManager.throwError(appConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, appConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, res, headerConstants.FAIL.SERVER_ERROR);
            }
            console.log('findOneResponse', findOneResponse);
            if (findOneResponse === null) {
                utilityManager.throwError(appConstants.ERROR_MESSAGES.VALIDATION_ERROR, appConstants.ERROR_MESSAGES.UNAUTHORIZED_ACCESS, res, headerConstants.FAIL.UNAUTHORIZED);
            } else {
                const { description } = req.body;
                const { file } = req;
                console.log('request', req.file);
                console.log('save file data');
                const [insertError, insertResponse] = await pHandler(postModel.create(
                    {
                        description,
                        img_path: file.path,
                        user: {
                            _id: findOneResponse._id,
                            name: findOneResponse.name
                        }
                    }
                ));
                if (insertError) {
                    utilityManager.throwError(appConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, appConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, res, headerConstants.FAIL.SERVER_ERROR);
                }
                console.log('insertResponse', insertResponse);
                responseManager(null, insertResponse, extra);
            }
        } else {
            utilityManager.throwError(appConstants.ERROR_MESSAGES.ALL_FIELDS_REQUIRED, appConstants.ERROR_MESSAGES.VALIDATION_ERROR, res, headerConstants.FAIL.BAD_REQUEST);
        }
    } else {
        utilityManager.throwError(appConstants.ERROR_MESSAGES.VALIDATION_ERROR, appConstants.ERROR_MESSAGES.UNAUTHORIZED_ACCESS, res, headerConstants.FAIL.UNAUTHORIZED);
    }
};
