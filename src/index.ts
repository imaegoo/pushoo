import axios from 'axios';
import marked from 'marked';
import markdownToTxt from 'markdown-to-txt';

export interface CommonOptions {
  token: string
  title?: string
  content: string
}

export type ChannelType =
  | 'qmsg'
  | 'serverchain'
  | 'pushplus'
  | 'pushplushxtrip'
  | 'dingtalk'
  | 'wecom'
  | 'bark'
  | 'gocqhttp'
  | 'atri'
  | 'pushdeer'
  | 'igot'
  | 'telegram'
  | 'feishu'

function checkParameters(options: any, requires: string[] = []) {
  requires.forEach((require) => {
    if (!options[require]) {
      throw new Error(`${require} is required`);
    }
  });
}

function getHtml(content: string) {
  return marked.parse(content);
}

function getTxt(content: string) {
  return markdownToTxt(content);
}

function getTitle(content: string) {
  return getTxt(content).split('\n')[0];
}

function removeUrlAndIp(content: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const ipRegex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g;
  return content.replace(urlRegex, '').replace(ipRegex, '');
}

/**
 * https://qmsg.zendee.cn/
 */
async function noticeQmsg(options: CommonOptions) {
  checkParameters(options, ['token', 'content']);
  const url = 'https://qmsg.zendee.cn';
  let msg = getTxt(options.content);
  if (options.title) {
    msg = `${options.title}\n${msg}`;
  }
  // 移除网址和 IP 以避免 Qmsg 酱被 Tencent 封号
  msg = removeUrlAndIp(msg);
  const param = new URLSearchParams({ msg });
  const response = await axios.post(`${url}/send/${options.token}`, param.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
}

/**
 * https://github.com/Tianli0/push-bot-api/
 */
async function noticeAtri(options: CommonOptions) {
  checkParameters(options, ['token', 'content']);
  const url = 'https://pushoo.tianli0.top/';
  let message = getTxt(options.content);
  if (options.title) {
    message = `${options.title}\n${message}`;
  }
  const param = new URLSearchParams({
    user_id: options.token,
    message,
  });
  const response = await axios.post(url, param.toString(), {
    headers: { 'X-Requested-By': 'pushoo' },
  });
  return response.data;
}

/**
 * https://sct.ftqq.com/
 */
async function noticeServerChain(options: CommonOptions) {
  checkParameters(options, ['token', 'content']);
  let url: string;
  let param: URLSearchParams;
  if (options.token.substring(0, 3).toLowerCase() === 'sct') {
    url = 'https://sctapi.ftqq.com';
    param = new URLSearchParams({
      title: options.title || getTitle(options.content),
      desp: options.content,
    });
  } else {
    url = 'https://sc.ftqq.com';
    param = new URLSearchParams({
      text: options.title || getTitle(options.content),
      desp: options.content,
    });
  }
  const response = await axios.post(`${url}/${options.token}.send`, param.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
}

/**
 * https://www.pushplus.plus/
 */
async function noticePushPlus(options: CommonOptions) {
  checkParameters(options, ['token', 'content']);
  const ppApiUrl = 'http://www.pushplus.plus/send';
  const ppApiParam = {
    token: options.token,
    title: options.title || getTitle(options.content),
    content: options.content,
    template: 'markdown',
  };
  const response = await axios.post(ppApiUrl, ppApiParam);
  return response.data;
}

/**
 * https://pushplus.hxtrip.com/
 */
async function noticePushPlusHxtrip(options: CommonOptions) {
  checkParameters(options, ['token', 'content']);
  const ppApiUrl = 'http://pushplus.hxtrip.com/send';
  const ppApiParam = {
    token: options.token,
    title: options.title || getTitle(options.content),
    content: options.content,
    template: 'markdown',
  };
  const response = await axios.post(ppApiUrl, ppApiParam);
  return response.data;
}

/**
 * 文档: https://open.dingtalk.com/document/group/custom-robot-access
-* 教程: https://blog.ljcbaby.top/article/Twikoo-DingTalk/
 */
async function noticeDingTalk(options: CommonOptions) {
  checkParameters(options, ['token', 'content']);
  let url = 'https://oapi.dingtalk.com/robot/send?access_token=';
  if (options.token.substring(0, 4).toLowerCase() === 'http') {
    url = options.token;
  } else {
    url += options.token;
  }
  let content = getTxt(options.content);
  if (options.title) {
    content = `${options.title}\n${content}`;
  }
  const response = await axios.post(url, { msgtype: 'text', text: { content } });
  return response.data;
}

/**
 * 文档: https://developer.work.weixin.qq.com/document/path/90236
 * 教程: https://sct.ftqq.com/forward
 */
async function noticeWeCom(options: CommonOptions) {
  checkParameters(options, ['token', 'content']);
  const [corpid, corpsecret, agentid, touser = '@all'] = options.token.split('#');
  checkParameters({ corpid, corpsecret, agentid }, ['corpid', 'corpsecret', 'agentid']);
  // 获取 Access Token
  let accessToken;
  try {
    const accessTokenRes = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`);
    accessToken = accessTokenRes.data.access_token;
  } catch (e) {
    console.error('获取企业微信 access token 失败，请检查 token', e);
    return {};
  }
  // 发送消息
  const url = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${accessToken}`;
  let content = getTxt(options.content);
  if (options.title) {
    content = `${options.title}\n${content}`;
  }
  const param = {
    touser,
    msgtype: 'text',
    agentid,
    text: { content },
  };
  const response = await axios.post(url, param);
  return response.data;
}

/**
 * https://github.com/Finb/Bark
 */
async function noticeBark(options: CommonOptions) {
  checkParameters(options, ['token', 'content']);
  let url = 'https://api.day.app/';
  if (options.token.substring(0, 4).toLowerCase() === 'http') {
    url = options.token;
  } else {
    url += options.token;
  }
  if (!url.endsWith('/')) url += '/';
  const title = encodeURIComponent(options.title || getTitle(options.content));
  const content = encodeURIComponent(getTxt(options.content));
  const response = await axios.get(`${url}${title}/${content}/`);
  return response.data;
}

/**
 * 文档: https://docs.go-cqhttp.org/api/
 * 教程: https://twikoo.js.org/QQ_API.html
 */
async function noticeGoCqhttp(options: CommonOptions) {
  checkParameters(options, ['token', 'content']);
  const url = options.token;
  let message = getTxt(options.content);
  if (options.title) {
    message = `${options.title}\n${message}`;
  }
  const param = new URLSearchParams({ message });
  const response = await axios.post(url, param.toString());
  return response.data;
}

async function noticePushdeer(options: CommonOptions) {
  checkParameters(options, ['token', 'content']);
  const url = 'https://api2.pushdeer.com/message/push';
  const response = await axios.post(url, {
    pushkey: options.token,
    text: options.title || getTitle(options.content),
    desp: options.content,
  });
  return response.data;
}

async function noticeIgot(options: CommonOptions) {
  checkParameters(options, ['token', 'content']);
  const url = `https://push.hellyw.com/${options.token}`;
  const response = await axios.post(url, {
    title: options.title || getTitle(options.content),
    content: getTxt(options.content),
  });
  return response.data;
}

/**
 * 文档: https://core.telegram.org/method/messages.sendMessage
 * 教程: https://core.telegram.org/bots#3-how-do-i-create-a-bot
 */
async function noticeTelegram(options: CommonOptions) {
  checkParameters(options, ['token', 'content']);
  const [tgToken, chatId] = options.token.split('#');
  checkParameters({ tgToken, chatId }, ['tgToken', 'chatId']);
  let text = options.content;
  if (options.title) {
    text = `${options.title}\n\n${text}`;
  }
  const response = await axios.post(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
    text,
    chat_id: chatId,
    parse_mode: 'Markdown',
  });
  return response.data;
}

/**
 * https://www.feishu.cn/hc/zh-CN/articles/360024984973
 */
async function noticeFeishu(options: CommonOptions) {
  checkParameters(options, ['token', 'content']);
  const v1 = 'https://open.feishu.cn/open-apis/bot/hook/';
  const v2 = 'https://open.feishu.cn/open-apis/bot/v2/hook/';
  let url;
  let params;
  if (options.token.substring(0, 4).toLowerCase() === 'http') {
    url = options.token;
  } else {
    url = v2 + options.token;
  }
  if (url.substring(0, v1.length) === v1) {
    params = {
      title: options.title || getTitle(options.content),
      text: getTxt(options.content),
    };
  } else {
    let text = getTxt(options.content);
    if (options.title) {
      text = `${options.title}\n${text}`;
    }
    params = {
      msg_type: 'text',
      content: { text },
    };
  }
  const response = await axios.post(url, params);
  return response.data;
}

async function notice(channel: ChannelType, options: CommonOptions) {
  try {
    let data: any;
    const noticeFn = {
      qmsg: noticeQmsg,
      serverchain: noticeServerChain,
      pushplus: noticePushPlus,
      pushplushxtrip: noticePushPlusHxtrip,
      dingtalk: noticeDingTalk,
      wecom: noticeWeCom,
      bark: noticeBark,
      gocqhttp: noticeGoCqhttp,
      atri: noticeAtri,
      pushdeer: noticePushdeer,
      igot: noticeIgot,
      telegram: noticeTelegram,
      feishu: noticeFeishu,
    }[channel.toLowerCase()];
    if (noticeFn) {
      data = await noticeFn(options);
    } else {
      throw new Error(`<${channel}> is not supported`);
    }
    console.debug(`[PUSHOO] Send to <${channel}> result:`, data);
    return data;
  } catch (e) {
    console.error('[PUSHOO] Got error:', e.message);
    return { error: e };
  }
}

export default notice;

export {
  notice,
  noticeQmsg,
  noticeServerChain,
  noticePushPlus,
  noticePushPlusHxtrip,
  noticeDingTalk,
  noticeWeCom,
  noticeBark,
  noticeGoCqhttp,
  noticeAtri,
  noticePushdeer,
  noticeIgot,
  noticeTelegram,
  noticeFeishu,
};
