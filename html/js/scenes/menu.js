class Menu extends Phaser.Scene {
  arrows = null;
  bgMusic = null;

  choice = 0;

  preload() {
    this.load.audio("menuBgm", "/snd/menu.mp3");

    this.load.image("menuBackground", "/img/bg.png");
  }

  create() {
    this.add.image(400, 300, "menuBackground")
      .alpha = 0.5;

    this.bgMusic = this.sound.add("menuBgm");

    this.bgMusic.loop = true;

    this.bgMusic
      .setVolume(0.10)
      .play();

    this.inputs = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      enter: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
    };

    this.add.text(320, 230, "PLAY", { fontSize: 64, });

    this.add.text(260, 294, "OPTIONS", { fontSize: 64, });

    this.arrows = this.add.text(220, 230, "->     <-", { fontSize: 64, });
  }

  setChoice(choice) {
    this.choice = (choice + 2) % 2;

    this.arrows
      .setText(this.choice === 0 ? "->     <-" : "->        <-")
      .setPosition(163 + 57 * (1 - this.choice), 230 + 64 * this.choice);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.inputs.up)) {
      this.setChoice(this.choice - 1);
    }
    else if (Phaser.Input.Keyboard.JustDown(this.inputs.down)) {
      this.setChoice(this.choice + 1);
    }

    if (Phaser.Input.Keyboard.JustDown(this.inputs.enter)) {
      if (this.choice === 0) {
        this.bgMusic.destroy();

        this.scene.start("Stage");
      }
    }
  }
}

export default Menu;
