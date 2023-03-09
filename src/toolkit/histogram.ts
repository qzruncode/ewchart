import * as d3 from 'd3';
import { IEWChartProps } from '../../types';

export function DrawHistogram(
  this: any,
  svg,
  config,
  data: IEWChartProps['data'],
  xAixs: { func: d3.ScaleBand<string> },
  yAixs: { func: d3.ScaleLinear<number, number, never> }
) {
  const svgEle = d3.select(svg);

  const draw = () => {
    let histogramEle: any = svgEle.select('g.histogram_ele');
    if (histogramEle.empty()) {
      histogramEle = svgEle.append('g').attr('class', 'histogram_ele');
    }
    histogramEle.attr('clip-path', 'url(#clip)');

    const groupLens = data.groups[0].values ? data.groups[0].values.length : 0;
    const maxWidth = data.maxWidth ? data.maxWidth : 50;
    const barWidth = Math.min(xAixs.func.bandwidth(), maxWidth);
    const barGap = (xAixs.func.bandwidth() - barWidth * groupLens) / 2;
    const barInnerGap = data.gap ? data.gap : 2;
    const getGroupXOffset = d => {
      const xOffset = xAixs.func(d.label);
      return (xOffset ? xOffset : 0) - ((groupLens - 1) * barInnerGap) / 2;
    };
    const getBarX = (d, i) => i * barWidth + barGap + i * barInnerGap;
    const getBarY = d => {
      const min = data.y ? data.y?.start : 0;
      return d != null ? yAixs.func(d) : yAixs.func(min);
    };
    const getBarHeight = d => {
      const min = data.y ? data.y?.start : 0;
      return d != null ? yAixs.func(min) - yAixs.func(d) : 0;
    };

    histogramEle
      .selectAll('g.real_histogram')
      .data(data.groups)
      .join('g')
      .attr('class', 'real_histogram')
      .attr('fill', d => d.color)
      .attr('transform', d => `translate(${getGroupXOffset(d)}, 0)`)
      .selectAll('rect')
      .data(d => d.values)
      .join('rect')
      .attr('x', getBarX)
      .attr('y', getBarY)
      .attr('width', barWidth)
      .attr('height', getBarHeight);
  };
  draw();
  this.reDraw = () => {
    draw();
  };
}
