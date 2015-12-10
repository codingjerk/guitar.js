var guitar = new Guitar('guitar');
guitar.addEventListener('move', function(string, fret) {
    guitar.resetMarks();
    guitar.mark(string.value, fret.value);
    console.log(string.value);
});