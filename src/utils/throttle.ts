const throttle = <T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
): (...args: T) => void => {
  let timer: ReturnType<typeof setTimeout> | null;
 
  return (...args: T) => {
    if (timer == null) {
      callback(...args);
      timer = setTimeout(() => {
        timer = null;
      }, delay);
    }
  };
};

export default throttle;