'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Player, GamePhase, MenuItem, BonusCard, Category } from '@/lib/types';
import { INITIAL_SEEDS, NUM_VIRTUAL_PLAYERS } from '@/lib/constants';
import { menuItems, bonusCards } from '@/data/game-data';
import { getVirtualPlayerChoices } from '@/app/actions';
import { CATEGORIES, CATEGORY_NAMES }from '@/lib/types';
import { calculatePlayerScore } from '@/lib/scoring';
import { shuffle, cn } from '@/lib/utils';
import { ChevronsRight } from 'lucide-react';

import WelcomeDialog from './WelcomeDialog';
import ResultsDialog from './ResultsDialog';
import PlayerStatus from './PlayerStatus';
import Shop from './Shop';
import Controls from './Controls';
import { useToast } from '@/hooks/use-toast';
import RoundSummary from './RoundSummary';

const GameBoard = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gamePhase, setGamePhase] = useState<GamePhase>('welcome');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [shopItems, setShopItems] = useState<MenuItem[]>([]);
  const [lastBonusCard, setLastBonusCard] = useState<BonusCard | null>(null);
  const [round, setRound] = useState(0); // 0-indexed, so 0 is round 1
  const [purchasedItemIds, setPurchasedItemIds] = useState<number[]>([]);
  const { toast } = useToast();

  const currentCategory = useMemo(() => CATEGORIES[round], [round]);
  const humanPlayer = useMemo(() => players.find(p => p.isHuman), [players]);
  const currentPlayer = useMemo(() => players[currentPlayerIndex], [players, currentPlayerIndex]);
  
  const canHumanPlayerSkip = useMemo(() => {
    if (!humanPlayer || !currentCategory || gamePhase !== 'buying') return false;
    
    // 이미 샀으면 스킵 불가 (무조건 턴 넘어가야 함)
    const hasBoughtFromCategory = humanPlayer.bento.some(i => i.category === currentCategory);
    if(hasBoughtFromCategory){
      return false;
    }
    
    // 살 수 있는 아이템이 하나라도 있으면 스킵 불가
    const canAffordAny = shopItems.some(item => 
        !purchasedItemIds.includes(item.id) && humanPlayer.seeds >= item.price
    );
    return !canAffordAny;
  }, [humanPlayer, currentCategory, shopItems, purchasedItemIds, gamePhase]);

  const roundTurnOrder = useMemo(() => players.map((p, index) => (
    <span key={p.id} className={cn("transition-opacity", index === currentPlayerIndex && "font-bold text-primary animate-pulse")}>
      {p.name}
    </span>
  )), [players, currentPlayerIndex]);

  const advanceRound = () => {
    const nextRound = round + 1;
    setPurchasedItemIds([]);
    if (nextRound >= CATEGORIES.length) {
      setGamePhase('game_over');
      return;
    }
    setRound(nextRound);
    const newPlayerOrder = shuffle([...players]);
    setPlayers(newPlayerOrder);
    
    const firstPlayerIndex = newPlayerOrder.findIndex(p => !p.eliminated);
    if (firstPlayerIndex === -1) {
        setGamePhase('game_over');
        return;
    }

    setCurrentPlayerIndex(firstPlayerIndex);
    setGamePhase('player_turn');
  }

  const nextTurn = useCallback(() => {
    setCurrentPlayerIndex(prevIndex => {
      let nextIndex = prevIndex + 1;
      while(nextIndex < players.length && players[nextIndex].eliminated) {
        nextIndex++;
      }

      if (nextIndex >= players.length) {
        setGamePhase('round_summary');
        return prevIndex;
      }
      return nextIndex;
    });
  }, [players]);


  const initializeGame = useCallback(async () => {
    setGamePhase('loading');
    setRound(0);
    setCurrentPlayerIndex(0);
    setPurchasedItemIds([]);

    const human: Player = {
      id: 'player-human', name: '나', isHuman: true, seeds: INITIAL_SEEDS, bento: [], bonusCards: [], eliminated: false,
    };
    
    const virtualPlayerNames = ['가상 플레이어 1', '가상 플레이어 2', '가상 플레이어 3'];
    let initialPlayers: Player[] = [human];

    if (NUM_VIRTUAL_PLAYERS > 0) {
       const aiChoices = await getVirtualPlayerChoices({
        availableSeeds: INITIAL_SEEDS,
        menuItems: menuItems.map(m => ({
          number: m.id, name: m.name, price: m.price, taste: m.taste, convenience: m.convenience, ecoFriendliness: m.eco,
        })),
        numVirtualPlayers: NUM_VIRTUAL_PLAYERS,
      });

      const virtualPlayers: Player[] = Array.from({ length: NUM_VIRTUAL_PLAYERS }).map((_, i) => ({
        id: `player-ai-${i}`, name: virtualPlayerNames[i], isHuman: false, seeds: INITIAL_SEEDS, bento: [], bonusCards: [], aiShoppingList: aiChoices.playerChoices[i]?.itemNumbers || [], eliminated: false,
      }));
      initialPlayers.push(...virtualPlayers);
    }
    
    const shuffledPlayers = shuffle(initialPlayers);
    const firstPlayerIndex = shuffledPlayers.findIndex(p => !p.eliminated);

    setPlayers(shuffledPlayers);
    setCurrentPlayerIndex(firstPlayerIndex);
    setGamePhase('player_turn');
  }, []);
  
  // Main Game Loop Effect
  useEffect(() => {
    if (!currentPlayer || gamePhase === 'welcome' || gamePhase === 'loading' || gamePhase === 'round_summary' || gamePhase === 'game_over') return;
    
    if (currentPlayer.eliminated) {
        setTimeout(() => nextTurn(), 500);
        return;
    }

    if (currentPlayer.isHuman) {
        setGamePhase('rolling');
    } else {
        setGamePhase('ai_turn');
    }
  }, [currentPlayer, gamePhase, nextTurn]);

  // Update shop items when round changes
  useEffect(() => {
    if (gamePhase === 'welcome' || gamePhase === 'loading') return;
    setShopItems(menuItems.filter(item => item.category === currentCategory));
  }, [round, currentCategory, gamePhase]);

  // Check for eliminated players
  useEffect(() => {
      if (gamePhase === 'welcome' || gamePhase === 'loading' || players.length === 0) return;
  
      const minPriceOverall = Math.min(...menuItems.map(i => i.price));
      
      const updatedPlayers = players.map(p => {
          if (!p.eliminated && p.seeds < minPriceOverall) {
              const canAffordAnythingEver = menuItems.some(item => p.seeds >= item.price);
              if (!canAffordAnythingEver) {
                   toast({ title: "플레이어 탈락", description: `${p.name}님은 씨앗이 부족하여 더 이상 아이템을 구매할 수 없습니다.`, variant: 'destructive'});
                   return { ...p, eliminated: true };
              }
          }
          return p;
      });
  
      // Only update state if there's a change to avoid loops
      if (JSON.stringify(updatedPlayers) !== JSON.stringify(players)) {
          setPlayers(updatedPlayers);
      }
  }, [players, toast, gamePhase]);


  const handleRollDice = (d1: number, d2: number) => {
    setDice([d1, d2]);
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
    
    setPlayers(prev => prev.map(p => {
      if (p.id === currentPlayer.id) {
        const newSeeds = p.seeds - item.price;
        let finalSeeds = newSeeds;

        if ( (item.name === '플라스틱 생수' || item.name === '페트병 주스') && p.bonusCards.some(c => c.id === 'tax2') ) {
          toast({ title: '페트병 규제!', description: `'${item.name}' 구매로 씨앗 1개를 잃습니다.`, variant: 'destructive' });
          finalSeeds = newSeeds > 0 ? newSeeds -1 : 0;
        }

        return {
          ...p,
          seeds: finalSeeds,
          bento: [...p.bento, item],
        };
      }
      return p;
    }));
    
    setPurchasedItemIds(prev => [...prev, item.id]);
    
    toast({ title: '아이템 구매!', description: `${item.name}을(를) ${item.price} 씨앗으로 구매했습니다.` });
    
    setTimeout(() => nextTurn(), 1500);
  };
  
  useEffect(() => {
    if (gamePhase === 'ai_turn' && currentPlayer && !currentPlayer.isHuman && currentCategory) {
      const ai = currentPlayer;
      
      const startAiTurn = () => {
        toast({ title: `${ai.name}의 턴`, description: `${ai.name}이(가) 자신의 차례를 시작합니다.`});

        // 1. AI 주사위 굴리기
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        setDice([d1,d2]);
        toast({ description: `${ai.name}이(가) 주사위를 굴려 ${d1}과(와) ${d2}이(가) 나왔습니다.`});

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

        // 2. AI 아이템 구매
        setTimeout(() => {
          const hasBoughtFromCategory = ai.bento.some(i => i.category === currentCategory);
          let boughtAnItem = false;

          if (!hasBoughtFromCategory) {
              const availableCategoryItems = shopItems.filter(item => !purchasedItemIds.includes(item.id) && ai.seeds >= item.price);

              if (availableCategoryItems.length > 0) {
                  let itemToBuy: MenuItem | undefined;
                  const shoppingListItems = availableCategoryItems.filter(item => ai.aiShoppingList?.includes(item.id));

                  if(shoppingListItems.length > 0) {
                      itemToBuy = shoppingListItems.sort((a,b) => b.price - a.price)[0];
                  } else {
                      itemToBuy = availableCategoryItems.sort((a,b) => b.price - a.price)[0];
                  }

                  if (itemToBuy) {
                      boughtAnItem = true;
                      setPlayers(prev => prev.map(p => {
                          if (p.id === ai.id) {
                              const newSeeds = ai.seeds - itemToBuy!.price;
                              let finalSeeds = newSeeds;
                              if ((itemToBuy!.name === '플라스틱 생수' || itemToBuy!.name === '페트병 주스') && p.bonusCards.some(c => c.id === 'tax2')) {
                                  toast({ title: '페트병 규제!', description: `${ai.name}이(가) '${itemToBuy!.name}' 구매로 씨앗 1개를 잃습니다.`, variant: 'destructive' });
                                  finalSeeds = newSeeds > 0 ? newSeeds -1 : 0;
                              }
                              return {
                                  ...p,
                                  seeds: finalSeeds,
                                  bento: [...p.bento, itemToBuy!],
                                  aiShoppingList: p.aiShoppingList?.filter(id => id !== itemToBuy!.id)
                              };
                          }
                          return p;
                      }));
                      setPurchasedItemIds(prev => [...prev, itemToBuy!.id]);
                      toast({ title: `${ai.name} 구매!`, description: `${ai.name}이(가) ${itemToBuy.name}을(를) ${itemToBuy.price} 씨앗으로 샀습니다.` });
                  }
              }
          }

          if (!boughtAnItem) {
              const canAffordAny = shopItems.some(item => !purchasedItemIds.includes(item.id) && ai.seeds >= item.price);
              if (canAffordAny) {
                  toast({ description: `${ai.name}은(는) 이번 라운드에 이미 구매를 마쳤습니다.` });
              } else {
                  toast({ description: `${ai.name}은(는) 살 수 있는 아이템이 없어 턴을 마칩니다.` });
              }
          }
          
          setTimeout(() => nextTurn(), 2000);
        }, 1500);
      };

      setTimeout(startAiTurn, 1000);
    }
  }, [gamePhase, currentPlayer, nextTurn, shopItems, toast, currentCategory, purchasedItemIds]);
  

  if (gamePhase === 'welcome') {
    return <WelcomeDialog onStart={initializeGame} />;
  }
  
  if (gamePhase === 'loading' || !currentCategory || !humanPlayer || !currentPlayer) {
    return <div className="text-xl font-headline">게임 준비 중...</div>
  }

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
      <div className="lg:col-span-2">
        <div className="mb-4 p-3 bg-secondary/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">이번 라운드 순서</p>
            <div className="font-semibold text-lg flex items-center justify-center gap-x-4 flex-wrap">
                {roundTurnOrder.map((name, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {name}
                        {index < roundTurnOrder.length - 1 && <ChevronsRight className="w-5 h-5 text-muted-foreground" />}
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

      <div className="flex flex-col gap-6">
        <Controls
          phase={gamePhase}
          dice={dice}
          onRoll={handleRollDice}
          onSkip={() => nextTurn()}
          canSkip={canHumanPlayerSkip}
        />

        <div className="space-y-4">
          <PlayerStatus 
              key={humanPlayer.id} 
              player={humanPlayer} 
              score={calculatePlayerScore(humanPlayer)} 
              isCurrent={true}
          />
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
