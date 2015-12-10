new Guitar('default-guitar');

new Guitar('color-guitar', {
    'string-color': '#abde12',
    'bridge-color': '#5ab1aa',
    'fret-color': '#9ad1da',
    'sign-color': '#87a198',
    'fret-number-color': '#12ba54',
    'tuning-color': '#2b6e12',
});

new Guitar('string-width-guitar', {
    'string-width': [1, 1, 2, 2, 3, 4],
});

new Guitar('widths-guitar', {
    'string-width': 2,
    'bridge-width': 12,
    'fret-width': 2,
    'fret-number-font': '8px sans-serif',
    'mark-font': '12px sans-serif',
    'tuning-font': '10px sans-serif',
    'sign-size': 8,
});

new Guitar('scale-guitar', {
    'scale': 'linear',
});

new Guitar('flip-guitar', {
    'fret-number-margin': 5,
    'orientation': 'vertical',
    'end-fret': 5,
});

new Guitar('frets-guitar', {
    'end-fret': 5,
});

new Guitar('sign-guitar', {
    'end-fret': 5,
    'sign-size': 8,
    'fret-signs': {
        1: 'dot',
        2: 'double-dot',
        3: 'star',
        4: 'double-star',
        5: 'star',
    },
});

new Guitar('string-4-guitar', {
    'end-fret': 5,
    'string-count': 4,
});

new Guitar('fingertips-guitar', {
    'end-fret': 5,
    'bridge-margin': 50,

    'marks': [
        {
            string: 0,
            fret: 0,
            text: ' ',
        },
        {
            string: 1,
            fret: 1,
        },
        {
            string: 2,
            fret: 2,
        },
        {
            string: 3,
            fret: 2,
        },
        {
            string: 4,
            fret: 0,
            text: ' ',
        },
        {
            string: 5,
            fret: 0,
            text: 'x',
        },
    ],
});

new Guitar('order-guitar', {
    'end-fret': 5,
    'bridge-margin': 50,

    'marks': [
        {
            string: 0,
            fret: 0,
            text: ' ',
        },
        {
            string: 1,
            fret: 1,
        },
        {
            string: 2,
            fret: 2,
        },
        {
            string: 3,
            fret: 2,
        },
        {
            string: 4,
            fret: 0,
            text: ' ',
        },
        {
            string: 5,
            fret: 0,
            text: 'x',
        },
    ],

    'string-order': 'bottom-to-top',
});

new Guitar('labels-guitar', {
    'orientation': 'vertical',
    'end-fret': 4,
    'bridge-margin': 50,

    'marks': [
        {
            string: 0,
            fret: 0,
            text: 'P',
        },
        {
            string: 1,
            fret: 0,
            text: 'L',
        },
        {
            string: 2,
            fret: 0,
            text: 'E',
        },
        {
            string: 3,
            fret: 0,
            text: 'A',
        },
        {
            string: 4,
            fret: 0,
            text: 'S',
        },
        {
            string: 5,
            fret: 0,
            text: 'E',
        },
        {
            string: 1,
            fret: 2,
            text: 'H',
        },
        {
            string: 2,
            fret: 2,
            text: 'E',
        },
        {
            string: 3,
            fret: 2,
            text: 'L',
        },
        {
            string: 4,
            fret: 2,
            text: 'P',
        },
        {
            string: 2,
            fret: 3,
            text: 'M',
        },
        {
            string: 3,
            fret: 3,
            text: 'E',
        },
    ],
});

var guitar = new Guitar('event-guitar');
var savedMarks = {};

function showSaved() {
    guitar.resetMarks();
    for (var k in savedMarks) {
        guitar.mark(k, savedMarks[k]);
    }
}

guitar.addEventListener('click', function(string, fret) {
    if (savedMarks[string.value] === fret.value) {
        delete savedMarks[string.value];
    } else {
        savedMarks[string.value] = fret.value;
    }

    showSaved();
});

guitar.addEventListener('move', function(string, fret) {
    showSaved();
    guitar.mark(string.value, fret.value);
});
