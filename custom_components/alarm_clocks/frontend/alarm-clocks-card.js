const t="alarm_clocks",e="alarm-clocks-card",s="alarm-clocks-card-editor",i=["mon","tue","wed","thu","fri","sat","sun"],n="disabled",o="armed",a="ringing",r="snoozed",l="post_pending",c=["unavailable","unknown","none",""],d={disabled:"mdi:alarm-off",armed:"mdi:alarm-check",ringing:"mdi:bell-ring",snoozed:"mdi:alarm-snooze",pre_active:"mdi:weather-sunset-up",post_pending:"mdi:clock-end",unknown:"mdi:alarm-note"};function h(t,e,s,i){var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,s,i);else for(var r=t.length-1;r>=0;r--)(n=t[r])&&(a=(o<3?n(a):o>3?n(e,s,a):n(e,s))||a);return o>3&&a&&Object.defineProperty(e,s,a),a}"function"==typeof SuppressedError&&SuppressedError;const p=globalThis,u=p.ShadowRoot&&(void 0===p.ShadyCSS||p.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,m=Symbol(),g=new WeakMap;let b=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==m)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(u&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=g.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&g.set(e,t))}return t}toString(){return this.cssText}};const f=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new b(s,t,m)},_=u?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new b("string"==typeof t?t:t+"",void 0,m))(e)})(t):t,{is:v,defineProperty:y,getOwnPropertyDescriptor:$,getOwnPropertyNames:w,getOwnPropertySymbols:x,getPrototypeOf:k}=Object,A=globalThis,S=A.trustedTypes,E=S?S.emptyScript:"",T=A.reactiveElementPolyfillSupport,C=(t,e)=>t,z={toAttribute(t,e){switch(e){case Boolean:t=t?E:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},D=(t,e)=>!v(t,e),M={attribute:!0,type:String,converter:z,reflect:!1,useDefault:!1,hasChanged:D};Symbol.metadata??=Symbol("metadata"),A.litPropertyMetadata??=new WeakMap;let O=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=M){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&y(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=$(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const o=i?.call(this);n?.call(this,e),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??M}static _$Ei(){if(this.hasOwnProperty(C("elementProperties")))return;const t=k(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(C("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(C("properties"))){const t=this.properties,e=[...w(t),...x(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(_(t))}else void 0!==t&&e.push(_(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(u)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of e){const e=document.createElement("style"),i=p.litNonce;void 0!==i&&e.setAttribute("nonce",i),e.textContent=s.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:z).toAttribute(e,s.type);this._$Em=t,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:z;this._$Em=i;const o=n.fromAttribute(e,t.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(void 0!==t){const o=this.constructor;if(!1===i&&(n=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??D)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};O.elementStyles=[],O.shadowRootOptions={mode:"open"},O[C("elementProperties")]=new Map,O[C("finalized")]=new Map,T?.({ReactiveElement:O}),(A.reactiveElementVersions??=[]).push("2.1.2");const P=globalThis,I=t=>t,N=P.trustedTypes,U=N?N.createPolicy("lit-html",{createHTML:t=>t}):void 0,H="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,j="?"+R,B=`<${j}>`,L=document,W=()=>L.createComment(""),q=t=>null===t||"object"!=typeof t&&"function"!=typeof t,K=Array.isArray,V="[ \t\n\f\r]",F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Z=/-->/g,Y=/>/g,J=RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),G=/'/g,X=/"/g,Q=/^(?:script|style|textarea|title)$/i,tt=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),et=Symbol.for("lit-noChange"),st=Symbol.for("lit-nothing"),it=new WeakMap,nt=L.createTreeWalker(L,129);function ot(t,e){if(!K(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==U?U.createHTML(e):e}const at=(t,e)=>{const s=t.length-1,i=[];let n,o=2===e?"<svg>":3===e?"<math>":"",a=F;for(let e=0;e<s;e++){const s=t[e];let r,l,c=-1,d=0;for(;d<s.length&&(a.lastIndex=d,l=a.exec(s),null!==l);)d=a.lastIndex,a===F?"!--"===l[1]?a=Z:void 0!==l[1]?a=Y:void 0!==l[2]?(Q.test(l[2])&&(n=RegExp("</"+l[2],"g")),a=J):void 0!==l[3]&&(a=J):a===J?">"===l[0]?(a=n??F,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,r=l[1],a=void 0===l[3]?J:'"'===l[3]?X:G):a===X||a===G?a=J:a===Z||a===Y?a=F:(a=J,n=void 0);const h=a===J&&t[e+1].startsWith("/>")?" ":"";o+=a===F?s+B:c>=0?(i.push(r),s.slice(0,c)+H+s.slice(c)+R+h):s+R+(-2===c?e:h)}return[ot(t,o+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class rt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const a=t.length-1,r=this.parts,[l,c]=at(t,e);if(this.el=rt.createElement(l,s),nt.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=nt.nextNode())&&r.length<a;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(H)){const e=c[o++],s=i.getAttribute(t).split(R),a=/([.?@])?(.*)/.exec(e);r.push({type:1,index:n,name:a[2],strings:s,ctor:"."===a[1]?pt:"?"===a[1]?ut:"@"===a[1]?mt:ht}),i.removeAttribute(t)}else t.startsWith(R)&&(r.push({type:6,index:n}),i.removeAttribute(t));if(Q.test(i.tagName)){const t=i.textContent.split(R),e=t.length-1;if(e>0){i.textContent=N?N.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],W()),nt.nextNode(),r.push({type:2,index:++n});i.append(t[e],W())}}}else if(8===i.nodeType)if(i.data===j)r.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(R,t+1));)r.push({type:7,index:n}),t+=R.length-1}n++}}static createElement(t,e){const s=L.createElement("template");return s.innerHTML=t,s}}function lt(t,e,s=t,i){if(e===et)return e;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const o=q(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(e=lt(t,n._$AS(t,e.values),n,i)),e}class ct{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??L).importNode(e,!0);nt.currentNode=i;let n=nt.nextNode(),o=0,a=0,r=s[0];for(;void 0!==r;){if(o===r.index){let e;2===r.type?e=new dt(n,n.nextSibling,this,t):1===r.type?e=new r.ctor(n,r.name,r.strings,this,t):6===r.type&&(e=new gt(n,this,t)),this._$AV.push(e),r=s[++a]}o!==r?.index&&(n=nt.nextNode(),o++)}return nt.currentNode=L,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class dt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=st,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=lt(this,t,e),q(t)?t===st||null==t||""===t?(this._$AH!==st&&this._$AR(),this._$AH=st):t!==this._$AH&&t!==et&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>K(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==st&&q(this._$AH)?this._$AA.nextSibling.data=t:this.T(L.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=rt.createElement(ot(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new ct(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=it.get(t.strings);return void 0===e&&it.set(t.strings,e=new rt(t)),e}k(t){K(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new dt(this.O(W()),this.O(W()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=I(t).nextSibling;I(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class ht{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=st,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=st}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(void 0===n)t=lt(this,t,e,0),o=!q(t)||t!==this._$AH&&t!==et,o&&(this._$AH=t);else{const i=t;let a,r;for(t=n[0],a=0;a<n.length-1;a++)r=lt(this,i[s+a],e,a),r===et&&(r=this._$AH[a]),o||=!q(r)||r!==this._$AH[a],r===st?t=st:t!==st&&(t+=(r??"")+n[a+1]),this._$AH[a]=r}o&&!i&&this.j(t)}j(t){t===st?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class pt extends ht{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===st?void 0:t}}class ut extends ht{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==st)}}class mt extends ht{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=lt(this,t,e,0)??st)===et)return;const s=this._$AH,i=t===st&&s!==st||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==st&&(s===st||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class gt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){lt(this,t)}}const bt=P.litHtmlPolyfillSupport;bt?.(rt,dt),(P.litHtmlVersions??=[]).push("3.3.3");const ft=globalThis;let _t=class extends O{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let n=i._$litPart$;if(void 0===n){const t=s?.renderBefore??null;i._$litPart$=n=new dt(e.insertBefore(W(),t),t,void 0,s??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return et}};_t._$litElement$=!0,_t.finalized=!0,ft.litElementHydrateSupport?.({LitElement:_t});const vt=ft.litElementPolyfillSupport;vt?.({LitElement:_t}),(ft.litElementVersions??=[]).push("4.2.2");const yt=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},$t={attribute:!0,type:String,converter:z,reflect:!1,hasChanged:D},wt=(t=$t,e,s)=>{const{kind:i,metadata:n}=s;let o=globalThis.litPropertyMetadata.get(n);if(void 0===o&&globalThis.litPropertyMetadata.set(n,o=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),o.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const n=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,n,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const n=this[i];e.call(this,s),this.requestUpdate(i,n,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function xt(t){return(e,s)=>"object"==typeof s?wt(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function kt(t){return xt({...t,state:!0,attribute:!1})}const At=1;class St{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const Et=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends St{constructor(t){if(super(t),t.type!==At||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const s=t.element.classList;for(const t of this.st)t in e||(s.remove(t),this.st.delete(t));for(const t in e){const i=!!e[t];i===this.st.has(t)||this.nt?.has(t)||(i?(s.add(t),this.st.add(t)):(s.remove(t),this.st.delete(t)))}return et}}),Tt={"status.disabled":"Disabled","status.armed":"Armed","status.ringing":"Ringing","status.snoozed":"Snoozed","status.pre_active":"Pre phase","status.post_pending":"Post action","status.unknown":"Unknown","action.snooze":"Snooze","action.dismiss":"Dismiss","action.test":"Test","action.enable":"Turn alarm on","action.disable":"Turn alarm off","action.toggle_day":"Toggle {day}","action.decrease":"Decrease {label}","action.increase":"Increase {label}","action.expand":"Expand","action.collapse":"Collapse","label.no_alarm":"No alarm","label.one_shot":"One-shot","label.settings":"Settings","label.hours":"Hours","label.minutes":"Minutes","label.snooze_duration":"Snooze","label.pre_offset":"Pre","label.post_offset":"Post","label.auto_dismiss":"Auto off","label.ringing_since":"for {duration}","label.until":"until {time}","label.post_pending":"Post action pending","label.off":"off","label.no_time":"--:--","time.in":"in {duration}","time.ago":"{duration} ago","time.now":"now","time.today":"Today","time.tomorrow":"Tomorrow","unit.day":"d","unit.hour":"h","unit.minute":"min","unit.minutes_short":"min","error.unavailable":"This alarm is currently unavailable.","error.no_alarms":"No alarm clocks found.","editor.devices":"Alarms (empty = all)","editor.title":"Title (optional)","editor.show_days":"Show weekdays","editor.show_next_alarm":"Show next alarm","editor.show_settings":"Show settings","editor.minute_step":"Minute step","editor.show_test_button":"Show test button","editor.hide_disabled":"Hide disabled alarms","editor.expandable":"Allow collapsing","editor.expanded":"Start rows expanded"},Ct={de:{"status.disabled":"Deaktiviert","status.armed":"Bereit","status.ringing":"Klingelt","status.snoozed":"Schlummert","status.pre_active":"Vorlauf","status.post_pending":"Nachlauf","status.unknown":"Unbekannt","action.snooze":"Schlummern","action.dismiss":"Ausschalten","action.test":"Testen","action.enable":"Wecker einschalten","action.disable":"Wecker ausschalten","action.toggle_day":"{day} umschalten","action.decrease":"{label} verringern","action.increase":"{label} erhöhen","action.expand":"Aufklappen","action.collapse":"Zuklappen","label.no_alarm":"Kein Alarm","label.one_shot":"Einmalig","label.settings":"Einstellungen","label.hours":"Stunden","label.minutes":"Minuten","label.snooze_duration":"Snooze","label.pre_offset":"Vorlauf","label.post_offset":"Nachlauf","label.auto_dismiss":"Auto-Aus","label.ringing_since":"seit {duration}","label.until":"bis {time}","label.post_pending":"Post-Aktion läuft","label.off":"aus","label.no_time":"--:--","time.in":"in {duration}","time.ago":"vor {duration}","time.now":"jetzt","time.today":"Heute","time.tomorrow":"Morgen","unit.day":"Tg.","unit.hour":"Std.","unit.minute":"Min.","unit.minutes_short":"min","error.unavailable":"Der Wecker ist derzeit nicht verfügbar.","error.no_alarms":"Keine Wecker gefunden.","editor.devices":"Wecker (leer = alle)","editor.title":"Titel (optional)","editor.show_days":"Wochentage anzeigen","editor.show_next_alarm":"Nächsten Alarm anzeigen","editor.show_settings":"Einstellungen anzeigen","editor.minute_step":"Minutenschritt","editor.show_test_button":"Test-Button anzeigen","editor.hide_disabled":"Deaktivierte Wecker ausblenden","editor.expandable":"Auf-/Zuklappen erlauben","editor.expanded":"Zeilen aufgeklappt starten"},en:Tt};function zt(t){return(t?.locale?.language??t?.language??"en").split("-")[0].toLowerCase()}function Dt(t){const e=Ct[zt(t)]??Tt;return(t,s)=>{let i=e[t]??Tt[t]??t;if(s)for(const[t,e]of Object.entries(s))i=i.replace(`{${t}}`,String(e));return i}}function Mt(t){if(!t||c.includes(t.state))return;const e=new Date(t.state);return Number.isNaN(e.getTime())?void 0:e}function Ot(t){if(!t||c.includes(t.state))return;const e=/^(\d{1,2}):(\d{2})/.exec(t.state);if(!e)return;const s=Number(e[1]),i=Number(e[2]);return s>23||i>59?void 0:{hours:s,minutes:i}}function Pt(t,e){const s=Math.max(1,Math.round(Math.abs(t)/6e4)),i=Math.floor(s/1440),n=Math.floor(s%1440/60),o=s%60,a=[];return i>0?(a.push(`${i} ${e("unit.day")}`),n>0&&a.push(`${n} ${e("unit.hour")}`)):n>0?(a.push(`${n} ${e("unit.hour")}`),o>0&&a.push(`${o} ${e("unit.minute")}`)):a.push(`${o} ${e("unit.minute")}`),a.join(" ")}function It(t,e,s){const i=t.getTime()-e;if(Math.abs(i)<3e4)return s("time.now");const n=Pt(i,s);return s(i>0?"time.in":"time.ago",{duration:n})}function Nt(t,e){return function(t){return new Intl.DateTimeFormat(t,{hour:"2-digit",minute:"2-digit"})}(e).format(t)}const Ut=new Map;function Ht(t,e){const s=`${t}|${e}`,i=Ut.get(s);if(i)return i;const n=new Intl.DateTimeFormat(t,{weekday:e}),o=[];for(let t=0;t<7;t+=1)o.push(n.format(new Date(Date.UTC(2024,0,1+t,12))));return Ut.set(s,o),o}const Rt=f`
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
`,jt=f`
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
`,Bt=f`
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
`;let Lt=class extends _t{constructor(){super(...arguments),this.days=[],this.compact=!1}render(){if(!this.days.length)return st;const t=zt(this.hass),e=Dt(this.hass),s=Ht(t,"short"),i=Ht(t,"long"),n=Ht(t,"narrow");return tt`
      <div class="days" role="group">
        ${this.days.map(t=>{const o=this.compact?n[t.index]:s[t.index];return tt`
            <button
              type="button"
              role="switch"
              class=${Et({day:!0,active:t.active})}
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
    `}_toggle(t){t.entityId&&this.dispatchEvent(new CustomEvent("day-toggled",{detail:{entityId:t.entityId},bubbles:!0,composed:!0}))}};Lt.styles=[Rt,f`
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
    `],h([xt({attribute:!1})],Lt.prototype,"hass",void 0),h([xt({attribute:!1})],Lt.prototype,"days",void 0),h([xt({type:Boolean})],Lt.prototype,"compact",void 0),Lt=h([yt("alarm-clocks-weekday-picker")],Lt);let Wt=class extends _t{constructor(){super(...arguments),this.hours=0,this.minutes=0,this.minuteStep=5,this.disabled=!1,this._repeatDelay=180,this._stopHold=()=>{void 0!==this._holdTimer&&(window.clearTimeout(this._holdTimer),this._holdTimer=void 0),void 0!==this._repeatTimer&&(window.clearTimeout(this._repeatTimer),this._repeatTimer=void 0)}}disconnectedCallback(){super.disconnectedCallback(),this._stopHold()}render(){const t=Dt(this.hass);return tt`
      <div class="stepper" ?data-disabled=${this.disabled}>
        ${this._renderSegment("hours",this.hours,23,t("label.hours"))}
        <span class="colon" aria-hidden="true">:</span>
        ${this._renderSegment("minutes",this.minutes,59,t("label.minutes"))}
      </div>
    `}_renderSegment(t,e,s,i){const n=Dt(this.hass);return tt`
      <div class="segment">
        <button
          type="button"
          class="arrow"
          tabindex="-1"
          aria-label=${n("action.increase",{label:i})}
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
          aria-label=${i}
          aria-valuenow=${e}
          aria-valuemin="0"
          aria-valuemax=${s}
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
          aria-label=${n("action.decrease",{label:i})}
          ?disabled=${this.disabled}
          @pointerdown=${e=>this._startHold(e,t,-1)}
          @pointerup=${this._stopHold}
          @pointercancel=${this._stopHold}
          @pointerleave=${this._stopHold}
        >
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </button>
      </div>
    `}_step(t,e){if(this.disabled)return;let{hours:s,minutes:i}=this;if("hours"===t)s=(s+e+24)%24;else{const t=Math.max(1,Math.round(this.minuteStep));i=((Math.round(i/t)*t+e*t)%60+60)%60}this.hours=s,this.minutes=i,this.dispatchEvent(new CustomEvent("time-changed",{detail:{hours:s,minutes:i},bubbles:!0,composed:!0}))}_startHold(t,e,s){this.disabled||(t.preventDefault(),t.currentTarget.setPointerCapture?.(t.pointerId),this._step(e,s),this._repeatDelay=180,this._holdTimer=window.setTimeout(()=>{const t=()=>{this._step(e,s),this._repeatDelay=Math.max(60,this._repeatDelay-12),this._repeatTimer=window.setTimeout(t,this._repeatDelay)};t()},450))}_onWheel(t,e){const s=this.shadowRoot?.activeElement===t.currentTarget;!this.disabled&&s&&0!==t.deltaY&&(t.preventDefault(),this._step(e,t.deltaY<0?1:-1))}_onKeyDown(t,e){"ArrowUp"===t.key?(t.preventDefault(),this._step(e,1)):"ArrowDown"===t.key&&(t.preventDefault(),this._step(e,-1))}};Wt.styles=[Rt,jt,f`
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
    `],h([xt({attribute:!1})],Wt.prototype,"hass",void 0),h([xt({type:Number})],Wt.prototype,"hours",void 0),h([xt({type:Number})],Wt.prototype,"minutes",void 0),h([xt({type:Number})],Wt.prototype,"minuteStep",void 0),h([xt({type:Boolean})],Wt.prototype,"disabled",void 0),Wt=h([yt("alarm-clocks-time-stepper")],Wt);let qt=class extends _t{constructor(){super(...arguments),this._openMoreInfo=()=>{this.dispatchEvent(new CustomEvent("setting-more-info",{detail:{entityId:this.setting.entityId},bubbles:!0,composed:!0}))}}render(){const t=Dt(this.hass),e=t(this.setting.labelKey),s=this.setting.zeroMeansOff&&0===this.setting.value?t("label.off"):`${this.setting.value} ${t("unit.minutes_short")}`;return tt`
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
    `}_step(t){const e=Math.min(this.setting.max,Math.max(this.setting.min,this.setting.value+t*this.setting.step));e!==this.setting.value&&this.dispatchEvent(new CustomEvent("setting-changed",{detail:{entityId:this.setting.entityId,value:e},bubbles:!0,composed:!0}))}};function Kt(t,e,s){t.dispatchEvent(new CustomEvent(e,{detail:s,bubbles:!0,composed:!0,cancelable:!1}))}function Vt(t,e){return t.callService("switch","toggle",{},{entity_id:e})}qt.styles=[Rt,jt,f`
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
    `],h([xt({attribute:!1})],qt.prototype,"hass",void 0),h([xt({attribute:!1})],qt.prototype,"setting",void 0),qt=h([yt("alarm-clocks-setting-row")],qt);let Ft=class extends _t{constructor(){super(...arguments),this.now=Date.now(),this.narrow=!1,this.expanded=!1,this.expandable=!0,this.showDays=!0,this.showNextAlarm=!0,this.showSettings=!0,this.showTestButton=!1,this.minuteStep=5,this._pendingSince=0,this._onTimeChanged=t=>{this._pendingTime={hours:t.detail.hours,minutes:t.detail.minutes},this._pendingSince=Date.now(),void 0!==this._timeTimer&&window.clearTimeout(this._timeTimer),this._timeTimer=window.setTimeout(()=>{this._timeTimer=void 0;const t=this.view?.entities.alarmTime,e=this._pendingTime;this.hass&&t&&e&&function(t,e,s,i){const n=`${String(s).padStart(2,"0")}:${String(i).padStart(2,"0")}:00`;t.callService("time","set_value",{time:n},{entity_id:e})}(this.hass,t,e.hours,e.minutes)},600)},this._onExpandClick=()=>{const t=this.view?.deviceId;t&&this.dispatchEvent(new CustomEvent("toggle-expand",{detail:{deviceId:t},bubbles:!0,composed:!0}))},this._openInfo=()=>{const t=this.view?.entities.status??this.view?.entities.enabled;this._openEntity(t)},this._onDayToggled=t=>{this.hass&&Vt(this.hass,t.detail.entityId)},this._onSettingChanged=t=>{var e,s,i;this.hass&&(e=this.hass,s=t.detail.entityId,i=t.detail.value,e.callService("number","set_value",{value:i},{entity_id:s}))},this._onSettingMoreInfo=t=>{this._openEntity(t.detail.entityId)}}render(){const t=this.hass,e=this.view;if(!t||!e)return st;const s=Dt(t);return this._settlePendingTime(e),tt`
      <div
        class=${Et({item:!0,[`status-${e.status}`]:!0,disabled:!e.enabled})}
      >
        <div class="row">
          <div class="icon" aria-hidden="true">
            <ha-icon icon=${d[e.status]??d.unknown}></ha-icon>
          </div>
          ${this.expanded?this._renderExpandedInfo(e,s):this._renderCollapsedInfo(e,s)}
          ${this.expanded?this._renderToggle(e,s):this._renderCollapsedRight(e,s)}
          ${this._renderExpandButton(s)}
        </div>
        ${this.expanded?this._renderBody(e,s):st}
      </div>
    `}_renderCollapsedInfo(t,e){const s=zt(this.hass);return tt`
      <button type="button" class="info" @click=${this._openInfo}>
        <span class="name">${t.name}</span>
        <span class="sub">${this._subtitle(t,e,s)}</span>
      </button>
    `}_renderCollapsedRight(t,e){const s=t.alarmTime?`${String(t.alarmTime.hours).padStart(2,"0")}:${String(t.alarmTime.minutes).padStart(2,"0")}`:e("label.no_time");return tt`
      <span class="time">${s}</span>
      ${t.canDismiss?tt`
            <div class="row-actions">
              ${t.canSnooze?tt`<button
                      type="button"
                      class="icon-btn"
                      aria-label=${e("action.snooze")}
                      title=${e("action.snooze")}
                      @click=${()=>this._snooze(t)}
                    >
                      <ha-icon icon="mdi:alarm-snooze"></ha-icon>
                    </button>`:st}
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
    `}_subtitle(t,e,s){return t.status===a||t.status===l?e(`status.${t.status}`):this.showNextAlarm&&t.nextAlarm?t.status===r?`${e("status.snoozed")} · ${e("label.until",{time:Nt(t.nextAlarm,s)})}`:It(t.nextAlarm,this.now,e):e(`status.${t.status}`)}_renderExpandedInfo(t,e){const s=e(`status.${t.status}`);return tt`
      <button type="button" class="info title" @click=${this._openInfo} title=${t.name}>
        <span class="name">${t.name}</span>
        <span class="status">
          <span class="dot" aria-hidden="true"></span>${s}
        </span>
      </button>
    `}_renderBody(t,e){return tt`
      <div class="body">
        ${this._renderHero(t,e)}
        ${this.showDays?this._renderDays(t):st}
        ${this._renderActions(t,e)}
        ${this.showSettings&&t.settings.length?this._renderSettings(t):st}
      </div>
    `}_renderHero(t,e){const s=zt(this.hass),i=Boolean(t.entities.alarmTime),n=this._pendingTime??t.alarmTime;return n?tt`
      <div class="hero">
        <alarm-clocks-time-stepper
          .hass=${this.hass}
          .hours=${n.hours}
          .minutes=${n.minutes}
          .minuteStep=${this.minuteStep}
          .disabled=${!i}
          @time-changed=${this._onTimeChanged}
        ></alarm-clocks-time-stepper>
        <div class="meta">${this._renderMeta(t,e,s)}</div>
      </div>
    `:tt`
        <div class="hero">
          <span class="no-time">${e("label.no_time")}</span>
          <div class="meta">${this._renderMeta(t,e,s)}</div>
        </div>
      `}_settlePendingTime(t){const e=this._pendingTime;if(!e)return;const s=t.alarmTime?.hours===e.hours&&t.alarmTime?.minutes===e.minutes,i=Date.now()-this._pendingSince>15e3;(s||i)&&(this._pendingTime=void 0)}_renderMeta(t,e,s){if(!this.showNextAlarm)return st;if(t.status===a){const s=t.ringingSince?e("label.ringing_since",{duration:Pt(this.now-t.ringingSince.getTime(),e)}):e("status.ringing");return tt`<span class="primary">${s}</span>`}if(t.status===l)return tt`<span class="primary">${e("label.post_pending")}</span>`;if(!t.nextAlarm)return tt`<span class="primary muted">${e("label.no_alarm")}</span>`;const i=It(t.nextAlarm,this.now,e),n=t.status===r?e("label.until",{time:Nt(t.nextAlarm,s)}):function(t,e,s,i){const n=new Date(e),o=new Date(n.getFullYear(),n.getMonth(),n.getDate()).getTime(),a=Math.floor((t.getTime()-o)/864e5),r=Nt(t,s);return 0===a?`${i("time.today")}, ${r}`:1===a?`${i("time.tomorrow")}, ${r}`:`${new Intl.DateTimeFormat(s,{weekday:"short"}).format(t)}, ${r}`}(t.nextAlarm,this.now,s,e);return tt`
      <span class="primary">${i}</span>
      <span class="secondary">${n}</span>
      ${t.isOneShot?tt`<span class="badge">${e("label.one_shot")}</span>`:st}
    `}_renderDays(t){return tt`
      <alarm-clocks-weekday-picker
        .hass=${this.hass}
        .days=${t.days}
        .compact=${this.narrow}
        @day-toggled=${this._onDayToggled}
      ></alarm-clocks-weekday-picker>
    `}_renderActions(t,e){const s=this.showTestButton&&!t.canDismiss;return t.canDismiss||s?tt`
      <div class="actions">
        ${t.canSnooze?tt`<button
              type="button"
              class="btn"
              ?disabled=${!t.entities.snoozeButton&&!t.entities.status}
              @click=${()=>this._snooze(t)}
            >
              <ha-icon icon="mdi:alarm-snooze"></ha-icon>${e("action.snooze")}
            </button>`:st}
        ${t.canDismiss?tt`<button type="button" class="btn danger" @click=${()=>this._dismiss(t)}>
              <ha-icon icon="mdi:alarm-off"></ha-icon>${e("action.dismiss")}
            </button>`:st}
        ${s?tt`<button
              type="button"
              class="btn"
              ?disabled=${!t.canTest}
              @click=${()=>this._test(t)}
            >
              <ha-icon icon="mdi:play-circle-outline"></ha-icon>${e("action.test")}
            </button>`:st}
      </div>
    `:st}_renderSettings(t){return tt`
      <div class="settings">
        ${t.settings.map(t=>tt`
            <alarm-clocks-setting-row
              .hass=${this.hass}
              .setting=${t}
              @setting-changed=${this._onSettingChanged}
              @setting-more-info=${this._onSettingMoreInfo}
            ></alarm-clocks-setting-row>
          `)}
      </div>
    `}_renderToggle(t,e){return t.entities.enabled?tt`
      <button
        type="button"
        role="switch"
        class=${Et({toggle:!0,on:t.enabled})}
        aria-checked=${t.enabled?"true":"false"}
        aria-label=${`${t.name}: ${e(t.enabled?"action.disable":"action.enable")}`}
        @click=${()=>this._toggle(t)}
      >
        <span class="knob"></span>
      </button>
    `:st}_renderExpandButton(t){return this.expandable?tt`
      <button
        type="button"
        class="icon-btn expand-btn"
        aria-expanded=${this.expanded?"true":"false"}
        aria-label=${t(this.expanded?"action.collapse":"action.expand")}
        @click=${this._onExpandClick}
      >
        <ha-icon icon=${this.expanded?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </button>
    `:st}_openEntity(t){t&&function(t,e){Kt(t,"hass-more-info",{entityId:e})}(this,t)}_toggle(t){this.hass&&t.entities.enabled&&Vt(this.hass,t.entities.enabled)}_snooze(e){var s,i;this.hass&&(s=this.hass,i=e.deviceId,s.callService(t,"snooze",{},{device_id:i}))}_dismiss(e){var s,i;this.hass&&(s=this.hass,i=e.deviceId,s.callService(t,"dismiss",{},{device_id:i}))}_test(e){var s,i;this.hass&&(s=this.hass,i=e.deviceId,s.callService(t,"trigger_alarm",{},{device_id:i}))}};Ft.styles=[Rt,jt,f`
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
    `],h([xt({attribute:!1})],Ft.prototype,"hass",void 0),h([xt({attribute:!1})],Ft.prototype,"view",void 0),h([xt({type:Number})],Ft.prototype,"now",void 0),h([xt({type:Boolean})],Ft.prototype,"narrow",void 0),h([xt({type:Boolean})],Ft.prototype,"expanded",void 0),h([xt({type:Boolean})],Ft.prototype,"expandable",void 0),h([xt({type:Boolean})],Ft.prototype,"showDays",void 0),h([xt({type:Boolean})],Ft.prototype,"showNextAlarm",void 0),h([xt({type:Boolean})],Ft.prototype,"showSettings",void 0),h([xt({type:Boolean})],Ft.prototype,"showTestButton",void 0),h([xt({type:Number})],Ft.prototype,"minuteStep",void 0),h([kt()],Ft.prototype,"_pendingTime",void 0),Ft=h([yt("alarm-clocks-item")],Ft);const Zt={"switch.enabled":"enabled","time.alarm_time":"alarmTime","number.snooze_duration":"snoozeDuration","number.pre_offset":"preOffset","number.post_offset":"postOffset","number.auto_dismiss":"autoDismiss","binary_sensor.ringing":"ringing","binary_sensor.snooze_active":"snoozeActive","sensor.next_alarm":"nextAlarm","sensor.state":"status","sensor.snooze_until":"snoozeUntil","button.snooze":"snoozeButton","button.dismiss":"dismissButton",...Object.fromEntries(i.map((t,e)=>[`switch.day_${t}`,`day${e}`]))};function Yt(t){return t.split(".",1)[0]}function Jt(e){const s=new Set;for(const i of Object.values(e.entities??{}))i.platform===t&&i.device_id&&s.add(i.device_id);return[...s]}function Gt(t,e,s){const i=t.devices?.[e],n=i?.name_by_user||i?.name;if(n)return n;const o=s.status?t.states[s.status]:void 0;return o?.attributes.friendly_name??e}function Xt(t,e){return e?t.states[e]:void 0}function Qt(t){return!!t&&!c.includes(t.state)}function te(t,e,s,i,n){const o=e[s],a=Xt(t,o),r=function(t){if(!Qt(t))return;const e=Number(t.state);return Number.isFinite(e)?e:void 0}(a);if(o&&void 0!==r)return{role:s,labelKey:i,entityId:o,value:r,min:"number"==typeof a.attributes.min?a.attributes.min:0,max:"number"==typeof a.attributes.max?a.attributes.max:999,step:"number"==typeof a.attributes.step?a.attributes.step:1,zeroMeansOff:n}}function ee(e,s){const l=function(e,s){const i={};for(const n of Object.values(e.entities??{})){if(n.device_id!==s||n.platform!==t)continue;if(!n.translation_key)continue;const e=Zt[`${Yt(n.entity_id)}.${n.translation_key}`];e&&(i[e]=n.entity_id)}return i}(e,s),{status:c,available:d}=function(t,e){const s=Xt(t,e.status);if(Qt(s))return{status:s.state,available:!0};const i=Xt(t,e.ringing),l=Xt(t,e.snoozeActive),c=Xt(t,e.enabled);return"on"===i?.state?{status:a,available:!0}:"on"===l?.state?{status:r,available:!0}:Qt(c)?{status:"on"===c.state?o:n,available:!0}:{status:"unknown",available:!1}}(e,l),h=Xt(e,l.enabled),p=h?"on"===h.state:c!==n,u=i.map((t,s)=>{const i=l[`day${s}`],n=Xt(e,i);return{index:s,entityId:i,active:"on"===n?.state,available:Qt(n)}}),m=Xt(e,l.ringing),g=c===a&&m?.last_changed?new Date(m.last_changed):void 0,b=[te(e,l,"snoozeDuration","label.snooze_duration",!0),te(e,l,"preOffset","label.pre_offset",!0),te(e,l,"postOffset","label.post_offset",!0),te(e,l,"autoDismiss","label.auto_dismiss",!0)].filter(t=>void 0!==t),f=Object.values(l).filter(t=>"string"==typeof t);return{deviceId:s,name:Gt(e,s,l),entities:l,trackedEntityIds:f,status:c,available:d,enabled:p,alarmTime:Ot(Xt(e,l.alarmTime)),nextAlarm:Mt(Xt(e,l.nextAlarm)),snoozeUntil:Mt(Xt(e,l.snoozeUntil)),ringingSince:g&&!Number.isNaN(g.getTime())?g:void 0,days:u,isOneShot:u.every(t=>!t.active),settings:b,canSnooze:(c===a||c===r)&&(b.find(t=>"snoozeDuration"===t.role)?.value??0)>0,canDismiss:c===a||c===r,canTest:p&&c!==a,incomplete:0===f.length}}const se={hide_disabled:!1,show_days:!0,show_next_alarm:!0,show_settings:!0,show_test_button:!1,expandable:!0,expanded:!1};let ie=class extends _t{constructor(){super(...arguments),this._now=Date.now(),this._narrow=!1,this._expandedSeeded=!1,this._views=[],this._onToggleExpand=t=>{const e=t.detail.deviceId;this._expandedDeviceId=this._expandedDeviceId===e?void 0:e}}static async getConfigElement(){return await Promise.resolve().then(function(){return ae}),document.createElement(s)}static getStubConfig(t){const s=Jt(t);return 1===s.length?{type:`custom:${e}`,devices:s,expanded:!0}:{type:`custom:${e}`}}setConfig(t){if(!t)throw new Error("Invalid configuration");if(void 0!==t.devices&&!Array.isArray(t.devices))throw new Error("`devices` must be a list of device ids");this._config={...se,...t},this._views=[],this._expandedSeeded=!1,this._expandedDeviceId=void 0}set hass(t){const e=this._hass;this._hass=t,this._shouldRefresh(e,t)&&this.requestUpdate()}get hass(){return this._hass}_shouldRefresh(t,e){return!t||!this._views.length||(t.entities!==e.entities||t.devices!==e.devices||(t.locale!==e.locale||t.themes!==e.themes||this._views.some(s=>s.trackedEntityIds.some(s=>t.states[s]!==e.states[s]))))}connectedCallback(){super.connectedCallback(),this._tickTimer=window.setInterval(()=>{this._now=Date.now()},3e4),"undefined"!=typeof ResizeObserver&&(this._resizeObserver=new ResizeObserver(t=>{const e=t[0]?.contentRect.width??0,s=e>0&&e<320;s!==this._narrow&&(this._narrow=s)}),this._resizeObserver.observe(this))}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._tickTimer&&(window.clearInterval(this._tickTimer),this._tickTimer=void 0),this._resizeObserver?.disconnect(),this._resizeObserver=void 0}getCardSize(){const t=this._views.length||1,e=!1===this._config?.expandable?this._config.expanded?t:0:this._expandedDeviceId?1:0;return t-e+1+5*e}getGridOptions(){return{columns:12,rows:"auto",min_columns:6,min_rows:2}}render(){const t=this._hass,e=this._config;if(!t||!e)return st;const s=Dt(t),i=e.devices?.length?e.devices:Jt(t);this._views=i.filter(e=>t.devices?.[e]).map(e=>ee(t,e)).filter(t=>!t.incomplete).sort((e,s)=>e.name.localeCompare(s.name,zt(t)));const n=e.hide_disabled?this._views.filter(t=>t.enabled):this._views;return n.length?(this._expandedSeeded||(this._expandedSeeded=!0,!1!==e.expandable&&e.expanded&&(this._expandedDeviceId=n[0].deviceId)),tt`
      <ha-card .header=${e.title}>
        <div class="list">${n.map(t=>this._renderItem(t))}</div>
      </ha-card>
    `):tt`
        <ha-card .header=${e.title}>
          <div class="error">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            <span>${s("error.no_alarms")}</span>
          </div>
        </ha-card>
      `}_renderItem(t){const e=this._config,s=!1!==e.expandable,i=s?t.deviceId===this._expandedDeviceId:!0===e.expanded;return tt`
      <alarm-clocks-item
        .hass=${this._hass}
        .view=${t}
        .now=${this._now}
        .narrow=${this._narrow}
        .expanded=${i}
        .expandable=${s}
        .showDays=${!1!==e.show_days}
        .showNextAlarm=${!1!==e.show_next_alarm}
        .showSettings=${!1!==e.show_settings}
        .showTestButton=${!0===e.show_test_button}
        .minuteStep=${e.minute_step??5}
        @toggle-expand=${this._onToggleExpand}
      ></alarm-clocks-item>
    `}};ie.styles=[Rt,jt,Bt,f`
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
    `],h([kt()],ie.prototype,"_config",void 0),h([kt()],ie.prototype,"_now",void 0),h([kt()],ie.prototype,"_narrow",void 0),h([kt()],ie.prototype,"_expandedDeviceId",void 0),ie=h([yt(e)],ie),window.customCards=window.customCards??[],window.customCards.push({type:e,name:"Alarm Clock Card",description:"One or several alarm clocks: alarm time, weekdays, snooze and dismiss, each row optionally collapsible.",preview:!0,documentationURL:"https://github.com/julezdean/ha-alarm-clocks"}),console.info("%c ALARM-CLOCKS-CARD %c 1.0.0 ","color: #1c1c1c; background: #ffa600; font-weight: 700;","color: #b36f00; background: white; font-weight: 700;");const ne=[{name:"devices",selector:{device:{filter:{integration:t},multiple:!0}}},{name:"title",selector:{text:{}}},{name:"minute_step",selector:{number:{min:1,max:30,step:1,mode:"box",unit_of_measurement:"min"}}},{name:"",type:"grid",schema:[{name:"expandable",selector:{boolean:{}}},{name:"expanded",selector:{boolean:{}}},{name:"hide_disabled",selector:{boolean:{}}},{name:"show_days",selector:{boolean:{}}},{name:"show_next_alarm",selector:{boolean:{}}},{name:"show_settings",selector:{boolean:{}}},{name:"show_test_button",selector:{boolean:{}}}]}];let oe=class extends _t{constructor(){super(...arguments),this._computeLabel=t=>Dt(this.hass)(`editor.${t.name}`),this._valueChanged=t=>{t.stopPropagation(),Kt(this,"config-changed",{config:t.detail.value})}}setConfig(t){this._config=t}render(){return this.hass&&this._config?tt`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${ne}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:st}};oe.styles=f`
    ha-form {
      display: block;
    }
  `,h([kt()],oe.prototype,"hass",void 0),h([kt()],oe.prototype,"_config",void 0),oe=h([yt(s)],oe);var ae=Object.freeze({__proto__:null,get MacaAlarmCardEditor(){return oe}});
