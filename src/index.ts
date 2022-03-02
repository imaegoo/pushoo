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
 * https://pushplus.hxtrip.com/
 */
async function noticePushPlusHxtrip(options: CommonOptions) {
  checkParameters(options, ['token', 'content']);
  const ppApiUrl = 'http://pushplus.hxtrip.com/send';
  const ppApiParam = {
    token: options.token,
    title: options.title || getTitle(options.content),
    content: options.content,
  };
  const response = await axios.post(ppApiUrl, ppApiParam);
  return response.data;
}

/**
 * https://blog.ljcbaby.top/article/Twikoo-DingTalk/
 */
async function noticeDingTalk(options: CommonOptions) {
  return {};
}

/**
 * https://guole.fun/posts/626/
 */
async function noticeWeCom(options: CommonOptions) {
  return {};
}

/**
 * https://twikoo.js.org/QQ_API.html
 */
async function noticeGoCqhttp(options: CommonOptions) {
  return {};
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
      case 'pushplushxtrip':
        data = await noticePushPlusHxtrip(options);
        break;
      case 'dingtalk':
        data = await noticeDingTalk(options);
        break;
      case 'wecom':
        data = await noticeWeCom(options);
        break;
      case 'gocqhttp':
        data = await noticeGoCqhttp(options);
        break;
      default:
        throw new Error('not supported');
    }
    console.log(`[PUSHOO] Send to <${channel}> result:`, data);
    return data;
  } catch (e) {
    console.error('[PUSHOO] Got error:', e);
    return { error: e };
  }
}

export {
  notice,
  noticeQmsg,
  noticeServerChan,
  noticePushPlusHxtrip,
  noticeDingTalk,
  noticeWeCom,
  noticeGoCqhttp,
};
