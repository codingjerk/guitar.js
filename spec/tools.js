var Guitar = require('../src/guitar.js');
var chai = require('chai');
chai.should();

var guitar = new Guitar();

describe('tools', function() {
    describe('#sum()', function () {
        it('should return 0 on empty array', function () {
            guitar.tools.sum([]).should.be.equal(0);
        });

        it('should return X on array with one element', function () {
            var x = 231;
            guitar.tools.sum([x]).should.be.equal(x);
        });

        it('should return sum for multiple elements', function () {
            guitar.tools.sum([1, 2, 3]).should.be.equal(6);
        });
    });

    describe('#max()', function () {
        it('should throw error on empty array', function () {
            (function() {
                guitar.tools.max([]);
            }).should.throw(Error);
        });

        it('should return X on array with one element', function () {
            var x = 231;
            guitar.tools.max([x]).should.be.equal(x);
        });

        it('should return max for multiple elements', function () {
            guitar.tools.max([1, 2, 3]).should.be.equal(3);
        });
    });

    describe('#min()', function () {
        it('should throw error on empty array', function () {
            (function() {
                guitar.tools.min([]);
            }).should.throw(Error);
        });

        it('should return X on array with one element', function () {
            var x = 231;
            guitar.tools.min([x]).should.be.equal(x);
        });

        it('should return min for multiple elements', function () {
            guitar.tools.min([1, 2, 3]).should.be.equal(1);
        });
    });
});