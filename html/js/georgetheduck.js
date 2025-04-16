import Menu from "./scenes/menu.js";
import Stage from "./scenes/stage.js";

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

game.scene.add("Menu", Menu);
game.scene.add("Stage", Stage);

game.scene.start("Menu");

// TODO
// Transitions between scenes
// Preload everything to make things smoother
// Options scene
// Integrate with smart contract
