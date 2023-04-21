import { useState, useEffect } from "react";
import VotingContract from "./contracts/Voting.json";
import { BigNumber, ethers } from "ethers";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MediaCard from "./components/MediaCard";
import { Box, Button, Grid } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: "#f44336",
    },
    background: {
      default: "#121212",
    },
  },
});

declare let window: any;

const contractAddress = "0x77d316e88E699FE22087c20026d89E70C3E24F41";
const contractAbi = VotingContract.abi;

interface Option {
  name: string;
  count: BigNumber;
}

const useStyles = makeStyles()((theme) => {
	return {
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: theme.spacing(4),
    },
    box: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing(2),
      marginTop: theme.spacing(2),
    }
	};
});

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [contract, setContract] = useState<any>();
  const { classes } = useStyles();

  const optionImages = [
    { name: "Distracted Boyfriend", url: "https://i.imgflip.com/7ix14n.jpg" },
    { name: "One Does Not Simply", url: "https://i.imgflip.com/7ix16p.jpg" },
    { name: "Mocking Spongebob", url: "https://i.imgflip.com/7ix19w.jpg" },
    { name: "Two Buttons", url: "https://i.imgflip.com/7ix1b9.jpg" },
    { name: "Change My Mind", url: "https://i.imgflip.com/7ix1du.jpg" },
    { name: "Surprised Pikachu", url: "https://i.imgflip.com/7ix1g5.jpg" },
    { name: "Expanding Brain", url: "https://i.imgflip.com/1ur9b0.jpg" },
    { name: "Unsettled Tom", url: "https://i.imgflip.com/7ix0re.jpg" },
    { name: "Drake Hotline Bling", url: "https://i.imgflip.com/7ix1ie.jpg" },
  ];

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
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
      return contract;
    } catch (error) {
      console.log("Contract not deployed to the current network");
      return undefined;
    }
  };

  const getImageFromName = (name: string) => {
    const option = optionImages.find((image) => image.name === name);
    if (option) {
      return option.url;
    }
    return "";
  };

  const getOptions = async (contract: any) => {
    const options = await contract.getOptions();
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
      console.log("Vote submitted!");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
      {!currentAccount && (
        <Button variant="contained" onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
      <Box className={classes.box} maxWidth="1200px">
        {options.map((option, index) => (
          <MediaCard
            key={index}
            image={getImageFromName(option.name)}
            title={option.name} onVote={() => vote(index)}
          />
        ))}
      </Box>
      </div>
    </ThemeProvider>
  );
};

export default App;
