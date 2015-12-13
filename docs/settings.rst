Settings
========

Display
-------

orientation
~~~~~~~~~~~

``orientation :: String, default 'horizontal'``

Sets fretboard orientation. Possible values:

* ``horizontal``
* ``vertical``
* ``auto``

scale
~~~~~

``scale :: String, default 'real'``

Sets fret width ratio. Possible values:

* ``linear`` - 1:1 ratio for neighbor frets
* ``real`` - 1:1.05 ratio for neighbor frets. Just as on real guitar

Strings
-------

string-width
~~~~~~~~~~~~

``string-width :: Number | Array | Function, default 1``

Sets string width for all strings or separately for each string (from lower to upper).


string-color
~~~~~~~~~~~~

``string-color :: String | Array, default '#333'``


string-count
~~~~~~~~~~~~

``string-count :: Number, default 6, min 1``

string-order
~~~~~~~~~~~~

``string-order :: String, default 'top-to-bottom'``

Sets string order (from lower to upper strings). Possible values:

* ``top-to-bottom`` (as in tabulature - thick string at bottom)
* ``bottom-to-top`` (thick string at top)
* ``right-to-left`` (as in vertical fingerings - thick string at left)
* ``left-to-right`` (thick string at right)

Frets
-----

fret-color
~~~~~~~~~~

``fret-color :: Number, default '#bbb'``

Sets color of inter-fret border (not for all fret's rect).

fret-colors
~~~~~~~~~~~

``fret-colors :: Object, default {}``

This is ambitious, but ``fret-colors`` is not same as ``fret-color``.
Fret-colors sets color not for border, but for all fret's rect and usualy uses for highlighting.

Value object must contains fret-numbers as keys and colors as values. As example::

    guitar.set('fret-colors', {
        3: '#123',
        4: '#dedade'
    });

fret-width
~~~~~~~~~~

``fret-width :: Number, default 3``

start-fret
~~~~~~~~~~

``start-fret :: Number, default 1``

end-fret
~~~~~~~~

``end-fret :: Number, default 12``

Bridge
------

bridge-color
~~~~~~~~~~~~

``bridge-color :: Number, default '#777'``

bridge-width
~~~~~~~~~~~~

``bridge-width :: Number, default 6``

Capo
----

capo
~~~~

capo-color
~~~~~~~~~~

capo-width
~~~~~~~~~~

















Margins and paddings
--------------------

string-outer-margin
---

bridge-margin
---

start-border-margin
---

end-border-margin
---

space-margin
---

fret-number-margin
---

capo-bulge
---






mark-position
---

mark-border
---

sign-color
---

fret-number-color
---

mark-color
---

tuning-color
---

fret-number-font
---

mark-font
---

tuning-font
---

sign-size
---

mark-size
---

mark-text
---

show-notes
---

show-tuning
---

hide-marked-tuning
---

fret-number-side
---

tuning
---

fret-signs
---

marks
---
