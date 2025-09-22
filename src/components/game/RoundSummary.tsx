'use client';

import { useMemo } from 'react';
import type { Player } from '@/lib/types';
import { calculatePlayerScore } from '@/lib/scoring';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CATEGORIES, CATEGORY_NAMES } from '@/lib/types';

interface RoundSummaryProps {
  players: Player[];
  round: number;
  onNextRound: () => void;
}

const RoundSummary = ({ players, round, onNextRound }: RoundSummaryProps) => {
  const scores = useMemo(() => players.map(p => ({
    player: p,
    score: calculatePlayerScore(p),
  })).sort((a, b) => b.score.total - a.score.total), [players]);

  const currentCategoryName = CATEGORY_NAMES[CATEGORIES[round]];

  return (
    <Dialog open={true}>
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
                <TableHead className="w-[50px]">순위</TableHead>
                <TableHead>플레이어</TableHead>
                <TableHead className="text-right">맛</TableHead>
                <TableHead className="text-right">편리함</TableHead>
                <TableHead className="text-right">친환경</TableHead>
                <TableHead className="text-right">소비자 만족도</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map(({ player, score }, index) => (
                <TableRow key={player.id} className={player.eliminated ? "opacity-50" : ""}>
                  <TableCell className="font-bold">{index + 1}</TableCell>
                  <TableCell>{player.name} {player.eliminated ? '(탈락)' : ''}</TableCell>
                  <TableCell className="text-right">{score.taste}</TableCell>
                  <TableCell className="text-right">{score.convenience}</TableCell>
                  <TableCell className="text-right">{score.eco}</TableCell>
                  <TableCell className="text-right font-bold">{score.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button onClick={onNextRound} className="w-full">
            {round < CATEGORIES.length - 1 ? '다음 라운드로' : '최종 결과 보기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoundSummary;
