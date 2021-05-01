import Phaser from 'phaser';
import HealthLabel from '../entities/HealthLabel';

export default class BossLevel extends Phaser.Scene {
  constructor() {
    super('boss-level');
  }

  init(data) {
    this.score = data.score;
    this.shotsFired = data.shotsFired;
    this.enemiesHit = data.enemiesHit;
    this.playerAttack = 10;
    this.playerSpeed = 300;
    this.weaponType = 'tri-blast';
    this.shieldActive = false;
    this.shieldHits = 0;
    this.isDead = false;
    this.bossHealth = 300;
    this.fireRate = 800;
    this.won = false;
  }

  create() {
    this.music = this.sound.add('bossBattle');
    const musicConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    };
    this.music.play(musicConfig);
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.background = this.add.tileSprite(0, 0, 800, 600, 'space');
    this.background.setOrigin(0, 0);
    this.triBlast = this.sound.add('tri-blast');
    this.die = this.sound.add('exp_kalaka');
    this.bossDie = this.sound.add('dios_se_muere');
    this.shield_grab = this.sound.add('shield_grab');

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.skull = this.createShip();
    this.skull.on('animationcomplete', () => {
      this.skull.play('skull_anim');
    });

    this.boss = this.createBoss();
    this.boss.on('animationcomplete', () => {
      this.boss.play('boss_anim');
    });

    this.projectiles = this.add.group();

    this.enemyProjectiles = this.add.group();

    this.powerups = this.add.group();

    this.enemies = this.add.group();

    this.shield = this.createShield();

    this.healthLabel = this.createHealthLabel(16, 16, this.bossHealth);

    this.physics.add.collider(
      this.skull,
      this.enemyProjectiles,
      this.destroyPlayer,
      null,
      this
    );

    this.physics.add.overlap(
      this.powerups,
      this.skull,
      this.addPowerup,
      null,
      this
    );

    this.physics.add.collider(
      this.shield,
      this.enemyProjectiles,
      this.hitShield,
      null,
      this
    );

    this.physics.add.collider(
      this.shield,
      this.enemies,
      this.hitShield,
      null,
      this
    );

    this.physics.add.collider(
      this.projectiles,
      this.boss,
      this.hitBoss,
      null,
      this
    );

    this.time.addEvent({
      delay: this.fireRate,
      callback: this.bossFire,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    const accuracy = ((this.enemiesHit / this.shotsFired) * 100).toFixed(2);
    if (this.isDead) {
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.music.stop();
          this.scene.start('game-over', { accuracy });
        },
        callbackScope: this,
        loop: false,
      });
    } else if (this.won) {
      this.time.addEvent({
        delay: 10000,
        callback: () => {
          this.physics.pause;
          this.bossDie.stop();
          this.music.stop();
          this.scene.start('you-won', { accuracy });
        },
        callbackScope: this,
        loop: false,
      });
    }

    this.background.tilePositionX += 1.5;
    this.moveShip();
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.shootWeapon();
    }
    this.destroyOffscreen(this.projectiles);
    this.destroyOffscreen(this.enemyProjectiles);
    if (this.shield.active) {
      this.manageShield();
    }
  }

  createShip() {
    const skull = this.physics.add.sprite(50, 300, 'skull');
    skull.play('skull_anim');
    skull.setCollideWorldBounds(true);
    return skull;
  }

  createBoss() {
    const boss = this.physics.add.sprite(750, 300, 'boss');
    boss.play('boss_anim');
    boss.setCollideWorldBounds(true);
    boss.setImmovable(true);
    boss.setVelocityY(200);
    boss.setBounceY(1);
    return boss;
  }

  moveShip() {
    if (this.cursors.up.isDown) {
      this.skull.setVelocityY(-this.playerSpeed);
    } else if (this.cursors.down.isDown) {
      this.skull.setVelocityY(this.playerSpeed);
    } else if (this.cursors.right.isDown) {
      this.skull.setVelocityX(this.playerSpeed);
    } else if (this.cursors.left.isDown) {
      this.skull.setVelocityX(-this.playerSpeed);
    } else {
      this.skull.setVelocityY(0);
      this.skull.setVelocityX(0);
    }
  }

  shootWeapon() {
    if (this.skull.active) {
      this.skull.play('skull_fire_anim');
      this.triBlast.play();
      let initAngle = -100;
      for (let i = 0; i < 3; i++) {
        const bullet = this.physics.add.sprite(
          this.skull.x + 35,
          this.skull.y - 10,
          this.weaponType
        );
        bullet.play(`blast_anim`);
        bullet.setVelocityX(400);
        bullet.setVelocityY(initAngle);
        this.projectiles.add(bullet);
        initAngle += 100;
        this.shotsFired++;
      }
    }
  }

  destroyPlayer(skull, enemy) {
    if (!this.isDead) {
      this.die.play();
      const explosion = this.physics.add.sprite(skull.x, skull.y, 'explosion1');
      explosion.play('explode');
      explosion.setScale(2);

      enemy.destroy();

      skull.disableBody(true, true);

      this.isDead = true;
    }
  }

  createShield() {
    const shield = this.physics.add.sprite(
      this.skull.x + 3,
      this.skull.y,
      'shield-sprite'
    );
    shield.setScale(1.25);
    shield.play('shield_sprite_anim');
    shield.disableBody(true, true);
    return shield;
  }

  manageShield() {
    this.shield.x = this.skull.x + 3;
    this.shield.y = this.skull.y;
  }

  releasePowerup(powerupKey) {
    const randomY = Phaser.Math.Between(32, 568);
    const powerup = this.physics.add.sprite(800, randomY, powerupKey);
    powerup.name = powerupKey;
    powerup.setScale(0.75);
    powerup.play(`${powerupKey}_anim`);
    powerup.setVelocityX(-300);
    this.powerups.add(powerup);
  }

  addPowerup(powerup, skull) {
    powerup.destroy();
    if (powerup.name === 'powerup2') {
      this.playerAttack += 10;
      this.time.addEvent({
        delay: 5000,
        callback: () => {
          this.playerAttack = 10;
        },
        callbackScope: this,
        loop: false,
      });
    } else if (powerup.name === 'shield') {
      this.shield_grab.play();
      if (!this.shieldActive) {
        this.shieldActive = true;
        this.shield.enableBody(true, skull.x, skull.y, true, true);
      } else {
        this.shieldHits = 0;
      }
    }
    skull.play('skull_laugh_anim');
  }

  hitShield(shield, object) {
    object.destroy();
    const explosion = this.physics.add.sprite(
      object.x - 20,
      object.y,
      'explosion2'
    );
    explosion.play('explode2');
    if (this.shieldHits < 2) {
      this.shieldHits++;
    } else {
      this.shieldHits = 0;
      this.time.addEvent({
        delay: 500,
        callback: () => {
          shield.disableBody(true, true);
        },
        callbackScope: this,
        loop: false,
      });
      this.shieldActive = false;
    }
  }

  hitBoss(bullet) {
    if (this.bossHealth <= 0) {
      const explosion = this.physics.add.sprite(
        this.boss.x - 10,
        this.boss.y,
        'explosion3'
      );
      explosion.play('explode4');
      this.bossDie.play();
      this.boss.destroy();
      this.won = true;
    } else {
      this.boss.play('boss_hit_anim');
      bullet.destroy();
      this.bossHealth -= this.playerAttack;
      this.healthLabel.subtract(this.playerAttack);
      this.checkHealth();
    }
  }

  bossFire() {
    if (this.boss.active) {
      const rayo = this.physics.add.sprite(this.boss.x, this.boss.y, 'rayo');
      rayo.setVelocityX(-400);
      rayo.play('rayo_anim');
      this.enemyProjectiles.add(rayo);
    }
  }

  checkHealth() {
    if (!(this.bossHealth % 75)) {
      this.releasePowerup('shield');
    } else if (this.bossHealth === 100) {
      this.releasePowerup('powerup2');
    }
  }

  destroyOffscreen(objects) {
    objects.getChildren().forEach((child) => {
      if (child.x > 810 || child.x < -10) {
        child.destroy();
      }
    });
  }

  createHealthLabel(x, y, score) {
    const style = { fontFamily: "'Press Start 2P', 'cursive'" };
    const label = new HealthLabel(this, x, y, score, style);

    this.add.existing(label);
    return label;
  }
}
