import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Props {
  onClose: () => void;
}

const methods = [
  { id: 'card', label: 'Банковская карта', sub: 'Visa / МИР / MC', icon: 'CreditCard' as const, hint: '1234 **** **** ****', min: 500 },
  { id: 'sbp', label: 'СБП', sub: 'Быстрые платежи', icon: 'Smartphone' as const, hint: '+7 (___) ___-__-__', min: 100 },
  { id: 'crypto', label: 'Криптовалюта', sub: 'USDT TRC20', icon: 'Bitcoin' as const, hint: 'TRC20 адрес кошелька', min: 1000 },
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#1c1d1f', border: '1px solid #2a2c2f' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #2a2c2f' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#252729' }}>
              <Icon name="ArrowUpFromLine" size={15} className="text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base text-white">Вывод средств</span>
              <p className="text-[11px]" style={{ color: '#7a7d82' }}>
                Баланс: <span className="text-white font-semibold">{balance.toLocaleString()} ₽</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#7a7d82' }} className="hover:text-white transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        {step === 'form' ? (
          <div className="p-5 space-y-4">

            {/* Methods */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7a7d82' }}>Способ вывода</div>
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
                    <Icon name={m.icon} size={16} style={{ color: method === m.id ? '#fc8a37' : '#7a7d82' }} />
                    <div>
                      <div className="text-sm font-semibold text-white">{m.label}</div>
                      <div className="text-[10px]" style={{ color: '#7a7d82' }}>{m.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Requisite */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7a7d82' }}>Реквизиты</div>
              <input
                type="text"
                value={requisite}
                onChange={(e) => setRequisite(e.target.value)}
                placeholder={selectedMethod.hint}
                className="w-full px-4 py-2.5 text-sm rounded-xl focus:outline-none text-white"
                style={{ background: '#252729', border: '1px solid #2a2c2f' }}
                onFocus={(e) => { (e.currentTarget).style.borderColor = '#fc8a37'; }}
                onBlur={(e) => { (e.currentTarget).style.borderColor = '#2a2c2f'; }}
              />
            </div>

            {/* Amount */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7a7d82' }}>
                Сумма · мин. {selectedMethod.min} ₽
              </div>
              {quickAmounts.length > 0 && (
                <div className="flex gap-2 mb-2">
                  {quickAmounts.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAmount(a)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={amount === a
                        ? { background: 'rgba(252,138,55,0.15)', color: '#fc8a37', border: '1px solid rgba(252,138,55,0.4)' }
                        : { background: '#252729', color: '#7a7d82', border: '1px solid #2a2c2f' }
                      }
                    >
                      {a.toLocaleString()}
                    </button>
                  ))}
                  <button
                    onClick={() => setAmount(balance)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={amount === balance
                      ? { background: 'rgba(252,138,55,0.15)', color: '#fc8a37', border: '1px solid rgba(252,138,55,0.4)' }
                      : { background: '#252729', color: '#7a7d82', border: '1px solid #2a2c2f' }
                    }
                  >
                    Всё
                  </button>
                </div>
              )}
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.min(balance, Math.max(0, Number(e.target.value))))}
                className="w-full px-4 py-2.5 text-sm rounded-xl focus:outline-none text-white"
                style={{ background: '#252729', border: '1px solid #2a2c2f' }}
                onFocus={(e) => { (e.currentTarget).style.borderColor = '#fc8a37'; }}
                onBlur={(e) => { (e.currentTarget).style.borderColor = '#2a2c2f'; }}
              />
            </div>

            {/* Fee breakdown */}
            {amount > 0 && (
              <div className="p-4 rounded-xl space-y-2 text-sm" style={{ background: '#252729' }}>
                <div className="flex justify-between" style={{ color: '#7a7d82' }}>
                  <span>Сумма</span>
                  <span className="text-white">{amount.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between" style={{ color: '#7a7d82' }}>
                  <span>Комиссия ({fee * 100}%)</span>
                  <span style={{ color: '#ff3f5b' }}>−{feeAmount.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between font-bold pt-2" style={{ borderTop: '1px solid #2a2c2f' }}>
                  <span className="text-white">Вы получите</span>
                  <span style={{ color: '#fc8a37' }}>{willGet.toLocaleString()} ₽</span>
                </div>
              </div>
            )}

            <button
              onClick={handleWithdraw}
              disabled={amount < selectedMethod.min || amount > balance}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #fc8a37 0%, #e8620e 100%)' }}
              onMouseEnter={(e) => { if (!(e.currentTarget as HTMLButtonElement).disabled) (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              Вывести {willGet > 0 ? `${willGet.toLocaleString()} ₽` : ''}
            </button>
            <p className="text-center text-xs" style={{ color: '#4a4d52' }}>Срок обработки: до 24 часов</p>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(252,138,55,0.15)' }}>
              <Icon name="CheckCircle" size={36} style={{ color: '#fc8a37' }} />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-1">Заявка принята!</h3>
            <p className="text-sm mb-2" style={{ color: '#7a7d82' }}>На вывод через {selectedMethod.label}</p>
            <p className="text-4xl font-extrabold mb-2" style={{ color: '#fc8a37' }}>{willGet.toLocaleString()} ₽</p>
            <p className="text-xs mb-6" style={{ color: '#4a4d52' }}>Обработка до 24 часов</p>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl text-sm font-bold text-white"
              style={{ background: '#33353b' }}
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
