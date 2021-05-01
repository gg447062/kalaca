import Phaser from 'phaser';

export default class Skull extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.body.allowGravity = false;
    this.hits = 0;
    this.active = false;
  }

  update(skull) {
    if (this.active) {
      this.x = skull.x + 3;
      this.y = skull.y;
    }
  }
}
