'use client';

import { MenuItem, Category } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ShopProps {
  items: MenuItem[];
  onBuy: (item: MenuItem) => void;
  disabled: boolean;
  round: number;
  category: Category;
}

const categoryIcons: Record<Category, string> = {
    'Side Dish': '🍱',
    'Fruit': '🍎',
    'Drink': '🧃',
    'Container': '🥡',
    'Snack': '🍪',
}

const Shop = ({ items, onBuy, disabled, category, round }: ShopProps) => {

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
            <CardTitle className="font-headline text-2xl">Item Shop</CardTitle>
            <Badge variant="secondary" className="text-lg">Round {round}</Badge>
        </div>
        <h3 className="text-xl font-semibold font-headline flex items-center gap-2">
            {categoryIcons[category]} {category}
        </h3>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[75vh] pr-4">
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.length > 0 ? items.map(item => (
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
                )) : <p className="text-sm text-muted-foreground col-span-full">No items available in this category for this round.</p>}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Shop;
