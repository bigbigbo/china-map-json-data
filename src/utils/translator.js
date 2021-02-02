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
  path.resolve(__dirname, "../client/assets/city-adcode.js"),
  `(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
  }
  }(this, function () {
    return ${JSON.stringify(result)};
  }));`,
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
  }
);
