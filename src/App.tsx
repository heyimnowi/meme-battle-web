import { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import { getContract } from "./utils/contract";
import ConnectWalletButton from "./components/ConnectWalletButton";
import MediaCardList from "./components/MediaCardList";
import { theme } from "./styles/theme";
import { Typography } from "@mui/material";

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
  const [contract, setContract] = useState<any>();
  const { classes } = useStyles();

  useEffect(() => {
    const init = async () => {
      const contract = await getContract();
      if (!contract) {
        return;
      }
      setContract(contract);
    };
    init();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Typography className={classes.title}>Meme Battle Royale</Typography>
        <Typography className={classes.subtitle}>
          Vote your way to meme supremacy in the ultimate showdown!
        </Typography>
        {currentAccount ? (
          <MediaCardList contract={contract} />
        ) : (
          <ConnectWalletButton onSetCurrentAccount={setCurrentAccount} />
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;
