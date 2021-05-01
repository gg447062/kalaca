import Phaser from 'phaser';

const formatHealth = (health) => `Boss Health: ${health}`;

export default class HealthLabel extends Phaser.GameObjects.Text {
  constructor(scene, x, y, health, style) {
    super(scene, x, y, formatHealth(health), style);

    this.health = health;
  }

  subtract(points) {
    this.health = this.health - points;
    this.setText(formatHealth(this.health));
  }
}
