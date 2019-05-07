
const pHandler = require('./PromiseHandler');
const appConstants = require('../constants/AppConstants');
const responseManager = require('../helpers/ResponseManager');
const CustomError = require('../helpers/CustomError');
const headerConstants = require('../constants/HeaderConstants');


function throwError(message, err, res, header){
    message = message || err.message
    extra = CustomError(header || headerConstants.FAIL.SERVER_ERROR, message);
    extra.res = res;
    responseManager(err, null, extra);
}

function flattenArray(arr) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten);
    }, []);
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


module.exports = {
    throwError,
    flattenArray,
    validateEmail
}