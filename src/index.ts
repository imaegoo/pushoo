import axios from 'axios';
import marked from 'marked';
import markdownToTxt from 'markdown-to-txt';

interface CommonOptions {
  token: string
  title?: string
  content: string
}

function checkParameters(options: CommonOptions, requires: string[] = []) {
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
 * https://sct.ftqq.com/
 */
async function noticeServerChan(options: CommonOptions) {
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
 * https://guole.fun/posts/626/
 */
async function noticeWeCom(options: CommonOptions) {
  checkParameters(options, ['token', 'content']);
  const WeComApiUrl = options.token;
  let content = getTxt(options.content);
  if (options.title) {
    content = `${options.title}\n${content}`;
  }
  const WeComApiContent = encodeURIComponent(content);
  const response = await axios.get(WeComApiUrl + WeComApiContent);
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

async function notice(channel: string, options: CommonOptions) {
  try {
    let data: any;
    switch (channel.toLowerCase()) {
      case 'qmsg':
        data = await noticeQmsg(options);
        break;
      case 'serverchain':
        data = await noticeServerChan(options);
        break;
      case 'pushplus':
        data = await noticePushPlus(options);
        break;
      case 'pushplushxtrip':
        data = await noticePushPlusHxtrip(options);
        break;
      case 'dingtalk':
        data = await noticeDingTalk(options);
        break;
      case 'wecom':
        data = await noticeWeCom(options);
        break;
      case 'bark':
        data = await noticeBark(options);
        break;
      case 'gocqhttp':
        data = await noticeGoCqhttp(options);
        break;
      case 'pushdeer':
        data = await noticePushdeer(options);
        break;
      default:
        throw new Error('not supported');
    }
    console.debug(`[PUSHOO] Send to <${channel}> result:`, data);
    return data;
  } catch (e) {
    console.error('[PUSHOO] Got error:', e);
    return { error: e };
  }
}

export default notice;

export {
  notice,
  noticeQmsg,
  noticeServerChan,
  noticePushPlus,
  noticePushPlusHxtrip,
  noticeDingTalk,
  noticeWeCom,
  noticeBark,
  noticeGoCqhttp,
  noticePushdeer,
};
