/* In lá số dạng bảng 4x4 ra console (tiện kiểm tra) */
import { DIA_BAN_ORDER } from './constants.js';

/* Vị trí ô trên bảng 4x4 theo chi (hàng, cột) – bố cục lá số truyền thống */
const LAYOUT = {
  5: [0, 0], 6: [0, 1], 7: [0, 2], 8: [0, 3],   // Tỵ Ngọ Mùi Thân
  4: [1, 0], 9: [1, 3],                         // Thìn           Dậu
  3: [2, 0], 10: [2, 3],                        // Mão            Tuất
  2: [3, 0], 1: [3, 1], 0: [3, 2], 11: [3, 3]   // Dần Sửu Tý Hợi
};

const W = 24, H = 7;
const padLine = (s) => (s.length > W ? s.slice(0, W - 1) + '…' : s.padEnd(W));

function cellLines(c) {
  const lines = [];
  lines.push(`${c.ten.toUpperCase()}${c.laCungThan ? ' <Thân>' : ''} · ${c.canChi}`);
  lines.push(`Đại hạn ${c.daiHan.nhan}`);
  const chinh = c.sao.filter((s) => s.loai === 'chính tinh').map((s) => s.ten + (s.hoa ? `(${s.hoa.replace('Hóa ', '')})` : ''));
  const phu = c.sao.filter((s) => s.loai === 'phụ tinh').map((s) => s.ten + (s.hoa ? `(${s.hoa.replace('Hóa ', '')})` : ''));
  lines.push(chinh.join(', ') || '—');
  phu.forEach((p, i) => { if (i < 3) lines.push(p); });
  if (phu.length > 3) lines.push(`+${phu.length - 3} sao khác`);
  while (lines.length < H) lines.push('');
  return lines.slice(0, H).map(padLine);
}

export function formatLaSo(laSo) {
  const t = laSo.tongQuan;
  const grid = Array.from({ length: 4 }, () => Array(4).fill(null));
  laSo.cung.forEach((c) => { const [r, col] = LAYOUT[c.viTri]; grid[r][col] = cellLines(c); });

  const center = [
    `${t.amDuong} · ${laSo.amLich.canChi.nam}`,
    `Âm lịch ${laSo.amLich.day}/${laSo.amLich.month}${laSo.amLich.leap ? 'n' : ''}/${laSo.amLich.year} giờ ${laSo.amLich.canChi.gio}`,
    `Bản mệnh: ${t.banMenh}`,
    `Cục: ${t.cuc.ten}`,
    `Mệnh ${t.cungMenh} · Thân ${t.cungThan} (${t.thanCuCung})`,
    `Đại hạn ${t.daiHan.chieu}, khởi ${t.daiHan.khoiTuoi} tuổi`,
    `Tứ hóa: ${Object.entries(laSo.tuHoa).map(([k, v]) => `${k.replace('Hóa ', '')}:${v}`).join(' ')}`
  ].map(padLine);
  grid[1][1] = center; grid[1][2] = center.map(() => ''.padEnd(W));
  grid[2][1] = Array(H).fill(''.padEnd(W)); grid[2][2] = Array(H).fill(''.padEnd(W));

  const sep = '+' + Array(4).fill('-'.repeat(W + 2)).join('+') + '+';
  const out = [sep];
  grid.forEach((row) => {
    for (let l = 0; l < H; l++) out.push('| ' + row.map((cell) => cell[l]).join(' | ') + ' |');
    out.push(sep);
  });
  return out.join('\n');
}

export { DIA_BAN_ORDER };
