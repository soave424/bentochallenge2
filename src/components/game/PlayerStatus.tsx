'use client';

import Image from 'next/image';
import { Player, Score, MenuItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Leaf, Smile, Utensils, Award } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PlayerStatusProps {
  player: Player;
  score: Score;
  isCurrent: boolean;
}

const BentoSlot = ({ item }: { item?: MenuItem }) => {
    if (!item) {
        return <div className="aspect-square bg-muted/50 rounded-md"></div>
    }
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="aspect-square bg-muted/50 rounded-md relative overflow-hidden">
                         <Image
                          src={`https://picsum.photos/seed/${item.image}/100/100`}
                          alt={item.name}
                          data-ai-hint={item.imageHint}
                          fill
                          className="object-cover"
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="font-bold">{item.name}</p>
                    <p>맛: {item.taste}, 편리: {item.convenience}, 친환경: {item.eco}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

const PlayerStatus = ({ player, score, isCurrent }: PlayerStatusProps) => {
    const container = player.bento.find(item => item.category === 'Container');
    const foodItems = player.bento.filter(item => item.category !== 'Container');

  return (
    <Card className={cn("transition-all", isCurrent ? 'ring-2 ring-primary shadow-lg' : 'opacity-80', player.eliminated && 'opacity-40 bg-destructive/10')}>
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-headline">{player.name} {player.isHuman && '(나)'}</CardTitle>
            {player.eliminated ? (
                <Badge variant="destructive">탈락</Badge>
            ) : (
                <Badge variant="secondary">{player.seeds} 씨앗</Badge>
            )}
        </div>
        <div className="flex gap-4 text-sm pt-1">
            <div className="flex items-center gap-1" title="맛"><Utensils className="w-4 h-4 text-orange-500" /> <span className="font-bold">{score.taste}</span></div>
            <div className="flex items-center gap-1" title="편리함"><Smile className="w-4 h-4 text-blue-500" /> <span className="font-bold">{score.convenience}</span></div>
            <div className="flex items-center gap-1" title="친환경"><Leaf className="w-4 h-4 text-green-500" /> <span className="font-bold">{score.eco}</span></div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-4">
        <h4 className="font-semibold mb-2">내 도시락</h4>
        <div className="relative w-full aspect-[4/3] bg-secondary/30 rounded-lg p-2 flex items-center justify-center">
            {container && (
                 <Image
                    src={`https://picsum.photos/seed/${container.image}/400/300`}
                    alt={container.name}
                    data-ai-hint={container.imageHint}
                    fill
                    className="object-contain opacity-50"
                />
            )}
            <div className="relative grid grid-cols-2 grid-rows-2 gap-2 w-4/5 h-4/5">
                <BentoSlot item={foodItems[0]} />
                <BentoSlot item={foodItems[1]} />
                <BentoSlot item={foodItems[2]} />
                <BentoSlot item={foodItems[3]} />
            </div>
        </div>
        
         {player.bonusCards.length > 0 && 
            <>
                <Separator className="my-3"/>
                <h4 className="font-semibold mb-2 flex items-center gap-2"><Award className="w-4 h-4"/> 보너스 카드</h4>
                <div className="flex flex-wrap gap-1 mt-2">
                    {player.bonusCards.map((card, i) => (
                        <TooltipProvider key={`${card.id}-${i}`}>
                            <Tooltip>
                                <TooltipTrigger>
                                <Badge variant={card.type === 'Campaign' ? 'default' : 'destructive'} className="bg-opacity-70">{card.name}</Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{card.description}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
            </>
         }
      </CardContent>
    </Card>
  );
};

export default PlayerStatus;
