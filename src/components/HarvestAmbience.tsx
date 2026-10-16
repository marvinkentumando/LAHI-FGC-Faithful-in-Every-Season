import React, { useEffect, useRef } from 'react';

interface HarvestAmbienceProps {
  active: boolean;
}

interface Leaf {
  x: number;
  y: number;
  size: number;
  speedY: number;
  swaySpeed: number;
  swayAmplitude: number;
  swayOffset: number;
  rotation: number;
  rotSpeed: number;
  flip: number;
  flipSpeed: number;
  color: string;
  stemColor: string;
  opacity: number;
  leafType: 'maple' | 'birch' | 'willow';
}

interface WarmParticle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  alpha: number;
  maxAlpha: number;
  pulseSpeed: number;
  pulseOffset: number;
}

export const HarvestAmbience: React.FC<HarvestAmbienceProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Warm autumn color palette
    const leafColors = [
      { fill: '#f59e0b', stem: '#b45309' }, // Harvest Gold
      { fill: '#d97706', stem: '#92400e' }, // Warm Amber
      { fill: '#fbbf24', stem: '#d97706' }, // Sunlit Honey
      { fill: '#ea580c', stem: '#9a3412' }, // Autumn Russet
      { fill: '#b91c1c', stem: '#7f1d1d' }, // Sacred Crimson Ochre
    ];

    const leafTypes: Array<'maple' | 'birch' | 'willow'> = ['maple', 'birch', 'willow'];

    // Initialize graceful drifting leaves (subtle count: 20 leaves across the screen)
    const leaves: Leaf[] = Array.from({ length: 22 }, () => {
      const palette = leafColors[Math.floor(Math.random() * leafColors.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: 14 + Math.random() * 14, // 14px - 28px
        speedY: 0.35 + Math.random() * 0.45,
        swaySpeed: 0.008 + Math.random() * 0.012,
        swayAmplitude: 25 + Math.random() * 35,
        swayOffset: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.01 + Math.random() * 0.02,
        color: palette.fill,
        stemColor: palette.stem,
        opacity: 0.4 + Math.random() * 0.35, // 0.4 - 0.75 opacity for delicate elegance
        leafType: leafTypes[Math.floor(Math.random() * leafTypes.length)],
      };
    });

    // Initialize warm glowing sunbeam particles (soft drifting golden bokeh)
    const particles: WarmParticle[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 2 + Math.random() * 5,
      speedY: -(0.15 + Math.random() * 0.25), // Gently drift upwards like warm sun motes
      speedX: (Math.random() - 0.5) * 0.2,
      alpha: 0.2 + Math.random() * 0.3,
      maxAlpha: 0.35 + Math.random() * 0.35,
      pulseSpeed: 0.015 + Math.random() * 0.025,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    // Draw functions for different leaf silhouettes
    const drawMapleLeaf = (context: CanvasRenderingContext2D, size: number) => {
      const s = size / 20;
      context.beginPath();
      context.moveTo(0, s * 10);
      context.lineTo(0, s * 14); // stem
      context.moveTo(0, s * 10);
      // Left lobe
      context.bezierCurveTo(-s * 5, s * 8, -s * 10, s * 5, -s * 12, 0);
      context.lineTo(-s * 7, -s * 2);
      context.bezierCurveTo(-s * 10, -s * 6, -s * 8, -s * 10, -s * 4, -s * 8);
      // Top central lobe
      context.lineTo(-s * 2, -s * 6);
      context.bezierCurveTo(-s * 3, -s * 12, 0, -s * 15, 0, -s * 16);
      context.bezierCurveTo(0, -s * 15, s * 3, -s * 12, s * 2, -s * 6);
      // Right lobe
      context.lineTo(s * 4, -s * 8);
      context.bezierCurveTo(s * 8, -s * 10, s * 10, -s * 6, s * 7, -s * 2);
      context.lineTo(s * 12, 0);
      context.bezierCurveTo(s * 10, s * 5, s * 5, s * 8, 0, s * 10);
      context.closePath();
    };

    const drawBirchLeaf = (context: CanvasRenderingContext2D, size: number) => {
      const s = size / 20;
      context.beginPath();
      context.moveTo(0, s * 12);
      context.lineTo(0, s * 15); // stem
      context.moveTo(0, s * 12);
      context.bezierCurveTo(-s * 8, s * 8, -s * 9, -s * 4, 0, -s * 15);
      context.bezierCurveTo(s * 9, -s * 4, s * 8, s * 8, 0, s * 12);
      context.closePath();
    };

    const drawWillowLeaf = (context: CanvasRenderingContext2D, size: number) => {
      const s = size / 20;
      context.beginPath();
      context.moveTo(0, s * 14);
      context.lineTo(0, s * 17); // stem
      context.moveTo(0, s * 14);
      context.quadraticCurveTo(-s * 5, 0, 0, -s * 18);
      context.quadraticCurveTo(s * 5, 0, 0, s * 14);
      context.closePath();
    };

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Render warm light motes / golden sunlight bokeh
      for (const p of particles) {
        if (active) {
          p.y += p.speedY;
          p.x += p.speedX;

          // Wrap particles
          if (p.y < -20) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
        }

        const currentAlpha =
          p.maxAlpha * (0.6 + 0.4 * Math.sin(tick * p.pulseSpeed + p.pulseOffset));

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        gradient.addColorStop(0, `rgba(253, 230, 138, ${currentAlpha.toFixed(3)})`);
        gradient.addColorStop(0.5, `rgba(251, 191, 36, ${(currentAlpha * 0.5).toFixed(3)})`);
        gradient.addColorStop(1, 'rgba(251, 191, 36, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Render delicate drifting golden leaves
      for (const leaf of leaves) {
        if (active) {
          leaf.y += leaf.speedY;
          leaf.rotation += leaf.rotSpeed;
          leaf.flip += leaf.flipSpeed;

          // Wrap leaves to top once they exit viewport bottom
          if (leaf.y > height + 40) {
            leaf.y = -30;
            leaf.x = Math.random() * width;
          }
        }

        const currentX =
          leaf.x + Math.sin(tick * leaf.swaySpeed + leaf.swayOffset) * leaf.swayAmplitude;
        const scaleX = Math.cos(leaf.flip); // Natural 3D fluttering tumbling effect

        ctx.save();
        ctx.translate(currentX, leaf.y);
        ctx.rotate(leaf.rotation);
        ctx.scale(scaleX, 1);
        ctx.globalAlpha = leaf.opacity;

        // Draw leaf body
        ctx.fillStyle = leaf.color;
        if (leaf.leafType === 'maple') {
          drawMapleLeaf(ctx, leaf.size);
        } else if (leaf.leafType === 'birch') {
          drawBirchLeaf(ctx, leaf.size);
        } else {
          drawWillowLeaf(ctx, leaf.size);
        }
        ctx.fill();

        // Delicate central vein
        ctx.strokeStyle = leaf.stemColor;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, leaf.size * 0.55);
        ctx.lineTo(0, -leaf.size * 0.65);
        ctx.stroke();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-20 transition-opacity duration-1000 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    />
  );
};
