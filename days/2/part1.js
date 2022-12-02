let data = require('../../get_data')(2);

const ACode = "A".charCodeAt(0);
const XCode = "X".charCodeAt(0);

const normalized = data.split('\n').map(e => {
    const him = e.charCodeAt(0) - ACode;
    const you = e.charCodeAt(2) - XCode; 
    const win = you == him ? 3 : (him + 1) % 3 == you ? 6 : 0;
    const score = you + 1 + win;
    return [him, you, win, score];
});

const result = normalized.map(e => e[3]).reduce((a, b) => a + b, 0);

console.log(result);