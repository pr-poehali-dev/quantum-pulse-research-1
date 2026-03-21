import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Props {
  onClose: () => void;
}

const amounts = [100, 250, 500, 1000, 2500, 5000];
const methods = [
  { id: 'card', label: 'Карта', sub: 'Visa / MC / МИР', icon: 'CreditCard' as const },
  { id: 'sbp', label: 'СБП', sub: 'Быстрые платежи', icon: 'Smartphone' as const },
  { id: 'crypto', label: 'Крипто', sub: 'USDT / BTC', icon: 'Bitcoin' as const },
  { id: 'qiwi', label: 'QIWI', sub: 'Кошелёк', icon: 'Wallet' as const },
];

export default function DepositModal({ onClose }: Props) {
  const { addBalance } = useStore();
  const [amount, setAmount] = useState(500);
  const [method, setMethod] = useState('card');
  const [step, setStep] = useState<'form' | 'success'>('form');

  const bonus = amount >= 1000 ? Math.floor(amount * 0.05) : 0;
  const total = amount + bonus;

  const handleDeposit = () => {
    if (amount < 50) {
      toast({ title: 'Минимальная сумма — 50 ₽', variant: 'destructive' });
      return;
    }
    addBalance(total);
    setStep('success');
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
              <Icon name="Plus" size={16} className="text-primary" />
            </div>
            <span className="font-black text-base" style={{ fontFamily: 'Oswald, sans-serif' }}>ПОПОЛНЕНИЕ</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        {step === 'form' ? (
          <div className="p-5 space-y-5">

            {/* Amount quick */}
            <div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Сумма</div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {amounts.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(a)}
                    className={`py-2 rounded-lg font-bold text-sm transition-all ${
                      amount === a
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary border border-border hover:border-primary/50 text-foreground'
                    }`}
                  >
                    {a.toLocaleString()} ₽
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                placeholder="Своя сумма"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {/* Methods */}
            <div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Способ оплаты</div>
              <div className="grid grid-cols-2 gap-2">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border transition-all text-left ${
                      method === m.id
                        ? 'border-primary bg-primary/8'
                        : 'border-border hover:border-border/80 bg-secondary'
                    }`}
                  >
                    <Icon name={m.icon} size={17} className={method === m.id ? 'text-primary' : 'text-muted-foreground'} />
                    <div>
                      <div className="text-sm font-semibold">{m.label}</div>
                      <div className="text-[10px] text-muted-foreground">{m.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bonus */}
            {bonus > 0 && (
              <div className="flex items-center gap-2 bg-primary/8 border border-primary/25 rounded-lg p-3">
                <Icon name="Gift" size={16} className="text-primary" />
                <span className="text-sm font-medium">Бонус +5% = <span className="text-primary font-bold">+{bonus} ₽</span></span>
              </div>
            )}

            {/* Summary */}
            <div className="bg-secondary rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">К зачислению:</span>
              <span className="font-black text-lg text-primary">{total.toLocaleString()} ₽</span>
            </div>

            <button
              onClick={handleDeposit}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-3 rounded-lg transition-all text-base"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              ПОПОЛНИТЬ {total.toLocaleString()} ₽
            </button>
            <p className="text-center text-xs text-muted-foreground">Минимум 50 ₽ · Зачисление мгновенно</p>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={36} className="text-primary" />
            </div>
            <h3 className="text-xl font-black mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>ЗАЧИСЛЕНО!</h3>
            <p className="text-muted-foreground text-sm mb-2">На баланс добавлено</p>
            <p className="text-4xl font-black text-primary mb-6">{total.toLocaleString()} ₽</p>
            <button
              onClick={onClose}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg text-sm"
            >
              Продолжить
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
