import type { Player, MenuItem, Score } from './types';

function hasItem(bento: MenuItem[], ...names: string[]): boolean {
  return bento.some(item => names.includes(item.name));
}

function countItems(bento: MenuItem[], predicate: (item: MenuItem) => boolean): number {
    return bento.filter(predicate).length;
}

export function calculatePlayerScore(player: Player): Score {
  let taste = 0;
  let convenience = 0;
  let eco = 0;
  
  // Base scores from items
  for (const item of player.bento) {
    taste += item.taste;
    convenience += item.convenience;
    eco += item.eco;
  }

  const consumption = taste + convenience;

  // Bonus card modifications
  for (const card of player.bonusCards) {
    switch (card.id) {
      // Campaign Cards
      case 'campaign1': // 텀블러 챌린지
        if (hasItem(player.bento, '텀블러 물', '텀블러에 담은 주스')) {
          eco += 3;
        }
        break;
      case 'campaign2': // 로컬푸드 지지자
        if (countItems(player.bento, item => item.name.includes('로컬') || item.name.includes('수제')) > 0) {
          eco += 2;
        }
        break;
      case 'campaign4': // 물 절약 캠페인
        if (!hasItem(player.bento, '플라스틱 생수')) {
            eco += 2;
        }
        break;
      case 'campaign5': // 비닐 제로 선언
        if (!hasItem(player.bento, '과대포장 젤리')) { // Assuming this is the only one
            eco += 3; // "추가 포인트" is ambiguous, adding to eco.
        }
        break;

      // Tax Cards
      case 'tax1': // 플라스틱세 부과
        if (hasItem(player.bento, '일회용 플라스틱 도시락')) {
          // This affects consumption score, which is taste + convenience. Let's reduce both.
          taste -= 1;
          convenience -= 1;
        }
        break;
      case 'tax3': // 과대포장 벌금
        if (hasItem(player.bento, '과대포장 젤리')) {
          eco -= 3;
        }
        break;
      case 'tax4': // 탄소발자국 경고
        if (countItems(player.bento, item => item.name.includes('수입')) >= 2) {
          // This affects total score directly, handled below.
        }
        break;
    }
  }

  let tempConsumption = taste + convenience;
  let total = tempConsumption + eco;

  // Final modifications based on state AFTER other calculations
  for (const card of player.bonusCards) {
    if (card.id === 'campaign3' && eco >= 10) { // 지구지킴이 인증
      // consumption += 2; ambiguous, let's add to both
      taste += 1;
      convenience += 1;
      total += 2;
    }
    if (card.id === 'tax4' && countItems(player.bento, item => item.name.includes('수입')) >= 2) { // 탄소발자국 경고
      total -= 2;
    }
  }

  return { taste, convenience, eco, total };
}
