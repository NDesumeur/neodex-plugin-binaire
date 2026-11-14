// lancé par le test « local » de NeoDex : vérification interne, une grille 6 × 6 remplie au clic jusqu'à la victoire, l'onglet quitté puis repris
// (la grille répond toujours, le chrono s'est arrêté), la mise en page à la taille de la fenêtre et le plein écran
module.exports = async ({ pj, sleep }) => {
  const S = expr => pj(`(() => { const b = document.getElementById('gc').__bn.st(); return ${expr}; })()`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('gc').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'binaire-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  const click = (x, y, button = 0) => pj(`(() => { const c = document.getElementById('gc'), r = c.getBoundingClientRect(), b = c.__bn.st(), X = b.X0 + (${x} + .5) * b.C, Y = b.Y0 + (${y} + .5) * b.C; c.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true, button: ${button}, clientX: r.left + X / c.width * r.width, clientY: r.top + Y / c.height * r.height})); return 0; })()`);
  const sc = await pj(`document.querySelector('[data-selfcheck]')?.dataset.selfcheck`); if (sc !== 'ok') throw new Error('vérification interne : ' + sc);
  await pj(`(document.getElementById('bnSize').value = '0', document.getElementById('bnSize').dispatchEvent(new Event('change')), 0)`); await sleep(600);
  if (await S('b.n') !== 6) throw new Error('la grille 6 × 6 ne se crée pas');
  await shot('0-depart');
  // l'onglet quitté puis repris : la partie doit répondre et le chrono ne doit pas avoir couru
  await pj(`(document.querySelector('[data-selfcheck]').classList.remove('on'), 0)`); await sleep(400);
  const ms0 = await S('b.ms'); await sleep(1500);
  await pj(`(document.querySelector('[data-selfcheck]').classList.add('on'), document.getElementById('gc').__bn.open(), 0)`); await sleep(200);
  if (await S('b.mode') !== 'play') throw new Error('la partie reste en pause après le retour sur l’onglet');
  if (await S('b.ms') - ms0 > 600) throw new Error('le chrono a couru pendant l’absence');
  const cells = await S(`b.full.flatMap((r, y) => r.map((v, x) => [x, y, v])).filter(([x, y]) => !b.fixed[y][x])`);
  for (let i = 0; i < cells.length; i++) { const [x, y, v] = cells[i]; await click(x, y, v ? 0 : 2); await sleep(30); if (i === Math.floor(cells.length / 2)) { await sleep(100); await shot('1-milieu'); } }
  await sleep(400); await shot('2-vague');
  if (await S('b.mode') !== 'won') throw new Error('la grille remplie au clic n’est pas résolue');
  await sleep(1200); await shot('3-fin');
  await pj(`(document.getElementById('bnSize').value = '2', document.getElementById('bnSize').dispatchEvent(new Event('change')), 0)`); await sleep(800); await shot('4-dix');
  const lay = await pj(`(() => { const c = document.getElementById('gc').getBoundingClientRect(), s = document.querySelector('.gSide').getBoundingClientRect(); return { beside: s.left >= c.right - 1, fits: document.documentElement.scrollWidth <= innerWidth + 1, bottom: Math.round(c.bottom), h: Math.round(c.height), wh: innerHeight, w: innerWidth }; })()`);
  if (!lay.fits || lay.bottom > lay.wh + 1 || lay.h < 240 || (lay.w >= 900 && !lay.beside)) throw new Error('mise en page : ' + JSON.stringify(lay));
  await pj(`document.getElementById('bnFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('gc'); return document.fullscreenElement === c.parentElement && Math.abs(c.getBoundingClientRect().height - innerHeight) < 3; })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas la hauteur');
  return 'grille 6 × 6 résolue au clic · pause et reprise de l’onglet · fenêtre ' + lay.w + '×' + lay.wh + ', grille ' + lay.h + ' px';
};
