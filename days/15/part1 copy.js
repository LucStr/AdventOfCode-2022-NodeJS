let data = require('../../get_data')(15);


data = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`

const sensors = data.split('\n').map((line, i) => {
    const [sx, sy, bx, by] = line.match(/-?\d+/g).map(Number);

    const manhattan = Math.abs(sx - bx) + Math.abs(sy - by);
    const getAreaOnY = (y) => {
        const distanceFromCenter = Math.abs(sy - y);
        if(distanceFromCenter > manhattan){
            return {sx, sy, bx, by, manhattan, y};
        }

        return {
            xStart: sx + distanceFromCenter - manhattan,
            xEnd: sx - distanceFromCenter + manhattan,
            sx, sy, bx, by, manhattan, y
        }
    };
    return {sx, sy, bx, by, manhattan, getAreaOnY};
});

console.log(sensors.map(e => e.getAreaOnY(12)))
const acc = sensors.map(e => e.getAreaOnY(12)).filter(e => e !== undefined).sort((a, b) => a.xStart - b.xStart).reduce((acc, e, i, arr) => {
    if(acc === undefined){
        return {
            count: 0,
            xStart: e.xStart,
            xEnd: e.xEnd
        };
    }

    if(e.xStart > acc.xEnd){
        console.log(e.xStart - 1)
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
