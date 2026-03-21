import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

type GameState = 'waiting' | 'running' | 'crashed';

function generateCrashPoint(): number {
  // House edge ~15% — низкие шансы на высокий множитель
  const r = Math.random();
  if (r < 0.45) return +(1 + Math.random() * 0.5).toFixed(2);   // 45% crash 1.0x-1.5x
  if (r < 0.70) return +(1.5 + Math.random() * 0.8).toFixed(2); // 25% crash 1.5x-2.3x
  if (r < 0.85) return +(2.3 + Math.random() * 1.7).toFixed(2); // 15% crash 2.3x-4x
  if (r < 0.95) return +(4 + Math.random() * 6).toFixed(2);     // 10% crash 4x-10x
  return +(10 + Math.random() * 40).toFixed(2);                  // 5% crash 10x-50x
}

const HISTORY_MAX = 10;

export default function CrashGame() {
  const { balance, deductBalance, addBalance } = useStore();
  const [betAmount, setBetAmount] = useState(50);
  const [state, setState] = useState<GameState>('waiting');
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState(1.5);
  const [betPlaced, setBetPlaced] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [history, setHistory] = useState<number[]>([3.21, 1.45, 7.82, 1.12, 2.34, 15.6, 1.03, 4.77, 1.88, 2.05]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const startCountdown = () => {
    setState('waiting');
    setMultiplier(1.0);
    setCashedOut(false);
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
      if (current >= cp) {
        clearInterval(intervalRef.current!);
        setState('crashed');
        setHistory((h) => [cp, ...h].slice(0, HISTORY_MAX));
        setBetPlaced(false);
        setTimeout(startCountdown, 3000);
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
    toast({ title: `Вы забрали ${win} ₽!`, description: `Множитель: x${multiplier}` });
  };

  const getMultiplierColor = () => {
    if (state === 'crashed') return 'text-red-500';
    if (multiplier >= 5) return 'text-yellow-400';
    if (multiplier >= 2) return 'text-green-400';
    return 'text-cyan-400';
  };

  const graphPoints = () => {
    const pts = [];
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * 500;
      const y = 200 - Math.min(180, (i / 100) * multiplier * 50);
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-950 to-blue-950 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="TrendingUp" size={20} className="text-cyan-400" />
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Orbitron' }}>CRASH</h2>
        </div>
        <div className="flex gap-2">
          {history.map((h, i) => (
            <span key={i} className={`text-xs font-bold px-2 py-0.5 rounded-full ${h < 2 ? 'bg-red-500/20 text-red-400' : h < 5 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              x{h.toFixed(2)}
            </span>
          ))}
        </div>
      </div>

      {/* Graph area */}
      <div className="relative h-52 bg-[#060d1a] flex items-center justify-center overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 500 220">
          {[0.25, 0.5, 0.75].map((y, i) => (
            <line key={i} x1="0" y1={220 * y} x2="500" y2={220 * y} stroke="#1e3a5f" strokeWidth="1" strokeDasharray="4,4" />
          ))}
        </svg>
        {state !== 'waiting' && (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 220" preserveAspectRatio="none">
            <polyline
              points={graphPoints()}
              fill="none"
              stroke={state === 'crashed' ? '#ef4444' : '#00c3ff'}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <polygon
              points={`0,200 ${graphPoints().split(' ').pop()?.split(',')[0]},200`}
              fill={state === 'crashed' ? '#ef444422' : '#00c3ff22'}
            />
          </svg>
        )}

        <div className="text-center z-10">
          {state === 'waiting' ? (
            <div>
              <div className="text-muted-foreground text-sm mb-1">Следующий раунд через</div>
              <div className="text-5xl font-black text-white" style={{ fontFamily: 'Orbitron' }}>{countdown}с</div>
            </div>
          ) : (
            <div>
              {state === 'crashed' && <div className="text-red-400 text-sm font-bold mb-1">УЛЕТЕЛ!</div>}
              <div className={`text-6xl font-black crash-multiplier ${getMultiplierColor()}`}>
                x{multiplier.toFixed(2)}
              </div>
              {cashedOut && state === 'running' && (
                <div className="text-green-400 text-sm font-bold mt-1">✓ Вы вышли!</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground font-medium">Ставка (₽)</label>
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Math.max(10, Number(e.target.value)))}
              disabled={state !== 'waiting' || betPlaced}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:border-primary disabled:opacity-50"
            />
            <button onClick={() => setBetAmount(Math.floor(betAmount / 2))} disabled={state !== 'waiting' || betPlaced} className="bg-secondary px-2 rounded-lg text-xs disabled:opacity-50">½</button>
            <button onClick={() => setBetAmount(betAmount * 2)} disabled={state !== 'waiting' || betPlaced} className="bg-secondary px-2 rounded-lg text-xs disabled:opacity-50">×2</button>
          </div>
          <div className="flex gap-2 mt-2">
            {[50, 100, 250, 500].map((v) => (
              <button key={v} onClick={() => setBetAmount(v)} disabled={state !== 'waiting' || betPlaced} className="flex-1 bg-secondary text-xs py-1 rounded-lg hover:bg-primary/20 transition disabled:opacity-50">
                {v}₽
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-[140px]">
          {!betPlaced ? (
            <button
              onClick={placeBet}
              disabled={state !== 'waiting'}
              className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-xl transition-all"
            >
              Поставить
            </button>
          ) : (
            <button
              onClick={cashOut}
              disabled={state !== 'running' || cashedOut}
              className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold py-2 px-4 rounded-xl transition-all text-lg"
              style={{ fontFamily: 'Orbitron' }}
            >
              {cashedOut ? 'Вышли ✓' : `Забрать x${multiplier.toFixed(2)}`}
            </button>
          )}
          <div className="text-center text-xs text-muted-foreground">Баланс: <span className="text-primary font-bold">{balance.toLocaleString()} ₽</span></div>
        </div>
      </div>
    </div>
  );
}
