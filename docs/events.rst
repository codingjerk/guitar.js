Events
======

click
-----

``click(string-match, fret-match, original-event)``

Fires then user clicks on canvas (in every place). Return ``match objects``, that contains ``value`` and ``threshold``.

::

    var guitar = new Guitar();
    guitar.addEventListener('click', function(string, fret) {
        /* fret will be something like:
        {
            value: 5,
            threshold: 12.4
        }
        string will be similar object
        */
    });

move
----

``click(string-match, fret-match, original-event)``

Jist like click event, but fires then user moves mouse over canvas.
