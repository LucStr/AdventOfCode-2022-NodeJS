let data = require('../../get_data')(13);

const pairs = data.split('\n\n').map((pair, index) =>{
    const [left, right] = pair.split('\n').map(line => {
        return eval(line)
    });

    return {left, right, index: index + 1}
});

function isNumber(value){
    return !isNaN(value) && !(value instanceof Array);
}

function isLower({left, right}){
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
            result = isLower({left: left[i], right: right[i]});
        } else if(isNumber(left[i]) && right[i] instanceof Array){
            result = isLower({left: [left[i]], right: right[i]});
        } else if(left[i] instanceof Array && isNumber(right[i])){
            result = isLower({left: left[i], right: [right[i]]});
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

const result = pairs.filter(isLower).reduce((a, b) => a + b.index, 0);

console.log(result);