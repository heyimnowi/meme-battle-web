import { BigNumber, Contract, ethers } from "ethers";
import VotingContract from "../contracts/Voting.json";

declare let window: any;

export const CONTRACT_ADDRESS = "0x8114eDAd8165131da85d4697369B65Bf3AF1cCf3";

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

export const fetchContract = async () => {
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

export const fetchExpiryDate = async (contract: Contract) => {
	return await contract.expiryDate().then((expiryDate: BigNumber) => expiryDate.toNumber());
};

export const fetchWinner = async (contract: Contract) => {
	return await contract.getWinningOption().then((winner: string) => winner);
}