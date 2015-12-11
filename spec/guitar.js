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

    describe('#mark()', function () {
        it('Must set mark by 2 arguments', function () {
            guitar = new Guitar();

            guitar.isMarked(1, 1).should.be.equal(false);
            guitar.mark(1, 1);
            guitar.isMarked(1, 1).should.be.equal(true);
        });

        it('Must set mark by 1 argument', function () {
            guitar.isMarked(2, 4).should.be.equal(false);
            guitar.mark({
                fret: 4,
                string: 2,
            });
            guitar.isMarked(2, 4).should.be.equal(true);
        });
    });

    describe('#ummark()', function () {
        it('Must unset mark by 2 arguments', function () {
            guitar.isMarked(1, 1).should.be.equal(true);
            guitar.unmark(1, 1);
            guitar.isMarked(1, 1).should.be.equal(false);
        });

        it('Must unset mark by 1 argument', function () {
            guitar.isMarked(2, 4).should.be.equal(true);
            guitar.unmark({
                fret: 4,
                string: 2,
            });
            guitar.isMarked(2, 4).should.be.equal(false);
        });
    });

    describe('#switchMark()', function () {
        it('Must enable mark if not setted', function () {
            guitar.isMarked(1, 1).should.be.equal(false);
            guitar.switchMark(1, 1);
            guitar.isMarked(1, 1).should.be.equal(true);
        });

        it('Must disable mark if setted', function () {
            guitar.isMarked(1, 1).should.be.equal(true);
            guitar.switchMark(1, 1);
            guitar.isMarked(1, 1).should.be.equal(false);
        });
    });

    describe('#resetMarks()', function () {
        it('Must remove all marks', function () {
            guitar.mark(1, 1);
            guitar.mark(1, 2);
            guitar.mark(1, 3);
            guitar.mark(1, 4);

            guitar.resetMarks();

            guitar.isMarked(1, 1).should.be.equal(false);
            guitar.isMarked(1, 2).should.be.equal(false);
            guitar.isMarked(1, 3).should.be.equal(false);
            guitar.isMarked(1, 4).should.be.equal(false);
        });
    });

    describe('#tune()', function () {
        it('Must set tune by notes', function () {
            guitar.tune(['E2', 'A2', 'D3', 'G3', 'B3', 'E4']);
            guitar.settings.tuning.should.be.deep.equal(['E2', 'A2', 'D3', 'G3', 'B3', 'E4'].map(guitar.notes.parseNote));
        });

        it('Must set tune by name', function () {
            guitar.tune('default');
            guitar.settings.tuning.should.be.deep.equal(['E2', 'A2', 'D3', 'G3', 'B3', 'E4'].map(guitar.notes.parseNote));

            guitar.tune('drop-d');
            guitar.settings.tuning.should.be.deep.equal(['D2', 'A2', 'D3', 'G3', 'B3', 'E4'].map(guitar.notes.parseNote));
        });
    });
});