// 정적페이지 연결
// EJS 패키지 설치 (npm install ejs), app.js에서 템플릿엔진 사용
// 페이지 일부 포함 (include)
// 동적라우터 (Dynamic Routes, Error Handling, Patterns)
// 고유 ID 생성 (uuid)
// JSON 세부 데이터 로드 (ID별)
// 404 에러 페이지 생성 (세부데이터 없을시, 잘못된경로)
// 500 에러 페이지 생성 (서버사이드 에러, json파일경로에러(이름오기재) 등)

const fs = require("fs");
const path = require("path");
const express = require("express");
const uuid = require("uuid"); // 동적라우터 고유ID 생성 패키지

const app = express();

// EJS 패키지 설정 및 사용 (템플릿기능 views폴더의 .html ->.ejs)
app.set("views", path.join(__dirname, "views")); // 찾을 위치
app.set("view engine", "ejs"); // 사용할 엔진

// public 정적페이지 연결
// 정적페이지 폴더 만들어서 스타일 적용하기 (CSS, JavaScript, image)
app.use(express.static("public"));

// express req 구문분석 미들웨어
app.use(express.urlencoded({ extended: false }));

// EJS 패키지 설치 후 get사용 (path 생성 필요 없음, app.set으로 대체)
app.get("/", function (req, res) {
  res.render("index");
});

// EJS 패키지 설치 전 get사용
// app.get("/", function (req, res) {
//   //path 생성
//   const htmlFilePath = path.join(__dirname, "views", "index.html");
//   //sendfile 메서드사용
//   res.sendFile(htmlFilePath);
// });

// 실제 등록된 레스토랑을 list로 출력하기 (length로 사용)
app.get("/restaurants", function (req, res) {
  const filePath = path.join(__dirname, "data", "restaurants.json"); // 경로생성 required('path')
  const fileData = fs.readFileSync(filePath); // 파일 읽기, required('fs')
  const storedRestaurants = JSON.parse(fileData); // 읽은 데이터 자바로 변환

  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length, // ejs파일의 <%= numberOfRestaurants %>
    restaurants: storedRestaurants,
  });
});

// 동적 라우터 설정(/:id) & 세부데이터 로드
app.get("/restaurants/:id", function (req, res) {
  const restaurantId = req.params.id;

  // 세부데이터 로드, 에러페이지(404) 표시
  // 1) 데이터파일읽기
  const filePath = path.join(__dirname, "data", "restaurants.json"); // 경로생성 required('path')
  const fileData = fs.readFileSync(filePath); // 파일 읽기, required('fs')
  const storedRestaurants = JSON.parse(fileData); // 읽은 데이터 자바로 변환

  // 해당 레스토랑의 id가 일치, 세부데이터 로드
  for (const restaurant of storedRestaurants) {
    if (restaurant.id === restaurantId) {
      // return 실행된 위치로 값반환 후 전체 함수 종료(실행 완료).
      // {key:value} value는 const restaurant로 if문 조건에 맞게 생성된 객체임
      return res.render("restaurant-detail", { restaurant: restaurant });
    }
    // else {}
    // 세부 데이터 없을 시, else로 에러 표현 못함, for문밖에서 가능
  }

  //404.ejs 생성 후 표기.
  res.status(404).render("404");
});

app.get("/recommend", function (req, res) {
  res.render("recommend");
});

// 레스토랑 데이터 쓰기
// POST 메서드, 사용자입력값 저장, 동적라우터 고유 ID 생성(uuid)
// 1) path (경로생성)
// 2) readfilesync (파일읽기)
// 3) JSON.parse (읽은 데이터 자바로 변환)
// 4) push (변환된 데이터 안으로 req.body push)
// 5) writeFileSync(filePath, JSON.stringify()) (제이슨으로 데이터 변환 후 쓰기)
app.post("/recommend", function (req, res) {
  // 폼 사용자 입력값(req.body)를 통째로 먼저 저장
  // 구문분석 미들웨어 필요 app.use(express.urlencoded({extended: false}))
  const restaurant = req.body; 

  // 동적라우터 고유 id만들기 (required('uuid))
  // 존재하지 않는 id property(속성)에 접근 및 property(속성) 생성 (JavaScript 지원 기능)
  restaurant.id = uuid.v4();

  // 6) res.redirect (폼 제출 후 페이지 이동)
  const filePath = path.join(__dirname, "data", "restaurants.json"); // 경로생성 required('path')
  const fileData = fs.readFileSync(filePath); // 파일 읽기, required('fs')
  const storedRestaurants = JSON.parse(fileData); // 읽은 데이터 자바로 변환
  storedRestaurants.push(restaurant); // 변환한 자바데이터로 push
  fs.writeFileSync(filePath, JSON.stringify(storedRestaurants)); // push포함 제이슨으로 변환

  res.redirect("/confirm");
});

app.get("/confirm", function (req, res) {
  res.render("confirm");
});

app.get("/about", function (req, res) {
  res.render("about");
});

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
