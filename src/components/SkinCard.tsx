import { Skin, rarityColors } from '@/data/skins';
import { useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';

interface Props {
  skin: Skin;
  showBuy?: boolean;
}

export default function SkinCard({ skin, showBuy = true }: Props) {
  const { rarityClass } = getRarityClass(skin.rarity);
  const { balance, deductBalance, addToInventory } = useStore();
  const colors = rarityColors[skin.rarity];

  function getRarityClass(rarity: string) {
    return { rarityClass: `rarity-${rarity}` };
  }

  const handleBuy = () => {
    const ok = deductBalance(skin.price);
    if (!ok) {
      toast({ title: 'Недостаточно средств', description: 'Пополните баланс', variant: 'destructive' });
      return;
    }
    addToInventory(skin);
    toast({ title: `${skin.weapon} | ${skin.name}`, description: 'Добавлено в инвентарь!' });
  };

  return (
    <div className={`skin-card bg-card border-2 ${rarityClass} rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group`}>
      <div className={`relative h-40 ${colors.bg} flex items-center justify-center p-3`}>
        <img src={skin.image} alt={skin.name} className="h-full w-full object-cover rounded-lg opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
        <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
          {rarityColors[skin.rarity].label}
        </span>
      </div>
      <div className="p-3">
        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{skin.weapon}</div>
        <div className="font-bold text-sm mt-0.5 leading-tight">{skin.name}</div>
        <div className="flex items-center justify-between mt-2">
          <span className={`font-bold text-sm ${colors.text}`}>{skin.price.toLocaleString()} ₽</span>
          {showBuy && (
            <button
              onClick={handleBuy}
              className="text-xs bg-primary/20 hover:bg-primary/40 text-primary border border-primary/40 px-2 py-1 rounded-lg transition-all"
            >
              Купить
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
