import { create } from 'zustand';
// 💡 [핵심] 기존에 만들어두신 진짜 음반 데이터를 가져옵니다.
import cartItemsData from '../constants/cartItems'; 

// 1. 타입 정의
interface CartItem {
  id: string;
  title: string;
  singer: string;
  price: string | number;
  img: string;
  amount: number;
}

interface MusicState {
  // 장바구니 상태
  cartItems: CartItem[];
  amount: number;
  total: number;
  // 모달 상태
  isModalOpen: boolean;

  // 장바구니 액션
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
  
  // 모달 액션
  openModal: () => void;
  closeModal: () => void;
}

export const useMusicStore = create<MusicState>((set) => ({
  // 💡 빈 배열 [] 대신 진짜 데이터를 초기값으로 꽂아줍니다!
  cartItems: cartItemsData, 
  amount: 0,
  total: 0,
  isModalOpen: false,

  // 1. 수량 증가
  increase: (id) => set((state) => ({
    cartItems: state.cartItems.map((item) =>
      item.id === id ? { ...item, amount: item.amount + 1 } : item
    )
  })),

  // 2. 수량 감소
  decrease: (id) => set((state) => ({
    cartItems: state.cartItems.map((item) =>
      item.id === id ? { ...item, amount: item.amount - 1 } : item
    ).filter((item) => item.amount > 0)
  })),

  // 3. 개별 아이템 삭제
  removeItem: (id) => set((state) => ({
    cartItems: state.cartItems.filter((item) => item.id !== id)
  })),

  // 4. 장바구니 전체 삭제
  clearCart: () => set({ cartItems: [] }),

  // 5. 총 수량 및 총 금액 합계 계산
  calculateTotals: () => set((state) => {
    let amount = 0;
    let total = 0;
    state.cartItems.forEach((item) => {
      amount += item.amount;
      total += item.amount * Number(item.price);
    });
    return { amount, total };
  }),

  // 6. 모달 열기 / 닫기
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));