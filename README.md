# gulp-group

[![Build Status][travis-shield]][travis]
[![Coverage Status][coveralls-shield]][coveralls]
[![Dependency Status][dependencies-shield]][dependencies]
[![devDependency Status][dependencies-dev-shield]][dependencies-dev]

[![Develop Status][travis-shield-develop]][travis]
[![Develop Coverage Status][coveralls-shield-develop]][coveralls]

Grouping tasks for gulp.


## Installation

[![gulp-group on NPM](https://nodei.co/npm/gulp-group.png?small=true)][npm]

## Usage

Require gulp-group and pass in gulp and optional config object.
```javascript
// in your gulpfile.js

//instead of
var gulp = require('gulp');
// do
var gulp = require('gulp-group')(require('gulp'));
```

## Example

 You can group tasks using `gulp.group()`.
```javascript
var gulp = require('gulp-group')(require('gulp'));

gulp.group('docs', function() {

  gulp.group('build', function() {

    gulp.group('dry-run', function() {
      gulp.task('apib', function() {});
      gulp.task('html', ['./apib'], function() {});
    });

    gulp.task('apib', function() {});
    gulp.task('html', ['./apib'], function() {});
  });

  gulp.group('watch', function() {
    gulp.task('apib', ['../build/dry-run/apib'], function() {});
    gulp.task('html', ['../build/dry-run/html'], function() {});
  });

});

gulp.task('help', function() {});
gulp.group('empty', function() {});
```

You can now run
```bash
$ gulp docs/build/dry-run
[16:15:24] Using gulpfile /path/to/gulpfile.js
[16:15:24] Starting 'docs/build/dry-run/apib'...
[16:15:24] Finished 'docs/build/dry-run/apib' after 114 μs
[16:15:24] Starting 'docs/build/dry-run/html'...
[16:15:24] Finished 'docs/build/dry-run/html' after 27 μs
[16:15:24] Starting 'docs/build/dry-run'...
[16:15:24] Finished 'docs/build/dry-run' after 6.96 μs
```


By default, tasks will be defined as if they were entries in a directory structure.
However, you can change these by providing a config object.

```javascript
var gulp = require('gulp-group')(require('gulp'), {separator: ':', current: '~', parent: '^'});

gulp.group('docs', function() {

  gulp.group('build', function() {

    gulp.group('dry-run', function() {
      gulp.task('apib', function() {});
      gulp.task('html', ['~apib'], function() {});
    });

    gulp.task('apib', function() {});
    gulp.task('html', ['~apib'], function() {});
  });

  gulp.group('watch', function() {
    gulp.task('apib', ['^build:dry-run:apib'], function() {});
    gulp.task('html', ['^build:dry-run:html'], function() {});
  });

});

gulp.task('help', function() {});
gulp.group('empty', function() {});
```
```bash
$ gulp docs:build:dry-run
[16:15:24] Using gulpfile /path/to/gulpfile.js
[16:15:24] Starting 'docs:build:dry-run:apib'...
[16:15:24] Finished 'docs:build:dry-run:apib' after 114 μs
[16:15:24] Starting 'docs:build:dry-run:html'...
[16:15:24] Finished 'docs:build:dry-run:html' after 27 μs
[16:15:24] Starting 'docs:build:dry-run'...
[16:15:24] Finished 'docs:build:dry-run' after 6.96 μs
```

## License
[MIT](/LICENSE)


[npm]:                     https://www.npmjs.com/package/gulp-group
[travis]:                  https://travis-ci.org/call-a3/gulp-group
[travis-shield]:           https://img.shields.io/travis/call-a3/gulp-group.svg
[travis-shield-develop]:   https://img.shields.io/travis/call-a3/gulp-group/develop.svg?label=develop%20build
[coveralls]:               https://coveralls.io/r/call-a3/gulp-group
[coveralls-shield]:        https://img.shields.io/coveralls/call-a3/gulp-group.svg
[coveralls-shield-develop]:https://img.shields.io/coveralls/call-a3/gulp-group/develop.svg?label=develop%20coverage
[dependencies]:            https://david-dm.org/call-a3/gulp-group
[dependencies-dev]:        https://david-dm.org/call-a3/gulp-group#info=devDependencies
[dependencies-shield]:     https://img.shields.io/david/call-a3/gulp-group.svg
[dependencies-dev-shield]: https://img.shields.io/david/dev/call-a3/gulp-group.svg
