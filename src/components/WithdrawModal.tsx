import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Props {
  onClose: () => void;
}

const methods = [
  { id: 'card', label: 'Банковская карта', icon: 'CreditCard' as const, hint: '1234 **** **** ****', min: 500 },
  { id: 'sbp', label: 'СБП', icon: 'Smartphone' as const, hint: '+7 (___) ___-__-__', min: 100 },
  { id: 'crypto', label: 'Крипто (USDT)', icon: 'Bitcoin' as const, hint: 'TRC20 адрес кошелька', min: 1000 },
  { id: 'qiwi', label: 'QIWI', icon: 'Wallet' as const, hint: '+7 номер QIWI', min: 200 },
];

export default function WithdrawModal({ onClose }: Props) {
  const { balance, deductBalance } = useStore();
  const [amount, setAmount] = useState(Math.min(500, balance));
  const [method, setMethod] = useState('sbp');
  const [requisite, setRequisite] = useState('');
  const [step, setStep] = useState<'form' | 'success'>('form');

  const selectedMethod = methods.find((m) => m.id === method)!;
  const fee = method === 'crypto' ? 0.02 : 0.05;
  const feeAmount = Math.floor(amount * fee);
  const willGet = amount - feeAmount;

  const handleWithdraw = () => {
    if (amount < selectedMethod.min) {
      toast({ title: `Минимальная сумма — ${selectedMethod.min} ₽`, variant: 'destructive' });
      return;
    }
    if (amount > balance) {
      toast({ title: 'Недостаточно средств на балансе', variant: 'destructive' });
      return;
    }
    if (!requisite.trim()) {
      toast({ title: 'Укажите реквизиты для вывода', variant: 'destructive' });
      return;
    }
    deductBalance(amount);
    setStep('success');
  };

  const quickAmounts = [100, 250, 500, 1000].filter((a) => a <= balance);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 to-indigo-950 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="ArrowUpFromLine" size={22} className="text-blue-400" />
            <div>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'Orbitron' }}>Вывод средств</h2>
              <p className="text-white/50 text-xs mt-0.5">Баланс: <span className="text-white font-bold">{balance.toLocaleString()} ₽</span></p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <Icon name="X" size={22} />
          </button>
        </div>

        {step === 'form' ? (
          <div className="p-5 space-y-5">
            {/* Method */}
            <div>
              <label className="text-sm text-muted-foreground font-medium">Способ вывода</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${method === m.id ? 'border-blue-500 bg-blue-500/10' : 'border-border hover:border-blue-500/40'}`}
                  >
                    <Icon name={m.icon} size={18} className={method === m.id ? 'text-blue-400' : 'text-muted-foreground'} />
                    <span className="text-sm font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Requisite */}
            <div>
              <label className="text-sm text-muted-foreground font-medium">Реквизиты</label>
              <input
                type="text"
                value={requisite}
                onChange={(e) => setRequisite(e.target.value)}
                placeholder={selectedMethod.hint}
                className="w-full mt-2 bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-sm text-muted-foreground font-medium">Сумма вывода</label>
              {quickAmounts.length > 0 && (
                <div className="flex gap-2 mt-2 mb-2">
                  {quickAmounts.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAmount(a)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${amount === a ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-border text-muted-foreground hover:text-foreground'}`}
                    >
                      {a.toLocaleString()}
                    </button>
                  ))}
                  <button
                    onClick={() => setAmount(balance)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${amount === balance ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-border text-muted-foreground hover:text-foreground'}`}
                  >
                    Всё
                  </button>
                </div>
              )}
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.min(balance, Math.max(0, Number(e.target.value))))}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-muted-foreground mt-1">Минимум: {selectedMethod.min.toLocaleString()} ₽</p>
            </div>

            {/* Fee breakdown */}
            {amount > 0 && (
              <div className="bg-secondary rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Сумма вывода</span>
                  <span>{amount.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Комиссия ({fee * 100}%)</span>
                  <span className="text-red-400">− {feeAmount.toLocaleString()} ₽</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                  <span>Вы получите</span>
                  <span className="text-green-400">{willGet.toLocaleString()} ₽</span>
                </div>
              </div>
            )}

            <button
              onClick={handleWithdraw}
              disabled={amount < selectedMethod.min || amount > balance}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all text-lg"
            >
              Вывести {willGet > 0 ? willGet.toLocaleString() + ' ₽' : ''}
            </button>
            <p className="text-center text-xs text-muted-foreground">Срок обработки: до 24 часов</p>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={40} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Заявка принята!</h3>
            <p className="text-muted-foreground mb-1">На вывод:</p>
            <p className="text-4xl font-black text-blue-400 mb-2">{willGet.toLocaleString()} ₽</p>
            <p className="text-muted-foreground text-sm mb-6">Через {selectedMethod.label} · до 24 часов</p>
            <button onClick={onClose} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl">
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
