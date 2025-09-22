import type { MenuItem, BonusCard, Category } from '@/lib/types';

export const menuItems: MenuItem[] = [
  // 라운드 1: 식사
  { id: 1, name: '편의점 김밥', category: 'Side Dish', price: 3, taste: 2, convenience: 2, eco: -2, image: '1', imageHint: 'gimbap roll' },
  { id: 2, name: '수제 김밥', category: 'Side Dish', price: 4, taste: 2, convenience: 0, eco: 2, image: '2', imageHint: 'handmade gimbap' },
  { id: 3, name: '냉동 소떡소떡', category: 'Side Dish', price: 3, taste: 1, convenience: 1, eco: -1, image: '3', imageHint: 'sausage skewer' },
  { id: 4, name: '직접 만든 주먹밥', category: 'Side Dish', price: 3, taste: 1, convenience: -1, eco: 3, image: '4', imageHint: 'rice ball' },
  { id: 5, name: '포장 핫도그', category: 'Side Dish', price: 3, taste: 2, convenience: 2, eco: -2, image: '5', imageHint: 'packaged hotdog' },
  { id: 6, name: '에그 샌드위치', category: 'Side Dish', price: 4, taste: 2, convenience: 1, eco: -1, image: '6', imageHint: 'egg sandwich' },
  { id: 7, name: '채소말이', category: 'Side Dish', price: 4, taste: 1, convenience: 0, eco: 3, image: '7', imageHint: 'vegetable roll' },
  { id: 8, name: '전자레인지 돈가스', category: 'Side Dish', price: 4, taste: 2, convenience: 2, eco: -2, image: '8', imageHint: 'microwave pork' },

  // 라운드 2: 과일
  { id: 11, name: '수입 체리', category: 'Fruit', price: 4, taste: 2, convenience: 1, eco: -2, image: '11', imageHint: 'imported cherries' },
  { id: 12, name: '깎은 과일팩', category: 'Fruit', price: 3, taste: 2, convenience: 2, eco: -2, image: '12', imageHint: 'fruit pack' },
  { id: 13, name: '로컬 사과', category: 'Fruit', price: 2, taste: 1, convenience: 0, eco: 3, image: '13', imageHint: 'local apple' },
  { id: 15, name: '통째로 가져온 참외', category: 'Fruit', price: 2, taste: 1, convenience: -1, eco: 2, image: '15', imageHint: 'korean melon' },
  { id: 16, name: '파인애플 컵과일', category: 'Fruit', price: 3, taste: 2, convenience: 2, eco: -2, image: '16', imageHint: 'pineapple cup' },
  { id: 17, name: '수입 포도', category: 'Fruit', price: 3, taste: 2, convenience: 1, eco: -1, image: '17', imageHint: 'imported grapes' },
  { id: 18, name: '로컬 감', category: 'Fruit', price: 2, taste: 1, convenience: 0, eco: 3, image: '18', imageHint: 'local persimmon' },
  { id: 20, name: '제철 딸기', category: 'Fruit', price: 3, taste: 2, convenience: 1, eco: 2, image: '20', imageHint: 'seasonal strawberry' },

  // 라운드 3: 음료
  { id: 21, name: '플라스틱 생수', category: 'Drink', price: 2, taste: 0, convenience: 2, eco: -2, image: '21', imageHint: 'plastic water' },
  { id: 22, name: '텀블러 물', category: 'Drink', price: 3, taste: 0, convenience: -1, eco: 4, image: '22', imageHint: 'tumbler water' },
  { id: 23, name: '페트병 주스', category: 'Drink', price: 3, taste: 2, convenience: 2, eco: -2, image: '23', imageHint: 'pet-bottle juice' },
  { id: 24, name: '캔 음료', category: 'Drink', price: 3, taste: 1, convenience: 2, eco: -1, image: '24', imageHint: 'can drink' },
  { id: 26, name: '종이팩 음료', category: 'Drink', price: 3, taste: 1, convenience: 2, eco: 1, image: '26', imageHint: 'paper-pack drink' },
  { id: 28, name: '로컬 무첨가 주스', category: 'Drink', price: 4, taste: 2, convenience: 0, eco: 3, image: '28', imageHint: 'local juice' },
  { id: 29, name: '보리차', category: 'Drink', price: 3, taste: 1, convenience: 1, eco: 2, image: '29', imageHint: 'barley tea' },
  { id: 30, name: '카페 아이스커피', category: 'Drink', price: 4, taste: 2, convenience: 2, eco: -2, image: '30', imageHint: 'iced coffee' },

  // 라운드 4: 용기
  { id: 31, name: '일회용 플라스틱 도시락', category: 'Container', price: 2, taste: 0, convenience: 2, eco: -2, image: '31', imageHint: 'plastic container' },
  { id: 32, name: '종이 도시락 용기', category: 'Container', price: 2, taste: 0, convenience: 1, eco: 1, image: '32', imageHint: 'paper container' },
  { id: 33, name: '다회용 도시락통', category: 'Container', price: 3, taste: 0, convenience: 0, eco: 3, image: '33', imageHint: 'reusable container' },
  { id: 34, name: '알루미늄 용기', category: 'Container', price: 2, taste: 0, convenience: 2, eco: -1, image: '34', imageHint: 'aluminum container' },
  { id: 35, name: '천 도시락 보자기', category: 'Container', price: 3, taste: 0, convenience: -1, eco: 4, image: '35', imageHint: 'cloth wrap' },
  { id: 36, name: '옥수수 전분 도시락', category: 'Container', price: 3, taste: 0, convenience: 1, eco: 3, image: '36', imageHint: 'cornstarch container' },
  { id: 38, name: '도시락 보냉백', category: 'Container', price: 3, taste: 0, convenience: 1, eco: 2, image: '38', imageHint: 'cooler bag' },
  { id: 39, name: '투명 도시락 케이스', category: 'Container', price: 3, taste: 0, convenience: 2, eco: -1, image: '39', imageHint: 'clear case' },

  // 라운드 5: 간식
  { id: 41, name: '과대포장 젤리', category: 'Snack', price: 2, taste: 2, convenience: 2, eco: -2, image: '41', imageHint: 'packaged jelly' },
  { id: 43, name: '종이포장 과자', category: 'Snack', price: 2, taste: 1, convenience: 0, eco: 2, image: '43', imageHint: 'paper-wrapped snack' },
  { id: 44, name: '수제 쿠키', category: 'Snack', price: 3, taste: 2, convenience: -1, eco: 3, image: '44', imageHint: 'handmade cookie' },
  { id: 45, name: '수입 초콜릿', category: 'Snack', price: 3, taste: 2, convenience: 1, eco: -1, image: '45', imageHint: 'imported chocolate' },
  { id: 47, name: '지역 빵집 크로와상', category: 'Snack', price: 3, taste: 2, convenience: 0, eco: 2, image: '47', imageHint: 'local croissant' },
  { id: 48, name: '냉동 찐빵', category: 'Snack', price: 2, taste: 1, convenience: 1, eco: 0, image: '48', imageHint: 'frozen bun' },
  { id: 49, name: '로컬 꿀약과', category: 'Snack', price: 3, taste: 1, convenience: 0, eco: 3, image: '49', imageHint: 'local honey-cookie' },
  { id: 50, name: '컵떡볶이', category: 'Snack', price: 3, taste: 2, convenience: 2, eco: -2, image: '50', imageHint: 'cup tteokbokki' },
];

export const bonusCards: BonusCard[] = [
  { id: 'campaign1', type: 'Campaign', name: '텀블러 챌린지', description: '텀블러를 포함하면 친환경+3' },
  { id: 'campaign2', type: 'Campaign', name: '로컬푸드 지지자', description: '로컬/수제 아이템 포함 시 친환경+2' },
  { id: 'campaign3', type: 'Campaign', name: '지구지킴이 인증', description: '친환경 점수 10점 이상이면 소비 만족+2' },
  { id: 'campaign4', type: 'Campaign', name: '물 절약 캠페인', description: '일회용 생수 미선택 시 친환경+2' },
  { id: 'campaign5', type: 'Campaign', name: '비닐 제로 선언', description: '과대포장 제품 미선택 시 친환경+3' },
  { id: 'tax1', type: 'Tax', name: '플라스틱세 부과', description: '일회용 플라스틱 용기 포함 시 소비 만족-2' },
  { id: 'tax2', type: 'Tax', name: '페트병 규제', description: '플라스틱/페트병 음료 선택 시 씨앗 1개 차감' },
  { id: 'tax3', type: 'Tax', name: '과대포장 벌금', description: '과대포장 제품 포함 시 친환경-3' },
  { id: 'tax4', type: 'Tax', name: '탄소발자국 경고', description: '수입 식품 2개 이상 선택 시 총점-2' },
  { id: 'tax5', type: 'Tax', name: '일회용 페널티', description: '일회용품 2개 이상 선택 시 소비 만족-3' },
];

export const getItemById = (id: number): MenuItem | undefined => menuItems.find(item => item.id === id);
