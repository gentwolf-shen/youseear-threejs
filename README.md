# YouSeeAR 

技术支持： www.YouSeeAR.com

浏览器端WebAR识别跟踪实现，支持手机浏览器，Android微信浏览器（不支持iOS微信浏览器）等。

## sample说明

本sample使用three.js渲染模型及播放视频。

识别图及特征数据在assets/features目录下。

生成特征数据请访问 https://www.YouSeeAR.com 。

特征数据及模型/视频地址请修改
```javascript
const setting = [
    { type: 'model', featureUrl: '/assets/features/model.dat', assetUrl: '/assets/models/dancing-girl.glb', scale: 100, rotationX: Math.PI / 2 },
    { type: 'video', featureUrl: '/assets/features/video.dat', assetUrl: '/assets/videos/1.mp4', scale: 400 },
]
app.run(setting[0]);

```

## 在线预览

预览demo二维码，手机浏览器、Android版微信扫码直接体验。或访问官方demo网址：https://demo.YouSeeAR.com

<img src="demo.png" height="300px" alt="在线预览"  title="在线预览">


识别图

<img src="assets/features/model.jpg" height="550px" alt="识别图"  title="识别图">
