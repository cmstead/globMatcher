'use strict';
    
// Convenience functions
    
function isString(value) {
    return typeof value === 'string';
}

function cleanStr(value) {
    return isString(value) ? value : '';
}

function sanitizeArray(values) {
    return values instanceof Array ? values : [];
}

function identity (value){
    return value;
}

// Core Behaviors
    
function globToPattern(glob) {
    var sep = '\\/';
    var dirGlobPattern = new RegExp('\\*\\*(\\' + sep + ')?', 'g');

    var pattern = cleanStr(glob)
        .replace('\\', '\\\\')
        .replace(/\//g, '\\/')
        .replace(/\./g, '\\.')
        .replace(dirGlobPattern, '([^' + sep + '].*' + sep + '?)*')
        .replace(/(sep|\\\.)(\*)/g, '$1(.*)');

    return new RegExp(pattern);
}

function buildMatcher(glob) {
    var pattern = globToPattern(glob);

    return function (value) {
        return isString(value) && value.match(pattern) !== null;
    }
}

function check(glob, value) {
    return buildMatcher(glob)(value);
}

function checkArray(glob, values) {
    return sanitizeArray(values).filter(buildMatcher(glob)).length > 0;
}

function checkGlobArray(globSet, value) {
    return sanitizeArray(globSet)
            .map(buildMatcher)
            .map(function (matcher) { return matcher(value); })
            .filter(identity).length > 0;
}

buildMatcher.signature = 'RegExp => String => Boolean';
check.signature = 'String, String => Boolean';
checkArray.signature = 'String, Array[String] => Boolean';
checkGlobArray.signature = 'Array[String], String => Boolean'
globToPattern.signature = 'String => RegExp';

module.exports = {
    buildMatcher: buildMatcher,
    check: check,
    checkArray: checkArray,
    checkGlobArray: checkGlobArray,
    globToPattern: globToPattern
};