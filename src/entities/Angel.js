import Phaser from 'phaser';

export default class Angel extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.body.allowGravity = false;
    this.setCollideWorldBounds(true);
    this.setBounce(1);
    this.scene.add.existing(this);

    this.points = 100;

    this.reset(x, y);
  }

  update() {
    if (this.x < -20) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

  reset(x, y) {
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
    this.setPosition(x, y);
  }
}
