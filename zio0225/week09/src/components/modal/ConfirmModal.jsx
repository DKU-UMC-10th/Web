import { useMusicStore } from '../../store/useMusicStore';

export default function ConfirmModal() {
  // Zustand 구조 분해 할당으로 상태와 액션을 다이렉트로 쏙쏙 꺼내옵니다.
  const { isModalOpen, closeModal, clearCart } = useMusicStore();

  if (!isModalOpen) return null;

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 999
    }}>
      <div style={{
        backgroundColor: 'white', padding: '2rem 3rem', borderRadius: '10px',
        textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
      }}>
        <h4>장바구니를 모두 비우시겠습니까?</h4>
        
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button 
            type="button" 
            onClick={() => {
              clearCart();   // Zustand 전체 삭제 액션 바로 실행
              closeModal();  // Zustand 모달 닫기 액션 바로 실행
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded cursor-pointer"
          >
            네
          </button>

          <button 
            type="button" 
            onClick={closeModal}
            className="px-6 py-2 bg-red-500 text-white rounded cursor-pointer"
          >
            아니요
          </button>
        </div>
      </div>
    </aside>
  );
}