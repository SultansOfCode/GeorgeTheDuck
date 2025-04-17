"use strict";

const SWIPE_LEFT = 0;
const SWIPE_UP = 1;
const SWIPE_RIGHT = 2;
const SWIPE_DOWN = 3;

const DAY_PHASE_DURATION = 12000;
const DAY_PHASE_TWEEN_DURATION = 2000;

const DEBUG = false;

const GEORGE_COLORS = [
  "aqua", "blue", "green", "orange",
  "purple", "red", "tan", "yellow"
];

const SCENARIO_COLORS = [
  "desert", "forest", "snow"
];

const CONTRACT_ADDRESS = "0x0f45BceF38030F2D53e68dA410d8Bc70dc745189";
const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "itemIndex",
				"type": "uint8"
			}
		],
		"name": "buyItem",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "changeOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newGeorgePrice",
				"type": "uint256"
			}
		],
		"name": "setGeorgePrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "itemIndex",
				"type": "uint8"
			}
		],
		"name": "ItemBought",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newScenarioPrice",
				"type": "uint256"
			}
		],
		"name": "setScenarioPrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawMoney",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getGeorgePrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPermissions",
		"outputs": [
			{
				"internalType": "uint16",
				"name": "",
				"type": "uint16"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getScenarioPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const DEFAULT_PERMISSIONS = 0b01010000000;

let SELECTED_GEORGE = "yellow";
let SELECTED_SCENARIO = "forest";

let PERMISSIONS = DEFAULT_PERMISSIONS;

export default {
  SWIPE_LEFT,
  SWIPE_UP,
  SWIPE_RIGHT,
  SWIPE_DOWN,
	DAY_PHASE_DURATION,
	DAY_PHASE_TWEEN_DURATION,
	DEBUG,
  GEORGE_COLORS,
  SCENARIO_COLORS,
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  SELECTED_GEORGE,
  SELECTED_SCENARIO,
  DEFAULT_PERMISSIONS,
  PERMISSIONS,
};
