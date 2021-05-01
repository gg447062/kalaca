import Phaser from 'phaser';

const formatScore = (score) => `Score: ${score}`;

export default class ScoreLabel extends Phaser.GameObjects.Text {
  constructor(scene, x, y, score, style) {
    super(scene, x, y, formatScore(score), style);

    this.scene = scene;
    this.scene.add.existing(this);
    this.score = score;
  }

  add(points) {
    this.score = this.score + points;
    this.setText(formatScore(this.score));
  }
}
