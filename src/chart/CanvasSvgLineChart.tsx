import React, { useContext, useEffect, useRef, useState } from 'react';
import { ConfigContext, mouseMoves } from '..';
import { DrawXAixs, DrawYAixs } from '../toolkit/level2/axis';
import { DrawBrush } from '../toolkit/level3/brush';
import { DrawAreaLine, DrawLine } from '../toolkit/level2/line';
import LineMove from '../toolkit/level3/linemove';
import * as d3 from 'd3';

const setCanvasSize = (canvas, width, height) => {
  const scale = window.devicePixelRatio || 1;
  canvas.width = width * scale;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.height = height * scale;
};

function LineChart({ data, id, subscription, type }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const config = useContext(ConfigContext);
  const [chartConfig, setChartConfig] = useState(config);

  const setSize = w => {
    if (canvasRef.current) {
      setCanvasSize(canvasRef.current, w, chartConfig.height);
    }
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.attr('width', w);
      svg.attr('height', chartConfig.height);
    }
  };

  useEffect(() => {
    const box = document.querySelector(`.${id}`);
    setTimeout(() => {
      const w = box ? Number(getComputedStyle(box).width.slice(0, -2)) : undefined;
      if (w !== undefined) {
        setChartConfig(Object.assign({}, chartConfig, { width: w }));
        setSize(w);
      }
    }, 1);

    const unsub = subscription.subscribe(() => {
      const box = document.querySelector(`.${id}`);
      const w = box ? Number(getComputedStyle(box).width.slice(0, -2)) : undefined;
      if (w !== undefined) {
        setChartConfig(Object.assign({}, chartConfig, { width: w }));
        setSize(w);
      }
    });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    let lineMove;
    let brush;
    if (chartConfig.width != undefined && canvasRef.current != null) {
      let line;
      const canvas = new OffscreenCanvas(canvasRef.current.width, canvasRef.current.height);
      const yAixs = new DrawYAixs(canvas, chartConfig, data);
      const xAixs = new DrawXAixs(canvas, chartConfig, data);

      if (type === 'arealine') {
        line = new DrawAreaLine(canvas, chartConfig, data, xAixs, yAixs);
      } else if (type === 'line') {
        line = new DrawLine(canvas, chartConfig, data, xAixs, yAixs);
      }
      if (chartConfig.mouse) {
        lineMove = new LineMove(svgRef.current, canvasRef.current, canvas, chartConfig, data, xAixs, yAixs);
        mouseMoves.push(lineMove);
      }

      let myReq;
      const reDraw = () => {
        if (canvas && canvasRef.current != null) {
          const context = canvasRef.current.getContext('bitmaprenderer');

          yAixs && yAixs.draw && yAixs.draw();
          xAixs && xAixs.draw && xAixs.draw();
          line && line.draw && line.draw();
          lineMove && lineMove.draw && lineMove.draw();

          const bitmapOne = canvas.transferToImageBitmap();
          context.transferFromImageBitmap(bitmapOne);
          myReq = window.requestAnimationFrame(reDraw);
        }
      };

      myReq = window.requestAnimationFrame(reDraw);
      if (chartConfig.select) {
        brush = new DrawBrush(svgRef.current, chartConfig, data, line, xAixs, yAixs);
      }
      return () => {
        window.cancelAnimationFrame(myReq);
        lineMove && lineMove.clear && lineMove.clear();
        brush && brush.clear && brush.clear();
      };
    }
  }, [chartConfig, canvasRef.current, data]);

  return (
    <>
      <canvas ref={canvasRef} width="100%"></canvas>
      <svg style={{ position: 'absolute', left: 0, top: 0 }} ref={svgRef} preserveAspectRatio="xMinYMin meet"></svg>
    </>
  );
}

export default LineChart;
