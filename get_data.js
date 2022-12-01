module.exports = function(day){
    return require('fs').readFileSync(require('path').join(__dirname, `days/${day}/data.in`)).toString();
}