const duckeeColors = [
  "aqua", "blue", "green", "orange",
  "purple", "red", "tan", "yellow"
];

const scenarioColors = [
  "desert", "forest", "snow"
];

const PLAYER_RUNNING = 0;
const PLAYER_JUMPING = 1;
const PLAYER_FALLING = 2;
const PLAYER_LANDING = 3;
const PLAYER_HITTED = 4;
const PLAYER_DEAD = 5;

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 900, },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  }
};

const game = new Phaser.Game(config);

let platforms = null;
let trees = null;
let player = null;
let inputs = null;

let playerStatus = PLAYER_FALLING;

const selectedDuckee = "yellow";
const selectedScenario = "desert";

function preload() {
  this.load.image("sky", "/img/sky.png");

  this.load.image(
    "ground",
    `/img/ground/${selectedScenario}.png`
  );

  this.load.image(
    "tree",
    `/img/tree/${selectedScenario}.png`
  );

  this.load.spritesheet(
    "duckee",
    `/img/duckee/${selectedDuckee}.png`,
    {
      frameWidth: 64,
      frameHeight: 64,
    }
  );
}

function create() {
  this.add.image(400, 300, "sky");

  platforms = this.physics.add.staticGroup();

  platforms.create(400, 584, "ground")
    .setScale(2)
    .setImmovable(true)
    .refreshBody();

  trees = this.physics.add.group();

  trees.create(800, 504, "tree")
    .setScale(2)
    .setSize(12, 50, true)
    .setImmovable(true)
    .setVelocityX(-200)
    .refreshBody()
    .body
      .allowGravity = false;

  player = this.physics.add.sprite(150, 450, "duckee")
    .setScale(2)
    .setBounce(0.2)
    .setCollideWorldBounds(true)
    .refreshBody();

  this.physics.add.collider(player, platforms);
  this.physics.add.overlap(player, trees, hitTree, null, this);

  this.anims.create({
    key: "running",
    frames: this.anims.generateFrameNumbers("duckee", { start: 4, end: 7 }),
    frameRate: 16,
    repeat: -1,
  });

  this.anims.create({
    key: "jumping",
    frames: this.anims.generateFrameNumbers("duckee", { start: 8, end: 11 }),
    frameRate: 10,
    repeat: 0,
  });

  this.anims.create({
    key: "falling",
    frames: this.anims.generateFrameNumbers("duckee", { start: 12, end: 12 }),
    frameRate: 10,
    repeat: 0,
  });

  this.anims.create({
    key: "landing",
    frames: this.anims.generateFrameNumbers("duckee", { start: 13, end: 14 }),
    frameRate: 10,
    repeat: 0,
  });

  this.anims.create({
    key: "hitted",
    frames: this.anims.generateFrameNumbers("duckee", { start: 21, end: 22 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "dead",
    frames: this.anims.generateFrameNumbers("duckee", { start: 23, end: 23 }),
    frameRate: 10,
    repeat: 0,
  });

  inputs = {
    jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
  };

  setPlayerStatus(PLAYER_FALLING);
}

function hitTree() {
  if (playerStatus === PLAYER_HITTED || playerStatus === PLAYER_DEAD) {
    return;
  }

  trees.children.iterate(tree => tree.setVelocityX(0));

  player
    .setVelocityX(-50)
    .setVelocityY(-300);

  setPlayerStatus(PLAYER_HITTED);
}

function setPlayerStatus(status) {
  playerStatus = status;

  if (status === PLAYER_RUNNING) {
    player
      .setSize(22, 18)
      .setOffset(18, 30)
      .anims
        .play("running");
  }
  else if (status === PLAYER_JUMPING) {
    player
      .setVelocityY(-500)
      .setSize(22, 18)
      .setOffset(21, 28)
      .once("animationcomplete", () => {
        if (playerStatus !== PLAYER_JUMPING) {
          return;
        }

        setPlayerStatus(PLAYER_FALLING);
      })
      .anims
        .play("jumping");
  }
  else if (status === PLAYER_FALLING) {
    player
      .setSize(22, 18)
      .setOffset(21, 28)
      .anims
        .play("falling");
  }
  else if (status === PLAYER_LANDING) {
    player
      .setSize(27, 8)
      .setOffset(17, 40)
      .once("animationcomplete", () => {
        if (playerStatus !== PLAYER_LANDING) {
          return;
        }

        setPlayerStatus(PLAYER_RUNNING);
      })
      .anims
        .play("landing");
  }
  else if (status === PLAYER_HITTED) {
    player
      .setSize(25, 22)
      .setOffset(21, 26)
      .anims
        .play("hitted");
  }
  else if (status === PLAYER_DEAD) {
    player
      .setSize(27, 16)
      .setOffset(17,32)
      .setVelocityX(0)
      .setVelocityY(0)
      .anims
        .play("dead");
  }
}

function update() {
  if (playerStatus === PLAYER_RUNNING) {
    if (inputs.jump.isDown && player.body.touching.down) {
      setPlayerStatus(PLAYER_JUMPING);
    }
  }
  else if (playerStatus === PLAYER_FALLING) {
    if (player.body.touching.down) {
      setPlayerStatus(PLAYER_LANDING);
    }
  }
  else if (playerStatus === PLAYER_HITTED) {
    if (player.body.touching.down && player.body.velocity.y > -5) {
      setPlayerStatus(PLAYER_DEAD);
    }
  }
}
