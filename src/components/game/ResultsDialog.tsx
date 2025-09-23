
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
import type { Player, Score, BonusCard } from '@/lib/types';
import { calculatePlayerScore, getBonusEffect } from '@/lib/scoring';
import { Crown, Leaf, Smile, Utensils, HelpCircle, FileText } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import DetailedResults from './DetailedResults';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';


interface ResultsDialogProps {
  players: Player[];
  onRestart: () => void;
}

interface PlayerResult {
  player: Player;
  baseScore: Score;
  baseTotal: number;
  revealedBonuses: BonusCard[];
  currentScore: Score;
  currentTotal: number;
}

const ResultsDialog = ({ players, onRestart }: ResultsDialogProps) => {
    const [showDetailedResults, setShowDetailedResults] = useState(false);

    const initialResults = useMemo(() => {
        return players.map(p => {
            const { score, total } = calculatePlayerScore(p, []);
            return {
                player: p,
                baseScore: score,
                baseTotal: total,
                revealedBonuses: [],
                currentScore: score,
                currentTotal: total
            };
        });
    }, [players]);

    const [playerResults, setPlayerResults] = useState<PlayerResult[]>(initialResults);

    const handleCardClick = useCallback((playerId: string, card: BonusCard) => {
        setPlayerResults(prevResults => {
            return prevResults.map(pr => {
                if (pr.player.id === playerId && !pr.revealedBonuses.find(c => c.id === card.id)) {
                    const newRevealedBonuses = [...pr.revealedBonuses, card];
                    const { score: newScore, total: newTotal } = calculatePlayerScore(pr.player, newRevealedBonuses);
                    
                    return {
                        ...pr,
                        revealedBonuses: newRevealedBonuses,
                        currentScore: newScore,
                        currentTotal: newTotal,
                    };
                }
                return pr;
            });
        });
    }, []);

    const sortedScores = useMemo(() => [...playerResults].sort((a, b) => {
        if (b.currentTotal === a.currentTotal) {
            return b.currentScore.eco - a.currentScore.eco;
        }
        return b.currentTotal - a.currentTotal;
    }), [playerResults]);

    const winner = sortedScores[0];
    const getChamp = (metric: keyof Score) => {
      if (playerResults.length === 0) return null;
      return [...playerResults].sort((a,b) => b.currentScore[metric] - a.currentScore[metric])[0];
    }

    const ecoChamp = getChamp('eco');
    const tasteChamp = getChamp('taste');
    const convenienceChamp = getChamp('convenience');

    const humanPlayerResult = useMemo(() => playerResults.find(r => r.player.isHuman), [playerResults]);
    
    const allCardsRevealed = useMemo(() => {
        return playerResults.every(pr => pr.revealedBonuses.length === pr.player.bonusCards.length);
    }, [playerResults]);


    const renderBonusValue = (card: BonusCard, player: Player) => {
        const effect = getBonusEffect(card, player);
        if (!effect) return null;

        const { metric, value } = effect;
        let metricText = '';
        switch (metric) {
            case 'eco': metricText = '친환경'; break;
            case 'taste': metricText = '맛'; break;
            case 'convenience': metricText = '편리함'; break;
            case 'total': metricText = '만족도'; break;
            case 'seeds': metricText = '시드'; break;
        }

        return (
             <Badge variant={value > 0 ? "success" : "destructive"} className="text-xs whitespace-nowrap">
                {metricText} {value > 0 ? `+${value}` : value}
            </Badge>
        )
    }

    return (
    <>
    <Dialog open={true}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-headline text-center text-primary">게임 종료!</DialogTitle>
          <DialogDescription className="text-center text-lg">
            최종 결과입니다. 카드를 눌러 보너스를 확인하세요.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
            <div className="my-4">
            <div className="text-center p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2">
                <Crown className="w-6 h-6" /> 최종 우승
                </h3>
                <p className="text-2xl font-headline">{winner?.player.name}</p>
                <p className="text-sm text-muted-foreground">소비자 만족도: {winner?.currentTotal}</p>
            </div>
            </div>

            <div className="space-y-2">
                {sortedScores.map((result, index) => {
                    const { player, currentScore, currentTotal, revealedBonuses } = result;
                    return (
                        <div key={player.id} className="flex flex-col p-3 bg-secondary rounded-md">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-bold">{index + 1}.</span>
                                    <p className="font-semibold">{player.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">소비자 만족도: {currentTotal}</p>
                                    <p className="text-xs text-muted-foreground">맛: {currentScore.taste}, 편리함: {currentScore.convenience}, 친환경: {currentScore.eco}</p>
                                </div>
                            </div>
                            {player.bonusCards.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-background flex flex-wrap gap-2">
                                    {player.bonusCards.map((card, i) => {
                                        const isRevealed = revealedBonuses.find(c => c.id === card.id);
                                        return (
                                            <TooltipProvider key={i}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            onClick={() => handleCardClick(player.id, card)}
                                                            className={cn(
                                                                "w-20 h-28 bg-muted rounded-md flex items-center justify-center border-2 border-dashed border-primary/50 transition-all transform hover:scale-105",
                                                                isRevealed ? 'bg-card border-solid' : 'cursor-pointer',
                                                            )}
                                                        >
                                                            {isRevealed ? (
                                                                <div className="text-center p-1 space-y-1">
                                                                    <p className="text-xs font-bold leading-tight">{card.name}</p>
                                                                    <p className="text-[10px] leading-snug text-muted-foreground">{card.description}</p>
                                                                    {renderBonusValue(card, player)}
                                                                </div>
                                                            ) : (
                                                                <HelpCircle className="w-8 h-8 text-primary/80"/>
                                                            )}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {isRevealed ? <p>{card.name}</p> : <p>비밀 보너스 카드</p>}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4 text-center text-xs">
                <div className="p-2 bg-green-500/20 rounded">
                    <Leaf className="mx-auto w-5 h-5 text-green-600 dark:text-green-400 mb-1"/>
                    <p className="font-bold">친환경 챔피언</p>
                    {ecoChamp && <p>{ecoChamp.player.name} ({ecoChamp.currentScore.eco}점)</p>}
                </div>
                <div className="p-2 bg-orange-500/20 rounded">
                    <Utensils className="mx-auto w-5 h-5 text-orange-600 dark:text-orange-400 mb-1"/>
                    <p className="font-bold">미식가</p>
                    {tasteChamp && <p>{tasteChamp.player.name} ({tasteChamp.currentScore.taste}점)</p>}
                </div>
                <div className="p-2 bg-blue-500/20 rounded">
                    <Smile className="mx-auto w-5 h-5 text-blue-600 dark:text-blue-400 mb-1"/>
                    <p className="font-bold">편리함의 왕</p>
                    {convenienceChamp && <p>{convenienceChamp.player.name} ({convenienceChamp.currentScore.convenience}점)</p>}
                </div>
            </div>
        </ScrollArea>
        <DialogFooter className="mt-6 flex-col gap-2 sm:flex-col sm:space-x-0">
             {allCardsRevealed && humanPlayerResult && (
                 <Button onClick={() => setShowDetailedResults(true)} className="w-full" variant="secondary">
                    <FileText className="w-4 h-4 mr-2"/>
                    결과 상세보기
                </Button>
             )}
          <Button onClick={onRestart} className="w-full" variant={allCardsRevealed ? "default" : "outline"}>다시 시작</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    {showDetailedResults && humanPlayerResult && (
        <DetailedResults
            player={humanPlayerResult.player}
            finalScore={{...humanPlayerResult, score: humanPlayerResult.currentScore, total: humanPlayerResult.currentTotal, bonusDetails: []}}
            onClose={() => setShowDetailedResults(false)}
        />
    )}
    </>
  );
};

export default ResultsDialog;
