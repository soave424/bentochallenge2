'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Player, GamePhase, MenuItem, Dice, BonusCard } from '@/lib/types';
import { INITIAL_SEEDS, NUM_VIRTUAL_PLAYERS } from '@/lib/constants';
import { menuItems, bonusCards, getItemById } from '@/data/game-data';
import { getVirtualPlayerChoices } from '@/app/actions';
import { CATEGORIES } from '@/lib/types';
import { calculatePlayerScore } from '@/lib/scoring';

import WelcomeDialog from './WelcomeDialog';
import ResultsDialog from './ResultsDialog';
import PlayerStatus from './PlayerStatus';
import Shop from './Shop';
import Controls from './Controls';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatePresence, motion } from 'framer-motion';

const GameBoard = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gamePhase, setGamePhase] = useState<GamePhase>('welcome');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [shopItems, setShopItems] = useState<MenuItem[]>(menuItems);
  const [lastBonusCard, setLastBonusCard] = useState<BonusCard | null>(null);

  const { toast } = useToast();

  const humanPlayer = useMemo(() => players.find(p => p.isHuman), [players]);
  const currentPlayer = useMemo(() => players[currentPlayerIndex], [players, currentPlayerIndex]);

  const initializeGame = useCallback(async () => {
    setGamePhase('loading');
    const human: Player = {
      id: 'player-human', name: 'You', isHuman: true, seeds: INITIAL_SEEDS, bento: [], bonusCards: [], eliminated: false,
    };
    let allPlayers = [human];

    if (NUM_VIRTUAL_PLAYERS > 0) {
      const aiChoices = await getVirtualPlayerChoices({
        availableSeeds: INITIAL_SEEDS,
        menuItems: menuItems.map(m => ({
          number: m.id, name: m.name, price: m.price, taste: m.taste, convenience: m.convenience, ecoFriendliness: m.eco,
        })),
        numVirtualPlayers: NUM_VIRTUAL_PLAYERS,
      });

      const virtualPlayers: Player[] = Array.from({ length: NUM_VIRTUAL_PLAYERS }).map((_, i) => ({
        id: `player-ai-${i}`, name: `Virtual Player ${i + 1}`, isHuman: false, seeds: INITIAL_SEEDS, bento: [], bonusCards: [], aiShoppingList: aiChoices.playerChoices[i]?.itemNumbers || [], eliminated: false,
      }));
      allPlayers.push(...virtualPlayers);
    }
    
    setPlayers(allPlayers);
    setShopItems(menuItems);
    setCurrentPlayerIndex(0);
    setGamePhase('rolling');
  }, []);

  const nextTurn = useCallback(() => {
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextIndex);
    const nextPlayer = players[nextIndex];

    if(isGameOver()) {
        setGamePhase('game_over');
        return;
    }

    if (nextPlayer.eliminated) {
        // Skip eliminated players
        setTimeout(() => nextTurn(), 500);
        return;
    }
    
    setGamePhase(nextPlayer.isHuman ? 'rolling' : 'ai_turn');
  }, [currentPlayerIndex, players]);

  const handleRollDice = (d1: number, d2: number) => {
    setDice([d1, d2]);
    if (d1 === d2) {
      setGamePhase('bonus_card');
      const randomCard = bonusCards[Math.floor(Math.random() * bonusCards.length)];
      setLastBonusCard(randomCard);
      
      setPlayers(prev => prev.map(p => ({
        ...p,
        bonusCards: [...p.bonusCards, randomCard]
      })));

      toast({
        title: 'Bonus Card Drawn!',
        description: `Everyone gets: ${randomCard.name}. ${randomCard.description}`,
      });
      setTimeout(() => nextTurn(), 2000);
    } else {
      setGamePhase('buying');
    }
  };

  const handleBuyItem = (item: MenuItem) => {
    if (gamePhase !== 'buying' || !currentPlayer.isHuman) return;
    if (currentPlayer.seeds < item.price) {
      toast({ title: 'Not enough seeds!', description: `You need ${item.price} seeds but only have ${currentPlayer.seeds}.`, variant: 'destructive' });
      return;
    }
    
    setPlayers(prev => prev.map(p => p.id === currentPlayer.id ? {
      ...p,
      seeds: p.seeds - item.price,
      bento: [...p.bento, item],
    } : p));
    
    setShopItems(prev => prev.filter(i => i.id !== item.id));
    toast({ title: 'Item Purchased!', description: `You bought ${item.name} for ${item.price} seeds.` });

    checkElimination(currentPlayer.id, currentPlayer.seeds - item.price);
    
    setTimeout(() => nextTurn(), 1000);
  };
  
  const isGameOver = useCallback(() => {
    const activePlayers = players.filter(p => !p.eliminated);
    if (activePlayers.length <= 1) return true;
    const cheapestItem = Math.min(...shopItems.map(i => i.price));
    return activePlayers.every(p => p.seeds < cheapestItem);
  }, [players, shopItems]);

  const checkElimination = (playerId: string, currentSeeds: number) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const canBuyAnything = shopItems.some(item => currentSeeds >= item.price);
    if (!canBuyAnything) {
      const bentoCategories = new Set(player.bento.map(item => item.category));
      if (bentoCategories.size < CATEGORIES.length) {
        setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, eliminated: true } : p));
        toast({ title: `${player.name} Eliminated!`, description: 'Could not buy an item from each category.', variant: 'destructive' });
      }
    }
  };

  // AI Turn Logic
  useEffect(() => {
    if (gamePhase === 'ai_turn' && !currentPlayer.isHuman) {
      const ai = currentPlayer;
      setTimeout(() => { // Simulate thinking
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        setDice([d1,d2]);
        toast({ title: `${ai.name}'s turn`, description: `${ai.name} rolled a ${d1} and a ${d2}.`});

        if (d1 === d2) {
            setGamePhase('bonus_card');
            const randomCard = bonusCards[Math.floor(Math.random() * bonusCards.length)];
            setLastBonusCard(randomCard);
            
            setPlayers(prev => prev.map(p => ({ ...p, bonusCards: [...p.bonusCards, randomCard] })));
            
            toast({ title: 'Bonus Card Drawn!', description: `Everyone gets: ${randomCard.name}` });
            setTimeout(() => nextTurn(), 2000);
            return;
        }

        // AI Buying logic
        let boughtItem = false;
        if (ai.aiShoppingList && ai.aiShoppingList.length > 0) {
            for (let i = 0; i < ai.aiShoppingList.length; i++) {
                const itemId = ai.aiShoppingList[i];
                const itemToBuy = shopItems.find(item => item.id === itemId);

                if (itemToBuy && ai.seeds >= itemToBuy.price) {
                    setPlayers(prev => prev.map(p => p.id === ai.id ? {
                      ...p,
                      seeds: p.seeds - itemToBuy.price,
                      bento: [...p.bento, itemToBuy],
                      aiShoppingList: p.aiShoppingList?.filter(id => id !== itemId)
                    } : p));

                    setShopItems(prev => prev.filter(i => i.id !== itemToBuy.id));
                    toast({ title: `${ai.name} purchased!`, description: `${ai.name} bought ${itemToBuy.name} for ${itemToBuy.price} seeds.` });
                    boughtItem = true;
                    checkElimination(ai.id, ai.seeds - itemToBuy.price);
                    break;
                }
            }
        }
        
        if (!boughtItem) {
          toast({ description: `${ai.name} couldn't buy anything.` });
        }

        setTimeout(() => nextTurn(), 1500);

      }, 1000);
    }
  }, [gamePhase, currentPlayer, nextTurn, shopItems, toast]);

  if (gamePhase === 'welcome') {
    return <WelcomeDialog onStart={initializeGame} />;
  }
  
  if (gamePhase === 'loading') {
    return <div className="text-xl font-headline">Setting up the table...</div>
  }

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Shop items={shopItems} onBuy={handleBuyItem} disabled={gamePhase !== 'buying'} />
      </div>

      <div className="flex flex-col gap-6">
        <Controls
          phase={gamePhase}
          dice={dice}
          onRoll={handleRollDice}
          player={humanPlayer}
          shopItems={shopItems}
          onSkip={() => nextTurn()}
        />

        <div className="space-y-4">
            {players.map(p => (
                <PlayerStatus 
                    key={p.id} 
                    player={p} 
                    score={calculatePlayerScore(p)} 
                    isCurrent={p.id === currentPlayer?.id}
                />
            ))}
        </div>
      </div>
      
      {gamePhase === 'game_over' && (
        <ResultsDialog players={players} onRestart={initializeGame} />
      )}
    </div>
  );
};

export default GameBoard;
