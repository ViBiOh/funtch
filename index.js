!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("isomorphic-fetch")):"function"==typeof define&&define.amd?define(["exports","isomorphic-fetch"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).funtch={})}(this,function(t){"use strict";function e(e,t){var n,r=Object.keys(e);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(e),t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)),r}function n(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?e(Object(o),!0).forEach(function(t){var e,n;e=r,t=o[n=t],n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):e(Object(o)).forEach(function(t){Object.defineProperty(r,t,Object.getOwnPropertyDescriptor(o,t))})}return r}function u(t){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,e,n){return e&&r(t.prototype,e),n&&r(t,n),t}function a(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=t&&("undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"]);if(null!=n){var r,o,u=[],i=!0,a=!1;try{for(n=n.call(t);!(i=(r=n.next()).done)&&(u.push(r.value),!e||u.length!==e);i=!0);}catch(t){a=!0,o=t}finally{try{i||null==n.return||n.return()}finally{if(a)throw o}}return u}}(t,e)||function(t,e){if(t){if("string"==typeof t)return c(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Map"===(n="Object"===n&&t.constructor?t.constructor.name:n)||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?c(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function c(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var s="Accept",l="Authorization",f="Content-Type",h="application/json",y="text/plain",d=new RegExp(h,"i");function p(t){if(t.headers.raw){var n=t.headers.raw();return Object.keys(n).reduce(function(t,e){return t[e]=Array.isArray(n[e])?n[e].join(", "):n[e],t},{})}return Array.from(t.headers.entries()).reduce(function(t,e){return t[e[0]]=e[1],t},{})}function b(t){return Object.entries(t).filter(function(t){t=a(t,2)[1];return Boolean(t)}).map(function(t){var e=a(t,2),t=e[0],e=e[1];return"".concat(t,"=").concat(encodeURIComponent(e))}).join("&")}function v(e,t,n){return t(e).then(function(t){n({status:e.status,headers:p(e),data:t})})}function m(t){return d.test(t.headers.get(f))?t.json():t.text()}function g(){var n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:m;return function(e){return new Promise(function(t){return v(e,n,t)})}}function O(n){var r=1<arguments.length&&void 0!==arguments[1]?arguments[1]:m;return n.status<400?Promise.resolve(n):new Promise(function(t,e){return v(n,r,e)})}function k(t,e,n){var r=[],o=!!Array.isArray(e)&&e;return JSON.stringify(t,function(t,e){if(""===t||!o||-1!==o.indexOf(t)){if("object"===u(e)&&null!==e){if(-1!==r.indexOf(e))return"[Circular]";r.push(e)}return e}},n)}function w(t){try{return JSON.parse(t),!0}catch(t){return!1}}var T=function(){function r(t){var e,n=this;o(this,r),"undefined"!=typeof AbortController&&(this.controller=new AbortController,e=this.controller.signal),this.full=!1,this.queryParams={},this.params={headers:{},signal:e},t&&(this.baseURL=t.baseURL,t.headers&&Object.entries(t.headers).forEach(function(t){var e=a(t,2),t=e[0],e=e[1];return n.header(t,e)}),t.auth&&this.auth(t.auth),t.contentJson&&this.contentJson(),t.contentText&&this.contentText(),t.acceptJson&&this.acceptJson(),t.acceptText&&this.acceptText(),t.method&&this.method(t.method),t.query&&this.query(t.query),"function"==typeof t.contentHandler&&this.contentHandler(t.contentHandler),"function"==typeof t.errorHandler&&this.errorHandler(t.errorHandler),t.abortHandler&&this.abortHandler(t.abortHandler),t.fullResponse&&this.fullResponse())}return i(r,[{key:"url",value:function(t){return this.baseURL?this.url="".concat(this.baseURL).concat(t):this.url=t,this}},{key:"query",value:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};return this.queryParams=n(n({},this.queryParams),t),this}},{key:"header",value:function(t,e){return this.params.headers[t]=e,this}},{key:"auth",value:function(t){return this.header(l,t)}},{key:"contentJson",value:function(){return this.header(f,h)}},{key:"contentText",value:function(){return this.header(f,y)}},{key:"guessContentType",value:function(t){return w(t)?this.contentJson():this.contentText()}},{key:"acceptJson",value:function(){return this.header(s,h)}},{key:"acceptText",value:function(){return this.header(s,y)}},{key:"contentHandler",value:function(t){return this.content=t,this}},{key:"errorHandler",value:function(t){return this.error=t,this}},{key:"abortHandler",value:function(t){return this.abort=t,this}},{key:"fullResponse",value:function(){return this.full=!0,this}},{key:"body",value:function(t){var e=!(1<arguments.length&&void 0!==arguments[1])||arguments[1];if(void 0!==t){var n=t;if("object"===u(t)?n=k(t):"string"!=typeof t&&(n=String(t)),this.params.body=n,e&&!this.params.headers[f])return this.guessContentType(n)}return this}},{key:"method",value:function(t){return this.params.method=t,this}},{key:"get",value:function(t){return this.method("GET").query(t).send()}},{key:"post",value:function(t){return this.body(t).method("POST").send()}},{key:"put",value:function(t){return this.body(t).method("PUT").send()}},{key:"patch",value:function(t){return this.body(t).method("PATCH").send()}},{key:"delete",value:function(){return this.method("DELETE").send()}},{key:"send",value:function(){var t,e=this.url,n=this.content;return!this.queryParams||(t=b(this.queryParams))&&(-1===e.indexOf("?")?e+="?":e+="&",e+=t),this.full&&(n=g(n)),function(t,e,n,r,o){var u=3<arguments.length&&void 0!==r?r:m,i=4<arguments.length&&void 0!==o?o:O;return fetch(t,e).then(function(t){return i(t,u)}).then(u).catch(function(t){if("AbortError"!==t.name||!n)throw t;n(t)})}(e,this.params,this.abort,n,this.error)}},{key:"abort",value:function(){this.controller?this.controller.abort():console.warn("cannot abort fetch: no AbortController available.")}}]),r}(),j=function(){function t(){o(this,t)}return i(t,null,[{key:"withDefault",value:function(t){function n(){return new T(t)}return{url:function(t){return n().url(t)},get:function(t,e){return n().url(t).get(e)},post:function(t,e){return n().url(t).post(e)},put:function(t,e){return n().url(t).put(e)},patch:function(t,e){return n().url(t).patch(e)},delete:function(t){return n().url(t).delete()}}}},{key:"url",value:function(t){return(new T).url(t)}},{key:"get",value:function(t,e){return(new T).url(t).get(e)}},{key:"post",value:function(t,e){return(new T).url(t).post(e)}},{key:"put",value:function(t,e){return(new T).url(t).put(e)}},{key:"patch",value:function(t,e){return(new T).url(t).patch(e)}},{key:"delete",value:function(t){return(new T).url(t).delete()}}]),t}();t.ACCEPT_TYPE_HEADER=s,t.AUTHORIZATION_HEADER=l,t.CONTENT_TYPE_HEADER=f,t.MEDIA_TYPE_JSON=h,t.MEDIA_TYPE_TEXT=y,t.contentHandler=m,t.default=j,t.encode=b,t.errorHandler=O,t.fullContent=v,t.getReadContentFull=g,t.isJson=w,t.readHeaders=p,t.stringify=k,Object.defineProperty(t,"__esModule",{value:!0})});
