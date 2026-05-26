import { createSlice } from '@reduxjs/toolkit';

// 1. 모달의 상태 타입 정의
interface ModalState {
  isOpen: boolean;
}

// 2. 초기 상태 설정 (isOpen: false)
const initialState: ModalState = {
  isOpen: false,
};

// 3. Modal Slice 생성
const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    // 모달 열기 액션
    openModal: (state) => {
      state.isOpen = true;
    },
    // 모달 닫기 액션
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

// 컴포넌트에서 사용할 수 있도록 액션 내보내기
export const { openModal, closeModal } = modalSlice.actions;

// store에 등록할 수 있도록 리듀서 내보내기
export default modalSlice.reducer;