import { useState, useEffect } from "react";
import VotingContract from "./contracts/Voting.json";
import { BigNumber, ethers } from "ethers";

declare let window: any;

const contractAddress = "0x581C182EEB327F6FaF4D4a9a982C779029d3129c";
const contractAbi = VotingContract.abi;

interface Option {
  name: string;
  count: BigNumber;
}

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [contract, setContract] = useState<any>();

  const getEthereumObject = () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      return window.ethereum;
    }
    return undefined;
  };

  const getContract = async () => {
    const ethereum = getEthereumObject();
    if (!ethereum) {
      console.log("Ethereum object not found");
      return;
    }
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
      return contract;
    } catch (error) {
      console.log("Contract not deployed to the current network");
      return undefined;
    }
  };

  const getOptions = async (contract: any) => {
    const options = await contract.getTotalVotesByOption();
    console.log(options);
    setOptions(options);
  };

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        console.log("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      const contract = await getContract();
      if (!contract) {
        return;
      }
      setContract(contract);
      getOptions(contract);
    };
    init();
  }, []);

  async function vote(optionIndex: number) {
    try {
      const tx = await contract.vote(optionIndex);
      await tx.wait();
      console.log('Vote submitted!');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {options.map((option, index) => (
        <li key={index}>
          {option.name} - {option.count.toString()}
        </li>
      ))}
      {!currentAccount && (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      {currentAccount && 
        <button onClick={() => vote(0)}>Vote for Option 0</button>
      }
    </div>
  );
};

export default App;
