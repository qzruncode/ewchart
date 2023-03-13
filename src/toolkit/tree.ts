import * as d3 from 'd3';
import { v4 } from 'uuid';
import { IEWChartProps, EWChartTreeData } from '../../types';

const linkBg = '#000';
const iconSize = 8;
const rectWidth = 100;
const rectHeight = 55;
const iconBg = '#ccc';
const spanNum = 3;
const userDeepNum = 1;

export function drawTree(this: any, svg, config, data: IEWChartProps['data'], subscription) {
  const { width, height } = config;
  const svgEle = d3.select(svg);
  svgEle.attr('viewBox', [-width / 2, -rectHeight - 20, width, height]);
  let treeEle: any = svgEle.select('g.tree_box');
  if (treeEle.empty()) {
    treeEle = svgEle.append('g').attr('class', 'tree_box');
  }
  const treeData = data.treeData;
  // const treeData = deepClone(data.treeData);
  addUniqueKey(treeData);
  console.log('执行了', treeData);
  const tree = d3.hierarchy(treeData);
  const treeLayout = d3.tree().nodeSize([120, 150])(tree);
  drawLinks(treeEle, treeLayout, config);
  const res = drawNodes(treeEle, treeLayout, subscription);

  return {
    nodeEles: res.nodeEles,
    clear: res.clear,
    redrawLinks: config => drawLinks(treeEle, treeLayout, config),
    expand: config => reExpand(treeEle, subscription, config),
  };
}

function drawLinks(treeEle, treeLayout, config) {
  let linkEle: any = treeEle.select('g.link_ele');
  if (linkEle.empty()) {
    linkEle = treeEle
      .append('g')
      .attr('class', 'link_ele')
      .attr('fill', 'none')
      .attr('stroke', linkBg)
      .attr('stroke-width', 1.5);
  }
  const links = treeLayout.links();
  const linkPath = linkEle.selectAll('path.link').data(links).join('path').attr('class', 'link');
  if (config.lineType === 'linkBroken') {
    linkPath.attr('d', linkBroken);
  } else if (config.lineType === 'linkStraight') {
    linkPath.attr('d', linkStraight);
  } else {
    linkPath.attr('d', linkBezierCurve);
  }
}

function drawNodes(treeEle, treeLayout, subscription) {
  let nodeEle: any = treeEle.select('g.node_ele');
  if (nodeEle.empty()) {
    nodeEle = treeEle.append('g').attr('class', 'node_ele');
  }
  const nodes = treeLayout.descendants();
  nodeEle.selectAll('g.node').remove();
  const nodeEles = nodeEle
    .selectAll('g.node')
    .data(nodes)
    .join('g')
    .attr('class', 'node')
    .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
  const nodeContent = nodeEles.append('g').attr('class', 'node_content');
  const nodeBox = nodeContent.append('g').attr('class', 'node_box');
  const nodeExtra = nodeContent.append('g').attr('class', 'node_extra');
  nodeBox
    .append('rect')
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('filter', 'url(#fds)')
    .attr('stroke', 'black')
    .attr('stroke-width', '0.5')
    .attr('fill', d => (d.data.error ? 'pink' : 'white'))
    .attr('width', rectWidth)
    .attr('height', rectHeight)
    .attr('x', -50)
    .attr('y', -55)
    .html(d =>
      d.data.error
        ? `<animate attributeName="fill" dur="2s" calcMode="linear" repeatCount="indefinite"
    values="pink ; ${d3.color('red').darker(0.5)} ; pink" 
    keyTimes="0 ; 0.5 ; 1" />`
        : ''
    );

  drawNodeName(nodeBox);
  drawNodeHead(nodeExtra);
  drawNodeBottom(nodeExtra);
  const deepIconClear = drawNodeDeepIcon(treeEle, nodeExtra, subscription);
  drawNodeSpanIcon(treeEle, subscription);
  const clear = () => {
    deepIconClear();
  };
  return {
    nodeEles,
    clear,
  };
}

function drawNodeDeepIcon(treeEle, nodeExtra, subscription) {
  const { minus, plus } = new IconPath();
  const expandIcon = nodeExtra
    .filter(d => d.data.children || d.data._children)
    .append('g')
    .attr('class', 'nodeicon_deep')
    .style('cursor', 'pointer')
    .attr('fill', 'none')
    .attr('stroke', iconBg)
    .attr('stroke-opacity', 1)
    .attr('stroke-width', 1.5);
  const o = expandIcon.append('path');
  o.attr('transform', 'translate(' + 0 + ',' + iconSize + ')').attr('d', d =>
    d.data.children && !d.data._children ? minus : plus
  );
  expandIcon
    .append('circle')
    .attr('cx', 0)
    .attr('cy', iconSize)
    .attr('r', iconSize)
    .attr('fill', iconBg)
    .attr('opacity', 0.4)
    .on('click', function (this: any, e, d) {
      treeEle.select('g.node_tooltip').remove();
      if (d.data.children || d.data._children) {
        if (d.data.children) {
          d.data._children = d.data.children;
          d.data.children = null;
          o.attr('d', plus);
        } else {
          d.data.children = d.data._children;
          d.data._children = null;
          o.attr('d', minus);
        }
        subscription.publish();
      }
    });
  return () => expandIcon.on('.');
}

function drawNodeSpanIcon(treeEle, subscription) {
  const { minus, plus } = new IconPath();
  const needExpands = treeEle.selectAll('g.node').filter((d: any) => {
    if (d.parent && d.parent.data.originChildren && d.parent.data.originChildren.length > spanNum) {
      if (d.parent.data.children[d.parent.data.children.length - 1] === d.data) {
        return true;
      }
    }
    return false;
  });

  const expandIcon = needExpands
    .append('g')
    .attr('class', 'nodeicon_span')
    .style('cursor', 'pointer')
    .attr('fill', 'none')
    .attr('stroke', iconBg)
    .attr('stroke-opacity', 1)
    .attr('stroke-width', 1.5);

  const nodeWidth = rectWidth + 20;
  const nodeHeight = rectHeight + 10;
  expandIcon
    .append('rect')
    .attr('transform', function (d: any) {
      const [minX, maxX] = d3.extent(d.parent.children, (d: any) => d.x) as Array<any>;
      return 'translate(' + -(maxX - minX + nodeWidth / 2) + ',' + -nodeHeight + ')';
    })
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('stroke-dasharray', '5,5')
    .attr('width', (d: any) => {
      const [minX, maxX] = d3.extent(d.parent.children, (d: any) => d.x) as Array<any>;
      return maxX - minX + nodeWidth;
    })
    .attr('height', nodeHeight + 10);

  expandIcon
    .append('path')
    .attr('transform', 'translate(' + (rectWidth / 2 + iconSize + 10) + ',' + -rectHeight / 2 + ')')
    .attr('d', (d: any) => (d.parent.data.children.length === d.parent.data.originChildren.length ? minus : plus));
  expandIcon
    .append('circle')
    .attr('cx', 0)
    .attr('cy', iconSize)
    .attr('r', iconSize)
    .attr('transform', 'translate(' + (rectWidth / 2 + iconSize + 10) + ',' + (-rectHeight / 2 - iconSize) + ')')
    .attr('fill', iconBg)
    .attr('opacity', 0.4)
    .on('click', function (this: any, e, d: any) {
      treeEle.select('g.node_tooltip').remove();
      d3.select(this.parentElement).remove();
      if (d.parent.data.children.length === d.parent.data.originChildren.length) {
        d.parent.data.children = d.parent.data.originChildren.slice(0, spanNum);
      } else {
        d.parent.data.children = [...d.parent.data.originChildren];
      }
      subscription.publish();
    });
}

function drawNodeName(nodeBox) {
  const textEle = nodeBox.append('text');
  textEle
    .style('cursor', 'pointer')
    .attr('dy', '0.31em')
    .attr('y', -25)
    .attr('text-anchor', 'middle')
    .text(d => d.data.name)
    .attr('stroke', 'none')
    .attr('fill', 'black')
    .on('click', e => {
      // const eleData = d3.select(e.target).data();
      // if (eleData && eleData[0]) {
      //   const data = eleData[0].data;
      //   this.extraCallback.click(`${data.reqId}$$${data.rpcId}`);
      // }
    })
    .call(texts => {
      texts.each(function (this: any) {
        const text = d3.select(this);
        const { width } = this.getBBox();
        if (width > rectWidth) {
          const sliceWidth = rectWidth * 0.8;
          const originLength = text.text().length;
          const sliceLength = originLength / (width / sliceWidth) - 3;
          const sliceText = text.text().slice(0, sliceLength) + '...';
          text.attr('ot', text.text());
          text.attr('st', sliceText);
          text.text(sliceText);
        }
      });
    });
}

function drawNodeHead(nodeExtra) {
  const nodeHeadEle = nodeExtra.append('g').attr('class', 'node_head');
  nodeHeadEle
    .selectAll('g.node_head')
    .data(d => d.data.head)
    .join('g')
    .html(d => d)
    .call(ele => {
      const { width } = ele.node().getBBox();
      ele.attr('transform', (d, i) => `translate(-${rectWidth / 2 - (width + 2) * i}, -${rectHeight})`);
    });
}

function drawNodeBottom(nodeExtra) {
  const nodeBottomEle = nodeExtra.append('g').attr('class', 'node_bottom');
  nodeBottomEle
    .selectAll('g.node_head')
    .data(d => d.data.bottom)
    .join('g')
    .html(d => d)
    .call(ele => {
      const { width, height } = ele.node().getBBox();
      ele.attr('transform', (d, i) => `translate(-${rectWidth / 2 - (width + 2) * i}, ${-height})`);
    });
}

function IconPath(this: any) {
  let plus = '';
  let minus = '';
  {
    const path = d3.path();
    path.moveTo(-iconSize, 0);
    path.lineTo(iconSize, 0);
    path.moveTo(0, iconSize);
    path.lineTo(0, -iconSize);
    plus = path.toString();
  }

  {
    const path = d3.path();
    path.moveTo(-iconSize, 0);
    path.lineTo(iconSize, 0);
    minus = path.toString();
  }

  this.minus = minus;
  this.plus = plus;
}

function linkBezierCurve(d) {
  const x0 = d.source.x,
    y0 = d.source.y + iconSize * 2,
    x1 = d.target.x,
    y1 = d.target.y - 55,
    r = y1 - y0;

  const path = d3.path();
  path.moveTo(x0, y0);
  path.bezierCurveTo(x0, y0 + r / 2, x1, y0 + r / 2, x1, y1);

  return path.toString();
}

function linkStraight(d) {
  const path = d3.path();
  const x0 = d.source.x,
    y0 = d.source.y + iconSize * 2,
    x1 = d.target.x,
    y1 = d.target.y - 55;

  path.moveTo(x0, y0);
  path.lineTo(x1, y1);
  return path.toString();
}

function linkBroken(d) {
  const path = d3.path();
  const x0 = d.source.x,
    y0 = d.source.y + iconSize * 2,
    x1 = d.target.x,
    y1 = d.target.y - 55;

  const yOffset = y1 - y0;
  // 父节点，连接最左边的节点 和 最右边的节点
  const first = d.source.children[0];
  const last = d.source.children[d.source.children.length - 1];
  if (!d.source.childLine) {
    if (first !== last) {
      d.source.childLine = true; // 已经画了就不再画
      path.moveTo(x0, y0);
      path.lineTo(x0, y0 + yOffset / 3); // 画竖线
      const first_x = first.x;
      path.lineTo(first_x, y0 + yOffset / 3); // 画左横线
      path.moveTo(x0, y0 + yOffset / 3);
      const last_x = last.x;
      path.lineTo(last_x, y0 + yOffset / 3); // 画右横线
    } else {
      d.source.childLine = true;
      path.moveTo(x0, y0);
      path.lineTo(x0, y0 + yOffset / 3); // 画竖线
    }
  }
  path.moveTo(x1, y1 - (yOffset * 2) / 3);
  path.lineTo(x1, y1); // 连接父横线
  delete d.source.childLine;
  return path.toString();
}

function reExpand(treeEle, subscription, config) {
  const { minus } = new IconPath();
  if (config.expand === 'span') {
    treeEle.select('g.node_tooltip').remove();
    treeEle.selectAll('g.nodeicon_span').remove();

    treeEle.selectAll('g.node').each(function (this: any, d) {
      if (d.parent && d.parent.data.originChildren) {
        d.parent.data.children = [...d.parent.data.originChildren];
      }
    });
    subscription.publish();
  } else if (config.expand === 'deep') {
    treeEle.select('g.node_tooltip').remove();
    treeEle.selectAll('g.node').each(function (this: any, d) {
      if (!d.data.children && d.data._children) {
        d.data.children = d.data._children;
        d.data._children = null;
        d3.select(this).select('.nodeicon_deep path').attr('d', minus);
      }
    });
    subscription.publish();
  } else if (config.expand === 'all') {
    treeEle.select('g.node_tooltip').remove();
    treeEle.selectAll('g.nodeicon_span').remove();
    treeEle.selectAll('g.nodeicon_deep').remove();
    treeEle.selectAll('g.node').each(function (this: any, d) {
      if (d.data.children || d.data._children) {
        if (!d.data.children && d.data._children) {
          d.data.children = d.data._children;
          d.data._children = null;
        }

        if (d.data.originChildren && d.data.children.length < d.data.originChildren.length) {
          d.data.children = [...d.data.originChildren];
        }
      }
    });
    subscription.publish();
  }
}

function deepClone(data: EWChartTreeData | undefined) {
  let newData;
  if (data) {
    newData = Object.assign({}, data);
    const keys = Object.keys(newData);
    for (const key of keys) {
      const value = newData[key];
      if (key === 'children' && value != undefined) {
        newData[key] = value.map(d => deepClone(d));
      } else {
        if (Array.isArray(value)) {
          newData[key] = [...value];
        } else {
          newData[key] = value;
        }
      }
    }
    return newData;
  }

  return null;
}

function addUniqueKey(rootNode) {
  rootNode.deepNum = 0;
  const queue = [rootNode];
  let deepNum = 0;
  while (queue.length !== 0) {
    const node = queue.pop();
    if (node.originChildren != null) return;
    node._key = v4();
    if (node.deepNum !== undefined) {
      deepNum = node.deepNum;
    }
    if (node.children) {
      ++deepNum;
      node.children.forEach(child => {
        child.deepNum = deepNum;
      });
      queue.push(...node.children);
      node.originChildren = node.children;
      if (node.children.length > spanNum) {
        node.children = node.children.slice(0, spanNum);
      }
      if (deepNum > userDeepNum) {
        node._children = node.children;
        node.children = null;
      }
    }
  }
  return rootNode;
}
