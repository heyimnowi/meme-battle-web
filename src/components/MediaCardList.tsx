import { Box } from "@mui/material";
import { BigNumber } from "ethers";
import { useContext, useEffect, useState } from "react";
import MediaCard from "./MediaCard";
import { makeStyles } from "tss-react/mui";
import { OPTION_IMAGES } from "../utils/options";
import { fetchWinner } from "../utils/contract";
import { AlertSeverity, SnackbarContext } from "../context/SnackbarContext";

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

const MediaCardList: React.FC<MediaCardListProps> = ({ contract }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState<Option | null>(null); // [name, count]
  const { classes } = useStyles();
  const { showMessage } = useContext(SnackbarContext);

  const getImageFromName = (name: string) => {
    const option = OPTION_IMAGES.find((image) => image.name === name);
    if (option) {
      return option.url;
    }
    return "";
  };

  const getOptions = async () => {
    try {
      setLoading(true);
      const options = await contract.getVotes();
      setOptions(options);
    } catch (message) {
      showMessage(
        "Failed to get options. Please try again later.",
        AlertSeverity.ERROR,
      );
    } finally {
      setLoading(false);
    }
  };

  const vote = async (optionIndex: number) => {
    showMessage(
      "Submitting vote...",
      AlertSeverity.INFO,
    );
    try {
      setLoading(true);
      const tx = await contract.vote(optionIndex);
      await tx.wait();
      showMessage(
        "Vote submitted successfully!",
        AlertSeverity.SUCCESS,
      );
    } catch (error: any) {
      showMessage(
        "Failed to submit vote. Please try again later.",
        AlertSeverity.ERROR,
      );
    } finally {
      setLoading(false);
    }
  };

  const getWinner = async () => {
    const winner = await fetchWinner(contract);
    if (winner.name !== "") {
      setWinner(winner);
    }
  };

  useEffect(() => {
    getOptions();
    getWinner();
  }, []);

  return (
    <Box className={classes.box} maxWidth="1200px">
      {options.map((option, index) => (
        <MediaCard
          key={index}
          image={getImageFromName(option.name)}
          title={option.name}
          onVote={() => vote(index)}
          disabled={winner !== null}
          loading={loading}
          winner={winner?.name === option.name}
        />
      ))}
    </Box>
  );
};

export default MediaCardList;
