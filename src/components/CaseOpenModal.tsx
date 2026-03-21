import { useState, useEffect, useRef } from 'react';
import { skins, cases, rarityColors, Skin } from '@/data/skins';
import { useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Props {
  caseId: string;
  onClose: () => void;
}

function weightedRandom(weights: number[]): number {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

export default function CaseOpenModal({ caseId, onClose }: Props) {
  const caseData = cases.find((c) => c.id === caseId)!;
  const { deductBalance, addToInventory, balance } = useStore();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Skin | null>(null);
  const [offset, setOffset] = useState(0);
  const [items, setItems] = useState<Skin[]>([]);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const ITEM_W = 140;

  const buildItems = (winIdx: number): Skin[] => {
    const pool = caseData.skins.map((id) => skins.find((s) => s.id === id)!);
    const arr: Skin[] = [];
    for (let i = 0; i < 40; i++) {
      const ri = weightedRandom(caseData.weights);
      arr.push(pool[ri]);
    }
    arr[32] = pool[winIdx];
    return arr;
  };

  const handleOpen = () => {
    if (spinning) return;
    const ok = deductBalance(caseData.price);
    if (!ok) {
      toast({ title: 'Недостаточно средств', variant: 'destructive' });
      return;
    }
    setResult(null);
    const winIdx = weightedRandom(caseData.weights);
    const pool = caseData.skins.map((id) => skins.find((s) => s.id === id)!);
    const win = pool[winIdx];
    const arr = buildItems(winIdx);
    setItems(arr);
    setOffset(0);
    setSpinning(true);

    setTimeout(() => {
      const target = 32 * ITEM_W - (spinnerRef.current ? spinnerRef.current.offsetWidth / 2 - ITEM_W / 2 : 0);
      setOffset(target);
      setTimeout(() => {
        setSpinning(false);
        setResult(win);
        addToInventory(win);
        toast({ title: `Выпало: ${win.weapon} | ${win.name}`, description: `Редкость: ${rarityColors[win.rarity].label}` });
      }, 4200);
    }, 50);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && !spinning && onClose()}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl overflow-hidden">
        <div className={`bg-gradient-to-r ${caseData.color} p-6 flex items-center justify-between`}>
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Orbitron' }}>{caseData.name}</h2>
            <p className="text-white/70 mt-1">Цена открытия: <span className="text-white font-bold">{caseData.price} ₽</span></p>
          </div>
          <button onClick={onClose} disabled={spinning} className="text-white/70 hover:text-white">
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Spinner */}
          <div className="relative h-36 overflow-hidden rounded-xl border border-border bg-background mb-4">
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-primary z-10 -translate-x-1/2" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rotate-45 -translate-y-2 z-10" />
            <div
              ref={spinnerRef}
              className="flex items-center h-full gap-2 px-4"
              style={{
                transform: `translateX(-${offset}px)`,
                transition: spinning && offset > 0 ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                width: `${items.length * (ITEM_W + 8)}px`,
              }}
            >
              {items.map((item, i) => {
                const c = rarityColors[item.rarity];
                return (
                  <div key={i} className={`flex-shrink-0 w-[${ITEM_W}px] h-28 rounded-lg border-2 ${c.border} ${c.bg} flex flex-col items-center justify-center p-2`} style={{ width: ITEM_W }}>
                    <img src={item.image} alt={item.name} className="h-16 w-full object-cover rounded" />
                    <div className={`text-xs font-bold mt-1 text-center ${c.text} leading-tight`}>{item.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className={`mb-4 p-4 rounded-xl border-2 ${rarityColors[result.rarity].border} ${rarityColors[result.rarity].bg} flex items-center gap-4`}>
              <img src={result.image} alt={result.name} className="h-20 w-24 object-cover rounded-lg" />
              <div>
                <div className="text-xs text-muted-foreground">{result.weapon}</div>
                <div className="text-xl font-bold">{result.name}</div>
                <div className={`text-sm font-semibold mt-1 ${rarityColors[result.rarity].text}`}>{rarityColors[result.rarity].label}</div>
                <div className="text-primary font-bold">{result.price.toLocaleString()} ₽</div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleOpen}
              disabled={spinning}
              className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-lg"
              style={{ fontFamily: 'Orbitron' }}
            >
              {spinning ? 'Открытие...' : `Открыть за ${caseData.price} ₽`}
            </button>
            {result && (
              <button onClick={handleOpen} disabled={spinning} className="bg-secondary text-foreground font-bold py-3 px-4 rounded-xl hover:bg-secondary/80 transition-all">
                Ещё раз
              </button>
            )}
          </div>
          <p className="text-center text-muted-foreground text-xs mt-2">Баланс: {balance.toLocaleString()} ₽</p>
        </div>
      </div>
    </div>
  );
}
