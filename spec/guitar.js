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
});