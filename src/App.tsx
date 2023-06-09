import { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import { fetchContract, fetchExpiryDate } from "./utils/contract";
import ConnectWalletButton from "./components/ConnectWalletButton";
import MediaCardList from "./components/MediaCardList";
import { theme } from "./styles/theme";
import { Typography } from "@mui/material";
import CountdownTimer from "./components/CountdownTimer";
import { SnackbarProvider } from "./context/SnackbarContext";

const useStyles = makeStyles()((theme) => {
  return {
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: theme.spacing(0),
    },
    box: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    title: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#FFFFFF",
      marginBottom: theme.spacing(1),
      textTransform: "uppercase",
    },
    subtitle: {
      fontSize: "1rem",
      fontWeight: 500,
      color: "#FFFFFF",
      marginBottom: theme.spacing(2),
    },
  };
});

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [contract, setContract] = useState<Contract>();
  const [expiryDate, setExpiryDate] = useState<number>(0);
  const { classes } = useStyles();

  useEffect(() => {
    const init = async () => {
      const contract = await fetchContract();
      if (!contract) {
        return;
      }
      setContract(contract);
      const expiryDate = await fetchExpiryDate(contract);
      setExpiryDate(expiryDate);
    };
    init();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <div className={classes.root}>
          <Typography className={classes.title}>Meme Battle Royale</Typography>
          <Typography className={classes.subtitle}>
            Vote your way to meme supremacy in the ultimate showdown!
          </Typography>

          <CountdownTimer targetDate={expiryDate} />
          {currentAccount ? (
            <MediaCardList contract={contract} />
          ) : (
            <ConnectWalletButton onSetCurrentAccount={setCurrentAccount} />
          )}
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
