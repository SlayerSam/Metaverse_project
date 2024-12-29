import { ethers } from "ethers";
import contractData from "../contracts/deployedContract.json";

// Function to connect to the smart contract
export const getContract = async () => {
    try {
        if (!window.ethereum) {
            throw new Error("MetaMask is not installed. Please install it to continue.");
        }

        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Create a provider and signer
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Initialize and return the contract
        const contract = new ethers.Contract(
            contractData.address, // Deployed contract address
            contractData.abi,     // ABI of the contract
            signer                // Use the signer for write operations
        );

        return contract;
    } catch (error) {
        console.error("Error connecting to contract:", error);
        throw error; // Rethrow for further handling
    }
};

