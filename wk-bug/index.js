const playwright = require('playwright');
const _fetch = require('make-fetch-happen');

const mock = url => {return {url, status: 200, headers: {'content-type': 'text/plain'},body: ''}}

const fetch = async function(url) {
  const _resp = await _fetch(url, {});
  const status = _resp.status;
  const headers = _resp.headers.raw();
  let body = await _resp.buffer();
  return {headers, status, body};
}

const css = `\n.Body-header, .Body-aside {display: none !important;}`;
const counter = {chromium: 0, firefox: 0, webkit: 0};
const browser = {};
const context = {};
const page = {};

(async () => {
  for (const browserType of ['chromium', 'firefox', 'webkit']) {
    browser[browserType] = await playwright[browserType].launch({headless: false});
    context[browserType] = await browser[browserType].newContext({ viewport: null });
    page[browserType]    = await context[browserType].newPage();

    await context[browserType].route('**/*', async (route, request) => {
      const url = request.url();

      if (url.match(/example\.com\/$/)) {
        const resp = await fetch(url);
        counter[browserType] += 1;
        resp.body = `${resp.body}`.replace('</h1>',`</h1><h2>COUNTER: ${counter[browserType]}</h2>`)
        console.log(`${browserType} HTML`, url, counter[browserType]); 
        route.fulfill(resp);
      } else {
        route.continue();
      }
    });

    await page[browserType].goto('https://example.com');
    page[browserType].on('close', async () => {
      process.exit();
    });
  }
})();
