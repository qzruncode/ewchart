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
    y: {
      start: number;
      end: number;
    };
    yUnit: 'K' | string;
    groups: Array<{
      color?: string;
      lineType: 'dotted' | 'solid';
      label: string;
      values: number[];
    }>;
  };
}

function EWChart(props: IEWChartProps): React.ReactElement;

export default EWChart;
