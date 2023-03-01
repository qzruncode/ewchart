import * as d3 from 'd3';

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

export const showValue = (unit, v) => {
  const f = v => (+v.slice(0, -1)).toFixed(2) + v.slice(-1);
  if (unit === 'K') {
    return v >= 1000 ? f(d3.format('.4~s')(v)) : v;
  }
  return v + unit;
};
