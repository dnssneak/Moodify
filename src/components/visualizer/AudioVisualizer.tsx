import React, { useEffect, useRef } from 'react';
import { audioService } from '../../services/audioService';

interface AudioVisualizerProps {
  mode?: 'bars' | 'circular' | 'particles';
  width?: number;
  height?: number;
  barColor?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  mode = 'bars',
  width = 300,
  height = 80,
  barColor = '#a855f7',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const bufferLength = 32;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animId = requestAnimationFrame(render);
      audioService.getFrequencyData(dataArray);

      ctx.clearRect(0, 0, width, height);

      if (mode === 'bars') {
        const barWidth = (width / bufferLength) * 1.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height * 0.85;

          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, barColor);
          gradient.addColorStop(1, '#06b6d4');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, height - barHeight, barWidth - 3, barHeight + 2, [3, 3, 0, 0]);
          ctx.fill();

          x += barWidth;
        }
      } else if (mode === 'circular') {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) * 0.6;

        ctx.strokeStyle = barColor;
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let i = 0; i < bufferLength; i++) {
          const angle = (i / bufferLength) * Math.PI * 2;
          const amp = (dataArray[i] / 255) * 20;
          const r = radius + amp;
          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      } else {
        // Waveform mode
        ctx.lineWidth = 2;
        ctx.strokeStyle = barColor;
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [mode, width, height, barColor]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg opacity-90 transition-opacity hover:opacity-100"
    />
  );
};
