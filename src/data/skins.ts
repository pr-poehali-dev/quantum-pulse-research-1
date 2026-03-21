export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'godlike';

export interface Skin {
  id: string;
  name: string;
  weapon: string;
  rarity: Rarity;
  price: number;
  image: string;
  category: 'knife' | 'rifle' | 'pistol' | 'smg' | 'shotgun' | 'sniper';
}

const KNIFE_IMG = 'https://cdn.poehali.dev/projects/7aeef975-065a-4673-b1ab-8a723cdbab1f/files/6e9d8a1e-6f8f-4b49-b785-18e887bbae59.jpg';
const AK47_IMG = 'https://cdn.poehali.dev/projects/7aeef975-065a-4673-b1ab-8a723cdbab1f/files/a25814e4-5cb4-496e-b212-24c364b4600b.jpg';
const M4A1_IMG = 'https://cdn.poehali.dev/projects/7aeef975-065a-4673-b1ab-8a723cdbab1f/files/fd554b9d-be66-48a2-82d7-5a0bbb40e624.jpg';
const DEAGLE_IMG = 'https://cdn.poehali.dev/projects/7aeef975-065a-4673-b1ab-8a723cdbab1f/files/cedefaf4-4761-4f25-9d39-70b2d1ff47be.jpg';
const AWP_IMG = 'https://cdn.poehali.dev/projects/7aeef975-065a-4673-b1ab-8a723cdbab1f/files/ce98c629-c7b7-4695-9f43-442995f52ca3.jpg';
const KARAMBIT_IMG = 'https://cdn.poehali.dev/projects/7aeef975-065a-4673-b1ab-8a723cdbab1f/files/a363b83d-022e-40f0-a665-d5e713242812.jpg';
const SHOTGUN_IMG = 'https://cdn.poehali.dev/projects/7aeef975-065a-4673-b1ab-8a723cdbab1f/files/24cf5225-5e89-47a7-88b0-68dbb42931d6.jpg';
const MP5_IMG = 'https://cdn.poehali.dev/projects/7aeef975-065a-4673-b1ab-8a723cdbab1f/files/79c92568-7afc-4b94-9e6d-0c268eb956f3.jpg';

export const skins: Skin[] = [
  // KNIVES - GODLIKE
  { id: 'k1', name: 'Dragon Glass', weapon: 'Нож-бабочка', rarity: 'godlike', price: 12500, image: KNIFE_IMG, category: 'knife' },
  { id: 'k2', name: 'Изумрудный тигр', weapon: 'Карамбит', rarity: 'godlike', price: 9800, image: KARAMBIT_IMG, category: 'knife' },
  { id: 'k3', name: 'Кровавый рубин', weapon: 'Нож-бабочка', rarity: 'legendary', price: 7200, image: KNIFE_IMG, category: 'knife' },
  { id: 'k4', name: 'Ночной охотник', weapon: 'Карамбит', rarity: 'legendary', price: 6500, image: KARAMBIT_IMG, category: 'knife' },
  { id: 'k5', name: 'Золотой клык', weapon: 'Нож-бабочка', rarity: 'epic', price: 4200, image: KNIFE_IMG, category: 'knife' },
  { id: 'k6', name: 'Стальная тень', weapon: 'Карамбит', rarity: 'rare', price: 1800, image: KARAMBIT_IMG, category: 'knife' },

  // AK-47
  { id: 'ak1', name: 'Dragon | Чёрный огонь', weapon: 'AK-47', rarity: 'godlike', price: 8900, image: AK47_IMG, category: 'rifle' },
  { id: 'ak2', name: 'Пепел феникса', weapon: 'AK-47', rarity: 'legendary', price: 5400, image: AK47_IMG, category: 'rifle' },
  { id: 'ak3', name: 'Кровавый закат', weapon: 'AK-47', rarity: 'epic', price: 3100, image: AK47_IMG, category: 'rifle' },
  { id: 'ak4', name: 'Пустынный шторм', weapon: 'AK-47', rarity: 'rare', price: 1200, image: AK47_IMG, category: 'rifle' },
  { id: 'ak5', name: 'Городской камуфляж', weapon: 'AK-47', rarity: 'uncommon', price: 450, image: AK47_IMG, category: 'rifle' },
  { id: 'ak6', name: 'Базовый', weapon: 'AK-47', rarity: 'common', price: 120, image: AK47_IMG, category: 'rifle' },

  // M4A1
  { id: 'm1', name: 'Галактика', weapon: 'M4A1', rarity: 'legendary', price: 5800, image: M4A1_IMG, category: 'rifle' },
  { id: 'm2', name: 'Неоновая буря', weapon: 'M4A1', rarity: 'epic', price: 2900, image: M4A1_IMG, category: 'rifle' },
  { id: 'm3', name: 'Фиолетовый туман', weapon: 'M4A1', rarity: 'rare', price: 1100, image: M4A1_IMG, category: 'rifle' },
  { id: 'm4', name: 'Арктик', weapon: 'M4A1', rarity: 'uncommon', price: 380, image: M4A1_IMG, category: 'rifle' },
  { id: 'm5', name: 'Серый волк', weapon: 'M4A1', rarity: 'common', price: 95, image: M4A1_IMG, category: 'rifle' },

  // DEAGLE
  { id: 'd1', name: 'Королевское золото', weapon: 'Desert Eagle', rarity: 'legendary', price: 4200, image: DEAGLE_IMG, category: 'pistol' },
  { id: 'd2', name: 'Имперский дракон', weapon: 'Desert Eagle', rarity: 'epic', price: 2400, image: DEAGLE_IMG, category: 'pistol' },
  { id: 'd3', name: 'Чёрный жемчуг', weapon: 'Desert Eagle', rarity: 'rare', price: 980, image: DEAGLE_IMG, category: 'pistol' },
  { id: 'd4', name: 'Пламя заката', weapon: 'Desert Eagle', rarity: 'uncommon', price: 320, image: DEAGLE_IMG, category: 'pistol' },
  { id: 'd5', name: 'Стандарт', weapon: 'Desert Eagle', rarity: 'common', price: 80, image: DEAGLE_IMG, category: 'pistol' },

  // AWP
  { id: 'aw1', name: 'Кровавый ужас', weapon: 'AWP', rarity: 'godlike', price: 11000, image: AWP_IMG, category: 'sniper' },
  { id: 'aw2', name: 'Смерть с косой', weapon: 'AWP', rarity: 'legendary', price: 6800, image: AWP_IMG, category: 'sniper' },
  { id: 'aw3', name: 'Красный дракон', weapon: 'AWP', rarity: 'epic', price: 3500, image: AWP_IMG, category: 'sniper' },
  { id: 'aw4', name: 'Алый закат', weapon: 'AWP', rarity: 'rare', price: 1400, image: AWP_IMG, category: 'sniper' },
  { id: 'aw5', name: 'Охотник', weapon: 'AWP', rarity: 'uncommon', price: 420, image: AWP_IMG, category: 'sniper' },
  { id: 'aw6', name: 'Полевой', weapon: 'AWP', rarity: 'common', price: 110, image: AWP_IMG, category: 'sniper' },

  // SHOTGUN
  { id: 's1', name: 'Кибер-молния', weapon: 'SPAS-12', rarity: 'legendary', price: 3900, image: SHOTGUN_IMG, category: 'shotgun' },
  { id: 's2', name: 'Синяя плазма', weapon: 'SPAS-12', rarity: 'epic', price: 2100, image: SHOTGUN_IMG, category: 'shotgun' },
  { id: 's3', name: 'Электрический шторм', weapon: 'SPAS-12', rarity: 'rare', price: 890, image: SHOTGUN_IMG, category: 'shotgun' },
  { id: 's4', name: 'Техно', weapon: 'SPAS-12', rarity: 'uncommon', price: 290, image: SHOTGUN_IMG, category: 'shotgun' },
  { id: 's5', name: 'Базовый', weapon: 'SPAS-12', rarity: 'common', price: 75, image: SHOTGUN_IMG, category: 'shotgun' },

  // MP5
  { id: 'mp1', name: 'Ангельские крылья', weapon: 'MP5', rarity: 'legendary', price: 4100, image: MP5_IMG, category: 'smg' },
  { id: 'mp2', name: 'Белый серафим', weapon: 'MP5', rarity: 'epic', price: 2200, image: MP5_IMG, category: 'smg' },
  { id: 'mp3', name: 'Золотой ореол', weapon: 'MP5', rarity: 'rare', price: 950, image: MP5_IMG, category: 'smg' },
  { id: 'mp4', name: 'Лунный свет', weapon: 'MP5', rarity: 'uncommon', price: 310, image: MP5_IMG, category: 'smg' },
  { id: 'mp5', name: 'Стандарт', weapon: 'MP5', rarity: 'common', price: 85, image: MP5_IMG, category: 'smg' },
];

export const rarityColors: Record<Rarity, { text: string; bg: string; border: string; label: string }> = {
  common:    { text: 'text-gray-400',    bg: 'bg-gray-400/10',    border: 'border-gray-400',    label: 'Обычный' },
  uncommon:  { text: 'text-green-400',   bg: 'bg-green-400/10',   border: 'border-green-400',   label: 'Необычный' },
  rare:      { text: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400',    label: 'Редкий' },
  epic:      { text: 'text-purple-400',  bg: 'bg-purple-400/10',  border: 'border-purple-400',  label: 'Эпический' },
  legendary: { text: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400',  label: 'Легендарный' },
  godlike:   { text: 'text-red-400',     bg: 'bg-red-400/10',     border: 'border-red-500',     label: 'Godlike' },
};

export const cases = [
  {
    id: 'case1',
    name: 'Кейс Дракона',
    price: 199,
    image: AK47_IMG,
    color: 'from-red-900 to-orange-900',
    glow: 'shadow-red-500/50',
    skins: ['k1', 'ak1', 'aw1', 'ak2', 'ak3', 'ak4', 'ak5', 'ak6'],
    weights: [1, 2, 5, 8, 15, 20, 25, 24],
  },
  {
    id: 'case2',
    name: 'Кейс Ножей',
    price: 299,
    image: KNIFE_IMG,
    color: 'from-blue-900 to-cyan-900',
    glow: 'shadow-cyan-500/50',
    skins: ['k1', 'k2', 'k3', 'k4', 'k5', 'k6'],
    weights: [2, 3, 10, 15, 25, 45],
  },
  {
    id: 'case3',
    name: 'Кейс Снайпера',
    price: 149,
    image: AWP_IMG,
    color: 'from-gray-900 to-red-950',
    glow: 'shadow-red-800/50',
    skins: ['aw1', 'aw2', 'aw3', 'aw4', 'aw5', 'aw6'],
    weights: [2, 5, 13, 20, 30, 30],
  },
  {
    id: 'case4',
    name: 'Кейс Галактики',
    price: 179,
    image: M4A1_IMG,
    color: 'from-purple-900 to-indigo-900',
    glow: 'shadow-purple-500/50',
    skins: ['m1', 'm2', 'm3', 'm4', 'm5', 'mp1', 'mp2'],
    weights: [3, 8, 15, 22, 27, 5, 20],
  },
  {
    id: 'case5',
    name: 'Золотой кейс',
    price: 249,
    image: DEAGLE_IMG,
    color: 'from-yellow-900 to-amber-900',
    glow: 'shadow-yellow-500/50',
    skins: ['d1', 'd2', 'd3', 'd4', 'd5', 'k5', 'ak2'],
    weights: [3, 8, 17, 25, 30, 7, 10],
  },
  {
    id: 'case6',
    name: 'Кейс Молнии',
    price: 99,
    image: SHOTGUN_IMG,
    color: 'from-cyan-900 to-blue-950',
    glow: 'shadow-cyan-400/50',
    skins: ['s1', 's2', 's3', 's4', 's5', 'mp3', 'mp4'],
    weights: [4, 10, 18, 28, 25, 5, 10],
  },
];
