'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Player, Score, ScoreWithBonuses } from '@/lib/types';
import { calculatePlayerScore } from '@/lib/scoring';
import { Crown, Leaf, Smile, Utensils, Sparkles, ArrowRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface ResultsDialogProps {
  players: Player[];
  onRestart: () => void;
}

const ResultsDialog = ({ players, onRestart }: ResultsDialogProps) => {
    const [showBonuses, setShowBonuses] = useState(false);

    const scores = useMemo(() => players.map(p => calculatePlayerScore(p, showBonuses)), [players, showBonuses]);

    const sortedScores = useMemo(() => [...scores].sort((a, b) => {
        if (a.player.eliminated && !b.player.eliminated) return 1;
        if (!a.player.eliminated && b.player.eliminated) return -1;
        if (b.total === a.total) {
            return b.score.eco - a.score.eco;
        }
        return b.total - a.total;
    }), [scores]);

    const activePlayersScores = useMemo(() => scores.filter(s => !s.player.eliminated), [scores]);

    const winner = sortedScores[0];
    const ecoChamp = activePlayersScores.length > 0 ? [...activePlayersScores].sort((a, b) => b.score.eco - a.score.eco)[0] : null;
    const tasteChamp = activePlayersScores.length > 0 ? [...activePlayersScores].sort((a, b) => b.score.taste - a.score.taste)[0] : null;
    const convenienceChamp = activePlayersScores.length > 0 ? [...activePlayersScores].sort((a, b) => b.score.convenience - a.score.convenience)[0] : null;


    return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-headline text-center text-primary">게임 종료!</DialogTitle>
          <DialogDescription className="text-center text-lg">
            최종 결과입니다.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
            <div className="my-4">
            <div className="text-center p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2">
                <Crown className="w-6 h-6" /> 최종 우승
                </h3>
                <p className="text-2xl font-headline">{winner?.player.name}</p>
                <p className="text-sm text-muted-foreground">소비자 만족도: {winner?.total}</p>
            </div>
            </div>

            <div className="space-y-2">
                {sortedScores.map(({ player, score, total, bonusDetails }, index) => (
                    <div key={player.id} className={cn("flex flex-col p-3 bg-secondary rounded-md", player.eliminated && "opacity-50")}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-xl font-bold">{index + 1}.</span>
                                <p className="font-semibold">{player.name} {player.eliminated ? '(탈락)' : ''}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">소비자 만족도: {total}</p>
                                <p className="text-xs text-muted-foreground">맛: {score.taste}, 편리함: {score.convenience}, 친환경: {score.eco}</p>
                            </div>
                        </div>
                        {showBonuses && bonusDetails.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-background space-y-1">
                                {bonusDetails.map((detail, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs">
                                        <p className="text-muted-foreground flex items-center">
                                            <Badge variant={detail.value > 0 ? "default" : "destructive"} className="mr-2 text-xs w-16 justify-center">
                                                {detail.value > 0 ? `+${detail.value}` : detail.value} {detail.metric === 'total' ? '만족도' : detail.metric}
                                            </Badge>
                                            {detail.cardName}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4 text-center text-xs">
                <div className="p-2 bg-green-500/20 rounded">
                    <Leaf className="mx-auto w-5 h-5 text-green-600 dark:text-green-400 mb-1"/>
                    <p className="font-bold">친환경 챔피언</p>
                    {ecoChamp && <p>{ecoChamp.player.name} ({ecoChamp.score.eco}점)</p>}
                </div>
                <div className="p-2 bg-orange-500/20 rounded">
                    <Utensils className="mx-auto w-5 h-5 text-orange-600 dark:text-orange-400 mb-1"/>
                    <p className="font-bold">미식가</p>
                    {tasteChamp && <p>{tasteChamp.player.name} ({tasteChamp.score.taste}점)</p>}
                </div>
                <div className="p-2 bg-blue-500/20 rounded">
                    <Smile className="mx-auto w-5 h-5 text-blue-600 dark:text-blue-400 mb-1"/>
                    <p className="font-bold">편리함의 왕</p>
                    {convenienceChamp && <p>{convenienceChamp.player.name} ({convenienceChamp.score.convenience}점)</p>}
                </div>
            </div>
        </ScrollArea>
        <DialogFooter className="mt-6 gap-2">
            {!showBonuses && (
                <Button onClick={() => setShowBonuses(true)} className="w-full">
                    <Sparkles className="w-4 h-4 mr-2"/>
                    보너스 카드 적용하기
                    <ArrowRight className="w-4 h-4 ml-2"/>
                </Button>
            )}
          <Button onClick={onRestart} className="w-full" variant={showBonuses ? "default" : "outline"}>다시 시작</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsDialog;
