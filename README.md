# 15분 만에 동시편집 에디터 구현하기

**15분 만에 동시편집 에디터 구현하기**

새벽의 코더 님의 "15분 만에 동시편집 에디터 구현하기" 내용을 보고 따라 만들었습니다.

[https://www.youtube.com/watch?v=BCfXRlaQSQc](https://www.youtube.com/watch?v=BCfXRlaQSQc)


먼저 yorkie-js-sdk에 있는 docker-compose를 docker-compose up —build -d 로 실행시킨다.

이를 통해 yorkie 서버가 띄어지고, rpc 처리를 위해 evoy가 함께 컨테이너로 실행된다.

![스크린샷 2022-04-27 오후 6.20.17.png](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/7888adc4-dfb1-42fd-b44e-8d01926b926c/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2022-04-27_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_6.20.17.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220501T143910Z&X-Amz-Expires=86400&X-Amz-Signature=e9bced3a6855875fb7fc76b80451893eb037ae01dd25676a6c4569014b2016c2&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA%25202022-04-27%2520%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE%25206.20.17.png%22&x-id=GetObject)

npm install && npm run build로 라이브러리를 다운 받고,  js sdk의 스크립트를 빌드시킨다.

html 파일에 <script src="./yorkie-js-sdk/dist/yorkie-js-sdk.js"></script>를 통해 sdk 파일을 넣어준다.

이제 yorkie를 사용하여 client 단의 코드를 작성한다.

(참고 : codemirror는 코드 형태로 textarea를 사용할 수 있도록 만든 오픈소스이다)

정상작동 된다!