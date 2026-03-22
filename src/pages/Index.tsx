import { useState, useEffect } from 'react';
import { skins, cases, rarityColors, Skin } from '@/data/skins';
import { useStore } from '@/store/useStore';
import SkinCard from '@/components/SkinCard';
import CaseOpenModal from '@/components/CaseOpenModal';
import CrashGame from '@/components/CrashGame';
import DepositModal from '@/components/DepositModal';
import WithdrawModal from '@/components/WithdrawModal';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

type Tab = 'cases' | 'catalog' | 'crash' | 'inventory';
type Category = 'all' | 'knife' | 'rifle' | 'pistol' | 'smg' | 'shotgun' | 'sniper';
type RarityFilter = 'all' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'godlike';

const rarityBarBg: Record<string, string> = {
  common: '#9e9e9e',
  uncommon: '#5ac25a',
  rare: '#5b8af0',
  epic: '#9b59f7',
  legendary: '#fc8a37',
  godlike: '#ff3f5b',
};

export default function Index() {
  const { balance, inventory, sellFromInventory, sellAll } = useStore();
  const [tab, setTab] = useState<Tab>('cases');
  const [category, setCategory] = useState<Category>('all');
  const [rarity, setRarity] = useState<RarityFilter>('all');
  const [search, setSearch] = useState('');
  const [openCase, setOpenCase] = useState<string | null>(null);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [onlineCount, setOnlineCount] = useState(14238);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => prev + Math.floor(Math.random() * 11) - 5);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const filteredSkins = skins.filter((s) => {
    if (category !== 'all' && s.category !== category) return false;
    if (rarity !== 'all' && s.rarity !== rarity) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.weapon.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const navItems: { id: Tab; label: string; icon: string }[] = [
    { id: 'cases', label: 'Кейсы', icon: 'Package2' },
    { id: 'catalog', label: 'Маркет', icon: 'ShoppingBag' },
    { id: 'crash', label: 'Краш', icon: 'TrendingUp' },
    { id: 'inventory', label: 'Инвентарь', icon: 'Archive' },
  ];

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'Все' },
    { id: 'knife', label: 'Ножи' },
    { id: 'rifle', label: 'Штурмовые' },
    { id: 'pistol', label: 'Пистолеты' },
    { id: 'smg', label: 'ПП' },
    { id: 'shotgun', label: 'Дробовики' },
    { id: 'sniper', label: 'Снайперки' },
  ];

  const rarityLabels: Record<string, string> = {
    all: 'Все', common: 'Базовые', uncommon: 'Обычные', rare: 'Редкие',
    epic: 'Эпические', legendary: 'Легендарные', godlike: 'Боговы',
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40" style={{ background: '#1c1d1f', borderBottom: '1px solid #2a2c2f' }}>
        <div className="max-w-7xl mx-auto px-4 h-[58px] flex items-center justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fc8a37 0%, #e8620e 100%)' }}>
              <Icon name="Flame" size={17} className="text-white" />
            </div>
            <span className="text-[17px] font-extrabold tracking-tight text-white">
              DRAGON<span style={{ color: '#fc8a37' }}>DROP</span>
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {navItems.map((n) => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
                style={tab === n.id ? { color: '#fc8a37', background: 'rgba(252,138,55,0.12)' } : { color: '#7a7d82' }}
                onMouseEnter={(e) => { if (tab !== n.id) (e.currentTarget as HTMLElement).style.color = '#e8eaed'; }}
                onMouseLeave={(e) => { if (tab !== n.id) (e.currentTarget as HTMLElement).style.color = '#7a7d82'; }}
              >
                <Icon name={n.icon} size={15} />
                {n.label}
                {n.id === 'inventory' && inventory.length > 0 && (
                  <span className="text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center text-white" style={{ background: '#fc8a37' }}>
                    {inventory.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Online */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium" style={{ background: '#252729', color: '#7a7d82' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {onlineCount.toLocaleString()}
            </div>

            {/* Balance */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold" style={{ background: '#252729', color: '#e8eaed' }}>
              <Icon name="Coins" size={14} style={{ color: '#fc8a37' }} />
              {balance.toLocaleString()} ₽
            </div>

            {/* Deposit */}
            <button
              onClick={() => setShowDeposit(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #fc8a37 0%, #e8620e 100%)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              <Icon name="Plus" size={15} />
              <span className="hidden sm:inline">Пополнить</span>
            </button>

            {/* Withdraw */}
            <button
              onClick={() => setShowWithdraw(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: '#33353b', color: '#e5e8eb' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#4b4e57'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#33353b'; }}
            >
              <Icon name="ArrowUpFromLine" size={15} />
              <span className="hidden sm:inline">Вывести</span>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex" style={{ borderTop: '1px solid #2a2c2f' }}>
          {navItems.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className="flex-1 flex flex-col items-center py-2 gap-0.5 text-[11px] font-semibold transition-all relative"
              style={tab === n.id ? { color: '#fc8a37' } : { color: '#7a7d82' }}
            >
              <Icon name={n.icon} size={17} />
              {n.label}
              {tab === n.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-t-full" style={{ background: '#fc8a37' }} />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-5">

        {/* ─── CASES TAB ─── */}
        {tab === 'cases' && (
          <div className="slide-up">

            {/* Hero banner */}
            <div className="relative rounded-2xl overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg, #1e1a16 0%, #231c10 50%, #1a1a1a 100%)', minHeight: 160 }}>
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(252,138,55,0.4) 0%, transparent 65%)' }} />
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #fc8a37, transparent)' }} />
              <div className="relative z-10 px-8 py-7 flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ background: 'rgba(252,138,55,0.15)', border: '1px solid rgba(252,138,55,0.3)', color: '#fc8a37' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    {onlineCount.toLocaleString()} онлайн
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1 leading-tight">
                    Открывай кейсы
                  </h1>
                  <p className="text-sm" style={{ color: '#7a7d82' }}>Редкие скины ждут тебя внутри — попробуй удачу!</p>
                </div>
                <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-2xl" style={{ background: 'rgba(252,138,55,0.1)', border: '1px solid rgba(252,138,55,0.2)' }}>
                  <span className="text-5xl">📦</span>
                </div>
              </div>
            </div>

            {/* Cases grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setOpenCase(c.id)}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-250 hover:-translate-y-1"
                  style={{ background: '#1c1d1f', border: '1px solid #2a2c2f' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(252,138,55,0.4)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(252,138,55,0.12)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#2a2c2f'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  {/* Image */}
                  <div className={`relative h-48 bg-gradient-to-br ${c.color} overflow-hidden flex items-center justify-center`}>
                    <div className="absolute inset-0 case-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Price badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-sm font-extrabold text-white" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}>
                      {c.price} ₽
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-base text-white mb-1">{c.name}</h3>
                    <p className="text-xs mb-3" style={{ color: '#7a7d82' }}>{c.skins.length} предметов</p>

                    {/* Skins preview */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {c.skins.slice(0, 3).map((sid) => {
                        const sk = skins.find((s) => s.id === sid)!;
                        const barColor = rarityBarBg[sk.rarity] || '#9e9e9e';
                        return (
                          <span key={sid} className="text-[10px] px-2 py-0.5 rounded-md font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: barColor, border: `1px solid ${barColor}40` }}>
                            {sk.name}
                          </span>
                        );
                      })}
                      {c.skins.length > 3 && <span className="text-[10px]" style={{ color: '#7a7d82' }}>+{c.skins.length - 3}</span>}
                    </div>

                    <button
                      className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                      style={{ background: 'linear-gradient(135deg, #fc8a37 0%, #e8620e 100%)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                    >
                      Открыть за {c.price} ₽
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Top skins row */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Flame" size={18} style={{ color: '#fc8a37' }} />
                <h2 className="text-lg font-bold text-white">Топовые скины</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {skins.filter((s) => s.rarity === 'godlike' || s.rarity === 'legendary').slice(0, 4).map((s) => (
                  <SkinCard key={s.id} skin={s} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── CATALOG TAB ─── */}
        {tab === 'catalog' && (
          <div className="slide-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-5">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Маркет скинов</h1>
                <p className="text-xs mt-0.5" style={{ color: '#7a7d82' }}>{filteredSkins.length} предметов</p>
              </div>
              <div className="relative">
                <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7a7d82' }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск скина..."
                  className="pl-9 pr-4 py-2 text-sm rounded-xl focus:outline-none w-52"
                  style={{ background: '#252729', border: '1px solid #2a2c2f', color: '#e8eaed' }}
                  onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#fc8a37'; }}
                  onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#2a2c2f'; }}
                />
              </div>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all"
                  style={category === c.id
                    ? { background: 'rgba(252,138,55,0.15)', color: '#fc8a37', border: '1px solid rgba(252,138,55,0.4)' }
                    : { background: '#252729', color: '#7a7d82', border: '1px solid #2a2c2f' }
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Rarity filters */}
            <div className="flex flex-wrap gap-2 mb-5">
              {(['all', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'godlike'] as const).map((r) => {
                const color = r === 'all' ? '#fc8a37' : rarityBarBg[r];
                return (
                  <button
                    key={r}
                    onClick={() => setRarity(r)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
                    style={rarity === r
                      ? { background: `${color}20`, color, border: `1px solid ${color}60` }
                      : { background: '#252729', color: '#7a7d82', border: '1px solid #2a2c2f' }
                    }
                  >
                    {rarityLabels[r]}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredSkins.map((s) => (
                <SkinCard key={s.id} skin={s} />
              ))}
            </div>
          </div>
        )}

        {/* ─── CRASH TAB ─── */}
        {tab === 'crash' && (
          <div className="slide-up">
            <div className="mb-5 text-center">
              <h1 className="text-3xl font-extrabold text-white mb-1">
                Краш <span style={{ color: '#fc8a37' }}>игра</span>
              </h1>
              <p className="text-sm" style={{ color: '#7a7d82' }}>Сделай ставку и успей забрать до краша!</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <CrashGame />
            </div>
            <div className="max-w-2xl mx-auto mt-4 p-4 rounded-2xl" style={{ background: '#1c1d1f', border: '1px solid #2a2c2f' }}>
              <h3 className="font-bold mb-3 flex items-center gap-2 text-sm text-white">
                <Icon name="Info" size={15} style={{ color: '#fc8a37' }} />
                Как играть
              </h3>
              <ol className="space-y-1.5 text-sm" style={{ color: '#7a7d82' }}>
                <li><span className="text-white font-semibold">1.</span> Сделай ставку во время обратного отсчёта</li>
                <li><span className="text-white font-semibold">2.</span> Множитель начинает расти после старта</li>
                <li><span className="text-white font-semibold">3.</span> Нажми "Забрать" до того как ракета улетит!</li>
                <li><span className="font-semibold" style={{ color: '#ff3f5b' }}>⚠</span> Если не успел — теряешь ставку</li>
              </ol>
            </div>
          </div>
        )}

        {/* ─── INVENTORY TAB ─── */}
        {tab === 'inventory' && (
          <div className="slide-up">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Инвентарь</h1>
                <p className="text-sm mt-0.5" style={{ color: '#7a7d82' }}>
                  {inventory.length} предметов · Стоимость:{' '}
                  <span className="font-bold" style={{ color: '#fc8a37' }}>
                    {inventory.reduce((s, i) => s + Math.floor(i.skin.price * 0.7), 0).toLocaleString()} ₽
                  </span>
                </p>
              </div>
              {inventory.length > 0 && (
                <button
                  onClick={() => {
                    const total = sellAll();
                    toast({ title: `Продано всё за ${total.toLocaleString()} ₽`, description: 'Средства зачислены на баланс' });
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: 'rgba(255,63,91,0.1)', border: '1px solid rgba(255,63,91,0.25)', color: '#ff3f5b' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,63,91,0.18)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,63,91,0.1)'; }}
                >
                  <Icon name="Trash2" size={15} />
                  Продать всё
                </button>
              )}
            </div>

            {inventory.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#252729' }}>
                  <Icon name="Archive" size={28} style={{ color: '#7a7d82' }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Инвентарь пуст</h3>
                <p className="text-sm mb-5" style={{ color: '#7a7d82' }}>Открывайте кейсы или покупайте скины в маркете</p>
                <button
                  onClick={() => setTab('cases')}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #fc8a37 0%, #e8620e 100%)' }}
                >
                  Открыть кейсы
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {inventory.map((item, i) => {
                  const sellPrice = Math.floor(item.skin.price * 0.7);
                  const barColor = rarityBarBg[item.skin.rarity] || '#9e9e9e';
                  return (
                    <div
                      key={i}
                      className="skin-card group relative rounded-xl overflow-hidden transition-all duration-200"
                      style={{ background: '#1c1d1f', border: `1px solid #2a2c2f` }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${barColor}50`; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#2a2c2f'; }}
                    >
                      {/* Rarity top line */}
                      <div className="h-0.5 w-full" style={{ background: barColor }} />
                      <div className="relative h-36 flex items-center justify-center p-3" style={{ background: `${barColor}0d` }}>
                        <img
                          src={item.skin.image}
                          alt={item.skin.name}
                          className="h-full w-full object-cover rounded-lg opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                        />
                      </div>
                      <div className="p-2.5">
                        <div className="text-[10px] font-medium uppercase tracking-wider mb-0.5" style={{ color: '#7a7d82' }}>{item.skin.weapon}</div>
                        <div className="font-bold text-sm leading-tight text-white">{item.skin.name}</div>
                        <button
                          onClick={() => {
                            const price = sellFromInventory(i);
                            toast({ title: `Продано за ${price.toLocaleString()} ₽`, description: `${item.skin.weapon} | ${item.skin.name}` });
                          }}
                          className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                          style={{ background: 'rgba(252,138,55,0.1)', border: '1px solid rgba(252,138,55,0.25)', color: '#fc8a37' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(252,138,55,0.2)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(252,138,55,0.1)'; }}
                        >
                          <Icon name="DollarSign" size={12} />
                          {sellPrice.toLocaleString()} ₽
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <div className="mt-12 py-5 text-center text-xs" style={{ borderTop: '1px solid #2a2c2f', color: '#4a4d52' }}>
        © 2025 DragonDrop · Только для развлечения · 18+
      </div>

      {/* Modals */}
      {openCase && <CaseOpenModal caseId={openCase} onClose={() => setOpenCase(null)} />}
      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} />}
      {showWithdraw && <WithdrawModal onClose={() => setShowWithdraw(false)} />}
    </div>
  );
}
