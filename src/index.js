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
 * @param filename {String}
 * @param options {Object}
 * @param callback {Function}
 */
function expressEngine(filename, options, callback) {
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

/**
 * Koa-like template method
 * @param app {Object}
 * @param settings {Object}
 */
function koaEngine(app, settings = {}) {
  if (app.context.render) {
    return;
  }

  let innerSettings = {};

  innerSettings = { debug: process.env.NODE_ENV !== 'production', writeResp: true, ...settings };

  function renderer(filename, data) {
    innerSettings.filename = filename;
    const renderMethod = template.compile(innerSettings);
    return renderMethod(data);
  }

  // eslint-disable-next-line no-param-reassign,consistent-return
  app.context.render = function rendererMethod(view, _context) {
    const context = { ...this.state, ..._context };
    const html = renderer(view, context);
    const writeResp = context.writeResp === false ? false : context.writeResp || innerSettings.writeResp;

    if (writeResp) {
      this.type = 'html';
      this.body = html;
    } else {
      return html;
    }
  };
}

template.render = render;
template.compile = compile;
template.defaults = defaults;
template.expressEngine = expressEngine;
template.koaEngine = koaEngine;

module.exports = template;
