"use strict";

import Globals from "../globals.js";

class Options extends Phaser.Scene {
  inputs = null;
  selectionRectangle = null;
  positions = null;
  rectangles = null;
  moneys = null;
  checks = null;
  prices = null;
  blockchainMessage = null;

  choice = 0;

  provider = null;
  signer = null;
  contract = null;
  contractWithSigner = null;
  georgePrice = null;
  scenarioPrice = null;

  blockchainInitialized = false;

  isClicking = false;

  constructor(config) {
    super({
      ...config,
      key: "Options",
    });
  }

  async buyItem(index) {
    if (this.blockchainInitialized === false) {
      return false;
    }

    const price = index < 8 ? this.georgePrice : this.scenarioPrice;
    const tx = await this.contractWithSigner.buyItem(index, { value: price });

    await tx.wait();

    return true;
  }

  async initializeBlockchain() {
    debugger;
    if (window.ethereum === void 0 || window.ethereum === null) {
      return false;
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();

    const accounts = await this.provider.send('eth_requestAccounts');

    if(accounts === void 0 || accounts === null || accounts.length === 0) {
      return false;
    }

    this.contract = new ethers.Contract(Globals.CONTRACT_ADDRESS, Globals.CONTRACT_ABI, this.provider);
    this.contractWithSigner = this.contract.connect(this.signer);

    this.contract.on("ItemBought", async (address, index) => {
      if (address !== this.signer.address) {
        return;
      }

      Globals.PERMISSIONS = Number(await this.contractWithSigner.getPermissions().catch(() => 0)) | Globals.DEFAULT_PERMISSIONS;

      this.updatePermissions();

      index = Number(index);

      if (index < 8) {
        this.selectGeorge(index);
      }
      else {
        this.selectScenario(index - 8);
      }
    });

    this.georgePrice = await this.contract.getGeorgePrice().catch(() => null);
    this.scenarioPrice = await this.contract.getScenarioPrice().catch(() => null);

    if (this.georgePrice === null || this.scenarioPrice === null) {
      return false;
    }

    for (let i = 0; i < 11; ++i) {
      const price = i < 8 ? this.georgePrice : this.scenarioPrice;

      this.prices[i].setText(`${ethers.formatEther(price.toString())} ETH`);
    }

    const permissions = await this.contractWithSigner.getPermissions().catch(() => null);

    if (permissions === null) {
      return false;
    }

    Globals.PERMISSIONS = Number(permissions) | Globals.DEFAULT_PERMISSIONS;

    return true;
  }

  ownGeorge(index) {
    return (Globals.PERMISSIONS & (1 << index)) !== 0;
  }

  ownScenario(index) {
    index += 8;

    return (Globals.PERMISSIONS & (1 << index)) !== 0;
  }

  selectGeorge(index) {
    if (this.ownGeorge(index) === true) {
      Globals.SELECTED_GEORGE = Globals.GEORGE_COLORS[index];

      for (let i = 0; i < 8; ++i) {
        const thickness = i === index ? 2 : 0;
        const color = i === index ? 0xff0000 : 0x000000;
        const alpha = i === index ? 1 : 0;

        this.rectangles[i].setStrokeStyle(thickness, color, alpha);
      }
    }
    else {
      this.buyItem(index);
    }
  }

  selectScenario(index) {
    if (this.ownScenario(index) === true) {
      Globals.SELECTED_SCENARIO = Globals.SCENARIO_COLORS[index];

      for (let i = 0; i < 3; ++i) {
        const thickness = i === index ? 2 : 0;
        const color = i === index ? 0xff0000 : 0x000000;
        const alpha = i === index ? 1 : 0;

        this.rectangles[i + 8].setStrokeStyle(thickness, color, alpha);
      }
    }
    else {
      this.buyItem(index + 8);
    }
  }

  setChoice(choice) {
    this.choice = (choice + 11) % 11;

    const position = this.positions[this.choice];

    this.selectionRectangle.setPosition(position.x, position.y);
  }

  updatePermissions() {
    for (let i = 0; i < 11; ++i) {
      const owned = i < 8 ? this.ownGeorge(i) : this.ownScenario(i - 8);

      this.checks[i].setVisible(owned === true);
      this.moneys[i].setVisible(this.blockchainInitialized === true && owned === false);
      this.prices[i].setVisible(this.blockchainInitialized === true && owned === false);
    }
  }

  create() {
    this.add.image(400, 300, "menuBackground")
      .alpha = 0.5;

    this.inputs = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      enter: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
      escape: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
    };

    this.positions = [];
    this.rectangles = [];

    for (let i = 0; i < 8; ++i) {
      const column = i % 4;
      const row = Math.trunc(i / 4);
      const x = column * 128 + column * 16 + 184;
      const y = row * 128 + row * 16 + 128;

      this.positions.push({ x, y, });

      const rectangle = this.add.rectangle(x, y, 128, 128, 0x181818).setAlpha(0.7);

      this.rectangles.push(rectangle);

      this.add.sprite(x, y, `${Globals.GEORGE_COLORS[i]}George`)
        .setScale(2)
        .anims
          .play(`${Globals.GEORGE_COLORS[i]}Running`);
    }

    for (let i = 0; i < 3; ++i) {
      const column = i % 4;
      const x = column * 128 + column * 16 + 256;
      const y = 472;

      this.positions.push({ x, y, });

      const rectangle = this.add.rectangle(x, y, 128, 128, 0x181818).setAlpha(0.7);

      this.rectangles.push(rectangle);

      this.add.sprite(x, y, `${Globals.SCENARIO_COLORS[i]}Tree`).setScale(2);
    }

    this.selectionRectangle = this.add.rectangle(184, 128, 128, 128, 0xffffff);

    this.moneys = [];
    this.checks = [];
    this.prices = [];

    for (let i = 0; i < 11; ++i) {
      const position = this.positions[i];

      const money = this.add.image(position.x + 64, position.y - 64, "menuMoney")
        .setScale(0.05)
        .setRotation(-Math.PI / 4);

      this.moneys.push(money);

      const check = this.add.image(position.x + 64, position.y - 64, "menuCheck")
        .setScale(0.05);

      this.checks.push(check);

      const price = this.add.text(position.x, position.y + 60, "0.000", { fontFamily: "PressStart2P", fontSize: 8, })
        .setOrigin(0.5, 1);

      this.prices.push(price);
    }

    this.selectGeorge(Globals.GEORGE_COLORS.indexOf(Globals.SELECTED_GEORGE));
    this.selectScenario(Globals.SCENARIO_COLORS.indexOf(Globals.SELECTED_SCENARIO));
    this.setChoice(this.choice);
    this.updatePermissions();

    this.blockchainMessage = this.add.text(400, 590, "Blockchain not initialized", { color: "#ff0000", fontFamily: "PressStart2P", fontSize: 10, }).setOrigin(0.5, 1);

    this.initializeBlockchain()
      .then(result => {
        this.blockchainInitialized = result;

        if (result === true) {
          this.blockchainMessage.destroy();

          this.blockchainMessage = null;
        }

        this.updatePermissions();
      })
      .catch(() => void 0);

    this.isClicking = false;

    this.cameras.main.fadeIn(500);
  }

  update(time) {
    let clicked = false;
    let swipeDirection = null;

    if (this.input.activePointer.isDown === false && this.isClicking === true) {
      if (Math.abs(this.input.activePointer.upY - this.input.activePointer.downY) >= 50) {
        if (this.input.activePointer.upY < this.input.activePointer.downY) {
          swipeDirection = Globals.SWIPE_UP;
        }
        else {
          swipeDirection = Globals.SWIPE_DOWN;
        }
      }
      else if (Math.abs(this.input.activePointer.upX - this.input.activePointer.downX) >= 50) {
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

    this.selectionRectangle.setAlpha(Math.sin(time * 0.005) * 0.05 + 0.25);

    if (Phaser.Input.Keyboard.JustDown(this.inputs.up) === true || swipeDirection === Globals.SWIPE_UP) {
      if (this.choice < 4) {
        this.setChoice(8);
      }
      else {
        this.setChoice(this.choice - 4);
      }
    }
    else if (Phaser.Input.Keyboard.JustDown(this.inputs.down) === true || swipeDirection === Globals.SWIPE_DOWN) {
      if (this.choice < 7) {
        this.setChoice(this.choice + 4);
      }
      else if (this.choice === 7) {
        this.setChoice(10);
      }
      else {
        this.setChoice(this.choice + 3);
      }
    }
    else if (Phaser.Input.Keyboard.JustDown(this.inputs.left) === true || swipeDirection === Globals.SWIPE_LEFT) {
      if (this.choice % 4 === 0) {
        this.setChoice(this.choice + 3);
      }
      else {
        this.setChoice(this.choice - 1);
      }
    }
    else if (Phaser.Input.Keyboard.JustDown(this.inputs.right) === true || swipeDirection === Globals.SWIPE_RIGHT) {
      if ((this.choice + 1) % 4 === 0) {
        this.setChoice(this.choice - 3);
      }
      else {
        this.setChoice(this.choice + 1);
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.inputs.enter) === true) {
      if (this.choice < 8) {
        this.selectGeorge(this.choice);
      }
      else {
        this.selectScenario(this.choice - 8);
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.inputs.escape) === true || clicked === true) {
      this.inputs.escape.enabled = false;

      this.cameras.main
        .fadeOut(500)
        .once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
          this.scene
            .stop()
            .start("Menu");
        });
    }
  }
}

export default Options;
