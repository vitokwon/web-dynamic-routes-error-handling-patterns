// 라우터 분할
// app.get을 router.get 으로 변경

const express = require('express');

const router = express.Router();

router.get("/", function (req, res) {
    res.render("index");
  });

router.get("/about", function (req, res) {
    res.render("about");
  });
  
  module.exports = router;