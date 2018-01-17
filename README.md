# DEPRECATED!

Use original [phaser-state-transition](https://github.com/cristianbote/phaser-state-transition) plugin, which is up-to-date with the latest version of Phaser.js.

# phaser-state-transition-plugin

> State transition plugin for Phaser.js

## Disclaimer

This plugin is based on [@cristianbote](https://github.com/cristianbote)'s [phaser-state-transition](https://github.com/cristianbote/phaser-state-transition) so lots of thanks to him.

He's been inactive for quite a long time now, so I've taken the liberty to create a new repository with some custom modifications from the original plugin (plus code refactor).

Contributions are most welcome!

## Installation

### Bower

To install this plugin via bower:
```
bower install phaser-state-transition-plugin --save
```
Add it to your index.html (after phaser.js):
```html
<script src="phaser.js"></script>
<!---->
<script src="phaser-state-transition-plugin.min.js"></script>
```

## Usage

[Demo](http://aaccurso.github.io/phaser-state-transition-plugin/demo/)!!

Initialize it (if you have a boot state that's where you want to do it):
```js
this.game.stateTransition = this.game.plugins.add(Phaser.Plugin.StateTransition);
```

Configure global transition tweening properties:
```js
this.game.stateTransition.configure({
  duration: Phaser.Timer.SECOND * 0.8,
  ease: Phaser.Easing.Exponential.InOut,
  properties: {
    alpha: 0,
    scale: {
      x: 1.4,
      y: 1.4
    }
  }
});
```
> In a later release we want to support tween configuration per transition.

Use it:
```js
this.game.stateTransition.to('state2');
```
or if you need to pass more arguments like in the original State.start method:
```js
// to(key, clearWorld, clearCache, parameter)
this.game.stateTransition.to('state2', true, false, {levelId: 2});
```

and put this in your state2.js to be avoid calling update() before create()
```js
var state2 = function(game) {
   Phaser.State.call();
}

state2.prototype = Object.create(Phaser.State);
state2.prototype.constructor = state2;

state2.prototype = {
  init: function() {
    this.READY = false;
  },
  
  preload: function() {
    // ...
  },
   
  create: function() {
    // ...
    this.READY = true;
  },
   
  update: function() {
    if (this.READY) {
      // ...
    }
  }
}
```

> This isn't supported in the original plugin, and it was the main reason we decided to refactor it.

## Happy transitioning
Made with <3
