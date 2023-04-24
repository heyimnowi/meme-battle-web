import { Alert, Box, Snackbar } from "@mui/material";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import MediaCard from "./MediaCard";
import { makeStyles } from "tss-react/mui";
import { OPTION_IMAGES } from "../utils/options";

const useStyles = makeStyles()((theme) => {
	return {
    box: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing(2),
      marginTop: theme.spacing(2),
    }
	};
});

interface Option {
  name: string;
  count: BigNumber;
}

interface MediaCardListProps {
  contract: any;
}

enum AlertSeverity {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error"
};

const MediaCardList: React.FC<MediaCardListProps> = ({ contract }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ severity: AlertSeverity; message: string | null }>({
    severity: AlertSeverity.INFO,
    message: null,
  });
  const { classes } = useStyles();

  const getImageFromName = (name: string) => {
    const option = OPTION_IMAGES.find((image) => image.name === name);
    if (option) {
      return option.url;
    }
    return "";
  };

  const getOptions = async (contract: any) => {
    try {
      setLoading(true);
      const options = await contract.getVotes();
      setOptions(options);
    } catch (message) {
      setAlert({
        severity: AlertSeverity.ERROR,
        message: "Failed to get options. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const vote = async (optionIndex: number) => {
    setAlert({
      severity: AlertSeverity.INFO,
      message: "Submitting vote..."
    });
    try {
      setLoading(true);
      const tx = await contract.vote(optionIndex);
      await tx.wait();
      setAlert({
        severity: AlertSeverity.SUCCESS,
        message: "Vote submitted successfully!"
      });
    } catch (error: any) {
      const parsedMessage = error.error.message.replace("execution reverted: ", "");
      setAlert({
        severity: AlertSeverity.ERROR,
        message: parsedMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOptions(contract);
  }, [contract]);

  const handleClose = () => {
    setAlert({
      severity: AlertSeverity.INFO,
      message: null,
    });
  };

  return (
    <Box className={classes.box} maxWidth="1200px">
      {options.map((option, index) => (
        <MediaCard
          key={index}
          image={getImageFromName(option.name)}
          title={option.name}
          onVote={() => vote(index)}
          disabled={loading}
        />
      ))}
      <Snackbar
        open={alert.message !== null}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert severity={alert.severity}>
          {alert.message ?? ""}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MediaCardList;
