import * as d3 from 'd3';
import { IEWChartProps } from '../../types';

export default function PieMove(this: any, pieEle, config, data: IEWChartProps['data']) {
  if ('ontouchstart' in document) {
    pieEle.selectAll('path').on('touchstart', entered).on('touchmove', moved).on('touchend', leaved);
  } else {
    pieEle.selectAll('path').on('mouseenter', entered).on('mousemove', moved).on('mouseleave', leaved);
  }

  function entered(event) {
    config.onMove && config.onMove('enter');
  }

  function moved(this: any, event, data) {
    d3.select(this).style('transform', 'scale(1.05)');
    const position = d3.pointer(event);
    const point = {
      color: data.data.color,
      label: data.data.label,
      value: data.data.value,
    };
    config.onMove && config.onMove('move', point, { x: position[0], y: position[1] });
  }

  function leaved(this: any, event) {
    d3.select(this).style('transform', 'none');
    config.onMove && config.onMove('leave');
  }

  const clear = () => {
    pieEle.selectAll('path').on('.');
  };

  this.clear = clear;
}
