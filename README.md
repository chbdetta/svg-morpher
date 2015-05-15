# svg-morpher
Morph a `<path>` into another one with smooth animation.
# Usage
Simple usage:
```
morph(pathA, pathB);
```
with custom options:
```
morph(pathA, pathB, {
  duration: 400, // animation duration in ms
  easing: 'easeIn', // easing function
  done: function() {console.log('done');} // a callback fn invoked when morphing is done
});
```
# Options
- **duration** animation duration in ms
- **easing**   custom easing function (`Function`)or provided easing name(`String`)
- **done**     a callback function that will be fired when the animation is done.

# Installation
pull down the repo. make sure you have node.js installed

run in command line

`npm install`

to install dependencies.

`gulp`

to build with gulp.

Now you can find the js file in `dist/morph.js`. Put it in your webpage using `<script>` and you can use `morph()` in your scripts.

# Example
see [exmaple](http://chbdetta.github.io/svg-morpher/)

