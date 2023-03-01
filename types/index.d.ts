import React from 'react';

export enum ChartType {
  Line = 'line',
  AreaLine = 'arealine',
  Pie = 'pie',
  Histogram = 'histogram',
  Scatter = 'scatter',
  Path = 'path',
  CurveLine = 'curveline',
}

export interface IEWChartProps {
  chart: {
    type: 'line' | 'arealine' | 'pie' | 'histogram' | 'scatter' | 'path' | 'curveline';
  };

  size: {
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  data: {
    x: {
      start: number;
      end: number;
      interval: number;
    };
  };
}

function EWChart(props: IEWChartProps): React.ReactElement;

export default EWChart;
