import * as d3 from 'd3';
import { IEWChartProps } from '../../types';

function grayXtext(react, svg) {
  const svgEle = d3.select(svg);

  const ticks = svgEle.selectAll('.x_axis > g');
  ticks.each(function (p, j) {
    const tt = d3.select(this).select('text');
    tt.style('opacity', '0.3');
    if (tt.attr('st')) {
      tt.text(tt.attr('st'));
    }
  });

  const i = +react.parentElement.dataset.i;
  const tick = ticks.nodes()[i];
  const tt = d3.select(tick).select('text');
  tt.style('opacity', 'unset');
  if (tt.attr('ot')) {
    tt.text(tt.attr('ot'));
  }
}

function resetXtext(svg, config) {
  const svgEle = d3.select(svg);
  const ticks = svgEle.selectAll('.x_axis > g');
  ticks.each(function (p, j) {
    const tt = d3.select(this).select('text');
    tt.style('opacity', 'unset');
    if (tt.attr('st')) {
      tt.text(tt.attr('st'));
    }
  });

  if (config.mouse.barText) {
    const ttBoxEle = svgEle.select('g.tooltip');
    if (!ttBoxEle.empty()) {
      ttBoxEle.remove();
    }
  }
}

function moveTooltipText(rect, svg, value, x) {
  const svgEle = d3.select(svg);
  let ttBoxEle: any = svgEle.select('g.tooltip');
  if (ttBoxEle.empty()) {
    ttBoxEle = svgEle.append('g').attr('class', 'tooltip');
  }
  let ttEle = ttBoxEle.select('text.tooltip_text');
  if (ttEle.empty()) {
    ttEle = ttBoxEle
      .append('text')
      .attr('class', 'tooltip_text')
      .attr('stroke', 'none')
      .attr('fill', 'currentColor')
      .style('font-size', '10px');
  }

  ttEle
    .text(value)
    .transition()
    .duration(50)
    .attr('y', rect.dataset.y - 5)
    .attr('x', x + +d3.select(rect).attr('x'));
}

export default function HistogramMove(this: any, svg, drawHistogram, config, data: IEWChartProps['data']) {
  const fakes = drawHistogram.drawFake();
  const svgEle = d3.select(svg);
  if ('ontouchstart' in document) {
    fakes.on('touchstart', entered).on('touchmove', moved).on('touchend', leaved);
  } else {
    fakes.on('mouseenter', entered).on('mousemove', moved).on('mouseleave', leaved);
    svgEle.on('mouseleave', () => {
      resetXtext(svg, config);
    });
  }

  function entered(this: any, event) {
    d3.select(this).style('opacity', 0.1);
    grayXtext(this, svg);
    config.onMove && config.onMove('enter');
  }
  function moved(this: any, event, value) {
    const position = d3.pointer(event);
    const i = Number(d3.select(this).attr('i'));
    const d = data.groups[i];
    const point = {
      color: d.color,
      label: d.label,
      value: value,
    };
    const px = +this.parentElement.dataset.x;
    const mx = +position[0] + px;
    config.onMove && config.onMove('move', [point], { x: mx, y: position[1] });

    config.mouse.barText && moveTooltipText(this, svg, value, px);
  }

  function leaved(this: any, event) {
    d3.select(this).style('opacity', 0.01);
    config.onMove && config.onMove('leave');
  }

  const clear = () => {
    fakes.on('.');
    svgEle.on('.');
  };

  this.clear = clear;
}
