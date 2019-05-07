const userComment = require('../modules/comment.js');
module.exports = function(app){
    app.post('/comment', userComment.comment);
};
