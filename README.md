# pushoo.js

## 整合各大消息推送平台服务

## 支持的消息推送平台

- [ ] Qmsg
- [x] server酱
- [ ] Push Plus - https://www.pushplus.plus/
- [x] Push Plus - https://pushplus.hxtrip.com/
- [ ] 钉钉
- [ ] 企业微信
- [ ] Telegram
- [ ] Bark
- [ ] 阿里云短信
- [ ] 腾讯云短信
- [ ] Discord
- [ ] iGot - https://push.hellyw.com/
- [ ] Webhook

## 使用方法

```bash
npm install pushoo
```

```js
const pushoo = require('pushoo')

pushoo.notice('ServerChain', {
  token: 'YOUR_TOKEN'
  content: 'Hello World'
})
```
