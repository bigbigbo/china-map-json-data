const path = require("path");
const rimraf = require("rimraf");
const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.use(express.static(path.resolve(__dirname, "./client")));

app.listen(3000, async () => {
  console.log("http://127.0.0.1:3000");
  console.log("");

  const downloadPath = path.resolve(__dirname, "download");
  rimraf.sync(downloadPath);

  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page._client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath,
  });
  await page.goto("http://127.0.0.1:3000");

  await page.evaluate(async () => {
    const sleep = (t) => new Promise((r) => setTimeout(r, t));

    for (const record of window.returnExports) {
      getGeoJson(record.adcode);
      await sleep(1000);
    }
  });

  // await browser.close();
});
