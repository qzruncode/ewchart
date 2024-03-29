import * as d3 from 'd3';

const iconSize = 8;
const rectWidth = 100;
const triangleSize = 5;

export default function TreeMove(this: any, svg, nodeEles, data) {
  if ('ontouchstart' in document) {
    nodeEles.select('g.node_box').on('touchstart', entered).on('touchmove', moved).on('touchend', leaved);
  } else {
    nodeEles.select('g.node_box').on('mouseenter', entered).on('mousemove', moved).on('mouseleave', leaved);
  }

  function entered(event) {
    return null;
  }

  function moved(this: any, event, data) {
    drawNodeInfo(svg, [data.x, data.y], data.data.tooltip);
  }

  function leaved(this: any, event) {
    if (data.fixed !== true) {
      d3.select(svg).select('g.node_tooltip').remove();
    }
  }

  const clear = () => {
    nodeEles.select('g.node_box').on('.');
  };

  this.clear = clear;
}

function drawNodeInfo(svg, pos, tooltip) {
  const svgEle = d3.select(svg);
  const treeEle = svgEle.select('.tree_box');
  let nodeTooltipEle: any = treeEle.select('g.node_tooltip');
  if (nodeTooltipEle.empty()) {
    nodeTooltipEle = treeEle
      .append('g')
      .attr('class', 'node_tooltip')
      .attr('transform', `translate(${(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER)})`);
  }

  nodeTooltipEle.transition().duration(100).attr('transform', `translate(${pos[0]}, ${pos[1]})`);

  let infoEle = nodeTooltipEle.select('rect');
  {
    if (infoEle.empty()) {
      infoEle = nodeTooltipEle.append('rect');
    }
    infoEle
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('stroke-width', '0.5')
      .attr('y', 2 * iconSize + triangleSize);
    let triangle = nodeTooltipEle.select('path.triangle');
    if (triangle.empty()) {
      triangle = nodeTooltipEle
        .append('path')
        .attr('class', 'triangle')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('transform', 'translate(0,' + (2 * iconSize + triangleSize) + ')');
    }
    const path = d3.path();
    path.moveTo(-triangleSize, 0);
    path.lineTo(0, -triangleSize);
    path.lineTo(triangleSize, 0);
    triangle.attr('d', path.toString());
  }

  let textEle = nodeTooltipEle.select('g.text');
  if (textEle.empty()) {
    textEle = nodeTooltipEle.append('g').attr('class', 'text');
  }
  textEle
    .attr('transform', 'translate(0,' + (2 * iconSize + triangleSize) + ')')
    .selectAll('text')
    .data(Object.keys(tooltip))
    .join('text')
    .attr('dy', '0.31em')
    .attr('y', (d, i) => i * 20 + 15)
    .attr('text-anchor', 'start')
    .attr('stroke', 'none')
    .attr('fill', 'black')
    .html(k => `<tspan style="font-weight: bolder;">${k}: </tspan>${tooltip[k]}`);

  let { width, height } = textEle.node().getBBox();
  width = width + 20;
  width = width > 100 ? width : 100;
  height = height + 20;
  height = height > 50 ? height : 50;
  const rx = -rectWidth / 2 + -(width - 100) / 2;
  infoEle.attr('x', rx);
  infoEle.attr('width', width);
  infoEle.attr('height', height);
  textEle.selectAll('text').attr('x', rx + 10);
}
