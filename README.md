Guitar.js
=========
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/chezstov/guitar.js/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/chezstov/guitar.js.svg?style=flat-square)](https://github.com/chezstov/guitar.js/issues)
[![Gitter](https://img.shields.io/gitter/room/chezstov/guitar.js.svg?style=flat-square)](https://gitter.im/chezstov/guitar.js)
[![Waffle.io](https://img.shields.io/badge/waffle.io-board-lightgrey.svg?style=flat-square)](https://waffle.io/chezstov/guitar.js)
[![Bower](https://img.shields.io/bower/v/guitar.js.svg?style=flat-square)](https://github.com/chezstov/guitar.js)
[![Travis](https://img.shields.io/travis/chezstov/guitar.js.svg?style=flat-square)](https://travis-ci.org/chezstov/guitar.js)

Guitar.js is a guitar fretboard rendering library.

[![Try demo](https://img.shields.io/badge/try-demo-brightgreen.svg?style=flat-square)](http://chezstov.github.io)

![Marks](https://raw.githubusercontent.com/chezstov/guitar.js/master/img/marks.png)

Features
--------
* Responsive-frendly
* Fully customizable
* No dependencies
* Fine default look

Usage
-----
*Note: documentation has more information*

#### 0. Include a guitar.js
```html
<script src="some_dir/guitar.js/build/guitar.min.js"></script>
```

#### 1. Create a container
```html
<div id='guitar'></div>
```

#### 2. Create a guitar
```javascript
var guitar = new Guitar('guitar'); // Use your container id
```

#### 2.5. (Optional) specify options
```javascript
var guitar = new Guitar('guitar', {
    'end-fret': 5 // Creates a fretboard with frets from 1 to 5 (inclusive)
});
```

#### 3. Enjoy
Doesn't forget to adjust container size.

Some example images
-----------------
![Default look](https://raw.githubusercontent.com/chezstov/guitar.js/master/img/default.png)

![Flipped](https://raw.githubusercontent.com/chezstov/guitar.js/master/img/flip.png)