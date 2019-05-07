const config = require('./config.json');

// Config variables
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
// Config variables

global.config = environmentConfig;


// log global.gConfig
console.log(`Environment: ${global.config.config_id}`);