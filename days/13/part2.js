let data = require('../../get_data')(13);

function isNumber(value){
    return !isNaN(value) && !(value instanceof Array);
}

function isLower(left, right){
    let i = 0;
    while(i < left.length && i < right.length){
        let result = undefined;
        if(isNumber(left[i]) && isNumber(right[i])){
            if(left[i] < right[i]){
                return true;
            } else if(left[i] > right[i]){
                return false;
            }
        } else if(left[i] instanceof Array && right[i] instanceof Array){
            result = isLower(left[i], right[i]);
        } else if(isNumber(left[i]) && right[i] instanceof Array){
            result = isLower([left[i]], right[i]);
        } else if(left[i] instanceof Array && isNumber(right[i])){
            result = isLower(left[i], [right[i]]);
        } else {
            console.log('hello')
        }

        if(result !== undefined){
            return result;
        }
        i++;
    }

    if(left.length === right.length){
        return undefined;
    }
    
    return left.length < right.length;
}

const first = '[[2]]';
const second = '[[6]]';

data += '\n' + first + '\n' + second;

const ordered = data.split('\n').filter(line => line !== '').sort((a, b) => {
    let first = eval(a);
    let second = eval(b);

    if(isLower(first, second)){
        return -1;
    } else {
        return 1;
    }
});

const result = (ordered.findIndex(e => e === first) + 1) * (ordered.findIndex(e => e === second) + 1);

console.log(result);