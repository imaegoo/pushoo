# pushoo.js

**⚠ 开发中**

## 背景

自从方糖气球推出 Server 酱以来，消息推送平台逐渐多样化，他们遵循的 API 格式却很混乱。

* 有的是 URL 地址传参，有的是 form 表单传参，有的是 JSON 传参，暂时还没看到 XML 传参的；
* 有的正文支持 Markdown，有的正文支持 HTML，有的正文支持纯文本；
* 有的支持标题，有的不支持标题。

Twikoo 评论系统对不同的消息推送平台做了大量的适配工作，云函数越来越大。

为了降低云函数复杂度，诞生了本项目，本项目旨在整合各大消息推送平台服务，获得统一的调用体验。

## 支持的消息推送平台

- [x] Qmsg - https://qmsg.zendee.cn/
- [x] Server 酱 - https://sct.ftqq.com/
- [ ] Push Plus - https://www.pushplus.plus/
- [x] Push Plus - https://pushplus.hxtrip.com/
- [ ] 钉钉 - https://blog.ljcbaby.top/article/Twikoo-DingTalk/
- [ ] 企业微信 - https://guole.fun/posts/626/
- [ ] Telegram
- [ ] Bark
- [ ] 阿里云短信
- [ ] 腾讯云短信
- [ ] Discord
- [ ] iGot - https://push.hellyw.com/
- [ ] go-cqhttp - https://twikoo.js.org/QQ_API.html
- [ ] PushDeer - https://www.pushdeer.com/
- [ ] Webhook

## 使用方法

```bash
npm install pushoo
```

现在，不论您使用什么推送平台，都无需关心他们的调用方式，只需要学习 pushoo 的调用方式即可开始发送您的第一条推送！

```js
const pushoo = require('pushoo');

pushoo.notice('平台名称', {
  token: '平台用户身份标识',
  title: '消息标题',
  content: 'Markdown 格式的推送内容'
});
```

是的，调用 pushoo 只需要传递 4 个参数！

| 参数 | 说明 |
| ---- | ---- |
| 平台名称 | 字符串，支持：`qmsg`、`serverchain`、`pushplushxtrip`、`dingtalk`、`wecom`、`gocqhttp` |
| token | 平台用户身份标识，通常情况下是一串数字和字母组合，部分平台（如 gocqhttp）见下方详细说明 |
| title | 消息标题，如果推送平台不支持消息标题，则会拼接在正文首行 |
| content | Markdown 格式的推送内容，如果推送平台不支持 Markdown，pushoo 会自动转换成支持的格式 |

## Token 字段详细说明

……待完善
