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
  const lineDash = [1 * scale, 3 * scale];
  const breakLineDash = [5 * scale, 5 * scale];
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
    breakLines.forEach((breakLine, index) => {
      if (breakLine.lineType === 'dotted') {
        context.setLineDash(lineDash);
      } else {
        context.setLineDash([]);
      }
      if (breakLine.lineWidth != undefined) {
        context.lineWidth = breakLine.lineWidth;
      } else {
        context.lineWidth = lineWidth;
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
      if (normalLine.lineWidth != undefined) {
        context.lineWidth = normalLine.lineWidth;
      } else {
        context.lineWidth = lineWidth;
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
  const area = d3
    .area()
    .defined((d: any) => d != null && !isNaN(d))
    .curve(d3.curveLinear)
    .x((d, i) => xAixs.func(xAixs.data[i]))
    .y0(yAixs.func(data.y ? data.y.start : 0))
    .y1((d: any) => yAixs.func(d != null && !isNaN(d) ? d : 0));

  const lineWidth = 1.5;
  const lineDash = [1 * scale, 3 * scale];
  const breakLineDash = [5 * scale, 5 * scale];

  const breakLinePaths = breakLines.map(breakLine => {
    const path = new Path2D(line(breakLine.values));
    return path;
  });
  const breakLineAreaPaths = breakLines.map(breakLine => {
    const path = new Path2D(area(breakLine.values));
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

    const area = d3
      .area()
      .defined((i: any) => D[i])
      .curve(d3.curveLinear)
      .x((i: any) => xAixs.func(xAixs.data[i]))
      .y0(yAixs.func(data.y ? data.y.start : 0))
      .y1((i: any) => yAixs.func(normalLine.values ? normalLine.values[i] : 0));

    const path3 = new Path2D(area(I as any));
    const path4 = new Path2D(area(I.filter(i => D[i]) as any));
    return [path1, path2, path3, path4];
  });

  const draw = () => {
    context.save();
    context.lineCap = 'round';
    context.lineJoin = 'round';
    breakLines.forEach((breakLine, index) => {
      if (breakLine.lineType === 'dotted') {
        context.setLineDash(lineDash);
      } else {
        context.setLineDash([]);
      }
      if (breakLine.lineWidth != undefined) {
        context.lineWidth = breakLine.lineWidth;
      } else {
        context.lineWidth = lineWidth;
      }
      context.strokeStyle = breakLine.color;
      const linePath = breakLinePaths[index];
      context.stroke(linePath);

      context.fillStyle = opacityColor(breakLine.color, 0.5);
      context.fill(breakLineAreaPaths[index]);
    });

    lines.forEach((normalLine, index) => {
      if (normalLine.lineType === 'dotted') {
        context.setLineDash(lineDash);
      } else {
        context.setLineDash([]);
      }
      if (normalLine.lineWidth != undefined) {
        context.lineWidth = normalLine.lineWidth;
      } else {
        context.lineWidth = lineWidth;
      }
      context.strokeStyle = normalLine.color;

      context.stroke(linePaths[index][0]);

      if (normalLine.breakType === 'dotted') {
        context.setLineDash(breakLineDash);
      } else {
        context.setLineDash([]);
      }
      context.stroke(linePaths[index][1]);

      context.fillStyle = opacityColor(normalLine.color, 0.5);
      context.fill(linePaths[index][3]);
      context.fill(linePaths[index][4]);
    });
    context.restore();
  };

  this.draw = draw;
}
