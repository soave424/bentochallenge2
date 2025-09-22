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
import { Rocket } from 'lucide-react';

interface WelcomeDialogProps {
  onStart: () => void;
}

const WelcomeDialog = ({ onStart }: WelcomeDialogProps) => {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-3xl font-headline text-primary flex items-center gap-2">
            <Rocket className="w-8 h-8" />
            Welcome to the Eco Bento Challenge!
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground pt-2 text-left">
            Create the best bento box while making sustainable choices. Here’s how to play:
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm text-foreground">
          <ul className="list-disc list-inside space-y-2">
            <li>You start with <strong>15 seeds</strong> to buy items for your bento box.</li>
            <li>On your turn, roll two dice. If the numbers are different, you get to buy one item.</li>
            <li>If you roll doubles, all players draw a random <strong>Bonus Card</strong>!</li>
            <li>You must buy at least one item from each of the 5 categories: <strong>Side Dish, Fruit, Drink, Container, and Snack</strong>.</li>
            <li>The game ends when no one can afford more items. Players who fail to get one item from each category are eliminated.</li>
            <li>The winner is the player with the highest total score (Consumption + Eco-friendly points).</li>
          </ul>
        </div>
        <DialogFooter>
          <Button type="button" onClick={onStart} className="w-full text-lg py-6">
            Start the Challenge!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;
