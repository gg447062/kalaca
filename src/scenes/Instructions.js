import Phaser from 'phaser';

export default class Instructions extends Phaser.Scene {
  constructor() {
    super('instructions');
  }

  create() {
    const music = this.sound.add('intro');
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
    const cameras = this.cameras;
    cameras.main.fadeIn(2000, 0, 0, 0);

    this.add.text(120, 100, 'controls', {
      fontSize: '34px',
      fontFamily: "'Press Start 2P', 'cursive'",
    });
    this.add.text(120, 220, 'arrows to move', {
      fontSize: '30px',
      fontFamily: "'Press Start 2P', 'cursive'",
    });
    this.add.text(120, 280, 'space to shoot', {
      fontSize: '30px',
      fontFamily: "'Press Start 2P', 'cursive'",
    });
    this.add.text(120, 430, 'enter to start', {
      fontSize: '30px',
      fontFamily: "'Press Start 2P', 'cursive'",
    });
    const scene = this.scene;
    const nextScene = 'firstScene';
    this.input.keyboard.on('keydown-ENTER', function () {
      cameras.main.fadeOut(2000, 0, 0, 0);
      cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        music.stop();
        scene.start(nextScene);
      });
    });
  }
}
