import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Props {
  onClose: () => void;
}

const methods = [
  { id: 'card', label: 'Карта', sub: 'Visa / МИР / MC', icon: 'CreditCard' as const, hint: '1234 **** **** ****', min: 500 },
  { id: 'sbp', label: 'СБП', sub: 'Быстрые платежи', icon: 'Smartphone' as const, hint: '+7 (___) ___-__-__', min: 100 },
  { id: 'crypto', label: 'Крипто', sub: 'USDT TRC20', icon: 'Bitcoin' as const, hint: 'TRC20 адрес кошелька', min: 1000 },
  { id: 'qiwi', label: 'QIWI', sub: 'Кошелёк', icon: 'Wallet' as const, hint: '+7 номер QIWI', min: 200 },
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
      toast({ title: `Минимум — ${selectedMethod.min} ₽`, variant: 'destructive' });
      return;
    }
    if (amount > balance) {
      toast({ title: 'Недостаточно средств', variant: 'destructive' });
      return;
    }
    if (!requisite.trim()) {
      toast({ title: 'Укажите реквизиты', variant: 'destructive' });
      return;
    }
    deductBalance(amount);
    setStep('success');
  };

  const quickAmounts = [100, 250, 500, 1000].filter((a) => a <= balance);

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center border border-border">
              <Icon name="ArrowUpFromLine" size={15} className="text-foreground" />
            </div>
            <div>
              <span className="font-black text-base" style={{ fontFamily: 'Oswald, sans-serif' }}>ВЫВОД СРЕДСТВ</span>
              <p className="text-[11px] text-muted-foreground">Баланс: <span className="text-foreground font-semibold">{balance.toLocaleString()} ₽</span></p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        {step === 'form' ? (
          <div className="p-5 space-y-4">

            {/* Methods */}
            <div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Способ вывода</div>
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
                    <Icon name={m.icon} size={16} className={method === m.id ? 'text-primary' : 'text-muted-foreground'} />
                    <div>
                      <div className="text-sm font-semibold">{m.label}</div>
                      <div className="text-[10px] text-muted-foreground">{m.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Requisite */}
            <div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Реквизиты</div>
              <input
                type="text"
                value={requisite}
                onChange={(e) => setRequisite(e.target.value)}
                placeholder={selectedMethod.hint}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {/* Amount */}
            <div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
                Сумма · мин. {selectedMethod.min} ₽
              </div>
              {quickAmounts.length > 0 && (
                <div className="flex gap-2 mb-2">
                  {quickAmounts.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAmount(a)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        amount === a ? 'bg-primary/15 border-primary text-primary' : 'border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {a.toLocaleString()}
                    </button>
                  ))}
                  <button
                    onClick={() => setAmount(balance)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      amount === balance ? 'bg-primary/15 border-primary text-primary' : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Всё
                  </button>
                </div>
              )}
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.min(balance, Math.max(0, Number(e.target.value))))}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {/* Fee breakdown */}
            {amount > 0 && (
              <div className="bg-secondary border border-border rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Сумма</span>
                  <span>{amount.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Комиссия ({fee * 100}%)</span>
                  <span className="text-red-400">−{feeAmount.toLocaleString()} ₽</span>
                </div>
                <div className="border-t border-border/60 pt-2 flex justify-between font-bold">
                  <span>Вы получите</span>
                  <span className="text-primary">{willGet.toLocaleString()} ₽</span>
                </div>
              </div>
            )}

            <button
              onClick={handleWithdraw}
              disabled={amount < selectedMethod.min || amount > balance}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-primary-foreground font-black py-3 rounded-lg transition-all text-base"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              ВЫВЕСТИ {willGet > 0 ? `${willGet.toLocaleString()} ₽` : ''}
            </button>
            <p className="text-center text-xs text-muted-foreground">Срок обработки: до 24 часов</p>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={36} className="text-primary" />
            </div>
            <h3 className="text-xl font-black mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>ЗАЯВКА ПРИНЯТА!</h3>
            <p className="text-muted-foreground text-sm mb-2">На вывод через {selectedMethod.label}</p>
            <p className="text-4xl font-black text-primary mb-2">{willGet.toLocaleString()} ₽</p>
            <p className="text-muted-foreground text-xs mb-6">Обработка до 24 часов</p>
            <button onClick={onClose} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg text-sm">
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
