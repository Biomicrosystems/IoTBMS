"use client";

import { useEffect, useState } from "react";

export default function LastCheckedOnline(props: {
  lastChecked: number | undefined;
}) {
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  let timeDifference = 0;
  let timeUnit = "minutos";

  if (props.lastChecked) {
    timeDifference = Math.floor((currentTime - props.lastChecked) / 60000); // Difference in minutes

    if (timeDifference >= 525600) {
      timeDifference = Math.floor(timeDifference / 525600);
      timeUnit = "años";
    } else if (timeDifference >= 1440) {
      timeDifference = Math.floor(timeDifference / 1440);
      timeUnit = "días";
    } else if (timeDifference >= 60) {
      timeDifference = Math.floor(timeDifference / 60);
      timeUnit = "horas";
    }

    if (timeDifference < 0) {
      timeDifference = 0;
    }
  }

  return (
    <>
      {timeDifference} {timeUnit}
    </>
  );
}
