

import type { Player, Score, ScoreWithBonuses, BonusDetail, MenuItem, BonusCard } from './types';

function hasItemId(bento: Player['bento'], ...ids: string[]): boolean {
  return bento.some(item => ids.includes(item.id));
}

function countItems(bento: Player['bento'], predicate: (item: MenuItem) => boolean): number {
    return bento.filter(predicate).length;
}

type BonusEffect = {
  metric: 'taste' | 'convenience' | 'eco' | 'total' | 'seeds';
  value: number;
}

export function getBonusEffect(card: BonusCard, player: Player): BonusEffect | null {
  const bento = player.bento;
  const baseScore: Score = bento.reduce((acc, item) => ({
    taste: acc.taste + item.taste,
    convenience: acc.convenience + item.convenience,
    eco: acc.eco + item.eco,
  }), { taste: 0, convenience: 0, eco: 0 });

  switch (card.id) {
    case 'campaign1': // 텀블러 챌린지
      if (hasItemId(bento, '22')) return { metric: 'eco', value: 3 };
      break;
    case 'campaign2': // 로컬푸드 지지자
      if (bento.some(i => ['2', '18', '13', '28', '49'].includes(i.id))) return { metric: 'eco', value: 2 };
      break;
    case 'campaign3': // 지구지킴이 인증
      if (baseScore.eco >= 10) return { metric: 'total', value: 2 };
      break;
    case 'campaign4': // 물 절약 캠페인
      if (!hasItemId(bento, '21')) return { metric: 'eco', value: 2 };
      break;
    case 'campaign5': // 비닐 제로 선언
      if (!hasItemId(bento, '41')) return { metric: 'total', value: 3 };
      break;
    case 'tax1': // 플라스틱세 부과
      if (hasItemId(bento, '31')) return { metric: 'total', value: -2 };
      break;
    case 'tax2': // 페트병 규제. 시드 변경은 구매 시점에 처리. 여기서는 시각적 표시용.
      if (hasItemId(bento, '21', '23')) return { metric: 'seeds', value: -1 };
      break;
    case 'tax3': // 과대포장 벌금
      if (hasItemId(bento, '41')) return { metric: 'eco', value: -3 };
      break;
    case 'tax4': // 탄소발자국 경고
      const importedCount = countItems(bento, item => ['11', '17', '45'].includes(item.id));
      if (importedCount >= 2) return { metric: 'total', value: -2 };
      break;
    case 'tax5': // 1회용 패널티
      const disposableCount = countItems(bento, item => ['31', '41', '21', '23', '24', '50'].includes(item.id));
      if (disposableCount >= 2) return { metric: 'total', value: -3 };
      break;
  }
  return null;
}

export function calculatePlayerScore(player: Player, appliedBonuses: BonusCard[]): ScoreWithBonuses {
  
  const finalScore: Score = player.bento.reduce((acc, item) => ({
    taste: acc.taste + item.taste,
    convenience: acc.convenience + item.convenience,
    eco: acc.eco + item.eco,
  }), { taste: 0, convenience: 0, eco: 0 });

  let totalBonus = 0;

  appliedBonuses.forEach(card => {
    const effect = getBonusEffect(card, player);
    if (!effect || effect.metric === 'seeds') return;

    if (effect.metric === 'total') {
        totalBonus += effect.value;
    } else {
        finalScore[effect.metric] += effect.value;
    }
  });

  const finalTotal = finalScore.taste + finalScore.convenience + finalScore.eco + totalBonus;
  
  const bonusDetails: BonusDetail[] = appliedBonuses.map(card => {
     const effect = getBonusEffect(card, player);
     return effect ? { cardName: card.name, ...effect } : null;
  }).filter((detail): detail is BonusDetail => detail !== null);

  return { player, score: finalScore, total: finalTotal, bonusDetails };
}
