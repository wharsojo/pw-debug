const playwright = require('playwright');
const _fetch = require('make-fetch-happen');

const fetch = async function(url) {
  const _resp = await _fetch(url, {});
  const status = _resp.status;
  const headers = _resp.headers.raw();
  let body = await _resp.buffer();
  return {headers, status, body};
}
//https://web.dev/http-cache/
const host = 'www.keycdn.com/blog/cache-control-immutable';
// const host = 'mmistakes.github.io/jekyll-theme-skinny-bones';
// const host = 'jekyll.github.io/jekyll-admin'
// const host = 'getpoole.com';
// const host = 'keybr.com';

const counter = {chromium: 0, firefox: 0, webkit: 0};
const browser = {};
const context = {};
const page = {};

(async () => {
  for (const browserType of ['chromium', 'firefox', 'webkit']) {
    browser[browserType] = await playwright[browserType].launch({headless: false});
    context[browserType] = await browser[browserType].newContext({viewport: {width: 800, height: 1000}});
    page[browserType]    = await context[browserType].newPage();

    await context[browserType].route('**/*', async (route, request) => {
      const url = request.url();

      if (counter[browserType]>1 && url.match(/\.css/)) {
        const resp = await fetch(url);
        resp.body = `${resp.body}\nbody{background:green !important;}`;
        console.log(`${browserType} CSS Update!`, url, counter[browserType]);  
        route.fulfill(resp);
      } else if (url.match(`${host}\\/$`)) {
        const resp = await fetch(url);
        counter[browserType] += 1;
        resp.body = `${resp.body}`.replace('</h1>',`</h1><h2>COUNTER: ${counter[browserType]}</h2>`)
        console.log(`${browserType} HTML`, url, counter[browserType]); 
        route.fulfill(resp);
      } else {
        route.continue();
      }
    });

    await page[browserType].goto(`https://${host}/`);
    page[browserType].on('close', async () => {
      process.exit();
    });
  }
})();
