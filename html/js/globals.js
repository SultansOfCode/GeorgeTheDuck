"use strict";

const georgeColors = [
  "aqua", "blue", "green", "orange",
  "purple", "red", "tan", "yellow"
];

const scenarioColors = [
  "desert", "forest", "snow"
];

const contractAddress = "0x0f45BceF38030F2D53e68dA410d8Bc70dc745189";
const contractAbi = [
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

const defaultPermissions = 0b01010000000;

let selectedGeorge = "yellow";
let selectedScenario = "forest";

let permissions = defaultPermissions;

export default {
  georgeColors,
  scenarioColors,
  contractAddress,
  contractAbi,
  selectedGeorge,
  selectedScenario,
  defaultPermissions,
  permissions,
};
