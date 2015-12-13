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

Signs
-----

Signs are dots/double dots (or other symbols) on some frets.

fret-signs
~~~~~~~~~~

``fret-signs :: Object, default {3: 'dot', 5: 'dot', 7: 'double-dot', ...}``

Sets frets (as keys), that be signed by symbol (in value). Possible values are:

* ``dot``
* ``double-dot``
* ``star``
* ``double-star``

sign-size
~~~~~~~~~

``sign-size :: Number, default 6``

Specifies half-width (radius) of all signs on fretboard.

sign-color
~~~~~~~~~~

``sign-color :: String, default '#ccc'``

Marks
-----

Marks are fingertips on strings, that may used to show particular notes, chords or scales on fretboard.

marks
~~~~~

``marks :: Array, default []``

``marks`` is an array of mark objects, that be drawed on fretboard.

Mark object in general case has structure::

    mark = {
        string :: Number
        fret :: Number
        [size] :: Number
        [color] :: String
        [text] :: String
        [border] = {
            size :: Number
            color :: String
        }
    }

mark-size
~~~~~~~~~

``mark-size :: Number, default 13``

Sets default value for marks without defined size.

mark-text
~~~~~~~~~

``mark-text :: String, default ''``

mark-font
~~~~~~~~~

``mark-font :: String, default '12px sans-serif'``

mark-color
~~~~~~~~~~

``mark-color :: String, default '#fefefe'``

mark-border
~~~~~~~~~~~

``mark-border :: Object, default {size: 2, color: '#666'}``

mark-position
~~~~~~~~~~~~~

``mark-position :: Number, default 0.55``

Sets ratio there mark must be placed beetween frets.

* 0.5 means center.
* 0.0 means previous fret line
* 1.0 means next fret line

Value between 0.6 and 0.9 are good value for realistic rendering. 

show-notes
~~~~~~~~~~

``show-notes :: String, default 'simple'``

Shows notes value on marks without text. Possible values:

* ``no``
* ``simple`` - show note without octave (C, D# as example)
* ``full`` - show not with octave (C2, D#4 as example)

Fret numbers
------------

fret-number-side
---

fret-number-font
---

fret-number-color
---

Capo
----

capo
~~~~

capo-color
~~~~~~~~~~

capo-width
~~~~~~~~~~

Tuning
------

tuning
~~~~~~

tuning-color
~~~~~~~~~~~~

tuning-font
~~~~~~~~~~~

show-tuning
~~~~~~~~~~~

hide-marked-tuning
~~~~~~~~~~~~~~~~~~

Margins and paddings
--------------------

bridge-margin
~~~~~~~~~~~~~

space-margin
~~~~~~~~~~~~

fret-number-margin
~~~~~~~~~~~~~~~~~~

capo-bulge
~~~~~~~~~~

start-border-margin
~~~~~~~~~~~~~~~~~~~

end-border-margin
~~~~~~~~~~~~~~~~~

string-outer-margin
~~~~~~~~~~~~~~~~~~~
