import { useMemo, useState } from "react";
import TextInput from "./components/TextInput";
import { findPrimeNumbers } from "./utils/math";

export default function UseMemoPage() {
    console.log('rerender');

    const [limit, setLimit] = useState(10000);
    const [text, setText] = useState('');

    const handleChangeText = (text: string) => {
        setText(text);
    };

    const primes = useMemo(() => findPrimeNumbers(limit), [limit]);

    return (
        <div
            style={{
                width: '100%',
                padding: '20px 24px',
                boxSizing: 'border-box',
                fontSize: '18px',
                lineHeight: 1.55,
            }}
        >
            <h1 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: 500 }}>
                같이 배우는 리액트: useMemo편
            </h1>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                숫자 입력 (소수 찾기):
                <input
                    type='number'
                    value={limit}
                    style={{
                        width: '230px',
                        padding: '18px 16px',
                        border: '2px solid #0b6fd3',
                        borderRadius: '8px',
                        fontSize: '18px',
                        outline: 'none',
                    }}
                    onChange={(e) => setLimit(Number(e.target.value) || 0)}
                />
            </label>

            <h2 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: 500 }}>
                소수 리스트:
            </h2>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    columnGap: '6px',
                    rowGap: '2px',
                    alignItems: 'flex-start',
                    width: '100%',
                    color: '#111',
                    fontSize: '18px',
                    lineHeight: 1.45,
                }}
            >
                {primes.map((prime) => (
                    <span key={prime}>{prime}</span>
                ))}
            </div>

            <label style={{ display: 'block', marginTop: '24px' }}>
                {text}
                다른 입력 테스트: <TextInput onChange={handleChangeText} />
            </label>
        </div>
    );
}
