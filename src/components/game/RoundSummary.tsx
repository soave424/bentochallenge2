
'use client';

import { useMemo } from 'react';
import type { Player } from '@/lib/types';
import { calculatePlayerScore } from '@/lib/scoring';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CATEGORIES, CATEGORY_NAMES } from '@/lib/types';

interface RoundSummaryProps {
  players: Player[];
  round: number;
  onClose: () => void;
}

const RoundSummary = ({ players, round, onClose }: RoundSummaryProps) => {
  const scores = useMemo(() => players.map(p => ({
    player: p,
    score: calculatePlayerScore(p, false).score,
  })).sort((a, b) => {
    const totalA = a.score.taste + a.score.convenience + a.score.eco;
    const totalB = b.score.taste + b.score.convenience + b.score.eco;
    if (totalB === totalA) {
        return b.score.eco - a.score.eco;
    }
    return totalB - totalA;
  }), [players]);

  const currentCategoryName = CATEGORY_NAMES[CATEGORIES[round]];

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">
            라운드 {round + 1}: {currentCategoryName} 종료
          </DialogTitle>
          <DialogDescription>
            현재까지의 순위입니다.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] whitespace-nowrap">순위</TableHead>
                <TableHead>플레이어</TableHead>
                <TableHead className="text-right">맛</TableHead>
                <TableHead className="text-right">편리함</TableHead>
                <TableHead className="text-right">친환경</TableHead>
                <TableHead className="text-right">소비자 만족도</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map(({ player, score }, index) => {
                const totalScore = score.taste + score.convenience + score.eco;
                return (
                  <TableRow key={player.id}>
                    <TableCell className="font-bold">{index + 1}</TableCell>
                    <TableCell>{player.name}</TableCell>
                    <TableCell className="text-right">{score.taste}</TableCell>
                    <TableCell className="text-right">{score.convenience}</TableCell>
                    <TableCell className="text-right">{score.eco}</TableCell>
                    <TableCell className="text-right font-bold">{totalScore}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoundSummary;
