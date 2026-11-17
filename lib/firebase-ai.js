var ot=()=>{};var ct=function(t){let e=[],n=0;for(let s=0;s<t.length;s++){let i=t.charCodeAt(s);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++s)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},fn=function(t){let e=[],n=0,s=0;for(;n<t.length;){let i=t[n++];if(i<128)e[s++]=String.fromCharCode(i);else if(i>191&&i<224){let r=t[n++];e[s++]=String.fromCharCode((i&31)<<6|r&63)}else if(i>239&&i<365){let r=t[n++],o=t[n++],a=t[n++],c=((i&7)<<18|(r&63)<<12|(o&63)<<6|a&63)-65536;e[s++]=String.fromCharCode(55296+(c>>10)),e[s++]=String.fromCharCode(56320+(c&1023))}else{let r=t[n++],o=t[n++];e[s++]=String.fromCharCode((i&15)<<12|(r&63)<<6|o&63)}}return e.join("")},q={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();let n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let i=0;i<t.length;i+=3){let r=t[i],o=i+1<t.length,a=o?t[i+1]:0,c=i+2<t.length,l=c?t[i+2]:0,f=r>>2,h=(r&3)<<4|a>>4,m=(a&15)<<2|l>>6,Y=l&63;c||(Y=64,o||(m=64)),s.push(n[f],n[h],n[m],n[Y])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(ct(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):fn(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();let n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<t.length;){let r=n[t.charAt(i++)],a=i<t.length?n[t.charAt(i)]:0;++i;let l=i<t.length?n[t.charAt(i)]:64;++i;let h=i<t.length?n[t.charAt(i)]:64;if(++i,r==null||a==null||l==null||h==null)throw new pe;let m=r<<2|a>>4;if(s.push(m),l!==64){let Y=a<<4&240|l>>2;if(s.push(Y),h!==64){let dn=l<<6&192|h;s.push(dn)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}},pe=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},hn=function(t){let e=ct(t);return q.encodeByteArray(e,!0)},ge=function(t){return hn(t).replace(/\./g,"")},lt=function(t){try{return q.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};function k(t){return ut(void 0,t)}function ut(t,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:let n=e;return new Date(n.getTime());case Object:t===void 0&&(t={});break;case Array:t=[];break;default:return e}for(let n in e)!e.hasOwnProperty(n)||!pn(n)||(t[n]=ut(t[n],e[n]));return t}function pn(t){return t!=="__proto__"}function V(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}var gn=()=>V().__FIREBASE_DEFAULTS__,mn=()=>{if(typeof process>"u"||typeof process.env>"u")return;let t=process.env.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},En=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let e=t&&lt(t[1]);return e&&JSON.parse(e)},_n=()=>{try{return ot()||gn()||mn()||En()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}};var me=()=>_n()?.config;var w=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,s))}}};function W(){try{return typeof indexedDB=="object"}catch{return!1}}function dt(){return new Promise((t,e)=>{try{let n=!0,s="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(s);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(s),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{e(i.error?.message||"")}}catch(n){e(n)}})}var bn="FirebaseError",R=class t extends Error{constructor(e,n,s){super(n),this.code=e,this.customData=s,this.name=bn,Object.setPrototypeOf(this,t.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,x.prototype.create)}},x=class{constructor(e,n,s){this.service=e,this.serviceName=n,this.errors=s}create(e,...n){let s=n[0]||{},i=`${this.service}/${e}`,r=this.errors[e],o=r?yn(r,s):"Error",a=`${this.serviceName}: ${o} (${i}).`;return new R(i,a,s)}};function yn(t,e){try{let n=0,s="";for(;n<t.length;){let i=t.indexOf("{$",n);if(i===-1){s+=t.substring(n);break}let r=t.indexOf("}",i+2);if(r===-1){s+=t.substring(n);break}let o=t.substring(i+2,r),a=e[o];s+=t.substring(n,i)+(a!=null?String(a):`<${o}?>`),n=r+1}return s}catch{return t}}function J(t,e){if(t===e)return!0;let n=Object.keys(t),s=Object.keys(e);for(let i of n){if(!s.includes(i))return!1;let r=t[i],o=e[i];if(at(r)&&at(o)){if(!J(r,o))return!1}else if(r!==o)return!1}for(let i of s)if(!n.includes(i))return!1;return!0}function at(t){return t!==null&&typeof t=="object"}var wn=1e3,Sn=2,An=14400*1e3,Tn=.5;function ft(t,e=wn,n=Sn){let s=e*Math.pow(n,t),i=Math.round(Tn*s*(Math.random()-.5)*2);return Math.min(An,s+i)}function X(t){return t&&t._delegate?t._delegate:t}var y=class{constructor(e,n,s){this.name=e,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};var U="[DEFAULT]";var Ee=class{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){let s=new w;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{let i=this.getOrInitializeService({instanceIdentifier:n});i&&s.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){let n=this.normalizeInstanceIdentifier(e?.identifier),s=e?.optional??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Rn(e))try{this.getOrInitializeService({instanceIdentifier:U})}catch{}for(let[n,s]of this.instancesDeferred.entries()){let i=this.normalizeInstanceIdentifier(n);try{let r=this.getOrInitializeService({instanceIdentifier:i});s.resolve(r)}catch{}}}}clearInstance(e=U){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=U){return this.instances.has(e)}getOptions(e=U){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:n={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let i=this.getOrInitializeService({instanceIdentifier:s,options:n});for(let[r,o]of this.instancesDeferred.entries()){let a=this.normalizeInstanceIdentifier(r);s===a&&o.resolve(i)}return i}onInit(e,n){let s=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(s)??new Set;i.add(e),this.onInitCallbacks.set(s,i);let r=this.instances.get(s);return r&&e(r,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){let s=this.onInitCallbacks.get(n);if(s)for(let i of s)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:Cn(e),options:n}),this.instances.set(e,s),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=U){return this.component?this.component.multipleInstances?e:U:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function Cn(t){return t===U?void 0:t}function Rn(t){return t.instantiationMode==="EAGER"}var Q=class{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let n=new Ee(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}};var On=[],p;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(p||(p={}));var In={debug:p.DEBUG,verbose:p.VERBOSE,info:p.INFO,warn:p.WARN,error:p.ERROR,silent:p.SILENT},Dn=p.INFO,vn={[p.DEBUG]:"log",[p.VERBOSE]:"log",[p.INFO]:"info",[p.WARN]:"warn",[p.ERROR]:"error"},kn=(t,e,...n)=>{if(e<t.logLevel)return;let s=new Date().toISOString(),i=vn[e];if(i)console[i](`[${s}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)},N=class{constructor(e){this.name=e,this._logLevel=Dn,this._logHandler=kn,this._userLogHandler=null,On.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in p))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?In[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,p.DEBUG,...e),this._logHandler(this,p.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,p.VERBOSE,...e),this._logHandler(this,p.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,p.INFO,...e),this._logHandler(this,p.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,p.WARN,...e),this._logHandler(this,p.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,p.ERROR,...e),this._logHandler(this,p.ERROR,...e)}};var Nn=(t,e)=>e.some(n=>t instanceof n),ht,pt;function Ln(){return ht||(ht=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Pn(){return pt||(pt=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var gt=new WeakMap,be=new WeakMap,mt=new WeakMap,_e=new WeakMap,we=new WeakMap;function Mn(t){let e=new Promise((n,s)=>{let i=()=>{t.removeEventListener("success",r),t.removeEventListener("error",o)},r=()=>{n(A(t.result)),i()},o=()=>{s(t.error),i()};t.addEventListener("success",r),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&gt.set(n,t)}).catch(()=>{}),we.set(e,t),e}function xn(t){if(be.has(t))return;let e=new Promise((n,s)=>{let i=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",o),t.removeEventListener("abort",o)},r=()=>{n(),i()},o=()=>{s(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",r),t.addEventListener("error",o),t.addEventListener("abort",o)});be.set(t,e)}var ye={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return be.get(t);if(e==="objectStoreNames")return t.objectStoreNames||mt.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return A(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Et(t){ye=t(ye)}function Un(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){let s=t.call(Z(this),e,...n);return mt.set(s,e.sort?e.sort():[e]),A(s)}:Pn().includes(t)?function(...e){return t.apply(Z(this),e),A(gt.get(this))}:function(...e){return A(t.apply(Z(this),e))}}function Fn(t){return typeof t=="function"?Un(t):(t instanceof IDBTransaction&&xn(t),Nn(t,Ln())?new Proxy(t,ye):t)}function A(t){if(t instanceof IDBRequest)return Mn(t);if(_e.has(t))return _e.get(t);let e=Fn(t);return e!==t&&(_e.set(t,e),we.set(e,t)),e}var Z=t=>we.get(t);function bt(t,e,{blocked:n,upgrade:s,blocking:i,terminated:r}={}){let o=indexedDB.open(t,e),a=A(o);return s&&o.addEventListener("upgradeneeded",c=>{s(A(o.result),c.oldVersion,c.newVersion,A(o.transaction),c)}),n&&o.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),a.then(c=>{r&&c.addEventListener("close",()=>r()),i&&c.addEventListener("versionchange",l=>i(l.oldVersion,l.newVersion,l))}).catch(()=>{}),a}var $n=["get","getKey","getAll","getAllKeys","count"],Bn=["put","add","delete","clear"],Se=new Map;function _t(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Se.get(e))return Se.get(e);let n=e.replace(/FromIndex$/,""),s=e!==n,i=Bn.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(i||$n.includes(n)))return;let r=async function(o,...a){let c=this.transaction(o,i?"readwrite":"readonly"),l=c.store;return s&&(l=l.index(a.shift())),(await Promise.all([l[n](...a),i&&c.done]))[0]};return Se.set(e,r),r}Et(t=>({...t,get:(e,n,s)=>_t(e,n)||t.get(e,n,s),has:(e,n)=>!!_t(e,n)||t.has(e,n)}));var Te=class{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Hn(n)){let s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}};function Hn(t){return t.getComponent()?.type==="VERSION"}var Ce="@firebase/app",yt="0.16.6";var I=new N("@firebase/app"),Gn="@firebase/app-compat",Vn="@firebase/analytics-compat",Wn="@firebase/analytics",jn="@firebase/app-check-compat",zn="@firebase/app-check",Kn="@firebase/auth",Yn="@firebase/auth-compat",qn="@firebase/crashlytics",Jn="@firebase/database",Xn="@firebase/data-connect",Qn="@firebase/database-compat",Zn="@firebase/functions",es="@firebase/functions-compat",ts="@firebase/installations",ns="@firebase/installations-compat",ss="@firebase/messaging",is="@firebase/messaging-compat",rs="@firebase/performance",os="@firebase/performance-compat",as="@firebase/remote-config",cs="@firebase/remote-config-compat",ls="@firebase/storage",us="@firebase/storage-compat",ds="@firebase/firestore",fs="@firebase/ai",hs="@firebase/firestore-compat",ps="firebase";var Re="[DEFAULT]",gs={[Ce]:"fire-core",[Gn]:"fire-core-compat",[Wn]:"fire-analytics",[Vn]:"fire-analytics-compat",[zn]:"fire-app-check",[jn]:"fire-app-check-compat",[Kn]:"fire-auth",[Yn]:"fire-auth-compat",[qn]:"fire-cls",[Jn]:"fire-rtdb",[Xn]:"fire-data-connect",[Qn]:"fire-rtdb-compat",[Zn]:"fire-fn",[es]:"fire-fn-compat",[ts]:"fire-iid",[ns]:"fire-iid-compat",[ss]:"fire-fcm",[is]:"fire-fcm-compat",[rs]:"fire-perf",[os]:"fire-perf-compat",[as]:"fire-rc",[cs]:"fire-rc-compat",[ls]:"fire-gcs",[us]:"fire-gcs-compat",[ds]:"fire-fst",[hs]:"fire-fst-compat",[fs]:"fire-vertex","fire-js":"fire-js",[ps]:"fire-js-all"};var ee=new Map,ms=new Map,Oe=new Map;function wt(t,e){try{t.container.addComponent(e)}catch(n){I.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function L(t){let e=t.name;if(Oe.has(e))return I.debug(`There were multiple attempts to register component ${e}.`),!1;Oe.set(e,t);for(let n of ee.values())wt(n,t);for(let n of ms.values())wt(n,t);return!0}function $(t,e){let n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Ct(t){return t==null?!1:t.settings!==void 0}var Es={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},O=new x("app","Firebase",Es);var Ie=class{constructor(e,n,s){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new y("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw O.create("app-deleted",{appName:this._name})}};function Rt(t,e={}){let n=t;typeof e!="object"&&(e={name:e});let s={name:Re,automaticDataCollectionEnabled:!0,...e},i=s.name;if(typeof i!="string"||!i)throw O.create("bad-app-name",{appName:String(i)});if(n||(n=me()),!n)throw O.create("no-options");let r=ee.get(i);if(r)if(J(n,r.options)){if(J(s,r.config))return r;throw O.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(r.config),newValue:JSON.stringify(s)})}else throw O.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(r.options),newValue:JSON.stringify(n)});let o=new Q(i);for(let c of Oe.values())o.addComponent(c);let a=new Ie(n,s,o);return ee.set(i,a),a}function te(t=Re){let e=ee.get(t);if(!e&&t===Re&&me())return Rt();if(!e)throw O.create("no-app",{appName:t});return e}function T(t,e,n){let s=gs[t]??t;n&&(s+=`-${n}`);let i=s.match(/\s|\//),r=e.match(/\s|\//);if(i||r){let o=[`Unable to register library "${s}" with version "${e}":`];i&&o.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&r&&o.push("and"),r&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),I.warn(o.join(" "));return}L(new y(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}var _s="firebase-heartbeat-database",bs=1,j="firebase-heartbeat-store",Ae=null;function Ot(){return Ae||(Ae=bt(_s,bs,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(j)}catch(n){console.warn(n)}}}}).catch(t=>{throw O.create("idb-open",{originalErrorMessage:t.message})})),Ae}async function ys(t){try{let n=(await Ot()).transaction(j),s=await n.objectStore(j).get(It(t));return await n.done,s}catch(e){if(e instanceof R)I.warn(e.message);else{let n=O.create("idb-get",{originalErrorMessage:e?.message});I.warn(n.message)}}}async function St(t,e){try{let s=(await Ot()).transaction(j,"readwrite");await s.objectStore(j).put(e,It(t)),await s.done}catch(n){if(n instanceof R)I.warn(n.message);else{let s=O.create("idb-set",{originalErrorMessage:n?.message});I.warn(s.message)}}}function It(t){return`${t.name}!${t.options.appId}`}var ws=1024,Ss=30,De=class{constructor(e){this.container=e,this._heartbeatsCache=null;let n=this.container.getProvider("app").getImmediate();this._storage=new ve(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){try{let n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=At();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(i=>i.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:n}),this._heartbeatsCache.heartbeats.length>Ss){let i=Ts(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(i,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){I.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";let e=At(),{heartbeatsToSend:n,unsentEntries:s}=As(this._heartbeatsCache.heartbeats),i=ge(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=e,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(e){return I.warn(e),""}}};function At(){return new Date().toISOString().substring(0,10)}function As(t,e=ws){let n=[],s=t.slice();for(let i of t){let r=n.find(o=>o.agent===i.agent);if(r){if(r.dates.push(i.date),Tt(n)>e){r.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Tt(n)>e){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}var ve=class{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return W()?dt().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let n=await ys(this.app);return n?.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){let s=await this.read();return St(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){let s=await this.read();return St(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}};function Tt(t){return ge(JSON.stringify({version:2,heartbeats:t})).length}function Ts(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let s=1;s<t.length;s++)t[s].date<n&&(n=t[s].date,e=s);return e}function Cs(t){L(new y("platform-logger",e=>new Te(e),"PRIVATE")),L(new y("heartbeat",e=>new De(e),"PRIVATE")),T(Ce,yt,t),T(Ce,yt,"esm2020"),T("fire-js","")}Cs("");var Rs="firebase",Os="13.3.0";T(Rs,Os,"app");var Dt="@firebase/ai",Me="3.1.0";var B="AI",Is="global",Ds="firebasevertexai.googleapis.com",se="v1beta",vt=Me,vs="gl-js",ks="hybrid",Ns=180*1e3,Ls="gemini-3.5-flash-lite";var d=class t extends R{constructor(e,n,s){let i=B,r=`${i}/${e}`,o=`${i}: ${n} (${r})`;super(e,o),this.code=e,this.customErrorData=s,Error.captureStackTrace&&Error.captureStackTrace(this,t),Object.setPrototypeOf(this,t.prototype),this.toString=()=>o}};var kt=["user","model","function","system"];var Ut={HARM_SEVERITY_NEGLIGIBLE:"HARM_SEVERITY_NEGLIGIBLE",HARM_SEVERITY_LOW:"HARM_SEVERITY_LOW",HARM_SEVERITY_MEDIUM:"HARM_SEVERITY_MEDIUM",HARM_SEVERITY_HIGH:"HARM_SEVERITY_HIGH",HARM_SEVERITY_UNSUPPORTED:"HARM_SEVERITY_UNSUPPORTED"};var b={STOP:"STOP",MAX_TOKENS:"MAX_TOKENS",SAFETY:"SAFETY",RECITATION:"RECITATION",OTHER:"OTHER",BLOCKLIST:"BLOCKLIST",PROHIBITED_CONTENT:"PROHIBITED_CONTENT",SPII:"SPII",MALFORMED_FUNCTION_CALL:"MALFORMED_FUNCTION_CALL",IMAGE_SAFETY:"IMAGE_SAFETY",IMAGE_PROHIBITED_CONTENT:"IMAGE_PROHIBITED_CONTENT",IMAGE_OTHER:"IMAGE_OTHER",NO_IMAGE:"NO_IMAGE",IMAGE_RECITATION:"IMAGE_RECITATION",LANGUAGE:"LANGUAGE",UNEXPECTED_TOOL_CALL:"UNEXPECTED_TOOL_CALL",TOO_MANY_TOOL_CALLS:"TOO_MANY_TOOL_CALLS",MISSING_THOUGHT_SIGNATURE:"MISSING_THOUGHT_SIGNATURE",MALFORMED_RESPONSE:"MALFORMED_RESPONSE"};var Ps={TEXT:"TEXT",IMAGE:"IMAGE",AUDIO:"AUDIO"},S={PREFER_ON_DEVICE:"prefer_on_device",ONLY_ON_DEVICE:"only_on_device",ONLY_IN_CLOUD:"only_in_cloud",PREFER_IN_CLOUD:"prefer_in_cloud"},P={ON_DEVICE:"on_device",IN_CLOUD:"in_cloud"};var u={ERROR:"error",REQUEST_ERROR:"request-error",RESPONSE_ERROR:"response-error",FETCH_ERROR:"fetch-error",SESSION_CLOSED:"session-closed",INVALID_CONTENT:"invalid-content",API_NOT_ENABLED:"api-not-enabled",ALREADY_INITIALIZED:"already-initialized",INVALID_SCHEMA:"invalid-schema",NO_API_KEY:"no-api-key",NO_APP_ID:"no-app-id",NO_MODEL:"no-model",NO_PROJECT_ID:"no-project-id",PARSE_FAILED:"parse-failed",UNSUPPORTED:"unsupported"};var v={AGENT_PLATFORM:"AGENT_PLATFORM",GOOGLE_AI:"GOOGLE_AI"};var ie=class{constructor(e){this.backendType=e}},H=class extends ie{constructor(){super(v.GOOGLE_AI)}_getModelPath(e,n){return`/${se}/projects/${e}/${n}`}_getTemplatePath(e,n){return`/${se}/projects/${e}/templates/${n}`}},re=class extends ie{constructor(e){super(v.AGENT_PLATFORM),this.location=Is,e&&(this.location=e)}_getModelPath(e,n){return`/${se}/projects/${e}/locations/${this.location}/${n}`}_getTemplatePath(e,n){return`/${se}/projects/${e}/locations/${this.location}/templates/${n}`}};function Ms(t){if(t instanceof H)return`${B}/googleai`;if(t instanceof re)return`${B}/agentplatform/${t.location}`;throw new d(u.ERROR,`Invalid backend: ${JSON.stringify(t.backendType)}`)}function xs(t){let e=t.split("/");if(e[0]!==B)throw new d(u.ERROR,`Invalid instance identifier, unknown prefix '${e[0]}'`);switch(e[1]){case"agentplatform":let s=e[2];if(!s)throw new d(u.ERROR,`Invalid instance identifier, unknown location '${t}'`);return new re(s);case"googleai":return new H;default:throw new d(u.ERROR,`Invalid instance identifier string: '${t}'`)}}var E=new N("@firebase/ai"),D;(function(t){t.UNAVAILABLE="unavailable",t.DOWNLOADABLE="downloadable",t.DOWNLOADING="downloading",t.AVAILABLE="available"})(D||(D={}));var Ft={type:"text",languages:["en"]},ke=[Ft,{type:"image"}],Ne=[Ft],oe=class t{constructor(e,n,s){this.languageModelProvider=e,this.mode=n,this.downloadPromise=null,this.onDeviceParams={createOptions:{expectedInputs:ke,expectedOutputs:Ne}},s&&(this.onDeviceParams=s,this.onDeviceParams.createOptions?(this.onDeviceParams.createOptions.expectedInputs||(this.onDeviceParams.createOptions.expectedInputs=ke),this.onDeviceParams.createOptions.expectedOutputs||(this.onDeviceParams.createOptions.expectedOutputs=Ne)):this.onDeviceParams.createOptions={expectedInputs:ke,expectedOutputs:Ne})}async isAvailable(e){if(!this.mode)return E.debug("On-device inference unavailable because mode is undefined."),!1;if(this.mode===S.ONLY_IN_CLOUD)return E.debug('On-device inference unavailable because mode is "only_in_cloud".'),!1;let n=await this.languageModelProvider?.availability(this.onDeviceParams.createOptions);if(this.mode===S.ONLY_ON_DEVICE){if(n===D.UNAVAILABLE)throw new d(u.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(n===D.DOWNLOADABLE||n===D.DOWNLOADING){E.debug("Waiting for download of LanguageModel to complete.");try{await this.downloadPromise}catch(s){throw new d(u.ERROR,s.message)}return!0}return!0}return n!==D.AVAILABLE?(E.debug(`On-device inference unavailable because availability is "${n}".`),!1):t.isOnDeviceRequest(e)?!0:(E.debug("On-device inference unavailable because request is incompatible."),!1)}async generateContent(e){let n=await this.createSession(),s=await Promise.all(e.contents.map(t.toLanguageModelMessage)),i=await n.prompt(s,this.onDeviceParams.promptOptions);return t.toResponse(i)}async generateContentStream(e){let n=await this.createSession(),s=await Promise.all(e.contents.map(t.toLanguageModelMessage)),i=n.promptStreaming(s,this.onDeviceParams.promptOptions);return t.toStreamResponse(i)}async countTokens(e){throw new d(u.REQUEST_ERROR,"Count Tokens is not yet available for on-device model.")}static isOnDeviceRequest(e){if(e.contents.length===0)return E.debug("Empty prompt rejected for on-device inference."),!1;for(let n of e.contents){if(n.parts.some(s=>"functionResponse"in s))return E.debug("Content with a function response part rejected for on-device inference."),!1;for(let s of n.parts)if("inlineData"in s&&s.inlineData&&t.SUPPORTED_MIME_TYPES.indexOf(s.inlineData.mimeType)===-1)return E.debug(`Unsupported mime type "${s.inlineData.mimeType}" rejected for on-device inference.`),!1}return!0}async downloadIfAvailable(e){let n=await this.languageModelProvider?.availability(this.onDeviceParams.createOptions);return(n===D.DOWNLOADABLE||n===D.DOWNLOADING)&&this.download(e),n}download(e){if(this.downloadPromise)return;let n={...this.onDeviceParams.createOptions};n&&!n.monitor&&e&&(n.monitor=s=>{s.addEventListener("downloadprogress",i=>{e(i.loaded)})}),this.downloadPromise=this.languageModelProvider?.create(n).finally(()=>{this.downloadPromise=null})}static async toLanguageModelMessage(e){let n=await Promise.all(e.parts.map(t.toLanguageModelMessageContent));return{role:t.toLanguageModelMessageRole(e.role),content:n}}static async toLanguageModelMessageContent(e){if("text"in e&&typeof e.text=="string")return{type:"text",value:e.text};if("inlineData"in e&&e.inlineData){let s=await(await fetch(`data:${e.inlineData.mimeType};base64,${e.inlineData.data}`)).blob();return{type:"image",value:await createImageBitmap(s)}}throw new d(u.REQUEST_ERROR,"Processing of this Part type is not currently supported.")}static toLanguageModelMessageRole(e){return e==="model"?"assistant":"user"}async createSession(){if(!this.languageModelProvider)throw new d(u.UNSUPPORTED,"Chrome AI requested for unsupported browser version.");let e=await this.languageModelProvider.create(this.onDeviceParams.createOptions);return this.oldSession&&this.oldSession.destroy(),this.oldSession=e,e}static toResponse(e){return{json:async()=>({candidates:[{content:{parts:[{text:e}]}}]})}}static toStreamResponse(e){let n=new TextEncoder;return{body:e.pipeThrough(new TransformStream({transform(s,i){let r=JSON.stringify({candidates:[{content:{role:"model",parts:[{text:s}]}}]});i.enqueue(n.encode(`data: ${r}

`))}}))}}};oe.SUPPORTED_MIME_TYPES=["image/jpeg","image/png"];function Us(t,e,n){let i=(e||V()).LanguageModel;if(i&&t)return new oe(i,t,n)}var xe=class{constructor(e,n,s,i,r){this.app=e,this.backend=n,this.chromeAdapterFactory=r;let o=i?.getImmediate({optional:!0}),a=s?.getImmediate({optional:!0});this.auth=a||null,this.appCheck=o||null}_delete(){return Promise.resolve()}set options(e){this._options=e}get options(){return this._options}};function Fs(t,{instanceIdentifier:e}){if(!e)throw new d(u.ERROR,"AIService instance identifier is undefined.");let n=xs(e),s=t.getProvider("app").getImmediate(),i=t.getProvider("auth-internal"),r=t.getProvider("app-check-internal");return new xe(s,n,i,r,Us)}function $s(t){if(t.app?.options?.apiKey)if(t.app?.options?.projectId){if(!t.app?.options?.appId)throw new d(u.NO_APP_ID,'The "appId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid app ID.')}else throw new d(u.NO_PROJECT_ID,'The "projectId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid project ID.');else throw new d(u.NO_API_KEY,'The "apiKey" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid API key.');let e={apiKey:t.app.options.apiKey,project:t.app.options.projectId,appId:t.app.options.appId,automaticDataCollectionEnabled:t.app.automaticDataCollectionEnabled,backend:t.backend};if(Ct(t.app)&&t.app.settings.appCheckToken){let n=t.app.settings.appCheckToken;e.getAppCheckToken=()=>Promise.resolve({token:n})}else t.appCheck&&(t.options?.useLimitedUseAppCheckTokens?e.getAppCheckToken=()=>t.appCheck.getLimitedUseToken():e.getAppCheckToken=()=>t.appCheck.getToken());return t.auth&&(e.getAuthToken=()=>t.auth.getToken()),e}var Ue=class t{constructor(e,n){this._apiSettings=$s(e),this.model=t.normalizeModelName(n,this._apiSettings.backend.backendType)}static normalizeModelName(e,n){return n===v.GOOGLE_AI?t.normalizeGoogleAIModelName(e):t.normalizeVertexAIModelName(e)}static normalizeGoogleAIModelName(e){return`models/${e}`}static normalizeVertexAIModelName(e){let n;return e.includes("/")?e.startsWith("models/")?n=`publishers/google/${e}`:n=e:n=`publishers/google/models/${e}`,n}};var Bs="Timeout has expired.",Le="AbortError",Fe=class{constructor(e){this.params=e}toString(){let e=new URL(this.baseUrl);return e.pathname=this.pathname,e.search=this.queryParams.toString(),e.toString()}get pathname(){return this.params.templateId?`${this.params.apiSettings.backend._getTemplatePath(this.params.apiSettings.project,this.params.templateId)}:${this.params.task}`:`${this.params.apiSettings.backend._getModelPath(this.params.apiSettings.project,this.params.model)}:${this.params.task}`}get baseUrl(){return this.params.singleRequestOptions?.baseUrl??`https://${Ds}`}get queryParams(){let e=new URLSearchParams;return this.params.stream&&e.set("alt","sse"),e}};function Hs(t){let e=[];return e.push(`${vs}/${vt}`),e.push(`fire/${vt}`),(t.params.apiSettings.inferenceMode===S.PREFER_ON_DEVICE||t.params.apiSettings.inferenceMode===S.PREFER_IN_CLOUD)&&e.push(ks),e.join(" ")}async function Gs(t){let e=new Headers;if(e.append("Content-Type","application/json"),e.append("x-goog-api-client",Hs(t)),e.append("x-goog-api-key",t.params.apiSettings.apiKey),t.params.apiSettings.automaticDataCollectionEnabled&&e.append("X-Firebase-Appid",t.params.apiSettings.appId),t.params.apiSettings.getAppCheckToken){let n=await t.params.apiSettings.getAppCheckToken();n&&(e.append("X-Firebase-AppCheck",n.token),n.error&&E.warn(`Unable to obtain a valid App Check token: ${n.error.message}`))}if(t.params.apiSettings.getAuthToken){let n=await t.params.apiSettings.getAuthToken();n&&e.append("Authorization",`Firebase ${n.accessToken}`)}return e}async function Ge(t,e){let n=new Fe(t),s,i=t.singleRequestOptions?.signal,r=t.singleRequestOptions?.timeout!=null&&t.singleRequestOptions.timeout>=0?t.singleRequestOptions.timeout:Ns,o=new AbortController,a=setTimeout(()=>{o.abort(new DOMException(Bs,Le)),E.debug(`Aborting request to ${n} due to timeout (${r}ms)`)},r),c=AbortSignal.any(i?[i,o.signal]:[o.signal]);if(i&&i.aborted)throw clearTimeout(a),new DOMException(i.reason??"Aborted externally before fetch",Le);try{let l={method:"POST",headers:await Gs(n),signal:c,body:e};if(s=await fetch(n.toString(),l),!s.ok){let f="",h;try{let m=await s.json();f=m.error.message,m.error.details&&(f+=` ${JSON.stringify(m.error.details)}`,h=m.error.details)}catch{}throw s.status===403&&h&&h.some(m=>m.reason==="SERVICE_DISABLED")&&h.some(m=>m.links?.[0]?.description.includes("Google developers console API activation"))?new d(u.API_NOT_ENABLED,`The Firebase AI SDK requires the Firebase AI API ('firebasevertexai.googleapis.com') to be enabled in your Firebase project. Enable this API by visiting the Firebase Console at https://console.firebase.google.com/project/${n.params.apiSettings.project}/ailogic/ and clicking "Get started". If you enabled this API recently, wait a few minutes for the action to propagate to our systems and then retry.`,{status:s.status,statusText:s.statusText,errorDetails:h}):new d(u.FETCH_ERROR,`Error fetching from ${n}: [${s.status} ${s.statusText}] ${f}`,{status:s.status,statusText:s.statusText,errorDetails:h})}}catch(l){let f=l;throw l.code!==u.FETCH_ERROR&&l.code!==u.API_NOT_ENABLED&&l instanceof Error&&l.name!==Le&&(f=new d(u.ERROR,`Error fetching from ${n.toString()}: ${l.message}`),f.stack=l.stack),f}finally{clearTimeout(a)}return s}function ne(t){if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&E.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),Bt(t.candidates[0]))throw new d(u.RESPONSE_ERROR,`Response error: ${F(t)}. Response body stored in error.response`,{response:t});return!0}else return!1}function C(t){return"type"in t&&t.type?t:t.text!==void 0?{...t,type:"text"}:t.inlineData!==void 0?{...t,type:"inlineData"}:t.functionCall!==void 0?{...t,type:"functionCall"}:t.functionResponse!==void 0?{...t,type:"functionResponse"}:t.fileData!==void 0?{...t,type:"fileData"}:t.executableCode!==void 0?{...t,type:"executableCode"}:t.codeExecutionResult!==void 0?{...t,type:"codeExecutionResult"}:t}function ae(t,e=P.IN_CLOUD){if(t.candidates?.[0]&&!t.candidates[0].hasOwnProperty("index")&&(t.candidates[0].index=0),t.candidates)for(let s of t.candidates)s.content?.parts&&(s.content.parts=s.content.parts.map(C));let n=Vs(t);return n.inferenceSource=e,n}function Vs(t){return t.text=()=>{if(ne(t))return Nt(t,e=>!("thought"in e&&e.thought));if(t.promptFeedback)throw new d(u.RESPONSE_ERROR,`Text not available. ${F(t)}`,{response:t});return""},t.thoughtSummary=()=>{if(ne(t)){let e=Nt(t,n=>!!("thought"in n&&n.thought));return e===""?void 0:e}else if(t.promptFeedback)throw new d(u.RESPONSE_ERROR,`Thought summary not available. ${F(t)}`,{response:t})},t.inlineDataParts=()=>{if(ne(t))return Ws(t);if(t.promptFeedback)throw new d(u.RESPONSE_ERROR,`Data not available. ${F(t)}`,{response:t})},t.functionCalls=()=>{if(ne(t))return $t(t);if(t.promptFeedback)throw new d(u.RESPONSE_ERROR,`Function call not available. ${F(t)}`,{response:t})},t}function Nt(t,e){let n=[];if(t.candidates?.[0].content?.parts)for(let s of t.candidates?.[0].content?.parts){let i=C(s);i.type==="text"&&e(i)&&n.push(i.text)}return n.length>0?n.join(""):""}function $t(t){if(!t)return;let e=[];if(t.candidates?.[0].content?.parts)for(let n of t.candidates?.[0].content?.parts){let s=C(n);s.type==="functionCall"&&e.push(s.functionCall)}if(e.length>0)return e}function Ws(t){let e=[];if(t.candidates?.[0].content?.parts)for(let n of t.candidates?.[0].content?.parts){let s=C(n);s.type==="inlineData"&&e.push(s)}if(e.length>0)return e}var js=[b.RECITATION,b.SAFETY,b.BLOCKLIST,b.PROHIBITED_CONTENT,b.SPII,b.MALFORMED_FUNCTION_CALL,b.IMAGE_SAFETY,b.IMAGE_PROHIBITED_CONTENT,b.IMAGE_OTHER,b.NO_IMAGE,b.IMAGE_RECITATION,b.LANGUAGE,b.UNEXPECTED_TOOL_CALL,b.TOO_MANY_TOOL_CALLS,b.MISSING_THOUGHT_SIGNATURE,b.MALFORMED_RESPONSE];function Bt(t){return!!t.finishReason&&js.some(e=>e===t.finishReason)}function F(t){let e="";if((!t.candidates||t.candidates.length===0)&&t.promptFeedback)e+="Response was blocked",t.promptFeedback?.blockReason&&(e+=` due to ${t.promptFeedback.blockReason}`),t.promptFeedback?.blockReasonMessage&&(e+=`: ${t.promptFeedback.blockReasonMessage}`);else if(t.candidates?.[0]){let n=t.candidates[0];Bt(n)&&(e+=`Candidate was blocked due to ${n.finishReason}`,n.finishMessage&&(e+=`: ${n.finishMessage}`))}return e}function Ve(t){if(t!=null){if(typeof t=="string")return{role:"system",parts:[{type:"text",text:t}]};if(t.type==="text"||"text"in t&&typeof t.text=="string")return{role:"system",parts:[k(C(t))]};if(t.parts){let e=t.parts.map(n=>k(C(n)));return t.role?{...t,parts:e}:{role:"system",parts:e}}}}function z(t){let e=[];if(typeof t=="string")e=[{type:"text",text:t}];else for(let n of t)typeof n=="string"?e.push({type:"text",text:n}):e.push(k(C(n)));return zs(e)}function zs(t){let e={role:"user",parts:[]},n=!1,s=!1;for(let i of t)i.type==="functionResponse"||"functionResponse"in i?s=!0:n=!0,e.parts.push(i);if(n&&s)throw new d(u.INVALID_CONTENT,"Within a single message, FunctionResponse cannot be mixed with other type of Part in the request for sending chat message.");if(!n&&!s)throw new d(u.INVALID_CONTENT,"No Content is provided for sending chat message.");return e}function Pe(t){let e;if(t.contents){let n=t;e={...n,contents:n.contents.map(s=>({...s,parts:s.parts?s.parts.map(C):[]}))}}else e={contents:[z(t)]};return t.systemInstruction&&(e.systemInstruction=Ve(t.systemInstruction)),e}function Ks(t){return t.parts&&Array.isArray(t.parts)?{...t,parts:t.parts.map(We)}:t}function We(t){let e;if("type"in t){let{type:n,...s}=t;e=s}else e=t;return e.functionResponse&&(e={...e,functionResponse:Ks(e.functionResponse)}),e}function je(t){return t.parts?{...t,parts:t.parts.map(We)}:t}function Ht(t){return t==null||typeof t=="string"?t:"parts"in t&&Array.isArray(t.parts)?je(t):We(t)}function Gt(t){let e={...t};return e.contents&&(e.contents=e.contents.map(je)),e.systemInstruction&&(e.systemInstruction=Ht(e.systemInstruction)),e}function Ys(t){let e={...t};return e.contents&&(e.contents=e.contents.map(je)),e.systemInstruction&&(e.systemInstruction=Ht(e.systemInstruction)),e}function Vt(t){if(t.safetySettings?.forEach(e=>{if(e.method)throw new d(u.UNSUPPORTED,"SafetySetting.method is not supported in the the Gemini Developer API. Please remove this property.")}),t.generationConfig?.topK){let e=Math.round(t.generationConfig.topK);e!==t.generationConfig.topK&&(E.warn("topK in GenerationConfig has been rounded to the nearest integer to match the format for requests to the Gemini Developer API."),t.generationConfig.topK=e)}return t}function ze(t){return{candidates:t.candidates?Js(t.candidates):void 0,promptFeedback:t.promptFeedback?Xs(t.promptFeedback):void 0,usageMetadata:t.usageMetadata}}function qs(t,e){return{generateContentRequest:{model:e,...t}}}function Js(t){let e=[],n;return e&&t.forEach(s=>{let i;if(s.citationMetadata&&(i={citations:s.citationMetadata.citationSources}),s.safetyRatings&&(n=s.safetyRatings.map(o=>({...o,severity:o.severity??Ut.HARM_SEVERITY_UNSUPPORTED,probabilityScore:o.probabilityScore??0,severityScore:o.severityScore??0}))),s.content?.parts?.some(o=>"videoMetadata"in o&&o.videoMetadata))throw new d(u.UNSUPPORTED,"Part.videoMetadata is not supported in the Gemini Developer API. Please remove this property.");let r={index:s.index,content:s.content,finishReason:s.finishReason,finishMessage:s.finishMessage,safetyRatings:n,citationMetadata:i,groundingMetadata:s.groundingMetadata,urlContextMetadata:s.urlContextMetadata};e.push(r)}),e}function Xs(t){let e=[];return(t.safetyRatings??[]).forEach(s=>{e.push({category:s.category,probability:s.probability,severity:s.severity??Ut.HARM_SEVERITY_UNSUPPORTED,probabilityScore:s.probabilityScore??0,severityScore:s.severityScore??0,blocked:s.blocked})}),{blockReason:t.blockReason,safetyRatings:e,blockReasonMessage:t.blockReasonMessage}}var Lt=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;async function Qs(t,e,n){let s=t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),i=ni(s),[r,o]=i.tee(),{response:a,firstValue:c}=await Zs(o,e,n);return{stream:ti(r,e,n),response:a,firstValue:c}}async function Zs(t,e,n){let[s,i]=t.tee(),r=s.getReader(),{value:o}=await r.read();return{firstValue:o,response:ei(i,e,n)}}async function ei(t,e,n){let s=[],i=t.getReader();for(;;){let{done:r,value:o}=await i.read();if(r){let a=si(s);return e.backend.backendType===v.GOOGLE_AI&&(a=ze(a)),ae(a,n)}s.push(o)}}async function*ti(t,e,n){let s=t.getReader();for(;;){let{value:i,done:r}=await s.read();if(r)break;let o;e.backend.backendType===v.GOOGLE_AI?o=ae(ze(i),n):o=ae(i,n);let a=o.candidates?.[0];!a?.content?.parts&&!a?.finishReason&&!a?.citationMetadata&&!a?.urlContextMetadata||(yield o)}}function ni(t){let e=t.getReader();return new ReadableStream({start(s){let i="";return r();function r(){return e.read().then(({value:o,done:a})=>{if(a){if(i.trim()){s.error(new d(u.PARSE_FAILED,"Failed to parse stream"));return}s.close();return}i+=o;let c=i.match(Lt),l;for(;c;){try{l=JSON.parse(c[1])}catch{s.error(new d(u.PARSE_FAILED,`Error parsing JSON response: "${c[1]}`));return}s.enqueue(l),i=i.substring(c[0].length),c=i.match(Lt)}return r()})}}})}function si(t){let n={promptFeedback:t[t.length-1]?.promptFeedback};for(let s of t)if(s.candidates)for(let i of s.candidates){let r=i.index||0;n.candidates||(n.candidates=[]),n.candidates[r]||(n.candidates[r]={index:i.index}),n.candidates[r].citationMetadata=i.citationMetadata,n.candidates[r].finishReason=i.finishReason,n.candidates[r].finishMessage=i.finishMessage,n.candidates[r].safetyRatings=i.safetyRatings,n.candidates[r].groundingMetadata=i.groundingMetadata;let o=i.urlContextMetadata;if(typeof o=="object"&&o!==null&&Object.keys(o).length>0&&(n.candidates[r].urlContextMetadata=o),i.content){if(!i.content.parts)continue;n.candidates[r].content||(n.candidates[r].content={role:i.content.role||"user",parts:[]});for(let a of i.content.parts){if("text"in a&&a.text==="")continue;if(Object.keys(a).length===0)throw new d(u.INVALID_CONTENT,"Part should have at least one property, but there are none. This is likely caused by a malformed response from the backend.");let c=C({...a});Object.keys(c).length>0&&n.candidates[r].content.parts.push(c)}}}return n}var ii=[u.FETCH_ERROR,u.ERROR,u.API_NOT_ENABLED];async function Wt(t,e,n,s){if(!e)return{response:await s(),inferenceSource:P.IN_CLOUD};switch(e.mode){case S.ONLY_ON_DEVICE:if(await e.isAvailable(t))return{response:await n(),inferenceSource:P.ON_DEVICE};throw new d(u.UNSUPPORTED,"Inference mode is ONLY_ON_DEVICE, but an on-device model is not available.");case S.ONLY_IN_CLOUD:return{response:await s(),inferenceSource:P.IN_CLOUD};case S.PREFER_IN_CLOUD:try{return{response:await s(),inferenceSource:P.IN_CLOUD}}catch(i){if(i instanceof d&&ii.includes(i.code)&&await e.isAvailable(t))return{response:await n(),inferenceSource:P.ON_DEVICE};throw i}case S.PREFER_ON_DEVICE:return await e.isAvailable(t)?{response:await n(),inferenceSource:P.ON_DEVICE}:{response:await s(),inferenceSource:P.IN_CLOUD};default:throw new d(u.ERROR,`Unexpected infererence mode: ${e.mode}`)}}async function ri(t,e,n,s){return n=Gt(n),t.backend.backendType===v.GOOGLE_AI&&(n=Vt(n)),Ge({task:"streamGenerateContent",model:e,apiSettings:t,stream:!0,singleRequestOptions:s},JSON.stringify(n))}async function jt(t,e,n,s,i){let r=await Wt(n,s,()=>s.generateContentStream(n),()=>ri(t,e,n,i));return Qs(r.response,t,r.inferenceSource)}async function oi(t,e,n,s){return n=Gt(n),t.backend.backendType===v.GOOGLE_AI&&(n=Vt(n)),Ge({model:e,task:"generateContent",apiSettings:t,stream:!1,singleRequestOptions:s},JSON.stringify(n))}async function zt(t,e,n,s,i){let r=await Wt(n,s,()=>s.generateContent(n),()=>oi(t,e,n,i)),o=await ai(r.response,t);return{response:ae(o,r.inferenceSource)}}async function ai(t,e){let n=await t.json();return e.backend.backendType===v.GOOGLE_AI?ze(n):n}var Pt="SILENT_ERROR",Mt=10,$e=class{constructor(e,n,s){this.params=n,this.requestOptions=s,this._history=[],this._sendPromise=Promise.resolve(),this._apiSettings=e}async getHistory(){return await this._sendPromise,k(this._history).map(e=>({...e,parts:e.parts?e.parts.map(C):[]}))}async _sendMessage(e,n){let s={};await this._sendPromise;let i=[];return this._sendPromise=this._sendPromise.then(async()=>{let r,o=0,a=this.requestOptions?.maxSequentialFunctionCalls??Mt;do{let c;if(r){o++;let h=await this._callFunctionsAsNeeded(r);c=z(h)}else c=z(e);let l=this._formatRequest(c,[...i]);i.push(c);let f=await this._callGenerateContent(l,n);if(f)if(s=f,r=this._getCallableFunctionCalls(f.response),f.response.candidates&&f.response.candidates.length>0){let h={parts:f.response.candidates?.[0].content.parts||[],role:f.response.candidates?.[0].content.role||"model"};i.push(k(h))}else{let h=F(f.response);h&&E.warn(`sendMessage() was unsuccessful. ${h}. Inspect response object for details.`)}else r=void 0}while(r&&o<a);r&&o>=a&&E.warn(`Automatic function calling exceeded the limit of ${a} function calls. Returning last model response.`)}),await this._sendPromise,this._history=this._history.concat(i),s}async _sendMessageStream(e,n){await this._sendPromise;let s=[],r=(async()=>{let o,a=0,c=this.requestOptions?.maxSequentialFunctionCalls??Mt,l;do{let f;if(o){a++;let m=await this._callFunctionsAsNeeded(o);f=z(m)}else f=z(e);let h=this._formatRequest(f,[...s]);if(s.push(f),l=await this._callGenerateContentStream(h,n),o=this._getCallableFunctionCalls(l.firstValue),o&&l.firstValue&&l.firstValue.candidates&&l.firstValue.candidates.length>0){let m={...l.firstValue.candidates[0].content};m.role||(m.role="model"),s.push(m)}}while(o&&a<c);return o&&a>=c&&E.warn(`Automatic function calling exceeded the limit of ${c} function calls. Returning last model response.`),{stream:l.stream,response:l.response}})();return this._sendPromise=this._sendPromise.then(async()=>r).catch(o=>{throw new Error(Pt)}).then(o=>o.response).then(o=>{if(o.candidates&&o.candidates.length>0){this._history=this._history.concat(s);let a={...o.candidates[0].content};a.role||(a.role="model"),this._history.push(k(a))}else{let a=F(o);a&&E.warn(`sendMessageStream() was unsuccessful. ${a}. Inspect response object for details.`)}}).catch(o=>{o.message!==Pt&&o.name!=="AbortError"&&E.error(o)}),r}_getCallableFunctionCalls(e){let n=this.params?.tools?.find(i=>i.functionDeclarations);if(!n?.functionDeclarations)return;let s=$t(e);if(s){for(let i of s)if(!n.functionDeclarations?.some(o=>o.name===i.name&&typeof o.functionReference=="function"))return;return s}}async _callFunctionsAsNeeded(e){let n=[],s=[],i=this.params?.tools?.find(r=>r.functionDeclarations);if(i&&i.functionDeclarations){for(let o of e){let a=i.functionDeclarations.find(c=>c.name===o.name);if(a?.functionReference){let c=Promise.resolve(a.functionReference(o.args)).catch(l=>{let f=new d(u.ERROR,`Error in user-defined function "${a.name}": ${l.message}`);throw f.stack=l.stack,f});n.push({name:o.name,id:o.id,results:c}),s.push(c)}}await Promise.all(s);let r=[];for(let{name:o,id:a,results:c}of n){let l={name:o,response:await c};a&&(l.id=a),r.push({type:"functionResponse",functionResponse:l})}return r}else throw new d(u.REQUEST_ERROR,'No function declarations were provided in "tools".')}};var ci=["text","inlineData","functionCall","functionResponse","thought","thoughtSignature"],li={user:["text","inlineData","functionResponse"],function:["functionResponse"],model:["text","functionCall","thought","thoughtSignature"],system:["text"]},xt={user:["model"],function:["model"],model:["user","function"],system:[]};function ui(t){let e=null;for(let n of t){let{role:s,parts:i}=n;if(!e&&s!=="user")throw new d(u.INVALID_CONTENT,`First Content should be with role 'user', got ${s}`);if(!kt.includes(s))throw new d(u.INVALID_CONTENT,`Each item should include role field. Got ${s} but valid roles are: ${JSON.stringify(kt)}`);if(!Array.isArray(i))throw new d(u.INVALID_CONTENT,"Content should have 'parts' property with an array of Parts");if(i.length===0)throw new d(u.INVALID_CONTENT,"Each Content should have at least one part");let r={text:0,inlineData:0,functionCall:0,functionResponse:0,thought:0,thoughtSignature:0,fileData:0,executableCode:0,codeExecutionResult:0};for(let a of i){if(a.type)r[a.type]+=1;else for(let c of["text","inlineData","functionCall","functionResponse","fileData","executableCode","codeExecutionResult"])c in a&&(r[c]+=1);"thought"in a&&a.thought&&(r.thought+=1),"thoughtSignature"in a&&a.thoughtSignature&&(r.thoughtSignature+=1)}let o=li[s];for(let a of ci)if(!o.includes(a)&&r[a]>0)throw new d(u.INVALID_CONTENT,`Content with role '${s}' can't contain '${a}' part`);if(e&&!xt[s].includes(e.role))throw new d(u.INVALID_CONTENT,`Content with role '${s}' can't follow '${e.role}'. Valid previous roles: ${JSON.stringify(xt)}`);e=n}}var Be=class extends $e{constructor(e,n,s,i,r){super(e,i,r),this.model=n,this.chromeAdapter=s,this.params=i,this.requestOptions=r,i?.history&&(ui(i.history),this._history=k(i.history)),this.params?.systemInstruction!=null&&(this.params={...this.params,systemInstruction:Ve(this.params.systemInstruction)})}_formatRequest(e,n){return{safetySettings:this.params?.safetySettings,generationConfig:this.params?.generationConfig,tools:this.params?.tools,toolConfig:this.params?.toolConfig,systemInstruction:this.params?.systemInstruction,contents:[...this._history,...n,e]}}_callGenerateContent(e,n){return zt(this._apiSettings,this.model,e,this.chromeAdapter,{...this.requestOptions,...n})}_callGenerateContentStream(e,n){return jt(this._apiSettings,this.model,e,this.chromeAdapter,{...this.requestOptions,...n})}async sendMessage(e,n){return this._sendMessage(e,n)}async sendMessageStream(e,n){return this._sendMessageStream(e,n)}};async function di(t,e,n,s){n=Ys(n);let i="";if(t.backend.backendType===v.GOOGLE_AI){let o=qs(n,e);i=JSON.stringify(o)}else i=JSON.stringify(n);return(await Ge({model:e,task:"countTokens",apiSettings:t,stream:!1,singleRequestOptions:s},i)).json()}async function fi(t,e,n,s,i){if(s?.mode===S.ONLY_ON_DEVICE)throw new d(u.UNSUPPORTED,"countTokens() is not supported for on-device models.");return di(t,e,n,i)}var He=class extends Ue{constructor(e,n,s,i){super(e,n.model),this.chromeAdapter=i,this.generationConfig=n.generationConfig||{},hi(this.generationConfig),this.safetySettings=n.safetySettings||[],this.tools=n.tools,this.toolConfig=n.toolConfig,this.systemInstruction=Ve(n.systemInstruction),this.requestOptions=s||{}}async initializeDeviceModel(e){if(!this.chromeAdapter||this.chromeAdapter.mode===S.ONLY_IN_CLOUD)return;if(await this.chromeAdapter.downloadIfAvailable(e)===D.UNAVAILABLE){let s=new d(u.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(this.chromeAdapter.mode===S.ONLY_ON_DEVICE)throw s;E.debug(s.message)}await this.chromeAdapter.downloadPromise}async generateContent(e,n){let s=Pe(e);return zt(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...s},this.chromeAdapter,{...this.requestOptions,...n})}async generateContentStream(e,n){let s=Pe(e),{stream:i,response:r}=await jt(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...s},this.chromeAdapter,{...this.requestOptions,...n});return{stream:i,response:r}}startChat(e){return new Be(this._apiSettings,this.model,this.chromeAdapter,{tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,generationConfig:this.generationConfig,safetySettings:this.safetySettings,...e},this.requestOptions)}async countTokens(e,n){let s=Pe(e);return fi(this._apiSettings,this.model,s,this.chromeAdapter,{...this.requestOptions,...n})}};function hi(t){if(t.thinkingConfig?.thinkingBudget!=null&&t.thinkingConfig?.thinkingLevel)throw new d(u.UNSUPPORTED,"Cannot set both thinkingBudget and thinkingLevel in a config.");if(t.responseSchema!=null&&t.responseJsonSchema!=null)throw new d(u.UNSUPPORTED,"Cannot set both responseSchema and responseJsonSchema in a config.");if((t.responseSchema!=null||t.responseJsonSchema!=null)&&t.responseMimeType!=="application/json"&&t.responseMimeType!=="text/x.enum")throw new d(u.UNSUPPORTED,'responseMimeType must be set to "application/json" or "text/x.enum" if responseSchema or responseJsonSchema are set.')}var pi="audio-processor",vr=`
  class AudioProcessor extends AudioWorkletProcessor {
    constructor(options) {
      super();
      this.targetSampleRate = options.processorOptions.targetSampleRate;
      // 'sampleRate' is a global variable available inside the AudioWorkletGlobalScope,
      // representing the native sample rate of the AudioContext.
      this.inputSampleRate = sampleRate;
    }

    /**
     * This method is called by the browser's audio engine for each block of audio data.
     * Input is a single input, with a single channel (input[0][0]).
     */
    process(inputs) {
      const input = inputs[0];
      if (input && input.length > 0 && input[0].length > 0) {
        const pcmData = input[0]; // Float32Array of raw audio samples.
        
        // Simple linear interpolation for resampling.
        const resampled = new Float32Array(Math.round(pcmData.length * this.targetSampleRate / this.inputSampleRate));
        const ratio = pcmData.length / resampled.length;
        for (let i = 0; i < resampled.length; i++) {
          resampled[i] = pcmData[Math.floor(i * ratio)];
        }

        // Convert Float32 (-1, 1) samples to Int16 (-32768, 32767)
        const resampledInt16 = new Int16Array(resampled.length);
        for (let i = 0; i < resampled.length; i++) {
          const sample = Math.max(-1, Math.min(1, resampled[i]));
          if (sample < 0) {
            resampledInt16[i] = sample * 32768;
          } else {
            resampledInt16[i] = sample * 32767;
          }
        }
        
        this.port.postMessage(resampledInt16);
      }
      // Return true to keep the processor alive and processing the next audio block.
      return true;
    }
  }

  // Register the processor with a name that can be used to instantiate it from the main thread.
  registerProcessor('${pi}', AudioProcessor);
`;function gi(t=te(),e){t=X(t);let n=$(t,B),s=e?.backend??new H,i=Ms(s),r=n.getImmediate({identifier:i}),o=r.options;if(o){let a=e?.useLimitedUseAppCheckTokens,c=!!o.useLimitedUseAppCheckTokens;if(a!=null&&!!a!==c)throw new d(u.ALREADY_INITIALIZED,`getAI() has already been called for app "${t.name}" and this backend with useLimitedUseAppCheckTokens: ${c}. This option cannot be changed after the AI instance has been initialized. Pass the desired options to the first getAI() call for this app and backend, or omit useLimitedUseAppCheckTokens to reuse the existing instance.`);return r}return r.options={useLimitedUseAppCheckTokens:e?.useLimitedUseAppCheckTokens??!1},r}var mi=["mode","onDeviceParams","inCloudParams"];function Ei(t,e,n){let s=e,i;if(s.mode){for(let a of Object.keys(e))mi.includes(a)||E.warn(`When a hybrid inference mode is specified (mode is currently set to ${s.mode}), "${a}" cannot be configured at the top level. Configuration for in-cloud and on-device must be done separately in inCloudParams and onDeviceParams. Configuration values set outside of inCloudParams and onDeviceParams will be ignored.`);i=s.inCloudParams||{model:Ls}}else i=e;if(!i.model)throw new d(u.NO_MODEL,"Must provide a model name. Example: getGenerativeModel({ model: 'my-model-name' })");let r=t.chromeAdapterFactory?.(s.mode,typeof window>"u"?void 0:window,s.onDeviceParams),o=new He(t,i,n,r);return o._apiSettings.inferenceMode=s.mode,o}function _i(){L(new y(B,Fs,"PUBLIC").setMultipleInstances(!0)),T(Dt,Me),T(Dt,Me,"esm2020")}_i();var qe=new Map,Jt={activated:!1,tokenObservers:[]},bi={initialized:!1,enabled:!1};function g(t){return qe.get(t)||{...Jt}}function yi(t,e){return qe.set(t,e),qe.get(t)}function fe(){return bi}var tt="https://content-firebaseappcheck.googleapis.com/v1",wi="exchangeRecaptchaV3Token",Si="exchangeRecaptchaEnterpriseToken",Ai="exchangeDebugToken",Kt={RETRIAL_MIN_WAIT:30*1e3,RETRIAL_MAX_WAIT:960*1e3},Ti=1440*60*1e3;var Je=class{constructor(e,n,s,i,r){if(this.operation=e,this.retryPolicy=n,this.getWaitDuration=s,this.lowerBound=i,this.upperBound=r,this.pending=null,this.nextErrorWaitInterval=i,i>r)throw new Error("Proactive refresh lower bound greater than upper bound!")}start(){this.nextErrorWaitInterval=this.lowerBound,this.process(!0).catch(()=>{})}stop(){this.pending&&(this.pending.reject("cancelled"),this.pending=null)}isRunning(){return!!this.pending}async process(e){this.stop();try{this.pending=new w,this.pending.promise.catch(n=>{}),await Ci(this.getNextRun(e)),this.pending.resolve(),await this.pending.promise,this.pending=new w,this.pending.promise.catch(n=>{}),await this.operation(),this.pending.resolve(),await this.pending.promise,this.process(!0).catch(()=>{})}catch(n){this.retryPolicy(n)?this.process(!1).catch(()=>{}):this.stop()}}getNextRun(e){if(e)return this.nextErrorWaitInterval=this.lowerBound,this.getWaitDuration();{let n=this.nextErrorWaitInterval;return this.nextErrorWaitInterval*=2,this.nextErrorWaitInterval>this.upperBound&&(this.nextErrorWaitInterval=this.upperBound),n}}};function Ci(t){return new Promise(e=>{setTimeout(e,t)})}var Ri={"already-initialized":"You have already called initializeAppCheck() for FirebaseApp {$appName} with different options. To avoid this error, call initializeAppCheck() with the same options as when it was originally called. This will return the already initialized instance.","use-before-activation":"App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. Call initializeAppCheck() before instantiating other Firebase services.","fetch-network-error":"Fetch failed to connect to a network. Check Internet connection. Original error: {$originalErrorMessage}.","fetch-parse-error":"Fetch client could not parse response. Original error: {$originalErrorMessage}.","fetch-status-error":"Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.","storage-open":"Error thrown when opening storage. Original error: {$originalErrorMessage}.","storage-get":"Error thrown when reading from storage. Original error: {$originalErrorMessage}.","storage-set":"Error thrown when writing to storage. Original error: {$originalErrorMessage}.","recaptcha-error":"ReCAPTCHA error.","initial-throttle":"{$httpStatus} error. Attempts allowed again after {$time}",throttled:"Requests throttled due to previous {$httpStatus} error. Attempts allowed again after {$time}"},_=new x("appCheck","AppCheck",Ri);function ue(t=!1){return t?self.grecaptcha?.enterprise:self.grecaptcha}function nt(t){if(!g(t).activated)throw _.create("use-before-activation",{appName:t.name})}function st(t){let e=Math.round(t/1e3),n=Math.floor(e/(3600*24)),s=Math.floor((e-n*3600*24)/3600),i=Math.floor((e-n*3600*24-s*3600)/60),r=e-n*3600*24-s*3600-i*60,o="";return n&&(o+=ce(n)+"d:"),s&&(o+=ce(s)+"h:"),o+=ce(i)+"m:"+ce(r)+"s",o}function ce(t){return t===0?"00":t>=10?t.toString():"0"+t}async function he({url:t,body:e},n){let s={"Content-Type":"application/json"},i=n.getImmediate({optional:!0});if(i){let h=await i.getHeartbeatsHeader();h&&(s["X-Firebase-Client"]=h)}let r={method:"POST",body:JSON.stringify(e),headers:s},o;try{o=await fetch(t,r)}catch(h){throw _.create("fetch-network-error",{originalErrorMessage:h?.message})}if(o.status!==200)throw _.create("fetch-status-error",{httpStatus:o.status});let a;try{a=await o.json()}catch(h){throw _.create("fetch-parse-error",{originalErrorMessage:h?.message})}let c=a.ttl.match(/^([\d.]+)(s)$/);if(!c||!c[2]||isNaN(Number(c[1])))throw _.create("fetch-parse-error",{originalErrorMessage:`ttl field (timeToLive) is not in standard Protobuf Duration format: ${a.ttl}`});let l=Number(c[1])*1e3,f=Date.now();return{token:a.token,expireTimeMillis:f+l,issuedAtTimeMillis:f}}function Oi(t,e){let{projectId:n,appId:s,apiKey:i}=t.options;return{url:`${tt}/projects/${n}/apps/${s}:${wi}?key=${i}`,body:{recaptcha_v3_token:e}}}function Ii(t,e){let{projectId:n,appId:s,apiKey:i}=t.options;return{url:`${tt}/projects/${n}/apps/${s}:${Si}?key=${i}`,body:{recaptcha_enterprise_token:e}}}function Xt(t,e){let{projectId:n,appId:s,apiKey:i}=t.options;return{url:`${tt}/projects/${n}/apps/${s}:${Ai}?key=${i}`,body:{debug_token:e}}}var Di="firebase-app-check-database",vi=1,K="firebase-app-check-store",Qt="debug-token",le=null;function Zt(){return le||(le=new Promise((t,e)=>{try{let n=indexedDB.open(Di,vi);n.onsuccess=s=>{t(s.target.result)},n.onerror=s=>{e(_.create("storage-open",{originalErrorMessage:s.target.error?.message}))},n.onupgradeneeded=s=>{let i=s.target.result;s.oldVersion===0&&i.createObjectStore(K,{keyPath:"compositeKey"})}}catch(n){e(_.create("storage-open",{originalErrorMessage:n?.message}))}}),le)}function ki(t){return tn(nn(t))}function Ni(t,e){return en(nn(t),e)}function Li(t){return en(Qt,t)}function Pi(){return tn(Qt)}async function en(t,e){let s=(await Zt()).transaction(K,"readwrite"),r=s.objectStore(K).put({compositeKey:t,value:e});return new Promise((o,a)=>{r.onsuccess=c=>{o()},s.onerror=c=>{a(_.create("storage-set",{originalErrorMessage:c.target.error?.message}))}})}async function tn(t){let n=(await Zt()).transaction(K,"readonly"),i=n.objectStore(K).get(t);return new Promise((r,o)=>{i.onsuccess=a=>{let c=a.target.result;r(c?c.value:void 0)},n.onerror=a=>{o(_.create("storage-get",{originalErrorMessage:a.target.error?.message}))}})}function nn(t){return`${t.options.appId}-${t.name}`}var M=new N("@firebase/app-check");async function Mi(t){if(W()){let e;try{e=await ki(t)}catch(n){M.warn(`Failed to read token from IndexedDB. Error: ${n}`)}return e}}function Ke(t,e){return W()?Ni(t,e).catch(n=>{M.warn(`Failed to write token to IndexedDB. Error: ${n}`)}):Promise.resolve()}async function xi(t){let e;try{e=await Pi()}catch{}if(e)return e;{let n=crypto.randomUUID(),s=`To use this token for app debugging, register it with your project.

Firebase App Check debug token: ${n}

`,i=t?.options.appId,r=t?.options.projectId;return r&&i?s+=`You can do so in the Firebase Console:
https://console.firebase.google.com/project/${r}/appcheck/apps?selectedAppId=${i}

Or using the Firebase CLI:
firebase appcheck:debugtokens:create ${n} --project ${r} --app ${i}

`:s+=`You will need to add it to your app's App Check settings in the Firebase Console for it to work.

`,s+=`Note: To keep your project secure, please revoke and delete this token using the
Firebase Console or the CLI (\`firebase appcheck:debugtokens:delete\`) when you finish debugging.

Warning: This debug token is a secret and should not be shared or uploaded to source code.

Debug Token Guide: https://firebase.google.com/docs/app-check/web/debug-provider
Firebase CLI install instructions: https://firebase.google.com/docs/cli
`,console.log(s),Li(n).catch(o=>M.warn(`Failed to persist debug token to IndexedDB. Error: ${o}`)),n}}function it(){return fe().enabled}async function rt(){let t=fe();if(t.enabled&&t.token)return t.token.promise;throw Error(`
            Can't get debug token in production mode.
        `)}function Ui(t){let e=V(),n=fe();if(n.initialized=!0,typeof e.FIREBASE_APPCHECK_DEBUG_TOKEN!="string"&&e.FIREBASE_APPCHECK_DEBUG_TOKEN!==!0)return;n.enabled=!0;let s=new w;n.token=s,typeof e.FIREBASE_APPCHECK_DEBUG_TOKEN=="string"?s.resolve(e.FIREBASE_APPCHECK_DEBUG_TOKEN):s.resolve(xi(t))}var Fi={error:"UNKNOWN_ERROR"};function $i(t){return q.encodeString(JSON.stringify(t),!1)}async function Xe(t,e=!1,n=!1){let s=t.app;nt(s);let i=g(s),r=i.token,o;if(r&&!G(r)&&(i.token=void 0,r=void 0),!r){let l=await i.cachedTokenPromise;l&&(G(l)?r=l:await Ke(s,void 0))}if(!e&&r&&G(r))return{token:r.token};let a=!1;if(it())try{let l=await rt();i.exchangeTokenPromise||(i.exchangeTokenPromise=he(Xt(s,l),t.heartbeatServiceProvider).finally(()=>{i.exchangeTokenPromise=void 0}),a=!0);let f=await i.exchangeTokenPromise;return await Ke(s,f),i.token=f,{token:f.token}}catch(l){return l.code==="appCheck/throttled"||l.code==="appCheck/initial-throttle"?M.warn(l.message):n&&M.error(l),Ye(l)}try{i.exchangeTokenPromise||(i.exchangeTokenPromise=i.provider.getToken().finally(()=>{i.exchangeTokenPromise=void 0}),a=!0),r=await g(s).exchangeTokenPromise}catch(l){l.code==="appCheck/throttled"||l.code==="appCheck/initial-throttle"?M.warn(l.message):n&&M.error(l),o=l}let c;return r?o?G(r)?c={token:r.token,internalError:o}:c=Ye(o):(c={token:r.token},i.token=r,await Ke(s,r)):c=Ye(o),a&&on(s,c),c}async function Bi(t){let e=t.app;nt(e);let{provider:n}=g(e);if(it()){let s=await rt(),i=Xt(e,s);i.body.limited_use=!0;let{token:r}=await he(i,t.heartbeatServiceProvider);return{token:r}}else{let{token:s}=await n.getToken(!0);return{token:s}}}function sn(t,e,n,s){let{app:i}=t,r=g(i),o={next:n,error:s,type:e};if(r.tokenObservers=[...r.tokenObservers,o],r.token&&G(r.token)){let a=r.token;Promise.resolve().then(()=>{n({token:a.token}),Yt(t)}).catch(()=>{})}r.cachedTokenPromise.then(()=>Yt(t))}function rn(t,e){let n=g(t),s=n.tokenObservers.filter(i=>i.next!==e);s.length===0&&n.tokenRefresher&&n.tokenRefresher.isRunning()&&n.tokenRefresher.stop(),n.tokenObservers=s}function Yt(t){let{app:e}=t,n=g(e),s=n.tokenRefresher;s||(s=Hi(t),n.tokenRefresher=s),!s.isRunning()&&n.isTokenAutoRefreshEnabled&&s.start()}function Hi(t){let{app:e}=t;return new Je(async()=>{let n=g(e),s;if(n.token?s=await Xe(t,!0):s=await Xe(t),s.error)throw s.error;if(s.internalError)throw s.internalError},()=>!0,()=>{let n=g(e);if(n.token){let s=n.token.issuedAtTimeMillis+(n.token.expireTimeMillis-n.token.issuedAtTimeMillis)*.5+3e5,i=n.token.expireTimeMillis-300*1e3;return s=Math.min(s,i),Math.max(0,s-Date.now())}else return 0},Kt.RETRIAL_MIN_WAIT,Kt.RETRIAL_MAX_WAIT)}function on(t,e){let n=g(t).tokenObservers;for(let s of n)try{s.type==="EXTERNAL"&&e.error!=null?s.error(e.error):s.next(e)}catch{}}function G(t){return t.expireTimeMillis-Date.now()>0}function Ye(t){return{token:$i(Fi),error:t}}var Qe=class{constructor(e,n){this.app=e,this.heartbeatServiceProvider=n}_delete(){let{tokenObservers:e}=g(this.app);for(let n of e)rn(this.app,n.next);return Promise.resolve()}};function Gi(t,e){return new Qe(t,e)}function Vi(t){return{getToken:e=>Xe(t,e),getLimitedUseToken:()=>Bi(t),addTokenListener:e=>sn(t,"INTERNAL",e),removeTokenListener:e=>rn(t.app,e)}}var Wi="@firebase/app-check",ji="0.13.1";var zi="https://www.google.com/recaptcha/api.js",Ki="https://www.google.com/recaptcha/enterprise.js";function Yi(t,e){let n=new w,s=g(t);s.reCAPTCHAState={initialized:n};let i=an(t),r=ue(!1);return r?de(t,e,r,i,n):Xi(()=>{let o=ue(!1);if(!o)throw new Error("no recaptcha");de(t,e,o,i,n)}),n.promise}function qi(t,e){let n=new w,s=g(t);s.reCAPTCHAState={initialized:n};let i=an(t),r=ue(!0);return r?de(t,e,r,i,n):Qi(()=>{let o=ue(!0);if(!o)throw new Error("no recaptcha");de(t,e,o,i,n)}),n.promise}function de(t,e,n,s,i){n.ready(()=>{Ji(t,e,n,s),i.resolve(n)})}function an(t){let e=`fire_app_check_${t.name}`,n=document.createElement("div");return n.id=e,n.style.display="none",document.body.appendChild(n),e}async function cn(t){nt(t);let n=await g(t).reCAPTCHAState.initialized.promise;return new Promise((s,i)=>{let r=g(t).reCAPTCHAState;n.ready(()=>{s(n.execute(r.widgetId,{action:"fire_app_check"}))})})}function Ji(t,e,n,s){let i=n.render(s,{sitekey:e,size:"invisible",callback:()=>{g(t).reCAPTCHAState.succeeded=!0},"error-callback":()=>{g(t).reCAPTCHAState.succeeded=!1}}),r=g(t);r.reCAPTCHAState={...r.reCAPTCHAState,widgetId:i}}function Xi(t){let e=document.createElement("script");e.src=zi,e.onload=t,document.head.appendChild(e)}function Qi(t){let e=document.createElement("script");e.src=Ki+"?render=explicit",e.onload=t,document.head.appendChild(e)}var Ze=class t{constructor(e){this._siteKey=e,this._throttleData=null}async getToken(e=!1){un(this._throttleData);let n=await cn(this._app).catch(i=>{throw _.create("recaptcha-error")});if(!g(this._app).reCAPTCHAState?.succeeded)throw _.create("recaptcha-error");let s;try{let i=Oi(this._app,n);e&&(i.body.limited_use=!0),s=await he(i,this._heartbeatServiceProvider)}catch(i){throw i.code?.includes("fetch-status-error")?(this._throttleData=ln(Number(i.customData?.httpStatus),this._throttleData),_.create("initial-throttle",{time:st(this._throttleData.allowRequestsAfter-Date.now()),httpStatus:this._throttleData.httpStatus})):i}return this._throttleData=null,s}initialize(e){this._app=e,this._heartbeatServiceProvider=$(e,"heartbeat"),Yi(e,this._siteKey).catch(()=>{})}isEqual(e){return e instanceof t?this._siteKey===e._siteKey:!1}},et=class t{constructor(e){this._siteKey=e,this._throttleData=null}async getToken(e=!1){un(this._throttleData);let n=await cn(this._app).catch(i=>{throw _.create("recaptcha-error")});if(!g(this._app).reCAPTCHAState?.succeeded)throw _.create("recaptcha-error");let s;try{let i=Ii(this._app,n);e&&(i.body.limited_use=!0),s=await he(i,this._heartbeatServiceProvider)}catch(i){throw i.code?.includes("fetch-status-error")?(this._throttleData=ln(Number(i.customData?.httpStatus),this._throttleData),_.create("initial-throttle",{time:st(this._throttleData.allowRequestsAfter-Date.now()),httpStatus:this._throttleData.httpStatus})):i}return this._throttleData=null,s}initialize(e){this._app=e,this._heartbeatServiceProvider=$(e,"heartbeat"),qi(e,this._siteKey).catch(()=>{})}isEqual(e){return e instanceof t?this._siteKey===e._siteKey:!1}};function ln(t,e){if(t===404||t===403)return{backoffCount:1,allowRequestsAfter:Date.now()+Ti,httpStatus:t};{let n=e?e.backoffCount:0,s=ft(n,1e3,2);return{backoffCount:n+1,allowRequestsAfter:Date.now()+s,httpStatus:t}}}function un(t){if(t&&Date.now()-t.allowRequestsAfter<=0)throw _.create("throttled",{time:st(t.allowRequestsAfter-Date.now()),httpStatus:t.httpStatus})}function Zi(t=te(),e){t=X(t);let n=$(t,"app-check");if(fe().initialized||Ui(t),it()&&rt().then(i=>{console.log(`Firebase App Check debug token: ${i}`)}),n.isInitialized()){let i=n.getImmediate(),r=n.getOptions();if(r&&!!r.isTokenAutoRefreshEnabled==!!e.isTokenAutoRefreshEnabled&&r.provider?.isEqual(e.provider))return i;throw _.create("already-initialized",{appName:t.name})}let s=n.initialize({options:e});return er(t,e.provider,e.isTokenAutoRefreshEnabled),g(t).isTokenAutoRefreshEnabled&&sn(s,"INTERNAL",()=>{}),s}function er(t,e,n=!1){let s=yi(t,{...Jt});s.activated=!0,s.provider=e,s.cachedTokenPromise=Mi(t).then(i=>(i&&G(i)&&(s.token=i,on(t,{token:i.token})),i)),s.isTokenAutoRefreshEnabled=n&&t.automaticDataCollectionEnabled,!t.automaticDataCollectionEnabled&&n&&M.warn("`isTokenAutoRefreshEnabled` is true but `automaticDataCollectionEnabled` was set to false during `initializeApp()`. This blocks automatic token refresh."),s.provider.initialize(t)}var tr="app-check",qt="app-check-internal";function nr(){L(new y(tr,t=>{let e=t.getProvider("app").getImmediate(),n=t.getProvider("heartbeat");return Gi(e,n)},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((t,e,n)=>{t.getProvider(qt).initialize()})),L(new y(qt,t=>{let e=t.getProvider("app-check").getImmediate();return Vi(e)},"PUBLIC").setInstantiationMode("EXPLICIT")),T(Wi,ji)}nr();export{H as GoogleAIBackend,et as ReCaptchaEnterpriseProvider,Ze as ReCaptchaV3Provider,Ps as ResponseModality,gi as getAI,Ei as getGenerativeModel,Rt as initializeApp,Zi as initializeAppCheck};
/*! Bundled license information:

@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/logger/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/component/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

firebase/app/dist/esm/index.esm.js:
@firebase/app-check/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/ai/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/ai/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/ai/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2026 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/ai/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2026 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app-check/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app-check/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
