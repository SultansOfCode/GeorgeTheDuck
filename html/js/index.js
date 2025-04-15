const myAddress = '0xF70C40627D4319b91f4b05a97F4aF404052fA1Dd';
const contractAddress = '0xAC08cbb8b7Ae13B16FfB73019Cb44a7954D89482';
const abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "num",
				"type": "uint256"
			}
		],
		"name": "store",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "retrieve",
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

let provider = null;
let signer = null;
let contract = null;
let contractWithSigner = null;

async function connect() {
  if (!window.ethereum) {
    return console.log('No MetaMask');
  }

  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();

  const accounts = await provider.send('eth_requestAccounts');

  if(!accounts || !accounts.length) {
    throw new Error('No MetaMask account allowed');
  }

  const balance = await provider.getBalance(myAddress);

  console.log(ethers.formatEther(balance.toString()));

  contract = new ethers.Contract(contractAddress, abi, provider);
  contractWithSigner = contract.connect(signer);
}

async function getValue() {
  const value = await contract.retrieve();

  console.log(value);
}

async function setValue(value) {
  const tx = await contractWithSigner.store(value);

  await tx.wait();

  console.log("Mudado!");
}

(async () => {
  await connect();
  await getValue();
})();
