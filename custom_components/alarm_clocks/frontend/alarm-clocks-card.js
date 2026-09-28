const e="alarm_clocks",t="alarm-clocks-card",i="alarm-clocks-card-editor",s=["mon","tue","wed","thu","fri","sat","sun"],n="disabled",o="armed",a="ringing",r="snoozed",l="pre_active",c="post_pending",d=["unavailable","unknown","none",""],h={disabled:"mdi:alarm-off",armed:"mdi:alarm-check",ringing:"mdi:bell-ring",snoozed:"mdi:alarm-snooze",pre_active:"mdi:weather-sunset-up",post_pending:"mdi:clock-end",unknown:"mdi:alarm-note"};function p(e,t,i,s){var n,o=arguments.length,a=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,s);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(a=(o<3?n(a):o>3?n(t,i,a):n(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a}"function"==typeof SuppressedError&&SuppressedError;const u=globalThis,m=u.ShadowRoot&&(void 0===u.ShadyCSS||u.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,_=Symbol(),g=new WeakMap;let v=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==_)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(m&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=g.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&g.set(t,e))}return e}toString(){return this.cssText}};const b=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new v(i,e,_)},f=m?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new v("string"==typeof e?e:e+"",void 0,_))(t)})(e):e,{is:$,defineProperty:y,getOwnPropertyDescriptor:w,getOwnPropertyNames:x,getOwnPropertySymbols:k,getPrototypeOf:A}=Object,S=globalThis,E=S.trustedTypes,T=E?E.emptyScript:"",C=S.reactiveElementPolyfillSupport,D=(e,t)=>e,z={toAttribute(e,t){switch(t){case Boolean:e=e?T:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},I=(e,t)=>!$(e,t),M={attribute:!0,type:String,converter:z,reflect:!1,useDefault:!1,hasChanged:I};Symbol.metadata??=Symbol("metadata"),S.litPropertyMetadata??=new WeakMap;let O=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=M){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&y(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:n}=w(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const o=s?.call(this);n?.call(this,t),this.requestUpdate(e,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??M}static _$Ei(){if(this.hasOwnProperty(D("elementProperties")))return;const e=A(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(D("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(D("properties"))){const e=this.properties,t=[...x(e),...k(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(f(e))}else void 0!==e&&t.push(f(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{if(m)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of t){const t=document.createElement("style"),s=u.litNonce;void 0!==s&&t.setAttribute("nonce",s),t.textContent=i.cssText,e.appendChild(t)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:z).toAttribute(t,i.type);this._$Em=e,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),n="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:z;this._$Em=s;const o=n.fromAttribute(t,e.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(e,t,i,s=!1,n){if(void 0!==e){const o=this.constructor;if(!1===s&&(n=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??I)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==n||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};O.elementStyles=[],O.shadowRootOptions={mode:"open"},O[D("elementProperties")]=new Map,O[D("finalized")]=new Map,C?.({ReactiveElement:O}),(S.reactiveElementVersions??=[]).push("2.1.2");const P=globalThis,N=e=>e,U=P.trustedTypes,H=U?U.createPolicy("lit-html",{createHTML:e=>e}):void 0,R="$lit$",j=`lit$${Math.random().toFixed(9).slice(2)}$`,L="?"+j,B=`<${L}>`,W=document,K=()=>W.createComment(""),q=e=>null===e||"object"!=typeof e&&"function"!=typeof e,V=Array.isArray,Z="[ \t\n\f\r]",F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Y=/-->/g,J=/>/g,G=RegExp(`>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),X=/'/g,Q=/"/g,ee=/^(?:script|style|textarea|title)$/i,te=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),ie=Symbol.for("lit-noChange"),se=Symbol.for("lit-nothing"),ne=new WeakMap,oe=W.createTreeWalker(W,129);function ae(e,t){if(!V(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==H?H.createHTML(t):t}const re=(e,t)=>{const i=e.length-1,s=[];let n,o=2===t?"<svg>":3===t?"<math>":"",a=F;for(let t=0;t<i;t++){const i=e[t];let r,l,c=-1,d=0;for(;d<i.length&&(a.lastIndex=d,l=a.exec(i),null!==l);)d=a.lastIndex,a===F?"!--"===l[1]?a=Y:void 0!==l[1]?a=J:void 0!==l[2]?(ee.test(l[2])&&(n=RegExp("</"+l[2],"g")),a=G):void 0!==l[3]&&(a=G):a===G?">"===l[0]?(a=n??F,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,r=l[1],a=void 0===l[3]?G:'"'===l[3]?Q:X):a===Q||a===X?a=G:a===Y||a===J?a=F:(a=G,n=void 0);const h=a===G&&e[t+1].startsWith("/>")?" ":"";o+=a===F?i+B:c>=0?(s.push(r),i.slice(0,c)+R+i.slice(c)+j+h):i+j+(-2===c?t:h)}return[ae(e,o+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class le{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let n=0,o=0;const a=e.length-1,r=this.parts,[l,c]=re(e,t);if(this.el=le.createElement(l,i),oe.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=oe.nextNode())&&r.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(R)){const t=c[o++],i=s.getAttribute(e).split(j),a=/([.?@])?(.*)/.exec(t);r.push({type:1,index:n,name:a[2],strings:i,ctor:"."===a[1]?ue:"?"===a[1]?me:"@"===a[1]?_e:pe}),s.removeAttribute(e)}else e.startsWith(j)&&(r.push({type:6,index:n}),s.removeAttribute(e));if(ee.test(s.tagName)){const e=s.textContent.split(j),t=e.length-1;if(t>0){s.textContent=U?U.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],K()),oe.nextNode(),r.push({type:2,index:++n});s.append(e[t],K())}}}else if(8===s.nodeType)if(s.data===L)r.push({type:2,index:n});else{let e=-1;for(;-1!==(e=s.data.indexOf(j,e+1));)r.push({type:7,index:n}),e+=j.length-1}n++}}static createElement(e,t){const i=W.createElement("template");return i.innerHTML=e,i}}function ce(e,t,i=e,s){if(t===ie)return t;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const o=q(t)?void 0:t._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(e),n._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(t=ce(e,n._$AS(e,t.values),n,s)),t}class de{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??W).importNode(t,!0);oe.currentNode=s;let n=oe.nextNode(),o=0,a=0,r=i[0];for(;void 0!==r;){if(o===r.index){let t;2===r.type?t=new he(n,n.nextSibling,this,e):1===r.type?t=new r.ctor(n,r.name,r.strings,this,e):6===r.type&&(t=new ge(n,this,e)),this._$AV.push(t),r=i[++a]}o!==r?.index&&(n=oe.nextNode(),o++)}return oe.currentNode=W,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class he{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=se,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ce(this,e,t),q(e)?e===se||null==e||""===e?(this._$AH!==se&&this._$AR(),this._$AH=se):e!==this._$AH&&e!==ie&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>V(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==se&&q(this._$AH)?this._$AA.nextSibling.data=e:this.T(W.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=le.createElement(ae(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new de(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=ne.get(e.strings);return void 0===t&&ne.set(e.strings,t=new le(e)),t}k(e){V(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const n of e)s===t.length?t.push(i=new he(this.O(K()),this.O(K()),this,this.options)):i=t[s],i._$AI(n),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=N(e).nextSibling;N(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class pe{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,n){this.type=1,this._$AH=se,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=se}_$AI(e,t=this,i,s){const n=this.strings;let o=!1;if(void 0===n)e=ce(this,e,t,0),o=!q(e)||e!==this._$AH&&e!==ie,o&&(this._$AH=e);else{const s=e;let a,r;for(e=n[0],a=0;a<n.length-1;a++)r=ce(this,s[i+a],t,a),r===ie&&(r=this._$AH[a]),o||=!q(r)||r!==this._$AH[a],r===se?e=se:e!==se&&(e+=(r??"")+n[a+1]),this._$AH[a]=r}o&&!s&&this.j(e)}j(e){e===se?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ue extends pe{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===se?void 0:e}}class me extends pe{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==se)}}class _e extends pe{constructor(e,t,i,s,n){super(e,t,i,s,n),this.type=5}_$AI(e,t=this){if((e=ce(this,e,t,0)??se)===ie)return;const i=this._$AH,s=e===se&&i!==se||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==se&&(i===se||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ge{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){ce(this,e)}}const ve=P.litHtmlPolyfillSupport;ve?.(le,he),(P.litHtmlVersions??=[]).push("3.3.3");const be=globalThis;let fe=class extends O{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let n=s._$litPart$;if(void 0===n){const e=i?.renderBefore??null;s._$litPart$=n=new he(t.insertBefore(K(),e),e,void 0,i??{})}return n._$AI(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ie}};fe._$litElement$=!0,fe.finalized=!0,be.litElementHydrateSupport?.({LitElement:fe});const $e=be.litElementPolyfillSupport;$e?.({LitElement:fe}),(be.litElementVersions??=[]).push("4.2.2");const ye=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},we={attribute:!0,type:String,converter:z,reflect:!1,hasChanged:I},xe=(e=we,t,i)=>{const{kind:s,metadata:n}=i;let o=globalThis.litPropertyMetadata.get(n);if(void 0===o&&globalThis.litPropertyMetadata.set(n,o=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),o.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const n=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,n,e,!0,i)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];t.call(this,i),this.requestUpdate(s,n,e,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ke(e){return(t,i)=>"object"==typeof i?xe(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function Ae(e){return ke({...e,state:!0,attribute:!1})}const Se=1;class Ee{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const Te=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends Ee{constructor(e){if(super(e),e.type!==Se||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const i=e.element.classList;for(const e of this.st)e in t||(i.remove(e),this.st.delete(e));for(const e in t){const s=!!t[e];s===this.st.has(e)||this.nt?.has(e)||(s?(i.add(e),this.st.add(e)):(i.remove(e),this.st.delete(e)))}return ie}}),Ce={"status.disabled":"Disabled","status.armed":"Armed","status.ringing":"Ringing","status.snoozed":"Snoozed","status.pre_active":"Pre phase","status.post_pending":"Post action","status.unknown":"Unknown","action.snooze":"Snooze","action.dismiss":"Dismiss","action.cancel":"Cancel","action.test":"Test","action.enable":"Turn alarm on","action.disable":"Turn alarm off","action.toggle_day":"Toggle {day}","action.decrease":"Decrease {label}","action.increase":"Increase {label}","action.expand":"Expand","action.collapse":"Collapse","label.no_alarm":"No alarm","label.one_shot":"One-shot","label.settings":"Settings","label.hours":"Hours","label.minutes":"Minutes","label.snooze_duration":"Snooze","label.pre_offset":"Pre","label.post_offset":"Post","label.auto_dismiss":"Auto off","label.ringing_since":"for {duration}","label.until":"until {time}","label.post_pending":"Post action pending","label.off":"off","label.no_time":"--:--","time.in":"in {duration}","time.ago":"{duration} ago","time.now":"now","time.today":"Today","time.tomorrow":"Tomorrow","unit.day":"d","unit.hour":"h","unit.minute":"min","unit.minutes_short":"min","error.unavailable":"This alarm is currently unavailable.","error.no_alarms":"No alarm clocks found.","editor.devices":"Alarms (empty = all)","editor.name":"Name (optional)","editor.title":"Title (optional)","editor.show_days":"Show weekdays","editor.show_next_alarm":"Show next alarm","editor.show_settings":"Show settings","editor.minute_step":"Minute step","editor.show_test_button":"Show test button","editor.hide_disabled":"Hide when disabled","editor.expandable":"Allow collapsing","editor.accordion":"Only one row open","editor.expanded":"Start rows expanded","editor.device_expanded":"Start expanded","editor.add_device":"Add alarm clock","editor.edit_device":"Edit","editor.remove_device":"Remove","editor.back":"Back","editor.pick_device":"Pick an alarm clock"},De={de:{"status.disabled":"Deaktiviert","status.armed":"Bereit","status.ringing":"Klingelt","status.snoozed":"Schlummert","status.pre_active":"Vorlauf","status.post_pending":"Nachlauf","status.unknown":"Unbekannt","action.snooze":"Schlummern","action.dismiss":"Ausschalten","action.cancel":"Abbrechen","action.test":"Testen","action.enable":"Wecker einschalten","action.disable":"Wecker ausschalten","action.toggle_day":"{day} umschalten","action.decrease":"{label} verringern","action.increase":"{label} erhöhen","action.expand":"Aufklappen","action.collapse":"Zuklappen","label.no_alarm":"Kein Alarm","label.one_shot":"Einmalig","label.settings":"Einstellungen","label.hours":"Stunden","label.minutes":"Minuten","label.snooze_duration":"Snooze","label.pre_offset":"Vorlauf","label.post_offset":"Nachlauf","label.auto_dismiss":"Auto-Aus","label.ringing_since":"seit {duration}","label.until":"bis {time}","label.post_pending":"Post-Aktion läuft","label.off":"aus","label.no_time":"--:--","time.in":"in {duration}","time.ago":"vor {duration}","time.now":"jetzt","time.today":"Heute","time.tomorrow":"Morgen","unit.day":"Tg.","unit.hour":"Std.","unit.minute":"Min.","unit.minutes_short":"min","error.unavailable":"Der Wecker ist derzeit nicht verfügbar.","error.no_alarms":"Keine Wecker gefunden.","editor.devices":"Wecker (leer = alle)","editor.name":"Name (optional)","editor.title":"Titel (optional)","editor.show_days":"Wochentage anzeigen","editor.show_next_alarm":"Nächsten Alarm anzeigen","editor.show_settings":"Einstellungen anzeigen","editor.minute_step":"Minutenschritt","editor.show_test_button":"Test-Button anzeigen","editor.hide_disabled":"Ausblenden, wenn deaktiviert","editor.expandable":"Auf-/Zuklappen erlauben","editor.accordion":"Nur eine Zeile offen","editor.expanded":"Zeilen aufgeklappt starten","editor.device_expanded":"Aufgeklappt starten","editor.add_device":"Wecker hinzufügen","editor.edit_device":"Bearbeiten","editor.remove_device":"Entfernen","editor.back":"Zurück","editor.pick_device":"Wecker auswählen"},en:Ce};function ze(e){return(e?.locale?.language??e?.language??"en").split("-")[0].toLowerCase()}function Ie(e){const t=De[ze(e)]??Ce;return(e,i)=>{let s=t[e]??Ce[e]??e;if(i)for(const[e,t]of Object.entries(i))s=s.replace(`{${e}}`,String(t));return s}}function Me(e){if(!e||d.includes(e.state))return;const t=new Date(e.state);return Number.isNaN(t.getTime())?void 0:t}function Oe(e){if(!e||d.includes(e.state))return;const t=/^(\d{1,2}):(\d{2})/.exec(e.state);if(!t)return;const i=Number(t[1]),s=Number(t[2]);return i>23||s>59?void 0:{hours:i,minutes:s}}function Pe(e,t){const i=Math.max(1,Math.round(Math.abs(e)/6e4)),s=Math.floor(i/1440),n=Math.floor(i%1440/60),o=i%60,a=[];return s>0?(a.push(`${s} ${t("unit.day")}`),n>0&&a.push(`${n} ${t("unit.hour")}`)):n>0?(a.push(`${n} ${t("unit.hour")}`),o>0&&a.push(`${o} ${t("unit.minute")}`)):a.push(`${o} ${t("unit.minute")}`),a.join(" ")}function Ne(e,t,i){const s=e.getTime()-t;if(Math.abs(s)<3e4)return i("time.now");const n=Pe(s,i);return i(s>0?"time.in":"time.ago",{duration:n})}function Ue(e,t){return function(e){return new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit"})}(t).format(e)}const He=new Map;function Re(e,t){const i=`${e}|${t}`,s=He.get(i);if(s)return s;const n=new Intl.DateTimeFormat(e,{weekday:t}),o=[];for(let e=0;e<7;e+=1)o.push(n.format(new Date(Date.UTC(2024,0,1+e,12))));return He.set(i,o),o}const je=b`
  :host {
    --alarm-clocks-accent: var(--state-switch-active-color, var(--primary-color));
    --alarm-clocks-disabled: var(--state-inactive-color, var(--disabled-text-color));
    --alarm-clocks-ringing: var(--error-color, #db4437);
    --alarm-clocks-snoozed: var(--warning-color, #ffa600);
    --alarm-clocks-armed: var(--success-color, var(--primary-color));
    --alarm-clocks-surface: var(--ha-card-background, var(--card-background-color));
    --alarm-clocks-chip-background: var(--secondary-background-color);
    --alarm-clocks-radius: var(--ha-card-border-radius, 12px);
    --alarm-clocks-tap-target: 40px;
  }
`,Le=b`
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: var(--alarm-clocks-tap-target);
    padding: 0 16px;
    border: none;
    border-radius: 999px;
    background: var(--alarm-clocks-chip-background);
    color: var(--primary-text-color);
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 500;
    line-height: 1;
    cursor: pointer;
    transition: background-color 180ms ease-out, opacity 180ms ease-out;
    -webkit-tap-highlight-color: transparent;
  }

  .btn:hover:not(:disabled) {
    background: var(--divider-color);
  }

  .btn:disabled {
    opacity: 0.45;
    cursor: default;
  }

  .btn.primary {
    background: var(--alarm-clocks-accent);
    color: var(--text-primary-color, #fff);
  }

  .btn.danger {
    background: var(--alarm-clocks-ringing);
    color: var(--text-primary-color, #fff);
  }

  .btn:focus-visible,
  .icon-btn:focus-visible {
    outline: 2px solid var(--alarm-clocks-accent);
    outline-offset: 2px;
  }

  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--alarm-clocks-tap-target);
    height: var(--alarm-clocks-tap-target);
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--secondary-text-color);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .icon-btn:hover:not(:disabled) {
    background: var(--alarm-clocks-chip-background);
  }

  .icon-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }
`,Be=b`
  .error {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    color: var(--primary-text-color);
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .error ha-icon {
    flex: 0 0 auto;
    color: var(--warning-color, #ffa600);
  }
`;let We=class extends fe{constructor(){super(...arguments),this.days=[],this.compact=!1}render(){if(!this.days.length)return se;const e=ze(this.hass),t=Ie(this.hass),i=Re(e,"short"),s=Re(e,"long"),n=Re(e,"narrow");return te`
      <div class="days" role="group">
        ${this.days.map(e=>{const o=this.compact?n[e.index]:i[e.index];return te`
            <button
              type="button"
              role="switch"
              class=${Te({day:!0,active:e.active})}
              aria-checked=${e.active?"true":"false"}
              aria-label=${t("action.toggle_day",{day:s[e.index]})}
              title=${s[e.index]}
              ?disabled=${!e.available}
              @click=${()=>this._toggle(e)}
            >
              <span aria-hidden="true">${o}</span>
            </button>
          `})}
      </div>
    `}_toggle(e){e.entityId&&this.dispatchEvent(new CustomEvent("day-toggled",{detail:{entityId:e.entityId},bubbles:!0,composed:!0}))}};We.styles=[je,b`
      .days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 6px;
      }

      .day {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 0;
        min-height: var(--alarm-clocks-tap-target);
        padding: 0 2px;
        border: none;
        border-radius: 10px;
        background: var(--alarm-clocks-chip-background);
        color: var(--secondary-text-color);
        font-family: inherit;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: background-color 160ms ease-out, color 160ms ease-out;
        -webkit-tap-highlight-color: transparent;
      }

      .day.active {
        background: var(--alarm-clocks-accent);
        color: var(--text-primary-color, #fff);
        /* Not colour alone: active days are also bold and outlined. */
        font-weight: 700;
        box-shadow: inset 0 0 0 2px var(--alarm-clocks-accent);
      }

      .day:disabled {
        opacity: 0.4;
        cursor: default;
      }

      .day:focus-visible {
        outline: 2px solid var(--alarm-clocks-accent);
        outline-offset: 2px;
      }
    `],p([ke({attribute:!1})],We.prototype,"hass",void 0),p([ke({attribute:!1})],We.prototype,"days",void 0),p([ke({type:Boolean})],We.prototype,"compact",void 0),We=p([ye("alarm-clocks-weekday-picker")],We);let Ke=class extends fe{constructor(){super(...arguments),this.hours=0,this.minutes=0,this.minuteStep=5,this.disabled=!1,this._repeatDelay=180,this._stopHold=()=>{void 0!==this._holdTimer&&(window.clearTimeout(this._holdTimer),this._holdTimer=void 0),void 0!==this._repeatTimer&&(window.clearTimeout(this._repeatTimer),this._repeatTimer=void 0)}}disconnectedCallback(){super.disconnectedCallback(),this._stopHold()}render(){const e=Ie(this.hass);return te`
      <div class="stepper" ?data-disabled=${this.disabled}>
        ${this._renderSegment("hours",this.hours,23,e("label.hours"))}
        <span class="colon" aria-hidden="true">:</span>
        ${this._renderSegment("minutes",this.minutes,59,e("label.minutes"))}
      </div>
    `}_renderSegment(e,t,i,s){const n=Ie(this.hass);return te`
      <div class="segment">
        <button
          type="button"
          class="arrow"
          tabindex="-1"
          aria-label=${n("action.increase",{label:s})}
          ?disabled=${this.disabled}
          @pointerdown=${t=>this._startHold(t,e,1)}
          @pointerup=${this._stopHold}
          @pointercancel=${this._stopHold}
          @pointerleave=${this._stopHold}
        >
          <ha-icon icon="mdi:chevron-up"></ha-icon>
        </button>

        <div
          class="value"
          role="spinbutton"
          tabindex=${this.disabled?-1:0}
          aria-label=${s}
          aria-valuenow=${t}
          aria-valuemin="0"
          aria-valuemax=${i}
          aria-valuetext=${String(t).padStart(2,"0")}
          @keydown=${t=>this._onKeyDown(t,e)}
          @wheel=${t=>this._onWheel(t,e)}
        >
          ${String(t).padStart(2,"0")}
        </div>

        <button
          type="button"
          class="arrow"
          tabindex="-1"
          aria-label=${n("action.decrease",{label:s})}
          ?disabled=${this.disabled}
          @pointerdown=${t=>this._startHold(t,e,-1)}
          @pointerup=${this._stopHold}
          @pointercancel=${this._stopHold}
          @pointerleave=${this._stopHold}
        >
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </button>
      </div>
    `}_step(e,t){if(this.disabled)return;let{hours:i,minutes:s}=this;if("hours"===e)i=(i+t+24)%24;else{const e=Math.max(1,Math.round(this.minuteStep));s=((Math.round(s/e)*e+t*e)%60+60)%60}this.hours=i,this.minutes=s,this.dispatchEvent(new CustomEvent("time-changed",{detail:{hours:i,minutes:s},bubbles:!0,composed:!0}))}_startHold(e,t,i){this.disabled||(e.preventDefault(),e.currentTarget.setPointerCapture?.(e.pointerId),this._step(t,i),this._repeatDelay=180,this._holdTimer=window.setTimeout(()=>{const e=()=>{this._step(t,i),this._repeatDelay=Math.max(60,this._repeatDelay-12),this._repeatTimer=window.setTimeout(e,this._repeatDelay)};e()},450))}_onWheel(e,t){const i=this.shadowRoot?.activeElement===e.currentTarget;!this.disabled&&i&&0!==e.deltaY&&(e.preventDefault(),this._step(t,e.deltaY<0?1:-1))}_onKeyDown(e,t){"ArrowUp"===e.key?(e.preventDefault(),this._step(t,1)):"ArrowDown"===e.key&&(e.preventDefault(),this._step(t,-1))}};Ke.styles=[je,Le,b`
      .stepper {
        display: flex;
        align-items: center;
        gap: 2px;
        user-select: none;
      }

      .stepper[data-disabled] {
        opacity: 0.6;
      }

      .segment {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-width: 56px;
        height: 30px;
        padding: 0;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: var(--secondary-text-color);
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }

      .arrow:hover:not(:disabled) {
        background: var(--alarm-clocks-chip-background);
      }

      .arrow:active:not(:disabled) {
        background: var(--divider-color);
      }

      .arrow:disabled {
        opacity: 0.4;
        cursor: default;
      }

      .arrow ha-icon {
        --mdc-icon-size: 22px;
      }

      .value {
        min-width: 56px;
        padding: 2px 4px;
        border-radius: 8px;
        color: var(--primary-text-color);
        font-size: 2.4rem;
        font-weight: 300;
        font-variant-numeric: tabular-nums;
        line-height: 1.1;
        letter-spacing: -0.02em;
        text-align: center;
        cursor: pointer;
      }

      .value:focus-visible {
        outline: 2px solid var(--alarm-clocks-accent);
        outline-offset: 2px;
      }

      .colon {
        align-self: center;
        margin-top: 2px;
        color: var(--primary-text-color);
        font-size: 2.4rem;
        font-weight: 300;
        line-height: 1.1;
      }

      @media (max-width: 340px) {
        .value,
        .colon {
          font-size: 2rem;
        }

        .arrow {
          min-width: 48px;
        }
      }
    `],p([ke({attribute:!1})],Ke.prototype,"hass",void 0),p([ke({type:Number})],Ke.prototype,"hours",void 0),p([ke({type:Number})],Ke.prototype,"minutes",void 0),p([ke({type:Number})],Ke.prototype,"minuteStep",void 0),p([ke({type:Boolean})],Ke.prototype,"disabled",void 0),Ke=p([ye("alarm-clocks-time-stepper")],Ke);let qe=class extends fe{constructor(){super(...arguments),this._openMoreInfo=()=>{this.dispatchEvent(new CustomEvent("setting-more-info",{detail:{entityId:this.setting.entityId},bubbles:!0,composed:!0}))}}render(){const e=Ie(this.hass),t=e(this.setting.labelKey),i=this.setting.zeroMeansOff&&0===this.setting.value?e("label.off"):`${this.setting.value} ${e("unit.minutes_short")}`;return te`
      <div class="row">
        <span class="label">${t}</span>
        <div class="control">
          <button
            type="button"
            class="icon-btn"
            aria-label=${e("action.decrease",{label:t})}
            ?disabled=${this.setting.value<=this.setting.min}
            @click=${()=>this._step(-1)}
          >
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>
          <button
            type="button"
            class="value"
            aria-label=${`${t}: ${i}`}
            @click=${this._openMoreInfo}
          >
            ${i}
          </button>
          <button
            type="button"
            class="icon-btn"
            aria-label=${e("action.increase",{label:t})}
            ?disabled=${this.setting.value>=this.setting.max}
            @click=${()=>this._step(1)}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
      </div>
    `}_step(e){const t=Math.min(this.setting.max,Math.max(this.setting.min,this.setting.value+e*this.setting.step));t!==this.setting.value&&this.dispatchEvent(new CustomEvent("setting-changed",{detail:{entityId:this.setting.entityId,value:t},bubbles:!0,composed:!0}))}};function Ve(e,t,i){e.dispatchEvent(new CustomEvent(t,{detail:i,bubbles:!0,composed:!0,cancelable:!1}))}function Ze(e,t){return e.callService("switch","toggle",{},{entity_id:t})}qe.styles=[je,Le,b`
      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        min-height: 44px;
      }

      .label {
        color: var(--secondary-text-color);
        font-size: 0.9rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .control {
        display: flex;
        align-items: center;
        flex: 0 0 auto;
        gap: 2px;
      }

      .value {
        min-width: 64px;
        padding: 6px 8px;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: var(--primary-text-color);
        font-family: inherit;
        font-size: 0.9rem;
        font-variant-numeric: tabular-nums;
        text-align: center;
        cursor: pointer;
      }

      .value:hover {
        background: var(--alarm-clocks-chip-background);
      }

      .value:focus-visible {
        outline: 2px solid var(--alarm-clocks-accent);
        outline-offset: 2px;
      }

      ha-icon {
        --mdc-icon-size: 20px;
      }
    `],p([ke({attribute:!1})],qe.prototype,"hass",void 0),p([ke({attribute:!1})],qe.prototype,"setting",void 0),qe=p([ye("alarm-clocks-setting-row")],qe);let Fe=class extends fe{constructor(){super(...arguments),this.now=Date.now(),this.narrow=!1,this.expanded=!1,this.expandable=!0,this.showDays=!0,this.showNextAlarm=!0,this.showSettings=!0,this.showTestButton=!1,this.minuteStep=5,this._pendingSince=0,this._onTimeChanged=e=>{this._pendingTime={hours:e.detail.hours,minutes:e.detail.minutes},this._pendingSince=Date.now(),void 0!==this._timeTimer&&window.clearTimeout(this._timeTimer),this._timeTimer=window.setTimeout(()=>{this._timeTimer=void 0;const e=this.view?.entities.alarmTime,t=this._pendingTime;this.hass&&e&&t&&function(e,t,i,s){const n=`${String(i).padStart(2,"0")}:${String(s).padStart(2,"0")}:00`;e.callService("time","set_value",{time:n},{entity_id:t})}(this.hass,e,t.hours,t.minutes)},600)},this._onExpandClick=()=>{const e=this.view?.deviceId;e&&this.dispatchEvent(new CustomEvent("toggle-expand",{detail:{deviceId:e},bubbles:!0,composed:!0}))},this._openInfo=()=>{const e=this.view?.entities.status??this.view?.entities.enabled;this._openEntity(e)},this._onDayToggled=e=>{this.hass&&Ze(this.hass,e.detail.entityId)},this._onSettingChanged=e=>{var t,i,s;this.hass&&(t=this.hass,i=e.detail.entityId,s=e.detail.value,t.callService("number","set_value",{value:s},{entity_id:i}))},this._onSettingMoreInfo=e=>{this._openEntity(e.detail.entityId)}}render(){const e=this.hass,t=this.view;if(!e||!t)return se;const i=Ie(e);return this._settlePendingTime(t),te`
      <div
        class=${Te({item:!0,[`status-${t.status}`]:!0,disabled:!t.enabled})}
      >
        <div class="row">
          <div class="icon" aria-hidden="true">
            <ha-icon icon=${h[t.status]??h.unknown}></ha-icon>
          </div>
          ${this.expanded?this._renderExpandedInfo(t,i):this._renderCollapsedInfo(t,i)}
          ${this.expanded?this._renderToggle(t,i):this._renderCollapsedRight(t,i)}
          ${this._renderExpandButton(i)}
        </div>
        ${this.expanded?this._renderBody(t,i):se}
      </div>
    `}_renderCollapsedInfo(e,t){const i=ze(this.hass);return te`
      <button type="button" class="info" @click=${this._openInfo}>
        <span class="name">${e.name}</span>
        <span class="sub">${this._subtitle(e,t,i)}</span>
      </button>
    `}_renderCollapsedRight(e,t){const i=e.alarmTime?`${String(e.alarmTime.hours).padStart(2,"0")}:${String(e.alarmTime.minutes).padStart(2,"0")}`:t("label.no_time");return te`
      <span class="time">${i}</span>
      ${e.canDismiss?te`
            <div class="row-actions">
              ${e.canSnooze?te`<button
                      type="button"
                      class="icon-btn"
                      aria-label=${t("action.snooze")}
                      title=${t("action.snooze")}
                      @click=${()=>this._snooze(e)}
                    >
                      <ha-icon icon="mdi:alarm-snooze"></ha-icon>
                    </button>`:se}
              <button
                type="button"
                class="icon-btn danger-icon"
                aria-label=${t(this._dismissLabelKey(e))}
                title=${t(this._dismissLabelKey(e))}
                @click=${()=>this._dismiss(e)}
              >
                <ha-icon icon="mdi:alarm-off"></ha-icon>
              </button>
            </div>
          `:this._renderToggle(e,t)}
    `}_dismissLabelKey(e){return e.status===a||e.status===r?"action.dismiss":"action.cancel"}_subtitle(e,t,i){return e.status===a||e.status===c?t(`status.${e.status}`):this.showNextAlarm&&e.nextAlarm?e.status===r?`${t("status.snoozed")} · ${t("label.until",{time:Ue(e.nextAlarm,i)})}`:Ne(e.nextAlarm,this.now,t):t(`status.${e.status}`)}_renderExpandedInfo(e,t){const i=t(`status.${e.status}`);return te`
      <button type="button" class="info title" @click=${this._openInfo} title=${e.name}>
        <span class="name">${e.name}</span>
        <span class="status">
          <span class="dot" aria-hidden="true"></span>${i}
        </span>
      </button>
    `}_renderBody(e,t){return te`
      <div class="body">
        ${this._renderHero(e,t)}
        ${this.showDays?this._renderDays(e):se}
        ${this._renderActions(e,t)}
        ${this.showSettings&&e.settings.length?this._renderSettings(e):se}
      </div>
    `}_renderHero(e,t){const i=ze(this.hass),s=Boolean(e.entities.alarmTime),n=this._pendingTime??e.alarmTime;return n?te`
      <div class="hero">
        <alarm-clocks-time-stepper
          .hass=${this.hass}
          .hours=${n.hours}
          .minutes=${n.minutes}
          .minuteStep=${this.minuteStep}
          .disabled=${!s}
          @time-changed=${this._onTimeChanged}
        ></alarm-clocks-time-stepper>
        <div class="meta">${this._renderMeta(e,t,i)}</div>
      </div>
    `:te`
        <div class="hero">
          <span class="no-time">${t("label.no_time")}</span>
          <div class="meta">${this._renderMeta(e,t,i)}</div>
        </div>
      `}_settlePendingTime(e){const t=this._pendingTime;if(!t)return;const i=e.alarmTime?.hours===t.hours&&e.alarmTime?.minutes===t.minutes,s=Date.now()-this._pendingSince>15e3;(i||s)&&(this._pendingTime=void 0)}_renderMeta(e,t,i){if(!this.showNextAlarm)return se;if(e.status===a){const i=e.ringingSince?t("label.ringing_since",{duration:Pe(this.now-e.ringingSince.getTime(),t)}):t("status.ringing");return te`<span class="primary">${i}</span>`}if(e.status===c)return te`<span class="primary">${t("label.post_pending")}</span>`;if(!e.nextAlarm)return te`<span class="primary muted">${t("label.no_alarm")}</span>`;const s=Ne(e.nextAlarm,this.now,t),n=e.status===r?t("label.until",{time:Ue(e.nextAlarm,i)}):function(e,t,i,s){const n=new Date(t),o=new Date(n.getFullYear(),n.getMonth(),n.getDate()).getTime(),a=Math.floor((e.getTime()-o)/864e5),r=Ue(e,i);return 0===a?`${s("time.today")}, ${r}`:1===a?`${s("time.tomorrow")}, ${r}`:`${new Intl.DateTimeFormat(i,{weekday:"short"}).format(e)}, ${r}`}(e.nextAlarm,this.now,i,t);return te`
      <span class="primary">${s}</span>
      <span class="secondary">${n}</span>
      ${e.isOneShot?te`<span class="badge">${t("label.one_shot")}</span>`:se}
    `}_renderDays(e){return te`
      <alarm-clocks-weekday-picker
        .hass=${this.hass}
        .days=${e.days}
        .compact=${this.narrow}
        @day-toggled=${this._onDayToggled}
      ></alarm-clocks-weekday-picker>
    `}_renderActions(e,t){const i=this.showTestButton&&!e.canDismiss;return e.canDismiss||i?te`
      <div class="actions">
        ${e.canSnooze?te`<button
              type="button"
              class="btn"
              ?disabled=${!e.entities.snoozeButton&&!e.entities.status}
              @click=${()=>this._snooze(e)}
            >
              <ha-icon icon="mdi:alarm-snooze"></ha-icon>${t("action.snooze")}
            </button>`:se}
        ${e.canDismiss?te`<button type="button" class="btn danger" @click=${()=>this._dismiss(e)}>
              <ha-icon icon="mdi:alarm-off"></ha-icon>${t(this._dismissLabelKey(e))}
            </button>`:se}
        ${i?te`<button
              type="button"
              class="btn"
              ?disabled=${!e.canTest}
              @click=${()=>this._test(e)}
            >
              <ha-icon icon="mdi:play-circle-outline"></ha-icon>${t("action.test")}
            </button>`:se}
      </div>
    `:se}_renderSettings(e){return te`
      <div class="settings">
        ${e.settings.map(e=>te`
            <alarm-clocks-setting-row
              .hass=${this.hass}
              .setting=${e}
              @setting-changed=${this._onSettingChanged}
              @setting-more-info=${this._onSettingMoreInfo}
            ></alarm-clocks-setting-row>
          `)}
      </div>
    `}_renderToggle(e,t){return e.entities.enabled?te`
      <button
        type="button"
        role="switch"
        class=${Te({toggle:!0,on:e.enabled})}
        aria-checked=${e.enabled?"true":"false"}
        aria-label=${`${e.name}: ${t(e.enabled?"action.disable":"action.enable")}`}
        @click=${()=>this._toggle(e)}
      >
        <span class="knob"></span>
      </button>
    `:se}_renderExpandButton(e){return this.expandable?te`
      <button
        type="button"
        class="icon-btn expand-btn"
        aria-expanded=${this.expanded?"true":"false"}
        aria-label=${e(this.expanded?"action.collapse":"action.expand")}
        @click=${this._onExpandClick}
      >
        <ha-icon icon=${this.expanded?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </button>
    `:se}_openEntity(e){e&&function(e,t){Ve(e,"hass-more-info",{entityId:t})}(this,e)}_toggle(e){this.hass&&e.entities.enabled&&Ze(this.hass,e.entities.enabled)}_snooze(t){var i,s;this.hass&&(i=this.hass,s=t.deviceId,i.callService(e,"snooze",{},{device_id:s}))}_dismiss(t){var i,s;this.hass&&(i=this.hass,s=t.deviceId,i.callService(e,"dismiss",{},{device_id:s}))}_test(t){var i,s;this.hass&&(i=this.hass,s=t.deviceId,i.callService(e,"trigger_alarm",{},{device_id:s}))}};function Ye(e){return"string"==typeof e?{device_id:e}:e}Fe.styles=[je,Le,b`
      :host {
        display: block;
        /*
         * The row's own rendered width, not the viewport's: a card can be a
         * narrow column in an otherwise wide window (a grid layout, a
         * sidebar), where a viewport media query would never fire.
         */
        container-type: inline-size;
      }

      .item {
        --status-color: var(--alarm-clocks-disabled);
      }

      .item.status-armed,
      .item.status-pre_active,
      .item.status-post_pending {
        --status-color: var(--alarm-clocks-armed);
      }

      .item.status-ringing {
        --status-color: var(--alarm-clocks-ringing);
      }

      .item.status-snoozed {
        --status-color: var(--alarm-clocks-snoozed);
      }

      .row {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 56px;
        padding: 8px;
      }

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: var(--alarm-clocks-chip-background);
        background: color-mix(in srgb, var(--status-color) 18%, transparent);
        color: var(--status-color);
      }

      .icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .info {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        min-width: 0;
        padding: 4px 0;
        border: none;
        background: transparent;
        color: inherit;
        font-family: inherit;
        text-align: left;
        cursor: pointer;
      }

      .info:focus-visible {
        outline: 2px solid var(--alarm-clocks-accent);
        outline-offset: 2px;
        border-radius: 6px;
      }

      .name {
        max-width: 100%;
        color: var(--primary-text-color);
        font-size: 0.95rem;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .title .name {
        font-size: 1rem;
        font-weight: 600;
      }

      .sub {
        max-width: 100%;
        color: var(--secondary-text-color);
        font-size: 0.8rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--secondary-text-color);
        font-size: 0.82rem;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--status-color);
      }

      .time {
        flex: 0 0 auto;
        color: var(--primary-text-color);
        font-size: 1.05rem;
        font-variant-numeric: tabular-nums;
      }

      .row-actions {
        display: flex;
        flex: 0 0 auto;
        gap: 2px;
      }

      .danger-icon {
        color: var(--alarm-clocks-ringing);
      }

      .expand-btn {
        flex: 0 0 auto;
      }

      .expand-btn ha-icon {
        --mdc-icon-size: 20px;
      }

      .toggle {
        position: relative;
        flex: 0 0 auto;
        width: 46px;
        height: 28px;
        padding: 0;
        border: none;
        border-radius: 999px;
        background: var(--alarm-clocks-chip-background);
        cursor: pointer;
        transition: background-color 180ms ease-out;
        -webkit-tap-highlight-color: transparent;
      }

      .toggle.on {
        background: var(--alarm-clocks-accent);
      }

      .toggle:focus-visible {
        outline: 2px solid var(--alarm-clocks-accent);
        outline-offset: 2px;
      }

      .knob {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: var(--card-background-color, #fff);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        transition: transform 180ms ease-out;
      }

      .toggle.on .knob {
        transform: translateX(18px);
      }

      .body {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 0 8px 16px;
      }

      .hero {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 4px 16px;
      }

      .no-time {
        color: var(--secondary-text-color);
        font-size: 2.4rem;
        font-weight: 300;
        line-height: 1.1;
      }

      .item.disabled alarm-clocks-time-stepper {
        opacity: 0.75;
      }

      .meta {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }

      .meta .primary {
        color: var(--primary-text-color);
        font-size: 0.95rem;
        font-weight: 500;
      }

      .meta .primary.muted {
        color: var(--secondary-text-color);
        font-weight: 400;
      }

      .meta .secondary {
        color: var(--secondary-text-color);
        font-size: 0.82rem;
      }

      .badge {
        align-self: flex-start;
        margin-top: 2px;
        padding: 2px 8px;
        border-radius: 999px;
        background: var(--alarm-clocks-chip-background);
        color: var(--secondary-text-color);
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .actions .btn {
        flex: 1 1 130px;
      }

      .actions ha-icon {
        --mdc-icon-size: 20px;
      }

      .settings {
        display: flex;
        flex-direction: column;
        gap: 2px;
        border-top: 1px solid var(--divider-color);
        padding-top: 6px;
      }

      @container (max-width: 340px) {
        .time {
          display: none;
        }

        .actions .btn {
          flex: 1 1 100%;
        }
      }
    `],p([ke({attribute:!1})],Fe.prototype,"hass",void 0),p([ke({attribute:!1})],Fe.prototype,"view",void 0),p([ke({type:Number})],Fe.prototype,"now",void 0),p([ke({type:Boolean})],Fe.prototype,"narrow",void 0),p([ke({type:Boolean})],Fe.prototype,"expanded",void 0),p([ke({type:Boolean})],Fe.prototype,"expandable",void 0),p([ke({type:Boolean})],Fe.prototype,"showDays",void 0),p([ke({type:Boolean})],Fe.prototype,"showNextAlarm",void 0),p([ke({type:Boolean})],Fe.prototype,"showSettings",void 0),p([ke({type:Boolean})],Fe.prototype,"showTestButton",void 0),p([ke({type:Number})],Fe.prototype,"minuteStep",void 0),p([Ae()],Fe.prototype,"_pendingTime",void 0),Fe=p([ye("alarm-clocks-item")],Fe);const Je={"switch.enabled":"enabled","time.alarm_time":"alarmTime","number.snooze_duration":"snoozeDuration","number.pre_offset":"preOffset","number.post_offset":"postOffset","number.auto_dismiss":"autoDismiss","binary_sensor.ringing":"ringing","binary_sensor.snooze_active":"snoozeActive","sensor.next_alarm":"nextAlarm","sensor.state":"status","sensor.snooze_until":"snoozeUntil","button.snooze":"snoozeButton","button.dismiss":"dismissButton",...Object.fromEntries(s.map((e,t)=>[`switch.day_${e}`,`day${t}`]))};function Ge(e){return e.split(".",1)[0]}function Xe(t){const i=new Set;for(const s of Object.values(t.entities??{}))s.platform===e&&s.device_id&&i.add(s.device_id);return[...i]}function Qe(e,t,i){const s=e.devices?.[t],n=s?.name_by_user||s?.name;if(n)return n;const o=i.status?e.states[i.status]:void 0;return o?.attributes.friendly_name??t}function et(e,t){return t?e.states[t]:void 0}function tt(e){return!!e&&!d.includes(e.state)}function it(e,t,i,s,n){const o=t[i],a=et(e,o),r=function(e){if(!tt(e))return;const t=Number(e.state);return Number.isFinite(t)?t:void 0}(a);if(o&&void 0!==r)return{role:i,labelKey:s,entityId:o,value:r,min:"number"==typeof a.attributes.min?a.attributes.min:0,max:"number"==typeof a.attributes.max?a.attributes.max:999,step:"number"==typeof a.attributes.step?a.attributes.step:1,zeroMeansOff:n}}function st(t,i){const d=function(t,i){const s={};for(const n of Object.values(t.entities??{})){if(n.device_id!==i||n.platform!==e)continue;if(!n.translation_key)continue;const t=Je[`${Ge(n.entity_id)}.${n.translation_key}`];t&&(s[t]=n.entity_id)}return s}(t,i),{status:h,available:p}=function(e,t){const i=et(e,t.status);if(tt(i))return{status:i.state,available:!0};const s=et(e,t.ringing),l=et(e,t.snoozeActive),c=et(e,t.enabled);return"on"===s?.state?{status:a,available:!0}:"on"===l?.state?{status:r,available:!0}:tt(c)?{status:"on"===c.state?o:n,available:!0}:{status:"unknown",available:!1}}(t,d),u=et(t,d.enabled),m=u?"on"===u.state:h!==n,_=s.map((e,i)=>{const s=d[`day${i}`],n=et(t,s);return{index:i,entityId:s,active:"on"===n?.state,available:tt(n)}}),g=et(t,d.ringing),v=h===a&&g?.last_changed?new Date(g.last_changed):void 0,b=[it(t,d,"snoozeDuration","label.snooze_duration",!0),it(t,d,"preOffset","label.pre_offset",!0),it(t,d,"postOffset","label.post_offset",!0),it(t,d,"autoDismiss","label.auto_dismiss",!0)].filter(e=>void 0!==e),f=Object.values(d).filter(e=>"string"==typeof e);return{deviceId:i,name:Qe(t,i,d),entities:d,trackedEntityIds:f,status:h,available:p,enabled:m,alarmTime:Oe(et(t,d.alarmTime)),nextAlarm:Me(et(t,d.nextAlarm)),snoozeUntil:Me(et(t,d.snoozeUntil)),ringingSince:v&&!Number.isNaN(v.getTime())?v:void 0,days:_,isOneShot:_.every(e=>!e.active),settings:b,canSnooze:(h===a||h===r)&&(b.find(e=>"snoozeDuration"===e.role)?.value??0)>0,canDismiss:h===a||h===r||h===l||h===c,canTest:m&&h!==a,incomplete:0===f.length}}const nt={hide_disabled:!1,show_days:!0,show_next_alarm:!0,show_settings:!0,show_test_button:!1,minute_step:5,expandable:!0,expanded:!1},ot=!0;function at(e){return!((e?.accordion??ot)&&(e?.expandable??nt.expandable))}function rt(e,t){if("expanded"!==t||at(e))return e?.[t]}let lt=class extends fe{constructor(){super(...arguments),this._now=Date.now(),this._narrow=!1,this._expandedDeviceIds=new Set,this._expandedSeeded=!1,this._views=[],this._deviceConfigs=new Map,this._onToggleExpand=e=>{const t=e.detail.deviceId,i=this._expandedDeviceIds.has(t),s=new Set(this._accordion?[]:this._expandedDeviceIds);i?s.delete(t):s.add(t),this._expandedDeviceIds=s}}static async getConfigElement(){return await Promise.resolve().then(function(){return mt}),document.createElement(i)}static getStubConfig(e){const i=Xe(e);return 1===i.length?{type:`custom:${t}`,devices:[{device_id:i[0],expanded:!0}]}:{type:`custom:${t}`}}setConfig(e){if(!e)throw new Error("Invalid configuration");if(void 0!==e.devices&&!Array.isArray(e.devices))throw new Error("`devices` must be a list of device ids or per-device config objects");this._config=e,this._views=[],this._deviceConfigs=new Map,this._expandedSeeded=!1,this._expandedDeviceIds=new Set}set hass(e){const t=this._hass;this._hass=e,this._shouldRefresh(t,e)&&this.requestUpdate()}get hass(){return this._hass}_shouldRefresh(e,t){return!e||!this._views.length||(e.entities!==t.entities||e.devices!==t.devices||(e.locale!==t.locale||e.themes!==t.themes||this._views.some(i=>i.trackedEntityIds.some(i=>e.states[i]!==t.states[i]))))}connectedCallback(){super.connectedCallback(),this._tickTimer=window.setInterval(()=>{this._now=Date.now()},3e4),"undefined"!=typeof ResizeObserver&&(this._resizeObserver=new ResizeObserver(e=>{const t=e[0]?.contentRect.width??0,i=t>0&&t<320;i!==this._narrow&&(this._narrow=i)}),this._resizeObserver.observe(this))}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._tickTimer&&(window.clearInterval(this._tickTimer),this._tickTimer=void 0),this._resizeObserver?.disconnect(),this._resizeObserver=void 0}_resolve(e,t){const i=this._deviceConfigs.get(e.deviceId)?.[t];return void 0!==i?i:rt(this._config,t)??nt[t]}get _accordion(){return this._config?.accordion??ot}_isExpanded(e){return this._resolve(e,"expandable")?this._expandedDeviceIds.has(e.deviceId):this._resolve(e,"expanded")}getCardSize(){const e=this._views.length||1,t=this._views.filter(e=>this._isExpanded(e)).length;return e-t+1+5*t}getGridOptions(){return{columns:12,rows:"auto",min_columns:6,min_rows:2}}render(){const e=this._hass,t=this._config;if(!e||!t)return se;const i=Ie(e),s=t.devices?.length?t.devices.map(Ye):void 0;this._deviceConfigs=new Map(s?.map(e=>[e.device_id,e])??[]);let n=(s?s.map(e=>e.device_id):Xe(e)).filter(t=>e.devices?.[t]).map(t=>st(e,t)).filter(e=>!e.incomplete);s||(n=n.sort((t,i)=>t.name.localeCompare(i.name,ze(e)))),this._views=n;const o=n.filter(e=>!(this._resolve(e,"hide_disabled")&&!e.enabled));if(!o.length)return te`
        <ha-card .header=${t.title}>
          <div class="error">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            <span>${i("error.no_alarms")}</span>
          </div>
        </ha-card>
      `;if(!this._expandedSeeded){this._expandedSeeded=!0;const e=o.filter(e=>this._resolve(e,"expandable")&&this._resolve(e,"expanded")).map(e=>e.deviceId);this._expandedDeviceIds=new Set(this._accordion?e.slice(0,1):e)}return te`
      <ha-card .header=${t.title}>
        <div class="list">${o.map(e=>this._renderItem(e))}</div>
      </ha-card>
    `}_renderItem(e){const t=this._deviceConfigs.get(e.deviceId),i=this._resolve(e,"expandable"),s=this._isExpanded(e),n=t?.name?{...e,name:t.name}:e;return te`
      <alarm-clocks-item
        .hass=${this._hass}
        .view=${n}
        .now=${this._now}
        .narrow=${this._narrow}
        .expanded=${s}
        .expandable=${i}
        .showDays=${this._resolve(e,"show_days")}
        .showNextAlarm=${this._resolve(e,"show_next_alarm")}
        .showSettings=${this._resolve(e,"show_settings")}
        .showTestButton=${this._resolve(e,"show_test_button")}
        .minuteStep=${this._resolve(e,"minute_step")}
        @toggle-expand=${this._onToggleExpand}
      ></alarm-clocks-item>
    `}};lt.styles=[je,Le,Be,b`
      :host {
        display: block;
      }

      .list {
        display: flex;
        flex-direction: column;
        padding: 4px 8px 8px;
      }

      alarm-clocks-item {
        display: block;
      }

      alarm-clocks-item + alarm-clocks-item {
        border-top: 1px solid var(--divider-color);
      }
    `],p([Ae()],lt.prototype,"_config",void 0),p([Ae()],lt.prototype,"_now",void 0),p([Ae()],lt.prototype,"_narrow",void 0),p([Ae()],lt.prototype,"_expandedDeviceIds",void 0),lt=p([ye(t)],lt),window.customCards=window.customCards??[],window.customCards.push({type:t,name:"Alarm Clock Card",description:"One or several alarm clocks: alarm time, weekdays, snooze and dismiss, each row optionally collapsible.",preview:!0,documentationURL:"https://github.com/julezdean/ha-alarm-clocks"}),console.info("%c ALARM-CLOCKS-CARD %c 1.0.0 ","color: #1c1c1c; background: #ffa600; font-weight: 700;","color: #b36f00; background: white; font-weight: 700;");const ct=Object.keys(nt);const dt=[{name:"device_id",selector:{device:{filter:{integration:e}}}}],ht=[{name:"name",selector:{text:{}}},{name:"minute_step",selector:{number:{min:1,max:30,step:1,mode:"box",unit_of_measurement:"min"}}},{name:"",type:"grid",schema:[{name:"expandable",selector:{boolean:{}}},{name:"expanded",selector:{boolean:{}}},{name:"hide_disabled",selector:{boolean:{}}},{name:"show_days",selector:{boolean:{}}},{name:"show_next_alarm",selector:{boolean:{}}},{name:"show_settings",selector:{boolean:{}}},{name:"show_test_button",selector:{boolean:{}}}]}];function pt(e,t){return Object.keys(t).find(i=>t[i]!==e[i])}let ut=class extends fe{constructor(){super(...arguments),this._computeLabel=e=>{const t=Ie(this.hass);return"device_id"===e.name?t("editor.pick_device"):t(`editor.${e.name}`)},this._computeDeviceLabel=e=>"expanded"===e.name?Ie(this.hass)("editor.device_expanded"):this._computeLabel(e),this._valueChanged=e=>{if(e.stopPropagation(),!this._config)return;const t=pt(this._resolvedCardData(),e.detail.value);t&&Ve(this,"config-changed",{config:{...this._config,[t]:e.detail.value[t]}})},this._editDevice=e=>{this._editingIndex=e},this._closeDetail=()=>{this._editingIndex=void 0},this._onAddDeviceChanged=e=>{e.stopPropagation();const t=e.detail.value.device_id;if(!t)return;if(this._usedDeviceIds().includes(t))return void this.requestUpdate();const i=[...(this._config?.devices??[]).map(Ye),{device_id:t}];this._updateDevices(i)}}setConfig(e){this._config=e}render(){if(!this.hass||!this._config)return se;const e=Ie(this.hass),t=(this._config.devices??[]).map(Ye),i=void 0!==this._editingIndex?t[this._editingIndex]:void 0;return i?this._renderDetail(i,this._editingIndex,e):te`
      <ha-form
        .hass=${this.hass}
        .data=${this._resolvedCardData()}
        .schema=${s=this._config,[{name:"title",selector:{text:{}}},{name:"minute_step",selector:{number:{min:1,max:30,step:1,mode:"box",unit_of_measurement:"min"}}},{name:"",type:"grid",schema:[{name:"expandable",selector:{boolean:{}}},{name:"accordion",selector:{boolean:{}}},{name:"expanded",selector:{boolean:{}},disabled:!at(s)},{name:"hide_disabled",selector:{boolean:{}}},{name:"show_days",selector:{boolean:{}}},{name:"show_next_alarm",selector:{boolean:{}}},{name:"show_settings",selector:{boolean:{}}},{name:"show_test_button",selector:{boolean:{}}}]}]}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>

      <div class="devices">
        <span class="heading">${e("editor.devices")}</span>
        ${t.map((t,i)=>this._renderDeviceRow(t,i,e))}
        <div class="device-row add-row">
          <ha-form
            class="picker"
            .hass=${this.hass}
            .data=${{device_id:void 0}}
            .schema=${dt}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._onAddDeviceChanged}
          ></ha-form>
          <ha-icon icon="mdi:plus" aria-label=${e("editor.add_device")}></ha-icon>
        </div>
      </div>
    `;var s}_resolvedCardData(){const e=this._config,t={...e};for(const i of ct)t[i]=e[i]??nt[i];return t.accordion=e.accordion??ot,t}_resolvedDeviceData(e){const t=this._config,i={...e};for(const s of ct)i[s]=e[s]??rt(t,s)??nt[s];return i}_renderDeviceRow(e,t,i){return te`
      <div class="device-row">
        <span class="device-name">${this._deviceLabel(e)}</span>
        <button
          type="button"
          class="icon-btn"
          aria-label=${i("editor.edit_device")}
          title=${i("editor.edit_device")}
          @click=${()=>this._editDevice(t)}
        >
          <ha-icon icon="mdi:pencil-outline"></ha-icon>
        </button>
        <button
          type="button"
          class="icon-btn danger-icon"
          aria-label=${i("editor.remove_device")}
          title=${i("editor.remove_device")}
          @click=${()=>this._removeDevice(t)}
        >
          <ha-icon icon="mdi:trash-can-outline"></ha-icon>
        </button>
      </div>
    `}_renderDetail(e,t,i){const s=this._resolvedDeviceData(e),n=e=>this._onDeviceChanged(t,s,e);return te`
      <div class="detail-header">
        <button
          type="button"
          class="icon-btn"
          aria-label=${i("editor.back")}
          title=${i("editor.back")}
          @click=${this._closeDetail}
        >
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </button>
        <span class="detail-title">${this._deviceLabel(e)}</span>
      </div>
      <ha-form
        .hass=${this.hass}
        .data=${s}
        .schema=${dt}
        .computeLabel=${this._computeLabel}
        @value-changed=${n}
      ></ha-form>
      <ha-form
        .hass=${this.hass}
        .data=${s}
        .schema=${ht}
        .computeLabel=${this._computeDeviceLabel}
        @value-changed=${n}
      ></ha-form>
    `}_usedDeviceIds(e){return(this._config?.devices??[]).map(Ye).filter((t,i)=>i!==e).map(e=>e.device_id)}_deviceLabel(e){if(e.name)return e.name;const t=this.hass?.devices?.[e.device_id];return t?.name_by_user||t?.name||e.device_id}_onDeviceChanged(e,t,i){i.stopPropagation();const s=pt(t,i.detail.value);if(!s)return;const n=i.detail.value[s];if("device_id"===s&&this._usedDeviceIds(e).includes(n))return void this.requestUpdate();const o=(this._config?.devices??[]).map(Ye);o[e]={...o[e],[s]:n},this._updateDevices(o)}_removeDevice(e){const t=(this._config?.devices??[]).map(Ye).filter((t,i)=>i!==e);this._updateDevices(t)}_updateDevices(e){this._config&&Ve(this,"config-changed",{config:{...this._config,devices:e}})}};ut.styles=[Le,b`
      ha-form {
        display: block;
      }

      .devices {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: 16px;
      }

      .heading {
        color: var(--secondary-text-color);
        font-size: 0.82rem;
      }

      .device-row {
        display: flex;
        align-items: center;
        gap: 2px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 2px 4px 2px 12px;
        min-height: 40px;
      }

      .device-name {
        flex: 1 1 auto;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .picker {
        flex: 1 1 auto;
        min-width: 0;
      }

      .danger-icon {
        color: var(--error-color, #db4437);
      }

      .add-row {
        display: flex;
        align-items: center;
        gap: 8px;
        border-style: dashed;
        color: var(--secondary-text-color);
      }

      .detail-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .detail-title {
        font-size: 1rem;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `],p([Ae()],ut.prototype,"hass",void 0),p([Ae()],ut.prototype,"_config",void 0),p([Ae()],ut.prototype,"_editingIndex",void 0),ut=p([ye(i)],ut);var mt=Object.freeze({__proto__:null,get MacaAlarmCardEditor(){return ut}});
