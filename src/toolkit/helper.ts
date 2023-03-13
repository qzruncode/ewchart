export const throttle = cb => {
  let id;
  return e => {
    clearTimeout(id);
    id = setTimeout(() => {
      cb();
    }, 100);
  };
};
