var ve=()=>{};var Pe=function(t){let e=[],n=0;for(let s=0;s<t.length;s++){let i=t.charCodeAt(s);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++s)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},wt=function(t){let e=[],n=0,s=0;for(;n<t.length;){let i=t[n++];if(i<128)e[s++]=String.fromCharCode(i);else if(i>191&&i<224){let o=t[n++];e[s++]=String.fromCharCode((i&31)<<6|o&63)}else if(i>239&&i<365){let o=t[n++],r=t[n++],a=t[n++],c=((i&7)<<18|(o&63)<<12|(r&63)<<6|a&63)-65536;e[s++]=String.fromCharCode(55296+(c>>10)),e[s++]=String.fromCharCode(56320+(c&1023))}else{let o=t[n++],r=t[n++];e[s++]=String.fromCharCode((i&15)<<12|(o&63)<<6|r&63)}}return e.join("")},Me={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();let n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let i=0;i<t.length;i+=3){let o=t[i],r=i+1<t.length,a=r?t[i+1]:0,c=i+2<t.length,d=c?t[i+2]:0,f=o>>2,p=(o&3)<<4|a>>4,m=(a&15)<<2|d>>6,$=d&63;c||($=64,r||(m=64)),s.push(n[f],n[p],n[m],n[$])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Pe(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):wt(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();let n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<t.length;){let o=n[t.charAt(i++)],a=i<t.length?n[t.charAt(i)]:0;++i;let d=i<t.length?n[t.charAt(i)]:64;++i;let p=i<t.length?n[t.charAt(i)]:64;if(++i,o==null||a==null||d==null||p==null)throw new Q;let m=o<<2|a>>4;if(s.push(m),d!==64){let $=a<<4&240|d>>2;if(s.push($),p!==64){let Ot=d<<6&192|p;s.push(Ot)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}},Q=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},At=function(t){let e=Pe(t);return Me.encodeByteArray(e,!0)},X=function(t){return At(t).replace(/\./g,"")},ke=function(t){try{return Me.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};function I(t){return xe(void 0,t)}function xe(t,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:let n=e;return new Date(n.getTime());case Object:t===void 0&&(t={});break;case Array:t=[];break;default:return e}for(let n in e)!e.hasOwnProperty(n)||!Ct(n)||(t[n]=xe(t[n],e[n]));return t}function Ct(t){return t!=="__proto__"}function Z(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}var Rt=()=>Z().__FIREBASE_DEFAULTS__,It=()=>{if(typeof process>"u"||typeof process.env>"u")return;let t=process.env.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Tt=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let e=t&&ke(t[1]);return e&&JSON.parse(e)},Dt=()=>{try{return ve()||Rt()||It()||Tt()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}};var ee=()=>Dt()?.config;var k=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,s))}}};function Ue(){try{return typeof indexedDB=="object"}catch{return!1}}function Fe(){return new Promise((t,e)=>{try{let n=!0,s="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(s);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(s),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{e(i.error?.message||"")}}catch(n){e(n)}})}var Nt="FirebaseError",S=class t extends Error{constructor(e,n,s){super(n),this.code=e,this.customData=s,this.name=Nt,Object.setPrototypeOf(this,t.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,x.prototype.create)}},x=class{constructor(e,n,s){this.service=e,this.serviceName=n,this.errors=s}create(e,...n){let s=n[0]||{},i=`${this.service}/${e}`,o=this.errors[e],r=o?vt(o,s):"Error",a=`${this.serviceName}: ${r} (${i}).`;return new S(i,a,s)}};function vt(t,e){try{let n=0,s="";for(;n<t.length;){let i=t.indexOf("{$",n);if(i===-1){s+=t.substring(n);break}let o=t.indexOf("}",i+2);if(o===-1){s+=t.substring(n);break}let r=t.substring(i+2,o),a=e[r];s+=t.substring(n,i)+(a!=null?String(a):`<${r}?>`),n=o+1}return s}catch{return t}}function H(t,e){if(t===e)return!0;let n=Object.keys(t),s=Object.keys(e);for(let i of n){if(!s.includes(i))return!1;let o=t[i],r=e[i];if(Le(o)&&Le(r)){if(!H(o,r))return!1}else if(o!==r)return!1}for(let i of s)if(!n.includes(i))return!1;return!0}function Le(t){return t!==null&&typeof t=="object"}var Ds=14400*1e3;function Be(t){return t&&t._delegate?t._delegate:t}var O=class{constructor(e,n,s){this.name=e,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};var N="[DEFAULT]";var te=class{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){let s=new k;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{let i=this.getOrInitializeService({instanceIdentifier:n});i&&s.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){let n=this.normalizeInstanceIdentifier(e?.identifier),s=e?.optional??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Pt(e))try{this.getOrInitializeService({instanceIdentifier:N})}catch{}for(let[n,s]of this.instancesDeferred.entries()){let i=this.normalizeInstanceIdentifier(n);try{let o=this.getOrInitializeService({instanceIdentifier:i});s.resolve(o)}catch{}}}}clearInstance(e=N){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=N){return this.instances.has(e)}getOptions(e=N){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:n={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let i=this.getOrInitializeService({instanceIdentifier:s,options:n});for(let[o,r]of this.instancesDeferred.entries()){let a=this.normalizeInstanceIdentifier(o);s===a&&r.resolve(i)}return i}onInit(e,n){let s=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(s)??new Set;i.add(e),this.onInitCallbacks.set(s,i);let o=this.instances.get(s);return o&&e(o,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){let s=this.onInitCallbacks.get(n);if(s)for(let i of s)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:Lt(e),options:n}),this.instances.set(e,s),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=N){return this.component?this.component.multipleInstances?e:N:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function Lt(t){return t===N?void 0:t}function Pt(t){return t.instantiationMode==="EAGER"}var G=class{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let n=new te(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}};var Mt=[],h;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(h||(h={}));var kt={debug:h.DEBUG,verbose:h.VERBOSE,info:h.INFO,warn:h.WARN,error:h.ERROR,silent:h.SILENT},xt=h.INFO,Ut={[h.DEBUG]:"log",[h.VERBOSE]:"log",[h.INFO]:"info",[h.WARN]:"warn",[h.ERROR]:"error"},Ft=(t,e,...n)=>{if(e<t.logLevel)return;let s=new Date().toISOString(),i=Ut[e];if(i)console[i](`[${s}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)},L=class{constructor(e){this.name=e,this._logLevel=xt,this._logHandler=Ft,this._userLogHandler=null,Mt.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in h))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?kt[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,h.DEBUG,...e),this._logHandler(this,h.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,h.VERBOSE,...e),this._logHandler(this,h.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,h.INFO,...e),this._logHandler(this,h.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,h.WARN,...e),this._logHandler(this,h.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,h.ERROR,...e),this._logHandler(this,h.ERROR,...e)}};var Bt=(t,e)=>e.some(n=>t instanceof n),$e,He;function $t(){return $e||($e=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ht(){return He||(He=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var Ge=new WeakMap,se=new WeakMap,Ve=new WeakMap,ne=new WeakMap,oe=new WeakMap;function Gt(t){let e=new Promise((n,s)=>{let i=()=>{t.removeEventListener("success",o),t.removeEventListener("error",r)},o=()=>{n(y(t.result)),i()},r=()=>{s(t.error),i()};t.addEventListener("success",o),t.addEventListener("error",r)});return e.then(n=>{n instanceof IDBCursor&&Ge.set(n,t)}).catch(()=>{}),oe.set(e,t),e}function Vt(t){if(se.has(t))return;let e=new Promise((n,s)=>{let i=()=>{t.removeEventListener("complete",o),t.removeEventListener("error",r),t.removeEventListener("abort",r)},o=()=>{n(),i()},r=()=>{s(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",o),t.addEventListener("error",r),t.addEventListener("abort",r)});se.set(t,e)}var ie={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return se.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Ve.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return y(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function We(t){ie=t(ie)}function Wt(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){let s=t.call(V(this),e,...n);return Ve.set(s,e.sort?e.sort():[e]),y(s)}:Ht().includes(t)?function(...e){return t.apply(V(this),e),y(Ge.get(this))}:function(...e){return y(t.apply(V(this),e))}}function jt(t){return typeof t=="function"?Wt(t):(t instanceof IDBTransaction&&Vt(t),Bt(t,$t())?new Proxy(t,ie):t)}function y(t){if(t instanceof IDBRequest)return Gt(t);if(ne.has(t))return ne.get(t);let e=jt(t);return e!==t&&(ne.set(t,e),oe.set(e,t)),e}var V=t=>oe.get(t);function Ye(t,e,{blocked:n,upgrade:s,blocking:i,terminated:o}={}){let r=indexedDB.open(t,e),a=y(r);return s&&r.addEventListener("upgradeneeded",c=>{s(y(r.result),c.oldVersion,c.newVersion,y(r.transaction),c)}),n&&r.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),a.then(c=>{o&&c.addEventListener("close",()=>o()),i&&c.addEventListener("versionchange",d=>i(d.oldVersion,d.newVersion,d))}).catch(()=>{}),a}var Yt=["get","getKey","getAll","getAllKeys","count"],zt=["put","add","delete","clear"],re=new Map;function je(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(re.get(e))return re.get(e);let n=e.replace(/FromIndex$/,""),s=e!==n,i=zt.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(i||Yt.includes(n)))return;let o=async function(r,...a){let c=this.transaction(r,i?"readwrite":"readonly"),d=c.store;return s&&(d=d.index(a.shift())),(await Promise.all([d[n](...a),i&&c.done]))[0]};return re.set(e,o),o}We(t=>({...t,get:(e,n,s)=>je(e,n)||t.get(e,n,s),has:(e,n)=>!!je(e,n)||t.has(e,n)}));var ce=class{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Jt(n)){let s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}};function Jt(t){return t.getComponent()?.type==="VERSION"}var le="@firebase/app",ze="0.16.6";var A=new L("@firebase/app"),Kt="@firebase/app-compat",qt="@firebase/analytics-compat",Qt="@firebase/analytics",Xt="@firebase/app-check-compat",Zt="@firebase/app-check",en="@firebase/auth",tn="@firebase/auth-compat",nn="@firebase/crashlytics",sn="@firebase/database",on="@firebase/data-connect",rn="@firebase/database-compat",an="@firebase/functions",cn="@firebase/functions-compat",ln="@firebase/installations",un="@firebase/installations-compat",dn="@firebase/messaging",fn="@firebase/messaging-compat",hn="@firebase/performance",pn="@firebase/performance-compat",mn="@firebase/remote-config",gn="@firebase/remote-config-compat",En="@firebase/storage",_n="@firebase/storage-compat",yn="@firebase/firestore",bn="@firebase/ai",Sn="@firebase/firestore-compat",On="firebase";var ue="[DEFAULT]",wn={[le]:"fire-core",[Kt]:"fire-core-compat",[Qt]:"fire-analytics",[qt]:"fire-analytics-compat",[Zt]:"fire-app-check",[Xt]:"fire-app-check-compat",[en]:"fire-auth",[tn]:"fire-auth-compat",[nn]:"fire-cls",[sn]:"fire-rtdb",[on]:"fire-data-connect",[rn]:"fire-rtdb-compat",[an]:"fire-fn",[cn]:"fire-fn-compat",[ln]:"fire-iid",[un]:"fire-iid-compat",[dn]:"fire-fcm",[fn]:"fire-fcm-compat",[hn]:"fire-perf",[pn]:"fire-perf-compat",[mn]:"fire-rc",[gn]:"fire-rc-compat",[En]:"fire-gcs",[_n]:"fire-gcs-compat",[yn]:"fire-fst",[Sn]:"fire-fst-compat",[bn]:"fire-vertex","fire-js":"fire-js",[On]:"fire-js-all"};var W=new Map,An=new Map,de=new Map;function Je(t,e){try{t.container.addComponent(e)}catch(n){A.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function U(t){let e=t.name;if(de.has(e))return A.debug(`There were multiple attempts to register component ${e}.`),!1;de.set(e,t);for(let n of W.values())Je(n,t);for(let n of An.values())Je(n,t);return!0}function Xe(t,e){let n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Ze(t){return t==null?!1:t.settings!==void 0}var Cn={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},w=new x("app","Firebase",Cn);var fe=class{constructor(e,n,s){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new O("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw w.create("app-deleted",{appName:this._name})}};function et(t,e={}){let n=t;typeof e!="object"&&(e={name:e});let s={name:ue,automaticDataCollectionEnabled:!0,...e},i=s.name;if(typeof i!="string"||!i)throw w.create("bad-app-name",{appName:String(i)});if(n||(n=ee()),!n)throw w.create("no-options");let o=W.get(i);if(o)if(H(n,o.options)){if(H(s,o.config))return o;throw w.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(o.config),newValue:JSON.stringify(s)})}else throw w.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(o.options),newValue:JSON.stringify(n)});let r=new G(i);for(let c of de.values())r.addComponent(c);let a=new fe(n,s,r);return W.set(i,a),a}function tt(t=ue){let e=W.get(t);if(!e&&t===ue&&ee())return et();if(!e)throw w.create("no-app",{appName:t});return e}function T(t,e,n){let s=wn[t]??t;n&&(s+=`-${n}`);let i=s.match(/\s|\//),o=e.match(/\s|\//);if(i||o){let r=[`Unable to register library "${s}" with version "${e}":`];i&&r.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&o&&r.push("and"),o&&r.push(`version name "${e}" contains illegal characters (whitespace or "/")`),A.warn(r.join(" "));return}U(new O(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}var Rn="firebase-heartbeat-database",In=1,F="firebase-heartbeat-store",ae=null;function nt(){return ae||(ae=Ye(Rn,In,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(F)}catch(n){console.warn(n)}}}}).catch(t=>{throw w.create("idb-open",{originalErrorMessage:t.message})})),ae}async function Tn(t){try{let n=(await nt()).transaction(F),s=await n.objectStore(F).get(st(t));return await n.done,s}catch(e){if(e instanceof S)A.warn(e.message);else{let n=w.create("idb-get",{originalErrorMessage:e?.message});A.warn(n.message)}}}async function Ke(t,e){try{let s=(await nt()).transaction(F,"readwrite");await s.objectStore(F).put(e,st(t)),await s.done}catch(n){if(n instanceof S)A.warn(n.message);else{let s=w.create("idb-set",{originalErrorMessage:n?.message});A.warn(s.message)}}}function st(t){return`${t.name}!${t.options.appId}`}var Dn=1024,Nn=30,he=class{constructor(e){this.container=e,this._heartbeatsCache=null;let n=this.container.getProvider("app").getImmediate();this._storage=new pe(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){try{let n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=qe();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(i=>i.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:n}),this._heartbeatsCache.heartbeats.length>Nn){let i=Ln(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(i,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){A.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";let e=qe(),{heartbeatsToSend:n,unsentEntries:s}=vn(this._heartbeatsCache.heartbeats),i=X(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=e,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(e){return A.warn(e),""}}};function qe(){return new Date().toISOString().substring(0,10)}function vn(t,e=Dn){let n=[],s=t.slice();for(let i of t){let o=n.find(r=>r.agent===i.agent);if(o){if(o.dates.push(i.date),Qe(n)>e){o.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Qe(n)>e){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}var pe=class{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ue()?Fe().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let n=await Tn(this.app);return n?.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){let s=await this.read();return Ke(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){let s=await this.read();return Ke(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}};function Qe(t){return X(JSON.stringify({version:2,heartbeats:t})).length}function Ln(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let s=1;s<t.length;s++)t[s].date<n&&(n=t[s].date,e=s);return e}function Pn(t){U(new O("platform-logger",e=>new ce(e),"PRIVATE")),U(new O("heartbeat",e=>new he(e),"PRIVATE")),T(le,ze,t),T(le,ze,"esm2020"),T("fire-js","")}Pn("");var Mn="firebase",kn="13.3.0";T(Mn,kn,"app");var it="@firebase/ai",ye="3.1.0";var P="AI",xn="global",Un="firebasevertexai.googleapis.com",Y="v1beta",ot=ye,Fn="gl-js",Bn="hybrid",$n=180*1e3,Hn="gemini-3.5-flash-lite";var u=class t extends S{constructor(e,n,s){let i=P,o=`${i}/${e}`,r=`${i}: ${n} (${o})`;super(e,r),this.code=e,this.customErrorData=s,Error.captureStackTrace&&Error.captureStackTrace(this,t),Object.setPrototypeOf(this,t.prototype),this.toString=()=>r}};var rt=["user","model","function","system"];var ft={HARM_SEVERITY_NEGLIGIBLE:"HARM_SEVERITY_NEGLIGIBLE",HARM_SEVERITY_LOW:"HARM_SEVERITY_LOW",HARM_SEVERITY_MEDIUM:"HARM_SEVERITY_MEDIUM",HARM_SEVERITY_HIGH:"HARM_SEVERITY_HIGH",HARM_SEVERITY_UNSUPPORTED:"HARM_SEVERITY_UNSUPPORTED"};var E={STOP:"STOP",MAX_TOKENS:"MAX_TOKENS",SAFETY:"SAFETY",RECITATION:"RECITATION",OTHER:"OTHER",BLOCKLIST:"BLOCKLIST",PROHIBITED_CONTENT:"PROHIBITED_CONTENT",SPII:"SPII",MALFORMED_FUNCTION_CALL:"MALFORMED_FUNCTION_CALL",IMAGE_SAFETY:"IMAGE_SAFETY",IMAGE_PROHIBITED_CONTENT:"IMAGE_PROHIBITED_CONTENT",IMAGE_OTHER:"IMAGE_OTHER",NO_IMAGE:"NO_IMAGE",IMAGE_RECITATION:"IMAGE_RECITATION",LANGUAGE:"LANGUAGE",UNEXPECTED_TOOL_CALL:"UNEXPECTED_TOOL_CALL",TOO_MANY_TOOL_CALLS:"TOO_MANY_TOOL_CALLS",MISSING_THOUGHT_SIGNATURE:"MISSING_THOUGHT_SIGNATURE",MALFORMED_RESPONSE:"MALFORMED_RESPONSE"};var Gn={TEXT:"TEXT",IMAGE:"IMAGE",AUDIO:"AUDIO"},_={PREFER_ON_DEVICE:"prefer_on_device",ONLY_ON_DEVICE:"only_on_device",ONLY_IN_CLOUD:"only_in_cloud",PREFER_IN_CLOUD:"prefer_in_cloud"},D={ON_DEVICE:"on_device",IN_CLOUD:"in_cloud"};var l={ERROR:"error",REQUEST_ERROR:"request-error",RESPONSE_ERROR:"response-error",FETCH_ERROR:"fetch-error",SESSION_CLOSED:"session-closed",INVALID_CONTENT:"invalid-content",API_NOT_ENABLED:"api-not-enabled",ALREADY_INITIALIZED:"already-initialized",INVALID_SCHEMA:"invalid-schema",NO_API_KEY:"no-api-key",NO_APP_ID:"no-app-id",NO_MODEL:"no-model",NO_PROJECT_ID:"no-project-id",PARSE_FAILED:"parse-failed",UNSUPPORTED:"unsupported"};var R={AGENT_PLATFORM:"AGENT_PLATFORM",GOOGLE_AI:"GOOGLE_AI"};var z=class{constructor(e){this.backendType=e}},M=class extends z{constructor(){super(R.GOOGLE_AI)}_getModelPath(e,n){return`/${Y}/projects/${e}/${n}`}_getTemplatePath(e,n){return`/${Y}/projects/${e}/templates/${n}`}},J=class extends z{constructor(e){super(R.AGENT_PLATFORM),this.location=xn,e&&(this.location=e)}_getModelPath(e,n){return`/${Y}/projects/${e}/locations/${this.location}/${n}`}_getTemplatePath(e,n){return`/${Y}/projects/${e}/locations/${this.location}/templates/${n}`}};function Vn(t){if(t instanceof M)return`${P}/googleai`;if(t instanceof J)return`${P}/agentplatform/${t.location}`;throw new u(l.ERROR,`Invalid backend: ${JSON.stringify(t.backendType)}`)}function Wn(t){let e=t.split("/");if(e[0]!==P)throw new u(l.ERROR,`Invalid instance identifier, unknown prefix '${e[0]}'`);switch(e[1]){case"agentplatform":let s=e[2];if(!s)throw new u(l.ERROR,`Invalid instance identifier, unknown location '${t}'`);return new J(s);case"googleai":return new M;default:throw new u(l.ERROR,`Invalid instance identifier string: '${t}'`)}}var g=new L("@firebase/ai"),C;(function(t){t.UNAVAILABLE="unavailable",t.DOWNLOADABLE="downloadable",t.DOWNLOADING="downloading",t.AVAILABLE="available"})(C||(C={}));var ht={type:"text",languages:["en"]},me=[ht,{type:"image"}],ge=[ht],K=class t{constructor(e,n,s){this.languageModelProvider=e,this.mode=n,this.downloadPromise=null,this.onDeviceParams={createOptions:{expectedInputs:me,expectedOutputs:ge}},s&&(this.onDeviceParams=s,this.onDeviceParams.createOptions?(this.onDeviceParams.createOptions.expectedInputs||(this.onDeviceParams.createOptions.expectedInputs=me),this.onDeviceParams.createOptions.expectedOutputs||(this.onDeviceParams.createOptions.expectedOutputs=ge)):this.onDeviceParams.createOptions={expectedInputs:me,expectedOutputs:ge})}async isAvailable(e){if(!this.mode)return g.debug("On-device inference unavailable because mode is undefined."),!1;if(this.mode===_.ONLY_IN_CLOUD)return g.debug('On-device inference unavailable because mode is "only_in_cloud".'),!1;let n=await this.languageModelProvider?.availability(this.onDeviceParams.createOptions);if(this.mode===_.ONLY_ON_DEVICE){if(n===C.UNAVAILABLE)throw new u(l.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(n===C.DOWNLOADABLE||n===C.DOWNLOADING){g.debug("Waiting for download of LanguageModel to complete.");try{await this.downloadPromise}catch(s){throw new u(l.ERROR,s.message)}return!0}return!0}return n!==C.AVAILABLE?(g.debug(`On-device inference unavailable because availability is "${n}".`),!1):t.isOnDeviceRequest(e)?!0:(g.debug("On-device inference unavailable because request is incompatible."),!1)}async generateContent(e){let n=await this.createSession(),s=await Promise.all(e.contents.map(t.toLanguageModelMessage)),i=await n.prompt(s,this.onDeviceParams.promptOptions);return t.toResponse(i)}async generateContentStream(e){let n=await this.createSession(),s=await Promise.all(e.contents.map(t.toLanguageModelMessage)),i=n.promptStreaming(s,this.onDeviceParams.promptOptions);return t.toStreamResponse(i)}async countTokens(e){throw new u(l.REQUEST_ERROR,"Count Tokens is not yet available for on-device model.")}static isOnDeviceRequest(e){if(e.contents.length===0)return g.debug("Empty prompt rejected for on-device inference."),!1;for(let n of e.contents){if(n.parts.some(s=>"functionResponse"in s))return g.debug("Content with a function response part rejected for on-device inference."),!1;for(let s of n.parts)if("inlineData"in s&&s.inlineData&&t.SUPPORTED_MIME_TYPES.indexOf(s.inlineData.mimeType)===-1)return g.debug(`Unsupported mime type "${s.inlineData.mimeType}" rejected for on-device inference.`),!1}return!0}async downloadIfAvailable(e){let n=await this.languageModelProvider?.availability(this.onDeviceParams.createOptions);return(n===C.DOWNLOADABLE||n===C.DOWNLOADING)&&this.download(e),n}download(e){if(this.downloadPromise)return;let n={...this.onDeviceParams.createOptions};n&&!n.monitor&&e&&(n.monitor=s=>{s.addEventListener("downloadprogress",i=>{e(i.loaded)})}),this.downloadPromise=this.languageModelProvider?.create(n).finally(()=>{this.downloadPromise=null})}static async toLanguageModelMessage(e){let n=await Promise.all(e.parts.map(t.toLanguageModelMessageContent));return{role:t.toLanguageModelMessageRole(e.role),content:n}}static async toLanguageModelMessageContent(e){if("text"in e&&typeof e.text=="string")return{type:"text",value:e.text};if("inlineData"in e&&e.inlineData){let s=await(await fetch(`data:${e.inlineData.mimeType};base64,${e.inlineData.data}`)).blob();return{type:"image",value:await createImageBitmap(s)}}throw new u(l.REQUEST_ERROR,"Processing of this Part type is not currently supported.")}static toLanguageModelMessageRole(e){return e==="model"?"assistant":"user"}async createSession(){if(!this.languageModelProvider)throw new u(l.UNSUPPORTED,"Chrome AI requested for unsupported browser version.");let e=await this.languageModelProvider.create(this.onDeviceParams.createOptions);return this.oldSession&&this.oldSession.destroy(),this.oldSession=e,e}static toResponse(e){return{json:async()=>({candidates:[{content:{parts:[{text:e}]}}]})}}static toStreamResponse(e){let n=new TextEncoder;return{body:e.pipeThrough(new TransformStream({transform(s,i){let o=JSON.stringify({candidates:[{content:{role:"model",parts:[{text:s}]}}]});i.enqueue(n.encode(`data: ${o}

`))}}))}}};K.SUPPORTED_MIME_TYPES=["image/jpeg","image/png"];function jn(t,e,n){let i=(e||Z()).LanguageModel;if(i&&t)return new K(i,t,n)}var be=class{constructor(e,n,s,i,o){this.app=e,this.backend=n,this.chromeAdapterFactory=o;let r=i?.getImmediate({optional:!0}),a=s?.getImmediate({optional:!0});this.auth=a||null,this.appCheck=r||null}_delete(){return Promise.resolve()}set options(e){this._options=e}get options(){return this._options}};function Yn(t,{instanceIdentifier:e}){if(!e)throw new u(l.ERROR,"AIService instance identifier is undefined.");let n=Wn(e),s=t.getProvider("app").getImmediate(),i=t.getProvider("auth-internal"),o=t.getProvider("app-check-internal");return new be(s,n,i,o,jn)}function zn(t){if(t.app?.options?.apiKey)if(t.app?.options?.projectId){if(!t.app?.options?.appId)throw new u(l.NO_APP_ID,'The "appId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid app ID.')}else throw new u(l.NO_PROJECT_ID,'The "projectId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid project ID.');else throw new u(l.NO_API_KEY,'The "apiKey" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid API key.');let e={apiKey:t.app.options.apiKey,project:t.app.options.projectId,appId:t.app.options.appId,automaticDataCollectionEnabled:t.app.automaticDataCollectionEnabled,backend:t.backend};if(Ze(t.app)&&t.app.settings.appCheckToken){let n=t.app.settings.appCheckToken;e.getAppCheckToken=()=>Promise.resolve({token:n})}else t.appCheck&&(t.options?.useLimitedUseAppCheckTokens?e.getAppCheckToken=()=>t.appCheck.getLimitedUseToken():e.getAppCheckToken=()=>t.appCheck.getToken());return t.auth&&(e.getAuthToken=()=>t.auth.getToken()),e}var Se=class t{constructor(e,n){this._apiSettings=zn(e),this.model=t.normalizeModelName(n,this._apiSettings.backend.backendType)}static normalizeModelName(e,n){return n===R.GOOGLE_AI?t.normalizeGoogleAIModelName(e):t.normalizeVertexAIModelName(e)}static normalizeGoogleAIModelName(e){return`models/${e}`}static normalizeVertexAIModelName(e){let n;return e.includes("/")?e.startsWith("models/")?n=`publishers/google/${e}`:n=e:n=`publishers/google/models/${e}`,n}};var Jn="Timeout has expired.",Ee="AbortError",Oe=class{constructor(e){this.params=e}toString(){let e=new URL(this.baseUrl);return e.pathname=this.pathname,e.search=this.queryParams.toString(),e.toString()}get pathname(){return this.params.templateId?`${this.params.apiSettings.backend._getTemplatePath(this.params.apiSettings.project,this.params.templateId)}:${this.params.task}`:`${this.params.apiSettings.backend._getModelPath(this.params.apiSettings.project,this.params.model)}:${this.params.task}`}get baseUrl(){return this.params.singleRequestOptions?.baseUrl??`https://${Un}`}get queryParams(){let e=new URLSearchParams;return this.params.stream&&e.set("alt","sse"),e}};function Kn(t){let e=[];return e.push(`${Fn}/${ot}`),e.push(`fire/${ot}`),(t.params.apiSettings.inferenceMode===_.PREFER_ON_DEVICE||t.params.apiSettings.inferenceMode===_.PREFER_IN_CLOUD)&&e.push(Bn),e.join(" ")}async function qn(t){let e=new Headers;if(e.append("Content-Type","application/json"),e.append("x-goog-api-client",Kn(t)),e.append("x-goog-api-key",t.params.apiSettings.apiKey),t.params.apiSettings.automaticDataCollectionEnabled&&e.append("X-Firebase-Appid",t.params.apiSettings.appId),t.params.apiSettings.getAppCheckToken){let n=await t.params.apiSettings.getAppCheckToken();n&&(e.append("X-Firebase-AppCheck",n.token),n.error&&g.warn(`Unable to obtain a valid App Check token: ${n.error.message}`))}if(t.params.apiSettings.getAuthToken){let n=await t.params.apiSettings.getAuthToken();n&&e.append("Authorization",`Firebase ${n.accessToken}`)}return e}async function Re(t,e){let n=new Oe(t),s,i=t.singleRequestOptions?.signal,o=t.singleRequestOptions?.timeout!=null&&t.singleRequestOptions.timeout>=0?t.singleRequestOptions.timeout:$n,r=new AbortController,a=setTimeout(()=>{r.abort(new DOMException(Jn,Ee)),g.debug(`Aborting request to ${n} due to timeout (${o}ms)`)},o),c=AbortSignal.any(i?[i,r.signal]:[r.signal]);if(i&&i.aborted)throw clearTimeout(a),new DOMException(i.reason??"Aborted externally before fetch",Ee);try{let d={method:"POST",headers:await qn(n),signal:c,body:e};if(s=await fetch(n.toString(),d),!s.ok){let f="",p;try{let m=await s.json();f=m.error.message,m.error.details&&(f+=` ${JSON.stringify(m.error.details)}`,p=m.error.details)}catch{}throw s.status===403&&p&&p.some(m=>m.reason==="SERVICE_DISABLED")&&p.some(m=>m.links?.[0]?.description.includes("Google developers console API activation"))?new u(l.API_NOT_ENABLED,`The Firebase AI SDK requires the Firebase AI API ('firebasevertexai.googleapis.com') to be enabled in your Firebase project. Enable this API by visiting the Firebase Console at https://console.firebase.google.com/project/${n.params.apiSettings.project}/ailogic/ and clicking "Get started". If you enabled this API recently, wait a few minutes for the action to propagate to our systems and then retry.`,{status:s.status,statusText:s.statusText,errorDetails:p}):new u(l.FETCH_ERROR,`Error fetching from ${n}: [${s.status} ${s.statusText}] ${f}`,{status:s.status,statusText:s.statusText,errorDetails:p})}}catch(d){let f=d;throw d.code!==l.FETCH_ERROR&&d.code!==l.API_NOT_ENABLED&&d instanceof Error&&d.name!==Ee&&(f=new u(l.ERROR,`Error fetching from ${n.toString()}: ${d.message}`),f.stack=d.stack),f}finally{clearTimeout(a)}return s}function j(t){if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&g.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),mt(t.candidates[0]))throw new u(l.RESPONSE_ERROR,`Response error: ${v(t)}. Response body stored in error.response`,{response:t});return!0}else return!1}function b(t){return"type"in t&&t.type?t:t.text!==void 0?{...t,type:"text"}:t.inlineData!==void 0?{...t,type:"inlineData"}:t.functionCall!==void 0?{...t,type:"functionCall"}:t.functionResponse!==void 0?{...t,type:"functionResponse"}:t.fileData!==void 0?{...t,type:"fileData"}:t.executableCode!==void 0?{...t,type:"executableCode"}:t.codeExecutionResult!==void 0?{...t,type:"codeExecutionResult"}:t}function q(t,e=D.IN_CLOUD){if(t.candidates?.[0]&&!t.candidates[0].hasOwnProperty("index")&&(t.candidates[0].index=0),t.candidates)for(let s of t.candidates)s.content?.parts&&(s.content.parts=s.content.parts.map(b));let n=Qn(t);return n.inferenceSource=e,n}function Qn(t){return t.text=()=>{if(j(t))return at(t,e=>!("thought"in e&&e.thought));if(t.promptFeedback)throw new u(l.RESPONSE_ERROR,`Text not available. ${v(t)}`,{response:t});return""},t.thoughtSummary=()=>{if(j(t)){let e=at(t,n=>!!("thought"in n&&n.thought));return e===""?void 0:e}else if(t.promptFeedback)throw new u(l.RESPONSE_ERROR,`Thought summary not available. ${v(t)}`,{response:t})},t.inlineDataParts=()=>{if(j(t))return Xn(t);if(t.promptFeedback)throw new u(l.RESPONSE_ERROR,`Data not available. ${v(t)}`,{response:t})},t.functionCalls=()=>{if(j(t))return pt(t);if(t.promptFeedback)throw new u(l.RESPONSE_ERROR,`Function call not available. ${v(t)}`,{response:t})},t}function at(t,e){let n=[];if(t.candidates?.[0].content?.parts)for(let s of t.candidates?.[0].content?.parts){let i=b(s);i.type==="text"&&e(i)&&n.push(i.text)}return n.length>0?n.join(""):""}function pt(t){if(!t)return;let e=[];if(t.candidates?.[0].content?.parts)for(let n of t.candidates?.[0].content?.parts){let s=b(n);s.type==="functionCall"&&e.push(s.functionCall)}if(e.length>0)return e}function Xn(t){let e=[];if(t.candidates?.[0].content?.parts)for(let n of t.candidates?.[0].content?.parts){let s=b(n);s.type==="inlineData"&&e.push(s)}if(e.length>0)return e}var Zn=[E.RECITATION,E.SAFETY,E.BLOCKLIST,E.PROHIBITED_CONTENT,E.SPII,E.MALFORMED_FUNCTION_CALL,E.IMAGE_SAFETY,E.IMAGE_PROHIBITED_CONTENT,E.IMAGE_OTHER,E.NO_IMAGE,E.IMAGE_RECITATION,E.LANGUAGE,E.UNEXPECTED_TOOL_CALL,E.TOO_MANY_TOOL_CALLS,E.MISSING_THOUGHT_SIGNATURE,E.MALFORMED_RESPONSE];function mt(t){return!!t.finishReason&&Zn.some(e=>e===t.finishReason)}function v(t){let e="";if((!t.candidates||t.candidates.length===0)&&t.promptFeedback)e+="Response was blocked",t.promptFeedback?.blockReason&&(e+=` due to ${t.promptFeedback.blockReason}`),t.promptFeedback?.blockReasonMessage&&(e+=`: ${t.promptFeedback.blockReasonMessage}`);else if(t.candidates?.[0]){let n=t.candidates[0];mt(n)&&(e+=`Candidate was blocked due to ${n.finishReason}`,n.finishMessage&&(e+=`: ${n.finishMessage}`))}return e}function Ie(t){if(t!=null){if(typeof t=="string")return{role:"system",parts:[{type:"text",text:t}]};if(t.type==="text"||"text"in t&&typeof t.text=="string")return{role:"system",parts:[I(b(t))]};if(t.parts){let e=t.parts.map(n=>I(b(n)));return t.role?{...t,parts:e}:{role:"system",parts:e}}}}function B(t){let e=[];if(typeof t=="string")e=[{type:"text",text:t}];else for(let n of t)typeof n=="string"?e.push({type:"text",text:n}):e.push(I(b(n)));return es(e)}function es(t){let e={role:"user",parts:[]},n=!1,s=!1;for(let i of t)i.type==="functionResponse"||"functionResponse"in i?s=!0:n=!0,e.parts.push(i);if(n&&s)throw new u(l.INVALID_CONTENT,"Within a single message, FunctionResponse cannot be mixed with other type of Part in the request for sending chat message.");if(!n&&!s)throw new u(l.INVALID_CONTENT,"No Content is provided for sending chat message.");return e}function _e(t){let e;if(t.contents){let n=t;e={...n,contents:n.contents.map(s=>({...s,parts:s.parts?s.parts.map(b):[]}))}}else e={contents:[B(t)]};return t.systemInstruction&&(e.systemInstruction=Ie(t.systemInstruction)),e}function ts(t){return t.parts&&Array.isArray(t.parts)?{...t,parts:t.parts.map(Te)}:t}function Te(t){let e;if("type"in t){let{type:n,...s}=t;e=s}else e=t;return e.functionResponse&&(e={...e,functionResponse:ts(e.functionResponse)}),e}function De(t){return t.parts?{...t,parts:t.parts.map(Te)}:t}function gt(t){return t==null||typeof t=="string"?t:"parts"in t&&Array.isArray(t.parts)?De(t):Te(t)}function Et(t){let e={...t};return e.contents&&(e.contents=e.contents.map(De)),e.systemInstruction&&(e.systemInstruction=gt(e.systemInstruction)),e}function ns(t){let e={...t};return e.contents&&(e.contents=e.contents.map(De)),e.systemInstruction&&(e.systemInstruction=gt(e.systemInstruction)),e}function _t(t){if(t.safetySettings?.forEach(e=>{if(e.method)throw new u(l.UNSUPPORTED,"SafetySetting.method is not supported in the the Gemini Developer API. Please remove this property.")}),t.generationConfig?.topK){let e=Math.round(t.generationConfig.topK);e!==t.generationConfig.topK&&(g.warn("topK in GenerationConfig has been rounded to the nearest integer to match the format for requests to the Gemini Developer API."),t.generationConfig.topK=e)}return t}function Ne(t){return{candidates:t.candidates?is(t.candidates):void 0,promptFeedback:t.promptFeedback?os(t.promptFeedback):void 0,usageMetadata:t.usageMetadata}}function ss(t,e){return{generateContentRequest:{model:e,...t}}}function is(t){let e=[],n;return e&&t.forEach(s=>{let i;if(s.citationMetadata&&(i={citations:s.citationMetadata.citationSources}),s.safetyRatings&&(n=s.safetyRatings.map(r=>({...r,severity:r.severity??ft.HARM_SEVERITY_UNSUPPORTED,probabilityScore:r.probabilityScore??0,severityScore:r.severityScore??0}))),s.content?.parts?.some(r=>"videoMetadata"in r&&r.videoMetadata))throw new u(l.UNSUPPORTED,"Part.videoMetadata is not supported in the Gemini Developer API. Please remove this property.");let o={index:s.index,content:s.content,finishReason:s.finishReason,finishMessage:s.finishMessage,safetyRatings:n,citationMetadata:i,groundingMetadata:s.groundingMetadata,urlContextMetadata:s.urlContextMetadata};e.push(o)}),e}function os(t){let e=[];return(t.safetyRatings??[]).forEach(s=>{e.push({category:s.category,probability:s.probability,severity:s.severity??ft.HARM_SEVERITY_UNSUPPORTED,probabilityScore:s.probabilityScore??0,severityScore:s.severityScore??0,blocked:s.blocked})}),{blockReason:t.blockReason,safetyRatings:e,blockReasonMessage:t.blockReasonMessage}}var ct=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;async function rs(t,e,n){let s=t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),i=us(s),[o,r]=i.tee(),{response:a,firstValue:c}=await as(r,e,n);return{stream:ls(o,e,n),response:a,firstValue:c}}async function as(t,e,n){let[s,i]=t.tee(),o=s.getReader(),{value:r}=await o.read();return{firstValue:r,response:cs(i,e,n)}}async function cs(t,e,n){let s=[],i=t.getReader();for(;;){let{done:o,value:r}=await i.read();if(o){let a=ds(s);return e.backend.backendType===R.GOOGLE_AI&&(a=Ne(a)),q(a,n)}s.push(r)}}async function*ls(t,e,n){let s=t.getReader();for(;;){let{value:i,done:o}=await s.read();if(o)break;let r;e.backend.backendType===R.GOOGLE_AI?r=q(Ne(i),n):r=q(i,n);let a=r.candidates?.[0];!a?.content?.parts&&!a?.finishReason&&!a?.citationMetadata&&!a?.urlContextMetadata||(yield r)}}function us(t){let e=t.getReader();return new ReadableStream({start(s){let i="";return o();function o(){return e.read().then(({value:r,done:a})=>{if(a){if(i.trim()){s.error(new u(l.PARSE_FAILED,"Failed to parse stream"));return}s.close();return}i+=r;let c=i.match(ct),d;for(;c;){try{d=JSON.parse(c[1])}catch{s.error(new u(l.PARSE_FAILED,`Error parsing JSON response: "${c[1]}`));return}s.enqueue(d),i=i.substring(c[0].length),c=i.match(ct)}return o()})}}})}function ds(t){let n={promptFeedback:t[t.length-1]?.promptFeedback};for(let s of t)if(s.candidates)for(let i of s.candidates){let o=i.index||0;n.candidates||(n.candidates=[]),n.candidates[o]||(n.candidates[o]={index:i.index}),n.candidates[o].citationMetadata=i.citationMetadata,n.candidates[o].finishReason=i.finishReason,n.candidates[o].finishMessage=i.finishMessage,n.candidates[o].safetyRatings=i.safetyRatings,n.candidates[o].groundingMetadata=i.groundingMetadata;let r=i.urlContextMetadata;if(typeof r=="object"&&r!==null&&Object.keys(r).length>0&&(n.candidates[o].urlContextMetadata=r),i.content){if(!i.content.parts)continue;n.candidates[o].content||(n.candidates[o].content={role:i.content.role||"user",parts:[]});for(let a of i.content.parts){if("text"in a&&a.text==="")continue;if(Object.keys(a).length===0)throw new u(l.INVALID_CONTENT,"Part should have at least one property, but there are none. This is likely caused by a malformed response from the backend.");let c=b({...a});Object.keys(c).length>0&&n.candidates[o].content.parts.push(c)}}}return n}var fs=[l.FETCH_ERROR,l.ERROR,l.API_NOT_ENABLED];async function yt(t,e,n,s){if(!e)return{response:await s(),inferenceSource:D.IN_CLOUD};switch(e.mode){case _.ONLY_ON_DEVICE:if(await e.isAvailable(t))return{response:await n(),inferenceSource:D.ON_DEVICE};throw new u(l.UNSUPPORTED,"Inference mode is ONLY_ON_DEVICE, but an on-device model is not available.");case _.ONLY_IN_CLOUD:return{response:await s(),inferenceSource:D.IN_CLOUD};case _.PREFER_IN_CLOUD:try{return{response:await s(),inferenceSource:D.IN_CLOUD}}catch(i){if(i instanceof u&&fs.includes(i.code)&&await e.isAvailable(t))return{response:await n(),inferenceSource:D.ON_DEVICE};throw i}case _.PREFER_ON_DEVICE:return await e.isAvailable(t)?{response:await n(),inferenceSource:D.ON_DEVICE}:{response:await s(),inferenceSource:D.IN_CLOUD};default:throw new u(l.ERROR,`Unexpected infererence mode: ${e.mode}`)}}async function hs(t,e,n,s){return n=Et(n),t.backend.backendType===R.GOOGLE_AI&&(n=_t(n)),Re({task:"streamGenerateContent",model:e,apiSettings:t,stream:!0,singleRequestOptions:s},JSON.stringify(n))}async function bt(t,e,n,s,i){let o=await yt(n,s,()=>s.generateContentStream(n),()=>hs(t,e,n,i));return rs(o.response,t,o.inferenceSource)}async function ps(t,e,n,s){return n=Et(n),t.backend.backendType===R.GOOGLE_AI&&(n=_t(n)),Re({model:e,task:"generateContent",apiSettings:t,stream:!1,singleRequestOptions:s},JSON.stringify(n))}async function St(t,e,n,s,i){let o=await yt(n,s,()=>s.generateContent(n),()=>ps(t,e,n,i)),r=await ms(o.response,t);return{response:q(r,o.inferenceSource)}}async function ms(t,e){let n=await t.json();return e.backend.backendType===R.GOOGLE_AI?Ne(n):n}var lt="SILENT_ERROR",ut=10,we=class{constructor(e,n,s){this.params=n,this.requestOptions=s,this._history=[],this._sendPromise=Promise.resolve(),this._apiSettings=e}async getHistory(){return await this._sendPromise,I(this._history).map(e=>({...e,parts:e.parts?e.parts.map(b):[]}))}async _sendMessage(e,n){let s={};await this._sendPromise;let i=[];return this._sendPromise=this._sendPromise.then(async()=>{let o,r=0,a=this.requestOptions?.maxSequentialFunctionCalls??ut;do{let c;if(o){r++;let p=await this._callFunctionsAsNeeded(o);c=B(p)}else c=B(e);let d=this._formatRequest(c,[...i]);i.push(c);let f=await this._callGenerateContent(d,n);if(f)if(s=f,o=this._getCallableFunctionCalls(f.response),f.response.candidates&&f.response.candidates.length>0){let p={parts:f.response.candidates?.[0].content.parts||[],role:f.response.candidates?.[0].content.role||"model"};i.push(I(p))}else{let p=v(f.response);p&&g.warn(`sendMessage() was unsuccessful. ${p}. Inspect response object for details.`)}else o=void 0}while(o&&r<a);o&&r>=a&&g.warn(`Automatic function calling exceeded the limit of ${a} function calls. Returning last model response.`)}),await this._sendPromise,this._history=this._history.concat(i),s}async _sendMessageStream(e,n){await this._sendPromise;let s=[],o=(async()=>{let r,a=0,c=this.requestOptions?.maxSequentialFunctionCalls??ut,d;do{let f;if(r){a++;let m=await this._callFunctionsAsNeeded(r);f=B(m)}else f=B(e);let p=this._formatRequest(f,[...s]);if(s.push(f),d=await this._callGenerateContentStream(p,n),r=this._getCallableFunctionCalls(d.firstValue),r&&d.firstValue&&d.firstValue.candidates&&d.firstValue.candidates.length>0){let m={...d.firstValue.candidates[0].content};m.role||(m.role="model"),s.push(m)}}while(r&&a<c);return r&&a>=c&&g.warn(`Automatic function calling exceeded the limit of ${c} function calls. Returning last model response.`),{stream:d.stream,response:d.response}})();return this._sendPromise=this._sendPromise.then(async()=>o).catch(r=>{throw new Error(lt)}).then(r=>r.response).then(r=>{if(r.candidates&&r.candidates.length>0){this._history=this._history.concat(s);let a={...r.candidates[0].content};a.role||(a.role="model"),this._history.push(I(a))}else{let a=v(r);a&&g.warn(`sendMessageStream() was unsuccessful. ${a}. Inspect response object for details.`)}}).catch(r=>{r.message!==lt&&r.name!=="AbortError"&&g.error(r)}),o}_getCallableFunctionCalls(e){let n=this.params?.tools?.find(i=>i.functionDeclarations);if(!n?.functionDeclarations)return;let s=pt(e);if(s){for(let i of s)if(!n.functionDeclarations?.some(r=>r.name===i.name&&typeof r.functionReference=="function"))return;return s}}async _callFunctionsAsNeeded(e){let n=[],s=[],i=this.params?.tools?.find(o=>o.functionDeclarations);if(i&&i.functionDeclarations){for(let r of e){let a=i.functionDeclarations.find(c=>c.name===r.name);if(a?.functionReference){let c=Promise.resolve(a.functionReference(r.args)).catch(d=>{let f=new u(l.ERROR,`Error in user-defined function "${a.name}": ${d.message}`);throw f.stack=d.stack,f});n.push({name:r.name,id:r.id,results:c}),s.push(c)}}await Promise.all(s);let o=[];for(let{name:r,id:a,results:c}of n){let d={name:r,response:await c};a&&(d.id=a),o.push({type:"functionResponse",functionResponse:d})}return o}else throw new u(l.REQUEST_ERROR,'No function declarations were provided in "tools".')}};var gs=["text","inlineData","functionCall","functionResponse","thought","thoughtSignature"],Es={user:["text","inlineData","functionResponse"],function:["functionResponse"],model:["text","functionCall","thought","thoughtSignature"],system:["text"]},dt={user:["model"],function:["model"],model:["user","function"],system:[]};function _s(t){let e=null;for(let n of t){let{role:s,parts:i}=n;if(!e&&s!=="user")throw new u(l.INVALID_CONTENT,`First Content should be with role 'user', got ${s}`);if(!rt.includes(s))throw new u(l.INVALID_CONTENT,`Each item should include role field. Got ${s} but valid roles are: ${JSON.stringify(rt)}`);if(!Array.isArray(i))throw new u(l.INVALID_CONTENT,"Content should have 'parts' property with an array of Parts");if(i.length===0)throw new u(l.INVALID_CONTENT,"Each Content should have at least one part");let o={text:0,inlineData:0,functionCall:0,functionResponse:0,thought:0,thoughtSignature:0,fileData:0,executableCode:0,codeExecutionResult:0};for(let a of i){if(a.type)o[a.type]+=1;else for(let c of["text","inlineData","functionCall","functionResponse","fileData","executableCode","codeExecutionResult"])c in a&&(o[c]+=1);"thought"in a&&a.thought&&(o.thought+=1),"thoughtSignature"in a&&a.thoughtSignature&&(o.thoughtSignature+=1)}let r=Es[s];for(let a of gs)if(!r.includes(a)&&o[a]>0)throw new u(l.INVALID_CONTENT,`Content with role '${s}' can't contain '${a}' part`);if(e&&!dt[s].includes(e.role))throw new u(l.INVALID_CONTENT,`Content with role '${s}' can't follow '${e.role}'. Valid previous roles: ${JSON.stringify(dt)}`);e=n}}var Ae=class extends we{constructor(e,n,s,i,o){super(e,i,o),this.model=n,this.chromeAdapter=s,this.params=i,this.requestOptions=o,i?.history&&(_s(i.history),this._history=I(i.history)),this.params?.systemInstruction!=null&&(this.params={...this.params,systemInstruction:Ie(this.params.systemInstruction)})}_formatRequest(e,n){return{safetySettings:this.params?.safetySettings,generationConfig:this.params?.generationConfig,tools:this.params?.tools,toolConfig:this.params?.toolConfig,systemInstruction:this.params?.systemInstruction,contents:[...this._history,...n,e]}}_callGenerateContent(e,n){return St(this._apiSettings,this.model,e,this.chromeAdapter,{...this.requestOptions,...n})}_callGenerateContentStream(e,n){return bt(this._apiSettings,this.model,e,this.chromeAdapter,{...this.requestOptions,...n})}async sendMessage(e,n){return this._sendMessage(e,n)}async sendMessageStream(e,n){return this._sendMessageStream(e,n)}};async function ys(t,e,n,s){n=ns(n);let i="";if(t.backend.backendType===R.GOOGLE_AI){let r=ss(n,e);i=JSON.stringify(r)}else i=JSON.stringify(n);return(await Re({model:e,task:"countTokens",apiSettings:t,stream:!1,singleRequestOptions:s},i)).json()}async function bs(t,e,n,s,i){if(s?.mode===_.ONLY_ON_DEVICE)throw new u(l.UNSUPPORTED,"countTokens() is not supported for on-device models.");return ys(t,e,n,i)}var Ce=class extends Se{constructor(e,n,s,i){super(e,n.model),this.chromeAdapter=i,this.generationConfig=n.generationConfig||{},Ss(this.generationConfig),this.safetySettings=n.safetySettings||[],this.tools=n.tools,this.toolConfig=n.toolConfig,this.systemInstruction=Ie(n.systemInstruction),this.requestOptions=s||{}}async initializeDeviceModel(e){if(!this.chromeAdapter||this.chromeAdapter.mode===_.ONLY_IN_CLOUD)return;if(await this.chromeAdapter.downloadIfAvailable(e)===C.UNAVAILABLE){let s=new u(l.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(this.chromeAdapter.mode===_.ONLY_ON_DEVICE)throw s;g.debug(s.message)}await this.chromeAdapter.downloadPromise}async generateContent(e,n){let s=_e(e);return St(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...s},this.chromeAdapter,{...this.requestOptions,...n})}async generateContentStream(e,n){let s=_e(e),{stream:i,response:o}=await bt(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...s},this.chromeAdapter,{...this.requestOptions,...n});return{stream:i,response:o}}startChat(e){return new Ae(this._apiSettings,this.model,this.chromeAdapter,{tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,generationConfig:this.generationConfig,safetySettings:this.safetySettings,...e},this.requestOptions)}async countTokens(e,n){let s=_e(e);return bs(this._apiSettings,this.model,s,this.chromeAdapter,{...this.requestOptions,...n})}};function Ss(t){if(t.thinkingConfig?.thinkingBudget!=null&&t.thinkingConfig?.thinkingLevel)throw new u(l.UNSUPPORTED,"Cannot set both thinkingBudget and thinkingLevel in a config.");if(t.responseSchema!=null&&t.responseJsonSchema!=null)throw new u(l.UNSUPPORTED,"Cannot set both responseSchema and responseJsonSchema in a config.");if((t.responseSchema!=null||t.responseJsonSchema!=null)&&t.responseMimeType!=="application/json"&&t.responseMimeType!=="text/x.enum")throw new u(l.UNSUPPORTED,'responseMimeType must be set to "application/json" or "text/x.enum" if responseSchema or responseJsonSchema are set.')}var Os="audio-processor",ti=`
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
  registerProcessor('${Os}', AudioProcessor);
`;function ws(t=tt(),e){t=Be(t);let n=Xe(t,P),s=e?.backend??new M,i=Vn(s),o=n.getImmediate({identifier:i}),r=o.options;if(r){let a=e?.useLimitedUseAppCheckTokens,c=!!r.useLimitedUseAppCheckTokens;if(a!=null&&!!a!==c)throw new u(l.ALREADY_INITIALIZED,`getAI() has already been called for app "${t.name}" and this backend with useLimitedUseAppCheckTokens: ${c}. This option cannot be changed after the AI instance has been initialized. Pass the desired options to the first getAI() call for this app and backend, or omit useLimitedUseAppCheckTokens to reuse the existing instance.`);return o}return o.options={useLimitedUseAppCheckTokens:e?.useLimitedUseAppCheckTokens??!1},o}var As=["mode","onDeviceParams","inCloudParams"];function Cs(t,e,n){let s=e,i;if(s.mode){for(let a of Object.keys(e))As.includes(a)||g.warn(`When a hybrid inference mode is specified (mode is currently set to ${s.mode}), "${a}" cannot be configured at the top level. Configuration for in-cloud and on-device must be done separately in inCloudParams and onDeviceParams. Configuration values set outside of inCloudParams and onDeviceParams will be ignored.`);i=s.inCloudParams||{model:Hn}}else i=e;if(!i.model)throw new u(l.NO_MODEL,"Must provide a model name. Example: getGenerativeModel({ model: 'my-model-name' })");let o=t.chromeAdapterFactory?.(s.mode,typeof window>"u"?void 0:window,s.onDeviceParams),r=new Ce(t,i,n,o);return r._apiSettings.inferenceMode=s.mode,r}function Rs(){U(new O(P,Yn,"PUBLIC").setMultipleInstances(!0)),T(it,ye),T(it,ye,"esm2020")}Rs();export{M as GoogleAIBackend,Gn as ResponseModality,ws as getAI,Cs as getGenerativeModel,et as initializeApp};
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

@firebase/util/dist/index.esm.js:
firebase/app/dist/esm/index.esm.js:
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
*/
