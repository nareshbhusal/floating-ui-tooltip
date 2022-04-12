!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e(require("tslib")):"function"==typeof define&&define.amd?define(["tslib"],e):(t="undefined"!=typeof globalThis?globalThis:t||self)["floating-ui-tooltip"]=e(t.tslib)}(this,(function(t){"use strict";function e(){return document.createElement("div")}function n(t){return{box:t.querySelector(".floating-ui-tooltip-box"),content:t.querySelector(".floating-ui-tooltip-content"),arrow:t.querySelector(".floating-ui-tooltip-arrow")||void 0}}function o(t){return t.split("-")[0]}function i(t){return t.split("-")[1]}function r(t){return["top","bottom"].includes(o(t))?"x":"y"}function a(t){return"y"===t?"height":"width"}function s(t,e,n){let{reference:s,floating:l}=t;const c=s.x+s.width/2-l.width/2,f=s.y+s.height/2-l.height/2,u=r(e),d=a(u),p=s[d]/2-l[d]/2,h="x"===u;let m;switch(o(e)){case"top":m={x:c,y:s.y-l.height};break;case"bottom":m={x:c,y:s.y+s.height};break;case"right":m={x:s.x+s.width,y:f};break;case"left":m={x:s.x-l.width,y:f};break;default:m={x:s.x,y:s.y}}switch(i(e)){case"start":m[u]-=p*(n&&h?-1:1);break;case"end":m[u]+=p*(n&&h?-1:1)}return m}function l(t){return"number"!=typeof t?function(t){return{top:0,right:0,bottom:0,left:0,...t}}(t):{top:t,right:t,bottom:t,left:t}}function c(t){return{...t,top:t.y,left:t.x,right:t.x+t.width,bottom:t.y+t.height}}async function f(t,e){var n;void 0===e&&(e={});const{x:o,y:i,platform:r,rects:a,elements:s,strategy:f}=t,{boundary:u="clippingAncestors",rootBoundary:d="viewport",elementContext:p="floating",altBoundary:h=!1,padding:m=0}=e,g=l(m),w=s[h?"floating"===p?"reference":"floating":p],v=c(await r.getClippingRect({element:null==(n=await(null==r.isElement?void 0:r.isElement(w)))||n?w:w.contextElement||await(null==r.getDocumentElement?void 0:r.getDocumentElement(s.floating)),boundary:u,rootBoundary:d})),y=c(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({rect:"floating"===p?{...a.floating,x:o,y:i}:a.reference,offsetParent:await(null==r.getOffsetParent?void 0:r.getOffsetParent(s.floating)),strategy:f}):a[p]);return{top:v.top-y.top+g.top,bottom:y.bottom-v.bottom+g.bottom,left:v.left-y.left+g.left,right:y.right-v.right+g.right}}const u=Math.min,d=Math.max;function p(t,e,n){return d(t,u(e,n))}const h=t=>({name:"arrow",options:t,async fn(e){const{element:n,padding:o=0}=null!=t?t:{},{x:i,y:s,placement:c,rects:f,platform:u}=e;if(null==n)return{};const d=l(o),h={x:i,y:s},m=r(c),g=a(m),w=await u.getDimensions(n),v="y"===m?"top":"left",y="y"===m?"bottom":"right",b=f.reference[g]+f.reference[m]-h[m]-f.floating[g],x=h[m]-f.reference[m],T=await(null==u.getOffsetParent?void 0:u.getOffsetParent(n)),E=T?"y"===m?T.clientHeight||0:T.clientWidth||0:0,L=b/2-x/2,R=d[v],S=E-w[g]-d[y],k=E/2-w[g]/2+L,O=p(R,k,S);return{data:{[m]:O,centerOffset:k-O}}}}),m={left:"right",right:"left",bottom:"top",top:"bottom"};function g(t){return t.replace(/left|right|bottom|top/g,(t=>m[t]))}function w(t,e,n){void 0===n&&(n=!1);const o=i(t),s=r(t),l=a(s);let c="x"===s?o===(n?"end":"start")?"right":"left":"start"===o?"bottom":"top";return e.reference[l]>e.floating[l]&&(c=g(c)),{main:c,cross:g(c)}}const v={start:"end",end:"start"};function y(t){return t.replace(/start|end/g,(t=>v[t]))}const b=["top","right","bottom","left"],x=b.reduce(((t,e)=>t.concat(e,e+"-start",e+"-end")),[]);const T=function(t){return void 0===t&&(t={}),{name:"autoPlacement",options:t,async fn(e){var n,r,a,s,l;const{x:c,y:u,rects:d,middlewareData:p,placement:h,platform:m,elements:g}=e,{alignment:v=null,allowedPlacements:b=x,autoAlignment:T=!0,...E}=t,L=function(t,e,n){return(t?[...n.filter((e=>i(e)===t)),...n.filter((e=>i(e)!==t))]:n.filter((t=>o(t)===t))).filter((n=>!t||i(n)===t||!!e&&y(n)!==n))}(v,T,b),R=await f(e,E),S=null!=(n=null==(r=p.autoPlacement)?void 0:r.index)?n:0,k=L[S],{main:O,cross:_}=w(k,d,await(null==m.isRTL?void 0:m.isRTL(g.floating)));if(h!==k)return{x:c,y:u,reset:{skip:!1,placement:L[0]}};const D=[R[o(k)],R[O],R[_]],H=[...null!=(a=null==(s=p.autoPlacement)?void 0:s.overflows)?a:[],{placement:k,overflows:D}],C=L[S+1];if(C)return{data:{index:S+1,overflows:H},reset:{skip:!1,placement:C}};const A=H.slice().sort(((t,e)=>t.overflows[0]-e.overflows[0])),P=null==(l=A.find((t=>{let{overflows:e}=t;return e.every((t=>t<=0))})))?void 0:l.placement;return{reset:{placement:null!=P?P:A[0].placement}}}}};const E=function(t){return void 0===t&&(t={}),{name:"flip",options:t,async fn(e){var n;const{placement:i,middlewareData:r,rects:a,initialPlacement:s,platform:l,elements:c}=e,{mainAxis:u=!0,crossAxis:d=!0,fallbackPlacements:p,fallbackStrategy:h="bestFit",flipAlignment:m=!0,...v}=t,b=o(i),x=p||(b===s||!m?[g(s)]:function(t){const e=g(t);return[y(t),e,y(e)]}(s)),T=[s,...x],E=await f(e,v),L=[];let R=(null==(n=r.flip)?void 0:n.overflows)||[];if(u&&L.push(E[b]),d){const{main:t,cross:e}=w(i,a,await(null==l.isRTL?void 0:l.isRTL(c.floating)));L.push(E[t],E[e])}if(R=[...R,{placement:i,overflows:L}],!L.every((t=>t<=0))){var S,k;const t=(null!=(S=null==(k=r.flip)?void 0:k.index)?S:0)+1,e=T[t];if(e)return{data:{index:t,overflows:R},reset:{skip:!1,placement:e}};let n="bottom";switch(h){case"bestFit":{var O;const t=null==(O=R.slice().sort(((t,e)=>t.overflows.filter((t=>t>0)).reduce(((t,e)=>t+e),0)-e.overflows.filter((t=>t>0)).reduce(((t,e)=>t+e),0)))[0])?void 0:O.placement;t&&(n=t);break}case"initialPlacement":n=s}return{reset:{placement:n}}}return{}}}};function L(t,e){return{top:t.top-e.height,right:t.right-e.width,bottom:t.bottom-e.height,left:t.left-e.width}}function R(t){return b.some((e=>t[e]>=0))}const S=function(t){let{strategy:e="referenceHidden",...n}=void 0===t?{}:t;return{name:"hide",async fn(t){const{rects:o}=t;switch(e){case"referenceHidden":{const e=L(await f(t,{...n,elementContext:"reference"}),o.reference);return{data:{referenceHiddenOffsets:e,referenceHidden:R(e)}}}case"escaped":{const e=L(await f(t,{...n,altBoundary:!0}),o.floating);return{data:{escapedOffsets:e,escaped:R(e)}}}default:return{}}}}};const k=function(t){return void 0===t&&(t=0),{name:"offset",options:t,async fn(e){const{x:n,y:a,placement:s,rects:l,platform:c,elements:f}=e,u=function(t,e,n,a){void 0===a&&(a=!1);const s=o(t),l=i(t),c="x"===r(t),f=["left","top"].includes(s)?-1:1;let u=1;"end"===l&&(u=-1),a&&c&&(u*=-1);const d="function"==typeof n?n({...e,placement:t}):n,{mainAxis:p,crossAxis:h}="number"==typeof d?{mainAxis:d,crossAxis:0}:{mainAxis:0,crossAxis:0,...d};return c?{x:h*u,y:p*f}:{x:p*f,y:h*u}}(s,l,t,await(null==c.isRTL?void 0:c.isRTL(f.floating)));return{x:n+u.x,y:a+u.y,data:u}}}};const O=function(t){return void 0===t&&(t={}),{name:"size",options:t,async fn(e){const{placement:n,rects:r,platform:a,elements:s}=e,{apply:l,...c}=t,u=await f(e,c),p=o(n),h=i(n);let m,g;"top"===p||"bottom"===p?(m=p,g=h===(await(null==a.isRTL?void 0:a.isRTL(s.floating))?"start":"end")?"left":"right"):(g=p,m="end"===h?"top":"bottom");const w=d(u.left,0),v=d(u.right,0),y=d(u.top,0),b=d(u.bottom,0),x={height:r.floating.height-(["left","right"].includes(n)?2*(0!==y||0!==b?y+b:d(u.top,u.bottom)):u[m]),width:r.floating.width-(["top","bottom"].includes(n)?2*(0!==w||0!==v?w+v:d(u.left,u.right)):u[g])};return null==l||l({...x,...r}),{reset:{rects:!0}}}}};function _(t){return"[object Window]"===(null==t?void 0:t.toString())}function D(t){if(null==t)return window;if(!_(t)){const e=t.ownerDocument;return e&&e.defaultView||window}return t}function H(t){return D(t).getComputedStyle(t)}function C(t){return _(t)?"":t?(t.nodeName||"").toLowerCase():""}function A(t){return t instanceof D(t).HTMLElement}function P(t){return t instanceof D(t).Element}function W(t){return t instanceof D(t).ShadowRoot||t instanceof ShadowRoot}function z(t){const{overflow:e,overflowX:n,overflowY:o}=H(t);return/auto|scroll|overlay|hidden/.test(e+o+n)}function M(t){return["table","td","th"].includes(C(t))}function N(t){const e=navigator.userAgent.toLowerCase().includes("firefox"),n=H(t);return"none"!==n.transform||"none"!==n.perspective||"paint"===n.contain||["transform","perspective"].includes(n.willChange)||e&&"filter"===n.willChange||e&&!!n.filter&&"none"!==n.filter}const U=Math.min,j=Math.max,B=Math.round;function F(t,e){void 0===e&&(e=!1);const n=t.getBoundingClientRect();let o=1,i=1;return e&&A(t)&&(o=t.offsetWidth>0&&B(n.width)/t.offsetWidth||1,i=t.offsetHeight>0&&B(n.height)/t.offsetHeight||1),{width:n.width/o,height:n.height/i,top:n.top/i,right:n.right/o,bottom:n.bottom/i,left:n.left/o,x:n.left/o,y:n.top/i}}function V(t){return(e=t,(e instanceof D(e).Node?t.ownerDocument:t.document)||window.document).documentElement;var e}function q(t){return _(t)?{scrollLeft:t.pageXOffset,scrollTop:t.pageYOffset}:{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}}function X(t){return F(V(t)).left+q(t).scrollLeft}function Y(t,e,n){const o=A(e),i=V(e),r=F(t,o&&function(t){const e=F(t);return B(e.width)!==t.offsetWidth||B(e.height)!==t.offsetHeight}(e));let a={scrollLeft:0,scrollTop:0};const s={x:0,y:0};if(o||!o&&"fixed"!==n)if(("body"!==C(e)||z(i))&&(a=q(e)),A(e)){const t=F(e,!0);s.x=t.x+e.clientLeft,s.y=t.y+e.clientTop}else i&&(s.x=X(i));return{x:r.left+a.scrollLeft-s.x,y:r.top+a.scrollTop-s.y,width:r.width,height:r.height}}function I(t){return"html"===C(t)?t:t.assignedSlot||t.parentNode||(W(t)?t.host:null)||V(t)}function G(t){return A(t)&&"fixed"!==getComputedStyle(t).position?t.offsetParent:null}function J(t){const e=D(t);let n=G(t);for(;n&&M(n)&&"static"===getComputedStyle(n).position;)n=G(n);return n&&("html"===C(n)||"body"===C(n)&&"static"===getComputedStyle(n).position&&!N(n))?e:n||function(t){let e=I(t);for(W(e)&&(e=e.host);A(e)&&!["html","body"].includes(C(e));){if(N(e))return e;e=e.parentNode}return null}(t)||e}function K(t){if(A(t))return{width:t.offsetWidth,height:t.offsetHeight};const e=F(t);return{width:e.width,height:e.height}}function Q(t){return["html","body","#document"].includes(C(t))?t.ownerDocument.body:A(t)&&z(t)?t:Q(I(t))}function Z(t,e){var n;void 0===e&&(e=[]);const o=Q(t),i=o===(null==(n=t.ownerDocument)?void 0:n.body),r=D(o),a=i?[r].concat(r.visualViewport||[],z(o)?o:[]):o,s=e.concat(a);return i?s:s.concat(Z(I(a)))}function $(t,e){return"viewport"===e?c(function(t){const e=D(t),n=V(t),o=e.visualViewport;let i=n.clientWidth,r=n.clientHeight,a=0,s=0;return o&&(i=o.width,r=o.height,Math.abs(e.innerWidth/o.scale-o.width)<.01&&(a=o.offsetLeft,s=o.offsetTop)),{width:i,height:r,x:a,y:s}}(t)):P(e)?function(t){const e=F(t),n=e.top+t.clientTop,o=e.left+t.clientLeft;return{top:n,left:o,x:o,y:n,right:o+t.clientWidth,bottom:n+t.clientHeight,width:t.clientWidth,height:t.clientHeight}}(e):c(function(t){var e;const n=V(t),o=q(t),i=null==(e=t.ownerDocument)?void 0:e.body,r=j(n.scrollWidth,n.clientWidth,i?i.scrollWidth:0,i?i.clientWidth:0),a=j(n.scrollHeight,n.clientHeight,i?i.scrollHeight:0,i?i.clientHeight:0);let s=-o.scrollLeft+X(t);const l=-o.scrollTop;return"rtl"===H(i||n).direction&&(s+=j(n.clientWidth,i?i.clientWidth:0)-r),{width:r,height:a,x:s,y:l}}(V(t)))}function tt(t){const e=Z(I(t)),n=["absolute","fixed"].includes(H(t).position)&&A(t)?J(t):t;return P(n)?e.filter((t=>P(t)&&function(t,e){const n=null==e.getRootNode?void 0:e.getRootNode();if(t.contains(e))return!0;if(n&&W(n)){let n=e;do{if(n&&t===n)return!0;n=n.parentNode||n.host}while(n)}return!1}(t,n)&&"body"!==C(t))):[]}const et={getClippingRect:function(t){let{element:e,boundary:n,rootBoundary:o}=t;const i=[..."clippingAncestors"===n?tt(e):[].concat(n),o],r=i[0],a=i.reduce(((t,n)=>{const o=$(e,n);return t.top=j(o.top,t.top),t.right=U(o.right,t.right),t.bottom=U(o.bottom,t.bottom),t.left=j(o.left,t.left),t}),$(e,r));return{width:a.right-a.left,height:a.bottom-a.top,x:a.left,y:a.top}},convertOffsetParentRelativeRectToViewportRelativeRect:function(t){let{rect:e,offsetParent:n,strategy:o}=t;const i=A(n),r=V(n);if(n===r)return e;let a={scrollLeft:0,scrollTop:0};const s={x:0,y:0};if((i||!i&&"fixed"!==o)&&(("body"!==C(n)||z(r))&&(a=q(n)),A(n))){const t=F(n,!0);s.x=t.x+n.clientLeft,s.y=t.y+n.clientTop}return{...e,x:e.x-a.scrollLeft+s.x,y:e.y-a.scrollTop+s.y}},isElement:P,getDimensions:K,getOffsetParent:J,getDocumentElement:V,getElementRects:t=>{let{reference:e,floating:n,strategy:o}=t;return{reference:Y(e,J(n),o),floating:{...K(n),x:0,y:0}}},getClientRects:t=>Array.from(t.getClientRects()),isRTL:t=>"rtl"===H(t).direction};const nt=(t,e,n)=>(async(t,e,n)=>{const{placement:o="bottom",strategy:i="absolute",middleware:r=[],platform:a}=n,l=await(null==a.isRTL?void 0:a.isRTL(e));let c=await a.getElementRects({reference:t,floating:e,strategy:i}),{x:f,y:u}=s(c,o,l),d=o,p={};const h=new Set;for(let n=0;n<r.length;n++){const{name:m,fn:g}=r[n];if(h.has(m))continue;const{x:w,y:v,data:y,reset:b}=await g({x:f,y:u,initialPlacement:o,placement:d,strategy:i,middlewareData:p,rects:c,platform:a,elements:{reference:t,floating:e}});f=null!=w?w:f,u=null!=v?v:u,p={...p,[m]:{...p[m],...y}},b&&("object"==typeof b&&(b.placement&&(d=b.placement),b.rects&&(c=!0===b.rects?await a.getElementRects({reference:t,floating:e,strategy:i}):b.rects),({x:f,y:u}=s(c,d,l)),!1!==b.skip&&h.add(m)),n=-1)}return{x:f,y:u,placement:d,strategy:i,middlewareData:p}})(t,e,{platform:et,...n});var ot={top:"bottom",right:"left",bottom:"top",left:"right"},it=function(e,i,a,s,l,c){return t.__awaiter(void 0,void 0,void 0,(function(){var u,d,m,g,w,v,y,b,x,L,R,_,D,H,C,A,P,W,z,M,N,U,j,B,F,V,q,X,Y,I,G,J,K;return t.__generator(this,(function(Q){switch(Q.label){case 0:return m=void 0!==(d=(u={}).toFlip)&&d,w=void 0===(g=u.toShift)||g,v=e.placement,y=e.hideOnReferenceHidden,b=e.offset,x=e.hideOnTooltipEscape,L=e.arrowSizeScale,R=e.resetPlacementOnUpdate,_=e.arrow,D=n(i),H=D.arrow,C=12*L,a?(A={middleware:t.__spreadArray(t.__spreadArray(t.__spreadArray(t.__spreadArray(t.__spreadArray([k({mainAxis:b[0],crossAxis:b[1]})],"auto"===v&&(l||R)?[T()]:[],!0),w?[(Z={padding:16},void 0===Z&&(Z={}),{name:"shift",options:Z,async fn(t){const{x:e,y:n,placement:i}=t,{mainAxis:a=!0,crossAxis:s=!1,limiter:l={fn:t=>{let{x:e,y:n}=t;return{x:e,y:n}}},...c}=Z,u={x:e,y:n},d=await f(t,c),h=r(o(i)),m="x"===h?"y":"x";let g=u[h],w=u[m];if(a){const t="y"===h?"bottom":"right";g=p(g+d["y"===h?"top":"left"],g,g-d[t])}if(s){const t="y"===m?"bottom":"right";w=p(w+d["y"===m?"top":"left"],w,w-d[t])}const v=l.fn({...t,[h]:g,[m]:w});return{...v,data:{x:v.x-e,y:v.y-n}}}})]:[],!0),"auto"!==v&&m?[E({fallbackPlacements:["right","left"],fallbackStrategy:"initialPlacement"})]:[],!0),_?[h({element:H,padding:2})]:[],!0),[O({apply:function(t){t.width,t.height,t.reference,t.floating}}),S()],!1)},"auto"!==v&&(A.placement=v),[4,nt(a,i,A)]):[2];case 1:switch(P=Q.sent(),W=P.x,z=P.y,M=P.placement,N=P.middlewareData,U=N.hide,j=U.referenceHidden,B=U.escaped,N.arrow&&(F=N.arrow.x,V=N.arrow.y),q=0!==N.arrow.centerOffset,X=y&&j||x&&B||s?"hidden":"visible",i.setAttribute("data-state",X),Object.assign(i.style,{visibility:X,left:W+"px",top:z+"px"}),Y=ot[M.split("-")[0]],I=0,G=0,J=0,J=null!==F?F+C+"px":"",Y){case"top":I=1/1.7,J=null!==F?F+C*I+"px":"";break;case"bottom":I=.5,J=null!==F?F+C*I+"px":"";break;case"left":I=.005,J=null!==F?F+"px":"",G=null!==V?V-C*I/2+"px":"";break;case"right":I=1.2,J=null!==F?F+"px":"",G=null!==V?V-C*I/2+"px":""}return G=null!==V?V-C*I/2+"px":"",G=null!==V?V+"px":"",Object.assign(H.style,((K={visibility:q?"hidden":"visible",left:J,top:G,right:"",bottom:""})[Y]="-"+C*I+"px",K)),l?console.log("setting state after newlyShown"):console.log("setting state on update"),c({isShown:"visible"===X,fui:P}),[2,P]}var Z}))}))},rt={allowHTML:!0,content:"",arrow:!0,transitionDuration:[300,250],offset:[10,0],hideOnClick:!0,onClickOutside:function(t,e){},onShow:function(t){},onHide:function(t){},placement:"top",resetPlacementOnUpdate:!1,hideOnTooltipEscape:!0,hideOnReferenceHidden:!0,showOnCreate:!0,maxWidth:350,updateDebounce:100,zIndex:99999,arrowSizeScale:1,updateOnEvents:"resize scroll"};function at(t,e){return 0===e?t:function(o){clearTimeout(n),n=setTimeout((function(){t(o)}),e)};var n}var st=function(){function o(t,e){var n,o=this;this.state={isShown:!1,isRemoved:!1,fui:void 0},this.toHideTooltip=!1,this.transitionDuration=0,this.clickHandler=function(t){o.state.isShown&&(o.tooltipElement.contains(t.target)||o.reference.contains(t.target)||o.props.onClickOutside&&o.props.onClickOutside(o,t),"target"===o.props.hideOnClick?t.target===o.reference&&o.hide():o.props.hideOnClick&&o.hide())},this.props=t,this.reference=e,(n=document.createElement("style")).type="text/css",n.setAttribute("floating-ui-tooltip-default",""),n.textContent=".floating-ui-tooltip-root{--color:#fff;--border-color:#fefefe;--border-color:red;backface-visibility:hidden;background:var(--color);border-radius:6px;box-shadow:0 0 0 1px rgba(6,44,82,.1),0 2px 16px rgba(33,43,54,.08);box-shadow:0 0 20px 4px rgba(154,161,177,.15),0 4px 80px -8px rgba(36,40,47,.25),0 4px 4px -2px rgba(91,94,105,.15);font-size:90%;line-height:0px;margin:0;max-width:calc(100vw - 10px);padding:0;position:absolute;transition-duration:.2s;transition-property:transform,visibility,opacity;transition-timing-function:cubic-bezier(.54,1.5,.38,1.11);z-index:9999}.floating-ui-tooltip-arrow{box-shadow:0 0 0 1px rgba(6,44,82,.1),0 2px 16px rgba(33,43,54,.08);height:14px;position:absolute;transform:translateX(-50%) rotate(45deg);width:14px;z-index:-1}.floating-ui-tooltip-box{border-radius:inherit;line-height:normal;margin:0;outline:0;position:relative}.floating-ui-tooltip-root[data-state=hidden]{opacity:0}.floating-ui-tooltip-root[data-state=visible]{opacity:1}.floating-ui-tooltip-content{background-color:#fff;border-radius:inherit;color:#111;padding:0;position:relative;z-index:2}.floating-ui-tooltip-arrow,.floating-ui-tooltip-root{background:var(--color)}",document.head.appendChild(n)}return o.prototype.hookEventListeners=function(){var t=this;this.debouncedUpdate=at(this.update.bind(this),this.props.updateDebounce),this.autoUpdateCleanup=function(t,e,n,o){void 0===o&&(o={});const{ancestorScroll:i=!0,ancestorResize:r=!0,elementResize:a=!0,animationFrame:s=!1}=o;let l=!1;const c=i&&!s,f=r&&!s,u=a&&!s,d=c||f?[...P(t)?Z(t):[],...Z(e)]:[];d.forEach((t=>{c&&t.addEventListener("scroll",n,{passive:!0}),f&&t.addEventListener("resize",n)}));let p,h=null;u&&(h=new ResizeObserver(n),P(t)&&h.observe(t),h.observe(e));let m=s?F(t):null;return s&&function e(){if(l)return;const o=F(t);!m||o.x===m.x&&o.y===m.y&&o.width===m.width&&o.height===m.height||n(),m=o,p=requestAnimationFrame(e)}(),()=>{var t;l=!0,d.forEach((t=>{c&&t.removeEventListener("scroll",n),f&&t.removeEventListener("resize",n)})),null==(t=h)||t.disconnect(),h=null,s&&cancelAnimationFrame(p)}}(this.reference,this.tooltipElement,(function(){return t.debouncedUpdate(void 0)})),this.props.updateOnEvents.split(" ").forEach((function(e){window.addEventListener(e,(function(){return t.debouncedUpdate(void 0)}))})),window.addEventListener("click",this.clickHandler.bind(this))},o.prototype.updateTransitionDuration=function(t){this.transitionDuration=t,this.tooltipElement.style.transitionDuration=t+"ms"},o.prototype.create=function(){return t.__awaiter(this,void 0,void 0,(function(){var o,i,r,a,s;return t.__generator(this,(function(t){switch(t.label){case 0:return o=this.props.showOnCreate,this.tooltipElement=(l=e(),c=e(),f=e(),u=e(),l.className="floating-ui-tooltip-root",c.className="floating-ui-tooltip-box",f.className="floating-ui-tooltip-content",u.className="floating-ui-tooltip-arrow",c.appendChild(f),c.appendChild(u),l.appendChild(c),f.innerHTML='\n    <div id="tooltip-container">\n    <h3>Default tooltip</h3>\n    </div>\n  ',c.setAttribute("role","tooltip"),l.setAttribute("data-state",""),Object.assign(l.style,{visibility:"hidden",left:"0px",top:"0px"}),l),this.updateTransitionDuration(this.props.transitionDuration[0]),i=n(this.tooltipElement).content,r=this.props,a=r.allowHTML,s=r.content,a?i.innerHTML=s:i.innerText=""+s,document.body.appendChild(this.tooltipElement),[4,it(this.props,this.tooltipElement,this.reference,o,!0,this.setState.bind(this))];case 1:return t.sent(),this.hookEventListeners(),[2]}var l,c,f,u}))}))},o.prototype.getState=function(){return this.state},o.prototype.setState=function(e){var n=this,o=void 0!==e.isShown&&e.isShown!==this.state.isShown;if(o&&e.isShown){var i=at(this.props.onShow,0);this.transitionDuration?function(t,e){var n={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"},o=[];for(var i in n)o.push(n[i]);o.forEach((function(n){t.addEventListener(n,(function o(i){i.target===t&&(function(t,e,n){var o="remove"+"EventListener";["transitionend","webkitTransitionEnd"].forEach((function(e){t[o](e,n)}))}(t,0,o),e(),console.log("transition end for event "+n))}))}))}(this.tooltipElement,(function(){i(n)})):i(this)}this.state=t.__assign(t.__assign({},this.state),e),o&&!e.isShown&&this.props.onHide(this)},o.prototype.update=function(e){return t.__awaiter(this,void 0,void 0,(function(){return t.__generator(this,(function(t){switch(t.label){case 0:return e=e||this.toHideTooltip||!1,[4,it(this.props,this.tooltipElement,this.reference,e,!1,this.setState.bind(this))];case 1:return t.sent(),[2]}}))}))},o.prototype.hide=function(){this.toHideTooltip=!0,this.update(!0),this.updateTransitionDuration(this.props.transitionDuration[0])},o.prototype.show=function(){this.toHideTooltip=!1,this.update(!1),this.updateTransitionDuration(this.props.transitionDuration[1])},o.prototype.remove=function(){var t=this;this.tooltipElement.remove(),this.state={isShown:!1,isRemoved:!0,fui:void 0},this.autoUpdateCleanup(),window.removeEventListener("click",this.clickHandler.bind(this)),this.props.updateOnEvents.split(" ").forEach((function(e){window.removeEventListener(e,t.debouncedUpdate)}))},o}();return function(e,n){return t.__awaiter(this,void 0,void 0,(function(){var o,i,r,a,s;return t.__generator(this,(function(l){switch(l.label){case 0:return o=n.placement||rt.placement,i=n.transitionDuration||rt.transitionDuration,r=rt.offset,a=t.__assign(t.__assign(t.__assign({},rt),n),{placement:o,transitionDuration:i,offset:r}),[4,(s=new st(a,e)).create()];case 1:return l.sent(),[2,{props:s.props,reference:s.reference,getState:s.getState.bind(s),show:s.show.bind(s),hide:s.hide.bind(s),remove:s.remove.bind(s),update:s.update.bind(s)}]}}))}))}}));
//# sourceMappingURL=index.js.map
