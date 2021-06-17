if(process.env.NODE_ENV === 'prodction') {
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}