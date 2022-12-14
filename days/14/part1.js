let data = require('../../get_data')(14);

const map = data.split('\n').reduce((map, line) => {
    const edges = line.split(' -> ').map(e =>{
        const [x, y] = e.trim().split(',').map(Number);

        return {x, y};
    });

    let current = edges.shift();
    for(let edge of edges){
        for(let x = current.x; x <= edge.x; x++){
            for(let y = current.y; y <= edge.y; y++){
                let existing = map.find(e => e.x === x && e.y === y);
                if(!existing){
                    map.push({x, y, type: '#'});
                }
            }
        }
        for(let x = current.x; x >= edge.x; x--){
            for(let y = current.y; y >= edge.y; y--){
                let existing = map.find(e => e.x === x && e.y === y);
                if(!existing){
                    map.push({x, y, type: '#'});
                }
            }
        }
        current = edge;
    }

    return map;
}, []);

function printMap(){
    const minX = Math.min(...map.map(e => e.x));
    const maxX = Math.max(...map.map(e => e.x));
    const minY = Math.min(...map.map(e => e.y));
    const maxY = Math.max(...map.map(e => e.y));

    let out = ''
    for(let y = minY; y <= maxY; y++){
        for(let x = minX; x <= maxX; x++){
            let existing = map.find(e => e.x === x && e.y === y);
            if(existing){
                out += existing.type;
            } else {
                out += '.';
            }
        }
        out += '\n';
    }

    console.log(out);
}
printMap();

const source = {x: 500, y: 0, type: '+'};
map.push(source);

const DIRECTIONS = [{x: 0, y: 1}, {x: -1, y: 1}, {x: 1, y: 1}];
const MAX_DEPTH = Math.max(...map.map(e => e.y));

let current = {x: 500, y: 0};

main: while(current.y <= MAX_DEPTH){
    const tile = map.find(e => e.x === current.x && e.y === current.y);

    for(let direction of DIRECTIONS){
        let next = {x: current.x + direction.x, y: current.y + direction.y};
        let existing = map.find(e => e.x === next.x && e.y === next.y);
        if(!existing){
            existing = {x: next.x, y: next.y, type: '.', previous: tile};
            map.push(existing);
        }

        if(existing.type === '.'){
            current = next;
            continue main;
        }
    }

    tile.type = 'o';
    current = tile.previous;
}

printMap();
const result = map.filter(e => e.type === 'o').length;

console.log(result);