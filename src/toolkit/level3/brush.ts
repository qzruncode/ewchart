import * as d3 from 'd3';
import { IEWChartProps } from '../../../types';
const scale = window.devicePixelRatio || 1;

export function DrawBrush(
  this: any,
  svg,
  config,
  data: IEWChartProps['data'],
  line: { reCompute: () => void },
  xAixs: { func: d3.ScaleTime<number, number, never>; data: Date[]; reCompute: (times) => void },
  yAixs: { func: d3.ScaleTime<number, number, never> }
) {
  const { left, right, width, height, bottom, top } = config;
  const svgEle = d3.select(svg);
  let brushEle: any = svgEle.select('g.brush_ele');
  if (brushEle.empty()) {
    brushEle = svgEle.append('g').attr('class', 'brush_ele');
  }
  const brush = d3
    .brushX()
    .extent([
      [left, top],
      [width - right, height - bottom],
    ])
    // .on('brush', brushed)
    .on('end', brushended);
  brushEle.call(brush);
  function brushended({ selection }) {
    if (selection) {
      const approximateIndex = selection.map(d => xAixs.func.invert(d * scale)).map(t => d3.bisectLeft(xAixs.data, t));
      if (approximateIndex[1] - approximateIndex[0] >= 5) {
        const approximateX = approximateIndex.map(i => xAixs.data[i]);
        config.onSelect && config.onSelect(approximateIndex, approximateX);
      }
      brushEle.call(brush.move, null);
    }
  }

  const clear = () => {
    brush.on('.');
  };
  this.clear = clear;
}
