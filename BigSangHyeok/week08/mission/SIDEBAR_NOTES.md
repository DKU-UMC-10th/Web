# Sidebar Notes

- 검색 방식: `prevent background scroll when sidebar open css overflow hidden` 키워드로 확인했습니다.
- 배경 스크롤 방지: 사이드바가 열린 동안 `document.body.style.overflow = "hidden"`을 적용하고, 닫히거나 언마운트되면 이전 값으로 복구했습니다.
- 애니메이션: Tailwind CSS의 `transition-transform`, `duration-300`, `ease-in-out` 유틸리티로 사이드바 슬라이드 효과를 적용했습니다.
