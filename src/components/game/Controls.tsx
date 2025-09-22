'use client';

import { useState, useEffect } from 'react';
import type { GamePhase } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, ChevronRight } from 'lucide-react';

interface ControlsProps {
  phase: GamePhase;
  dice: [number, number];
  onRoll: () => void;
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
  const [displayDice, setDisplayDice] = useState<[number,number]>(dice);

  useEffect(() => {
    if (phase !== 'rolling' || !isRolling) {
      setDisplayDice(dice);
    }
  }, [dice, phase, isRolling]);

  const handleRoll = () => {
    if (phase !== 'rolling' || isRolling) return;
    
    setIsRolling(true);
    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      const randomD1 = Math.floor(Math.random() * 6) + 1 as 1 | 2 | 3 | 4 | 5 | 6;
      const randomD2 = Math.floor(Math.random() * 6) + 1 as 1 | 2 | 3 | 4 | 5 | 6;
      setDisplayDice([randomD1, randomD2]);
      
      if (counter > 10) {
        clearInterval(interval);
        setIsRolling(false);
        onRoll();
      }
    }, 100);
  };
  
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
        {phase === 'buying' && canSkip && (
             <Button
                onClick={onSkip}
                variant="outline"
                className="w-full"
            >
                턴 넘기기 <ChevronRight className="w-4 h-4 ml-2"/>
            </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Controls;
