var Guitar = require('../src/guitar.js');
var chai = require('chai');
chai.should();

var guitar = new Guitar();

describe('Guitar public interface', function() {
    describe('#constructor()', function () {
        it('Should return default guitar', function () {
            var guitar = new Guitar();
            guitar.should.be.an('object');
            guitar.should.have.property('settings');
        });

        it('Must allow to change settings in constructor', function () {
            var guitar = new Guitar('mock', {
                orientation: 'vertical',
            });

            guitar.should.have.property('settings');
            guitar.settings.should.have.property('orientation');
            guitar.settings.orientation.should.be.equal('vertical');
        });
    });

    describe('#init()', function () {
        it('Shouldn\'t work in node environment', function () {
            (function () {
                guitar.init();
            }).should.throw(ReferenceError);
        });
    });

    describe('#set()', function () {
        it('Must work with 2 arguments', function () {
            guitar.set('orientation', 'auto');
            guitar.should.have.property('settings');
            guitar.settings.should.have.property('orientation');
            guitar.settings.orientation.should.be.equal('auto');
        });

        it('Must work with one argument', function () {
            guitar.set({
                'string-order': 'right-to-left',
                scale: 'linear',
                'string-width': [1,2,3,4,5,6],
                'fret-number-side': 'left',
                'fret-signs': {
                    1: 'star',
                    2: 'double-star',
                    3: 'dot',
                    4: 'double-dot',
                },
            });
        });

        it('Must throw errors on bad orientation', function () {
            (function () {
                guitar.set('orientation', 'abracadabra');
            }).should.throw(Error);
        });

        it('Must throw errors on bad string-order', function () {
            (function () {
                guitar.set('string-order', 'abracadabra');
            }).should.throw(Error);
        });

        it('Must throw errors on bad scale', function () {
            (function () {
                guitar.set('scale', 'abracadabra');
            }).should.throw(Error);
        });

        it('Must throw errors on bad string-width', function () {
            (function () {
                guitar.set('string-width', null);
            }).should.throw(Error);
        });

        it('Must throw errors on bad signs', function () {
            (function () {
                guitar.set('signs', {
                    1: 'abracadabra',
                });
            }).should.throw(Error);
        });
    });
});