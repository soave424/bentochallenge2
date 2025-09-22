
'use client';

import Image from 'next/image';
import { Player, Score, MenuItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Leaf, Smile, Utensils, Award, Coins, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { INITIAL_SEEDS } from '@/lib/constants';
import { calculatePlayerScore } from '@/lib/scoring';


interface ScoreSliderProps {
  value: number;
  label: string;
  Icon: React.ElementType;
  iconColor: string;
  isCompact?: boolean;
}

const ScoreSlider = ({ value, label, Icon, iconColor, isCompact }: ScoreSliderProps) => {
  const min = -20;
  const max = 20;
  const percentage = ((Math.max(min, Math.min(value, max)) - min) / (max - min)) * 100;
  const isNegative = value < 0;

  return (
    <div className={cn("space-y-1", isCompact && "space-y-0.5")}>
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-1">
          <Icon className={cn('w-3.5 h-3.5', iconColor)} />
          {!isCompact && <span>{label}</span>}
        </div>
        <span className="font-bold">{value}</span>
      </div>
      {!isCompact && (
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
      )}
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
                    <div className="aspect-square bg-muted/50 rounded-md relative overflow-hidden group">
                         <Image
                          src={item.image}
                          alt={item.name}
                          data-ai-hint={item.imageHint}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/50 p-1 text-center">
                            <p className="text-white text-xs font-semibold truncate">{item.name}</p>
                        </div>
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

interface PlayerStatusProps {
    player: Player;
    isCurrent: boolean;
    isCompact?: boolean;
}

const PlayerStatus = ({ player, isCurrent, isCompact = false }: PlayerStatusProps) => {
    const { score } = calculatePlayerScore(player, false);
    const container = player.bento.find(item => item.category === 'Container');
    const foodItems = player.bento.filter(item => item.category !== 'Container');

  if (isCompact) {
    return (
        <Card className={cn("transition-all", isCurrent ? 'ring-2 ring-primary shadow-lg' : '')}>
             <div className="p-3">
                <div className="flex justify-between items-center text-sm">
                    <p className="font-bold truncate shrink-0 mr-2">{player.name}</p>
                    <div className="flex items-center gap-2 text-xs shrink-0 overflow-x-auto">
                        <Separator orientation="vertical" className="h-4"/>
                        <div className="flex items-center gap-1" title="맛"><Utensils className="w-4 h-4 text-orange-500 shrink-0" /><span>{score.taste}</span></div>
                        <div className="flex items-center gap-1" title="편리함"><Smile className="w-4 h-4 text-blue-500 shrink-0" /><span>{score.convenience}</span></div>
                        <div className="flex items-center gap-1" title="친환경"><Leaf className="w-4 h-4 text-green-500 shrink-0" /><span>{score.eco}</span></div>
                         <Separator orientation="vertical" className="h-4"/>
                        <div className="flex items-center gap-1 font-semibold" title="시드"><Coins className="w-4 h-4 text-amber-500 shrink-0"/><span>{player.seeds}</span></div>
                    </div>
                </div>
             </div>
        </Card>
    )
  }

  return (
    <Card className={cn("transition-all", isCurrent ? 'ring-2 ring-primary shadow-lg' : '')}>
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-headline">{player.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500"/>
                 <span className="font-semibold text-sm">({player.seeds}/{INITIAL_SEEDS})</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: INITIAL_SEEDS }).map((_, i) => (
                      <div key={i} className={cn("w-2 h-4 rounded-sm", i < player.seeds ? 'bg-amber-400' : 'bg-muted')}/>
                  ))}
                </div>
              </div>
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
                    src={container.image}
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
                <div className="flex flex-wrap gap-2 mt-2">
                    {player.bonusCards.map((card, i) => (
                       <TooltipProvider key={`${card.id}-${i}`}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="w-12 h-16 bg-muted rounded-md flex items-center justify-center border-2 border-dashed border-primary/50">
                                        <HelpCircle className="w-6 h-6 text-primary/80"/>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>비밀 보너스 카드</p>
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
