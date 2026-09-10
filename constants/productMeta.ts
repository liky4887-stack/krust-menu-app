export interface ProductMeta {
  prepTime: string;
  calories?: number;
  addOnIds?: string[];
}

export const productMeta: Record<string, ProductMeta> = {
  h1: { prepTime: '5 دقائق', calories: 180, addOnIds: ['kro1', 'bag1'] },
  h2: { prepTime: '5 دقائق', calories: 220, addOnIds: ['kro2', 'bag2'] },
  h3: { prepTime: '5 دقائق', calories: 200, addOnIds: ['kro4', 'sand1'] },
  h4: { prepTime: '4 دقائق', calories: 190, addOnIds: ['kro1', 'bag1'] },
  h5: { prepTime: '5 دقائق', calories: 240, addOnIds: ['kro5', 'bag2'] },
  h6: { prepTime: '4 دقائق', calories: 160, addOnIds: ['kro3', 'sand2'] },
  h7: { prepTime: '4 دقائق', calories: 170, addOnIds: ['kro1', 'bag3'] },
  h8: { prepTime: '5 دقائق', calories: 210, addOnIds: ['kro6', 'bag1'] },
  c1: { prepTime: '4 دقائق', calories: 190, addOnIds: ['kro2', 'bag1'] },
  c2: { prepTime: '4 دقائق', calories: 230, addOnIds: ['kro1', 'sand1'] },
  c3: { prepTime: '5 دقائق', calories: 250, addOnIds: ['kro4', 'bag2'] },
  c4: { prepTime: '4 دقائق', calories: 200, addOnIds: ['kro5', 'sand2'] },
  c5: { prepTime: '4 دقائق', calories: 200, addOnIds: ['kro1', 'bag3'] },
  c6: { prepTime: '4 دقائق', calories: 240, addOnIds: ['kro3', 'bag1'] },
  c7: { prepTime: '3 دقائق', calories: 170, addOnIds: ['kro2', 'sand1'] },
  c8: { prepTime: '3 دقائق', calories: 180, addOnIds: ['kro1', 'bag2'] },
  c9: { prepTime: '4 دقائق', calories: 210, addOnIds: ['kro6', 'sand2'] },
  c10: { prepTime: '2 دقائق', calories: 80, addOnIds: ['kro1', 'bag1'] },
  c11: { prepTime: '2 دقائق', calories: 60, addOnIds: ['kro2', 'sand1'] },
  sf1: { prepTime: '4 دقائق', calories: 90, addOnIds: ['kro4', 'sand2'] },
  sf2: { prepTime: '4 دقائق', calories: 90, addOnIds: ['kro1', 'bag1'] },
  sf3: { prepTime: '4 دقائق', calories: 80, addOnIds: ['kro2', 'bag3'] },
  m1: { prepTime: '5 دقائق', calories: 120, addOnIds: ['kro1', 'sand1'] },
  sfm1: { prepTime: '5 دقائق', calories: 60, addOnIds: ['kro2', 'sand2'] },
  sfm2: { prepTime: '5 دقائق', calories: 65, addOnIds: ['kro1', 'bag1'] },
  mk1: { prepTime: '4 دقائق', calories: 380, addOnIds: ['kro2', 'bag2'] },
  mk2: { prepTime: '4 دقائق', calories: 340, addOnIds: ['kro1', 'sand1'] },
  mk3: { prepTime: '4 دقائق', calories: 360, addOnIds: ['kro4', 'bag3'] },
  mk4: { prepTime: '4 دقائق', calories: 400, addOnIds: ['kro5', 'sand2'] },
  mk5: { prepTime: '4 دقائق', calories: 390, addOnIds: ['kro3', 'bag1'] },
  mk6: { prepTime: '4 دقائق', calories: 320, addOnIds: ['kro1', 'sand1'] },
  mk7: { prepTime: '4 دقائق', calories: 350, addOnIds: ['kro2', 'bag2'] },
  mk8: { prepTime: '4 دقائق', calories: 410, addOnIds: ['kro4', 'bag3'] },
  sand1: { prepTime: '7 دقائق', calories: 280, addOnIds: ['h1', 'c10'] },
  sand2: { prepTime: '7 دقائق', calories: 320, addOnIds: ['h2', 'c1'] },
  bag1: { prepTime: '6 دقائق', calories: 350, addOnIds: ['h1', 'c2'] },
  bag2: { prepTime: '6 دقائق', calories: 380, addOnIds: ['h2', 'c1'] },
  bag3: { prepTime: '6 دقائق', calories: 360, addOnIds: ['h3', 'c4'] },
  kro1: { prepTime: '5 دقائق', calories: 290, addOnIds: ['h1', 'c2'] },
  kro2: { prepTime: '5 دقائق', calories: 300, addOnIds: ['h2', 'c1'] },
  kro3: { prepTime: '5 دقائق', calories: 320, addOnIds: ['h3', 'c4'] },
  kro4: { prepTime: '5 دقائق', calories: 280, addOnIds: ['h4', 'c5'] },
  kro5: { prepTime: '5 دقائق', calories: 310, addOnIds: ['h5', 'c6'] },
  kro6: { prepTime: '5 دقائق', calories: 270, addOnIds: ['h6', 'c7'] },
  kro7: { prepTime: '6 دقائق', calories: 340, addOnIds: ['h7', 'c8'] },
  kro8: { prepTime: '6 دقائق', calories: 330, addOnIds: ['h8', 'c9'] },
  tea1: { prepTime: '3 دقائق', calories: 90, addOnIds: ['kro1', 'sand1'] },
  tea2: { prepTime: '3 دقائق', calories: 85, addOnIds: ['kro2', 'sand2'] },
  tea3: { prepTime: '3 دقائق', calories: 70, addOnIds: ['kro1', 'bag1'] },
  ma1: { prepTime: '5 دقائق', calories: 150, addOnIds: ['kro2', 'bag2'] },
  ma2: { prepTime: '5 دقائق', calories: 140, addOnIds: ['kro1', 'sand1'] },
  ma3: { prepTime: '5 دقائق', calories: 120, addOnIds: ['kro4', 'bag3'] },
};

export function getMeta(productId: string): ProductMeta {
  return productMeta[productId] ?? { prepTime: '5 دقائق' };
}
