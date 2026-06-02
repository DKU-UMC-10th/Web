import { memo, useCallback, type ChangeEvent, type FormEvent } from "react";
import Input from "./Input";
import LanguageSelector, { type LanguageCode } from "./LanguageSelector";

interface MovieFilterProps {
    keyword: string;
    includeAdult: boolean;
    language: LanguageCode;
    onKeywordChange: (value: string) => void;
    onAdultChange: (value: boolean) => void;
    onLanguageChange: (value: LanguageCode) => void;
    onSubmit: () => void;
}

const MovieFilter = memo(({
    keyword,
    includeAdult,
    language,
    onKeywordChange,
    onAdultChange,
    onLanguageChange,
    onSubmit,
}: MovieFilterProps) => {
    console.log("MovieFilter 렌더링");

    const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit();
    }, [onSubmit]);

    const handleKeywordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        onKeywordChange(event.target.value);
    }, [onKeywordChange]);

    const handleAdultChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        onAdultChange(event.target.checked);
    }, [onAdultChange]);

    const handleLanguageChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        onLanguageChange(event.target.value as LanguageCode);
    }, [onLanguageChange]);

    return (
        <form className="movie-search-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <label className="form-field">
                    <span className="field-label">🎬 영화 제목</span>
                    <Input value={keyword} onChange={handleKeywordChange} />
                </label>

                <label className="form-field">
                    <span className="field-label">⚙️ 옵션</span>
                    <span className="checkbox-box">
                        <input
                            type="checkbox"
                            checked={includeAdult}
                            onChange={handleAdultChange}
                        />
                        성인 콘텐츠 표시
                    </span>
                </label>
            </div>

            <LanguageSelector value={language} onChange={handleLanguageChange} />

            <button className="search-button" type="submit">
                🔍 검색하기
            </button>
        </form>
    );
});

export default MovieFilter;
