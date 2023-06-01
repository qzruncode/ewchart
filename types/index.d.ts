import React from 'react';

export interface Igroup {
  color?: string;
  lineType?: 'dotted' | 'solid';
  lineWidth?: number;
  label: string;
  break?: 'line' | 'none';
  breakType?: 'dotted' | 'solid';
  values?: Array<number | null> | Array<{ Open: number; High: number; Low: number; Close: number }>;
  value?: number;
  choose?: boolean;
}

export interface EWChartData {
  x?: {
    start: number;
    end: number;
    interval: number;
    format?: string;
  };
  y?: {
    start: number;
    end: number;
  };
  yUnit?: 'K' | string;
  groups?: Array<Igroup>;
  gap?: number;
  maxWidth?: number;
  pointType?: 'fill' | 'stroke';
  pointSize?: number;
  treeData?: EWChartTreeData;
  spanDepth?: number;
  depDepth?: number;
  fixed?: boolean;
}

export interface EWChartTreeData {
  name: string;
  head?: string[];
  bottom?: string[];
  tooltip?: { [name: string]: string };
  children?: Array<EWChartTreeData>;
  error?: boolean;
}

export interface IEWChartProps {
  type: 'line' | 'arealine' | 'pie' | 'histogram' | 'scatter' | 'tree' | 'candlestick';
  renderer: 'canvas' | 'svg' | 'canvas+svg';
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
    onSelect?: (rangeIndexs: number[], dateRange: Date[]) => void;
    onClick?: (data: any) => void;
  };
  interactive?: {
    group?: string;
    mouse?: {
      crossText?: boolean;
      shadow?: boolean;
      pieText?: boolean;
      barText?: boolean;
    };
    select?: {
      min: number;
    };
  };
  treeConfig?: {
    lineType: 'linkBezierCurve' | 'linkBroken' | 'linkStraight' | string;
    center?: boolean;
    type?: 'span' | 'deep' | 'all';
    chartBg?: string;
    linkBg?: string;
    btnBg?: string;
  };
}

function EWChart(props: IEWChartProps): React.ReactElement;

export const getColorsByIndex = (index: number) => string;
export default EWChart;
