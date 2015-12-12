Public interface
================

Constructor
-----------

``Guitar(container-id, settings)``

Creates a canvas inside container (with full size) and start listens basic events (as resize, mousemove and click).
You can see settings description in Settings chapter.

::

    var guitar = new Guitar('guitar', {
        orientation: 'vertical'
    });

set
---

``Guitar.set(settings)``

Updates settings by values in argument object ``settings``.

``Guitar.set(name, value)``

Sets option with name ``name`` to ``value``. Also it forces redraw, so use object-set form for performance.

::

    var guitar = new Guitar('guitar');

    guitar.set({
        orientation: 'vertical',
        'start-fret': 3
    });

    guitar.set('capo', 4);

mark
----

``Guitar.mark(mark-object)``

Sets mark with specified settings, as string number, fret number, text, size (radius),
background color, and border object, contains border color and border width.
You may sets not all properties (only string and fret are required), they will be setted to default values.

``Guitar.mark(string, fret, [text], [size], [background-color], [border-object])``

Sets mark by individual parts, all arguments except string and fret are optional.

::

    var guitar = new Guitar('guitar');

    guitar.mark({
        string: 1,
        fret: 5,
        border: {
            size: 2,
            color: '#333'
        }
    });

    guitar.mark(4, 0, 'x');

unmark
------

``Guitar.unmark(mark-object)``

Unsets mark with specified settings. Used properties are ``fret`` and ``string`` only.

``Guitar.unmark(string, fret)``

Do same as ``unmark(object)``

::

    var guitar = new Guitar('guitar');
    guitar.mark(4, 0, 'x');
    guitar.unmark(4, 0);

switchMark
----------

``Guitar.mark(mark-object)``

Sets mark if not setted, and unsets if setted.

``Guitar.mark(string, fret, [text], [size], [background-color], [border-object])``

Accepts all ``Guitar.mark`` arguments, but then it does unset, only string and fret used.

::

    var guitar = new Guitar('guitar');

    // First call will sets mark
    guitar.switchMark({
        string: 1,
        fret: 5,
        border: {
            size: 2,
            color: '#333'
        }
    });

    // Second call will unsets it
    guitar.switchMark(1, 5);

resetMarks
----------

``Guitar.resetMarks()``

Unsets all setted marks.

::

    var guitar = new Guitar('guitar');
    guitar.mark(0, 0);
    guitar.mark(0, 2);
    guitar.mark(0, 3);
    // ...
    guitar.mark(0, 12);

    guitar.resetMarks();

isMarked
--------

``Guitar.isMarked(mark-object)``

Returns ``true`` if mark setted at ``string`` and ``fret`` coords. ``false``, if not.

``Guitar.isMarked(string, fret)``

Same, but accepts separate arguments.

::

    var guitar = new Guitar('guitar');

    guitar.isMarked({
        string: 1,
        fret: 5,
    }); // false

    guitar.mark(1, 5);

    guitar.isMarked(1, 5); // true

tune
----

``Guitar.tune(tuning-name)``

Sets guitar tuning by name. As example ``'eadgbe'``, ``'default'``, ``'drop-d'``.

``Guitar.tune(notes)``

Sets guitar tuning by separate notes (in full format).

::

    var guitar = new Guitar('guitar');

    guitar.tune('drop-d');

    guitar.tune(['D2', 'A2', 'D3', 'G3', 'B3', 'E4']);

addEventListener
----------------

removeEventListener
-------------------
