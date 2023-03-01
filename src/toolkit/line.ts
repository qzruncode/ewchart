import * as d3 from 'd3';
import { IEWChartProps } from '../../types';

export function DrawLine(
  this: any,
  svg,
  config,
  data: IEWChartProps['data'],
  xAixs: { func: d3.ScaleTime<number, number, never>; data: Date[] },
  yAixs: { func: d3.ScaleTime<number, number, never> }
) {
  const svgEle = d3.select(svg);
  const line = d3
    .line()
    // .defined((d: any) => d != null && !isNaN(d))
    .x((d, i) => xAixs.func(xAixs.data[i]))
    .y(d => yAixs.func(d != null && !isNaN(d) ? d : 0));

  let lineEle = svgEle.select('g.line_ele');
  if (lineEle.empty()) {
    lineEle = svgEle.append('g').attr('class', 'line_ele');
  }
  lineEle.attr('clip-path', 'url(#clip)');
  lineEle
    .selectAll('path')
    .data(data.groups)
    .join('path')
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', d => (d.lineType === 'dotted' ? '1,3' : 'none'))
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke', d => d.color)
    .attr('d', d => line(d.values));
}
