const colors = [
  '#7EB26D',
  '#EAB839',
  '#6ED0E0',
  '#ef843c',
  '#E24D42',
  '#1F78C1',
  '#BA43A9',
  '#705DA0',
  '#508642',
  '#CCA300',
  '#447EBC',
  '#C15C17',
  '#890F02',
  '#0A437C',
  '#6D1F62',
  '#584477',
  '#70DBED',
  '#F9BA8F',
  '#F29191',
  '#82B5D8',
  '#E5A8E2',
  '#AEA2E0',
  '#629E51',
  '#E5AC0E',
  '#64B0C8',
  '#E0752D',
  '#BF1B00',
  '#0A50A1',
  '#962D82',
  '#614D93',
  '#9AC48A',
  '#F2C96D',
  '#65C5DB',
  '#F9934E',
  '#EA6460',
  '#5195CE',
  '#D683CE',
  '#806EB7',
  '#3F6833',
  '#967302',
  '#2F575E',
  '#99440A',
  '#58140C',
  '#052B51',
  '#511749',
  '#3F2B5B',
];

const getColors = (i, o = 1) => {
  if (o === 1) return colors[i % colors.length];
  else return colors[i % colors.length] + o.toString(16).slice(2, 4).padEnd(2, '0');
};

export const opacityColor = (c, o) => {
  return c + o.toString(16).slice(2, 4).padEnd(2, '0');
};

export default getColors;
