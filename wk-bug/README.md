# Only Chromium browser behave expected to route.fulfill()

During development of [mitm-play](https://www.npmjs.com/package/mitm-play), I discover that only Chromium behave expected, other browsers failed. here is the scenario:
* user set some route logic 
* user browsing to keybr.com
* when first call to `css`, route will call `route.continue()`
* when next call to `css`, route will fetch and call `route.fullfill()`
  >(next call - user click browser refresh button)

Testing with 3 browsers:
* chromium - *expected* - some DOM element are hidden
* firefox - __failed__ - `context.route()` never get call
* webkit - __failed__ - `route.fulfill()` is ignored

