import { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";

interface CountdownTimerProps {
  targetDate: number;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(intervalId);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  return (
    <Box display="flex" justifyContent="center" textAlign="center">
      <Box m={1}>
        <Typography variant="h4" component="h2" color="white">
          {timeRemaining.days}
        </Typography>
        <Typography variant="subtitle1" color="white">
          Days
        </Typography>
      </Box>
      <Box m={1}>
        <Typography variant="h4" component="h2" color="white">
          {timeRemaining.hours}
        </Typography>
        <Typography variant="subtitle1" color="white">
          Hours
        </Typography>
      </Box>
      <Box m={1}>
        <Typography variant="h4" component="h2" color="white">
          {timeRemaining.minutes}
        </Typography>
        <Typography variant="subtitle1" color="white">
          Minutes
        </Typography>
      </Box>
      <Box m={1}>
        <Typography variant="h4" component="h2" color="white">
          {timeRemaining.seconds}
        </Typography>
        <Typography variant="subtitle1" color="white">
          Seconds
        </Typography>
      </Box>
    </Box>
  );
};

export default CountdownTimer;
