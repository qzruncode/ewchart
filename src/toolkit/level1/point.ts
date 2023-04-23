import * as d3 from 'd3';
import { IEWChartProps } from '../../../types';

export function DrawPoint(
  this: any,
  svg,
  config,
  data: IEWChartProps['data'],
  xAixs: { func: d3.ScaleTime<number, number, never>; data: Date[] },
  yAixs: { func: d3.ScaleTime<number, number, never> }
) {
  const svgEle = d3.select(svg);

  const draw = () => {
    let pointEle: any = svgEle.select('g.point_ele');
    if (pointEle.empty()) {
      pointEle = svgEle.append('g').attr('class', 'point_ele');
    }
    pointEle.attr('clip-path', 'url(#clip)');

    pointEle
      .selectAll('g')
      .data(data.groups)
      .join('g')
      .attr(data.pointType === 'fill' ? 'stroke' : 'fill', 'none')
      .attr(data.pointType === 'stroke' ? 'stroke' : 'fill', d => d.color)
      .selectAll('circle')
      .data(d => d.values)
      .join('circle')
      .attr('od', (d, i) => xAixs.data[i].toString())
      .attr('cx', (d, i) => xAixs.func(xAixs.data[i]))
      .attr('cy', d => (d != null ? yAixs.func(d) : yAixs.func(data.y ? data.y.start : 0)))
      .attr('r', d => (d != null ? (data.pointSize != undefined ? data.pointSize : 2.5) : 0));
  };
  draw();

  this.reDraw = () => {
    draw();
  };
}
