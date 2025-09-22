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
  
  // 1. Base scores from items
  for (const item of player.bento) {
    taste += item.taste;
    convenience += item.convenience;
    eco += item.eco;
  }

  // 2. Apply bonus card effects
  for (const card of player.bonusCards) {
    switch (card.id) {
      // --- Campaign Cards ---
      case 'campaign1': // 텀블러 챌린지
        if (hasItem(player.bento, '텀블러 물')) {
          eco += 3;
        }
        break;
      case 'campaign2': // 로컬푸드 지지자
        if (countItems(player.bento, item => item.name.includes('로컬') || item.name.includes('수제') || item.name.includes('지역')) > 0) {
          eco += 2;
        }
        break;
      case 'campaign4': // 물 절약 캠페인
        if (!hasItem(player.bento, '플라스틱 생수')) {
            eco += 2;
        }
        break;
      case 'campaign5': // 비닐 제로 선언
        if (!hasItem(player.bento, '과대포장 젤리', '포장 핫도그')) { 
            eco += 3;
        }
        break;

      // --- Tax Cards ---
      case 'tax1': // 플라스틱세 부과
        if (hasItem(player.bento, '일회용 플라스틱 도시락')) {
          taste -= 1; // 소비 만족도 = 맛 + 편리함 이므로, 각각 1씩 차감
          convenience -= 1;
        }
        break;
      case 'tax2': // 페트병 규제 - This is applied directly to seeds in GameBoard, not here.
        break; 
      case 'tax3': // 과대포장 벌금
        if (hasItem(player.bento, '과대포장 젤리')) {
          eco -= 3;
        }
        break;
      case 'tax5': // 일회용 페널티
        const disposableCount = countItems(player.bento, item => item.name.startsWith('일회용') || item.name.startsWith('플라스틱') || item.name.startsWith('페트병') || item.name.startsWith('캔'));
        if (disposableCount >= 2) {
            taste -= 2; // 소비 점수 -3, taste/convenience에 분배
            convenience -=1;
        }
        break;
    }
  }

  // 3. Calculate intermediate total for cards that depend on it
  let total = taste + convenience + eco;

  // 4. Apply final modifications that affect the total score
  for (const card of player.bonusCards) {
     switch (card.id) {
        case 'campaign3': // 지구지킴이 인증
            // Note: eco score is the value *before* this card's effect
            const preCheckEco = player.bento.reduce((acc, item) => acc + item.eco, 0);
            if (preCheckEco >= 10) {
                total += 2; // Add to total directly as it's a bonus "satisfaction"
            }
            break;
        case 'tax4': // 탄소발자국 경고
            if (countItems(player.bento, item => item.name.includes('수입')) >= 2) {
              total -= 2;
            }
            break;
     }
  }


  return { taste, convenience, eco, total };
}
