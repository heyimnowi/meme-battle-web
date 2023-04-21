import { Button } from '@mui/material';
import { getEthereumObject } from '../utils/contract';

interface ConnectWalletButtonProps {
	onSetCurrentAccount: (account: string) => void;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ 
	onSetCurrentAccount
}) => {

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
      onSetCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

	return (
		<Button
      variant="contained"
			color="primary"
			onClick={connectWallet}
		>
			Connect Wallet
		</Button>
	);
};

export default ConnectWalletButton;