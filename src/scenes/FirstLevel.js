import Phaser from 'phaser';
import ScoreLabel from '../entities/ScoreLabel';
import Skull from '../entities/Skull';
import Bullet from '../entities/Bullet';
import Asteroid from '../entities/Asteroid';
import Angel from '../entities/Angel';
import Shield from '../entities/Shield';
import Powerup from '../entities/Powerup';
import AngelBullet from '../entities/AngelBullet';
import Explosion from '../entities/Explosion';

export default class FirstLevelFg extends Phaser.Scene {
  constructor() {
    super('firstLevel');
  }

  init() {
    this.score = 0;
    this.shotsFired = 0;
    this.enemiesHit = 0;
    this.weaponType = 'laser';
    this.soundIndex = 0;
    this.asteroidDelay = 3750;
    this.spawnNumber = 2;
    this.fireRate = 1500;

    this.isDead = false;
    this.nextLevel = false;

    this.shootWeapon = this.shootWeapon.bind(this);
    this.destroyAsteroid = this.destroyAsteroid.bind(this);
    this.destroyAngel = this.destroyAngel.bind(this);
    this.checkLevelOver = this.checkLevelOver.bind(this);
    this.angelFire = this.angelFire.bind(this);
  }

  create() {
    this.music = this.sound.add('overworld');
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
    this.cameras.main.fadeIn(2000, 0, 0, 0);
    this.background = this.add
      .tileSprite(0, 0, 800, 600, 'space')
      .setOrigin(0, 0);

    this.laser = this.sound.add('laser');
    this.blast = this.sound.add('blast');
    this.triBlast = this.sound.add('tri-blast');
    this.soundArray = [this.laser, this.blast, this.triBlast];

    this.shield_grab = this.sound.add('shield_grab');
    this.powerup1_grab = this.sound.add('powerup1');
    this.powerup3_grab = this.sound.add('awebo');
    this.die = this.sound.add('exp_kalaka');
    this.angelDestroy = this.sound.add('angel_die');
    this.aleluya = this.sound.add('aleluya');
    this.asteroidDestroy = this.sound.add('asteroid');

    this.cursors = this.input.keyboard.createCursorKeys();

    this.skull = new Skull(this, 50, 300, 'skull');
    this.skull.play('skull_anim');
    this.skull.on('animationcomplete', () => {
      this.skull.play('skull_anim');
    });

    this.shield = new Shield(
      this,
      this.skull.x + 3,
      this.skull.y,
      'shield-sprite'
    )
      .setScale(1.25)
      .play('shield_sprite_anim')
      .disableBody(true, true);

    this.asteroids = this.add.group({
      classType: Asteroid,
      runChildUpdate: true,
      allowGravity: false,
      maxSize: 30,
    });

    this.angels = this.add.group({
      classType: Angel,
      runChildUpdate: true,
      allowGravity: false,
      maxSize: 15,
    });

    this.projectiles = this.add.group({
      classType: Bullet,
      runChildUpdate: true,
      allowGravity: false,
      maxSize: 30,
    });

    this.angelProjectiles = this.add.group({
      classType: AngelBullet,
      runChildUpdate: true,
      allowGravity: false,
      maxSize: 30,
    });

    this.powerups = this.add.group({
      classType: Powerup,
      runChildUpdate: true,
      allowGravity: false,
      maxSize: 10,
    });

    this.explosions = this.add.group({
      classType: Explosion,
      runChildUpdate: true,
      allowGravity: false,
      maxSize: 20,
    });

    const style = { fontFamily: "'Press Start 2P', 'cursive'" };
    this.scoreLabel = new ScoreLabel(this, 16, 16, this.score, style);

    // ---------------------- COLLIDERS ------------------------------

    this.physics.add.collider(
      this.skull,
      this.asteroids,
      this.destroyPlayer,
      null,
      this
    );

    this.physics.add.collider(
      this.skull,
      this.angelProjectiles,
      this.destroyPlayer,
      null,
      this
    );

    this.physics.add.collider(
      this.skull,
      this.angels,
      this.destroyPlayer,
      null,
      this
    );

    this.physics.add.collider(
      this.shield,
      this.angelProjectiles,
      this.hitShield,
      null,
      this
    );

    this.physics.add.collider(
      this.shield,
      this.asteroids,
      this.hitShield,
      null,
      this
    );

    this.physics.add.collider(
      this.shield,
      this.angels,
      this.hitShield,
      null,
      this
    );

    this.physics.add.collider(
      this.projectiles,
      this.asteroids,
      this.destroyAsteroid,
      null,
      this
    );

    this.physics.add.collider(
      this.projectiles,
      this.angels,
      this.destroyAngel,
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

    // ---------------------- TIME EVENTS -----------------------------

    this.time.addEvent({
      delay: this.asteroidDelay,
      callback: this.launchAsteroids,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: this.fireRate,
      callback: this.angelFire,
      callbackScope: this,
      loop: true,
    });
  }

  // eslint-disable-next-line no-unused-vars
  update(time, delta) {
    this.checkLevelOver();
    this.skull.update(time, this.cursors, this.shootWeapon);
    this.shield.update(this.skull);
    this.background.tilePositionX += 1.5;
  }

  // -------------------------- CREATION --------------------------

  shootWeapon() {
    if (this.skull.active) {
      const bulletX = this.skull.x + 35;
      const bulletY = this.skull.y - 10;
      if (this.weaponType === 'tri-blast') {
        this.soundArray[this.soundIndex].play();
        let initAngle = -100;
        for (let i = 0; i < 3; i++) {
          let bullet = this.projectiles.getFirstDead();
          if (!bullet) {
            bullet = new Bullet(this, bulletX, bulletY, this.weaponType);
            this.projectiles.add(bullet);
          }
          bullet.reset(bulletX, bulletY);
          bullet.play(`${this.weaponType}_anim`);
          bullet.setVelocityY(initAngle);
          initAngle += 100;
          this.shotsFired++;
        }
      } else {
        let bullet = this.projectiles.getFirstDead();

        if (!bullet) {
          bullet = new Bullet(this, bulletX, bulletY, this.weaponType);
          this.projectiles.add(bullet);
        }
        bullet.reset(bulletX, bulletY);
        bullet.play(`${this.weaponType}_anim`);
        bullet.body.immovable = true;
        this.soundArray[this.soundIndex].play();
        this.shotsFired++;
      }
    }
  }

  angelFire() {
    this.angels.getChildren().forEach((angel) => {
      let star = this.angelProjectiles.getFirstDead();

      if (!star) {
        star = new AngelBullet(this, angel.x, angel.y, 'star');
        this.angelProjectiles.add(star);
      }

      star.update(angel.x, angel.y);
    });
  }

  launchAsteroids() {
    if (!this.nextLevel) {
      for (let i = 0; i < this.spawnNumber; i++) {
        const randomScale = Phaser.Math.Between(1.5, 2);
        const randomStep = Phaser.Math.Between(-250, 250);
        const randomSpeed = Phaser.Math.Between(200, 500);
        const initY = 300;

        let asteroid = this.asteroids.getFirstDead();

        if (!asteroid) {
          asteroid = new Asteroid(this, 800, initY + randomStep, 'asteroid1');
          this.asteroids.add(asteroid);
        }
        asteroid.setVelocityX(-randomSpeed);
        asteroid.reset(800, initY + randomStep);
        asteroid.setScale(randomScale);
        asteroid.body.immovable = true;
      }
    }
  }

  angelSpawn() {
    if (!this.nextLevel) {
      let angel = this.angels.getFirstDead();

      if (!angel) {
        angel = new Angel(this, 800, 300, 'angel').setScale(1.25);

        this.angels.add(angel);
      }
      angel.reset(800, 300);
      angel.play('angel_anim');
      angel.setVelocityX(-100);
      angel.setVelocityY(150);
    }
  }

  releasePowerup(powerupKey) {
    const randomY = Phaser.Math.Between(32, 568);
    let powerup = this.powerups.getFirstDead();

    if (!powerup) {
      powerup = new Powerup(this, 800, randomY, powerupKey)
        .setScale(0.75)
        .play(`${powerupKey}_anim`)
        .setVelocityX(-300);
      this.powerups.add(powerup);
    }

    powerup.name = powerupKey;
    powerup.reset(800, randomY);
  }

  addPowerup(powerup, skull) {
    this.killEntity(this.powerups, powerup);
    if (powerup.name === 'powerup1') {
      this.powerup1_grab.play();
      this.weaponType = 'blast';
      this.soundIndex++;
    } else if (powerup.name === 'powerup2') {
      this.powerup3_grab.play();
      this.weaponType = 'tri-blast';
      this.soundIndex++;
    } else if (powerup.name === 'shield') {
      if (!this.shield.active) {
        this.shield.active = true;
        this.shield.enableBody(true, skull.x, skull.y, true, true);
        this.shield_grab.play();
      } else {
        this.shield.hits = 0;
      }
    }
    skull.play('skull_laugh_anim');
  }

  createExplosion(x, y, spriteKey) {
    let explosion = new Explosion(this, x, y, spriteKey);
    this.explosions.add(explosion);
    return explosion;
  }
  // ---------------- DESTRUCTION ---------------------------

  destroyPlayer(skull, enemy) {
    if (!this.isDead) {
      this.die.play();
      this.createExplosion(skull.x, skull.y, 'explosion1')
        .setScale(2)
        .play('explode');

      enemy.destroy();
      skull.disableBody(true, true);
      this.isDead = true;
    }
  }

  destroyAsteroid(laser, asteroid) {
    this.killEntity(this.projectiles, laser);
    this.killEntity(this.asteroids, asteroid);
    this.asteroidDestroy.play();
    this.createExplosion(asteroid.x - 20, asteroid.y, 'asteroid_explosion')
      .setScale(1.25)
      .play('asteroid_explode');

    this.updateScore(asteroid);
  }

  destroyAngel(laser, angel) {
    this.killEntity(this.projectiles, laser);
    this.killEntity(this.angels, angel);
    this.angelDestroy.play();
    this.createExplosion(angel.x - 10, angel.y, 'angel_explosion').play(
      'angel_explode'
    );

    this.updateScore(angel);
  }

  hitShield(shield, object) {
    object.destroy();
    this.createExplosion(object.x - 20, object.y, 'explosion2').play(
      'explode2'
    );
    if (shield.hits < 2) {
      shield.hits++;
    } else {
      shield.hits = 0;
      this.time.addEvent({
        delay: 500,
        callback: () => {
          shield.disableBody(true, true);
        },
        callbackScope: this,
        loop: false,
      });
      shield.active = false;
    }
  }

  killEntity(group, entity) {
    group.killAndHide(entity);
    entity.body.enable = false;
  }

  // ------------------ HOUSEKEEPING --------------------------

  checkScore() {
    if (this.score && !(this.score % 250)) {
      this.spawnNumber++;
      this.asteroidSpeed += 50;
      this.maxDelay -= 500;
    }
    if (this.score === 500) {
      this.releasePowerup('powerup1');
    } else if (!(this.score % 500)) {
      this.releasePowerup('shield');
    } else if (this.score === 1500) {
      this.releasePowerup('powerup2');
    } else if (this.score > 1000 && !(this.score % 200)) {
      this.angelSpawn();
    }
  }

  updateScore(entity) {
    this.enemiesHit++;
    this.scoreLabel.add(entity.points);
    this.score += entity.points;
    this.checkScore();
  }

  checkLevelOver() {
    if (this.isDead) {
      const accuracy = ((this.enemiesHit / this.shotsFired) * 100).toFixed(2);
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.music.stop();
          this.scene.start('game-over', { accuracy });
        },
        callbackScope: this,
        loop: false,
      });
    } else if (this.score >= 2500) {
      this.nextLevel = true;
      this.time.addEvent({
        delay: 2000,
        callback: () => {
          this.music.stop();
          this.physics.pause();
          this.scene.start('boss-level', {
            score: this.score,
            shotsFired: this.shotsFired,
            enemiesHit: this.enemiesHit,
          });
        },
        callbackScope: this,
        loop: false,
      });
    }
  }
}
