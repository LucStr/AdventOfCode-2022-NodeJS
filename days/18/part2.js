let data = require('../../get_data')(18);

const tiles = data.split('\n').map(e => e.split(',').map(Number))

tiles.forEach(tile => {
    tile.neighbors = tiles.filter(otherTile => tile.reduce((a, b, i) => a + Math.abs(b - otherTile[i]), 0) === 1)
    tile.foundCount = 0;
});

const mins = tiles[0].map((e, i) => Math.min(...tiles.map(e => e[i])) - 1);
const maxs = tiles[0].map((e, i) => Math.max(...tiles.map(e => e[i])) + 1);

const queue = [[...mins]];
const visited = new Set();
let count = 0;
while(queue.length > 0){
    const current = queue.shift();
    const key = current.join(',');
    if(visited.has(key)){
        continue;
    }
    visited.add(key);

    for(let dimension = 0; dimension < current.length; dimension++){
        const upper = [...current];
        upper[dimension] += 1;
        if(upper.every((e, i) => e <= maxs[i])){
            const upperTile = tiles.find(e => e.every((e, i) => e === upper[i]));
            if(upperTile){
                upperTile.foundCount++;
            } else{
                queue.push(upper);
            }
        }
        

        const lower = [...current];
        lower[dimension] -= 1;
        if(lower.every((e, i) => e >= mins[i])){
            const lowerTile = tiles.find(e => e.every((e, i) => e === lower[i]));
            if(lowerTile){
                lowerTile.foundCount++;
            }else{
                queue.push(lower);
            }
        }        
    }
}

const result = tiles.reduce((a, b) => a + b.foundCount, 0);
console.log(result);
