/**
  * StateTransition Plugin for Phaser
  */
(function (window, Phaser) {
  'use strict';

  /* Default settings object */
  var settings = {
    duration: Phaser.Timer.SECOND * 0.3,
    ease: Phaser.Easing.Exponential.InOut,
    properties: {
      alpha: 0
    }
  };

  Phaser.Plugin.StateTransition = function (game, parent) {
    Phaser.Plugin.call(this, game, parent);
  };

  Phaser.Plugin.StateTransition.prototype = Object.create(Phaser.Plugin.prototype);

  Phaser.Plugin.StateTransition.prototype.constructor = Phaser.Plugin.StateTransition;

  Phaser.Plugin.StateTransition.prototype.settings = function (options) {
    if (options) {
      for (var property in options) {
        if (settings[property]) {
          settings[property] = options[property];
        }
      }
    } else {
      return Object.create(settings);
    }
  };

  /**
    * Handles the state changes and transitions
    */
  Phaser.Plugin.StateTransition.prototype.to = function () {
    var state = arguments[0];

    /* Pause the game at first */
    this.game.paused = true;

    /* If there's a sprite there, destroy it */
    if (this._cover) {
      this._cover.destroy();
    }

    /* Create current state texture */
    this._texture = new Phaser.RenderTexture(this.game, this.game.width, this.game.height, 'cover');

    /* Draw the current world to the render */
    this._texture.renderXY(this.game.world, -this.game.camera.x, -this.game.camera.y);

    /* If there's a state as a paramterer change the state and do the dew */
    if (state) {
      var _create = this.game.state.states[state].create, _this = this;

      this._cover = new Phaser.Sprite(this.game, 0, 0, this._texture);
      this._cover.fixedToCamera = true;
      this._cover.anchor.setTo(0.5,0.5);

      /* Instead of x/y we need to set the cameraOffset point */
      this._cover.cameraOffset.x = this.game.width / 2;
      this._cover.cameraOffset.y = this.game.height / 2;

      this.game.state.states[state].create = function() {
        _create.call(_this.game.state.states[state]);

        _this.game.add.existing(_this._cover);

        _this._animateCover();
      };

      this.game.state.start.apply(this.game.state, arguments);
    }

    /* Resume the game */
    this.game.paused = false;
  };

  /**
    * Can be called in the create function of states that you transition to, to ensure
    * that the transition-sprite is on top of everything
    */
  Phaser.Plugin.StateTransition.prototype.bringToTop = function () {
    if (this._cover) {
      this._cover.bringToTop();
    }
  };

  Phaser.Plugin.StateTransition.prototype._animateCover = function () {
    if (settings && settings.properties) {
      for (var property in settings.properties) {
        if (typeof settings.properties[property] !== 'object') {
          var _dummy = {};
          _dummy[property] = settings.properties[property];
          this._tween = this.game.add
            .tween(this._cover)
            .to(_dummy,
              settings.duration,
              settings.ease, true);
        } else {
          this._tween = this.game.add
            .tween(this._cover[property])
            .to(settings.properties[property],
              settings.duration,
              settings.ease, true);
        }
      }

      this._tween.onComplete.addOnce(this._destroy, this);
    }
  };

  Phaser.Plugin.StateTransition.prototype._destroy = function () {
    if (this._cover) {
      this._cover.destroy();
    }
    if (this._texture) {
      this._texture.destroy();
    }
  };

}(window, Phaser));
