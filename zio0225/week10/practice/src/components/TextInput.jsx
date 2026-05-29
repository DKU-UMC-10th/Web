import { memo } from 'react';

// React.memo로 컴포넌트를 감싸서 최적화합니다.
const TextInput = memo(({ onChange }) => {
  console.log('TextInput 렌더링됨! 🔄');

  return (
    <input
      type="text"
      placeholder="텍스트를 입력하세요"
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '8px 12px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        width: '220px',
        fontSize: '14px'
      }}
    />
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;