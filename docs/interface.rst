Public interface
================

Constructor
-----------

``Guitar(container-id, settings)``

Creates a canvas inside container (with full size) and start listens basic events (as resize, mousemove and click). You can see settings description in Settings chapter.

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
