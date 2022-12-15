let data = require('../../get_data')(15);

const MAX_Y = 4000000;
const sensors = data.split('\n').map((line, i) => {
    const [sx, sy, bx, by] = line.match(/-?\d+/g).map(Number);

    const manhattan = Math.abs(sx - bx) + Math.abs(sy - by);
    const getAreaOnY = (y) => {
        const distanceFromCenter = Math.abs(sy - y);
        if(distanceFromCenter > manhattan){
            return undefined;
        }

        return {
            xStart: sx + distanceFromCenter - manhattan,
            xEnd: sx - distanceFromCenter + manhattan
        }
    };

    return {sx, sy, bx, by, manhattan, getAreaOnY};
});

let possibility = undefined;
for(let y = 0; y < MAX_Y; y++){
    const acc = sensors.map(e => e.getAreaOnY(y)).filter(e => e !== undefined).sort((a, b) => a.xStart - b.xStart).reduce((acc, e, i, arr) => {
        var a = sensors;
        if(acc === undefined){
            return {
                count: 0,
                xStart: e.xStart,
                xEnd: e.xEnd
            };
        }

        if(possibility && e.xStart <= possibility.x){
            possibility = undefined;
        }
    
        if(e.xStart > acc.xEnd + 1){
            possibility = {y, x: e.xStart - 1};
            return {
                count: acc.count + (acc.xEnd - acc.xStart),
                xStart: e.xStart,
                xEnd: e.xEnd
            };
        }
    
        acc.xStart = Math.min(acc.xStart, e.xStart);
        acc.xEnd = Math.max(acc.xEnd, e.xEnd);
    
        return acc;
    }, undefined);
    
    if(possibility){
        console.log(possibility)
        console.log(possibility.x * 4000000 + possibility.y)
        possibility = undefined;

    }
}

