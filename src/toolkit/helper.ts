export const throttle = cb => {
  let id;
  // let start = performance.now();
  return e => {
    clearTimeout(id);
    id = setTimeout(() => {
      cb();
    }, 100);
    // const end = performance.now();
    // if (end - start > 500) {
    //   cb();
    //   start = end;
    // }
  };
};
