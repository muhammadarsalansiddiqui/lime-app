"use strict";var precacheConfig=[["/lime-app/2273e3d8ad9264b7daa5bdbf8e6b47f8.png","2273e3d8ad9264b7daa5bdbf8e6b47f8"],["/lime-app/401d815dc206b8dc1b17cd0e37695975.png","401d815dc206b8dc1b17cd0e37695975"],["/lime-app/44a526eed258222515aa21eaffd14a96.png","44a526eed258222515aa21eaffd14a96"],["/lime-app/4f0283c6ce28e888000e978e537a6a56.png","4f0283c6ce28e888000e978e537a6a56"],["/lime-app/a6137456ed160d7606981aa57c559898.png","a6137456ed160d7606981aa57c559898"],["/lime-app/assets/icons/android-chrome-512x512.png","be45ba44e6ef2e79508e58c6eef64421"],["/lime-app/assets/icons/favicon-16x16.png","97ed2a83766587957b3827d955193864"],["/lime-app/assets/icons/mstile-150x150.png","0b416ec3d3193b7a073f699a0f54b4d7"],["/lime-app/bundle.3b1bc.js","4dda68ecc6e9452e76644b80361bb263"],["/lime-app/favicon.ico","94eae66bebbd6bbfe48a669f245048ac"],["/lime-app/index.html","dd63cbd4302165b4823289ac0503c3e4"],["/lime-app/manifest.json","4486c469ddb4c568bcac4cd0c4bc3b60"],["/lime-app/style.62357.css","c99d681d2adb4cdd7db9eca968a498ba"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,n){var t=new URL(e);return"/"===t.pathname.slice(-1)&&(t.pathname+=n),t.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(n){return new Response(n,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,n,t,a){var r=new URL(e);return a&&r.pathname.match(a)||(r.search+=(r.search?"&":"")+encodeURIComponent(n)+"="+encodeURIComponent(t)),r.toString()},isPathWhitelisted=function(e,n){if(0===e.length)return!0;var t=new URL(n).pathname;return e.some(function(e){return t.match(e)})},stripIgnoredUrlParameters=function(e,n){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return n.every(function(n){return!n.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var n=e[0],t=e[1],a=new URL(n,self.location),r=createCacheKey(a,hashParamName,t,!1);return[a.toString(),r]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(n){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!n.has(t)){var a=new Request(t,{credentials:"same-origin"});return fetch(a).then(function(n){if(!n.ok)throw new Error("Request for "+t+" returned a response with status "+n.status);return cleanResponse(n).then(function(n){return e.put(t,n)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var n=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(t){return Promise.all(t.map(function(t){if(!n.has(t.url))return e.delete(t)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var n,t=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);(n=urlsToCacheKeys.has(t))||(t=addDirectoryIndex(t,"index.html"),n=urlsToCacheKeys.has(t));!n&&"navigate"===e.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],e.request.url)&&(t=new URL("index.html",self.location).toString(),n=urlsToCacheKeys.has(t)),n&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(t)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(n){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,n),fetch(e.request)}))}});