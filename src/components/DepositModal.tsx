import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Props {
  onClose: () => void;
}

const amounts = [100, 250, 500, 1000, 2500, 5000];
const methods = [
  { id: 'card', label: 'Банковская карта', icon: 'CreditCard' as const },
  { id: 'sbp', label: 'СБП', icon: 'Smartphone' as const },
  { id: 'crypto', label: 'Крипто', icon: 'Bitcoin' as const },
  { id: 'qiwi', label: 'QIWI', icon: 'Wallet' as const },
];

export default function DepositModal({ onClose }: Props) {
  const { addBalance } = useStore();
  const [amount, setAmount] = useState(500);
  const [method, setMethod] = useState('card');
  const [step, setStep] = useState<'form' | 'success'>('form');

  const handleDeposit = () => {
    if (amount < 50) {
      toast({ title: 'Минимальная сумма — 50 ₽', variant: 'destructive' });
      return;
    }
    // Симуляция пополнения
    addBalance(amount);
    setStep('success');
    toast({ title: `+${amount.toLocaleString()} ₽ зачислено!`, description: 'Баланс пополнен' });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-950 to-emerald-950 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="Wallet" size={24} className="text-green-400" />
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Orbitron' }}>Пополнение</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><Icon name="X" size={22} /></button>
        </div>

        {step === 'form' ? (
          <div className="p-5 space-y-5">
            {/* Amounts */}
            <div>
              <label className="text-sm text-muted-foreground font-medium">Сумма пополнения</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {amounts.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(a)}
                    className={`py-2 rounded-xl font-bold text-sm transition-all border ${amount === a ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border hover:border-primary/50'}`}
                  >
                    {a.toLocaleString()} ₽
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Своя сумма"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Methods */}
            <div>
              <label className="text-sm text-muted-foreground font-medium">Способ оплаты</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${method === m.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'}`}
                  >
                    <Icon name={m.icon} size={18} className={method === m.id ? 'text-primary' : 'text-muted-foreground'} />
                    <span className="text-sm font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bonus */}
            {amount >= 1000 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 flex items-center gap-2">
                <Icon name="Gift" size={18} className="text-green-400" />
                <span className="text-sm text-green-400 font-medium">Бонус +5% к пополнению от 1000 ₽!</span>
              </div>
            )}

            <button
              onClick={handleDeposit}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl transition-all text-lg"
            >
              Пополнить {amount.toLocaleString()} ₽
            </button>
            <p className="text-center text-xs text-muted-foreground">Минимальная сумма: 50 ₽ · Зачисление мгновенно</p>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={40} className="text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Успешно!</h3>
            <p className="text-muted-foreground mb-1">Зачислено на баланс:</p>
            <p className="text-4xl font-black text-green-400 mb-6">{amount.toLocaleString()} ₽</p>
            <button onClick={onClose} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl">
              Продолжить игру
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
