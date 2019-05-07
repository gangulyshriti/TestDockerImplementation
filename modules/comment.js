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

exports.comment = async function(req, res) {
    const extra = {
        res: res
    };
    if (req.headers.token) {
        if (req.body && req.body.comment && req.body.postId) {
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
                const { comment, postId } = req.body;
                if (req.body.commentId) {
                    // save new comment
                    const [insertError, insertResponse] = await pHandler(commentModel.create(
                        {
                            comment,
                            postId,
                            user: {
                                _id: findOneResponse._id,
                                name: findOneResponse.name
                            },
                            commentId: req.body.commentId
                        }
                    ));
                    if (insertError) {
                        console.log('insertError', insertError);
                        utilityManager.throwError(appConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, appConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, res, headerConstants.FAIL.SERVER_ERROR);
                    }
                    console.log('insertResponse', insertResponse);
                    responseManager(null, insertResponse, extra);
                    // update parentComment with childComment ID
                    const [ updateError, updateResponse ] = await pHandler(commentModel.update(
                        {
                            _id: req.body.commentId
                        },
                        {
                            $push : { comments : { $each : [insertResponse._id] } } 
                        }
                    ));
                    if (updateError) {
                        console.log('updateError', updateError);
                        utilityManager.throwError(appConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, appConstants.ERROR_MESSAGES.NOT_FOUND, res, headerConstants.FAIL.SERVER_ERROR);
                    }
                    console.log('updateResponse', updateResponse);
                } else {
                    // save comment
                    const [insertError, insertResponse] = await pHandler(commentModel.create(
                        {
                            comment,
                            postId,
                            user: {
                                _id: findOneResponse._id,
                                name: findOneResponse.name
                            },
                            parent: true
                        }
                    ));
                    if (insertError) {
                        console.log('insertError', typeof insertError.code);
                        utilityManager.throwError(appConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, appConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, res, headerConstants.FAIL.SERVER_ERROR);
                    }
                    console.log('insertResponse', insertResponse);
                    responseManager(null, insertResponse, extra);
                    // update post document
                    const [ updateError, updateResponse ] = await pHandler(postModel.update(
                        {
                            _id: postId
                        },
                        {
                            $push : { comments : { $each : [insertResponse._id] } }
                        }
                    ));
                    if (updateError) {
                        console.log('updateError', updateError);
                        utilityManager.throwError(appConstants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, appConstants.ERROR_MESSAGES.NOT_FOUND, res, headerConstants.FAIL.SERVER_ERROR);
                    }
                    console.log('updateResponse', updateResponse);
                }
            }
        } else {
            utilityManager.throwError(appConstants.ERROR_MESSAGES.ALL_FIELDS_REQUIRED, appConstants.ERROR_MESSAGES.VALIDATION_ERROR, res, headerConstants.FAIL.BAD_REQUEST);
        }
    } else {
        utilityManager.throwError(appConstants.ERROR_MESSAGES.VALIDATION_ERROR, appConstants.ERROR_MESSAGES.UNAUTHORIZED_ACCESS, res, headerConstants.FAIL.UNAUTHORIZED);
    }
};
