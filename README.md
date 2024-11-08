** 프로젝트명

    WHELPER = WRITE HELPER

    책을 읽고 좋은 구절을 메모하는 습관이 있는데, 그 양이 방대해지다 보니 찾는데 어려움을 겪게 되어서 만든 기능.
    특정 범주 내지 String 을 filter 한 기능이 주여야 했는데, 글쓰기 에디터 때문에 배보다 배꼽이 커진 격...


** 사용 방법 (Usage)
    
    - 글쓰기의 경우 "Slate.js" 라이브러리를 활용.
    - Write.js 컴포넌트로 들어가서 Content 영역에서 마우스 우클릭 시 내용을 꾸밀 수 있는 기능이 존재.
      ( Slate.js 라이브러리를 사용한 이유 )
    - 로그인을 해야 CRUD 이용이 가능하며, "Delete" 는 권한이 있어야 가능하도록 변경.


** 파일 구조
    │
    ├── back
    │   ├── db_config.py                # env 파일에서 변수를 받아와 config 구성.
    │   ├── db_connector.py             # DB 와 서버를 연결시키는 코드.
    │   ├── db_operator.py              # sqlalchemy 를 활용한 mysql DB 내에 table 생성.
    │   ├── send_email.py               # 구글에서 제공하는 이메일 보내는 기능을 활용해 인증버호 확인 기능 추가 
    │   └── route.py                    # 각종 api 모음.
    ├── src
    │   ├── components
    │   │   ├── hook
    │   │   │   ├── deserialize.js      # Slate 라이브러리 역직렬화 코드
    │   │   │   ├── serialize.js        # Slate 라이브러리 직렬화 코드
    │   │   │   ├── useAnno.js          # 주석 기능 공통 코드
    │   │   │   ├── useScrollAnima.js   # scroll animation 공통 코드
    │   │   │   └── useSlateRender.js   # Slate 라이브러리 렌더링 관련 공통 코드
    │   │   ├── Anno.js                 # 우측 주석 페이지
    │   │   ├── AnnoLink.js             # 주석 모음 페이지
    │   │   ├── Category.js             # 카테고리에 따른 분류
    │   │   ├── Correct.js              # 글 수정 페이지
    │   │   ├── Date.js                 # 날짜별 정리 페이지
    │   │   ├── Home.js                 # Home
    │   │   ├── Login.js                # 로그인 컴포넌트 ( 로그인 및 아이디 생성 )
    │   │   ├── Memo.js                 # 메모 컴포넌트
    │   │   ├── Side.js                 # 우측 검색 사이드 창
    │   │   ├── SlateView.js            # Slate View 공통 페이지
    │   │   ├── Work.js                 # 퍼블리싱 작업물 모음 (임시)
    │   │   ├── Write.js                # 글작성 페이지
    │   │   ├── WriteCorrect.js         # 글수정 페이지
    │   │   ├── WriteList.js            # 글목록 페이지
    │   │   └── WriteView.js            # 글 상세보기 페이지
    │   ├── css
    │   │   ├── fontello                # [폰텔로 아이콘 ](https://fontello.com/)
    │   │   ├── base.css                # 웹 스타일 초기화 파일
    │   │   ├── components.css          # 컴포넌트 공통 css
    │   │   ├── style.css               # 스타일시트
    │   │   └── work.css                # Work 컴포넌트 스타일
    │   ├── data
    │   │   ├── api.js                  # api 엔드포인트
    │   │   ├── reducers.js             # Redux
    │   │   └── token_check.js          # Login 컴포넌트 관련 토큰 체크
    │   ├── font                        # 폰트
    │   ├── img                         # Work 컴포넌트 관련 이미지 모음 
    │   ├── App.js                      # 루트 컴포넌트
    │   ├── context.js                  # context api 라이브러리 
    │   ├── index.js                    # index
    │   └── Routes.js                   # 라우팅 모음
    └── requirements.txt                # 파이썬 라이브러리 설치 파일


** 문의 및 지원

    arbam486@naver.com