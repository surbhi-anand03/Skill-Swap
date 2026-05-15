import { useEffect, useState } from "react";

export default function Countdown({
  targetTime,
}) {

  const [timeLeft, setTimeLeft] =
    useState("");

  useEffect(() => {

    const interval = setInterval(() => {

      const diff =
        new Date(targetTime) -
        new Date();

      if (diff <= 0) {
        setTimeLeft("Started");
        return;
      }

      const mins =
        Math.floor(diff / 60000);

      setTimeLeft(
        `${mins} mins left`
      );

    }, 1000);

    return () =>
      clearInterval(interval);

  }, [targetTime]);

  return <p>{timeLeft}</p>;
}