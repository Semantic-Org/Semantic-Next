var D=s=>s!==null&&typeof s=="object",ne=s=>D(s)&&s.constructor===Object,k=s=>typeof s=="string";var pt=s=>typeof s=="number",C=s=>Array.isArray(s);var L=s=>typeof s=="function"||!1;var ze=s=>typeof window>"u"?!0:s instanceof Element||s instanceof Document||s===window||s instanceof DocumentFragment;var ht=s=>{if(s==null)return!0;if(C(s)||k(s))return s.length===0;for(let e in s)if(s[e])return!1;return!0},He=s=>{if(s===null||typeof s!="object")return!1;let t=Object.getPrototypeOf(s).constructor.name;return!["Object","Array","Date","RegExp","Map","Set","Error","Uint8Array","Int8Array","Uint16Array","Int16Array","Uint32Array","Int32Array","Float32Array","Float64Array","BigInt64Array","BigUint64Array","NodeList"].includes(t)};var v=(s,e,t)=>{if(s==null)return s;let i=t?e.bind(t):e;if((D(s)||L(s))&&s.length!==void 0&&typeof s.length=="number"&&(s=Array.from(s)),C(s))for(let n=0;n<s.length&&i(s[n],n,s)!==!1;++n);else{let n=Object.keys(s);for(let a of n)if(i(s[a],a,s)===!1)break}return s};var Se=s=>s.replace(/([.*+?^=!:${}()|\[\]\/\\])/g,"\\$1"),Ft=s=>{let e={"&":"&amp","<":"&lt",">":"&gt",'"':"&quot","'":"&#39"},t=/[&<>"']/g,i=RegExp(t.source);return s&&i.test(s)?s.replace(t,n=>e[n]):s};var Ve=(s="")=>(s||"").replace(/\s+/g,"-").replace(/[^\w-]+/g,"").replace(/_/g,"-").toLowerCase(),Ut=s=>{if(s=parseInt(s,10),s===0)return"0";let e="",t="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";for(;s>0;)e=t[s%t.length]+e,s=Math.floor(s/t.length);return e};function xe(s,{prettify:e=!1,seed:t=305419896}={}){let r;if(s==null)r=new TextEncoder().encode("");else if(s&&s.toString===Object.prototype.toString&&typeof s=="object")try{r=new TextEncoder().encode(JSON.stringify(s))}catch(c){return console.error("Error serializing input",c),0}else r=new TextEncoder().encode(s.toString());let o;if(r.length<=8){o=t;for(let c=0;c<r.length;c++)o^=r[c],o=Math.imul(o,2654435761),o^=o>>>13}else{o=t;for(let c=0;c<r.length;c++)o=Math.imul(o^r[c],2654435761),o=o<<13|o>>>19,o=Math.imul(o,2246822519);o^=r.length}return o^=o>>>16,o=Math.imul(o,3266489917),o^=o>>>13,e?Ut(o>>>0):o>>>0}var Bt=()=>{let s=Math.random()*1e15;return Ut(s)};var N=s=>s,X=s=>L(s)?s:()=>s;var qt=s=>{if(D(s))return Object.keys(s)},dt=s=>{if(D(s))return Object.values(s)},Wt=(s,e)=>Object.fromEntries(Object.entries(s).filter(([t,i])=>e(i,t))),W=(s,e)=>Object.fromEntries(Object.entries(s).map(([t,i])=>[t,e(i,t)])),jt=(s,...e)=>(e.forEach(t=>{let i,n;if(t)for(n in t)i=Object.getOwnPropertyDescriptor(t,n),i===void 0?s[n]=t[n]:Object.defineProperty(s,n,i)}),s);var Fe=s=>{if(C(s))return s;let e=[];return v(s,(t,i)=>{e.push({value:t,key:i})}),e},H=function(s,e=""){if(typeof e!="string")return;function t(r){let o=r.substring(0,r.indexOf("[")),c=parseInt(r.substring(r.indexOf("[")+1,r.indexOf("]")),10);return{key:o,index:c}}function i(r){let o=r.indexOf(".");if(o!==-1){let c=r.indexOf(".",o+1);if(c!==-1)return r.slice(0,c)}return r}if(s===null||!D(s))return;let n=e.split("."),a=s;for(let r=0;r<n.length;r++){if(a===null||!D(a))return;let o=n[r];if(o.includes("[")){let{key:c,index:p}=t(o);if(c in a&&C(a[c])&&p<a[c].length)a=a[c][p];else return}else if(o in a)a=a[o];else{let c=n.slice(r).join(".");if(c in a){a=a[c];break}else{let p=i(`${o}.${n[r+1]}`);if(p in a)a=a[p],r++;else return}}}return a};var gt=s=>{let e={},t=(i,n)=>{C(e[i])?e[i].push(n):e[i]?e[i]=[e[i],n]:e[i]=n};return Object.keys(s).forEach(i=>{C(s[i])?v(s[i],n=>{t(n,i)}):t(s[i],i)}),e};var V=(s,e,t={})=>{if(s===e)return!0;if(s&&e&&typeof s=="object"&&typeof e=="object"){if(s.constructor!==e.constructor)return!1;let i,n,a;if(Array.isArray(s)){if(i=s.length,i!=e.length)return!1;for(n=i;n--!==0;)if(!V(s[n],e[n]))return!1;return!0}if(s instanceof Map&&e instanceof Map){if(s.size!==e.size)return!1;for(n of s.entries())if(!e.has(n[0]))return!1;for(n of s.entries())if(!V(n[1],e.get(n[0])))return!1;return!0}if(s instanceof Set&&e instanceof Set){if(s.size!==e.size)return!1;for(n of s.entries())if(!e.has(n[0]))return!1;return!0}if(ArrayBuffer.isView(s)&&ArrayBuffer.isView(e)){if(i=s.length,i!=e.length)return!1;for(n=i;n--!==0;)if(s[n]!==e[n])return!1;return!0}if(s.constructor===RegExp)return s.source===e.source&&s.flags===e.flags;if(s.valueOf!==Object.prototype.valueOf)return s.valueOf()===e.valueOf();if(s.toString!==Object.prototype.toString)return s.toString()===e.toString();if(a=Object.keys(s),i=a.length,i!==Object.keys(e).length)return!1;for(n=i;n--!==0;)if(!Object.prototype.hasOwnProperty.call(e,a[n]))return!1;for(n=i;n--!==0;){let r=a[n];if(!V(s[r],e[r]))return!1}return!0}return s!==s&&e!==e};var se=s=>Array.from(new Set(s));var ve=(s=[],e=1)=>{let{length:t}=s;if(t)return e===1?s[t-1]:s.slice(Math.max(t-e,0))};var Yt=(s=[],e)=>{let t;return v(s,(i,n)=>{if(e(i,n,s))return t=i,!1}),t},fe=(s=[],e)=>{let t=-1;return v(s,(i,n)=>{if(e(i,n,s))return t=n,!1}),t},Gt=(s=[],e)=>{let t=L(e)?e:n=>V(n,e),i=fe(s,t);return i>-1?(s.splice(i,1),!0):!1},w=(s,e=[])=>e.indexOf(s)>-1,Kt=(s,e,t=1)=>{e||(e=s,s=0);let i=e-s;return Array(i).fill(void 0).map((n,a)=>a*t+s)};var Ue=(s=[])=>s.reduce((e,t)=>Array.isArray(t)?e.concat(Ue(t)):e.concat(t),[]),Ri=(s,e)=>s?.some?s.some(e):!1,Xt=Ri;var _i=58;var vt=(...s)=>{if(s.length===0)return[];if(s.length===1)return[...new Set(s[0])];let t=s.reduce((r,o)=>r+o.length,0)>=_i,[i,...n]=s,a=[...new Set(i)];if(t){let r=n.map(o=>new Set(o));return a.filter(o=>!r.some(c=>c.has(o)))}return a.filter(r=>!n.some(o=>o.includes(r)))};var Jt=s=>{let e=s?.key;if(!e)return"";let t="";s.ctrlKey&&e!=="Control"&&(t+="ctrl+"),s.altKey&&e!=="Alt"&&(t+="alt+"),s.shiftKey&&e!=="Shift"&&(t+="shift+"),s.metaKey&&e!=="Meta"&&(t+="meta+");let i={Control:"ctrl",Escape:"esc"," ":"space"};return e=e.replace("Arrow",""),t+=i[e]||e.toLowerCase(),t};var j=(s,e=new Map)=>{if(!s||typeof s!="object")return s;if(e.has(s))return e.get(s);let t;if(s.nodeType&&"cloneNode"in s)t=s.cloneNode(!0),e.set(s,t);else if(s instanceof Date)t=new Date(s.getTime()),e.set(s,t);else if(s instanceof RegExp)t=new RegExp(s),e.set(s,t);else if(Array.isArray(s)){t=new Array(s.length),e.set(s,t);for(let i=0;i<s.length;i++)t[i]=j(s[i],e)}else if(s instanceof Map){t=new Map,e.set(s,t);for(let[i,n]of s.entries())t.set(i,j(n,e))}else if(s instanceof Set){t=new Set,e.set(s,t);for(let i of s)t.add(j(i,e))}else if(s instanceof Object){t={},e.set(s,t);for(let[i,n]of Object.entries(s))t[i]=j(n,e)}return t};var Be=function(s,e="LLL",{locale:t="default",hour12:i=!0,timezone:n="UTC",...a}={}){if(isNaN(s.getTime()))return"Invalid Date";let r=new Date(s.getTime());n==="local"&&(n=Intl.DateTimeFormat().resolvedOptions().timeZone);let o=_=>_<10?`0${_}`:_,c={timeZone:n,year:"numeric",month:"long",day:"numeric",weekday:"long",hour:"numeric",minute:"numeric",second:"numeric",hour12:i,...a},l=new Intl.DateTimeFormat(t,c).formatToParts(r).reduce((_,A)=>(_[A.type]=A.value,_),{}),{year:m,month:u,day:g,weekday:h,hour:f,minute:b,second:d,dayPeriod:S}=l;f==="24"&&(f="00");let M=new Date(s.toLocaleString("en-US",{timeZone:n})),x={YYYY:m,YY:m.slice(-2),MMMM:u,MMM:u.slice(0,3),MM:o(M.getMonth()+1),M:M.getMonth()+1,DD:o(M.getDate()),D:M.getDate(),Do:g+["th","st","nd","rd"][g%10>3?0:(g%100-g%10!==10)*g%10],dddd:h,ddd:h.slice(0,3),HH:f.padStart(2,"0"),hh:i?(f%12||12).toString().padStart(2,"0"):f.padStart(2,"0"),h:i?(f%12||12).toString():f,mm:b,ss:d,a:i&&S?S.toLowerCase():""},U={LT:"h:mm a",LTS:"h:mm:ss a",L:"MM/DD/YYYY",l:"M/D/YYYY",LL:"MMMM D, YYYY",ll:"MMM D, YYYY",LLL:"MMMM D, YYYY h:mm a",lll:"MMM D, YYYY h:mm a",LLLL:"dddd, MMMM D, YYYY h:mm a",llll:"ddd, MMM D, YYYY h:mm a"};return e=e.trim(),(U[e]||e).replace(/\b(?:YYYY|YY|MMMM|MMM|MM|M|DD|D|Do|dddd|ddd|HH|hh|h|mm|ss|a)\b/g,_=>x[_]).replace(/\[(.+?)\]/g,(_,A)=>A).trim()};var Ae=(s,{errorType:e=Error,metadata:t={},onError:i=null,removeStackLines:n=1}={})=>{let a=new e(s);if(Object.assign(a,t),a.stack){let o=a.stack.split(`
`);o.splice(1,n),a.stack=o.join(`
`)}let r=()=>{throw typeof global.onError=="function"&&global.onError(a),a};typeof queueMicrotask=="function"?queueMicrotask(r):setTimeout(r,0)};var J=typeof window>"u",Ce=typeof window<"u";var Y=(s="")=>s.replace(/-./g,e=>e[1].toUpperCase()),ce=(s="")=>s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),qe=(s="")=>s.charAt(0).toUpperCase()+s.slice(1);var Te=(s="")=>{let e=["the","a","an","and","but","for","at","by","from","to","in","on","of","or","nor","with","as"];if(k(s))return s.toLowerCase().split(" ").map((t,i)=>i===0||!e.includes(t)?t.charAt(0).toUpperCase()+t.slice(1):t).join(" ")},Zt=(s,{separator:e=", ",lastSeparator:t=" and ",oxford:i=!0,quotes:n=!1,transform:a=N}={})=>{if(!C(s)||s.length===0)return"";let r=s.map(p=>{let l=p;return L(a)&&(l=a(p)),n?`"${l}"`:l});if(r.length===1)return r[0];if(r.length===2)return r.join(t);let o=r.pop(),c=r.join(e);return i&&e.trim()!==t.trim()&&(c+=e.trim()),c+t+o};var ft=(s,e="")=>{e=e.toLowerCase();let t=(a,r)=>{if(a.type===CSSRule.STYLE_RULE)return`${r} ${a.selectorText} { ${a.style.cssText} }`;if(a.type===CSSRule.MEDIA_RULE||a.type===CSSRule.SUPPORTS_RULE)return`@${a.type===CSSRule.MEDIA_RULE?"media":"supports"} ${a.conditionText||""} { ${t(a.cssText,r)} }`;if(a.type===CSSRule.LAYER_STATEMENT_RULE||a.type==0&&a.cssRules){let o=[];return v(a.cssRules,c=>{o.push(t(c,r))}),`@layer ${a.name} { ${o.join(" ")} }`}else return a.cssText},i=new CSSStyleSheet;i.replaceSync(s);let n=[];return v(i.cssRules,a=>{n.push(t(a,e))}),n.join(`
`)};var bt=(s,e,{scopeSelector:t}={})=>{if(J)return;e||(e=document);let i=xe(s);if(e.cssHashes||(e.cssHashes=[]),e.cssHashes.includes(i))return;e.cssHashes.push(i);let n=new CSSStyleSheet;t&&(s=ft(s,t)),n.id=i,n.replaceSync(s),e.adoptedStyleSheets=[...e.adoptedStyleSheets,n]};var We=globalThis,Ye=We.ShadowRoot&&(We.ShadyCSS===void 0||We.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ei=Symbol(),Qt=new WeakMap,je=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==ei)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(Ye&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=Qt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Qt.set(t,e))}return e}toString(){return this.cssText}},Ge=s=>new je(typeof s=="string"?s:s+"",void 0,ei);var kt=(s,e)=>{if(Ye)s.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),n=We.litNonce;n!==void 0&&i.setAttribute("nonce",n),i.textContent=t.cssText,s.appendChild(i)}},Ke=Ye?s=>s:s=>s instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return Ge(t)})(s):s;var{is:Di,defineProperty:Ii,getOwnPropertyDescriptor:Oi,getOwnPropertyNames:zi,getOwnPropertySymbols:Hi,getPrototypeOf:Vi}=Object,Xe=globalThis,ti=Xe.trustedTypes,Fi=ti?ti.emptyScript:"",Ui=Xe.reactiveElementPolyfillSupport,Ee=(s,e)=>s,wt={toAttribute(s,e){switch(e){case Boolean:s=s?Fi:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,e){let t=s;switch(e){case Boolean:t=s!==null;break;case Number:t=s===null?null:Number(s);break;case Object:case Array:try{t=JSON.parse(s)}catch{t=null}}return t}},ni=(s,e)=>!Di(s,e),ii={attribute:!0,type:String,converter:wt,reflect:!1,hasChanged:ni};Symbol.metadata??=Symbol("metadata"),Xe.litPropertyMetadata??=new WeakMap;var Q=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ii){if(t.state&&(t.attribute=!1),this._$Ei(),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),n=this.getPropertyDescriptor(e,i,t);n!==void 0&&Ii(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){let{get:n,set:a}=Oi(this.prototype,e)??{get(){return this[t]},set(r){this[t]=r}};return{get(){return n?.call(this)},set(r){let o=n?.call(this);a.call(this,r),this.requestUpdate(e,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ii}static _$Ei(){if(this.hasOwnProperty(Ee("elementProperties")))return;let e=Vi(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Ee("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ee("properties"))){let t=this.properties,i=[...zi(t),...Hi(t)];for(let n of i)this.createProperty(n,t[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,n]of t)this.elementProperties.set(i,n)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let n=this._$Eu(t,i);n!==void 0&&this._$Eh.set(n,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let n of i)t.unshift(Ke(n))}else e!==void 0&&t.push(Ke(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return kt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$EC(e,t){let i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(n!==void 0&&i.reflect===!0){let a=(i.converter?.toAttribute!==void 0?i.converter:wt).toAttribute(t,i.type);this._$Em=e,a==null?this.removeAttribute(n):this.setAttribute(n,a),this._$Em=null}}_$AK(e,t){let i=this.constructor,n=i._$Eh.get(e);if(n!==void 0&&this._$Em!==n){let a=i.getPropertyOptions(n),r=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:wt;this._$Em=n,this[n]=r.fromAttribute(t,a.type),this._$Em=null}}requestUpdate(e,t,i){if(e!==void 0){if(i??=this.constructor.getPropertyOptions(e),!(i.hasChanged??ni)(this[e],t))return;this.P(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(e,t,i){this._$AL.has(e)||this._$AL.set(e,t),i.reflect===!0&&this._$Em!==e&&(this._$Ej??=new Set).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,a]of this._$Ep)this[n]=a;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[n,a]of i)a.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],a)}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&=this._$Ej.forEach(t=>this._$EC(t,this[t])),this._$EU()}updated(e){}firstUpdated(e){}};Q.elementStyles=[],Q.shadowRootOptions={mode:"open"},Q[Ee("elementProperties")]=new Map,Q[Ee("finalized")]=new Map,Ui?.({ReactiveElement:Q}),(Xe.reactiveElementVersions??=[]).push("2.0.4");var St=globalThis,Je=St.trustedTypes,si=Je?Je.createPolicy("lit-html",{createHTML:s=>s}):void 0,xt="$lit$",ee=`lit$${Math.random().toFixed(9).slice(2)}$`,At="?"+ee,Bi=`<${At}>`,ue=document,Le=()=>ue.createComment(""),Ne=s=>s===null||typeof s!="object"&&typeof s!="function",Ct=Array.isArray,mi=s=>Ct(s)||typeof s?.[Symbol.iterator]=="function",yt=`[ 	
\f\r]`,$e=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ai=/-->/g,ri=/>/g,le=RegExp(`>|${yt}(?:([^\\s"'>=/]+)(${yt}*=${yt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),oi=/'/g,ci=/"/g,ui=/^(?:script|style|textarea|title)$/i,Tt=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),Et=Tt(1),pi=Tt(2),Vs=Tt(3),G=Symbol.for("lit-noChange"),y=Symbol.for("lit-nothing"),li=new WeakMap,me=ue.createTreeWalker(ue,129);function hi(s,e){if(!Ct(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return si!==void 0?si.createHTML(e):e}var di=(s,e)=>{let t=s.length-1,i=[],n,a=e===2?"<svg>":e===3?"<math>":"",r=$e;for(let o=0;o<t;o++){let c=s[o],p,l,m=-1,u=0;for(;u<c.length&&(r.lastIndex=u,l=r.exec(c),l!==null);)u=r.lastIndex,r===$e?l[1]==="!--"?r=ai:l[1]!==void 0?r=ri:l[2]!==void 0?(ui.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=le):l[3]!==void 0&&(r=le):r===le?l[0]===">"?(r=n??$e,m=-1):l[1]===void 0?m=-2:(m=r.lastIndex-l[2].length,p=l[1],r=l[3]===void 0?le:l[3]==='"'?ci:oi):r===ci||r===oi?r=le:r===ai||r===ri?r=$e:(r=le,n=void 0);let g=r===le&&s[o+1].startsWith("/>")?" ":"";a+=r===$e?c+Bi:m>=0?(i.push(p),c.slice(0,m)+xt+c.slice(m)+ee+g):c+ee+(m===-2?o:g)}return[hi(s,a+(s[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},Pe=class s{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let a=0,r=0,o=e.length-1,c=this.parts,[p,l]=di(e,t);if(this.el=s.createElement(p,i),me.currentNode=this.el.content,t===2||t===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(n=me.nextNode())!==null&&c.length<o;){if(n.nodeType===1){if(n.hasAttributes())for(let m of n.getAttributeNames())if(m.endsWith(xt)){let u=l[r++],g=n.getAttribute(m).split(ee),h=/([.?@])?(.*)/.exec(u);c.push({type:1,index:a,name:h[2],strings:g,ctor:h[1]==="."?Qe:h[1]==="?"?et:h[1]==="@"?tt:he}),n.removeAttribute(m)}else m.startsWith(ee)&&(c.push({type:6,index:a}),n.removeAttribute(m));if(ui.test(n.tagName)){let m=n.textContent.split(ee),u=m.length-1;if(u>0){n.textContent=Je?Je.emptyScript:"";for(let g=0;g<u;g++)n.append(m[g],Le()),me.nextNode(),c.push({type:2,index:++a});n.append(m[u],Le())}}}else if(n.nodeType===8)if(n.data===At)c.push({type:2,index:a});else{let m=-1;for(;(m=n.data.indexOf(ee,m+1))!==-1;)c.push({type:7,index:a}),m+=ee.length-1}a++}}static createElement(e,t){let i=ue.createElement("template");return i.innerHTML=e,i}};function pe(s,e,t=s,i){if(e===G)return e;let n=i!==void 0?t._$Co?.[i]:t._$Cl,a=Ne(e)?void 0:e._$litDirective$;return n?.constructor!==a&&(n?._$AO?.(!1),a===void 0?n=void 0:(n=new a(s),n._$AT(s,t,i)),i!==void 0?(t._$Co??=[])[i]=n:t._$Cl=n),n!==void 0&&(e=pe(s,n._$AS(s,e.values),n,i)),e}var Ze=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??ue).importNode(t,!0);me.currentNode=n;let a=me.nextNode(),r=0,o=0,c=i[0];for(;c!==void 0;){if(r===c.index){let p;c.type===2?p=new be(a,a.nextSibling,this,e):c.type===1?p=new c.ctor(a,c.name,c.strings,this,e):c.type===6&&(p=new it(a,this,e)),this._$AV.push(p),c=i[++o]}r!==c?.index&&(a=me.nextNode(),r++)}return me.currentNode=ue,n}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},be=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=y,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=pe(this,e,t),Ne(e)?e===y||e==null||e===""?(this._$AH!==y&&this._$AR(),this._$AH=y):e!==this._$AH&&e!==G&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):mi(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==y&&Ne(this._$AH)?this._$AA.nextSibling.data=e:this.T(ue.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,n=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=Pe.createElement(hi(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{let a=new Ze(n,this),r=a.u(this.options);a.p(t),this.T(r),this._$AH=a}}_$AC(e){let t=li.get(e.strings);return t===void 0&&li.set(e.strings,t=new Pe(e)),t}k(e){Ct(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,n=0;for(let a of e)n===t.length?t.push(i=new s(this.O(Le()),this.O(Le()),this,this.options)):i=t[n],i._$AI(a),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e&&e!==this._$AB;){let i=e.nextSibling;e.remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},he=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,a){this.type=1,this._$AH=y,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=a,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=y}_$AI(e,t=this,i,n){let a=this.strings,r=!1;if(a===void 0)e=pe(this,e,t,0),r=!Ne(e)||e!==this._$AH&&e!==G,r&&(this._$AH=e);else{let o=e,c,p;for(e=a[0],c=0;c<a.length-1;c++)p=pe(this,o[i+c],t,c),p===G&&(p=this._$AH[c]),r||=!Ne(p)||p!==this._$AH[c],p===y?e=y:e!==y&&(e+=(p??"")+a[c+1]),this._$AH[c]=p}r&&!n&&this.j(e)}j(e){e===y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Qe=class extends he{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===y?void 0:e}},et=class extends he{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==y)}},tt=class extends he{constructor(e,t,i,n,a){super(e,t,i,n,a),this.type=5}_$AI(e,t=this){if((e=pe(this,e,t,0)??y)===G)return;let i=this._$AH,n=e===y&&i!==y||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,a=e!==y&&(i===y||n);n&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},it=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){pe(this,e)}},gi={M:xt,P:ee,A:At,C:1,L:di,R:Ze,D:mi,V:pe,I:be,H:he,N:et,U:tt,B:Qe,F:it},qi=St.litHtmlPolyfillSupport;qi?.(Pe,be),(St.litHtmlVersions??=[]).push("3.2.1");var vi=(s,e,t)=>{let i=t?.renderBefore??e,n=i._$litPart$;if(n===void 0){let a=t?.renderBefore??null;i._$litPart$=n=new be(e.insertBefore(Le(),a),a,void 0,t??{})}return n._$AI(s),n};var te=class extends Q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=vi(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}};te._$litElement$=!0,te.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:te});var Wi=globalThis.litElementPolyfillSupport;Wi?.({LitElement:te});(globalThis.litElementVersions??=[]).push("4.1.1");var Me=class s{static DEBUG_MODE=!0;constructor(e){this.input=e,this.pos=0}matches(e){return e.test(this.rest())}rest(){return this.input.slice(this.pos)}step(e=1){this.isEOF()||(this.pos=this.pos+e)}rewind(e=1){this.pos!==0&&(this.pos=this.pos-e)}isEOF(){return this.pos>=this.input.length}peek(){return this.input.charAt(this.pos)}consume(e){let t=typeof e=="string"?new RegExp(Se(e)):new RegExp(e),i=this.input.substring(this.pos),n=t.exec(i);return n&&n.index===0?(this.pos+=n[0].length,n[0]):null}consumeUntil(e){let i=(typeof e=="string"?new RegExp(Se(e)):new RegExp(e)).exec(this.input.substring(this.pos));if(!i){let a=this.input.substr(this.pos);return this.pos=this.input.length,a}let n=this.input.substring(this.pos,this.pos+i.index);return this.pos+=i.index,n}returnTo(e){if(!e)return;let t=typeof e=="string"?new RegExp(Se(e),"gm"):new RegExp(e,"gm"),i=null,n,a=this.input.substring(0,this.pos);for(;(n=t.exec(a))!==null;)i=n;if(i){let r=this.input.substring(0,i.index);return this.pos=i.index,r}}getContext(){let e=!1,t=this.pos-1,i;for(;t>=0&&this.input[t]!==">";){if(this.input[t]==="<"){e=!0,i=t;break}t--}if(e){let n=this.input.substring(i,this.pos),a=/([a-zA-Z-]+)(?=\s*=\s*[^=]*$)/,r=n.match(a),o=r?r[1]:"",c=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","defer","disabled","formnovalidate","inert","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected"],p=!1;if(c.includes(o))p=!0;else{let l=/([a-zA-Z-]+)(?=\s*=\s*(\"|\')\s*[^=]*$)/,m=n.match(l),u=m?m[1]:"";p=o!==u}if(o)return{insideTag:!0,attribute:o,booleanAttribute:p}}return{insideTag:e}}fatal(e){e=e||"Parse error";let i=(typeof this.input=="string"?this.input:"").split(`
`),n=0,a=0;for(let h of i){if(a+h.length+1>this.pos)break;a+=h.length+1,n++}let r=5,o=5,c=Math.max(0,n-r),p=Math.min(i.length,n+o+1),l=i.slice(c,p),m=l.map((h,f)=>`%c${h}`).join(`
`),u="color: grey",g="color: red; font-weight: bold";if(s.DEBUG_MODE){if(globalThis.document){let f="";v(l,(d,S)=>{let M=S<r||S>r?u:g;f+=`<div style="${M}">${d}</div>`});let b=`
          <div style="padding: 1rem; font-size: 14px;">
            <h2>Could not render template</h2>
            <h3>${e}</h3>
            <code style="margin-top: 1rem; display: block; background-color: #EFEFEF; padding: 0.25rem 1rem;border-left: 3px solid #888"><pre>${f}</pre></code>
          </div>
        `;document.body.innerHTML=b}throw console.error(e+`
`+m,...l.map((f,b)=>n-c===b?g:u)),new Error(e)}}};var de=class s{constructor(e){this.templateString=e||"",this.snippets={}}static singleBracketRegExp={IF:/^{\s*#if\s+/,ELSEIF:/^{\s*else\s*if\s+/,ELSE:/^{\s*else\s*/,EACH:/^{\s*#each\s+/,SNIPPET:/^{\s*#snippet\s+/,CLOSE_IF:/^{\s*\/(if)\s*/,CLOSE_EACH:/^{\s*\/(each)\s*/,CLOSE_SNIPPET:/^{\s*\/(snippet)\s*/,SLOT:/^{>\s*slot\s*/,TEMPLATE:/^{>\s*/,HTML_EXPRESSION:/^{\s*#html\s*/,EXPRESSION:/^{\s*/};static singleBracketParserRegExp={NEXT_TAG:/(\{|\<svg|\<\/svg)/,EXPRESSION_START:/\{/,EXPRESSION_END:/\}/,TAG_CLOSE:/\>/};static doubleBracketRegExp={IF:/^{{\s*#if\s+/,ELSEIF:/^{{\s*else\s*if\s+/,ELSE:/^{{\s*else\s*/,EACH:/^{{\s*#each\s+/,SNIPPET:/^{{\s*#snippet\s+/,CLOSE_IF:/^{{\s*\/(if)\s*/,CLOSE_EACH:/^{{\s*\/(each)\s*/,CLOSE_SNIPPET:/^{{\s*\/(snippet)\s*/,SLOT:/^{{>\s*slot\s*/,TEMPLATE:/^{{>\s*/,HTML_EXPRESSION:/^{{\s*#html\s*/,EXPRESSION:/^{{\s*/};static doubleBracketParserRegExp={NEXT_TAG:/(\{\{|\<svg|\<\/svg)/,EXPRESSION_START:/\{\{/,EXPRESSION_END:/\}\}/,TAG_CLOSE:/\>/};static htmlRegExp={SVG_OPEN:/^\<svg\s*/i,SVG_CLOSE:/^\<\/svg\s*/i};static preprocessRegExp={WEB_COMPONENT_SELF_CLOSING:/<(\w+-\w+)([^>]*)\/>/g};static templateRegExp={VERBOSE_KEYWORD:/^(template|snippet)\W/g,VERBOSE_PROPERTIES:/(\w+)\s*=\s*(((?!\w+\s*=).)+)/gms,STANDARD:/(\w+)\s*=\s*((?:(?!\n|$|\w+\s*=).)+)/g,DATA_OBJECT:/(\w+)\s*:\s*([^,}]+)/g,SINGLE_QUOTES:/\'/g};compile(e=this.templateString){e=s.preprocessTemplate(e);let t=new Me(e);k(e)||t.fatal("Template is not a string",e);let{htmlRegExp:i}=s,n=s.detectSyntax(e),a=n=="doubleBracket"?s.doubleBracketRegExp:s.singleBracketRegExp,r=n=="doubleBracket"?s.doubleBracketParserRegExp:s.singleBracketParserRegExp,o=h=>{let f=()=>{if(h.peek()=="}"){h.consumeUntil(r.EXPRESSION_END);return}let b=1,d=h.peek();for(;b>0&&!h.isEOF();){if(h.step(),h.peek()=="{"&&b++,h.peek()=="}"&&b--,b==0){h.rewind();break}d+=h.peek()}return h.consumeUntil(r.EXPRESSION_END),h.consume(r.EXPRESSION_END),d=d.trim(),d};for(let b in a)if(h.matches(a[b])){let d=h.getContext();h.consume(a[b]);let S=f();h.consume(r.EXPRESSION_END);let M=this.getValue(S);return{type:b,content:M,...d}}for(let b in i)if(h.matches(i[b])){h.consume(i[b]);let d=h.getContext(),S=this.getValue(h.consumeUntil(r.TAG_CLOSE).trim());return h.consume(r.TAG_CLOSE),{type:b,content:S,...d}}return null},c=[],p=[],l=null,m=[],u=[];for(;!t.isEOF();){let h=o(t),f=ve(m),b=l?.content||c;if(h){let d={type:h.type.toLowerCase()};switch(h.type){case"IF":d={...d,condition:h.content,content:[],branches:[]},b.push(d),m.push(d),u.push(d),l=d;break;case"ELSEIF":d={...d,condition:h.content,content:[]},f||(t.returnTo(a.ELSEIF),t.fatal("{{elseif}} encountered without matching if condition")),u.pop(),u.push(d),f.branches.push(d),l=d;break;case"ELSE":if(d={...d,content:[]},!f){t.returnTo(a.ELSE),t.fatal("{{else}} encountered without matching if or each condition");break}f.type==="if"?(u.pop(),u.push(d),f.branches.push(d),l=d):f.type==="each"?(u.pop(),u.push(d),f.else=d,l=d):(t.returnTo(a.ELSE),t.fatal("{{else}} encountered with unknown condition type: "+f.type));break;case"CLOSE_IF":m.length==0&&(t.returnTo(a.CLOSE_IF),t.fatal("{{/if}} close tag found without open if tag")),p.pop(),u.pop(),m.pop(),l=ve(u);break;case"SNIPPET":d={...d,type:"snippet",name:h.content,content:[]},this.snippets[h.content]=d,b.push(d),m.push(d),u.push(d),l=d;break;case"CLOSE_SNIPPET":m.length==0&&(t.returnTo(a.CLOSE_IF),t.fatal("{{/snippet}} close tag found without open if tag")),p.pop(),u.pop(),l=ve(u);break;case"HTML_EXPRESSION":d={...d,type:"expression",unsafeHTML:!0,value:h.content},b.push(d),t.consume("}");break;case"EXPRESSION":d={...d,value:h.content},h.booleanAttribute&&(d.ifDefined=!0),b.push(d);break;case"TEMPLATE":let S=this.parseTemplateString(h.content);d={...d,...S},b.push(d);break;case"SLOT":d={...d,name:h.content},b.push(d);break;case"EACH":let M,x,U,B=h.content.split(" in "),_=h.content.split(" as ");if(B.length>1){let A=B[0].trim();M=B[1].trim();let q=A.indexOf(",");q!==-1?(x=A.substring(0,q).trim(),U=A.substring(q+1).trim()):x=A}else if(_.length>1){M=_[0].trim();let A=_[1].trim(),q=A.indexOf(",");q!==-1?(x=A.substring(0,q).trim(),U=A.substring(q+1).trim()):x=A}else M=h.content.trim();d={...d,over:M,content:[]},x&&(d.as=x),U&&(d.indexAs=U),u.push(d),m.push(d),b.push(d),l=d;break;case"CLOSE_EACH":p.pop(),u.pop(),m.pop(),l=ve(u);break;case"SVG_OPEN":b.push({type:"html",html:"<svg "}),b.push(...this.compile(h.content)),b.push({type:"html",html:">"}),d={type:"svg",content:[]},u.push(d),b.push(d),l=d;break;case"SVG_CLOSE":p.pop(),u.pop(),l=ve(u),d={type:"html",html:"</svg>"},(l||c).push(d);break}}else{let d=t.consumeUntil(r.NEXT_TAG);if(d){let S={type:"html",html:d};b.push(S)}}}return s.optimizeAST(c)}getValue(e){return e=="true"?!0:e=="false"?!1:k(e)&&e.trim()!==""&&Number.isFinite(+e)?Number(e):e}parseTemplateString(e=""){let t=s.templateRegExp,i={};if(t.VERBOSE_KEYWORD.lastIndex=0,t.VERBOSE_KEYWORD.test(e)){let n=[...e.matchAll(t.VERBOSE_PROPERTIES)];v(n,(a,r)=>{let o=a[1],c=s.getObjectFromString(a[2]);i[o]=c})}else{let n={},a=e.split(/\b/)[0];i.name=`'${a}'`;let r=[...e.matchAll(t.STANDARD)];v(r,(o,c)=>{let p=o[1].trim(),l=o[2].trim();n[p]=l}),i.reactiveData=n}return i}static getObjectFromString(e=""){let t=s.templateRegExp.DATA_OBJECT,i={},n,a=!1;for(;(n=t.exec(e))!==null;)a=!0,i[n[1]]=n[2].trim();return a?i:e.trim()}static detectSyntax(e=""){let t=e.search(/{{\s*/),i=e.search(/{[^{]\s*/);return t!==-1&&t<i?"doubleBracket":"singleBracket"}static preprocessTemplate(e=""){return e=e.trim(),e=e.replace(s.preprocessRegExp.WEB_COMPONENT_SELF_CLOSING,(t,i,n)=>`<${i}${n}></${i}>`),e}static optimizeAST(e){let t=[],i=null,n=a=>{a.type==="html"?i?i.html+=a.html:(i={...a},t.push(i)):(i&&(i=null),Array.isArray(a.content)&&(a.content=this.optimizeAST(a.content)),a.else&&a.else.content&&(a.else.content=this.optimizeAST(a.else.content)),t.push(a))};return e.forEach(n),t}};var nt=class s{static globalThisProxy=new Proxy({},{get(e,t){return globalThis[t]},set(e,t,i){return globalThis[t]=i,!0}});static eventHandlers=[];constructor(e,{root:t=document,pierceShadow:i=!1}={}){let n=[];if(t){if(e===window||e===globalThis||w(e,["window","globalThis"])||e==s.globalThisProxy)n=[s.globalThisProxy],this.isBrowser=Ce,this.isGlobal=!0;else if(C(e)||e instanceof NodeList||e instanceof HTMLCollection)e=Array.from(e),n=e;else if(k(e))if(e.trim().slice(0,1)=="<"){let a=document.createElement("template");a.innerHTML=e.trim(),n=Array.from(a.content.childNodes)}else n=i?this.querySelectorAllDeep(t,e):t.querySelectorAll(e);else ze(e)?n=[e]:e instanceof NodeList&&(n=e);this.selector=e,this.length=n.length,this.options={root:t,pierceShadow:i},Object.assign(this,n)}}chain(e){return this.isGlobal&&!e?new s(globalThis,this.options):new s(e,this.options)}querySelectorAllDeep(e,t,i=!0){let n=[],a=ze(t),r=!1,o;i&&(a&&e==t||e.matches&&e.matches(t))&&n.push(e),a?o=!0:e.querySelectorAll?(n.push(...e.querySelectorAll(t)),o=!0):o=!1;let c=(m,u)=>{a&&(m===u||m.contains)?m.contains(u)&&(n.push(u),r=!0):m.querySelectorAll&&n.push(...m.querySelectorAll(u))},p=(m,u)=>{let g=u.split(" "),h,f;return v(g,(b,d)=>{if(h=g.slice(0,d+1).join(" "),m.matches(h)){f=g.slice(d+1).join(" ");return}}),f||u},l=(m,u,g)=>{r||(g===!0&&(c(m,u),o=!0),m.nodeType===Node.ELEMENT_NODE&&m.shadowRoot&&(u=p(m,u),c(m.shadowRoot,u),l(m.shadowRoot,u,!o)),m.assignedNodes&&(u=p(m,u),m.assignedNodes().forEach(h=>l(h,u,o))),m.childNodes.length&&m.childNodes.forEach(h=>l(h,u,o)))};return l(e,t),[...new Set(n)]}each(e){for(let t=0;t<this.length;t++){let i=this[t],n=this.chain(i);e.call(n,i,t)}return this}removeAllEvents(){s.eventHandlers=[]}find(e){let t=Array.from(this).flatMap(i=>this.options.pierceShadow?this.querySelectorAllDeep(i,e,!1):Array.from(i.querySelectorAll(e)));return this.chain(t)}parent(e){let t=Array.from(this).map(i=>i.parentElement).filter(Boolean);return e?this.chain(t).filter(e):this.chain(t)}children(e){let t=Array.from(this).flatMap(n=>Array.from(n.children)),i=e?t.filter(n=>n.matches(e)):t;return this.chain(i)}siblings(e){let t=Array.from(this).flatMap(i=>{if(i.parentNode)return Array.from(i.parentNode.children).filter(n=>n!==i)}).filter(Boolean);return e?this.chain(t).filter(e):this.chain(t)}index(e){let t=this.el();if(!t?.parentNode)return-1;let n=this.chain(t.parentNode.children).filter(e).get(),a=this.get();return fe(n,r=>w(r,a))}indexOf(e){let t=this.get(),i=this.filter(e).get(0);return t.indexOf(i)}filter(e){if(!e)return this;let t=[];return L(e)?t=Array.from(this).filter(e):t=Array.from(this).filter(i=>{if(k(e))return i.matches&&i.matches(e);if(e instanceof s)return e.get().includes(i);{let n=C(e)?e:[e];return w(i,n)}}),this.chain(t)}is(e){return Array.from(this).filter(i=>typeof e=="string"?i.matches&&i.matches(e):this.isGlobal?w(e,["window","globalThis"]):(e instanceof s?e.get():[e]).includes(i)).length===this.length}not(e){let t=Array.from(this).filter(i=>typeof e=="string"?!i.matches||i.matches&&!i.matches(e):this.isGlobal?!w(e,["window","globalThis"]):!(e instanceof s?e.get():[e]).includes(i));return this.chain(t)}closest(e){let t=Array.from(this).map(i=>{if(this.options.pierceShadow)return this.closestDeep(i,e);if(e&&i?.closest)return i.closest(e);if(this.isGlobal)return w(e,["window","globalThis"])}).filter(Boolean);return this.chain(t)}closestDeep(e,t){let i=e,n=ze(t),a=k(t);for(;i;){if(n&&i===t||a&&i.matches(t))return i;if(i.parentElement)i=i.parentElement;else if(i.parentNode&&i.parentNode.host)i=i.parentNode.host;else return}}ready(e){return this.is(document)&&document.readyState=="loading"?this.on("ready",e):e.call(document,new Event("DOMContentLoaded")),this}getEventAlias(e){return{ready:"DOMContentLoaded"}[e]||e}getEventArray(e){return e.split(" ").map(t=>this.getEventAlias(t)).filter(Boolean)}on(e,t,i,n){let a=[],r,o;return D(i)?(n=i,r=t):k(t)?(o=t,r=i):L(t)&&(r=t),this.getEventArray(e).forEach(p=>{let l=n?.abortController||new AbortController,m=n?.eventSettings||{},u=l.signal;this.each(g=>{let h;o&&(h=S=>{let M;if(S.composed&&S.composedPath){let x=S.composedPath(),U=fe(x,B=>B==g);x=x.slice(0,U),M=x.find(B=>B instanceof Element&&B.matches&&B.matches(o))}else M=S.target.closest(o);M&&r.call(M,S)});let f=h||r,b=g==s.globalThisProxy?globalThis:g;b.addEventListener&&b.addEventListener(p,f,{signal:u,...m});let d={el:g,eventName:p,eventListener:f,abortController:l,delegated:o!==void 0,handler:r,abort:S=>l.abort(S)};a.push(d)})}),s.eventHandlers||(s.eventHandlers=[]),s.eventHandlers.push(...a),n?.returnHandler?a.length==1?a[0]:a:this}one(e,t,i,n){let a,r;D(i)?(n=i,a=t):k(t)?(r=t,a=i):L(t)&&(a=t),n=n||{};let o=new AbortController;n.abortController=o;let c=function(...p){o.abort(),a.apply(this,p)};return r?this.on(e,r,c,n):this.on(e,c,n)}off(e,t){let i=this.getEventArray(e);return s.eventHandlers=s.eventHandlers.filter(n=>{if((!e||w(n.eventName,i))&&(!t||t?.eventListener==n.eventListener||n.eventListener===t||n.handler===t)){let a=this.isGlobal?globalThis:n.el;return a.removeEventListener&&a.removeEventListener(n.eventName,n.eventListener),!1}return!0}),this}trigger(e,t){return this.each(i=>{if(typeof i.dispatchEvent!="function")return;let n=new Event(e,{bubbles:!0,cancelable:!0});t&&Object.assign(n,t),i.dispatchEvent(n)})}click(e){return this.trigger("click",e)}dispatchEvent(e,t={},i={}){let n={bubbles:!0,cancelable:!0,composed:!0,detail:t,...i};return this.each(a=>{let r=new CustomEvent(e,n);a.dispatchEvent(r)}),this}remove(){return this.each(e=>e.remove())}addClass(e){let t=e.split(" ");return this.each(i=>i.classList.add(...t))}hasClass(e){return Array.from(this).some(t=>t.classList.contains(e))}removeClass(e){let t=e.split(" ");return this.each(i=>i.classList.remove(...t))}toggleClass(e){let t=e.split(" ");return this.each(i=>i.classList.toggle(...t))}html(e){if(e!==void 0)return this.each(t=>t.innerHTML=e);if(this.length>0)return this.map(t=>t.innerHTML||t.nodeValue).join("")}outerHTML(e){if(e!==void 0)return this.each(t=>t.outerHTML=e);if(this.length)return this.map(t=>t.outerHTML).join("")}text(e){if(e!==void 0)return this.each(t=>t.textContent=e);{let t=n=>n.nodeName==="SLOT"?n.assignedNodes({flatten:!0}):n.childNodes,i=this.map(n=>this.getTextContentRecursive(t(n)));return i.length>1?i:i[0]}}getTextContentRecursive(e){return Array.from(e).map(t=>{if(t.nodeType===Node.TEXT_NODE)return t.nodeValue;if(t.nodeName==="SLOT"){let i=t.assignedNodes({flatten:!0});return this.getTextContentRecursive(i)}else return this.getTextContentRecursive(t.childNodes)}).join("").trim()}textNode(){return Array.from(this).map(e=>Array.from(e.childNodes).filter(t=>t.nodeType===Node.TEXT_NODE).map(t=>t.nodeValue).join("")).join("")}map(...e){return Array.from(this).map(...e)}value(e){if(e!==void 0)return this.each(t=>{(t instanceof HTMLInputElement||t instanceof HTMLSelectElement||t instanceof HTMLTextAreaElement)&&(t.value=e)});{let t=this.map(i=>{if(i instanceof HTMLInputElement||i instanceof HTMLSelectElement||i instanceof HTMLTextAreaElement)return i.value});return t.length>1?t:t[0]}}val(...e){return this.value(...e)}focus(){return this.length&&this[0].focus(),this}blur(){return this.length&&this[0].blur(),this}css(e,t=null,i={includeComputed:!1}){let n=Array.from(this);if(ne(e)||t!==null)return ne(e)?Object.entries(e).forEach(([a,r])=>{n.forEach(o=>o.style.setProperty(ce(a),r))}):n.forEach(a=>a.style.setProperty(ce(e),t)),this;if(n?.length){let a=n.map(r=>{let o=r.style[e];if(i.includeComputed)return window.getComputedStyle(r).getPropertyValue(e);if(o)return o});return n.length===1?a[0]:a}}computedStyle(e){return this.css(e,null,{includeComputed:!0})}cssVar(e,t){return this.css(`--${e}`,t,{includeComputed:!0})}attr(e,t){if(ne(e))Object.entries(e).forEach(([i,n])=>{this.each(a=>a.setAttribute(i,n))});else if(t!==void 0)this.each(i=>i.setAttribute(e,t));else if(this.length){let i=this.map(n=>n.getAttribute(e));return i.length>1?i:i[0]}}removeAttr(e){return this.each(t=>t.removeAttribute(e))}el(){return this.get(0)}get(e){return e!==void 0?this[e]:Array.from(this)}eq(e){return this.chain(this[e])}first(){return this.eq(0)}last(){return this.eq(this.length-1)}prop(e,t){return t!==void 0?this.each(i=>{i[e]=t}):this.length==0?void 0:this.length===1?this[0][e]:this.map(i=>i[e])}next(e){let t=this.map(i=>{let n=i.nextElementSibling;for(;n;){if(!e||n.matches(e))return n;n=n.nextElementSibling}return null}).filter(Boolean);return this.chain(t)}prev(e){let t=this.map(i=>{let n=i.previousElementSibling;for(;n;){if(!e||n.matches(e))return n;n=n.previousElementSibling}return null}).filter(Boolean);return this.chain(t)}height(e){return this.prop("innerHeight",e)||this.prop("clientHeight",e)}width(e){return this.prop("innerWidth",e)||this.prop("clientWidth",e)}scrollHeight(e){return(this.isGlobal&&this.isBrowser?this.chain(document.documentElement):this).prop("scrollHeight",e)}scrollWidth(e){return(this.isGlobal&&this.isBrowser?this.chain(document.documentElement):this).prop("scrollWidth",e)}scrollLeft(e){return(this.isGlobal&&this.isBrowser?this.chain(document.documentElement):this).prop("scrollLeft",e)}scrollTop(e){return(this.isGlobal&&this.isBrowser?this.chain(document.documentElement):this).prop("scrollTop",e)}clone(){let e=document.createDocumentFragment();return this.each(t=>{e.appendChild(t.cloneNode(!0))}),this.chain(e.childNodes)}reverse(){let e=this.get().reverse();return this.chain(e)}insertContent(e,t,i){this.chain(t).each(a=>{if(e.insertAdjacentElement)e.insertAdjacentElement(i,a);else switch(i){case"beforebegin":e.parentNode?.insertBefore(a,e);break;case"afterbegin":e.insertBefore(a,e.firstChild);break;case"beforeend":e.appendChild(a);break;case"afterend":e.parentNode?.insertBefore(a,e.nextSibling);break}})}prepend(e){return this.each(t=>{this.insertContent(t,e,"afterbegin")})}append(e){return this.each(t=>{this.insertContent(t,e,"beforeend")})}insertBefore(e){return this.chain(e).each(t=>{this.insertContent(t,this.selector,"beforebegin")})}insertAfter(e){return this.chain(e).each(t=>{this.insertContent(t,this.selector,"afterend")})}detach(){return this.each(e=>{e.parentNode&&e.parentNode.removeChild(e)})}naturalWidth(){let e=this.map(t=>{let i=$(t).clone();i.insertAfter(t).css({position:"absolute",display:"block",transform:"translate(-9999px, -9999px)",zIndex:"-1"});let n=i.width();return i.remove(),n});return e.length>1?e:e[0]}naturalHeight(){let e=this.map(t=>{let i=$(t).clone();i.insertAfter(t).css({position:"absolute",display:"block",transform:"translate(-9999px, -9999px)",zIndex:"-1"});let n=i.height();return i.remove(),n});return e.length>1?e:e[0]}offsetParent({calculate:e=!0}={}){return Array.from(this).map(t=>{if(!e)return t.offsetParent;let i,n,a,r,o=t?.parentNode;for(;o&&!n&&!a&&!r;)o=o?.parentNode,o&&(i=$(o),n=i.computedStyle("position")!=="static",a=i.computedStyle("transform")!=="none",r=i.is("body"));return o})}count(){return this.length}exists(){return this.length>0}initialize(e){document.addEventListener("DOMContentLoaded",()=>{this.settings(e)})}settings(e){this.each(t=>{v(e,(i,n)=>{t[n]=i})})}setting(e,t){this.each(i=>{i[e]=t})}component(){let e=this.map(t=>t.component).filter(Boolean);return e.length>1?e:e[0]}dataContext(){let e=this.map(t=>t.dataContext).filter(Boolean);return e.length>1?e:e[0]}};var I=function(s,e={}){let t=typeof window<"u";return!e?.root&&t&&(e.root=document),new nt(s,e)};var R=class s{static current=null;static pendingReactions=new Set;static afterFlushCallbacks=[];static isFlushScheduled=!1;static scheduleReaction(e){s.pendingReactions.add(e),s.scheduleFlush()}static scheduleFlush(){s.isFlushScheduled||(s.isFlushScheduled=!0,typeof queueMicrotask=="function"?queueMicrotask(()=>s.flush()):Promise.resolve().then(()=>s.flush()))}static flush(){s.isFlushScheduled=!1,s.pendingReactions.forEach(e=>e.run()),s.pendingReactions.clear(),s.afterFlushCallbacks.forEach(e=>e()),s.afterFlushCallbacks=[]}static afterFlush(e){s.afterFlushCallbacks.push(e)}static getSource(){if(!s.current||!s.current.context||!s.current.context.trace){console.log("No source available or no current reaction.");return}let e=s.current.context.trace;return e=e.split(`
`).slice(2).join(`
`),e=`Reaction triggered by:
${e}`,console.info(e),e}};var ge=class{constructor(){this.subscribers=new Set}depend(){R.current&&(this.subscribers.add(R.current),R.current.dependencies.add(this))}changed(e){this.subscribers.forEach(t=>t.invalidate(e))}cleanUp(e){this.subscribers.delete(e)}unsubscribe(e){this.subscribers.delete(e)}};var E=class s{constructor(e){this.callback=e,this.dependencies=new Set,this.boundRun=this.run.bind(this),this.firstRun=!0,this.active=!0}run(){this.active&&(R.current=this,this.dependencies.forEach(e=>e.cleanUp(this)),this.dependencies.clear(),this.callback(this),this.firstRun=!1,R.current=null,R.pendingReactions.delete(this))}invalidate(e){this.active=!0,e&&(this.context=e),R.scheduleReaction(this)}stop(){this.active&&(this.active=!1,this.dependencies.forEach(e=>e.unsubscribe(this)))}static get current(){return R.current}static flush=R.flush;static scheduleFlush=R.scheduleFlush;static afterFlush=R.afterFlush;static getSource=R.getSource;static create(e){let t=new s(e);return t.run(),t}static nonreactive(e){let t=R.current;R.current=null;try{return e()}finally{R.current=t}}static guard(e,t=V){if(!R.current)return e();let i=new ge,n,a;i.depend();let r=new s(()=>{a=e(),!r.firstRun&&!t(a,n)&&i.changed(),n=j(a)});return r.run(),a}};var z=class s{constructor(e,{equalityFunction:t,allowClone:i=!0,cloneFunction:n}={}){this.dependency=new ge,this.allowClone=i,this.equalityFunction=t?X(t):s.equalityFunction,this.clone=n?X(n):s.cloneFunction,this.currentValue=this.maybeClone(e)}static equalityFunction=V;static cloneFunction=j;get value(){this.dependency.depend();let e=this.currentValue;return Array.isArray(e)||typeof e=="object"?this.maybeClone(e):e}canCloneValue(e){return this.allowClone===!0&&!He(e)}maybeClone(e){return this.canCloneValue(e)?C(e)?e=e.map(t=>this.maybeClone(t)):this.clone(e):e}set value(e){this.equalityFunction(this.currentValue,e)||(this.currentValue=this.maybeClone(e),this.dependency.changed({value:e,trace:new Error().stack}))}get(){return this.value}set(e){this.equalityFunction(this.currentValue,e)||(this.value=e)}subscribe(e){return E.create(t=>{e(this.value,t)})}peek(){return this.maybeClone(this.currentValue)}clear(){return this.set(void 0)}push(...e){let t=this.peek();t.push(...e),this.set(t)}unshift(...e){let t=this.peek();t.unshift(...e),this.set(t)}splice(...e){let t=this.peek();t.splice(...e),this.set(t)}map(e){let t=Array.prototype.map.call(this.peek(),e);this.set(t)}filter(e){let t=Array.prototype.filter.call(this.peek(),e);this.set(t)}getIndex(e){return this.get()[e]}setIndex(e,t){let i=this.peek();i[e]=t,this.set(i)}removeIndex(e){let t=this.peek();t.splice(e,1),this.set(t)}setArrayProperty(e,t,i){let n;pt(e)?n=e:(n="all",i=t,t=e);let a=this.peek().map((r,o)=>((n=="all"||o==n)&&(r[t]=i),r));this.set(a)}toggle(){return this.set(!this.peek())}increment(e=1){return this.set(this.peek()+e)}decrement(e=1){return this.set(this.peek()-e)}now(){return this.set(new Date)}getIDs(e){return D(e)?se([e?._id,e?.id,e?.hash,e?.key].filter(Boolean)):[e]}getID(e){return this.getIDs(e).filter(Boolean)[0]}hasID(e,t){return this.getID(e)===t}getItem(e){return fe(this.currentValue,t=>this.hasID(t,e))}setProperty(e,t,i){if(arguments.length==3){let n=e,a=this.getItem(n);return this.setArrayProperty(a,t,i)}else{i=t,t=e;let n=this.peek();n[t]=i,this.set(n)}}replaceItem(e,t){return this.setIndex(this.getItem(e),t)}removeItem(e){return this.removeIndex(this.getItem(e))}};var ke={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},F=s=>(...e)=>({_$litDirective$:s,values:e}),ae=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var{I:ji}=gi;var bi=s=>s.strings===void 0,fi=()=>document.createComment(""),we=(s,e,t)=>{let i=s._$AA.parentNode,n=e===void 0?s._$AB:e._$AA;if(t===void 0){let a=i.insertBefore(fi(),n),r=i.insertBefore(fi(),n);t=new ji(a,r,s,s.options)}else{let a=t._$AB.nextSibling,r=t._$AM,o=r!==s;if(o){let c;t._$AQ?.(s),t._$AM=s,t._$AP!==void 0&&(c=s._$AU)!==r._$AU&&t._$AP(c)}if(a!==n||o){let c=t._$AA;for(;c!==a;){let p=c.nextSibling;i.insertBefore(c,n),c=p}}}return t},re=(s,e,t=s)=>(s._$AI(e,t),s),Yi={},ki=(s,e=Yi)=>s._$AH=e,wi=s=>s._$AH,st=s=>{s._$AP?.(!1,!0);let e=s._$AA,t=s._$AB.nextSibling;for(;e!==t;){let i=e.nextSibling;e.remove(),e=i}};var Re=(s,e)=>{let t=s._$AN;if(t===void 0)return!1;for(let i of t)i._$AO?.(e,!1),Re(i,e);return!0},at=s=>{let e,t;do{if((e=s._$AM)===void 0)break;t=e._$AN,t.delete(s),s=e}while(t?.size===0)},yi=s=>{for(let e;e=s._$AM;s=e){let t=e._$AN;if(t===void 0)e._$AN=t=new Set;else if(t.has(s))break;t.add(s),Xi(e)}};function Gi(s){this._$AN!==void 0?(at(this),this._$AM=s,yi(this)):this._$AM=s}function Ki(s,e=!1,t=0){let i=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(e)if(Array.isArray(i))for(let a=t;a<i.length;a++)Re(i[a],!1),at(i[a]);else i!=null&&(Re(i,!1),at(i));else Re(this,s)}var Xi=s=>{s.type==ke.CHILD&&(s._$AP??=Ki,s._$AQ??=Gi)},Z=class extends ae{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,i){super._$AT(e,t,i),yi(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(Re(this,e),at(this))}setValue(e){if(bi(this._$Ct))this._$Ct._$AI(e,this);else{let t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}};var _e=class extends ae{constructor(e){if(super(e),this.it=y,e.type!==ke.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===y||e==null)return this._t=void 0,this.it=e;if(e===G)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;let t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}};_e.directiveName="unsafeHTML",_e.resultType=1;var Si=F(_e);var xi=s=>s??y;var rt=class extends Z{constructor(e){super(e),this.partInfo=e,this.reaction=null}render(e,t={}){if(this.expression=e,this.settings=t,this.reaction)return this.getReactiveValue();{let i;return this.reaction=E.create(n=>{if(!this.isConnected){n.stop();return}i=this.getReactiveValue(),this.settings.unsafeHTML&&(i=Si(i)),n.firstRun||this.setValue(i)}),i}}getReactiveValue(){let e=this.expression.value();return this.settings.ifDefined&&w(e,[void 0,null,!1,0])?xi(void 0):((C(e)||D(e))&&(e=JSON.stringify(e)),e)}disconnected(){this.reaction&&(this.reaction.stop(),this.reaction=null)}reconnected(){}},Ai=F(rt);var ot=class extends Z{constructor(e){super(e),this.reaction=null}render(e){this.reaction&&this.reaction.stop();let t=y;return this.reaction=E.create(i=>{if(!this.isConnected){i.stop();return}if(e.condition())t=e.content();else if(e.branches?.length){let n=!1;v(e.branches,a=>{(!n&&a.type=="elseif"&&a.condition()||!n&&a.type=="else")&&(n=!0,t=a.content())})}else t=y;return t||(t=y),i.firstRun||this.setValue(t),t}),t}disconnected(){this.reaction&&(this.reaction.stop(),this.reaction=null)}reconnected(){}},Ci=F(ot);var Ti=(s,e,t)=>{let i=new Map;for(let n=e;n<=t;n++)i.set(s[n],n);return i},$t=F(class extends ae{constructor(s){if(super(s),s.type!==ke.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,e,t){let i;t===void 0?t=e:e!==void 0&&(i=e);let n=[],a=[],r=0;for(let o of s)n[r]=i?i(o,r):r,a[r]=t(o,r),r++;return{values:a,keys:n}}render(s,e,t){return this.dt(s,e,t).values}update(s,[e,t,i]){let n=wi(s),{values:a,keys:r}=this.dt(e,t,i);if(!Array.isArray(n))return this.ut=r,a;let o=this.ut??=[],c=[],p,l,m=0,u=n.length-1,g=0,h=a.length-1;for(;m<=u&&g<=h;)if(n[m]===null)m++;else if(n[u]===null)u--;else if(o[m]===r[g])c[g]=re(n[m],a[g]),m++,g++;else if(o[u]===r[h])c[h]=re(n[u],a[h]),u--,h--;else if(o[m]===r[h])c[h]=re(n[m],a[h]),we(s,c[h+1],n[m]),m++,h--;else if(o[u]===r[g])c[g]=re(n[u],a[g]),we(s,n[m],n[u]),u--,g++;else if(p===void 0&&(p=Ti(r,g,h),l=Ti(o,m,u)),p.has(o[m]))if(p.has(o[u])){let f=l.get(r[g]),b=f!==void 0?n[f]:null;if(b===null){let d=we(s,n[m]);re(d,a[g]),c[g]=d}else c[g]=re(b,a[g]),we(s,n[m],b),n[f]=null;g++}else st(n[u]),u--;else st(n[m]),m++;for(;g<=h;){let f=we(s,c[h+1]);re(f,a[g]),c[g++]=f}for(;m<=u;){let f=n[m++];f!==null&&st(f)}return this.ut=r,ki(s,c),G}});var ct=class extends Z{constructor(e){super(e),this.reaction=null,this.items=[],this.eachCondition=null}render(e,t={}){return this.eachCondition=e,this.reaction&&(this.reaction.stop(),this.reaction=null),this.reaction=E.create(i=>{if(!this.isConnected){i.stop();return}if(this.items=this.getItems(this.eachCondition),!i.firstRun){let n=this.renderItems();this.setValue(n)}}),this.renderItems()}renderItems(){let e=this.getItems(this.eachCondition);if(!e?.length>0&&this.eachCondition.else)return $t([1],()=>"else-case",()=>this.eachCondition.else());let t=this.getCollectionType(e);return t=="object"&&(e=Fe(e)),$t(e,(i,n)=>this.getItemID(i,n,t),(i,n)=>this.getTemplate(i,n,t))}getCollectionType(e){return C(e)?"array":"object"}getItems(){return this.eachCondition.over()||[]}getTemplate(e,t,i){let n=this.getEachData(e,t,i,this.eachCondition);return this.eachCondition.content(n)}getItemID(e,t,i){return ne(e)?(i=="object"?t:void 0)||e._id||e.id||e.key||e.hash||e._hash||e.value||t:k(e)?e:t}getEachData(e,t,i,n){let{as:a,indexAs:r}=n;return r||(r=i=="array"?"index":"key"),i=="object"&&(e=e.value,t=e.key),a?{[a]:e,[r]:t}:{...e,this:e,[r]:t}}disconnected(){this.reaction&&(this.reaction.stop(),this.reaction=null)}reconnected(){}},Ei=F(ct);var lt=class extends Z{constructor(e){super(e),this.renderRoot=e.options?.host?.renderRoot,this.template=null,this.part=null}render({getTemplate:e,templateName:t,subTemplates:i,data:n,parentTemplate:a}){return this.parentTemplate=a,this.getTemplate=e,this.subTemplates=i,this.data=n,this.ast=null,this.reaction=E.create(r=>{this.maybeCreateTemplate();let o=this.unpackData(this.data);if(!this.isConnected){r.stop();return}if(r.firstRun||!this.template||this.template?.ast.length==0)return;let c=this.renderTemplate(o);this.setValue(c)}),this.maybeCreateTemplate(),!this.template||this.template?.ast.length==0?y:this.renderTemplate()}renderTemplate(e){return this.attachTemplate(),e||(e=this.unpackData(this.data)),this.template.setDataContext(e),this.template.render()}maybeCreateTemplate(){let e,t,i=this.getTemplate();if(k(i)?(e=i,t=this.subTemplates[e]):i instanceof De&&(t=i,e=t.templateName),!t)return!1;this.templateID=t.id,this.template=t.clone({templateName:e,subTemplates:this.subTemplates,data:this.unpackData(this.data)})}attachTemplate(){let{parentNode:e,startNode:t,endNode:i}=this.part||{},n=this.part?.options?.host,a=n?.renderRoot;this.template.setElement(n),this.template.attach(a,{element:n,parentNode:e,startNode:t,endNode:i}),this.parentTemplate&&this.template.setParent(this.parentTemplate)}unpackData(e){return W(e,t=>t())}update(e,t){return this.part=e,this.render.apply(this,t)}reconnected(){}disconnected(){this.template&&this.template.onDestroyed()}},$i=F(lt);var Ie=class s{static html=Et;static PARENS_REGEXP=/('[^']*'|"[^"]*"|\(|\)|[^\s()]+)/g;static STRING_REGEXP=/^\'(.*)\'$/;static WRAPPED_EXPRESSION=/(\s|^)([\[{].*?[\]}])(\s|$)/g;static VAR_NAME_REGEXP=/^[a-zA-Z_$][0-9a-zA-Z_$]*$/;static useSubtreeCache=!1;static getID({ast:e,data:t,isSVG:i}={}){return xe({ast:e})}constructor({ast:e,data:t,template:i,subTemplates:n,snippets:a,helpers:r,isSVG:o}){this.ast=e||"",this.data=t,this.renderTrees={},this.treeIDs=[],this.template=i,this.subTemplates=n,this.resetHTML(),this.snippets=a||{},this.helpers=r||{},this.isSVG=o,this.id=s.getID({ast:e,data:t,isSVG:o})}resetHTML(){this.html=[],this.html.raw=[],this.expressions=[]}render({ast:e=this.ast,data:t=this.data}={}){this.resetHTML(),this.readAST({ast:e,data:t}),this.clearTemp();let i=this.isSVG?pi:Et;return this.litTemplate=i.apply(this,[this.html,...this.expressions]),this.litTemplate}cachedRender(e){return e&&this.updateData(e),this.litTemplate}readAST({ast:e=this.ast,data:t=this.data}={}){v(e,i=>{switch(i.type){case"html":this.addHTML(i.html);break;case"svg":this.addValue(this.evaluateSVG(i.content,t));break;case"expression":let n=this.evaluateExpression(i.value,t,{unsafeHTML:i.unsafeHTML,ifDefined:i.ifDefined,asDirective:!0});this.addValue(n);break;case"if":this.addValue(this.evaluateConditional(i,t));break;case"each":this.addValue(this.evaluateEach(i,t));break;case"template":this.addValue(this.evaluateTemplate(i,t));break;case"snippet":this.snippets[i.name]=i;break;case"slot":i.name?this.addHTML(`<slot name="${i.name}"></slot>`):this.addHTML("<slot></slot>");break}})}evaluateConditional(e,t){let i=(a,r)=>r=="branches"?a.map(o=>(o.condition&&(o.expression=o.condition),W(o,i))):r=="condition"?()=>this.evaluateExpression(a,t):r=="content"?()=>this.renderContent({ast:a,data:t}):a;e.expression=e.condition;let n=W(e,i);return Ci(n)}evaluateEach(e,t){let n=W(e,(a,r)=>r=="over"?o=>this.evaluateExpression(a,t):r=="content"?o=>(t={...this.data,...o},this.renderContent({ast:a,data:t})):r=="else"?o=>this.renderContent({ast:a.content,data:this.data}):a);return Ei(n,t)}evaluateTemplate(e,t={}){let i=this.lookupExpressionValue(e.name,t);return this.snippets[i]?this.evaluateSnippet(e,t):this.evaluateSubTemplate(e,t)}evaluateSVG(e,t){return this.renderContent({isSVG:!0,ast:e,data:t})}getPackedValue=(e,t,{reactive:i=!1}={})=>{let n=a=>this.evaluateExpression(a,t);return i?()=>n(e):()=>E.nonreactive(()=>n(e))};getPackedNodeData(e,t,{inheritParent:i=!1}={}){let n=(o,c={})=>{let p={};if(k(o)){let l=o;o=this.evaluateExpression(l,t,c),p=W(o,X)}else ne(o)&&(p=W(o,l=>this.getPackedValue(l,t,c)));return p},a=n(e.data),r=n(e.reactiveData,{reactive:!0});return t={...i?this.data:{},...a,...r},t}evaluateSnippet(e,t={}){let i=this.lookupExpressionValue(e.name,t),n=this.snippets[i];n||Ae(`Snippet "${i}" not found`);let a=this.getPackedNodeData(e,t,{inheritParent:!0});return this.renderContent({ast:n.content,data:a})}evaluateSubTemplate(e,t={}){let i=this.getPackedNodeData(e,t);return $i({subTemplates:this.subTemplates,templateName:e.name,getTemplate:()=>this.evaluateExpression(e.name,t),data:i,parentTemplate:this.template})}evaluateExpression(e,t=this.data,{asDirective:i=!1,ifDefined:n=!1,unsafeHTML:a=!1}={}){return typeof e=="string"?i?Ai({expression:e,value:()=>this.lookupExpressionValue(e,this.data)},{ifDefined:n,unsafeHTML:a}):this.lookupExpressionValue(e,t):e}getExpressionArray(e){let t=e.match(s.PARENS_REGEXP)||[],i=n=>{let a=[];for(;n.length>0;){let r=n.shift();if(r==="(")a.push(i(n));else{if(r===")")return a;a.push(r)}}return a};return i(t)}evaluateJavascript(e,t={},{includeHelpers:i=!0}={}){let n;i&&(t={...this.helpers,...t},t=Wt(t,(a,r)=>!["debugger"].includes(r)&&s.VAR_NAME_REGEXP.test(r)));try{let a=Object.keys(t),r=Object.values(t);v(r,(o,c)=>{o instanceof z&&Object.defineProperty(r,c,{get(){return o.peek()},configurable:!0,enumerable:!0}),L(o)&&o.length===0&&!o.name&&Object.defineProperty(r,c,{get(){return o()},configurable:!0,enumerable:!0})}),n=new Function(...a,`return ${e}`)(...r)}catch{}return n}lookupExpressionValue(e="",t={},i=new Set){if(i.has(e))return;if(i.add(e),!e.includes(" ")){let l=this.lookupTokenValue(e,t);if(l!==void 0)return X(l)()}let a=this.evaluateJavascript(e,t);if(a!==void 0){let l=this.accessTokenValue(a,e,t);return i.delete(e),X(l)()}k(e)&&(e=this.addParensToExpression(e));let r=C(e)?e:this.getExpressionArray(e),o=[],c,p=r.length;for(;p--;){let l=r[p];if(C(l))c=this.lookupExpressionValue(l.join(" "),t,i),o.unshift(c);else{let m=this.lookupTokenValue(l,t);c=L(m)?m(...o):m,o.unshift(c)}}return i.delete(e),c}lookupTokenValue(e="",t){if(C(e))return this.lookupExpressionValue(e,t);let i=this.getLiteralValue(e);if(i!==void 0)return i;let n=this.getDeepDataValue(t,e),a=this.accessTokenValue(n,e,t);if(a!==void 0)return a;let r=this.helpers[e];if(L(r))return r}getDeepDataValue(e,t){return t.split(".").reduce((i,n)=>{if(i===void 0)return;let a=i instanceof z?i.get():X(i)();if(a!=null)return a[n]},e)}accessTokenValue(e,t,i){let n=(a,r)=>{let o=a.split(".").slice(0,-1).join(".");return this.getDeepDataValue(r,o)};if(L(e)&&t.search(".")!==-1){let a=n(t,i);e=e.bind(a)}if(e!==void 0)return e instanceof z?e.value:e}addParensToExpression(e=""){return String(e).replace(s.WRAPPED_EXPRESSION,(t,i,n,a)=>`${i}(${n})${a}`)}getLiteralValue(e){if(e.length>1&&(e[0]==="'"||e[0]==='"')&&e[0]===e[e.length-1])return e.slice(1,-1).replace(/\\(['"])/g,"$1");let t={true:!0,false:!1};if(t[e]!==void 0)return t[e];if(!Number.isNaN(parseFloat(e)))return Number(e)}addHTML(e){this.lastHTML&&(e=`${this.html.pop()}${e}`),this.html.push(e),this.html.raw.push(String.raw({raw:e})),this.lastHTML=!0}addHTMLSpacer(){this.addHTML("")}addValue(e){this.addHTMLSpacer(),this.expressions.push(e),this.lastHTML=!1,this.addHTMLSpacer()}renderContent({ast:e,data:t,isSVG:i=this.isSVG}={}){let n=s.getID({ast:e,data:t,isSVG:i}),a=this.renderTrees[n],r=a?a.deref():void 0;if(s.useSubtreeCache&&r)return r.cachedRender(t);let o=new s({ast:e,data:t,isSVG:i,subTemplates:this.subTemplates,snippets:this.snippets,helpers:this.helpers,template:this.template});return this.treeIDs.push(n),this.renderTrees[n]=new WeakRef(o),o.render()}cleanup(){this.renderTrees=[]}setData(e){this.updateData(e),this.updateSubtreeData(e)}updateSubtreeData(e){v(this.renderTrees,(t,i)=>{let n=t.deref();n&&n.updateData(e)})}updateData(e){v(this.data,(t,i)=>{delete this.data[i]}),v(e,(t,i)=>{this.data[i]!==t&&(this.data[i]=t)})}clearTemp(){delete this.lastHTML}};var ie={exists(s){return!ht(s)},isEmpty(s){return ht(s)},stringify(s){return JSON.stringify(s)},hasAny(s){return s?.length>0},range(s,e,t=1){return Kt(s,e,t)},concat(...s){return s.join("")},both(s,e){return s&&e},either(s,e){return s||e},join(s=[],e=" ",t=!1){if(s.length==0)return;let i=s.join(e).trim();return t?`${i} `:i},classes(s,e=!0){return ie.join(s," ",!0)},joinComma(s=[],e,t){return Zt(s,{separator:", ",lastSeparator:" and ",oxford:e,quotes:t})},classIf(s,e="",t=""){let i=s?e:t;return i?`${i} `:""},classMap(s){let e=[];return v(s,(t,i)=>{t&&e.push(i)}),e.length?`${e.join(" ")} `:""},maybe(s,e,t){return s?e:t},activeIf(s){return ie.classIf(s,"active","")},selectedIf(s){return ie.classIf(s,"selected","")},capitalize(s=""){return qe(s)},titleCase(s=""){return Te(s)},disabledIf(s){return ie.classIf(s,"disabled","")},checkedIf(s){return ie.classIf(s,"checked","")},maybePlural(s,e="s"){return s==1?"":e},not(s){return!s},is(s,e){return s==e},notEqual(s,e){return s!==e},isExactly(s,e){return s===e},isNotExactly(s,e){return s!==e},greaterThan(s,e){return s>e},lessThan(s,e){return s<e},greaterThanEquals(s,e){return s>=e},lessThanEquals(s,e){return s<=e},numberFromIndex(s){return s+1},formatDate(s=new Date,e="L",t={timezone:"local"}){return Be(s,e,t)},formatDateTime(s=new Date,e="LLL",t={timezone:"local"}){return Be(s,e,t)},formatDateTimeSeconds(s=new Date,e="LTS",t={timezone:"local"}){return Be(s,e,t)},object({obj:s}){return s},log(...s){console.log(...s)},debugger(){debugger},tokenize(s=""){return Ve(s)},debugReactivity(){E.getSource()},arrayFromObject(s){return Fe(s)},escapeHTML(s){return Ft(s)},guard:E.guard,nonreactive:E.nonreactive};var De=class P{static templateCount=0;static isServer=J;constructor({templateName:e,ast:t,template:i,data:n,element:a,renderRoot:r,css:o,events:c,keys:p,defaultState:l,subTemplates:m,createComponent:u,parentTemplate:g,renderingEngine:h="lit",isPrototype:f=!1,attachStyles:b=!1,onCreated:d=N,onRendered:S=N,onUpdated:M=N,onDestroyed:x=N,onThemeChanged:U=N}={}){t||(t=new de(i).compile()),this.events=c,this.keys=p||{},this.ast=t,this.css=o,this.data=n||{},this.reactions=[],this.defaultState=l,this.state=this.createReactiveState(l,n)||{},this.templateName=e||this.getGenericTemplateName(),this.subTemplates=m,this.createComponent=u,this.onCreated=N,this.onDestroyed=N,this.onRendered=N,this.onRenderedCallback=S,this.onDestroyedCallback=x,this.onCreatedCallback=d,this.onThemeChangedCallback=U,this.id=Bt(),this.isPrototype=f,this.parentTemplate=g,this.attachStyles=b,this.element=a,this.renderingEngine=h,r&&this.attach(r)}createReactiveState(e,t){let i={},n=(a,r)=>{let o=H(t,r);return o||a?.value||a};return v(e,(a,r)=>{let o=n(a,r);a?.options?i[r]=new z(o,a.options):i[r]=new z(o)}),i}setDataContext(e,{rerender:t=!0}={}){this.data=e,t&&(this.rendered=!1)}setParent(e){e._childTemplates||(e._childTemplates=[]),e._childTemplates.push(this),this._parentTemplate=e}setElement(e){this.element=e}getGenericTemplateName(){return P.templateCount++,`Anonymous #${P.templateCount}`}initialize(){let e=this,t;this.instance={},L(this.createComponent)&&(t=this.call(this.createComponent)||{},jt(e.instance,t)),L(e.instance.initialize)&&this.call(e.instance.initialize.bind(e)),e.instance.templateName=this.templateName,this.onCreated=()=>{this.call(this.onCreatedCallback),P.addTemplate(this),this.dispatchEvent("created",{component:this.instance},{},{triggerCallback:!1})},this.onRendered=()=>{this.call(this.onRenderedCallback),this.dispatchEvent("rendered",{component:this.instance},{},{triggerCallback:!1})},this.onUpdated=()=>{this.dispatchEvent("updated",{component:this.instance},{},{triggerCallback:!1})},this.onThemeChanged=(...i)=>{this.call(this.onThemeChangedCallback,...i)},this.onDestroyed=()=>{P.removeTemplate(this),this.rendered=!1,this.clearReactions(),this.removeEvents(),this.call(this.onDestroyedCallback),this.dispatchEvent("destroyed",{component:this.instance},{},{triggerCallback:!1})},this.initialized=!0,this.renderingEngine=="lit"?this.renderer=new Ie({ast:this.ast,data:this.getDataContext(),template:this,subTemplates:this.subTemplates,helpers:ie}):Ae("Unknown renderer specified",this.renderingEngine),this.onCreated()}async attach(e,{parentNode:t=e,startNode:i,endNode:n}={}){this.initialized||this.initialize(),this.renderRoot!=e&&(this.renderRoot=e,this.parentNode=t,this.startNode=i,this.endNode=n,this.attachEvents(),this.bindKeys(),this.attachStyles&&await this.adoptStylesheet())}getDataContext(){return{...this.data,...this.state,...this.instance}}async adoptStylesheet(){if(!this.css||!this.renderRoot||!this.renderRoot.adoptedStyleSheets)return;let e=this.css;this.stylesheet||(this.stylesheet=new CSSStyleSheet,await this.stylesheet.replace(e)),Array.from(this.renderRoot.adoptedStyleSheets).some(n=>V(n.cssRules,this.stylesheet.cssRules))||(this.renderRoot.adoptedStyleSheets=[...this.renderRoot.adoptedStyleSheets,this.stylesheet])}clone(e){let i={...{templateName:this.templateName,element:this.element,ast:this.ast,css:this.css,defaultState:this.defaultState,events:this.events,keys:this.keys,renderingEngine:this.renderingEngine,subTemplates:this.subTemplates,onCreated:this.onCreatedCallback,onThemeChanged:this.onThemeChangedCallback,onRendered:this.onRenderedCallback,parentTemplate:this.parentTemplate,onDestroyed:this.onDestroyedCallback,createComponent:this.createComponent},...e};return new P(i)}parseEventString(e){let t="delegated";v(["deep","global"],m=>{e.startsWith(m)&&(e=e.replace(m,""),t=m)}),e=e.trim();let n=m=>{let u={blur:"focusout",focus:"focusin",load:"DOMContentLoaded",unload:"beforeunload",mouseenter:"mouseover",mouseleave:"mouseout"};return u[m]&&(m=u[m]),m},a=[],r=e.split(/\s+/),o=!1,c=!1,p=[],l=[];return v(r,(m,u)=>{let g=m.replace(/(\,|\W)+$/,"").trim(),h=m.includes(",");if(!o)p.push(n(g)),o=!h;else if(!c){let f=r.slice(u).join(" ").split(",");v(f,b=>{l.push(b.trim())}),c=!0}}),v(p,m=>{l.length||l.push(""),v(l,u=>{a.push({eventName:m,eventType:t,selector:u})})}),a}attachEvents(e=this.events){(!this.parentNode||!this.renderRoot)&&Ae("You must set a parent before attaching events"),this.removeEvents(),this.eventController=new AbortController,!P.isServer&&this.onThemeChangedCallback!==N&&I("html").on("themechange",t=>{this.onThemeChanged({additionalData:{event:t,...t.detail}})},{abortController:this.eventController}),v(e,(t,i)=>{let n=this.parseEventString(i),a=this;v(n,r=>{let{eventName:o,selector:c,eventType:p}=r;c&&I(c,{root:this.renderRoot}).on(o,N,{abortController:this.eventController});let l=function(u){if(p!=="global"&&!a.isNodeInTemplate(u.target))return;let g=c&&I(u.target).closest(c).length==0;if(p!=="deep"&&g||w(o,["mouseover","mouseout"])&&u.relatedTarget&&u.target.contains(u.relatedTarget))return;let h=this,f=t.bind(h),b=u?.detail||{},d=h?.dataset,S=h?.value||u.target?.value||u?.detail?.value;a.call(f,{additionalData:{event:u,isDeep:g,target:h,value:S,data:{...d,...b}}})},m={abortController:this.eventController};p=="global"?I(c).on(o,l,m):I(this.renderRoot).on(o,c,l,m)})})}removeEvents(){this.eventController&&this.eventController.abort("Template destroyed")}bindKeys(e=this.keys){if(J||Object.keys(e).length==0)return;let t=500,i={abortController:this.eventController};this.currentSequence="",I(document).on("keydown",n=>{let a=Jt(n),r=a==this.currentKey;this.currentKey=a,this.currentSequence+=a,v(this.keys,(o,c)=>{c=c.replace(/\s*\+\s*/g,"+");let p=c.split(",");if(Xt(p,l=>this.currentSequence.endsWith(l))){let l=document.activeElement instanceof HTMLElement&&(["input","select","textarea"].includes(document.activeElement.tagName.toLowerCase())||document.activeElement.isContentEditable);this.call(o,{additionalData:{event:n,inputFocused:l,repeatedKey:r}})!==!0&&n.preventDefault()}}),this.currentSequence+=" ",clearTimeout(this.resetSequence),this.resetSequence=setTimeout(()=>{this.currentSequence=""},t)},i).on("keyup",n=>{this.currentKey=""},i)}bindKey(e,t){if(!e||!t)return;let i=Object.keys(this.keys).length==0;this.keys[e]=t,i&&this.bindKeys()}unbindKey(e){delete this.keys[e]}isNodeInTemplate(e){return((n,a=this.startNode,r=this.endNode)=>{if(!a||!r)return!0;if(n===null)return!1;let o=a.compareDocumentPosition(n),c=r.compareDocumentPosition(n),p=(o&Node.DOCUMENT_POSITION_FOLLOWING)!==0,l=(c&Node.DOCUMENT_POSITION_PRECEDING)!==0;return p&&l})((n=>{for(;n&&n.parentNode!==this.parentNode;)n.parentNode===null&&n.host?n=n.host:n=n.parentNode;return n})(e))}render(e={}){this.initialized||this.initialize();let t={...this.getDataContext(),...e};return this.setDataContext(t,{rerender:!1}),this.renderer.setData(t),this.rendered||(this.html=this.renderer.render(),setTimeout(this.onRendered,0)),this.rendered=!0,setTimeout(this.onUpdated,0),this.html}$(e,{root:t=this.renderRoot,filterTemplate:i=!0,...n}={}){if(!P.isServer&&w(e,["body","document","html"])&&(t=document),t||(t=globalThis),t==this.renderRoot){let a=I(e,{root:t,...n});return i?a.filter(r=>this.isNodeInTemplate(r)):a}else return I(e,{root:t,...n})}$$(e,t){return this.$(e,{root:this.renderRoot,pierceShadow:!0,filterTemplate:!0,...t})}call(e,{params:t,additionalData:i={},firstArg:n,additionalArgs:a}={}){let r=[];if(!this.isPrototype){if(!t){let o=this.element;t={el:this.element,tpl:this.instance,self:this.instance,component:this.instance,$:this.$.bind(this),$$:this.$$.bind(this),reaction:this.reaction.bind(this),signal:this.signal.bind(this),afterFlush:E.afterFlush,nonreactive:E.nonreactive,flush:E.flush,data:this.data,settings:this.element?.settings,state:this.state,isRendered:()=>this.rendered,isServer:P.isServer,isClient:!P.isServer,dispatchEvent:this.dispatchEvent.bind(this),attachEvent:this.attachEvent.bind(this),bindKey:this.bindKey.bind(this),unbindKey:this.unbindKey.bind(this),abortController:this.eventController,helpers:ie,template:this,templateName:this.templateName,templates:P.renderedTemplates,findTemplate:this.findTemplate,findParent:this.findParent.bind(this),findChild:this.findChild.bind(this),findChildren:this.findChildren.bind(this),content:this.instance.content,get darkMode(){return o.isDarkMode()},...i},r.push(t)}if(a&&r.push(...a),L(e))return e.apply(this.element,r)}}attachEvent(e,t,i,{eventSettings:n={},querySettings:a={pierceShadow:!0}}={}){return I(e,document,a).on(t,i,{abortController:this.eventController,returnHandler:!0,...n})}dispatchEvent(e,t,i,{triggerCallback:n=!0}={}){if(!P.isServer){if(n){let a=`on${qe(e)}`,r=this.element[a];X(r).call(this.element,t)}return I(this.element).dispatchEvent(e,t,i)}}reaction(e){this.reactions.push(E.create(e))}signal(e,t){return new z(e,t)}clearReactions(){v(this.reactions||[],e=>e.stop())}findTemplate=e=>P.findTemplate(e);findParent=e=>P.findParentTemplate(this,e);findChild=e=>P.findChildTemplate(this,e);findChildren=e=>P.findChildTemplates(this,e);static renderedTemplates=new Map;static addTemplate(e){if(e.isPrototype)return;let t=P.renderedTemplates.get(e.templateName)||[];t.push(e),P.renderedTemplates.set(e.templateName,t)}static removeTemplate(e){if(e.isPrototype)return;let t=P.renderedTemplates.get(e.templateName)||[];Gt(t,i=>i.id==e.id),P.renderedTemplates.set(t)}static getTemplates(e){return P.renderedTemplates.get(e)||[]}static findTemplate(e){return P.getTemplates(e)[0]}static findParentTemplate(e,t){let i,n=a=>!(i||!a?.templateName||t&&a?.templateName!==t);if(!i){let a=e.element?.parentNode;for(;a;){if(n(a.component)){i={...a.component,...a.dataContext};break}a=a.parentNode}}for(;e;)if(e=e._parentTemplate,n(e)){i={...e.instance,...e.data};break}return i}static findChildTemplates(e,t){let i=[];function n(a,r){(!r||a.templateName===r)&&i.push({...a.instance,...a.data}),a._childTemplates&&a._childTemplates.forEach(o=>{n(o,r)})}return n(e,t),i}static findChildTemplate(e,t){return P.findChildTemplates(e,t)[0]}};var Ji=/\s+/mg,Li=["disabled","value"],Zi=s=>k(s)?s.split("-").reverse().join("-"):s,Qi=s=>k(s)?s.replaceAll(Ji,"-"):s,Oe=({el:s,attribute:e,attributeValue:t,properties:i,componentSpec:n,oldValue:a})=>{let r=({attribute:l,optionValue:m,optionAttributeValue:u})=>{m=Qi(m);let g=[m];l&&m&&(g.push(`${l}-${t}`),g.push(`${t}-${l}`)),g.push(Zi(m)),g=se(g);let h=Yt(g,b=>H(n.optionAttributes,b));return h?w(t?.constructor,[Object,Array,Function])?{matchingAttribute:void 0,matchingValue:void 0}:{matchingAttribute:H(n.optionAttributes,h),matchingValue:h}:{matchingAttribute:void 0,matchingValue:void 0}},o=(l,m)=>{let u=Y(l);m!==void 0&&(s[u]=m),w(l,Li)&&s.requestUpdate()},c=l=>{let m=Y(l);s[m]=null,w(l,Li)&&s.requestUpdate()},p=(l,m)=>{let u=n.propertyTypes[l]==Boolean,g=n.optionAttributes[l]==l,h=w(l,n.attributeClasses);return(u||h||g)&&w(m,["",!0,l])};if(n){if(e=="class"&&t){let l=k(a)?a.split(" "):[],m=t.split(" "),u=vt(l,m),g=vt(m,l);v(u,h=>{Oe({el:s,attribute:h,attributeValue:null,componentSpec:n})}),v(g,h=>{Oe({el:s,attribute:h,attributeValue:!0,componentSpec:n})})}else if(w(e,n.attributes)){if(p(e,t)){t=!0,o(e,t);return}if(t===null){c(e);return}let{matchingValue:l}=r({attribute:e,optionValue:t});l&&o(e,l)}else if(t!==void 0){let{matchingAttribute:l,matchingValue:m}=r({optionValue:e,optionAttributeValue:t});if(l&&t===null){s[l]==e&&c(l);return}l&&m&&o(l,m)}}else if(i&&t!==void 0&&e.includes("-")){let l=Y(e),m=i[e];if(l!==e&&m?.alias){let u=m?.converter?.fromAttribute,g=u?u(t):t;g&&o(l,g);return}}};var ye=class s extends te{static shadowRootOptions={...te.shadowRootOptions,delegatesFocus:!1};static scopedStyleSheet=null;constructor(){super(),this.renderCallbacks=[]}updated(){super.updated(),v(this.renderCallbacks,e=>e())}addRenderCallback(e){this.renderCallbacks.push(e)}static getProperties({properties:e={},defaultSettings:t,componentSpec:i}){return qt(e).length||(i&&(e.class={type:String,noAccessor:!0,alias:!0},v(i.attributes,n=>{let a=i.propertyTypes[n],r=Y(n);e[r]=s.getPropertySettings(n,a)}),v(i.properties,n=>{let a=i.propertyTypes[n],r=Y(n);e[r]=s.getPropertySettings(n,a)}),v(i.optionAttributes,(n,a)=>{let r=Y(a);e[r]={type:String,noAccessor:!0,alias:!0,attribute:a}})),t&&v(t,(n,a)=>{let r={propertyOnly:He(n)};e[a]=n?.type?t:s.getPropertySettings(a,n?.constructor,r)}),v(e,(n,a)=>{let r=ce(a);r!==a&&!e[r]&&e[a]&&(e[r]={...e[a],noAccessor:!0,alias:!0})})),e}static getPropertySettings(e,t=String,{propertyOnly:i=!1}={}){let n={type:t,attribute:!0,hasChanged:(a,r)=>!V(a,r)};return i||t==Function?(n.attribute=!1,n.hasChanged=(a,r)=>!0):t==Boolean&&(n.converter={fromAttribute:(a,r)=>w(a,["false","0","null","undefined"])?!1:w(a,["",!0,"true"])?!0:!!a,toAttribute:(a,r)=>String(a)}),n}setDefaultSettings({defaultSettings:e={},componentSpec:t}){this.defaultSettings=e,v(e,(i,n)=>{i?.default!==void 0?this.defaultSettings[n]=i.default:this.defaultSettings[n]=i}),t?.defaultValues&&(this.defaultSettings={...t.defaultValues,...this.defaultSettings})}getSettingsFromConfig({componentSpec:e,properties:t}){let i={};return v(t,(n,a)=>{if(n.alias===!0)return;let r=this[a],o=r??this.defaultSettings[a]??(e?.defaultSettings||{})[a];o!==void 0&&(i[a]=o),e&&i[r]!==void 0&&(i[a]=!0)}),i}createSettingsProxy({componentSpec:e,properties:t}){let i=this;return i.settingsVars=new Map,new Proxy({},{get:(n,a)=>{let r=i.getSettings({componentSpec:e,properties:t}),o=H(r,a),c=i.settingsVars.get(a);return c?c.get():(c=new z(o),i.settingsVars.set(a,c)),o},set:(n,a,r,o)=>{i.setSetting(a,r);let c=i.settingsVars.get(a);return c?c.set(r):(c=new z(r),i.settingsVars.set(a,c)),!0}})}getUIClasses({componentSpec:e,properties:t}){if(!e)return;let i=[];v(e.attributes,a=>{let r=Y(a),o=this[r];if(o){let c=e.allowedValues[a];e.propertyTypes[a]==Boolean||o==a&&c&&w(o,c)?i.push(a):c&&w(o,c)&&i.push(o),e.attributeClasses.includes(a)&&i.push(a)}});let n=se(i).join(" ");return n&&(n+=" "),n}isDarkMode(){return J?void 0:I(this).cssVar("dark-mode")=="true"}$(e,{root:t=this?.renderRoot||this.shadowRoot}={}){return t||console.error("Cannot query DOM until element has rendered."),I(e,{root:t})}$$(e){return I(e,{root:this.originalDOM.content})}call(e,{firstArg:t,additionalArgs:i,args:n=[this.component,this.$.bind(this)]}={}){if(t&&n.unshift(t),i&&n.push(...i),L(e))return e.apply(this,n)}};var Lt=({template:s="",ast:e,css:t="",pageCSS:i="",tagName:n,delegatesFocus:a=!1,templateName:r=Y(n),createComponent:o=N,events:c={},keys:p={},onCreated:l=N,onRendered:m=N,onDestroyed:u=N,onThemeChanged:g=N,onAttributeChanged:h=N,defaultSettings:f={},defaultState:b={},subTemplates:d={},renderingEngine:S,properties:M,componentSpec:x=!1,plural:U=!1,singularTag:B}={})=>{e||(e=new de(s).compile()),v(d,q=>{q.css&&(t+=q.css)}),i&&bt(i);let _=new De({templateName:r,isPrototype:!0,renderingEngine:S,ast:e,css:t,events:c,keys:p,defaultState:b,subTemplates:d,onCreated:l,onRendered:m,onDestroyed:u,onThemeChanged:g,createComponent:o}),A;if(n){if(A=class extends ye{static get styles(){return Ge(t)}static template=_;static properties=ye.getProperties({properties:M,componentSpec:x,defaultSettings:f});defaultSettings={};constructor(){super(),this.css=t,this.componentSpec=x,this.settings=this.createSettingsProxy({componentSpec:x,properties:A.properties}),this.setDefaultSettings({defaultSettings:f,componentSpec:x})}connectedCallback(){super.connectedCallback()}triggerAttributeChange(){v(A.properties,(K,O)=>{let oe=ce(O),Vt=this[O];!K.alias&&oe&&Vt===!0&&this.setAttribute(oe,""),Oe({el:this,attribute:oe,properties:A.properties,attributeValue:Vt,componentSpec:x})})}willUpdate(){J&&this.triggerAttributeChange(),this.template||(this.template=_.clone({data:this.getData(),element:this,renderRoot:this.renderRoot}),this.template.initialized||this.template.initialize(),this.component=this.template.instance,this.dataContext=this.template.data),super.willUpdate()}firstUpdated(){super.firstUpdated()}updated(){super.updated()}disconnectedCallback(){super.disconnectedCallback(),this.template&&this.template.onDestroyed(),_.onDestroyed()}adoptedCallback(){super.adoptedCallback(),this.call(onMoved)}attributeChangedCallback(K,O,oe){super.attributeChangedCallback(K,O,oe),Oe({el:this,attribute:K,attributeValue:oe,properties:A.properties,oldValue:O,componentSpec:x}),this.call(h,{args:[K,O,oe]})}getSettings(){return this.getSettingsFromConfig({componentSpec:x,properties:A.properties})}setSetting(K,O){this[K]=O}getData(){let O={...this.getSettings()};return J||(O.darkMode=this.isDarkMode()),x&&(O.ui=this.getUIClasses({componentSpec:x,properties:A.properties})),U===!0&&(O.plural=!0),O}render(){let K={...this.getData(),...this.tpl};return this.template.render(K)}},Ce&&customElements.get(n))return A;customElements.define(n,A)}return n?A:_};var T=class s{static DEFAULT_DIALECT="standard";static DIALECT_TYPES={standard:"standard",classic:"classic",verbose:"verbose"};constructor(e,{plural:t=!1,dialect:i=s.DEFAULT_DIALECT}={}){this.spec=e||{},this.plural=t,this.dialect=i,this.componentSpec=null}getComponentName({plural:e=this.plural,lang:t="html"}={}){let i=this.spec;return e?i.pluralExportName:i.exportName}getTagName({plural:e=this.plural,lang:t="html"}={}){let i=this.spec;return e?i.pluralTagName:i.tagName}getDefinition({plural:e=this.plural,minUsageLevel:t,dialect:i=this.dialect}={}){let n={content:[],types:[],states:[],variations:[],settings:[]},a=l=>t?usageLevel>(l.usageLevel||1):!0,r=this.spec,o=e?r?.examples?.defaultPluralContent:r?.examples?.defaultContent,c=dt(r?.examples?.defaultAttributes||{}).join(" ");n.types.push({title:r.name,description:"",examples:[{showCode:!1,code:this.getCodeFromModifiers(c,{html:o}),components:[this.getComponentParts(c,{html:o})]}]});let p=this.getOrderedParts();return v(p,l=>{v(r[l],m=>{if(!a(m))return;let u=this.getCodeExamples(m,{defaultAttributes:r?.examples?.defaultAttributes,defaultContent:o});n[l].push(u)})}),n}getOrderedParts(){return["types","content","states","variations","settings"]}getOrderedExamples({plural:e=!1,minUsageLevel:t,dialect:i=this.dialect}={}){let n=this.getDefinition({plural:e,minUsageLevel:t,dialect:i});return this.getOrderedParts().map(a=>({title:Te(a),examples:n[a]}))}getDefinitionMenu({IDSuffix:e="-example",plural:t=!1,minUsageLevel:i}={}){return this.getOrderedExamples({plural:t,minUsageLevel:i}).map(r=>({title:r.title,items:r.examples.map(o=>({id:Ve(`${o.title}${e}`),title:o.title}))}))}getComponentPartsFromHTML(e,{dialect:t}={}){e=e.trim();let i=e.indexOf(" "),n=e.indexOf(">"),a=e.slice(1,i!==-1?i:n);if(a=="div")return{html:e};let r=i!==-1?e.slice(i,n).trim():"",o={};if(r){let l=r.split(" ");for(let m of l){let[u,g]=m.split("=");g?o[u]=g.replace(/"/g,""):o[u]=!0}}let c=this.getAttributeStringFromModifiers(e,{attributes:o,dialect:t}),p=e.slice(n+1,e.lastIndexOf("<")).trim();return{componentName:a,attributes:o,attributeString:c,html:p}}getCodeExamples(e,{defaultAttributes:t,defaultContent:i}={}){let n=[],a=this.getAttributeName(e);if(t){let r=j(t);delete r[a],t=dt(r).join(" ")}if(e.options){let r=[];v(e.options,(o,c)=>{let p,l;if(o.exampleCode)p=o.exampleCode,l=this.getComponentPartsFromHTML(p);else{let u;k(o.value)?u=o.value:k(o)&&(u=o),C(o.value)&&(u=o.value.filter(g=>k(g))[0]),t&&(u=`${u} ${t}`),p=this.getCodeFromModifiers(u,{html:i}),l=this.getComponentParts(u,{html:i})}let m={code:p,components:[l]};e.separateExamples?n.push(m):r.push(m)}),e.separateExamples||n.push({code:r.map(o=>o.code).join(`
`),components:Ue([...r.map(o=>o.components)])})}else{let r,o,c=this.getAttributeName(e);t&&(c=`${c} ${t}`),e.exampleCode?(r=e.exampleCode,o=this.getComponentPartsFromHTML(r)):(r=this.getCodeFromModifiers(c,{html:i}),o=this.getComponentParts(c,{html:i}));let p={code:r,components:[o]};n.push(p)}return{title:e.name,description:e.description,examples:n}}getComponentParts(e,{lang:t="html",plural:i=this.plural,text:n,html:a,dialect:r=this.dialect}={}){let o=t=="html"?this.getTagName({plural:i}):this.getComponentName({plural:i,lang:t});if(!n&&!a){let l=e||String(o).replace(/^ui-/,"");n=String(l).replace(/\-/mg," "),a=Te(n)}let c=this.getAttributesFromModifiers(e);return{componentName:o,attributes:c,attributeString:this.getAttributeStringFromModifiers(e,{attributes:c,dialect:r}),html:a}}getCodeFromModifiers(e,t){let{componentName:i,attributeString:n,html:a}=this.getComponentParts(e,t);return`<${i}${n}>${a}</${i}>`}getAttributesFromModifiers(e=""){let t=this.getWebComponentSpec(),i={},n=String(e).split(" ");return v(n,a=>{let r=t.optionAttributes[a];r?i[r]=a:i[a]=!0}),i}getSingleAttributeString(e,t,{joinWith:i="=",quoteCharacter:n=":"}={}){return t==!0||t==e?`${e}`:`${e}${i}${n}${t}${n}`}getAttributeString(e,{dialect:t=this.dialect,joinWith:i="=",quoteCharacter:n="'"}={}){let a,r=[],o=j(e),c=this.getWebComponentSpec();if(v(e,(p,l)=>{c.optionAttributes[p]?r.push(p):o[l]=p}),r.length){let p=modifierAttributes.join(" ");if(t==s.DIALECT_TYPES.standard)a+=` ${p}`;else if(t==s.DIALECT_TYPES.classic)return` class="${p}"`}else if(t==s.DIALECT_TYPES.verbose||keys(o)){let p=" ";v(e,(l,m)=>{let u=this.getSingleAttributeString(m,l,{joinWith:i,quoteCharacter:n});p+=` ${u}`})}return a}getAttributeStringFromModifiers(e,{dialect:t=this.dialect,attributes:i,joinWith:n="=",quoteCharacter:a='"'}={}){if(!e)return"";if(t==s.DIALECT_TYPES.standard)return` ${e}`;if(t==s.DIALECT_TYPES.classic)return` class="${e}"`;if(t==s.DIALECT_TYPES.verbose){i||(i=this.getAttributesFromModifiers(e));let r=" ";return v(i,(o,c)=>{let p=this.getSingleAttributeString(c,o,{joinWith:n,quoteCharacter:a});r+=` ${p}`}),` ${r.trim()}`}}getWebComponentSpec(e=this.spec,{plural:t=this.plural}={}){if(e==this.spec&&this.componentSpec)return this.componentSpec;let i={tagName:e.tagName,content:[],contentAttributes:[],types:[],variations:[],states:[],events:[],settings:[],properties:[],attributes:[],optionAttributes:{},propertyTypes:{},allowedValues:{},attributeClasses:[],defaultValues:{},inheritedPluralVariations:[]},n=o=>{let c=e[o]||[];if(t){let l=H({types:"pluralSharedTypes",variations:"pluralSharedVariations",states:"pluralSharedStates",content:"pluralSharedContent",settings:"pluralSharedSettings",events:"pluralSharedEvents"},o),m=H(e,l)||[];l&&(c=c.filter(u=>{let g=this.getPropertyName(u);return w(g,m)})),o=o.replace("pluralOnly","").toLowerCase()}v(c,p=>{let l=this.getPropertyName(p);if(!l)return;i[o]&&i[o].push(l);let m=this.getAllowedValues(p);m&&(i.allowedValues[l]=m);let u=this.getPropertyType(p,o,m);u&&(i.propertyTypes[l]=u);let g=this.getAttributeName(p,u);g?i.attributes.push(g):i.properties.push(l);let h=this.getDefaultValue(p,u,o);h!==void 0&&(i.defaultValues[l]=h),o==="content"&&(p.attribute?i.contentAttributes.push(p.attribute):p.slot&&i.slots.push(p.slot)),g&&p.includeAttributeClass&&i.attributeClasses.push(l)})};v(["content","types","states","variations","settings","events"],n),t&&v(["pluralOnlyContent","pluralOnlyTypes","pluralOnlyStates","pluralOnlySettings","pluralOnlyVariations","pluralOnlyEvents"],n);let r=W(i.allowedValues,(o,c)=>o=o.filter(p=>k(p)));return i.optionAttributes=gt(r),i.inheritedPluralVariations=e.pluralSharedVariations||[],this.componentSpec=i,i}getPluralWebComponentSpec(e=this.spec){if(e==this.spec&&this.componentSpec)return this.componentSpec;let t={tagName:e.tagName,content:[],contentAttributes:[],types:[],variations:[],states:[],events:[],settings:[],properties:[],attributes:[],optionAttributes:{},propertyTypes:{},allowedValues:{},attributeClasses:[],defaultValues:{},inheritedPluralVariations:[]},i=a=>{let r=e[a]||[];v(r,o=>{let c=this.getPropertyName(o);if(!c)return;t[a].push(c);let p=this.getAllowedValues(o);p&&(t.allowedValues[c]=p);let l=this.getPropertyType(o,a,p);l&&(t.propertyTypes[c]=l);let m=this.getAttributeName(o,l);m?t.attributes.push(m):t.properties.push(c);let u=this.getDefaultValue(o,l,a);u!==void 0&&(t.defaultValues[c]=u),a==="content"&&(o.attribute?t.contentAttributes.push(o.attribute):o.slot&&t.slots.push(o.slot)),m&&o.includeAttributeClass&&t.attributeClasses.push(c)})};i("content"),i("types"),i("states"),i("variations"),i("pluralVariations"),i("settings"),i("events");let n=W(t.allowedValues,(a,r)=>a=a.filter(o=>k(o)));return t.optionAttributes=gt(n),t.inheritedPluralVariations=e.pluralSharedVariations||[],this.componentSpec=t,t}getAttributeName(e,t){if(this.canUseAttribute(t))return this.getPropertyName(e)}getPropertyName(e){if(e.attribute)return e.attribute;if(k(e.name))return e.name.toLowerCase()}getPropertyType(e,t,i=[]){let n={string:String,boolean:Boolean,object:Object,array:Array,function:Function},a,r;return t=="events"?a=Function:w(t,["types","states","variations"])?a=Boolean:w(t,["content"])&&(a=String),e.type&&n[e.type]?r=e.type:i.length&&(r=typeof i[0]),r&&(a=H(n,r)),a}getAllowedValues(e){let t;return e.options&&(t=e.options.map(i=>i?.value!==void 0?i.value:i).filter(Boolean),t=se(Ue(t))),t}getDefaultValue(e,t,i){return e.defaultValue!==void 0?e.defaultValue:i!=="settings"?void 0:H({string:"",array:[],boolean:!1,function:N,number:0,object:{}},t)}canUseAttribute(e){return e!=Function}};var Nt={uiType:"element",name:"Container",description:"A container limits content to a maximum width",tagName:"ui-container",exportName:"UIContainer",content:[],types:[],variations:[],events:[],settings:[]};var tn=new T,nn=tn.getWebComponentSpec(Nt);var Pt={uiType:"element",name:"Rail",description:"A rail is used to show accompanying content next to the main view of a site",tagName:"ui-rail",exportName:"UIRail",content:[],types:[],variations:[],events:[],settings:[]};var an=new T,rn=an.getWebComponentSpec(Pt);var mt={uiType:"element",name:"Button",description:"A button indicates a possible user action",tagName:"ui-button",exportName:"UIButton",examples:{defaultPluralContent:`
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
</div>`},{name:"Floated",attribute:"floated",usageLevel:1,description:"align to the left or right of its container",options:[{name:"Left Floated",value:["left-floated"],description:"appear to the left of content"},{name:"Right Floated",value:"right-floated",description:"appear to the right of content"}]},{name:"Fluid",attribute:"fluid",usageLevel:1,description:"take the width of its container"},{name:"Size",attribute:"size",usageLevel:1,description:"vary in size",options:[{name:"Mini",value:"mini",description:"appear extremely small"},{name:"Tiny",value:"tiny",description:"appear very small"},{name:"Small",value:"small",description:"appear small"},{name:"Medium",value:"medium",description:"appear normal sized"},{name:"Large",value:"large",description:"appear larger than normal"},{name:"Big",value:"big",description:"appear much larger than normal"},{name:"Huge",value:"huge",description:"appear very much larger than normal"},{name:"Massive",value:"massive",description:"appear extremely larger than normal"}]},{name:"Inverted",description:"be formatted to appear on dark backgrounds",usageLevel:2,attribute:"inverted"}],settings:[{name:"Icon Only",type:"boolean",attribute:"icon-only",defaultValue:!1,description:"Enable to remove spacing for text"},{name:"Icon After",type:"boolean",attribute:"icon-after",defaultValue:!1,description:"Enable to position the icon after the text"},{name:"Link",type:"string",attribute:"href",description:"link to a webpage"}],supportsPlural:!0,pluralName:"Buttons",pluralTagName:"ui-buttons",pluralExportName:"UIButtons",pluralDescription:"Buttons can exist together as a group",pluralContent:[{name:"Or",attribute:"or",slot:"or",description:"A button group can be formatted to show a conditional choice"}],pluralSharedTypes:[],pluralOnlyTypes:[{name:"vertical",attribute:"vertical",description:"A button group can be formatted to show buttons in a vertical stack",usageLevel:3}],pluralOnlyVariations:[{name:"Separate",attribute:"separate",description:"A button group can appear with their buttons separated"},{name:"Equal Width",attribute:"equal-width",description:"A button group can be formatted to have the same width for each button",usageLevel:3,options:[{name:"Two",value:"two",description:"A button group can have two items evenly split"},{name:"Three",value:"three",description:"A button group can have three items evenly split"},{name:"Four",value:"four",description:"A button group can have four items evenly split"},{name:"Five",value:"five",description:"A button group can have five items evenly split"},{name:"Six",value:"six",description:"A button group can have six items evenly split"}]}],pluralSharedVariations:["inverted","size","floated","compact","color","attached"]};var cn=new T(mt).getWebComponentSpec(),ln=new T(mt,{plural:!0}).getWebComponentSpec();var Mt={uiType:"element",name:"Icon",description:"An icon is a glyph used to represent something else",tagName:"ui-icon",exportName:"UIIcon",content:[{name:"Icon",attribute:"icon",description:"An icon can specify what icon should appear",usageLevel:1,options:["airplay","alert-circle","alert-octagon","alert-triangle","align-center","align-justify","align-left","align-right","anchor","aperture","archive","arrow-down","arrow-down-circle","arrow-down-left","arrow-down-right","arrow-left","arrow-left-circle","arrow-right","arrow-right-circle","arrow-up","arrow-up-circle","arrow-up-left","arrow-up-right","at-sign","award","bar-chart","bar-chart-2","battery","battery-charging","bell","bell-off","bluetooth","bold","book","book-open","bookmark","box","briefcase","calendar","camera","camera-off","cast","check","check-circle","check-square","chevron-down","chevron-left","chevron-right","chevron-up","chevrons-down","chevrons-left","chevrons-right","chevrons-up","chrome","circle","clipboard","clock","cloud","cloud-drizzle","cloud-lightning","cloud-off","cloud-rain","cloud-snow","code","codepen","codesandbox","coffee","columns","command","compass","copy","corner-down-left","corner-down-right","corner-left-down","corner-left-up","corner-right-down","corner-right-up","corner-up-left","corner-up-right","cpu","credit-card","crop","crosshair","currentColor","database","delete","disc","divide","divide-circle","divide-square","dollar-sign","download","download-cloud","dribbble","droplet","edit","edit-2","edit-3","external-link","eye","eye-off","facebook","fast-forward","feather","figma","file","file-minus","file-plus","file-text","film","filter","flag","folder","folder-minus","folder-plus","framer","frown","github","gitlab","globe","grid","hard-drive","hash","headphones","heart","help-circle","hexagon","home","image","inbox","info","instagram","italic","key","layers","layout","life-buoy","linkify","linkify-2","linkedin","list","loader","lock","log-in","log-out","mail","map","map-pin","maximize","maximize-2","meh","menu","message-circle","message-square","mic","mic-off","minimize","minimize-2","minus","minus-circle","minus-square","monitor","moon","more-horizontal","more-vertical","mouse-pointer","move","music","navigation","navigation-2","octagon","package","paperclip","pause","pause-circle","pen-tool","percent","phone","phone-call","phone-forwarded","phone-incoming","phone-missed","phone-off","phone-outgoing","pie-chart","play","play-circle","plus","plus-circle","plus-square","pocket","power","printer","radio","refresh-ccw","refresh-cw","repeat","rewind","rotate-ccw","rotate-cw","rss","save","scissors","search","send","server","settings","share","share-2","shield","shield-off","shopping-bag","shopping-cart","shuffle","sidebar","skip-back","skip-forward","slack","slash","sliders","smartphone","smile","speaker","square","star","stop-circle","sun","sunrise","sunset","table","tablet","tag","target","terminal","thermometer","thumbs-down","thumbs-up","toggle-left","toggle-right","tool","trash","trash-2","trello","trending-down","trending-up","triangle","truck","tv","twitch","twitter","type","umbrella","underline","unlock","upload","upload-cloud","user","user-check","user-minus","user-plus","user-x","users","video","video-off","voicemail","volume","volume-1","volume-2","volume-x","watch","wifi","wifi-off","wind","x","x-circle","x-octagon","x-square","youtube","zap","zap-off","zoom-in","zoom-out"]}],states:[{name:"Disabled",attribute:"disabled",description:"can appear disabled",usageLevel:1},{name:"Loading",attribute:"loading",description:"can be used as a simple loader",usageLevel:1}],variations:[{name:"Link",description:"can be formatted as a link",usageLevel:1},{name:"Fitted",description:"can be fitted without any space to the left or right of it.",usageLevel:1},{name:"Colored",value:"color",description:"can be colored",usageLevel:2,options:[{name:"Red",value:"red",description:"A button can be red"},{name:"Orange",value:"orange",description:"A button can be orange"},{name:"Yellow",value:"yellow",description:"A button can be yellow"},{name:"Olive",value:"olive",description:"A button can be olive"},{name:"Green",value:"green",description:"A button can be green"},{name:"Teal",value:"teal",description:"A button can be teal"},{name:"Blue",value:"blue",description:"A button can be blue"},{name:"Violet",value:"violet",description:"A button can be violet"},{name:"Purple",value:"purple",description:"A button can be purple"},{name:"Pink",value:"pink",description:"A button can be pink"},{name:"Brown",value:"brown",description:"A button can be brown"},{name:"Grey",value:"grey",description:"A button can be grey"},{name:"Black",value:"black",description:"A button can be black"}]},{name:"Size",value:"size",usageLevel:1,description:"can vary in size",options:[{name:"Mini",value:"mini",description:"An element can appear extremely small"},{name:"Tiny",value:"tiny",description:"An element can appear very small"},{name:"Small",value:"small",description:"An element can appear small"},{name:"Medium",value:"medium",description:"An element can appear normal sized"},{name:"Large",value:"large",description:"An element can appear larger than normal"},{name:"Big",value:"big",description:"An element can appear much larger than normal"},{name:"Huge",value:"huge",description:"An element can appear very much larger than normal"},{name:"Massive",value:"massive",description:"An element can appear extremely larger than normal"}]},{name:"Inverted",description:"can be formatted to appear on dark backgrounds",usageLevel:2,attribute:"inverted"}],settings:[{name:"href",type:"string",attribute:"href",description:"Link to a page"}],supportsPlural:!0,pluralName:"Icons",pluralTagName:"ui-icons",pluralDescription:"Icons can exist together as a group",pluralVariations:["colored","size"],examples:{defaultAttributes:{icon:"check-circle"}}};var un=new T,Rt=un.getWebComponentSpec(Mt);var _t={uiType:"element",name:"Menu",description:"A menu displays grouped navigation actions",tagName:"ui-menu",exportName:"UIMenu",content:[{name:"Item",tagName:"menu-item",subcomponent:"true",description:"can include a menu item",usageLevel:1},{name:"Menu Content",attribute:"menu",description:"can define its menu contents programatically",usageLevel:1,exampleCode:`<ui-menu value="3" items='[{"label":"One","value":"1"},{"label":"Two","value":"2"},{"label":"Three","value":"3"}]'></ui-menu>`}],types:[{name:"Selection",attribute:"selection",description:"allow for selection between choices",usageLevel:1}],variations:[{name:"Evenly Spaced",attribute:"evenly-spaced",description:"have its items split space evenly",usageLevel:1},{name:"Fitted",attribute:"fitted",description:"can remove its margin",usageLevel:2},{name:"Vertical",attribute:"vertical",description:"can be displayed vertically",usageLevel:1},{name:"Inset",attribute:"inset",description:"can have its menu items inset",usageLevel:1}],events:[{eventName:"change",description:"can specify a function to occur after the value changes",arguments:[{name:"value",description:"the updated value"}]}],settings:[{name:"Menu Items",type:"array",attribute:"items",description:"can automatically generate menu items"},{name:"Value",type:"string",attribute:"value",description:"can specify the active menu item value when generating menu items"}],examples:{defaultContent:`
  <menu-item active>One</menu-item>
  <menu-item>Two</menu-item>
  <menu-item>Three</menu-item>
`}};var Dt={uiType:"element",name:"Menu Item",description:"A menu item displays an individual selection in a menu",parentTag:"ui-menu",tagName:"menu-item",exportName:"UIMenuItem",content:[{name:"Icon",includeAttributeClass:!0,attribute:"icon",couplesWith:["ui-icon"],slot:"icon",description:"include an icon",exampleCode:'<menu-item icon="home">Home</menu-item>'},{name:"Href",type:"string",attribute:"href",description:"can specify a link"},{name:"Value",type:"string",attribute:"value",description:"can specify a value"}],states:[{name:"Hover",attribute:"hover",description:"hovered"},{name:"Focus",attribute:"focused",description:"focused by the keyboard"},{name:"Active",attribute:"active",description:"activated"},{name:"Disabled",attribute:"disabled",description:"disable interactions"}]};var Ni=new T,dn=Ni.getWebComponentSpec(_t),gn=Ni.getWebComponentSpec(Dt);var It={uiType:"element",name:"Label",description:"A label displays content classification",tagName:"ui-label",exportName:"UILabel",content:[],types:[],variations:[{name:"Size",attribute:"size",usageLevel:1,description:"vary in size",options:[{name:"Mini",value:"mini",description:"appear extremely small"},{name:"Tiny",value:"tiny",description:"appear very small"},{name:"Small",value:"small",description:"appear small"},{name:"Medium",value:"medium",description:"appear normal sized"},{name:"Large",value:"large",description:"appear larger than normal"},{name:"Big",value:"big",description:"appear much larger than normal"},{name:"Huge",value:"huge",description:"appear very much larger than normal"},{name:"Massive",value:"massive",description:"appear extremely larger than normal"}]}],events:[],settings:[]};var fn=new T,bn=fn.getWebComponentSpec(It);var Ot={uiType:"element",name:"Input",description:"A menu displays grouped navigation actions",tagName:"ui-input",exportName:"UIInput",content:[{name:"Placeholder",attribute:"placeholder",description:"include placeholder text",exampleCode:'<ui-input placeholder="Search..."></ui-input>'},{name:"Icon",includeAttributeClass:!0,attribute:"icon",couplesWith:["ui-icon"],description:"include an icon",exampleCode:'<ui-input icon="search"></ui-input>'},{name:"Label",includeAttributeClass:!0,attribute:"label",description:"include a label",exampleCode:'<ui-input label="ctrl+k"></ui-input>'}],types:[{name:"Search",attribute:"search",description:"can be formatted to appear as a search",exampleCode:"<ui-input search></ui-input>"}],variations:[{name:"Fluid",attribute:"fluid",usageLevel:1,description:"take the width of its container"},{name:"Size",attribute:"size",usageLevel:1,description:"vary in size",options:[{name:"Mini",value:"mini",description:"appear extremely small"},{name:"Tiny",value:"tiny",description:"appear very small"},{name:"Small",value:"small",description:"appear small"},{name:"Medium",value:"medium",description:"appear normal sized"},{name:"Large",value:"large",description:"appear larger than normal"},{name:"Big",value:"big",description:"appear much larger than normal"},{name:"Huge",value:"huge",description:"appear very much larger than normal"},{name:"Massive",value:"massive",description:"appear extremely larger than normal"}]}],events:[{eventName:"change",description:"occurs after the value changes",arguments:[{name:"value",description:"the updated value"}]}],settings:[{name:"Name",type:"string",attribute:"name",description:"can specify the form field name"},{name:"Debounced",type:"boolean",attribute:"debounced",defaultValue:!1,description:"can specify the input value should be debounced"},{name:"Debounce Interval",type:"number",attribute:"debounce-interval",defaultValue:150,description:"can specify the input debounce interval in milliseconds"},{name:"Clearable",type:"string",attribute:"clearable",description:"can show an icon to reset the inputted value"},{name:"Placeholder",type:"string",attribute:"placeholder",description:"can specify placeholder text"},{name:"Value",type:"string",attribute:"value",description:"can specify a value to store"}],examples:{defaultAttributes:{icon:"check-circle"}}};var wn=new T,yn=wn.getWebComponentSpec(Ot);var zt={uiType:"element",name:"Segment",description:"A menu displays grouped navigation actions",tagName:"ui-menu",exportName:"UISegment",content:[],types:[{name:"placeholder",attribute:"placeholder",description:"used as a placeholder for content in a layout.",usageLevel:1}],variations:[],events:[],settings:[]};var xn=new T,An=xn.getWebComponentSpec(zt);var ut={uiType:"element",name:"Card",description:"A card displays segmented content in a manner similar to a playing card.",tagName:"ui-card",exportName:"UICard",examples:{},content:[{name:"Icon",includeAttributeClass:!0,attribute:"icon",couplesWith:["ui-icon"],description:"include an icon",exampleCode:`<ui-card icon="pause"></ui-card>
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
</ui-card>`},{name:"Image",attribute:"image",couplesWith:["ui-image"],description:"include an image",exampleCode:'<ui-card image="/images/avatar/jenny.jpg">Get started with your new card.</ui-card>'}],types:[],states:[{name:"Hover",attribute:"hover",description:"be hovered"},{name:"Focus",attribute:"focused",description:"be focused by the keyboard"},{name:"Disabled",attribute:"disabled",includeAttributeClass:!0,description:"have interactions disabled",options:[{name:"Disabled",value:"disabled",description:"disable interactions"},{name:"Clickable Disabled",value:"clickable-disabled",description:"allow interactions but appear disabled"}]}],variations:[{name:"Fluid",attribute:"fluid",usageLevel:1,description:"take the width of its container"},{name:"Link",attribute:"link",usageLevel:1,description:"can be formatted as if the card can be clicked"},{name:"Horizontal",attribute:"horizontal",usageLevel:1,description:"can have content horizontally oriented",exampleCode:'<ui-card horizontal image="/images/avatar/jenny.jpg">Get started with your new card.</ui-card>'}],settings:[{name:"Href",type:"string",attribute:"href",description:"link to a url"}],supportsPlural:!0,pluralName:"Cards",pluralTagName:"ui-cards",pluralExportName:"UICards",pluralDescription:"Cards can exist together as a group",pluralContent:[],pluralSharedTypes:["link"],pluralOnlyTypes:[],pluralOnlyVariations:[{name:"doubling",attribute:"doubling",description:"A group of cards can double its column width for mobile",usageLevel:3},{name:"stackable",attribute:"stackable",description:"A group of cards can automatically stack rows to a single columns on mobile devices",usageLevel:3},{name:"Spaced",attribute:"spaced",description:"A group of cards can adjust its spacing",usageLevel:2,options:[{name:"Spaced",value:"spaced",description:"A card group have increased spacing"},{name:"Three",value:"very-spaced",description:"A card group can have very increased spacing"}]},{name:"Count",attribute:"count",description:"A group of cards can set how many cards should exist in a row",usageLevel:3,options:[{name:"Two",value:"two",description:"A card group can have two items per row"},{name:"Three",value:"three",description:"A card group can have three items per row"},{name:"Four",value:"four",description:"A card group can have four items per row"},{name:"Five",value:"five",description:"A card group can have five items per row"},{name:"Six",value:"six",description:"A card group can have six items per row"}]}],pluralSharedVariations:[]};var Tn=new T(ut).getWebComponentSpec(),En=new T(ut,{plural:!0}).getWebComponentSpec();var Ht={uiType:"element",name:"Modal",description:"A modal displays content that temporarily blocks interactions with the main view of a site",tagName:"ui-modal",exportName:"UIModal",content:[],types:[{name:"Glass",attribute:"glass",description:"can appear as glass",usageLevel:3}],variations:[{name:"Aligned",attribute:"aligned",description:"adjust its alignment",usageLevel:1,options:[{name:"Top Aligned",value:["top-aligned"],description:"appear aligned to top of browser",exampleCode:"<ui-modal top-aligned>Modal Content</ui-modal>"}]},{name:"Size",attribute:"size",usageLevel:1,description:"vary in size",options:[{name:"Tiny",value:"tiny",description:"appear very small"},{name:"Small",value:"small",description:"appear small"},{name:"Medium",value:"medium",description:"appear normal sized"},{name:"Large",value:"large",description:"appear larger than normal"},{name:"Big",value:"big",description:"appear much larger than normal"}]}],events:[{eventName:"show",description:"occurs after the modal starts to show"},{eventName:"visible",description:"occurs after the modal is visible"},{eventName:"hide",description:"occurs when the modal begins to hide"},{eventName:"hidden",description:"occurs after the modal is hidden"}],settings:[{name:"Closeable",type:"boolean",defaultValue:!0,attribute:"closeable",description:"can allow the modal to be dismissed by clicking on the backdrop."}]};var Ln=new T,Nn=Ln.getWebComponentSpec(Ht);var Pi=`/* src/components/icon/css/shadow/content/icon.css */
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
`;var Mi=`{#if either href link}
  <a href={href} class="hitbox">
    {>content}
  </a>
{else}
  {> content}
{/if}

{#snippet content}
  <i class="{ui}icon" part="icon"></i>
{/snippet}
`;var Rn=({self:s,$:e})=>({}),_n=({self:s,el:e})=>{},Dn=function({$:s,isClient:e}){},In=Lt({tagName:"ui-icon",componentSpec:Rt,template:Mi,css:Pi,createComponent:Rn,onCreated:_n,onRendered:Dn});export{In as UIIcon};
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
//# sourceMappingURL=icon.js.map
