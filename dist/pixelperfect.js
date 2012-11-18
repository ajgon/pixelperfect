(function(){"use strict";var e=function(e,t,n){var r,i,s,o;if(!e)return this.elements=[],this.elements_length=0,this;if(e.nodeName)return this.elements=[e],this.elements_length=1,this;typeof t=="boolean"&&(n=t,t=undefined),n===undefined&&(n=!0);if(n&&this.elements===null){r=[],t===undefined&&(t=document),i=t.querySelectorAll(e),s=i.length;for(o=0;o<s;o+=1)r.push(i[o]);this.elements=r,this.elements_length=r.length}return this};e.prototype={elements:null,elements_length:0,event:function(t,n){return this.elements.every(function(r){return r.addEventListener(t,n.bind(new e(r))),r.events===undefined&&(r.events={}),r.events[t]=n,!0}),this},remove:function(){return this.elements.every(function(e){return e.parentNode.removeChild(e),!0}),this},removeClass:function(e){return this.elements.every(function(t){return t.className=t.className.replace(new RegExp(e,"g"),"").replace(/^\s+|\s+$/,""),!0}.bind(this)),this},addClass:function(e){return this.removeClass(e),this.elements.every(function(t){return t.className+=" "+e,!0}.bind(this)),this},setOpacity:function(e){return this.elements.every(function(t){return t.style.opacity=(parseInt(e,10)/100).toString(),!0}.bind(this)),this},animate:function(e,t){t===undefined&&(t=500),this.elements.every(function(n){var r;if(e.top)switch(e.top){case"top":e.top="0px";break;case"middle":e.top=((window.innerHeight-n.clientHeight)/2).toString()+"px";break;case"bottom":e.top=(window.innerHeight-n.clientHeight).toString()+"px";break;default:e.top=parseInt(e.top,10).toString()+"px"}if(e.left)switch(e.left){case"left":e.left="0px";break;case"center":e.left=((window.innerWidth-n.clientWidth)/2).toString()+"px";break;case"right":e.left=(window.innerWidth-n.clientWidth).toString()+"px";break;default:e.left=parseInt(e.left,10).toString()+"px"}n.style.transitionDuration=(t/1e3).toString()+"s";for(r in e)e.hasOwnProperty(r)&&(n.style[r]=e[r])}.bind(this))}};var t={makeDraggable:function(e,t){var n;t===undefined&&(t={}),t={handler:t.handler===undefined?!1:t.handler,remember:t.remember===undefined?!0:t.remember,onDrag:t.onDrag===undefined?function(){}:t.onDrag,onDrop:t.onDrop===undefined?function(){}:t.onDrop,onMove:t.onMove===undefined?function(){}:t.onMove};for(n=0;n<e.elements_length;n+=1)t.handler?(t.handler=e.elements[n].querySelector(t.handler),t.handler||(t.handler=e.elements[n])):t.handler=e.elements[n],e.elements[n].options=t,t.handler.addEventListener("mousedown",this.catchHandlerEvent.bind(e.elements[n])),t.handler.draggable=!0},catchHandlerEvent:function(e){e.preventDefault(),document.currentDragged=this,document.currentDragged.mouseDiffX=e.pageX-this.offsetLeft,document.currentDragged.mouseDiffY=e.pageY-this.offsetTop,this.options.onDrag.call(this,e)},catchFileDragEvent:function(e){e.stopPropagation(),e.preventDefault(),e.type==="dragover"?e.target.className=e.type:e.target.className=""},catchFileDropEvent:function(e){var t,r=e.dataTransfer.files,i=r.length;e.stopPropagation(),e.preventDefault(),e.target.className="";for(t=0;t<i;t+=1)n.insertLayer(window.URL.createObjectURL(r[t]))},catchFile:function(e){var t,n,r=["dragenter","dragexit","dragover"];for(t=0;t<e.elements_length;t+=1){for(n=0;n<3;n+=1)e.elements[t].addEventListener(r[n],this.catchFileDragEvent,!1);e.elements[t].addEventListener("drop",this.catchFileDropEvent,!1)}},init:function(){var e,t,n;document.addEventListener("mouseup",function(e){this.currentDragged&&(this.currentDragged.options.remember&&localStorage.setItem("pixelperfect:draganddrop:"+this.currentDragged.getAttribute("id"),parseInt(this.currentDragged.style.left,10).toString()+","+parseInt(this.currentDragged.style.top,10).toString()),this.currentDragged.options.onDrop.call(this.currentDragged,e)),this.currentDragged=!1}),document.addEventListener("mousemove",function(e){this.currentDragged&&(this.currentDragged.style.right="auto",this.currentDragged.style.bottom="auto",this.currentDragged.style.left=(e.pageX-this.currentDragged.mouseDiffX).toString()+"px",this.currentDragged.style.top=(e.pageY-this.currentDragged.mouseDiffY).toString()+"px",this.currentDragged.options.onMove.call(this.currentDragged,e))});for(e in localStorage)localStorage.hasOwnProperty(e)&&e.match(/pixelperfect:draganddrop/)&&(t=document.getElementById(e.replace("pixelperfect:draganddrop:","")),n=localStorage.getItem(e).split(","),t.style.left=n[0]+"px",t.style.top=n[1]+"px")}},n={list:[],addToList:function(e){this.list.indexOf(e)===-1&&this.list.push(e),localStorage.setItem("pixelperfect:list",this.list.join(","))},removeFromList:function(e){var t=this.list.indexOf(e);t!==-1&&this.list.splice(t,1),localStorage.setItem("pixelperfect:list",this.list.join(","))},insertLayer:function(e,t){var n=document.createElement("div"),r=document.createElement("a"),i=new Image,s=document.createElement("canvas"),o=s.getContext("2d");n.className="pixelperfect-layer",r.className="pixelperfect-button",r.innerHTML="&#10008;",n.appendChild(i),n.appendChild(r),e.match(/(^blob:)|(^http)/)?i.onload=function(){var t,r;t=i.src.replace(/^blob:/,""),r="pixelperfect:layer:"+t.match(/[a-zA-Z0-9]+/g).join(""),s.width=i.width,s.height=i.height,o.drawImage(i,0,0);try{localStorage.setItem(r,s.toDataURL("image/jpeg"))}catch(u){localStorage.setItem(r,e)}n.setAttribute("data-id",r),e.match(/^blob:/)&&window.URL.revokeObjectURL(t),this.appendLayer(n),this.selectLayer(this.fillSelected()),this.addToList(r)}.bind(this):(t!==undefined&&(n.setAttribute("data-id",t),this.addToList(t)),this.appendLayer(n),this.selectLayer(this.fillSelected())),i.src=e},appendLayer:function(e){s("#pixelperfect-layers").elements[0].appendChild(e)},selectLayer:function(e){e===undefined&&(e=this.fillSelected()),e&&(s("#pixelperfect-layers .pixelperfect-layer").removeClass("pixelperfect-layer-selected"),s('#pixelperfect-layers .pixelperfect-layer[data-id="'+e+'"]').addClass("pixelperfect-layer-selected"),localStorage.setItem("pixelperfect:selected",e),r.refreshOverlay(e))},removeLayer:function(e){s('#pixelperfect-layers .pixelperfect-layer[data-id="'+e+'"]').remove(),localStorage.removeItem(e),this.removeFromList(e),this.selectLayer(this.fillSelected()),s("#pixelperfect-layers .pixelperfect-layer").elements_length===0&&s("#pixelperfect-overlay").remove()},fillSelected:function(){var e,t=localStorage.getItem("pixelperfect:selected");if(!t||!localStorage.getItem(t))for(e in localStorage)if(localStorage.hasOwnProperty(e)&&e.match(/^pixelperfect:layer/)){t=e;break}return t},getSelected:function(){return s('#pixelperfect-layers .pixelperfect-layer-selected, #pixelperfect-layers .pixelperfect-layer[data-id="'+this.fillSelected()+'"]').elements[0]},next:function(){var e=this.getSelected();e&&e.nextSibling&&this.selectLayer(e.nextSibling.getAttribute("data-id"))},previous:function(){var e=this.getSelected();e&&e.previousSibling&&this.selectLayer(e.previousSibling.getAttribute("data-id"))},setByIndex:function(e){var t=s("#pixelperfect-layers .pixelperfect-layer").elements[e];t&&this.selectLayer(t.getAttribute("data-id"))},refresh:function(){var e,t=this.list.length;s("#pixelperfect-layers .pixelperfect-layer").remove();for(e=0;e<t;e+=1)this.list[e].match(/^pixelperfect:layer/)&&this.insertLayer(localStorage.getItem(this.list[e]),this.list[e]);this.selectLayer()},init:function(){var e=localStorage.getItem("pixelperfect:list");e&&(this.list=e.split(",")),this.refresh(),s("#pixelperfect-layers").event("click",function(e){var t;e.preventDefault(),e.target.className.match("pixelperfect-button")?n.removeLayer.call(n,e.target.parentNode.getAttribute("data-id")):(t=e.target.getAttribute("data-id"),t||(t=e.target.parentNode.getAttribute("data-id")),t&&n.selectLayer(t))})}},r={STYLES:"I3BpeGVscGVyZmVjdHt3aWR0aDoyMDBweDtwYWRkaW5nOjEwcHg7cG9zaXRpb246Zml4ZWQ7cmlnaHQ6MjBweDt0b3A6MjBweDtjdXJzb3I6ZGVmYXVsdDstbW96LWJvcmRlci1yYWRpdXM6OHB4Oy13ZWJraXQtYm9yZGVyLXJhZGl1czo4cHg7LW8tYm9yZGVyLXJhZGl1czo4cHg7LW1zLWJvcmRlci1yYWRpdXM6OHB4O2JvcmRlci1yYWRpdXM6OHB4Oy1tb3otYm94LXNoYWRvdzowIDAgN3B4IHJnYmEoMCwwLDAsMC42KTstd2Via2l0LWJveC1zaGFkb3c6MCAwIDdweCByZ2JhKDAsMCwwLDAuNik7LW8tYm94LXNoYWRvdzowIDAgN3B4IHJnYmEoMCwwLDAsMC42KTstbXMtYm94LXNoYWRvdzowIDAgN3B4IHJnYmEoMCwwLDAsMC42KTtib3gtc2hhZG93OjAgMCA3cHggcmdiYSgwLDAsMCwwLjYpO3otaW5kZXg6MjE0NzQ4MzY0NjtiYWNrZ3JvdW5kOiNmZmZ9I3BpeGVscGVyZmVjdCAqe2ZvbnQtZmFtaWx5OkFyaWFsLEhlbHZldGljYSxzYW5zLXNlcmlmO2ZvbnQtc2l6ZToxMnB4O3RleHQtZGVjb3JhdGlvbjpub25lO2NvbG9yOiMzMzM7bWFyZ2luOjA7cGFkZGluZzowfSNwaXhlbHBlcmZlY3QgbGFiZWx7ZGlzcGxheTppbmxpbmV9I3BpeGVscGVyZmVjdCBpbnB1dHt3aWR0aDphdXRvO2hlaWdodDphdXRvO2JhY2tncm91bmQ6bm9uZTtib3JkZXI6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9ja30jcGl4ZWxwZXJmZWN0IGlucHV0W3R5cGU9InJhZGlvIl17bWFyZ2luOjNweCAzcHggMCA1cHh9I3BpeGVscGVyZmVjdCAjcGl4ZWxwZXJmZWN0LWNvbnRlbnQ+ZGl2e292ZXJmbG93OmhpZGRlbjtoZWlnaHQ6MjBweDtsaW5lLWhlaWdodDoyMHB4O3BhZGRpbmc6NXB4IDB9I3BpeGVscGVyZmVjdCAucGl4ZWxwZXJmZWN0LWxhYmVse3dpZHRoOjU1cHg7cGFkZGluZy1yaWdodDo1cHg7dGV4dC1hbGlnbjpyaWdodDtkaXNwbGF5OmJsb2NrO2Zsb2F0OmxlZnQ7Zm9udC13ZWlnaHQ6Ym9sZH0jcGl4ZWxwZXJmZWN0IGlucHV0W3R5cGU9InRleHQiXXt3aWR0aDozNXB4O2hlaWdodDoxNHB4O3BhZGRpbmc6MnB4O2JvcmRlcjoxcHggc29saWQgI2MwYzBjMDstbW96LWJvcmRlci1yYWRpdXM6M3B4Oy13ZWJraXQtYm9yZGVyLXJhZGl1czozcHg7LW8tYm9yZGVyLXJhZGl1czozcHg7LW1zLWJvcmRlci1yYWRpdXM6M3B4O2JvcmRlci1yYWRpdXM6M3B4O2JhY2tncm91bmQ6I2ZmZjtjb2xvcjojMzMzO3BhZGRpbmc6MnB4fSNwaXhlbHBlcmZlY3QgLnBpeGVscGVyZmVjdC1idXR0b257d2lkdGg6MjBweDtoZWlnaHQ6MjBweDtkaXNwbGF5OmJsb2NrO2Zsb2F0OnJpZ2h0O21hcmdpbi1sZWZ0OjRweDtjb2xvcjojZmZmO3RleHQtYWxpZ246Y2VudGVyO2xpbmUtaGVpZ2h0OjIwcHg7LW1vei1ib3JkZXItcmFkaXVzOjRweDstd2Via2l0LWJvcmRlci1yYWRpdXM6NHB4Oy1vLWJvcmRlci1yYWRpdXM6NHB4Oy1tcy1ib3JkZXItcmFkaXVzOjRweDtib3JkZXItcmFkaXVzOjRweDtmb250LXNpemU6MTZweDtjdXJzb3I6cG9pbnRlcn0jcGl4ZWxwZXJmZWN0IC5waXhlbHBlcmZlY3QtYnV0dG9uOmhvdmVye29wYWNpdHk6Ljh9I3BpeGVscGVyZmVjdCAucGl4ZWxwZXJmZWN0LWJ1dHRvbiwjcGl4ZWxwZXJmZWN0IC5waXhlbHBlcmZlY3QtcmFuZ2V7YmFja2dyb3VuZDojYjZiNmI2IHVybChkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EZGhBUUFVQUlRVUFLS2lvcVdscGFlbnA2cXFxcXlzcksrdnI3R3hzYlMwdExhMnRybTV1YnU3dTc2K3ZzREF3TVBEdzhYRnhjakl5TXJLeXMzTnpjL1B6OUxTMHYvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL3l3QUFBQUFBUUFVQUFBRkVlQWtSZERqTk15aUpNaGhGTVFnQkVBSUFEcz0pIHJlcGVhdC14IGNlbnRlciBjZW50ZXJ9I3BpeGVscGVyZmVjdCAjcGl4ZWxwZXJmZWN0LXRvcHttYXJnaW46LTEwcHggLTEwcHggMDtwYWRkaW5nOjEwcHg7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2RhZGFkYTtsaW5lLWhlaWdodDoyMHB4O2N1cnNvcjptb3ZlfSNwaXhlbHBlcmZlY3QgI3BpeGVscGVyZmVjdC1sYW5nLXl7bWFyZ2luLWxlZnQ6MTBweH0jcGl4ZWxwZXJmZWN0ICNwaXhlbHBlcmZlY3QtdmVydGljYWwtdG9we2xpbmUtaGVpZ2h0OjZweH0jcGl4ZWxwZXJmZWN0ICNwaXhlbHBlcmZlY3QtdmVydGljYWwtYm90dG9te2xpbmUtaGVpZ2h0OjMwcHh9I3BpeGVscGVyZmVjdCAjcGl4ZWxwZXJmZWN0LWhvcml6b250YWwtbGVmdHttYXJnaW4tbGVmdDowfSNwaXhlbHBlcmZlY3QgI3BpeGVscGVyZmVjdC1vcGFjaXR5LXJhbmdle3dpZHRoOjkwcHg7aGVpZ2h0OjIwcHg7dmVydGljYWwtYWxpZ246bWlkZGxlO21hcmdpbi1sZWZ0OjVweH0jcGl4ZWxwZXJmZWN0ICNwaXhlbHBlcmZlY3Qtb3BhY2l0eS1yYW5nZS5waXhlbHBlcmZlY3QtcmFuZ2V7aGVpZ2h0OjZweDtwb3NpdGlvbjpyZWxhdGl2ZTttYXJnaW46N3B4IGluaGVyaXQ7ZGlzcGxheTppbmxpbmUtYmxvY2t9I3BpeGVscGVyZmVjdCAjcGl4ZWxwZXJmZWN0LW9wYWNpdHktcmFuZ2UucGl4ZWxwZXJmZWN0LXJhbmdlIC5waXhlbHBlcmZlY3Qtc2xpZGVye2Rpc3BsYXk6YmxvY2s7d2lkdGg6MTRweDtoZWlnaHQ6MTRweDstbW96LWJvcmRlci1yYWR1czo3cHg7LXdlYmtpdC1ib3JkZXItcmFkaXVzOjdweDstby1ib3JkZXItcmFkaXVzOjdweDstbXMtYm9yZGVyLXJhZGl1czo3cHg7Ym9yZGVyLXJhZGl1czo3cHg7YmFja2dyb3VuZDojY2NjO3Bvc2l0aW9uOmFic29sdXRlO3RvcDotNHB4O2xlZnQ6NTAlO21hcmdpbi1sZWZ0Oi03cHg7Y3Vyc29yOm1vdmV9I3BpeGVscGVyZmVjdCAjcGl4ZWxwZXJmZWN0LWNvbnRlbnQgI3BpeGVscGVyZmVjdC1hZGRsYXllcntib3JkZXItdG9wOjFweCBzb2xpZCAjZGFkYWRhO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNkYWRhZGE7bWFyZ2luOjAgLTEwcHg7cGFkZGluZzo1cHggMTBweH0jcGl4ZWxwZXJmZWN0ICNwaXhlbHBlcmZlY3QtY29udGVudCAjcGl4ZWxwZXJmZWN0LWFkZGxheWVyICNwaXhlbHBlcmZlY3QtZmlsZXt3aWR0aDoxMTBweH0jcGl4ZWxwZXJmZWN0ICNwaXhlbHBlcmZlY3QtY29udGVudCAjcGl4ZWxwZXJmZWN0LWFkZGxheWVyICNwaXhlbHBlcmZlY3QtZmlsZWlucHV0e2Rpc3BsYXk6bm9uZX0jcGl4ZWxwZXJmZWN0ICNwaXhlbHBlcmZlY3QtY29udGVudCAjcGl4ZWxwZXJmZWN0LWxheWVyc3toZWlnaHQ6YXV0bztvdmVyZmxvdzphdXRvfSNwaXhlbHBlcmZlY3QgI3BpeGVscGVyZmVjdC1jb250ZW50ICNwaXhlbHBlcmZlY3QtbGF5ZXJzIC5waXhlbHBlcmZlY3QtbGF5ZXJ7bWF4LWhlaWdodDoxMjBweDtwYWRkaW5nOjVweCAzMHB4IDVweCA1cHg7LW1vei1ib3JkZXItcmFkaXVzOjEwcHg7LXdlYmtpdC1ib3JkZXItcmFkaXVzOjEwcHg7LW8tYm9yZGVyLXJhZGl1czoxMHB4Oy1tcy1ib3JkZXItcmFkaXVzOjEwcHg7Ym9yZGVyLXJhZGl1czoxMHB4O292ZXJmbG93OmF1dG87cG9zaXRpb246cmVsYXRpdmU7dGV4dC1hbGlnbjpjZW50ZXI7YmFja2dyb3VuZDojZmZmO21hcmdpbi1ib3R0b206NXB4fSNwaXhlbHBlcmZlY3QgI3BpeGVscGVyZmVjdC1jb250ZW50ICNwaXhlbHBlcmZlY3QtbGF5ZXJzIC5waXhlbHBlcmZlY3QtbGF5ZXIsI3BpeGVscGVyZmVjdCAjcGl4ZWxwZXJmZWN0LWNvbnRlbnQgI3BpeGVscGVyZmVjdC1sYXllcnMgLnBpeGVscGVyZmVjdC1sYXllciBpbWd7bWF4LXdpZHRoOjE2NXB4O21heC1oZWlnaHQ6MTIwcHg7dmVydGljYWwtYWxpZ246dG9wfSNwaXhlbHBlcmZlY3QgI3BpeGVscGVyZmVjdC1jb250ZW50ICNwaXhlbHBlcmZlY3QtbGF5ZXJzIC5waXhlbHBlcmZlY3QtbGF5ZXItc2VsZWN0ZWR7YmFja2dyb3VuZDojZWRlZmY0fSNwaXhlbHBlcmZlY3QgI3BpeGVscGVyZmVjdC1jb250ZW50ICNwaXhlbHBlcmZlY3QtbGF5ZXJzIC5waXhlbHBlcmZlY3QtYnV0dG9ue3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1cHg7cmlnaHQ6NXB4fSNwaXhlbHBlcmZlY3QgI3BpeGVscGVyZmVjdC1jb250ZW50ICNwaXhlbHBlcmZlY3QtZHJvcC1maWxle3dpZHRoOjE5NHB4O2hlaWdodDoxMjRweDtib3JkZXI6M3B4IGRhc2hlZCAjZWRlZmY0O2xpbmUtaGVpZ2h0OjExNHB4O3RleHQtYWxpZ246Y2VudGVyO2NvbG9yOiM5OTk7LW1vei1ib3JkZXItcmFkaXVzOjEwcHg7LXdlYmtpdC1ib3JkZXItcmFkaXVzOjEwcHg7LW8tYm9yZGVyLXJhZGl1czoxMHB4Oy1tcy1ib3JkZXItcmFkaXVzOjEwcHg7Ym9yZGVyLXJhZGl1czoxMHB4fSNwaXhlbHBlcmZlY3QgI3BpeGVscGVyZmVjdC1jb250ZW50ICNwaXhlbHBlcmZlY3QtZHJvcC1maWxlLmRyYWdvdmVye2JhY2tncm91bmQ6I2ZkZmQ5Nn0jcGl4ZWxwZXJmZWN0ICNwaXhlbHBlcmZlY3QtY29udGVudCAjcGl4ZWxwZXJmZWN0LWRyb3AtZmlsZSBzcGFue2ZvbnQtc2l6ZToxOHB4fSNwaXhlbHBlcmZlY3Qtb3ZlcmxheXtwb3NpdGlvbjphYnNvbHV0ZTtjdXJzb3I6bW92ZX0jcGl4ZWxwZXJmZWN0LWhlbHAtcG9wdXB7YmFja2dyb3VuZDpyZ2JhKDAsMCwwLDAuNyk7cG9zaXRpb246Zml4ZWQ7d2lkdGg6NzQwcHg7aGVpZ2h0OjQwMHB4O3RvcDo1MCU7bGVmdDo1MCU7bWFyZ2luOi0yMDBweCAwIDAgLTM5MHB4Oy1tb3otYm9yZGVyLXJhZGl1czoyMHB4Oy13ZWJraXQtYm9yZGVyLXJhZGl1czoyMHB4Oy1tcy1ib3JkZXItcmFkaXVzOjIwcHg7LW8tYm9yZGVyLXJhZGl1czoyMHB4O2JvcmRlci1yYWRpdXM6MjBweDt6LWluZGV4OjIxNDc0ODM2NDc7cGFkZGluZzoyMHB4IDIwcHggMTBweDtmb250LXNpemU6MTJweDtvcGFjaXR5OjB9I3BpeGVscGVyZmVjdC1oZWxwLXBvcHVwPip7Y29sb3I6I2ZmZjtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjttYXJnaW46MDtwYWRkaW5nOjB9I3BpeGVscGVyZmVjdC1oZWxwLXBvcHVwIGgxe2ZvbnQtc2l6ZToyMHB4O21hcmdpbjowIDAgMTBweH0jcGl4ZWxwZXJmZWN0LWhlbHAtcG9wdXAgaDJ7Zm9udC1zaXplOjE2cHg7Ym9yZGVyLWJvdHRvbTpzb2xpZCAxcHggI2NjYzttYXJnaW46MCAwIDVweH0jcGl4ZWxwZXJmZWN0LWhlbHAtcG9wdXAgLnBpeGVscGVyZmVjdC1zaG9ydGN1dHN7d2lkdGg6MzYwcHg7bWFyZ2luOjA7ZmxvYXQ6bGVmdH0jcGl4ZWxwZXJmZWN0LWhlbHAtcG9wdXAgLnBpeGVscGVyZmVjdC1zaG9ydGN1dHMgZGx7b3ZlcmZsb3c6aGlkZGVufSNwaXhlbHBlcmZlY3QtaGVscC1wb3B1cCAucGl4ZWxwZXJmZWN0LXNob3J0Y3V0cyBkbCBkdHtmbG9hdDpsZWZ0O2NsZWFyOmxlZnQ7d2lkdGg6OTBweDtmb250LXdlaWdodDpib2xkO2ZvbnQtc2l6ZToxNHB4O2xpbmUtaGVpZ2h0OjE4cHh9I3BpeGVscGVyZmVjdC1oZWxwLXBvcHVwIC5waXhlbHBlcmZlY3Qtc2hvcnRjdXRzIGRsIGRke2Zsb2F0OmxlZnQ7bWFyZ2luOjA7cGFkZGluZzowO2xpbmUtaGVpZ2h0OjE4cHh9I3BpeGVscGVyZmVjdC1oZWxwLXBvcHVwIC5waXhlbHBlcmZlY3Qtc2hvcnRjdXRzKy5waXhlbHBlcmZlY3Qtc2hvcnRjdXRze21hcmdpbi1sZWZ0OjIwcHh9",HTML:'<div id="pixelperfect-top"><span id="pixelperfect-lang-product-name">PixelPerfect</span><a href="#" class="pixelperfect-button" id="pixelperfect-hidden">&#10008;</a><a href="#" class="pixelperfect-button" id="pixelperfect-minimized">&#10134;</a><a href="#" class="pixelperfect-button" id="pixelperfect-active">&#9899;</a><a href="#" class="pixelperfect-button" id="pixelperfect-help">?</a></div><div id="pixelperfect-content"><div><span id="pixelperfect-lang-overlay" class="pixelperfect-label">Overlay</span><label for="pixelperfect-overlay-over"><input type="radio" name="pixelperfect-overlay" id="pixelperfect-overlay-over" />&nbsp;<span id="pixelperfect-lang-overlay-over">Over</span></label><label for="pixelperfect-overlay-below"><input type="radio" name="pixelperfect-overlay" id="pixelperfect-overlay-below" />&nbsp;<span id="pixelperfect-lang-overlay-below">Below</span></label></div><div><label for="pixelperfect-opacity"><span id="pixelperfect-lang-opacity" class="pixelperfect-label">Opacity</span></label><input type="text" id="pixelperfect-opacity" data-min="0" data-max="100" /><input type="range" min="0" max="100" step="1" id="pixelperfect-opacity-range" /></div><div><span id="pixelperfect-lang-position" class="pixelperfect-label">Position</span><label for="pixelperfect-x"><span id="pixelperfect-lang-x">X</span>:&nbsp;<input type="text" id="pixelperfect-x" /></label><label for="pixelperfect-y"><span id="pixelperfect-lang-y">Y</span>:&nbsp;<input type="text" id="pixelperfect-y" /></label></div><div id="pixelperfect-aligns"><span id="pixelperfect-lang-align" class="pixelperfect-label">Align</span><a href="#" class="pixelperfect-button" id="pixelperfect-vertical-bottom">&#9531;</a><a href="#" class="pixelperfect-button" id="pixelperfect-vertical-middle">&#9472;</a><a href="#" class="pixelperfect-button" id="pixelperfect-vertical-top">&#9523;</a><a href="#" class="pixelperfect-button" id="pixelperfect-horizontal-right">&#9515;</a><a href="#" class="pixelperfect-button" id="pixelperfect-horizontal-center">&#9475;</a><a href="#" class="pixelperfect-button" id="pixelperfect-horizontal-left">&#9507;</a></div><div id="pixelperfect-addlayer"><span id="pixelperfect-lang-file" class="pixelperfect-label"><label for="pixelperfect-file">File</label></span><input type="text" id="pixelperfect-file" /><input type="file" id="pixelperfect-fileinput" accept="image/*" /><a href="#" class="pixelperfect-button" id="pixelperfect-upload-file">&#8683;</a></div><div id="pixelperfect-layers"></div><div id="pixelperfect-drop-file"><span id="pixelperfect-lang-drophere">Drop a file here...</span></div></div><div id="pixelperfect-help-popup"><h1>Shortcut keys</h1><div class="pixelperfect-shortcuts"><h2>PixelPerfect</h2><dl id="pixelperfect-shortcuts-pixelperfect"><dt>CTRL + ?</dt><dd>Show this help</dd><dt>CTRL + X</dt><dd>Show/hide overlay</dd><dt>CTRL + M</dt><dd>Minimize/Revert PixelPerfect</dd><dt>CTRL + H</dt><dd>Show/Hide PixelPerfect</dd></dl><h2>Overlay</h2><dl id="pixelperfect-shortcuts-overlay"><dt>CTRL + O, O</dt><dd>Bring Overlay to front (over HTML)</dd><dt>CTRL + O, B</dt><dd>Bring Overlay to back (behind HTML)</dd></dl><h2>Position</h2><dl id="pixelperfect-shortcuts-position"><dt>CTRL + P, X</dt><dd>Focus on X position input</dd><dt>CTRL + P, Y</dt><dd>Focus on Y position input</dd></dl><h2>File handling</h2><dl id="pixelperfect-shortcuts-file"><dt>CTRL + F, U</dt><dd>Focus on URL input</dd><dt>CTRL + F, F</dt><dd>Bring up file upload dialog</dd></dl></div><div class="pixelperfect-shortcuts"><h2>Alignment</h2><dl id="pixelperfect-shortcuts-align"><dt>CTRL + A, L</dt><dd>Horizontally align overlay left</dd><dt>CTRL + A, C</dt><dd>Horizontally align overlay center</dd><dt>CTRL + A, R</dt><dd>Horizontally align overlay right</dd><dt>CTRL + A, T</dt><dd>Vertically align overlay top</dd><dt>CTRL + A, M</dt><dd>Vertically align overlay middle</dd><dt>CTRL + A, B</dt><dd>Vertically align overlay bottom</dd></dl><h2>Opacity</h2><dl id="pixelperfect-shortcuts-opacity"><dt>CTRL + T</dt><dd>Focus on opacity input</dd><dt>CTRL + &lt;</dt><dd>Decrease opacity</dd><dt>CTRL + &gt;</dt><dd>Increase opacity</dd></dl><h2>Layers</h2><dl id="pixelperfect-shortcuts-layers"><dt>CTRL + 1-9/0</dt><dd>Switch to specified layer</dd><dt>CTRL + [</dt><dd>Switch to previous layer</dd><dt>CTRL + ]</dt><dd>Switch to next layer</dd></dl></div></div>',DEFAULTS:{overlay:"below",opacity:"50",position:{x:0,y:0},minimized:!1,hidden:!1,active:!0},options:{overlay:!1,opacity:!1,position:!1,align:!1,minimized:!1,hidden:!1,active:!1},layers:[],wrapper:null,help:function(){var e=s("#pixelperfect-help-popup");e.animate({opacity:e.elements[0].visible?0:1}),e.elements[0].visible=!e.elements[0].visible},refreshOverlay:function(e){var n;e!==undefined?(s("#pixelperfect-overlay").remove(),n=new Image,n.src=localStorage.getItem(e),n.setAttribute("id","pixelperfect-overlay"),document.body.appendChild(n),t.makeDraggable(s(n),{remember:!1,onDrop:function(){r.options.position.x=parseInt(this.style.left,10),r.options.position.y=parseInt(this.style.top,10),r.refreshInterface.call(r)}})):n=document.getElementById("pixelperfect-overlay");if(!n)return!1;this.options.overlay==="below"?(s(this.wrapper).setOpacity(this.options.opacity),s(n).setOpacity(100),n.style.zIndex="-2147483645"):(s(this.wrapper).setOpacity(100),s(n).setOpacity(this.options.opacity),n.style.zIndex="2147483645"),n.style.left=this.options.position.x+"px",n.style.top=this.options.position.y+"px",this.updateOptions()},refreshInterface:function(){var e,t=s("#pixelperfect #pixelperfect-layers").elements[0],n;this.options.minimized?document.getElementById("pixelperfect-content").style.display="none":document.getElementById("pixelperfect-content").style.display="block",this.options.hidden?document.getElementById("pixelperfect").style.display="none":document.getElementById("pixelperfect").style.display="block",document.getElementById("pixelperfect-overlay")&&(this.options.active?(document.getElementById("pixelperfect-overlay").style.display="block",this.refreshOverlay()):(document.getElementById("pixelperfect-overlay").style.display="none",s("body > .pixelperfect-wrapper").setOpacity(100))),this.updateOptions(),this.storeOptions(),setTimeout(function(){n=s("#pixelperfect #pixelperfect-drop-file").elements[0].clientHeight,e=window.innerHeight-document.getElementById("pixelperfect").clientHeight-40+t.clientHeight,t.style.maxHeight=Math.max(n,e).toString()+"px"},40)},refreshOptions:function(){r.applyOptions(),r.storeOptions(),r.refreshOverlay()},updateOptions:function(){document.getElementById("pixelperfect-overlay-"+this.options.overlay).checked=!0,document.getElementById("pixelperfect-opacity").value=this.options.opacity,document.getElementById("pixelperfect-opacity-range").value=this.options.opacity,document.getElementById("pixelperfect-x").value=this.options.position.x,document.getElementById("pixelperfect-y").value=this.options.position.y},applyOptions:function(){this.options.overlay=document.getElementById("pixelperfect-overlay-over").checked?"over":"below",this.options.opacity=document.getElementById("pixelperfect-opacity").value,this.options.position.x=(parseInt(document.getElementById("pixelperfect-x").value,10)||0).toString(),this.options.position.y=(parseInt(document.getElementById("pixelperfect-y").value,10)||0).toString()},storeOptions:function(){var e;for(e in this.options)this.options.hasOwnProperty(e)&&(e==="position"?localStorage.setItem("pixelperfect:options:"+e,this.options[e].x+","+this.options[e].y):localStorage.setItem("pixelperfect:options:"+e,this.options[e]))},setDefaults:function(){var e;for(e in this.DEFAULTS)this.DEFAULTS.hasOwnProperty(e)&&!localStorage.getItem("pixelperfect:options:"+e)&&(e==="position"?localStorage.setItem("pixelperfect:options:"+e,this.DEFAULTS[e].x+","+this.DEFAULTS[e].y):localStorage.setItem("pixelperfect:options:"+e,this.DEFAULTS[e]))},align:function(e){var t=!1,n=!1,i=document.getElementById("pixelperfect-overlay");switch(e){case"left":t=0;break;case"center":t=Math.round(window.innerWidth/2-i.width/2);break;case"right":t=window.innerWidth-i.width;break;case"top":n=0;break;case"middle":n=Math.round(window.innerHeight/2-i.height/2);break;case"bottom":n=window.innerHeight-i.height}t!==!1&&(document.getElementById("pixelperfect-x").value=t),n!==!1&&(document.getElementById("pixelperfect-y").value=n),r.refreshOptions()},initOptions:function(){var e,t;for(e in this.options)this.options.hasOwnProperty(e)&&(e==="position"?(t=localStorage.getItem("pixelperfect:options:"+e).split(","),this.options[e]={},this.options[e].x=t[0],this.options[e].y=t[1]):e==="active"||e==="minimized"||e==="hidden"?this.options[e]=localStorage.getItem("pixelperfect:options:"+e)==="true":this.options[e]=localStorage.getItem("pixelperfect:options:"+e))},initFileHandling:function(){s("#pixelperfect-upload-file").event("click",function(e){e.preventDefault(),document.getElementById("pixelperfect-fileinput").click()}),s("#pixelperfect-fileinput").event("change",function(e){n.insertLayer(window.URL.createObjectURL(e.target.files[0]))}.bind(this)),s("#pixelperfect-file").event("keypress",function(e){(e.keyCode===13||e.charCode===13)&&n.insertLayer(this.elements[0].value)})},initWrapper:function(){var e=document.createElement("div"),t=document.defaultView.getComputedStyle(document.body),n=document.body.attributes,r=document.defaultView.getComputedStyle(e),i,o,u;for(o in n)n.hasOwnProperty(o)&&e.setAttribute(n[o].name,n[o].value);for(o in t)!o.match(/^[0-9]/)&&o.match(/^background/)&&r[o]!==t[o]&&(i=r[o],e.style[o]=t[o],document.body.style[o]=i);e.className=document.body.className+" pixelperfect-wrapper",e.style.overflow="hidden",e.style.position="relative",e.style.margin="0",s("body > *").elements.every(function(t){return e.appendChild(t),!0}),document.body.appendChild(e),this.wrapper=e,u=function(){this.wrapper.style.minHeight=window.innerHeight.toString()+"px"}.bind(this),u(),window.addEventListener("resize",u)},initHTML:function(){var e=document.createElement("div"),t;e.setAttribute("id","pixelperfect"),e.innerHTML=this.HTML,document.body.appendChild(e),t=document.getElementById("pixelperfect-help-popup"),document.body.appendChild(t),t.visible=!1},initStyles:function(){var e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("type","text/css"),e.setAttribute("media","all"),e.setAttribute("href","data:text/css;base64,"+this.STYLES),document.head.appendChild(e)},initInterfaceEvents:function(){s("#pixelperfect-overlay-over, #pixelperfect-overlay-below, #pixelperfect-opacity, #pixelperfect-x, #pixelperfect-y").event("change",function(){document.getElementById("pixelperfect-opacity-range").value=document.getElementById("pixelperfect-opacity").value,this.applyOptions.call(this),this.storeOptions.call(this),this.refreshOverlay.call(this)}.bind(this)),s("#pixelperfect-aligns > .pixelperfect-button").event("click",function(e){e.preventDefault(),r.align(this.elements[0].getAttribute("id").replace(/pixelperfect-[a-z]+-/,""))}),s("#pixelperfect-top > .pixelperfect-button").event("click",function(e){var t=this.elements[0].getAttribute("id").replace("pixelperfect-","");e.preventDefault(),t==="help"?r.help():(r.options[t]=!r.options[t],r.refreshInterface())}),s("#pixelperfect-opacity-range").event("change",function(){document.getElementById("pixelperfect-opacity").value=this.elements[0].value,r.applyOptions(),r.refreshInterface()})},setParam:function(e,t){typeof e=="string"&&(e=s("#pixelperfect-"+e)),e.elements[0].getAttribute("data-max")&&(t=Math.min(parseInt(e.elements[0].getAttribute("data-max"),10),t)),e.elements[0].getAttribute("data-min")&&(t=Math.max(parseInt(e.elements[0].getAttribute("data-min"),10),t)),e.elements[0].value=t,r.refreshOptions()},initKeyEvents:function(){var e=!1,t=!1,i=!1,o=!1;s("#pixelperfect-opacity, #pixelperfect-x, #pixelperfect-y").event("keypress",function(n){if(i||e||t||o){n.preventDefault();return}var s=parseInt(this.elements[0].value,10);if(n.keyCode===38||n.keyCode===40)s+=n.keyCode===38?1:-1;r.setParam(this,s)}),s(document).event("keypress",function(s){var u=!1,a;e&&!s.ctrlKey&&s.charCode===111&&(u=document.getElementById("pixelperfect-overlay-over")),e&&!s.ctrlKey&&s.charCode===98&&(u=document.getElementById("pixelperfect-overlay-below")),u&&(u.setAttribute("checked","checked"),u.checked=!0),e=s.ctrlKey&&s.charCode===111,t&&!s.ctrlKey&&s.charCode===120&&document.getElementById("pixelperfect-x").focus(),t&&!s.ctrlKey&&s.charCode===121&&document.getElementById("pixelperfect-y").focus(),t=s.ctrlKey&&s.charCode===112,i&&!s.ctrlKey&&s.charCode===108&&r.align("left"),i&&!s.ctrlKey&&s.charCode===99&&r.align("center"),i&&!s.ctrlKey&&s.charCode===114&&r.align("right"),i&&!s.ctrlKey&&s.charCode===116&&r.align("top"),i&&!s.ctrlKey&&s.charCode===109&&r.align("middle"),i&&!s.ctrlKey&&s.charCode===98&&r.align("bottom"),i=s.ctrlKey&&s.charCode===97,o&&!s.ctrlKey&&s.charCode===102&&document.getElementById("pixelperfect-fileinput").click(),o&&!s.ctrlKey&&s.charCode===117&&document.getElementById("pixelperfect-file").focus(),o=s.ctrlKey&&s.charCode===102,s.ctrlKey&&s.charCode>=48&&s.charCode<=57&&n.setByIndex(s.charCode===48?9:s.charCode-49),s.ctrlKey&&s.charCode===29&&n.next(),s.ctrlKey&&s.charCode===27&&n.previous(),s.ctrlKey&&s.charCode===114&&n.removeLayer(n.fillSelected()),s.ctrlKey&&s.charCode===116&&document.getElementById("pixelperfect-opacity").focus(),s.ctrlKey&&s.charCode===46&&r.setParam("opacity",parseInt(r.options.opacity,10)+1),s.ctrlKey&&s.charCode===44&&r.setParam("opacity",r.options.opacity-1);if(s.ctrlKey&&(s.charCode===104||s.charCode===109||s.charCode===120)){switch(s.charCode){case 104:a="hidden";break;case 109:a="minimized";break;case 120:a="active"}r.options[a]=!r.options[a],r.refreshInterface()}s.ctrlKey&&s.charCode===47&&r.help(),r.refreshOptions()})},init:function(){this.setDefaults(),this.initOptions(),this.initWrapper(),this.initHTML(),this.initStyles(),this.initInterfaceEvents(),this.initKeyEvents(),t.init(),t.makeDraggable(s("#pixelperfect"),{handler:"#pixelperfect-top"}),t.catchFile(s("#pixelperfect-drop-file")),n.init(),this.initFileHandling(),this.refreshInterface()}},i={pre_windowURL:function(){window.URL||(window.webkitURL?window.URL=window.webkitURL:window.URL=!1)},post_opacityRange:function(){var e=document.createElement("input"),n,r,i;e.setAttribute("type","range"),e.type!=="range"&&(n=document.getElementById("pixelperfect-opacity-range"),e=document.createElement("span"),r=document.createElement("span"),e.className="pixelperfect-range",r.className="pixelperfect-slider",e.appendChild(r),e.value=n.value,e.events=n.events,n.parentNode.insertBefore(e,n),n.parentNode.removeChild(n),e.setAttribute("id","pixelperfect-opacity-range"),i=function(e){var t=document.getElementById("pixelperfect-opacity-range"),n=document.getElementById("pixelperfect");e.preventDefault(),e.stopPropagation(),t.value=Math.round(Math.max(0,Math.min(100,(e.pageX-t.offsetLeft-n.offsetLeft-10)/t.clientWidth*100+10))),this.style.top="-4px",this.style.left=t.value.toString()+"%",t.elements=[t],t.events.change.call(t)}.bind(r),s(e).event("click",i),t.makeDraggable(s(r),{remember:!1,onMove:i}),setInterval(function(){this.firstChild.style.left=this.value+"%"}.bind(document.getElementById("pixelperfect-opacity-range")),50))},preLoad:function(){var e;for(e in this)this.hasOwnProperty(e)&&e!=="preLoad"&&e.match(/^pre_/)&&this[e]()},postLoad:function(){var e;for(e in this)this.hasOwnProperty(e)&&e!=="postLoad"&&e.match(/^post_/)&&this[e]()}},s=function(t,n,r){return new e(t,n,r)};window.$=s,window.onload=function(){i.preLoad(),r.init(),i.postLoad()}})();