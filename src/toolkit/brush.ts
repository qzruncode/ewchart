import * as d3 from 'd3';
import { IEWChartProps } from '../../types';

export function DrawBrush(
  this: any,
  svg,
  config,
  data: IEWChartProps['data'],
  line: { reDraw: () => void },
  xAixs: { func: d3.ScaleTime<number, number, never>; data: Date[]; recall: () => void },
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
      const approximateIndex = selection.map(xAixs.func.invert).map(t => d3.bisectLeft(xAixs.data, t));
      if (approximateIndex[1] - approximateIndex[0] >= 5) {
        const approximateX = approximateIndex.map(i => xAixs.data[i]);
        config.onSelect && config.onSelect(approximateX);
        xAixs.func.domain(approximateX);
        line.reDraw();
        xAixs.recall();
      }
      brushEle.call(brush.move, null);
    }
  }

  const clear = () => {
    brush.on('.');
  };
  this.clear = clear;
}
