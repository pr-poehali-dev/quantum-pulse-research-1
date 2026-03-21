import { useState } from 'react';
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

const AK47_IMG = 'https://cdn.poehali.dev/projects/7aeef975-065a-4673-b1ab-8a723cdbab1f/files/a25814e4-5cb4-496e-b212-24c364b4600b.jpg';

export default function Index() {
  const { balance, inventory, sellFromInventory, sellAll } = useStore();
  const [tab, setTab] = useState<Tab>('cases');
  const [category, setCategory] = useState<Category>('all');
  const [rarity, setRarity] = useState<RarityFilter>('all');
  const [search, setSearch] = useState('');
  const [openCase, setOpenCase] = useState<string | null>(null);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const filteredSkins = skins.filter((s) => {
    if (category !== 'all' && s.category !== category) return false;
    if (rarity !== 'all' && s.rarity !== rarity) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.weapon.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const navItems: { id: Tab; label: string; icon: string }[] = [
    { id: 'cases', label: 'Кейсы', icon: 'Package' },
    { id: 'catalog', label: 'Каталог', icon: 'LayoutGrid' },
    { id: 'crash', label: 'Crash', icon: 'TrendingUp' },
    { id: 'inventory', label: 'Инвентарь', icon: 'Archive' },
  ];

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'Все' },
    { id: 'knife', label: 'Ножи' },
    { id: 'rifle', label: 'Штурм' },
    { id: 'pistol', label: 'Пистолеты' },
    { id: 'smg', label: 'ПП' },
    { id: 'shotgun', label: 'Дробовики' },
    { id: 'sniper', label: 'Снайперки' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="Swords" size={18} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-wider" style={{ fontFamily: 'Orbitron' }}>
              <span className="text-primary">DRAG</span>ON<span className="text-accent">DROP</span>
            </span>
          </div>

          <nav className="hidden md:flex gap-1">
            {navItems.map((n) => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === n.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
              >
                <Icon name={n.icon} size={16} />
                {n.label}
                {n.id === 'inventory' && inventory.length > 0 && (
                  <span className="bg-accent text-accent-foreground text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">{inventory.length}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="bg-secondary border border-border rounded-xl px-3 py-1.5 flex items-center gap-2">
              <Icon name="Coins" size={16} className="text-yellow-400" />
              <span className="font-bold text-sm">{balance.toLocaleString()} ₽</span>
            </div>
            <button
              onClick={() => setShowDeposit(true)}
              className="bg-green-600 hover:bg-green-500 text-white font-bold px-3 py-1.5 rounded-xl text-sm flex items-center gap-1.5 transition-all"
            >
              <Icon name="Plus" size={16} />
              <span className="hidden sm:inline">Пополнить</span>
            </button>
            <button
              onClick={() => setShowWithdraw(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-xl text-sm flex items-center gap-1.5 transition-all"
            >
              <Icon name="ArrowUpFromLine" size={16} />
              <span className="hidden sm:inline">Вывести</span>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex border-t border-border">
          {navItems.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={`flex-1 flex flex-col items-center py-2 text-xs font-semibold transition-all ${tab === n.id ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Icon name={n.icon} size={18} />
              {n.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* CASES TAB */}
        {tab === 'cases' && (
          <div>
            <div className="mb-8 text-center">
              <h1 className="text-4xl md:text-5xl font-black mb-2" style={{ fontFamily: 'Orbitron' }}>
                <span className="text-primary">КЕЙСЫ</span> STANDOFF 2
              </h1>
              <p className="text-muted-foreground text-lg">Открывай кейсы и получай редкие скины</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.map((c) => (
                <div
                  key={c.id}
                  className={`relative rounded-2xl overflow-hidden border border-border cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:${c.glow}`}
                  onClick={() => setOpenCase(c.id)}
                >
                  <div className={`bg-gradient-to-br ${c.color} p-6 flex flex-col items-center gap-4`}>
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-full blur-2xl opacity-50 bg-gradient-to-br ${c.color} scale-150`} />
                      <img src={c.image} alt={c.name} className="relative h-32 w-full object-cover rounded-xl float-anim" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-black" style={{ fontFamily: 'Orbitron' }}>{c.name}</h3>
                      <p className="text-white/60 text-sm mt-1">{c.skins.length} предметов</p>
                    </div>
                    <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-bold py-2.5 rounded-xl transition-all text-lg">
                      Открыть за {c.price} ₽
                    </button>
                  </div>

                  <div className="bg-card p-3">
                    <div className="flex flex-wrap gap-1">
                      {c.skins.slice(0, 4).map((sid) => {
                        const sk = skins.find((s) => s.id === sid)!;
                        return (
                          <span key={sid} className={`text-xs px-2 py-0.5 rounded-full ${rarityColors[sk.rarity].bg} ${rarityColors[sk.rarity].text}`}>
                            {sk.name}
                          </span>
                        );
                      })}
                      {c.skins.length > 4 && <span className="text-xs text-muted-foreground">+{c.skins.length - 4}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Popular skins banner */}
            <div className="mt-10 bg-gradient-to-r from-card via-secondary to-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black mb-4" style={{ fontFamily: 'Orbitron' }}>
                🔥 Топ скины
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {skins.filter((s) => s.rarity === 'godlike' || s.rarity === 'legendary').slice(0, 4).map((s) => (
                  <SkinCard key={s.id} skin={s} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CATALOG TAB */}
        {tab === 'catalog' && (
          <div>
            <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <h1 className="text-3xl font-black" style={{ fontFamily: 'Orbitron' }}>Каталог скинов</h1>
              <div className="relative">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск скина..."
                  className="bg-secondary border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary w-56"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${category === c.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {(['all', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'godlike'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRarity(r)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${rarity === r ? (r === 'all' ? 'bg-primary text-primary-foreground border-primary' : `${rarityColors[r as keyof typeof rarityColors]?.bg} ${rarityColors[r as keyof typeof rarityColors]?.text} ${rarityColors[r as keyof typeof rarityColors]?.border}`) : 'border-border text-muted-foreground hover:text-foreground'}`}
                >
                  {r === 'all' ? 'Все редкости' : rarityColors[r as keyof typeof rarityColors]?.label}
                </button>
              ))}
            </div>

            <p className="text-muted-foreground text-sm mb-4">{filteredSkins.length} предметов</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredSkins.map((s) => (
                <SkinCard key={s.id} skin={s} />
              ))}
            </div>
          </div>
        )}

        {/* CRASH TAB */}
        {tab === 'crash' && (
          <div>
            <div className="mb-6 text-center">
              <h1 className="text-4xl font-black mb-2" style={{ fontFamily: 'Orbitron' }}>
                <span className="text-cyan-400">CRASH</span> GAME
              </h1>
              <p className="text-muted-foreground">Сделай ставку и забери деньги до крэша!</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <CrashGame />
            </div>

            <div className="max-w-2xl mx-auto mt-6 bg-card border border-border rounded-xl p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Icon name="Info" size={16} className="text-cyan-400" />
                Как играть
              </h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li><span className="text-foreground font-semibold">1.</span> Сделай ставку во время обратного отсчёта</li>
                <li><span className="text-foreground font-semibold">2.</span> Множитель начинает расти после старта</li>
                <li><span className="text-foreground font-semibold">3.</span> Нажми "Забрать" до того как ракета улетит!</li>
                <li><span className="text-red-400 font-semibold">⚠</span> Если не успел — теряешь ставку</li>
              </ol>
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {tab === 'inventory' && (
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-3xl font-black" style={{ fontFamily: 'Orbitron' }}>Инвентарь</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {inventory.length} предметов · Стоимость:{' '}
                  <span className="text-green-400 font-bold">
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
                  className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/40 text-red-400 font-bold px-4 py-2 rounded-xl transition-all"
                >
                  <Icon name="Trash2" size={16} />
                  Продать всё
                </button>
              )}
            </div>

            {inventory.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Archive" size={36} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Инвентарь пуст</h3>
                <p className="text-muted-foreground mb-4">Открывайте кейсы или покупайте скины в каталоге</p>
                <button onClick={() => setTab('cases')} className="bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-xl">
                  Открыть кейсы
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {inventory.map((item, i) => {
                  const sellPrice = Math.floor(item.skin.price * 0.7);
                  const colors = rarityColors[item.skin.rarity];
                  return (
                    <div key={i} className={`skin-card bg-card border-2 rarity-${item.skin.rarity} rounded-xl overflow-hidden group transition-all duration-300`}>
                      <div className={`relative h-36 ${colors.bg} flex items-center justify-center p-2`}>
                        <img src={item.skin.image} alt={item.skin.name} className="h-full w-full object-cover rounded-lg opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
                        <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                          {colors.label}
                        </span>
                      </div>
                      <div className="p-2.5">
                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{item.skin.weapon}</div>
                        <div className="font-bold text-sm mt-0.5 leading-tight">{item.skin.name}</div>
                        <button
                          onClick={() => {
                            const price = sellFromInventory(i);
                            toast({ title: `Продано за ${price.toLocaleString()} ₽`, description: `${item.skin.weapon} | ${item.skin.name}` });
                          }}
                          className="mt-2 w-full flex items-center justify-center gap-1.5 bg-green-600/20 hover:bg-green-600/40 border border-green-500/40 text-green-400 font-bold text-xs py-1.5 rounded-lg transition-all"
                        >
                          <Icon name="DollarSign" size={13} />
                          Продать · {sellPrice.toLocaleString()} ₽
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

      {/* Modals */}
      {openCase && <CaseOpenModal caseId={openCase} onClose={() => setOpenCase(null)} />}
      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} />}
      {showWithdraw && <WithdrawModal onClose={() => setShowWithdraw(false)} />}
    </div>
  );
}