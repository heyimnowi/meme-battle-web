import { Box, Snackbar } from "@mui/material";
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

const MediaCardList: React.FC<MediaCardListProps> = ({ contract }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { classes } = useStyles();

  const getImageFromName = (name: string) => {
    const option = OPTION_IMAGES.find((image) => image.name === name);
    if (option) {
      return option.url;
    }
    return "";
  };

  const getOptions = async (contract: any) => {
    console.log("Getting options...");
    console.log(contract);
    try {
      setLoading(true);
      const options = await contract.getOptions();
      console.log(options);
      setOptions(options);
    } catch (message) {
      console.log(message);
      setMessage("Failed to get options. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const vote = async (optionIndex: number) => {
    setMessage("Submitting vote...");
    try {
      setLoading(true);
      const tx = await contract.vote(optionIndex);
      await tx.wait();
      console.log("Vote submitted!");
      setMessage("Vote submitted successfully!");
    } catch (message) {
      console.log(message);
      setMessage("Failed to submit vote. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOptions(contract);
  }, [contract]);

  const handleClose = () => {
    setMessage(null);
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
        open={message !== null}
        message={message ?? ""}
        autoHideDuration={5000}
        onClose={handleClose}
      />
    </Box>
  );
};

export default MediaCardList;
