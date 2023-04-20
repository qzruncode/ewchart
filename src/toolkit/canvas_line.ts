import * as d3 from 'd3';
import { IEWChartProps, Igroup } from '../../types';
import { opacityColor } from './color';

const scale = window.devicePixelRatio || 1;

export function DrawLine(
  this: any,
  canvas,
  config,
  data: IEWChartProps['data'],
  xAixs: { func: any; data: Date[] },
  yAixs: { func: any }
) {
  const context = canvas.getContext('2d');
  const breakLines: Igroup[] = [];
  const lines: Igroup[] = [];
  data.groups &&
    data.groups.forEach(group => {
      if (group.break === 'line') {
        lines.push(group);
      } else if (group.break === 'none') {
        breakLines.push(group);
      }
    });

  const line = d3
    .line()
    .defined((d: any) => d != null && !isNaN(d))
    .x((d, i) => xAixs.func(xAixs.data[i]))
    .y((d: any) => yAixs.func(d != null && !isNaN(d) ? d : 0));

  const lineWidth = 1;
  const lineDash = [1, 3];
  const breakLineDash = [5, 5];
  const breakLinePaths = breakLines.map(breakLine => {
    const path = new Path2D(line(breakLine.values));
    return path;
  });
  const linePaths = lines.map(normalLine => {
    const I = d3.map(normalLine.values as any, (_, i) => i);
    const D = d3.map(normalLine.values as any, (d: any, i) => d != null && !isNaN(d));
    const line = d3
      .line()
      .defined((i: any) => D[i])
      .curve(d3.curveLinear)
      .x((i: any) => xAixs.func(xAixs.data[i]))
      .y((i: any) => yAixs.func(normalLine.values ? normalLine.values[i] : 0));
    const path1 = new Path2D(line(I as any));
    const path2 = new Path2D(line(I.filter(i => D[i]) as any));
    return [path1, path2];
  });

  const draw = () => {
    context.save();
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = lineWidth;
    breakLines.forEach((breakLine, index) => {
      if (breakLine.lineType === 'dotted') {
        context.setLineDash(lineDash);
      } else {
        context.setLineDash([]);
      }
      context.strokeStyle = breakLine.color;
      const path = breakLinePaths[index];
      context.stroke(path);
    });

    lines.forEach((normalLine, index) => {
      if (normalLine.lineType === 'dotted') {
        context.setLineDash(lineDash);
      } else {
        context.setLineDash([]);
      }
      context.strokeStyle = normalLine.color;

      context.stroke(linePaths[index][0]);

      if (normalLine.breakType === 'dotted') {
        context.setLineDash(breakLineDash);
      } else {
        context.setLineDash([]);
      }

      context.stroke(linePaths[index][1]);
    });
    context.restore();
  };

  this.draw = draw;
}

export function DrawAreaLine(
  this: any,
  svg,
  config,
  data: IEWChartProps['data'],
  xAixs: { func: any; data: Date[] },
  yAixs: { func: any }
) {
  const svgEle = d3.select(svg);

  const draw = () => {
    const breakLines: Igroup[] = [];
    const lines: Igroup[] = [];
    data.groups &&
      data.groups.forEach(group => {
        if (group.break === 'line') {
          lines.push(group);
        } else if (group.break === 'none') {
          breakLines.push(group);
        }
      });

    let breakLineEle: any = svgEle.select('g.breakline_ele');
    if (breakLines.length > 0) {
      if (breakLineEle.empty()) {
        breakLineEle = svgEle.append('g').attr('class', 'breakline_ele');
      }
      breakLineEle.attr('clip-path', 'url(#clip)');

      const line = d3
        .line()
        .defined((d: any) => d != null && !isNaN(d))
        .x((d, i) => xAixs.func(xAixs.data[i]))
        .y((d: any) => yAixs.func(d != null && !isNaN(d) ? d : 0));

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
        .y0(yAixs.func(data.y ? data.y.start : 0))
        .y1((d: any) => yAixs.func(d != null && !isNaN(d) ? d : 0));

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

    let lineEle: any = svgEle.select('g.line_ele');
    if (lines.length > 0) {
      if (lineEle.empty()) {
        lineEle = svgEle.append('g').attr('class', 'line_ele');
      }
      lineEle.attr('clip-path', 'url(#clip)');
      lineEle.selectAll('path').remove();
      lines.forEach(lineData => {
        const I = d3.map(lineData.values as any, (_, i) => i);
        const D = d3.map(lineData.values as any, (d: any, i) => d != null && !isNaN(d));

        const line = d3
          .line()
          .defined((i: any) => D[i])
          .curve(d3.curveLinear)
          .x((i: any) => xAixs.func(xAixs.data[i]))
          .y((i: any) => yAixs.func(lineData.values ? lineData.values[i] : 0));

        lineEle
          .append('path')
          .attr('fill', 'none')
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', lineData.lineType === 'dotted' ? '1,3' : 'none')
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('stroke', lineData.color)
          .attr('d', d => line(I as any)); // 根据索引，将连续的非null值绘制成分片的线段

        lineEle
          .append('path')
          .attr('fill', 'none')
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', lineData.breakType === 'dotted' ? '5,5' : 'none')
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('stroke', lineData.color)
          .attr('d', line(I.filter(i => D[i]) as any)); // 根据非null值的索引，找到非null值的x和y坐标，绘制curveLinear

        const area = d3
          .area()
          .defined((i: any) => D[i])
          .curve(d3.curveLinear)
          .x((i: any) => xAixs.func(xAixs.data[i]))
          .y0(yAixs.func(data.y ? data.y.start : 0))
          .y1((i: any) => yAixs.func(lineData.values ? lineData.values[i] : 0));

        lineEle
          .append('path')
          .attr('stroke', 'none')
          .attr('fill', opacityColor(lineData.color, 0.5))
          .attr('d', area(I as any));

        lineEle
          .append('path')
          .attr('stroke', 'none')
          .attr('fill', opacityColor(lineData.color, 0.5))
          .attr('d', area(I.filter(i => D[i]) as any)); // 根据非null值的索引，找到非null值的x和y坐标，绘制curveLinear
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
