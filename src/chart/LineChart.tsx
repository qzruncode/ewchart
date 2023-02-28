import React, { useContext } from 'react';
import { ConfigContext } from '..';

function LineChart() {
  const config = useContext(ConfigContext);
  console.log(config);
  return <svg preserveAspectRatio="xMinYMin meet" width="100%" height="100%"></svg>;
}

export default LineChart;
