import { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

type GameState = 'waiting' | 'running' | 'crashed';

function generateCrashPoint(): number {
  const r = Math.random();
  if (r < 0.45) return +(1 + Math.random() * 0.5).toFixed(2);
  if (r < 0.70) return +(1.5 + Math.random() * 0.8).toFixed(2);
  if (r < 0.85) return +(2.3 + Math.random() * 1.7).toFixed(2);
  if (r < 0.95) return +(4 + Math.random() * 6).toFixed(2);
  return +(10 + Math.random() * 40).toFixed(2);
}

function historyColor(v: number) {
  if (v < 2) return { bg: 'rgba(255,63,91,0.15)', text: '#ff3f5b' };
  if (v < 5) return { bg: 'rgba(90,194,90,0.15)', text: '#5ac25a' };
  return { bg: 'rgba(252,138,55,0.18)', text: '#fc8a37' };
}

export default function CrashGame() {
  const { balance, deductBalance, addBalance } = useStore();
  const [betAmount, setBetAmount] = useState(50);
  const [state, setState] = useState<GameState>('waiting');
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState(1.5);
  const [betPlaced, setBetPlaced] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [history, setHistory] = useState<number[]>([3.21, 1.45, 7.82, 1.12, 2.34, 15.6, 1.03, 4.77]);
  const [winAmount, setWinAmount] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; vx: number; vy: number; life: number; color: string }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const multipliersRef = useRef<number[]>([]);
  const stateRef = useRef<GameState>('waiting');
  const multiplierRef = useRef(1.0);
  const animRef = useRef<number>(0);
  const particleIdRef = useRef(0);

  stateRef.current = state;
  multiplierRef.current = multiplier;

  const clearAll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    cancelAnimationFrame(animRef.current);
  };

  // Canvas draw
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#111213';
    ctx.fillRect(0, 0, W, H);

    const pts = multipliersRef.current;
    const crashed = stateRef.current === 'crashed';
    const waiting = stateRef.current === 'waiting';

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (H / 4) * i);
      ctx.lineTo(W, (H / 4) * i);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo((W / 4) * i, 0);
      ctx.lineTo((W / 4) * i, H);
      ctx.stroke();
    }

    if (waiting || pts.length < 2) {
      // Idle state — subtle pulse ring
      const cx = W / 2, cy = H / 2;
      const pulse = (Date.now() % 2000) / 2000;
      const r1 = 30 + pulse * 20;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r1);
      g.addColorStop(0, 'rgba(252,138,55,0.25)');
      g.addColorStop(1, 'rgba(252,138,55,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r1, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    // Clamp curve to canvas
    const maxM = Math.max(...pts, 1.5);
    const toX = (i: number) => (i / (pts.length - 1)) * (W - 40) + 20;
    const toY = (m: number) => H - 20 - ((m - 1) / (maxM - 1 + 0.001)) * (H - 50);

    // Line color
    const lineColor = crashed ? '#ff3f5b' : '#fc8a37';
    const glowColor = crashed ? 'rgba(255,63,91,0.5)' : 'rgba(252,138,55,0.5)';

    // Glow fill under curve
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    if (crashed) {
      grad.addColorStop(0, 'rgba(255,63,91,0.18)');
      grad.addColorStop(1, 'rgba(255,63,91,0.0)');
    } else {
      grad.addColorStop(0, 'rgba(252,138,55,0.22)');
      grad.addColorStop(1, 'rgba(252,138,55,0.0)');
    }

    ctx.beginPath();
    ctx.moveTo(toX(0), H - 20);
    pts.forEach((m, i) => ctx.lineTo(toX(i), toY(m)));
    ctx.lineTo(toX(pts.length - 1), H - 20);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Glow stroke (thick, blurred)
    ctx.save();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(pts[0]));
    pts.forEach((m, i) => { if (i > 0) ctx.lineTo(toX(i), toY(m)); });
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3.5;
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();

    // Moving dot at tip
    if (!crashed && pts.length > 0) {
      const tx = toX(pts.length - 1);
      const ty = toY(pts[pts.length - 1]);
      // Outer ring
      const t = (Date.now() % 800) / 800;
      const ringR = 10 + t * 8;
      ctx.beginPath();
      ctx.arc(tx, ty, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(252,138,55,${0.5 - t * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Inner dot
      ctx.beginPath();
      ctx.arc(tx, ty, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#fc8a37';
      ctx.shadowColor = 'rgba(252,138,55,0.9)';
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Crashed X mark
    if (crashed && pts.length > 0) {
      const tx = toX(pts.length - 1);
      const ty = toY(pts[pts.length - 1]);
      ctx.beginPath();
      ctx.arc(tx, ty, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ff3f5b';
      ctx.shadowColor = 'rgba(255,63,91,0.8)';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, []);

  // Animation loop
  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      drawCanvas();
      animRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, [drawCanvas]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const startCountdown = () => {
    multipliersRef.current = [];
    setState('waiting');
    setMultiplier(1.0);
    setCashedOut(false);
    setWinAmount(0);
    setCountdown(5);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(countdownRef.current!);
          startGame();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const startGame = () => {
    const cp = generateCrashPoint();
    setCrashPoint(cp);
    setState('running');
    let current = 1.0;
    intervalRef.current = setInterval(() => {
      current = +(current * 1.015).toFixed(3);
      setMultiplier(current);
      multipliersRef.current = [...multipliersRef.current, current];
      if (current >= cp) {
        clearInterval(intervalRef.current!);
        setState('crashed');
        setHistory((h) => [cp, ...h].slice(0, 8));
        setBetPlaced(false);
        setTimeout(startCountdown, 3500);
      }
    }, 80);
  };

  useEffect(() => {
    startCountdown();
    return () => clearAll();
  }, []);

  const placeBet = () => {
    if (state !== 'waiting') return;
    if (betAmount <= 0 || betAmount > balance) {
      toast({ title: 'Некорректная ставка', variant: 'destructive' });
      return;
    }
    deductBalance(betAmount);
    setBetPlaced(true);
    toast({ title: `Ставка ${betAmount} ₽ принята!` });
  };

  const cashOut = () => {
    if (state !== 'running' || !betPlaced || cashedOut) return;
    const win = Math.floor(betAmount * multiplier);
    addBalance(win);
    setCashedOut(true);
    setWinAmount(win);
    toast({ title: `+${win} ₽`, description: `Выведено на x${multiplier.toFixed(2)}` });
  };

  const multColor = () => {
    if (state === 'crashed') return '#ff3f5b';
    if (multiplier >= 10) return '#fc8a37';
    if (multiplier >= 3) return '#5ac25a';
    return '#ffffff';
  };

  const multGlow = () => {
    if (state === 'crashed') return '0 0 40px rgba(255,63,91,0.6)';
    if (multiplier >= 10) return '0 0 50px rgba(252,138,55,0.7)';
    if (multiplier >= 3) return '0 0 40px rgba(90,194,90,0.5)';
    return 'none';
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#1c1d1f', border: '1px solid #2a2c2f' }}>

      {/* History bar */}
      <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto" style={{ borderBottom: '1px solid #2a2c2f', background: '#161718' }}>
        <span className="text-xs shrink-0" style={{ color: '#4a4d52' }}>История:</span>
        <div className="flex gap-1.5">
          {history.map((h, i) => {
            const c = historyColor(h);
            return (
              <span
                key={i}
                className="text-xs font-bold px-2 py-0.5 rounded-lg shrink-0 tabular-nums"
                style={{ background: c.bg, color: c.text }}
              >
                x{h.toFixed(2)}
              </span>
            );
          })}
        </div>
      </div>

      {/* Canvas graph */}
      <div className="relative" style={{ height: 260 }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Center overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {state === 'waiting' ? (
            <div className="text-center">
              <div className="text-sm font-semibold mb-2" style={{ color: '#7a7d82' }}>Следующий раунд через</div>
              <div
                className="text-7xl font-black tabular-nums leading-none"
                style={{ color: '#ffffff', fontVariantNumeric: 'tabular-nums', textShadow: '0 0 30px rgba(252,138,55,0.4)' }}
              >
                {countdown}
              </div>
              <div className="text-sm mt-1" style={{ color: '#4a4d52' }}>сек</div>
            </div>
          ) : (
            <div className="text-center">
              {state === 'crashed' && (
                <div className="text-sm font-bold mb-1 animate-pulse" style={{ color: '#ff3f5b', letterSpacing: '0.15em' }}>
                  КРАШ
                </div>
              )}
              <div
                className="font-black tabular-nums leading-none transition-all duration-75"
                style={{
                  fontSize: multiplier >= 10 ? '5rem' : '5.5rem',
                  color: multColor(),
                  textShadow: multGlow(),
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                x{multiplier.toFixed(2)}
              </div>
              {cashedOut && state === 'running' && (
                <div className="mt-2 px-3 py-1 rounded-xl text-sm font-bold" style={{ background: 'rgba(90,194,90,0.15)', color: '#5ac25a' }}>
                  ✓ Вышел с +{winAmount} ₽
                </div>
              )}
            </div>
          )}
        </div>

        {/* Boom flash on crash */}
        {state === 'crashed' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(255,63,91,0.12) 0%, transparent 70%)' }}
          />
        )}
      </div>

      {/* Controls */}
      <div className="p-4" style={{ borderTop: '1px solid #2a2c2f' }}>
        <div className="flex flex-col sm:flex-row gap-3">

          {/* Bet input side */}
          <div className="flex-1">
            <div className="text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#7a7d82' }}>Ставка</div>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Math.max(10, Number(e.target.value)))}
                disabled={state !== 'waiting' || betPlaced}
                className="flex-1 px-3 py-2.5 text-sm font-bold rounded-xl focus:outline-none text-white disabled:opacity-40"
                style={{ background: '#252729', border: '1px solid #2a2c2f' }}
                onFocus={(e) => { (e.currentTarget).style.borderColor = '#fc8a37'; }}
                onBlur={(e) => { (e.currentTarget).style.borderColor = '#2a2c2f'; }}
              />
              <button
                onClick={() => setBetAmount(Math.max(10, Math.floor(betAmount / 2)))}
                disabled={state !== 'waiting' || betPlaced}
                className="px-3 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
                style={{ background: '#252729', color: '#e8eaed' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#33353b'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#252729'; }}
              >
                ½
              </button>
              <button
                onClick={() => setBetAmount(betAmount * 2)}
                disabled={state !== 'waiting' || betPlaced}
                className="px-3 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
                style={{ background: '#252729', color: '#e8eaed' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#33353b'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#252729'; }}
              >
                ×2
              </button>
            </div>
            <div className="flex gap-2">
              {[50, 100, 250, 500].map((v) => (
                <button
                  key={v}
                  onClick={() => setBetAmount(v)}
                  disabled={state !== 'waiting' || betPlaced}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
                  style={{ background: '#252729', color: '#7a7d82', border: '1px solid #2a2c2f' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#fc8a37'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(252,138,55,0.4)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#7a7d82'; (e.currentTarget as HTMLElement).style.borderColor = '#2a2c2f'; }}
                >
                  {v} ₽
                </button>
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="flex flex-col justify-end min-w-[150px]">
            {!betPlaced ? (
              <button
                onClick={placeBet}
                disabled={state !== 'waiting'}
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed text-white"
                style={{ background: state === 'waiting' ? 'linear-gradient(135deg, #5ac25a 0%, #3da83d 100%)' : '#252729' }}
                onMouseEnter={(e) => { if (state === 'waiting') (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
              >
                {state === 'waiting'
                  ? `Поставить ${betAmount} ₽`
                  : state === 'running'
                  ? 'Идёт раунд...'
                  : 'Ожидание...'}
              </button>
            ) : cashedOut ? (
              <div
                className="w-full py-3.5 rounded-xl font-bold text-sm text-center"
                style={{ background: 'rgba(90,194,90,0.12)', color: '#5ac25a', border: '1px solid rgba(90,194,90,0.3)' }}
              >
                ✓ Вышел +{winAmount} ₽
              </div>
            ) : (
              <button
                onClick={cashOut}
                disabled={state !== 'running'}
                className="w-full py-3.5 rounded-xl font-black text-base transition-all disabled:opacity-50 text-white animate-pulse"
                style={{
                  background: 'linear-gradient(135deg, #fc8a37 0%, #e8620e 100%)',
                  boxShadow: '0 0 20px rgba(252,138,55,0.4)',
                }}
              >
                ЗАБРАТЬ<br />
                <span className="text-xs font-semibold opacity-90">
                  {Math.floor(betAmount * multiplier).toLocaleString()} ₽
                </span>
              </button>
            )}

            {/* Potential win indicator */}
            {betPlaced && !cashedOut && state === 'running' && (
              <div className="mt-2 text-center text-xs font-semibold" style={{ color: '#fc8a37' }}>
                x{multiplier.toFixed(2)} · {Math.floor(betAmount * multiplier).toLocaleString()} ₽
              </div>
            )}
          </div>
        </div>

        {/* Status row */}
        <div className="flex items-center justify-between mt-3 text-xs" style={{ color: '#4a4d52' }}>
          <span>Баланс: <span style={{ color: '#e8eaed' }}>{balance.toLocaleString()} ₽</span></span>
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: state === 'running' ? '#5ac25a' : state === 'crashed' ? '#ff3f5b' : '#fc8a37', boxShadow: state === 'running' ? '0 0 6px #5ac25a' : 'none' }}
            />
            <span style={{ color: state === 'running' ? '#5ac25a' : state === 'crashed' ? '#ff3f5b' : '#7a7d82' }}>
              {state === 'waiting' ? `Старт через ${countdown}с` : state === 'running' ? 'Раунд идёт' : 'Краш!'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
