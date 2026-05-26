import { useDispatch } from 'react-redux';
import { openModal } from '../store/modalSlice'; // 방금 만든 openModal 가져오기

export default function CartContainer() {
  const dispatch = useDispatch();

  return (
    <div className="cart-container">
      {/* ...기존 장바구니 리스트 코드들... */}

      {/* [수정] 버튼 클릭 시 바로 삭제하지 않고, 모달을 열어줍니다! */}
      <button 
        className="btn clear-btn" 
        onClick={() => dispatch(openModal())}
      >
        장바구니 비우기
      </button>
    </div>
  );
}