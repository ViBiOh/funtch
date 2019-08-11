!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("isomorphic-fetch")):"function"==typeof define&&define.amd?define(["exports","isomorphic-fetch"],t):t((e=e||self).funtch={})}(this,function(e){"use strict";function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function n(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}var u="Accept",i="Authorization",a="Content-Type",s="application/json",c="text/plain",f=new RegExp(s,"i");function h(e){if(e.headers.raw){var n=e.headers.raw();return Object.keys(n).reduce(function(e,t){return e[t]=Array.isArray(n[t])?n[t].join(", "):n[t],e},{})}return Array.from(e.headers.entries()).reduce(function(e,t){return e[t[0]]=t[1],e},{})}function l(e){return f.test(e.headers.get(a))?e.json():e.text()}function d(n){var r=1<arguments.length&&void 0!==arguments[1]?arguments[1]:l;return n.status<400?Promise.resolve(n):new Promise(function(e,t){return r(n).then(function(e){t({status:n.status,headers:h(n),content:e})})})}function y(e,t,n){var r=[],u=!!Array.isArray(t)&&t;return JSON.stringify(e,function(e,t){if(""===e||!u||-1!==u.indexOf(e)){if("object"===o(t)&&null!==t){if(-1!==r.indexOf(t))return"[Circular]";r.push(t)}return t}},n)}function p(e){try{return JSON.parse(e),!0}catch(e){return!1}}var v=function(){function e(){t(this,e),this.params={headers:{}}}return n(e,[{key:"url",value:function(e){return this.url=e,this}},{key:"header",value:function(e,t){return this.params.headers[e]=t,this}},{key:"auth",value:function(e){return this.header(i,e)}},{key:"contentJson",value:function(){return this.header(a,s)}},{key:"contentText",value:function(){return this.header(a,c)}},{key:"guessContentType",value:function(e){return p(e)?this.contentJson():this.contentText()}},{key:"acceptJson",value:function(){return this.header(u,s)}},{key:"acceptText",value:function(){return this.header(u,c)}},{key:"content",value:function(e){return this.readContent=e,this}},{key:"error",value:function(e){return this.errorHandler=e,this}},{key:"body",value:function(e,t){var n=!(1<arguments.length&&void 0!==t)||t;if(void 0!==e){var r=e;if("object"===o(e)?r=y(e):"string"!=typeof e&&(r=String(e)),this.params.body=r,n&&!this.params.headers[a])return this.guessContentType(r)}return this}},{key:"method",value:function(e){return this.params.method=e,this}},{key:"get",value:function(){return this.method("GET").send()}},{key:"post",value:function(e){return this.body(e).method("POST").send()}},{key:"put",value:function(e){return this.body(e).method("PUT").send()}},{key:"patch",value:function(e){return this.body(e).method("PATCH").send()}},{key:"delete",value:function(){return this.method("DELETE").send()}},{key:"send",value:function(){return function(e,t,n,r){var u=2<arguments.length&&void 0!==n?n:d,o=3<arguments.length&&void 0!==r?r:l;return fetch(e,1<arguments.length&&void 0!==t?t:{}).then(function(e){return u(e,o)}).then(o)}(this.url,this.params,this.errorHandler,this.readContent)}}]),e}(),m=function(){function e(){t(this,e)}return n(e,null,[{key:"url",value:function(e){return(new v).url(e)}},{key:"get",value:function(e){return(new v).url(e).get()}},{key:"post",value:function(e,t){return(new v).url(e).post(t)}},{key:"put",value:function(e,t){return(new v).url(e).put(t)}},{key:"patch",value:function(e,t){return(new v).url(e).patch(t)}},{key:"delete",value:function(e){return(new v).url(e).delete()}}]),e}();e.ACCEPT_TYPE_HEADER=u,e.AUTHORIZATION_HEADER=i,e.CONTENT_TYPE_HEADER=a,e.MEDIA_TYPE_JSON=s,e.MEDIA_TYPE_TEXT=c,e.default=m,e.errorHandler=d,e.isJson=p,e.readContent=l,e.readHeaders=h,e.stringify=y,Object.defineProperty(e,"__esModule",{value:!0})});
