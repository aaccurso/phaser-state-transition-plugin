'use strict';

describe('test', function(){
  var canvas = document.createElement('canvas'),
      game = new Phaser.Game(800, 600, Phaser.AUTO, canvas),
      transition;

  game.state.add('boot', function(game) {
    this.game = game;
    this.create = function() {
      transition = game.plugins.add(Phaser.Plugin.StateTransition);
      // this.game.state.start('StateA');
    };
  }, true);
  game.state.add('StateA', function(game) {
    this.game = game;
    this.create = function() {
      // TODO
    };
  });
  game.state.add('StateB', function(game) {
    this.game = game;
    this.create = function() {
      // TODO
    };
  });

  beforeEach(function() {
    game.state.start('boot');
  });

  it('Phaser.Plugin.StateTransition should be defined', function() {
    expect(Phaser.Plugin.StateTransition).toBeDefined();
  });

  it('Transition to StateA', function() {
    expect(Object.keys(game.state.states)).toEqual(['boot', 'StateA', 'StateB']);
    expect(game.state.current).toBe('boot');
    transition.to('StateA');
    expect(game.state.current).toBe('StateA');
  });
});
