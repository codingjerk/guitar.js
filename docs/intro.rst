Getting started
===============

Guitar.js is a guitar fretboard rendering library with ample opportunities.

Features
--------

* Responsive-frendly
* Fully customizable
* No dependencies
* Fine default look

Usage
-----

0. Include a guitar.js
~~~~~~~~~~
::

    <script src="some_dir/guitar.js/build/guitar.min.js"></script>

1. Create a container
~~~~~~~~~~
::

    <div id='guitar'></div>

2. Create a guitar
~~~~~~~~~~
::

    var guitar = new Guitar('guitar'); // Use your container id

2.5. (Optional) specify options
~~~~~~~~~~
::

    var guitar = new Guitar('guitar', {
        'end-fret': 5 // Creates a fretboard with frets from 1 to 5 (inclusive)
    });

3. Enjoy
~~~~~~~~~~
Doesn't forget to adjust container size.