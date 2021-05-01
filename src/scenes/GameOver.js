import Phaser from 'phaser';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('game-over');
  }

  init(data) {
    this.accuracy = data.accuracy;
  }

  create() {
    const music = this.sound.add('dead');
    const musicConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    };
    music.play(musicConfig);
    if (isNaN(this.accuracy)) {
      this.accuracy = 0;
    }
    // this.add.text(220, 230, `accuracy: ${this.accuracy}%`, {
    //   fontSize: '30px',
    //   fontFamily: "'Press Start 2P', 'cursive'",
    // });
    this.add.text(220, 180, 'you died :(', {
      fontSize: '30px',
      fontFamily: "'Press Start 2P', 'cursive'",
    });
    const scene = this.scene;
    this.add.text(60, 320, 'press enter to restart!', {
      fontSize: '30px',
      fontFamily: "'Press Start 2P', 'cursive'",
    });
    this.input.keyboard.on('keydown-ENTER', function () {
      music.stop();
      scene.start('firstLevel');
    });
  }
}
