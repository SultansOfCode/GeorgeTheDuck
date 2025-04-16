"use strict";

const georgeColors = [
  "aqua", "blue", "green", "orange",
  "purple", "red", "tan", "yellow"
];

const scenarioColors = [
  "desert", "forest", "snow"
];

let selectedGeorge = "yellow";
let selectedScenario = "forest";

let permissions = 0b01010000000;

export default {
  georgeColors,
  scenarioColors,
  selectedGeorge,
  selectedScenario,
  permissions,
};
