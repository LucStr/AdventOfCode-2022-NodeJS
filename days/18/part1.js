let data = require('../../get_data')(18);

const tiles = data.split('\n').map(e => e.split(',').map(Number))
tiles.forEach(tile => {
    tile.neighbors = tiles.filter(otherTile => tile.reduce((a, b, i) => a + Math.abs(b - otherTile[i]), 0) === 1)
});

const result = tiles.reduce((a, b) => a + 6 - b.neighbors.length, 0);
console.log(result);