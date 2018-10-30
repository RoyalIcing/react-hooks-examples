import { useState, useEffect, useMemo } from "react";

export default function useFrames(generatorF, playing) {
  const generator = useMemo(() => {
    if (playing) {
      return generatorF(Date.now());
    }
    else {
      return null;
    }
  }, [playing]);

  const [value, changeValue] = useState();

  useEffect(() => {
    if (generator) {
      const stopValue = {};

      function nextFrame(t) {
        const { value, done } = generator.next(t);
        if (!!value && value !== stopValue) {
          changeValue(value);
        }
    
        if (!done) {
          requestAnimationFrame(nextFrame);
        }
      }

      nextFrame(Date.now());

      return () => {
        generator.return(stopValue);
      }
    }
  }, [generator]);

  return value;
}