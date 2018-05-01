"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.MEDIA_TYPE_TEXT=exports.MEDIA_TYPE_JSON=exports.CONTENT_TYPE_HEADER=exports.AUTHORIZATION_HEADER=exports.ACCEPT_TYPE_HEADER=void 0;var _createClass=function(){function n(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,t,r){return t&&n(e.prototype,t),r&&n(e,r),e}}();function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}exports.readHeaders=readHeaders,exports.readContent=readContent,exports.errorHandler=errorHandler,require("isomorphic-fetch");var ACCEPT_TYPE_HEADER=exports.ACCEPT_TYPE_HEADER="Accept",AUTHORIZATION_HEADER=exports.AUTHORIZATION_HEADER="Authorization",CONTENT_TYPE_HEADER=exports.CONTENT_TYPE_HEADER="Content-Type",MEDIA_TYPE_JSON=exports.MEDIA_TYPE_JSON="application/json",MEDIA_TYPE_TEXT=exports.MEDIA_TYPE_TEXT="text/plain",CONTENT_TYPE_JSON=new RegExp(MEDIA_TYPE_JSON,"i");function readHeaders(e){if(e.headers.raw){var r=e.headers.raw();return Object.keys(r).reduce(function(e,t){return e[t]=Array.isArray(r[t])?r[t].join(", "):r[t],e},{})}return Array.from(e.headers.entries()).reduce(function(e,t){return e[t[0]]=t[1],e},{})}function readContent(e){return CONTENT_TYPE_JSON.test(e.headers.get(CONTENT_TYPE_HEADER))?e.json():e.text()}function errorHandler(r){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:readContent;return r.status<400?Promise.resolve(r):new Promise(function(e,t){return n(r).then(function(e){t({status:r.status,headers:readHeaders(r),content:e})})})}function doFetch(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},r=2<arguments.length&&void 0!==arguments[2]?arguments[2]:errorHandler,n=3<arguments.length&&void 0!==arguments[3]?arguments[3]:readContent;return fetch(e,t).then(function(e){return r(e,n)}).then(n)}function isJson(e){try{return JSON.parse(e),!0}catch(e){return!1}}var FuntchBuilder=function(){function e(){_classCallCheck(this,e),this.params={headers:{}}}return _createClass(e,[{key:"url",value:function(e){return this.url=e,this}},{key:"header",value:function(e,t){return this.params.headers[e]=t,this}},{key:"auth",value:function(e){return this.header(AUTHORIZATION_HEADER,e)}},{key:"contentJson",value:function(){return this.header(CONTENT_TYPE_HEADER,MEDIA_TYPE_JSON)}},{key:"contentText",value:function(){return this.header(CONTENT_TYPE_HEADER,MEDIA_TYPE_TEXT)}},{key:"guessContentType",value:function(e){return isJson(e)?this.contentJson():this.contentText()}},{key:"acceptJson",value:function(){return this.header(ACCEPT_TYPE_HEADER,MEDIA_TYPE_JSON)}},{key:"acceptText",value:function(){return this.header(ACCEPT_TYPE_HEADER,MEDIA_TYPE_TEXT)}},{key:"content",value:function(e){return this.readContent=e,this}},{key:"error",value:function(e){return this.errorHandler=e,this}},{key:"body",value:function(e){var t=!(1<arguments.length&&void 0!==arguments[1])||arguments[1];return void 0!==e&&(this.params.body=e,t&&!this.params.headers[CONTENT_TYPE_HEADER])?this.guessContentType(e):this}},{key:"get",value:function(){return this.params.method="GET",this.send()}},{key:"post",value:function(e){return this.body(e),this.params.method="POST",this.send()}},{key:"put",value:function(e){return this.body(e),this.params.method="PUT",this.send()}},{key:"patch",value:function(e){return this.body(e),this.params.method="PATCH",this.send()}},{key:"delete",value:function(){return this.params.method="DELETE",this.send()}},{key:"send",value:function(){return doFetch(this.url,this.params,this.errorHandler,this.readContent)}}]),e}(),funtch=function(){function e(){_classCallCheck(this,e)}return _createClass(e,null,[{key:"url",value:function(e){return(new FuntchBuilder).url(e)}},{key:"get",value:function(e){return(new FuntchBuilder).url(e).get()}},{key:"post",value:function(e,t){return(new FuntchBuilder).url(e).post(t)}},{key:"put",value:function(e,t){return(new FuntchBuilder).url(e).put(t)}},{key:"patch",value:function(e,t){return(new FuntchBuilder).url(e).patch(t)}},{key:"delete",value:function(e){return(new FuntchBuilder).url(e).delete()}}]),e}();exports.default=funtch;