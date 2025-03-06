var O=i=>i!==null&&typeof i=="object",ee=i=>O(i)&&i.constructor===Object,C=i=>typeof i=="string";var at=i=>typeof i=="number",k=i=>Array.isArray(i);var w=i=>typeof i=="function"||!1;var Ie=i=>typeof window>"u"?!0:i instanceof Element||i instanceof Document||i===window||i instanceof DocumentFragment;var lt=i=>{if(i==null)return!0;if(k(i)||C(i))return i.length===0;for(let e in i)if(i[e])return!1;return!0},He=i=>{if(i===null||typeof i!="object")return!1;let t=Object.getPrototypeOf(i).constructor.name;return!["Object","Array","Date","RegExp","Map","Set","Error","Uint8Array","Int8Array","Uint16Array","Int16Array","Uint32Array","Int32Array","Float32Array","Float64Array","BigInt64Array","BigUint64Array","NodeList"].includes(t)};var g=(i,e,t)=>{if(i==null)return i;let s=t?e.bind(t):e;if((O(i)||w(i))&&i.length!==void 0&&typeof i.length=="number"&&(i=Array.from(i)),k(i))for(let r=0;r<i.length&&s(i[r],r,i)!==!1;++r);else{let r=Object.keys(i);for(let n of r)if(s(i[n],n,i)===!1)break}return i};var Te=i=>i.replace(/([.*+?^=!:${}()|\[\]\/\\])/g,"\\$1"),St=i=>{let e={"&":"&amp","<":"&lt",">":"&gt",'"':"&quot","'":"&#39"},t=/[&<>"']/g,s=RegExp(t.source);return i&&s.test(i)?i.replace(t,r=>e[r]):i};var At=(i="")=>(i||"").replace(/\s+/g,"-").replace(/[^\w-]+/g,"").replace(/_/g,"-").toLowerCase(),Ct=i=>{if(i=parseInt(i,10),i===0)return"0";let e="",t="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";for(;i>0;)e=t[i%t.length]+e,i=Math.floor(i/t.length);return e};function Se(i,{prettify:e=!1,seed:t=305419896}={}){let o;if(i==null)o=new TextEncoder().encode("");else if(i&&i.toString===Object.prototype.toString&&typeof i=="object")try{o=new TextEncoder().encode(JSON.stringify(i))}catch(l){return console.error("Error serializing input",l),0}else o=new TextEncoder().encode(i.toString());let a;if(o.length<=8){a=t;for(let l=0;l<o.length;l++)a^=o[l],a=Math.imul(a,2654435761),a^=a>>>13}else{a=t;for(let l=0;l<o.length;l++)a=Math.imul(a^o[l],2654435761),a=a<<13|a>>>19,a=Math.imul(a,2246822519);a^=o.length}return a^=a>>>16,a=Math.imul(a,3266489917),a^=a>>>13,e?Ct(a>>>0):a>>>0}var wt=()=>{let i=Math.random()*1e15;return Ct(i)};var D=i=>i,Y=i=>w(i)?i:()=>i;var $t=i=>{if(O(i))return Object.keys(i)};var _t=(i,e)=>Object.fromEntries(Object.entries(i).filter(([t,s])=>e(s,t))),te=(i,e)=>Object.fromEntries(Object.entries(i).map(([t,s])=>[t,e(s,t)])),Rt=(i,...e)=>(e.forEach(t=>{let s,r;if(t)for(r in t)s=Object.getOwnPropertyDescriptor(t,r),s===void 0?i[r]=t[r]:Object.defineProperty(i,r,s)}),i);var Fe=i=>{if(k(i))return i;let e=[];return g(i,(t,s)=>{e.push({value:t,key:s})}),e},se=function(i,e=""){if(typeof e!="string")return;function t(o){let a=o.substring(0,o.indexOf("[")),l=parseInt(o.substring(o.indexOf("[")+1,o.indexOf("]")),10);return{key:a,index:l}}function s(o){let a=o.indexOf(".");if(a!==-1){let l=o.indexOf(".",a+1);if(l!==-1)return o.slice(0,l)}return o}if(i===null||!O(i))return;let r=e.split("."),n=i;for(let o=0;o<r.length;o++){if(n===null||!O(n))return;let a=r[o];if(a.includes("[")){let{key:l,index:f}=t(a);if(l in n&&k(n[l])&&f<n[l].length)n=n[l][f];else return}else if(a in n)n=n[a];else{let l=r.slice(o).join(".");if(l in n){n=n[l];break}else{let f=s(`${a}.${r[o+1]}`);if(f in n)n=n[f],o++;else return}}}return n};var H=(i,e,t={})=>{if(i===e)return!0;if(i&&e&&typeof i=="object"&&typeof e=="object"){if(i.constructor!==e.constructor)return!1;let s,r,n;if(Array.isArray(i)){if(s=i.length,s!=e.length)return!1;for(r=s;r--!==0;)if(!H(i[r],e[r]))return!1;return!0}if(i instanceof Map&&e instanceof Map){if(i.size!==e.size)return!1;for(r of i.entries())if(!e.has(r[0]))return!1;for(r of i.entries())if(!H(r[1],e.get(r[0])))return!1;return!0}if(i instanceof Set&&e instanceof Set){if(i.size!==e.size)return!1;for(r of i.entries())if(!e.has(r[0]))return!1;return!0}if(ArrayBuffer.isView(i)&&ArrayBuffer.isView(e)){if(s=i.length,s!=e.length)return!1;for(r=s;r--!==0;)if(i[r]!==e[r])return!1;return!0}if(i.constructor===RegExp)return i.source===e.source&&i.flags===e.flags;if(i.valueOf!==Object.prototype.valueOf)return i.valueOf()===e.valueOf();if(i.toString!==Object.prototype.toString)return i.toString()===e.toString();if(n=Object.keys(i),s=n.length,s!==Object.keys(e).length)return!1;for(r=s;r--!==0;)if(!Object.prototype.hasOwnProperty.call(e,n[r]))return!1;for(r=s;r--!==0;){let o=n[r];if(!H(i[o],e[o]))return!1}return!0}return i!==i&&e!==e};var me=i=>Array.from(new Set(i));var ge=(i=[],e=1)=>{let{length:t}=i;if(t)return e===1?i[t-1]:i.slice(Math.max(t-e,0))};var kt=(i=[],e)=>{let t;return g(i,(s,r)=>{if(e(s,r,i))return t=s,!1}),t},ye=(i=[],e)=>{let t=-1;return g(i,(s,r)=>{if(e(s,r,i))return t=r,!1}),t},Dt=(i=[],e)=>{let t=w(e)?e:r=>H(r,e),s=ye(i,t);return s>-1?(i.splice(s,1),!0):!1},A=(i,e=[])=>e.indexOf(i)>-1,Mt=(i,e,t=1)=>{e||(e=i,i=0);let s=e-i;return Array(s).fill(void 0).map((r,n)=>n*t+i)};var Cs=(i,e)=>i?.some?i.some(e):!1,Pt=Cs;var ws=58;var ct=(...i)=>{if(i.length===0)return[];if(i.length===1)return[...new Set(i[0])];let t=i.reduce((o,a)=>o+a.length,0)>=ws,[s,...r]=i,n=[...new Set(s)];if(t){let o=r.map(a=>new Set(a));return n.filter(a=>!o.some(l=>l.has(a)))}return n.filter(o=>!r.some(a=>a.includes(o)))};var Lt=i=>{let e=i?.key;if(!e)return"";let t="";i.ctrlKey&&e!=="Control"&&(t+="ctrl+"),i.altKey&&e!=="Alt"&&(t+="alt+"),i.shiftKey&&e!=="Shift"&&(t+="shift+"),i.metaKey&&e!=="Meta"&&(t+="meta+");let s={Control:"ctrl",Escape:"esc"," ":"space"};return e=e.replace("Arrow",""),t+=s[e]||e.toLowerCase(),t};var ie=(i,e=new Map)=>{if(!i||typeof i!="object")return i;if(e.has(i))return e.get(i);let t;if(i.nodeType&&"cloneNode"in i)t=i.cloneNode(!0),e.set(i,t);else if(i instanceof Date)t=new Date(i.getTime()),e.set(i,t);else if(i instanceof RegExp)t=new RegExp(i),e.set(i,t);else if(Array.isArray(i)){t=new Array(i.length),e.set(i,t);for(let s=0;s<i.length;s++)t[s]=ie(i[s],e)}else if(i instanceof Map){t=new Map,e.set(i,t);for(let[s,r]of i.entries())t.set(s,ie(r,e))}else if(i instanceof Set){t=new Set,e.set(i,t);for(let s of i)t.add(ie(s,e))}else if(i instanceof Object){t={},e.set(i,t);for(let[s,r]of Object.entries(i))t[s]=ie(r,e)}return t};var Ue=function(i,e="LLL",{locale:t="default",hour12:s=!0,timezone:r="UTC",...n}={}){if(isNaN(i.getTime()))return"Invalid Date";let o=new Date(i.getTime());r==="local"&&(r=Intl.DateTimeFormat().resolvedOptions().timeZone);let a=P=>P<10?`0${P}`:P,l={timeZone:r,year:"numeric",month:"long",day:"numeric",weekday:"long",hour:"numeric",minute:"numeric",second:"numeric",hour12:s,...n},h=new Intl.DateTimeFormat(t,l).formatToParts(o).reduce((P,S)=>(P[S.type]=S.value,P),{}),{year:c,month:u,day:m,weekday:p,hour:y,minute:x,second:d,dayPeriod:E}=h;y==="24"&&(y="00");let R=new Date(i.toLocaleString("en-US",{timeZone:r})),T={YYYY:c,YY:c.slice(-2),MMMM:u,MMM:u.slice(0,3),MM:a(R.getMonth()+1),M:R.getMonth()+1,DD:a(R.getDate()),D:R.getDate(),Do:m+["th","st","nd","rd"][m%10>3?0:(m%100-m%10!==10)*m%10],dddd:p,ddd:p.slice(0,3),HH:y.padStart(2,"0"),hh:s?(y%12||12).toString().padStart(2,"0"):y.padStart(2,"0"),h:s?(y%12||12).toString():y,mm:x,ss:d,a:s&&E?E.toLowerCase():""},U={LT:"h:mm a",LTS:"h:mm:ss a",L:"MM/DD/YYYY",l:"M/D/YYYY",LL:"MMMM D, YYYY",ll:"MMM D, YYYY",LLL:"MMMM D, YYYY h:mm a",lll:"MMM D, YYYY h:mm a",LLLL:"dddd, MMMM D, YYYY h:mm a",llll:"ddd, MMM D, YYYY h:mm a"};return e=e.trim(),(U[e]||e).replace(/\b(?:YYYY|YY|MMMM|MMM|MM|M|DD|D|Do|dddd|ddd|HH|hh|h|mm|ss|a)\b/g,P=>T[P]).replace(/\[(.+?)\]/g,(P,S)=>S).trim()};var Ae=(i,{errorType:e=Error,metadata:t={},onError:s=null,removeStackLines:r=1}={})=>{let n=new e(i);if(Object.assign(n,t),n.stack){let a=n.stack.split(`
`);a.splice(1,r),n.stack=a.join(`
`)}let o=()=>{throw typeof global.onError=="function"&&global.onError(n),n};typeof queueMicrotask=="function"?queueMicrotask(o):setTimeout(o,0)};var W=typeof window>"u",Ce=typeof window<"u";var B=(i="")=>i.replace(/-./g,e=>e[1].toUpperCase()),ae=(i="")=>i.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Ve=(i="")=>i.charAt(0).toUpperCase()+i.slice(1);var Nt=(i="")=>{let e=["the","a","an","and","but","for","at","by","from","to","in","on","of","or","nor","with","as"];if(C(i))return i.toLowerCase().split(" ").map((t,s)=>s===0||!e.includes(t)?t.charAt(0).toUpperCase()+t.slice(1):t).join(" ")},Ot=(i,{separator:e=", ",lastSeparator:t=" and ",oxford:s=!0,quotes:r=!1,transform:n=D}={})=>{if(!k(i)||i.length===0)return"";let o=i.map(f=>{let h=f;return w(n)&&(h=n(f)),r?`"${h}"`:h});if(o.length===1)return o[0];if(o.length===2)return o.join(t);let a=o.pop(),l=o.join(e);return s&&e.trim()!==t.trim()&&(l+=e.trim()),l+t+a};var ht=(i,e="")=>{e=e.toLowerCase();let t=(n,o)=>{if(n.type===CSSRule.STYLE_RULE)return`${o} ${n.selectorText} { ${n.style.cssText} }`;if(n.type===CSSRule.MEDIA_RULE||n.type===CSSRule.SUPPORTS_RULE)return`@${n.type===CSSRule.MEDIA_RULE?"media":"supports"} ${n.conditionText||""} { ${t(n.cssText,o)} }`;if(n.type===CSSRule.LAYER_STATEMENT_RULE||n.type==0&&n.cssRules){let a=[];return g(n.cssRules,l=>{a.push(t(l,o))}),`@layer ${n.name} { ${a.join(" ")} }`}else return n.cssText},s=new CSSStyleSheet;s.replaceSync(i);let r=[];return g(s.cssRules,n=>{r.push(t(n,e))}),r.join(`
`)};var ut=(i,e,{scopeSelector:t}={})=>{if(W)return;e||(e=document);let s=Se(i);if(e.cssHashes||(e.cssHashes=[]),e.cssHashes.includes(s))return;e.cssHashes.push(s);let r=new CSSStyleSheet;t&&(i=ht(i,t)),r.id=s,r.replaceSync(i),e.adoptedStyleSheets=[...e.adoptedStyleSheets,r]};var ze=globalThis,je=ze.ShadowRoot&&(ze.ShadyCSS===void 0||ze.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ht=Symbol(),It=new WeakMap,Be=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==Ht)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(je&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=It.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&It.set(t,e))}return e}toString(){return this.cssText}},qe=i=>new Be(typeof i=="string"?i:i+"",void 0,Ht);var pt=(i,e)=>{if(je)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),r=ze.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=t.cssText,i.appendChild(s)}},Ye=je?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return qe(t)})(i):i;var{is:$s,defineProperty:_s,getOwnPropertyDescriptor:Rs,getOwnPropertyNames:ks,getOwnPropertySymbols:Ds,getPrototypeOf:Ms}=Object,We=globalThis,Ft=We.trustedTypes,Ps=Ft?Ft.emptyScript:"",Ls=We.reactiveElementPolyfillSupport,we=(i,e)=>i,dt={toAttribute(i,e){switch(e){case Boolean:i=i?Ps:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},Vt=(i,e)=>!$s(i,e),Ut={attribute:!0,type:String,converter:dt,reflect:!1,hasChanged:Vt};Symbol.metadata??=Symbol("metadata"),We.litPropertyMetadata??=new WeakMap;var K=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Ut){if(t.state&&(t.attribute=!1),this._$Ei(),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(e,s,t);r!==void 0&&_s(this.prototype,e,r)}}static getPropertyDescriptor(e,t,s){let{get:r,set:n}=Rs(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get(){return r?.call(this)},set(o){let a=r?.call(this);n.call(this,o),this.requestUpdate(e,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ut}static _$Ei(){if(this.hasOwnProperty(we("elementProperties")))return;let e=Ms(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(we("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(we("properties"))){let t=this.properties,s=[...ks(t),...Ds(t)];for(let r of s)this.createProperty(r,t[r])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,r]of t)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let r=this._$Eu(t,s);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let r of s)t.unshift(Ye(r))}else e!==void 0&&t.push(Ye(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return pt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$EC(e,t){let s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:dt).toAttribute(t,s.type);this._$Em=e,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(e,t){let s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let n=s.getPropertyOptions(r),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:dt;this._$Em=r,this[r]=o.fromAttribute(t,n.type),this._$Em=null}}requestUpdate(e,t,s){if(e!==void 0){if(s??=this.constructor.getPropertyOptions(e),!(s.hasChanged??Vt)(this[e],t))return;this.P(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(e,t,s){this._$AL.has(e)||this._$AL.set(e,t),s.reflect===!0&&this._$Em!==e&&(this._$Ej??=new Set).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,n]of s)n.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],n)}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EU()}catch(s){throw e=!1,this._$EU(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&=this._$Ej.forEach(t=>this._$EC(t,this[t])),this._$EU()}updated(e){}firstUpdated(e){}};K.elementStyles=[],K.shadowRootOptions={mode:"open"},K[we("elementProperties")]=new Map,K[we("finalized")]=new Map,Ls?.({ReactiveElement:K}),(We.reactiveElementVersions??=[]).push("2.0.4");var mt=globalThis,Ge=mt.trustedTypes,zt=Ge?Ge.createPolicy("lit-html",{createHTML:i=>i}):void 0,gt="$lit$",X=`lit$${Math.random().toFixed(9).slice(2)}$`,yt="?"+X,Ns=`<${yt}>`,he=document,_e=()=>he.createComment(""),Re=i=>i===null||typeof i!="object"&&typeof i!="function",xt=Array.isArray,Gt=i=>xt(i)||typeof i?.[Symbol.iterator]=="function",ft=`[ 	
\f\r]`,$e=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Bt=/-->/g,jt=/>/g,le=RegExp(`>|${ft}(?:([^\\s"'>=/]+)(${ft}*=${ft}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),qt=/'/g,Yt=/"/g,Kt=/^(?:script|style|textarea|title)$/i,bt=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),Et=bt(1),Xt=bt(2),mr=bt(3),j=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Wt=new WeakMap,ce=he.createTreeWalker(he,129);function Jt(i,e){if(!xt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return zt!==void 0?zt.createHTML(e):e}var Zt=(i,e)=>{let t=i.length-1,s=[],r,n=e===2?"<svg>":e===3?"<math>":"",o=$e;for(let a=0;a<t;a++){let l=i[a],f,h,c=-1,u=0;for(;u<l.length&&(o.lastIndex=u,h=o.exec(l),h!==null);)u=o.lastIndex,o===$e?h[1]==="!--"?o=Bt:h[1]!==void 0?o=jt:h[2]!==void 0?(Kt.test(h[2])&&(r=RegExp("</"+h[2],"g")),o=le):h[3]!==void 0&&(o=le):o===le?h[0]===">"?(o=r??$e,c=-1):h[1]===void 0?c=-2:(c=o.lastIndex-h[2].length,f=h[1],o=h[3]===void 0?le:h[3]==='"'?Yt:qt):o===Yt||o===qt?o=le:o===Bt||o===jt?o=$e:(o=le,r=void 0);let m=o===le&&i[a+1].startsWith("/>")?" ":"";n+=o===$e?l+Ns:c>=0?(s.push(f),l.slice(0,c)+gt+l.slice(c)+X+m):l+X+(c===-2?a:m)}return[Jt(i,n+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},ke=class i{constructor({strings:e,_$litType$:t},s){let r;this.parts=[];let n=0,o=0,a=e.length-1,l=this.parts,[f,h]=Zt(e,t);if(this.el=i.createElement(f,s),ce.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(r=ce.nextNode())!==null&&l.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(let c of r.getAttributeNames())if(c.endsWith(gt)){let u=h[o++],m=r.getAttribute(c).split(X),p=/([.?@])?(.*)/.exec(u);l.push({type:1,index:n,name:p[2],strings:m,ctor:p[1]==="."?Xe:p[1]==="?"?Je:p[1]==="@"?Ze:pe}),r.removeAttribute(c)}else c.startsWith(X)&&(l.push({type:6,index:n}),r.removeAttribute(c));if(Kt.test(r.tagName)){let c=r.textContent.split(X),u=c.length-1;if(u>0){r.textContent=Ge?Ge.emptyScript:"";for(let m=0;m<u;m++)r.append(c[m],_e()),ce.nextNode(),l.push({type:2,index:++n});r.append(c[u],_e())}}}else if(r.nodeType===8)if(r.data===yt)l.push({type:2,index:n});else{let c=-1;for(;(c=r.data.indexOf(X,c+1))!==-1;)l.push({type:7,index:n}),c+=X.length-1}n++}}static createElement(e,t){let s=he.createElement("template");return s.innerHTML=e,s}};function ue(i,e,t=i,s){if(e===j)return e;let r=s!==void 0?t._$Co?.[s]:t._$Cl,n=Re(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),n===void 0?r=void 0:(r=new n(i),r._$AT(i,t,s)),s!==void 0?(t._$Co??=[])[s]=r:t._$Cl=r),r!==void 0&&(e=ue(i,r._$AS(i,e.values),r,s)),e}var Ke=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,r=(e?.creationScope??he).importNode(t,!0);ce.currentNode=r;let n=ce.nextNode(),o=0,a=0,l=s[0];for(;l!==void 0;){if(o===l.index){let f;l.type===2?f=new xe(n,n.nextSibling,this,e):l.type===1?f=new l.ctor(n,l.name,l.strings,this,e):l.type===6&&(f=new Qe(n,this,e)),this._$AV.push(f),l=s[++a]}o!==l?.index&&(n=ce.nextNode(),o++)}return ce.currentNode=he,r}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},xe=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,r){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ue(this,e,t),Re(e)?e===b||e==null||e===""?(this._$AH!==b&&this._$AR(),this._$AH=b):e!==this._$AH&&e!==j&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Gt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==b&&Re(this._$AH)?this._$AA.nextSibling.data=e:this.T(he.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=ke.createElement(Jt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(t);else{let n=new Ke(r,this),o=n.u(this.options);n.p(t),this.T(o),this._$AH=n}}_$AC(e){let t=Wt.get(e.strings);return t===void 0&&Wt.set(e.strings,t=new ke(e)),t}k(e){xt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,r=0;for(let n of e)r===t.length?t.push(s=new i(this.O(_e()),this.O(_e()),this,this.options)):s=t[r],s._$AI(n),r++;r<t.length&&(this._$AR(s&&s._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e&&e!==this._$AB;){let s=e.nextSibling;e.remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},pe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,r,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(e,t=this,s,r){let n=this.strings,o=!1;if(n===void 0)e=ue(this,e,t,0),o=!Re(e)||e!==this._$AH&&e!==j,o&&(this._$AH=e);else{let a=e,l,f;for(e=n[0],l=0;l<n.length-1;l++)f=ue(this,a[s+l],t,l),f===j&&(f=this._$AH[l]),o||=!Re(f)||f!==this._$AH[l],f===b?e=b:e!==b&&(e+=(f??"")+n[l+1]),this._$AH[l]=f}o&&!r&&this.j(e)}j(e){e===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Xe=class extends pe{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===b?void 0:e}},Je=class extends pe{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==b)}},Ze=class extends pe{constructor(e,t,s,r,n){super(e,t,s,r,n),this.type=5}_$AI(e,t=this){if((e=ue(this,e,t,0)??b)===j)return;let s=this._$AH,r=e===b&&s!==b||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==b&&(s===b||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Qe=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){ue(this,e)}},Qt={M:gt,P:X,A:yt,C:1,L:Zt,R:Ke,D:Gt,V:ue,I:xe,H:pe,N:Je,U:Ze,B:Xe,F:Qe},Os=mt.litHtmlPolyfillSupport;Os?.(ke,xe),(mt.litHtmlVersions??=[]).push("3.2.1");var es=(i,e,t)=>{let s=t?.renderBefore??e,r=s._$litPart$;if(r===void 0){let n=t?.renderBefore??null;s._$litPart$=r=new xe(e.insertBefore(_e(),n),n,void 0,t??{})}return r._$AI(i),r};var J=class extends K{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=es(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return j}};J._$litElement$=!0,J.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:J});var Is=globalThis.litElementPolyfillSupport;Is?.({LitElement:J});(globalThis.litElementVersions??=[]).push("4.1.1");var De=class i{static DEBUG_MODE=!0;constructor(e){this.input=e,this.pos=0}matches(e){return e.test(this.rest())}rest(){return this.input.slice(this.pos)}step(e=1){this.isEOF()||(this.pos=this.pos+e)}rewind(e=1){this.pos!==0&&(this.pos=this.pos-e)}isEOF(){return this.pos>=this.input.length}peek(){return this.input.charAt(this.pos)}consume(e){let t=typeof e=="string"?new RegExp(Te(e)):new RegExp(e),s=this.input.substring(this.pos),r=t.exec(s);return r&&r.index===0?(this.pos+=r[0].length,r[0]):null}consumeUntil(e){let s=(typeof e=="string"?new RegExp(Te(e)):new RegExp(e)).exec(this.input.substring(this.pos));if(!s){let n=this.input.substr(this.pos);return this.pos=this.input.length,n}let r=this.input.substring(this.pos,this.pos+s.index);return this.pos+=s.index,r}returnTo(e){if(!e)return;let t=typeof e=="string"?new RegExp(Te(e),"gm"):new RegExp(e,"gm"),s=null,r,n=this.input.substring(0,this.pos);for(;(r=t.exec(n))!==null;)s=r;if(s){let o=this.input.substring(0,s.index);return this.pos=s.index,o}}getContext(){let e=!1,t=this.pos-1,s;for(;t>=0&&this.input[t]!==">";){if(this.input[t]==="<"){e=!0,s=t;break}t--}if(e){let r=this.input.substring(s,this.pos),n=/([a-zA-Z-]+)(?=\s*=\s*[^=]*$)/,o=r.match(n),a=o?o[1]:"",l=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","defer","disabled","formnovalidate","inert","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected"],f=!1;if(l.includes(a))f=!0;else{let h=/([a-zA-Z-]+)(?=\s*=\s*(\"|\')\s*[^=]*$)/,c=r.match(h),u=c?c[1]:"";f=a!==u}if(a)return{insideTag:!0,attribute:a,booleanAttribute:f}}return{insideTag:e}}fatal(e){e=e||"Parse error";let s=(typeof this.input=="string"?this.input:"").split(`
`),r=0,n=0;for(let p of s){if(n+p.length+1>this.pos)break;n+=p.length+1,r++}let o=5,a=5,l=Math.max(0,r-o),f=Math.min(s.length,r+a+1),h=s.slice(l,f),c=h.map((p,y)=>`%c${p}`).join(`
`),u="color: grey",m="color: red; font-weight: bold";if(i.DEBUG_MODE){if(globalThis.document){let y="";g(h,(d,E)=>{let R=E<o||E>o?u:m;y+=`<div style="${R}">${d}</div>`});let x=`
          <div style="padding: 1rem; font-size: 14px;">
            <h2>Could not render template</h2>
            <h3>${e}</h3>
            <code style="margin-top: 1rem; display: block; background-color: #EFEFEF; padding: 0.25rem 1rem;border-left: 3px solid #888"><pre>${y}</pre></code>
          </div>
        `;document.body.innerHTML=x}throw console.error(e+`
`+c,...h.map((y,x)=>r-l===x?m:u)),new Error(e)}}};var de=class i{constructor(e){this.templateString=e||"",this.snippets={}}static singleBracketRegExp={IF:/^{\s*#if\s+/,ELSEIF:/^{\s*else\s*if\s+/,ELSE:/^{\s*else\s*/,EACH:/^{\s*#each\s+/,SNIPPET:/^{\s*#snippet\s+/,CLOSE_IF:/^{\s*\/(if)\s*/,CLOSE_EACH:/^{\s*\/(each)\s*/,CLOSE_SNIPPET:/^{\s*\/(snippet)\s*/,SLOT:/^{>\s*slot\s*/,TEMPLATE:/^{>\s*/,HTML_EXPRESSION:/^{\s*#html\s*/,EXPRESSION:/^{\s*/};static singleBracketParserRegExp={NEXT_TAG:/(\{|\<svg|\<\/svg)/,EXPRESSION_START:/\{/,EXPRESSION_END:/\}/,TAG_CLOSE:/\>/};static doubleBracketRegExp={IF:/^{{\s*#if\s+/,ELSEIF:/^{{\s*else\s*if\s+/,ELSE:/^{{\s*else\s*/,EACH:/^{{\s*#each\s+/,SNIPPET:/^{{\s*#snippet\s+/,CLOSE_IF:/^{{\s*\/(if)\s*/,CLOSE_EACH:/^{{\s*\/(each)\s*/,CLOSE_SNIPPET:/^{{\s*\/(snippet)\s*/,SLOT:/^{{>\s*slot\s*/,TEMPLATE:/^{{>\s*/,HTML_EXPRESSION:/^{{\s*#html\s*/,EXPRESSION:/^{{\s*/};static doubleBracketParserRegExp={NEXT_TAG:/(\{\{|\<svg|\<\/svg)/,EXPRESSION_START:/\{\{/,EXPRESSION_END:/\}\}/,TAG_CLOSE:/\>/};static htmlRegExp={SVG_OPEN:/^\<svg\s*/i,SVG_CLOSE:/^\<\/svg\s*/i};static preprocessRegExp={WEB_COMPONENT_SELF_CLOSING:/<(\w+-\w+)([^>]*)\/>/g};static templateRegExp={VERBOSE_KEYWORD:/^(template|snippet)\W/g,VERBOSE_PROPERTIES:/(\w+)\s*=\s*(((?!\w+\s*=).)+)/gms,STANDARD:/(\w+)\s*=\s*((?:(?!\n|$|\w+\s*=).)+)/g,DATA_OBJECT:/(\w+)\s*:\s*([^,}]+)/g,SINGLE_QUOTES:/\'/g};compile(e=this.templateString){e=i.preprocessTemplate(e);let t=new De(e);C(e)||t.fatal("Template is not a string",e);let{htmlRegExp:s}=i,r=i.detectSyntax(e),n=r=="doubleBracket"?i.doubleBracketRegExp:i.singleBracketRegExp,o=r=="doubleBracket"?i.doubleBracketParserRegExp:i.singleBracketParserRegExp,a=p=>{let y=()=>{if(p.peek()=="}"){p.consumeUntil(o.EXPRESSION_END);return}let x=1,d=p.peek();for(;x>0&&!p.isEOF();){if(p.step(),p.peek()=="{"&&x++,p.peek()=="}"&&x--,x==0){p.rewind();break}d+=p.peek()}return p.consumeUntil(o.EXPRESSION_END),p.consume(o.EXPRESSION_END),d=d.trim(),d};for(let x in n)if(p.matches(n[x])){let d=p.getContext();p.consume(n[x]);let E=y();p.consume(o.EXPRESSION_END);let R=this.getValue(E);return{type:x,content:R,...d}}for(let x in s)if(p.matches(s[x])){p.consume(s[x]);let d=p.getContext(),E=this.getValue(p.consumeUntil(o.TAG_CLOSE).trim());return p.consume(o.TAG_CLOSE),{type:x,content:E,...d}}return null},l=[],f=[],h=null,c=[],u=[];for(;!t.isEOF();){let p=a(t),y=ge(c),x=h?.content||l;if(p){let d={type:p.type.toLowerCase()};switch(p.type){case"IF":d={...d,condition:p.content,content:[],branches:[]},x.push(d),c.push(d),u.push(d),h=d;break;case"ELSEIF":d={...d,condition:p.content,content:[]},y||(t.returnTo(n.ELSEIF),t.fatal("{{elseif}} encountered without matching if condition")),u.pop(),u.push(d),y.branches.push(d),h=d;break;case"ELSE":if(d={...d,content:[]},!y){t.returnTo(n.ELSE),t.fatal("{{else}} encountered without matching if or each condition");break}y.type==="if"?(u.pop(),u.push(d),y.branches.push(d),h=d):y.type==="each"?(u.pop(),u.push(d),y.else=d,h=d):(t.returnTo(n.ELSE),t.fatal("{{else}} encountered with unknown condition type: "+y.type));break;case"CLOSE_IF":c.length==0&&(t.returnTo(n.CLOSE_IF),t.fatal("{{/if}} close tag found without open if tag")),f.pop(),u.pop(),c.pop(),h=ge(u);break;case"SNIPPET":d={...d,type:"snippet",name:p.content,content:[]},this.snippets[p.content]=d,x.push(d),c.push(d),u.push(d),h=d;break;case"CLOSE_SNIPPET":c.length==0&&(t.returnTo(n.CLOSE_IF),t.fatal("{{/snippet}} close tag found without open if tag")),f.pop(),u.pop(),h=ge(u);break;case"HTML_EXPRESSION":d={...d,type:"expression",unsafeHTML:!0,value:p.content},x.push(d),t.consume("}");break;case"EXPRESSION":d={...d,value:p.content},p.booleanAttribute&&(d.ifDefined=!0),x.push(d);break;case"TEMPLATE":let E=this.parseTemplateString(p.content);d={...d,...E},x.push(d);break;case"SLOT":d={...d,name:p.content},x.push(d);break;case"EACH":let R,T,U,V=p.content.split(" in "),P=p.content.split(" as ");if(V.length>1){let S=V[0].trim();R=V[1].trim();let z=S.indexOf(",");z!==-1?(T=S.substring(0,z).trim(),U=S.substring(z+1).trim()):T=S}else if(P.length>1){R=P[0].trim();let S=P[1].trim(),z=S.indexOf(",");z!==-1?(T=S.substring(0,z).trim(),U=S.substring(z+1).trim()):T=S}else R=p.content.trim();d={...d,over:R,content:[]},T&&(d.as=T),U&&(d.indexAs=U),u.push(d),c.push(d),x.push(d),h=d;break;case"CLOSE_EACH":f.pop(),u.pop(),c.pop(),h=ge(u);break;case"SVG_OPEN":x.push({type:"html",html:"<svg "}),x.push(...this.compile(p.content)),x.push({type:"html",html:">"}),d={type:"svg",content:[]},u.push(d),x.push(d),h=d;break;case"SVG_CLOSE":f.pop(),u.pop(),h=ge(u),d={type:"html",html:"</svg>"},(h||l).push(d);break}}else{let d=t.consumeUntil(o.NEXT_TAG);if(d){let E={type:"html",html:d};x.push(E)}}}return i.optimizeAST(l)}getValue(e){return e=="true"?!0:e=="false"?!1:C(e)&&e.trim()!==""&&Number.isFinite(+e)?Number(e):e}parseTemplateString(e=""){let t=i.templateRegExp,s={};if(t.VERBOSE_KEYWORD.lastIndex=0,t.VERBOSE_KEYWORD.test(e)){let r=[...e.matchAll(t.VERBOSE_PROPERTIES)];g(r,(n,o)=>{let a=n[1],l=i.getObjectFromString(n[2]);s[a]=l})}else{let r={},n=e.split(/\b/)[0];s.name=`'${n}'`;let o=[...e.matchAll(t.STANDARD)];g(o,(a,l)=>{let f=a[1].trim(),h=a[2].trim();r[f]=h}),s.reactiveData=r}return s}static getObjectFromString(e=""){let t=i.templateRegExp.DATA_OBJECT,s={},r,n=!1;for(;(r=t.exec(e))!==null;)n=!0,s[r[1]]=r[2].trim();return n?s:e.trim()}static detectSyntax(e=""){let t=e.search(/{{\s*/),s=e.search(/{[^{]\s*/);return t!==-1&&t<s?"doubleBracket":"singleBracket"}static preprocessTemplate(e=""){return e=e.trim(),e=e.replace(i.preprocessRegExp.WEB_COMPONENT_SELF_CLOSING,(t,s,r)=>`<${s}${r}></${s}>`),e}static optimizeAST(e){let t=[],s=null,r=n=>{n.type==="html"?s?s.html+=n.html:(s={...n},t.push(s)):(s&&(s=null),Array.isArray(n.content)&&(n.content=this.optimizeAST(n.content)),n.else&&n.else.content&&(n.else.content=this.optimizeAST(n.else.content)),t.push(n))};return e.forEach(r),t}};var et=class i{static globalThisProxy=new Proxy({},{get(e,t){return globalThis[t]},set(e,t,s){return globalThis[t]=s,!0}});static eventHandlers=[];constructor(e,{root:t=document,pierceShadow:s=!1}={}){let r=[];if(t){if(e===window||e===globalThis||A(e,["window","globalThis"])||e==i.globalThisProxy)r=[i.globalThisProxy],this.isBrowser=Ce,this.isGlobal=!0;else if(k(e)||e instanceof NodeList||e instanceof HTMLCollection)e=Array.from(e),r=e;else if(C(e))if(e.trim().slice(0,1)=="<"){let n=document.createElement("template");n.innerHTML=e.trim(),r=Array.from(n.content.childNodes)}else r=s?this.querySelectorAllDeep(t,e):t.querySelectorAll(e);else Ie(e)?r=[e]:e instanceof NodeList&&(r=e);this.selector=e,this.length=r.length,this.options={root:t,pierceShadow:s},Object.assign(this,r)}}chain(e){return this.isGlobal&&!e?new i(globalThis,this.options):new i(e,this.options)}querySelectorAllDeep(e,t,s=!0){let r=[],n=Ie(t),o=!1,a;s&&(n&&e==t||e.matches&&e.matches(t))&&r.push(e),n?a=!0:e.querySelectorAll?(r.push(...e.querySelectorAll(t)),a=!0):a=!1;let l=(c,u)=>{n&&(c===u||c.contains)?c.contains(u)&&(r.push(u),o=!0):c.querySelectorAll&&r.push(...c.querySelectorAll(u))},f=(c,u)=>{let m=u.split(" "),p,y;return g(m,(x,d)=>{if(p=m.slice(0,d+1).join(" "),c.matches(p)){y=m.slice(d+1).join(" ");return}}),y||u},h=(c,u,m)=>{o||(m===!0&&(l(c,u),a=!0),c.nodeType===Node.ELEMENT_NODE&&c.shadowRoot&&(u=f(c,u),l(c.shadowRoot,u),h(c.shadowRoot,u,!a)),c.assignedNodes&&(u=f(c,u),c.assignedNodes().forEach(p=>h(p,u,a))),c.childNodes.length&&c.childNodes.forEach(p=>h(p,u,a)))};return h(e,t),[...new Set(r)]}each(e){for(let t=0;t<this.length;t++){let s=this[t],r=this.chain(s);e.call(r,s,t)}return this}removeAllEvents(){i.eventHandlers=[]}find(e){let t=Array.from(this).flatMap(s=>this.options.pierceShadow?this.querySelectorAllDeep(s,e,!1):Array.from(s.querySelectorAll(e)));return this.chain(t)}parent(e){let t=Array.from(this).map(s=>s.parentElement).filter(Boolean);return e?this.chain(t).filter(e):this.chain(t)}children(e){let t=Array.from(this).flatMap(r=>Array.from(r.children)),s=e?t.filter(r=>r.matches(e)):t;return this.chain(s)}siblings(e){let t=Array.from(this).flatMap(s=>{if(s.parentNode)return Array.from(s.parentNode.children).filter(r=>r!==s)}).filter(Boolean);return e?this.chain(t).filter(e):this.chain(t)}index(e){let t=this.el();if(!t?.parentNode)return-1;let r=this.chain(t.parentNode.children).filter(e).get(),n=this.get();return ye(r,o=>A(o,n))}indexOf(e){let t=this.get(),s=this.filter(e).get(0);return t.indexOf(s)}filter(e){if(!e)return this;let t=[];return w(e)?t=Array.from(this).filter(e):t=Array.from(this).filter(s=>{if(C(e))return s.matches&&s.matches(e);if(e instanceof i)return e.get().includes(s);{let r=k(e)?e:[e];return A(s,r)}}),this.chain(t)}is(e){return Array.from(this).filter(s=>typeof e=="string"?s.matches&&s.matches(e):this.isGlobal?A(e,["window","globalThis"]):(e instanceof i?e.get():[e]).includes(s)).length===this.length}not(e){let t=Array.from(this).filter(s=>typeof e=="string"?!s.matches||s.matches&&!s.matches(e):this.isGlobal?!A(e,["window","globalThis"]):!(e instanceof i?e.get():[e]).includes(s));return this.chain(t)}closest(e){let t=Array.from(this).map(s=>{if(this.options.pierceShadow)return this.closestDeep(s,e);if(e&&s?.closest)return s.closest(e);if(this.isGlobal)return A(e,["window","globalThis"])}).filter(Boolean);return this.chain(t)}closestDeep(e,t){let s=e,r=Ie(t),n=C(t);for(;s;){if(r&&s===t||n&&s.matches(t))return s;if(s.parentElement)s=s.parentElement;else if(s.parentNode&&s.parentNode.host)s=s.parentNode.host;else return}}ready(e){return this.is(document)&&document.readyState=="loading"?this.on("ready",e):e.call(document,new Event("DOMContentLoaded")),this}getEventAlias(e){return{ready:"DOMContentLoaded"}[e]||e}getEventArray(e){return e.split(" ").map(t=>this.getEventAlias(t)).filter(Boolean)}on(e,t,s,r){let n=[],o,a;return O(s)?(r=s,o=t):C(t)?(a=t,o=s):w(t)&&(o=t),this.getEventArray(e).forEach(f=>{let h=r?.abortController||new AbortController,c=r?.eventSettings||{},u=h.signal;this.each(m=>{let p;a&&(p=E=>{let R;if(E.composed&&E.composedPath){let T=E.composedPath(),U=ye(T,V=>V==m);T=T.slice(0,U),R=T.find(V=>V instanceof Element&&V.matches&&V.matches(a))}else R=E.target.closest(a);R&&o.call(R,E)});let y=p||o,x=m==i.globalThisProxy?globalThis:m;x.addEventListener&&x.addEventListener(f,y,{signal:u,...c});let d={el:m,eventName:f,eventListener:y,abortController:h,delegated:a!==void 0,handler:o,abort:E=>h.abort(E)};n.push(d)})}),i.eventHandlers||(i.eventHandlers=[]),i.eventHandlers.push(...n),r?.returnHandler?n.length==1?n[0]:n:this}one(e,t,s,r){let n,o;O(s)?(r=s,n=t):C(t)?(o=t,n=s):w(t)&&(n=t),r=r||{};let a=new AbortController;r.abortController=a;let l=function(...f){a.abort(),n.apply(this,f)};return o?this.on(e,o,l,r):this.on(e,l,r)}off(e,t){let s=this.getEventArray(e);return i.eventHandlers=i.eventHandlers.filter(r=>{if((!e||A(r.eventName,s))&&(!t||t?.eventListener==r.eventListener||r.eventListener===t||r.handler===t)){let n=this.isGlobal?globalThis:r.el;return n.removeEventListener&&n.removeEventListener(r.eventName,r.eventListener),!1}return!0}),this}trigger(e,t){return this.each(s=>{if(typeof s.dispatchEvent!="function")return;let r=new Event(e,{bubbles:!0,cancelable:!0});t&&Object.assign(r,t),s.dispatchEvent(r)})}click(e){return this.trigger("click",e)}dispatchEvent(e,t={},s={}){let r={bubbles:!0,cancelable:!0,composed:!0,detail:t,...s};return this.each(n=>{let o=new CustomEvent(e,r);n.dispatchEvent(o)}),this}remove(){return this.each(e=>e.remove())}addClass(e){let t=e.split(" ");return this.each(s=>s.classList.add(...t))}hasClass(e){return Array.from(this).some(t=>t.classList.contains(e))}removeClass(e){let t=e.split(" ");return this.each(s=>s.classList.remove(...t))}toggleClass(e){let t=e.split(" ");return this.each(s=>s.classList.toggle(...t))}html(e){if(e!==void 0)return this.each(t=>t.innerHTML=e);if(this.length>0)return this.map(t=>t.innerHTML||t.nodeValue).join("")}outerHTML(e){if(e!==void 0)return this.each(t=>t.outerHTML=e);if(this.length)return this.map(t=>t.outerHTML).join("")}text(e){if(e!==void 0)return this.each(t=>t.textContent=e);{let t=r=>r.nodeName==="SLOT"?r.assignedNodes({flatten:!0}):r.childNodes,s=this.map(r=>this.getTextContentRecursive(t(r)));return s.length>1?s:s[0]}}getTextContentRecursive(e){return Array.from(e).map(t=>{if(t.nodeType===Node.TEXT_NODE)return t.nodeValue;if(t.nodeName==="SLOT"){let s=t.assignedNodes({flatten:!0});return this.getTextContentRecursive(s)}else return this.getTextContentRecursive(t.childNodes)}).join("").trim()}textNode(){return Array.from(this).map(e=>Array.from(e.childNodes).filter(t=>t.nodeType===Node.TEXT_NODE).map(t=>t.nodeValue).join("")).join("")}map(...e){return Array.from(this).map(...e)}value(e){if(e!==void 0)return this.each(t=>{(t instanceof HTMLInputElement||t instanceof HTMLSelectElement||t instanceof HTMLTextAreaElement)&&(t.value=e)});{let t=this.map(s=>{if(s instanceof HTMLInputElement||s instanceof HTMLSelectElement||s instanceof HTMLTextAreaElement)return s.value});return t.length>1?t:t[0]}}val(...e){return this.value(...e)}focus(){return this.length&&this[0].focus(),this}blur(){return this.length&&this[0].blur(),this}css(e,t=null,s={includeComputed:!1}){let r=Array.from(this);if(ee(e)||t!==null)return ee(e)?Object.entries(e).forEach(([n,o])=>{r.forEach(a=>a.style.setProperty(ae(n),o))}):r.forEach(n=>n.style.setProperty(ae(e),t)),this;if(r?.length){let n=r.map(o=>{let a=o.style[e];if(s.includeComputed)return window.getComputedStyle(o).getPropertyValue(e);if(a)return a});return r.length===1?n[0]:n}}computedStyle(e){return this.css(e,null,{includeComputed:!0})}cssVar(e,t){return this.css(`--${e}`,t,{includeComputed:!0})}attr(e,t){if(ee(e))Object.entries(e).forEach(([s,r])=>{this.each(n=>n.setAttribute(s,r))});else if(t!==void 0)this.each(s=>s.setAttribute(e,t));else if(this.length){let s=this.map(r=>r.getAttribute(e));return s.length>1?s:s[0]}}removeAttr(e){return this.each(t=>t.removeAttribute(e))}el(){return this.get(0)}get(e){return e!==void 0?this[e]:Array.from(this)}eq(e){return this.chain(this[e])}first(){return this.eq(0)}last(){return this.eq(this.length-1)}prop(e,t){return t!==void 0?this.each(s=>{s[e]=t}):this.length==0?void 0:this.length===1?this[0][e]:this.map(s=>s[e])}next(e){let t=this.map(s=>{let r=s.nextElementSibling;for(;r;){if(!e||r.matches(e))return r;r=r.nextElementSibling}return null}).filter(Boolean);return this.chain(t)}prev(e){let t=this.map(s=>{let r=s.previousElementSibling;for(;r;){if(!e||r.matches(e))return r;r=r.previousElementSibling}return null}).filter(Boolean);return this.chain(t)}height(e){return this.prop("innerHeight",e)||this.prop("clientHeight",e)}width(e){return this.prop("innerWidth",e)||this.prop("clientWidth",e)}scrollHeight(e){return(this.isGlobal&&this.isBrowser?this.chain(document.documentElement):this).prop("scrollHeight",e)}scrollWidth(e){return(this.isGlobal&&this.isBrowser?this.chain(document.documentElement):this).prop("scrollWidth",e)}scrollLeft(e){return(this.isGlobal&&this.isBrowser?this.chain(document.documentElement):this).prop("scrollLeft",e)}scrollTop(e){return(this.isGlobal&&this.isBrowser?this.chain(document.documentElement):this).prop("scrollTop",e)}clone(){let e=document.createDocumentFragment();return this.each(t=>{e.appendChild(t.cloneNode(!0))}),this.chain(e.childNodes)}reverse(){let e=this.get().reverse();return this.chain(e)}insertContent(e,t,s){this.chain(t).each(n=>{if(e.insertAdjacentElement)e.insertAdjacentElement(s,n);else switch(s){case"beforebegin":e.parentNode?.insertBefore(n,e);break;case"afterbegin":e.insertBefore(n,e.firstChild);break;case"beforeend":e.appendChild(n);break;case"afterend":e.parentNode?.insertBefore(n,e.nextSibling);break}})}prepend(e){return this.each(t=>{this.insertContent(t,e,"afterbegin")})}append(e){return this.each(t=>{this.insertContent(t,e,"beforeend")})}insertBefore(e){return this.chain(e).each(t=>{this.insertContent(t,this.selector,"beforebegin")})}insertAfter(e){return this.chain(e).each(t=>{this.insertContent(t,this.selector,"afterend")})}detach(){return this.each(e=>{e.parentNode&&e.parentNode.removeChild(e)})}naturalWidth(){let e=this.map(t=>{let s=$(t).clone();s.insertAfter(t).css({position:"absolute",display:"block",transform:"translate(-9999px, -9999px)",zIndex:"-1"});let r=s.width();return s.remove(),r});return e.length>1?e:e[0]}naturalHeight(){let e=this.map(t=>{let s=$(t).clone();s.insertAfter(t).css({position:"absolute",display:"block",transform:"translate(-9999px, -9999px)",zIndex:"-1"});let r=s.height();return s.remove(),r});return e.length>1?e:e[0]}offsetParent({calculate:e=!0}={}){return Array.from(this).map(t=>{if(!e)return t.offsetParent;let s,r,n,o,a=t?.parentNode;for(;a&&!r&&!n&&!o;)a=a?.parentNode,a&&(s=$(a),r=s.computedStyle("position")!=="static",n=s.computedStyle("transform")!=="none",o=s.is("body"));return a})}count(){return this.length}exists(){return this.length>0}initialize(e){document.addEventListener("DOMContentLoaded",()=>{this.settings(e)})}settings(e){this.each(t=>{g(e,(s,r)=>{t[r]=s})})}setting(e,t){this.each(s=>{s[e]=t})}component(){let e=this.map(t=>t.component).filter(Boolean);return e.length>1?e:e[0]}dataContext(){let e=this.map(t=>t.dataContext).filter(Boolean);return e.length>1?e:e[0]}};var L=function(i,e={}){let t=typeof window<"u";return!e?.root&&t&&(e.root=document),new et(i,e)};var M=class i{static current=null;static pendingReactions=new Set;static afterFlushCallbacks=[];static isFlushScheduled=!1;static scheduleReaction(e){i.pendingReactions.add(e),i.scheduleFlush()}static scheduleFlush(){i.isFlushScheduled||(i.isFlushScheduled=!0,typeof queueMicrotask=="function"?queueMicrotask(()=>i.flush()):Promise.resolve().then(()=>i.flush()))}static flush(){i.isFlushScheduled=!1,i.pendingReactions.forEach(e=>e.run()),i.pendingReactions.clear(),i.afterFlushCallbacks.forEach(e=>e()),i.afterFlushCallbacks=[]}static afterFlush(e){i.afterFlushCallbacks.push(e)}static getSource(){if(!i.current||!i.current.context||!i.current.context.trace){console.log("No source available or no current reaction.");return}let e=i.current.context.trace;return e=e.split(`
`).slice(2).join(`
`),e=`Reaction triggered by:
${e}`,console.info(e),e}};var fe=class{constructor(){this.subscribers=new Set}depend(){M.current&&(this.subscribers.add(M.current),M.current.dependencies.add(this))}changed(e){this.subscribers.forEach(t=>t.invalidate(e))}cleanUp(e){this.subscribers.delete(e)}unsubscribe(e){this.subscribers.delete(e)}};var v=class i{constructor(e){this.callback=e,this.dependencies=new Set,this.boundRun=this.run.bind(this),this.firstRun=!0,this.active=!0}run(){this.active&&(M.current=this,this.dependencies.forEach(e=>e.cleanUp(this)),this.dependencies.clear(),this.callback(this),this.firstRun=!1,M.current=null,M.pendingReactions.delete(this))}invalidate(e){this.active=!0,e&&(this.context=e),M.scheduleReaction(this)}stop(){this.active&&(this.active=!1,this.dependencies.forEach(e=>e.unsubscribe(this)))}static get current(){return M.current}static flush=M.flush;static scheduleFlush=M.scheduleFlush;static afterFlush=M.afterFlush;static getSource=M.getSource;static create(e){let t=new i(e);return t.run(),t}static nonreactive(e){let t=M.current;M.current=null;try{return e()}finally{M.current=t}}static guard(e,t=H){if(!M.current)return e();let s=new fe,r,n;s.depend();let o=new i(()=>{n=e(),!o.firstRun&&!t(n,r)&&s.changed(),r=ie(n)});return o.run(),n}};var I=class i{constructor(e,{equalityFunction:t,allowClone:s=!0,cloneFunction:r}={}){this.dependency=new fe,this.allowClone=s,this.equalityFunction=t?Y(t):i.equalityFunction,this.clone=r?Y(r):i.cloneFunction,this.currentValue=this.maybeClone(e)}static equalityFunction=H;static cloneFunction=ie;get value(){this.dependency.depend();let e=this.currentValue;return Array.isArray(e)||typeof e=="object"?this.maybeClone(e):e}canCloneValue(e){return this.allowClone===!0&&!He(e)}maybeClone(e){return this.canCloneValue(e)?k(e)?e=e.map(t=>this.maybeClone(t)):this.clone(e):e}set value(e){this.equalityFunction(this.currentValue,e)||(this.currentValue=this.maybeClone(e),this.dependency.changed({value:e,trace:new Error().stack}))}get(){return this.value}set(e){this.equalityFunction(this.currentValue,e)||(this.value=e)}subscribe(e){return v.create(t=>{e(this.value,t)})}peek(){return this.maybeClone(this.currentValue)}clear(){return this.set(void 0)}push(...e){let t=this.peek();t.push(...e),this.set(t)}unshift(...e){let t=this.peek();t.unshift(...e),this.set(t)}splice(...e){let t=this.peek();t.splice(...e),this.set(t)}map(e){let t=Array.prototype.map.call(this.peek(),e);this.set(t)}filter(e){let t=Array.prototype.filter.call(this.peek(),e);this.set(t)}getIndex(e){return this.get()[e]}setIndex(e,t){let s=this.peek();s[e]=t,this.set(s)}removeIndex(e){let t=this.peek();t.splice(e,1),this.set(t)}setArrayProperty(e,t,s){let r;at(e)?r=e:(r="all",s=t,t=e);let n=this.peek().map((o,a)=>((r=="all"||a==r)&&(o[t]=s),o));this.set(n)}toggle(){return this.set(!this.peek())}increment(e=1){return this.set(this.peek()+e)}decrement(e=1){return this.set(this.peek()-e)}now(){return this.set(new Date)}getIDs(e){return O(e)?me([e?._id,e?.id,e?.hash,e?.key].filter(Boolean)):[e]}getID(e){return this.getIDs(e).filter(Boolean)[0]}hasID(e,t){return this.getID(e)===t}getItem(e){return ye(this.currentValue,t=>this.hasID(t,e))}setProperty(e,t,s){if(arguments.length==3){let r=e,n=this.getItem(r);return this.setArrayProperty(n,t,s)}else{s=t,t=e;let r=this.peek();r[t]=s,this.set(r)}}replaceItem(e,t){return this.setIndex(this.getItem(e),t)}removeItem(e){return this.removeIndex(this.getItem(e))}};var be={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},F=i=>(...e)=>({_$litDirective$:i,values:e}),re=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var{I:Hs}=Qt;var ss=i=>i.strings===void 0,ts=()=>document.createComment(""),Ee=(i,e,t)=>{let s=i._$AA.parentNode,r=e===void 0?i._$AB:e._$AA;if(t===void 0){let n=s.insertBefore(ts(),r),o=s.insertBefore(ts(),r);t=new Hs(n,o,i,i.options)}else{let n=t._$AB.nextSibling,o=t._$AM,a=o!==i;if(a){let l;t._$AQ?.(i),t._$AM=i,t._$AP!==void 0&&(l=i._$AU)!==o._$AU&&t._$AP(l)}if(n!==r||a){let l=t._$AA;for(;l!==n;){let f=l.nextSibling;s.insertBefore(l,r),l=f}}}return t},ne=(i,e,t=i)=>(i._$AI(e,t),i),Fs={},is=(i,e=Fs)=>i._$AH=e,rs=i=>i._$AH,tt=i=>{i._$AP?.(!1,!0);let e=i._$AA,t=i._$AB.nextSibling;for(;e!==t;){let s=e.nextSibling;e.remove(),e=s}};var Me=(i,e)=>{let t=i._$AN;if(t===void 0)return!1;for(let s of t)s._$AO?.(e,!1),Me(s,e);return!0},st=i=>{let e,t;do{if((e=i._$AM)===void 0)break;t=e._$AN,t.delete(i),i=e}while(t?.size===0)},ns=i=>{for(let e;e=i._$AM;i=e){let t=e._$AN;if(t===void 0)e._$AN=t=new Set;else if(t.has(i))break;t.add(i),zs(e)}};function Us(i){this._$AN!==void 0?(st(this),this._$AM=i,ns(this)):this._$AM=i}function Vs(i,e=!1,t=0){let s=this._$AH,r=this._$AN;if(r!==void 0&&r.size!==0)if(e)if(Array.isArray(s))for(let n=t;n<s.length;n++)Me(s[n],!1),st(s[n]);else s!=null&&(Me(s,!1),st(s));else Me(this,i)}var zs=i=>{i.type==be.CHILD&&(i._$AP??=Vs,i._$AQ??=Us)},G=class extends re{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,s){super._$AT(e,t,s),ns(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(Me(this,e),st(this))}setValue(e){if(ss(this._$Ct))this._$Ct._$AI(e,this);else{let t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}};var Pe=class extends re{constructor(e){if(super(e),this.it=b,e.type!==be.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===b||e==null)return this._t=void 0,this.it=e;if(e===j)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;let t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}};Pe.directiveName="unsafeHTML",Pe.resultType=1;var os=F(Pe);var as=i=>i??b;var it=class extends G{constructor(e){super(e),this.partInfo=e,this.reaction=null}render(e,t={}){if(this.expression=e,this.settings=t,this.reaction)return this.getReactiveValue();{let s;return this.reaction=v.create(r=>{if(!this.isConnected){r.stop();return}s=this.getReactiveValue(),this.settings.unsafeHTML&&(s=os(s)),r.firstRun||this.setValue(s)}),s}}getReactiveValue(){let e=this.expression.value();return this.settings.ifDefined&&A(e,[void 0,null,!1,0])?as(void 0):((k(e)||O(e))&&(e=JSON.stringify(e)),e)}disconnected(){this.reaction&&(this.reaction.stop(),this.reaction=null)}reconnected(){}},ls=F(it);var rt=class extends G{constructor(e){super(e),this.reaction=null}render(e){this.reaction&&this.reaction.stop();let t=b;return this.reaction=v.create(s=>{if(!this.isConnected){s.stop();return}if(e.condition())t=e.content();else if(e.branches?.length){let r=!1;g(e.branches,n=>{(!r&&n.type=="elseif"&&n.condition()||!r&&n.type=="else")&&(r=!0,t=n.content())})}else t=b;return t||(t=b),s.firstRun||this.setValue(t),t}),t}disconnected(){this.reaction&&(this.reaction.stop(),this.reaction=null)}reconnected(){}},cs=F(rt);var hs=(i,e,t)=>{let s=new Map;for(let r=e;r<=t;r++)s.set(i[r],r);return s},vt=F(class extends re{constructor(i){if(super(i),i.type!==be.CHILD)throw Error("repeat() can only be used in text expressions")}dt(i,e,t){let s;t===void 0?t=e:e!==void 0&&(s=e);let r=[],n=[],o=0;for(let a of i)r[o]=s?s(a,o):o,n[o]=t(a,o),o++;return{values:n,keys:r}}render(i,e,t){return this.dt(i,e,t).values}update(i,[e,t,s]){let r=rs(i),{values:n,keys:o}=this.dt(e,t,s);if(!Array.isArray(r))return this.ut=o,n;let a=this.ut??=[],l=[],f,h,c=0,u=r.length-1,m=0,p=n.length-1;for(;c<=u&&m<=p;)if(r[c]===null)c++;else if(r[u]===null)u--;else if(a[c]===o[m])l[m]=ne(r[c],n[m]),c++,m++;else if(a[u]===o[p])l[p]=ne(r[u],n[p]),u--,p--;else if(a[c]===o[p])l[p]=ne(r[c],n[p]),Ee(i,l[p+1],r[c]),c++,p--;else if(a[u]===o[m])l[m]=ne(r[u],n[m]),Ee(i,r[c],r[u]),u--,m++;else if(f===void 0&&(f=hs(o,m,p),h=hs(a,c,u)),f.has(a[c]))if(f.has(a[u])){let y=h.get(o[m]),x=y!==void 0?r[y]:null;if(x===null){let d=Ee(i,r[c]);ne(d,n[m]),l[m]=d}else l[m]=ne(x,n[m]),Ee(i,r[c],x),r[y]=null;m++}else tt(r[u]),u--;else tt(r[c]),c++;for(;m<=p;){let y=Ee(i,l[p+1]);ne(y,n[m]),l[m++]=y}for(;c<=u;){let y=r[c++];y!==null&&tt(y)}return this.ut=o,is(i,l),j}});var nt=class extends G{constructor(e){super(e),this.reaction=null,this.items=[],this.eachCondition=null}render(e,t={}){return this.eachCondition=e,this.reaction&&(this.reaction.stop(),this.reaction=null),this.reaction=v.create(s=>{if(!this.isConnected){s.stop();return}if(this.items=this.getItems(this.eachCondition),!s.firstRun){let r=this.renderItems();this.setValue(r)}}),this.renderItems()}renderItems(){let e=this.getItems(this.eachCondition);if(!e?.length>0&&this.eachCondition.else)return vt([1],()=>"else-case",()=>this.eachCondition.else());let t=this.getCollectionType(e);return t=="object"&&(e=Fe(e)),vt(e,(s,r)=>this.getItemID(s,r,t),(s,r)=>this.getTemplate(s,r,t))}getCollectionType(e){return k(e)?"array":"object"}getItems(){return this.eachCondition.over()||[]}getTemplate(e,t,s){let r=this.getEachData(e,t,s,this.eachCondition);return this.eachCondition.content(r)}getItemID(e,t,s){return ee(e)?(s=="object"?t:void 0)||e._id||e.id||e.key||e.hash||e._hash||e.value||t:C(e)?e:t}getEachData(e,t,s,r){let{as:n,indexAs:o}=r;return o||(o=s=="array"?"index":"key"),s=="object"&&(e=e.value,t=e.key),n?{[n]:e,[o]:t}:{...e,this:e,[o]:t}}disconnected(){this.reaction&&(this.reaction.stop(),this.reaction=null)}reconnected(){}},us=F(nt);var ot=class extends G{constructor(e){super(e),this.renderRoot=e.options?.host?.renderRoot,this.template=null,this.part=null}render({getTemplate:e,templateName:t,subTemplates:s,data:r,parentTemplate:n}){return this.parentTemplate=n,this.getTemplate=e,this.subTemplates=s,this.data=r,this.ast=null,this.reaction=v.create(o=>{this.maybeCreateTemplate();let a=this.unpackData(this.data);if(!this.isConnected){o.stop();return}if(o.firstRun||!this.template||this.template?.ast.length==0)return;let l=this.renderTemplate(a);this.setValue(l)}),this.maybeCreateTemplate(),!this.template||this.template?.ast.length==0?b:this.renderTemplate()}renderTemplate(e){return this.attachTemplate(),e||(e=this.unpackData(this.data)),this.template.setDataContext(e),this.template.render()}maybeCreateTemplate(){let e,t,s=this.getTemplate();if(C(s)?(e=s,t=this.subTemplates[e]):s instanceof Le&&(t=s,e=t.templateName),!t)return!1;this.templateID=t.id,this.template=t.clone({templateName:e,subTemplates:this.subTemplates,data:this.unpackData(this.data)})}attachTemplate(){let{parentNode:e,startNode:t,endNode:s}=this.part||{},r=this.part?.options?.host,n=r?.renderRoot;this.template.setElement(r),this.template.attach(n,{element:r,parentNode:e,startNode:t,endNode:s}),this.parentTemplate&&this.template.setParent(this.parentTemplate)}unpackData(e){return te(e,t=>t())}update(e,t){return this.part=e,this.render.apply(this,t)}reconnected(){}disconnected(){this.template&&this.template.onDestroyed()}},ps=F(ot);var Ne=class i{static html=Et;static PARENS_REGEXP=/('[^']*'|"[^"]*"|\(|\)|[^\s()]+)/g;static STRING_REGEXP=/^\'(.*)\'$/;static WRAPPED_EXPRESSION=/(\s|^)([\[{].*?[\]}])(\s|$)/g;static VAR_NAME_REGEXP=/^[a-zA-Z_$][0-9a-zA-Z_$]*$/;static useSubtreeCache=!1;static getID({ast:e,data:t,isSVG:s}={}){return Se({ast:e})}constructor({ast:e,data:t,template:s,subTemplates:r,snippets:n,helpers:o,isSVG:a}){this.ast=e||"",this.data=t,this.renderTrees={},this.treeIDs=[],this.template=s,this.subTemplates=r,this.resetHTML(),this.snippets=n||{},this.helpers=o||{},this.isSVG=a,this.id=i.getID({ast:e,data:t,isSVG:a})}resetHTML(){this.html=[],this.html.raw=[],this.expressions=[]}render({ast:e=this.ast,data:t=this.data}={}){this.resetHTML(),this.readAST({ast:e,data:t}),this.clearTemp();let s=this.isSVG?Xt:Et;return this.litTemplate=s.apply(this,[this.html,...this.expressions]),this.litTemplate}cachedRender(e){return e&&this.updateData(e),this.litTemplate}readAST({ast:e=this.ast,data:t=this.data}={}){g(e,s=>{switch(s.type){case"html":this.addHTML(s.html);break;case"svg":this.addValue(this.evaluateSVG(s.content,t));break;case"expression":let r=this.evaluateExpression(s.value,t,{unsafeHTML:s.unsafeHTML,ifDefined:s.ifDefined,asDirective:!0});this.addValue(r);break;case"if":this.addValue(this.evaluateConditional(s,t));break;case"each":this.addValue(this.evaluateEach(s,t));break;case"template":this.addValue(this.evaluateTemplate(s,t));break;case"snippet":this.snippets[s.name]=s;break;case"slot":s.name?this.addHTML(`<slot name="${s.name}"></slot>`):this.addHTML("<slot></slot>");break}})}evaluateConditional(e,t){let s=(n,o)=>o=="branches"?n.map(a=>(a.condition&&(a.expression=a.condition),te(a,s))):o=="condition"?()=>this.evaluateExpression(n,t):o=="content"?()=>this.renderContent({ast:n,data:t}):n;e.expression=e.condition;let r=te(e,s);return cs(r)}evaluateEach(e,t){let r=te(e,(n,o)=>o=="over"?a=>this.evaluateExpression(n,t):o=="content"?a=>(t={...this.data,...a},this.renderContent({ast:n,data:t})):o=="else"?a=>this.renderContent({ast:n.content,data:this.data}):n);return us(r,t)}evaluateTemplate(e,t={}){let s=this.lookupExpressionValue(e.name,t);return this.snippets[s]?this.evaluateSnippet(e,t):this.evaluateSubTemplate(e,t)}evaluateSVG(e,t){return this.renderContent({isSVG:!0,ast:e,data:t})}getPackedValue=(e,t,{reactive:s=!1}={})=>{let r=n=>this.evaluateExpression(n,t);return s?()=>r(e):()=>v.nonreactive(()=>r(e))};getPackedNodeData(e,t,{inheritParent:s=!1}={}){let r=(a,l={})=>{let f={};if(C(a)){let h=a;a=this.evaluateExpression(h,t,l),f=te(a,Y)}else ee(a)&&(f=te(a,h=>this.getPackedValue(h,t,l)));return f},n=r(e.data),o=r(e.reactiveData,{reactive:!0});return t={...s?this.data:{},...n,...o},t}evaluateSnippet(e,t={}){let s=this.lookupExpressionValue(e.name,t),r=this.snippets[s];r||Ae(`Snippet "${s}" not found`);let n=this.getPackedNodeData(e,t,{inheritParent:!0});return this.renderContent({ast:r.content,data:n})}evaluateSubTemplate(e,t={}){let s=this.getPackedNodeData(e,t);return ps({subTemplates:this.subTemplates,templateName:e.name,getTemplate:()=>this.evaluateExpression(e.name,t),data:s,parentTemplate:this.template})}evaluateExpression(e,t=this.data,{asDirective:s=!1,ifDefined:r=!1,unsafeHTML:n=!1}={}){return typeof e=="string"?s?ls({expression:e,value:()=>this.lookupExpressionValue(e,this.data)},{ifDefined:r,unsafeHTML:n}):this.lookupExpressionValue(e,t):e}getExpressionArray(e){let t=e.match(i.PARENS_REGEXP)||[],s=r=>{let n=[];for(;r.length>0;){let o=r.shift();if(o==="(")n.push(s(r));else{if(o===")")return n;n.push(o)}}return n};return s(t)}evaluateJavascript(e,t={},{includeHelpers:s=!0}={}){let r;s&&(t={...this.helpers,...t},t=_t(t,(n,o)=>!["debugger"].includes(o)&&i.VAR_NAME_REGEXP.test(o)));try{let n=Object.keys(t),o=Object.values(t);g(o,(a,l)=>{a instanceof I&&Object.defineProperty(o,l,{get(){return a.peek()},configurable:!0,enumerable:!0}),w(a)&&a.length===0&&!a.name&&Object.defineProperty(o,l,{get(){return a()},configurable:!0,enumerable:!0})}),r=new Function(...n,`return ${e}`)(...o)}catch{}return r}lookupExpressionValue(e="",t={},s=new Set){if(s.has(e))return;if(s.add(e),!e.includes(" ")){let h=this.lookupTokenValue(e,t);if(h!==void 0)return Y(h)()}let n=this.evaluateJavascript(e,t);if(n!==void 0){let h=this.accessTokenValue(n,e,t);return s.delete(e),Y(h)()}C(e)&&(e=this.addParensToExpression(e));let o=k(e)?e:this.getExpressionArray(e),a=[],l,f=o.length;for(;f--;){let h=o[f];if(k(h))l=this.lookupExpressionValue(h.join(" "),t,s),a.unshift(l);else{let c=this.lookupTokenValue(h,t);l=w(c)?c(...a):c,a.unshift(l)}}return s.delete(e),l}lookupTokenValue(e="",t){if(k(e))return this.lookupExpressionValue(e,t);let s=this.getLiteralValue(e);if(s!==void 0)return s;let r=this.getDeepDataValue(t,e),n=this.accessTokenValue(r,e,t);if(n!==void 0)return n;let o=this.helpers[e];if(w(o))return o}getDeepDataValue(e,t){return t.split(".").reduce((s,r)=>{if(s===void 0)return;let n=s instanceof I?s.get():Y(s)();if(n!=null)return n[r]},e)}accessTokenValue(e,t,s){let r=(n,o)=>{let a=n.split(".").slice(0,-1).join(".");return this.getDeepDataValue(o,a)};if(w(e)&&t.search(".")!==-1){let n=r(t,s);e=e.bind(n)}if(e!==void 0)return e instanceof I?e.value:e}addParensToExpression(e=""){return String(e).replace(i.WRAPPED_EXPRESSION,(t,s,r,n)=>`${s}(${r})${n}`)}getLiteralValue(e){if(e.length>1&&(e[0]==="'"||e[0]==='"')&&e[0]===e[e.length-1])return e.slice(1,-1).replace(/\\(['"])/g,"$1");let t={true:!0,false:!1};if(t[e]!==void 0)return t[e];if(!Number.isNaN(parseFloat(e)))return Number(e)}addHTML(e){this.lastHTML&&(e=`${this.html.pop()}${e}`),this.html.push(e),this.html.raw.push(String.raw({raw:e})),this.lastHTML=!0}addHTMLSpacer(){this.addHTML("")}addValue(e){this.addHTMLSpacer(),this.expressions.push(e),this.lastHTML=!1,this.addHTMLSpacer()}renderContent({ast:e,data:t,isSVG:s=this.isSVG}={}){let r=i.getID({ast:e,data:t,isSVG:s}),n=this.renderTrees[r],o=n?n.deref():void 0;if(i.useSubtreeCache&&o)return o.cachedRender(t);let a=new i({ast:e,data:t,isSVG:s,subTemplates:this.subTemplates,snippets:this.snippets,helpers:this.helpers,template:this.template});return this.treeIDs.push(r),this.renderTrees[r]=new WeakRef(a),a.render()}cleanup(){this.renderTrees=[]}setData(e){this.updateData(e),this.updateSubtreeData(e)}updateSubtreeData(e){g(this.renderTrees,(t,s)=>{let r=t.deref();r&&r.updateData(e)})}updateData(e){g(this.data,(t,s)=>{delete this.data[s]}),g(e,(t,s)=>{this.data[s]!==t&&(this.data[s]=t)})}clearTemp(){delete this.lastHTML}};var Z={exists(i){return!lt(i)},isEmpty(i){return lt(i)},stringify(i){return JSON.stringify(i)},hasAny(i){return i?.length>0},range(i,e,t=1){return Mt(i,e,t)},concat(...i){return i.join("")},both(i,e){return i&&e},either(i,e){return i||e},join(i=[],e=" ",t=!1){if(i.length==0)return;let s=i.join(e).trim();return t?`${s} `:s},classes(i,e=!0){return Z.join(i," ",!0)},joinComma(i=[],e,t){return Ot(i,{separator:", ",lastSeparator:" and ",oxford:e,quotes:t})},classIf(i,e="",t=""){let s=i?e:t;return s?`${s} `:""},classMap(i){let e=[];return g(i,(t,s)=>{t&&e.push(s)}),e.length?`${e.join(" ")} `:""},maybe(i,e,t){return i?e:t},activeIf(i){return Z.classIf(i,"active","")},selectedIf(i){return Z.classIf(i,"selected","")},capitalize(i=""){return Ve(i)},titleCase(i=""){return Nt(i)},disabledIf(i){return Z.classIf(i,"disabled","")},checkedIf(i){return Z.classIf(i,"checked","")},maybePlural(i,e="s"){return i==1?"":e},not(i){return!i},is(i,e){return i==e},notEqual(i,e){return i!==e},isExactly(i,e){return i===e},isNotExactly(i,e){return i!==e},greaterThan(i,e){return i>e},lessThan(i,e){return i<e},greaterThanEquals(i,e){return i>=e},lessThanEquals(i,e){return i<=e},numberFromIndex(i){return i+1},formatDate(i=new Date,e="L",t={timezone:"local"}){return Ue(i,e,t)},formatDateTime(i=new Date,e="LLL",t={timezone:"local"}){return Ue(i,e,t)},formatDateTimeSeconds(i=new Date,e="LTS",t={timezone:"local"}){return Ue(i,e,t)},object({obj:i}){return i},log(...i){console.log(...i)},debugger(){debugger},tokenize(i=""){return At(i)},debugReactivity(){v.getSource()},arrayFromObject(i){return Fe(i)},escapeHTML(i){return St(i)},guard:v.guard,nonreactive:v.nonreactive};var Le=class _{static templateCount=0;static isServer=W;constructor({templateName:e,ast:t,template:s,data:r,element:n,renderRoot:o,css:a,events:l,keys:f,defaultState:h,subTemplates:c,createComponent:u,parentTemplate:m,renderingEngine:p="lit",isPrototype:y=!1,attachStyles:x=!1,onCreated:d=D,onRendered:E=D,onUpdated:R=D,onDestroyed:T=D,onThemeChanged:U=D}={}){t||(t=new de(s).compile()),this.events=l,this.keys=f||{},this.ast=t,this.css=a,this.data=r||{},this.reactions=[],this.defaultState=h,this.state=this.createReactiveState(h,r)||{},this.templateName=e||this.getGenericTemplateName(),this.subTemplates=c,this.createComponent=u,this.onCreated=D,this.onDestroyed=D,this.onRendered=D,this.onRenderedCallback=E,this.onDestroyedCallback=T,this.onCreatedCallback=d,this.onThemeChangedCallback=U,this.id=wt(),this.isPrototype=y,this.parentTemplate=m,this.attachStyles=x,this.element=n,this.renderingEngine=p,o&&this.attach(o)}createReactiveState(e,t){let s={},r=(n,o)=>{let a=se(t,o);return a||n?.value||n};return g(e,(n,o)=>{let a=r(n,o);n?.options?s[o]=new I(a,n.options):s[o]=new I(a)}),s}setDataContext(e,{rerender:t=!0}={}){this.data=e,t&&(this.rendered=!1)}setParent(e){e._childTemplates||(e._childTemplates=[]),e._childTemplates.push(this),this._parentTemplate=e}setElement(e){this.element=e}getGenericTemplateName(){return _.templateCount++,`Anonymous #${_.templateCount}`}initialize(){let e=this,t;this.instance={},w(this.createComponent)&&(t=this.call(this.createComponent)||{},Rt(e.instance,t)),w(e.instance.initialize)&&this.call(e.instance.initialize.bind(e)),e.instance.templateName=this.templateName,this.onCreated=()=>{this.call(this.onCreatedCallback),_.addTemplate(this),this.dispatchEvent("created",{component:this.instance},{},{triggerCallback:!1})},this.onRendered=()=>{this.call(this.onRenderedCallback),this.dispatchEvent("rendered",{component:this.instance},{},{triggerCallback:!1})},this.onUpdated=()=>{this.dispatchEvent("updated",{component:this.instance},{},{triggerCallback:!1})},this.onThemeChanged=(...s)=>{this.call(this.onThemeChangedCallback,...s)},this.onDestroyed=()=>{_.removeTemplate(this),this.rendered=!1,this.clearReactions(),this.removeEvents(),this.call(this.onDestroyedCallback),this.dispatchEvent("destroyed",{component:this.instance},{},{triggerCallback:!1})},this.initialized=!0,this.renderingEngine=="lit"?this.renderer=new Ne({ast:this.ast,data:this.getDataContext(),template:this,subTemplates:this.subTemplates,helpers:Z}):Ae("Unknown renderer specified",this.renderingEngine),this.onCreated()}async attach(e,{parentNode:t=e,startNode:s,endNode:r}={}){this.initialized||this.initialize(),this.renderRoot!=e&&(this.renderRoot=e,this.parentNode=t,this.startNode=s,this.endNode=r,this.attachEvents(),this.bindKeys(),this.attachStyles&&await this.adoptStylesheet())}getDataContext(){return{...this.data,...this.state,...this.instance}}async adoptStylesheet(){if(!this.css||!this.renderRoot||!this.renderRoot.adoptedStyleSheets)return;let e=this.css;this.stylesheet||(this.stylesheet=new CSSStyleSheet,await this.stylesheet.replace(e)),Array.from(this.renderRoot.adoptedStyleSheets).some(r=>H(r.cssRules,this.stylesheet.cssRules))||(this.renderRoot.adoptedStyleSheets=[...this.renderRoot.adoptedStyleSheets,this.stylesheet])}clone(e){let s={...{templateName:this.templateName,element:this.element,ast:this.ast,css:this.css,defaultState:this.defaultState,events:this.events,keys:this.keys,renderingEngine:this.renderingEngine,subTemplates:this.subTemplates,onCreated:this.onCreatedCallback,onThemeChanged:this.onThemeChangedCallback,onRendered:this.onRenderedCallback,parentTemplate:this.parentTemplate,onDestroyed:this.onDestroyedCallback,createComponent:this.createComponent},...e};return new _(s)}parseEventString(e){let t="delegated";g(["deep","global"],c=>{e.startsWith(c)&&(e=e.replace(c,""),t=c)}),e=e.trim();let r=c=>{let u={blur:"focusout",focus:"focusin",load:"DOMContentLoaded",unload:"beforeunload",mouseenter:"mouseover",mouseleave:"mouseout"};return u[c]&&(c=u[c]),c},n=[],o=e.split(/\s+/),a=!1,l=!1,f=[],h=[];return g(o,(c,u)=>{let m=c.replace(/(\,|\W)+$/,"").trim(),p=c.includes(",");if(!a)f.push(r(m)),a=!p;else if(!l){let y=o.slice(u).join(" ").split(",");g(y,x=>{h.push(x.trim())}),l=!0}}),g(f,c=>{h.length||h.push(""),g(h,u=>{n.push({eventName:c,eventType:t,selector:u})})}),n}attachEvents(e=this.events){(!this.parentNode||!this.renderRoot)&&Ae("You must set a parent before attaching events"),this.removeEvents(),this.eventController=new AbortController,!_.isServer&&this.onThemeChangedCallback!==D&&L("html").on("themechange",t=>{this.onThemeChanged({additionalData:{event:t,...t.detail}})},{abortController:this.eventController}),g(e,(t,s)=>{let r=this.parseEventString(s),n=this;g(r,o=>{let{eventName:a,selector:l,eventType:f}=o;l&&L(l,{root:this.renderRoot}).on(a,D,{abortController:this.eventController});let h=function(u){if(f!=="global"&&!n.isNodeInTemplate(u.target))return;let m=l&&L(u.target).closest(l).length==0;if(f!=="deep"&&m||A(a,["mouseover","mouseout"])&&u.relatedTarget&&u.target.contains(u.relatedTarget))return;let p=this,y=t.bind(p),x=u?.detail||{},d=p?.dataset,E=p?.value||u.target?.value||u?.detail?.value;n.call(y,{additionalData:{event:u,isDeep:m,target:p,value:E,data:{...d,...x}}})},c={abortController:this.eventController};f=="global"?L(l).on(a,h,c):L(this.renderRoot).on(a,l,h,c)})})}removeEvents(){this.eventController&&this.eventController.abort("Template destroyed")}bindKeys(e=this.keys){if(W||Object.keys(e).length==0)return;let t=500,s={abortController:this.eventController};this.currentSequence="",L(document).on("keydown",r=>{let n=Lt(r),o=n==this.currentKey;this.currentKey=n,this.currentSequence+=n,g(this.keys,(a,l)=>{l=l.replace(/\s*\+\s*/g,"+");let f=l.split(",");if(Pt(f,h=>this.currentSequence.endsWith(h))){let h=document.activeElement instanceof HTMLElement&&(["input","select","textarea"].includes(document.activeElement.tagName.toLowerCase())||document.activeElement.isContentEditable);this.call(a,{additionalData:{event:r,inputFocused:h,repeatedKey:o}})!==!0&&r.preventDefault()}}),this.currentSequence+=" ",clearTimeout(this.resetSequence),this.resetSequence=setTimeout(()=>{this.currentSequence=""},t)},s).on("keyup",r=>{this.currentKey=""},s)}bindKey(e,t){if(!e||!t)return;let s=Object.keys(this.keys).length==0;this.keys[e]=t,s&&this.bindKeys()}unbindKey(e){delete this.keys[e]}isNodeInTemplate(e){return((r,n=this.startNode,o=this.endNode)=>{if(!n||!o)return!0;if(r===null)return!1;let a=n.compareDocumentPosition(r),l=o.compareDocumentPosition(r),f=(a&Node.DOCUMENT_POSITION_FOLLOWING)!==0,h=(l&Node.DOCUMENT_POSITION_PRECEDING)!==0;return f&&h})((r=>{for(;r&&r.parentNode!==this.parentNode;)r.parentNode===null&&r.host?r=r.host:r=r.parentNode;return r})(e))}render(e={}){this.initialized||this.initialize();let t={...this.getDataContext(),...e};return this.setDataContext(t,{rerender:!1}),this.renderer.setData(t),this.rendered||(this.html=this.renderer.render(),setTimeout(this.onRendered,0)),this.rendered=!0,setTimeout(this.onUpdated,0),this.html}$(e,{root:t=this.renderRoot,filterTemplate:s=!0,...r}={}){if(!_.isServer&&A(e,["body","document","html"])&&(t=document),t||(t=globalThis),t==this.renderRoot){let n=L(e,{root:t,...r});return s?n.filter(o=>this.isNodeInTemplate(o)):n}else return L(e,{root:t,...r})}$$(e,t){return this.$(e,{root:this.renderRoot,pierceShadow:!0,filterTemplate:!0,...t})}call(e,{params:t,additionalData:s={},firstArg:r,additionalArgs:n}={}){let o=[];if(!this.isPrototype){if(!t){let a=this.element;t={el:this.element,tpl:this.instance,self:this.instance,component:this.instance,$:this.$.bind(this),$$:this.$$.bind(this),reaction:this.reaction.bind(this),signal:this.signal.bind(this),afterFlush:v.afterFlush,nonreactive:v.nonreactive,flush:v.flush,data:this.data,settings:this.element?.settings,state:this.state,isRendered:()=>this.rendered,isServer:_.isServer,isClient:!_.isServer,dispatchEvent:this.dispatchEvent.bind(this),attachEvent:this.attachEvent.bind(this),bindKey:this.bindKey.bind(this),unbindKey:this.unbindKey.bind(this),abortController:this.eventController,helpers:Z,template:this,templateName:this.templateName,templates:_.renderedTemplates,findTemplate:this.findTemplate,findParent:this.findParent.bind(this),findChild:this.findChild.bind(this),findChildren:this.findChildren.bind(this),content:this.instance.content,get darkMode(){return a.isDarkMode()},...s},o.push(t)}if(n&&o.push(...n),w(e))return e.apply(this.element,o)}}attachEvent(e,t,s,{eventSettings:r={},querySettings:n={pierceShadow:!0}}={}){return L(e,document,n).on(t,s,{abortController:this.eventController,returnHandler:!0,...r})}dispatchEvent(e,t,s,{triggerCallback:r=!0}={}){if(!_.isServer){if(r){let n=`on${Ve(e)}`,o=this.element[n];Y(o).call(this.element,t)}return L(this.element).dispatchEvent(e,t,s)}}reaction(e){this.reactions.push(v.create(e))}signal(e,t){return new I(e,t)}clearReactions(){g(this.reactions||[],e=>e.stop())}findTemplate=e=>_.findTemplate(e);findParent=e=>_.findParentTemplate(this,e);findChild=e=>_.findChildTemplate(this,e);findChildren=e=>_.findChildTemplates(this,e);static renderedTemplates=new Map;static addTemplate(e){if(e.isPrototype)return;let t=_.renderedTemplates.get(e.templateName)||[];t.push(e),_.renderedTemplates.set(e.templateName,t)}static removeTemplate(e){if(e.isPrototype)return;let t=_.renderedTemplates.get(e.templateName)||[];Dt(t,s=>s.id==e.id),_.renderedTemplates.set(t)}static getTemplates(e){return _.renderedTemplates.get(e)||[]}static findTemplate(e){return _.getTemplates(e)[0]}static findParentTemplate(e,t){let s,r=n=>!(s||!n?.templateName||t&&n?.templateName!==t);if(!s){let n=e.element?.parentNode;for(;n;){if(r(n.component)){s={...n.component,...n.dataContext};break}n=n.parentNode}}for(;e;)if(e=e._parentTemplate,r(e)){s={...e.instance,...e.data};break}return s}static findChildTemplates(e,t){let s=[];function r(n,o){(!o||n.templateName===o)&&s.push({...n.instance,...n.data}),n._childTemplates&&n._childTemplates.forEach(a=>{r(a,o)})}return r(e,t),s}static findChildTemplate(e,t){return _.findChildTemplates(e,t)[0]}};var Bs=/\s+/mg,ds=["disabled","value"],js=i=>C(i)?i.split("-").reverse().join("-"):i,qs=i=>C(i)?i.replaceAll(Bs,"-"):i,Oe=({el:i,attribute:e,attributeValue:t,properties:s,componentSpec:r,oldValue:n})=>{let o=({attribute:h,optionValue:c,optionAttributeValue:u})=>{c=qs(c);let m=[c];h&&c&&(m.push(`${h}-${t}`),m.push(`${t}-${h}`)),m.push(js(c)),m=me(m);let p=kt(m,x=>se(r.optionAttributes,x));return p?A(t?.constructor,[Object,Array,Function])?{matchingAttribute:void 0,matchingValue:void 0}:{matchingAttribute:se(r.optionAttributes,p),matchingValue:p}:{matchingAttribute:void 0,matchingValue:void 0}},a=(h,c)=>{let u=B(h);c!==void 0&&(i[u]=c),A(h,ds)&&i.requestUpdate()},l=h=>{let c=B(h);i[c]=null,A(h,ds)&&i.requestUpdate()},f=(h,c)=>{let u=r.propertyTypes[h]==Boolean,m=r.optionAttributes[h]==h,p=A(h,r.attributeClasses);return(u||p||m)&&A(c,["",!0,h])};if(r){if(e=="class"&&t){let h=C(n)?n.split(" "):[],c=t.split(" "),u=ct(h,c),m=ct(c,h);g(u,p=>{Oe({el:i,attribute:p,attributeValue:null,componentSpec:r})}),g(m,p=>{Oe({el:i,attribute:p,attributeValue:!0,componentSpec:r})})}else if(A(e,r.attributes)){if(f(e,t)){t=!0,a(e,t);return}if(t===null){l(e);return}let{matchingValue:h}=o({attribute:e,optionValue:t});h&&a(e,h)}else if(t!==void 0){let{matchingAttribute:h,matchingValue:c}=o({optionValue:e,optionAttributeValue:t});if(h&&t===null){i[h]==e&&l(h);return}h&&c&&a(h,c)}}else if(s&&t!==void 0&&e.includes("-")){let h=B(e),c=s[e];if(h!==e&&c?.alias){let u=c?.converter?.fromAttribute,m=u?u(t):t;m&&a(h,m);return}}};var ve=class i extends J{static shadowRootOptions={...J.shadowRootOptions,delegatesFocus:!1};static scopedStyleSheet=null;constructor(){super(),this.renderCallbacks=[]}updated(){super.updated(),g(this.renderCallbacks,e=>e())}addRenderCallback(e){this.renderCallbacks.push(e)}static getProperties({properties:e={},defaultSettings:t,componentSpec:s}){return $t(e).length||(s&&(e.class={type:String,noAccessor:!0,alias:!0},g(s.attributes,r=>{let n=s.propertyTypes[r],o=B(r);e[o]=i.getPropertySettings(r,n)}),g(s.properties,r=>{let n=s.propertyTypes[r],o=B(r);e[o]=i.getPropertySettings(r,n)}),g(s.optionAttributes,(r,n)=>{let o=B(n);e[o]={type:String,noAccessor:!0,alias:!0,attribute:n}})),t&&g(t,(r,n)=>{let o={propertyOnly:He(r)};e[n]=r?.type?t:i.getPropertySettings(n,r?.constructor,o)}),g(e,(r,n)=>{let o=ae(n);o!==n&&!e[o]&&e[n]&&(e[o]={...e[n],noAccessor:!0,alias:!0})})),e}static getPropertySettings(e,t=String,{propertyOnly:s=!1}={}){let r={type:t,attribute:!0,hasChanged:(n,o)=>!H(n,o)};return s||t==Function?(r.attribute=!1,r.hasChanged=(n,o)=>!0):t==Boolean&&(r.converter={fromAttribute:(n,o)=>A(n,["false","0","null","undefined"])?!1:A(n,["",!0,"true"])?!0:!!n,toAttribute:(n,o)=>String(n)}),r}setDefaultSettings({defaultSettings:e={},componentSpec:t}){this.defaultSettings=e,g(e,(s,r)=>{s?.default!==void 0?this.defaultSettings[r]=s.default:this.defaultSettings[r]=s}),t?.defaultValues&&(this.defaultSettings={...t.defaultValues,...this.defaultSettings})}getSettingsFromConfig({componentSpec:e,properties:t}){let s={};return g(t,(r,n)=>{if(r.alias===!0)return;let o=this[n],a=o??this.defaultSettings[n]??(e?.defaultSettings||{})[n];a!==void 0&&(s[n]=a),e&&s[o]!==void 0&&(s[n]=!0)}),s}createSettingsProxy({componentSpec:e,properties:t}){let s=this;return s.settingsVars=new Map,new Proxy({},{get:(r,n)=>{let o=s.getSettings({componentSpec:e,properties:t}),a=se(o,n),l=s.settingsVars.get(n);return l?l.get():(l=new I(a),s.settingsVars.set(n,l)),a},set:(r,n,o,a)=>{s.setSetting(n,o);let l=s.settingsVars.get(n);return l?l.set(o):(l=new I(o),s.settingsVars.set(n,l)),!0}})}getUIClasses({componentSpec:e,properties:t}){if(!e)return;let s=[];g(e.attributes,n=>{let o=B(n),a=this[o];if(a){let l=e.allowedValues[n];e.propertyTypes[n]==Boolean||a==n&&l&&A(a,l)?s.push(n):l&&A(a,l)&&s.push(a),e.attributeClasses.includes(n)&&s.push(n)}});let r=me(s).join(" ");return r&&(r+=" "),r}isDarkMode(){return W?void 0:L(this).cssVar("dark-mode")=="true"}$(e,{root:t=this?.renderRoot||this.shadowRoot}={}){return t||console.error("Cannot query DOM until element has rendered."),L(e,{root:t})}$$(e){return L(e,{root:this.originalDOM.content})}call(e,{firstArg:t,additionalArgs:s,args:r=[this.component,this.$.bind(this)]}={}){if(t&&r.unshift(t),s&&r.push(...s),w(e))return e.apply(this,r)}};var Q=({template:i="",ast:e,css:t="",pageCSS:s="",tagName:r,delegatesFocus:n=!1,templateName:o=B(r),createComponent:a=D,events:l={},keys:f={},onCreated:h=D,onRendered:c=D,onDestroyed:u=D,onThemeChanged:m=D,onAttributeChanged:p=D,defaultSettings:y={},defaultState:x={},subTemplates:d={},renderingEngine:E,properties:R,componentSpec:T=!1,plural:U=!1,singularTag:V}={})=>{e||(e=new de(i).compile()),g(d,z=>{z.css&&(t+=z.css)}),s&&ut(s);let P=new Le({templateName:o,isPrototype:!0,renderingEngine:E,ast:e,css:t,events:l,keys:f,defaultState:x,subTemplates:d,onCreated:h,onRendered:c,onDestroyed:u,onThemeChanged:m,createComponent:a}),S;if(r){if(S=class extends ve{static get styles(){return qe(t)}static template=P;static properties=ve.getProperties({properties:R,componentSpec:T,defaultSettings:y});defaultSettings={};constructor(){super(),this.css=t,this.componentSpec=T,this.settings=this.createSettingsProxy({componentSpec:T,properties:S.properties}),this.setDefaultSettings({defaultSettings:y,componentSpec:T})}connectedCallback(){super.connectedCallback()}triggerAttributeChange(){g(S.properties,(q,N)=>{let oe=ae(N),Tt=this[N];!q.alias&&oe&&Tt===!0&&this.setAttribute(oe,""),Oe({el:this,attribute:oe,properties:S.properties,attributeValue:Tt,componentSpec:T})})}willUpdate(){W&&this.triggerAttributeChange(),this.template||(this.template=P.clone({data:this.getData(),element:this,renderRoot:this.renderRoot}),this.template.initialized||this.template.initialize(),this.component=this.template.instance,this.dataContext=this.template.data),super.willUpdate()}firstUpdated(){super.firstUpdated()}updated(){super.updated()}disconnectedCallback(){super.disconnectedCallback(),this.template&&this.template.onDestroyed(),P.onDestroyed()}adoptedCallback(){super.adoptedCallback(),this.call(onMoved)}attributeChangedCallback(q,N,oe){super.attributeChangedCallback(q,N,oe),Oe({el:this,attribute:q,attributeValue:oe,properties:S.properties,oldValue:N,componentSpec:T}),this.call(p,{args:[q,N,oe]})}getSettings(){return this.getSettingsFromConfig({componentSpec:T,properties:S.properties})}setSetting(q,N){this[q]=N}getData(){let N={...this.getSettings()};return W||(N.darkMode=this.isDarkMode()),T&&(N.ui=this.getUIClasses({componentSpec:T,properties:S.properties})),U===!0&&(N.plural=!0),N}render(){let q={...this.getData(),...this.tpl};return this.template.render(q)}},Ce&&customElements.get(r))return S;customElements.define(r,S)}return r?S:P};var fs=`<li class="{{classMap getClasses}} todo-item">
  {{#if editing}}
    <input type="text" class="edit" value={{todo.text}}>
  {{else}}
    <input class="toggle" type="checkbox" checked={{todo.completed}}>
    <label>{{todo.text}}</label>
    <button class="destroy"></button>
  {{/if}}
</li>
`;var ms=`.todo-list li .toggle {
    text-align: center;
    width: 40px;
    height: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    border: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none
}

.todo-list li .toggle {
    opacity: 0
}

.todo-list li .toggle+label {
    background-image: url(data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23949494%22%20stroke-width%3D%223%22/%3E%3C/svg%3E);
    background-repeat: no-repeat;
    background-position: center left
}

.todo-list li .toggle:checked+label {
    background-image: url(data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%2359A193%22%20stroke-width%3D%223%22%2F%3E%3Cpath%20fill%3D%22%233EA390%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22%2F%3E%3C%2Fsvg%3E)
}

.todo-list li label {
    overflow-wrap: break-word;
    padding: 15px 15px 15px 60px;
    display: block;
    line-height: 1.2;
    transition: color .4s;
    font-weight: 400;
    color: #484848
}

.todo-list li.completed label {
    color: #949494;
    text-decoration: line-through
}

.todo-list li .destroy {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    bottom: 0;
    width: 40px;
    height: 40px;
    margin: auto 0;
    font-size: 30px;
    color: #949494;
    transition: color .2s ease-out
}

.todo-list li .destroy:hover,.todo-list li .destroy:focus {
    color: #c18585
}

.todo-list li .destroy:after {
    content: "\xD7";
    display: block;
    height: 100%;
    line-height: 1.1
}

.todo-list li:hover .destroy {
    display: block
}

.todo-list li .edit {
    display: none
}

.todo-list li.editing:last-child {
    margin-bottom: -1px
}
`;var Gs=({self:i,data:e,reactiveVar:t,findParent:s,$:r})=>({editing:t(!1),getClasses(){return{completed:e.todo.completed,editing:i.editing.get()}},getTodos(){return s("todoList").todos},toggleCompleted(){let n=i.getTodos(),o=e.todo;n.setProperty(o._id,"completed",!o.completed)},changeText(n){i.getTodos().setProperty(e.todo._id,"text",n)},removeTodo(){i.getTodos().removeItem(e.todo._id)}}),Ks={"change .toggle"({event:i,self:e,$:t}){e.toggleCompleted()},"click .destroy"({event:i,self:e}){e.removeTodo()},"dblclick li"({event:i,self:e,$:t}){e.editing.set(!0),v.afterFlush(()=>{t("input.edit").focus()})},"keydown input.edit"({event:i,self:e,$:t}){i.key==="Enter"&&t(this).blur()},"blur input.edit"({event:i,self:e,$:t}){e.changeText(t(this).val()),e.editing.set(!1)}},gs=Q({templateName:"todoItem",template:fs,css:ms,createComponent:Gs,events:Ks});var ys=`<h1>Todos</h1>
<input type="text" class="new-todo" autofocus autocomplete="off" placeholder="What needs to be done?">
<div class="select-all"></div>
`;var xs=`h1 {
  position: absolute;
  top: -140px;
  width: 100%;
  font-size: 80px;
  font-weight: 200;
  text-align: center;
  color: #b83f45;
  text-rendering: optimizeLegibility;
}

.new-todo {
  padding: 16px 16px 16px 60px;
  height: 65px;
  border: none;
  background: rgba(0, 0, 0, 0.003);
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
}
`;var Zs=({self:i,$:e,reaction:t,signal:s,findParent:r})=>({allCompleted:s(!1),getTodoList(){return r("todoList")},getTodos(){return i.getTodoList().todos},completeAll(){i.getTodos().setArrayProperty("completed",!0)},completeNone(){i.getTodos().setArrayProperty("completed",!1)},addTodo(n){i.getTodos().push({_id:n,text:n,completed:!1})},calculateAllCompleted(){t(n=>{let o=i.allCompleted.get();n.firstRun||(o?i.completeAll():i.completeNone())})}}),Qs={"keydown input.new-todo"({event:i,self:e,$:t,$$:s}){if(i.key==="Enter"){let r=t(this).val();if(!r)return;e.addTodo(r),t(this).val(""),Reaction.afterFlush(()=>{e.getTodoList().scrollToBottom()})}}},ei=({self:i})=>{i.calculateAllCompleted()},bs=Q({templateName:"todoHeader",template:ys,css:xs,createComponent:Zs,onCreated:ei,events:Qs});var Es=`<span class="todo-count">
  {getIncomplete} item{maybeS getIncomplete.length} left
</span>
<ul class="filters">
  {#each filter in filters}
    <li>
      {#if isActiveFilter filter}
        <a class="selected">
          {capitalize filter}
        </a>
      {else}
        <a href="#/{filter}">
          {capitalize filter}
        </a>
      {/if}
    </li>
  {/each}
</ul>
{#if hasAnyCompleted}
  <div class="clear-completed">Clear Completed</div>
{/if}
`;var vs=`.footer {
    padding: 10px 15px;
    height: 20px;
    text-align: center;
    font-size: 15px;
    border-top: 1px solid #e6e6e6
}

.footer:before {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 50px;
    overflow: hidden;
    box-shadow: 0 1px 1px #0003,0 8px 0 -3px #f6f6f6,0 9px 1px -3px #0003,0 16px 0 -6px #f6f6f6,0 17px 2px -6px #0003
}

.todo-count {
    float: left;
    text-align: left
}

.todo-count strong {
    font-weight: 300
}

.filters {
    margin: 0;
    padding: 0;
    list-style: none;
    position: absolute;
    right: 0;
    left: 0
}

.filters li {
    display: inline
}

.filters li a {
    color: inherit;
    margin: 3px;
    padding: 3px 7px;
    text-decoration: none;
    border: 1px solid transparent;
    border-radius: 3px
}

.filters li a:hover {
    border-color: #db7676
}

.filters li a.selected {
    border-color: #ce4646
}

.clear-completed,html .clear-completed:active {
    float: right;
    position: relative;
    line-height: 19px;
    text-decoration: none;
    cursor: pointer
}

.clear-completed:hover {
    text-decoration: underline
}

.info {
    margin: 65px auto 0;
    color: #4d4d4d;
    font-size: 11px;
    text-shadow: 0 1px 0 rgba(255,255,255,.5);
    text-align: center
}

.info p {
    line-height: 1
}

.info a {
    color: inherit;
    text-decoration: none;
    font-weight: 400
}

.info a:hover {
    text-decoration: underline
}
`;var ii=({self:i,findParent:e,$:t})=>({filters:["all","active","complete"],todoList(){return e("todoList")},getIncomplete(){return i.todoList().todos.get().filter(r=>!r.completed)},hasAnyCompleted(){return i.todoList().todos.value.some(s=>s.completed)},isActiveFilter(s){return i.todoList().filter.get()==s},setFilter(s){i.todoList().filter.set(s)},scrollToBottom(){let s=t(".todo-list")[0];s.scrollTop=s.scrollHeight},clearCompleted(){i.todoList().todos.filter(s=>!s.completed)}}),ri={"click .clear-completed"({event:i,self:e}){e.clearCompleted()}},Ts=Q({templateName:"todoFooter",template:Es,css:vs,createComponent:ii,events:ri});var Ss=`<header class="header">
  {{>todoHeader}}
</header>
<main class="main">
  <div class="toggle-all-container">
    <input class="toggle-all" type="checkbox"/>
    <label class="toggle-all-label" htmlFor="toggle-all">Toggle All Input</label>
  </div>
  <ul class="todo-list">
    {{#each todo in getVisibleTodos}}
      {{>todoItem todo=todo index=index}}
    {{/each}}
  </ul>
</main>
<footer class="footer">
  {{>todoFooter}}
</footer>
`;var As=`
.visually-hidden {
    border: 0;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    position: absolute;
    white-space: nowrap
}

.toggle-all {
    width: 40px!important;
    height: 60px!important;
    right: auto!important
}

.toggle-all-label {
    pointer-events: none
}

html,body {
    margin: 0;
    padding: 0
}

button {
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    font-size: 100%;
    vertical-align: baseline;
    font-family: inherit;
    font-weight: inherit;
    color: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale
}

body {
    font: 14px Helvetica Neue,Helvetica,Arial,sans-serif;
    line-height: 1.4em;
    background: #f5f5f5;
    color: #111;
    min-width: 230px;
    max-width: 550px;
    margin: 0 auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 300
}

.hidden {
    display: none
}

.todoapp {
    background: #fff;
    margin: 130px 0 40px;
    position: relative;
    box-shadow: 0 2px 4px #0003,0 25px 50px #0000001a
}

.todoapp input::-webkit-input-placeholder {
    font-style: italic;
    font-weight: 400;
    color: #0006
}

.todoapp input::-moz-placeholder {
    font-style: italic;
    font-weight: 400;
    color: #0006
}

.todoapp input::input-placeholder {
    font-style: italic;
    font-weight: 400;
    color: #0006
}

.todoapp h1 {
    position: absolute;
    top: -140px;
    width: 100%;
    font-size: 80px;
    font-weight: 200;
    text-align: center;
    color: #b83f45;
    -webkit-text-rendering: optimizeLegibility;
    -moz-text-rendering: optimizeLegibility;
    text-rendering: optimizeLegibility
}

.new-todo,.edit {
    position: relative;
    margin: 0;
    width: 100%;
    font-size: 24px;
    font-family: inherit;
    font-weight: inherit;
    line-height: 1.4em;
    color: inherit;
    padding: 6px;
    border: 1px solid #999;
    box-shadow: inset 0 -1px 5px #0003;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale
}

.new-todo {
    padding: 16px 16px 16px 60px;
    height: 65px;
    border: none;
    background: rgba(0,0,0,.003);
    box-shadow: inset 0 -2px 1px #00000008
}

.main {
    position: relative;
    z-index: 2;
    border-top: 1px solid #e6e6e6
}

.toggle-all {
    width: 1px;
    height: 1px;
    border: none;
    opacity: 0;
    position: absolute;
    right: 100%;
    bottom: 100%
}

.toggle-all+label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 65px;
    font-size: 0;
    position: absolute;
    top: -65px;
    left: -0
}

.toggle-all+label:before {
    content: "\u276F";
    display: inline-block;
    font-size: 22px;
    color: #949494;
    padding: 10px 27px;
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg)
}

.toggle-all:checked+label:before {
    color: #484848
}

.todo-list {
    margin: 0;
    padding: 0;
    list-style: none
}

.todo-list li {
    position: relative;
    font-size: 24px;
    border-bottom: 1px solid #ededed
}

.todo-list li:last-child {
    border-bottom: none
}

.todo-list li.editing {
    border-bottom: none;
    padding: 0
}

.todo-list li.editing .edit {
    display: block;
    width: calc(100% - 43px);
    padding: 12px 16px;
    margin: 0 0 0 43px
}

.todo-list li.editing .view {
    display: none
}


@media screen and (-webkit-min-device-pixel-ratio: 0) {
    .toggle-all,.todo-list li .toggle {
        background:none
    }

    .todo-list li .toggle {
        height: 40px
    }
}

@media (max-width: 430px) {
    .footer {
        height:50px
    }

    .filters {
        bottom: 10px
    }
}

:focus,.toggle:focus+label,.toggle-all:focus+label {
    box-shadow: 0 0 2px 2px #cf7d7d;
    outline: 0
}

hr {
    margin: 20px 0;
    border: 0;
    border-top: 1px dashed #c5c5c5;
    border-bottom: 1px dashed #f7f7f7
}

.learn a {
    font-weight: 400;
    text-decoration: none;
    color: #b83f45
}

.learn a:hover {
    text-decoration: underline;
    color: #787e7e
}

.learn h3,.learn h4,.learn h5 {
    margin: 10px 0;
    font-weight: 500;
    line-height: 1.2;
    color: #000
}

.learn h3 {
    font-size: 24px
}

.learn h4 {
    font-size: 18px
}

.learn h5 {
    margin-bottom: 0;
    font-size: 14px
}

.learn ul {
    padding: 0;
    margin: 0 0 30px 25px
}

.learn li {
    line-height: 20px
}

.learn p {
    font-size: 15px;
    font-weight: 300;
    line-height: 1.3;
    margin-top: 0;
    margin-bottom: 0
}

#issue-count {
    display: none
}

.quote {
    border: none;
    margin: 20px 0 60px
}

.quote p {
    font-style: italic
}

.quote p:before {
    content: "\u201C";
    font-size: 50px;
    opacity: .15;
    position: absolute;
    top: -20px;
    left: 3px
}

.quote p:after {
    content: "\u201D";
    font-size: 50px;
    opacity: .15;
    position: absolute;
    bottom: -42px;
    right: 3px
}

.quote footer {
    position: absolute;
    bottom: -40px;
    right: 0
}

.quote footer img {
    border-radius: 3px
}

.quote footer a {
    margin-left: 5px;
    vertical-align: middle
}

.speech-bubble {
    position: relative;
    padding: 10px;
    background: rgba(0,0,0,.04);
    border-radius: 5px
}

.speech-bubble:after {
    content: "";
    position: absolute;
    top: 100%;
    right: 30px;
    border: 13px solid transparent;
    border-top-color: #0000000a
}

.learn-bar>.learn {
    position: absolute;
    width: 272px;
    top: 8px;
    left: -300px;
    padding: 10px;
    border-radius: 5px;
    background-color: #fff9;
    transition-property: left;
    transition-duration: .5s
}

@media (min-width: 899px) {
    .learn-bar {
        width:auto;
        padding-left: 300px
    }

    .learn-bar>.learn {
        left: 8px
    }
}
`;var ai=({self:i,signal:e,$:t})=>({todos:e([{_id:"1",completed:!1,text:"Take out trash"},{_id:"2",completed:!1,text:"Mow lawn"},{_id:"3",completed:!1,text:"Do dishes"},{_id:"4",completed:!1,text:"Go to work"},{_id:"5",completed:!1,text:"Play the trombone"},{_id:"6",completed:!1,text:"Win the lottery"},{_id:"7",completed:!1,text:"Take children to daycare"},{_id:"8",completed:!1,text:"Buy easter eggs"}]),filter:e("all"),getVisibleTodos(){let s=i.filter.get(),r=i.todos.get();return g(r,n=>{n._id||(n._id=n.text)}),r.filter(n=>s=="active"?!n.completed:s=="complete"?n.completed:!0)},scrollToBottom(){let s=t(".todo-list").get(0);s.scrollTop=s.scrollHeight},getRouteFilter(){return window.location.hash.substring(2)||"all"},setRouteFilter(){i.filter.set(i.getRouteFilter())},removeRouter(){t(window).off(i.hashEvent)}}),li=({self:i,isClient:e})=>{e&&i.setRouteFilter()},ci=({self:i})=>{i.removeRouter()},hi={"global hashchange window"({self:i}){i.setRouteFilter()},"change .toggle-all"({event:i,self:e,findChild:t,$:s}){let r=t("todoHeader");s(i.target).attr("checked",!s(i.target).attr("checked")),r.allCompleted.toggle()}},ui=Q({tagName:"todo-list",subTemplates:{todoHeader:bs,todoItem:gs,todoFooter:Ts},template:Ss,css:As,events:hi,createComponent:ai,onRendered:li,onDestroyed:ci});export{ui as TodoList};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/unsafe-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/if-defined.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/repeat.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=todo-list.js.map
