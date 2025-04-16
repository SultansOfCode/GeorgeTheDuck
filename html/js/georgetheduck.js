import Stage from "./scenes/stage.js";
import Globals from "./globals.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 900,
      },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);

game.scene.add("Stage", Stage);

game.scene.start("Stage");
