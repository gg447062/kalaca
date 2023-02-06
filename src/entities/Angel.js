import Phaser from 'phaser';

export default class Angel extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.body.allowGravity = false;
    // this.setCollideWorldBounds(true);
    // this.setBounce(1);
    this.rotation = 1.57;
    this.scene.add.existing(this);

    this.points = 100;
    this.lastFired = 0;
    this.fireDelay = 2500;
    this.health = 1;
    this.lastHit = 0;
    this.recovering = false;
    this.time;

    this.reset(x, y);
  }

  update(time, delta, shootWeapon, x, y) {
    this.time = time;
    if (this.x < -40 || this.y > 660) {
      this.setActive(false);
      this.setVisible(false);
    }
    if (
      time > this.lastFired &&
      this.active &&
      typeof shootWeapon === 'function'
    ) {
      shootWeapon(x, y);

      this.lastFired = time + this.fireDelay;
    }

    if (this.recovering && time > this.lastHit) {
      this.recovering = false;
    }
  }

  reset(x, y) {
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
    this.setPosition(x, y);
    this.health = 1;
    this.recovering = false;
  }

  takeDamage(damage) {
    this.health -= damage;
    this.recovering = true;
    this.lastHit = this.time + 1000;
  }
}
