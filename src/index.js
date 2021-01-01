const render = require('./render');
const compile = require('./compile');
const defaults = require('./defaults');

/**
 * Template function
 * @param   {string}            filename
 * @param   {Object|string}     content
 * @return  {string|function}
 */
const template = (filename, content) =>
  content instanceof Object
    ? render(
        {
          filename
        },
        content
      )
    : compile({
        filename,
        source: content
      });

/**
 * Express-like template method
 * @param filename
 * @param options
 * @param callback
 */
function express(filename, options, callback) {
  let innerOptions = {};
  const data = options;

  if (options.settings && options.settings['view options']) {
    innerOptions = options.settings['view options'];
  }

  innerOptions.filename = filename;

  try {
    const renderer = template.compile(innerOptions);
    callback(null, renderer(data));
  } catch (e) {
    callback(e);
  }
}

template.render = render;
template.compile = compile;
template.defaults = defaults;
template.express = express;

module.exports = template;
