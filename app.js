(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const ns = 'http://www.w3.org/2000/svg';
  const params = new URLSearchParams(location.hash.slice(1));
  const greeting = {
    to: (params.get('to') || '').slice(0, 60),
    message: (params.get('message') || $('message').textContent).slice(0, 700),
    from: (params.get('from') || '').slice(0, 60),
  };
  if (greeting.to) {
    $('heading').replaceChildren('A flower for ', Object.assign(document.createElement('em'), { textContent: `${greeting.to}.` }));
    document.title = `A flower for ${greeting.to}`;
  }
  $('message').textContent = greeting.message;
  if (greeting.from) $('signature').textContent = `With love, ${greeting.from} ♡`;
  const colors = ['#9427d4', '#bd52de', '#7214a7', '#411c84', '#a4159e', '#d582ea', '#5723b7'];
  // Angular, overlapping petals echo the turtle-drawn reference.
  for (let layer = 0; layer < 3; layer++) {
    const count = 30 - layer * 3;
    for (let i = 0; i < count; i++) {
      const rotation = i * 360 / count + layer * 8;
      const length = 215 - layer * 24;
      const width = 27 - layer * 2;
      const group = document.createElementNS(ns, 'g');
      group.setAttribute('transform', `rotate(${rotation})`);
      const petal = document.createElementNS(ns, 'path');
      petal.setAttribute('d', `M -9 -65 L ${-width} ${-length * .68} L 0 ${-length} L ${width * .8} ${-length * .62} L 12 -65 Z`);
      petal.setAttribute('fill', colors[(i * 3 + layer * 2) % colors.length]);
      petal.setAttribute('stroke', '#160c24');
      petal.setAttribute('stroke-width', '.8');
      petal.setAttribute('class', 'petal');
      petal.style.setProperty('--delay', `${(i * .022 + layer * .16).toFixed(3)}s`);
      group.append(petal);
      $('petals').append(group);
    }
  }
  const disk = document.createElementNS(ns, 'circle');
  disk.setAttribute('r', '79');
  disk.setAttribute('fill', '#0b0717');
  $('seeds').append(disk);
  // The golden angle forms the spiral seed pattern of a sunflower.
  for (let i = 0; i < 330; i++) {
    const angle = i * Math.PI * (3 - Math.sqrt(5));
    const radius = 4.15 * Math.sqrt(i);
    const seed = document.createElementNS(ns, 'ellipse');
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    seed.setAttribute('cx', x.toFixed(2));
    seed.setAttribute('cy', y.toFixed(2));
    seed.setAttribute('rx', (1.1 + radius / 70).toFixed(2));
    seed.setAttribute('ry', '1.55');
    seed.setAttribute('transform', `rotate(${angle * 180 / Math.PI + 90} ${x} ${y})`);
    seed.setAttribute('fill', `hsl(${247 + radius / 6} 65% ${21 + radius / 1.8}%)`);
    seed.setAttribute('class', 'seed');
    seed.style.setProperty('--delay', `${.55 + i * .003}s`);
    $('seeds').append(seed);
  }
  let revealTimer;
  function bloom() {
    clearTimeout(revealTimer);
    $('stage').classList.add('opened');
    $('open').disabled = true;
    $('open').setAttribute('aria-expanded', 'true');
    revealTimer = setTimeout(() => { $('letter').hidden = false; }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1300);
  }
  $('open').setAttribute('aria-controls', 'letter');
  $('open').setAttribute('aria-expanded', 'false');
  $('open').addEventListener('click', bloom);
  $('replay').addEventListener('click', () => {
    $('stage').classList.remove('opened');
    $('letter').hidden = true;
    $('open').disabled = false;
    $('open').setAttribute('aria-expanded', 'false');
    $('open').focus({ preventScroll: true });
  });
  $('personalize').addEventListener('click', () => {
    $('recipient').value = greeting.to;
    $('note').value = greeting.message;
    $('sender').value = greeting.from;
    $('share-status').textContent = '';
    $('share-link').hidden = true;
    $('editor').showModal();
  });
  $('close').addEventListener('click', () => $('editor').close());
  $('editor').addEventListener('click', (event) => { if (event.target === $('editor')) { const box = $('editor').getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) $('editor').close(); } });
  $('greeting-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = $('note').value.trim();
    if (!message) { $('share-status').textContent = 'Add a few words to send with your flower.'; $('note').focus(); return; }
    const hash = new URLSearchParams({ to: $('recipient').value.trim(), message, from: $('sender').value.trim() });
    const url = new URL(location.href);
    url.search = '';
    url.hash = hash.toString();
    $('share-link').value = url.href;
    $('share-link').hidden = false;
    if (location.protocol === 'file:') {
      $('share-status').textContent = 'Publish this page first, then create your link from the live website.';
      return;
    }
    try {
      await navigator.clipboard.writeText(url.href);
      $('share-status').textContent = 'Link copied! Send it to someone who deserves a flower.';
    } catch {
      $('share-status').textContent = 'Your link is ready. Select and copy it below.';
      $('share-link').focus();
      $('share-link').select();
    }
  });
})();
