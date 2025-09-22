'use client';

import { MenuItem, Category, CATEGORIES } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ShopProps {
  items: MenuItem[];
  onBuy: (item: MenuItem) => void;
  disabled: boolean;
}

const categoryIcons: Record<Category, string> = {
    'Side Dish': '🍱',
    'Fruit': '🍎',
    'Drink': '🧃',
    'Container': '🥡',
    'Snack': '🍪',
}

const Shop = ({ items, onBuy, disabled }: ShopProps) => {
  const itemsByCategory = CATEGORIES.reduce((acc, category) => {
    acc[category] = items.filter(item => item.category === category);
    return acc;
  }, {} as Record<Category, MenuItem[]>);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Item Shop</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[75vh] pr-4">
          <div className="space-y-6">
            {CATEGORIES.map(category => (
              <div key={category}>
                <h3 className="text-xl font-semibold font-headline mb-2 flex items-center gap-2">
                    {categoryIcons[category]} {category}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {itemsByCategory[category].map(item => (
                    <Card
                      key={item.id}
                      onClick={() => !disabled && onBuy(item)}
                      className={`overflow-hidden transition-all duration-200 transform hover:-translate-y-1 ${
                        disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:shadow-lg'
                      }`}
                    >
                      <div className="aspect-square relative w-full">
                        <Image
                          src={`https://picsum.photos/seed/${item.image}/200/200`}
                          alt={item.name}
                          data-ai-hint={item.imageHint}
                          fill
                          className="object-cover"
                        />
                         <div className="absolute top-1 right-1">
                            <Badge>{item.price} Seeds</Badge>
                         </div>
                      </div>
                      <div className="p-2 text-center">
                        <p className="text-sm font-semibold truncate">{item.name}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Shop;
