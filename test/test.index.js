/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var fun = require('../src/index.js');

var fn1 = function (a, b) {
    a = (this.a || 0) + (a || 0);
    b = (this.b || 0) + (b || 0);
    return a + b;
};
var context1 = {
    a: 1,
    b: 2
};
var context2 = {
    a: 3,
    b: 4
};

describe('index.js', function () {
    it('.noop', function () {
        var fn1 = fun.noop();
        var fn2 = fun.noop(fn1);
        var fn3 = function () {
            // ...
        };
        var fn4 = fun.noop(fn3);
        var fn5 = fun.noop();

        expect(typeof fn1).toEqual('function');
        expect(typeof fn2).toEqual('function');
        expect(typeof fn3).toEqual('function');
        expect(typeof fn4).toEqual('function');
        expect(typeof fn5).toEqual('function');
        expect(fn2).toBe(fn1);
        expect(fn3).toBe(fn3);
        expect(fn5).toBe(fn1);
    });

    it('.name', function () {
        var fn1 = function fn2() {

        };
        function fn3(){};
        expect(fun.name(function(){})).toEqual('anonymous');
        expect(fun.name(fn1)).toEqual('fn2');
        expect(fun.name(fn3)).toEqual('fn3');
    });

    it('.bind', function (done) {
        var fn2 = fun.bind(fn1, context1);
        var fn3 = fun.bind(fn1, context1, 10);
        var fn4 = fun.bind(fn1, context1, 10, 11);
        var fn5 = fun.bind(fn2, context2);
        var fn6 = fun.bind(fn2, context2, 10);
        var fn7 = fun.bind(fn2, context2, 10, 11);
        var fn8 = fun.bind(fn3, context2);
        var fn9 = fun.bind(fn3, context2, 10);
        var fn10 = fun.bind(fn3, context2, 10, 11);
        var fn11 = fun.bind(fn4, context2);
        var fn12 = fun.bind(fn4, context2, 10);
        var fn13 = fun.bind(fn4, context2, 10, 11);

        expect(fn2()).toEqual(3);
        expect(fn2(3)).toEqual(6);
        expect(fn2(3, 4)).toEqual(10);
        expect(fn2.call(context2)).toEqual(3);
        expect(fn2.call(context2, 3)).toEqual(6);
        expect(fn2.call(context2, 3, 4)).toEqual(10);

        expect(fn3()).toEqual(13);
        expect(fn3(3)).toEqual(16);
        expect(fn3(3, 4)).toEqual(16);
        expect(fn3.call(context2)).toEqual(13);
        expect(fn3.call(context2, 3)).toEqual(16);
        expect(fn3.call(context2, 3, 4)).toEqual(16);

        expect(fn4()).toEqual(24);
        expect(fn4(3)).toEqual(24);
        expect(fn4(3, 4)).toEqual(24);
        expect(fn4.call(context2)).toEqual(24);
        expect(fn4.call(context2, 3)).toEqual(24);
        expect(fn4.call(context2, 3, 4)).toEqual(24);

        expect(fn5()).toEqual(3);
        expect(fn5(3)).toEqual(6);
        expect(fn5(3, 4)).toEqual(10);
        expect(fn5.call(context2)).toEqual(3);
        expect(fn5.call(context2, 3)).toEqual(6);
        expect(fn5.call(context2, 3, 4)).toEqual(10);

        expect(fn6()).toEqual(13);
        expect(fn6(3)).toEqual(16);
        expect(fn6(3, 4)).toEqual(16);
        expect(fn6.call(context2)).toEqual(13);
        expect(fn6.call(context2, 3)).toEqual(16);
        expect(fn6.call(context2, 3, 4)).toEqual(16);

        expect(fn7()).toEqual(24);
        expect(fn7(3)).toEqual(24);
        expect(fn7(3, 4)).toEqual(24);
        expect(fn7.call(context2)).toEqual(24);
        expect(fn7.call(context2, 3)).toEqual(24);
        expect(fn7.call(context2, 3, 4)).toEqual(24);

        expect(fn8()).toEqual(13);
        expect(fn8(3)).toEqual(16);
        expect(fn8(3, 4)).toEqual(16);
        expect(fn8.call(context2)).toEqual(13);
        expect(fn8.call(context2, 3)).toEqual(16);
        expect(fn8.call(context2, 3, 4)).toEqual(16);

        expect(fn9()).toEqual(23);
        expect(fn9(3)).toEqual(23);
        expect(fn9(3, 4)).toEqual(23);
        expect(fn9.call(context2)).toEqual(23);
        expect(fn9.call(context2, 3)).toEqual(23);
        expect(fn9.call(context2, 3, 4)).toEqual(23);

        expect(fn10()).toEqual(23);
        expect(fn10(3)).toEqual(23);
        expect(fn10(3, 4)).toEqual(23);
        expect(fn10.call(context2)).toEqual(23);
        expect(fn10.call(context2, 3)).toEqual(23);
        expect(fn10.call(context2, 3, 4)).toEqual(23);

        expect(fn11()).toEqual(24);
        expect(fn11(3)).toEqual(24);
        expect(fn11(3, 4)).toEqual(24);
        expect(fn11.call(context2)).toEqual(24);
        expect(fn11.call(context2, 3)).toEqual(24);
        expect(fn11.call(context2, 3, 4)).toEqual(24);

        expect(fn12()).toEqual(24);
        expect(fn12(3)).toEqual(24);
        expect(fn12(3, 4)).toEqual(24);
        expect(fn12.call(context2)).toEqual(24);
        expect(fn12.call(context2, 3)).toEqual(24);
        expect(fn12.call(context2, 3, 4)).toEqual(24);

        expect(fn13()).toEqual(24);
        expect(fn13(3)).toEqual(24);
        expect(fn13(3, 4)).toEqual(24);
        expect(fn13.call(context2)).toEqual(24);
        expect(fn13.call(context2, 3)).toEqual(24);
        expect(fn13.call(context2, 3, 4)).toEqual(24);

        done();
    });


    // 重复
    var repeat = function (times, callback, complete) {
        var index = 0;
        var timeid = setInterval(function () {
            index++;

            if (index >= times) {
                clearInterval(timeid);
                complete && complete();
            } else {
                callback();
            }
        }, 1);
    };

    it('.throttle', function (done) {
        var times = 100;
        var index = 0;
        repeat(times, fun.throttle(function () {
            index++;
        }), function () {
            expect(index < times).toBe(true);
            done();
        });
    });

    it('.debounce', function (done) {
        var times = 100;
        var index = 0;
        repeat(times, fun.debounce(function () {
            index++;
            expect(index).toEqual(1);
            done();
        }));
    });

    it('.once', function (done) {
        var times = 0;
        var index = 0;
        var fn5 = fun.once(function () {
            times++;
        });

        while (index++ < 10) {
            fn5();
        }

        expect(times).toEqual(1);
        done();
    });

    it('.toggle', function (done) {
        var count = 0;
        var fns = [];

        fns.push(function () {
            count += 1;
        });

        fns.push(function () {
            count += 2;
        });

        fns.push(function () {
            count += 3;
        });

        fns.push(function () {
            count += 4;
        });

        var list1 = fns.slice(0, 1);
        var list2 = fns.slice(0, 2);
        var list3 = fns.slice(0, 3);
        var list4 = fns.slice(0, 4);

        var fn1 = fun.toggle.apply(fun, list1);
        var fn2 = fun.toggle.apply(fun, list2);
        var fn3 = fun.toggle.apply(fun, list3);
        var fn4 = fun.toggle.apply(fun, list4);

        // toggle:1
        var index = 0;
        while (index++ < 120) {
            fn1();
        }
        expect(count).toEqual(120 * 1);

        // toggle:2
        index = 0;
        count = 0;
        while (index++ < 120) {
            fn2();
        }
        expect(count).toEqual(60 * 1 + 60 * 2);

        // toggle:3
        index = 0;
        count = 0;
        while (index++ < 120) {
            fn3();
        }
        expect(count).toEqual(40 * 1 + 40 * 2 + 40 * 3);

        // toggle:4
        index = 0;
        count = 0;
        while (index++ < 120) {
            fn4();
        }
        expect(count).toEqual(30 * 1 + 30 * 2 + 30 * 3 + 30 * 4);

        done();
    });

    it('.until', function (done) {
        var n1 = 0;
        var n2 = 0.6;
        var n3 = 0;

        fun.until(function () {
            console.log('n1:', n1, 'n2:', n2, 'n3:', n3);
            expect(n1).toBeGreaterThan(n2);
            done();
        }, function () {
            n1 = Math.random();
            n3++;
            return n1 > n2;
        });
    });
});
