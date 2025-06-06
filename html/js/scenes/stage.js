"use strict";

import Globals from "../globals.js";

class Stage extends Phaser.Scene {
  static PLAYER_RUNNING = 0;
  static PLAYER_JUMPING = 1;
  static PLAYER_FALLING = 2;
  static PLAYER_LANDING = 3;
  static PLAYER_HITTED = 4;
  static PLAYER_DEAD = 5;

  platforms = null;
  clouds = null;
  ground = null;
  trees = null;
  player = null;
  inputs = null;
  text = null;
  timer = null;
  bgMusic = null;
  jumpSound = null;
  landingSound = null;
  hitSound = null;
  bgOverlay = null;

  playerStatus = null;
  score = null;
  speed = null;
  spawnPoints = null;
  spawnRate = null;

  isClicking = false;

  constructor(config) {
    super({
      ...config,
      key: "Stage",
      physics: {
        default: "arcade",
        arcade: {
          gravity: {
            y: 900,
          },
          debug: Globals.DEBUG,
        },
      },
    });
  }

  hitTree() {
    if (this.isPlayerDead()) {
      return;
    }

    this.timer.paused = true;

    this.trees.children.iterate(tree => {
      tree
        .setVelocityX(0)
        .body.enable = false;
    });

    this.player
      .setVelocityX(-50)
      .setVelocityY(-300);

    this.setPlayerStatus(Stage.PLAYER_HITTED);
  }

  isPlayerDead() {
    return this.playerStatus === Stage.PLAYER_HITTED || this.playerStatus === Stage.PLAYER_DEAD;
  }

  setPlayerStatus(status) {
    this.playerStatus = status;

    this.player.off("animationcomplete");

    if (status === Stage.PLAYER_RUNNING) {
      this.player
        .setCircle(10, 20, 28)
        .anims
          .play(`${Globals.SELECTED_GEORGE}Running`);
    }
    else if (status === Stage.PLAYER_JUMPING) {
      this.player
        .setVelocityY(-500)
        .setCircle(10, 22, 27)
        .once("animationcomplete", () => {
          this.setPlayerStatus(Stage.PLAYER_FALLING);
        })
        .anims
          .play(`${Globals.SELECTED_GEORGE}Jumping`);

      this.jumpSound.play();
    }
    else if (status === Stage.PLAYER_FALLING) {
      this.player
        .setCircle(11, 20, 26)
        .anims
          .play(`${Globals.SELECTED_GEORGE}Falling`);
    }
    else if (status === Stage.PLAYER_LANDING) {
      this.player
        .setSize(27, 8)
        .setOffset(17, 40)
        .once("animationcomplete", () => {
          this.setPlayerStatus(Stage.PLAYER_RUNNING);
        })
        .anims
          .play(`${Globals.SELECTED_GEORGE}Landing`);

      this.landingSound.play();
    }
    else if (status === Stage.PLAYER_HITTED) {
      this.player.anims.timeScale = 1;

      this.player
        .setCircle(10, 22, 26)
        .anims
          .play(`${Globals.SELECTED_GEORGE}Hitted`);

      this.hitSound.play();
    }
    else if (status === Stage.PLAYER_DEAD) {
      this.player
        .setSize(27, 16)
        .setOffset(17, 32)
        .setVelocityX(0)
        .setVelocityY(0)
        .anims
          .play(`${Globals.SELECTED_GEORGE}Dead`);

      // this.physics.pause();

      this.add.text(400, 276, "GAME OVER", { color: "#ff0000", fontFamily: "PressStart2P", fontSize: 48, })
        .setOrigin(0.5);

      this.add.text(400, 308, "Press ESC to return to menu", { color: "#ff0000", fontFamily: "PressStart2P", fontSize: 16, })
        .setOrigin(0.5);
    }
  }

  spawnTree() {
    this.trees.create(840, 536, `${Globals.SELECTED_SCENARIO}Tree`)
      .setScale(Math.random() * 1.5 + 1)
      .setSize(12, 50, true)
      .setOrigin(0.5, 1)
      .setImmovable(true)
      .setVelocityX(-this.speed)
      .refreshBody()
      .body
        .allowGravity = false;
  }

  timerTick() {
    this.score += 100;

    this.text.setText(`SCORE: ${this.score.toString().padStart(10, "0")}`);

    if (this.score % 10000 === 0) {
      this.speed += 100;
      this.spawnPoints += 100;
      this.spawnRate += 0.05;

      this.player.anims.timeScale += 0.25;

      this.trees.children.iterate(tree => tree.setVelocityX(-this.speed));
    }

    if (this.score % this.spawnPoints === 0 && Math.random() < this.spawnRate) {
      this.spawnTree();
    }

    if (this.score % Globals.DAY_PHASE_DURATION === 0) {
      const phase = Math.trunc(this.score / Globals.DAY_PHASE_DURATION) % 4;

      const tweenConfig = {
        from: 0,
        to: 1,
        duration: Globals.DAY_PHASE_TWEEN_DURATION,
        ease: Phaser.Math.Easing.Sine.InOut,
        repeat: 0,
      };

      if (phase === 0) {
        this.tweens.addCounter({
          ...tweenConfig,

          onUpdate: tween => {
            const value = tween.getValue();

            this.bgOverlay.setAlpha(0.6 * (1 - value));
          }
        });
      }
      else if (phase === 1) {
        this.bgOverlay
          .setFillStyle(0xff0000)
          .setAlpha(0);

        this.tweens.addCounter({
          ...tweenConfig,

          onUpdate: tween => {
            const value = tween.getValue();

            this.bgOverlay.setAlpha(0.6 * value);
          }
        });
      }
      else if (phase === 2) {
        const colorFrom = Phaser.Display.Color.ValueToColor(0xff0000);
        const colorTo = Phaser.Display.Color.ValueToColor(0x000000);

        this.tweens.addCounter({
          ...tweenConfig,

          onUpdate: tween => {
            const value = tween.getValue();
            const tint = Phaser.Display.Color.Interpolate.ColorWithColor(colorFrom, colorTo, 1, value);
            const color = Phaser.Display.Color.ObjectToColor(tint).color;

            this.bgOverlay.setFillStyle(color);
          }
        });
      }
      else if (phase === 3) {
        const colorFrom = Phaser.Display.Color.ValueToColor(0x000000);
        const colorTo = Phaser.Display.Color.ValueToColor(0x000040);

        this.tweens.addCounter({
          ...tweenConfig,

          onUpdate: tween => {
            const value = tween.getValue();
            const tint = Phaser.Display.Color.Interpolate.ColorWithColor(colorFrom, colorTo, 1, value);
            const color = Phaser.Display.Color.ObjectToColor(tint).color;

            this.bgOverlay.setFillStyle(color).setAlpha(0.2 * value + 0.6);
          }
        });
      }
    }
  }

  create() {
    this.bgMusic = this.sound.add("stageBgm");
    this.bgMusic.loop = true;
    this.bgMusic.play();

    this.jumpSound = this.sound.add("stageJump");
    this.landingSound = this.sound.add("stageLanding");
    this.hitSound = this.sound.add("stageHit");

    this.add.image(400, 300, "stageSky");

    this.bgOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000).setAlpha(0);

    this.platforms = this.physics.add.staticGroup();

    this.ground = this.add.tileSprite(400, 600, 800, 32, `${Globals.SELECTED_SCENARIO}Ground`)
      .setScale(2)
      .setOrigin(0.5, 1);

    this.platforms.add(this.ground);

    this.clouds = [];

    for (let i = 0; i < 3; ++i) {
      const colorBase = 105 + 75 * i;
      const color = colorBase * 256 * 256 + colorBase * 256 + colorBase;
      const clouds = this.add.tileSprite(400, 200, 1600, 400, "stageClouds")
        .setScale(0.5 * i + 1)
        .setTint(color);

      clouds.tilePositionX = Math.ceil(Math.random() * 1600);

      this.clouds.push(clouds);
    }

    this.trees = this.physics.add.group();

    this.player = this.physics.add.sprite(150, 450, `${Globals.SELECTED_GEORGE}George`)
      .setScale(2)
      .setBounce(0.2)
      .setDepth(1)
      .setCollideWorldBounds(true)
      .refreshBody();

    this.physics.add.collider(this.player, this.platforms);

    this.physics.add.overlap(this.player, this.trees, this.hitTree, null, this);

    this.inputs = {
      jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      escape: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
    };

    this.text = this.add.text(10, 10, "SCORE: 0000000000", { fontFamily: "PressStart2P", fontSize: 20, });

    this.setPlayerStatus(Stage.PLAYER_FALLING);

    this.score = 0;
    this.speed = 300;
    this.spawnPoints = 1000;
    this.spawnRate = 0.25;

    this.timer = this.time.addEvent({
      delay: 100,
      callback: this.timerTick,
      callbackScope: this,
      loop: true,
    });

    this.isClicking = false;

    this.cameras.main.fadeIn(500);
  }

  update(_, deltaTime) {
    let clicked = false;
    let swipeDirection = null;

    if (this.input.activePointer.isDown === false && this.isClicking === true) {
      if (Math.abs(this.input.activePointer.upX - this.input.activePointer.downX) >= 50) {
        if (this.input.activePointer.upX < this.input.activePointer.downX) {
          swipeDirection = Globals.SWIPE_LEFT;
        }
        else {
          swipeDirection = Globals.SWIPE_RIGHT;
        }
      }
      else {
        clicked = true;
      }

      this.isClicking = false;
    }
    else if (this.input.activePointer.isDown === true && this.isClicking === false) {
      this.isClicking = true;
    }

    if (this.playerStatus === Stage.PLAYER_RUNNING) {
      if ((this.inputs.jump.isDown === true || this.input.activePointer.isDown === true) && this.player.body.touching.down === true) {
        this.setPlayerStatus(Stage.PLAYER_JUMPING);
      }
    }
    else if (this.playerStatus === Stage.PLAYER_FALLING) {
      if (this.player.body.touching.down) {
        this.setPlayerStatus(Stage.PLAYER_LANDING);
      }
    }
    else if (this.playerStatus === Stage.PLAYER_HITTED) {
      if (this.player.body.touching.down && this.player.body.velocity.y > -5) {
        this.setPlayerStatus(Stage.PLAYER_DEAD);
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.inputs.escape) === true || swipeDirection === Globals.SWIPE_LEFT || (this.playerStatus === Stage.PLAYER_DEAD && this.input.activePointer.isDown === true)) {
      this.inputs.escape.enabled = false;

      this.cameras.main
        .fadeOut(500)
        .once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
          this.sound.stopAll();

          this.scene
            .stop()
            .start("Menu");
        });
    }

    if (this.isPlayerDead() === false) {
      for (let i = 0; i < this.clouds.length; ++i) {
        this.clouds[i].tilePositionX += deltaTime * this.speed * 0.5 * Math.pow(2, i) / 8000;
      }

      this.ground.tilePositionX += deltaTime * this.speed * 0.5 / 1000;

      for (let i = this.trees.children.length - 1; i >= 0; --i) {
        const tree = this.trees.children[i];

        if (tree.body.position.x > -20 * tree.scale) {
          return;
        }

        this.trees.remove(tree);

        tree.destroy();
      }
    }
  }
}

export default Stage;
