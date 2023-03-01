import React from 'react';

export interface Igroup {
  color?: string;
  lineType: 'dotted' | 'solid';
  label: string;
  break: 'line' | 'none';
  breakType?: 'dotted' | 'solid';
  values: Array<number | null>;
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
    groups: Array<Igroup>;
  };
}

function EWChart(props: IEWChartProps): React.ReactElement;

export default EWChart;
