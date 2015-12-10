var Guitar = function (id, settings) {
    var guitar = this;
    var tools = {};
    var notes = {};
    var $s, $x, $c, $e; // Aliases to settings, context and canvas

    guitar.create = function() {
        guitar.id = id;
        guitar.container = document.getElementById(id);
        guitar.container.style.overflow = 'hidden';

        guitar.canvas = document.createElement('canvas');

        guitar.container.appendChild(guitar.canvas);
        guitar.context = guitar.canvas.getContext('2d');
        guitar.events = {};

        $s = guitar.settings;
        $x = guitar.context;
        $c = guitar.canvas;
        $e = guitar.events;

        addEventListener('resize', guitar.redraw);
        $c.addEventListener('click', guitar.onclick);
        $c.addEventListener('mousemove', guitar.onmove);
    };

    guitar.updateSettings = function (settings) {
        for (var property in settings) {
            if (settings.hasOwnProperty(property)) {
                $s[property] = settings[property];
            }
        }

        $s['fret-count'] = $s['end-fret'] - $s['start-fret'] + 1;

        guitar.frets = tools.range($s['start-fret'], $s['end-fret']);
        guitar.frets0 = [0].concat(guitar.frets);
        guitar.strings = tools.range(0, $s['string-count'] - 1);

        if ($s['orientation'] === 'vertical') {
            guitar.long = guitar.height;
            guitar.short = guitar.width;

            guitar.coords = function(l, s) {
                return [s, l];
            };
        } else if ($s['orientation'] === 'horizontal') {
            guitar.long = guitar.width;
            guitar.short = guitar.height;

            guitar.coords = function(l, s) {
                return [l, s];
            };
        } else if ($s['orientation'] === 'auto') {
            guitar.long = function() {
                return tools.max([$c.width, $c.height]);
            };

            guitar.short = function() {
                return tools.min([$c.width, $c.height]);
            };

            guitar.coords = function(l, s) {
                if ($c.width >= $c.height) {
                    return [l, s];
                } else {
                    return [s, l];
                }
            };
        } else {
            throw Error('Option orientation must be vertical, horizontal or auto');
        }

        guitar.redraw();
    };

    guitar.width = function () {
        return $c.width;
    };

    guitar.height = function () {
        return $c.height;
    };

    guitar.workLong = function() {
        return guitar.long() - $s['bridge-margin'] - $s['space-margin'];
    };

    guitar.startShort = function() {
        return guitar.short() - ($s['start-border-margin'] + $s['string-outer-margin']) * 2;
    };

    guitar.endShort = function() {
        return guitar.short() - ($s['end-border-margin'] + $s['string-outer-margin']) * 2;
    };

    guitar.startStringGap = function() {
        return guitar.startShort() / ($s['string-count'] - 1);
    };

    guitar.endStringGap = function() {
        return guitar.endShort() / ($s['string-count'] - 1);
    };

    guitar.startStringS = function(i) {
        return $s['start-border-margin'] + $s['string-outer-margin'] + i * guitar.startStringGap(i);
    };

    guitar.endStringS = function(i) {
        return $s['start-border-margin'] + $s['string-outer-margin'] + i * guitar.endStringGap(i);
    };

    guitar.redraw = function() {
        $c.width = guitar.container.offsetWidth;
        $c.height = guitar.container.offsetHeight;

        guitar.rebuildFrets();

        $x.clearRect(0, 0, $c.width, $c.height);

        guitar.frets.forEach(function(fret) {
            var sign = $s['fret-signs'][fret];
            sign && guitar.drawSign(fret, sign);
        });

        guitar.frets.forEach(guitar.drawFret);
        guitar.frets.forEach(guitar.drawFretNumber);

        guitar.strings.forEach(guitar.drawString);
        $s['show-tuning'] && guitar.strings.forEach(guitar.drawTuning);

        guitar.drawBridge();

        $s['marks'].forEach(guitar.drawMark);
    };

    guitar.rebuildFrets = function() {
        if (this.oldLong === guitar.long()) return;

        if ($s['scale'] === 'real') {
            var coeff = guitar.fretCoeff();
            guitar.fretLs = [0];
            for (var n = 0; n < $s['fret-count']; ++n) {
                guitar.fretLs[n] += coeff[n];
                guitar.fretLs[n + 1] = guitar.fretLs[n];
            }
        } else if ($s['scale'] === 'linear') {
            guitar.fretLs = [];
            for (var n = 0; n < $s['fret-count']; ++n) {
                guitar.fretLs[n] = guitar.workLong() * (n + 1) / $s['fret-count'];
            }
        } else {
            throw Error('Unknown scale option value: ' + $s['scale']);
        }

        this.oldLong = guitar.long();
    };

    guitar.fretCoeff = function() {
        var raw = tools.rawCoeff().slice(0, $s['fret-count']);
        var mul = guitar.workLong() / tools.sum(raw);

        var result = [];
        for (var i = 0; i < $s['fret-count']; ++i) {
            result[i] = raw[i] * mul;
        }

        return result;
    };

    guitar.fretL = function(fret) {
        if (fret === 0) return 0;
        return guitar.fretLs[fret - $s['start-fret']];
    };

    guitar.interFretL = function(fret, coeff) {
        coeff = coeff === undefined? 0.5: coeff;

        var fretPrev = guitar.fretL(fret - 1) || 0;
        var fretNext = guitar.fretL(fret);

        return (fretPrev * (1 - coeff) + fretNext * coeff);
    };

    guitar.fretShortByL = function(x) {
        var c = x / guitar.workLong();
        return guitar.startShort() * (1 - c) + guitar.endShort() * c;
    };

    guitar.fretShort = function(fret) {
        var fretL = guitar.fretL(fret);
        return guitar.fretShortByL(fretL);
    };

    guitar.stringWidth = function(i) {
        var s = $s['string-width'];

        if (s instanceof Number) {
            return s;
        } else if (s instanceof Array) {
            return s[i];
        } else if (s instanceof Function) {
            return s(i);
        }

        throw Error('string-width must be Number, Array (of Numbers) or Function');
    };

    guitar.fretByL = function(v) {
        var nearest = 0;
        var threshold = Infinity;

        var frets = tools.range($s['start-fret'], $s['end-fret']).concat([0]);
        for (var i = 0; i < frets.length; ++i) {
            var fret = frets[i];
            var fretX = guitar.interFretL(fret, 0.55) + $s['bridge-margin'];
            var t = Math.abs(fretX - v);

            if (t < threshold) {
                nearest = fret;
                threshold = t;
            }
        }

        return {
            value: nearest,
            threshold: threshold,
        };
    };

    guitar.stringByS = function(v) {
        var nearest = 0;
        var threshold = Infinity;

        for (var i = 0; i < $s['string-count']; ++i) {
            var stringS = guitar.startStringS(i);

            var t = Math.abs(stringS - v);
            if (t < threshold) {
                nearest = i;
                threshold = t;
            }
        }

        return {
            value: nearest,
            threshold: threshold,
        };
    };

    guitar.drawBridge = function() {
        var startL = $s['bridge-margin'];
        var startS = $s['start-border-margin'];

        var endL = $s['bridge-margin'];
        var endS = guitar.short() - $s['start-border-margin'];

        tools.drawLine(startL, startS, endL, endS, $s['bridge-color'], $s['bridge-width']);
    };

    guitar.drawTuning = function(string) {
        var l = $s['bridge-margin'] / 2;
        var s = guitar.startStringS(string);

        var text = notes.showNote($s['tuning'][string], $s['show-tuning']);

        tools.drawScaledText(text, l, s, 'middle', $s['tuning-font'], $s['tuning-color'], $s['bridge-margin']);
    };

    guitar.drawString = function(i) {
        var startL = $s['bridge-margin'];
        var startS = guitar.startStringS(i);

        // @TODO: allow to swap strings up-down
        var endL = guitar.long() - $s['space-margin'];
        var endS = guitar.endStringS(i);

        tools.drawLine(startL, startS, endL, endS, $s['string-color'], guitar.stringWidth(i));
    };

    guitar.drawFret = function(i) {
        var startL = guitar.fretL(i) + $s['bridge-margin'];
        var startS = (guitar.short() - guitar.fretShort(i)) / 2;

        var endL = startL;
        var endS = guitar.short() - startS;

        tools.drawLine(startL, startS, endL, endS, $s['fret-color'], $s['fret-width']);
    };

    guitar.drawFretNumber = function(f) {
        var fretL = guitar.interFretL(f) + $s['bridge-margin'];
        var fretLong = guitar.fretL(f) - guitar.fretL(f - 1);
        var fretShort = guitar.fretShortByL(fretL);
        var shortOffset = (guitar.short() - fretShort) / 2;

        var fretS = guitar.short() - shortOffset + $s['fret-number-margin'];
        var align = 'top';

        // @TODO: do something with align (vertical/horizontal), allow to choose fret side (top|bottom|left|right)
        tools.drawScaledText(f, fretL, fretS, align, $s['fret-number-font'], $s['fret-number-color'], fretLong);
    };

    guitar.drawSign = function(fret, sign) {
        var l = guitar.interFretL(fret) + $s['bridge-margin'];
        var s = guitar.short() / 2;

        var lDoubleOffset = guitar.fretShortByL(l) / 4;

        var radius = $s['sign-size'];

        if (sign === 'dot') {
            tools.drawCircle(l, s, radius, $s['sign-color']);
        } else if (sign === 'star') {
            tools.drawStar(l, s, radius, 5, $s['sign-color']);
        } else if (sign === 'double-dot') {
            tools.drawCircle(l, s - lDoubleOffset, radius, $s['sign-color']);
            tools.drawCircle(l, s + lDoubleOffset, radius, $s['sign-color']);
        } else if (sign === 'double-star') {
            tools.drawStar(l, s - lDoubleOffset, radius, 5, $s['sign-color']);
            tools.drawStar(l, s + lDoubleOffset, radius, 5, $s['sign-color']);
        } else {
            throw Error('Unknown sign type: ' + sign);
        }
    };

    guitar.drawMark = function(mark) {
        var fretL = guitar.interFretL(mark.fret, $s['mark-position']);
        var short = guitar.fretShortByL(fretL);
        var sOffset = (guitar.short() - short) / 2;

        var l = fretL + $s['bridge-margin'];
        var s = sOffset + short * mark.string / ($s['string-count'] - 1);

        var size = mark.size || $s['mark-size'];
        var color = mark.color || $s['mark-color'];
        var border = mark.border || $s['mark-border'];

        if (color instanceof Array) {
            var random = Math.floor(Math.random() * color.length);
            color = mark.color = color[random];
        }

        tools.drawCircle(l, s, size, color, border.size, border.color);

        var text = mark.text || $s['mark-text'];
        if (!mark.text) {
            var stringNote = $s['tuning'][mark.string];
            var fretNote = stringNote + mark.fret;

            text = notes.showNote(fretNote, $s['show-notes']);
        }

        var textColor = tools.chooseForeground(color);
        tools.drawScaledText(text, l, s, 'middle', $s['mark-font'], textColor, size);
    };

    guitar.addEventListener = function(event, listener) {
        $e[event] = $e[event] || [];
        $e[event] += listener;
    };

    guitar.removeEventListener = function(event, listener) {
        $e[event] = $e[event] || [];
        var id = $e[event].indexOf(listener);

        if (id !== -1) {
            $e[event].splice(id, 1);
        }
    };

    guitar.onclick = function(e) {
        var ls = guitar.coords(e.offsetX, e.offsetY);

        var fret = guitar.fretByL(ls[0]);
        var string = guitar.stringByS(ls[1]);

        var clickListeners = $e['click'] || [];
        for (var i = 0; i < clickListeners.length; ++i) {
            clickListeners[i](string, fret, e);
        }
    };

    guitar.onmove = function(e) {
        var ls = guitar.coords(e.offsetX, e.offsetY);

        var fret = guitar.fretByL(ls[0]);
        var string = guitar.stringByS(ls[1]);

        var moveListeners = $e['move'] || [];
        for (var i = 0; i < moveListeners.length; ++i) {
            moveListeners[i](string, fret, e);
        }
    };

    tools.drawLine = function(fromL, fromS, toL, toS, style, width) {
        var from = guitar.coords(fromL, fromS);
        var to = guitar.coords(toL, toS);

        $x.beginPath();

        $x.lineWidth = width;
        $x.strokeStyle = style;

        var padding = width % 2 === 0? 0: 0.5;

        $x.moveTo(Math.round(from[0]) + padding, Math.round(from[1]) + padding);
        $x.lineTo(Math.round(to[0]) + padding, Math.round(to[1]) + padding);

        $x.stroke();
        $x.closePath();
    };

    tools.drawCircle = function(l, s, radius, color, lineSize, lineColor) {
        var xy = guitar.coords(l, s);

        $x.beginPath();
        $x.lineWidth = lineSize;
        $x.strokeStyle = lineColor;
        $x.arc(xy[0], xy[1], radius, 0, 2 * Math.PI, false);
        $x.fillStyle = color;
        $x.fill();
        lineSize && lineColor && $x.stroke();
        $x.closePath();
    };

    tools.drawText = function(text, l, s, valign, font, color) {
        tools.drawScaledText(text, l, s, valign, font, color, Infinity);
    };

    tools.drawScaledText = function(text, l, s, valign, font, color, maxWidth) {
        var xy = guitar.coords(l, s);

        $x.save();
        $x.font = font;
        $x.textAlign = 'center';
        $x.fillStyle = color;
        $x.textBaseline = valign;

        var metrics = $x.measureText(text);
        var textWidth = metrics.width;

        var scaleFactor = 1;
        if (textWidth > maxWidth) {
            scaleFactor = maxWidth / textWidth;
            $x.scale(scaleFactor, scaleFactor);
        }

        $x.fillText(text, xy[0] / scaleFactor, xy[1] / scaleFactor);
        $x.restore();
    };

    tools.drawStar = function(l, s, radius, pikes, color) {
        var xy = guitar.coords(l, s);

        $x.save();
        $x.beginPath();
        $x.translate(xy[0], xy[1]);
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

    tools.max = function(list) {
        return list.reduce(function(acc, x) {
            return acc > x? acc: x;
        });
    };

    tools.min = function(list) {
        return list.reduce(function(acc, x) {
            return acc < x? acc: x;
        });
    };

    tools.range = function(start, end, step) {
        var range = [];

        typeof step === 'undefined' && (step = 1);

        while (step > 0 ? end >= start : end <= start) {
            range.push(start);
            start += step;
        }

        return range;
    }

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
        var max = tools.max(rgb);
        var limit = 127;

        if (max >= limit) {
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

    notes.showNote = function(index, mode) {
        var note = index % 12;
        var octave = (index - note) / 12;

        var result = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][note] + octave;

        if (mode === 'simple') {
            return result.slice(0, result.length - 1);
        }

        if (mode === 'full') {
            return result;
        }

        throw Error('Unknown show note mode');
    };

    guitar.settings = {
        'bridge-margin': 30,
        'start-border-margin': 20,
        'end-border-margin': 20,
        'string-outer-margin': 3,
        'space-margin': 5,
        'fret-number-margin': 7,
        'mark-position': 1.0,

        'mark-border': {
            size: 2, color: '#666',
        },

        'string-color': '#000',
        'bridge-color': '#999',
        'fret-color': '#bbb',
        'sign-color': '#bbb',
        'fret-number-color': '#bbb',
        'mark-color': '#fefefe',
        'tuning-color': '#333',

        'string-width': [1, 1, 2, 2, 3, 4],
        'bridge-width': 8,
        'fret-width': 4,
        'fret-number-font': '12px sans-serif',
        'mark-font': '12px sans-serif',
        'tuning-font': '12px sans-serif',
        'sign-size': 5,
        'mark-size': 17,

        'orientation': 'vertical',
        'scale': 'real',

        'mark-text': 'M',

        'show-notes': 'simple',
        'show-tuning': 'simple',

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
                fret: 0,
                string: 0,
            },
            {
                fret: 2,
                string: 4,
            },
            {
                fret: 5,
                string: 2,
            },
            {
                fret: 12,
                string: 1,
            },
            {
                fret: 3,
                string: 3,
            },
            {
                fret: 6,
                string: 5,
            },
        ],
    };

    guitar.create();
    guitar.updateSettings(settings);
};