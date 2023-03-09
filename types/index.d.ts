import React from 'react';

export interface Igroup {
  color?: string;
  lineType?: 'dotted' | 'solid';
  label: string;
  break?: 'line' | 'none';
  breakType?: 'dotted' | 'solid';
  values?: Array<number | null>;
  value?: number;
  choose?: boolean;
}

export interface EWChartData {
  x?: {
    start: number;
    end: number;
    interval: number;
  };
  y?: {
    start: number;
    end: number;
  };
  yUnit?: 'K' | string;
  groups: Array<Igroup>;
}

export interface IEWChartProps {
  type: 'line' | 'arealine' | 'pie' | 'histogram' | 'scatter' | 'path';
  style?: { [name: string]: any };
  className?: string;
  size?: {
    height?: number;
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  data: EWChartData;
  method?: {
    onMove?: (
      type: 'enter' | 'move' | 'leave',
      data: Array<{ color?: string; label: string; value: number | null; x?: number; y?: number }>,
      position: { x: number; y: number }
    ) => void;
    onSelect?: (dateRange: Date[]) => void;
  };
  interactive?: {
    group?: string;
    mouse?: {
      crossText?: boolean;
      shadow?: boolean;
      pieText?: boolean;
    };
    select?: {
      min: number;
    };
  };
}

function EWChart(props: IEWChartProps): React.ReactElement;

export const getColorsByIndex = (index: number) => string;
export default EWChart;
