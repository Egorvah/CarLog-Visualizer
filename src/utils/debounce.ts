const debounce = <T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
): (...args: T) => void => {
  let timeoutTimer: ReturnType<typeof setTimeout>;
 
  return (...args: T) => {
    clearTimeout(timeoutTimer);
 
    timeoutTimer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export default debounce;
