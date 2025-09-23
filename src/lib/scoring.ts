
import type { Player, Score, ScoreWithBonuses, BonusDetail, MenuItem } from './types';

function hasItemId(bento: Player['bento'], ...ids: string[]): boolean {
  return bento.some(item => ids.includes(item.id));
}

function countItems(bento: Player['bento'], predicate: (item: MenuItem) => boolean): number {
    return bento.filter(predicate).length;
}

export function calculatePlayerScore(player: Player, applyBonuses: boolean): ScoreWithBonuses {
  
  const score: Score = {
    taste: 0,
    convenience: 0,
    eco: 0,
  };

  // 1. Base scores from items
  for (const item of player.bento) {
    score.taste += item.taste;
    score.convenience += item.convenience;
    score.eco += item.eco;
  }
  
  const baseTotal = score.taste + score.convenience + score.eco;
  const bonusDetails: BonusDetail[] = [];
  
  if (!applyBonuses || player.bonusCards.length === 0) {
    return { player, score: score, total: baseTotal, bonusDetails };
  }

  // --- Apply Bonuses ---
  let finalScore = { ...score };
  let totalBonus = 0;

  player.bonusCards.forEach(card => {
    let metric: BonusDetail['metric'] | null = null;
    let value = 0;
    let applied = false;

    // --- Campaign Cards (Bonuses) ---
    if (card.id === 'campaign1') { // 텀블러 챌린지
      if (hasItemId(player.bento, '22')) {
        finalScore.eco += 3;
        metric = 'eco'; value = 3; applied = true;
      }
    } else if (card.id === 'campaign2') { // 로컬푸드 지지자
      if (player.bento.some(i => ['2', '18', '13', '28', '49'].includes(i.id))) {
        finalScore.eco += 2;
        metric = 'eco'; value = 2; applied = true;
      }
    } else if (card.id === 'campaign3') { // 지구지킴이 인증
      if (score.eco >= 10) {
        totalBonus += 2;
        metric = 'total'; value = 2; applied = true;
      }
    } else if (card.id === 'campaign4') { // 물 절약 캠페인
      if (!hasItemId(player.bento, '21')) {
        finalScore.eco += 2;
        metric = 'eco'; value = 2; applied = true;
      }
    } else if (card.id === 'campaign5') { // 비닐 제로 선언
      if (!hasItemId(player.bento, '41')) { 
        totalBonus += 3;
        metric = 'total'; value = 3; applied = true;
      }
    }
    // --- Tax Cards (Penalties) ---
    else if (card.id === 'tax1') { // 플라스틱세 부과
      if (hasItemId(player.bento, '31')) {
        totalBonus -= 2;
        metric = 'total'; value = -2; applied = true;
      }
    }
    else if (card.id === 'tax3') { // 과대포장 벌금
      if (hasItemId(player.bento, '41')) {
        finalScore.eco -= 3;
        metric = 'eco'; value = -3; applied = true;
      }
    }
    else if (card.id === 'tax4') { // 탄소발자국 경고
      const importedCount = countItems(player.bento, item => ['11', '17', '45'].includes(item.id));
      if (importedCount >= 2) {
        totalBonus -= 2;
        metric = 'total'; value = -2; applied = true;
      }
    }
     else if (card.id === 'tax5') { // 1회용 패널티
       // '일회용 젓가락'과 '비닐봉투'는 현재 게임 아이템에 없으므로, 일회용품으로 간주되는 아이템들로 대체합니다.
      const disposableCount = countItems(player.bento, item => ['31', '41', '21', '23', '24', '50'].includes(item.id));
      if (disposableCount >= 2) {
        totalBonus -= 3;
        metric = 'total'; value = -3; applied = true;
      }
    }

    if(applied && metric) {
      bonusDetails.push({ cardName: card.name, metric, value });
    }
  });

  const finalTotal = finalScore.taste + finalScore.convenience + finalScore.eco + totalBonus;

  return { player, score: finalScore, total: finalTotal, bonusDetails };
}
