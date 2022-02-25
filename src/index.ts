import axios from 'axios';

interface CommonOptions {
  token: string
  title?: string
  content: string
  contentType?: string
}

function checkParameters(options: CommonOptions, requires: string[] = []) {
  requires.forEach((require) => {
    if (!options[require]) {
      throw new Error(`${require} is required`);
    }
  });
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
      title: options.title || options.content,
      desp: options.content,
    });
  } else {
    url = 'https://sc.ftqq.com';
    param = new URLSearchParams({
      text: options.title || options.content,
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
    title: options.title || options.content,
    content: options.content,
  };
  const response = await axios.post(ppApiUrl, ppApiParam);
  return response.data;
}

async function notice(channel: string, options: CommonOptions) {
  try {
    let data: any;
    switch (channel) {
      case 'ServerChain':
        data = await noticeServerChan(options);
        break;
      case 'PushPlusHxtrip':
        data = await noticePushPlusHxtrip(options);
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
  noticeServerChan,
  noticePushPlusHxtrip,
};
