# 동적 경로, 고유ID 생성, 세부데이터 로드, 에러 핸들링, 코드 리팩토링 등 (섹션20)

## 동적 경로 설정

1.  url에서 '/:'을 사용해서 식별자 설정

```html
<!-- 식별자 /:id 값 설정 'r1' -->
<a href="/restaurants/r1">View Restaurant</a>
```

```javascript
app.get("/restaurants/:id", function (req, res) {
  // URL id값 가져와서 저장.
  const restaurantId = req.params.id;
  // render에 추가 key:value값 전달
  res.render('restaurant-detail', {rid : restaurantId})
}
```

```html
<!-- 'restaurant-detail' 에서 식별자 랜더링 -->
<h1>TITLE OF THE RESTAURANT <%= rid %></h1>
```

## 각 데이터의 고유 ID 생성, 동적라우터 연결

- 'npm install uuid' : uuid 패키지 설치 (고유 ID 생성기)
- 'const uuid = require('uuid') : 설치한 패키지 추가
- 'restaurant.id' : 객체에 필드를 추가, 또는 접근 (JavaScript 지원 기능)
-

```javascript
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
```

```html
<li class="restaurant-item">
  <article>
    <h2><%= restaurant.name %></h2>
    <div class="restaurant-meta">
      <p><%= restaurant.cuisine %></p>
      <p><%= restaurant.address %></p>
    </div>
    <p><%= restaurant.description %></p>
    <div class="restaurant-actions">
      <!-- a태그에 'restaurant.id' 추가, 동적 라우터 생성 -->
      <a href="/restaurants/<%= restaurant.id %>">View Restaurant</a>
    </div>
  </article>
</li>
```

## 세부데이터 로드 (반복문과 조건문 사용) & 에러핸들링

1.  url/:id 값 저장
2.  for문 내 if문 사용하여 일치되는 값 반환
3.  'return'을 사용하여 조건 일치할 경우, 함수 완료(종료)시킴.
4.  'render('/root', key:value)'로 해당 세부데이터 전달

```JavaScript
app.get("/restaurants/:id", function (req, res) {
  // 1) url/:id 값 저장
  const restaurantId = req.params.id;

  // 2) 데이터 읽기
  const filePath = path.join(__dirname, "data", "restaurants.json"); // 경로생성 required('path')
  const fileData = fs.readFileSync(filePath); // 파일 읽기, required('fs')
  const storedRestaurants = JSON.parse(fileData); // 읽은 데이터 자바로 변환

  // 3) 반복문으로 각 데이터 읽기
  for (const restaurant of storedRestaurants) {
    // 4) 조건문으로 해당 레스토랑의 id가 일치 시, 그 값을 반환(return)
    if (restaurant.id === restaurantId) {
      // return 실행된 위치로 값반환 후 전체 함수 종료(실행 완료).
      // {key:value} value는 const restaurant로 if문 조건에 맞게 생성된 객체임
      return res.render("restaurant-detail", { restaurant: restaurant });
    }
    // else {}
    // ID가 일치하는 세부 데이터가 일부이기때문에
    // else로 에러 표현 못함, for문밖에서 가능
  }

  // for문 내 if문에 일치하는 조건이 없었다면
  // for문을 빠져나와서 아래 문장 실행. (에러핸들링)
  // stats(404)를 사용해서 실제 네트워크 상태는 404 에러로 설정
  res.status(404).render("404");
});
```

## 반복문 복습 (일반 for, for-of, for-in)

### for-in (객체를 개별 출력)

```JavaScript
const loggedInUser = {
  name: 'Max',
  age: 32,
  isAdmin: true
};

for (const propertyName in loggedInUser){ // propertyName = key
  console.log(propertyName); // name, age, isAdmin 출력됨.
  console.log(loggedInUser.name); // 여기에선 동작 안함
  console.log(loggedInUser['name']); // loggedInUser.name과 같은 동작함
  console.log(loggedInUser[propertyName]); // 순서대로 key, value 값을 하나씩 출력함 (동적 접근)
 }

```

### for-of (배열을 개별 출력)

```JavaScript
const users = ['MAx', 'Anna', 'Joel']
// console.log(users) -> ['MAx', 'Anna', 'Joel']

// 배열을 개별 요소로 출력하기
for (const user of users) {
  console.log(user);
}

// for-of문이 없었을 때
for (let 1 = 0; i < users.length; i++){
 console.log(users[i]);
}
```

### 일반 for (특정 횟수 반복)

```JavaScript
for (let i = 0; i < 10; i++) {
  console.log(i);
}
```

## 에러 핸들링, 상태 코드 작업 (네트워크에러)

- 200(성공), 404,401(클라이언트에러), 500(서버사이드에러)
- 보기 싫은 에러화면 대체
- 미들웨어 활용, 처리되지 않은 모든 요청에 대한 처리
- listen(3000) 바로 전(가장 아래)에 추가 해야 함, 위에서 아래로 처리되는 코드 고려
- 404.ejs 파일 생성

### 존재하지 않는 경로에 대한 미들웨어 (404 error)

```JavaScript
 app.use('/admin', function(){}) // 오직 /admin 요청만 처리
 app.use(function(req, res) { // 이전까지 처리되지 않은 요청들을 여기에서 처리.
   res.status(404).render('404');
 })
```

### 서버측 에러에 대한 미들웨어 (500 error)

- 파일명 변경으로 인한 경로 에러
- 데이터 속성명 에러 등
- 500.ejs 파일 생성
- express 고유 미들웨어, 4개 매개변수 필요

```JavaScript
  app.use(function(error, req, res, next){
    res.stats(500).render('500')
  })
```

## 코드 리팩토링 (중복되는 코드를 다른 파일의 함수로 관리)

- util폴더/restaurant-data.js 생성 후 중복된 코드 (데이터읽기,쓰기) 정리

```JavaScript
//*** util 폴더의 restaurant-data.js 코드

// 파일 내부의 필요한 패키지 재요청 필요함.
const path = require("path");
const fs = require("fs");

// filePath는 함수밖으로 꺼내서 다른함수들에도 사용
const filePath = path.join(__dirname, "..", "data", "restaurants.json");

// 파일 데이터 읽기 함수 생성 및 데이터 반환(return)
function getStoredRestaurants() {
  const fileData = fs.readFileSync(filePath); // 파일 읽기, required('fs')
  const storedRestaurants = JSON.parse(fileData); // 읽은 데이터 자바로 변환

  return storedRestaurants;
}

// 파일 데이터 쓰기 함수 생성
function storeRestaurants(storableRestaurants) {
  fs.writeFileSync(filePath, JSON.stringify(storableRestaurants)); // push포함 제이슨으로 변환
}

// **중요 다른 파일로 노출하려는 항목 설정 필요
module.exports = {
  getStoredRestaurants: getStoredRestaurants, // key:value
  // getStoredRestaurants: getStoredRestaurants(), // 함수뒤에 ()를 추가하면 호출 시, 결과가 노출됨
  storeRestaurants: storeRestaurants,
};
```

- app.js 내 코드리팩토링 파일 요청 추가 및 코드 정리

```JavaScript
//*** app.js 코드

// 내가 만든 파일 가져오기 (코드 리팩토링)
// 추천 레스토랑 등록 기능 리팩토링
const resData = require("./util/restaurant-data"); // 전체 경로로 작성해야 함

app.post("/recommend", function (req, res) {
  const restaurant = req.body;
  restaurant.id = uuid.v4();

  // // 중복되는 기능이므로, utill로 빼서 사용
  // // 6) res.redirect (폼 제출 후 페이지 이동)
  // const filePath = path.join(__dirname, "data", "restaurants.json"); // 경로생성 required('path')
  // const fileData = fs.readFileSync(filePath); // 파일 읽기, required('fs')
  // const storedRestaurants = JSON.parse(fileData); // 읽은 데이터 자바로 변환
  // const filePath가 빠졌으므로 아래 문장은 작동 못하므로, utill로 같이 뺌.
  // fs.writeFileSync(filePath, JSON.stringify(storedRestaurants)); // push포함 제이슨으로 변환
  // utill로 뺴서 아래로 문장으로 대체

  const restaurants = resData.getStoredRestaurants(); // 코드리팩토링 함수 호출
  restaurants.push(restaurant); // 변환한 자바데이터로 push
  resData.storeRestaurants(restaurants); // 코드리팩토링 함수 호출

  res.redirect("/confirm");
});

// 코드 리팩토링
// 등록된 레스토랑을 list로 출력 (length로 사용)
app.get("/restaurants", function (req, res) {
  // // 코드 리팩토링
  // const filePath = path.join(__dirname, "data", "restaurants.json"); // 경로생성 required('path')
  // const fileData = fs.readFileSync(filePath); // 파일 읽기, required('fs')
  // const storedRestaurants = JSON.parse(fileData); // 읽은 데이터 자바로 변환

  const storedRestaurants = resData.getStoredRestaurants(); // 코드리팩토링 함수 호출

  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length, // restaurants.ejs의 <= numberOfRestaurants >
    restaurants: storedRestaurants,
  });
});

// 코드 리팩토링
// 레스토랑 세부데이터 로드 &  동적 라우터 설정(/:id)
app.get("/restaurants/:id", function (req, res) {
  const restaurantId = req.params.id;

  // // 코드 리팩토링
  // // 세부데이터 로드, 에러페이지(404) 표시
  // // 1) 데이터파일읽기
  // const filePath = path.join(__dirname, "data", "restaurants.json"); // 경로생성 required('path')
  // const fileData = fs.readFileSync(filePath); // 파일 읽기, required('fs')
  // const storedRestaurants = JSON.parse(fileData); // 읽은 데이터 자바로 변환

  const storedRestaurants = resData.getStoredRestaurants(); // 코드리팩토링 함수 호출

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
```
