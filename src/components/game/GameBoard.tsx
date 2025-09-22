'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Player, GamePhase, MenuItem, BonusCard, Category } from '@/lib/types';
import { INITIAL_SEEDS, NUM_VIRTUAL_PLAYERS } from '@/lib/constants';
import { bonusCards, initialMenuItems } from '@/data/game-data';
import { getMenuItems, saveMenuItems } from '@/lib/game-data-service';
import { getVirtualPlayerChoices } from '@/app/actions';
import { CATEGORIES }from '@/lib/types';
import { calculatePlayerScore } from '@/lib/scoring';
import { shuffle, cn } from '@/lib/utils';
import { ChevronsRight, Settings } from 'lucide-react';

import WelcomeDialog from './WelcomeDialog';
import ResultsDialog from './ResultsDialog';
import PlayerStatus from './PlayerStatus';
import Shop from './Shop';
import Controls from './Controls';
import { useToast } from '@/hooks/use-toast';
import RoundSummary from './RoundSummary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

const GameBoard = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gamePhase, setGamePhase] = useState<GamePhase>('welcome');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [shopItems, setShopItems] = useState<MenuItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [lastBonusCard, setLastBonusCard] = useState<BonusCard | null>(null);
  const [round, setRound] = useState(0); // 0-indexed, so 0 is round 1
  const [purchasedItemIds, setPurchasedItemIds] = useState<string[]>([]);
  const { toast } = useToast();

  const currentCategory = useMemo(() => CATEGORIES[round], [round]);
  const humanPlayer = useMemo(() => players.find(p => p.isHuman), [players]);
  const otherPlayers = useMemo(() => players.filter(p => !p.isHuman), [players]);
  const currentPlayer = useMemo(() => players[currentPlayerIndex], [players, currentPlayerIndex]);

  const advanceToNextPlayer = useCallback(() => {
    let nextIndex = currentPlayerIndex + 1;

    while(nextIndex < players.length && players[nextIndex].eliminated) {
      toast({description: `${players[nextIndex].name}님은 탈락하여 턴을 건너뜁니다.`})
      nextIndex++;
    }

    if (nextIndex >= players.length) {
      setGamePhase('round_summary');
    } else {
      setCurrentPlayerIndex(nextIndex);
      const nextPlayer = players[nextIndex];
      if (nextPlayer.isHuman) {
        setGamePhase('rolling');
      } else {
        setGamePhase('ai_turn');
      }
    }
  }, [currentPlayerIndex, players, toast]);


  const canHumanPlayerSkip = useMemo(() => {
    if (!humanPlayer || !currentCategory || gamePhase !== 'buying') return false;
    
    const hasBoughtFromCategory = humanPlayer.bento.some(i => i.category === currentCategory);
    if(hasBoughtFromCategory) return true;

    const canAffordAny = shopItems.some(item => 
        !purchasedItemIds.includes(item.id) && humanPlayer.seeds >= item.price
    );
    
    return !canAffordAny;
  }, [humanPlayer, currentCategory, shopItems, purchasedItemIds, gamePhase]);

  const roundTurnOrder = useMemo(() => players.map((p, index) => (
    <span key={p.id} className={cn("transition-opacity whitespace-nowrap", index === currentPlayerIndex && "font-bold text-primary animate-pulse")}>
      {p.name}
    </span>
  )), [players, currentPlayerIndex]);

  const advanceRound = () => {
    if (round >= CATEGORIES.length - 1) {
      setGamePhase('game_over');
      return;
    }

    const nextRound = round + 1;
    const newPlayerOrder = shuffle([...players]);
    const firstPlayerIndex = 0;
    
    setPurchasedItemIds([]);
    setRound(nextRound);
    setPlayers(newPlayerOrder);
    setCurrentPlayerIndex(firstPlayerIndex);

    const firstPlayer = newPlayerOrder[firstPlayerIndex];
    if (firstPlayer.isHuman) {
      setGamePhase('rolling');
    } else {
      setGamePhase('ai_turn');
    }
  }

  const initializeGame = useCallback(async () => {
    setGamePhase('loading');
    
    let currentMenuItems = await getMenuItems();
    if (!currentMenuItems || currentMenuItems.length === 0) {
        await saveMenuItems(initialMenuItems);
        currentMenuItems = initialMenuItems;
    }
    setMenuItems(currentMenuItems);

    setRound(0);
    setCurrentPlayerIndex(0);
    setPurchasedItemIds([]);

    const human: Player = {
      id: 'player-human', name: '나', isHuman: true, seeds: INITIAL_SEEDS, bento: [], bonusCards: [], eliminated: false,
    };
    
    const virtualPlayerNames = ["지혜로운 라이언", "용감한 제이지", "친절한 어피치"];
    let initialPlayers: Player[] = [human];

    if (NUM_VIRTUAL_PLAYERS > 0) {
       const aiChoices = await getVirtualPlayerChoices({
        availableSeeds: INITIAL_SEEDS,
        menuItems: currentMenuItems.map(m => ({
          id: m.id, name: m.name, price: m.price, taste: m.taste, convenience: m.convenience, eco: m.eco,
        })),
        numVirtualPlayers: NUM_VIRTUAL_PLAYERS,
      });
      
      const virtualPlayers: Player[] = Array.from({ length: NUM_VIRTUAL_PLAYERS }).map((_, i) => ({
        id: `player-ai-${i}`, name: virtualPlayerNames[i % virtualPlayerNames.length], isHuman: false, seeds: INITIAL_SEEDS, bento: [], bonusCards: [], aiShoppingList: aiChoices.playerChoices[i]?.itemIds || [], eliminated: false,
      }));
      initialPlayers.push(...virtualPlayers);
    }
    
    const shuffledPlayers = shuffle(initialPlayers);
    setPlayers(shuffledPlayers);
    
    const firstPlayerIndex = 0;
    setCurrentPlayerIndex(firstPlayerIndex);
    const firstPlayer = shuffledPlayers[firstPlayerIndex];
    if(firstPlayer.isHuman){
        setGamePhase('rolling');
    } else {
        setGamePhase('ai_turn');
    }
  }, []);
  
  useEffect(() => {
    if (gamePhase === 'welcome' || gamePhase === 'loading' || menuItems.length === 0) return;
    setShopItems(menuItems.filter(item => item.category === currentCategory));
  }, [round, currentCategory, gamePhase, menuItems]);

  const checkAndHandleElimination = (player: Player): Player => {
    if (player.eliminated) return player;
    
    // Check if player has enough seeds to buy any item left in the *entire game* in categories they haven't bought from yet
    const remainingCategories = CATEGORIES.filter(cat => !player.bento.some(item => item.category === cat));
    
    if (remainingCategories.length === 0) return player;

    const minPriceInGameForRemainingCategories = Math.min(...menuItems.filter(i => remainingCategories.includes(i.category)).map(i => i.price));

    if (player.seeds < minPriceInGameForRemainingCategories) {
        toast({ 
            title: `${player.name} 탈락`, 
            description: `씨앗이 부족하여 더 이상 필수 아이템을 구매할 수 없습니다.`, 
            variant: 'destructive'
        });
        return { ...player, eliminated: true };
    }

    return player;
};
  
  const handleRollDice = () => {
    if (gamePhase !== 'rolling') return;

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    setDice([d1 as 1 | 2 | 3 | 4 | 5 | 6, d2 as 1 | 2 | 3 | 4 | 5 | 6]);

    if (d1 === d2) {
      const randomCard = bonusCards[Math.floor(Math.random() * bonusCards.length)];
      setLastBonusCard(randomCard);
      
      setPlayers(prev => prev.map(p => 
        p.id === currentPlayer.id 
          ? { ...p, bonusCards: [...p.bonusCards, randomCard] }
          : p
      ));

      toast({
        title: '보너스 카드!',
        description: `${currentPlayer.name}님이 '${randomCard.name}' 카드를 받았습니다!`,
      });
    }
    setGamePhase('buying');
  };
  
  const handleSkipTurn = () => {
    if (gamePhase !== 'buying' || !currentPlayer.isHuman) return;

    const hasBoughtFromCategory = currentPlayer.bento.some(i => i.category === currentCategory);
    const canAffordAny = shopItems.some(item => !purchasedItemIds.includes(item.id) && currentPlayer.seeds >= item.price);
    
    if (!hasBoughtFromCategory && canAffordAny) {
       toast({ title: '턴 넘기기 불가', description: '이번 라운드의 아이템을 아직 구매하지 않았습니다. 아이템을 구매해주세요!', variant: 'destructive' });
       return;
    }
    
    toast({ description: `턴을 넘깁니다.` });
    advanceToNextPlayer();
  };


  const handleBuyItem = (item: MenuItem) => {
    if (gamePhase !== 'buying' || !currentPlayer.isHuman) return;
    
    if (purchasedItemIds.includes(item.id)) {
        toast({ title: '품절된 아이템', description: '이 아이템은 이미 다른 플레이어가 구매했습니다.', variant: 'destructive' });
        return;
    }
    
    const hasBoughtFromCategory = currentPlayer.bento.some(i => i.category === currentCategory);
    if(hasBoughtFromCategory){
       toast({ title: '카테고리 구매 제한!', description: `이번 라운드에는 이 카테고리에서 이미 아이템을 구매했습니다.`, variant: 'destructive' });
       return;
    }

    if (currentPlayer.seeds < item.price) {
      toast({ title: '씨앗이 부족해요!', description: `${item.price} 씨앗이 필요하지만 ${currentPlayer.seeds}개만 가지고 있어요.`, variant: 'destructive' });
      return;
    }
    
    let finalSeeds = currentPlayer.seeds - item.price;
    if ( (item.name === '플라스틱 생수' || item.name === '페트병 주스') && currentPlayer.bonusCards.some(c => c.id === 'tax2') ) {
        toast({ title: '페트병 규제!', description: `'${item.name}' 구매로 씨앗 1개를 잃습니다.`, variant: 'destructive' });
        finalSeeds = Math.max(0, finalSeeds - 1);
    }

    const updatedPlayer = {
      ...currentPlayer,
      seeds: finalSeeds,
      bento: [...currentPlayer.bento, item],
    };

    const playerAfterEliminationCheck = checkAndHandleElimination(updatedPlayer);

    setPlayers(prev => prev.map(p => (p.id === currentPlayer.id ? playerAfterEliminationCheck : p)));
    setPurchasedItemIds(prev => [...prev, item.id]);
    toast({ title: '아이템 구매!', description: `${item.name}을(를) ${item.price} 씨앗으로 구매했습니다.` });
    
    setTimeout(() => {
      advanceToNextPlayer();
    }, 500);
  };
  
  useEffect(() => {
    if (gamePhase !== 'ai_turn' || !currentPlayer || currentPlayer.isHuman) return;

    const ai = currentPlayer;
    
    const startAiTurn = () => {
      setTimeout(() => {
        toast({ title: `${ai.name}의 턴`, description: `${ai.name}이(가) 자신의 차례를 시작합니다.`});
      }, 1000);
      
      setTimeout(() => {
          const d1 = Math.floor(Math.random() * 6) + 1;
          const d2 = Math.floor(Math.random() * 6) + 1;
          setDice([d1 as 1 | 2 | 3 | 4 | 5 | 6,d2 as 1 | 2 | 3 | 4 | 5 | 6]);

          if (d1 === d2) {
            const randomCard = bonusCards[Math.floor(Math.random() * bonusCards.length)];
            setLastBonusCard(randomCard);
            setPlayers(prev => prev.map(p => 
                p.id === ai.id 
                ? { ...p, bonusCards: [...p.bonusCards, randomCard] }
                : p
            ));
            toast({ title: '보너스 카드!', description: `${ai.name}님이 '${randomCard.name}' 카드를 받았습니다!` });
          }
      }, 2500);

      setTimeout(() => {
        let boughtAnItem = false;
        const hasBoughtFromCategory = ai.bento.some(i => i.category === currentCategory);

        if (!hasBoughtFromCategory) {
            const availableCategoryItems = shopItems.filter(item => !purchasedItemIds.includes(item.id) && ai.seeds >= item.price);

            if (availableCategoryItems.length > 0) {
                let itemToBuy: MenuItem | undefined;
                const shoppingListItems = availableCategoryItems.filter(item => (ai.aiShoppingList || []).includes(item.id));

                if(shoppingListItems.length > 0) {
                    itemToBuy = shoppingListItems.sort((a,b) => b.price - a.price)[0];
                } else {
                    itemToBuy = availableCategoryItems.sort((a,b) => b.price - a.price)[0];
                }

                if (itemToBuy) {
                    boughtAnItem = true;
                    let finalSeeds = ai.seeds - itemToBuy.price;
                     if ((itemToBuy!.name === '플라스틱 생수' || itemToBuy!.name === '페트병 주스') && ai.bonusCards.some(c => c.id === 'tax2')) {
                        toast({ title: '페트병 규제!', description: `${ai.name}이(가) '${itemToBuy!.name}' 구매로 씨앗 1개를 잃습니다.`, variant: 'destructive' });
                        finalSeeds = Math.max(0, finalSeeds - 1);
                    }
                    const updatedAiPlayer = {
                        ...ai,
                        seeds: finalSeeds,
                        bento: [...ai.bento, itemToBuy],
                        aiShoppingList: (ai.aiShoppingList || []).filter(id => id !== itemToBuy!.id)
                    };

                    const aiAfterEliminationCheck = checkAndHandleElimination(updatedAiPlayer);
                    
                    setPlayers(prev => prev.map(p => p.id === ai.id ? aiAfterEliminationCheck : p));
                    setPurchasedItemIds(prev => [...prev, itemToBuy!.id]);
                    toast({ title: `${ai.name} 구매!`, description: `${ai.name}이(가) ${itemToBuy.name}을(를) ${itemToBuy.price} 씨앗으로 샀습니다.` });
                }
            }
        }

        setTimeout(() => {
          advanceToNextPlayer();
        }, 1500);
      }, 4000);
    };

    startAiTurn();
  }, [gamePhase, currentPlayer, advanceToNextPlayer, shopItems, toast, currentCategory, purchasedItemIds]);
  
  if (gamePhase === 'welcome') {
    return <WelcomeDialog onStart={initializeGame} />;
  }
  
  if (gamePhase === 'loading' || !humanPlayer || !currentPlayer || menuItems.length === 0) {
    return <div className="text-xl font-headline">게임 준비 중...</div>
  }

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 relative">
       <div className="absolute top-0 right-0">
        <Button asChild variant="outline" size="sm">
            <Link href="/admin">
                <Settings className="w-4 h-4 mr-2" />
                메뉴 수정
            </Link>
        </Button>
      </div>

      <div className="lg:col-span-2">
        <div className="mb-4 mt-8 p-3 bg-secondary/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">이번 라운드 순서</p>
            <div className="font-semibold text-lg flex items-center justify-center gap-x-2 flex-nowrap overflow-x-auto">
                {roundTurnOrder.map((name, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {name}
                        {index < players.length - 1 && <ChevronsRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                    </div>
                ))}
            </div>
        </div>
        <Shop 
          items={shopItems} 
          onBuy={handleBuyItem} 
          disabled={gamePhase !== 'buying' || !currentPlayer.isHuman} 
          round={round + 1} 
          category={currentCategory}
          purchasedItemIds={purchasedItemIds}
        />
      </div>

      <div className="flex flex-col gap-6 lg:mt-8">
        <Controls
          phase={gamePhase}
          dice={dice}
          onRoll={handleRollDice}
          onSkip={handleSkipTurn}
          canSkip={canHumanPlayerSkip}
        />

        <div className="space-y-4">
          {humanPlayer && (
            <PlayerStatus 
                key={humanPlayer.id} 
                player={humanPlayer} 
                isCurrent={true} 
            />
          )}
          {otherPlayers.length > 0 && (
             <ScrollArea className="h-[40vh] pr-3">
                 <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground px-2">다른 플레이어</p>
                    {otherPlayers.map(player => (
                        <PlayerStatus 
                            key={player.id} 
                            player={player} 
                            isCurrent={currentPlayer?.id === player.id}
                            isCompact={true}
                        />
                    ))}
                 </div>
             </ScrollArea>
          )}
        </div>
      </div>
       
      {gamePhase === 'round_summary' && (
        <RoundSummary
          players={players}
          round={round}
          onNextRound={advanceRound}
        />
      )}

      {gamePhase === 'game_over' && (
        <ResultsDialog players={players} onRestart={initializeGame} />
      )}
    </div>
  );
};

export default GameBoard;

    