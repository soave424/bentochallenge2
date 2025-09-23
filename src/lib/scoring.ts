
import type { Player, Score, ScoreWithBonuses, BonusDetail, MenuItem } from './types';

function hasItemId(bento: Player['bento'], ...ids: string[]): boolean {
  return bento.some(item => ids.includes(item.id));
}

function countItems(bento: Player['bento'], predicate: (item: MenuItem) => boolean): number {
    return bento.filter(predicate).length;
}

export function calculatePlayerScore(player: Player, applyBonuses: boolean): ScoreWithBonuses {
  
  const baseScore: Score = {
    taste: 0,
    convenience: 0,
    eco: 0,
  };

  // 1. Base scores from items
  for (const item of player.bento) {
    baseScore.taste += item.taste;
    baseScore.convenience += item.convenience;
    baseScore.eco += item.eco;
  }
  
  const baseTotal = baseScore.taste + baseScore.convenience + baseScore.eco;
  const bonusDetails: BonusDetail[] = [];
  
  if (!applyBonuses || player.bonusCards.length === 0) {
    return { player, score: baseScore, total: baseTotal, bonusDetails };
  }

  // --- Apply Bonuses ---
  let tasteBonus = 0;
  let convenienceBonus = 0;
  let ecoBonus = 0;
  let totalBonus = 0;

  player.bonusCards.forEach(card => {
    let metric: BonusDetail['metric'] | null = null;
    let value = 0;
    let applied = false;

    // --- Campaign Cards ---
    if (card.id === 'campaign1') { // 텀블러 챌린지
      if (hasItemId(player.bento, '22')) {
        metric = 'eco'; value = 3;
        ecoBonus += value; applied = true;
      }
    }
    else if (card.id === 'campaign2') { // 로컬푸드 지지자
      if (hasItemId(player.bento, '2', '18', '13', '28', '49')) {
        metric = 'eco'; value = 2;
        ecoBonus += value; applied = true;
      }
    }
    else if (card.id === 'campaign3') { // 지구지킴이 인증
      const preCheckEco = player.bento.reduce((acc, item) => acc + item.eco, 0);
      if (preCheckEco >= 10) {
        metric = 'total'; value = 2;
        totalBonus += value; applied = true;
      }
    }
    else if (card.id === 'campaign4') { // 물 절약 캠페인
      if (!hasItemId(player.bento, '21')) {
        metric = 'eco'; value = 2;
        ecoBonus += value; applied = true;
      }
    }
    else if (card.id === 'campaign5') { // 비닐 제로 선언
      if (!hasItemId(player.bento, '41')) { 
        metric = 'total'; value = 3;
        totalBonus += value; applied = true;
      }
    }
    // --- Tax Cards ---
    else if (card.id === 'tax1') { // 플라스틱세 부과
      if (hasItemId(player.bento, '31')) {
        metric = 'total'; value = -2;
        totalBonus += value; applied = true;
      }
    }
    else if (card.id === 'tax3') { // 과대포장 벌금
      if (hasItemId(player.bento, '41')) {
        metric = 'eco'; value = -3;
        ecoBonus += value; applied = true;
      }
    }
    else if (card.id === 'tax4') { // 탄소발자국 경고
      const importedCount = countItems(player.bento, item => ['11', '17', '45'].includes(item.id));
      if (importedCount >= 2) {
        metric = 'total'; value = -2;
        totalBonus += value; applied = true;
      }
    }
     else if (card.id === 'tax5') { // 1회용 패널티
      const disposableCount = countItems(player.bento, item => ['31','21','23','24','41','50'].includes(item.id));
      if (disposableCount >= 2) {
        metric = 'total'; value = -3;
        totalBonus += value; applied = true;
      }
    }

    if(applied && metric) {
      bonusDetails.push({ cardName: card.name, metric, value });
    }
  });

  const finalScore: Score = {
    taste: baseScore.taste + tasteBonus,
    convenience: baseScore.convenience + convenienceBonus,
    eco: baseScore.eco + ecoBonus,
  };
  
  const finalTotal = finalScore.taste + finalScore.convenience + finalScore.eco + totalBonus;

  return { player, score: finalScore, total: finalTotal, bonusDetails };
}
