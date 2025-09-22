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
import type { Player } from '@/lib/types';
import { calculatePlayerScore } from '@/lib/scoring';
import { Crown, Leaf, ShoppingBag, Utensils } from 'lucide-react';
import { useMemo } from 'react';

interface ResultsDialogProps {
  players: Player[];
  onRestart: () => void;
}

const ResultsDialog = ({ players, onRestart }: ResultsDialogProps) => {
    const scores = useMemo(() => players.map(p => ({
        player: p,
        score: calculatePlayerScore(p),
    })), [players]);

    const sortedScores = useMemo(() => [...scores].sort((a, b) => {
        if (b.score.total === a.score.total) {
            return b.score.eco - a.score.eco;
        }
        return b.score.total - a.score.total;
    }), [scores]);

    const winner = sortedScores[0];
    const ecoChamp = [...scores].sort((a, b) => b.score.eco - a.score.eco)[0];
    const tasteChamp = [...scores].sort((a, b) => b.score.taste - a.score.taste)[0];
    const convenienceChamp = [...scores].sort((a, b) => b.score.convenience - a.score.convenience)[0];

    return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-headline text-center text-primary">Game Over!</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Here are the final results.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <div className="text-center p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
            <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2">
              <Crown className="w-6 h-6" /> Winner
            </h3>
            <p className="text-2xl font-headline">{winner?.player.name}</p>
            <p className="text-sm text-muted-foreground">Total Score: {winner?.score.total}</p>
          </div>
        </div>

        <div className="space-y-4">
            {sortedScores.map(({ player, score }, index) => (
                 <div key={player.id} className="flex items-center justify-between p-3 bg-secondary rounded-md">
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-bold">{index + 1}.</span>
                        <p className="font-semibold">{player.name}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold">Total: {score.total}</p>
                        <p className="text-xs text-muted-foreground">Taste: {score.taste}, Convenience: {score.convenience}, Eco: {score.eco}</p>
                    </div>
                 </div>
            ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4 text-center text-xs">
            <div className="p-2 bg-green-500/20 rounded">
                <Leaf className="mx-auto w-5 h-5 text-green-600 dark:text-green-400 mb-1"/>
                <p className="font-bold">Environmental Guardian</p>
                <p>{ecoChamp.player.name}</p>
            </div>
             <div className="p-2 bg-orange-500/20 rounded">
                <Utensils className="mx-auto w-5 h-5 text-orange-600 dark:text-orange-400 mb-1"/>
                <p className="font-bold">Gourmet</p>
                <p>{tasteChamp.player.name}</p>
            </div>
            <div className="p-2 bg-blue-500/20 rounded">
                <ShoppingBag className="mx-auto w-5 h-5 text-blue-600 dark:text-blue-400 mb-1"/>
                <p className="font-bold">Convenience King</p>
                <p>{convenienceChamp.player.name}</p>
            </div>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={onRestart} className="w-full">Play Again</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsDialog;
