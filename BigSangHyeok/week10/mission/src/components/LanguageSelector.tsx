import { memo, type ChangeEvent } from "react";
import SelectBox from "./SelectBox";

export type LanguageCode = "ko-KR" | "en-US" | "ja-JP";

interface LanguageSelectorProps {
    value: LanguageCode;
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const LanguageSelector = memo(({value, onChange}: LanguageSelectorProps) => {
    console.log("LanguageSelector 렌더링");

    return (
        <label className="form-field form-field-full">
            <span className="field-label">🌐 언어</span>
            <SelectBox value={value} onChange={onChange} />
        </label>
    );
});

export default LanguageSelector;
