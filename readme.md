Glob Matcher
============

A pattern matching library using glob-style patterns.  This is intended to allow for post-collection file
lists which need to be filtered inline.

## Methods

- buildMatcher - glob:String => value:String => Boolean
- check - glob:String, value:String => Boolean
- checkArray - glob:String, values:Array[String] => Boolean
- checkGlobArray - globs:Array[String], value:String => Boolean
- globToPattern - glob:String => RegExp