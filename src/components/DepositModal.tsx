import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Props {
  onClose: () => void;
}

const amounts = [100, 250, 500, 1000, 2500, 5000];
const methods = [
  { id: 'card', label: 'Банковская карта', sub: 'Visa / МИР / MC', icon: 'CreditCard' as const },
  { id: 'sbp', label: 'СБП', sub: 'Быстрые платежи', icon: 'Smartphone' as const },
  { id: 'crypto', label: 'Криптовалюта', sub: 'USDT / BTC', icon: 'Bitcoin' as const },
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#1c1d1f', border: '1px solid #2a2c2f' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #2a2c2f' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(252,138,55,0.15)' }}>
              <Icon name="Plus" size={16} style={{ color: '#fc8a37' }} />
            </div>
            <span className="font-extrabold text-base text-white">Пополнение баланса</span>
          </div>
          <button onClick={onClose} style={{ color: '#7a7d82' }} className="hover:text-white transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        {step === 'form' ? (
          <div className="p-5 space-y-5">

            {/* Amount */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7a7d82' }}>Сумма пополнения</div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {amounts.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(a)}
                    className="py-2 rounded-xl text-sm font-bold transition-all"
                    style={amount === a
                      ? { background: 'rgba(252,138,55,0.18)', color: '#fc8a37', border: '1px solid rgba(252,138,55,0.5)' }
                      : { background: '#252729', color: '#e8eaed', border: '1px solid #2a2c2f' }
                    }
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
                className="w-full px-4 py-2.5 text-sm rounded-xl focus:outline-none text-white"
                style={{ background: '#252729', border: '1px solid #2a2c2f' }}
                onFocus={(e) => { (e.currentTarget).style.borderColor = '#fc8a37'; }}
                onBlur={(e) => { (e.currentTarget).style.borderColor = '#2a2c2f'; }}
              />
            </div>

            {/* Payment methods */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7a7d82' }}>Способ оплаты</div>
              <div className="grid grid-cols-2 gap-2">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className="flex items-center gap-2.5 p-3 rounded-xl text-left transition-all"
                    style={method === m.id
                      ? { background: 'rgba(252,138,55,0.12)', border: '1px solid rgba(252,138,55,0.4)' }
                      : { background: '#252729', border: '1px solid #2a2c2f' }
                    }
                  >
                    <Icon name={m.icon} size={17} style={{ color: method === m.id ? '#fc8a37' : '#7a7d82' }} />
                    <div>
                      <div className="text-sm font-semibold text-white">{m.label}</div>
                      <div className="text-[10px]" style={{ color: '#7a7d82' }}>{m.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bonus banner */}
            {bonus > 0 && (
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(252,138,55,0.1)', border: '1px solid rgba(252,138,55,0.25)' }}>
                <Icon name="Gift" size={16} style={{ color: '#fc8a37' }} />
                <span className="text-sm font-medium text-white">Бонус +5% = <span style={{ color: '#fc8a37' }}>+{bonus} ₽</span></span>
              </div>
            )}

            {/* Summary */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: '#252729' }}>
              <span className="text-sm" style={{ color: '#7a7d82' }}>К зачислению:</span>
              <span className="font-extrabold text-lg" style={{ color: '#fc8a37' }}>{total.toLocaleString()} ₽</span>
            </div>

            <button
              onClick={handleDeposit}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #fc8a37 0%, #e8620e 100%)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              Пополнить {total.toLocaleString()} ₽
            </button>
            <p className="text-center text-xs" style={{ color: '#4a4d52' }}>Минимум 50 ₽ · Зачисление мгновенно</p>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(252,138,55,0.15)' }}>
              <Icon name="CheckCircle" size={36} style={{ color: '#fc8a37' }} />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-1">Зачислено!</h3>
            <p className="text-sm mb-2" style={{ color: '#7a7d82' }}>На баланс добавлено</p>
            <p className="text-4xl font-extrabold mb-6" style={{ color: '#fc8a37' }}>{total.toLocaleString()} ₽</p>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #fc8a37 0%, #e8620e 100%)' }}
            >
              Продолжить
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
