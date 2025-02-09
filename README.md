** 프로젝트명

    WHELPER = WRITE HELPER

    책을 읽고 좋은 구절을 메모하는 습관이 있는데, 그 양이 방대해지다 보니 찾는데 어려움을 겪게 되어서 만든 기능.
    특정 범주 내지 String 을 filter 한 기능이 주여야 했는데, 글쓰기 에디터 때문에 배보다 배꼽이 커진 격...


** 명령어 모음

    npm install @reduxjs/toolkit                    :: Redux 상태 관리
    npm install @tanstack/react-query               :: 서버 상태 관리 및 데이터 패칭
    npm install axios                               :: HTTP 요청을 보내고 데이터를 처리
    npm install date-fns                            :: 날짜 및 시간 조작을 간단하게 처리할 수 있는 라이브러리.
    npm install history                             :: 브라우저 기록 관리 라이브러리.
    npm install immer                               :: 불변성을 유지하며 업데이트 도와주는 라이브러리.
    npm install ipaddr.js                           :: IP 주소의 파싱 및 조작을 위한 라이브러리
    
    npm install react-router-dom                    :: React에서 라우팅을 구현하기 위한 도구
    npm install react-toastify                      :: 알림 메시지(Toast)를 쉽게 추가
    npm install react-transition-group              :: 애니메이션 및 전환 효과
    npm install redux
    npm install redux-thunk                         :: Redux에서 비동기 작업 처리를 위한 미들웨어
    npm install slate slate-hyperscript slate-react :: 텍스트 편집기
    npm install web-vitals                          :: 웹 성능 측정을 위한 도구.
    npm install zustand                             :: React 상태 관리를 위한 라이브러리

    npm install --save-dev webpack                  :: webpack: JavaScript 애플리케이션을 번들링하는 도구
    npm install --save-dev webpack-cli              :: Webpack 명령줄 인터페이스(CLI) 도구
    npm install --save-dev webpack-dev-server       :: 개발 중 로컬 서버를 제공하는 도구

    npm install react-window                        :: 인피니티 무한 스크롤 적용.
    npm install react-infinite-scroll-component     :: 인피니티 무한 스크롤 적용.

    ( ** 파이썬의 경우 requirement.txt 참조 )

```
** 파일 구조
    │
    ├── back
    │   ├── db_config.py                # env 파일에서 변수를 받아와 config 구성.
    │   ├── db_connector.py             # DB 와 서버를 연결시키는 코드.
    │   ├── db_operator.py              # sqlalchemy 를 활용한 mysql DB 내에 table 생성.
    │   ├── send_email.py               # 구글에서 제공하는 이메일 보내는 기능을 활용해 인증버호 확인 기능 추가 
    │   └── route.py                    # 각종 api 모음.
    │
    ├── src
    │   ├── components
    │   │   ├── hook
    │   │   │   ├── cateSaveBtn.js      # 카테고리 저장 공통 (Write, WriteCorrect, Category)
    │   │   │   ├── cookie.js           # 로그인 관련 쿠키 처리
    │   │   │   ├── customEditor.js     # Slate 라이브러리 에디터 커스텀
    │   │   │   ├── deserialize.js      # Slate 라이브러리 역직렬화 코드
    │   │   │   ├── LinkCheck.js        # 링크 기능을 공유하는 컴포넌트 별로 상이한 로직 적용
    │   │   │   ├── LinksWith.js        # Slate editor Link 줄바꿈 적용
    │   │   │   ├── serialize.js        # Slate 라이브러리 직렬화 코드
    │   │   │   ├── useAnno.js          # 주석 기능 공통 코드
    │   │   │   ├── useScrollAnima.js   # scroll animation 공통 코드
    │   │   │   ├── useSlateRender.js   # Slate 라이브러리 렌더링 관련 공통 코드
    │   │   │   └── writeNavi.js        # 로그인 검증 함수
    │   │   │ 
    │   │   ├── function
    │   │   │   └── Anno.js             # 우측 주석 페이지
    │   │   │   └── Gotop.js            # 페이지 맨 위로 이동시키는 공통 기능
    │   │   │   └── LinkList.js         # 우측 사이드 링크 리스트 정렬
    │   │   │   └── Lock.js             # 글 잠금 기능
    │   │   │   └── MemoInWrite.js      # Write 컴포넌트 내부에서 memo 불러오기
    │   │   │   └── Modal.js            # Write Modal 공통
    │   │   │ 
    │   │   ├── AnnoLink.js             # 주석 모음 페이지
    │   │   ├── Category.js             # 카테고리에 따른 분류
    │   │   ├── Correct.js              # 글 수정 페이지
    │   │   ├── Date.js                 # 날짜별 정리 페이지
    │   │   ├── Home.js                 # Home
    │   │   ├── LinkPopup.js            # 링크 팝업 컴포넌트
    │   │   ├── Login.js                # 로그인 컴포넌트 ( 로그인 및 아이디 생성 )
    │   │   ├── Memo.js                 # 메모 컴포넌트
    │   │   ├── Search.js               # 글목록 검색
    │   │   ├── Side.js                 # 우측 검색 사이드 창
    │   │   ├── ViewEdit.js             # Slate View 공통 페이지
    │   │   ├── Write.js                # 글작성 페이지
    │   │   ├── WriteCorrect.js         # 글수정 페이지
    │   │   ├── WriteList.js            # 글목록 페이지
    │   │   └── WriteView.js            # 글 상세보기 페이지
    │   │
    │   ├── css
    │   │   ├── fontello                # [폰텔로 아이콘 ](https://fontello.com/)
    │   │   ├── admin.css               # 관리자 관련 스타일시트
    │   │   ├── base.css                # 웹 스타일 초기화 파일
    │   │   ├── components.css          # 컴포넌트 공통 css
    │   │   └── style.css               # 스타일시트
    │   │
    │   ├── data
    │   │   ├── api.js                  # api 엔드포인트
    │   │   ├── reducers.js             # Redux
    │   │   └── token_check.js          # Login 컴포넌트 관련 토큰 체크
    │   │
    │   ├── font                        # 폰트
    │   ├── App.js                      # 루트 컴포넌트
    │   ├── context.js                  # context api 라이브러리 
    │   ├── index.js                    # index
    │   └── Routes.js                   # 라우팅 모음
    │   └── store.js                    # zustand
    │
    └── requirements.txt                # 파이썬 라이브러리 설치 파일
```

** 문의 및 지원

    arbam486@naver.com