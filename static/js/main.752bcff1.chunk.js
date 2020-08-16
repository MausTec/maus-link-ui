(this["webpackJsonpnogasm-ui"]=this["webpackJsonpnogasm-ui"]||[]).push([[0],{169:function(e,t,s){e.exports=s(354)},174:function(e,t,s){},352:function(e,t,s){},353:function(e,t,s){},354:function(e,t,s){"use strict";s.r(t);var a=s(1),n=s.n(a),i=s(47),r=s.n(i),l=(s(174),s(75)),c=s(18),o=s(127),h=s(128),u=s(139),m=s(138),d=(s(9),s(137)),g=s.n(d),p=(s(352),s(353),function(e){return e*(Math.PI/180)}),v=function(e,t,s,a,n){return(e-t)*(n-a)/(s-t)+a},f=function(e){for(var t=e.pressure,s=e.arousal,a=e.limit,i=Math.floor(v(t,0,4096,0,12)),r=(Math.floor(v(a,0,4096,0,12)),Math.floor(v(s,0,a,0,12))),l=[],c=0;c<13;c++){var o=13-c-1,h=40+280/12*c,u=300*Math.sin(p(h))/2+150,m=300*Math.cos(p(h))/2+150,d=50,g=0;o===i?(g=290,d=75):o<r?g=v(c,0,12,0,120):d=100,l[c]={color:"hsl(".concat(g,", 100%, ").concat(d,"%)"),x:u,y:m,rot:h,glow:d<100}}return n.a.createElement("div",{className:"led-ring",style:{width:300,height:300}},l.map((function(e,t){return n.a.createElement("div",{className:"led led-"+t,key:t,style:{backgroundColor:e.color,left:e.x,top:e.y,transform:"translate(-50%, -50%) rotate(-".concat(e.rot,"deg)"),boxShadow:e.glow?"0 0 10px 3px ".concat(e.color):"",opacity:e.glow?1:.8}})})),n.a.createElement("div",{className:"led-value"},Math.floor(s/a*100),"%"),n.a.createElement("div",{className:"led-stat"},"Arousal"))},E=function(e){var t,s=e.status;return n.a.createElement("header",{className:"App-header"},n.a.createElement("span",{className:"ssid"},s.ssid)," ",n.a.createElement("span",{className:"ip"},s.ip)," ",n.a.createElement("span",{className:"strength"},"(",(t=s.signalStrength)<-90?"Very Low":t<-80?"Low":t<-70?"Good":t<-60?"Very Good":t<-50?"Excellent":t<0?"Suspiciously Excellent":"Unknown",")"))},b=function(e){return n.a.createElement("div",{className:"sidebar"})},S=function(e){Object(u.a)(s,e);var t=Object(m.a)(s);function s(e){var a;return Object(o.a)(this,s),(a=t.call(this,e)).HOST="192.168.1.172",a.ws=null,a.lastDraw=0,a.state={connected:!1,log:[],pressure:[],sampleDepth:300,sampleRate:1,settings:{peakLimit:600,brightness:128},status:{ssid:"",ip:"",signalStrength:0}},a}return Object(h.a)(s,[{key:"handleBrightnessChange",value:function(e){e.preventDefault();var t=e.target.value;this.setState({settings:Object(c.a)(Object(c.a)({},this.state.settings),{},{brightness:t})}),this.send({cmd:"SET_BRIGHTNESS",brightness:t})}},{key:"handleLimitChange",value:function(e){e.preventDefault();var t=e.target.value;this.setState({settings:Object(c.a)(Object(c.a)({},this.state.settings),{},{peakLimit:t})}),this.send({cmd:"SET_LIMIT",limit:t})}},{key:"send",value:function(e){this.ws&&this.ws.sendMessage(JSON.stringify(e))}},{key:"log",value:function(e){var t=Object(l.a)(this.state.log);t.push(e),this.setState({log:t})}},{key:"reconnect",value:function(e){e.preventDefault(),this.send({cmd:"hello"})}},{key:"handleWsOpen",value:function(){this.setState({connected:!0}),this.log("Connected"),this.send({cmd:"GET_SETTINGS"}),this.send({cmd:"GET_WIFI_STATUS"}),this.send({cmd:"GET_SD_STATUS"})}},{key:"handleWsClose",value:function(){this.setState({connected:!1}),this.log("Closed")}},{key:"handleWsMessage",value:function(e){var t;try{t=JSON.parse(e)}catch(i){t={data:e},console.warn(i)}if("undefined"!==typeof t.pressure){var s=this.state.pressure.slice(0-(this.state.sampleDepth-1));t.millis=t.millis/1e3,this.setState({pressure:[].concat(Object(l.a)(s),[t])})}else console.log(t);if("SETTINGS"===t.cmd){var a=Object(c.a)({},this.state.settings);"undefined"!==typeof t.brightness&&(a.brightness=t.brightness),"undefined"!==typeof t.peak_limit&&(a.peakLimit=t.peak_limit),this.setState({settings:a})}if("WIFI_STATUS"===t.cmd){var n=Object(c.a)({},this.state.status);n.signalStrength=t.signal_strength,n.ip=t.ip,n.ssid=t.ssid,this.setState({status:n})}}},{key:"getLastData",value:function(){return this.state.pressure.length&&this.state.pressure[this.state.pressure.length-1]||{}}},{key:"render",value:function(){var e=this;return n.a.createElement("div",{className:"App"},n.a.createElement(g.a,{url:"ws://"+this.HOST,onOpen:this.handleWsOpen.bind(this),onClose:this.handleWsClose.bind(this),ref:function(t){return e.ws=t},debug:!0,onMessage:this.handleWsMessage.bind(this)}),n.a.createElement(E,{status:this.state.status}),n.a.createElement("div",{className:"content"},n.a.createElement(b,null),n.a.createElement("main",null,n.a.createElement("div",{className:"card"},n.a.createElement(f,{pressure:this.getLastData().pressure,arousal:this.getLastData().arousal,limit:this.state.settings.peakLimit})),n.a.createElement("div",{className:"card"}),n.a.createElement("div",{className:"controls"},n.a.createElement("div",{className:"control"},n.a.createElement("label",{htmlFor:"brightness"},"Brightness"),n.a.createElement("input",{type:"number",min:1,max:255,onChange:this.handleBrightnessChange.bind(this),id:"brightness",value:this.state.settings.brightness})),n.a.createElement("div",{className:"control"},n.a.createElement("label",{htmlFor:"brightness"},"Arousal Limit"),n.a.createElement("input",{type:"number",min:1,max:4096,onChange:this.handleLimitChange.bind(this),id:"limit",value:this.state.settings.peakLimit})),n.a.createElement("div",{className:"control"},n.a.createElement("a",{href:"#",onClick:this.reconnect.bind(this)},"Reconnect"))))))}}]),s}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(n.a.createElement(n.a.StrictMode,null,n.a.createElement(S,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[169,1,2]]]);
//# sourceMappingURL=main.752bcff1.chunk.js.map