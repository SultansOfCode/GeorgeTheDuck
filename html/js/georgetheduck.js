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

new Phaser.Game(config);
