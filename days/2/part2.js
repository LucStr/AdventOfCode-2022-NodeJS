let data = require('../../get_data')(2);

const ACode = "A".charCodeAt(0);
const XCode = "X".charCodeAt(0);

const normalized = data.split('\n').map(e => {
    const him = e.charCodeAt(0) - ACode;
    const win = e.charCodeAt(2) - XCode;
    let you;
    switch(win){
        case 1:
            you = him;
            break;
        case 0:
            you = (3 + him - 1) % 3;
            break;
        case 2:
            you = (him + 1) % 3;
            break;
    }
    const score = you + 1 + win * 3;
    return [him, you, win, score];
});

const result = normalized.map(e => e[3]).reduce((a, b) => a + b, 0);

console.log(result);