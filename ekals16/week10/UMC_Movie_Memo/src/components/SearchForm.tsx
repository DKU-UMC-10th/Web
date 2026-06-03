import { memo } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import type { LanguageOption } from '../movieTypes'

type SearchFormProps = {
  query: string
  includeAdult: boolean
  language: string
  languageOptions: LanguageOption[]
  isLoading: boolean
  hasToken: boolean
  errorMessage: string
  onQueryChange: (value: string) => void
  onIncludeAdultChange: (value: boolean) => void
  onLanguageChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export const SearchForm = memo(function SearchForm({
  query,
  includeAdult,
  language,
  languageOptions,
  isLoading,
  hasToken,
  errorMessage,
  onQueryChange,
  onIncludeAdultChange,
  onLanguageChange,
  onSubmit,
}: SearchFormProps) {
  return (
    <section className="search-panel">
      <form className="search-form" onSubmit={onSubmit}>
        <div className="field-group">
          <label htmlFor="query">영화 제목</label>
          <input
            id="query"
            type="text"
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onQueryChange(event.target.value)}
            placeholder="영화 제목을 입력하세요"
          />
        </div>

        <div className="field-group options-field">
          <label htmlFor="includeAdult">옵션</label>
          <label className="checkbox-row" htmlFor="includeAdult">
            <input
              id="includeAdult"
              type="checkbox"
              checked={includeAdult}
              onChange={(event) => onIncludeAdultChange(event.target.checked)}
            />
            성인 콘텐츠 표시
          </label>
        </div>

        <div className="field-group full-width">
          <label htmlFor="language">언어</label>
          <select
            id="language"
            value={language}
            onChange={(event) => onLanguageChange(event.target.value)}
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="search-button" disabled={isLoading || !hasToken}>
          {isLoading ? '검색 중...' : '검색하기'}
        </button>

        {!hasToken && (
          <p className="help-text">.env 파일에 VITE_TMDB_ACCESS_TOKEN 값을 먼저 설정해 주세요.</p>
        )}

        {errorMessage && <p className="error-text">{errorMessage}</p>}
      </form>
    </section>
  )
});
