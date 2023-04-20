import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ConfigContext, mouseMoves } from '..';
import { DrawXAixs, DrawYAixs } from '../toolkit/canvas_axis';
import { DrawBrush } from '../toolkit/brush';
import { drawClipPath } from '../toolkit/clip';
import { DrawAreaLine, DrawLine } from '../toolkit/canvas_line';
import LineMove from '../toolkit//canvas_linemove';
import { DrawPoint } from '../toolkit/point';

const setCanvasSize = (canvas, width, height) => {
  const scale = window.devicePixelRatio || 1;
  canvas.width = width * scale;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.height = height * scale;
};

const setOffscreenCanvasSize = canvas => {
  const scale = window.devicePixelRatio || 1;
  canvas.getContext('2d').scale(scale, scale);
};

function LineChart({ data, id, subscription, type }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const config = useContext(ConfigContext);
  const [chartConfig, setChartConfig] = useState(config);

  useEffect(() => {
    console.log(1111);
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
      // const canvas = canvasRef.current.transferControlToOffscreen();
      // setOffscreenCanvasSize(canvas);
      const yAixs = new DrawYAixs(canvas, chartConfig, data);
      const xAixs = new DrawXAixs(canvas, chartConfig, data);

      if (type === 'arealine') {
        // line = new DrawAreaLine(svgRef.current, chartConfig, data, xAixs, yAixs);
      } else if (type === 'line') {
        line = new DrawLine(canvas, chartConfig, data, xAixs, yAixs);
      } else if (type === 'scatter') {
        // line = new DrawPoint(svgRef.current, chartConfig, data, xAixs, yAixs);
      }
      //   drawClipPath(svgRef.current, chartConfig);
      if (chartConfig.mouse) {
        lineMove = new LineMove(canvasRef.current, canvas, chartConfig, data, xAixs, yAixs);
        //     mouseMoves.push(lineMove);
      }

      let myReq;
      const reDraw = () => {
        if (canvas) {
          const context = canvasRef.current.getContext('bitmaprenderer');
          // context.clearRect(0, 0, canvas.width, canvas.height);

          yAixs.draw();
          xAixs.draw();
          line.draw();
          lineMove.draw();

          const bitmapOne = canvas.transferToImageBitmap();
          context.transferFromImageBitmap(bitmapOne);
          myReq = window.requestAnimationFrame(reDraw);
        }
      };

      myReq = window.requestAnimationFrame(reDraw);
      //   if (chartConfig.select) {
      //     brush = new DrawBrush(svgRef.current, chartConfig, data, line, xAixs, yAixs);
      //   }
      // }
      return () => {
        window.cancelAnimationFrame(myReq);
        // lineMove && lineMove.clear && lineMove.clear();
        // brush && brush.clear && brush.clear();
      };
    }
  }, [chartConfig, canvasRef.current, data]);

  return <canvas ref={canvasRef} width="100%"></canvas>;
}

export default LineChart;
