# Onca (art-template fork)

[![NPM Version](https://img.shields.io/npm/v/onca.svg)](https://npmjs.org/package/onca)
[![NPM Downloads](http://img.shields.io/npm/dm/onca.svg)](https://npmjs.org/package/onca)
[![Node.js Version](https://img.shields.io/node/v/onca.svg)](http://nodejs.org/download/)

Onca is a simple and superfast templating engine that optimizes template rendering speed by scope pre-declared technique, hence achieving runtime performance which is close to the limits of JavaScript.
Supported only NodeJS.

## Features

1. performance is close to the JavaScript rendering limits
2. debugging friendly. Syntax errors or runtime errors will be positioned accurately at which line of template. Support setting breakpoint in templating files (Webpack Loader)
3. support Express, Koa, Webpack
4. support template inheritance and sub template

## Introduction

### Template

Onca simultaneously supports two syntax of template.
Standard syntax allows templates to be easier to read and write.
While original syntax has powerful logical processing ability.

#### standard syntax

```html
{{if user}}
<h2>{{user.name}}</h2>
{{/if}}
```

#### original syntax

```html
<% if (user) { %>
<h2><%= user.name %></h2>
<% } %>
```

Original syntax is compatible with EJS, Underscore, LoDash templates.

### Render template

```js
const template = require('onca');
const html = template(`${__dirname}/user.art`, {
  user: {
    name: 'Jack Doe'
  }
});
```

### Core method

```js
// render template basing on template name
template(filename, data);

// compile source of template as function
template.compile(source, options);

// compile source of template as function and immediately invoke it
template.render(source, data, options);
```

## Installation

Working only inside NodeJS engine.

NPM

```shell
npm i onca
```

YARN

```shell
yarn add onca
```

## Syntax

Standard syntax supports basic templating syntax and JavaScript expression.
Original syntax supports arbitrary JavaScript statement, the same as EJS.

### Output

#### standard syntax

```html
{{value}} {{data.key}} {{data['key']}} {{a ? b : c}} {{a || b}} {{a + b}}
```

#### original syntax

```html
<%= value %> <%= data.key %> <%= data['key'] %> <%= a ? b : c %> <%= a || b %> <%= a + b %>
```

You can use `$data` with bracket notation to access a first-class variable of templates (such as keyword, reserved word, etc):

```html
{{$data['user list']}}
```

### Raw output

#### standard syntax

```html
{{@ value }}
```

#### original syntax

```html
<%- value %>
```

raw output will not escape the content of HTML, so there may be security problems. Please be careful.

### Condition

#### standard syntax

```html
{{if value}} ... {{/if}} {{if v1}} ... {{else if v2}} ... {{/if}}
```

#### original syntax

```html
<% if (value) { %> ... <% } %> <% if (v1) { %> ... <% } else if (v2) { %> ... <% } %>
```

### Loop

#### standard syntax

```html
{{each target}} {{$index}} {{$value}} {{/each}}
```

#### original syntax

```html
<% for(var i = 0; i < target.length; i++){ %> <%= i %> <%= target[i] %> <% } %>
```

- **target** supports iteration of **array** and **object**, and its default value is $data.
- **$value** and **$index** can be customized: **{{each target val key}}**.

### Variable

#### standard syntax

```html
{{set temp = data.sub.content}}
```

#### original syntax

```html
<% var temp = data.sub.content; %>
```

### Template inheritance

#### standard syntax

```html
{{extend './layout.art'}} {{block 'head'}} ... {{/block}}
```

#### original syntax

```html
<% extend('./layout.art') %> <% block('head', function(){ %> ... <% }) %>
```

Template inheritance allows you to build a basic templating “skeleton”
that contains common parts of your site. Example:

```html
<!--layout.art-->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>{{block 'title'}}My Site{{/block}}</title>

    {{block 'head'}}
    <link rel="stylesheet" href="main.css" />
    {{/block}}
  </head>
  <body>
    {{block 'content'}}{{/block}}
  </body>
</html>
```

```html
<!--index.art-->
{{extend './layout.art'}} {{block 'title'}}{{title}}{{/block}} {{block 'head'}}
<link rel="stylesheet" href="custom.css" />
{{/block}} {{block 'content'}}
<p>This is just an awesome page.</p>
{{/block}}
```

After rendering index.art, layout skeleton will be automatically applied.

### Sub template

#### standard syntax

```html
{{include './header.art'}} {{include './header.art' data}}
```

#### original syntax

```html
<% include('./header.art') %> <% include('./header.art', data) %>
```

- **data** value is **$data** by default. Standard syntax doesn’t support declaration of
  **object** and **array** but reference variable. However, original syntax is no limits.
- Onca has built-in HTML minifier and please avoid writing abnormal
  closing tag in sub templates. Otherwise, tags may be unexpectedly
  “optimized” when **minimize** option is open.

### Filters

#### register filters

```js
template.defaults.imports.dateFormat = function (date, format) {
  /*[code..]*/
};
template.defaults.imports.timestamp = function (value) {
  return value * 1000;
};
```

The first parameter of filter function accepts target value.

#### standard syntax

```html
{{date | timestamp | dateFormat 'yyyy-MM-dd hh:mm:ss'}}
```

**{{value | filter}}** filter syntax is similar to pipe operator. Its last output will be the next input.

#### original syntax

```html
<%= $imports.dateFormat($imports.timestamp(date), 'yyyy-MM-dd hh:mm:ss') %>
```

## Debug

`template.defaults.debug`

Onca has a built-in debugger. It can catch syntax and runtime errors.
In addition, it supports custom syntax.
In NodeJS, debugging mode will be automatically opened according to the environment variable: process.env.NODE_ENV !== 'production'

Setting `template.defaults.debug=true` is equivalent to:

```json
{
  "cache": false,
  "minimize": false,
  "compileDebug": true
}
```

## Template variable

`template.defaults.imports`

Template can access global variable outside it and imported variable through **$imports**.

### Import variable

```js
template.defaults.imports.log = console.log;
```

```html
<% $imports.log('hello world') %>
```

### Built-in variable

- **$data** the data passed into template
- **$imports** variable imported from outside and global variable
- **print** string-output function
- **include** sub-template loading function
- **extend** template-import function in template inheritance
- **block** template-block declaration function

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
