import type { MenuItem, BonusCard } from '@/lib/types';

export const initialMenuItems: MenuItem[] = [
  // 라운드 1: 식사
  { id: '1', name: '편의점 김밥', category: 'Side Dish', price: 3, taste: 2, convenience: 2, eco: -2, image: 'https://img.daily.co.kr/@files/www.daily.co.kr/content/food/2025/20250401/e5c6bc129e42bff900a3cecdfac12627.jpg', imageHint: 'gimbap roll' },
  { id: '2', name: '수제 김밥', category: 'Side Dish', price: 4, taste: 2, convenience: 0, eco: 2, image: 'https://mblogthumb-phinf.pstatic.net/MjAyNDAyMjFfMjYg/MDAxNzA4NTIzODQzMjMy.yqOwvldpKHsIOkP94GgdBEYEJUbUK1u7SHtLYrSpXFkg.swvaybHiWoPi72OtUlaIV_og59R9DN8E4tgYTkxHMEcg.JPEG/20240218%EF%BC%BF123415.jpg?type=w800', imageHint: 'handmade gimbap' },
  { id: '3', name: '냉동 소떡소떡', category: 'Side Dish', price: 3, taste: 1, convenience: 1, eco: -1, image: 'https://www.gamachi.co.kr/data/file/1503987965/1028293093_v10zlB6W_c13565ac85096340ff45daa6f4c78b43df07efaf.png', imageHint: 'sausage skewer' },
  { id: '4', name: '직접 만든 주먹밥', category: 'Side Dish', price: 3, taste: 1, convenience: -1, eco: 3, image: 'https://recipe1.ezmember.co.kr/cache/recipe/2019/12/31/4438564008f3846a48b7049e0e8aa37c1.jpg', imageHint: 'rice ball' },
  { id: '5', name: '포장 핫도그', category: 'Side Dish', price: 3, taste: 2, convenience: 2, eco: -2, image: 'https://cafe24.poxo.com/ec01/wellian4/HOvhRhvOk+Cp2KY4JuusAqJcu0ZBp68m77nAyecBLcqQ81qbuCsRo+WlrELUBcWeAOKZdpGlk49h3lTPejLM2A==/_/web/product/big/20191127/c5cff338784b42027b1fd8d6a12bcd64.jpg', imageHint: 'packaged hotdog' },
  { id: '6', name: '에그 샌드위치', category: 'Side Dish', price: 4, taste: 2, convenience: 1, eco: -1, image: 'https://recipe1.ezmember.co.kr/cache/recipe/2023/10/20/d6f917b9bd4794fbf26e225af1f29da51.jpg', imageHint: 'egg sandwich' },
  { id: '7', name: '채소말이', category: 'Side Dish', price: 4, taste: 1, convenience: 0, eco: 3, image: 'https://recipe1.ezmember.co.kr/cache/recipe/2018/04/15/52ef580cc4a45a09823a01a53312d0a91.jpg', imageHint: 'vegetable roll' },
  { id: '8', name: '전자레인지 돈가스', category: 'Side Dish', price: 4, taste: 2, convenience: 2, eco: -2, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS14XcJcXJ0azpxo4_BWww2hv2JzJPEXZ7TgQ&s', imageHint: 'microwave pork' },

  // 라운드 2: 과일
  { id: '11', name: '수입 체리', category: 'Fruit', price: 4, taste: 2, convenience: 1, eco: -2, image: 'https://img.etoday.co.kr/pto_db/2021/12/600/20211207170852_1695026_1199_778.jpg', imageHint: 'imported cherries' },
  { id: '12', name: '깎은 과일팩', category: 'Fruit', price: 3, taste: 2, convenience: 2, eco: -2, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQMx0Q_A1gGkddk9y344IefCPZ63GUkI0sOA&s', imageHint: 'fruit pack' },
  { id: '13', name: '로컬 사과', category: 'Fruit', price: 2, taste: 1, convenience: 0, eco: 3, image: 'https://guryelocalfood.com/web/product/big/202210/0ce66644ca76c6c75f586de411cab589.jpg', imageHint: 'local apple' },
  { id: '15', name: '통째로 가져온 참외', category: 'Fruit', price: 2, taste: 1, convenience: -1, eco: 2, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBszAXxWPzlBhq0N9GigUh9Su0f0ZHzzVuRjC6nrBTz-1UXWZFhAgPiE1wzVpUWnu7WaY&usqp=CAU', imageHint: 'korean melon' },
  { id: '16', name: '파인애플 컵과일', category: 'Fruit', price: 3, taste: 2, convenience: 2, eco: -2, image: 'https://top-brix.com/data/file/b212/1994115392_bFBATYi5_5edf0178f7546c7ecefd6901345310df54d0e35b.jpg', imageHint: 'pineapple cup' },
  { id: '17', name: '수입 포도', category: 'Fruit', price: 3, taste: 2, convenience: 1, eco: -1, image: 'https://sellermatch.co.kr/data/base/goods/big/20240306/8dbf75af21334b508f6e80667b12eedd.jpg', imageHint: 'imported grapes' },
  { id: '18', name: '로컬 감', category: 'Fruit', price: 2, taste: 1, convenience: 0, eco: 3, image: 'https://www.k-health.com/news/photo/202110/56112_56522_1033.jpg', imageHint: 'local persimmon' },
  { id: '20', name: '제철 딸기', category: 'Fruit', price: 3, taste: 2, convenience: 1, eco: 2, image: 'https://www.daehannews.kr/data/photos/20220102/art_16419510975789_8c9ae3.jpg', imageHint: 'seasonal strawberry' },

  // 라운드 3: 음료
  { id: '21', name: '플라스틱 생수', category: 'Drink', price: 2, taste: 0, convenience: 2, eco: -2, image: 'https://newmarket.co.kr/data/goods/1/2015/02/5920_tmp_c60ed32624fb993047cd288e439fe5638476view.jpg', imageHint: 'plastic water' },
  { id: '22', name: '텀블러 물', category: 'Drink', price: 3, taste: 0, convenience: -1, eco: 4, image: 'https://m.wiggle-wiggle.com/file_data/wigglewiggle20/2024/04/23/392f3215d623824a91c3a46fce8c5756.jpg', imageHint: 'tumbler water' },
  { id: '23', name: '페트병 주스', category: 'Drink', price: 3, taste: 2, convenience: 2, eco: -2, image: 'https://m.gainglobal.kr/web/product/medium/202505/ca6b13c93e492a750f37859fd6072495.jpg', imageHint: 'pet-bottle juice' },
  { id: '24', name: '캔 음료', category: 'Drink', price: 3, taste: 1, convenience: 2, eco: -1, image: 'https://gi.esmplus.com/agnesey77/%EB%AF%B8%EB%8B%88%EC%BA%94/%EB%AF%B8%EB%8B%88%EC%BA%943%EC%A2%85%EC%B9%A0%EC%BD%9C%ED%99%98B.png', imageHint: 'can drink' },
  { id: '26', name: '종이팩 음료', category: 'Drink', price: 3, taste: 1, convenience: 2, eco: 1, image: 'https://img1.newsis.com/2021/10/07/NISI20211007_0000841908_web.jpg', imageHint: 'paper-pack drink' },
  { id: '28', name: '로컬 무첨가 주스', category: 'Drink', price: 4, taste: 2, convenience: 0, eco: 3, image: 'https://oasisprodproduct.edge.naverncp.com/100566/detail/1_c64af169-e2e2-42d1-b1af-4c5e5918de25.JPG', imageHint: 'local juice' },
  { id: '29', name: '보리차', category: 'Drink', price: 3, taste: 1, convenience: 1, eco: 2, image: 'https://m.health.chosun.com/site/data/img_dir/2025/06/02/2025060202587_0.jpg', imageHint: 'barley tea' },
  { id: '30', name: '카페 아이스커피', category: 'Drink', price: 4, taste: 2, convenience: 2, eco: -2, image: 'https://www.coffeebeankorea.com/data/menu/%EC%B9%B4%ED%8E%98%EB%AA%A8%EC%B9%B4IB.jpg', imageHint: 'iced coffee' },

  // 라운드 4: 용기
  { id: '31', name: '일회용 플라스틱 도시락', category: 'Container', price: 2, taste: 0, convenience: 2, eco: -2, image: 'https://cafe24.poxo.com/ec01/tntlife/HOvhRhvOk+Cp2KY4JuusApn6URT0lXRqQyi2n0afAp9ioKrWE49M9NLOlGcpQS37qbhbP8Uqn9F7weUFVGX68A==/_/web/product/big/201604/627_shop1_876174.jpg', imageHint: 'plastic container' },
  { id: '32', name: '종이 도시락 용기', category: 'Container', price: 2, taste: 0, convenience: 1, eco: 1, image: 'https://m.boxgogo.co.kr/web/product/big/202106/14e3248500e1f160c7551beb63f72c2f.jpg', imageHint: 'paper container' },
  { id: '33', name: '다회용 도시락통', category: 'Container', price: 3, taste: 0, convenience: 0, eco: 3, image: 'https://shop4.daumcdn.net/thumb/R500x500/?fname=http%3A%2F%2Fshop4.daumcdn.net%2Fshophow%2Fp%2FC5252113017.jpg%3Fut%3D20250811182933', imageHint: 'reusable container' },
  { id: '34', name: '알루미늄 용기', category: 'Container', price: 2, taste: 0, convenience: 2, eco: -1, image: 'https://m.9062.co.kr/web/product/big/202302/aba430b987ffb5c4667ba042fc816ae5.jpg', imageHint: 'aluminum container' },
  { id: '35', name: '천 도시락 보자기', category: 'Container', price: 3, taste: 0, convenience: -1, eco: 4, image: 'https://godomall.speedycdn.net/2e919bf214683d1eacc8bfe94c87618e/goods/2352/image/detail/1528784492527m0.jpg', imageHint: 'cloth wrap' },
  { id: '36', name: '옥수수 전분 도시락', category: 'Container', price: 3, taste: 0, convenience: 1, eco: 3, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSka68Wu015s4b6CjgSeqNh9VJMUrYscEMFiQ&s', imageHint: 'cornstarch container' },
  { id: '38', name: '도시락 보냉백', category: 'Container', price: 3, taste: 0, convenience: 1, eco: 2, image: 'https://item.elandrs.com/r/image/item/2024-04-24/2ed7933d-c71a-467b-91e0-4168f1a1faf3.jpg?w=750&h=&q=100', imageHint: 'cooler bag' },
  { id: '39', name: '투명 도시락 케이스', category: 'Container', price: 3, taste: 0, convenience: 2, eco: -1, image: 'https://image.made-in-china.com/202f0j00RmyWUucthObf/Disposable-Container-Transparent-Take-Away-PP-Plastic-Lunch-Box.webp', imageHint: 'clear case' },

  // 라운드 5: 간식
  { id: '41', name: '과대포장 젤리', category: 'Snack', price: 2, taste: 2, convenience: 2, eco: -2, image: 'https://gdimg1.gmarket.co.kr/goods_image2/shop_moreimg/197/434/1974348827/1974348827_00.jpg?ver=1726806419', imageHint: 'packaged jelly' },
  { id: '43', name: '종이포장 과자', category: 'Snack', price: 2, taste: 1, convenience: 0, eco: 2, image: 'https://item.elandrs.com/r/image/oa/2024-02-14/43709070-24cb-4808-bd73-786dc71a256c.jpg?w=750&h=&q=100', imageHint: 'paper-wrapped snack' },
  { id: '44', name: '수제 쿠키', category: 'Snack', price: 3, taste: 2, convenience: -1, eco: 3, image: 'https://sitem.ssgcdn.com/95/79/63/item/1000566637995_i1_750.jpg', imageHint: 'handmade cookie' },
  { id: '45', name: '수입 초콜릿', category: 'Snack', price: 3, taste: 2, convenience: 1, eco: -1, image: 'https://webimage.10x10.co.kr/image/basic600/93/B000937716.jpg', imageHint: 'imported chocolate' },
  { id: '47', name: '지역 빵집 크로와상', category: 'Snack', price: 3, taste: 2, convenience: 0, eco: 2, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwEA5vMkQ016qUe5IiJcACrG-zzDAUpgPY8g&s', imageHint: 'local croissant' },
  { id: '48', name: '냉동 찐빵', category: 'Snack', price: 2, taste: 1, convenience: 1, eco: 0, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7JbcBe5DbPYOwkMhysBCqZ2oojRpE5InWRA&s', imageHint: 'frozen bun' },
  { id: '49', name: '로컬 꿀약과', category: 'Snack', price: 3, taste: 1, convenience: 0, eco: 3, image: 'https://moongchi.kr/web/product/big/202201/1f4a0ba88febf94f9c7ab98edee72ca2.jpg', imageHint: 'local honey-cookie' },
  { id: '50', name: '컵떡볶이', category: 'Snack', price: 3, taste: 2, convenience: 2, eco: -2, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2RQTKoni-mUZhp0NL3qgtJ9eZIdWNzR2pFA&s', imageHint: 'cup tteokbokki' },
];

export const bonusCards: BonusCard[] = [
  { id: 'campaign1', type: 'Campaign', name: '텀블러 챌린지', description: '22번 텀블러를 도시락에 포함했다면', effect: '친환경 +3' },
  { id: 'campaign2', type: 'Campaign', name: '로컬푸드 지지자', description: '로컬 식재료(2, 18, 13, 28, 49번)를 포함했다면', effect: '친환경 +2' },
  { id: 'campaign3', type: 'Campaign', name: '지구지킴이 인증', description: '친환경 점수 10점 이상 달성 시', effect: '소비 만족 +2' },
  { id: 'campaign4', type: 'Campaign', name: '물 절약 캠페인', description: '일회용 생수를 선택하지 않았다면', effect: '친환경 +2' },
  { id: 'campaign5', type: 'Campaign', name: '비닐 제로 선언', description: '비닐봉투/과대포장 제품(41번) 모두 미선택 시', effect: '추가 +3' },
  { id: 'tax1', type: 'Tax', name: '플라스틱세 부과', description: '일회용 플라스틱 용기 (31번) 포함 시', effect: '소비 만족 -2' },
  { id: 'tax2', type: 'Tax', name: '페트병 규제', description: '플라스틱 생수(21번), 페트병 주스(23번) 선택 시', effect: '시드 -1' },
  { id: 'tax3', type: 'Tax', name: '과대포장 벌금', description: '과대포장 제품(41번) 포함 시', effect: '친환경 -3' },
  { id: 'tax4', type: 'Tax', name: '탄소발자국 경고', description: '수입 식품 2개 이상 고른 경우 (11번 17번, 45번)', effect: '소비 점수 -2' },
  { id: 'tax5', type: 'Tax', name: '1회용 패널티', description: '❗️‘1회용 패널티’	일회용 젓가락 + 비닐봉투 모두 고른 경우', effect: '소비 점수 -3' },
];


export const getMenuItemById = (id: string, menuItems: MenuItem[]): MenuItem | undefined => menuItems.find(item => item.id === id);

    

    

