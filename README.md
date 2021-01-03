# Onca (art-template fork)

[![NPM Version](https://img.shields.io/npm/v/onca.svg)](https://npmjs.org/package/onca)
[![NPM Downloads](http://img.shields.io/npm/dm/onca.svg)](https://npmjs.org/package/onca)
[![Node.js Version](https://img.shields.io/node/v/onca.svg)](http://nodejs.org/download/)

**Onca** is a simple and superfast templating engine that optimizes template rendering speed by scope pre-declared technique, hence achieving runtime performance which is close to the limits of JavaScript.
Worked only in NodeJS.

- [Features](https://github.com/Alivekeep/onca#features)
- [Introduction](https://github.com/Alivekeep/onca#introduction)
  - [Template](https://github.com/Alivekeep/onca#template)
  - [Render template](https://github.com/Alivekeep/onca#render-template)
  - [Core method](https://github.com/Alivekeep/onca#core-method)
- [Installation](https://github.com/Alivekeep/onca#installation)
- [Syntax](https://github.com/Alivekeep/onca#syntax)
  - [Output](https://github.com/Alivekeep/onca#output)
  - [Raw output](https://github.com/Alivekeep/onca#raw-output)
  - [Condition](https://github.com/Alivekeep/onca#condition)
  - [Loop](https://github.com/Alivekeep/onca#loop)
  - [Variable](https://github.com/Alivekeep/onca#variable)
  - [Template inheritance](https://github.com/Alivekeep/onca#template-inheritance)
  - [Sub template](https://github.com/Alivekeep/onca#sub-template)
  - [Filters](https://github.com/Alivekeep/onca#filters)
- [Debug](https://github.com/Alivekeep/onca#debug)
- [Template variable](https://github.com/Alivekeep/onca#template-variable)
  - [Import variable](https://github.com/Alivekeep/onca#import-variable)
  - [Built-in variables](https://github.com/Alivekeep/onca#built-in-variables)
- [Parsing rules](https://github.com/Alivekeep/onca#parsing-rules)
  - [Modify delimiters](https://github.com/Alivekeep/onca#modify-delimiters)
  - [Add syntax](https://github.com/Alivekeep/onca#add-syntax)
- [Minimize](https://github.com/Alivekeep/onca#minimize)
  - [Minimize mode](https://github.com/Alivekeep/onca#minimize-mode)
  - [Configuration](https://github.com/Alivekeep/onca#configuration)
- [Options](https://github.com/Alivekeep/onca#options)
- [Examples](https://github.com/Alivekeep/onca#examples)
  - [Express.js](https://github.com/Alivekeep/onca#express.js)
  - [Koa.js](https://github.com/Alivekeep/onca#koa.js)
  - [NestJS](https://github.com/Alivekeep/onca#nestjs)
- [License](https://github.com/Alivekeep/onca#license)

## Features

1. Performance is close to the JavaScript rendering limits
2. Debugging friendly. Syntax errors or runtime errors will be positioned accurately at which line of template
3. Support Express.js, Koa.js, NestJS
4. Support template inheritance and sub template

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
{{value}}
{{data.key}}
{{data['key']}}
{{a ? b : c}}
{{a || b}}
{{a + b}}
```

#### original syntax

```html
<%= value %>
<%= data.key %>
<%= data['key'] %>
<%= a ? b : c %>
<%= a || b %>
<%= a + b %>
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
{{if value}} ... {{/if}}
{{if v1}} ... {{else if v2}} ... {{/if}}
```

#### original syntax

```html
<% if (value) { %> ... <% } %>
<% if (v1) { %> ... <% } else if (v2) { %> ... <% } %>
```

### Loop

#### standard syntax

```html
{{each target}} 
  {{$index}} {{$value}}
{{/each}}
```

#### original syntax

```html
<% for(var i = 0; i < target.length; i++){ %>
  <%= i %> <%= target[i] %>
<% } %>
```

- `target` supports iteration of `array` and `object`, and its default value is `$data`.
- `$value` and `$index` can be customized: **{{each target val key}}**.

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
{{extend './layout.art'}} 
{{block 'head'}}
  ... 
{{/block}}
```

#### original syntax

```html
<% extend('./layout.art') %>
<% block('head', function(){ %> ... <% }) %>
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
{{include './header.art'}}
{{include './header.art' data}}
```

#### original syntax

```html
<% include('./header.art') %>
<% include('./header.art', data) %>
```

- `data` value is `$data` by default. Standard syntax doesn't support declaration of
  `object` and `array` but reference variable. However, original syntax is no limits.
- Onca has built-in HTML minifier and please avoid writing abnormal
  closing tag in sub templates. Otherwise, tags may be unexpectedly
  “optimized” when `minimize` option is open.

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

`{{value | filter}}` filter syntax is similar to pipe operator. Its last output will be the next input.

#### original syntax

```html
<%= $imports.dateFormat($imports.timestamp(date), 'yyyy-MM-dd hh:mm:ss') %>
```

## Debug

`template.defaults.debug`

Onca has a built-in debugger. It can catch syntax and runtime errors.
In addition, it supports custom syntax.
In NodeJS, debugging mode will be automatically opened according to the environment variable: `process.env.NODE_ENV !== 'production'`

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

Template can access global variable outside it and imported variable through `$imports`.

### Import variable

```js
template.defaults.imports.log = console.log;
```

```html
<% $imports.log('hello world') %>
```

### Built-in variables

- **$data** the data passed into template
- **$imports** variable imported from outside and global variable
- **print** string-output function
- **include** sub-template loading function
- **extend** template-import function in template inheritance
- **block** template-block declaration function

## Parsing rules

`template.defaults.rules`

You can customize template parsing rules in art-template.
Standard syntax and original syntax is configured by default.

### Modify delimiters

```js
// delimiter rules of original syntax
template.defaults.rules[0].test = /<%(#?)((?:==|=#|[=-])?)[ \t]*([\w\W]*?)[ \t]*(-?)%>/;
// delimiter rules of standard syntax
template.defaults.rules[1].test = /{{([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*}}/;
```

They are regular expressions, and you can only modify the delimiter part.
For example, modify `<% %>` to `<? ?>`:

```js
const rule = template.defaults.rules[0];
rule.test = new RegExp(rule.test.source.replace('<%', '<\\?').replace('%>', '\\?>'));
```

### Add syntax

Let’s start with a simple example that make template engine support parse
of template strings `${name}` of **ES6**:

```js
template.defaults.rules.push({
  test: /\${([\w\W]*?)}/,
  use: function (match, code) {
    return {
      code: code,
      output: 'escape'
    };
  }
});
```

`test` is a regular expression which matches strings and `use` is a callback function
after matching. About `use` function:

- parameters: first parameter is the matching string,
  and others are content of capturing group of `test` regular expression
- return value: MUST return an object containing code and output properties:
  - code transformed JavaScript statements
  - output describe type of code, optional value:
    - **'escape'** output after encoding
    - **'raw'** output raw content
    - **false** output nothing

It’s worth mentioning that syntax rules have no effect on rendering speed and
template parser will help you optimize rendering performance.

## Minimize

`template.defaults.minimize`

A built-in minifier of art-template can minimize HTML, JS and CSS, which happens
in compilation phase. So it totally has no effect on rendering speed and moreover
speeds up network transmission.

### Minimize mode

`template.defaults.minimize = true;`

### Configuration

Refer to: https://github.com/kangax/html-minifier

#### default configuration

```js
template.defaults.htmlMinifierOptions = {
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: true,
  // automatically merged at runtime: rules.map(rule => rule.test)
  ignoreCustomFragments: []
};
```

## Options

`template.defaults`

```js
({
  // template name
  filename: null,

  // an array of rules of template syntax
  rules: [nativeRule, artRule],

  // whether to automatically encode output statements of template. Setting false will close that functionality
  // escape can prevent XSS attacks
  escape: true,

  // enable debug mode. If true: {cache:false, minimize:false, compileDebug:true}
  debug: detectNode ? process.env.NODE_ENV !== 'production' : false,

  // if bail is set true, compilation errors and runtime errors will throw exception
  bail: true,

  // whether to enable caching
  cache: true,

  // whether to enable minimization. It will execute htmlMinifier and minimize HTML, CSS, JS
  // if template contains unclosing tags, please don't open minimize. Otherwise unclosing tags will be restored or filtered
  minimize: true,

  // whether to compile in debug mode
  compileDebug: false,

  // resolve template path
  resolveFilename: resolveFilename,

  // sub template compilation adapter
  include: include,

  // HTML minifier. Work only in NodeJS environment
  htmlMinifier: htmlMinifier,

  // HTML minifier configuration. Refer to: https://github.com/kangax/html-minifier
  htmlMinifierOptions: {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    // automatically merged at runtime: rules.map(rule => rule.test)
    ignoreCustomFragments: []
  },

  // error events. Work only if bail is false
  onerror: onerror,

  // template file loader
  loader: loader,

  // cache center adapter (depend on filename field)
  caches: caches,

  // root directory of template. If filename field is not a local path, template will be found in root directory
  root: '/',

  // default extension. If no extensions, extname will be automatically added
  extname: '.art',

  // ignored variables. An array of template variables ignored by template compiler
  ignore: [],

  // imported template variables
  imports: runtime
});
```

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

### NestJS

main.ts

```typescript
import { expressEngine } from 'onca';

// <NestJS application initialization>
// ...

app.useStaticAssets(join(__dirname, '..', 'public', 'assets'));
app.setBaseViewsDir(join(__dirname, 'views'));

app.setViewEngine('art');
app.engine('art', expressEngine);
app.set('view options', { debug: process.env.NODE_ENV !== 'production' });
```

mvc.controller.ts
```typescript
export class MVCController {
  @Get('/')
  @Render('main-page')
  public async mainPage() {
    return '';
  }
}
```

## License

Onca is [MIT licensed](./LICENSE).
