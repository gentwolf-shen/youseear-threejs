# YouSeeAR 

技术支持： www.YouSeeAR.com

浏览器端WebAR识别跟踪实现，支持手机浏览器，Android微信浏览器（不支持iOS微信浏览器）等。

## sample说明

本sample使用three.js渲染模型。

识别图及特征数据在assets/features目录下。

生成特征数据请访问 https://www.YouSeeAR.com 。

特征数据加载请修改
```javascript
this.youSeeAR.loadMarker('../../../features/feature.dat');
```

模型加载请修改
```javascript
const url = 'assets/models/dancing-girl.glb';
// todo: 模型的transform请调试到合适参数
```

## 在线预览

预览demo二维码，手机浏览器、Android版微信扫码直接体验。或访问官方demo网址：https://demo.YouSeeAR.com

<img src="demo.png" height="300px" alt="在线预览"  title="在线预览">


识别图

<img src="assets/features/marker.jpg" height="550px" alt="识别图"  title="识别图">