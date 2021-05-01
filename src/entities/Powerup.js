import Phaser from 'phaser';

export default class Powerup extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.body.allowGravity = false;
    this.scene.add.existing(this);

    this.reset(x, y);
  }

  update() {
    if (this.x < -20) {
      this.setVisible(false);
      this.setActive(false);
    }
  }

  reset(x, y) {
    this.setVisible(true);
    this.setActive(true);
    this.setPosition(x, y);
  }
}
