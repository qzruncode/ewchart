import * as d3 from 'd3';
import { IEWChartProps } from '../../types';
import { mouseMoves } from '..';
const scale = window.devicePixelRatio || 1;

export default function LineMove(
  this: any,
  ocanvas,
  canvas,
  config,
  data: IEWChartProps['data'],
  xAixs: { func: d3.ScaleTime<number, number, never>; data: Date[] },
  yAixs: { func: d3.ScaleLinear<number, number, never> }
) {
  const that = this;
  if ('ontouchstart' in document) {
    d3.select(ocanvas).on('touchstart', entered).on('touchmove', moved).on('touchend', leaved);
  } else {
    d3.select(ocanvas).on('mouseenter', entered).on('mousemove', moved).on('mouseleave', leaved);
  }
  let isOut = true;

  function entered(event, passive) {
    config.group != undefined &&
      !passive &&
      mouseMoves
        .filter(mouseMove => mouseMove !== that && mouseMove.group === config.group)
        .forEach(mouseMove => {
          mouseMove.entered(event, true);
        });
    isOut = false;
    config.onMove && config.onMove('enter');
  }

  let position,
    xm,
    xIndex,
    x,
    ys: Array<{ x: number; y: number; c: string | undefined; label: string; value: number | null }>;
  function moved(event, passive) {
    config.group != undefined &&
      !passive &&
      mouseMoves
        .filter(mouseMove => mouseMove !== that && mouseMove.group === config.group)
        .forEach(mouseMove => {
          mouseMove.moved(event, true);
        });
    isOut = false;
    position = d3.pointer(event);
    xm = xAixs.func.invert(position[0] * scale); // 根据用户坐标获取svg坐标
    xIndex = d3.bisectCenter(xAixs.data, xm); // 根据svg坐标获取最近点的索引
    x = xAixs.func(xAixs.data[xIndex]); // 根据索引获取svg坐标值，进而获取用户坐标值
    ys = [];
    data.groups &&
      data.groups.forEach(group => {
        if (group.values) {
          const value = group.values[xIndex];
          const y = yAixs.func(value); // y坐标
          if (y !== undefined) {
            ys.push({
              x,
              y,
              c: group.color,
              label: group.label,
              value,
            });
          }
        }
      });
    config.onMove && config.onMove('move', ys, { x: position[0], y: position[1] });
  }

  function leaved(event, passive) {
    config.group != undefined &&
      !passive &&
      mouseMoves
        .filter(mouseMove => mouseMove !== that && mouseMove.group === config.group)
        .forEach(mouseMove => {
          mouseMove.leaved(event, true);
        });
    isOut = true;
    config.onMove && config.onMove('leave');
  }

  let { left, width, height } = config;
  left = scale * left;
  width = scale * width;
  height = scale * height;

  const draw = () => {
    if (position != undefined && !isOut) {
      const context = canvas.getContext('2d');
      context.save();
      // 十字线-y
      context.strokeStyle = 'red';
      context.lineWidth = 0.5 * scale;
      context.setLineDash([3 * scale, 3 * scale]);
      context.beginPath();
      context.moveTo(0, position[1] * scale);
      context.lineTo(width, position[1] * scale);
      context.stroke();
      // 十字线-x
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
      // 圆点
      const circleSize = scale * (data.pointSize != undefined ? data.pointSize * 1.2 : 3.5);
      ys.forEach(d => {
        context.strokeStyle = d.c;
        context.lineWidth = 1 * scale;
        context.setLineDash([]);
        context.beginPath();
        context.arc(d.x, d.y, circleSize, 0, Math.PI * 2);
        context.stroke();
      });
      // 十字线-y-文本
      if (config.mouse.crossText) {
        const text = yAixs.func.invert(position[1] * scale).toFixed(2);
        context.fillStyle = 'red';
        context.textAlign = 'left';
        context.font = `${10 * scale}px auto`;
        context.beginPath();
        context.fillText(text, left, position[1] * scale);
      }

      context.restore();
    }
  };

  if (config.group != undefined) {
    this.group = config.group;
  }

  const clear = () => {
    d3.select(ocanvas).on('.');
  };

  this.draw = draw;
  this.entered = entered;
  this.moved = moved;
  this.leaved = leaved;
  this.clear = clear;
}
