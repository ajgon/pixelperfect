(function(){"use strict";var e={vendors:["ms","moz","webkit","o"],cssProperties:["transitionDuration"],keys:{event:"keypress",arrowEvent:"keydown",UP:38,DOWN:40,"^?":47,"^X":24,"^M":13,"^H":8,"^O":15,O:111,B:98,"^P":16,X:120,Y:121,"^F":6,F:102,U:117,"^A":1,L:108,C:99,R:114,T:116,M:109,"^T":20,"^<":44,"^>":46,"^[":27,"^]":29,"^R":18},init:function(){var e,t,n=this.cssProperties.length,r=this.vendors.length;for(e=0;e<n;e+=1){document.body.style[this.cssProperties[e]]!==undefined&&(this[this.cssProperties[e]]=this.cssProperties[e]);for(t=0;t<r&&document.body.style[this[this.cssProperties[e]]]===undefined;t+=1)this[this.cssProperties[e]]=this.vendors[t]+this.cssProperties[e][0].toUpperCase()+this.cssProperties[e].substring(1)}}},t=e,n=function(e,t,n){var r,i,s,o;if(!e)return this.elements=[],this.elements_length=0,this;if(e.nodeName)return this.elements=[e],this.elements_length=1,this;typeof t=="boolean"&&(n=t,t=undefined),n===undefined&&(n=!0);if(n&&this.elements===null){r=[],t===undefined&&(t=document),i=t.querySelectorAll(e),s=i.length;for(o=0;o<s;o+=1)r.push(i[o]);this.elements=r,this.elements_length=r.length}return this};n.prototype={elements:null,elements_length:0,event:function(e,t){return this.elements.every(function(r){return r.addEventListener(e,t.bind(new n(r))),r.events===undefined&&(r.events={}),r.events[e]=t,!0}),this},remove:function(){return this.elements.every(function(e){return e.parentNode.removeChild(e),!0}),this},removeClass:function(e){return this.elements.every(function(t){return t.className=t.className.replace(new RegExp(e,"g"),"").replace(/^\s+|\s+$/,""),!0}.bind(this)),this},addClass:function(e){return this.removeClass(e),this.elements.every(function(t){return t.className+=" "+e,!0}.bind(this)),this},setOpacity:function(e){return this.elements.every(function(t){return t.style.opacity=(parseInt(e,10)/100).toString(),!0}.bind(this)),this},animate:function(e,n){n===undefined&&(n=500),this.elements.every(function(r){var i;if(e.top)switch(e.top){case"top":e.top="0px";break;case"middle":e.top=((window.innerHeight-r.clientHeight)/2).toString()+"px";break;case"bottom":e.top=(window.innerHeight-r.clientHeight).toString()+"px";break;default:e.top=parseInt(e.top,10).toString()+"px"}if(e.left)switch(e.left){case"left":e.left="0px";break;case"center":e.left=((window.innerWidth-r.clientWidth)/2).toString()+"px";break;case"right":e.left=(window.innerWidth-r.clientWidth).toString()+"px";break;default:e.left=parseInt(e.left,10).toString()+"px"}r.style[t.transitionDuration]=(n/1e3).toString()+"s";for(i in e)e.hasOwnProperty(i)&&(r.style[i]=e[i])}.bind(this))}};var r={list:[],hash:function(e){var t,n,r=0;if(e.length===0)return r;for(t=0;t<e.length;t+=1)n=e.charCodeAt(t),r=(r<<5)-r+n,r&=r;return r.toString(16)},addToList:function(e){this.list.indexOf(e)===-1&&this.list.push(e),localStorage.setItem("pixelperfect:list",this.list.join(","))},removeFromList:function(e){var t=this.list.indexOf(e);t!==-1&&this.list.splice(t,1),localStorage.setItem("pixelperfect:list",this.list.join(","))},insertLayer:function(e,t){var n=document.createElement("div"),i=document.createElement("a"),s=new Image;n.className="pixelperfect-layer",i.className="pixelperfect-button",i.innerHTML="&#10008;",n.appendChild(s),n.appendChild(i),e.match(/(^data:)|(^http)/)?s.onload=function(){var e;e="pixelperfect:layer:"+r.hash(s.src),localStorage.setItem(e,s.src),n.setAttribute("data-id",e),this.appendLayer(n),this.selectLayer(this.fillSelected()),this.addToList(e)}.bind(this):(t!==undefined&&(n.setAttribute("data-id",t),this.addToList(t)),this.appendLayer(n),this.selectLayer(this.fillSelected())),s.src=e},appendLayer:function(e){u("#pixelperfect-layers").elements[0].appendChild(e)},selectLayer:function(e){e===undefined&&(e=this.fillSelected()),e&&(u("#pixelperfect-layers .pixelperfect-layer").removeClass("pixelperfect-layer-selected"),u('#pixelperfect-layers .pixelperfect-layer[data-id="'+e+'"]').addClass("pixelperfect-layer-selected"),localStorage.setItem("pixelperfect:selected",e),o.refreshOverlay(e))},removeLayer:function(e){u('#pixelperfect-layers .pixelperfect-layer[data-id="'+e+'"]').remove(),localStorage.removeItem(e),this.removeFromList(e),this.selectLayer(this.fillSelected()),u("#pixelperfect-layers .pixelperfect-layer").elements_length===0&&u("#pixelperfect-overlay").remove()},fillSelected:function(){var e,t=localStorage.getItem("pixelperfect:selected");if(!t||!localStorage.getItem(t))for(e in localStorage)if(localStorage.hasOwnProperty(e)&&e.match(/^pixelperfect:layer/)){t=e;break}return t},getSelected:function(){return u('#pixelperfect-layers .pixelperfect-layer-selected, #pixelperfect-layers .pixelperfect-layer[data-id="'+this.fillSelected()+'"]').elements[0]},next:function(){var e=this.getSelected();e&&e.nextSibling&&this.selectLayer(e.nextSibling.getAttribute("data-id"))},previous:function(){var e=this.getSelected();e&&e.previousSibling&&this.selectLayer(e.previousSibling.getAttribute("data-id"))},setByIndex:function(e){var t=u("#pixelperfect-layers .pixelperfect-layer").elements[e];t&&this.selectLayer(t.getAttribute("data-id"))},refresh:function(){var e,t=this.list.length;u("#pixelperfect-layers .pixelperfect-layer").remove();for(e=0;e<t;e+=1)this.list[e].match(/^pixelperfect:layer/)&&this.insertLayer(localStorage.getItem(this.list[e]),this.list[e]);this.selectLayer()},init:function(){var e=localStorage.getItem("pixelperfect:list");e&&(this.list=e.split(",")),this.refresh(),u("#pixelperfect-layers").event("click",function(e){var t;e.preventDefault(),e.target.className.match("pixelperfect-button")?r.removeLayer.call(r,e.target.parentNode.getAttribute("data-id")):(t=e.target.getAttribute("data-id"),t||(t=e.target.parentNode.getAttribute("data-id")),t&&r.selectLayer(t))})}},i={makeDraggable:function(e,t){var n;t===undefined&&(t={}),t={handler:t.handler===undefined?!1:t.handler,remember:t.remember===undefined?!0:t.remember,onDrag:t.onDrag===undefined?function(){}:t.onDrag,onDrop:t.onDrop===undefined?function(){}:t.onDrop,onMove:t.onMove===undefined?function(){}:t.onMove};for(n=0;n<e.elements_length;n+=1)t.handler?(t.handler=e.elements[n].querySelector(t.handler),t.handler||(t.handler=e.elements[n])):t.handler=e.elements[n],e.elements[n].options=t,t.handler.addEventListener("mousedown",this.catchHandlerEvent.bind(e.elements[n])),t.handler.draggable=!0},catchHandlerEvent:function(e){e.preventDefault(),document.currentDragged=this,document.currentDragged.mouseDiffX=e.pageX-this.offsetLeft,document.currentDragged.mouseDiffY=e.pageY-this.offsetTop,this.options.onDrag.call(this,e)},catchFileDragEvent:function(e){e.stopPropagation(),e.preventDefault(),e.type==="dragover"?e.target.className=e.type:e.target.className=""},catchFileDropEvent:function(e){var t,n=e.dataTransfer.files,i=n.length;e.stopPropagation(),e.preventDefault(),e.target.className="";for(t=0;t<i;t+=1)r.insertLayer(window.URL.createObjectURL(n[t]))},catchFile:function(e){var t,n,r=["dragenter","dragexit","dragover"];for(t=0;t<e.elements_length;t+=1){for(n=0;n<3;n+=1)e.elements[t].addEventListener(r[n],this.catchFileDragEvent,!1);e.elements[t].addEventListener("drop",this.catchFileDropEvent,!1)}},init:function(){var e,t,n;document.addEventListener("mouseup",function(e){this.currentDragged&&(this.currentDragged.options.remember&&localStorage.setItem("pixelperfect:draganddrop:"+this.currentDragged.getAttribute("id"),parseInt(this.currentDragged.style.left,10).toString()+","+parseInt(this.currentDragged.style.top,10).toString()),this.currentDragged.options.onDrop.call(this.currentDragged,e)),this.currentDragged=!1}),document.addEventListener("mousemove",function(e){this.currentDragged&&(this.currentDragged.style.right="auto",this.currentDragged.style.bottom="auto",this.currentDragged.style.left=(e.pageX-this.currentDragged.mouseDiffX).toString()+"px",this.currentDragged.style.top=(e.pageY-this.currentDragged.mouseDiffY).toString()+"px",this.currentDragged.options.onMove.call(this.currentDragged,e))});for(e in localStorage)localStorage.hasOwnProperty(e)&&e.match(/pixelperfect:draganddrop/)&&(t=document.getElementById(e.replace("pixelperfect:draganddrop:","")),n=localStorage.getItem(e).split(","),t.style.left=n[0]+"px",t.style.top=n[1]+"px")}},s={pre_keyCodes:function(){navigator.userAgent.match(/Gecko/)&&!navigator.userAgent.match(/KHTML/)&&(e.keys.arrowEvent="keypress",e.keys["^X"]=120,e.keys["^M"]=109,e.keys["^H"]=104,e.keys["^O"]=111,e.keys["^P"]=112,e.keys["^F"]=102,e.keys["^A"]=97,e.keys["^T"]=116,e.keys["^R"]=114),window.opera&&(e.keys.event="keyup",e.keys["^?"]=191,e.keys["^X"]=88,e.keys["^M"]=77,e.keys["^H"]=72,e.keys["^O"]=79,e.keys.O=79,e.keys.B=66,e.keys["^P"]=80,e.keys.X=88,e.keys.Y=89,e.keys["^F"]=70,e.keys.F=70,e.keys.U=85,e.keys["^A"]=65,e.keys.L=76,e.keys.C=67,e.keys.R=82,e.keys.T=84,e.keys.M=77,e.keys["^T"]=84,e.keys["^<"]=188,e.keys["^>"]=190,e.keys["^["]=219,e.keys["^]"]=221,e.keys["^R"]=82)},post_opacityRange:function(){var e=document.createElement("input"),t,n,r;e.setAttribute("type","range"),e.type!=="range"&&(t=document.getElementById("pixelperfect-opacity-range"),e=document.createElement("span"),n=document.createElement("span"),e.className="pixelperfect-range",n.className="pixelperfect-slider",e.appendChild(n),e.value=t.value,e.events=t.events,t.parentNode.insertBefore(e,t),t.parentNode.removeChild(t),e.setAttribute("id","pixelperfect-opacity-range"),r=function(e){var t=document.getElementById("pixelperfect-opacity-range"),n=document.getElementById("pixelperfect");e.preventDefault(),e.stopPropagation(),t.value=Math.round(Math.max(0,Math.min(100,(e.pageX-t.offsetLeft-n.offsetLeft-10)/t.clientWidth*100+10))),this.style.top="-4px",this.style.left=t.value.toString()+"%",t.elements=[t],t.events.change.call(t)}.bind(n),u(e).event("click",r),i.makeDraggable(u(n),{remember:!1,onMove:r}),setInterval(function(){this.firstChild.style.left=this.value+"%"}.bind(document.getElementById("pixelperfect-opacity-range")),50))},post_FileReader:function(){(!window.FileReader||window.opera)&&u("#pixelperfect-fileinput, #pixelperfect-upload-file, #pixelperfect-drop-file").remove()},preLoad:function(){var e;for(e in this)this.hasOwnProperty(e)&&e.match(/^pre_/)&&this[e]()},postLoad:function(){var e;for(e in this)this.hasOwnProperty(e)&&e.match(/^post_/)&&this[e]()}},o={STYLES:"I3BpeGVscGVyZmVjdHt3aWR0aDoyMDBweDtwYWRkaW5nOjEwcHg7cG9zaXRpb246Zml4ZWQ7cmlnaHQ6MjBweDt0b3A6MjBweDtjdXJzb3I6ZGVmYXVsdDstbW96LWJvcmRlci1yYWRpdXM6OHB4Oy13ZWJraXQtYm9yZGVyLXJhZGl1czo4cHg7LW8tYm9yZGVyLXJhZGl1czo4cHg7LW1zLWJvcmRlci1yYWRpdXM6OHB4O2JvcmRlci1yYWRpdXM6OHB4Oy1tb3otYm94LXNoYWRvdzowIDAgN3B4IHJnYmEoMCwwLDAsMC42KTstd2Via2l0LWJveC1zaGFkb3c6MCAwIDdweCByZ2JhKDAsMCwwLDAuNik7LW8tYm94LXNoYWRvdzowIDAgN3B4IHJnYmEoMCwwLDAsMC42KTstbXMtYm94LXNoYWRvdzowIDAgN3B4IHJnYmEoMCwwLDAsMC42KTtib3gtc2hhZG93OjAgMCA3cHggcmdiYSgwLDAsMCwwLjYpO3otaW5kZXg6MjE0NzQ4MzY0NjtiYWNrZ3JvdW5kOiNmZmZ9I3BpeGVscGVyZmVjdCAqe2ZvbnQtZmFtaWx5OkFyaWFsLEhlbHZldGljYSxzYW5zLXNlcmlmO2ZvbnQtc2l6ZToxMnB4O3RleHQtZGVjb3JhdGlvbjpub25lO2NvbG9yOiMzMzM7bWFyZ2luOjA7cGFkZGluZzowfSNwaXhlbHBlcmZlY3QgbGFiZWx7ZGlzcGxheTppbmxpbmV9I3BpeGVscGVyZmVjdCBpbnB1dHt3aWR0aDphdXRvO2hlaWdodDphdXRvO2JhY2tncm91bmQ6bm9uZTtib3JkZXI6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9ja30jcGl4ZWxwZXJmZWN0IGlucHV0W3R5cGU9InJhZGlvIl17bWFyZ2luOjNweCAzcHggMCA1cHh9I3BpeGVscGVyZmVjdCAjcGl4ZWxwZXJmZWN0LWNvbnRlbnQ+ZGl2e292ZXJmbG93OmhpZGRlbjtoZWlnaHQ6MjBweDtsaW5lLWhlaWdodDoyMHB4O3BhZGRpbmc6NXB4IDB9I3BpeGVscGVyZmVjdCAucGl4ZWxwZXJmZWN0LWxhYmVse3dpZHRoOjU1cHg7cGFkZGluZy1yaWdodDo1cHg7dGV4dC1hbGlnbjpyaWdodDtkaXNwbGF5OmJsb2NrO2Zsb2F0OmxlZnQ7Zm9udC13ZWlnaHQ6Ym9sZH0jcGl4ZWxwZXJmZWN0IGlucHV0W3R5cGU9InRleHQiXXt3aWR0aDozNXB4O2hlaWdodDoxNHB4O3BhZGRpbmc6MnB4O2JvcmRlcjoxcHggc29saWQgI2MwYzBjMDstbW96LWJvcmRlci1yYWRpdXM6M3B4Oy13ZWJraXQtYm9yZGVyLXJhZGl1czozcHg7LW8tYm9yZGVyLXJhZGl1czozcHg7LW1zLWJvcmRlci1yYWRpdXM6M3B4O2JvcmRlci1yYWRpdXM6M3B4O2JhY2tncm91bmQ6I2ZmZjtjb2xvcjojMzMzO3BhZGRpbmc6MnB4fSNwaXhlbHBlcmZlY3QgLnBpeGVscGVyZmVjdC1idXR0b257d2lkdGg6MjBweDtoZWlnaHQ6MjBweDtkaXNwbGF5OmJsb2NrO2Zsb2F0OnJpZ2h0O21hcmdpbi1sZWZ0OjRweDtjb2xvcjojZmZmO3RleHQtYWxpZ246Y2VudGVyO2xpbmUtaGVpZ2h0OjIwcHg7LW1vei1ib3JkZXItcmFkaXVzOjRweDstd2Via2l0LWJvcmRlci1yYWRpdXM6NHB4Oy1vLWJvcmRlci1yYWRpdXM6NHB4Oy1tcy1ib3JkZXItcmFkaXVzOjRweDtib3JkZXItcmFkaXVzOjRweDtmb250LXNpemU6MTZweDtjdXJzb3I6cG9pbnRlcn0jcGl4ZWxwZXJmZWN0IC5waXhlbHBlcmZlY3QtYnV0dG9uOmhvdmVye29wYWNpdHk6Ljh9I3BpeGVscGVyZmVjdCAucGl4ZWxwZXJmZWN0LWJ1dHRvbiwjcGl4ZWxwZXJmZWN0IC5waXhlbHBlcmZlY3QtcmFuZ2V7YmFja2dyb3VuZDojYjZiNmI2IHVybChkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EZGhBUUFVQUlRVUFLS2lvcVdscGFlbnA2cXFxcXlzcksrdnI3R3hzYlMwdExhMnRybTV1YnU3dTc2K3ZzREF3TVBEdzhYRnhjakl5TXJLeXMzTnpjL1B6OUxTMHYvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL3l3QUFBQUFBUUFVQUFBRkVlQWtSZERqTk15aUpNaGhGTVFnQkVBSUFEcz0pIHJlcGVhdC14IGNlbnRlciBjZW50ZXJ9I3BpeGVscGVyZmVjdCAjcGl4ZWxwZXJmZWN0LXRvcHttYXJnaW46LTEwcHggLTEwcHggMDtwYWRkaW5nOjEwcHg7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2RhZGFkYTtsaW5lLWhlaWdodDoyMHB4O2N1cnNvcjptb3ZlfSNwaXhlbHBlcmZlY3QgI3BpeGVscGVyZmVjdC1sYW5nLXl7bWFyZ2luLWxlZnQ6MTBweH0jcGl4ZWxwZXJmZWN0ICNwaXhlbHBlcmZlY3QtdmVydGljYWwtdG9we2xpbmUtaGVpZ2h0OjZweH0jcGl4ZWxwZXJmZWN0ICNwaXhlbHBlcmZlY3QtdmVydGljYWwtYm90dG9te2xpbmUtaGVpZ2h0OjMwcHh9I3BpeGVscGVyZmVjdCAjcGl4ZWxwZXJmZWN0LWhvcml6b250YWwtbGVmdHttYXJnaW4tbGVmdDowfSNwaXhlbHBlcmZlY3QgI3BpeGVscGVyZmVjdC1vcGFjaXR5LXJhbmdle3dpZHRoOjkwcHg7aGVpZ2h0OjIwcHg7dmVydGljYWwtYWxpZ246bWlkZGxlO21hcmdpbi1sZWZ0OjVweH0jcGl4ZWxwZXJmZWN0ICNwaXhlbHBlcmZlY3Qtb3BhY2l0eS1yYW5nZS5waXhlbHBlcmZlY3QtcmFuZ2V7aGVpZ2h0OjZweDtwb3NpdGlvbjpyZWxhdGl2ZTttYXJnaW46N3B4IGluaGVyaXQ7ZGlzcGxheTppbmxpbmUtYmxvY2t9I3BpeGVscGVyZmVjdCAjcGl4ZWxwZXJmZWN0LW9wYWNpdHktcmFuZ2UucGl4ZWxwZXJmZWN0LXJhbmdlIC5waXhlbHBlcmZlY3Qtc2xpZGVye2Rpc3BsYXk6YmxvY2s7d2lkdGg6MTRweDtoZWlnaHQ6MTRweDstbW96LWJvcmRlci1yYWR1czo3cHg7LXdlYmtpdC1ib3JkZXItcmFkaXVzOjdweDstby1ib3JkZXItcmFkaXVzOjdweDstbXMtYm9yZGVyLXJhZGl1czo3cHg7Ym9yZGVyLXJhZGl1czo3cHg7YmFja2dyb3VuZDojY2NjO3Bvc2l0aW9uOmFic29sdXRlO3RvcDotNHB4O2xlZnQ6NTAlO21hcmdpbi1sZWZ0Oi03cHg7Y3Vyc29yOm1vdmV9I3BpeGVscGVyZmVjdCAjcGl4ZWxwZXJmZWN0LWNvbnRlbnQgI3BpeGVscGVyZmVjdC1hZGRsYXllcntib3JkZXItdG9wOjFweCBzb2xpZCAjZGFkYWRhO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNkYWRhZGE7bWFyZ2luOjAgLTEwcHg7cGFkZGluZzo1cHggMTBweH0jcGl4ZWxwZXJmZWN0ICNwaXhlbHBlcmZlY3QtY29udGVudCAjcGl4ZWxwZXJmZWN0LWFkZGxheWVyICNwaXhlbHBlcmZlY3QtZmlsZXt3aWR0aDoxMTBweH0jcGl4ZWxwZXJmZWN0ICNwaXhlbHBlcmZlY3QtY29udGVudCAjcGl4ZWxwZXJmZWN0LWFkZGxheWVyICNwaXhlbHBlcmZlY3QtZmlsZWlucHV0e2Rpc3BsYXk6bm9uZX0jcGl4ZWxwZXJmZWN0ICNwaXhlbHBlcmZlY3QtY29udGVudCAjcGl4ZWxwZXJmZWN0LWxheWVyc3toZWlnaHQ6YXV0bztvdmVyZmxvdzphdXRvfSNwaXhlbHBlcmZlY3QgI3BpeGVscGVyZmVjdC1jb250ZW50ICNwaXhlbHBlcmZlY3QtbGF5ZXJzIC5waXhlbHBlcmZlY3QtbGF5ZXJ7bWF4LWhlaWdodDoxMjBweDtwYWRkaW5nOjVweCAzMHB4IDVweCA1cHg7LW1vei1ib3JkZXItcmFkaXVzOjEwcHg7LXdlYmtpdC1ib3JkZXItcmFkaXVzOjEwcHg7LW8tYm9yZGVyLXJhZGl1czoxMHB4Oy1tcy1ib3JkZXItcmFkaXVzOjEwcHg7Ym9yZGVyLXJhZGl1czoxMHB4O292ZXJmbG93OmF1dG87cG9zaXRpb246cmVsYXRpdmU7dGV4dC1hbGlnbjpjZW50ZXI7YmFja2dyb3VuZDojZmZmO21hcmdpbi1ib3R0b206NXB4fSNwaXhlbHBlcmZlY3QgI3BpeGVscGVyZmVjdC1jb250ZW50ICNwaXhlbHBlcmZlY3QtbGF5ZXJzIC5waXhlbHBlcmZlY3QtbGF5ZXIsI3BpeGVscGVyZmVjdCAjcGl4ZWxwZXJmZWN0LWNvbnRlbnQgI3BpeGVscGVyZmVjdC1sYXllcnMgLnBpeGVscGVyZmVjdC1sYXllciBpbWd7bWF4LXdpZHRoOjE2NXB4O21heC1oZWlnaHQ6MTIwcHg7dmVydGljYWwtYWxpZ246dG9wfSNwaXhlbHBlcmZlY3QgI3BpeGVscGVyZmVjdC1jb250ZW50ICNwaXhlbHBlcmZlY3QtbGF5ZXJzIC5waXhlbHBlcmZlY3QtbGF5ZXItc2VsZWN0ZWR7YmFja2dyb3VuZDojZWRlZmY0fSNwaXhlbHBlcmZlY3QgI3BpeGVscGVyZmVjdC1jb250ZW50ICNwaXhlbHBlcmZlY3QtbGF5ZXJzIC5waXhlbHBlcmZlY3QtYnV0dG9ue3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1cHg7cmlnaHQ6NXB4fSNwaXhlbHBlcmZlY3QgI3BpeGVscGVyZmVjdC1jb250ZW50ICNwaXhlbHBlcmZlY3QtZHJvcC1maWxle3dpZHRoOjE5NHB4O2hlaWdodDoxMjRweDtib3JkZXI6M3B4IGRhc2hlZCAjZWRlZmY0O2xpbmUtaGVpZ2h0OjExNHB4O3RleHQtYWxpZ246Y2VudGVyO2NvbG9yOiM5OTk7LW1vei1ib3JkZXItcmFkaXVzOjEwcHg7LXdlYmtpdC1ib3JkZXItcmFkaXVzOjEwcHg7LW8tYm9yZGVyLXJhZGl1czoxMHB4Oy1tcy1ib3JkZXItcmFkaXVzOjEwcHg7Ym9yZGVyLXJhZGl1czoxMHB4fSNwaXhlbHBlcmZlY3QgI3BpeGVscGVyZmVjdC1jb250ZW50ICNwaXhlbHBlcmZlY3QtZHJvcC1maWxlLmRyYWdvdmVye2JhY2tncm91bmQ6I2ZkZmQ5Nn0jcGl4ZWxwZXJmZWN0ICNwaXhlbHBlcmZlY3QtY29udGVudCAjcGl4ZWxwZXJmZWN0LWRyb3AtZmlsZSBzcGFue2ZvbnQtc2l6ZToxOHB4fSNwaXhlbHBlcmZlY3Qtb3ZlcmxheXtwb3NpdGlvbjphYnNvbHV0ZTtjdXJzb3I6bW92ZX0jcGl4ZWxwZXJmZWN0LWhlbHAtcG9wdXB7YmFja2dyb3VuZDpyZ2JhKDAsMCwwLDAuNyk7cG9zaXRpb246Zml4ZWQ7d2lkdGg6NzQwcHg7aGVpZ2h0OjQwMHB4O3RvcDo1MCU7bGVmdDo1MCU7bWFyZ2luOi0yMDBweCAwIDAgLTM5MHB4Oy1tb3otYm9yZGVyLXJhZGl1czoyMHB4Oy13ZWJraXQtYm9yZGVyLXJhZGl1czoyMHB4Oy1tcy1ib3JkZXItcmFkaXVzOjIwcHg7LW8tYm9yZGVyLXJhZGl1czoyMHB4O2JvcmRlci1yYWRpdXM6MjBweDt6LWluZGV4OjIxNDc0ODM2NDQ7cGFkZGluZzoyMHB4IDIwcHggMTBweDtmb250LXNpemU6MTJweDtvcGFjaXR5OjB9I3BpeGVscGVyZmVjdC1oZWxwLXBvcHVwPip7Y29sb3I6I2ZmZjtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjttYXJnaW46MDtwYWRkaW5nOjB9I3BpeGVscGVyZmVjdC1oZWxwLXBvcHVwIGgxe2ZvbnQtc2l6ZToyMHB4O21hcmdpbjowIDAgMTBweH0jcGl4ZWxwZXJmZWN0LWhlbHAtcG9wdXAgaDJ7Zm9udC1zaXplOjE2cHg7Ym9yZGVyLWJvdHRvbTpzb2xpZCAxcHggI2NjYzttYXJnaW46MCAwIDVweH0jcGl4ZWxwZXJmZWN0LWhlbHAtcG9wdXAgLnBpeGVscGVyZmVjdC1zaG9ydGN1dHN7d2lkdGg6MzYwcHg7bWFyZ2luOjA7ZmxvYXQ6bGVmdH0jcGl4ZWxwZXJmZWN0LWhlbHAtcG9wdXAgLnBpeGVscGVyZmVjdC1zaG9ydGN1dHMgZGx7b3ZlcmZsb3c6aGlkZGVufSNwaXhlbHBlcmZlY3QtaGVscC1wb3B1cCAucGl4ZWxwZXJmZWN0LXNob3J0Y3V0cyBkbCBkdHtmbG9hdDpsZWZ0O2NsZWFyOmxlZnQ7d2lkdGg6OTBweDtmb250LXdlaWdodDpib2xkO2ZvbnQtc2l6ZToxNHB4O2xpbmUtaGVpZ2h0OjE4cHh9I3BpeGVscGVyZmVjdC1oZWxwLXBvcHVwIC5waXhlbHBlcmZlY3Qtc2hvcnRjdXRzIGRsIGRke2Zsb2F0OmxlZnQ7bWFyZ2luOjA7cGFkZGluZzowO2xpbmUtaGVpZ2h0OjE4cHh9I3BpeGVscGVyZmVjdC1oZWxwLXBvcHVwIC5waXhlbHBlcmZlY3Qtc2hvcnRjdXRzKy5waXhlbHBlcmZlY3Qtc2hvcnRjdXRze21hcmdpbi1sZWZ0OjIwcHh9",HTML:'<div id="pixelperfect-top"><span id="pixelperfect-lang-product-name">PixelPerfect</span><a href="#" class="pixelperfect-button" id="pixelperfect-hidden">&#10008;</a><a href="#" class="pixelperfect-button" id="pixelperfect-minimized">&#10134;</a><a href="#" class="pixelperfect-button" id="pixelperfect-active">&#9899;</a><a href="#" class="pixelperfect-button" id="pixelperfect-help">?</a></div><div id="pixelperfect-content"><div><span id="pixelperfect-lang-overlay" class="pixelperfect-label">Overlay</span><label for="pixelperfect-overlay-over"><input type="radio" name="pixelperfect-overlay" id="pixelperfect-overlay-over" />&nbsp;<span id="pixelperfect-lang-overlay-over">Over</span></label><label for="pixelperfect-overlay-below"><input type="radio" name="pixelperfect-overlay" id="pixelperfect-overlay-below" />&nbsp;<span id="pixelperfect-lang-overlay-below">Below</span></label></div><div><label for="pixelperfect-opacity"><span id="pixelperfect-lang-opacity" class="pixelperfect-label">Opacity</span></label><input type="text" id="pixelperfect-opacity" data-min="0" data-max="100" /><input type="range" min="0" max="100" step="1" id="pixelperfect-opacity-range" /></div><div><span id="pixelperfect-lang-position" class="pixelperfect-label">Position</span><label for="pixelperfect-x"><span id="pixelperfect-lang-x">X</span>:&nbsp;<input type="text" id="pixelperfect-x" /></label><label for="pixelperfect-y"><span id="pixelperfect-lang-y">Y</span>:&nbsp;<input type="text" id="pixelperfect-y" /></label></div><div id="pixelperfect-aligns"><span id="pixelperfect-lang-align" class="pixelperfect-label">Align</span><a href="#" class="pixelperfect-button" id="pixelperfect-vertical-bottom">&#9531;</a><a href="#" class="pixelperfect-button" id="pixelperfect-vertical-middle">&#9472;</a><a href="#" class="pixelperfect-button" id="pixelperfect-vertical-top">&#9523;</a><a href="#" class="pixelperfect-button" id="pixelperfect-horizontal-right">&#9515;</a><a href="#" class="pixelperfect-button" id="pixelperfect-horizontal-center">&#9475;</a><a href="#" class="pixelperfect-button" id="pixelperfect-horizontal-left">&#9507;</a></div><div id="pixelperfect-addlayer"><span id="pixelperfect-lang-file" class="pixelperfect-label"><label for="pixelperfect-file">File</label></span><input type="text" id="pixelperfect-file" /><input type="file" id="pixelperfect-fileinput" accept="image/*" /><a href="#" class="pixelperfect-button" id="pixelperfect-upload-file">&#8683;</a></div><div id="pixelperfect-layers"></div><div id="pixelperfect-drop-file"><span id="pixelperfect-lang-drophere">Drop a file here...</span></div></div><div id="pixelperfect-help-popup"><h1>Shortcut keys</h1><div class="pixelperfect-shortcuts"><h2>PixelPerfect</h2><dl id="pixelperfect-shortcuts-pixelperfect"><dt>CTRL + ?</dt><dd>Show this help</dd><dt>CTRL + X</dt><dd>Show/hide overlay</dd><dt>CTRL + M</dt><dd>Minimize/Revert PixelPerfect</dd><dt>CTRL + H</dt><dd>Show/Hide PixelPerfect</dd></dl><h2>Overlay</h2><dl id="pixelperfect-shortcuts-overlay"><dt>CTRL + O, O</dt><dd>Bring Overlay to front (over HTML)</dd><dt>CTRL + O, B</dt><dd>Bring Overlay to back (behind HTML)</dd></dl><h2>Position</h2><dl id="pixelperfect-shortcuts-position"><dt>CTRL + P, X</dt><dd>Focus on X position input</dd><dt>CTRL + P, Y</dt><dd>Focus on Y position input</dd></dl><h2>File handling</h2><dl id="pixelperfect-shortcuts-file"><dt>CTRL + F, U</dt><dd>Focus on URL input</dd><dt>CTRL + F, F</dt><dd>Bring up file upload dialog</dd></dl></div><div class="pixelperfect-shortcuts"><h2>Alignment</h2><dl id="pixelperfect-shortcuts-align"><dt>CTRL + A, L</dt><dd>Horizontally align overlay left</dd><dt>CTRL + A, C</dt><dd>Horizontally align overlay center</dd><dt>CTRL + A, R</dt><dd>Horizontally align overlay right</dd><dt>CTRL + A, T</dt><dd>Vertically align overlay top</dd><dt>CTRL + A, M</dt><dd>Vertically align overlay middle</dd><dt>CTRL + A, B</dt><dd>Vertically align overlay bottom</dd></dl><h2>Opacity</h2><dl id="pixelperfect-shortcuts-opacity"><dt>CTRL + T</dt><dd>Focus on opacity input</dd><dt>CTRL + &lt;</dt><dd>Decrease opacity</dd><dt>CTRL + &gt;</dt><dd>Increase opacity</dd></dl><h2>Layers</h2><dl id="pixelperfect-shortcuts-layers"><dt>CTRL + 1-9/0</dt><dd>Switch to specified layer</dd><dt>CTRL + [</dt><dd>Switch to previous layer</dd><dt>CTRL + ]</dt><dd>Switch to next layer</dd><dt>CTRL + R</dt><dd>Remove active layer</dd></dl></div></div>',DEFAULTS:{overlay:"below",opacity:"50",position:{x:0,y:0},minimized:!1,hidden:!1,active:!0},options:{overlay:!1,opacity:!1,position:!1,align:!1,minimized:!1,hidden:!1,active:!1},layers:[],wrapper:null,help:function(){var e=u("#pixelperfect-help-popup");e.animate({opacity:e.elements[0].visible?0:1}),e.elements[0].style.zIndex=e.elements[0].visible?2147483644:2147483647,e.elements[0].visible=!e.elements[0].visible},refreshOverlay:function(e){var t;e!==undefined?(u("#pixelperfect-overlay").remove(),t=new Image,t.src=localStorage.getItem(e),t.setAttribute("id","pixelperfect-overlay"),document.body.appendChild(t),i.makeDraggable(u(t),{remember:!1,onDrop:function(){o.options.position.x=parseInt(this.style.left,10),o.options.position.y=parseInt(this.style.top,10),o.refreshInterface.call(o)}})):t=document.getElementById("pixelperfect-overlay");if(!t)return!1;this.options.overlay==="below"?(u(this.wrapper).setOpacity(this.options.opacity),u(t).setOpacity(100),t.style.zIndex="-2147483645"):(u(this.wrapper).setOpacity(100),u(t).setOpacity(this.options.opacity),t.style.zIndex="2147483645"),t.style.left=this.options.position.x+"px",t.style.top=this.options.position.y+"px",this.updateOptions()},refreshInterface:function(){var e,t=u("#pixelperfect #pixelperfect-layers").elements[0],n;this.options.minimized?document.getElementById("pixelperfect-content").style.display="none":document.getElementById("pixelperfect-content").style.display="block",this.options.hidden?document.getElementById("pixelperfect").style.display="none":document.getElementById("pixelperfect").style.display="block",document.getElementById("pixelperfect-overlay")&&(this.options.active?(document.getElementById("pixelperfect-overlay").style.display="block",this.refreshOverlay()):(document.getElementById("pixelperfect-overlay").style.display="none",u("body > .pixelperfect-wrapper").setOpacity(100))),this.updateOptions(),this.storeOptions(),setTimeout(function(){var r=u("#pixelperfect #pixelperfect-drop-file").elements[0];n=r?r.clientHeight:0,e=window.innerHeight-document.getElementById("pixelperfect").clientHeight-40+t.clientHeight,t.style.maxHeight=Math.max(n,e).toString()+"px"},40)},refreshOptions:function(){o.applyOptions(),o.storeOptions(),o.refreshOverlay()},updateOptions:function(){document.getElementById("pixelperfect-overlay-"+this.options.overlay).checked=!0,document.getElementById("pixelperfect-opacity").value=this.options.opacity,document.getElementById("pixelperfect-opacity-range").value=this.options.opacity,document.getElementById("pixelperfect-x").value=this.options.position.x,document.getElementById("pixelperfect-y").value=this.options.position.y},applyOptions:function(){this.options.overlay=document.getElementById("pixelperfect-overlay-over").checked?"over":"below",this.options.opacity=document.getElementById("pixelperfect-opacity").value,this.options.position.x=(parseInt(document.getElementById("pixelperfect-x").value,10)||0).toString(),this.options.position.y=(parseInt(document.getElementById("pixelperfect-y").value,10)||0).toString()},storeOptions:function(){var e;for(e in this.options)this.options.hasOwnProperty(e)&&(e==="position"?localStorage.setItem("pixelperfect:options:"+e,this.options[e].x+","+this.options[e].y):localStorage.setItem("pixelperfect:options:"+e,this.options[e]))},setDefaults:function(){var e;for(e in this.DEFAULTS)this.DEFAULTS.hasOwnProperty(e)&&!localStorage.getItem("pixelperfect:options:"+e)&&(e==="position"?localStorage.setItem("pixelperfect:options:"+e,this.DEFAULTS[e].x+","+this.DEFAULTS[e].y):localStorage.setItem("pixelperfect:options:"+e,this.DEFAULTS[e]))},align:function(e){var t=!1,n=!1,r=document.getElementById("pixelperfect-overlay");switch(e){case"left":t=0;break;case"center":t=Math.round(window.innerWidth/2-r.width/2);break;case"right":t=window.innerWidth-r.width;break;case"top":n=0;break;case"middle":n=Math.round(window.innerHeight/2-r.height/2);break;case"bottom":n=window.innerHeight-r.height}t!==!1&&(document.getElementById("pixelperfect-x").value=t),n!==!1&&(document.getElementById("pixelperfect-y").value=n),o.refreshOptions()},initOptions:function(){var e,t;for(e in this.options)this.options.hasOwnProperty(e)&&(e==="position"?(t=localStorage.getItem("pixelperfect:options:"+e).split(","),this.options[e]={},this.options[e].x=t[0],this.options[e].y=t[1]):e==="active"||e==="minimized"||e==="hidden"?this.options[e]=localStorage.getItem("pixelperfect:options:"+e)==="true":this.options[e]=localStorage.getItem("pixelperfect:options:"+e))},initFileHandling:function(){u("#pixelperfect-upload-file").event("click",function(e){e.preventDefault(),document.getElementById("pixelperfect-fileinput").click()}),u("#pixelperfect-fileinput").event("change",function(e){var t=new window.FileReader;e.preventDefault(),t.onload=function(e){r.insertLayer(e.target.result)},t.readAsDataURL(e.target.files[0])}.bind(this)),u("#pixelperfect-file").event("keypress",function(e){(e.keyCode===13||e.charCode===13)&&r.insertLayer(this.elements[0].value)})},initWrapper:function(){var e=document.createElement("div"),t=document.defaultView.getComputedStyle(document.body),n=document.body.attributes,r=document.defaultView.getComputedStyle(e),i,s,o;for(s in n)n.hasOwnProperty(s)&&e.setAttribute(n[s].name,n[s].value);for(s in t)!s.match(/^[0-9]/)&&s.match(/^background/)&&r[s]!==t[s]&&(i=r[s],e.style[s]=t[s],document.body.style[s]=i);e.className=document.body.className+" pixelperfect-wrapper",e.style.overflow="hidden",e.style.position="relative",e.style.margin="0",u("body > *").elements.every(function(t){return e.appendChild(t),!0}),document.body.appendChild(e),this.wrapper=e,o=function(){this.wrapper.style.minHeight=window.innerHeight.toString()+"px"}.bind(this),o(),window.addEventListener("resize",o)},initHTML:function(){var e=document.createElement("div"),t;e.setAttribute("id","pixelperfect"),e.innerHTML=this.HTML,document.body.appendChild(e),t=document.getElementById("pixelperfect-help-popup"),document.body.appendChild(t),t.visible=!1},initStyles:function(){var e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("type","text/css"),e.setAttribute("media","all"),e.setAttribute("href","data:text/css;base64,"+this.STYLES),document.head.appendChild(e)},initInterfaceEvents:function(){u("#pixelperfect-overlay-over, #pixelperfect-overlay-below, #pixelperfect-opacity, #pixelperfect-x, #pixelperfect-y").event("change",function(){document.getElementById("pixelperfect-opacity-range").value=document.getElementById("pixelperfect-opacity").value,this.applyOptions.call(this),this.storeOptions.call(this),this.refreshOverlay.call(this)}.bind(this)),u("#pixelperfect-aligns > .pixelperfect-button").event("click",function(e){e.preventDefault(),o.align(this.elements[0].getAttribute("id").replace(/pixelperfect-[a-z]+-/,""))}),u("#pixelperfect-top > .pixelperfect-button").event("click",function(e){var t=this.elements[0].getAttribute("id").replace("pixelperfect-","");e.preventDefault(),t==="help"?o.help():(o.options[t]=!o.options[t],o.refreshInterface())}),u("#pixelperfect-opacity-range").event("change",function(){document.getElementById("pixelperfect-opacity").value=this.elements[0].value,o.applyOptions(),o.refreshInterface()})},setParam:function(e,t){typeof e=="string"&&(e=u("#pixelperfect-"+e)),e.elements[0].getAttribute("data-max")&&(t=Math.min(parseInt(e.elements[0].getAttribute("data-max"),10),t)),e.elements[0].getAttribute("data-min")&&(t=Math.max(parseInt(e.elements[0].getAttribute("data-min"),10),t)),e.elements[0].value=t,o.refreshOptions()},initKeyEvents:function(){var e=!1,n=!1,i=!1,s=!1;u("#pixelperfect-opacity, #pixelperfect-x, #pixelperfect-y").event(t.keys.arrowEvent,function(r){var u=parseInt(this.elements[0].value,10),a=r.which===0?r.keyCode:r.which;if(i||e||n||s){r.preventDefault();return}if(a===t.keys.UP||a===t.keys.DOWN)r.preventDefault(),u+=a===t.keys.UP?1:-1;o.setParam(this,u)}),u(document).event(t.keys.event,function(u){var a=!1,f;e&&!u.ctrlKey&&u.which===t.keys.O&&(a=document.getElementById("pixelperfect-overlay-over")),e&&!u.ctrlKey&&u.which===t.keys.B&&(a=document.getElementById("pixelperfect-overlay-below")),a&&(a.setAttribute("checked","checked"),a.checked=!0),u.which!==17&&(e=u.ctrlKey&&u.which===t.keys["^O"]),n&&!u.ctrlKey&&u.which===t.keys.X&&document.getElementById("pixelperfect-x").focus(),n&&!u.ctrlKey&&u.which===t.keys.Y&&document.getElementById("pixelperfect-y").focus(),u.which!==17&&(n=u.ctrlKey&&u.which===t.keys["^P"]),i&&!u.ctrlKey&&u.which===t.keys.L&&o.align("left"),i&&!u.ctrlKey&&u.which===t.keys.C&&o.align("center"),i&&!u.ctrlKey&&u.which===t.keys.R&&o.align("right"),i&&!u.ctrlKey&&u.which===t.keys.T&&o.align("top"),i&&!u.ctrlKey&&u.which===t.keys.M&&o.align("middle"),i&&!u.ctrlKey&&u.which===t.keys.B&&o.align("bottom"),u.which!==17&&(i=u.ctrlKey&&u.which===t.keys["^A"]),s&&!u.ctrlKey&&u.which===t.keys.F&&document.getElementById("pixelperfect-fileinput")&&document.getElementById("pixelperfect-fileinput").click(),s&&!u.ctrlKey&&u.which===t.keys.U&&document.getElementById("pixelperfect-file").focus(),u.which!==17&&(s=u.ctrlKey&&u.which===t.keys["^F"]),u.ctrlKey&&u.which>=48&&u.which<=57&&r.setByIndex(u.which===48?9:u.which-49),u.ctrlKey&&u.which===t.keys["^]"]&&r.next(),u.ctrlKey&&u.which===t.keys["^["]&&r.previous(),u.ctrlKey&&u.which===t.keys["^R"]&&r.removeLayer(r.fillSelected()),u.ctrlKey&&u.which===t.keys["^T"]&&document.getElementById("pixelperfect-opacity").focus(),u.ctrlKey&&u.which===t.keys["^>"]&&o.setParam("opacity",parseInt(o.options.opacity,10)+1),u.ctrlKey&&u.which===t.keys["^<"]&&o.setParam("opacity",o.options.opacity-1);if(u.ctrlKey&&(u.which===t.keys["^H"]||u.which===t.keys["^M"]||u.which===t.keys["^X"])){switch(u.which){case t.keys["^H"]:f="hidden";break;case t.keys["^M"]:f="minimized";break;case t.keys["^X"]:f="active"}o.options[f]=!o.options[f],o.refreshInterface()}u.ctrlKey&&u.which===t.keys["^?"]&&o.help(),o.refreshOptions()})},init:function(){this.setDefaults(),this.initOptions(),this.initWrapper(),this.initHTML(),this.initStyles(),this.initInterfaceEvents(),this.initKeyEvents(),i.init(),i.makeDraggable(u("#pixelperfect"),{handler:"#pixelperfect-top"}),i.catchFile(u("#pixelperfect-drop-file")),r.init(),this.initFileHandling(),this.refreshInterface()}},u=function(e,t,r){return new n(e,t,r)};window.$=u,window.onload=function(){e.init(),s.preLoad(),o.init(),s.postLoad()}})();