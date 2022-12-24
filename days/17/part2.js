let data = require('../../get_data')(17);

const pushes = data.split('').map(e => e === '<' ? -1 : e === '>' ? 1 : 0);

const tiles = [
    `####`,
    `.#.
     ###
     .#.`,
    `..#
     ..#
     ###`,
    `#
     #
     #
     #`,
    `##
     ##`
].map(drawing => {
    const lines = drawing.split('\n').map(e => e.trim()).filter(e => e.length > 0);
    const width = lines[0].length;
    const height = lines.length;
    const tiles = [];
    for(let y = 0; y < height; y++){
        for(let x = 0; x < width; x++){
            if(lines[y][x] === '#'){
                tiles.push({x, y: height - y - 1});
            }
        }
    }

    return tiles;
});

let map = new Array(7).fill(0).map((e, i) => {
    return {x: i, y: 0};
});

const highest = new Array(7).fill(0);
let pushCount = 0;
const TILECOUNT = 1000000000000;

const memo = [];
function checkAndAdd(inputIndex, tileIndex, highestTiles, value){
    const highestTilesString = JSON.stringify(highestTiles.map(e => e.y - highestTiles));
    if(!memo[inputIndex]){
        memo[inputIndex] = [];
    }
    if(!memo[inputIndex][tileIndex]){
        memo[inputIndex][tileIndex] = new Map();
    }
    if(!memo[inputIndex][tileIndex].has(highestTilesString)){
        memo[inputIndex][tileIndex].set(highestTilesString, value);
        return false;
    }
    return memo[inputIndex][tileIndex].get(highestTilesString);
}

let foundCycle = false;
for(let i = 0; i < TILECOUNT; i++){
    let highestRock = Math.max(...highest);
    if(i === 2022){
        console.log(highestRock);
    }
    const tileIndex = i % 5;
    map = map.sort((a, b) => b.y - a.y);

    let cycle = checkAndAdd(pushCount % pushes.length, tileIndex, map.slice(0, 30), {
        i,
        highestRock,
    });

    if(!foundCycle && cycle && i > 2022){
        foundCycle = true;
        const heightDifference = highestRock - cycle.highestRock; //dy
        const cycleLength = i - cycle.i; //dt
        const cycleCount = Math.floor((TILECOUNT - i) / cycleLength);
        i += cycleCount * cycleLength;
        const toAdd = cycleCount * heightDifference;
        map.slice(0, 60).forEach(tile => {
            tile.y += toAdd;
        });
        highestRock += toAdd;
    }

    const tile = tiles[tileIndex].map(({x, y}) => {
        return {x: x + 2, y: y + highestRock + 4};
    });

    map.push(...tile);

    const leftMostTile = tile.sort((a, b) => a.x - b.x)[0];
    const rightMostTile = tile.sort((a, b) => b.x - a.x)[0];

    let xModifier = 0;
    while(!wouldCollideWithMap(tile)){
        const push = pushes[pushCount % pushes.length];
        //console.log(push, (leftMostTile.x + push) >= 0 && (rightMostTile.x + push) < 7 && tile.every(({x, y}) => highest[x] < y))
        pushCount++;
        xModifier = (leftMostTile.x + push) >= 0 && 
                        (rightMostTile.x + push) < 7 &&  
                        !wouldCollideWithMap(tile.map(e => { 
                            return {
                                x: e.x + push,
                                y: e.y
                            };
                        })) ? push : 0;
        for(let t of tile){
            t.x += xModifier;
            t.y--;
        }        
    }
    tile.forEach(t => {
        t.y++;
        highest[t.x] = Math.max(highest[t.x], t.y);
    });
}

function wouldCollideWithMap(tile){
    const lowestY = Math.min(...tile.map(e => e.y));
    for(let point of map){
        if(point.y < lowestY){
            return false;
        }

        if(tile.find(e => e.x === point.x && e.y === point.y && e !== point)){
            return true;
        }
    }
    return false;
}

function printMap(){
    let out = ''
    for(let y = Math.max(...highest) + 8; y >= 0; y--){
        for(let x = 0; x < 7; x++){
            out += map.find(e => e.x === x && e.y === y) ? '#' : '.';
        }
        out += '\n'
    }
    console.log(out)
}

const result = Math.max(...highest);
console.log(result);