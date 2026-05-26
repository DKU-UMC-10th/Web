import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onClose, confirmText = "확인", cancelText = "취소" }) => {
  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 배경 딤드(Dimmed) 처리 - 클릭 시 닫힘 */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div className="relative w-full max-w-sm rounded-[2.5rem] border border-zinc-800 bg-zinc-950 p-8 shadow-2xl shadow-pink-500/10">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          <p className="text-sm text-zinc-400 mb-8 whitespace-pre-wrap">
            {message}
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl bg-zinc-900 py-4 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 rounded-2xl bg-red-600/20 py-4 text-sm font-semibold text-red-500 hover:bg-red-600 hover:text-white transition-all"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;