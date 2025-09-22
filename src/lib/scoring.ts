
import type { Player, Score, ScoreWithBonuses, BonusDetail, MenuItem } from './types';

function hasItem(bento: Player['bento'], ...names: string[]): boolean {
  return bento.some(item => names.includes(item.name));
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
  
  if (!applyBonuses) {
    return { player, score, total: baseTotal, bonusDetails };
  }

  // --- Apply Bonuses ---
  let ecoBonus = 0;
  let totalBonus = 0;

  player.bonusCards.forEach(card => {
    let metric: BonusDetail['metric'] = 'total';
    let value = 0;
    let applied = false;

    // --- Campaign Cards ---
    if (card.id === 'campaign1') { // 텀블러 챌린지
      if (hasItem(player.bento, '텀블러 물')) {
        metric = 'eco'; value = 3;
        ecoBonus += value; applied = true;
      }
    } else if (card.id === 'campaign2') { // 로컬푸드 지지자
      if (countItems(player.bento, item => item.name.includes('로컬') || item.name.includes('수제') || item.name.includes('지역')) > 0) {
        metric = 'eco'; value = 2;
        ecoBonus += value; applied = true;
      }
    } else if (card.id === 'campaign3') { // 지구지킴이 인증
      const preCheckEco = player.bento.reduce((acc, item) => acc + item.eco, 0);
      if (preCheckEco >= 10) {
        metric = 'total'; value = 2;
        totalBonus += value; applied = true;
      }
    } else if (card.id === 'campaign4') { // 물 절약 캠페인
      if (!hasItem(player.bento, '플라스틱 생수')) {
        metric = 'eco'; value = 2;
        ecoBonus += value; applied = true;
      }
    } else if (card.id === 'campaign5') { // 비닐 제로 선언
      if (!hasItem(player.bento, '과대포장 젤리', '포장 핫도그')) { 
        metric = 'eco'; value = 3;
        ecoBonus += value; applied = true;
      }
    }
    // --- Tax Cards ---
    else if (card.id === 'tax1') { // 플라스틱세 부과
      if (hasItem(player.bento, '일회용 플라스틱 도시락')) {
        metric = 'total'; value = -2;
        totalBonus += value; applied = true;
      }
    } else if (card.id === 'tax3') { // 과대포장 벌금
      if (hasItem(player.bento, '과대포장 젤리')) {
        metric = 'eco'; value = -3;
        ecoBonus += value; applied = true;
      }
    } else if (card.id === 'tax4') { // 탄소발자국 경고
      if (countItems(player.bento, item => item.name.includes('수입')) >= 2) {
        metric = 'total'; value = -2;
        totalBonus += value; applied = true;
      }
    } else if (card.id === 'tax5') { // 일회용 페널티
      const disposableCount = countItems(player.bento, item => item.name.startsWith('일회용') || item.name.startsWith('플라스틱') || item.name.startsWith('페트병') || item.name.startsWith('캔'));
      if (disposableCount >= 2) {
        metric = 'total'; value = -3;
        totalBonus += value; applied = true;
      }
    }

    if(applied) {
      bonusDetails.push({ cardName: card.name, metric, value });
    }
  });

  const finalScore: Score = {
    taste: score.taste,
    convenience: score.convenience,
    eco: score.eco + ecoBonus,
  };
  
  const finalTotal = finalScore.taste + finalScore.convenience + finalScore.eco + totalBonus;

  return { player, score: finalScore, total: finalTotal, bonusDetails };
}
