let data = require('../../get_data')(22);

const SIDE_SIZE = 50;
const MAX_SIDE_INDEX = SIDE_SIZE - 1;
const [grid, instructionText] = data.split('\n\n');
const map = grid.split('\n').map((line, y) => line.split('').map((type, x) => ({x: x + 1, y: y + 1, cx: x % SIDE_SIZE, cy: y % SIDE_SIZE, type, cube: Math.floor(y / SIDE_SIZE) * 3 + Math.floor(x / SIDE_SIZE)}))).flat().filter(e => e.type && e.type !== ' ');

const RIGHT = 0;
const DOWN = 1;
const LEFT = 2;
const UP = 3;

const directions = [
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x: -1, y: 0},
    {x: 0, y: -1}
];

map.forEach(node => {
    node.connections = directions.map((d, i) => {
        let dy = node.y + d.y;
        let dx = node.x + d.x;
       
        let connection = map.find(e => e.x === dx && e.y === dy);
        if(connection === undefined){
            connection = getConnection(node, i);
        }
        return connection
    });
});

function getConnection(node, direction){
    let tile;
    let newDirection;
    switch (node.cube){
        case 1:
            switch (direction){
                case UP:
                    tile = map.find(e => e.cube === 9 && e.cx === 0 && e.cy === node.cx);
                    newDirection = RIGHT;
                    break;
                case LEFT:
                    tile = map.find(e => e.cube === 6 && e.cx === 0 && e.cy === MAX_SIDE_INDEX - node.cy);
                    newDirection = RIGHT;
            }
            break;
        case 2:
            switch (direction){
                case UP:
                    tile = map.find(e => e.cube === 9 && e.cy === MAX_SIDE_INDEX && e.cx === node.cx);
                    newDirection = UP;
                    break;
                case RIGHT:
                    tile = map.find(e => e.cube === 7 && e.cx === MAX_SIDE_INDEX && e.cy === MAX_SIDE_INDEX - node.cy);
                    newDirection = LEFT;
                    break;
                case DOWN:
                    tile = map.find(e => e.cube === 4 && e.cx === MAX_SIDE_INDEX && e.cy === node.cx);
                    newDirection = LEFT;
                    break;
            }
            break;
        case 4:
            switch (direction){
                case RIGHT:
                    tile = map.find(e => e.cube === 2 && e.cy === MAX_SIDE_INDEX && e.cx === node.cy);
                    newDirection = UP;
                    break;
                case LEFT:
                    tile = map.find(e => e.cube === 6 && e.cy === 0 && e.cx === node.cy);
                    newDirection = DOWN;
                    break;
            }
            break;
        case 6:
            switch (direction){
                case UP:
                    tile = map.find(e => e.cube === 4 && e.cx === 0 && e.cy === node.cx);
                    newDirection = RIGHT;
                    break;
                case LEFT:
                    tile = map.find(e => e.cube === 1 && e.cx === 0 && e.cy === MAX_SIDE_INDEX - node.cy);
                    newDirection = RIGHT;
                    break;
            }
            break;
        case 7:
            switch (direction){
                case RIGHT:
                    tile = map.find(e => e.cube === 2 && e.cx === MAX_SIDE_INDEX && e.cy === MAX_SIDE_INDEX - node.cy);
                    newDirection = LEFT;
                    break;
                case DOWN:
                    tile = map.find(e => e.cube === 9 && e.cx === MAX_SIDE_INDEX && e.cy === node.cx);
                    newDirection = LEFT;
                    break;
            }
            break;
        case 9:
            switch (direction){
                case RIGHT:
                    tile = map.find(e => e.cube === 7 && e.cy === MAX_SIDE_INDEX && e.cx === node.cy);
                    newDirection = UP;
                    break;
                case DOWN:
                    tile = map.find(e => e.cube === 2 && e.cy === 0 && e.cx === node.cx);
                    newDirection = DOWN;
                    break;
                case LEFT:
                    tile = map.find(e => e.cube === 1 && e.cy === 0 && e.cx === node.cy);
                    newDirection = DOWN;
                    break;
            }
            break;
        default:
            console.log('CRY');
    }

    if(!tile){
        console.log('CRY', node.cube, direction)
    }

    return {
        tile, direction: newDirection
    }
}


const instructions = instructionText.match(/(\d+)?([A-Z])?/g).filter(e => e).reduce((acc, e) => {
    const match = e.match(/\d+/)
    const number = Number(match && match[0]);
    const letter = match != null ? e.split(match[0])[1] : e;
    acc.push(number, letter);
    return acc;
}, []).filter(e => e);


function pick({x, y, cx, cy, type, cube}){
    return {x, y, cx, cy, type, cube};
}
let currentDirection = 0;
let currentTile = map[0];
let set = new Set();
for(let i = 0; i < instructions.length; i++){
    if(instructions[i] === 'R'){
        currentDirection = (currentDirection + 1) % 4;
    } else if(instructions[i] === 'L'){
        currentDirection = (currentDirection + 3) % 4;
    } else if(!isNaN(instructions[i])){
        for(let j = 0; j < instructions[i]; j++){
            set.add(currentTile);
            const destination = currentTile.connections[currentDirection];
            if(destination.type === '#' || (destination.tile && destination.tile.type === '#')){
                break;
            }
            if(destination.tile){
                console.log('traversed!', pick(currentTile), pick(destination.tile));
                currentTile = destination.tile;
                currentDirection = destination.direction;
            } else {
                currentTile = destination;
            }
        }
    } else {
        console.log('CRY!')
    }

    //printMap();
}

function printMap(){
    let out = '';
    for(let y = 0; y < SIDE_SIZE * 4; y++){
        for(let x = 0; x < SIDE_SIZE * 4; x++){
            let tile = map.find(e => e.x === x && e.y === y);
            out += tile ? set.has(tile) ? '+' : tile.type : ' ';
        }
        out += '\n'
    }
    require('fs').writeFileSync('out.txt', out);
}

const result = (currentTile.y) * 1000 + (currentTile.x) * 4 + currentDirection;
console.log(result);

