const { ethers } = require("ethers");
const deployedContract = require("./deployedContract.json");

const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
const authContract = new ethers.Contract(deployedContract.address, deployedContract.abi, provider);

module.exports = { authContract }