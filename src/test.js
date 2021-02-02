const fs = require("fs");
const path = require("path");
const data = require("./client/assets/city-adcode");

data.forEach((i) => {
  fs.access(
    path.resolve(__dirname, "./download", `${i.adcode}.json`),
    fs.constants.F_OK,
    (err) => {
      if (err) {
        console.log(`${i.adcode}.json 不存在`);
      }
    }
  );
});
