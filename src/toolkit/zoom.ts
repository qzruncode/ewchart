import * as d3 from 'd3';

export function zoom(svg) {
  const svgEle = d3.select(svg);
  function zoomed({ transform }) {
    svgEle.select('g.tree_box').attr('transform', transform);
  }
  const zoom = d3.zoom().scaleExtent([0.01, 20]).on('zoom', zoomed);
  svgEle.call(zoom);

  return {
    clear: () => zoom.on('.'),
    center: () => zoom.transform(svgEle, d3.zoomIdentity),
  };
}
