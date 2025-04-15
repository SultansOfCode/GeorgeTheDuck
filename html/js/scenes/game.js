import Globals from "../globals.js";

class Game extends Phaser.Scene {
  static PLAYER_RUNNING = 0;
  static PLAYER_JUMPING = 1;
  static PLAYER_FALLING = 2;
  static PLAYER_LANDING = 3;
  static PLAYER_HITTED = 4;
  static PLAYER_DEAD = 5;

  platforms = null;
  trees = null;
  player = null;
  inputs = null;

  playerStatus = null;

  preload() {
    this.load.image("sky", "/img/sky.png");
  
    this.load.image(
      "ground",
      `/img/ground/${Globals.selectedScenario}.png`
    );
  
    this.load.image(
      "tree",
      `/img/tree/${Globals.selectedScenario}.png`
    );
  
    this.load.spritesheet(
      "george",
      `/img/george/${Globals.selectedGeorge}.png`,
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );
  }
  
  create() {
    this.add.image(400, 300, "sky");
  
    this.platforms = this.physics.add.staticGroup();
  
    this.platforms.create(400, 584, "ground")
      .setScale(2)
      .setImmovable(true)
      .refreshBody();
  
    this.trees = this.physics.add.group();
  
    this.trees.create(800, 504, "tree")
      .setScale(2)
      .setSize(12, 50, true)
      .setImmovable(true)
      .setVelocityX(-200)
      .refreshBody()
      .body
        .allowGravity = false;
  
    this.player = this.physics.add.sprite(150, 450, "george")
      .setScale(2)
      .setBounce(0.2)
      .setCollideWorldBounds(true)
      .refreshBody();
  
    this.physics.add.collider(this.player, this.platforms);

    this.physics.add.overlap(this.player, this.trees, this.hitTree, null, this);
  
    this.anims.create({
      key: "running",
      frames: this.anims.generateFrameNumbers("george", { start: 4, end: 7, }),
      frameRate: 16,
      repeat: -1,
    });
  
    this.anims.create({
      key: "jumping",
      frames: this.anims.generateFrameNumbers("george", { start: 8, end: 11, }),
      frameRate: 10,
      repeat: 0,
    });
  
    this.anims.create({
      key: "falling",
      frames: this.anims.generateFrameNumbers("george", { start: 12, end: 12, }),
      frameRate: 10,
      repeat: 0,
    });
  
    this.anims.create({
      key: "landing",
      frames: this.anims.generateFrameNumbers("george", { start: 13, end: 14, }),
      frameRate: 10,
      repeat: 0,
    });
  
    this.anims.create({
      key: "hitted",
      frames: this.anims.generateFrameNumbers("george", { start: 21, end: 22, }),
      frameRate: 10,
      repeat: -1,
    });
  
    this.anims.create({
      key: "dead",
      frames: this.anims.generateFrameNumbers("george", { start: 23, end: 23, }),
      frameRate: 10,
      repeat: 0,
    });
  
    this.inputs = {
      jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };
  
    this.setPlayerStatus(Game.PLAYER_FALLING);
  }

  update() {
    if (this.playerStatus === Game.PLAYER_RUNNING) {
      if (this.inputs.jump.isDown && this.player.body.touching.down) {
        this.setPlayerStatus(Game.PLAYER_JUMPING);
      }
    }
    else if (this.playerStatus === Game.PLAYER_FALLING) {
      if (this.player.body.touching.down) {
        this.setPlayerStatus(Game.PLAYER_LANDING);
      }
    }
    else if (this.playerStatus === Game.PLAYER_HITTED) {
      if (this.player.body.touching.down && this.player.body.velocity.y > -5) {
        this.setPlayerStatus(Game.PLAYER_DEAD);
      }
    }
  }

  setPlayerStatus(status) {
    this.playerStatus = status;
  
    if (status === Game.PLAYER_RUNNING) {
      this.player
        .setSize(22, 18)
        .setOffset(18, 30)
        .anims
          .play("running");
    }
    else if (status === Game.PLAYER_JUMPING) {
      this.player
        .setVelocityY(-500)
        .setSize(22, 18)
        .setOffset(21, 28)
        .once("animationcomplete", () => {
          if (this.playerStatus !== Game.PLAYER_JUMPING) {
            return;
          }
  
          this.setPlayerStatus(Game.PLAYER_FALLING);
        })
        .anims
          .play("jumping");
    }
    else if (status === Game.PLAYER_FALLING) {
      this.player
        .setSize(22, 18)
        .setOffset(21, 28)
        .anims
          .play("falling");
    }
    else if (status === Game.PLAYER_LANDING) {
      this.player
        .setSize(27, 8)
        .setOffset(17, 40)
        .once("animationcomplete", () => {
          if (this.playerStatus !== Game.PLAYER_LANDING) {
            return;
          }
  
          this.setPlayerStatus(Game.PLAYER_RUNNING);
        })
        .anims
          .play("landing");
    }
    else if (status === Game.PLAYER_HITTED) {
      this.player
        .setSize(25, 22)
        .setOffset(21, 26)
        .anims
          .play("hitted");
    }
    else if (status === Game.PLAYER_DEAD) {
      this.player
        .setSize(27, 16)
        .setOffset(17,32)
        .setVelocityX(0)
        .setVelocityY(0)
        .anims
          .play("dead");
    }
  }

  hitTree() {
    if (this.playerStatus === Game.PLAYER_HITTED || this.playerStatus === Game.PLAYER_DEAD) {
      return;
    }
  
    this.trees.children.iterate(tree => tree.setVelocityX(0));
  
    this.player
      .setVelocityX(-50)
      .setVelocityY(-300);
  
    this.setPlayerStatus(Game.PLAYER_HITTED);
  }
}

export default Game;
