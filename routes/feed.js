const feed = require('../modules/feed.js');
module.exports = function(app){
    app.get('/feed', feed.getFeed);
};
