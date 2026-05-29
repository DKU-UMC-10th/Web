import { useState, useMemo } from 'react';

// 1. 소수를 판별하는 무거운 함수 (강의 영상 스타일)
function findPrimes(max) {
  if (max < 2) return [];
  console.log(`🔥 [연산 발생] 2부터 ${max}까지 소수를 계산합니다... (무거운 작업)`);
  
  const primes = [];
  for (let i = 2; i <= max; i++) {
    let isPrime = true;
    for (let j = 2; j < i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(i);
  }
  return primes;
}

export default function PrimeCalculator() {
  const [limit, setLimit] = useState(1000);
  const [text, setText] = useState('');

  // ✅ useMemo로 무거운 연산 결과 캐싱
  // limit 숫자가 바뀔 때만 이 함수가 다시 실행됩니다.
  const primeNumbers = useMemo(() => {
    return findPrimes(limit);
  }, [limit]); // 👈 의존성 배열에 limit 지정

  return (
    <div style={{
      border: '1px dashed #ffa500',
      padding: '20px',
      borderRadius: '12px',
      backgroundColor: '#fffdf9',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center'
    }}>
      <h3>2️⃣ useMemo 실습 (소수 계산기) 🍠</h3>
      
      {/* 무거운 연산에 영향을 주는 인풋 */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontSize: '14px', fontWeight: 'bold' }}>최대 숫자 입력: </label>
        <input 
          type="number" 
          value={limit} 
          onChange={(e) => setLimit(Number(e.target.value))}
          style={{ padding: '4px 8px', width: '80px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      {/* 연산과 아무 상관 없는 인풋 */}
      <div style={{ marginBottom: '15px' }}>
        <input 
          type="text" 
          value={text} 
          placeholder="여기에 타이핑해도 연산 안 바뀜!"
          onChange={(e) => setText(e.target.value)}
          style={{ padding: '6px 10px', width: '220px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ fontSize: '14px', color: '#666' }}>
        <p>입력된 텍스트: {text || '없음'}</p>
        <p style={{ fontWeight: 'bold', color: '#ff6b6b' }}> 발견된 소수 개수: {primeNumbers.length}개</p>
      </div>
    </div>
  );
}