// 데이터 가져오기 코드 리팩토링
// 1) 재사용 함수 생성 후 중복코드 가져오기
// 2) 'filePath'를 함수 밖으로 빼서 모든 함수에서 접근 가능
// 3) 필요한 패키지들도 불러와야함
// 4) app.js에 이 파일에 대한 require(fs,path) 추가해야 함
// 5) 이 파일에 어떤 내용을 노출할지 작성 필요 (module.exports)
// 6) path 경로 재설정 (data파일이 상위 폴더 내에 위치함)

const path = require("path");
const fs = require("fs");

const filePath = path.join(__dirname, "..", "data", "restaurants.json"); // 경로생성 required('path')

function getStoredRestaurants() {
  const fileData = fs.readFileSync(filePath); // 파일 읽기, required('fs')
  const storedRestaurants = JSON.parse(fileData); // 읽은 데이터 자바로 변환

  return storedRestaurants;
}

function storeRestaurants(storableRestaurants) {
  fs.writeFileSync(filePath, JSON.stringify(storableRestaurants)); // push포함 제이슨으로 변환
}

// 노출하려는 항목 설정
module.exports = {
  getStoredRestaurants: getStoredRestaurants, // key:value
  // getStoredRestaurants: getStoredRestaurants(), // 함수뒤에 ()를 추가하면 호출 시, 결과가 노출됨
  storeRestaurants: storeRestaurants,
};
