import * as d3 from 'd3';
import { IEWChartProps } from '../../../types';

export function DrawCandlestick(
  this: any,
  svg,
  config,
  data: IEWChartProps['data'],
  xAixs: { func: d3.ScaleTime<number, number, never>; data: Date[]; recall: (func) => void },
  yAixs: { func: d3.ScaleTime<number, number, never>; recall: (func) => void }
) {
  const svgEle = d3.select(svg);

  const draw = () => {
    let sticksBox: any = svgEle.select('g.sticks');
    if (sticksBox.empty()) {
      sticksBox = svgEle.append('g').attr('class', 'sticks');
    }
    sticksBox.attr('clip-path', 'url(#clip)');
    const sticks = sticksBox
      .selectAll('g.stick_line')
      .data(data.groups)
      .join('g')
      .attr('class', 'stick_line')
      .selectAll('g.stick')
      .data(d => d.values)
      .join('g')
      .attr('class', 'stick');

    const { left, right, width, top, bottom, height } = config;
    const maxBarWidth = (width - right - left) / xAixs.data.length;
    const maxWidth = data.maxWidth ? data.maxWidth : 10;
    const barWidth = Math.min(maxBarWidth, maxWidth);
    sticks.html((d, i) => {
      const baseX = xAixs.func(xAixs.data[i]);
      const baseY = d != null ? yAixs.func(d.Open) : yAixs.func(data.y ? data.y.start : 0);
      const baseH = d != null ? yAixs.func(d.High) : yAixs.func(data.y ? data.y.start : 0);
      const baseL = d != null ? yAixs.func(d.Low) : yAixs.func(data.y ? data.y.start : 0);
      const O = yAixs.func(d.Open),
        C = yAixs.func(d.Close);
      const barHeight = Math.max(Math.abs(O - C), 1);

      let offsetY = 0,
        color;
      if (d.Close > d.Open) {
        offsetY = barHeight;
        color = 'red';
      } else if (d.Close < d.Open) {
        offsetY = 0;
        color = 'green';
      } else {
        offsetY = 0;
        color = 'black';
      }

      const bar = `<rect x="${baseX - barWidth / 2}" y="${
        baseY - offsetY
      }" width="${barWidth}" height="${barHeight}" fill="${color}"></rect>`;
      const line = `<line fill="none" x1="${baseX}" y1="${baseH}" x2="${baseX}" y2="${baseL}" stroke="${color}" />`;

      return line + bar;
    });

    const zoom = d3
      .zoom()
      .translateExtent([
        [left, top],
        [width - right, height - bottom],
      ])
      .scaleExtent([1, Infinity])
      .extent([
        [left, top],
        [width - right, height - bottom],
      ])
      .on('zoom', ({ transform }) => {
        const zx = transform.rescaleX(xAixs.func).interpolate(d3.interpolateRound);
        const zy = transform.rescaleY(yAixs.func).interpolate(d3.interpolateRound);
        sticksBox.attr('transform', transform);
        xAixs.recall(zx);
        yAixs.recall(zy);
      });
    svgEle.call(zoom);
  };
  draw();

  this.reDraw = () => {
    draw();
  };
}
