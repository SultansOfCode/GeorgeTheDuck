"use strict";

import Menu from "./scenes/menu.js";
import Options from "./scenes/options.js";
import PreLoader from "./scenes/preloader.js";
import Stage from "./scenes/stage.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [PreLoader, Menu, Options, Stage],
};

const gamePlaceholder = document.getElementById("game-placeholder");

gamePlaceholder.addEventListener("click", () => {
  gamePlaceholder.remove();

  new Phaser.Game(config);
}, { once: true });
