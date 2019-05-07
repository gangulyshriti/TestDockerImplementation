const headerConstants = require('../constants/HeaderConstants');

module.exports = function (err, response, extra) {
    let result = { response }
    let { message, header_status, req, res } = extra;
    if (message != "")
        result = { ...result, message };
    if (req != undefined && req.body != undefined && req.body.with_request)
        result = { ...result, request: req };
    if (!err && !(header_status >= 400)) {
        res.send(headerConstants.SUCCESS, result);
    
    } else {
        let errorResponse = {}

        if (global.config.debug)
            errorResponse = { err : err != null ? (err.stack != undefined ? err.stack.split("\n") : err) || err : "Solvable Error"}
        if (message != "")
            errorResponse = { ...errorResponse, message };
        else
            errorResponse.message = "Something went wrong";
        if (!header_status)
            header_status = headerConstants.FAIL.SERVER_ERROR;
        
        res.send(header_status, errorResponse);
    }
}