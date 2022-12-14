let data = require('../../get_data')(12);

const charCodea = 'a'.charCodeAt(0);
let start;
let end;

const map = data.split('\n').map((line, y) => {
    return line.split('').map((char, x) => {
        const height = char.charCodeAt(0) - charCodea;
        const tile = {
            x,
            y,
            char,
            height,
        }

        if(char === 'S'){
            start = tile;
            tile.height = 0;
        }

        if(char === 'E'){
            end = tile;
            tile.height = 'z'.charCodeAt(0) - charCodea;
        }

        return tile;
    });
}).flat();

map.forEach(tile => {
    tile.neighbors = map.filter(other => {
        return Math.abs(tile.x - other.x) + Math.abs(tile.y - other.y) === 1 && other.height - 1 <= tile.height - 1;
    });
});

start = end;
console.log(map, start, end);
let queue = [{
    tile: start,
    tail: []
}];

let current;
while(current = queue.shift()){
    if(current.tile.height === 0){
        break;
    }

    current.tile.neighbors.forEach(neighbor => {
        if(!current.tail.includes(neighbor) && !queue.some(e => e.tile === neighbor)){
            queue.push({
                tile: neighbor,
                tail: [...current.tail, current.tile]
            });
        }
    });
}

const result = current.tail.length;
console.log(current, result);