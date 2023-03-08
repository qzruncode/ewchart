import * as d3 from 'd3';
import { IEWChartProps, Igroup } from '../../types';
import { opacityColor } from './color';

export function DrawLine(
  this: any,
  svg,
  config,
  data: IEWChartProps['data'],
  xAixs: { func: d3.ScaleTime<number, number, never>; data: Date[] },
  yAixs: { func: d3.ScaleTime<number, number, never> }
) {
  const svgEle = d3.select(svg);

  const draw = () => {
    const breakLines: Igroup[] = [];
    const lines: Igroup[] = [];
    data.groups.forEach(group => {
      if (group.break === 'line') {
        lines.push(group);
      } else if (group.break === 'none') {
        breakLines.push(group);
      }
    });

    let breakLineEle = svgEle.select('g.breakline_ele');
    if (breakLines.length > 0) {
      if (breakLineEle.empty()) {
        breakLineEle = svgEle.append('g').attr('class', 'breakline_ele');
      }
      const line = d3
        .line()
        .defined((d: any) => d != null && !isNaN(d))
        .x((d, i) => xAixs.func(xAixs.data[i]))
        .y(d => yAixs.func(d != null && !isNaN(d) ? d : 0));

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
    } else {
      if (!breakLineEle.empty()) {
        breakLineEle.selectAll('path').remove();
      }
    }

    let lineEle = svgEle.select('g.line_ele');
    if (lines.length > 0) {
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
    } else {
      if (!lineEle.empty()) {
        lineEle.selectAll('path').remove();
      }
    }
  };
  draw();

  this.reDraw = () => {
    draw();
  };
}

export function DrawAreaLine(
  this: any,
  svg,
  config,
  data: IEWChartProps['data'],
  xAixs: { func: d3.ScaleTime<number, number, never>; data: Date[] },
  yAixs: { func: d3.ScaleTime<number, number, never> }
) {
  const svgEle = d3.select(svg);

  const draw = () => {
    const breakLines: Igroup[] = [];
    const lines: Igroup[] = [];
    data.groups.forEach(group => {
      if (group.break === 'line') {
        lines.push(group);
      } else if (group.break === 'none') {
        breakLines.push(group);
      }
    });

    let breakLineEle = svgEle.select('g.breakline_ele');
    if (breakLines.length > 0) {
      if (breakLineEle.empty()) {
        breakLineEle = svgEle.append('g').attr('class', 'breakline_ele');
      }
      breakLineEle.attr('clip-path', 'url(#clip)');

      const line = d3
        .line()
        .defined((d: any) => d != null && !isNaN(d))
        .x((d, i) => xAixs.func(xAixs.data[i]))
        .y(d => yAixs.func(d != null && !isNaN(d) ? d : 0));

      breakLineEle
        .selectAll('path.line')
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

      const area = d3
        .area()
        .defined((d: any) => d != null && !isNaN(d))
        .curve(d3.curveLinear)
        .x((d, i) => xAixs.func(xAixs.data[i]))
        .y0(yAixs.func(data.y.start))
        .y1(d => yAixs.func(d != null && !isNaN(d) ? d : 0));

      breakLineEle
        .selectAll('path.area')
        .data(breakLines)
        .join('path')
        .attr('class', 'area')
        .attr('fill', d => opacityColor(d.color, 0.5))
        .attr('d', d => area(d.values));
    } else {
      if (!breakLineEle.empty()) {
        breakLineEle.selectAll('path').remove();
      }
    }

    let lineEle = svgEle.select('g.line_ele');
    if (lines.length > 0) {
      if (lineEle.empty()) {
        lineEle = svgEle.append('g').attr('class', 'line_ele');
      }
      lineEle.attr('clip-path', 'url(#clip)');
      lineEle.selectAll('path').remove();
      lines.forEach(lineData => {
        const I = d3.map(lineData.values, (_, i) => i);
        const D = d3.map(lineData.values, (d, i) => d != null && !isNaN(d));

        const line = d3
          .line()
          .defined((i: any) => D[i])
          .curve(d3.curveLinear)
          .x(i => xAixs.func(xAixs.data[i]))
          .y(i => yAixs.func(lineData.values[i]));

        lineEle
          .append('path')
          .attr('fill', 'none')
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', lineData.lineType === 'dotted' ? '1,3' : 'none')
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('stroke', lineData.color)
          .attr('d', d => line(I)); // 根据索引，将连续的非null值绘制成分片的线段

        lineEle
          .append('path')
          .attr('fill', 'none')
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', lineData.breakType === 'dotted' ? '5,5' : 'none')
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('stroke', lineData.color)
          .attr('d', line(I.filter(i => D[i]))); // 根据非null值的索引，找到非null值的x和y坐标，绘制curveLinear

        const area = d3
          .area()
          .defined((i: any) => D[i])
          .curve(d3.curveLinear)
          .x(i => xAixs.func(xAixs.data[i]))
          .y0(yAixs.func(data.y.start))
          .y1(i => yAixs.func(lineData.values[i]));

        lineEle
          .append('path')
          .attr('stroke', 'none')
          .attr('fill', opacityColor(lineData.color, 0.5))
          .attr('d', area(I));

        lineEle
          .append('path')
          .attr('stroke', 'none')
          .attr('fill', opacityColor(lineData.color, 0.5))
          .attr('d', area(I.filter(i => D[i]))); // 根据非null值的索引，找到非null值的x和y坐标，绘制curveLinear
      });
    } else {
      if (!lineEle.empty()) {
        lineEle.selectAll('path').remove();
      }
    }
  };
  draw();

  this.reDraw = () => {
    draw();
  };
}
