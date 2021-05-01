import Phaser from 'phaser';

export default class YouWon extends Phaser.Scene {
  constructor() {
    super('you-won');
  }

  init(data) {
    this.accuracy = data.accuracy;
  }

  create() {
    const music = this.sound.add('ending');
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

    this.add.text(220, 230, 'you won! :)', {
      fontSize: '30px',
      fontFamily: "'Press Start 2P', 'cursive'",
    });

    // this.add.text(220, 270, `accuracy: ${this.accuracy}%`, {
    //   fontSize: '30px',
    //   fontFamily: "'Press Start 2P', 'cursive'",
    // });

    const scene = this.scene;
    this.add.text(180, 320, 'press enter to\nplay again!!', {
      fontSize: '30px',
      fontFamily: "'Press Start 2P', 'cursive'",
    });
    this.input.keyboard.on('keydown-ENTER', function () {
      music.stop();
      scene.start('firstLevel');
    });
  }
}
