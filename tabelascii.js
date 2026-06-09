/**
 * tabelascii.js
 * Data, render, filter, dan pencarian Tabel ASCII (0–255).
 * Semua karakter ditampilkan dengan label yang informatif.
 */

/* ── Nama karakter kontrol (0–31 & 127) ── */
const ASCII_NAMES = {
  0:"NUL — Null",             1:"SOH — Start of Heading",  2:"STX — Start of Text",
  3:"ETX — End of Text",      4:"EOT — End of Transmission",5:"ENQ — Enquiry",
  6:"ACK — Acknowledge",      7:"BEL — Bell",               8:"BS — Backspace",
  9:"HT — Horizontal Tab",   10:"LF — Line Feed",          11:"VT — Vertical Tab",
  12:"FF — Form Feed",        13:"CR — Carriage Return",    14:"SO — Shift Out",
  15:"SI — Shift In",         16:"DLE — Data Link Escape",  17:"DC1 — Device Control 1",
  18:"DC2 — Device Control 2",19:"DC3 — Device Control 3", 20:"DC4 — Device Control 4",
  21:"NAK — Neg. Acknowledge",22:"SYN — Synchronous Idle", 23:"ETB — End of Block",
  24:"CAN — Cancel",          25:"EM — End of Medium",      26:"SUB — Substitute",
  27:"ESC — Escape",          28:"FS — File Separator",     29:"GS — Group Separator",
  30:"RS — Record Separator", 31:"US — Unit Separator",    127:"DEL — Delete"
};

/* ── Simbol visual untuk kontrol (CP437) ── */
const CTRL_SYMBOLS = {
  0:'∅', 1:'☺', 2:'☻', 3:'♥', 4:'♦', 5:'♣', 6:'♠', 7:'•',
  8:'◘', 9:'○',10:'◙',11:'♂',12:'♀',13:'♪',14:'♫',15:'☼',
  16:'►',17:'◄',18:'↕',19:'‼',20:'¶',21:'§',22:'▬',23:'↨',
  24:'↑',25:'↓',26:'→',27:'←',28:'∟',29:'↔',30:'▲',31:'▼',
  127:'⌂'
};

/* ── Nama Extended ASCII Latin-1 / Windows-1252 (128–255) ── */
const EXT_NAMES = {
  128:'€',   129:'',    130:'‚',   131:'ƒ',   132:'„',   133:'…',
  134:'†',   135:'‡',   136:'ˆ',   137:'‰',   138:'Š',   139:'‹',
  140:'Œ',   141:'',    142:'Ž',   143:'',    144:'',    145:'\u2018',
  146:'\u2019',147:'\u201C',148:'\u201D',149:'•', 150:'–', 151:'—',
  152:'˜',   153:'™',   154:'š',   155:'›',   156:'œ',   157:'',
  158:'ž',   159:'Ÿ',   160:'\u00A0',161:'¡', 162:'¢',   163:'£',
  164:'¤',   165:'¥',   166:'¦',   167:'§',   168:'¨',   169:'©',
  170:'ª',   171:'«',   172:'¬',   173:'­',   174:'®',   175:'¯',
  176:'°',   177:'±',   178:'²',   179:'³',   180:'´',   181:'µ',
  182:'¶',   183:'·',   184:'¸',   185:'¹',   186:'º',   187:'»',
  188:'¼',   189:'½',   190:'¾',   191:'¿',   192:'À',   193:'Á',
  194:'Â',   195:'Ã',   196:'Ä',   197:'Å',   198:'Æ',   199:'Ç',
  200:'È',   201:'É',   202:'Ê',   203:'Ë',   204:'Ì',   205:'Í',
  206:'Î',   207:'Ï',   208:'Ð',   209:'Ñ',   210:'Ò',   211:'Ó',
  212:'Ô',   213:'Õ',   214:'Ö',   215:'×',   216:'Ø',   217:'Ù',
  218:'Ú',   219:'Û',   220:'Ü',   221:'Ý',   222:'Þ',   223:'ß',
  224:'à',   225:'á',   226:'â',   227:'ã',   228:'ä',   229:'å',
  230:'æ',   231:'ç',   232:'è',   233:'é',   234:'ê',   235:'ë',
  236:'ì',   237:'í',   238:'î',   239:'ï',   240:'ð',   241:'ñ',
  242:'ò',   243:'ó',   244:'ô',   245:'õ',   246:'ö',   247:'÷',
  248:'ø',   249:'ù',   250:'ú',   251:'û',   252:'ü',   253:'ý',
  254:'þ',   255:'ÿ'
};

/* ── Deskripsi Extended ASCII ── */
const EXT_DESC = {
  128:'Euro sign',        129:'(tidak dipakai)',  130:'Single low-9 quote',
  131:'Latin f with hook',132:'Double low-9 quote',133:'Horizontal ellipsis',
  134:'Dagger',           135:'Double dagger',    136:'Modifier circumflex',
  137:'Per mille sign',   138:'Latin S caron',    139:'Single left angle',
  140:'Latin OE ligature',141:'(tidak dipakai)',  142:'Latin Z caron',
  143:'(tidak dipakai)',  144:'(tidak dipakai)',  145:'Left single quote',
  146:'Right single quote',147:'Left double quote',148:'Right double quote',
  149:'Bullet',           150:'En dash',          151:'Em dash',
  152:'Small tilde',      153:'Trade mark sign',  154:'Latin s caron',
  155:'Single right angle',156:'Latin oe ligature',157:'(tidak dipakai)',
  158:'Latin z caron',    159:'Latin Y diaeresis',160:'Non-breaking space',
  161:'Inverted exclamation',162:'Cent sign',     163:'Pound sign',
  164:'Currency sign',    165:'Yen sign',         166:'Broken bar',
  167:'Section sign',     168:'Diaeresis',        169:'Copyright sign',
  170:'Feminine ordinal', 171:'Left angle quote', 172:'Not sign',
  173:'Soft hyphen',      174:'Registered sign',  175:'Macron',
  176:'Degree sign',      177:'Plus-minus sign',  178:'Superscript 2',
  179:'Superscript 3',    180:'Acute accent',     181:'Micro sign (mu)',
  182:'Pilcrow sign',     183:'Middle dot',       184:'Cedilla',
  185:'Superscript 1',    186:'Masculine ordinal',187:'Right angle quote',
  188:'One quarter',      189:'One half',         190:'Three quarters',
  191:'Inverted question',
};

/* State filter & search */
let asciiFilter = 'all';
let asciiSearch = '';

/* ────────────────────────────────────────
   TAMPILAN KARAKTER
   ──────────────────────────────────────── */
function getCharDisplay(n) {
  /* Spasi */
  if (n === 32) {
    return `<span class="acd-badge acd-space">SP</span>`;
  }
  /* Kontrol (0–31 & 127) */
  if (n < 32 || n === 127) {
    const sym = CTRL_SYMBOLS[n] || '·';
    return `<span class="acd-ctrl" title="${ASCII_NAMES[n]||''}">${sym}</span>`;
  }
  /* Printable ASCII (33–126) */
  if (n <= 126) {
    return `<span class="acd-print">${escHtml(String.fromCharCode(n))}</span>`;
  }
  /* Extended ASCII (128–255) */
  const ch = EXT_NAMES[n];
  if (ch && ch.trim()) {
    return `<span class="acd-ext" title="Win-1252 / Latin-1">${ch}</span>`;
  }
  return `<span class="acd-badge acd-np">·</span>`;
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ────────────────────────────────────────
   DESKRIPSI
   ──────────────────────────────────────── */
function getAsciiDesc(n) {
  if (n === 32)  return 'Spasi (Space)';
  if (n === 127) return 'Delete (DEL)';
  if (ASCII_NAMES[n]) {
    /* ambil bagian setelah ' — ' jika ada */
    const parts = ASCII_NAMES[n].split(' — ');
    return parts.length > 1 ? parts[1] : parts[0];
  }
  if (n >= 48 && n <= 57)  return `Digit '${String.fromCharCode(n)}'`;
  if (n >= 65 && n <= 90)  return `Huruf besar '${String.fromCharCode(n)}'`;
  if (n >= 97 && n <= 122) return `Huruf kecil '${String.fromCharCode(n)}'`;
  if ((n >= 33 && n <= 47) || (n >= 58 && n <= 64) ||
      (n >= 91 && n <= 96) || (n >= 123 && n <= 126)) return 'Tanda baca';
  if (n >= 128) return EXT_DESC[n] || 'Extended ASCII (Latin-1)';
  return '—';
}

/* ────────────────────────────────────────
   BUILD TABLE
   ──────────────────────────────────────── */
function buildAsciiTable() {
  const tbody = document.getElementById('asciiTableBody');
  if (!tbody) return;
  let html = '';

  for (let i = 0; i <= 255; i++) {
    const hex = i.toString(16).toUpperCase().padStart(2, '0');
    const oct = i.toString(8).padStart(3, '0');
    const bin = i.toString(2).padStart(8, '0');
    const cat = i < 32 || i === 127 ? 'control'
              : i <= 126            ? 'printable'
              :                       'extended';

    /* nilai untuk search */
    const chSearch = (i >= 33 && i <= 126)
      ? String.fromCharCode(i)
      : (EXT_NAMES[i] || '');

    /* badge kategori */
    const catBadge = cat === 'control'   ? '<span class="acat acat-ctrl">CTRL</span>'
                   : cat === 'extended'  ? '<span class="acat acat-ext">EXT</span>'
                   : '';

    html += `<tr data-dec="${i}" data-hex="${hex}" data-cat="${cat}" data-char="${escHtml(chSearch).toLowerCase()}">
      <td><span class="adec">${i}</span>${catBadge}</td>
      <td class="amono">0x${hex}</td>
      <td class="amono">0${oct}</td>
      <td class="amono abin">${bin}</td>
      <td class="achar-col">${getCharDisplay(i)}</td>
      <td class="adesc">${getAsciiDesc(i)}</td>
    </tr>`;
  }

  tbody.innerHTML = html;
}

/* ────────────────────────────────────────
   FILTER & SEARCH
   ──────────────────────────────────────── */
function filterAscii(type, btn) {
  asciiFilter = type;
  document.querySelectorAll('.ascii-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyAsciiFilter();
}

function searchAscii() {
  asciiSearch = document.getElementById('asciiSearch').value.trim().toLowerCase();
  applyAsciiFilter();
}

function applyAsciiFilter() {
  document.querySelectorAll('#asciiTableBody tr').forEach(row => {
    const cat = row.dataset.cat;
    const dec = row.dataset.dec;
    const hex = row.dataset.hex.toLowerCase();
    const ch  = row.dataset.char;

    let visible = asciiFilter === 'all' || cat === asciiFilter;
    if (visible && asciiSearch) {
      visible = dec.includes(asciiSearch)
             || hex.includes(asciiSearch)
             || ('0x' + hex).includes(asciiSearch)
             || ch.includes(asciiSearch);
    }
    row.style.display = visible ? '' : 'none';
  });
}

function highlightAsciiRow(code) {
  document.querySelectorAll('#asciiTableBody tr').forEach(r => r.classList.remove('highlighted'));
  document.querySelectorAll('#asciiTableBody tr').forEach(r => {
    if (parseInt(r.dataset.dec) === code) {
      r.classList.add('highlighted');
      r.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
}