const deletePostOrComment = require('../modules/delete.js');
module.exports = function(app){
    app.post('/deletePostOrComment', deletePostOrComment.delete);
};
