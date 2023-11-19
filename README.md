
# Simple 쇼핑몰


### 사용 기술
* Nest.js, TypeScript, Rest-API / PostgreSQL, TypeORM, Redis / JWT, 결제(PortOne 서비스 사용) /
* Socket.io, AWS S3, AWS EC2, Docker

#

### 사용 tools
* Webstorm IDE, DataGrip, RedisInsight, Postman, GitKraken

#

### 기능
* 사용자 회원가입과 로그인 
  - (일반 이메일과 패스워드) 가입 및 로그인 / Oauth(구글, 카카오톡, 네이버)를 통한 회원가입 
  - (일반 이메일과 패스워드) 가입시 이메일 본인확인 인증번호 발송 - 인증번호 저장은 Redis 이용
  - RBAC(Role Based Access Control)에 따른 사용자 계층별 접속 가능 API 구현 => 일반 유저, 어드민(관리자) 등
* 결제 시스템
  - 유저(member) - 주문(order) - 상품(product) => 일대다/다대일 관계
  - 주문(order) : 중간테이블을 Entity로 만듦.
  - 결제 & 취소시 데이터 정합성 위해 Transaction 추가 , 결제 서비스는 포트원 사용(PortOne)
* 카테고리 구현
  - 상위 카테고리(brand) > 하위(product) / 상위 카테고리(product) > 하위(comment)
* DB - PostgreSQL
* 상품의 댓글(리뷰) - comments
* 파일(이미지) 업로드 - S3 
* 채팅 - Socket.io
  - chats(채팅방) ㅡ message(채팅 메시지) => 일대다/다대일
  - 유저 - chats => 다대다 / 중간테이블: member_chats_chats
* 기타
  - (예외처리) filter, (transaction) interceptor, (log) middleware
  
#

### ERD 
![image](https://github.com/yubincho/shoppingmall-main/assets/58660769/81a9b522-6f0f-4944-853b-27beb299909b)


#

### 프로젝트 설정 순서
: https://www.notion.so/95c317dabf6e490d8db4d0d4f4caf0bd


#

### API DOCS
Postman Docs
-> https://documenter.getpostman.com/view/11038161/2s9YXk2g79
(코드 가독성을 위해 Swagger Docs를 사용하지 않음)

# 


### 결제 흐름 
![image](https://github.com/yubincho/shoppingmall-main/assets/58660769/9cb6e524-5c1e-4257-a341-0e704c34d81b)


포트원 등록 방법
: https://www.notion.so/37a4e1afc9534ef394e6b1bf069ddf0e

#

### 도커 & AWS EC2 배포 과정
https://www.notion.so/study-054cb5ef6ffc4849b686ffd1d9da2792

# 


### 블로그입니다. 
https://www.notion.so/95c317dabf6e490d8db4d0d4f4caf0bd
