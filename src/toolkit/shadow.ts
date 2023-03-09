import * as d3 from 'd3';

export const drawPieShadow = svg => {
  const svgEle = d3.select(svg);
  const shadowEle = svgEle.select('#fds');
  if (shadowEle.empty()) {
    svgEle
      .append('defs')
      .append('filter')
      .attr('id', 'fds')
      .append('feDropShadow')
      .attr('in', 'SourceGraphic')
      .attr('dx', '0')
      .attr('dy', '0')
      .attr('stdDeviation', '6');
  }
};
