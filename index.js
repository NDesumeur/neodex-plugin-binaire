// Binaire : Remplis la grille de soleils et de lunes : jamais trois pareils à la suite, autant de chaque par ligne et par colonne, et deux lignes jamais identiques.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Binaire</span><span class="hint">Clic : soleil, lune, vide · clic droit : lune · Retour : annuler</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="gc" width="320" height="340"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="gStats"></div></div>
      <div class="row"><button class="btn main" id="gNew">NOUVELLE PARTIE</button><button class="btn" id="bnFs">PLEIN ÉCRAN</button></div>
      <label class="row">Grille <select id="bnSize" class="f"><option value="0">6 × 6</option><option value="1">8 × 8</option><option value="2">10 × 10</option></select></label>
      <div class="hint">Trois pareils à la suite s'allument en rouge. Les barres au bord comptent les soleils : vertes quand la ligne en a juste la moitié.</div><div class="hint">Chaque grille a une seule solution.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2;min-width:320px;position:relative}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{width:min(100%,max(240px,calc((100vh - 200px) * 320 / 340)));height:auto;aspect-ratio:320/340}
.gameBox:fullscreen{padding:0;display:grid;place-items:center}
.gameBox:fullscreen canvas{height:100vh;width:auto}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "BINAIRE", T: {"k": "#030a14", "k2": "#08162a", "fill": "#0e2240", "fillOn": "#143058", "hl": "#1c3a6a", "line": "#2e5a9a", "acc": "#ffd84a", "accL": "#fff4b0", "accS": "#c49a1a", "accD": "#4a3a06", "rivet": "#fff4b0", "btn": "#1c3a6a", "btnHi": "#4a7ac0", "btnLo": "#08162a", "btnHov": "#1c4478", "btnHovHi": "#6a9ae0", "text": "#eef6ff", "muted": "#a8c0e0", "acc2": "#b0c8ff", "gold": "#ffd84a", "orange": "#ffa030", "red": "#ff4a5a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#040c1a", "bgDot": "#0e2240", "bgDot2": "#08162a", "spark": "#2e5a9a", "spark2": "#b0c8ff", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["kkkkkkkkkkkk", "kgg.mm.gg.mk", "kgg.mm.gg.mk", "k..........k", "kmm.gg.mm.gk", "kmm.gg.mm.gk", "k..........k", "kgg.gg.mm.mk", "kgg.gg.mm.mk", "k..........k", "kmm.mm.gg.gk", "kkkkkkkkkkkk"],
  icons: [[/^NOUVELLE/, "play"], [/^RECORDS/, "crown"]] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
// petits outils communs aux jeux : une toile pré-dessinée, la position du pointeur dans le canevas, un bip
const cnv = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; fn(g); return c; };
const spr = (rows, pal) => cnv(Math.max(...rows.map(r => r.length)), rows.length, g => sprite(g, rows, 0, 0, pal));
const W = 320, H = 340, cv = $('gc'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
const cpos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
let actx = null;
const beep = (f, d = .1, type = 'square', slide = 0, vol = .08) => { try { actx ??= new AudioContext(); const o = actx.createOscillator(), gn = actx.createGain(), t = actx.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); gn.gain.setValueAtTime(vol, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(gn).connect(actx.destination); o.start(t); o.stop(t + d + .02); } catch {} };
const keyOk = e => view.classList.contains('on') && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName);
const showStats = rows => $('gStats').replaceChildren(...rows.flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));

/* ---------- Binaire : remplir la grille de soleils et de lunes. Jamais trois pareils à la suite, autant de chaque par ligne et par colonne, et deux lignes (ou colonnes) jamais identiques. ---------- */
const BN_SIZES = [6, 8, 10];
const bns = gstore('binaire', {size: 1, done: 0});
let bn = null;
function bnValid(gr, n, x, y) {  // la case (x, y) respecte-t-elle les règles, vu ce qui est déjà posé ?
  const v = gr[y][x], row = gr[y], col = gr.map(r => r[x]);
  for (const line of [row, col]) {
    const i = line === row ? x : y;
    for (let s = Math.max(0, i - 2); s <= Math.min(n - 3, i); s++) if (line[s] === v && line[s + 1] === v && line[s + 2] === v) return false;
    if (line.filter(c => c === v).length > n / 2) return false;
  }
  if (!row.includes(-1) && gr.some((r, j) => j !== y && !r.includes(-1) && r.join() === row.join())) return false;
  if (!col.includes(-1)) for (let j = 0; j < n; j++) if (j !== x) { const c2 = gr.map(r => r[j]); if (!c2.includes(-1) && c2.join() === col.join()) return false; }
  return true;
}
function bnSolve(gr, n, limit, rnd) {  // retour arrière simple ; -> nombre de solutions trouvées (jusqu'à limit), la première reste dans gr si limit === 1
  let found = 0; const cells = []; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (gr[y][x] < 0) cells.push([x, y]);
  const go = i => {
    if (i === cells.length) { found++; return found >= limit; }
    const [x, y] = cells[i], order = rnd && rnd() < .5 ? [1, 0] : [0, 1];
    for (const v of order) { gr[y][x] = v; if (bnValid(gr, n, x, y) && go(i + 1)) return true; }
    gr[y][x] = -1; return false;
  };
  go(0); return found;
}
function bnGen(n, seed) {
  const r = seeded(seed), full = Array.from({length: n}, () => Array(n).fill(-1)); bnSolve(full, n, 1, r);
  const puz = full.map(row => row.slice()), cells = []; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) cells.push([x, y]);
  for (let i = cells.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [cells[i], cells[j]] = [cells[j], cells[i]]; }
  for (const [x, y] of cells) { const v = puz[y][x]; puz[y][x] = -1; const t = puz.map(row => row.slice()); if (bnSolve(t, n, 2) !== 1) puz[y][x] = v; }  // on retire tant que la solution reste unique
  return {full, puz};
}
function bnNew() {
  const n = BN_SIZES[bns.size], seed = Math.floor(Math.random() * 1e9); $('gStats').replaceChildren(el('span', '', 'Préparation…'));
  setTimeout(() => {
    const {full, puz} = bnGen(n, seed), C = Math.floor(Math.min(W - 30, H - 56) / n);
    bn = Object.assign(bn || {tick: 0, raf: 0}, {mode: 'play', n, full, fixed: puz.map(r => r.map(v => v >= 0)), gr: puz.map(r => r.slice()), C, X0: Math.floor((W - n * C - 8) / 2), Y0: 40, ms: 0, endAt: 0, hist: [],
      anim: puz.map(r => r.map(() => -99)), sparks: []});
    bnInfo(); gameLoop(bn, 'binaire', bnUpdate, bnDraw);
  }, 20);
}
// le chrono avance seulement pendant que la partie tourne : quitter l'onglet le met en pause
const bnUpdate = () => { bn.ms += 1000 / 60; };
/* les dessins : soleils, lunes et cases sont tracés pixel par pixel à la taille des cases, une fois par taille */
const bnArt = {};
const bnDisc = (C, fn) => cnv(C, C, b => { const c = (C - 1) / 2; for (let y = 0; y < C; y++) for (let x = 0; x < C; x++) { const col = fn(x - c, y - c, c); if (col) px(b, col, x, y); } });
function bnSprites(C) {
  if (bnArt[C]) return bnArt[C];
  const r = C * .3;
  const sun = bnDisc(C, (x, y) => {
    const d = Math.hypot(x, y), an = Math.atan2(y, x), ray = Math.abs(((an / (Math.PI / 4)) % 1 + 1) % 1 - .5) < .17 - (d - r) / (r * 4);
    if (d > r + 1.2 && d < r * 1.75 && ray) return d < r * 1.4 ? '#ffb030' : '#ff8a2a';
    if (d > r + 1.2) return null;
    if (d > r) return '#05010b';
    const lt = -(x * .6 + y * .8) / r;
    if (Math.hypot(x + r * .4, y + r * .45) < r * .18) return '#fffbe0';
    return d > r * .82 ? (lt > 0 ? '#ffc840' : '#e07a20') : lt > .35 ? '#fff4a0' : lt > -.3 ? '#ffd84a' : '#f0a830';
  });
  const moon = bnDisc(C, (x, y) => {
    const R = r * 1.15, d = Math.hypot(x, y), cut = Math.hypot(x - R * .55, y + R * .3);
    if (d > R + 1 || cut < R * .78 - 1) return null;
    if (d > R || cut < R * .78) return '#05010b';
    if (Math.hypot(x + R * .3, y - R * .35) < R * .14 || Math.hypot(x + R * .55, y + R * .1) < R * .1) return '#7a8ac0';
    const lt = -(x * .7 + y * .5) / R;
    return d > R * .86 ? '#8a9ad0' : lt > .3 ? '#ffffff' : lt > -.25 ? '#d8e4ff' : '#a8b8e8';
  });
  const tile = (top, mid, bot, rivet) => cnv(C - 1, C - 1, b => {
    px(b, mid, 0, 0, C - 1, C - 1); px(b, top, 0, 0, C - 1, 2); px(b, top, 0, 0, 2, C - 1); px(b, bot, 0, C - 3, C - 1, 2); px(b, bot, C - 3, 0, 2, C - 1);
    if (rivet) for (const [x, y] of [[4, 4], [C - 7, 4], [4, C - 7], [C - 7, C - 7]]) { px(b, rivet, x, y, 2, 2); px(b, '#05010b', x + 1, y + 1, 1, 1); }
  });
  return bnArt[C] = {sun, moon, free: tile('#3a4a7a', '#26305a', '#141a36'), fixed: tile('#5a6488', '#3e4668', '#20253e', '#8a94b8'), bad: tile('#c04050', '#7a1e30', '#3a0a16'), win: tile('#ffd870', '#9a6a1c', '#5a3a08')};
}
// le ciel derrière la grille : il passe doucement du jour à la nuit, nuages le jour, étoiles la nuit
const BN_STARS = Array.from({length: 60}, (_, i) => { const r = seeded(900 + i); return [r() * W, r() * H, r() * 6.28]; });
const bnSky = [['#4a90e0', '#6aaaf0', '#90c4f8', '#b8dcff'], ['#060818', '#0a1028', '#101a3a', '#1a2450']].map(cols => cnv(W, H, b => { for (let y = 0; y < H; y++) px(b, cols[Math.min(3, Math.floor(y / H * 4 + ((y * 7) % 3 === 0 ? .15 : 0)))], 0, y, W, 1); }));
function bnBack(t) {
  const night = .5 - .5 * Math.cos(t / 2400 * Math.PI * 2);  // un tour complet en un peu plus de 2 minutes
  g.drawImage(bnSky[0], 0, 0); g.globalAlpha = night; g.drawImage(bnSky[1], 0, 0);
  for (const [x, y, p] of BN_STARS) { g.globalAlpha = night * (.5 + .5 * Math.sin(t / 25 + p)); px(g, '#ffffff', x, y, 1, 1); }
  g.globalAlpha = 1 - night;
  for (let i = 0; i < 4; i++) { const x = ((i * 97 + t * (.1 + i * .03)) % (W + 80)) - 60, y = 20 + i * 76; px(g, '#ffffff', x, y, 40, 6); px(g, '#ffffff', x + 8, y - 4, 22, 4); px(g, '#e0eeff', x, y + 6, 40, 2); }
  g.globalAlpha = 1;
}
function bnErrors() {  // les cases qui forment un triple (montrées en rouge)
  const bad = new Set(), {n, gr} = bn;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) for (const [dx, dy] of [[1, 0], [0, 1]]) { const v = gr[y][x]; if (v >= 0 && gr[y + dy]?.[x + dx] === v && gr[y + 2 * dy]?.[x + 2 * dx] === v) for (let i = 0; i < 3; i++) bad.add((x + dx * i) + ',' + (y + dy * i)); }
  return bad;
}
function bnDraw() {
  const {n, C, X0, Y0, gr} = bn, bad = bnErrors(), A = bnSprites(C), t = bn.tick, won = bn.mode === 'won', wt = t - bn.endAt;
  bnBack(t);
  px(g, 'rgba(5,1,11,.55)', X0 - 6, Y0 - 6, n * C + 20, n * C + 20); px(g, '#05010b', X0 - 3, Y0 - 3, n * C + 5, n * C + 5);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const X = X0 + x * C, Y = Y0 + y * C, v = gr[y][x], wave = won ? wt - (x + y) * 3 : -1;
    g.drawImage(wave >= 0 && wave < 40 ? A.win : bad.has(x + ',' + y) ? A.bad : bn.fixed[y][x] ? A.fixed : A.free, X, Y);
    if (v < 0) continue;
    const k = (t - bn.anim[y][x]) / 14, hop = k < 1 ? Math.round(Math.sin(k * Math.PI) * C * .18) : wave >= 0 && wave < 20 ? Math.round(Math.sin(wave / 20 * Math.PI) * C * .25) : 0;
    g.drawImage(v ? A.sun : A.moon, X, Y - hop);
    if (k < 1) { g.strokeStyle = v ? 'rgba(255,216,74,' + (1 - k).toFixed(2) + ')' : 'rgba(216,228,255,' + (1 - k).toFixed(2) + ')'; g.lineWidth = 2; g.beginPath(); g.arc(X + C / 2, Y + C / 2, C * (.3 + k * .3), 0, 7); g.stroke(); }
  }
  const half = n / 2; for (let i = 0; i < n; i++) {  // compteurs : soleils de chaque ligne et colonne (vert quand c'est juste la moitié, rouge quand il y en a trop)
    const r = gr[i].filter(v => v === 1).length, c = gr.map(rr => rr[i]).filter(v => v === 1).length, col = s => s === half ? '#5fdf6a' : s > half ? '#ff4a5a' : '#4a5480';
    px(g, '#05010b', X0 + n * C + 2, Y0 + i * C + 2, 6, C - 4); px(g, col(r), X0 + n * C + 3, Y0 + i * C + 3 + Math.round((C - 6) * (1 - Math.min(r, half) / half)), 4, Math.round((C - 6) * Math.min(r, half) / half) || 1);
    px(g, '#05010b', X0 + i * C + 2, Y0 + n * C + 2, C - 4, 6); px(g, col(c), X0 + i * C + 3, Y0 + n * C + 3, Math.round((C - 6) * Math.min(c, half) / half) || 1, 4);
  }
  // le bandeau : taille, cases remplies, chrono
  const filled = gr.flat().filter(v => v >= 0).length;
  px(g, 'rgba(5,1,11,.78)', 0, 0, W, 26); px(g, '#2a3460', 0, 26, W, 1);
  pxFont(g, n + ' × ' + n, 8, 17, '#c8d0f0', 8); pxFont(g, filled + ' / ' + n * n, W / 2, 17, '#ffd84a', 8, 'center'); pxFont(g, clock(Math.floor(bn.ms / 1000)), W - 8, 17, '#ffffff', 8, 'right');
  if (won) {
    if (wt < 90 && wt % 3 === 0) bn.sparks.push({x: X0 + Math.random() * n * C, y: Y0 + n * C, vx: (Math.random() - .5) * 2, vy: -2 - Math.random() * 3, c: Math.random() < .5 ? '#ffd84a' : '#d8e4ff', l: 60});
    for (const s of bn.sparks) { s.x += s.vx; s.y += s.vy; s.vy += .08; s.l--; px(g, s.c, s.x, s.y, 2, 2); }
    bn.sparks = bn.sparks.filter(s => s.l > 0);
    if (wt > 60) gameText(g, W, [['GRILLE RÉSOLUE !', '#5fdf6a', 16], ['en ' + clock(Math.floor(bn.ms / 1000)), '#ffffff'], ['Clic : nouvelle grille', '#ffd84a']], H / 2 - 10);
  }
}
function bnSet(x, y, v) {
  if (bn.mode !== 'play' || bn.fixed[y][x]) return; bn.hist.push([x, y, bn.gr[y][x]]); bn.gr[y][x] = v; bn.anim[y][x] = v < 0 ? -99 : bn.tick; beep(v === 1 ? 660 : v === 0 ? 440 : 300, .03, 'triangle', 0, .05);
  if (bn.gr.every((r, j) => r.every((c, i) => c === bn.full[j][i]))) { bn.mode = 'won'; bn.endAt = bn.tick; bns.done++; const sec = Math.round(bn.ms / 1000), k = 'binaire' + bn.n; if (!games.best[k] || sec < games.best[k]) games.best[k] = sec; saveGames(); bnInfo(); [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .14, 'triangle'), i * 100)); }
}
cv.onpointerdown = e => {
  e.preventDefault(); if (!bn) return; if (bn.mode === 'won') { if (bn.tick - bn.endAt > 60) bnNew(); return; }
  const [mx, my] = cpos(e), x = Math.floor((mx - bn.X0) / bn.C), y = Math.floor((my - bn.Y0) / bn.C); if (x < 0 || y < 0 || x >= bn.n || y >= bn.n) return;
  const v = bn.gr[y][x]; bnSet(x, y, e.button === 2 ? (v === 0 ? -1 : 0) : (v === -1 ? 1 : v === 1 ? 0 : -1));  // clic : vide → soleil → lune → vide ; clic droit : lune
};
cv.oncontextmenu = e => e.preventDefault();
document.addEventListener('keydown', e => { if (!keyOk(e) || !bn) return; if (e.key === 'Backspace') { e.preventDefault(); const h = bn.hist.pop(); if (h && bn.mode === 'play') { bn.gr[h[1]][h[0]] = h[2]; bn.anim[h[1]][h[0]] = -99; } } });
function bnInfo() { const b = games.best['binaire' + BN_SIZES[bns.size]]; showStats([['Record en ' + BN_SIZES[bns.size] + ' × ' + BN_SIZES[bns.size], b ? clock(b) : '—'], ['Grilles résolues', bns.done]]); $('bnSize').value = bns.size; }
$('gNew').onclick = () => { bnNew(); $('gNew').blur(); };
$('bnFs').onclick = () => { cv.parentElement.requestFullscreen?.().catch(() => {}); $('bnFs').blur(); };
$('bnSize').onchange = () => { bns.size = +$('bnSize').value; saveGames(); bnNew(); $('bnSize').blur(); };
{  // vérification : une grille générée a une seule solution, et cette solution respecte toutes les règles
  const {full, puz} = bnGen(6, 42), t = puz.map(r => r.slice()); let ok = bnSolve(t, 6, 2) === 1;
  for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) ok &&= bnValid(full, 6, x, y);
  ok &&= puz.flat().includes(-1) && BN_SIZES.every(n => Math.floor(Math.min(W - 30, H - 56) / n) >= 24);
  console.assert(ok, 'binaire'); view.dataset.selfcheck = ok ? 'ok' : 'grille';
}
const bnOpen = () => { if (!bn) return bnNew(); if (bn.mode === 'pause') bn.mode = 'play'; gameLoop(bn, 'binaire', bnUpdate, bnDraw); };  // revenir sur l'onglet relance la partie là où elle était
ctx.onOpen(() => { cv.__bn = {st: () => bn, open: bnOpen}; bnOpen(); });

}
