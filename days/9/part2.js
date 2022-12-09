let data = require('../../get_data')(9);

const directions = {
    'U': [0, 1],
    'L': [-1, 0],
    'D': [0, -1],
    'R': [1, 0]
};

const start = {x: 0, y: 0, visited: true};
const map = [start];
const rope = new Array(10).fill(0).map(() => start);

data.split('\n').forEach(line => {
    const [direction, distanceString] = line.split(' ');
    const [x, y] = directions[direction];
    const distance = parseInt(distanceString);

    for(let i = 0; i < distance; i++){
        const head = rope[0];
        let next = map.find((node) => node.x === head.x + x && node.y === head.y + y);
        if(!next){
            next = {x: head.x + x, y: head.y + y, visited: false};
            map.push(next);
        }

        rope[0] = next;
        for(let j = 1; j < rope.length; j++){
            const previous = rope[j - 1];
            const tail = rope[j];

            const dx = previous.x - tail.x;
            const dy = previous.y - tail.y;
            if(Math.abs(dx) > 1 || Math.abs(dy) > 1){
                let nx = tail.x + Math.min(Math.max(dx, -1), 1);
                let ny = tail.y + Math.min(Math.max(dy, -1), 1);
                let target = map.find((node) => node.x === nx && node.y === ny);
                if(!target){
                    target = {x: nx, y: ny, visited: false};
                    map.push(target);
                }

                rope[j] = target;
            }
        }   
        rope[9].visited = true; 
    }
})

function printMap(){
    const minX = map.reduce((min, node) => Math.min(min, node.x), 0);
    const maxX = map.reduce((max, node) => Math.max(max, node.x), 0);
    const minY = map.reduce((min, node) => Math.min(min, node.y), 0);
    const maxY = map.reduce((max, node) => Math.max(max, node.y), 0);
    
    let out = '';
    for(let y = maxY; y >= minY; y--){
        for(let x = minX; x <= maxX; x++){
            const node = map.find((node) => node.x === x && node.y === y);
            const tailIndex = rope.indexOf(node);
            if(!node){
                out += '.';
            } else if(node === start){
                out += 's';
            } else if(node === rope[0]){
                out += 'H';
            } else if(tailIndex !== -1){
                out += tailIndex;
            } else if(node.visited){
                out += '#';
            } else {
                out += '.';
            }
        }
        out += '\n';
    }
    console.log(out)
}

const result = map.filter((node) => node.visited).length;
console.log(result);
