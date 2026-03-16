# Web Study Guide
단국대학교 UMC 10th Web_A팀 스터디 진행 가이드입니다.

---

## 📁 1. 스터디 폴더 구조

아래 4명의 개인 폴더를 사용합니다.

- stringnine
- BigSangHyeok
- zio0225
- ekals16

각 개인 폴더 안에는 주차 폴더가 동일하게 있습니다.

- week01
- week02
- week03
- week04
- week05
- week06
- week07
- week08
- week09
- week10

각 week 폴더에는 기본으로 .gitkeep 파일이 들어 있으며, 해당 주차의 과제 코드는 본인 폴더의 해당 week 안에 추가하면 됩니다.
- .gitkeep 파일 삭제 금지
- 빈 폴더를 관리하기 위한 파일

예시

- stringnine/week03
- zio0225/week05
- ekals16/week01
- BigSangHyeok/week10

---

## 🔄 2. 주차별 진행 흐름

한 주차 진행은 아래 순서로 맞춰서 진행합니다.

1. 이슈 생성
2. 브랜치 생성
3. 본인 주차 폴더에서 구현
4. 커밋 및 푸시
5. PR 생성
6. 리뷰 반영 후 머지

---

## 📝 3. 이슈 작성 방법

이슈 생성 시 Workbook / Mission 템플릿을 사용합니다.

템플릿 위치

- .github/ISSUE_TEMPLATE/workbook.md

이슈 제목 형식

- [Week n] 닉네임 워크북 미션

이슈 본문에서는 아래를 체크합니다.

- Week 정보
- 워크북 진행 내용
- 미션 요구사항 분석/구현/정리
- 참고 자료

---

## 🌿 4. 브랜치 규칙

추천 브랜치 이름 형식

- mission/week01-닉네임
- practice/week02-닉네임

예시

- mission/week03-ekals16
- practice/week05-zio0225

브랜치 생성 방법 (예시)

```bash
# main 최신화
git checkout main
git pull origin main

# 미션 브랜치 생성 후 이동
git checkout -b mission/week03-ekals16

# 또는 실습 브랜치 생성 후 이동
git checkout -b practice/week03-ekals16
```

---

## 💻 5. 코드 작업 위치

본인 폴더의 해당 주차 폴더에서만 작업합니다.

예시

- ekals16/week04
- zio0225/week04

공통 규칙

- 다른 스터디원 폴더는 수정하지 않습니다.
- 불필요한 파일은 올리지 않습니다.
- 주차별 결과물이 구분되도록 폴더를 유지합니다.

---

## 🔀 6. PR 작성 방법

PR 생성 시 템플릿을 사용합니다.

템플릿 위치

- .github/pull_request_template.md

PR에 반드시 포함할 내용

- 관련 이슈 번호 연결: close #이슈번호
- 작업 내용 요약
- 미션 결과 스크린샷
- 체크리스트 점검
- 리뷰 포인트 작성

---

## ✅ 7. 커밋 메시지 예시

아래처럼 주차와 작업 내용을 드러내는 메시지를 권장합니다.

- mission: week03 로그인 API 구현

커밋 메시지 작성 및 푸시 방법 (예시)

```bash
# 변경 파일 확인
git status

# 전체 추가
git add .

# 커밋
git commit -m "mission: week03 로그인 API 구현"

# 원격 브랜치로 푸시
git push -u origin mission/week03-ekals16
```

추가 커밋 메시지 예시

```text
mission: week04 회원가입 API 구현
practice: week04 JPA 연관관계 실습
mission: week05 예외 처리 리팩터링
```

---

## 👀 8. 리뷰 및 머지 기준

- PR 체크리스트가 모두 확인되어야 합니다.
- 최소 1회 이상 리뷰 반영 후 머지합니다.
- 머지 전 본인 코드가 본인 주차 폴더에만 반영되었는지 확인합니다.

---

## 🚀 9. 빠른 시작 체크리스트

1. 이슈 템플릿으로 Week 이슈 생성
2. 브랜치 생성
3. 본인 폴더의 해당 weekXX에서 구현
4. 커밋 후 원격 푸시
5. PR 템플릿에 맞춰 PR 작성
6. 리뷰 반영 후 머지
