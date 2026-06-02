import { memo, type ChangeEvent } from "react";
import type { LanguageCode } from "./LanguageSelector";

interface SelectBoxProps {
    value: LanguageCode;
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const SelectBox = memo(({value, onChange}: SelectBoxProps) => {
    console.log("SelectBox 렌더링");

    return (
        <select className="language-select" value={value} onChange={onChange}>
            <option value="ko-KR">한국어</option>
            <option value="en-US">영어</option>
            <option value="ja-JP">일본어</option>
        </select>
    );
});

export default SelectBox;
