import Phaser from 'phaser';
import StartScreen from './scenes/StartScreen';
import FirstLevel from './scenes/FirstLevel';
import Interlude from './scenes/Interlude';
import GameOver from './scenes/GameOver';
import BossLevel from './scenes/BossLevel';
import YouWon from './scenes/YouWon';
import config from './config/config';

class Game extends Phaser.Game {
  constructor() {
    super(config);

    this.scene.add('startScreen', StartScreen);
    this.scene.add('firstLevel', FirstLevel);
    this.scene.add('gameOver', GameOver);
    this.scene.add('youWon', YouWon);
    this.scene.add('bossLevel', BossLevel);
    this.scene.add('interlude', Interlude);

    this.scene.start('startScreen');
  }
}

window.onload = function () {
  window.game = new Game();
};
