'use client';

import { useState } from 'react';
import type { GamePhase, Player, MenuItem, RecommendBentoItemsOutput } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Bot, Sparkles } from 'lucide-react';
import { getAiRecommendations } from '@/app/actions';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

interface ControlsProps {
  phase: GamePhase;
  dice: [number, number];
  onRoll: (d1: number, d2: number) => void;
  player: Player | undefined;
  shopItems: MenuItem[];
  onSkip: () => void;
}

const DiceIcon = ({ value }: { value: number }) => {
  const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  const Icon = icons[value - 1];
  return <Icon className="w-10 h-10" />;
};

const Controls = ({ phase, dice, onRoll, player, shopItems, onSkip }: ControlsProps) => {
  const [isRolling, setIsRolling] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendBentoItemsOutput['recommendations'] | null>(null);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);

  const handleRoll = () => {
    setIsRolling(true);
    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        setIsRolling(false);
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        onRoll(d1, d2);
      }
    }, 100);
  };
  
  const handleGetRecommendation = async () => {
      if (!player) return;
      setIsRecommendationLoading(true);
      const availableItemsForAI = shopItems.map(i => ({...i, environmental: i.eco}));
      const currentBentoForAI = player.bento.map(i => ({...i, environmental: i.eco}));
      const res = await getAiRecommendations({
          remainingBudget: player.seeds,
          currentBento: currentBentoForAI,
          availableItems: availableItemsForAI,
          bonusCards: player.bonusCards.map(c => ({name: c.name, description: c.description, effect: ''}))
      });
      setRecommendations(res.recommendations);
      setIsRecommendationLoading(false);
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-center items-center gap-4">
          <DiceIcon value={isRolling ? Math.floor(Math.random() * 6) + 1 : dice[0]} />
          <DiceIcon value={isRolling ? Math.floor(Math.random() * 6) + 1 : dice[1]} />
        </div>
        <Button
          onClick={handleRoll}
          disabled={phase !== 'rolling' || isRolling}
          className="w-full text-lg"
        >
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </Button>
        {phase === 'buying' && (
             <Button
                onClick={onSkip}
                variant="outline"
                className="w-full"
            >
                Skip Buying
            </Button>
        )}

        <Separator />
        
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="secondary" className="w-full" onClick={handleGetRecommendation} disabled={isRecommendationLoading}>
                   {isRecommendationLoading ? 'Thinking...' : <><Bot className="mr-2 h-4 w-4" /> AI Recommendation</>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none flex items-center gap-2"><Sparkles className="w-4 h-4 text-accent"/> AI Suggestions</h4>
                        <p className="text-sm text-muted-foreground">
                        Here are some ideas to improve your bento!
                        </p>
                    </div>
                    <div className="grid gap-2">
                    {recommendations ? recommendations.map((rec, i) => (
                        <div key={i} className="text-sm p-2 bg-secondary/50 rounded-md">
                            <p className="font-bold">{rec.name}</p>
                            <p className="text-muted-foreground">{rec.reason}</p>
                        </div>
                    )) : <p className="text-sm text-muted-foreground">Click to get recommendations.</p>}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
};

export default Controls;
