import React from 'react';

export interface Igroup {
  color?: string;
  lineType: 'dotted' | 'solid';
  label: string;
  break: 'line' | 'none';
  breakType?: 'dotted' | 'solid';
  values: Array<number | null>;
}

export interface EWChartData {
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

  data: EWChartData;
}

function EWChart(props: IEWChartProps): React.ReactElement;

export const getColorsByIndex = (index: number) => string;
export default EWChart;
