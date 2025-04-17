"use strict";

import Menu from "./scenes/menu.js";
import Options from "./scenes/options.js";
import PreLoader from "./scenes/preloader.js";
import Stage from "./scenes/stage.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "container",
  scene: [PreLoader, Menu, Options, Stage],
};

const gamePlaceholder = document.getElementById("game-placeholder");

gamePlaceholder.addEventListener("click", () => {
  gamePlaceholder.remove();

  new Phaser.Game(config);

  if (window.innerWidth < 800 || window.innerHeight < 600) {
    const canvas = document.querySelector("canvas");
    const ar = window.innerHeight > window.innerWidth ? window.innerWidth / canvas.width : window.innerHeight / canvas.height;

    canvas.style.scale = ar;
  }
}, { once: true });
