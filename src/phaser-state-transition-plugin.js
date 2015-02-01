/**
  * StateTransition Plugin for Phaser
  */
(function (window, Phaser) {
  'use strict';

  Phaser.Plugin.StateTransition = function (game, parent) {
    Phaser.Plugin.call(this, game, parent);

    // Default transition settings
    this.settings = {
      duration: Phaser.Timer.SECOND * 0.3,
      ease: Phaser.Easing.Exponential.InOut,
      properties: {
        alpha: 0
      }
    };
  };

  Phaser.Plugin.StateTransition.prototype = Object.create(Phaser.Plugin.prototype);

  Phaser.Plugin.StateTransition.prototype.constructor = Phaser.Plugin.StateTransition;

  Phaser.Plugin.StateTransition.prototype.configure = function (options) {
    var property;

    if (options) {
      for (property in options) {
        if (this.settings[property]) {
          this.settings[property] = options[property];
        }
      }
    } else {
      return Object.create(this.settings);
    }
  };

  /**
    * Handles the state changes and transitions
    */
  Phaser.Plugin.StateTransition.prototype.to = function () {
    var state = arguments[0],
        _this = this,
        _preload,
        _create;

    if (!state) {
      throw 'No state passed.';
    }

    // In case last transition went wrong
    this._destroy();

    // Pause game to take world snapshot
    this.game.paused = true;

    // Create current state texture
    this._texture = new Phaser.RenderTexture(this.game, this.game.width, this.game.height, 'cover');

    // Draw the current world to the render
    this._texture.renderXY(this.game.world, -this.game.camera.x, -this.game.camera.y);

    // Save original implementation of state's preload and create methods
    _preload = this.game.state.states[state].preload;
    _create = this.game.state.states[state].create;

    if (_preload) {
      // Extend state preload method to add cover
      this.game.state.states[state].preload = function() {
        // Add the cover first to be able to show a preload image
        this.game.add.existing(_this._newCover());
        _preload.call(_this.game.state.states[state]);
      };
    }

    // Extend state create method to add and animate cover
    this.game.state.states[state].create = function() {
      if (_create) {
        _create.call(_this.game.state.states[state]);
      }
      // Add the cover last to hide the state while being created
      this.game.add.existing(_this._newCover());
      _this._animateCover();
    };

    this.game.state.start.apply(this.game.state, arguments);

    // Resume the game
    this.game.paused = false;
  };

  /**
    * Create previous state cover
    */
  Phaser.Plugin.StateTransition.prototype._newCover = function () {
    // Create current state cover sprite
    this._cover = new Phaser.Sprite(this.game, 0, 0, this._texture);
    this._cover.fixedToCamera = true;
    this._cover.anchor.set(0.5);
    // Instead of x/y we need to set the cameraOffset point
    this._cover.cameraOffset.x = this.game.width / 2;
    this._cover.cameraOffset.y = this.game.height / 2;
    return this._cover;
  };

  /**
    * Can be called in the create function of states that you transition to,
    * to ensure that the transition-sprite is on top of everything
    */
  Phaser.Plugin.StateTransition.prototype.bringToTop = function () {
    if (this._cover) {
      this._cover.bringToTop();
    }
  };

  Phaser.Plugin.StateTransition.prototype._animateCover = function () {
    var propertyValueObject, property, tween;

    for (property in this.settings.properties) {
      if (typeof this.settings.properties[property] === 'object') {
        // Create a tween for specific object property
        tween = this.game.add
          .tween(this._cover[property])
          .to(this.settings.properties[property],
            this.settings.duration,
            this.settings.ease, true);
      } else {
        // Create properties object for specific property value
        propertyValueObject = {};
        propertyValueObject[property] = this.settings.properties[property];
        tween = this.game.add
          .tween(this._cover)
          .to(propertyValueObject,
            this.settings.duration,
            this.settings.ease, true);
      }
    }
    // Since all tweens have the same duration we listen to the last one created
    tween.onComplete.addOnce(this._destroy, this);
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
