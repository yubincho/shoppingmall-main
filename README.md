
# Simple 쇼핑몰


### 사용 기술
* Nest.js, TypeScript, Rest-API / PostgreSQL, TypeORM, Redis / JWT, 결제(PortOne & Transaction 적용)
* ( 구현 예정 기술 :  AWS, S3, EC2, Docker, Socket.io )

#

### 기능
* 사용자 회원가입과 로그인 계층별 구현
  - (일반 이메일과 패스워드) 가입 및 로그인 / Oauth(구글, 카카오톡, 네이버)를 통한 회원가입 및 로그인
* (일반 이메일과 패스워드)가입시 이메일 인증번호 발송 - 인증번호 저장은 redis 이용 
* 결제 시스템
  - 유저(member) - 주문(order) - 상품(product) : 일대다/다대일 관계
  - 결제시 데이터 손실 막기 위해 transaction 추가 , 결제 서비스는 포트원 사용(portone)
* 카테고리 구현 - 상위 카테고리(brand) > 하위(product)
* DB - PostgreSQL
* 상품의 댓글(리뷰) - comment (구현 예정)
* 이미지 업로드 - S3 (구현 예정)
* 채팅 - Socket.io (구현 예정)
  
#

### ERD (지금까지 구현된 것까지. 추가 구현 예정)
![image](https://github.com/yubincho/shoppingmall-main/assets/58660769/7c944ed2-be45-4dfb-817e-2626256e73ad)

#

### API DOCS
Swagger Docs

# 

블로그입니다. 
https://www.notion.so/95c317dabf6e490d8db4d0d4f4caf0bd
