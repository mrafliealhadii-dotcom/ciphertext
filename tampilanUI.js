/**
 * tampilanUI.js
 * Fungsi-fungsi pembantu antarmuka:
 *   - switchTab      : perpindahan antar tab + sync sidebar active state
 *   - toggleSidebar  : buka/tutup sidebar drawer
 *   - closeSidebar   : tutup sidebar drawer
 *   - showToast      : notifikasi singkat di pojok layar
 *   - updateKeyBadge : memperbarui badge info kunci
 *   - escapeHtml     : mengamankan string sebelum dimasukkan ke innerHTML
 */

/* ─── SIDEBAR ──────────────────────────────────────────────── */

function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const btn      = document.getElementById('hamburgerBtn');
  const isOpen   = sidebar.classList.toggle('open');
  overlay.classList.toggle('open', isOpen);
  btn.classList.toggle('open', isOpen);
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
  document.getElementById('hamburgerBtn').classList.remove('open');
}

/* ─── TAB SWITCHING ────────────────────────────────────────── */

/**
 * Berpindah ke tab yang dipilih dan sync active state sidebar.
 * @param {'cipher'|'history'|'ascii'} name
 */
function switchTab(name) {
  // Sembunyikan semua konten tab
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

  // Nonaktifkan semua sidebar item
  document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));

  // Aktifkan tab konten
  const content = document.getElementById('tab-' + name);
  if (content) content.classList.add('active');

  // Aktifkan sidebar item yang sesuai
  const navItem = document.getElementById('nav-' + name);
  if (navItem) navItem.classList.add('active');

  // Tutup sidebar setelah memilih
  closeSidebar();
}

/* ─── TOAST ────────────────────────────────────────────────── */

/**
 * Menampilkan notifikasi toast selama 2,5 detik.
 * @param {string} msg - Pesan yang ditampilkan
 */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ─── KEY BADGE ────────────────────────────────────────────── */

/**
 * Memperbarui badge di sebelah input kunci dengan nilai & representasi ASCII-nya.
 */
function updateKeyBadge() {
  const k     = parseInt(document.getElementById('keyInput').value);
  const badge = document.getElementById('keyBadge');

  if (isNaN(k) || k < 0 || k > 255) {
    badge.textContent = 'Key: — (tidak valid)';
    badge.style.borderColor = 'var(--danger-br)';
    badge.style.color       = 'var(--danger)';
    return;
  }

  // Kembalikan warna normal
  badge.style.borderColor = '';
  badge.style.color       = '';

  const isPrintable = k >= 32 && k <= 126;
  const charRepr    = isPrintable
    ? `'${String.fromCharCode(k)}'`
    : `0x${k.toString(16).toUpperCase().padStart(2, '0')}`;

  badge.textContent = `Key: ${k} → ${charRepr}`;
}

/* ─── ESCAPE HTML ──────────────────────────────────────────── */

/**
 * Men-escape karakter HTML khusus agar aman dimasukkan ke innerHTML.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}

/* ─── INIT ─────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  // Pasang listener real-time untuk key badge
  const keyInput = document.getElementById('keyInput');
  if (keyInput) {
    keyInput.addEventListener('input', updateKeyBadge);
    updateKeyBadge(); // inisialisasi awal
  }

  // Pastikan tab cipher aktif di awal
  switchTab('cipher');
});