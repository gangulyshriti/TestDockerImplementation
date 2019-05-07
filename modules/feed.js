// helper files
const pHandler = require('../helpers/PromiseHandler'),
    responseManager = require('../helpers/ResponseManager'),
    headerConstants = require('../constants/HeaderConstants'),
    utilityManager = require('../helpers/Utility'),
    appConstants = require('../constants/AppConstants');
// models
const postModel = require('../models/Post'),
    userModel = require('../models/User'),
    commentModel = require('../models/Comment');

exports.getFeed = async function(req, res) {
    const extra = {
        res: res
    };
    if (req.headers.token) {
        const [findOneError, findOneResponse] = await pHandler(userModel.findOne(
            {
                loginToken: req.headers.token
            }
        ));
        if (findOneError) {
            console.log('findOneError', typeof findOneError.code);
            utilityManager.throwError(appConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, appConstants.ERROR_MESSAGES.NOT_FOUND, res, headerConstants.FAIL.SERVER_ERROR);
        }
        console.log('findOneResponse', findOneResponse);
        if (findOneResponse === null) {
            utilityManager.throwError(appConstants.ERROR_MESSAGES.VALIDATION_ERROR, appConstants.ERROR_MESSAGES.UNAUTHORIZED_ACCESS, res, headerConstants.FAIL.UNAUTHORIZED);
        } else {
            // get posts + comments
            const [findOneError, findOneResponse] = await pHandler(postModel.find({ deleted: false }).populate({
                path: 'comments',
                options: { sort: { 'createdAt': -1 } }
            }).sort({ createdAt: -1 }));
            if (findOneError) {
                console.log('findOneError', typeof findOneError.code);
                utilityManager.throwError(appConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, appConstants.ERROR_MESSAGES.NOT_FOUND, res, headerConstants.FAIL.SERVER_ERROR);
            }
            console.log('findOneResponse', findOneResponse);
            responseManager(null, findOneResponse, extra);
        }
    } else {
        utilityManager.throwError(appConstants.ERROR_MESSAGES.VALIDATION_ERROR, appConstants.ERROR_MESSAGES.UNAUTHORIZED_ACCESS, res, headerConstants.FAIL.UNAUTHORIZED);
    }
};
