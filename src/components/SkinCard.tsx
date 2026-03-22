import { Skin, rarityColors } from '@/data/skins';
import { useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Props {
  skin: Skin;
  showBuy?: boolean;
}

const rarityBarBg: Record<string, string> = {
  common: '#9e9e9e',
  uncommon: '#5ac25a',
  rare: '#5b8af0',
  epic: '#9b59f7',
  legendary: '#fc8a37',
  godlike: '#ff3f5b',
};

const rarityLabel: Record<string, string> = {
  common: 'Базовый',
  uncommon: 'Обычный',
  rare: 'Редкий',
  epic: 'Эпический',
  legendary: 'Легендарный',
  godlike: 'Боговый',
};

export default function SkinCard({ skin, showBuy = true }: Props) {
  const { deductBalance, addToInventory } = useStore();
  const barColor = rarityBarBg[skin.rarity] || '#9e9e9e';

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = deductBalance(skin.price);
    if (!ok) {
      toast({ title: 'Недостаточно средств', description: 'Пополните баланс', variant: 'destructive' });
      return;
    }
    addToInventory(skin);
    toast({ title: `${skin.weapon} | ${skin.name}`, description: 'Добавлено в инвентарь!' });
  };

  return (
    <div
      className="skin-card group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200"
      style={{ background: '#1c1d1f', border: '1px solid #2a2c2f' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${barColor}50`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 24px ${barColor}18`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = '#2a2c2f';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Rarity top stripe */}
      <div className="h-0.5 w-full" style={{ background: barColor }} />

      {/* Image area */}
      <div className="relative h-36 flex items-center justify-center p-3" style={{ background: `${barColor}10` }}>
        <img
          src={skin.image}
          alt={skin.name}
          className="h-full w-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
        />
        {/* Rarity label */}
        <span
          className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider"
          style={{ background: `${barColor}25`, color: barColor, border: `1px solid ${barColor}40` }}
        >
          {rarityLabel[skin.rarity]}
        </span>
      </div>

      {/* Info */}
      <div className="p-2.5">
        <div className="text-[10px] font-medium uppercase tracking-widest mb-0.5" style={{ color: '#7a7d82' }}>
          {skin.weapon}
        </div>
        <div className="font-semibold text-sm leading-tight mb-2 truncate text-white">{skin.name}</div>

        <div className="flex items-center justify-between">
          <span className="font-extrabold text-sm text-white">{skin.price.toLocaleString()} ₽</span>
          {showBuy && (
            <button
              onClick={handleBuy}
              className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg transition-all"
              style={{ background: 'rgba(252,138,55,0.12)', color: '#fc8a37', border: '1px solid rgba(252,138,55,0.3)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#fc8a37';
                (e.currentTarget as HTMLElement).style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(252,138,55,0.12)';
                (e.currentTarget as HTMLElement).style.color = '#fc8a37';
              }}
            >
              <Icon name="ShoppingCart" size={11} />
              Купить
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
