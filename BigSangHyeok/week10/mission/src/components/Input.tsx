import { memo, type ChangeEvent } from "react";

interface InputProps {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Input = memo(({value, onChange}: InputProps) => {
    console.log("Input 렌더링");

    return (
        <input
            className="movie-input"
            type="text"
            value={value}
            onChange={onChange}
            placeholder="영화 제목을 입력하세요"
        />
    );
});

export default Input;
