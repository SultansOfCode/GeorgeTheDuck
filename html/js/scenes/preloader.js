"use strict";

import Globals from "../globals.js";

class PreLoader extends Phaser.Scene {
  constructor(config) {
    super({
      ...config,
      key: "PreLoader",
    });
  }

  preload() {
    this.load.audio("menuBgm", "/snd/menu.mp3");
    this.load.audio("stageBgm", "/snd/bgm.mp3");
    this.load.audio("stageHit", "/snd/hit.mp3");
    this.load.audio("stageJump", "/snd/jump.flac");
    this.load.audio("stageLanding", "/snd/landing.mp3");

    this.load.image("menuBackground", "/img/bg.png");
    this.load.image("menuCheck", "/img/check.png");
    this.load.image("menuMoney", "/img/money.png");
    this.load.image("stageClouds", "/img/clouds.png");
    this.load.image("stageSky", "/img/sky.png");

    for (const scenarioColor of Globals.scenarioColors) {
      this.load.image(
        `${scenarioColor}Ground`,
        `/img/ground/${scenarioColor}.png`
      );

      this.load.image(
        `${scenarioColor}Tree`,
        `/img/tree/${scenarioColor}.png`
      );
    }

    for (const georgeColor of Globals.georgeColors) {
      this.load.spritesheet(
        `${georgeColor}George`,
        `/img/george/${georgeColor}.png`,
        {
          frameWidth: 64,
          frameHeight: 64,
        }
      );
    }
  }

  create() {
    for (const georgeColor of Globals.georgeColors) {
      this.anims.create({
        key: `${georgeColor}Running`,
        frames: this.anims.generateFrameNumbers(`${georgeColor}George`, { frames: [4, 5, 6, 7], }),
        frameRate: 16,
        repeat: -1,
      });

      this.anims.create({
        key: `${georgeColor}Jumping`,
        frames: this.anims.generateFrameNumbers(`${georgeColor}George`, { frames: [8, 9, 10, 11], }),
        frameRate: 10,
        repeat: 0,
      });

      this.anims.create({
        key: `${georgeColor}Falling`,
        frames: this.anims.generateFrameNumbers(`${georgeColor}George`, { frames: [12], }),
        frameRate: 10,
        repeat: 0,
      });

      this.anims.create({
        key: `${georgeColor}Landing`,
        frames: this.anims.generateFrameNumbers(`${georgeColor}George`, { frames: [13, 14], }),
        frameRate: 10,
        repeat: 0,
      });

      this.anims.create({
        key: `${georgeColor}Hitted`,
        frames: this.anims.generateFrameNumbers(`${georgeColor}George`, { frames: [21, 22], }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: `${georgeColor}Dead`,
        frames: this.anims.generateFrameNumbers(`${georgeColor}George`, { frames: [23], }),
        frameRate: 10,
        repeat: 0,
      });

      this.add.text(400, 300, "Click to start", { fontFamily: "PressStart2P", fontSize: 36, }).setOrigin(0.5);
    }

    this.input.once("pointerdown", () => {
      this.scene.start("Menu");
    });
  }
}

export default PreLoader;
