import Phaser from 'phaser';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.body.allowGravity = false;
    this.scene.add.existing(this);
    this.speed = Phaser.Math.GetSpeed(800, 1);
    this.lifespan = 1000;

    this.reset(x, y);
  }

  update(time, delta) {
    this.lifespan -= delta;

    this.x += this.speed * delta;

    if (this.lifespan <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

  reset(x, y) {
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
    this.lifespan = 1000;
    this.setPosition(x, y);
  }
}
