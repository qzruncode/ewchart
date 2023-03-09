import * as d3 from 'd3';
import { IEWChartProps } from '../../types';

export default function HistogramMove(this: any, drawHistogram, config, data: IEWChartProps['data']) {
  const fakes = drawHistogram.drawFake();
  if ('ontouchstart' in document) {
    fakes.on('touchstart', entered).on('touchmove', moved).on('touchend', leaved);
  } else {
    fakes.on('mouseenter', entered).on('mousemove', moved).on('mouseleave', leaved);
  }

  function entered(this: any, event) {
    d3.select(this).style('opacity', 0.1);
  }
  function moved(this: any, event, value) {
    const position = d3.pointer(event);
    const i = Number(d3.select(this).attr('i'));
    const d = data.groups[i];
    const point = {
      color: d.color,
      label: d.label,
      value: value,
    };

    config.onMove && config.onMove('move', [point], { x: position[0], y: position[1] });
  }

  function leaved(this: any, event) {
    d3.select(this).style('opacity', 0.01);
  }
}
