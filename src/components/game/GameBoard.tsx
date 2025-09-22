'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Player, GamePhase, MenuItem, Dice, BonusCard, Category } from '@/lib/types';
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

const GameBoard = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gamePhase, setGamePhase] = useState<GamePhase>('welcome');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [shopItems, setShopItems] = useState<MenuItem[]>([]);
  const [lastBonusCard, setLastBonusCard] = useState<BonusCard | null>(null);
  const [round, setRound] = useState(0); // 0-indexed, so 0 is round 1

  const { toast } = useToast();
  
  const currentCategory = useMemo(() => CATEGORIES[round], [round]);
  const humanPlayer = useMemo(() => players.find(p => p.isHuman), [players]);
  const currentPlayer = useMemo(() => players[currentPlayerIndex], [players, currentPlayerIndex]);

  const isGameOver = useCallback(() => {
    // Game ends after the last category round is finished by all players
    return round >= CATEGORIES.length;
  }, [round]);

  const nextTurn = useCallback(() => {
    const nextPlayerIndex = (currentPlayerIndex + 1);

    if (nextPlayerIndex >= players.length) {
      // All players have taken a turn, advance to the next round
      const nextRound = round + 1;
      if (nextRound >= CATEGORIES.length) {
        setGamePhase('game_over');
        return;
      }
      setRound(nextRound);
      setCurrentPlayerIndex(0);
      setGamePhase(players[0].isHuman ? 'rolling' : 'ai_turn');
    } else {
      setCurrentPlayerIndex(nextPlayerIndex);
      const nextPlayer = players[nextPlayerIndex];
       if (nextPlayer.eliminated) {
         setTimeout(() => nextTurn(), 500);
         return;
       }
      setGamePhase(nextPlayer.isHuman ? 'rolling' : 'ai_turn');
    }
  }, [currentPlayerIndex, players, round]);

  const initializeGame = useCallback(async () => {
    setGamePhase('loading');
    setRound(0);
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
    setCurrentPlayerIndex(0);
    setGamePhase('rolling');
  }, []);

  useEffect(() => {
    setShopItems(menuItems.filter(item => item.category === currentCategory));
  }, [round, currentCategory]);

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
      setTimeout(() => setGamePhase('buying'), 2000); // After showing card, go to buying phase
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
    
    // Check if player already bought an item from this category this turn
    const hasBoughtFromCategory = currentPlayer.bento.some(i => i.category === currentCategory);
    if(hasBoughtFromCategory){
       toast({ title: 'Category Limit!', description: `You can only buy one item from the ${currentCategory} category per round.`, variant: 'destructive' });
       return;
    }
    
    const newSeeds = currentPlayer.seeds - item.price;
    setPlayers(prev => prev.map(p => p.id === currentPlayer.id ? {
      ...p,
      seeds: newSeeds,
      bento: [...p.bento, item],
    } : p));
    
    toast({ title: 'Item Purchased!', description: `You bought ${item.name} for ${item.price} seeds.` });
    
    setTimeout(() => nextTurn(), 1000);
  };
  
  // AI Turn Logic
  useEffect(() => {
    if (gamePhase === 'ai_turn' && !currentPlayer.isHuman && currentCategory) {
      const ai = currentPlayer;
      setTimeout(() => { // Simulate thinking
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        setDice([d1,d2]);
        toast({ title: `${ai.name}'s turn`, description: `${ai.name} rolled a ${d1} and a ${d2}.`});
        
        let buyingTurn = () => {
            let boughtItem = false;
            
            // AI must buy one item from the current category if possible
            const availableCategoryItems = shopItems.filter(item => item.category === currentCategory && ai.seeds >= item.price);

            if (availableCategoryItems.length > 0) {
                // Prioritize shopping list, then just pick the most expensive affordable one.
                let itemToBuy: MenuItem | undefined;
                
                const shoppingListItems = availableCategoryItems.filter(item => ai.aiShoppingList?.includes(item.id));

                if(shoppingListItems.length > 0) {
                    itemToBuy = shoppingListItems.sort((a,b) => b.price - a.price)[0];
                } else {
                    itemToBuy = availableCategoryItems.sort((a,b) => b.price - a.price)[0];
                }

                if (itemToBuy) {
                    const newSeeds = ai.seeds - itemToBuy.price;
                    setPlayers(prev => prev.map(p => p.id === ai.id ? {
                      ...p,
                      seeds: newSeeds,
                      bento: [...p.bento, itemToBuy],
                      aiShoppingList: p.aiShoppingList?.filter(id => id !== itemToBuy!.id)
                    } : p));

                    toast({ title: `${ai.name} purchased!`, description: `${ai.name} bought ${itemToBuy.name} for ${itemToBuy.price} seeds.` });
                    boughtItem = true;
                }
            }

            if (!boughtItem) {
              toast({ description: `${ai.name} couldn't buy anything from ${currentCategory}.` });
            }

            setTimeout(() => nextTurn(), 1500);
        }

        if (d1 === d2) {
            setGamePhase('bonus_card');
            const randomCard = bonusCards[Math.floor(Math.random() * bonusCards.length)];
            setLastBonusCard(randomCard);
            
            setPlayers(prev => prev.map(p => ({ ...p, bonusCards: [...p.bonusCards, randomCard] })));
            
            toast({ title: 'Bonus Card Drawn!', description: `Everyone gets: ${randomCard.name}` });
            setTimeout(() => buyingTurn(), 2000);
            return;
        }

        buyingTurn();

      }, 1000);
    }
  }, [gamePhase, currentPlayer, nextTurn, shopItems, toast, currentCategory]);

  if (gamePhase === 'welcome') {
    return <WelcomeDialog onStart={initializeGame} />;
  }
  
  if (gamePhase === 'loading' || !currentCategory) {
    return <div className="text-xl font-headline">Setting up the table...</div>
  }

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
      <div className="lg:col-span-2">
        <Shop 
          items={shopItems} 
          onBuy={handleBuyItem} 
          disabled={gamePhase !== 'buying' || !currentPlayer.isHuman} 
          round={round + 1} 
          category={currentCategory} 
        />
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
