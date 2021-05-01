import Phaser from 'phaser';

export default class Explosion extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.body.allowGravity = false;
    this.scene.add.existing(this);

    this.lifespan = 1000;
  }
  update(time, delta) {
    this.lifespan -= delta;

    if (this.lifespan <= 0) {
      this.destroy();
    }
  }
}
