// 정적페이지 연결
// EJS 패키지 설치 (npm install ejs), app.js에서 템플릿엔진 사용
// 페이지 일부 포함 (include)

const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();

// ejs 패키지 사용 (템플릿기능 .html ->.ejs)
app.set("views", path.join(__dirname, "views")); // 찾을 위치
app.set("view engine", "ejs"); // 사용할 엔진

// public 정적폴더 만들어서 스타일 적용하기 (CSS, JavaScript, image)
app.use(express.static("public"));

// express req 구문분석 미들웨어
app.use(express.urlencoded({ extended: false }));

// EJS 패키지 설치 후 get사용
// path 생성 필요 없음, app.set으로 대체
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

// 실제 등록된 레스토랑 수 출력하기 (length로 사용)
app.get("/restaurants", function (req, res) {
  const filePath = path.join(__dirname, "data", "restaurants.json"); // 경로생성 required('path')
  const fileData = fs.readFileSync(filePath); // 파일 읽기, required('fs')
  const storedRestaurants = JSON.parse(fileData); // 읽은 데이터 자바로 변환

  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,  // ejs파일의 <%= numberOfRestaurants %>
    restaurants: storedRestaurants,
  });
});

app.get("/recommend", function (req, res) {
  res.render("recommend");
});

// POST 메서드
// 구문분석 미들웨어 필요 app.use(express.urlencoded({extended: false}))
app.post("/recommend", function (req, res) {
  // 폼 사용자 입력값(req.body)를 통쨰로 먼저 저장
  const restaurant = req.body;
  // 레스토랑 데이터 쓰기
  // 1) path (경로생성)
  // 2) readfilesync (파일읽기)
  // 3) JSON.parse (읽은 데이터 자바로 변환)
  // 4) push (변환된 데이터 안으로 req.body push)
  // 5) writeFileSync(filePath, JSON.stringify()) (제이슨으로 데이터 변환 후 쓰기)
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

app.listen(3000);
