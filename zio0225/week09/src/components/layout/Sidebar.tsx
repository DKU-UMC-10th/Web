import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom'; // Link 추가
import ConfirmModal from '../common/ConfirmModal';
import api from '../../api/axios'; // axios 인스턴스 직접 사용 시

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // 1. 탈퇴 Mutation (주소는 이미지에서 본 /v1/users 로 설정!)
  const withdrawMutation = useMutation({
    mutationFn: () => api.delete('/v1/users'),
    onSuccess: () => {
      localStorage.clear();
      alert('그동안 감사했습니다! 🥊');
      navigate('/login');
    },
    onError: (error: any) => {
      console.error(error);
      alert('탈퇴 처리 중 에러가 발생했어요.');
    }
  });

  return (
    <aside className="w-64 bg-zinc-900 h-screen p-6 flex flex-col justify-between border-r border-zinc-800">
      {/* 상단 네비게이션 */}
      <nav className="flex-1">
        <div className="mb-10 px-2 text-pink-500 font-black text-2xl">
          UMC LP
        </div>
        <ul className="space-y-4">
          <li>
            <Link to="/" className="text-zinc-400 hover:text-white transition-colors block px-2 py-2">
              🏠 홈
            </Link>
          </li>
          <li>
            <Link to="/lp-list" className="text-zinc-400 hover:text-white transition-colors block px-2 py-2">
              💿 LP 목록
            </Link>
          </li>
          <li>
            <Link to="/mypage" className="text-zinc-400 hover:text-white transition-colors block px-2 py-2">
              👤 마이페이지
            </Link>
          </li>
        </ul>
      </nav>

      {/* 하단 탈퇴하기 구역 */}
      <div className="pt-6 border-t border-zinc-800">
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="w-full text-left text-sm font-medium text-zinc-500 hover:text-red-500 transition-colors px-2 py-2"
        >
          탈퇴하기
        </button>
      </div>

      {/* 회원 탈퇴 확인 모달 */}
      <ConfirmModal 
        isOpen={isModalOpen}
        title="회원 탈퇴"
        message={`정말 탈퇴하시겠습니까? 🥊\n모든 데이터가 삭제되며 복구할 수 없습니다.`}
        confirmText="탈퇴하기"
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => withdrawMutation.mutate()}
      />
    </aside>
  );
};

export default Sidebar;