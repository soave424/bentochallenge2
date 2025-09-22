
'use client';
import React from 'react';
import { Player, ScoreWithBonuses, CATEGORIES, CATEGORY_NAMES, MenuItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface GameResultImageProps {
    player: Player;
    finalScore: ScoreWithBonuses;
    comments: string;
}

const GameResultImage = React.forwardRef<HTMLDivElement, GameResultImageProps>(({ player, finalScore, comments }, ref) => {

    const renderBentoItem = (item: MenuItem) => (
        <div key={item.id} className="p-2 border rounded-md text-center bg-gray-50">
            <p className="font-bold">{item.name}</p>
            <p className="text-xs">맛: {item.taste} | 편리: {item.convenience} | 친환경: {item.eco}</p>
        </div>
    );
    
    return (
        <div ref={ref} className="p-8 bg-white text-gray-900 font-sans w-[800px]">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-green-700">친환경 소비를 고려하는 똑똑한 소비자</h1>
                <p className="text-xl mt-2">{player.name}님의 게임 결과</p>
            </header>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>최종 점수</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-2xl font-bold">소비자 만족도: {finalScore.total}</p>
                    <div className="flex justify-around text-center">
                        <div><p className="font-semibold">맛</p><p>{finalScore.score.taste}</p></div>
                        <div><p className="font-semibold">편리함</p><p>{finalScore.score.convenience}</p></div>
                        <div><p className="font-semibold">친환경</p><p>{finalScore.score.eco}</p></div>
                    </div>
                </CardContent>
            </Card>
            
            {finalScore.bonusDetails.length > 0 && (
                <Card className="mb-6">
                    <CardHeader><CardTitle>적용된 보너스 카드</CardTitle></CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside">
                            {finalScore.bonusDetails.map((detail, i) => (
                                <li key={i}>{detail.cardName} ({detail.value > 0 ? `+${detail.value}` : detail.value} {detail.metric})</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            <Card className="mb-6">
                <CardHeader><CardTitle>나의 도시락</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-3 gap-2">
                     {player.bento.map(renderBentoItem)}
                </CardContent>
            </Card>
            
             <Card>
                <CardHeader><CardTitle>나의 소감</CardTitle></CardHeader>
                <CardContent>
                    <p className="p-4 border bg-gray-50 rounded-md whitespace-pre-wrap">{comments || '작성된 소감이 없습니다.'}</p>
                </CardContent>
            </Card>

            <footer className="text-center mt-8 text-xs text-gray-500">
                <p>Eco Bento Challenge - 플레이해주셔서 감사합니다!</p>
            </footer>
        </div>
    );
});

GameResultImage.displayName = 'GameResultImage';
export default GameResultImage;
