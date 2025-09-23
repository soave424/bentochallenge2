
'use client';
import { useRef, useState, useCallback } from 'react';
import * as htmlToImage from 'html-to-image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Player, ScoreWithBonuses, CATEGORIES, CATEGORY_NAMES, BonusDetail } from '@/lib/types';
import GameResultImage from './GameResultPDF';
import { Download, Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { getBonusEffect } from '@/lib/scoring';

interface DetailedResultsProps {
  player: Player;
  finalScore: ScoreWithBonuses;
  onClose: () => void;
}

const DetailedResults = ({ player, finalScore, onClose }: DetailedResultsProps) => {
  const [comments, setComments] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const imageContentRef = useRef<HTMLDivElement>(null);

  const handleSaveAsImage = useCallback(() => {
    if (imageContentRef.current === null) {
      return;
    }
    setIsSaving(true);
    htmlToImage.toPng(imageContentRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${player.name}-EcoBentoChallenge-Results.png`;
        link.href = dataUrl;
        link.click();
        setIsSaving(false);
      })
      .catch((err) => {
        console.error('oops, something went wrong!', err);
        setIsSaving(false);
      });
  }, [imageContentRef, player.name]);

  const bonusDetails: BonusDetail[] = player.bonusCards.map(card => {
    const effect = getBonusEffect(card, player);
    return effect ? { cardName: card.name, ...effect } : null;
  }).filter((detail): detail is BonusDetail => detail !== null);


  const renderBonusDetail = (detail: BonusDetail, index: number) => {
    let metricText = '';
    switch (detail.metric) {
        case 'eco': metricText = '친환경'; break;
        case 'taste': metricText = '맛'; break;
        case 'convenience': metricText = '편리함'; break;
        case 'total': metricText = '만족도'; break;
        case 'seeds': metricText = '시드'; break;
        default: metricText = detail.metric;
    }

    if (detail.metric === 'seeds') {
        return (
             <div key={index} className="flex justify-between items-center text-sm">
                <p className="text-muted-foreground">{detail.cardName}</p>
                <Badge variant={"destructive"} className="text-xs whitespace-nowrap">
                    {metricText} {detail.value > 0 ? `+${detail.value}` : detail.value}
                </Badge>
            </div>
        )
    }

    return (
        <div key={index} className="flex justify-between items-center text-sm">
            <p className="text-muted-foreground">{detail.cardName}</p>
            <Badge variant={detail.value > 0 ? "success" : "destructive"} className="text-xs whitespace-nowrap">
                {metricText} {detail.value > 0 ? `+${detail.value}` : detail.value}
            </Badge>
        </div>
    );
  }

  return (
    <Dialog open={true} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="text-2xl">결과 상세보기</DialogTitle>
          <DialogDescription>
            {player.name}님의 게임 여정을 되돌아보세요.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] p-1">
            <div style={{ position: 'absolute', left: '-9999px' }}>
                <GameResultImage 
                    ref={imageContentRef}
                    player={player} 
                    finalScore={finalScore} 
                    comments={comments} 
                    bonusDetails={bonusDetails}
                />
            </div>

            {CATEGORIES.map((category, index) => {
                const item = player.bento.find(i => i.category === category);
                return (
                    <div key={category} className="mb-4 p-3 bg-secondary/50 rounded-md">
                        <h4 className="font-bold text-primary">라운드 {index + 1}: {CATEGORY_NAMES[category]}</h4>
                        {item ? (
                            <div>
                                <p>선택한 아이템: <span className="font-semibold">{item.name}</span></p>
                                <p className="text-sm text-muted-foreground">
                                    맛: {item.taste}, 편리함: {item.convenience}, 친환경: {item.eco}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">선택한 아이템 없음</p>
                        )}
                    </div>
                );
            })}

            {bonusDetails.length > 0 && (
                <div className="mb-4 p-3 bg-secondary/50 rounded-md">
                    <h4 className="font-bold text-primary mb-2">적용된 보너스 카드</h4>
                    <div className="space-y-1">
                        {bonusDetails.map(renderBonusDetail)}
                    </div>
                </div>
            )}

             <div className="mt-6">
                <h4 className="font-bold mb-2">소감 남기기</h4>
                <Textarea 
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="이번 게임을 통해 무엇을 느끼셨나요? 어떤 선택이 인상 깊었는지, 혹은 다음에는 어떻게 다르게 플레이하고 싶은지 자유롭게 적어보세요."
                    rows={4}
                />
            </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>닫기</Button>
          <Button onClick={handleSaveAsImage} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Download className="w-4 h-4 mr-2"/>}
            이미지로 저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedResults;
