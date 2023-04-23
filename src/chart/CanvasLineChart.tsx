import React, { useContext, useEffect, useRef, useState } from 'react';
import { ConfigContext, mouseMoves } from '..';
import { DrawXAixs, DrawYAixs } from '../toolkit/level2/axis';
import { DrawAreaLine, DrawLine } from '../toolkit/level2/line';
import LineMove from '../toolkit/level2/linemove';

const setCanvasSize = (canvas, width, height) => {
  const scale = window.devicePixelRatio || 1;
  canvas.width = width * scale;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.height = height * scale;
};

function LineChart({ data, id, subscription, type }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const config = useContext(ConfigContext);
  const [chartConfig, setChartConfig] = useState(config);

  useEffect(() => {
    const box = document.querySelector(`.${id}`);
    setTimeout(() => {
      const w = box ? Number(getComputedStyle(box).width.slice(0, -2)) : undefined;
      if (w !== undefined) {
        setChartConfig(Object.assign({}, chartConfig, { width: w }));
        if (canvasRef.current) {
          setCanvasSize(canvasRef.current, w, chartConfig.height);
        }
      }
    }, 1);

    const unsub = subscription.subscribe(() => {
      const box = document.querySelector(`.${id}`);
      const w = box ? Number(getComputedStyle(box).width.slice(0, -2)) : undefined;
      if (w !== undefined) {
        setChartConfig(Object.assign({}, chartConfig, { width: w }));
        if (canvasRef.current) {
          setCanvasSize(canvasRef.current, w, chartConfig.height);
        }
      }
    });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    let lineMove;
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
        lineMove = new LineMove(canvasRef.current, canvas, chartConfig, data, xAixs, yAixs);
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
      return () => {
        window.cancelAnimationFrame(myReq);
        lineMove && lineMove.clear && lineMove.clear();
      };
    }
  }, [chartConfig, canvasRef.current, data]);

  return <canvas ref={canvasRef} width="100%"></canvas>;
}

export default LineChart;
