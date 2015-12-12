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

resetMarks
----------

isMarked
--------

tune
----

addEventListener
----------------

removeEventListener
-------------------
