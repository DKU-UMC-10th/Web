import { useCallback, useState } from "react";
import CountButton from "./CountButton";
import TextInput from "./TextInput";

export default function UseCallbackPage() {
    const [count, setCount] = useState<number>(0);
    const [text, setText] = useState<string>('');

    const handleIncreaseCount = useCallback((number: number) => {
        setCount(count + number);
    }, [count]);

    const handleText = useCallback((text: string) => {
        setText(text);
    }, []);


    return (
        <div className="callback-page">
            <h1>같이 배우는 리액트 useCallback편</h1>
            <h2>Count : {count}</h2>
            <CountButton onClick={handleIncreaseCount} />
            <h2>Text</h2>
            <div className="text-field">
                <span>{text}</span>
                <TextInput onChange={handleText} />
            </div>
        </div>
    );
}
