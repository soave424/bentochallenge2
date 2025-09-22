'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

interface WelcomeDialogProps {
  onStart: () => void;
}

const WelcomeDialog = ({ onStart }: WelcomeDialogProps) => {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-3xl font-headline text-primary flex items-center gap-2">
            <Rocket className="w-8 h-8" />
            에코 도시락 챌린지!
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground pt-2 text-left">
            최고의 도시락을 만들면서 지속 가능한 선택을 해보세요. 게임 방법은 다음과 같습니다:
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm text-foreground">
          <ul className="list-disc list-inside space-y-2">
            <li><strong>15개의 씨앗</strong>으로 게임을 시작하며, 이 씨앗으로 도시락 아이템을 구매합니다.</li>
            <li>게임은 <strong>식사, 과일, 음료, 용기, 간식</strong> 5개 카테고리에 걸쳐 총 5라운드로 진행됩니다.</li>
            <li>각 라운드마다 모든 플레이어는 해당 카테고리에서 <strong>아이템 1개</strong>를 구매할 수 있습니다.</li>
            <li>주사위를 굴려 같은 숫자가 나오면, 모든 플레이어가 무작위 <strong>보너스 카드</strong>를 받습니다!</li>
            <li>5라운드가 끝나면 게임이 종료됩니다.</li>
            <li>최종 점수(맛 + 편리함 + 친환경)가 가장 높은 플레이어가 승리합니다.</li>
          </ul>
        </div>
        <DialogFooter>
          <Button type="button" onClick={onStart} className="w-full text-lg py-6">
            챌린지 시작하기!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;
