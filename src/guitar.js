var Guitar = function (id, settings) {
    'use strict';

    var guitar = this;
    var tools = guitar.tools = {};
    var notes = guitar.notes = {};
    var $s, $x, $c, $e; // Aliases to settings, context and canvas

    guitar.init = function() {
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

    guitar.mock = function() {
        guitar.id = id;
        guitar.container = {offsetWidth: 500, offsetHeight: 500};

        guitar.canvas = {width: 500, height: 150};

        guitar.context = {
            clearRect: function () {},
            beginPath: function () {},
            arc: function () {},
            fill: function () {},
            stroke: function () {},
            closePath: function () {},
            moveTo: function () {},
            lineTo: function () {},
            save: function () {},
            restore: function () {},
            measureText: function () {return {width: Infinity};},
            scale: function () {},
            fillText: function () {},
            translate: function () {},
            rotate: function () {},
        };

        guitar.events = {};

        $s = guitar.settings;
        $x = guitar.context;
        $c = guitar.canvas;
        $e = guitar.events;
    };

    guitar.set = function(obj) {
        if (arguments.length === 2) {
            return guitar.setOne.apply(this, arguments);
        }

        return guitar.setMultiple(obj);
    };

    guitar.setOne = function(name, value) {
        var obj = {};
        obj[name] = value;

        guitar.setMultiple(obj);
    };

    guitar.setMultiple = function(settings) {
        for (var property in settings) {
            if (settings.hasOwnProperty(property)) {
                $s[property] = settings[property];
            }
        }

        $s['fret-count'] = $s['end-fret'] - $s['start-fret'] + 1;

        guitar.frets = tools.range($s['start-fret'], $s['end-fret']);
        guitar.frets0 = [0].concat(guitar.frets);
        guitar.strings = tools.range(0, $s['string-count'] - 1);

        if ($s.orientation === 'vertical') {
            guitar.long = guitar.height;
            guitar.short = guitar.width;

            guitar.coords = function(l, s) {
                return [s, l];
            };
        } else if ($s.orientation === 'horizontal') {
            guitar.long = guitar.width;
            guitar.short = guitar.height;

            guitar.coords = function(l, s) {
                return [l, s];
            };
        } else if ($s.orientation === 'auto') {
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

    guitar.mark = function(string, fret, text, size, color, border) {
        guitar.unmark(string, fret);

        var obj = string;
        if (fret !== undefined) {
            obj = {
                string: string,
                fret: fret,
            };

            if (text) obj.text = text;
            if (size) obj.size = size;
            if (color) obj.color = color;
            if (border) obj.border = border;
        }

        $s.marks.push(obj);
        guitar.redraw();
    };

    guitar.unmark = function(string, fret) {
        var id = guitar.findMark(string, fret);
        if (id !== -1) {
            $s.marks.splice(id, 1);
            guitar.redraw();
        }
    };

    guitar.switchMark = function(string, fret, text, size, color, border) {
        if (guitar.isMarked(string, fret)) {
            guitar.unmark.apply(this, arguments);
        } else {
            guitar.mark.apply(this, arguments);
        }
    };

    guitar.resetMarks = function() {
        $s.marks = [];
        guitar.redraw();
    };

    guitar.findMark = function(string, fret) {
        if (fret === undefined) {
            fret = string.fret;
            string = string.string;
        }

        for (var i = 0; i < $s.marks.length; ++i) {
            if ($s.marks[i].string === string && $s.marks[i].fret === fret) {
                return i;
            }
        }

        return -1;
    };

    guitar.isMarked = function(string, fret) {
        return guitar.findMark(string, fret) !== -1;
    };

    guitar.tune = function(tune) {
        var tunes = {
            'eadgbe': ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
            'default': ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
            'drop-d': ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
        };

        if (typeof tune === 'string') {
            tune = tune.toLowerCase();
            tune = tunes[tune];
        }

        guitar.set('tuning', tune.map(notes.parseNote));
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
        if ($s['string-order'] === 'right-to-left' || $s['string-order'] === 'bottom-to-top') {
            return $s['start-border-margin'] + $s['string-outer-margin'] + ($s['string-count'] - i - 1) * guitar.startStringGap(i);
        } else if ($s['string-order'] === 'left-to-right' || $s['string-order'] === 'top-to-bottom') {
            return $s['start-border-margin'] + $s['string-outer-margin'] + i * guitar.startStringGap(i);
        } else {
            throw Error('String-order option must be left-to-right, top-to-bottom, right-to-left or bottom-to-top');
        }
    };

    guitar.endStringS = function(i) {
        if ($s['string-order'] === 'right-to-left' || $s['string-order'] === 'bottom-to-top') {
            return $s['end-border-margin'] + $s['string-outer-margin'] + ($s['string-count'] - i - 1) * guitar.endStringGap(i);
        } else if ($s['string-order'] === 'left-to-right' || $s['string-order'] === 'top-to-bottom') {
            return $s['end-border-margin'] + $s['string-outer-margin'] + i * guitar.endStringGap(i);
        } else {
            throw Error('String-order option must be left-to-right, top-to-bottom, right-to-left or bottom-to-top');
        }
    };

    guitar.stringSByFretL = function(string, fretL) {
        var s = guitar.startStringS(string);
        var e = guitar.endStringS(string);

        var c = fretL / guitar.workLong();

        return s * (1 - c) + e * c;
    };

    guitar.stringInterS = function(string, fret) {
        var fretL = guitar.interFretL(fret);
        return guitar.stringSByFretL(string, fretL);
    };

    guitar.stringS = function(string, fret) {
        var fretL = guitar.fretL(fret);
        return guitar.stringSByFretL(string, fretL);
    };

    guitar.redraw = function() {
        $c.width = guitar.container.offsetWidth;
        $c.height = guitar.container.offsetHeight;

        guitar.rebuildFrets();

        $x.clearRect(0, 0, $c.width, $c.height);

        guitar.frets.forEach(function(fret) {
            var sign = $s['fret-signs'][fret];
            if (sign) guitar.drawSign(fret, sign);
        });

        guitar.frets.forEach(guitar.drawFret);
        guitar.frets.forEach(guitar.drawFretNumber);

        guitar.strings.forEach(guitar.drawString);
        if ($s['show-tuning']) guitar.strings.forEach(guitar.drawTuning);

        guitar.drawBridge();

        $s.marks.forEach(guitar.drawMark);
    };

    guitar.rebuildFrets = function() {
        if (this.oldLong === guitar.long()) return;

        if ($s.scale === 'real') {
            var coeff = guitar.fretCoeff();
            guitar.fretLs = [0];
            for (var n = 0; n < $s['fret-count']; ++n) {
                guitar.fretLs[n] += coeff[n];
                guitar.fretLs[n + 1] = guitar.fretLs[n];
            }
        } else if ($s.scale === 'linear') {
            guitar.fretLs = [];
            for (var x = 0; x < $s['fret-count']; ++x) {
                guitar.fretLs[x] = (guitar.workLong() - $s['fret-width']) * (x + 1) / $s['fret-count'];
            }
        } else {
            throw Error('Unknown scale option value: ' + $s.scale);
        }

        this.oldLong = guitar.long();
    };

    guitar.fretCoeff = function() {
        var raw = tools.rawCoeff().slice(0, $s['fret-count']);
        var mul = (guitar.workLong() - $s['fret-width']) / tools.sum(raw);

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

        if (typeof s === 'number') {
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

    guitar.stringByS = function(v, fret) {
        var nearest = 0;
        var threshold = Infinity;

        for (var i = 0; i < $s['string-count']; ++i) {
            var stringS = guitar.stringS(i, fret);

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

        var text = notes.showNote($s.tuning[$s['string-count'] - 1 - string], $s['show-tuning']);

        tools.drawScaledText(text, l, s, $s['tuning-font'], $s['tuning-color'], guitar.startStringGap(), 0, 0);
    };

    guitar.drawString = function(i) {
        var startL = $s['bridge-margin'];
        var startS = guitar.startStringS(i);

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

        var fretS = 0;
        var lalign = 0;
        var salign = 0;

        if ($s['fret-number-side'] === 'left' || $s['fret-number-side'] === 'top') {
            fretS = shortOffset - $s['fret-number-margin'];
            salign = -1;
        } else if ($s['fret-number-side'] === 'right' || $s['fret-number-side'] === 'bottom') {
            fretS = guitar.short() - shortOffset + $s['fret-number-margin'];
            salign = +1;
        } else {
            throw Error('Fret-number-side option must be left, right, top or bottom');
        }

        tools.drawScaledText(f, fretL, fretS, $s['fret-number-font'], $s['fret-number-color'], fretLong, lalign, salign);
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

        var l = fretL + $s['bridge-margin'];
        var s = guitar.stringSByFretL(mark.string, fretL);

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
            var stringNote = $s.tuning[$s['string-count'] - 1 - mark.string];
            var fretNote = stringNote + mark.fret;

            text = notes.showNote(fretNote, $s['show-notes']);
        }

        var textColor = tools.chooseForeground(color);
        tools.drawScaledText(text, l, s, $s['mark-font'], textColor, size, 0, 0);
    };

    guitar.addEventListener = function(event, listener) {
        $e[event] = $e[event] || [];
        $e[event].push(listener);
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
        var string = guitar.stringByS(ls[1], fret.value);

        var clickListeners = $e.click || [];
        for (var i = 0; i < clickListeners.length; ++i) {
            clickListeners[i](string, fret, e);
        }
    };

    guitar.onmove = function(e) {
        var ls = guitar.coords(e.offsetX, e.offsetY);

        var fret = guitar.fretByL(ls[0]);
        var string = guitar.stringByS(ls[1], fret.value);

        var moveListeners = $e.move || [];
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
        if (lineSize && lineColor) $x.stroke();
        $x.closePath();
    };

    tools.aToTa = function(lalign, salign) {
        var c = guitar.coords(lalign, salign)[0];
        if (c === -1) return 'right';
        if (c === 0) return 'center';
        if (c === +1) return 'left';
    };

    tools.aToTb = function(lalign, salign) {
        var c = guitar.coords(lalign, salign)[1];
        if (c === -1) return 'bottom';
        if (c === 0) return 'middle';
        if (c === +1) return 'top';
    };

    tools.drawScaledText = function(text, l, s, font, color, maxWidth, lalign, salign) {
        var xy = guitar.coords(l, s);

        $x.save();
        $x.font = font;
        $x.textAlign = tools.aToTa(lalign, salign);
        $x.fillStyle = color;
        $x.textBaseline = tools.aToTb(lalign, salign);

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
        }, 0);
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
        step = step || 1;

        var range = [];

        while (step > 0 ? end >= start : end <= start) {
            range.push(start);
            start += step;
        }

        return range;
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
        var longR = val.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
        if (longR) {
            return longR.slice(1,4).map(function(x) { return parseInt(x, 16); });
        }

        // #xxx
        var shortR = val.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
        if (shortR) {
            return shortR.slice(1,4).map(function(x) { return 0x11 * parseInt(x, 16); });
        }

        // rgb(x, x, x)
        var rgb = /(.*?)rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(val);
        if (rgb && rgb.length === 5) {
            return rgb.slice(2).map(toInt);
        }

        // rgba(x, x, x)
        var rgba = /(.*?)rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*(\d+)\s*\)/.exec(val);
        if (rgba && rgba.length === 6) {
            return rgba.slice(2).map(toInt);
        }

        return null;
    };

    tools.isDark = function(color) {
        var rgb = tools.parseColor(color);
        var r = rgb[0], g = rgb[1], b = rgb[2];

        var average = r * 0.25 + g * 0.5 + b * 0.25; // Green has more weight
        var limit = 127;

        return average >= limit;
    };

    tools.isLight = function(color) {
        return !tools.isDark(color);
    };

    tools.chooseForeground = function(background) {
        if (tools.isLight(background)) {
            return '#333';
        }

        return '#fafafa';
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

        if (mode === undefined || mode === 'full') {
            return result;
        }

        throw Error('Unknown show note mode');
    };

    guitar.settings = {
        'bridge-margin': 30,
        'start-border-margin': 15,
        'end-border-margin': 15,
        'string-outer-margin': 5,
        'space-margin': 5,
        'fret-number-margin': 3,
        'mark-position': 0.55,

        'mark-border': {
            size: 2, color: '#666',
        },

        'string-color': '#333',
        'bridge-color': '#777',
        'fret-color': '#bbb',
        'sign-color': '#ccc',
        'fret-number-color': '#aaa',
        'mark-color': '#fefefe',
        'tuning-color': '#222',

        'string-width': 1,
        'bridge-width': 6,
        'fret-width': 3,
        'fret-number-font': '12px sans-serif',
        'mark-font': '12px sans-serif',
        'tuning-font': '15px sans-serif',
        'sign-size': 6,
        'mark-size': 13,

        'orientation': 'horizontal',
        'scale': 'real',

        'mark-text': '',

        'show-notes': 'simple',
        'show-tuning': 'simple',

        'string-order': 'top-to-bottom',
        'fret-number-side': 'bottom',

        'string-count': 6,

        'start-fret': 1,
        'end-fret': 12,

        'tuning': ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'].map(notes.parseNote),

        'fret-signs': {
            3: 'dot',
            5: 'dot',
            7: 'double-dot',
            9: 'dot',
            12: 'double-dot',
            15: 'dot',
            17: 'dot',
            19: 'dot',
            21: 'dot',
            24: 'double-dot',
        },

        'marks': [],
    };

    if (typeof document !== 'undefined') {
        guitar.init();
    } else {
        guitar.mock();
    }

    guitar.set(settings);
};

// Node.js initialization to test
if (typeof module !== 'undefined') {
    module.exports = Guitar;
}