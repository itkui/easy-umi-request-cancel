var K=Object.defineProperty,R=Object.defineProperties;var E=Object.getOwnPropertyDescriptors;var U=Object.getOwnPropertySymbols;var L=Object.prototype.hasOwnProperty,M=Object.prototype.propertyIsEnumerable;var C=(n,t,o)=>t in n?K(n,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):n[t]=o,g=(n,t)=>{for(var o in t||(t={}))L.call(t,o)&&C(n,o,t[o]);if(U)for(var o of U(t))M.call(t,o)&&C(n,o,t[o]);return n},b=(n,t)=>R(n,E(t));var p=(n,t,o)=>new Promise((f,y)=>{var m=s=>{try{h(o.next(s))}catch(w){y(w)}},d=s=>{try{h(o.throw(s))}catch(w){y(w)}},h=s=>s.done?f(s.value):Promise.resolve(s.value).then(m,d);h((o=o.apply(n,t)).next())});(function(n,t){typeof exports=="object"&&typeof module!="undefined"?module.exports=t():typeof define=="function"&&define.amd?define(t):(n=typeof globalThis!="undefined"?globalThis:n||self,n["easy-umi-request-cancel"]=t())})(this,function(){"use strict";const n=new Map,t=e=>{let r;if(!n.has(e))r=new AbortController,n.set(e,r);else{r=n.get(e);const{abort:l}=r;l.call(r),r=new AbortController,n.set(e,r)}return r},o=(e,r)=>{try{return new URL(e,r||(window&&window.location?window.location.origin:"/"))}catch(l){throw new TypeError("request url is invalid, or you can add prop like: { urlBase: 'http://localhost:8080' }")}},f=e=>{const{urlUnique:r="",url:l,urlBase:c}=e,{host:i,pathname:u="",search:a="",href:q}=o(l,c);if(r instanceof RegExp)return r.test(q)?r.toString():void 0;switch(r){case"":return q;case"host":return i;case"path":return i+u;case"search":return i+u+a;default:throw new RangeError(`urlUnique is invalid: ${r}`)}},y=e=>{const{urlUniqueList:r=[],url:l,urlUnique:c,urlBase:i}=e,u=f(e);for(const a of r){const q=f(b(g({},e),{url:a}));if(u===q)return d(a)}},m=e=>{const r=f(e);if(r)return d(r)},d=e=>Symbol.for(e),h=(e,r)=>{const l=e.errorHandler;e.errorHandler=c=>{if(r(c),l)l(c);else throw c}},s=(e,r)=>{const{cancelKey:l,urlUnique:c,urlUniqueList:i}=e;if(l)return d(l);if(i)return y(e);if(c)return m(e)},w=(e,r)=>{const{signal:l}=t(r);return e.signal=l,delete e.cancelKey,r};return(c,i)=>p(this,[c,i],function*({req:{options:e},req:r},l){const u=s(e,r.url);if(!u)return yield l();w(e,u),h(e,a=>{a.type!=="AbortError"&&n.delete(u)}),yield l(),n.delete(u)})});