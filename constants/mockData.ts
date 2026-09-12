export interface CartItem {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  quantity: number;
  image: string;
  options?: string;
}

export interface Category {
  id: string;
  label: string;
  labelEn: string;
  emoji: string;
}

export interface ProductOption {
  id: string;
  label: string;
  labelEn: string;
  price?: number;
}

export interface ProductOptionGroup {
  id: string;
  label: string;
  labelEn: string;
  required: boolean;
  multiSelect: boolean;
  options: ProductOption[];
}

export interface Product {
  id: string;
  title: string;
  titleEn: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  badge?: string;
  emoji: string;
  categoryId: string;
  description?: string;
  descriptionEn?: string;
  optionGroups?: ProductOptionGroup[];
  imageUrl?: string;
}

export const categories: Category[] = [
  { id: 'hot', label: 'مشروبات ساخنة', labelEn: 'Hot Drinks', emoji: '☕' },
  { id: 'cold', label: 'مشروبات باردة', labelEn: 'Ice Drinks', emoji: '🧊' },
  { id: 'sugarfree', label: 'لاتيه خالي من السكر', labelEn: 'Sugar-Free Lattes', emoji: '🥛' },
  { id: 'mojito', label: 'موهيتو', labelEn: 'Mojitos', emoji: '🍹' },
  { id: 'milkshake', label: 'ميلك شيك', labelEn: 'Milkshakes', emoji: '🥤' },
  { id: 'sandwiches', label: 'ساندويتشات', labelEn: 'Sandwiches', emoji: '🥪' },
  { id: 'bagels', label: 'بيغل', labelEn: 'Bagels', emoji: '🥯' },
  { id: 'kroffles', label: 'كروفِلز', labelEn: 'Kroffles', emoji: '🧇' },
  { id: 'icedtea', label: 'شاي مثلج', labelEn: 'Iced Tea', emoji: '🫖' },
  { id: 'matcha', label: 'ماتشا', labelEn: 'Matcha', emoji: '🍵' },
];

// Mojito base options
const mojitoBases: ProductOption[] = [
  { id: 'redbull', label: 'ريدبول', labelEn: 'Redbull', price: 20 },
  { id: 'maxfly', label: 'ماكس فلاي', labelEn: 'Max Fly', price: 18 },
  { id: 'boomboom', label: 'بوم بوم', labelEn: 'Boomboom', price: 18 },
  { id: 'classic', label: 'كلاسيك', labelEn: 'Classic', price: 16 },
];

const mojitoFlavors: ProductOption[] = [
  { id: 'watermelon', label: 'بطيخ', labelEn: 'Watermelon' },
  { id: 'pomegranate', label: 'رمان', labelEn: 'Pomegranate' },
  { id: 'bluekrust', label: 'بلو كرست', labelEn: 'Blue Krust' },
  { id: 'pinacolada', label: 'بينا كولادا', labelEn: 'Pinacolada' },
  { id: 'pinklemonade', label: 'بنك ليمون', labelEn: 'Pink Lemonade' },
  { id: 'passionfruit', label: 'باشن فروت', labelEn: 'Passion Fruit' },
  { id: 'bubblegum', label: 'بابل غم', labelEn: 'Bubble Gum' },
  { id: 'strawberry', label: 'فراولة', labelEn: 'Strawberry' },
];

const mojitoOptionGroups: ProductOptionGroup[] = [
  {
    id: 'base',
    label: 'الأساس',
    labelEn: 'Base',
    required: true,
    multiSelect: false,
    options: mojitoBases,
  },
  {
    id: 'flavor',
    label: 'النكهة',
    labelEn: 'Flavor',
    required: true,
    multiSelect: false,
    options: mojitoFlavors,
  },
];

// Sugar-free mojito flavor options
const sugarFreeMojitoOptionGroups: ProductOptionGroup[] = [
  {
    id: 'flavor',
    label: 'النكهة',
    labelEn: 'Flavor',
    required: true,
    multiSelect: false,
    options: [
      { id: 'peach', label: 'خوخ', labelEn: 'Peach', price: 16 },
      { id: 'strawberry', label: 'فراولة', labelEn: 'Strawberry', price: 16 },
    ],
  },
];

const sandwichBreadOptions: ProductOptionGroup[] = [
  {
    id: 'bread',
    label: 'نوع الخبز',
    labelEn: 'Bread',
    required: true,
    multiSelect: false,
    options: [
      { id: 'barley', label: 'شعير', labelEn: 'Barley', price: 10 },
      { id: 'oat', label: 'شوفان', labelEn: 'Oat', price: 12 },
      { id: 'classic', label: 'خبزة عادية', labelEn: 'Classic bread', price: 10 },
    ],
  },
];

// Sugar-free latte temperature options
const sugarFreeOptionGroups: ProductOptionGroup[] = [
  {
    id: 'temperature',
    label: 'الحرارة',
    labelEn: 'Temperature',
    required: true,
    multiSelect: false,
    options: [
      { id: 'hot', label: 'ساخن', labelEn: 'Hot', price: 10 },
      { id: 'cold', label: 'بارد', labelEn: 'Cold', price: 15 },
    ],
  },
];

export const products: Product[] = [
  // Hot Drinks
  { id: 'h1', title: 'سبانش لاتيه', titleEn: 'Spanish Latte', price: 12, rating: 5, badge: 'الأكثر طلبًا', emoji: '☕', categoryId: 'hot', description: 'لاتيه إسباني غني بنكهة الحليب المكثف', descriptionEn: 'Rich Spanish latte with condensed milk', imageUrl: 'https://images.pexels.com/photos/6747870/pexels-photo-6747870.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'h2', title: 'كرست سالتد كاراميل', titleEn: 'Krust Salted Caramel', price: 14, rating: 5, badge: 'جديد', emoji: '☕', categoryId: 'hot', description: 'لاتيه بالكراميل المملح', descriptionEn: 'Salted caramel latte', imageUrl: 'https://images.pexels.com/photos/459489/pexels-photo-459489.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'h3', title: 'بستاشيو لاتيه', titleEn: 'Pistachio Latte', price: 14, rating: 5, badge: 'الأكثر طلبًا', emoji: '☕', categoryId: 'hot', description: 'لاتيه بالفستق الحلبي', descriptionEn: 'Pistachio latte', imageUrl: 'https://images.pexels.com/photos/7683595/pexels-photo-7683595.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'h4', title: 'سينابون لاتيه', titleEn: 'Cinnabon Latte', price: 12, rating: 4.5, emoji: '☕', categoryId: 'hot', description: 'لاتيه بنكهة القرفة', descriptionEn: 'Cinnamon latte', imageUrl: 'https://images.pexels.com/photos/6747870/pexels-photo-6747870.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'h5', title: 'وايت شوكولات لاتيه', titleEn: 'White Chocolate Latte', price: 14, rating: 5, emoji: '☕', categoryId: 'hot', description: 'لاتيه بالشوكولاتة البيضاء', descriptionEn: 'White chocolate latte', imageUrl: 'https://images.pexels.com/photos/459489/pexels-photo-459489.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'h6', title: 'فانيليا لاتيه', titleEn: 'Vanilla Latte', price: 10, rating: 4.5, emoji: '☕', categoryId: 'hot', description: 'لاتيه بالفانيليا', descriptionEn: 'Vanilla latte', imageUrl: 'https://images.pexels.com/photos/7683595/pexels-photo-7683595.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'h7', title: 'لاتيه بندق', titleEn: 'Hazelnut Latte', price: 10, rating: 4.5, emoji: '☕', categoryId: 'hot', description: 'لاتيه بالبندق', descriptionEn: 'Hazelnut latte', imageUrl: 'https://images.pexels.com/photos/6747870/pexels-photo-6747870.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'h8', title: 'جنجر بريد لاتيه', titleEn: 'Gingerbread Latte', price: 14, rating: 5, badge: 'جديد', emoji: '☕', categoryId: 'hot', description: 'لاتيه بجنجر الخبز', descriptionEn: 'Gingerbread latte', imageUrl: 'https://images.pexels.com/photos/459489/pexels-photo-459489.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },

  // Cold Drinks
  { id: 'c1', title: 'إيس سبانش لاتيه', titleEn: 'Ice Spanish Latte', price: 17, rating: 5, badge: 'الأكثر طلبًا', emoji: '🧊', categoryId: 'cold', description: 'لاتيه إسباني بارد', descriptionEn: 'Iced Spanish latte', imageUrl: 'https://images.pexels.com/photos/38028988/pexels-photo-38028988.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'c2', title: 'إيس سالتد كاراميل', titleEn: 'Ice Salted Caramel Latte', price: 20, rating: 5, badge: 'الأكثر طلبًا', emoji: '🧊', categoryId: 'cold', description: 'لاتيه بارد بالكراميل المملح', descriptionEn: 'Iced salted caramel latte', imageUrl: 'https://images.pexels.com/photos/38028984/pexels-photo-38028984.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'c3', title: 'إيس وايت شوكولات راسبيري', titleEn: 'Ice White Chocolate Raspberry', price: 22, rating: 5, badge: 'جديد', emoji: '🧊', categoryId: 'cold', description: 'لاتيه بارد بالشوكولاتة البيضاء والتوت', descriptionEn: 'Iced white chocolate raspberry', imageUrl: 'https://images.pexels.com/photos/38028987/pexels-photo-38028987.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'c4', title: 'إيس بستاشيو لاتيه', titleEn: 'Ice Pistachio Latte', price: 17, rating: 5, emoji: '🧊', categoryId: 'cold', description: 'لاتيه بارد بالفستق', descriptionEn: 'Iced pistachio latte', imageUrl: 'https://images.pexels.com/photos/38028988/pexels-photo-38028988.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'c5', title: 'إيس سينابون لاتيه', titleEn: 'Ice Cinnabon Latte', price: 17, rating: 4.5, emoji: '🧊', categoryId: 'cold', description: 'لاتيه بارد بالقرفة', descriptionEn: 'Iced Cinnabon latte', imageUrl: 'https://images.pexels.com/photos/38028984/pexels-photo-38028984.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'c6', title: 'إيس وايت شوكولات لاتيه', titleEn: 'Ice White Chocolate Latte', price: 18, rating: 5, emoji: '🧊', categoryId: 'cold', description: 'لاتيه بارد بالشوكولاتة البيضاء', descriptionEn: 'Iced white chocolate latte', imageUrl: 'https://images.pexels.com/photos/38028987/pexels-photo-38028987.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'c7', title: 'إيس فانيليا لاتيه', titleEn: 'Ice Vanilla Latte', price: 15, rating: 4.5, emoji: '🧊', categoryId: 'cold', description: 'لاتيه بارد بالفانيليا', descriptionEn: 'Iced vanilla latte', imageUrl: 'https://images.pexels.com/photos/38028988/pexels-photo-38028988.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'c8', title: 'إيس لاتيه بندق', titleEn: 'Ice Hazelnut Latte', price: 15, rating: 4.5, emoji: '🧊', categoryId: 'cold', description: 'لاتيه بارد بالبندق', descriptionEn: 'Iced hazelnut latte', imageUrl: 'https://images.pexels.com/photos/38028984/pexels-photo-38028984.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'c9', title: 'إيس جنجر لاتيه', titleEn: 'Ice Ginger Latte', price: 17, rating: 5, badge: 'جديد', emoji: '🧊', categoryId: 'cold', description: 'لاتيه بارد بالجنجر', descriptionEn: 'Iced ginger latte', imageUrl: 'https://images.pexels.com/photos/38028987/pexels-photo-38028987.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'c10', title: 'إيس أمريكانو', titleEn: 'Ice Americano', price: 10, rating: 4.5, emoji: '🧊', categoryId: 'cold', description: 'أمريكانو بارد', descriptionEn: 'Iced Americano', imageUrl: 'https://images.pexels.com/photos/38028988/pexels-photo-38028988.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'c11', title: 'إيس فلتر كوفي', titleEn: 'Ice Filter Coffee', price: 6, rating: 4, emoji: '🧊', categoryId: 'cold', description: 'قهوة فلتر باردة', descriptionEn: 'Iced filter coffee', imageUrl: 'https://images.pexels.com/photos/38028984/pexels-photo-38028984.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },

  // Sugar-Free Lattes
  { id: 'sf1', title: 'لاتيه بندق', titleEn: 'Hazelnut Latte', price: 10, rating: 5, badge: 'خالٍ من السكر', emoji: '🥛', categoryId: 'sugarfree', description: 'لاتيه بالبندق خالٍ من السكر', descriptionEn: 'Sugar-free hazelnut latte', optionGroups: sugarFreeOptionGroups, imageUrl: 'https://images.pexels.com/photos/6747870/pexels-photo-6747870.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'sf2', title: 'لاتيه كراميل', titleEn: 'Caramel Latte', price: 10, rating: 5, badge: 'خالٍ من السكر', emoji: '🥛', categoryId: 'sugarfree', description: 'لاتيه بالكراميل خالٍ من السكر', descriptionEn: 'Sugar-free caramel latte', optionGroups: sugarFreeOptionGroups, imageUrl: 'https://images.pexels.com/photos/459489/pexels-photo-459489.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'sf3', title: 'لاتيه فانيليا', titleEn: 'Vanilla Latte', price: 10, rating: 4.5, badge: 'خالٍ من السكر', emoji: '🥛', categoryId: 'sugarfree', description: 'لاتيه بالفانيليا خالٍ من السكر', descriptionEn: 'Sugar-free vanilla latte', optionGroups: sugarFreeOptionGroups, imageUrl: 'https://images.pexels.com/photos/7683595/pexels-photo-7683595.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },

  // Mojitos
  { id: 'm1', title: 'موهيتو', titleEn: 'Mojito', price: 16, rating: 5, badge: 'الأكثر طلبًا', emoji: '🍹', categoryId: 'mojito', description: 'موهيتو منعش باختيار الأساس والنكهة', descriptionEn: 'Refreshing mojito — choose base & flavor', optionGroups: mojitoOptionGroups, imageUrl: 'https://images.pexels.com/photos/37662775/pexels-photo-37662775.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },

  // Milkshakes
  { id: 'mk1', title: 'ميلك شيك نوتيلا', titleEn: 'Nutella Milkshake', price: 25, rating: 5, badge: 'الأكثر طلبًا', emoji: '🥤', categoryId: 'milkshake', description: 'ميلك شيك بالنوتيلا', descriptionEn: 'Nutella milkshake', imageUrl: 'https://images.pexels.com/photos/7656388/pexels-photo-7656388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'mk2', title: 'ميلك شيك فراولة', titleEn: 'Strawberry Milkshake', price: 25, rating: 5, emoji: '🥤', categoryId: 'milkshake', description: 'ميلك شيك بالفراولة', descriptionEn: 'Strawberry milkshake', imageUrl: 'https://images.pexels.com/photos/17612822/pexels-photo-17612822.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'mk3', title: 'ميلك شيك بستاشيو', titleEn: 'Pistachio Milkshake', price: 25, rating: 5, badge: 'جديد', emoji: '🥤', categoryId: 'milkshake', description: 'ميلك شيك بالفستق', descriptionEn: 'Pistachio milkshake', imageUrl: 'https://images.pexels.com/photos/7656388/pexels-photo-7656388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'mk4', title: 'ميلك شيك لوتس', titleEn: 'Lotus Milkshake', price: 25, rating: 5, emoji: '🥤', categoryId: 'milkshake', description: 'ميلك شيك باللوتس', descriptionEn: 'Lotus milkshake', imageUrl: 'https://images.pexels.com/photos/17612822/pexels-photo-17612822.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'mk5', title: 'ميلك شيك كندر', titleEn: 'Kinder Milkshake', price: 25, rating: 5, emoji: '🥤', categoryId: 'milkshake', description: 'ميلك شيك بالكندر', descriptionEn: 'Kinder milkshake', imageUrl: 'https://images.pexels.com/photos/7656388/pexels-photo-7656388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'mk6', title: 'ميلك شيك فانيليا', titleEn: 'Vanilla Milkshake', price: 25, rating: 4.5, emoji: '🥤', categoryId: 'milkshake', description: 'ميلك شيك بالفانيليا', descriptionEn: 'Vanilla milkshake', imageUrl: 'https://images.pexels.com/photos/17612822/pexels-photo-17612822.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'mk7', title: 'ميلك شيك كاراميل', titleEn: 'Caramel Milkshake', price: 25, rating: 4.5, emoji: '🥤', categoryId: 'milkshake', description: 'ميلك شيك بالكراميل', descriptionEn: 'Caramel milkshake', imageUrl: 'https://images.pexels.com/photos/7656388/pexels-photo-7656388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'mk8', title: 'ميلك شيك أوريو', titleEn: 'Oreo Milkshake', price: 25, rating: 5, badge: 'الأكثر طلبًا', emoji: '🥤', categoryId: 'milkshake', description: 'ميلك شيك بالأوريو', descriptionEn: 'Oreo milkshake', imageUrl: 'https://images.pexels.com/photos/17612822/pexels-photo-17612822.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },

  // Sugar-Free Mojitos
  { id: 'sfm1', title: 'موهيتو خوخ خالي من السكر', titleEn: 'Sugar-Free Peach Mojito', price: 16, rating: 5, badge: 'خالٍ من السكر', emoji: '🍹', categoryId: 'mojito', description: 'موهيتو خوخ خالٍ من السكر', descriptionEn: 'Sugar-free peach mojito', optionGroups: sugarFreeMojitoOptionGroups, imageUrl: 'https://images.pexels.com/photos/10839495/pexels-photo-10839495.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'sfm2', title: 'موهيتو فراولة خالي من السكر', titleEn: 'Sugar-Free Strawberry Mojito', price: 16, rating: 5, badge: 'خالٍ من السكر', emoji: '🍹', categoryId: 'mojito', description: 'موهيتو فراولة خالٍ من السكر', descriptionEn: 'Sugar-free strawberry mojito', optionGroups: sugarFreeMojitoOptionGroups, imageUrl: 'https://images.pexels.com/photos/9584965/pexels-photo-9584965.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },

  // Sandwiches
  { id: 'sand1', title: 'ساندويتش تونة', titleEn: 'Tuna Sandwich', price: 10, rating: 5, emoji: '🥪', categoryId: 'sandwiches', description: 'تونة مع جرجير، هريسة، زيتون، ذرة، دجاج، جبنة', descriptionEn: 'Tuna with arugula, harissa, olives, corn, chicken and cheese', optionGroups: sandwichBreadOptions, imageUrl: 'https://images.pexels.com/photos/2955819/pexels-photo-2955819.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'sand2', title: 'ساندويتش رومي مدخن', titleEn: 'Smoked Turkey Sandwich', price: 15, rating: 5, emoji: '🥪', categoryId: 'sandwiches', description: 'رومي مدخن مع جبنة إيمينتال وجبنة مالدينا', descriptionEn: 'Smoked turkey with Emmental and Maldina cheese', optionGroups: sandwichBreadOptions, imageUrl: 'https://images.pexels.com/photos/5713744/pexels-photo-5713744.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },

  // Bagels
  { id: 'bag1', title: 'بيغل تونا بيستو', titleEn: 'Tuna Pesto Bagel', price: 17, rating: 5, badge: 'الأكثر طلبًا', emoji: '🥯', categoryId: 'bagels', description: 'بيغل بالتونة والبيستو', descriptionEn: 'Tuna pesto bagel', imageUrl: 'https://images.pexels.com/photos/12176273/pexels-photo-12176273.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'bag2', title: 'بيغل تركي مدخن', titleEn: 'Smoked Turkey Bagel', price: 18, rating: 5, emoji: '🥯', categoryId: 'bagels', description: 'بيغل بالتركي المدخن', descriptionEn: 'Smoked turkey bagel', imageUrl: 'https://images.pexels.com/photos/12176271/pexels-photo-12176271.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'bag3', title: 'بيغل سلامي مدخن', titleEn: 'Smoked Salami Bagel', price: 18, rating: 4.5, emoji: '🥯', categoryId: 'bagels', description: 'بيغل بالسلامي المدخن', descriptionEn: 'Smoked salami bagel', imageUrl: 'https://images.pexels.com/photos/3892468/pexels-photo-3892468.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },

  // Kroffles
  { id: 'kro1', title: 'كروفِل نوتيلا', titleEn: 'Nutella Kroffle', price: 15, rating: 5, emoji: '🧇', categoryId: 'kroffles', description: 'كروفِل بالنوتيلا', descriptionEn: 'Nutella kroffle', imageUrl: 'https://images.pexels.com/photos/10249461/pexels-photo-10249461.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'kro2', title: 'كروفِل بستاشيو', titleEn: 'Pistachio Kroffle', price: 15, rating: 5, emoji: '🧇', categoryId: 'kroffles', description: 'كروفِل بالفستق', descriptionEn: 'Pistachio kroffle', imageUrl: 'https://images.pexels.com/photos/28402363/pexels-photo-28402363.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'kro3', title: 'كروفِل ميكس نوتيلا وبستاشيو', titleEn: 'Mix Nutella and Pistachio Kroffle', price: 16, rating: 5, badge: 'جديد', emoji: '🧇', categoryId: 'kroffles', description: 'كروفِل بالنوتيلا والفستق', descriptionEn: 'Nutella and pistachio kroffle', imageUrl: 'https://images.pexels.com/photos/39240989/pexels-photo-39240989.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'kro4', title: 'كروفِل لوتس', titleEn: 'Lotus Kroffle', price: 15, rating: 5, emoji: '🧇', categoryId: 'kroffles', description: 'كروفِل باللوتس', descriptionEn: 'Lotus kroffle', imageUrl: 'https://images.pexels.com/photos/10249461/pexels-photo-10249461.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'kro5', title: 'كروفِل كندر بوينو', titleEn: 'Kinder Bueno Kroffle', price: 16, rating: 5, emoji: '🧇', categoryId: 'kroffles', description: 'كروفِل بالكندر بوينو', descriptionEn: 'Kinder Bueno kroffle', imageUrl: 'https://images.pexels.com/photos/28402363/pexels-photo-28402363.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'kro6', title: 'كروفِل زبدة فول سوداني بالعسل', titleEn: 'Peanut Butter and Honey Kroffle', price: 14, rating: 4.5, emoji: '🧇', categoryId: 'kroffles', description: 'كروفِل بزبدة الفول السوداني والعسل', descriptionEn: 'Peanut butter and honey kroffle', imageUrl: 'https://images.pexels.com/photos/39240989/pexels-photo-39240989.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'kro7', title: 'كروفِل تركي مدخن بالجبنة', titleEn: 'Smoked Turkey Savory Kroffle', price: 16, rating: 5, emoji: '🧇', categoryId: 'kroffles', description: 'كروفِل مالح بالتركي المدخن والجبنة', descriptionEn: 'Savory kroffle with smoked turkey and cheese', imageUrl: 'https://images.pexels.com/photos/10249461/pexels-photo-10249461.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'kro8', title: 'كروفِل فيلادلفيا بالعسل', titleEn: 'Philadelphia Cheese and Honey Kroffle', price: 16, rating: 4.5, emoji: '🧇', categoryId: 'kroffles', description: 'كروفِل مالح بجبنة فيلادلفيا والعسل', descriptionEn: 'Savory kroffle with Philadelphia cheese and honey', imageUrl: 'https://images.pexels.com/photos/28402363/pexels-photo-28402363.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },

  // Iced Tea
  { id: 'tea1', title: 'شاي مثلج توت', titleEn: 'Raspberry Iced Tea', price: 15, rating: 5, emoji: '🫖', categoryId: 'icedtea', description: 'شاي مثلج بنكهة التوت', descriptionEn: 'Raspberry iced tea', imageUrl: 'https://images.pexels.com/photos/8215110/pexels-photo-8215110.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'tea2', title: 'شاي مثلج خوخ', titleEn: 'Peach Iced Tea', price: 15, rating: 5, emoji: '🫖', categoryId: 'icedtea', description: 'شاي مثلج بنكهة الخوخ', descriptionEn: 'Peach iced tea', imageUrl: 'https://images.pexels.com/photos/8215110/pexels-photo-8215110.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'tea3', title: 'شاي مثلج ليمون', titleEn: 'Lemon Iced Tea', price: 15, rating: 4.5, emoji: '🫖', categoryId: 'icedtea', description: 'شاي مثلج بالليمون', descriptionEn: 'Lemon iced tea', imageUrl: 'https://images.pexels.com/photos/8215110/pexels-photo-8215110.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },

  // Matcha
  { id: 'ma1', title: 'ماتشا مانجو', titleEn: 'Mango Matcha', price: 26, rating: 5, badge: 'جديد', emoji: '🍵', categoryId: 'matcha', description: 'ماتشا بالمانجو', descriptionEn: 'Mango matcha', imageUrl: 'https://images.pexels.com/photos/8215110/pexels-photo-8215110.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'ma2', title: 'ماتشا فراولة', titleEn: 'Strawberry Matcha', price: 26, rating: 5, badge: 'جديد', emoji: '🍵', categoryId: 'matcha', description: 'ماتشا بالفراولة', descriptionEn: 'Strawberry matcha', imageUrl: 'https://images.pexels.com/photos/7656388/pexels-photo-7656388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'ma3', title: 'ماتشا كلاسيك بالعسل', titleEn: 'Classic Honey Matcha', price: 25, rating: 5, emoji: '🍵', categoryId: 'matcha', description: 'ماتشا كلاسيك بالعسل', descriptionEn: 'Classic honey matcha', imageUrl: 'https://images.pexels.com/photos/8215110/pexels-photo-8215110.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
];

export const featuredProducts: Product[] = [
  products[0],
  products[8],
  products[2],
  products[27],
];

export const ourPicks: CartItem[] = [
  { id: 'pick1', name: 'سبانش لاتيه', nameEn: 'Spanish Latte', price: 12, quantity: 0, image: '☕' },
  { id: 'pick2', name: 'إيس سالتد كاراميل', nameEn: 'Ice Salted Caramel', price: 20, quantity: 0, image: '🧊' },
  { id: 'pick3', name: 'موهيتو', nameEn: 'Mojito', price: 16, quantity: 0, image: '🍹' },
  { id: 'pick4', name: 'ميلك شيك أوريو', nameEn: 'Oreo Milkshake', price: 25, quantity: 0, image: '🥤' },
];

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  orderDate: string;
  status: 'مكتمل' | 'قيد التحضير' | 'جاهز';
}

export const recentOrders: OrderItem[] = [
  { id: 'o1', product: products[0], quantity: 2, orderDate: '٩ سبتمبر', status: 'مكتمل' },
  { id: 'o2', product: products[8], quantity: 1, orderDate: '٨ سبتمبر', status: 'مكتمل' },
  { id: 'o3', product: products[2], quantity: 1, orderDate: '٧ سبتمبر', status: 'مكتمل' },
  { id: 'o4', product: products[27], quantity: 2, orderDate: '٥ سبتمبر', status: 'مكتمل' },
];

export const activeOrder: {
  arrivalTime: string;
  status: 'قيد التحضير';
  items: { product: Product; quantity: number }[];
} = {
  arrivalTime: '٩:٣٥ صباحًا',
  status: 'قيد التحضير',
  items: [
    { product: products[0], quantity: 1 },
    { product: products[27], quantity: 1 },
  ],
};

export const rewardsProducts: Product[] = [
  { id: 'rw1', title: 'كوبون مشروب مجاني', titleEn: 'Free Drink Voucher', price: 0, originalPrice: 12, rating: 5, badge: 'مكافأة', emoji: '🎁', categoryId: 'hot', description: 'استبدل بـ ١٠٠ نقطة', descriptionEn: 'Redeem with 100 points' },
  { id: 'rw2', title: 'كوبون ميلك شيك مجاني', titleEn: 'Free Milkshake Voucher', price: 0, originalPrice: 25, rating: 5, badge: 'مكافأة', emoji: '🎁', categoryId: 'milkshake', description: 'استبدل بـ ١٥٠ نقطة', descriptionEn: 'Redeem with 150 points' },
  { id: 'rw3', title: 'اشترِ واحدًا واحصل على الثاني مجانًا', titleEn: 'Buy 1 Get 1 Coffee', price: 12, originalPrice: 24, rating: 5, badge: 'مكافأة', emoji: '☕', categoryId: 'hot', description: 'استبدل بـ ٢٠٠ نقطة', descriptionEn: 'Redeem with 200 points' },
  { id: 'rw4', title: 'موهيتو مجاني', titleEn: 'Free Mojito', price: 0, originalPrice: 16, rating: 5, badge: 'مكافأة', emoji: '🍹', categoryId: 'mojito', description: 'استبدل بـ ١٢٠ نقطة', descriptionEn: 'Redeem with 120 points' },
];
