'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Player, GamePhase, MenuItem, BonusCard, Category } from '@/lib/types';
import { INITIAL_SEEDS, NUM_VIRTUAL_PLAYERS } from '@/lib/constants';
import { menuItems, bonusCards } from '@/data/game-data';
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
      id: 'player-human', name: '나', isHuman: true, seeds: INITIAL_SEEDS, bento: [], bonusCards: [], eliminated: false,
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
        id: `player-ai-${i}`, name: `가상 플레이어 ${i + 1}`, isHuman: false, seeds: INITIAL_SEEDS, bento: [], bonusCards: [], aiShoppingList: aiChoices.playerChoices[i]?.itemNumbers || [], eliminated: false,
      }));
      allPlayers.push(...virtualPlayers);
    }
    
    setPlayers(allPlayers);
    setCurrentPlayerIndex(0);
    setGamePhase('rolling');
  }, [nextTurn]);

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
        title: '보너스 카드!',
        description: `모두가 '${randomCard.name}' 카드를 받았습니다. ${randomCard.description}`,
      });
      setTimeout(() => setGamePhase('buying'), 2000);
    } else {
      setGamePhase('buying');
    }
  };

  const handleBuyItem = (item: MenuItem) => {
    if (gamePhase !== 'buying' || !currentPlayer.isHuman) return;
    if (currentPlayer.seeds < item.price) {
      toast({ title: '씨앗이 부족해요!', description: `${item.price} 씨앗이 필요하지만 ${currentPlayer.seeds}개만 가지고 있어요.`, variant: 'destructive' });
      return;
    }
    
    const hasBoughtFromCategory = currentPlayer.bento.some(i => i.category === currentCategory);
    if(hasBoughtFromCategory){
       toast({ title: '카테고리 구매 제한!', description: `이번 라운드에는 ${currentCategory} 카테고리에서 이미 아이템을 구매했습니다.`, variant: 'destructive' });
       return;
    }
    
    const newSeeds = currentPlayer.seeds - item.price;
    setPlayers(prev => prev.map(p => p.id === currentPlayer.id ? {
      ...p,
      seeds: newSeeds,
      bento: [...p.bento, item],
    } : p));
    
    toast({ title: '아이템 구매!', description: `${item.name}을(를) ${item.price} 씨앗으로 구매했습니다.` });
    
    setTimeout(() => nextTurn(), 1000);
  };
  
  useEffect(() => {
    if (gamePhase === 'ai_turn' && !currentPlayer.isHuman && currentCategory) {
      const ai = currentPlayer;
      setTimeout(() => {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        setDice([d1,d2]);
        toast({ title: `${ai.name}의 턴`, description: `${ai.name}이(가) 주사위를 굴려 ${d1}과(와) ${d2}이(가) 나왔습니다.`});
        
        let buyingTurn = () => {
            const availableCategoryItems = shopItems.filter(item => item.category === currentCategory && ai.seeds >= item.price);

            if (availableCategoryItems.length > 0) {
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
                      bento: [...p.bento, itemToBuy!],
                      aiShoppingList: p.aiShoppingList?.filter(id => id !== itemToBuy!.id)
                    } : p));

                    toast({ title: `${ai.name} 구매!`, description: `${ai.name}이(가) ${itemToBuy.name}을(를) ${itemToBuy.price} 씨앗으로 샀습니다.` });
                } else {
                     toast({ description: `${ai.name}은(는) ${currentCategory}에서 아무것도 사지 못했습니다.` });
                }
            } else {
              toast({ description: `${ai.name}은(는) ${currentCategory}에서 아무것도 사지 못했습니다.` });
            }

            setTimeout(() => nextTurn(), 1500);
        }

        if (d1 === d2) {
            setGamePhase('bonus_card');
            const randomCard = bonusCards[Math.floor(Math.random() * bonusCards.length)];
            setLastBonusCard(randomCard);
            
            setPlayers(prev => prev.map(p => ({ ...p, bonusCards: [...p.bonusCards, randomCard] })));
            
            toast({ title: '보너스 카드!', description: `모두가 '${randomCard.name}' 카드를 받았습니다.` });
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
  
  if (gamePhase === 'loading' || !currentCategory || !humanPlayer) {
    return <div className="text-xl font-headline">게임 준비 중...</div>
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
