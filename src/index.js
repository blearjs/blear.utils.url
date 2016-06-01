'use strict';

var querystring = require('blear.utils.querystring');
var array = require('blear.utils.array');
var object = require('blear.utils.object');
var typeis = require('blear.utils.typeis');
var access = require('blear.utils.access');
var path = require('blear.utils.path');

var rePathname = /[?#].*$/;
var reSearch = /\?.*$/;
var reHash = /#.*$/;
var reBase = /^(?:([^\/]+:)?\/\/)?([^\/:]+)(:\d+)?/;
var reEndSlash = /\/$/;
var reLastSlash = /\/(:\w+\?\/)/;
var reSep = /\//g;
var reColon = /:(\w+\b)/g;
var reStar = /\*/g;
var reIgnoreMatch = /^[.?#]/;


/**
 * url 解析
 * @param url {String} url 地址
 * @returns {{hash: String, host: String, hostname: String, href: String, pathname: String, port: String, protocol:String, querystring: String, query: Object, search: string, base: String}}
 */
var parse = exports.parse = function parse(url) {
    var href = url;
    var base = '';
    var protocol = '';
    var hostname = '';
    var port = '';

    if (!reIgnoreMatch.test(url)) {
        var matches = url.match(reBase);

        if (matches) {
            base = matches[0];
            protocol = matches[1] || '';
            hostname = matches[2];
            matches[3] = matches[3] || '';
            port = matches[3].slice(1) || '';
        }

        url = url.replace(reBase, '');
    }

    var hash = '';
    var search = '';

    url = url.replace(reHash, function (source) {
        hash = source;
        return '';
    });

    url = url.replace(reSearch, function (source) {
        search = source;
        return '';
    });

    var pathname = url.replace(rePathname, '');
    var qss = search.slice(1);

    return {
        href: href,
        base: base,
        protocol: protocol,
        host: hostname + (port ? ':' : '') + port,
        hostname: hostname,
        port: port,
        pathname: pathname,
        search: search,
        hash: hash,
        hashstring: hash,
        querystring: qss,
        query: querystring.parse(qss)
    };
};


/**
 * url 字符化
 * @param obj {Object} url 信息
 * @returns {string}
 */
var stringify = exports.stringify = function stringify(obj) {
    obj.protocol = obj.protocol || '';
    obj.host = obj.host || '';
    obj.pathname = obj.pathname || '';
    obj.search = obj.search || '';
    obj.hash = obj.hash || '';

    if (obj.query) {
        obj.search = querystring.stringify(obj.query);
        obj.search = obj.search ? '?' + obj.search : '';
    }

    return obj.protocol + (obj.protocol ? '//' : '' ) + obj.host + obj.pathname + obj.search + obj.hash;
};


var matchPathDefaults = exports.matchPathDefaults = {
    /**
     * 是否忽略大小写，默认 false
     * @type Boolean
     */
    ignoreCase: false,

    /**
     * 是否严格模式，默认 false，即默认忽略末尾“/”
     * @type Boolean
     */
    strict: false
};


/**
 * 匹配 URL path 部分
 * @param {String} url hash 字符串
 * @param {String} rule 路由规则
 * @param {Object} [options] 参数配置
 * @param {Object} [options.ignoreCase=false] 是否忽略大小写，默认 false
 * @param {Object} [options.strict=true] 是否忽略末尾斜杠，默认 true
 * @returns {*}
 *
 * @example
 * 语法：
 * `/name/:name/page/:page?/`
 * 匹配：
 * /name/cloudcome/page/123/
 * /name/cloudcome/page/123
 * /name/cloudcome/page/
 * /name/cloudcome/page
 *
 * hashbang.matches('/id/abc123/', '/id/:id/');
 * // =>
 * // {
     * //   id: "abc123"
     * // }
 *
 * hashbang.matches('/name/abc123/', '/id/:id/');
 * // => null
 */
exports.matchPath = function (url, rule, options) {
    // /id/:id/ => /id/abc123/   √

    options = object.assign({}, matchPathDefaults, options);

    var routeRuleOrigin = rule;
    var reg;
    var ret = null;
    var pathname = parse(url).pathname;

    if (!options.strict) {
        rule += reEndSlash.test(rule) ? '?' : '/?';
        rule = rule.replace(reLastSlash, '/?$1');
    }

    rule = rule
        .replace(reColon, (options.strict ? '?' : '') + '([^/]+)')
        .replace(reSep, '\\/')
        .replace(reStar, '.*');

    try {
        reg = new RegExp('^' + rule + '$', options.ignoreCase ? 'i' : '');
    } catch (err) {
        /* istanbul ignore next */
        return ret;
    }


    var keys = routeRuleOrigin.match(reColon) || [];
    var matches = pathname.match(reg);

    if (!matches) {
        return ret;
    }

    keys.unshift('');
    ret = {};

    array.each(keys, function (index, key) {
        if (index) {
            ret[key.slice(1)] = matches[index] || '';
        }
    });

    return ret;
};


/**
 * 分配 query
 * @param url {String} url
 * @param key {Object|String} 参数名、参数键值对、字符串
 * @param [val] {String} 参数值
 * @returns {*}
 */
exports.assignQuery = function (url, key, val) {
    var args = access.args(arguments);
    var query = {};

    // assignQuery(url, 'a', '1');
    if (args.length === 3) {
        query[key] = val;
    } else {
        // assignQuery(url, 'a=1&b=2');
        if (typeis.String(key)) {
            query = querystring.parse(key);
        }
        // assignQuery(url, {a:1,b:2});
        else {
            query = key;
        }
    }

    var urlParsed = parse(url);
    object.assign(urlParsed.query, query);

    return stringify(urlParsed);
};


var RESOLVE = 'resolve';
var JOIN = 'join';


/**
 * 处理路径
 * @param from {String} 起始路径
 * @param to {String} 目标路径
 * @param method {String} 方法
 * @returns {String}
 */
var add = function (from, to, method) {
    var fromRet = parse(from);
    var toRet = parse(to);

    if (toRet.host || toRet.protocol) {
        return to;
    }

    toRet.protocol = fromRet.protocol;
    toRet.host = fromRet.host;

    if (method === RESOLVE) {
        fromRet.pathname = path.dirname(fromRet.pathname);
    }

    toRet.pathname = path[method](fromRet.pathname, toRet.pathname);

    return stringify(toRet);
};


var buildExports = function (method) {
    /**
     * 合并、解决路径
     * @param from {String} 起始路径
     * @param to {String} 目标路径
     * @returns {String}
     */
    return function (from, to/*arguments*/) {
        var args = access.args(arguments);
        var current = 1;
        var end = args.length;
        var ret = args[0];

        while (current < end) {
            ret = add(ret, args[current], method);
            current++;
        }

        return ret;
    };
};


exports.resolve = buildExports(RESOLVE);
exports.join = buildExports(JOIN);

