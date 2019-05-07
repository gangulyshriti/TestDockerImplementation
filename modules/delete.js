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

exports.delete = async function(req, res) {
    const extra = {
        res: res
    };
    if (req.headers.token) {
        if (req.body && req.body.id && req.body.deleteType) {
            const { id, deleteType } = req.body;
            // get user
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
            }
            
            if (deleteType === appConstants.DELETE_TYPE.POST) {
                console.log('delete post');
                const [updateError, updateResponse] = await pHandler(postModel.update(
                    {
                        _id: id,
                        'user._id': findOneResponse._id
                    },
                    {
                        $set:{
                            deleted: true
                        }
                    }
                ));
                if (updateError) {
                    console.log('updateError', typeof updateError.code);
                    utilityManager.throwError(appConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, appConstants.ERROR_MESSAGES.NOT_FOUND, res, headerConstants.FAIL.SERVER_ERROR);
                }
                console.log('updateResponse', updateResponse);
                if (updateResponse.nModified >= 1) {
                    updateResponse.msg = appConstants.SUCCESS_MESSAGES.POST_DELETED;
                    responseManager(null, updateResponse, extra);
                } else {
                    utilityManager.throwError(appConstants.ERROR_MESSAGES.POST_COMMENT_NOT_FOUND, appConstants.ERROR_MESSAGES.NOT_FOUND, res, headerConstants.FAIL.SERVER_ERROR);
                }
            } else if (deleteType === appConstants.DELETE_TYPE.COMMENT) {
                console.log('delete comment');
                const [updateError, updateResponse] = await pHandler(commentModel.update(
                    {
                        _id: id,
                        'user._id': findOneResponse._id
                    },
                    {
                        $set:{
                            deleted: true
                        }
                    }
                ));
                if (updateError) {
                    console.log('updateError', typeof updateError.code);
                    utilityManager.throwError(appConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, appConstants.ERROR_MESSAGES.NOT_FOUND, res, headerConstants.FAIL.SERVER_ERROR);
                }
                console.log('updateResponse', updateResponse);
                if (updateResponse.nModified >= 1) {
                    updateResponse.msg = appConstants.SUCCESS_MESSAGES.COMMENT_DELETED;
                    responseManager(null, updateResponse, extra);
                } else {
                    utilityManager.throwError(appConstants.ERROR_MESSAGES.POST_COMMENT_NOT_FOUND, appConstants.ERROR_MESSAGES.NOT_FOUND, res, headerConstants.FAIL.SERVER_ERROR);
                }
            } else {
                utilityManager.throwError(appConstants.ERROR_MESSAGES.INVALID_TYPE, appConstants.ERROR_MESSAGES.VALIDATION_ERROR, res, headerConstants.FAIL.BAD_REQUEST);
            }
            
        } else {
            utilityManager.throwError(appConstants.ERROR_MESSAGES.ALL_FIELDS_REQUIRED, appConstants.ERROR_MESSAGES.VALIDATION_ERROR, res, headerConstants.FAIL.BAD_REQUEST);
        }
    } else {
        utilityManager.throwError(appConstants.ERROR_MESSAGES.VALIDATION_ERROR, appConstants.ERROR_MESSAGES.UNAUTHORIZED_ACCESS, res, headerConstants.FAIL.UNAUTHORIZED);
    }
}