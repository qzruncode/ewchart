import React, { useContext, useEffect, useRef } from 'react';
import { ConfigContext } from '..';
import { drawXAixs } from '../toolkit/axis';

function LineChart({ data }) {
  const svgRef = useRef(null);
  const config = useContext(ConfigContext);
  useEffect(() => {
    svgRef.current && drawXAixs(svgRef.current, config, data);
  }, []);

  return <svg ref={svgRef} preserveAspectRatio="xMinYMin meet" width="100%" height="100%"></svg>;
}

export default LineChart;
