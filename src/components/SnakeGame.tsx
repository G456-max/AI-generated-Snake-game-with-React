import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { Trophy, Gamepad2 } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const snakeRef = useRef<Point[]>(snake);
  const foodRef = useRef<Point>(food);
  const directionRef = useRef<Point>(direction);
  const isGameOverRef = useRef<boolean>(isGameOver);
  const isPausedRef = useRef<boolean>(isPaused);

  useEffect(() => {
    snakeRef.current = snake;
    foodRef.current = food;
    directionRef.current = direction;
    isGameOverRef.current = isGameOver;
    isPausedRef.current = isPaused;
  }, [snake, food, direction, isGameOver, isPaused]);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const moveSnake = () => {
      if (isGameOverRef.current || isPausedRef.current) return;

      const prevSnake = snakeRef.current;
      const head = prevSnake[0];
      const dir = directionRef.current;
      
      const newHead = {
        x: (head.x + dir.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + dir.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [generateFood]); // Stable interval

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const cellSize = canvas.width / GRID_SIZE;
      const currentSnake = snakeRef.current;
      const currentFood = foodRef.current;

      // Clear canvas with "ghosting" effect for trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
      }

      // Draw food with pulsing glow
      const pulse = Math.sin(Date.now() / 150) * 4 + 12;
      ctx.fillStyle = '#ff00ff';
      ctx.shadowBlur = pulse;
      ctx.shadowColor = '#ff00ff';
      ctx.beginPath();
      ctx.arc(
        currentFood.x * cellSize + cellSize / 2,
        currentFood.y * cellSize + cellSize / 2,
        cellSize / 3.5,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw snake with glowing trail
      currentSnake.forEach((segment, index) => {
        const alpha = 1 - (index / currentSnake.length) * 0.8;
        const sizeReduction = (index / currentSnake.length) * 6;
        
        ctx.shadowBlur = index === 0 ? 15 : 5;
        ctx.shadowColor = '#00ffff';
        ctx.fillStyle = index === 0 ? '#00ffff' : `rgba(0, 255, 255, ${alpha})`;
        
        ctx.fillRect(
          segment.x * cellSize + 1 + sizeReduction / 2,
          segment.y * cellSize + 1 + sizeReduction / 2,
          cellSize - 2 - sizeReduction,
          cellSize - 2 - sizeReduction
        );
      });

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Stable loop

  return (
    <div className="relative flex flex-col items-center gap-6">
      <div className="relative border-4 border-cyan-400 bg-black shadow-[8px_8px_0px_#ff00ff]">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="block"
        />
        
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center backdrop-blur-md">
            {isGameOver ? (
              <div className="text-center p-8 border-4 border-magenta-500 bg-black shadow-[8px_8px_0px_#00ffff] animate-glitch-heavy">
                <h2 className="text-3xl font-pixel text-magenta-500 mb-4 tracking-tighter">GAME_CRASHED</h2>
                <p className="text-cyan-400 font-silk mb-8 tracking-widest uppercase">HARVESTED_DATA: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-10 py-4 bg-cyan-400 text-black font-pixel text-sm hover:bg-white transition-all shadow-[4px_4px_0px_#ff00ff] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  REBOOT_SYSTEM
                </button>
              </div>
            ) : (
              <div className="text-center p-8 border-4 border-cyan-400 bg-black shadow-[8px_8px_0px_#ff00ff]">
                <h2 className="text-4xl font-pixel text-cyan-400 mb-10 animate-glitch-heavy tracking-tighter">HALTED</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-10 py-4 bg-magenta-500 text-black font-pixel text-sm hover:bg-white transition-all shadow-[4px_4px_0px_#00ffff] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  RESUME_PROCESS
                </button>
                <p className="mt-8 text-magenta-500/50 font-silk text-[8px] tracking-[0.4em] uppercase">INPUT_REQUIRED: [SPACE]</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex gap-16 text-sm uppercase mt-4">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3 text-cyan-400">
            <Trophy size={16} />
            <span className="text-[10px] font-pixel tracking-widest">HARVEST</span>
          </div>
          <span className="text-3xl font-pixel text-white animate-glitch-heavy">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3 text-magenta-500">
            <Gamepad2 size={16} />
            <span className="text-[10px] font-pixel tracking-widest">INPUT</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-magenta-500 font-pixel text-lg tracking-tighter">
              ARROWS
            </span>
            <span className="text-[8px] text-cyan-400/50 font-silk tracking-widest mt-1">TO_NAVIGATE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
