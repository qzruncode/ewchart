import * as d3 from 'd3';
import { IEWChartProps } from '../../../types';

function omitXtext(svg, xAixs: { func: d3.ScaleBand<string> }) {
  const svgEle = d3.select(svg);
  const ticks = svgEle.selectAll('.x_axis > g');
  ticks.each(function (p, j) {
    const text: any = d3.select(this).select('text');
    if (text && text.node() != null) {
      const { width } = text.node().getBBox();
      const maxWidth = xAixs.func.bandwidth();

      if (width > maxWidth) {
        const sliceWidth = maxWidth * 0.8;
        const originLength = text.text().length;
        const sliceLength = originLength / (width / sliceWidth) - 3;
        const sliceText = text.text().slice(0, sliceLength) + '...';
        text.attr('ot', text.text());
        text.attr('st', sliceText);
        text.text(sliceText);
      }
    }
  });
}

export function DrawHistogram(
  this: any,
  svg,
  config,
  data: IEWChartProps['data'],
  xAixs: { func: d3.ScaleBand<string> },
  yAixs: { func: d3.ScaleLinear<number, number, never> }
) {
  const svgEle = d3.select(svg);
  let histogramEle;

  const groupLens = data.groups && data.groups[0].values ? data.groups[0].values.length : 0;
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

  const draw = () => {
    histogramEle = svgEle.select('g.histogram_ele');
    if (histogramEle.empty()) {
      histogramEle = svgEle.append('g').attr('class', 'histogram_ele');
    }
    histogramEle.attr('clip-path', 'url(#clip)');

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

    omitXtext(svg, xAixs);
  };
  draw();
  this.drawFake = () => {
    const fakes = histogramEle
      .selectAll('g.fake_histogram')
      .data(data.groups)
      .join('g')
      .attr('class', 'fake_histogram')
      .attr('transform', d => `translate(${getGroupXOffset(d)}, 0)`)
      .attr('data-x', getGroupXOffset)
      .attr('data-i', (d, i) => i)
      .selectAll('rect')
      .data(d => d.values)
      .join('rect')
      .attr('x', getBarX)
      .attr('data-y', getBarY)
      .attr('y', 0)
      .attr('fill', '#a8a8a8')
      .style('opacity', 0.01)
      .attr('width', barWidth)
      .attr('height', yAixs.func(data.y ? data.y.start : 0));

    return fakes;
  };
  this.reDraw = () => {
    draw();
  };
}
