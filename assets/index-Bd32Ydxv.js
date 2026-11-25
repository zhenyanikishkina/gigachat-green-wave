(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const c of a)if(c.type==="childList")for(const m of c.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&n(m)}).observe(document,{childList:!0,subtree:!0});function o(a){const c={};return a.integrity&&(c.integrity=a.integrity),a.referrerPolicy&&(c.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?c.credentials="include":a.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function n(a){if(a.ep)return;a.ep=!0;const c=o(a);fetch(a.href,c)}})();const i=e=>document.querySelector(e),q=60/105,L=[{name:"Сигнал",file:"audio/stems/green-wave - Сигнал.mp3",color:"#34d399"},{name:"Щипок",file:"audio/stems/green-wave - Щипок.mp3",color:"#22c55e"},{name:"Бас",file:"audio/stems/green-wave - Бас.mp3",color:"#15803d"},{name:"Клавиши",file:"audio/stems/green-wave - Клавиши.mp3",color:"#4ade80"},{name:"Ударные",file:"audio/stems/green-wave - Ударные.mp3",color:"#8b5cf6"},{name:"Перкуссия",file:"audio/stems/green-wave - Перкуссия.mp3",color:"#0e7490"},{name:"Пэд",file:"audio/stems/green-wave - Пэд.mp3",color:"#34d399"}],W=[{beat:0,name:"Интро"},{beat:16,name:"Билд"},{beat:32,name:"Тема A"},{beat:64,name:"Брейк"},{beat:88,name:"Тема B"},{beat:128,name:"Аутро"}],Y=85.085708,pe=82.285708;let g,M,E,k,T,_=[],F="master",ce="final",w=!1,A=0,X=null,j=null,ne=[],J=[];function $(){g||(g=new(window.AudioContext||window.webkitAudioContext),M=g.createAnalyser(),M.fftSize=2048,M.smoothingTimeConstant=.82,E=g.createGain(),E.gain.value=1,E.connect(M).connect(g.destination),k=document.createElement("audio"),k.src="audio/green-wave-web.mp3",k.preload="metadata",T=document.createElement("audio"),T.src="audio/green-wave-draft.mp3",_=L.map(e=>{const t=document.createElement("audio");return t.src=e.file,t.preload="metadata",t}),ve())}function b(){return F==="master"?Y:pe}function ye(){!X&&k&&(X=g.createMediaElementSource(k),X.connect(E)),!j&&T&&(j=g.createMediaElementSource(T),j.connect(E))}function we(){_.forEach((e,t)=>{if(ne[t])return;const o=g.createMediaElementSource(e),n=g.createGain();n.gain.value=1,o.connect(n).connect(E),ne[t]=o,J[t]=n})}function G(){return F==="master"?[ce==="final"?k:T]:_}function z(){$(),g.state==="suspended"&&g.resume(),ye(),we(),Z(),G().forEach(t=>{t.currentTime=Math.min(A,b()-.05),t.play().catch(()=>{})}),w=!0,i("#playLabel").textContent="Пауза",i("#playIcon").style.display="none",i("#pauseIcon").style.display="block"}function R(){G().forEach(t=>t.pause()),A=re(),w=!1,i("#playLabel").textContent="Слушать",i("#playIcon").style.display="block",i("#pauseIcon").style.display="none"}function re(){const e=G();return e.length&&e[0].currentTime?e[0].currentTime:0}function H(e,t=!0){$();const o=Math.max(0,Math.min(e,b()-.05));A=o,G().forEach(a=>{a.currentTime=o}),t&&le(o/b())}function ee(e){const t=Math.floor(e/60),o=Math.floor(e%60);return t+":"+String(o).padStart(2,"0")}function ie(e){$();const t=w;w&&R();const o=A;F=e,document.querySelectorAll('[data-mode="master"],[data-mode="stems"]').forEach(n=>n.classList.toggle("active",n.dataset.mode===e)),H(o,!1),t&&z(),i("#dur").textContent=ee(b())}function be(e){$();const t=w;w&&R();const o=A;ce=e,document.querySelectorAll("#finalBtn,#draftBtn").forEach(n=>n.classList.toggle("active",n.dataset.mode===e)),H(o,!1),t&&z()}const y=L.map(()=>({mute:false,solo:false,gain:1}));
function ve(){
  const container=i("#tracks");
  container.innerHTML="";
  L.forEach((track,index)=>{
    const row=document.createElement("div");
    row.className="tr";
    row.innerHTML=`
      <span class="name">${track.name}</span>
      <div class="sw">
        <button class="mute" data-i="${index}" aria-label="Отключить партию ${track.name}" aria-pressed="false">M</button>
        <button class="solo" data-i="${index}" aria-label="Соло: ${track.name}" aria-pressed="false">S</button>
      </div>
      <input type="range" min="0" max="1.4" step="0.01" value="1" data-i="${index}" aria-label="Громкость партии ${track.name}">`;
    container.appendChild(row);
  });
  container.addEventListener("click",event=>{
    const button=event.target.closest("button");
    if(!button)return;
    const index=Number(button.dataset.i);
    const track=y[index];
    if(button.classList.contains("solo")){
      const enable=!track.solo;
      y.forEach((other,otherIndex)=>{other.solo=enable&&otherIndex===index;});
      if(enable)track.mute=false;
    }else{
      // A manual mute/unmute exits Solo and toggles the currently visible M state.
      const wasMuted=track.mute||(y.some(other=>other.solo)&&!track.solo);
      y.forEach(other=>{other.solo=false;});
      track.mute=!wasMuted;
    }
    Z();
  });
  container.addEventListener("input",event=>{
    if(event.target.matches('input[type="range"]')){
      y[Number(event.target.dataset.i)].gain=Number(event.target.value);
      Z();
    }
  });
}
function Z(){
  const hasSolo=y.some(track=>track.solo);
  const rows=i("#tracks").children;
  y.forEach((track,index)=>{
    // Solo mutes are temporary; retain manual mutes for when Solo is turned off.
    const muted=track.mute||(hasSolo&&!track.solo);
    if(J[index])J[index].gain.value=muted?0:track.gain;
    const row=rows[index];
    if(!row)return;
    const muteButton=row.querySelector(".mute");
    const soloButton=row.querySelector(".solo");
    muteButton.classList.toggle("active",muted);
    muteButton.setAttribute("aria-pressed",String(muted));
    soloButton.classList.toggle("active",track.solo);
    soloButton.setAttribute("aria-pressed",String(track.solo));
  });
}
const D=i("#seekInput");D.addEventListener("input",()=>H(+D.value*b(),!1));i("#playBtn").addEventListener("click",()=>w?R():z());document.addEventListener("keydown",e=>{e.target.tagName!=="INPUT"&&e.code==="Space"&&(e.preventDefault(),w?R():z())});document.querySelectorAll('[data-mode="master"],[data-mode="stems"]').forEach(e=>e.addEventListener("click",()=>ie(e.dataset.mode)));document.querySelectorAll("#finalBtn,#draftBtn").forEach(e=>e.addEventListener("click",()=>{F!=="master"&&ie("master"),be(e.dataset.mode)}));function le(e){isFinite(e)&&(D.value=e,i("#seek .fill").style.width=e*100+"%",i("#seek .thumb").style.left=e*100+"%")}i("#seek").addEventListener("click",e=>{if(e.target===D)return;const t=i("#seek").getBoundingClientRect(),o=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width));H(o*b())});(function(){const t=i("#seekTicks");W.forEach(o=>{const n=document.createElement("div");n.className="tick",n.title=o.name,t.appendChild(n)})})();let O=[],P=[],Q=480;function xe(e,t,o){for(let n=P.length-1;n>=0;n--)if(P[n].p===e){const a=P.splice(n,1)[0];O.push({sec:a.t*q,durSec:Math.max(.05,(t-a.t)*q),midi:a.p,track:a.track});return}}async function Se(){let e;try{e=await fetch("green-wave.mid")}catch{return}if(!e.ok)return;const t=await e.arrayBuffer(),o=new DataView(t);let n=0,a=0;const c=s=>{const d=new TextDecoder().decode(new Uint8Array(t,n,s));return n+=s,d},m=()=>{let s=0,d;do d=o.getUint8(n++),s=s<<7|d&127;while(d&128);return s};for(;n<t.byteLength;){const s=c(4),d=o.getUint32(n);if(n+=4,s==="MThd"){Q=o.getUint16(n+4),n+=d;continue}if(s!=="MTrk"){n+=d;continue}const x=n+d;let h=0,r=null;for(;n<x;){let v=m();h+=v;let f=o.getUint8(n++);if(f<128?(f=r,n--):r=f,f===255){o.getUint8(n++);const p=m();n+=p}else if(f===240||f===247)n+=m();else{const p=f>>4,S=o.getUint8(n),K=o.getUint8(n+1);n+=2,p===9&&K>0?P.push({p:S,t:h/Q,track:a}):xe(S,h/Q)}}a++}console.log("[green-wave] MIDI загружен:",O.length,"нот из",a,"дорожек")}const N=i("#city"),C=i("#roll"),l=N.getContext("2d"),u=C.getContext("2d");let te=0,de=0;function ue(){const e=Math.min(window.devicePixelRatio||1,2),t=N.getBoundingClientRect(),o=C.getBoundingClientRect();N.width=t.width*e,N.height=t.height*e,C.width=o.width*e,C.height=o.height*e,l.setTransform(e,0,0,e,0,0),u.setTransform(e,0,0,e,0,0),te=t.width,de=t.height}window.addEventListener("resize",ue);const V=new Uint8Array(1024);let U=0,oe=0;function fe(){M&&M.getByteFrequencyData(V);const e=[0,2,4,8,16,32,64,128,256],t=[];for(let o=0;o<e.length-1;o++){let n=0,a=0;for(let c=e[o];c<e[o+1]&&c<V.length;c++)n+=V[c],a++;t.push(a?n/a:0)}return t}function ae(e,t){return Math.min(e*q,t)}function Me(e,t){const o=te,n=de;l.clearRect(0,0,o,n);const a=fe(),c=W.slice().reverse().find(r=>ae(r.beat,Y)<=t)||W[0],m=(t-ae(c.beat,Y))/(16*q),s=l.createLinearGradient(0,0,0,n);s.addColorStop(0,"#0b121c"),s.addColorStop(1,"#0a0f15"),l.fillStyle=s,l.fillRect(0,0,o,n);const d=60+m*130;l.fillStyle="rgba(134,239,172,.55)";for(let r=0;r<d;r++){const v=r*97.31%o,f=r*53.17%(n*.55),p=(Math.sin(e/900+r)+1)/2;l.globalAlpha=.25+p*.5,l.fillRect(v,f,1.6,1.6)}l.globalAlpha=1;const x=Math.max(6,Math.floor(o/64)),h=n-10;for(let r=0;r<x;r++){const f=26+a[r*7%a.length]/255*(n*.5)+r%3*22,p=o/x*r+6,S=o/x-12;l.fillStyle=r%2?"#101a26":"#142130",l.fillRect(p,h-f,S,f);const K=Math.max(1,Math.floor(f/22));for(let B=0;B<K;B++)for(let I=0;I<3;I++){if(!((Math.floor(e/400)+r*3+B+I)%5===0&&m>.25))continue;const ge=p+4+I*Math.floor((S-8)/2),he=h-f+8+B*22;l.fillStyle=r%2?"rgba(134,239,172,.8)":"rgba(52,211,153,.75)",l.fillRect(ge,he,4,5)}l.fillStyle=`rgba(34,197,94,${.15+U*.5})`,l.fillRect(p,h-f-2,S,2)}l.fillStyle="#0c141d",l.fillRect(0,h,o,10)}function Ee(e){const t=te,o=C.getBoundingClientRect().height;u.clearRect(0,0,t,o),u.fillStyle="#0b1119",u.fillRect(0,0,t,o),u.strokeStyle="rgba(139,155,176,.1)";for(let s=36;s<=84;s+=12){const d=(84-s)/48*o;u.beginPath(),u.moveTo(0,d),u.lineTo(t,d),u.stroke()}if(!O.length){se(t,o);return}const n=.05,a=t*.32,c=e-a*n,m=c+t*n;for(const s of O){if(s.sec+s.durSec<c||s.sec>m)continue;const d=(s.sec-c)/n,h=(84-Math.max(36,Math.min(84,s.midi)))/48*o,r=L[s.track]||L[6];u.fillStyle=r.color+"cc",u.shadowColor=r.color,u.shadowBlur=6;const v=Math.max(2,o/48-1);u.fillRect(d,h-v/2,Math.max(2.5,s.durSec/n),v),u.shadowBlur=0}se(t,o)}function se(e,t){u.fillStyle="#22c55e",u.fillRect(e*.32-1,0,2,t)}function me(e){requestAnimationFrame(me);const t=g?re():0,o=fe();U=Math.max(0,U-.08),o[0]>140&&e-oe>280&&(U=1,oe=e),ue(),Me(e,t),Ee(t),le(t/b()),i("#cur").textContent=ee(t),w&&t>=b()-.05&&R()}requestAnimationFrame(me);i("#dur").textContent=ee(b());Se().catch(()=>{});
