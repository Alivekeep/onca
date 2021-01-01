const template = require('./lib');
const extension = require('./lib/extension');

template.extension = extension;
require.extensions[template.defaults.extname] = extension;

module.exports = template;
