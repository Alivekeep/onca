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

template.render = render;
template.compile = compile;
template.defaults = defaults;

module.exports = template;
