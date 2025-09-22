'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMenuItems, saveMenuItems } from '@/lib/game-data-service';
import { initialMenuItems } from '@/data/game-data';
import type { MenuItem, Category } from '@/lib/types';
import { CATEGORIES, CATEGORY_NAMES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Home, Save, RotateCcw } from 'lucide-react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
        // For development, we can bypass auth via session storage
        if(sessionStorage.getItem('admin-auth') === 'true') {
            setIsAuthenticated(true);
        }
    }
    checkAuth();
  }, []);
  
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    const items = await getMenuItems();
    setMenuItems(items);
  };

  const handlePasswordSubmit = () => {
    if (password === '1234') {
      sessionStorage.setItem('admin-auth', 'true');
      setIsAuthenticated(true);
    } else {
      toast({ title: '비밀번호 오류', description: '비밀번호가 올바르지 않습니다.', variant: 'destructive' });
    }
  };

  const handleInputChange = (
    id: number,
    field: keyof MenuItem,
    value: string | number
  ) => {
    setMenuItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  
  const handleSave = async () => {
    try {
      await saveMenuItems(menuItems);
      toast({ title: '저장 완료', description: '메뉴 변경사항이 성공적으로 저장되었습니다.' });
    } catch (error) {
      toast({ title: '저장 실패', description: '메뉴 저장 중 오류가 발생했습니다.', variant: 'destructive' });
    }
  };

  const handleReset = async () => {
    try {
      await saveMenuItems(initialMenuItems);
      setMenuItems(initialMenuItems);
      toast({ title: '초기화 완료', description: '메뉴가 기본값으로 초기화되었습니다.' });
    } catch (error) {
      toast({ title: '초기화 실패', description: '메뉴 초기화 중 오류가 발생했습니다.', variant: 'destructive' });
    }
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>관리자 인증</DialogTitle>
            <DialogDescription>
              메뉴를 수정하려면 비밀번호를 입력하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호"
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => router.push('/')}>홈으로</Button>
            <Button onClick={handlePasswordSubmit}>인증</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">메뉴 수정</h1>
        <div className="flex gap-2">
            <Button onClick={() => router.push('/')} variant="outline">
                <Home className="w-4 h-4 mr-2" />
                게임으로
            </Button>
            <Button onClick={handleReset} variant="destructive">
                <RotateCcw className="w-4 h-4 mr-2" />
                초기화
            </Button>
            <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                저장
            </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>라운드</TableHead>
              <TableHead>라운드명</TableHead>
              <TableHead>번호</TableHead>
              <TableHead>상품명</TableHead>
              <TableHead>가격</TableHead>
              <TableHead>맛</TableHead>
              <TableHead>편리함</TableHead>
              <TableHead>친환경</TableHead>
              <TableHead>이미지 URL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems.map(item => (
              <TableRow key={item.id}>
                <TableCell>{CATEGORIES.indexOf(item.category) + 1}</TableCell>
                <TableCell>{CATEGORY_NAMES[item.category]}</TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  <Input
                    value={item.name}
                    onChange={e => handleInputChange(item.id, 'name', e.target.value)}
                    className="min-w-[150px]"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.price}
                    onChange={e => handleInputChange(item.id, 'price', Number(e.target.value))}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.taste}
                    onChange={e => handleInputChange(item.id, 'taste', Number(e.target.value))}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.convenience}
                    onChange={e => handleInputChange(item.id, 'convenience', Number(e.target.value))}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.eco}
                    onChange={e => handleInputChange(item.id, 'eco', Number(e.target.value))}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={item.image}
                    onChange={e => handleInputChange(item.id, 'image', e.target.value)}
                    className="min-w-[100px]"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

    