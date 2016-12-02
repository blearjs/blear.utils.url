/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var url = require('../src/index.js');


describe('index.js', function () {
    it('.parse normal url', function (done) {
        var href = 'http://aa.bb.cc:9090/dd/ee/ff/?gg=hh&ii=jj&gg=kk#!/ll/mm/nn/?oo=pp&qq=rr&oo=ss#tt';
        var ret = url.parse(href);
        expect(ret.hash).toEqual('#!/ll/mm/nn/?oo=pp&qq=rr&oo=ss#tt');
        expect(ret.host).toEqual('aa.bb.cc:9090');
        expect(ret.hostname).toEqual('aa.bb.cc');
        expect(ret.href).toEqual(href);
        expect(ret.pathname).toEqual('/dd/ee/ff/');
        expect(ret.port).toEqual('9090');
        expect(ret.protocol).toEqual('http:');
        expect(ret.search).toEqual('?gg=hh&ii=jj&gg=kk');
        expect(ret.querystring).toEqual('gg=hh&ii=jj&gg=kk');
        expect(ret.query).toEqual({
            gg: ['hh', 'kk'],
            ii: 'jj'
        });
        expect(ret.base).toEqual('http://aa.bb.cc:9090');

        done();
    });

    it('.parse url path', function (done) {
        var ret = url.parse('/a/b/c/d/e/f?a=2&#hash');

        expect(ret.protocol).toEqual('');
        expect(ret.base).toEqual('');
        expect(ret.pathname).toEqual('/a/b/c/d/e/f');
        expect(ret.querystring).toEqual('a=2&');
        expect(ret.hashstring).toEqual('#hash');

        done();
    });

    it('parse domain path', function () {
        var ret = url.parse('a.com/d/e/f/');

        expect(ret.protocol).toEqual('');
        expect(ret.base).toEqual('');
        expect(ret.hostname).toEqual('');
        expect(ret.pathname).toEqual('a.com/d/e/f/');
    });

    it('parse path', function () {
        var ret = url.parse('d/e/f/');

        expect(ret.protocol).toEqual('');
        expect(ret.base).toEqual('');
        expect(ret.hostname).toEqual('');
        expect(ret.pathname).toEqual('d/e/f/');
    });

    it('.parse auto protocol url', function () {
        var ret = url.parse('//a.b/c/d?e=f&g=h#/i/j?k=l&m#n');

        expect(ret.protocol).toEqual('');
        expect(ret.hostname).toEqual('a.b');
        expect(ret.pathname).toEqual('/c/d');
        expect(ret.querystring).toEqual('e=f&g=h');
        expect(ret.hashstring).toEqual('#/i/j?k=l&m#n');
    });

    it('.stringify', function (done) {
        var ret1 = {
            origin: 'http://aa.bb.cc:9090',
            pathname: '/dd/ee/ff/',
            query: {
                gg: ['hh', 'kk'],
                ii: 'jj'
            },
            hash: '###'
        };
        var ret2 = url.stringify(ret1);
        expect(ret2).toEqual('http://aa.bb.cc:9090/dd/ee/ff/?gg=hh&gg=kk&ii=jj###');

        done();
    });

    it('.matchPath', function (done) {
        var rule = '/name/:name/page/:page/';
        var ret1 = url.matchPath('/name/cloudcome/page/123/', rule);
        var ret2 = url.matchPath('/name/cloudcome/page/123', rule);
        var ret3 = url.matchPath('/name/cloudcome/page/', rule);
        var ret4 = url.matchPath('/name/cloudcome/page', rule);
        var ret5 = url.matchPath('/name/cloudcome/', rule);

        expect(ret1).not.toBe(null);
        expect(ret2).not.toBe(null);
        expect(ret3).toBe(null);
        expect(ret4).toBe(null);
        expect(ret5).toBe(null);

        expect(ret1.name).toBe('cloudcome');
        expect(ret1.page).toBe('123');
        expect(ret2.name).toBe('cloudcome');
        expect(ret2.page).toBe('123');

        done();
    });

    it('.matchPath:*:strict=false', function (done) {
        var rule = '/name/*';
        var options = {
            strict: false
        };
        var ret01 = url.matchPath('/', rule, options);
        var ret02 = url.matchPath('/name', rule, options);
        var ret03 = url.matchPath('/name/', rule, options);
        var ret04 = url.matchPath('/name/cloudcome', rule, options);
        var ret05 = url.matchPath('/name/cloudcome/', rule, options);
        var ret06 = url.matchPath('/name/cloudcome/abc', rule, options);

        expect(Boolean(ret01)).toBe(false);
        expect(Boolean(ret02)).toBe(false);
        expect(Boolean(ret03)).toBe(false);
        expect(Boolean(ret04)).toBe(true);
        expect(Boolean(ret05)).toBe(true);
        expect(Boolean(ret06)).toBe(false);
        done();
    });

    it('.matchPath:*:strict=true', function (done) {
        var rule = '/name/*';
        var options = {
            strict: true
        };
        var ret01 = url.matchPath('/', rule, options);
        var ret02 = url.matchPath('/name', rule, options);
        var ret03 = url.matchPath('/name/', rule, options);
        var ret04 = url.matchPath('/name/cloudcome', rule, options);
        var ret05 = url.matchPath('/name/cloudcome/', rule, options);
        var ret06 = url.matchPath('/name/cloudcome/abc', rule, options);

        expect(Boolean(ret01)).toBe(false);
        expect(Boolean(ret02)).toBe(false);
        expect(Boolean(ret03)).toBe(false);
        expect(Boolean(ret04)).toBe(true);
        expect(Boolean(ret05)).toBe(false);
        expect(Boolean(ret06)).toBe(false);
        done();
    });

    it('.matchPath:**:strict=false', function (done) {
        var rule = '/name/**';
        var options = {
            strict: false
        };
        var ret01 = url.matchPath('/', rule, options);
        var ret02 = url.matchPath('/name', rule, options);
        var ret03 = url.matchPath('/name/', rule, options);
        var ret04 = url.matchPath('/name/cloudcome', rule, options);
        var ret05 = url.matchPath('/name/cloudcome/', rule, options);
        var ret06 = url.matchPath('/name/cloudcome/abc', rule, options);
        var ret07 = url.matchPath('/name/cloudcome/abc/', rule, options);
        var ret08 = url.matchPath('/name/cloudcome/abc/def', rule, options);
        var ret09 = url.matchPath('/name/cloudcome/abc/def/', rule, options);
        var ret10 = url.matchPath('/name/cloudcome/abc/def/ghi', rule, options);
        var ret11 = url.matchPath('/name/cloudcome/abc/def/ghi/', rule, options);

        expect(Boolean(ret01)).toBe(false);
        expect(Boolean(ret02)).toBe(false);
        expect(Boolean(ret03)).toBe(false);
        expect(Boolean(ret04)).toBe(true);
        expect(Boolean(ret05)).toBe(true);
        expect(Boolean(ret06)).toBe(true);
        expect(Boolean(ret07)).toBe(true);
        expect(Boolean(ret08)).toBe(true);
        expect(Boolean(ret09)).toBe(true);
        expect(Boolean(ret10)).toBe(true);
        expect(Boolean(ret11)).toBe(true);

        done();
    });

    it('.matchPath:**:strict=true', function (done) {
        var rule = '/name/**';
        var options = {
            strict: true
        };
        var ret01 = url.matchPath('/', rule, options);
        var ret02 = url.matchPath('/name', rule, options);
        var ret03 = url.matchPath('/name/', rule, options);
        var ret04 = url.matchPath('/name/cloudcome', rule, options);
        var ret05 = url.matchPath('/name/cloudcome/', rule, options);
        var ret06 = url.matchPath('/name/cloudcome/abc', rule, options);
        var ret07 = url.matchPath('/name/cloudcome/abc/', rule, options);
        var ret08 = url.matchPath('/name/cloudcome/abc/def', rule, options);
        var ret09 = url.matchPath('/name/cloudcome/abc/def/', rule, options);
        var ret10 = url.matchPath('/name/cloudcome/abc/def/ghi', rule, options);
        var ret11 = url.matchPath('/name/cloudcome/abc/def/ghi/', rule, options);

        expect(Boolean(ret01)).toBe(false);
        expect(Boolean(ret02)).toBe(false);
        expect(Boolean(ret03)).toBe(false);
        expect(Boolean(ret04)).toBe(true);
        expect(Boolean(ret05)).toBe(true);
        expect(Boolean(ret06)).toBe(true);
        expect(Boolean(ret07)).toBe(true);
        expect(Boolean(ret08)).toBe(true);
        expect(Boolean(ret09)).toBe(true);
        expect(Boolean(ret10)).toBe(true);
        expect(Boolean(ret11)).toBe(true);

        done();
    });

    it('.assignQuery:string', function (done) {
        var url1 = '/?_=1';
        var url2 = url.assignQuery(url1, '_=2');
        var url3 = url.assignQuery(url1, '_', 3);

        expect(url2).toEqual('/?_=2');
        expect(url3).toEqual('/?_=3');
        done();
    });

    it('.assignQuery:object', function (done) {
        var url1 = '/a/d/?x=1&y=2&z=3#hash';
        var url2 = url.assignQuery(url1, {
            x: 3,
            y: 4,
            ww: 100
        });

        // '/a/d/?x=3&y=4&z=3&ww=100#hash'
        expect(url2).toMatch(/x=3/);
        expect(url2).toMatch(/y=4/);
        expect(url2).toMatch(/z=3/);
        expect(url2).toMatch(/ww=100/);
        expect(url2).toMatch(/#hash$/);
        expect(url2).toMatch(/^\/a\/d\/\?/);

        done();
    });

    it('.removeQuery:String', function () {
        var url1 = '/a/b/c?d=e&f=g&h=i#abc';
        var url2 = url.removeQuery(url1, 'd');

        console.log(url2);
        expect(url2).not.toMatch(/d=e/);
    });

    it('.removeQuery:Array', function () {
        var url1 = '/a/b/c?d=e&f=g&h=i#abc';
        var url2 = url.removeQuery(url1, ['d', 'h']);

        console.log(url2);
        expect(url2).not.toMatch(/d=e/);
        expect(url2).not.toMatch(/h=i/);
    });

    it('.resolve', function () {
        expect(url.resolve('http://a.b.com/', '/c/d/?xx=123&dd=mm')).toEqual('http://a.b.com/c/d/?xx=123&dd=mm');
        expect(url.resolve('http://a.b.com/?xx=123&dd=mm', '/c/d/?xx=456&dd=nn')).toEqual('http://a.b.com/c/d/?xx=456&dd=nn');
        expect(url.resolve('http://a.b.com/a/b/?xx=123&dd=mm', '/c/d/?xx=456&dd=nn')).toEqual('http://a.b.com/c/d/?xx=456&dd=nn');
        expect(url.resolve('http://a.b.com/a/b/c', '../?x=1')).toEqual('http://a.b.com/a/?x=1');
        expect(url.resolve('http://a.b.com/a/b/c', './d?x=1')).toEqual('http://a.b.com/a/b/d?x=1');
        expect(url.resolve('//a.b.com/a/b/c', './d?x=1')).toEqual('//a.b.com/a/b/d?x=1');
        expect(url.resolve('//a.b.com/a/b/c', '//c.com')).toEqual('//c.com');
        expect(url.resolve('//a.b.com/a/b/c', '/c.com')).toEqual('//a.b.com/c.com');
    });

    it('.join', function () {
        expect(url.join('/', '/c/d/?xx=123&dd=mm')).toEqual('/c/d/?xx=123&dd=mm');
        expect(url.join('/', 'c/d/?xx=123&dd=mm')).toEqual('/c/d/?xx=123&dd=mm');
        expect(url.join('http://a.b.com/', '/c/d/?xx=123&dd=mm')).toEqual('http://a.b.com/c/d/?xx=123&dd=mm');
        expect(url.join('http://a.b.com/?xx=123&dd=mm', '/c/d/?xx=456&dd=nn')).toEqual('http://a.b.com/c/d/?xx=456&dd=nn');
        expect(url.join('http://a.b.com/a/b/?xx=123&dd=mm', '/c/d/?xx=456&dd=nn')).toEqual('http://a.b.com/a/b/c/d/?xx=456&dd=nn');
        expect(url.join('http://a.b.com/a/b/c', '../?x=1')).toEqual('http://a.b.com/a/b/?x=1');
        expect(url.join('http://a.b.com/a/b/c', './d?x=1')).toEqual('http://a.b.com/a/b/c/d?x=1');
        expect(url.join('//a.b.com/a/b/c', './d?x=1')).toEqual('//a.b.com/a/b/c/d?x=1');
        expect(url.join('//a.b.com/a/b/c', '//c.com')).toEqual('//c.com');
        expect(url.join('//a.b.com/a/b/c', '/c.com')).toEqual('//a.b.com/a/b/c/c.com');
    });

    it('qrcode', function () {
        console.log(url.qrcode('1'));
        console.log(url.qrcode({
            text: '1'
        }));
    });
});
