'use strict';

const restify = require('restify'),
      appPackage = require('./package.json');



// Global variables...
const config = require('./config/config.js');
const appConfig = global.config;
global.mongoose = require('mongoose');


const app = restify.createServer({
    name: appPackage.name,
    version: appPackage.version 
});

app.use(restify.plugins.acceptParser(app.acceptable))
app.use(restify.plugins.gzipResponse());
app.pre(restify.plugins.pre.sanitizePath());
app.use(restify.plugins.queryParser({ mapParams: true }));
app.use(restify.plugins.jsonBodyParser({ mapParams: true }))
app.use(
    function crossOrigin(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        return next();
    }
);
app.get(
    '/uploads/*',
    restify.plugins.serveStatic({
      directory: __dirname,
    })
);

const mongoDbUrl = appConfig.mongoDb.pass != "" ? `mongodb://${appConfig.mongoDb.user}:${appConfig.mongoDb.pass}@${appConfig.mongoDb.host}:${appConfig.mongoDb.port}/${appConfig.mongoDb.database}` : `mongodb://${appConfig.mongoDb.host}:${appConfig.mongoDb.port}/${appConfig.mongoDb.database}`;
console.log(mongoDbUrl);
mongoose.connect(mongoDbUrl,{ useNewUrlParser: true },(err, response) => {
    if (err) {
        console.log(`DB Error: ${err}`, response);
        process.exit(1);
    } else {
        console.log(`MongoDB Connected: `);
    }
});


// Redirect to index of routes........
require('./routes/index')(app);


app.listen(appConfig.port, () =>{
    console.log(`Server started at: http://127.0.0.1:${appConfig.port}`);
});

app.on('uncaughtException', function(req, res, route, err) {
    console.log("Error", err.stack);
    process.exit(1);
});
module.exports = app;