'use client';

import Image from 'next/image';
import { Player, Score, MenuItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Leaf, Smile, Utensils, Award, Coins } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { INITIAL_SEEDS } from '@/lib/constants';

interface ScoreSliderProps {
  value: number;
  label: string;
  Icon: React.ElementType;
  iconColor: string;
}

const ScoreSlider = ({ value, label, Icon, iconColor }: ScoreSliderProps) => {
  const min = -20;
  const max = 20;
  const percentage = ((Math.max(min, Math.min(value, max)) - min) / (max - min)) * 100;
  const isNegative = value < 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-1">
          <Icon className={cn('w-3.5 h-3.5', iconColor)} />
          <span>{label}</span>
        </div>
        <span className="font-bold">{value}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2.5 relative overflow-hidden">
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-background z-10"></div>
        <div
          className={cn(
            'h-full rounded-full absolute',
            isNegative ? 'bg-red-500' : 'bg-blue-500'
          )}
          style={{
            left: isNegative ? `${percentage}%` : '50%',
            right: isNegative ? '50%' : `${100 - percentage}%`,
            transition: 'all 0.5s ease-in-out',
          }}
        ></div>
      </div>
    </div>
  );
};


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
    const foodItems = player.bento.filter(item => item.category !== 'Container' && item.category !== 'Drink');

  return (
    <Card className={cn("transition-all", isCurrent ? 'ring-2 ring-primary shadow-lg' : '', player.eliminated && 'opacity-40 bg-destructive/10')}>
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-headline">{player.name} {player.isHuman && '(나)'}</CardTitle>
            {player.eliminated ? (
                <Badge variant="destructive">탈락</Badge>
            ) : (
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500"/>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: INITIAL_SEEDS }).map((_, i) => (
                      <div key={i} className={cn("w-2 h-4 rounded-sm", i < player.seeds ? 'bg-amber-400' : 'bg-muted')}/>
                  ))}
                </div>
              </div>
            )}
        </div>
        <div className="flex flex-col gap-3 text-sm pt-4">
            <ScoreSlider value={score.taste} label="맛" Icon={Utensils} iconColor="text-orange-500" />
            <ScoreSlider value={score.convenience} label="편리함" Icon={Smile} iconColor="text-blue-500" />
            <ScoreSlider value={score.eco} label="친환경" Icon={Leaf} iconColor="text-green-500" />
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
