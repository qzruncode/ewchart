import * as d3 from 'd3';
import { IEWChartProps, Igroup } from '../../types';

export function DrawLine(
  this: any,
  svg,
  config,
  data: IEWChartProps['data'],
  xAixs: { func: d3.ScaleTime<number, number, never>; data: Date[] },
  yAixs: { func: d3.ScaleTime<number, number, never> }
) {
  const svgEle = d3.select(svg);

  const breakLines: Igroup[] = [];
  const lines: Igroup[] = [];
  data.groups.forEach(group => {
    if (group.break === 'line') {
      lines.push(group);
    } else if (group.break === 'none') {
      breakLines.push(group);
    }
  });

  if (breakLines.length > 0) {
    const line = d3
      .line()
      .defined((d: any) => d != null && !isNaN(d))
      .x((d, i) => xAixs.func(xAixs.data[i]))
      .y(d => yAixs.func(d != null && !isNaN(d) ? d : 0));

    let breakLineEle = svgEle.select('g.breakline_ele');
    if (breakLineEle.empty()) {
      breakLineEle = svgEle.append('g').attr('class', 'breakline_ele');
    }
    breakLineEle.attr('clip-path', 'url(#clip)');
    breakLineEle
      .selectAll('path')
      .data(breakLines)
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

  if (lines.length > 0) {
    let lineEle = svgEle.select('g.line_ele');
    if (lineEle.empty()) {
      lineEle = svgEle.append('g').attr('class', 'line_ele');
    }
    lineEle.attr('clip-path', 'url(#clip)');
    lineEle.selectAll('path').remove();
    lines.forEach(data => {
      const I = d3.map(data.values, (_, i) => i);
      const D = d3.map(data.values, (d, i) => d != null && !isNaN(d));

      const line = d3
        .line()
        .defined((i: any) => D[i])
        .curve(d3.curveLinear)
        .x(i => xAixs.func(xAixs.data[i]))
        .y(i => yAixs.func(data.values[i]));

      lineEle
        .append('path')
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', data.lineType === 'dotted' ? '1,3' : 'none')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke', data.color)
        .attr('d', d => line(I)); // 根据索引，将连续的非null值绘制成分片的线段

      lineEle
        .append('path')
        .attr('fill', 'none')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', data.breakType === 'dotted' ? '5,5' : 'none')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke', data.color)
        .attr('d', line(I.filter(i => D[i]))); // 根据非null值的索引，找到非null值的x和y坐标，绘制curveLinear
    });
  }
}
