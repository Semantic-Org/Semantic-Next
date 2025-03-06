var _=n=>n!==null&&typeof n=="object",at=n=>_(n)&&n.constructor===Object,w=n=>typeof n=="string";var ve=n=>typeof n=="number",E=n=>Array.isArray(n);var N=n=>typeof n=="function"||!1;var Vt=n=>typeof window>"u"?!0:n instanceof Element||n instanceof Document||n===window||n instanceof DocumentFragment;var he=n=>{if(n==null)return!0;if(E(n)||w(n))return n.length===0;for(let t in n)if(n[t])return!1;return!0},Ut=n=>{if(n===null||typeof n!="object")return!1;let e=Object.getPrototypeOf(n).constructor.name;return!["Object","Array","Date","RegExp","Map","Set","Error","Uint8Array","Int8Array","Uint16Array","Int16Array","Uint32Array","Int32Array","Float32Array","Float64Array","BigInt64Array","BigUint64Array","NodeList"].includes(e)};var h=(n,t,e)=>{if(n==null)return n;let o=e?t.bind(e):t;if((_(n)||N(n))&&n.length!==void 0&&typeof n.length=="number"&&(n=Array.from(n)),E(n))for(let a=0;a<n.length&&o(n[a],a,n)!==!1;++a);else{let a=Object.keys(n);for(let r of a)if(o(n[r],r,n)===!1)break}return n};var St=n=>n.replace(/([.*+?^=!:${}()|\[\]\/\\])/g,"\\$1"),eo=n=>{let t={"&":"&amp","<":"&lt",">":"&gt",'"':"&quot","'":"&#39"},e=/[&<>"']/g,o=RegExp(e.source);return n&&o.test(n)?n.replace(e,a=>t[a]):n};var Ht=(n="")=>(n||"").replace(/\s+/g,"-").replace(/[^\w-]+/g,"").replace(/_/g,"-").toLowerCase(),oo=n=>{if(n=parseInt(n,10),n===0)return"0";let t="",e="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";for(;n>0;)t=e[n%e.length]+t,n=Math.floor(n/e.length);return t};function Ct(n,{prettify:t=!1,seed:e=305419896}={}){let i;if(n==null)i=new TextEncoder().encode("");else if(n&&n.toString===Object.prototype.toString&&typeof n=="object")try{i=new TextEncoder().encode(JSON.stringify(n))}catch(c){return console.error("Error serializing input",c),0}else i=new TextEncoder().encode(n.toString());let s;if(i.length<=8){s=e;for(let c=0;c<i.length;c++)s^=i[c],s=Math.imul(s,2654435761),s^=s>>>13}else{s=e;for(let c=0;c<i.length;c++)s=Math.imul(s^i[c],2654435761),s=s<<13|s>>>19,s=Math.imul(s,2246822519);s^=i.length}return s^=s>>>16,s=Math.imul(s,3266489917),s^=s>>>13,t?oo(s>>>0):s>>>0}var no=()=>{let n=Math.random()*1e15;return oo(n)};var C=n=>n,J=n=>N(n)?n:()=>n;var ao=(n,t)=>{typeof t=="number"&&(t={delay:t});let{delay:e=200,immediate:o=!1}=t,a,r=!1;function i(...s){let c=()=>{a=null,o||n.apply(this,s),r=!1},m=o&&!a;clearTimeout(a),a=setTimeout(c,e),m&&!r&&(r=!0,n.apply(this,s))}return i.cancel=()=>{clearTimeout(a),a=null,r=!1},i};var ro=n=>{if(_(n))return Object.keys(n)},ge=n=>{if(_(n))return Object.values(n)},io=(n,t)=>Object.fromEntries(Object.entries(n).filter(([e,o])=>t(o,e))),W=(n,t)=>Object.fromEntries(Object.entries(n).map(([e,o])=>[e,t(o,e)])),so=(n,...t)=>(t.forEach(e=>{let o,a;if(e)for(a in e)o=Object.getOwnPropertyDescriptor(e,a),o===void 0?n[a]=e[a]:Object.defineProperty(n,a,o)}),n);var Ft=n=>{if(E(n))return n;let t=[];return h(n,(e,o)=>{t.push({value:e,key:o})}),t},D=function(n,t=""){if(typeof t!="string")return;function e(i){let s=i.substring(0,i.indexOf("[")),c=parseInt(i.substring(i.indexOf("[")+1,i.indexOf("]")),10);return{key:s,index:c}}function o(i){let s=i.indexOf(".");if(s!==-1){let c=i.indexOf(".",s+1);if(c!==-1)return i.slice(0,c)}return i}if(n===null||!_(n))return;let a=t.split("."),r=n;for(let i=0;i<a.length;i++){if(r===null||!_(r))return;let s=a[i];if(s.includes("[")){let{key:c,index:m}=e(s);if(c in r&&E(r[c])&&m<r[c].length)r=r[c][m];else return}else if(s in r)r=r[s];else{let c=a.slice(i).join(".");if(c in r){r=r[c];break}else{let m=o(`${s}.${a[i+1]}`);if(m in r)r=r[m],i++;else return}}}return r};var fe=n=>{let t={},e=(o,a)=>{E(t[o])?t[o].push(a):t[o]?t[o]=[t[o],a]:t[o]=a};return Object.keys(n).forEach(o=>{E(n[o])?h(n[o],a=>{e(a,o)}):e(n[o],o)}),t};var H=(n,t,e={})=>{if(n===t)return!0;if(n&&t&&typeof n=="object"&&typeof t=="object"){if(n.constructor!==t.constructor)return!1;let o,a,r;if(Array.isArray(n)){if(o=n.length,o!=t.length)return!1;for(a=o;a--!==0;)if(!H(n[a],t[a]))return!1;return!0}if(n instanceof Map&&t instanceof Map){if(n.size!==t.size)return!1;for(a of n.entries())if(!t.has(a[0]))return!1;for(a of n.entries())if(!H(a[1],t.get(a[0])))return!1;return!0}if(n instanceof Set&&t instanceof Set){if(n.size!==t.size)return!1;for(a of n.entries())if(!t.has(a[0]))return!1;return!0}if(ArrayBuffer.isView(n)&&ArrayBuffer.isView(t)){if(o=n.length,o!=t.length)return!1;for(a=o;a--!==0;)if(n[a]!==t[a])return!1;return!0}if(n.constructor===RegExp)return n.source===t.source&&n.flags===t.flags;if(n.valueOf!==Object.prototype.valueOf)return n.valueOf()===t.valueOf();if(n.toString!==Object.prototype.toString)return n.toString()===t.toString();if(r=Object.keys(n),o=r.length,o!==Object.keys(t).length)return!1;for(a=o;a--!==0;)if(!Object.prototype.hasOwnProperty.call(t,r[a]))return!1;for(a=o;a--!==0;){let i=r[a];if(!H(n[i],t[i]))return!1}return!0}return n!==n&&t!==t};var rt=n=>Array.from(new Set(n));var gt=(n=[],t=1)=>{let{length:e}=n;if(e)return t===1?n[e-1]:n.slice(Math.max(e-t,0))};var co=(n=[],t)=>{let e;return h(n,(o,a)=>{if(t(o,a,n))return e=o,!1}),e},ft=(n=[],t)=>{let e=-1;return h(n,(o,a)=>{if(t(o,a,n))return e=a,!1}),e},lo=(n=[],t)=>{let e=N(t)?t:a=>H(a,t),o=ft(n,e);return o>-1?(n.splice(o,1),!0):!1},k=(n,t=[])=>t.indexOf(n)>-1,uo=(n,t,e=1)=>{t||(t=n,n=0);let o=t-n;return Array(o).fill(void 0).map((a,r)=>r*e+n)};var Bt=(n=[])=>n.reduce((t,e)=>Array.isArray(e)?t.concat(Bt(e)):t.concat(e),[]),Mn=(n,t)=>n?.some?n.some(t):!1,mo=Mn;var Pn=58;var we=(...n)=>{if(n.length===0)return[];if(n.length===1)return[...new Set(n[0])];let e=n.reduce((i,s)=>i+s.length,0)>=Pn,[o,...a]=n,r=[...new Set(o)];if(e){let i=a.map(s=>new Set(s));return r.filter(s=>!i.some(c=>c.has(s)))}return r.filter(i=>!a.some(s=>s.includes(i)))};var bo=n=>{let t=n?.key;if(!t)return"";let e="";n.ctrlKey&&t!=="Control"&&(e+="ctrl+"),n.altKey&&t!=="Alt"&&(e+="alt+"),n.shiftKey&&t!=="Shift"&&(e+="shift+"),n.metaKey&&t!=="Meta"&&(e+="meta+");let o={Control:"ctrl",Escape:"esc"," ":"space"};return t=t.replace("Arrow",""),e+=o[t]||t.toLowerCase(),e};var Y=(n,t=new Map)=>{if(!n||typeof n!="object")return n;if(t.has(n))return t.get(n);let e;if(n.nodeType&&"cloneNode"in n)e=n.cloneNode(!0),t.set(n,e);else if(n instanceof Date)e=new Date(n.getTime()),t.set(n,e);else if(n instanceof RegExp)e=new RegExp(n),t.set(n,e);else if(Array.isArray(n)){e=new Array(n.length),t.set(n,e);for(let o=0;o<n.length;o++)e[o]=Y(n[o],t)}else if(n instanceof Map){e=new Map,t.set(n,e);for(let[o,a]of n.entries())e.set(o,Y(a,t))}else if(n instanceof Set){e=new Set,t.set(n,e);for(let o of n)e.add(Y(o,t))}else if(n instanceof Object){e={},t.set(n,e);for(let[o,a]of Object.entries(n))e[o]=Y(a,t)}return e};var qt=function(n,t="LLL",{locale:e="default",hour12:o=!0,timezone:a="UTC",...r}={}){if(isNaN(n.getTime()))return"Invalid Date";let i=new Date(n.getTime());a==="local"&&(a=Intl.DateTimeFormat().resolvedOptions().timeZone);let s=z=>z<10?`0${z}`:z,c={timeZone:a,year:"numeric",month:"long",day:"numeric",weekday:"long",hour:"numeric",minute:"numeric",second:"numeric",hour12:o,...r},l=new Intl.DateTimeFormat(e,c).formatToParts(i).reduce((z,T)=>(z[T.type]=T.value,z),{}),{year:u,month:d,day:v,weekday:b,hour:g,minute:f,second:p,dayPeriod:S}=l;g==="24"&&(g="00");let P=new Date(n.toLocaleString("en-US",{timeZone:a})),A={YYYY:u,YY:u.slice(-2),MMMM:d,MMM:d.slice(0,3),MM:s(P.getMonth()+1),M:P.getMonth()+1,DD:s(P.getDate()),D:P.getDate(),Do:v+["th","st","nd","rd"][v%10>3?0:(v%100-v%10!==10)*v%10],dddd:b,ddd:b.slice(0,3),HH:g.padStart(2,"0"),hh:o?(g%12||12).toString().padStart(2,"0"):g.padStart(2,"0"),h:o?(g%12||12).toString():g,mm:f,ss:p,a:o&&S?S.toLowerCase():""},B={LT:"h:mm a",LTS:"h:mm:ss a",L:"MM/DD/YYYY",l:"M/D/YYYY",LL:"MMMM D, YYYY",ll:"MMM D, YYYY",LLL:"MMMM D, YYYY h:mm a",lll:"MMM D, YYYY h:mm a",LLLL:"dddd, MMMM D, YYYY h:mm a",llll:"ddd, MMM D, YYYY h:mm a"};return t=t.trim(),(B[t]||t).replace(/\b(?:YYYY|YY|MMMM|MMM|MM|M|DD|D|Do|dddd|ddd|HH|hh|h|mm|ss|a)\b/g,z=>A[z]).replace(/\[(.+?)\]/g,(z,T)=>T).trim()};var At=(n,{errorType:t=Error,metadata:e={},onError:o=null,removeStackLines:a=1}={})=>{let r=new t(n);if(Object.assign(r,e),r.stack){let s=r.stack.split(`
`);s.splice(1,a),r.stack=s.join(`
`)}let i=()=>{throw typeof global.onError=="function"&&global.onError(r),r};typeof queueMicrotask=="function"?queueMicrotask(i):setTimeout(i,0)};var Z=typeof window>"u",Tt=typeof window<"u";var G=(n="")=>n.replace(/-./g,t=>t[1].toUpperCase()),lt=(n="")=>n.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),jt=(n="")=>n.charAt(0).toUpperCase()+n.slice(1);var Et=(n="")=>{let t=["the","a","an","and","but","for","at","by","from","to","in","on","of","or","nor","with","as"];if(w(n))return n.toLowerCase().split(" ").map((e,o)=>o===0||!t.includes(e)?e.charAt(0).toUpperCase()+e.slice(1):e).join(" ")},po=(n,{separator:t=", ",lastSeparator:e=" and ",oxford:o=!0,quotes:a=!1,transform:r=C}={})=>{if(!E(n)||n.length===0)return"";let i=n.map(m=>{let l=m;return N(r)&&(l=r(m)),a?`"${l}"`:l});if(i.length===1)return i[0];if(i.length===2)return i.join(e);let s=i.pop(),c=i.join(t);return o&&t.trim()!==e.trim()&&(c+=t.trim()),c+e+s};var ke=(n,t="")=>{t=t.toLowerCase();let e=(r,i)=>{if(r.type===CSSRule.STYLE_RULE)return`${i} ${r.selectorText} { ${r.style.cssText} }`;if(r.type===CSSRule.MEDIA_RULE||r.type===CSSRule.SUPPORTS_RULE)return`@${r.type===CSSRule.MEDIA_RULE?"media":"supports"} ${r.conditionText||""} { ${e(r.cssText,i)} }`;if(r.type===CSSRule.LAYER_STATEMENT_RULE||r.type==0&&r.cssRules){let s=[];return h(r.cssRules,c=>{s.push(e(c,i))}),`@layer ${r.name} { ${s.join(" ")} }`}else return r.cssText},o=new CSSStyleSheet;o.replaceSync(n);let a=[];return h(o.cssRules,r=>{a.push(e(r,t))}),a.join(`
`)};var xe=(n,t,{scopeSelector:e}={})=>{if(Z)return;t||(t=document);let o=Ct(n);if(t.cssHashes||(t.cssHashes=[]),t.cssHashes.includes(o))return;t.cssHashes.push(o);let a=new CSSStyleSheet;e&&(n=ke(n,e)),a.id=o,a.replaceSync(n),t.adoptedStyleSheets=[...t.adoptedStyleSheets,a]};var Wt=globalThis,Gt=Wt.ShadowRoot&&(Wt.ShadyCSS===void 0||Wt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ho=Symbol(),vo=new WeakMap,Yt=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==ho)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Gt&&t===void 0){let o=e!==void 0&&e.length===1;o&&(t=vo.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&vo.set(e,t))}return t}toString(){return this.cssText}},Kt=n=>new Yt(typeof n=="string"?n:n+"",void 0,ho);var ye=(n,t)=>{if(Gt)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let o=document.createElement("style"),a=Wt.litNonce;a!==void 0&&o.setAttribute("nonce",a),o.textContent=e.cssText,n.appendChild(o)}},Xt=Gt?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(let o of t.cssRules)e+=o.cssText;return Kt(e)})(n):n;var{is:Rn,defineProperty:zn,getOwnPropertyDescriptor:_n,getOwnPropertyNames:Dn,getOwnPropertySymbols:On,getPrototypeOf:Vn}=Object,Jt=globalThis,go=Jt.trustedTypes,Un=go?go.emptyScript:"",Hn=Jt.reactiveElementPolyfillSupport,$t=(n,t)=>n,Se={toAttribute(n,t){switch(t){case Boolean:n=n?Un:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},wo=(n,t)=>!Rn(n,t),fo={attribute:!0,type:String,converter:Se,reflect:!1,hasChanged:wo};Symbol.metadata??=Symbol("metadata"),Jt.litPropertyMetadata??=new WeakMap;var tt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=fo){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){let o=Symbol(),a=this.getPropertyDescriptor(t,o,e);a!==void 0&&zn(this.prototype,t,a)}}static getPropertyDescriptor(t,e,o){let{get:a,set:r}=_n(this.prototype,t)??{get(){return this[e]},set(i){this[e]=i}};return{get(){return a?.call(this)},set(i){let s=a?.call(this);r.call(this,i),this.requestUpdate(t,s,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??fo}static _$Ei(){if(this.hasOwnProperty($t("elementProperties")))return;let t=Vn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($t("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($t("properties"))){let e=this.properties,o=[...Dn(e),...On(e)];for(let a of o)this.createProperty(a,e[a])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[o,a]of e)this.elementProperties.set(o,a)}this._$Eh=new Map;for(let[e,o]of this.elementProperties){let a=this._$Eu(e,o);a!==void 0&&this._$Eh.set(a,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let o=new Set(t.flat(1/0).reverse());for(let a of o)e.unshift(Xt(a))}else t!==void 0&&e.push(Xt(t));return e}static _$Eu(t,e){let o=e.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ye(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$EC(t,e){let o=this.constructor.elementProperties.get(t),a=this.constructor._$Eu(t,o);if(a!==void 0&&o.reflect===!0){let r=(o.converter?.toAttribute!==void 0?o.converter:Se).toAttribute(e,o.type);this._$Em=t,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(t,e){let o=this.constructor,a=o._$Eh.get(t);if(a!==void 0&&this._$Em!==a){let r=o.getPropertyOptions(a),i=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Se;this._$Em=a,this[a]=i.fromAttribute(e,r.type),this._$Em=null}}requestUpdate(t,e,o){if(t!==void 0){if(o??=this.constructor.getPropertyOptions(t),!(o.hasChanged??wo)(this[t],e))return;this.P(t,e,o)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,o){this._$AL.has(t)||this._$AL.set(t,e),o.reflect===!0&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[a,r]of o)r.wrapped!==!0||this._$AL.has(a)||this[a]===void 0||this.P(a,this[a],r)}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(o=>o.hostUpdate?.()),this.update(e)):this._$EU()}catch(o){throw t=!1,this._$EU(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach(e=>this._$EC(e,this[e])),this._$EU()}updated(t){}firstUpdated(t){}};tt.elementStyles=[],tt.shadowRootOptions={mode:"open"},tt[$t("elementProperties")]=new Map,tt[$t("finalized")]=new Map,Hn?.({ReactiveElement:tt}),(Jt.reactiveElementVersions??=[]).push("2.0.4");var Ae=globalThis,Zt=Ae.trustedTypes,ko=Zt?Zt.createPolicy("lit-html",{createHTML:n=>n}):void 0,Te="$lit$",et=`lit$${Math.random().toFixed(9).slice(2)}$`,Ee="?"+et,Fn=`<${Ee}>`,mt=document,Lt=()=>mt.createComment(""),Nt=n=>n===null||typeof n!="object"&&typeof n!="function",$e=Array.isArray,To=n=>$e(n)||typeof n?.[Symbol.iterator]=="function",Ce=`[ 	
\f\r]`,It=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xo=/-->/g,yo=/>/g,ut=RegExp(`>|${Ce}(?:([^\\s"'>=/]+)(${Ce}*=${Ce}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),So=/'/g,Co=/"/g,Eo=/^(?:script|style|textarea|title)$/i,Ie=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),Le=Ie(1),$o=Ie(2),wi=Ie(3),K=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),Ao=new WeakMap,dt=mt.createTreeWalker(mt,129);function Io(n,t){if(!$e(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return ko!==void 0?ko.createHTML(t):t}var Lo=(n,t)=>{let e=n.length-1,o=[],a,r=t===2?"<svg>":t===3?"<math>":"",i=It;for(let s=0;s<e;s++){let c=n[s],m,l,u=-1,d=0;for(;d<c.length&&(i.lastIndex=d,l=i.exec(c),l!==null);)d=i.lastIndex,i===It?l[1]==="!--"?i=xo:l[1]!==void 0?i=yo:l[2]!==void 0?(Eo.test(l[2])&&(a=RegExp("</"+l[2],"g")),i=ut):l[3]!==void 0&&(i=ut):i===ut?l[0]===">"?(i=a??It,u=-1):l[1]===void 0?u=-2:(u=i.lastIndex-l[2].length,m=l[1],i=l[3]===void 0?ut:l[3]==='"'?Co:So):i===Co||i===So?i=ut:i===xo||i===yo?i=It:(i=ut,a=void 0);let v=i===ut&&n[s+1].startsWith("/>")?" ":"";r+=i===It?c+Fn:u>=0?(o.push(m),c.slice(0,u)+Te+c.slice(u)+et+v):c+et+(u===-2?s:v)}return[Io(n,r+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]},Mt=class n{constructor({strings:t,_$litType$:e},o){let a;this.parts=[];let r=0,i=0,s=t.length-1,c=this.parts,[m,l]=Lo(t,e);if(this.el=n.createElement(m,o),dt.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(a=dt.nextNode())!==null&&c.length<s;){if(a.nodeType===1){if(a.hasAttributes())for(let u of a.getAttributeNames())if(u.endsWith(Te)){let d=l[i++],v=a.getAttribute(u).split(et),b=/([.?@])?(.*)/.exec(d);c.push({type:1,index:r,name:b[2],strings:v,ctor:b[1]==="."?te:b[1]==="?"?ee:b[1]==="@"?oe:pt}),a.removeAttribute(u)}else u.startsWith(et)&&(c.push({type:6,index:r}),a.removeAttribute(u));if(Eo.test(a.tagName)){let u=a.textContent.split(et),d=u.length-1;if(d>0){a.textContent=Zt?Zt.emptyScript:"";for(let v=0;v<d;v++)a.append(u[v],Lt()),dt.nextNode(),c.push({type:2,index:++r});a.append(u[d],Lt())}}}else if(a.nodeType===8)if(a.data===Ee)c.push({type:2,index:r});else{let u=-1;for(;(u=a.data.indexOf(et,u+1))!==-1;)c.push({type:7,index:r}),u+=et.length-1}r++}}static createElement(t,e){let o=mt.createElement("template");return o.innerHTML=t,o}};function bt(n,t,e=n,o){if(t===K)return t;let a=o!==void 0?e._$Co?.[o]:e._$Cl,r=Nt(t)?void 0:t._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(n),a._$AT(n,e,o)),o!==void 0?(e._$Co??=[])[o]=a:e._$Cl=a),a!==void 0&&(t=bt(n,a._$AS(n,t.values),a,o)),t}var Qt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:o}=this._$AD,a=(t?.creationScope??mt).importNode(e,!0);dt.currentNode=a;let r=dt.nextNode(),i=0,s=0,c=o[0];for(;c!==void 0;){if(i===c.index){let m;c.type===2?m=new wt(r,r.nextSibling,this,t):c.type===1?m=new c.ctor(r,c.name,c.strings,this,t):c.type===6&&(m=new ne(r,this,t)),this._$AV.push(m),c=o[++s]}i!==c?.index&&(r=dt.nextNode(),i++)}return dt.currentNode=mt,a}p(t){let e=0;for(let o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}},wt=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,o,a){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=bt(this,t,e),Nt(t)?t===x||t==null||t===""?(this._$AH!==x&&this._$AR(),this._$AH=x):t!==this._$AH&&t!==K&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):To(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==x&&Nt(this._$AH)?this._$AA.nextSibling.data=t:this.T(mt.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:o}=t,a=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=Mt.createElement(Io(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===a)this._$AH.p(e);else{let r=new Qt(a,this),i=r.u(this.options);r.p(e),this.T(i),this._$AH=r}}_$AC(t){let e=Ao.get(t.strings);return e===void 0&&Ao.set(t.strings,e=new Mt(t)),e}k(t){$e(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,o,a=0;for(let r of t)a===e.length?e.push(o=new n(this.O(Lt()),this.O(Lt()),this,this.options)):o=e[a],o._$AI(r),a++;a<e.length&&(this._$AR(o&&o._$AB.nextSibling,a),e.length=a)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){let o=t.nextSibling;t.remove(),t=o}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},pt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,a,r){this.type=1,this._$AH=x,this._$AN=void 0,this.element=t,this.name=e,this._$AM=a,this.options=r,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=x}_$AI(t,e=this,o,a){let r=this.strings,i=!1;if(r===void 0)t=bt(this,t,e,0),i=!Nt(t)||t!==this._$AH&&t!==K,i&&(this._$AH=t);else{let s=t,c,m;for(t=r[0],c=0;c<r.length-1;c++)m=bt(this,s[o+c],e,c),m===K&&(m=this._$AH[c]),i||=!Nt(m)||m!==this._$AH[c],m===x?t=x:t!==x&&(t+=(m??"")+r[c+1]),this._$AH[c]=m}i&&!a&&this.j(t)}j(t){t===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},te=class extends pt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===x?void 0:t}},ee=class extends pt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==x)}},oe=class extends pt{constructor(t,e,o,a,r){super(t,e,o,a,r),this.type=5}_$AI(t,e=this){if((t=bt(this,t,e,0)??x)===K)return;let o=this._$AH,a=t===x&&o!==x||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,r=t!==x&&(o===x||a);a&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ne=class{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){bt(this,t)}},No={M:Te,P:et,A:Ee,C:1,L:Lo,R:Qt,D:To,V:bt,I:wt,H:pt,N:ee,U:oe,B:te,F:ne},Bn=Ae.litHtmlPolyfillSupport;Bn?.(Mt,wt),(Ae.litHtmlVersions??=[]).push("3.2.1");var Mo=(n,t,e)=>{let o=e?.renderBefore??t,a=o._$litPart$;if(a===void 0){let r=e?.renderBefore??null;o._$litPart$=a=new wt(t.insertBefore(Lt(),r),r,void 0,e??{})}return a._$AI(n),a};var ot=class extends tt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Mo(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return K}};ot._$litElement$=!0,ot.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:ot});var qn=globalThis.litElementPolyfillSupport;qn?.({LitElement:ot});(globalThis.litElementVersions??=[]).push("4.1.1");var Pt=class n{static DEBUG_MODE=!0;constructor(t){this.input=t,this.pos=0}matches(t){return t.test(this.rest())}rest(){return this.input.slice(this.pos)}step(t=1){this.isEOF()||(this.pos=this.pos+t)}rewind(t=1){this.pos!==0&&(this.pos=this.pos-t)}isEOF(){return this.pos>=this.input.length}peek(){return this.input.charAt(this.pos)}consume(t){let e=typeof t=="string"?new RegExp(St(t)):new RegExp(t),o=this.input.substring(this.pos),a=e.exec(o);return a&&a.index===0?(this.pos+=a[0].length,a[0]):null}consumeUntil(t){let o=(typeof t=="string"?new RegExp(St(t)):new RegExp(t)).exec(this.input.substring(this.pos));if(!o){let r=this.input.substr(this.pos);return this.pos=this.input.length,r}let a=this.input.substring(this.pos,this.pos+o.index);return this.pos+=o.index,a}returnTo(t){if(!t)return;let e=typeof t=="string"?new RegExp(St(t),"gm"):new RegExp(t,"gm"),o=null,a,r=this.input.substring(0,this.pos);for(;(a=e.exec(r))!==null;)o=a;if(o){let i=this.input.substring(0,o.index);return this.pos=o.index,i}}getContext(){let t=!1,e=this.pos-1,o;for(;e>=0&&this.input[e]!==">";){if(this.input[e]==="<"){t=!0,o=e;break}e--}if(t){let a=this.input.substring(o,this.pos),r=/([a-zA-Z-]+)(?=\s*=\s*[^=]*$)/,i=a.match(r),s=i?i[1]:"",c=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","defer","disabled","formnovalidate","inert","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected"],m=!1;if(c.includes(s))m=!0;else{let l=/([a-zA-Z-]+)(?=\s*=\s*(\"|\')\s*[^=]*$)/,u=a.match(l),d=u?u[1]:"";m=s!==d}if(s)return{insideTag:!0,attribute:s,booleanAttribute:m}}return{insideTag:t}}fatal(t){t=t||"Parse error";let o=(typeof this.input=="string"?this.input:"").split(`
`),a=0,r=0;for(let b of o){if(r+b.length+1>this.pos)break;r+=b.length+1,a++}let i=5,s=5,c=Math.max(0,a-i),m=Math.min(o.length,a+s+1),l=o.slice(c,m),u=l.map((b,g)=>`%c${b}`).join(`
`),d="color: grey",v="color: red; font-weight: bold";if(n.DEBUG_MODE){if(globalThis.document){let g="";h(l,(p,S)=>{let P=S<i||S>i?d:v;g+=`<div style="${P}">${p}</div>`});let f=`
          <div style="padding: 1rem; font-size: 14px;">
            <h2>Could not render template</h2>
            <h3>${t}</h3>
            <code style="margin-top: 1rem; display: block; background-color: #EFEFEF; padding: 0.25rem 1rem;border-left: 3px solid #888"><pre>${g}</pre></code>
          </div>
        `;document.body.innerHTML=f}throw console.error(t+`
`+u,...l.map((g,f)=>a-c===f?v:d)),new Error(t)}}};var vt=class n{constructor(t){this.templateString=t||"",this.snippets={}}static singleBracketRegExp={IF:/^{\s*#if\s+/,ELSEIF:/^{\s*else\s*if\s+/,ELSE:/^{\s*else\s*/,EACH:/^{\s*#each\s+/,SNIPPET:/^{\s*#snippet\s+/,CLOSE_IF:/^{\s*\/(if)\s*/,CLOSE_EACH:/^{\s*\/(each)\s*/,CLOSE_SNIPPET:/^{\s*\/(snippet)\s*/,SLOT:/^{>\s*slot\s*/,TEMPLATE:/^{>\s*/,HTML_EXPRESSION:/^{\s*#html\s*/,EXPRESSION:/^{\s*/};static singleBracketParserRegExp={NEXT_TAG:/(\{|\<svg|\<\/svg)/,EXPRESSION_START:/\{/,EXPRESSION_END:/\}/,TAG_CLOSE:/\>/};static doubleBracketRegExp={IF:/^{{\s*#if\s+/,ELSEIF:/^{{\s*else\s*if\s+/,ELSE:/^{{\s*else\s*/,EACH:/^{{\s*#each\s+/,SNIPPET:/^{{\s*#snippet\s+/,CLOSE_IF:/^{{\s*\/(if)\s*/,CLOSE_EACH:/^{{\s*\/(each)\s*/,CLOSE_SNIPPET:/^{{\s*\/(snippet)\s*/,SLOT:/^{{>\s*slot\s*/,TEMPLATE:/^{{>\s*/,HTML_EXPRESSION:/^{{\s*#html\s*/,EXPRESSION:/^{{\s*/};static doubleBracketParserRegExp={NEXT_TAG:/(\{\{|\<svg|\<\/svg)/,EXPRESSION_START:/\{\{/,EXPRESSION_END:/\}\}/,TAG_CLOSE:/\>/};static htmlRegExp={SVG_OPEN:/^\<svg\s*/i,SVG_CLOSE:/^\<\/svg\s*/i};static preprocessRegExp={WEB_COMPONENT_SELF_CLOSING:/<(\w+-\w+)([^>]*)\/>/g};static templateRegExp={VERBOSE_KEYWORD:/^(template|snippet)\W/g,VERBOSE_PROPERTIES:/(\w+)\s*=\s*(((?!\w+\s*=).)+)/gms,STANDARD:/(\w+)\s*=\s*((?:(?!\n|$|\w+\s*=).)+)/g,DATA_OBJECT:/(\w+)\s*:\s*([^,}]+)/g,SINGLE_QUOTES:/\'/g};compile(t=this.templateString){t=n.preprocessTemplate(t);let e=new Pt(t);w(t)||e.fatal("Template is not a string",t);let{htmlRegExp:o}=n,a=n.detectSyntax(t),r=a=="doubleBracket"?n.doubleBracketRegExp:n.singleBracketRegExp,i=a=="doubleBracket"?n.doubleBracketParserRegExp:n.singleBracketParserRegExp,s=b=>{let g=()=>{if(b.peek()=="}"){b.consumeUntil(i.EXPRESSION_END);return}let f=1,p=b.peek();for(;f>0&&!b.isEOF();){if(b.step(),b.peek()=="{"&&f++,b.peek()=="}"&&f--,f==0){b.rewind();break}p+=b.peek()}return b.consumeUntil(i.EXPRESSION_END),b.consume(i.EXPRESSION_END),p=p.trim(),p};for(let f in r)if(b.matches(r[f])){let p=b.getContext();b.consume(r[f]);let S=g();b.consume(i.EXPRESSION_END);let P=this.getValue(S);return{type:f,content:P,...p}}for(let f in o)if(b.matches(o[f])){b.consume(o[f]);let p=b.getContext(),S=this.getValue(b.consumeUntil(i.TAG_CLOSE).trim());return b.consume(i.TAG_CLOSE),{type:f,content:S,...p}}return null},c=[],m=[],l=null,u=[],d=[];for(;!e.isEOF();){let b=s(e),g=gt(u),f=l?.content||c;if(b){let p={type:b.type.toLowerCase()};switch(b.type){case"IF":p={...p,condition:b.content,content:[],branches:[]},f.push(p),u.push(p),d.push(p),l=p;break;case"ELSEIF":p={...p,condition:b.content,content:[]},g||(e.returnTo(r.ELSEIF),e.fatal("{{elseif}} encountered without matching if condition")),d.pop(),d.push(p),g.branches.push(p),l=p;break;case"ELSE":if(p={...p,content:[]},!g){e.returnTo(r.ELSE),e.fatal("{{else}} encountered without matching if or each condition");break}g.type==="if"?(d.pop(),d.push(p),g.branches.push(p),l=p):g.type==="each"?(d.pop(),d.push(p),g.else=p,l=p):(e.returnTo(r.ELSE),e.fatal("{{else}} encountered with unknown condition type: "+g.type));break;case"CLOSE_IF":u.length==0&&(e.returnTo(r.CLOSE_IF),e.fatal("{{/if}} close tag found without open if tag")),m.pop(),d.pop(),u.pop(),l=gt(d);break;case"SNIPPET":p={...p,type:"snippet",name:b.content,content:[]},this.snippets[b.content]=p,f.push(p),u.push(p),d.push(p),l=p;break;case"CLOSE_SNIPPET":u.length==0&&(e.returnTo(r.CLOSE_IF),e.fatal("{{/snippet}} close tag found without open if tag")),m.pop(),d.pop(),l=gt(d);break;case"HTML_EXPRESSION":p={...p,type:"expression",unsafeHTML:!0,value:b.content},f.push(p),e.consume("}");break;case"EXPRESSION":p={...p,value:b.content},b.booleanAttribute&&(p.ifDefined=!0),f.push(p);break;case"TEMPLATE":let S=this.parseTemplateString(b.content);p={...p,...S},f.push(p);break;case"SLOT":p={...p,name:b.content},f.push(p);break;case"EACH":let P,A,B,q=b.content.split(" in "),z=b.content.split(" as ");if(q.length>1){let T=q[0].trim();P=q[1].trim();let j=T.indexOf(",");j!==-1?(A=T.substring(0,j).trim(),B=T.substring(j+1).trim()):A=T}else if(z.length>1){P=z[0].trim();let T=z[1].trim(),j=T.indexOf(",");j!==-1?(A=T.substring(0,j).trim(),B=T.substring(j+1).trim()):A=T}else P=b.content.trim();p={...p,over:P,content:[]},A&&(p.as=A),B&&(p.indexAs=B),d.push(p),u.push(p),f.push(p),l=p;break;case"CLOSE_EACH":m.pop(),d.pop(),u.pop(),l=gt(d);break;case"SVG_OPEN":f.push({type:"html",html:"<svg "}),f.push(...this.compile(b.content)),f.push({type:"html",html:">"}),p={type:"svg",content:[]},d.push(p),f.push(p),l=p;break;case"SVG_CLOSE":m.pop(),d.pop(),l=gt(d),p={type:"html",html:"</svg>"},(l||c).push(p);break}}else{let p=e.consumeUntil(i.NEXT_TAG);if(p){let S={type:"html",html:p};f.push(S)}}}return n.optimizeAST(c)}getValue(t){return t=="true"?!0:t=="false"?!1:w(t)&&t.trim()!==""&&Number.isFinite(+t)?Number(t):t}parseTemplateString(t=""){let e=n.templateRegExp,o={};if(e.VERBOSE_KEYWORD.lastIndex=0,e.VERBOSE_KEYWORD.test(t)){let a=[...t.matchAll(e.VERBOSE_PROPERTIES)];h(a,(r,i)=>{let s=r[1],c=n.getObjectFromString(r[2]);o[s]=c})}else{let a={},r=t.split(/\b/)[0];o.name=`'${r}'`;let i=[...t.matchAll(e.STANDARD)];h(i,(s,c)=>{let m=s[1].trim(),l=s[2].trim();a[m]=l}),o.reactiveData=a}return o}static getObjectFromString(t=""){let e=n.templateRegExp.DATA_OBJECT,o={},a,r=!1;for(;(a=e.exec(t))!==null;)r=!0,o[a[1]]=a[2].trim();return r?o:t.trim()}static detectSyntax(t=""){let e=t.search(/{{\s*/),o=t.search(/{[^{]\s*/);return e!==-1&&e<o?"doubleBracket":"singleBracket"}static preprocessTemplate(t=""){return t=t.trim(),t=t.replace(n.preprocessRegExp.WEB_COMPONENT_SELF_CLOSING,(e,o,a)=>`<${o}${a}></${o}>`),t}static optimizeAST(t){let e=[],o=null,a=r=>{r.type==="html"?o?o.html+=r.html:(o={...r},e.push(o)):(o&&(o=null),Array.isArray(r.content)&&(r.content=this.optimizeAST(r.content)),r.else&&r.else.content&&(r.else.content=this.optimizeAST(r.else.content)),e.push(r))};return t.forEach(a),e}};var ae=class n{static globalThisProxy=new Proxy({},{get(t,e){return globalThis[e]},set(t,e,o){return globalThis[e]=o,!0}});static eventHandlers=[];constructor(t,{root:e=document,pierceShadow:o=!1}={}){let a=[];if(e){if(t===window||t===globalThis||k(t,["window","globalThis"])||t==n.globalThisProxy)a=[n.globalThisProxy],this.isBrowser=Tt,this.isGlobal=!0;else if(E(t)||t instanceof NodeList||t instanceof HTMLCollection)t=Array.from(t),a=t;else if(w(t))if(t.trim().slice(0,1)=="<"){let r=document.createElement("template");r.innerHTML=t.trim(),a=Array.from(r.content.childNodes)}else a=o?this.querySelectorAllDeep(e,t):e.querySelectorAll(t);else Vt(t)?a=[t]:t instanceof NodeList&&(a=t);this.selector=t,this.length=a.length,this.options={root:e,pierceShadow:o},Object.assign(this,a)}}chain(t){return this.isGlobal&&!t?new n(globalThis,this.options):new n(t,this.options)}querySelectorAllDeep(t,e,o=!0){let a=[],r=Vt(e),i=!1,s;o&&(r&&t==e||t.matches&&t.matches(e))&&a.push(t),r?s=!0:t.querySelectorAll?(a.push(...t.querySelectorAll(e)),s=!0):s=!1;let c=(u,d)=>{r&&(u===d||u.contains)?u.contains(d)&&(a.push(d),i=!0):u.querySelectorAll&&a.push(...u.querySelectorAll(d))},m=(u,d)=>{let v=d.split(" "),b,g;return h(v,(f,p)=>{if(b=v.slice(0,p+1).join(" "),u.matches(b)){g=v.slice(p+1).join(" ");return}}),g||d},l=(u,d,v)=>{i||(v===!0&&(c(u,d),s=!0),u.nodeType===Node.ELEMENT_NODE&&u.shadowRoot&&(d=m(u,d),c(u.shadowRoot,d),l(u.shadowRoot,d,!s)),u.assignedNodes&&(d=m(u,d),u.assignedNodes().forEach(b=>l(b,d,s))),u.childNodes.length&&u.childNodes.forEach(b=>l(b,d,s)))};return l(t,e),[...new Set(a)]}each(t){for(let e=0;e<this.length;e++){let o=this[e],a=this.chain(o);t.call(a,o,e)}return this}removeAllEvents(){n.eventHandlers=[]}find(t){let e=Array.from(this).flatMap(o=>this.options.pierceShadow?this.querySelectorAllDeep(o,t,!1):Array.from(o.querySelectorAll(t)));return this.chain(e)}parent(t){let e=Array.from(this).map(o=>o.parentElement).filter(Boolean);return t?this.chain(e).filter(t):this.chain(e)}children(t){let e=Array.from(this).flatMap(a=>Array.from(a.children)),o=t?e.filter(a=>a.matches(t)):e;return this.chain(o)}siblings(t){let e=Array.from(this).flatMap(o=>{if(o.parentNode)return Array.from(o.parentNode.children).filter(a=>a!==o)}).filter(Boolean);return t?this.chain(e).filter(t):this.chain(e)}index(t){let e=this.el();if(!e?.parentNode)return-1;let a=this.chain(e.parentNode.children).filter(t).get(),r=this.get();return ft(a,i=>k(i,r))}indexOf(t){let e=this.get(),o=this.filter(t).get(0);return e.indexOf(o)}filter(t){if(!t)return this;let e=[];return N(t)?e=Array.from(this).filter(t):e=Array.from(this).filter(o=>{if(w(t))return o.matches&&o.matches(t);if(t instanceof n)return t.get().includes(o);{let a=E(t)?t:[t];return k(o,a)}}),this.chain(e)}is(t){return Array.from(this).filter(o=>typeof t=="string"?o.matches&&o.matches(t):this.isGlobal?k(t,["window","globalThis"]):(t instanceof n?t.get():[t]).includes(o)).length===this.length}not(t){let e=Array.from(this).filter(o=>typeof t=="string"?!o.matches||o.matches&&!o.matches(t):this.isGlobal?!k(t,["window","globalThis"]):!(t instanceof n?t.get():[t]).includes(o));return this.chain(e)}closest(t){let e=Array.from(this).map(o=>{if(this.options.pierceShadow)return this.closestDeep(o,t);if(t&&o?.closest)return o.closest(t);if(this.isGlobal)return k(t,["window","globalThis"])}).filter(Boolean);return this.chain(e)}closestDeep(t,e){let o=t,a=Vt(e),r=w(e);for(;o;){if(a&&o===e||r&&o.matches(e))return o;if(o.parentElement)o=o.parentElement;else if(o.parentNode&&o.parentNode.host)o=o.parentNode.host;else return}}ready(t){return this.is(document)&&document.readyState=="loading"?this.on("ready",t):t.call(document,new Event("DOMContentLoaded")),this}getEventAlias(t){return{ready:"DOMContentLoaded"}[t]||t}getEventArray(t){return t.split(" ").map(e=>this.getEventAlias(e)).filter(Boolean)}on(t,e,o,a){let r=[],i,s;return _(o)?(a=o,i=e):w(e)?(s=e,i=o):N(e)&&(i=e),this.getEventArray(t).forEach(m=>{let l=a?.abortController||new AbortController,u=a?.eventSettings||{},d=l.signal;this.each(v=>{let b;s&&(b=S=>{let P;if(S.composed&&S.composedPath){let A=S.composedPath(),B=ft(A,q=>q==v);A=A.slice(0,B),P=A.find(q=>q instanceof Element&&q.matches&&q.matches(s))}else P=S.target.closest(s);P&&i.call(P,S)});let g=b||i,f=v==n.globalThisProxy?globalThis:v;f.addEventListener&&f.addEventListener(m,g,{signal:d,...u});let p={el:v,eventName:m,eventListener:g,abortController:l,delegated:s!==void 0,handler:i,abort:S=>l.abort(S)};r.push(p)})}),n.eventHandlers||(n.eventHandlers=[]),n.eventHandlers.push(...r),a?.returnHandler?r.length==1?r[0]:r:this}one(t,e,o,a){let r,i;_(o)?(a=o,r=e):w(e)?(i=e,r=o):N(e)&&(r=e),a=a||{};let s=new AbortController;a.abortController=s;let c=function(...m){s.abort(),r.apply(this,m)};return i?this.on(t,i,c,a):this.on(t,c,a)}off(t,e){let o=this.getEventArray(t);return n.eventHandlers=n.eventHandlers.filter(a=>{if((!t||k(a.eventName,o))&&(!e||e?.eventListener==a.eventListener||a.eventListener===e||a.handler===e)){let r=this.isGlobal?globalThis:a.el;return r.removeEventListener&&r.removeEventListener(a.eventName,a.eventListener),!1}return!0}),this}trigger(t,e){return this.each(o=>{if(typeof o.dispatchEvent!="function")return;let a=new Event(t,{bubbles:!0,cancelable:!0});e&&Object.assign(a,e),o.dispatchEvent(a)})}click(t){return this.trigger("click",t)}dispatchEvent(t,e={},o={}){let a={bubbles:!0,cancelable:!0,composed:!0,detail:e,...o};return this.each(r=>{let i=new CustomEvent(t,a);r.dispatchEvent(i)}),this}remove(){return this.each(t=>t.remove())}addClass(t){let e=t.split(" ");return this.each(o=>o.classList.add(...e))}hasClass(t){return Array.from(this).some(e=>e.classList.contains(t))}removeClass(t){let e=t.split(" ");return this.each(o=>o.classList.remove(...e))}toggleClass(t){let e=t.split(" ");return this.each(o=>o.classList.toggle(...e))}html(t){if(t!==void 0)return this.each(e=>e.innerHTML=t);if(this.length>0)return this.map(e=>e.innerHTML||e.nodeValue).join("")}outerHTML(t){if(t!==void 0)return this.each(e=>e.outerHTML=t);if(this.length)return this.map(e=>e.outerHTML).join("")}text(t){if(t!==void 0)return this.each(e=>e.textContent=t);{let e=a=>a.nodeName==="SLOT"?a.assignedNodes({flatten:!0}):a.childNodes,o=this.map(a=>this.getTextContentRecursive(e(a)));return o.length>1?o:o[0]}}getTextContentRecursive(t){return Array.from(t).map(e=>{if(e.nodeType===Node.TEXT_NODE)return e.nodeValue;if(e.nodeName==="SLOT"){let o=e.assignedNodes({flatten:!0});return this.getTextContentRecursive(o)}else return this.getTextContentRecursive(e.childNodes)}).join("").trim()}textNode(){return Array.from(this).map(t=>Array.from(t.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE).map(e=>e.nodeValue).join("")).join("")}map(...t){return Array.from(this).map(...t)}value(t){if(t!==void 0)return this.each(e=>{(e instanceof HTMLInputElement||e instanceof HTMLSelectElement||e instanceof HTMLTextAreaElement)&&(e.value=t)});{let e=this.map(o=>{if(o instanceof HTMLInputElement||o instanceof HTMLSelectElement||o instanceof HTMLTextAreaElement)return o.value});return e.length>1?e:e[0]}}val(...t){return this.value(...t)}focus(){return this.length&&this[0].focus(),this}blur(){return this.length&&this[0].blur(),this}css(t,e=null,o={includeComputed:!1}){let a=Array.from(this);if(at(t)||e!==null)return at(t)?Object.entries(t).forEach(([r,i])=>{a.forEach(s=>s.style.setProperty(lt(r),i))}):a.forEach(r=>r.style.setProperty(lt(t),e)),this;if(a?.length){let r=a.map(i=>{let s=i.style[t];if(o.includeComputed)return window.getComputedStyle(i).getPropertyValue(t);if(s)return s});return a.length===1?r[0]:r}}computedStyle(t){return this.css(t,null,{includeComputed:!0})}cssVar(t,e){return this.css(`--${t}`,e,{includeComputed:!0})}attr(t,e){if(at(t))Object.entries(t).forEach(([o,a])=>{this.each(r=>r.setAttribute(o,a))});else if(e!==void 0)this.each(o=>o.setAttribute(t,e));else if(this.length){let o=this.map(a=>a.getAttribute(t));return o.length>1?o:o[0]}}removeAttr(t){return this.each(e=>e.removeAttribute(t))}el(){return this.get(0)}get(t){return t!==void 0?this[t]:Array.from(this)}eq(t){return this.chain(this[t])}first(){return this.eq(0)}last(){return this.eq(this.length-1)}prop(t,e){return e!==void 0?this.each(o=>{o[t]=e}):this.length==0?void 0:this.length===1?this[0][t]:this.map(o=>o[t])}next(t){let e=this.map(o=>{let a=o.nextElementSibling;for(;a;){if(!t||a.matches(t))return a;a=a.nextElementSibling}return null}).filter(Boolean);return this.chain(e)}prev(t){let e=this.map(o=>{let a=o.previousElementSibling;for(;a;){if(!t||a.matches(t))return a;a=a.previousElementSibling}return null}).filter(Boolean);return this.chain(e)}height(t){return this.prop("innerHeight",t)||this.prop("clientHeight",t)}width(t){return this.prop("innerWidth",t)||this.prop("clientWidth",t)}scrollHeight(t){return(this.isGlobal&&this.isBrowser?this.chain(document.documentElement):this).prop("scrollHeight",t)}scrollWidth(t){return(this.isGlobal&&this.isBrowser?this.chain(document.documentElement):this).prop("scrollWidth",t)}scrollLeft(t){return(this.isGlobal&&this.isBrowser?this.chain(document.documentElement):this).prop("scrollLeft",t)}scrollTop(t){return(this.isGlobal&&this.isBrowser?this.chain(document.documentElement):this).prop("scrollTop",t)}clone(){let t=document.createDocumentFragment();return this.each(e=>{t.appendChild(e.cloneNode(!0))}),this.chain(t.childNodes)}reverse(){let t=this.get().reverse();return this.chain(t)}insertContent(t,e,o){this.chain(e).each(r=>{if(t.insertAdjacentElement)t.insertAdjacentElement(o,r);else switch(o){case"beforebegin":t.parentNode?.insertBefore(r,t);break;case"afterbegin":t.insertBefore(r,t.firstChild);break;case"beforeend":t.appendChild(r);break;case"afterend":t.parentNode?.insertBefore(r,t.nextSibling);break}})}prepend(t){return this.each(e=>{this.insertContent(e,t,"afterbegin")})}append(t){return this.each(e=>{this.insertContent(e,t,"beforeend")})}insertBefore(t){return this.chain(t).each(e=>{this.insertContent(e,this.selector,"beforebegin")})}insertAfter(t){return this.chain(t).each(e=>{this.insertContent(e,this.selector,"afterend")})}detach(){return this.each(t=>{t.parentNode&&t.parentNode.removeChild(t)})}naturalWidth(){let t=this.map(e=>{let o=$(e).clone();o.insertAfter(e).css({position:"absolute",display:"block",transform:"translate(-9999px, -9999px)",zIndex:"-1"});let a=o.width();return o.remove(),a});return t.length>1?t:t[0]}naturalHeight(){let t=this.map(e=>{let o=$(e).clone();o.insertAfter(e).css({position:"absolute",display:"block",transform:"translate(-9999px, -9999px)",zIndex:"-1"});let a=o.height();return o.remove(),a});return t.length>1?t:t[0]}offsetParent({calculate:t=!0}={}){return Array.from(this).map(e=>{if(!t)return e.offsetParent;let o,a,r,i,s=e?.parentNode;for(;s&&!a&&!r&&!i;)s=s?.parentNode,s&&(o=$(s),a=o.computedStyle("position")!=="static",r=o.computedStyle("transform")!=="none",i=o.is("body"));return s})}count(){return this.length}exists(){return this.length>0}initialize(t){document.addEventListener("DOMContentLoaded",()=>{this.settings(t)})}settings(t){this.each(e=>{h(t,(o,a)=>{e[a]=o})})}setting(t,e){this.each(o=>{o[t]=e})}component(){let t=this.map(e=>e.component).filter(Boolean);return t.length>1?t:t[0]}dataContext(){let t=this.map(e=>e.dataContext).filter(Boolean);return t.length>1?t:t[0]}};var O=function(n,t={}){let e=typeof window<"u";return!t?.root&&e&&(t.root=document),new ae(n,t)};var R=class n{static current=null;static pendingReactions=new Set;static afterFlushCallbacks=[];static isFlushScheduled=!1;static scheduleReaction(t){n.pendingReactions.add(t),n.scheduleFlush()}static scheduleFlush(){n.isFlushScheduled||(n.isFlushScheduled=!0,typeof queueMicrotask=="function"?queueMicrotask(()=>n.flush()):Promise.resolve().then(()=>n.flush()))}static flush(){n.isFlushScheduled=!1,n.pendingReactions.forEach(t=>t.run()),n.pendingReactions.clear(),n.afterFlushCallbacks.forEach(t=>t()),n.afterFlushCallbacks=[]}static afterFlush(t){n.afterFlushCallbacks.push(t)}static getSource(){if(!n.current||!n.current.context||!n.current.context.trace){console.log("No source available or no current reaction.");return}let t=n.current.context.trace;return t=t.split(`
`).slice(2).join(`
`),t=`Reaction triggered by:
${t}`,console.info(t),t}};var ht=class{constructor(){this.subscribers=new Set}depend(){R.current&&(this.subscribers.add(R.current),R.current.dependencies.add(this))}changed(t){this.subscribers.forEach(e=>e.invalidate(t))}cleanUp(t){this.subscribers.delete(t)}unsubscribe(t){this.subscribers.delete(t)}};var L=class n{constructor(t){this.callback=t,this.dependencies=new Set,this.boundRun=this.run.bind(this),this.firstRun=!0,this.active=!0}run(){this.active&&(R.current=this,this.dependencies.forEach(t=>t.cleanUp(this)),this.dependencies.clear(),this.callback(this),this.firstRun=!1,R.current=null,R.pendingReactions.delete(this))}invalidate(t){this.active=!0,t&&(this.context=t),R.scheduleReaction(this)}stop(){this.active&&(this.active=!1,this.dependencies.forEach(t=>t.unsubscribe(this)))}static get current(){return R.current}static flush=R.flush;static scheduleFlush=R.scheduleFlush;static afterFlush=R.afterFlush;static getSource=R.getSource;static create(t){let e=new n(t);return e.run(),e}static nonreactive(t){let e=R.current;R.current=null;try{return t()}finally{R.current=e}}static guard(t,e=H){if(!R.current)return t();let o=new ht,a,r;o.depend();let i=new n(()=>{r=t(),!i.firstRun&&!e(r,a)&&o.changed(),a=Y(r)});return i.run(),r}};var U=class n{constructor(t,{equalityFunction:e,allowClone:o=!0,cloneFunction:a}={}){this.dependency=new ht,this.allowClone=o,this.equalityFunction=e?J(e):n.equalityFunction,this.clone=a?J(a):n.cloneFunction,this.currentValue=this.maybeClone(t)}static equalityFunction=H;static cloneFunction=Y;get value(){this.dependency.depend();let t=this.currentValue;return Array.isArray(t)||typeof t=="object"?this.maybeClone(t):t}canCloneValue(t){return this.allowClone===!0&&!Ut(t)}maybeClone(t){return this.canCloneValue(t)?E(t)?t=t.map(e=>this.maybeClone(e)):this.clone(t):t}set value(t){this.equalityFunction(this.currentValue,t)||(this.currentValue=this.maybeClone(t),this.dependency.changed({value:t,trace:new Error().stack}))}get(){return this.value}set(t){this.equalityFunction(this.currentValue,t)||(this.value=t)}subscribe(t){return L.create(e=>{t(this.value,e)})}peek(){return this.maybeClone(this.currentValue)}clear(){return this.set(void 0)}push(...t){let e=this.peek();e.push(...t),this.set(e)}unshift(...t){let e=this.peek();e.unshift(...t),this.set(e)}splice(...t){let e=this.peek();e.splice(...t),this.set(e)}map(t){let e=Array.prototype.map.call(this.peek(),t);this.set(e)}filter(t){let e=Array.prototype.filter.call(this.peek(),t);this.set(e)}getIndex(t){return this.get()[t]}setIndex(t,e){let o=this.peek();o[t]=e,this.set(o)}removeIndex(t){let e=this.peek();e.splice(t,1),this.set(e)}setArrayProperty(t,e,o){let a;ve(t)?a=t:(a="all",o=e,e=t);let r=this.peek().map((i,s)=>((a=="all"||s==a)&&(i[e]=o),i));this.set(r)}toggle(){return this.set(!this.peek())}increment(t=1){return this.set(this.peek()+t)}decrement(t=1){return this.set(this.peek()-t)}now(){return this.set(new Date)}getIDs(t){return _(t)?rt([t?._id,t?.id,t?.hash,t?.key].filter(Boolean)):[t]}getID(t){return this.getIDs(t).filter(Boolean)[0]}hasID(t,e){return this.getID(t)===e}getItem(t){return ft(this.currentValue,e=>this.hasID(e,t))}setProperty(t,e,o){if(arguments.length==3){let a=t,r=this.getItem(a);return this.setArrayProperty(r,e,o)}else{o=e,e=t;let a=this.peek();a[e]=o,this.set(a)}}replaceItem(t,e){return this.setIndex(this.getItem(t),e)}removeItem(t){return this.removeIndex(this.getItem(t))}};var kt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},F=n=>(...t)=>({_$litDirective$:n,values:t}),it=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,o){this._$Ct=t,this._$AM=e,this._$Ci=o}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:jn}=No;var Ro=n=>n.strings===void 0,Po=()=>document.createComment(""),xt=(n,t,e)=>{let o=n._$AA.parentNode,a=t===void 0?n._$AB:t._$AA;if(e===void 0){let r=o.insertBefore(Po(),a),i=o.insertBefore(Po(),a);e=new jn(r,i,n,n.options)}else{let r=e._$AB.nextSibling,i=e._$AM,s=i!==n;if(s){let c;e._$AQ?.(n),e._$AM=n,e._$AP!==void 0&&(c=n._$AU)!==i._$AU&&e._$AP(c)}if(r!==a||s){let c=e._$AA;for(;c!==r;){let m=c.nextSibling;o.insertBefore(c,a),c=m}}}return e},st=(n,t,e=n)=>(n._$AI(t,e),n),Wn={},zo=(n,t=Wn)=>n._$AH=t,_o=n=>n._$AH,re=n=>{n._$AP?.(!1,!0);let t=n._$AA,e=n._$AB.nextSibling;for(;t!==e;){let o=t.nextSibling;t.remove(),t=o}};var Rt=(n,t)=>{let e=n._$AN;if(e===void 0)return!1;for(let o of e)o._$AO?.(t,!1),Rt(o,t);return!0},ie=n=>{let t,e;do{if((t=n._$AM)===void 0)break;e=t._$AN,e.delete(n),n=t}while(e?.size===0)},Do=n=>{for(let t;t=n._$AM;n=t){let e=t._$AN;if(e===void 0)t._$AN=e=new Set;else if(e.has(n))break;e.add(n),Kn(t)}};function Yn(n){this._$AN!==void 0?(ie(this),this._$AM=n,Do(this)):this._$AM=n}function Gn(n,t=!1,e=0){let o=this._$AH,a=this._$AN;if(a!==void 0&&a.size!==0)if(t)if(Array.isArray(o))for(let r=e;r<o.length;r++)Rt(o[r],!1),ie(o[r]);else o!=null&&(Rt(o,!1),ie(o));else Rt(this,n)}var Kn=n=>{n.type==kt.CHILD&&(n._$AP??=Gn,n._$AQ??=Yn)},Q=class extends it{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,o){super._$AT(t,e,o),Do(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(Rt(this,t),ie(this))}setValue(t){if(Ro(this._$Ct))this._$Ct._$AI(t,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}};var zt=class extends it{constructor(t){if(super(t),this.it=x,t.type!==kt.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===x||t==null)return this._t=void 0,this.it=t;if(t===K)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;let e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};zt.directiveName="unsafeHTML",zt.resultType=1;var Oo=F(zt);var Vo=n=>n??x;var se=class extends Q{constructor(t){super(t),this.partInfo=t,this.reaction=null}render(t,e={}){if(this.expression=t,this.settings=e,this.reaction)return this.getReactiveValue();{let o;return this.reaction=L.create(a=>{if(!this.isConnected){a.stop();return}o=this.getReactiveValue(),this.settings.unsafeHTML&&(o=Oo(o)),a.firstRun||this.setValue(o)}),o}}getReactiveValue(){let t=this.expression.value();return this.settings.ifDefined&&k(t,[void 0,null,!1,0])?Vo(void 0):((E(t)||_(t))&&(t=JSON.stringify(t)),t)}disconnected(){this.reaction&&(this.reaction.stop(),this.reaction=null)}reconnected(){}},Uo=F(se);var ce=class extends Q{constructor(t){super(t),this.reaction=null}render(t){this.reaction&&this.reaction.stop();let e=x;return this.reaction=L.create(o=>{if(!this.isConnected){o.stop();return}if(t.condition())e=t.content();else if(t.branches?.length){let a=!1;h(t.branches,r=>{(!a&&r.type=="elseif"&&r.condition()||!a&&r.type=="else")&&(a=!0,e=r.content())})}else e=x;return e||(e=x),o.firstRun||this.setValue(e),e}),e}disconnected(){this.reaction&&(this.reaction.stop(),this.reaction=null)}reconnected(){}},Ho=F(ce);var Fo=(n,t,e)=>{let o=new Map;for(let a=t;a<=e;a++)o.set(n[a],a);return o},Ne=F(class extends it{constructor(n){if(super(n),n.type!==kt.CHILD)throw Error("repeat() can only be used in text expressions")}dt(n,t,e){let o;e===void 0?e=t:t!==void 0&&(o=t);let a=[],r=[],i=0;for(let s of n)a[i]=o?o(s,i):i,r[i]=e(s,i),i++;return{values:r,keys:a}}render(n,t,e){return this.dt(n,t,e).values}update(n,[t,e,o]){let a=_o(n),{values:r,keys:i}=this.dt(t,e,o);if(!Array.isArray(a))return this.ut=i,r;let s=this.ut??=[],c=[],m,l,u=0,d=a.length-1,v=0,b=r.length-1;for(;u<=d&&v<=b;)if(a[u]===null)u++;else if(a[d]===null)d--;else if(s[u]===i[v])c[v]=st(a[u],r[v]),u++,v++;else if(s[d]===i[b])c[b]=st(a[d],r[b]),d--,b--;else if(s[u]===i[b])c[b]=st(a[u],r[b]),xt(n,c[b+1],a[u]),u++,b--;else if(s[d]===i[v])c[v]=st(a[d],r[v]),xt(n,a[u],a[d]),d--,v++;else if(m===void 0&&(m=Fo(i,v,b),l=Fo(s,u,d)),m.has(s[u]))if(m.has(s[d])){let g=l.get(i[v]),f=g!==void 0?a[g]:null;if(f===null){let p=xt(n,a[u]);st(p,r[v]),c[v]=p}else c[v]=st(f,r[v]),xt(n,a[u],f),a[g]=null;v++}else re(a[d]),d--;else re(a[u]),u++;for(;v<=b;){let g=xt(n,c[b+1]);st(g,r[v]),c[v++]=g}for(;u<=d;){let g=a[u++];g!==null&&re(g)}return this.ut=i,zo(n,c),K}});var le=class extends Q{constructor(t){super(t),this.reaction=null,this.items=[],this.eachCondition=null}render(t,e={}){return this.eachCondition=t,this.reaction&&(this.reaction.stop(),this.reaction=null),this.reaction=L.create(o=>{if(!this.isConnected){o.stop();return}if(this.items=this.getItems(this.eachCondition),!o.firstRun){let a=this.renderItems();this.setValue(a)}}),this.renderItems()}renderItems(){let t=this.getItems(this.eachCondition);if(!t?.length>0&&this.eachCondition.else)return Ne([1],()=>"else-case",()=>this.eachCondition.else());let e=this.getCollectionType(t);return e=="object"&&(t=Ft(t)),Ne(t,(o,a)=>this.getItemID(o,a,e),(o,a)=>this.getTemplate(o,a,e))}getCollectionType(t){return E(t)?"array":"object"}getItems(){return this.eachCondition.over()||[]}getTemplate(t,e,o){let a=this.getEachData(t,e,o,this.eachCondition);return this.eachCondition.content(a)}getItemID(t,e,o){return at(t)?(o=="object"?e:void 0)||t._id||t.id||t.key||t.hash||t._hash||t.value||e:w(t)?t:e}getEachData(t,e,o,a){let{as:r,indexAs:i}=a;return i||(i=o=="array"?"index":"key"),o=="object"&&(t=t.value,e=t.key),r?{[r]:t,[i]:e}:{...t,this:t,[i]:e}}disconnected(){this.reaction&&(this.reaction.stop(),this.reaction=null)}reconnected(){}},Bo=F(le);var ue=class extends Q{constructor(t){super(t),this.renderRoot=t.options?.host?.renderRoot,this.template=null,this.part=null}render({getTemplate:t,templateName:e,subTemplates:o,data:a,parentTemplate:r}){return this.parentTemplate=r,this.getTemplate=t,this.subTemplates=o,this.data=a,this.ast=null,this.reaction=L.create(i=>{this.maybeCreateTemplate();let s=this.unpackData(this.data);if(!this.isConnected){i.stop();return}if(i.firstRun||!this.template||this.template?.ast.length==0)return;let c=this.renderTemplate(s);this.setValue(c)}),this.maybeCreateTemplate(),!this.template||this.template?.ast.length==0?x:this.renderTemplate()}renderTemplate(t){return this.attachTemplate(),t||(t=this.unpackData(this.data)),this.template.setDataContext(t),this.template.render()}maybeCreateTemplate(){let t,e,o=this.getTemplate();if(w(o)?(t=o,e=this.subTemplates[t]):o instanceof _t&&(e=o,t=e.templateName),!e)return!1;this.templateID=e.id,this.template=e.clone({templateName:t,subTemplates:this.subTemplates,data:this.unpackData(this.data)})}attachTemplate(){let{parentNode:t,startNode:e,endNode:o}=this.part||{},a=this.part?.options?.host,r=a?.renderRoot;this.template.setElement(a),this.template.attach(r,{element:a,parentNode:t,startNode:e,endNode:o}),this.parentTemplate&&this.template.setParent(this.parentTemplate)}unpackData(t){return W(t,e=>e())}update(t,e){return this.part=t,this.render.apply(this,e)}reconnected(){}disconnected(){this.template&&this.template.onDestroyed()}},qo=F(ue);var Dt=class n{static html=Le;static PARENS_REGEXP=/('[^']*'|"[^"]*"|\(|\)|[^\s()]+)/g;static STRING_REGEXP=/^\'(.*)\'$/;static WRAPPED_EXPRESSION=/(\s|^)([\[{].*?[\]}])(\s|$)/g;static VAR_NAME_REGEXP=/^[a-zA-Z_$][0-9a-zA-Z_$]*$/;static useSubtreeCache=!1;static getID({ast:t,data:e,isSVG:o}={}){return Ct({ast:t})}constructor({ast:t,data:e,template:o,subTemplates:a,snippets:r,helpers:i,isSVG:s}){this.ast=t||"",this.data=e,this.renderTrees={},this.treeIDs=[],this.template=o,this.subTemplates=a,this.resetHTML(),this.snippets=r||{},this.helpers=i||{},this.isSVG=s,this.id=n.getID({ast:t,data:e,isSVG:s})}resetHTML(){this.html=[],this.html.raw=[],this.expressions=[]}render({ast:t=this.ast,data:e=this.data}={}){this.resetHTML(),this.readAST({ast:t,data:e}),this.clearTemp();let o=this.isSVG?$o:Le;return this.litTemplate=o.apply(this,[this.html,...this.expressions]),this.litTemplate}cachedRender(t){return t&&this.updateData(t),this.litTemplate}readAST({ast:t=this.ast,data:e=this.data}={}){h(t,o=>{switch(o.type){case"html":this.addHTML(o.html);break;case"svg":this.addValue(this.evaluateSVG(o.content,e));break;case"expression":let a=this.evaluateExpression(o.value,e,{unsafeHTML:o.unsafeHTML,ifDefined:o.ifDefined,asDirective:!0});this.addValue(a);break;case"if":this.addValue(this.evaluateConditional(o,e));break;case"each":this.addValue(this.evaluateEach(o,e));break;case"template":this.addValue(this.evaluateTemplate(o,e));break;case"snippet":this.snippets[o.name]=o;break;case"slot":o.name?this.addHTML(`<slot name="${o.name}"></slot>`):this.addHTML("<slot></slot>");break}})}evaluateConditional(t,e){let o=(r,i)=>i=="branches"?r.map(s=>(s.condition&&(s.expression=s.condition),W(s,o))):i=="condition"?()=>this.evaluateExpression(r,e):i=="content"?()=>this.renderContent({ast:r,data:e}):r;t.expression=t.condition;let a=W(t,o);return Ho(a)}evaluateEach(t,e){let a=W(t,(r,i)=>i=="over"?s=>this.evaluateExpression(r,e):i=="content"?s=>(e={...this.data,...s},this.renderContent({ast:r,data:e})):i=="else"?s=>this.renderContent({ast:r.content,data:this.data}):r);return Bo(a,e)}evaluateTemplate(t,e={}){let o=this.lookupExpressionValue(t.name,e);return this.snippets[o]?this.evaluateSnippet(t,e):this.evaluateSubTemplate(t,e)}evaluateSVG(t,e){return this.renderContent({isSVG:!0,ast:t,data:e})}getPackedValue=(t,e,{reactive:o=!1}={})=>{let a=r=>this.evaluateExpression(r,e);return o?()=>a(t):()=>L.nonreactive(()=>a(t))};getPackedNodeData(t,e,{inheritParent:o=!1}={}){let a=(s,c={})=>{let m={};if(w(s)){let l=s;s=this.evaluateExpression(l,e,c),m=W(s,J)}else at(s)&&(m=W(s,l=>this.getPackedValue(l,e,c)));return m},r=a(t.data),i=a(t.reactiveData,{reactive:!0});return e={...o?this.data:{},...r,...i},e}evaluateSnippet(t,e={}){let o=this.lookupExpressionValue(t.name,e),a=this.snippets[o];a||At(`Snippet "${o}" not found`);let r=this.getPackedNodeData(t,e,{inheritParent:!0});return this.renderContent({ast:a.content,data:r})}evaluateSubTemplate(t,e={}){let o=this.getPackedNodeData(t,e);return qo({subTemplates:this.subTemplates,templateName:t.name,getTemplate:()=>this.evaluateExpression(t.name,e),data:o,parentTemplate:this.template})}evaluateExpression(t,e=this.data,{asDirective:o=!1,ifDefined:a=!1,unsafeHTML:r=!1}={}){return typeof t=="string"?o?Uo({expression:t,value:()=>this.lookupExpressionValue(t,this.data)},{ifDefined:a,unsafeHTML:r}):this.lookupExpressionValue(t,e):t}getExpressionArray(t){let e=t.match(n.PARENS_REGEXP)||[],o=a=>{let r=[];for(;a.length>0;){let i=a.shift();if(i==="(")r.push(o(a));else{if(i===")")return r;r.push(i)}}return r};return o(e)}evaluateJavascript(t,e={},{includeHelpers:o=!0}={}){let a;o&&(e={...this.helpers,...e},e=io(e,(r,i)=>!["debugger"].includes(i)&&n.VAR_NAME_REGEXP.test(i)));try{let r=Object.keys(e),i=Object.values(e);h(i,(s,c)=>{s instanceof U&&Object.defineProperty(i,c,{get(){return s.peek()},configurable:!0,enumerable:!0}),N(s)&&s.length===0&&!s.name&&Object.defineProperty(i,c,{get(){return s()},configurable:!0,enumerable:!0})}),a=new Function(...r,`return ${t}`)(...i)}catch{}return a}lookupExpressionValue(t="",e={},o=new Set){if(o.has(t))return;if(o.add(t),!t.includes(" ")){let l=this.lookupTokenValue(t,e);if(l!==void 0)return J(l)()}let r=this.evaluateJavascript(t,e);if(r!==void 0){let l=this.accessTokenValue(r,t,e);return o.delete(t),J(l)()}w(t)&&(t=this.addParensToExpression(t));let i=E(t)?t:this.getExpressionArray(t),s=[],c,m=i.length;for(;m--;){let l=i[m];if(E(l))c=this.lookupExpressionValue(l.join(" "),e,o),s.unshift(c);else{let u=this.lookupTokenValue(l,e);c=N(u)?u(...s):u,s.unshift(c)}}return o.delete(t),c}lookupTokenValue(t="",e){if(E(t))return this.lookupExpressionValue(t,e);let o=this.getLiteralValue(t);if(o!==void 0)return o;let a=this.getDeepDataValue(e,t),r=this.accessTokenValue(a,t,e);if(r!==void 0)return r;let i=this.helpers[t];if(N(i))return i}getDeepDataValue(t,e){return e.split(".").reduce((o,a)=>{if(o===void 0)return;let r=o instanceof U?o.get():J(o)();if(r!=null)return r[a]},t)}accessTokenValue(t,e,o){let a=(r,i)=>{let s=r.split(".").slice(0,-1).join(".");return this.getDeepDataValue(i,s)};if(N(t)&&e.search(".")!==-1){let r=a(e,o);t=t.bind(r)}if(t!==void 0)return t instanceof U?t.value:t}addParensToExpression(t=""){return String(t).replace(n.WRAPPED_EXPRESSION,(e,o,a,r)=>`${o}(${a})${r}`)}getLiteralValue(t){if(t.length>1&&(t[0]==="'"||t[0]==='"')&&t[0]===t[t.length-1])return t.slice(1,-1).replace(/\\(['"])/g,"$1");let e={true:!0,false:!1};if(e[t]!==void 0)return e[t];if(!Number.isNaN(parseFloat(t)))return Number(t)}addHTML(t){this.lastHTML&&(t=`${this.html.pop()}${t}`),this.html.push(t),this.html.raw.push(String.raw({raw:t})),this.lastHTML=!0}addHTMLSpacer(){this.addHTML("")}addValue(t){this.addHTMLSpacer(),this.expressions.push(t),this.lastHTML=!1,this.addHTMLSpacer()}renderContent({ast:t,data:e,isSVG:o=this.isSVG}={}){let a=n.getID({ast:t,data:e,isSVG:o}),r=this.renderTrees[a],i=r?r.deref():void 0;if(n.useSubtreeCache&&i)return i.cachedRender(e);let s=new n({ast:t,data:e,isSVG:o,subTemplates:this.subTemplates,snippets:this.snippets,helpers:this.helpers,template:this.template});return this.treeIDs.push(a),this.renderTrees[a]=new WeakRef(s),s.render()}cleanup(){this.renderTrees=[]}setData(t){this.updateData(t),this.updateSubtreeData(t)}updateSubtreeData(t){h(this.renderTrees,(e,o)=>{let a=e.deref();a&&a.updateData(t)})}updateData(t){h(this.data,(e,o)=>{delete this.data[o]}),h(t,(e,o)=>{this.data[o]!==e&&(this.data[o]=e)})}clearTemp(){delete this.lastHTML}};var nt={exists(n){return!he(n)},isEmpty(n){return he(n)},stringify(n){return JSON.stringify(n)},hasAny(n){return n?.length>0},range(n,t,e=1){return uo(n,t,e)},concat(...n){return n.join("")},both(n,t){return n&&t},either(n,t){return n||t},join(n=[],t=" ",e=!1){if(n.length==0)return;let o=n.join(t).trim();return e?`${o} `:o},classes(n,t=!0){return nt.join(n," ",!0)},joinComma(n=[],t,e){return po(n,{separator:", ",lastSeparator:" and ",oxford:t,quotes:e})},classIf(n,t="",e=""){let o=n?t:e;return o?`${o} `:""},classMap(n){let t=[];return h(n,(e,o)=>{e&&t.push(o)}),t.length?`${t.join(" ")} `:""},maybe(n,t,e){return n?t:e},activeIf(n){return nt.classIf(n,"active","")},selectedIf(n){return nt.classIf(n,"selected","")},capitalize(n=""){return jt(n)},titleCase(n=""){return Et(n)},disabledIf(n){return nt.classIf(n,"disabled","")},checkedIf(n){return nt.classIf(n,"checked","")},maybePlural(n,t="s"){return n==1?"":t},not(n){return!n},is(n,t){return n==t},notEqual(n,t){return n!==t},isExactly(n,t){return n===t},isNotExactly(n,t){return n!==t},greaterThan(n,t){return n>t},lessThan(n,t){return n<t},greaterThanEquals(n,t){return n>=t},lessThanEquals(n,t){return n<=t},numberFromIndex(n){return n+1},formatDate(n=new Date,t="L",e={timezone:"local"}){return qt(n,t,e)},formatDateTime(n=new Date,t="LLL",e={timezone:"local"}){return qt(n,t,e)},formatDateTimeSeconds(n=new Date,t="LTS",e={timezone:"local"}){return qt(n,t,e)},object({obj:n}){return n},log(...n){console.log(...n)},debugger(){debugger},tokenize(n=""){return Ht(n)},debugReactivity(){L.getSource()},arrayFromObject(n){return Ft(n)},escapeHTML(n){return eo(n)},guard:L.guard,nonreactive:L.nonreactive};var _t=class M{static templateCount=0;static isServer=Z;constructor({templateName:t,ast:e,template:o,data:a,element:r,renderRoot:i,css:s,events:c,keys:m,defaultState:l,subTemplates:u,createComponent:d,parentTemplate:v,renderingEngine:b="lit",isPrototype:g=!1,attachStyles:f=!1,onCreated:p=C,onRendered:S=C,onUpdated:P=C,onDestroyed:A=C,onThemeChanged:B=C}={}){e||(e=new vt(o).compile()),this.events=c,this.keys=m||{},this.ast=e,this.css=s,this.data=a||{},this.reactions=[],this.defaultState=l,this.state=this.createReactiveState(l,a)||{},this.templateName=t||this.getGenericTemplateName(),this.subTemplates=u,this.createComponent=d,this.onCreated=C,this.onDestroyed=C,this.onRendered=C,this.onRenderedCallback=S,this.onDestroyedCallback=A,this.onCreatedCallback=p,this.onThemeChangedCallback=B,this.id=no(),this.isPrototype=g,this.parentTemplate=v,this.attachStyles=f,this.element=r,this.renderingEngine=b,i&&this.attach(i)}createReactiveState(t,e){let o={},a=(r,i)=>{let s=D(e,i);return s||r?.value||r};return h(t,(r,i)=>{let s=a(r,i);r?.options?o[i]=new U(s,r.options):o[i]=new U(s)}),o}setDataContext(t,{rerender:e=!0}={}){this.data=t,e&&(this.rendered=!1)}setParent(t){t._childTemplates||(t._childTemplates=[]),t._childTemplates.push(this),this._parentTemplate=t}setElement(t){this.element=t}getGenericTemplateName(){return M.templateCount++,`Anonymous #${M.templateCount}`}initialize(){let t=this,e;this.instance={},N(this.createComponent)&&(e=this.call(this.createComponent)||{},so(t.instance,e)),N(t.instance.initialize)&&this.call(t.instance.initialize.bind(t)),t.instance.templateName=this.templateName,this.onCreated=()=>{this.call(this.onCreatedCallback),M.addTemplate(this),this.dispatchEvent("created",{component:this.instance},{},{triggerCallback:!1})},this.onRendered=()=>{this.call(this.onRenderedCallback),this.dispatchEvent("rendered",{component:this.instance},{},{triggerCallback:!1})},this.onUpdated=()=>{this.dispatchEvent("updated",{component:this.instance},{},{triggerCallback:!1})},this.onThemeChanged=(...o)=>{this.call(this.onThemeChangedCallback,...o)},this.onDestroyed=()=>{M.removeTemplate(this),this.rendered=!1,this.clearReactions(),this.removeEvents(),this.call(this.onDestroyedCallback),this.dispatchEvent("destroyed",{component:this.instance},{},{triggerCallback:!1})},this.initialized=!0,this.renderingEngine=="lit"?this.renderer=new Dt({ast:this.ast,data:this.getDataContext(),template:this,subTemplates:this.subTemplates,helpers:nt}):At("Unknown renderer specified",this.renderingEngine),this.onCreated()}async attach(t,{parentNode:e=t,startNode:o,endNode:a}={}){this.initialized||this.initialize(),this.renderRoot!=t&&(this.renderRoot=t,this.parentNode=e,this.startNode=o,this.endNode=a,this.attachEvents(),this.bindKeys(),this.attachStyles&&await this.adoptStylesheet())}getDataContext(){return{...this.data,...this.state,...this.instance}}async adoptStylesheet(){if(!this.css||!this.renderRoot||!this.renderRoot.adoptedStyleSheets)return;let t=this.css;this.stylesheet||(this.stylesheet=new CSSStyleSheet,await this.stylesheet.replace(t)),Array.from(this.renderRoot.adoptedStyleSheets).some(a=>H(a.cssRules,this.stylesheet.cssRules))||(this.renderRoot.adoptedStyleSheets=[...this.renderRoot.adoptedStyleSheets,this.stylesheet])}clone(t){let o={...{templateName:this.templateName,element:this.element,ast:this.ast,css:this.css,defaultState:this.defaultState,events:this.events,keys:this.keys,renderingEngine:this.renderingEngine,subTemplates:this.subTemplates,onCreated:this.onCreatedCallback,onThemeChanged:this.onThemeChangedCallback,onRendered:this.onRenderedCallback,parentTemplate:this.parentTemplate,onDestroyed:this.onDestroyedCallback,createComponent:this.createComponent},...t};return new M(o)}parseEventString(t){let e="delegated";h(["deep","global"],u=>{t.startsWith(u)&&(t=t.replace(u,""),e=u)}),t=t.trim();let a=u=>{let d={blur:"focusout",focus:"focusin",load:"DOMContentLoaded",unload:"beforeunload",mouseenter:"mouseover",mouseleave:"mouseout"};return d[u]&&(u=d[u]),u},r=[],i=t.split(/\s+/),s=!1,c=!1,m=[],l=[];return h(i,(u,d)=>{let v=u.replace(/(\,|\W)+$/,"").trim(),b=u.includes(",");if(!s)m.push(a(v)),s=!b;else if(!c){let g=i.slice(d).join(" ").split(",");h(g,f=>{l.push(f.trim())}),c=!0}}),h(m,u=>{l.length||l.push(""),h(l,d=>{r.push({eventName:u,eventType:e,selector:d})})}),r}attachEvents(t=this.events){(!this.parentNode||!this.renderRoot)&&At("You must set a parent before attaching events"),this.removeEvents(),this.eventController=new AbortController,!M.isServer&&this.onThemeChangedCallback!==C&&O("html").on("themechange",e=>{this.onThemeChanged({additionalData:{event:e,...e.detail}})},{abortController:this.eventController}),h(t,(e,o)=>{let a=this.parseEventString(o),r=this;h(a,i=>{let{eventName:s,selector:c,eventType:m}=i;c&&O(c,{root:this.renderRoot}).on(s,C,{abortController:this.eventController});let l=function(d){if(m!=="global"&&!r.isNodeInTemplate(d.target))return;let v=c&&O(d.target).closest(c).length==0;if(m!=="deep"&&v||k(s,["mouseover","mouseout"])&&d.relatedTarget&&d.target.contains(d.relatedTarget))return;let b=this,g=e.bind(b),f=d?.detail||{},p=b?.dataset,S=b?.value||d.target?.value||d?.detail?.value;r.call(g,{additionalData:{event:d,isDeep:v,target:b,value:S,data:{...p,...f}}})},u={abortController:this.eventController};m=="global"?O(c).on(s,l,u):O(this.renderRoot).on(s,c,l,u)})})}removeEvents(){this.eventController&&this.eventController.abort("Template destroyed")}bindKeys(t=this.keys){if(Z||Object.keys(t).length==0)return;let e=500,o={abortController:this.eventController};this.currentSequence="",O(document).on("keydown",a=>{let r=bo(a),i=r==this.currentKey;this.currentKey=r,this.currentSequence+=r,h(this.keys,(s,c)=>{c=c.replace(/\s*\+\s*/g,"+");let m=c.split(",");if(mo(m,l=>this.currentSequence.endsWith(l))){let l=document.activeElement instanceof HTMLElement&&(["input","select","textarea"].includes(document.activeElement.tagName.toLowerCase())||document.activeElement.isContentEditable);this.call(s,{additionalData:{event:a,inputFocused:l,repeatedKey:i}})!==!0&&a.preventDefault()}}),this.currentSequence+=" ",clearTimeout(this.resetSequence),this.resetSequence=setTimeout(()=>{this.currentSequence=""},e)},o).on("keyup",a=>{this.currentKey=""},o)}bindKey(t,e){if(!t||!e)return;let o=Object.keys(this.keys).length==0;this.keys[t]=e,o&&this.bindKeys()}unbindKey(t){delete this.keys[t]}isNodeInTemplate(t){return((a,r=this.startNode,i=this.endNode)=>{if(!r||!i)return!0;if(a===null)return!1;let s=r.compareDocumentPosition(a),c=i.compareDocumentPosition(a),m=(s&Node.DOCUMENT_POSITION_FOLLOWING)!==0,l=(c&Node.DOCUMENT_POSITION_PRECEDING)!==0;return m&&l})((a=>{for(;a&&a.parentNode!==this.parentNode;)a.parentNode===null&&a.host?a=a.host:a=a.parentNode;return a})(t))}render(t={}){this.initialized||this.initialize();let e={...this.getDataContext(),...t};return this.setDataContext(e,{rerender:!1}),this.renderer.setData(e),this.rendered||(this.html=this.renderer.render(),setTimeout(this.onRendered,0)),this.rendered=!0,setTimeout(this.onUpdated,0),this.html}$(t,{root:e=this.renderRoot,filterTemplate:o=!0,...a}={}){if(!M.isServer&&k(t,["body","document","html"])&&(e=document),e||(e=globalThis),e==this.renderRoot){let r=O(t,{root:e,...a});return o?r.filter(i=>this.isNodeInTemplate(i)):r}else return O(t,{root:e,...a})}$$(t,e){return this.$(t,{root:this.renderRoot,pierceShadow:!0,filterTemplate:!0,...e})}call(t,{params:e,additionalData:o={},firstArg:a,additionalArgs:r}={}){let i=[];if(!this.isPrototype){if(!e){let s=this.element;e={el:this.element,tpl:this.instance,self:this.instance,component:this.instance,$:this.$.bind(this),$$:this.$$.bind(this),reaction:this.reaction.bind(this),signal:this.signal.bind(this),afterFlush:L.afterFlush,nonreactive:L.nonreactive,flush:L.flush,data:this.data,settings:this.element?.settings,state:this.state,isRendered:()=>this.rendered,isServer:M.isServer,isClient:!M.isServer,dispatchEvent:this.dispatchEvent.bind(this),attachEvent:this.attachEvent.bind(this),bindKey:this.bindKey.bind(this),unbindKey:this.unbindKey.bind(this),abortController:this.eventController,helpers:nt,template:this,templateName:this.templateName,templates:M.renderedTemplates,findTemplate:this.findTemplate,findParent:this.findParent.bind(this),findChild:this.findChild.bind(this),findChildren:this.findChildren.bind(this),content:this.instance.content,get darkMode(){return s.isDarkMode()},...o},i.push(e)}if(r&&i.push(...r),N(t))return t.apply(this.element,i)}}attachEvent(t,e,o,{eventSettings:a={},querySettings:r={pierceShadow:!0}}={}){return O(t,document,r).on(e,o,{abortController:this.eventController,returnHandler:!0,...a})}dispatchEvent(t,e,o,{triggerCallback:a=!0}={}){if(!M.isServer){if(a){let r=`on${jt(t)}`,i=this.element[r];J(i).call(this.element,e)}return O(this.element).dispatchEvent(t,e,o)}}reaction(t){this.reactions.push(L.create(t))}signal(t,e){return new U(t,e)}clearReactions(){h(this.reactions||[],t=>t.stop())}findTemplate=t=>M.findTemplate(t);findParent=t=>M.findParentTemplate(this,t);findChild=t=>M.findChildTemplate(this,t);findChildren=t=>M.findChildTemplates(this,t);static renderedTemplates=new Map;static addTemplate(t){if(t.isPrototype)return;let e=M.renderedTemplates.get(t.templateName)||[];e.push(t),M.renderedTemplates.set(t.templateName,e)}static removeTemplate(t){if(t.isPrototype)return;let e=M.renderedTemplates.get(t.templateName)||[];lo(e,o=>o.id==t.id),M.renderedTemplates.set(e)}static getTemplates(t){return M.renderedTemplates.get(t)||[]}static findTemplate(t){return M.getTemplates(t)[0]}static findParentTemplate(t,e){let o,a=r=>!(o||!r?.templateName||e&&r?.templateName!==e);if(!o){let r=t.element?.parentNode;for(;r;){if(a(r.component)){o={...r.component,...r.dataContext};break}r=r.parentNode}}for(;t;)if(t=t._parentTemplate,a(t)){o={...t.instance,...t.data};break}return o}static findChildTemplates(t,e){let o=[];function a(r,i){(!i||r.templateName===i)&&o.push({...r.instance,...r.data}),r._childTemplates&&r._childTemplates.forEach(s=>{a(s,i)})}return a(t,e),o}static findChildTemplate(t,e){return M.findChildTemplates(t,e)[0]}};var Xn=/\s+/mg,jo=["disabled","value"],Jn=n=>w(n)?n.split("-").reverse().join("-"):n,Zn=n=>w(n)?n.replaceAll(Xn,"-"):n,Ot=({el:n,attribute:t,attributeValue:e,properties:o,componentSpec:a,oldValue:r})=>{let i=({attribute:l,optionValue:u,optionAttributeValue:d})=>{u=Zn(u);let v=[u];l&&u&&(v.push(`${l}-${e}`),v.push(`${e}-${l}`)),v.push(Jn(u)),v=rt(v);let b=co(v,f=>D(a.optionAttributes,f));return b?k(e?.constructor,[Object,Array,Function])?{matchingAttribute:void 0,matchingValue:void 0}:{matchingAttribute:D(a.optionAttributes,b),matchingValue:b}:{matchingAttribute:void 0,matchingValue:void 0}},s=(l,u)=>{let d=G(l);u!==void 0&&(n[d]=u),k(l,jo)&&n.requestUpdate()},c=l=>{let u=G(l);n[u]=null,k(l,jo)&&n.requestUpdate()},m=(l,u)=>{let d=a.propertyTypes[l]==Boolean,v=a.optionAttributes[l]==l,b=k(l,a.attributeClasses);return(d||b||v)&&k(u,["",!0,l])};if(a){if(t=="class"&&e){let l=w(r)?r.split(" "):[],u=e.split(" "),d=we(l,u),v=we(u,l);h(d,b=>{Ot({el:n,attribute:b,attributeValue:null,componentSpec:a})}),h(v,b=>{Ot({el:n,attribute:b,attributeValue:!0,componentSpec:a})})}else if(k(t,a.attributes)){if(m(t,e)){e=!0,s(t,e);return}if(e===null){c(t);return}let{matchingValue:l}=i({attribute:t,optionValue:e});l&&s(t,l)}else if(e!==void 0){let{matchingAttribute:l,matchingValue:u}=i({optionValue:t,optionAttributeValue:e});if(l&&e===null){n[l]==t&&c(l);return}l&&u&&s(l,u)}}else if(o&&e!==void 0&&t.includes("-")){let l=G(t),u=o[t];if(l!==t&&u?.alias){let d=u?.converter?.fromAttribute,v=d?d(e):e;v&&s(l,v);return}}};var yt=class n extends ot{static shadowRootOptions={...ot.shadowRootOptions,delegatesFocus:!1};static scopedStyleSheet=null;constructor(){super(),this.renderCallbacks=[]}updated(){super.updated(),h(this.renderCallbacks,t=>t())}addRenderCallback(t){this.renderCallbacks.push(t)}static getProperties({properties:t={},defaultSettings:e,componentSpec:o}){return ro(t).length||(o&&(t.class={type:String,noAccessor:!0,alias:!0},h(o.attributes,a=>{let r=o.propertyTypes[a],i=G(a);t[i]=n.getPropertySettings(a,r)}),h(o.properties,a=>{let r=o.propertyTypes[a],i=G(a);t[i]=n.getPropertySettings(a,r)}),h(o.optionAttributes,(a,r)=>{let i=G(r);t[i]={type:String,noAccessor:!0,alias:!0,attribute:r}})),e&&h(e,(a,r)=>{let i={propertyOnly:Ut(a)};t[r]=a?.type?e:n.getPropertySettings(r,a?.constructor,i)}),h(t,(a,r)=>{let i=lt(r);i!==r&&!t[i]&&t[r]&&(t[i]={...t[r],noAccessor:!0,alias:!0})})),t}static getPropertySettings(t,e=String,{propertyOnly:o=!1}={}){let a={type:e,attribute:!0,hasChanged:(r,i)=>!H(r,i)};return o||e==Function?(a.attribute=!1,a.hasChanged=(r,i)=>!0):e==Boolean&&(a.converter={fromAttribute:(r,i)=>k(r,["false","0","null","undefined"])?!1:k(r,["",!0,"true"])?!0:!!r,toAttribute:(r,i)=>String(r)}),a}setDefaultSettings({defaultSettings:t={},componentSpec:e}){this.defaultSettings=t,h(t,(o,a)=>{o?.default!==void 0?this.defaultSettings[a]=o.default:this.defaultSettings[a]=o}),e?.defaultValues&&(this.defaultSettings={...e.defaultValues,...this.defaultSettings})}getSettingsFromConfig({componentSpec:t,properties:e}){let o={};return h(e,(a,r)=>{if(a.alias===!0)return;let i=this[r],s=i??this.defaultSettings[r]??(t?.defaultSettings||{})[r];s!==void 0&&(o[r]=s),t&&o[i]!==void 0&&(o[r]=!0)}),o}createSettingsProxy({componentSpec:t,properties:e}){let o=this;return o.settingsVars=new Map,new Proxy({},{get:(a,r)=>{let i=o.getSettings({componentSpec:t,properties:e}),s=D(i,r),c=o.settingsVars.get(r);return c?c.get():(c=new U(s),o.settingsVars.set(r,c)),s},set:(a,r,i,s)=>{o.setSetting(r,i);let c=o.settingsVars.get(r);return c?c.set(i):(c=new U(i),o.settingsVars.set(r,c)),!0}})}getUIClasses({componentSpec:t,properties:e}){if(!t)return;let o=[];h(t.attributes,r=>{let i=G(r),s=this[i];if(s){let c=t.allowedValues[r];t.propertyTypes[r]==Boolean||s==r&&c&&k(s,c)?o.push(r):c&&k(s,c)&&o.push(s),t.attributeClasses.includes(r)&&o.push(r)}});let a=rt(o).join(" ");return a&&(a+=" "),a}isDarkMode(){return Z?void 0:O(this).cssVar("dark-mode")=="true"}$(t,{root:e=this?.renderRoot||this.shadowRoot}={}){return e||console.error("Cannot query DOM until element has rendered."),O(t,{root:e})}$$(t){return O(t,{root:this.originalDOM.content})}call(t,{firstArg:e,additionalArgs:o,args:a=[this.component,this.$.bind(this)]}={}){if(e&&a.unshift(e),o&&a.push(...o),N(t))return t.apply(this,a)}};var y=({template:n="",ast:t,css:e="",pageCSS:o="",tagName:a,delegatesFocus:r=!1,templateName:i=G(a),createComponent:s=C,events:c={},keys:m={},onCreated:l=C,onRendered:u=C,onDestroyed:d=C,onThemeChanged:v=C,onAttributeChanged:b=C,defaultSettings:g={},defaultState:f={},subTemplates:p={},renderingEngine:S,properties:P,componentSpec:A=!1,plural:B=!1,singularTag:q}={})=>{t||(t=new vt(n).compile()),h(p,j=>{j.css&&(e+=j.css)}),o&&xe(o);let z=new _t({templateName:i,isPrototype:!0,renderingEngine:S,ast:t,css:e,events:c,keys:m,defaultState:f,subTemplates:p,onCreated:l,onRendered:u,onDestroyed:d,onThemeChanged:v,createComponent:s}),T;if(a){if(T=class extends yt{static get styles(){return Kt(e)}static template=z;static properties=yt.getProperties({properties:P,componentSpec:A,defaultSettings:g});defaultSettings={};constructor(){super(),this.css=e,this.componentSpec=A,this.settings=this.createSettingsProxy({componentSpec:A,properties:T.properties}),this.setDefaultSettings({defaultSettings:g,componentSpec:A})}connectedCallback(){super.connectedCallback()}triggerAttributeChange(){h(T.properties,(X,V)=>{let ct=lt(V),to=this[V];!X.alias&&ct&&to===!0&&this.setAttribute(ct,""),Ot({el:this,attribute:ct,properties:T.properties,attributeValue:to,componentSpec:A})})}willUpdate(){Z&&this.triggerAttributeChange(),this.template||(this.template=z.clone({data:this.getData(),element:this,renderRoot:this.renderRoot}),this.template.initialized||this.template.initialize(),this.component=this.template.instance,this.dataContext=this.template.data),super.willUpdate()}firstUpdated(){super.firstUpdated()}updated(){super.updated()}disconnectedCallback(){super.disconnectedCallback(),this.template&&this.template.onDestroyed(),z.onDestroyed()}adoptedCallback(){super.adoptedCallback(),this.call(onMoved)}attributeChangedCallback(X,V,ct){super.attributeChangedCallback(X,V,ct),Ot({el:this,attribute:X,attributeValue:ct,properties:T.properties,oldValue:V,componentSpec:A}),this.call(b,{args:[X,V,ct]})}getSettings(){return this.getSettingsFromConfig({componentSpec:A,properties:T.properties})}setSetting(X,V){this[X]=V}getData(){let V={...this.getSettings()};return Z||(V.darkMode=this.isDarkMode()),A&&(V.ui=this.getUIClasses({componentSpec:A,properties:T.properties})),B===!0&&(V.plural=!0),V}render(){let X={...this.getData(),...this.tpl};return this.template.render(X)}},Tt&&customElements.get(a))return T;customElements.define(a,T)}return a?T:z};var I=class n{static DEFAULT_DIALECT="standard";static DIALECT_TYPES={standard:"standard",classic:"classic",verbose:"verbose"};constructor(t,{plural:e=!1,dialect:o=n.DEFAULT_DIALECT}={}){this.spec=t||{},this.plural=e,this.dialect=o,this.componentSpec=null}getComponentName({plural:t=this.plural,lang:e="html"}={}){let o=this.spec;return t?o.pluralExportName:o.exportName}getTagName({plural:t=this.plural,lang:e="html"}={}){let o=this.spec;return t?o.pluralTagName:o.tagName}getDefinition({plural:t=this.plural,minUsageLevel:e,dialect:o=this.dialect}={}){let a={content:[],types:[],states:[],variations:[],settings:[]},r=l=>e?usageLevel>(l.usageLevel||1):!0,i=this.spec,s=t?i?.examples?.defaultPluralContent:i?.examples?.defaultContent,c=ge(i?.examples?.defaultAttributes||{}).join(" ");a.types.push({title:i.name,description:"",examples:[{showCode:!1,code:this.getCodeFromModifiers(c,{html:s}),components:[this.getComponentParts(c,{html:s})]}]});let m=this.getOrderedParts();return h(m,l=>{h(i[l],u=>{if(!r(u))return;let d=this.getCodeExamples(u,{defaultAttributes:i?.examples?.defaultAttributes,defaultContent:s});a[l].push(d)})}),a}getOrderedParts(){return["types","content","states","variations","settings"]}getOrderedExamples({plural:t=!1,minUsageLevel:e,dialect:o=this.dialect}={}){let a=this.getDefinition({plural:t,minUsageLevel:e,dialect:o});return this.getOrderedParts().map(r=>({title:Et(r),examples:a[r]}))}getDefinitionMenu({IDSuffix:t="-example",plural:e=!1,minUsageLevel:o}={}){return this.getOrderedExamples({plural:e,minUsageLevel:o}).map(i=>({title:i.title,items:i.examples.map(s=>({id:Ht(`${s.title}${t}`),title:s.title}))}))}getComponentPartsFromHTML(t,{dialect:e}={}){t=t.trim();let o=t.indexOf(" "),a=t.indexOf(">"),r=t.slice(1,o!==-1?o:a);if(r=="div")return{html:t};let i=o!==-1?t.slice(o,a).trim():"",s={};if(i){let l=i.split(" ");for(let u of l){let[d,v]=u.split("=");v?s[d]=v.replace(/"/g,""):s[d]=!0}}let c=this.getAttributeStringFromModifiers(t,{attributes:s,dialect:e}),m=t.slice(a+1,t.lastIndexOf("<")).trim();return{componentName:r,attributes:s,attributeString:c,html:m}}getCodeExamples(t,{defaultAttributes:e,defaultContent:o}={}){let a=[],r=this.getAttributeName(t);if(e){let i=Y(e);delete i[r],e=ge(i).join(" ")}if(t.options){let i=[];h(t.options,(s,c)=>{let m,l;if(s.exampleCode)m=s.exampleCode,l=this.getComponentPartsFromHTML(m);else{let d;w(s.value)?d=s.value:w(s)&&(d=s),E(s.value)&&(d=s.value.filter(v=>w(v))[0]),e&&(d=`${d} ${e}`),m=this.getCodeFromModifiers(d,{html:o}),l=this.getComponentParts(d,{html:o})}let u={code:m,components:[l]};t.separateExamples?a.push(u):i.push(u)}),t.separateExamples||a.push({code:i.map(s=>s.code).join(`
`),components:Bt([...i.map(s=>s.components)])})}else{let i,s,c=this.getAttributeName(t);e&&(c=`${c} ${e}`),t.exampleCode?(i=t.exampleCode,s=this.getComponentPartsFromHTML(i)):(i=this.getCodeFromModifiers(c,{html:o}),s=this.getComponentParts(c,{html:o}));let m={code:i,components:[s]};a.push(m)}return{title:t.name,description:t.description,examples:a}}getComponentParts(t,{lang:e="html",plural:o=this.plural,text:a,html:r,dialect:i=this.dialect}={}){let s=e=="html"?this.getTagName({plural:o}):this.getComponentName({plural:o,lang:e});if(!a&&!r){let l=t||String(s).replace(/^ui-/,"");a=String(l).replace(/\-/mg," "),r=Et(a)}let c=this.getAttributesFromModifiers(t);return{componentName:s,attributes:c,attributeString:this.getAttributeStringFromModifiers(t,{attributes:c,dialect:i}),html:r}}getCodeFromModifiers(t,e){let{componentName:o,attributeString:a,html:r}=this.getComponentParts(t,e);return`<${o}${a}>${r}</${o}>`}getAttributesFromModifiers(t=""){let e=this.getWebComponentSpec(),o={},a=String(t).split(" ");return h(a,r=>{let i=e.optionAttributes[r];i?o[i]=r:o[r]=!0}),o}getSingleAttributeString(t,e,{joinWith:o="=",quoteCharacter:a=":"}={}){return e==!0||e==t?`${t}`:`${t}${o}${a}${e}${a}`}getAttributeString(t,{dialect:e=this.dialect,joinWith:o="=",quoteCharacter:a="'"}={}){let r,i=[],s=Y(t),c=this.getWebComponentSpec();if(h(t,(m,l)=>{c.optionAttributes[m]?i.push(m):s[l]=m}),i.length){let m=modifierAttributes.join(" ");if(e==n.DIALECT_TYPES.standard)r+=` ${m}`;else if(e==n.DIALECT_TYPES.classic)return` class="${m}"`}else if(e==n.DIALECT_TYPES.verbose||keys(s)){let m=" ";h(t,(l,u)=>{let d=this.getSingleAttributeString(u,l,{joinWith:o,quoteCharacter:a});m+=` ${d}`})}return r}getAttributeStringFromModifiers(t,{dialect:e=this.dialect,attributes:o,joinWith:a="=",quoteCharacter:r='"'}={}){if(!t)return"";if(e==n.DIALECT_TYPES.standard)return` ${t}`;if(e==n.DIALECT_TYPES.classic)return` class="${t}"`;if(e==n.DIALECT_TYPES.verbose){o||(o=this.getAttributesFromModifiers(t));let i=" ";return h(o,(s,c)=>{let m=this.getSingleAttributeString(c,s,{joinWith:a,quoteCharacter:r});i+=` ${m}`}),` ${i.trim()}`}}getWebComponentSpec(t=this.spec,{plural:e=this.plural}={}){if(t==this.spec&&this.componentSpec)return this.componentSpec;let o={tagName:t.tagName,content:[],contentAttributes:[],types:[],variations:[],states:[],events:[],settings:[],properties:[],attributes:[],optionAttributes:{},propertyTypes:{},allowedValues:{},attributeClasses:[],defaultValues:{},inheritedPluralVariations:[]},a=s=>{let c=t[s]||[];if(e){let l=D({types:"pluralSharedTypes",variations:"pluralSharedVariations",states:"pluralSharedStates",content:"pluralSharedContent",settings:"pluralSharedSettings",events:"pluralSharedEvents"},s),u=D(t,l)||[];l&&(c=c.filter(d=>{let v=this.getPropertyName(d);return k(v,u)})),s=s.replace("pluralOnly","").toLowerCase()}h(c,m=>{let l=this.getPropertyName(m);if(!l)return;o[s]&&o[s].push(l);let u=this.getAllowedValues(m);u&&(o.allowedValues[l]=u);let d=this.getPropertyType(m,s,u);d&&(o.propertyTypes[l]=d);let v=this.getAttributeName(m,d);v?o.attributes.push(v):o.properties.push(l);let b=this.getDefaultValue(m,d,s);b!==void 0&&(o.defaultValues[l]=b),s==="content"&&(m.attribute?o.contentAttributes.push(m.attribute):m.slot&&o.slots.push(m.slot)),v&&m.includeAttributeClass&&o.attributeClasses.push(l)})};h(["content","types","states","variations","settings","events"],a),e&&h(["pluralOnlyContent","pluralOnlyTypes","pluralOnlyStates","pluralOnlySettings","pluralOnlyVariations","pluralOnlyEvents"],a);let i=W(o.allowedValues,(s,c)=>s=s.filter(m=>w(m)));return o.optionAttributes=fe(i),o.inheritedPluralVariations=t.pluralSharedVariations||[],this.componentSpec=o,o}getPluralWebComponentSpec(t=this.spec){if(t==this.spec&&this.componentSpec)return this.componentSpec;let e={tagName:t.tagName,content:[],contentAttributes:[],types:[],variations:[],states:[],events:[],settings:[],properties:[],attributes:[],optionAttributes:{},propertyTypes:{},allowedValues:{},attributeClasses:[],defaultValues:{},inheritedPluralVariations:[]},o=r=>{let i=t[r]||[];h(i,s=>{let c=this.getPropertyName(s);if(!c)return;e[r].push(c);let m=this.getAllowedValues(s);m&&(e.allowedValues[c]=m);let l=this.getPropertyType(s,r,m);l&&(e.propertyTypes[c]=l);let u=this.getAttributeName(s,l);u?e.attributes.push(u):e.properties.push(c);let d=this.getDefaultValue(s,l,r);d!==void 0&&(e.defaultValues[c]=d),r==="content"&&(s.attribute?e.contentAttributes.push(s.attribute):s.slot&&e.slots.push(s.slot)),u&&s.includeAttributeClass&&e.attributeClasses.push(c)})};o("content"),o("types"),o("states"),o("variations"),o("pluralVariations"),o("settings"),o("events");let a=W(e.allowedValues,(r,i)=>r=r.filter(s=>w(s)));return e.optionAttributes=fe(a),e.inheritedPluralVariations=t.pluralSharedVariations||[],this.componentSpec=e,e}getAttributeName(t,e){if(this.canUseAttribute(e))return this.getPropertyName(t)}getPropertyName(t){if(t.attribute)return t.attribute;if(w(t.name))return t.name.toLowerCase()}getPropertyType(t,e,o=[]){let a={string:String,boolean:Boolean,object:Object,array:Array,function:Function},r,i;return e=="events"?r=Function:k(e,["types","states","variations"])?r=Boolean:k(e,["content"])&&(r=String),t.type&&a[t.type]?i=t.type:o.length&&(i=typeof o[0]),i&&(r=D(a,i)),r}getAllowedValues(t){let e;return t.options&&(e=t.options.map(o=>o?.value!==void 0?o.value:o).filter(Boolean),e=rt(Bt(e))),e}getDefaultValue(t,e,o){return t.defaultValue!==void 0?t.defaultValue:o!=="settings"?void 0:D({string:"",array:[],boolean:!1,function:C,number:0,object:{}},e)}canUseAttribute(t){return t!=Function}};var Me={uiType:"element",name:"Container",description:"A container limits content to a maximum width",tagName:"ui-container",exportName:"UIContainer",content:[],types:[],variations:[],events:[],settings:[]};var ta=new I,Pe=ta.getWebComponentSpec(Me);var Re={uiType:"element",name:"Rail",description:"A rail is used to show accompanying content next to the main view of a site",tagName:"ui-rail",exportName:"UIRail",content:[],types:[],variations:[],events:[],settings:[]};var oa=new I,ze=oa.getWebComponentSpec(Re);var de={uiType:"element",name:"Button",description:"A button indicates a possible user action",tagName:"ui-button",exportName:"UIButton",examples:{defaultPluralContent:`
  <ui-button>One</ui-button>
  <ui-button>Two</ui-button>
  <ui-button>Three</ui-button>
`},content:[{name:"Icon",includeAttributeClass:!0,attribute:"icon",couplesWith:["ui-icon"],description:"include an icon",exampleCode:'<ui-button icon="pause">Pause</ui-button>'}],types:[{name:"Emphasis",attribute:"emphasis",description:"be emphasized in a layout",usageLevel:1,separateExamples:!0,options:[{name:"Primary",value:"primary",description:"This button should appear to be emphasized as the first action that should be taken over other options",exampleCode:`<ui-button primary>Confirm</ui-button>
<ui-button>Cancel</ui-button>`},{name:"Secondary",value:"secondary",description:"This button should appear to be emphasized as a secondary option that should appear after other options",exampleCode:`<ui-button secondary>Confirm</ui-button>
<ui-button>Cancel</ui-button>`}]},{name:"Toggle",attribute:"toggle",description:"emphasize its active state",usageLevel:3,exampleCode:`<ui-button toggle>Inactive</ui-button>
<ui-button toggle active>Active</ui-button>`},{name:"Animated",attribute:"animated",description:"animate to show hidden content",includeAttributeClass:!0,usageLevel:3,options:[{name:"Animated",value:["horizontal-animated"],description:"formatted to animate hidden content horizontally",exampleCode:`<ui-button animated>
  <span slot="visible">Hover Me</span>
  <span slot="hidden">Hidden</span>
</ui-button>`},{name:"Vertical Animated",value:"vertical-animated",description:"formatted to animate hidden content vertically",exampleCode:`<ui-button vertical-animated>
  <span slot="visible">Hover Me</span>
  <span slot="hidden">Hidden</span>
</ui-button>`},{name:"Fade Animated",value:["fade-animated"],description:"formatted to fade in hidden content",exampleCode:`<ui-button fade-animated>
  <span slot="visible">Hover Me</span>
  <span slot="hidden">Hidden</span>
</ui-button>`}]}],states:[{name:"Hover",attribute:"hover",description:"be hovered"},{name:"Focus",attribute:"focused",description:"be focused by the keyboard"},{name:"Active",attribute:"active",description:"be activated"},{name:"Disabled",attribute:"disabled",includeAttributeClass:!0,description:"have interactions disabled",options:[{name:"Disabled",value:"disabled",description:"disable interactions"},{name:"Clickable Disabled",value:"clickable-disabled",description:"allow interactions but appear disabled"}]},{name:"Loading",attribute:"loading",description:"indicate it is loading content"}],variations:[{name:"Attached",attribute:"attached",description:"attach to other content",usageLevel:2,includeAttributeClass:!0,options:[{name:"Top Attached",value:"top-attached",description:"appear attached to the top of other content"},{name:"Attached",value:"attached",description:"attach to content above and below"},{name:"Bottom Attached",value:"bottom-attached",description:"attach to the bottom"},{name:"Left Attached",value:"left-attached",description:"attach to the left"},{name:"Right Attached",value:"right-attached",description:"attach to the right"}]},{name:"Basic",attribute:"basic",description:"be de-emphasized in a layout",usageLevel:2,options:[{name:"Basic",value:"basic",description:"appear slightly less pronounced"},{name:"Very Basic",value:"very-basic",description:"appear much less pronounced"}]},{name:"Circular",attribute:"circular",description:"be rounded like a circle",usageLevel:3},{name:"Colored",attribute:"color",description:"be colored",usageLevel:3,options:[{name:"Red",value:"red",description:"red"},{name:"Orange",value:"orange",description:"orange"},{name:"Yellow",value:"yellow",description:"yellow"},{name:"Olive",value:"olive",description:"olive"},{name:"Green",value:"green",description:"green"},{name:"Teal",value:"teal",description:"teal"},{name:"Blue",value:"blue",description:"blue"},{name:"Violet",value:"violet",description:"violet"},{name:"Purple",value:"purple",description:"purple"},{name:"Pink",value:"pink",description:"pink"},{name:"Brown",value:"brown",description:"brown"},{name:"Grey",value:"grey",description:"grey"},{name:"Black",value:"black",description:"black"}]},{name:"Compact",attribute:"compact",usageLevel:3,description:"reduce its padding to fit into tighter spaces without adjusting its font size",options:[{name:"Compact",value:"compact",description:"reduce its padding slightly"},{name:"Very Compact",value:"very-compact",description:"reduce its padding greatly"}]},{name:"Social Site",attribute:"social",value:"social",usageLevel:5,description:"appear formatted with the brand colors of a social website",includeAttributeClass:!0,options:[{name:"Instagram",value:"instagram",description:"match the brand colors of Instagram",exampleCode:'<ui-button instagram icon="instagram">Instagram</ui-button>'},{name:"Facebook",value:"facebook",description:"match the brand colors of Facebook",exampleCode:'<ui-button facebook icon="facebook">Facebook</ui-button>'},{name:"Twitter",value:"twitter",description:"match the brand colors of Twitter",exampleCode:'<ui-button twitter icon="twitter">Twitter</ui-button>'},{name:"Linkedin",value:"linkedin",description:"match the brand colors of LinkedIn",exampleCode:'<ui-button linkedin icon="linkedin">LinkedIn</ui-button>'},{name:"Youtube",value:"youtube",description:"match the brand colors of YouTube",exampleCode:'<ui-button youtube icon="youtube">YouTube</ui-button>'}]},{name:"Positive",attribute:"positive",usageLevel:2,description:"indicate a positive action",options:[{name:"Positive",value:["positive"],description:"be positive"},{name:"Subtle Positive",value:"subtle-positive",description:"subtly hint at a positive action"}]},{name:"Warning",attribute:"warning",usageLevel:2,description:"indicate a potentially dangerous action",options:[{name:"Warning",value:["warning"],description:"be dangerous"},{name:"Subtle Warning",value:"subtle-warning",description:"subtly hint it may be dangerous"}]},{name:"Negative",attribute:"negative",usageLevel:2,description:"indicate a negative action",options:[{name:"Negative",value:["negative"],description:"be negative"},{name:"Subtle Negative",value:"subtle-negative",description:"subtly hint at a negative action"}]},{name:"Info",attribute:"info",usageLevel:2,description:"indicate it contains information",options:[{name:"Info",value:["info"],description:"appear dangerous"},{name:"Subtle Info",value:"subtle-info",description:"subtly hint it may be dangerous"}]},{name:"Transparent",attribute:"transparent",usageLevel:2,description:"appear transparent",exampleCode:`<div class="transparent segments">
  <div class="light segment">
    <ui-button transparent>Transparent</ui-button>
  </div>
  <div class="dark segment">
    <ui-button inverted transparent>Transparent</ui-button>
  </div>
</div>`},{name:"Floated",attribute:"floated",usageLevel:1,description:"align to the left or right of its container",options:[{name:"Left Floated",value:["left-floated"],description:"appear to the left of content"},{name:"Right Floated",value:"right-floated",description:"appear to the right of content"}]},{name:"Fluid",attribute:"fluid",usageLevel:1,description:"take the width of its container"},{name:"Size",attribute:"size",usageLevel:1,description:"vary in size",options:[{name:"Mini",value:"mini",description:"appear extremely small"},{name:"Tiny",value:"tiny",description:"appear very small"},{name:"Small",value:"small",description:"appear small"},{name:"Medium",value:"medium",description:"appear normal sized"},{name:"Large",value:"large",description:"appear larger than normal"},{name:"Big",value:"big",description:"appear much larger than normal"},{name:"Huge",value:"huge",description:"appear very much larger than normal"},{name:"Massive",value:"massive",description:"appear extremely larger than normal"}]},{name:"Inverted",description:"be formatted to appear on dark backgrounds",usageLevel:2,attribute:"inverted"}],settings:[{name:"Icon Only",type:"boolean",attribute:"icon-only",defaultValue:!1,description:"Enable to remove spacing for text"},{name:"Icon After",type:"boolean",attribute:"icon-after",defaultValue:!1,description:"Enable to position the icon after the text"},{name:"Link",type:"string",attribute:"href",description:"link to a webpage"}],supportsPlural:!0,pluralName:"Buttons",pluralTagName:"ui-buttons",pluralExportName:"UIButtons",pluralDescription:"Buttons can exist together as a group",pluralContent:[{name:"Or",attribute:"or",slot:"or",description:"A button group can be formatted to show a conditional choice"}],pluralSharedTypes:[],pluralOnlyTypes:[{name:"vertical",attribute:"vertical",description:"A button group can be formatted to show buttons in a vertical stack",usageLevel:3}],pluralOnlyVariations:[{name:"Separate",attribute:"separate",description:"A button group can appear with their buttons separated"},{name:"Equal Width",attribute:"equal-width",description:"A button group can be formatted to have the same width for each button",usageLevel:3,options:[{name:"Two",value:"two",description:"A button group can have two items evenly split"},{name:"Three",value:"three",description:"A button group can have three items evenly split"},{name:"Four",value:"four",description:"A button group can have four items evenly split"},{name:"Five",value:"five",description:"A button group can have five items evenly split"},{name:"Six",value:"six",description:"A button group can have six items evenly split"}]}],pluralSharedVariations:["inverted","size","floated","compact","color","attached"]};var _e=new I(de).getWebComponentSpec(),De=new I(de,{plural:!0}).getWebComponentSpec();var Oe={uiType:"element",name:"Icon",description:"An icon is a glyph used to represent something else",tagName:"ui-icon",exportName:"UIIcon",content:[{name:"Icon",attribute:"icon",description:"An icon can specify what icon should appear",usageLevel:1,options:["airplay","alert-circle","alert-octagon","alert-triangle","align-center","align-justify","align-left","align-right","anchor","aperture","archive","arrow-down","arrow-down-circle","arrow-down-left","arrow-down-right","arrow-left","arrow-left-circle","arrow-right","arrow-right-circle","arrow-up","arrow-up-circle","arrow-up-left","arrow-up-right","at-sign","award","bar-chart","bar-chart-2","battery","battery-charging","bell","bell-off","bluetooth","bold","book","book-open","bookmark","box","briefcase","calendar","camera","camera-off","cast","check","check-circle","check-square","chevron-down","chevron-left","chevron-right","chevron-up","chevrons-down","chevrons-left","chevrons-right","chevrons-up","chrome","circle","clipboard","clock","cloud","cloud-drizzle","cloud-lightning","cloud-off","cloud-rain","cloud-snow","code","codepen","codesandbox","coffee","columns","command","compass","copy","corner-down-left","corner-down-right","corner-left-down","corner-left-up","corner-right-down","corner-right-up","corner-up-left","corner-up-right","cpu","credit-card","crop","crosshair","currentColor","database","delete","disc","divide","divide-circle","divide-square","dollar-sign","download","download-cloud","dribbble","droplet","edit","edit-2","edit-3","external-link","eye","eye-off","facebook","fast-forward","feather","figma","file","file-minus","file-plus","file-text","film","filter","flag","folder","folder-minus","folder-plus","framer","frown","github","gitlab","globe","grid","hard-drive","hash","headphones","heart","help-circle","hexagon","home","image","inbox","info","instagram","italic","key","layers","layout","life-buoy","linkify","linkify-2","linkedin","list","loader","lock","log-in","log-out","mail","map","map-pin","maximize","maximize-2","meh","menu","message-circle","message-square","mic","mic-off","minimize","minimize-2","minus","minus-circle","minus-square","monitor","moon","more-horizontal","more-vertical","mouse-pointer","move","music","navigation","navigation-2","octagon","package","paperclip","pause","pause-circle","pen-tool","percent","phone","phone-call","phone-forwarded","phone-incoming","phone-missed","phone-off","phone-outgoing","pie-chart","play","play-circle","plus","plus-circle","plus-square","pocket","power","printer","radio","refresh-ccw","refresh-cw","repeat","rewind","rotate-ccw","rotate-cw","rss","save","scissors","search","send","server","settings","share","share-2","shield","shield-off","shopping-bag","shopping-cart","shuffle","sidebar","skip-back","skip-forward","slack","slash","sliders","smartphone","smile","speaker","square","star","stop-circle","sun","sunrise","sunset","table","tablet","tag","target","terminal","thermometer","thumbs-down","thumbs-up","toggle-left","toggle-right","tool","trash","trash-2","trello","trending-down","trending-up","triangle","truck","tv","twitch","twitter","type","umbrella","underline","unlock","upload","upload-cloud","user","user-check","user-minus","user-plus","user-x","users","video","video-off","voicemail","volume","volume-1","volume-2","volume-x","watch","wifi","wifi-off","wind","x","x-circle","x-octagon","x-square","youtube","zap","zap-off","zoom-in","zoom-out"]}],states:[{name:"Disabled",attribute:"disabled",description:"can appear disabled",usageLevel:1},{name:"Loading",attribute:"loading",description:"can be used as a simple loader",usageLevel:1}],variations:[{name:"Link",description:"can be formatted as a link",usageLevel:1},{name:"Fitted",description:"can be fitted without any space to the left or right of it.",usageLevel:1},{name:"Colored",value:"color",description:"can be colored",usageLevel:2,options:[{name:"Red",value:"red",description:"A button can be red"},{name:"Orange",value:"orange",description:"A button can be orange"},{name:"Yellow",value:"yellow",description:"A button can be yellow"},{name:"Olive",value:"olive",description:"A button can be olive"},{name:"Green",value:"green",description:"A button can be green"},{name:"Teal",value:"teal",description:"A button can be teal"},{name:"Blue",value:"blue",description:"A button can be blue"},{name:"Violet",value:"violet",description:"A button can be violet"},{name:"Purple",value:"purple",description:"A button can be purple"},{name:"Pink",value:"pink",description:"A button can be pink"},{name:"Brown",value:"brown",description:"A button can be brown"},{name:"Grey",value:"grey",description:"A button can be grey"},{name:"Black",value:"black",description:"A button can be black"}]},{name:"Size",value:"size",usageLevel:1,description:"can vary in size",options:[{name:"Mini",value:"mini",description:"An element can appear extremely small"},{name:"Tiny",value:"tiny",description:"An element can appear very small"},{name:"Small",value:"small",description:"An element can appear small"},{name:"Medium",value:"medium",description:"An element can appear normal sized"},{name:"Large",value:"large",description:"An element can appear larger than normal"},{name:"Big",value:"big",description:"An element can appear much larger than normal"},{name:"Huge",value:"huge",description:"An element can appear very much larger than normal"},{name:"Massive",value:"massive",description:"An element can appear extremely larger than normal"}]},{name:"Inverted",description:"can be formatted to appear on dark backgrounds",usageLevel:2,attribute:"inverted"}],settings:[{name:"href",type:"string",attribute:"href",description:"Link to a page"}],supportsPlural:!0,pluralName:"Icons",pluralTagName:"ui-icons",pluralDescription:"Icons can exist together as a group",pluralVariations:["colored","size"],examples:{defaultAttributes:{icon:"check-circle"}}};var ra=new I,Ve=ra.getWebComponentSpec(Oe);var Ue={uiType:"element",name:"Menu",description:"A menu displays grouped navigation actions",tagName:"ui-menu",exportName:"UIMenu",content:[{name:"Item",tagName:"menu-item",subcomponent:"true",description:"can include a menu item",usageLevel:1},{name:"Menu Content",attribute:"menu",description:"can define its menu contents programatically",usageLevel:1,exampleCode:`<ui-menu value="3" items='[{"label":"One","value":"1"},{"label":"Two","value":"2"},{"label":"Three","value":"3"}]'></ui-menu>`}],types:[{name:"Selection",attribute:"selection",description:"allow for selection between choices",usageLevel:1}],variations:[{name:"Evenly Spaced",attribute:"evenly-spaced",description:"have its items split space evenly",usageLevel:1},{name:"Fitted",attribute:"fitted",description:"can remove its margin",usageLevel:2},{name:"Vertical",attribute:"vertical",description:"can be displayed vertically",usageLevel:1},{name:"Inset",attribute:"inset",description:"can have its menu items inset",usageLevel:1}],events:[{eventName:"change",description:"can specify a function to occur after the value changes",arguments:[{name:"value",description:"the updated value"}]}],settings:[{name:"Menu Items",type:"array",attribute:"items",description:"can automatically generate menu items"},{name:"Value",type:"string",attribute:"value",description:"can specify the active menu item value when generating menu items"}],examples:{defaultContent:`
  <menu-item active>One</menu-item>
  <menu-item>Two</menu-item>
  <menu-item>Three</menu-item>
`}};var He={uiType:"element",name:"Menu Item",description:"A menu item displays an individual selection in a menu",parentTag:"ui-menu",tagName:"menu-item",exportName:"UIMenuItem",content:[{name:"Icon",includeAttributeClass:!0,attribute:"icon",couplesWith:["ui-icon"],slot:"icon",description:"include an icon",exampleCode:'<menu-item icon="home">Home</menu-item>'},{name:"Href",type:"string",attribute:"href",description:"can specify a link"},{name:"Value",type:"string",attribute:"value",description:"can specify a value"}],states:[{name:"Hover",attribute:"hover",description:"hovered"},{name:"Focus",attribute:"focused",description:"focused by the keyboard"},{name:"Active",attribute:"active",description:"activated"},{name:"Disabled",attribute:"disabled",description:"disable interactions"}]};var Wo=new I,Fe=Wo.getWebComponentSpec(Ue),Be=Wo.getWebComponentSpec(He);var qe={uiType:"element",name:"Label",description:"A label displays content classification",tagName:"ui-label",exportName:"UILabel",content:[],types:[],variations:[{name:"Size",attribute:"size",usageLevel:1,description:"vary in size",options:[{name:"Mini",value:"mini",description:"appear extremely small"},{name:"Tiny",value:"tiny",description:"appear very small"},{name:"Small",value:"small",description:"appear small"},{name:"Medium",value:"medium",description:"appear normal sized"},{name:"Large",value:"large",description:"appear larger than normal"},{name:"Big",value:"big",description:"appear much larger than normal"},{name:"Huge",value:"huge",description:"appear very much larger than normal"},{name:"Massive",value:"massive",description:"appear extremely larger than normal"}]}],events:[],settings:[]};var la=new I,je=la.getWebComponentSpec(qe);var We={uiType:"element",name:"Input",description:"A menu displays grouped navigation actions",tagName:"ui-input",exportName:"UIInput",content:[{name:"Placeholder",attribute:"placeholder",description:"include placeholder text",exampleCode:'<ui-input placeholder="Search..."></ui-input>'},{name:"Icon",includeAttributeClass:!0,attribute:"icon",couplesWith:["ui-icon"],description:"include an icon",exampleCode:'<ui-input icon="search"></ui-input>'},{name:"Label",includeAttributeClass:!0,attribute:"label",description:"include a label",exampleCode:'<ui-input label="ctrl+k"></ui-input>'}],types:[{name:"Search",attribute:"search",description:"can be formatted to appear as a search",exampleCode:"<ui-input search></ui-input>"}],variations:[{name:"Fluid",attribute:"fluid",usageLevel:1,description:"take the width of its container"},{name:"Size",attribute:"size",usageLevel:1,description:"vary in size",options:[{name:"Mini",value:"mini",description:"appear extremely small"},{name:"Tiny",value:"tiny",description:"appear very small"},{name:"Small",value:"small",description:"appear small"},{name:"Medium",value:"medium",description:"appear normal sized"},{name:"Large",value:"large",description:"appear larger than normal"},{name:"Big",value:"big",description:"appear much larger than normal"},{name:"Huge",value:"huge",description:"appear very much larger than normal"},{name:"Massive",value:"massive",description:"appear extremely larger than normal"}]}],events:[{eventName:"change",description:"occurs after the value changes",arguments:[{name:"value",description:"the updated value"}]}],settings:[{name:"Name",type:"string",attribute:"name",description:"can specify the form field name"},{name:"Debounced",type:"boolean",attribute:"debounced",defaultValue:!1,description:"can specify the input value should be debounced"},{name:"Debounce Interval",type:"number",attribute:"debounce-interval",defaultValue:150,description:"can specify the input debounce interval in milliseconds"},{name:"Clearable",type:"string",attribute:"clearable",description:"can show an icon to reset the inputted value"},{name:"Placeholder",type:"string",attribute:"placeholder",description:"can specify placeholder text"},{name:"Value",type:"string",attribute:"value",description:"can specify a value to store"}],examples:{defaultAttributes:{icon:"check-circle"}}};var da=new I,Ye=da.getWebComponentSpec(We);var Ge={uiType:"element",name:"Segment",description:"A menu displays grouped navigation actions",tagName:"ui-menu",exportName:"UISegment",content:[],types:[{name:"placeholder",attribute:"placeholder",description:"used as a placeholder for content in a layout.",usageLevel:1}],variations:[],events:[],settings:[]};var ba=new I,Ke=ba.getWebComponentSpec(Ge);var me={uiType:"element",name:"Card",description:"A card displays segmented content in a manner similar to a playing card.",tagName:"ui-card",exportName:"UICard",examples:{},content:[{name:"Icon",includeAttributeClass:!0,attribute:"icon",couplesWith:["ui-icon"],description:"include an icon",exampleCode:`<ui-card icon="pause"></ui-card>
<ui-card>
  <ui-icon pause slot="icon"></ui-icon>
</ui-card>`},{name:"Header",attribute:"header",description:"include an header",exampleCode:`<ui-card header="Header"></ui-card>
<ui-card>
  <div class="header">Header</div>
</ui-card>
<ui-card>
  <div slot="header">Header</div>
</ui-card>`},{name:"Description",attribute:"description",description:"include a description",exampleCode:`<ui-card description="Description"></ui-card>
<ui-card>
  <div class="description">Description</div>
</ui-card>
<ui-card>
  <div slot="description">Description</div>
</ui-card>`},{name:"Subheader",attribute:"subheader",description:"include an subheader",exampleCode:`<ui-card header="Header" subheader="Subheader"></ui-card>
<ui-card>
  <div class="header">Header</div>
  <div class="subheader">Subheader</div>
</ui-card>
<ui-card>
  <div slot="header">Header</div>
  <div slot="subheader">Subheader</div>
</ui-card>`},{name:"Image",attribute:"image",couplesWith:["ui-image"],description:"include an image",exampleCode:'<ui-card image="/images/avatar/jenny.jpg">Get started with your new card.</ui-card>'}],types:[],states:[{name:"Hover",attribute:"hover",description:"be hovered"},{name:"Focus",attribute:"focused",description:"be focused by the keyboard"},{name:"Disabled",attribute:"disabled",includeAttributeClass:!0,description:"have interactions disabled",options:[{name:"Disabled",value:"disabled",description:"disable interactions"},{name:"Clickable Disabled",value:"clickable-disabled",description:"allow interactions but appear disabled"}]}],variations:[{name:"Fluid",attribute:"fluid",usageLevel:1,description:"take the width of its container"},{name:"Link",attribute:"link",usageLevel:1,description:"can be formatted as if the card can be clicked"},{name:"Horizontal",attribute:"horizontal",usageLevel:1,description:"can have content horizontally oriented",exampleCode:'<ui-card horizontal image="/images/avatar/jenny.jpg">Get started with your new card.</ui-card>'}],settings:[{name:"Href",type:"string",attribute:"href",description:"link to a url"}],supportsPlural:!0,pluralName:"Cards",pluralTagName:"ui-cards",pluralExportName:"UICards",pluralDescription:"Cards can exist together as a group",pluralContent:[],pluralSharedTypes:["link"],pluralOnlyTypes:[],pluralOnlyVariations:[{name:"doubling",attribute:"doubling",description:"A group of cards can double its column width for mobile",usageLevel:3},{name:"stackable",attribute:"stackable",description:"A group of cards can automatically stack rows to a single columns on mobile devices",usageLevel:3},{name:"Spaced",attribute:"spaced",description:"A group of cards can adjust its spacing",usageLevel:2,options:[{name:"Spaced",value:"spaced",description:"A card group have increased spacing"},{name:"Three",value:"very-spaced",description:"A card group can have very increased spacing"}]},{name:"Count",attribute:"count",description:"A group of cards can set how many cards should exist in a row",usageLevel:3,options:[{name:"Two",value:"two",description:"A card group can have two items per row"},{name:"Three",value:"three",description:"A card group can have three items per row"},{name:"Four",value:"four",description:"A card group can have four items per row"},{name:"Five",value:"five",description:"A card group can have five items per row"},{name:"Six",value:"six",description:"A card group can have six items per row"}]}],pluralSharedVariations:[]};var Xe=new I(me).getWebComponentSpec(),Je=new I(me,{plural:!0}).getWebComponentSpec();var Ze={uiType:"element",name:"Modal",description:"A modal displays content that temporarily blocks interactions with the main view of a site",tagName:"ui-modal",exportName:"UIModal",content:[],types:[{name:"Glass",attribute:"glass",description:"can appear as glass",usageLevel:3}],variations:[{name:"Aligned",attribute:"aligned",description:"adjust its alignment",usageLevel:1,options:[{name:"Top Aligned",value:["top-aligned"],description:"appear aligned to top of browser",exampleCode:"<ui-modal top-aligned>Modal Content</ui-modal>"}]},{name:"Size",attribute:"size",usageLevel:1,description:"vary in size",options:[{name:"Tiny",value:"tiny",description:"appear very small"},{name:"Small",value:"small",description:"appear small"},{name:"Medium",value:"medium",description:"appear normal sized"},{name:"Large",value:"large",description:"appear larger than normal"},{name:"Big",value:"big",description:"appear much larger than normal"}]}],events:[{eventName:"show",description:"occurs after the modal starts to show"},{eventName:"visible",description:"occurs after the modal is visible"},{eventName:"hide",description:"occurs when the modal begins to hide"},{eventName:"hidden",description:"occurs after the modal is hidden"}],settings:[{name:"Closeable",type:"boolean",defaultValue:!0,attribute:"closeable",description:"can allow the modal to be dismissed by clicking on the backdrop."}]};var ha=new I,Qe=ha.getWebComponentSpec(Ze);var Yo=`/* src/components/container/css/shadow/content/container.css */
@layer component.container.content.container {
  :host {
    display: block;
    max-width: 100%;
  }
  @media only screen and (max-width: 767px) {
    :host {
      width: auto;
      margin-left: 1em;
      margin-right: 1em;
    }
  }
  @media only screen and (min-width: 768px) and (max-width: 991px) {
    :host {
      width: 723px;
      margin-left: auto;
      margin-right: auto;
    }
  }
  @media only screen and (min-width: 992px) and (max-width: 1199px) {
    :host {
      width: 933px;
      margin-left: auto;
      margin-right: auto;
    }
  }
  @media only screen and (min-width: 1200px) {
    :host {
      width: 1127px;
      margin-left: auto;
      margin-right: auto;
    }
  }
  :host.text {
    max-width: 700px;
    line-height: 1.5;
  }
  :host.fluid {
    width: 100%;
  }
}

/* src/components/container/css/shadow/variations/aligned.css */
@layer component.container.variations.aligned;

/* src/components/container/css/shadow/container.css */
`;var Go=`{{>slot}}
`;var wa=({$:n})=>({}),Ko=y({tagName:"ui-container",componentSpec:Pe,template:Go,css:Yo,createComponent:wa});var Xo=`/* src/components/rail/css/shadow/content/rail.css */
@layer component.rail.content.rail;

/* src/components/rail/css/shadow/variations/aligned.css */
@layer component.rail.variations.aligned;

/* src/components/rail/css/shadow/rail.css */
`;var Jo=`<div class="rail"></div>
`;var ya=({$:n})=>({}),Zo=y({tagName:"ui-rail",componentSpec:ze,template:Jo,css:Xo,createComponent:ya});var be=`/* src/components/button/css/shadow/content/button.css */
@layer component.button.content.button {
  :host {
    user-select: none;
    font-size: 1rem;
  }
  *,
  :after,
  :before {
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }
  .button {
    cursor: pointer;
    display: inline-block;
    min-height: 1em;
    border: var(--button-border);
    margin: 0em var(--button-horizontal-margin) var(--button-vertical-margin) 0em;
    vertical-align: var(--button-vertical-align);
    background: var(--button-background);
    color: var(--button-text-color);
    font-family: var(--button-font-family);
    padding: var(--button-vertical-padding) var(--button-horizontal-padding);
    text-transform: var(--button-text-transform);
    text-shadow: var(--button-text-shadow);
    font-weight: var(--button-font-weight);
    line-height: var(--button-line-height);
    font-style: normal;
    text-align: center;
    text-decoration: none;
    border-radius: var(--button-border-radius);
    box-shadow: var(--button-box-shadow);
    user-select: none;
    transition: var(--button-transition);
    will-change: var(--button-will-change);
    -webkit-tap-highlight-color: var(--button-tap-color);
    outline: var(--button-border);
  }
}

/* src/components/button/css/shadow/content/icon.css */
@layer component.button.content.icon {
  .button ui-icon {
    vertical-align: top;
    opacity: var(--button-icon-opacity);
  }
  .button ui-icon:only-child {
    margin: 0rem;
  }
}

/* src/components/button/css/shadow/content/label.css */
@layer component.button.content.label {
  .button .label {
  }
}

/* src/components/button/css/shadow/plural/buttons.css */
@layer component.button.plural {
  .buttons {
    display: inline-flex;
    flex-direction: row;
    vertical-align: baseline;
    margin: var(--button-vertical-margin) var(--button-horizontal-margin) 0em 0em;
  }
  .buttons:not(.basic):not(.inverted) {
    box-shadow: var(--button-group-box-shadow);
  }
}

/* src/components/button/css/shadow/states/hover.css */
@layer component.button.states.hover {
  @media (pointer: fine) {
    .button.hover,
    .button:hover {
      background-color: var(--button-hover-background-color);
      background-image: var(--button-hover-background-image);
      box-shadow: var(--button-hover-box-shadow);
      color: var(--button-hover-color);
    }
    .button.hover .icon,
    .button:hover .icon {
      opacity: var(--button-hover-icon-opacity);
    }
  }
}

/* src/components/button/css/shadow/states/focus.css */
@layer component.button.states.focus {
  .button.focused,
  .button:focus {
    background-color: var(--button-focus-background-color);
    background-image: var(--button-focus-background-image);
    color: var(--button-focus-color);
    box-shadow: var(--button-focus-box-shadow);
  }
  .button.focused .icon,
  .button:focus .icon {
    opacity: var(--button-focus-icon-opacity);
  }
  .button:focus-visible {
    box-shadow: var(--button-focus-box-shadow), var(--focused-ring-shadow) !important;
  }
}

/* src/components/button/css/shadow/states/pressed.css */
@layer component.button.states.pressed {
  @media (pointer: fine) {
    .button:active,
    .active.button:active {
      background-color: var(--button-pressed-background-color);
      background-image: var(--button-pressed-background-image);
      color: var(--button-pressed-color);
      box-shadow: var(--button-pressed-box-shadow);
    }
  }
  .pressed.button,
  .active.pressed.button {
    background-color: var(--button-pressed-background-color);
    background-image: var(--button-pressed-background-image);
    color: var(--button-pressed-color);
    box-shadow: var(--button-pressed-box-shadow);
  }
}

/* src/components/button/css/shadow/states/active.css */
@layer component.button.states.active {
  .active.button {
    background-color: var(--button-active-background-color);
    background-image: var(--button-active-background-image);
    box-shadow: var(--button-active-box-shadow);
    color: var(--button-active-color);
  }
  .active.button:hover {
    background-color: var(--button-active-hover-background-color);
    background-image: var(--button-active-hover-background-image);
    color: var(--button-active-hover-color);
    box-shadow: var(--button-active-hover-box-shadow);
  }
  .active.button:active {
    background-color: var(--button-active-down-background-color);
    background-image: var(--button-active-down-background-image);
    color: var(--button-active-down-color);
    box-shadow: var(--button-active-down-box-shadow);
  }
}

/* src/components/button/css/shadow/states/disabled.css */
@layer component.button.states.disabled {
  .disabled.button,
  .disabled.button:hover,
  .disabled.active.button {
    pointer-events: none;
    cursor: var(--button-disabled-cursor);
    opacity: var(--button-disabled-opacity) !important;
    color: var(--button-disabled-color);
    box-shadow: var(--button-disabled-box-shadow) !important;
  }
  .disabled.button.standard {
    background-color: var(--button-disabled-background-color) !important;
    background-image: var(--button-disabled-background-image) !important;
  }
  ui-button[disabled] {
    cursor: var(--button-disabled-cursor);
    pointer-events: none !important;
  }
  .clickable-disabled.button {
    pointer-events: auto !important;
    cursor: var(--button-clickable-disabled-cursor) !important;
  }
  .clickable-disabled.button:active {
    box-shadow: var(--button-pressed-box-shadow) !important;
  }
  ui-button[clickable-disabled] {
    pointer-events: auto !important;
    cursor: var(--button-clickable-disabled-cursor) !important;
  }
}

/* src/components/button/css/shadow/states/loading.css */
@layer component.button.states.loading {
  .loading.button:not(.icon) {
    position: relative;
    cursor: default;
    text-shadow: none !important;
    color: transparent !important;
    opacity: var(--button-loading-opacity);
    pointer-events: auto;
    transition: var(--button-loading-transition);
  }
  .loading.icon.button .icon {
    position: relative;
    color: transparent !important;
  }
  .loading.icon.button > .icon:before,
  .loading.button:not(.icon)::before {
    position: absolute;
    content: "";
    top: 50%;
    left: 50%;
    margin: var(--loader-margin);
    width: var(--loader-size);
    height: var(--loader-size);
    border-radius: var(--circular-radius);
    border: var(--loader-line-width) solid var(--loader-fill-color);
  }
  .loading.icon.button > .icon:after,
  .loading.button:not(.icon)::after {
    position: absolute;
    content: "";
    top: 50%;
    left: 50%;
    margin: var(--loader-margin);
    width: var(--loader-size);
    height: var(--loader-size);
    animation: button-spin var(--loader-speed) linear;
    animation-iteration-count: infinite;
    border-radius: var(--circular-radius);
    border-color: var(--loader-line-color) transparent transparent;
    border-style: solid;
    border-width: var(--loader-line-width);
    box-shadow: 0px 0px 0px 1px transparent;
  }
  @keyframes button-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .loading.button.inverted .icon:before,
  .loading.button.inverted:before {
    border-color: var(--inverted-loader-fill-color);
  }
  .loading.button.inverted .icon:after,
  .loading.button.inverted:after {
    border-top-color: var(--inverted-loader-line-color);
  }
}

/* src/components/button/css/shadow/types/animated.css */
@layer component.button.types.animated {
  .animated.button {
    position: relative;
    overflow: hidden;
    padding-right: 0em !important;
    vertical-align: var(--button-animated-vertical-align);
    z-index: var(--button-animated-z-index);
  }
  .animated.button > .content {
    display: inline-block;
    box-sizing: border-box;
    will-change: transform, opacity;
  }
  .animated.button > .visible.content {
    position: relative;
    margin-right: var(--button-horizontal-padding);
  }
  .animated.button > .hidden.content {
    position: absolute;
    width: 100%;
  }
  .animated.animated.button > .visible.content,
  .animated.button > .hidden.content {
    transition: right var(--button-animation-duration) var(--button-animation-easing) 0s;
  }
  .animated.button > .visible.content {
    left: auto;
    right: 0%;
  }
  .animated.button > .hidden.content {
    top: 50%;
    left: auto;
    right: -100%;
    margin-top: calc(var(--button-line-height) / 2 * -1);
  }
  .animated.button:focus > .visible.content,
  .animated.button:hover > .visible.content {
    left: auto;
    right: 200%;
  }
  .animated.button:focus > .hidden.content,
  .animated.button:hover > .hidden.content {
    left: auto;
    right: 0%;
  }
  .vertical-animated.button > .visible.content,
  .vertical-animated.button > .hidden.content {
    transition: top var(--button-animation-duration) var(--button-animation-easing), transform var(--button-animation-duration) var(--button-animation-easing);
  }
  .vertical-animated.button > .visible.content {
    transform: translateY(0%);
    right: auto;
  }
  .vertical-animated.button > .hidden.content {
    top: -50%;
    left: 0%;
  }
  .vertical-animated.button:focus > .visible.content,
  .vertical-animated.button:hover > .visible.content {
    transform: translateY(200%);
    right: auto;
  }
  .vertical-animated.button:focus > .hidden.content,
  .vertical-animated.button:hover > .hidden.content {
    top: 50%;
  }
  .fade-animated.button > .visible.content,
  .fade-animated.button > .hidden.content {
    transition: opacity var(--button-animation-duration) var(--button-animation-easing), transform var(--button-animation-duration) var(--button-animation-easing);
  }
  .fade-animated.button > .visible.content {
    left: auto;
    right: auto;
    opacity: 1;
    transform: scale(1);
  }
  .fade-animated.button > .hidden.content {
    opacity: 0;
    left: 0%;
    right: auto;
    transform: scale(var(--button-fade-scale-high));
  }
  .fade-animated.button:focus > .visible.content,
  .fade-animated.button:hover > .visible.content {
    left: auto;
    right: auto;
    opacity: 0;
    transform: scale(var(--button-fade-scale-low));
  }
  .fade-animated.button:focus > .hidden.content,
  .fade-animated.button:hover > .hidden.content {
    left: 0%;
    right: auto;
    opacity: 1;
    transform: scale(1);
  }
}

/* src/components/button/css/shadow/types/emphasis.css */
@layer component.button.types.emphasis {
  .primary.buttons .button,
  .primary.button {
    background-color: var(--button-primary-color);
    color: var(--button-primary-text-color);
    text-shadow: var(--button-primary-text-shadow);
    background-image: var(--button-primary-background-image);
  }
  .primary.button {
    box-shadow: var(--button-primary-box-shadow);
  }
  .primary.buttons .button:hover,
  .primary.button:hover {
    background-color: var(--button-primary-color-hover);
    color: var(--button-primary-text-color);
    text-shadow: var(--button-primary-text-shadow);
    box-shadow: var(--button-hover-box-shadow);
  }
  .primary.buttons .button:focus,
  .primary.button:focus {
    background-color: var(--button-primary-color-focus);
    color: var(--button-primary-text-color);
    text-shadow: var(--button-primary-text-shadow);
    box-shadow: var(--button-focus-box-shadow);
  }
  .primary.buttons .button.pressed,
  .primary.buttons .button:active,
  .primary.button.pressed,
  .primary.button:active {
    background-color: var(--button-primary-color-down);
    color: var(--button-primary-text-color);
    text-shadow: var(--button-primary-text-shadow);
    box-shadow: var(--button-pressed-box-shadow);
  }
  .primary.buttons .active.button,
  .primary.buttons .active.button:active,
  .primary.active.button,
  .primary.button .active.button:active {
    background-color: var(--button-primary-color-active);
    color: var(--button-primary-text-color);
    text-shadow: var(--button-primary-text-shadow);
    box-shadow: var(--button-active-box-shadow);
  }
  .secondary.buttons .button,
  .secondary.button {
    background-color: var(--button-secondary-color);
    color: var(--button-secondary-text-color);
    text-shadow: var(--button-secondary-text-shadow);
    background-image: var(--button-colored-background-image);
  }
  .secondary.button {
    box-shadow: var(--button-colored-box-shadow);
  }
  .secondary.buttons .button:hover,
  .secondary.button:hover {
    background-color: var(--button-secondary-color-hover);
    color: var(--button-secondary-text-color);
    text-shadow: var(--button-secondary-text-shadow);
    box-shadow: var(--button-hover-box-shadow);
  }
  .secondary.buttons .button:focus,
  .secondary.button:focus {
    background-color: var(--button-secondary-color-focus);
    color: var(--button-secondary-text-color);
    text-shadow: var(--button-secondary-text-shadow);
    box-shadow: var(--button-focus-box-shadow);
  }
  .secondary.buttons .button:active,
  .secondary.buttons .button.pressed,
  .secondary.button.pressed,
  .secondary.button:active {
    background-color: var(--button-secondary-color-down);
    color: var(--button-secondary-text-color);
    text-shadow: var(--button-secondary-text-shadow);
    box-shadow: var(--button-pressed-box-shadow);
  }
  .secondary.buttons .active.button,
  .secondary.buttons .active.button:active,
  .secondary.active.button,
  .secondary.button .active.button:active {
    background-color: var(--button-secondary-color-active);
    color: var(--button-secondary-text-color);
    text-shadow: var(--button-secondary-text-shadow);
    box-shadow: var(--button-active-box-shadow);
  }
}

/* src/components/button/css/shadow/types/icon.css */
@layer component.button.types.icon {
  .icon-only.buttons .button,
  .icon-only.button {
    padding: var(--button-vertical-padding);
  }
  .icon-only.buttons .button > ui-icon,
  .icon-only.button > ui-icon {
    opacity: 1;
    margin: 0em;
    vertical-align: top;
  }
  .icon-after.buttons .button > ui-icon,
  .icon-after.button > ui-icon {
    margin-right: 0rem;
    margin-left: var(--icon-distance-from-text);
  }
}

/* src/components/button/css/shadow/types/labeled.css */
@layer component.button.types.labeled {
  .labeled.button:not(.icon) {
    display: inline-flex;
    flex-direction: row;
    background: none !important;
    padding: 0px !important;
    border: none !important;
    box-shadow: none !important;
  }
  .labeled.button > .button {
    margin: 0px;
  }
  .labeled.button > .label {
    display: flex;
    align-items: var(--labeled-label-align);
    margin: 0px 0px 0px var(--labeled-label-border-offset) !important;
    padding: var(--labeled-label-padding);
    font-size: var(--labeled-label-font-size);
    border-color: var(--labeled-label-border-color);
  }
  .labeled.button > .tag.label::before {
    width: var(--labeled-tag-label-size);
    height: var(--labeled-tag-label-size);
  }
  .labeled.button:not([class*="left labeled"]) > .button {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  .labeled.button:not([class*="left labeled"]) > .label {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
  [class*="left labeled"].button > .button {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
  [class*="left labeled"].button > .label {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }
}

/* src/components/button/css/shadow/types/labeled-icon.css */
@layer component.button.types.labeled-icon {
  .labeled.icon.buttons .button,
  .labeled.icon.button {
    position: relative;
    padding-left: var(--labeled-icon-padding) !important;
    padding-right: var(--horizontal-padding) !important;
  }
  .labeled.icon.buttons > .button > .icon,
  .labeled.icon.button > .icon {
    position: absolute;
    height: 100%;
    line-height: 1;
    border-radius: 0px;
    border-top-left-radius: inherit;
    border-bottom-left-radius: inherit;
    text-align: center;
    margin: var(--labeled-icon-margin);
    width: var(--labeled-icon-width);
    background-color: var(--labeled-icon-background-color);
    color: var(--labeled-icon-color);
    box-shadow: var(--labeled-icon-left-shadow);
  }
  .labeled.icon.buttons > .button > .icon,
  .labeled.icon.button > .icon {
    top: 0em;
    left: 0em;
  }
  [class*="right labeled"].icon.button {
    padding-right: var(--labeled-icon-padding) !important;
    padding-left: var(--horizontal-padding) !important;
  }
  [class*="right labeled"].icon.button > .icon {
    left: auto;
    right: 0em;
    border-radius: 0px;
    border-top-right-radius: inherit;
    border-bottom-right-radius: inherit;
    box-shadow: var(--labeled-icon-right-shadow);
  }
  .labeled.icon.buttons > .button > .icon::before,
  .labeled.icon.button > .icon::before,
  .labeled.icon.buttons > .button > .icon::after,
  .labeled.icon.button > .icon::after {
    display: block;
    position: absolute;
    width: 100%;
    top: 50%;
    text-align: center;
    transform: translateY(-50%);
  }
  .labeled.icon.button > .icon.loading {
    animation: none;
  }
  .labeled.icon.button > .icon.loading::before {
    animation: labeled-button-icon-loading var(--loading-icon-duration) linear infinite;
  }
  @keyframes labeled-button-icon-loading {
    from {
      transform: translateY(-50%) rotate(0deg);
    }
    to {
      transform: translateY(-50%) rotate(360deg);
    }
  }
  .labeled.icon.buttons .button > .icon {
    border-radius: 0em;
  }
  .labeled.icon.buttons .button:first-child > .icon {
    border-top-left-radius: var(--border-radius);
    border-bottom-left-radius: var(--border-radius);
  }
  .labeled.icon.buttons .button:last-child > .icon {
    border-top-right-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
  }
  .vertical.labeled.icon.buttons .button:first-child > .icon {
    border-radius: 0em;
    border-top-left-radius: var(--border-radius);
  }
  .vertical.labeled.icon.buttons .button:last-child > .icon {
    border-radius: 0em;
    border-bottom-left-radius: var(--border-radius);
  }
  .fluid[class*="left labeled"].icon.button,
  .fluid[class*="right labeled"].icon.button {
    padding-left: var(--horizontal-padding) !important;
    padding-right: var(--horizontal-padding) !important;
  }
}

/* src/components/button/css/shadow/types/transparent.css */
@layer component.button.types.transparent {
  .transparent.button {
    background-image: var(--button-transparent-background-image);
    background-color: var(--button-transparent-background-color);
    color: var(--button-transparent-text-color);
    box-shadow: var(--button-transparent-box-shadow) !important;
  }
  .transparent.button:hover {
    background-image: var(--button-transparent-hover-background-image);
    background-color: var(--button-transparent-hover-background-color);
    color: var(--button-transparent-hover-text-color);
    box-shadow: var(--button-transparent-hover-box-shadow) !important;
  }
  .transparent.button:active {
    background-image: var(--button-transparent-pressed-background-image);
    background-color: var(--button-transparent-pressed-background-color);
    color: var(--button-transparent-pressed-text-color);
    box-shadow: var(--button-transparent-pressed-box-shadow) !important;
  }
  .transparent.button.active {
    background-image: var(--button-transparent-active-background-image);
    background-color: var(--button-transparent-active-background-color);
    color: var(--button-transparent-active-text-color) !important;
    box-shadow: var(--button-transparent-active-box-shadow) !important;
  }
  .transparent.inverted.button {
    background-image: var(--button-transparent-inverted-background-image);
    background-color: var(--button-transparent-inverted-background-color);
    color: var(--button-transparent-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
    box-shadow: var(--button-transparent-inverted-box-shadow) !important;
  }
  .transparent.inverted.button:hover {
    background-image: var(--button-transparent-inverted-hover-background-image);
    background-color: var(--button-transparent-inverted-hover-background-color);
    color: var(--button-transparent-inverted-hover-text-color);
    box-shadow: var(--button-transparent-inverted-hover-box-shadow) !important;
  }
  .transparent.inverted.button:active {
    background-image: var(--button-transparent-inverted-pressed-background-image);
    background-color: var(--button-transparent-inverted-pressed-background-color);
    color: var(--button-transparent-inverted-pressed-text-color);
    box-shadow: var(--button-transparent-inverted-pressed-box-shadow) !important;
  }
  .transparent.inverted.button.active {
    background-image: var(--button-transparent-inverted-active-background-image);
    background-color: var(--button-transparent-inverted-active-background-color);
    color: var(--button-transparent-inverted-active-text-color) !important;
    box-shadow: var(--button-transparent-inverted-active-box-shadow) !important;
  }
}

/* src/components/button/css/shadow/types/toggle.css */
@layer component.button.types.toggle {
  .toggle.buttons .active.button,
  .buttons .button.toggle.active,
  .button.toggle.active {
    background-color: var(--button-toggle-active-background) !important;
    color: var(--button-toggle-active-color) !important;
    text-shadow: var(--button-toggle-active-text-shadow);
  }
  .button.toggle.active:hover {
    background-color: var(--button-toggle-active-hover-background) !important;
    color: var(--button-toggle-active-hover-color) !important;
  }
}

/* src/components/button/css/shadow/variations/basic.css */
@layer component.button.variations.basic {
  .basic.buttons .button,
  .basic.button {
    background: var(--button-basic-background) !important;
    color: var(--button-basic-text-color) !important;
    font-weight: var(--button-basic-font-weight);
    border-radius: var(--button-basic-border-radius);
    text-transform: var(--button-basic-text-transform);
    text-shadow: none !important;
    box-shadow: var(--button-basic-box-shadow);
  }
  .basic.buttons {
    box-shadow: var(--button-basic-group-box-shadow);
    border: var(--button-basic-group-border);
    border-radius: var(--button-border-radius);
  }
  .basic.buttons .button {
    border-radius: 0em;
  }
  .basic.buttons .button:hover,
  .basic.button:hover {
    background: var(--button-basic-hover-background) !important;
    color: var(--button-basic-hover-text-color) !important;
    box-shadow: var(--button-basic-hover-box-shadow);
  }
  .basic.buttons .button:focus,
  .basic.button:focus {
    background: var(--button-basic-focus-background) !important;
    color: var(--button-basic-focus-text-color) !important;
    box-shadow: var(--button-basic-focus-box-shadow);
  }
  .basic.buttons .button:active,
  .basic.button:active {
    background: var(--button-basic-down-background) !important;
    color: var(--button-basic-down-text-color) !important;
    box-shadow: var(--button-basic-down-box-shadow);
  }
  .basic.buttons .active.button,
  .basic.active.button {
    background: var(--button-basic-active-background) !important;
    box-shadow: var(--button-basic-active-box-shadow) !important;
    color: var(--button-basic-active-text-color) !important;
  }
  .basic.buttons .active.button:hover,
  .basic.active.button:hover {
    background-color: var(--button-transparent-black);
  }
  .basic.buttons .button:hover {
    box-shadow: var(--button-basic-hover-box-shadow) inset;
  }
  .basic.buttons .button:active {
    box-shadow: var(--button-basic-down-box-shadow) inset;
  }
  .basic.buttons .active.button {
    box-shadow: var(--button-basic-active-box-shadow) !important;
  }
  .basic.inverted.buttons .button,
  .basic.inverted.button {
    background-color: transparent !important;
    color: var(--button-off-white) !important;
    box-shadow: var(--button-basic-inverted-box-shadow) !important;
  }
  .basic.inverted.buttons .button:hover,
  .basic.inverted.button:hover {
    color: var(--button-white) !important;
    box-shadow: var(--button-basic-inverted-hover-box-shadow) !important;
  }
  .basic.inverted.buttons .button:focus,
  .basic.inverted.button:focus {
    color: var(--button-white) !important;
    box-shadow: var(--button-basic-inverted-focus-box-shadow) !important;
  }
  .basic.inverted.buttons .button:active,
  .basic.inverted.button:active {
    background-color: var(--button-transparent-white) !important;
    color: var(--button-white) !important;
    box-shadow: var(--button-basic-inverted-down-box-shadow) !important;
  }
  .basic.inverted.buttons .active.button,
  .basic.inverted.active.button {
    background-color: var(--button-transparent-white);
    color: var(--button-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
    box-shadow: var(--button-basic-inverted-active-box-shadow);
  }
  .basic.inverted.buttons .active.button:hover,
  .basic.inverted.active.button:hover {
    background-color: var(--button-strong-transparent-white);
    box-shadow: var(--button-basic-inverted-hover-box-shadow) !important;
  }
  .basic.buttons .button {
    border-left: var(--button-basic-group-border);
    box-shadow: none;
  }
  .basic.vertical.buttons .button {
    border-left: none;
  }
  .basic.vertical.buttons .button {
    border-left-width: 0px;
    border-top: var(--button-basic-group-border);
  }
  .basic.vertical.buttons .button:first-child {
    border-top-width: 0px;
  }
}

/* src/components/button/css/shadow/variations/attached.css */
@layer component.button.variations.attached {
  .attached.button {
    position: relative;
    display: block;
    margin: 0em;
    border-radius: 0em;
    box-shadow: var(--button-attached-box-shadow);
  }
  .attached.button:active {
    box-shadow: var(--button-attached-pressed-box-shadow);
  }
  .top-attached.button {
    border-radius: var(--button-border-radius) var(--button-border-radius) 0em 0em;
  }
  .bottom-attached.button {
    border-radius: 0em 0em var(--button-border-radius) var(--button-border-radius);
  }
  .left-attached.button {
    display: inline-block;
    border-left: none;
    text-align: right;
    padding-right: var(--button-attached-horizontal-padding);
    border-radius: var(--button-border-radius) 0em 0em var(--button-border-radius);
  }
  .right-attached.button {
    display: inline-block;
    text-align: left;
    padding-left: var(--button-attached-horizontal-padding);
    border-radius: 0em var(--button-border-radius) var(--button-border-radius) 0em;
  }
  .attached.buttons {
    position: relative;
    display: flex;
    border-radius: 0em;
    width: auto;
    z-index: var(--button-attached-z-index);
    margin-left: var(--button-attached-offset);
    margin-right: var(--button-attached-offset);
  }
  .attached.buttons .button {
    margin: 0em;
  }
  .attached.buttons .button:first-child {
    border-radius: 0em;
  }
  .attached.buttons .button:last-child {
    border-radius: 0em;
  }
  .top-attached.buttons {
    margin-bottom: var(--button-attached-offset);
    border-radius: var(--button-border-radius) var(--button-border-radius) 0em 0em;
  }
  .top-attached.buttons .button:first-child {
    border-radius: var(--button-border-radius) 0em 0em 0em;
  }
  .top-attached.buttons .button:last-child {
    border-radius: 0em var(--button-border-radius) 0em 0em;
  }
  .top-attached.buttons {
    margin-top: var(--button-attached-offset);
    border-radius: 0em 0em var(--button-border-radius) var(--button-border-radius);
  }
  .top-attached.buttons .button:first-child {
    border-radius: 0em 0em 0em var(--button-border-radius);
  }
  .top-attached.buttons .button:last-child {
    border-radius: 0em 0em var(--button-border-radius) 0em;
  }
  .left-attached.buttons {
    display: inline-flex;
    margin-right: 0em;
    margin-left: var(--button-attached-offset);
    border-radius: 0em var(--button-border-radius) var(--button-border-radius) 0em;
  }
  .left-attached.buttons .button:first-child {
    margin-left: var(--button-attached-offset);
    border-radius: 0em var(--button-border-radius) 0em 0em;
  }
  .left-attached.buttons .button:last-child {
    margin-left: var(--button-attached-offset);
    border-radius: 0em 0em var(--button-border-radius) 0em;
  }
  .right-attached.buttons {
    display: inline-flex;
    margin-left: 0em;
    margin-right: var(--button-attached-offset);
    border-radius: var(--button-border-radius) 0em 0em var(--button-border-radius);
  }
  .right-attached.buttons .button:first-child {
    margin-left: var(--button-attached-offset);
    border-radius: var(--button-border-radius) 0em 0em 0em;
  }
  .right-attached.buttons .button:last-child {
    margin-left: var(--button-attached-offset);
    border-radius: 0em 0em 0em var(--button-border-radius);
  }
}

/* src/components/button/css/shadow/variations/circular.css */
@layer component.button.variations.circular {
  .circular.button {
    border-radius: var(--circular-radius);
  }
  .circular.button > .icon {
    width: 1em;
    vertical-align: baseline;
  }
}

/* src/components/button/css/shadow/variations/colored.css */
@layer component.button.variations.colored {
  .red.buttons,
  .red.button {
    --button-text-color: var(--button-red-text-color);
    --button-text-shadow: var(--button-red-text-shadow);
    --button-background: var(--button-red) var(--button-colored-background-image);
    --button-box-shadow: var(--button-colored-box-shadow);
  }
  .red.buttons,
  .red.button:hover {
    --button-hover-color: var(--button-red-text-color);
    --button-hover-text-shadow: var(--button-red-text-shadow);
    --button-hover-background-color: var(--button-red-hover);
    --button-hover-box-shadow: var(--button-colored-box-shadow);
  }
  .red.buttons,
  .red.button:focus {
    --button-focus-background-color: var(--button-red-focus);
    --button-focus-color: var(--button-red-text-color);
    --button-focus-text-shadow: var(--button-red-text-shadow);
  }
  .red.buttons,
  .red.button.pressed,
  .red.button:active {
    --button-pressed-background-color: var(--button-red-pressed);
    --button-pressed-color: var(--button-red-text-color);
    --button-pressed-text-shadow: var(--button-red-text-shadow);
  }
  .red.buttons .active.button,
  .red.buttons .active.button.pressed,
  .red.buttons .active.button:active,
  .red.active.button,
  .red.button .active.button.pressed,
  .red.button .active.button:active {
    background-color: var(--button-red-active);
    color: var(--button-red-text-color);
    text-shadow: var(--button-red-text-shadow);
  }
  .orange.buttons,
  .orange.button {
    --button-text-color: var(--button-orange-text-color);
    --button-text-shadow: var(--button-orange-text-shadow);
    --button-background: var(--button-orange) var(--button-colored-background-image);
    --button-box-shadow: var(--button-colored-box-shadow);
  }
  .orange.buttons,
  .orange.button:hover {
    --button-hover-color: var(--button-orange-text-color);
    --button-hover-text-shadow: var(--button-orange-text-shadow);
    --button-hover-background-color: var(--button-orange-hover);
    --button-hover-box-shadow: var(--button-colored-box-shadow);
  }
  .orange.buttons,
  .orange.button:focus {
    --button-focus-background-color: var(--button-orange-focus);
    --button-focus-color: var(--button-orange-text-color);
    --button-focus-text-shadow: var(--button-orange-text-shadow);
  }
  .orange.buttons,
  .orange.button.pressed,
  .orange.button:active {
    --button-pressed-background-color: var(--button-orange-pressed);
    --button-pressed-color: var(--button-orange-text-color);
    --button-pressed-text-shadow: var(--button-orange-text-shadow);
  }
  .orange.buttons .active.button,
  .orange.buttons .active.button.pressed,
  .orange.buttons .active.button:active,
  .orange.active.button,
  .orange.button .active.button.pressed,
  .orange.button .active.button:active {
    background-color: var(--button-orange-active);
    color: var(--button-orange-text-color);
    text-shadow: var(--button-orange-text-shadow);
  }
  .yellow.buttons,
  .yellow.button {
    --button-text-color: var(--button-yellow-text-color);
    --button-text-shadow: var(--button-yellow-text-shadow);
    --button-background: var(--button-yellow) var(--button-colored-background-image);
    --button-box-shadow: var(--button-colored-box-shadow);
  }
  .yellow.buttons,
  .yellow.button:hover {
    --button-hover-color: var(--button-yellow-text-color);
    --button-hover-text-shadow: var(--button-yellow-text-shadow);
    --button-hover-background-color: var(--button-yellow-hover);
    --button-hover-box-shadow: var(--button-colored-box-shadow);
  }
  .yellow.buttons,
  .yellow.button:focus {
    --button-focus-background-color: var(--button-yellow-focus);
    --button-focus-color: var(--button-yellow-text-color);
    --button-focus-text-shadow: var(--button-yellow-text-shadow);
  }
  .yellow.buttons,
  .yellow.button.pressed,
  .yellow.button:active {
    --button-pressed-background-color: var(--button-yellow-pressed);
    --button-pressed-color: var(--button-yellow-text-color);
    --button-pressed-text-shadow: var(--button-yellow-text-shadow);
  }
  .yellow.buttons .active.button,
  .yellow.buttons .active.button.pressed,
  .yellow.buttons .active.button:active,
  .yellow.active.button,
  .yellow.button .active.button.pressed,
  .yellow.button .active.button:active {
    background-color: var(--button-yellow-active);
    color: var(--button-yellow-text-color);
    text-shadow: var(--button-yellow-text-shadow);
  }
  .olive.buttons,
  .olive.button {
    --button-text-color: var(--button-olive-text-color);
    --button-text-shadow: var(--button-olive-text-shadow);
    --button-background: var(--button-olive) var(--button-colored-background-image);
    --button-box-shadow: var(--button-colored-box-shadow);
  }
  .olive.buttons,
  .olive.button:hover {
    --button-hover-color: var(--button-olive-text-color);
    --button-hover-text-shadow: var(--button-olive-text-shadow);
    --button-hover-background-color: var(--button-olive-hover);
    --button-hover-box-shadow: var(--button-colored-box-shadow);
  }
  .olive.buttons,
  .olive.button:focus {
    --button-focus-background-color: var(--button-olive-focus);
    --button-focus-color: var(--button-olive-text-color);
    --button-focus-text-shadow: var(--button-olive-text-shadow);
  }
  .olive.buttons,
  .olive.button.pressed,
  .olive.button:active {
    --button-pressed-background-color: var(--button-olive-pressed);
    --button-pressed-color: var(--button-olive-text-color);
    --button-pressed-text-shadow: var(--button-olive-text-shadow);
  }
  .olive.buttons .active.button,
  .olive.buttons .active.button.pressed,
  .olive.buttons .active.button:active,
  .olive.active.button,
  .olive.button .active.button.pressed,
  .olive.button .active.button:active {
    background-color: var(--button-olive-active);
    color: var(--button-olive-text-color);
    text-shadow: var(--button-olive-text-shadow);
  }
  .green.buttons,
  .green.button {
    --button-text-color: var(--button-green-text-color);
    --button-text-shadow: var(--button-green-text-shadow);
    --button-background: var(--button-green) var(--button-colored-background-image);
    --button-box-shadow: var(--button-colored-box-shadow);
  }
  .green.buttons,
  .green.button:hover {
    --button-hover-color: var(--button-green-text-color);
    --button-hover-text-shadow: var(--button-green-text-shadow);
    --button-hover-background-color: var(--button-green-hover);
    --button-hover-box-shadow: var(--button-colored-box-shadow);
  }
  .green.buttons,
  .green.button:focus {
    --button-focus-background-color: var(--button-green-focus);
    --button-focus-color: var(--button-green-text-color);
    --button-focus-text-shadow: var(--button-green-text-shadow);
  }
  .green.buttons,
  .green.button.pressed,
  .green.button:active {
    --button-pressed-background-color: var(--button-green-pressed);
    --button-pressed-color: var(--button-green-text-color);
    --button-pressed-text-shadow: var(--button-green-text-shadow);
  }
  .green.buttons .active.button,
  .green.buttons .active.button.pressed,
  .green.buttons .active.button:active,
  .green.active.button,
  .green.button .active.button.pressed,
  .green.button .active.button:active {
    background-color: var(--button-green-active);
    color: var(--button-green-text-color);
    text-shadow: var(--button-green-text-shadow);
  }
  .teal.buttons,
  .teal.button {
    --button-text-color: var(--button-teal-text-color);
    --button-text-shadow: var(--button-teal-text-shadow);
    --button-background: var(--button-teal) var(--button-colored-background-image);
    --button-box-shadow: var(--button-colored-box-shadow);
  }
  .teal.buttons,
  .teal.button:hover {
    --button-hover-color: var(--button-teal-text-color);
    --button-hover-text-shadow: var(--button-teal-text-shadow);
    --button-hover-background-color: var(--button-teal-hover);
    --button-hover-box-shadow: var(--button-colored-box-shadow);
  }
  .teal.buttons,
  .teal.button:focus {
    --button-focus-background-color: var(--button-teal-focus);
    --button-focus-color: var(--button-teal-text-color);
    --button-focus-text-shadow: var(--button-teal-text-shadow);
  }
  .teal.buttons,
  .teal.button.pressed,
  .teal.button:active {
    --button-pressed-background-color: var(--button-teal-pressed);
    --button-pressed-color: var(--button-teal-text-color);
    --button-pressed-text-shadow: var(--button-teal-text-shadow);
  }
  .teal.buttons .active.button,
  .teal.buttons .active.button.pressed,
  .teal.buttons .active.button:active,
  .teal.active.button,
  .teal.button .active.button.pressed,
  .teal.button .active.button:active {
    background-color: var(--button-teal-active);
    color: var(--button-teal-text-color);
    text-shadow: var(--button-teal-text-shadow);
  }
  .blue.buttons,
  .blue.button {
    --button-text-color: var(--button-blue-text-color);
    --button-text-shadow: var(--button-blue-text-shadow);
    --button-background: var(--button-blue) var(--button-colored-background-image);
    --button-box-shadow: var(--button-colored-box-shadow);
  }
  .blue.buttons,
  .blue.button:hover {
    --button-hover-color: var(--button-blue-text-color);
    --button-hover-text-shadow: var(--button-blue-text-shadow);
    --button-hover-background-color: var(--button-blue-hover);
    --button-hover-box-shadow: var(--button-colored-box-shadow);
  }
  .blue.buttons,
  .blue.button:focus {
    --button-focus-background-color: var(--button-blue-focus);
    --button-focus-color: var(--button-blue-text-color);
    --button-focus-text-shadow: var(--button-blue-text-shadow);
  }
  .blue.buttons,
  .blue.button.pressed,
  .blue.button:active {
    --button-pressed-background-color: var(--button-blue-pressed);
    --button-pressed-color: var(--button-blue-text-color);
    --button-pressed-text-shadow: var(--button-blue-text-shadow);
  }
  .blue.buttons .active.button,
  .blue.buttons .active.button.pressed,
  .blue.buttons .active.button:active,
  .blue.active.button,
  .blue.button .active.button.pressed,
  .blue.button .active.button:active {
    background-color: var(--button-blue-active);
    color: var(--button-blue-text-color);
    text-shadow: var(--button-blue-text-shadow);
  }
  .violet.buttons,
  .violet.button {
    --button-text-color: var(--button-violet-text-color);
    --button-text-shadow: var(--button-violet-text-shadow);
    --button-background: var(--button-violet) var(--button-colored-background-image);
    --button-box-shadow: var(--button-colored-box-shadow);
  }
  .violet.buttons,
  .violet.button:hover {
    --button-hover-color: var(--button-violet-text-color);
    --button-hover-text-shadow: var(--button-violet-text-shadow);
    --button-hover-background-color: var(--button-violet-hover);
    --button-hover-box-shadow: var(--button-colored-box-shadow);
  }
  .violet.buttons,
  .violet.button:focus {
    --button-focus-background-color: var(--button-violet-focus);
    --button-focus-color: var(--button-violet-text-color);
    --button-focus-text-shadow: var(--button-violet-text-shadow);
  }
  .violet.buttons,
  .violet.button.pressed,
  .violet.button:active {
    --button-pressed-background-color: var(--button-violet-pressed);
    --button-pressed-color: var(--button-violet-text-color);
    --button-pressed-text-shadow: var(--button-violet-text-shadow);
  }
  .violet.buttons .active.button,
  .violet.buttons .active.button.pressed,
  .violet.buttons .active.button:active,
  .violet.active.button,
  .violet.button .active.button.pressed,
  .violet.button .active.button:active {
    background-color: var(--button-violet-active);
    color: var(--button-violet-text-color);
    text-shadow: var(--button-violet-text-shadow);
  }
  .purple.buttons,
  .purple.button {
    --button-text-color: var(--button-purple-text-color);
    --button-text-shadow: var(--button-purple-text-shadow);
    --button-background: var(--button-purple) var(--button-colored-background-image);
    --button-box-shadow: var(--button-colored-box-shadow);
  }
  .purple.buttons,
  .purple.button:hover {
    --button-hover-color: var(--button-purple-text-color);
    --button-hover-text-shadow: var(--button-purple-text-shadow);
    --button-hover-background-color: var(--button-purple-hover);
    --button-hover-box-shadow: var(--button-colored-box-shadow);
  }
  .purple.buttons,
  .purple.button:focus {
    --button-focus-background-color: var(--button-purple-focus);
    --button-focus-color: var(--button-purple-text-color);
    --button-focus-text-shadow: var(--button-purple-text-shadow);
  }
  .purple.buttons,
  .purple.button.pressed,
  .purple.button:active {
    --button-pressed-background-color: var(--button-purple-pressed);
    --button-pressed-color: var(--button-purple-text-color);
    --button-pressed-text-shadow: var(--button-purple-text-shadow);
  }
  .purple.buttons .active.button,
  .purple.buttons .active.button.pressed,
  .purple.buttons .active.button:active,
  .purple.active.button,
  .purple.button .active.button.pressed,
  .purple.button .active.button:active {
    background-color: var(--button-purple-active);
    color: var(--button-purple-text-color);
    text-shadow: var(--button-purple-text-shadow);
  }
  .pink.buttons,
  .pink.button {
    --button-text-color: var(--button-pink-text-color);
    --button-text-shadow: var(--button-pink-text-shadow);
    --button-background: var(--button-pink) var(--button-colored-background-image);
    --button-box-shadow: var(--button-colored-box-shadow);
  }
  .pink.buttons,
  .pink.button:hover {
    --button-hover-color: var(--button-pink-text-color);
    --button-hover-text-shadow: var(--button-pink-text-shadow);
    --button-hover-background-color: var(--button-pink-hover);
    --button-hover-box-shadow: var(--button-colored-box-shadow);
  }
  .pink.buttons,
  .pink.button:focus {
    --button-focus-background-color: var(--button-pink-focus);
    --button-focus-color: var(--button-pink-text-color);
    --button-focus-text-shadow: var(--button-pink-text-shadow);
  }
  .pink.buttons,
  .pink.button.pressed,
  .pink.button:active {
    --button-pressed-background-color: var(--button-pink-pressed);
    --button-pressed-color: var(--button-pink-text-color);
    --button-pressed-text-shadow: var(--button-pink-text-shadow);
  }
  .pink.buttons .active.button,
  .pink.buttons .active.button.pressed,
  .pink.buttons .active.button:active,
  .pink.active.button,
  .pink.button .active.button.pressed,
  .pink.button .active.button:active {
    background-color: var(--button-pink-active);
    color: var(--button-pink-text-color);
    text-shadow: var(--button-pink-text-shadow);
  }
  .brown.buttons,
  .brown.button {
    --button-text-color: var(--button-brown-text-color);
    --button-text-shadow: var(--button-brown-text-shadow);
    --button-background: var(--button-brown) var(--button-colored-background-image);
    --button-box-shadow: var(--button-colored-box-shadow);
  }
  .brown.buttons,
  .brown.button:hover {
    --button-hover-color: var(--button-brown-text-color);
    --button-hover-text-shadow: var(--button-brown-text-shadow);
    --button-hover-background-color: var(--button-brown-hover);
    --button-hover-box-shadow: var(--button-colored-box-shadow);
  }
  .brown.buttons,
  .brown.button:focus {
    --button-focus-background-color: var(--button-brown-focus);
    --button-focus-color: var(--button-brown-text-color);
    --button-focus-text-shadow: var(--button-brown-text-shadow);
  }
  .brown.buttons,
  .brown.button.pressed,
  .brown.button:active {
    --button-pressed-background-color: var(--button-brown-pressed);
    --button-pressed-color: var(--button-brown-text-color);
    --button-pressed-text-shadow: var(--button-brown-text-shadow);
  }
  .brown.buttons .active.button,
  .brown.buttons .active.button.pressed,
  .brown.buttons .active.button:active,
  .brown.active.button,
  .brown.button .active.button.pressed,
  .brown.button .active.button:active {
    background-color: var(--button-brown-active);
    color: var(--button-brown-text-color);
    text-shadow: var(--button-brown-text-shadow);
  }
  .grey.buttons,
  .grey.button {
    --button-text-color: var(--button-grey-text-color);
    --button-text-shadow: var(--button-grey-text-shadow);
    --button-background: var(--button-grey) var(--button-colored-background-image);
    --button-box-shadow: var(--button-colored-box-shadow);
  }
  .grey.buttons,
  .grey.button:hover {
    --button-hover-color: var(--button-grey-text-color);
    --button-hover-text-shadow: var(--button-grey-text-shadow);
    --button-hover-background-color: var(--button-grey-hover);
    --button-hover-box-shadow: var(--button-colored-box-shadow);
  }
  .grey.buttons,
  .grey.button:focus {
    --button-focus-background-color: var(--button-grey-focus);
    --button-focus-color: var(--button-grey-text-color);
    --button-focus-text-shadow: var(--button-grey-text-shadow);
  }
  .grey.buttons,
  .grey.button.pressed,
  .grey.button:active {
    --button-pressed-background-color: var(--button-grey-pressed);
    --button-pressed-color: var(--button-grey-text-color);
    --button-pressed-text-shadow: var(--button-grey-text-shadow);
  }
  .grey.buttons .active.button,
  .grey.buttons .active.button.pressed,
  .grey.buttons .active.button:active,
  .grey.active.button,
  .grey.button .active.button.pressed,
  .grey.button .active.button:active {
    background-color: var(--button-grey-active);
    color: var(--button-grey-text-color);
    text-shadow: var(--button-grey-text-shadow);
  }
  .black.buttons,
  .black.button {
    --button-text-color: var(--button-black-text-color);
    --button-text-shadow: var(--button-black-text-shadow);
    --button-background: var(--button-black) var(--button-colored-background-image);
    --button-box-shadow: var(--button-colored-box-shadow);
  }
  .black.buttons,
  .black.button:hover {
    --button-hover-color: var(--button-black-text-color);
    --button-hover-text-shadow: var(--button-black-text-shadow);
    --button-hover-background-color: var(--button-black-hover);
    --button-hover-box-shadow: var(--button-colored-box-shadow);
  }
  .black.buttons,
  .black.button:focus {
    --button-focus-background-color: var(--button-black-focus);
    --button-focus-color: var(--button-black-text-color);
    --button-focus-text-shadow: var(--button-black-text-shadow);
  }
  .black.buttons,
  .black.button.pressed,
  .black.button:active {
    --button-pressed-background-color: var(--button-black-pressed);
    --button-pressed-color: var(--button-black-text-color);
    --button-pressed-text-shadow: var(--button-black-text-shadow);
  }
  .black.buttons .active.button,
  .black.buttons .active.button.pressed,
  .black.buttons .active.button:active,
  .black.active.button,
  .black.button .active.button.pressed,
  .black.button .active.button:active {
    background-color: var(--button-black-active);
    color: var(--button-black-text-color);
    text-shadow: var(--button-black-text-shadow);
  }
}

/* src/components/button/css/shadow/variations/compact.css */
@layer component.button.variations.compact {
  .compact.buttons .button,
  .compact.button {
    padding: var(--button-compact-vertical-padding) var(--button-compact-horizontal-padding);
  }
  .compact.icon.buttons .button,
  .compact.icon.button {
    padding: var(--button-compact-icon-padding);
  }
  .very-compact.buttons .button,
  .very-compact.button {
    padding: var(--button-very-compact-vertical-padding) var(--button-very-compact-horizontal-padding);
  }
  .very-compact.icon.buttons .button,
  .very-compact.icon.button {
    padding: var(--button-very-compact-icon-padding);
  }
}

/* src/components/button/css/shadow/variations/floated.css */
@layer component.button.variations.floated {
  .left-floated.buttons,
  .left-floated.button {
    float: left;
    margin-left: 0em;
    margin-right: var(--button-floated-margin);
  }
  .right-floated.buttons,
  .right-floated.button {
    float: right;
    margin-right: 0em;
    margin-left: var(--button-floated-margin);
  }
}

/* src/components/button/css/shadow/variations/fluid.css */
@layer component.button.variations.fluid {
  .fluid.buttons,
  .fluid.button {
    width: 100%;
  }
  .fluid.button {
    display: block;
  }
  .two.buttons {
    width: 100%;
  }
  .two.buttons > .button {
    width: 50%;
  }
  .three.buttons {
    width: 100%;
  }
  .three.buttons > .button {
    width: 33.333%;
  }
  .four.buttons {
    width: 100%;
  }
  .four.buttons > .button {
    width: 25%;
  }
  .five.buttons {
    width: 100%;
  }
  .five.buttons > .button {
    width: 20%;
  }
  .six.buttons {
    width: 100%;
  }
  .six.buttons > .button {
    width: 16.666%;
  }
  .seven.buttons {
    width: 100%;
  }
  .seven.buttons > .button {
    width: 14.285%;
  }
  .eight.buttons {
    width: 100%;
  }
  .eight.buttons > .button {
    width: 12.500%;
  }
  .nine.buttons {
    width: 100%;
  }
  .nine.buttons > .button {
    width: 11.11%;
  }
  .ten.buttons {
    width: 100%;
  }
  .ten.buttons > .button {
    width: 10%;
  }
  .eleven.buttons {
    width: 100%;
  }
  .eleven.buttons > .button {
    width: 9.09%;
  }
  .twelve.buttons {
    width: 100%;
  }
  .twelve.buttons > .button {
    width: 8.3333%;
  }
  .fluid.vertical.buttons,
  .fluid.vertical.buttons > .button {
    display: flex;
    width: auto;
  }
  .two.vertical.buttons > .button {
    height: 50%;
  }
  .three.vertical.buttons > .button {
    height: 33.333%;
  }
  .four.vertical.buttons > .button {
    height: 25%;
  }
  .five.vertical.buttons > .button {
    height: 20%;
  }
  .six.vertical.buttons > .button {
    height: 16.666%;
  }
  .seven.vertical.buttons > .button {
    height: 14.285%;
  }
  .eight.vertical.buttons > .button {
    height: 12.500%;
  }
  .nine.vertical.buttons > .button {
    height: 11.11%;
  }
  .ten.vertical.buttons > .button {
    height: 10%;
  }
  .eleven.vertical.buttons > .button {
    height: 9.09%;
  }
  .twelve.vertical.buttons > .button {
    height: 8.3333%;
  }
}

/* src/components/button/css/shadow/variations/negative.css */
@layer component.button.variations.negative {
  .negative.buttons .button,
  .negative.button {
    background-color: var(--button-negative-color);
    color: var(--button-negative-text-color);
    text-shadow: var(--button-negative-text-shadow);
    background-image: var(--button-colored-background-image);
  }
  .negative.button {
    box-shadow: var(--button-negative-box-shadow);
  }
  .negative.buttons .button:hover,
  .negative.button:hover {
    background-color: var(--button-negative-color-hover);
    color: var(--button-negative-text-color);
    text-shadow: var(--button-negative-text-shadow);
    box-shadow: var(--button-hover-box-shadow);
  }
  .negative.buttons .button:focus,
  .negative.button:focus {
    background-color: var(--button-negative-color-focus);
    color: var(--button-negative-text-color);
    text-shadow: var(--button-negative-text-shadow);
    box-shadow: var(--button-focus-box-shadow);
  }
  .negative.buttons .button.pressed,
  .negative.button.pressed,
  .negative.buttons .button:active,
  .negative.button:active {
    background-color: var(--button-negative-color-down);
    color: var(--button-negative-text-color);
    text-shadow: var(--button-negative-text-shadow);
    box-shadow: var(--button-pressed-box-shadow);
  }
  .negative.buttons .active.button,
  .negative.buttons .active.button:active,
  .negative.active.button,
  .negative.button .active.button:active {
    background-color: var(--button-negative-color-active);
    color: var(--button-negative-text-color);
    text-shadow: var(--button-negative-text-shadow);
    box-shadow: var(--button-active-box-shadow);
  }
  .subtle-negative.buttons .button,
  .subtle-negative.button {
    background-color: var(--button-subtle-negative-color);
    color: var(--button-subtle-negative-text-color);
    text-shadow: var(--button-subtle-negative-text-shadow);
    background-image: var(--button-subtle-negative-background-image);
  }
  .subtle-negative.button {
    box-shadow: var(--button-subtle-negative-box-shadow);
  }
  .subtle-negative.buttons .button:hover,
  .subtle-negative.button:hover {
    background-color: var(--button-subtle-negative-color-hover);
    color: var(--button-subtle-negative-text-color);
    text-shadow: var(--button-subtle-negative-text-shadow);
    box-shadow: var(--button-hover-box-shadow);
  }
  .subtle-negative.buttons .button:focus,
  .subtle-negative.button:focus {
    background-color: var(--button-subtle-negative-color-focus);
    color: var(--button-subtle-negative-text-color);
    text-shadow: var(--button-subtle-negative-text-shadow);
    box-shadow: var(--button-focus-box-shadow);
  }
  .subtle-negative.buttons .button.pressed,
  .subtle-negative.button.pressed,
  .subtle-negative.buttons .button:active,
  .subtle-negative.button:active {
    background-color: var(--button-subtle-negative-color-down);
    color: var(--button-subtle-negative-text-color);
    text-shadow: var(--button-subtle-negative-text-shadow);
    box-shadow: var(--button-pressed-box-shadow);
  }
  .subtle-negative.buttons .active.button,
  .subtle-negative.buttons .active.button:active,
  .subtle-negative.active.button,
  .subtle-negative.button .active.button:active {
    background-color: var(--button-subtle-negative-color-active);
    background-image: var(--button-subtle-negative-background-image);
    color: var(--button-subtle-negative-text-color);
    text-shadow: var(--button-subtle-negative-text-shadow);
    box-shadow: var(--button-active-box-shadow);
  }
  .subtle-negative.buttons .button > .icon,
  .subtle-negative.button > .icon {
    color: var(--button-subtle-negative-text-color);
  }
}

/* src/components/button/css/shadow/variations/positive.css */
@layer component.button.variations.positive {
  .positive.buttons .button,
  .positive.button {
    background-color: var(--button-positive-color);
    color: var(--button-positive-text-color);
    text-shadow: var(--button-positive-text-shadow);
    background-image: var(--button-positive-background-image);
  }
  .positive.button {
    box-shadow: var(--button-positive-box-shadow);
  }
  .positive.buttons .button:hover,
  .positive.button:hover {
    background-color: var(--button-positive-color-hover);
    color: var(--button-positive-text-color);
    text-shadow: var(--button-positive-text-shadow);
    box-shadow: var(--button-hover-box-shadow);
  }
  .positive.buttons .button:focus,
  .positive.button:focus {
    background-color: var(--button-positive-color-focus);
    color: var(--button-positive-text-color);
    text-shadow: var(--button-positive-text-shadow);
    box-shadow: var(--button-focus-box-shadow);
  }
  .positive.buttons .button.pressed,
  .positive.button.pressed,
  .positive.buttons .button:active,
  .positive.button:active {
    background-color: var(--button-positive-color-down);
    color: var(--button-positive-text-color);
    text-shadow: var(--button-positive-text-shadow);
    box-shadow: var(--button-pressed-box-shadow);
  }
  .positive.buttons .active.button,
  .positive.buttons .active.button:active,
  .positive.active.button,
  .positive.button .active.button:active {
    background-color: var(--button-positive-color-active);
    color: var(--button-positive-text-color);
    text-shadow: var(--button-positive-text-shadow);
    box-shadow: var(--button-active-box-shadow);
  }
  .subtle-positive.buttons .button,
  .subtle-positive.button {
    background-color: var(--button-subtle-positive-color);
    color: var(--button-subtle-positive-text-color);
    text-shadow: var(--button-subtle-positive-text-shadow);
    background-image: var(--button-subtle-positive-background-image);
  }
  .subtle-positive.button {
    box-shadow: var(--button-subtle-positive-box-shadow);
  }
  .subtle-positive.buttons .button:hover,
  .subtle-positive.button:hover {
    background-color: var(--button-subtle-positive-color-hover);
    color: var(--button-subtle-positive-text-color);
    text-shadow: var(--button-subtle-positive-text-shadow);
    box-shadow: var(--button-hover-box-shadow);
  }
  .subtle-positive.buttons .button:focus,
  .subtle-positive.button:focus {
    background-color: var(--button-subtle-positive-color-focus);
    color: var(--button-subtle-positive-text-color);
    text-shadow: var(--button-subtle-positive-text-shadow);
    box-shadow: var(--button-focus-box-shadow);
  }
  .subtle-positive.buttons .button.pressed,
  .subtle-positive.button.pressed,
  .subtle-positive.buttons .button:active,
  .subtle-positive.button:active {
    background-color: var(--button-subtle-positive-color-down);
    color: var(--button-subtle-positive-text-color);
    text-shadow: var(--button-subtle-positive-text-shadow);
    box-shadow: var(--button-pressed-box-shadow);
  }
  .subtle-positive.buttons .active.button,
  .subtle-positive.active.button,
  .subtle-positive.buttons .active.button:active,
  .subtle-positive.button .active.button:active {
    background-color: var(--button-subtle-positive-color-active);
    background-image: var(--button-subtle-positive-background-image);
    color: var(--button-subtle-positive-text-color);
    text-shadow: var(--button-subtle-positive-text-shadow);
    box-shadow: var(--button-active-box-shadow);
  }
  .subtle-positive.buttons .button > .icon,
  .subtle-positive.button > .icon {
    color: var(--button-subtle-positive-text-color);
  }
}

/* src/components/button/css/shadow/variations/warning.css */
@layer component.button.variations.warning {
  .warning.buttons .button,
  .warning.button {
    background-color: var(--button-warning-color);
    color: var(--button-warning-text-color);
    text-shadow: var(--button-warning-text-shadow);
    background-image: var(--button-colored-background-image);
  }
  .warning.button {
    box-shadow: var(--button-warning-box-shadow);
  }
  .warning.buttons .button:hover,
  .warning.button:hover {
    background-color: var(--button-warning-color-hover);
    color: var(--button-warning-text-color);
    text-shadow: var(--button-warning-text-shadow);
    box-shadow: var(--button-hover-box-shadow);
  }
  .warning.buttons .button:focus,
  .warning.button:focus {
    background-color: var(--button-warning-color-focus);
    color: var(--button-warning-text-color);
    text-shadow: var(--button-warning-text-shadow);
    box-shadow: var(--button-focus-box-shadow);
  }
  .warning.buttons .button:active,
  .warning.button:active {
    background-color: var(--button-warning-color-down);
    color: var(--button-warning-text-color);
    text-shadow: var(--button-warning-text-shadow);
  }
  .warning.buttons .active.button,
  .warning.buttons .active.button:active,
  .warning.active.button,
  .warning.button .active.button:active {
    background-color: var(--button-warning-color-active);
    color: var(--button-warning-text-color);
    text-shadow: var(--button-warning-text-shadow);
  }
  .subtle-warning.buttons .button,
  .subtle-warning.button {
    background-color: var(--button-subtle-warning-color);
    color: var(--button-subtle-warning-text-color);
    text-shadow: var(--button-subtle-warning-text-shadow);
    background-image: var(--button-subtle-warning-background-image);
  }
  .subtle-warning.button {
    box-shadow: var(--button-subtle-warning-box-shadow);
  }
  .subtle-warning.buttons .button:hover,
  .subtle-warning.button:hover {
    background-color: var(--button-subtle-warning-color-hover);
    color: var(--button-subtle-warning-text-color);
    text-shadow: var(--button-subtle-warning-text-shadow);
    box-shadow: var(--button-hover-box-shadow);
  }
  .subtle-warning.buttons .button:focus,
  .subtle-warning.button:focus {
    background-color: var(--button-subtle-warning-color-focus);
    color: var(--button-subtle-warning-text-color);
    text-shadow: var(--button-subtle-warning-text-shadow);
    box-shadow: var(--button-focus-box-shadow);
  }
  .subtle-warning.buttons .button:active,
  .subtle-warning.button:active {
    background-color: var(--button-subtle-warning-color-down);
    color: var(--button-subtle-warning-text-color);
    text-shadow: var(--button-subtle-warning-text-shadow);
    box-shadow: var(--button-pressed-box-shadow);
  }
  .subtle-warning.buttons .active.button,
  .subtle-warning.buttons .active.button:active,
  .subtle-warning.active.button,
  .subtle-warning.button .active.button:active {
    background-color: var(--button-subtle-warning-color-active);
    background-image: var(--button-subtle-warning-background-image);
    color: var(--button-subtle-warning-text-color);
    text-shadow: var(--button-subtle-warning-text-shadow);
    box-shadow: var(--button-active-box-shadow);
  }
  .subtle-warning.buttons .button > .icon,
  .subtle-warning.button > .icon {
    color: var(--button-subtle-warning-text-color);
  }
}

/* src/components/button/css/shadow/variations/info.css */
@layer component.button.variations.info {
  .info.buttons .button,
  .info.button {
    background-color: var(--button-info-color);
    color: var(--button-info-text-color);
    text-shadow: var(--button-info-text-shadow);
    background-image: var(--button-colored-background-image);
  }
  .info.button {
    box-shadow: var(--button-info-box-shadow);
  }
  .info.buttons .button:hover,
  .info.button:hover {
    background-color: var(--button-info-color-hover);
    color: var(--button-info-text-color);
    text-shadow: var(--button-info-text-shadow);
  }
  .info.buttons .button:focus,
  .info.button:focus {
    background-color: var(--button-info-color-focus);
    color: var(--button-info-text-color);
    text-shadow: var(--button-info-text-shadow);
  }
  .info.buttons .button.pressed,
  .info.button.pressed,
  .info.buttons .button:active,
  .info.button:active {
    background-color: var(--button-info-color-down);
    color: var(--button-info-text-color);
    text-shadow: var(--button-info-text-shadow);
  }
  .info.buttons .active.button,
  .info.buttons .active.button:active,
  .info.active.button,
  .info.button .active.button:active {
    background-color: var(--button-info-color-active);
    color: var(--button-info-text-color);
    text-shadow: var(--button-info-text-shadow);
  }
  .subtle-info.buttons .button,
  .subtle-info.button {
    background-color: var(--button-subtle-info-color);
    color: var(--button-subtle-info-text-color);
    text-shadow: var(--button-subtle-info-text-shadow);
    background-image: var(--button-subtle-info-background-image);
  }
  .subtle-info.button {
    box-shadow: var(--button-subtle-info-box-shadow);
  }
  .subtle-info.buttons .button:hover,
  .subtle-info.button:hover {
    background-color: var(--button-subtle-info-color-hover);
    color: var(--button-subtle-info-text-color);
    text-shadow: var(--button-subtle-info-text-shadow);
  }
  .subtle-info.buttons .button:focus,
  .subtle-info.button:focus {
    background-color: var(--button-subtle-info-color-focus);
    color: var(--button-subtle-info-text-color);
    text-shadow: var(--button-subtle-info-text-shadow);
  }
  .subtle-info.buttons .button.pressed,
  .subtle-info.button.pressed,
  .subtle-info.buttons .button:active,
  .subtle-info.button:active {
    background-color: var(--button-subtle-info-color-down);
    color: var(--button-subtle-info-text-color);
    text-shadow: var(--button-subtle-info-text-shadow);
  }
  .subtle-info.buttons .active.button,
  .subtle-info.buttons .active.button:active,
  .subtle-info.active.button,
  .subtle-info.button .active.button:active {
    background-color: var(--button-subtle-info-color-active);
    background-image: var(--button-subtle-info-background-image);
    color: var(--button-subtle-info-text-color);
    text-shadow: var(--button-subtle-info-text-shadow);
  }
  .subtle-info.buttons .button > .icon,
  .subtle-info.button > .icon {
    color: var(--button-subtle-info-text-color);
  }
}

/* src/components/button/css/shadow/variations/sizing.css */
@layer component.button.variations.sizing {
  .mini.button {
    font-size: var(--button-mini);
  }
  .tiny.button {
    font-size: var(--button-tiny);
  }
  .small.button {
    font-size: var(--button-small);
  }
  :host {
    font-size: var(--button-medium);
  }
  .large.button {
    font-size: var(--button-large);
  }
  .big.button {
    font-size: var(--button-big);
  }
  .huge.button {
    font-size: var(--button-huge);
  }
  .massive.button {
    font-size: var(--button-massive);
  }
  .mini.buttons {
    --button-medium: var(--button-mini);
  }
  .tiny.buttons {
    --button-medium: var(--button-tiny);
  }
  .small.buttons {
    --button-medium: var(--button-small);
  }
  .large.buttons {
    --button-medium: var(--button-large);
  }
  .big.buttons {
    --button-medium: var(--button-big);
  }
  .huge.buttons {
    --button-medium: var(--button-huge);
  }
  .massive.buttons {
    --button-medium: var(--button-massive);
  }
}

/* src/components/button/css/shadow/variations/social.css */
@layer component.button.variations.social {
  .social.button .icon {
    opacity: 1;
  }
  .facebook.button {
    background-color: var(--facebook-color);
    color: var(--button-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
    background-image: var(--button-colored-background-image);
    box-shadow: var(--button-colored-box-shadow);
  }
  .facebook.button:hover {
    background-color: var(--facebook-hover-color);
    color: var(--button-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
  }
  .facebook.button:active {
    background-color: var(--facebook-down-color);
    color: var(--button-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
  }
  .twitter.button {
    background-color: var(--twitter-color);
    color: var(--button-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
    background-image: var(--button-colored-background-image);
    box-shadow: var(--button-colored-box-shadow);
  }
  .twitter.button:hover {
    background-color: var(--twitter-hover-color);
    color: var(--button-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
  }
  .twitter.button:active {
    background-color: var(--twitter-down-color);
    color: var(--button-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
  }
  .linkedin.button {
    background-color: var(--linked-in-color);
    color: var(--button-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
  }
  .linkedin.button:hover {
    background-color: var(--linked-in-hover-color);
    color: var(--button-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
  }
  .linkedin.button:active {
    background-color: var(--linked-in-down-color);
    color: var(--button-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
  }
  .youtube.button {
    background-color: var(--youtube-color);
    color: var(--button-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
    background-image: var(--button-colored-background-image);
    box-shadow: var(--button-colored-box-shadow);
  }
  .youtube.button:hover {
    background-color: var(--youtube-hover-color);
    color: var(--button-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
  }
  .youtube.button:active {
    background-color: var(--youtube-down-color);
    color: var(--button-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
  }
  .instagram.button {
    background-color: var(--instagram-color);
    color: var(--button-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
    background-image: var(--button-instagram-background-image);
    box-shadow: var(--button-colored-box-shadow);
  }
  .instagram.button:hover {
    background-color: var(--instagram-hover-color);
    color: var(--button-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
  }
  .instagram.button:active {
    background-color: var(--instagram-down-color);
    color: var(--button-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
  }
  .pinterest.button {
    background-color: var(--pinterest-color);
    color: var(--button-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
    background-image: var(--button-colored-background-image);
    box-shadow: var(--button-colored-box-shadow);
  }
  .pinterest.button:hover {
    background-color: var(--pinterest-hover-color);
    color: var(--button-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
  }
  .pinterest.button:active {
    background-color: var(--pinterest-down-color);
    color: var(--button-inverted-text-color);
    text-shadow: var(--button-inverted-text-shadow);
  }
}

/* src/components/button/css/shadow/variations/vertical.css */
@layer component.button.variations.vertical {
  .vertical.buttons {
    display: inline-flex;
    flex-direction: column;
  }
  .vertical.buttons .button {
    display: block;
    float: none;
    width: 100%;
    margin: var(--vertical-group-offset);
    box-shadow: var(--vertical-box-shadow);
    border-radius: 0em;
  }
  .vertical.buttons .button:first-child {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }
  .vertical.buttons .button:last-child {
    margin-bottom: 0px;
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
  }
  .vertical.buttons .button:only-child {
    border-radius: var(--border-radius);
  }
}

/* src/components/button/css/shadow/button.css */
`;var Qo=`/* src/components/button/css/page/group/buttons.css */
@layer component {
  ui-buttons ui-button::part(button) {
    flex: 1 0 auto;
    border-radius: 0em;
    margin: var(--button-group-button-offset);
  }
  ui-buttons ui-button[first]::part(button),
  ui-buttons > ui-button:first-child::part(button) {
    border-left: none;
    margin-left: 0em;
    border-top-left-radius: var(--button-border-radius);
    border-bottom-left-radius: var(--button-border-radius);
  }
  ui-buttons ui-button[last]::part(button),
  ui-buttons > ui-button:last-child::part(button) {
    border-top-right-radius: var(--button-border-radius);
    border-bottom-right-radius: var(--button-border-radius);
  }
}

/* src/components/button/css/page/button.css */
`;var tn=`<div class="{{ui}} buttons">
  {{>slot}}
</div>
`;var en=y({tagName:"ui-buttons",plural:!0,singularTag:"ui-button",delegateFocus:!0,componentSpec:De,template:tn,css:be,pageCSS:Qo});var on=`/*-------------------
      Or Buttons
--------------------*/
:host {
  align-self: center;
}
.or {
  position: relative;
  width: var(--button-or-gap);
  height: var(--button-or-height);
  z-index: var(--button-or-z-index);
}
.or .shape {
  position: absolute;
  text-align: center;
  border-radius: var(--circular-radius);

  top: 50%;
  left: 50%;
  background-color: var(--button-or-background-color);
  text-shadow: var(--button-or-text-shadow);

  margin-top: var(--button-or-vertical-offset);
  margin-left: var(--button-or-horizontal-offset);

  width: var(--button-or-circle-size);
  height: var(--button-or-circle-size);

  line-height: var(--button-or-line-height);
  color: var(--button-or-text-color);

  font-style: var(--button-or-text-style);
  font-weight: var(--button-or-text-weight);

  box-shadow: var(--button-or-box-shadow);
}

`;var nn=`<div class="{{ui}} or" part="or">
  <div class="shape"><slot>or</slot></div>
</div>
`;var $a=y({tagName:"button-or",template:nn,css:on});var an=`{#if href}
  <a class="{ui}button" href="{href}">
    {> content}
  </a>
{else}
  <div class="{ui}button" tabindex="0" part="button">
    {> content}
  </div>
{/if}

{#snippet content}
  {#if animated}
    {> animated}
  {else}
    {#if isIconBefore}
      {> icon}
    {/if}
    {#if not iconOnly}
      <span class="text">
        {> slot}
      </span>
    {/if}
    {#if isIconAfter}
      {> icon}
    {/if}
  {/if}
{/snippet}

{#snippet icon}
  <ui-icon icon={icon} class="icon" part="icon"></ui-icon>
{/snippet}

{#snippet animated}
  <span class="hidden content">
    {>slot hidden}
  </span>
  <span class="visible content">
    {>slot visible}
  </span>
{/snippet}
`;var La=({self:n,settings:t,data:e,el:o,$:a})=>({isIconBefore(){return t.icon&&!t.iconAfter},isIconAfter(){return t.icon&&t.iconAfter},isSubmitKey(r){return D({13:"Space",32:"Enter"},String(r))},isDisabled(){return t.state=="disabled"}}),Na={"touchstart .button"({event:n,self:t,$:e}){e(this).addClass("pressed")},"touchend .button"({event:n,self:t,$:e}){e(this).removeClass("pressed")},"click .button"({event:n,self:t,$:e}){e(this).blur()},"keydown .button"({event:n,self:t,$:e}){let o=e(this);t.isSubmitKey(n.keyCode)&&(o.addClass("pressed"),n.preventDefault()),n.key=="Escape"&&o.blur()},"keyup .button"({event:n,self:t,$:e}){let o=e(this);t.isSubmitKey(n.keyCode)&&o.removeClass("pressed")}},rn=y({tagName:"ui-button",componentSpec:_e,template:an,css:be,createComponent:La,events:Na});var pe=`/* src/components/card/css/shadow/content/card.css */
@layer component.card.content.card {
  :host {
    display: inline-block;
    text-align: var(--card-text-align);
    margin: var(--card-margin);
  }
  .card {
    display: flex;
    flex-direction: var(--card-flex-direction);
    gap: var(--card-gap);
    text-decoration: none;
    border-radius: var(--card-border-radius);
    border: var(--card-border);
    transition: var(--card-transition);
    box-shadow: var(--card-box-shadow);
    background: var(--card-background);
    padding: var(--card-padding);
  }
  .card > :first-child {
    border-radius: inherit;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .card > :last-child {
    border-radius: inherit;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}

/* src/components/card/css/shadow/content/description.css */
@layer component.card.content.description {
  ::slotted(.description),
  .description {
    color: var(--card-description-color);
    font-size: var(--card-description-font-size);
    transition: var(--card-description-transition);
    line-height: var(--card-description-line-height);
  }
}

/* src/components/card/css/shadow/content/header.css */
@layer component.card.content.header {
  ::slotted(.header),
  .header {
    color: var(--card-header-color);
    font-size: var(--card-header-font-size);
    font-weight: var(--card-header-font-weight);
    transition: var(--card-header-transition);
  }
}

/* src/components/card/css/shadow/content/subheader.css */
@layer component.card.content.subheader {
  ::slotted(.subheader),
  .subheader {
    color: var(--card-subheader-color);
    font-size: var(--card-subheader-font-size);
    font-weight: var(--card-subheader-font-weight);
    transition: var(--card-subheader-transition);
  }
}

/* src/components/card/css/shadow/content/image.css */
@layer component.card.content.image {
  .image {
    overflow: hidden;
    margin: var(--card-reverse-padding) var(--card-reverse-padding) 1em;
  }
  ::slotted(.image),
  ::slotted(ui-image),
  .image img {
    display: block;
    width: var(--card-image-width);
    max-width: var(--card-image-max-width);
    object-fit: contain;
  }
}

/* src/components/card/css/shadow/content/icon.css */
@layer component.card.content.icon {
  ::slotted(ui-icon),
  ::slotted(.icon),
  .icon ui-icon {
    font-size: var(--card-icon-font-size);
    margin: var(--card-icon-margin);
    color: var(--card-icon-color);
  }
}

/* src/components/card/css/shadow/content/meta.css */
@layer component.card.content.meta {
  ::slotted(.meta),
  .meta {
    margin-top: var(--card-meta-margin);
    padding-top: var(--card-meta-spacing);
    border-top: var(--card-meta-border);
    display: flex;
    gap: var(--card-meta-gap);
  }
  .meta > * {
    color: var(--card-meta-text-color);
    font-weight: bold;
  }
}

/* src/components/card/css/shadow/states/disabled.css */
@layer component.states.disabled {
  .disabled {
    pointer-events: none;
    opacity: var(--disabled-opacity);
  }
  .clickable-disabled {
    pointer-events: allowed;
  }
}

/* src/components/card/css/shadow/plural/cards.css */
@layer component.card.plural {
  :host(ui-cards) {
    display: block;
    container: host / inline-size;
    margin: var(--cards-margin);
  }
  .component {
    container: component / inline-size;
  }
  .cards {
    display: grid;
    gap: var(--cards-gap);
    grid-auto-rows: 1fr;
    width: 100%;
  }
  ::slotted(ui-card) {
    display: contents;
  }
}

/* src/components/card/css/shadow/variations/basic.css */
@layer component.card.variations.basic {
  .basic.card {
    background: var(--card-basic-background);
    box-shadow: var(--card-basic-box-shadow);
    border: var(--card-basic-border);
  }
}

/* src/components/card/css/shadow/variations/count.css */
@layer component.card.variations.count {
  .cards.one {
    grid-template-columns: 1fr;
  }
  .cards.two {
    grid-template-columns: repeat(2, 1fr);
  }
  .cards.three {
    grid-template-columns: repeat(3, 1fr);
  }
  .cards.four {
    grid-template-columns: repeat(4, 1fr);
  }
  .cards.five {
    grid-template-columns: repeat(5, 1fr);
  }
  .cards.six {
    grid-template-columns: repeat(6, 1fr);
  }
  .cards.seven {
    grid-template-columns: repeat(7, 1fr);
  }
  .cards.eight {
    grid-template-columns: repeat(8, 1fr);
  }
}

/* src/components/card/css/shadow/variations/fluid.css */
@layer component.card.variations.fluid {
  .fluid.card {
    width: 100%;
  }
}

/* src/components/card/css/shadow/variations/horizontal.css */
@layer component.card.variations.horizontal {
  .horizontal {
    flex-direction: var(--card-horizontal-flex-direction);
    gap: var(--card-horizontal-gap);
    text-align: left;
  }
  .horizontal ::slotted(.image),
  .horizontal ::slotted(ui-image),
  .horizontal .image {
    margin: var(--card-reverse-padding);
    margin-bottom: 0;
    max-width: var(--card-horizontal-image-max-width);
  }
  .horizontal ::slotted(ui-icon),
  .horizontal ::slotted(.icon),
  .horizontal .icon ui-icon {
    font-size: var(--card-horizontal-icon-font-size);
    margin: var(--card-horizontal-icon-margin);
  }
  .horizontal ::slotted(.header),
  .horizontal .header {
    font-size: var(--card-horizontal-header-size);
  }
  .horizontal :first-child {
    border-radius: inherit;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .horizontal :last-child {
    border-radius: inherit;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

/* src/components/card/css/shadow/variations/link.css */
@layer component.card.variations.link {
  .link.card,
  a.card {
    cursor: pointer;
    color: inherit;
  }
  .link.card:hover,
  a.card:hover {
    background: var(--card-link-hover-background);
    box-shadow: var(--card-link-hover-box-shadow);
    border: var(--card-link-hover-border);
  }
  .link.card:hover ::slotted(.header),
  .link.card:hover .header,
  a.card:hover ::slotted(.header),
  a.card:hover .header {
    color: var(--card-link-hover-header-color);
  }
  .link.card:hover ::slotted(ui-icon),
  .link.card:hover ::slotted(.icon),
  .link.card:hover .icon ui-icon,
  a.card:hover ::slotted(ui-icon),
  a.card:hover ::slotted(.icon),
  a.card:hover .icon ui-icon {
    color: var(--card-link-hover-icon-color);
  }
}

/* src/components/card/css/shadow/variations/spaced.css */
@layer component.card.variations.spaced {
  .cards.spaced {
    gap: var(--cards-spaced-gap);
  }
  .cards.very-spaced {
    gap: var(--cards-very-spaced-gap);
  }
}

/* src/components/card/css/shadow/variations/doubling.css */
@layer component.card.variations.doubling {
  @container component (max-width: var(--card-doubling-breakpoint)) {
    .doubling.cards {
    }
  }
}

/* src/components/card/css/shadow/variations/stackable.css */
@layer component.card.variations.stackable {
  .component {
    --card-stackable-comparison: max(calc(100cqi - var(--card-stackable-breakpoint)), 0px);
  }
  @container component style(--card-stackable-comparison: 0) {
    .stackable.cards {
      display: flex;
      flex-direction: column;
    }
  }
}

/* src/components/card/css/shadow/card.css */
`;var sn=`{#if href}
  <a class="{ui}card" href="{href}">
    {> content}
  </a>
{else}
  <div class="{ui}card" part="card">
    {> content}
  </div>
{/if}

{#snippet content}
  {#if horizontal}
    {>image}
    {>icon}
    <div class="content">
      {>header}
      {>subheader}
      {>description}
      {> slot}
    </div>
  {else}
    {>image}
    <div class="content">
      {>icon}
      {>header}
      {>subheader}
      {>description}
      {> slot}
    </div>
  {/if}
{/snippet}

{#snippet icon}
  <div class="icon" part="icon">
    {#if icon}
      <ui-icon icon={icon}></ui-icon>
    {/if}
    {> slot icon}
  </div>
{/snippet}

{#snippet header}
  <div class="header" part="header">
    {header}
    {> slot header}
  </div>
{/snippet}

{#snippet subheader}
  <div class="subheader" part="subheader">
    {subheader}
    {> slot subheader}
  </div>
{/snippet}

{#snippet image}
  <div class="image" part="image">
    {#if image}
      <img src="{image}" part="image-img">
    {/if}
    {> slot image}
  </div>
{/snippet}

{#snippet description}
  <div class="description" part="description">
    {description}
    {> slot description}
  </div>
{/snippet}

{#snippet meta}
  <div class="meta" part="meta">
    {#each value in meta}
      <span>{value}</span>
    {/each}
    {> slot meta}
  </div>
{/snippet}
`;var Ra=({$:n})=>({}),cn=y({tagName:"ui-card",componentSpec:Xe,template:sn,css:pe,createComponent:Ra});var ln=`<div class="component">
  <div class="{{ui}} cards" part="cards">
    {{>slot}}
  </div>
</div>
`;var un=y({tagName:"ui-cards",singularTag:"ui-card",plural:!0,delegateFocus:!0,componentSpec:Je,template:ln,css:pe});var dn=`/* src/components/icon/css/shadow/content/icon.css */
@layer component.icon.singular {
  :host {
    display: inline-block;
    height: 1em;
    font-style: normal;
    font-weight: normal;
    text-decoration: inherit;
    text-align: center;
    margin: 0em var(--icon-distance-from-text) 0em 0em;
    font-size: inherit;
    vertical-align: text-top;
  }
  .icon {
    display: inherit;
    vertical-align: top;
    opacity: var(--icon-opacity);
    width: var(--icon-width);
    height: var(--icon-height);
    background-color: currentColor;
    -webkit-mask-image: linear-gradient(transparent, transparent);
    mask-image: linear-gradient(transparent, transparent);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    backface-visibility: hidden;
    fill: currentColor;
    speak: none;
  }
  .icon.airplay {
    -webkit-mask-image: var(--icon-airplay-svg);
    mask-image: var(--icon-airplay-svg);
  }
  .icon.alert-circle {
    -webkit-mask-image: var(--icon-alert-circle-svg);
    mask-image: var(--icon-alert-circle-svg);
  }
  .icon.alert-octagon {
    -webkit-mask-image: var(--icon-alert-octagon-svg);
    mask-image: var(--icon-alert-octagon-svg);
  }
  .icon.alert-triangle {
    -webkit-mask-image: var(--icon-alert-triangle-svg);
    mask-image: var(--icon-alert-triangle-svg);
  }
  .icon.align-center {
    -webkit-mask-image: var(--icon-align-center-svg);
    mask-image: var(--icon-align-center-svg);
  }
  .icon.align-justify {
    -webkit-mask-image: var(--icon-align-justify-svg);
    mask-image: var(--icon-align-justify-svg);
  }
  .icon.align-left {
    -webkit-mask-image: var(--icon-align-left-svg);
    mask-image: var(--icon-align-left-svg);
  }
  .icon.align-right {
    -webkit-mask-image: var(--icon-align-right-svg);
    mask-image: var(--icon-align-right-svg);
  }
  .icon.anchor {
    -webkit-mask-image: var(--icon-anchor-svg);
    mask-image: var(--icon-anchor-svg);
  }
  .icon.aperture {
    -webkit-mask-image: var(--icon-aperture-svg);
    mask-image: var(--icon-aperture-svg);
  }
  .icon.archive {
    -webkit-mask-image: var(--icon-archive-svg);
    mask-image: var(--icon-archive-svg);
  }
  .icon.arrow-down {
    -webkit-mask-image: var(--icon-arrow-down-svg);
    mask-image: var(--icon-arrow-down-svg);
  }
  .icon.arrow-down-circle {
    -webkit-mask-image: var(--icon-arrow-down-circle-svg);
    mask-image: var(--icon-arrow-down-circle-svg);
  }
  .icon.arrow-down-left {
    -webkit-mask-image: var(--icon-arrow-down-left-svg);
    mask-image: var(--icon-arrow-down-left-svg);
  }
  .icon.arrow-down-right {
    -webkit-mask-image: var(--icon-arrow-down-right-svg);
    mask-image: var(--icon-arrow-down-right-svg);
  }
  .icon.arrow-left {
    -webkit-mask-image: var(--icon-arrow-left-svg);
    mask-image: var(--icon-arrow-left-svg);
  }
  .icon.arrow-left-circle {
    -webkit-mask-image: var(--icon-arrow-left-circle-svg);
    mask-image: var(--icon-arrow-left-circle-svg);
  }
  .icon.arrow-right {
    -webkit-mask-image: var(--icon-arrow-right-svg);
    mask-image: var(--icon-arrow-right-svg);
  }
  .icon.arrow-right-circle {
    -webkit-mask-image: var(--icon-arrow-right-circle-svg);
    mask-image: var(--icon-arrow-right-circle-svg);
  }
  .icon.arrow-up {
    -webkit-mask-image: var(--icon-arrow-up-svg);
    mask-image: var(--icon-arrow-up-svg);
  }
  .icon.arrow-up-circle {
    -webkit-mask-image: var(--icon-arrow-up-circle-svg);
    mask-image: var(--icon-arrow-up-circle-svg);
  }
  .icon.arrow-up-left {
    -webkit-mask-image: var(--icon-arrow-up-left-svg);
    mask-image: var(--icon-arrow-up-left-svg);
  }
  .icon.arrow-up-right {
    -webkit-mask-image: var(--icon-arrow-up-right-svg);
    mask-image: var(--icon-arrow-up-right-svg);
  }
  .icon.at-sign {
    -webkit-mask-image: var(--icon-at-sign-svg);
    mask-image: var(--icon-at-sign-svg);
  }
  .icon.award {
    -webkit-mask-image: var(--icon-award-svg);
    mask-image: var(--icon-award-svg);
  }
  .icon.bar-chart {
    -webkit-mask-image: var(--icon-bar-chart-svg);
    mask-image: var(--icon-bar-chart-svg);
  }
  .icon.bar-chart-2 {
    -webkit-mask-image: var(--icon-bar-chart-2-svg);
    mask-image: var(--icon-bar-chart-2-svg);
  }
  .icon.battery {
    -webkit-mask-image: var(--icon-battery-svg);
    mask-image: var(--icon-battery-svg);
  }
  .icon.battery-charging {
    -webkit-mask-image: var(--icon-battery-charging-svg);
    mask-image: var(--icon-battery-charging-svg);
  }
  .icon.bell {
    -webkit-mask-image: var(--icon-bell-svg);
    mask-image: var(--icon-bell-svg);
  }
  .icon.bell-off {
    -webkit-mask-image: var(--icon-bell-off-svg);
    mask-image: var(--icon-bell-off-svg);
  }
  .icon.bluetooth {
    -webkit-mask-image: var(--icon-bluetooth-svg);
    mask-image: var(--icon-bluetooth-svg);
  }
  .icon.bold {
    -webkit-mask-image: var(--icon-bold-svg);
    mask-image: var(--icon-bold-svg);
  }
  .icon.book {
    -webkit-mask-image: var(--icon-book-svg);
    mask-image: var(--icon-book-svg);
  }
  .icon.book-open {
    -webkit-mask-image: var(--icon-book-open-svg);
    mask-image: var(--icon-book-open-svg);
  }
  .icon.bookmark {
    -webkit-mask-image: var(--icon-bookmark-svg);
    mask-image: var(--icon-bookmark-svg);
  }
  .icon.box {
    -webkit-mask-image: var(--icon-box-svg);
    mask-image: var(--icon-box-svg);
  }
  .icon.briefcase {
    -webkit-mask-image: var(--icon-briefcase-svg);
    mask-image: var(--icon-briefcase-svg);
  }
  .icon.calendar {
    -webkit-mask-image: var(--icon-calendar-svg);
    mask-image: var(--icon-calendar-svg);
  }
  .icon.camera {
    -webkit-mask-image: var(--icon-camera-svg);
    mask-image: var(--icon-camera-svg);
  }
  .icon.camera-off {
    -webkit-mask-image: var(--icon-camera-off-svg);
    mask-image: var(--icon-camera-off-svg);
  }
  .icon.cast {
    -webkit-mask-image: var(--icon-cast-svg);
    mask-image: var(--icon-cast-svg);
  }
  .icon.check {
    -webkit-mask-image: var(--icon-check-svg);
    mask-image: var(--icon-check-svg);
  }
  .icon.check-circle {
    -webkit-mask-image: var(--icon-check-circle-svg);
    mask-image: var(--icon-check-circle-svg);
  }
  .icon.check-square {
    -webkit-mask-image: var(--icon-check-square-svg);
    mask-image: var(--icon-check-square-svg);
  }
  .icon.chevron-down {
    -webkit-mask-image: var(--icon-chevron-down-svg);
    mask-image: var(--icon-chevron-down-svg);
  }
  .icon.chevron-left {
    -webkit-mask-image: var(--icon-chevron-left-svg);
    mask-image: var(--icon-chevron-left-svg);
  }
  .icon.chevron-right {
    -webkit-mask-image: var(--icon-chevron-right-svg);
    mask-image: var(--icon-chevron-right-svg);
  }
  .icon.chevron-up {
    -webkit-mask-image: var(--icon-chevron-up-svg);
    mask-image: var(--icon-chevron-up-svg);
  }
  .icon.chevrons-down {
    -webkit-mask-image: var(--icon-chevrons-down-svg);
    mask-image: var(--icon-chevrons-down-svg);
  }
  .icon.chevrons-left {
    -webkit-mask-image: var(--icon-chevrons-left-svg);
    mask-image: var(--icon-chevrons-left-svg);
  }
  .icon.chevrons-right {
    -webkit-mask-image: var(--icon-chevrons-right-svg);
    mask-image: var(--icon-chevrons-right-svg);
  }
  .icon.chevrons-up {
    -webkit-mask-image: var(--icon-chevrons-up-svg);
    mask-image: var(--icon-chevrons-up-svg);
  }
  .icon.chrome {
    -webkit-mask-image: var(--icon-chrome-svg);
    mask-image: var(--icon-chrome-svg);
  }
  .icon.circle {
    -webkit-mask-image: var(--icon-circle-svg);
    mask-image: var(--icon-circle-svg);
  }
  .icon.clipboard {
    -webkit-mask-image: var(--icon-clipboard-svg);
    mask-image: var(--icon-clipboard-svg);
  }
  .icon.clock {
    -webkit-mask-image: var(--icon-clock-svg);
    mask-image: var(--icon-clock-svg);
  }
  .icon.cloud {
    -webkit-mask-image: var(--icon-cloud-svg);
    mask-image: var(--icon-cloud-svg);
  }
  .icon.cloud-drizzle {
    -webkit-mask-image: var(--icon-cloud-drizzle-svg);
    mask-image: var(--icon-cloud-drizzle-svg);
  }
  .icon.cloud-lightning {
    -webkit-mask-image: var(--icon-cloud-lightning-svg);
    mask-image: var(--icon-cloud-lightning-svg);
  }
  .icon.cloud-off {
    -webkit-mask-image: var(--icon-cloud-off-svg);
    mask-image: var(--icon-cloud-off-svg);
  }
  .icon.cloud-rain {
    -webkit-mask-image: var(--icon-cloud-rain-svg);
    mask-image: var(--icon-cloud-rain-svg);
  }
  .icon.cloud-snow {
    -webkit-mask-image: var(--icon-cloud-snow-svg);
    mask-image: var(--icon-cloud-snow-svg);
  }
  .icon.code {
    -webkit-mask-image: var(--icon-code-svg);
    mask-image: var(--icon-code-svg);
  }
  .icon.codepen {
    -webkit-mask-image: var(--icon-codepen-svg);
    mask-image: var(--icon-codepen-svg);
  }
  .icon.codesandbox {
    -webkit-mask-image: var(--icon-codesandbox-svg);
    mask-image: var(--icon-codesandbox-svg);
  }
  .icon.coffee {
    -webkit-mask-image: var(--icon-coffee-svg);
    mask-image: var(--icon-coffee-svg);
  }
  .icon.columns {
    -webkit-mask-image: var(--icon-columns-svg);
    mask-image: var(--icon-columns-svg);
  }
  .icon.command {
    -webkit-mask-image: var(--icon-command-svg);
    mask-image: var(--icon-command-svg);
  }
  .icon.compass {
    -webkit-mask-image: var(--icon-compass-svg);
    mask-image: var(--icon-compass-svg);
  }
  .icon.copy {
    -webkit-mask-image: var(--icon-copy-svg);
    mask-image: var(--icon-copy-svg);
  }
  .icon.corner-down-left {
    -webkit-mask-image: var(--icon-corner-down-left-svg);
    mask-image: var(--icon-corner-down-left-svg);
  }
  .icon.corner-down-right {
    -webkit-mask-image: var(--icon-corner-down-right-svg);
    mask-image: var(--icon-corner-down-right-svg);
  }
  .icon.corner-left-down {
    -webkit-mask-image: var(--icon-corner-left-down-svg);
    mask-image: var(--icon-corner-left-down-svg);
  }
  .icon.corner-left-up {
    -webkit-mask-image: var(--icon-corner-left-up-svg);
    mask-image: var(--icon-corner-left-up-svg);
  }
  .icon.corner-right-down {
    -webkit-mask-image: var(--icon-corner-right-down-svg);
    mask-image: var(--icon-corner-right-down-svg);
  }
  .icon.corner-right-up {
    -webkit-mask-image: var(--icon-corner-right-up-svg);
    mask-image: var(--icon-corner-right-up-svg);
  }
  .icon.corner-up-left {
    -webkit-mask-image: var(--icon-corner-up-left-svg);
    mask-image: var(--icon-corner-up-left-svg);
  }
  .icon.corner-up-right {
    -webkit-mask-image: var(--icon-corner-up-right-svg);
    mask-image: var(--icon-corner-up-right-svg);
  }
  .icon.cpu {
    -webkit-mask-image: var(--icon-cpu-svg);
    mask-image: var(--icon-cpu-svg);
  }
  .icon.credit-card {
    -webkit-mask-image: var(--icon-credit-card-svg);
    mask-image: var(--icon-credit-card-svg);
  }
  .icon.crop {
    -webkit-mask-image: var(--icon-crop-svg);
    mask-image: var(--icon-crop-svg);
  }
  .icon.crosshair {
    -webkit-mask-image: var(--icon-crosshair-svg);
    mask-image: var(--icon-crosshair-svg);
  }
  .icon.database {
    -webkit-mask-image: var(--icon-database-svg);
    mask-image: var(--icon-database-svg);
  }
  .icon.delete {
    -webkit-mask-image: var(--icon-delete-svg);
    mask-image: var(--icon-delete-svg);
  }
  .icon.disc {
    -webkit-mask-image: var(--icon-disc-svg);
    mask-image: var(--icon-disc-svg);
  }
  .icon.divide {
    -webkit-mask-image: var(--icon-divide-svg);
    mask-image: var(--icon-divide-svg);
  }
  .icon.divide-circle {
    -webkit-mask-image: var(--icon-divide-circle-svg);
    mask-image: var(--icon-divide-circle-svg);
  }
  .icon.divide-square {
    -webkit-mask-image: var(--icon-divide-square-svg);
    mask-image: var(--icon-divide-square-svg);
  }
  .icon.dollar-sign {
    -webkit-mask-image: var(--icon-dollar-sign-svg);
    mask-image: var(--icon-dollar-sign-svg);
  }
  .icon.download {
    -webkit-mask-image: var(--icon-download-svg);
    mask-image: var(--icon-download-svg);
  }
  .icon.download-cloud {
    -webkit-mask-image: var(--icon-download-cloud-svg);
    mask-image: var(--icon-download-cloud-svg);
  }
  .icon.dribbble {
    -webkit-mask-image: var(--icon-dribbble-svg);
    mask-image: var(--icon-dribbble-svg);
  }
  .icon.droplet {
    -webkit-mask-image: var(--icon-droplet-svg);
    mask-image: var(--icon-droplet-svg);
  }
  .icon.edit {
    -webkit-mask-image: var(--icon-edit-svg);
    mask-image: var(--icon-edit-svg);
  }
  .icon.edit-2 {
    -webkit-mask-image: var(--icon-edit-2-svg);
    mask-image: var(--icon-edit-2-svg);
  }
  .icon.edit-3 {
    -webkit-mask-image: var(--icon-edit-3-svg);
    mask-image: var(--icon-edit-3-svg);
  }
  .icon.external-link {
    -webkit-mask-image: var(--icon-external-link-svg);
    mask-image: var(--icon-external-link-svg);
  }
  .icon.eye {
    -webkit-mask-image: var(--icon-eye-svg);
    mask-image: var(--icon-eye-svg);
  }
  .icon.eye-off {
    -webkit-mask-image: var(--icon-eye-off-svg);
    mask-image: var(--icon-eye-off-svg);
  }
  .icon.facebook {
    -webkit-mask-image: var(--icon-facebook-svg);
    mask-image: var(--icon-facebook-svg);
  }
  .icon.fast-forward {
    -webkit-mask-image: var(--icon-fast-forward-svg);
    mask-image: var(--icon-fast-forward-svg);
  }
  .icon.feather {
    -webkit-mask-image: var(--icon-feather-svg);
    mask-image: var(--icon-feather-svg);
  }
  .icon.figma {
    -webkit-mask-image: var(--icon-figma-svg);
    mask-image: var(--icon-figma-svg);
  }
  .icon.file {
    -webkit-mask-image: var(--icon-file-svg);
    mask-image: var(--icon-file-svg);
  }
  .icon.file-minus {
    -webkit-mask-image: var(--icon-file-minus-svg);
    mask-image: var(--icon-file-minus-svg);
  }
  .icon.file-plus {
    -webkit-mask-image: var(--icon-file-plus-svg);
    mask-image: var(--icon-file-plus-svg);
  }
  .icon.file-text {
    -webkit-mask-image: var(--icon-file-text-svg);
    mask-image: var(--icon-file-text-svg);
  }
  .icon.film {
    -webkit-mask-image: var(--icon-film-svg);
    mask-image: var(--icon-film-svg);
  }
  .icon.filter {
    -webkit-mask-image: var(--icon-filter-svg);
    mask-image: var(--icon-filter-svg);
  }
  .icon.flag {
    -webkit-mask-image: var(--icon-flag-svg);
    mask-image: var(--icon-flag-svg);
  }
  .icon.folder {
    -webkit-mask-image: var(--icon-folder-svg);
    mask-image: var(--icon-folder-svg);
  }
  .icon.folder-minus {
    -webkit-mask-image: var(--icon-folder-minus-svg);
    mask-image: var(--icon-folder-minus-svg);
  }
  .icon.folder-plus {
    -webkit-mask-image: var(--icon-folder-plus-svg);
    mask-image: var(--icon-folder-plus-svg);
  }
  .icon.framer {
    -webkit-mask-image: var(--icon-framer-svg);
    mask-image: var(--icon-framer-svg);
  }
  .icon.frown {
    -webkit-mask-image: var(--icon-frown-svg);
    mask-image: var(--icon-frown-svg);
  }
  .icon.gitlab {
    -webkit-mask-image: var(--icon-gitlab-svg);
    mask-image: var(--icon-gitlab-svg);
  }
  .icon.globe {
    -webkit-mask-image: var(--icon-globe-svg);
    mask-image: var(--icon-globe-svg);
  }
  .icon.grid {
    -webkit-mask-image: var(--icon-grid-svg);
    mask-image: var(--icon-grid-svg);
  }
  .icon.hard-drive {
    -webkit-mask-image: var(--icon-hard-drive-svg);
    mask-image: var(--icon-hard-drive-svg);
  }
  .icon.hash {
    -webkit-mask-image: var(--icon-hash-svg);
    mask-image: var(--icon-hash-svg);
  }
  .icon.headphones {
    -webkit-mask-image: var(--icon-headphones-svg);
    mask-image: var(--icon-headphones-svg);
  }
  .icon.heart {
    -webkit-mask-image: var(--icon-heart-svg);
    mask-image: var(--icon-heart-svg);
  }
  .icon.help-circle {
    -webkit-mask-image: var(--icon-help-circle-svg);
    mask-image: var(--icon-help-circle-svg);
  }
  .icon.hexagon {
    -webkit-mask-image: var(--icon-hexagon-svg);
    mask-image: var(--icon-hexagon-svg);
  }
  .icon.home {
    -webkit-mask-image: var(--icon-home-svg);
    mask-image: var(--icon-home-svg);
  }
  .icon.image {
    -webkit-mask-image: var(--icon-image-svg);
    mask-image: var(--icon-image-svg);
  }
  .icon.inbox {
    -webkit-mask-image: var(--icon-inbox-svg);
    mask-image: var(--icon-inbox-svg);
  }
  .icon.info {
    -webkit-mask-image: var(--icon-info-svg);
    mask-image: var(--icon-info-svg);
  }
  .icon.instagram {
    -webkit-mask-image: var(--icon-instagram-svg);
    mask-image: var(--icon-instagram-svg);
  }
  .icon.italic {
    -webkit-mask-image: var(--icon-italic-svg);
    mask-image: var(--icon-italic-svg);
  }
  .icon.key {
    -webkit-mask-image: var(--icon-key-svg);
    mask-image: var(--icon-key-svg);
  }
  .icon.layers {
    -webkit-mask-image: var(--icon-layers-svg);
    mask-image: var(--icon-layers-svg);
  }
  .icon.layout {
    -webkit-mask-image: var(--icon-layout-svg);
    mask-image: var(--icon-layout-svg);
  }
  .icon.life-buoy {
    -webkit-mask-image: var(--icon-life-buoy-svg);
    mask-image: var(--icon-life-buoy-svg);
  }
  .icon.linkify {
    -webkit-mask-image: var(--icon-linkify-svg);
    mask-image: var(--icon-linkify-svg);
  }
  .icon.linkify-2 {
    -webkit-mask-image: var(--icon-linkify-2-svg);
    mask-image: var(--icon-linkify-2-svg);
  }
  .icon.linkedin {
    -webkit-mask-image: var(--icon-linkedin-svg);
    mask-image: var(--icon-linkedin-svg);
  }
  .icon.list {
    -webkit-mask-image: var(--icon-list-svg);
    mask-image: var(--icon-list-svg);
  }
  .icon.loader {
    -webkit-mask-image: var(--icon-loader-svg);
    mask-image: var(--icon-loader-svg);
  }
  .icon.lock {
    -webkit-mask-image: var(--icon-lock-svg);
    mask-image: var(--icon-lock-svg);
  }
  .icon.log-in {
    -webkit-mask-image: var(--icon-log-in-svg);
    mask-image: var(--icon-log-in-svg);
  }
  .icon.log-out {
    -webkit-mask-image: var(--icon-log-out-svg);
    mask-image: var(--icon-log-out-svg);
  }
  .icon.mail {
    -webkit-mask-image: var(--icon-mail-svg);
    mask-image: var(--icon-mail-svg);
  }
  .icon.map {
    -webkit-mask-image: var(--icon-map-svg);
    mask-image: var(--icon-map-svg);
  }
  .icon.map-pin {
    -webkit-mask-image: var(--icon-map-pin-svg);
    mask-image: var(--icon-map-pin-svg);
  }
  .icon.maximize {
    -webkit-mask-image: var(--icon-maximize-svg);
    mask-image: var(--icon-maximize-svg);
  }
  .icon.maximize-2 {
    -webkit-mask-image: var(--icon-maximize-2-svg);
    mask-image: var(--icon-maximize-2-svg);
  }
  .icon.meh {
    -webkit-mask-image: var(--icon-meh-svg);
    mask-image: var(--icon-meh-svg);
  }
  .icon.menu {
    -webkit-mask-image: var(--icon-menu-svg);
    mask-image: var(--icon-menu-svg);
  }
  .icon.message-circle {
    -webkit-mask-image: var(--icon-message-circle-svg);
    mask-image: var(--icon-message-circle-svg);
  }
  .icon.message-square {
    -webkit-mask-image: var(--icon-message-square-svg);
    mask-image: var(--icon-message-square-svg);
  }
  .icon.mic {
    -webkit-mask-image: var(--icon-mic-svg);
    mask-image: var(--icon-mic-svg);
  }
  .icon.mic-off {
    -webkit-mask-image: var(--icon-mic-off-svg);
    mask-image: var(--icon-mic-off-svg);
  }
  .icon.minimize {
    -webkit-mask-image: var(--icon-minimize-svg);
    mask-image: var(--icon-minimize-svg);
  }
  .icon.minimize-2 {
    -webkit-mask-image: var(--icon-minimize-2-svg);
    mask-image: var(--icon-minimize-2-svg);
  }
  .icon.minus {
    -webkit-mask-image: var(--icon-minus-svg);
    mask-image: var(--icon-minus-svg);
  }
  .icon.minus-circle {
    -webkit-mask-image: var(--icon-minus-circle-svg);
    mask-image: var(--icon-minus-circle-svg);
  }
  .icon.minus-square {
    -webkit-mask-image: var(--icon-minus-square-svg);
    mask-image: var(--icon-minus-square-svg);
  }
  .icon.monitor {
    -webkit-mask-image: var(--icon-monitor-svg);
    mask-image: var(--icon-monitor-svg);
  }
  .icon.moon {
    -webkit-mask-image: var(--icon-moon-svg);
    mask-image: var(--icon-moon-svg);
  }
  .icon.more-horizontal {
    -webkit-mask-image: var(--icon-more-horizontal-svg);
    mask-image: var(--icon-more-horizontal-svg);
  }
  .icon.more-vertical {
    -webkit-mask-image: var(--icon-more-vertical-svg);
    mask-image: var(--icon-more-vertical-svg);
  }
  .icon.mouse-pointer {
    -webkit-mask-image: var(--icon-mouse-pointer-svg);
    mask-image: var(--icon-mouse-pointer-svg);
  }
  .icon.move {
    -webkit-mask-image: var(--icon-move-svg);
    mask-image: var(--icon-move-svg);
  }
  .icon.music {
    -webkit-mask-image: var(--icon-music-svg);
    mask-image: var(--icon-music-svg);
  }
  .icon.navigation {
    -webkit-mask-image: var(--icon-navigation-svg);
    mask-image: var(--icon-navigation-svg);
  }
  .icon.navigation-2 {
    -webkit-mask-image: var(--icon-navigation-2-svg);
    mask-image: var(--icon-navigation-2-svg);
  }
  .icon.octagon {
    -webkit-mask-image: var(--icon-octagon-svg);
    mask-image: var(--icon-octagon-svg);
  }
  .icon.package {
    -webkit-mask-image: var(--icon-package-svg);
    mask-image: var(--icon-package-svg);
  }
  .icon.paperclip {
    -webkit-mask-image: var(--icon-paperclip-svg);
    mask-image: var(--icon-paperclip-svg);
  }
  .icon.pause {
    -webkit-mask-image: var(--icon-pause-svg);
    mask-image: var(--icon-pause-svg);
  }
  .icon.pause-circle {
    -webkit-mask-image: var(--icon-pause-circle-svg);
    mask-image: var(--icon-pause-circle-svg);
  }
  .icon.pen-tool {
    -webkit-mask-image: var(--icon-pen-tool-svg);
    mask-image: var(--icon-pen-tool-svg);
  }
  .icon.percent {
    -webkit-mask-image: var(--icon-percent-svg);
    mask-image: var(--icon-percent-svg);
  }
  .icon.phone {
    -webkit-mask-image: var(--icon-phone-svg);
    mask-image: var(--icon-phone-svg);
  }
  .icon.phone-call {
    -webkit-mask-image: var(--icon-phone-call-svg);
    mask-image: var(--icon-phone-call-svg);
  }
  .icon.phone-forwarded {
    -webkit-mask-image: var(--icon-phone-forwarded-svg);
    mask-image: var(--icon-phone-forwarded-svg);
  }
  .icon.phone-incoming {
    -webkit-mask-image: var(--icon-phone-incoming-svg);
    mask-image: var(--icon-phone-incoming-svg);
  }
  .icon.phone-missed {
    -webkit-mask-image: var(--icon-phone-missed-svg);
    mask-image: var(--icon-phone-missed-svg);
  }
  .icon.phone-off {
    -webkit-mask-image: var(--icon-phone-off-svg);
    mask-image: var(--icon-phone-off-svg);
  }
  .icon.phone-outgoing {
    -webkit-mask-image: var(--icon-phone-outgoing-svg);
    mask-image: var(--icon-phone-outgoing-svg);
  }
  .icon.pie-chart {
    -webkit-mask-image: var(--icon-pie-chart-svg);
    mask-image: var(--icon-pie-chart-svg);
  }
  .icon.play {
    -webkit-mask-image: var(--icon-play-svg);
    mask-image: var(--icon-play-svg);
  }
  .icon.play-circle {
    -webkit-mask-image: var(--icon-play-circle-svg);
    mask-image: var(--icon-play-circle-svg);
  }
  .icon.plus {
    -webkit-mask-image: var(--icon-plus-svg);
    mask-image: var(--icon-plus-svg);
  }
  .icon.plus-circle {
    -webkit-mask-image: var(--icon-plus-circle-svg);
    mask-image: var(--icon-plus-circle-svg);
  }
  .icon.plus-square {
    -webkit-mask-image: var(--icon-plus-square-svg);
    mask-image: var(--icon-plus-square-svg);
  }
  .icon.pocket {
    -webkit-mask-image: var(--icon-pocket-svg);
    mask-image: var(--icon-pocket-svg);
  }
  .icon.power {
    -webkit-mask-image: var(--icon-power-svg);
    mask-image: var(--icon-power-svg);
  }
  .icon.printer {
    -webkit-mask-image: var(--icon-printer-svg);
    mask-image: var(--icon-printer-svg);
  }
  .icon.radio {
    -webkit-mask-image: var(--icon-radio-svg);
    mask-image: var(--icon-radio-svg);
  }
  .icon.refresh-ccw {
    -webkit-mask-image: var(--icon-refresh-ccw-svg);
    mask-image: var(--icon-refresh-ccw-svg);
  }
  .icon.refresh-cw {
    -webkit-mask-image: var(--icon-refresh-cw-svg);
    mask-image: var(--icon-refresh-cw-svg);
  }
  .icon.repeat {
    -webkit-mask-image: var(--icon-repeat-svg);
    mask-image: var(--icon-repeat-svg);
  }
  .icon.rewind {
    -webkit-mask-image: var(--icon-rewind-svg);
    mask-image: var(--icon-rewind-svg);
  }
  .icon.rotate-ccw {
    -webkit-mask-image: var(--icon-rotate-ccw-svg);
    mask-image: var(--icon-rotate-ccw-svg);
  }
  .icon.rotate-cw {
    -webkit-mask-image: var(--icon-rotate-cw-svg);
    mask-image: var(--icon-rotate-cw-svg);
  }
  .icon.rss {
    -webkit-mask-image: var(--icon-rss-svg);
    mask-image: var(--icon-rss-svg);
  }
  .icon.save {
    -webkit-mask-image: var(--icon-save-svg);
    mask-image: var(--icon-save-svg);
  }
  .icon.scissors {
    -webkit-mask-image: var(--icon-scissors-svg);
    mask-image: var(--icon-scissors-svg);
  }
  .icon.search {
    -webkit-mask-image: var(--icon-search-svg);
    mask-image: var(--icon-search-svg);
  }
  .icon.send {
    -webkit-mask-image: var(--icon-send-svg);
    mask-image: var(--icon-send-svg);
  }
  .icon.server {
    -webkit-mask-image: var(--icon-server-svg);
    mask-image: var(--icon-server-svg);
  }
  .icon.settings {
    -webkit-mask-image: var(--icon-settings-svg);
    mask-image: var(--icon-settings-svg);
  }
  .icon.share {
    -webkit-mask-image: var(--icon-share-svg);
    mask-image: var(--icon-share-svg);
  }
  .icon.share-2 {
    -webkit-mask-image: var(--icon-share-2-svg);
    mask-image: var(--icon-share-2-svg);
  }
  .icon.shield {
    -webkit-mask-image: var(--icon-shield-svg);
    mask-image: var(--icon-shield-svg);
  }
  .icon.shield-off {
    -webkit-mask-image: var(--icon-shield-off-svg);
    mask-image: var(--icon-shield-off-svg);
  }
  .icon.shopping-bag {
    -webkit-mask-image: var(--icon-shopping-bag-svg);
    mask-image: var(--icon-shopping-bag-svg);
  }
  .icon.shopping-cart {
    -webkit-mask-image: var(--icon-shopping-cart-svg);
    mask-image: var(--icon-shopping-cart-svg);
  }
  .icon.shuffle {
    -webkit-mask-image: var(--icon-shuffle-svg);
    mask-image: var(--icon-shuffle-svg);
  }
  .icon.sidebar {
    -webkit-mask-image: var(--icon-sidebar-svg);
    mask-image: var(--icon-sidebar-svg);
  }
  .icon.skip-back {
    -webkit-mask-image: var(--icon-skip-back-svg);
    mask-image: var(--icon-skip-back-svg);
  }
  .icon.skip-forward {
    -webkit-mask-image: var(--icon-skip-forward-svg);
    mask-image: var(--icon-skip-forward-svg);
  }
  .icon.slack {
    -webkit-mask-image: var(--icon-slack-svg);
    mask-image: var(--icon-slack-svg);
  }
  .icon.slash {
    -webkit-mask-image: var(--icon-slash-svg);
    mask-image: var(--icon-slash-svg);
  }
  .icon.sliders {
    -webkit-mask-image: var(--icon-sliders-svg);
    mask-image: var(--icon-sliders-svg);
  }
  .icon.smartphone {
    -webkit-mask-image: var(--icon-smartphone-svg);
    mask-image: var(--icon-smartphone-svg);
  }
  .icon.smile {
    -webkit-mask-image: var(--icon-smile-svg);
    mask-image: var(--icon-smile-svg);
  }
  .icon.speaker {
    -webkit-mask-image: var(--icon-speaker-svg);
    mask-image: var(--icon-speaker-svg);
  }
  .icon.square {
    -webkit-mask-image: var(--icon-square-svg);
    mask-image: var(--icon-square-svg);
  }
  .icon.star {
    -webkit-mask-image: var(--icon-star-svg);
    mask-image: var(--icon-star-svg);
  }
  .icon.stop-circle {
    -webkit-mask-image: var(--icon-stop-circle-svg);
    mask-image: var(--icon-stop-circle-svg);
  }
  .icon.sun {
    -webkit-mask-image: var(--icon-sun-svg);
    mask-image: var(--icon-sun-svg);
  }
  .icon.sunrise {
    -webkit-mask-image: var(--icon-sunrise-svg);
    mask-image: var(--icon-sunrise-svg);
  }
  .icon.sunset {
    -webkit-mask-image: var(--icon-sunset-svg);
    mask-image: var(--icon-sunset-svg);
  }
  .icon.table {
    -webkit-mask-image: var(--icon-table-svg);
    mask-image: var(--icon-table-svg);
  }
  .icon.tablet {
    -webkit-mask-image: var(--icon-tablet-svg);
    mask-image: var(--icon-tablet-svg);
  }
  .icon.tag {
    -webkit-mask-image: var(--icon-tag-svg);
    mask-image: var(--icon-tag-svg);
  }
  .icon.target {
    -webkit-mask-image: var(--icon-target-svg);
    mask-image: var(--icon-target-svg);
  }
  .icon.terminal {
    -webkit-mask-image: var(--icon-terminal-svg);
    mask-image: var(--icon-terminal-svg);
  }
  .icon.thermometer {
    -webkit-mask-image: var(--icon-thermometer-svg);
    mask-image: var(--icon-thermometer-svg);
  }
  .icon.thumbs-down {
    -webkit-mask-image: var(--icon-thumbs-down-svg);
    mask-image: var(--icon-thumbs-down-svg);
  }
  .icon.thumbs-up {
    -webkit-mask-image: var(--icon-thumbs-up-svg);
    mask-image: var(--icon-thumbs-up-svg);
  }
  .icon.toggle-left {
    -webkit-mask-image: var(--icon-toggle-left-svg);
    mask-image: var(--icon-toggle-left-svg);
  }
  .icon.toggle-right {
    -webkit-mask-image: var(--icon-toggle-right-svg);
    mask-image: var(--icon-toggle-right-svg);
  }
  .icon.tool {
    -webkit-mask-image: var(--icon-tool-svg);
    mask-image: var(--icon-tool-svg);
  }
  .icon.trash {
    -webkit-mask-image: var(--icon-trash-svg);
    mask-image: var(--icon-trash-svg);
  }
  .icon.trash-2 {
    -webkit-mask-image: var(--icon-trash-2-svg);
    mask-image: var(--icon-trash-2-svg);
  }
  .icon.trello {
    -webkit-mask-image: var(--icon-trello-svg);
    mask-image: var(--icon-trello-svg);
  }
  .icon.trending-down {
    -webkit-mask-image: var(--icon-trending-down-svg);
    mask-image: var(--icon-trending-down-svg);
  }
  .icon.trending-up {
    -webkit-mask-image: var(--icon-trending-up-svg);
    mask-image: var(--icon-trending-up-svg);
  }
  .icon.triangle {
    -webkit-mask-image: var(--icon-triangle-svg);
    mask-image: var(--icon-triangle-svg);
  }
  .icon.truck {
    -webkit-mask-image: var(--icon-truck-svg);
    mask-image: var(--icon-truck-svg);
  }
  .icon.tv {
    -webkit-mask-image: var(--icon-tv-svg);
    mask-image: var(--icon-tv-svg);
  }
  .icon.twitch {
    -webkit-mask-image: var(--icon-twitch-svg);
    mask-image: var(--icon-twitch-svg);
  }
  .icon.twitter {
    -webkit-mask-image: var(--icon-twitter-svg);
    mask-image: var(--icon-twitter-svg);
  }
  .icon.type {
    -webkit-mask-image: var(--icon-type-svg);
    mask-image: var(--icon-type-svg);
  }
  .icon.umbrella {
    -webkit-mask-image: var(--icon-umbrella-svg);
    mask-image: var(--icon-umbrella-svg);
  }
  .icon.underline {
    -webkit-mask-image: var(--icon-underline-svg);
    mask-image: var(--icon-underline-svg);
  }
  .icon.unlock {
    -webkit-mask-image: var(--icon-unlock-svg);
    mask-image: var(--icon-unlock-svg);
  }
  .icon.upload {
    -webkit-mask-image: var(--icon-upload-svg);
    mask-image: var(--icon-upload-svg);
  }
  .icon.upload-cloud {
    -webkit-mask-image: var(--icon-upload-cloud-svg);
    mask-image: var(--icon-upload-cloud-svg);
  }
  .icon.user {
    -webkit-mask-image: var(--icon-user-svg);
    mask-image: var(--icon-user-svg);
  }
  .icon.user-check {
    -webkit-mask-image: var(--icon-user-check-svg);
    mask-image: var(--icon-user-check-svg);
  }
  .icon.user-minus {
    -webkit-mask-image: var(--icon-user-minus-svg);
    mask-image: var(--icon-user-minus-svg);
  }
  .icon.user-plus {
    -webkit-mask-image: var(--icon-user-plus-svg);
    mask-image: var(--icon-user-plus-svg);
  }
  .icon.user-x {
    -webkit-mask-image: var(--icon-user-x-svg);
    mask-image: var(--icon-user-x-svg);
  }
  .icon.users {
    -webkit-mask-image: var(--icon-users-svg);
    mask-image: var(--icon-users-svg);
  }
  .icon.video {
    -webkit-mask-image: var(--icon-video-svg);
    mask-image: var(--icon-video-svg);
  }
  .icon.video-off {
    -webkit-mask-image: var(--icon-video-off-svg);
    mask-image: var(--icon-video-off-svg);
  }
  .icon.voicemail {
    -webkit-mask-image: var(--icon-voicemail-svg);
    mask-image: var(--icon-voicemail-svg);
  }
  .icon.volume {
    -webkit-mask-image: var(--icon-volume-svg);
    mask-image: var(--icon-volume-svg);
  }
  .icon.volume-1 {
    -webkit-mask-image: var(--icon-volume-1-svg);
    mask-image: var(--icon-volume-1-svg);
  }
  .icon.volume-2 {
    -webkit-mask-image: var(--icon-volume-2-svg);
    mask-image: var(--icon-volume-2-svg);
  }
  .icon.volume-x {
    -webkit-mask-image: var(--icon-volume-x-svg);
    mask-image: var(--icon-volume-x-svg);
  }
  .icon.watch {
    -webkit-mask-image: var(--icon-watch-svg);
    mask-image: var(--icon-watch-svg);
  }
  .icon.wifi {
    -webkit-mask-image: var(--icon-wifi-svg);
    mask-image: var(--icon-wifi-svg);
  }
  .icon.wifi-off {
    -webkit-mask-image: var(--icon-wifi-off-svg);
    mask-image: var(--icon-wifi-off-svg);
  }
  .icon.wind {
    -webkit-mask-image: var(--icon-wind-svg);
    mask-image: var(--icon-wind-svg);
  }
  .icon.x {
    -webkit-mask-image: var(--icon-x-svg);
    mask-image: var(--icon-x-svg);
  }
  .icon.x-circle {
    -webkit-mask-image: var(--icon-x-circle-svg);
    mask-image: var(--icon-x-circle-svg);
  }
  .icon.x-octagon {
    -webkit-mask-image: var(--icon-x-octagon-svg);
    mask-image: var(--icon-x-octagon-svg);
  }
  .icon.x-square {
    -webkit-mask-image: var(--icon-x-square-svg);
    mask-image: var(--icon-x-square-svg);
  }
  .icon.youtube {
    -webkit-mask-image: var(--icon-youtube-svg);
    mask-image: var(--icon-youtube-svg);
  }
  .icon.zap {
    -webkit-mask-image: var(--icon-zap-svg);
    mask-image: var(--icon-zap-svg);
  }
  .icon.zap-off {
    -webkit-mask-image: var(--icon-zap-off-svg);
    mask-image: var(--icon-zap-off-svg);
  }
  .icon.zoom-in {
    -webkit-mask-image: var(--icon-zoom-in-svg);
    mask-image: var(--icon-zoom-in-svg);
  }
  .icon.zoom-out {
    -webkit-mask-image: var(--icon-zoom-out-svg);
    mask-image: var(--icon-zoom-out-svg);
  }
}

/* src/components/icon/css/shadow/group/icons.css */
@layer component.icon.plural;

/* src/components/icon/css/shadow/states/disabled.css */
@layer component.icon.states.disabled {
  .disabled.icon {
    cursor: default !important;
    opacity: var(--icon-disabled-opacity) !important;
  }
}

/* src/components/icon/css/shadow/states/loading.css */
@layer component.icon.states.loading;

/* src/components/icon/css/shadow/variations/circular.css */
@layer component.icon.variations.circular {
  i.circular.icon {
    border-radius: 500em !important;
    line-height: 1 !important;
    padding: var(--circular-padding) !important;
    box-shadow: var(--circular-shadow);
    width: var(--circular-size) !important;
    height: var(--circular-size) !important;
  }
  i.circular.inverted.icon {
    border: none;
    box-shadow: none;
  }
}

/* src/components/icon/css/shadow/variations/colored.css */
@layer component.icon.variations.colored {
  .red.icon {
    color: var(--icon-red);
  }
  .orange.icon {
    color: var(--icon-orange);
  }
  .yellow.icon {
    color: var(--icon-yellow);
  }
  .olive.icon {
    color: var(--icon-olive);
  }
  .green.icon {
    color: var(--icon-green);
  }
  .teal.icon {
    color: var(--icon-teal);
  }
  .blue.icon {
    color: var(--icon-blue);
  }
  .violet.icon {
    color: var(--icon-violet);
  }
  .purple.icon {
    color: var(--icon-purple);
  }
  .pink.icon {
    color: var(--icon-pink);
  }
  .brown.icon {
    color: var(--icon-brown);
  }
  .grey.icon {
    color: var(--icon-grey);
  }
  .black.icon {
    color: var(--icon-black);
  }
}

/* src/components/icon/css/shadow/variations/fitted.css */
@layer component.icon.variations.fitted {
  :host([fitted]) {
    margin: 0rem;
  }
}

/* src/components/icon/css/shadow/variations/link.css */
@layer component.icon.variations.links {
  .hitbox {
    display: inline-block;
    cursor: pointer;
    box-sizing: border-box;
    margin: calc(var(--icon-hitbox-area) * -1);
    padding: var(--icon-hitbox-area);
    color: var(--icon-link-color);
  }
  .hitbox:hover {
    color: var(--icon-link-hover-color);
  }
  .link.icon,
  .link.icons {
    cursor: pointer;
    opacity: var(--icon-link-opacity);
    color: var(--icon-link-color);
    transition: var(--icon-link-transition);
  }
  .link.icon:hover,
  .link.icons:hover {
    opacity: var(--icon-link-hover-opacity);
    color: var(--icon-link-hover-color);
  }
}

/* src/components/icon/css/shadow/variations/sizing.css */
@layer component.icon.variations.sizing {
  .mini.icons .icon,
  .mini.icon {
    font-size: var(--icon-mini);
  }
  .tiny.icons .icon,
  .tiny.icon {
    font-size: var(--icon-tiny);
  }
  .small.icons .icon,
  .small.icon {
    font-size: var(--icon-small);
  }
  .icons .icon,
  .icon {
  }
  .large.icons .icon,
  .large.icon {
    font-size: var(--icon-large);
  }
  .big.icons .icon,
  .big.icon {
    font-size: var(--icon-big);
  }
  .huge.icons .icon,
  .huge.icon {
    font-size: var(--icon-huge);
  }
  .massive.icons .icon,
  .massive.icon {
    font-size: var(--icon-massive);
  }
}

/* src/components/icon/css/shadow/icon.css */
`;var mn=`{#if either href link}
  <a href={href} class="hitbox">
    {>content}
  </a>
{else}
  {> content}
{/if}

{#snippet content}
  <i class="{ui}icon" part="icon"></i>
{/snippet}
`;var Oa=({self:n,$:t})=>({}),Va=({self:n,el:t})=>{},Ua=function({$:n,isClient:t}){},bn=y({tagName:"ui-icon",componentSpec:Ve,template:mn,css:dn,createComponent:Oa,onCreated:Va,onRendered:Ua});var pn=`/* src/components/menu/css/shadow/content/menu.css */
@layer component.content.menu {
  :host {
    display: block;
    margin: var(--menu-margin);
    padding: var(--menu-padding);
    box-shadow: var(--menu-box-shadow);
    border: var(--menu-border);
    font-size: var(--menu-font-size);
  }
  .menu {
    display: flex;
    flex-direction: row;
    font-weight: var(--menu-font-weight);
    gap: var(--menu-gap);
    background: var(--menu-background);
    align-items: var(--menu-align-items);
    justify-content: var(--menu-justify-content);
  }
}

/* src/components/menu/css/shadow/types/selection.css */
@layer component.types.selection {
  .selection.menu {
    gap: var(--menu-selection-gap);
    --menu-item-padding: var(--menu-selection-item-padding);
    --menu-item-border-radius: var(--menu-selection-item-border-radius);
    --menu-item-color: var(--menu-selection-item-color);
    --menu-item-hover-background: var(--menu-selection-item-hover-background);
    --menu-item-hover-border-radius: var(--menu-selection-item-border-radius);
    --menu-item-hover-color: var(--menu-selection-item-hover-color);
    --menu-item-hover-box-shadow: var(--menu-selection-item-hover-box-shadow);
    --menu-item-active-background: var(--menu-selection-item-active-background);
    --menu-item-active-border-radius: var(--menu-selection-item-border-radius);
    --menu-item-active-padding: var(--menu-selection-item-active-padding);
    --menu-item-active-color: var(--menu-selection-item-active-color);
    --menu-item-active-box-shadow: var(--menu-selection-item-active-box-shadow);
  }
}

/* src/components/menu/css/shadow/variations/evenly-spaced.css */
@layer component.variations.equalWidth {
  .evenly-spaced.menu {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
    --menu-item-text-align: var(--menu-evenly-spaced-item-text-align) ;
  }
}

/* src/components/menu/css/shadow/variations/fitted.css */
@layer component.variations.fitted {
  .fitted.menu {
    margin: 0;
  }
}

/* src/components/menu/css/shadow/variations/inset.css */
@layer component.variations.inset {
  .inset.menu {
    border: var(--menu-inset-border);
    border-radius: var(--menu-inset-border-radius);
    padding: var(--menu-inset-padding);
    background: var(--menu-inset-background);
  }
}

/* src/components/menu/css/shadow/variations/vertical.css */
@layer component.variations.vertical {
  .vertical.menu {
    flex-direction: column;
    align-items: var(--menu-vertical-align-items);
    text-align: var(--menu-vertical-text-align);
  }
}

/* src/components/menu/css/shadow/menu.css */
`;var vn=`<div class="{ui} menu" part="menu">
  {#if items}
    {#each item in items}
      <menu-item
        active={isValueActive value item}
        href={item.href}
        data-value={item.value}
        exportparts="item"
      >
        {item.label}
      </menu-item>
    {/each}
  {/if}
  {>slot}
</div>
`;var Ba=({settings:n,self:t,$:e,dispatchEvent:o})=>({setValue(a){n.value=a,o("change",{value:a})},getValue(a){return a.value||a.href},isValueActive(a,r){return r.active?!0:a!==void 0?a==t.getValue(r):!1},selectIndex(a){let r=e("menu-item").eq(a).attr("data-value");r!==void 0&&t.setValue(r)}}),qa=({settings:n})=>{},ja=function({$:n}){},Wa={"click menu-item"({self:n,data:t}){n.setValue(t.value)}},hn=y({tagName:"ui-menu",componentSpec:Fe,template:vn,css:pn,createComponent:Ba,events:Wa,onCreated:qa,onRendered:ja});var gn=`/*-------------------
      Menu Item
--------------------*/

.item {
  display: block;
  cursor: pointer;
  background: var(--menu-item-background);
  margin: var(--menu-item-margin);
  padding: var(--menu-item-padding);
  border: var(--menu-item-border);
  color: var(--menu-item-color);
  font-weight: var(--menu-item-font-weight);
  line-height: var(--menu-item-line-height);
  box-shadow: var(--menu-item-box-shadow);
  border-radius: var(--menu-item-border-radius);
  text-align: var(--menu-item-text-align);
  text-decoration: var(--menu-item-text-decoration);
}

.item:hover,
.item.hover {
  background: var(--menu-item-hover-background);
  margin: var(--menu-item-hover-margin);
  padding: var(--menu-item-hover-padding);
  border: var(--menu-item-hover-border);
  color: var(--menu-item-hover-color);
  box-shadow: var(--menu-item-hover-box-shadow);
  border-radius: var(--menu-item-hover-border-radius);
}

.active.item {
  cursor: default;
  background: var(--menu-item-active-background);
  margin: var(--menu-item-active-margin);
  padding: var(--menu-item-active-padding);
  border: var(--menu-item-active-border);
  box-shadow: var(--menu-item-active-box-shadow);
  font-weight: var(--menu-item-active-font-weight);
  color: var(--menu-item-active-color);
  border-radius: var(--menu-item-active-border-radius);
}
`;var fn=`{{#snippet content}}
  {{#if icon}}
    <ui-icon icon={{icon}}></ui-icon>
  {{/if}}
  {{>slot}}
{{/snippet}}

{{#if href}}
  <a class="{{ui}} item" href="{{href}}" part="item">
    {{>content}}
  </a>
{{else}}
  <div class="{{ui}} item" part="item">
    {{>content}}
  </div>
{{/if}}
`;var Ka=({data:n})=>{},Xa={"touchstart .menu"({event:n,tpl:t,$:e}){e(this).addClass("pressed")},"touchend .menu"({event:n,tpl:t,$:e}){e(this).removeClass("pressed")}},wn=y({tagName:"menu-item",events:Xa,onCreated:Ka,componentSpec:Be,template:fn,css:gn});var kn=`/* src/components/input/css/shadow/content/input.css */
@layer component.input.content.input {
  * {
    box-sizing: border-box;
  }
  .input {
    cursor: text;
    display: inline-flex;
    position: relative;
    font-style: normal;
    font-weight: var(--input-font-weight);
    font-family: var(--input-font-family);
    line-height: var(--input-line-height);
    color: var(--input-text-color);
    background: var(--input-background);
    border: var(--input-border);
    border-radius: var(--input-border-radius);
    transition: var(--input-transition);
    box-shadow: var(--input-box-shadow);
    gap: var(--input-item-spacing);
    text-align: var(--input-text-align);
    align-items: center;
  }
  .input input {
    width: var(--input-width);
    padding: var(--input-padding);
    background-color: transparent;
    margin: 0em;
    border-radius: inherit;
    outline: none;
    max-width: 100%;
    flex: 1 0 auto;
    text-align: inherit;
    font-size: inherit;
    font-family: inherit;
    color: inherit;
    border: none;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    z-index: var(--page-layer-1);
  }
  .input input::placeholder {
    color: var(--white-10);
  }
  .input .icon {
    position: absolute;
    z-index: var(--page-layer-2);
    right: var(--input-icon-right);
    width: var(--input-icon-width);
    pointer-events: none;
    margin: 0rem;
  }
  .input .icon.clickable {
    pointer-events: auto;
    cursor: pointer;
  }
  .input .icon + .label {
    right: var(--input-label-with-icon-right);
  }
  .input .label {
    position: absolute;
    z-index: var(--page-layer-2);
    pointer-events: none;
    right: var(--input-label-right);
    display: inline-block;
    text-wrap: nowrap;
    margin-left: auto;
    line-height: 1;
    font-weight: var(--input-label-font-weight);
    color: var(--input-label-color);
    font-size: var(--input-label-font-size);
    padding: var(--input-label-padding);
    border: var(--input-label-border);
    border-radius: var(--input-label-border-radius);
  }
}

/* src/components/input/css/shadow/types/search.css */
@layer component.input.types.search {
  .search.input {
    border-radius: var(--circular-radius);
  }
}

/* src/components/input/css/shadow/states/focused.css */
@layer component.input.states.focus {
  .input.focus,
  .input:focus-within {
    border-color: var(--input-focused-border-color);
    background: var(--input-focused-background);
    color: var(--input-focused-color);
    box-shadow: var(--input-focused-box-shadow);
  }
  .input:focus-within > input:placeholder,
  .input.focus > input::placeholder {
    color: var(--input-placeholder-focused-color);
  }
}

/* src/components/input/css/shadow/states/loading.css */
@layer component.input.states.loading {
  .loading.input:not(.icon) {
    position: relative;
    cursor: default;
    text-shadow: none !important;
    color: transparent !important;
    opacity: var(--input-loading-opacity);
    pointer-events: auto;
    transition: var(--input-loading-transition);
  }
  .loading.icon.input .icon {
    position: relative;
    color: transparent !important;
  }
  .loading.icon.input > .icon:before,
  .loading.input:not(.icon)::before {
    position: absolute;
    content: "";
    top: 50%;
    left: 50%;
    margin: var(--loader-margin);
    width: var(--loader-size);
    height: var(--loader-size);
    border-radius: var(--circular-radius);
    border: var(--loader-line-width) solid var(--loader-fill-color);
  }
  .loading.icon.input > .icon:after,
  .loading.input:not(.icon)::after {
    position: absolute;
    content: "";
    top: 50%;
    left: 50%;
    margin: var(--loader-margin);
    width: var(--loader-size);
    height: var(--loader-size);
    animation: input-spin var(--loader-speed) linear;
    animation-iteration-count: infinite;
    border-radius: var(--circular-radius);
    border-color: var(--loader-line-color) transparent transparent;
    border-style: solid;
    border-width: var(--loader-line-width);
    box-shadow: 0px 0px 0px 1px transparent;
  }
  @keyframes input-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .loading.input.inverted .icon:before,
  .loading.input.inverted:before {
    border-color: var(--inverted-loader-fill-color);
  }
  .loading.input.inverted .icon:after,
  .loading.input.inverted:after {
    border-top-color: var(--inverted-loader-line-color);
  }
}

/* src/components/input/css/shadow/states/disabled.css */
@layer component.input.states.disabled {
  .disabled.input,
  .disabled.input:hover,
  .disabled.active.input {
    cursor: var(--input-disabled-cursor);
    opacity: var(--input-disabled-opacity) !important;
    color: var(--input-disabled-color);
    background-color: var(--input-disabled-background-color) !important;
    background-image: var(--input-disabled-background-image) !important;
    box-shadow: var(--input-disabled-box-shadow) !important;
  }
  ui-input[disabled] {
    cursor: var(--input-disabled-cursor);
    pointer-events: none !important;
  }
  .clickable-disabled.input {
    pointer-events: auto !important;
    cursor: var(--input-clickable-disabled-cursor) !important;
  }
  .clickable-disabled.input:active {
    box-shadow: var(--input-pressed-box-shadow) !important;
  }
  ui-input[clickable-disabled] {
    pointer-events: auto !important;
    cursor: var(--input-clickable-disabled-cursor) !important;
  }
}

/* src/components/input/css/shadow/variations/sizing.css */
@layer component.input.variations.sizing {
  .mini {
    font-size: var(--input-mini);
  }
  .tiny {
    font-size: var(--input-tiny);
  }
  .small {
    font-size: var(--input-small);
  }
  :host {
    font-size: var(--input-medium);
  }
  .large {
    font-size: var(--input-large);
  }
  .big {
    font-size: var(--input-big);
  }
  .huge {
    font-size: var(--input-huge);
  }
  .massive {
    font-size: var(--input-massive);
  }
}

/* src/components/input/css/shadow/variations/fluid.css */
@layer component.input.variations.fluid {
  .fluid {
    display: flex;
    flex-grow: 1;
    max-width: 100%;
  }
  .fluid input {
    width: auto;
  }
}

/* src/components/input/css/shadow/input.css */
`;var xn=`<div class="{ui}{classMap getStateClasses}input" part="input">
  <input type="text" placeholder="{placeholder}" name={name} value={value} part="input-field">
  {#if icon}
    {#if isClearable}
      <ui-icon icon="x" link class="clickable icon" part="icon"></ui-icon>
    {else}
      <ui-icon icon={getIcon} class="icon" part="icon"></ui-icon>
    {/if}
  {/if}
  {#if label}
    <div class="label" part="label">
      {label}
    </div>
  {/if}
</div>
`;var Qa={focused:!1},tr=({$:n,el:t,self:e,state:o,dispatchEvent:a,settings:r})=>({initialize(){r.search&&e.configureSearch()},configureSearch(){r.placeholder=r.placeholder||"Search...",r.icon=r.icon||"search",r.clearable=r.clearable??!0,r.debounce=!0},hasValue(){return(r.value||"").length>0},isClearable(){return r.clearable&&e.hasValue()},getStateClasses(){return{focus:o.focused.get()}},getIcon(){return r.clearable&&e.hasValue()?"x":r.icon},setValue(i){t.value=i,n("input").val(i),a("input",{value:i})},setValueDebounced:ao(i=>{e.setValue(i)},{delay:r.debounceInterval})}),er=({})=>{},or=function({}){},nr={"click ui-icon"({$:n,self:t}){t.isClearable()&&t.setValue("")},"focus input"({state:n}){n.focused.set(!0)},"blur input"({state:n,dispatchEvent:t,el:e}){n.focused.set(!1),t("change",{value:e.value})},"input input"({el:n,self:t,value:e,settings:o}){o.debounced?t.setValueDebounced(e):t.setValue(e)}},yn=y({tagName:"ui-input",componentSpec:Ye,template:xn,css:kn,createComponent:tr,events:nr,onCreated:er,onRendered:or,defaultState:Qa});var Sn=`/* src/components/label/css/shadow/content/label.css */
@layer component.label.content.label;

/* src/components/label/css/shadow/variations/aligned.css */
@layer component.label.variations.aligned;

/* src/components/label/css/shadow/label.css */
`;var Cn=`<div class="label">
  {{>slot}}
</div>
`;var ir=({$:n})=>({}),An=y({tagName:"ui-label",componentSpec:je,template:Cn,css:Sn,createComponent:ir});var Tn=`/* src/components/segment/css/shadow/content/segment.css */
@layer component.segment.content.segment;

/* src/components/segment/css/shadow/variations/aligned.css */
@layer component.segment.variations.aligned;

/* src/components/segment/css/shadow/segment.css */
`;var En=`<div class="segment">
  {{>slot}}
</div>
`;var lr=({$:n})=>({}),$n=y({tagName:"ui-segment",componentSpec:Ke,template:En,css:Tn,createComponent:lr});var In=`/* src/components/modal/css/shadow/content/modal.css */
@layer component.content.modal {
  dialog {
    position: fixed;
    width: inherit;
    outline: none;
    border: none;
    background-color: transparent;
    overflow: visible;
  }
  dialog {
    display: none;
    flex-direction: column;
    opacity: 0;
    scale: 0.8;
    transition: var(--modal-dialog-transition);
  }
  dialog[open] {
    display: flex;
    opacity: 1;
    scale: 1;
  }
  @starting-style {
    dialog[open] {
      opacity: 0;
      scale: 0.8;
    }
  }
  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0);
    transition: var(--modal-dimmer-transition);
  }
  dialog[open]::backdrop {
    background: var(--modal-dimmer-background);
  }
  @starting-style {
    dialog[open]::backdrop {
      background: rgba(0, 0, 0, 0);
    }
  }
  dialog .modal {
    background: var(--modal-background);
    max-width: var(--modal-max-width);
    border-radius: var(--modal-border-radius);
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
    transition: var(--modal-transition);
  }
  dialog[open] .modal {
    box-shadow: var(--modal-box-shadow);
  }
  @starting-style {
    dialog[open] .modal {
      box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
    }
  }
  dialog ::slotted(.content) {
    padding: var(--padding);
  }
  dialog .close {
    cursor: pointer;
    align-self: flex-end;
    color: #FFF;
    margin: 0;
    font-size: 22px;
    padding: 1rem;
    opacity: 0.6;
    transition: var(--transition);
  }
  dialog .close:hover {
    opacity: 1;
  }
  dialog .close + .modal {
    margin-right: 3rem;
  }
}

/* src/components/modal/css/shadow/types/glass.css */
@layer component.types.glass {
  .glass.modal {
    backdrop-filter: var(--modal-glass-backdrop-filter);
    box-shadow: var(--modal-glass-box-shadow);
    background: var(--modal-glass-background);
  }
}

/* src/components/modal/css/shadow/variations/aligned.css */
@layer component.variations.aligned;

/* src/components/modal/css/shadow/variations/sizing.css */
@layer component.variations.sizing {
  :host {
    width: var(--modal-medium);
  }
  :host([size="mini"]),
  :host([mini]),
  :host.mini {
    width: var(--modal-mini);
  }
  :host([size="tiny"]),
  :host([tiny]),
  :host.tiny {
    width: var(--modal-tiny);
  }
  :host([size="small"]),
  :host([small]),
  :host.small {
    width: var(--modal-small);
  }
  :host([size="large"]),
  :host([large]),
  :host.large {
    width: var(--modal-large);
  }
  :host([size="big"]),
  :host([big]),
  :host.big {
    width: var(--modal-big);
  }
  :host([size="huge"]),
  :host([huge]),
  :host.huge {
    width: var(--modal-huge);
  }
  :host([size="massive"]),
  :host([massive]),
  :host.massive {
    width: var(--modal-massive);
  }
}

/* src/components/modal/css/shadow/modal.css */
`;var Ln=`<dialog part="dialog">
  {{#if not closeable}}
    <ui-icon link x class="close"></ui-icon>
  {{/if}}
  <div class="{{ui}}modal" part="modal">
    {{>slot}}
  </div>
</dialog>
`;var mr=({$:n,dispatchEvent:t})=>({show(e=C){e()!==!1&&n("dialog").get(0).showModal(),t("show")},hide(e=C){e()!==!1&&n("dialog").get(0).close(),t("hide")}}),br=({})=>{},pr=function({}){},vr={"click ui-icon.close"({event:n,self:t}){t.hide()},"click dialog"({$:n,event:t,settings:e,self:o}){e.closeable&&n(t.target).is("dialog")&&o.hide()}},Nn=y({tagName:"ui-modal",componentSpec:Qe,template:Ln,css:In,createComponent:mr,events:vr,onCreated:br,onRendered:pr});export{wn as MenuItem,rn as UIButton,en as UIButtons,cn as UICard,un as UICards,Ko as UIContainer,bn as UIIcon,yn as UIInput,An as UILabel,hn as UIMenu,Nn as UIModal,Zo as UIRail,$n as UISegment};
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
//# sourceMappingURL=semantic-ui.js.map
