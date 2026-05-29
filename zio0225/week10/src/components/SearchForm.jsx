import { memo } from 'react';

const SearchForm = memo(({ 
  title, setTitle, 
  includeAdult, setIncludeAdult, 
  language, setLanguage, 
  onSubmit 
}) => {
  console.log('SearchForm 렌더링됨! 🔍');

  return (
    <form onSubmit={onSubmit} style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '800px'
    }}>
      {/* 1. 영화 제목 입력창 */}
      <input
        type="text"
        value={title}
        placeholder="영화 제목을 입력하세요..."
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '250px' }}
      />

      {/* 2. 성인 콘텐츠 체크박스 */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={includeAdult}
          onChange={(e) => setIncludeAdult(e.target.checked)}
        />
        🔞 성인 콘텐츠 포함
      </label>

      {/* 3. 언어 선택 드롭다운 */}
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
      >
        <option value="ko-KR">한국어 (ko-KR)</option>
        <option value="en-US">영어 (en-US)</option>
        <option value="ja-JP">일본어 (ja-JP)</option>
      </select>

      {/* 4. 검색 실행 버튼 */}
      <button type="submit" style={{
        padding: '8px 16px',
        backgroundColor: '#ff4757',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}>
        검색
      </button>
    </form>
  );
});

SearchForm.displayName = 'SearchForm';
export default SearchForm;