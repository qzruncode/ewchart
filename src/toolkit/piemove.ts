import * as d3 from 'd3';

export default function PieMove(this: any, pieEle, config) {
  const { width, height } = config;
  if ('ontouchstart' in document) {
    pieEle.selectAll('path').on('touchstart', entered).on('touchmove', moved).on('touchend', leaved);
  } else {
    pieEle.selectAll('path').on('mouseenter', entered).on('mousemove', moved).on('mouseleave', leaved);
  }

  function entered(event) {
    config.onMove && config.onMove('enter');
  }

  function moved(this: any, event, data) {
    const pie = d3.select(this);
    pie.style('transform', 'scale(1.05)');
    if (config.mouse.shadow) {
      pie.attr('filter', 'url(#fds)');
    }
    const position = d3.pointer(event);
    const point = {
      color: data.data.color,
      label: data.data.label,
      value: data.data.value,
    };
    config.onMove && config.onMove('move', [point], { x: position[0] + width / 2, y: position[1] + height / 2 });
  }

  function leaved(this: any, event) {
    const pie = d3.select(this);
    pie.style('transform', 'none');
    if (config.mouse.shadow) {
      pie.attr('filter', 'none');
    }
    config.onMove && config.onMove('leave');
  }

  const clear = () => {
    pieEle.selectAll('path').on('.');
  };

  this.clear = clear;
}
