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

type Tab = 'catalog' | 'cases' | 'crash' | 'inventory';
type Category = 'all' | 'knife' | 'rifle' | 'pistol' | 'smg' | 'shotgun' | 'sniper';
type RarityFilter = 'all' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'godlike';

export default function Index() {
  const { balance, inventory, sellFromInventory, sellAll } = useStore();
  const [tab, setTab] = useState<Tab>('cases');
  const [category, setCategory] = useState<Category>('all');
  const [rarity, setRarity] = useState<RarityFilter>('all');
  const [search, setSearch] = useState('');
  const [openCase, setOpenCase] = useState<string | null>(null);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [onlineCount, setOnlineCount] = useState(2847);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => prev + Math.floor(Math.random() * 7) - 3);
    }, 4000);
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
    { id: 'crash', label: 'Crash', icon: 'TrendingUp' },
    { id: 'inventory', label: 'Инвентарь', icon: 'Archive' },
  ];

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'Все' },
    { id: 'knife', label: '🔪 Ножи' },
    { id: 'rifle', label: '🔫 Штурм' },
    { id: 'pistol', label: '🔫 Пистолеты' },
    { id: 'smg', label: 'ПП' },
    { id: 'shotgun', label: 'Дробовики' },
    { id: 'sniper', label: 'Снайперки' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 h-[60px] flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Icon name="Flame" size={18} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-black tracking-tight" style={{ fontFamily: 'Oswald, sans-serif' }}>
              DRAGON<span className="text-primary">DROP</span>
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((n) => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  tab === n.id
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Icon name={n.icon} size={15} />
                {n.label}
                {n.id === 'inventory' && inventory.length > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {inventory.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right block */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Online */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {onlineCount.toLocaleString()}
            </div>

            {/* Balance */}
            <div className="flex items-center gap-1.5 bg-secondary border border-border rounded-lg px-3 py-1.5">
              <Icon name="Coins" size={14} className="text-primary" />
              <span className="font-bold text-sm tabular-nums">{balance.toLocaleString()} ₽</span>
            </div>

            {/* Deposit */}
            <button
              onClick={() => setShowDeposit(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-all duration-200"
            >
              <Icon name="Plus" size={15} />
              <span className="hidden sm:inline">Пополнить</span>
            </button>

            {/* Withdraw */}
            <button
              onClick={() => setShowWithdraw(true)}
              className="bg-secondary hover:bg-border text-foreground font-bold px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-all duration-200 border border-border"
            >
              <Icon name="ArrowUpFromLine" size={15} />
              <span className="hidden sm:inline">Вывести</span>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex border-t border-border/60">
          {navItems.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-[11px] font-semibold transition-all ${
                tab === n.id ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon name={n.icon} size={17} />
              {n.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* ─── CASES TAB ─── */}
        {tab === 'cases' && (
          <div>
            {/* Hero */}
            <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-950 via-purple-950 to-background border border-purple-900/40 p-8">
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, hsl(271,76%,60%) 0%, transparent 60%)' }} />
              <div className="relative z-10 max-w-lg">
                <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-3 py-1 text-xs font-semibold text-primary mb-4">
                  <Icon name="Flame" size={12} />
                  Открывай кейсы · Получай скины
                </div>
                <h1 className="text-3xl md:text-4xl font-black mb-2 leading-tight" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  КЕЙСЫ<br />
                  <span className="text-primary">STANDOFF 2</span>
                </h1>
                <p className="text-muted-foreground text-sm">Редкие скины ждут тебя внутри</p>
              </div>
            </div>

            {/* Cases grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setOpenCase(c.id)}
                  className="group relative rounded-xl overflow-hidden border border-border hover:border-primary/50 cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] hover:-translate-y-1 bg-card"
                >
                  {/* Image */}
                  <div className={`relative h-48 bg-gradient-to-br ${c.color} overflow-hidden`}>
                    <div className="absolute inset-0 case-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 float-anim"
                    />
                    {/* Price badge */}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm border border-primary/40 rounded-lg px-2.5 py-1">
                      <span className="text-primary font-black text-sm">{c.price} ₽</span>
                    </div>
                    {/* Items count */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-white/70">
                      {c.skins.length} предметов
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-base mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>{c.name}</h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {c.skins.slice(0, 3).map((sid) => {
                        const sk = skins.find((s) => s.id === sid)!;
                        return (
                          <span key={sid} className={`text-[10px] px-2 py-0.5 rounded-full ${rarityColors[sk.rarity].bg} ${rarityColors[sk.rarity].text}`}>
                            {sk.name}
                          </span>
                        );
                      })}
                      {c.skins.length > 3 && <span className="text-[10px] text-muted-foreground">+{c.skins.length - 3}</span>}
                    </div>
                    <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2.5 rounded-lg text-sm transition-all duration-200">
                      Открыть кейс
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Top skins */}
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Flame" size={18} className="text-primary" />
                <h2 className="text-lg font-black" style={{ fontFamily: 'Oswald, sans-serif' }}>Топ скины</h2>
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
          <div>
            {/* Header row */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-5">
              <h1 className="text-2xl font-black" style={{ fontFamily: 'Oswald, sans-serif' }}>Маркет скинов</h1>
              <div className="relative">
                <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск..."
                  className="bg-secondary border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary w-52"
                />
              </div>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    category === c.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Rarity filters */}
            <div className="flex flex-wrap gap-2 mb-5">
              {(['all', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'godlike'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRarity(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                    rarity === r
                      ? r === 'all'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : `${rarityColors[r as keyof typeof rarityColors]?.bg} ${rarityColors[r as keyof typeof rarityColors]?.text} ${rarityColors[r as keyof typeof rarityColors]?.border}`
                      : 'border-border text-muted-foreground hover:text-foreground hover:border-border/80'
                  }`}
                >
                  {r === 'all' ? 'Все' : rarityColors[r as keyof typeof rarityColors]?.label}
                </button>
              ))}
            </div>

            <p className="text-muted-foreground text-xs mb-4">{filteredSkins.length} предметов</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredSkins.map((s) => (
                <SkinCard key={s.id} skin={s} />
              ))}
            </div>
          </div>
        )}

        {/* ─── CRASH TAB ─── */}
        {tab === 'crash' && (
          <div>
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-black mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
                <span className="text-primary">CRASH</span> GAME
              </h1>
              <p className="text-muted-foreground text-sm">Сделай ставку и успей забрать до краша!</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <CrashGame />
            </div>

            <div className="max-w-2xl mx-auto mt-5 bg-card border border-border rounded-xl p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-sm">
                <Icon name="Info" size={15} className="text-primary" />
                Как играть
              </h3>
              <ol className="space-y-1.5 text-sm text-muted-foreground">
                <li><span className="text-foreground font-semibold">1.</span> Сделай ставку во время обратного отсчёта</li>
                <li><span className="text-foreground font-semibold">2.</span> Множитель начинает расти после старта</li>
                <li><span className="text-foreground font-semibold">3.</span> Нажми "Забрать" до того как ракета улетит!</li>
                <li><span className="text-red-400 font-semibold">⚠</span> Если не успел — теряешь ставку</li>
              </ol>
            </div>
          </div>
        )}

        {/* ─── INVENTORY TAB ─── */}
        {tab === 'inventory' && (
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black" style={{ fontFamily: 'Oswald, sans-serif' }}>Инвентарь</h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {inventory.length} предметов · Стоимость:{' '}
                  <span className="text-primary font-bold">
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
                  className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold px-4 py-2 rounded-lg text-sm transition-all"
                >
                  <Icon name="Trash2" size={15} />
                  Продать всё
                </button>
              )}
            </div>

            {inventory.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Archive" size={28} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-2">Инвентарь пуст</h3>
                <p className="text-muted-foreground text-sm mb-5">Открывайте кейсы или покупайте скины в каталоге</p>
                <button
                  onClick={() => setTab('cases')}
                  className="bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-lg text-sm"
                >
                  Открыть кейсы
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {inventory.map((item, i) => {
                  const sellPrice = Math.floor(item.skin.price * 0.7);
                  const colors = rarityColors[item.skin.rarity];
                  return (
                    <div key={i} className={`skin-card bg-card border-2 rarity-${item.skin.rarity} rounded-xl overflow-hidden group transition-all duration-300`}>
                      <div className={`relative h-36 ${colors.bg} flex items-center justify-center p-2`}>
                        <img
                          src={item.skin.image}
                          alt={item.skin.name}
                          className="h-full w-full object-cover rounded-lg opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                        />
                        <span className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                          {colors.label}
                        </span>
                      </div>
                      <div className="p-2.5">
                        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{item.skin.weapon}</div>
                        <div className="font-bold text-sm mt-0.5 leading-tight">{item.skin.name}</div>
                        <button
                          onClick={() => {
                            const price = sellFromInventory(i);
                            toast({ title: `Продано за ${price.toLocaleString()} ₽`, description: `${item.skin.weapon} | ${item.skin.name}` });
                          }}
                          className="mt-2 w-full flex items-center justify-center gap-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-bold text-xs py-1.5 rounded-lg transition-all"
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

      {/* Footer line */}
      <div className="border-t border-border/40 mt-10 py-4 text-center text-xs text-muted-foreground">
        © 2025 DragonDrop · Только для развлечения
      </div>

      {/* Modals */}
      {openCase && <CaseOpenModal caseId={openCase} onClose={() => setOpenCase(null)} />}
      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} />}
      {showWithdraw && <WithdrawModal onClose={() => setShowWithdraw(false)} />}
    </div>
  );
}
