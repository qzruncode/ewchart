import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ConfigContext } from '..';

function PieChart({ data, id, subscription }) {
  const svgRef = useRef(null);
  const config = useContext(ConfigContext);
  const [chartConfig, setChartConfig] = useState(config);

  return <svg ref={svgRef} preserveAspectRatio="xMinYMin meet" width="100%" height={chartConfig.height}></svg>;
}

export default PieChart;
