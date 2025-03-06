var D=r=>r!==null&&typeof r=="object",nt=r=>D(r)&&r.constructor===Object,x=r=>typeof r=="string";var pe=r=>typeof r=="number",A=r=>Array.isArray(r);var L=r=>typeof r=="function"||!1;var Ht=r=>typeof window>"u"?!0:r instanceof Element||r instanceof Document||r===window||r instanceof DocumentFragment;var me=r=>{if(r==null)return!0;if(A(r)||x(r))return r.length===0;for(let t in r)if(r[t])return!1;return!0},Vt=r=>{if(r===null||typeof r!="object")return!1;let e=Object.getPrototypeOf(r).constructor.name;return!["Object","Array","Date","RegExp","Map","Set","Error","Uint8Array","Int8Array","Uint16Array","Int16Array","Uint32Array","Int32Array","Float32Array","Float64Array","BigInt64Array","BigUint64Array","NodeList"].includes(e)};var v=(r,t,e)=>{if(r==null)return r;let o=e?t.bind(e):t;if((D(r)||L(r))&&r.length!==void 0&&typeof r.length=="number"&&(r=Array.from(r)),A(r))for(let n=0;n<r.length&&o(r[n],n,r)!==!1;++n);else{let n=Object.keys(r);for(let a of n)if(o(r[a],a,r)===!1)break}return r};var St=r=>r.replace(/([.*+?^=!:${}()|\[\]\/\\])/g,"\\$1"),Ue=r=>{let t={"&":"&amp","<":"&lt",">":"&gt",'"':"&quot","'":"&#39"},e=/[&<>"']/g,o=RegExp(e.source);return r&&o.test(r)?r.replace(e,n=>t[n]):r};var Bt=(r="")=>(r||"").replace(/\s+/g,"-").replace(/[^\w-]+/g,"").replace(/_/g,"-").toLowerCase(),We=r=>{if(r=parseInt(r,10),r===0)return"0";let t="",e="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";for(;r>0;)t=e[r%e.length]+t,r=Math.floor(r/e.length);return t};function Ct(r,{prettify:t=!1,seed:e=305419896}={}){let i;if(r==null)i=new TextEncoder().encode("");else if(r&&r.toString===Object.prototype.toString&&typeof r=="object")try{i=new TextEncoder().encode(JSON.stringify(r))}catch(u){return console.error("Error serializing input",u),0}else i=new TextEncoder().encode(r.toString());let s;if(i.length<=8){s=e;for(let u=0;u<i.length;u++)s^=i[u],s=Math.imul(s,2654435761),s^=s>>>13}else{s=e;for(let u=0;u<i.length;u++)s=Math.imul(s^i[u],2654435761),s=s<<13|s>>>19,s=Math.imul(s,2246822519);s^=i.length}return s^=s>>>16,s=Math.imul(s,3266489917),s^=s>>>13,t?We(s>>>0):s>>>0}var je=()=>{let r=Math.random()*1e15;return We(r)};var N=r=>r,X=r=>L(r)?r:()=>r;var Ye=r=>{if(D(r))return Object.keys(r)},ve=r=>{if(D(r))return Object.values(r)},qe=(r,t)=>Object.fromEntries(Object.entries(r).filter(([e,o])=>t(o,e))),j=(r,t)=>Object.fromEntries(Object.entries(r).map(([e,o])=>[e,t(o,e)])),Ge=(r,...t)=>(t.forEach(e=>{let o,n;if(e)for(n in e)o=Object.getOwnPropertyDescriptor(e,n),o===void 0?r[n]=e[n]:Object.defineProperty(r,n,o)}),r);var Ft=r=>{if(A(r))return r;let t=[];return v(r,(e,o)=>{t.push({value:e,key:o})}),t},I=function(r,t=""){if(typeof t!="string")return;function e(i){let s=i.substring(0,i.indexOf("[")),u=parseInt(i.substring(i.indexOf("[")+1,i.indexOf("]")),10);return{key:s,index:u}}function o(i){let s=i.indexOf(".");if(s!==-1){let u=i.indexOf(".",s+1);if(u!==-1)return i.slice(0,u)}return i}if(r===null||!D(r))return;let n=t.split("."),a=r;for(let i=0;i<n.length;i++){if(a===null||!D(a))return;let s=n[i];if(s.includes("[")){let{key:u,index:b}=e(s);if(u in a&&A(a[u])&&b<a[u].length)a=a[u][b];else return}else if(s in a)a=a[s];else{let u=n.slice(i).join(".");if(u in a){a=a[u];break}else{let b=o(`${s}.${n[i+1]}`);if(b in a)a=a[b],i++;else return}}}return a};var fe=r=>{let t={},e=(o,n)=>{A(t[o])?t[o].push(n):t[o]?t[o]=[t[o],n]:t[o]=n};return Object.keys(r).forEach(o=>{A(r[o])?v(r[o],n=>{e(n,o)}):e(r[o],o)}),t};var V=(r,t,e={})=>{if(r===t)return!0;if(r&&t&&typeof r=="object"&&typeof t=="object"){if(r.constructor!==t.constructor)return!1;let o,n,a;if(Array.isArray(r)){if(o=r.length,o!=t.length)return!1;for(n=o;n--!==0;)if(!V(r[n],t[n]))return!1;return!0}if(r instanceof Map&&t instanceof Map){if(r.size!==t.size)return!1;for(n of r.entries())if(!t.has(n[0]))return!1;for(n of r.entries())if(!V(n[1],t.get(n[0])))return!1;return!0}if(r instanceof Set&&t instanceof Set){if(r.size!==t.size)return!1;for(n of r.entries())if(!t.has(n[0]))return!1;return!0}if(ArrayBuffer.isView(r)&&ArrayBuffer.isView(t)){if(o=r.length,o!=t.length)return!1;for(n=o;n--!==0;)if(r[n]!==t[n])return!1;return!0}if(r.constructor===RegExp)return r.source===t.source&&r.flags===t.flags;if(r.valueOf!==Object.prototype.valueOf)return r.valueOf()===t.valueOf();if(r.toString!==Object.prototype.toString)return r.toString()===t.toString();if(a=Object.keys(r),o=a.length,o!==Object.keys(t).length)return!1;for(n=o;n--!==0;)if(!Object.prototype.hasOwnProperty.call(t,a[n]))return!1;for(n=o;n--!==0;){let i=a[n];if(!V(r[i],t[i]))return!1}return!0}return r!==r&&t!==t};var rt=r=>Array.from(new Set(r));var ft=(r=[],t=1)=>{let{length:e}=r;if(e)return t===1?r[e-1]:r.slice(Math.max(e-t,0))};var Ke=(r=[],t)=>{let e;return v(r,(o,n)=>{if(t(o,n,r))return e=o,!1}),e},gt=(r=[],t)=>{let e=-1;return v(r,(o,n)=>{if(t(o,n,r))return e=n,!1}),e},Xe=(r=[],t)=>{let e=L(t)?t:n=>V(n,t),o=gt(r,e);return o>-1?(r.splice(o,1),!0):!1},w=(r,t=[])=>t.indexOf(r)>-1,Je=(r,t,e=1)=>{t||(t=r,r=0);let o=t-r;return Array(o).fill(void 0).map((n,a)=>a*e+r)};var Ut=(r=[])=>r.reduce((t,e)=>Array.isArray(e)?t.concat(Ut(e)):t.concat(e),[]),Ho=(r,t)=>r?.some?r.some(t):!1,Ze=Ho;var Vo=58;var ge=(...r)=>{if(r.length===0)return[];if(r.length===1)return[...new Set(r[0])];let e=r.reduce((i,s)=>i+s.length,0)>=Vo,[o,...n]=r,a=[...new Set(o)];if(e){let i=n.map(s=>new Set(s));return a.filter(s=>!i.some(u=>u.has(s)))}return a.filter(i=>!n.some(s=>s.includes(i)))};var Qe=r=>{let t=r?.key;if(!t)return"";let e="";r.ctrlKey&&t!=="Control"&&(e+="ctrl+"),r.altKey&&t!=="Alt"&&(e+="alt+"),r.shiftKey&&t!=="Shift"&&(e+="shift+"),r.metaKey&&t!=="Meta"&&(e+="meta+");let o={Control:"ctrl",Escape:"esc"," ":"space"};return t=t.replace("Arrow",""),e+=o[t]||t.toLowerCase(),e};var Y=(r,t=new Map)=>{if(!r||typeof r!="object")return r;if(t.has(r))return t.get(r);let e;if(r.nodeType&&"cloneNode"in r)e=r.cloneNode(!0),t.set(r,e);else if(r instanceof Date)e=new Date(r.getTime()),t.set(r,e);else if(r instanceof RegExp)e=new RegExp(r),t.set(r,e);else if(Array.isArray(r)){e=new Array(r.length),t.set(r,e);for(let o=0;o<r.length;o++)e[o]=Y(r[o],t)}else if(r instanceof Map){e=new Map,t.set(r,e);for(let[o,n]of r.entries())e.set(o,Y(n,t))}else if(r instanceof Set){e=new Set,t.set(r,e);for(let o of r)e.add(Y(o,t))}else if(r instanceof Object){e={},t.set(r,e);for(let[o,n]of Object.entries(r))e[o]=Y(n,t)}return e};var Wt=function(r,t="LLL",{locale:e="default",hour12:o=!0,timezone:n="UTC",...a}={}){if(isNaN(r.getTime()))return"Invalid Date";let i=new Date(r.getTime());n==="local"&&(n=Intl.DateTimeFormat().resolvedOptions().timeZone);let s=_=>_<10?`0${_}`:_,u={timeZone:n,year:"numeric",month:"long",day:"numeric",weekday:"long",hour:"numeric",minute:"numeric",second:"numeric",hour12:o,...a},l=new Intl.DateTimeFormat(e,u).formatToParts(i).reduce((_,C)=>(_[C.type]=C.value,_),{}),{year:c,month:d,day:m,weekday:h,hour:f,minute:g,second:p,dayPeriod:k}=l;f==="24"&&(f="00");let M=new Date(r.toLocaleString("en-US",{timeZone:n})),S={YYYY:c,YY:c.slice(-2),MMMM:d,MMM:d.slice(0,3),MM:s(M.getMonth()+1),M:M.getMonth()+1,DD:s(M.getDate()),D:M.getDate(),Do:m+["th","st","nd","rd"][m%10>3?0:(m%100-m%10!==10)*m%10],dddd:h,ddd:h.slice(0,3),HH:f.padStart(2,"0"),hh:o?(f%12||12).toString().padStart(2,"0"):f.padStart(2,"0"),h:o?(f%12||12).toString():f,mm:g,ss:p,a:o&&k?k.toLowerCase():""},F={LT:"h:mm a",LTS:"h:mm:ss a",L:"MM/DD/YYYY",l:"M/D/YYYY",LL:"MMMM D, YYYY",ll:"MMM D, YYYY",LLL:"MMMM D, YYYY h:mm a",lll:"MMM D, YYYY h:mm a",LLLL:"dddd, MMMM D, YYYY h:mm a",llll:"ddd, MMM D, YYYY h:mm a"};return t=t.trim(),(F[t]||t).replace(/\b(?:YYYY|YY|MMMM|MMM|MM|M|DD|D|Do|dddd|ddd|HH|hh|h|mm|ss|a)\b/g,_=>S[_]).replace(/\[(.+?)\]/g,(_,C)=>C).trim()};var At=(r,{errorType:t=Error,metadata:e={},onError:o=null,removeStackLines:n=1}={})=>{let a=new t(r);if(Object.assign(a,e),a.stack){let s=a.stack.split(`
`);s.splice(1,n),a.stack=s.join(`
`)}let i=()=>{throw typeof global.onError=="function"&&global.onError(a),a};typeof queueMicrotask=="function"?queueMicrotask(i):setTimeout(i,0)};var J=typeof window>"u",Tt=typeof window<"u";var q=(r="")=>r.replace(/-./g,t=>t[1].toUpperCase()),ut=(r="")=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),jt=(r="")=>r.charAt(0).toUpperCase()+r.slice(1);var Et=(r="")=>{let t=["the","a","an","and","but","for","at","by","from","to","in","on","of","or","nor","with","as"];if(x(r))return r.toLowerCase().split(" ").map((e,o)=>o===0||!t.includes(e)?e.charAt(0).toUpperCase()+e.slice(1):e).join(" ")},to=(r,{separator:t=", ",lastSeparator:e=" and ",oxford:o=!0,quotes:n=!1,transform:a=N}={})=>{if(!A(r)||r.length===0)return"";let i=r.map(b=>{let l=b;return L(a)&&(l=a(b)),n?`"${l}"`:l});if(i.length===1)return i[0];if(i.length===2)return i.join(e);let s=i.pop(),u=i.join(t);return o&&t.trim()!==e.trim()&&(u+=t.trim()),u+e+s};var xe=(r,t="")=>{t=t.toLowerCase();let e=(a,i)=>{if(a.type===CSSRule.STYLE_RULE)return`${i} ${a.selectorText} { ${a.style.cssText} }`;if(a.type===CSSRule.MEDIA_RULE||a.type===CSSRule.SUPPORTS_RULE)return`@${a.type===CSSRule.MEDIA_RULE?"media":"supports"} ${a.conditionText||""} { ${e(a.cssText,i)} }`;if(a.type===CSSRule.LAYER_STATEMENT_RULE||a.type==0&&a.cssRules){let s=[];return v(a.cssRules,u=>{s.push(e(u,i))}),`@layer ${a.name} { ${s.join(" ")} }`}else return a.cssText},o=new CSSStyleSheet;o.replaceSync(r);let n=[];return v(o.cssRules,a=>{n.push(e(a,t))}),n.join(`
`)};var we=(r,t,{scopeSelector:e}={})=>{if(J)return;t||(t=document);let o=Ct(r);if(t.cssHashes||(t.cssHashes=[]),t.cssHashes.includes(o))return;t.cssHashes.push(o);let n=new CSSStyleSheet;e&&(r=xe(r,e)),n.id=o,n.replaceSync(r),t.adoptedStyleSheets=[...t.adoptedStyleSheets,n]};var Yt=globalThis,Gt=Yt.ShadowRoot&&(Yt.ShadyCSS===void 0||Yt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,oo=Symbol(),eo=new WeakMap,qt=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==oo)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Gt&&t===void 0){let o=e!==void 0&&e.length===1;o&&(t=eo.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&eo.set(e,t))}return t}toString(){return this.cssText}},Kt=r=>new qt(typeof r=="string"?r:r+"",void 0,oo);var ye=(r,t)=>{if(Gt)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let o=document.createElement("style"),n=Yt.litNonce;n!==void 0&&o.setAttribute("nonce",n),o.textContent=e.cssText,r.appendChild(o)}},Xt=Gt?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let o of t.cssRules)e+=o.cssText;return Kt(e)})(r):r;var{is:Bo,defineProperty:Fo,getOwnPropertyDescriptor:Uo,getOwnPropertyNames:Wo,getOwnPropertySymbols:jo,getPrototypeOf:Yo}=Object,Jt=globalThis,no=Jt.trustedTypes,qo=no?no.emptyScript:"",Go=Jt.reactiveElementPolyfillSupport,$t=(r,t)=>r,ke={toAttribute(r,t){switch(t){case Boolean:r=r?qo:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ao=(r,t)=>!Bo(r,t),ro={attribute:!0,type:String,converter:ke,reflect:!1,hasChanged:ao};Symbol.metadata??=Symbol("metadata"),Jt.litPropertyMetadata??=new WeakMap;var Q=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ro){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){let o=Symbol(),n=this.getPropertyDescriptor(t,o,e);n!==void 0&&Fo(this.prototype,t,n)}}static getPropertyDescriptor(t,e,o){let{get:n,set:a}=Uo(this.prototype,t)??{get(){return this[e]},set(i){this[e]=i}};return{get(){return n?.call(this)},set(i){let s=n?.call(this);a.call(this,i),this.requestUpdate(t,s,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ro}static _$Ei(){if(this.hasOwnProperty($t("elementProperties")))return;let t=Yo(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($t("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($t("properties"))){let e=this.properties,o=[...Wo(e),...jo(e)];for(let n of o)this.createProperty(n,e[n])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[o,n]of e)this.elementProperties.set(o,n)}this._$Eh=new Map;for(let[e,o]of this.elementProperties){let n=this._$Eu(e,o);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let o=new Set(t.flat(1/0).reverse());for(let n of o)e.unshift(Xt(n))}else t!==void 0&&e.push(Xt(t));return e}static _$Eu(t,e){let o=e.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ye(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$EC(t,e){let o=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,o);if(n!==void 0&&o.reflect===!0){let a=(o.converter?.toAttribute!==void 0?o.converter:ke).toAttribute(e,o.type);this._$Em=t,a==null?this.removeAttribute(n):this.setAttribute(n,a),this._$Em=null}}_$AK(t,e){let o=this.constructor,n=o._$Eh.get(t);if(n!==void 0&&this._$Em!==n){let a=o.getPropertyOptions(n),i=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:ke;this._$Em=n,this[n]=i.fromAttribute(e,a.type),this._$Em=null}}requestUpdate(t,e,o){if(t!==void 0){if(o??=this.constructor.getPropertyOptions(t),!(o.hasChanged??ao)(this[t],e))return;this.P(t,e,o)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,o){this._$AL.has(t)||this._$AL.set(t,e),o.reflect===!0&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,a]of this._$Ep)this[n]=a;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[n,a]of o)a.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],a)}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(o=>o.hostUpdate?.()),this.update(e)):this._$EU()}catch(o){throw t=!1,this._$EU(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach(e=>this._$EC(e,this[e])),this._$EU()}updated(t){}firstUpdated(t){}};Q.elementStyles=[],Q.shadowRootOptions={mode:"open"},Q[$t("elementProperties")]=new Map,Q[$t("finalized")]=new Map,Go?.({ReactiveElement:Q}),(Jt.reactiveElementVersions??=[]).push("2.0.4");var Ce=globalThis,Zt=Ce.trustedTypes,io=Zt?Zt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Ae="$lit$",tt=`lit$${Math.random().toFixed(9).slice(2)}$`,Te="?"+tt,Ko=`<${Te}>`,dt=document,Nt=()=>dt.createComment(""),Pt=r=>r===null||typeof r!="object"&&typeof r!="function",Ee=Array.isArray,ho=r=>Ee(r)||typeof r?.[Symbol.iterator]=="function",Se=`[ 	
\f\r]`,Lt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,so=/-->/g,uo=/>/g,lt=RegExp(`>|${Se}(?:([^\\s"'>=/]+)(${Se}*=${Se}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),lo=/'/g,co=/"/g,po=/^(?:script|style|textarea|title)$/i,$e=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),Le=$e(1),mo=$e(2),Xr=$e(3),G=Symbol.for("lit-noChange"),y=Symbol.for("lit-nothing"),bo=new WeakMap,ct=dt.createTreeWalker(dt,129);function vo(r,t){if(!Ee(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return io!==void 0?io.createHTML(t):t}var fo=(r,t)=>{let e=r.length-1,o=[],n,a=t===2?"<svg>":t===3?"<math>":"",i=Lt;for(let s=0;s<e;s++){let u=r[s],b,l,c=-1,d=0;for(;d<u.length&&(i.lastIndex=d,l=i.exec(u),l!==null);)d=i.lastIndex,i===Lt?l[1]==="!--"?i=so:l[1]!==void 0?i=uo:l[2]!==void 0?(po.test(l[2])&&(n=RegExp("</"+l[2],"g")),i=lt):l[3]!==void 0&&(i=lt):i===lt?l[0]===">"?(i=n??Lt,c=-1):l[1]===void 0?c=-2:(c=i.lastIndex-l[2].length,b=l[1],i=l[3]===void 0?lt:l[3]==='"'?co:lo):i===co||i===lo?i=lt:i===so||i===uo?i=Lt:(i=lt,n=void 0);let m=i===lt&&r[s+1].startsWith("/>")?" ":"";a+=i===Lt?u+Ko:c>=0?(o.push(b),u.slice(0,c)+Ae+u.slice(c)+tt+m):u+tt+(c===-2?s:m)}return[vo(r,a+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]},Mt=class r{constructor({strings:t,_$litType$:e},o){let n;this.parts=[];let a=0,i=0,s=t.length-1,u=this.parts,[b,l]=fo(t,e);if(this.el=r.createElement(b,o),ct.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(n=ct.nextNode())!==null&&u.length<s;){if(n.nodeType===1){if(n.hasAttributes())for(let c of n.getAttributeNames())if(c.endsWith(Ae)){let d=l[i++],m=n.getAttribute(c).split(tt),h=/([.?@])?(.*)/.exec(d);u.push({type:1,index:a,name:h[2],strings:m,ctor:h[1]==="."?te:h[1]==="?"?ee:h[1]==="@"?oe:ht}),n.removeAttribute(c)}else c.startsWith(tt)&&(u.push({type:6,index:a}),n.removeAttribute(c));if(po.test(n.tagName)){let c=n.textContent.split(tt),d=c.length-1;if(d>0){n.textContent=Zt?Zt.emptyScript:"";for(let m=0;m<d;m++)n.append(c[m],Nt()),ct.nextNode(),u.push({type:2,index:++a});n.append(c[d],Nt())}}}else if(n.nodeType===8)if(n.data===Te)u.push({type:2,index:a});else{let c=-1;for(;(c=n.data.indexOf(tt,c+1))!==-1;)u.push({type:7,index:a}),c+=tt.length-1}a++}}static createElement(t,e){let o=dt.createElement("template");return o.innerHTML=t,o}};function bt(r,t,e=r,o){if(t===G)return t;let n=o!==void 0?e._$Co?.[o]:e._$Cl,a=Pt(t)?void 0:t._$litDirective$;return n?.constructor!==a&&(n?._$AO?.(!1),a===void 0?n=void 0:(n=new a(r),n._$AT(r,e,o)),o!==void 0?(e._$Co??=[])[o]=n:e._$Cl=n),n!==void 0&&(t=bt(r,n._$AS(r,t.values),n,o)),t}var Qt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:o}=this._$AD,n=(t?.creationScope??dt).importNode(e,!0);ct.currentNode=n;let a=ct.nextNode(),i=0,s=0,u=o[0];for(;u!==void 0;){if(i===u.index){let b;u.type===2?b=new xt(a,a.nextSibling,this,t):u.type===1?b=new u.ctor(a,u.name,u.strings,this,t):u.type===6&&(b=new ne(a,this,t)),this._$AV.push(b),u=o[++s]}i!==u?.index&&(a=ct.nextNode(),i++)}return ct.currentNode=dt,n}p(t){let e=0;for(let o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}},xt=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,o,n){this.type=2,this._$AH=y,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=bt(this,t,e),Pt(t)?t===y||t==null||t===""?(this._$AH!==y&&this._$AR(),this._$AH=y):t!==this._$AH&&t!==G&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ho(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==y&&Pt(this._$AH)?this._$AA.nextSibling.data=t:this.T(dt.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:o}=t,n=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=Mt.createElement(vo(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===n)this._$AH.p(e);else{let a=new Qt(n,this),i=a.u(this.options);a.p(e),this.T(i),this._$AH=a}}_$AC(t){let e=bo.get(t.strings);return e===void 0&&bo.set(t.strings,e=new Mt(t)),e}k(t){Ee(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,o,n=0;for(let a of t)n===e.length?e.push(o=new r(this.O(Nt()),this.O(Nt()),this,this.options)):o=e[n],o._$AI(a),n++;n<e.length&&(this._$AR(o&&o._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){let o=t.nextSibling;t.remove(),t=o}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},ht=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,n,a){this.type=1,this._$AH=y,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=a,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=y}_$AI(t,e=this,o,n){let a=this.strings,i=!1;if(a===void 0)t=bt(this,t,e,0),i=!Pt(t)||t!==this._$AH&&t!==G,i&&(this._$AH=t);else{let s=t,u,b;for(t=a[0],u=0;u<a.length-1;u++)b=bt(this,s[o+u],e,u),b===G&&(b=this._$AH[u]),i||=!Pt(b)||b!==this._$AH[u],b===y?t=y:t!==y&&(t+=(b??"")+a[u+1]),this._$AH[u]=b}i&&!n&&this.j(t)}j(t){t===y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},te=class extends ht{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===y?void 0:t}},ee=class extends ht{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==y)}},oe=class extends ht{constructor(t,e,o,n,a){super(t,e,o,n,a),this.type=5}_$AI(t,e=this){if((t=bt(this,t,e,0)??y)===G)return;let o=this._$AH,n=t===y&&o!==y||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,a=t!==y&&(o===y||n);n&&this.element.removeEventListener(this.name,this,o),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ne=class{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){bt(this,t)}},go={M:Ae,P:tt,A:Te,C:1,L:fo,R:Qt,D:ho,V:bt,I:xt,H:ht,N:ee,U:oe,B:te,F:ne},Xo=Ce.litHtmlPolyfillSupport;Xo?.(Mt,xt),(Ce.litHtmlVersions??=[]).push("3.2.1");var xo=(r,t,e)=>{let o=e?.renderBefore??t,n=o._$litPart$;if(n===void 0){let a=e?.renderBefore??null;o._$litPart$=n=new xt(t.insertBefore(Nt(),a),a,void 0,e??{})}return n._$AI(r),n};var et=class extends Q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=xo(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}};et._$litElement$=!0,et.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:et});var Jo=globalThis.litElementPolyfillSupport;Jo?.({LitElement:et});(globalThis.litElementVersions??=[]).push("4.1.1");var Rt=class r{static DEBUG_MODE=!0;constructor(t){this.input=t,this.pos=0}matches(t){return t.test(this.rest())}rest(){return this.input.slice(this.pos)}step(t=1){this.isEOF()||(this.pos=this.pos+t)}rewind(t=1){this.pos!==0&&(this.pos=this.pos-t)}isEOF(){return this.pos>=this.input.length}peek(){return this.input.charAt(this.pos)}consume(t){let e=typeof t=="string"?new RegExp(St(t)):new RegExp(t),o=this.input.substring(this.pos),n=e.exec(o);return n&&n.index===0?(this.pos+=n[0].length,n[0]):null}consumeUntil(t){let o=(typeof t=="string"?new RegExp(St(t)):new RegExp(t)).exec(this.input.substring(this.pos));if(!o){let a=this.input.substr(this.pos);return this.pos=this.input.length,a}let n=this.input.substring(this.pos,this.pos+o.index);return this.pos+=o.index,n}returnTo(t){if(!t)return;let e=typeof t=="string"?new RegExp(St(t),"gm"):new RegExp(t,"gm"),o=null,n,a=this.input.substring(0,this.pos);for(;(n=e.exec(a))!==null;)o=n;if(o){let i=this.input.substring(0,o.index);return this.pos=o.index,i}}getContext(){let t=!1,e=this.pos-1,o;for(;e>=0&&this.input[e]!==">";){if(this.input[e]==="<"){t=!0,o=e;break}e--}if(t){let n=this.input.substring(o,this.pos),a=/([a-zA-Z-]+)(?=\s*=\s*[^=]*$)/,i=n.match(a),s=i?i[1]:"",u=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","defer","disabled","formnovalidate","inert","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected"],b=!1;if(u.includes(s))b=!0;else{let l=/([a-zA-Z-]+)(?=\s*=\s*(\"|\')\s*[^=]*$)/,c=n.match(l),d=c?c[1]:"";b=s!==d}if(s)return{insideTag:!0,attribute:s,booleanAttribute:b}}return{insideTag:t}}fatal(t){t=t||"Parse error";let o=(typeof this.input=="string"?this.input:"").split(`
`),n=0,a=0;for(let h of o){if(a+h.length+1>this.pos)break;a+=h.length+1,n++}let i=5,s=5,u=Math.max(0,n-i),b=Math.min(o.length,n+s+1),l=o.slice(u,b),c=l.map((h,f)=>`%c${h}`).join(`
`),d="color: grey",m="color: red; font-weight: bold";if(r.DEBUG_MODE){if(globalThis.document){let f="";v(l,(p,k)=>{let M=k<i||k>i?d:m;f+=`<div style="${M}">${p}</div>`});let g=`
          <div style="padding: 1rem; font-size: 14px;">
            <h2>Could not render template</h2>
            <h3>${t}</h3>
            <code style="margin-top: 1rem; display: block; background-color: #EFEFEF; padding: 0.25rem 1rem;border-left: 3px solid #888"><pre>${f}</pre></code>
          </div>
        `;document.body.innerHTML=g}throw console.error(t+`
`+c,...l.map((f,g)=>n-u===g?m:d)),new Error(t)}}};var pt=class r{constructor(t){this.templateString=t||"",this.snippets={}}static singleBracketRegExp={IF:/^{\s*#if\s+/,ELSEIF:/^{\s*else\s*if\s+/,ELSE:/^{\s*else\s*/,EACH:/^{\s*#each\s+/,SNIPPET:/^{\s*#snippet\s+/,CLOSE_IF:/^{\s*\/(if)\s*/,CLOSE_EACH:/^{\s*\/(each)\s*/,CLOSE_SNIPPET:/^{\s*\/(snippet)\s*/,SLOT:/^{>\s*slot\s*/,TEMPLATE:/^{>\s*/,HTML_EXPRESSION:/^{\s*#html\s*/,EXPRESSION:/^{\s*/};static singleBracketParserRegExp={NEXT_TAG:/(\{|\<svg|\<\/svg)/,EXPRESSION_START:/\{/,EXPRESSION_END:/\}/,TAG_CLOSE:/\>/};static doubleBracketRegExp={IF:/^{{\s*#if\s+/,ELSEIF:/^{{\s*else\s*if\s+/,ELSE:/^{{\s*else\s*/,EACH:/^{{\s*#each\s+/,SNIPPET:/^{{\s*#snippet\s+/,CLOSE_IF:/^{{\s*\/(if)\s*/,CLOSE_EACH:/^{{\s*\/(each)\s*/,CLOSE_SNIPPET:/^{{\s*\/(snippet)\s*/,SLOT:/^{{>\s*slot\s*/,TEMPLATE:/^{{>\s*/,HTML_EXPRESSION:/^{{\s*#html\s*/,EXPRESSION:/^{{\s*/};static doubleBracketParserRegExp={NEXT_TAG:/(\{\{|\<svg|\<\/svg)/,EXPRESSION_START:/\{\{/,EXPRESSION_END:/\}\}/,TAG_CLOSE:/\>/};static htmlRegExp={SVG_OPEN:/^\<svg\s*/i,SVG_CLOSE:/^\<\/svg\s*/i};static preprocessRegExp={WEB_COMPONENT_SELF_CLOSING:/<(\w+-\w+)([^>]*)\/>/g};static templateRegExp={VERBOSE_KEYWORD:/^(template|snippet)\W/g,VERBOSE_PROPERTIES:/(\w+)\s*=\s*(((?!\w+\s*=).)+)/gms,STANDARD:/(\w+)\s*=\s*((?:(?!\n|$|\w+\s*=).)+)/g,DATA_OBJECT:/(\w+)\s*:\s*([^,}]+)/g,SINGLE_QUOTES:/\'/g};compile(t=this.templateString){t=r.preprocessTemplate(t);let e=new Rt(t);x(t)||e.fatal("Template is not a string",t);let{htmlRegExp:o}=r,n=r.detectSyntax(t),a=n=="doubleBracket"?r.doubleBracketRegExp:r.singleBracketRegExp,i=n=="doubleBracket"?r.doubleBracketParserRegExp:r.singleBracketParserRegExp,s=h=>{let f=()=>{if(h.peek()=="}"){h.consumeUntil(i.EXPRESSION_END);return}let g=1,p=h.peek();for(;g>0&&!h.isEOF();){if(h.step(),h.peek()=="{"&&g++,h.peek()=="}"&&g--,g==0){h.rewind();break}p+=h.peek()}return h.consumeUntil(i.EXPRESSION_END),h.consume(i.EXPRESSION_END),p=p.trim(),p};for(let g in a)if(h.matches(a[g])){let p=h.getContext();h.consume(a[g]);let k=f();h.consume(i.EXPRESSION_END);let M=this.getValue(k);return{type:g,content:M,...p}}for(let g in o)if(h.matches(o[g])){h.consume(o[g]);let p=h.getContext(),k=this.getValue(h.consumeUntil(i.TAG_CLOSE).trim());return h.consume(i.TAG_CLOSE),{type:g,content:k,...p}}return null},u=[],b=[],l=null,c=[],d=[];for(;!e.isEOF();){let h=s(e),f=ft(c),g=l?.content||u;if(h){let p={type:h.type.toLowerCase()};switch(h.type){case"IF":p={...p,condition:h.content,content:[],branches:[]},g.push(p),c.push(p),d.push(p),l=p;break;case"ELSEIF":p={...p,condition:h.content,content:[]},f||(e.returnTo(a.ELSEIF),e.fatal("{{elseif}} encountered without matching if condition")),d.pop(),d.push(p),f.branches.push(p),l=p;break;case"ELSE":if(p={...p,content:[]},!f){e.returnTo(a.ELSE),e.fatal("{{else}} encountered without matching if or each condition");break}f.type==="if"?(d.pop(),d.push(p),f.branches.push(p),l=p):f.type==="each"?(d.pop(),d.push(p),f.else=p,l=p):(e.returnTo(a.ELSE),e.fatal("{{else}} encountered with unknown condition type: "+f.type));break;case"CLOSE_IF":c.length==0&&(e.returnTo(a.CLOSE_IF),e.fatal("{{/if}} close tag found without open if tag")),b.pop(),d.pop(),c.pop(),l=ft(d);break;case"SNIPPET":p={...p,type:"snippet",name:h.content,content:[]},this.snippets[h.content]=p,g.push(p),c.push(p),d.push(p),l=p;break;case"CLOSE_SNIPPET":c.length==0&&(e.returnTo(a.CLOSE_IF),e.fatal("{{/snippet}} close tag found without open if tag")),b.pop(),d.pop(),l=ft(d);break;case"HTML_EXPRESSION":p={...p,type:"expression",unsafeHTML:!0,value:h.content},g.push(p),e.consume("}");break;case"EXPRESSION":p={...p,value:h.content},h.booleanAttribute&&(p.ifDefined=!0),g.push(p);break;case"TEMPLATE":let k=this.parseTemplateString(h.content);p={...p,...k},g.push(p);break;case"SLOT":p={...p,name:h.content},g.push(p);break;case"EACH":let M,S,F,U=h.content.split(" in "),_=h.content.split(" as ");if(U.length>1){let C=U[0].trim();M=U[1].trim();let W=C.indexOf(",");W!==-1?(S=C.substring(0,W).trim(),F=C.substring(W+1).trim()):S=C}else if(_.length>1){M=_[0].trim();let C=_[1].trim(),W=C.indexOf(",");W!==-1?(S=C.substring(0,W).trim(),F=C.substring(W+1).trim()):S=C}else M=h.content.trim();p={...p,over:M,content:[]},S&&(p.as=S),F&&(p.indexAs=F),d.push(p),c.push(p),g.push(p),l=p;break;case"CLOSE_EACH":b.pop(),d.pop(),c.pop(),l=ft(d);break;case"SVG_OPEN":g.push({type:"html",html:"<svg "}),g.push(...this.compile(h.content)),g.push({type:"html",html:">"}),p={type:"svg",content:[]},d.push(p),g.push(p),l=p;break;case"SVG_CLOSE":b.pop(),d.pop(),l=ft(d),p={type:"html",html:"</svg>"},(l||u).push(p);break}}else{let p=e.consumeUntil(i.NEXT_TAG);if(p){let k={type:"html",html:p};g.push(k)}}}return r.optimizeAST(u)}getValue(t){return t=="true"?!0:t=="false"?!1:x(t)&&t.trim()!==""&&Number.isFinite(+t)?Number(t):t}parseTemplateString(t=""){let e=r.templateRegExp,o={};if(e.VERBOSE_KEYWORD.lastIndex=0,e.VERBOSE_KEYWORD.test(t)){let n=[...t.matchAll(e.VERBOSE_PROPERTIES)];v(n,(a,i)=>{let s=a[1],u=r.getObjectFromString(a[2]);o[s]=u})}else{let n={},a=t.split(/\b/)[0];o.name=`'${a}'`;let i=[...t.matchAll(e.STANDARD)];v(i,(s,u)=>{let b=s[1].trim(),l=s[2].trim();n[b]=l}),o.reactiveData=n}return o}static getObjectFromString(t=""){let e=r.templateRegExp.DATA_OBJECT,o={},n,a=!1;for(;(n=e.exec(t))!==null;)a=!0,o[n[1]]=n[2].trim();return a?o:t.trim()}static detectSyntax(t=""){let e=t.search(/{{\s*/),o=t.search(/{[^{]\s*/);return e!==-1&&e<o?"doubleBracket":"singleBracket"}static preprocessTemplate(t=""){return t=t.trim(),t=t.replace(r.preprocessRegExp.WEB_COMPONENT_SELF_CLOSING,(e,o,n)=>`<${o}${n}></${o}>`),t}static optimizeAST(t){let e=[],o=null,n=a=>{a.type==="html"?o?o.html+=a.html:(o={...a},e.push(o)):(o&&(o=null),Array.isArray(a.content)&&(a.content=this.optimizeAST(a.content)),a.else&&a.else.content&&(a.else.content=this.optimizeAST(a.else.content)),e.push(a))};return t.forEach(n),e}};var re=class r{static globalThisProxy=new Proxy({},{get(t,e){return globalThis[e]},set(t,e,o){return globalThis[e]=o,!0}});static eventHandlers=[];constructor(t,{root:e=document,pierceShadow:o=!1}={}){let n=[];if(e){if(t===window||t===globalThis||w(t,["window","globalThis"])||t==r.globalThisProxy)n=[r.globalThisProxy],this.isBrowser=Tt,this.isGlobal=!0;else if(A(t)||t instanceof NodeList||t instanceof HTMLCollection)t=Array.from(t),n=t;else if(x(t))if(t.trim().slice(0,1)=="<"){let a=document.createElement("template");a.innerHTML=t.trim(),n=Array.from(a.content.childNodes)}else n=o?this.querySelectorAllDeep(e,t):e.querySelectorAll(t);else Ht(t)?n=[t]:t instanceof NodeList&&(n=t);this.selector=t,this.length=n.length,this.options={root:e,pierceShadow:o},Object.assign(this,n)}}chain(t){return this.isGlobal&&!t?new r(globalThis,this.options):new r(t,this.options)}querySelectorAllDeep(t,e,o=!0){let n=[],a=Ht(e),i=!1,s;o&&(a&&t==e||t.matches&&t.matches(e))&&n.push(t),a?s=!0:t.querySelectorAll?(n.push(...t.querySelectorAll(e)),s=!0):s=!1;let u=(c,d)=>{a&&(c===d||c.contains)?c.contains(d)&&(n.push(d),i=!0):c.querySelectorAll&&n.push(...c.querySelectorAll(d))},b=(c,d)=>{let m=d.split(" "),h,f;return v(m,(g,p)=>{if(h=m.slice(0,p+1).join(" "),c.matches(h)){f=m.slice(p+1).join(" ");return}}),f||d},l=(c,d,m)=>{i||(m===!0&&(u(c,d),s=!0),c.nodeType===Node.ELEMENT_NODE&&c.shadowRoot&&(d=b(c,d),u(c.shadowRoot,d),l(c.shadowRoot,d,!s)),c.assignedNodes&&(d=b(c,d),c.assignedNodes().forEach(h=>l(h,d,s))),c.childNodes.length&&c.childNodes.forEach(h=>l(h,d,s)))};return l(t,e),[...new Set(n)]}each(t){for(let e=0;e<this.length;e++){let o=this[e],n=this.chain(o);t.call(n,o,e)}return this}removeAllEvents(){r.eventHandlers=[]}find(t){let e=Array.from(this).flatMap(o=>this.options.pierceShadow?this.querySelectorAllDeep(o,t,!1):Array.from(o.querySelectorAll(t)));return this.chain(e)}parent(t){let e=Array.from(this).map(o=>o.parentElement).filter(Boolean);return t?this.chain(e).filter(t):this.chain(e)}children(t){let e=Array.from(this).flatMap(n=>Array.from(n.children)),o=t?e.filter(n=>n.matches(t)):e;return this.chain(o)}siblings(t){let e=Array.from(this).flatMap(o=>{if(o.parentNode)return Array.from(o.parentNode.children).filter(n=>n!==o)}).filter(Boolean);return t?this.chain(e).filter(t):this.chain(e)}index(t){let e=this.el();if(!e?.parentNode)return-1;let n=this.chain(e.parentNode.children).filter(t).get(),a=this.get();return gt(n,i=>w(i,a))}indexOf(t){let e=this.get(),o=this.filter(t).get(0);return e.indexOf(o)}filter(t){if(!t)return this;let e=[];return L(t)?e=Array.from(this).filter(t):e=Array.from(this).filter(o=>{if(x(t))return o.matches&&o.matches(t);if(t instanceof r)return t.get().includes(o);{let n=A(t)?t:[t];return w(o,n)}}),this.chain(e)}is(t){return Array.from(this).filter(o=>typeof t=="string"?o.matches&&o.matches(t):this.isGlobal?w(t,["window","globalThis"]):(t instanceof r?t.get():[t]).includes(o)).length===this.length}not(t){let e=Array.from(this).filter(o=>typeof t=="string"?!o.matches||o.matches&&!o.matches(t):this.isGlobal?!w(t,["window","globalThis"]):!(t instanceof r?t.get():[t]).includes(o));return this.chain(e)}closest(t){let e=Array.from(this).map(o=>{if(this.options.pierceShadow)return this.closestDeep(o,t);if(t&&o?.closest)return o.closest(t);if(this.isGlobal)return w(t,["window","globalThis"])}).filter(Boolean);return this.chain(e)}closestDeep(t,e){let o=t,n=Ht(e),a=x(e);for(;o;){if(n&&o===e||a&&o.matches(e))return o;if(o.parentElement)o=o.parentElement;else if(o.parentNode&&o.parentNode.host)o=o.parentNode.host;else return}}ready(t){return this.is(document)&&document.readyState=="loading"?this.on("ready",t):t.call(document,new Event("DOMContentLoaded")),this}getEventAlias(t){return{ready:"DOMContentLoaded"}[t]||t}getEventArray(t){return t.split(" ").map(e=>this.getEventAlias(e)).filter(Boolean)}on(t,e,o,n){let a=[],i,s;return D(o)?(n=o,i=e):x(e)?(s=e,i=o):L(e)&&(i=e),this.getEventArray(t).forEach(b=>{let l=n?.abortController||new AbortController,c=n?.eventSettings||{},d=l.signal;this.each(m=>{let h;s&&(h=k=>{let M;if(k.composed&&k.composedPath){let S=k.composedPath(),F=gt(S,U=>U==m);S=S.slice(0,F),M=S.find(U=>U instanceof Element&&U.matches&&U.matches(s))}else M=k.target.closest(s);M&&i.call(M,k)});let f=h||i,g=m==r.globalThisProxy?globalThis:m;g.addEventListener&&g.addEventListener(b,f,{signal:d,...c});let p={el:m,eventName:b,eventListener:f,abortController:l,delegated:s!==void 0,handler:i,abort:k=>l.abort(k)};a.push(p)})}),r.eventHandlers||(r.eventHandlers=[]),r.eventHandlers.push(...a),n?.returnHandler?a.length==1?a[0]:a:this}one(t,e,o,n){let a,i;D(o)?(n=o,a=e):x(e)?(i=e,a=o):L(e)&&(a=e),n=n||{};let s=new AbortController;n.abortController=s;let u=function(...b){s.abort(),a.apply(this,b)};return i?this.on(t,i,u,n):this.on(t,u,n)}off(t,e){let o=this.getEventArray(t);return r.eventHandlers=r.eventHandlers.filter(n=>{if((!t||w(n.eventName,o))&&(!e||e?.eventListener==n.eventListener||n.eventListener===e||n.handler===e)){let a=this.isGlobal?globalThis:n.el;return a.removeEventListener&&a.removeEventListener(n.eventName,n.eventListener),!1}return!0}),this}trigger(t,e){return this.each(o=>{if(typeof o.dispatchEvent!="function")return;let n=new Event(t,{bubbles:!0,cancelable:!0});e&&Object.assign(n,e),o.dispatchEvent(n)})}click(t){return this.trigger("click",t)}dispatchEvent(t,e={},o={}){let n={bubbles:!0,cancelable:!0,composed:!0,detail:e,...o};return this.each(a=>{let i=new CustomEvent(t,n);a.dispatchEvent(i)}),this}remove(){return this.each(t=>t.remove())}addClass(t){let e=t.split(" ");return this.each(o=>o.classList.add(...e))}hasClass(t){return Array.from(this).some(e=>e.classList.contains(t))}removeClass(t){let e=t.split(" ");return this.each(o=>o.classList.remove(...e))}toggleClass(t){let e=t.split(" ");return this.each(o=>o.classList.toggle(...e))}html(t){if(t!==void 0)return this.each(e=>e.innerHTML=t);if(this.length>0)return this.map(e=>e.innerHTML||e.nodeValue).join("")}outerHTML(t){if(t!==void 0)return this.each(e=>e.outerHTML=t);if(this.length)return this.map(e=>e.outerHTML).join("")}text(t){if(t!==void 0)return this.each(e=>e.textContent=t);{let e=n=>n.nodeName==="SLOT"?n.assignedNodes({flatten:!0}):n.childNodes,o=this.map(n=>this.getTextContentRecursive(e(n)));return o.length>1?o:o[0]}}getTextContentRecursive(t){return Array.from(t).map(e=>{if(e.nodeType===Node.TEXT_NODE)return e.nodeValue;if(e.nodeName==="SLOT"){let o=e.assignedNodes({flatten:!0});return this.getTextContentRecursive(o)}else return this.getTextContentRecursive(e.childNodes)}).join("").trim()}textNode(){return Array.from(this).map(t=>Array.from(t.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE).map(e=>e.nodeValue).join("")).join("")}map(...t){return Array.from(this).map(...t)}value(t){if(t!==void 0)return this.each(e=>{(e instanceof HTMLInputElement||e instanceof HTMLSelectElement||e instanceof HTMLTextAreaElement)&&(e.value=t)});{let e=this.map(o=>{if(o instanceof HTMLInputElement||o instanceof HTMLSelectElement||o instanceof HTMLTextAreaElement)return o.value});return e.length>1?e:e[0]}}val(...t){return this.value(...t)}focus(){return this.length&&this[0].focus(),this}blur(){return this.length&&this[0].blur(),this}css(t,e=null,o={includeComputed:!1}){let n=Array.from(this);if(nt(t)||e!==null)return nt(t)?Object.entries(t).forEach(([a,i])=>{n.forEach(s=>s.style.setProperty(ut(a),i))}):n.forEach(a=>a.style.setProperty(ut(t),e)),this;if(n?.length){let a=n.map(i=>{let s=i.style[t];if(o.includeComputed)return window.getComputedStyle(i).getPropertyValue(t);if(s)return s});return n.length===1?a[0]:a}}computedStyle(t){return this.css(t,null,{includeComputed:!0})}cssVar(t,e){return this.css(`--${t}`,e,{includeComputed:!0})}attr(t,e){if(nt(t))Object.entries(t).forEach(([o,n])=>{this.each(a=>a.setAttribute(o,n))});else if(e!==void 0)this.each(o=>o.setAttribute(t,e));else if(this.length){let o=this.map(n=>n.getAttribute(t));return o.length>1?o:o[0]}}removeAttr(t){return this.each(e=>e.removeAttribute(t))}el(){return this.get(0)}get(t){return t!==void 0?this[t]:Array.from(this)}eq(t){return this.chain(this[t])}first(){return this.eq(0)}last(){return this.eq(this.length-1)}prop(t,e){return e!==void 0?this.each(o=>{o[t]=e}):this.length==0?void 0:this.length===1?this[0][t]:this.map(o=>o[t])}next(t){let e=this.map(o=>{let n=o.nextElementSibling;for(;n;){if(!t||n.matches(t))return n;n=n.nextElementSibling}return null}).filter(Boolean);return this.chain(e)}prev(t){let e=this.map(o=>{let n=o.previousElementSibling;for(;n;){if(!t||n.matches(t))return n;n=n.previousElementSibling}return null}).filter(Boolean);return this.chain(e)}height(t){return this.prop("innerHeight",t)||this.prop("clientHeight",t)}width(t){return this.prop("innerWidth",t)||this.prop("clientWidth",t)}scrollHeight(t){return(this.isGlobal&&this.isBrowser?this.chain(document.documentElement):this).prop("scrollHeight",t)}scrollWidth(t){return(this.isGlobal&&this.isBrowser?this.chain(document.documentElement):this).prop("scrollWidth",t)}scrollLeft(t){return(this.isGlobal&&this.isBrowser?this.chain(document.documentElement):this).prop("scrollLeft",t)}scrollTop(t){return(this.isGlobal&&this.isBrowser?this.chain(document.documentElement):this).prop("scrollTop",t)}clone(){let t=document.createDocumentFragment();return this.each(e=>{t.appendChild(e.cloneNode(!0))}),this.chain(t.childNodes)}reverse(){let t=this.get().reverse();return this.chain(t)}insertContent(t,e,o){this.chain(e).each(a=>{if(t.insertAdjacentElement)t.insertAdjacentElement(o,a);else switch(o){case"beforebegin":t.parentNode?.insertBefore(a,t);break;case"afterbegin":t.insertBefore(a,t.firstChild);break;case"beforeend":t.appendChild(a);break;case"afterend":t.parentNode?.insertBefore(a,t.nextSibling);break}})}prepend(t){return this.each(e=>{this.insertContent(e,t,"afterbegin")})}append(t){return this.each(e=>{this.insertContent(e,t,"beforeend")})}insertBefore(t){return this.chain(t).each(e=>{this.insertContent(e,this.selector,"beforebegin")})}insertAfter(t){return this.chain(t).each(e=>{this.insertContent(e,this.selector,"afterend")})}detach(){return this.each(t=>{t.parentNode&&t.parentNode.removeChild(t)})}naturalWidth(){let t=this.map(e=>{let o=$(e).clone();o.insertAfter(e).css({position:"absolute",display:"block",transform:"translate(-9999px, -9999px)",zIndex:"-1"});let n=o.width();return o.remove(),n});return t.length>1?t:t[0]}naturalHeight(){let t=this.map(e=>{let o=$(e).clone();o.insertAfter(e).css({position:"absolute",display:"block",transform:"translate(-9999px, -9999px)",zIndex:"-1"});let n=o.height();return o.remove(),n});return t.length>1?t:t[0]}offsetParent({calculate:t=!0}={}){return Array.from(this).map(e=>{if(!t)return e.offsetParent;let o,n,a,i,s=e?.parentNode;for(;s&&!n&&!a&&!i;)s=s?.parentNode,s&&(o=$(s),n=o.computedStyle("position")!=="static",a=o.computedStyle("transform")!=="none",i=o.is("body"));return s})}count(){return this.length}exists(){return this.length>0}initialize(t){document.addEventListener("DOMContentLoaded",()=>{this.settings(t)})}settings(t){this.each(e=>{v(t,(o,n)=>{e[n]=o})})}setting(t,e){this.each(o=>{o[t]=e})}component(){let t=this.map(e=>e.component).filter(Boolean);return t.length>1?t:t[0]}dataContext(){let t=this.map(e=>e.dataContext).filter(Boolean);return t.length>1?t:t[0]}};var O=function(r,t={}){let e=typeof window<"u";return!t?.root&&e&&(t.root=document),new re(r,t)};var R=class r{static current=null;static pendingReactions=new Set;static afterFlushCallbacks=[];static isFlushScheduled=!1;static scheduleReaction(t){r.pendingReactions.add(t),r.scheduleFlush()}static scheduleFlush(){r.isFlushScheduled||(r.isFlushScheduled=!0,typeof queueMicrotask=="function"?queueMicrotask(()=>r.flush()):Promise.resolve().then(()=>r.flush()))}static flush(){r.isFlushScheduled=!1,r.pendingReactions.forEach(t=>t.run()),r.pendingReactions.clear(),r.afterFlushCallbacks.forEach(t=>t()),r.afterFlushCallbacks=[]}static afterFlush(t){r.afterFlushCallbacks.push(t)}static getSource(){if(!r.current||!r.current.context||!r.current.context.trace){console.log("No source available or no current reaction.");return}let t=r.current.context.trace;return t=t.split(`
`).slice(2).join(`
`),t=`Reaction triggered by:
${t}`,console.info(t),t}};var mt=class{constructor(){this.subscribers=new Set}depend(){R.current&&(this.subscribers.add(R.current),R.current.dependencies.add(this))}changed(t){this.subscribers.forEach(e=>e.invalidate(t))}cleanUp(t){this.subscribers.delete(t)}unsubscribe(t){this.subscribers.delete(t)}};var E=class r{constructor(t){this.callback=t,this.dependencies=new Set,this.boundRun=this.run.bind(this),this.firstRun=!0,this.active=!0}run(){this.active&&(R.current=this,this.dependencies.forEach(t=>t.cleanUp(this)),this.dependencies.clear(),this.callback(this),this.firstRun=!1,R.current=null,R.pendingReactions.delete(this))}invalidate(t){this.active=!0,t&&(this.context=t),R.scheduleReaction(this)}stop(){this.active&&(this.active=!1,this.dependencies.forEach(t=>t.unsubscribe(this)))}static get current(){return R.current}static flush=R.flush;static scheduleFlush=R.scheduleFlush;static afterFlush=R.afterFlush;static getSource=R.getSource;static create(t){let e=new r(t);return e.run(),e}static nonreactive(t){let e=R.current;R.current=null;try{return t()}finally{R.current=e}}static guard(t,e=V){if(!R.current)return t();let o=new mt,n,a;o.depend();let i=new r(()=>{a=t(),!i.firstRun&&!e(a,n)&&o.changed(),n=Y(a)});return i.run(),a}};var H=class r{constructor(t,{equalityFunction:e,allowClone:o=!0,cloneFunction:n}={}){this.dependency=new mt,this.allowClone=o,this.equalityFunction=e?X(e):r.equalityFunction,this.clone=n?X(n):r.cloneFunction,this.currentValue=this.maybeClone(t)}static equalityFunction=V;static cloneFunction=Y;get value(){this.dependency.depend();let t=this.currentValue;return Array.isArray(t)||typeof t=="object"?this.maybeClone(t):t}canCloneValue(t){return this.allowClone===!0&&!Vt(t)}maybeClone(t){return this.canCloneValue(t)?A(t)?t=t.map(e=>this.maybeClone(e)):this.clone(t):t}set value(t){this.equalityFunction(this.currentValue,t)||(this.currentValue=this.maybeClone(t),this.dependency.changed({value:t,trace:new Error().stack}))}get(){return this.value}set(t){this.equalityFunction(this.currentValue,t)||(this.value=t)}subscribe(t){return E.create(e=>{t(this.value,e)})}peek(){return this.maybeClone(this.currentValue)}clear(){return this.set(void 0)}push(...t){let e=this.peek();e.push(...t),this.set(e)}unshift(...t){let e=this.peek();e.unshift(...t),this.set(e)}splice(...t){let e=this.peek();e.splice(...t),this.set(e)}map(t){let e=Array.prototype.map.call(this.peek(),t);this.set(e)}filter(t){let e=Array.prototype.filter.call(this.peek(),t);this.set(e)}getIndex(t){return this.get()[t]}setIndex(t,e){let o=this.peek();o[t]=e,this.set(o)}removeIndex(t){let e=this.peek();e.splice(t,1),this.set(e)}setArrayProperty(t,e,o){let n;pe(t)?n=t:(n="all",o=e,e=t);let a=this.peek().map((i,s)=>((n=="all"||s==n)&&(i[e]=o),i));this.set(a)}toggle(){return this.set(!this.peek())}increment(t=1){return this.set(this.peek()+t)}decrement(t=1){return this.set(this.peek()-t)}now(){return this.set(new Date)}getIDs(t){return D(t)?rt([t?._id,t?.id,t?.hash,t?.key].filter(Boolean)):[t]}getID(t){return this.getIDs(t).filter(Boolean)[0]}hasID(t,e){return this.getID(t)===e}getItem(t){return gt(this.currentValue,e=>this.hasID(e,t))}setProperty(t,e,o){if(arguments.length==3){let n=t,a=this.getItem(n);return this.setArrayProperty(a,e,o)}else{o=e,e=t;let n=this.peek();n[e]=o,this.set(n)}}replaceItem(t,e){return this.setIndex(this.getItem(t),e)}removeItem(t){return this.removeIndex(this.getItem(t))}};var wt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},B=r=>(...t)=>({_$litDirective$:r,values:t}),at=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,o){this._$Ct=t,this._$AM=e,this._$Ci=o}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Zo}=go;var yo=r=>r.strings===void 0,wo=()=>document.createComment(""),yt=(r,t,e)=>{let o=r._$AA.parentNode,n=t===void 0?r._$AB:t._$AA;if(e===void 0){let a=o.insertBefore(wo(),n),i=o.insertBefore(wo(),n);e=new Zo(a,i,r,r.options)}else{let a=e._$AB.nextSibling,i=e._$AM,s=i!==r;if(s){let u;e._$AQ?.(r),e._$AM=r,e._$AP!==void 0&&(u=r._$AU)!==i._$AU&&e._$AP(u)}if(a!==n||s){let u=e._$AA;for(;u!==a;){let b=u.nextSibling;o.insertBefore(u,n),u=b}}}return e},it=(r,t,e=r)=>(r._$AI(t,e),r),Qo={},ko=(r,t=Qo)=>r._$AH=t,So=r=>r._$AH,ae=r=>{r._$AP?.(!1,!0);let t=r._$AA,e=r._$AB.nextSibling;for(;t!==e;){let o=t.nextSibling;t.remove(),t=o}};var _t=(r,t)=>{let e=r._$AN;if(e===void 0)return!1;for(let o of e)o._$AO?.(t,!1),_t(o,t);return!0},ie=r=>{let t,e;do{if((t=r._$AM)===void 0)break;e=t._$AN,e.delete(r),r=t}while(e?.size===0)},Co=r=>{for(let t;t=r._$AM;r=t){let e=t._$AN;if(e===void 0)t._$AN=e=new Set;else if(e.has(r))break;e.add(r),on(t)}};function tn(r){this._$AN!==void 0?(ie(this),this._$AM=r,Co(this)):this._$AM=r}function en(r,t=!1,e=0){let o=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(t)if(Array.isArray(o))for(let a=e;a<o.length;a++)_t(o[a],!1),ie(o[a]);else o!=null&&(_t(o,!1),ie(o));else _t(this,r)}var on=r=>{r.type==wt.CHILD&&(r._$AP??=en,r._$AQ??=tn)},Z=class extends at{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,o){super._$AT(t,e,o),Co(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(_t(this,t),ie(this))}setValue(t){if(yo(this._$Ct))this._$Ct._$AI(t,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}};var Dt=class extends at{constructor(t){if(super(t),this.it=y,t.type!==wt.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===y||t==null)return this._t=void 0,this.it=t;if(t===G)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;let e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};Dt.directiveName="unsafeHTML",Dt.resultType=1;var Ao=B(Dt);var To=r=>r??y;var se=class extends Z{constructor(t){super(t),this.partInfo=t,this.reaction=null}render(t,e={}){if(this.expression=t,this.settings=e,this.reaction)return this.getReactiveValue();{let o;return this.reaction=E.create(n=>{if(!this.isConnected){n.stop();return}o=this.getReactiveValue(),this.settings.unsafeHTML&&(o=Ao(o)),n.firstRun||this.setValue(o)}),o}}getReactiveValue(){let t=this.expression.value();return this.settings.ifDefined&&w(t,[void 0,null,!1,0])?To(void 0):((A(t)||D(t))&&(t=JSON.stringify(t)),t)}disconnected(){this.reaction&&(this.reaction.stop(),this.reaction=null)}reconnected(){}},Eo=B(se);var ue=class extends Z{constructor(t){super(t),this.reaction=null}render(t){this.reaction&&this.reaction.stop();let e=y;return this.reaction=E.create(o=>{if(!this.isConnected){o.stop();return}if(t.condition())e=t.content();else if(t.branches?.length){let n=!1;v(t.branches,a=>{(!n&&a.type=="elseif"&&a.condition()||!n&&a.type=="else")&&(n=!0,e=a.content())})}else e=y;return e||(e=y),o.firstRun||this.setValue(e),e}),e}disconnected(){this.reaction&&(this.reaction.stop(),this.reaction=null)}reconnected(){}},$o=B(ue);var Lo=(r,t,e)=>{let o=new Map;for(let n=t;n<=e;n++)o.set(r[n],n);return o},Ne=B(class extends at{constructor(r){if(super(r),r.type!==wt.CHILD)throw Error("repeat() can only be used in text expressions")}dt(r,t,e){let o;e===void 0?e=t:t!==void 0&&(o=t);let n=[],a=[],i=0;for(let s of r)n[i]=o?o(s,i):i,a[i]=e(s,i),i++;return{values:a,keys:n}}render(r,t,e){return this.dt(r,t,e).values}update(r,[t,e,o]){let n=So(r),{values:a,keys:i}=this.dt(t,e,o);if(!Array.isArray(n))return this.ut=i,a;let s=this.ut??=[],u=[],b,l,c=0,d=n.length-1,m=0,h=a.length-1;for(;c<=d&&m<=h;)if(n[c]===null)c++;else if(n[d]===null)d--;else if(s[c]===i[m])u[m]=it(n[c],a[m]),c++,m++;else if(s[d]===i[h])u[h]=it(n[d],a[h]),d--,h--;else if(s[c]===i[h])u[h]=it(n[c],a[h]),yt(r,u[h+1],n[c]),c++,h--;else if(s[d]===i[m])u[m]=it(n[d],a[m]),yt(r,n[c],n[d]),d--,m++;else if(b===void 0&&(b=Lo(i,m,h),l=Lo(s,c,d)),b.has(s[c]))if(b.has(s[d])){let f=l.get(i[m]),g=f!==void 0?n[f]:null;if(g===null){let p=yt(r,n[c]);it(p,a[m]),u[m]=p}else u[m]=it(g,a[m]),yt(r,n[c],g),n[f]=null;m++}else ae(n[d]),d--;else ae(n[c]),c++;for(;m<=h;){let f=yt(r,u[h+1]);it(f,a[m]),u[m++]=f}for(;c<=d;){let f=n[c++];f!==null&&ae(f)}return this.ut=i,ko(r,u),G}});var le=class extends Z{constructor(t){super(t),this.reaction=null,this.items=[],this.eachCondition=null}render(t,e={}){return this.eachCondition=t,this.reaction&&(this.reaction.stop(),this.reaction=null),this.reaction=E.create(o=>{if(!this.isConnected){o.stop();return}if(this.items=this.getItems(this.eachCondition),!o.firstRun){let n=this.renderItems();this.setValue(n)}}),this.renderItems()}renderItems(){let t=this.getItems(this.eachCondition);if(!t?.length>0&&this.eachCondition.else)return Ne([1],()=>"else-case",()=>this.eachCondition.else());let e=this.getCollectionType(t);return e=="object"&&(t=Ft(t)),Ne(t,(o,n)=>this.getItemID(o,n,e),(o,n)=>this.getTemplate(o,n,e))}getCollectionType(t){return A(t)?"array":"object"}getItems(){return this.eachCondition.over()||[]}getTemplate(t,e,o){let n=this.getEachData(t,e,o,this.eachCondition);return this.eachCondition.content(n)}getItemID(t,e,o){return nt(t)?(o=="object"?e:void 0)||t._id||t.id||t.key||t.hash||t._hash||t.value||e:x(t)?t:e}getEachData(t,e,o,n){let{as:a,indexAs:i}=n;return i||(i=o=="array"?"index":"key"),o=="object"&&(t=t.value,e=t.key),a?{[a]:t,[i]:e}:{...t,this:t,[i]:e}}disconnected(){this.reaction&&(this.reaction.stop(),this.reaction=null)}reconnected(){}},No=B(le);var ce=class extends Z{constructor(t){super(t),this.renderRoot=t.options?.host?.renderRoot,this.template=null,this.part=null}render({getTemplate:t,templateName:e,subTemplates:o,data:n,parentTemplate:a}){return this.parentTemplate=a,this.getTemplate=t,this.subTemplates=o,this.data=n,this.ast=null,this.reaction=E.create(i=>{this.maybeCreateTemplate();let s=this.unpackData(this.data);if(!this.isConnected){i.stop();return}if(i.firstRun||!this.template||this.template?.ast.length==0)return;let u=this.renderTemplate(s);this.setValue(u)}),this.maybeCreateTemplate(),!this.template||this.template?.ast.length==0?y:this.renderTemplate()}renderTemplate(t){return this.attachTemplate(),t||(t=this.unpackData(this.data)),this.template.setDataContext(t),this.template.render()}maybeCreateTemplate(){let t,e,o=this.getTemplate();if(x(o)?(t=o,e=this.subTemplates[t]):o instanceof It&&(e=o,t=e.templateName),!e)return!1;this.templateID=e.id,this.template=e.clone({templateName:t,subTemplates:this.subTemplates,data:this.unpackData(this.data)})}attachTemplate(){let{parentNode:t,startNode:e,endNode:o}=this.part||{},n=this.part?.options?.host,a=n?.renderRoot;this.template.setElement(n),this.template.attach(a,{element:n,parentNode:t,startNode:e,endNode:o}),this.parentTemplate&&this.template.setParent(this.parentTemplate)}unpackData(t){return j(t,e=>e())}update(t,e){return this.part=t,this.render.apply(this,e)}reconnected(){}disconnected(){this.template&&this.template.onDestroyed()}},Po=B(ce);var Ot=class r{static html=Le;static PARENS_REGEXP=/('[^']*'|"[^"]*"|\(|\)|[^\s()]+)/g;static STRING_REGEXP=/^\'(.*)\'$/;static WRAPPED_EXPRESSION=/(\s|^)([\[{].*?[\]}])(\s|$)/g;static VAR_NAME_REGEXP=/^[a-zA-Z_$][0-9a-zA-Z_$]*$/;static useSubtreeCache=!1;static getID({ast:t,data:e,isSVG:o}={}){return Ct({ast:t})}constructor({ast:t,data:e,template:o,subTemplates:n,snippets:a,helpers:i,isSVG:s}){this.ast=t||"",this.data=e,this.renderTrees={},this.treeIDs=[],this.template=o,this.subTemplates=n,this.resetHTML(),this.snippets=a||{},this.helpers=i||{},this.isSVG=s,this.id=r.getID({ast:t,data:e,isSVG:s})}resetHTML(){this.html=[],this.html.raw=[],this.expressions=[]}render({ast:t=this.ast,data:e=this.data}={}){this.resetHTML(),this.readAST({ast:t,data:e}),this.clearTemp();let o=this.isSVG?mo:Le;return this.litTemplate=o.apply(this,[this.html,...this.expressions]),this.litTemplate}cachedRender(t){return t&&this.updateData(t),this.litTemplate}readAST({ast:t=this.ast,data:e=this.data}={}){v(t,o=>{switch(o.type){case"html":this.addHTML(o.html);break;case"svg":this.addValue(this.evaluateSVG(o.content,e));break;case"expression":let n=this.evaluateExpression(o.value,e,{unsafeHTML:o.unsafeHTML,ifDefined:o.ifDefined,asDirective:!0});this.addValue(n);break;case"if":this.addValue(this.evaluateConditional(o,e));break;case"each":this.addValue(this.evaluateEach(o,e));break;case"template":this.addValue(this.evaluateTemplate(o,e));break;case"snippet":this.snippets[o.name]=o;break;case"slot":o.name?this.addHTML(`<slot name="${o.name}"></slot>`):this.addHTML("<slot></slot>");break}})}evaluateConditional(t,e){let o=(a,i)=>i=="branches"?a.map(s=>(s.condition&&(s.expression=s.condition),j(s,o))):i=="condition"?()=>this.evaluateExpression(a,e):i=="content"?()=>this.renderContent({ast:a,data:e}):a;t.expression=t.condition;let n=j(t,o);return $o(n)}evaluateEach(t,e){let n=j(t,(a,i)=>i=="over"?s=>this.evaluateExpression(a,e):i=="content"?s=>(e={...this.data,...s},this.renderContent({ast:a,data:e})):i=="else"?s=>this.renderContent({ast:a.content,data:this.data}):a);return No(n,e)}evaluateTemplate(t,e={}){let o=this.lookupExpressionValue(t.name,e);return this.snippets[o]?this.evaluateSnippet(t,e):this.evaluateSubTemplate(t,e)}evaluateSVG(t,e){return this.renderContent({isSVG:!0,ast:t,data:e})}getPackedValue=(t,e,{reactive:o=!1}={})=>{let n=a=>this.evaluateExpression(a,e);return o?()=>n(t):()=>E.nonreactive(()=>n(t))};getPackedNodeData(t,e,{inheritParent:o=!1}={}){let n=(s,u={})=>{let b={};if(x(s)){let l=s;s=this.evaluateExpression(l,e,u),b=j(s,X)}else nt(s)&&(b=j(s,l=>this.getPackedValue(l,e,u)));return b},a=n(t.data),i=n(t.reactiveData,{reactive:!0});return e={...o?this.data:{},...a,...i},e}evaluateSnippet(t,e={}){let o=this.lookupExpressionValue(t.name,e),n=this.snippets[o];n||At(`Snippet "${o}" not found`);let a=this.getPackedNodeData(t,e,{inheritParent:!0});return this.renderContent({ast:n.content,data:a})}evaluateSubTemplate(t,e={}){let o=this.getPackedNodeData(t,e);return Po({subTemplates:this.subTemplates,templateName:t.name,getTemplate:()=>this.evaluateExpression(t.name,e),data:o,parentTemplate:this.template})}evaluateExpression(t,e=this.data,{asDirective:o=!1,ifDefined:n=!1,unsafeHTML:a=!1}={}){return typeof t=="string"?o?Eo({expression:t,value:()=>this.lookupExpressionValue(t,this.data)},{ifDefined:n,unsafeHTML:a}):this.lookupExpressionValue(t,e):t}getExpressionArray(t){let e=t.match(r.PARENS_REGEXP)||[],o=n=>{let a=[];for(;n.length>0;){let i=n.shift();if(i==="(")a.push(o(n));else{if(i===")")return a;a.push(i)}}return a};return o(e)}evaluateJavascript(t,e={},{includeHelpers:o=!0}={}){let n;o&&(e={...this.helpers,...e},e=qe(e,(a,i)=>!["debugger"].includes(i)&&r.VAR_NAME_REGEXP.test(i)));try{let a=Object.keys(e),i=Object.values(e);v(i,(s,u)=>{s instanceof H&&Object.defineProperty(i,u,{get(){return s.peek()},configurable:!0,enumerable:!0}),L(s)&&s.length===0&&!s.name&&Object.defineProperty(i,u,{get(){return s()},configurable:!0,enumerable:!0})}),n=new Function(...a,`return ${t}`)(...i)}catch{}return n}lookupExpressionValue(t="",e={},o=new Set){if(o.has(t))return;if(o.add(t),!t.includes(" ")){let l=this.lookupTokenValue(t,e);if(l!==void 0)return X(l)()}let a=this.evaluateJavascript(t,e);if(a!==void 0){let l=this.accessTokenValue(a,t,e);return o.delete(t),X(l)()}x(t)&&(t=this.addParensToExpression(t));let i=A(t)?t:this.getExpressionArray(t),s=[],u,b=i.length;for(;b--;){let l=i[b];if(A(l))u=this.lookupExpressionValue(l.join(" "),e,o),s.unshift(u);else{let c=this.lookupTokenValue(l,e);u=L(c)?c(...s):c,s.unshift(u)}}return o.delete(t),u}lookupTokenValue(t="",e){if(A(t))return this.lookupExpressionValue(t,e);let o=this.getLiteralValue(t);if(o!==void 0)return o;let n=this.getDeepDataValue(e,t),a=this.accessTokenValue(n,t,e);if(a!==void 0)return a;let i=this.helpers[t];if(L(i))return i}getDeepDataValue(t,e){return e.split(".").reduce((o,n)=>{if(o===void 0)return;let a=o instanceof H?o.get():X(o)();if(a!=null)return a[n]},t)}accessTokenValue(t,e,o){let n=(a,i)=>{let s=a.split(".").slice(0,-1).join(".");return this.getDeepDataValue(i,s)};if(L(t)&&e.search(".")!==-1){let a=n(e,o);t=t.bind(a)}if(t!==void 0)return t instanceof H?t.value:t}addParensToExpression(t=""){return String(t).replace(r.WRAPPED_EXPRESSION,(e,o,n,a)=>`${o}(${n})${a}`)}getLiteralValue(t){if(t.length>1&&(t[0]==="'"||t[0]==='"')&&t[0]===t[t.length-1])return t.slice(1,-1).replace(/\\(['"])/g,"$1");let e={true:!0,false:!1};if(e[t]!==void 0)return e[t];if(!Number.isNaN(parseFloat(t)))return Number(t)}addHTML(t){this.lastHTML&&(t=`${this.html.pop()}${t}`),this.html.push(t),this.html.raw.push(String.raw({raw:t})),this.lastHTML=!0}addHTMLSpacer(){this.addHTML("")}addValue(t){this.addHTMLSpacer(),this.expressions.push(t),this.lastHTML=!1,this.addHTMLSpacer()}renderContent({ast:t,data:e,isSVG:o=this.isSVG}={}){let n=r.getID({ast:t,data:e,isSVG:o}),a=this.renderTrees[n],i=a?a.deref():void 0;if(r.useSubtreeCache&&i)return i.cachedRender(e);let s=new r({ast:t,data:e,isSVG:o,subTemplates:this.subTemplates,snippets:this.snippets,helpers:this.helpers,template:this.template});return this.treeIDs.push(n),this.renderTrees[n]=new WeakRef(s),s.render()}cleanup(){this.renderTrees=[]}setData(t){this.updateData(t),this.updateSubtreeData(t)}updateSubtreeData(t){v(this.renderTrees,(e,o)=>{let n=e.deref();n&&n.updateData(t)})}updateData(t){v(this.data,(e,o)=>{delete this.data[o]}),v(t,(e,o)=>{this.data[o]!==e&&(this.data[o]=e)})}clearTemp(){delete this.lastHTML}};var ot={exists(r){return!me(r)},isEmpty(r){return me(r)},stringify(r){return JSON.stringify(r)},hasAny(r){return r?.length>0},range(r,t,e=1){return Je(r,t,e)},concat(...r){return r.join("")},both(r,t){return r&&t},either(r,t){return r||t},join(r=[],t=" ",e=!1){if(r.length==0)return;let o=r.join(t).trim();return e?`${o} `:o},classes(r,t=!0){return ot.join(r," ",!0)},joinComma(r=[],t,e){return to(r,{separator:", ",lastSeparator:" and ",oxford:t,quotes:e})},classIf(r,t="",e=""){let o=r?t:e;return o?`${o} `:""},classMap(r){let t=[];return v(r,(e,o)=>{e&&t.push(o)}),t.length?`${t.join(" ")} `:""},maybe(r,t,e){return r?t:e},activeIf(r){return ot.classIf(r,"active","")},selectedIf(r){return ot.classIf(r,"selected","")},capitalize(r=""){return jt(r)},titleCase(r=""){return Et(r)},disabledIf(r){return ot.classIf(r,"disabled","")},checkedIf(r){return ot.classIf(r,"checked","")},maybePlural(r,t="s"){return r==1?"":t},not(r){return!r},is(r,t){return r==t},notEqual(r,t){return r!==t},isExactly(r,t){return r===t},isNotExactly(r,t){return r!==t},greaterThan(r,t){return r>t},lessThan(r,t){return r<t},greaterThanEquals(r,t){return r>=t},lessThanEquals(r,t){return r<=t},numberFromIndex(r){return r+1},formatDate(r=new Date,t="L",e={timezone:"local"}){return Wt(r,t,e)},formatDateTime(r=new Date,t="LLL",e={timezone:"local"}){return Wt(r,t,e)},formatDateTimeSeconds(r=new Date,t="LTS",e={timezone:"local"}){return Wt(r,t,e)},object({obj:r}){return r},log(...r){console.log(...r)},debugger(){debugger},tokenize(r=""){return Bt(r)},debugReactivity(){E.getSource()},arrayFromObject(r){return Ft(r)},escapeHTML(r){return Ue(r)},guard:E.guard,nonreactive:E.nonreactive};var It=class P{static templateCount=0;static isServer=J;constructor({templateName:t,ast:e,template:o,data:n,element:a,renderRoot:i,css:s,events:u,keys:b,defaultState:l,subTemplates:c,createComponent:d,parentTemplate:m,renderingEngine:h="lit",isPrototype:f=!1,attachStyles:g=!1,onCreated:p=N,onRendered:k=N,onUpdated:M=N,onDestroyed:S=N,onThemeChanged:F=N}={}){e||(e=new pt(o).compile()),this.events=u,this.keys=b||{},this.ast=e,this.css=s,this.data=n||{},this.reactions=[],this.defaultState=l,this.state=this.createReactiveState(l,n)||{},this.templateName=t||this.getGenericTemplateName(),this.subTemplates=c,this.createComponent=d,this.onCreated=N,this.onDestroyed=N,this.onRendered=N,this.onRenderedCallback=k,this.onDestroyedCallback=S,this.onCreatedCallback=p,this.onThemeChangedCallback=F,this.id=je(),this.isPrototype=f,this.parentTemplate=m,this.attachStyles=g,this.element=a,this.renderingEngine=h,i&&this.attach(i)}createReactiveState(t,e){let o={},n=(a,i)=>{let s=I(e,i);return s||a?.value||a};return v(t,(a,i)=>{let s=n(a,i);a?.options?o[i]=new H(s,a.options):o[i]=new H(s)}),o}setDataContext(t,{rerender:e=!0}={}){this.data=t,e&&(this.rendered=!1)}setParent(t){t._childTemplates||(t._childTemplates=[]),t._childTemplates.push(this),this._parentTemplate=t}setElement(t){this.element=t}getGenericTemplateName(){return P.templateCount++,`Anonymous #${P.templateCount}`}initialize(){let t=this,e;this.instance={},L(this.createComponent)&&(e=this.call(this.createComponent)||{},Ge(t.instance,e)),L(t.instance.initialize)&&this.call(t.instance.initialize.bind(t)),t.instance.templateName=this.templateName,this.onCreated=()=>{this.call(this.onCreatedCallback),P.addTemplate(this),this.dispatchEvent("created",{component:this.instance},{},{triggerCallback:!1})},this.onRendered=()=>{this.call(this.onRenderedCallback),this.dispatchEvent("rendered",{component:this.instance},{},{triggerCallback:!1})},this.onUpdated=()=>{this.dispatchEvent("updated",{component:this.instance},{},{triggerCallback:!1})},this.onThemeChanged=(...o)=>{this.call(this.onThemeChangedCallback,...o)},this.onDestroyed=()=>{P.removeTemplate(this),this.rendered=!1,this.clearReactions(),this.removeEvents(),this.call(this.onDestroyedCallback),this.dispatchEvent("destroyed",{component:this.instance},{},{triggerCallback:!1})},this.initialized=!0,this.renderingEngine=="lit"?this.renderer=new Ot({ast:this.ast,data:this.getDataContext(),template:this,subTemplates:this.subTemplates,helpers:ot}):At("Unknown renderer specified",this.renderingEngine),this.onCreated()}async attach(t,{parentNode:e=t,startNode:o,endNode:n}={}){this.initialized||this.initialize(),this.renderRoot!=t&&(this.renderRoot=t,this.parentNode=e,this.startNode=o,this.endNode=n,this.attachEvents(),this.bindKeys(),this.attachStyles&&await this.adoptStylesheet())}getDataContext(){return{...this.data,...this.state,...this.instance}}async adoptStylesheet(){if(!this.css||!this.renderRoot||!this.renderRoot.adoptedStyleSheets)return;let t=this.css;this.stylesheet||(this.stylesheet=new CSSStyleSheet,await this.stylesheet.replace(t)),Array.from(this.renderRoot.adoptedStyleSheets).some(n=>V(n.cssRules,this.stylesheet.cssRules))||(this.renderRoot.adoptedStyleSheets=[...this.renderRoot.adoptedStyleSheets,this.stylesheet])}clone(t){let o={...{templateName:this.templateName,element:this.element,ast:this.ast,css:this.css,defaultState:this.defaultState,events:this.events,keys:this.keys,renderingEngine:this.renderingEngine,subTemplates:this.subTemplates,onCreated:this.onCreatedCallback,onThemeChanged:this.onThemeChangedCallback,onRendered:this.onRenderedCallback,parentTemplate:this.parentTemplate,onDestroyed:this.onDestroyedCallback,createComponent:this.createComponent},...t};return new P(o)}parseEventString(t){let e="delegated";v(["deep","global"],c=>{t.startsWith(c)&&(t=t.replace(c,""),e=c)}),t=t.trim();let n=c=>{let d={blur:"focusout",focus:"focusin",load:"DOMContentLoaded",unload:"beforeunload",mouseenter:"mouseover",mouseleave:"mouseout"};return d[c]&&(c=d[c]),c},a=[],i=t.split(/\s+/),s=!1,u=!1,b=[],l=[];return v(i,(c,d)=>{let m=c.replace(/(\,|\W)+$/,"").trim(),h=c.includes(",");if(!s)b.push(n(m)),s=!h;else if(!u){let f=i.slice(d).join(" ").split(",");v(f,g=>{l.push(g.trim())}),u=!0}}),v(b,c=>{l.length||l.push(""),v(l,d=>{a.push({eventName:c,eventType:e,selector:d})})}),a}attachEvents(t=this.events){(!this.parentNode||!this.renderRoot)&&At("You must set a parent before attaching events"),this.removeEvents(),this.eventController=new AbortController,!P.isServer&&this.onThemeChangedCallback!==N&&O("html").on("themechange",e=>{this.onThemeChanged({additionalData:{event:e,...e.detail}})},{abortController:this.eventController}),v(t,(e,o)=>{let n=this.parseEventString(o),a=this;v(n,i=>{let{eventName:s,selector:u,eventType:b}=i;u&&O(u,{root:this.renderRoot}).on(s,N,{abortController:this.eventController});let l=function(d){if(b!=="global"&&!a.isNodeInTemplate(d.target))return;let m=u&&O(d.target).closest(u).length==0;if(b!=="deep"&&m||w(s,["mouseover","mouseout"])&&d.relatedTarget&&d.target.contains(d.relatedTarget))return;let h=this,f=e.bind(h),g=d?.detail||{},p=h?.dataset,k=h?.value||d.target?.value||d?.detail?.value;a.call(f,{additionalData:{event:d,isDeep:m,target:h,value:k,data:{...p,...g}}})},c={abortController:this.eventController};b=="global"?O(u).on(s,l,c):O(this.renderRoot).on(s,u,l,c)})})}removeEvents(){this.eventController&&this.eventController.abort("Template destroyed")}bindKeys(t=this.keys){if(J||Object.keys(t).length==0)return;let e=500,o={abortController:this.eventController};this.currentSequence="",O(document).on("keydown",n=>{let a=Qe(n),i=a==this.currentKey;this.currentKey=a,this.currentSequence+=a,v(this.keys,(s,u)=>{u=u.replace(/\s*\+\s*/g,"+");let b=u.split(",");if(Ze(b,l=>this.currentSequence.endsWith(l))){let l=document.activeElement instanceof HTMLElement&&(["input","select","textarea"].includes(document.activeElement.tagName.toLowerCase())||document.activeElement.isContentEditable);this.call(s,{additionalData:{event:n,inputFocused:l,repeatedKey:i}})!==!0&&n.preventDefault()}}),this.currentSequence+=" ",clearTimeout(this.resetSequence),this.resetSequence=setTimeout(()=>{this.currentSequence=""},e)},o).on("keyup",n=>{this.currentKey=""},o)}bindKey(t,e){if(!t||!e)return;let o=Object.keys(this.keys).length==0;this.keys[t]=e,o&&this.bindKeys()}unbindKey(t){delete this.keys[t]}isNodeInTemplate(t){return((n,a=this.startNode,i=this.endNode)=>{if(!a||!i)return!0;if(n===null)return!1;let s=a.compareDocumentPosition(n),u=i.compareDocumentPosition(n),b=(s&Node.DOCUMENT_POSITION_FOLLOWING)!==0,l=(u&Node.DOCUMENT_POSITION_PRECEDING)!==0;return b&&l})((n=>{for(;n&&n.parentNode!==this.parentNode;)n.parentNode===null&&n.host?n=n.host:n=n.parentNode;return n})(t))}render(t={}){this.initialized||this.initialize();let e={...this.getDataContext(),...t};return this.setDataContext(e,{rerender:!1}),this.renderer.setData(e),this.rendered||(this.html=this.renderer.render(),setTimeout(this.onRendered,0)),this.rendered=!0,setTimeout(this.onUpdated,0),this.html}$(t,{root:e=this.renderRoot,filterTemplate:o=!0,...n}={}){if(!P.isServer&&w(t,["body","document","html"])&&(e=document),e||(e=globalThis),e==this.renderRoot){let a=O(t,{root:e,...n});return o?a.filter(i=>this.isNodeInTemplate(i)):a}else return O(t,{root:e,...n})}$$(t,e){return this.$(t,{root:this.renderRoot,pierceShadow:!0,filterTemplate:!0,...e})}call(t,{params:e,additionalData:o={},firstArg:n,additionalArgs:a}={}){let i=[];if(!this.isPrototype){if(!e){let s=this.element;e={el:this.element,tpl:this.instance,self:this.instance,component:this.instance,$:this.$.bind(this),$$:this.$$.bind(this),reaction:this.reaction.bind(this),signal:this.signal.bind(this),afterFlush:E.afterFlush,nonreactive:E.nonreactive,flush:E.flush,data:this.data,settings:this.element?.settings,state:this.state,isRendered:()=>this.rendered,isServer:P.isServer,isClient:!P.isServer,dispatchEvent:this.dispatchEvent.bind(this),attachEvent:this.attachEvent.bind(this),bindKey:this.bindKey.bind(this),unbindKey:this.unbindKey.bind(this),abortController:this.eventController,helpers:ot,template:this,templateName:this.templateName,templates:P.renderedTemplates,findTemplate:this.findTemplate,findParent:this.findParent.bind(this),findChild:this.findChild.bind(this),findChildren:this.findChildren.bind(this),content:this.instance.content,get darkMode(){return s.isDarkMode()},...o},i.push(e)}if(a&&i.push(...a),L(t))return t.apply(this.element,i)}}attachEvent(t,e,o,{eventSettings:n={},querySettings:a={pierceShadow:!0}}={}){return O(t,document,a).on(e,o,{abortController:this.eventController,returnHandler:!0,...n})}dispatchEvent(t,e,o,{triggerCallback:n=!0}={}){if(!P.isServer){if(n){let a=`on${jt(t)}`,i=this.element[a];X(i).call(this.element,e)}return O(this.element).dispatchEvent(t,e,o)}}reaction(t){this.reactions.push(E.create(t))}signal(t,e){return new H(t,e)}clearReactions(){v(this.reactions||[],t=>t.stop())}findTemplate=t=>P.findTemplate(t);findParent=t=>P.findParentTemplate(this,t);findChild=t=>P.findChildTemplate(this,t);findChildren=t=>P.findChildTemplates(this,t);static renderedTemplates=new Map;static addTemplate(t){if(t.isPrototype)return;let e=P.renderedTemplates.get(t.templateName)||[];e.push(t),P.renderedTemplates.set(t.templateName,e)}static removeTemplate(t){if(t.isPrototype)return;let e=P.renderedTemplates.get(t.templateName)||[];Xe(e,o=>o.id==t.id),P.renderedTemplates.set(e)}static getTemplates(t){return P.renderedTemplates.get(t)||[]}static findTemplate(t){return P.getTemplates(t)[0]}static findParentTemplate(t,e){let o,n=a=>!(o||!a?.templateName||e&&a?.templateName!==e);if(!o){let a=t.element?.parentNode;for(;a;){if(n(a.component)){o={...a.component,...a.dataContext};break}a=a.parentNode}}for(;t;)if(t=t._parentTemplate,n(t)){o={...t.instance,...t.data};break}return o}static findChildTemplates(t,e){let o=[];function n(a,i){(!i||a.templateName===i)&&o.push({...a.instance,...a.data}),a._childTemplates&&a._childTemplates.forEach(s=>{n(s,i)})}return n(t,e),o}static findChildTemplate(t,e){return P.findChildTemplates(t,e)[0]}};var nn=/\s+/mg,Mo=["disabled","value"],rn=r=>x(r)?r.split("-").reverse().join("-"):r,an=r=>x(r)?r.replaceAll(nn,"-"):r,zt=({el:r,attribute:t,attributeValue:e,properties:o,componentSpec:n,oldValue:a})=>{let i=({attribute:l,optionValue:c,optionAttributeValue:d})=>{c=an(c);let m=[c];l&&c&&(m.push(`${l}-${e}`),m.push(`${e}-${l}`)),m.push(rn(c)),m=rt(m);let h=Ke(m,g=>I(n.optionAttributes,g));return h?w(e?.constructor,[Object,Array,Function])?{matchingAttribute:void 0,matchingValue:void 0}:{matchingAttribute:I(n.optionAttributes,h),matchingValue:h}:{matchingAttribute:void 0,matchingValue:void 0}},s=(l,c)=>{let d=q(l);c!==void 0&&(r[d]=c),w(l,Mo)&&r.requestUpdate()},u=l=>{let c=q(l);r[c]=null,w(l,Mo)&&r.requestUpdate()},b=(l,c)=>{let d=n.propertyTypes[l]==Boolean,m=n.optionAttributes[l]==l,h=w(l,n.attributeClasses);return(d||h||m)&&w(c,["",!0,l])};if(n){if(t=="class"&&e){let l=x(a)?a.split(" "):[],c=e.split(" "),d=ge(l,c),m=ge(c,l);v(d,h=>{zt({el:r,attribute:h,attributeValue:null,componentSpec:n})}),v(m,h=>{zt({el:r,attribute:h,attributeValue:!0,componentSpec:n})})}else if(w(t,n.attributes)){if(b(t,e)){e=!0,s(t,e);return}if(e===null){u(t);return}let{matchingValue:l}=i({attribute:t,optionValue:e});l&&s(t,l)}else if(e!==void 0){let{matchingAttribute:l,matchingValue:c}=i({optionValue:t,optionAttributeValue:e});if(l&&e===null){r[l]==t&&u(l);return}l&&c&&s(l,c)}}else if(o&&e!==void 0&&t.includes("-")){let l=q(t),c=o[t];if(l!==t&&c?.alias){let d=c?.converter?.fromAttribute,m=d?d(e):e;m&&s(l,m);return}}};var kt=class r extends et{static shadowRootOptions={...et.shadowRootOptions,delegatesFocus:!1};static scopedStyleSheet=null;constructor(){super(),this.renderCallbacks=[]}updated(){super.updated(),v(this.renderCallbacks,t=>t())}addRenderCallback(t){this.renderCallbacks.push(t)}static getProperties({properties:t={},defaultSettings:e,componentSpec:o}){return Ye(t).length||(o&&(t.class={type:String,noAccessor:!0,alias:!0},v(o.attributes,n=>{let a=o.propertyTypes[n],i=q(n);t[i]=r.getPropertySettings(n,a)}),v(o.properties,n=>{let a=o.propertyTypes[n],i=q(n);t[i]=r.getPropertySettings(n,a)}),v(o.optionAttributes,(n,a)=>{let i=q(a);t[i]={type:String,noAccessor:!0,alias:!0,attribute:a}})),e&&v(e,(n,a)=>{let i={propertyOnly:Vt(n)};t[a]=n?.type?e:r.getPropertySettings(a,n?.constructor,i)}),v(t,(n,a)=>{let i=ut(a);i!==a&&!t[i]&&t[a]&&(t[i]={...t[a],noAccessor:!0,alias:!0})})),t}static getPropertySettings(t,e=String,{propertyOnly:o=!1}={}){let n={type:e,attribute:!0,hasChanged:(a,i)=>!V(a,i)};return o||e==Function?(n.attribute=!1,n.hasChanged=(a,i)=>!0):e==Boolean&&(n.converter={fromAttribute:(a,i)=>w(a,["false","0","null","undefined"])?!1:w(a,["",!0,"true"])?!0:!!a,toAttribute:(a,i)=>String(a)}),n}setDefaultSettings({defaultSettings:t={},componentSpec:e}){this.defaultSettings=t,v(t,(o,n)=>{o?.default!==void 0?this.defaultSettings[n]=o.default:this.defaultSettings[n]=o}),e?.defaultValues&&(this.defaultSettings={...e.defaultValues,...this.defaultSettings})}getSettingsFromConfig({componentSpec:t,properties:e}){let o={};return v(e,(n,a)=>{if(n.alias===!0)return;let i=this[a],s=i??this.defaultSettings[a]??(t?.defaultSettings||{})[a];s!==void 0&&(o[a]=s),t&&o[i]!==void 0&&(o[a]=!0)}),o}createSettingsProxy({componentSpec:t,properties:e}){let o=this;return o.settingsVars=new Map,new Proxy({},{get:(n,a)=>{let i=o.getSettings({componentSpec:t,properties:e}),s=I(i,a),u=o.settingsVars.get(a);return u?u.get():(u=new H(s),o.settingsVars.set(a,u)),s},set:(n,a,i,s)=>{o.setSetting(a,i);let u=o.settingsVars.get(a);return u?u.set(i):(u=new H(i),o.settingsVars.set(a,u)),!0}})}getUIClasses({componentSpec:t,properties:e}){if(!t)return;let o=[];v(t.attributes,a=>{let i=q(a),s=this[i];if(s){let u=t.allowedValues[a];t.propertyTypes[a]==Boolean||s==a&&u&&w(s,u)?o.push(a):u&&w(s,u)&&o.push(s),t.attributeClasses.includes(a)&&o.push(a)}});let n=rt(o).join(" ");return n&&(n+=" "),n}isDarkMode(){return J?void 0:O(this).cssVar("dark-mode")=="true"}$(t,{root:e=this?.renderRoot||this.shadowRoot}={}){return e||console.error("Cannot query DOM until element has rendered."),O(t,{root:e})}$$(t){return O(t,{root:this.originalDOM.content})}call(t,{firstArg:e,additionalArgs:o,args:n=[this.component,this.$.bind(this)]}={}){if(e&&n.unshift(e),o&&n.push(...o),L(t))return t.apply(this,n)}};var vt=({template:r="",ast:t,css:e="",pageCSS:o="",tagName:n,delegatesFocus:a=!1,templateName:i=q(n),createComponent:s=N,events:u={},keys:b={},onCreated:l=N,onRendered:c=N,onDestroyed:d=N,onThemeChanged:m=N,onAttributeChanged:h=N,defaultSettings:f={},defaultState:g={},subTemplates:p={},renderingEngine:k,properties:M,componentSpec:S=!1,plural:F=!1,singularTag:U}={})=>{t||(t=new pt(r).compile()),v(p,W=>{W.css&&(e+=W.css)}),o&&we(o);let _=new It({templateName:i,isPrototype:!0,renderingEngine:k,ast:t,css:e,events:u,keys:b,defaultState:g,subTemplates:p,onCreated:l,onRendered:c,onDestroyed:d,onThemeChanged:m,createComponent:s}),C;if(n){if(C=class extends kt{static get styles(){return Kt(e)}static template=_;static properties=kt.getProperties({properties:M,componentSpec:S,defaultSettings:f});defaultSettings={};constructor(){super(),this.css=e,this.componentSpec=S,this.settings=this.createSettingsProxy({componentSpec:S,properties:C.properties}),this.setDefaultSettings({defaultSettings:f,componentSpec:S})}connectedCallback(){super.connectedCallback()}triggerAttributeChange(){v(C.properties,(K,z)=>{let st=ut(z),Fe=this[z];!K.alias&&st&&Fe===!0&&this.setAttribute(st,""),zt({el:this,attribute:st,properties:C.properties,attributeValue:Fe,componentSpec:S})})}willUpdate(){J&&this.triggerAttributeChange(),this.template||(this.template=_.clone({data:this.getData(),element:this,renderRoot:this.renderRoot}),this.template.initialized||this.template.initialize(),this.component=this.template.instance,this.dataContext=this.template.data),super.willUpdate()}firstUpdated(){super.firstUpdated()}updated(){super.updated()}disconnectedCallback(){super.disconnectedCallback(),this.template&&this.template.onDestroyed(),_.onDestroyed()}adoptedCallback(){super.adoptedCallback(),this.call(onMoved)}attributeChangedCallback(K,z,st){super.attributeChangedCallback(K,z,st),zt({el:this,attribute:K,attributeValue:st,properties:C.properties,oldValue:z,componentSpec:S}),this.call(h,{args:[K,z,st]})}getSettings(){return this.getSettingsFromConfig({componentSpec:S,properties:C.properties})}setSetting(K,z){this[K]=z}getData(){let z={...this.getSettings()};return J||(z.darkMode=this.isDarkMode()),S&&(z.ui=this.getUIClasses({componentSpec:S,properties:C.properties})),F===!0&&(z.plural=!0),z}render(){let K={...this.getData(),...this.tpl};return this.template.render(K)}},Tt&&customElements.get(n))return C;customElements.define(n,C)}return n?C:_};var T=class r{static DEFAULT_DIALECT="standard";static DIALECT_TYPES={standard:"standard",classic:"classic",verbose:"verbose"};constructor(t,{plural:e=!1,dialect:o=r.DEFAULT_DIALECT}={}){this.spec=t||{},this.plural=e,this.dialect=o,this.componentSpec=null}getComponentName({plural:t=this.plural,lang:e="html"}={}){let o=this.spec;return t?o.pluralExportName:o.exportName}getTagName({plural:t=this.plural,lang:e="html"}={}){let o=this.spec;return t?o.pluralTagName:o.tagName}getDefinition({plural:t=this.plural,minUsageLevel:e,dialect:o=this.dialect}={}){let n={content:[],types:[],states:[],variations:[],settings:[]},a=l=>e?usageLevel>(l.usageLevel||1):!0,i=this.spec,s=t?i?.examples?.defaultPluralContent:i?.examples?.defaultContent,u=ve(i?.examples?.defaultAttributes||{}).join(" ");n.types.push({title:i.name,description:"",examples:[{showCode:!1,code:this.getCodeFromModifiers(u,{html:s}),components:[this.getComponentParts(u,{html:s})]}]});let b=this.getOrderedParts();return v(b,l=>{v(i[l],c=>{if(!a(c))return;let d=this.getCodeExamples(c,{defaultAttributes:i?.examples?.defaultAttributes,defaultContent:s});n[l].push(d)})}),n}getOrderedParts(){return["types","content","states","variations","settings"]}getOrderedExamples({plural:t=!1,minUsageLevel:e,dialect:o=this.dialect}={}){let n=this.getDefinition({plural:t,minUsageLevel:e,dialect:o});return this.getOrderedParts().map(a=>({title:Et(a),examples:n[a]}))}getDefinitionMenu({IDSuffix:t="-example",plural:e=!1,minUsageLevel:o}={}){return this.getOrderedExamples({plural:e,minUsageLevel:o}).map(i=>({title:i.title,items:i.examples.map(s=>({id:Bt(`${s.title}${t}`),title:s.title}))}))}getComponentPartsFromHTML(t,{dialect:e}={}){t=t.trim();let o=t.indexOf(" "),n=t.indexOf(">"),a=t.slice(1,o!==-1?o:n);if(a=="div")return{html:t};let i=o!==-1?t.slice(o,n).trim():"",s={};if(i){let l=i.split(" ");for(let c of l){let[d,m]=c.split("=");m?s[d]=m.replace(/"/g,""):s[d]=!0}}let u=this.getAttributeStringFromModifiers(t,{attributes:s,dialect:e}),b=t.slice(n+1,t.lastIndexOf("<")).trim();return{componentName:a,attributes:s,attributeString:u,html:b}}getCodeExamples(t,{defaultAttributes:e,defaultContent:o}={}){let n=[],a=this.getAttributeName(t);if(e){let i=Y(e);delete i[a],e=ve(i).join(" ")}if(t.options){let i=[];v(t.options,(s,u)=>{let b,l;if(s.exampleCode)b=s.exampleCode,l=this.getComponentPartsFromHTML(b);else{let d;x(s.value)?d=s.value:x(s)&&(d=s),A(s.value)&&(d=s.value.filter(m=>x(m))[0]),e&&(d=`${d} ${e}`),b=this.getCodeFromModifiers(d,{html:o}),l=this.getComponentParts(d,{html:o})}let c={code:b,components:[l]};t.separateExamples?n.push(c):i.push(c)}),t.separateExamples||n.push({code:i.map(s=>s.code).join(`
`),components:Ut([...i.map(s=>s.components)])})}else{let i,s,u=this.getAttributeName(t);e&&(u=`${u} ${e}`),t.exampleCode?(i=t.exampleCode,s=this.getComponentPartsFromHTML(i)):(i=this.getCodeFromModifiers(u,{html:o}),s=this.getComponentParts(u,{html:o}));let b={code:i,components:[s]};n.push(b)}return{title:t.name,description:t.description,examples:n}}getComponentParts(t,{lang:e="html",plural:o=this.plural,text:n,html:a,dialect:i=this.dialect}={}){let s=e=="html"?this.getTagName({plural:o}):this.getComponentName({plural:o,lang:e});if(!n&&!a){let l=t||String(s).replace(/^ui-/,"");n=String(l).replace(/\-/mg," "),a=Et(n)}let u=this.getAttributesFromModifiers(t);return{componentName:s,attributes:u,attributeString:this.getAttributeStringFromModifiers(t,{attributes:u,dialect:i}),html:a}}getCodeFromModifiers(t,e){let{componentName:o,attributeString:n,html:a}=this.getComponentParts(t,e);return`<${o}${n}>${a}</${o}>`}getAttributesFromModifiers(t=""){let e=this.getWebComponentSpec(),o={},n=String(t).split(" ");return v(n,a=>{let i=e.optionAttributes[a];i?o[i]=a:o[a]=!0}),o}getSingleAttributeString(t,e,{joinWith:o="=",quoteCharacter:n=":"}={}){return e==!0||e==t?`${t}`:`${t}${o}${n}${e}${n}`}getAttributeString(t,{dialect:e=this.dialect,joinWith:o="=",quoteCharacter:n="'"}={}){let a,i=[],s=Y(t),u=this.getWebComponentSpec();if(v(t,(b,l)=>{u.optionAttributes[b]?i.push(b):s[l]=b}),i.length){let b=modifierAttributes.join(" ");if(e==r.DIALECT_TYPES.standard)a+=` ${b}`;else if(e==r.DIALECT_TYPES.classic)return` class="${b}"`}else if(e==r.DIALECT_TYPES.verbose||keys(s)){let b=" ";v(t,(l,c)=>{let d=this.getSingleAttributeString(c,l,{joinWith:o,quoteCharacter:n});b+=` ${d}`})}return a}getAttributeStringFromModifiers(t,{dialect:e=this.dialect,attributes:o,joinWith:n="=",quoteCharacter:a='"'}={}){if(!t)return"";if(e==r.DIALECT_TYPES.standard)return` ${t}`;if(e==r.DIALECT_TYPES.classic)return` class="${t}"`;if(e==r.DIALECT_TYPES.verbose){o||(o=this.getAttributesFromModifiers(t));let i=" ";return v(o,(s,u)=>{let b=this.getSingleAttributeString(u,s,{joinWith:n,quoteCharacter:a});i+=` ${b}`}),` ${i.trim()}`}}getWebComponentSpec(t=this.spec,{plural:e=this.plural}={}){if(t==this.spec&&this.componentSpec)return this.componentSpec;let o={tagName:t.tagName,content:[],contentAttributes:[],types:[],variations:[],states:[],events:[],settings:[],properties:[],attributes:[],optionAttributes:{},propertyTypes:{},allowedValues:{},attributeClasses:[],defaultValues:{},inheritedPluralVariations:[]},n=s=>{let u=t[s]||[];if(e){let l=I({types:"pluralSharedTypes",variations:"pluralSharedVariations",states:"pluralSharedStates",content:"pluralSharedContent",settings:"pluralSharedSettings",events:"pluralSharedEvents"},s),c=I(t,l)||[];l&&(u=u.filter(d=>{let m=this.getPropertyName(d);return w(m,c)})),s=s.replace("pluralOnly","").toLowerCase()}v(u,b=>{let l=this.getPropertyName(b);if(!l)return;o[s]&&o[s].push(l);let c=this.getAllowedValues(b);c&&(o.allowedValues[l]=c);let d=this.getPropertyType(b,s,c);d&&(o.propertyTypes[l]=d);let m=this.getAttributeName(b,d);m?o.attributes.push(m):o.properties.push(l);let h=this.getDefaultValue(b,d,s);h!==void 0&&(o.defaultValues[l]=h),s==="content"&&(b.attribute?o.contentAttributes.push(b.attribute):b.slot&&o.slots.push(b.slot)),m&&b.includeAttributeClass&&o.attributeClasses.push(l)})};v(["content","types","states","variations","settings","events"],n),e&&v(["pluralOnlyContent","pluralOnlyTypes","pluralOnlyStates","pluralOnlySettings","pluralOnlyVariations","pluralOnlyEvents"],n);let i=j(o.allowedValues,(s,u)=>s=s.filter(b=>x(b)));return o.optionAttributes=fe(i),o.inheritedPluralVariations=t.pluralSharedVariations||[],this.componentSpec=o,o}getPluralWebComponentSpec(t=this.spec){if(t==this.spec&&this.componentSpec)return this.componentSpec;let e={tagName:t.tagName,content:[],contentAttributes:[],types:[],variations:[],states:[],events:[],settings:[],properties:[],attributes:[],optionAttributes:{},propertyTypes:{},allowedValues:{},attributeClasses:[],defaultValues:{},inheritedPluralVariations:[]},o=a=>{let i=t[a]||[];v(i,s=>{let u=this.getPropertyName(s);if(!u)return;e[a].push(u);let b=this.getAllowedValues(s);b&&(e.allowedValues[u]=b);let l=this.getPropertyType(s,a,b);l&&(e.propertyTypes[u]=l);let c=this.getAttributeName(s,l);c?e.attributes.push(c):e.properties.push(u);let d=this.getDefaultValue(s,l,a);d!==void 0&&(e.defaultValues[u]=d),a==="content"&&(s.attribute?e.contentAttributes.push(s.attribute):s.slot&&e.slots.push(s.slot)),c&&s.includeAttributeClass&&e.attributeClasses.push(u)})};o("content"),o("types"),o("states"),o("variations"),o("pluralVariations"),o("settings"),o("events");let n=j(e.allowedValues,(a,i)=>a=a.filter(s=>x(s)));return e.optionAttributes=fe(n),e.inheritedPluralVariations=t.pluralSharedVariations||[],this.componentSpec=e,e}getAttributeName(t,e){if(this.canUseAttribute(e))return this.getPropertyName(t)}getPropertyName(t){if(t.attribute)return t.attribute;if(x(t.name))return t.name.toLowerCase()}getPropertyType(t,e,o=[]){let n={string:String,boolean:Boolean,object:Object,array:Array,function:Function},a,i;return e=="events"?a=Function:w(e,["types","states","variations"])?a=Boolean:w(e,["content"])&&(a=String),t.type&&n[t.type]?i=t.type:o.length&&(i=typeof o[0]),i&&(a=I(n,i)),a}getAllowedValues(t){let e;return t.options&&(e=t.options.map(o=>o?.value!==void 0?o.value:o).filter(Boolean),e=rt(Ut(e))),e}getDefaultValue(t,e,o){return t.defaultValue!==void 0?t.defaultValue:o!=="settings"?void 0:I({string:"",array:[],boolean:!1,function:N,number:0,object:{}},e)}canUseAttribute(t){return t!=Function}};var Pe={uiType:"element",name:"Container",description:"A container limits content to a maximum width",tagName:"ui-container",exportName:"UIContainer",content:[],types:[],variations:[],events:[],settings:[]};var un=new T,ln=un.getWebComponentSpec(Pe);var Me={uiType:"element",name:"Rail",description:"A rail is used to show accompanying content next to the main view of a site",tagName:"ui-rail",exportName:"UIRail",content:[],types:[],variations:[],events:[],settings:[]};var dn=new T,bn=dn.getWebComponentSpec(Me);var de={uiType:"element",name:"Button",description:"A button indicates a possible user action",tagName:"ui-button",exportName:"UIButton",examples:{defaultPluralContent:`
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
</div>`},{name:"Floated",attribute:"floated",usageLevel:1,description:"align to the left or right of its container",options:[{name:"Left Floated",value:["left-floated"],description:"appear to the left of content"},{name:"Right Floated",value:"right-floated",description:"appear to the right of content"}]},{name:"Fluid",attribute:"fluid",usageLevel:1,description:"take the width of its container"},{name:"Size",attribute:"size",usageLevel:1,description:"vary in size",options:[{name:"Mini",value:"mini",description:"appear extremely small"},{name:"Tiny",value:"tiny",description:"appear very small"},{name:"Small",value:"small",description:"appear small"},{name:"Medium",value:"medium",description:"appear normal sized"},{name:"Large",value:"large",description:"appear larger than normal"},{name:"Big",value:"big",description:"appear much larger than normal"},{name:"Huge",value:"huge",description:"appear very much larger than normal"},{name:"Massive",value:"massive",description:"appear extremely larger than normal"}]},{name:"Inverted",description:"be formatted to appear on dark backgrounds",usageLevel:2,attribute:"inverted"}],settings:[{name:"Icon Only",type:"boolean",attribute:"icon-only",defaultValue:!1,description:"Enable to remove spacing for text"},{name:"Icon After",type:"boolean",attribute:"icon-after",defaultValue:!1,description:"Enable to position the icon after the text"},{name:"Link",type:"string",attribute:"href",description:"link to a webpage"}],supportsPlural:!0,pluralName:"Buttons",pluralTagName:"ui-buttons",pluralExportName:"UIButtons",pluralDescription:"Buttons can exist together as a group",pluralContent:[{name:"Or",attribute:"or",slot:"or",description:"A button group can be formatted to show a conditional choice"}],pluralSharedTypes:[],pluralOnlyTypes:[{name:"vertical",attribute:"vertical",description:"A button group can be formatted to show buttons in a vertical stack",usageLevel:3}],pluralOnlyVariations:[{name:"Separate",attribute:"separate",description:"A button group can appear with their buttons separated"},{name:"Equal Width",attribute:"equal-width",description:"A button group can be formatted to have the same width for each button",usageLevel:3,options:[{name:"Two",value:"two",description:"A button group can have two items evenly split"},{name:"Three",value:"three",description:"A button group can have three items evenly split"},{name:"Four",value:"four",description:"A button group can have four items evenly split"},{name:"Five",value:"five",description:"A button group can have five items evenly split"},{name:"Six",value:"six",description:"A button group can have six items evenly split"}]}],pluralSharedVariations:["inverted","size","floated","compact","color","attached"]};var Re=new T(de).getWebComponentSpec(),_e=new T(de,{plural:!0}).getWebComponentSpec();var De={uiType:"element",name:"Icon",description:"An icon is a glyph used to represent something else",tagName:"ui-icon",exportName:"UIIcon",content:[{name:"Icon",attribute:"icon",description:"An icon can specify what icon should appear",usageLevel:1,options:["airplay","alert-circle","alert-octagon","alert-triangle","align-center","align-justify","align-left","align-right","anchor","aperture","archive","arrow-down","arrow-down-circle","arrow-down-left","arrow-down-right","arrow-left","arrow-left-circle","arrow-right","arrow-right-circle","arrow-up","arrow-up-circle","arrow-up-left","arrow-up-right","at-sign","award","bar-chart","bar-chart-2","battery","battery-charging","bell","bell-off","bluetooth","bold","book","book-open","bookmark","box","briefcase","calendar","camera","camera-off","cast","check","check-circle","check-square","chevron-down","chevron-left","chevron-right","chevron-up","chevrons-down","chevrons-left","chevrons-right","chevrons-up","chrome","circle","clipboard","clock","cloud","cloud-drizzle","cloud-lightning","cloud-off","cloud-rain","cloud-snow","code","codepen","codesandbox","coffee","columns","command","compass","copy","corner-down-left","corner-down-right","corner-left-down","corner-left-up","corner-right-down","corner-right-up","corner-up-left","corner-up-right","cpu","credit-card","crop","crosshair","currentColor","database","delete","disc","divide","divide-circle","divide-square","dollar-sign","download","download-cloud","dribbble","droplet","edit","edit-2","edit-3","external-link","eye","eye-off","facebook","fast-forward","feather","figma","file","file-minus","file-plus","file-text","film","filter","flag","folder","folder-minus","folder-plus","framer","frown","github","gitlab","globe","grid","hard-drive","hash","headphones","heart","help-circle","hexagon","home","image","inbox","info","instagram","italic","key","layers","layout","life-buoy","linkify","linkify-2","linkedin","list","loader","lock","log-in","log-out","mail","map","map-pin","maximize","maximize-2","meh","menu","message-circle","message-square","mic","mic-off","minimize","minimize-2","minus","minus-circle","minus-square","monitor","moon","more-horizontal","more-vertical","mouse-pointer","move","music","navigation","navigation-2","octagon","package","paperclip","pause","pause-circle","pen-tool","percent","phone","phone-call","phone-forwarded","phone-incoming","phone-missed","phone-off","phone-outgoing","pie-chart","play","play-circle","plus","plus-circle","plus-square","pocket","power","printer","radio","refresh-ccw","refresh-cw","repeat","rewind","rotate-ccw","rotate-cw","rss","save","scissors","search","send","server","settings","share","share-2","shield","shield-off","shopping-bag","shopping-cart","shuffle","sidebar","skip-back","skip-forward","slack","slash","sliders","smartphone","smile","speaker","square","star","stop-circle","sun","sunrise","sunset","table","tablet","tag","target","terminal","thermometer","thumbs-down","thumbs-up","toggle-left","toggle-right","tool","trash","trash-2","trello","trending-down","trending-up","triangle","truck","tv","twitch","twitter","type","umbrella","underline","unlock","upload","upload-cloud","user","user-check","user-minus","user-plus","user-x","users","video","video-off","voicemail","volume","volume-1","volume-2","volume-x","watch","wifi","wifi-off","wind","x","x-circle","x-octagon","x-square","youtube","zap","zap-off","zoom-in","zoom-out"]}],states:[{name:"Disabled",attribute:"disabled",description:"can appear disabled",usageLevel:1},{name:"Loading",attribute:"loading",description:"can be used as a simple loader",usageLevel:1}],variations:[{name:"Link",description:"can be formatted as a link",usageLevel:1},{name:"Fitted",description:"can be fitted without any space to the left or right of it.",usageLevel:1},{name:"Colored",value:"color",description:"can be colored",usageLevel:2,options:[{name:"Red",value:"red",description:"A button can be red"},{name:"Orange",value:"orange",description:"A button can be orange"},{name:"Yellow",value:"yellow",description:"A button can be yellow"},{name:"Olive",value:"olive",description:"A button can be olive"},{name:"Green",value:"green",description:"A button can be green"},{name:"Teal",value:"teal",description:"A button can be teal"},{name:"Blue",value:"blue",description:"A button can be blue"},{name:"Violet",value:"violet",description:"A button can be violet"},{name:"Purple",value:"purple",description:"A button can be purple"},{name:"Pink",value:"pink",description:"A button can be pink"},{name:"Brown",value:"brown",description:"A button can be brown"},{name:"Grey",value:"grey",description:"A button can be grey"},{name:"Black",value:"black",description:"A button can be black"}]},{name:"Size",value:"size",usageLevel:1,description:"can vary in size",options:[{name:"Mini",value:"mini",description:"An element can appear extremely small"},{name:"Tiny",value:"tiny",description:"An element can appear very small"},{name:"Small",value:"small",description:"An element can appear small"},{name:"Medium",value:"medium",description:"An element can appear normal sized"},{name:"Large",value:"large",description:"An element can appear larger than normal"},{name:"Big",value:"big",description:"An element can appear much larger than normal"},{name:"Huge",value:"huge",description:"An element can appear very much larger than normal"},{name:"Massive",value:"massive",description:"An element can appear extremely larger than normal"}]},{name:"Inverted",description:"can be formatted to appear on dark backgrounds",usageLevel:2,attribute:"inverted"}],settings:[{name:"href",type:"string",attribute:"href",description:"Link to a page"}],supportsPlural:!0,pluralName:"Icons",pluralTagName:"ui-icons",pluralDescription:"Icons can exist together as a group",pluralVariations:["colored","size"],examples:{defaultAttributes:{icon:"check-circle"}}};var mn=new T,vn=mn.getWebComponentSpec(De);var Ie={uiType:"element",name:"Menu",description:"A menu displays grouped navigation actions",tagName:"ui-menu",exportName:"UIMenu",content:[{name:"Item",tagName:"menu-item",subcomponent:"true",description:"can include a menu item",usageLevel:1},{name:"Menu Content",attribute:"menu",description:"can define its menu contents programatically",usageLevel:1,exampleCode:`<ui-menu value="3" items='[{"label":"One","value":"1"},{"label":"Two","value":"2"},{"label":"Three","value":"3"}]'></ui-menu>`}],types:[{name:"Selection",attribute:"selection",description:"allow for selection between choices",usageLevel:1}],variations:[{name:"Evenly Spaced",attribute:"evenly-spaced",description:"have its items split space evenly",usageLevel:1},{name:"Fitted",attribute:"fitted",description:"can remove its margin",usageLevel:2},{name:"Vertical",attribute:"vertical",description:"can be displayed vertically",usageLevel:1},{name:"Inset",attribute:"inset",description:"can have its menu items inset",usageLevel:1}],events:[{eventName:"change",description:"can specify a function to occur after the value changes",arguments:[{name:"value",description:"the updated value"}]}],settings:[{name:"Menu Items",type:"array",attribute:"items",description:"can automatically generate menu items"},{name:"Value",type:"string",attribute:"value",description:"can specify the active menu item value when generating menu items"}],examples:{defaultContent:`
  <menu-item active>One</menu-item>
  <menu-item>Two</menu-item>
  <menu-item>Three</menu-item>
`}};var Oe={uiType:"element",name:"Menu Item",description:"A menu item displays an individual selection in a menu",parentTag:"ui-menu",tagName:"menu-item",exportName:"UIMenuItem",content:[{name:"Icon",includeAttributeClass:!0,attribute:"icon",couplesWith:["ui-icon"],slot:"icon",description:"include an icon",exampleCode:'<menu-item icon="home">Home</menu-item>'},{name:"Href",type:"string",attribute:"href",description:"can specify a link"},{name:"Value",type:"string",attribute:"value",description:"can specify a value"}],states:[{name:"Hover",attribute:"hover",description:"hovered"},{name:"Focus",attribute:"focused",description:"focused by the keyboard"},{name:"Active",attribute:"active",description:"activated"},{name:"Disabled",attribute:"disabled",description:"disable interactions"}]};var Ro=new T,xn=Ro.getWebComponentSpec(Ie),wn=Ro.getWebComponentSpec(Oe);var ze={uiType:"element",name:"Label",description:"A label displays content classification",tagName:"ui-label",exportName:"UILabel",content:[],types:[],variations:[{name:"Size",attribute:"size",usageLevel:1,description:"vary in size",options:[{name:"Mini",value:"mini",description:"appear extremely small"},{name:"Tiny",value:"tiny",description:"appear very small"},{name:"Small",value:"small",description:"appear small"},{name:"Medium",value:"medium",description:"appear normal sized"},{name:"Large",value:"large",description:"appear larger than normal"},{name:"Big",value:"big",description:"appear much larger than normal"},{name:"Huge",value:"huge",description:"appear very much larger than normal"},{name:"Massive",value:"massive",description:"appear extremely larger than normal"}]}],events:[],settings:[]};var kn=new T,Sn=kn.getWebComponentSpec(ze);var He={uiType:"element",name:"Input",description:"A menu displays grouped navigation actions",tagName:"ui-input",exportName:"UIInput",content:[{name:"Placeholder",attribute:"placeholder",description:"include placeholder text",exampleCode:'<ui-input placeholder="Search..."></ui-input>'},{name:"Icon",includeAttributeClass:!0,attribute:"icon",couplesWith:["ui-icon"],description:"include an icon",exampleCode:'<ui-input icon="search"></ui-input>'},{name:"Label",includeAttributeClass:!0,attribute:"label",description:"include a label",exampleCode:'<ui-input label="ctrl+k"></ui-input>'}],types:[{name:"Search",attribute:"search",description:"can be formatted to appear as a search",exampleCode:"<ui-input search></ui-input>"}],variations:[{name:"Fluid",attribute:"fluid",usageLevel:1,description:"take the width of its container"},{name:"Size",attribute:"size",usageLevel:1,description:"vary in size",options:[{name:"Mini",value:"mini",description:"appear extremely small"},{name:"Tiny",value:"tiny",description:"appear very small"},{name:"Small",value:"small",description:"appear small"},{name:"Medium",value:"medium",description:"appear normal sized"},{name:"Large",value:"large",description:"appear larger than normal"},{name:"Big",value:"big",description:"appear much larger than normal"},{name:"Huge",value:"huge",description:"appear very much larger than normal"},{name:"Massive",value:"massive",description:"appear extremely larger than normal"}]}],events:[{eventName:"change",description:"occurs after the value changes",arguments:[{name:"value",description:"the updated value"}]}],settings:[{name:"Name",type:"string",attribute:"name",description:"can specify the form field name"},{name:"Debounced",type:"boolean",attribute:"debounced",defaultValue:!1,description:"can specify the input value should be debounced"},{name:"Debounce Interval",type:"number",attribute:"debounce-interval",defaultValue:150,description:"can specify the input debounce interval in milliseconds"},{name:"Clearable",type:"string",attribute:"clearable",description:"can show an icon to reset the inputted value"},{name:"Placeholder",type:"string",attribute:"placeholder",description:"can specify placeholder text"},{name:"Value",type:"string",attribute:"value",description:"can specify a value to store"}],examples:{defaultAttributes:{icon:"check-circle"}}};var An=new T,Tn=An.getWebComponentSpec(He);var Ve={uiType:"element",name:"Segment",description:"A menu displays grouped navigation actions",tagName:"ui-menu",exportName:"UISegment",content:[],types:[{name:"placeholder",attribute:"placeholder",description:"used as a placeholder for content in a layout.",usageLevel:1}],variations:[],events:[],settings:[]};var $n=new T,Ln=$n.getWebComponentSpec(Ve);var be={uiType:"element",name:"Card",description:"A card displays segmented content in a manner similar to a playing card.",tagName:"ui-card",exportName:"UICard",examples:{},content:[{name:"Icon",includeAttributeClass:!0,attribute:"icon",couplesWith:["ui-icon"],description:"include an icon",exampleCode:`<ui-card icon="pause"></ui-card>
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
</ui-card>`},{name:"Image",attribute:"image",couplesWith:["ui-image"],description:"include an image",exampleCode:'<ui-card image="/images/avatar/jenny.jpg">Get started with your new card.</ui-card>'}],types:[],states:[{name:"Hover",attribute:"hover",description:"be hovered"},{name:"Focus",attribute:"focused",description:"be focused by the keyboard"},{name:"Disabled",attribute:"disabled",includeAttributeClass:!0,description:"have interactions disabled",options:[{name:"Disabled",value:"disabled",description:"disable interactions"},{name:"Clickable Disabled",value:"clickable-disabled",description:"allow interactions but appear disabled"}]}],variations:[{name:"Fluid",attribute:"fluid",usageLevel:1,description:"take the width of its container"},{name:"Link",attribute:"link",usageLevel:1,description:"can be formatted as if the card can be clicked"},{name:"Horizontal",attribute:"horizontal",usageLevel:1,description:"can have content horizontally oriented",exampleCode:'<ui-card horizontal image="/images/avatar/jenny.jpg">Get started with your new card.</ui-card>'}],settings:[{name:"Href",type:"string",attribute:"href",description:"link to a url"}],supportsPlural:!0,pluralName:"Cards",pluralTagName:"ui-cards",pluralExportName:"UICards",pluralDescription:"Cards can exist together as a group",pluralContent:[],pluralSharedTypes:["link"],pluralOnlyTypes:[],pluralOnlyVariations:[{name:"doubling",attribute:"doubling",description:"A group of cards can double its column width for mobile",usageLevel:3},{name:"stackable",attribute:"stackable",description:"A group of cards can automatically stack rows to a single columns on mobile devices",usageLevel:3},{name:"Spaced",attribute:"spaced",description:"A group of cards can adjust its spacing",usageLevel:2,options:[{name:"Spaced",value:"spaced",description:"A card group have increased spacing"},{name:"Three",value:"very-spaced",description:"A card group can have very increased spacing"}]},{name:"Count",attribute:"count",description:"A group of cards can set how many cards should exist in a row",usageLevel:3,options:[{name:"Two",value:"two",description:"A card group can have two items per row"},{name:"Three",value:"three",description:"A card group can have three items per row"},{name:"Four",value:"four",description:"A card group can have four items per row"},{name:"Five",value:"five",description:"A card group can have five items per row"},{name:"Six",value:"six",description:"A card group can have six items per row"}]}],pluralSharedVariations:[]};var Pn=new T(be).getWebComponentSpec(),Mn=new T(be,{plural:!0}).getWebComponentSpec();var Be={uiType:"element",name:"Modal",description:"A modal displays content that temporarily blocks interactions with the main view of a site",tagName:"ui-modal",exportName:"UIModal",content:[],types:[{name:"Glass",attribute:"glass",description:"can appear as glass",usageLevel:3}],variations:[{name:"Aligned",attribute:"aligned",description:"adjust its alignment",usageLevel:1,options:[{name:"Top Aligned",value:["top-aligned"],description:"appear aligned to top of browser",exampleCode:"<ui-modal top-aligned>Modal Content</ui-modal>"}]},{name:"Size",attribute:"size",usageLevel:1,description:"vary in size",options:[{name:"Tiny",value:"tiny",description:"appear very small"},{name:"Small",value:"small",description:"appear small"},{name:"Medium",value:"medium",description:"appear normal sized"},{name:"Large",value:"large",description:"appear larger than normal"},{name:"Big",value:"big",description:"appear much larger than normal"}]}],events:[{eventName:"show",description:"occurs after the modal starts to show"},{eventName:"visible",description:"occurs after the modal is visible"},{eventName:"hide",description:"occurs when the modal begins to hide"},{eventName:"hidden",description:"occurs after the modal is hidden"}],settings:[{name:"Closeable",type:"boolean",defaultValue:!0,attribute:"closeable",description:"can allow the modal to be dismissed by clicking on the backdrop."}]};var _n=new T,Dn=_n.getWebComponentSpec(Be);var he=`/* src/components/button/css/shadow/content/button.css */
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
`;var _o=`/* src/components/button/css/page/group/buttons.css */
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
`;var Do=`<div class="{{ui}} buttons">
  {{>slot}}
</div>
`;var Hn=vt({tagName:"ui-buttons",plural:!0,singularTag:"ui-button",delegateFocus:!0,componentSpec:_e,template:Do,css:he,pageCSS:_o});var Io=`/*-------------------
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

`;var Oo=`<div class="{{ui}} or" part="or">
  <div class="shape"><slot>or</slot></div>
</div>
`;var Fn=vt({tagName:"button-or",template:Oo,css:Io});var zo=`{#if href}
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
`;var Wn=({self:r,settings:t,data:e,el:o,$:n})=>({isIconBefore(){return t.icon&&!t.iconAfter},isIconAfter(){return t.icon&&t.iconAfter},isSubmitKey(a){return I({13:"Space",32:"Enter"},String(a))},isDisabled(){return t.state=="disabled"}}),jn={"touchstart .button"({event:r,self:t,$:e}){e(this).addClass("pressed")},"touchend .button"({event:r,self:t,$:e}){e(this).removeClass("pressed")},"click .button"({event:r,self:t,$:e}){e(this).blur()},"keydown .button"({event:r,self:t,$:e}){let o=e(this);t.isSubmitKey(r.keyCode)&&(o.addClass("pressed"),r.preventDefault()),r.key=="Escape"&&o.blur()},"keyup .button"({event:r,self:t,$:e}){let o=e(this);t.isSubmitKey(r.keyCode)&&o.removeClass("pressed")}},Yn=vt({tagName:"ui-button",componentSpec:Re,template:zo,css:he,createComponent:Wn,events:jn});export{Fn as ButtonOr,Yn as UIButton,Hn as UIButtons};
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
//# sourceMappingURL=button.js.map
