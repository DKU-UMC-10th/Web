import { useState, useCallback } from 'react';
import CountButton from './components/CountButton';
import TextInput from './components/TextInput';
import PrimeCalculator from './components/PrimeCalculator'; // 👈 새로 추가됨

export default function App() {
  // [useCallback용 상태]
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  const handleIncreaseCount = useCallback((number) => {
    setCount((count) => count + number);
  }, [count]);

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
      gap: '40px',
      fontFamily: 'sans-serif',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <h1 style={{ margin: 0 }}>같이 배우는 리액트 최적화 편 🍠</h1>
      
      {/* 실습 1. useCallback & memo */}
      <div style={{
        border: '1px dashed #00bcff',
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: '#f9fdff',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h3>1️⃣ useCallback & memo 실습</h3>
        <h2>Count: {count}</h2>
        <CountButton onClick={handleIncreaseCount} />
        <h2 style={{ marginTop: '20px' }}>Text: <span style={{ fontWeight: 'normal', color: '#555' }}>{text || '비어 있음'}</span></h2>
        <TextInput onChange={handleTextInput} />
      </div>

      {/* 실습 2. useMemo */}
      <PrimeCalculator />
    </main>
  );
}