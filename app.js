(() => {
  'use strict';
  const ns = 'http://www.w3.org/2000/svg';
  const paints = document.getElementById('paints');
  const palettes = {
    purple: { back: ['#42146d','#9747c7','#dec2ff'], left: ['#4b197e','#b372e2','#f1dfff'], right: ['#5a1e8e','#9943c5','#d5a9f3'], front: ['#6d269f','#bc7de7','#e8caff'] },
    white: { back: ['#89769f','#d8cee6','#fffdfd'], left: ['#b0a0c1','#f1eaf7','#ffffff'], right: ['#a894bc','#e3daee','#fffdfb'], front: ['#b9a5ca','#eee6f4','#ffffff'] }
  };
  for (const [color, petals] of Object.entries(palettes)) {
    for (const [name, stops] of Object.entries(petals)) {
      const gradient = document.createElementNS(ns, 'linearGradient');
      gradient.id = color + '-' + name;
      for (const [key, value] of Object.entries({x1:'0',y1:'1',x2:name==='left'?'1':'.65',y2:'0'})) gradient.setAttribute(key,value);
      stops.forEach((color, i) => {
        const stop = document.createElementNS(ns, 'stop');
        stop.setAttribute('offset', [0,.55,1][i]);
        stop.setAttribute('stop-color', color);
        gradient.append(stop);
      });
      paints.append(gradient);
    }
  }
  // Back flowers first. Each flower grows and opens on its own timeline.
  const flowers = [
    { x:242,y:320,angle:-23,scale:.83,color:'white',delay:.25 },
    { x:545,y:320,angle:24,scale:.85,color:'purple',delay:.45 },
    { x:330,y:220,angle:-10,scale:.93,color:'purple',delay:.05 },
    { x:462,y:205,angle:9,scale:.95,color:'white',delay:.2 },
    { x:180,y:445,angle:-31,scale:.79,color:'purple',delay:.65 },
    { x:610,y:440,angle:32,scale:.82,color:'white',delay:.8 },
    { x:397,y:360,angle:-3,scale:1.08,color:'purple',delay:.5 }
  ];
  flowers.forEach((flower,i) => {
    const {x,y,angle,scale,color,delay} = flower;
    const group = document.createElementNS(ns,'g');
    group.classList.add('tulip');
    group.style.setProperty('--delay', delay+'s');
    group.style.setProperty('--sway', (3.5+i*.37)+'s');
    const base = 385+i*5, midX=(base+x)/2, midY=(780+y)/2;
    group.innerHTML = `
      <path class="stem" d="M ${base} 780 Q ${midX+(x<400?35:-35)} ${midY} ${x} ${y}"/>
      <g class="leaf-wrap">
        <path fill="url(#leaf)" d="M ${midX} ${midY+100} Q ${midX-115} ${midY+45} ${midX-125} ${midY-85} Q ${midX-30} ${midY-48} ${midX} ${midY+100} Z"/>
        <path class="leaf-vein" d="M ${midX} ${midY+100} Q ${midX-76} ${midY-3} ${midX-125} ${midY-85}"/>
      </g>
      <g class="leaf-wrap" style="animation-delay:${delay+.95}s">
        <path fill="url(#leaf)" d="M ${midX+5} ${midY+145} Q ${midX+110} ${midY+75} ${midX+110} ${midY-40} Q ${midX+27} ${midY+8} ${midX+5} ${midY+145} Z"/>
        <path class="leaf-vein" d="M ${midX+5} ${midY+145} Q ${midX+65} ${midY+34} ${midX+110} ${midY-40}"/>
      </g>
      <g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})">
        <g class="bloom">
          <path fill="url(#${color}-back)" d="M 0 8 C -50 -15 -48 -83 -17 -133 Q -5 -143 1 -151 Q 7 -136 21 -132 C 55 -81 48 -18 0 8 Z"/>
          <g class="petal-left"><path fill="url(#${color}-left)" d="M 0 9 C -59 3 -87 -59 -66 -135 C -34 -125 8 -89 18 -44 C 23 -17 11 3 0 9 Z"/><path class="petal-vein" d="M -4 0 Q -49 -66 -59 -121"/></g>
          <g class="petal-right"><path fill="url(#${color}-right)" d="M 0 9 C 59 3 87 -59 66 -135 C 34 -125 -8 -89 -18 -44 C -23 -17 -11 3 0 9 Z"/><path class="petal-vein" d="M 5 0 Q 48 -65 60 -121"/></g>
          <path class="flower-front" fill="url(#${color}-front)" d="M 0 10 C -35 5 -48 -30 -40 -77 Q -22 -89 0 -115 Q 22 -89 40 -77 C 48 -30 35 5 0 10 Z"/>
          <path class="petal-vein" d="M 0 4 Q -7 -49 0 -103 M -10 -1 Q -24 -33 -30 -70 M 12 -1 Q 26 -35 31 -70"/>
        </g>
      </g>`;
    document.getElementById('tulips').append(group);
  });
  for(let i=0;i<65;i++){
    const star=document.createElement('i');
    star.className='star'+(i%9===0?' large':'');
    star.style.cssText=`left:${(i*61.803)%100}%;top:${(i*37.17)%100}%;--duration:${2+i%5}s;--delay:${-i*.37}s`;
    document.getElementById('starlight').append(star);
  }
  for(let i=0;i<22;i++){
    const light=document.createElementNS(ns,'circle');
    light.setAttribute('cx',130+(i*79.3)%540);
    light.setAttribute('cy',170+(i*113.7)%580);
    light.setAttribute('r',i%3===0?2.2:1.3);
    light.setAttribute('class','firefly');
    light.style.cssText=`--duration:${2.5+i%4}s;--delay:${-i*.6}s`;
    document.getElementById('fireflies').append(light);
  }
  for(let i=0;i<10;i++){
    const petal=document.createElement('i');
    petal.className='falling-petal'+(i%2?' purple':'');
    petal.style.cssText=`--x:${(i*29.7)%95}%;--duration:${12+i%6}s;--delay:${i*1.8+3}s`;
    document.getElementById('petal-rain').append(petal);
  }
  document.querySelector('.scene').addEventListener('pointerdown',event=>{
    if(document.body.classList.contains('paused') || event.target.closest('#motion-toggle'))return;
    const box=document.querySelector('.scene').getBoundingClientRect(),bursts=document.getElementById('bursts');
    if(bursts.childElementCount>100)return;
    for(let i=0;i<16;i++){
      const spark=document.createElement('i'),angle=i*Math.PI/8;
      spark.className='spark';
      spark.style.cssText=`left:${event.clientX-box.left}px;top:${event.clientY-box.top}px;--dx:${Math.cos(angle)*(45+i%3*18)}px;--dy:${Math.sin(angle)*(45+i%3*18)}px`;
      bursts.append(spark);
      spark.addEventListener('animationend',()=>spark.remove(),{once:true});
    }
  });
  // Keep the requested animation running even when the OS disables UI effects.
  // An explicit icon control lets the visitor pause the entire scene.
  const canvas = document.getElementById('magic');
  const ctx = canvas.getContext('2d');
  const scene = document.querySelector('.scene');
  let width = 0, height = 0, clock = 0, previous = 0;
  let paused = false;
  function resize() {
    width = scene.clientWidth;
    height = scene.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  new ResizeObserver(resize).observe(scene);
  resize();
  function heart(x, y, size, rotation, alpha, white) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(size, size);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = white ? '#fff4ff' : '#d5a0ff';
    ctx.shadowColor = '#c975ff';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(0, .8);
    ctx.bezierCurveTo(-2, -.5, -1.2, -1.7, 0, -.7);
    ctx.bezierCurveTo(1.2, -1.7, 2, -.5, 0, .8);
    ctx.fill();
    ctx.restore();
  }
  function draw(now) {
    const delta = previous ? Math.min((now - previous) / 1000, .05) : 0;
    previous = now;
    if (!paused && !document.hidden) {
      clock += delta;
      ctx.clearRect(0, 0, width, height);
      const span = Math.min(width * .35, 270);
      // A rising spiral of luminous hearts continuously wraps the bouquet.
      for (let i = 0; i < 24; i++) {
        const progress = (clock * .12 + i / 24) % 1;
        const theta = progress * Math.PI * 5 + clock * .55;
        const radius = span * (.35 + .65 * Math.sin(progress * Math.PI));
        const x = width / 2 + Math.cos(theta) * radius;
        const y = height * (.94 - progress * .68);
        const alpha = Math.sin(progress * Math.PI) * (.55 + Math.sin(theta) * .25);
        heart(x, y, (width < 600 ? 4 : 6) + (1 + Math.sin(theta)) * 2, Math.sin(theta) * .4, alpha, i % 3 === 0);
      }
      // Tiny sparks follow the same helix, forming an animated light ribbon.
      for (let i = 0; i < 130; i++) {
        const progress = (clock * .12 + i / 130) % 1;
        const theta = progress * Math.PI * 5 + clock * .55;
        const radius = span * (.35 + .65 * Math.sin(progress * Math.PI));
        const x = width / 2 + Math.cos(theta) * radius + Math.sin(i * 23) * 12;
        const y = height * (.94 - progress * .68) + Math.cos(i * 7) * 12;
        ctx.globalAlpha = Math.sin(progress * Math.PI) * (.3 + .4 * (1 + Math.sin(clock * 3 + i)) / 2);
        ctx.fillStyle = i % 3 === 0 ? '#ffffff' : '#c589ff';
        ctx.shadowColor = '#bb73ff';
        ctx.shadowBlur = 9;
        ctx.beginPath();
        ctx.arc(x, y, 1 + (i % 4) * .4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
  document.getElementById('motion-toggle').addEventListener('click', () => {
    paused = !paused;
    document.body.classList.toggle('paused', paused);
    const toggle = document.getElementById('motion-toggle');
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
    document.getElementById('motion-icon').setAttribute('d', paused ? 'M8 5L19 12L8 19Z' : 'M8 6V18M16 6V18');
  });
})();
