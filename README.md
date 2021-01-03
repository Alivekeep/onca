# Onca (art-template fork)

[![NPM Version](https://img.shields.io/npm/v/onca.svg)](https://npmjs.org/package/onca)
[![NPM Downloads](http://img.shields.io/npm/dm/onca.svg)](https://npmjs.org/package/onca)
[![Node.js Version](https://img.shields.io/node/v/onca.svg)](http://nodejs.org/download/)

Onca is a simple and superfast templating engine that optimizes template rendering speed by scope pre-declared technique, hence achieving runtime performance which is close to the limits of JavaScript.
Supported only NodeJS.

## Feature

1. performance is close to the JavaScript rendering limits
2. debugging friendly. Syntax errors or runtime errors will be positioned accurately at which line of template. Support setting breakpoint in templating files (Webpack Loader)
3. support Express, Koa, Webpack
4. support template inheritance and sub template

## Examples

### Express.js

index.js

```js
const express = require('express');
const path = require('path');
const { expressEngine } = require('onca');

const app = express();

// view engine setup
app.engine('art', expressEngine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'art');

// routes
app.get('/', function (req, res) {
  res.render('index.art', {
    user: {
      name: 'aui',
      tags: ['art', 'template', 'nodejs']
    }
  });
});

app.listen(3030, () => {
  console.log('server');
});
```

/views/index.art

```html
<div>
  <h2>Onca template engine</h2>
</div>
```

### Koa.js

index.js

```js
const Koa = require('koa');
const { koaEngine } = require('onca');
const path = require('path');

const app = new Koa();
koaEngine(app, {
  root: path.join(__dirname, 'views'),
  extname: '.art',
  debug: process.env.NODE_ENV !== 'production'
});

app.use(async function (ctx) {
  await ctx.render('index');
});

app.listen(3030);
```

/views/index.art

```html
<div>
  <h2>Onca template engine</h2>
</div>
```
