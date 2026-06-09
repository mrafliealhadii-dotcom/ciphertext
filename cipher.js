/**
 * cipher.js
 * Berisi logika enkripsi dan dekripsi Caesar Cipher berbasis ASCII (0–255).
 *
 * Rumus:
 *   Enkripsi : (ASCII + key) mod 256
 *   Dekripsi : (ASCII - key + 256) mod 256
 */

function caesarEncrypt(text, key) {
  let result = '';
  const steps = [];
  for (let i = 0; i < text.length; i++) {
    const origCode = text.charCodeAt(i);
    const encCode  = (origCode + key) % 256;
    result += String.fromCharCode(encCode);
    steps.push({ char: text[i], orig: origCode, encChar: String.fromCharCode(encCode), enc: encCode });
  }
  return { result, steps };
}

function caesarDecrypt(text, key) {
  let result = '';
  const steps = [];
  for (let i = 0; i < text.length; i++) {
    const origCode = text.charCodeAt(i);
    const decCode  = ((origCode - key) % 256 + 256) % 256;
    result += String.fromCharCode(decCode);
    steps.push({ char: text[i], orig: origCode, encChar: String.fromCharCode(decCode), enc: decCode });
  }
  return { result, steps };
}

function processText(mode) {
  const text   = document.getElementById('inputText').value;
  const rawKey = parseInt(document.getElementById('keyInput').value);

  if (!text) { showToast('⚠️ Masukkan teks terlebih dahulu!'); return; }
  if (isNaN(rawKey) || rawKey < 0 || rawKey > 255) { showToast('⚠️ Kunci harus antara 0 – 255!'); return; }

  const { result, steps } = mode === 'encrypt'
    ? caesarEncrypt(text, rawKey)
    : caesarDecrypt(text, rawKey);

  const box = document.getElementById('outputBox');
  box.innerHTML = escapeHtml(result);
  box.classList.add('has-result');

  const copyBtn = document.createElement('button');
  copyBtn.className   = 'copy-btn';
  copyBtn.textContent = 'COPY';
  copyBtn.onclick     = () => { navigator.clipboard.writeText(result); showToast('✓ Disalin ke clipboard!'); };
  box.appendChild(copyBtn);

  document.getElementById('cipherStats').style.display = 'flex';
  document.getElementById('statLen').textContent   = result.length;
  document.getElementById('statKey').textContent   = rawKey;
  document.getElementById('statMode').textContent  = mode === 'encrypt' ? 'Enkripsi' : 'Dekripsi';
  document.getElementById('statUniq').textContent  = new Set(result).size;
  document.getElementById('modeLabel').textContent = mode === 'encrypt' ? '🔒 ENKRIPSI' : '🔓 DEKRIPSI';

  renderProcessVis(steps, mode, rawKey);
  addHistory(mode, text, result, rawKey);
  showToast(mode === 'encrypt' ? '🔒 Enkripsi berhasil!' : '🔓 Dekripsi berhasil!');
}

/* ─── RENDER VISUALISASI ─────────────────────────────────────── */
function renderProcessVis(steps, mode, key) {
  const hint  = document.getElementById('processHint');
  const chars = document.getElementById('processChars');

  hint.style.display = 'none';

  const isEncrypt = mode === 'encrypt';
  const formulaLabel = isEncrypt
    ? `(ASCII + ${key}) mod 256`
    : `(ASCII − ${key} + 256) mod 256`;

  /* ── Banner rumus ── */
  const banner = `
    <div class="vis-formula-banner">
      <div class="vis-formula-title">
        <span class="vis-mode-pill ${isEncrypt ? 'encrypt' : 'decrypt'}">
          ${isEncrypt ? '🔒 ENKRIPSI' : '🔓 DEKRIPSI'}
        </span>
        <span class="vis-formula-text">
          Rumus: <code>${formulaLabel}</code>
        </span>
        <span class="vis-char-count">${steps.length} karakter</span>
      </div>
      <div class="vis-legend">
        <span class="leg-item"><span class="leg-dot orig"></span>Karakter asal</span>
        <span class="leg-item"><span class="leg-dot ascii"></span>Nilai ASCII</span>
        <span class="leg-item"><span class="leg-dot result"></span>Hasil</span>
      </div>
    </div>`;

  /* ── Kartu per karakter ── */
  const display = steps.slice(0, 48);
  let cards = '';

  display.forEach((s, idx) => {
    const origDisp   = s.char    === ' ' ? '␣' : escapeHtml(s.char);
    const encDisp    = s.encChar === ' ' ? '␣' : escapeHtml(s.encChar);
    const origPrint  = (s.orig >= 32 && s.orig < 127);
    const encPrint   = (s.enc  >= 32 && s.enc  < 127);
    const operation  = isEncrypt
      ? `${s.orig} + ${key} = ${s.orig + key} → mod 256 = ${s.enc}`
      : `${s.orig} − ${key} + 256 = ${s.orig - key + 256} → mod 256 = ${s.enc}`;

    cards += `
      <div class="vis-card" style="animation-delay:${idx * 0.025}s" title="${operation}">
        <!-- Karakter asal -->
        <div class="vc-top">
          <span class="vc-char orig" title="Karakter: ${origDisp}">${origDisp}</span>
          <span class="vc-ascii orig-ascii">${s.orig}</span>
        </div>

        <!-- Rumus singkat -->
        <div class="vc-formula">
          <span class="vc-op">${isEncrypt ? `+${key}` : `−${key}`}</span>
          <span class="vc-mod">mod 256</span>
        </div>

        <!-- Tanda panah -->
        <div class="vc-arrow">${isEncrypt ? '↓' : '↑'}</div>

        <!-- Hasil -->
        <div class="vc-bottom">
          <span class="vc-ascii result-ascii">${s.enc}</span>
          <span class="vc-char result ${encPrint ? '' : 'unprintable'}"
                title="${encPrint ? 'Karakter: ' + encDisp : 'Non-printable (ASCII ' + s.enc + ')'}">
            ${encPrint ? encDisp : '·'}
          </span>
        </div>
      </div>`;
  });

  /* ── Kartu overflow ── */
  let overflow = '';
  if (steps.length > 48) {
    overflow = `
      <div class="vis-overflow">
        <span>+${steps.length - 48} karakter lainnya tidak ditampilkan</span>
      </div>`;
  }

  chars.innerHTML = banner + `<div class="vis-cards-grid">${cards}</div>` + overflow;
}

function resetAll() {
  document.getElementById('inputText').value = '';
  document.getElementById('keyInput').value  = '13';

  const box = document.getElementById('outputBox');
  box.innerHTML = '<span class="output-placeholder">Hasil akan muncul di sini...</span>';
  box.classList.remove('has-result');

  document.getElementById('cipherStats').style.display = 'none';
  document.getElementById('modeLabel').textContent      = '—';
  document.getElementById('processChars').innerHTML     = '';

  const hint = document.getElementById('processHint');
  hint.style.display = 'block';
  hint.textContent   = 'Masukkan teks dan tekan Enkripsi / Dekripsi untuk melihat proses per karakter';

  updateKeyBadge();
  showToast('↺ Direset!');
}