export const getXData = (start: number, end: number, interval: number) => {
  const xd: Date[] = [];
  let sd = new Date(start);
  const ed = new Date(end);
  while (sd <= ed) {
    xd.push(new Date(sd));
    sd = new Date(sd.setMilliseconds(sd.getMilliseconds() + interval));
  }
  return xd;
};
