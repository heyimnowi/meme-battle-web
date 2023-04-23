import { ethers } from "ethers";
import VotingContract from "../contracts/Voting.json";

declare let window: any;

export const CONTRACT_ADDRESS = "0x43d770d30C749b6CCA66F4b1f15e980939b6fDFC";

export const CONTRACT_ABI = VotingContract.abi;

export const getEthereumObject = () => {
	if (
		typeof window !== "undefined" &&
		typeof window.ethereum !== "undefined"
	) {
		return window.ethereum;
	}
	return undefined;
};

export const getContract = async () => {
	const ethereum = getEthereumObject();
	if (!ethereum) {
		console.log("Ethereum object not found");
		return;
	}
	try {
		const provider = new ethers.providers.Web3Provider(ethereum);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(
			CONTRACT_ADDRESS,
			CONTRACT_ABI,
			signer
		);
		return contract;
	} catch (error) {
		console.log("Contract not deployed to the current network");
		return undefined;
	}
};