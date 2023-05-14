// 분할 라우터
// express, router 추가
// app을 router로 변경

const express = require("express");
const uuid = require("uuid"); // app.js에서 라우터 분할로 이동

// app.js에서 라우터분할로 restaurants.js로 이동
// 내가 만든 파일 가져오기 (코드 리팩토링)
const resData = require("../util/restaurant-data"); // 전체 경로로 작성해야 함

const router = express.Router();

router.get("/restaurants", function (req, res) {
  const storedRestaurants = resData.getStoredRestaurants();

  // 쿼리 매개변수 객체 저장 (restaurants.ejs에서 form hidden 설정해야함)
  let order = req.query.order;
  let nextOrder = 'desc';

  if (order !== "asc" && order !== "desc") {
    order = "asc";
  }

  if (order === 'desc') {
    nextOrder ='asc';
  }

  // list 오름차순, 내림차순 정렬
  // sort 메서드 사용
  storedRestaurants.sort(function (resA, resB) {
    if (
      (order === "asc" && resA.name > resB.name) ||
      (order === "desc" && resB.name > resA.name)
    ) {
      return 1;
      // retrun이 0보다 클 경우
      // 두 아이템을 뒤집어서, 두번째 항목 resB가 resA보다 먼저 나옴
    }
    return -1;
    // return이 0보다 작을 경우 반대
    // 아이템을 뒤집지 않고 resA가 먼저 위치
  });

  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
    nextOrder: nextOrder
  });
});

router.get("/restaurants/:id", function (req, res) {
  const restaurantId = req.params.id;

  const storedRestaurants = resData.getStoredRestaurants();

  for (const restaurant of storedRestaurants) {
    if (restaurant.id === restaurantId) {
      return res.render("restaurant-detail", { restaurant: restaurant });
    }
  }

  res.status(404).render("404");
});

router.get("/recommend", function (req, res) {
  res.render("recommend");
});

router.post("/recommend", function (req, res) {
  const restaurant = req.body;

  restaurant.id = uuid.v4();
  const restaurants = resData.getStoredRestaurants();

  restaurants.push(restaurant);

  resData.storeRestaurants(restaurants);

  res.redirect("/confirm");
});

router.get("/confirm", function (req, res) {
  res.render("confirm");
});

module.exports = router;
