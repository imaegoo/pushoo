# pushoo.js

**⚠ 开发中**

整合各大消息推送平台服务

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
- [ ] Webhook

## 使用方法

```bash
npm install pushoo
```

```js
const pushoo = require('pushoo')

// Qmsg - https://qmsg.zendee.cn/
pushoo.notice('Qmsg', {
  token: 'YOUR_TOKEN'
  content: 'Hello World'
})

// Server 酱
pushoo.notice('ServerChain', {
  token: 'YOUR_TOKEN'
  content: 'Hello World'
})

// Push Plus - https://pushplus.hxtrip.com/
pushoo.notice('PushPlusHxtrip', {
  token: 'YOUR_TOKEN'
  content: 'Hello World'
})
```
