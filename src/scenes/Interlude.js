import Phaser from 'phaser';
import Skull from '../entities/Skull';

export default class Interlude extends Phaser.Scene {
  constructor() {
    super('interlude');
  }

  create() {
    const camera = this.cameras.main;
    camera.fadeIn(2000, 0, 0, 0);

    const level = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    const map = this.make.tilemap({
      data: level,
      tileWidth: 800,
      tileHeight: 600,
    });
    const tiles = map.addTilesetImage('space');
    map.createLayer(0, tiles, 0, 0);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.skull = new Skull(this, 50, 300, 'skull')
      .setCollideWorldBounds(false)
      .play('skull_anim');
    this.skull.flipOn = true;
    this.skull.on('animationcomplete', () => {
      this.skull.play('skull_anim');
    });
    camera.startFollow(this.skull);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  update(time) {
    this.skull.update(time, this.cursors);
  }
}
