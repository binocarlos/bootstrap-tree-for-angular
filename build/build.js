
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("binocarlos-angular-component/angular.js", Function("exports, require, module",
"/**\n\
 * Expose `angular`\n\
 */\n\
\n\
window.angular = module.exports = {};\n\
\n\
/**\n\
 * @license AngularJS v1.1.5\n\
 * (c) 2010-2012 Google, Inc. http://angularjs.org\n\
 * License: MIT\n\
 */\n\
(function(window, document, undefined) {\n\
'use strict';\n\
\n\
////////////////////////////////////\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.lowercase\n\
 * @function\n\
 *\n\
 * @description Converts the specified string to lowercase.\n\
 * @param {string} string String to be converted to lowercase.\n\
 * @returns {string} Lowercased string.\n\
 */\n\
var lowercase = function(string){return isString(string) ? string.toLowerCase() : string;};\n\
\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.uppercase\n\
 * @function\n\
 *\n\
 * @description Converts the specified string to uppercase.\n\
 * @param {string} string String to be converted to uppercase.\n\
 * @returns {string} Uppercased string.\n\
 */\n\
var uppercase = function(string){return isString(string) ? string.toUpperCase() : string;};\n\
\n\
\n\
var manualLowercase = function(s) {\n\
  return isString(s)\n\
      ? s.replace(/[A-Z]/g, function(ch) {return String.fromCharCode(ch.charCodeAt(0) | 32);})\n\
      : s;\n\
};\n\
var manualUppercase = function(s) {\n\
  return isString(s)\n\
      ? s.replace(/[a-z]/g, function(ch) {return String.fromCharCode(ch.charCodeAt(0) & ~32);})\n\
      : s;\n\
};\n\
\n\
\n\
// String#toLowerCase and String#toUpperCase don't produce correct results in browsers with Turkish\n\
// locale, for this reason we need to detect this case and redefine lowercase/uppercase methods\n\
// with correct but slower alternatives.\n\
if ('i' !== 'I'.toLowerCase()) {\n\
  lowercase = manualLowercase;\n\
  uppercase = manualUppercase;\n\
}\n\
\n\
\n\
var /** holds major version number for IE or NaN for real browsers */\n\
    msie              = int((/msie (\\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]),\n\
    jqLite,           // delay binding since jQuery could be loaded after us.\n\
    jQuery,           // delay binding\n\
    slice             = [].slice,\n\
    push              = [].push,\n\
    toString          = Object.prototype.toString,\n\
\n\
\n\
    _angular          = window.angular,\n\
    /** @name angular */\n\
    angular           = window.angular || (window.angular = {}),\n\
    angularModule,\n\
    nodeName_,\n\
    uid               = ['0', '0', '0'];\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.noConflict\n\
 * @function\n\
 *\n\
 * @description\n\
 * Restores the previous global value of angular and returns the current instance. Other libraries may already use the\n\
 * angular namespace. Or a previous version of angular is already loaded on the page. In these cases you may want to\n\
 * restore the previous namespace and keep a reference to angular.\n\
 *\n\
 * @return {Object} The current angular namespace\n\
 */\n\
function noConflict() {\n\
  var a = window.angular;\n\
  window.angular = _angular;\n\
  return a;\n\
}\n\
\n\
/**\n\
 * @private\n\
 * @param {*} obj\n\
 * @return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments, ...)\n\
 */\n\
function isArrayLike(obj) {\n\
  if (!obj || (typeof obj.length !== 'number')) return false;\n\
\n\
  // We have on object which has length property. Should we treat it as array?\n\
  if (typeof obj.hasOwnProperty != 'function' &&\n\
      typeof obj.constructor != 'function') {\n\
    // This is here for IE8: it is a bogus object treat it as array;\n\
    return true;\n\
  } else  {\n\
    return obj instanceof JQLite ||                      // JQLite\n\
           (jQuery && obj instanceof jQuery) ||          // jQuery\n\
           toString.call(obj) !== '[object Object]' ||   // some browser native object\n\
           typeof obj.callee === 'function';              // arguments (on IE8 looks like regular obj)\n\
  }\n\
}\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.forEach\n\
 * @function\n\
 *\n\
 * @description\n\
 * Invokes the `iterator` function once for each item in `obj` collection, which can be either an\n\
 * object or an array. The `iterator` function is invoked with `iterator(value, key)`, where `value`\n\
 * is the value of an object property or an array element and `key` is the object property key or\n\
 * array element index. Specifying a `context` for the function is optional.\n\
 *\n\
 * Note: this function was previously known as `angular.foreach`.\n\
 *\n\
   <pre>\n\
     var values = {name: 'misko', gender: 'male'};\n\
     var log = [];\n\
     angular.forEach(values, function(value, key){\n\
       this.push(key + ': ' + value);\n\
     }, log);\n\
     expect(log).toEqual(['name: misko', 'gender:male']);\n\
   </pre>\n\
 *\n\
 * @param {Object|Array} obj Object to iterate over.\n\
 * @param {Function} iterator Iterator function.\n\
 * @param {Object=} context Object to become context (`this`) for the iterator function.\n\
 * @returns {Object|Array} Reference to `obj`.\n\
 */\n\
function forEach(obj, iterator, context) {\n\
  var key;\n\
  if (obj) {\n\
    if (isFunction(obj)){\n\
      for (key in obj) {\n\
        if (key != 'prototype' && key != 'length' && key != 'name' && obj.hasOwnProperty(key)) {\n\
          iterator.call(context, obj[key], key);\n\
        }\n\
      }\n\
    } else if (obj.forEach && obj.forEach !== forEach) {\n\
      obj.forEach(iterator, context);\n\
    } else if (isArrayLike(obj)) {\n\
      for (key = 0; key < obj.length; key++)\n\
        iterator.call(context, obj[key], key);\n\
    } else {\n\
      for (key in obj) {\n\
        if (obj.hasOwnProperty(key)) {\n\
          iterator.call(context, obj[key], key);\n\
        }\n\
      }\n\
    }\n\
  }\n\
  return obj;\n\
}\n\
\n\
function sortedKeys(obj) {\n\
  var keys = [];\n\
  for (var key in obj) {\n\
    if (obj.hasOwnProperty(key)) {\n\
      keys.push(key);\n\
    }\n\
  }\n\
  return keys.sort();\n\
}\n\
\n\
function forEachSorted(obj, iterator, context) {\n\
  var keys = sortedKeys(obj);\n\
  for ( var i = 0; i < keys.length; i++) {\n\
    iterator.call(context, obj[keys[i]], keys[i]);\n\
  }\n\
  return keys;\n\
}\n\
\n\
\n\
/**\n\
 * when using forEach the params are value, key, but it is often useful to have key, value.\n\
 * @param {function(string, *)} iteratorFn\n\
 * @returns {function(*, string)}\n\
 */\n\
function reverseParams(iteratorFn) {\n\
  return function(value, key) { iteratorFn(key, value) };\n\
}\n\
\n\
/**\n\
 * A consistent way of creating unique IDs in angular. The ID is a sequence of alpha numeric\n\
 * characters such as '012ABC'. The reason why we are not using simply a number counter is that\n\
 * the number string gets longer over time, and it can also overflow, where as the nextId\n\
 * will grow much slower, it is a string, and it will never overflow.\n\
 *\n\
 * @returns an unique alpha-numeric string\n\
 */\n\
function nextUid() {\n\
  var index = uid.length;\n\
  var digit;\n\
\n\
  while(index) {\n\
    index--;\n\
    digit = uid[index].charCodeAt(0);\n\
    if (digit == 57 /*'9'*/) {\n\
      uid[index] = 'A';\n\
      return uid.join('');\n\
    }\n\
    if (digit == 90  /*'Z'*/) {\n\
      uid[index] = '0';\n\
    } else {\n\
      uid[index] = String.fromCharCode(digit + 1);\n\
      return uid.join('');\n\
    }\n\
  }\n\
  uid.unshift('0');\n\
  return uid.join('');\n\
}\n\
\n\
\n\
/**\n\
 * Set or clear the hashkey for an object.\n\
 * @param obj object \n\
 * @param h the hashkey (!truthy to delete the hashkey)\n\
 */\n\
function setHashKey(obj, h) {\n\
  if (h) {\n\
    obj.$$hashKey = h;\n\
  }\n\
  else {\n\
    delete obj.$$hashKey;\n\
  }\n\
}\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.extend\n\
 * @function\n\
 *\n\
 * @description\n\
 * Extends the destination object `dst` by copying all of the properties from the `src` object(s)\n\
 * to `dst`. You can specify multiple `src` objects.\n\
 *\n\
 * @param {Object} dst Destination object.\n\
 * @param {...Object} src Source object(s).\n\
 * @returns {Object} Reference to `dst`.\n\
 */\n\
function extend(dst) {\n\
  var h = dst.$$hashKey;\n\
  forEach(arguments, function(obj){\n\
    if (obj !== dst) {\n\
      forEach(obj, function(value, key){\n\
        dst[key] = value;\n\
      });\n\
    }\n\
  });\n\
\n\
  setHashKey(dst,h);\n\
  return dst;\n\
}\n\
\n\
function int(str) {\n\
  return parseInt(str, 10);\n\
}\n\
\n\
\n\
function inherit(parent, extra) {\n\
  return extend(new (extend(function() {}, {prototype:parent}))(), extra);\n\
}\n\
\n\
var START_SPACE = /^\\s*/;\n\
var END_SPACE = /\\s*$/;\n\
function stripWhitespace(str) {\n\
  return isString(str) ? str.replace(START_SPACE, '').replace(END_SPACE, '') : str;\n\
}\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.noop\n\
 * @function\n\
 *\n\
 * @description\n\
 * A function that performs no operations. This function can be useful when writing code in the\n\
 * functional style.\n\
   <pre>\n\
     function foo(callback) {\n\
       var result = calculateResult();\n\
       (callback || angular.noop)(result);\n\
     }\n\
   </pre>\n\
 */\n\
function noop() {}\n\
noop.$inject = [];\n\
\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.identity\n\
 * @function\n\
 *\n\
 * @description\n\
 * A function that returns its first argument. This function is useful when writing code in the\n\
 * functional style.\n\
 *\n\
   <pre>\n\
     function transformer(transformationFn, value) {\n\
       return (transformationFn || identity)(value);\n\
     };\n\
   </pre>\n\
 */\n\
function identity($) {return $;}\n\
identity.$inject = [];\n\
\n\
\n\
function valueFn(value) {return function() {return value;};}\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.isUndefined\n\
 * @function\n\
 *\n\
 * @description\n\
 * Determines if a reference is undefined.\n\
 *\n\
 * @param {*} value Reference to check.\n\
 * @returns {boolean} True if `value` is undefined.\n\
 */\n\
function isUndefined(value){return typeof value == 'undefined';}\n\
\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.isDefined\n\
 * @function\n\
 *\n\
 * @description\n\
 * Determines if a reference is defined.\n\
 *\n\
 * @param {*} value Reference to check.\n\
 * @returns {boolean} True if `value` is defined.\n\
 */\n\
function isDefined(value){return typeof value != 'undefined';}\n\
\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.isObject\n\
 * @function\n\
 *\n\
 * @description\n\
 * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not\n\
 * considered to be objects.\n\
 *\n\
 * @param {*} value Reference to check.\n\
 * @returns {boolean} True if `value` is an `Object` but not `null`.\n\
 */\n\
function isObject(value){return value != null && typeof value == 'object';}\n\
\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.isString\n\
 * @function\n\
 *\n\
 * @description\n\
 * Determines if a reference is a `String`.\n\
 *\n\
 * @param {*} value Reference to check.\n\
 * @returns {boolean} True if `value` is a `String`.\n\
 */\n\
function isString(value){return typeof value == 'string';}\n\
\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.isNumber\n\
 * @function\n\
 *\n\
 * @description\n\
 * Determines if a reference is a `Number`.\n\
 *\n\
 * @param {*} value Reference to check.\n\
 * @returns {boolean} True if `value` is a `Number`.\n\
 */\n\
function isNumber(value){return typeof value == 'number';}\n\
\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.isDate\n\
 * @function\n\
 *\n\
 * @description\n\
 * Determines if a value is a date.\n\
 *\n\
 * @param {*} value Reference to check.\n\
 * @returns {boolean} True if `value` is a `Date`.\n\
 */\n\
function isDate(value){\n\
  return toString.apply(value) == '[object Date]';\n\
}\n\
\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.isArray\n\
 * @function\n\
 *\n\
 * @description\n\
 * Determines if a reference is an `Array`.\n\
 *\n\
 * @param {*} value Reference to check.\n\
 * @returns {boolean} True if `value` is an `Array`.\n\
 */\n\
function isArray(value) {\n\
  return toString.apply(value) == '[object Array]';\n\
}\n\
\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.isFunction\n\
 * @function\n\
 *\n\
 * @description\n\
 * Determines if a reference is a `Function`.\n\
 *\n\
 * @param {*} value Reference to check.\n\
 * @returns {boolean} True if `value` is a `Function`.\n\
 */\n\
function isFunction(value){return typeof value == 'function';}\n\
\n\
\n\
/**\n\
 * Checks if `obj` is a window object.\n\
 *\n\
 * @private\n\
 * @param {*} obj Object to check\n\
 * @returns {boolean} True if `obj` is a window obj.\n\
 */\n\
function isWindow(obj) {\n\
  return obj && obj.document && obj.location && obj.alert && obj.setInterval;\n\
}\n\
\n\
\n\
function isScope(obj) {\n\
  return obj && obj.$evalAsync && obj.$watch;\n\
}\n\
\n\
\n\
function isFile(obj) {\n\
  return toString.apply(obj) === '[object File]';\n\
}\n\
\n\
\n\
function isBoolean(value) {\n\
  return typeof value == 'boolean';\n\
}\n\
\n\
\n\
function trim(value) {\n\
  return isString(value) ? value.replace(/^\\s*/, '').replace(/\\s*$/, '') : value;\n\
}\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.isElement\n\
 * @function\n\
 *\n\
 * @description\n\
 * Determines if a reference is a DOM element (or wrapped jQuery element).\n\
 *\n\
 * @param {*} value Reference to check.\n\
 * @returns {boolean} True if `value` is a DOM element (or wrapped jQuery element).\n\
 */\n\
function isElement(node) {\n\
  return node &&\n\
    (node.nodeName  // we are a direct element\n\
    || (node.bind && node.find));  // we have a bind and find method part of jQuery API\n\
}\n\
\n\
/**\n\
 * @param str 'key1,key2,...'\n\
 * @returns {object} in the form of {key1:true, key2:true, ...}\n\
 */\n\
function makeMap(str){\n\
  var obj = {}, items = str.split(\",\"), i;\n\
  for ( i = 0; i < items.length; i++ )\n\
    obj[ items[i] ] = true;\n\
  return obj;\n\
}\n\
\n\
\n\
if (msie < 9) {\n\
  nodeName_ = function(element) {\n\
    element = element.nodeName ? element : element[0];\n\
    return (element.scopeName && element.scopeName != 'HTML')\n\
      ? uppercase(element.scopeName + ':' + element.nodeName) : element.nodeName;\n\
  };\n\
} else {\n\
  nodeName_ = function(element) {\n\
    return element.nodeName ? element.nodeName : element[0].nodeName;\n\
  };\n\
}\n\
\n\
\n\
function map(obj, iterator, context) {\n\
  var results = [];\n\
  forEach(obj, function(value, index, list) {\n\
    results.push(iterator.call(context, value, index, list));\n\
  });\n\
  return results;\n\
}\n\
\n\
\n\
/**\n\
 * @description\n\
 * Determines the number of elements in an array, the number of properties an object has, or\n\
 * the length of a string.\n\
 *\n\
 * Note: This function is used to augment the Object type in Angular expressions. See\n\
 * {@link angular.Object} for more information about Angular arrays.\n\
 *\n\
 * @param {Object|Array|string} obj Object, array, or string to inspect.\n\
 * @param {boolean} [ownPropsOnly=false] Count only \"own\" properties in an object\n\
 * @returns {number} The size of `obj` or `0` if `obj` is neither an object nor an array.\n\
 */\n\
function size(obj, ownPropsOnly) {\n\
  var size = 0, key;\n\
\n\
  if (isArray(obj) || isString(obj)) {\n\
    return obj.length;\n\
  } else if (isObject(obj)){\n\
    for (key in obj)\n\
      if (!ownPropsOnly || obj.hasOwnProperty(key))\n\
        size++;\n\
  }\n\
\n\
  return size;\n\
}\n\
\n\
\n\
function includes(array, obj) {\n\
  return indexOf(array, obj) != -1;\n\
}\n\
\n\
function indexOf(array, obj) {\n\
  if (array.indexOf) return array.indexOf(obj);\n\
\n\
  for ( var i = 0; i < array.length; i++) {\n\
    if (obj === array[i]) return i;\n\
  }\n\
  return -1;\n\
}\n\
\n\
function arrayRemove(array, value) {\n\
  var index = indexOf(array, value);\n\
  if (index >=0)\n\
    array.splice(index, 1);\n\
  return value;\n\
}\n\
\n\
function isLeafNode (node) {\n\
  if (node) {\n\
    switch (node.nodeName) {\n\
    case \"OPTION\":\n\
    case \"PRE\":\n\
    case \"TITLE\":\n\
      return true;\n\
    }\n\
  }\n\
  return false;\n\
}\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.copy\n\
 * @function\n\
 *\n\
 * @description\n\
 * Creates a deep copy of `source`, which should be an object or an array.\n\
 *\n\
 * * If no destination is supplied, a copy of the object or array is created.\n\
 * * If a destination is provided, all of its elements (for array) or properties (for objects)\n\
 *   are deleted and then all elements/properties from the source are copied to it.\n\
 * * If  `source` is not an object or array, `source` is returned.\n\
 *\n\
 * Note: this function is used to augment the Object type in Angular expressions. See\n\
 * {@link ng.$filter} for more information about Angular arrays.\n\
 *\n\
 * @param {*} source The source that will be used to make a copy.\n\
 *                   Can be any type, including primitives, `null`, and `undefined`.\n\
 * @param {(Object|Array)=} destination Destination into which the source is copied. If\n\
 *     provided, must be of the same type as `source`.\n\
 * @returns {*} The copy or updated `destination`, if `destination` was specified.\n\
 */\n\
function copy(source, destination){\n\
  if (isWindow(source) || isScope(source)) throw Error(\"Can't copy Window or Scope\");\n\
  if (!destination) {\n\
    destination = source;\n\
    if (source) {\n\
      if (isArray(source)) {\n\
        destination = copy(source, []);\n\
      } else if (isDate(source)) {\n\
        destination = new Date(source.getTime());\n\
      } else if (isObject(source)) {\n\
        destination = copy(source, {});\n\
      }\n\
    }\n\
  } else {\n\
    if (source === destination) throw Error(\"Can't copy equivalent objects or arrays\");\n\
    if (isArray(source)) {\n\
      destination.length = 0;\n\
      for ( var i = 0; i < source.length; i++) {\n\
        destination.push(copy(source[i]));\n\
      }\n\
    } else {\n\
      var h = destination.$$hashKey;\n\
      forEach(destination, function(value, key){\n\
        delete destination[key];\n\
      });\n\
      for ( var key in source) {\n\
        destination[key] = copy(source[key]);\n\
      }\n\
      setHashKey(destination,h);\n\
    }\n\
  }\n\
  return destination;\n\
}\n\
\n\
/**\n\
 * Create a shallow copy of an object\n\
 */\n\
function shallowCopy(src, dst) {\n\
  dst = dst || {};\n\
\n\
  for(var key in src) {\n\
    if (src.hasOwnProperty(key) && key.substr(0, 2) !== '$$') {\n\
      dst[key] = src[key];\n\
    }\n\
  }\n\
\n\
  return dst;\n\
}\n\
\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.equals\n\
 * @function\n\
 *\n\
 * @description\n\
 * Determines if two objects or two values are equivalent. Supports value types, arrays and\n\
 * objects.\n\
 *\n\
 * Two objects or values are considered equivalent if at least one of the following is true:\n\
 *\n\
 * * Both objects or values pass `===` comparison.\n\
 * * Both objects or values are of the same type and all of their properties pass `===` comparison.\n\
 * * Both values are NaN. (In JavasScript, NaN == NaN => false. But we consider two NaN as equal)\n\
 *\n\
 * During a property comparison, properties of `function` type and properties with names\n\
 * that begin with `$` are ignored.\n\
 *\n\
 * Scope and DOMWindow objects are being compared only by identify (`===`).\n\
 *\n\
 * @param {*} o1 Object or value to compare.\n\
 * @param {*} o2 Object or value to compare.\n\
 * @returns {boolean} True if arguments are equal.\n\
 */\n\
function equals(o1, o2) {\n\
  if (o1 === o2) return true;\n\
  if (o1 === null || o2 === null) return false;\n\
  if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN\n\
  var t1 = typeof o1, t2 = typeof o2, length, key, keySet;\n\
  if (t1 == t2) {\n\
    if (t1 == 'object') {\n\
      if (isArray(o1)) {\n\
        if ((length = o1.length) == o2.length) {\n\
          for(key=0; key<length; key++) {\n\
            if (!equals(o1[key], o2[key])) return false;\n\
          }\n\
          return true;\n\
        }\n\
      } else if (isDate(o1)) {\n\
        return isDate(o2) && o1.getTime() == o2.getTime();\n\
      } else {\n\
        if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2)) return false;\n\
        keySet = {};\n\
        for(key in o1) {\n\
          if (key.charAt(0) === '$' || isFunction(o1[key])) continue;\n\
          if (!equals(o1[key], o2[key])) return false;\n\
          keySet[key] = true;\n\
        }\n\
        for(key in o2) {\n\
          if (!keySet[key] &&\n\
              key.charAt(0) !== '$' &&\n\
              o2[key] !== undefined &&\n\
              !isFunction(o2[key])) return false;\n\
        }\n\
        return true;\n\
      }\n\
    }\n\
  }\n\
  return false;\n\
}\n\
\n\
\n\
function concat(array1, array2, index) {\n\
  return array1.concat(slice.call(array2, index));\n\
}\n\
\n\
function sliceArgs(args, startIndex) {\n\
  return slice.call(args, startIndex || 0);\n\
}\n\
\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.bind\n\
 * @function\n\
 *\n\
 * @description\n\
 * Returns a function which calls function `fn` bound to `self` (`self` becomes the `this` for\n\
 * `fn`). You can supply optional `args` that are prebound to the function. This feature is also\n\
 * known as [function currying](http://en.wikipedia.org/wiki/Currying).\n\
 *\n\
 * @param {Object} self Context which `fn` should be evaluated in.\n\
 * @param {function()} fn Function to be bound.\n\
 * @param {...*} args Optional arguments to be prebound to the `fn` function call.\n\
 * @returns {function()} Function that wraps the `fn` with all the specified bindings.\n\
 */\n\
function bind(self, fn) {\n\
  var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];\n\
  if (isFunction(fn) && !(fn instanceof RegExp)) {\n\
    return curryArgs.length\n\
      ? function() {\n\
          return arguments.length\n\
            ? fn.apply(self, curryArgs.concat(slice.call(arguments, 0)))\n\
            : fn.apply(self, curryArgs);\n\
        }\n\
      : function() {\n\
          return arguments.length\n\
            ? fn.apply(self, arguments)\n\
            : fn.call(self);\n\
        };\n\
  } else {\n\
    // in IE, native methods are not functions so they cannot be bound (note: they don't need to be)\n\
    return fn;\n\
  }\n\
}\n\
\n\
\n\
function toJsonReplacer(key, value) {\n\
  var val = value;\n\
\n\
  if (/^\\$+/.test(key)) {\n\
    val = undefined;\n\
  } else if (isWindow(value)) {\n\
    val = '$WINDOW';\n\
  } else if (value &&  document === value) {\n\
    val = '$DOCUMENT';\n\
  } else if (isScope(value)) {\n\
    val = '$SCOPE';\n\
  }\n\
\n\
  return val;\n\
}\n\
\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.toJson\n\
 * @function\n\
 *\n\
 * @description\n\
 * Serializes input into a JSON-formatted string.\n\
 *\n\
 * @param {Object|Array|Date|string|number} obj Input to be serialized into JSON.\n\
 * @param {boolean=} pretty If set to true, the JSON output will contain newlines and whitespace.\n\
 * @returns {string} Jsonified string representing `obj`.\n\
 */\n\
function toJson(obj, pretty) {\n\
  return JSON.stringify(obj, toJsonReplacer, pretty ? '  ' : null);\n\
}\n\
\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.fromJson\n\
 * @function\n\
 *\n\
 * @description\n\
 * Deserializes a JSON string.\n\
 *\n\
 * @param {string} json JSON string to deserialize.\n\
 * @returns {Object|Array|Date|string|number} Deserialized thingy.\n\
 */\n\
function fromJson(json) {\n\
  return isString(json)\n\
      ? JSON.parse(json)\n\
      : json;\n\
}\n\
\n\
\n\
function toBoolean(value) {\n\
  if (value && value.length !== 0) {\n\
    var v = lowercase(\"\" + value);\n\
    value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');\n\
  } else {\n\
    value = false;\n\
  }\n\
  return value;\n\
}\n\
\n\
/**\n\
 * @returns {string} Returns the string representation of the element.\n\
 */\n\
function startingTag(element) {\n\
  element = jqLite(element).clone();\n\
  try {\n\
    // turns out IE does not let you set .html() on elements which\n\
    // are not allowed to have children. So we just ignore it.\n\
    element.html('');\n\
  } catch(e) {}\n\
  // As Per DOM Standards\n\
  var TEXT_NODE = 3;\n\
  var elemHtml = jqLite('<div>').append(element).html();\n\
  try {\n\
    return element[0].nodeType === TEXT_NODE ? lowercase(elemHtml) :\n\
        elemHtml.\n\
          match(/^(<[^>]+>)/)[1].\n\
          replace(/^<([\\w\\-]+)/, function(match, nodeName) { return '<' + lowercase(nodeName); });\n\
  } catch(e) {\n\
    return lowercase(elemHtml);\n\
  }\n\
\n\
}\n\
\n\
\n\
/////////////////////////////////////////////////\n\
\n\
/**\n\
 * Parses an escaped url query string into key-value pairs.\n\
 * @returns Object.<(string|boolean)>\n\
 */\n\
function parseKeyValue(/**string*/keyValue) {\n\
  var obj = {}, key_value, key;\n\
  forEach((keyValue || \"\").split('&'), function(keyValue){\n\
    if (keyValue) {\n\
      key_value = keyValue.split('=');\n\
      key = decodeURIComponent(key_value[0]);\n\
      obj[key] = isDefined(key_value[1]) ? decodeURIComponent(key_value[1]) : true;\n\
    }\n\
  });\n\
  return obj;\n\
}\n\
\n\
function toKeyValue(obj) {\n\
  var parts = [];\n\
  forEach(obj, function(value, key) {\n\
    parts.push(encodeUriQuery(key, true) + (value === true ? '' : '=' + encodeUriQuery(value, true)));\n\
  });\n\
  return parts.length ? parts.join('&') : '';\n\
}\n\
\n\
\n\
/**\n\
 * We need our custom method because encodeURIComponent is too aggressive and doesn't follow\n\
 * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set (pchar) allowed in path\n\
 * segments:\n\
 *    segment       = *pchar\n\
 *    pchar         = unreserved / pct-encoded / sub-delims / \":\" / \"@\"\n\
 *    pct-encoded   = \"%\" HEXDIG HEXDIG\n\
 *    unreserved    = ALPHA / DIGIT / \"-\" / \".\" / \"_\" / \"~\"\n\
 *    sub-delims    = \"!\" / \"$\" / \"&\" / \"'\" / \"(\" / \")\"\n\
 *                     / \"*\" / \"+\" / \",\" / \";\" / \"=\"\n\
 */\n\
function encodeUriSegment(val) {\n\
  return encodeUriQuery(val, true).\n\
             replace(/%26/gi, '&').\n\
             replace(/%3D/gi, '=').\n\
             replace(/%2B/gi, '+');\n\
}\n\
\n\
\n\
/**\n\
 * This method is intended for encoding *key* or *value* parts of query component. We need a custom\n\
 * method because encodeURIComponent is too aggressive and encodes stuff that doesn't have to be\n\
 * encoded per http://tools.ietf.org/html/rfc3986:\n\
 *    query       = *( pchar / \"/\" / \"?\" )\n\
 *    pchar         = unreserved / pct-encoded / sub-delims / \":\" / \"@\"\n\
 *    unreserved    = ALPHA / DIGIT / \"-\" / \".\" / \"_\" / \"~\"\n\
 *    pct-encoded   = \"%\" HEXDIG HEXDIG\n\
 *    sub-delims    = \"!\" / \"$\" / \"&\" / \"'\" / \"(\" / \")\"\n\
 *                     / \"*\" / \"+\" / \",\" / \";\" / \"=\"\n\
 */\n\
function encodeUriQuery(val, pctEncodeSpaces) {\n\
  return encodeURIComponent(val).\n\
             replace(/%40/gi, '@').\n\
             replace(/%3A/gi, ':').\n\
             replace(/%24/g, '$').\n\
             replace(/%2C/gi, ',').\n\
             replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));\n\
}\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngApp\n\
 *\n\
 * @element ANY\n\
 * @param {angular.Module} ngApp an optional application\n\
 *   {@link angular.module module} name to load.\n\
 *\n\
 * @description\n\
 *\n\
 * Use this directive to auto-bootstrap an application. Only\n\
 * one directive can be used per HTML document. The directive\n\
 * designates the root of the application and is typically placed\n\
 * at the root of the page.\n\
 *\n\
 * In the example below if the `ngApp` directive would not be placed\n\
 * on the `html` element then the document would not be compiled\n\
 * and the `{{ 1+2 }}` would not be resolved to `3`.\n\
 *\n\
 * `ngApp` is the easiest way to bootstrap an application.\n\
 *\n\
 <doc:example>\n\
   <doc:source>\n\
    I can add: 1 + 2 =  {{ 1+2 }}\n\
   </doc:source>\n\
 </doc:example>\n\
 *\n\
 */\n\
function angularInit(element, bootstrap) {\n\
  var elements = [element],\n\
      appElement,\n\
      module,\n\
      names = ['ng:app', 'ng-app', 'x-ng-app', 'data-ng-app'],\n\
      NG_APP_CLASS_REGEXP = /\\sng[:\\-]app(:\\s*([\\w\\d_]+);?)?\\s/;\n\
\n\
  function append(element) {\n\
    element && elements.push(element);\n\
  }\n\
\n\
  forEach(names, function(name) {\n\
    names[name] = true;\n\
    append(document.getElementById(name));\n\
    name = name.replace(':', '\\\\:');\n\
    if (element.querySelectorAll) {\n\
      forEach(element.querySelectorAll('.' + name), append);\n\
      forEach(element.querySelectorAll('.' + name + '\\\\:'), append);\n\
      forEach(element.querySelectorAll('[' + name + ']'), append);\n\
    }\n\
  });\n\
\n\
  forEach(elements, function(element) {\n\
    if (!appElement) {\n\
      var className = ' ' + element.className + ' ';\n\
      var match = NG_APP_CLASS_REGEXP.exec(className);\n\
      if (match) {\n\
        appElement = element;\n\
        module = (match[2] || '').replace(/\\s+/g, ',');\n\
      } else {\n\
        forEach(element.attributes, function(attr) {\n\
          if (!appElement && names[attr.name]) {\n\
            appElement = element;\n\
            module = attr.value;\n\
          }\n\
        });\n\
      }\n\
    }\n\
  });\n\
  if (appElement) {\n\
    bootstrap(appElement, module ? [module] : []);\n\
  }\n\
}\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.bootstrap\n\
 * @description\n\
 * Use this function to manually start up angular application.\n\
 *\n\
 * See: {@link guide/bootstrap Bootstrap}\n\
 *\n\
 * @param {Element} element DOM element which is the root of angular application.\n\
 * @param {Array<String|Function>=} modules an array of module declarations. See: {@link angular.module modules}\n\
 * @returns {AUTO.$injector} Returns the newly created injector for this app.\n\
 */\n\
function bootstrap(element, modules) {\n\
  var resumeBootstrapInternal = function() {\n\
    element = jqLite(element);\n\
    modules = modules || [];\n\
    modules.unshift(['$provide', function($provide) {\n\
      $provide.value('$rootElement', element);\n\
    }]);\n\
    modules.unshift('ng');\n\
    var injector = createInjector(modules);\n\
    injector.invoke(['$rootScope', '$rootElement', '$compile', '$injector', '$animator',\n\
       function(scope, element, compile, injector, animator) {\n\
        scope.$apply(function() {\n\
          element.data('$injector', injector);\n\
          compile(element)(scope);\n\
        });\n\
        animator.enabled(true);\n\
      }]\n\
    );\n\
    return injector;\n\
  };\n\
\n\
  var NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;\n\
\n\
  if (window && !NG_DEFER_BOOTSTRAP.test(window.name)) {\n\
    return resumeBootstrapInternal();\n\
  }\n\
\n\
  window.name = window.name.replace(NG_DEFER_BOOTSTRAP, '');\n\
  angular.resumeBootstrap = function(extraModules) {\n\
    forEach(extraModules, function(module) {\n\
      modules.push(module);\n\
    });\n\
    resumeBootstrapInternal();\n\
  };\n\
}\n\
\n\
var SNAKE_CASE_REGEXP = /[A-Z]/g;\n\
function snake_case(name, separator){\n\
  separator = separator || '_';\n\
  return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {\n\
    return (pos ? separator : '') + letter.toLowerCase();\n\
  });\n\
}\n\
\n\
function bindJQuery() {\n\
  // bind to jQuery if present;\n\
  jQuery = window.jQuery;\n\
  // reset to jQuery or default to us.\n\
  if (jQuery) {\n\
    jqLite = jQuery;\n\
    extend(jQuery.fn, {\n\
      scope: JQLitePrototype.scope,\n\
      controller: JQLitePrototype.controller,\n\
      injector: JQLitePrototype.injector,\n\
      inheritedData: JQLitePrototype.inheritedData\n\
    });\n\
    JQLitePatchJQueryRemove('remove', true);\n\
    JQLitePatchJQueryRemove('empty');\n\
    JQLitePatchJQueryRemove('html');\n\
  } else {\n\
    jqLite = JQLite;\n\
  }\n\
  angular.element = jqLite;\n\
}\n\
\n\
/**\n\
 * throw error if the argument is falsy.\n\
 */\n\
function assertArg(arg, name, reason) {\n\
  if (!arg) {\n\
    throw new Error(\"Argument '\" + (name || '?') + \"' is \" + (reason || \"required\"));\n\
  }\n\
  return arg;\n\
}\n\
\n\
function assertArgFn(arg, name, acceptArrayAnnotation) {\n\
  if (acceptArrayAnnotation && isArray(arg)) {\n\
      arg = arg[arg.length - 1];\n\
  }\n\
\n\
  assertArg(isFunction(arg), name, 'not a function, got ' +\n\
      (arg && typeof arg == 'object' ? arg.constructor.name || 'Object' : typeof arg));\n\
  return arg;\n\
}\n\
\n\
/**\n\
 * @ngdoc interface\n\
 * @name angular.Module\n\
 * @description\n\
 *\n\
 * Interface for configuring angular {@link angular.module modules}.\n\
 */\n\
\n\
function setupModuleLoader(window) {\n\
\n\
  function ensure(obj, name, factory) {\n\
    return obj[name] || (obj[name] = factory());\n\
  }\n\
\n\
  return ensure(ensure(window, 'angular', Object), 'module', function() {\n\
    /** @type {Object.<string, angular.Module>} */\n\
    var modules = {};\n\
\n\
    /**\n\
     * @ngdoc function\n\
     * @name angular.module\n\
     * @description\n\
     *\n\
     * The `angular.module` is a global place for creating and registering Angular modules. All\n\
     * modules (angular core or 3rd party) that should be available to an application must be\n\
     * registered using this mechanism.\n\
     *\n\
     *\n\
     * # Module\n\
     *\n\
     * A module is a collocation of services, directives, filters, and configuration information. Module\n\
     * is used to configure the {@link AUTO.$injector $injector}.\n\
     *\n\
     * <pre>\n\
     * // Create a new module\n\
     * var myModule = angular.module('myModule', []);\n\
     *\n\
     * // register a new service\n\
     * myModule.value('appName', 'MyCoolApp');\n\
     *\n\
     * // configure existing services inside initialization blocks.\n\
     * myModule.config(function($locationProvider) {\n\
     *   // Configure existing providers\n\
     *   $locationProvider.hashPrefix('!');\n\
     * });\n\
     * </pre>\n\
     *\n\
     * Then you can create an injector and load your modules like this:\n\
     *\n\
     * <pre>\n\
     * var injector = angular.injector(['ng', 'MyModule'])\n\
     * </pre>\n\
     *\n\
     * However it's more likely that you'll just use\n\
     * {@link ng.directive:ngApp ngApp} or\n\
     * {@link angular.bootstrap} to simplify this process for you.\n\
     *\n\
     * @param {!string} name The name of the module to create or retrieve.\n\
     * @param {Array.<string>=} requires If specified then new module is being created. If unspecified then the\n\
     *        the module is being retrieved for further configuration.\n\
     * @param {Function} configFn Optional configuration function for the module. Same as\n\
     *        {@link angular.Module#config Module#config()}.\n\
     * @returns {module} new module with the {@link angular.Module} api.\n\
     */\n\
    return function module(name, requires, configFn) {\n\
      if (requires && modules.hasOwnProperty(name)) {\n\
        modules[name] = null;\n\
      }\n\
      return ensure(modules, name, function() {\n\
        if (!requires) {\n\
          throw Error('No module: ' + name);\n\
        }\n\
\n\
        /** @type {!Array.<Array.<*>>} */\n\
        var invokeQueue = [];\n\
\n\
        /** @type {!Array.<Function>} */\n\
        var runBlocks = [];\n\
\n\
        var config = invokeLater('$injector', 'invoke');\n\
\n\
        /** @type {angular.Module} */\n\
        var moduleInstance = {\n\
          // Private state\n\
          _invokeQueue: invokeQueue,\n\
          _runBlocks: runBlocks,\n\
\n\
          /**\n\
           * @ngdoc property\n\
           * @name angular.Module#requires\n\
           * @propertyOf angular.Module\n\
           * @returns {Array.<string>} List of module names which must be loaded before this module.\n\
           * @description\n\
           * Holds the list of modules which the injector will load before the current module is loaded.\n\
           */\n\
          requires: requires,\n\
\n\
          /**\n\
           * @ngdoc property\n\
           * @name angular.Module#name\n\
           * @propertyOf angular.Module\n\
           * @returns {string} Name of the module.\n\
           * @description\n\
           */\n\
          name: name,\n\
\n\
\n\
          /**\n\
           * @ngdoc method\n\
           * @name angular.Module#provider\n\
           * @methodOf angular.Module\n\
           * @param {string} name service name\n\
           * @param {Function} providerType Construction function for creating new instance of the service.\n\
           * @description\n\
           * See {@link AUTO.$provide#provider $provide.provider()}.\n\
           */\n\
          provider: invokeLater('$provide', 'provider'),\n\
\n\
          /**\n\
           * @ngdoc method\n\
           * @name angular.Module#factory\n\
           * @methodOf angular.Module\n\
           * @param {string} name service name\n\
           * @param {Function} providerFunction Function for creating new instance of the service.\n\
           * @description\n\
           * See {@link AUTO.$provide#factory $provide.factory()}.\n\
           */\n\
          factory: invokeLater('$provide', 'factory'),\n\
\n\
          /**\n\
           * @ngdoc method\n\
           * @name angular.Module#service\n\
           * @methodOf angular.Module\n\
           * @param {string} name service name\n\
           * @param {Function} constructor A constructor function that will be instantiated.\n\
           * @description\n\
           * See {@link AUTO.$provide#service $provide.service()}.\n\
           */\n\
          service: invokeLater('$provide', 'service'),\n\
\n\
          /**\n\
           * @ngdoc method\n\
           * @name angular.Module#value\n\
           * @methodOf angular.Module\n\
           * @param {string} name service name\n\
           * @param {*} object Service instance object.\n\
           * @description\n\
           * See {@link AUTO.$provide#value $provide.value()}.\n\
           */\n\
          value: invokeLater('$provide', 'value'),\n\
\n\
          /**\n\
           * @ngdoc method\n\
           * @name angular.Module#constant\n\
           * @methodOf angular.Module\n\
           * @param {string} name constant name\n\
           * @param {*} object Constant value.\n\
           * @description\n\
           * Because the constant are fixed, they get applied before other provide methods.\n\
           * See {@link AUTO.$provide#constant $provide.constant()}.\n\
           */\n\
          constant: invokeLater('$provide', 'constant', 'unshift'),\n\
\n\
          /**\n\
           * @ngdoc method\n\
           * @name angular.Module#animation\n\
           * @methodOf angular.Module\n\
           * @param {string} name animation name\n\
           * @param {Function} animationFactory Factory function for creating new instance of an animation.\n\
           * @description\n\
           *\n\
           * Defines an animation hook that can be later used with {@link ng.directive:ngAnimate ngAnimate}\n\
           * alongside {@link ng.directive:ngAnimate#Description common ng directives} as well as custom directives.\n\
           * <pre>\n\
           * module.animation('animation-name', function($inject1, $inject2) {\n\
           *   return {\n\
           *     //this gets called in preparation to setup an animation\n\
           *     setup : function(element) { ... },\n\
           *\n\
           *     //this gets called once the animation is run\n\
           *     start : function(element, done, memo) { ... }\n\
           *   }\n\
           * })\n\
           * </pre>\n\
           *\n\
           * See {@link ng.$animationProvider#register $animationProvider.register()} and\n\
           * {@link ng.directive:ngAnimate ngAnimate} for more information.\n\
           */\n\
          animation: invokeLater('$animationProvider', 'register'),\n\
\n\
          /**\n\
           * @ngdoc method\n\
           * @name angular.Module#filter\n\
           * @methodOf angular.Module\n\
           * @param {string} name Filter name.\n\
           * @param {Function} filterFactory Factory function for creating new instance of filter.\n\
           * @description\n\
           * See {@link ng.$filterProvider#register $filterProvider.register()}.\n\
           */\n\
          filter: invokeLater('$filterProvider', 'register'),\n\
\n\
          /**\n\
           * @ngdoc method\n\
           * @name angular.Module#controller\n\
           * @methodOf angular.Module\n\
           * @param {string} name Controller name.\n\
           * @param {Function} constructor Controller constructor function.\n\
           * @description\n\
           * See {@link ng.$controllerProvider#register $controllerProvider.register()}.\n\
           */\n\
          controller: invokeLater('$controllerProvider', 'register'),\n\
\n\
          /**\n\
           * @ngdoc method\n\
           * @name angular.Module#directive\n\
           * @methodOf angular.Module\n\
           * @param {string} name directive name\n\
           * @param {Function} directiveFactory Factory function for creating new instance of\n\
           * directives.\n\
           * @description\n\
           * See {@link ng.$compileProvider#directive $compileProvider.directive()}.\n\
           */\n\
          directive: invokeLater('$compileProvider', 'directive'),\n\
\n\
          /**\n\
           * @ngdoc method\n\
           * @name angular.Module#config\n\
           * @methodOf angular.Module\n\
           * @param {Function} configFn Execute this function on module load. Useful for service\n\
           *    configuration.\n\
           * @description\n\
           * Use this method to register work which needs to be performed on module loading.\n\
           */\n\
          config: config,\n\
\n\
          /**\n\
           * @ngdoc method\n\
           * @name angular.Module#run\n\
           * @methodOf angular.Module\n\
           * @param {Function} initializationFn Execute this function after injector creation.\n\
           *    Useful for application initialization.\n\
           * @description\n\
           * Use this method to register work which should be performed when the injector is done\n\
           * loading all modules.\n\
           */\n\
          run: function(block) {\n\
            runBlocks.push(block);\n\
            return this;\n\
          }\n\
        };\n\
\n\
        if (configFn) {\n\
          config(configFn);\n\
        }\n\
\n\
        return  moduleInstance;\n\
\n\
        /**\n\
         * @param {string} provider\n\
         * @param {string} method\n\
         * @param {String=} insertMethod\n\
         * @returns {angular.Module}\n\
         */\n\
        function invokeLater(provider, method, insertMethod) {\n\
          return function() {\n\
            invokeQueue[insertMethod || 'push']([provider, method, arguments]);\n\
            return moduleInstance;\n\
          }\n\
        }\n\
      });\n\
    };\n\
  });\n\
\n\
}\n\
\n\
/**\n\
 * @ngdoc property\n\
 * @name angular.version\n\
 * @description\n\
 * An object that contains information about the current AngularJS version. This object has the\n\
 * following properties:\n\
 *\n\
 * - `full` â€“ `{string}` â€“ Full version string, such as \"0.9.18\".\n\
 * - `major` â€“ `{number}` â€“ Major version number, such as \"0\".\n\
 * - `minor` â€“ `{number}` â€“ Minor version number, such as \"9\".\n\
 * - `dot` â€“ `{number}` â€“ Dot version number, such as \"18\".\n\
 * - `codeName` â€“ `{string}` â€“ Code name of the release, such as \"jiggling-armfat\".\n\
 */\n\
var version = {\n\
  full: '1.1.5',    // all of these placeholder strings will be replaced by grunt's\n\
  major: 1,    // package task\n\
  minor: 1,\n\
  dot: 5,\n\
  codeName: 'triangle-squarification'\n\
};\n\
\n\
\n\
function publishExternalAPI(angular){\n\
  extend(angular, {\n\
    'bootstrap': bootstrap,\n\
    'copy': copy,\n\
    'extend': extend,\n\
    'equals': equals,\n\
    'element': jqLite,\n\
    'forEach': forEach,\n\
    'injector': createInjector,\n\
    'noop':noop,\n\
    'bind':bind,\n\
    'toJson': toJson,\n\
    'fromJson': fromJson,\n\
    'identity':identity,\n\
    'isUndefined': isUndefined,\n\
    'isDefined': isDefined,\n\
    'isString': isString,\n\
    'isFunction': isFunction,\n\
    'isObject': isObject,\n\
    'isNumber': isNumber,\n\
    'isElement': isElement,\n\
    'isArray': isArray,\n\
    'version': version,\n\
    'isDate': isDate,\n\
    'lowercase': lowercase,\n\
    'uppercase': uppercase,\n\
    'callbacks': {counter: 0},\n\
    'noConflict': noConflict\n\
  });\n\
\n\
  angularModule = setupModuleLoader(window);\n\
  try {\n\
    angularModule('ngLocale');\n\
  } catch (e) {\n\
    angularModule('ngLocale', []).provider('$locale', $LocaleProvider);\n\
  }\n\
\n\
  angularModule('ng', ['ngLocale'], ['$provide',\n\
    function ngModule($provide) {\n\
      $provide.provider('$compile', $CompileProvider).\n\
        directive({\n\
            a: htmlAnchorDirective,\n\
            input: inputDirective,\n\
            textarea: inputDirective,\n\
            form: formDirective,\n\
            script: scriptDirective,\n\
            select: selectDirective,\n\
            style: styleDirective,\n\
            option: optionDirective,\n\
            ngBind: ngBindDirective,\n\
            ngBindHtmlUnsafe: ngBindHtmlUnsafeDirective,\n\
            ngBindTemplate: ngBindTemplateDirective,\n\
            ngClass: ngClassDirective,\n\
            ngClassEven: ngClassEvenDirective,\n\
            ngClassOdd: ngClassOddDirective,\n\
            ngCsp: ngCspDirective,\n\
            ngCloak: ngCloakDirective,\n\
            ngController: ngControllerDirective,\n\
            ngForm: ngFormDirective,\n\
            ngHide: ngHideDirective,\n\
            ngIf: ngIfDirective,\n\
            ngInclude: ngIncludeDirective,\n\
            ngInit: ngInitDirective,\n\
            ngNonBindable: ngNonBindableDirective,\n\
            ngPluralize: ngPluralizeDirective,\n\
            ngRepeat: ngRepeatDirective,\n\
            ngShow: ngShowDirective,\n\
            ngSubmit: ngSubmitDirective,\n\
            ngStyle: ngStyleDirective,\n\
            ngSwitch: ngSwitchDirective,\n\
            ngSwitchWhen: ngSwitchWhenDirective,\n\
            ngSwitchDefault: ngSwitchDefaultDirective,\n\
            ngOptions: ngOptionsDirective,\n\
            ngView: ngViewDirective,\n\
            ngTransclude: ngTranscludeDirective,\n\
            ngModel: ngModelDirective,\n\
            ngList: ngListDirective,\n\
            ngChange: ngChangeDirective,\n\
            required: requiredDirective,\n\
            ngRequired: requiredDirective,\n\
            ngValue: ngValueDirective\n\
        }).\n\
        directive(ngAttributeAliasDirectives).\n\
        directive(ngEventDirectives);\n\
      $provide.provider({\n\
        $anchorScroll: $AnchorScrollProvider,\n\
        $animation: $AnimationProvider,\n\
        $animator: $AnimatorProvider,\n\
        $browser: $BrowserProvider,\n\
        $cacheFactory: $CacheFactoryProvider,\n\
        $controller: $ControllerProvider,\n\
        $document: $DocumentProvider,\n\
        $exceptionHandler: $ExceptionHandlerProvider,\n\
        $filter: $FilterProvider,\n\
        $interpolate: $InterpolateProvider,\n\
        $http: $HttpProvider,\n\
        $httpBackend: $HttpBackendProvider,\n\
        $location: $LocationProvider,\n\
        $log: $LogProvider,\n\
        $parse: $ParseProvider,\n\
        $route: $RouteProvider,\n\
        $routeParams: $RouteParamsProvider,\n\
        $rootScope: $RootScopeProvider,\n\
        $q: $QProvider,\n\
        $sniffer: $SnifferProvider,\n\
        $templateCache: $TemplateCacheProvider,\n\
        $timeout: $TimeoutProvider,\n\
        $window: $WindowProvider\n\
      });\n\
    }\n\
  ]);\n\
}\n\
\n\
//////////////////////////////////\n\
//JQLite\n\
//////////////////////////////////\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.element\n\
 * @function\n\
 *\n\
 * @description\n\
 * Wraps a raw DOM element or HTML string as a [jQuery](http://jquery.com) element.\n\
 * `angular.element` can be either an alias for [jQuery](http://api.jquery.com/jQuery/) function, if\n\
 * jQuery is available, or a function that wraps the element or string in Angular's jQuery lite\n\
 * implementation (commonly referred to as jqLite).\n\
 *\n\
 * Real jQuery always takes precedence over jqLite, provided it was loaded before `DOMContentLoaded`\n\
 * event fired.\n\
 *\n\
 * jqLite is a tiny, API-compatible subset of jQuery that allows\n\
 * Angular to manipulate the DOM. jqLite implements only the most commonly needed functionality\n\
 * within a very small footprint, so only a subset of the jQuery API - methods, arguments and\n\
 * invocation styles - are supported.\n\
 *\n\
 * Note: All element references in Angular are always wrapped with jQuery or jqLite; they are never\n\
 * raw DOM references.\n\
 *\n\
 * ## Angular's jQuery lite provides the following methods:\n\
 *\n\
 * - [addClass()](http://api.jquery.com/addClass/)\n\
 * - [after()](http://api.jquery.com/after/)\n\
 * - [append()](http://api.jquery.com/append/)\n\
 * - [attr()](http://api.jquery.com/attr/)\n\
 * - [bind()](http://api.jquery.com/bind/) - Does not support namespaces\n\
 * - [children()](http://api.jquery.com/children/) - Does not support selectors\n\
 * - [clone()](http://api.jquery.com/clone/)\n\
 * - [contents()](http://api.jquery.com/contents/)\n\
 * - [css()](http://api.jquery.com/css/)\n\
 * - [data()](http://api.jquery.com/data/)\n\
 * - [eq()](http://api.jquery.com/eq/)\n\
 * - [find()](http://api.jquery.com/find/) - Limited to lookups by tag name\n\
 * - [hasClass()](http://api.jquery.com/hasClass/)\n\
 * - [html()](http://api.jquery.com/html/)\n\
 * - [next()](http://api.jquery.com/next/) - Does not support selectors\n\
 * - [parent()](http://api.jquery.com/parent/) - Does not support selectors\n\
 * - [prepend()](http://api.jquery.com/prepend/)\n\
 * - [prop()](http://api.jquery.com/prop/)\n\
 * - [ready()](http://api.jquery.com/ready/)\n\
 * - [remove()](http://api.jquery.com/remove/)\n\
 * - [removeAttr()](http://api.jquery.com/removeAttr/)\n\
 * - [removeClass()](http://api.jquery.com/removeClass/)\n\
 * - [removeData()](http://api.jquery.com/removeData/)\n\
 * - [replaceWith()](http://api.jquery.com/replaceWith/)\n\
 * - [text()](http://api.jquery.com/text/)\n\
 * - [toggleClass()](http://api.jquery.com/toggleClass/)\n\
 * - [triggerHandler()](http://api.jquery.com/triggerHandler/) - Passes a dummy event object to handlers.\n\
 * - [unbind()](http://api.jquery.com/unbind/) - Does not support namespaces\n\
 * - [val()](http://api.jquery.com/val/)\n\
 * - [wrap()](http://api.jquery.com/wrap/)\n\
 *\n\
 * ## In addition to the above, Angular provides additional methods to both jQuery and jQuery lite:\n\
 *\n\
 * - `controller(name)` - retrieves the controller of the current element or its parent. By default\n\
 *   retrieves controller associated with the `ngController` directive. If `name` is provided as\n\
 *   camelCase directive name, then the controller for this directive will be retrieved (e.g.\n\
 *   `'ngModel'`).\n\
 * - `injector()` - retrieves the injector of the current element or its parent.\n\
 * - `scope()` - retrieves the {@link api/ng.$rootScope.Scope scope} of the current\n\
 *   element or its parent.\n\
 * - `inheritedData()` - same as `data()`, but walks up the DOM until a value is found or the top\n\
 *   parent element is reached.\n\
 *\n\
 * @param {string|DOMElement} element HTML string or DOMElement to be wrapped into jQuery.\n\
 * @returns {Object} jQuery object.\n\
 */\n\
\n\
var jqCache = JQLite.cache = {},\n\
    jqName = JQLite.expando = 'ng-' + new Date().getTime(),\n\
    jqId = 1,\n\
    addEventListenerFn = (window.document.addEventListener\n\
      ? function(element, type, fn) {element.addEventListener(type, fn, false);}\n\
      : function(element, type, fn) {element.attachEvent('on' + type, fn);}),\n\
    removeEventListenerFn = (window.document.removeEventListener\n\
      ? function(element, type, fn) {element.removeEventListener(type, fn, false); }\n\
      : function(element, type, fn) {element.detachEvent('on' + type, fn); });\n\
\n\
function jqNextId() { return ++jqId; }\n\
\n\
\n\
var SPECIAL_CHARS_REGEXP = /([\\:\\-\\_]+(.))/g;\n\
var MOZ_HACK_REGEXP = /^moz([A-Z])/;\n\
\n\
/**\n\
 * Converts snake_case to camelCase.\n\
 * Also there is special case for Moz prefix starting with upper case letter.\n\
 * @param name Name to normalize\n\
 */\n\
function camelCase(name) {\n\
  return name.\n\
    replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {\n\
      return offset ? letter.toUpperCase() : letter;\n\
    }).\n\
    replace(MOZ_HACK_REGEXP, 'Moz$1');\n\
}\n\
\n\
/////////////////////////////////////////////\n\
// jQuery mutation patch\n\
//\n\
//  In conjunction with bindJQuery intercepts all jQuery's DOM destruction apis and fires a\n\
// $destroy event on all DOM nodes being removed.\n\
//\n\
/////////////////////////////////////////////\n\
\n\
function JQLitePatchJQueryRemove(name, dispatchThis) {\n\
  var originalJqFn = jQuery.fn[name];\n\
  originalJqFn = originalJqFn.$original || originalJqFn;\n\
  removePatch.$original = originalJqFn;\n\
  jQuery.fn[name] = removePatch;\n\
\n\
  function removePatch() {\n\
    var list = [this],\n\
        fireEvent = dispatchThis,\n\
        set, setIndex, setLength,\n\
        element, childIndex, childLength, children,\n\
        fns, events;\n\
\n\
    while(list.length) {\n\
      set = list.shift();\n\
      for(setIndex = 0, setLength = set.length; setIndex < setLength; setIndex++) {\n\
        element = jqLite(set[setIndex]);\n\
        if (fireEvent) {\n\
          element.triggerHandler('$destroy');\n\
        } else {\n\
          fireEvent = !fireEvent;\n\
        }\n\
        for(childIndex = 0, childLength = (children = element.children()).length;\n\
            childIndex < childLength;\n\
            childIndex++) {\n\
          list.push(jQuery(children[childIndex]));\n\
        }\n\
      }\n\
    }\n\
    return originalJqFn.apply(this, arguments);\n\
  }\n\
}\n\
\n\
/////////////////////////////////////////////\n\
function JQLite(element) {\n\
  if (element instanceof JQLite) {\n\
    return element;\n\
  }\n\
  if (!(this instanceof JQLite)) {\n\
    if (isString(element) && element.charAt(0) != '<') {\n\
      throw Error('selectors not implemented');\n\
    }\n\
    return new JQLite(element);\n\
  }\n\
\n\
  if (isString(element)) {\n\
    var div = document.createElement('div');\n\
    // Read about the NoScope elements here:\n\
    // http://msdn.microsoft.com/en-us/library/ms533897(VS.85).aspx\n\
    div.innerHTML = '<div>&#160;</div>' + element; // IE insanity to make NoScope elements work!\n\
    div.removeChild(div.firstChild); // remove the superfluous div\n\
    JQLiteAddNodes(this, div.childNodes);\n\
    this.remove(); // detach the elements from the temporary DOM div.\n\
  } else {\n\
    JQLiteAddNodes(this, element);\n\
  }\n\
}\n\
\n\
function JQLiteClone(element) {\n\
  return element.cloneNode(true);\n\
}\n\
\n\
function JQLiteDealoc(element){\n\
  JQLiteRemoveData(element);\n\
  for ( var i = 0, children = element.childNodes || []; i < children.length; i++) {\n\
    JQLiteDealoc(children[i]);\n\
  }\n\
}\n\
\n\
function JQLiteUnbind(element, type, fn) {\n\
  var events = JQLiteExpandoStore(element, 'events'),\n\
      handle = JQLiteExpandoStore(element, 'handle');\n\
\n\
  if (!handle) return; //no listeners registered\n\
\n\
  if (isUndefined(type)) {\n\
    forEach(events, function(eventHandler, type) {\n\
      removeEventListenerFn(element, type, eventHandler);\n\
      delete events[type];\n\
    });\n\
  } else {\n\
    if (isUndefined(fn)) {\n\
      removeEventListenerFn(element, type, events[type]);\n\
      delete events[type];\n\
    } else {\n\
      arrayRemove(events[type], fn);\n\
    }\n\
  }\n\
}\n\
\n\
function JQLiteRemoveData(element) {\n\
  var expandoId = element[jqName],\n\
      expandoStore = jqCache[expandoId];\n\
\n\
  if (expandoStore) {\n\
    if (expandoStore.handle) {\n\
      expandoStore.events.$destroy && expandoStore.handle({}, '$destroy');\n\
      JQLiteUnbind(element);\n\
    }\n\
    delete jqCache[expandoId];\n\
    element[jqName] = undefined; // ie does not allow deletion of attributes on elements.\n\
  }\n\
}\n\
\n\
function JQLiteExpandoStore(element, key, value) {\n\
  var expandoId = element[jqName],\n\
      expandoStore = jqCache[expandoId || -1];\n\
\n\
  if (isDefined(value)) {\n\
    if (!expandoStore) {\n\
      element[jqName] = expandoId = jqNextId();\n\
      expandoStore = jqCache[expandoId] = {};\n\
    }\n\
    expandoStore[key] = value;\n\
  } else {\n\
    return expandoStore && expandoStore[key];\n\
  }\n\
}\n\
\n\
function JQLiteData(element, key, value) {\n\
  var data = JQLiteExpandoStore(element, 'data'),\n\
      isSetter = isDefined(value),\n\
      keyDefined = !isSetter && isDefined(key),\n\
      isSimpleGetter = keyDefined && !isObject(key);\n\
\n\
  if (!data && !isSimpleGetter) {\n\
    JQLiteExpandoStore(element, 'data', data = {});\n\
  }\n\
\n\
  if (isSetter) {\n\
    data[key] = value;\n\
  } else {\n\
    if (keyDefined) {\n\
      if (isSimpleGetter) {\n\
        // don't create data in this case.\n\
        return data && data[key];\n\
      } else {\n\
        extend(data, key);\n\
      }\n\
    } else {\n\
      return data;\n\
    }\n\
  }\n\
}\n\
\n\
function JQLiteHasClass(element, selector) {\n\
  return ((\" \" + element.className + \" \").replace(/[\\n\
\\t]/g, \" \").\n\
      indexOf( \" \" + selector + \" \" ) > -1);\n\
}\n\
\n\
function JQLiteRemoveClass(element, cssClasses) {\n\
  if (cssClasses) {\n\
    forEach(cssClasses.split(' '), function(cssClass) {\n\
      element.className = trim(\n\
          (\" \" + element.className + \" \")\n\
          .replace(/[\\n\
\\t]/g, \" \")\n\
          .replace(\" \" + trim(cssClass) + \" \", \" \")\n\
      );\n\
    });\n\
  }\n\
}\n\
\n\
function JQLiteAddClass(element, cssClasses) {\n\
  if (cssClasses) {\n\
    forEach(cssClasses.split(' '), function(cssClass) {\n\
      if (!JQLiteHasClass(element, cssClass)) {\n\
        element.className = trim(element.className + ' ' + trim(cssClass));\n\
      }\n\
    });\n\
  }\n\
}\n\
\n\
function JQLiteAddNodes(root, elements) {\n\
  if (elements) {\n\
    elements = (!elements.nodeName && isDefined(elements.length) && !isWindow(elements))\n\
      ? elements\n\
      : [ elements ];\n\
    for(var i=0; i < elements.length; i++) {\n\
      root.push(elements[i]);\n\
    }\n\
  }\n\
}\n\
\n\
function JQLiteController(element, name) {\n\
  return JQLiteInheritedData(element, '$' + (name || 'ngController' ) + 'Controller');\n\
}\n\
\n\
function JQLiteInheritedData(element, name, value) {\n\
  element = jqLite(element);\n\
\n\
  // if element is the document object work with the html element instead\n\
  // this makes $(document).scope() possible\n\
  if(element[0].nodeType == 9) {\n\
    element = element.find('html');\n\
  }\n\
\n\
  while (element.length) {\n\
    if (value = element.data(name)) return value;\n\
    element = element.parent();\n\
  }\n\
}\n\
\n\
//////////////////////////////////////////\n\
// Functions which are declared directly.\n\
//////////////////////////////////////////\n\
var JQLitePrototype = JQLite.prototype = {\n\
  ready: function(fn) {\n\
    var fired = false;\n\
\n\
    function trigger() {\n\
      if (fired) return;\n\
      fired = true;\n\
      fn();\n\
    }\n\
\n\
    // check if document already is loaded\n\
    if (document.readyState === 'complete'){\n\
      setTimeout(trigger);\n\
    } else {\n\
      this.bind('DOMContentLoaded', trigger); // works for modern browsers and IE9\n\
      // we can not use jqLite since we are not done loading and jQuery could be loaded later.\n\
      JQLite(window).bind('load', trigger); // fallback to window.onload for others\n\
    }\n\
  },\n\
  toString: function() {\n\
    var value = [];\n\
    forEach(this, function(e){ value.push('' + e);});\n\
    return '[' + value.join(', ') + ']';\n\
  },\n\
\n\
  eq: function(index) {\n\
      return (index >= 0) ? jqLite(this[index]) : jqLite(this[this.length + index]);\n\
  },\n\
\n\
  length: 0,\n\
  push: push,\n\
  sort: [].sort,\n\
  splice: [].splice\n\
};\n\
\n\
//////////////////////////////////////////\n\
// Functions iterating getter/setters.\n\
// these functions return self on setter and\n\
// value on get.\n\
//////////////////////////////////////////\n\
var BOOLEAN_ATTR = {};\n\
forEach('multiple,selected,checked,disabled,readOnly,required,open'.split(','), function(value) {\n\
  BOOLEAN_ATTR[lowercase(value)] = value;\n\
});\n\
var BOOLEAN_ELEMENTS = {};\n\
forEach('input,select,option,textarea,button,form,details'.split(','), function(value) {\n\
  BOOLEAN_ELEMENTS[uppercase(value)] = true;\n\
});\n\
\n\
function getBooleanAttrName(element, name) {\n\
  // check dom last since we will most likely fail on name\n\
  var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];\n\
\n\
  // booleanAttr is here twice to minimize DOM access\n\
  return booleanAttr && BOOLEAN_ELEMENTS[element.nodeName] && booleanAttr;\n\
}\n\
\n\
forEach({\n\
  data: JQLiteData,\n\
  inheritedData: JQLiteInheritedData,\n\
\n\
  scope: function(element) {\n\
    return JQLiteInheritedData(element, '$scope');\n\
  },\n\
\n\
  controller: JQLiteController ,\n\
\n\
  injector: function(element) {\n\
    return JQLiteInheritedData(element, '$injector');\n\
  },\n\
\n\
  removeAttr: function(element,name) {\n\
    element.removeAttribute(name);\n\
  },\n\
\n\
  hasClass: JQLiteHasClass,\n\
\n\
  css: function(element, name, value) {\n\
    name = camelCase(name);\n\
\n\
    if (isDefined(value)) {\n\
      element.style[name] = value;\n\
    } else {\n\
      var val;\n\
\n\
      if (msie <= 8) {\n\
        // this is some IE specific weirdness that jQuery 1.6.4 does not sure why\n\
        val = element.currentStyle && element.currentStyle[name];\n\
        if (val === '') val = 'auto';\n\
      }\n\
\n\
      val = val || element.style[name];\n\
\n\
      if (msie <= 8) {\n\
        // jquery weirdness :-/\n\
        val = (val === '') ? undefined : val;\n\
      }\n\
\n\
      return  val;\n\
    }\n\
  },\n\
\n\
  attr: function(element, name, value){\n\
    var lowercasedName = lowercase(name);\n\
    if (BOOLEAN_ATTR[lowercasedName]) {\n\
      if (isDefined(value)) {\n\
        if (!!value) {\n\
          element[name] = true;\n\
          element.setAttribute(name, lowercasedName);\n\
        } else {\n\
          element[name] = false;\n\
          element.removeAttribute(lowercasedName);\n\
        }\n\
      } else {\n\
        return (element[name] ||\n\
                 (element.attributes.getNamedItem(name)|| noop).specified)\n\
               ? lowercasedName\n\
               : undefined;\n\
      }\n\
    } else if (isDefined(value)) {\n\
      element.setAttribute(name, value);\n\
    } else if (element.getAttribute) {\n\
      // the extra argument \"2\" is to get the right thing for a.href in IE, see jQuery code\n\
      // some elements (e.g. Document) don't have get attribute, so return undefined\n\
      var ret = element.getAttribute(name, 2);\n\
      // normalize non-existing attributes to undefined (as jQuery)\n\
      return ret === null ? undefined : ret;\n\
    }\n\
  },\n\
\n\
  prop: function(element, name, value) {\n\
    if (isDefined(value)) {\n\
      element[name] = value;\n\
    } else {\n\
      return element[name];\n\
    }\n\
  },\n\
\n\
  text: extend((msie < 9)\n\
      ? function(element, value) {\n\
        if (element.nodeType == 1 /** Element */) {\n\
          if (isUndefined(value))\n\
            return element.innerText;\n\
          element.innerText = value;\n\
        } else {\n\
          if (isUndefined(value))\n\
            return element.nodeValue;\n\
          element.nodeValue = value;\n\
        }\n\
      }\n\
      : function(element, value) {\n\
        if (isUndefined(value)) {\n\
          return element.textContent;\n\
        }\n\
        element.textContent = value;\n\
      }, {$dv:''}),\n\
\n\
  val: function(element, value) {\n\
    if (isUndefined(value)) {\n\
      return element.value;\n\
    }\n\
    element.value = value;\n\
  },\n\
\n\
  html: function(element, value) {\n\
    if (isUndefined(value)) {\n\
      return element.innerHTML;\n\
    }\n\
    for (var i = 0, childNodes = element.childNodes; i < childNodes.length; i++) {\n\
      JQLiteDealoc(childNodes[i]);\n\
    }\n\
    element.innerHTML = value;\n\
  }\n\
}, function(fn, name){\n\
  /**\n\
   * Properties: writes return selection, reads return first value\n\
   */\n\
  JQLite.prototype[name] = function(arg1, arg2) {\n\
    var i, key;\n\
\n\
    // JQLiteHasClass has only two arguments, but is a getter-only fn, so we need to special-case it\n\
    // in a way that survives minification.\n\
    if (((fn.length == 2 && (fn !== JQLiteHasClass && fn !== JQLiteController)) ? arg1 : arg2) === undefined) {\n\
      if (isObject(arg1)) {\n\
\n\
        // we are a write, but the object properties are the key/values\n\
        for(i=0; i < this.length; i++) {\n\
          if (fn === JQLiteData) {\n\
            // data() takes the whole object in jQuery\n\
            fn(this[i], arg1);\n\
          } else {\n\
            for (key in arg1) {\n\
              fn(this[i], key, arg1[key]);\n\
            }\n\
          }\n\
        }\n\
        // return self for chaining\n\
        return this;\n\
      } else {\n\
        // we are a read, so read the first child.\n\
        if (this.length)\n\
          return fn(this[0], arg1, arg2);\n\
      }\n\
    } else {\n\
      // we are a write, so apply to all children\n\
      for(i=0; i < this.length; i++) {\n\
        fn(this[i], arg1, arg2);\n\
      }\n\
      // return self for chaining\n\
      return this;\n\
    }\n\
    return fn.$dv;\n\
  };\n\
});\n\
\n\
function createEventHandler(element, events) {\n\
  var eventHandler = function (event, type) {\n\
    if (!event.preventDefault) {\n\
      event.preventDefault = function() {\n\
        event.returnValue = false; //ie\n\
      };\n\
    }\n\
\n\
    if (!event.stopPropagation) {\n\
      event.stopPropagation = function() {\n\
        event.cancelBubble = true; //ie\n\
      };\n\
    }\n\
\n\
    if (!event.target) {\n\
      event.target = event.srcElement || document;\n\
    }\n\
\n\
    if (isUndefined(event.defaultPrevented)) {\n\
      var prevent = event.preventDefault;\n\
      event.preventDefault = function() {\n\
        event.defaultPrevented = true;\n\
        prevent.call(event);\n\
      };\n\
      event.defaultPrevented = false;\n\
    }\n\
\n\
    event.isDefaultPrevented = function() {\n\
      return event.defaultPrevented || event.returnValue == false;\n\
    };\n\
\n\
    forEach(events[type || event.type], function(fn) {\n\
      fn.call(element, event);\n\
    });\n\
\n\
    // Remove monkey-patched methods (IE),\n\
    // as they would cause memory leaks in IE8.\n\
    if (msie <= 8) {\n\
      // IE7/8 does not allow to delete property on native object\n\
      event.preventDefault = null;\n\
      event.stopPropagation = null;\n\
      event.isDefaultPrevented = null;\n\
    } else {\n\
      // It shouldn't affect normal browsers (native methods are defined on prototype).\n\
      delete event.preventDefault;\n\
      delete event.stopPropagation;\n\
      delete event.isDefaultPrevented;\n\
    }\n\
  };\n\
  eventHandler.elem = element;\n\
  return eventHandler;\n\
}\n\
\n\
//////////////////////////////////////////\n\
// Functions iterating traversal.\n\
// These functions chain results into a single\n\
// selector.\n\
//////////////////////////////////////////\n\
forEach({\n\
  removeData: JQLiteRemoveData,\n\
\n\
  dealoc: JQLiteDealoc,\n\
\n\
  bind: function bindFn(element, type, fn){\n\
    var events = JQLiteExpandoStore(element, 'events'),\n\
        handle = JQLiteExpandoStore(element, 'handle');\n\
\n\
    if (!events) JQLiteExpandoStore(element, 'events', events = {});\n\
    if (!handle) JQLiteExpandoStore(element, 'handle', handle = createEventHandler(element, events));\n\
\n\
    forEach(type.split(' '), function(type){\n\
      var eventFns = events[type];\n\
\n\
      if (!eventFns) {\n\
        if (type == 'mouseenter' || type == 'mouseleave') {\n\
          var contains = document.body.contains || document.body.compareDocumentPosition ?\n\
          function( a, b ) {\n\
            var adown = a.nodeType === 9 ? a.documentElement : a,\n\
            bup = b && b.parentNode;\n\
            return a === bup || !!( bup && bup.nodeType === 1 && (\n\
              adown.contains ?\n\
              adown.contains( bup ) :\n\
              a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16\n\
              ));\n\
            } :\n\
            function( a, b ) {\n\
              if ( b ) {\n\
                while ( (b = b.parentNode) ) {\n\
                  if ( b === a ) {\n\
                    return true;\n\
                  }\n\
                }\n\
              }\n\
              return false;\n\
            };  \n\
\n\
          events[type] = [];\n\
    \n\
      // Refer to jQuery's implementation of mouseenter & mouseleave\n\
          // Read about mouseenter and mouseleave:\n\
          // http://www.quirksmode.org/js/events_mouse.html#link8\n\
          var eventmap = { mouseleave : \"mouseout\", mouseenter : \"mouseover\"}          \n\
          bindFn(element, eventmap[type], function(event) {\n\
            var ret, target = this, related = event.relatedTarget;\n\
            // For mousenter/leave call the handler if related is outside the target.\n\
            // NB: No relatedTarget if the mouse left/entered the browser window\n\
            if ( !related || (related !== target && !contains(target, related)) ){\n\
              handle(event, type);\n\
            } \n\
\n\
          });\n\
\n\
        } else {\n\
          addEventListenerFn(element, type, handle);\n\
          events[type] = [];\n\
        }\n\
        eventFns = events[type]\n\
      }\n\
      eventFns.push(fn);\n\
    });\n\
  },\n\
\n\
  unbind: JQLiteUnbind,\n\
\n\
  replaceWith: function(element, replaceNode) {\n\
    var index, parent = element.parentNode;\n\
    JQLiteDealoc(element);\n\
    forEach(new JQLite(replaceNode), function(node){\n\
      if (index) {\n\
        parent.insertBefore(node, index.nextSibling);\n\
      } else {\n\
        parent.replaceChild(node, element);\n\
      }\n\
      index = node;\n\
    });\n\
  },\n\
\n\
  children: function(element) {\n\
    var children = [];\n\
    forEach(element.childNodes, function(element){\n\
      if (element.nodeType === 1)\n\
        children.push(element);\n\
    });\n\
    return children;\n\
  },\n\
\n\
  contents: function(element) {\n\
    return element.childNodes || [];\n\
  },\n\
\n\
  append: function(element, node) {\n\
    forEach(new JQLite(node), function(child){\n\
      if (element.nodeType === 1 || element.nodeType === 11) {\n\
        element.appendChild(child);\n\
      }\n\
    });\n\
  },\n\
\n\
  prepend: function(element, node) {\n\
    if (element.nodeType === 1) {\n\
      var index = element.firstChild;\n\
      forEach(new JQLite(node), function(child){\n\
        if (index) {\n\
          element.insertBefore(child, index);\n\
        } else {\n\
          element.appendChild(child);\n\
          index = child;\n\
        }\n\
      });\n\
    }\n\
  },\n\
\n\
  wrap: function(element, wrapNode) {\n\
    wrapNode = jqLite(wrapNode)[0];\n\
    var parent = element.parentNode;\n\
    if (parent) {\n\
      parent.replaceChild(wrapNode, element);\n\
    }\n\
    wrapNode.appendChild(element);\n\
  },\n\
\n\
  remove: function(element) {\n\
    JQLiteDealoc(element);\n\
    var parent = element.parentNode;\n\
    if (parent) parent.removeChild(element);\n\
  },\n\
\n\
  after: function(element, newElement) {\n\
    var index = element, parent = element.parentNode;\n\
    forEach(new JQLite(newElement), function(node){\n\
      parent.insertBefore(node, index.nextSibling);\n\
      index = node;\n\
    });\n\
  },\n\
\n\
  addClass: JQLiteAddClass,\n\
  removeClass: JQLiteRemoveClass,\n\
\n\
  toggleClass: function(element, selector, condition) {\n\
    if (isUndefined(condition)) {\n\
      condition = !JQLiteHasClass(element, selector);\n\
    }\n\
    (condition ? JQLiteAddClass : JQLiteRemoveClass)(element, selector);\n\
  },\n\
\n\
  parent: function(element) {\n\
    var parent = element.parentNode;\n\
    return parent && parent.nodeType !== 11 ? parent : null;\n\
  },\n\
\n\
  next: function(element) {\n\
    if (element.nextElementSibling) {\n\
      return element.nextElementSibling;\n\
    }\n\
\n\
    // IE8 doesn't have nextElementSibling\n\
    var elm = element.nextSibling;\n\
    while (elm != null && elm.nodeType !== 1) {\n\
      elm = elm.nextSibling;\n\
    }\n\
    return elm;\n\
  },\n\
\n\
  find: function(element, selector) {\n\
    return element.getElementsByTagName(selector);\n\
  },\n\
\n\
  clone: JQLiteClone,\n\
\n\
  triggerHandler: function(element, eventName) {\n\
    var eventFns = (JQLiteExpandoStore(element, 'events') || {})[eventName];\n\
    var event;\n\
\n\
    forEach(eventFns, function(fn) {\n\
      fn.call(element, {preventDefault: noop});\n\
    });\n\
  }\n\
}, function(fn, name){\n\
  /**\n\
   * chaining functions\n\
   */\n\
  JQLite.prototype[name] = function(arg1, arg2) {\n\
    var value;\n\
    for(var i=0; i < this.length; i++) {\n\
      if (value == undefined) {\n\
        value = fn(this[i], arg1, arg2);\n\
        if (value !== undefined) {\n\
          // any function which returns a value needs to be wrapped\n\
          value = jqLite(value);\n\
        }\n\
      } else {\n\
        JQLiteAddNodes(value, fn(this[i], arg1, arg2));\n\
      }\n\
    }\n\
    return value == undefined ? this : value;\n\
  };\n\
});\n\
\n\
/**\n\
 * Computes a hash of an 'obj'.\n\
 * Hash of a:\n\
 *  string is string\n\
 *  number is number as string\n\
 *  object is either result of calling $$hashKey function on the object or uniquely generated id,\n\
 *         that is also assigned to the $$hashKey property of the object.\n\
 *\n\
 * @param obj\n\
 * @returns {string} hash string such that the same input will have the same hash string.\n\
 *         The resulting string key is in 'type:hashKey' format.\n\
 */\n\
function hashKey(obj) {\n\
  var objType = typeof obj,\n\
      key;\n\
\n\
  if (objType == 'object' && obj !== null) {\n\
    if (typeof (key = obj.$$hashKey) == 'function') {\n\
      // must invoke on object to keep the right this\n\
      key = obj.$$hashKey();\n\
    } else if (key === undefined) {\n\
      key = obj.$$hashKey = nextUid();\n\
    }\n\
  } else {\n\
    key = obj;\n\
  }\n\
\n\
  return objType + ':' + key;\n\
}\n\
\n\
/**\n\
 * HashMap which can use objects as keys\n\
 */\n\
function HashMap(array){\n\
  forEach(array, this.put, this);\n\
}\n\
HashMap.prototype = {\n\
  /**\n\
   * Store key value pair\n\
   * @param key key to store can be any type\n\
   * @param value value to store can be any type\n\
   */\n\
  put: function(key, value) {\n\
    this[hashKey(key)] = value;\n\
  },\n\
\n\
  /**\n\
   * @param key\n\
   * @returns the value for the key\n\
   */\n\
  get: function(key) {\n\
    return this[hashKey(key)];\n\
  },\n\
\n\
  /**\n\
   * Remove the key/value pair\n\
   * @param key\n\
   */\n\
  remove: function(key) {\n\
    var value = this[key = hashKey(key)];\n\
    delete this[key];\n\
    return value;\n\
  }\n\
};\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name angular.injector\n\
 * @function\n\
 *\n\
 * @description\n\
 * Creates an injector function that can be used for retrieving services as well as for\n\
 * dependency injection (see {@link guide/di dependency injection}).\n\
 *\n\
\n\
 * @param {Array.<string|Function>} modules A list of module functions or their aliases. See\n\
 *        {@link angular.module}. The `ng` module must be explicitly added.\n\
 * @returns {function()} Injector function. See {@link AUTO.$injector $injector}.\n\
 *\n\
 * @example\n\
 * Typical usage\n\
 * <pre>\n\
 *   // create an injector\n\
 *   var $injector = angular.injector(['ng']);\n\
 *\n\
 *   // use the injector to kick off your application\n\
 *   // use the type inference to auto inject arguments, or use implicit injection\n\
 *   $injector.invoke(function($rootScope, $compile, $document){\n\
 *     $compile($document)($rootScope);\n\
 *     $rootScope.$digest();\n\
 *   });\n\
 * </pre>\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc overview\n\
 * @name AUTO\n\
 * @description\n\
 *\n\
 * Implicit module which gets automatically added to each {@link AUTO.$injector $injector}.\n\
 */\n\
\n\
var FN_ARGS = /^function\\s*[^\\(]*\\(\\s*([^\\)]*)\\)/m;\n\
var FN_ARG_SPLIT = /,/;\n\
var FN_ARG = /^\\s*(_?)(\\S+?)\\1\\s*$/;\n\
var STRIP_COMMENTS = /((\\/\\/.*$)|(\\/\\*[\\s\\S]*?\\*\\/))/mg;\n\
function annotate(fn) {\n\
  var $inject,\n\
      fnText,\n\
      argDecl,\n\
      last;\n\
\n\
  if (typeof fn == 'function') {\n\
    if (!($inject = fn.$inject)) {\n\
      $inject = [];\n\
      fnText = fn.toString().replace(STRIP_COMMENTS, '');\n\
      argDecl = fnText.match(FN_ARGS);\n\
      forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg){\n\
        arg.replace(FN_ARG, function(all, underscore, name){\n\
          $inject.push(name);\n\
        });\n\
      });\n\
      fn.$inject = $inject;\n\
    }\n\
  } else if (isArray(fn)) {\n\
    last = fn.length - 1;\n\
    assertArgFn(fn[last], 'fn');\n\
    $inject = fn.slice(0, last);\n\
  } else {\n\
    assertArgFn(fn, 'fn', true);\n\
  }\n\
  return $inject;\n\
}\n\
\n\
///////////////////////////////////////\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name AUTO.$injector\n\
 * @function\n\
 *\n\
 * @description\n\
 *\n\
 * `$injector` is used to retrieve object instances as defined by\n\
 * {@link AUTO.$provide provider}, instantiate types, invoke methods,\n\
 * and load modules.\n\
 *\n\
 * The following always holds true:\n\
 *\n\
 * <pre>\n\
 *   var $injector = angular.injector();\n\
 *   expect($injector.get('$injector')).toBe($injector);\n\
 *   expect($injector.invoke(function($injector){\n\
 *     return $injector;\n\
 *   }).toBe($injector);\n\
 * </pre>\n\
 *\n\
 * # Injection Function Annotation\n\
 *\n\
 * JavaScript does not have annotations, and annotations are needed for dependency injection. The\n\
 * following are all valid ways of annotating function with injection arguments and are equivalent.\n\
 *\n\
 * <pre>\n\
 *   // inferred (only works if code not minified/obfuscated)\n\
 *   $injector.invoke(function(serviceA){});\n\
 *\n\
 *   // annotated\n\
 *   function explicit(serviceA) {};\n\
 *   explicit.$inject = ['serviceA'];\n\
 *   $injector.invoke(explicit);\n\
 *\n\
 *   // inline\n\
 *   $injector.invoke(['serviceA', function(serviceA){}]);\n\
 * </pre>\n\
 *\n\
 * ## Inference\n\
 *\n\
 * In JavaScript calling `toString()` on a function returns the function definition. The definition can then be\n\
 * parsed and the function arguments can be extracted. *NOTE:* This does not work with minification, and obfuscation\n\
 * tools since these tools change the argument names.\n\
 *\n\
 * ## `$inject` Annotation\n\
 * By adding a `$inject` property onto a function the injection parameters can be specified.\n\
 *\n\
 * ## Inline\n\
 * As an array of injection names, where the last item in the array is the function to call.\n\
 */\n\
\n\
/**\n\
 * @ngdoc method\n\
 * @name AUTO.$injector#get\n\
 * @methodOf AUTO.$injector\n\
 *\n\
 * @description\n\
 * Return an instance of the service.\n\
 *\n\
 * @param {string} name The name of the instance to retrieve.\n\
 * @return {*} The instance.\n\
 */\n\
\n\
/**\n\
 * @ngdoc method\n\
 * @name AUTO.$injector#invoke\n\
 * @methodOf AUTO.$injector\n\
 *\n\
 * @description\n\
 * Invoke the method and supply the method arguments from the `$injector`.\n\
 *\n\
 * @param {!function} fn The function to invoke. The function arguments come form the function annotation.\n\
 * @param {Object=} self The `this` for the invoked method.\n\
 * @param {Object=} locals Optional object. If preset then any argument names are read from this object first, before\n\
 *   the `$injector` is consulted.\n\
 * @returns {*} the value returned by the invoked `fn` function.\n\
 */\n\
\n\
/**\n\
 * @ngdoc method\n\
 * @name AUTO.$injector#has\n\
 * @methodOf AUTO.$injector\n\
 *\n\
 * @description\n\
 * Allows the user to query if the particular service exist.\n\
 *\n\
 * @param {string} Name of the service to query.\n\
 * @returns {boolean} returns true if injector has given service.\n\
 */\n\
\n\
/**\n\
 * @ngdoc method\n\
 * @name AUTO.$injector#instantiate\n\
 * @methodOf AUTO.$injector\n\
 * @description\n\
 * Create a new instance of JS type. The method takes a constructor function invokes the new operator and supplies\n\
 * all of the arguments to the constructor function as specified by the constructor annotation.\n\
 *\n\
 * @param {function} Type Annotated constructor function.\n\
 * @param {Object=} locals Optional object. If preset then any argument names are read from this object first, before\n\
 *   the `$injector` is consulted.\n\
 * @returns {Object} new instance of `Type`.\n\
 */\n\
\n\
/**\n\
 * @ngdoc method\n\
 * @name AUTO.$injector#annotate\n\
 * @methodOf AUTO.$injector\n\
 *\n\
 * @description\n\
 * Returns an array of service names which the function is requesting for injection. This API is used by the injector\n\
 * to determine which services need to be injected into the function when the function is invoked. There are three\n\
 * ways in which the function can be annotated with the needed dependencies.\n\
 *\n\
 * # Argument names\n\
 *\n\
 * The simplest form is to extract the dependencies from the arguments of the function. This is done by converting\n\
 * the function into a string using `toString()` method and extracting the argument names.\n\
 * <pre>\n\
 *   // Given\n\
 *   function MyController($scope, $route) {\n\
 *     // ...\n\
 *   }\n\
 *\n\
 *   // Then\n\
 *   expect(injector.annotate(MyController)).toEqual(['$scope', '$route']);\n\
 * </pre>\n\
 *\n\
 * This method does not work with code minfication / obfuscation. For this reason the following annotation strategies\n\
 * are supported.\n\
 *\n\
 * # The `$inject` property\n\
 *\n\
 * If a function has an `$inject` property and its value is an array of strings, then the strings represent names of\n\
 * services to be injected into the function.\n\
 * <pre>\n\
 *   // Given\n\
 *   var MyController = function(obfuscatedScope, obfuscatedRoute) {\n\
 *     // ...\n\
 *   }\n\
 *   // Define function dependencies\n\
 *   MyController.$inject = ['$scope', '$route'];\n\
 *\n\
 *   // Then\n\
 *   expect(injector.annotate(MyController)).toEqual(['$scope', '$route']);\n\
 * </pre>\n\
 *\n\
 * # The array notation\n\
 *\n\
 * It is often desirable to inline Injected functions and that's when setting the `$inject` property is very\n\
 * inconvenient. In these situations using the array notation to specify the dependencies in a way that survives\n\
 * minification is a better choice:\n\
 *\n\
 * <pre>\n\
 *   // We wish to write this (not minification / obfuscation safe)\n\
 *   injector.invoke(function($compile, $rootScope) {\n\
 *     // ...\n\
 *   });\n\
 *\n\
 *   // We are forced to write break inlining\n\
 *   var tmpFn = function(obfuscatedCompile, obfuscatedRootScope) {\n\
 *     // ...\n\
 *   };\n\
 *   tmpFn.$inject = ['$compile', '$rootScope'];\n\
 *   injector.invoke(tmpFn);\n\
 *\n\
 *   // To better support inline function the inline annotation is supported\n\
 *   injector.invoke(['$compile', '$rootScope', function(obfCompile, obfRootScope) {\n\
 *     // ...\n\
 *   }]);\n\
 *\n\
 *   // Therefore\n\
 *   expect(injector.annotate(\n\
 *      ['$compile', '$rootScope', function(obfus_$compile, obfus_$rootScope) {}])\n\
 *    ).toEqual(['$compile', '$rootScope']);\n\
 * </pre>\n\
 *\n\
 * @param {function|Array.<string|Function>} fn Function for which dependent service names need to be retrieved as described\n\
 *   above.\n\
 *\n\
 * @returns {Array.<string>} The names of the services which the function requires.\n\
 */\n\
\n\
\n\
\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name AUTO.$provide\n\
 *\n\
 * @description\n\
 *\n\
 * Use `$provide` to register new providers with the `$injector`. The providers are the factories for the instance.\n\
 * The providers share the same name as the instance they create with `Provider` suffixed to them.\n\
 *\n\
 * A provider is an object with a `$get()` method. The injector calls the `$get` method to create a new instance of\n\
 * a service. The Provider can have additional methods which would allow for configuration of the provider.\n\
 *\n\
 * <pre>\n\
 *   function GreetProvider() {\n\
 *     var salutation = 'Hello';\n\
 *\n\
 *     this.salutation = function(text) {\n\
 *       salutation = text;\n\
 *     };\n\
 *\n\
 *     this.$get = function() {\n\
 *       return function (name) {\n\
 *         return salutation + ' ' + name + '!';\n\
 *       };\n\
 *     };\n\
 *   }\n\
 *\n\
 *   describe('Greeter', function(){\n\
 *\n\
 *     beforeEach(module(function($provide) {\n\
 *       $provide.provider('greet', GreetProvider);\n\
 *     }));\n\
 *\n\
 *     it('should greet', inject(function(greet) {\n\
 *       expect(greet('angular')).toEqual('Hello angular!');\n\
 *     }));\n\
 *\n\
 *     it('should allow configuration of salutation', function() {\n\
 *       module(function(greetProvider) {\n\
 *         greetProvider.salutation('Ahoj');\n\
 *       });\n\
 *       inject(function(greet) {\n\
 *         expect(greet('angular')).toEqual('Ahoj angular!');\n\
 *       });\n\
 *     });\n\
 * </pre>\n\
 */\n\
\n\
/**\n\
 * @ngdoc method\n\
 * @name AUTO.$provide#provider\n\
 * @methodOf AUTO.$provide\n\
 * @description\n\
 *\n\
 * Register a provider for a service. The providers can be retrieved and can have additional configuration methods.\n\
 *\n\
 * @param {string} name The name of the instance. NOTE: the provider will be available under `name + 'Provider'` key.\n\
 * @param {(Object|function())} provider If the provider is:\n\
 *\n\
 *   - `Object`: then it should have a `$get` method. The `$get` method will be invoked using\n\
 *               {@link AUTO.$injector#invoke $injector.invoke()} when an instance needs to be created.\n\
 *   - `Constructor`: a new instance of the provider will be created using\n\
 *               {@link AUTO.$injector#instantiate $injector.instantiate()}, then treated as `object`.\n\
 *\n\
 * @returns {Object} registered provider instance\n\
 */\n\
\n\
/**\n\
 * @ngdoc method\n\
 * @name AUTO.$provide#factory\n\
 * @methodOf AUTO.$provide\n\
 * @description\n\
 *\n\
 * A short hand for configuring services if only `$get` method is required.\n\
 *\n\
 * @param {string} name The name of the instance.\n\
 * @param {function()} $getFn The $getFn for the instance creation. Internally this is a short hand for\n\
 * `$provide.provider(name, {$get: $getFn})`.\n\
 * @returns {Object} registered provider instance\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc method\n\
 * @name AUTO.$provide#service\n\
 * @methodOf AUTO.$provide\n\
 * @description\n\
 *\n\
 * A short hand for registering service of given class.\n\
 *\n\
 * @param {string} name The name of the instance.\n\
 * @param {Function} constructor A class (constructor function) that will be instantiated.\n\
 * @returns {Object} registered provider instance\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc method\n\
 * @name AUTO.$provide#value\n\
 * @methodOf AUTO.$provide\n\
 * @description\n\
 *\n\
 * A short hand for configuring services if the `$get` method is a constant.\n\
 *\n\
 * @param {string} name The name of the instance.\n\
 * @param {*} value The value.\n\
 * @returns {Object} registered provider instance\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc method\n\
 * @name AUTO.$provide#constant\n\
 * @methodOf AUTO.$provide\n\
 * @description\n\
 *\n\
 * A constant value, but unlike {@link AUTO.$provide#value value} it can be injected\n\
 * into configuration function (other modules) and it is not interceptable by\n\
 * {@link AUTO.$provide#decorator decorator}.\n\
 *\n\
 * @param {string} name The name of the constant.\n\
 * @param {*} value The constant value.\n\
 * @returns {Object} registered instance\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc method\n\
 * @name AUTO.$provide#decorator\n\
 * @methodOf AUTO.$provide\n\
 * @description\n\
 *\n\
 * Decoration of service, allows the decorator to intercept the service instance creation. The\n\
 * returned instance may be the original instance, or a new instance which delegates to the\n\
 * original instance.\n\
 *\n\
 * @param {string} name The name of the service to decorate.\n\
 * @param {function()} decorator This function will be invoked when the service needs to be\n\
 *    instantiated. The function is called using the {@link AUTO.$injector#invoke\n\
 *    injector.invoke} method and is therefore fully injectable. Local injection arguments:\n\
 *\n\
 *    * `$delegate` - The original service instance, which can be monkey patched, configured,\n\
 *      decorated or delegated to.\n\
 */\n\
\n\
\n\
function createInjector(modulesToLoad) {\n\
  var INSTANTIATING = {},\n\
      providerSuffix = 'Provider',\n\
      path = [],\n\
      loadedModules = new HashMap(),\n\
      providerCache = {\n\
        $provide: {\n\
            provider: supportObject(provider),\n\
            factory: supportObject(factory),\n\
            service: supportObject(service),\n\
            value: supportObject(value),\n\
            constant: supportObject(constant),\n\
            decorator: decorator\n\
          }\n\
      },\n\
      providerInjector = (providerCache.$injector =\n\
          createInternalInjector(providerCache, function() {\n\
            throw Error(\"Unknown provider: \" + path.join(' <- '));\n\
          })),\n\
      instanceCache = {},\n\
      instanceInjector = (instanceCache.$injector =\n\
          createInternalInjector(instanceCache, function(servicename) {\n\
            var provider = providerInjector.get(servicename + providerSuffix);\n\
            return instanceInjector.invoke(provider.$get, provider);\n\
          }));\n\
\n\
\n\
  forEach(loadModules(modulesToLoad), function(fn) { instanceInjector.invoke(fn || noop); });\n\
\n\
  return instanceInjector;\n\
\n\
  ////////////////////////////////////\n\
  // $provider\n\
  ////////////////////////////////////\n\
\n\
  function supportObject(delegate) {\n\
    return function(key, value) {\n\
      if (isObject(key)) {\n\
        forEach(key, reverseParams(delegate));\n\
      } else {\n\
        return delegate(key, value);\n\
      }\n\
    }\n\
  }\n\
\n\
  function provider(name, provider_) {\n\
    if (isFunction(provider_) || isArray(provider_)) {\n\
      provider_ = providerInjector.instantiate(provider_);\n\
    }\n\
    if (!provider_.$get) {\n\
      throw Error('Provider ' + name + ' must define $get factory method.');\n\
    }\n\
    return providerCache[name + providerSuffix] = provider_;\n\
  }\n\
\n\
  function factory(name, factoryFn) { return provider(name, { $get: factoryFn }); }\n\
\n\
  function service(name, constructor) {\n\
    return factory(name, ['$injector', function($injector) {\n\
      return $injector.instantiate(constructor);\n\
    }]);\n\
  }\n\
\n\
  function value(name, value) { return factory(name, valueFn(value)); }\n\
\n\
  function constant(name, value) {\n\
    providerCache[name] = value;\n\
    instanceCache[name] = value;\n\
  }\n\
\n\
  function decorator(serviceName, decorFn) {\n\
    var origProvider = providerInjector.get(serviceName + providerSuffix),\n\
        orig$get = origProvider.$get;\n\
\n\
    origProvider.$get = function() {\n\
      var origInstance = instanceInjector.invoke(orig$get, origProvider);\n\
      return instanceInjector.invoke(decorFn, null, {$delegate: origInstance});\n\
    };\n\
  }\n\
\n\
  ////////////////////////////////////\n\
  // Module Loading\n\
  ////////////////////////////////////\n\
  function loadModules(modulesToLoad){\n\
    var runBlocks = [];\n\
    forEach(modulesToLoad, function(module) {\n\
      if (loadedModules.get(module)) return;\n\
      loadedModules.put(module, true);\n\
      if (isString(module)) {\n\
        var moduleFn = angularModule(module);\n\
        runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);\n\
\n\
        try {\n\
          for(var invokeQueue = moduleFn._invokeQueue, i = 0, ii = invokeQueue.length; i < ii; i++) {\n\
            var invokeArgs = invokeQueue[i],\n\
                provider = providerInjector.get(invokeArgs[0]);\n\
\n\
            provider[invokeArgs[1]].apply(provider, invokeArgs[2]);\n\
          }\n\
        } catch (e) {\n\
          if (e.message) e.message += ' from ' + module;\n\
          throw e;\n\
        }\n\
      } else if (isFunction(module)) {\n\
        try {\n\
          runBlocks.push(providerInjector.invoke(module));\n\
        } catch (e) {\n\
          if (e.message) e.message += ' from ' + module;\n\
          throw e;\n\
        }\n\
      } else if (isArray(module)) {\n\
        try {\n\
          runBlocks.push(providerInjector.invoke(module));\n\
        } catch (e) {\n\
          if (e.message) e.message += ' from ' + String(module[module.length - 1]);\n\
          throw e;\n\
        }\n\
      } else {\n\
        assertArgFn(module, 'module');\n\
      }\n\
    });\n\
    return runBlocks;\n\
  }\n\
\n\
  ////////////////////////////////////\n\
  // internal Injector\n\
  ////////////////////////////////////\n\
\n\
  function createInternalInjector(cache, factory) {\n\
\n\
    function getService(serviceName) {\n\
      if (typeof serviceName !== 'string') {\n\
        throw Error('Service name expected');\n\
      }\n\
      if (cache.hasOwnProperty(serviceName)) {\n\
        if (cache[serviceName] === INSTANTIATING) {\n\
          throw Error('Circular dependency: ' + path.join(' <- '));\n\
        }\n\
        return cache[serviceName];\n\
      } else {\n\
        try {\n\
          path.unshift(serviceName);\n\
          cache[serviceName] = INSTANTIATING;\n\
          return cache[serviceName] = factory(serviceName);\n\
        } finally {\n\
          path.shift();\n\
        }\n\
      }\n\
    }\n\
\n\
    function invoke(fn, self, locals){\n\
      var args = [],\n\
          $inject = annotate(fn),\n\
          length, i,\n\
          key;\n\
\n\
      for(i = 0, length = $inject.length; i < length; i++) {\n\
        key = $inject[i];\n\
        args.push(\n\
          locals && locals.hasOwnProperty(key)\n\
          ? locals[key]\n\
          : getService(key)\n\
        );\n\
      }\n\
      if (!fn.$inject) {\n\
        // this means that we must be an array.\n\
        fn = fn[length];\n\
      }\n\
\n\
\n\
      // Performance optimization: http://jsperf.com/apply-vs-call-vs-invoke\n\
      switch (self ? -1 : args.length) {\n\
        case  0: return fn();\n\
        case  1: return fn(args[0]);\n\
        case  2: return fn(args[0], args[1]);\n\
        case  3: return fn(args[0], args[1], args[2]);\n\
        case  4: return fn(args[0], args[1], args[2], args[3]);\n\
        case  5: return fn(args[0], args[1], args[2], args[3], args[4]);\n\
        case  6: return fn(args[0], args[1], args[2], args[3], args[4], args[5]);\n\
        case  7: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);\n\
        case  8: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);\n\
        case  9: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);\n\
        case 10: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);\n\
        default: return fn.apply(self, args);\n\
      }\n\
    }\n\
\n\
    function instantiate(Type, locals) {\n\
      var Constructor = function() {},\n\
          instance, returnedValue;\n\
\n\
      // Check if Type is annotated and use just the given function at n-1 as parameter\n\
      // e.g. someModule.factory('greeter', ['$window', function(renamed$window) {}]);\n\
      Constructor.prototype = (isArray(Type) ? Type[Type.length - 1] : Type).prototype;\n\
      instance = new Constructor();\n\
      returnedValue = invoke(Type, instance, locals);\n\
\n\
      return isObject(returnedValue) ? returnedValue : instance;\n\
    }\n\
\n\
    return {\n\
      invoke: invoke,\n\
      instantiate: instantiate,\n\
      get: getService,\n\
      annotate: annotate,\n\
      has: function(name) {\n\
        return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name);\n\
      }\n\
    };\n\
  }\n\
}\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name ng.$anchorScroll\n\
 * @requires $window\n\
 * @requires $location\n\
 * @requires $rootScope\n\
 *\n\
 * @description\n\
 * When called, it checks current value of `$location.hash()` and scroll to related element,\n\
 * according to rules specified in\n\
 * {@link http://dev.w3.org/html5/spec/Overview.html#the-indicated-part-of-the-document Html5 spec}.\n\
 *\n\
 * It also watches the `$location.hash()` and scroll whenever it changes to match any anchor.\n\
 * This can be disabled by calling `$anchorScrollProvider.disableAutoScrolling()`.\n\
 */\n\
function $AnchorScrollProvider() {\n\
\n\
  var autoScrollingEnabled = true;\n\
\n\
  this.disableAutoScrolling = function() {\n\
    autoScrollingEnabled = false;\n\
  };\n\
\n\
  this.$get = ['$window', '$location', '$rootScope', function($window, $location, $rootScope) {\n\
    var document = $window.document;\n\
\n\
    // helper function to get first anchor from a NodeList\n\
    // can't use filter.filter, as it accepts only instances of Array\n\
    // and IE can't convert NodeList to an array using [].slice\n\
    // TODO(vojta): use filter if we change it to accept lists as well\n\
    function getFirstAnchor(list) {\n\
      var result = null;\n\
      forEach(list, function(element) {\n\
        if (!result && lowercase(element.nodeName) === 'a') result = element;\n\
      });\n\
      return result;\n\
    }\n\
\n\
    function scroll() {\n\
      var hash = $location.hash(), elm;\n\
\n\
      // empty hash, scroll to the top of the page\n\
      if (!hash) $window.scrollTo(0, 0);\n\
\n\
      // element with given id\n\
      else if ((elm = document.getElementById(hash))) elm.scrollIntoView();\n\
\n\
      // first anchor with given name :-D\n\
      else if ((elm = getFirstAnchor(document.getElementsByName(hash)))) elm.scrollIntoView();\n\
\n\
      // no element and hash == 'top', scroll to the top of the page\n\
      else if (hash === 'top') $window.scrollTo(0, 0);\n\
    }\n\
\n\
    // does not scroll when user clicks on anchor link that is currently on\n\
    // (no url change, no $location.hash() change), browser native does scroll\n\
    if (autoScrollingEnabled) {\n\
      $rootScope.$watch(function autoScrollWatch() {return $location.hash();},\n\
        function autoScrollWatchAction() {\n\
          $rootScope.$evalAsync(scroll);\n\
        });\n\
    }\n\
\n\
    return scroll;\n\
  }];\n\
}\n\
\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.$animationProvider\n\
 * @description\n\
 *\n\
 * The $AnimationProvider provider allows developers to register and access custom JavaScript animations directly inside\n\
 * of a module.\n\
 *\n\
 */\n\
$AnimationProvider.$inject = ['$provide'];\n\
function $AnimationProvider($provide) {\n\
  var suffix = 'Animation';\n\
\n\
  /**\n\
   * @ngdoc function\n\
   * @name ng.$animation#register\n\
   * @methodOf ng.$animationProvider\n\
   *\n\
   * @description\n\
   * Registers a new injectable animation factory function. The factory function produces the animation object which\n\
   * has these two properties:\n\
   *\n\
   *   * `setup`: `function(Element):*` A function which receives the starting state of the element. The purpose\n\
   *   of this function is to get the element ready for animation. Optionally the function returns an memento which\n\
   *   is passed to the `start` function.\n\
   *   * `start`: `function(Element, doneFunction, *)` The element to animate, the `doneFunction` to be called on\n\
   *   element animation completion, and an optional memento from the `setup` function.\n\
   *\n\
   * @param {string} name The name of the animation.\n\
   * @param {function} factory The factory function that will be executed to return the animation object.\n\
   * \n\
   */\n\
  this.register = function(name, factory) {\n\
    $provide.factory(camelCase(name) + suffix, factory);\n\
  };\n\
\n\
  this.$get = ['$injector', function($injector) {\n\
    /**\n\
     * @ngdoc function\n\
     * @name ng.$animation\n\
     * @function\n\
     *\n\
     * @description\n\
     * The $animation service is used to retrieve any defined animation functions. When executed, the $animation service\n\
     * will return a object that contains the setup and start functions that were defined for the animation.\n\
     *\n\
     * @param {String} name Name of the animation function to retrieve. Animation functions are registered and stored\n\
     *        inside of the AngularJS DI so a call to $animate('custom') is the same as injecting `customAnimation`\n\
     *        via dependency injection.\n\
     * @return {Object} the animation object which contains the `setup` and `start` functions that perform the animation.\n\
     */\n\
    return function $animation(name) {\n\
      if (name) {\n\
        var animationName = camelCase(name) + suffix;\n\
        if ($injector.has(animationName)) {\n\
          return $injector.get(animationName);\n\
        }\n\
      }\n\
    };\n\
  }];\n\
}\n\
\n\
// NOTE: this is a pseudo directive.\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngAnimate\n\
 *\n\
 * @description\n\
 * The `ngAnimate` directive works as an attribute that is attached alongside pre-existing directives.\n\
 * It effects how the directive will perform DOM manipulation. This allows for complex animations to take place\n\
 * without burdening the directive which uses the animation with animation details. The built in directives\n\
 * `ngRepeat`, `ngInclude`, `ngSwitch`, `ngShow`, `ngHide` and `ngView` already accept `ngAnimate` directive.\n\
 * Custom directives can take advantage of animation through {@link ng.$animator $animator service}.\n\
 *\n\
 * Below is a more detailed breakdown of the supported callback events provided by pre-exisitng ng directives:\n\
 *\n\
 * | Directive                                                 | Supported Animations                               |\n\
 * |========================================================== |====================================================|\n\
 * | {@link ng.directive:ngRepeat#animations ngRepeat}         | enter, leave and move                              |\n\
 * | {@link ng.directive:ngView#animations ngView}             | enter and leave                                    |\n\
 * | {@link ng.directive:ngInclude#animations ngInclude}       | enter and leave                                    |\n\
 * | {@link ng.directive:ngSwitch#animations ngSwitch}         | enter and leave                                    |\n\
 * | {@link ng.directive:ngIf#animations ngIf}                 | enter and leave                                    |\n\
 * | {@link ng.directive:ngShow#animations ngShow & ngHide}    | show and hide                                      |\n\
 *\n\
 * You can find out more information about animations upon visiting each directive page.\n\
 *\n\
 * Below is an example of a directive that makes use of the ngAnimate attribute:\n\
 *\n\
 * <pre>\n\
 * <!-- you can also use data-ng-animate, ng:animate or x-ng-animate as well -->\n\
 * <ANY ng-directive ng-animate=\"{event1: 'animation-name', event2: 'animation-name-2'}\"></ANY>\n\
 *\n\
 * <!-- you can also use a short hand -->\n\
 * <ANY ng-directive ng-animate=\" 'animation' \"></ANY>\n\
 * <!-- which expands to -->\n\
 * <ANY ng-directive ng-animate=\"{ enter: 'animation-enter', leave: 'animation-leave', ...}\"></ANY>\n\
 *\n\
 * <!-- keep in mind that ng-animate can take expressions -->\n\
 * <ANY ng-directive ng-animate=\" computeCurrentAnimation() \"></ANY>\n\
 * </pre>\n\
 *\n\
 * The `event1` and `event2` attributes refer to the animation events specific to the directive that has been assigned.\n\
 *\n\
 * Keep in mind that if an animation is running, no child element of such animation can also be animated.\n\
 *\n\
 * <h2>CSS-defined Animations</h2>\n\
 * By default, ngAnimate attaches two CSS classes per animation event to the DOM element to achieve the animation.\n\
 * It is up to you, the developer, to ensure that the animations take place using cross-browser CSS3 transitions as\n\
 * well as CSS animations.\n\
 *\n\
 * The following code below demonstrates how to perform animations using **CSS transitions** with ngAnimate:\n\
 *\n\
 * <pre>\n\
 * <style type=\"text/css\">\n\
 * /&#42;\n\
 *  The animate-enter CSS class is the event name that you\n\
 *  have provided within the ngAnimate attribute.\n\
 * &#42;/\n\
 * .animate-enter {\n\
 *  -webkit-transition: 1s linear all; /&#42; Safari/Chrome &#42;/\n\
 *  -moz-transition: 1s linear all; /&#42; Firefox &#42;/\n\
 *  -o-transition: 1s linear all; /&#42; Opera &#42;/\n\
 *  transition: 1s linear all; /&#42; IE10+ and Future Browsers &#42;/\n\
 *\n\
 *  /&#42; The animation preparation code &#42;/\n\
 *  opacity: 0;\n\
 * }\n\
 *\n\
 * /&#42;\n\
 *  Keep in mind that you want to combine both CSS\n\
 *  classes together to avoid any CSS-specificity\n\
 *  conflicts\n\
 * &#42;/\n\
 * .animate-enter.animate-enter-active {\n\
 *  /&#42; The animation code itself &#42;/\n\
 *  opacity: 1;\n\
 * }\n\
 * </style>\n\
 *\n\
 * <div ng-directive ng-animate=\"{enter: 'animate-enter'}\"></div>\n\
 * </pre>\n\
 *\n\
 * The following code below demonstrates how to perform animations using **CSS animations** with ngAnimate:\n\
 *\n\
 * <pre>\n\
 * <style type=\"text/css\">\n\
 * .animate-enter {\n\
 *   -webkit-animation: enter_sequence 1s linear; /&#42; Safari/Chrome &#42;/\n\
 *   -moz-animation: enter_sequence 1s linear; /&#42; Firefox &#42;/\n\
 *   -o-animation: enter_sequence 1s linear; /&#42; Opera &#42;/\n\
 *   animation: enter_sequence 1s linear; /&#42; IE10+ and Future Browsers &#42;/\n\
 * }\n\
 * &#64-webkit-keyframes enter_sequence {\n\
 *   from { opacity:0; }\n\
 *   to { opacity:1; }\n\
 * }\n\
 * &#64-moz-keyframes enter_sequence {\n\
 *   from { opacity:0; }\n\
 *   to { opacity:1; }\n\
 * }\n\
 * &#64-o-keyframes enter_sequence {\n\
 *   from { opacity:0; }\n\
 *   to { opacity:1; }\n\
 * }\n\
 * &#64keyframes enter_sequence {\n\
 *   from { opacity:0; }\n\
 *   to { opacity:1; }\n\
 * }\n\
 * </style>\n\
 *\n\
 * <div ng-directive ng-animate=\"{enter: 'animate-enter'}\"></div>\n\
 * </pre>\n\
 *\n\
 * ngAnimate will first examine any CSS animation code and then fallback to using CSS transitions.\n\
 *\n\
 * Upon DOM mutation, the event class is added first, then the browser is allowed to reflow the content and then,\n\
 * the active class is added to trigger the animation. The ngAnimate directive will automatically extract the duration\n\
 * of the animation to determine when the animation ends. Once the animation is over then both CSS classes will be\n\
 * removed from the DOM. If a browser does not support CSS transitions or CSS animations then the animation will start and end\n\
 * immediately resulting in a DOM element that is at it's final state. This final state is when the DOM element\n\
 * has no CSS transition/animation classes surrounding it.\n\
 *\n\
 * <h2>JavaScript-defined Animations</h2>\n\
 * In the event that you do not want to use CSS3 transitions or CSS3 animations or if you wish to offer animations to browsers that do not\n\
 * yet support them, then you can make use of JavaScript animations defined inside of your AngularJS module.\n\
 *\n\
 * <pre>\n\
 * var ngModule = angular.module('YourApp', []);\n\
 * ngModule.animation('animate-enter', function() {\n\
 *   return {\n\
 *     setup : function(element) {\n\
 *       //prepare the element for animation\n\
 *       element.css({ 'opacity': 0 });\n\
 *       var memo = \"...\"; //this value is passed to the start function\n\
 *       return memo;\n\
 *     },\n\
 *     start : function(element, done, memo) {\n\
 *       //start the animation\n\
 *       element.animate({\n\
 *         'opacity' : 1\n\
 *       }, function() {\n\
 *         //call when the animation is complete\n\
 *         done()\n\
 *       });\n\
 *     }\n\
 *   }\n\
 * });\n\
 * </pre>\n\
 *\n\
 * As you can see, the JavaScript code follows a similar template to the CSS3 animations. Once defined, the animation\n\
 * can be used in the same way with the ngAnimate attribute. Keep in mind that, when using JavaScript-enabled\n\
 * animations, ngAnimate will also add in the same CSS classes that CSS-enabled animations do (even if you're not using\n\
 * CSS animations) to animated the element, but it will not attempt to find any CSS3 transition or animation duration/delay values.\n\
 * It will instead close off the animation once the provided done function is executed. So it's important that you\n\
 * make sure your animations remember to fire off the done function once the animations are complete.\n\
 *\n\
 * @param {expression} ngAnimate Used to configure the DOM manipulation animations.\n\
 *\n\
 */\n\
\n\
var $AnimatorProvider = function() {\n\
  var NG_ANIMATE_CONTROLLER = '$ngAnimateController';\n\
  var rootAnimateController = {running:true};\n\
\n\
  this.$get = ['$animation', '$window', '$sniffer', '$rootElement', '$rootScope',\n\
      function($animation, $window, $sniffer, $rootElement, $rootScope) {\n\
    $rootElement.data(NG_ANIMATE_CONTROLLER, rootAnimateController);\n\
\n\
    /**\n\
     * @ngdoc function\n\
     * @name ng.$animator\n\
     * @function\n\
     *\n\
     * @description\n\
     * The $animator.create service provides the DOM manipulation API which is decorated with animations.\n\
     *\n\
     * @param {Scope} scope the scope for the ng-animate.\n\
     * @param {Attributes} attr the attributes object which contains the ngAnimate key / value pair. (The attributes are\n\
     *        passed into the linking function of the directive using the `$animator`.)\n\
     * @return {object} the animator object which contains the enter, leave, move, show, hide and animate methods.\n\
     */\n\
     var AnimatorService = function(scope, attrs) {\n\
        var animator = {};\n\
  \n\
        /**\n\
         * @ngdoc function\n\
         * @name ng.animator#enter\n\
         * @methodOf ng.$animator\n\
         * @function\n\
         *\n\
         * @description\n\
         * Injects the element object into the DOM (inside of the parent element) and then runs the enter animation.\n\
         *\n\
         * @param {jQuery/jqLite element} element the element that will be the focus of the enter animation\n\
         * @param {jQuery/jqLite element} parent the parent element of the element that will be the focus of the enter animation\n\
         * @param {jQuery/jqLite element} after the sibling element (which is the previous element) of the element that will be the focus of the enter animation\n\
        */\n\
        animator.enter = animateActionFactory('enter', insert, noop);\n\
  \n\
        /**\n\
         * @ngdoc function\n\
         * @name ng.animator#leave\n\
         * @methodOf ng.$animator\n\
         * @function\n\
         *\n\
         * @description\n\
         * Runs the leave animation operation and, upon completion, removes the element from the DOM.\n\
         *\n\
         * @param {jQuery/jqLite element} element the element that will be the focus of the leave animation\n\
         * @param {jQuery/jqLite element} parent the parent element of the element that will be the focus of the leave animation\n\
        */\n\
        animator.leave = animateActionFactory('leave', noop, remove);\n\
  \n\
        /**\n\
         * @ngdoc function\n\
         * @name ng.animator#move\n\
         * @methodOf ng.$animator\n\
         * @function\n\
         *\n\
         * @description\n\
         * Fires the move DOM operation. Just before the animation starts, the animator will either append it into the parent container or\n\
         * add the element directly after the after element if present. Then the move animation will be run.\n\
         *\n\
         * @param {jQuery/jqLite element} element the element that will be the focus of the move animation\n\
         * @param {jQuery/jqLite element} parent the parent element of the element that will be the focus of the move animation\n\
         * @param {jQuery/jqLite element} after the sibling element (which is the previous element) of the element that will be the focus of the move animation\n\
        */\n\
        animator.move = animateActionFactory('move', move, noop);\n\
  \n\
        /**\n\
         * @ngdoc function\n\
         * @name ng.animator#show\n\
         * @methodOf ng.$animator\n\
         * @function\n\
         *\n\
         * @description\n\
         * Reveals the element by setting the CSS property `display` to `block` and then starts the show animation directly after.\n\
         *\n\
         * @param {jQuery/jqLite element} element the element that will be rendered visible or hidden\n\
        */\n\
        animator.show = animateActionFactory('show', show, noop);\n\
  \n\
        /**\n\
         * @ngdoc function\n\
         * @name ng.animator#hide\n\
         * @methodOf ng.$animator\n\
         *\n\
         * @description\n\
         * Starts the hide animation first and sets the CSS `display` property to `none` upon completion.\n\
         *\n\
         * @param {jQuery/jqLite element} element the element that will be rendered visible or hidden\n\
        */\n\
        animator.hide = animateActionFactory('hide', noop, hide);\n\
\n\
        /**\n\
         * @ngdoc function\n\
         * @name ng.animator#animate\n\
         * @methodOf ng.$animator\n\
         *\n\
         * @description\n\
         * Triggers a custom animation event to be executed on the given element\n\
         *\n\
         * @param {jQuery/jqLite element} element that will be animated\n\
        */\n\
        animator.animate = function(event, element) {\n\
          animateActionFactory(event, noop, noop)(element);\n\
        }\n\
        return animator;\n\
  \n\
        function animateActionFactory(type, beforeFn, afterFn) {\n\
          return function(element, parent, after) {\n\
            var ngAnimateValue = scope.$eval(attrs.ngAnimate);\n\
            var className = ngAnimateValue\n\
                ? isObject(ngAnimateValue) ? ngAnimateValue[type] : ngAnimateValue + '-' + type\n\
                : '';\n\
            var animationPolyfill = $animation(className);\n\
            var polyfillSetup = animationPolyfill && animationPolyfill.setup;\n\
            var polyfillStart = animationPolyfill && animationPolyfill.start;\n\
            var polyfillCancel = animationPolyfill && animationPolyfill.cancel;\n\
\n\
            if (!className) {\n\
              beforeFn(element, parent, after);\n\
              afterFn(element, parent, after);\n\
            } else {\n\
              var activeClassName = className + '-active';\n\
\n\
              if (!parent) {\n\
                parent = after ? after.parent() : element.parent();\n\
              }\n\
              if ((!$sniffer.transitions && !polyfillSetup && !polyfillStart) ||\n\
                  (parent.inheritedData(NG_ANIMATE_CONTROLLER) || noop).running) {\n\
                beforeFn(element, parent, after);\n\
                afterFn(element, parent, after);\n\
                return;\n\
              }\n\
\n\
              var animationData = element.data(NG_ANIMATE_CONTROLLER) || {};\n\
              if(animationData.running) {\n\
                (polyfillCancel || noop)(element);\n\
                animationData.done();\n\
              }\n\
\n\
              element.data(NG_ANIMATE_CONTROLLER, {running:true, done:done});\n\
              element.addClass(className);\n\
              beforeFn(element, parent, after);\n\
              if (element.length == 0) return done();\n\
\n\
              var memento = (polyfillSetup || noop)(element);\n\
\n\
              // $window.setTimeout(beginAnimation, 0); this was causing the element not to animate\n\
              // keep at 1 for animation dom rerender\n\
              $window.setTimeout(beginAnimation, 1);\n\
            }\n\
\n\
            function parseMaxTime(str) {\n\
              var total = 0, values = isString(str) ? str.split(/\\s*,\\s*/) : [];\n\
              forEach(values, function(value) {\n\
                total = Math.max(parseFloat(value) || 0, total);\n\
              });\n\
              return total;\n\
            }\n\
\n\
            function beginAnimation() {\n\
              element.addClass(activeClassName);\n\
              if (polyfillStart) {\n\
                polyfillStart(element, done, memento);\n\
              } else if (isFunction($window.getComputedStyle)) {\n\
                //one day all browsers will have these properties\n\
                var w3cAnimationProp = 'animation'; \n\
                var w3cTransitionProp = 'transition';\n\
\n\
                //but some still use vendor-prefixed styles \n\
                var vendorAnimationProp = $sniffer.vendorPrefix + 'Animation';\n\
                var vendorTransitionProp = $sniffer.vendorPrefix + 'Transition';\n\
\n\
                var durationKey = 'Duration',\n\
                    delayKey = 'Delay',\n\
                    animationIterationCountKey = 'IterationCount',\n\
                    duration = 0;\n\
                \n\
                //we want all the styles defined before and after\n\
                var ELEMENT_NODE = 1;\n\
                forEach(element, function(element) {\n\
                  if (element.nodeType == ELEMENT_NODE) {\n\
                    var w3cProp = w3cTransitionProp,\n\
                        vendorProp = vendorTransitionProp,\n\
                        iterations = 1,\n\
                        elementStyles = $window.getComputedStyle(element) || {};\n\
\n\
                    //use CSS Animations over CSS Transitions\n\
                    if(parseFloat(elementStyles[w3cAnimationProp + durationKey]) > 0 ||\n\
                       parseFloat(elementStyles[vendorAnimationProp + durationKey]) > 0) {\n\
                      w3cProp = w3cAnimationProp;\n\
                      vendorProp = vendorAnimationProp;\n\
                      iterations = Math.max(parseInt(elementStyles[w3cProp    + animationIterationCountKey]) || 0,\n\
                                            parseInt(elementStyles[vendorProp + animationIterationCountKey]) || 0,\n\
                                            iterations);\n\
                    }\n\
\n\
                    var parsedDelay     = Math.max(parseMaxTime(elementStyles[w3cProp     + delayKey]),\n\
                                                   parseMaxTime(elementStyles[vendorProp  + delayKey]));\n\
\n\
                    var parsedDuration  = Math.max(parseMaxTime(elementStyles[w3cProp     + durationKey]),\n\
                                                   parseMaxTime(elementStyles[vendorProp  + durationKey]));\n\
\n\
                    duration = Math.max(parsedDelay + (iterations * parsedDuration), duration);\n\
                  }\n\
                });\n\
                $window.setTimeout(done, duration * 1000);\n\
              } else {\n\
                done();\n\
              }\n\
            }\n\
\n\
            function done() {\n\
              if(!done.run) {\n\
                done.run = true;\n\
                afterFn(element, parent, after);\n\
                element.removeClass(className);\n\
                element.removeClass(activeClassName);\n\
                element.removeData(NG_ANIMATE_CONTROLLER);\n\
              }\n\
            }\n\
          };\n\
        }\n\
  \n\
        function show(element) {\n\
          element.css('display', '');\n\
        }\n\
  \n\
        function hide(element) {\n\
          element.css('display', 'none');\n\
        }\n\
  \n\
        function insert(element, parent, after) {\n\
          if (after) {\n\
            after.after(element);\n\
          } else {\n\
            parent.append(element);\n\
          }\n\
        }\n\
  \n\
        function remove(element) {\n\
          element.remove();\n\
        }\n\
  \n\
        function move(element, parent, after) {\n\
          // Do not remove element before insert. Removing will cause data associated with the\n\
          // element to be dropped. Insert will implicitly do the remove.\n\
          insert(element, parent, after);\n\
        }\n\
      };\n\
\n\
    /**\n\
     * @ngdoc function\n\
     * @name ng.animator#enabled\n\
     * @methodOf ng.$animator\n\
     * @function\n\
     *\n\
     * @param {Boolean=} If provided then set the animation on or off.\n\
     * @return {Boolean} Current animation state.\n\
     *\n\
     * @description\n\
     * Globally enables/disables animations.\n\
     *\n\
    */\n\
    AnimatorService.enabled = function(value) {\n\
      if (arguments.length) {\n\
        rootAnimateController.running = !value;\n\
      }\n\
      return !rootAnimateController.running;\n\
    };\n\
\n\
    return AnimatorService;\n\
  }];\n\
};\n\
\n\
/**\n\
 * ! This is a private undocumented service !\n\
 *\n\
 * @name ng.$browser\n\
 * @requires $log\n\
 * @description\n\
 * This object has two goals:\n\
 *\n\
 * - hide all the global state in the browser caused by the window object\n\
 * - abstract away all the browser specific features and inconsistencies\n\
 *\n\
 * For tests we provide {@link ngMock.$browser mock implementation} of the `$browser`\n\
 * service, which can be used for convenient testing of the application without the interaction with\n\
 * the real browser apis.\n\
 */\n\
/**\n\
 * @param {object} window The global window object.\n\
 * @param {object} document jQuery wrapped document.\n\
 * @param {function()} XHR XMLHttpRequest constructor.\n\
 * @param {object} $log console.log or an object with the same interface.\n\
 * @param {object} $sniffer $sniffer service\n\
 */\n\
function Browser(window, document, $log, $sniffer) {\n\
  var self = this,\n\
      rawDocument = document[0],\n\
      location = window.location,\n\
      history = window.history,\n\
      setTimeout = window.setTimeout,\n\
      clearTimeout = window.clearTimeout,\n\
      pendingDeferIds = {};\n\
\n\
  self.isMock = false;\n\
\n\
  var outstandingRequestCount = 0;\n\
  var outstandingRequestCallbacks = [];\n\
\n\
  // TODO(vojta): remove this temporary api\n\
  self.$$completeOutstandingRequest = completeOutstandingRequest;\n\
  self.$$incOutstandingRequestCount = function() { outstandingRequestCount++; };\n\
\n\
  /**\n\
   * Executes the `fn` function(supports currying) and decrements the `outstandingRequestCallbacks`\n\
   * counter. If the counter reaches 0, all the `outstandingRequestCallbacks` are executed.\n\
   */\n\
  function completeOutstandingRequest(fn) {\n\
    try {\n\
      fn.apply(null, sliceArgs(arguments, 1));\n\
    } finally {\n\
      outstandingRequestCount--;\n\
      if (outstandingRequestCount === 0) {\n\
        while(outstandingRequestCallbacks.length) {\n\
          try {\n\
            outstandingRequestCallbacks.pop()();\n\
          } catch (e) {\n\
            $log.error(e);\n\
          }\n\
        }\n\
      }\n\
    }\n\
  }\n\
\n\
  /**\n\
   * @private\n\
   * Note: this method is used only by scenario runner\n\
   * TODO(vojta): prefix this method with $$ ?\n\
   * @param {function()} callback Function that will be called when no outstanding request\n\
   */\n\
  self.notifyWhenNoOutstandingRequests = function(callback) {\n\
    // force browser to execute all pollFns - this is needed so that cookies and other pollers fire\n\
    // at some deterministic time in respect to the test runner's actions. Leaving things up to the\n\
    // regular poller would result in flaky tests.\n\
    forEach(pollFns, function(pollFn){ pollFn(); });\n\
\n\
    if (outstandingRequestCount === 0) {\n\
      callback();\n\
    } else {\n\
      outstandingRequestCallbacks.push(callback);\n\
    }\n\
  };\n\
\n\
  //////////////////////////////////////////////////////////////\n\
  // Poll Watcher API\n\
  //////////////////////////////////////////////////////////////\n\
  var pollFns = [],\n\
      pollTimeout;\n\
\n\
  /**\n\
   * @name ng.$browser#addPollFn\n\
   * @methodOf ng.$browser\n\
   *\n\
   * @param {function()} fn Poll function to add\n\
   *\n\
   * @description\n\
   * Adds a function to the list of functions that poller periodically executes,\n\
   * and starts polling if not started yet.\n\
   *\n\
   * @returns {function()} the added function\n\
   */\n\
  self.addPollFn = function(fn) {\n\
    if (isUndefined(pollTimeout)) startPoller(100, setTimeout);\n\
    pollFns.push(fn);\n\
    return fn;\n\
  };\n\
\n\
  /**\n\
   * @param {number} interval How often should browser call poll functions (ms)\n\
   * @param {function()} setTimeout Reference to a real or fake `setTimeout` function.\n\
   *\n\
   * @description\n\
   * Configures the poller to run in the specified intervals, using the specified\n\
   * setTimeout fn and kicks it off.\n\
   */\n\
  function startPoller(interval, setTimeout) {\n\
    (function check() {\n\
      forEach(pollFns, function(pollFn){ pollFn(); });\n\
      pollTimeout = setTimeout(check, interval);\n\
    })();\n\
  }\n\
\n\
  //////////////////////////////////////////////////////////////\n\
  // URL API\n\
  //////////////////////////////////////////////////////////////\n\
\n\
  var lastBrowserUrl = location.href,\n\
      baseElement = document.find('base');\n\
\n\
  /**\n\
   * @name ng.$browser#url\n\
   * @methodOf ng.$browser\n\
   *\n\
   * @description\n\
   * GETTER:\n\
   * Without any argument, this method just returns current value of location.href.\n\
   *\n\
   * SETTER:\n\
   * With at least one argument, this method sets url to new value.\n\
   * If html5 history api supported, pushState/replaceState is used, otherwise\n\
   * location.href/location.replace is used.\n\
   * Returns its own instance to allow chaining\n\
   *\n\
   * NOTE: this api is intended for use only by the $location service. Please use the\n\
   * {@link ng.$location $location service} to change url.\n\
   *\n\
   * @param {string} url New url (when used as setter)\n\
   * @param {boolean=} replace Should new url replace current history record ?\n\
   */\n\
  self.url = function(url, replace) {\n\
    // setter\n\
    if (url) {\n\
      if (lastBrowserUrl == url) return;\n\
      lastBrowserUrl = url;\n\
      if ($sniffer.history) {\n\
        if (replace) history.replaceState(null, '', url);\n\
        else {\n\
          history.pushState(null, '', url);\n\
          // Crazy Opera Bug: http://my.opera.com/community/forums/topic.dml?id=1185462\n\
          baseElement.attr('href', baseElement.attr('href'));\n\
        }\n\
      } else {\n\
        if (replace) location.replace(url);\n\
        else location.href = url;\n\
      }\n\
      return self;\n\
    // getter\n\
    } else {\n\
      // the replacement is a workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=407172\n\
      return location.href.replace(/%27/g,\"'\");\n\
    }\n\
  };\n\
\n\
  var urlChangeListeners = [],\n\
      urlChangeInit = false;\n\
\n\
  function fireUrlChange() {\n\
    if (lastBrowserUrl == self.url()) return;\n\
\n\
    lastBrowserUrl = self.url();\n\
    forEach(urlChangeListeners, function(listener) {\n\
      listener(self.url());\n\
    });\n\
  }\n\
\n\
  /**\n\
   * @name ng.$browser#onUrlChange\n\
   * @methodOf ng.$browser\n\
   * @TODO(vojta): refactor to use node's syntax for events\n\
   *\n\
   * @description\n\
   * Register callback function that will be called, when url changes.\n\
   *\n\
   * It's only called when the url is changed by outside of angular:\n\
   * - user types different url into address bar\n\
   * - user clicks on history (forward/back) button\n\
   * - user clicks on a link\n\
   *\n\
   * It's not called when url is changed by $browser.url() method\n\
   *\n\
   * The listener gets called with new url as parameter.\n\
   *\n\
   * NOTE: this api is intended for use only by the $location service. Please use the\n\
   * {@link ng.$location $location service} to monitor url changes in angular apps.\n\
   *\n\
   * @param {function(string)} listener Listener function to be called when url changes.\n\
   * @return {function(string)} Returns the registered listener fn - handy if the fn is anonymous.\n\
   */\n\
  self.onUrlChange = function(callback) {\n\
    if (!urlChangeInit) {\n\
      // We listen on both (hashchange/popstate) when available, as some browsers (e.g. Opera)\n\
      // don't fire popstate when user change the address bar and don't fire hashchange when url\n\
      // changed by push/replaceState\n\
\n\
      // html5 history api - popstate event\n\
      if ($sniffer.history) jqLite(window).bind('popstate', fireUrlChange);\n\
      // hashchange event\n\
      if ($sniffer.hashchange) jqLite(window).bind('hashchange', fireUrlChange);\n\
      // polling\n\
      else self.addPollFn(fireUrlChange);\n\
\n\
      urlChangeInit = true;\n\
    }\n\
\n\
    urlChangeListeners.push(callback);\n\
    return callback;\n\
  };\n\
\n\
  //////////////////////////////////////////////////////////////\n\
  // Misc API\n\
  //////////////////////////////////////////////////////////////\n\
\n\
  /**\n\
   * Returns current <base href>\n\
   * (always relative - without domain)\n\
   *\n\
   * @returns {string=}\n\
   */\n\
  self.baseHref = function() {\n\
    var href = baseElement.attr('href');\n\
    return href ? href.replace(/^https?\\:\\/\\/[^\\/]*/, '') : '';\n\
  };\n\
\n\
  //////////////////////////////////////////////////////////////\n\
  // Cookies API\n\
  //////////////////////////////////////////////////////////////\n\
  var lastCookies = {};\n\
  var lastCookieString = '';\n\
  var cookiePath = self.baseHref();\n\
\n\
  /**\n\
   * @name ng.$browser#cookies\n\
   * @methodOf ng.$browser\n\
   *\n\
   * @param {string=} name Cookie name\n\
   * @param {string=} value Cookie value\n\
   *\n\
   * @description\n\
   * The cookies method provides a 'private' low level access to browser cookies.\n\
   * It is not meant to be used directly, use the $cookie service instead.\n\
   *\n\
   * The return values vary depending on the arguments that the method was called with as follows:\n\
   * <ul>\n\
   *   <li>cookies() -> hash of all cookies, this is NOT a copy of the internal state, so do not modify it</li>\n\
   *   <li>cookies(name, value) -> set name to value, if value is undefined delete the cookie</li>\n\
   *   <li>cookies(name) -> the same as (name, undefined) == DELETES (no one calls it right now that way)</li>\n\
   * </ul>\n\
   *\n\
   * @returns {Object} Hash of all cookies (if called without any parameter)\n\
   */\n\
  self.cookies = function(name, value) {\n\
    var cookieLength, cookieArray, cookie, i, index;\n\
\n\
    if (name) {\n\
      if (value === undefined) {\n\
        rawDocument.cookie = escape(name) + \"=;path=\" + cookiePath + \";expires=Thu, 01 Jan 1970 00:00:00 GMT\";\n\
      } else {\n\
        if (isString(value)) {\n\
          cookieLength = (rawDocument.cookie = escape(name) + '=' + escape(value) + ';path=' + cookiePath).length + 1;\n\
\n\
          // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:\n\
          // - 300 cookies\n\
          // - 20 cookies per unique domain\n\
          // - 4096 bytes per cookie\n\
          if (cookieLength > 4096) {\n\
            $log.warn(\"Cookie '\"+ name +\"' possibly not set or overflowed because it was too large (\"+\n\
              cookieLength + \" > 4096 bytes)!\");\n\
          }\n\
        }\n\
      }\n\
    } else {\n\
      if (rawDocument.cookie !== lastCookieString) {\n\
        lastCookieString = rawDocument.cookie;\n\
        cookieArray = lastCookieString.split(\"; \");\n\
        lastCookies = {};\n\
\n\
        for (i = 0; i < cookieArray.length; i++) {\n\
          cookie = cookieArray[i];\n\
          index = cookie.indexOf('=');\n\
          if (index > 0) { //ignore nameless cookies\n\
            var name = unescape(cookie.substring(0, index));\n\
            // the first value that is seen for a cookie is the most\n\
            // specific one.  values for the same cookie name that\n\
            // follow are for less specific paths.\n\
            if (lastCookies[name] === undefined) {\n\
              lastCookies[name] = unescape(cookie.substring(index + 1));\n\
            }\n\
          }\n\
        }\n\
      }\n\
      return lastCookies;\n\
    }\n\
  };\n\
\n\
\n\
  /**\n\
   * @name ng.$browser#defer\n\
   * @methodOf ng.$browser\n\
   * @param {function()} fn A function, who's execution should be defered.\n\
   * @param {number=} [delay=0] of milliseconds to defer the function execution.\n\
   * @returns {*} DeferId that can be used to cancel the task via `$browser.defer.cancel()`.\n\
   *\n\
   * @description\n\
   * Executes a fn asynchronously via `setTimeout(fn, delay)`.\n\
   *\n\
   * Unlike when calling `setTimeout` directly, in test this function is mocked and instead of using\n\
   * `setTimeout` in tests, the fns are queued in an array, which can be programmatically flushed\n\
   * via `$browser.defer.flush()`.\n\
   *\n\
   */\n\
  self.defer = function(fn, delay) {\n\
    var timeoutId;\n\
    outstandingRequestCount++;\n\
    timeoutId = setTimeout(function() {\n\
      delete pendingDeferIds[timeoutId];\n\
      completeOutstandingRequest(fn);\n\
    }, delay || 0);\n\
    pendingDeferIds[timeoutId] = true;\n\
    return timeoutId;\n\
  };\n\
\n\
\n\
  /**\n\
   * @name ng.$browser#defer.cancel\n\
   * @methodOf ng.$browser.defer\n\
   *\n\
   * @description\n\
   * Cancels a defered task identified with `deferId`.\n\
   *\n\
   * @param {*} deferId Token returned by the `$browser.defer` function.\n\
   * @returns {boolean} Returns `true` if the task hasn't executed yet and was successfully canceled.\n\
   */\n\
  self.defer.cancel = function(deferId) {\n\
    if (pendingDeferIds[deferId]) {\n\
      delete pendingDeferIds[deferId];\n\
      clearTimeout(deferId);\n\
      completeOutstandingRequest(noop);\n\
      return true;\n\
    }\n\
    return false;\n\
  };\n\
\n\
}\n\
\n\
function $BrowserProvider(){\n\
  this.$get = ['$window', '$log', '$sniffer', '$document',\n\
      function( $window,   $log,   $sniffer,   $document){\n\
        return new Browser($window, $document, $log, $sniffer);\n\
      }];\n\
}\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.$cacheFactory\n\
 *\n\
 * @description\n\
 * Factory that constructs cache objects.\n\
 *\n\
 *\n\
 * @param {string} cacheId Name or id of the newly created cache.\n\
 * @param {object=} options Options object that specifies the cache behavior. Properties:\n\
 *\n\
 *   - `{number=}` `capacity` â€” turns the cache into LRU cache.\n\
 *\n\
 * @returns {object} Newly created cache object with the following set of methods:\n\
 *\n\
 * - `{object}` `info()` â€” Returns id, size, and options of cache.\n\
 * - `{{*}}` `put({string} key, {*} value)` â€” Puts a new key-value pair into the cache and returns it.\n\
 * - `{{*}}` `get({string} key)` â€” Returns cached value for `key` or undefined for cache miss.\n\
 * - `{void}` `remove({string} key)` â€” Removes a key-value pair from the cache.\n\
 * - `{void}` `removeAll()` â€” Removes all cached values.\n\
 * - `{void}` `destroy()` â€” Removes references to this cache from $cacheFactory.\n\
 *\n\
 */\n\
function $CacheFactoryProvider() {\n\
\n\
  this.$get = function() {\n\
    var caches = {};\n\
\n\
    function cacheFactory(cacheId, options) {\n\
      if (cacheId in caches) {\n\
        throw Error('cacheId ' + cacheId + ' taken');\n\
      }\n\
\n\
      var size = 0,\n\
          stats = extend({}, options, {id: cacheId}),\n\
          data = {},\n\
          capacity = (options && options.capacity) || Number.MAX_VALUE,\n\
          lruHash = {},\n\
          freshEnd = null,\n\
          staleEnd = null;\n\
\n\
      return caches[cacheId] = {\n\
\n\
        put: function(key, value) {\n\
          var lruEntry = lruHash[key] || (lruHash[key] = {key: key});\n\
\n\
          refresh(lruEntry);\n\
\n\
          if (isUndefined(value)) return;\n\
          if (!(key in data)) size++;\n\
          data[key] = value;\n\
\n\
          if (size > capacity) {\n\
            this.remove(staleEnd.key);\n\
          }\n\
\n\
          return value;\n\
        },\n\
\n\
\n\
        get: function(key) {\n\
          var lruEntry = lruHash[key];\n\
\n\
          if (!lruEntry) return;\n\
\n\
          refresh(lruEntry);\n\
\n\
          return data[key];\n\
        },\n\
\n\
\n\
        remove: function(key) {\n\
          var lruEntry = lruHash[key];\n\
\n\
          if (!lruEntry) return;\n\
\n\
          if (lruEntry == freshEnd) freshEnd = lruEntry.p;\n\
          if (lruEntry == staleEnd) staleEnd = lruEntry.n;\n\
          link(lruEntry.n,lruEntry.p);\n\
\n\
          delete lruHash[key];\n\
          delete data[key];\n\
          size--;\n\
        },\n\
\n\
\n\
        removeAll: function() {\n\
          data = {};\n\
          size = 0;\n\
          lruHash = {};\n\
          freshEnd = staleEnd = null;\n\
        },\n\
\n\
\n\
        destroy: function() {\n\
          data = null;\n\
          stats = null;\n\
          lruHash = null;\n\
          delete caches[cacheId];\n\
        },\n\
\n\
\n\
        info: function() {\n\
          return extend({}, stats, {size: size});\n\
        }\n\
      };\n\
\n\
\n\
      /**\n\
       * makes the `entry` the freshEnd of the LRU linked list\n\
       */\n\
      function refresh(entry) {\n\
        if (entry != freshEnd) {\n\
          if (!staleEnd) {\n\
            staleEnd = entry;\n\
          } else if (staleEnd == entry) {\n\
            staleEnd = entry.n;\n\
          }\n\
\n\
          link(entry.n, entry.p);\n\
          link(entry, freshEnd);\n\
          freshEnd = entry;\n\
          freshEnd.n = null;\n\
        }\n\
      }\n\
\n\
\n\
      /**\n\
       * bidirectionally links two entries of the LRU linked list\n\
       */\n\
      function link(nextEntry, prevEntry) {\n\
        if (nextEntry != prevEntry) {\n\
          if (nextEntry) nextEntry.p = prevEntry; //p stands for previous, 'prev' didn't minify\n\
          if (prevEntry) prevEntry.n = nextEntry; //n stands for next, 'next' didn't minify\n\
        }\n\
      }\n\
    }\n\
\n\
\n\
    cacheFactory.info = function() {\n\
      var info = {};\n\
      forEach(caches, function(cache, cacheId) {\n\
        info[cacheId] = cache.info();\n\
      });\n\
      return info;\n\
    };\n\
\n\
\n\
    cacheFactory.get = function(cacheId) {\n\
      return caches[cacheId];\n\
    };\n\
\n\
\n\
    return cacheFactory;\n\
  };\n\
}\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.$templateCache\n\
 *\n\
 * @description\n\
 * Cache used for storing html templates.\n\
 *\n\
 * See {@link ng.$cacheFactory $cacheFactory}.\n\
 *\n\
 */\n\
function $TemplateCacheProvider() {\n\
  this.$get = ['$cacheFactory', function($cacheFactory) {\n\
    return $cacheFactory('templates');\n\
  }];\n\
}\n\
\n\
/* ! VARIABLE/FUNCTION NAMING CONVENTIONS THAT APPLY TO THIS FILE!\n\
 *\n\
 * DOM-related variables:\n\
 *\n\
 * - \"node\" - DOM Node\n\
 * - \"element\" - DOM Element or Node\n\
 * - \"$node\" or \"$element\" - jqLite-wrapped node or element\n\
 *\n\
 *\n\
 * Compiler related stuff:\n\
 *\n\
 * - \"linkFn\" - linking fn of a single directive\n\
 * - \"nodeLinkFn\" - function that aggregates all linking fns for a particular node\n\
 * - \"childLinkFn\" -  function that aggregates all linking fns for child nodes of a particular node\n\
 * - \"compositeLinkFn\" - function that aggregates all linking fns for a compilation root (nodeList)\n\
 */\n\
\n\
\n\
var NON_ASSIGNABLE_MODEL_EXPRESSION = 'Non-assignable model expression: ';\n\
\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name ng.$compile\n\
 * @function\n\
 *\n\
 * @description\n\
 * Compiles a piece of HTML string or DOM into a template and produces a template function, which\n\
 * can then be used to link {@link ng.$rootScope.Scope scope} and the template together.\n\
 *\n\
 * The compilation is a process of walking the DOM tree and trying to match DOM elements to\n\
 * {@link ng.$compileProvider#directive directives}. For each match it\n\
 * executes corresponding template function and collects the\n\
 * instance functions into a single template function which is then returned.\n\
 *\n\
 * The template function can then be used once to produce the view or as it is the case with\n\
 * {@link ng.directive:ngRepeat repeater} many-times, in which\n\
 * case each call results in a view that is a DOM clone of the original template.\n\
 *\n\
 <doc:example module=\"compile\">\n\
   <doc:source>\n\
    <script>\n\
      // declare a new module, and inject the $compileProvider\n\
      angular.module('compile', [], function($compileProvider) {\n\
        // configure new 'compile' directive by passing a directive\n\
        // factory function. The factory function injects the '$compile'\n\
        $compileProvider.directive('compile', function($compile) {\n\
          // directive factory creates a link function\n\
          return function(scope, element, attrs) {\n\
            scope.$watch(\n\
              function(scope) {\n\
                 // watch the 'compile' expression for changes\n\
                return scope.$eval(attrs.compile);\n\
              },\n\
              function(value) {\n\
                // when the 'compile' expression changes\n\
                // assign it into the current DOM\n\
                element.html(value);\n\
\n\
                // compile the new DOM and link it to the current\n\
                // scope.\n\
                // NOTE: we only compile .childNodes so that\n\
                // we don't get into infinite loop compiling ourselves\n\
                $compile(element.contents())(scope);\n\
              }\n\
            );\n\
          };\n\
        })\n\
      });\n\
\n\
      function Ctrl($scope) {\n\
        $scope.name = 'Angular';\n\
        $scope.html = 'Hello {{name}}';\n\
      }\n\
    </script>\n\
    <div ng-controller=\"Ctrl\">\n\
      <input ng-model=\"name\"> <br>\n\
      <textarea ng-model=\"html\"></textarea> <br>\n\
      <div compile=\"html\"></div>\n\
    </div>\n\
   </doc:source>\n\
   <doc:scenario>\n\
     it('should auto compile', function() {\n\
       expect(element('div[compile]').text()).toBe('Hello Angular');\n\
       input('html').enter('{{name}}!');\n\
       expect(element('div[compile]').text()).toBe('Angular!');\n\
     });\n\
   </doc:scenario>\n\
 </doc:example>\n\
\n\
 *\n\
 *\n\
 * @param {string|DOMElement} element Element or HTML string to compile into a template function.\n\
 * @param {function(angular.Scope[, cloneAttachFn]} transclude function available to directives.\n\
 * @param {number} maxPriority only apply directives lower then given priority (Only effects the\n\
 *                 root element(s), not their children)\n\
 * @returns {function(scope[, cloneAttachFn])} a link function which is used to bind template\n\
 * (a DOM element/tree) to a scope. Where:\n\
 *\n\
 *  * `scope` - A {@link ng.$rootScope.Scope Scope} to bind to.\n\
 *  * `cloneAttachFn` - If `cloneAttachFn` is provided, then the link function will clone the\n\
 *               `template` and call the `cloneAttachFn` function allowing the caller to attach the\n\
 *               cloned elements to the DOM document at the appropriate place. The `cloneAttachFn` is\n\
 *               called as: <br> `cloneAttachFn(clonedElement, scope)` where:\n\
 *\n\
 *      * `clonedElement` - is a clone of the original `element` passed into the compiler.\n\
 *      * `scope` - is the current scope with which the linking function is working with.\n\
 *\n\
 * Calling the linking function returns the element of the template. It is either the original element\n\
 * passed in, or the clone of the element if the `cloneAttachFn` is provided.\n\
 *\n\
 * After linking the view is not updated until after a call to $digest which typically is done by\n\
 * Angular automatically.\n\
 *\n\
 * If you need access to the bound view, there are two ways to do it:\n\
 *\n\
 * - If you are not asking the linking function to clone the template, create the DOM element(s)\n\
 *   before you send them to the compiler and keep this reference around.\n\
 *   <pre>\n\
 *     var element = $compile('<p>{{total}}</p>')(scope);\n\
 *   </pre>\n\
 *\n\
 * - if on the other hand, you need the element to be cloned, the view reference from the original\n\
 *   example would not point to the clone, but rather to the original template that was cloned. In\n\
 *   this case, you can access the clone via the cloneAttachFn:\n\
 *   <pre>\n\
 *     var templateHTML = angular.element('<p>{{total}}</p>'),\n\
 *         scope = ....;\n\
 *\n\
 *     var clonedElement = $compile(templateHTML)(scope, function(clonedElement, scope) {\n\
 *       //attach the clone to DOM document at the right place\n\
 *     });\n\
 *\n\
 *     //now we have reference to the cloned DOM via `clone`\n\
 *   </pre>\n\
 *\n\
 *\n\
 * For information on how the compiler works, see the\n\
 * {@link guide/compiler Angular HTML Compiler} section of the Developer Guide.\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc service\n\
 * @name ng.$compileProvider\n\
 * @function\n\
 *\n\
 * @description\n\
 */\n\
$CompileProvider.$inject = ['$provide'];\n\
function $CompileProvider($provide) {\n\
  var hasDirectives = {},\n\
      Suffix = 'Directive',\n\
      COMMENT_DIRECTIVE_REGEXP = /^\\s*directive\\:\\s*([\\d\\w\\-_]+)\\s+(.*)$/,\n\
      CLASS_DIRECTIVE_REGEXP = /(([\\d\\w\\-_]+)(?:\\:([^;]+))?;?)/,\n\
      MULTI_ROOT_TEMPLATE_ERROR = 'Template must have exactly one root element. was: ',\n\
      urlSanitizationWhitelist = /^\\s*(https?|ftp|mailto|file):/;\n\
\n\
\n\
  /**\n\
   * @ngdoc function\n\
   * @name ng.$compileProvider#directive\n\
   * @methodOf ng.$compileProvider\n\
   * @function\n\
   *\n\
   * @description\n\
   * Register a new directives with the compiler.\n\
   *\n\
   * @param {string} name Name of the directive in camel-case. (ie <code>ngBind</code> which will match as\n\
   *                <code>ng-bind</code>).\n\
   * @param {function} directiveFactory An injectable directive factory function. See {@link guide/directive} for more\n\
   *                info.\n\
   * @returns {ng.$compileProvider} Self for chaining.\n\
   */\n\
   this.directive = function registerDirective(name, directiveFactory) {\n\
    if (isString(name)) {\n\
      assertArg(directiveFactory, 'directive');\n\
      if (!hasDirectives.hasOwnProperty(name)) {\n\
        hasDirectives[name] = [];\n\
        $provide.factory(name + Suffix, ['$injector', '$exceptionHandler',\n\
          function($injector, $exceptionHandler) {\n\
            var directives = [];\n\
            forEach(hasDirectives[name], function(directiveFactory) {\n\
              try {\n\
                var directive = $injector.invoke(directiveFactory);\n\
                if (isFunction(directive)) {\n\
                  directive = { compile: valueFn(directive) };\n\
                } else if (!directive.compile && directive.link) {\n\
                  directive.compile = valueFn(directive.link);\n\
                }\n\
                directive.priority = directive.priority || 0;\n\
                directive.name = directive.name || name;\n\
                directive.require = directive.require || (directive.controller && directive.name);\n\
                directive.restrict = directive.restrict || 'A';\n\
                directives.push(directive);\n\
              } catch (e) {\n\
                $exceptionHandler(e);\n\
              }\n\
            });\n\
            return directives;\n\
          }]);\n\
      }\n\
      hasDirectives[name].push(directiveFactory);\n\
    } else {\n\
      forEach(name, reverseParams(registerDirective));\n\
    }\n\
    return this;\n\
  };\n\
\n\
\n\
  /**\n\
   * @ngdoc function\n\
   * @name ng.$compileProvider#urlSanitizationWhitelist\n\
   * @methodOf ng.$compileProvider\n\
   * @function\n\
   *\n\
   * @description\n\
   * Retrieves or overrides the default regular expression that is used for whitelisting of safe\n\
   * urls during a[href] sanitization.\n\
   *\n\
   * The sanitization is a security measure aimed at prevent XSS attacks via html links.\n\
   *\n\
   * Any url about to be assigned to a[href] via data-binding is first normalized and turned into an\n\
   * absolute url. Afterwards the url is matched against the `urlSanitizationWhitelist` regular\n\
   * expression. If a match is found the original url is written into the dom. Otherwise the\n\
   * absolute url is prefixed with `'unsafe:'` string and only then it is written into the DOM.\n\
   *\n\
   * @param {RegExp=} regexp New regexp to whitelist urls with.\n\
   * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for\n\
   *    chaining otherwise.\n\
   */\n\
  this.urlSanitizationWhitelist = function(regexp) {\n\
    if (isDefined(regexp)) {\n\
      urlSanitizationWhitelist = regexp;\n\
      return this;\n\
    }\n\
    return urlSanitizationWhitelist;\n\
  };\n\
\n\
\n\
  this.$get = [\n\
            '$injector', '$interpolate', '$exceptionHandler', '$http', '$templateCache', '$parse',\n\
            '$controller', '$rootScope', '$document',\n\
    function($injector,   $interpolate,   $exceptionHandler,   $http,   $templateCache,   $parse,\n\
             $controller,   $rootScope,   $document) {\n\
\n\
    var Attributes = function(element, attr) {\n\
      this.$$element = element;\n\
      this.$attr = attr || {};\n\
    };\n\
\n\
    Attributes.prototype = {\n\
      $normalize: directiveNormalize,\n\
\n\
\n\
      /**\n\
       * Set a normalized attribute on the element in a way such that all directives\n\
       * can share the attribute. This function properly handles boolean attributes.\n\
       * @param {string} key Normalized key. (ie ngAttribute)\n\
       * @param {string|boolean} value The value to set. If `null` attribute will be deleted.\n\
       * @param {boolean=} writeAttr If false, does not write the value to DOM element attribute.\n\
       *     Defaults to true.\n\
       * @param {string=} attrName Optional none normalized name. Defaults to key.\n\
       */\n\
      $set: function(key, value, writeAttr, attrName) {\n\
        var booleanKey = getBooleanAttrName(this.$$element[0], key),\n\
            $$observers = this.$$observers,\n\
            normalizedVal;\n\
\n\
        if (booleanKey) {\n\
          this.$$element.prop(key, value);\n\
          attrName = booleanKey;\n\
        }\n\
\n\
        this[key] = value;\n\
\n\
        // translate normalized key to actual key\n\
        if (attrName) {\n\
          this.$attr[key] = attrName;\n\
        } else {\n\
          attrName = this.$attr[key];\n\
          if (!attrName) {\n\
            this.$attr[key] = attrName = snake_case(key, '-');\n\
          }\n\
        }\n\
\n\
\n\
        // sanitize a[href] values\n\
        if (nodeName_(this.$$element[0]) === 'A' && key === 'href') {\n\
          urlSanitizationNode.setAttribute('href', value);\n\
\n\
          // href property always returns normalized absolute url, so we can match against that\n\
          normalizedVal = urlSanitizationNode.href;\n\
          if (!normalizedVal.match(urlSanitizationWhitelist)) {\n\
            this[key] = value = 'unsafe:' + normalizedVal;\n\
          }\n\
        }\n\
\n\
\n\
        if (writeAttr !== false) {\n\
          if (value === null || value === undefined) {\n\
            this.$$element.removeAttr(attrName);\n\
          } else {\n\
            this.$$element.attr(attrName, value);\n\
          }\n\
        }\n\
\n\
        // fire observers\n\
        $$observers && forEach($$observers[key], function(fn) {\n\
          try {\n\
            fn(value);\n\
          } catch (e) {\n\
            $exceptionHandler(e);\n\
          }\n\
        });\n\
      },\n\
\n\
\n\
      /**\n\
       * Observe an interpolated attribute.\n\
       * The observer will never be called, if given attribute is not interpolated.\n\
       *\n\
       * @param {string} key Normalized key. (ie ngAttribute) .\n\
       * @param {function(*)} fn Function that will be called whenever the attribute value changes.\n\
       * @returns {function(*)} the `fn` Function passed in.\n\
       */\n\
      $observe: function(key, fn) {\n\
        var attrs = this,\n\
            $$observers = (attrs.$$observers || (attrs.$$observers = {})),\n\
            listeners = ($$observers[key] || ($$observers[key] = []));\n\
\n\
        listeners.push(fn);\n\
        $rootScope.$evalAsync(function() {\n\
          if (!listeners.$$inter) {\n\
            // no one registered attribute interpolation function, so lets call it manually\n\
            fn(attrs[key]);\n\
          }\n\
        });\n\
        return fn;\n\
      }\n\
    };\n\
\n\
    var urlSanitizationNode = $document[0].createElement('a'),\n\
        startSymbol = $interpolate.startSymbol(),\n\
        endSymbol = $interpolate.endSymbol(),\n\
        denormalizeTemplate = (startSymbol == '{{' || endSymbol  == '}}')\n\
            ? identity\n\
            : function denormalizeTemplate(template) {\n\
              return template.replace(/\\{\\{/g, startSymbol).replace(/}}/g, endSymbol);\n\
        },\n\
        NG_ATTR_BINDING = /^ngAttr[A-Z]/;\n\
\n\
\n\
    return compile;\n\
\n\
    //================================\n\
\n\
    function compile($compileNodes, transcludeFn, maxPriority) {\n\
      if (!($compileNodes instanceof jqLite)) {\n\
        // jquery always rewraps, whereas we need to preserve the original selector so that we can modify it.\n\
        $compileNodes = jqLite($compileNodes);\n\
      }\n\
      // We can not compile top level text elements since text nodes can be merged and we will\n\
      // not be able to attach scope data to them, so we will wrap them in <span>\n\
      forEach($compileNodes, function(node, index){\n\
        if (node.nodeType == 3 /* text node */ && node.nodeValue.match(/\\S+/) /* non-empty */ ) {\n\
          $compileNodes[index] = jqLite(node).wrap('<span></span>').parent()[0];\n\
        }\n\
      });\n\
      var compositeLinkFn = compileNodes($compileNodes, transcludeFn, $compileNodes, maxPriority);\n\
      return function publicLinkFn(scope, cloneConnectFn){\n\
        assertArg(scope, 'scope');\n\
        // important!!: we must call our jqLite.clone() since the jQuery one is trying to be smart\n\
        // and sometimes changes the structure of the DOM.\n\
        var $linkNode = cloneConnectFn\n\
          ? JQLitePrototype.clone.call($compileNodes) // IMPORTANT!!!\n\
          : $compileNodes;\n\
\n\
        // Attach scope only to non-text nodes.\n\
        for(var i = 0, ii = $linkNode.length; i<ii; i++) {\n\
          var node = $linkNode[i];\n\
          if (node.nodeType == 1 /* element */ || node.nodeType == 9 /* document */) {\n\
            $linkNode.eq(i).data('$scope', scope);\n\
          }\n\
        }\n\
        safeAddClass($linkNode, 'ng-scope');\n\
        if (cloneConnectFn) cloneConnectFn($linkNode, scope);\n\
        if (compositeLinkFn) compositeLinkFn(scope, $linkNode, $linkNode);\n\
        return $linkNode;\n\
      };\n\
    }\n\
\n\
    function wrongMode(localName, mode) {\n\
      throw Error(\"Unsupported '\" + mode + \"' for '\" + localName + \"'.\");\n\
    }\n\
\n\
    function safeAddClass($element, className) {\n\
      try {\n\
        $element.addClass(className);\n\
      } catch(e) {\n\
        // ignore, since it means that we are trying to set class on\n\
        // SVG element, where class name is read-only.\n\
      }\n\
    }\n\
\n\
    /**\n\
     * Compile function matches each node in nodeList against the directives. Once all directives\n\
     * for a particular node are collected their compile functions are executed. The compile\n\
     * functions return values - the linking functions - are combined into a composite linking\n\
     * function, which is the a linking function for the node.\n\
     *\n\
     * @param {NodeList} nodeList an array of nodes or NodeList to compile\n\
     * @param {function(angular.Scope[, cloneAttachFn]} transcludeFn A linking function, where the\n\
     *        scope argument is auto-generated to the new child of the transcluded parent scope.\n\
     * @param {DOMElement=} $rootElement If the nodeList is the root of the compilation tree then the\n\
     *        rootElement must be set the jqLite collection of the compile root. This is\n\
     *        needed so that the jqLite collection items can be replaced with widgets.\n\
     * @param {number=} max directive priority\n\
     * @returns {?function} A composite linking function of all of the matched directives or null.\n\
     */\n\
    function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority) {\n\
      var linkFns = [],\n\
          nodeLinkFn, childLinkFn, directives, attrs, linkFnFound;\n\
\n\
      for(var i = 0; i < nodeList.length; i++) {\n\
        attrs = new Attributes();\n\
\n\
        // we must always refer to nodeList[i] since the nodes can be replaced underneath us.\n\
        directives = collectDirectives(nodeList[i], [], attrs, maxPriority);\n\
\n\
        nodeLinkFn = (directives.length)\n\
            ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, $rootElement)\n\
            : null;\n\
\n\
        childLinkFn = (nodeLinkFn && nodeLinkFn.terminal || !nodeList[i].childNodes || !nodeList[i].childNodes.length)\n\
            ? null\n\
            : compileNodes(nodeList[i].childNodes,\n\
                 nodeLinkFn ? nodeLinkFn.transclude : transcludeFn);\n\
\n\
        linkFns.push(nodeLinkFn);\n\
        linkFns.push(childLinkFn);\n\
        linkFnFound = (linkFnFound || nodeLinkFn || childLinkFn);\n\
      }\n\
\n\
      // return a linking function if we have found anything, null otherwise\n\
      return linkFnFound ? compositeLinkFn : null;\n\
\n\
      function compositeLinkFn(scope, nodeList, $rootElement, boundTranscludeFn) {\n\
        var nodeLinkFn, childLinkFn, node, childScope, childTranscludeFn, i, ii, n;\n\
\n\
        // copy nodeList so that linking doesn't break due to live list updates.\n\
        var stableNodeList = [];\n\
        for (i = 0, ii = nodeList.length; i < ii; i++) {\n\
          stableNodeList.push(nodeList[i]);\n\
        }\n\
\n\
        for(i = 0, n = 0, ii = linkFns.length; i < ii; n++) {\n\
          node = stableNodeList[n];\n\
          nodeLinkFn = linkFns[i++];\n\
          childLinkFn = linkFns[i++];\n\
\n\
          if (nodeLinkFn) {\n\
            if (nodeLinkFn.scope) {\n\
              childScope = scope.$new(isObject(nodeLinkFn.scope));\n\
              jqLite(node).data('$scope', childScope);\n\
            } else {\n\
              childScope = scope;\n\
            }\n\
            childTranscludeFn = nodeLinkFn.transclude;\n\
            if (childTranscludeFn || (!boundTranscludeFn && transcludeFn)) {\n\
              nodeLinkFn(childLinkFn, childScope, node, $rootElement,\n\
                  (function(transcludeFn) {\n\
                    return function(cloneFn) {\n\
                      var transcludeScope = scope.$new();\n\
                      transcludeScope.$$transcluded = true;\n\
\n\
                      return transcludeFn(transcludeScope, cloneFn).\n\
                          bind('$destroy', bind(transcludeScope, transcludeScope.$destroy));\n\
                    };\n\
                  })(childTranscludeFn || transcludeFn)\n\
              );\n\
            } else {\n\
              nodeLinkFn(childLinkFn, childScope, node, undefined, boundTranscludeFn);\n\
            }\n\
          } else if (childLinkFn) {\n\
            childLinkFn(scope, node.childNodes, undefined, boundTranscludeFn);\n\
          }\n\
        }\n\
      }\n\
    }\n\
\n\
\n\
    /**\n\
     * Looks for directives on the given node and adds them to the directive collection which is\n\
     * sorted.\n\
     *\n\
     * @param node Node to search.\n\
     * @param directives An array to which the directives are added to. This array is sorted before\n\
     *        the function returns.\n\
     * @param attrs The shared attrs object which is used to populate the normalized attributes.\n\
     * @param {number=} maxPriority Max directive priority.\n\
     */\n\
    function collectDirectives(node, directives, attrs, maxPriority) {\n\
      var nodeType = node.nodeType,\n\
          attrsMap = attrs.$attr,\n\
          match,\n\
          className;\n\
\n\
      switch(nodeType) {\n\
        case 1: /* Element */\n\
          // use the node name: <directive>\n\
          addDirective(directives,\n\
              directiveNormalize(nodeName_(node).toLowerCase()), 'E', maxPriority);\n\
\n\
          // iterate over the attributes\n\
          for (var attr, name, nName, ngAttrName, value, nAttrs = node.attributes,\n\
                   j = 0, jj = nAttrs && nAttrs.length; j < jj; j++) {\n\
            attr = nAttrs[j];\n\
            if (attr.specified) {\n\
              name = attr.name;\n\
              // support ngAttr attribute binding\n\
              ngAttrName = directiveNormalize(name);\n\
              if (NG_ATTR_BINDING.test(ngAttrName)) {\n\
                name = ngAttrName.substr(6).toLowerCase();\n\
              }\n\
              nName = directiveNormalize(name.toLowerCase());\n\
              attrsMap[nName] = name;\n\
              attrs[nName] = value = trim((msie && name == 'href')\n\
                ? decodeURIComponent(node.getAttribute(name, 2))\n\
                : attr.value);\n\
              if (getBooleanAttrName(node, nName)) {\n\
                attrs[nName] = true; // presence means true\n\
              }\n\
              addAttrInterpolateDirective(node, directives, value, nName);\n\
              addDirective(directives, nName, 'A', maxPriority);\n\
            }\n\
          }\n\
\n\
          // use class as directive\n\
          className = node.className;\n\
          if (isString(className) && className !== '') {\n\
            while (match = CLASS_DIRECTIVE_REGEXP.exec(className)) {\n\
              nName = directiveNormalize(match[2]);\n\
              if (addDirective(directives, nName, 'C', maxPriority)) {\n\
                attrs[nName] = trim(match[3]);\n\
              }\n\
              className = className.substr(match.index + match[0].length);\n\
            }\n\
          }\n\
          break;\n\
        case 3: /* Text Node */\n\
          addTextInterpolateDirective(directives, node.nodeValue);\n\
          break;\n\
        case 8: /* Comment */\n\
          try {\n\
            match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue);\n\
            if (match) {\n\
              nName = directiveNormalize(match[1]);\n\
              if (addDirective(directives, nName, 'M', maxPriority)) {\n\
                attrs[nName] = trim(match[2]);\n\
              }\n\
            }\n\
          } catch (e) {\n\
            // turns out that under some circumstances IE9 throws errors when one attempts to read comment's node value.\n\
            // Just ignore it and continue. (Can't seem to reproduce in test case.)\n\
          }\n\
          break;\n\
      }\n\
\n\
      directives.sort(byPriority);\n\
      return directives;\n\
    }\n\
\n\
\n\
    /**\n\
     * Once the directives have been collected, their compile functions are executed. This method\n\
     * is responsible for inlining directive templates as well as terminating the application\n\
     * of the directives if the terminal directive has been reached.\n\
     *\n\
     * @param {Array} directives Array of collected directives to execute their compile function.\n\
     *        this needs to be pre-sorted by priority order.\n\
     * @param {Node} compileNode The raw DOM node to apply the compile functions to\n\
     * @param {Object} templateAttrs The shared attribute function\n\
     * @param {function(angular.Scope[, cloneAttachFn]} transcludeFn A linking function, where the\n\
     *        scope argument is auto-generated to the new child of the transcluded parent scope.\n\
     * @param {JQLite} jqCollection If we are working on the root of the compile tree then this\n\
     *        argument has the root jqLite array so that we can replace nodes on it.\n\
     * @returns linkFn\n\
     */\n\
    function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn, jqCollection) {\n\
      var terminalPriority = -Number.MAX_VALUE,\n\
          preLinkFns = [],\n\
          postLinkFns = [],\n\
          newScopeDirective = null,\n\
          newIsolateScopeDirective = null,\n\
          templateDirective = null,\n\
          $compileNode = templateAttrs.$$element = jqLite(compileNode),\n\
          directive,\n\
          directiveName,\n\
          $template,\n\
          transcludeDirective,\n\
          childTranscludeFn = transcludeFn,\n\
          controllerDirectives,\n\
          linkFn,\n\
          directiveValue;\n\
\n\
      // executes all directives on the current element\n\
      for(var i = 0, ii = directives.length; i < ii; i++) {\n\
        directive = directives[i];\n\
        $template = undefined;\n\
\n\
        if (terminalPriority > directive.priority) {\n\
          break; // prevent further processing of directives\n\
        }\n\
\n\
        if (directiveValue = directive.scope) {\n\
          assertNoDuplicate('isolated scope', newIsolateScopeDirective, directive, $compileNode);\n\
          if (isObject(directiveValue)) {\n\
            safeAddClass($compileNode, 'ng-isolate-scope');\n\
            newIsolateScopeDirective = directive;\n\
          }\n\
          safeAddClass($compileNode, 'ng-scope');\n\
          newScopeDirective = newScopeDirective || directive;\n\
        }\n\
\n\
        directiveName = directive.name;\n\
\n\
        if (directiveValue = directive.controller) {\n\
          controllerDirectives = controllerDirectives || {};\n\
          assertNoDuplicate(\"'\" + directiveName + \"' controller\",\n\
              controllerDirectives[directiveName], directive, $compileNode);\n\
          controllerDirectives[directiveName] = directive;\n\
        }\n\
\n\
        if (directiveValue = directive.transclude) {\n\
          assertNoDuplicate('transclusion', transcludeDirective, directive, $compileNode);\n\
          transcludeDirective = directive;\n\
          terminalPriority = directive.priority;\n\
          if (directiveValue == 'element') {\n\
            $template = jqLite(compileNode);\n\
            $compileNode = templateAttrs.$$element =\n\
                jqLite(document.createComment(' ' + directiveName + ': ' + templateAttrs[directiveName] + ' '));\n\
            compileNode = $compileNode[0];\n\
            replaceWith(jqCollection, jqLite($template[0]), compileNode);\n\
            childTranscludeFn = compile($template, transcludeFn, terminalPriority);\n\
          } else {\n\
            $template = jqLite(JQLiteClone(compileNode)).contents();\n\
            $compileNode.html(''); // clear contents\n\
            childTranscludeFn = compile($template, transcludeFn);\n\
          }\n\
        }\n\
\n\
        if (directive.template) {\n\
          assertNoDuplicate('template', templateDirective, directive, $compileNode);\n\
          templateDirective = directive;\n\
\n\
          directiveValue = (isFunction(directive.template))\n\
              ? directive.template($compileNode, templateAttrs)\n\
              : directive.template;\n\
\n\
          directiveValue = denormalizeTemplate(directiveValue);\n\
\n\
          if (directive.replace) {\n\
            $template = jqLite('<div>' +\n\
                                 trim(directiveValue) +\n\
                               '</div>').contents();\n\
            compileNode = $template[0];\n\
\n\
            if ($template.length != 1 || compileNode.nodeType !== 1) {\n\
              throw new Error(MULTI_ROOT_TEMPLATE_ERROR + directiveValue);\n\
            }\n\
\n\
            replaceWith(jqCollection, $compileNode, compileNode);\n\
\n\
            var newTemplateAttrs = {$attr: {}};\n\
\n\
            // combine directives from the original node and from the template:\n\
            // - take the array of directives for this element\n\
            // - split it into two parts, those that were already applied and those that weren't\n\
            // - collect directives from the template, add them to the second group and sort them\n\
            // - append the second group with new directives to the first group\n\
            directives = directives.concat(\n\
                collectDirectives(\n\
                    compileNode,\n\
                    directives.splice(i + 1, directives.length - (i + 1)),\n\
                    newTemplateAttrs\n\
                )\n\
            );\n\
            mergeTemplateAttributes(templateAttrs, newTemplateAttrs);\n\
\n\
            ii = directives.length;\n\
          } else {\n\
            $compileNode.html(directiveValue);\n\
          }\n\
        }\n\
\n\
        if (directive.templateUrl) {\n\
          assertNoDuplicate('template', templateDirective, directive, $compileNode);\n\
          templateDirective = directive;\n\
          nodeLinkFn = compileTemplateUrl(directives.splice(i, directives.length - i),\n\
              nodeLinkFn, $compileNode, templateAttrs, jqCollection, directive.replace,\n\
              childTranscludeFn);\n\
          ii = directives.length;\n\
        } else if (directive.compile) {\n\
          try {\n\
            linkFn = directive.compile($compileNode, templateAttrs, childTranscludeFn);\n\
            if (isFunction(linkFn)) {\n\
              addLinkFns(null, linkFn);\n\
            } else if (linkFn) {\n\
              addLinkFns(linkFn.pre, linkFn.post);\n\
            }\n\
          } catch (e) {\n\
            $exceptionHandler(e, startingTag($compileNode));\n\
          }\n\
        }\n\
\n\
        if (directive.terminal) {\n\
          nodeLinkFn.terminal = true;\n\
          terminalPriority = Math.max(terminalPriority, directive.priority);\n\
        }\n\
\n\
      }\n\
\n\
      nodeLinkFn.scope = newScopeDirective && newScopeDirective.scope;\n\
      nodeLinkFn.transclude = transcludeDirective && childTranscludeFn;\n\
\n\
      // might be normal or delayed nodeLinkFn depending on if templateUrl is present\n\
      return nodeLinkFn;\n\
\n\
      ////////////////////\n\
\n\
      function addLinkFns(pre, post) {\n\
        if (pre) {\n\
          pre.require = directive.require;\n\
          preLinkFns.push(pre);\n\
        }\n\
        if (post) {\n\
          post.require = directive.require;\n\
          postLinkFns.push(post);\n\
        }\n\
      }\n\
\n\
\n\
      function getControllers(require, $element) {\n\
        var value, retrievalMethod = 'data', optional = false;\n\
        if (isString(require)) {\n\
          while((value = require.charAt(0)) == '^' || value == '?') {\n\
            require = require.substr(1);\n\
            if (value == '^') {\n\
              retrievalMethod = 'inheritedData';\n\
            }\n\
            optional = optional || value == '?';\n\
          }\n\
          value = $element[retrievalMethod]('$' + require + 'Controller');\n\
          if (!value && !optional) {\n\
            throw Error(\"No controller: \" + require);\n\
          }\n\
          return value;\n\
        } else if (isArray(require)) {\n\
          value = [];\n\
          forEach(require, function(require) {\n\
            value.push(getControllers(require, $element));\n\
          });\n\
        }\n\
        return value;\n\
      }\n\
\n\
\n\
      function nodeLinkFn(childLinkFn, scope, linkNode, $rootElement, boundTranscludeFn) {\n\
        var attrs, $element, i, ii, linkFn, controller;\n\
\n\
        if (compileNode === linkNode) {\n\
          attrs = templateAttrs;\n\
        } else {\n\
          attrs = shallowCopy(templateAttrs, new Attributes(jqLite(linkNode), templateAttrs.$attr));\n\
        }\n\
        $element = attrs.$$element;\n\
\n\
        if (newIsolateScopeDirective) {\n\
          var LOCAL_REGEXP = /^\\s*([@=&])(\\??)\\s*(\\w*)\\s*$/;\n\
\n\
          var parentScope = scope.$parent || scope;\n\
\n\
          forEach(newIsolateScopeDirective.scope, function(definiton, scopeName) {\n\
            var match = definiton.match(LOCAL_REGEXP) || [],\n\
                attrName = match[3] || scopeName,\n\
                optional = (match[2] == '?'),\n\
                mode = match[1], // @, =, or &\n\
                lastValue,\n\
                parentGet, parentSet;\n\
\n\
            scope.$$isolateBindings[scopeName] = mode + attrName;\n\
\n\
            switch (mode) {\n\
\n\
              case '@': {\n\
                attrs.$observe(attrName, function(value) {\n\
                  scope[scopeName] = value;\n\
                });\n\
                attrs.$$observers[attrName].$$scope = parentScope;\n\
                if( attrs[attrName] ) {\n\
                  // If the attribute has been provided then we trigger an interpolation to ensure the value is there for use in the link fn\n\
                  scope[scopeName] = $interpolate(attrs[attrName])(parentScope);\n\
                }\n\
                break;\n\
              }\n\
\n\
              case '=': {\n\
                if (optional && !attrs[attrName]) {\n\
                  return;\n\
                }\n\
                parentGet = $parse(attrs[attrName]);\n\
                parentSet = parentGet.assign || function() {\n\
                  // reset the change, or we will throw this exception on every $digest\n\
                  lastValue = scope[scopeName] = parentGet(parentScope);\n\
                  throw Error(NON_ASSIGNABLE_MODEL_EXPRESSION + attrs[attrName] +\n\
                      ' (directive: ' + newIsolateScopeDirective.name + ')');\n\
                };\n\
                lastValue = scope[scopeName] = parentGet(parentScope);\n\
                scope.$watch(function parentValueWatch() {\n\
                  var parentValue = parentGet(parentScope);\n\
\n\
                  if (parentValue !== scope[scopeName]) {\n\
                    // we are out of sync and need to copy\n\
                    if (parentValue !== lastValue) {\n\
                      // parent changed and it has precedence\n\
                      lastValue = scope[scopeName] = parentValue;\n\
                    } else {\n\
                      // if the parent can be assigned then do so\n\
                      parentSet(parentScope, parentValue = lastValue = scope[scopeName]);\n\
                    }\n\
                  }\n\
                  return parentValue;\n\
                });\n\
                break;\n\
              }\n\
\n\
              case '&': {\n\
                parentGet = $parse(attrs[attrName]);\n\
                scope[scopeName] = function(locals) {\n\
                  return parentGet(parentScope, locals);\n\
                };\n\
                break;\n\
              }\n\
\n\
              default: {\n\
                throw Error('Invalid isolate scope definition for directive ' +\n\
                    newIsolateScopeDirective.name + ': ' + definiton);\n\
              }\n\
            }\n\
          });\n\
        }\n\
\n\
        if (controllerDirectives) {\n\
          forEach(controllerDirectives, function(directive) {\n\
            var locals = {\n\
              $scope: scope,\n\
              $element: $element,\n\
              $attrs: attrs,\n\
              $transclude: boundTranscludeFn\n\
            };\n\
\n\
            controller = directive.controller;\n\
            if (controller == '@') {\n\
              controller = attrs[directive.name];\n\
            }\n\
\n\
            $element.data(\n\
                '$' + directive.name + 'Controller',\n\
                $controller(controller, locals));\n\
          });\n\
        }\n\
\n\
        // PRELINKING\n\
        for(i = 0, ii = preLinkFns.length; i < ii; i++) {\n\
          try {\n\
            linkFn = preLinkFns[i];\n\
            linkFn(scope, $element, attrs,\n\
                linkFn.require && getControllers(linkFn.require, $element));\n\
          } catch (e) {\n\
            $exceptionHandler(e, startingTag($element));\n\
          }\n\
        }\n\
\n\
        // RECURSION\n\
        childLinkFn && childLinkFn(scope, linkNode.childNodes, undefined, boundTranscludeFn);\n\
\n\
        // POSTLINKING\n\
        for(i = 0, ii = postLinkFns.length; i < ii; i++) {\n\
          try {\n\
            linkFn = postLinkFns[i];\n\
            linkFn(scope, $element, attrs,\n\
                linkFn.require && getControllers(linkFn.require, $element));\n\
          } catch (e) {\n\
            $exceptionHandler(e, startingTag($element));\n\
          }\n\
        }\n\
      }\n\
    }\n\
\n\
\n\
    /**\n\
     * looks up the directive and decorates it with exception handling and proper parameters. We\n\
     * call this the boundDirective.\n\
     *\n\
     * @param {string} name name of the directive to look up.\n\
     * @param {string} location The directive must be found in specific format.\n\
     *   String containing any of theses characters:\n\
     *\n\
     *   * `E`: element name\n\
     *   * `A': attribute\n\
     *   * `C`: class\n\
     *   * `M`: comment\n\
     * @returns true if directive was added.\n\
     */\n\
    function addDirective(tDirectives, name, location, maxPriority) {\n\
      var match = false;\n\
      if (hasDirectives.hasOwnProperty(name)) {\n\
        for(var directive, directives = $injector.get(name + Suffix),\n\
            i = 0, ii = directives.length; i<ii; i++) {\n\
          try {\n\
            directive = directives[i];\n\
            if ( (maxPriority === undefined || maxPriority > directive.priority) &&\n\
                 directive.restrict.indexOf(location) != -1) {\n\
              tDirectives.push(directive);\n\
              match = true;\n\
            }\n\
          } catch(e) { $exceptionHandler(e); }\n\
        }\n\
      }\n\
      return match;\n\
    }\n\
\n\
\n\
    /**\n\
     * When the element is replaced with HTML template then the new attributes\n\
     * on the template need to be merged with the existing attributes in the DOM.\n\
     * The desired effect is to have both of the attributes present.\n\
     *\n\
     * @param {object} dst destination attributes (original DOM)\n\
     * @param {object} src source attributes (from the directive template)\n\
     */\n\
    function mergeTemplateAttributes(dst, src) {\n\
      var srcAttr = src.$attr,\n\
          dstAttr = dst.$attr,\n\
          $element = dst.$$element;\n\
\n\
      // reapply the old attributes to the new element\n\
      forEach(dst, function(value, key) {\n\
        if (key.charAt(0) != '$') {\n\
          if (src[key]) {\n\
            value += (key === 'style' ? ';' : ' ') + src[key];\n\
          }\n\
          dst.$set(key, value, true, srcAttr[key]);\n\
        }\n\
      });\n\
\n\
      // copy the new attributes on the old attrs object\n\
      forEach(src, function(value, key) {\n\
        if (key == 'class') {\n\
          safeAddClass($element, value);\n\
          dst['class'] = (dst['class'] ? dst['class'] + ' ' : '') + value;\n\
        } else if (key == 'style') {\n\
          $element.attr('style', $element.attr('style') + ';' + value);\n\
        } else if (key.charAt(0) != '$' && !dst.hasOwnProperty(key)) {\n\
          dst[key] = value;\n\
          dstAttr[key] = srcAttr[key];\n\
        }\n\
      });\n\
    }\n\
\n\
\n\
    function compileTemplateUrl(directives, beforeTemplateNodeLinkFn, $compileNode, tAttrs,\n\
        $rootElement, replace, childTranscludeFn) {\n\
      var linkQueue = [],\n\
          afterTemplateNodeLinkFn,\n\
          afterTemplateChildLinkFn,\n\
          beforeTemplateCompileNode = $compileNode[0],\n\
          origAsyncDirective = directives.shift(),\n\
          // The fact that we have to copy and patch the directive seems wrong!\n\
          derivedSyncDirective = extend({}, origAsyncDirective, {\n\
            controller: null, templateUrl: null, transclude: null, scope: null\n\
          }),\n\
          templateUrl = (isFunction(origAsyncDirective.templateUrl))\n\
              ? origAsyncDirective.templateUrl($compileNode, tAttrs)\n\
              : origAsyncDirective.templateUrl;\n\
\n\
      $compileNode.html('');\n\
\n\
      $http.get(templateUrl, {cache: $templateCache}).\n\
        success(function(content) {\n\
          var compileNode, tempTemplateAttrs, $template;\n\
\n\
          content = denormalizeTemplate(content);\n\
\n\
          if (replace) {\n\
            $template = jqLite('<div>' + trim(content) + '</div>').contents();\n\
            compileNode = $template[0];\n\
\n\
            if ($template.length != 1 || compileNode.nodeType !== 1) {\n\
              throw new Error(MULTI_ROOT_TEMPLATE_ERROR + content);\n\
            }\n\
\n\
            tempTemplateAttrs = {$attr: {}};\n\
            replaceWith($rootElement, $compileNode, compileNode);\n\
            collectDirectives(compileNode, directives, tempTemplateAttrs);\n\
            mergeTemplateAttributes(tAttrs, tempTemplateAttrs);\n\
          } else {\n\
            compileNode = beforeTemplateCompileNode;\n\
            $compileNode.html(content);\n\
          }\n\
\n\
          directives.unshift(derivedSyncDirective);\n\
          afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs, childTranscludeFn);\n\
          afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn);\n\
\n\
\n\
          while(linkQueue.length) {\n\
            var scope = linkQueue.shift(),\n\
                beforeTemplateLinkNode = linkQueue.shift(),\n\
                linkRootElement = linkQueue.shift(),\n\
                controller = linkQueue.shift(),\n\
                linkNode = compileNode;\n\
\n\
            if (beforeTemplateLinkNode !== beforeTemplateCompileNode) {\n\
              // it was cloned therefore we have to clone as well.\n\
              linkNode = JQLiteClone(compileNode);\n\
              replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode);\n\
            }\n\
\n\
            afterTemplateNodeLinkFn(function() {\n\
              beforeTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement, controller);\n\
            }, scope, linkNode, $rootElement, controller);\n\
          }\n\
          linkQueue = null;\n\
        }).\n\
        error(function(response, code, headers, config) {\n\
          throw Error('Failed to load template: ' + config.url);\n\
        });\n\
\n\
      return function delayedNodeLinkFn(ignoreChildLinkFn, scope, node, rootElement, controller) {\n\
        if (linkQueue) {\n\
          linkQueue.push(scope);\n\
          linkQueue.push(node);\n\
          linkQueue.push(rootElement);\n\
          linkQueue.push(controller);\n\
        } else {\n\
          afterTemplateNodeLinkFn(function() {\n\
            beforeTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, controller);\n\
          }, scope, node, rootElement, controller);\n\
        }\n\
      };\n\
    }\n\
\n\
\n\
    /**\n\
     * Sorting function for bound directives.\n\
     */\n\
    function byPriority(a, b) {\n\
      return b.priority - a.priority;\n\
    }\n\
\n\
\n\
    function assertNoDuplicate(what, previousDirective, directive, element) {\n\
      if (previousDirective) {\n\
        throw Error('Multiple directives [' + previousDirective.name + ', ' +\n\
          directive.name + '] asking for ' + what + ' on: ' +  startingTag(element));\n\
      }\n\
    }\n\
\n\
\n\
    function addTextInterpolateDirective(directives, text) {\n\
      var interpolateFn = $interpolate(text, true);\n\
      if (interpolateFn) {\n\
        directives.push({\n\
          priority: 0,\n\
          compile: valueFn(function textInterpolateLinkFn(scope, node) {\n\
            var parent = node.parent(),\n\
                bindings = parent.data('$binding') || [];\n\
            bindings.push(interpolateFn);\n\
            safeAddClass(parent.data('$binding', bindings), 'ng-binding');\n\
            scope.$watch(interpolateFn, function interpolateFnWatchAction(value) {\n\
              node[0].nodeValue = value;\n\
            });\n\
          })\n\
        });\n\
      }\n\
    }\n\
\n\
\n\
    function addAttrInterpolateDirective(node, directives, value, name) {\n\
      var interpolateFn = $interpolate(value, true);\n\
\n\
      // no interpolation found -> ignore\n\
      if (!interpolateFn) return;\n\
\n\
\n\
      directives.push({\n\
        priority: 100,\n\
        compile: valueFn(function attrInterpolateLinkFn(scope, element, attr) {\n\
          var $$observers = (attr.$$observers || (attr.$$observers = {}));\n\
\n\
          // we need to interpolate again, in case the attribute value has been updated\n\
          // (e.g. by another directive's compile function)\n\
          interpolateFn = $interpolate(attr[name], true);\n\
\n\
          // if attribute was updated so that there is no interpolation going on we don't want to\n\
          // register any observers\n\
          if (!interpolateFn) return;\n\
\n\
          attr[name] = interpolateFn(scope);\n\
          ($$observers[name] || ($$observers[name] = [])).$$inter = true;\n\
          (attr.$$observers && attr.$$observers[name].$$scope || scope).\n\
            $watch(interpolateFn, function interpolateFnWatchAction(value) {\n\
              attr.$set(name, value);\n\
            });\n\
        })\n\
      });\n\
    }\n\
\n\
\n\
    /**\n\
     * This is a special jqLite.replaceWith, which can replace items which\n\
     * have no parents, provided that the containing jqLite collection is provided.\n\
     *\n\
     * @param {JqLite=} $rootElement The root of the compile tree. Used so that we can replace nodes\n\
     *    in the root of the tree.\n\
     * @param {JqLite} $element The jqLite element which we are going to replace. We keep the shell,\n\
     *    but replace its DOM node reference.\n\
     * @param {Node} newNode The new DOM node.\n\
     */\n\
    function replaceWith($rootElement, $element, newNode) {\n\
      var oldNode = $element[0],\n\
          parent = oldNode.parentNode,\n\
          i, ii;\n\
\n\
      if ($rootElement) {\n\
        for(i = 0, ii = $rootElement.length; i < ii; i++) {\n\
          if ($rootElement[i] == oldNode) {\n\
            $rootElement[i] = newNode;\n\
            break;\n\
          }\n\
        }\n\
      }\n\
\n\
      if (parent) {\n\
        parent.replaceChild(newNode, oldNode);\n\
      }\n\
\n\
      newNode[jqLite.expando] = oldNode[jqLite.expando];\n\
      $element[0] = newNode;\n\
    }\n\
  }];\n\
}\n\
\n\
var PREFIX_REGEXP = /^(x[\\:\\-_]|data[\\:\\-_])/i;\n\
/**\n\
 * Converts all accepted directives format into proper directive name.\n\
 * All of these will become 'myDirective':\n\
 *   my:DiRective\n\
 *   my-directive\n\
 *   x-my-directive\n\
 *   data-my:directive\n\
 *\n\
 * Also there is special case for Moz prefix starting with upper case letter.\n\
 * @param name Name to normalize\n\
 */\n\
function directiveNormalize(name) {\n\
  return camelCase(name.replace(PREFIX_REGEXP, ''));\n\
}\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.$compile.directive.Attributes\n\
 * @description\n\
 *\n\
 * A shared object between directive compile / linking functions which contains normalized DOM element\n\
 * attributes. The the values reflect current binding state `{{ }}`. The normalization is needed\n\
 * since all of these are treated as equivalent in Angular:\n\
 *\n\
 *          <span ng:bind=\"a\" ng-bind=\"a\" data-ng-bind=\"a\" x-ng-bind=\"a\">\n\
 */\n\
\n\
/**\n\
 * @ngdoc property\n\
 * @name ng.$compile.directive.Attributes#$attr\n\
 * @propertyOf ng.$compile.directive.Attributes\n\
 * @returns {object} A map of DOM element attribute names to the normalized name. This is\n\
 *          needed to do reverse lookup from normalized name back to actual name.\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name ng.$compile.directive.Attributes#$set\n\
 * @methodOf ng.$compile.directive.Attributes\n\
 * @function\n\
 *\n\
 * @description\n\
 * Set DOM element attribute value.\n\
 *\n\
 *\n\
 * @param {string} name Normalized element attribute name of the property to modify. The name is\n\
 *          revers translated using the {@link ng.$compile.directive.Attributes#$attr $attr}\n\
 *          property to the original name.\n\
 * @param {string} value Value to set the attribute to. The value can be an interpolated string.\n\
 */\n\
\n\
\n\
\n\
/**\n\
 * Closure compiler type information\n\
 */\n\
\n\
function nodesetLinkingFn(\n\
  /* angular.Scope */ scope,\n\
  /* NodeList */ nodeList,\n\
  /* Element */ rootElement,\n\
  /* function(Function) */ boundTranscludeFn\n\
){}\n\
\n\
function directiveLinkingFn(\n\
  /* nodesetLinkingFn */ nodesetLinkingFn,\n\
  /* angular.Scope */ scope,\n\
  /* Node */ node,\n\
  /* Element */ rootElement,\n\
  /* function(Function) */ boundTranscludeFn\n\
){}\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.$controllerProvider\n\
 * @description\n\
 * The {@link ng.$controller $controller service} is used by Angular to create new\n\
 * controllers.\n\
 *\n\
 * This provider allows controller registration via the\n\
 * {@link ng.$controllerProvider#register register} method.\n\
 */\n\
function $ControllerProvider() {\n\
  var controllers = {},\n\
      CNTRL_REG = /^(\\S+)(\\s+as\\s+(\\w+))?$/;\n\
\n\
\n\
  /**\n\
   * @ngdoc function\n\
   * @name ng.$controllerProvider#register\n\
   * @methodOf ng.$controllerProvider\n\
   * @param {string} name Controller name\n\
   * @param {Function|Array} constructor Controller constructor fn (optionally decorated with DI\n\
   *    annotations in the array notation).\n\
   */\n\
  this.register = function(name, constructor) {\n\
    if (isObject(name)) {\n\
      extend(controllers, name)\n\
    } else {\n\
      controllers[name] = constructor;\n\
    }\n\
  };\n\
\n\
\n\
  this.$get = ['$injector', '$window', function($injector, $window) {\n\
\n\
    /**\n\
     * @ngdoc function\n\
     * @name ng.$controller\n\
     * @requires $injector\n\
     *\n\
     * @param {Function|string} constructor If called with a function then it's considered to be the\n\
     *    controller constructor function. Otherwise it's considered to be a string which is used\n\
     *    to retrieve the controller constructor using the following steps:\n\
     *\n\
     *    * check if a controller with given name is registered via `$controllerProvider`\n\
     *    * check if evaluating the string on the current scope returns a constructor\n\
     *    * check `window[constructor]` on the global `window` object\n\
     *\n\
     * @param {Object} locals Injection locals for Controller.\n\
     * @return {Object} Instance of given controller.\n\
     *\n\
     * @description\n\
     * `$controller` service is responsible for instantiating controllers.\n\
     *\n\
     * It's just a simple call to {@link AUTO.$injector $injector}, but extracted into\n\
     * a service, so that one can override this service with {@link https://gist.github.com/1649788\n\
     * BC version}.\n\
     */\n\
    return function(expression, locals) {\n\
      var instance, match, constructor, identifier;\n\
\n\
      if(isString(expression)) {\n\
        match = expression.match(CNTRL_REG),\n\
        constructor = match[1],\n\
        identifier = match[3];\n\
        expression = controllers.hasOwnProperty(constructor)\n\
            ? controllers[constructor]\n\
            : getter(locals.$scope, constructor, true) || getter($window, constructor, true);\n\
\n\
        assertArgFn(expression, constructor, true);\n\
      }\n\
\n\
      instance = $injector.instantiate(expression, locals);\n\
\n\
      if (identifier) {\n\
        if (typeof locals.$scope !== 'object') {\n\
          throw new Error('Can not export controller as \"' + identifier + '\". ' +\n\
              'No scope object provided!');\n\
        }\n\
\n\
        locals.$scope[identifier] = instance;\n\
      }\n\
\n\
      return instance;\n\
    };\n\
  }];\n\
}\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.$document\n\
 * @requires $window\n\
 *\n\
 * @description\n\
 * A {@link angular.element jQuery (lite)}-wrapped reference to the browser's `window.document`\n\
 * element.\n\
 */\n\
function $DocumentProvider(){\n\
  this.$get = ['$window', function(window){\n\
    return jqLite(window.document);\n\
  }];\n\
}\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name ng.$exceptionHandler\n\
 * @requires $log\n\
 *\n\
 * @description\n\
 * Any uncaught exception in angular expressions is delegated to this service.\n\
 * The default implementation simply delegates to `$log.error` which logs it into\n\
 * the browser console.\n\
 *\n\
 * In unit tests, if `angular-mocks.js` is loaded, this service is overridden by\n\
 * {@link ngMock.$exceptionHandler mock $exceptionHandler} which aids in testing.\n\
 *\n\
 * @param {Error} exception Exception associated with the error.\n\
 * @param {string=} cause optional information about the context in which\n\
 *       the error was thrown.\n\
 *\n\
 */\n\
function $ExceptionHandlerProvider() {\n\
  this.$get = ['$log', function($log) {\n\
    return function(exception, cause) {\n\
      $log.error.apply($log, arguments);\n\
    };\n\
  }];\n\
}\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.$interpolateProvider\n\
 * @function\n\
 *\n\
 * @description\n\
 *\n\
 * Used for configuring the interpolation markup. Defaults to `{{` and `}}`.\n\
 */\n\
function $InterpolateProvider() {\n\
  var startSymbol = '{{';\n\
  var endSymbol = '}}';\n\
\n\
  /**\n\
   * @ngdoc method\n\
   * @name ng.$interpolateProvider#startSymbol\n\
   * @methodOf ng.$interpolateProvider\n\
   * @description\n\
   * Symbol to denote start of expression in the interpolated string. Defaults to `{{`.\n\
   *\n\
   * @param {string=} value new value to set the starting symbol to.\n\
   * @returns {string|self} Returns the symbol when used as getter and self if used as setter.\n\
   */\n\
  this.startSymbol = function(value){\n\
    if (value) {\n\
      startSymbol = value;\n\
      return this;\n\
    } else {\n\
      return startSymbol;\n\
    }\n\
  };\n\
\n\
  /**\n\
   * @ngdoc method\n\
   * @name ng.$interpolateProvider#endSymbol\n\
   * @methodOf ng.$interpolateProvider\n\
   * @description\n\
   * Symbol to denote the end of expression in the interpolated string. Defaults to `}}`.\n\
   *\n\
   * @param {string=} value new value to set the ending symbol to.\n\
   * @returns {string|self} Returns the symbol when used as getter and self if used as setter.\n\
   */\n\
  this.endSymbol = function(value){\n\
    if (value) {\n\
      endSymbol = value;\n\
      return this;\n\
    } else {\n\
      return endSymbol;\n\
    }\n\
  };\n\
\n\
\n\
  this.$get = ['$parse', '$exceptionHandler', function($parse, $exceptionHandler) {\n\
    var startSymbolLength = startSymbol.length,\n\
        endSymbolLength = endSymbol.length;\n\
\n\
    /**\n\
     * @ngdoc function\n\
     * @name ng.$interpolate\n\
     * @function\n\
     *\n\
     * @requires $parse\n\
     *\n\
     * @description\n\
     *\n\
     * Compiles a string with markup into an interpolation function. This service is used by the\n\
     * HTML {@link ng.$compile $compile} service for data binding. See\n\
     * {@link ng.$interpolateProvider $interpolateProvider} for configuring the\n\
     * interpolation markup.\n\
     *\n\
     *\n\
       <pre>\n\
         var $interpolate = ...; // injected\n\
         var exp = $interpolate('Hello {{name}}!');\n\
         expect(exp({name:'Angular'}).toEqual('Hello Angular!');\n\
       </pre>\n\
     *\n\
     *\n\
     * @param {string} text The text with markup to interpolate.\n\
     * @param {boolean=} mustHaveExpression if set to true then the interpolation string must have\n\
     *    embedded expression in order to return an interpolation function. Strings with no\n\
     *    embedded expression will return null for the interpolation function.\n\
     * @returns {function(context)} an interpolation function which is used to compute the interpolated\n\
     *    string. The function has these parameters:\n\
     *\n\
     *    * `context`: an object against which any expressions embedded in the strings are evaluated\n\
     *      against.\n\
     *\n\
     */\n\
    function $interpolate(text, mustHaveExpression) {\n\
      var startIndex,\n\
          endIndex,\n\
          index = 0,\n\
          parts = [],\n\
          length = text.length,\n\
          hasInterpolation = false,\n\
          fn,\n\
          exp,\n\
          concat = [];\n\
\n\
      while(index < length) {\n\
        if ( ((startIndex = text.indexOf(startSymbol, index)) != -1) &&\n\
             ((endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) != -1) ) {\n\
          (index != startIndex) && parts.push(text.substring(index, startIndex));\n\
          parts.push(fn = $parse(exp = text.substring(startIndex + startSymbolLength, endIndex)));\n\
          fn.exp = exp;\n\
          index = endIndex + endSymbolLength;\n\
          hasInterpolation = true;\n\
        } else {\n\
          // we did not find anything, so we have to add the remainder to the parts array\n\
          (index != length) && parts.push(text.substring(index));\n\
          index = length;\n\
        }\n\
      }\n\
\n\
      if (!(length = parts.length)) {\n\
        // we added, nothing, must have been an empty string.\n\
        parts.push('');\n\
        length = 1;\n\
      }\n\
\n\
      if (!mustHaveExpression  || hasInterpolation) {\n\
        concat.length = length;\n\
        fn = function(context) {\n\
          try {\n\
            for(var i = 0, ii = length, part; i<ii; i++) {\n\
              if (typeof (part = parts[i]) == 'function') {\n\
                part = part(context);\n\
                if (part == null || part == undefined) {\n\
                  part = '';\n\
                } else if (typeof part != 'string') {\n\
                  part = toJson(part);\n\
                }\n\
              }\n\
              concat[i] = part;\n\
            }\n\
            return concat.join('');\n\
          }\n\
          catch(err) {\n\
            var newErr = new Error('Error while interpolating: ' + text + '\\n\
' + err.toString());\n\
            $exceptionHandler(newErr);\n\
          }\n\
        };\n\
        fn.exp = text;\n\
        fn.parts = parts;\n\
        return fn;\n\
      }\n\
    }\n\
\n\
\n\
    /**\n\
     * @ngdoc method\n\
     * @name ng.$interpolate#startSymbol\n\
     * @methodOf ng.$interpolate\n\
     * @description\n\
     * Symbol to denote the start of expression in the interpolated string. Defaults to `{{`.\n\
     *\n\
     * Use {@link ng.$interpolateProvider#startSymbol $interpolateProvider#startSymbol} to change\n\
     * the symbol.\n\
     *\n\
     * @returns {string} start symbol.\n\
     */\n\
    $interpolate.startSymbol = function() {\n\
      return startSymbol;\n\
    }\n\
\n\
\n\
    /**\n\
     * @ngdoc method\n\
     * @name ng.$interpolate#endSymbol\n\
     * @methodOf ng.$interpolate\n\
     * @description\n\
     * Symbol to denote the end of expression in the interpolated string. Defaults to `}}`.\n\
     *\n\
     * Use {@link ng.$interpolateProvider#endSymbol $interpolateProvider#endSymbol} to change\n\
     * the symbol.\n\
     *\n\
     * @returns {string} start symbol.\n\
     */\n\
    $interpolate.endSymbol = function() {\n\
      return endSymbol;\n\
    }\n\
\n\
    return $interpolate;\n\
  }];\n\
}\n\
\n\
var SERVER_MATCH = /^([^:]+):\\/\\/(\\w+:{0,1}\\w*@)?(\\{?[\\w\\.-]*\\}?)(:([0-9]+))?(\\/[^\\?#]*)?(\\?([^#]*))?(#(.*))?$/,\n\
    PATH_MATCH = /^([^\\?#]*)(\\?([^#]*))?(#(.*))?$/,\n\
    DEFAULT_PORTS = {'http': 80, 'https': 443, 'ftp': 21};\n\
\n\
\n\
/**\n\
 * Encode path using encodeUriSegment, ignoring forward slashes\n\
 *\n\
 * @param {string} path Path to encode\n\
 * @returns {string}\n\
 */\n\
function encodePath(path) {\n\
  var segments = path.split('/'),\n\
      i = segments.length;\n\
\n\
  while (i--) {\n\
    segments[i] = encodeUriSegment(segments[i]);\n\
  }\n\
\n\
  return segments.join('/');\n\
}\n\
\n\
function matchUrl(url, obj) {\n\
  var match = SERVER_MATCH.exec(url);\n\
\n\
  obj.$$protocol = match[1];\n\
  obj.$$host = match[3];\n\
  obj.$$port = int(match[5]) || DEFAULT_PORTS[match[1]] || null;\n\
}\n\
\n\
function matchAppUrl(url, obj) {\n\
  var match = PATH_MATCH.exec(url);\n\
\n\
  obj.$$path = decodeURIComponent(match[1]);\n\
  obj.$$search = parseKeyValue(match[3]);\n\
  obj.$$hash = decodeURIComponent(match[5] || '');\n\
\n\
  // make sure path starts with '/';\n\
  if (obj.$$path && obj.$$path.charAt(0) != '/') obj.$$path = '/' + obj.$$path;\n\
}\n\
\n\
\n\
function composeProtocolHostPort(protocol, host, port) {\n\
  return protocol + '://' + host + (port == DEFAULT_PORTS[protocol] ? '' : ':' + port);\n\
}\n\
\n\
/**\n\
 *\n\
 * @param {string} begin\n\
 * @param {string} whole\n\
 * @param {string} otherwise\n\
 * @returns {string} returns text from whole after begin or otherwise if it does not begin with expected string.\n\
 */\n\
function beginsWith(begin, whole, otherwise) {\n\
  return whole.indexOf(begin) == 0 ? whole.substr(begin.length) : otherwise;\n\
}\n\
\n\
\n\
function stripHash(url) {\n\
  var index = url.indexOf('#');\n\
  return index == -1 ? url : url.substr(0, index);\n\
}\n\
\n\
\n\
function stripFile(url) {\n\
  return url.substr(0, stripHash(url).lastIndexOf('/') + 1);\n\
}\n\
\n\
/* return the server only */\n\
function serverBase(url) {\n\
  return url.substring(0, url.indexOf('/', url.indexOf('//') + 2));\n\
}\n\
\n\
\n\
/**\n\
 * LocationHtml5Url represents an url\n\
 * This object is exposed as $location service when HTML5 mode is enabled and supported\n\
 *\n\
 * @constructor\n\
 * @param {string} appBase application base URL\n\
 * @param {string} basePrefix url path prefix\n\
 */\n\
function LocationHtml5Url(appBase, basePrefix) {\n\
  basePrefix = basePrefix || '';\n\
  var appBaseNoFile = stripFile(appBase);\n\
  /**\n\
   * Parse given html5 (regular) url string into properties\n\
   * @param {string} newAbsoluteUrl HTML5 url\n\
   * @private\n\
   */\n\
  this.$$parse = function(url) {\n\
    var parsed = {}\n\
    matchUrl(url, parsed);\n\
    var pathUrl = beginsWith(appBaseNoFile, url);\n\
    if (!isString(pathUrl)) {\n\
      throw Error('Invalid url \"' + url + '\", missing path prefix \"' + appBaseNoFile + '\".');\n\
    }\n\
    matchAppUrl(pathUrl, parsed);\n\
    extend(this, parsed);\n\
    if (!this.$$path) {\n\
      this.$$path = '/';\n\
    }\n\
\n\
    this.$$compose();\n\
  };\n\
\n\
  /**\n\
   * Compose url and update `absUrl` property\n\
   * @private\n\
   */\n\
  this.$$compose = function() {\n\
    var search = toKeyValue(this.$$search),\n\
        hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';\n\
\n\
    this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;\n\
    this.$$absUrl = appBaseNoFile + this.$$url.substr(1); // first char is always '/'\n\
  };\n\
\n\
  this.$$rewrite = function(url) {\n\
    var appUrl, prevAppUrl;\n\
\n\
    if ( (appUrl = beginsWith(appBase, url)) !== undefined ) {\n\
      prevAppUrl = appUrl;\n\
      if ( (appUrl = beginsWith(basePrefix, appUrl)) !== undefined ) {\n\
        return appBaseNoFile + (beginsWith('/', appUrl) || appUrl);\n\
      } else {\n\
        return appBase + prevAppUrl;\n\
      }\n\
    } else if ( (appUrl = beginsWith(appBaseNoFile, url)) !== undefined ) {\n\
      return appBaseNoFile + appUrl;\n\
    } else if (appBaseNoFile == url + '/') {\n\
      return appBaseNoFile;\n\
    }\n\
  }\n\
}\n\
\n\
\n\
/**\n\
 * LocationHashbangUrl represents url\n\
 * This object is exposed as $location service when html5 history api is disabled or not supported\n\
 *\n\
 * @constructor\n\
 * @param {string} appBase application base URL\n\
 * @param {string} hashPrefix hashbang prefix\n\
 */\n\
function LocationHashbangUrl(appBase, hashPrefix) {\n\
  var appBaseNoFile = stripFile(appBase);\n\
\n\
  /**\n\
   * Parse given hashbang url into properties\n\
   * @param {string} url Hashbang url\n\
   * @private\n\
   */\n\
  this.$$parse = function(url) {\n\
    matchUrl(url, this);\n\
    var withoutBaseUrl = beginsWith(appBase, url) || beginsWith(appBaseNoFile, url);\n\
    if (!isString(withoutBaseUrl)) {\n\
      throw new Error('Invalid url \"' + url + '\", does not start with \"' + appBase +  '\".');\n\
    }\n\
    var withoutHashUrl = withoutBaseUrl.charAt(0) == '#' ? beginsWith(hashPrefix, withoutBaseUrl) : withoutBaseUrl;\n\
    if (!isString(withoutHashUrl)) {\n\
      throw new Error('Invalid url \"' + url + '\", missing hash prefix \"' + hashPrefix + '\".');\n\
    }\n\
    matchAppUrl(withoutHashUrl, this);\n\
    this.$$compose();\n\
  };\n\
\n\
  /**\n\
   * Compose hashbang url and update `absUrl` property\n\
   * @private\n\
   */\n\
  this.$$compose = function() {\n\
    var search = toKeyValue(this.$$search),\n\
        hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';\n\
\n\
    this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;\n\
    this.$$absUrl = appBase + (this.$$url ? hashPrefix + this.$$url : '');\n\
  };\n\
\n\
  this.$$rewrite = function(url) {\n\
    if(stripHash(appBase) == stripHash(url)) {\n\
      return url;\n\
    }\n\
  }\n\
}\n\
\n\
\n\
/**\n\
 * LocationHashbangUrl represents url\n\
 * This object is exposed as $location service when html5 history api is enabled but the browser\n\
 * does not support it.\n\
 *\n\
 * @constructor\n\
 * @param {string} appBase application base URL\n\
 * @param {string} hashPrefix hashbang prefix\n\
 */\n\
function LocationHashbangInHtml5Url(appBase, hashPrefix) {\n\
  LocationHashbangUrl.apply(this, arguments);\n\
\n\
  var appBaseNoFile = stripFile(appBase);\n\
\n\
  this.$$rewrite = function(url) {\n\
    var appUrl;\n\
\n\
    if ( appBase == stripHash(url) ) {\n\
      return url;\n\
    } else if ( (appUrl = beginsWith(appBaseNoFile, url)) ) {\n\
      return appBase + hashPrefix + appUrl;\n\
    } else if ( appBaseNoFile === url + '/') {\n\
      return appBaseNoFile;\n\
    }\n\
  }\n\
}\n\
\n\
\n\
LocationHashbangInHtml5Url.prototype =\n\
  LocationHashbangUrl.prototype =\n\
  LocationHtml5Url.prototype = {\n\
\n\
  /**\n\
   * Has any change been replacing ?\n\
   * @private\n\
   */\n\
  $$replace: false,\n\
\n\
  /**\n\
   * @ngdoc method\n\
   * @name ng.$location#absUrl\n\
   * @methodOf ng.$location\n\
   *\n\
   * @description\n\
   * This method is getter only.\n\
   *\n\
   * Return full url representation with all segments encoded according to rules specified in\n\
   * {@link http://www.ietf.org/rfc/rfc3986.txt RFC 3986}.\n\
   *\n\
   * @return {string} full url\n\
   */\n\
  absUrl: locationGetter('$$absUrl'),\n\
\n\
  /**\n\
   * @ngdoc method\n\
   * @name ng.$location#url\n\
   * @methodOf ng.$location\n\
   *\n\
   * @description\n\
   * This method is getter / setter.\n\
   *\n\
   * Return url (e.g. `/path?a=b#hash`) when called without any parameter.\n\
   *\n\
   * Change path, search and hash, when called with parameter and return `$location`.\n\
   *\n\
   * @param {string=} url New url without base prefix (e.g. `/path?a=b#hash`)\n\
   * @return {string} url\n\
   */\n\
  url: function(url, replace) {\n\
    if (isUndefined(url))\n\
      return this.$$url;\n\
\n\
    var match = PATH_MATCH.exec(url);\n\
    if (match[1]) this.path(decodeURIComponent(match[1]));\n\
    if (match[2] || match[1]) this.search(match[3] || '');\n\
    this.hash(match[5] || '', replace);\n\
\n\
    return this;\n\
  },\n\
\n\
  /**\n\
   * @ngdoc method\n\
   * @name ng.$location#protocol\n\
   * @methodOf ng.$location\n\
   *\n\
   * @description\n\
   * This method is getter only.\n\
   *\n\
   * Return protocol of current url.\n\
   *\n\
   * @return {string} protocol of current url\n\
   */\n\
  protocol: locationGetter('$$protocol'),\n\
\n\
  /**\n\
   * @ngdoc method\n\
   * @name ng.$location#host\n\
   * @methodOf ng.$location\n\
   *\n\
   * @description\n\
   * This method is getter only.\n\
   *\n\
   * Return host of current url.\n\
   *\n\
   * @return {string} host of current url.\n\
   */\n\
  host: locationGetter('$$host'),\n\
\n\
  /**\n\
   * @ngdoc method\n\
   * @name ng.$location#port\n\
   * @methodOf ng.$location\n\
   *\n\
   * @description\n\
   * This method is getter only.\n\
   *\n\
   * Return port of current url.\n\
   *\n\
   * @return {Number} port\n\
   */\n\
  port: locationGetter('$$port'),\n\
\n\
  /**\n\
   * @ngdoc method\n\
   * @name ng.$location#path\n\
   * @methodOf ng.$location\n\
   *\n\
   * @description\n\
   * This method is getter / setter.\n\
   *\n\
   * Return path of current url when called without any parameter.\n\
   *\n\
   * Change path when called with parameter and return `$location`.\n\
   *\n\
   * Note: Path should always begin with forward slash (/), this method will add the forward slash\n\
   * if it is missing.\n\
   *\n\
   * @param {string=} path New path\n\
   * @return {string} path\n\
   */\n\
  path: locationGetterSetter('$$path', function(path) {\n\
    return path.charAt(0) == '/' ? path : '/' + path;\n\
  }),\n\
\n\
  /**\n\
   * @ngdoc method\n\
   * @name ng.$location#search\n\
   * @methodOf ng.$location\n\
   *\n\
   * @description\n\
   * This method is getter / setter.\n\
   *\n\
   * Return search part (as object) of current url when called without any parameter.\n\
   *\n\
   * Change search part when called with parameter and return `$location`.\n\
   *\n\
   * @param {string|object<string,string>=} search New search params - string or hash object\n\
   * @param {string=} paramValue If `search` is a string, then `paramValue` will override only a\n\
   *    single search parameter. If the value is `null`, the parameter will be deleted.\n\
   *\n\
   * @return {string} search\n\
   */\n\
  search: function(search, paramValue) {\n\
    if (isUndefined(search))\n\
      return this.$$search;\n\
\n\
    if (isDefined(paramValue)) {\n\
      if (paramValue === null) {\n\
        delete this.$$search[search];\n\
      } else {\n\
        this.$$search[search] = paramValue;\n\
      }\n\
    } else {\n\
      this.$$search = isString(search) ? parseKeyValue(search) : search;\n\
    }\n\
\n\
    this.$$compose();\n\
    return this;\n\
  },\n\
\n\
  /**\n\
   * @ngdoc method\n\
   * @name ng.$location#hash\n\
   * @methodOf ng.$location\n\
   *\n\
   * @description\n\
   * This method is getter / setter.\n\
   *\n\
   * Return hash fragment when called without any parameter.\n\
   *\n\
   * Change hash fragment when called with parameter and return `$location`.\n\
   *\n\
   * @param {string=} hash New hash fragment\n\
   * @return {string} hash\n\
   */\n\
  hash: locationGetterSetter('$$hash', identity),\n\
\n\
  /**\n\
   * @ngdoc method\n\
   * @name ng.$location#replace\n\
   * @methodOf ng.$location\n\
   *\n\
   * @description\n\
   * If called, all changes to $location during current `$digest` will be replacing current history\n\
   * record, instead of adding new one.\n\
   */\n\
  replace: function() {\n\
    this.$$replace = true;\n\
    return this;\n\
  }\n\
};\n\
\n\
function locationGetter(property) {\n\
  return function() {\n\
    return this[property];\n\
  };\n\
}\n\
\n\
\n\
function locationGetterSetter(property, preprocess) {\n\
  return function(value) {\n\
    if (isUndefined(value))\n\
      return this[property];\n\
\n\
    this[property] = preprocess(value);\n\
    this.$$compose();\n\
\n\
    return this;\n\
  };\n\
}\n\
\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.$location\n\
 *\n\
 * @requires $browser\n\
 * @requires $sniffer\n\
 * @requires $rootElement\n\
 *\n\
 * @description\n\
 * The $location service parses the URL in the browser address bar (based on the\n\
 * {@link https://developer.mozilla.org/en/window.location window.location}) and makes the URL\n\
 * available to your application. Changes to the URL in the address bar are reflected into\n\
 * $location service and changes to $location are reflected into the browser address bar.\n\
 *\n\
 * **The $location service:**\n\
 *\n\
 * - Exposes the current URL in the browser address bar, so you can\n\
 *   - Watch and observe the URL.\n\
 *   - Change the URL.\n\
 * - Synchronizes the URL with the browser when the user\n\
 *   - Changes the address bar.\n\
 *   - Clicks the back or forward button (or clicks a History link).\n\
 *   - Clicks on a link.\n\
 * - Represents the URL object as a set of methods (protocol, host, port, path, search, hash).\n\
 *\n\
 * For more information see {@link guide/dev_guide.services.$location Developer Guide: Angular\n\
 * Services: Using $location}\n\
 */\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.$locationProvider\n\
 * @description\n\
 * Use the `$locationProvider` to configure how the application deep linking paths are stored.\n\
 */\n\
function $LocationProvider(){\n\
  var hashPrefix = '',\n\
      html5Mode = false;\n\
\n\
  /**\n\
   * @ngdoc property\n\
   * @name ng.$locationProvider#hashPrefix\n\
   * @methodOf ng.$locationProvider\n\
   * @description\n\
   * @param {string=} prefix Prefix for hash part (containing path and search)\n\
   * @returns {*} current value if used as getter or itself (chaining) if used as setter\n\
   */\n\
  this.hashPrefix = function(prefix) {\n\
    if (isDefined(prefix)) {\n\
      hashPrefix = prefix;\n\
      return this;\n\
    } else {\n\
      return hashPrefix;\n\
    }\n\
  };\n\
\n\
  /**\n\
   * @ngdoc property\n\
   * @name ng.$locationProvider#html5Mode\n\
   * @methodOf ng.$locationProvider\n\
   * @description\n\
   * @param {string=} mode Use HTML5 strategy if available.\n\
   * @returns {*} current value if used as getter or itself (chaining) if used as setter\n\
   */\n\
  this.html5Mode = function(mode) {\n\
    if (isDefined(mode)) {\n\
      html5Mode = mode;\n\
      return this;\n\
    } else {\n\
      return html5Mode;\n\
    }\n\
  };\n\
\n\
  this.$get = ['$rootScope', '$browser', '$sniffer', '$rootElement',\n\
      function( $rootScope,   $browser,   $sniffer,   $rootElement) {\n\
    var $location,\n\
        LocationMode,\n\
        baseHref = $browser.baseHref(),\n\
        initialUrl = $browser.url(),\n\
        appBase;\n\
\n\
    if (html5Mode) {\n\
      appBase = baseHref ? serverBase(initialUrl) + baseHref : initialUrl;\n\
      LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url;\n\
    } else {\n\
      appBase = stripHash(initialUrl);\n\
      LocationMode = LocationHashbangUrl;\n\
    }\n\
    $location = new LocationMode(appBase, '#' + hashPrefix);\n\
    $location.$$parse($location.$$rewrite(initialUrl));\n\
\n\
    $rootElement.bind('click', function(event) {\n\
      // TODO(vojta): rewrite link when opening in new tab/window (in legacy browser)\n\
      // currently we open nice url link and redirect then\n\
\n\
      if (event.ctrlKey || event.metaKey || event.which == 2) return;\n\
\n\
      var elm = jqLite(event.target);\n\
\n\
      // traverse the DOM up to find first A tag\n\
      while (lowercase(elm[0].nodeName) !== 'a') {\n\
        // ignore rewriting if no A tag (reached root element, or no parent - removed from document)\n\
        if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0]) return;\n\
      }\n\
\n\
      var absHref = elm.prop('href');\n\
      var rewrittenUrl = $location.$$rewrite(absHref);\n\
\n\
      if (absHref && !elm.attr('target') && rewrittenUrl && !event.isDefaultPrevented()) {\n\
        event.preventDefault();\n\
        if (rewrittenUrl != $browser.url()) {\n\
          // update location manually\n\
          $location.$$parse(rewrittenUrl);\n\
          $rootScope.$apply();\n\
          // hack to work around FF6 bug 684208 when scenario runner clicks on links\n\
          window.angular['ff-684208-preventDefault'] = true;\n\
        }\n\
      }\n\
    });\n\
\n\
\n\
    // rewrite hashbang url <> html5 url\n\
    if ($location.absUrl() != initialUrl) {\n\
      $browser.url($location.absUrl(), true);\n\
    }\n\
\n\
    // update $location when $browser url changes\n\
    $browser.onUrlChange(function(newUrl) {\n\
      if ($location.absUrl() != newUrl) {\n\
        if ($rootScope.$broadcast('$locationChangeStart', newUrl, $location.absUrl()).defaultPrevented) {\n\
          $browser.url($location.absUrl());\n\
          return;\n\
        }\n\
        $rootScope.$evalAsync(function() {\n\
          var oldUrl = $location.absUrl();\n\
\n\
          $location.$$parse(newUrl);\n\
          afterLocationChange(oldUrl);\n\
        });\n\
        if (!$rootScope.$$phase) $rootScope.$digest();\n\
      }\n\
    });\n\
\n\
    // update browser\n\
    var changeCounter = 0;\n\
    $rootScope.$watch(function $locationWatch() {\n\
      var oldUrl = $browser.url();\n\
      var currentReplace = $location.$$replace;\n\
\n\
      if (!changeCounter || oldUrl != $location.absUrl()) {\n\
        changeCounter++;\n\
        $rootScope.$evalAsync(function() {\n\
          if ($rootScope.$broadcast('$locationChangeStart', $location.absUrl(), oldUrl).\n\
              defaultPrevented) {\n\
            $location.$$parse(oldUrl);\n\
          } else {\n\
            $browser.url($location.absUrl(), currentReplace);\n\
            afterLocationChange(oldUrl);\n\
          }\n\
        });\n\
      }\n\
      $location.$$replace = false;\n\
\n\
      return changeCounter;\n\
    });\n\
\n\
    return $location;\n\
\n\
    function afterLocationChange(oldUrl) {\n\
      $rootScope.$broadcast('$locationChangeSuccess', $location.absUrl(), oldUrl);\n\
    }\n\
}];\n\
}\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.$log\n\
 * @requires $window\n\
 *\n\
 * @description\n\
 * Simple service for logging. Default implementation writes the message\n\
 * into the browser's console (if present).\n\
 *\n\
 * The main purpose of this service is to simplify debugging and troubleshooting.\n\
 *\n\
 * @example\n\
   <example>\n\
     <file name=\"script.js\">\n\
       function LogCtrl($scope, $log) {\n\
         $scope.$log = $log;\n\
         $scope.message = 'Hello World!';\n\
       }\n\
     </file>\n\
     <file name=\"index.html\">\n\
       <div ng-controller=\"LogCtrl\">\n\
         <p>Reload this page with open console, enter text and hit the log button...</p>\n\
         Message:\n\
         <input type=\"text\" ng-model=\"message\"/>\n\
         <button ng-click=\"$log.log(message)\">log</button>\n\
         <button ng-click=\"$log.warn(message)\">warn</button>\n\
         <button ng-click=\"$log.info(message)\">info</button>\n\
         <button ng-click=\"$log.error(message)\">error</button>\n\
       </div>\n\
     </file>\n\
   </example>\n\
 */\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.$logProvider\n\
 * @description\n\
 * Use the `$logProvider` to configure how the application logs messages\n\
 */\n\
function $LogProvider(){\n\
  var debug = true,\n\
      self = this;\n\
  \n\
  /**\n\
   * @ngdoc property\n\
   * @name ng.$logProvider#debugEnabled\n\
   * @methodOf ng.$logProvider\n\
   * @description\n\
   * @param {string=} flag enable or disable debug level messages\n\
   * @returns {*} current value if used as getter or itself (chaining) if used as setter\n\
   */\n\
  this.debugEnabled = function(flag) {\n\
    if (isDefined(flag)) {\n\
      debug = flag;\n\
      return this;\n\
    } else {\n\
      return debug;\n\
    }\n\
  };\n\
  \n\
  this.$get = ['$window', function($window){\n\
    return {\n\
      /**\n\
       * @ngdoc method\n\
       * @name ng.$log#log\n\
       * @methodOf ng.$log\n\
       *\n\
       * @description\n\
       * Write a log message\n\
       */\n\
      log: consoleLog('log'),\n\
\n\
      /**\n\
       * @ngdoc method\n\
       * @name ng.$log#warn\n\
       * @methodOf ng.$log\n\
       *\n\
       * @description\n\
       * Write a warning message\n\
       */\n\
      warn: consoleLog('warn'),\n\
\n\
      /**\n\
       * @ngdoc method\n\
       * @name ng.$log#info\n\
       * @methodOf ng.$log\n\
       *\n\
       * @description\n\
       * Write an information message\n\
       */\n\
      info: consoleLog('info'),\n\
\n\
      /**\n\
       * @ngdoc method\n\
       * @name ng.$log#error\n\
       * @methodOf ng.$log\n\
       *\n\
       * @description\n\
       * Write an error message\n\
       */\n\
      error: consoleLog('error'),\n\
      \n\
      /**\n\
       * @ngdoc method\n\
       * @name ng.$log#debug\n\
       * @methodOf ng.$log\n\
       * \n\
       * @description\n\
       * Write a debug message\n\
       */\n\
      debug: (function () {\n\
      var fn = consoleLog('debug');\n\
      \n\
      return function() {\n\
        if (debug) {\n\
          fn.apply(self, arguments);\n\
        }\n\
      }\n\
      }())\n\
    };\n\
\n\
    function formatError(arg) {\n\
      if (arg instanceof Error) {\n\
        if (arg.stack) {\n\
          arg = (arg.message && arg.stack.indexOf(arg.message) === -1)\n\
              ? 'Error: ' + arg.message + '\\n\
' + arg.stack\n\
              : arg.stack;\n\
        } else if (arg.sourceURL) {\n\
          arg = arg.message + '\\n\
' + arg.sourceURL + ':' + arg.line;\n\
        }\n\
      }\n\
      return arg;\n\
    }\n\
\n\
    function consoleLog(type) {\n\
      var console = $window.console || {},\n\
          logFn = console[type] || console.log || noop;\n\
\n\
      if (logFn.apply) {\n\
        return function() {\n\
          var args = [];\n\
          forEach(arguments, function(arg) {\n\
            args.push(formatError(arg));\n\
          });\n\
          return logFn.apply(console, args);\n\
        };\n\
      }\n\
\n\
      // we are IE which either doesn't have window.console => this is noop and we do nothing,\n\
      // or we are IE where console.log doesn't have apply so we log at least first 2 args\n\
      return function(arg1, arg2) {\n\
        logFn(arg1, arg2);\n\
      }\n\
    }\n\
  }];\n\
}\n\
\n\
var OPERATORS = {\n\
    'null':function(){return null;},\n\
    'true':function(){return true;},\n\
    'false':function(){return false;},\n\
    undefined:noop,\n\
    '+':function(self, locals, a,b){\n\
      a=a(self, locals); b=b(self, locals);\n\
      if (isDefined(a)) {\n\
        if (isDefined(b)) {\n\
          return a + b;\n\
        }\n\
        return a;\n\
      }\n\
      return isDefined(b)?b:undefined;},\n\
    '-':function(self, locals, a,b){a=a(self, locals); b=b(self, locals); return (isDefined(a)?a:0)-(isDefined(b)?b:0);},\n\
    '*':function(self, locals, a,b){return a(self, locals)*b(self, locals);},\n\
    '/':function(self, locals, a,b){return a(self, locals)/b(self, locals);},\n\
    '%':function(self, locals, a,b){return a(self, locals)%b(self, locals);},\n\
    '^':function(self, locals, a,b){return a(self, locals)^b(self, locals);},\n\
    '=':noop,\n\
    '===':function(self, locals, a, b){return a(self, locals)===b(self, locals);},\n\
    '!==':function(self, locals, a, b){return a(self, locals)!==b(self, locals);},\n\
    '==':function(self, locals, a,b){return a(self, locals)==b(self, locals);},\n\
    '!=':function(self, locals, a,b){return a(self, locals)!=b(self, locals);},\n\
    '<':function(self, locals, a,b){return a(self, locals)<b(self, locals);},\n\
    '>':function(self, locals, a,b){return a(self, locals)>b(self, locals);},\n\
    '<=':function(self, locals, a,b){return a(self, locals)<=b(self, locals);},\n\
    '>=':function(self, locals, a,b){return a(self, locals)>=b(self, locals);},\n\
    '&&':function(self, locals, a,b){return a(self, locals)&&b(self, locals);},\n\
    '||':function(self, locals, a,b){return a(self, locals)||b(self, locals);},\n\
    '&':function(self, locals, a,b){return a(self, locals)&b(self, locals);},\n\
//    '|':function(self, locals, a,b){return a|b;},\n\
    '|':function(self, locals, a,b){return b(self, locals)(self, locals, a(self, locals));},\n\
    '!':function(self, locals, a){return !a(self, locals);}\n\
};\n\
var ESCAPE = {\"n\":\"\\n\
\", \"f\":\"\\f\", \"r\":\"\\r\", \"t\":\"\\t\", \"v\":\"\\v\", \"'\":\"'\", '\"':'\"'};\n\
\n\
function lex(text, csp){\n\
  var tokens = [],\n\
      token,\n\
      index = 0,\n\
      json = [],\n\
      ch,\n\
      lastCh = ':'; // can start regexp\n\
\n\
  while (index < text.length) {\n\
    ch = text.charAt(index);\n\
    if (is('\"\\'')) {\n\
      readString(ch);\n\
    } else if (isNumber(ch) || is('.') && isNumber(peek())) {\n\
      readNumber();\n\
    } else if (isIdent(ch)) {\n\
      readIdent();\n\
      // identifiers can only be if the preceding char was a { or ,\n\
      if (was('{,') && json[0]=='{' &&\n\
         (token=tokens[tokens.length-1])) {\n\
        token.json = token.text.indexOf('.') == -1;\n\
      }\n\
    } else if (is('(){}[].,;:?')) {\n\
      tokens.push({\n\
        index:index,\n\
        text:ch,\n\
        json:(was(':[,') && is('{[')) || is('}]:,')\n\
      });\n\
      if (is('{[')) json.unshift(ch);\n\
      if (is('}]')) json.shift();\n\
      index++;\n\
    } else if (isWhitespace(ch)) {\n\
      index++;\n\
      continue;\n\
    } else {\n\
      var ch2 = ch + peek(),\n\
          ch3 = ch2 + peek(2),\n\
          fn = OPERATORS[ch],\n\
          fn2 = OPERATORS[ch2],\n\
          fn3 = OPERATORS[ch3];\n\
      if (fn3) {\n\
        tokens.push({index:index, text:ch3, fn:fn3});\n\
        index += 3;\n\
      } else if (fn2) {\n\
        tokens.push({index:index, text:ch2, fn:fn2});\n\
        index += 2;\n\
      } else if (fn) {\n\
        tokens.push({index:index, text:ch, fn:fn, json: was('[,:') && is('+-')});\n\
        index += 1;\n\
      } else {\n\
        throwError(\"Unexpected next character \", index, index+1);\n\
      }\n\
    }\n\
    lastCh = ch;\n\
  }\n\
  return tokens;\n\
\n\
  function is(chars) {\n\
    return chars.indexOf(ch) != -1;\n\
  }\n\
\n\
  function was(chars) {\n\
    return chars.indexOf(lastCh) != -1;\n\
  }\n\
\n\
  function peek(i) {\n\
    var num = i || 1;\n\
    return index + num < text.length ? text.charAt(index + num) : false;\n\
  }\n\
  function isNumber(ch) {\n\
    return '0' <= ch && ch <= '9';\n\
  }\n\
  function isWhitespace(ch) {\n\
    return ch == ' ' || ch == '\\r' || ch == '\\t' ||\n\
           ch == '\\n\
' || ch == '\\v' || ch == '\\u00A0'; // IE treats non-breaking space as \\u00A0\n\
  }\n\
  function isIdent(ch) {\n\
    return 'a' <= ch && ch <= 'z' ||\n\
           'A' <= ch && ch <= 'Z' ||\n\
           '_' == ch || ch == '$';\n\
  }\n\
  function isExpOperator(ch) {\n\
    return ch == '-' || ch == '+' || isNumber(ch);\n\
  }\n\
\n\
  function throwError(error, start, end) {\n\
    end = end || index;\n\
    throw Error(\"Lexer Error: \" + error + \" at column\" +\n\
        (isDefined(start)\n\
            ? \"s \" + start +  \"-\" + index + \" [\" + text.substring(start, end) + \"]\"\n\
            : \" \" + end) +\n\
        \" in expression [\" + text + \"].\");\n\
  }\n\
\n\
  function readNumber() {\n\
    var number = \"\";\n\
    var start = index;\n\
    while (index < text.length) {\n\
      var ch = lowercase(text.charAt(index));\n\
      if (ch == '.' || isNumber(ch)) {\n\
        number += ch;\n\
      } else {\n\
        var peekCh = peek();\n\
        if (ch == 'e' && isExpOperator(peekCh)) {\n\
          number += ch;\n\
        } else if (isExpOperator(ch) &&\n\
            peekCh && isNumber(peekCh) &&\n\
            number.charAt(number.length - 1) == 'e') {\n\
          number += ch;\n\
        } else if (isExpOperator(ch) &&\n\
            (!peekCh || !isNumber(peekCh)) &&\n\
            number.charAt(number.length - 1) == 'e') {\n\
          throwError('Invalid exponent');\n\
        } else {\n\
          break;\n\
        }\n\
      }\n\
      index++;\n\
    }\n\
    number = 1 * number;\n\
    tokens.push({index:start, text:number, json:true,\n\
      fn:function() {return number;}});\n\
  }\n\
  function readIdent() {\n\
    var ident = \"\",\n\
        start = index,\n\
        lastDot, peekIndex, methodName, ch;\n\
\n\
    while (index < text.length) {\n\
      ch = text.charAt(index);\n\
      if (ch == '.' || isIdent(ch) || isNumber(ch)) {\n\
        if (ch == '.') lastDot = index;\n\
        ident += ch;\n\
      } else {\n\
        break;\n\
      }\n\
      index++;\n\
    }\n\
\n\
    //check if this is not a method invocation and if it is back out to last dot\n\
    if (lastDot) {\n\
      peekIndex = index;\n\
      while(peekIndex < text.length) {\n\
        ch = text.charAt(peekIndex);\n\
        if (ch == '(') {\n\
          methodName = ident.substr(lastDot - start + 1);\n\
          ident = ident.substr(0, lastDot - start);\n\
          index = peekIndex;\n\
          break;\n\
        }\n\
        if(isWhitespace(ch)) {\n\
          peekIndex++;\n\
        } else {\n\
          break;\n\
        }\n\
      }\n\
    }\n\
\n\
\n\
    var token = {\n\
      index:start,\n\
      text:ident\n\
    };\n\
\n\
    if (OPERATORS.hasOwnProperty(ident)) {\n\
      token.fn = token.json = OPERATORS[ident];\n\
    } else {\n\
      var getter = getterFn(ident, csp);\n\
      token.fn = extend(function(self, locals) {\n\
        return (getter(self, locals));\n\
      }, {\n\
        assign: function(self, value) {\n\
          return setter(self, ident, value);\n\
        }\n\
      });\n\
    }\n\
\n\
    tokens.push(token);\n\
\n\
    if (methodName) {\n\
      tokens.push({\n\
        index:lastDot,\n\
        text: '.',\n\
        json: false\n\
      });\n\
      tokens.push({\n\
        index: lastDot + 1,\n\
        text: methodName,\n\
        json: false\n\
      });\n\
    }\n\
  }\n\
\n\
  function readString(quote) {\n\
    var start = index;\n\
    index++;\n\
    var string = \"\";\n\
    var rawString = quote;\n\
    var escape = false;\n\
    while (index < text.length) {\n\
      var ch = text.charAt(index);\n\
      rawString += ch;\n\
      if (escape) {\n\
        if (ch == 'u') {\n\
          var hex = text.substring(index + 1, index + 5);\n\
          if (!hex.match(/[\\da-f]{4}/i))\n\
            throwError( \"Invalid unicode escape [\\\\u\" + hex + \"]\");\n\
          index += 4;\n\
          string += String.fromCharCode(parseInt(hex, 16));\n\
        } else {\n\
          var rep = ESCAPE[ch];\n\
          if (rep) {\n\
            string += rep;\n\
          } else {\n\
            string += ch;\n\
          }\n\
        }\n\
        escape = false;\n\
      } else if (ch == '\\\\') {\n\
        escape = true;\n\
      } else if (ch == quote) {\n\
        index++;\n\
        tokens.push({\n\
          index:start,\n\
          text:rawString,\n\
          string:string,\n\
          json:true,\n\
          fn:function() { return string; }\n\
        });\n\
        return;\n\
      } else {\n\
        string += ch;\n\
      }\n\
      index++;\n\
    }\n\
    throwError(\"Unterminated quote\", start);\n\
  }\n\
}\n\
\n\
/////////////////////////////////////////\n\
\n\
function parser(text, json, $filter, csp){\n\
  var ZERO = valueFn(0),\n\
      value,\n\
      tokens = lex(text, csp),\n\
      assignment = _assignment,\n\
      functionCall = _functionCall,\n\
      fieldAccess = _fieldAccess,\n\
      objectIndex = _objectIndex,\n\
      filterChain = _filterChain;\n\
\n\
  if(json){\n\
    // The extra level of aliasing is here, just in case the lexer misses something, so that\n\
    // we prevent any accidental execution in JSON.\n\
    assignment = logicalOR;\n\
    functionCall =\n\
      fieldAccess =\n\
      objectIndex =\n\
      filterChain =\n\
        function() { throwError(\"is not valid json\", {text:text, index:0}); };\n\
    value = primary();\n\
  } else {\n\
    value = statements();\n\
  }\n\
  if (tokens.length !== 0) {\n\
    throwError(\"is an unexpected token\", tokens[0]);\n\
  }\n\
  value.literal = !!value.literal;\n\
  value.constant = !!value.constant;\n\
  return value;\n\
\n\
  ///////////////////////////////////\n\
  function throwError(msg, token) {\n\
    throw Error(\"Syntax Error: Token '\" + token.text +\n\
      \"' \" + msg + \" at column \" +\n\
      (token.index + 1) + \" of the expression [\" +\n\
      text + \"] starting at [\" + text.substring(token.index) + \"].\");\n\
  }\n\
\n\
  function peekToken() {\n\
    if (tokens.length === 0)\n\
      throw Error(\"Unexpected end of expression: \" + text);\n\
    return tokens[0];\n\
  }\n\
\n\
  function peek(e1, e2, e3, e4) {\n\
    if (tokens.length > 0) {\n\
      var token = tokens[0];\n\
      var t = token.text;\n\
      if (t==e1 || t==e2 || t==e3 || t==e4 ||\n\
          (!e1 && !e2 && !e3 && !e4)) {\n\
        return token;\n\
      }\n\
    }\n\
    return false;\n\
  }\n\
\n\
  function expect(e1, e2, e3, e4){\n\
    var token = peek(e1, e2, e3, e4);\n\
    if (token) {\n\
      if (json && !token.json) {\n\
        throwError(\"is not valid json\", token);\n\
      }\n\
      tokens.shift();\n\
      return token;\n\
    }\n\
    return false;\n\
  }\n\
\n\
  function consume(e1){\n\
    if (!expect(e1)) {\n\
      throwError(\"is unexpected, expecting [\" + e1 + \"]\", peek());\n\
    }\n\
  }\n\
\n\
  function unaryFn(fn, right) {\n\
    return extend(function(self, locals) {\n\
      return fn(self, locals, right);\n\
    }, {\n\
      constant:right.constant\n\
    });\n\
  }\n\
\n\
  function ternaryFn(left, middle, right){\n\
    return extend(function(self, locals){\n\
      return left(self, locals) ? middle(self, locals) : right(self, locals);\n\
    }, {\n\
      constant: left.constant && middle.constant && right.constant\n\
    });\n\
  }\n\
  \n\
  function binaryFn(left, fn, right) {\n\
    return extend(function(self, locals) {\n\
      return fn(self, locals, left, right);\n\
    }, {\n\
      constant:left.constant && right.constant\n\
    });\n\
  }\n\
\n\
  function statements() {\n\
    var statements = [];\n\
    while(true) {\n\
      if (tokens.length > 0 && !peek('}', ')', ';', ']'))\n\
        statements.push(filterChain());\n\
      if (!expect(';')) {\n\
        // optimize for the common case where there is only one statement.\n\
        // TODO(size): maybe we should not support multiple statements?\n\
        return statements.length == 1\n\
          ? statements[0]\n\
          : function(self, locals){\n\
            var value;\n\
            for ( var i = 0; i < statements.length; i++) {\n\
              var statement = statements[i];\n\
              if (statement)\n\
                value = statement(self, locals);\n\
            }\n\
            return value;\n\
          };\n\
      }\n\
    }\n\
  }\n\
\n\
  function _filterChain() {\n\
    var left = expression();\n\
    var token;\n\
    while(true) {\n\
      if ((token = expect('|'))) {\n\
        left = binaryFn(left, token.fn, filter());\n\
      } else {\n\
        return left;\n\
      }\n\
    }\n\
  }\n\
\n\
  function filter() {\n\
    var token = expect();\n\
    var fn = $filter(token.text);\n\
    var argsFn = [];\n\
    while(true) {\n\
      if ((token = expect(':'))) {\n\
        argsFn.push(expression());\n\
      } else {\n\
        var fnInvoke = function(self, locals, input){\n\
          var args = [input];\n\
          for ( var i = 0; i < argsFn.length; i++) {\n\
            args.push(argsFn[i](self, locals));\n\
          }\n\
          return fn.apply(self, args);\n\
        };\n\
        return function() {\n\
          return fnInvoke;\n\
        };\n\
      }\n\
    }\n\
  }\n\
\n\
  function expression() {\n\
    return assignment();\n\
  }\n\
\n\
  function _assignment() {\n\
    var left = ternary();\n\
    var right;\n\
    var token;\n\
    if ((token = expect('='))) {\n\
      if (!left.assign) {\n\
        throwError(\"implies assignment but [\" +\n\
          text.substring(0, token.index) + \"] can not be assigned to\", token);\n\
      }\n\
      right = ternary();\n\
      return function(scope, locals){\n\
        return left.assign(scope, right(scope, locals), locals);\n\
      };\n\
    } else {\n\
      return left;\n\
    }\n\
  }\n\
\n\
  function ternary() {\n\
    var left = logicalOR();\n\
    var middle;\n\
    var token;\n\
    if((token = expect('?'))){\n\
      middle = ternary();\n\
      if((token = expect(':'))){\n\
        return ternaryFn(left, middle, ternary());\n\
      }\n\
      else {\n\
        throwError('expected :', token);\n\
      }\n\
    }\n\
    else {\n\
      return left;\n\
    }\n\
  }\n\
  \n\
  function logicalOR() {\n\
    var left = logicalAND();\n\
    var token;\n\
    while(true) {\n\
      if ((token = expect('||'))) {\n\
        left = binaryFn(left, token.fn, logicalAND());\n\
      } else {\n\
        return left;\n\
      }\n\
    }\n\
  }\n\
\n\
  function logicalAND() {\n\
    var left = equality();\n\
    var token;\n\
    if ((token = expect('&&'))) {\n\
      left = binaryFn(left, token.fn, logicalAND());\n\
    }\n\
    return left;\n\
  }\n\
\n\
  function equality() {\n\
    var left = relational();\n\
    var token;\n\
    if ((token = expect('==','!=','===','!=='))) {\n\
      left = binaryFn(left, token.fn, equality());\n\
    }\n\
    return left;\n\
  }\n\
\n\
  function relational() {\n\
    var left = additive();\n\
    var token;\n\
    if ((token = expect('<', '>', '<=', '>='))) {\n\
      left = binaryFn(left, token.fn, relational());\n\
    }\n\
    return left;\n\
  }\n\
\n\
  function additive() {\n\
    var left = multiplicative();\n\
    var token;\n\
    while ((token = expect('+','-'))) {\n\
      left = binaryFn(left, token.fn, multiplicative());\n\
    }\n\
    return left;\n\
  }\n\
\n\
  function multiplicative() {\n\
    var left = unary();\n\
    var token;\n\
    while ((token = expect('*','/','%'))) {\n\
      left = binaryFn(left, token.fn, unary());\n\
    }\n\
    return left;\n\
  }\n\
\n\
  function unary() {\n\
    var token;\n\
    if (expect('+')) {\n\
      return primary();\n\
    } else if ((token = expect('-'))) {\n\
      return binaryFn(ZERO, token.fn, unary());\n\
    } else if ((token = expect('!'))) {\n\
      return unaryFn(token.fn, unary());\n\
    } else {\n\
      return primary();\n\
    }\n\
  }\n\
\n\
\n\
  function primary() {\n\
    var primary;\n\
    if (expect('(')) {\n\
      primary = filterChain();\n\
      consume(')');\n\
    } else if (expect('[')) {\n\
      primary = arrayDeclaration();\n\
    } else if (expect('{')) {\n\
      primary = object();\n\
    } else {\n\
      var token = expect();\n\
      primary = token.fn;\n\
      if (!primary) {\n\
        throwError(\"not a primary expression\", token);\n\
      }\n\
      if (token.json) {\n\
        primary.constant = primary.literal = true;\n\
      }\n\
    }\n\
\n\
    var next, context;\n\
    while ((next = expect('(', '[', '.'))) {\n\
      if (next.text === '(') {\n\
        primary = functionCall(primary, context);\n\
        context = null;\n\
      } else if (next.text === '[') {\n\
        context = primary;\n\
        primary = objectIndex(primary);\n\
      } else if (next.text === '.') {\n\
        context = primary;\n\
        primary = fieldAccess(primary);\n\
      } else {\n\
        throwError(\"IMPOSSIBLE\");\n\
      }\n\
    }\n\
    return primary;\n\
  }\n\
\n\
  function _fieldAccess(object) {\n\
    var field = expect().text;\n\
    var getter = getterFn(field, csp);\n\
    return extend(\n\
        function(scope, locals, self) {\n\
          return getter(self || object(scope, locals), locals);\n\
        },\n\
        {\n\
          assign:function(scope, value, locals) {\n\
            return setter(object(scope, locals), field, value);\n\
          }\n\
        }\n\
    );\n\
  }\n\
\n\
  function _objectIndex(obj) {\n\
    var indexFn = expression();\n\
    consume(']');\n\
    return extend(\n\
      function(self, locals){\n\
        var o = obj(self, locals),\n\
            i = indexFn(self, locals),\n\
            v, p;\n\
\n\
        if (!o) return undefined;\n\
        v = o[i];\n\
        if (v && v.then) {\n\
          p = v;\n\
          if (!('$$v' in v)) {\n\
            p.$$v = undefined;\n\
            p.then(function(val) { p.$$v = val; });\n\
          }\n\
          v = v.$$v;\n\
        }\n\
        return v;\n\
      }, {\n\
        assign:function(self, value, locals){\n\
          return obj(self, locals)[indexFn(self, locals)] = value;\n\
        }\n\
      });\n\
  }\n\
\n\
  function _functionCall(fn, contextGetter) {\n\
    var argsFn = [];\n\
    if (peekToken().text != ')') {\n\
      do {\n\
        argsFn.push(expression());\n\
      } while (expect(','));\n\
    }\n\
    consume(')');\n\
    return function(scope, locals){\n\
      var args = [],\n\
          context = contextGetter ? contextGetter(scope, locals) : scope;\n\
\n\
      for ( var i = 0; i < argsFn.length; i++) {\n\
        args.push(argsFn[i](scope, locals));\n\
      }\n\
      var fnPtr = fn(scope, locals, context) || noop;\n\
      // IE stupidity!\n\
      return fnPtr.apply\n\
          ? fnPtr.apply(context, args)\n\
          : fnPtr(args[0], args[1], args[2], args[3], args[4]);\n\
    };\n\
  }\n\
\n\
  // This is used with json array declaration\n\
  function arrayDeclaration () {\n\
    var elementFns = [];\n\
    var allConstant = true;\n\
    if (peekToken().text != ']') {\n\
      do {\n\
        var elementFn = expression();\n\
        elementFns.push(elementFn);\n\
        if (!elementFn.constant) {\n\
          allConstant = false;\n\
        }\n\
      } while (expect(','));\n\
    }\n\
    consume(']');\n\
    return extend(function(self, locals){\n\
      var array = [];\n\
      for ( var i = 0; i < elementFns.length; i++) {\n\
        array.push(elementFns[i](self, locals));\n\
      }\n\
      return array;\n\
    }, {\n\
      literal:true,\n\
      constant:allConstant\n\
    });\n\
  }\n\
\n\
  function object () {\n\
    var keyValues = [];\n\
    var allConstant = true;\n\
    if (peekToken().text != '}') {\n\
      do {\n\
        var token = expect(),\n\
        key = token.string || token.text;\n\
        consume(\":\");\n\
        var value = expression();\n\
        keyValues.push({key:key, value:value});\n\
        if (!value.constant) {\n\
          allConstant = false;\n\
        }\n\
      } while (expect(','));\n\
    }\n\
    consume('}');\n\
    return extend(function(self, locals){\n\
      var object = {};\n\
      for ( var i = 0; i < keyValues.length; i++) {\n\
        var keyValue = keyValues[i];\n\
        object[keyValue.key] = keyValue.value(self, locals);\n\
      }\n\
      return object;\n\
    }, {\n\
      literal:true,\n\
      constant:allConstant\n\
    });\n\
  }\n\
}\n\
\n\
//////////////////////////////////////////////////\n\
// Parser helper functions\n\
//////////////////////////////////////////////////\n\
\n\
function setter(obj, path, setValue) {\n\
  var element = path.split('.');\n\
  for (var i = 0; element.length > 1; i++) {\n\
    var key = element.shift();\n\
    var propertyObj = obj[key];\n\
    if (!propertyObj) {\n\
      propertyObj = {};\n\
      obj[key] = propertyObj;\n\
    }\n\
    obj = propertyObj;\n\
  }\n\
  obj[element.shift()] = setValue;\n\
  return setValue;\n\
}\n\
\n\
/**\n\
 * Return the value accessible from the object by path. Any undefined traversals are ignored\n\
 * @param {Object} obj starting object\n\
 * @param {string} path path to traverse\n\
 * @param {boolean=true} bindFnToScope\n\
 * @returns value as accessible by path\n\
 */\n\
//TODO(misko): this function needs to be removed\n\
function getter(obj, path, bindFnToScope) {\n\
  if (!path) return obj;\n\
  var keys = path.split('.');\n\
  var key;\n\
  var lastInstance = obj;\n\
  var len = keys.length;\n\
\n\
  for (var i = 0; i < len; i++) {\n\
    key = keys[i];\n\
    if (obj) {\n\
      obj = (lastInstance = obj)[key];\n\
    }\n\
  }\n\
  if (!bindFnToScope && isFunction(obj)) {\n\
    return bind(lastInstance, obj);\n\
  }\n\
  return obj;\n\
}\n\
\n\
var getterFnCache = {};\n\
\n\
/**\n\
 * Implementation of the \"Black Hole\" variant from:\n\
 * - http://jsperf.com/angularjs-parse-getter/4\n\
 * - http://jsperf.com/path-evaluation-simplified/7\n\
 */\n\
function cspSafeGetterFn(key0, key1, key2, key3, key4) {\n\
  return function(scope, locals) {\n\
    var pathVal = (locals && locals.hasOwnProperty(key0)) ? locals : scope,\n\
        promise;\n\
\n\
    if (pathVal === null || pathVal === undefined) return pathVal;\n\
\n\
    pathVal = pathVal[key0];\n\
    if (pathVal && pathVal.then) {\n\
      if (!(\"$$v\" in pathVal)) {\n\
        promise = pathVal;\n\
        promise.$$v = undefined;\n\
        promise.then(function(val) { promise.$$v = val; });\n\
      }\n\
      pathVal = pathVal.$$v;\n\
    }\n\
    if (!key1 || pathVal === null || pathVal === undefined) return pathVal;\n\
\n\
    pathVal = pathVal[key1];\n\
    if (pathVal && pathVal.then) {\n\
      if (!(\"$$v\" in pathVal)) {\n\
        promise = pathVal;\n\
        promise.$$v = undefined;\n\
        promise.then(function(val) { promise.$$v = val; });\n\
      }\n\
      pathVal = pathVal.$$v;\n\
    }\n\
    if (!key2 || pathVal === null || pathVal === undefined) return pathVal;\n\
\n\
    pathVal = pathVal[key2];\n\
    if (pathVal && pathVal.then) {\n\
      if (!(\"$$v\" in pathVal)) {\n\
        promise = pathVal;\n\
        promise.$$v = undefined;\n\
        promise.then(function(val) { promise.$$v = val; });\n\
      }\n\
      pathVal = pathVal.$$v;\n\
    }\n\
    if (!key3 || pathVal === null || pathVal === undefined) return pathVal;\n\
\n\
    pathVal = pathVal[key3];\n\
    if (pathVal && pathVal.then) {\n\
      if (!(\"$$v\" in pathVal)) {\n\
        promise = pathVal;\n\
        promise.$$v = undefined;\n\
        promise.then(function(val) { promise.$$v = val; });\n\
      }\n\
      pathVal = pathVal.$$v;\n\
    }\n\
    if (!key4 || pathVal === null || pathVal === undefined) return pathVal;\n\
\n\
    pathVal = pathVal[key4];\n\
    if (pathVal && pathVal.then) {\n\
      if (!(\"$$v\" in pathVal)) {\n\
        promise = pathVal;\n\
        promise.$$v = undefined;\n\
        promise.then(function(val) { promise.$$v = val; });\n\
      }\n\
      pathVal = pathVal.$$v;\n\
    }\n\
    return pathVal;\n\
  };\n\
}\n\
\n\
function getterFn(path, csp) {\n\
  if (getterFnCache.hasOwnProperty(path)) {\n\
    return getterFnCache[path];\n\
  }\n\
\n\
  var pathKeys = path.split('.'),\n\
      pathKeysLength = pathKeys.length,\n\
      fn;\n\
\n\
  if (csp) {\n\
    fn = (pathKeysLength < 6)\n\
        ? cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4])\n\
        : function(scope, locals) {\n\
          var i = 0, val;\n\
          do {\n\
            val = cspSafeGetterFn(\n\
                    pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++]\n\
                  )(scope, locals);\n\
\n\
            locals = undefined; // clear after first iteration\n\
            scope = val;\n\
          } while (i < pathKeysLength);\n\
          return val;\n\
        }\n\
  } else {\n\
    var code = 'var l, fn, p;\\n\
';\n\
    forEach(pathKeys, function(key, index) {\n\
      code += 'if(s === null || s === undefined) return s;\\n\
' +\n\
              'l=s;\\n\
' +\n\
              's='+ (index\n\
                      // we simply dereference 's' on any .dot notation\n\
                      ? 's'\n\
                      // but if we are first then we check locals first, and if so read it first\n\
                      : '((k&&k.hasOwnProperty(\"' + key + '\"))?k:s)') + '[\"' + key + '\"]' + ';\\n\
' +\n\
              'if (s && s.then) {\\n\
' +\n\
                ' if (!(\"$$v\" in s)) {\\n\
' +\n\
                  ' p=s;\\n\
' +\n\
                  ' p.$$v = undefined;\\n\
' +\n\
                  ' p.then(function(v) {p.$$v=v;});\\n\
' +\n\
                  '}\\n\
' +\n\
                ' s=s.$$v\\n\
' +\n\
              '}\\n\
';\n\
    });\n\
    code += 'return s;';\n\
    fn = Function('s', 'k', code); // s=scope, k=locals\n\
    fn.toString = function() { return code; };\n\
  }\n\
\n\
  return getterFnCache[path] = fn;\n\
}\n\
\n\
///////////////////////////////////\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name ng.$parse\n\
 * @function\n\
 *\n\
 * @description\n\
 *\n\
 * Converts Angular {@link guide/expression expression} into a function.\n\
 *\n\
 * <pre>\n\
 *   var getter = $parse('user.name');\n\
 *   var setter = getter.assign;\n\
 *   var context = {user:{name:'angular'}};\n\
 *   var locals = {user:{name:'local'}};\n\
 *\n\
 *   expect(getter(context)).toEqual('angular');\n\
 *   setter(context, 'newValue');\n\
 *   expect(context.user.name).toEqual('newValue');\n\
 *   expect(getter(context, locals)).toEqual('local');\n\
 * </pre>\n\
 *\n\
 *\n\
 * @param {string} expression String expression to compile.\n\
 * @returns {function(context, locals)} a function which represents the compiled expression:\n\
 *\n\
 *    * `context` â€“ `{object}` â€“ an object against which any expressions embedded in the strings\n\
 *      are evaluated against (typically a scope object).\n\
 *    * `locals` â€“ `{object=}` â€“ local variables context object, useful for overriding values in\n\
 *      `context`.\n\
 *\n\
 *    The returned function also has the following properties:\n\
 *      * `literal` â€“ `{boolean}` â€“ whether the expression's top-level node is a JavaScript\n\
 *        literal.\n\
 *      * `constant` â€“ `{boolean}` â€“ whether the expression is made entirely of JavaScript\n\
 *        constant literals.\n\
 *      * `assign` â€“ `{?function(context, value)}` â€“ if the expression is assignable, this will be\n\
 *        set to a function to change its value on the given context.\n\
 *\n\
 */\n\
function $ParseProvider() {\n\
  var cache = {};\n\
  this.$get = ['$filter', '$sniffer', function($filter, $sniffer) {\n\
    return function(exp) {\n\
      switch(typeof exp) {\n\
        case 'string':\n\
          return cache.hasOwnProperty(exp)\n\
            ? cache[exp]\n\
            : cache[exp] =  parser(exp, false, $filter, $sniffer.csp);\n\
        case 'function':\n\
          return exp;\n\
        default:\n\
          return noop;\n\
      }\n\
    };\n\
  }];\n\
}\n\
\n\
/**\n\
 * @ngdoc service\n\
 * @name ng.$q\n\
 * @requires $rootScope\n\
 *\n\
 * @description\n\
 * A promise/deferred implementation inspired by [Kris Kowal's Q](https://github.com/kriskowal/q).\n\
 *\n\
 * [The CommonJS Promise proposal](http://wiki.commonjs.org/wiki/Promises) describes a promise as an\n\
 * interface for interacting with an object that represents the result of an action that is\n\
 * performed asynchronously, and may or may not be finished at any given point in time.\n\
 *\n\
 * From the perspective of dealing with error handling, deferred and promise APIs are to\n\
 * asynchronous programming what `try`, `catch` and `throw` keywords are to synchronous programming.\n\
 *\n\
 * <pre>\n\
 *   // for the purpose of this example let's assume that variables `$q` and `scope` are\n\
 *   // available in the current lexical scope (they could have been injected or passed in).\n\
 *\n\
 *   function asyncGreet(name) {\n\
 *     var deferred = $q.defer();\n\
 *\n\
 *     setTimeout(function() {\n\
 *       // since this fn executes async in a future turn of the event loop, we need to wrap\n\
 *       // our code into an $apply call so that the model changes are properly observed.\n\
 *       scope.$apply(function() {\n\
 *         if (okToGreet(name)) {\n\
 *           deferred.resolve('Hello, ' + name + '!');\n\
 *         } else {\n\
 *           deferred.reject('Greeting ' + name + ' is not allowed.');\n\
 *         }\n\
 *       });\n\
 *     }, 1000);\n\
 *\n\
 *     return deferred.promise;\n\
 *   }\n\
 *\n\
 *   var promise = asyncGreet('Robin Hood');\n\
 *   promise.then(function(greeting) {\n\
 *     alert('Success: ' + greeting);\n\
 *   }, function(reason) {\n\
 *     alert('Failed: ' + reason);\n\
 *   });\n\
 * </pre>\n\
 *\n\
 * At first it might not be obvious why this extra complexity is worth the trouble. The payoff\n\
 * comes in the way of\n\
 * [guarantees that promise and deferred APIs make](https://github.com/kriskowal/uncommonjs/blob/master/promises/specification.md).\n\
 *\n\
 * Additionally the promise api allows for composition that is very hard to do with the\n\
 * traditional callback ([CPS](http://en.wikipedia.org/wiki/Continuation-passing_style)) approach.\n\
 * For more on this please see the [Q documentation](https://github.com/kriskowal/q) especially the\n\
 * section on serial or parallel joining of promises.\n\
 *\n\
 *\n\
 * # The Deferred API\n\
 *\n\
 * A new instance of deferred is constructed by calling `$q.defer()`.\n\
 *\n\
 * The purpose of the deferred object is to expose the associated Promise instance as well as APIs\n\
 * that can be used for signaling the successful or unsuccessful completion of the task.\n\
 *\n\
 * **Methods**\n\
 *\n\
 * - `resolve(value)` â€“ resolves the derived promise with the `value`. If the value is a rejection\n\
 *   constructed via `$q.reject`, the promise will be rejected instead.\n\
 * - `reject(reason)` â€“ rejects the derived promise with the `reason`. This is equivalent to\n\
 *   resolving it with a rejection constructed via `$q.reject`.\n\
 *\n\
 * **Properties**\n\
 *\n\
 * - promise â€“ `{Promise}` â€“ promise object associated with this deferred.\n\
 *\n\
 *\n\
 * # The Promise API\n\
 *\n\
 * A new promise instance is created when a deferred instance is created and can be retrieved by\n\
 * calling `deferred.promise`.\n\
 *\n\
 * The purpose of the promise object is to allow for interested parties to get access to the result\n\
 * of the deferred task when it completes.\n\
 *\n\
 * **Methods**\n\
 *\n\
 * - `then(successCallback, errorCallback)` â€“ regardless of when the promise was or will be resolved\n\
 *   or rejected calls one of the success or error callbacks asynchronously as soon as the result\n\
 *   is available. The callbacks are called with a single argument the result or rejection reason.\n\
 *\n\
 *   This method *returns a new promise* which is resolved or rejected via the return value of the\n\
 *   `successCallback` or `errorCallback`.\n\
 *\n\
 * - `always(callback)` â€“ allows you to observe either the fulfillment or rejection of a promise,\n\
 *   but to do so without modifying the final value. This is useful to release resources or do some\n\
 *   clean-up that needs to be done whether the promise was rejected or resolved. See the [full\n\
 *   specification](https://github.com/kriskowal/q/wiki/API-Reference#promisefinallycallback) for\n\
 *   more information.\n\
 *\n\
 * # Chaining promises\n\
 *\n\
 * Because calling `then` api of a promise returns a new derived promise, it is easily possible\n\
 * to create a chain of promises:\n\
 *\n\
 * <pre>\n\
 *   promiseB = promiseA.then(function(result) {\n\
 *     return result + 1;\n\
 *   });\n\
 *\n\
 *   // promiseB will be resolved immediately after promiseA is resolved and its value will be\n\
 *   // the result of promiseA incremented by 1\n\
 * </pre>\n\
 *\n\
 * It is possible to create chains of any length and since a promise can be resolved with another\n\
 * promise (which will defer its resolution further), it is possible to pause/defer resolution of\n\
 * the promises at any point in the chain. This makes it possible to implement powerful apis like\n\
 * $http's response interceptors.\n\
 *\n\
 *\n\
 * # Differences between Kris Kowal's Q and $q\n\
 *\n\
 *  There are three main differences:\n\
 *\n\
 * - $q is integrated with the {@link ng.$rootScope.Scope} Scope model observation\n\
 *   mechanism in angular, which means faster propagation of resolution or rejection into your\n\
 *   models and avoiding unnecessary browser repaints, which would result in flickering UI.\n\
 * - $q promises are recognized by the templating engine in angular, which means that in templates\n\
 *   you can treat promises attached to a scope as if they were the resulting values.\n\
 * - Q has many more features than $q, but that comes at a cost of bytes. $q is tiny, but contains\n\
 *   all the important functionality needed for common async tasks.\n\
 * \n\
 *  # Testing\n\
 * \n\
 *  <pre>\n\
 *    it('should simulate promise', inject(function($q, $rootScope) {\n\
 *      var deferred = $q.defer();\n\
 *      var promise = deferred.promise;\n\
 *      var resolvedValue;\n\
 * \n\
 *      promise.then(function(value) { resolvedValue = value; });\n\
 *      expect(resolvedValue).toBeUndefined();\n\
 * \n\
 *      // Simulate resolving of promise\n\
 *      deferred.resolve(123);\n\
 *      // Note that the 'then' function does not get called synchronously.\n\
 *      // This is because we want the promise API to always be async, whether or not\n\
 *      // it got called synchronously or asynchronously.\n\
 *      expect(resolvedValue).toBeUndefined();\n\
 * \n\
 *      // Propagate promise resolution to 'then' functions using $apply().\n\
 *      $rootScope.$apply();\n\
 *      expect(resolvedValue).toEqual(123);\n\
 *    });\n\
 *  </pre>\n\
 */\n\
function $QProvider() {\n\
\n\
  this.$get = ['$rootScope', '$exceptionHandler', function($rootScope, $exceptionHandler) {\n\
    return qFactory(function(callback) {\n\
      $rootScope.$evalAsync(callback);\n\
    }, $exceptionHandler);\n\
  }];\n\
}\n\
\n\
\n\
/**\n\
 * Constructs a promise manager.\n\
 *\n\
 * @param {function(function)} nextTick Function for executing functions in the next turn.\n\
 * @param {function(...*)} exceptionHandler Function into which unexpected exceptions are passed for\n\
 *     debugging purposes.\n\
 * @returns {object} Promise manager.\n\
 */\n\
function qFactory(nextTick, exceptionHandler) {\n\
\n\
  /**\n\
   * @ngdoc\n\
   * @name ng.$q#defer\n\
   * @methodOf ng.$q\n\
   * @description\n\
   * Creates a `Deferred` object which represents a task which will finish in the future.\n\
   *\n\
   * @returns {Deferred} Returns a new instance of deferred.\n\
   */\n\
  var defer = function() {\n\
    var pending = [],\n\
        value, deferred;\n\
\n\
    deferred = {\n\
\n\
      resolve: function(val) {\n\
        if (pending) {\n\
          var callbacks = pending;\n\
          pending = undefined;\n\
          value = ref(val);\n\
\n\
          if (callbacks.length) {\n\
            nextTick(function() {\n\
              var callback;\n\
              for (var i = 0, ii = callbacks.length; i < ii; i++) {\n\
                callback = callbacks[i];\n\
                value.then(callback[0], callback[1]);\n\
              }\n\
            });\n\
          }\n\
        }\n\
      },\n\
\n\
\n\
      reject: function(reason) {\n\
        deferred.resolve(reject(reason));\n\
      },\n\
\n\
\n\
      promise: {\n\
        then: function(callback, errback) {\n\
          var result = defer();\n\
\n\
          var wrappedCallback = function(value) {\n\
            try {\n\
              result.resolve((callback || defaultCallback)(value));\n\
            } catch(e) {\n\
              exceptionHandler(e);\n\
              result.reject(e);\n\
            }\n\
          };\n\
\n\
          var wrappedErrback = function(reason) {\n\
            try {\n\
              result.resolve((errback || defaultErrback)(reason));\n\
            } catch(e) {\n\
              exceptionHandler(e);\n\
              result.reject(e);\n\
            }\n\
          };\n\
\n\
          if (pending) {\n\
            pending.push([wrappedCallback, wrappedErrback]);\n\
          } else {\n\
            value.then(wrappedCallback, wrappedErrback);\n\
          }\n\
\n\
          return result.promise;\n\
        },\n\
        always: function(callback) {\n\
          \n\
          function makePromise(value, resolved) {\n\
            var result = defer();\n\
            if (resolved) {\n\
              result.resolve(value);\n\
            } else {\n\
              result.reject(value);\n\
            }\n\
            return result.promise;\n\
          }\n\
          \n\
          function handleCallback(value, isResolved) {\n\
            var callbackOutput = null;            \n\
            try {\n\
              callbackOutput = (callback ||defaultCallback)();\n\
            } catch(e) {\n\
              return makePromise(e, false);\n\
            }            \n\
            if (callbackOutput && callbackOutput.then) {\n\
              return callbackOutput.then(function() {\n\
                return makePromise(value, isResolved);\n\
              }, function(error) {\n\
                return makePromise(error, false);\n\
              });\n\
            } else {\n\
              return makePromise(value, isResolved);\n\
            }\n\
          }\n\
          \n\
          return this.then(function(value) {\n\
            return handleCallback(value, true);\n\
          }, function(error) {\n\
            return handleCallback(error, false);\n\
          });\n\
        }\n\
      }\n\
    };\n\
\n\
    return deferred;\n\
  };\n\
\n\
\n\
  var ref = function(value) {\n\
    if (value && value.then) return value;\n\
    return {\n\
      then: function(callback) {\n\
        var result = defer();\n\
        nextTick(function() {\n\
          result.resolve(callback(value));\n\
        });\n\
        return result.promise;\n\
      }\n\
    };\n\
  };\n\
\n\
\n\
  /**\n\
   * @ngdoc\n\
   * @name ng.$q#reject\n\
   * @methodOf ng.$q\n\
   * @description\n\
   * Creates a promise that is resolved as rejected with the specified `reason`. This api should be\n\
   * used to forward rejection in a chain of promises. If you are dealing with the last promise in\n\
   * a promise chain, you don't need to worry about it.\n\
   *\n\
   * When comparing deferreds/promises to the familiar behavior of try/catch/throw, think of\n\
   * `reject` as the `throw` keyword in JavaScript. This also means that if you \"catch\" an error via\n\
   * a promise error callback and you want to forward the error to the promise derived from the\n\
   * current promise, you have to \"rethrow\" the error by returning a rejection constructed via\n\
   * `reject`.\n\
   *\n\
   * <pre>\n\
   *   promiseB = promiseA.then(function(result) {\n\
   *     // success: do something and resolve promiseB\n\
   *     //          with the old or a new result\n\
   *     return result;\n\
   *   }, function(reason) {\n\
   *     // error: handle the error if possible and\n\
   *     //        resolve promiseB with newPromiseOrValue,\n\
   *     //        otherwise forward the rejection to promiseB\n\
   *     if (canHandle(reason)) {\n\
   *      // handle the error and recover\n\
   *      return newPromiseOrValue;\n\
   *     }\n\
   *     return $q.reject(reason);\n\
   *   });\n\
   * </pre>\n\
   *\n\
   * @param {*} reason Constant, message, exception or an object representing the rejection reason.\n\
   * @returns {Promise} Returns a promise that was already resolved as rejected with the `reason`.\n\
   */\n\
  var reject = function(reason) {\n\
    return {\n\
      then: function(callback, errback) {\n\
        var result = defer();\n\
        nextTick(function() {\n\
          result.resolve((errback || defaultErrback)(reason));\n\
        });\n\
        return result.promise;\n\
      }\n\
    };\n\
  };\n\
\n\
\n\
  /**\n\
   * @ngdoc\n\
   * @name ng.$q#when\n\
   * @methodOf ng.$q\n\
   * @description\n\
   * Wraps an object that might be a value or a (3rd party) then-able promise into a $q promise.\n\
   * This is useful when you are dealing with an object that might or might not be a promise, or if\n\
   * the promise comes from a source that can't be trusted.\n\
   *\n\
   * @param {*} value Value or a promise\n\
   * @returns {Promise} Returns a promise of the passed value or promise\n\
   */\n\
  var when = function(value, callback, errback) {\n\
    var result = defer(),\n\
        done;\n\
\n\
    var wrappedCallback = function(value) {\n\
      try {\n\
        return (callback || defaultCallback)(value);\n\
      } catch (e) {\n\
        exceptionHandler(e);\n\
        return reject(e);\n\
      }\n\
    };\n\
\n\
    var wrappedErrback = function(reason) {\n\
      try {\n\
        return (errback || defaultErrback)(reason);\n\
      } catch (e) {\n\
        exceptionHandler(e);\n\
        return reject(e);\n\
      }\n\
    };\n\
\n\
    nextTick(function() {\n\
      ref(value).then(function(value) {\n\
        if (done) return;\n\
        done = true;\n\
        result.resolve(ref(value).then(wrappedCallback, wrappedErrback));\n\
      }, function(reason) {\n\
        if (done) return;\n\
        done = true;\n\
        result.resolve(wrappedErrback(reason));\n\
      });\n\
    });\n\
\n\
    return result.promise;\n\
  };\n\
\n\
\n\
  function defaultCallback(value) {\n\
    return value;\n\
  }\n\
\n\
\n\
  function defaultErrback(reason) {\n\
    return reject(reason);\n\
  }\n\
\n\
\n\
  /**\n\
   * @ngdoc\n\
   * @name ng.$q#all\n\
   * @methodOf ng.$q\n\
   * @description\n\
   * Combines multiple promises into a single promise that is resolved when all of the input\n\
   * promises are resolved.\n\
   *\n\
   * @param {Array.<Promise>|Object.<Promise>} promises An array or hash of promises.\n\
   * @returns {Promise} Returns a single promise that will be resolved with an array/hash of values,\n\
   *   each value corresponding to the promise at the same index/key in the `promises` array/hash. If any of\n\
   *   the promises is resolved with a rejection, this resulting promise will be resolved with the\n\
   *   same rejection.\n\
   */\n\
  function all(promises) {\n\
    var deferred = defer(),\n\
        counter = 0,\n\
        results = isArray(promises) ? [] : {};\n\
\n\
    forEach(promises, function(promise, key) {\n\
      counter++;\n\
      ref(promise).then(function(value) {\n\
        if (results.hasOwnProperty(key)) return;\n\
        results[key] = value;\n\
        if (!(--counter)) deferred.resolve(results);\n\
      }, function(reason) {\n\
        if (results.hasOwnProperty(key)) return;\n\
        deferred.reject(reason);\n\
      });\n\
    });\n\
\n\
    if (counter === 0) {\n\
      deferred.resolve(results);\n\
    }\n\
\n\
    return deferred.promise;\n\
  }\n\
\n\
  return {\n\
    defer: defer,\n\
    reject: reject,\n\
    when: when,\n\
    all: all\n\
  };\n\
}\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.$routeProvider\n\
 * @function\n\
 *\n\
 * @description\n\
 *\n\
 * Used for configuring routes. See {@link ng.$route $route} for an example.\n\
 */\n\
function $RouteProvider(){\n\
  var routes = {};\n\
\n\
  /**\n\
   * @ngdoc method\n\
   * @name ng.$routeProvider#when\n\
   * @methodOf ng.$routeProvider\n\
   *\n\
   * @param {string} path Route path (matched against `$location.path`). If `$location.path`\n\
   *    contains redundant trailing slash or is missing one, the route will still match and the\n\
   *    `$location.path` will be updated to add or drop the trailing slash to exactly match the\n\
   *    route definition.\n\
   *\n\
   *      * `path` can contain named groups starting with a colon (`:name`). All characters up\n\
   *        to the next slash are matched and stored in `$routeParams` under the given `name`\n\
   *        when the route matches.\n\
   *      * `path` can contain named groups starting with a star (`*name`). All characters are\n\
   *        eagerly stored in `$routeParams` under the given `name` when the route matches.\n\
   *\n\
   *    For example, routes like `/color/:color/largecode/*largecode/edit` will match\n\
   *    `/color/brown/largecode/code/with/slashs/edit` and extract:\n\
   *\n\
   *      * `color: brown`\n\
   *      * `largecode: code/with/slashs`.\n\
   *\n\
   *\n\
   * @param {Object} route Mapping information to be assigned to `$route.current` on route\n\
   *    match.\n\
   *\n\
   *    Object properties:\n\
   *\n\
   *    - `controller` â€“ `{(string|function()=}` â€“ Controller fn that should be associated with newly\n\
   *      created scope or the name of a {@link angular.Module#controller registered controller}\n\
   *      if passed as a string.\n\
   *    - `controllerAs` â€“ `{string=}` â€“ A controller alias name. If present the controller will be\n\
   *      published to scope under the `controllerAs` name.\n\
   *    - `template` â€“ `{string=|function()=}` â€“ html template as a string or function that returns\n\
   *      an html template as a string which should be used by {@link ng.directive:ngView ngView} or\n\
   *      {@link ng.directive:ngInclude ngInclude} directives.\n\
   *      This property takes precedence over `templateUrl`.\n\
   *\n\
   *      If `template` is a function, it will be called with the following parameters:\n\
   *\n\
   *      - `{Array.<Object>}` - route parameters extracted from the current\n\
   *        `$location.path()` by applying the current route\n\
   *\n\
   *    - `templateUrl` â€“ `{string=|function()=}` â€“ path or function that returns a path to an html\n\
   *      template that should be used by {@link ng.directive:ngView ngView}.\n\
   *\n\
   *      If `templateUrl` is a function, it will be called with the following parameters:\n\
   *\n\
   *      - `{Array.<Object>}` - route parameters extracted from the current\n\
   *        `$location.path()` by applying the current route\n\
   *\n\
   *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should\n\
   *      be injected into the controller. If any of these dependencies are promises, they will be\n\
   *      resolved and converted to a value before the controller is instantiated and the\n\
   *      `$routeChangeSuccess` event is fired. The map object is:\n\
   *\n\
   *      - `key` â€“ `{string}`: a name of a dependency to be injected into the controller.\n\
   *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.\n\
   *        Otherwise if function, then it is {@link api/AUTO.$injector#invoke injected}\n\
   *        and the return value is treated as the dependency. If the result is a promise, it is resolved\n\
   *        before its value is injected into the controller.\n\
   *\n\
   *    - `redirectTo` â€“ {(string|function())=} â€“ value to update\n\
   *      {@link ng.$location $location} path with and trigger route redirection.\n\
   *\n\
   *      If `redirectTo` is a function, it will be called with the following parameters:\n\
   *\n\
   *      - `{Object.<string>}` - route parameters extracted from the current\n\
   *        `$location.path()` by applying the current route templateUrl.\n\
   *      - `{string}` - current `$location.path()`\n\
   *      - `{Object}` - current `$location.search()`\n\
   *\n\
   *      The custom `redirectTo` function is expected to return a string which will be used\n\
   *      to update `$location.path()` and `$location.search()`.\n\
   *\n\
   *    - `[reloadOnSearch=true]` - {boolean=} - reload route when only $location.search()\n\
   *    changes.\n\
   *\n\
   *      If the option is set to `false` and url in the browser changes, then\n\
   *      `$routeUpdate` event is broadcasted on the root scope.\n\
   *\n\
   *    - `[caseInsensitiveMatch=false]` - {boolean=} - match routes without being case sensitive\n\
   *\n\
   *      If the option is set to `true`, then the particular route can be matched without being\n\
   *      case sensitive\n\
   *\n\
   * @returns {Object} self\n\
   *\n\
   * @description\n\
   * Adds a new route definition to the `$route` service.\n\
   */\n\
  this.when = function(path, route) {\n\
    routes[path] = extend({reloadOnSearch: true, caseInsensitiveMatch: false}, route);\n\
\n\
    // create redirection for trailing slashes\n\
    if (path) {\n\
      var redirectPath = (path[path.length-1] == '/')\n\
          ? path.substr(0, path.length-1)\n\
          : path +'/';\n\
\n\
      routes[redirectPath] = {redirectTo: path};\n\
    }\n\
\n\
    return this;\n\
  };\n\
\n\
  /**\n\
   * @ngdoc method\n\
   * @name ng.$routeProvider#otherwise\n\
   * @methodOf ng.$routeProvider\n\
   *\n\
   * @description\n\
   * Sets route definition that will be used on route change when no other route definition\n\
   * is matched.\n\
   *\n\
   * @param {Object} params Mapping information to be assigned to `$route.current`.\n\
   * @returns {Object} self\n\
   */\n\
  this.otherwise = function(params) {\n\
    this.when(null, params);\n\
    return this;\n\
  };\n\
\n\
\n\
  this.$get = ['$rootScope', '$location', '$routeParams', '$q', '$injector', '$http', '$templateCache',\n\
      function( $rootScope,   $location,   $routeParams,   $q,   $injector,   $http,   $templateCache) {\n\
\n\
    /**\n\
     * @ngdoc object\n\
     * @name ng.$route\n\
     * @requires $location\n\
     * @requires $routeParams\n\
     *\n\
     * @property {Object} current Reference to the current route definition.\n\
     * The route definition contains:\n\
     *\n\
     *   - `controller`: The controller constructor as define in route definition.\n\
     *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for\n\
     *     controller instantiation. The `locals` contain\n\
     *     the resolved values of the `resolve` map. Additionally the `locals` also contain:\n\
     *\n\
     *     - `$scope` - The current route scope.\n\
     *     - `$template` - The current route template HTML.\n\
     *\n\
     * @property {Array.<Object>} routes Array of all configured routes.\n\
     *\n\
     * @description\n\
     * Is used for deep-linking URLs to controllers and views (HTML partials).\n\
     * It watches `$location.url()` and tries to map the path to an existing route definition.\n\
     *\n\
     * You can define routes through {@link ng.$routeProvider $routeProvider}'s API.\n\
     *\n\
     * The `$route` service is typically used in conjunction with {@link ng.directive:ngView ngView}\n\
     * directive and the {@link ng.$routeParams $routeParams} service.\n\
     *\n\
     * @example\n\
       This example shows how changing the URL hash causes the `$route` to match a route against the\n\
       URL, and the `ngView` pulls in the partial.\n\
\n\
       Note that this example is using {@link ng.directive:script inlined templates}\n\
       to get it working on jsfiddle as well.\n\
\n\
     <example module=\"ngView\">\n\
       <file name=\"index.html\">\n\
         <div ng-controller=\"MainCntl\">\n\
           Choose:\n\
           <a href=\"Book/Moby\">Moby</a> |\n\
           <a href=\"Book/Moby/ch/1\">Moby: Ch1</a> |\n\
           <a href=\"Book/Gatsby\">Gatsby</a> |\n\
           <a href=\"Book/Gatsby/ch/4?key=value\">Gatsby: Ch4</a> |\n\
           <a href=\"Book/Scarlet\">Scarlet Letter</a><br/>\n\
\n\
           <div ng-view></div>\n\
           <hr />\n\
\n\
           <pre>$location.path() = {{$location.path()}}</pre>\n\
           <pre>$route.current.templateUrl = {{$route.current.templateUrl}}</pre>\n\
           <pre>$route.current.params = {{$route.current.params}}</pre>\n\
           <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>\n\
           <pre>$routeParams = {{$routeParams}}</pre>\n\
         </div>\n\
       </file>\n\
\n\
       <file name=\"book.html\">\n\
         controller: {{name}}<br />\n\
         Book Id: {{params.bookId}}<br />\n\
       </file>\n\
\n\
       <file name=\"chapter.html\">\n\
         controller: {{name}}<br />\n\
         Book Id: {{params.bookId}}<br />\n\
         Chapter Id: {{params.chapterId}}\n\
       </file>\n\
\n\
       <file name=\"script.js\">\n\
         angular.module('ngView', [], function($routeProvider, $locationProvider) {\n\
           $routeProvider.when('/Book/:bookId', {\n\
             templateUrl: 'book.html',\n\
             controller: BookCntl,\n\
             resolve: {\n\
               // I will cause a 1 second delay\n\
               delay: function($q, $timeout) {\n\
                 var delay = $q.defer();\n\
                 $timeout(delay.resolve, 1000);\n\
                 return delay.promise;\n\
               }\n\
             }\n\
           });\n\
           $routeProvider.when('/Book/:bookId/ch/:chapterId', {\n\
             templateUrl: 'chapter.html',\n\
             controller: ChapterCntl\n\
           });\n\
\n\
           // configure html5 to get links working on jsfiddle\n\
           $locationProvider.html5Mode(true);\n\
         });\n\
\n\
         function MainCntl($scope, $route, $routeParams, $location) {\n\
           $scope.$route = $route;\n\
           $scope.$location = $location;\n\
           $scope.$routeParams = $routeParams;\n\
         }\n\
\n\
         function BookCntl($scope, $routeParams) {\n\
           $scope.name = \"BookCntl\";\n\
           $scope.params = $routeParams;\n\
         }\n\
\n\
         function ChapterCntl($scope, $routeParams) {\n\
           $scope.name = \"ChapterCntl\";\n\
           $scope.params = $routeParams;\n\
         }\n\
       </file>\n\
\n\
       <file name=\"scenario.js\">\n\
         it('should load and compile correct template', function() {\n\
           element('a:contains(\"Moby: Ch1\")').click();\n\
           var content = element('.doc-example-live [ng-view]').text();\n\
           expect(content).toMatch(/controller\\: ChapterCntl/);\n\
           expect(content).toMatch(/Book Id\\: Moby/);\n\
           expect(content).toMatch(/Chapter Id\\: 1/);\n\
\n\
           element('a:contains(\"Scarlet\")').click();\n\
           sleep(2); // promises are not part of scenario waiting\n\
           content = element('.doc-example-live [ng-view]').text();\n\
           expect(content).toMatch(/controller\\: BookCntl/);\n\
           expect(content).toMatch(/Book Id\\: Scarlet/);\n\
         });\n\
       </file>\n\
     </example>\n\
     */\n\
\n\
    /**\n\
     * @ngdoc event\n\
     * @name ng.$route#$routeChangeStart\n\
     * @eventOf ng.$route\n\
     * @eventType broadcast on root scope\n\
     * @description\n\
     * Broadcasted before a route change. At this  point the route services starts\n\
     * resolving all of the dependencies needed for the route change to occurs.\n\
     * Typically this involves fetching the view template as well as any dependencies\n\
     * defined in `resolve` route property. Once  all of the dependencies are resolved\n\
     * `$routeChangeSuccess` is fired.\n\
     *\n\
     * @param {Route} next Future route information.\n\
     * @param {Route} current Current route information.\n\
     */\n\
\n\
    /**\n\
     * @ngdoc event\n\
     * @name ng.$route#$routeChangeSuccess\n\
     * @eventOf ng.$route\n\
     * @eventType broadcast on root scope\n\
     * @description\n\
     * Broadcasted after a route dependencies are resolved.\n\
     * {@link ng.directive:ngView ngView} listens for the directive\n\
     * to instantiate the controller and render the view.\n\
     *\n\
     * @param {Object} angularEvent Synthetic event object.\n\
     * @param {Route} current Current route information.\n\
     * @param {Route|Undefined} previous Previous route information, or undefined if current is first route entered.\n\
     */\n\
\n\
    /**\n\
     * @ngdoc event\n\
     * @name ng.$route#$routeChangeError\n\
     * @eventOf ng.$route\n\
     * @eventType broadcast on root scope\n\
     * @description\n\
     * Broadcasted if any of the resolve promises are rejected.\n\
     *\n\
     * @param {Route} current Current route information.\n\
     * @param {Route} previous Previous route information.\n\
     * @param {Route} rejection Rejection of the promise. Usually the error of the failed promise.\n\
     */\n\
\n\
    /**\n\
     * @ngdoc event\n\
     * @name ng.$route#$routeUpdate\n\
     * @eventOf ng.$route\n\
     * @eventType broadcast on root scope\n\
     * @description\n\
     *\n\
     * The `reloadOnSearch` property has been set to false, and we are reusing the same\n\
     * instance of the Controller.\n\
     */\n\
\n\
    var forceReload = false,\n\
        $route = {\n\
          routes: routes,\n\
\n\
          /**\n\
           * @ngdoc method\n\
           * @name ng.$route#reload\n\
           * @methodOf ng.$route\n\
           *\n\
           * @description\n\
           * Causes `$route` service to reload the current route even if\n\
           * {@link ng.$location $location} hasn't changed.\n\
           *\n\
           * As a result of that, {@link ng.directive:ngView ngView}\n\
           * creates new scope, reinstantiates the controller.\n\
           */\n\
          reload: function() {\n\
            forceReload = true;\n\
            $rootScope.$evalAsync(updateRoute);\n\
          }\n\
        };\n\
\n\
    $rootScope.$on('$locationChangeSuccess', updateRoute);\n\
\n\
    return $route;\n\
\n\
    /////////////////////////////////////////////////////\n\
\n\
    /**\n\
     * @param on {string} current url\n\
     * @param when {string} route when template to match the url against\n\
     * @param whenProperties {Object} properties to define when's matching behavior\n\
     * @return {?Object}\n\
     */\n\
    function switchRouteMatcher(on, when, whenProperties) {\n\
      // TODO(i): this code is convoluted and inefficient, we should construct the route matching\n\
      //   regex only once and then reuse it\n\
\n\
      // Escape regexp special characters.\n\
      when = '^' + when.replace(/[-\\/\\\\^$:*+?.()|[\\]{}]/g, \"\\\\$&\") + '$';\n\
\n\
      var regex = '',\n\
          params = [],\n\
          dst = {};\n\
\n\
      var re = /\\\\([:*])(\\w+)/g,\n\
          paramMatch,\n\
          lastMatchedIndex = 0;\n\
\n\
      while ((paramMatch = re.exec(when)) !== null) {\n\
        // Find each :param in `when` and replace it with a capturing group.\n\
        // Append all other sections of when unchanged.\n\
        regex += when.slice(lastMatchedIndex, paramMatch.index);\n\
        switch(paramMatch[1]) {\n\
          case ':':\n\
            regex += '([^\\\\/]*)';\n\
            break;\n\
          case '*':\n\
            regex += '(.*)';\n\
            break;\n\
        }\n\
        params.push(paramMatch[2]);\n\
        lastMatchedIndex = re.lastIndex;\n\
      }\n\
      // Append trailing path part.\n\
      regex += when.substr(lastMatchedIndex);\n\
\n\
      var match = on.match(new RegExp(regex, whenProperties.caseInsensitiveMatch ? 'i' : ''));\n\
      if (match) {\n\
        forEach(params, function(name, index) {\n\
          dst[name] = match[index + 1];\n\
        });\n\
      }\n\
      return match ? dst : null;\n\
    }\n\
\n\
    function updateRoute() {\n\
      var next = parseRoute(),\n\
          last = $route.current;\n\
\n\
      if (next && last && next.$$route === last.$$route\n\
          && equals(next.pathParams, last.pathParams) && !next.reloadOnSearch && !forceReload) {\n\
        last.params = next.params;\n\
        copy(last.params, $routeParams);\n\
        $rootScope.$broadcast('$routeUpdate', last);\n\
      } else if (next || last) {\n\
        forceReload = false;\n\
        $rootScope.$broadcast('$routeChangeStart', next, last);\n\
        $route.current = next;\n\
        if (next) {\n\
          if (next.redirectTo) {\n\
            if (isString(next.redirectTo)) {\n\
              $location.path(interpolate(next.redirectTo, next.params)).search(next.params)\n\
                       .replace();\n\
            } else {\n\
              $location.url(next.redirectTo(next.pathParams, $location.path(), $location.search()))\n\
                       .replace();\n\
            }\n\
          }\n\
        }\n\
\n\
        $q.when(next).\n\
          then(function() {\n\
            if (next) {\n\
              var locals = extend({}, next.resolve),\n\
                  template;\n\
\n\
              forEach(locals, function(value, key) {\n\
                locals[key] = isString(value) ? $injector.get(value) : $injector.invoke(value);\n\
              });\n\
\n\
              if (isDefined(template = next.template)) {\n\
                if (isFunction(template)) {\n\
                  template = template(next.params);\n\
                }\n\
              } else if (isDefined(template = next.templateUrl)) {\n\
                if (isFunction(template)) {\n\
                  template = template(next.params);\n\
                }\n\
                if (isDefined(template)) {\n\
                  next.loadedTemplateUrl = template;\n\
                  template = $http.get(template, {cache: $templateCache}).\n\
                      then(function(response) { return response.data; });\n\
                }\n\
              }\n\
              if (isDefined(template)) {\n\
                locals['$template'] = template;\n\
              }\n\
              return $q.all(locals);\n\
            }\n\
          }).\n\
          // after route change\n\
          then(function(locals) {\n\
            if (next == $route.current) {\n\
              if (next) {\n\
                next.locals = locals;\n\
                copy(next.params, $routeParams);\n\
              }\n\
              $rootScope.$broadcast('$routeChangeSuccess', next, last);\n\
            }\n\
          }, function(error) {\n\
            if (next == $route.current) {\n\
              $rootScope.$broadcast('$routeChangeError', next, last, error);\n\
            }\n\
          });\n\
      }\n\
    }\n\
\n\
\n\
    /**\n\
     * @returns the current active route, by matching it against the URL\n\
     */\n\
    function parseRoute() {\n\
      // Match a route\n\
      var params, match;\n\
      forEach(routes, function(route, path) {\n\
        if (!match && (params = switchRouteMatcher($location.path(), path, route))) {\n\
          match = inherit(route, {\n\
            params: extend({}, $location.search(), params),\n\
            pathParams: params});\n\
          match.$$route = route;\n\
        }\n\
      });\n\
      // No route matched; fallback to \"otherwise\" route\n\
      return match || routes[null] && inherit(routes[null], {params: {}, pathParams:{}});\n\
    }\n\
\n\
    /**\n\
     * @returns interpolation of the redirect path with the parameters\n\
     */\n\
    function interpolate(string, params) {\n\
      var result = [];\n\
      forEach((string||'').split(':'), function(segment, i) {\n\
        if (i == 0) {\n\
          result.push(segment);\n\
        } else {\n\
          var segmentMatch = segment.match(/(\\w+)(.*)/);\n\
          var key = segmentMatch[1];\n\
          result.push(params[key]);\n\
          result.push(segmentMatch[2] || '');\n\
          delete params[key];\n\
        }\n\
      });\n\
      return result.join('');\n\
    }\n\
  }];\n\
}\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.$routeParams\n\
 * @requires $route\n\
 *\n\
 * @description\n\
 * Current set of route parameters. The route parameters are a combination of the\n\
 * {@link ng.$location $location} `search()`, and `path()`. The `path` parameters\n\
 * are extracted when the {@link ng.$route $route} path is matched.\n\
 *\n\
 * In case of parameter name collision, `path` params take precedence over `search` params.\n\
 *\n\
 * The service guarantees that the identity of the `$routeParams` object will remain unchanged\n\
 * (but its properties will likely change) even when a route change occurs.\n\
 *\n\
 * @example\n\
 * <pre>\n\
 *  // Given:\n\
 *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby\n\
 *  // Route: /Chapter/:chapterId/Section/:sectionId\n\
 *  //\n\
 *  // Then\n\
 *  $routeParams ==> {chapterId:1, sectionId:2, search:'moby'}\n\
 * </pre>\n\
 */\n\
function $RouteParamsProvider() {\n\
  this.$get = valueFn({});\n\
}\n\
\n\
/**\n\
 * DESIGN NOTES\n\
 *\n\
 * The design decisions behind the scope are heavily favored for speed and memory consumption.\n\
 *\n\
 * The typical use of scope is to watch the expressions, which most of the time return the same\n\
 * value as last time so we optimize the operation.\n\
 *\n\
 * Closures construction is expensive in terms of speed as well as memory:\n\
 *   - No closures, instead use prototypical inheritance for API\n\
 *   - Internal state needs to be stored on scope directly, which means that private state is\n\
 *     exposed as $$____ properties\n\
 *\n\
 * Loop operations are optimized by using while(count--) { ... }\n\
 *   - this means that in order to keep the same order of execution as addition we have to add\n\
 *     items to the array at the beginning (shift) instead of at the end (push)\n\
 *\n\
 * Child scopes are created and removed often\n\
 *   - Using an array would be slow since inserts in middle are expensive so we use linked list\n\
 *\n\
 * There are few watches then a lot of observers. This is why you don't want the observer to be\n\
 * implemented in the same way as watch. Watch requires return of initialization function which\n\
 * are expensive to construct.\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.$rootScopeProvider\n\
 * @description\n\
 *\n\
 * Provider for the $rootScope service.\n\
 */\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name ng.$rootScopeProvider#digestTtl\n\
 * @methodOf ng.$rootScopeProvider\n\
 * @description\n\
 *\n\
 * Sets the number of digest iterations the scope should attempt to execute before giving up and\n\
 * assuming that the model is unstable.\n\
 *\n\
 * The current default is 10 iterations.\n\
 *\n\
 * @param {number} limit The number of digest iterations.\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.$rootScope\n\
 * @description\n\
 *\n\
 * Every application has a single root {@link ng.$rootScope.Scope scope}.\n\
 * All other scopes are child scopes of the root scope. Scopes provide mechanism for watching the model and provide\n\
 * event processing life-cycle. See {@link guide/scope developer guide on scopes}.\n\
 */\n\
function $RootScopeProvider(){\n\
  var TTL = 10;\n\
\n\
  this.digestTtl = function(value) {\n\
    if (arguments.length) {\n\
      TTL = value;\n\
    }\n\
    return TTL;\n\
  };\n\
\n\
  this.$get = ['$injector', '$exceptionHandler', '$parse',\n\
      function( $injector,   $exceptionHandler,   $parse) {\n\
\n\
    /**\n\
     * @ngdoc function\n\
     * @name ng.$rootScope.Scope\n\
     *\n\
     * @description\n\
     * A root scope can be retrieved using the {@link ng.$rootScope $rootScope} key from the\n\
     * {@link AUTO.$injector $injector}. Child scopes are created using the\n\
     * {@link ng.$rootScope.Scope#$new $new()} method. (Most scopes are created automatically when\n\
     * compiled HTML template is executed.)\n\
     *\n\
     * Here is a simple scope snippet to show how you can interact with the scope.\n\
     * <pre>\n\
     * <file src=\"./test/ng/rootScopeSpec.js\" tag=\"docs1\" />\n\
     * </pre>\n\
     *\n\
     * # Inheritance\n\
     * A scope can inherit from a parent scope, as in this example:\n\
     * <pre>\n\
         var parent = $rootScope;\n\
         var child = parent.$new();\n\
\n\
         parent.salutation = \"Hello\";\n\
         child.name = \"World\";\n\
         expect(child.salutation).toEqual('Hello');\n\
\n\
         child.salutation = \"Welcome\";\n\
         expect(child.salutation).toEqual('Welcome');\n\
         expect(parent.salutation).toEqual('Hello');\n\
     * </pre>\n\
     *\n\
     *\n\
     * @param {Object.<string, function()>=} providers Map of service factory which need to be provided\n\
     *     for the current scope. Defaults to {@link ng}.\n\
     * @param {Object.<string, *>=} instanceCache Provides pre-instantiated services which should\n\
     *     append/override services provided by `providers`. This is handy when unit-testing and having\n\
     *     the need to override a default service.\n\
     * @returns {Object} Newly created scope.\n\
     *\n\
     */\n\
    function Scope() {\n\
      this.$id = nextUid();\n\
      this.$$phase = this.$parent = this.$$watchers =\n\
                     this.$$nextSibling = this.$$prevSibling =\n\
                     this.$$childHead = this.$$childTail = null;\n\
      this['this'] = this.$root =  this;\n\
      this.$$destroyed = false;\n\
      this.$$asyncQueue = [];\n\
      this.$$listeners = {};\n\
      this.$$isolateBindings = {};\n\
    }\n\
\n\
    /**\n\
     * @ngdoc property\n\
     * @name ng.$rootScope.Scope#$id\n\
     * @propertyOf ng.$rootScope.Scope\n\
     * @returns {number} Unique scope ID (monotonically increasing alphanumeric sequence) useful for\n\
     *   debugging.\n\
     */\n\
\n\
\n\
    Scope.prototype = {\n\
      /**\n\
       * @ngdoc function\n\
       * @name ng.$rootScope.Scope#$new\n\
       * @methodOf ng.$rootScope.Scope\n\
       * @function\n\
       *\n\
       * @description\n\
       * Creates a new child {@link ng.$rootScope.Scope scope}.\n\
       *\n\
       * The parent scope will propagate the {@link ng.$rootScope.Scope#$digest $digest()} and\n\
       * {@link ng.$rootScope.Scope#$digest $digest()} events. The scope can be removed from the scope\n\
       * hierarchy using {@link ng.$rootScope.Scope#$destroy $destroy()}.\n\
       *\n\
       * {@link ng.$rootScope.Scope#$destroy $destroy()} must be called on a scope when it is desired for\n\
       * the scope and its child scopes to be permanently detached from the parent and thus stop\n\
       * participating in model change detection and listener notification by invoking.\n\
       *\n\
       * @param {boolean} isolate if true then the scope does not prototypically inherit from the\n\
       *         parent scope. The scope is isolated, as it can not see parent scope properties.\n\
       *         When creating widgets it is useful for the widget to not accidentally read parent\n\
       *         state.\n\
       *\n\
       * @returns {Object} The newly created child scope.\n\
       *\n\
       */\n\
      $new: function(isolate) {\n\
        var Child,\n\
            child;\n\
\n\
        if (isFunction(isolate)) {\n\
          // TODO: remove at some point\n\
          throw Error('API-CHANGE: Use $controller to instantiate controllers.');\n\
        }\n\
        if (isolate) {\n\
          child = new Scope();\n\
          child.$root = this.$root;\n\
        } else {\n\
          Child = function() {}; // should be anonymous; This is so that when the minifier munges\n\
            // the name it does not become random set of chars. These will then show up as class\n\
            // name in the debugger.\n\
          Child.prototype = this;\n\
          child = new Child();\n\
          child.$id = nextUid();\n\
        }\n\
        child['this'] = child;\n\
        child.$$listeners = {};\n\
        child.$parent = this;\n\
        child.$$watchers = child.$$nextSibling = child.$$childHead = child.$$childTail = null;\n\
        child.$$prevSibling = this.$$childTail;\n\
        if (this.$$childHead) {\n\
          this.$$childTail.$$nextSibling = child;\n\
          this.$$childTail = child;\n\
        } else {\n\
          this.$$childHead = this.$$childTail = child;\n\
        }\n\
        return child;\n\
      },\n\
\n\
      /**\n\
       * @ngdoc function\n\
       * @name ng.$rootScope.Scope#$watch\n\
       * @methodOf ng.$rootScope.Scope\n\
       * @function\n\
       *\n\
       * @description\n\
       * Registers a `listener` callback to be executed whenever the `watchExpression` changes.\n\
       *\n\
       * - The `watchExpression` is called on every call to {@link ng.$rootScope.Scope#$digest $digest()} and\n\
       *   should return the value which will be watched. (Since {@link ng.$rootScope.Scope#$digest $digest()}\n\
       *   reruns when it detects changes the `watchExpression` can execute multiple times per\n\
       *   {@link ng.$rootScope.Scope#$digest $digest()} and should be idempotent.)\n\
       * - The `listener` is called only when the value from the current `watchExpression` and the\n\
       *   previous call to `watchExpression` are not equal (with the exception of the initial run,\n\
       *   see below). The inequality is determined according to\n\
       *   {@link angular.equals} function. To save the value of the object for later comparison, the\n\
       *   {@link angular.copy} function is used. It also means that watching complex options will\n\
       *   have adverse memory and performance implications.\n\
       * - The watch `listener` may change the model, which may trigger other `listener`s to fire. This\n\
       *   is achieved by rerunning the watchers until no changes are detected. The rerun iteration\n\
       *   limit is 10 to prevent an infinite loop deadlock.\n\
       *\n\
       *\n\
       * If you want to be notified whenever {@link ng.$rootScope.Scope#$digest $digest} is called,\n\
       * you can register a `watchExpression` function with no `listener`. (Since `watchExpression`\n\
       * can execute multiple times per {@link ng.$rootScope.Scope#$digest $digest} cycle when a change is\n\
       * detected, be prepared for multiple calls to your listener.)\n\
       *\n\
       * After a watcher is registered with the scope, the `listener` fn is called asynchronously\n\
       * (via {@link ng.$rootScope.Scope#$evalAsync $evalAsync}) to initialize the\n\
       * watcher. In rare cases, this is undesirable because the listener is called when the result\n\
       * of `watchExpression` didn't change. To detect this scenario within the `listener` fn, you\n\
       * can compare the `newVal` and `oldVal`. If these two values are identical (`===`) then the\n\
       * listener was called due to initialization.\n\
       *\n\
       *\n\
       * # Example\n\
       * <pre>\n\
           // let's assume that scope was dependency injected as the $rootScope\n\
           var scope = $rootScope;\n\
           scope.name = 'misko';\n\
           scope.counter = 0;\n\
\n\
           expect(scope.counter).toEqual(0);\n\
           scope.$watch('name', function(newValue, oldValue) { scope.counter = scope.counter + 1; });\n\
           expect(scope.counter).toEqual(0);\n\
\n\
           scope.$digest();\n\
           // no variable change\n\
           expect(scope.counter).toEqual(0);\n\
\n\
           scope.name = 'adam';\n\
           scope.$digest();\n\
           expect(scope.counter).toEqual(1);\n\
       * </pre>\n\
       *\n\
       *\n\
       *\n\
       * @param {(function()|string)} watchExpression Expression that is evaluated on each\n\
       *    {@link ng.$rootScope.Scope#$digest $digest} cycle. A change in the return value triggers a\n\
       *    call to the `listener`.\n\
       *\n\
       *    - `string`: Evaluated as {@link guide/expression expression}\n\
       *    - `function(scope)`: called with current `scope` as a parameter.\n\
       * @param {(function()|string)=} listener Callback called whenever the return value of\n\
       *   the `watchExpression` changes.\n\
       *\n\
       *    - `string`: Evaluated as {@link guide/expression expression}\n\
       *    - `function(newValue, oldValue, scope)`: called with current and previous values as parameters.\n\
       *\n\
       * @param {boolean=} objectEquality Compare object for equality rather than for reference.\n\
       * @returns {function()} Returns a deregistration function for this listener.\n\
       */\n\
      $watch: function(watchExp, listener, objectEquality) {\n\
        var scope = this,\n\
            get = compileToFn(watchExp, 'watch'),\n\
            array = scope.$$watchers,\n\
            watcher = {\n\
              fn: listener,\n\
              last: initWatchVal,\n\
              get: get,\n\
              exp: watchExp,\n\
              eq: !!objectEquality\n\
            };\n\
\n\
        // in the case user pass string, we need to compile it, do we really need this ?\n\
        if (!isFunction(listener)) {\n\
          var listenFn = compileToFn(listener || noop, 'listener');\n\
          watcher.fn = function(newVal, oldVal, scope) {listenFn(scope);};\n\
        }\n\
\n\
        if (typeof watchExp == 'string' && get.constant) {\n\
          var originalFn = watcher.fn;\n\
          watcher.fn = function(newVal, oldVal, scope) {\n\
            originalFn.call(this, newVal, oldVal, scope);\n\
            arrayRemove(array, watcher);\n\
          };\n\
        }\n\
\n\
        if (!array) {\n\
          array = scope.$$watchers = [];\n\
        }\n\
        // we use unshift since we use a while loop in $digest for speed.\n\
        // the while loop reads in reverse order.\n\
        array.unshift(watcher);\n\
\n\
        return function() {\n\
          arrayRemove(array, watcher);\n\
        };\n\
      },\n\
\n\
\n\
      /**\n\
       * @ngdoc function\n\
       * @name ng.$rootScope.Scope#$watchCollection\n\
       * @methodOf ng.$rootScope.Scope\n\
       * @function\n\
       *\n\
       * @description\n\
       * Shallow watches the properties of an object and fires whenever any of the properties change\n\
       * (for arrays this implies watching the array items, for object maps this implies watching the properties).\n\
       * If a change is detected the `listener` callback is fired.\n\
       *\n\
       * - The `obj` collection is observed via standard $watch operation and is examined on every call to $digest() to\n\
       *   see if any items have been added, removed, or moved.\n\
       * - The `listener` is called whenever anything within the `obj` has changed. Examples include adding new items\n\
       *   into the object or array, removing and moving items around.\n\
       *\n\
       *\n\
       * # Example\n\
       * <pre>\n\
          $scope.names = ['igor', 'matias', 'misko', 'james'];\n\
          $scope.dataCount = 4;\n\
\n\
          $scope.$watchCollection('names', function(newNames, oldNames) {\n\
            $scope.dataCount = newNames.length;\n\
          });\n\
\n\
          expect($scope.dataCount).toEqual(4);\n\
          $scope.$digest();\n\
\n\
          //still at 4 ... no changes\n\
          expect($scope.dataCount).toEqual(4);\n\
\n\
          $scope.names.pop();\n\
          $scope.$digest();\n\
\n\
          //now there's been a change\n\
          expect($scope.dataCount).toEqual(3);\n\
       * </pre>\n\
       *\n\
       *\n\
       * @param {string|Function(scope)} obj Evaluated as {@link guide/expression expression}. The expression value\n\
       *    should evaluate to an object or an array which is observed on each\n\
       *    {@link ng.$rootScope.Scope#$digest $digest} cycle. Any shallow change within the collection will trigger\n\
       *    a call to the `listener`.\n\
       *\n\
       * @param {function(newCollection, oldCollection, scope)} listener a callback function that is fired with both\n\
       *    the `newCollection` and `oldCollection` as parameters.\n\
       *    The `newCollection` object is the newly modified data obtained from the `obj` expression and the\n\
       *    `oldCollection` object is a copy of the former collection data.\n\
       *    The `scope` refers to the current scope.\n\
       *\n\
       * @returns {function()} Returns a de-registration function for this listener. When the de-registration function is executed\n\
       * then the internal watch operation is terminated.\n\
       */\n\
      $watchCollection: function(obj, listener) {\n\
        var self = this;\n\
        var oldValue;\n\
        var newValue;\n\
        var changeDetected = 0;\n\
        var objGetter = $parse(obj);\n\
        var internalArray = [];\n\
        var internalObject = {};\n\
        var oldLength = 0;\n\
\n\
        function $watchCollectionWatch() {\n\
          newValue = objGetter(self);\n\
          var newLength, key;\n\
\n\
          if (!isObject(newValue)) {\n\
            if (oldValue !== newValue) {\n\
              oldValue = newValue;\n\
              changeDetected++;\n\
            }\n\
          } else if (isArrayLike(newValue)) {\n\
            if (oldValue !== internalArray) {\n\
              // we are transitioning from something which was not an array into array.\n\
              oldValue = internalArray;\n\
              oldLength = oldValue.length = 0;\n\
              changeDetected++;\n\
            }\n\
\n\
            newLength = newValue.length;\n\
\n\
            if (oldLength !== newLength) {\n\
              // if lengths do not match we need to trigger change notification\n\
              changeDetected++;\n\
              oldValue.length = oldLength = newLength;\n\
            }\n\
            // copy the items to oldValue and look for changes.\n\
            for (var i = 0; i < newLength; i++) {\n\
              if (oldValue[i] !== newValue[i]) {\n\
                changeDetected++;\n\
                oldValue[i] = newValue[i];\n\
              }\n\
            }\n\
          } else {\n\
            if (oldValue !== internalObject) {\n\
              // we are transitioning from something which was not an object into object.\n\
              oldValue = internalObject = {};\n\
              oldLength = 0;\n\
              changeDetected++;\n\
            }\n\
            // copy the items to oldValue and look for changes.\n\
            newLength = 0;\n\
            for (key in newValue) {\n\
              if (newValue.hasOwnProperty(key)) {\n\
                newLength++;\n\
                if (oldValue.hasOwnProperty(key)) {\n\
                  if (oldValue[key] !== newValue[key]) {\n\
                    changeDetected++;\n\
                    oldValue[key] = newValue[key];\n\
                  }\n\
                } else {\n\
                  oldLength++;\n\
                  oldValue[key] = newValue[key];\n\
                  changeDetected++;\n\
                }\n\
              }\n\
            }\n\
            if (oldLength > newLength) {\n\
              // we used to have more keys, need to find them and destroy them.\n\
              changeDetected++;\n\
              for(key in oldValue) {\n\
                if (oldValue.hasOwnProperty(key) && !newValue.hasOwnProperty(key)) {\n\
                  oldLength--;\n\
                  delete oldValue[key];\n\
                }\n\
              }\n\
            }\n\
          }\n\
          return changeDetected;\n\
        }\n\
\n\
        function $watchCollectionAction() {\n\
          listener(newValue, oldValue, self);\n\
        }\n\
\n\
        return this.$watch($watchCollectionWatch, $watchCollectionAction);\n\
      },\n\
\n\
      /**\n\
       * @ngdoc function\n\
       * @name ng.$rootScope.Scope#$digest\n\
       * @methodOf ng.$rootScope.Scope\n\
       * @function\n\
       *\n\
       * @description\n\
       * Processes all of the {@link ng.$rootScope.Scope#$watch watchers} of the current scope and its children.\n\
       * Because a {@link ng.$rootScope.Scope#$watch watcher}'s listener can change the model, the\n\
       * `$digest()` keeps calling the {@link ng.$rootScope.Scope#$watch watchers} until no more listeners are\n\
       * firing. This means that it is possible to get into an infinite loop. This function will throw\n\
       * `'Maximum iteration limit exceeded.'` if the number of iterations exceeds 10.\n\
       *\n\
       * Usually you don't call `$digest()` directly in\n\
       * {@link ng.directive:ngController controllers} or in\n\
       * {@link ng.$compileProvider#directive directives}.\n\
       * Instead a call to {@link ng.$rootScope.Scope#$apply $apply()} (typically from within a\n\
       * {@link ng.$compileProvider#directive directives}) will force a `$digest()`.\n\
       *\n\
       * If you want to be notified whenever `$digest()` is called,\n\
       * you can register a `watchExpression` function  with {@link ng.$rootScope.Scope#$watch $watch()}\n\
       * with no `listener`.\n\
       *\n\
       * You may have a need to call `$digest()` from within unit-tests, to simulate the scope\n\
       * life-cycle.\n\
       *\n\
       * # Example\n\
       * <pre>\n\
           var scope = ...;\n\
           scope.name = 'misko';\n\
           scope.counter = 0;\n\
\n\
           expect(scope.counter).toEqual(0);\n\
           scope.$watch('name', function(newValue, oldValue) {\n\
             scope.counter = scope.counter + 1;\n\
           });\n\
           expect(scope.counter).toEqual(0);\n\
\n\
           scope.$digest();\n\
           // no variable change\n\
           expect(scope.counter).toEqual(0);\n\
\n\
           scope.name = 'adam';\n\
           scope.$digest();\n\
           expect(scope.counter).toEqual(1);\n\
       * </pre>\n\
       *\n\
       */\n\
      $digest: function() {\n\
        var watch, value, last,\n\
            watchers,\n\
            asyncQueue = this.$$asyncQueue,\n\
            length,\n\
            dirty, ttl = TTL,\n\
            next, current, target = this,\n\
            watchLog = [],\n\
            logIdx, logMsg;\n\
\n\
        beginPhase('$digest');\n\
\n\
        do { // \"while dirty\" loop\n\
          dirty = false;\n\
          current = target;\n\
\n\
          while(asyncQueue.length) {\n\
            try {\n\
              current.$eval(asyncQueue.shift());\n\
            } catch (e) {\n\
              $exceptionHandler(e);\n\
            }\n\
          }\n\
\n\
          do { // \"traverse the scopes\" loop\n\
            if ((watchers = current.$$watchers)) {\n\
              // process our watches\n\
              length = watchers.length;\n\
              while (length--) {\n\
                try {\n\
                  watch = watchers[length];\n\
                  // Most common watches are on primitives, in which case we can short\n\
                  // circuit it with === operator, only when === fails do we use .equals\n\
                  if ((value = watch.get(current)) !== (last = watch.last) &&\n\
                      !(watch.eq\n\
                          ? equals(value, last)\n\
                          : (typeof value == 'number' && typeof last == 'number'\n\
                             && isNaN(value) && isNaN(last)))) {\n\
                    dirty = true;\n\
                    watch.last = watch.eq ? copy(value) : value;\n\
                    watch.fn(value, ((last === initWatchVal) ? value : last), current);\n\
                    if (ttl < 5) {\n\
                      logIdx = 4 - ttl;\n\
                      if (!watchLog[logIdx]) watchLog[logIdx] = [];\n\
                      logMsg = (isFunction(watch.exp))\n\
                          ? 'fn: ' + (watch.exp.name || watch.exp.toString())\n\
                          : watch.exp;\n\
                      logMsg += '; newVal: ' + toJson(value) + '; oldVal: ' + toJson(last);\n\
                      watchLog[logIdx].push(logMsg);\n\
                    }\n\
                  }\n\
                } catch (e) {\n\
                  $exceptionHandler(e);\n\
                }\n\
              }\n\
            }\n\
\n\
            // Insanity Warning: scope depth-first traversal\n\
            // yes, this code is a bit crazy, but it works and we have tests to prove it!\n\
            // this piece should be kept in sync with the traversal in $broadcast\n\
            if (!(next = (current.$$childHead || (current !== target && current.$$nextSibling)))) {\n\
              while(current !== target && !(next = current.$$nextSibling)) {\n\
                current = current.$parent;\n\
              }\n\
            }\n\
          } while ((current = next));\n\
\n\
          if(dirty && !(ttl--)) {\n\
            clearPhase();\n\
            throw Error(TTL + ' $digest() iterations reached. Aborting!\\n\
' +\n\
                'Watchers fired in the last 5 iterations: ' + toJson(watchLog));\n\
          }\n\
        } while (dirty || asyncQueue.length);\n\
\n\
        clearPhase();\n\
      },\n\
\n\
\n\
      /**\n\
       * @ngdoc event\n\
       * @name ng.$rootScope.Scope#$destroy\n\
       * @eventOf ng.$rootScope.Scope\n\
       * @eventType broadcast on scope being destroyed\n\
       *\n\
       * @description\n\
       * Broadcasted when a scope and its children are being destroyed.\n\
       */\n\
\n\
      /**\n\
       * @ngdoc function\n\
       * @name ng.$rootScope.Scope#$destroy\n\
       * @methodOf ng.$rootScope.Scope\n\
       * @function\n\
       *\n\
       * @description\n\
       * Removes the current scope (and all of its children) from the parent scope. Removal implies\n\
       * that calls to {@link ng.$rootScope.Scope#$digest $digest()} will no longer\n\
       * propagate to the current scope and its children. Removal also implies that the current\n\
       * scope is eligible for garbage collection.\n\
       *\n\
       * The `$destroy()` is usually used by directives such as\n\
       * {@link ng.directive:ngRepeat ngRepeat} for managing the\n\
       * unrolling of the loop.\n\
       *\n\
       * Just before a scope is destroyed a `$destroy` event is broadcasted on this scope.\n\
       * Application code can register a `$destroy` event handler that will give it chance to\n\
       * perform any necessary cleanup.\n\
       */\n\
      $destroy: function() {\n\
        // we can't destroy the root scope or a scope that has been already destroyed\n\
        if ($rootScope == this || this.$$destroyed) return;\n\
        var parent = this.$parent;\n\
\n\
        this.$broadcast('$destroy');\n\
        this.$$destroyed = true;\n\
\n\
        if (parent.$$childHead == this) parent.$$childHead = this.$$nextSibling;\n\
        if (parent.$$childTail == this) parent.$$childTail = this.$$prevSibling;\n\
        if (this.$$prevSibling) this.$$prevSibling.$$nextSibling = this.$$nextSibling;\n\
        if (this.$$nextSibling) this.$$nextSibling.$$prevSibling = this.$$prevSibling;\n\
\n\
        // This is bogus code that works around Chrome's GC leak\n\
        // see: https://github.com/angular/angular.js/issues/1313#issuecomment-10378451\n\
        this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead =\n\
            this.$$childTail = null;\n\
      },\n\
\n\
      /**\n\
       * @ngdoc function\n\
       * @name ng.$rootScope.Scope#$eval\n\
       * @methodOf ng.$rootScope.Scope\n\
       * @function\n\
       *\n\
       * @description\n\
       * Executes the `expression` on the current scope returning the result. Any exceptions in the\n\
       * expression are propagated (uncaught). This is useful when evaluating Angular expressions.\n\
       *\n\
       * # Example\n\
       * <pre>\n\
           var scope = ng.$rootScope.Scope();\n\
           scope.a = 1;\n\
           scope.b = 2;\n\
\n\
           expect(scope.$eval('a+b')).toEqual(3);\n\
           expect(scope.$eval(function(scope){ return scope.a + scope.b; })).toEqual(3);\n\
       * </pre>\n\
       *\n\
       * @param {(string|function())=} expression An angular expression to be executed.\n\
       *\n\
       *    - `string`: execute using the rules as defined in  {@link guide/expression expression}.\n\
       *    - `function(scope)`: execute the function with the current `scope` parameter.\n\
       *\n\
       * @returns {*} The result of evaluating the expression.\n\
       */\n\
      $eval: function(expr, locals) {\n\
        return $parse(expr)(this, locals);\n\
      },\n\
\n\
      /**\n\
       * @ngdoc function\n\
       * @name ng.$rootScope.Scope#$evalAsync\n\
       * @methodOf ng.$rootScope.Scope\n\
       * @function\n\
       *\n\
       * @description\n\
       * Executes the expression on the current scope at a later point in time.\n\
       *\n\
       * The `$evalAsync` makes no guarantees as to when the `expression` will be executed, only that:\n\
       *\n\
       *   - it will execute in the current script execution context (before any DOM rendering).\n\
       *   - at least one {@link ng.$rootScope.Scope#$digest $digest cycle} will be performed after\n\
       *     `expression` execution.\n\
       *\n\
       * Any exceptions from the execution of the expression are forwarded to the\n\
       * {@link ng.$exceptionHandler $exceptionHandler} service.\n\
       *\n\
       * @param {(string|function())=} expression An angular expression to be executed.\n\
       *\n\
       *    - `string`: execute using the rules as defined in  {@link guide/expression expression}.\n\
       *    - `function(scope)`: execute the function with the current `scope` parameter.\n\
       *\n\
       */\n\
      $evalAsync: function(expr) {\n\
        this.$$asyncQueue.push(expr);\n\
      },\n\
\n\
      /**\n\
       * @ngdoc function\n\
       * @name ng.$rootScope.Scope#$apply\n\
       * @methodOf ng.$rootScope.Scope\n\
       * @function\n\
       *\n\
       * @description\n\
       * `$apply()` is used to execute an expression in angular from outside of the angular framework.\n\
       * (For example from browser DOM events, setTimeout, XHR or third party libraries).\n\
       * Because we are calling into the angular framework we need to perform proper scope life-cycle\n\
       * of {@link ng.$exceptionHandler exception handling},\n\
       * {@link ng.$rootScope.Scope#$digest executing watches}.\n\
       *\n\
       * ## Life cycle\n\
       *\n\
       * # Pseudo-Code of `$apply()`\n\
       * <pre>\n\
           function $apply(expr) {\n\
             try {\n\
               return $eval(expr);\n\
             } catch (e) {\n\
               $exceptionHandler(e);\n\
             } finally {\n\
               $root.$digest();\n\
             }\n\
           }\n\
       * </pre>\n\
       *\n\
       *\n\
       * Scope's `$apply()` method transitions through the following stages:\n\
       *\n\
       * 1. The {@link guide/expression expression} is executed using the\n\
       *    {@link ng.$rootScope.Scope#$eval $eval()} method.\n\
       * 2. Any exceptions from the execution of the expression are forwarded to the\n\
       *    {@link ng.$exceptionHandler $exceptionHandler} service.\n\
       * 3. The {@link ng.$rootScope.Scope#$watch watch} listeners are fired immediately after the expression\n\
       *    was executed using the {@link ng.$rootScope.Scope#$digest $digest()} method.\n\
       *\n\
       *\n\
       * @param {(string|function())=} exp An angular expression to be executed.\n\
       *\n\
       *    - `string`: execute using the rules as defined in {@link guide/expression expression}.\n\
       *    - `function(scope)`: execute the function with current `scope` parameter.\n\
       *\n\
       * @returns {*} The result of evaluating the expression.\n\
       */\n\
      $apply: function(expr) {\n\
        try {\n\
          beginPhase('$apply');\n\
          return this.$eval(expr);\n\
        } catch (e) {\n\
          $exceptionHandler(e);\n\
        } finally {\n\
          clearPhase();\n\
          try {\n\
            $rootScope.$digest();\n\
          } catch (e) {\n\
            $exceptionHandler(e);\n\
            throw e;\n\
          }\n\
        }\n\
      },\n\
\n\
      /**\n\
       * @ngdoc function\n\
       * @name ng.$rootScope.Scope#$on\n\
       * @methodOf ng.$rootScope.Scope\n\
       * @function\n\
       *\n\
       * @description\n\
       * Listens on events of a given type. See {@link ng.$rootScope.Scope#$emit $emit} for discussion of\n\
       * event life cycle.\n\
       *\n\
       * The event listener function format is: `function(event, args...)`. The `event` object\n\
       * passed into the listener has the following attributes:\n\
       *\n\
       *   - `targetScope` - `{Scope}`: the scope on which the event was `$emit`-ed or `$broadcast`-ed.\n\
       *   - `currentScope` - `{Scope}`: the current scope which is handling the event.\n\
       *   - `name` - `{string}`: Name of the event.\n\
       *   - `stopPropagation` - `{function=}`: calling `stopPropagation` function will cancel further event\n\
       *     propagation (available only for events that were `$emit`-ed).\n\
       *   - `preventDefault` - `{function}`: calling `preventDefault` sets `defaultPrevented` flag to true.\n\
       *   - `defaultPrevented` - `{boolean}`: true if `preventDefault` was called.\n\
       *\n\
       * @param {string} name Event name to listen on.\n\
       * @param {function(event, args...)} listener Function to call when the event is emitted.\n\
       * @returns {function()} Returns a deregistration function for this listener.\n\
       */\n\
      $on: function(name, listener) {\n\
        var namedListeners = this.$$listeners[name];\n\
        if (!namedListeners) {\n\
          this.$$listeners[name] = namedListeners = [];\n\
        }\n\
        namedListeners.push(listener);\n\
\n\
        return function() {\n\
          namedListeners[indexOf(namedListeners, listener)] = null;\n\
        };\n\
      },\n\
\n\
\n\
      /**\n\
       * @ngdoc function\n\
       * @name ng.$rootScope.Scope#$emit\n\
       * @methodOf ng.$rootScope.Scope\n\
       * @function\n\
       *\n\
       * @description\n\
       * Dispatches an event `name` upwards through the scope hierarchy notifying the\n\
       * registered {@link ng.$rootScope.Scope#$on} listeners.\n\
       *\n\
       * The event life cycle starts at the scope on which `$emit` was called. All\n\
       * {@link ng.$rootScope.Scope#$on listeners} listening for `name` event on this scope get notified.\n\
       * Afterwards, the event traverses upwards toward the root scope and calls all registered\n\
       * listeners along the way. The event will stop propagating if one of the listeners cancels it.\n\
       *\n\
       * Any exception emitted from the {@link ng.$rootScope.Scope#$on listeners} will be passed\n\
       * onto the {@link ng.$exceptionHandler $exceptionHandler} service.\n\
       *\n\
       * @param {string} name Event name to emit.\n\
       * @param {...*} args Optional set of arguments which will be passed onto the event listeners.\n\
       * @return {Object} Event object, see {@link ng.$rootScope.Scope#$on}\n\
       */\n\
      $emit: function(name, args) {\n\
        var empty = [],\n\
            namedListeners,\n\
            scope = this,\n\
            stopPropagation = false,\n\
            event = {\n\
              name: name,\n\
              targetScope: scope,\n\
              stopPropagation: function() {stopPropagation = true;},\n\
              preventDefault: function() {\n\
                event.defaultPrevented = true;\n\
              },\n\
              defaultPrevented: false\n\
            },\n\
            listenerArgs = concat([event], arguments, 1),\n\
            i, length;\n\
\n\
        do {\n\
          namedListeners = scope.$$listeners[name] || empty;\n\
          event.currentScope = scope;\n\
          for (i=0, length=namedListeners.length; i<length; i++) {\n\
\n\
            // if listeners were deregistered, defragment the array\n\
            if (!namedListeners[i]) {\n\
              namedListeners.splice(i, 1);\n\
              i--;\n\
              length--;\n\
              continue;\n\
            }\n\
            try {\n\
              namedListeners[i].apply(null, listenerArgs);\n\
              if (stopPropagation) return event;\n\
            } catch (e) {\n\
              $exceptionHandler(e);\n\
            }\n\
          }\n\
          //traverse upwards\n\
          scope = scope.$parent;\n\
        } while (scope);\n\
\n\
        return event;\n\
      },\n\
\n\
\n\
      /**\n\
       * @ngdoc function\n\
       * @name ng.$rootScope.Scope#$broadcast\n\
       * @methodOf ng.$rootScope.Scope\n\
       * @function\n\
       *\n\
       * @description\n\
       * Dispatches an event `name` downwards to all child scopes (and their children) notifying the\n\
       * registered {@link ng.$rootScope.Scope#$on} listeners.\n\
       *\n\
       * The event life cycle starts at the scope on which `$broadcast` was called. All\n\
       * {@link ng.$rootScope.Scope#$on listeners} listening for `name` event on this scope get notified.\n\
       * Afterwards, the event propagates to all direct and indirect scopes of the current scope and\n\
       * calls all registered listeners along the way. The event cannot be canceled.\n\
       *\n\
       * Any exception emitted from the {@link ng.$rootScope.Scope#$on listeners} will be passed\n\
       * onto the {@link ng.$exceptionHandler $exceptionHandler} service.\n\
       *\n\
       * @param {string} name Event name to broadcast.\n\
       * @param {...*} args Optional set of arguments which will be passed onto the event listeners.\n\
       * @return {Object} Event object, see {@link ng.$rootScope.Scope#$on}\n\
       */\n\
      $broadcast: function(name, args) {\n\
        var target = this,\n\
            current = target,\n\
            next = target,\n\
            event = {\n\
              name: name,\n\
              targetScope: target,\n\
              preventDefault: function() {\n\
                event.defaultPrevented = true;\n\
              },\n\
              defaultPrevented: false\n\
            },\n\
            listenerArgs = concat([event], arguments, 1),\n\
            listeners, i, length;\n\
\n\
        //down while you can, then up and next sibling or up and next sibling until back at root\n\
        do {\n\
          current = next;\n\
          event.currentScope = current;\n\
          listeners = current.$$listeners[name] || [];\n\
          for (i=0, length = listeners.length; i<length; i++) {\n\
            // if listeners were deregistered, defragment the array\n\
            if (!listeners[i]) {\n\
              listeners.splice(i, 1);\n\
              i--;\n\
              length--;\n\
              continue;\n\
            }\n\
\n\
            try {\n\
              listeners[i].apply(null, listenerArgs);\n\
            } catch(e) {\n\
              $exceptionHandler(e);\n\
            }\n\
          }\n\
\n\
          // Insanity Warning: scope depth-first traversal\n\
          // yes, this code is a bit crazy, but it works and we have tests to prove it!\n\
          // this piece should be kept in sync with the traversal in $digest\n\
          if (!(next = (current.$$childHead || (current !== target && current.$$nextSibling)))) {\n\
            while(current !== target && !(next = current.$$nextSibling)) {\n\
              current = current.$parent;\n\
            }\n\
          }\n\
        } while ((current = next));\n\
\n\
        return event;\n\
      }\n\
    };\n\
\n\
    var $rootScope = new Scope();\n\
\n\
    return $rootScope;\n\
\n\
\n\
    function beginPhase(phase) {\n\
      if ($rootScope.$$phase) {\n\
        throw Error($rootScope.$$phase + ' already in progress');\n\
      }\n\
\n\
      $rootScope.$$phase = phase;\n\
    }\n\
\n\
    function clearPhase() {\n\
      $rootScope.$$phase = null;\n\
    }\n\
\n\
    function compileToFn(exp, name) {\n\
      var fn = $parse(exp);\n\
      assertArgFn(fn, name);\n\
      return fn;\n\
    }\n\
\n\
    /**\n\
     * function used as an initial value for watchers.\n\
     * because it's unique we can easily tell it apart from other values\n\
     */\n\
    function initWatchVal() {}\n\
  }];\n\
}\n\
\n\
/**\n\
 * !!! This is an undocumented \"private\" service !!!\n\
 *\n\
 * @name ng.$sniffer\n\
 * @requires $window\n\
 * @requires $document\n\
 *\n\
 * @property {boolean} history Does the browser support html5 history api ?\n\
 * @property {boolean} hashchange Does the browser support hashchange event ?\n\
 * @property {boolean} transitions Does the browser support CSS transition events ?\n\
 * @property {boolean} animations Does the browser support CSS animation events ?\n\
 *\n\
 * @description\n\
 * This is very simple implementation of testing browser's features.\n\
 */\n\
function $SnifferProvider() {\n\
  this.$get = ['$window', '$document', function($window, $document) {\n\
    var eventSupport = {},\n\
        android = int((/android (\\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]),\n\
        document = $document[0] || {},\n\
        vendorPrefix,\n\
        vendorRegex = /^(Moz|webkit|O|ms)(?=[A-Z])/,\n\
        bodyStyle = document.body && document.body.style,\n\
        transitions = false,\n\
        animations = false,\n\
        match;\n\
\n\
    if (bodyStyle) {\n\
      for(var prop in bodyStyle) {\n\
        if(match = vendorRegex.exec(prop)) {\n\
          vendorPrefix = match[0];\n\
          vendorPrefix = vendorPrefix.substr(0, 1).toUpperCase() + vendorPrefix.substr(1);\n\
          break;\n\
        }\n\
      }\n\
      transitions = !!(('transition' in bodyStyle) || (vendorPrefix + 'Transition' in bodyStyle));\n\
      animations  = !!(('animation' in bodyStyle) || (vendorPrefix + 'Animation' in bodyStyle));\n\
    }\n\
\n\
\n\
    return {\n\
      // Android has history.pushState, but it does not update location correctly\n\
      // so let's not use the history API at all.\n\
      // http://code.google.com/p/android/issues/detail?id=17471\n\
      // https://github.com/angular/angular.js/issues/904\n\
      history: !!($window.history && $window.history.pushState && !(android < 4)),\n\
      hashchange: 'onhashchange' in $window &&\n\
                  // IE8 compatible mode lies\n\
                  (!document.documentMode || document.documentMode > 7),\n\
      hasEvent: function(event) {\n\
        // IE9 implements 'input' event it's so fubared that we rather pretend that it doesn't have\n\
        // it. In particular the event is not fired when backspace or delete key are pressed or\n\
        // when cut operation is performed.\n\
        if (event == 'input' && msie == 9) return false;\n\
\n\
        if (isUndefined(eventSupport[event])) {\n\
          var divElm = document.createElement('div');\n\
          eventSupport[event] = 'on' + event in divElm;\n\
        }\n\
\n\
        return eventSupport[event];\n\
      },\n\
      csp: document.securityPolicy ? document.securityPolicy.isActive : false,\n\
      vendorPrefix: vendorPrefix,\n\
      transitions : transitions,\n\
      animations : animations\n\
    };\n\
  }];\n\
}\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.$window\n\
 *\n\
 * @description\n\
 * A reference to the browser's `window` object. While `window`\n\
 * is globally available in JavaScript, it causes testability problems, because\n\
 * it is a global variable. In angular we always refer to it through the\n\
 * `$window` service, so it may be overridden, removed or mocked for testing.\n\
 *\n\
 * All expressions are evaluated with respect to current scope so they don't\n\
 * suffer from window globality.\n\
 *\n\
 * @example\n\
   <doc:example>\n\
     <doc:source>\n\
       <script>\n\
         function Ctrl($scope, $window) {\n\
           $scope.$window = $window;\n\
           $scope.greeting = 'Hello, World!';\n\
         }\n\
       </script>\n\
       <div ng-controller=\"Ctrl\">\n\
         <input type=\"text\" ng-model=\"greeting\" />\n\
         <button ng-click=\"$window.alert(greeting)\">ALERT</button>\n\
       </div>\n\
     </doc:source>\n\
     <doc:scenario>\n\
      it('should display the greeting in the input box', function() {\n\
       input('greeting').enter('Hello, E2E Tests');\n\
       // If we click the button it will block the test runner\n\
       // element(':button').click();\n\
      });\n\
     </doc:scenario>\n\
   </doc:example>\n\
 */\n\
function $WindowProvider(){\n\
  this.$get = valueFn(window);\n\
}\n\
\n\
/**\n\
 * Parse headers into key value object\n\
 *\n\
 * @param {string} headers Raw headers as a string\n\
 * @returns {Object} Parsed headers as key value object\n\
 */\n\
function parseHeaders(headers) {\n\
  var parsed = {}, key, val, i;\n\
\n\
  if (!headers) return parsed;\n\
\n\
  forEach(headers.split('\\n\
'), function(line) {\n\
    i = line.indexOf(':');\n\
    key = lowercase(trim(line.substr(0, i)));\n\
    val = trim(line.substr(i + 1));\n\
\n\
    if (key) {\n\
      if (parsed[key]) {\n\
        parsed[key] += ', ' + val;\n\
      } else {\n\
        parsed[key] = val;\n\
      }\n\
    }\n\
  });\n\
\n\
  return parsed;\n\
}\n\
\n\
\n\
var IS_SAME_DOMAIN_URL_MATCH = /^(([^:]+):)?\\/\\/(\\w+:{0,1}\\w*@)?([\\w\\.-]*)?(:([0-9]+))?(.*)$/;\n\
\n\
\n\
/**\n\
 * Parse a request and location URL and determine whether this is a same-domain request.\n\
 *\n\
 * @param {string} requestUrl The url of the request.\n\
 * @param {string} locationUrl The current browser location url.\n\
 * @returns {boolean} Whether the request is for the same domain.\n\
 */\n\
function isSameDomain(requestUrl, locationUrl) {\n\
  var match = IS_SAME_DOMAIN_URL_MATCH.exec(requestUrl);\n\
  // if requestUrl is relative, the regex does not match.\n\
  if (match == null) return true;\n\
\n\
  var domain1 = {\n\
      protocol: match[2],\n\
      host: match[4],\n\
      port: int(match[6]) || DEFAULT_PORTS[match[2]] || null,\n\
      // IE8 sets unmatched groups to '' instead of undefined.\n\
      relativeProtocol: match[2] === undefined || match[2] === ''\n\
    };\n\
\n\
  match = SERVER_MATCH.exec(locationUrl);\n\
  var domain2 = {\n\
      protocol: match[1],\n\
      host: match[3],\n\
      port: int(match[5]) || DEFAULT_PORTS[match[1]] || null\n\
    };\n\
\n\
  return (domain1.protocol == domain2.protocol || domain1.relativeProtocol) &&\n\
         domain1.host == domain2.host &&\n\
         (domain1.port == domain2.port || (domain1.relativeProtocol &&\n\
             domain2.port == DEFAULT_PORTS[domain2.protocol]));\n\
}\n\
\n\
\n\
/**\n\
 * Returns a function that provides access to parsed headers.\n\
 *\n\
 * Headers are lazy parsed when first requested.\n\
 * @see parseHeaders\n\
 *\n\
 * @param {(string|Object)} headers Headers to provide access to.\n\
 * @returns {function(string=)} Returns a getter function which if called with:\n\
 *\n\
 *   - if called with single an argument returns a single header value or null\n\
 *   - if called with no arguments returns an object containing all headers.\n\
 */\n\
function headersGetter(headers) {\n\
  var headersObj = isObject(headers) ? headers : undefined;\n\
\n\
  return function(name) {\n\
    if (!headersObj) headersObj =  parseHeaders(headers);\n\
\n\
    if (name) {\n\
      return headersObj[lowercase(name)] || null;\n\
    }\n\
\n\
    return headersObj;\n\
  };\n\
}\n\
\n\
\n\
/**\n\
 * Chain all given functions\n\
 *\n\
 * This function is used for both request and response transforming\n\
 *\n\
 * @param {*} data Data to transform.\n\
 * @param {function(string=)} headers Http headers getter fn.\n\
 * @param {(function|Array.<function>)} fns Function or an array of functions.\n\
 * @returns {*} Transformed data.\n\
 */\n\
function transformData(data, headers, fns) {\n\
  if (isFunction(fns))\n\
    return fns(data, headers);\n\
\n\
  forEach(fns, function(fn) {\n\
    data = fn(data, headers);\n\
  });\n\
\n\
  return data;\n\
}\n\
\n\
\n\
function isSuccess(status) {\n\
  return 200 <= status && status < 300;\n\
}\n\
\n\
\n\
function $HttpProvider() {\n\
  var JSON_START = /^\\s*(\\[|\\{[^\\{])/,\n\
      JSON_END = /[\\}\\]]\\s*$/,\n\
      PROTECTION_PREFIX = /^\\)\\]\\}',?\\n\
/,\n\
      CONTENT_TYPE_APPLICATION_JSON = {'Content-Type': 'application/json;charset=utf-8'};\n\
\n\
  var defaults = this.defaults = {\n\
    // transform incoming response data\n\
    transformResponse: [function(data) {\n\
      if (isString(data)) {\n\
        // strip json vulnerability protection prefix\n\
        data = data.replace(PROTECTION_PREFIX, '');\n\
        if (JSON_START.test(data) && JSON_END.test(data))\n\
          data = fromJson(data, true);\n\
      }\n\
      return data;\n\
    }],\n\
\n\
    // transform outgoing request data\n\
    transformRequest: [function(d) {\n\
      return isObject(d) && !isFile(d) ? toJson(d) : d;\n\
    }],\n\
\n\
    // default headers\n\
    headers: {\n\
      common: {\n\
        'Accept': 'application/json, text/plain, */*'\n\
      },\n\
      post:   CONTENT_TYPE_APPLICATION_JSON,\n\
      put:    CONTENT_TYPE_APPLICATION_JSON,\n\
      patch:  CONTENT_TYPE_APPLICATION_JSON\n\
    },\n\
\n\
    xsrfCookieName: 'XSRF-TOKEN',\n\
    xsrfHeaderName: 'X-XSRF-TOKEN'\n\
  };\n\
\n\
  /**\n\
   * Are order by request. I.E. they are applied in the same order as\n\
   * array on request, but revers order on response.\n\
   */\n\
  var interceptorFactories = this.interceptors = [];\n\
  /**\n\
   * For historical reasons, response interceptors ordered by the order in which\n\
   * they are applied to response. (This is in revers to interceptorFactories)\n\
   */\n\
  var responseInterceptorFactories = this.responseInterceptors = [];\n\
\n\
  this.$get = ['$httpBackend', '$browser', '$cacheFactory', '$rootScope', '$q', '$injector',\n\
      function($httpBackend, $browser, $cacheFactory, $rootScope, $q, $injector) {\n\
\n\
    var defaultCache = $cacheFactory('$http');\n\
\n\
    /**\n\
     * Interceptors stored in reverse order. Inner interceptors before outer interceptors.\n\
     * The reversal is needed so that we can build up the interception chain around the\n\
     * server request.\n\
     */\n\
    var reversedInterceptors = [];\n\
\n\
    forEach(interceptorFactories, function(interceptorFactory) {\n\
      reversedInterceptors.unshift(isString(interceptorFactory)\n\
          ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory));\n\
    });\n\
\n\
    forEach(responseInterceptorFactories, function(interceptorFactory, index) {\n\
      var responseFn = isString(interceptorFactory)\n\
          ? $injector.get(interceptorFactory)\n\
          : $injector.invoke(interceptorFactory);\n\
\n\
      /**\n\
       * Response interceptors go before \"around\" interceptors (no real reason, just\n\
       * had to pick one.) But they are already revesed, so we can't use unshift, hence\n\
       * the splice.\n\
       */\n\
      reversedInterceptors.splice(index, 0, {\n\
        response: function(response) {\n\
          return responseFn($q.when(response));\n\
        },\n\
        responseError: function(response) {\n\
          return responseFn($q.reject(response));\n\
        }\n\
      });\n\
    });\n\
\n\
\n\
    /**\n\
     * @ngdoc function\n\
     * @name ng.$http\n\
     * @requires $httpBackend\n\
     * @requires $browser\n\
     * @requires $cacheFactory\n\
     * @requires $rootScope\n\
     * @requires $q\n\
     * @requires $injector\n\
     *\n\
     * @description\n\
     * The `$http` service is a core Angular service that facilitates communication with the remote\n\
     * HTTP servers via the browser's {@link https://developer.mozilla.org/en/xmlhttprequest\n\
     * XMLHttpRequest} object or via {@link http://en.wikipedia.org/wiki/JSONP JSONP}.\n\
     *\n\
     * For unit testing applications that use `$http` service, see\n\
     * {@link ngMock.$httpBackend $httpBackend mock}.\n\
     *\n\
     * For a higher level of abstraction, please check out the {@link ngResource.$resource\n\
     * $resource} service.\n\
     *\n\
     * The $http API is based on the {@link ng.$q deferred/promise APIs} exposed by\n\
     * the $q service. While for simple usage patterns this doesn't matter much, for advanced usage\n\
     * it is important to familiarize yourself with these APIs and the guarantees they provide.\n\
     *\n\
     *\n\
     * # General usage\n\
     * The `$http` service is a function which takes a single argument â€” a configuration object â€”\n\
     * that is used to generate an HTTP request and returns  a {@link ng.$q promise}\n\
     * with two $http specific methods: `success` and `error`.\n\
     *\n\
     * <pre>\n\
     *   $http({method: 'GET', url: '/someUrl'}).\n\
     *     success(function(data, status, headers, config) {\n\
     *       // this callback will be called asynchronously\n\
     *       // when the response is available\n\
     *     }).\n\
     *     error(function(data, status, headers, config) {\n\
     *       // called asynchronously if an error occurs\n\
     *       // or server returns response with an error status.\n\
     *     });\n\
     * </pre>\n\
     *\n\
     * Since the returned value of calling the $http function is a `promise`, you can also use\n\
     * the `then` method to register callbacks, and these callbacks will receive a single argument â€“\n\
     * an object representing the response. See the API signature and type info below for more\n\
     * details.\n\
     *\n\
     * A response status code between 200 and 299 is considered a success status and\n\
     * will result in the success callback being called. Note that if the response is a redirect,\n\
     * XMLHttpRequest will transparently follow it, meaning that the error callback will not be\n\
     * called for such responses.\n\
     *\n\
     * # Shortcut methods\n\
     *\n\
     * Since all invocations of the $http service require passing in an HTTP method and URL, and\n\
     * POST/PUT requests require request data to be provided as well, shortcut methods\n\
     * were created:\n\
     *\n\
     * <pre>\n\
     *   $http.get('/someUrl').success(successCallback);\n\
     *   $http.post('/someUrl', data).success(successCallback);\n\
     * </pre>\n\
     *\n\
     * Complete list of shortcut methods:\n\
     *\n\
     * - {@link ng.$http#get $http.get}\n\
     * - {@link ng.$http#head $http.head}\n\
     * - {@link ng.$http#post $http.post}\n\
     * - {@link ng.$http#put $http.put}\n\
     * - {@link ng.$http#delete $http.delete}\n\
     * - {@link ng.$http#jsonp $http.jsonp}\n\
     *\n\
     *\n\
     * # Setting HTTP Headers\n\
     *\n\
     * The $http service will automatically add certain HTTP headers to all requests. These defaults\n\
     * can be fully configured by accessing the `$httpProvider.defaults.headers` configuration\n\
     * object, which currently contains this default configuration:\n\
     *\n\
     * - `$httpProvider.defaults.headers.common` (headers that are common for all requests):\n\
     *   - `Accept: application/json, text/plain, * / *`\n\
     * - `$httpProvider.defaults.headers.post`: (header defaults for POST requests)\n\
     *   - `Content-Type: application/json`\n\
     * - `$httpProvider.defaults.headers.put` (header defaults for PUT requests)\n\
     *   - `Content-Type: application/json`\n\
     *\n\
     * To add or overwrite these defaults, simply add or remove a property from these configuration\n\
     * objects. To add headers for an HTTP method other than POST or PUT, simply add a new object\n\
     * with the lowercased HTTP method name as the key, e.g.\n\
     * `$httpProvider.defaults.headers.get['My-Header']='value'`.\n\
     *\n\
     * Additionally, the defaults can be set at runtime via the `$http.defaults` object in the same\n\
     * fashion.\n\
     *\n\
     *\n\
     * # Transforming Requests and Responses\n\
     *\n\
     * Both requests and responses can be transformed using transform functions. By default, Angular\n\
     * applies these transformations:\n\
     *\n\
     * Request transformations:\n\
     *\n\
     * - If the `data` property of the request configuration object contains an object, serialize it into\n\
     *   JSON format.\n\
     *\n\
     * Response transformations:\n\
     *\n\
     *  - If XSRF prefix is detected, strip it (see Security Considerations section below).\n\
     *  - If JSON response is detected, deserialize it using a JSON parser.\n\
     *\n\
     * To globally augment or override the default transforms, modify the `$httpProvider.defaults.transformRequest` and\n\
     * `$httpProvider.defaults.transformResponse` properties. These properties are by default an\n\
     * array of transform functions, which allows you to `push` or `unshift` a new transformation function into the\n\
     * transformation chain. You can also decide to completely override any default transformations by assigning your\n\
     * transformation functions to these properties directly without the array wrapper.\n\
     *\n\
     * Similarly, to locally override the request/response transforms, augment the `transformRequest` and/or\n\
     * `transformResponse` properties of the configuration object passed into `$http`.\n\
     *\n\
     *\n\
     * # Caching\n\
     *\n\
     * To enable caching, set the configuration property `cache` to `true`. When the cache is\n\
     * enabled, `$http` stores the response from the server in local cache. Next time the\n\
     * response is served from the cache without sending a request to the server.\n\
     *\n\
     * Note that even if the response is served from cache, delivery of the data is asynchronous in\n\
     * the same way that real requests are.\n\
     *\n\
     * If there are multiple GET requests for the same URL that should be cached using the same\n\
     * cache, but the cache is not populated yet, only one request to the server will be made and\n\
     * the remaining requests will be fulfilled using the response from the first request.\n\
     *\n\
     * A custom default cache built with $cacheFactory can be provided in $http.defaults.cache.\n\
     * To skip it, set configuration property `cache` to `false`.\n\
     *\n\
     *\n\
     * # Interceptors\n\
     *\n\
     * Before you start creating interceptors, be sure to understand the\n\
     * {@link ng.$q $q and deferred/promise APIs}.\n\
     *\n\
     * For purposes of global error handling, authentication, or any kind of synchronous or\n\
     * asynchronous pre-processing of request or postprocessing of responses, it is desirable to be\n\
     * able to intercept requests before they are handed to the server and\n\
     * responses before they are handed over to the application code that\n\
     * initiated these requests. The interceptors leverage the {@link ng.$q\n\
     * promise APIs} to fulfill this need for both synchronous and asynchronous pre-processing.\n\
     *\n\
     * The interceptors are service factories that are registered with the `$httpProvider` by\n\
     * adding them to the `$httpProvider.interceptors` array. The factory is called and\n\
     * injected with dependencies (if specified) and returns the interceptor.\n\
     *\n\
     * There are two kinds of interceptors (and two kinds of rejection interceptors):\n\
     *\n\
     *   * `request`: interceptors get called with http `config` object. The function is free to modify\n\
     *     the `config` or create a new one. The function needs to return the `config` directly or as a\n\
     *     promise.\n\
     *   * `requestError`: interceptor gets called when a previous interceptor threw an error or resolved\n\
     *      with a rejection.\n\
     *   * `response`: interceptors get called with http `response` object. The function is free to modify\n\
     *     the `response` or create a new one. The function needs to return the `response` directly or as a\n\
     *     promise.\n\
     *   * `responseError`: interceptor gets called when a previous interceptor threw an error or resolved\n\
     *      with a rejection.\n\
     *\n\
     *\n\
     * <pre>\n\
     *   // register the interceptor as a service\n\
     *   $provide.factory('myHttpInterceptor', function($q, dependency1, dependency2) {\n\
     *     return {\n\
     *       // optional method\n\
     *       'request': function(config) {\n\
     *         // do something on success\n\
     *         return config || $q.when(config);\n\
     *       },\n\
     *\n\
     *       // optional method\n\
     *      'requestError': function(rejection) {\n\
     *         // do something on error\n\
     *         if (canRecover(rejection)) {\n\
     *           return responseOrNewPromise\n\
     *         }\n\
     *         return $q.reject(rejection);\n\
     *       },\n\
     *\n\
     *\n\
     *\n\
     *       // optional method\n\
     *       'response': function(response) {\n\
     *         // do something on success\n\
     *         return response || $q.when(response);\n\
     *       },\n\
     *\n\
     *       // optional method\n\
     *      'responseError': function(rejection) {\n\
     *         // do something on error\n\
     *         if (canRecover(rejection)) {\n\
     *           return responseOrNewPromise\n\
     *         }\n\
     *         return $q.reject(rejection);\n\
     *       };\n\
     *     }\n\
     *   });\n\
     *\n\
     *   $httpProvider.interceptors.push('myHttpInterceptor');\n\
     *\n\
     *\n\
     *   // register the interceptor via an anonymous factory\n\
     *   $httpProvider.interceptors.push(function($q, dependency1, dependency2) {\n\
     *     return {\n\
     *      'request': function(config) {\n\
     *          // same as above\n\
     *       },\n\
     *       'response': function(response) {\n\
     *          // same as above\n\
     *       }\n\
     *   });\n\
     * </pre>\n\
     *\n\
     * # Response interceptors (DEPRECATED)\n\
     *\n\
     * Before you start creating interceptors, be sure to understand the\n\
     * {@link ng.$q $q and deferred/promise APIs}.\n\
     *\n\
     * For purposes of global error handling, authentication or any kind of synchronous or\n\
     * asynchronous preprocessing of received responses, it is desirable to be able to intercept\n\
     * responses for http requests before they are handed over to the application code that\n\
     * initiated these requests. The response interceptors leverage the {@link ng.$q\n\
     * promise apis} to fulfil this need for both synchronous and asynchronous preprocessing.\n\
     *\n\
     * The interceptors are service factories that are registered with the $httpProvider by\n\
     * adding them to the `$httpProvider.responseInterceptors` array. The factory is called and\n\
     * injected with dependencies (if specified) and returns the interceptor  â€” a function that\n\
     * takes a {@link ng.$q promise} and returns the original or a new promise.\n\
     *\n\
     * <pre>\n\
     *   // register the interceptor as a service\n\
     *   $provide.factory('myHttpInterceptor', function($q, dependency1, dependency2) {\n\
     *     return function(promise) {\n\
     *       return promise.then(function(response) {\n\
     *         // do something on success\n\
     *       }, function(response) {\n\
     *         // do something on error\n\
     *         if (canRecover(response)) {\n\
     *           return responseOrNewPromise\n\
     *         }\n\
     *         return $q.reject(response);\n\
     *       });\n\
     *     }\n\
     *   });\n\
     *\n\
     *   $httpProvider.responseInterceptors.push('myHttpInterceptor');\n\
     *\n\
     *\n\
     *   // register the interceptor via an anonymous factory\n\
     *   $httpProvider.responseInterceptors.push(function($q, dependency1, dependency2) {\n\
     *     return function(promise) {\n\
     *       // same as above\n\
     *     }\n\
     *   });\n\
     * </pre>\n\
     *\n\
     *\n\
     * # Security Considerations\n\
     *\n\
     * When designing web applications, consider security threats from:\n\
     *\n\
     * - {@link http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx\n\
     *   JSON vulnerability}\n\
     * - {@link http://en.wikipedia.org/wiki/Cross-site_request_forgery XSRF}\n\
     *\n\
     * Both server and the client must cooperate in order to eliminate these threats. Angular comes\n\
     * pre-configured with strategies that address these issues, but for this to work backend server\n\
     * cooperation is required.\n\
     *\n\
     * ## JSON Vulnerability Protection\n\
     *\n\
     * A {@link http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx\n\
     * JSON vulnerability} allows third party website to turn your JSON resource URL into\n\
     * {@link http://en.wikipedia.org/wiki/JSONP JSONP} request under some conditions. To\n\
     * counter this your server can prefix all JSON requests with following string `\")]}',\\n\
\"`.\n\
     * Angular will automatically strip the prefix before processing it as JSON.\n\
     *\n\
     * For example if your server needs to return:\n\
     * <pre>\n\
     * ['one','two']\n\
     * </pre>\n\
     *\n\
     * which is vulnerable to attack, your server can return:\n\
     * <pre>\n\
     * )]}',\n\
     * ['one','two']\n\
     * </pre>\n\
     *\n\
     * Angular will strip the prefix, before processing the JSON.\n\
     *\n\
     *\n\
     * ## Cross Site Request Forgery (XSRF) Protection\n\
     *\n\
     * {@link http://en.wikipedia.org/wiki/Cross-site_request_forgery XSRF} is a technique by which\n\
     * an unauthorized site can gain your user's private data. Angular provides a mechanism\n\
     * to counter XSRF. When performing XHR requests, the $http service reads a token from a cookie\n\
     * (by default, `XSRF-TOKEN`) and sets it as an HTTP header (`X-XSRF-TOKEN`). Since only\n\
     * JavaScript that runs on your domain could read the cookie, your server can be assured that\n\
     * the XHR came from JavaScript running on your domain. The header will not be set for\n\
     * cross-domain requests.\n\
     *\n\
     * To take advantage of this, your server needs to set a token in a JavaScript readable session\n\
     * cookie called `XSRF-TOKEN` on the first HTTP GET request. On subsequent XHR requests the\n\
     * server can verify that the cookie matches `X-XSRF-TOKEN` HTTP header, and therefore be sure\n\
     * that only JavaScript running on your domain could have sent the request. The token must be\n\
     * unique for each user and must be verifiable by the server (to prevent the JavaScript from making\n\
     * up its own tokens). We recommend that the token is a digest of your site's authentication\n\
     * cookie with a {@link https://en.wikipedia.org/wiki/Salt_(cryptography) salt} for added security.\n\
     *\n\
     * The name of the headers can be specified using the xsrfHeaderName and xsrfCookieName\n\
     * properties of either $httpProvider.defaults, or the per-request config object.\n\
     *\n\
     *\n\
     * @param {object} config Object describing the request to be made and how it should be\n\
     *    processed. The object has following properties:\n\
     *\n\
     *    - **method** â€“ `{string}` â€“ HTTP method (e.g. 'GET', 'POST', etc)\n\
     *    - **url** â€“ `{string}` â€“ Absolute or relative URL of the resource that is being requested.\n\
     *    - **params** â€“ `{Object.<string|Object>}` â€“ Map of strings or objects which will be turned to\n\
     *      `?key1=value1&key2=value2` after the url. If the value is not a string, it will be JSONified.\n\
     *    - **data** â€“ `{string|Object}` â€“ Data to be sent as the request message data.\n\
     *    - **headers** â€“ `{Object}` â€“ Map of strings representing HTTP headers to send to the server.\n\
     *    - **xsrfHeaderName** â€“ `{string}` â€“ Name of HTTP header to populate with the XSRF token.\n\
     *    - **xsrfCookieName** â€“ `{string}` â€“ Name of cookie containing the XSRF token.\n\
     *    - **transformRequest** â€“ `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` â€“\n\
     *      transform function or an array of such functions. The transform function takes the http\n\
     *      request body and headers and returns its transformed (typically serialized) version.\n\
     *    - **transformResponse** â€“ `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` â€“\n\
     *      transform function or an array of such functions. The transform function takes the http\n\
     *      response body and headers and returns its transformed (typically deserialized) version.\n\
     *    - **cache** â€“ `{boolean|Cache}` â€“ If true, a default $http cache will be used to cache the\n\
     *      GET request, otherwise if a cache instance built with\n\
     *      {@link ng.$cacheFactory $cacheFactory}, this cache will be used for\n\
     *      caching.\n\
     *    - **timeout** â€“ `{number|Promise}` â€“ timeout in milliseconds, or {@link ng.$q promise}\n\
     *      that should abort the request when resolved.\n\
     *    - **withCredentials** - `{boolean}` - whether to to set the `withCredentials` flag on the\n\
     *      XHR object. See {@link https://developer.mozilla.org/en/http_access_control#section_5\n\
     *      requests with credentials} for more information.\n\
     *    - **responseType** - `{string}` - see {@link\n\
     *      https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#responseType requestType}.\n\
     *\n\
     * @returns {HttpPromise} Returns a {@link ng.$q promise} object with the\n\
     *   standard `then` method and two http specific methods: `success` and `error`. The `then`\n\
     *   method takes two arguments a success and an error callback which will be called with a\n\
     *   response object. The `success` and `error` methods take a single argument - a function that\n\
     *   will be called when the request succeeds or fails respectively. The arguments passed into\n\
     *   these functions are destructured representation of the response object passed into the\n\
     *   `then` method. The response object has these properties:\n\
     *\n\
     *   - **data** â€“ `{string|Object}` â€“ The response body transformed with the transform functions.\n\
     *   - **status** â€“ `{number}` â€“ HTTP status code of the response.\n\
     *   - **headers** â€“ `{function([headerName])}` â€“ Header getter function.\n\
     *   - **config** â€“ `{Object}` â€“ The configuration object that was used to generate the request.\n\
     *\n\
     * @property {Array.<Object>} pendingRequests Array of config objects for currently pending\n\
     *   requests. This is primarily meant to be used for debugging purposes.\n\
     *\n\
     *\n\
     * @example\n\
      <example>\n\
        <file name=\"index.html\">\n\
          <div ng-controller=\"FetchCtrl\">\n\
            <select ng-model=\"method\">\n\
              <option>GET</option>\n\
              <option>JSONP</option>\n\
            </select>\n\
            <input type=\"text\" ng-model=\"url\" size=\"80\"/>\n\
            <button ng-click=\"fetch()\">fetch</button><br>\n\
            <button ng-click=\"updateModel('GET', 'http-hello.html')\">Sample GET</button>\n\
            <button ng-click=\"updateModel('JSONP', 'http://angularjs.org/greet.php?callback=JSON_CALLBACK&name=Super%20Hero')\">Sample JSONP</button>\n\
            <button ng-click=\"updateModel('JSONP', 'http://angularjs.org/doesntexist&callback=JSON_CALLBACK')\">Invalid JSONP</button>\n\
            <pre>http status code: {{status}}</pre>\n\
            <pre>http response data: {{data}}</pre>\n\
          </div>\n\
        </file>\n\
        <file name=\"script.js\">\n\
          function FetchCtrl($scope, $http, $templateCache) {\n\
            $scope.method = 'GET';\n\
            $scope.url = 'http-hello.html';\n\
\n\
            $scope.fetch = function() {\n\
              $scope.code = null;\n\
              $scope.response = null;\n\
\n\
              $http({method: $scope.method, url: $scope.url, cache: $templateCache}).\n\
                success(function(data, status) {\n\
                  $scope.status = status;\n\
                  $scope.data = data;\n\
                }).\n\
                error(function(data, status) {\n\
                  $scope.data = data || \"Request failed\";\n\
                  $scope.status = status;\n\
              });\n\
            };\n\
\n\
            $scope.updateModel = function(method, url) {\n\
              $scope.method = method;\n\
              $scope.url = url;\n\
            };\n\
          }\n\
        </file>\n\
        <file name=\"http-hello.html\">\n\
          Hello, $http!\n\
        </file>\n\
        <file name=\"scenario.js\">\n\
          it('should make an xhr GET request', function() {\n\
            element(':button:contains(\"Sample GET\")').click();\n\
            element(':button:contains(\"fetch\")').click();\n\
            expect(binding('status')).toBe('200');\n\
            expect(binding('data')).toMatch(/Hello, \\$http!/);\n\
          });\n\
\n\
          it('should make a JSONP request to angularjs.org', function() {\n\
            element(':button:contains(\"Sample JSONP\")').click();\n\
            element(':button:contains(\"fetch\")').click();\n\
            expect(binding('status')).toBe('200');\n\
            expect(binding('data')).toMatch(/Super Hero!/);\n\
          });\n\
\n\
          it('should make JSONP request to invalid URL and invoke the error handler',\n\
              function() {\n\
            element(':button:contains(\"Invalid JSONP\")').click();\n\
            element(':button:contains(\"fetch\")').click();\n\
            expect(binding('status')).toBe('0');\n\
            expect(binding('data')).toBe('Request failed');\n\
          });\n\
        </file>\n\
      </example>\n\
     */\n\
    function $http(requestConfig) {\n\
      var config = {\n\
        transformRequest: defaults.transformRequest,\n\
        transformResponse: defaults.transformResponse\n\
      };\n\
      var headers = {};\n\
\n\
      extend(config, requestConfig);\n\
      config.headers = headers;\n\
      config.method = uppercase(config.method);\n\
\n\
      extend(headers,\n\
          defaults.headers.common,\n\
          defaults.headers[lowercase(config.method)],\n\
          requestConfig.headers);\n\
\n\
      var xsrfValue = isSameDomain(config.url, $browser.url())\n\
          ? $browser.cookies()[config.xsrfCookieName || defaults.xsrfCookieName]\n\
          : undefined;\n\
      if (xsrfValue) {\n\
        headers[(config.xsrfHeaderName || defaults.xsrfHeaderName)] = xsrfValue;\n\
      }\n\
\n\
\n\
      var serverRequest = function(config) {\n\
        var reqData = transformData(config.data, headersGetter(headers), config.transformRequest);\n\
\n\
        // strip content-type if data is undefined\n\
        if (isUndefined(config.data)) {\n\
          delete headers['Content-Type'];\n\
        }\n\
\n\
        if (isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials)) {\n\
          config.withCredentials = defaults.withCredentials;\n\
        }\n\
\n\
        // send request\n\
        return sendReq(config, reqData, headers).then(transformResponse, transformResponse);\n\
      };\n\
\n\
      var chain = [serverRequest, undefined];\n\
      var promise = $q.when(config);\n\
\n\
      // apply interceptors\n\
      forEach(reversedInterceptors, function(interceptor) {\n\
        if (interceptor.request || interceptor.requestError) {\n\
          chain.unshift(interceptor.request, interceptor.requestError);\n\
        }\n\
        if (interceptor.response || interceptor.responseError) {\n\
          chain.push(interceptor.response, interceptor.responseError);\n\
        }\n\
      });\n\
\n\
      while(chain.length) {\n\
        var thenFn = chain.shift();\n\
        var rejectFn = chain.shift();\n\
\n\
        promise = promise.then(thenFn, rejectFn);\n\
      }\n\
\n\
      promise.success = function(fn) {\n\
        promise.then(function(response) {\n\
          fn(response.data, response.status, response.headers, config);\n\
        });\n\
        return promise;\n\
      };\n\
\n\
      promise.error = function(fn) {\n\
        promise.then(null, function(response) {\n\
          fn(response.data, response.status, response.headers, config);\n\
        });\n\
        return promise;\n\
      };\n\
\n\
      return promise;\n\
\n\
      function transformResponse(response) {\n\
        // make a copy since the response must be cacheable\n\
        var resp = extend({}, response, {\n\
          data: transformData(response.data, response.headers, config.transformResponse)\n\
        });\n\
        return (isSuccess(response.status))\n\
          ? resp\n\
          : $q.reject(resp);\n\
      }\n\
    }\n\
\n\
    $http.pendingRequests = [];\n\
\n\
    /**\n\
     * @ngdoc method\n\
     * @name ng.$http#get\n\
     * @methodOf ng.$http\n\
     *\n\
     * @description\n\
     * Shortcut method to perform `GET` request.\n\
     *\n\
     * @param {string} url Relative or absolute URL specifying the destination of the request\n\
     * @param {Object=} config Optional configuration object\n\
     * @returns {HttpPromise} Future object\n\
     */\n\
\n\
    /**\n\
     * @ngdoc method\n\
     * @name ng.$http#delete\n\
     * @methodOf ng.$http\n\
     *\n\
     * @description\n\
     * Shortcut method to perform `DELETE` request.\n\
     *\n\
     * @param {string} url Relative or absolute URL specifying the destination of the request\n\
     * @param {Object=} config Optional configuration object\n\
     * @returns {HttpPromise} Future object\n\
     */\n\
\n\
    /**\n\
     * @ngdoc method\n\
     * @name ng.$http#head\n\
     * @methodOf ng.$http\n\
     *\n\
     * @description\n\
     * Shortcut method to perform `HEAD` request.\n\
     *\n\
     * @param {string} url Relative or absolute URL specifying the destination of the request\n\
     * @param {Object=} config Optional configuration object\n\
     * @returns {HttpPromise} Future object\n\
     */\n\
\n\
    /**\n\
     * @ngdoc method\n\
     * @name ng.$http#jsonp\n\
     * @methodOf ng.$http\n\
     *\n\
     * @description\n\
     * Shortcut method to perform `JSONP` request.\n\
     *\n\
     * @param {string} url Relative or absolute URL specifying the destination of the request.\n\
     *                     Should contain `JSON_CALLBACK` string.\n\
     * @param {Object=} config Optional configuration object\n\
     * @returns {HttpPromise} Future object\n\
     */\n\
    createShortMethods('get', 'delete', 'head', 'jsonp');\n\
\n\
    /**\n\
     * @ngdoc method\n\
     * @name ng.$http#post\n\
     * @methodOf ng.$http\n\
     *\n\
     * @description\n\
     * Shortcut method to perform `POST` request.\n\
     *\n\
     * @param {string} url Relative or absolute URL specifying the destination of the request\n\
     * @param {*} data Request content\n\
     * @param {Object=} config Optional configuration object\n\
     * @returns {HttpPromise} Future object\n\
     */\n\
\n\
    /**\n\
     * @ngdoc method\n\
     * @name ng.$http#put\n\
     * @methodOf ng.$http\n\
     *\n\
     * @description\n\
     * Shortcut method to perform `PUT` request.\n\
     *\n\
     * @param {string} url Relative or absolute URL specifying the destination of the request\n\
     * @param {*} data Request content\n\
     * @param {Object=} config Optional configuration object\n\
     * @returns {HttpPromise} Future object\n\
     */\n\
    createShortMethodsWithData('post', 'put');\n\
\n\
        /**\n\
         * @ngdoc property\n\
         * @name ng.$http#defaults\n\
         * @propertyOf ng.$http\n\
         *\n\
         * @description\n\
         * Runtime equivalent of the `$httpProvider.defaults` property. Allows configuration of\n\
         * default headers, withCredentials as well as request and response transformations.\n\
         *\n\
         * See \"Setting HTTP Headers\" and \"Transforming Requests and Responses\" sections above.\n\
         */\n\
    $http.defaults = defaults;\n\
\n\
\n\
    return $http;\n\
\n\
\n\
    function createShortMethods(names) {\n\
      forEach(arguments, function(name) {\n\
        $http[name] = function(url, config) {\n\
          return $http(extend(config || {}, {\n\
            method: name,\n\
            url: url\n\
          }));\n\
        };\n\
      });\n\
    }\n\
\n\
\n\
    function createShortMethodsWithData(name) {\n\
      forEach(arguments, function(name) {\n\
        $http[name] = function(url, data, config) {\n\
          return $http(extend(config || {}, {\n\
            method: name,\n\
            url: url,\n\
            data: data\n\
          }));\n\
        };\n\
      });\n\
    }\n\
\n\
\n\
    /**\n\
     * Makes the request.\n\
     *\n\
     * !!! ACCESSES CLOSURE VARS:\n\
     * $httpBackend, defaults, $log, $rootScope, defaultCache, $http.pendingRequests\n\
     */\n\
    function sendReq(config, reqData, reqHeaders) {\n\
      var deferred = $q.defer(),\n\
          promise = deferred.promise,\n\
          cache,\n\
          cachedResp,\n\
          url = buildUrl(config.url, config.params);\n\
\n\
      $http.pendingRequests.push(config);\n\
      promise.then(removePendingReq, removePendingReq);\n\
\n\
\n\
      if ((config.cache || defaults.cache) && config.cache !== false && config.method == 'GET') {\n\
        cache = isObject(config.cache) ? config.cache\n\
              : isObject(defaults.cache) ? defaults.cache\n\
              : defaultCache;\n\
      }\n\
\n\
      if (cache) {\n\
        cachedResp = cache.get(url);\n\
        if (cachedResp) {\n\
          if (cachedResp.then) {\n\
            // cached request has already been sent, but there is no response yet\n\
            cachedResp.then(removePendingReq, removePendingReq);\n\
            return cachedResp;\n\
          } else {\n\
            // serving from cache\n\
            if (isArray(cachedResp)) {\n\
              resolvePromise(cachedResp[1], cachedResp[0], copy(cachedResp[2]));\n\
            } else {\n\
              resolvePromise(cachedResp, 200, {});\n\
            }\n\
          }\n\
        } else {\n\
          // put the promise for the non-transformed response into cache as a placeholder\n\
          cache.put(url, promise);\n\
        }\n\
      }\n\
\n\
      // if we won't have the response in cache, send the request to the backend\n\
      if (!cachedResp) {\n\
        $httpBackend(config.method, url, reqData, done, reqHeaders, config.timeout,\n\
            config.withCredentials, config.responseType);\n\
      }\n\
\n\
      return promise;\n\
\n\
\n\
      /**\n\
       * Callback registered to $httpBackend():\n\
       *  - caches the response if desired\n\
       *  - resolves the raw $http promise\n\
       *  - calls $apply\n\
       */\n\
      function done(status, response, headersString) {\n\
        if (cache) {\n\
          if (isSuccess(status)) {\n\
            cache.put(url, [status, response, parseHeaders(headersString)]);\n\
          } else {\n\
            // remove promise from the cache\n\
            cache.remove(url);\n\
          }\n\
        }\n\
\n\
        resolvePromise(response, status, headersString);\n\
        if (!$rootScope.$$phase) $rootScope.$apply();\n\
      }\n\
\n\
\n\
      /**\n\
       * Resolves the raw $http promise.\n\
       */\n\
      function resolvePromise(response, status, headers) {\n\
        // normalize internal statuses to 0\n\
        status = Math.max(status, 0);\n\
\n\
        (isSuccess(status) ? deferred.resolve : deferred.reject)({\n\
          data: response,\n\
          status: status,\n\
          headers: headersGetter(headers),\n\
          config: config\n\
        });\n\
      }\n\
\n\
\n\
      function removePendingReq() {\n\
        var idx = indexOf($http.pendingRequests, config);\n\
        if (idx !== -1) $http.pendingRequests.splice(idx, 1);\n\
      }\n\
    }\n\
\n\
\n\
    function buildUrl(url, params) {\n\
          if (!params) return url;\n\
          var parts = [];\n\
          forEachSorted(params, function(value, key) {\n\
            if (value == null || value == undefined) return;\n\
            if (!isArray(value)) value = [value];\n\
\n\
            forEach(value, function(v) {\n\
              if (isObject(v)) {\n\
                v = toJson(v);\n\
              }\n\
              parts.push(encodeUriQuery(key) + '=' +\n\
                         encodeUriQuery(v));\n\
            });\n\
          });\n\
          return url + ((url.indexOf('?') == -1) ? '?' : '&') + parts.join('&');\n\
        }\n\
\n\
\n\
  }];\n\
}\n\
\n\
var XHR = window.XMLHttpRequest || function() {\n\
  try { return new ActiveXObject(\"Msxml2.XMLHTTP.6.0\"); } catch (e1) {}\n\
  try { return new ActiveXObject(\"Msxml2.XMLHTTP.3.0\"); } catch (e2) {}\n\
  try { return new ActiveXObject(\"Msxml2.XMLHTTP\"); } catch (e3) {}\n\
  throw new Error(\"This browser does not support XMLHttpRequest.\");\n\
};\n\
\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.$httpBackend\n\
 * @requires $browser\n\
 * @requires $window\n\
 * @requires $document\n\
 *\n\
 * @description\n\
 * HTTP backend used by the {@link ng.$http service} that delegates to\n\
 * XMLHttpRequest object or JSONP and deals with browser incompatibilities.\n\
 *\n\
 * You should never need to use this service directly, instead use the higher-level abstractions:\n\
 * {@link ng.$http $http} or {@link ngResource.$resource $resource}.\n\
 *\n\
 * During testing this implementation is swapped with {@link ngMock.$httpBackend mock\n\
 * $httpBackend} which can be trained with responses.\n\
 */\n\
function $HttpBackendProvider() {\n\
  this.$get = ['$browser', '$window', '$document', function($browser, $window, $document) {\n\
    return createHttpBackend($browser, XHR, $browser.defer, $window.angular.callbacks,\n\
        $document[0], $window.location.protocol.replace(':', ''));\n\
  }];\n\
}\n\
\n\
function createHttpBackend($browser, XHR, $browserDefer, callbacks, rawDocument, locationProtocol) {\n\
  // TODO(vojta): fix the signature\n\
  return function(method, url, post, callback, headers, timeout, withCredentials, responseType) {\n\
    var status;\n\
    $browser.$$incOutstandingRequestCount();\n\
    url = url || $browser.url();\n\
\n\
    if (lowercase(method) == 'jsonp') {\n\
      var callbackId = '_' + (callbacks.counter++).toString(36);\n\
      callbacks[callbackId] = function(data) {\n\
        callbacks[callbackId].data = data;\n\
      };\n\
\n\
      var jsonpDone = jsonpReq(url.replace('JSON_CALLBACK', 'angular.callbacks.' + callbackId),\n\
          function() {\n\
        if (callbacks[callbackId].data) {\n\
          completeRequest(callback, 200, callbacks[callbackId].data);\n\
        } else {\n\
          completeRequest(callback, status || -2);\n\
        }\n\
        delete callbacks[callbackId];\n\
      });\n\
    } else {\n\
      var xhr = new XHR();\n\
      xhr.open(method, url, true);\n\
      forEach(headers, function(value, key) {\n\
        if (value) xhr.setRequestHeader(key, value);\n\
      });\n\
\n\
      // In IE6 and 7, this might be called synchronously when xhr.send below is called and the\n\
      // response is in the cache. the promise api will ensure that to the app code the api is\n\
      // always async\n\
      xhr.onreadystatechange = function() {\n\
        if (xhr.readyState == 4) {\n\
          var responseHeaders = xhr.getAllResponseHeaders();\n\
\n\
          // TODO(vojta): remove once Firefox 21 gets released.\n\
          // begin: workaround to overcome Firefox CORS http response headers bug\n\
          // https://bugzilla.mozilla.org/show_bug.cgi?id=608735\n\
          // Firefox already patched in nightly. Should land in Firefox 21.\n\
\n\
          // CORS \"simple response headers\" http://www.w3.org/TR/cors/\n\
          var value,\n\
              simpleHeaders = [\"Cache-Control\", \"Content-Language\", \"Content-Type\",\n\
                                  \"Expires\", \"Last-Modified\", \"Pragma\"];\n\
          if (!responseHeaders) {\n\
            responseHeaders = \"\";\n\
            forEach(simpleHeaders, function (header) {\n\
              var value = xhr.getResponseHeader(header);\n\
              if (value) {\n\
                  responseHeaders += header + \": \" + value + \"\\n\
\";\n\
              }\n\
            });\n\
          }\n\
          // end of the workaround.\n\
\n\
          // responseText is the old-school way of retrieving response (supported by IE8 & 9)\n\
          // response and responseType properties were introduced in XHR Level2 spec (supported by IE10)\n\
          completeRequest(callback,\n\
              status || xhr.status,\n\
              (xhr.responseType ? xhr.response : xhr.responseText),\n\
              responseHeaders);\n\
        }\n\
      };\n\
\n\
      if (withCredentials) {\n\
        xhr.withCredentials = true;\n\
      }\n\
\n\
      if (responseType) {\n\
        xhr.responseType = responseType;\n\
      }\n\
\n\
      xhr.send(post || '');\n\
    }\n\
\n\
    if (timeout > 0) {\n\
      var timeoutId = $browserDefer(timeoutRequest, timeout);\n\
    } else if (timeout && timeout.then) {\n\
      timeout.then(timeoutRequest);\n\
    }\n\
\n\
\n\
    function timeoutRequest() {\n\
      status = -1;\n\
      jsonpDone && jsonpDone();\n\
      xhr && xhr.abort();\n\
    }\n\
\n\
    function completeRequest(callback, status, response, headersString) {\n\
      // URL_MATCH is defined in src/service/location.js\n\
      var protocol = (url.match(SERVER_MATCH) || ['', locationProtocol])[1];\n\
\n\
      // cancel timeout and subsequent timeout promise resolution\n\
      timeoutId && $browserDefer.cancel(timeoutId);\n\
      jsonpDone = xhr = null;\n\
\n\
      // fix status code for file protocol (it's always 0)\n\
      status = (protocol == 'file') ? (response ? 200 : 404) : status;\n\
\n\
      // normalize IE bug (http://bugs.jquery.com/ticket/1450)\n\
      status = status == 1223 ? 204 : status;\n\
\n\
      callback(status, response, headersString);\n\
      $browser.$$completeOutstandingRequest(noop);\n\
    }\n\
  };\n\
\n\
  function jsonpReq(url, done) {\n\
    // we can't use jQuery/jqLite here because jQuery does crazy shit with script elements, e.g.:\n\
    // - fetches local scripts via XHR and evals them\n\
    // - adds and immediately removes script elements from the document\n\
    var script = rawDocument.createElement('script'),\n\
        doneWrapper = function() {\n\
          rawDocument.body.removeChild(script);\n\
          if (done) done();\n\
        };\n\
\n\
    script.type = 'text/javascript';\n\
    script.src = url;\n\
\n\
    if (msie) {\n\
      script.onreadystatechange = function() {\n\
        if (/loaded|complete/.test(script.readyState)) doneWrapper();\n\
      };\n\
    } else {\n\
      script.onload = script.onerror = doneWrapper;\n\
    }\n\
\n\
    rawDocument.body.appendChild(script);\n\
    return doneWrapper;\n\
  }\n\
}\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.$locale\n\
 *\n\
 * @description\n\
 * $locale service provides localization rules for various Angular components. As of right now the\n\
 * only public api is:\n\
 *\n\
 * * `id` â€“ `{string}` â€“ locale id formatted as `languageId-countryId` (e.g. `en-us`)\n\
 */\n\
function $LocaleProvider(){\n\
  this.$get = function() {\n\
    return {\n\
      id: 'en-us',\n\
\n\
      NUMBER_FORMATS: {\n\
        DECIMAL_SEP: '.',\n\
        GROUP_SEP: ',',\n\
        PATTERNS: [\n\
          { // Decimal Pattern\n\
            minInt: 1,\n\
            minFrac: 0,\n\
            maxFrac: 3,\n\
            posPre: '',\n\
            posSuf: '',\n\
            negPre: '-',\n\
            negSuf: '',\n\
            gSize: 3,\n\
            lgSize: 3\n\
          },{ //Currency Pattern\n\
            minInt: 1,\n\
            minFrac: 2,\n\
            maxFrac: 2,\n\
            posPre: '\\u00A4',\n\
            posSuf: '',\n\
            negPre: '(\\u00A4',\n\
            negSuf: ')',\n\
            gSize: 3,\n\
            lgSize: 3\n\
          }\n\
        ],\n\
        CURRENCY_SYM: '$'\n\
      },\n\
\n\
      DATETIME_FORMATS: {\n\
        MONTH: 'January,February,March,April,May,June,July,August,September,October,November,December'\n\
                .split(','),\n\
        SHORTMONTH:  'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),\n\
        DAY: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),\n\
        SHORTDAY: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(','),\n\
        AMPMS: ['AM','PM'],\n\
        medium: 'MMM d, y h:mm:ss a',\n\
        short: 'M/d/yy h:mm a',\n\
        fullDate: 'EEEE, MMMM d, y',\n\
        longDate: 'MMMM d, y',\n\
        mediumDate: 'MMM d, y',\n\
        shortDate: 'M/d/yy',\n\
        mediumTime: 'h:mm:ss a',\n\
        shortTime: 'h:mm a'\n\
      },\n\
\n\
      pluralCat: function(num) {\n\
        if (num === 1) {\n\
          return 'one';\n\
        }\n\
        return 'other';\n\
      }\n\
    };\n\
  };\n\
}\n\
\n\
function $TimeoutProvider() {\n\
  this.$get = ['$rootScope', '$browser', '$q', '$exceptionHandler',\n\
       function($rootScope,   $browser,   $q,   $exceptionHandler) {\n\
    var deferreds = {};\n\
\n\
\n\
     /**\n\
      * @ngdoc function\n\
      * @name ng.$timeout\n\
      * @requires $browser\n\
      *\n\
      * @description\n\
      * Angular's wrapper for `window.setTimeout`. The `fn` function is wrapped into a try/catch\n\
      * block and delegates any exceptions to\n\
      * {@link ng.$exceptionHandler $exceptionHandler} service.\n\
      *\n\
      * The return value of registering a timeout function is a promise, which will be resolved when\n\
      * the timeout is reached and the timeout function is executed.\n\
      *\n\
      * To cancel a timeout request, call `$timeout.cancel(promise)`.\n\
      *\n\
      * In tests you can use {@link ngMock.$timeout `$timeout.flush()`} to\n\
      * synchronously flush the queue of deferred functions.\n\
      *\n\
      * @param {function()} fn A function, whose execution should be delayed.\n\
      * @param {number=} [delay=0] Delay in milliseconds.\n\
      * @param {boolean=} [invokeApply=true] If set to `false` skips model dirty checking, otherwise\n\
      *   will invoke `fn` within the {@link ng.$rootScope.Scope#$apply $apply} block.\n\
      * @returns {Promise} Promise that will be resolved when the timeout is reached. The value this\n\
      *   promise will be resolved with is the return value of the `fn` function.\n\
      */\n\
    function timeout(fn, delay, invokeApply) {\n\
      var deferred = $q.defer(),\n\
          promise = deferred.promise,\n\
          skipApply = (isDefined(invokeApply) && !invokeApply),\n\
          timeoutId, cleanup;\n\
\n\
      timeoutId = $browser.defer(function() {\n\
        try {\n\
          deferred.resolve(fn());\n\
        } catch(e) {\n\
          deferred.reject(e);\n\
          $exceptionHandler(e);\n\
        }\n\
\n\
        if (!skipApply) $rootScope.$apply();\n\
      }, delay);\n\
\n\
      cleanup = function() {\n\
        delete deferreds[promise.$$timeoutId];\n\
      };\n\
\n\
      promise.$$timeoutId = timeoutId;\n\
      deferreds[timeoutId] = deferred;\n\
      promise.then(cleanup, cleanup);\n\
\n\
      return promise;\n\
    }\n\
\n\
\n\
     /**\n\
      * @ngdoc function\n\
      * @name ng.$timeout#cancel\n\
      * @methodOf ng.$timeout\n\
      *\n\
      * @description\n\
      * Cancels a task associated with the `promise`. As a result of this, the promise will be\n\
      * resolved with a rejection.\n\
      *\n\
      * @param {Promise=} promise Promise returned by the `$timeout` function.\n\
      * @returns {boolean} Returns `true` if the task hasn't executed yet and was successfully\n\
      *   canceled.\n\
      */\n\
    timeout.cancel = function(promise) {\n\
      if (promise && promise.$$timeoutId in deferreds) {\n\
        deferreds[promise.$$timeoutId].reject('canceled');\n\
        return $browser.defer.cancel(promise.$$timeoutId);\n\
      }\n\
      return false;\n\
    };\n\
\n\
    return timeout;\n\
  }];\n\
}\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.$filterProvider\n\
 * @description\n\
 *\n\
 * Filters are just functions which transform input to an output. However filters need to be Dependency Injected. To\n\
 * achieve this a filter definition consists of a factory function which is annotated with dependencies and is\n\
 * responsible for creating a filter function.\n\
 *\n\
 * <pre>\n\
 *   // Filter registration\n\
 *   function MyModule($provide, $filterProvider) {\n\
 *     // create a service to demonstrate injection (not always needed)\n\
 *     $provide.value('greet', function(name){\n\
 *       return 'Hello ' + name + '!';\n\
 *     });\n\
 *\n\
 *     // register a filter factory which uses the\n\
 *     // greet service to demonstrate DI.\n\
 *     $filterProvider.register('greet', function(greet){\n\
 *       // return the filter function which uses the greet service\n\
 *       // to generate salutation\n\
 *       return function(text) {\n\
 *         // filters need to be forgiving so check input validity\n\
 *         return text && greet(text) || text;\n\
 *       };\n\
 *     });\n\
 *   }\n\
 * </pre>\n\
 *\n\
 * The filter function is registered with the `$injector` under the filter name suffixe with `Filter`.\n\
 * <pre>\n\
 *   it('should be the same instance', inject(\n\
 *     function($filterProvider) {\n\
 *       $filterProvider.register('reverse', function(){\n\
 *         return ...;\n\
 *       });\n\
 *     },\n\
 *     function($filter, reverseFilter) {\n\
 *       expect($filter('reverse')).toBe(reverseFilter);\n\
 *     });\n\
 * </pre>\n\
 *\n\
 *\n\
 * For more information about how angular filters work, and how to create your own filters, see\n\
 * {@link guide/dev_guide.templates.filters Understanding Angular Filters} in the angular Developer\n\
 * Guide.\n\
 */\n\
/**\n\
 * @ngdoc method\n\
 * @name ng.$filterProvider#register\n\
 * @methodOf ng.$filterProvider\n\
 * @description\n\
 * Register filter factory function.\n\
 *\n\
 * @param {String} name Name of the filter.\n\
 * @param {function} fn The filter factory function which is injectable.\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name ng.$filter\n\
 * @function\n\
 * @description\n\
 * Filters are used for formatting data displayed to the user.\n\
 *\n\
 * The general syntax in templates is as follows:\n\
 *\n\
 *         {{ expression [| filter_name[:parameter_value] ... ] }}\n\
 *\n\
 * @param {String} name Name of the filter function to retrieve\n\
 * @return {Function} the filter function\n\
 */\n\
$FilterProvider.$inject = ['$provide'];\n\
function $FilterProvider($provide) {\n\
  var suffix = 'Filter';\n\
\n\
  function register(name, factory) {\n\
    return $provide.factory(name + suffix, factory);\n\
  }\n\
  this.register = register;\n\
\n\
  this.$get = ['$injector', function($injector) {\n\
    return function(name) {\n\
      return $injector.get(name + suffix);\n\
    }\n\
  }];\n\
\n\
  ////////////////////////////////////////\n\
\n\
  register('currency', currencyFilter);\n\
  register('date', dateFilter);\n\
  register('filter', filterFilter);\n\
  register('json', jsonFilter);\n\
  register('limitTo', limitToFilter);\n\
  register('lowercase', lowercaseFilter);\n\
  register('number', numberFilter);\n\
  register('orderBy', orderByFilter);\n\
  register('uppercase', uppercaseFilter);\n\
}\n\
\n\
/**\n\
 * @ngdoc filter\n\
 * @name ng.filter:filter\n\
 * @function\n\
 *\n\
 * @description\n\
 * Selects a subset of items from `array` and returns it as a new array.\n\
 *\n\
 * Note: This function is used to augment the `Array` type in Angular expressions. See\n\
 * {@link ng.$filter} for more information about Angular arrays.\n\
 *\n\
 * @param {Array} array The source array.\n\
 * @param {string|Object|function()} expression The predicate to be used for selecting items from\n\
 *   `array`.\n\
 *\n\
 *   Can be one of:\n\
 *\n\
 *   - `string`: Predicate that results in a substring match using the value of `expression`\n\
 *     string. All strings or objects with string properties in `array` that contain this string\n\
 *     will be returned. The predicate can be negated by prefixing the string with `!`.\n\
 *\n\
 *   - `Object`: A pattern object can be used to filter specific properties on objects contained\n\
 *     by `array`. For example `{name:\"M\", phone:\"1\"}` predicate will return an array of items\n\
 *     which have property `name` containing \"M\" and property `phone` containing \"1\". A special\n\
 *     property name `$` can be used (as in `{$:\"text\"}`) to accept a match against any\n\
 *     property of the object. That's equivalent to the simple substring match with a `string`\n\
 *     as described above.\n\
 *\n\
 *   - `function`: A predicate function can be used to write arbitrary filters. The function is\n\
 *     called for each element of `array`. The final result is an array of those elements that\n\
 *     the predicate returned true for.\n\
 *\n\
 * @param {function(expected, actual)|true|undefined} comparator Comparator which is used in\n\
 *     determining if the expected value (from the filter expression) and actual value (from\n\
 *     the object in the array) should be considered a match.\n\
 *\n\
 *   Can be one of:\n\
 *\n\
 *     - `function(expected, actual)`:\n\
 *       The function will be given the object value and the predicate value to compare and\n\
 *       should return true if the item should be included in filtered result.\n\
 *\n\
 *     - `true`: A shorthand for `function(expected, actual) { return angular.equals(expected, actual)}`.\n\
 *       this is essentially strict comparison of expected and actual.\n\
 *\n\
 *     - `false|undefined`: A short hand for a function which will look for a substring match in case\n\
 *       insensitive way.\n\
 *\n\
 * @example\n\
   <doc:example>\n\
     <doc:source>\n\
       <div ng-init=\"friends = [{name:'John', phone:'555-1276'},\n\
                                {name:'Mary', phone:'800-BIG-MARY'},\n\
                                {name:'Mike', phone:'555-4321'},\n\
                                {name:'Adam', phone:'555-5678'},\n\
                                {name:'Julie', phone:'555-8765'},\n\
                                {name:'Juliette', phone:'555-5678'}]\"></div>\n\
\n\
       Search: <input ng-model=\"searchText\">\n\
       <table id=\"searchTextResults\">\n\
         <tr><th>Name</th><th>Phone</th></tr>\n\
         <tr ng-repeat=\"friend in friends | filter:searchText\">\n\
           <td>{{friend.name}}</td>\n\
           <td>{{friend.phone}}</td>\n\
         </tr>\n\
       </table>\n\
       <hr>\n\
       Any: <input ng-model=\"search.$\"> <br>\n\
       Name only <input ng-model=\"search.name\"><br>\n\
       Phone only <input ng-model=\"search.phone\"><br>\n\
       Equality <input type=\"checkbox\" ng-model=\"strict\"><br>\n\
       <table id=\"searchObjResults\">\n\
         <tr><th>Name</th><th>Phone</th></tr>\n\
         <tr ng-repeat=\"friend in friends | filter:search:strict\">\n\
           <td>{{friend.name}}</td>\n\
           <td>{{friend.phone}}</td>\n\
         </tr>\n\
       </table>\n\
     </doc:source>\n\
     <doc:scenario>\n\
       it('should search across all fields when filtering with a string', function() {\n\
         input('searchText').enter('m');\n\
         expect(repeater('#searchTextResults tr', 'friend in friends').column('friend.name')).\n\
           toEqual(['Mary', 'Mike', 'Adam']);\n\
\n\
         input('searchText').enter('76');\n\
         expect(repeater('#searchTextResults tr', 'friend in friends').column('friend.name')).\n\
           toEqual(['John', 'Julie']);\n\
       });\n\
\n\
       it('should search in specific fields when filtering with a predicate object', function() {\n\
         input('search.$').enter('i');\n\
         expect(repeater('#searchObjResults tr', 'friend in friends').column('friend.name')).\n\
           toEqual(['Mary', 'Mike', 'Julie', 'Juliette']);\n\
       });\n\
       it('should use a equal comparison when comparator is true', function() {\n\
         input('search.name').enter('Julie');\n\
         input('strict').check();\n\
         expect(repeater('#searchObjResults tr', 'friend in friends').column('friend.name')).\n\
           toEqual(['Julie']);\n\
       });\n\
     </doc:scenario>\n\
   </doc:example>\n\
 */\n\
function filterFilter() {\n\
  return function(array, expression, comperator) {\n\
    if (!isArray(array)) return array;\n\
    var predicates = [];\n\
    predicates.check = function(value) {\n\
      for (var j = 0; j < predicates.length; j++) {\n\
        if(!predicates[j](value)) {\n\
          return false;\n\
        }\n\
      }\n\
      return true;\n\
    };\n\
    switch(typeof comperator) {\n\
      case \"function\":\n\
        break;\n\
      case \"boolean\":\n\
        if(comperator == true) {\n\
          comperator = function(obj, text) {\n\
            return angular.equals(obj, text);\n\
          }\n\
          break;\n\
        }\n\
      default:\n\
        comperator = function(obj, text) {\n\
          text = (''+text).toLowerCase();\n\
          return (''+obj).toLowerCase().indexOf(text) > -1\n\
        };\n\
    }\n\
    var search = function(obj, text){\n\
      if (typeof text == 'string' && text.charAt(0) === '!') {\n\
        return !search(obj, text.substr(1));\n\
      }\n\
      switch (typeof obj) {\n\
        case \"boolean\":\n\
        case \"number\":\n\
        case \"string\":\n\
          return comperator(obj, text);\n\
        case \"object\":\n\
          switch (typeof text) {\n\
            case \"object\":\n\
              return comperator(obj, text);\n\
              break;\n\
            default:\n\
              for ( var objKey in obj) {\n\
                if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {\n\
                  return true;\n\
                }\n\
              }\n\
              break;\n\
          }\n\
          return false;\n\
        case \"array\":\n\
          for ( var i = 0; i < obj.length; i++) {\n\
            if (search(obj[i], text)) {\n\
              return true;\n\
            }\n\
          }\n\
          return false;\n\
        default:\n\
          return false;\n\
      }\n\
    };\n\
    switch (typeof expression) {\n\
      case \"boolean\":\n\
      case \"number\":\n\
      case \"string\":\n\
        expression = {$:expression};\n\
      case \"object\":\n\
        for (var key in expression) {\n\
          if (key == '$') {\n\
            (function() {\n\
              if (!expression[key]) return;\n\
              var path = key\n\
              predicates.push(function(value) {\n\
                return search(value, expression[path]);\n\
              });\n\
            })();\n\
          } else {\n\
            (function() {\n\
              if (!expression[key]) return;\n\
              var path = key;\n\
              predicates.push(function(value) {\n\
                return search(getter(value,path), expression[path]);\n\
              });\n\
            })();\n\
          }\n\
        }\n\
        break;\n\
      case 'function':\n\
        predicates.push(expression);\n\
        break;\n\
      default:\n\
        return array;\n\
    }\n\
    var filtered = [];\n\
    for ( var j = 0; j < array.length; j++) {\n\
      var value = array[j];\n\
      if (predicates.check(value)) {\n\
        filtered.push(value);\n\
      }\n\
    }\n\
    return filtered;\n\
  }\n\
}\n\
\n\
/**\n\
 * @ngdoc filter\n\
 * @name ng.filter:currency\n\
 * @function\n\
 *\n\
 * @description\n\
 * Formats a number as a currency (ie $1,234.56). When no currency symbol is provided, default\n\
 * symbol for current locale is used.\n\
 *\n\
 * @param {number} amount Input to filter.\n\
 * @param {string=} symbol Currency symbol or identifier to be displayed.\n\
 * @returns {string} Formatted number.\n\
 *\n\
 *\n\
 * @example\n\
   <doc:example>\n\
     <doc:source>\n\
       <script>\n\
         function Ctrl($scope) {\n\
           $scope.amount = 1234.56;\n\
         }\n\
       </script>\n\
       <div ng-controller=\"Ctrl\">\n\
         <input type=\"number\" ng-model=\"amount\"> <br>\n\
         default currency symbol ($): {{amount | currency}}<br>\n\
         custom currency identifier (USD$): {{amount | currency:\"USD$\"}}\n\
       </div>\n\
     </doc:source>\n\
     <doc:scenario>\n\
       it('should init with 1234.56', function() {\n\
         expect(binding('amount | currency')).toBe('$1,234.56');\n\
         expect(binding('amount | currency:\"USD$\"')).toBe('USD$1,234.56');\n\
       });\n\
       it('should update', function() {\n\
         input('amount').enter('-1234');\n\
         expect(binding('amount | currency')).toBe('($1,234.00)');\n\
         expect(binding('amount | currency:\"USD$\"')).toBe('(USD$1,234.00)');\n\
       });\n\
     </doc:scenario>\n\
   </doc:example>\n\
 */\n\
currencyFilter.$inject = ['$locale'];\n\
function currencyFilter($locale) {\n\
  var formats = $locale.NUMBER_FORMATS;\n\
  return function(amount, currencySymbol){\n\
    if (isUndefined(currencySymbol)) currencySymbol = formats.CURRENCY_SYM;\n\
    return formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, 2).\n\
                replace(/\\u00A4/g, currencySymbol);\n\
  };\n\
}\n\
\n\
/**\n\
 * @ngdoc filter\n\
 * @name ng.filter:number\n\
 * @function\n\
 *\n\
 * @description\n\
 * Formats a number as text.\n\
 *\n\
 * If the input is not a number an empty string is returned.\n\
 *\n\
 * @param {number|string} number Number to format.\n\
 * @param {(number|string)=} [fractionSize=2] Number of decimal places to round the number to.\n\
 * @returns {string} Number rounded to decimalPlaces and places a â€œ,â€ after each third digit.\n\
 *\n\
 * @example\n\
   <doc:example>\n\
     <doc:source>\n\
       <script>\n\
         function Ctrl($scope) {\n\
           $scope.val = 1234.56789;\n\
         }\n\
       </script>\n\
       <div ng-controller=\"Ctrl\">\n\
         Enter number: <input ng-model='val'><br>\n\
         Default formatting: {{val | number}}<br>\n\
         No fractions: {{val | number:0}}<br>\n\
         Negative number: {{-val | number:4}}\n\
       </div>\n\
     </doc:source>\n\
     <doc:scenario>\n\
       it('should format numbers', function() {\n\
         expect(binding('val | number')).toBe('1,234.568');\n\
         expect(binding('val | number:0')).toBe('1,235');\n\
         expect(binding('-val | number:4')).toBe('-1,234.5679');\n\
       });\n\
\n\
       it('should update', function() {\n\
         input('val').enter('3374.333');\n\
         expect(binding('val | number')).toBe('3,374.333');\n\
         expect(binding('val | number:0')).toBe('3,374');\n\
         expect(binding('-val | number:4')).toBe('-3,374.3330');\n\
       });\n\
     </doc:scenario>\n\
   </doc:example>\n\
 */\n\
\n\
\n\
numberFilter.$inject = ['$locale'];\n\
function numberFilter($locale) {\n\
  var formats = $locale.NUMBER_FORMATS;\n\
  return function(number, fractionSize) {\n\
    return formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP,\n\
      fractionSize);\n\
  };\n\
}\n\
\n\
var DECIMAL_SEP = '.';\n\
function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {\n\
  if (isNaN(number) || !isFinite(number)) return '';\n\
\n\
  var isNegative = number < 0;\n\
  number = Math.abs(number);\n\
  var numStr = number + '',\n\
      formatedText = '',\n\
      parts = [];\n\
\n\
  var hasExponent = false;\n\
  if (numStr.indexOf('e') !== -1) {\n\
    var match = numStr.match(/([\\d\\.]+)e(-?)(\\d+)/);\n\
    if (match && match[2] == '-' && match[3] > fractionSize + 1) {\n\
      numStr = '0';\n\
    } else {\n\
      formatedText = numStr;\n\
      hasExponent = true;\n\
    }\n\
  }\n\
\n\
  if (!hasExponent) {\n\
    var fractionLen = (numStr.split(DECIMAL_SEP)[1] || '').length;\n\
\n\
    // determine fractionSize if it is not specified\n\
    if (isUndefined(fractionSize)) {\n\
      fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac);\n\
    }\n\
\n\
    var pow = Math.pow(10, fractionSize);\n\
    number = Math.round(number * pow) / pow;\n\
    var fraction = ('' + number).split(DECIMAL_SEP);\n\
    var whole = fraction[0];\n\
    fraction = fraction[1] || '';\n\
\n\
    var pos = 0,\n\
        lgroup = pattern.lgSize,\n\
        group = pattern.gSize;\n\
\n\
    if (whole.length >= (lgroup + group)) {\n\
      pos = whole.length - lgroup;\n\
      for (var i = 0; i < pos; i++) {\n\
        if ((pos - i)%group === 0 && i !== 0) {\n\
          formatedText += groupSep;\n\
        }\n\
        formatedText += whole.charAt(i);\n\
      }\n\
    }\n\
\n\
    for (i = pos; i < whole.length; i++) {\n\
      if ((whole.length - i)%lgroup === 0 && i !== 0) {\n\
        formatedText += groupSep;\n\
      }\n\
      formatedText += whole.charAt(i);\n\
    }\n\
\n\
    // format fraction part.\n\
    while(fraction.length < fractionSize) {\n\
      fraction += '0';\n\
    }\n\
\n\
    if (fractionSize && fractionSize !== \"0\") formatedText += decimalSep + fraction.substr(0, fractionSize);\n\
  }\n\
\n\
  parts.push(isNegative ? pattern.negPre : pattern.posPre);\n\
  parts.push(formatedText);\n\
  parts.push(isNegative ? pattern.negSuf : pattern.posSuf);\n\
  return parts.join('');\n\
}\n\
\n\
function padNumber(num, digits, trim) {\n\
  var neg = '';\n\
  if (num < 0) {\n\
    neg =  '-';\n\
    num = -num;\n\
  }\n\
  num = '' + num;\n\
  while(num.length < digits) num = '0' + num;\n\
  if (trim)\n\
    num = num.substr(num.length - digits);\n\
  return neg + num;\n\
}\n\
\n\
\n\
function dateGetter(name, size, offset, trim) {\n\
  offset = offset || 0;\n\
  return function(date) {\n\
    var value = date['get' + name]();\n\
    if (offset > 0 || value > -offset)\n\
      value += offset;\n\
    if (value === 0 && offset == -12 ) value = 12;\n\
    return padNumber(value, size, trim);\n\
  };\n\
}\n\
\n\
function dateStrGetter(name, shortForm) {\n\
  return function(date, formats) {\n\
    var value = date['get' + name]();\n\
    var get = uppercase(shortForm ? ('SHORT' + name) : name);\n\
\n\
    return formats[get][value];\n\
  };\n\
}\n\
\n\
function timeZoneGetter(date) {\n\
  var zone = -1 * date.getTimezoneOffset();\n\
  var paddedZone = (zone >= 0) ? \"+\" : \"\";\n\
\n\
  paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) +\n\
                padNumber(Math.abs(zone % 60), 2);\n\
\n\
  return paddedZone;\n\
}\n\
\n\
function ampmGetter(date, formats) {\n\
  return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];\n\
}\n\
\n\
var DATE_FORMATS = {\n\
  yyyy: dateGetter('FullYear', 4),\n\
    yy: dateGetter('FullYear', 2, 0, true),\n\
     y: dateGetter('FullYear', 1),\n\
  MMMM: dateStrGetter('Month'),\n\
   MMM: dateStrGetter('Month', true),\n\
    MM: dateGetter('Month', 2, 1),\n\
     M: dateGetter('Month', 1, 1),\n\
    dd: dateGetter('Date', 2),\n\
     d: dateGetter('Date', 1),\n\
    HH: dateGetter('Hours', 2),\n\
     H: dateGetter('Hours', 1),\n\
    hh: dateGetter('Hours', 2, -12),\n\
     h: dateGetter('Hours', 1, -12),\n\
    mm: dateGetter('Minutes', 2),\n\
     m: dateGetter('Minutes', 1),\n\
    ss: dateGetter('Seconds', 2),\n\
     s: dateGetter('Seconds', 1),\n\
     // while ISO 8601 requires fractions to be prefixed with `.` or `,` \n\
     // we can be just safely rely on using `sss` since we currently don't support single or two digit fractions\n\
   sss: dateGetter('Milliseconds', 3),\n\
  EEEE: dateStrGetter('Day'),\n\
   EEE: dateStrGetter('Day', true),\n\
     a: ampmGetter,\n\
     Z: timeZoneGetter\n\
};\n\
\n\
var DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,\n\
    NUMBER_STRING = /^\\d+$/;\n\
\n\
/**\n\
 * @ngdoc filter\n\
 * @name ng.filter:date\n\
 * @function\n\
 *\n\
 * @description\n\
 *   Formats `date` to a string based on the requested `format`.\n\
 *\n\
 *   `format` string can be composed of the following elements:\n\
 *\n\
 *   * `'yyyy'`: 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)\n\
 *   * `'yy'`: 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)\n\
 *   * `'y'`: 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)\n\
 *   * `'MMMM'`: Month in year (January-December)\n\
 *   * `'MMM'`: Month in year (Jan-Dec)\n\
 *   * `'MM'`: Month in year, padded (01-12)\n\
 *   * `'M'`: Month in year (1-12)\n\
 *   * `'dd'`: Day in month, padded (01-31)\n\
 *   * `'d'`: Day in month (1-31)\n\
 *   * `'EEEE'`: Day in Week,(Sunday-Saturday)\n\
 *   * `'EEE'`: Day in Week, (Sun-Sat)\n\
 *   * `'HH'`: Hour in day, padded (00-23)\n\
 *   * `'H'`: Hour in day (0-23)\n\
 *   * `'hh'`: Hour in am/pm, padded (01-12)\n\
 *   * `'h'`: Hour in am/pm, (1-12)\n\
 *   * `'mm'`: Minute in hour, padded (00-59)\n\
 *   * `'m'`: Minute in hour (0-59)\n\
 *   * `'ss'`: Second in minute, padded (00-59)\n\
 *   * `'s'`: Second in minute (0-59)\n\
 *   * `'.sss' or ',sss'`: Millisecond in second, padded (000-999)\n\
 *   * `'a'`: am/pm marker\n\
 *   * `'Z'`: 4 digit (+sign) representation of the timezone offset (-1200-+1200)\n\
 *\n\
 *   `format` string can also be one of the following predefined\n\
 *   {@link guide/i18n localizable formats}:\n\
 *\n\
 *   * `'medium'`: equivalent to `'MMM d, y h:mm:ss a'` for en_US locale\n\
 *     (e.g. Sep 3, 2010 12:05:08 pm)\n\
 *   * `'short'`: equivalent to `'M/d/yy h:mm a'` for en_US  locale (e.g. 9/3/10 12:05 pm)\n\
 *   * `'fullDate'`: equivalent to `'EEEE, MMMM d,y'` for en_US  locale\n\
 *     (e.g. Friday, September 3, 2010)\n\
 *   * `'longDate'`: equivalent to `'MMMM d, y'` for en_US  locale (e.g. September 3, 2010\n\
 *   * `'mediumDate'`: equivalent to `'MMM d, y'` for en_US  locale (e.g. Sep 3, 2010)\n\
 *   * `'shortDate'`: equivalent to `'M/d/yy'` for en_US locale (e.g. 9/3/10)\n\
 *   * `'mediumTime'`: equivalent to `'h:mm:ss a'` for en_US locale (e.g. 12:05:08 pm)\n\
 *   * `'shortTime'`: equivalent to `'h:mm a'` for en_US locale (e.g. 12:05 pm)\n\
 *\n\
 *   `format` string can contain literal values. These need to be quoted with single quotes (e.g.\n\
 *   `\"h 'in the morning'\"`). In order to output single quote, use two single quotes in a sequence\n\
 *   (e.g. `\"h o''clock\"`).\n\
 *\n\
 * @param {(Date|number|string)} date Date to format either as Date object, milliseconds (string or\n\
 *    number) or various ISO 8601 datetime string formats (e.g. yyyy-MM-ddTHH:mm:ss.SSSZ and its\n\
 *    shorter versions like yyyy-MM-ddTHH:mmZ, yyyy-MM-dd or yyyyMMddTHHmmssZ). If no timezone is\n\
 *    specified in the string input, the time is considered to be in the local timezone.\n\
 * @param {string=} format Formatting rules (see Description). If not specified,\n\
 *    `mediumDate` is used.\n\
 * @returns {string} Formatted string or the input if input is not recognized as date/millis.\n\
 *\n\
 * @example\n\
   <doc:example>\n\
     <doc:source>\n\
       <span ng-non-bindable>{{1288323623006 | date:'medium'}}</span>:\n\
           {{1288323623006 | date:'medium'}}<br>\n\
       <span ng-non-bindable>{{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}</span>:\n\
          {{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}<br>\n\
       <span ng-non-bindable>{{1288323623006 | date:'MM/dd/yyyy @ h:mma'}}</span>:\n\
          {{'1288323623006' | date:'MM/dd/yyyy @ h:mma'}}<br>\n\
     </doc:source>\n\
     <doc:scenario>\n\
       it('should format date', function() {\n\
         expect(binding(\"1288323623006 | date:'medium'\")).\n\
            toMatch(/Oct 2\\d, 2010 \\d{1,2}:\\d{2}:\\d{2} (AM|PM)/);\n\
         expect(binding(\"1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'\")).\n\
            toMatch(/2010\\-10\\-2\\d \\d{2}:\\d{2}:\\d{2} (\\-|\\+)?\\d{4}/);\n\
         expect(binding(\"'1288323623006' | date:'MM/dd/yyyy @ h:mma'\")).\n\
            toMatch(/10\\/2\\d\\/2010 @ \\d{1,2}:\\d{2}(AM|PM)/);\n\
       });\n\
     </doc:scenario>\n\
   </doc:example>\n\
 */\n\
dateFilter.$inject = ['$locale'];\n\
function dateFilter($locale) {\n\
\n\
\n\
  var R_ISO8601_STR = /^(\\d{4})-?(\\d\\d)-?(\\d\\d)(?:T(\\d\\d)(?::?(\\d\\d)(?::?(\\d\\d)(?:\\.(\\d+))?)?)?(Z|([+-])(\\d\\d):?(\\d\\d))?)?$/;\n\
                     // 1        2       3         4          5          6          7          8  9     10      11\n\
  function jsonStringToDate(string) {\n\
    var match;\n\
    if (match = string.match(R_ISO8601_STR)) {\n\
      var date = new Date(0),\n\
          tzHour = 0,\n\
          tzMin  = 0,\n\
          dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,\n\
          timeSetter = match[8] ? date.setUTCHours : date.setHours;\n\
\n\
      if (match[9]) {\n\
        tzHour = int(match[9] + match[10]);\n\
        tzMin = int(match[9] + match[11]);\n\
      }\n\
      dateSetter.call(date, int(match[1]), int(match[2]) - 1, int(match[3]));\n\
      var h = int(match[4]||0) - tzHour;\n\
      var m = int(match[5]||0) - tzMin\n\
      var s = int(match[6]||0);\n\
      var ms = Math.round(parseFloat('0.' + (match[7]||0)) * 1000);\n\
      timeSetter.call(date, h, m, s, ms);\n\
      return date;\n\
    }\n\
    return string;\n\
  }\n\
\n\
\n\
  return function(date, format) {\n\
    var text = '',\n\
        parts = [],\n\
        fn, match;\n\
\n\
    format = format || 'mediumDate';\n\
    format = $locale.DATETIME_FORMATS[format] || format;\n\
    if (isString(date)) {\n\
      if (NUMBER_STRING.test(date)) {\n\
        date = int(date);\n\
      } else {\n\
        date = jsonStringToDate(date);\n\
      }\n\
    }\n\
\n\
    if (isNumber(date)) {\n\
      date = new Date(date);\n\
    }\n\
\n\
    if (!isDate(date)) {\n\
      return date;\n\
    }\n\
\n\
    while(format) {\n\
      match = DATE_FORMATS_SPLIT.exec(format);\n\
      if (match) {\n\
        parts = concat(parts, match, 1);\n\
        format = parts.pop();\n\
      } else {\n\
        parts.push(format);\n\
        format = null;\n\
      }\n\
    }\n\
\n\
    forEach(parts, function(value){\n\
      fn = DATE_FORMATS[value];\n\
      text += fn ? fn(date, $locale.DATETIME_FORMATS)\n\
                 : value.replace(/(^'|'$)/g, '').replace(/''/g, \"'\");\n\
    });\n\
\n\
    return text;\n\
  };\n\
}\n\
\n\
\n\
/**\n\
 * @ngdoc filter\n\
 * @name ng.filter:json\n\
 * @function\n\
 *\n\
 * @description\n\
 *   Allows you to convert a JavaScript object into JSON string.\n\
 *\n\
 *   This filter is mostly useful for debugging. When using the double curly {{value}} notation\n\
 *   the binding is automatically converted to JSON.\n\
 *\n\
 * @param {*} object Any JavaScript object (including arrays and primitive types) to filter.\n\
 * @returns {string} JSON string.\n\
 *\n\
 *\n\
 * @example:\n\
   <doc:example>\n\
     <doc:source>\n\
       <pre>{{ {'name':'value'} | json }}</pre>\n\
     </doc:source>\n\
     <doc:scenario>\n\
       it('should jsonify filtered objects', function() {\n\
         expect(binding(\"{'name':'value'}\")).toMatch(/\\{\\n\
  \"name\": ?\"value\"\\n\
}/);\n\
       });\n\
     </doc:scenario>\n\
   </doc:example>\n\
 *\n\
 */\n\
function jsonFilter() {\n\
  return function(object) {\n\
    return toJson(object, true);\n\
  };\n\
}\n\
\n\
\n\
/**\n\
 * @ngdoc filter\n\
 * @name ng.filter:lowercase\n\
 * @function\n\
 * @description\n\
 * Converts string to lowercase.\n\
 * @see angular.lowercase\n\
 */\n\
var lowercaseFilter = valueFn(lowercase);\n\
\n\
\n\
/**\n\
 * @ngdoc filter\n\
 * @name ng.filter:uppercase\n\
 * @function\n\
 * @description\n\
 * Converts string to uppercase.\n\
 * @see angular.uppercase\n\
 */\n\
var uppercaseFilter = valueFn(uppercase);\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name ng.filter:limitTo\n\
 * @function\n\
 *\n\
 * @description\n\
 * Creates a new array or string containing only a specified number of elements. The elements\n\
 * are taken from either the beginning or the end of the source array or string, as specified by\n\
 * the value and sign (positive or negative) of `limit`.\n\
 *\n\
 * Note: This function is used to augment the `Array` type in Angular expressions. See\n\
 * {@link ng.$filter} for more information about Angular arrays.\n\
 *\n\
 * @param {Array|string} input Source array or string to be limited.\n\
 * @param {string|number} limit The length of the returned array or string. If the `limit` number \n\
 *     is positive, `limit` number of items from the beginning of the source array/string are copied.\n\
 *     If the number is negative, `limit` number  of items from the end of the source array/string \n\
 *     are copied. The `limit` will be trimmed if it exceeds `array.length`\n\
 * @returns {Array|string} A new sub-array or substring of length `limit` or less if input array\n\
 *     had less than `limit` elements.\n\
 *\n\
 * @example\n\
   <doc:example>\n\
     <doc:source>\n\
       <script>\n\
         function Ctrl($scope) {\n\
           $scope.numbers = [1,2,3,4,5,6,7,8,9];\n\
           $scope.letters = \"abcdefghi\";\n\
           $scope.numLimit = 3;\n\
           $scope.letterLimit = 3;\n\
         }\n\
       </script>\n\
       <div ng-controller=\"Ctrl\">\n\
         Limit {{numbers}} to: <input type=\"integer\" ng-model=\"numLimit\">\n\
         <p>Output numbers: {{ numbers | limitTo:numLimit }}</p>\n\
         Limit {{letters}} to: <input type=\"integer\" ng-model=\"letterLimit\">\n\
         <p>Output letters: {{ letters | limitTo:letterLimit }}</p>\n\
       </div>\n\
     </doc:source>\n\
     <doc:scenario>\n\
       it('should limit the number array to first three items', function() {\n\
         expect(element('.doc-example-live input[ng-model=numLimit]').val()).toBe('3');\n\
         expect(element('.doc-example-live input[ng-model=letterLimit]').val()).toBe('3');\n\
         expect(binding('numbers | limitTo:numLimit')).toEqual('[1,2,3]');\n\
         expect(binding('letters | limitTo:letterLimit')).toEqual('abc');\n\
       });\n\
\n\
       it('should update the output when -3 is entered', function() {\n\
         input('numLimit').enter(-3);\n\
         input('letterLimit').enter(-3);\n\
         expect(binding('numbers | limitTo:numLimit')).toEqual('[7,8,9]');\n\
         expect(binding('letters | limitTo:letterLimit')).toEqual('ghi');\n\
       });\n\
\n\
       it('should not exceed the maximum size of input array', function() {\n\
         input('numLimit').enter(100);\n\
         input('letterLimit').enter(100);\n\
         expect(binding('numbers | limitTo:numLimit')).toEqual('[1,2,3,4,5,6,7,8,9]');\n\
         expect(binding('letters | limitTo:letterLimit')).toEqual('abcdefghi');\n\
       });\n\
     </doc:scenario>\n\
   </doc:example>\n\
 */\n\
function limitToFilter(){\n\
  return function(input, limit) {\n\
    if (!isArray(input) && !isString(input)) return input;\n\
    \n\
    limit = int(limit);\n\
\n\
    if (isString(input)) {\n\
      //NaN check on limit\n\
      if (limit) {\n\
        return limit >= 0 ? input.slice(0, limit) : input.slice(limit, input.length);\n\
      } else {\n\
        return \"\";\n\
      }\n\
    }\n\
\n\
    var out = [],\n\
      i, n;\n\
\n\
    // if abs(limit) exceeds maximum length, trim it\n\
    if (limit > input.length)\n\
      limit = input.length;\n\
    else if (limit < -input.length)\n\
      limit = -input.length;\n\
\n\
    if (limit > 0) {\n\
      i = 0;\n\
      n = limit;\n\
    } else {\n\
      i = input.length + limit;\n\
      n = input.length;\n\
    }\n\
\n\
    for (; i<n; i++) {\n\
      out.push(input[i]);\n\
    }\n\
\n\
    return out;\n\
  }\n\
}\n\
\n\
/**\n\
 * @ngdoc function\n\
 * @name ng.filter:orderBy\n\
 * @function\n\
 *\n\
 * @description\n\
 * Orders a specified `array` by the `expression` predicate.\n\
 *\n\
 * Note: this function is used to augment the `Array` type in Angular expressions. See\n\
 * {@link ng.$filter} for more information about Angular arrays.\n\
 *\n\
 * @param {Array} array The array to sort.\n\
 * @param {function(*)|string|Array.<(function(*)|string)>} expression A predicate to be\n\
 *    used by the comparator to determine the order of elements.\n\
 *\n\
 *    Can be one of:\n\
 *\n\
 *    - `function`: Getter function. The result of this function will be sorted using the\n\
 *      `<`, `=`, `>` operator.\n\
 *    - `string`: An Angular expression which evaluates to an object to order by, such as 'name'\n\
 *      to sort by a property called 'name'. Optionally prefixed with `+` or `-` to control\n\
 *      ascending or descending sort order (for example, +name or -name).\n\
 *    - `Array`: An array of function or string predicates. The first predicate in the array\n\
 *      is used for sorting, but when two items are equivalent, the next predicate is used.\n\
 *\n\
 * @param {boolean=} reverse Reverse the order the array.\n\
 * @returns {Array} Sorted copy of the source array.\n\
 *\n\
 * @example\n\
   <doc:example>\n\
     <doc:source>\n\
       <script>\n\
         function Ctrl($scope) {\n\
           $scope.friends =\n\
               [{name:'John', phone:'555-1212', age:10},\n\
                {name:'Mary', phone:'555-9876', age:19},\n\
                {name:'Mike', phone:'555-4321', age:21},\n\
                {name:'Adam', phone:'555-5678', age:35},\n\
                {name:'Julie', phone:'555-8765', age:29}]\n\
           $scope.predicate = '-age';\n\
         }\n\
       </script>\n\
       <div ng-controller=\"Ctrl\">\n\
         <pre>Sorting predicate = {{predicate}}; reverse = {{reverse}}</pre>\n\
         <hr/>\n\
         [ <a href=\"\" ng-click=\"predicate=''\">unsorted</a> ]\n\
         <table class=\"friend\">\n\
           <tr>\n\
             <th><a href=\"\" ng-click=\"predicate = 'name'; reverse=false\">Name</a>\n\
                 (<a href ng-click=\"predicate = '-name'; reverse=false\">^</a>)</th>\n\
             <th><a href=\"\" ng-click=\"predicate = 'phone'; reverse=!reverse\">Phone Number</a></th>\n\
             <th><a href=\"\" ng-click=\"predicate = 'age'; reverse=!reverse\">Age</a></th>\n\
           </tr>\n\
           <tr ng-repeat=\"friend in friends | orderBy:predicate:reverse\">\n\
             <td>{{friend.name}}</td>\n\
             <td>{{friend.phone}}</td>\n\
             <td>{{friend.age}}</td>\n\
           </tr>\n\
         </table>\n\
       </div>\n\
     </doc:source>\n\
     <doc:scenario>\n\
       it('should be reverse ordered by aged', function() {\n\
         expect(binding('predicate')).toBe('-age');\n\
         expect(repeater('table.friend', 'friend in friends').column('friend.age')).\n\
           toEqual(['35', '29', '21', '19', '10']);\n\
         expect(repeater('table.friend', 'friend in friends').column('friend.name')).\n\
           toEqual(['Adam', 'Julie', 'Mike', 'Mary', 'John']);\n\
       });\n\
\n\
       it('should reorder the table when user selects different predicate', function() {\n\
         element('.doc-example-live a:contains(\"Name\")').click();\n\
         expect(repeater('table.friend', 'friend in friends').column('friend.name')).\n\
           toEqual(['Adam', 'John', 'Julie', 'Mary', 'Mike']);\n\
         expect(repeater('table.friend', 'friend in friends').column('friend.age')).\n\
           toEqual(['35', '10', '29', '19', '21']);\n\
\n\
         element('.doc-example-live a:contains(\"Phone\")').click();\n\
         expect(repeater('table.friend', 'friend in friends').column('friend.phone')).\n\
           toEqual(['555-9876', '555-8765', '555-5678', '555-4321', '555-1212']);\n\
         expect(repeater('table.friend', 'friend in friends').column('friend.name')).\n\
           toEqual(['Mary', 'Julie', 'Adam', 'Mike', 'John']);\n\
       });\n\
     </doc:scenario>\n\
   </doc:example>\n\
 */\n\
orderByFilter.$inject = ['$parse'];\n\
function orderByFilter($parse){\n\
  return function(array, sortPredicate, reverseOrder) {\n\
    if (!isArray(array)) return array;\n\
    if (!sortPredicate) return array;\n\
    sortPredicate = isArray(sortPredicate) ? sortPredicate: [sortPredicate];\n\
    sortPredicate = map(sortPredicate, function(predicate){\n\
      var descending = false, get = predicate || identity;\n\
      if (isString(predicate)) {\n\
        if ((predicate.charAt(0) == '+' || predicate.charAt(0) == '-')) {\n\
          descending = predicate.charAt(0) == '-';\n\
          predicate = predicate.substring(1);\n\
        }\n\
        get = $parse(predicate);\n\
      }\n\
      return reverseComparator(function(a,b){\n\
        return compare(get(a),get(b));\n\
      }, descending);\n\
    });\n\
    var arrayCopy = [];\n\
    for ( var i = 0; i < array.length; i++) { arrayCopy.push(array[i]); }\n\
    return arrayCopy.sort(reverseComparator(comparator, reverseOrder));\n\
\n\
    function comparator(o1, o2){\n\
      for ( var i = 0; i < sortPredicate.length; i++) {\n\
        var comp = sortPredicate[i](o1, o2);\n\
        if (comp !== 0) return comp;\n\
      }\n\
      return 0;\n\
    }\n\
    function reverseComparator(comp, descending) {\n\
      return toBoolean(descending)\n\
          ? function(a,b){return comp(b,a);}\n\
          : comp;\n\
    }\n\
    function compare(v1, v2){\n\
      var t1 = typeof v1;\n\
      var t2 = typeof v2;\n\
      if (t1 == t2) {\n\
        if (t1 == \"string\") v1 = v1.toLowerCase();\n\
        if (t1 == \"string\") v2 = v2.toLowerCase();\n\
        if (v1 === v2) return 0;\n\
        return v1 < v2 ? -1 : 1;\n\
      } else {\n\
        return t1 < t2 ? -1 : 1;\n\
      }\n\
    }\n\
  }\n\
}\n\
\n\
function ngDirective(directive) {\n\
  if (isFunction(directive)) {\n\
    directive = {\n\
      link: directive\n\
    }\n\
  }\n\
  directive.restrict = directive.restrict || 'AC';\n\
  return valueFn(directive);\n\
}\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:a\n\
 * @restrict E\n\
 *\n\
 * @description\n\
 * Modifies the default behavior of html A tag, so that the default action is prevented when href\n\
 * attribute is empty.\n\
 *\n\
 * The reasoning for this change is to allow easy creation of action links with `ngClick` directive\n\
 * without changing the location or causing page reloads, e.g.:\n\
 * `<a href=\"\" ng-click=\"model.$save()\">Save</a>`\n\
 */\n\
var htmlAnchorDirective = valueFn({\n\
  restrict: 'E',\n\
  compile: function(element, attr) {\n\
\n\
    if (msie <= 8) {\n\
\n\
      // turn <a href ng-click=\"..\">link</a> into a stylable link in IE\n\
      // but only if it doesn't have name attribute, in which case it's an anchor\n\
      if (!attr.href && !attr.name) {\n\
        attr.$set('href', '');\n\
      }\n\
\n\
      // add a comment node to anchors to workaround IE bug that causes element content to be reset\n\
      // to new attribute content if attribute is updated with value containing @ and element also\n\
      // contains value with @\n\
      // see issue #1949\n\
      element.append(document.createComment('IE fix'));\n\
    }\n\
\n\
    return function(scope, element) {\n\
      element.bind('click', function(event){\n\
        // if we have no href url, then don't navigate anywhere.\n\
        if (!element.attr('href')) {\n\
          event.preventDefault();\n\
        }\n\
      });\n\
    }\n\
  }\n\
});\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngHref\n\
 * @restrict A\n\
 *\n\
 * @description\n\
 * Using Angular markup like {{hash}} in an href attribute makes\n\
 * the page open to a wrong URL, if the user clicks that link before\n\
 * angular has a chance to replace the {{hash}} with actual URL, the\n\
 * link will be broken and will most likely return a 404 error.\n\
 * The `ngHref` directive solves this problem.\n\
 *\n\
 * The buggy way to write it:\n\
 * <pre>\n\
 * <a href=\"http://www.gravatar.com/avatar/{{hash}}\"/>\n\
 * </pre>\n\
 *\n\
 * The correct way to write it:\n\
 * <pre>\n\
 * <a ng-href=\"http://www.gravatar.com/avatar/{{hash}}\"/>\n\
 * </pre>\n\
 *\n\
 * @element A\n\
 * @param {template} ngHref any string which can contain `{{}}` markup.\n\
 *\n\
 * @example\n\
 * This example uses `link` variable inside `href` attribute:\n\
    <doc:example>\n\
      <doc:source>\n\
        <input ng-model=\"value\" /><br />\n\
        <a id=\"link-1\" href ng-click=\"value = 1\">link 1</a> (link, don't reload)<br />\n\
        <a id=\"link-2\" href=\"\" ng-click=\"value = 2\">link 2</a> (link, don't reload)<br />\n\
        <a id=\"link-3\" ng-href=\"/{{'123'}}\">link 3</a> (link, reload!)<br />\n\
        <a id=\"link-4\" href=\"\" name=\"xx\" ng-click=\"value = 4\">anchor</a> (link, don't reload)<br />\n\
        <a id=\"link-5\" name=\"xxx\" ng-click=\"value = 5\">anchor</a> (no link)<br />\n\
        <a id=\"link-6\" ng-href=\"{{value}}\">link</a> (link, change location)\n\
      </doc:source>\n\
      <doc:scenario>\n\
        it('should execute ng-click but not reload when href without value', function() {\n\
          element('#link-1').click();\n\
          expect(input('value').val()).toEqual('1');\n\
          expect(element('#link-1').attr('href')).toBe(\"\");\n\
        });\n\
\n\
        it('should execute ng-click but not reload when href empty string', function() {\n\
          element('#link-2').click();\n\
          expect(input('value').val()).toEqual('2');\n\
          expect(element('#link-2').attr('href')).toBe(\"\");\n\
        });\n\
\n\
        it('should execute ng-click and change url when ng-href specified', function() {\n\
          expect(element('#link-3').attr('href')).toBe(\"/123\");\n\
\n\
          element('#link-3').click();\n\
          expect(browser().window().path()).toEqual('/123');\n\
        });\n\
\n\
        it('should execute ng-click but not reload when href empty string and name specified', function() {\n\
          element('#link-4').click();\n\
          expect(input('value').val()).toEqual('4');\n\
          expect(element('#link-4').attr('href')).toBe('');\n\
        });\n\
\n\
        it('should execute ng-click but not reload when no href but name specified', function() {\n\
          element('#link-5').click();\n\
          expect(input('value').val()).toEqual('5');\n\
          expect(element('#link-5').attr('href')).toBe(undefined);\n\
        });\n\
\n\
        it('should only change url when only ng-href', function() {\n\
          input('value').enter('6');\n\
          expect(element('#link-6').attr('href')).toBe('6');\n\
\n\
          element('#link-6').click();\n\
          expect(browser().location().url()).toEqual('/6');\n\
        });\n\
      </doc:scenario>\n\
    </doc:example>\n\
 */\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngSrc\n\
 * @restrict A\n\
 *\n\
 * @description\n\
 * Using Angular markup like `{{hash}}` in a `src` attribute doesn't\n\
 * work right: The browser will fetch from the URL with the literal\n\
 * text `{{hash}}` until Angular replaces the expression inside\n\
 * `{{hash}}`. The `ngSrc` directive solves this problem.\n\
 *\n\
 * The buggy way to write it:\n\
 * <pre>\n\
 * <img src=\"http://www.gravatar.com/avatar/{{hash}}\"/>\n\
 * </pre>\n\
 *\n\
 * The correct way to write it:\n\
 * <pre>\n\
 * <img ng-src=\"http://www.gravatar.com/avatar/{{hash}}\"/>\n\
 * </pre>\n\
 *\n\
 * @element IMG\n\
 * @param {template} ngSrc any string which can contain `{{}}` markup.\n\
 */\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngSrcset\n\
 * @restrict A\n\
 *\n\
 * @description\n\
 * Using Angular markup like `{{hash}}` in a `srcset` attribute doesn't\n\
 * work right: The browser will fetch from the URL with the literal\n\
 * text `{{hash}}` until Angular replaces the expression inside\n\
 * `{{hash}}`. The `ngSrcset` directive solves this problem.\n\
 *\n\
 * The buggy way to write it:\n\
 * <pre>\n\
 * <img srcset=\"http://www.gravatar.com/avatar/{{hash}} 2x\"/>\n\
 * </pre>\n\
 *\n\
 * The correct way to write it:\n\
 * <pre>\n\
 * <img ng-srcset=\"http://www.gravatar.com/avatar/{{hash}} 2x\"/>\n\
 * </pre>\n\
 *\n\
 * @element IMG\n\
 * @param {template} ngSrcset any string which can contain `{{}}` markup.\n\
 */\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngDisabled\n\
 * @restrict A\n\
 *\n\
 * @description\n\
 *\n\
 * The following markup will make the button enabled on Chrome/Firefox but not on IE8 and older IEs:\n\
 * <pre>\n\
 * <div ng-init=\"scope = { isDisabled: false }\">\n\
 *  <button disabled=\"{{scope.isDisabled}}\">Disabled</button>\n\
 * </div>\n\
 * </pre>\n\
 *\n\
 * The HTML specs do not require browsers to preserve the special attributes such as disabled.\n\
 * (The presence of them means true and absence means false)\n\
 * This prevents the angular compiler from correctly retrieving the binding expression.\n\
 * To solve this problem, we introduce the `ngDisabled` directive.\n\
 *\n\
 * @example\n\
    <doc:example>\n\
      <doc:source>\n\
        Click me to toggle: <input type=\"checkbox\" ng-model=\"checked\"><br/>\n\
        <button ng-model=\"button\" ng-disabled=\"checked\">Button</button>\n\
      </doc:source>\n\
      <doc:scenario>\n\
        it('should toggle button', function() {\n\
          expect(element('.doc-example-live :button').prop('disabled')).toBeFalsy();\n\
          input('checked').check();\n\
          expect(element('.doc-example-live :button').prop('disabled')).toBeTruthy();\n\
        });\n\
      </doc:scenario>\n\
    </doc:example>\n\
 *\n\
 * @element INPUT\n\
 * @param {expression} ngDisabled Angular expression that will be evaluated.\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngChecked\n\
 * @restrict A\n\
 *\n\
 * @description\n\
 * The HTML specs do not require browsers to preserve the special attributes such as checked.\n\
 * (The presence of them means true and absence means false)\n\
 * This prevents the angular compiler from correctly retrieving the binding expression.\n\
 * To solve this problem, we introduce the `ngChecked` directive.\n\
 * @example\n\
    <doc:example>\n\
      <doc:source>\n\
        Check me to check both: <input type=\"checkbox\" ng-model=\"master\"><br/>\n\
        <input id=\"checkSlave\" type=\"checkbox\" ng-checked=\"master\">\n\
      </doc:source>\n\
      <doc:scenario>\n\
        it('should check both checkBoxes', function() {\n\
          expect(element('.doc-example-live #checkSlave').prop('checked')).toBeFalsy();\n\
          input('master').check();\n\
          expect(element('.doc-example-live #checkSlave').prop('checked')).toBeTruthy();\n\
        });\n\
      </doc:scenario>\n\
    </doc:example>\n\
 *\n\
 * @element INPUT\n\
 * @param {expression} ngChecked Angular expression that will be evaluated.\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngMultiple\n\
 * @restrict A\n\
 *\n\
 * @description\n\
 * The HTML specs do not require browsers to preserve the special attributes such as multiple.\n\
 * (The presence of them means true and absence means false)\n\
 * This prevents the angular compiler from correctly retrieving the binding expression.\n\
 * To solve this problem, we introduce the `ngMultiple` directive.\n\
 *\n\
 * @example\n\
     <doc:example>\n\
       <doc:source>\n\
         Check me check multiple: <input type=\"checkbox\" ng-model=\"checked\"><br/>\n\
         <select id=\"select\" ng-multiple=\"checked\">\n\
           <option>Misko</option>\n\
           <option>Igor</option>\n\
           <option>Vojta</option>\n\
           <option>Di</option>\n\
         </select>\n\
       </doc:source>\n\
       <doc:scenario>\n\
         it('should toggle multiple', function() {\n\
           expect(element('.doc-example-live #select').prop('multiple')).toBeFalsy();\n\
           input('checked').check();\n\
           expect(element('.doc-example-live #select').prop('multiple')).toBeTruthy();\n\
         });\n\
       </doc:scenario>\n\
     </doc:example>\n\
 *\n\
 * @element SELECT\n\
 * @param {expression} ngMultiple Angular expression that will be evaluated.\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngReadonly\n\
 * @restrict A\n\
 *\n\
 * @description\n\
 * The HTML specs do not require browsers to preserve the special attributes such as readonly.\n\
 * (The presence of them means true and absence means false)\n\
 * This prevents the angular compiler from correctly retrieving the binding expression.\n\
 * To solve this problem, we introduce the `ngReadonly` directive.\n\
 * @example\n\
    <doc:example>\n\
      <doc:source>\n\
        Check me to make text readonly: <input type=\"checkbox\" ng-model=\"checked\"><br/>\n\
        <input type=\"text\" ng-readonly=\"checked\" value=\"I'm Angular\"/>\n\
      </doc:source>\n\
      <doc:scenario>\n\
        it('should toggle readonly attr', function() {\n\
          expect(element('.doc-example-live :text').prop('readonly')).toBeFalsy();\n\
          input('checked').check();\n\
          expect(element('.doc-example-live :text').prop('readonly')).toBeTruthy();\n\
        });\n\
      </doc:scenario>\n\
    </doc:example>\n\
 *\n\
 * @element INPUT\n\
 * @param {string} expression Angular expression that will be evaluated.\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngSelected\n\
 * @restrict A\n\
 *\n\
 * @description\n\
 * The HTML specs do not require browsers to preserve the special attributes such as selected.\n\
 * (The presence of them means true and absence means false)\n\
 * This prevents the angular compiler from correctly retrieving the binding expression.\n\
 * To solve this problem, we introduced the `ngSelected` directive.\n\
 * @example\n\
    <doc:example>\n\
      <doc:source>\n\
        Check me to select: <input type=\"checkbox\" ng-model=\"selected\"><br/>\n\
        <select>\n\
          <option>Hello!</option>\n\
          <option id=\"greet\" ng-selected=\"selected\">Greetings!</option>\n\
        </select>\n\
      </doc:source>\n\
      <doc:scenario>\n\
        it('should select Greetings!', function() {\n\
          expect(element('.doc-example-live #greet').prop('selected')).toBeFalsy();\n\
          input('selected').check();\n\
          expect(element('.doc-example-live #greet').prop('selected')).toBeTruthy();\n\
        });\n\
      </doc:scenario>\n\
    </doc:example>\n\
 *\n\
 * @element OPTION\n\
 * @param {string} expression Angular expression that will be evaluated.\n\
 */\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngOpen\n\
 * @restrict A\n\
 *\n\
 * @description\n\
 * The HTML specs do not require browsers to preserve the special attributes such as open.\n\
 * (The presence of them means true and absence means false)\n\
 * This prevents the angular compiler from correctly retrieving the binding expression.\n\
 * To solve this problem, we introduce the `ngOpen` directive.\n\
 *\n\
 * @example\n\
     <doc:example>\n\
       <doc:source>\n\
         Check me check multiple: <input type=\"checkbox\" ng-model=\"open\"><br/>\n\
         <details id=\"details\" ng-open=\"open\">\n\
            <summary>Show/Hide me</summary>\n\
         </details>\n\
       </doc:source>\n\
       <doc:scenario>\n\
         it('should toggle open', function() {\n\
           expect(element('#details').prop('open')).toBeFalsy();\n\
           input('open').check();\n\
           expect(element('#details').prop('open')).toBeTruthy();\n\
         });\n\
       </doc:scenario>\n\
     </doc:example>\n\
 *\n\
 * @element DETAILS\n\
 * @param {string} expression Angular expression that will be evaluated.\n\
 */\n\
\n\
var ngAttributeAliasDirectives = {};\n\
\n\
\n\
// boolean attrs are evaluated\n\
forEach(BOOLEAN_ATTR, function(propName, attrName) {\n\
  var normalized = directiveNormalize('ng-' + attrName);\n\
  ngAttributeAliasDirectives[normalized] = function() {\n\
    return {\n\
      priority: 100,\n\
      compile: function() {\n\
        return function(scope, element, attr) {\n\
          scope.$watch(attr[normalized], function ngBooleanAttrWatchAction(value) {\n\
            attr.$set(attrName, !!value);\n\
          });\n\
        };\n\
      }\n\
    };\n\
  };\n\
});\n\
\n\
\n\
// ng-src, ng-srcset, ng-href are interpolated\n\
forEach(['src', 'srcset', 'href'], function(attrName) {\n\
  var normalized = directiveNormalize('ng-' + attrName);\n\
  ngAttributeAliasDirectives[normalized] = function() {\n\
    return {\n\
      priority: 99, // it needs to run after the attributes are interpolated\n\
      link: function(scope, element, attr) {\n\
        attr.$observe(normalized, function(value) {\n\
          if (!value)\n\
             return;\n\
\n\
          attr.$set(attrName, value);\n\
\n\
          // on IE, if \"ng:src\" directive declaration is used and \"src\" attribute doesn't exist\n\
          // then calling element.setAttribute('src', 'foo') doesn't do anything, so we need\n\
          // to set the property as well to achieve the desired effect.\n\
          // we use attr[attrName] value since $set can sanitize the url.\n\
          if (msie) element.prop(attrName, attr[attrName]);\n\
        });\n\
      }\n\
    };\n\
  };\n\
});\n\
\n\
var nullFormCtrl = {\n\
  $addControl: noop,\n\
  $removeControl: noop,\n\
  $setValidity: noop,\n\
  $setDirty: noop,\n\
  $setPristine: noop\n\
};\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.directive:form.FormController\n\
 *\n\
 * @property {boolean} $pristine True if user has not interacted with the form yet.\n\
 * @property {boolean} $dirty True if user has already interacted with the form.\n\
 * @property {boolean} $valid True if all of the containing forms and controls are valid.\n\
 * @property {boolean} $invalid True if at least one containing control or form is invalid.\n\
 *\n\
 * @property {Object} $error Is an object hash, containing references to all invalid controls or\n\
 *  forms, where:\n\
 *\n\
 *  - keys are validation tokens (error names) â€” such as `required`, `url` or `email`),\n\
 *  - values are arrays of controls or forms that are invalid with given error.\n\
 *\n\
 * @description\n\
 * `FormController` keeps track of all its controls and nested forms as well as state of them,\n\
 * such as being valid/invalid or dirty/pristine.\n\
 *\n\
 * Each {@link ng.directive:form form} directive creates an instance\n\
 * of `FormController`.\n\
 *\n\
 */\n\
//asks for $scope to fool the BC controller module\n\
FormController.$inject = ['$element', '$attrs', '$scope'];\n\
function FormController(element, attrs) {\n\
  var form = this,\n\
      parentForm = element.parent().controller('form') || nullFormCtrl,\n\
      invalidCount = 0, // used to easily determine if we are valid\n\
      errors = form.$error = {},\n\
      controls = [];\n\
\n\
  // init state\n\
  form.$name = attrs.name;\n\
  form.$dirty = false;\n\
  form.$pristine = true;\n\
  form.$valid = true;\n\
  form.$invalid = false;\n\
\n\
  parentForm.$addControl(form);\n\
\n\
  // Setup initial state of the control\n\
  element.addClass(PRISTINE_CLASS);\n\
  toggleValidCss(true);\n\
\n\
  // convenience method for easy toggling of classes\n\
  function toggleValidCss(isValid, validationErrorKey) {\n\
    validationErrorKey = validationErrorKey ? '-' + snake_case(validationErrorKey, '-') : '';\n\
    element.\n\
      removeClass((isValid ? INVALID_CLASS : VALID_CLASS) + validationErrorKey).\n\
      addClass((isValid ? VALID_CLASS : INVALID_CLASS) + validationErrorKey);\n\
  }\n\
\n\
  form.$addControl = function(control) {\n\
    controls.push(control);\n\
\n\
    if (control.$name && !form.hasOwnProperty(control.$name)) {\n\
      form[control.$name] = control;\n\
    }\n\
  };\n\
\n\
  form.$removeControl = function(control) {\n\
    if (control.$name && form[control.$name] === control) {\n\
      delete form[control.$name];\n\
    }\n\
    forEach(errors, function(queue, validationToken) {\n\
      form.$setValidity(validationToken, true, control);\n\
    });\n\
\n\
    arrayRemove(controls, control);\n\
  };\n\
\n\
  form.$setValidity = function(validationToken, isValid, control) {\n\
    var queue = errors[validationToken];\n\
\n\
    if (isValid) {\n\
      if (queue) {\n\
        arrayRemove(queue, control);\n\
        if (!queue.length) {\n\
          invalidCount--;\n\
          if (!invalidCount) {\n\
            toggleValidCss(isValid);\n\
            form.$valid = true;\n\
            form.$invalid = false;\n\
          }\n\
          errors[validationToken] = false;\n\
          toggleValidCss(true, validationToken);\n\
          parentForm.$setValidity(validationToken, true, form);\n\
        }\n\
      }\n\
\n\
    } else {\n\
      if (!invalidCount) {\n\
        toggleValidCss(isValid);\n\
      }\n\
      if (queue) {\n\
        if (includes(queue, control)) return;\n\
      } else {\n\
        errors[validationToken] = queue = [];\n\
        invalidCount++;\n\
        toggleValidCss(false, validationToken);\n\
        parentForm.$setValidity(validationToken, false, form);\n\
      }\n\
      queue.push(control);\n\
\n\
      form.$valid = false;\n\
      form.$invalid = true;\n\
    }\n\
  };\n\
\n\
  form.$setDirty = function() {\n\
    element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS);\n\
    form.$dirty = true;\n\
    form.$pristine = false;\n\
    parentForm.$setDirty();\n\
  };\n\
\n\
  /**\n\
   * @ngdoc function\n\
   * @name ng.directive:form.FormController#$setPristine\n\
   * @methodOf ng.directive:form.FormController\n\
   *\n\
   * @description\n\
   * Sets the form to its pristine state.\n\
   *\n\
   * This method can be called to remove the 'ng-dirty' class and set the form to its pristine\n\
   * state (ng-pristine class). This method will also propagate to all the controls contained\n\
   * in this form.\n\
   *\n\
   * Setting a form back to a pristine state is often useful when we want to 'reuse' a form after\n\
   * saving or resetting it.\n\
   */\n\
  form.$setPristine = function () {\n\
    element.removeClass(DIRTY_CLASS).addClass(PRISTINE_CLASS);\n\
    form.$dirty = false;\n\
    form.$pristine = true;\n\
    forEach(controls, function(control) {\n\
      control.$setPristine();\n\
    });\n\
  };\n\
}\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngForm\n\
 * @restrict EAC\n\
 *\n\
 * @description\n\
 * Nestable alias of {@link ng.directive:form `form`} directive. HTML\n\
 * does not allow nesting of form elements. It is useful to nest forms, for example if the validity of a\n\
 * sub-group of controls needs to be determined.\n\
 *\n\
 * @param {string=} name|ngForm Name of the form. If specified, the form controller will be published into\n\
 *                       related scope, under this name.\n\
 *\n\
 */\n\
\n\
 /**\n\
 * @ngdoc directive\n\
 * @name ng.directive:form\n\
 * @restrict E\n\
 *\n\
 * @description\n\
 * Directive that instantiates\n\
 * {@link ng.directive:form.FormController FormController}.\n\
 *\n\
 * If `name` attribute is specified, the form controller is published onto the current scope under\n\
 * this name.\n\
 *\n\
 * # Alias: {@link ng.directive:ngForm `ngForm`}\n\
 *\n\
 * In angular forms can be nested. This means that the outer form is valid when all of the child\n\
 * forms are valid as well. However browsers do not allow nesting of `<form>` elements, for this\n\
 * reason angular provides {@link ng.directive:ngForm `ngForm`} alias\n\
 * which behaves identical to `<form>` but allows form nesting.\n\
 *\n\
 *\n\
 * # CSS classes\n\
 *  - `ng-valid` Is set if the form is valid.\n\
 *  - `ng-invalid` Is set if the form is invalid.\n\
 *  - `ng-pristine` Is set if the form is pristine.\n\
 *  - `ng-dirty` Is set if the form is dirty.\n\
 *\n\
 *\n\
 * # Submitting a form and preventing default action\n\
 *\n\
 * Since the role of forms in client-side Angular applications is different than in classical\n\
 * roundtrip apps, it is desirable for the browser not to translate the form submission into a full\n\
 * page reload that sends the data to the server. Instead some javascript logic should be triggered\n\
 * to handle the form submission in application specific way.\n\
 *\n\
 * For this reason, Angular prevents the default action (form submission to the server) unless the\n\
 * `<form>` element has an `action` attribute specified.\n\
 *\n\
 * You can use one of the following two ways to specify what javascript method should be called when\n\
 * a form is submitted:\n\
 *\n\
 * - {@link ng.directive:ngSubmit ngSubmit} directive on the form element\n\
 * - {@link ng.directive:ngClick ngClick} directive on the first\n\
  *  button or input field of type submit (input[type=submit])\n\
 *\n\
 * To prevent double execution of the handler, use only one of ngSubmit or ngClick directives. This\n\
 * is because of the following form submission rules coming from the html spec:\n\
 *\n\
 * - If a form has only one input field then hitting enter in this field triggers form submit\n\
 * (`ngSubmit`)\n\
 * - if a form has has 2+ input fields and no buttons or input[type=submit] then hitting enter\n\
 * doesn't trigger submit\n\
 * - if a form has one or more input fields and one or more buttons or input[type=submit] then\n\
 * hitting enter in any of the input fields will trigger the click handler on the *first* button or\n\
 * input[type=submit] (`ngClick`) *and* a submit handler on the enclosing form (`ngSubmit`)\n\
 *\n\
 * @param {string=} name Name of the form. If specified, the form controller will be published into\n\
 *                       related scope, under this name.\n\
 *\n\
 * @example\n\
    <doc:example>\n\
      <doc:source>\n\
       <script>\n\
         function Ctrl($scope) {\n\
           $scope.userType = 'guest';\n\
         }\n\
       </script>\n\
       <form name=\"myForm\" ng-controller=\"Ctrl\">\n\
         userType: <input name=\"input\" ng-model=\"userType\" required>\n\
         <span class=\"error\" ng-show=\"myForm.input.$error.required\">Required!</span><br>\n\
         <tt>userType = {{userType}}</tt><br>\n\
         <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br>\n\
         <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br>\n\
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br>\n\
         <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br>\n\
        </form>\n\
      </doc:source>\n\
      <doc:scenario>\n\
        it('should initialize to model', function() {\n\
         expect(binding('userType')).toEqual('guest');\n\
         expect(binding('myForm.input.$valid')).toEqual('true');\n\
        });\n\
\n\
        it('should be invalid if empty', function() {\n\
         input('userType').enter('');\n\
         expect(binding('userType')).toEqual('');\n\
         expect(binding('myForm.input.$valid')).toEqual('false');\n\
        });\n\
      </doc:scenario>\n\
    </doc:example>\n\
 */\n\
var formDirectiveFactory = function(isNgForm) {\n\
  return ['$timeout', function($timeout) {\n\
    var formDirective = {\n\
      name: 'form',\n\
      restrict: 'E',\n\
      controller: FormController,\n\
      compile: function() {\n\
        return {\n\
          pre: function(scope, formElement, attr, controller) {\n\
            if (!attr.action) {\n\
              // we can't use jq events because if a form is destroyed during submission the default\n\
              // action is not prevented. see #1238\n\
              //\n\
              // IE 9 is not affected because it doesn't fire a submit event and try to do a full\n\
              // page reload if the form was destroyed by submission of the form via a click handler\n\
              // on a button in the form. Looks like an IE9 specific bug.\n\
              var preventDefaultListener = function(event) {\n\
                event.preventDefault\n\
                  ? event.preventDefault()\n\
                  : event.returnValue = false; // IE\n\
              };\n\
\n\
              addEventListenerFn(formElement[0], 'submit', preventDefaultListener);\n\
\n\
              // unregister the preventDefault listener so that we don't not leak memory but in a\n\
              // way that will achieve the prevention of the default action.\n\
              formElement.bind('$destroy', function() {\n\
                $timeout(function() {\n\
                  removeEventListenerFn(formElement[0], 'submit', preventDefaultListener);\n\
                }, 0, false);\n\
              });\n\
            }\n\
\n\
            var parentFormCtrl = formElement.parent().controller('form'),\n\
                alias = attr.name || attr.ngForm;\n\
\n\
            if (alias) {\n\
              scope[alias] = controller;\n\
            }\n\
            if (parentFormCtrl) {\n\
              formElement.bind('$destroy', function() {\n\
                parentFormCtrl.$removeControl(controller);\n\
                if (alias) {\n\
                  scope[alias] = undefined;\n\
                }\n\
                extend(controller, nullFormCtrl); //stop propagating child destruction handlers upwards\n\
              });\n\
            }\n\
          }\n\
        };\n\
      }\n\
    };\n\
\n\
    return isNgForm ? extend(copy(formDirective), {restrict: 'EAC'}) : formDirective;\n\
  }];\n\
};\n\
\n\
var formDirective = formDirectiveFactory();\n\
var ngFormDirective = formDirectiveFactory(true);\n\
\n\
var URL_REGEXP = /^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?$/;\n\
var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$/;\n\
var NUMBER_REGEXP = /^\\s*(\\-|\\+)?(\\d+|(\\d*(\\.\\d*)))\\s*$/;\n\
\n\
var inputType = {\n\
\n\
  /**\n\
   * @ngdoc inputType\n\
   * @name ng.directive:input.text\n\
   *\n\
   * @description\n\
   * Standard HTML text input with angular data binding.\n\
   *\n\
   * @param {string} ngModel Assignable angular expression to data-bind to.\n\
   * @param {string=} name Property name of the form under which the control is published.\n\
   * @param {string=} required Adds `required` validation error key if the value is not entered.\n\
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to\n\
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of\n\
   *    `required` when you want to data-bind to the `required` attribute.\n\
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than\n\
   *    minlength.\n\
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than\n\
   *    maxlength.\n\
   * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the\n\
   *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for\n\
   *    patterns defined as scope expressions.\n\
   * @param {string=} ngChange Angular expression to be executed when input changes due to user\n\
   *    interaction with the input element.\n\
   * @param {boolean=} [ngTrim=true] If set to false Angular will not automatically trimming the\n\
   *    input.\n\
   *\n\
   * @example\n\
      <doc:example>\n\
        <doc:source>\n\
         <script>\n\
           function Ctrl($scope) {\n\
             $scope.text = 'guest';\n\
             $scope.word = /^\\s*\\w*\\s*$/;\n\
           }\n\
         </script>\n\
         <form name=\"myForm\" ng-controller=\"Ctrl\">\n\
           Single word: <input type=\"text\" name=\"input\" ng-model=\"text\"\n\
                               ng-pattern=\"word\" required ng-trim=\"false\">\n\
           <span class=\"error\" ng-show=\"myForm.input.$error.required\">\n\
             Required!</span>\n\
           <span class=\"error\" ng-show=\"myForm.input.$error.pattern\">\n\
             Single word only!</span>\n\
\n\
           <tt>text = {{text}}</tt><br/>\n\
           <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>\n\
           <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>\n\
           <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>\n\
           <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>\n\
          </form>\n\
        </doc:source>\n\
        <doc:scenario>\n\
          it('should initialize to model', function() {\n\
            expect(binding('text')).toEqual('guest');\n\
            expect(binding('myForm.input.$valid')).toEqual('true');\n\
          });\n\
\n\
          it('should be invalid if empty', function() {\n\
            input('text').enter('');\n\
            expect(binding('text')).toEqual('');\n\
            expect(binding('myForm.input.$valid')).toEqual('false');\n\
          });\n\
\n\
          it('should be invalid if multi word', function() {\n\
            input('text').enter('hello world');\n\
            expect(binding('myForm.input.$valid')).toEqual('false');\n\
          });\n\
\n\
          it('should not be trimmed', function() {\n\
            input('text').enter('untrimmed ');\n\
            expect(binding('text')).toEqual('untrimmed ');\n\
            expect(binding('myForm.input.$valid')).toEqual('true');\n\
          });\n\
        </doc:scenario>\n\
      </doc:example>\n\
   */\n\
  'text': textInputType,\n\
\n\
\n\
  /**\n\
   * @ngdoc inputType\n\
   * @name ng.directive:input.number\n\
   *\n\
   * @description\n\
   * Text input with number validation and transformation. Sets the `number` validation\n\
   * error if not a valid number.\n\
   *\n\
   * @param {string} ngModel Assignable angular expression to data-bind to.\n\
   * @param {string=} name Property name of the form under which the control is published.\n\
   * @param {string=} min Sets the `min` validation error key if the value entered is less than `min`.\n\
   * @param {string=} max Sets the `max` validation error key if the value entered is greater than `max`.\n\
   * @param {string=} required Sets `required` validation error key if the value is not entered.\n\
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to\n\
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of\n\
   *    `required` when you want to data-bind to the `required` attribute.\n\
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than\n\
   *    minlength.\n\
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than\n\
   *    maxlength.\n\
   * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the\n\
   *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for\n\
   *    patterns defined as scope expressions.\n\
   * @param {string=} ngChange Angular expression to be executed when input changes due to user\n\
   *    interaction with the input element.\n\
   *\n\
   * @example\n\
      <doc:example>\n\
        <doc:source>\n\
         <script>\n\
           function Ctrl($scope) {\n\
             $scope.value = 12;\n\
           }\n\
         </script>\n\
         <form name=\"myForm\" ng-controller=\"Ctrl\">\n\
           Number: <input type=\"number\" name=\"input\" ng-model=\"value\"\n\
                          min=\"0\" max=\"99\" required>\n\
           <span class=\"error\" ng-show=\"myForm.list.$error.required\">\n\
             Required!</span>\n\
           <span class=\"error\" ng-show=\"myForm.list.$error.number\">\n\
             Not valid number!</span>\n\
           <tt>value = {{value}}</tt><br/>\n\
           <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>\n\
           <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>\n\
           <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>\n\
           <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>\n\
          </form>\n\
        </doc:source>\n\
        <doc:scenario>\n\
          it('should initialize to model', function() {\n\
           expect(binding('value')).toEqual('12');\n\
           expect(binding('myForm.input.$valid')).toEqual('true');\n\
          });\n\
\n\
          it('should be invalid if empty', function() {\n\
           input('value').enter('');\n\
           expect(binding('value')).toEqual('');\n\
           expect(binding('myForm.input.$valid')).toEqual('false');\n\
          });\n\
\n\
          it('should be invalid if over max', function() {\n\
           input('value').enter('123');\n\
           expect(binding('value')).toEqual('');\n\
           expect(binding('myForm.input.$valid')).toEqual('false');\n\
          });\n\
        </doc:scenario>\n\
      </doc:example>\n\
   */\n\
  'number': numberInputType,\n\
\n\
\n\
  /**\n\
   * @ngdoc inputType\n\
   * @name ng.directive:input.url\n\
   *\n\
   * @description\n\
   * Text input with URL validation. Sets the `url` validation error key if the content is not a\n\
   * valid URL.\n\
   *\n\
   * @param {string} ngModel Assignable angular expression to data-bind to.\n\
   * @param {string=} name Property name of the form under which the control is published.\n\
   * @param {string=} required Sets `required` validation error key if the value is not entered.\n\
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to\n\
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of\n\
   *    `required` when you want to data-bind to the `required` attribute.\n\
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than\n\
   *    minlength.\n\
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than\n\
   *    maxlength.\n\
   * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the\n\
   *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for\n\
   *    patterns defined as scope expressions.\n\
   * @param {string=} ngChange Angular expression to be executed when input changes due to user\n\
   *    interaction with the input element.\n\
   *\n\
   * @example\n\
      <doc:example>\n\
        <doc:source>\n\
         <script>\n\
           function Ctrl($scope) {\n\
             $scope.text = 'http://google.com';\n\
           }\n\
         </script>\n\
         <form name=\"myForm\" ng-controller=\"Ctrl\">\n\
           URL: <input type=\"url\" name=\"input\" ng-model=\"text\" required>\n\
           <span class=\"error\" ng-show=\"myForm.input.$error.required\">\n\
             Required!</span>\n\
           <span class=\"error\" ng-show=\"myForm.input.$error.url\">\n\
             Not valid url!</span>\n\
           <tt>text = {{text}}</tt><br/>\n\
           <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>\n\
           <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>\n\
           <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>\n\
           <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>\n\
           <tt>myForm.$error.url = {{!!myForm.$error.url}}</tt><br/>\n\
          </form>\n\
        </doc:source>\n\
        <doc:scenario>\n\
          it('should initialize to model', function() {\n\
            expect(binding('text')).toEqual('http://google.com');\n\
            expect(binding('myForm.input.$valid')).toEqual('true');\n\
          });\n\
\n\
          it('should be invalid if empty', function() {\n\
            input('text').enter('');\n\
            expect(binding('text')).toEqual('');\n\
            expect(binding('myForm.input.$valid')).toEqual('false');\n\
          });\n\
\n\
          it('should be invalid if not url', function() {\n\
            input('text').enter('xxx');\n\
            expect(binding('myForm.input.$valid')).toEqual('false');\n\
          });\n\
        </doc:scenario>\n\
      </doc:example>\n\
   */\n\
  'url': urlInputType,\n\
\n\
\n\
  /**\n\
   * @ngdoc inputType\n\
   * @name ng.directive:input.email\n\
   *\n\
   * @description\n\
   * Text input with email validation. Sets the `email` validation error key if not a valid email\n\
   * address.\n\
   *\n\
   * @param {string} ngModel Assignable angular expression to data-bind to.\n\
   * @param {string=} name Property name of the form under which the control is published.\n\
   * @param {string=} required Sets `required` validation error key if the value is not entered.\n\
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to\n\
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of\n\
   *    `required` when you want to data-bind to the `required` attribute.\n\
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than\n\
   *    minlength.\n\
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than\n\
   *    maxlength.\n\
   * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the\n\
   *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for\n\
   *    patterns defined as scope expressions.\n\
   *\n\
   * @example\n\
      <doc:example>\n\
        <doc:source>\n\
         <script>\n\
           function Ctrl($scope) {\n\
             $scope.text = 'me@example.com';\n\
           }\n\
         </script>\n\
           <form name=\"myForm\" ng-controller=\"Ctrl\">\n\
             Email: <input type=\"email\" name=\"input\" ng-model=\"text\" required>\n\
             <span class=\"error\" ng-show=\"myForm.input.$error.required\">\n\
               Required!</span>\n\
             <span class=\"error\" ng-show=\"myForm.input.$error.email\">\n\
               Not valid email!</span>\n\
             <tt>text = {{text}}</tt><br/>\n\
             <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>\n\
             <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>\n\
             <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>\n\
             <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>\n\
             <tt>myForm.$error.email = {{!!myForm.$error.email}}</tt><br/>\n\
           </form>\n\
        </doc:source>\n\
        <doc:scenario>\n\
          it('should initialize to model', function() {\n\
            expect(binding('text')).toEqual('me@example.com');\n\
            expect(binding('myForm.input.$valid')).toEqual('true');\n\
          });\n\
\n\
          it('should be invalid if empty', function() {\n\
            input('text').enter('');\n\
            expect(binding('text')).toEqual('');\n\
            expect(binding('myForm.input.$valid')).toEqual('false');\n\
          });\n\
\n\
          it('should be invalid if not email', function() {\n\
            input('text').enter('xxx');\n\
            expect(binding('myForm.input.$valid')).toEqual('false');\n\
          });\n\
        </doc:scenario>\n\
      </doc:example>\n\
   */\n\
  'email': emailInputType,\n\
\n\
\n\
  /**\n\
   * @ngdoc inputType\n\
   * @name ng.directive:input.radio\n\
   *\n\
   * @description\n\
   * HTML radio button.\n\
   *\n\
   * @param {string} ngModel Assignable angular expression to data-bind to.\n\
   * @param {string} value The value to which the expression should be set when selected.\n\
   * @param {string=} name Property name of the form under which the control is published.\n\
   * @param {string=} ngChange Angular expression to be executed when input changes due to user\n\
   *    interaction with the input element.\n\
   *\n\
   * @example\n\
      <doc:example>\n\
        <doc:source>\n\
         <script>\n\
           function Ctrl($scope) {\n\
             $scope.color = 'blue';\n\
           }\n\
         </script>\n\
         <form name=\"myForm\" ng-controller=\"Ctrl\">\n\
           <input type=\"radio\" ng-model=\"color\" value=\"red\">  Red <br/>\n\
           <input type=\"radio\" ng-model=\"color\" value=\"green\"> Green <br/>\n\
           <input type=\"radio\" ng-model=\"color\" value=\"blue\"> Blue <br/>\n\
           <tt>color = {{color}}</tt><br/>\n\
          </form>\n\
        </doc:source>\n\
        <doc:scenario>\n\
          it('should change state', function() {\n\
            expect(binding('color')).toEqual('blue');\n\
\n\
            input('color').select('red');\n\
            expect(binding('color')).toEqual('red');\n\
          });\n\
        </doc:scenario>\n\
      </doc:example>\n\
   */\n\
  'radio': radioInputType,\n\
\n\
\n\
  /**\n\
   * @ngdoc inputType\n\
   * @name ng.directive:input.checkbox\n\
   *\n\
   * @description\n\
   * HTML checkbox.\n\
   *\n\
   * @param {string} ngModel Assignable angular expression to data-bind to.\n\
   * @param {string=} name Property name of the form under which the control is published.\n\
   * @param {string=} ngTrueValue The value to which the expression should be set when selected.\n\
   * @param {string=} ngFalseValue The value to which the expression should be set when not selected.\n\
   * @param {string=} ngChange Angular expression to be executed when input changes due to user\n\
   *    interaction with the input element.\n\
   *\n\
   * @example\n\
      <doc:example>\n\
        <doc:source>\n\
         <script>\n\
           function Ctrl($scope) {\n\
             $scope.value1 = true;\n\
             $scope.value2 = 'YES'\n\
           }\n\
         </script>\n\
         <form name=\"myForm\" ng-controller=\"Ctrl\">\n\
           Value1: <input type=\"checkbox\" ng-model=\"value1\"> <br/>\n\
           Value2: <input type=\"checkbox\" ng-model=\"value2\"\n\
                          ng-true-value=\"YES\" ng-false-value=\"NO\"> <br/>\n\
           <tt>value1 = {{value1}}</tt><br/>\n\
           <tt>value2 = {{value2}}</tt><br/>\n\
          </form>\n\
        </doc:source>\n\
        <doc:scenario>\n\
          it('should change state', function() {\n\
            expect(binding('value1')).toEqual('true');\n\
            expect(binding('value2')).toEqual('YES');\n\
\n\
            input('value1').check();\n\
            input('value2').check();\n\
            expect(binding('value1')).toEqual('false');\n\
            expect(binding('value2')).toEqual('NO');\n\
          });\n\
        </doc:scenario>\n\
      </doc:example>\n\
   */\n\
  'checkbox': checkboxInputType,\n\
\n\
  'hidden': noop,\n\
  'button': noop,\n\
  'submit': noop,\n\
  'reset': noop\n\
};\n\
\n\
\n\
function isEmpty(value) {\n\
  return isUndefined(value) || value === '' || value === null || value !== value;\n\
}\n\
\n\
\n\
function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {\n\
\n\
  var listener = function() {\n\
    var value = element.val();\n\
\n\
    // By default we will trim the value\n\
    // If the attribute ng-trim exists we will avoid trimming\n\
    // e.g. <input ng-model=\"foo\" ng-trim=\"false\">\n\
    if (toBoolean(attr.ngTrim || 'T')) {\n\
      value = trim(value);\n\
    }\n\
\n\
    if (ctrl.$viewValue !== value) {\n\
      scope.$apply(function() {\n\
        ctrl.$setViewValue(value);\n\
      });\n\
    }\n\
  };\n\
\n\
  // if the browser does support \"input\" event, we are fine - except on IE9 which doesn't fire the\n\
  // input event on backspace, delete or cut\n\
  if ($sniffer.hasEvent('input')) {\n\
    element.bind('input', listener);\n\
  } else {\n\
    var timeout;\n\
\n\
    var deferListener = function() {\n\
      if (!timeout) {\n\
        timeout = $browser.defer(function() {\n\
          listener();\n\
          timeout = null;\n\
        });\n\
      }\n\
    };\n\
\n\
    element.bind('keydown', function(event) {\n\
      var key = event.keyCode;\n\
\n\
      // ignore\n\
      //    command            modifiers                   arrows\n\
      if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) return;\n\
\n\
      deferListener();\n\
    });\n\
\n\
    // if user paste into input using mouse, we need \"change\" event to catch it\n\
    element.bind('change', listener);\n\
\n\
    // if user modifies input value using context menu in IE, we need \"paste\" and \"cut\" events to catch it\n\
    if ($sniffer.hasEvent('paste')) {\n\
      element.bind('paste cut', deferListener);\n\
    }\n\
  }\n\
\n\
\n\
  ctrl.$render = function() {\n\
    element.val(isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue);\n\
  };\n\
\n\
  // pattern validator\n\
  var pattern = attr.ngPattern,\n\
      patternValidator,\n\
      match;\n\
\n\
  var validate = function(regexp, value) {\n\
    if (isEmpty(value) || regexp.test(value)) {\n\
      ctrl.$setValidity('pattern', true);\n\
      return value;\n\
    } else {\n\
      ctrl.$setValidity('pattern', false);\n\
      return undefined;\n\
    }\n\
  };\n\
\n\
  if (pattern) {\n\
    match = pattern.match(/^\\/(.*)\\/([gim]*)$/);\n\
    if (match) {\n\
      pattern = new RegExp(match[1], match[2]);\n\
      patternValidator = function(value) {\n\
        return validate(pattern, value)\n\
      };\n\
    } else {\n\
      patternValidator = function(value) {\n\
        var patternObj = scope.$eval(pattern);\n\
\n\
        if (!patternObj || !patternObj.test) {\n\
          throw new Error('Expected ' + pattern + ' to be a RegExp but was ' + patternObj);\n\
        }\n\
        return validate(patternObj, value);\n\
      };\n\
    }\n\
\n\
    ctrl.$formatters.push(patternValidator);\n\
    ctrl.$parsers.push(patternValidator);\n\
  }\n\
\n\
  // min length validator\n\
  if (attr.ngMinlength) {\n\
    var minlength = int(attr.ngMinlength);\n\
    var minLengthValidator = function(value) {\n\
      if (!isEmpty(value) && value.length < minlength) {\n\
        ctrl.$setValidity('minlength', false);\n\
        return undefined;\n\
      } else {\n\
        ctrl.$setValidity('minlength', true);\n\
        return value;\n\
      }\n\
    };\n\
\n\
    ctrl.$parsers.push(minLengthValidator);\n\
    ctrl.$formatters.push(minLengthValidator);\n\
  }\n\
\n\
  // max length validator\n\
  if (attr.ngMaxlength) {\n\
    var maxlength = int(attr.ngMaxlength);\n\
    var maxLengthValidator = function(value) {\n\
      if (!isEmpty(value) && value.length > maxlength) {\n\
        ctrl.$setValidity('maxlength', false);\n\
        return undefined;\n\
      } else {\n\
        ctrl.$setValidity('maxlength', true);\n\
        return value;\n\
      }\n\
    };\n\
\n\
    ctrl.$parsers.push(maxLengthValidator);\n\
    ctrl.$formatters.push(maxLengthValidator);\n\
  }\n\
}\n\
\n\
function numberInputType(scope, element, attr, ctrl, $sniffer, $browser) {\n\
  textInputType(scope, element, attr, ctrl, $sniffer, $browser);\n\
\n\
  ctrl.$parsers.push(function(value) {\n\
    var empty = isEmpty(value);\n\
    if (empty || NUMBER_REGEXP.test(value)) {\n\
      ctrl.$setValidity('number', true);\n\
      return value === '' ? null : (empty ? value : parseFloat(value));\n\
    } else {\n\
      ctrl.$setValidity('number', false);\n\
      return undefined;\n\
    }\n\
  });\n\
\n\
  ctrl.$formatters.push(function(value) {\n\
    return isEmpty(value) ? '' : '' + value;\n\
  });\n\
\n\
  if (attr.min) {\n\
    var min = parseFloat(attr.min);\n\
    var minValidator = function(value) {\n\
      if (!isEmpty(value) && value < min) {\n\
        ctrl.$setValidity('min', false);\n\
        return undefined;\n\
      } else {\n\
        ctrl.$setValidity('min', true);\n\
        return value;\n\
      }\n\
    };\n\
\n\
    ctrl.$parsers.push(minValidator);\n\
    ctrl.$formatters.push(minValidator);\n\
  }\n\
\n\
  if (attr.max) {\n\
    var max = parseFloat(attr.max);\n\
    var maxValidator = function(value) {\n\
      if (!isEmpty(value) && value > max) {\n\
        ctrl.$setValidity('max', false);\n\
        return undefined;\n\
      } else {\n\
        ctrl.$setValidity('max', true);\n\
        return value;\n\
      }\n\
    };\n\
\n\
    ctrl.$parsers.push(maxValidator);\n\
    ctrl.$formatters.push(maxValidator);\n\
  }\n\
\n\
  ctrl.$formatters.push(function(value) {\n\
\n\
    if (isEmpty(value) || isNumber(value)) {\n\
      ctrl.$setValidity('number', true);\n\
      return value;\n\
    } else {\n\
      ctrl.$setValidity('number', false);\n\
      return undefined;\n\
    }\n\
  });\n\
}\n\
\n\
function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {\n\
  textInputType(scope, element, attr, ctrl, $sniffer, $browser);\n\
\n\
  var urlValidator = function(value) {\n\
    if (isEmpty(value) || URL_REGEXP.test(value)) {\n\
      ctrl.$setValidity('url', true);\n\
      return value;\n\
    } else {\n\
      ctrl.$setValidity('url', false);\n\
      return undefined;\n\
    }\n\
  };\n\
\n\
  ctrl.$formatters.push(urlValidator);\n\
  ctrl.$parsers.push(urlValidator);\n\
}\n\
\n\
function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {\n\
  textInputType(scope, element, attr, ctrl, $sniffer, $browser);\n\
\n\
  var emailValidator = function(value) {\n\
    if (isEmpty(value) || EMAIL_REGEXP.test(value)) {\n\
      ctrl.$setValidity('email', true);\n\
      return value;\n\
    } else {\n\
      ctrl.$setValidity('email', false);\n\
      return undefined;\n\
    }\n\
  };\n\
\n\
  ctrl.$formatters.push(emailValidator);\n\
  ctrl.$parsers.push(emailValidator);\n\
}\n\
\n\
function radioInputType(scope, element, attr, ctrl) {\n\
  // make the name unique, if not defined\n\
  if (isUndefined(attr.name)) {\n\
    element.attr('name', nextUid());\n\
  }\n\
\n\
  element.bind('click', function() {\n\
    if (element[0].checked) {\n\
      scope.$apply(function() {\n\
        ctrl.$setViewValue(attr.value);\n\
      });\n\
    }\n\
  });\n\
\n\
  ctrl.$render = function() {\n\
    var value = attr.value;\n\
    element[0].checked = (value == ctrl.$viewValue);\n\
  };\n\
\n\
  attr.$observe('value', ctrl.$render);\n\
}\n\
\n\
function checkboxInputType(scope, element, attr, ctrl) {\n\
  var trueValue = attr.ngTrueValue,\n\
      falseValue = attr.ngFalseValue;\n\
\n\
  if (!isString(trueValue)) trueValue = true;\n\
  if (!isString(falseValue)) falseValue = false;\n\
\n\
  element.bind('click', function() {\n\
    scope.$apply(function() {\n\
      ctrl.$setViewValue(element[0].checked);\n\
    });\n\
  });\n\
\n\
  ctrl.$render = function() {\n\
    element[0].checked = ctrl.$viewValue;\n\
  };\n\
\n\
  ctrl.$formatters.push(function(value) {\n\
    return value === trueValue;\n\
  });\n\
\n\
  ctrl.$parsers.push(function(value) {\n\
    return value ? trueValue : falseValue;\n\
  });\n\
}\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:textarea\n\
 * @restrict E\n\
 *\n\
 * @description\n\
 * HTML textarea element control with angular data-binding. The data-binding and validation\n\
 * properties of this element are exactly the same as those of the\n\
 * {@link ng.directive:input input element}.\n\
 *\n\
 * @param {string} ngModel Assignable angular expression to data-bind to.\n\
 * @param {string=} name Property name of the form under which the control is published.\n\
 * @param {string=} required Sets `required` validation error key if the value is not entered.\n\
 * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to\n\
 *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of\n\
 *    `required` when you want to data-bind to the `required` attribute.\n\
 * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than\n\
 *    minlength.\n\
 * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than\n\
 *    maxlength.\n\
 * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the\n\
 *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for\n\
 *    patterns defined as scope expressions.\n\
 * @param {string=} ngChange Angular expression to be executed when input changes due to user\n\
 *    interaction with the input element.\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:input\n\
 * @restrict E\n\
 *\n\
 * @description\n\
 * HTML input element control with angular data-binding. Input control follows HTML5 input types\n\
 * and polyfills the HTML5 validation behavior for older browsers.\n\
 *\n\
 * @param {string} ngModel Assignable angular expression to data-bind to.\n\
 * @param {string=} name Property name of the form under which the control is published.\n\
 * @param {string=} required Sets `required` validation error key if the value is not entered.\n\
 * @param {boolean=} ngRequired Sets `required` attribute if set to true\n\
 * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than\n\
 *    minlength.\n\
 * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than\n\
 *    maxlength.\n\
 * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the\n\
 *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for\n\
 *    patterns defined as scope expressions.\n\
 * @param {string=} ngChange Angular expression to be executed when input changes due to user\n\
 *    interaction with the input element.\n\
 *\n\
 * @example\n\
    <doc:example>\n\
      <doc:source>\n\
       <script>\n\
         function Ctrl($scope) {\n\
           $scope.user = {name: 'guest', last: 'visitor'};\n\
         }\n\
       </script>\n\
       <div ng-controller=\"Ctrl\">\n\
         <form name=\"myForm\">\n\
           User name: <input type=\"text\" name=\"userName\" ng-model=\"user.name\" required>\n\
           <span class=\"error\" ng-show=\"myForm.userName.$error.required\">\n\
             Required!</span><br>\n\
           Last name: <input type=\"text\" name=\"lastName\" ng-model=\"user.last\"\n\
             ng-minlength=\"3\" ng-maxlength=\"10\">\n\
           <span class=\"error\" ng-show=\"myForm.lastName.$error.minlength\">\n\
             Too short!</span>\n\
           <span class=\"error\" ng-show=\"myForm.lastName.$error.maxlength\">\n\
             Too long!</span><br>\n\
         </form>\n\
         <hr>\n\
         <tt>user = {{user}}</tt><br/>\n\
         <tt>myForm.userName.$valid = {{myForm.userName.$valid}}</tt><br>\n\
         <tt>myForm.userName.$error = {{myForm.userName.$error}}</tt><br>\n\
         <tt>myForm.lastName.$valid = {{myForm.lastName.$valid}}</tt><br>\n\
         <tt>myForm.lastName.$error = {{myForm.lastName.$error}}</tt><br>\n\
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br>\n\
         <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br>\n\
         <tt>myForm.$error.minlength = {{!!myForm.$error.minlength}}</tt><br>\n\
         <tt>myForm.$error.maxlength = {{!!myForm.$error.maxlength}}</tt><br>\n\
       </div>\n\
      </doc:source>\n\
      <doc:scenario>\n\
        it('should initialize to model', function() {\n\
          expect(binding('user')).toEqual('{\"name\":\"guest\",\"last\":\"visitor\"}');\n\
          expect(binding('myForm.userName.$valid')).toEqual('true');\n\
          expect(binding('myForm.$valid')).toEqual('true');\n\
        });\n\
\n\
        it('should be invalid if empty when required', function() {\n\
          input('user.name').enter('');\n\
          expect(binding('user')).toEqual('{\"last\":\"visitor\"}');\n\
          expect(binding('myForm.userName.$valid')).toEqual('false');\n\
          expect(binding('myForm.$valid')).toEqual('false');\n\
        });\n\
\n\
        it('should be valid if empty when min length is set', function() {\n\
          input('user.last').enter('');\n\
          expect(binding('user')).toEqual('{\"name\":\"guest\",\"last\":\"\"}');\n\
          expect(binding('myForm.lastName.$valid')).toEqual('true');\n\
          expect(binding('myForm.$valid')).toEqual('true');\n\
        });\n\
\n\
        it('should be invalid if less than required min length', function() {\n\
          input('user.last').enter('xx');\n\
          expect(binding('user')).toEqual('{\"name\":\"guest\"}');\n\
          expect(binding('myForm.lastName.$valid')).toEqual('false');\n\
          expect(binding('myForm.lastName.$error')).toMatch(/minlength/);\n\
          expect(binding('myForm.$valid')).toEqual('false');\n\
        });\n\
\n\
        it('should be invalid if longer than max length', function() {\n\
          input('user.last').enter('some ridiculously long name');\n\
          expect(binding('user'))\n\
            .toEqual('{\"name\":\"guest\"}');\n\
          expect(binding('myForm.lastName.$valid')).toEqual('false');\n\
          expect(binding('myForm.lastName.$error')).toMatch(/maxlength/);\n\
          expect(binding('myForm.$valid')).toEqual('false');\n\
        });\n\
      </doc:scenario>\n\
    </doc:example>\n\
 */\n\
var inputDirective = ['$browser', '$sniffer', function($browser, $sniffer) {\n\
  return {\n\
    restrict: 'E',\n\
    require: '?ngModel',\n\
    link: function(scope, element, attr, ctrl) {\n\
      if (ctrl) {\n\
        (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrl, $sniffer,\n\
                                                            $browser);\n\
      }\n\
    }\n\
  };\n\
}];\n\
\n\
var VALID_CLASS = 'ng-valid',\n\
    INVALID_CLASS = 'ng-invalid',\n\
    PRISTINE_CLASS = 'ng-pristine',\n\
    DIRTY_CLASS = 'ng-dirty';\n\
\n\
/**\n\
 * @ngdoc object\n\
 * @name ng.directive:ngModel.NgModelController\n\
 *\n\
 * @property {string} $viewValue Actual string value in the view.\n\
 * @property {*} $modelValue The value in the model, that the control is bound to.\n\
 * @property {Array.<Function>} $parsers Whenever the control reads value from the DOM, it executes\n\
 *     all of these functions to sanitize / convert the value as well as validate.\n\
 *\n\
 * @property {Array.<Function>} $formatters Whenever the model value changes, it executes all of\n\
 *     these functions to convert the value as well as validate.\n\
 *\n\
 * @property {Object} $error An object hash with all errors as keys.\n\
 *\n\
 * @property {boolean} $pristine True if user has not interacted with the control yet.\n\
 * @property {boolean} $dirty True if user has already interacted with the control.\n\
 * @property {boolean} $valid True if there is no error.\n\
 * @property {boolean} $invalid True if at least one error on the control.\n\
 *\n\
 * @description\n\
 *\n\
 * `NgModelController` provides API for the `ng-model` directive. The controller contains\n\
 * services for data-binding, validation, CSS update, value formatting and parsing. It\n\
 * specifically does not contain any logic which deals with DOM rendering or listening to\n\
 * DOM events. The `NgModelController` is meant to be extended by other directives where, the\n\
 * directive provides DOM manipulation and the `NgModelController` provides the data-binding.\n\
 *\n\
 * This example shows how to use `NgModelController` with a custom control to achieve\n\
 * data-binding. Notice how different directives (`contenteditable`, `ng-model`, and `required`)\n\
 * collaborate together to achieve the desired result.\n\
 *\n\
 * <example module=\"customControl\">\n\
    <file name=\"style.css\">\n\
      [contenteditable] {\n\
        border: 1px solid black;\n\
        background-color: white;\n\
        min-height: 20px;\n\
      }\n\
\n\
      .ng-invalid {\n\
        border: 1px solid red;\n\
      }\n\
\n\
    </file>\n\
    <file name=\"script.js\">\n\
      angular.module('customControl', []).\n\
        directive('contenteditable', function() {\n\
          return {\n\
            restrict: 'A', // only activate on element attribute\n\
            require: '?ngModel', // get a hold of NgModelController\n\
            link: function(scope, element, attrs, ngModel) {\n\
              if(!ngModel) return; // do nothing if no ng-model\n\
\n\
              // Specify how UI should be updated\n\
              ngModel.$render = function() {\n\
                element.html(ngModel.$viewValue || '');\n\
              };\n\
\n\
              // Listen for change events to enable binding\n\
              element.bind('blur keyup change', function() {\n\
                scope.$apply(read);\n\
              });\n\
              read(); // initialize\n\
\n\
              // Write data to the model\n\
              function read() {\n\
                ngModel.$setViewValue(element.html());\n\
              }\n\
            }\n\
          };\n\
        });\n\
    </file>\n\
    <file name=\"index.html\">\n\
      <form name=\"myForm\">\n\
       <div contenteditable\n\
            name=\"myWidget\" ng-model=\"userContent\"\n\
            required>Change me!</div>\n\
        <span ng-show=\"myForm.myWidget.$error.required\">Required!</span>\n\
       <hr>\n\
       <textarea ng-model=\"userContent\"></textarea>\n\
      </form>\n\
    </file>\n\
    <file name=\"scenario.js\">\n\
      it('should data-bind and become invalid', function() {\n\
        var contentEditable = element('[contenteditable]');\n\
\n\
        expect(contentEditable.text()).toEqual('Change me!');\n\
        input('userContent').enter('');\n\
        expect(contentEditable.text()).toEqual('');\n\
        expect(contentEditable.prop('className')).toMatch(/ng-invalid-required/);\n\
      });\n\
    </file>\n\
 * </example>\n\
 *\n\
 */\n\
var NgModelController = ['$scope', '$exceptionHandler', '$attrs', '$element', '$parse',\n\
    function($scope, $exceptionHandler, $attr, $element, $parse) {\n\
  this.$viewValue = Number.NaN;\n\
  this.$modelValue = Number.NaN;\n\
  this.$parsers = [];\n\
  this.$formatters = [];\n\
  this.$viewChangeListeners = [];\n\
  this.$pristine = true;\n\
  this.$dirty = false;\n\
  this.$valid = true;\n\
  this.$invalid = false;\n\
  this.$name = $attr.name;\n\
\n\
  var ngModelGet = $parse($attr.ngModel),\n\
      ngModelSet = ngModelGet.assign;\n\
\n\
  if (!ngModelSet) {\n\
    throw Error(NON_ASSIGNABLE_MODEL_EXPRESSION + $attr.ngModel +\n\
        ' (' + startingTag($element) + ')');\n\
  }\n\
\n\
  /**\n\
   * @ngdoc function\n\
   * @name ng.directive:ngModel.NgModelController#$render\n\
   * @methodOf ng.directive:ngModel.NgModelController\n\
   *\n\
   * @description\n\
   * Called when the view needs to be updated. It is expected that the user of the ng-model\n\
   * directive will implement this method.\n\
   */\n\
  this.$render = noop;\n\
\n\
  var parentForm = $element.inheritedData('$formController') || nullFormCtrl,\n\
      invalidCount = 0, // used to easily determine if we are valid\n\
      $error = this.$error = {}; // keep invalid keys here\n\
\n\
\n\
  // Setup initial state of the control\n\
  $element.addClass(PRISTINE_CLASS);\n\
  toggleValidCss(true);\n\
\n\
  // convenience method for easy toggling of classes\n\
  function toggleValidCss(isValid, validationErrorKey) {\n\
    validationErrorKey = validationErrorKey ? '-' + snake_case(validationErrorKey, '-') : '';\n\
    $element.\n\
      removeClass((isValid ? INVALID_CLASS : VALID_CLASS) + validationErrorKey).\n\
      addClass((isValid ? VALID_CLASS : INVALID_CLASS) + validationErrorKey);\n\
  }\n\
\n\
  /**\n\
   * @ngdoc function\n\
   * @name ng.directive:ngModel.NgModelController#$setValidity\n\
   * @methodOf ng.directive:ngModel.NgModelController\n\
   *\n\
   * @description\n\
   * Change the validity state, and notifies the form when the control changes validity. (i.e. it\n\
   * does not notify form if given validator is already marked as invalid).\n\
   *\n\
   * This method should be called by validators - i.e. the parser or formatter functions.\n\
   *\n\
   * @param {string} validationErrorKey Name of the validator. the `validationErrorKey` will assign\n\
   *        to `$error[validationErrorKey]=isValid` so that it is available for data-binding.\n\
   *        The `validationErrorKey` should be in camelCase and will get converted into dash-case\n\
   *        for class name. Example: `myError` will result in `ng-valid-my-error` and `ng-invalid-my-error`\n\
   *        class and can be bound to as  `{{someForm.someControl.$error.myError}}` .\n\
   * @param {boolean} isValid Whether the current state is valid (true) or invalid (false).\n\
   */\n\
  this.$setValidity = function(validationErrorKey, isValid) {\n\
    if ($error[validationErrorKey] === !isValid) return;\n\
\n\
    if (isValid) {\n\
      if ($error[validationErrorKey]) invalidCount--;\n\
      if (!invalidCount) {\n\
        toggleValidCss(true);\n\
        this.$valid = true;\n\
        this.$invalid = false;\n\
      }\n\
    } else {\n\
      toggleValidCss(false);\n\
      this.$invalid = true;\n\
      this.$valid = false;\n\
      invalidCount++;\n\
    }\n\
\n\
    $error[validationErrorKey] = !isValid;\n\
    toggleValidCss(isValid, validationErrorKey);\n\
\n\
    parentForm.$setValidity(validationErrorKey, isValid, this);\n\
  };\n\
\n\
  /**\n\
   * @ngdoc function\n\
   * @name ng.directive:ngModel.NgModelController#$setPristine\n\
   * @methodOf ng.directive:ngModel.NgModelController\n\
   *\n\
   * @description\n\
   * Sets the control to its pristine state.\n\
   *\n\
   * This method can be called to remove the 'ng-dirty' class and set the control to its pristine\n\
   * state (ng-pristine class).\n\
   */\n\
  this.$setPristine = function () {\n\
    this.$dirty = false;\n\
    this.$pristine = true;\n\
    $element.removeClass(DIRTY_CLASS).addClass(PRISTINE_CLASS);\n\
  };\n\
\n\
  /**\n\
   * @ngdoc function\n\
   * @name ng.directive:ngModel.NgModelController#$setViewValue\n\
   * @methodOf ng.directive:ngModel.NgModelController\n\
   *\n\
   * @description\n\
   * Read a value from view.\n\
   *\n\
   * This method should be called from within a DOM event handler.\n\
   * For example {@link ng.directive:input input} or\n\
   * {@link ng.directive:select select} directives call it.\n\
   *\n\
   * It internally calls all `parsers` and if resulted value is valid, updates the model and\n\
   * calls all registered change listeners.\n\
   *\n\
   * @param {string} value Value from the view.\n\
   */\n\
  this.$setViewValue = function(value) {\n\
    this.$viewValue = value;\n\
\n\
    // change to dirty\n\
    if (this.$pristine) {\n\
      this.$dirty = true;\n\
      this.$pristine = false;\n\
      $element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS);\n\
      parentForm.$setDirty();\n\
    }\n\
\n\
    forEach(this.$parsers, function(fn) {\n\
      value = fn(value);\n\
    });\n\
\n\
    if (this.$modelValue !== value) {\n\
      this.$modelValue = value;\n\
      ngModelSet($scope, value);\n\
      forEach(this.$viewChangeListeners, function(listener) {\n\
        try {\n\
          listener();\n\
        } catch(e) {\n\
          $exceptionHandler(e);\n\
        }\n\
      })\n\
    }\n\
  };\n\
\n\
  // model -> value\n\
  var ctrl = this;\n\
\n\
  $scope.$watch(function ngModelWatch() {\n\
    var value = ngModelGet($scope);\n\
\n\
    // if scope model value and ngModel value are out of sync\n\
    if (ctrl.$modelValue !== value) {\n\
\n\
      var formatters = ctrl.$formatters,\n\
          idx = formatters.length;\n\
\n\
      ctrl.$modelValue = value;\n\
      while(idx--) {\n\
        value = formatters[idx](value);\n\
      }\n\
\n\
      if (ctrl.$viewValue !== value) {\n\
        ctrl.$viewValue = value;\n\
        ctrl.$render();\n\
      }\n\
    }\n\
  });\n\
}];\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngModel\n\
 *\n\
 * @element input\n\
 *\n\
 * @description\n\
 * Is directive that tells Angular to do two-way data binding. It works together with `input`,\n\
 * `select`, `textarea`. You can easily write your own directives to use `ngModel` as well.\n\
 *\n\
 * `ngModel` is responsible for:\n\
 *\n\
 * - binding the view into the model, which other directives such as `input`, `textarea` or `select`\n\
 *   require,\n\
 * - providing validation behavior (i.e. required, number, email, url),\n\
 * - keeping state of the control (valid/invalid, dirty/pristine, validation errors),\n\
 * - setting related css class onto the element (`ng-valid`, `ng-invalid`, `ng-dirty`, `ng-pristine`),\n\
 * - register the control with parent {@link ng.directive:form form}.\n\
 *\n\
 * For basic examples, how to use `ngModel`, see:\n\
 *\n\
 *  - {@link ng.directive:input input}\n\
 *    - {@link ng.directive:input.text text}\n\
 *    - {@link ng.directive:input.checkbox checkbox}\n\
 *    - {@link ng.directive:input.radio radio}\n\
 *    - {@link ng.directive:input.number number}\n\
 *    - {@link ng.directive:input.email email}\n\
 *    - {@link ng.directive:input.url url}\n\
 *  - {@link ng.directive:select select}\n\
 *  - {@link ng.directive:textarea textarea}\n\
 *\n\
 */\n\
var ngModelDirective = function() {\n\
  return {\n\
    require: ['ngModel', '^?form'],\n\
    controller: NgModelController,\n\
    link: function(scope, element, attr, ctrls) {\n\
      // notify others, especially parent forms\n\
\n\
      var modelCtrl = ctrls[0],\n\
          formCtrl = ctrls[1] || nullFormCtrl;\n\
\n\
      formCtrl.$addControl(modelCtrl);\n\
\n\
      element.bind('$destroy', function() {\n\
        formCtrl.$removeControl(modelCtrl);\n\
      });\n\
    }\n\
  };\n\
};\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngChange\n\
 * @restrict E\n\
 *\n\
 * @description\n\
 * Evaluate given expression when user changes the input.\n\
 * The expression is not evaluated when the value change is coming from the model.\n\
 *\n\
 * Note, this directive requires `ngModel` to be present.\n\
 *\n\
 * @element input\n\
 *\n\
 * @example\n\
 * <doc:example>\n\
 *   <doc:source>\n\
 *     <script>\n\
 *       function Controller($scope) {\n\
 *         $scope.counter = 0;\n\
 *         $scope.change = function() {\n\
 *           $scope.counter++;\n\
 *         };\n\
 *       }\n\
 *     </script>\n\
 *     <div ng-controller=\"Controller\">\n\
 *       <input type=\"checkbox\" ng-model=\"confirmed\" ng-change=\"change()\" id=\"ng-change-example1\" />\n\
 *       <input type=\"checkbox\" ng-model=\"confirmed\" id=\"ng-change-example2\" />\n\
 *       <label for=\"ng-change-example2\">Confirmed</label><br />\n\
 *       debug = {{confirmed}}<br />\n\
 *       counter = {{counter}}\n\
 *     </div>\n\
 *   </doc:source>\n\
 *   <doc:scenario>\n\
 *     it('should evaluate the expression if changing from view', function() {\n\
 *       expect(binding('counter')).toEqual('0');\n\
 *       element('#ng-change-example1').click();\n\
 *       expect(binding('counter')).toEqual('1');\n\
 *       expect(binding('confirmed')).toEqual('true');\n\
 *     });\n\
 *\n\
 *     it('should not evaluate the expression if changing from model', function() {\n\
 *       element('#ng-change-example2').click();\n\
 *       expect(binding('counter')).toEqual('0');\n\
 *       expect(binding('confirmed')).toEqual('true');\n\
 *     });\n\
 *   </doc:scenario>\n\
 * </doc:example>\n\
 */\n\
var ngChangeDirective = valueFn({\n\
  require: 'ngModel',\n\
  link: function(scope, element, attr, ctrl) {\n\
    ctrl.$viewChangeListeners.push(function() {\n\
      scope.$eval(attr.ngChange);\n\
    });\n\
  }\n\
});\n\
\n\
\n\
var requiredDirective = function() {\n\
  return {\n\
    require: '?ngModel',\n\
    link: function(scope, elm, attr, ctrl) {\n\
      if (!ctrl) return;\n\
      attr.required = true; // force truthy in case we are on non input element\n\
\n\
      var validator = function(value) {\n\
        if (attr.required && (isEmpty(value) || value === false)) {\n\
          ctrl.$setValidity('required', false);\n\
          return;\n\
        } else {\n\
          ctrl.$setValidity('required', true);\n\
          return value;\n\
        }\n\
      };\n\
\n\
      ctrl.$formatters.push(validator);\n\
      ctrl.$parsers.unshift(validator);\n\
\n\
      attr.$observe('required', function() {\n\
        validator(ctrl.$viewValue);\n\
      });\n\
    }\n\
  };\n\
};\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngList\n\
 *\n\
 * @description\n\
 * Text input that converts between comma-separated string into an array of strings.\n\
 *\n\
 * @element input\n\
 * @param {string=} ngList optional delimiter that should be used to split the value. If\n\
 *   specified in form `/something/` then the value will be converted into a regular expression.\n\
 *\n\
 * @example\n\
    <doc:example>\n\
      <doc:source>\n\
       <script>\n\
         function Ctrl($scope) {\n\
           $scope.names = ['igor', 'misko', 'vojta'];\n\
         }\n\
       </script>\n\
       <form name=\"myForm\" ng-controller=\"Ctrl\">\n\
         List: <input name=\"namesInput\" ng-model=\"names\" ng-list required>\n\
         <span class=\"error\" ng-show=\"myForm.list.$error.required\">\n\
           Required!</span>\n\
         <tt>names = {{names}}</tt><br/>\n\
         <tt>myForm.namesInput.$valid = {{myForm.namesInput.$valid}}</tt><br/>\n\
         <tt>myForm.namesInput.$error = {{myForm.namesInput.$error}}</tt><br/>\n\
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>\n\
         <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>\n\
        </form>\n\
      </doc:source>\n\
      <doc:scenario>\n\
        it('should initialize to model', function() {\n\
          expect(binding('names')).toEqual('[\"igor\",\"misko\",\"vojta\"]');\n\
          expect(binding('myForm.namesInput.$valid')).toEqual('true');\n\
        });\n\
\n\
        it('should be invalid if empty', function() {\n\
          input('names').enter('');\n\
          expect(binding('names')).toEqual('[]');\n\
          expect(binding('myForm.namesInput.$valid')).toEqual('false');\n\
        });\n\
      </doc:scenario>\n\
    </doc:example>\n\
 */\n\
var ngListDirective = function() {\n\
  return {\n\
    require: 'ngModel',\n\
    link: function(scope, element, attr, ctrl) {\n\
      var match = /\\/(.*)\\//.exec(attr.ngList),\n\
          separator = match && new RegExp(match[1]) || attr.ngList || ',';\n\
\n\
      var parse = function(viewValue) {\n\
        var list = [];\n\
\n\
        if (viewValue) {\n\
          forEach(viewValue.split(separator), function(value) {\n\
            if (value) list.push(trim(value));\n\
          });\n\
        }\n\
\n\
        return list;\n\
      };\n\
\n\
      ctrl.$parsers.push(parse);\n\
      ctrl.$formatters.push(function(value) {\n\
        if (isArray(value)) {\n\
          return value.join(', ');\n\
        }\n\
\n\
        return undefined;\n\
      });\n\
    }\n\
  };\n\
};\n\
\n\
\n\
var CONSTANT_VALUE_REGEXP = /^(true|false|\\d+)$/;\n\
\n\
var ngValueDirective = function() {\n\
  return {\n\
    priority: 100,\n\
    compile: function(tpl, tplAttr) {\n\
      if (CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue)) {\n\
        return function(scope, elm, attr) {\n\
          attr.$set('value', scope.$eval(attr.ngValue));\n\
        };\n\
      } else {\n\
        return function(scope, elm, attr) {\n\
          scope.$watch(attr.ngValue, function valueWatchAction(value) {\n\
            attr.$set('value', value, false);\n\
          });\n\
        };\n\
      }\n\
    }\n\
  };\n\
};\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngBind\n\
 *\n\
 * @description\n\
 * The `ngBind` attribute tells Angular to replace the text content of the specified HTML element\n\
 * with the value of a given expression, and to update the text content when the value of that\n\
 * expression changes.\n\
 *\n\
 * Typically, you don't use `ngBind` directly, but instead you use the double curly markup like\n\
 * `{{ expression }}` which is similar but less verbose.\n\
 *\n\
 * One scenario in which the use of `ngBind` is preferred over `{{ expression }}` binding is when\n\
 * it's desirable to put bindings into template that is momentarily displayed by the browser in its\n\
 * raw state before Angular compiles it. Since `ngBind` is an element attribute, it makes the\n\
 * bindings invisible to the user while the page is loading.\n\
 *\n\
 * An alternative solution to this problem would be using the\n\
 * {@link ng.directive:ngCloak ngCloak} directive.\n\
 *\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngBind {@link guide/expression Expression} to evaluate.\n\
 *\n\
 * @example\n\
 * Enter a name in the Live Preview text box; the greeting below the text box changes instantly.\n\
   <doc:example>\n\
     <doc:source>\n\
       <script>\n\
         function Ctrl($scope) {\n\
           $scope.name = 'Whirled';\n\
         }\n\
       </script>\n\
       <div ng-controller=\"Ctrl\">\n\
         Enter name: <input type=\"text\" ng-model=\"name\"><br>\n\
         Hello <span ng-bind=\"name\"></span>!\n\
       </div>\n\
     </doc:source>\n\
     <doc:scenario>\n\
       it('should check ng-bind', function() {\n\
         expect(using('.doc-example-live').binding('name')).toBe('Whirled');\n\
         using('.doc-example-live').input('name').enter('world');\n\
         expect(using('.doc-example-live').binding('name')).toBe('world');\n\
       });\n\
     </doc:scenario>\n\
   </doc:example>\n\
 */\n\
var ngBindDirective = ngDirective(function(scope, element, attr) {\n\
  element.addClass('ng-binding').data('$binding', attr.ngBind);\n\
  scope.$watch(attr.ngBind, function ngBindWatchAction(value) {\n\
    element.text(value == undefined ? '' : value);\n\
  });\n\
});\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngBindTemplate\n\
 *\n\
 * @description\n\
 * The `ngBindTemplate` directive specifies that the element\n\
 * text should be replaced with the template in ngBindTemplate.\n\
 * Unlike ngBind the ngBindTemplate can contain multiple `{{` `}}`\n\
 * expressions. (This is required since some HTML elements\n\
 * can not have SPAN elements such as TITLE, or OPTION to name a few.)\n\
 *\n\
 * @element ANY\n\
 * @param {string} ngBindTemplate template of form\n\
 *   <tt>{{</tt> <tt>expression</tt> <tt>}}</tt> to eval.\n\
 *\n\
 * @example\n\
 * Try it here: enter text in text box and watch the greeting change.\n\
   <doc:example>\n\
     <doc:source>\n\
       <script>\n\
         function Ctrl($scope) {\n\
           $scope.salutation = 'Hello';\n\
           $scope.name = 'World';\n\
         }\n\
       </script>\n\
       <div ng-controller=\"Ctrl\">\n\
        Salutation: <input type=\"text\" ng-model=\"salutation\"><br>\n\
        Name: <input type=\"text\" ng-model=\"name\"><br>\n\
        <pre ng-bind-template=\"{{salutation}} {{name}}!\"></pre>\n\
       </div>\n\
     </doc:source>\n\
     <doc:scenario>\n\
       it('should check ng-bind', function() {\n\
         expect(using('.doc-example-live').binding('salutation')).\n\
           toBe('Hello');\n\
         expect(using('.doc-example-live').binding('name')).\n\
           toBe('World');\n\
         using('.doc-example-live').input('salutation').enter('Greetings');\n\
         using('.doc-example-live').input('name').enter('user');\n\
         expect(using('.doc-example-live').binding('salutation')).\n\
           toBe('Greetings');\n\
         expect(using('.doc-example-live').binding('name')).\n\
           toBe('user');\n\
       });\n\
     </doc:scenario>\n\
   </doc:example>\n\
 */\n\
var ngBindTemplateDirective = ['$interpolate', function($interpolate) {\n\
  return function(scope, element, attr) {\n\
    // TODO: move this to scenario runner\n\
    var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));\n\
    element.addClass('ng-binding').data('$binding', interpolateFn);\n\
    attr.$observe('ngBindTemplate', function(value) {\n\
      element.text(value);\n\
    });\n\
  }\n\
}];\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngBindHtmlUnsafe\n\
 *\n\
 * @description\n\
 * Creates a binding that will innerHTML the result of evaluating the `expression` into the current\n\
 * element. *The innerHTML-ed content will not be sanitized!* You should use this directive only if\n\
 * {@link ngSanitize.directive:ngBindHtml ngBindHtml} directive is too\n\
 * restrictive and when you absolutely trust the source of the content you are binding to.\n\
 *\n\
 * See {@link ngSanitize.$sanitize $sanitize} docs for examples.\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngBindHtmlUnsafe {@link guide/expression Expression} to evaluate.\n\
 */\n\
var ngBindHtmlUnsafeDirective = [function() {\n\
  return function(scope, element, attr) {\n\
    element.addClass('ng-binding').data('$binding', attr.ngBindHtmlUnsafe);\n\
    scope.$watch(attr.ngBindHtmlUnsafe, function ngBindHtmlUnsafeWatchAction(value) {\n\
      element.html(value || '');\n\
    });\n\
  };\n\
}];\n\
\n\
function classDirective(name, selector) {\n\
  name = 'ngClass' + name;\n\
  return ngDirective(function(scope, element, attr) {\n\
    var oldVal = undefined;\n\
\n\
    scope.$watch(attr[name], ngClassWatchAction, true);\n\
\n\
    attr.$observe('class', function(value) {\n\
      var ngClass = scope.$eval(attr[name]);\n\
      ngClassWatchAction(ngClass, ngClass);\n\
    });\n\
\n\
\n\
    if (name !== 'ngClass') {\n\
      scope.$watch('$index', function($index, old$index) {\n\
        var mod = $index & 1;\n\
        if (mod !== old$index & 1) {\n\
          if (mod === selector) {\n\
            addClass(scope.$eval(attr[name]));\n\
          } else {\n\
            removeClass(scope.$eval(attr[name]));\n\
          }\n\
        }\n\
      });\n\
    }\n\
\n\
\n\
    function ngClassWatchAction(newVal) {\n\
      if (selector === true || scope.$index % 2 === selector) {\n\
        if (oldVal && !equals(newVal,oldVal)) {\n\
          removeClass(oldVal);\n\
        }\n\
        addClass(newVal);\n\
      }\n\
      oldVal = copy(newVal);\n\
    }\n\
\n\
\n\
    function removeClass(classVal) {\n\
      if (isObject(classVal) && !isArray(classVal)) {\n\
        classVal = map(classVal, function(v, k) { if (v) return k });\n\
      }\n\
      element.removeClass(isArray(classVal) ? classVal.join(' ') : classVal);\n\
    }\n\
\n\
\n\
    function addClass(classVal) {\n\
      if (isObject(classVal) && !isArray(classVal)) {\n\
        classVal = map(classVal, function(v, k) { if (v) return k });\n\
      }\n\
      if (classVal) {\n\
        element.addClass(isArray(classVal) ? classVal.join(' ') : classVal);\n\
      }\n\
    }\n\
  });\n\
}\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngClass\n\
 *\n\
 * @description\n\
 * The `ngClass` allows you to set CSS class on HTML element dynamically by databinding an\n\
 * expression that represents all classes to be added.\n\
 *\n\
 * The directive won't add duplicate classes if a particular class was already set.\n\
 *\n\
 * When the expression changes, the previously added classes are removed and only then the\n\
 * new classes are added.\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngClass {@link guide/expression Expression} to eval. The result\n\
 *   of the evaluation can be a string representing space delimited class\n\
 *   names, an array, or a map of class names to boolean values.\n\
 *\n\
 * @example\n\
   <example>\n\
     <file name=\"index.html\">\n\
      <input type=\"button\" value=\"set\" ng-click=\"myVar='my-class'\">\n\
      <input type=\"button\" value=\"clear\" ng-click=\"myVar=''\">\n\
      <br>\n\
      <span ng-class=\"myVar\">Sample Text</span>\n\
     </file>\n\
     <file name=\"style.css\">\n\
       .my-class {\n\
         color: red;\n\
       }\n\
     </file>\n\
     <file name=\"scenario.js\">\n\
       it('should check ng-class', function() {\n\
         expect(element('.doc-example-live span').prop('className')).not().\n\
           toMatch(/my-class/);\n\
\n\
         using('.doc-example-live').element(':button:first').click();\n\
\n\
         expect(element('.doc-example-live span').prop('className')).\n\
           toMatch(/my-class/);\n\
\n\
         using('.doc-example-live').element(':button:last').click();\n\
\n\
         expect(element('.doc-example-live span').prop('className')).not().\n\
           toMatch(/my-class/);\n\
       });\n\
     </file>\n\
   </example>\n\
 */\n\
var ngClassDirective = classDirective('', true);\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngClassOdd\n\
 *\n\
 * @description\n\
 * The `ngClassOdd` and `ngClassEven` directives work exactly as\n\
 * {@link ng.directive:ngClass ngClass}, except it works in\n\
 * conjunction with `ngRepeat` and takes affect only on odd (even) rows.\n\
 *\n\
 * This directive can be applied only within a scope of an\n\
 * {@link ng.directive:ngRepeat ngRepeat}.\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngClassOdd {@link guide/expression Expression} to eval. The result\n\
 *   of the evaluation can be a string representing space delimited class names or an array.\n\
 *\n\
 * @example\n\
   <example>\n\
     <file name=\"index.html\">\n\
        <ol ng-init=\"names=['John', 'Mary', 'Cate', 'Suz']\">\n\
          <li ng-repeat=\"name in names\">\n\
           <span ng-class-odd=\"'odd'\" ng-class-even=\"'even'\">\n\
             {{name}}\n\
           </span>\n\
          </li>\n\
        </ol>\n\
     </file>\n\
     <file name=\"style.css\">\n\
       .odd {\n\
         color: red;\n\
       }\n\
       .even {\n\
         color: blue;\n\
       }\n\
     </file>\n\
     <file name=\"scenario.js\">\n\
       it('should check ng-class-odd and ng-class-even', function() {\n\
         expect(element('.doc-example-live li:first span').prop('className')).\n\
           toMatch(/odd/);\n\
         expect(element('.doc-example-live li:last span').prop('className')).\n\
           toMatch(/even/);\n\
       });\n\
     </file>\n\
   </example>\n\
 */\n\
var ngClassOddDirective = classDirective('Odd', 0);\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngClassEven\n\
 *\n\
 * @description\n\
 * The `ngClassOdd` and `ngClassEven` directives work exactly as\n\
 * {@link ng.directive:ngClass ngClass}, except it works in\n\
 * conjunction with `ngRepeat` and takes affect only on odd (even) rows.\n\
 *\n\
 * This directive can be applied only within a scope of an\n\
 * {@link ng.directive:ngRepeat ngRepeat}.\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngClassEven {@link guide/expression Expression} to eval. The\n\
 *   result of the evaluation can be a string representing space delimited class names or an array.\n\
 *\n\
 * @example\n\
   <example>\n\
     <file name=\"index.html\">\n\
        <ol ng-init=\"names=['John', 'Mary', 'Cate', 'Suz']\">\n\
          <li ng-repeat=\"name in names\">\n\
           <span ng-class-odd=\"'odd'\" ng-class-even=\"'even'\">\n\
             {{name}} &nbsp; &nbsp; &nbsp;\n\
           </span>\n\
          </li>\n\
        </ol>\n\
     </file>\n\
     <file name=\"style.css\">\n\
       .odd {\n\
         color: red;\n\
       }\n\
       .even {\n\
         color: blue;\n\
       }\n\
     </file>\n\
     <file name=\"scenario.js\">\n\
       it('should check ng-class-odd and ng-class-even', function() {\n\
         expect(element('.doc-example-live li:first span').prop('className')).\n\
           toMatch(/odd/);\n\
         expect(element('.doc-example-live li:last span').prop('className')).\n\
           toMatch(/even/);\n\
       });\n\
     </file>\n\
   </example>\n\
 */\n\
var ngClassEvenDirective = classDirective('Even', 1);\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngCloak\n\
 *\n\
 * @description\n\
 * The `ngCloak` directive is used to prevent the Angular html template from being briefly\n\
 * displayed by the browser in its raw (uncompiled) form while your application is loading. Use this\n\
 * directive to avoid the undesirable flicker effect caused by the html template display.\n\
 *\n\
 * The directive can be applied to the `<body>` element, but typically a fine-grained application is\n\
 * preferred in order to benefit from progressive rendering of the browser view.\n\
 *\n\
 * `ngCloak` works in cooperation with a css rule that is embedded within `angular.js` and\n\
 *  `angular.min.js` files. Following is the css rule:\n\
 *\n\
 * <pre>\n\
 * [ng\\:cloak], [ng-cloak], [data-ng-cloak], [x-ng-cloak], .ng-cloak, .x-ng-cloak {\n\
 *   display: none;\n\
 * }\n\
 * </pre>\n\
 *\n\
 * When this css rule is loaded by the browser, all html elements (including their children) that\n\
 * are tagged with the `ng-cloak` directive are hidden. When Angular comes across this directive\n\
 * during the compilation of the template it deletes the `ngCloak` element attribute, which\n\
 * makes the compiled element visible.\n\
 *\n\
 * For the best result, `angular.js` script must be loaded in the head section of the html file;\n\
 * alternatively, the css rule (above) must be included in the external stylesheet of the\n\
 * application.\n\
 *\n\
 * Legacy browsers, like IE7, do not provide attribute selector support (added in CSS 2.1) so they\n\
 * cannot match the `[ng\\:cloak]` selector. To work around this limitation, you must add the css\n\
 * class `ngCloak` in addition to `ngCloak` directive as shown in the example below.\n\
 *\n\
 * @element ANY\n\
 *\n\
 * @example\n\
   <doc:example>\n\
     <doc:source>\n\
        <div id=\"template1\" ng-cloak>{{ 'hello' }}</div>\n\
        <div id=\"template2\" ng-cloak class=\"ng-cloak\">{{ 'hello IE7' }}</div>\n\
     </doc:source>\n\
     <doc:scenario>\n\
       it('should remove the template directive and css class', function() {\n\
         expect(element('.doc-example-live #template1').attr('ng-cloak')).\n\
           not().toBeDefined();\n\
         expect(element('.doc-example-live #template2').attr('ng-cloak')).\n\
           not().toBeDefined();\n\
       });\n\
     </doc:scenario>\n\
   </doc:example>\n\
 *\n\
 */\n\
var ngCloakDirective = ngDirective({\n\
  compile: function(element, attr) {\n\
    attr.$set('ngCloak', undefined);\n\
    element.removeClass('ng-cloak');\n\
  }\n\
});\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngController\n\
 *\n\
 * @description\n\
 * The `ngController` directive assigns behavior to a scope. This is a key aspect of how angular\n\
 * supports the principles behind the Model-View-Controller design pattern.\n\
 *\n\
 * MVC components in angular:\n\
 *\n\
 * * Model â€” The Model is data in scope properties; scopes are attached to the DOM.\n\
 * * View â€” The template (HTML with data bindings) is rendered into the View.\n\
 * * Controller â€” The `ngController` directive specifies a Controller class; the class has\n\
 *   methods that typically express the business logic behind the application.\n\
 *\n\
 * Note that an alternative way to define controllers is via the {@link ng.$route $route} service.\n\
 *\n\
 * @element ANY\n\
 * @scope\n\
 * @param {expression} ngController Name of a globally accessible constructor function or an\n\
 *     {@link guide/expression expression} that on the current scope evaluates to a\n\
 *     constructor function. The controller instance can further be published into the scope\n\
 *     by adding `as localName` the controller name attribute.\n\
 *\n\
 * @example\n\
 * Here is a simple form for editing user contact information. Adding, removing, clearing, and\n\
 * greeting are methods declared on the controller (see source tab). These methods can\n\
 * easily be called from the angular markup. Notice that the scope becomes the `this` for the\n\
 * controller's instance. This allows for easy access to the view data from the controller. Also\n\
 * notice that any changes to the data are automatically reflected in the View without the need\n\
 * for a manual update. The example is included in two different declaration styles based on\n\
 * your style preferences.\n\
   <doc:example>\n\
     <doc:source>\n\
      <script>\n\
        function SettingsController() {\n\
          this.name = \"John Smith\";\n\
          this.contacts = [\n\
            {type: 'phone', value: '408 555 1212'},\n\
            {type: 'email', value: 'john.smith@example.org'} ];\n\
          };\n\
\n\
        SettingsController.prototype.greet = function() {\n\
          alert(this.name);\n\
        };\n\
\n\
        SettingsController.prototype.addContact = function() {\n\
          this.contacts.push({type: 'email', value: 'yourname@example.org'});\n\
        };\n\
\n\
        SettingsController.prototype.removeContact = function(contactToRemove) {\n\
         var index = this.contacts.indexOf(contactToRemove);\n\
          this.contacts.splice(index, 1);\n\
        };\n\
\n\
        SettingsController.prototype.clearContact = function(contact) {\n\
          contact.type = 'phone';\n\
          contact.value = '';\n\
        };\n\
      </script>\n\
      <div ng-controller=\"SettingsController as settings\">\n\
        Name: <input type=\"text\" ng-model=\"settings.name\"/>\n\
        [ <a href=\"\" ng-click=\"settings.greet()\">greet</a> ]<br/>\n\
        Contact:\n\
        <ul>\n\
          <li ng-repeat=\"contact in settings.contacts\">\n\
            <select ng-model=\"contact.type\">\n\
               <option>phone</option>\n\
               <option>email</option>\n\
            </select>\n\
            <input type=\"text\" ng-model=\"contact.value\"/>\n\
            [ <a href=\"\" ng-click=\"settings.clearContact(contact)\">clear</a>\n\
            | <a href=\"\" ng-click=\"settings.removeContact(contact)\">X</a> ]\n\
          </li>\n\
          <li>[ <a href=\"\" ng-click=\"settings.addContact()\">add</a> ]</li>\n\
       </ul>\n\
      </div>\n\
     </doc:source>\n\
     <doc:scenario>\n\
       it('should check controller', function() {\n\
         expect(element('.doc-example-live div>:input').val()).toBe('John Smith');\n\
         expect(element('.doc-example-live li:nth-child(1) input').val())\n\
           .toBe('408 555 1212');\n\
         expect(element('.doc-example-live li:nth-child(2) input').val())\n\
           .toBe('john.smith@example.org');\n\
\n\
         element('.doc-example-live li:first a:contains(\"clear\")').click();\n\
         expect(element('.doc-example-live li:first input').val()).toBe('');\n\
\n\
         element('.doc-example-live li:last a:contains(\"add\")').click();\n\
         expect(element('.doc-example-live li:nth-child(3) input').val())\n\
           .toBe('yourname@example.org');\n\
       });\n\
     </doc:scenario>\n\
   </doc:example>\n\
\n\
\n\
\n\
    <doc:example>\n\
     <doc:source>\n\
      <script>\n\
        function SettingsController($scope) {\n\
          $scope.name = \"John Smith\";\n\
          $scope.contacts = [\n\
            {type:'phone', value:'408 555 1212'},\n\
            {type:'email', value:'john.smith@example.org'} ];\n\
\n\
          $scope.greet = function() {\n\
           alert(this.name);\n\
          };\n\
\n\
          $scope.addContact = function() {\n\
           this.contacts.push({type:'email', value:'yourname@example.org'});\n\
          };\n\
\n\
          $scope.removeContact = function(contactToRemove) {\n\
           var index = this.contacts.indexOf(contactToRemove);\n\
           this.contacts.splice(index, 1);\n\
          };\n\
\n\
          $scope.clearContact = function(contact) {\n\
           contact.type = 'phone';\n\
           contact.value = '';\n\
          };\n\
        }\n\
      </script>\n\
      <div ng-controller=\"SettingsController\">\n\
        Name: <input type=\"text\" ng-model=\"name\"/>\n\
        [ <a href=\"\" ng-click=\"greet()\">greet</a> ]<br/>\n\
        Contact:\n\
        <ul>\n\
          <li ng-repeat=\"contact in contacts\">\n\
            <select ng-model=\"contact.type\">\n\
               <option>phone</option>\n\
               <option>email</option>\n\
            </select>\n\
            <input type=\"text\" ng-model=\"contact.value\"/>\n\
            [ <a href=\"\" ng-click=\"clearContact(contact)\">clear</a>\n\
            | <a href=\"\" ng-click=\"removeContact(contact)\">X</a> ]\n\
          </li>\n\
          <li>[ <a href=\"\" ng-click=\"addContact()\">add</a> ]</li>\n\
       </ul>\n\
      </div>\n\
     </doc:source>\n\
     <doc:scenario>\n\
       it('should check controller', function() {\n\
         expect(element('.doc-example-live div>:input').val()).toBe('John Smith');\n\
         expect(element('.doc-example-live li:nth-child(1) input').val())\n\
           .toBe('408 555 1212');\n\
         expect(element('.doc-example-live li:nth-child(2) input').val())\n\
           .toBe('john.smith@example.org');\n\
\n\
         element('.doc-example-live li:first a:contains(\"clear\")').click();\n\
         expect(element('.doc-example-live li:first input').val()).toBe('');\n\
\n\
         element('.doc-example-live li:last a:contains(\"add\")').click();\n\
         expect(element('.doc-example-live li:nth-child(3) input').val())\n\
           .toBe('yourname@example.org');\n\
       });\n\
     </doc:scenario>\n\
   </doc:example>\n\
\n\
 */\n\
var ngControllerDirective = [function() {\n\
  return {\n\
    scope: true,\n\
    controller: '@'\n\
  };\n\
}];\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngCsp\n\
 * @priority 1000\n\
 *\n\
 * @element html\n\
 * @description\n\
 * Enables [CSP (Content Security Policy)](https://developer.mozilla.org/en/Security/CSP) support.\n\
 * \n\
 * This is necessary when developing things like Google Chrome Extensions.\n\
 * \n\
 * CSP forbids apps to use `eval` or `Function(string)` generated functions (among other things).\n\
 * For us to be compatible, we just need to implement the \"getterFn\" in $parse without violating\n\
 * any of these restrictions.\n\
 * \n\
 * AngularJS uses `Function(string)` generated functions as a speed optimization. By applying `ngCsp`\n\
 * it is be possible to opt into the CSP compatible mode. When this mode is on AngularJS will\n\
 * evaluate all expressions up to 30% slower than in non-CSP mode, but no security violations will\n\
 * be raised.\n\
 * \n\
 * In order to use this feature put `ngCsp` directive on the root element of the application.\n\
 * \n\
 * @example\n\
 * This example shows how to apply the `ngCsp` directive to the `html` tag.\n\
   <pre>\n\
     <!doctype html>\n\
     <html ng-app ng-csp>\n\
     ...\n\
     ...\n\
     </html>\n\
   </pre>\n\
 */\n\
\n\
var ngCspDirective = ['$sniffer', function($sniffer) {\n\
  return {\n\
    priority: 1000,\n\
    compile: function() {\n\
      $sniffer.csp = true;\n\
    }\n\
  };\n\
}];\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngClick\n\
 *\n\
 * @description\n\
 * The ngClick allows you to specify custom behavior when\n\
 * element is clicked.\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngClick {@link guide/expression Expression} to evaluate upon\n\
 * click. (Event object is available as `$event`)\n\
 *\n\
 * @example\n\
   <doc:example>\n\
     <doc:source>\n\
      <button ng-click=\"count = count + 1\" ng-init=\"count=0\">\n\
        Increment\n\
      </button>\n\
      count: {{count}}\n\
     </doc:source>\n\
     <doc:scenario>\n\
       it('should check ng-click', function() {\n\
         expect(binding('count')).toBe('0');\n\
         element('.doc-example-live :button').click();\n\
         expect(binding('count')).toBe('1');\n\
       });\n\
     </doc:scenario>\n\
   </doc:example>\n\
 */\n\
/*\n\
 * A directive that allows creation of custom onclick handlers that are defined as angular\n\
 * expressions and are compiled and executed within the current scope.\n\
 *\n\
 * Events that are handled via these handler are always configured not to propagate further.\n\
 */\n\
var ngEventDirectives = {};\n\
forEach(\n\
  'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress'.split(' '),\n\
  function(name) {\n\
    var directiveName = directiveNormalize('ng-' + name);\n\
    ngEventDirectives[directiveName] = ['$parse', function($parse) {\n\
      return function(scope, element, attr) {\n\
        var fn = $parse(attr[directiveName]);\n\
        element.bind(lowercase(name), function(event) {\n\
          scope.$apply(function() {\n\
            fn(scope, {$event:event});\n\
          });\n\
        });\n\
      };\n\
    }];\n\
  }\n\
);\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngDblclick\n\
 *\n\
 * @description\n\
 * The `ngDblclick` directive allows you to specify custom behavior on dblclick event.\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngDblclick {@link guide/expression Expression} to evaluate upon\n\
 * dblclick. (Event object is available as `$event`)\n\
 *\n\
 * @example\n\
 * See {@link ng.directive:ngClick ngClick}\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngMousedown\n\
 *\n\
 * @description\n\
 * The ngMousedown directive allows you to specify custom behavior on mousedown event.\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngMousedown {@link guide/expression Expression} to evaluate upon\n\
 * mousedown. (Event object is available as `$event`)\n\
 *\n\
 * @example\n\
 * See {@link ng.directive:ngClick ngClick}\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngMouseup\n\
 *\n\
 * @description\n\
 * Specify custom behavior on mouseup event.\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngMouseup {@link guide/expression Expression} to evaluate upon\n\
 * mouseup. (Event object is available as `$event`)\n\
 *\n\
 * @example\n\
 * See {@link ng.directive:ngClick ngClick}\n\
 */\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngMouseover\n\
 *\n\
 * @description\n\
 * Specify custom behavior on mouseover event.\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngMouseover {@link guide/expression Expression} to evaluate upon\n\
 * mouseover. (Event object is available as `$event`)\n\
 *\n\
 * @example\n\
 * See {@link ng.directive:ngClick ngClick}\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngMouseenter\n\
 *\n\
 * @description\n\
 * Specify custom behavior on mouseenter event.\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngMouseenter {@link guide/expression Expression} to evaluate upon\n\
 * mouseenter. (Event object is available as `$event`)\n\
 *\n\
 * @example\n\
 * See {@link ng.directive:ngClick ngClick}\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngMouseleave\n\
 *\n\
 * @description\n\
 * Specify custom behavior on mouseleave event.\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngMouseleave {@link guide/expression Expression} to evaluate upon\n\
 * mouseleave. (Event object is available as `$event`)\n\
 *\n\
 * @example\n\
 * See {@link ng.directive:ngClick ngClick}\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngMousemove\n\
 *\n\
 * @description\n\
 * Specify custom behavior on mousemove event.\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngMousemove {@link guide/expression Expression} to evaluate upon\n\
 * mousemove. (Event object is available as `$event`)\n\
 *\n\
 * @example\n\
 * See {@link ng.directive:ngClick ngClick}\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngKeydown\n\
 *\n\
 * @description\n\
 * Specify custom behavior on keydown event.\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngKeydown {@link guide/expression Expression} to evaluate upon\n\
 * keydown. (Event object is available as `$event` and can be interrogated for keyCode, altKey, etc.)\n\
 *\n\
 * @example\n\
 * See {@link ng.directive:ngClick ngClick}\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngKeyup\n\
 *\n\
 * @description\n\
 * Specify custom behavior on keyup event.\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngKeyup {@link guide/expression Expression} to evaluate upon\n\
 * keyup. (Event object is available as `$event` and can be interrogated for keyCode, altKey, etc.)\n\
 *\n\
 * @example\n\
 * See {@link ng.directive:ngClick ngClick}\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngKeypress\n\
 *\n\
 * @description\n\
 * Specify custom behavior on keypress event.\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngKeypress {@link guide/expression Expression} to evaluate upon\n\
 * keypress. (Event object is available as `$event` and can be interrogated for keyCode, altKey, etc.)\n\
 *\n\
 * @example\n\
 * See {@link ng.directive:ngClick ngClick}\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngSubmit\n\
 *\n\
 * @description\n\
 * Enables binding angular expressions to onsubmit events.\n\
 *\n\
 * Additionally it prevents the default action (which for form means sending the request to the\n\
 * server and reloading the current page).\n\
 *\n\
 * @element form\n\
 * @param {expression} ngSubmit {@link guide/expression Expression} to eval.\n\
 *\n\
 * @example\n\
   <doc:example>\n\
     <doc:source>\n\
      <script>\n\
        function Ctrl($scope) {\n\
          $scope.list = [];\n\
          $scope.text = 'hello';\n\
          $scope.submit = function() {\n\
            if (this.text) {\n\
              this.list.push(this.text);\n\
              this.text = '';\n\
            }\n\
          };\n\
        }\n\
      </script>\n\
      <form ng-submit=\"submit()\" ng-controller=\"Ctrl\">\n\
        Enter text and hit enter:\n\
        <input type=\"text\" ng-model=\"text\" name=\"text\" />\n\
        <input type=\"submit\" id=\"submit\" value=\"Submit\" />\n\
        <pre>list={{list}}</pre>\n\
      </form>\n\
     </doc:source>\n\
     <doc:scenario>\n\
       it('should check ng-submit', function() {\n\
         expect(binding('list')).toBe('[]');\n\
         element('.doc-example-live #submit').click();\n\
         expect(binding('list')).toBe('[\"hello\"]');\n\
         expect(input('text').val()).toBe('');\n\
       });\n\
       it('should ignore empty strings', function() {\n\
         expect(binding('list')).toBe('[]');\n\
         element('.doc-example-live #submit').click();\n\
         element('.doc-example-live #submit').click();\n\
         expect(binding('list')).toBe('[\"hello\"]');\n\
       });\n\
     </doc:scenario>\n\
   </doc:example>\n\
 */\n\
var ngSubmitDirective = ngDirective(function(scope, element, attrs) {\n\
  element.bind('submit', function() {\n\
    scope.$apply(attrs.ngSubmit);\n\
  });\n\
});\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngIf\n\
 * @restrict A\n\
 *\n\
 * @description\n\
 * The `ngIf` directive removes and recreates a portion of the DOM tree (HTML)\n\
 * conditionally based on **\"falsy\"** and **\"truthy\"** values, respectively, evaluated within\n\
 * an {expression}. In other words, if the expression assigned to **ngIf evaluates to a false\n\
 * value** then **the element is removed from the DOM** and **if true** then **a clone of the\n\
 * element is reinserted into the DOM**.\n\
 *\n\
 * `ngIf` differs from `ngShow` and `ngHide` in that `ngIf` completely removes and recreates the\n\
 * element in the DOM rather than changing its visibility via the `display` css property.  A common\n\
 * case when this difference is significant is when using css selectors that rely on an element's\n\
 * position within the DOM (HTML), such as the `:first-child` or `:last-child` pseudo-classes.\n\
 *\n\
 * Note that **when an element is removed using ngIf its scope is destroyed** and **a new scope\n\
 * is created when the element is restored**.  The scope created within `ngIf` inherits from \n\
 * its parent scope using\n\
 * {@link https://github.com/angular/angular.js/wiki/The-Nuances-of-Scope-Prototypal-Inheritance prototypal inheritance}.\n\
 * An important implication of this is if `ngModel` is used within `ngIf` to bind to\n\
 * a javascript primitive defined in the parent scope. In this case any modifications made to the\n\
 * variable within the child scope will override (hide) the value in the parent scope.\n\
 *\n\
 * Also, `ngIf` recreates elements using their compiled state. An example scenario of this behavior\n\
 * is if an element's class attribute is directly modified after it's compiled, using something like \n\
 * jQuery's `.addClass()` method, and the element is later removed. When `ngIf` recreates the element\n\
 * the added class will be lost because the original compiled state is used to regenerate the element.\n\
 *\n\
 * Additionally, you can provide animations via the ngAnimate attribute to animate the **enter**\n\
 * and **leave** effects.\n\
 *\n\
 * @animations\n\
 * enter - happens just after the ngIf contents change and a new DOM element is created and injected into the ngIf container\n\
 * leave - happens just before the ngIf contents are removed from the DOM\n\
 *\n\
 * @element ANY\n\
 * @scope\n\
 * @param {expression} ngIf If the {@link guide/expression expression} is falsy then\n\
 *     the element is removed from the DOM tree (HTML).\n\
 *\n\
 * @example\n\
  <example animations=\"true\">\n\
    <file name=\"index.html\">\n\
      Click me: <input type=\"checkbox\" ng-model=\"checked\" ng-init=\"checked=true\" /><br/>\n\
      Show when checked:\n\
      <span ng-if=\"checked\" ng-animate=\"'example'\">\n\
        I'm removed when the checkbox is unchecked.\n\
      </span>\n\
    </file>\n\
    <file name=\"animations.css\">\n\
      .example-leave, .example-enter {\n\
        -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;\n\
        -moz-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;\n\
        -ms-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;\n\
        -o-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;\n\
        transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;\n\
      }\n\
\n\
      .example-enter {\n\
        opacity:0;\n\
      }\n\
      .example-enter.example-enter-active {\n\
        opacity:1;\n\
      }\n\
\n\
      .example-leave {\n\
        opacity:1;\n\
      }\n\
      .example-leave.example-leave-active {\n\
        opacity:0;\n\
      }\n\
    </file>\n\
  </example>\n\
 */\n\
var ngIfDirective = ['$animator', function($animator) {\n\
  return {\n\
    transclude: 'element',\n\
    priority: 1000,\n\
    terminal: true,\n\
    restrict: 'A',\n\
    compile: function (element, attr, transclude) {\n\
      return function ($scope, $element, $attr) {\n\
        var animate = $animator($scope, $attr);\n\
        var childElement, childScope;\n\
        $scope.$watch($attr.ngIf, function ngIfWatchAction(value) {\n\
          if (childElement) {\n\
            animate.leave(childElement);\n\
            childElement = undefined;\n\
          }\n\
          if (childScope) {\n\
            childScope.$destroy();\n\
            childScope = undefined;\n\
          }\n\
          if (toBoolean(value)) {\n\
            childScope = $scope.$new();\n\
            transclude(childScope, function (clone) {\n\
              childElement = clone;\n\
              animate.enter(clone, $element.parent(), $element);\n\
            });\n\
          }\n\
        });\n\
      }\n\
    }\n\
  }\n\
}];\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngInclude\n\
 * @restrict ECA\n\
 *\n\
 * @description\n\
 * Fetches, compiles and includes an external HTML fragment.\n\
 *\n\
 * Keep in mind that Same Origin Policy applies to included resources\n\
 * (e.g. ngInclude won't work for cross-domain requests on all browsers and for\n\
 *  file:// access on some browsers).\n\
 *\n\
 * Additionally, you can also provide animations via the ngAnimate attribute to animate the **enter**\n\
 * and **leave** effects.\n\
 *\n\
 * @animations\n\
 * enter - happens just after the ngInclude contents change and a new DOM element is created and injected into the ngInclude container\n\
 * leave - happens just after the ngInclude contents change and just before the former contents are removed from the DOM\n\
 *\n\
 * @scope\n\
 *\n\
 * @param {string} ngInclude|src angular expression evaluating to URL. If the source is a string constant,\n\
 *                 make sure you wrap it in quotes, e.g. `src=\"'myPartialTemplate.html'\"`.\n\
 * @param {string=} onload Expression to evaluate when a new partial is loaded.\n\
 *\n\
 * @param {string=} autoscroll Whether `ngInclude` should call {@link ng.$anchorScroll\n\
 *                  $anchorScroll} to scroll the viewport after the content is loaded.\n\
 *\n\
 *                  - If the attribute is not set, disable scrolling.\n\
 *                  - If the attribute is set without value, enable scrolling.\n\
 *                  - Otherwise enable scrolling only if the expression evaluates to truthy value.\n\
 *\n\
 * @example\n\
  <example animations=\"true\">\n\
    <file name=\"index.html\">\n\
     <div ng-controller=\"Ctrl\">\n\
       <select ng-model=\"template\" ng-options=\"t.name for t in templates\">\n\
        <option value=\"\">(blank)</option>\n\
       </select>\n\
       url of the template: <tt>{{template.url}}</tt>\n\
       <hr/>\n\
       <div class=\"example-animate-container\"\n\
            ng-include=\"template.url\"\n\
            ng-animate=\"{enter: 'example-enter', leave: 'example-leave'}\"></div>\n\
     </div>\n\
    </file>\n\
    <file name=\"script.js\">\n\
      function Ctrl($scope) {\n\
        $scope.templates =\n\
          [ { name: 'template1.html', url: 'template1.html'}\n\
          , { name: 'template2.html', url: 'template2.html'} ];\n\
        $scope.template = $scope.templates[0];\n\
      }\n\
     </file>\n\
    <file name=\"template1.html\">\n\
      <div>Content of template1.html</div>\n\
    </file>\n\
    <file name=\"template2.html\">\n\
      <div>Content of template2.html</div>\n\
    </file>\n\
    <file name=\"animations.css\">\n\
      .example-leave,\n\
      .example-enter {\n\
        -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;\n\
        -moz-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;\n\
        -ms-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;\n\
        -o-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;\n\
        transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;\n\
\n\
        position:absolute;\n\
        top:0;\n\
        left:0;\n\
        right:0;\n\
        bottom:0;\n\
      }\n\
\n\
      .example-animate-container > * {\n\
        display:block;\n\
        padding:10px;\n\
      }\n\
\n\
      .example-enter {\n\
        top:-50px;\n\
      }\n\
      .example-enter.example-enter-active {\n\
        top:0;\n\
      }\n\
\n\
      .example-leave {\n\
        top:0;\n\
      }\n\
      .example-leave.example-leave-active {\n\
        top:50px;\n\
      }\n\
    </file>\n\
    <file name=\"scenario.js\">\n\
      it('should load template1.html', function() {\n\
       expect(element('.doc-example-live [ng-include]').text()).\n\
         toMatch(/Content of template1.html/);\n\
      });\n\
      it('should load template2.html', function() {\n\
       select('template').option('1');\n\
       expect(element('.doc-example-live [ng-include]').text()).\n\
         toMatch(/Content of template2.html/);\n\
      });\n\
      it('should change to blank', function() {\n\
       select('template').option('');\n\
       expect(element('.doc-example-live [ng-include]').text()).toEqual('');\n\
      });\n\
    </file>\n\
  </example>\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc event\n\
 * @name ng.directive:ngInclude#$includeContentRequested\n\
 * @eventOf ng.directive:ngInclude\n\
 * @eventType emit on the scope ngInclude was declared in\n\
 * @description\n\
 * Emitted every time the ngInclude content is requested.\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc event\n\
 * @name ng.directive:ngInclude#$includeContentLoaded\n\
 * @eventOf ng.directive:ngInclude\n\
 * @eventType emit on the current ngInclude scope\n\
 * @description\n\
 * Emitted every time the ngInclude content is reloaded.\n\
 */\n\
var ngIncludeDirective = ['$http', '$templateCache', '$anchorScroll', '$compile', '$animator',\n\
                  function($http,   $templateCache,   $anchorScroll,   $compile,   $animator) {\n\
  return {\n\
    restrict: 'ECA',\n\
    terminal: true,\n\
    compile: function(element, attr) {\n\
      var srcExp = attr.ngInclude || attr.src,\n\
          onloadExp = attr.onload || '',\n\
          autoScrollExp = attr.autoscroll;\n\
\n\
      return function(scope, element, attr) {\n\
        var animate = $animator(scope, attr);\n\
        var changeCounter = 0,\n\
            childScope;\n\
\n\
        var clearContent = function() {\n\
          if (childScope) {\n\
            childScope.$destroy();\n\
            childScope = null;\n\
          }\n\
          animate.leave(element.contents(), element);\n\
        };\n\
\n\
        scope.$watch(srcExp, function ngIncludeWatchAction(src) {\n\
          var thisChangeId = ++changeCounter;\n\
\n\
          if (src) {\n\
            $http.get(src, {cache: $templateCache}).success(function(response) {\n\
              if (thisChangeId !== changeCounter) return;\n\
\n\
              if (childScope) childScope.$destroy();\n\
              childScope = scope.$new();\n\
              animate.leave(element.contents(), element);\n\
\n\
              var contents = jqLite('<div/>').html(response).contents();\n\
\n\
              animate.enter(contents, element);\n\
              $compile(contents)(childScope);\n\
\n\
              if (isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {\n\
                $anchorScroll();\n\
              }\n\
\n\
              childScope.$emit('$includeContentLoaded');\n\
              scope.$eval(onloadExp);\n\
            }).error(function() {\n\
              if (thisChangeId === changeCounter) clearContent();\n\
            });\n\
            scope.$emit('$includeContentRequested');\n\
          } else {\n\
            clearContent();\n\
          }\n\
        });\n\
      };\n\
    }\n\
  };\n\
}];\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngInit\n\
 *\n\
 * @description\n\
 * The `ngInit` directive specifies initialization tasks to be executed\n\
 *  before the template enters execution mode during bootstrap.\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngInit {@link guide/expression Expression} to eval.\n\
 *\n\
 * @example\n\
   <doc:example>\n\
     <doc:source>\n\
    <div ng-init=\"greeting='Hello'; person='World'\">\n\
      {{greeting}} {{person}}!\n\
    </div>\n\
     </doc:source>\n\
     <doc:scenario>\n\
       it('should check greeting', function() {\n\
         expect(binding('greeting')).toBe('Hello');\n\
         expect(binding('person')).toBe('World');\n\
       });\n\
     </doc:scenario>\n\
   </doc:example>\n\
 */\n\
var ngInitDirective = ngDirective({\n\
  compile: function() {\n\
    return {\n\
      pre: function(scope, element, attrs) {\n\
        scope.$eval(attrs.ngInit);\n\
      }\n\
    }\n\
  }\n\
});\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngNonBindable\n\
 * @priority 1000\n\
 *\n\
 * @description\n\
 * Sometimes it is necessary to write code which looks like bindings but which should be left alone\n\
 * by angular. Use `ngNonBindable` to make angular ignore a chunk of HTML.\n\
 *\n\
 * @element ANY\n\
 *\n\
 * @example\n\
 * In this example there are two location where a simple binding (`{{}}`) is present, but the one\n\
 * wrapped in `ngNonBindable` is left alone.\n\
 *\n\
 * @example\n\
    <doc:example>\n\
      <doc:source>\n\
        <div>Normal: {{1 + 2}}</div>\n\
        <div ng-non-bindable>Ignored: {{1 + 2}}</div>\n\
      </doc:source>\n\
      <doc:scenario>\n\
       it('should check ng-non-bindable', function() {\n\
         expect(using('.doc-example-live').binding('1 + 2')).toBe('3');\n\
         expect(using('.doc-example-live').element('div:last').text()).\n\
           toMatch(/1 \\+ 2/);\n\
       });\n\
      </doc:scenario>\n\
    </doc:example>\n\
 */\n\
var ngNonBindableDirective = ngDirective({ terminal: true, priority: 1000 });\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngPluralize\n\
 * @restrict EA\n\
 *\n\
 * @description\n\
 * # Overview\n\
 * `ngPluralize` is a directive that displays messages according to en-US localization rules.\n\
 * These rules are bundled with angular.js and the rules can be overridden\n\
 * (see {@link guide/i18n Angular i18n} dev guide). You configure ngPluralize directive\n\
 * by specifying the mappings between\n\
 * {@link http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html\n\
 * plural categories} and the strings to be displayed.\n\
 *\n\
 * # Plural categories and explicit number rules\n\
 * There are two\n\
 * {@link http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html\n\
 * plural categories} in Angular's default en-US locale: \"one\" and \"other\".\n\
 *\n\
 * While a plural category may match many numbers (for example, in en-US locale, \"other\" can match\n\
 * any number that is not 1), an explicit number rule can only match one number. For example, the\n\
 * explicit number rule for \"3\" matches the number 3. You will see the use of plural categories\n\
 * and explicit number rules throughout later parts of this documentation.\n\
 *\n\
 * # Configuring ngPluralize\n\
 * You configure ngPluralize by providing 2 attributes: `count` and `when`.\n\
 * You can also provide an optional attribute, `offset`.\n\
 *\n\
 * The value of the `count` attribute can be either a string or an {@link guide/expression\n\
 * Angular expression}; these are evaluated on the current scope for its bound value.\n\
 *\n\
 * The `when` attribute specifies the mappings between plural categories and the actual\n\
 * string to be displayed. The value of the attribute should be a JSON object so that Angular\n\
 * can interpret it correctly.\n\
 *\n\
 * The following example shows how to configure ngPluralize:\n\
 *\n\
 * <pre>\n\
 * <ng-pluralize count=\"personCount\"\n\
                 when=\"{'0': 'Nobody is viewing.',\n\
 *                      'one': '1 person is viewing.',\n\
 *                      'other': '{} people are viewing.'}\">\n\
 * </ng-pluralize>\n\
 *</pre>\n\
 *\n\
 * In the example, `\"0: Nobody is viewing.\"` is an explicit number rule. If you did not\n\
 * specify this rule, 0 would be matched to the \"other\" category and \"0 people are viewing\"\n\
 * would be shown instead of \"Nobody is viewing\". You can specify an explicit number rule for\n\
 * other numbers, for example 12, so that instead of showing \"12 people are viewing\", you can\n\
 * show \"a dozen people are viewing\".\n\
 *\n\
 * You can use a set of closed braces(`{}`) as a placeholder for the number that you want substituted\n\
 * into pluralized strings. In the previous example, Angular will replace `{}` with\n\
 * <span ng-non-bindable>`{{personCount}}`</span>. The closed braces `{}` is a placeholder\n\
 * for <span ng-non-bindable>{{numberExpression}}</span>.\n\
 *\n\
 * # Configuring ngPluralize with offset\n\
 * The `offset` attribute allows further customization of pluralized text, which can result in\n\
 * a better user experience. For example, instead of the message \"4 people are viewing this document\",\n\
 * you might display \"John, Kate and 2 others are viewing this document\".\n\
 * The offset attribute allows you to offset a number by any desired value.\n\
 * Let's take a look at an example:\n\
 *\n\
 * <pre>\n\
 * <ng-pluralize count=\"personCount\" offset=2\n\
 *               when=\"{'0': 'Nobody is viewing.',\n\
 *                      '1': '{{person1}} is viewing.',\n\
 *                      '2': '{{person1}} and {{person2}} are viewing.',\n\
 *                      'one': '{{person1}}, {{person2}} and one other person are viewing.',\n\
 *                      'other': '{{person1}}, {{person2}} and {} other people are viewing.'}\">\n\
 * </ng-pluralize>\n\
 * </pre>\n\
 *\n\
 * Notice that we are still using two plural categories(one, other), but we added\n\
 * three explicit number rules 0, 1 and 2.\n\
 * When one person, perhaps John, views the document, \"John is viewing\" will be shown.\n\
 * When three people view the document, no explicit number rule is found, so\n\
 * an offset of 2 is taken off 3, and Angular uses 1 to decide the plural category.\n\
 * In this case, plural category 'one' is matched and \"John, Marry and one other person are viewing\"\n\
 * is shown.\n\
 *\n\
 * Note that when you specify offsets, you must provide explicit number rules for\n\
 * numbers from 0 up to and including the offset. If you use an offset of 3, for example,\n\
 * you must provide explicit number rules for 0, 1, 2 and 3. You must also provide plural strings for\n\
 * plural categories \"one\" and \"other\".\n\
 *\n\
 * @param {string|expression} count The variable to be bounded to.\n\
 * @param {string} when The mapping between plural category to its corresponding strings.\n\
 * @param {number=} offset Offset to deduct from the total number.\n\
 *\n\
 * @example\n\
    <doc:example>\n\
      <doc:source>\n\
        <script>\n\
          function Ctrl($scope) {\n\
            $scope.person1 = 'Igor';\n\
            $scope.person2 = 'Misko';\n\
            $scope.personCount = 1;\n\
          }\n\
        </script>\n\
        <div ng-controller=\"Ctrl\">\n\
          Person 1:<input type=\"text\" ng-model=\"person1\" value=\"Igor\" /><br/>\n\
          Person 2:<input type=\"text\" ng-model=\"person2\" value=\"Misko\" /><br/>\n\
          Number of People:<input type=\"text\" ng-model=\"personCount\" value=\"1\" /><br/>\n\
\n\
          <!--- Example with simple pluralization rules for en locale --->\n\
          Without Offset:\n\
          <ng-pluralize count=\"personCount\"\n\
                        when=\"{'0': 'Nobody is viewing.',\n\
                               'one': '1 person is viewing.',\n\
                               'other': '{} people are viewing.'}\">\n\
          </ng-pluralize><br>\n\
\n\
          <!--- Example with offset --->\n\
          With Offset(2):\n\
          <ng-pluralize count=\"personCount\" offset=2\n\
                        when=\"{'0': 'Nobody is viewing.',\n\
                               '1': '{{person1}} is viewing.',\n\
                               '2': '{{person1}} and {{person2}} are viewing.',\n\
                               'one': '{{person1}}, {{person2}} and one other person are viewing.',\n\
                               'other': '{{person1}}, {{person2}} and {} other people are viewing.'}\">\n\
          </ng-pluralize>\n\
        </div>\n\
      </doc:source>\n\
      <doc:scenario>\n\
        it('should show correct pluralized string', function() {\n\
          expect(element('.doc-example-live ng-pluralize:first').text()).\n\
                                             toBe('1 person is viewing.');\n\
          expect(element('.doc-example-live ng-pluralize:last').text()).\n\
                                                toBe('Igor is viewing.');\n\
\n\
          using('.doc-example-live').input('personCount').enter('0');\n\
          expect(element('.doc-example-live ng-pluralize:first').text()).\n\
                                               toBe('Nobody is viewing.');\n\
          expect(element('.doc-example-live ng-pluralize:last').text()).\n\
                                              toBe('Nobody is viewing.');\n\
\n\
          using('.doc-example-live').input('personCount').enter('2');\n\
          expect(element('.doc-example-live ng-pluralize:first').text()).\n\
                                            toBe('2 people are viewing.');\n\
          expect(element('.doc-example-live ng-pluralize:last').text()).\n\
                              toBe('Igor and Misko are viewing.');\n\
\n\
          using('.doc-example-live').input('personCount').enter('3');\n\
          expect(element('.doc-example-live ng-pluralize:first').text()).\n\
                                            toBe('3 people are viewing.');\n\
          expect(element('.doc-example-live ng-pluralize:last').text()).\n\
                              toBe('Igor, Misko and one other person are viewing.');\n\
\n\
          using('.doc-example-live').input('personCount').enter('4');\n\
          expect(element('.doc-example-live ng-pluralize:first').text()).\n\
                                            toBe('4 people are viewing.');\n\
          expect(element('.doc-example-live ng-pluralize:last').text()).\n\
                              toBe('Igor, Misko and 2 other people are viewing.');\n\
        });\n\
\n\
        it('should show data-binded names', function() {\n\
          using('.doc-example-live').input('personCount').enter('4');\n\
          expect(element('.doc-example-live ng-pluralize:last').text()).\n\
              toBe('Igor, Misko and 2 other people are viewing.');\n\
\n\
          using('.doc-example-live').input('person1').enter('Di');\n\
          using('.doc-example-live').input('person2').enter('Vojta');\n\
          expect(element('.doc-example-live ng-pluralize:last').text()).\n\
              toBe('Di, Vojta and 2 other people are viewing.');\n\
        });\n\
      </doc:scenario>\n\
    </doc:example>\n\
 */\n\
var ngPluralizeDirective = ['$locale', '$interpolate', function($locale, $interpolate) {\n\
  var BRACE = /{}/g;\n\
  return {\n\
    restrict: 'EA',\n\
    link: function(scope, element, attr) {\n\
      var numberExp = attr.count,\n\
          whenExp = element.attr(attr.$attr.when), // this is because we have {{}} in attrs\n\
          offset = attr.offset || 0,\n\
          whens = scope.$eval(whenExp),\n\
          whensExpFns = {},\n\
          startSymbol = $interpolate.startSymbol(),\n\
          endSymbol = $interpolate.endSymbol();\n\
\n\
      forEach(whens, function(expression, key) {\n\
        whensExpFns[key] =\n\
          $interpolate(expression.replace(BRACE, startSymbol + numberExp + '-' +\n\
            offset + endSymbol));\n\
      });\n\
\n\
      scope.$watch(function ngPluralizeWatch() {\n\
        var value = parseFloat(scope.$eval(numberExp));\n\
\n\
        if (!isNaN(value)) {\n\
          //if explicit number rule such as 1, 2, 3... is defined, just use it. Otherwise,\n\
          //check it against pluralization rules in $locale service\n\
          if (!(value in whens)) value = $locale.pluralCat(value - offset);\n\
           return whensExpFns[value](scope, element, true);\n\
        } else {\n\
          return '';\n\
        }\n\
      }, function ngPluralizeWatchAction(newVal) {\n\
        element.text(newVal);\n\
      });\n\
    }\n\
  };\n\
}];\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngRepeat\n\
 *\n\
 * @description\n\
 * The `ngRepeat` directive instantiates a template once per item from a collection. Each template\n\
 * instance gets its own scope, where the given loop variable is set to the current collection item,\n\
 * and `$index` is set to the item index or key.\n\
 *\n\
 * Special properties are exposed on the local scope of each template instance, including:\n\
 *\n\
 *   * `$index` â€“ `{number}` â€“ iterator offset of the repeated element (0..length-1)\n\
 *   * `$first` â€“ `{boolean}` â€“ true if the repeated element is first in the iterator.\n\
 *   * `$middle` â€“ `{boolean}` â€“ true if the repeated element is between the first and last in the iterator.\n\
 *   * `$last` â€“ `{boolean}` â€“ true if the repeated element is last in the iterator.\n\
 *\n\
 * Additionally, you can also provide animations via the ngAnimate attribute to animate the **enter**,\n\
 * **leave** and **move** effects.\n\
 *\n\
 * @animations\n\
 * enter - when a new item is added to the list or when an item is revealed after a filter\n\
 * leave - when an item is removed from the list or when an item is filtered out\n\
 * move - when an adjacent item is filtered out causing a reorder or when the item contents are reordered\n\
 *\n\
 * @element ANY\n\
 * @scope\n\
 * @priority 1000\n\
 * @param {repeat_expression} ngRepeat The expression indicating how to enumerate a collection. These\n\
 *   formats are currently supported:\n\
 *\n\
 *   * `variable in expression` â€“ where variable is the user defined loop variable and `expression`\n\
 *     is a scope expression giving the collection to enumerate.\n\
 *\n\
 *     For example: `track in cd.tracks`.\n\
 *\n\
 *   * `(key, value) in expression` â€“ where `key` and `value` can be any user defined identifiers,\n\
 *     and `expression` is the scope expression giving the collection to enumerate.\n\
 *\n\
 *     For example: `(name, age) in {'adam':10, 'amalie':12}`.\n\
 *\n\
 *   * `variable in expression track by tracking_expression` â€“ You can also provide an optional tracking function\n\
 *     which can be used to associate the objects in the collection with the DOM elements. If no tractking function\n\
 *     is specified the ng-repeat associates elements by identity in the collection. It is an error to have\n\
 *     more then one tractking function to  resolve to the same key. (This would mean that two distinct objects are\n\
 *     mapped to the same DOM element, which is not possible.)\n\
 *\n\
 *     For example: `item in items` is equivalent to `item in items track by $id(item)'. This implies that the DOM elements\n\
 *     will be associated by item identity in the array.\n\
 *\n\
 *     For example: `item in items track by $id(item)`. A built in `$id()` function can be used to assign a unique\n\
 *     `$$hashKey` property to each item in the array. This property is then used as a key to associated DOM elements\n\
 *     with the corresponding item in the array by identity. Moving the same object in array would move the DOM\n\
 *     element in the same way ian the DOM.\n\
 *\n\
 *     For example: `item in items track by item.id` Is a typical pattern when the items come from the database. In this\n\
 *     case the object identity does not matter. Two objects are considered equivalent as long as their `id`\n\
 *     property is same.\n\
 *\n\
 * @example\n\
 * This example initializes the scope to a list of names and\n\
 * then uses `ngRepeat` to display every person:\n\
  <example animations=\"true\">\n\
    <file name=\"index.html\">\n\
      <div ng-init=\"friends = [\n\
        {name:'John', age:25, gender:'boy'},\n\
        {name:'Jessie', age:30, gender:'girl'},\n\
        {name:'Johanna', age:28, gender:'girl'},\n\
        {name:'Joy', age:15, gender:'girl'},\n\
        {name:'Mary', age:28, gender:'girl'},\n\
        {name:'Peter', age:95, gender:'boy'},\n\
        {name:'Sebastian', age:50, gender:'boy'},\n\
        {name:'Erika', age:27, gender:'girl'},\n\
        {name:'Patrick', age:40, gender:'boy'},\n\
        {name:'Samantha', age:60, gender:'girl'}\n\
      ]\">\n\
        I have {{friends.length}} friends. They are:\n\
        <input type=\"search\" ng-model=\"q\" placeholder=\"filter friends...\" />\n\
        <ul>\n\
          <li ng-repeat=\"friend in friends | filter:q\"\n\
              ng-animate=\"{enter: 'example-repeat-enter',\n\
                          leave: 'example-repeat-leave',\n\
                          move: 'example-repeat-move'}\">\n\
            [{{$index + 1}}] {{friend.name}} who is {{friend.age}} years old.\n\
          </li>\n\
        </ul>\n\
      </div>\n\
    </file>\n\
    <file name=\"animations.css\">\n\
      .example-repeat-enter,\n\
      .example-repeat-leave,\n\
      .example-repeat-move {\n\
        -webkit-transition:all linear 0.5s;\n\
        -moz-transition:all linear 0.5s;\n\
        -ms-transition:all linear 0.5s;\n\
        -o-transition:all linear 0.5s;\n\
        transition:all linear 0.5s;\n\
      }\n\
\n\
      .example-repeat-enter {\n\
        line-height:0;\n\
        opacity:0;\n\
      }\n\
      .example-repeat-enter.example-repeat-enter-active {\n\
        line-height:20px;\n\
        opacity:1;\n\
      }\n\
\n\
      .example-repeat-leave {\n\
        opacity:1;\n\
        line-height:20px;\n\
      }\n\
      .example-repeat-leave.example-repeat-leave-active {\n\
        opacity:0;\n\
        line-height:0;\n\
      }\n\
\n\
      .example-repeat-move { }\n\
      .example-repeat-move.example-repeat-move-active { }\n\
    </file>\n\
    <file name=\"scenario.js\">\n\
       it('should render initial data set', function() {\n\
         var r = using('.doc-example-live').repeater('ul li');\n\
         expect(r.count()).toBe(10);\n\
         expect(r.row(0)).toEqual([\"1\",\"John\",\"25\"]);\n\
         expect(r.row(1)).toEqual([\"2\",\"Jessie\",\"30\"]);\n\
         expect(r.row(9)).toEqual([\"10\",\"Samantha\",\"60\"]);\n\
         expect(binding('friends.length')).toBe(\"10\");\n\
       });\n\
\n\
       it('should update repeater when filter predicate changes', function() {\n\
         var r = using('.doc-example-live').repeater('ul li');\n\
         expect(r.count()).toBe(10);\n\
\n\
         input('q').enter('ma');\n\
\n\
         expect(r.count()).toBe(2);\n\
         expect(r.row(0)).toEqual([\"1\",\"Mary\",\"28\"]);\n\
         expect(r.row(1)).toEqual([\"2\",\"Samantha\",\"60\"]);\n\
       });\n\
      </file>\n\
    </example>\n\
 */\n\
var ngRepeatDirective = ['$parse', '$animator', function($parse, $animator) {\n\
  var NG_REMOVED = '$$NG_REMOVED';\n\
  return {\n\
    transclude: 'element',\n\
    priority: 1000,\n\
    terminal: true,\n\
    compile: function(element, attr, linker) {\n\
      return function($scope, $element, $attr){\n\
        var animate = $animator($scope, $attr);\n\
        var expression = $attr.ngRepeat;\n\
        var match = expression.match(/^\\s*(.+)\\s+in\\s+(.*?)\\s*(\\s+track\\s+by\\s+(.+)\\s*)?$/),\n\
          trackByExp, trackByExpGetter, trackByIdFn, lhs, rhs, valueIdentifier, keyIdentifier,\n\
          hashFnLocals = {$id: hashKey};\n\
\n\
        if (!match) {\n\
          throw Error(\"Expected ngRepeat in form of '_item_ in _collection_[ track by _id_]' but got '\" +\n\
            expression + \"'.\");\n\
        }\n\
\n\
        lhs = match[1];\n\
        rhs = match[2];\n\
        trackByExp = match[4];\n\
\n\
        if (trackByExp) {\n\
          trackByExpGetter = $parse(trackByExp);\n\
          trackByIdFn = function(key, value, index) {\n\
            // assign key, value, and $index to the locals so that they can be used in hash functions\n\
            if (keyIdentifier) hashFnLocals[keyIdentifier] = key;\n\
            hashFnLocals[valueIdentifier] = value;\n\
            hashFnLocals.$index = index;\n\
            return trackByExpGetter($scope, hashFnLocals);\n\
          };\n\
        } else {\n\
          trackByIdFn = function(key, value) {\n\
            return hashKey(value);\n\
          }\n\
        }\n\
\n\
        match = lhs.match(/^(?:([\\$\\w]+)|\\(([\\$\\w]+)\\s*,\\s*([\\$\\w]+)\\))$/);\n\
        if (!match) {\n\
          throw Error(\"'item' in 'item in collection' should be identifier or (key, value) but got '\" +\n\
              lhs + \"'.\");\n\
        }\n\
        valueIdentifier = match[3] || match[1];\n\
        keyIdentifier = match[2];\n\
\n\
        // Store a list of elements from previous run. This is a hash where key is the item from the\n\
        // iterator, and the value is objects with following properties.\n\
        //   - scope: bound scope\n\
        //   - element: previous element.\n\
        //   - index: position\n\
        var lastBlockMap = {};\n\
\n\
        //watch props\n\
        $scope.$watchCollection(rhs, function ngRepeatAction(collection){\n\
          var index, length,\n\
              cursor = $element,     // current position of the node\n\
              nextCursor,\n\
              // Same as lastBlockMap but it has the current state. It will become the\n\
              // lastBlockMap on the next iteration.\n\
              nextBlockMap = {},\n\
              arrayLength,\n\
              childScope,\n\
              key, value, // key/value of iteration\n\
              trackById,\n\
              collectionKeys,\n\
              block,       // last object information {scope, element, id}\n\
              nextBlockOrder = [];\n\
\n\
\n\
          if (isArrayLike(collection)) {\n\
            collectionKeys = collection;\n\
          } else {\n\
            // if object, extract keys, sort them and use to determine order of iteration over obj props\n\
            collectionKeys = [];\n\
            for (key in collection) {\n\
              if (collection.hasOwnProperty(key) && key.charAt(0) != '$') {\n\
                collectionKeys.push(key);\n\
              }\n\
            }\n\
            collectionKeys.sort();\n\
          }\n\
\n\
          arrayLength = collectionKeys.length;\n\
\n\
          // locate existing items\n\
          length = nextBlockOrder.length = collectionKeys.length;\n\
          for(index = 0; index < length; index++) {\n\
           key = (collection === collectionKeys) ? index : collectionKeys[index];\n\
           value = collection[key];\n\
           trackById = trackByIdFn(key, value, index);\n\
           if(lastBlockMap.hasOwnProperty(trackById)) {\n\
             block = lastBlockMap[trackById]\n\
             delete lastBlockMap[trackById];\n\
             nextBlockMap[trackById] = block;\n\
             nextBlockOrder[index] = block;\n\
           } else if (nextBlockMap.hasOwnProperty(trackById)) {\n\
             // restore lastBlockMap\n\
             forEach(nextBlockOrder, function(block) {\n\
               if (block && block.element) lastBlockMap[block.id] = block;\n\
             });\n\
             // This is a duplicate and we need to throw an error\n\
             throw new Error('Duplicates in a repeater are not allowed. Repeater: ' + expression +\n\
                 ' key: ' + trackById);\n\
           } else {\n\
             // new never before seen block\n\
             nextBlockOrder[index] = { id: trackById };\n\
             nextBlockMap[trackById] = false;\n\
           }\n\
         }\n\
\n\
          // remove existing items\n\
          for (key in lastBlockMap) {\n\
            if (lastBlockMap.hasOwnProperty(key)) {\n\
              block = lastBlockMap[key];\n\
              animate.leave(block.element);\n\
              block.element[0][NG_REMOVED] = true;\n\
              block.scope.$destroy();\n\
            }\n\
          }\n\
\n\
          // we are not using forEach for perf reasons (trying to avoid #call)\n\
          for (index = 0, length = collectionKeys.length; index < length; index++) {\n\
            key = (collection === collectionKeys) ? index : collectionKeys[index];\n\
            value = collection[key];\n\
            block = nextBlockOrder[index];\n\
\n\
            if (block.element) {\n\
              // if we have already seen this object, then we need to reuse the\n\
              // associated scope/element\n\
              childScope = block.scope;\n\
\n\
              nextCursor = cursor[0];\n\
              do {\n\
                nextCursor = nextCursor.nextSibling;\n\
              } while(nextCursor && nextCursor[NG_REMOVED]);\n\
\n\
              if (block.element[0] == nextCursor) {\n\
                // do nothing\n\
                cursor = block.element;\n\
              } else {\n\
                // existing item which got moved\n\
                animate.move(block.element, null, cursor);\n\
                cursor = block.element;\n\
              }\n\
            } else {\n\
              // new item which we don't know about\n\
              childScope = $scope.$new();\n\
            }\n\
\n\
            childScope[valueIdentifier] = value;\n\
            if (keyIdentifier) childScope[keyIdentifier] = key;\n\
            childScope.$index = index;\n\
            childScope.$first = (index === 0);\n\
            childScope.$last = (index === (arrayLength - 1));\n\
            childScope.$middle = !(childScope.$first || childScope.$last);\n\
\n\
            if (!block.element) {\n\
              linker(childScope, function(clone) {\n\
                animate.enter(clone, null, cursor);\n\
                cursor = clone;\n\
                block.scope = childScope;\n\
                block.element = clone;\n\
                nextBlockMap[block.id] = block;\n\
              });\n\
            }\n\
          }\n\
          lastBlockMap = nextBlockMap;\n\
        });\n\
      };\n\
    }\n\
  };\n\
}];\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngShow\n\
 *\n\
 * @description\n\
 * The `ngShow` and `ngHide` directives show or hide a portion of the DOM tree (HTML)\n\
 * conditionally based on **\"truthy\"** values evaluated within an {expression}. In other\n\
 * words, if the expression assigned to **ngShow evaluates to a true value** then **the element is set to visible**\n\
 * (via `display:block` in css) and **if false** then **the element is set to hidden** (so display:none).\n\
 * With ngHide this is the reverse whereas true values cause the element itself to become\n\
 * hidden.\n\
 *\n\
 * Additionally, you can also provide animations via the ngAnimate attribute to animate the **show**\n\
 * and **hide** effects.\n\
 *\n\
 * @animations\n\
 * show - happens after the ngShow expression evaluates to a truthy value and the contents are set to visible\n\
 * hide - happens before the ngShow expression evaluates to a non truthy value and just before the contents are set to hidden\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngShow If the {@link guide/expression expression} is truthy\n\
 *     then the element is shown or hidden respectively.\n\
 *\n\
 * @example\n\
  <example animations=\"true\">\n\
    <file name=\"index.html\">\n\
      Click me: <input type=\"checkbox\" ng-model=\"checked\"><br/>\n\
      <div>\n\
        Show:\n\
        <span class=\"check-element\"\n\
              ng-show=\"checked\"\n\
              ng-animate=\"{show: 'example-show', hide: 'example-hide'}\">\n\
          <span class=\"icon-thumbs-up\"></span> I show up when your checkbox is checked.\n\
        </span>\n\
      </div>\n\
      <div>\n\
        Hide:\n\
        <span class=\"check-element\"\n\
              ng-hide=\"checked\"\n\
              ng-animate=\"{show: 'example-show', hide: 'example-hide'}\">\n\
          <span class=\"icon-thumbs-down\"></span> I hide when your checkbox is checked.\n\
        </span>\n\
      </div>\n\
    </file>\n\
    <file name=\"animations.css\">\n\
      .example-show, .example-hide {\n\
        -webkit-transition:all linear 0.5s;\n\
        -moz-transition:all linear 0.5s;\n\
        -ms-transition:all linear 0.5s;\n\
        -o-transition:all linear 0.5s;\n\
        transition:all linear 0.5s;\n\
      }\n\
\n\
      .example-show {\n\
        line-height:0;\n\
        opacity:0;\n\
        padding:0 10px;\n\
      }\n\
      .example-show-active.example-show-active {\n\
        line-height:20px;\n\
        opacity:1;\n\
        padding:10px;\n\
        border:1px solid black;\n\
        background:white;\n\
      }\n\
\n\
      .example-hide {\n\
        line-height:20px;\n\
        opacity:1;\n\
        padding:10px;\n\
        border:1px solid black;\n\
        background:white;\n\
      }\n\
      .example-hide-active.example-hide-active {\n\
        line-height:0;\n\
        opacity:0;\n\
        padding:0 10px;\n\
      }\n\
\n\
      .check-element {\n\
        padding:10px;\n\
        border:1px solid black;\n\
        background:white;\n\
      }\n\
    </file>\n\
    <file name=\"scenario.js\">\n\
       it('should check ng-show / ng-hide', function() {\n\
         expect(element('.doc-example-live span:first:hidden').count()).toEqual(1);\n\
         expect(element('.doc-example-live span:last:visible').count()).toEqual(1);\n\
\n\
         input('checked').check();\n\
\n\
         expect(element('.doc-example-live span:first:visible').count()).toEqual(1);\n\
         expect(element('.doc-example-live span:last:hidden').count()).toEqual(1);\n\
       });\n\
    </file>\n\
  </example>\n\
 */\n\
//TODO(misko): refactor to remove element from the DOM\n\
var ngShowDirective = ['$animator', function($animator) {\n\
  return function(scope, element, attr) {\n\
    var animate = $animator(scope, attr);\n\
    scope.$watch(attr.ngShow, function ngShowWatchAction(value){\n\
      animate[toBoolean(value) ? 'show' : 'hide'](element);\n\
    });\n\
  };\n\
}];\n\
\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngHide\n\
 *\n\
 * @description\n\
 * The `ngShow` and `ngHide` directives show or hide a portion of the DOM tree (HTML)\n\
 * conditionally based on **\"truthy\"** values evaluated within an {expression}. In other\n\
 * words, if the expression assigned to **ngShow evaluates to a true value** then **the element is set to visible**\n\
 * (via `display:block` in css) and **if false** then **the element is set to hidden** (so display:none).\n\
 * With ngHide this is the reverse whereas true values cause the element itself to become\n\
 * hidden.\n\
 *\n\
 * Additionally, you can also provide animations via the ngAnimate attribute to animate the **show**\n\
 * and **hide** effects.\n\
 *\n\
 * @animations\n\
 * show - happens after the ngHide expression evaluates to a non truthy value and the contents are set to visible\n\
 * hide - happens after the ngHide expression evaluates to a truthy value and just before the contents are set to hidden\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngHide If the {@link guide/expression expression} is truthy then\n\
 *     the element is shown or hidden respectively.\n\
 *\n\
 * @example\n\
  <example animations=\"true\">\n\
    <file name=\"index.html\">\n\
      Click me: <input type=\"checkbox\" ng-model=\"checked\"><br/>\n\
      <div>\n\
        Show:\n\
        <span class=\"check-element\"\n\
              ng-show=\"checked\"\n\
              ng-animate=\"{show: 'example-show', hide: 'example-hide'}\">\n\
          <span class=\"icon-thumbs-up\"></span> I show up when your checkbox is checked.\n\
        </span>\n\
      </div>\n\
      <div>\n\
        Hide:\n\
        <span class=\"check-element\"\n\
              ng-hide=\"checked\"\n\
              ng-animate=\"{show: 'example-show', hide: 'example-hide'}\">\n\
          <span class=\"icon-thumbs-down\"></span> I hide when your checkbox is checked.\n\
        </span>\n\
      </div>\n\
    </file>\n\
    <file name=\"animations.css\">\n\
      .example-show, .example-hide {\n\
        -webkit-transition:all linear 0.5s;\n\
        -moz-transition:all linear 0.5s;\n\
        -ms-transition:all linear 0.5s;\n\
        -o-transition:all linear 0.5s;\n\
        transition:all linear 0.5s;\n\
      }\n\
\n\
      .example-show {\n\
        line-height:0;\n\
        opacity:0;\n\
        padding:0 10px;\n\
      }\n\
      .example-show.example-show-active {\n\
        line-height:20px;\n\
        opacity:1;\n\
        padding:10px;\n\
        border:1px solid black;\n\
        background:white;\n\
      }\n\
\n\
      .example-hide {\n\
        line-height:20px;\n\
        opacity:1;\n\
        padding:10px;\n\
        border:1px solid black;\n\
        background:white;\n\
      }\n\
      .example-hide.example-hide-active {\n\
        line-height:0;\n\
        opacity:0;\n\
        padding:0 10px;\n\
      }\n\
\n\
      .check-element {\n\
        padding:10px;\n\
        border:1px solid black;\n\
        background:white;\n\
      }\n\
    </file>\n\
    <file name=\"scenario.js\">\n\
       it('should check ng-show / ng-hide', function() {\n\
         expect(element('.doc-example-live .check-element:first:hidden').count()).toEqual(1);\n\
         expect(element('.doc-example-live .check-element:last:visible').count()).toEqual(1);\n\
\n\
         input('checked').check();\n\
\n\
         expect(element('.doc-example-live .check-element:first:visible').count()).toEqual(1);\n\
         expect(element('.doc-example-live .check-element:last:hidden').count()).toEqual(1);\n\
       });\n\
    </file>\n\
  </example>\n\
 */\n\
//TODO(misko): refactor to remove element from the DOM\n\
var ngHideDirective = ['$animator', function($animator) {\n\
  return function(scope, element, attr) {\n\
    var animate = $animator(scope, attr);\n\
    scope.$watch(attr.ngHide, function ngHideWatchAction(value){\n\
      animate[toBoolean(value) ? 'hide' : 'show'](element);\n\
    });\n\
  };\n\
}];\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngStyle\n\
 *\n\
 * @description\n\
 * The `ngStyle` directive allows you to set CSS style on an HTML element conditionally.\n\
 *\n\
 * @element ANY\n\
 * @param {expression} ngStyle {@link guide/expression Expression} which evals to an\n\
 *      object whose keys are CSS style names and values are corresponding values for those CSS\n\
 *      keys.\n\
 *\n\
 * @example\n\
   <example>\n\
     <file name=\"index.html\">\n\
        <input type=\"button\" value=\"set\" ng-click=\"myStyle={color:'red'}\">\n\
        <input type=\"button\" value=\"clear\" ng-click=\"myStyle={}\">\n\
        <br/>\n\
        <span ng-style=\"myStyle\">Sample Text</span>\n\
        <pre>myStyle={{myStyle}}</pre>\n\
     </file>\n\
     <file name=\"style.css\">\n\
       span {\n\
         color: black;\n\
       }\n\
     </file>\n\
     <file name=\"scenario.js\">\n\
       it('should check ng-style', function() {\n\
         expect(element('.doc-example-live span').css('color')).toBe('rgb(0, 0, 0)');\n\
         element('.doc-example-live :button[value=set]').click();\n\
         expect(element('.doc-example-live span').css('color')).toBe('rgb(255, 0, 0)');\n\
         element('.doc-example-live :button[value=clear]').click();\n\
         expect(element('.doc-example-live span').css('color')).toBe('rgb(0, 0, 0)');\n\
       });\n\
     </file>\n\
   </example>\n\
 */\n\
var ngStyleDirective = ngDirective(function(scope, element, attr) {\n\
  scope.$watch(attr.ngStyle, function ngStyleWatchAction(newStyles, oldStyles) {\n\
    if (oldStyles && (newStyles !== oldStyles)) {\n\
      forEach(oldStyles, function(val, style) { element.css(style, '');});\n\
    }\n\
    if (newStyles) element.css(newStyles);\n\
  }, true);\n\
});\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngSwitch\n\
 * @restrict EA\n\
 *\n\
 * @description\n\
 * The ngSwitch directive is used to conditionally swap DOM structure on your template based on a scope expression.\n\
 * Elements within ngSwitch but without ngSwitchWhen or ngSwitchDefault directives will be preserved at the location\n\
 * as specified in the template.\n\
 *\n\
 * The directive itself works similar to ngInclude, however, instead of downloading template code (or loading it\n\
 * from the template cache), ngSwitch simply choses one of the nested elements and makes it visible based on which element\n\
 * matches the value obtained from the evaluated expression. In other words, you define a container element\n\
 * (where you place the directive), place an expression on the **on=\"...\" attribute**\n\
 * (or the **ng-switch=\"...\" attribute**), define any inner elements inside of the directive and place\n\
 * a when attribute per element. The when attribute is used to inform ngSwitch which element to display when the on\n\
 * expression is evaluated. If a matching expression is not found via a when attribute then an element with the default\n\
 * attribute is displayed.\n\
 *\n\
 * Additionally, you can also provide animations via the ngAnimate attribute to animate the **enter**\n\
 * and **leave** effects.\n\
 *\n\
 * @animations\n\
 * enter - happens after the ngSwtich contents change and the matched child element is placed inside the container\n\
 * leave - happens just after the ngSwitch contents change and just before the former contents are removed from the DOM\n\
 *\n\
 * @usage\n\
 * <ANY ng-switch=\"expression\">\n\
 *   <ANY ng-switch-when=\"matchValue1\">...</ANY>\n\
 *   <ANY ng-switch-when=\"matchValue2\">...</ANY>\n\
 *   <ANY ng-switch-default>...</ANY>\n\
 * </ANY>\n\
 *\n\
 * @scope\n\
 * @param {*} ngSwitch|on expression to match against <tt>ng-switch-when</tt>.\n\
 * @paramDescription\n\
 * On child elements add:\n\
 *\n\
 * * `ngSwitchWhen`: the case statement to match against. If match then this\n\
 *   case will be displayed. If the same match appears multiple times, all the\n\
 *   elements will be displayed.\n\
 * * `ngSwitchDefault`: the default case when no other case match. If there\n\
 *   are multiple default cases, all of them will be displayed when no other\n\
 *   case match.\n\
 *\n\
 *\n\
 * @example\n\
  <example animations=\"true\">\n\
    <file name=\"index.html\">\n\
      <div ng-controller=\"Ctrl\">\n\
        <select ng-model=\"selection\" ng-options=\"item for item in items\">\n\
        </select>\n\
        <tt>selection={{selection}}</tt>\n\
        <hr/>\n\
        <div\n\
          class=\"example-animate-container\"\n\
          ng-switch on=\"selection\"\n\
          ng-animate=\"{enter: 'example-enter', leave: 'example-leave'}\">\n\
            <div ng-switch-when=\"settings\">Settings Div</div>\n\
            <div ng-switch-when=\"home\">Home Span</div>\n\
            <div ng-switch-default>default</div>\n\
        </div>\n\
      </div>\n\
    </file>\n\
    <file name=\"script.js\">\n\
      function Ctrl($scope) {\n\
        $scope.items = ['settings', 'home', 'other'];\n\
        $scope.selection = $scope.items[0];\n\
      }\n\
    </file>\n\
    <file name=\"animations.css\">\n\
      .example-leave, .example-enter {\n\
        -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;\n\
        -moz-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;\n\
        -ms-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;\n\
        -o-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;\n\
        transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;\n\
\n\
        position:absolute;\n\
        top:0;\n\
        left:0;\n\
        right:0;\n\
        bottom:0;\n\
      }\n\
\n\
      .example-animate-container > * {\n\
        display:block;\n\
        padding:10px;\n\
      }\n\
\n\
      .example-enter {\n\
        top:-50px;\n\
      }\n\
      .example-enter.example-enter-active {\n\
        top:0;\n\
      }\n\
\n\
      .example-leave {\n\
        top:0;\n\
      }\n\
      .example-leave.example-leave-active {\n\
        top:50px;\n\
      }\n\
    </file>\n\
    <file name=\"scenario.js\">\n\
      it('should start in settings', function() {\n\
        expect(element('.doc-example-live [ng-switch]').text()).toMatch(/Settings Div/);\n\
      });\n\
      it('should change to home', function() {\n\
        select('selection').option('home');\n\
        expect(element('.doc-example-live [ng-switch]').text()).toMatch(/Home Span/);\n\
      });\n\
      it('should select default', function() {\n\
        select('selection').option('other');\n\
        expect(element('.doc-example-live [ng-switch]').text()).toMatch(/default/);\n\
      });\n\
    </file>\n\
  </example>\n\
 */\n\
var ngSwitchDirective = ['$animator', function($animator) {\n\
  return {\n\
    restrict: 'EA',\n\
    require: 'ngSwitch',\n\
\n\
    // asks for $scope to fool the BC controller module\n\
    controller: ['$scope', function ngSwitchController() {\n\
     this.cases = {};\n\
    }],\n\
    link: function(scope, element, attr, ngSwitchController) {\n\
      var animate = $animator(scope, attr);\n\
      var watchExpr = attr.ngSwitch || attr.on,\n\
          selectedTranscludes,\n\
          selectedElements,\n\
          selectedScopes = [];\n\
\n\
      scope.$watch(watchExpr, function ngSwitchWatchAction(value) {\n\
        for (var i= 0, ii=selectedScopes.length; i<ii; i++) {\n\
          selectedScopes[i].$destroy();\n\
          animate.leave(selectedElements[i]);\n\
        }\n\
\n\
        selectedElements = [];\n\
        selectedScopes = [];\n\
\n\
        if ((selectedTranscludes = ngSwitchController.cases['!' + value] || ngSwitchController.cases['?'])) {\n\
          scope.$eval(attr.change);\n\
          forEach(selectedTranscludes, function(selectedTransclude) {\n\
            var selectedScope = scope.$new();\n\
            selectedScopes.push(selectedScope);\n\
            selectedTransclude.transclude(selectedScope, function(caseElement) {\n\
              var anchor = selectedTransclude.element;\n\
\n\
              selectedElements.push(caseElement);\n\
              animate.enter(caseElement, anchor.parent(), anchor);\n\
            });\n\
          });\n\
        }\n\
      });\n\
    }\n\
  }\n\
}];\n\
\n\
var ngSwitchWhenDirective = ngDirective({\n\
  transclude: 'element',\n\
  priority: 500,\n\
  require: '^ngSwitch',\n\
  compile: function(element, attrs, transclude) {\n\
    return function(scope, element, attr, ctrl) {\n\
      ctrl.cases['!' + attrs.ngSwitchWhen] = (ctrl.cases['!' + attrs.ngSwitchWhen] || []);\n\
      ctrl.cases['!' + attrs.ngSwitchWhen].push({ transclude: transclude, element: element });\n\
    };\n\
  }\n\
});\n\
\n\
var ngSwitchDefaultDirective = ngDirective({\n\
  transclude: 'element',\n\
  priority: 500,\n\
  require: '^ngSwitch',\n\
  compile: function(element, attrs, transclude) {\n\
    return function(scope, element, attr, ctrl) {\n\
      ctrl.cases['?'] = (ctrl.cases['?'] || []);\n\
      ctrl.cases['?'].push({ transclude: transclude, element: element });\n\
    };\n\
  }\n\
});\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngTransclude\n\
 *\n\
 * @description\n\
 * Insert the transcluded DOM here.\n\
 *\n\
 * @element ANY\n\
 *\n\
 * @example\n\
   <doc:example module=\"transclude\">\n\
     <doc:source>\n\
       <script>\n\
         function Ctrl($scope) {\n\
           $scope.title = 'Lorem Ipsum';\n\
           $scope.text = 'Neque porro quisquam est qui dolorem ipsum quia dolor...';\n\
         }\n\
\n\
         angular.module('transclude', [])\n\
          .directive('pane', function(){\n\
             return {\n\
               restrict: 'E',\n\
               transclude: true,\n\
               scope: 'isolate',\n\
               locals: { title:'bind' },\n\
               template: '<div style=\"border: 1px solid black;\">' +\n\
                           '<div style=\"background-color: gray\">{{title}}</div>' +\n\
                           '<div ng-transclude></div>' +\n\
                         '</div>'\n\
             };\n\
         });\n\
       </script>\n\
       <div ng-controller=\"Ctrl\">\n\
         <input ng-model=\"title\"><br>\n\
         <textarea ng-model=\"text\"></textarea> <br/>\n\
         <pane title=\"{{title}}\">{{text}}</pane>\n\
       </div>\n\
     </doc:source>\n\
     <doc:scenario>\n\
        it('should have transcluded', function() {\n\
          input('title').enter('TITLE');\n\
          input('text').enter('TEXT');\n\
          expect(binding('title')).toEqual('TITLE');\n\
          expect(binding('text')).toEqual('TEXT');\n\
        });\n\
     </doc:scenario>\n\
   </doc:example>\n\
 *\n\
 */\n\
var ngTranscludeDirective = ngDirective({\n\
  controller: ['$transclude', '$element', function($transclude, $element) {\n\
    $transclude(function(clone) {\n\
      $element.append(clone);\n\
    });\n\
  }]\n\
});\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:ngView\n\
 * @restrict ECA\n\
 *\n\
 * @description\n\
 * # Overview\n\
 * `ngView` is a directive that complements the {@link ng.$route $route} service by\n\
 * including the rendered template of the current route into the main layout (`index.html`) file.\n\
 * Every time the current route changes, the included view changes with it according to the\n\
 * configuration of the `$route` service.\n\
 *\n\
 * Additionally, you can also provide animations via the ngAnimate attribute to animate the **enter**\n\
 * and **leave** effects.\n\
 *\n\
 * @animations\n\
 * enter - happens just after the ngView contents are changed (when the new view DOM element is inserted into the DOM)\n\
 * leave - happens just after the current ngView contents change and just before the former contents are removed from the DOM\n\
 *\n\
 * @scope\n\
 * @example\n\
    <example module=\"ngView\" animations=\"true\">\n\
      <file name=\"index.html\">\n\
        <div ng-controller=\"MainCntl as main\">\n\
          Choose:\n\
          <a href=\"Book/Moby\">Moby</a> |\n\
          <a href=\"Book/Moby/ch/1\">Moby: Ch1</a> |\n\
          <a href=\"Book/Gatsby\">Gatsby</a> |\n\
          <a href=\"Book/Gatsby/ch/4?key=value\">Gatsby: Ch4</a> |\n\
          <a href=\"Book/Scarlet\">Scarlet Letter</a><br/>\n\
\n\
          <div\n\
            ng-view\n\
            class=\"example-animate-container\"\n\
            ng-animate=\"{enter: 'example-enter', leave: 'example-leave'}\"></div>\n\
          <hr />\n\
\n\
          <pre>$location.path() = {{main.$location.path()}}</pre>\n\
          <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>\n\
          <pre>$route.current.params = {{main.$route.current.params}}</pre>\n\
          <pre>$route.current.scope.name = {{main.$route.current.scope.name}}</pre>\n\
          <pre>$routeParams = {{main.$routeParams}}</pre>\n\
        </div>\n\
      </file>\n\
\n\
      <file name=\"book.html\">\n\
        <div>\n\
          controller: {{book.name}}<br />\n\
          Book Id: {{book.params.bookId}}<br />\n\
        </div>\n\
      </file>\n\
\n\
      <file name=\"chapter.html\">\n\
        <div>\n\
          controller: {{chapter.name}}<br />\n\
          Book Id: {{chapter.params.bookId}}<br />\n\
          Chapter Id: {{chapter.params.chapterId}}\n\
        </div>\n\
      </file>\n\
\n\
      <file name=\"animations.css\">\n\
        .example-leave, .example-enter {\n\
          -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;\n\
          -moz-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;\n\
          -ms-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;\n\
          -o-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;\n\
          transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;\n\
        }\n\
\n\
        .example-animate-container {\n\
          position:relative;\n\
          height:100px;\n\
        }\n\
\n\
        .example-animate-container > * {\n\
          display:block;\n\
          width:100%;\n\
          border-left:1px solid black;\n\
\n\
          position:absolute;\n\
          top:0;\n\
          left:0;\n\
          right:0;\n\
          bottom:0;\n\
          padding:10px;\n\
        }\n\
\n\
        .example-enter {\n\
          left:100%;\n\
        }\n\
        .example-enter.example-enter-active {\n\
          left:0;\n\
        }\n\
\n\
        .example-leave { }\n\
        .example-leave.example-leave-active {\n\
          left:-100%;\n\
        }\n\
      </file>\n\
\n\
      <file name=\"script.js\">\n\
        angular.module('ngView', [], function($routeProvider, $locationProvider) {\n\
          $routeProvider.when('/Book/:bookId', {\n\
            templateUrl: 'book.html',\n\
            controller: BookCntl,\n\
            controllerAs: 'book'\n\
          });\n\
          $routeProvider.when('/Book/:bookId/ch/:chapterId', {\n\
            templateUrl: 'chapter.html',\n\
            controller: ChapterCntl,\n\
            controllerAs: 'chapter'\n\
          });\n\
\n\
          // configure html5 to get links working on jsfiddle\n\
          $locationProvider.html5Mode(true);\n\
        });\n\
\n\
        function MainCntl($route, $routeParams, $location) {\n\
          this.$route = $route;\n\
          this.$location = $location;\n\
          this.$routeParams = $routeParams;\n\
        }\n\
\n\
        function BookCntl($routeParams) {\n\
          this.name = \"BookCntl\";\n\
          this.params = $routeParams;\n\
        }\n\
\n\
        function ChapterCntl($routeParams) {\n\
          this.name = \"ChapterCntl\";\n\
          this.params = $routeParams;\n\
        }\n\
      </file>\n\
\n\
      <file name=\"scenario.js\">\n\
        it('should load and compile correct template', function() {\n\
          element('a:contains(\"Moby: Ch1\")').click();\n\
          var content = element('.doc-example-live [ng-view]').text();\n\
          expect(content).toMatch(/controller\\: ChapterCntl/);\n\
          expect(content).toMatch(/Book Id\\: Moby/);\n\
          expect(content).toMatch(/Chapter Id\\: 1/);\n\
\n\
          element('a:contains(\"Scarlet\")').click();\n\
          content = element('.doc-example-live [ng-view]').text();\n\
          expect(content).toMatch(/controller\\: BookCntl/);\n\
          expect(content).toMatch(/Book Id\\: Scarlet/);\n\
        });\n\
      </file>\n\
    </example>\n\
 */\n\
\n\
\n\
/**\n\
 * @ngdoc event\n\
 * @name ng.directive:ngView#$viewContentLoaded\n\
 * @eventOf ng.directive:ngView\n\
 * @eventType emit on the current ngView scope\n\
 * @description\n\
 * Emitted every time the ngView content is reloaded.\n\
 */\n\
var ngViewDirective = ['$http', '$templateCache', '$route', '$anchorScroll', '$compile',\n\
                       '$controller', '$animator',\n\
               function($http,   $templateCache,   $route,   $anchorScroll,   $compile,\n\
                        $controller,  $animator) {\n\
  return {\n\
    restrict: 'ECA',\n\
    terminal: true,\n\
    link: function(scope, element, attr) {\n\
      var lastScope,\n\
          onloadExp = attr.onload || '',\n\
          animate = $animator(scope, attr);\n\
\n\
      scope.$on('$routeChangeSuccess', update);\n\
      update();\n\
\n\
\n\
      function destroyLastScope() {\n\
        if (lastScope) {\n\
          lastScope.$destroy();\n\
          lastScope = null;\n\
        }\n\
      }\n\
\n\
      function clearContent() {\n\
        animate.leave(element.contents(), element);\n\
        destroyLastScope();\n\
      }\n\
\n\
      function update() {\n\
        var locals = $route.current && $route.current.locals,\n\
            template = locals && locals.$template;\n\
\n\
        if (template) {\n\
          clearContent();\n\
          var enterElements = jqLite('<div></div>').html(template).contents();\n\
          animate.enter(enterElements, element);\n\
\n\
          var link = $compile(enterElements),\n\
              current = $route.current,\n\
              controller;\n\
\n\
          lastScope = current.scope = scope.$new();\n\
          if (current.controller) {\n\
            locals.$scope = lastScope;\n\
            controller = $controller(current.controller, locals);\n\
            if (current.controllerAs) {\n\
              lastScope[current.controllerAs] = controller;\n\
            }\n\
            element.children().data('$ngControllerController', controller);\n\
          }\n\
\n\
          link(lastScope);\n\
          lastScope.$emit('$viewContentLoaded');\n\
          lastScope.$eval(onloadExp);\n\
\n\
          // $anchorScroll might listen on event...\n\
          $anchorScroll();\n\
        } else {\n\
          clearContent();\n\
        }\n\
      }\n\
    }\n\
  };\n\
}];\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:script\n\
 *\n\
 * @description\n\
 * Load content of a script tag, with type `text/ng-template`, into `$templateCache`, so that the\n\
 * template can be used by `ngInclude`, `ngView` or directive templates.\n\
 *\n\
 * @restrict E\n\
 * @param {'text/ng-template'} type must be set to `'text/ng-template'`\n\
 *\n\
 * @example\n\
  <doc:example>\n\
    <doc:source>\n\
      <script type=\"text/ng-template\" id=\"/tpl.html\">\n\
        Content of the template.\n\
      </script>\n\
\n\
      <a ng-click=\"currentTpl='/tpl.html'\" id=\"tpl-link\">Load inlined template</a>\n\
      <div id=\"tpl-content\" ng-include src=\"currentTpl\"></div>\n\
    </doc:source>\n\
    <doc:scenario>\n\
      it('should load template defined inside script tag', function() {\n\
        element('#tpl-link').click();\n\
        expect(element('#tpl-content').text()).toMatch(/Content of the template/);\n\
      });\n\
    </doc:scenario>\n\
  </doc:example>\n\
 */\n\
var scriptDirective = ['$templateCache', function($templateCache) {\n\
  return {\n\
    restrict: 'E',\n\
    terminal: true,\n\
    compile: function(element, attr) {\n\
      if (attr.type == 'text/ng-template') {\n\
        var templateUrl = attr.id,\n\
            // IE is not consistent, in scripts we have to read .text but in other nodes we have to read .textContent\n\
            text = element[0].text;\n\
\n\
        $templateCache.put(templateUrl, text);\n\
      }\n\
    }\n\
  };\n\
}];\n\
\n\
/**\n\
 * @ngdoc directive\n\
 * @name ng.directive:select\n\
 * @restrict E\n\
 *\n\
 * @description\n\
 * HTML `SELECT` element with angular data-binding.\n\
 *\n\
 * # `ngOptions`\n\
 *\n\
 * Optionally `ngOptions` attribute can be used to dynamically generate a list of `<option>`\n\
 * elements for a `<select>` element using an array or an object obtained by evaluating the\n\
 * `ngOptions` expression.\n\
 *ËË\n\
 * When an item in the select menu is select, the value of array element or object property\n\
 * represented by the selected option will be bound to the model identified by the `ngModel`\n\
 * directive of the parent select element.\n\
 *\n\
 * Optionally, a single hard-coded `<option>` element, with the value set to an empty string, can\n\
 * be nested into the `<select>` element. This element will then represent `null` or \"not selected\"\n\
 * option. See example below for demonstration.\n\
 *\n\
 * Note: `ngOptions` provides iterator facility for `<option>` element which should be used instead\n\
 * of {@link ng.directive:ngRepeat ngRepeat} when you want the\n\
 * `select` model to be bound to a non-string value. This is because an option element can currently\n\
 * be bound to string values only.\n\
 *\n\
 * @param {string} ngModel Assignable angular expression to data-bind to.\n\
 * @param {string=} name Property name of the form under which the control is published.\n\
 * @param {string=} required The control is considered valid only if value is entered.\n\
 * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to\n\
 *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of\n\
 *    `required` when you want to data-bind to the `required` attribute.\n\
 * @param {comprehension_expression=} ngOptions in one of the following forms:\n\
 *\n\
 *   * for array data sources:\n\
 *     * `label` **`for`** `value` **`in`** `array`\n\
 *     * `select` **`as`** `label` **`for`** `value` **`in`** `array`\n\
 *     * `label`  **`group by`** `group` **`for`** `value` **`in`** `array`\n\
 *     * `select` **`as`** `label` **`group by`** `group` **`for`** `value` **`in`** `array` **`track by`** `trackexpr`\n\
 *   * for object data sources:\n\
 *     * `label` **`for (`**`key` **`,`** `value`**`) in`** `object`\n\
 *     * `select` **`as`** `label` **`for (`**`key` **`,`** `value`**`) in`** `object`\n\
 *     * `label` **`group by`** `group` **`for (`**`key`**`,`** `value`**`) in`** `object`\n\
 *     * `select` **`as`** `label` **`group by`** `group`\n\
 *         **`for` `(`**`key`**`,`** `value`**`) in`** `object`\n\
 *\n\
 * Where:\n\
 *\n\
 *   * `array` / `object`: an expression which evaluates to an array / object to iterate over.\n\
 *   * `value`: local variable which will refer to each item in the `array` or each property value\n\
 *      of `object` during iteration.\n\
 *   * `key`: local variable which will refer to a property name in `object` during iteration.\n\
 *   * `label`: The result of this expression will be the label for `<option>` element. The\n\
 *     `expression` will most likely refer to the `value` variable (e.g. `value.propertyName`).\n\
 *   * `select`: The result of this expression will be bound to the model of the parent `<select>`\n\
 *      element. If not specified, `select` expression will default to `value`.\n\
 *   * `group`: The result of this expression will be used to group options using the `<optgroup>`\n\
 *      DOM element.\n\
 *   * `trackexpr`: Used when working with an array of objects. The result of this expression will be\n\
 *      used to identify the objects in the array. The `trackexpr` will most likely refer to the\n\
 *     `value` variable (e.g. `value.propertyName`).\n\
 *\n\
 * @example\n\
    <doc:example>\n\
      <doc:source>\n\
        <script>\n\
        function MyCntrl($scope) {\n\
          $scope.colors = [\n\
            {name:'black', shade:'dark'},\n\
            {name:'white', shade:'light'},\n\
            {name:'red', shade:'dark'},\n\
            {name:'blue', shade:'dark'},\n\
            {name:'yellow', shade:'light'}\n\
          ];\n\
          $scope.color = $scope.colors[2]; // red\n\
        }\n\
        </script>\n\
        <div ng-controller=\"MyCntrl\">\n\
          <ul>\n\
            <li ng-repeat=\"color in colors\">\n\
              Name: <input ng-model=\"color.name\">\n\
              [<a href ng-click=\"colors.splice($index, 1)\">X</a>]\n\
            </li>\n\
            <li>\n\
              [<a href ng-click=\"colors.push({})\">add</a>]\n\
            </li>\n\
          </ul>\n\
          <hr/>\n\
          Color (null not allowed):\n\
          <select ng-model=\"color\" ng-options=\"c.name for c in colors\"></select><br>\n\
\n\
          Color (null allowed):\n\
          <span  class=\"nullable\">\n\
            <select ng-model=\"color\" ng-options=\"c.name for c in colors\">\n\
              <option value=\"\">-- chose color --</option>\n\
            </select>\n\
          </span><br/>\n\
\n\
          Color grouped by shade:\n\
          <select ng-model=\"color\" ng-options=\"c.name group by c.shade for c in colors\">\n\
          </select><br/>\n\
\n\
\n\
          Select <a href ng-click=\"color={name:'not in list'}\">bogus</a>.<br>\n\
          <hr/>\n\
          Currently selected: {{ {selected_color:color}  }}\n\
          <div style=\"border:solid 1px black; height:20px\"\n\
               ng-style=\"{'background-color':color.name}\">\n\
          </div>\n\
        </div>\n\
      </doc:source>\n\
      <doc:scenario>\n\
         it('should check ng-options', function() {\n\
           expect(binding('{selected_color:color}')).toMatch('red');\n\
           select('color').option('0');\n\
           expect(binding('{selected_color:color}')).toMatch('black');\n\
           using('.nullable').select('color').option('');\n\
           expect(binding('{selected_color:color}')).toMatch('null');\n\
         });\n\
      </doc:scenario>\n\
    </doc:example>\n\
 */\n\
\n\
var ngOptionsDirective = valueFn({ terminal: true });\n\
var selectDirective = ['$compile', '$parse', function($compile,   $parse) {\n\
                         //0000111110000000000022220000000000000000000000333300000000000000444444444444444440000000005555555555555555500000006666666666666666600000000000000007777000000000000000000088888\n\
  var NG_OPTIONS_REGEXP = /^\\s*(.*?)(?:\\s+as\\s+(.*?))?(?:\\s+group\\s+by\\s+(.*))?\\s+for\\s+(?:([\\$\\w][\\$\\w\\d]*)|(?:\\(\\s*([\\$\\w][\\$\\w\\d]*)\\s*,\\s*([\\$\\w][\\$\\w\\d]*)\\s*\\)))\\s+in\\s+(.*?)(?:\\s+track\\s+by\\s+(.*?))?$/,\n\
      nullModelCtrl = {$setViewValue: noop};\n\
\n\
  return {\n\
    restrict: 'E',\n\
    require: ['select', '?ngModel'],\n\
    controller: ['$element', '$scope', '$attrs', function($element, $scope, $attrs) {\n\
      var self = this,\n\
          optionsMap = {},\n\
          ngModelCtrl = nullModelCtrl,\n\
          nullOption,\n\
          unknownOption;\n\
\n\
\n\
      self.databound = $attrs.ngModel;\n\
\n\
\n\
      self.init = function(ngModelCtrl_, nullOption_, unknownOption_) {\n\
        ngModelCtrl = ngModelCtrl_;\n\
        nullOption = nullOption_;\n\
        unknownOption = unknownOption_;\n\
      }\n\
\n\
\n\
      self.addOption = function(value) {\n\
        optionsMap[value] = true;\n\
\n\
        if (ngModelCtrl.$viewValue == value) {\n\
          $element.val(value);\n\
          if (unknownOption.parent()) unknownOption.remove();\n\
        }\n\
      };\n\
\n\
\n\
      self.removeOption = function(value) {\n\
        if (this.hasOption(value)) {\n\
          delete optionsMap[value];\n\
          if (ngModelCtrl.$viewValue == value) {\n\
            this.renderUnknownOption(value);\n\
          }\n\
        }\n\
      };\n\
\n\
\n\
      self.renderUnknownOption = function(val) {\n\
        var unknownVal = '? ' + hashKey(val) + ' ?';\n\
        unknownOption.val(unknownVal);\n\
        $element.prepend(unknownOption);\n\
        $element.val(unknownVal);\n\
        unknownOption.prop('selected', true); // needed for IE\n\
      }\n\
\n\
\n\
      self.hasOption = function(value) {\n\
        return optionsMap.hasOwnProperty(value);\n\
      }\n\
\n\
      $scope.$on('$destroy', function() {\n\
        // disable unknown option so that we don't do work when the whole select is being destroyed\n\
        self.renderUnknownOption = noop;\n\
      });\n\
    }],\n\
\n\
    link: function(scope, element, attr, ctrls) {\n\
      // if ngModel is not defined, we don't need to do anything\n\
      if (!ctrls[1]) return;\n\
\n\
      var selectCtrl = ctrls[0],\n\
          ngModelCtrl = ctrls[1],\n\
          multiple = attr.multiple,\n\
          optionsExp = attr.ngOptions,\n\
          nullOption = false, // if false, user will not be able to select it (used by ngOptions)\n\
          emptyOption,\n\
          // we can't just jqLite('<option>') since jqLite is not smart enough\n\
          // to create it in <select> and IE barfs otherwise.\n\
          optionTemplate = jqLite(document.createElement('option')),\n\
          optGroupTemplate =jqLite(document.createElement('optgroup')),\n\
          unknownOption = optionTemplate.clone();\n\
\n\
      // find \"null\" option\n\
      for(var i = 0, children = element.children(), ii = children.length; i < ii; i++) {\n\
        if (children[i].value == '') {\n\
          emptyOption = nullOption = children.eq(i);\n\
          break;\n\
        }\n\
      }\n\
\n\
      selectCtrl.init(ngModelCtrl, nullOption, unknownOption);\n\
\n\
      // required validator\n\
      if (multiple && (attr.required || attr.ngRequired)) {\n\
        var requiredValidator = function(value) {\n\
          ngModelCtrl.$setValidity('required', !attr.required || (value && value.length));\n\
          return value;\n\
        };\n\
\n\
        ngModelCtrl.$parsers.push(requiredValidator);\n\
        ngModelCtrl.$formatters.unshift(requiredValidator);\n\
\n\
        attr.$observe('required', function() {\n\
          requiredValidator(ngModelCtrl.$viewValue);\n\
        });\n\
      }\n\
\n\
      if (optionsExp) Options(scope, element, ngModelCtrl);\n\
      else if (multiple) Multiple(scope, element, ngModelCtrl);\n\
      else Single(scope, element, ngModelCtrl, selectCtrl);\n\
\n\
\n\
      ////////////////////////////\n\
\n\
\n\
\n\
      function Single(scope, selectElement, ngModelCtrl, selectCtrl) {\n\
        ngModelCtrl.$render = function() {\n\
          var viewValue = ngModelCtrl.$viewValue;\n\
\n\
          if (selectCtrl.hasOption(viewValue)) {\n\
            if (unknownOption.parent()) unknownOption.remove();\n\
            selectElement.val(viewValue);\n\
            if (viewValue === '') emptyOption.prop('selected', true); // to make IE9 happy\n\
          } else {\n\
            if (isUndefined(viewValue) && emptyOption) {\n\
              selectElement.val('');\n\
            } else {\n\
              selectCtrl.renderUnknownOption(viewValue);\n\
            }\n\
          }\n\
        };\n\
\n\
        selectElement.bind('change', function() {\n\
          scope.$apply(function() {\n\
            if (unknownOption.parent()) unknownOption.remove();\n\
            ngModelCtrl.$setViewValue(selectElement.val());\n\
          });\n\
        });\n\
      }\n\
\n\
      function Multiple(scope, selectElement, ctrl) {\n\
        var lastView;\n\
        ctrl.$render = function() {\n\
          var items = new HashMap(ctrl.$viewValue);\n\
          forEach(selectElement.find('option'), function(option) {\n\
            option.selected = isDefined(items.get(option.value));\n\
          });\n\
        };\n\
\n\
        // we have to do it on each watch since ngModel watches reference, but\n\
        // we need to work of an array, so we need to see if anything was inserted/removed\n\
        scope.$watch(function selectMultipleWatch() {\n\
          if (!equals(lastView, ctrl.$viewValue)) {\n\
            lastView = copy(ctrl.$viewValue);\n\
            ctrl.$render();\n\
          }\n\
        });\n\
\n\
        selectElement.bind('change', function() {\n\
          scope.$apply(function() {\n\
            var array = [];\n\
            forEach(selectElement.find('option'), function(option) {\n\
              if (option.selected) {\n\
                array.push(option.value);\n\
              }\n\
            });\n\
            ctrl.$setViewValue(array);\n\
          });\n\
        });\n\
      }\n\
\n\
      function Options(scope, selectElement, ctrl) {\n\
        var match;\n\
\n\
        if (! (match = optionsExp.match(NG_OPTIONS_REGEXP))) {\n\
          throw Error(\n\
            \"Expected ngOptions in form of '_select_ (as _label_)? for (_key_,)?_value_ in _collection_ (track by _expr_)?'\" +\n\
            \" but got '\" + optionsExp + \"'.\");\n\
        }\n\
\n\
        var displayFn = $parse(match[2] || match[1]),\n\
            valueName = match[4] || match[6],\n\
            keyName = match[5],\n\
            groupByFn = $parse(match[3] || ''),\n\
            valueFn = $parse(match[2] ? match[1] : valueName),\n\
            valuesFn = $parse(match[7]),\n\
            track = match[8],\n\
            trackFn = track ? $parse(match[8]) : null,\n\
            // This is an array of array of existing option groups in DOM. We try to reuse these if possible\n\
            // optionGroupsCache[0] is the options with no option group\n\
            // optionGroupsCache[?][0] is the parent: either the SELECT or OPTGROUP element\n\
            optionGroupsCache = [[{element: selectElement, label:''}]];\n\
\n\
        if (nullOption) {\n\
          // compile the element since there might be bindings in it\n\
          $compile(nullOption)(scope);\n\
\n\
          // remove the class, which is added automatically because we recompile the element and it\n\
          // becomes the compilation root\n\
          nullOption.removeClass('ng-scope');\n\
\n\
          // we need to remove it before calling selectElement.html('') because otherwise IE will\n\
          // remove the label from the element. wtf?\n\
          nullOption.remove();\n\
        }\n\
\n\
        // clear contents, we'll add what's needed based on the model\n\
        selectElement.html('');\n\
\n\
        selectElement.bind('change', function() {\n\
          scope.$apply(function() {\n\
            var optionGroup,\n\
                collection = valuesFn(scope) || [],\n\
                locals = {},\n\
                key, value, optionElement, index, groupIndex, length, groupLength;\n\
\n\
            if (multiple) {\n\
              value = [];\n\
              for (groupIndex = 0, groupLength = optionGroupsCache.length;\n\
                   groupIndex < groupLength;\n\
                   groupIndex++) {\n\
                // list of options for that group. (first item has the parent)\n\
                optionGroup = optionGroupsCache[groupIndex];\n\
\n\
                for(index = 1, length = optionGroup.length; index < length; index++) {\n\
                  if ((optionElement = optionGroup[index].element)[0].selected) {\n\
                    key = optionElement.val();\n\
                    if (keyName) locals[keyName] = key;\n\
                    if (trackFn) {\n\
                      for (var trackIndex = 0; trackIndex < collection.length; trackIndex++) {\n\
                        locals[valueName] = collection[trackIndex];\n\
                        if (trackFn(scope, locals) == key) break;\n\
                      } \n\
                    } else {\n\
                      locals[valueName] = collection[key];\n\
                    }\n\
                    value.push(valueFn(scope, locals));\n\
                  }\n\
                }\n\
              }\n\
            } else {\n\
              key = selectElement.val();\n\
              if (key == '?') {\n\
                value = undefined;\n\
              } else if (key == ''){\n\
                value = null;\n\
              } else {\n\
                if (trackFn) {\n\
                  for (var trackIndex = 0; trackIndex < collection.length; trackIndex++) {\n\
                    locals[valueName] = collection[trackIndex];\n\
                    if (trackFn(scope, locals) == key) {\n\
                      value = valueFn(scope, locals);\n\
                      break;\n\
                    }\n\
                  }\n\
                } else {\n\
                  locals[valueName] = collection[key];\n\
                  if (keyName) locals[keyName] = key;\n\
                  value = valueFn(scope, locals);\n\
                }\n\
              }\n\
            }\n\
            ctrl.$setViewValue(value);\n\
          });\n\
        });\n\
\n\
        ctrl.$render = render;\n\
\n\
        // TODO(vojta): can't we optimize this ?\n\
        scope.$watch(render);\n\
\n\
        function render() {\n\
          var optionGroups = {'':[]}, // Temporary location for the option groups before we render them\n\
              optionGroupNames = [''],\n\
              optionGroupName,\n\
              optionGroup,\n\
              option,\n\
              existingParent, existingOptions, existingOption,\n\
              modelValue = ctrl.$modelValue,\n\
              values = valuesFn(scope) || [],\n\
              keys = keyName ? sortedKeys(values) : values,\n\
              groupLength, length,\n\
              groupIndex, index,\n\
              locals = {},\n\
              selected,\n\
              selectedSet = false, // nothing is selected yet\n\
              lastElement,\n\
              element,\n\
              label;\n\
\n\
          if (multiple) {\n\
            if (trackFn && isArray(modelValue)) {\n\
              selectedSet = new HashMap([]);\n\
              for (var trackIndex = 0; trackIndex < modelValue.length; trackIndex++) {\n\
                locals[valueName] = modelValue[trackIndex];\n\
                selectedSet.put(trackFn(scope, locals), modelValue[trackIndex]);\n\
              }\n\
            } else {\n\
              selectedSet = new HashMap(modelValue);\n\
            }\n\
          }\n\
\n\
          // We now build up the list of options we need (we merge later)\n\
          for (index = 0; length = keys.length, index < length; index++) {\n\
               locals[valueName] = values[keyName ? locals[keyName]=keys[index]:index];\n\
               optionGroupName = groupByFn(scope, locals) || '';\n\
            if (!(optionGroup = optionGroups[optionGroupName])) {\n\
              optionGroup = optionGroups[optionGroupName] = [];\n\
              optionGroupNames.push(optionGroupName);\n\
            }\n\
            if (multiple) {\n\
              selected = selectedSet.remove(trackFn ? trackFn(scope, locals) : valueFn(scope, locals)) != undefined;\n\
            } else {\n\
              if (trackFn) {\n\
                var modelCast = {};\n\
                modelCast[valueName] = modelValue;\n\
                selected = trackFn(scope, modelCast) === trackFn(scope, locals);\n\
              } else {\n\
                selected = modelValue === valueFn(scope, locals);\n\
              }\n\
              selectedSet = selectedSet || selected; // see if at least one item is selected\n\
            }\n\
            label = displayFn(scope, locals); // what will be seen by the user\n\
            label = label === undefined ? '' : label; // doing displayFn(scope, locals) || '' overwrites zero values\n\
            optionGroup.push({\n\
              id: trackFn ? trackFn(scope, locals) : (keyName ? keys[index] : index),   // either the index into array or key from object\n\
              label: label,\n\
              selected: selected                   // determine if we should be selected\n\
            });\n\
          }\n\
          if (!multiple) {\n\
            if (nullOption || modelValue === null) {\n\
              // insert null option if we have a placeholder, or the model is null\n\
              optionGroups[''].unshift({id:'', label:'', selected:!selectedSet});\n\
            } else if (!selectedSet) {\n\
              // option could not be found, we have to insert the undefined item\n\
              optionGroups[''].unshift({id:'?', label:'', selected:true});\n\
            }\n\
          }\n\
\n\
          // Now we need to update the list of DOM nodes to match the optionGroups we computed above\n\
          for (groupIndex = 0, groupLength = optionGroupNames.length;\n\
               groupIndex < groupLength;\n\
               groupIndex++) {\n\
            // current option group name or '' if no group\n\
            optionGroupName = optionGroupNames[groupIndex];\n\
\n\
            // list of options for that group. (first item has the parent)\n\
            optionGroup = optionGroups[optionGroupName];\n\
\n\
            if (optionGroupsCache.length <= groupIndex) {\n\
              // we need to grow the optionGroups\n\
              existingParent = {\n\
                element: optGroupTemplate.clone().attr('label', optionGroupName),\n\
                label: optionGroup.label\n\
              };\n\
              existingOptions = [existingParent];\n\
              optionGroupsCache.push(existingOptions);\n\
              selectElement.append(existingParent.element);\n\
            } else {\n\
              existingOptions = optionGroupsCache[groupIndex];\n\
              existingParent = existingOptions[0];  // either SELECT (no group) or OPTGROUP element\n\
\n\
              // update the OPTGROUP label if not the same.\n\
              if (existingParent.label != optionGroupName) {\n\
                existingParent.element.attr('label', existingParent.label = optionGroupName);\n\
              }\n\
            }\n\
\n\
            lastElement = null;  // start at the beginning\n\
            for(index = 0, length = optionGroup.length; index < length; index++) {\n\
              option = optionGroup[index];\n\
              if ((existingOption = existingOptions[index+1])) {\n\
                // reuse elements\n\
                lastElement = existingOption.element;\n\
                if (existingOption.label !== option.label) {\n\
                  lastElement.text(existingOption.label = option.label);\n\
                }\n\
                if (existingOption.id !== option.id) {\n\
                  lastElement.val(existingOption.id = option.id);\n\
                }\n\
                // lastElement.prop('selected') provided by jQuery has side-effects\n\
                if (lastElement[0].selected !== option.selected) {\n\
                  lastElement.prop('selected', (existingOption.selected = option.selected));\n\
                }\n\
              } else {\n\
                // grow elements\n\
\n\
                // if it's a null option\n\
                if (option.id === '' && nullOption) {\n\
                  // put back the pre-compiled element\n\
                  element = nullOption;\n\
                } else {\n\
                  // jQuery(v1.4.2) Bug: We should be able to chain the method calls, but\n\
                  // in this version of jQuery on some browser the .text() returns a string\n\
                  // rather then the element.\n\
                  (element = optionTemplate.clone())\n\
                      .val(option.id)\n\
                      .attr('selected', option.selected)\n\
                      .text(option.label);\n\
                }\n\
\n\
                existingOptions.push(existingOption = {\n\
                    element: element,\n\
                    label: option.label,\n\
                    id: option.id,\n\
                    selected: option.selected\n\
                });\n\
                if (lastElement) {\n\
                  lastElement.after(element);\n\
                } else {\n\
                  existingParent.element.append(element);\n\
                }\n\
                lastElement = element;\n\
              }\n\
            }\n\
            // remove any excessive OPTIONs in a group\n\
            index++; // increment since the existingOptions[0] is parent element not OPTION\n\
            while(existingOptions.length > index) {\n\
              existingOptions.pop().element.remove();\n\
            }\n\
          }\n\
          // remove any excessive OPTGROUPs from select\n\
          while(optionGroupsCache.length > groupIndex) {\n\
            optionGroupsCache.pop()[0].element.remove();\n\
          }\n\
        }\n\
      }\n\
    }\n\
  }\n\
}];\n\
\n\
var optionDirective = ['$interpolate', function($interpolate) {\n\
  var nullSelectCtrl = {\n\
    addOption: noop,\n\
    removeOption: noop\n\
  };\n\
\n\
  return {\n\
    restrict: 'E',\n\
    priority: 100,\n\
    compile: function(element, attr) {\n\
      if (isUndefined(attr.value)) {\n\
        var interpolateFn = $interpolate(element.text(), true);\n\
        if (!interpolateFn) {\n\
          attr.$set('value', element.text());\n\
        }\n\
      }\n\
\n\
      return function (scope, element, attr) {\n\
        var selectCtrlName = '$selectController',\n\
            parent = element.parent(),\n\
            selectCtrl = parent.data(selectCtrlName) ||\n\
              parent.parent().data(selectCtrlName); // in case we are in optgroup\n\
\n\
        if (selectCtrl && selectCtrl.databound) {\n\
          // For some reason Opera defaults to true and if not overridden this messes up the repeater.\n\
          // We don't want the view to drive the initialization of the model anyway.\n\
          element.prop('selected', false);\n\
        } else {\n\
          selectCtrl = nullSelectCtrl;\n\
        }\n\
\n\
        if (interpolateFn) {\n\
          scope.$watch(interpolateFn, function interpolateWatchAction(newVal, oldVal) {\n\
            attr.$set('value', newVal);\n\
            if (newVal !== oldVal) selectCtrl.removeOption(oldVal);\n\
            selectCtrl.addOption(newVal);\n\
          });\n\
        } else {\n\
          selectCtrl.addOption(attr.value);\n\
        }\n\
\n\
        element.bind('$destroy', function() {\n\
          selectCtrl.removeOption(attr.value);\n\
        });\n\
      };\n\
    }\n\
  }\n\
}];\n\
\n\
var styleDirective = valueFn({\n\
  restrict: 'E',\n\
  terminal: true\n\
});\n\
\n\
  //try to bind to jquery now so that one can write angular.element().read()\n\
  //but we will rebind on bootstrap again.\n\
  bindJQuery();\n\
\n\
  publishExternalAPI(angular);\n\
\n\
  jqLite(document).ready(function() {\n\
    angularInit(document, bootstrap);\n\
  });\n\
\n\
})(window, document);\n\
angular.element(document).find('head').append('<style type=\"text/css\">@charset \"UTF-8\";[ng\\\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak{display:none;}ng\\\\:form{display:block;}</style>');//@ sourceURL=binocarlos-angular-component/angular.js"
));

require.register("bootstrap-tree-for-angular/dist/abn_tree_directive.js", Function("exports, require, module",
"var module;\n\
var template = require('./abn_tree_template.js')\n\
module = angular.module('angularBootstrapNavTree', []);\n\
\n\
module.directive('abnTree', function($timeout) {\n\
  return {\n\
    restrict: 'E',\n\
    template: template,\n\
    scope: {\n\
      treeData: '=',\n\
      onSelect: '&',\n\
      initialSelection: '='\n\
    },\n\
    link: function(scope, element, attrs) {\n\
      var expand_level, for_each_branch, on_treeData_change, select_branch, selected_branch;\n\
      if (attrs.iconExpand == null) {\n\
        attrs.iconExpand = 'icon-plus';\n\
      }\n\
      if (attrs.iconCollapse == null) {\n\
        attrs.iconCollapse = 'icon-minus';\n\
      }\n\
      if (attrs.iconLeaf == null) {\n\
        attrs.iconLeaf = 'icon-chevron-right';\n\
      }\n\
      if (attrs.expandLevel == null) {\n\
        attrs.expandLevel = '3';\n\
      }\n\
      expand_level = parseInt(attrs.expandLevel, 10);\n\
      scope.header = attrs.header;\n\
      if (!scope.treeData) {\n\
        alert('no treeData defined for the tree!');\n\
      }\n\
      if (scope.treeData.length == null) {\n\
        if (treeData.label != null) {\n\
          scope.treeData = [treeData];\n\
        } else {\n\
          alert('treeData should be an array of root branches');\n\
        }\n\
      }\n\
      for_each_branch = function(f) {\n\
        var do_f, root_branch, _i, _len, _ref, _results;\n\
        do_f = function(branch, level) {\n\
          var child, _i, _len, _ref, _results;\n\
          f(branch, level);\n\
          if (branch.children != null) {\n\
            _ref = branch.children;\n\
            _results = [];\n\
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n\
              child = _ref[_i];\n\
              _results.push(do_f(child, level + 1));\n\
            }\n\
            return _results;\n\
          }\n\
        };\n\
        _ref = scope.treeData;\n\
        _results = [];\n\
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n\
          root_branch = _ref[_i];\n\
          _results.push(do_f(root_branch, 1));\n\
        }\n\
        return _results;\n\
      };\n\
      for_each_branch(function(b, level) {\n\
        b.level = level;\n\
        return b.expanded = b.level < expand_level;\n\
      });\n\
      selected_branch = null;\n\
      select_branch = function(branch) {\n\
        if (branch !== selected_branch) {\n\
          if (selected_branch != null) {\n\
            selected_branch.selected = false;\n\
          }\n\
          branch.selected = true;\n\
          selected_branch = branch;\n\
          if (branch.onSelect != null) {\n\
            return $timeout(function() {\n\
              return branch.onSelect(branch);\n\
            });\n\
          } else {\n\
            if (scope.onSelect != null) {\n\
              return $timeout(function() {\n\
                return scope.onSelect({\n\
                  branch: branch\n\
                });\n\
              });\n\
            }\n\
          }\n\
        }\n\
      };\n\
      scope.user_clicks_branch = function(branch) {\n\
        if (branch !== selected_branch) {\n\
          return select_branch(branch);\n\
        }\n\
      };\n\
      scope.tree_rows = [];\n\
      on_treeData_change = function() {\n\
        var add_branch_to_list, root_branch, _i, _len, _ref, _results;\n\
        scope.tree_rows = [];\n\
        for_each_branch(function(branch) {\n\
          if (branch.children) {\n\
            if (branch.children.length > 0) {\n\
              return branch.children = branch.children.map(function(e) {\n\
                if (typeof e === 'string') {\n\
                  return {\n\
                    label: e,\n\
                    children: []\n\
                  };\n\
                } else {\n\
                  return e;\n\
                }\n\
              });\n\
            }\n\
          } else {\n\
            return branch.children = [];\n\
          }\n\
        });\n\
        for_each_branch(function(b, level) {\n\
          if (!b.uid) {\n\
            return b.uid = \"\" + Math.random();\n\
          }\n\
        });\n\
        add_branch_to_list = function(level, branch, visible) {\n\
          var child, child_visible, tree_icon, _i, _len, _ref, _results;\n\
          if (branch.expanded == null) {\n\
            branch.expanded = false;\n\
          }\n\
          if (!branch.children || branch.children.length === 0) {\n\
            tree_icon = attrs.iconLeaf;\n\
          } else {\n\
            if (branch.expanded) {\n\
              tree_icon = attrs.iconCollapse;\n\
            } else {\n\
              tree_icon = attrs.iconExpand;\n\
            }\n\
          }\n\
          scope.tree_rows.push({\n\
            level: level,\n\
            branch: branch,\n\
            label: branch.label,\n\
            tree_icon: tree_icon,\n\
            visible: visible\n\
          });\n\
          if (branch.children != null) {\n\
            _ref = branch.children;\n\
            _results = [];\n\
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n\
              child = _ref[_i];\n\
              child_visible = visible && branch.expanded;\n\
              _results.push(add_branch_to_list(level + 1, child, child_visible));\n\
            }\n\
            return _results;\n\
          }\n\
        };\n\
        _ref = scope.treeData;\n\
        _results = [];\n\
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n\
          root_branch = _ref[_i];\n\
          _results.push(add_branch_to_list(1, root_branch, true));\n\
        }\n\
        return _results;\n\
      };\n\
      if (attrs.initialSelection != null) {\n\
        for_each_branch(function(b) {\n\
          if (b.label === attrs.initialSelection) {\n\
            return select_branch(b);\n\
          }\n\
        });\n\
      }\n\
      return scope.$watch('treeData', on_treeData_change, true);\n\
    }\n\
  };\n\
});\n\
//@ sourceURL=bootstrap-tree-for-angular/dist/abn_tree_directive.js"
));
require.register("bootstrap-tree-for-angular/dist/abn_tree_template.js", Function("exports, require, module",
"module.exports = '\\n\
<ul class=\"nav nav-list abn-tree\">\\n\
  <li ng-repeat=\"row in tree_rows | filter:{visible:true} track by row.branch.uid\" ng-animate=\"\\'abn-tree-animate\\'\" ng-class=\"\\'level-\\' + {{ row.level }} + (row.branch.selected ? \\' active\\':\\'\\')\" class=\"abn-tree-row\"><a ng-click=\"user_clicks_branch(row.branch)\"><i ng-class=\"row.tree_icon\" ng-click=\"row.branch.expanded = !row.branch.expanded\" class=\"indented tree-icon\"> </i><span class=\"indented tree-label\">{{ row.label }}</span></a></li>\\n\
</ul>';//@ sourceURL=bootstrap-tree-for-angular/dist/abn_tree_template.js"
));


require.alias("binocarlos-angular-component/angular.js", "bootstrap-tree-for-angular/deps/angular/angular.js");
require.alias("binocarlos-angular-component/angular.js", "bootstrap-tree-for-angular/deps/angular/index.js");
require.alias("binocarlos-angular-component/angular.js", "angular/index.js");
require.alias("binocarlos-angular-component/angular.js", "binocarlos-angular-component/index.js");

require.alias("bootstrap-tree-for-angular/dist/abn_tree_directive.js", "bootstrap-tree-for-angular/index.js");