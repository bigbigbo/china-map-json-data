# China Map JSON Data

抓取[高德接口](https://developer.amap.com/api/amap-ui/reference-amap-ui/geo/district-explorer)返回的中国省市区三级地图数据，可直接在 echart 中使用。

```
因为网上找的地图数据精度都不是很理想，高德地图提供的数据精确多了，当然最重要的原因是项目因为网络限制，不让访问外网以至于没法直接使用高德地图提供的服务，所以有了此仓库。
```

## 思路

先看下 `client/index.html` 中定义的 `getGeoJson` 方法：

```js
const getGeoJson = async (adcode) => {
  AMapUI.loadUI(["geo/DistrictExplorer"], (DistrictExplorer) => {
    const districtExplorer = new DistrictExplorer();
    districtExplorer.loadAreaNode(adcode, async (error, areaNode) => {
      if (error) {
        console.error(error);
        return;
      }
      let features = areaNode.getSubFeatures();
      let finalFeatures = [];

      const jsr = JSON.stringify(features);
      const blob = new Blob([jsr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${adcode}.json`;
      document.documentElement.appendChild(a);
      a.click();
      document.documentElement.removeChild(a);
    });
  });
};
```

因为需要调用 `AMapUI.loadUI` 并且通过 `getSubFeatures` 方法才能获取到想要的数据格式（Echart 能正确加载的），所以该方法定义在了 index.html 中，而没法直接通过 Node.js 进行抓取。

`getGeoJson` 方法定义的其实是一个模拟点击的操作，但因为省市区三级区划总共有 399 份数据，手工去点击下载有点累人。所以这里借助 Puppeteer 来实现自动化操作。

```js
//...
const downloadPath = path.resolve(__dirname, "download");

//...
await page._client.send("Page.setDownloadBehavior", {
  behavior: "allow",
  downloadPath,
});

//...
await page.evaluate(async () => {
  const sleep = (t) => new Promise((r) => setTimeout(r, t));

  for (const record of window.returnExports) {
    getGeoJson(record.adcode);
    await sleep(1000);
  }
});
```
以上。

## 说明

- 如果后续需要更新，请使用自己的[高德地图 API Key](https://developer.amap.com/api/javascript-api/guide/abc/prepare)
- 总共抓取了全国、各省、各地市共 396 份数据，其中 `莱芜市 371200`、`东沙群岛 442101`、`那曲地区 542400` 未能成功抓取数据
