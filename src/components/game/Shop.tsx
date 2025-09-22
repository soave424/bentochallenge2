'use client';

import { MenuItem, Category, CATEGORY_NAMES } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Utensils, Smile, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShopProps {
  items: MenuItem[];
  onBuy: (item: MenuItem) => void;
  disabled: boolean;
  round: number;
  category: Category;
  purchasedItemIds: string[];
}

const categoryIcons: Record<Category, string> = {
    'Side Dish': '🍱',
    'Fruit': '🍎',
    'Drink': '🧃',
    'Container': '🥡',
    'Snack': '🍪',
}

const Shop = ({ items, onBuy, disabled, category, round, purchasedItemIds }: ShopProps) => {

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
            <CardTitle className="font-headline text-2xl">아이템 상점</CardTitle>
            <Badge variant="secondary" className="text-lg">라운드 {round}</Badge>
        </div>
        <h3 className="text-xl font-semibold font-headline flex items-center gap-2">
            {categoryIcons[category]} {CATEGORY_NAMES[category]}
        </h3>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[75vh] pr-4">
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
                {items.length > 0 ? items.map(item => {
                    const isPurchased = purchasedItemIds.includes(item.id);
                    const isShopDisabled = disabled || isPurchased;

                    return (
                        <TooltipProvider key={item.id}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Card
                                        onClick={() => !isShopDisabled && onBuy(item)}
                                        className={cn(`overflow-hidden transition-all duration-200 transform hover:-translate-y-1`,
                                        isShopDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-lg'
                                        )}
                                    >
                                        <div className="aspect-square relative w-full">
                                        <Image
                                            src={`https://picsum.photos/seed/${item.image}/200/200`}
                                            alt={item.name}
                                            data-ai-hint={item.imageHint}
                                            fill
                                            className="object-cover"
                                        />
                                        {isPurchased && (
                                             <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <Badge variant="destructive">품절</Badge>
                                            </div>
                                        )}
                                            <div className="absolute top-1 right-1">
                                            <Badge>{item.price} 씨앗</Badge>
                                            </div>
                                        </div>
                                        <div className="p-2 text-center">
                                        <p className="text-sm font-semibold truncate">{item.name}</p>
                                        </div>
                                    </Card>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="space-y-1">
                                        <p className="font-bold">{item.name}</p>
                                        <div className="flex items-center gap-2 text-sm"><Utensils className="w-4 h-4 text-orange-500" /> 맛: {item.taste}</div>
                                        <div className="flex items-center gap-2 text-sm"><Smile className="w-4 h-4 text-blue-500" /> 편리함: {item.convenience}</div>
                                        <div className="flex items-center gap-2 text-sm"><Leaf className="w-4 h-4 text-green-500" /> 친환경: {item.eco}</div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )
                }) : <p className="text-sm text-muted-foreground col-span-full">이 카테고리에는 지금 살 수 있는 아이템이 없습니다.</p>}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Shop;
