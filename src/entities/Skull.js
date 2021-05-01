import Phaser from 'phaser';

export default class Skull extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.body.allowGravity = false;
    this.setCollideWorldBounds(true);
    this.scene.add.existing(this);

    this.flipOn = false;
    this.speed = 300;
    this.fireDelay = 200;
    this.lastFired = 0;
  }

  update(time, cursors, fireWeapon) {
    this.moveSkull(cursors);
    if (
      cursors.space.isDown &&
      cursors.space.getDuration() < 500 &&
      time > this.lastFired
    ) {
      fireWeapon();
      this.play('skull_fire_anim');
      this.lastFired = time + this.fireDelay;
    }
  }

  moveSkull(cursors) {
    if (cursors.up.isDown) {
      this.setVelocityY(-this.speed);
    } else if (cursors.down.isDown) {
      this.setVelocityY(this.speed);
    } else if (cursors.right.isDown) {
      this.setVelocityX(this.speed);
      if (this.flipOn) {
        this.flipX = false;
      }
    } else if (cursors.left.isDown) {
      this.setVelocityX(-this.speed);
      if (this.flipOn) {
        this.flipX = true;
      }
    } else {
      this.setVelocityY(0);
      this.setVelocityX(0);
    }
  }
}
