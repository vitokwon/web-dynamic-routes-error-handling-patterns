# 익스프레스 템플릿을 활용한 정적 & 동적 페이지 콘텐츠 (섹션19-20)

## 정적페이지 연결 (css, js, image 등)

1. 'public' 폴더 생성
2. 'public' 폴더로 정적 파일(css, js, image) 이동
3. express 라이브러리 실행 | 'app.use(express.static("public))'
4. 브라우저 로딩 시, 'public' 폴더 내 파일을 우선적으로 찾음.

```javascript
// 'public' 폴더 생성 후 css, js, image 파일 등 이동 후 static 사용
app.use(express.static("public"));
```

## 사용자 입력 양식 데이터 (form data) 저장

### 처리 순서

1. 'app.use(express.urlencoded({ extended: false }));' | (구문분석 미들웨어 설정)
2. 'const restaurant = req.body;' | (사용자 입력 양식 데이터 저장)
3. const filePath = path.join(\_\_dirname, "data", "restaurants.json");' | (파일 경로 설정 (path 모듈 필요))
4. 'const fileData = fs.readFileSync(filePath);' | (경로 데이터 읽기, (fs 모듈 필요))
5. 'const storedRestaurants = JSON.parse(fileData);' | (읽은 파일 데이털르 JSON 형태로 변환)
6. 'storedRestaurants.push(restaurant);' | (사용자 입력 데이터를 배열에 추가)
7. 'fs.writeFileSync(filePath, JSON.stringify(storedRestaurants));' | (변경된 데이터를 JSON 형태로 변환 후 파일에 저장)

```javascript
app.use(express.urlencoded({ extended: false })); // 구문분석 미들웨어
app.post("/restaurants", function (req, res) {
  const restaurant = req.body; // request body의 모든 내용을 가져와서 저장, 해당 json파일 생성
  const filePath = path.join(__dirname, "data", "restaurants.json"); // 경로생성 required('path')
  const fileData = fs.readFileSync(filePath); // 파일 읽기, required('fs')
  const storedRestaurants = JSON.parse(fileData); // 읽은 데이터 자바로 변환
  storedRestaurants.push(restaurant); // 변환한 자바데이터로 push
  fs.writeFileSync(filePath, JSON.stringify(storedRestaurants)); // push포함 제이슨으로 변환
});
```

## EJS 템플릿 엔진에 대한 이해와 활용 및 응용

### 처리 순서

1. 'npm install ejs' | ejs 패키지 설치
2. 'app.set('view engine', 'ejs') | Express 애플리케이션에서 뷰 엔진으로 EJS를 설정
3. 'app.set('views', path.join(\_\_dirname,'views')) | 템플릿 파일이 위치한 디렉토리 경로 설정
4. `.html` 파일을 `.ejs`로 확장자 변경

5. EJS 템플릿 파일 랜더링

```javascript
// EJS 템플릿 적용
app.get("/", function (req, res) {
  res.render("index"); // 'index.ejs' 템플릿 파일 렌더링
});

// EJS 템플릿 미적용
app.get("/", function (req, res) {
  const htmlFilePath = path.join(__dirname, "views", "index.html");
  res.sendFile(htmlFilePath);
});
```

6. 템플릿에 데이터 주입 <%= %>

```html
<p>We found <%= numberOfRestaurants %> restaurants.</p>
```

```javascript
// 정적 데이터 주입
app.get("/restaurants", function (req, res) {
  res.render("restaurant", { numberOfRestaurants: 2 });
});

// 동적 데이터 주입
app.get("/restaurants", function (req, res) {
  const filePath = path.join(__dirname, "data", "restaurants.json");

  const fileData = fs.readFileSync(filePath);
  const storedRestaurants = JSON.parse(fileData);

  res.render("restaurant", { numberOfRestaurants: storedRestaurants.length });
});
```

7. 템플릿에서 반복문 사용하여 list 생성 <% %>

```html
<ul id="restaurant-list">
  <% for (const restaurant of restaurants) { %>
  <article>
    <!-- 단일값으로 재출력 -->
    <h2><%= restaurant.name %></h2>
    <div class="restaurant-meta">
      <p><%= restaurant.cuisine %></p>
      <p><%= restaurant.address %></p>
    </div>
    <p><%= restaurant.description %></p>
    <div class="restaurant-actions">
      <a href="<%=restaurant.website %>">View Website</a>
    </div>
  </article>
  <% } %>
</ul>
```

```javascript
app.get("/restaurants", function (req, res) {
  const filePath = path.join(__dirname, "data", "restaurants.json");

  const fileData = fs.readFileSync(filePath);
  const storedRestaurants = JSON.parse(fileData);

  res.render("restaurant", {
    numberOfRestaurants: storedRestaurants.length, // 첫번째 key/value 쌍.
    restaurants: storedRestaurants, // 두번째 key/value 쌍 전달.
  });
});
```

7. 템플릿에서 조건문을 사용하여 콘텐츠 랜더링 생성 <% %>

```html
<main>
  <h1>Recommended restaurants</h1>
  <!-- 만약 저장된 레스토랑 정보가 없다면 -->
  <% if (numberOfRestaurants === 0) { %>
  <p>
    Unfortunately, we have no restaurants yet - maybe start recommending some?
  </p>
  <!-- 조건이 아닌 경우의 출력 -->
  <% } else { %>
  <!-- 저장된 자바스크립트 값 가져오기, 자동으로 데이터(원시 텍스트)로 변환됨,
    등호(=)는 원시텍스트를 이스케이프하여 HTML 코드로의 해킹을 방지하고, 보안 역할을 함 -->
  <p>We found <%= numberOfRestaurants %> restaurants.</p>
  <p>Find your next favorite restaurant with the help of our other users!</p>
  <ul id="restaurant-list">
    <% for (const restaurant of restaurants) { %>
    <article>
      <!-- 단일값으로 재출력 -->
      <h2><%= restaurant.name %></h2>
      <div class="restaurant-meta">
        <p><%= restaurant.cuisine %></p>
        <p><%= restaurant.address %></p>
      </div>
      <p><%= restaurant.description %></p>
      <div class="restaurant-actions">
        <a href="<%=restaurant.website %>">View Website</a>
      </div>
    </article>
    <% } %>
  </ul>
  <% } %>
</main>
```

8. 일부 공통 콘텐츠 분할 관리 및 재사용 <%- include %>

- '-(대쉬)'는 일부 html 내용을 랜더링할 때 사용
- <%- include('relative-path', {key:value})> | 추가 key/value값 전달도 가능

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- 공통된 head 부분을 별도의 파일로 분리 -->
    <%- include('includes/head') %>
    <link rel="stylesheet" href="styles/restaurants.css">
  </head>
  <body>
    <!-- 공통된 header, aside 부분을 별도의 파일로 분리 -->
    <%- include('includes/header') %>
    <%- include('includes/side-drawer') %>
    <main>
      <h1>Recommended restaurants</h1>
      <% if (numberOfRestaurants === 0) { %>
        <p>Unfortunatale, we have no restaurants yet - maybe start recommending some?</p>
        <% } else { %>
        <p>WE Found <%= numberOfRestaurants %> restaurants.</p> 
        <p>Find your next favorite restaurants with help of our other users!</p>
        <ul id="restaurants-list">
          <% for (const restaurant of restaurants) { %>
            <!-- include로 key:value 전달 후 for문 list 생성 -->
            <%- include('includes/restaurants/restaurant-item',{restaurant: restaurant}) %>
          <% } %>
        </ul>  
      <% } %>
    </main>
  </body>
</html>
```
