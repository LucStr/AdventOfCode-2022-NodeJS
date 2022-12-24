let data = require('../../get_data')(24);

const MAP_HEIGHT = data.split('\n').length;
const MAP_WIDTH = data.split('\n')[0].length;

const directions = [
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x: -1, y: 0},
    {x: 0, y: -1}
]

const {map, blizzards, start, end} = data
    .split('\n')
    .map((line, y) => line
        .split('')
        .map((type, x) => {
            return {x, y, type};
        })
    ).flat().reduce(({map, blizzards, start, end}, {x, y, type}) => {
        let tile = {x, y, type};
        let blizzard;
        switch(type){
            case '>':
                blizzard = {tile, direction: 0};
                break;
            case 'v':
                blizzard = {tile, direction: 1};
                break;
            case '<':
                blizzard = {tile, direction: 2};
                break;
            case '^':
                blizzard = {tile, direction: 3};
                break;
        }

        if(blizzard){
            tile.type = '.';
            blizzards.push(blizzard);
        }

        if(type === '.' && y < start.y){
            start = tile;
        }

        if(type === '.' && y > end.y){
            end = tile;
        }
        
        map.push(tile);
        return {map, blizzards, start, end};
    }, {map: [], blizzards: [], start: {y: Infinity}, end: {y: -Infinity}});

for(let tile of map){
    if(tile.type === '#'){
        continue;
    }
    if(tile.type !== '.'){
        console.log('CRY');
    }

    const neighbors = []
    for(let direction of directions){
        let destination = map.find(({x, y}) => x === tile.x + direction.x && y === tile.y + direction.y);

        if(destination === undefined){
            // Only happens for start and end
            continue;
        }

        if(destination.type === '#' && tile !== start && tile !== end){
            destination = map.find(({x, y}) => x === tile.x - direction.x * (MAP_WIDTH - 3) && y === tile.y - direction.y * (MAP_HEIGHT - 3));
            destination = {
                destination,
                onlyBlizzard: true
            }
        }
        neighbors.push(destination);
    }
    
    tile.neighbors = neighbors;
}

for(let blizzard of blizzards){
    const tail = [];
    let current = blizzard.tile;
    do {
        tail.push(current);
        current = current.neighbors[blizzard.direction];
        if(current.onlyBlizzard){
            current = current.destination;
        }
    } while(current !== blizzard.tile);
    blizzard.tail = tail;
}

for(let tile of map){
    if(tile.type === '#'){
        continue;
    }

    tile.verticalStates = blizzards.filter(e => (e.direction === 1 || e.direction === 3) && e.tail.includes(tile)).reduce((acc, {tail}) => {
        let index = tail.indexOf(tile);
        acc[index] = false;
        return acc;
    }, new Array(MAP_HEIGHT - 2).fill(true));

    tile.horizontalStates = blizzards.filter(e => (e.direction === 0 || e.direction === 2) && e.tail.includes(tile)).reduce((acc, {tail}) => {
        let index = tail.indexOf(tile);
        acc[index] = false;
        return acc;
    }, new Array(MAP_WIDTH - 2).fill(true));
}

const visited = new Set();
const queue = [{tile: start, steps: 0, tail: [start]}];
let result;
while(true){
    let {tile, steps, tail} = queue.shift();
    if(tile === end){
        result = tail;
        break;
    }

    steps++;
    const verticalIndex = steps % (MAP_HEIGHT - 2);
    const horizontalIndex = steps % (MAP_WIDTH - 2);
    const key = `${tile.x},${tile.y},${verticalIndex - 1},${horizontalIndex - 1}`;
    if(visited.has(key)){
        continue;
    }
    visited.add(key);
    
    if(tile.verticalStates[verticalIndex] && tile.horizontalStates[horizontalIndex]){
        queue.push({tile, steps, tail: [...tail, tile]});
    }

    for(let neighbor of tile.neighbors){
        if(neighbor.type === '#' || neighbor.onlyBlizzard){
            continue;
        }

        if(neighbor.verticalStates[verticalIndex] && neighbor.horizontalStates[horizontalIndex]){
            queue.push({tile: neighbor, steps, tail: [...tail, neighbor]});
        }
    }
}

console.log((MAP_HEIGHT - 2) * (MAP_WIDTH - 2))
//console.log({map, blizzards, start, end});
console.log(result.length - 1);