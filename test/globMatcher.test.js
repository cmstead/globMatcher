'use strict';

var assert = require('chai').assert;
var globMatcher = require('../src/globMatcher');

describe('Glob Matcher Utility', function () {
    
    describe('globToPattern', function () {
        
        it('should return a RegExp instance', function () {
            assert.equal(globMatcher.globToPattern('foo') instanceof RegExp, true);
        });
        
        it('should escape dots', function () {
            assert.equal(globMatcher.globToPattern('foo.bar').toString(), '/foo\\.bar/');
        });
        
        it('should escape forward slashes', function () {
            assert.equal(globMatcher.globToPattern('foo/bar').toString(), '/foo\\/bar/');
        });
        
        it('should escape back slashes', function () {
            assert.equal(globMatcher.globToPattern('foo\\bar').toString(), '/foo\\\\bar/');
        });
        
        it('should convert ** to a directory matcher', function () {
            assert.equal(globMatcher.globToPattern('**/foo').toString(), '/([^\\/].*\\/?)*foo/');
        });
        
        it('should convert ** to a directory matcher in the middle of a string', function () {
            assert.equal(globMatcher.globToPattern('foo/**/bar').toString(), '/foo\\/([^\\/].*\\/?)*bar/');
        });
        
        it('should convert * to an "any" matcher', function () {
            assert.equal(globMatcher.globToPattern('foo.*').toString(), '/foo\\.(.*)/');
        });

        it('should safely convert * and ** in the same pattern', function () {
            assert.equal(globMatcher.globToPattern('foo/**/bar.*').toString(), '/foo\\/([^\\/].*\\/?)*bar\\.(.*)/');
        });
        
    });
    
    describe('buildMatcher', function () {
        
        it('should return a function', function () {
            assert.equal(typeof globMatcher.buildMatcher('foo'), 'function');
        });
        
        it('should return a function which matches on a glob pattern', function () {
            assert.equal(globMatcher.buildMatcher('foo/**/bar.*.js*')('foo/baz/quux/bar.spec.json-0'), true);
        });
        
    });
    
    describe('check', function () {
        
        it('should return true if input matches against glob pattern', function () {
            assert.equal(globMatcher.check('foo/**/bar.*.js', 'foo/bar.test.js-0'), true);
        });
        
        it('should return false if input does not match against glob pattern', function () {
            assert.equal(globMatcher.check('foo/**/bar.*.js', 'foo/bar.js-0'), false);
        });
        
    });
    
    describe('checkArray', function () {
        
        it('should return true if at least one of the elements in the array matches the pattern', function () {
            assert.equal(globMatcher.checkArray('foo.*', ['foo', 'bar', 'foo.bar']), true);
        });
        
        it('should return false if none of the elements in the array matches the pattern', function () {
            assert.equal(globMatcher.checkArray('foo.*.baz', ['foo', 'bar', 'foo.bar']), false);
        });
        
    });
    
    describe('checkGlobArray', function () {
        
        it('should return true if at least one of the glob patterns is a match for the value', function () {
            assert.equal(globMatcher.checkGlobArray(['foo', 'bar', 'baz.*', 'foo.*'], 'foo.bar'), true);
        });
        
        it('should return false if none of the glob patterns is a match for the value', function () {
            assert.equal(globMatcher.checkGlobArray(['quux', 'foobar', 'baz', 'foo.baz'], 'foo.bar'), false);
        });
        
    });
    
});