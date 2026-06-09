/**
 * history.js
 * Mengelola riwayat operasi enkripsi/dekripsi.
 * Data disimpan di array in-memory; bisa dilihat, dimuat ulang, dan dihapus.
 */

// Array riwayat — item terbaru di indeks 0
let history = [];

/**
 * Menambahkan satu entri baru ke riwayat dan me-render ulang daftarnya.
 * @param {'encrypt'|'decrypt'} mode
 * @param {string} input  - Teks input asli
 * @param {string} output - Teks hasil cipher
 * @param {number} key    - Kunci yang digunakan
 */
function addHistory(mode, input, output, key) {
  const entry = {
    mode,
    input,
    output,
    key,
    time: new Date().toLocaleTimeString('id-ID', {
      hour:   '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };

  history.unshift(entry);   // tambah di awal supaya terbaru di atas
  renderHistory();
}

/**
 * Me-render ulang seluruh daftar riwayat ke dalam DOM.
 */
function renderHistory() {
  const list = document.getElementById('historyList');

  if (!history.length) {
    list.innerHTML = '<div class="history-empty">⧗ Belum ada riwayat operasi</div>';
    return;
  }

  list.innerHTML = history.map((h, i) => {
    const typeClass = h.mode === 'encrypt' ? 'enc' : 'dec';
    const typeLabel = h.mode === 'encrypt' ? '🔒 Enkripsi' : '🔓 Dekripsi';
    const keyHex    = h.key.toString(16).toUpperCase().padStart(2, '0');
    const inputPrev = escapeHtml(h.input.substring(0, 30))  + (h.input.length  > 30 ? '…' : '');
    const outPrev   = escapeHtml(h.output.substring(0, 30)) + (h.output.length > 30 ? '…' : '');

    return `
      <div class="history-item" onclick="loadFromHistory(${i})">
        <div class="history-meta">
          <span class="history-type ${typeClass}">${typeLabel}</span>
          <span class="history-key">Key: ${h.key} (0x${keyHex})</span>
        </div>
        <div class="history-texts">
          <div>
            <div class="history-field">Input</div>
            <div class="history-value" title="${escapeHtml(h.input)}">${inputPrev}</div>
          </div>
          <div>
            <div class="history-field">Output</div>
            <div class="history-value" title="${escapeHtml(h.output)}">${outPrev}</div>
          </div>
        </div>
        <div class="history-time">${h.time}</div>
      </div>`;
  }).join('');
}

/**
 * Memuat data dari riwayat ke form input, lalu berpindah ke tab Cipher.
 * @param {number} idx - Indeks pada array history
 */
function loadFromHistory(idx) {
  const h = history[idx];
  document.getElementById('inputText').value = h.input;
  document.getElementById('keyInput').value  = h.key;
  updateKeyBadge();
  switchTab('cipher');
  showToast('📋 Data dimuat dari riwayat!');
}

/**
 * Menghapus semua riwayat dan me-render ulang daftar kosong.
 */
function clearHistory() {
  history = [];
  renderHistory();
  showToast('🗑️ Riwayat dihapus!');
}