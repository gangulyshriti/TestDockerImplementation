const userRegister = require('../modules/register.js');
module.exports = function(app){
    app.post('/register', userRegister.register);
};
