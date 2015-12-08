var Guitar = function (id, settings) {
    var guitar = this;
    var tools = {};
    var $s, $x, $c; // Aliases to settings, context and canvas

    guitar.settings = {
        'bridge-margin': 7,
        'start-border-margin': 15,
        'end-border-margin': 3,
        'string-outer-margin': 8,
        'space-margin': 5,

        'string-color': '#000',
        'bridge-color': '#999',
        'fret-color': '#bbb',
        'sign-color': '#bbb',

        'string-width': [1, 1, 2, 2, 3, 4],
        'bridge-width': 8,
        'fret-width': 4,
        'sign-size': 5,

        'bridge-ledge': -3,

        'orientation': 'horizontal', // @TODO: allow to switch
        'proection': 'orthogonal', // @TODO: allow to switch

        'string-count': 6,

        'start-fret': 1,
        'end-fret': 24,

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
    };

    for (var property in settings) {
        guitar.settings[property] = settings[property];
    };

    guitar.settings['fret-count'] = guitar.settings['end-fret'] - guitar.settings['start-fret'] + 1;

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

        guitar.redraw();
        addEventListener('resize', guitar.redraw);
    };

    guitar.redraw = function() {
        $c.setAttribute('width', guitar.container.offsetWidth);
        $c.setAttribute('height', guitar.container.offsetHeight);

        // @TODO: DO SOMETHING!
        // @TODO: Rebuild table only if settings or width changed
        var width = $c.width;
        var height = $c.height;

        var realWidth = width - $s['bridge-margin'] * 2;
        guitar.fretXs = [];
        for (var n = 0; n <= $s['fret-count']; ++n) {
            guitar.fretXs[n] = realWidth * (n + 1) / $s['fret-count'];
        }

        $x.clearRect(0, 0, width, height);

        for (var f = $s['start-fret']; f <= $s['end-fret']; ++f) {
            var sign = $s['fret-signs'][f];
            if (sign !== undefined) {
                guitar.drawSign(f, sign);
            }
        }

        for (var f = $s['start-fret']; f <= $s['end-fret']; ++f) {
            guitar.drawFret(f);
        }

        for (var i = 0; i < $s['string-count']; ++i) {
            guitar.drawString(i);
        }

        guitar.drawBridge();
    };

    guitar.getFretX = function(fret) {
        return guitar.fretXs[fret - $s['start-fret']];
    };

    guitar.getFretHeight = function(fret) {
        var fretX = guitar.getFretX(fret);
        var startHeight = $c.height - ($s['start-border-margin'] + $s['string-outer-margin']) * 2;
        var endHeight = $c.height - ($s['end-border-margin'] + $s['string-outer-margin']) * 2;
        var realWidth = $c.width - $s['bridge-margin'] * 2;

        return startHeight + (endHeight - startHeight) * (fretX / realWidth);
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

    guitar.drawSign = function(fret, sign) {
        var fretPrev = guitar.getFretX(fret - 1) || 0;
        var fretNext = guitar.getFretX(fret);

        var centerX = (fretNext + fretPrev) / 2 + $s['bridge-margin'];
        var centerY = $c.height / 2;

        var startHeight = $c.height - ($s['start-border-margin'] + $s['string-outer-margin']) * 2;
        var endHeight = $c.height - ($s['end-border-margin'] + $s['string-outer-margin']) * 2;
        var realWidth = $c.width - $s['bridge-margin'] * 2;
        var fretHeight = startHeight + (endHeight - startHeight) * (centerX / realWidth);

        // @TODO: relative radius
        // @TODO: refactor
        if (sign === 'dot') {
            tools.drawCircle(centerX, centerY, $s['sign-size'], $s['sign-color']);
        } else if (sign === 'star') {
            tools.drawStar(centerX, centerY, $s['sign-size'] * 4.2, 5, $s['sign-color']);
        } else if (sign === 'double-star') {
            var offset = fretHeight / 4;

            tools.drawStar(centerX, centerY - offset, $s['sign-size'] * 3.2, 5, $s['sign-color']);
            tools.drawStar(centerX, centerY + offset, $s['sign-size'] * 3.2, 5, $s['sign-color']);
        } else if (sign === 'double-dot') {
            var offset = fretHeight / 4;

            tools.drawCircle(centerX, centerY - offset, $s['sign-size'], $s['sign-color']);
            tools.drawCircle(centerX, centerY + offset, $s['sign-size'], $s['sign-color']);
        } else {
            throw Error("Unknown sign type: " + sign);
        }
    };

    tools.drawLine = function(fromX, fromY, toX, toY, style, width) {
        $x.beginPath();

        $x.lineWidth = width;
        $x.strokeStyle = style;

        var padding = width % 2 == 0? 0: 0.5;

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

    guitar.create();
};