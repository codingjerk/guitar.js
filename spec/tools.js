var Guitar = require('../src/guitar.js');
var chai = require('chai');
chai.should();

var guitar = new Guitar();
var $t = guitar.tools;

describe('tools', function() {
    describe('#sum()', function () {
        it('should return 0 on empty array', function () {
            $t.sum([]).should.be.equal(0);
        });

        it('should return X on array with one element', function () {
            var x = 231;
            $t.sum([x]).should.be.equal(x);
        });

        it('should return sum for multiple elements', function () {
            $t.sum([1, 2, 3]).should.be.equal(6);
        });
    });

    describe('#max()', function () {
        it('should throw error on empty array', function () {
            (function() {
                $t.max([]);
            }).should.throw(Error);
        });

        it('should return X on array with one element', function () {
            var x = 231;
            $t.max([x]).should.be.equal(x);
        });

        it('should return max for multiple elements', function () {
            $t.max([1, 2, 3]).should.be.equal(3);
        });
    });

    describe('#min()', function () {
        it('should throw error on empty array', function () {
            (function() {
                $t.min([]);
            }).should.throw(Error);
        });

        it('should return X on array with one element', function () {
            var x = 231;
            $t.min([x]).should.be.equal(x);
        });

        it('should return min for multiple elements', function () {
            $t.min([1, 2, 3]).should.be.equal(1);
        });
    });

    describe('#range()', function () {
        it('should return range for [x..y]', function () {
            $t.range(1, 3).should.be.deep.equal([1, 2, 3]);
        });

        it('should affect by step', function () {
            $t.range(1, 5, 2).should.be.deep.equal([1, 3, 5]);
        });

        it('should return reversed for negative step', function () {
            $t.range(5, 1, -1).should.be.deep.equal([5, 4, 3, 2, 1]);
        });
    });

    describe('#rawCoeff()', function () {
        it('All values should be with same divisors', function () {
            var c = $t.rawCoeff();

            for (var i = 1; i < c.length; ++i) {
                var p = c[i - 1];
                var n = c[i];

                chai.assert.closeTo(p / n, Math.pow(2, 1 / 12), 1E-5);
            }
        });
    });

    describe('#parseColor()', function () {
        it('Must work with short notation', function () {
            $t.parseColor('#000').should.be.deep.equal([0, 0, 0]);
            $t.parseColor('#FFF').should.be.deep.equal([255, 255, 255]);
            $t.parseColor('#abc').should.be.deep.equal([17 * 10, 17 * 11, 17 * 12]);
        });

        it('Must work with long notation', function () {
            $t.parseColor('#000000').should.be.deep.equal([0, 0, 0]);
            $t.parseColor('#FFFFFF').should.be.deep.equal([255, 255, 255]);
            $t.parseColor('#AABBCC').should.be.deep.equal([17 * 10, 17 * 11, 17 * 12]);
        });

        it('Must work with rgb values', function () {
            $t.parseColor('rgb(1, 2, 3)').should.be.deep.equal([1, 2, 3]);
            $t.parseColor('rgb(0000, 0123, 000)').should.be.deep.equal([0, 123, 0]);
            chai.assert.equal($t.parseColor('rgb()'), null);
        });

        it('Must work with rgba values', function () {
            $t.parseColor('rgba(1, 2, 3, 1)').should.be.deep.equal([1, 2, 3, 1]);
            $t.parseColor('rgba(0000, 0123, 000, 0)').should.be.deep.equal([0, 123, 0, 0]);
            chai.assert.equal($t.parseColor('rgba()'), null);
        });
    });

    describe('#chooseForeground()', function () {
        it('Must be dark for light colors', function () {
            chai.assert($t.isDark($t.chooseForeground('#bbb')));
        });

        it('Must be light for dark colors', function () {
            chai.assert($t.isLight($t.chooseForeground('#333')));
        });
    });
});