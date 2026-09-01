const t="alarm_clocks",e="alarm-clocks-card",s="alarm-clocks-card-editor",i="alarm-clocks-list-card",n="alarm-clocks-list-card-editor",o="https://github.com/julezdean/ha-alarm-clocks",r=["mon","tue","wed","thu","fri","sat","sun"],a="disabled",l="armed",c="ringing",d="snoozed",h="post_pending",u=["unavailable","unknown","none",""],p={disabled:"mdi:alarm-off",armed:"mdi:alarm-check",ringing:"mdi:bell-ring",snoozed:"mdi:alarm-snooze",pre_active:"mdi:weather-sunset-up",post_pending:"mdi:clock-end",unknown:"mdi:alarm-note"};function m(t,e,s,i){var n,o=arguments.length,r=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,s,r):n(e,s))||r);return o>3&&r&&Object.defineProperty(e,s,r),r}"function"==typeof SuppressedError&&SuppressedError;const g=globalThis,f=g.ShadowRoot&&(void 0===g.ShadyCSS||g.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,_=Symbol(),b=new WeakMap;let v=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==_)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(f&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=b.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&b.set(e,t))}return t}toString(){return this.cssText}};const y=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new v(s,t,_)},$=f?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new v("string"==typeof t?t:t+"",void 0,_))(e)})(t):t,{is:w,defineProperty:x,getOwnPropertyDescriptor:k,getOwnPropertyNames:A,getOwnPropertySymbols:E,getPrototypeOf:S}=Object,z=globalThis,C=z.trustedTypes,T=C?C.emptyScript:"",O=z.reactiveElementPolyfillSupport,P=(t,e)=>t,M={toAttribute(t,e){switch(e){case Boolean:t=t?T:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},D=(t,e)=>!w(t,e),I={attribute:!0,type:String,converter:M,reflect:!1,useDefault:!1,hasChanged:D};Symbol.metadata??=Symbol("metadata"),z.litPropertyMetadata??=new WeakMap;let U=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=I){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&x(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=k(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const o=i?.call(this);n?.call(this,e),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??I}static _$Ei(){if(this.hasOwnProperty(P("elementProperties")))return;const t=S(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(P("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(P("properties"))){const t=this.properties,e=[...A(t),...E(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift($(t))}else void 0!==t&&e.push($(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(f)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of e){const e=document.createElement("style"),i=g.litNonce;void 0!==i&&e.setAttribute("nonce",i),e.textContent=s.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:M).toAttribute(e,s.type);this._$Em=t,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:M;this._$Em=i;const o=n.fromAttribute(e,t.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(void 0!==t){const o=this.constructor;if(!1===i&&(n=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??D)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};U.elementStyles=[],U.shadowRootOptions={mode:"open"},U[P("elementProperties")]=new Map,U[P("finalized")]=new Map,O?.({ReactiveElement:U}),(z.reactiveElementVersions??=[]).push("2.1.2");const N=globalThis,R=t=>t,H=N.trustedTypes,j=H?H.createPolicy("lit-html",{createHTML:t=>t}):void 0,L="$lit$",W=`lit$${Math.random().toFixed(9).slice(2)}$`,B="?"+W,q=`<${B}>`,K=document,V=()=>K.createComment(""),F=t=>null===t||"object"!=typeof t&&"function"!=typeof t,G=Array.isArray,J="[ \t\n\f\r]",X=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Z=/-->/g,Y=/>/g,Q=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),tt=/'/g,et=/"/g,st=/^(?:script|style|textarea|title)$/i,it=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),nt=Symbol.for("lit-noChange"),ot=Symbol.for("lit-nothing"),rt=new WeakMap,at=K.createTreeWalker(K,129);function lt(t,e){if(!G(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==j?j.createHTML(e):e}const ct=(t,e)=>{const s=t.length-1,i=[];let n,o=2===e?"<svg>":3===e?"<math>":"",r=X;for(let e=0;e<s;e++){const s=t[e];let a,l,c=-1,d=0;for(;d<s.length&&(r.lastIndex=d,l=r.exec(s),null!==l);)d=r.lastIndex,r===X?"!--"===l[1]?r=Z:void 0!==l[1]?r=Y:void 0!==l[2]?(st.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=Q):void 0!==l[3]&&(r=Q):r===Q?">"===l[0]?(r=n??X,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?Q:'"'===l[3]?et:tt):r===et||r===tt?r=Q:r===Z||r===Y?r=X:(r=Q,n=void 0);const h=r===Q&&t[e+1].startsWith("/>")?" ":"";o+=r===X?s+q:c>=0?(i.push(a),s.slice(0,c)+L+s.slice(c)+W+h):s+W+(-2===c?e:h)}return[lt(t,o+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class dt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[l,c]=ct(t,e);if(this.el=dt.createElement(l,s),at.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=at.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(L)){const e=c[o++],s=i.getAttribute(t).split(W),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:s,ctor:"."===r[1]?gt:"?"===r[1]?ft:"@"===r[1]?_t:mt}),i.removeAttribute(t)}else t.startsWith(W)&&(a.push({type:6,index:n}),i.removeAttribute(t));if(st.test(i.tagName)){const t=i.textContent.split(W),e=t.length-1;if(e>0){i.textContent=H?H.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],V()),at.nextNode(),a.push({type:2,index:++n});i.append(t[e],V())}}}else if(8===i.nodeType)if(i.data===B)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(W,t+1));)a.push({type:7,index:n}),t+=W.length-1}n++}}static createElement(t,e){const s=K.createElement("template");return s.innerHTML=t,s}}function ht(t,e,s=t,i){if(e===nt)return e;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const o=F(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(e=ht(t,n._$AS(t,e.values),n,i)),e}class ut{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??K).importNode(e,!0);at.currentNode=i;let n=at.nextNode(),o=0,r=0,a=s[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new pt(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new bt(n,this,t)),this._$AV.push(e),a=s[++r]}o!==a?.index&&(n=at.nextNode(),o++)}return at.currentNode=K,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class pt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=ot,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ht(this,t,e),F(t)?t===ot||null==t||""===t?(this._$AH!==ot&&this._$AR(),this._$AH=ot):t!==this._$AH&&t!==nt&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>G(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==ot&&F(this._$AH)?this._$AA.nextSibling.data=t:this.T(K.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=dt.createElement(lt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new ut(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=rt.get(t.strings);return void 0===e&&rt.set(t.strings,e=new dt(t)),e}k(t){G(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new pt(this.O(V()),this.O(V()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=R(t).nextSibling;R(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class mt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=ot,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=ot}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(void 0===n)t=ht(this,t,e,0),o=!F(t)||t!==this._$AH&&t!==nt,o&&(this._$AH=t);else{const i=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=ht(this,i[s+r],e,r),a===nt&&(a=this._$AH[r]),o||=!F(a)||a!==this._$AH[r],a===ot?t=ot:t!==ot&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}o&&!i&&this.j(t)}j(t){t===ot?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class gt extends mt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===ot?void 0:t}}class ft extends mt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==ot)}}class _t extends mt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=ht(this,t,e,0)??ot)===nt)return;const s=this._$AH,i=t===ot&&s!==ot||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==ot&&(s===ot||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class bt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){ht(this,t)}}const vt=N.litHtmlPolyfillSupport;vt?.(dt,pt),(N.litHtmlVersions??=[]).push("3.3.3");const yt=globalThis;let $t=class extends U{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let n=i._$litPart$;if(void 0===n){const t=s?.renderBefore??null;i._$litPart$=n=new pt(e.insertBefore(V(),t),t,void 0,s??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return nt}};$t._$litElement$=!0,$t.finalized=!0,yt.litElementHydrateSupport?.({LitElement:$t});const wt=yt.litElementPolyfillSupport;wt?.({LitElement:$t}),(yt.litElementVersions??=[]).push("4.2.2");const xt=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},kt={attribute:!0,type:String,converter:M,reflect:!1,hasChanged:D},At=(t=kt,e,s)=>{const{kind:i,metadata:n}=s;let o=globalThis.litPropertyMetadata.get(n);if(void 0===o&&globalThis.litPropertyMetadata.set(n,o=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),o.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const n=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,n,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const n=this[i];e.call(this,s),this.requestUpdate(i,n,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function Et(t){return(e,s)=>"object"==typeof s?At(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function St(t){return Et({...t,state:!0,attribute:!1})}const zt=1;class Ct{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const Tt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends Ct{constructor(t){if(super(t),t.type!==zt||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const s=t.element.classList;for(const t of this.st)t in e||(s.remove(t),this.st.delete(t));for(const t in e){const i=!!e[t];i===this.st.has(t)||this.nt?.has(t)||(i?(s.add(t),this.st.add(t)):(s.remove(t),this.st.delete(t)))}return nt}}),Ot={"status.disabled":"Disabled","status.armed":"Armed","status.ringing":"Ringing","status.snoozed":"Snoozed","status.pre_active":"Pre phase","status.post_pending":"Post action","status.unknown":"Unknown","action.snooze":"Snooze","action.dismiss":"Dismiss","action.test":"Test","action.enable":"Turn alarm on","action.disable":"Turn alarm off","action.toggle_day":"Toggle {day}","action.decrease":"Decrease {label}","action.increase":"Increase {label}","action.show_settings":"Show settings","action.hide_settings":"Hide settings","label.no_alarm":"No alarm","label.one_shot":"One-shot","label.settings":"Settings","label.snooze_duration":"Snooze","label.pre_offset":"Pre","label.post_offset":"Post","label.auto_dismiss":"Auto off","label.ringing_since":"for {duration}","label.until":"until {time}","label.post_pending":"Post action pending","label.off":"off","label.no_time":"--:--","time.in":"in {duration}","time.ago":"{duration} ago","time.now":"now","time.today":"Today","time.tomorrow":"Tomorrow","unit.day":"d","unit.hour":"h","unit.minute":"min","unit.minutes_short":"min","error.no_device":"No alarm selected. Pick an alarm clock device in the card editor.","error.multiple_devices":"There is more than one alarm clock. Pick one in the card editor.","error.device_not_found":"The configured alarm no longer exists. Was it removed from the integrations page?","error.incomplete":"The entities of this alarm could not be mapped. Are they disabled in the entity registry?","error.unavailable":"This alarm is currently unavailable.","error.no_alarms":"No alarm clocks found.","editor.device_id":"Alarm","editor.devices":"Alarms (empty = all)","editor.name":"Name (optional)","editor.title":"Title (optional)","editor.show_days":"Show weekdays","editor.show_next_alarm":"Show next alarm","editor.show_settings":"Show settings","editor.settings_expanded":"Start with settings expanded","editor.show_test_button":"Show test button","editor.hide_disabled":"Hide disabled alarms"},Pt={de:{"status.disabled":"Deaktiviert","status.armed":"Bereit","status.ringing":"Klingelt","status.snoozed":"Schlummert","status.pre_active":"Vorlauf","status.post_pending":"Nachlauf","status.unknown":"Unbekannt","action.snooze":"Schlummern","action.dismiss":"Ausschalten","action.test":"Testen","action.enable":"Wecker einschalten","action.disable":"Wecker ausschalten","action.toggle_day":"{day} umschalten","action.decrease":"{label} verringern","action.increase":"{label} erhöhen","action.show_settings":"Einstellungen anzeigen","action.hide_settings":"Einstellungen ausblenden","label.no_alarm":"Kein Alarm","label.one_shot":"Einmalig","label.settings":"Einstellungen","label.snooze_duration":"Snooze","label.pre_offset":"Vorlauf","label.post_offset":"Nachlauf","label.auto_dismiss":"Auto-Aus","label.ringing_since":"seit {duration}","label.until":"bis {time}","label.post_pending":"Post-Aktion läuft","label.off":"aus","label.no_time":"--:--","time.in":"in {duration}","time.ago":"vor {duration}","time.now":"jetzt","time.today":"Heute","time.tomorrow":"Morgen","unit.day":"Tg.","unit.hour":"Std.","unit.minute":"Min.","unit.minutes_short":"min","error.no_device":"Kein Wecker ausgewählt. Wähle im Card-Editor einen Wecker aus.","error.multiple_devices":"Es gibt mehrere Wecker. Wähle im Card-Editor aus, welcher angezeigt werden soll.","error.device_not_found":"Der konfigurierte Wecker existiert nicht mehr. Wurde er in den Integrationen entfernt?","error.incomplete":"Die Entities dieses Weckers konnten nicht zugeordnet werden. Sind sie in der Entity-Registry deaktiviert?","error.unavailable":"Der Wecker ist derzeit nicht verfügbar.","error.no_alarms":"Keine Wecker gefunden.","editor.device_id":"Wecker","editor.devices":"Wecker (leer = alle)","editor.name":"Name (optional)","editor.title":"Titel (optional)","editor.show_days":"Wochentage anzeigen","editor.show_next_alarm":"Nächsten Alarm anzeigen","editor.show_settings":"Einstellungen anzeigen","editor.settings_expanded":"Einstellungen aufgeklappt starten","editor.show_test_button":"Test-Button anzeigen","editor.hide_disabled":"Deaktivierte Wecker ausblenden"},en:Ot};function Mt(t){return(t?.locale?.language??t?.language??"en").split("-")[0].toLowerCase()}function Dt(t){const e=Pt[Mt(t)]??Ot;return(t,s)=>{let i=e[t]??Ot[t]??t;if(s)for(const[t,e]of Object.entries(s))i=i.replace(`{${t}}`,String(e));return i}}function It(t){if(!t||u.includes(t.state))return;const e=new Date(t.state);return Number.isNaN(e.getTime())?void 0:e}function Ut(t){if(!t||u.includes(t.state))return;const e=/^(\d{1,2}):(\d{2})/.exec(t.state);if(!e)return;const s=Number(e[1]),i=Number(e[2]);return s>23||i>59?void 0:{hours:s,minutes:i}}function Nt(t,e){const s=Math.max(1,Math.round(Math.abs(t)/6e4)),i=Math.floor(s/1440),n=Math.floor(s%1440/60),o=s%60,r=[];return i>0?(r.push(`${i} ${e("unit.day")}`),n>0&&r.push(`${n} ${e("unit.hour")}`)):n>0?(r.push(`${n} ${e("unit.hour")}`),o>0&&r.push(`${o} ${e("unit.minute")}`)):r.push(`${o} ${e("unit.minute")}`),r.join(" ")}function Rt(t,e,s){const i=t.getTime()-e;if(Math.abs(i)<3e4)return s("time.now");const n=Nt(i,s);return s(i>0?"time.in":"time.ago",{duration:n})}function Ht(t,e){return function(t){return new Intl.DateTimeFormat(t,{hour:"2-digit",minute:"2-digit"})}(e).format(t)}const jt=new Map;function Lt(t,e){const s=`${t}|${e}`,i=jt.get(s);if(i)return i;const n=new Intl.DateTimeFormat(t,{weekday:e}),o=[];for(let t=0;t<7;t+=1)o.push(n.format(new Date(Date.UTC(2024,0,1+t,12))));return jt.set(s,o),o}const Wt=y`
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
`,qt=y`
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
`;let Kt=class extends $t{constructor(){super(...arguments),this.days=[],this.compact=!1}render(){if(!this.days.length)return ot;const t=Mt(this.hass),e=Dt(this.hass),s=Lt(t,"short"),i=Lt(t,"long"),n=Lt(t,"narrow");return it`
      <div class="days" role="group">
        ${this.days.map(t=>{const o=this.compact?n[t.index]:s[t.index];return it`
            <button
              type="button"
              role="switch"
              class=${Tt({day:!0,active:t.active})}
              aria-checked=${t.active?"true":"false"}
              aria-label=${e("action.toggle_day",{day:i[t.index]})}
              title=${i[t.index]}
              ?disabled=${!t.available}
              @click=${()=>this._toggle(t)}
            >
              <span aria-hidden="true">${o}</span>
            </button>
          `})}
      </div>
    `}_toggle(t){t.entityId&&this.dispatchEvent(new CustomEvent("day-toggled",{detail:{entityId:t.entityId},bubbles:!0,composed:!0}))}};Kt.styles=[Wt,y`
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
    `],m([Et({attribute:!1})],Kt.prototype,"hass",void 0),m([Et({attribute:!1})],Kt.prototype,"days",void 0),m([Et({type:Boolean})],Kt.prototype,"compact",void 0),Kt=m([xt("alarm-clocks-weekday-picker")],Kt);let Vt=class extends $t{constructor(){super(...arguments),this._openMoreInfo=()=>{this.dispatchEvent(new CustomEvent("setting-more-info",{detail:{entityId:this.setting.entityId},bubbles:!0,composed:!0}))}}render(){const t=Dt(this.hass),e=t(this.setting.labelKey),s=this.setting.zeroMeansOff&&0===this.setting.value?t("label.off"):`${this.setting.value} ${t("unit.minutes_short")}`;return it`
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
            aria-label=${`${e}: ${s}`}
            @click=${this._openMoreInfo}
          >
            ${s}
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
    `}_step(t){const e=Math.min(this.setting.max,Math.max(this.setting.min,this.setting.value+t*this.setting.step));e!==this.setting.value&&this.dispatchEvent(new CustomEvent("setting-changed",{detail:{entityId:this.setting.entityId,value:e},bubbles:!0,composed:!0}))}};function Ft(t,e,s){t.dispatchEvent(new CustomEvent(e,{detail:s,bubbles:!0,composed:!0,cancelable:!1}))}function Gt(t,e){Ft(t,"hass-more-info",{entityId:e})}function Jt(e,s,i){return e.callService(t,"snooze",{},{device_id:s})}function Xt(e,s){return e.callService(t,"dismiss",{},{device_id:s})}function Zt(t,e){return t.callService("switch","toggle",{},{entity_id:e})}Vt.styles=[Wt,Bt,y`
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
    `],m([Et({attribute:!1})],Vt.prototype,"hass",void 0),m([Et({attribute:!1})],Vt.prototype,"setting",void 0),Vt=m([xt("alarm-clocks-setting-row")],Vt);const Yt={"switch.enabled":"enabled","time.alarm_time":"alarmTime","number.snooze_duration":"snoozeDuration","number.pre_offset":"preOffset","number.post_offset":"postOffset","number.auto_dismiss":"autoDismiss","binary_sensor.ringing":"ringing","binary_sensor.snooze_active":"snoozeActive","sensor.next_alarm":"nextAlarm","sensor.state":"status","sensor.snooze_until":"snoozeUntil","button.snooze":"snoozeButton","button.dismiss":"dismissButton",...Object.fromEntries(r.map((t,e)=>[`switch.day_${t}`,`day${e}`]))};function Qt(t){return t.split(".",1)[0]}function te(e){const s=new Set;for(const i of Object.values(e.entities??{}))i.platform===t&&i.device_id&&s.add(i.device_id);return[...s]}function ee(t,e,s){const i=t.devices?.[e],n=i?.name_by_user||i?.name;if(n)return n;const o=s.status?t.states[s.status]:void 0;return o?.attributes.friendly_name??e}function se(t,e){return e?t.states[e]:void 0}function ie(t){return!!t&&!u.includes(t.state)}function ne(t,e,s,i,n){const o=e[s],r=se(t,o),a=function(t){if(!ie(t))return;const e=Number(t.state);return Number.isFinite(e)?e:void 0}(r);if(o&&void 0!==a)return{role:s,labelKey:i,entityId:o,value:a,min:"number"==typeof r.attributes.min?r.attributes.min:0,max:"number"==typeof r.attributes.max?r.attributes.max:999,step:"number"==typeof r.attributes.step?r.attributes.step:1,zeroMeansOff:n}}function oe(e,s){const i=function(e,s){const i={};for(const n of Object.values(e.entities??{})){if(n.device_id!==s||n.platform!==t)continue;if(!n.translation_key)continue;const e=Yt[`${Qt(n.entity_id)}.${n.translation_key}`];e&&(i[e]=n.entity_id)}return i}(e,s),{status:n,available:o}=function(t,e){const s=se(t,e.status);if(ie(s))return{status:s.state,available:!0};const i=se(t,e.ringing),n=se(t,e.snoozeActive),o=se(t,e.enabled);return"on"===i?.state?{status:c,available:!0}:"on"===n?.state?{status:d,available:!0}:ie(o)?{status:"on"===o.state?l:a,available:!0}:{status:"unknown",available:!1}}(e,i),h=se(e,i.enabled),u=h?"on"===h.state:n!==a,p=r.map((t,s)=>{const n=i[`day${s}`],o=se(e,n);return{index:s,entityId:n,active:"on"===o?.state,available:ie(o)}}),m=se(e,i.ringing),g=n===c&&m?.last_changed?new Date(m.last_changed):void 0,f=[ne(e,i,"snoozeDuration","label.snooze_duration",!0),ne(e,i,"preOffset","label.pre_offset",!0),ne(e,i,"postOffset","label.post_offset",!0),ne(e,i,"autoDismiss","label.auto_dismiss",!0)].filter(t=>void 0!==t),_=Object.values(i).filter(t=>"string"==typeof t);return{deviceId:s,name:ee(e,s,i),entities:i,trackedEntityIds:_,status:n,available:o,enabled:u,alarmTime:Ut(se(e,i.alarmTime)),nextAlarm:It(se(e,i.nextAlarm)),snoozeUntil:It(se(e,i.snoozeUntil)),ringingSince:g&&!Number.isNaN(g.getTime())?g:void 0,days:p,isOneShot:p.every(t=>!t.active),settings:f,canSnooze:(n===c||n===d)&&(f.find(t=>"snoozeDuration"===t.role)?.value??0)>0,canDismiss:n===c||n===d,canTest:u&&n!==c,incomplete:0===_.length}}const re={show_days:!0,show_next_alarm:!0,show_settings:!0,settings_expanded:!1,show_test_button:!1};let ae=class extends $t{constructor(){super(...arguments),this._now=Date.now(),this._settingsOpen=!1,this._narrow=!1,this._toggleSettings=()=>{this._settingsOpen=!this._settingsOpen},this._openDeviceInfo=()=>{const t=this._view?.entities.status??this._view?.entities.enabled;this._openEntity(t)},this._onDayToggled=t=>{this._hass&&Zt(this._hass,t.detail.entityId)},this._onSettingChanged=t=>{var e,s,i;this._hass&&(e=this._hass,s=t.detail.entityId,i=t.detail.value,e.callService("number","set_value",{value:i},{entity_id:s}))},this._onSettingMoreInfo=t=>{this._openEntity(t.detail.entityId)}}static async getConfigElement(){return await Promise.resolve().then(function(){return he}),document.createElement(s)}static getStubConfig(t){const s=te(t);return{type:`custom:${e}`,...s.length?{device_id:s[0]}:{}}}setConfig(t){if(!t)throw new Error("Invalid configuration");if(t.device_id&&"string"!=typeof t.device_id)throw new Error("`device_id` must be a string");if(t.entity&&"string"!=typeof t.entity)throw new Error("`entity` must be an entity id");this._config={...re,...t},this._settingsOpen=!0===this._config.settings_expanded,this._view=void 0}set hass(t){const e=this._hass;this._hass=t,this._shouldRefresh(e,t)&&(this._view=void 0,this.requestUpdate())}get hass(){return this._hass}_shouldRefresh(t,e){return!t||!this._view||(t.entities!==e.entities||t.devices!==e.devices||(t.locale!==e.locale||t.themes!==e.themes||this._view.trackedEntityIds.some(s=>t.states[s]!==e.states[s])))}connectedCallback(){super.connectedCallback(),this._tickTimer=window.setInterval(()=>{this._now=Date.now()},3e4),"undefined"!=typeof ResizeObserver&&(this._resizeObserver=new ResizeObserver(t=>{const e=t[0]?.contentRect.width??0,s=e>0&&e<320;s!==this._narrow&&(this._narrow=s)}),this._resizeObserver.observe(this))}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._tickTimer&&(window.clearInterval(this._tickTimer),this._tickTimer=void 0),this._resizeObserver?.disconnect(),this._resizeObserver=void 0}getCardSize(){let t=3;return!1!==this._config?.show_days&&(t+=1),!1!==this._config?.show_settings&&(t+=1),t}getGridOptions(){let t=3;return!1!==this._config?.show_days&&(t+=1),this._settingsOpen&&(t+=2),{columns:12,rows:t,min_columns:6,min_rows:3}}render(){const t=this._hass,e=this._config;if(!t||!e)return ot;const s=Dt(t),{deviceId:i,error:n}=function(t,e){if(e.device_id)return t.devices?.[e.device_id]?{deviceId:e.device_id}:{error:"not_found"};if(e.entity){const s=t.entities?.[e.entity]?.device_id;return s?{deviceId:s}:{error:"not_found"}}const s=te(t);return 1===s.length?{deviceId:s[0]}:{error:0===s.length?"none":"multiple"}}(t,e);if(!i){const t="multiple"===n?"error.multiple_devices":"not_found"===n?"error.device_not_found":"error.no_device";return this._renderError(s(t))}const o=oe(t,i);if(this._view=o,o.incomplete)return this._renderError(s("error.incomplete"));const r=e.name??o.name;return it`
      <ha-card class=${Tt({[`status-${o.status}`]:!0,disabled:!o.enabled})}>
        <div class="content">
          ${this._renderHeader(o,r,s)} ${this._renderHero(o,s)}
          ${!1!==e.show_days?this._renderDays(o,s):ot}
          ${this._renderActions(o,s)}
          ${!1!==e.show_settings&&o.settings.length?this._renderSettings(o,s):ot}
        </div>
      </ha-card>
    `}_renderHeader(t,e,s){const i=s(`status.${t.status}`);return it`
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
            <span class="dot" aria-hidden="true"></span>${i}
          </span>
        </button>
        ${this._renderToggle(t,s)}
      </div>
    `}_renderToggle(t,e){return t.entities.enabled?it`
      <button
        type="button"
        role="switch"
        class=${Tt({toggle:!0,on:t.enabled})}
        aria-checked=${t.enabled?"true":"false"}
        aria-label=${e(t.enabled?"action.disable":"action.enable")}
        @click=${()=>this._toggleEnabled(t)}
      >
        <span class="knob"></span>
      </button>
    `:ot}_renderHero(t,e){const s=Mt(this._hass),i=t.alarmTime?`${String(t.alarmTime.hours).padStart(2,"0")}:${String(t.alarmTime.minutes).padStart(2,"0")}`:e("label.no_time");return it`
      <div class="hero">
        <button
          type="button"
          class="time"
          ?disabled=${!t.entities.alarmTime}
          aria-label=${i}
          @click=${()=>this._openEntity(t.entities.alarmTime)}
        >
          ${i}
        </button>
        <div class="meta">${this._renderMeta(t,e,s)}</div>
      </div>
    `}_renderMeta(t,e,s){if(!1===this._config?.show_next_alarm)return ot;if(t.status===c){const s=t.ringingSince?e("label.ringing_since",{duration:Nt(this._now-t.ringingSince.getTime(),e)}):e("status.ringing");return it`<span class="primary">${s}</span>`}if(t.status===h)return it`<span class="primary">${e("label.post_pending")}</span>`;if(!t.nextAlarm)return it`<span class="primary muted">${e("label.no_alarm")}</span>`;const i=Rt(t.nextAlarm,this._now,e),n=t.status===d?e("label.until",{time:Ht(t.nextAlarm,s)}):function(t,e,s,i){const n=new Date(e),o=new Date(n.getFullYear(),n.getMonth(),n.getDate()).getTime(),r=Math.floor((t.getTime()-o)/864e5),a=Ht(t,s);return 0===r?`${i("time.today")}, ${a}`:1===r?`${i("time.tomorrow")}, ${a}`:`${new Intl.DateTimeFormat(s,{weekday:"short"}).format(t)}, ${a}`}(t.nextAlarm,this._now,s,e);return it`
      <span class="primary">${i}</span>
      <span class="secondary">${n}</span>
      ${t.isOneShot?it`<span class="badge">${e("label.one_shot")}</span>`:ot}
    `}_renderDays(t,e){return it`
      <alarm-clocks-weekday-picker
        .hass=${this._hass}
        .days=${t.days}
        .compact=${this._narrow}
        @day-toggled=${this._onDayToggled}
      ></alarm-clocks-weekday-picker>
    `}_renderActions(t,e){const s=!0===this._config?.show_test_button&&!t.canDismiss;return t.canDismiss||s?it`
      <div class="actions">
        ${t.canSnooze?it`<button
              type="button"
              class="btn"
              ?disabled=${!t.entities.snoozeButton&&!t.entities.status}
              @click=${()=>this._snooze(t)}
            >
              <ha-icon icon="mdi:alarm-snooze"></ha-icon>${e("action.snooze")}
            </button>`:ot}
        ${t.canDismiss?it`<button type="button" class="btn danger" @click=${()=>this._dismiss(t)}>
              <ha-icon icon="mdi:alarm-off"></ha-icon>${e("action.dismiss")}
            </button>`:ot}
        ${s?it`<button
              type="button"
              class="btn"
              ?disabled=${!t.canTest}
              @click=${()=>this._test(t)}
            >
              <ha-icon icon="mdi:play-circle-outline"></ha-icon>${e("action.test")}
            </button>`:ot}
      </div>
    `:ot}_renderSettings(t,e){const s=t.settings.map(t=>{const s=t.zeroMeansOff&&0===t.value?e("label.off"):`${t.value} ${e("unit.minutes_short")}`;return`${e(t.labelKey)} ${s}`}).join(" · ");return it`
      <div class="settings">
        <button
          type="button"
          class="settings-toggle"
          aria-expanded=${this._settingsOpen?"true":"false"}
          aria-label=${e(this._settingsOpen?"action.hide_settings":"action.show_settings")}
          @click=${this._toggleSettings}
        >
          <span class="summary">${s}</span>
          <ha-icon icon=${this._settingsOpen?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        ${this._settingsOpen?it`<div class="settings-body">
              ${t.settings.map(t=>it`
                  <alarm-clocks-setting-row
                    .hass=${this._hass}
                    .setting=${t}
                    @setting-changed=${this._onSettingChanged}
                    @setting-more-info=${this._onSettingMoreInfo}
                  ></alarm-clocks-setting-row>
                `)}
            </div>`:ot}
      </div>
    `}_renderError(t){return it`
      <ha-card>
        <div class="error">
          <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
          <span>${t}</span>
        </div>
      </ha-card>
    `}_openEntity(t){t&&Gt(this,t)}_toggleEnabled(t){this._hass&&t.entities.enabled&&Zt(this._hass,t.entities.enabled)}_snooze(t){this._hass&&Jt(this._hass,t.deviceId)}_dismiss(t){this._hass&&Xt(this._hass,t.deviceId)}_test(e){var s,i;this._hass&&(s=this._hass,i=e.deviceId,s.callService(t,"trigger_alarm",{},{device_id:i}))}};ae.styles=[Wt,Bt,qt,y`
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

      .time {
        padding: 0;
        border: none;
        background: transparent;
        color: var(--primary-text-color);
        font-family: inherit;
        font-size: 2.4rem;
        font-weight: 300;
        font-variant-numeric: tabular-nums;
        line-height: 1.1;
        letter-spacing: -0.02em;
        cursor: pointer;
      }

      .time:disabled {
        cursor: default;
        opacity: 0.6;
      }

      .time:focus-visible {
        outline: 2px solid var(--alarm-clocks-accent);
        outline-offset: 4px;
        border-radius: 6px;
      }

      ha-card.disabled .time {
        color: var(--secondary-text-color);
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
    `],m([St()],ae.prototype,"_config",void 0),m([St()],ae.prototype,"_now",void 0),m([St()],ae.prototype,"_settingsOpen",void 0),m([St()],ae.prototype,"_narrow",void 0),ae=m([xt(e)],ae);let le=class extends $t{constructor(){super(...arguments),this._now=Date.now(),this._views=[]}static async getConfigElement(){return await Promise.resolve().then(function(){return me}),document.createElement(n)}static getStubConfig(){return{type:`custom:${i}`}}setConfig(t){if(!t)throw new Error("Invalid configuration");if(void 0!==t.devices&&!Array.isArray(t.devices))throw new Error("`devices` must be a list of device ids");this._config={show_next_alarm:!0,hide_disabled:!1,...t},this._views=[]}set hass(t){const e=this._hass;this._hass=t,this._shouldRefresh(e,t)&&this.requestUpdate()}get hass(){return this._hass}_shouldRefresh(t,e){return!t||!this._views.length||(t.entities!==e.entities||t.devices!==e.devices||(t.locale!==e.locale||t.themes!==e.themes||this._views.some(s=>s.trackedEntityIds.some(s=>t.states[s]!==e.states[s]))))}connectedCallback(){super.connectedCallback(),this._tickTimer=window.setInterval(()=>{this._now=Date.now()},3e4)}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._tickTimer&&(window.clearInterval(this._tickTimer),this._tickTimer=void 0)}getCardSize(){return 1+Math.max(1,this._views.length)}getGridOptions(){return{columns:12,rows:1+Math.max(1,this._views.length),min_columns:6,min_rows:2}}render(){const t=this._hass,e=this._config;if(!t||!e)return ot;const s=Dt(t),i=e.devices&&e.devices.length?e.devices:te(t);this._views=i.filter(e=>t.devices?.[e]).map(e=>oe(t,e)).filter(t=>!t.incomplete).sort((e,s)=>e.name.localeCompare(s.name,Mt(t)));const n=e.hide_disabled?this._views.filter(t=>t.enabled):this._views;return n.length?it`
      <ha-card .header=${e.title}>
        <div class="list">${n.map(t=>this._renderRow(t,s))}</div>
      </ha-card>
    `:it`
        <ha-card .header=${e.title}>
          <div class="error">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            <span>${s("error.no_alarms")}</span>
          </div>
        </ha-card>
      `}_renderRow(t,e){const s=Mt(this._hass),i=t.alarmTime?`${String(t.alarmTime.hours).padStart(2,"0")}:${String(t.alarmTime.minutes).padStart(2,"0")}`:e("label.no_time");return it`
      <div class=${Tt({row:!0,[`status-${t.status}`]:!0})}>
        <div class="icon" aria-hidden="true">
          <ha-icon icon=${p[t.status]??p.unknown}></ha-icon>
        </div>
        <button type="button" class="info" @click=${()=>this._openInfo(t)}>
          <span class="name">${t.name}</span>
          <span class="sub">${this._subtitle(t,e,s)}</span>
        </button>
        <span class="time">${i}</span>
        ${t.canDismiss?it`
              <div class="row-actions">
                ${t.canSnooze?it`<button
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
    `}_renderToggle(t,e){return t.entities.enabled?it`
      <button
        type="button"
        role="switch"
        class=${Tt({toggle:!0,on:t.enabled})}
        aria-checked=${t.enabled?"true":"false"}
        aria-label=${`${t.name}: ${e(t.enabled?"action.disable":"action.enable")}`}
        @click=${()=>this._toggle(t)}
      >
        <span class="knob"></span>
      </button>
    `:ot}_subtitle(t,e,s){return t.status===c||t.status===h?e(`status.${t.status}`):!1!==this._config?.show_next_alarm&&t.nextAlarm?t.status===d?`${e("status.snoozed")} · ${e("label.until",{time:Ht(t.nextAlarm,s)})}`:Rt(t.nextAlarm,this._now,e):e(`status.${t.status}`)}_openInfo(t){const e=t.entities.status??t.entities.enabled;e&&Gt(this,e)}_toggle(t){this._hass&&t.entities.enabled&&Zt(this._hass,t.entities.enabled)}_snooze(t){this._hass&&Jt(this._hass,t.deviceId)}_dismiss(t){this._hass&&Xt(this._hass,t.deviceId)}};le.styles=[Wt,Bt,qt,y`
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
    `],m([St()],le.prototype,"_config",void 0),m([St()],le.prototype,"_now",void 0),le=m([xt(i)],le),window.customCards=window.customCards??[],window.customCards.push({type:e,name:"Alarm Clock Card",description:"Alarm time, weekdays, snooze and dismiss for a single alarm clock.",preview:!0,documentationURL:o},{type:i,name:"Alarm Clock List Card",description:"Compact overview of all alarm clocks.",preview:!0,documentationURL:o}),console.info("%c ALARM-CLOCKS-CARD %c 1.0.0 ","color: white; background: #03a9f4; font-weight: 700;","color: #03a9f4; background: white; font-weight: 700;");const ce=[{name:"device_id",selector:{device:{filter:{integration:t}}}},{name:"name",selector:{text:{}}},{name:"",type:"grid",schema:[{name:"show_days",selector:{boolean:{}}},{name:"show_next_alarm",selector:{boolean:{}}},{name:"show_settings",selector:{boolean:{}}},{name:"settings_expanded",selector:{boolean:{}}},{name:"show_test_button",selector:{boolean:{}}}]}];let de=class extends $t{constructor(){super(...arguments),this._computeLabel=t=>Dt(this.hass)(`editor.${t.name}`),this._valueChanged=t=>{t.stopPropagation(),Ft(this,"config-changed",{config:t.detail.value})}}setConfig(t){this._config=t}render(){return this.hass&&this._config?it`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${ce}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:ot}};de.styles=y`
    ha-form {
      display: block;
    }
  `,m([St()],de.prototype,"hass",void 0),m([St()],de.prototype,"_config",void 0),de=m([xt(s)],de);var he=Object.freeze({__proto__:null,get MacaAlarmCardEditor(){return de}});const ue=[{name:"title",selector:{text:{}}},{name:"devices",selector:{device:{filter:{integration:t},multiple:!0}}},{name:"",type:"grid",schema:[{name:"show_next_alarm",selector:{boolean:{}}},{name:"hide_disabled",selector:{boolean:{}}}]}];let pe=class extends $t{constructor(){super(...arguments),this._computeLabel=t=>Dt(this.hass)(`editor.${t.name}`),this._valueChanged=t=>{t.stopPropagation(),Ft(this,"config-changed",{config:t.detail.value})}}setConfig(t){this._config=t}render(){return this.hass&&this._config?it`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${ue}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:ot}};pe.styles=y`
    ha-form {
      display: block;
    }
  `,m([St()],pe.prototype,"hass",void 0),m([St()],pe.prototype,"_config",void 0),pe=m([xt(n)],pe);var me=Object.freeze({__proto__:null,get MacaAlarmListCardEditor(){return pe}});
