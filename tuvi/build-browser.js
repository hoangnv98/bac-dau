/* Đóng gói module Tử Vi thành 1 file script thuần cho trình duyệt -> ../js/tuvi.bundle.js (window.TuVi) */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const files = ['constants.js', 'canchi.js', 'stars.js', 'meanings.js', 'lunar.js', 'chart.js', 'format.js'];

const body = files.map((f) => {
  let src = readFileSync(join(root, 'src', f), 'utf8');
  src = src.replace(/^import[\s\S]*?from\s+'[^']+';\s*$/gm, '');   // bỏ import
  src = src.replace(/^export\s*\{[^}]*\};?\s*$/gm, '');             // bỏ export { ... }
  src = src.replace(/^export\s+(const|let|function|class)\s/gm, '$1 '); // export const -> const
  return `/* ---- ${f} ---- */\n${src.trim()}\n`;
}).join('\n');

const out = `/* tuvi.bundle.js – sinh tự động bởi tuvi/build-browser.js, KHÔNG sửa tay */
(function (global) {
'use strict';
${body}
global.TuVi = {
  lapLaSo, formatLaSo, cungMenh, cungThan, tinhCuc, viTriTuVi, anChinhTinh, anPhuTinh, anTuHoa, tinhDaiHan,
  CAN, CHI, DIA_BAN_ORDER, CUNG_CHUC_NANG, TU_HOA_TEN, SAO_INFO, VONG_TRANG_SINH, Y_NGHIA_SAO, Y_NGHIA_CUNG, giaiThichDoSang
};
})(typeof window !== 'undefined' ? window : globalThis);
`;
const dest = join(root, '..', 'js', 'tuvi.bundle.js');
writeFileSync(dest, out);
console.log('Đã tạo', dest, `(${(out.length / 1024).toFixed(1)} KB)`);
