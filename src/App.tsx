import { useState, useEffect } from "react";
import VotingContract from "./contracts/Voting.json";

declare let window: any;

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractAbi = VotingContract.abi;

interface Option {
  name: string;
  url: string;
  count: number;
}

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [options, setOptions] = useState<Option[]>([]);

  const getEthereumObject = () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      return window.ethereum;
    }
    return undefined;
  };

  useEffect(() => {
    const ethereum = getEthereumObject();
    if (!ethereum) {
      console.log("Make sure you have metamask!");
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  }, []);

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

  return (
    <div>
      {options.map((option) => (
        <div key={option.name}>
          <img src={option.url} alt={option.name} />
          <p>{option.name}</p>
        </div>
      ))}
      {!currentAccount && (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default App;
