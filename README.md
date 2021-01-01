# Onca (art-template fork)

[![NPM Version](https://img.shields.io/npm/v/onca.svg)](https://npmjs.org/package/onca)
[![NPM Downloads](http://img.shields.io/npm/dm/onca.svg)](https://npmjs.org/package/onca)
[![Node.js Version](https://img.shields.io/node/v/onca.svg)](http://nodejs.org/download/)

[English document](https://alivekeep.github.io/onca/)

Onca is a simple and superfast templating engine that optimizes template rendering speed by scope pre-declared technique, hence achieving runtime performance which is close to the limits of JavaScript.
Supported only NodeJS.

## Feature

1. performance is close to the JavaScript rendering limits
2. debugging friendly. Syntax errors or runtime errors will be positioned accurately at which line of template. Support setting breakpoint in templating files (Webpack Loader)
3. support Express, Koa, Webpack
4. support template inheritance and sub template