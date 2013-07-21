'use strict';

/*
  Module Denpendencies
*/
var util = reuqire('util')
  , EventEmitter = require('events').EventEmitter;

/*
  Constructor
*/
var Logger = module.exports = function (options) {
  // Default options
  this.timestamp = true;
  this.transports = [];
  this.pattern = '{FullYear}-{Month:2}-{Date:2} {toLocaleTimeString}';

  //Override the defaults
  for (var key in options) {
    if (key in this
      && typeof this[key] !== 'function'
      && typeof this[key] === typeof options[key]
    ) {
      this[key] = options[key];
    }
  } 
}

/*
  Inherits
*/
Logger.prototype.__proto__ = EventEmitter.prototype;

/*
  Configure transport of logger
*/
Logger.prototype.use = function (transport, options) {

  this.transports.push(transport);
  return this;
}

Logger.prototype.stamp = function (date) {
  if (!this.timestamp) return '';

  var now = date || Date.now();

  return this.pattern.replace(
    /\{\}/g
    , function () {

  });
}