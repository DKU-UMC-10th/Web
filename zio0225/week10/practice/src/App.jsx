import { useState, useCallback } from 'react';
import CountButton from './components/CountButton';
import TextInput from './components/TextInput';

export default function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // 1. 카운트 증가 함수 (useCallback으로 메모이제이션)
  // 최신 count 상태를 기반으로 연산하므로 의존성 배열에 count를 넣습니다.
  const handleIncreaseCount = useCallback((number) => {
    setCount((count) => count + number);
  }, [count]);

  // 2. 텍스트 변경 함수 (useCallback으로 메모이제이션)
  // 내부에서 외부 상태를 직접 참조하지 않으므로 빈 배열([])을 인자로 전달합니다.
  const handleTextInput = useCallback((text) => {
    setText(text);
  }, []);

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      gap: '20px',
      fontFamily: 'sans-serif'
    }}>
      <h1>같이 배우는 리액트 - useCallback & memo 편 🍠</h1>
      
      <div style={{ textAlign: 'center' }}>
        <h2>Count: {count}</h2>
        {/* 자식 컴포넌트에 메모이제이션된 함수 전달 */}
        <CountButton onClick={handleIncreaseCount} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2>Text: <span style={{ fontWeight: 'normal', color: '#555' }}>{text || '비어 있음'}</span></h2>
        {/* 자식 컴포넌트에 메모이제이션된 함수 전달 */}
        <TextInput onChange={handleTextInput} />
      </div>
    </main>
  );
}