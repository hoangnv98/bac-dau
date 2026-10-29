/* Tiện ích Can Chi */
import { CAN, CHI, NAP_AM } from './constants.js';

export const mod = (n, m) => ((n % m) + m) % m;

export const canName = (i) => CAN[mod(i, 10)];
export const chiName = (i) => CHI[mod(i, 12)];
export const canChiName = (can, chi) => `${canName(can)} ${chiName(chi)}`;

/** Chỉ số 0..59 trong Lục thập hoa giáp của cặp (can, chi); -1 nếu cặp không hợp lệ (lệch âm dương) */
export function hoaGiapIndex(can, chi) {
  can = mod(can, 10);
  chi = mod(chi, 12);
  for (let i = 0; i < 60; i++) {
    if (i % 10 === can && i % 12 === chi) return i;
  }
  return -1;
}

/** Nạp âm của cặp can chi, ví dụ "Thiên Hà Thủy" */
export function napAm(can, chi) {
  const idx = hoaGiapIndex(can, chi);
  if (idx < 0) throw new Error(`Cặp can chi không hợp lệ: ${canChiName(can, chi)}`);
  return NAP_AM[Math.floor(idx / 2)];
}

/** Ngũ hành của nạp âm (từ cuối tên): Kim / Mộc / Thủy / Hỏa / Thổ */
export const hanhCuaNapAm = (ten) => ten.split(' ').pop();

/** Can Chi năm âm lịch */
export const canChiNam = (year) => ({ can: mod(year + 6, 10), chi: mod(year + 8, 12) });

/** Can Chi tháng âm lịch (tháng 1 = Dần; Ngũ hổ độn theo can năm) */
export const canChiThang = (yearCan, month) => ({ can: mod(yearCan * 2 + month + 1, 10), chi: mod(month + 1, 12) });

/** Can Chi ngày theo số ngày Julius */
export const canChiNgay = (jd) => ({ can: mod(jd + 9, 10), chi: mod(jd + 1, 12) });

/** Chi của giờ (0-23h): 23h-1h Tý, 1-3 Sửu, ... */
export const chiGio = (hour) => mod(Math.floor((hour + 1) / 2), 12);

/** Can Chi giờ (Ngũ thử độn theo can ngày) */
export const canChiGio = (dayCan, hourChi) => ({ can: mod(dayCan * 2 + hourChi, 10), chi: hourChi });

/** Can của cung trên địa bàn trong năm có can yearCan (cung Dần theo Ngũ hổ độn) */
export const canCung = (yearCan, cungChi) => mod((yearCan % 5) * 2 + 2 + mod(cungChi - 2, 12), 10);

/** Tìm chỉ số chi từ tên hoặc số */
export function parseChi(v) {
  if (typeof v === 'number') return mod(v, 12);
  const i = CHI.findIndex((c) => c.toLowerCase() === String(v).trim().toLowerCase());
  if (i < 0) throw new Error(`Không nhận ra địa chi: ${v}`);
  return i;
}
