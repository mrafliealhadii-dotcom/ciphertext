/**
 * main.js
 * Entry point aplikasi CipherLab.
 * Dipanggil setelah semua modul lain (ascii.js, cipher.js, history.js, ui.js) dimuat.
 */

// ── Navbar Toggle Functions ──
function toggleNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburgerBtn');
  navbar.classList.toggle('hidden');
  hamburger.classList.toggle('active');
}

function closeNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburgerBtn');
  navbar.classList.add('hidden');
  hamburger.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Bangun tabel ASCII ──
  buildAsciiTable();

  // ── 2. Sinkronkan badge kunci saat halaman pertama kali dimuat ──
  updateKeyBadge();

  // ── 3. Daftarkan event listener input kunci ──
  document.getElementById('keyInput').addEventListener('input', updateKeyBadge);

  // ── 4. Tangani Enter di textarea input ──
  //    Shift+Enter = baris baru (default), Enter saja = enkripsi
  document.getElementById('inputText').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      processText('encrypt');
    }
  });

  // ── 5. Keyboard shortcut global ──
  //    Ctrl+E = Enkripsi   Ctrl+D = Dekripsi   Ctrl+R = Reset
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'e':
          e.preventDefault();
          processText('encrypt');
          break;
        case 'd':
          e.preventDefault();
          processText('decrypt');
          break;
        case 'r':
          e.preventDefault();
          resetAll();
          break;
      }
    }
  });

});