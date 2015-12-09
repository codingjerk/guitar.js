var Guitar = function (id, settings) {
    var guitar = this;
    var tools = {};
    var notes = {};
    var $s, $x, $c; // Aliases to settings, context and canvas

    guitar.create = function() {
        guitar.id = id;
        guitar.container = document.getElementById(id);
        guitar.container.style.overflow = 'hidden';

        guitar.canvas = document.createElement('canvas');

        guitar.container.appendChild(guitar.canvas);
        guitar.context = guitar.canvas.getContext('2d');

        $s = guitar.settings;
        $x = guitar.context;
        $c = guitar.canvas;

        addEventListener('resize', guitar.redraw);
    };

    guitar.updateSettings = function (settings) {
        for (var property in settings) {
            if (settings.hasOwnProperty(property)) {
                $s[property] = settings[property];
            }
        }

        $s['fret-count'] = $s['end-fret'] - $s['start-fret'] + 1;
        guitar.redraw();
    };

    guitar.redraw = function() {
        $c.width = guitar.container.offsetWidth;
        $c.height = guitar.container.offsetHeight;

        guitar.rebuildFrets();

        var width = $c.width;
        var height = $c.height;
        $x.clearRect(0, 0, width, height);

        for (var f = $s['start-fret']; f <= $s['end-fret']; ++f) {
            var sign = $s['fret-signs'][f];
            if (sign !== undefined) {
                guitar.drawSign(f, sign);
            }

            guitar.drawFret(f);
            guitar.drawFretNumber(f);
        }

        for (var i = 0; i < $s['string-count']; ++i) {
            guitar.drawString(i);
        }

        guitar.drawBridge();

        $s['marks'].forEach(guitar.drawMark);
    };

    guitar.rebuildFrets = function() {
        if (this.oldWidth === $c.width) return;

        if ($s['scale'] === 'real') {
            var coeff = guitar.getFretCoeff();
            guitar.fretXs = [0];
            for (var n = 0; n < $s['fret-count']; ++n) {
                guitar.fretXs[n] += coeff[n];
                guitar.fretXs[n + 1] = guitar.fretXs[n];
            }
        } else if ($s['scale'] === 'linear') {
            var realWidth = $c.width - $s['bridge-margin'] * 2;
            guitar.fretXs = [];
            for (var n = 0; n < $s['fret-count']; ++n) {
                guitar.fretXs[n] = realWidth * (n + 1) / $s['fret-count'];
            }
        } else {
            throw Error('Unknown scale option value: ' + $s['scale']);
        }

        this.oldWidth = $c.width;
    };

    guitar.getFretCoeff = function() {
        var raw = tools.rawCoeff().slice(0, $s['fret-count']);
        var realWidth = $c.width - $s['bridge-margin'] * 2;
        var mul = realWidth / tools.sum(raw);

        var result = [];
        for (var i = 0; i < $s['fret-count']; ++i) {
            result[i] = raw[i] * mul;
        }

        return result;
    };

    guitar.getFretX = function(fret) {
        if (fret === 0) return 0;
        return guitar.fretXs[fret - $s['start-fret']];
    };

    guitar.getInterFretX = function(fret, coeff) {
        coeff = coeff === undefined? 0.5: coeff;

        var fretPrev = guitar.getFretX(fret - 1) || 0;
        var fretNext = guitar.getFretX(fret);

        return (fretPrev * (1 - coeff) + fretNext * coeff);
    };

    guitar.getFretHeightByX = function(x) {
        var startHeight = $c.height - ($s['start-border-margin'] + $s['string-outer-margin']) * 2;
        var endHeight = $c.height - ($s['end-border-margin'] + $s['string-outer-margin']) * 2;
        var realWidth = $c.width - $s['bridge-margin'] * 2;

        return startHeight + (endHeight - startHeight) * (x / realWidth);
    };

    guitar.getFretHeight = function(fret) {
        var fretX = guitar.getFretX(fret);
        return guitar.getFretHeightByX(fretX);
    };

    guitar.getStringWidth = function(i) {
        var s = $s['string-width'];

        if (s instanceof Number) {
            return s;
        } else if (s instanceof Array) {
            return s[i];
        } else if (s instanceof Function) {
            return s(i);
        }

        throw Error("string-width must be Number, Array (of Numbers) or Function");
    };

    guitar.drawBridge = function() {
        var startX = $s['bridge-margin'];
        var startY = $s['start-border-margin'] - $s['bridge-ledge'];

        var endX = $s['bridge-margin'];
        var endY = $c.height - $s['start-border-margin'] + $s['bridge-ledge'];

        tools.drawLine(startX, startY, endX, endY, $s['bridge-color'], $s['bridge-width']);
    };

    guitar.drawString = function(i) {
        var startHeight = $c.height - ($s['start-border-margin'] + $s['string-outer-margin']) * 2;
        var startOffset = startHeight / ($s['string-count'] - 1);
        var startX = $s['bridge-margin'];
        var startY = $s['start-border-margin'] + $s['string-outer-margin'] + i * startOffset;

        var endHeight = $c.height - ($s['end-border-margin'] + $s['string-outer-margin']) * 2;
        var endOffset = endHeight / ($s['string-count'] - 1);
        var endX = $c.width - $s['space-margin'];
        var endY = $s['end-border-margin'] + $s['string-outer-margin'] + i * endOffset;

        tools.drawLine(startX, startY, endX, endY, $s['string-color'], guitar.getStringWidth(i));
    };

    guitar.drawFret = function(i) {
        var fretX = guitar.getFretX(i);
        var fretHeight = guitar.getFretHeight(i);
        var verticalOffset = ($c.height - fretHeight) / 2;

        var startX = fretX + $s['bridge-margin'];
        var startY = verticalOffset;

        var endX = startX;
        var endY = $c.height - verticalOffset;

        tools.drawLine(startX, startY, endX, endY, $s['fret-color'], $s['fret-width']);
    };

    guitar.drawFretNumber = function(f) {
        var fretX = guitar.getInterFretX(f) + $s['bridge-margin'];
        var fretHeight = guitar.getFretHeightByX(fretX);
        var verticalOffset = ($c.height - fretHeight) / 2;

        tools.drawText(f, fretX, $c.height - verticalOffset + $s['fret-number-margin'], 'top', $s['fret-number-font'], $s['fret-number-color']);
    };

    guitar.drawSign = function(fret, sign) {
        var centerX = guitar.getInterFretX(fret) + $s['bridge-margin'];
        var centerY = $c.height / 2;

        var fretHeight = guitar.getFretHeightByX(centerX);
        var doubleOffset = fretHeight / 4;

        var radius = $s['sign-size'];

        if (sign === 'dot') {
            tools.drawCircle(centerX, centerY, radius, $s['sign-color']);
        } else if (sign === 'star') {
            tools.drawStar(centerX, centerY, radius, 5, $s['sign-color']);
        } else if (sign === 'double-dot') {
            tools.drawCircle(centerX, centerY - doubleOffset, radius, $s['sign-color']);
            tools.drawCircle(centerX, centerY + doubleOffset, radius, $s['sign-color']);
        } else if (sign === 'double-star') {
            tools.drawStar(centerX, centerY - doubleOffset, radius, 5, $s['sign-color']);
            tools.drawStar(centerX, centerY + doubleOffset, radius, 5, $s['sign-color']);
        } else {
            throw Error("Unknown sign type: " + sign);
        }
    };

    guitar.drawMark = function(mark) {
        var fretX = guitar.getInterFretX(mark.fret, $s['mark-position']);
        var height = guitar.getFretHeightByX(fretX);
        var yOffset = ($c.height - height) / 2;

        var x = fretX + $s['bridge-margin'];
        var y = yOffset + height * mark.string / ($s['string-count'] - 1);

        var size = mark.size || $s['mark-size'];
        var color = mark.color || $s['mark-color'];

        tools.drawCircle(x, y, size, color);

        var text = mark.text || $s['mark-text'];
        if ($s['show-notes'] && !mark.text) {
            var stringNote = $s['tuning'][mark.string];
            var fretNote = stringNote + mark.fret;

            text = notes.showNote(fretNote);
        }

        var textColor = tools.chooseForeground(color);
        tools.drawText(text, x, y, 'middle', $s['mark-font'], textColor);
    };

    tools.drawLine = function(fromX, fromY, toX, toY, style, width) {
        $x.beginPath();

        $x.lineWidth = width;
        $x.strokeStyle = style;

        var padding = width % 2 === 0? 0: 0.5;

        $x.moveTo(Math.round(fromX) + padding, Math.round(fromY) + padding);
        $x.lineTo(Math.round(toX) + padding, Math.round(toY) + padding);

        $x.stroke();
        $x.closePath();
    };

    tools.drawCircle = function(centerX, centerY, radius, color) {
        $x.beginPath();
        $x.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        $x.fillStyle = color;
        $x.fill();
        $x.closePath();
    };

    tools.drawText = function(text, x, y, valign, font, color) {
        $x.font = font;
        $x.textAlign = 'center';
        $x.fillStyle = color;
        $x.textBaseline = valign;
        $x.fillText(text, x, y);
    };

    tools.drawStar = function(x, y, radius, pikes, color) {
        $x.save();
        $x.beginPath();
        $x.translate(x, y);
        $x.fillStyle = color;
        $x.moveTo(0, 0 - radius);

        for (var i = 0; i < pikes; i++) {
            $x.rotate(Math.PI / pikes);
            $x.lineTo(0, 0 - radius * 0.5);
            $x.rotate(Math.PI / pikes);
            $x.lineTo(0, 0 - radius);
        }

        $x.fill();
        $x.closePath();
        $x.restore();
    };

    tools.sum = function(list) {
        return list.reduce(function(acc, x) {
            return acc + x;
        });
    };

    tools.rawCoeff = function() {
        if (this.result === undefined) {
            this.result = [];
            for (var i = 0; i < 100; ++i) {
                this.result[i] = Math.pow(2, -i / 12);
            }
        }

        return this.result;
    };

    tools.parseColor = function(val) {
        var toInt = function(x) {return parseInt(x, 10);};

        // #xxxxxx
        var r = val.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
        if (r) {
            return r.slice(1,4).map(function(x) { return parseInt(x, 16); });
        }

        // #xxx
        var r = val.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
        if (r) {
            return r.slice(1,4).map(function(x) { return 0x11 * parseInt(x, 16); });
        }

        // rgb(x, x, x)
        var digits = /(.*?)rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(val);
        if (digits.length === 5) {
            return digits.slice(2).map(toInt);
        }

        return null;
    };

    tools.chooseForeground = function(backgroud) {
        var rgb = tools.parseColor(backgroud);
        var sum = tools.sum(rgb);
        var limit = 127 * 3;

        if (sum >= limit) {
            return '#333';
        } else {
            return '#fafafa';
        }
    };

    notes.parseNote = function(text) {
        var note = text[0];
        var alter = text[1];
        var octave = text[text.length - 1];

        var modifier = 0;
        if (alter === '#') {
            modifier = 1;
        } else if (alter === 'b') {
            modifier = -1;
        }

        var noteIndex = 'C-D-EF-G-A-B'.indexOf(note);
        var withModifier = noteIndex + modifier;
        var octaveIndex = parseInt(octave);
        var absoluteValue = withModifier + 12 * octaveIndex;

        return absoluteValue;
    };

    notes.showNote = function(index) {
        var note = index % 12;
        var octave = (index - note) / 12;

        var result = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][note] + octave;
        return result;
    };

    guitar.settings = {
        'bridge-margin': 12,
        'start-border-margin': 20,
        'end-border-margin': 20,
        'string-outer-margin': 3,
        'space-margin': 5,
        'fret-number-margin': 7,
        'mark-position': 0.65,

        'string-color': '#000',
        'bridge-color': '#999',
        'fret-color': '#bbb',
        'sign-color': '#bbb',
        'fret-number-color': '#bbb',
        'mark-color': '#6b7',

        'string-width': [1, 1, 2, 2, 3, 4],
        'bridge-width': 8,
        'fret-width': 4,
        'fret-number-font': '12px sans-serif',
        'mark-font': '12px sans-serif',
        'sign-size': 5,
        'mark-size': 10,

        'bridge-ledge': 0,

        'orientation': 'horizontal',
        'scale': 'real',

        'mark-text': 'M',
        'show-notes': true,

        'string-count': 6,

        'start-fret': 1,
        'end-fret': 24,

        'tuning': ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'].map(notes.parseNote),

        'fret-signs': {
            3: 'star',
            5: 'star',
            7: 'double-star',
            9: 'star',
            12: 'double-star',
            15: 'star',
            17: 'star',
            19: 'star',
            21: 'star',
            24: 'double-star',
        },

        'marks': [
            {
                string: 0,
                fret: 0,
                color: '#e9e',
                text: 'E',
            },
            {
                string: 1,
                fret: 1,
                size: 3,
            },
            {
                string: 2,
                fret: 2,
                color: '#9ee',
            },
            {
                string: 3,
                fret: 3,
            },
            {
                string: 4,
                fret: 4,
                size: 3,
                color: '#ee9',
            },
            {
                string: 5,
                fret: 5,
            },
        ],
    };

    guitar.create();
    guitar.updateSettings(settings);
};