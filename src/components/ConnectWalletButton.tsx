import { Button } from '@mui/material';
import { getEthereumObject } from '../utils/contract';
import { useContext } from 'react';
import { AlertSeverity, SnackbarContext } from '../context/SnackbarContext';

interface ConnectWalletButtonProps {
	onSetCurrentAccount: (account: string) => void;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ 
	onSetCurrentAccount
}) => {
  const { showMessage } = useContext(SnackbarContext);

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        showMessage( "Get MetaMask!", AlertSeverity.ERROR);
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      showMessage("Connected!", AlertSeverity.INFO);
      onSetCurrentAccount(accounts[0]);
    } catch (error: any) {
      const errorMessage = error.message || error;
      showMessage(AlertSeverity.ERROR, errorMessage);
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