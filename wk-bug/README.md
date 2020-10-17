# Only Chromium browser behave expected to route.fulfill()

During development of mitm-play, I discover that only Chromium beharior was behave expected, other browser failed. here is the scenario:
* user set some route logic 
* user browsing to keybr.com
* when first call to `css`, route will continue the request to browser
* when next call to `css`, route will fetch and fullfill the request
  >(next call - user click browser refresh button)

Testing with 3 brewsers:
* chromium - expected - some DOM element are hidden
* firefox - failed - never come/call the routing fn
* webkit - failed - route.fulfill getting ignored

