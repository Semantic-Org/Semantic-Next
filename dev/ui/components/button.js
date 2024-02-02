var Ct=(r,t="")=>{t=t.toLowerCase();let e=document.createElement("style"),o=(c,s)=>`${`${s} ${c.selectorText}`} { ${c.style.cssText} }`;document.head.appendChild(e),e.appendChild(document.createTextNode(r));let n=e.sheet,a=[];for(let c=0;c<n.cssRules.length;c++){let s=n.cssRules[c];switch(s.type){case CSSRule.STYLE_RULE:a.push(o(s,t));break;case CSSRule.MEDIA_RULE:case CSSRule.SUPPORTS_RULE:let d=[];Array.from(s.cssRules).forEach(l=>{d.push(o(l,t))}),a.push(`@${s.name} ${s.conditionText} { ${d.join(" ")} }`);break;default:a.push(s.cssText);break}}return document.head.removeChild(e),a.join(`
`)};var ct=globalThis,bt=ct.ShadowRoot&&(ct.ShadyCSS===void 0||ct.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,qt=Symbol(),Vt=new WeakMap,lt=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==qt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(bt&&t===void 0){let o=e!==void 0&&e.length===1;o&&(t=Vt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&Vt.set(e,t))}return t}toString(){return this.cssText}},ut=r=>new lt(typeof r=="string"?r:r+"",void 0,qt);var zt=(r,t)=>{if(bt)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let o=document.createElement("style"),n=ct.litNonce;n!==void 0&&o.setAttribute("nonce",n),o.textContent=e.cssText,r.appendChild(o)}},dt=bt?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let o of t.cssRules)e+=o.cssText;return ut(e)})(r):r;var{is:He,defineProperty:De,getOwnPropertyDescriptor:Pe,getOwnPropertyNames:Oe,getOwnPropertySymbols:Ue,getPrototypeOf:Ie}=Object,vt=globalThis,jt=vt.trustedTypes,Fe=jt?jt.emptyScript:"",Ye=vt.reactiveElementPolyfillSupport,Z=(r,t)=>r,Tt={toAttribute(r,t){switch(t){case Boolean:r=r?Fe:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},Kt=(r,t)=>!He(r,t),Wt={attribute:!0,type:String,converter:Tt,reflect:!1,hasChanged:Kt};Symbol.metadata??=Symbol("metadata"),vt.litPropertyMetadata??=new WeakMap;var T=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Wt){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){let o=Symbol(),n=this.getPropertyDescriptor(t,o,e);n!==void 0&&De(this.prototype,t,n)}}static getPropertyDescriptor(t,e,o){let{get:n,set:a}=Pe(this.prototype,t)??{get(){return this[e]},set(i){this[e]=i}};return{get(){return n?.call(this)},set(i){let c=n?.call(this);a.call(this,i),this.requestUpdate(t,c,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Wt}static _$Ei(){if(this.hasOwnProperty(Z("elementProperties")))return;let t=Ie(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Z("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Z("properties"))){let e=this.properties,o=[...Oe(e),...Ue(e)];for(let n of o)this.createProperty(n,e[n])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[o,n]of e)this.elementProperties.set(o,n)}this._$Eh=new Map;for(let[e,o]of this.elementProperties){let n=this._$Eu(e,o);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let o=new Set(t.flat(1/0).reverse());for(let n of o)e.unshift(dt(n))}else t!==void 0&&e.push(dt(t));return e}static _$Eu(t,e){let o=e.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return zt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$EC(t,e){let o=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,o);if(n!==void 0&&o.reflect===!0){let a=(o.converter?.toAttribute!==void 0?o.converter:Tt).toAttribute(e,o.type);this._$Em=t,a==null?this.removeAttribute(n):this.setAttribute(n,a),this._$Em=null}}_$AK(t,e){let o=this.constructor,n=o._$Eh.get(t);if(n!==void 0&&this._$Em!==n){let a=o.getPropertyOptions(n),i=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:Tt;this._$Em=n,this[n]=i.fromAttribute(e,a.type),this._$Em=null}}requestUpdate(t,e,o){if(t!==void 0){if(o??=this.constructor.getPropertyOptions(t),!(o.hasChanged??Kt)(this[t],e))return;this.P(t,e,o)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,o){this._$AL.has(t)||this._$AL.set(t,e),o.reflect===!0&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,a]of this._$Ep)this[n]=a;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[n,a]of o)a.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],a)}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(o=>o.hostUpdate?.()),this.update(e)):this._$EU()}catch(o){throw t=!1,this._$EU(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach(e=>this._$EC(e,this[e])),this._$EU()}updated(t){}firstUpdated(t){}};T.elementStyles=[],T.shadowRootOptions={mode:"open"},T[Z("elementProperties")]=new Map,T[Z("finalized")]=new Map,Ye?.({ReactiveElement:T}),(vt.reactiveElementVersions??=[]).push("2.0.4");var Mt=globalThis,pt=Mt.trustedTypes,Gt=pt?pt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Rt="$lit$",L=`lit$${(Math.random()+"").slice(9)}$`,Nt="?"+L,Be=`<${Nt}>`,I=document,Q=()=>I.createComment(""),tt=r=>r===null||typeof r!="object"&&typeof r!="function",ee=Array.isArray,oe=r=>ee(r)||typeof r?.[Symbol.iterator]=="function",Lt=`[ 	
\f\r]`,J=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Xt=/-->/g,Zt=/>/g,O=RegExp(`>|${Lt}(?:([^\\s"'>=/]+)(${Lt}*=${Lt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Jt=/'/g,Qt=/"/g,re=/^(?:script|style|textarea|title)$/i,ne=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),ae=ne(1),po=ne(2),$=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),te=new WeakMap,U=I.createTreeWalker(I,129);function ie(r,t){if(!Array.isArray(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Gt!==void 0?Gt.createHTML(t):t}var se=(r,t)=>{let e=r.length-1,o=[],n,a=t===2?"<svg>":"",i=J;for(let c=0;c<e;c++){let s=r[c],d,l,b=-1,p=0;for(;p<s.length&&(i.lastIndex=p,l=i.exec(s),l!==null);)p=i.lastIndex,i===J?l[1]==="!--"?i=Xt:l[1]!==void 0?i=Zt:l[2]!==void 0?(re.test(l[2])&&(n=RegExp("</"+l[2],"g")),i=O):l[3]!==void 0&&(i=O):i===O?l[0]===">"?(i=n??J,b=-1):l[1]===void 0?b=-2:(b=i.lastIndex-l[2].length,d=l[1],i=l[3]===void 0?O:l[3]==='"'?Qt:Jt):i===Qt||i===Jt?i=O:i===Xt||i===Zt?i=J:(i=O,n=void 0);let v=i===O&&r[c+1].startsWith("/>")?" ":"";a+=i===J?s+Be:b>=0?(o.push(d),s.slice(0,b)+Rt+s.slice(b)+L+v):s+L+(b===-2?c:v)}return[ie(r,a+(r[e]||"<?>")+(t===2?"</svg>":"")),o]},et=class r{constructor({strings:t,_$litType$:e},o){let n;this.parts=[];let a=0,i=0,c=t.length-1,s=this.parts,[d,l]=se(t,e);if(this.el=r.createElement(d,o),U.currentNode=this.el.content,e===2){let b=this.el.content.firstChild;b.replaceWith(...b.childNodes)}for(;(n=U.nextNode())!==null&&s.length<c;){if(n.nodeType===1){if(n.hasAttributes())for(let b of n.getAttributeNames())if(b.endsWith(Rt)){let p=l[i++],v=n.getAttribute(b).split(L),u=/([.?@])?(.*)/.exec(p);s.push({type:1,index:a,name:u[2],strings:v,ctor:u[1]==="."?gt:u[1]==="?"?mt:u[1]==="@"?ft:Y}),n.removeAttribute(b)}else b.startsWith(L)&&(s.push({type:6,index:a}),n.removeAttribute(b));if(re.test(n.tagName)){let b=n.textContent.split(L),p=b.length-1;if(p>0){n.textContent=pt?pt.emptyScript:"";for(let v=0;v<p;v++)n.append(b[v],Q()),U.nextNode(),s.push({type:2,index:++a});n.append(b[p],Q())}}}else if(n.nodeType===8)if(n.data===Nt)s.push({type:2,index:a});else{let b=-1;for(;(b=n.data.indexOf(L,b+1))!==-1;)s.push({type:7,index:a}),b+=L.length-1}a++}}static createElement(t,e){let o=I.createElement("template");return o.innerHTML=t,o}};function F(r,t,e=r,o){if(t===$)return t;let n=o!==void 0?e._$Co?.[o]:e._$Cl,a=tt(t)?void 0:t._$litDirective$;return n?.constructor!==a&&(n?._$AO?.(!1),a===void 0?n=void 0:(n=new a(r),n._$AT(r,e,o)),o!==void 0?(e._$Co??=[])[o]=n:e._$Cl=n),n!==void 0&&(t=F(r,n._$AS(r,t.values),n,o)),t}var ht=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:o}=this._$AD,n=(t?.creationScope??I).importNode(e,!0);U.currentNode=n;let a=U.nextNode(),i=0,c=0,s=o[0];for(;s!==void 0;){if(i===s.index){let d;s.type===2?d=new q(a,a.nextSibling,this,t):s.type===1?d=new s.ctor(a,s.name,s.strings,this,t):s.type===6&&(d=new xt(a,this,t)),this._$AV.push(d),s=o[++c]}i!==s?.index&&(a=U.nextNode(),i++)}return U.currentNode=I,n}p(t){let e=0;for(let o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}},q=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,o,n){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=F(this,t,e),tt(t)?t===f||t==null||t===""?(this._$AH!==f&&this._$AR(),this._$AH=f):t!==this._$AH&&t!==$&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):oe(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==f&&tt(this._$AH)?this._$AA.nextSibling.data=t:this.T(I.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:o}=t,n=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=et.createElement(ie(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===n)this._$AH.p(e);else{let a=new ht(n,this),i=a.u(this.options);a.p(e),this.T(i),this._$AH=a}}_$AC(t){let e=te.get(t.strings);return e===void 0&&te.set(t.strings,e=new et(t)),e}k(t){ee(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,o,n=0;for(let a of t)n===e.length?e.push(o=new r(this.S(Q()),this.S(Q()),this,this.options)):o=e[n],o._$AI(a),n++;n<e.length&&(this._$AR(o&&o._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){let o=t.nextSibling;t.remove(),t=o}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Y=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,n,a){this.type=1,this._$AH=f,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=a,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=f}_$AI(t,e=this,o,n){let a=this.strings,i=!1;if(a===void 0)t=F(this,t,e,0),i=!tt(t)||t!==this._$AH&&t!==$,i&&(this._$AH=t);else{let c=t,s,d;for(t=a[0],s=0;s<a.length-1;s++)d=F(this,c[o+s],e,s),d===$&&(d=this._$AH[s]),i||=!tt(d)||d!==this._$AH[s],d===f?t=f:t!==f&&(t+=(d??"")+a[s+1]),this._$AH[s]=d}i&&!n&&this.j(t)}j(t){t===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},gt=class extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===f?void 0:t}},mt=class extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==f)}},ft=class extends Y{constructor(t,e,o,n,a){super(t,e,o,n,a),this.type=5}_$AI(t,e=this){if((t=F(this,t,e,0)??f)===$)return;let o=this._$AH,n=t===f&&o!==f||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,a=t!==f&&(o===f||n);n&&this.element.removeEventListener(this.name,this,o),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},xt=class{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){F(this,t)}},ce={P:Rt,A:L,C:Nt,M:1,L:se,R:ht,D:oe,V:F,I:q,H:Y,N:mt,U:ft,B:gt,F:xt},Ve=Mt.litHtmlPolyfillSupport;Ve?.(et,q),(Mt.litHtmlVersions??=[]).push("3.1.2");var le=(r,t,e)=>{let o=e?.renderBefore??t,n=o._$litPart$;if(n===void 0){let a=e?.renderBefore??null;o._$litPart$=n=new q(t.insertBefore(Q(),a),a,void 0,e??{})}return n._$AI(r),n};var R=class extends T{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=le(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return $}};R._$litElement$=!0,R.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:R});var qe=globalThis.litElementPolyfillSupport;qe?.({LitElement:R});(globalThis.litElementVersions??=[]).push("4.0.4");var Ht=(r,{errorType:t=Error,metadata:e={},onError:o=null,removeStackLines:n=1}={})=>{let a=new t(r);if(Object.assign(a,e),a.stack){let c=a.stack.split(`
`);c.splice(1,n),a.stack=c.join(`
`)}let i=()=>{throw typeof o=="function"&&o(a),a};typeof queueMicrotask=="function"?queueMicrotask(i):setTimeout(i,0)},W=r=>typeof r=="object";var de=r=>typeof r=="string",be=r=>Array.isArray(r),ue=r=>typeof Uint8Array<"u"&&r instanceof Uint8Array,E=r=>typeof r=="function"||!1;var je=function(r){return!!(r&&yt(r,"callee"))},wt=function(r,t){let e=i=>i<10?"0"+i:i,o={YYYY:r.getFullYear(),YY:r.getFullYear().toString().slice(-2),MMMM:r.toLocaleString("default",{month:"long"}),MMM:r.toLocaleString("default",{month:"short"}),MM:e(r.getMonth()+1),M:r.getMonth()+1,DD:e(r.getDate()),D:r.getDate(),Do:r.getDate()+["th","st","nd","rd"][((r.getDate()+90)%100-10)%10-1]||"th",dddd:r.toLocaleString("default",{weekday:"long"}),ddd:r.toLocaleString("default",{weekday:"short"}),HH:e(r.getHours()),h:r.getHours()%12||12,mm:e(r.getMinutes()),ss:e(r.getSeconds()),a:r.getHours()>=12?"pm":"am"};return({LT:"h:mm a",LTS:"h:mm:ss a",L:"MM/DD/YYYY",l:"M/D/YYYY",LL:"MMMM D, YYYY",ll:"MMM D, YYYY",LLL:"MMMM D, YYYY h:mm a",lll:"MMM D, YYYY h:mm a",LLLL:"dddd, MMMM D, YYYY h:mm a",llll:"ddd, MMM D, YYYY h:mm a"}[t]||t).replace(/\b(?:YYYY|YY|MMMM|MMM|MM|M|DD|D|Do|dddd|ddd|HH|h|mm|ss|a)\b/g,i=>o[i]).replace(/\[(.*?)\]/g,(i,c)=>c)},C=function(){},ve=r=>E(r)?r:()=>r,pe=(r="")=>r.replace(/-./g,t=>t[1].toUpperCase());var he=r=>Array.from(new Set(r));var rt=function(r,t,e){if(Array.isArray(r))return!t||e?r[r.length-1]:slice.call(r,Math.max(r.length-t,0))};var ot=r=>Object.keys(r);var H=function(r,t){let e=ot(r).reverse(),o=e.length,n=e.length,a={};for(;n--;){let i=e[n];a[i]=t(r[i],i)}return a},ge=(r,...t)=>(t.forEach(e=>{let o,n;if(e)for(n in e)o=Object.getOwnPropertyDescriptor(e,n),o===void 0?r[n]=e[n]:Object.defineProperty(r,n,o)}),r);var yt=function(r,t=""){t=t.replace(/^\./,"").replace(/\[(\w+)\]/g,".$1");let e=t.split(".");for(let o=0,n=e.length;o<n;++o){let a=e[o];if(r&&a in r)r=r[a];else return}return r},We=(r,t)=>Object.hasOwn.call(r,t),me=r=>{let t={},e=(o,n)=>{be(t[o])?t[o].push(n):t[o]?t[o]=[t[o],n]:t[o]=n};return Object.keys(r).forEach(o=>{be(r[o])?y(r[o],n=>{e(n,o)}):e(r[o],o)}),t},j=r=>{let t;return W(r)?r===null?null:r instanceof Date?new Date(r.getTime()):r instanceof RegExp?r:Array.isArray(r)?r.map(j):je(r)?Array.from(r).map(j):E(r.clone)?r.clone():(t={},ot(r).forEach(e=>{t[e]=j(r[e])}),t):r},y=(r,t,e)=>{if(r===null)return r;let n=((i,c)=>i===void 0?c:(s,d,l)=>c.call(i,s,d,l))(e,t),a;if(r.length===+r.length)for(a=0;a<r.length;++a)n(r[a],a,r);else{let i=ot(r);for(a=0;a<i.length;++a)n(r[i[a]],i[a],r)}return r},kt=function(r){return r.replace(/([.*+?^=!:${}()|\[\]\/\\])/g,"\\$1")};function Dt(r){let t;if(r&&r.toString===Object.prototype.toString&&typeof r=="object")try{t=JSON.stringify(r)}catch(i){return console.error("Error serializing input",i),0}else t=r.toString();let e=305419896,o=(i,c)=>{let s,d,l,b,p,v,u,m,h,g;for(s=i.length&3,d=i.length-s,l=c,p=3432918353,u=461845907,g=0;g<d;)h=i.charCodeAt(g)&255|(i.charCodeAt(++g)&255)<<8|(i.charCodeAt(++g)&255)<<16|(i.charCodeAt(++g)&255)<<24,++g,h=(h&65535)*p+(((h>>>16)*p&65535)<<16)&4294967295,h=h<<15|h>>>17,h=(h&65535)*u+(((h>>>16)*u&65535)<<16)&4294967295,l^=h,l=l<<13|l>>>19,b=(l&65535)*5+(((l>>>16)*5&65535)<<16)&4294967295,l=(b&65535)+27492+(((b>>>16)+58964&65535)<<16);switch(h=0,s){case 3:h^=(i.charCodeAt(g+2)&255)<<16;case 2:h^=(i.charCodeAt(g+1)&255)<<8;case 1:h^=i.charCodeAt(g)&255,h=(h&65535)*p+(((h>>>16)*p&65535)<<16)&4294967295,h=h<<15|h>>>17,h=(h&65535)*u+(((h>>>16)*u&65535)<<16)&4294967295,l^=h}return l^=i.length,l^=l>>>16,l=(l&65535)*2246822507+(((l>>>16)*2246822507&65535)<<16)&4294967295,l^=l>>>13,l=(l&65535)*3266489909+(((l>>>16)*3266489909&65535)<<16)&4294967295,l^=l>>>16,l>>>0},n=i=>{if(i===0)return"0";let c="",s="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";for(;i>0;)c=s[i%s.length]+c,i=Math.floor(i/s.length);return c},a;return a=o(t,e),a=n(a),a}var N=(r,t,e)=>{let o,n=!!(e&&e.keyOrderSensitive);if(r===t||Number.isNaN(r)&&Number.isNaN(t))return!0;if(!r||!t||!(W(r)&&W(t)))return!1;if(r instanceof Date&&t instanceof Date)return r.valueOf()===t.valueOf();if(ue(r)&&ue(t)){if(r.length!==t.length)return!1;for(o=0;o<r.length;o++)if(r[o]!==t[o])return!1;return!0}if(E(r.equals))return r.equals(t,e);if(E(t.equals))return t.equals(r,e);if(r instanceof Array){if(!(t instanceof Array)||r.length!==t.length)return!1;for(o=0;o<r.length;o++)if(!N(r[o],t[o],e))return!1;return!0}let a,i=ot(r),c=ot(t);return n?(o=0,a=i.every(s=>o>=c.length||s!==c[o]||!N(r[s],t[c[o]],e)?!1:(o++,!0))):(o=0,a=i.every(s=>!We(t,s)||!N(r[s],t[s],e)?!1:(o++,!0))),a&&o===c.length};var nt=class r{static DEBUG_MODE=!0;constructor(t){this.input=t,this.pos=0,this.runCount=0}matches(t){return t.test(this.rest())}rest(){return this.input.slice(this.pos)}isEOF(){return this.runCount++,this.pos>=this.input.length}peek(){return this.input.charAt(this.pos)}consume(t){let e=typeof t=="string"?new RegExp(kt(t)):new RegExp(t),o=this.input.substring(this.pos),n=e.exec(o);return n&&n.index===0?(this.pos+=n[0].length,n[0]):null}consumeUntil(t){let o=(typeof t=="string"?new RegExp(kt(t)):new RegExp(t)).exec(this.input.substring(this.pos));if(!o){let a=this.input.substr(this.pos);return this.pos=this.input.length,a}let n=this.input.substring(this.pos,this.pos+o.index);return this.pos+=o.index,n}returnTo(t){if(!t)return;let e=typeof t=="string"?new RegExp(kt(t),"gm"):new RegExp(t,"gm"),o=null,n,a=this.input.substring(0,this.pos);for(;(n=e.exec(a))!==null;)o=n;if(o){let i=this.input.substring(0,o.index);return this.pos=o.index,i}}fatal(t){t=t||"Parse error";let e=this.input.split(`
`),o=0,n=0;for(let u of e){if(n+u.length+1>this.pos)break;n+=u.length+1,o++}let a=5,i=5,c=Math.max(0,o-a),s=Math.min(e.length,o+i+1),d=e.slice(c,s),l=d.map((u,m)=>{let h=o-c===m;return`%c${u}`}).join(`
`),b="color: grey",p="color: red; font-weight: bold";if(r.DEBUG_MODE&&document.body){let u="";y(d,(h,g)=>{let _=g<a||g>a?b:p;u+=`<div style="${_}">${h}</div>`});let m=`
        <div style="padding: 1rem; font-size: 14px;">
          <h2>Could not render template</h2>
          <h3>${t}</h3>
          <code style="margin-top: 1rem; display: block; background-color: #EFEFEF; padding: 0.25rem 1rem;border-left: 3px solid #888"><pre>${u}</pre></code>
        </div>
      `;document.body.innerHTML=m}throw console.error(t+`
`+l,...d.map((u,m)=>o-c===m?p:b)),new Error(t)}};var B=class r{constructor(t){this.template=t||""}static tagRegExp={IF:/^{{\s*#if\s+/,ELSEIF:/^{{\s*else\s*if\s+/,ELSE:/^{{\s*else\s*/,EACH:/^{{\s*#each\s+/,CLOSE_IF:/^{{\s*\/(if)\s*/,CLOSE_EACH:/^{{\s*\/(each)\s*/,SLOT:/^{{\s*slot\s*/,TEMPLATE:/^{{>\s*/,HTML_EXPRESSION:/^{{{\s*/,EXPRESSION:/^{{\s*/};static templateRegExp={verbose:{keyword:/^template\W/g,properties:/(\w+)\s*=\s*((?:.|\n)*?)(?=\s*\w+\s*=)/mg},standard:/(\w.*?)($|\s)/mg,dataObject:/(\w+)\s*:\s*([^,}]+)/g};compile(t=this.template){t=t.trim();let e=new nt(t),o=r.tagRegExp,n=l=>{for(let b in o)if(l.matches(o[b])){l.consume(o[b]);let p=this.getValue(l.consumeUntil("}}").trim());return l.consume("}}"),{type:b,content:p}}return null},a=[],i=[],c=null,s=[],d=[];for(;!e.isEOF();){let l=n(e),b=rt(i),p=rt(s),v=c?.content||b||a;if(l){let u={type:l.type.toLowerCase()};switch(l.type){case"IF":u={...u,condition:l.content,content:[],branches:[]},v.push(u),s.push(u),d.push(u),c=u;break;case"ELSEIF":u={...u,condition:l.content,content:[]},p||(e.returnTo(starts.ELSEIF),e.fatal("{{elseif}} encountered without matching if condition")),d.pop(),d.push(u),p.branches.push(u),c=u;break;case"ELSE":if(u={...u,content:[]},!p){e.returnTo(starts.ELSE),e.fatal("{{else}} encountered without matching if condition");break}d.pop(),d.push(u),p.branches.push(u),c=u;break;case"HTML_EXPRESSION":u={...u,type:"expression",unsafeHTML:!0,value:l.content},v.push(u),e.consume("}");break;case"EXPRESSION":u={...u,value:l.content},v.push(u);break;case"TEMPLATE":let m=this.parseTemplateString(l.content);u={...u,...m},v.push(u);break;case"SLOT":u={...u,name:l.content},v.push(u);break;case"CLOSE_IF":s.length==0&&(e.returnTo(starts.CLOSE_IF),e.fatal("{{/if}} close tag found without open if tag")),i.pop(),d.pop(),s.pop(),c=rt(d);break;case"EACH":let h=l.content.split(" in "),g,_;h.length>1?(_=h[0].trim(),g=h[1].trim()):g=h[0].trim(),u={...u,as:_,over:g,content:[]},v.push(u),c=u;break;case"CLOSE_EACH":i.pop(),c=rt(d);break}}else{let u=/\{\{/,m=e.consumeUntil(u);if(m){let h={type:"html",html:m};v.push(h)}}}return a}getValue(t){return t=="true"?!0:t=="false"?!1:Number.isNaN(parseFloat(t,10))?t:+t}parseTemplateString(t=""){let e=r.templateRegExp,o={};if(e.verbose.keyword.exec(t)){let n=[...t.matchAll(e.verbose.properties)];y(n,(a,i)=>{let c=a[1],s=this.getObjectFromString(a[2]);o[c]=s})}else{let n={},a=[...t.matchAll(e.standard)];y(a,(i,c)=>{if(c==0)o.name=`'${i[0].trim()}'`;else{let s=i[0].split("=");if(s.length){let d=s[0].trim(),l=s[1].trim();n[d]=l}}}),o.data=n}return o}getObjectFromString(t=""){let e=r.templateRegExp.dataObject,o={},n,a=!1;for(;(n=e.exec(t))!==null;)a=!0,o[n[1]]=n[2].trim();return a?o:t.trim()}};var V={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},k=r=>(...t)=>({_$litDirective$:r,values:t}),M=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,o){this._$Ct=t,this._$AM=e,this._$Ci=o}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var{I:Ge}=ce;var xe=r=>r.strings===void 0,fe=()=>document.createComment(""),K=(r,t,e)=>{let o=r._$AA.parentNode,n=t===void 0?r._$AB:t._$AA;if(e===void 0){let a=o.insertBefore(fe(),n),i=o.insertBefore(fe(),n);e=new Ge(a,i,r,r.options)}else{let a=e._$AB.nextSibling,i=e._$AM,c=i!==r;if(c){let s;e._$AQ?.(r),e._$AM=r,e._$AP!==void 0&&(s=r._$AU)!==i._$AU&&e._$AP(s)}if(a!==n||c){let s=e._$AA;for(;s!==a;){let d=s.nextSibling;o.insertBefore(s,n),s=d}}}return e},D=(r,t,e=r)=>(r._$AI(t,e),r),Xe={},we=(r,t=Xe)=>r._$AH=t,ye=r=>r._$AH,At=r=>{r._$AP?.(!1,!0);let t=r._$AA,e=r._$AB.nextSibling;for(;t!==e;){let o=t.nextSibling;t.remove(),t=o}};var at=(r,t)=>{let e=r._$AN;if(e===void 0)return!1;for(let o of e)o._$AO?.(t,!1),at(o,t);return!0},$t=r=>{let t,e;do{if((t=r._$AM)===void 0)break;e=t._$AN,e.delete(r),r=t}while(e?.size===0)},ke=r=>{for(let t;t=r._$AM;r=t){let e=t._$AN;if(e===void 0)t._$AN=e=new Set;else if(e.has(r))break;e.add(r),Qe(t)}};function Ze(r){this._$AN!==void 0?($t(this),this._$AM=r,ke(this)):this._$AM=r}function Je(r,t=!1,e=0){let o=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(t)if(Array.isArray(o))for(let a=e;a<o.length;a++)at(o[a],!1),$t(o[a]);else o!=null&&(at(o,!1),$t(o));else at(this,r)}var Qe=r=>{r.type==V.CHILD&&(r._$AP??=Je,r._$AQ??=Ze)},S=class extends M{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,o){super._$AT(t,e,o),ke(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(at(this,t),$t(this))}setValue(t){if(xe(this._$Ct))this._$Ct._$AI(t,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}};var G=class{constructor(){this.subscribers=new Set}depend(){x.current&&(this.subscribers.add(x.current),x.current.dependencies.add(this))}changed(){this.subscribers.forEach(t=>t.invalidate())}cleanUp(t){this.subscribers.delete(t)}unsubscribe(t){this.subscribers.delete(t)}};var x=class r{static current=null;static pendingReactions=new Set;static afterFlushCallbacks=[];static isFlushScheduled=!1;static create(t){let e=new r(t);return e.run(),e}static scheduleFlush(){r.isFlushScheduled||(r.isFlushScheduled=!0,typeof queueMicrotask=="function"?queueMicrotask(()=>r.flush()):Promise.resolve().then(()=>r.flush()))}static flush(){r.isFlushScheduled=!1,r.pendingReactions.forEach(t=>t.run()),r.pendingReactions.clear(),r.afterFlushCallbacks.forEach(t=>t()),r.afterFlushCallbacks=[]}static afterFlush(t){r.afterFlushCallbacks.push(t)}constructor(t){this.callback=t,this.dependencies=new Set,this.boundRun=this.run.bind(this),this.firstRun=!0,this.active=!0}run(){this.active&&(r.current=this,this.dependencies.forEach(t=>t.cleanUp(this)),this.dependencies.clear(),this.callback(this),this.firstRun=!1,r.current=null,r.pendingReactions.delete(this))}invalidate(){this.active=!0,r.pendingReactions.add(this),r.scheduleFlush()}stop(){this.active&&(this.active=!1,this.dependencies.forEach(t=>t.unsubscribe(this)))}static nonreactive(t){let e=r.current;r.current=null;try{return t()}finally{r.current=e}}static guard(t){if(!r.current)return t();let e=new G,o,n,a=new r(()=>{n=t(),!a.firstRun&&!N(n,o)&&(console.log("dep changed",o),e.changed()),o=j(n)});return a.run(),e.depend(),o}};var Pt=class extends S{__reactiveVar;__dispose=function(){};render(t){if(t){if(t!==this.__reactiveVar){this.__dispose?.(),this.__reactiveVar=t;let e=!0;this.__dispose=t.subscribe(o=>{e===!1&&this.setValue(o)}),e=!1}return t.peek()}}disconnected(){this.__dispose?.()}reconnected(){this.__dispose=this.__reactiveVar?.subscribe(t=>{this.setValue(t)})}},to=k(Pt);var _t=class r{constructor(t,e=document){let o=[];t&&(Array.isArray(t)?o=t:typeof t=="string"?o=e.querySelectorAll(t):t instanceof Element||t instanceof Document||t instanceof DocumentFragment?o=[t]:t instanceof NodeList&&(o=t),this.length=o.length,Object.assign(this,o))}find(t){let e=Array.from(this).flatMap(o=>Array.from(o.querySelectorAll(t)));return new r(e)}parent(t){let e=Array.from(this).map(o=>o.parentElement).filter(Boolean);return t?new r(e).filter(t):new r(e)}children(t){let e=Array.from(this).flatMap(n=>Array.from(n.children)),o=t?e.filter(n=>n.matches(t)):e;return new r(o)}filter(t){let e=Array.from(this).filter(o=>o.matches(t));return new r(e)}not(t){let e=Array.from(this).filter(o=>!o.matches(t));return new r(e)}closest(t){let e=Array.from(this).map(o=>o.closest(t)).filter(Boolean);return new r(e)}on(t,e,o,n=new AbortController){this._eventHandlers=this._eventHandlers||[];let a=[],i=n.signal;return Array.from(this).forEach(c=>{let s=l=>{if(typeof e=="function")e.call(c,l);else for(let b=l.target;b&&b!==c;b=b.parentNode)if(b.matches(e)){o.call(b,l);break}};c.addEventListener(t,s,{signal:i});let d={el:c,event:t,eventListener:s,abortController:n,delegated:typeof e=="string",originalHandler:o};a.push(d)}),this._eventHandlers.push(...a),a.length==1?a[0]:a}off(t,e){return this._eventHandlers&&(this._eventHandlers=this._eventHandlers.filter(o=>o.event===t&&(!e||o.handler===e||o.originalHandler===e)?(o.el.removeEventListener(t,o.handler),!1):!0)),this}remove(){return Array.from(this).forEach(t=>t.remove()),this}addClass(t){let e=t.split(" ");return Array.from(this).forEach(o=>o.classList.add(...e)),this}removeClass(t){let e=t.split(" ");return Array.from(this).forEach(o=>o.classList.remove(...e)),this}html(t){if(t!==void 0)return Array.from(this).forEach(e=>e.innerHTML=t),this;if(this.length)return this[0].innerHTML}outerHTML(t){if(t!==void 0)return Array.from(this).forEach(e=>e.outerHTML=t),this;if(this.length)return this[0].outerHTML}text(t){return t!==void 0?(Array.from(this).forEach(e=>e.textContent=t),this):Array.from(this).map(e=>this.getTextContentRecursive(e.childNodes)).join("")}value(t){return t!==void 0?(Array.from(this).forEach(e=>{(e instanceof HTMLInputElement||e instanceof HTMLSelectElement||e instanceof HTMLTextAreaElement)&&(e.value=t)}),this):Array.from(this).map(e=>{if(e instanceof HTMLInputElement||e instanceof HTMLSelectElement||e instanceof HTMLTextAreaElement)return e.value})}val(...t){return this.value(...t)}getTextContentRecursive(t){return Array.from(t).map(e=>{if(e.nodeType===Node.TEXT_NODE)return e.nodeValue;if(e.nodeName==="SLOT"){let o=e.assignedNodes({flatten:!0});return this.getTextContentRecursive(o)}else return this.getTextContentRecursive(e.childNodes)}).join("")}css(t,e){if(typeof t=="object")Object.entries(t).forEach(([o,n])=>{Array.from(this).forEach(a=>a.style[o]=n)});else if(e!==void 0)Array.from(this).forEach(o=>o.style[t]=e);else if(this.length)return this[0].style[t];return this}attr(t,e){if(typeof t=="object")Object.entries(t).forEach(([o,n])=>{Array.from(this).forEach(a=>a.setAttribute(o,n))});else if(e!==void 0)Array.from(this).forEach(o=>o.setAttribute(t,e));else if(this.length)return this[0].getAttribute(t);return this}each(t){return Array.from(this).forEach((e,o)=>{t.call(e,new r(e),o)}),this}get(t){return t!==void 0?this[t]:Array.from(this)}eq(t){return new r(this[t])}textNode(){return Array.from(this).map(t=>Array.from(t.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE).map(e=>e.nodeValue).join("")).join("")}};function X(r,t=document){return new _t(r,t)}var it=class extends M{constructor(t){if(super(t),this.it=f,t.type!==V.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===f||t==null)return this._t=void 0,this.it=t;if(t===$)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;let e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};it.directiveName="unsafeHTML",it.resultType=1;var Ae=k(it);var Ot=class extends S{constructor(t){super(t),this.reaction=null}render(t,e){this.reaction&&this.reaction.stop();let o;return this.reaction=x.create(n=>{if(!this.isConnected){n.stop();return}o=t(),e.unsafeHTML&&(o=Ae(o)),n.firstRun||this.setValue(o)}),o}disconnected(){this.reaction&&(this.reaction.stop(),this.reaction=null)}reconnected(){}},$e=k(Ot);var Ut=class extends S{constructor(t){super(t),this.reaction=null}render(t){this.reaction&&this.reaction.stop();let e=f;return this.reaction=x.create(o=>{if(!this.isConnected){o.stop();return}if(t.condition())e=t.content();else if(t.branches?.length){let n=!1;y(t.branches,a=>{(!n&&a.type=="elseif"&&a.condition()||!n&&a.type=="else")&&(n=!0,e=a.content())})}else e=$;return o.firstRun||this.setValue(e),e}),e}disconnected(){this.reaction&&(this.reaction.stop(),this.reaction=null)}reconnected(){}},_e=k(Ut);var Ee=(r,t,e)=>{let o=new Map;for(let n=t;n<=e;n++)o.set(r[n],n);return o},Se=k(class extends M{constructor(r){if(super(r),r.type!==V.CHILD)throw Error("repeat() can only be used in text expressions")}dt(r,t,e){let o;e===void 0?e=t:t!==void 0&&(o=t);let n=[],a=[],i=0;for(let c of r)n[i]=o?o(c,i):i,a[i]=e(c,i),i++;return{values:a,keys:n}}render(r,t,e){return this.dt(r,t,e).values}update(r,[t,e,o]){let n=ye(r),{values:a,keys:i}=this.dt(t,e,o);if(!Array.isArray(n))return this.ut=i,a;let c=this.ut??=[],s=[],d,l,b=0,p=n.length-1,v=0,u=a.length-1;for(;b<=p&&v<=u;)if(n[b]===null)b++;else if(n[p]===null)p--;else if(c[b]===i[v])s[v]=D(n[b],a[v]),b++,v++;else if(c[p]===i[u])s[u]=D(n[p],a[u]),p--,u--;else if(c[b]===i[u])s[u]=D(n[b],a[u]),K(r,s[u+1],n[b]),b++,u--;else if(c[p]===i[v])s[v]=D(n[p],a[v]),K(r,n[b],n[p]),p--,v++;else if(d===void 0&&(d=Ee(i,v,u),l=Ee(c,b,p)),d.has(c[b]))if(d.has(c[p])){let m=l.get(i[v]),h=m!==void 0?n[m]:null;if(h===null){let g=K(r,n[b]);D(g,a[v]),s[v]=g}else s[v]=D(h,a[v]),K(r,n[b],h),n[m]=null;v++}else At(n[p]),p--;else At(n[b]),b++;for(;v<=u;){let m=K(r,s[u+1]);D(m,a[v]),s[v++]=m}for(;b<=p;){let m=n[b++];m!==null&&At(m)}return this.ut=i,we(r,s),$}});var It=class extends S{constructor(t){super(t),this.reaction=null,this.parts=new Map}render(t,e){let o=this.createRepeat(t,e);return this.reaction||(this.reaction=x.create(n=>{if(!this.isConnected){n.stop();return}let a=this.getItems(t);if(this.firstRun)return;let i=this.createRepeat(t,e,a);this.setValue(i)})),o}getItems(t){let e=t.over()||[];return e=e.map(o=>(W(o)&&(o._id=o._id||Dt(o)),o)),e}createRepeat(t,e,o=this.getItems(t)){return o?.length?Se(o,this.getPartID,(n,a)=>{let i=this.parts.get(this.getPartID(n));return i||(i=this.getPartContent(n,a,e,t),this.parts.set(this.getPartID(n),i),i)}):f}getPartContent(t,e,o,n){let a=this.prepareEachData(t,e,o,n.as);return n.content(a)}getPartID(t){if(W(t))return t._id||t.id||t.key||t.hash||Dt(t);if(de)return t}prepareEachData(t,e,o,n){return n?{...o,[n]:t,"@index":e}:{...o,...t,"@index":e}}disconnected(){this.reaction&&(this.reaction.stop(),this.reaction=null)}},Ce=k(It);var Ft=class extends S{constructor(t){super(t),this.renderRoot=t.options.host.renderRoot,this.template=null,this.part=null}render({getTemplateName:t,subTemplates:e,data:o,parentTemplate:n}){let a=()=>{let l=t();return e[l]},i=(l,b)=>l.render(b),c=l=>H(l,b=>b());x.create(l=>{if(!this.isConnected){l.stop();return}let b=a(),p=c(o);if(b){this.template=b;let{parentNode:v,startNode:u,endNode:m}=this.part,h=this.part.options.host?.renderRoot;b.attach(h,{parentNode:v,startNode:u,endNode:m})}n&&b.setParent(n),l.firstRun||this.setValue(i(b,p))});let s=a(),d=c(o);return i(s,d)}update(t,e){return this.part=t,this.render.apply(this,e)}reconnected(){}disconnected(){this.template&&this.template.onDestroyed()}},ze=k(Ft);var Te={is:(r,t)=>r==t,not:r=>!r,isEqual:(r,t)=>r==t,maybePlural(r,t="s"){return r==1?"":t},isNotEqual:(r,t)=>r!=t,isExactlyEqual:(r,t)=>r===t,isNotExactlyEqual:(r,t)=>r!==t,greaterThan:(r,t)=>r>t,lessThan:(r,t)=>r<t,greaterThanEquals:(r,t)=>r>=t,lessThanEquals:(r,t)=>r<=t,numberFromIndex:r=>r+1,formatDate:(r=new Date,t="L")=>wt(r,t),formatDateTime:(r=new Date,t="LLL")=>wt(r,t),formatDateTimeSeconds:(r=new Date,t="LTS")=>wt(r,t),object:({obj:r})=>r,log(...r){console.log(...r)},debugger:()=>{debugger}};var Et=class r{static helpers=Te;static addHelper(t,e){r.helpers[t]=e}constructor({ast:t,data:e,subTemplates:o}){this.ast=t||"",this.data=e,this.subTemplates=o,this.resetHTML()}resetHTML(){this.html=[],this.html.raw=[],this.expressions=[]}render({ast:t=this.ast,data:e=this.data}={}){return this.resetHTML(),this.readAST({ast:t,data:e}),this.clearTemp(),this.litTemplate=ae.apply(this,[this.html,...this.expressions]),this.litTemplate}readAST({ast:t=this.ast,data:e=this.data}={}){y(t,o=>{switch(o.type){case"html":this.addHTML(o.html);break;case"expression":let n=this.evaluateExpression(o.value,e,{unsafeHTML:o.unsafeHTML,asDirective:!0});this.addValue(n);break;case"if":this.addValue(this.evaluateConditional(o,e));break;case"each":this.addValue(this.evaluateEach(o,e));break;case"template":this.addValue(this.evaluateTemplate(o,e));break;case"slot":o.name?this.addHTML(`<slot name="${o.name}"></slot>`):this.addHTML("<slot></slot>");break}})}evaluateConditional(t,e){let o=(a,i)=>i=="branches"?a.map(c=>H(c,o)):i=="condition"?()=>this.evaluateExpression(a,e):i=="content"?()=>this.renderContent({ast:a,data:e}):a,n=H(t,o);return _e(n)}evaluateEach(t,e){let n=H(t,(a,i)=>i=="over"?(console.log(this.evaluateExpression(a,e)),()=>this.evaluateExpression(a,e)):i=="content"?c=>this.renderContent({ast:a,data:c}):a);return Ce(n,e)}evaluateTemplate(t,e={}){let o=s=>this.evaluateExpression(s,e),n=()=>o(t.name),a=H(t.data||{},s=>()=>x.nonreactive(()=>o(s))),i=H(t.reactiveData||{},s=>()=>o(s)),c={...a,...i};return ze({subTemplates:this.subTemplates,getTemplateName:n,data:c,parentTemplate:e})}evaluateExpression(t,e=this.data,{asDirective:o=!1,unsafeHTML:n=!1}={}){return typeof t=="string"?o?$e(()=>this.lookupExpressionValue(t,e),{unsafeHTML:n}):this.lookupExpressionValue(t,e):t}lookupExpressionValue(t="",e={},{unsafeHTML:o=!1}={}){let n=/^\'(.*)\'$/,a=t.match(n);if(a&&a.length>0)return a[1];let i=t.split(" ").reverse(),c=[],s;return y(i,(d,l)=>{let b=(h,g)=>g.split(".").reduce((_,Bt)=>ve(_)()[Bt],h),p=()=>{let h=d.split(".").slice(0,-1).join(".");return b(e,h)},v=b(e,d),u=r.helpers[d];!v&&E(u)&&(v=u);let m;E(v)?s=v.bind(p())(...c):v?s=v?.constructor.name==="_ReactiveVar"?v.value:v:(m=n.exec(d))!==null&&m.length>1?s=m[1]:Number.isNaN(parseFloat(d))?s=void 0:s=Number(d),c.unshift(s)}),s}addHTML(t){this.lastHTML&&(t=`${this.html.pop()}${t}`),this.html.push(t),this.html.raw.push(String.raw({raw:t})),this.lastHTML=!0}addHTMLSpacer(){this.addHTML("")}addValue(t){this.addHTMLSpacer(),this.expressions.push(t),this.lastHTML=!1,this.addHTMLSpacer()}renderContent({ast:t,data:e,subTemplates:o}){return new r({ast:t,data:e,subTemplates:this.subTemplates}).render()}clearTemp(){delete this.lastHTML}};var St=class{static templateCount=0;constructor({templateName:t,ast:e,template:o,data:n,css:a,events:i,subTemplates:c,createInstance:s,parentTemplate:d,onCreated:l=C,onRendered:b=C,onDestroyed:p=C}){e||(e=new B(o).compile()),this.events=i,this.ast=e,this.css=a,this.data=n||{},this.templateName=t||this.getGenericTemplateName(),this.subTemplates=c,this.createInstance=s,this.onRenderedCallback=b,this.onDestroyedCallback=p,this.onCreatedCallback=l}setParent(t){return this.parentTemplate=t}getGenericTemplateName(){return St.templateCount++,`Anonymous #${St.templateCount}`}initialize(){let t=this;E(this.createInstance)&&(this.tpl={},t=this.call(this.createInstance),ge(this.tpl,t),console.log("instance created",this.tpl)),this.tpl.reaction=this.reaction,this.tpl.templateName=this.templateName,this.tpl.parent=()=>this.parentTemplate,this.onCreated=()=>{console.log("oncreated called"),this.call(this.onCreatedCallback.bind(this))},this.onFirstRender=()=>{this.call(this.onFirstRenderCallback.bind(this))},this.onRendered=()=>{this.call(this.onRenderedCallback.bind(this))},this.onDestroyed=()=>{this.rendered=!1,this.clearReactions(),this.removeEvents(),this.call(this.onDestroyedCallback.bind(this))},this.renderer=new Et({ast:this.ast,data:this.getDataContext(),subTemplates:this.subTemplates})}async attach(t,{parentNode:e=t,startNode:o,endNode:n}={}){this.renderRoot=t,this.parentNode=e,this.startNode=o,this.endNode=n,this.attachEvents(),await this.attachStyles()}getDataContext(){return{...this.tpl,...this.data}}async attachStyles(){if(!this.css||!this.renderRoot||!this.renderRoot.adoptedStyleSheets)return;let t=this.css;this.stylesheet||(this.stylesheet=new CSSStyleSheet,await this.stylesheet.replace(t)),Array.from(this.renderRoot.adoptedStyleSheets).some(n=>N(n.cssRules,this.stylesheet.cssRules))||(this.renderRoot.adoptedStyleSheets=[...this.renderRoot.adoptedStyleSheets,this.stylesheet])}attachEvents(t=this.events){(!this.parentNode||!this.renderRoot)&&Ht("You must set a parent before attaching events");let e=o=>{let n=o.split(" "),a=n[0];n.shift();let i=n.join(" ");return{eventName:a,selector:i}};this.eventController=new AbortController,y(t,(o,n)=>{let{eventName:a,selector:i}=e(n),c=this;X(this.renderRoot).on(a,i,s=>{if(!this.isNodeInTemplate(s.target))return;let d=o.bind(s.target);c.call(d,{firstArg:s,additionalArgs:[s.target.dataset]})},this.eventController)})}isNodeInTemplate(t){return((n,a=this.startNode,i=this.endNode)=>{if(!a||!i)return!0;let c=a.compareDocumentPosition(n),s=i.compareDocumentPosition(n),d=(c&Node.DOCUMENT_POSITION_FOLLOWING)!==0,l=(s&Node.DOCUMENT_POSITION_PRECEDING)!==0;return d&&l})((n=>{for(;n&&n.parentNode!==this.parentNode;)n=n.parentNode;return n})(t))}attachEvent(t,e){}removeEvents(){this.eventController.abort()}render(t={}){this.renderer||(this.initialize(),console.log("finished initializing"),this.onCreated());let e=this.renderer.render({data:{...this.getDataContext(),...t}});return this.rendered||this.onRendered(),this.rendered=!0,e}$(t){return this.renderRoot||Ht("Cannot query DOM unless render root specified."),X(t,this.renderRoot)}call(t,{firstArg:e,additionalArgs:o,args:n=[this.tpl,this.$.bind(this)]}={}){if(e&&n.unshift(e),o&&n.push(...o),E(t))return t.apply(this,n)}reaction(t){this.reactions||(this.reactions=[]),this.reactions.push(x.create(t))}clearReactions(){y(this.reactions||[],t=>t.stop())}};var st=class extends R{static scopedStyleSheet=null;useLight=!1;createRenderRoot(){return this.useLight=this.getAttribute("expose")!==null,this.useLight?(this.applyScopedStyles(this.tagName,this.css),this.storeOriginalContent.apply(this),this):super.createRenderRoot(this.css)}applyScopedStyles(t,e){if(!this.scopedStyleSheet){let o=Ct(e,t);this.scopedStyleSheet=new CSSStyleSheet,this.scopedStyleSheet.replaceSync(o)}document.adoptedStyleSheets=[...document.adoptedStyleSheets,this.scopedStyleSheet]}storeOriginalContent(){this.originalDOM=document.createElement("template"),this.originalDOM.innerHTML=this.innerHTML,this.innerHTML=""}slotContent(){this.$("slot").each(e=>{let o;if(e.attr("name")){let n=e.attr("name"),a=this.$$(`[slot="${n}"]`);a.length&&(o=a.outerHTML())}else{let n=this.$$(this.originalDOM.content),i=n.children().not("[slot]").html()||"",c=n.textNode()||"";o=i+c}e&&o&&e.html(o)})}firstUpdated(){super.firstUpdated()}updated(){super.updated(),this.useLight&&this.slotContent()}get defaultSettings(){return{}}$(t){return this.renderRoot||console.error("Cannot query DOM until element has rendered."),X(t,this?.renderRoot)}$$(t){return X(t,this.originalDOM.content)}call(t,{firstArg:e,additionalArgs:o,args:n=[this.tpl,this.$.bind(this)]}={}){if(e&&n.unshift(e),o&&n.push(...o),E(t))return t.apply(this,n)}};var Yt=({renderer:r="lit",template:t="",css:e=!1,spec:o=!1,templateName:n,tagName:a,events:i={},createInstance:c=C,onCreated:s=C,onRendered:d=C,onDestroyed:l=C,onAttributeChanged:b=C,subTemplates:p=[],beforeRendered:v=C}={})=>{let m=new B(t).compile(),h;a=="ui-button"&&(h={settings:{size:["mini","tiny","small","medium","large","huge","massive"],emphasis:["primary","secondary"],icon:["icon"],labeled:["right-labeled",["labeled","left-labeled"]]}});let g=new St({templateName:n||pe(a),ast:m,css:e,events:i,subTemplates:p,onCreated:s,onRendered:d,onDestroyed:l,createInstance:c}),_;return a&&(_=class extends st{static get styles(){return ut(e)}static get properties(){return a=="ui-button"?{size:{type:String,observe:!0,reflect:!1},emphasis:{type:String,observe:!0,reflect:!1},small:{type:Boolean,reflect:!1},large:{type:Boolean,reflect:!1},primary:{type:Boolean,reflect:!1},secondary:{type:Boolean,reflect:!1},class:{type:String}}:{}}constructor(){super(),this.css=e,this.tpl=g.tpl,this.template=g}connectedCallback(){super.connectedCallback(),g.attach(this.renderRoot),this.call(v)}firstUpdated(){super.firstUpdated(),this.call(d)}disconnectedCallback(){super.disconnectedCallback(),g.removeEvents(),this.call(l)}adoptedCallback(){super.adoptedCallback(),this.call(onMoved)}attributeChangedCallback(w,P,A){this.adjustSettingFromAttribute(w,A),this.call(b,{args:[w,P,A]}),super.attributeChangedCallback(w,P,A)}adjustSettingFromAttribute(w,P){let A=h;if(w=="class")y(P.split(" "),z=>{this.adjustSettingFromAttribute(z)});else if(!yt(A.attribute,w)){let z=yt(me(A.settings),w);if(z){let Ne=this[z];this[z]=w,this.attributeChangedCallback(z,Ne,w)}}}getSettings(){let w={};return y(_.properties,(P,A)=>{A=="class"||!P.observe||(w[A]=this[A],w[this[A]]||(w[this[A]]=!0))}),w}getUIClasses(){let w=[];return y(_.properties,(A,z)=>{z=="class"||!A.observe||w.push(this[z])}),he(w).filter(Boolean).join(" ")}getDataContext(){return{...this.tpl,...this.getSettings(),ui:this.getUIClasses()}}render(){return g.render(this.getDataContext())}},customElements.define(a,_)),a?_:g};var Le=`/* src/button/css/content/button.css */
@layer component {
  .button {
    cursor: pointer;
    display: inline-block;
    min-height: 1em;
    font-size: var(--medium);
    border: none;
    vertical-align: var(--vertical-align);
    background: var(--background);
    color: var(--text-color);
    font-family: var(--font-family);
    margin: 0em var(--horizontal-margin) var(--vertical-margin) 0em;
    padding: var(--vertical-padding) var(--horizontal-padding) calc(var(--vertical-padding) + var(--shadow-offset));
    text-transform: var(--text-transform);
    text-shadow: var(--text-shadow);
    font-weight: var(--font-weight);
    line-height: var(--line-height);
    font-style: normal;
    text-align: center;
    text-decoration: none;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    user-select: none;
    transition: var(--transition);
    will-change: var(--will-change);
    -webkit-tap-highlight-color: var(--tap-color);
    outline: none;
  }
}

/* src/button/css/group/buttons.css */
@layer component {
  .buttons {
    display: inline-flex;
    flex-direction: row;
    font-size: 0em;
    vertical-align: baseline;
    margin: var(--vertical-margin) var(--horizontal-margin) 0em 0em;
  }
  :scope:not(.basic):not(.inverted) {
    box-shadow: var(--group-box-shadow);
  }
  &::after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .buttons .button {
    flex: 1 0 auto;
    border-radius: 0em;
    margin: var(--group-button-offset);
  }
  .buttons > .button:not(.basic):not(.inverted),
  .buttons:not(.basic):not(.inverted) > .button {
    box-shadow: var(--group-button-box-shadow);
  }
  .buttons .button:first-child {
    border-left: none;
    margin-left: 0em;
    border-top-left-radius: var(--border-radius);
    border-bottom-left-radius: var(--border-radius);
  }
  .buttons .button:last-child {
    border-top-right-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
  }
}

/* src/button/css/types/animated.css */
@layer component {
  .animated.button {
    position: relative;
    overflow: hidden;
    padding-right: 0em !important;
    vertical-align: var(--animated-vertical-align);
    z-index: var(--animated-z-index);
  }
  .animated.button .content {
    will-change: transform, opacity;
  }
  .animated.button .visible.content {
    position: relative;
    margin-right: var(--horizontal-padding);
  }
  .animated.button .hidden.content {
    position: absolute;
    width: 100%;
  }
  .animated.button .visible.content,
  .animated.button .hidden.content {
    transition: right var(--animation-duration) var(--animation-easing) 0s;
  }
  .animated.button .visible.content {
    left: auto;
    right: 0%;
  }
  .animated.button .hidden.content {
    top: 50%;
    left: auto;
    right: -100%;
    margin-top: calc(var(--line-height) / 2 * -1);
  }
  .animated.button:focus .visible.content,
  .animated.button:hover .visible.content {
    left: auto;
    right: 200%;
  }
  .animated.button:focus .hidden.content,
  .animated.button:hover .hidden.content {
    left: auto;
    right: 0%;
  }
  .vertical.animated.button .visible.content,
  .vertical.animated.button .hidden.content {
    transition: top var(--animation-duration) var(--animation-easing), transform var(--animation-duration) var(--animation-easing);
  }
  .vertical.animated.button .visible.content {
    transform: translateY(0%);
    right: auto;
  }
  .vertical.animated.button .hidden.content {
    top: -50%;
    left: 0%;
    right: auto;
  }
  .vertical.animated.button:focus .visible.content,
  .vertical.animated.button:hover .visible.content {
    transform: translateY(200%);
    right: auto;
  }
  .vertical.animated.button:focus .hidden.content,
  .vertical.animated.button:hover .hidden.content {
    top: 50%;
    right: auto;
  }
  .fade.animated.button .visible.content,
  .fade.animated.button .hidden.content {
    transition: opacity var(--animation-duration) var(--animation-easing), transform var(--animation-duration) var(--animation-easing);
  }
  .fade.animated.button .visible.content {
    left: auto;
    right: auto;
    opacity: 1;
    transform: scale(1);
  }
  .fade.animated.button .hidden.content {
    opacity: 0;
    left: 0%;
    right: auto;
    transform: scale(var(--fade-scale-high));
  }
  .fade.animated.button:focus .visible.content,
  .fade.animated.button:hover .visible.content {
    left: auto;
    right: auto;
    opacity: 0;
    transform: scale(var(--fade-scale-low));
  }
  .fade.animated.button:focus .hidden.content,
  .fade.animated.button:hover .hidden.content {
    left: 0%;
    right: auto;
    opacity: 1;
    transform: scale(1);
  }
}

/* src/button/css/types/emphasis.css */
@layer component {
  .primary.buttons .button,
  .primary.button {
    background-color: var(--primary-color);
    color: var(--primary-text-color);
    text-shadow: var(--primary-text-shadow);
    background-image: var(--primary-background-image);
  }
  .primary.button {
    box-shadow: var(--primary-box-shadow);
  }
  .primary.buttons .button:hover,
  .primary.button:hover {
    background-color: var(--primary-color-hover);
    color: var(--primary-text-color);
    text-shadow: var(--primary-text-shadow);
  }
  .primary.buttons .button:focus,
  .primary.button:focus {
    background-color: var(--primary-color-focus);
    color: var(--primary-text-color);
    text-shadow: var(--primary-text-shadow);
  }
  .primary.buttons .button:active,
  .primary.button:active {
    background-color: var(--primary-color-down);
    color: var(--primary-text-color);
    text-shadow: var(--primary-text-shadow);
  }
  .primary.buttons .active.button,
  .primary.buttons .active.button:active,
  .primary.active.button,
  .primary.button .active.button:active {
    background-color: var(--primary-color-active);
    color: var(--primary-text-color);
    text-shadow: var(--primary-text-shadow);
  }
  .secondary.buttons .button,
  .secondary.button {
    background-color: var(--secondary-color);
    color: var(--secondary-text-color);
    text-shadow: var(--secondary-text-shadow);
    background-image: var(--colored-background-image);
  }
  .secondary.button {
    box-shadow: var(--colored-box-shadow);
  }
  .secondary.buttons .button:hover,
  .secondary.button:hover {
    background-color: var(--secondary-color-hover);
    color: var(--secondary-text-color);
    text-shadow: var(--secondary-text-shadow);
  }
  .secondary.buttons .button:focus,
  .secondary.button:focus {
    background-color: var(--secondary-color-focus);
    color: var(--secondary-text-color);
    text-shadow: var(--secondary-text-shadow);
  }
  .secondary.buttons .button:active,
  .secondary.button:active {
    background-color: var(--secondary-color-down);
    color: var(--secondary-text-color);
    text-shadow: var(--secondary-text-shadow);
  }
  .secondary.buttons .active.button,
  .secondary.buttons .active.button:active,
  .secondary.active.button,
  .secondary.button .active.button:active {
    background-color: var(--secondary-color-active);
    color: var(--secondary-text-color);
    text-shadow: var(--secondary-text-shadow);
  }
}

/* src/button/css/types/icon.css */
@layer component {
  .icon.buttons .button,
  .icon.button {
    padding: var(--vertical-padding) var(--vertical-padding) (var(--vertical-padding) + var(--shadow-offset));
  }
  .icon.buttons .button > .icon,
  .icon.button > .icon {
    opacity: var(--icon-button-opacity);
    margin: 0em !important;
    vertical-align: top;
  }
}

/* src/button/css/types/labeled.css */
@layer component {
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

/* src/button/css/types/labeled-icon.css */
@layer component {
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

/* src/button/css/types/toggle.css */
@layer component {
  .toggle.buttons .active.button,
  .buttons .button.toggle.active,
  .button.toggle.active {
    background-color: var(--positive-color) !important;
    box-shadow: none !important;
    text-shadow: var(--inverted-text-shadow);
    color: var(--inverted-text-color) !important;
  }
  .button.toggle.active:hover {
    background-color: var(--positive-color-hover) !important;
    text-shadow: var(--inverted-text-shadow);
    color: var(--inverted-text-color) !important;
  }
}

/* src/button/css/states/hover.css */
@layer component {
  .button:hover {
    background-color: var(--hover-background-color);
    background-image: var(--hover-background-image);
    box-shadow: var(--hover-box-shadow);
    color: var(--hover-color);
  }
  .button:hover .icon {
    opacity: var(--hover-icon-opacity);
  }
}

/* src/button/css/states/focus.css */
@layer component {
  .button:focus {
    background-color: var(--focus-background-color);
    color: var(--focus-color);
    background-image: var(--focus-background-image) !important;
    box-shadow: var(--focus-box-shadow) !important;
  }
  .button:focus .icon {
    opacity: var(--icon-focus-opacity);
  }
}

/* src/button/css/states/pressed.css */
@layer component {
  .button:active,
  .active.button:active {
    background-color: var(--pressed-background-color);
    background-image: var(--pressed-background-image);
    color: var(--pressed-color);
    box-shadow: var(--pressed-box-shadow);
  }
}

/* src/button/css/states/active.css */
@layer component {
  .active.button {
    background-color: var(--active-background-color);
    background-image: var(--active-background-image);
    box-shadow: var(--active-box-shadow);
    color: var(--active-color);
  }
  .active.button:hover {
    background-color: var(--active-hover-background-color);
    background-image: var(--active-hover-background-image);
    color: var(--active-hover-color);
    box-shadow: var(--active-hover-box-shadow);
  }
  .active.button:active {
    background-color: var(--active-down-background-color);
    background-image: var(--active-down-background-image);
    color: var(--active-down-color);
    box-shadow: var(--active-down-box-shadow);
  }
}

/* src/button/css/states/disabled.css */
@layer component {
  .disabled.button,
  .disabled.button:hover,
  .disabled.active.button {
    cursor: default;
    pointer-events: none !important;
    opacity: var(--disabled-opacity) !important;
    background-image: var(--disabled-background-image) !important;
    box-shadow: var(--disabled-background-image) !important;
  }
}

/* src/button/css/states/loading.css */
@layer component {
  .loading.button {
    position: relative;
    cursor: default;
    text-shadow: none !important;
    color: transparent !important;
    opacity: var(--loading-opacity);
    pointer-events: var(--loading-pointer-events);
    transition: var(--loading-transition);
  }
  .loading.button::before {
    position: absolute;
    content: "";
    top: 50%;
    left: 50%;
    margin: var(--loader-margin);
    width: var(--loader-size);
    height: var(--loader-size);
    border-radius: var(--circular-radius);
    border: var(--loader-line-width) solid var(--inverted-loader-fill-color);
  }
  .loading.button::after {
    position: absolute;
    content: "";
    top: 50%;
    left: 50%;
    margin: var(--loader-margin);
    width: var(--loader-size);
    height: var(--loader-size);
    animation: button-spin var(--loader-speed-linear);
    animation-iteration-count: infinite;
    border-radius: var(--circular-radius);
    border-color: var(--inverted-loader-line-color) transparent transparent;
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
}

/* src/button/css/variations/basic.css */
@layer component {
  .basic.buttons .button,
  .basic.button {
    background: var(--basic-background) !important;
    color: var(--basic-text-color) !important;
    font-weight: var(--basic-font-weight);
    border-radius: var(--basic-border-radius);
    text-transform: var(--basic-text-transform);
    text-shadow: none !important;
    box-shadow: var(--basic-box-shadow);
  }
  .basic.buttons {
    box-shadow: var(--basic-group-box-shadow);
    border: var(--basic-group-border);
    border-radius: var(--border-radius);
  }
  .basic.buttons .button {
    border-radius: 0em;
  }
  .basic.buttons .button:hover,
  .basic.button:hover {
    background: var(--basic-hover-background) !important;
    color: var(--basic-hover-text-color) !important;
    box-shadow: var(--basic-hover-box-shadow);
  }
  .basic.buttons .button:focus,
  .basic.button:focus {
    background: var(--basic-focus-background) !important;
    color: var(--basic-focus-text-color) !important;
    box-shadow: var(--basic-focus-box-shadow);
  }
  .basic.buttons .button:active,
  .basic.button:active {
    background: var(--basic-down-background) !important;
    color: var(--basic-down-text-color) !important;
    box-shadow: var(--basic-down-box-shadow);
  }
  .basic.buttons .active.button,
  .basic.active.button {
    background: var(--basic-active-background) !important;
    box-shadow: var(--basic-active-box-shadow) !important;
    color: var(--basic-active-text-color) !important;
  }
  .basic.buttons .active.button:hover,
  .basic.active.button:hover {
    background-color: var(--transparent-black);
  }
  .basic.buttons .button:hover {
    box-shadow: var(--basic-hover-box-shadow) inset;
  }
  .basic.buttons .button:active {
    box-shadow: var(--basic-down-box-shadow) inset;
  }
  .basic.buttons .active.button {
    box-shadow: var(--basic-active-box-shadow) !important;
  }
  .basic.inverted.buttons .button,
  .basic.inverted.button {
    background-color: transparent !important;
    color: var(--off-white) !important;
    box-shadow: var(--basic-inverted-box-shadow) !important;
  }
  .basic.inverted.buttons .button:hover,
  .basic.inverted.button:hover {
    color: var(--white) !important;
    box-shadow: var(--basic-inverted-hover-box-shadow) !important;
  }
  .basic.inverted.buttons .button:focus,
  .basic.inverted.button:focus {
    color: var(--white) !important;
    box-shadow: var(--basic-inverted-focus-box-shadow) !important;
  }
  .basic.inverted.buttons .button:active,
  .basic.inverted.button:active {
    background-color: var(--transparent-white) !important;
    color: var(--white) !important;
    box-shadow: var(--basic-inverted-down-box-shadow) !important;
  }
  .basic.inverted.buttons .active.button,
  .basic.inverted.active.button {
    background-color: var(--transparent-white);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
    box-shadow: var(--basic-inverted-active-box-shadow);
  }
  .basic.inverted.buttons .active.button:hover,
  .basic.inverted.active.button:hover {
    background-color: var(--strong-transparent-white);
    box-shadow: var(--basic-inverted-hover-box-shadow) !important;
  }
  .basic.buttons .button {
    border-left: var(--basic-group-border);
    box-shadow: none;
  }
  .basic.vertical.buttons .button {
    border-left: none;
  }
  .basic.vertical.buttons .button {
    border-left-width: 0px;
    border-top: var(--basic-group-border);
  }
  .basic.vertical.buttons .button:first-child {
    border-top-width: 0px;
  }
}

/* src/button/css/variations/attached.css */
@layer component {
  .attached.button {
    position: relative;
    display: block;
    margin: 0em;
    border-radius: 0em;
    box-shadow: var(--attached-box-shadow) !important;
  }
  .attached.top.button {
    border-radius: var(--border-radius) var(--border-radius) 0em 0em;
  }
  .attached.bottom.button {
    border-radius: 0em 0em var(--border-radius) var(--border-radius);
  }
  .left.attached.button {
    display: inline-block;
    border-left: none;
    text-align: right;
    padding-right: var(--attached-horizontal-padding);
    border-radius: var(--border-radius) 0em 0em var(--border-radius);
  }
  .right.attached.button {
    display: inline-block;
    text-align: left;
    padding-left: var(--attached-horizontal-padding);
    border-radius: 0em var(--border-radius) var(--border-radius) 0em;
  }
  .attached.buttons {
    position: relative;
    display: flex;
    border-radius: 0em;
    width: auto !important;
    z-index: var(--attached-z-index);
    margin-left: var(--attached-offset);
    margin-right: var(--attached-offset);
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
  [class*="top attached"].buttons {
    margin-bottom: var(--attached-offset);
    border-radius: var(--border-radius) var(--border-radius) 0em 0em;
  }
  [class*="top attached"].buttons .button:first-child {
    border-radius: var(--border-radius) 0em 0em 0em;
  }
  [class*="top attached"].buttons .button:last-child {
    border-radius: 0em var(--border-radius) 0em 0em;
  }
  [class*="bottom attached"].buttons {
    margin-top: var(--attached-offset);
    border-radius: 0em 0em var(--border-radius) var(--border-radius);
  }
  [class*="bottom attached"].buttons .button:first-child {
    border-radius: 0em 0em 0em var(--border-radius);
  }
  [class*="bottom attached"].buttons .button:last-child {
    border-radius: 0em 0em var(--border-radius) 0em;
  }
  [class*="left attached"].buttons {
    display: inline-flex;
    margin-right: 0em;
    margin-left: var(--attached-offset);
    border-radius: 0em var(--border-radius) var(--border-radius) 0em;
  }
  [class*="left attached"].buttons .button:first-child {
    margin-left: var(--attached-offset);
    border-radius: 0em var(--border-radius) 0em 0em;
  }
  [class*="left attached"].buttons .button:last-child {
    margin-left: var(--attached-offset);
    border-radius: 0em 0em var(--border-radius) 0em;
  }
  [class*="right attached"].buttons {
    display: inline-flex;
    margin-left: 0em;
    margin-right: var(--attached-offset);
    border-radius: var(--border-radius) 0em 0em var(--border-radius);
  }
  [class*="right attached"].buttons .button:first-child {
    margin-left: var(--attached-offset);
    border-radius: var(--border-radius) 0em 0em 0em;
  }
  [class*="right attached"].buttons .button:last-child {
    margin-left: var(--attached-offset);
    border-radius: 0em 0em 0em var(--border-radius);
  }
}

/* src/button/css/variations/circular.css */
@layer component {
  .circular.button {
    border-radius: 10em;
  }
  .circular.button > .icon {
    width: 1em;
    vertical-align: baseline;
  }
}

/* src/button/css/variations/colored.css */
@layer component {
  .black.buttons .button,
  .black.button {
    background-color: var(--black);
    color: var(--black-text-color);
    text-shadow: var(--black-text-shadow);
    background-image: var(--colored-background-image);
  }
  .black.button {
    box-shadow: var(--colored-box-shadow);
  }
  .black.buttons .button:hover,
  .black.button:hover {
    background-color: var(--black-hover);
    color: var(--black-text-color);
    text-shadow: var(--black-text-shadow);
  }
  .black.buttons .button:focus,
  .black.button:focus {
    background-color: var(--black-focus);
    color: var(--black-text-color);
    text-shadow: var(--black-text-shadow);
  }
  .black.buttons .button:active,
  .black.button:active {
    background-color: var(--black-down);
    color: var(--black-text-color);
    text-shadow: var(--black-text-shadow);
  }
  .black.buttons .active.button,
  .black.buttons .active.button:active,
  .black.active.button,
  .black.button .active.button:active {
    background-color: var(--black-active);
    color: var(--black-text-color);
    text-shadow: var(--black-text-shadow);
  }
  .basic.black.buttons .button,
  .basic.black.button {
    box-shadow: 0px 0px 0px var(--basic-border-size) var(--black) inset !important;
    color: var(--black) !important;
  }
  .basic.black.buttons .button:hover,
  .basic.black.button:hover {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--black-hover) inset !important;
    color: var(--black-hover) !important;
  }
  .basic.black.buttons .button:focus,
  .basic.black.button:focus {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--black-focus) inset !important;
    color: var(--black-hover) !important;
  }
  .basic.black.buttons .active.button,
  .basic.black.active.button {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--black-active) inset !important;
    color: var(--black-down) !important;
  }
  .basic.black.buttons .button:active,
  .basic.black.button:active {
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--black-down) inset !important;
    color: var(--black-down) !important;
  }
  .buttons:not(.vertical) > .basic.black.button:not(:first-child) {
    margin-left: var(--basic-colored-border-size);
  }
  .inverted.black.buttons .button,
  .inverted.black.button {
    background-color: transparent;
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--solid-border-color) inset !important;
    color: var(--inverted-text-color);
  }
  .inverted.black.buttons .button:hover,
  .inverted.black.button:hover,
  .inverted.black.buttons .button:focus,
  .inverted.black.button:focus,
  .inverted.black.buttons .button.active,
  .inverted.black.button.active,
  .inverted.black.buttons .button:active,
  .inverted.black.button:active {
    box-shadow: none !important;
    color: var(--light-black-text-color);
  }
  .inverted.black.buttons .button:hover,
  .inverted.black.button:hover {
    background-color: var(--light-black-hover);
  }
  .inverted.black.buttons .button:focus,
  .inverted.black.button:focus {
    background-color: var(--light-black-focus);
  }
  .inverted.black.buttons .active.button,
  .inverted.black.active.button {
    background-color: var(--light-black-active);
  }
  .inverted.black.buttons .button:active,
  .inverted.black.button:active {
    background-color: var(--light-black-down);
  }
  .inverted.black.basic.buttons .button,
  .inverted.black.buttons .basic.button,
  .inverted.black.basic.button {
    background-color: transparent;
    box-shadow: var(--basic-inverted-box-shadow) !important;
    color: var(--white) !important;
  }
  .inverted.black.basic.buttons .button:hover,
  .inverted.black.buttons .basic.button:hover,
  .inverted.black.basic.button:hover {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-black-hover) inset !important;
    color: var(--white) !important;
  }
  .inverted.black.basic.buttons .button:focus,
  .inverted.black.basic.buttons .button:focus,
  .inverted.black.basic.button:focus {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-black-focus) inset !important;
    color: var(--light-black) !important;
  }
  .inverted.black.basic.buttons .active.button,
  .inverted.black.buttons .basic.active.button,
  .inverted.black.basic.active.button {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-black-active) inset !important;
    color: var(--white) !important;
  }
  .inverted.black.basic.buttons .button:active,
  .inverted.black.buttons .basic.button:active,
  .inverted.black.basic.button:active {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-black-down) inset !important;
    color: var(--white) !important;
  }
  .grey.buttons .button,
  .grey.button {
    background-color: var(--grey);
    color: var(--grey-text-color);
    text-shadow: var(--grey-text-shadow);
    background-image: var(--colored-background-image);
  }
  .grey.button {
    box-shadow: var(--colored-box-shadow);
  }
  .grey.buttons .button:hover,
  .grey.button:hover {
    background-color: var(--grey-hover);
    color: var(--grey-text-color);
    text-shadow: var(--grey-text-shadow);
  }
  .grey.buttons .button:focus,
  .grey.button:focus {
    background-color: var(--grey-focus);
    color: var(--grey-text-color);
    text-shadow: var(--grey-text-shadow);
  }
  .grey.buttons .button:active,
  .grey.button:active {
    background-color: var(--grey-down);
    color: var(--grey-text-color);
    text-shadow: var(--grey-text-shadow);
  }
  .grey.buttons .active.button,
  .grey.buttons .active.button:active,
  .grey.active.button,
  .grey.button .active.button:active {
    background-color: var(--grey-active);
    color: var(--grey-text-color);
    text-shadow: var(--grey-text-shadow);
  }
  .basic.grey.buttons .button,
  .basic.grey.button {
    box-shadow: 0px 0px 0px var(--basic-border-size) var(--grey) inset !important;
    color: var(--grey) !important;
  }
  .basic.grey.buttons .button:hover,
  .basic.grey.button:hover {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--grey-hover) inset !important;
    color: var(--grey-hover) !important;
  }
  .basic.grey.buttons .button:focus,
  .basic.grey.button:focus {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--grey-focus) inset !important;
    color: var(--grey-hover) !important;
  }
  .basic.grey.buttons .active.button,
  .basic.grey.active.button {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--grey-active) inset !important;
    color: var(--grey-down) !important;
  }
  .basic.grey.buttons .button:active,
  .basic.grey.button:active {
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--grey-down) inset !important;
    color: var(--grey-down) !important;
  }
  .buttons:not(.vertical) > .basic.grey.button:not(:first-child) {
    margin-left: var(--basic-colored-border-size);
  }
  .inverted.grey.buttons .button,
  .inverted.grey.button {
    background-color: transparent;
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--solid-border-color) inset !important;
    color: var(--inverted-text-color);
  }
  .inverted.grey.buttons .button:hover,
  .inverted.grey.button:hover,
  .inverted.grey.buttons .button:focus,
  .inverted.grey.button:focus,
  .inverted.grey.buttons .button.active,
  .inverted.grey.button.active,
  .inverted.grey.buttons .button:active,
  .inverted.grey.button:active {
    box-shadow: none !important;
    color: var(--light-grey-text-color);
  }
  .inverted.grey.buttons .button:hover,
  .inverted.grey.button:hover {
    background-color: var(--light-grey-hover);
  }
  .inverted.grey.buttons .button:focus,
  .inverted.grey.button:focus {
    background-color: var(--light-grey-focus);
  }
  .inverted.grey.buttons .active.button,
  .inverted.grey.active.button {
    background-color: var(--light-grey-active);
  }
  .inverted.grey.buttons .button:active,
  .inverted.grey.button:active {
    background-color: var(--light-grey-down);
  }
  .inverted.grey.basic.buttons .button,
  .inverted.grey.buttons .basic.button,
  .inverted.grey.basic.button {
    background-color: transparent;
    box-shadow: var(--basic-inverted-box-shadow) !important;
    color: var(--white) !important;
  }
  .inverted.grey.basic.buttons .button:hover,
  .inverted.grey.buttons .basic.button:hover,
  .inverted.grey.basic.button:hover {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-grey-hover) inset !important;
    color: var(--white) !important;
  }
  .inverted.grey.basic.buttons .button:focus,
  .inverted.grey.basic.buttons .button:focus,
  .inverted.grey.basic.button:focus {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-grey-focus) inset !important;
    color: var(--light-grey) !important;
  }
  .inverted.grey.basic.buttons .active.button,
  .inverted.grey.buttons .basic.active.button,
  .inverted.grey.basic.active.button {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-grey-active) inset !important;
    color: var(--white) !important;
  }
  .inverted.grey.basic.buttons .button:active,
  .inverted.grey.buttons .basic.button:active,
  .inverted.grey.basic.button:active {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-grey-down) inset !important;
    color: var(--white) !important;
  }
  .brown.buttons .button,
  .brown.button {
    background-color: var(--brown);
    color: var(--brown-text-color);
    text-shadow: var(--brown-text-shadow);
    background-image: var(--colored-background-image);
  }
  .brown.button {
    box-shadow: var(--colored-box-shadow);
  }
  .brown.buttons .button:hover,
  .brown.button:hover {
    background-color: var(--brown-hover);
    color: var(--brown-text-color);
    text-shadow: var(--brown-text-shadow);
  }
  .brown.buttons .button:focus,
  .brown.button:focus {
    background-color: var(--brown-focus);
    color: var(--brown-text-color);
    text-shadow: var(--brown-text-shadow);
  }
  .brown.buttons .button:active,
  .brown.button:active {
    background-color: var(--brown-down);
    color: var(--brown-text-color);
    text-shadow: var(--brown-text-shadow);
  }
  .brown.buttons .active.button,
  .brown.buttons .active.button:active,
  .brown.active.button,
  .brown.button .active.button:active {
    background-color: var(--brown-active);
    color: var(--brown-text-color);
    text-shadow: var(--brown-text-shadow);
  }
  .basic.brown.buttons .button,
  .basic.brown.button {
    box-shadow: 0px 0px 0px var(--basic-border-size) var(--brown) inset !important;
    color: var(--brown) !important;
  }
  .basic.brown.buttons .button:hover,
  .basic.brown.button:hover {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--brown-hover) inset !important;
    color: var(--brown-hover) !important;
  }
  .basic.brown.buttons .button:focus,
  .basic.brown.button:focus {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--brown-focus) inset !important;
    color: var(--brown-hover) !important;
  }
  .basic.brown.buttons .active.button,
  .basic.brown.active.button {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--brown-active) inset !important;
    color: var(--brown-down) !important;
  }
  .basic.brown.buttons .button:active,
  .basic.brown.button:active {
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--brown-down) inset !important;
    color: var(--brown-down) !important;
  }
  .buttons:not(.vertical) > .basic.brown.button:not(:first-child) {
    margin-left: var(--basic-colored-border-size);
  }
  .inverted.brown.buttons .button,
  .inverted.brown.button {
    background-color: transparent;
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-brown) inset !important;
    color: var(--light-brown);
  }
  .inverted.brown.buttons .button:hover,
  .inverted.brown.button:hover,
  .inverted.brown.buttons .button:focus,
  .inverted.brown.button:focus,
  .inverted.brown.buttons .button.active,
  .inverted.brown.button.active,
  .inverted.brown.buttons .button:active,
  .inverted.brown.button:active {
    box-shadow: none !important;
    color: var(--light-brown-text-color);
  }
  .inverted.brown.buttons .button:hover,
  .inverted.brown.button:hover {
    background-color: var(--light-brown-hover);
  }
  .inverted.brown.buttons .button:focus,
  .inverted.brown.button:focus {
    background-color: var(--light-brown-focus);
  }
  .inverted.brown.buttons .active.button,
  .inverted.brown.active.button {
    background-color: var(--light-brown-active);
  }
  .inverted.brown.buttons .button:active,
  .inverted.brown.button:active {
    background-color: var(--light-brown-down);
  }
  .inverted.brown.basic.buttons .button,
  .inverted.brown.buttons .basic.button,
  .inverted.brown.basic.button {
    background-color: transparent;
    box-shadow: var(--basic-inverted-box-shadow) !important;
    color: var(--white) !important;
  }
  .inverted.brown.basic.buttons .button:hover,
  .inverted.brown.buttons .basic.button:hover,
  .inverted.brown.basic.button:hover {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-brown-hover) inset !important;
    color: var(--light-brown) !important;
  }
  .inverted.brown.basic.buttons .button:focus,
  .inverted.brown.basic.buttons .button:focus,
  .inverted.brown.basic.button:focus {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-brown-focus) inset !important;
    color: var(--light-brown) !important;
  }
  .inverted.brown.basic.buttons .active.button,
  .inverted.brown.buttons .basic.active.button,
  .inverted.brown.basic.active.button {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-brown-active) inset !important;
    color: var(--light-brown) !important;
  }
  .inverted.brown.basic.buttons .button:active,
  .inverted.brown.buttons .basic.button:active,
  .inverted.brown.basic.button:active {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-brown-down) inset !important;
    color: var(--light-brown) !important;
  }
  .blue.buttons .button,
  .blue.button {
    background-color: var(--blue);
    color: var(--blue-text-color);
    text-shadow: var(--blue-text-shadow);
    background-image: var(--colored-background-image);
  }
  .blue.button {
    box-shadow: var(--colored-box-shadow);
  }
  .blue.buttons .button:hover,
  .blue.button:hover {
    background-color: var(--blue-hover);
    color: var(--blue-text-color);
    text-shadow: var(--blue-text-shadow);
  }
  .blue.buttons .button:focus,
  .blue.button:focus {
    background-color: var(--blue-focus);
    color: var(--blue-text-color);
    text-shadow: var(--blue-text-shadow);
  }
  .blue.buttons .button:active,
  .blue.button:active {
    background-color: var(--blue-down);
    color: var(--blue-text-color);
    text-shadow: var(--blue-text-shadow);
  }
  .blue.buttons .active.button,
  .blue.buttons .active.button:active,
  .blue.active.button,
  .blue.button .active.button:active {
    background-color: var(--blue-active);
    color: var(--blue-text-color);
    text-shadow: var(--blue-text-shadow);
  }
  .basic.blue.buttons .button,
  .basic.blue.button {
    box-shadow: 0px 0px 0px var(--basic-border-size) var(--blue) inset !important;
    color: var(--blue) !important;
  }
  .basic.blue.buttons .button:hover,
  .basic.blue.button:hover {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--blue-hover) inset !important;
    color: var(--blue-hover) !important;
  }
  .basic.blue.buttons .button:focus,
  .basic.blue.button:focus {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--blue-focus) inset !important;
    color: var(--blue-hover) !important;
  }
  .basic.blue.buttons .active.button,
  .basic.blue.active.button {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--blue-active) inset !important;
    color: var(--blue-down) !important;
  }
  .basic.blue.buttons .button:active,
  .basic.blue.button:active {
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--blue-down) inset !important;
    color: var(--blue-down) !important;
  }
  .buttons:not(.vertical) > .basic.blue.button:not(:first-child) {
    margin-left: var(--basic-colored-border-size);
  }
  .inverted.blue.buttons .button,
  .inverted.blue.button {
    background-color: transparent;
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-blue) inset !important;
    color: var(--light-blue);
  }
  .inverted.blue.buttons .button:hover,
  .inverted.blue.button:hover,
  .inverted.blue.buttons .button:focus,
  .inverted.blue.button:focus,
  .inverted.blue.buttons .button.active,
  .inverted.blue.button.active,
  .inverted.blue.buttons .button:active,
  .inverted.blue.button:active {
    box-shadow: none !important;
    color: var(--light-blue-text-color);
  }
  .inverted.blue.buttons .button:hover,
  .inverted.blue.button:hover {
    background-color: var(--light-blue-hover);
  }
  .inverted.blue.buttons .button:focus,
  .inverted.blue.button:focus {
    background-color: var(--light-blue-focus);
  }
  .inverted.blue.buttons .active.button,
  .inverted.blue.active.button {
    background-color: var(--light-blue-active);
  }
  .inverted.blue.buttons .button:active,
  .inverted.blue.button:active {
    background-color: var(--light-blue-down);
  }
  .inverted.blue.basic.buttons .button,
  .inverted.blue.buttons .basic.button,
  .inverted.blue.basic.button {
    background-color: transparent;
    box-shadow: var(--basic-inverted-box-shadow) !important;
    color: var(--white) !important;
  }
  .inverted.blue.basic.buttons .button:hover,
  .inverted.blue.buttons .basic.button:hover,
  .inverted.blue.basic.button:hover {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-blue-hover) inset !important;
    color: var(--light-blue) !important;
  }
  .inverted.blue.basic.buttons .button:focus,
  .inverted.blue.basic.buttons .button:focus,
  .inverted.blue.basic.button:focus {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-blue-focus) inset !important;
    color: var(--light-blue) !important;
  }
  .inverted.blue.basic.buttons .active.button,
  .inverted.blue.buttons .basic.active.button,
  .inverted.blue.basic.active.button {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-blue-active) inset !important;
    color: var(--light-blue) !important;
  }
  .inverted.blue.basic.buttons .button:active,
  .inverted.blue.buttons .basic.button:active,
  .inverted.blue.basic.button:active {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-blue-down) inset !important;
    color: var(--light-blue) !important;
  }
  .green.buttons .button,
  .green.button {
    background-color: var(--green);
    color: var(--green-text-color);
    text-shadow: var(--green-text-shadow);
    background-image: var(--colored-background-image);
  }
  .green.button {
    box-shadow: var(--colored-box-shadow);
  }
  .green.buttons .button:hover,
  .green.button:hover {
    background-color: var(--green-hover);
    color: var(--green-text-color);
    text-shadow: var(--green-text-shadow);
  }
  .green.buttons .button:focus,
  .green.button:focus {
    background-color: var(--green-focus);
    color: var(--green-text-color);
    text-shadow: var(--green-text-shadow);
  }
  .green.buttons .button:active,
  .green.button:active {
    background-color: var(--green-down);
    color: var(--green-text-color);
    text-shadow: var(--green-text-shadow);
  }
  .green.buttons .active.button,
  .green.buttons .active.button:active,
  .green.active.button,
  .green.button .active.button:active {
    background-color: var(--green-active);
    color: var(--green-text-color);
    text-shadow: var(--green-text-shadow);
  }
  .basic.green.buttons .button,
  .basic.green.button {
    box-shadow: 0px 0px 0px var(--basic-border-size) var(--green) inset !important;
    color: var(--green) !important;
  }
  .basic.green.buttons .button:hover,
  .basic.green.button:hover {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--green-hover) inset !important;
    color: var(--green-hover) !important;
  }
  .basic.green.buttons .button:focus,
  .basic.green.button:focus {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--green-focus) inset !important;
    color: var(--green-hover) !important;
  }
  .basic.green.buttons .active.button,
  .basic.green.active.button {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--green-active) inset !important;
    color: var(--green-down) !important;
  }
  .basic.green.buttons .button:active,
  .basic.green.button:active {
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--green-down) inset !important;
    color: var(--green-down) !important;
  }
  .buttons:not(.vertical) > .basic.green.button:not(:first-child) {
    margin-left: var(--basic-colored-border-size);
  }
  .inverted.green.buttons .button,
  .inverted.green.button {
    background-color: transparent;
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-green) inset !important;
    color: var(--light-green);
  }
  .inverted.green.buttons .button:hover,
  .inverted.green.button:hover,
  .inverted.green.buttons .button:focus,
  .inverted.green.button:focus,
  .inverted.green.buttons .button.active,
  .inverted.green.button.active,
  .inverted.green.buttons .button:active,
  .inverted.green.button:active {
    box-shadow: none !important;
    color: var(--green-text-color);
  }
  .inverted.green.buttons .button:hover,
  .inverted.green.button:hover {
    background-color: var(--light-green-hover);
  }
  .inverted.green.buttons .button:focus,
  .inverted.green.button:focus {
    background-color: var(--light-green-focus);
  }
  .inverted.green.buttons .active.button,
  .inverted.green.active.button {
    background-color: var(--light-green-active);
  }
  .inverted.green.buttons .button:active,
  .inverted.green.button:active {
    background-color: var(--light-green-down);
  }
  .inverted.green.basic.buttons .button,
  .inverted.green.buttons .basic.button,
  .inverted.green.basic.button {
    background-color: transparent;
    box-shadow: var(--basic-inverted-box-shadow) !important;
    color: var(--white) !important;
  }
  .inverted.green.basic.buttons .button:hover,
  .inverted.green.buttons .basic.button:hover,
  .inverted.green.basic.button:hover {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-green-hover) inset !important;
    color: var(--light-green) !important;
  }
  .inverted.green.basic.buttons .button:focus,
  .inverted.green.basic.buttons .button:focus,
  .inverted.green.basic.button:focus {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-green-focus) inset !important;
    color: var(--light-green) !important;
  }
  .inverted.green.basic.buttons .active.button,
  .inverted.green.buttons .basic.active.button,
  .inverted.green.basic.active.button {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-green-active) inset !important;
    color: var(--light-green) !important;
  }
  .inverted.green.basic.buttons .button:active,
  .inverted.green.buttons .basic.button:active,
  .inverted.green.basic.button:active {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-green-down) inset !important;
    color: var(--light-green) !important;
  }
  .orange.buttons .button,
  .orange.button {
    background-color: var(--orange);
    color: var(--orange-text-color);
    text-shadow: var(--orange-text-shadow);
    background-image: var(--colored-background-image);
  }
  .orange.button {
    box-shadow: var(--colored-box-shadow);
  }
  .orange.buttons .button:hover,
  .orange.button:hover {
    background-color: var(--orange-hover);
    color: var(--orange-text-color);
    text-shadow: var(--orange-text-shadow);
  }
  .orange.buttons .button:focus,
  .orange.button:focus {
    background-color: var(--orange-focus);
    color: var(--orange-text-color);
    text-shadow: var(--orange-text-shadow);
  }
  .orange.buttons .button:active,
  .orange.button:active {
    background-color: var(--orange-down);
    color: var(--orange-text-color);
    text-shadow: var(--orange-text-shadow);
  }
  .orange.buttons .active.button,
  .orange.buttons .active.button:active,
  .orange.active.button,
  .orange.button .active.button:active {
    background-color: var(--orange-active);
    color: var(--orange-text-color);
    text-shadow: var(--orange-text-shadow);
  }
  .basic.orange.buttons .button,
  .basic.orange.button {
    box-shadow: 0px 0px 0px var(--basic-border-size) var(--orange) inset !important;
    color: var(--orange) !important;
  }
  .basic.orange.buttons .button:hover,
  .basic.orange.button:hover {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--orange-hover) inset !important;
    color: var(--orange-hover) !important;
  }
  .basic.orange.buttons .button:focus,
  .basic.orange.button:focus {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--orange-focus) inset !important;
    color: var(--orange-hover) !important;
  }
  .basic.orange.buttons .active.button,
  .basic.orange.active.button {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--orange-active) inset !important;
    color: var(--orange-down) !important;
  }
  .basic.orange.buttons .button:active,
  .basic.orange.button:active {
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--orange-down) inset !important;
    color: var(--orange-down) !important;
  }
  .buttons:not(.vertical) > .basic.orange.button:not(:first-child) {
    margin-left: var(--basic-colored-border-size);
  }
  .inverted.orange.buttons .button,
  .inverted.orange.button {
    background-color: transparent;
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-orange) inset !important;
    color: var(--light-orange);
  }
  .inverted.orange.buttons .button:hover,
  .inverted.orange.button:hover,
  .inverted.orange.buttons .button:focus,
  .inverted.orange.button:focus,
  .inverted.orange.buttons .button.active,
  .inverted.orange.button.active,
  .inverted.orange.buttons .button:active,
  .inverted.orange.button:active {
    box-shadow: none !important;
    color: var(--light-orange-text-color);
  }
  .inverted.orange.buttons .button:hover,
  .inverted.orange.button:hover {
    background-color: var(--light-orange-hover);
  }
  .inverted.orange.buttons .button:focus,
  .inverted.orange.button:focus {
    background-color: var(--light-orange-focus);
  }
  .inverted.orange.buttons .active.button,
  .inverted.orange.active.button {
    background-color: var(--light-orange-active);
  }
  .inverted.orange.buttons .button:active,
  .inverted.orange.button:active {
    background-color: var(--light-orange-down);
  }
  .inverted.orange.basic.buttons .button,
  .inverted.orange.buttons .basic.button,
  .inverted.orange.basic.button {
    background-color: transparent;
    box-shadow: var(--basic-inverted-box-shadow) !important;
    color: var(--white) !important;
  }
  .inverted.orange.basic.buttons .button:hover,
  .inverted.orange.buttons .basic.button:hover,
  .inverted.orange.basic.button:hover {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-orange-hover) inset !important;
    color: var(--light-orange) !important;
  }
  .inverted.orange.basic.buttons .button:focus,
  .inverted.orange.basic.buttons .button:focus,
  .inverted.orange.basic.button:focus {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-orange-focus) inset !important;
    color: var(--light-orange) !important;
  }
  .inverted.orange.basic.buttons .active.button,
  .inverted.orange.buttons .basic.active.button,
  .inverted.orange.basic.active.button {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-orange-active) inset !important;
    color: var(--light-orange) !important;
  }
  .inverted.orange.basic.buttons .button:active,
  .inverted.orange.buttons .basic.button:active,
  .inverted.orange.basic.button:active {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-orange-down) inset !important;
    color: var(--light-orange) !important;
  }
  .pink.buttons .button,
  .pink.button {
    background-color: var(--pink);
    color: var(--pink-text-color);
    text-shadow: var(--pink-text-shadow);
    background-image: var(--colored-background-image);
  }
  .pink.button {
    box-shadow: var(--colored-box-shadow);
  }
  .pink.buttons .button:hover,
  .pink.button:hover {
    background-color: var(--pink-hover);
    color: var(--pink-text-color);
    text-shadow: var(--pink-text-shadow);
  }
  .pink.buttons .button:focus,
  .pink.button:focus {
    background-color: var(--pink-focus);
    color: var(--pink-text-color);
    text-shadow: var(--pink-text-shadow);
  }
  .pink.buttons .button:active,
  .pink.button:active {
    background-color: var(--pink-down);
    color: var(--pink-text-color);
    text-shadow: var(--pink-text-shadow);
  }
  .pink.buttons .active.button,
  .pink.buttons .active.button:active,
  .pink.active.button,
  .pink.button .active.button:active {
    background-color: var(--pink-active);
    color: var(--pink-text-color);
    text-shadow: var(--pink-text-shadow);
  }
  .basic.pink.buttons .button,
  .basic.pink.button {
    box-shadow: 0px 0px 0px var(--basic-border-size) var(--pink) inset !important;
    color: var(--pink) !important;
  }
  .basic.pink.buttons .button:hover,
  .basic.pink.button:hover {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--pink-hover) inset !important;
    color: var(--pink-hover) !important;
  }
  .basic.pink.buttons .button:focus,
  .basic.pink.button:focus {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--pink-focus) inset !important;
    color: var(--pink-hover) !important;
  }
  .basic.pink.buttons .active.button,
  .basic.pink.active.button {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--pink-active) inset !important;
    color: var(--pink-down) !important;
  }
  .basic.pink.buttons .button:active,
  .basic.pink.button:active {
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--pink-down) inset !important;
    color: var(--pink-down) !important;
  }
  .buttons:not(.vertical) > .basic.pink.button:not(:first-child) {
    margin-left: var(--basic-colored-border-size);
  }
  .inverted.pink.buttons .button,
  .inverted.pink.button {
    background-color: transparent;
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-pink) inset !important;
    color: var(--light-pink);
  }
  .inverted.pink.buttons .button:hover,
  .inverted.pink.button:hover,
  .inverted.pink.buttons .button:focus,
  .inverted.pink.button:focus,
  .inverted.pink.buttons .button.active,
  .inverted.pink.button.active,
  .inverted.pink.buttons .button:active,
  .inverted.pink.button:active {
    box-shadow: none !important;
    color: var(--light-pink-text-color);
  }
  .inverted.pink.buttons .button:hover,
  .inverted.pink.button:hover {
    background-color: var(--light-pink-hover);
  }
  .inverted.pink.buttons .button:focus,
  .inverted.pink.button:focus {
    background-color: var(--light-pink-focus);
  }
  .inverted.pink.buttons .active.button,
  .inverted.pink.active.button {
    background-color: var(--light-pink-active);
  }
  .inverted.pink.buttons .button:active,
  .inverted.pink.button:active {
    background-color: var(--light-pink-down);
  }
  .inverted.pink.basic.buttons .button,
  .inverted.pink.buttons .basic.button,
  .inverted.pink.basic.button {
    background-color: transparent;
    box-shadow: var(--basic-inverted-box-shadow) !important;
    color: var(--white) !important;
  }
  .inverted.pink.basic.buttons .button:hover,
  .inverted.pink.buttons .basic.button:hover,
  .inverted.pink.basic.button:hover {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-pink-hover) inset !important;
    color: var(--light-pink) !important;
  }
  .inverted.pink.basic.buttons .button:focus,
  .inverted.pink.basic.buttons .button:focus,
  .inverted.pink.basic.button:focus {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-pink-focus) inset !important;
    color: var(--light-pink) !important;
  }
  .inverted.pink.basic.buttons .active.button,
  .inverted.pink.buttons .basic.active.button,
  .inverted.pink.basic.active.button {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-pink-active) inset !important;
    color: var(--light-pink) !important;
  }
  .inverted.pink.basic.buttons .button:active,
  .inverted.pink.buttons .basic.button:active,
  .inverted.pink.basic.button:active {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-pink-down) inset !important;
    color: var(--light-pink) !important;
  }
  .violet.buttons .button,
  .violet.button {
    background-color: var(--violet);
    color: var(--violet-text-color);
    text-shadow: var(--violet-text-shadow);
    background-image: var(--colored-background-image);
  }
  .violet.button {
    box-shadow: var(--colored-box-shadow);
  }
  .violet.buttons .button:hover,
  .violet.button:hover {
    background-color: var(--violet-hover);
    color: var(--violet-text-color);
    text-shadow: var(--violet-text-shadow);
  }
  .violet.buttons .button:focus,
  .violet.button:focus {
    background-color: var(--violet-focus);
    color: var(--violet-text-color);
    text-shadow: var(--violet-text-shadow);
  }
  .violet.buttons .button:active,
  .violet.button:active {
    background-color: var(--violet-down);
    color: var(--violet-text-color);
    text-shadow: var(--violet-text-shadow);
  }
  .violet.buttons .active.button,
  .violet.buttons .active.button:active,
  .violet.active.button,
  .violet.button .active.button:active {
    background-color: var(--violet-active);
    color: var(--violet-text-color);
    text-shadow: var(--violet-text-shadow);
  }
  .basic.violet.buttons .button,
  .basic.violet.button {
    box-shadow: 0px 0px 0px var(--basic-border-size) var(--violet) inset !important;
    color: var(--violet) !important;
  }
  .basic.violet.buttons .button:hover,
  .basic.violet.button:hover {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--violet-hover) inset !important;
    color: var(--violet-hover) !important;
  }
  .basic.violet.buttons .button:focus,
  .basic.violet.button:focus {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--violet-focus) inset !important;
    color: var(--violet-hover) !important;
  }
  .basic.violet.buttons .active.button,
  .basic.violet.active.button {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--violet-active) inset !important;
    color: var(--violet-down) !important;
  }
  .basic.violet.buttons .button:active,
  .basic.violet.button:active {
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--violet-down) inset !important;
    color: var(--violet-down) !important;
  }
  .buttons:not(.vertical) > .basic.violet.button:not(:first-child) {
    margin-left: var(--basic-colored-border-size);
  }
  .inverted.violet.buttons .button,
  .inverted.violet.button {
    background-color: transparent;
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-violet) inset !important;
    color: var(--light-violet);
  }
  .inverted.violet.buttons .button:hover,
  .inverted.violet.button:hover,
  .inverted.violet.buttons .button:focus,
  .inverted.violet.button:focus,
  .inverted.violet.buttons .button.active,
  .inverted.violet.button.active,
  .inverted.violet.buttons .button:active,
  .inverted.violet.button:active {
    box-shadow: none !important;
    color: var(--light-violet-text-color);
  }
  .inverted.violet.buttons .button:hover,
  .inverted.violet.button:hover {
    background-color: var(--light-violet-hover);
  }
  .inverted.violet.buttons .button:focus,
  .inverted.violet.button:focus {
    background-color: var(--light-violet-focus);
  }
  .inverted.violet.buttons .active.button,
  .inverted.violet.active.button {
    background-color: var(--light-violet-active);
  }
  .inverted.violet.buttons .button:active,
  .inverted.violet.button:active {
    background-color: var(--light-violet-down);
  }
  .inverted.violet.basic.buttons .button,
  .inverted.violet.buttons .basic.button,
  .inverted.violet.basic.button {
    background-color: transparent;
    box-shadow: var(--basic-inverted-box-shadow) !important;
    color: var(--white) !important;
  }
  .inverted.violet.basic.buttons .button:hover,
  .inverted.violet.buttons .basic.button:hover,
  .inverted.violet.basic.button:hover {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-violet-hover) inset !important;
    color: var(--light-violet) !important;
  }
  .inverted.violet.basic.buttons .button:focus,
  .inverted.violet.basic.buttons .button:focus,
  .inverted.violet.basic.button:focus {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-violet-focus) inset !important;
    color: var(--light-violet) !important;
  }
  .inverted.violet.basic.buttons .active.button,
  .inverted.violet.buttons .basic.active.button,
  .inverted.violet.basic.active.button {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-violet-active) inset !important;
    color: var(--light-violet) !important;
  }
  .inverted.violet.basic.buttons .button:active,
  .inverted.violet.buttons .basic.button:active,
  .inverted.violet.basic.button:active {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-violet-down) inset !important;
    color: var(--light-violet) !important;
  }
  .purple.buttons .button,
  .purple.button {
    background-color: var(--purple);
    color: var(--purple-text-color);
    text-shadow: var(--purple-text-shadow);
    background-image: var(--colored-background-image);
  }
  .purple.button {
    box-shadow: var(--colored-box-shadow);
  }
  .purple.buttons .button:hover,
  .purple.button:hover {
    background-color: var(--purple-hover);
    color: var(--purple-text-color);
    text-shadow: var(--purple-text-shadow);
  }
  .purple.buttons .button:focus,
  .purple.button:focus {
    background-color: var(--purple-focus);
    color: var(--purple-text-color);
    text-shadow: var(--purple-text-shadow);
  }
  .purple.buttons .button:active,
  .purple.button:active {
    background-color: var(--purple-down);
    color: var(--purple-text-color);
    text-shadow: var(--purple-text-shadow);
  }
  .purple.buttons .active.button,
  .purple.buttons .active.button:active,
  .purple.active.button,
  .purple.button .active.button:active {
    background-color: var(--purple-active);
    color: var(--purple-text-color);
    text-shadow: var(--purple-text-shadow);
  }
  .basic.purple.buttons .button,
  .basic.purple.button {
    box-shadow: 0px 0px 0px var(--basic-border-size) var(--purple) inset !important;
    color: var(--purple) !important;
  }
  .basic.purple.buttons .button:hover,
  .basic.purple.button:hover {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--purple-hover) inset !important;
    color: var(--purple-hover) !important;
  }
  .basic.purple.buttons .button:focus,
  .basic.purple.button:focus {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--purple-focus) inset !important;
    color: var(--purple-hover) !important;
  }
  .basic.purple.buttons .active.button,
  .basic.purple.active.button {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--purple-active) inset !important;
    color: var(--purple-down) !important;
  }
  .basic.purple.buttons .button:active,
  .basic.purple.button:active {
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--purple-down) inset !important;
    color: var(--purple-down) !important;
  }
  .buttons:not(.vertical) > .basic.purple.button:not(:first-child) {
    margin-left: var(--basic-colored-border-size);
  }
  .inverted.purple.buttons .button,
  .inverted.purple.button {
    background-color: transparent;
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-purple) inset !important;
    color: var(--light-purple);
  }
  .inverted.purple.buttons .button:hover,
  .inverted.purple.button:hover,
  .inverted.purple.buttons .button:focus,
  .inverted.purple.button:focus,
  .inverted.purple.buttons .button.active,
  .inverted.purple.button.active,
  .inverted.purple.buttons .button:active,
  .inverted.purple.button:active {
    box-shadow: none !important;
    color: var(--light-purple-text-color);
  }
  .inverted.purple.buttons .button:hover,
  .inverted.purple.button:hover {
    background-color: var(--light-purple-hover);
  }
  .inverted.purple.buttons .button:focus,
  .inverted.purple.button:focus {
    background-color: var(--light-purple-focus);
  }
  .inverted.purple.buttons .active.button,
  .inverted.purple.active.button {
    background-color: var(--light-purple-active);
  }
  .inverted.purple.buttons .button:active,
  .inverted.purple.button:active {
    background-color: var(--light-purple-down);
  }
  .inverted.purple.basic.buttons .button,
  .inverted.purple.buttons .basic.button,
  .inverted.purple.basic.button {
    background-color: transparent;
    box-shadow: var(--basic-inverted-box-shadow) !important;
    color: var(--white) !important;
  }
  .inverted.purple.basic.buttons .button:hover,
  .inverted.purple.buttons .basic.button:hover,
  .inverted.purple.basic.button:hover {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-purple-hover) inset !important;
    color: var(--light-purple) !important;
  }
  .inverted.purple.basic.buttons .button:focus,
  .inverted.purple.basic.buttons .button:focus,
  .inverted.purple.basic.button:focus {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-purple-focus) inset !important;
    color: var(--light-purple) !important;
  }
  .inverted.purple.basic.buttons .active.button,
  .inverted.purple.buttons .basic.active.button,
  .inverted.purple.basic.active.button {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-purple-active) inset !important;
    color: var(--light-purple) !important;
  }
  .inverted.purple.basic.buttons .button:active,
  .inverted.purple.buttons .basic.button:active,
  .inverted.purple.basic.button:active {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-purple-down) inset !important;
    color: var(--light-purple) !important;
  }
  .red.buttons .button,
  .red.button {
    background-color: var(--red);
    color: var(--red-text-color);
    text-shadow: var(--red-text-shadow);
    background-image: var(--colored-background-image);
  }
  .red.button {
    box-shadow: var(--colored-box-shadow);
  }
  .red.buttons .button:hover,
  .red.button:hover {
    background-color: var(--red-hover);
    color: var(--red-text-color);
    text-shadow: var(--red-text-shadow);
  }
  .red.buttons .button:focus,
  .red.button:focus {
    background-color: var(--red-focus);
    color: var(--red-text-color);
    text-shadow: var(--red-text-shadow);
  }
  .red.buttons .button:active,
  .red.button:active {
    background-color: var(--red-down);
    color: var(--red-text-color);
    text-shadow: var(--red-text-shadow);
  }
  .red.buttons .active.button,
  .red.buttons .active.button:active,
  .red.active.button,
  .red.button .active.button:active {
    background-color: var(--red-active);
    color: var(--red-text-color);
    text-shadow: var(--red-text-shadow);
  }
  .basic.red.buttons .button,
  .basic.red.button {
    box-shadow: 0px 0px 0px var(--basic-border-size) var(--red) inset !important;
    color: var(--red) !important;
  }
  .basic.red.buttons .button:hover,
  .basic.red.button:hover {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--red-hover) inset !important;
    color: var(--red-hover) !important;
  }
  .basic.red.buttons .button:focus,
  .basic.red.button:focus {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--red-focus) inset !important;
    color: var(--red-hover) !important;
  }
  .basic.red.buttons .active.button,
  .basic.red.active.button {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--red-active) inset !important;
    color: var(--red-down) !important;
  }
  .basic.red.buttons .button:active,
  .basic.red.button:active {
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--red-down) inset !important;
    color: var(--red-down) !important;
  }
  .buttons:not(.vertical) > .basic.red.button:not(:first-child) {
    margin-left: var(--basic-colored-border-size);
  }
  .inverted.red.buttons .button,
  .inverted.red.button {
    background-color: transparent;
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-red) inset !important;
    color: var(--light-red);
  }
  .inverted.red.buttons .button:hover,
  .inverted.red.button:hover,
  .inverted.red.buttons .button:focus,
  .inverted.red.button:focus,
  .inverted.red.buttons .button.active,
  .inverted.red.button.active,
  .inverted.red.buttons .button:active,
  .inverted.red.button:active {
    box-shadow: none !important;
    color: var(--light-red-text-color);
  }
  .inverted.red.buttons .button:hover,
  .inverted.red.button:hover {
    background-color: var(--light-red-hover);
  }
  .inverted.red.buttons .button:focus,
  .inverted.red.button:focus {
    background-color: var(--light-red-focus);
  }
  .inverted.red.buttons .active.button,
  .inverted.red.active.button {
    background-color: var(--light-red-active);
  }
  .inverted.red.buttons .button:active,
  .inverted.red.button:active {
    background-color: var(--light-red-down);
  }
  .inverted.red.basic.buttons .button,
  .inverted.red.buttons .basic.button,
  .inverted.red.basic.button {
    background-color: transparent;
    box-shadow: var(--basic-inverted-box-shadow) !important;
    color: var(--white) !important;
  }
  .inverted.red.basic.buttons .button:hover,
  .inverted.red.buttons .basic.button:hover,
  .inverted.red.basic.button:hover {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-red-hover) inset !important;
    color: var(--light-red) !important;
  }
  .inverted.red.basic.buttons .button:focus,
  .inverted.red.basic.buttons .button:focus,
  .inverted.red.basic.button:focus {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-red-focus) inset !important;
    color: var(--light-red) !important;
  }
  .inverted.red.basic.buttons .active.button,
  .inverted.red.buttons .basic.active.button,
  .inverted.red.basic.active.button {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-red-active) inset !important;
    color: var(--light-red) !important;
  }
  .inverted.red.basic.buttons .button:active,
  .inverted.red.buttons .basic.button:active,
  .inverted.red.basic.button:active {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-red-down) inset !important;
    color: var(--light-red) !important;
  }
  .teal.buttons .button,
  .teal.button {
    background-color: var(--teal);
    color: var(--teal-text-color);
    text-shadow: var(--teal-text-shadow);
    background-image: var(--colored-background-image);
  }
  .teal.button {
    box-shadow: var(--colored-box-shadow);
  }
  .teal.buttons .button:hover,
  .teal.button:hover {
    background-color: var(--teal-hover);
    color: var(--teal-text-color);
    text-shadow: var(--teal-text-shadow);
  }
  .teal.buttons .button:focus,
  .teal.button:focus {
    background-color: var(--teal-focus);
    color: var(--teal-text-color);
    text-shadow: var(--teal-text-shadow);
  }
  .teal.buttons .button:active,
  .teal.button:active {
    background-color: var(--teal-down);
    color: var(--teal-text-color);
    text-shadow: var(--teal-text-shadow);
  }
  .teal.buttons .active.button,
  .teal.buttons .active.button:active,
  .teal.active.button,
  .teal.button .active.button:active {
    background-color: var(--teal-active);
    color: var(--teal-text-color);
    text-shadow: var(--teal-text-shadow);
  }
  .basic.teal.buttons .button,
  .basic.teal.button {
    box-shadow: 0px 0px 0px var(--basic-border-size) var(--teal) inset !important;
    color: var(--teal) !important;
  }
  .basic.teal.buttons .button:hover,
  .basic.teal.button:hover {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--teal-hover) inset !important;
    color: var(--teal-hover) !important;
  }
  .basic.teal.buttons .button:focus,
  .basic.teal.button:focus {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--teal-focus) inset !important;
    color: var(--teal-hover) !important;
  }
  .basic.teal.buttons .active.button,
  .basic.teal.active.button {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--teal-active) inset !important;
    color: var(--teal-down) !important;
  }
  .basic.teal.buttons .button:active,
  .basic.teal.button:active {
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--teal-down) inset !important;
    color: var(--teal-down) !important;
  }
  .buttons:not(.vertical) > .basic.teal.button:not(:first-child) {
    margin-left: var(--basic-colored-border-size);
  }
  .inverted.teal.buttons .button,
  .inverted.teal.button {
    background-color: transparent;
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-teal) inset !important;
    color: var(--light-teal);
  }
  .inverted.teal.buttons .button:hover,
  .inverted.teal.button:hover,
  .inverted.teal.buttons .button:focus,
  .inverted.teal.button:focus,
  .inverted.teal.buttons .button.active,
  .inverted.teal.button.active,
  .inverted.teal.buttons .button:active,
  .inverted.teal.button:active {
    box-shadow: none !important;
    color: var(--light-teal-text-color);
  }
  .inverted.teal.buttons .button:hover,
  .inverted.teal.button:hover {
    background-color: var(--light-teal-hover);
  }
  .inverted.teal.buttons .button:focus,
  .inverted.teal.button:focus {
    background-color: var(--light-teal-focus);
  }
  .inverted.teal.buttons .active.button,
  .inverted.teal.active.button {
    background-color: var(--light-teal-active);
  }
  .inverted.teal.buttons .button:active,
  .inverted.teal.button:active {
    background-color: var(--light-teal-down);
  }
  .inverted.teal.basic.buttons .button,
  .inverted.teal.buttons .basic.button,
  .inverted.teal.basic.button {
    background-color: transparent;
    box-shadow: var(--basic-inverted-box-shadow) !important;
    color: var(--white) !important;
  }
  .inverted.teal.basic.buttons .button:hover,
  .inverted.teal.buttons .basic.button:hover,
  .inverted.teal.basic.button:hover {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-teal-hover) inset !important;
    color: var(--light-teal) !important;
  }
  .inverted.teal.basic.buttons .button:focus,
  .inverted.teal.basic.buttons .button:focus,
  .inverted.teal.basic.button:focus {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-teal-focus) inset !important;
    color: var(--light-teal) !important;
  }
  .inverted.teal.basic.buttons .active.button,
  .inverted.teal.buttons .basic.active.button,
  .inverted.teal.basic.active.button {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-teal-active) inset !important;
    color: var(--light-teal) !important;
  }
  .inverted.teal.basic.buttons .button:active,
  .inverted.teal.buttons .basic.button:active,
  .inverted.teal.basic.button:active {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-teal-down) inset !important;
    color: var(--light-teal) !important;
  }
  .olive.buttons .button,
  .olive.button {
    background-color: var(--olive);
    color: var(--olive-text-color);
    text-shadow: var(--olive-text-shadow);
    background-image: var(--colored-background-image);
  }
  .olive.button {
    box-shadow: var(--colored-box-shadow);
  }
  .olive.buttons .button:hover,
  .olive.button:hover {
    background-color: var(--olive-hover);
    color: var(--olive-text-color);
    text-shadow: var(--olive-text-shadow);
  }
  .olive.buttons .button:focus,
  .olive.button:focus {
    background-color: var(--olive-focus);
    color: var(--olive-text-color);
    text-shadow: var(--olive-text-shadow);
  }
  .olive.buttons .button:active,
  .olive.button:active {
    background-color: var(--olive-down);
    color: var(--olive-text-color);
    text-shadow: var(--olive-text-shadow);
  }
  .olive.buttons .active.button,
  .olive.buttons .active.button:active,
  .olive.active.button,
  .olive.button .active.button:active {
    background-color: var(--olive-active);
    color: var(--olive-text-color);
    text-shadow: var(--olive-text-shadow);
  }
  .basic.olive.buttons .button,
  .basic.olive.button {
    box-shadow: 0px 0px 0px var(--basic-border-size) var(--olive) inset !important;
    color: var(--olive) !important;
  }
  .basic.olive.buttons .button:hover,
  .basic.olive.button:hover {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--olive-hover) inset !important;
    color: var(--olive-hover) !important;
  }
  .basic.olive.buttons .button:focus,
  .basic.olive.button:focus {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--olive-focus) inset !important;
    color: var(--olive-hover) !important;
  }
  .basic.olive.buttons .active.button,
  .basic.olive.active.button {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--olive-active) inset !important;
    color: var(--olive-down) !important;
  }
  .basic.olive.buttons .button:active,
  .basic.olive.button:active {
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--olive-down) inset !important;
    color: var(--olive-down) !important;
  }
  .buttons:not(.vertical) > .basic.olive.button:not(:first-child) {
    margin-left: var(--basic-colored-border-size);
  }
  .inverted.olive.buttons .button,
  .inverted.olive.button {
    background-color: transparent;
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-olive) inset !important;
    color: var(--light-olive);
  }
  .inverted.olive.buttons .button:hover,
  .inverted.olive.button:hover,
  .inverted.olive.buttons .button:focus,
  .inverted.olive.button:focus,
  .inverted.olive.buttons .button.active,
  .inverted.olive.button.active,
  .inverted.olive.buttons .button:active,
  .inverted.olive.button:active {
    box-shadow: none !important;
    color: var(--light-olive-text-color);
  }
  .inverted.olive.buttons .button:hover,
  .inverted.olive.button:hover {
    background-color: var(--light-olive-hover);
  }
  .inverted.olive.buttons .button:focus,
  .inverted.olive.button:focus {
    background-color: var(--light-olive-focus);
  }
  .inverted.olive.buttons .active.button,
  .inverted.olive.active.button {
    background-color: var(--light-olive-active);
  }
  .inverted.olive.buttons .button:active,
  .inverted.olive.button:active {
    background-color: var(--light-olive-down);
  }
  .inverted.olive.basic.buttons .button,
  .inverted.olive.buttons .basic.button,
  .inverted.olive.basic.button {
    background-color: transparent;
    box-shadow: var(--basic-inverted-box-shadow) !important;
    color: var(--white) !important;
  }
  .inverted.olive.basic.buttons .button:hover,
  .inverted.olive.buttons .basic.button:hover,
  .inverted.olive.basic.button:hover {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-olive-hover) inset !important;
    color: var(--light-olive) !important;
  }
  .inverted.olive.basic.buttons .button:focus,
  .inverted.olive.basic.buttons .button:focus,
  .inverted.olive.basic.button:focus {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-olive-focus) inset !important;
    color: var(--light-olive) !important;
  }
  .inverted.olive.basic.buttons .active.button,
  .inverted.olive.buttons .basic.active.button,
  .inverted.olive.basic.active.button {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-olive-active) inset !important;
    color: var(--light-olive) !important;
  }
  .inverted.olive.basic.buttons .button:active,
  .inverted.olive.buttons .basic.button:active,
  .inverted.olive.basic.button:active {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-olive-down) inset !important;
    color: var(--light-olive) !important;
  }
  .yellow.buttons .button,
  .yellow.button {
    background-color: var(--yellow);
    color: var(--yellow-text-color);
    text-shadow: var(--yellow-text-shadow);
    background-image: var(--colored-background-image);
  }
  .yellow.button {
    box-shadow: var(--colored-box-shadow);
  }
  .yellow.buttons .button:hover,
  .yellow.button:hover {
    background-color: var(--yellow-hover);
    color: var(--yellow-text-color);
    text-shadow: var(--yellow-text-shadow);
  }
  .yellow.buttons .button:focus,
  .yellow.button:focus {
    background-color: var(--yellow-focus);
    color: var(--yellow-text-color);
    text-shadow: var(--yellow-text-shadow);
  }
  .yellow.buttons .button:active,
  .yellow.button:active {
    background-color: var(--yellow-down);
    color: var(--yellow-text-color);
    text-shadow: var(--yellow-text-shadow);
  }
  .yellow.buttons .active.button,
  .yellow.buttons .active.button:active,
  .yellow.active.button,
  .yellow.button .active.button:active {
    background-color: var(--yellow-active);
    color: var(--yellow-text-color);
    text-shadow: var(--yellow-text-shadow);
  }
  .basic.yellow.buttons .button,
  .basic.yellow.button {
    box-shadow: 0px 0px 0px var(--basic-border-size) var(--yellow) inset !important;
    color: var(--yellow) !important;
  }
  .basic.yellow.buttons .button:hover,
  .basic.yellow.button:hover {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--yellow-hover) inset !important;
    color: var(--yellow-hover) !important;
  }
  .basic.yellow.buttons .button:focus,
  .basic.yellow.button:focus {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--yellow-focus) inset !important;
    color: var(--yellow-hover) !important;
  }
  .basic.yellow.buttons .active.button,
  .basic.yellow.active.button {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--yellow-active) inset !important;
    color: var(--yellow-down) !important;
  }
  .basic.yellow.buttons .button:active,
  .basic.yellow.button:active {
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--yellow-down) inset !important;
    color: var(--yellow-down) !important;
  }
  .buttons:not(.vertical) > .basic.yellow.button:not(:first-child) {
    margin-left: var(--basic-colored-border-size);
  }
  .inverted.yellow.buttons .button,
  .inverted.yellow.button {
    background-color: transparent;
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-yellow) inset !important;
    color: var(--light-yellow);
  }
  .inverted.yellow.buttons .button:hover,
  .inverted.yellow.button:hover,
  .inverted.yellow.buttons .button:focus,
  .inverted.yellow.button:focus,
  .inverted.yellow.buttons .button.active,
  .inverted.yellow.button.active,
  .inverted.yellow.buttons .button:active,
  .inverted.yellow.button:active {
    box-shadow: none !important;
    color: var(--light-yellow-text-color);
  }
  .inverted.yellow.buttons .button:hover,
  .inverted.yellow.button:hover {
    background-color: var(--light-yellow-hover);
  }
  .inverted.yellow.buttons .button:focus,
  .inverted.yellow.button:focus {
    background-color: var(--light-yellow-focus);
  }
  .inverted.yellow.buttons .active.button,
  .inverted.yellow.active.button {
    background-color: var(--light-yellow-active);
  }
  .inverted.yellow.buttons .button:active,
  .inverted.yellow.button:active {
    background-color: var(--light-yellow-down);
  }
  .inverted.yellow.basic.buttons .button,
  .inverted.yellow.buttons .basic.button,
  .inverted.yellow.basic.button {
    background-color: transparent;
    box-shadow: var(--basic-inverted-box-shadow) !important;
    color: var(--white) !important;
  }
  .inverted.yellow.basic.buttons .button:hover,
  .inverted.yellow.buttons .basic.button:hover,
  .inverted.yellow.basic.button:hover {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-yellow-hover) inset !important;
    color: var(--light-yellow) !important;
  }
  .inverted.yellow.basic.buttons .button:focus,
  .inverted.yellow.basic.buttons .button:focus,
  .inverted.yellow.basic.button:focus {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-yellow-focus) inset !important;
    color: var(--light-yellow) !important;
  }
  .inverted.yellow.basic.buttons .active.button,
  .inverted.yellow.buttons .basic.active.button,
  .inverted.yellow.basic.active.button {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-yellow-active) inset !important;
    color: var(--light-yellow) !important;
  }
  .inverted.yellow.basic.buttons .button:active,
  .inverted.yellow.buttons .basic.button:active,
  .inverted.yellow.basic.button:active {
    box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-yellow-down) inset !important;
    color: var(--light-yellow) !important;
  }
}

/* src/button/css/variations/compact.css */
@layer component {
  .compact.buttons .button,
  .compact.button {
    padding: var(--compact-vertical-padding) var(--compact-horizontal-padding) (var(--compact-vertical-padding) + var(--shadow-offset));
  }
  .compact.icon.buttons .button,
  .compact.icon.button {
    padding: var(--compact-vertical-padding) var(--compact-vertical-padding) (var(--compact-vertical-padding) + var(--shadow-offset));
  }
  .compact.labeled.icon.buttons .button,
  .compact.labeled.icon.button {
    padding: var(--compact-vertical-padding) (var(--compact-horizontal-padding) + var(--labeled-icon-width)) (var(--compact-vertical-padding) + var(--shadow-offset));
  }
}

/* src/button/css/variations/floated.css */
@layer component {
  [class*="left floated"].buttons,
  [class*="left floated"].button {
    float: left;
    margin-left: 0em;
    margin-right: var(--floated-margin);
  }
  [class*="right floated"].buttons,
  [class*="right floated"].button {
    float: right;
    margin-right: 0em;
    margin-left: var(--floated-margin);
  }
}

/* src/button/css/variations/fluid.css */
@layer component {
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

/* src/button/css/variations/negative.css */
@layer component {
  .negative.buttons .button,
  .negative.button {
    background-color: var(--negative-color);
    color: var(--negative-text-color);
    text-shadow: var(--negative-text-shadow);
    background-image: var(--colored-background-image);
  }
  .negative.button {
    box-shadow: var(--colored-box-shadow);
  }
  .negative.buttons .button:hover,
  .negative.button:hover {
    background-color: var(--negative-color-hover);
    color: var(--negative-text-color);
    text-shadow: var(--negative-text-shadow);
  }
  .negative.buttons .button:focus,
  .negative.button:focus {
    background-color: var(--negative-color-focus);
    color: var(--negative-text-color);
    text-shadow: var(--negative-text-shadow);
  }
  .negative.buttons .button:active,
  .negative.button:active {
    background-color: var(--negative-color-down);
    color: var(--negative-text-color);
    text-shadow: var(--negative-text-shadow);
  }
  .negative.buttons .active.button,
  .negative.buttons .active.button:active,
  .negative.active.button,
  .negative.button .active.button:active {
    background-color: var(--negative-color-active);
    color: var(--negative-text-color);
    text-shadow: var(--negative-text-shadow);
  }
  .basic.negative.buttons .button,
  .basic.negative.button {
    box-shadow: 0px 0px 0px var(--basic-border-size) var(--negative-color) inset !important;
    color: var(--negative-color) !important;
  }
  .basic.negative.buttons .button:hover,
  .basic.negative.button:hover {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--negative-color-hover) inset !important;
    color: var(--negative-color-hover) !important;
  }
  .basic.negative.buttons .button:focus,
  .basic.negative.button:focus {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--negative-color-focus) inset !important;
    color: var(--negative-color-hover) !important;
  }
  .basic.negative.buttons .active.button,
  .basic.negative.active.button {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--negative-color-active) inset !important;
    color: var(--negative-color-down) !important;
  }
  .basic.negative.buttons .button:active,
  .basic.negative.button:active {
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--negative-color-down) inset !important;
    color: var(--negative-color-down) !important;
  }
  .buttons:not(.vertical) > .basic.primary.button:not(:first-child) {
    margin-left: var(--basic-colored-border-size);
  }
}

/* src/button/css/variations/positive.css */
@layer component {
  .positive.buttons .button,
  .positive.button {
    background-color: var(--positive-color);
    color: var(--positive-text-color);
    text-shadow: var(--positive-text-shadow);
    background-image: var(--colored-background-image);
  }
  .positive.button {
    box-shadow: var(--colored-box-shadow);
  }
  .positive.buttons .button:hover,
  .positive.button:hover {
    background-color: var(--positive-color-hover);
    color: var(--positive-text-color);
    text-shadow: var(--positive-text-shadow);
  }
  .positive.buttons .button:focus,
  .positive.button:focus {
    background-color: var(--positive-color-focus);
    color: var(--positive-text-color);
    text-shadow: var(--positive-text-shadow);
  }
  .positive.buttons .button:active,
  .positive.button:active {
    background-color: var(--positive-color-down);
    color: var(--positive-text-color);
    text-shadow: var(--positive-text-shadow);
  }
  .positive.buttons .active.button,
  .positive.buttons .active.button:active,
  .positive.active.button,
  .positive.button .active.button:active {
    background-color: var(--positive-color-active);
    color: var(--positive-text-color);
    text-shadow: var(--positive-text-shadow);
  }
  .basic.positive.buttons .button,
  .basic.positive.button {
    box-shadow: 0px 0px 0px var(--basic-border-size) var(--positive-color) inset !important;
    color: var(--positive-color) !important;
  }
  .basic.positive.buttons .button:hover,
  .basic.positive.button:hover {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--positive-color-hover) inset !important;
    color: var(--positive-color-hover) !important;
  }
  .basic.positive.buttons .button:focus,
  .basic.positive.button:focus {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--positive-color-focus) inset !important;
    color: var(--positive-color-hover) !important;
  }
  .basic.positive.buttons .active.button,
  .basic.positive.active.button {
    background: transparent !important;
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--positive-color-active) inset !important;
    color: var(--positive-color-down) !important;
  }
  .basic.positive.buttons .button:active,
  .basic.positive.button:active {
    box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--positive-color-down) inset !important;
    color: var(--positive-color-down) !important;
  }
  .buttons:not(.vertical) > .basic.primary.button:not(:first-child) {
    margin-left: var(--basic-colored-border-size);
  }
}

/* src/button/css/variations/sizing.css */
@layer component {
  .mini.buttons .button,
  .mini.buttons .or,
  .mini.button {
    font-size: var(--mini);
  }
  .tiny.buttons .button,
  .tiny.buttons .or,
  .tiny.button {
    font-size: var(--tiny);
  }
  .small.buttons .button,
  .small.buttons .or,
  .small.button {
    font-size: var(--small);
  }
  .buttons .button,
  .buttons .or,
  .button {
    font-size: var(--medium);
  }
  .large.buttons .button,
  .large.buttons .or,
  .large.button {
    font-size: var(--large);
  }
  .big.buttons .button,
  .big.buttons .or,
  .big.button {
    font-size: var(--big);
  }
  .huge.buttons .button,
  .huge.buttons .or,
  .huge.button {
    font-size: var(--huge);
  }
  .massive.buttons .button,
  .massive.buttons .or,
  .massive.button {
    font-size: var(--massive);
  }
}

/* src/button/css/variations/social.css */
@layer component {
  .facebook.button {
    background-color: var(--facebook-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
    background-image: var(--colored-background-image);
    box-shadow: var(--colored-box-shadow);
  }
  .facebook.button:hover {
    background-color: var(--facebook-hover-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
  }
  .facebook.button:active {
    background-color: var(--facebook-down-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
  }
  .twitter.button {
    background-color: var(--twitter-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
    background-image: var(--colored-background-image);
    box-shadow: var(--colored-box-shadow);
  }
  .twitter.button:hover {
    background-color: var(--twitter-hover-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
  }
  .twitter.button:active {
    background-color: var(--twitter-down-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
  }
  .google.plus.button {
    background-color: var(--google-plus-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
    background-image: var(--colored-background-image);
    box-shadow: var(--colored-box-shadow);
  }
  .google.plus.button:hover {
    background-color: var(--google-plus-hover-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
  }
  .google.plus.button:active {
    background-color: var(--google-plus-down-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
  }
  .linkedin.button {
    background-color: var(--linked-in-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
  }
  .linkedin.button:hover {
    background-color: var(--linked-in-hover-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
  }
  .linkedin.button:active {
    background-color: var(--linked-in-down-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
  }
  .youtube.button {
    background-color: var(--youtube-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
    background-image: var(--colored-background-image);
    box-shadow: var(--colored-box-shadow);
  }
  .youtube.button:hover {
    background-color: var(--youtube-hover-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
  }
  .youtube.button:active {
    background-color: var(--youtube-down-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
  }
  .instagram.button {
    background-color: var(--instagram-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
    background-image: var(--colored-background-image);
    box-shadow: var(--colored-box-shadow);
  }
  .instagram.button:hover {
    background-color: var(--instagram-hover-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
  }
  .instagram.button:active {
    background-color: var(--instagram-down-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
  }
  .pinterest.button {
    background-color: var(--pinterest-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
    background-image: var(--colored-background-image);
    box-shadow: var(--colored-box-shadow);
  }
  .pinterest.button:hover {
    background-color: var(--pinterest-hover-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
  }
  .pinterest.button:active {
    background-color: var(--pinterest-down-color);
    color: var(--inverted-text-color);
    text-shadow: var(--inverted-text-shadow);
  }
  .vk.button {
    background-color: var(--vk-color);
    color: var(--white);
    background-image: var(--colored-background-image);
    box-shadow: var(--colored-box-shadow);
  }
  .vk.button:hover {
    background-color: var(--vk-hover-color);
    color: var(--white);
  }
  .vk.button:active {
    background-color: var(--vk-down-color);
    color: var(--white);
  }
}

/* src/button/css/variations/vertical.css */
@layer component {
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

/* src/button/css/button.css */
`;var Me=`<div class="{{ui}} button">
  {{slot}}
</div>
`;var Re={uiType:"element",name:"Button",description:"A button indicates possible user action",tagName:"button",content:[{name:"Text",looseCoupling:!0,couplesWith:["icon"],slot:"icon",description:"A button can can contain text content"},{name:"Icon",looseCoupling:!0,couplesWith:["icon"],slot:"icon",description:"A button can be formatted to include an icon"},{name:"Label",looseCoupling:!0,couplesWith:["label"],slot:"label",description:"A button can be formatted to include a label"},{name:"Or",slot:"or",description:"A button group can be formatted to show a conditional choice"}],types:[{name:"Emphasis",attribute:"emphasis",description:"A button can be formatted to show different levels of emphasis",adoptionLevel:1,options:[{name:"Primary",value:"primary",description:"This button should appear to be emphasized as the first action that should be taken over other options."},{name:"Secondary",value:"secondary",description:"This button should appear to be emphasized as a secondary option that should appear after other options"}]},{name:"Icon",attribute:"icon",description:"A button can appear with an icon",adoptionLevel:2,looseCoupling:!0,couplesWith:["icon"],distinctHTML:!0},{name:"Labeled",attribute:"labeled",description:"A button can appear specially formatted to attach to a label element",adoptionLevel:3,looseCoupling:!0,couplesWith:["label"],options:[{name:"Labeled",value:["labeled","right-labeled"],description:"A button can be formatted so that a label appears to the right"},{name:"Left Labeled",value:"left-labeled",description:"A button can be formatted so that a label appears to the left"}],distinctHTML:!0},{name:"Labeled Icon",description:"A button can be formatted so that the icon appears separately.",looseCoupling:!0,adoptionLevel:3,options:[{name:"Labeled",value:"labeled",description:"A button can be formatted so that the icon appears to the right"},{name:"Left Labeled",value:"left-labeled",description:"A button can be formatted so that the icon appears to the left"}],distinctHTML:!0},{name:"Toggle",description:"A button can be formatted to emphasize its active state",adoptionLevel:3,options:[{name:"Toggle",value:!0,description:"A button can be formatted to animate hidden content horizontally"}],distinctHTML:!0},{name:"Animated",description:"A button can animate to show hidden content",adoptionLevel:5,options:[{name:"Animated",value:"animated",description:"A button can be formatted to animate hidden content horizontally"},{name:"Vertical Animated",value:"vertical-animated",description:"A button can be formatted to animate hidden content vertically"},{name:"Fade Animated",value:"vertical-animated",description:"A button can be formatted to fade in hidden content"}],distinctHTML:!0}],states:[{name:"Hover",attribute:"hover",description:"A button can show it is currently hovered"},{name:"Focus",attribute:"focus",description:"A button can show it is currently focused by the keyboard"},{name:"Active",attribute:"active",description:"A button can show it is currently the activated"},{name:"Disabled",attribute:"disabled",description:"A button can show it is currently unable to be interacted with"},{name:"Loading",attribute:"loading",description:"A button can show a loading indicator"}],variations:[{name:"Attached",value:"attached",description:"A button can be attached",adoptionLevel:2,options:[{name:"Attached",value:"attached",description:"A button can appear attached both above and below"},{name:"Bottom Attached",value:"bottom-attached",description:"A button can appear attached to the bottom of other content"},{name:"Top Attached",value:"top-attached",description:"A button can appear attached to the top of other content"},{name:"Left Attached",value:"left-attached",description:"A button can appear attached to the left of other content"},{name:"Right Attached",value:"right-attached",description:"A button can appear attached to the right of other content"}]},{name:"Basic",value:"styling",description:"A button can be formatted to appear de-emphasized over other elements in the page.",adoptionLevel:3,options:[{name:"Basic",value:"basic",description:"A button can appear slightly less pronounced."},{name:"Very Basic",value:"very-basic",description:"A button can appear to be much less pronounced."}]},{name:"Circular",value:"circular",description:"A button can be formatted to appear circular.",adoptionLevel:3,options:[{name:"Circular",value:!0}]},{name:"Colored",value:"color",description:"A button can be colored",adoptionLevel:3,options:[{name:"Red",value:"red",description:"A button can be red"},{name:"Orange",value:"orange",description:"A button can be orange"},{name:"Yellow",value:"yellow",description:"A button can be yellow"},{name:"Olive",value:"olive",description:"A button can be olive"},{name:"Green",value:"green",description:"A button can be green"},{name:"Teal",value:"teal",description:"A button can be teal"},{name:"Blue",value:"blue",description:"A button can be blue"},{name:"Violet",value:"violet",description:"A button can be violet"},{name:"Purple",value:"purple",description:"A button can be purple"},{name:"Pink",value:"pink",description:"A button can be pink"},{name:"Brown",value:"brown",description:"A button can be brown"},{name:"Grey",value:"grey",description:"A button can be grey"},{name:"Black",value:"black",description:"A button can be black"}]},{name:"Compact",value:"compact",adoptionLevel:3,description:"A button can reduce its padding to fit into tighter spaces without adjusting its font size",options:[{name:"Compact",value:"compact",description:"A button can reduce its padding size slightly."},{name:"Very Compact",value:"very-compact",description:"A button can reduce its padding size greatly."}]},{name:"Social Site",value:"social",adoptionLevel:5,description:"A button can appear formatted with the brand colors of a social website",options:[{name:"Facebook",value:"facebook",description:"A button can link to facebook"},{name:"Twitter",value:"twitter",description:"A button can link to twitter"},{name:"Google Plus",value:"google plus",description:"A button can link to google plus"},{name:"Vk",value:"vk",description:"A button can link to vk"},{name:"Linkedin",value:"linkedin",description:"A button can link to linkedin"},{name:"Instagram",value:"instagram",description:"A button can link to instagram"},{name:"Youtube",value:"youtube",description:"A button can link to youtube"}]},{name:"Positive",value:"positive",adoptionLevel:2,description:"A button can appear to be associated with a positive action",options:[{name:"Positive",value:"positive",description:"A button be positive."},{name:"Subtle Positive",value:"subtle-positive",description:"A button can subtly hint at a positive action"}]},{name:"Negative",value:"negative",adoptionLevel:2,description:"A button can appear to be associated with a negative action",options:[{name:"Negative",value:"negative",description:"A button be negative."},{name:"Subtle Negative",value:"subtle-negative",description:"A button can subtly hint at a negative action"}]},{name:"Floated",value:"floated",adoptionLevel:1,description:"A button can be aligned to the left or right of its container",options:[{name:"Left Floated",value:["left-floated"],description:"A button can appear to the left of content."},{name:"Right Floated",value:"right-floated",description:"A button can appear to the right of content."}]},{name:"Fluid",value:"fluid",adoptionLevel:1,description:"A button can take the width of its container"},{name:"Size",value:"size",adoptionLevel:1,description:"A button can vary in size",options:[{name:"Mini",value:"mini",description:"An element can appear extremely small"},{name:"Tiny",value:"tiny",description:"An element can appear very small"},{name:"Small",value:"small",description:"An element can appear small"},{name:"Medium",value:"medium",description:"An element can appear normal sized"},{name:"Large",value:"large",description:"An element can appear larger than normal"},{name:"Big",value:"big",description:"An element can appear much larger than normal"},{name:"Huge",value:"huge",description:"An element can appear very much larger than normal"},{name:"Massive",value:"massive",description:"An element can appear extremely larger than normal"}]},{name:"Inverted",description:"A button can be formatted to appear on dark backgrounds",adoptionLevel:2,attribute:"inverted"}],supportsPlural:!0,pluralName:"Buttons",pluralTagName:"buttons",pluralDescription:"Buttons can exist together as a group",pluralVariations:["inverted","size","floated","compact","colored","attached"]};var ro=(r,t)=>({}),no=r=>{},ao={"click .button"(r,t,e){}},io=Yt({tagName:"ui-button",spec:Re,template:Me,css:Le,createInstance:ro,onCreated:no,events:ao});export{io as UIButton};
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

lit-html/directives/repeat.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=button.js.map
