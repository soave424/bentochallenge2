'use client';

import { useState, useEffect } from 'react';
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
  onSkip: () => void;
  canSkip: boolean;
}

const DiceIcon = ({ value }: { value: number }) => {
  const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  const Icon = icons[value - 1];
  return <Icon className="w-10 h-10" />;
};

const Controls = ({ phase, dice, onRoll, onSkip, canSkip }: ControlsProps) => {
  const [isRolling, setIsRolling] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendBentoItemsOutput['recommendations'] | null>(null);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);
  const [displayDice, setDisplayDice] = useState<[number,number]>(dice);

  useEffect(() => {
    if (phase !== 'rolling') {
        setDisplayDice(dice);
    }
  }, [dice, phase]);

  const handleRoll = () => {
    setIsRolling(true);
    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      setDisplayDice([Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]);
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
      // This function is not fully implemented in the provided context
      // but we keep the structure.
      setIsRecommendationLoading(true);
      // Mock API call for now
      setTimeout(() => {
        setRecommendations([
            { name: "AI 추천 아이템", reason: "AI 추천 기능은 현재 개발 중입니다." }
        ]);
        setIsRecommendationLoading(false);
      }, 1000);
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-center items-center gap-4">
          <DiceIcon value={displayDice[0]} />
          <DiceIcon value={displayDice[1]} />
        </div>
        <Button
          onClick={handleRoll}
          disabled={phase !== 'rolling' || isRolling}
          className="w-full text-lg"
        >
          {isRolling ? '주사위 굴리는 중...' : '주사위 굴리기 (보너스 카드)'}
        </Button>
        {canSkip && (
             <Button
                onClick={onSkip}
                variant="outline"
                className="w-full"
            >
                구매할 아이템 없음 (턴 넘기기)
            </Button>
        )}

        <Separator />
        
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="secondary" className="w-full" onClick={handleGetRecommendation} disabled={isRecommendationLoading}>
                   {isRecommendationLoading ? '생각 중...' : <><Bot className="mr-2 h-4 w-4" /> AI 추천</>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none flex items-center gap-2"><Sparkles className="w-4 h-4 text-accent"/> AI 제안</h4>
                        <p className="text-sm text-muted-foreground">
                        도시락을 개선할 아이디어입니다!
                        </p>
                    </div>
                    <div className="grid gap-2">
                    {recommendations ? recommendations.map((rec, i) => (
                        <div key={i} className="text-sm p-2 bg-secondary/50 rounded-md">
                            <p className="font-bold">{rec.name}</p>
                            <p className="text-muted-foreground">{rec.reason}</p>
                        </div>
                    )) : <p className="text-sm text-muted-foreground">버튼을 눌러 추천을 받아보세요.</p>}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
};

export default Controls;
