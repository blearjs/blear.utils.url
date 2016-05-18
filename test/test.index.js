/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var url = require('../src/index.js');


describe('index.js', function () {
    it('.parse', function (done) {
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

    it('.parse2', function (done) {
        var ret = url.parse('/a/b/c/d/e/f?a=2&#hash');

        expect(ret.protocol).toEqual('');
        expect(ret.base).toEqual('');
        expect(ret.pathname).toEqual('/a/b/c/d/e/f');
        expect(ret.querystring).toEqual('a=2&');
        expect(ret.hashstring).toEqual('#hash');

        done();
    });

    it('.stringify', function (done) {
        var ret1 = {
            protocol: 'http:',
            host: 'aa.bb.cc:9090',
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
        var rule = '/name/:name/page/:page?/';
        var ret1 = url.matchPath('/name/cloudcome/page/123/', rule);
        var ret2 = url.matchPath('/name/cloudcome/page/123', rule);
        var ret3 = url.matchPath('/name/cloudcome/page/', rule);
        var ret4 = url.matchPath('/name/cloudcome/page', rule);
        var ret5 = url.matchPath('/name/cloudcome/', rule);

        expect(ret1).not.toBe(null);
        expect(ret2).not.toBe(null);
        expect(ret3).not.toBe(null);
        expect(ret4).not.toBe(null);
        expect(ret5).toBe(null);

        expect(ret1.name).toBe('cloudcome');
        expect(ret1.page).toBe('123');
        expect(ret2.name).toBe('cloudcome');
        expect(ret2.page).toBe('123');
        expect(ret3.name).toBe('cloudcome');
        expect(ret3.page).toBe('');
        expect(ret4.name).toBe('cloudcome');
        expect(ret4.page).toBe('');

        done();
    });

    it('.assignQuery:string', function (done) {
        var url1 = '/?_=1';
        var url2 = url.assignQuery(url1, '_=2');

        expect(url2).toEqual('/?_=2');
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
});
