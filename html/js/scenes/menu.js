"use strict";

class Menu extends Phaser.Scene {
  static MENU_PLAY = 0;
  static MENU_OPTIONS = 1;

  arrows = null;

  choice = 0;

  constructor(config) {
    super({
      ...config,
      key: "Menu",
    });
  }

  setChoice(choice) {
    this.choice = (choice + 2) % 2;

    this.arrows
      .setText(`->${"".padStart(5 + 3 * this.choice, " ")}<-`)
      .setPosition(400, 274 + 52 * this.choice);
  }

  create() {
    this.add.image(400, 300, "menuBackground")
      .alpha = 0.5;

    if (this.sound.isPlaying() === false) {
      const bgMusic = this.sound.add("menuBgm");

      bgMusic.loop = true;

      bgMusic
        .setVolume(0.10)
        .play();
    }

    this.inputs = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      enter: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
    };

    this.add.text(400, 274, "PLAY", { fontFamily: "PressStart2P", fontSize: 36, }).setOrigin(0.5);
    this.add.text(400, 326, "OPTIONS", { fontFamily: "PressStart2P", fontSize: 36, }).setOrigin(0.5);

    this.arrows = this.add.text(400, 274, "", { fontFamily: "PressStart2P", fontSize: 36, }).setOrigin(0.5);

    this.setChoice(this.choice);

    this.cameras.main.fadeIn(500);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.inputs.up) === true) {
      this.setChoice(this.choice - 1);
    }
    else if (Phaser.Input.Keyboard.JustDown(this.inputs.down) === true) {
      this.setChoice(this.choice + 1);
    }

    if (Phaser.Input.Keyboard.JustDown(this.inputs.enter) === true) {
      this.inputs.enter.enabled = false;

      this.cameras.main
        .fadeOut(500)
        .once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
          if (this.choice === Menu.MENU_PLAY) {
            this.sound.stopAll();

            this.scene
              .stop()
              .start("Stage");
          }
          else if (this.choice === Menu.MENU_OPTIONS) {
            this.scene
              .stop()
              .start("Options");
          }
        });
    }
  }
}

export default Menu;
