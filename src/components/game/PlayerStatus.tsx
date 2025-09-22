'use client';

import { Player, Score, Category, CATEGORIES } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Leaf, Smile, CheckCircle, XCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PlayerStatusProps {
  player: Player;
  score: Score;
  isCurrent: boolean;
}

const PlayerStatus = ({ player, score, isCurrent }: PlayerStatusProps) => {
    const bentoCategories = new Set(player.bento.map(item => item.category));
    const hasAllCategories = bentoCategories.size === CATEGORIES.length;

  return (
    <Card className={cn("transition-all", isCurrent ? 'ring-2 ring-primary shadow-lg' : 'opacity-80', player.eliminated && 'opacity-40 bg-destructive/10')}>
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-headline">{player.name} {player.isHuman && '(You)'}</CardTitle>
            {player.eliminated ? (
                <Badge variant="destructive">Eliminated</Badge>
            ) : (
                <Badge variant="secondary">{player.seeds} Seeds</Badge>
            )}
        </div>
        <div className="flex gap-4 text-sm pt-1">
            <div className="flex items-center gap-1"><Smile className="w-4 h-4 text-blue-500" /> Taste/Convenience: <span className="font-bold">{score.consumption}</span></div>
            <div className="flex items-center gap-1"><Leaf className="w-4 h-4 text-green-500" /> Eco: <span className="font-bold">{score.eco}</span></div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-4">
        <div className="mb-2">
            <h4 className="font-semibold mb-2">Category Checklist</h4>
            <TooltipProvider>
            <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map(cat => (
                    <Tooltip key={cat}>
                        <TooltipTrigger>
                            <Badge variant={bentoCategories.has(cat) ? 'default' : 'outline'} className="flex gap-1 items-center">
                                {bentoCategories.has(cat) ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>{cat}</TooltipContent>
                    </Tooltip>
                ))}
            </div>
            </TooltipProvider>
        </div>
        <Separator className="my-2"/>
        <h4 className="font-semibold mb-2">Bento Box</h4>
        <div className="flex flex-wrap gap-1">
          {player.bento.length === 0 ? (
            <p className="text-xs text-muted-foreground">No items yet.</p>
          ) : (
            player.bento.map(item => (
                <TooltipProvider key={item.id}>
                    <Tooltip>
                        <TooltipTrigger>
                           <Badge variant="outline">{item.name}</Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Price: {item.price}, Taste: {item.taste}, Convenience: {item.convenience}, Eco: {item.eco}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))
          )}
        </div>
         {player.bonusCards.length > 0 && <Separator className="my-2"/>}
         <div className="flex flex-wrap gap-1 mt-2">
            {player.bonusCards.map((card, i) => (
                <TooltipProvider key={`${card.id}-${i}`}>
                     <Tooltip>
                        <TooltipTrigger>
                           <Badge variant={card.type === 'Campaign' ? 'default' : 'destructive'} className="bg-opacity-50">{card.name}</Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{card.description}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerStatus;
