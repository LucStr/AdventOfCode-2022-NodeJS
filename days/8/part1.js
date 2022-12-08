let data = require('../../get_data')(8);

const map = data.split('\n').map((line, y) => line.split('').map((char, x) => {
    return {
        height: parseInt(char),
        x: x,
        y: y,
        visible: []
    }
})).reduce((acc, row) => acc.concat(row), []);

const directions = [[1, 0], [0, -1], [-1, 0], [0, 1]];
map.forEach(tree => {
    tree.neighbors = directions.map((dir, index) => {
        let neighbor = map.find((other) => other.x === tree.x + dir[0] && other.y === tree.y + dir[1]);
        if(!neighbor){
            tree.visible[index] = true;
        }
        return neighbor;
    });
});

for(let i = 0; i < directions.length; i++){
    const inverseDirection = (i + 2) % 4;
    const border = map.filter(e => e.visible[i]);
    for(let tile of border){
        let current = tile;
        let highest = current.height;
        
        while(current.neighbors[inverseDirection] !== undefined) {
            let next = current.neighbors[inverseDirection];
            if(next.height > highest){
                highest = next.height;
                next.visible[i] = true;
            } else {
                next.visible[i] = false;
            }
            current = next;
        }
    }    
}

const result = map.filter(e => e.visible.find(v => v)).length;
console.log(result)