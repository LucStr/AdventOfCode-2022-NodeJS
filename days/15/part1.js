let data = require('../../get_data')(15);

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

const acc = sensors.map(e => e.getAreaOnY(2000000)).filter(e => e !== undefined).sort((a, b) => a.xStart - b.xStart).reduce((acc, e, i, arr) => {
    if(acc === undefined){
        return {
            count: 0,
            xStart: e.xStart,
            xEnd: e.xEnd
        };
    }

    if(e.xStart > acc.xEnd){
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

const result = acc.count + (acc.xEnd - acc.xStart);
console.log(result);
