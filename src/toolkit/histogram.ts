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
  const { left, right, width, height, bottom, top } = config;
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
    // const getBarX = 

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
      .attr('x', (d, i) => i * barWidth + barGap + i * barInnerGap)
      .attr('y', d => (d != null ? yAixs.func(d) : yAixs.func(data.y?.start)))
      .attr('width', barWidth)
      .attr('height', d => (d != null ? yAixs.func(data.y?.start) - yAixs.func(d) : 0));
  };
  draw();
  this.reDraw = () => {
    draw();
  };
}
