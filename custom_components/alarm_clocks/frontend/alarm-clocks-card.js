const t="alarm_clocks",e="alarm-clocks-card",i="alarm-clocks-card-editor",s="alarm-clocks-list-card",n="alarm-clocks-list-card-editor",o="https://github.com/julezdean/ha-alarm-clocks",r=["mon","tue","wed","thu","fri","sat","sun"],a="disabled",l="armed",c="ringing",d="snoozed",h="post_pending",u=["unavailable","unknown","none",""],p={disabled:"mdi:alarm-off",armed:"mdi:alarm-check",ringing:"mdi:bell-ring",snoozed:"mdi:alarm-snooze",pre_active:"mdi:weather-sunset-up",post_pending:"mdi:clock-end",unknown:"mdi:alarm-note"};function m(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const g=globalThis,_=g.ShadowRoot&&(void 0===g.ShadyCSS||g.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,f=Symbol(),b=new WeakMap;let v=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==f)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(_&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=b.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&b.set(e,t))}return t}toString(){return this.cssText}};const y=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new v(i,t,f)},$=_?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new v("string"==typeof t?t:t+"",void 0,f))(e)})(t):t,{is:w,defineProperty:x,getOwnPropertyDescriptor:k,getOwnPropertyNames:A,getOwnPropertySymbols:S,getPrototypeOf:E}=Object,T=globalThis,z=T.trustedTypes,C=z?z.emptyScript:"",O=T.reactiveElementPolyfillSupport,M=(t,e)=>t,D={toAttribute(t,e){switch(e){case Boolean:t=t?C:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},P=(t,e)=>!w(t,e),I={attribute:!0,type:String,converter:D,reflect:!1,useDefault:!1,hasChanged:P};Symbol.metadata??=Symbol("metadata"),T.litPropertyMetadata??=new WeakMap;let U=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=I){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&x(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=k(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);n?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??I}static _$Ei(){if(this.hasOwnProperty(M("elementProperties")))return;const t=E(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(M("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(M("properties"))){const t=this.properties,e=[...A(t),...S(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift($(t))}else void 0!==t&&e.push($(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(_)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of e){const e=document.createElement("style"),s=g.litNonce;void 0!==s&&e.setAttribute("nonce",s),e.textContent=i.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:D).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:D;this._$Em=s;const o=n.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const o=this.constructor;if(!1===s&&(n=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??P)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};U.elementStyles=[],U.shadowRootOptions={mode:"open"},U[M("elementProperties")]=new Map,U[M("finalized")]=new Map,O?.({ReactiveElement:U}),(T.reactiveElementVersions??=[]).push("2.1.2");const H=globalThis,N=t=>t,R=H.trustedTypes,j=R?R.createPolicy("lit-html",{createHTML:t=>t}):void 0,L="$lit$",W=`lit$${Math.random().toFixed(9).slice(2)}$`,B="?"+W,K=`<${B}>`,q=document,V=()=>q.createComment(""),F=t=>null===t||"object"!=typeof t&&"function"!=typeof t,Y=Array.isArray,G="[ \t\n\f\r]",J=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,X=/-->/g,Z=/>/g,Q=RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),tt=/'/g,et=/"/g,it=/^(?:script|style|textarea|title)$/i,st=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),nt=Symbol.for("lit-noChange"),ot=Symbol.for("lit-nothing"),rt=new WeakMap,at=q.createTreeWalker(q,129);function lt(t,e){if(!Y(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==j?j.createHTML(e):e}const ct=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":3===e?"<math>":"",r=J;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===J?"!--"===l[1]?r=X:void 0!==l[1]?r=Z:void 0!==l[2]?(it.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=Q):void 0!==l[3]&&(r=Q):r===Q?">"===l[0]?(r=n??J,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?Q:'"'===l[3]?et:tt):r===et||r===tt?r=Q:r===X||r===Z?r=J:(r=Q,n=void 0);const h=r===Q&&t[e+1].startsWith("/>")?" ":"";o+=r===J?i+K:c>=0?(s.push(a),i.slice(0,c)+L+i.slice(c)+W+h):i+W+(-2===c?e:h)}return[lt(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class dt{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[l,c]=ct(t,e);if(this.el=dt.createElement(l,i),at.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=at.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(L)){const e=c[o++],i=s.getAttribute(t).split(W),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:i,ctor:"."===r[1]?gt:"?"===r[1]?_t:"@"===r[1]?ft:mt}),s.removeAttribute(t)}else t.startsWith(W)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(it.test(s.tagName)){const t=s.textContent.split(W),e=t.length-1;if(e>0){s.textContent=R?R.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],V()),at.nextNode(),a.push({type:2,index:++n});s.append(t[e],V())}}}else if(8===s.nodeType)if(s.data===B)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(W,t+1));)a.push({type:7,index:n}),t+=W.length-1}n++}}static createElement(t,e){const i=q.createElement("template");return i.innerHTML=t,i}}function ht(t,e,i=t,s){if(e===nt)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const o=F(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=ht(t,n._$AS(t,e.values),n,s)),e}class ut{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??q).importNode(e,!0);at.currentNode=s;let n=at.nextNode(),o=0,r=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new pt(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new bt(n,this,t)),this._$AV.push(e),a=i[++r]}o!==a?.index&&(n=at.nextNode(),o++)}return at.currentNode=q,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class pt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=ot,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ht(this,t,e),F(t)?t===ot||null==t||""===t?(this._$AH!==ot&&this._$AR(),this._$AH=ot):t!==this._$AH&&t!==nt&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>Y(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==ot&&F(this._$AH)?this._$AA.nextSibling.data=t:this.T(q.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=dt.createElement(lt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new ut(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=rt.get(t.strings);return void 0===e&&rt.set(t.strings,e=new dt(t)),e}k(t){Y(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new pt(this.O(V()),this.O(V()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=N(t).nextSibling;N(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class mt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=ot,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=ot}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=ht(this,t,e,0),o=!F(t)||t!==this._$AH&&t!==nt,o&&(this._$AH=t);else{const s=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=ht(this,s[i+r],e,r),a===nt&&(a=this._$AH[r]),o||=!F(a)||a!==this._$AH[r],a===ot?t=ot:t!==ot&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}o&&!s&&this.j(t)}j(t){t===ot?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class gt extends mt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===ot?void 0:t}}class _t extends mt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==ot)}}class ft extends mt{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=ht(this,t,e,0)??ot)===nt)return;const i=this._$AH,s=t===ot&&i!==ot||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==ot&&(i===ot||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class bt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){ht(this,t)}}const vt=H.litHtmlPolyfillSupport;vt?.(dt,pt),(H.litHtmlVersions??=[]).push("3.3.3");const yt=globalThis;let $t=class extends U{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new pt(e.insertBefore(V(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return nt}};$t._$litElement$=!0,$t.finalized=!0,yt.litElementHydrateSupport?.({LitElement:$t});const wt=yt.litElementPolyfillSupport;wt?.({LitElement:$t}),(yt.litElementVersions??=[]).push("4.2.2");const xt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},kt={attribute:!0,type:String,converter:D,reflect:!1,hasChanged:P},At=(t=kt,e,i)=>{const{kind:s,metadata:n}=i;let o=globalThis.litPropertyMetadata.get(n);if(void 0===o&&globalThis.litPropertyMetadata.set(n,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,n,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];e.call(this,i),this.requestUpdate(s,n,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function St(t){return(e,i)=>"object"==typeof i?At(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function Et(t){return St({...t,state:!0,attribute:!1})}const Tt=1;class zt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const Ct=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends zt{constructor(t){if(super(t),t.type!==Tt||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const s=!!e[t];s===this.st.has(t)||this.nt?.has(t)||(s?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return nt}}),Ot={"status.disabled":"Disabled","status.armed":"Armed","status.ringing":"Ringing","status.snoozed":"Snoozed","status.pre_active":"Pre phase","status.post_pending":"Post action","status.unknown":"Unknown","action.snooze":"Snooze","action.dismiss":"Dismiss","action.test":"Test","action.enable":"Turn alarm on","action.disable":"Turn alarm off","action.toggle_day":"Toggle {day}","action.decrease":"Decrease {label}","action.increase":"Increase {label}","action.edit_time":"Edit the alarm time","action.show_settings":"Show settings","action.hide_settings":"Hide settings","label.no_alarm":"No alarm","label.one_shot":"One-shot","label.settings":"Settings","label.hours":"Hours","label.minutes":"Minutes","label.snooze_duration":"Snooze","label.pre_offset":"Pre","label.post_offset":"Post","label.auto_dismiss":"Auto off","label.ringing_since":"for {duration}","label.until":"until {time}","label.post_pending":"Post action pending","label.off":"off","label.no_time":"--:--","time.in":"in {duration}","time.ago":"{duration} ago","time.now":"now","time.today":"Today","time.tomorrow":"Tomorrow","unit.day":"d","unit.hour":"h","unit.minute":"min","unit.minutes_short":"min","error.no_device":"No alarm selected. Pick an alarm clock device in the card editor.","error.multiple_devices":"There is more than one alarm clock. Pick one in the card editor.","error.device_not_found":"The configured alarm no longer exists. Was it removed from the integrations page?","error.incomplete":"The entities of this alarm could not be mapped. Are they disabled in the entity registry?","error.unavailable":"This alarm is currently unavailable.","error.no_alarms":"No alarm clocks found.","editor.device_id":"Alarm","editor.devices":"Alarms (empty = all)","editor.name":"Name (optional)","editor.title":"Title (optional)","editor.show_days":"Show weekdays","editor.show_next_alarm":"Show next alarm","editor.show_settings":"Show settings","editor.settings_expanded":"Start with settings expanded","editor.minute_step":"Minute step","editor.show_test_button":"Show test button","editor.hide_disabled":"Hide disabled alarms"},Mt={de:{"status.disabled":"Deaktiviert","status.armed":"Bereit","status.ringing":"Klingelt","status.snoozed":"Schlummert","status.pre_active":"Vorlauf","status.post_pending":"Nachlauf","status.unknown":"Unbekannt","action.snooze":"Schlummern","action.dismiss":"Ausschalten","action.test":"Testen","action.enable":"Wecker einschalten","action.disable":"Wecker ausschalten","action.toggle_day":"{day} umschalten","action.decrease":"{label} verringern","action.increase":"{label} erhöhen","action.edit_time":"Weckzeit bearbeiten","action.show_settings":"Einstellungen anzeigen","action.hide_settings":"Einstellungen ausblenden","label.no_alarm":"Kein Alarm","label.one_shot":"Einmalig","label.settings":"Einstellungen","label.hours":"Stunden","label.minutes":"Minuten","label.snooze_duration":"Snooze","label.pre_offset":"Vorlauf","label.post_offset":"Nachlauf","label.auto_dismiss":"Auto-Aus","label.ringing_since":"seit {duration}","label.until":"bis {time}","label.post_pending":"Post-Aktion läuft","label.off":"aus","label.no_time":"--:--","time.in":"in {duration}","time.ago":"vor {duration}","time.now":"jetzt","time.today":"Heute","time.tomorrow":"Morgen","unit.day":"Tg.","unit.hour":"Std.","unit.minute":"Min.","unit.minutes_short":"min","error.no_device":"Kein Wecker ausgewählt. Wähle im Card-Editor einen Wecker aus.","error.multiple_devices":"Es gibt mehrere Wecker. Wähle im Card-Editor aus, welcher angezeigt werden soll.","error.device_not_found":"Der konfigurierte Wecker existiert nicht mehr. Wurde er in den Integrationen entfernt?","error.incomplete":"Die Entities dieses Weckers konnten nicht zugeordnet werden. Sind sie in der Entity-Registry deaktiviert?","error.unavailable":"Der Wecker ist derzeit nicht verfügbar.","error.no_alarms":"Keine Wecker gefunden.","editor.device_id":"Wecker","editor.devices":"Wecker (leer = alle)","editor.name":"Name (optional)","editor.title":"Titel (optional)","editor.show_days":"Wochentage anzeigen","editor.show_next_alarm":"Nächsten Alarm anzeigen","editor.show_settings":"Einstellungen anzeigen","editor.settings_expanded":"Einstellungen aufgeklappt starten","editor.minute_step":"Minutenschritt","editor.show_test_button":"Test-Button anzeigen","editor.hide_disabled":"Deaktivierte Wecker ausblenden"},en:Ot};function Dt(t){return(t?.locale?.language??t?.language??"en").split("-")[0].toLowerCase()}function Pt(t){const e=Mt[Dt(t)]??Ot;return(t,i)=>{let s=e[t]??Ot[t]??t;if(i)for(const[t,e]of Object.entries(i))s=s.replace(`{${t}}`,String(e));return s}}function It(t){if(!t||u.includes(t.state))return;const e=new Date(t.state);return Number.isNaN(e.getTime())?void 0:e}function Ut(t){if(!t||u.includes(t.state))return;const e=/^(\d{1,2}):(\d{2})/.exec(t.state);if(!e)return;const i=Number(e[1]),s=Number(e[2]);return i>23||s>59?void 0:{hours:i,minutes:s}}function Ht(t,e){const i=Math.max(1,Math.round(Math.abs(t)/6e4)),s=Math.floor(i/1440),n=Math.floor(i%1440/60),o=i%60,r=[];return s>0?(r.push(`${s} ${e("unit.day")}`),n>0&&r.push(`${n} ${e("unit.hour")}`)):n>0?(r.push(`${n} ${e("unit.hour")}`),o>0&&r.push(`${o} ${e("unit.minute")}`)):r.push(`${o} ${e("unit.minute")}`),r.join(" ")}function Nt(t,e,i){const s=t.getTime()-e;if(Math.abs(s)<3e4)return i("time.now");const n=Ht(s,i);return i(s>0?"time.in":"time.ago",{duration:n})}function Rt(t,e){return function(t){return new Intl.DateTimeFormat(t,{hour:"2-digit",minute:"2-digit"})}(e).format(t)}const jt=new Map;function Lt(t,e){const i=`${t}|${e}`,s=jt.get(i);if(s)return s;const n=new Intl.DateTimeFormat(t,{weekday:e}),o=[];for(let t=0;t<7;t+=1)o.push(n.format(new Date(Date.UTC(2024,0,1+t,12))));return jt.set(i,o),o}const Wt=y`
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
`,Bt=y`
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
`,Kt=y`
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
`;let qt=class extends $t{constructor(){super(...arguments),this.days=[],this.compact=!1}render(){if(!this.days.length)return ot;const t=Dt(this.hass),e=Pt(this.hass),i=Lt(t,"short"),s=Lt(t,"long"),n=Lt(t,"narrow");return st`
      <div class="days" role="group">
        ${this.days.map(t=>{const o=this.compact?n[t.index]:i[t.index];return st`
            <button
              type="button"
              role="switch"
              class=${Ct({day:!0,active:t.active})}
              aria-checked=${t.active?"true":"false"}
              aria-label=${e("action.toggle_day",{day:s[t.index]})}
              title=${s[t.index]}
              ?disabled=${!t.available}
              @click=${()=>this._toggle(t)}
            >
              <span aria-hidden="true">${o}</span>
            </button>
          `})}
      </div>
    `}_toggle(t){t.entityId&&this.dispatchEvent(new CustomEvent("day-toggled",{detail:{entityId:t.entityId},bubbles:!0,composed:!0}))}};qt.styles=[Wt,y`
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
    `],m([St({attribute:!1})],qt.prototype,"hass",void 0),m([St({attribute:!1})],qt.prototype,"days",void 0),m([St({type:Boolean})],qt.prototype,"compact",void 0),qt=m([xt("alarm-clocks-weekday-picker")],qt);let Vt=class extends $t{constructor(){super(...arguments),this.hours=0,this.minutes=0,this.minuteStep=5,this.disabled=!1,this._repeatDelay=180,this._stopHold=()=>{void 0!==this._holdTimer&&(window.clearTimeout(this._holdTimer),this._holdTimer=void 0),void 0!==this._repeatTimer&&(window.clearTimeout(this._repeatTimer),this._repeatTimer=void 0)}}disconnectedCallback(){super.disconnectedCallback(),this._stopHold()}render(){const t=Pt(this.hass);return st`
      <div class="stepper" ?data-disabled=${this.disabled}>
        ${this._renderSegment("hours",this.hours,23,t("label.hours"))}
        <span class="colon" aria-hidden="true">:</span>
        ${this._renderSegment("minutes",this.minutes,59,t("label.minutes"))}
      </div>
    `}_renderSegment(t,e,i,s){const n=Pt(this.hass);return st`
      <div class="segment">
        <button
          type="button"
          class="arrow"
          tabindex="-1"
          aria-label=${n("action.increase",{label:s})}
          ?disabled=${this.disabled}
          @pointerdown=${e=>this._startHold(e,t,1)}
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
          aria-valuenow=${e}
          aria-valuemin="0"
          aria-valuemax=${i}
          aria-valuetext=${String(e).padStart(2,"0")}
          @keydown=${e=>this._onKeyDown(e,t)}
          @wheel=${e=>this._onWheel(e,t)}
        >
          ${String(e).padStart(2,"0")}
        </div>

        <button
          type="button"
          class="arrow"
          tabindex="-1"
          aria-label=${n("action.decrease",{label:s})}
          ?disabled=${this.disabled}
          @pointerdown=${e=>this._startHold(e,t,-1)}
          @pointerup=${this._stopHold}
          @pointercancel=${this._stopHold}
          @pointerleave=${this._stopHold}
        >
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </button>
      </div>
    `}_step(t,e){if(this.disabled)return;let{hours:i,minutes:s}=this;if("hours"===t)i=(i+e+24)%24;else{const t=Math.max(1,Math.round(this.minuteStep));s=((Math.round(s/t)*t+e*t)%60+60)%60}this.hours=i,this.minutes=s,this.dispatchEvent(new CustomEvent("time-changed",{detail:{hours:i,minutes:s},bubbles:!0,composed:!0}))}_startHold(t,e,i){this.disabled||(t.preventDefault(),t.currentTarget.setPointerCapture?.(t.pointerId),this._step(e,i),this._repeatDelay=180,this._holdTimer=window.setTimeout(()=>{const t=()=>{this._step(e,i),this._repeatDelay=Math.max(60,this._repeatDelay-12),this._repeatTimer=window.setTimeout(t,this._repeatDelay)};t()},450))}_onWheel(t,e){const i=this.shadowRoot?.activeElement===t.currentTarget;!this.disabled&&i&&0!==t.deltaY&&(t.preventDefault(),this._step(e,t.deltaY<0?1:-1))}_onKeyDown(t,e){"ArrowUp"===t.key?(t.preventDefault(),this._step(e,1)):"ArrowDown"===t.key&&(t.preventDefault(),this._step(e,-1))}};Vt.styles=[Wt,Bt,y`
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
    `],m([St({attribute:!1})],Vt.prototype,"hass",void 0),m([St({type:Number})],Vt.prototype,"hours",void 0),m([St({type:Number})],Vt.prototype,"minutes",void 0),m([St({type:Number})],Vt.prototype,"minuteStep",void 0),m([St({type:Boolean})],Vt.prototype,"disabled",void 0),Vt=m([xt("alarm-clocks-time-stepper")],Vt);let Ft=class extends $t{constructor(){super(...arguments),this._openMoreInfo=()=>{this.dispatchEvent(new CustomEvent("setting-more-info",{detail:{entityId:this.setting.entityId},bubbles:!0,composed:!0}))}}render(){const t=Pt(this.hass),e=t(this.setting.labelKey),i=this.setting.zeroMeansOff&&0===this.setting.value?t("label.off"):`${this.setting.value} ${t("unit.minutes_short")}`;return st`
      <div class="row">
        <span class="label">${e}</span>
        <div class="control">
          <button
            type="button"
            class="icon-btn"
            aria-label=${t("action.decrease",{label:e})}
            ?disabled=${this.setting.value<=this.setting.min}
            @click=${()=>this._step(-1)}
          >
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>
          <button
            type="button"
            class="value"
            aria-label=${`${e}: ${i}`}
            @click=${this._openMoreInfo}
          >
            ${i}
          </button>
          <button
            type="button"
            class="icon-btn"
            aria-label=${t("action.increase",{label:e})}
            ?disabled=${this.setting.value>=this.setting.max}
            @click=${()=>this._step(1)}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
      </div>
    `}_step(t){const e=Math.min(this.setting.max,Math.max(this.setting.min,this.setting.value+t*this.setting.step));e!==this.setting.value&&this.dispatchEvent(new CustomEvent("setting-changed",{detail:{entityId:this.setting.entityId,value:e},bubbles:!0,composed:!0}))}};function Yt(t,e,i){t.dispatchEvent(new CustomEvent(e,{detail:i,bubbles:!0,composed:!0,cancelable:!1}))}function Gt(t,e){Yt(t,"hass-more-info",{entityId:e})}function Jt(e,i,s){return e.callService(t,"snooze",{},{device_id:i})}function Xt(e,i){return e.callService(t,"dismiss",{},{device_id:i})}function Zt(t,e){return t.callService("switch","toggle",{},{entity_id:e})}Ft.styles=[Wt,Bt,y`
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
    `],m([St({attribute:!1})],Ft.prototype,"hass",void 0),m([St({attribute:!1})],Ft.prototype,"setting",void 0),Ft=m([xt("alarm-clocks-setting-row")],Ft);const Qt={"switch.enabled":"enabled","time.alarm_time":"alarmTime","number.snooze_duration":"snoozeDuration","number.pre_offset":"preOffset","number.post_offset":"postOffset","number.auto_dismiss":"autoDismiss","binary_sensor.ringing":"ringing","binary_sensor.snooze_active":"snoozeActive","sensor.next_alarm":"nextAlarm","sensor.state":"status","sensor.snooze_until":"snoozeUntil","button.snooze":"snoozeButton","button.dismiss":"dismissButton",...Object.fromEntries(r.map((t,e)=>[`switch.day_${t}`,`day${e}`]))};function te(t){return t.split(".",1)[0]}function ee(e){const i=new Set;for(const s of Object.values(e.entities??{}))s.platform===t&&s.device_id&&i.add(s.device_id);return[...i]}function ie(t,e,i){const s=t.devices?.[e],n=s?.name_by_user||s?.name;if(n)return n;const o=i.status?t.states[i.status]:void 0;return o?.attributes.friendly_name??e}function se(t,e){return e?t.states[e]:void 0}function ne(t){return!!t&&!u.includes(t.state)}function oe(t,e,i,s,n){const o=e[i],r=se(t,o),a=function(t){if(!ne(t))return;const e=Number(t.state);return Number.isFinite(e)?e:void 0}(r);if(o&&void 0!==a)return{role:i,labelKey:s,entityId:o,value:a,min:"number"==typeof r.attributes.min?r.attributes.min:0,max:"number"==typeof r.attributes.max?r.attributes.max:999,step:"number"==typeof r.attributes.step?r.attributes.step:1,zeroMeansOff:n}}function re(e,i){const s=function(e,i){const s={};for(const n of Object.values(e.entities??{})){if(n.device_id!==i||n.platform!==t)continue;if(!n.translation_key)continue;const e=Qt[`${te(n.entity_id)}.${n.translation_key}`];e&&(s[e]=n.entity_id)}return s}(e,i),{status:n,available:o}=function(t,e){const i=se(t,e.status);if(ne(i))return{status:i.state,available:!0};const s=se(t,e.ringing),n=se(t,e.snoozeActive),o=se(t,e.enabled);return"on"===s?.state?{status:c,available:!0}:"on"===n?.state?{status:d,available:!0}:ne(o)?{status:"on"===o.state?l:a,available:!0}:{status:"unknown",available:!1}}(e,s),h=se(e,s.enabled),u=h?"on"===h.state:n!==a,p=r.map((t,i)=>{const n=s[`day${i}`],o=se(e,n);return{index:i,entityId:n,active:"on"===o?.state,available:ne(o)}}),m=se(e,s.ringing),g=n===c&&m?.last_changed?new Date(m.last_changed):void 0,_=[oe(e,s,"snoozeDuration","label.snooze_duration",!0),oe(e,s,"preOffset","label.pre_offset",!0),oe(e,s,"postOffset","label.post_offset",!0),oe(e,s,"autoDismiss","label.auto_dismiss",!0)].filter(t=>void 0!==t),f=Object.values(s).filter(t=>"string"==typeof t);return{deviceId:i,name:ie(e,i,s),entities:s,trackedEntityIds:f,status:n,available:o,enabled:u,alarmTime:Ut(se(e,s.alarmTime)),nextAlarm:It(se(e,s.nextAlarm)),snoozeUntil:It(se(e,s.snoozeUntil)),ringingSince:g&&!Number.isNaN(g.getTime())?g:void 0,days:p,isOneShot:p.every(t=>!t.active),settings:_,canSnooze:(n===c||n===d)&&(_.find(t=>"snoozeDuration"===t.role)?.value??0)>0,canDismiss:n===c||n===d,canTest:u&&n!==c,incomplete:0===f.length}}const ae={show_days:!0,show_next_alarm:!0,show_settings:!0,settings_expanded:!1,show_test_button:!1};let le=class extends $t{constructor(){super(...arguments),this._now=Date.now(),this._settingsOpen=!1,this._narrow=!1,this._pendingSince=0,this._onTimeChanged=t=>{this._pendingTime={hours:t.detail.hours,minutes:t.detail.minutes},this._pendingSince=Date.now(),void 0!==this._timeTimer&&window.clearTimeout(this._timeTimer),this._timeTimer=window.setTimeout(()=>{this._timeTimer=void 0;const t=this._view?.entities.alarmTime,e=this._pendingTime;this._hass&&t&&e&&function(t,e,i,s){const n=`${String(i).padStart(2,"0")}:${String(s).padStart(2,"0")}:00`;t.callService("time","set_value",{time:n},{entity_id:e})}(this._hass,t,e.hours,e.minutes)},600)},this._toggleSettings=()=>{this._settingsOpen=!this._settingsOpen},this._openDeviceInfo=()=>{const t=this._view?.entities.status??this._view?.entities.enabled;this._openEntity(t)},this._onDayToggled=t=>{this._hass&&Zt(this._hass,t.detail.entityId)},this._onSettingChanged=t=>{var e,i,s;this._hass&&(e=this._hass,i=t.detail.entityId,s=t.detail.value,e.callService("number","set_value",{value:s},{entity_id:i}))},this._onSettingMoreInfo=t=>{this._openEntity(t.detail.entityId)}}static async getConfigElement(){return await Promise.resolve().then(function(){return ue}),document.createElement(i)}static getStubConfig(t){const i=ee(t);return{type:`custom:${e}`,...i.length?{device_id:i[0]}:{}}}setConfig(t){if(!t)throw new Error("Invalid configuration");if(t.device_id&&"string"!=typeof t.device_id)throw new Error("`device_id` must be a string");if(t.entity&&"string"!=typeof t.entity)throw new Error("`entity` must be an entity id");this._config={...ae,...t},this._settingsOpen=!0===this._config.settings_expanded,this._view=void 0}set hass(t){const e=this._hass;this._hass=t,this._shouldRefresh(e,t)&&(this._view=void 0,this.requestUpdate())}get hass(){return this._hass}_shouldRefresh(t,e){return!t||!this._view||(t.entities!==e.entities||t.devices!==e.devices||(t.locale!==e.locale||t.themes!==e.themes||this._view.trackedEntityIds.some(i=>t.states[i]!==e.states[i])))}connectedCallback(){super.connectedCallback(),this._tickTimer=window.setInterval(()=>{this._now=Date.now()},3e4),"undefined"!=typeof ResizeObserver&&(this._resizeObserver=new ResizeObserver(t=>{const e=t[0]?.contentRect.width??0,i=e>0&&e<320;i!==this._narrow&&(this._narrow=i)}),this._resizeObserver.observe(this))}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._tickTimer&&(window.clearInterval(this._tickTimer),this._tickTimer=void 0),this._resizeObserver?.disconnect(),this._resizeObserver=void 0}getCardSize(){let t=3;return!1!==this._config?.show_days&&(t+=1),!1!==this._config?.show_settings&&(t+=1),t}getGridOptions(){let t=3;return!1!==this._config?.show_days&&(t+=1),this._settingsOpen&&(t+=2),{columns:12,rows:t,min_columns:6,min_rows:3}}render(){const t=this._hass,e=this._config;if(!t||!e)return ot;const i=Pt(t),{deviceId:s,error:n}=function(t,e){if(e.device_id)return t.devices?.[e.device_id]?{deviceId:e.device_id}:{error:"not_found"};if(e.entity){const i=t.entities?.[e.entity]?.device_id;return i?{deviceId:i}:{error:"not_found"}}const i=ee(t);return 1===i.length?{deviceId:i[0]}:{error:0===i.length?"none":"multiple"}}(t,e);if(!s){const t="multiple"===n?"error.multiple_devices":"not_found"===n?"error.device_not_found":"error.no_device";return this._renderError(i(t))}const o=re(t,s);if(this._view=o,this._settlePendingTime(o),o.incomplete)return this._renderError(i("error.incomplete"));const r=e.name??o.name;return st`
      <ha-card class=${Ct({[`status-${o.status}`]:!0,disabled:!o.enabled})}>
        <div class="content">
          ${this._renderHeader(o,r,i)} ${this._renderHero(o,i)}
          ${!1!==e.show_days?this._renderDays(o,i):ot}
          ${this._renderActions(o,i)}
          ${!1!==e.show_settings&&o.settings.length?this._renderSettings(o,i):ot}
        </div>
      </ha-card>
    `}_renderHeader(t,e,i){const s=i(`status.${t.status}`);return st`
      <div class="header">
        <div class="icon" aria-hidden="true">
          <ha-icon icon=${p[t.status]??p.unknown}></ha-icon>
        </div>
        <button
          type="button"
          class="title"
          @click=${this._openDeviceInfo}
          title=${e}
        >
          <span class="name">${e}</span>
          <span class="status">
            <span class="dot" aria-hidden="true"></span>${s}
          </span>
        </button>
        ${this._renderToggle(t,i)}
      </div>
    `}_renderToggle(t,e){return t.entities.enabled?st`
      <button
        type="button"
        role="switch"
        class=${Ct({toggle:!0,on:t.enabled})}
        aria-checked=${t.enabled?"true":"false"}
        aria-label=${e(t.enabled?"action.disable":"action.enable")}
        @click=${()=>this._toggleEnabled(t)}
      >
        <span class="knob"></span>
      </button>
    `:ot}_renderHero(t,e){const i=Dt(this._hass),s=Boolean(t.entities.alarmTime),n=this._pendingTime??t.alarmTime;return n?st`
      <div class="hero">
        <alarm-clocks-time-stepper
          .hass=${this._hass}
          .hours=${n.hours}
          .minutes=${n.minutes}
          .minuteStep=${this._config?.minute_step??5}
          .disabled=${!s}
          @time-changed=${this._onTimeChanged}
        ></alarm-clocks-time-stepper>
        <div class="meta">${this._renderMeta(t,e,i)}</div>
        <button
          type="button"
          class="icon-btn edit-time"
          aria-label=${e("action.edit_time")}
          title=${e("action.edit_time")}
          ?disabled=${!s}
          @click=${()=>this._openEntity(t.entities.alarmTime)}
        >
          <ha-icon icon="mdi:pencil-outline"></ha-icon>
        </button>
      </div>
    `:st`
        <div class="hero">
          <span class="no-time">${e("label.no_time")}</span>
          <div class="meta">${this._renderMeta(t,e,i)}</div>
        </div>
      `}_settlePendingTime(t){const e=this._pendingTime;if(!e)return;const i=t.alarmTime?.hours===e.hours&&t.alarmTime?.minutes===e.minutes,s=Date.now()-this._pendingSince>15e3;(i||s)&&(this._pendingTime=void 0)}_renderMeta(t,e,i){if(!1===this._config?.show_next_alarm)return ot;if(t.status===c){const i=t.ringingSince?e("label.ringing_since",{duration:Ht(this._now-t.ringingSince.getTime(),e)}):e("status.ringing");return st`<span class="primary">${i}</span>`}if(t.status===h)return st`<span class="primary">${e("label.post_pending")}</span>`;if(!t.nextAlarm)return st`<span class="primary muted">${e("label.no_alarm")}</span>`;const s=Nt(t.nextAlarm,this._now,e),n=t.status===d?e("label.until",{time:Rt(t.nextAlarm,i)}):function(t,e,i,s){const n=new Date(e),o=new Date(n.getFullYear(),n.getMonth(),n.getDate()).getTime(),r=Math.floor((t.getTime()-o)/864e5),a=Rt(t,i);return 0===r?`${s("time.today")}, ${a}`:1===r?`${s("time.tomorrow")}, ${a}`:`${new Intl.DateTimeFormat(i,{weekday:"short"}).format(t)}, ${a}`}(t.nextAlarm,this._now,i,e);return st`
      <span class="primary">${s}</span>
      <span class="secondary">${n}</span>
      ${t.isOneShot?st`<span class="badge">${e("label.one_shot")}</span>`:ot}
    `}_renderDays(t,e){return st`
      <alarm-clocks-weekday-picker
        .hass=${this._hass}
        .days=${t.days}
        .compact=${this._narrow}
        @day-toggled=${this._onDayToggled}
      ></alarm-clocks-weekday-picker>
    `}_renderActions(t,e){const i=!0===this._config?.show_test_button&&!t.canDismiss;return t.canDismiss||i?st`
      <div class="actions">
        ${t.canSnooze?st`<button
              type="button"
              class="btn"
              ?disabled=${!t.entities.snoozeButton&&!t.entities.status}
              @click=${()=>this._snooze(t)}
            >
              <ha-icon icon="mdi:alarm-snooze"></ha-icon>${e("action.snooze")}
            </button>`:ot}
        ${t.canDismiss?st`<button type="button" class="btn danger" @click=${()=>this._dismiss(t)}>
              <ha-icon icon="mdi:alarm-off"></ha-icon>${e("action.dismiss")}
            </button>`:ot}
        ${i?st`<button
              type="button"
              class="btn"
              ?disabled=${!t.canTest}
              @click=${()=>this._test(t)}
            >
              <ha-icon icon="mdi:play-circle-outline"></ha-icon>${e("action.test")}
            </button>`:ot}
      </div>
    `:ot}_renderSettings(t,e){const i=t.settings.map(t=>{const i=t.zeroMeansOff&&0===t.value?e("label.off"):`${t.value} ${e("unit.minutes_short")}`;return`${e(t.labelKey)} ${i}`}).join(" · ");return st`
      <div class="settings">
        <button
          type="button"
          class="settings-toggle"
          aria-expanded=${this._settingsOpen?"true":"false"}
          aria-label=${e(this._settingsOpen?"action.hide_settings":"action.show_settings")}
          @click=${this._toggleSettings}
        >
          <span class="summary">${i}</span>
          <ha-icon icon=${this._settingsOpen?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        ${this._settingsOpen?st`<div class="settings-body">
              ${t.settings.map(t=>st`
                  <alarm-clocks-setting-row
                    .hass=${this._hass}
                    .setting=${t}
                    @setting-changed=${this._onSettingChanged}
                    @setting-more-info=${this._onSettingMoreInfo}
                  ></alarm-clocks-setting-row>
                `)}
            </div>`:ot}
      </div>
    `}_renderError(t){return st`
      <ha-card>
        <div class="error">
          <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
          <span>${t}</span>
        </div>
      </ha-card>
    `}_openEntity(t){t&&Gt(this,t)}_toggleEnabled(t){this._hass&&t.entities.enabled&&Zt(this._hass,t.entities.enabled)}_snooze(t){this._hass&&Jt(this._hass,t.deviceId)}_dismiss(t){this._hass&&Xt(this._hass,t.deviceId)}_test(e){var i,s;this._hass&&(i=this._hass,s=e.deviceId,i.callService(t,"trigger_alarm",{},{device_id:s}))}};le.styles=[Wt,Bt,Kt,y`
      :host {
        display: block;
      }

      ha-card {
        --status-color: var(--alarm-clocks-disabled);
        overflow: hidden;
      }

      ha-card.status-armed,
      ha-card.status-pre_active,
      ha-card.status-post_pending {
        --status-color: var(--alarm-clocks-armed);
      }

      ha-card.status-ringing {
        --status-color: var(--alarm-clocks-ringing);
      }

      ha-card.status-snoozed {
        --status-color: var(--alarm-clocks-snoozed);
      }

      .content {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 14px 16px 16px;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
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

      .title {
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

      .title:focus-visible {
        outline: 2px solid var(--alarm-clocks-accent);
        outline-offset: 2px;
        border-radius: 6px;
      }

      .name {
        max-width: 100%;
        color: var(--primary-text-color);
        font-size: 1rem;
        font-weight: 600;
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

      .edit-time {
        align-self: flex-start;
        flex: 0 0 auto;
      }

      .edit-time ha-icon {
        --mdc-icon-size: 20px;
      }

      ha-card.disabled alarm-clocks-time-stepper {
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
        border-top: 1px solid var(--divider-color);
        padding-top: 6px;
      }

      .settings-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        width: 100%;
        min-height: var(--alarm-clocks-tap-target);
        padding: 0;
        border: none;
        background: transparent;
        color: var(--secondary-text-color);
        font-family: inherit;
        font-size: 0.82rem;
        cursor: pointer;
      }

      .settings-toggle:focus-visible {
        outline: 2px solid var(--alarm-clocks-accent);
        outline-offset: 2px;
        border-radius: 6px;
      }

      .summary {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .settings-body {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding-top: 4px;
      }

      @media (max-width: 340px) {
        .time {
          font-size: 2rem;
        }

        .actions .btn {
          flex: 1 1 100%;
        }
      }
    `],m([Et()],le.prototype,"_config",void 0),m([Et()],le.prototype,"_now",void 0),m([Et()],le.prototype,"_settingsOpen",void 0),m([Et()],le.prototype,"_narrow",void 0),m([Et()],le.prototype,"_pendingTime",void 0),le=m([xt(e)],le);let ce=class extends $t{constructor(){super(...arguments),this._now=Date.now(),this._views=[]}static async getConfigElement(){return await Promise.resolve().then(function(){return ge}),document.createElement(n)}static getStubConfig(){return{type:`custom:${s}`}}setConfig(t){if(!t)throw new Error("Invalid configuration");if(void 0!==t.devices&&!Array.isArray(t.devices))throw new Error("`devices` must be a list of device ids");this._config={show_next_alarm:!0,hide_disabled:!1,...t},this._views=[]}set hass(t){const e=this._hass;this._hass=t,this._shouldRefresh(e,t)&&this.requestUpdate()}get hass(){return this._hass}_shouldRefresh(t,e){return!t||!this._views.length||(t.entities!==e.entities||t.devices!==e.devices||(t.locale!==e.locale||t.themes!==e.themes||this._views.some(i=>i.trackedEntityIds.some(i=>t.states[i]!==e.states[i]))))}connectedCallback(){super.connectedCallback(),this._tickTimer=window.setInterval(()=>{this._now=Date.now()},3e4)}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._tickTimer&&(window.clearInterval(this._tickTimer),this._tickTimer=void 0)}getCardSize(){return 1+Math.max(1,this._views.length)}getGridOptions(){return{columns:12,rows:1+Math.max(1,this._views.length),min_columns:6,min_rows:2}}render(){const t=this._hass,e=this._config;if(!t||!e)return ot;const i=Pt(t),s=e.devices&&e.devices.length?e.devices:ee(t);this._views=s.filter(e=>t.devices?.[e]).map(e=>re(t,e)).filter(t=>!t.incomplete).sort((e,i)=>e.name.localeCompare(i.name,Dt(t)));const n=e.hide_disabled?this._views.filter(t=>t.enabled):this._views;return n.length?st`
      <ha-card .header=${e.title}>
        <div class="list">${n.map(t=>this._renderRow(t,i))}</div>
      </ha-card>
    `:st`
        <ha-card .header=${e.title}>
          <div class="error">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            <span>${i("error.no_alarms")}</span>
          </div>
        </ha-card>
      `}_renderRow(t,e){const i=Dt(this._hass),s=t.alarmTime?`${String(t.alarmTime.hours).padStart(2,"0")}:${String(t.alarmTime.minutes).padStart(2,"0")}`:e("label.no_time");return st`
      <div class=${Ct({row:!0,[`status-${t.status}`]:!0})}>
        <div class="icon" aria-hidden="true">
          <ha-icon icon=${p[t.status]??p.unknown}></ha-icon>
        </div>
        <button type="button" class="info" @click=${()=>this._openInfo(t)}>
          <span class="name">${t.name}</span>
          <span class="sub">${this._subtitle(t,e,i)}</span>
        </button>
        <span class="time">${s}</span>
        ${t.canDismiss?st`
              <div class="row-actions">
                ${t.canSnooze?st`<button
                        type="button"
                        class="icon-btn"
                        aria-label=${e("action.snooze")}
                        title=${e("action.snooze")}
                        @click=${()=>this._snooze(t)}
                      >
                        <ha-icon icon="mdi:alarm-snooze"></ha-icon>
                      </button>`:ot}
                <button
                  type="button"
                  class="icon-btn danger-icon"
                  aria-label=${e("action.dismiss")}
                  title=${e("action.dismiss")}
                  @click=${()=>this._dismiss(t)}
                >
                  <ha-icon icon="mdi:alarm-off"></ha-icon>
                </button>
              </div>
            `:this._renderToggle(t,e)}
      </div>
    `}_renderToggle(t,e){return t.entities.enabled?st`
      <button
        type="button"
        role="switch"
        class=${Ct({toggle:!0,on:t.enabled})}
        aria-checked=${t.enabled?"true":"false"}
        aria-label=${`${t.name}: ${e(t.enabled?"action.disable":"action.enable")}`}
        @click=${()=>this._toggle(t)}
      >
        <span class="knob"></span>
      </button>
    `:ot}_subtitle(t,e,i){return t.status===c||t.status===h?e(`status.${t.status}`):!1!==this._config?.show_next_alarm&&t.nextAlarm?t.status===d?`${e("status.snoozed")} · ${e("label.until",{time:Rt(t.nextAlarm,i)})}`:Nt(t.nextAlarm,this._now,e):e(`status.${t.status}`)}_openInfo(t){const e=t.entities.status??t.entities.enabled;e&&Gt(this,e)}_toggle(t){this._hass&&t.entities.enabled&&Zt(this._hass,t.entities.enabled)}_snooze(t){this._hass&&Jt(this._hass,t.deviceId)}_dismiss(t){this._hass&&Xt(this._hass,t.deviceId)}};ce.styles=[Wt,Bt,Kt,y`
      :host {
        display: block;
      }

      .list {
        display: flex;
        flex-direction: column;
        padding: 4px 8px 8px;
      }

      .row {
        --status-color: var(--alarm-clocks-disabled);
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 56px;
        padding: 4px 8px;
      }

      .row + .row {
        border-top: 1px solid var(--divider-color);
      }

      .row.status-armed,
      .row.status-pre_active,
      .row.status-post_pending {
        --status-color: var(--alarm-clocks-armed);
      }

      .row.status-ringing {
        --status-color: var(--alarm-clocks-ringing);
      }

      .row.status-snoozed {
        --status-color: var(--alarm-clocks-snoozed);
      }

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: var(--alarm-clocks-chip-background);
        background: color-mix(in srgb, var(--status-color) 18%, transparent);
        color: var(--status-color);
      }

      .icon ha-icon {
        --mdc-icon-size: 20px;
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

      .sub {
        max-width: 100%;
        color: var(--secondary-text-color);
        font-size: 0.8rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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

      .toggle {
        position: relative;
        flex: 0 0 auto;
        width: 42px;
        height: 26px;
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
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--card-background-color, #fff);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        transition: transform 180ms ease-out;
      }

      .toggle.on .knob {
        transform: translateX(16px);
      }

      @media (max-width: 340px) {
        .time {
          display: none;
        }
      }
    `],m([Et()],ce.prototype,"_config",void 0),m([Et()],ce.prototype,"_now",void 0),ce=m([xt(s)],ce),window.customCards=window.customCards??[],window.customCards.push({type:e,name:"Alarm Clock Card",description:"Alarm time, weekdays, snooze and dismiss for a single alarm clock.",preview:!0,documentationURL:o},{type:s,name:"Alarm Clock List Card",description:"Compact overview of all alarm clocks.",preview:!0,documentationURL:o}),console.info("%c ALARM-CLOCKS-CARD %c 1.0.0 ","color: white; background: #03a9f4; font-weight: 700;","color: #03a9f4; background: white; font-weight: 700;");const de=[{name:"device_id",selector:{device:{filter:{integration:t}}}},{name:"name",selector:{text:{}}},{name:"minute_step",selector:{number:{min:1,max:30,step:1,mode:"box",unit_of_measurement:"min"}}},{name:"",type:"grid",schema:[{name:"show_days",selector:{boolean:{}}},{name:"show_next_alarm",selector:{boolean:{}}},{name:"show_settings",selector:{boolean:{}}},{name:"settings_expanded",selector:{boolean:{}}},{name:"show_test_button",selector:{boolean:{}}}]}];let he=class extends $t{constructor(){super(...arguments),this._computeLabel=t=>Pt(this.hass)(`editor.${t.name}`),this._valueChanged=t=>{t.stopPropagation(),Yt(this,"config-changed",{config:t.detail.value})}}setConfig(t){this._config=t}render(){return this.hass&&this._config?st`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${de}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:ot}};he.styles=y`
    ha-form {
      display: block;
    }
  `,m([Et()],he.prototype,"hass",void 0),m([Et()],he.prototype,"_config",void 0),he=m([xt(i)],he);var ue=Object.freeze({__proto__:null,get MacaAlarmCardEditor(){return he}});const pe=[{name:"title",selector:{text:{}}},{name:"devices",selector:{device:{filter:{integration:t},multiple:!0}}},{name:"",type:"grid",schema:[{name:"show_next_alarm",selector:{boolean:{}}},{name:"hide_disabled",selector:{boolean:{}}}]}];let me=class extends $t{constructor(){super(...arguments),this._computeLabel=t=>Pt(this.hass)(`editor.${t.name}`),this._valueChanged=t=>{t.stopPropagation(),Yt(this,"config-changed",{config:t.detail.value})}}setConfig(t){this._config=t}render(){return this.hass&&this._config?st`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${pe}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:ot}};me.styles=y`
    ha-form {
      display: block;
    }
  `,m([Et()],me.prototype,"hass",void 0),m([Et()],me.prototype,"_config",void 0),me=m([xt(n)],me);var ge=Object.freeze({__proto__:null,get MacaAlarmListCardEditor(){return me}});
