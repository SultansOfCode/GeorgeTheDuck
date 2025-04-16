import Globals from "../globals.js";

class Stage extends Phaser.Scene {
  static PLAYER_RUNNING = 0;
  static PLAYER_JUMPING = 1;
  static PLAYER_FALLING = 2;
  static PLAYER_LANDING = 3;
  static PLAYER_HITTED = 4;
  static PLAYER_DEAD = 5;

  platforms = null;
  clouds1 = null;
  clouds2 = null;
  clouds3 = null;
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

  playerStatus = null;
  score = 0;
  speed = 300;
  spawnPoints = 1000;
  spawnRate = 0.25;

  preload() {
    this.load.image("sky", "/img/sky.png");
    
    this.load.image("clouds", "/img/clouds.png");
  
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

    this.load.audio("bgm", "/snd/bgm.mp3");

    this.load.audio("jump", "/snd/jump.flac");

    this.load.audio("landing", "/snd/landing.mp3");

    this.load.audio("hit", "/snd/hit.mp3");
  }
  
  create() {
    this.bgMusic = this.sound.add("bgm");

    this.bgMusic.loop = true;

    this.bgMusic.play();

    this.jumpSound = this.sound.add("jump");

    this.landingSound = this.sound.add("landing");
    
    this.hitSound = this.sound.add("hit");

    this.add.image(400, 300, "sky");

    this.platforms = this.physics.add.staticGroup();

    this.ground = this.add.tileSprite(400, 584, 800, 32, "ground").setScale(2);

    this.platforms.add(this.ground);

    this.clouds3 = this.add.tileSprite(400, 200, 1600, 400, "clouds");
    this.clouds3.tilePositionX = Math.ceil(Math.random() * 1600);
    this.clouds3.tint = (105 << 16) + (105 << 8) + 105;

    this.clouds2 = this.add.tileSprite(400, 200, 1600, 400, "clouds").setScale(1.5);
    this.clouds2.tilePositionX = Math.ceil(Math.random() * 1600);
    this.clouds2.tint = (180 << 16) + (180 << 8) + 180;

    this.clouds1 = this.add.tileSprite(400, 200, 1600, 400, "clouds").setScale(2);
    this.clouds1.tilePositionX = Math.ceil(Math.random() * 1600);

    this.trees = this.physics.add.group();
  
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
      escape: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
    };

    this.text = this.add.text(10, 10, "SCORE: 0000000000", { fontSize: 24, });
  
    this.setPlayerStatus(Stage.PLAYER_FALLING);

    this.timer = this.time.addEvent({
      delay: 100,
      callback: this.timerTick,
      callbackScope: this,
      loop: true,
    });
  }

  update(_, deltaTime) {
    if (this.playerStatus === Stage.PLAYER_RUNNING) {
      if (this.inputs.jump.isDown && this.player.body.touching.down) {
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
    else if (this.playerStatus === Stage.PLAYER_DEAD) {
      if (this.inputs.escape.isDown) {
        console.log("TODO");
      }
    }

    if (this.playerStatus !== Stage.PLAYER_HITTED && this.playerStatus !== Stage.PLAYER_DEAD) {
      this.clouds1.tilePositionX += deltaTime * this.speed * 0.5 / 2000;
      this.clouds2.tilePositionX += deltaTime * this.speed * 0.5 / 4000;
      this.clouds3.tilePositionX += deltaTime * this.speed * 0.5 / 8000;

      this.ground.tilePositionX += deltaTime * this.speed * 0.5 / 1000;

      for (let i = this.trees.children.length - 1; i >= 0; --i) {
        const tree = this.trees.children[i];

        if (tree.body.position.x > -20 * tree.scale) {
          return;
        }

        this.trees.remove(tree, true);

        tree.destroy(true);
      }
    }
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
      this.trees.create(840, 504, "tree")
        .setScale(2)
        .setSize(12, 50, true)
        .setImmovable(true)
        .setVelocityX(-this.speed)
        .refreshBody()
        .body
          .allowGravity = false;
    }
  }

  setPlayerStatus(status) {
    this.playerStatus = status;
  
    if (status === Stage.PLAYER_RUNNING) {
      this.player
        .setSize(22, 18)
        .setOffset(18, 30)
        .anims
          .play("running");
    }
    else if (status === Stage.PLAYER_JUMPING) {
      this.player
        .setVelocityY(-500)
        .setSize(22, 18)
        .setOffset(21, 28)
        .once("animationcomplete", () => {
          if (this.playerStatus !== Stage.PLAYER_JUMPING) {
            return;
          }
  
          this.setPlayerStatus(Stage.PLAYER_FALLING);
        })
        .anims
          .play("jumping");

      this.jumpSound.play();
    }
    else if (status === Stage.PLAYER_FALLING) {
      this.player
        .setSize(22, 18)
        .setOffset(21, 28)
        .anims
          .play("falling");
    }
    else if (status === Stage.PLAYER_LANDING) {
      this.player
        .setSize(27, 8)
        .setOffset(17, 40)
        .once("animationcomplete", () => {
          if (this.playerStatus !== Stage.PLAYER_LANDING) {
            return;
          }
  
          this.setPlayerStatus(Stage.PLAYER_RUNNING);
        })
        .anims
          .play("landing");

      this.landingSound.play();
    }
    else if (status === Stage.PLAYER_HITTED) {
      this.player.anims.timeScale = 1;

      this.player
        .setSize(25, 22)
        .setOffset(21, 26)
        .anims
          .play("hitted");

      this.hitSound.play();
    }
    else if (status === Stage.PLAYER_DEAD) {
      this.player
        .setSize(27, 16)
        .setOffset(17,32)
        .setVelocityX(0)
        .setVelocityY(0)
        .anims
          .play("dead");

      this.add.text(220, 238, "GAME OVER", { color: "#ff0000", fontSize: 64, });
      this.add.text(233, 293, "Press ESC to return to menu", { color: "#ff0000", fontSize: 20, });
    }
  }

  hitTree() {
    if (this.playerStatus === Stage.PLAYER_HITTED || this.playerStatus === Stage.PLAYER_DEAD) {
      return;
    }

    this.timer.paused = true;
  
    this.trees.children.iterate(tree => tree.setVelocityX(0));
  
    this.player
      .setVelocityX(-50)
      .setVelocityY(-300);
  
    this.setPlayerStatus(Stage.PLAYER_HITTED);
  }
}

export default Stage;
