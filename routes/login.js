const userLogin = require('../modules/login.js');
module.exports = function(app){
    app.post('/login', userLogin.login);
};
