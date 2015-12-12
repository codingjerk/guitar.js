var $f = function() {};

module.exports = {
    document: {
        getElementById: function() {
            var container = {
                offsetWidth: 300,
                offsetHeight: 300,
                style: {},
                appendChild: $f,
            };
            return container;
        },

        createElement: function() {
            var context = {
                clearRect: $f,
                beginPath: $f,
                arc: $f,
                clearPath: $f,
                fill: $f,
                stroke: $f,
                closePath: $f,
                moveTo: $f,
                lineTo: $f,
                save: $f,
                restore: $f,
                fillRect: $f,
                measureText: function() {return {width: Infinity};},
                scale: $f,
                fillText: $f,
                translate: $f,
                rotate: $f,
            };

            var canvas = {
                addEventListener: $f,
                getContext: function() {
                    return context;
                },
            };
            return canvas;
        },
    },

    addEventListener: $f,
};