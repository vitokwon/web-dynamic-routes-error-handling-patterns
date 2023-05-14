// 정적페이지 연결
// EJS 패키지 설치 (npm install ejs), app.js에서 템플릿엔진 사용
// 페이지 일부 포함 (include)
// 동적라우터 (Dynamic Routes, Error Handling, Patterns)
// 고유 ID 생성 (uuid)
// JSON 세부 데이터 로드 (ID별)
// 404 에러 페이지 생성 (세부데이터 없을시, 잘못된경로)
// 500 에러 페이지 생성 (서버사이드 에러, json파일경로에러(이름오기재) 등)
// 코드 리팩토링 (중복된 데이터가져오기 코드를 utill에서 새 함수 생성)
// 라우터 분할 (익스프레스 라우터)
// 쿼리 매개변수 (list 오름차순, 내림차순 정렬 버튼 만들기 (restaurants.js))

// 내장 패키지
// const fs = require("fs"); // 라우터 분할로 더 이상 사용안해서 삭제
const path = require("path");

// 타사패키지
const express = require("express");
// // 라우터분할로 restaurant.js로 이동
// const uuid = require("uuid"); // 동적라우터 고유ID 생성 패키지

// 내가 만든 파일 가져오기 (코드 리팩토링)
// 라우터분할로 restaurants.js로 이동
// const resData = require("./util/restaurant-data"); // 전체 경로로 작성해야 함

// 라우터 분할
const defaultRoutes = require("./routes/default");
const restaurantRoutes = require("./routes/restaurants");

const app = express();

// EJS 패키지 설정 및 사용 (템플릿기능 views폴더의 .html ->.ejs)
app.set("views", path.join(__dirname, "views")); // 찾을 위치
app.set("view engine", "ejs"); // 사용할 엔진

// 미들웨어 설정
// public 정적페이지 연결, 폴더 생성, 스타일 적용하기 (CSS, JavaScript, image)
app.use(express.static("public"));

// express req 구문분석 미들웨어
app.use(express.urlencoded({ extended: false }));

// 라우터 분할 미들웨어
app.use("/", defaultRoutes); // 모든 경로('/')에 대해 defaultRoutes로 연결시킴
// app.use("/restaurants", restaurantRoutes); // 경로 앞에 '/restaurants'가 추가 됨
app.use("/", restaurantRoutes);


// EJS 패키지 설치 후 get사용 (path 생성 필요 없음, app.set으로 대체)
// // 라우터 분할로 default.js로 이동
// app.get("/", function (req, res) {
//   res.render("index");
// });

// EJS 패키지 설치 전 get사용
// app.get("/", function (req, res) {
//   //path 생성
//   const htmlFilePath = path.join(__dirname, "views", "index.html");
//   //sendfile 메서드사용
//   res.sendFile(htmlFilePath);
// });

// // 코드 리팩토링
// // 라우터 분할로 restaurants.js로 이동
// // 실제 등록된 레스토랑을 list로 출력하기 (length로 사용)
// app.get("/restaurants", function (req, res) {
//   // // 코드 리팩토링
//   // const filePath = path.join(__dirname, "data", "restaurants.json"); // 경로생성 required('path')
//   // const fileData = fs.readFileSync(filePath); // 파일 읽기, required('fs')
//   // const storedRestaurants = JSON.parse(fileData); // 읽은 데이터 자바로 변환

//   const storedRestaurants = resData.getStoredRestaurants();

//   res.render("restaurants", {
//     numberOfRestaurants: storedRestaurants.length, // ejs파일의 <%= numberOfRestaurants %>
//     restaurants: storedRestaurants,
//   });
// });

// // 동적 라우터 설정(/:id) & 세부데이터 로드
// // 코드 리팩토링
// app.get("/restaurants/:id", function (req, res) {
//   const restaurantId = req.params.id;

//   // // 코드 리팩토링
//   // // 세부데이터 로드, 에러페이지(404) 표시
//   // // 1) 데이터파일읽기
//   // const filePath = path.join(__dirname, "data", "restaurants.json"); // 경로생성 required('path')
//   // const fileData = fs.readFileSync(filePath); // 파일 읽기, required('fs')
//   // const storedRestaurants = JSON.parse(fileData); // 읽은 데이터 자바로 변환

//   const storedRestaurants = resData.getStoredRestaurants();

//   // 해당 레스토랑의 id가 일치, 세부데이터 로드
//   for (const restaurant of storedRestaurants) {
//     if (restaurant.id === restaurantId) {
//       // return 실행된 위치로 값반환 후 전체 함수 종료(실행 완료).
//       // {key:value} value는 const restaurant로 if문 조건에 맞게 생성된 객체임
//       return res.render("restaurant-detail", { restaurant: restaurant });
//     }
//     // else {}
//     // 세부 데이터 없을 시, else로 에러 표현 못함, for문밖에서 가능
//   }

//   //404.ejs 생성 후 표기.
//   res.status(404).render("404");
// });

// app.get("/recommend", function (req, res) {
//   res.render("recommend");
// });

// // 레스토랑 데이터 쓰기
// // POST 메서드, 사용자입력값 저장, 동적라우터 고유 ID 생성(uuid)
// // 1) path (경로생성)
// // 2) readfilesync (파일읽기)
// // 3) JSON.parse (읽은 데이터 자바로 변환)
// // 4) push (변환된 데이터 안으로 req.body push)
// // 5) writeFileSync(filePath, JSON.stringify()) (제이슨으로 데이터 변환 후 쓰기)
// // 6) 코드리팩토링 (일부 중복 코드를 utill로 빼내서 재사용)
// app.post("/recommend", function (req, res) {
//   // 폼 사용자 입력값(req.body)를 통째로 먼저 저장
//   // 구문분석 미들웨어 필요 app.use(express.urlencoded({extended: false}))
//   const restaurant = req.body;

//   // 동적라우터 고유 id만들기 (required('uuid))
//   // 존재하지 않는 id property(속성)에 접근 및 property(속성) 생성 (JavaScript 지원 기능)
//   restaurant.id = uuid.v4();

//   // // 중복되는 기능이므로, utill로 빼서 사용
//   // // 6) res.redirect (폼 제출 후 페이지 이동)
//   // const filePath = path.join(__dirname, "data", "restaurants.json"); // 경로생성 required('path')
//   // const fileData = fs.readFileSync(filePath); // 파일 읽기, required('fs')
//   // const storedRestaurants = JSON.parse(fileData); // 읽은 데이터 자바로 변환
//   // utill로 빼서 아래 문장으로 대체
//   const restaurants = resData.getStoredRestaurants(); // 데이터 읽기 함수

//   restaurants.push(restaurant); // 변환한 자바데이터로 push

//   // const filePath가 빠졌으므로 아래 문장은 작동 못하므로, utill로 같이 뺌.
//   // fs.writeFileSync(filePath, JSON.stringify(storedRestaurants)); // push포함 제이슨으로 변환
//   // utill로 뺴서 아래로 문장으로 대체
//   resData.storeRestaurants(restaurants); // 데이터 저장 함수

//   res.redirect("/confirm");
// });

// app.get("/confirm", function (req, res) {
//   res.render("confirm");
// });

// // 라우터 분할로 default.js로 이동
// app.get("/about", function (req, res) {
//   res.render("about");
// });


// 핸들링 에러 (클라이언트,서버)
// 잘못된 경로 요청 시, 404 페이지 표시
// 커스텀 미들웨어 사용 (특정 요청에 대한 특정 함수 실행)
// app.use('/root', function{})
// root를 지정하지 않으면 들어오는 모든 요청에 대한 함수 실행
// 위의 다른 경로에서 처리되지 않은 모든 경로에 대한 요청
app.use(function (req, res) {
  // res.render("404");
  res.status(404).render("404"); // 실제 네트워크 status 변경해줘야 함.
});

// 경로 중 하나에서 에러가 발생했을 때, 500 페이지 표시
// 커스텀 미들웨어 사용 (express 시나리오가 있음)
// 4개 매개변수를 수신해야함
// error 매개변수는 exrpess 라이버리로 자동으로 채워짐
app.use(function (error, req, res, next) {
  // res.render('500');
  res.status(500).render("500"); // 실제 네트워크 status 변경해줘야 함.
});

app.listen(3000);
