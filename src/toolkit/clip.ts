import * as d3 from 'd3';

export const drawClipPath = (svg, config) => {
  const { left, right, width, height, bottom, top } = config;
  const svgEle = d3.select(svg);
  let clipEle = svgEle.select('rect.clip_path_rect');
  if (clipEle.empty()) {
    clipEle = svgEle
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('class', 'clip_path_rect');
  }

  clipEle
    .attr('transform', `translate(${left}, ${top})`)
    .attr('width', width - right - left)
    .attr('height', height - bottom - top);
};
