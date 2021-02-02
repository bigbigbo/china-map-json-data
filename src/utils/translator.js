const fs = require("fs");
const path = require("path");
const originData = require("../client/assets/china-adcode");

const fillterLevel = ["province", "city"];

let result = [{ adcode: "100000", name: "全国", level: "country" }];

function loop(data) {
  for (let i = 0; i < data.length; i++) {
    const record = data[i];

    if (!fillterLevel.includes(record.level)) return;

    result.push({
      adcode: record.adcode,
      name: record.name,
      level: record.level,
    });
    if (record.children && record.children.length > 0) {
      loop(record.children);
    }
  }
}

loop(originData.children);

fs.writeFile(
  path.resolve(__dirname, "../client/assets/adcode.js"),
  `window.AdcodeJson = ${JSON.stringify(result)}`,
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
  }
);
