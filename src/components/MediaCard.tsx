import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => {
  return {
    root: {
      width: 300,
    },
    media: {
      height: 200,
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: theme.spacing(2),
    },
  };
});

interface MediaCardProps {
  image: string;
  title: string;
  onVote: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ image, title, onVote }) => {
  const { classes } = useStyles();

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={image}
        title={title}
      />
      <CardContent>
        <Typography gutterBottom variant="subtitle1" component="h4">
          {title}
        </Typography>
        <div className={classes.buttonContainer}>
          <Button variant="contained" color="primary" onClick={onVote}>
            Vote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default MediaCard;
