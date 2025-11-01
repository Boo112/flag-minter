export const CONTRACT_ADDRESS = "0xea76f209e0cdf6b3f1d2521db23072a4712c2ad4"; // твой адрес контракта

export const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "string", "name": "country", "type": "string" }
    ],
    "name": "mintFlag",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
