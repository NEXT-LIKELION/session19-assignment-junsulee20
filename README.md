# Next.js 게시판 프로젝트

## 📝 프로젝트 개요

Next.js 15와 Tailwind CSS를 사용하여 구현한 게시판 애플리케이션입니다. 포스트 작성, 수정, 삭제 기능과 댓글 시스템을 포함하고 있습니다.

## 🚀 주요 기능

### 게시글 기능
- ✅ 게시글 목록 조회
- ✅ 게시글 작성
- ✅ 게시글 상세 조회
- ✅ 게시글 수정
- ✅ 게시글 삭제

### 댓글 기능
- ✅ 댓글 작성
- ✅ 댓글 목록 조회
- ✅ 댓글 삭제
- ✅ 랜덤 닉네임 생성

### UI/UX
- ✅ Tailwind CSS를 활용한 반응형 디자인
- ✅ 로딩 상태 표시
- ✅ 에러 처리
- ✅ 사용자 친화적인 인터페이스

## 🏗️ 기술 스택

- **Frontend**: Next.js 15, React 19
- **Styling**: Tailwind CSS
- **API**: Next.js API Routes
- **Data Storage**: 메모리 기반 (개발용)

## 📊 CSR vs SSR 분석

### 1. 메인 페이지 (`/`) - **SSR 사용**

**선택 이유:**
- **SEO 최적화**: 검색 엔진이 게시글 목록을 크롤링할 수 있음
- **초기 로딩 성능**: 서버에서 데이터를 미리 가져와 빠른 첫 화면 렌더링
- **사용자 경험**: 페이지 접근 시 즉시 콘텐츠 확인 가능

**구현 방식:**
```javascript
export default async function HomePage() {
  const res = await fetch("http://localhost:3000/api/posts", { cache: "no-store" });
  const posts = await res.json();
  // ...
}
```

### 2. 글 작성 페이지 (`/post/write`) - **CSR 사용**

**선택 이유:**
- **상호작용성**: 실시간 폼 검증 및 상태 관리 필요
- **사용자 입력 처리**: 타이핑, 폼 제출 등 동적 기능
- **SEO 불필요**: 작성 페이지는 검색 엔진 노출 불필요

**구현 방식:**
```javascript
'use client';
export default function WritePage() {
  const [title, setTitle] = useState('');
  // 상태 관리 및 이벤트 핸들링
}
```

### 3. 게시글 상세 페이지 (`/post/[id]`) - **CSR 사용**

**선택 이유:**
- **복잡한 상호작용**: 수정/삭제, 댓글 작성/삭제 등 다양한 기능
- **실시간 업데이트**: 댓글 추가 시 즉시 화면 반영
- **상태 관리**: 수정 모드, 로딩 상태 등 복잡한 UI 상태

**구현 방식:**
```javascript
'use client';
export default function PostPage() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  // 복잡한 상태 관리 및 API 호출
}
```

### 4. API Routes - **서버사이드**

**선택 이유:**
- **데이터 보안**: 서버에서 데이터 처리 및 검증
- **비즈니스 로직**: 서버에서 안전한 데이터 조작
- **성능**: 클라이언트 부담 감소

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: Blue (bg-blue-500, hover:bg-blue-600)
- **Secondary**: Gray (bg-gray-50, text-gray-700)
- **Warning**: Yellow (bg-yellow-500)
- **Danger**: Red (bg-red-500)

### 컴포넌트 스타일
- **카드**: `rounded-lg shadow-md`
- **버튼**: `px-4 py-2 rounded-lg font-medium transition-colors`
- **입력 필드**: `border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500`

## 🚀 시작하기

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   └── posts/
│   │       ├── route.js                 # 게시글 목록/작성 API
│   │       └── [id]/
│   │           ├── route.js             # 개별 게시글 API
│   │           └── comments/
│   │               ├── route.js         # 댓글 목록/작성 API
│   │               └── [commentId]/
│   │                   └── route.js     # 개별 댓글 API
│   ├── post/
│   │   ├── write/
│   │   │   └── page.js                  # 글 작성 페이지 (CSR)
│   │   └── [id]/
│   │       └── page.js                  # 글 상세 페이지 (CSR)
│   ├── globals.css                      # Tailwind CSS 설정
│   ├── layout.js                        # 루트 레이아웃
│   └── page.js                          # 메인 페이지 (SSR)
├── tailwind.config.js                   # Tailwind 설정
└── postcss.config.js                    # PostCSS 설정
```

## 🔄 데이터 플로우

### 게시글 작성
1. 사용자가 `/post/write`에서 폼 작성
2. 클라이언트에서 `/api/posts`로 POST 요청
3. 서버에서 데이터 검증 및 저장
4. 성공 시 메인 페이지로 리다이렉트

### 댓글 시스템
1. 게시글 상세 페이지에서 댓글 폼 작성
2. `/api/posts/[id]/comments`로 POST 요청
3. 서버에서 댓글 데이터 저장
4. 클라이언트에서 댓글 목록 새로고침

## 🔧 개선 사항

### 현재 한계점
- 메모리 기반 데이터 저장 (서버 재시작 시 데이터 손실)
- 사용자 인증 시스템 부재
- 파일 업로드 기능 없음

### 향후 개선 계획
- 데이터베이스 연동 (PostgreSQL, MongoDB 등)
- 사용자 인증 및 권한 관리
- 이미지 업로드 기능
- 페이지네이션
- 검색 기능
- 실시간 알림

##    라이선스

MIT License
