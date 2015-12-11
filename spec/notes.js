var Guitar = require('../src/guitar.js');
var chai = require('chai');
chai.should();

var guitar = new Guitar();
var $n = guitar.notes;

describe('notes', function() {
    describe('#parseNote()', function () {
        it('Should return 0 for smallest note', function () {
            $n.parseNote('C0').should.be.equal(0);
        });

        it('Should be more by 12 for next octave', function () {
            $n.parseNote('C1').should.be.equal(12);
        });

        it('Notes in one octave must be sorted', function () {
            var c = $n.parseNote('C0');
            var d = $n.parseNote('D0');
            var e = $n.parseNote('E0');
            var f = $n.parseNote('F0');
            var g = $n.parseNote('G0');
            var a = $n.parseNote('A0');
            var b = $n.parseNote('B0');

            c.should.be.below(d);
            d.should.be.below(e);
            e.should.be.below(f);
            f.should.be.below(g);
            g.should.be.below(a);
            a.should.be.below(b);
        });

        it('Must work correctly with alteration signs', function () {
            var c = $n.parseNote('C0');
            var cS = $n.parseNote('C#0');
            var cb = $n.parseNote('Cb0');

            c.should.be.below(cS);
            c.should.be.above(cb);
        });
    });

    describe('#showNote()', function () {
        it('Must be symmetric with parseNote', function () {
            var notes = ['C0', 'D1', 'E2', 'B3'];
            notes.forEach(function (note) {
                $n.showNote($n.parseNote(note)).should.be.equal(note);
            });
        });

        it('Must prefer sharps', function () {
            var notes = ['C#0', 'D#1', 'F#2', 'A#3'];
            notes.forEach(function (note) {
                $n.showNote($n.parseNote(note)).should.be.equal(note);
            });
        });

        it('Must work in simple mode', function () {
            var sharps = ['C#0', 'D#1', 'F#2', 'A#3'];
            sharps.forEach(function (note) {
                $n.showNote($n.parseNote(note), 'simple').should.be.equal(note.slice(0, 2));
            });

            var notes = ['C0', 'D1', 'F2', 'A3'];
            notes.forEach(function (note) {
                $n.showNote($n.parseNote(note), 'simple').should.be.equal(note.slice(0, 1));
            });
        });
    });
});