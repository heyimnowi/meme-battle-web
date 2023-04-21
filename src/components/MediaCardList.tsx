import { Box} from "@mui/material";
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
	const { classes } = useStyles();

  const getImageFromName = (name: string) => {
    const option = OPTION_IMAGES.find((image) => image.name === name);
    if (option) {
      return option.url;
    }
    return "";
  };

  const getOptions = async (contract: any) => {
    console.log("Getting options...")
    console.log(contract)
    const options = await contract.getOptions();
    console.log(options);
    setOptions(options);
  };

  async function vote(optionIndex: number) {
    try {
      const tx = await contract.vote(optionIndex);
      await tx.wait();
      console.log("Vote submitted!");
    } catch (error) {
      console.log(error);
    }
  }

	useEffect(() => {
		getOptions(contract);
	}, [contract]);

	return (
	<Box className={classes.box} maxWidth="1200px">
		{options.map((option, index) => (
			<MediaCard
				key={index}
				image={getImageFromName(option.name)}
				title={option.name} onVote={() => vote(index)}
			/>
		))}
	</Box>);
};

export default MediaCardList;