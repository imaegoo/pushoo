# pushoo.js

## 背景

消息推送平台多用于在特定的场合提醒使用者，例如：博客收到评论、服务器告警、油价上涨、每日签到结果推送、家中饲养的鸽子外出、飞回，等等……自从方糖气球推出 Server 酱以来，消息推送平台逐渐多样化，他们遵循的 API 格式却很混乱。

* 有的是 URL 地址传参，有的是 form 表单传参，有的是 JSON 传参，暂时还没看到 XML 传参的；
* 有的正文支持 Markdown，有的正文支持 HTML，有的正文支持纯文本；
* 有的支持标题，有的不支持标题。

Twikoo 评论系统对不同的消息推送平台做了大量的适配工作，云函数越来越大。

为了降低云函数复杂度，遂诞生了本项目，本项目旨在整合各大消息推送平台服务，获得统一的调用体验。

同时本项目由Tianli0提供公益QQ机器人推送服务，请勿用于非法用途！（机器人QQ将不定期更换，请关注文档）

## 支持的消息推送平台

- [Qmsg](https://qmsg.zendee.cn/)
- [Server 酱](https://sct.ftqq.com/)
- [Push Plus](https://www.pushplus.plus/)
- [Push Plus Hxtrip](https://pushplus.hxtrip.com/)
- [钉钉](https://open.dingtalk.com/document/group/custom-robot-access)
- [企业微信](https://guole.fun/posts/626/)
- [Bark](https://github.com/Finb/Bark)
- [go-cqhttp](https://docs.go-cqhttp.org/api/)
- [atri](https://blog.tianli0.top/)
- [PushDeer](https://www.pushdeer.com/)
- [iGot](https://push.hellyw.com/)
- [Telegram](https://core.telegram.org/bots)
- [飞书](https://www.feishu.cn/hc/zh-CN/articles/360024984973)

## 计划支持的推送平台

- Discord
- 阿里云短信
- 腾讯云短信
- 自定义 Webhook

## 使用方法

注：如果您是在 Twikoo 评论系统中使用，则无需搭建，直接在 Twikoo 管理面板中配置平台名称和 token 即可。

安装

```bash
npm install pushoo
```

现在，不论您使用什么推送平台，都无需关心他们的调用方式，只需要学习 pushoo 的调用方式即可开始发送您的第一条推送！

```js
const pushoo = require('pushoo').default;

const result = await pushoo('平台名称', {
  token: '平台用户身份标识',
  title: '消息标题',
  content: 'Markdown 格式的推送内容'
});

console.log(result);
```

是的，调用 pushoo 只需要传递 4 个参数！

| 参数 | 必填 | 默认 | 说明 |
| ---- | ---- | ---- | ---- |
| 平台名称 | ✅ | 无 | 字符串，平台名称的缩写，支持：`qmsg`、`serverchain`、`pushplus`、`pushplushxtrip`、`dingtalk`、`wecom`、`bark`、`gocqhttp`、`atri`、`pushdeer`、`igot`、`telegram`、`feishu` |
| token | ✅ | 无 | 平台用户身份标识，通常情况下是一串数字和字母组合，详情和示例见下方详细说明 |
| title | | 内容第一行 | 可选，消息标题，如果推送平台不支持消息标题，则会拼接在正文首行 |
| content | ✅ | 无 | Markdown 格式的推送内容，如果推送平台不支持 Markdown，pushoo 会自动转换成支持的格式 |

## 详细说明

### 💬 [Qmsg](https://qmsg.zendee.cn/) <sub>缩写: `qmsg`</sub>

Qmsg 酱是 Zendee 提供的第三方 QQ 消息推送服务，免费，消息以 QQ 消息的形式推送，支持私聊推送和群推送。请注意，为避免 Qmsg 酱被 Tencent 冻结，pushoo 会自动删除消息中的网址和 IP 地址。

1. 前往 https://qmsg.zendee.cn/ 并使用 QQ 登录
2. 点击 “管理台”，选择一个 Qmsg 酱，并添加 TA 为好友
3. 在 “我的QQ列表” 中添加自己的 QQ 号
4. 复制 “我的KEY” 下方的 key，填入 pushoo 的 token 中

示例 token：`d3e96b6c50adf28cc6d1bb*****a4613`

### 💬 [Server 酱](https://sct.ftqq.com/) <sub>缩写: `serverchain`</sub>

Server 酱是方糖提供的第三方多渠道推送服务，以服务号推送起家，稳定运行多年，免费收费并存，特色功能较多。

1. 前往 https://sct.ftqq.com/ 并使用微信登录
2. 点击 “消息通道”，设置合适的消息通道并保存
2. 点击 “SendKey”，复制 “SendKey” 下方的 key，填入 pushoo 的 token 中

示例 token：`SCT1364TKdsiGjGvyAZNYD*****VAK0k`

### 💬 [Push Plus](https://www.pushplus.plus/) <sub>缩写: `pushplus`</sub>

Push Plus 是苏州破壳网络科技有限公司提供的第三方微信服务号推送服务，免费，存在不影响使用体验的广告。

1. 前往 https://www.pushplus.plus/ 并使用微信登录
2. 点击 “一对一推送”，复制 “你的token” 下方的 token，填入 pushoo 的 token 中

示例 token：`2832134a66df4da69ef941*****72317`

### 💬 [Push Plus Hxtrip](https://pushplus.hxtrip.com/) <sub>缩写: `pushplushxtrip`</sub>

已失效，请使用 [Push Plus](#Push-Plus)。

### 💬 [钉钉](https://open.dingtalk.com/document/group/custom-robot-access) <sub>缩写: `dingtalk`</sub>

钉钉是阿里推出的办公即时消息软件，官方提供了机器人 API，可实现消息推送，免费。推送的消息必须包含配置的关键字，否则推送不成功。只能在群聊中创建机器人，可选择 2 名好友组建群聊，然后移除 2 名好友（好友会收到提醒，请谨慎操作），再添加机器人。

1. 根据 https://open.dingtalk.com/document/group/custom-robot-access 的说明，创建一个机器人。如果是在 Twikoo 评论系统中使用，请配置关键字为 “评论”
2. 复制机器人的 Webhook，填入 pushoo 的 token 中

示例 token：`https://oapi.dingtalk.com/robot/send?access_token=06ff1823a060af772677680d9522b547bc2685251d47bed17ddada*****41d97`（完整的 Webhook）或者 `06ff1823a060af772677680d9522b547bc2685251d47bed17ddada*****41d97`（只保留 access token）

### 💬 [企业微信](https://guole.fun/posts/626/) <sub>缩写: `wecom`</sub>

企业微信应用消息推送，免费，限制较少。

1. 用电脑打开 [https://work.weixin.qq.com/](https://work.weixin.qq.com/)，注册一个企业
2. 注册成功后，点「管理企业」进入管理界面，选择「应用管理」 → 「自建」 → 「创建应用」
3. 应用名称填入机器人的名称，应用 logo 选择机器人的头像，可见范围选择公司名
4. 创建完成后进入应用详情页，可以得到应用ID( `agentid` )，应用Secret( `secret` )，复制<br>
PS：获取应用Secret时，可能会将其推送到企业微信客户端，这时候微信里边是看不到的，需要在企业微信客户端里边才能看到
5. 进入「[我的企业](https://work.weixin.qq.com/wework_admin/frame#profile)」页面，拉到最下边，可以看到企业ID，复制
6. 进入「我的企业」 → 「[微信插件](https://work.weixin.qq.com/wework_admin/frame#profile/wxPlugin)」，拉到下边扫描二维码，关注以后即可收到推送的消息
7. 将第 4 步和第 5 步取得的 `企业ID#应用Secret#应用ID` 拼到一起，中间用 “`#`” 号分隔，填入 pushoo 的 token 中

示例 token：`ww97a01a*****1e5f1#xHapDXmgZtlBgRQQXMb4kfh3y75Ynoubl*****l9ytE#1000005`

PS：如果出现接口请求正常，企业微信接受消息正常，个人微信无法收到消息的情况，请确认如下配置：

- 进入「我的企业」 → 「微信插件」，拉到最下方，勾选「允许成员在微信插件中接收和回复聊天消息 」
- 在企业微信客户端 「我」 → 「设置」 → 「新消息通知」中关闭「仅在企业微信中接受消息」限制条件

### 💬 [Bark](https://github.com/Finb/Bark) <sub>缩写: `bark`</sub>

Bark 是 iOS 通知中心推送工具，可以推送消息到苹果手机上，免费。

1. 下载 [Bark APP](https://apps.apple.com/cn/app/bark-%E7%BB%99%E4%BD%A0%E7%9A%84%E6%89%8B%E6%9C%BA%E5%8F%91%E6%8E%A8%E9%80%81/id1403753865)
2. 轻触下方 “服务器”，复制第一个服务器地址，删除 “这里改成你自己的推送内容” 字样，填入 pushoo 的 token 中

示例 token：`https://api.day.app/q2S4vQqpNyaS*****9neeJ/`（完整的 URL）或者 `q2S4vQqpNyaS*****9neeJ`（只保留 token）

### 💬 [go-cqhttp](https://docs.go-cqhttp.org/api/) <sub>缩写: `gocqhttp`</sub>

go-cqhttp 是开源 QQ 机器人程序，免费，需自行搭建，插件十分丰富，但 “野生” 机器人并没有得到 Tencent 官方的支持，有账号被冻结的风险。

1. 前往 [go-cqhttp release](https://github.com/Mrs4s/go-cqhttp) 下载对应系统版本
2. 此处省略安装过程，可参考 [https://docs.go-cqhttp.org/guide/quick_start.html](https://docs.go-cqhttp.org/guide/quick_start.html)
3. 修改配置文件，配置 `default-middlewares` 下面的 `access-token`，启动 go-cqhttp
4. 按照示例所示的 API 调用地址，填入 pushoo 的 token 中

示例 token：`http://你的IP或域名:端口号/send_private_msg?user_id=QQ号&token=你配置的token`（QQ号）或 `http://你的IP或域名:端口号/send_group_msg?group_id=群号&token=你配置的token`（QQ群）

### 💬 [atri](https://github.com/TIANLI0/push-bot-api/) <sub>缩写: `atri`</sub>

go-cqhttp 是开源 QQ 机器人程序，由[Tianli](https://blog.tianli0.top/)提供的pushoo推送服务。

使用前请加机器人好友（QQ：2102916311）

示例 token：`1627236613`（QQ号）

### 💬 [PushDeer](https://www.pushdeer.com/) <sub>缩写: `pushdeer`</sub>

PushDeer 是方糖一个开源的无 APP 推送解决方案，支持 iOS 14+ 轻应用、MacOS 11+ 客户端、Android 快应用，免费。

1. 前往 [https://www.pushdeer.com/product.html](https://www.pushdeer.com/product.html) 扫码打开轻应用并登录
2. 轻触下方 “Key”，轻触右上角 “+” 号创建第一个 Key，复制，填入 pushoo 的 token 中

示例 token：`PDU431TfFHZICvR6lJrFBswSRN1cJ*****zzFvR`

### 💬 [iGot](https://push.hellyw.com/) <sub>缩写: `igot`</sub>

iGot 是一款聚合 APP、邮箱、微信等多种推送方式的第三方推送平台，免费，存在影响体验的广告。

1. 根据 https://push.hellyw.com/doc/ 的说明，获取推送 key，填入 pushoo 的 token 中

示例 token：`621f3b1dd2eba1*****101d9`

### 💬 [Telegram](https://core.telegram.org/bots) <sub>缩写: `telegram`</sub>

Telegram 是自由的聊天工具，支持机器人 API，免费，中国大陆服务器无法使用这种推送方式。

1. 通过 [@BotFather](https://t.me/BotFather) 创建机器人，并获取 `api_token`
2. 通过 [@userinfobot](https://t.me/userinfobot) 获取接受消息对象的 `chat_id`。接受消息的对象可以是用户，频道，或群组
3. 将第 1 步和第 2 步取得的 `api_token#chat_id` 拼到一起，中间用 “`#`” 号分隔，填入 pushoo 的 token 中

示例 token：`5262***170:AAEzkaMjOayU13fFzcg9PI7_7*****p1iAs#958***732`

### 💬 [飞书](https://www.feishu.cn/hc/zh-CN/articles/360024984973) <sub>缩写: `feishu`</sub>

飞书是字节跳动旗下的办公即时消息软件，官方提供了机器人 API，可实现消息推送，免费。推送的消息必须包含配置的关键字，否则推送不成功。只能在群聊中创建机器人。

1. 进入群组，打开会话设置，找到群机器人，并点击添加机器人，选择自定义机器人并添加。如果是在 Twikoo 评论系统中使用，请配置关键字为 “评论”
2. 复制机器人的 Webhook，填入 pushoo 的 token 中

示例 token：`https://open.feishu.cn/open-apis/bot/v2/hook/393df85f-7b2c-4ff6-bd4f-*******3ed54`（完整的 Webhook）或者 `393df85f-7b2c-4ff6-bd4f-*******3ed54`（只保留 access token）
