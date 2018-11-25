/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["2017/07/21/sublime-livereload完美在线编辑博客/index.html","523f2d77c807fd0612f811df8d1ee353"],["2017/08/10/python flask１/index.html","ec0f60693fe5147fd76a3c561b55b979"],["2017/08/11/python flask2/index.html","42aefc2142a4eda05314a74e153fba6a"],["2017/08/20/docker入门/index.html","a718f487f7e1e944b10471c29f57fc0f"],["2017/09/15/solr/index.html","b425abed46c6284a0cd56532cd50c081"],["2017/12/01/Meteor与mongodb数据库关联/index.html","a55e1ae21d9bb982188463af35f722fb"],["2017/12/04/Meteor添加账户及访问权限/index.html","c24ce6766c0184c3b3957e50e782d3ea"],["2017/12/07/shell定制脚本MODE/index.html","1ac4b16d83f3bff90d789fc17e0e6d54"],["2017/12/19/java并发基础1/index.html","3a29fb5fe2bc2747ebd140a6e14eefbb"],["2017/12/20/java并发基础2/index.html","77b1cc364d5ce0a1de34c4f3e542ccc5"],["2017/12/26/hexo-fixed-sidebartoc/index.html","2abe6c956338667e79f4f8a1f130c246"],["2017/12/30/线程不安全的数据结构总结/index.html","b5c3ff70f096d749aa0954e19483f85a"],["2018/01/31/数据库锁机制/index.html","bddb8b43a0c6b221c2d3f41b70422f8d"],["2018/02/01/快速排序优化/index.html","e85e4e2f3a230af284df7f3716ef4ac9"],["2018/03/02/ConcurrentHashMap/index.html","48597ef0991049ae960c96e0e9f00670"],["2018/03/08/Kubernetes/index.html","889bfae88d9f5b49da5c4756c6247d42"],["2018/04/08/java内存区域/index.html","eed4bf976e05017dbe50cd5852e9a6ab"],["2018/04/15/QUIC简介/index.html","891876e9a8325781537fd5761833647d"],["2018/04/16/进程和线程的区别/index.html","7c8c20026fcbf0c10cdc6bfbbebd90c5"],["2018/05/01/\b并发线程池/index.html","a7139e48f7aca7a1299b14a530c9854c"],["2018/07/21/@Slf4j注解的使用/index.html","c11c9185e6ff7b83089e4afc4134dabf"],["2018/07/28/Java中的代理/index.html","b6769353fb9bf968b10bfea9131dead4"],["2018/08/02/Java中的语法糖/index.html","def2e0a088c02439faf59da229331ac0"],["2018/08/10/数据库连接池/index.html","7fb70e9deb39509964b4d2d129b78f27"],["2018/08/19/kafka-demo1/index.html","146034597d7d79b32b64200a1b5449de"],["2018/08/20/redis-cluster/index.html","f497bb24e7777641884ac577debbba90"],["2018/08/28/java反编译之路/index.html","0a95ae9efe07fab5ad41ebe18176f3a3"],["2018/09/08/接口限流了解一下/index.html","7eab23b0757681db747a9e9206f2cfba"],["about/index.html","3617d24972b51792f45f058f7a17638b"],["archives/2017/07/index.html","c872722547dc5532a71f98c02adce588"],["archives/2017/08/index.html","519bd568727b35438c96ea4a83f2457e"],["archives/2017/09/index.html","46e80e864fd0fb0bba2eaf24ec6e04d3"],["archives/2017/12/index.html","c08f6df8d18ef7dea016e867b09ff723"],["archives/2017/index.html","00dacf470c2826e92a566c30b9f104a6"],["archives/2017/page/2/index.html","0352e68b958b294df191025a199d149a"],["archives/2018/01/index.html","3fecfed7b12988b3364089f328e81b5a"],["archives/2018/02/index.html","dd61aa34e11a9b46dbb3f743e4baded6"],["archives/2018/03/index.html","5d62ebc09f86ed4a29a0f284d5979471"],["archives/2018/04/index.html","67d74a8807121102f2f1dbe1eff97474"],["archives/2018/05/index.html","dc434ab9c2d1ae839011b1824a9ffb22"],["archives/2018/07/index.html","a12f9a023a8e11887d0189b5ed50f83d"],["archives/2018/08/index.html","04472a0813b7d374d13c685e9cff56de"],["archives/2018/09/index.html","e6fcc8245f01eb842db586ed98ee577f"],["archives/2018/index.html","4fc952a82f47fd932efe0795080e5c01"],["archives/2018/page/2/index.html","52dcd8c05ed56c2234f93d88ef42ec4e"],["archives/index.html","570ff0f91c2e5234c47a2d122746eed6"],["archives/page/2/index.html","90c42809e79e28aa4c3068a1db749400"],["archives/page/3/index.html","6f899b10d9e4fee6ea18a0b21f25a73d"],["categories/IDE/index.html","beb885a5458428594ca4a8d7026901d7"],["categories/Java/index.html","3d6b461665ec3066e559fb12422b1480"],["categories/Java/page/2/index.html","92d2fde353206c2824d9acdeca2e541f"],["categories/Python/index.html","683fd54ac3de943a00417ce560d5ec7f"],["categories/index.html","f1f794a528efdabb647de6ebaa383f86"],["categories/linux/index.html","399deddf886957f60fc9c6e8deb373b8"],["categories/前端/index.html","4796a5437cb5d9a7cc6b9b2bc7df097f"],["categories/容器云/index.html","9dcbcb737f1b4d7251cf8ead7a35fdda"],["categories/搜索引擎/index.html","b30b65049f98cf42bedb07e6c2c2a153"],["categories/操作系统/index.html","468a30183bb4ff99c4b319a48b657667"],["categories/数据库/index.html","8cccec00f7f868053542c24c173bed96"],["categories/消息队列/index.html","2e73c1f74f793075b10e55f7d2d9824b"],["categories/算法/index.html","c383f79d11dc852b2677861c62fe6667"],["categories/计算机网络/index.html","9b1fc6d989abf1106945a4b828ed79c9"],["css/style.css","d4367be64a13331d173aba9aa54ea7dd"],["fancybox/blank.gif","325472601571f31e1bf00674c368d335"],["fancybox/fancybox_loading.gif","e14dca13d1d24c7cdf89f8c7b20d57dc"],["fancybox/fancybox_loading@2x.gif","5bafaeb221caf96cf68f94654d2e19a7"],["fancybox/fancybox_overlay.png","a6cb983e06029eecd067b666edd4d3d2"],["fancybox/fancybox_sprite.png","783d4031fe50c3d83c960911e1fbc705"],["fancybox/fancybox_sprite@2x.png","4ac188774675ee61485cfa8cd5b8ca8d"],["fancybox/helpers/fancybox_buttons.png","b448080f8615e664b7788c7003803b59"],["fancybox/helpers/jquery.fancybox-buttons.css","990b91c524c7b760d505c1eb7304ade6"],["fancybox/helpers/jquery.fancybox-buttons.js","4dc5549322963d427e08c2018eeb07db"],["fancybox/helpers/jquery.fancybox-media.js","b0790f009f03a0bd69fb953e6cb1095d"],["fancybox/helpers/jquery.fancybox-thumbs.css","5133d80120a238ef7fa4cbe43e8b9f02"],["fancybox/helpers/jquery.fancybox-thumbs.js","07630448faebd062f3e0ff272cfa97b9"],["fancybox/jquery.fancybox.css","bc83f93a843485372a8ed14ae96c0cd2"],["fancybox/jquery.fancybox.js","fe3090b83a35e89c5cac2d79c3f29e7c"],["fancybox/jquery.fancybox.pack.js","44e45446de7cdbe062dd1599ba7dde77"],["font/coveredbyyourgrace-webfont.eot","4e6c56beb324d6be3cfaf20f239c1e6e"],["font/coveredbyyourgrace-webfont.svg","46661d6d65debc63884004fed6e37e5c"],["font/coveredbyyourgrace-webfont.ttf","0621a449356138817ff8e16cf5046a64"],["font/coveredbyyourgrace-webfont.woff","c04c2f5fa3220add6d590926d5d01b10"],["font/fontawesome-webfont.eot","8b27bc96115c2d24350f0d09e6a9433f"],["font/fontawesome-webfont.svg","46661d6d65debc63884004fed6e37e5c"],["font/fontawesome-webfont.ttf","dcb26c7239d850266941e80370e207c1"],["font/fontawesome-webfont.woff","3293616ec0c605c7c2db25829a0a509e"],["font/fontdiao.eot","bfc3bbc33eb59f2740df3f378eec1719"],["font/fontdiao.svg","46661d6d65debc63884004fed6e37e5c"],["font/fontdiao.ttf","590e30d2c52494739d0b22d31651e15a"],["font/fontdiao.woff","bdd0416608605b9077a512bb52c153f6"],["guestbook/index.html","ee92ed0495aabc841c1eb0cd9b3c5a16"],["img/banner.jpg","103cbf3fe541b3b9114088f328b9f64a"],["img/cat.png","4be211a2bbbc8dcf3c375e6df4d12796"],["img/cc-by-nc-nd.svg","7b63a831458437feab01ec613164924e"],["img/cc-by-nc-sa.svg","3580192fdf9933fe562d67473f001357"],["img/cc-by-nc.svg","a268ab2299bb1d7ea25f59b06e682eca"],["img/cc-by-nd.svg","0d0f4b5bd3a4c8268fe5598055ce52f6"],["img/cc-by-sa.svg","fd23f07f000a7d8050ef8fc1e2ef3806"],["img/cc-by.svg","7caf7a276b6d1536224857c745770d2f"],["img/cc-zero.svg","dce4253fc5dc8e14809150f8bf005ca9"],["img/jacman.jpg","4a294813de8b1fa324b5599311d4b71d"],["img/logo.png","73bc2ebc907a36637d8c4ceba075a79f"],["img/logo.svg","525072e5bca929d9177436e69a0d8a9e"],["img/scrollup.png","62ee33e63fd96a448fd125b0d1b7f6f7"],["index.html","6f65c69ff128e56abb7d834320914b1d"],["js/gallery.js","89f6e0acab318d36c64c289bc5f25232"],["js/jquery-2.0.3.min.js","58a97c2e2195fd1cd3c3055f5cc02d0f"],["js/jquery.imagesloaded.min.js","1fd2cb4320a2c970931017710397d1b4"],["js/jquery.qrcode-0.12.0.min.js","ddb79e5abac8e281bbdd3cc48d8462cb"],["js/totop.js","80eea44cb3b73a4da94e0db8823c7332"],["page/2/index.html","1aac37ea686c27295a13763188ed18d6"],["page/3/index.html","181cc175f49b47adcd0c10095ae06202"],["tags/JVM/index.html","9447f7892b526639ebdf338373957bd5"],["tags/Kafka/index.html","28a47d967b5be012510c249dcf96fd9f"],["tags/Maven/index.html","6e7fc0750b7ce491394b152b9aeeb9a2"],["tags/Meteor/index.html","bec9770a04f60a746be31c6c61770afd"],["tags/SQL/index.html","ad6679bb7f6ed827076a84eeeda8c11d"],["tags/Solr/index.html","295286368df1322e7f14287369043c36"],["tags/Spring/index.html","498355ed5a3de29b74313c02b6d21e29"],["tags/TCP-UDP/index.html","3c988ad310e708a6d874e5aa9a64de4b"],["tags/Web技术/index.html","993655c8f4370635352fada2d7a36c98"],["tags/docker/index.html","0551277a67131c83d67a3abe552001a5"],["tags/hexo/index.html","292342a21dce8b0de09db46e06c6ca78"],["tags/index.html","6a93d6ce17d171a326ea2937136b5c30"],["tags/kubernetes/index.html","f4f8a2e76e74881f906116b979f24ba0"],["tags/mongodb/index.html","f425a5ce1a83f359b18a75894b942178"],["tags/redis/index.html","e0dae12920441ceeab95afff5b85831a"],["tags/shell脚本/index.html","922c80cd83660d4156f3e79217fdc03d"],["tags/sublime/index.html","67dfbcfc02540d3b5fbf43d69c37842a"],["tags/并发/index.html","209b377695d1534556629182295b42e4"],["tags/快速排序/index.html","8ff9c2b80db256e3d8d2abd3cd3e2d07"],["tags/线程与进程/index.html","42c33b44b0c9b0b59ddf56ff019d16bf"],["tags/连接池/index.html","70a102df5d7052e6b73604574b099588"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







