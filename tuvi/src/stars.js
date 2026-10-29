/* An các phụ tinh mở rộng, vòng sao, Tuần Triệt, độ sáng, tiểu hạn / nguyệt hạn */
import { hoaGiapIndex, mod } from './canchi.js';

/* ------------------------------------------------------------------ */
/* Bảng tra theo Can năm (index = can: Giáp..Quý)                       */
/* ------------------------------------------------------------------ */
const THIEN_KHOI = [1, 0, 11, 11, 1, 0, 6, 6, 3, 3];
const THIEN_VIET = [7, 8, 9, 9, 7, 8, 2, 2, 5, 5];
const THIEN_QUAN = [7, 4, 5, 2, 3, 9, 11, 9, 10, 6];
const THIEN_PHUC = [9, 8, 0, 11, 3, 2, 6, 5, 6, 5];
const LUU_HA = [9, 10, 7, 8, 5, 6, 4, 3, 11, 2];
const THIEN_TRU = [5, 6, 0, 5, 6, 8, 2, 6, 9, 10];
const VAN_TINH = [5, 6, 8, 9, 8, 9, 11, 0, 2, 3];
const TRIET = [[8, 9], [6, 7], [4, 5], [2, 3], [0, 1], [8, 9], [6, 7], [4, 5], [2, 3], [0, 1]];

/* Theo tam hợp Chi năm: key = chi % 4 (0: Thân Tý Thìn, 1: Tỵ Dậu Sửu, 2: Dần Ngọ Tuất, 3: Hợi Mão Mùi) */
const THIEN_MA = [2, 11, 8, 5];
const HOA_CAI = [4, 1, 10, 7];
const KIEP_SAT = [5, 2, 11, 8];
const DAO_HOA = [9, 6, 3, 0];
const TIEU_HAN_KHOI = [10, 7, 4, 1];
/* Phá Toái: Tý Ngọ Mão Dậu -> Tỵ; Dần Thân Tỵ Hợi -> Dậu; Thìn Tuất Sửu Mùi -> Sửu (key = chi % 3) */
const PHA_TOAI = [5, 1, 9];
/* Cô Thần / Quả Tú theo mùa: Hợi Tý Sửu, Dần Mão Thìn, Tỵ Ngọ Mùi, Thân Dậu Tuất */
const CO_THAN = [2, 5, 8, 11];
const QUA_TU = [10, 1, 4, 7];

/* Vòng Tràng Sinh: cung khởi theo hành Cục */
const TRANG_SINH_KHOI = { 'Thủy': 8, 'Thổ': 8, 'Mộc': 11, 'Kim': 5, 'Hỏa': 2 };
export const VONG_TRANG_SINH = ['Tràng Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Suy', 'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'];
export const VONG_THAI_TUE = ['Thái Tuế', 'Thiếu Dương', 'Tang Môn', 'Thiếu Âm', 'Quan Phù', 'Tử Phù', 'Tuế Phá', 'Long Đức', 'Bạch Hổ', 'Phúc Đức', 'Điếu Khách', 'Trực Phù'];
export const VONG_LOC_TON = ['Bác Sĩ', 'Lực Sĩ', 'Thanh Long', 'Tiểu Hao', 'Tướng Quân', 'Tấu Thư', 'Phi Liêm', 'Hỷ Thần', 'Bệnh Phù', 'Đại Hao', 'Phục Binh', 'Quan Phủ'];

/* Mệnh chủ theo chi cung Mệnh, Thân chủ theo chi cung Thân */
export const MENH_CHU = ['Tham Lang', 'Cự Môn', 'Lộc Tồn', 'Văn Khúc', 'Liêm Trinh', 'Vũ Khúc', 'Phá Quân', 'Vũ Khúc', 'Liêm Trinh', 'Văn Khúc', 'Lộc Tồn', 'Cự Môn'];
export const THAN_CHU = ['Linh Tinh', 'Thiên Tướng', 'Thiên Lương', 'Thiên Đồng', 'Văn Xương', 'Thiên Cơ', 'Hỏa Tinh', 'Thiên Tướng', 'Thiên Lương', 'Thiên Đồng', 'Văn Xương', 'Thiên Cơ'];

/* ------------------------------------------------------------------ */
/* Thuộc tính sao: ngũ hành, cát (true) / hung (false)                 */
/* ------------------------------------------------------------------ */
export const SAO_INFO = {
  // Chính tinh
  'Tử Vi': { hanh: 'Thổ', cat: true }, 'Thiên Cơ': { hanh: 'Mộc', cat: true }, 'Thái Dương': { hanh: 'Hỏa', cat: true },
  'Vũ Khúc': { hanh: 'Kim', cat: true }, 'Thiên Đồng': { hanh: 'Thủy', cat: true }, 'Liêm Trinh': { hanh: 'Hỏa', cat: true },
  'Thiên Phủ': { hanh: 'Thổ', cat: true }, 'Thái Âm': { hanh: 'Thủy', cat: true }, 'Tham Lang': { hanh: 'Mộc', cat: true },
  'Cự Môn': { hanh: 'Thủy', cat: true }, 'Thiên Tướng': { hanh: 'Thủy', cat: true }, 'Thiên Lương': { hanh: 'Mộc', cat: true },
  'Thất Sát': { hanh: 'Kim', cat: true }, 'Phá Quân': { hanh: 'Thủy', cat: true },
  // Lục cát, lục sát, Tứ Hóa
  'Tả Phù': { hanh: 'Thổ', cat: true }, 'Hữu Bật': { hanh: 'Thổ', cat: true }, 'Văn Xương': { hanh: 'Kim', cat: true }, 'Văn Khúc': { hanh: 'Thủy', cat: true },
  'Thiên Khôi': { hanh: 'Hỏa', cat: true }, 'Thiên Việt': { hanh: 'Hỏa', cat: true }, 'Lộc Tồn': { hanh: 'Thổ', cat: true },
  'Kình Dương': { hanh: 'Kim', cat: false }, 'Đà La': { hanh: 'Kim', cat: false }, 'Hỏa Tinh': { hanh: 'Hỏa', cat: false }, 'Linh Tinh': { hanh: 'Hỏa', cat: false },
  'Địa Không': { hanh: 'Hỏa', cat: false }, 'Địa Kiếp': { hanh: 'Hỏa', cat: false },
  'Hóa Lộc': { hanh: 'Mộc', cat: true }, 'Hóa Quyền': { hanh: 'Mộc', cat: true }, 'Hóa Khoa': { hanh: 'Mộc', cat: true }, 'Hóa Kỵ': { hanh: 'Thủy', cat: false },
  // Theo năm
  'Thiên Mã': { hanh: 'Hỏa', cat: true }, 'Hoa Cái': { hanh: 'Kim', cat: true }, 'Kiếp Sát': { hanh: 'Hỏa', cat: false }, 'Đào Hoa': { hanh: 'Mộc', cat: true },
  'Phá Toái': { hanh: 'Hỏa', cat: false }, 'Thiên Không': { hanh: 'Hỏa', cat: false }, 'Thiên Khốc': { hanh: 'Thủy', cat: false }, 'Thiên Hư': { hanh: 'Thủy', cat: false },
  'Long Trì': { hanh: 'Thủy', cat: true }, 'Phượng Các': { hanh: 'Thổ', cat: true }, 'Hồng Loan': { hanh: 'Thủy', cat: true }, 'Thiên Hỷ': { hanh: 'Thủy', cat: true },
  'Cô Thần': { hanh: 'Thổ', cat: false }, 'Quả Tú': { hanh: 'Thổ', cat: false }, 'Thiên Đức': { hanh: 'Hỏa', cat: true }, 'Nguyệt Đức': { hanh: 'Hỏa', cat: true },
  'Thiên Tài': { hanh: 'Mộc', cat: true }, 'Thiên Thọ': { hanh: 'Thổ', cat: true }, 'Giải Thần': { hanh: 'Mộc', cat: true },
  'Thiên Quan': { hanh: 'Hỏa', cat: true }, 'Thiên Phúc': { hanh: 'Thổ', cat: true }, 'Lưu Hà': { hanh: 'Thủy', cat: false }, 'Thiên Trù': { hanh: 'Thổ', cat: true },
  'Văn Tinh': { hanh: 'Hỏa', cat: true }, 'Quốc Ấn': { hanh: 'Thổ', cat: true }, 'Đường Phù': { hanh: 'Mộc', cat: true }, 'Đẩu Quân': { hanh: 'Hỏa', cat: false },
  'Thiên La': { hanh: 'Thổ', cat: false }, 'Địa Võng': { hanh: 'Thổ', cat: false }, 'Thiên Thương': { hanh: 'Thủy', cat: false }, 'Thiên Sứ': { hanh: 'Thủy', cat: false },
  // Theo tháng
  'Thiên Hình': { hanh: 'Hỏa', cat: false }, 'Thiên Riêu': { hanh: 'Thủy', cat: false }, 'Thiên Y': { hanh: 'Thủy', cat: true },
  'Thiên Giải': { hanh: 'Hỏa', cat: true }, 'Địa Giải': { hanh: 'Thổ', cat: true },
  // Theo giờ / ngày
  'Thai Phụ': { hanh: 'Kim', cat: true }, 'Phong Cáo': { hanh: 'Thổ', cat: true }, 'Ân Quang': { hanh: 'Mộc', cat: true }, 'Thiên Quý': { hanh: 'Thổ', cat: true },
  'Tam Thai': { hanh: 'Thổ', cat: true }, 'Bát Tọa': { hanh: 'Thổ', cat: true },
  // Vòng Thái Tuế
  'Thái Tuế': { hanh: 'Hỏa', cat: false }, 'Thiếu Dương': { hanh: 'Hỏa', cat: true }, 'Tang Môn': { hanh: 'Mộc', cat: false }, 'Thiếu Âm': { hanh: 'Thủy', cat: true },
  'Quan Phù': { hanh: 'Hỏa', cat: false }, 'Tử Phù': { hanh: 'Kim', cat: false }, 'Tuế Phá': { hanh: 'Hỏa', cat: false }, 'Long Đức': { hanh: 'Thủy', cat: true },
  'Bạch Hổ': { hanh: 'Kim', cat: false }, 'Phúc Đức': { hanh: 'Thổ', cat: true }, 'Điếu Khách': { hanh: 'Hỏa', cat: false }, 'Trực Phù': { hanh: 'Kim', cat: false },
  // Vòng Lộc Tồn
  'Bác Sĩ': { hanh: 'Thủy', cat: true }, 'Lực Sĩ': { hanh: 'Hỏa', cat: true }, 'Thanh Long': { hanh: 'Thủy', cat: true }, 'Tiểu Hao': { hanh: 'Hỏa', cat: false },
  'Tướng Quân': { hanh: 'Mộc', cat: false }, 'Tấu Thư': { hanh: 'Kim', cat: true }, 'Phi Liêm': { hanh: 'Hỏa', cat: false }, 'Hỷ Thần': { hanh: 'Hỏa', cat: true },
  'Bệnh Phù': { hanh: 'Thổ', cat: false }, 'Đại Hao': { hanh: 'Hỏa', cat: false }, 'Phục Binh': { hanh: 'Hỏa', cat: false }, 'Quan Phủ': { hanh: 'Hỏa', cat: false },
  // Vòng Tràng Sinh
  'Tràng Sinh': { hanh: 'Thủy', cat: true }, 'Mộc Dục': { hanh: 'Thủy', cat: false }, 'Quan Đới': { hanh: 'Kim', cat: true }, 'Lâm Quan': { hanh: 'Kim', cat: true },
  'Đế Vượng': { hanh: 'Kim', cat: true }, 'Suy': { hanh: 'Thủy', cat: false }, 'Bệnh': { hanh: 'Hỏa', cat: false }, 'Tử': { hanh: 'Hỏa', cat: false },
  'Mộ': { hanh: 'Thổ', cat: false }, 'Tuyệt': { hanh: 'Thổ', cat: false }, 'Thai': { hanh: 'Thổ', cat: true }, 'Dưỡng': { hanh: 'Mộc', cat: true }
};

/* ------------------------------------------------------------------ */
/* Độ sáng: 12 ký tự ứng với Tý..Hợi (M Miếu, V Vượng, D Đắc, B Bình, H Hãm, - không xét) */
/* ------------------------------------------------------------------ */
export const DO_SANG = {
  'Tử Vi': 'VDMBVVMDMBVD', 'Thiên Cơ': 'MHVMMDMHVDMD', 'Thái Dương': 'HDVMVMMDBHHH', 'Vũ Khúc': 'DMDHMHDMDHMH',
  'Thiên Đồng': 'MHVDHDHHVBHM', 'Liêm Trinh': 'BDMHVHBDMHVH', 'Thiên Phủ': 'MMMDMDMDDDMD', 'Thái Âm': 'MDHHHHHDMMMM',
  'Tham Lang': 'VMBHMHVMBHMH', 'Cự Môn': 'MHDMHDVHDMHV', 'Thiên Tướng': 'MMMHVDMMMHVD', 'Thiên Lương': 'VMVMMHMDHHMH',
  'Thất Sát': 'MDMHHDMDMHHD', 'Phá Quân': 'MVHHDHMVHHDH',
  'Kình Dương': 'HDHHDHHDHHDH', 'Đà La': 'HDHHDHHDHHDH', 'Hỏa Tinh': 'HHDDDDDHHHHH', 'Linh Tinh': 'HHDDDDDHHHHH',
  'Địa Không': 'HHDHHDHHDHHD', 'Địa Kiếp': 'HHDHHDHHDHHD', 'Văn Xương': 'DDHDDDHDDDHD', 'Văn Khúc': 'DDHDDDHDDDHD',
  'Hóa Kỵ': 'HMDHMDHMDHMD', 'Thiên Khốc': 'DHHDDHDHHDDH', 'Thiên Hư': 'DHHDHHDHHDHH', 'Tang Môn': 'HHDDDHHHDDDH',
  'Bạch Hổ': 'HHDDHHHHDDHH', 'Thiên Hình': 'HHDDHHHHDDDH', 'Thiên Riêu': 'HHDDHHHHDDHH', 'Thiên Mã': '--D--D--H--D',
  'Đại Hao': 'HHDDHHHHDDHH', 'Tiểu Hao': 'HHDDHHHHDDHH'
};
const DO_SANG_TEN = { M: 'Miếu', V: 'Vượng', D: 'Đắc', B: 'Bình hòa', H: 'Hãm' };

/** Độ sáng của sao tại cung -> { ky: 'M'|'V'|'Đ'|'B'|'H', ten } hoặc null */
export function doSang(ten, chi) {
  const s = DO_SANG[ten];
  if (!s) return null;
  const c = s.charAt(mod(chi, 12));
  if (c === '-' || !DO_SANG_TEN[c]) return null;
  return { ky: c === 'D' ? 'Đ' : c, ten: DO_SANG_TEN[c] };
}

/* ------------------------------------------------------------------ */
/* An sao                                                              */
/* ------------------------------------------------------------------ */

/**
 * An toàn bộ phụ tinh mở rộng.
 * @param ctx { yearCan, yearChi, month, day, hourChi, menh, than, cucHanh, duongNamAmNu, isNam, locTon, vanXuong, vanKhuc, taPhu, huuBat }
 * @returns { sao: {ten: chi}, trangSinh: {chi: ten}, tuan: [chi, chi], triet: [chi, chi] }
 */
export function anSaoMoRong(ctx) {
  const { yearCan, yearChi, month, day, hourChi, menh, than, cucHanh, duongNamAmNu, locTon, vanXuong, vanKhuc, taPhu, huuBat } = ctx;
  const g4 = yearChi % 4;
  const g3 = yearChi % 3;
  const mua = Math.floor(mod(yearChi + 1, 12) / 3);
  const sao = {};

  // Theo Can năm
  sao['Thiên Khôi'] = THIEN_KHOI[yearCan];
  sao['Thiên Việt'] = THIEN_VIET[yearCan];
  sao['Thiên Quan'] = THIEN_QUAN[yearCan];
  sao['Thiên Phúc'] = THIEN_PHUC[yearCan];
  sao['Lưu Hà'] = LUU_HA[yearCan];
  sao['Thiên Trù'] = THIEN_TRU[yearCan];
  sao['Văn Tinh'] = VAN_TINH[yearCan];
  sao['Quốc Ấn'] = mod(locTon + 8, 12);
  sao['Đường Phù'] = mod(locTon - 7, 12);

  // Theo Chi năm
  sao['Thiên Mã'] = THIEN_MA[g4];
  sao['Hoa Cái'] = HOA_CAI[g4];
  sao['Kiếp Sát'] = KIEP_SAT[g4];
  sao['Đào Hoa'] = DAO_HOA[g4];
  sao['Phá Toái'] = PHA_TOAI[g3];
  sao['Cô Thần'] = CO_THAN[mua];
  sao['Quả Tú'] = QUA_TU[mua];
  sao['Thiên Không'] = mod(yearChi + 1, 12);
  sao['Thiên Khốc'] = mod(6 - yearChi, 12);
  sao['Thiên Hư'] = mod(6 + yearChi, 12);
  sao['Long Trì'] = mod(4 + yearChi, 12);
  sao['Phượng Các'] = mod(10 - yearChi, 12);
  sao['Giải Thần'] = mod(10 - yearChi, 12);
  sao['Hồng Loan'] = mod(3 - yearChi, 12);
  sao['Thiên Hỷ'] = mod(9 - yearChi, 12);
  sao['Thiên Đức'] = mod(9 + yearChi, 12);
  sao['Nguyệt Đức'] = mod(5 + yearChi, 12);
  sao['Thiên Tài'] = mod(menh + yearChi, 12);
  sao['Thiên Thọ'] = mod(than + yearChi, 12);
  sao['Đẩu Quân'] = mod(yearChi - (month - 1) + hourChi, 12);
  VONG_THAI_TUE.forEach((ten, i) => { sao[ten] = mod(yearChi + i, 12); });

  // Theo tháng
  sao['Thiên Hình'] = mod(9 + month - 1, 12);
  sao['Thiên Riêu'] = mod(1 + month - 1, 12);
  sao['Thiên Y'] = mod(1 + month - 1, 12);
  sao['Thiên Giải'] = mod(8 + month - 1, 12);
  sao['Địa Giải'] = mod(7 + month - 1, 12);

  // Theo giờ & ngày
  sao['Thai Phụ'] = mod(vanKhuc + 2, 12);
  sao['Phong Cáo'] = mod(vanKhuc - 2, 12);
  sao['Ân Quang'] = mod(vanXuong + day - 2, 12);
  sao['Thiên Quý'] = mod(vanKhuc - day + 2, 12);
  sao['Tam Thai'] = mod(taPhu + day - 1, 12);
  sao['Bát Tọa'] = mod(huuBat - day + 1, 12);

  // Cố định theo cung
  sao['Thiên La'] = 4;
  sao['Địa Võng'] = 10;
  sao['Thiên Thương'] = mod(menh + 5, 12);   // cung Nô Bộc
  sao['Thiên Sứ'] = mod(menh + 7, 12);       // cung Tật Ách

  // Vòng Lộc Tồn (Dương Nam Âm Nữ thuận)
  const dir = duongNamAmNu ? 1 : -1;
  VONG_LOC_TON.forEach((ten, i) => { sao[ten] = mod(locTon + dir * i, 12); });

  // Vòng Tràng Sinh
  const tsKhoi = TRANG_SINH_KHOI[cucHanh];
  const trangSinh = {};
  VONG_TRANG_SINH.forEach((ten, i) => { trangSinh[mod(tsKhoi + dir * i, 12)] = ten; });

  // Tuần, Triệt
  const idx = hoaGiapIndex(yearCan, yearChi);
  const startChi = mod(idx - (idx % 10), 12);
  const tuan = [mod(startChi + 10, 12), mod(startChi + 11, 12)];
  const triet = TRIET[yearCan];

  return { sao, trangSinh, tuan, triet };
}

/** Cung tiểu hạn của năm có chi `chiNam` */
export function cungTieuHan(yearChi, isNam, chiNam) {
  const khoi = TIEU_HAN_KHOI[yearChi % 4];
  const k = mod(chiNam - yearChi, 12);
  return mod(khoi + (isNam ? k : -k), 12);
}

/** Map chi cung -> chi năm có tiểu hạn tại cung đó */
export function bangTieuHan(yearChi, isNam) {
  const out = {};
  for (let k = 0; k < 12; k++) out[cungTieuHan(yearChi, isNam, mod(yearChi + k, 12))] = mod(yearChi + k, 12);
  return out;
}

/** Map chi cung -> tháng (1..12) nguyệt hạn của năm xem */
export function bangNguyetHan(yearChi, isNam, chiNamXem, month, hourChi) {
  const th = cungTieuHan(yearChi, isNam, chiNamXem);
  const t1 = mod(th - (month - 1) + hourChi, 12);
  const out = {};
  for (let i = 0; i < 12; i++) out[mod(t1 + i, 12)] = i + 1;
  return out;
}

/** Quan hệ ngũ hành giữa Cục và Bản mệnh */
const SINH = { 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim', 'Kim': 'Thủy', 'Thủy': 'Mộc' };
const KHAC = { 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim', 'Kim': 'Mộc' };
export function quanHeCucMenh(cucHanh, menhHanh) {
  if (cucHanh === menhHanh) return 'Cục hòa Bản Mệnh';
  if (SINH[cucHanh] === menhHanh) return 'Cục sinh Bản Mệnh';
  if (SINH[menhHanh] === cucHanh) return 'Bản Mệnh sinh Cục';
  if (KHAC[cucHanh] === menhHanh) return 'Cục khắc Bản Mệnh';
  return 'Bản Mệnh khắc Cục';
}
