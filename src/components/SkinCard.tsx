import { Skin, rarityColors } from '@/data/skins';
import { useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Props {
  skin: Skin;
  showBuy?: boolean;
}

export default function SkinCard({ skin, showBuy = true }: Props) {
  const { balance, deductBalance, addToInventory } = useStore();
  const colors = rarityColors[skin.rarity];

  const handleBuy = () => {
    const ok = deductBalance(skin.price);
    if (!ok) {
      toast({ title: 'Недостаточно средств', description: 'Пополните баланс', variant: 'destructive' });
      return;
    }
    addToInventory(skin);
    toast({ title: `${skin.weapon} | ${skin.name}`, description: 'Добавлено в инвентарь!' });
  };

  // Rarity accent color for bottom bar
  const rarityBarColor: Record<string, string> = {
    common: 'bg-gray-400',
    uncommon: 'bg-green-500',
    rare: 'bg-blue-500',
    epic: 'bg-purple-500',
    legendary: 'bg-amber-500',
    godlike: 'bg-red-500',
  };

  return (
    <div className="skin-card group relative bg-card rounded-xl overflow-hidden cursor-pointer transition-all duration-250 border border-border hover:border-primary/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      {/* Rarity bar top */}
      <div className={`h-0.5 w-full ${rarityBarColor[skin.rarity]}`} />

      {/* Image area */}
      <div className={`relative h-36 ${colors.bg} flex items-center justify-center p-3`}>
        <img
          src={skin.image}
          alt={skin.name}
          className="h-full w-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
        />
        {/* Rarity badge */}
        <span className={`absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border} uppercase tracking-wide`}>
          {colors.label}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mb-0.5">{skin.weapon}</div>
        <div className="font-semibold text-sm leading-tight mb-2 truncate">{skin.name}</div>

        <div className="flex items-center justify-between">
          <span className="font-black text-sm text-foreground">{skin.price.toLocaleString()} ₽</span>
          {showBuy && (
            <button
              onClick={handleBuy}
              className="flex items-center gap-1 bg-primary/15 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/30 hover:border-primary text-xs font-bold px-2 py-1 rounded-lg transition-all duration-200"
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
