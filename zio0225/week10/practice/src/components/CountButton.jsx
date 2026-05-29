import { memo } from 'react';

// React.memo로 컴포넌트를 감싸서 최적화합니다.
const CountButton = memo(({ onClick }) => {
  console.log('CountButton 렌더링됨! 🔄');

  return (
    <button
      onClick={() => onClick(10)}
      style={{
        padding: '8px 16px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      카운트 증가 (+10)
    </button>
  );
});

CountButton.displayName = 'CountButton';

export default CountButton;