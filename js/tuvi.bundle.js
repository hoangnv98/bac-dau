/* tuvi.bundle.js – sinh tự động bởi tuvi/build-browser.js, KHÔNG sửa tay */
(function (global) {
'use strict';
/* ---- constants.js ---- */
/* Hằng số Tử Vi Đẩu Số */

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

/** Thứ tự 12 cung trên địa bàn, bắt đầu từ Dần (chi index 2) */
const DIA_BAN_ORDER = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];

/** Ngũ hành nạp âm – 30 cặp của Lục thập hoa giáp, index = floor(idx60 / 2) */
const NAP_AM = [
  'Hải Trung Kim', 'Lư Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim',
  'Sơn Đầu Hỏa', 'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc',
  'Tuyền Trung Thủy', 'Ốc Thượng Thổ', 'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy',
  'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc', 'Bích Thượng Thổ', 'Kim Bạch Kim',
  'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Trạch Thổ', 'Thoa Xuyến Kim', 'Tang Đố Mộc',
  'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy'
];

/** Ngũ hành cục */
const CUC = {
  'Thủy': { so: 2, ten: 'Thủy Nhị Cục' },
  'Mộc': { so: 3, ten: 'Mộc Tam Cục' },
  'Kim': { so: 4, ten: 'Kim Tứ Cục' },
  'Thổ': { so: 5, ten: 'Thổ Ngũ Cục' },
  'Hỏa': { so: 6, ten: 'Hỏa Lục Cục' }
};

/** 12 cung chức năng, tính thuận từ cung Mệnh */
const CUNG_CHUC_NANG = [
  'Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc',
  'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'
];

/** 14 chính tinh: ngũ hành & âm dương */
const CHINH_TINH = {
  'Tử Vi': { hanh: 'Thổ', amDuong: 'Âm' },
  'Thiên Cơ': { hanh: 'Mộc', amDuong: 'Âm' },
  'Thái Dương': { hanh: 'Hỏa', amDuong: 'Dương' },
  'Vũ Khúc': { hanh: 'Kim', amDuong: 'Âm' },
  'Thiên Đồng': { hanh: 'Thủy', amDuong: 'Dương' },
  'Liêm Trinh': { hanh: 'Hỏa', amDuong: 'Âm' },
  'Thiên Phủ': { hanh: 'Thổ', amDuong: 'Dương' },
  'Thái Âm': { hanh: 'Thủy', amDuong: 'Âm' },
  'Tham Lang': { hanh: 'Thủy', amDuong: 'Âm' },
  'Cự Môn': { hanh: 'Thủy', amDuong: 'Âm' },
  'Thiên Tướng': { hanh: 'Thủy', amDuong: 'Dương' },
  'Thiên Lương': { hanh: 'Mộc', amDuong: 'Dương' },
  'Thất Sát': { hanh: 'Kim', amDuong: 'Dương' },
  'Phá Quân': { hanh: 'Thủy', amDuong: 'Âm' }
};

/** Phụ tinh cơ bản: ngũ hành */
const PHU_TINH = {
  'Tả Phù': { hanh: 'Thổ' },
  'Hữu Bật': { hanh: 'Thổ' },
  'Văn Xương': { hanh: 'Kim' },
  'Văn Khúc': { hanh: 'Thủy' },
  'Lộc Tồn': { hanh: 'Thổ' },
  'Kình Dương': { hanh: 'Kim' },
  'Đà La': { hanh: 'Kim' },
  'Địa Không': { hanh: 'Hỏa' },
  'Địa Kiếp': { hanh: 'Hỏa' },
  'Hỏa Tinh': { hanh: 'Hỏa' },
  'Linh Tinh': { hanh: 'Hỏa' }
};

/** Vị trí Lộc Tồn theo Can năm (index = can) */
const LOC_TON_THEO_CAN = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];

/**
 * Cung khởi Hỏa Tinh / Linh Tinh theo tam hợp Chi năm (index = chi năm)
 * Dần Ngọ Tuất: Hỏa khởi Sửu, Linh khởi Mão
 * Thân Tý Thìn: Hỏa khởi Dần, Linh khởi Tuất
 * Tỵ Dậu Sửu : Hỏa khởi Mão, Linh khởi Tuất
 * Hợi Mão Mùi: Hỏa khởi Dậu, Linh khởi Tuất
 */
const HOA_LINH_KHOI = [
  { hoa: 2, linh: 10 }, // Tý
  { hoa: 3, linh: 10 }, // Sửu
  { hoa: 1, linh: 3 },  // Dần
  { hoa: 9, linh: 10 }, // Mão
  { hoa: 2, linh: 10 }, // Thìn
  { hoa: 3, linh: 10 }, // Tỵ
  { hoa: 1, linh: 3 },  // Ngọ
  { hoa: 9, linh: 10 }, // Mùi
  { hoa: 2, linh: 10 }, // Thân
  { hoa: 3, linh: 10 }, // Dậu
  { hoa: 1, linh: 3 },  // Tuất
  { hoa: 9, linh: 10 }  // Hợi
];

/**
 * Tứ Hóa theo Can năm: [Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ]
 * Theo bảng phổ biến của trường phái Việt Nam (Thái Thứ Lang / Vân Đằng).
 * Lưu ý: năm Canh và Nhâm có dị bản giữa các trường phái – chỉnh ở đây nếu cần.
 */
const TU_HOA_THEO_CAN = [
  ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương'],   // Giáp
  ['Thiên Cơ', 'Thiên Lương', 'Tử Vi', 'Thái Âm'],       // Ất
  ['Thiên Đồng', 'Thiên Cơ', 'Văn Xương', 'Liêm Trinh'], // Bính
  ['Thái Âm', 'Thiên Đồng', 'Thiên Cơ', 'Cự Môn'],       // Đinh
  ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ'],       // Mậu
  ['Vũ Khúc', 'Tham Lang', 'Thiên Lương', 'Văn Khúc'],   // Kỷ
  ['Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Thái Âm'],    // Canh
  ['Cự Môn', 'Thái Dương', 'Văn Khúc', 'Văn Xương'],     // Tân
  ['Thiên Lương', 'Tử Vi', 'Tả Phù', 'Vũ Khúc'],         // Nhâm
  ['Phá Quân', 'Cự Môn', 'Thái Âm', 'Tham Lang']         // Quý
];

const TU_HOA_TEN = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'];

/* ---- canchi.js ---- */
/* Tiện ích Can Chi */

const mod = (n, m) => ((n % m) + m) % m;

const canName = (i) => CAN[mod(i, 10)];
const chiName = (i) => CHI[mod(i, 12)];
const canChiName = (can, chi) => `${canName(can)} ${chiName(chi)}`;

/** Chỉ số 0..59 trong Lục thập hoa giáp của cặp (can, chi); -1 nếu cặp không hợp lệ (lệch âm dương) */
function hoaGiapIndex(can, chi) {
  can = mod(can, 10);
  chi = mod(chi, 12);
  for (let i = 0; i < 60; i++) {
    if (i % 10 === can && i % 12 === chi) return i;
  }
  return -1;
}

/** Nạp âm của cặp can chi, ví dụ "Thiên Hà Thủy" */
function napAm(can, chi) {
  const idx = hoaGiapIndex(can, chi);
  if (idx < 0) throw new Error(`Cặp can chi không hợp lệ: ${canChiName(can, chi)}`);
  return NAP_AM[Math.floor(idx / 2)];
}

/** Ngũ hành của nạp âm (từ cuối tên): Kim / Mộc / Thủy / Hỏa / Thổ */
const hanhCuaNapAm = (ten) => ten.split(' ').pop();

/** Can Chi năm âm lịch */
const canChiNam = (year) => ({ can: mod(year + 6, 10), chi: mod(year + 8, 12) });

/** Can Chi tháng âm lịch (tháng 1 = Dần; Ngũ hổ độn theo can năm) */
const canChiThang = (yearCan, month) => ({ can: mod(yearCan * 2 + month + 1, 10), chi: mod(month + 1, 12) });

/** Can Chi ngày theo số ngày Julius */
const canChiNgay = (jd) => ({ can: mod(jd + 9, 10), chi: mod(jd + 1, 12) });

/** Chi của giờ (0-23h): 23h-1h Tý, 1-3 Sửu, ... */
const chiGio = (hour) => mod(Math.floor((hour + 1) / 2), 12);

/** Can Chi giờ (Ngũ thử độn theo can ngày) */
const canChiGio = (dayCan, hourChi) => ({ can: mod(dayCan * 2 + hourChi, 10), chi: hourChi });

/** Can của cung trên địa bàn trong năm có can yearCan (cung Dần theo Ngũ hổ độn) */
const canCung = (yearCan, cungChi) => mod((yearCan % 5) * 2 + 2 + mod(cungChi - 2, 12), 10);

/** Tìm chỉ số chi từ tên hoặc số */
function parseChi(v) {
  if (typeof v === 'number') return mod(v, 12);
  const i = CHI.findIndex((c) => c.toLowerCase() === String(v).trim().toLowerCase());
  if (i < 0) throw new Error(`Không nhận ra địa chi: ${v}`);
  return i;
}

/* ---- stars.js ---- */
/* An các phụ tinh mở rộng, vòng sao, Tuần Triệt, độ sáng, tiểu hạn / nguyệt hạn */

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
const VONG_TRANG_SINH = ['Tràng Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Suy', 'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'];
const VONG_THAI_TUE = ['Thái Tuế', 'Thiếu Dương', 'Tang Môn', 'Thiếu Âm', 'Quan Phù', 'Tử Phù', 'Tuế Phá', 'Long Đức', 'Bạch Hổ', 'Phúc Đức', 'Điếu Khách', 'Trực Phù'];
const VONG_LOC_TON = ['Bác Sĩ', 'Lực Sĩ', 'Thanh Long', 'Tiểu Hao', 'Tướng Quân', 'Tấu Thư', 'Phi Liêm', 'Hỷ Thần', 'Bệnh Phù', 'Đại Hao', 'Phục Binh', 'Quan Phủ'];

/* Mệnh chủ theo chi cung Mệnh, Thân chủ theo chi cung Thân */
const MENH_CHU = ['Tham Lang', 'Cự Môn', 'Lộc Tồn', 'Văn Khúc', 'Liêm Trinh', 'Vũ Khúc', 'Phá Quân', 'Vũ Khúc', 'Liêm Trinh', 'Văn Khúc', 'Lộc Tồn', 'Cự Môn'];
const THAN_CHU = ['Linh Tinh', 'Thiên Tướng', 'Thiên Lương', 'Thiên Đồng', 'Văn Xương', 'Thiên Cơ', 'Hỏa Tinh', 'Thiên Tướng', 'Thiên Lương', 'Thiên Đồng', 'Văn Xương', 'Thiên Cơ'];

/* ------------------------------------------------------------------ */
/* Thuộc tính sao: ngũ hành, cát (true) / hung (false)                 */
/* ------------------------------------------------------------------ */
const SAO_INFO = {
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
const DO_SANG = {
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
function doSang(ten, chi) {
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
function anSaoMoRong(ctx) {
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
function cungTieuHan(yearChi, isNam, chiNam) {
  const khoi = TIEU_HAN_KHOI[yearChi % 4];
  const k = mod(chiNam - yearChi, 12);
  return mod(khoi + (isNam ? k : -k), 12);
}

/** Map chi cung -> chi năm có tiểu hạn tại cung đó */
function bangTieuHan(yearChi, isNam) {
  const out = {};
  for (let k = 0; k < 12; k++) out[cungTieuHan(yearChi, isNam, mod(yearChi + k, 12))] = mod(yearChi + k, 12);
  return out;
}

/** Map chi cung -> tháng (1..12) nguyệt hạn của năm xem */
function bangNguyetHan(yearChi, isNam, chiNamXem, month, hourChi) {
  const th = cungTieuHan(yearChi, isNam, chiNamXem);
  const t1 = mod(th - (month - 1) + hourChi, 12);
  const out = {};
  for (let i = 0; i < 12; i++) out[mod(t1 + i, 12)] = i + 1;
  return out;
}

/** Quan hệ ngũ hành giữa Cục và Bản mệnh */
const SINH = { 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim', 'Kim': 'Thủy', 'Thủy': 'Mộc' };
const KHAC = { 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim', 'Kim': 'Mộc' };
function quanHeCucMenh(cucHanh, menhHanh) {
  if (cucHanh === menhHanh) return 'Cục hòa Bản Mệnh';
  if (SINH[cucHanh] === menhHanh) return 'Cục sinh Bản Mệnh';
  if (SINH[menhHanh] === cucHanh) return 'Bản Mệnh sinh Cục';
  if (KHAC[cucHanh] === menhHanh) return 'Cục khắc Bản Mệnh';
  return 'Bản Mệnh khắc Cục';
}

/* ---- meanings.js ---- */
/* Ý nghĩa tóm tắt của 12 cung và các sao (thư viện tra cứu, không phải luận giải cá nhân) */

const Y_NGHIA_CUNG = {
  'Mệnh': 'Cung gốc của lá số: tính cách, tư chất, phúc họa cả đời, cách nhìn và cách ứng xử với cuộc sống.',
  'Phụ Mẫu': 'Quan hệ với cha mẹ, bề trên; nền tảng gia đình, sự che chở và di sản tinh thần nhận được.',
  'Phúc Đức': 'Phúc phần tổ tiên, đời sống tinh thần, hưởng thụ và sự an nhàn về già.',
  'Điền Trạch': 'Nhà cửa, đất đai, tài sản cố định và môi trường sinh sống.',
  'Quan Lộc': 'Sự nghiệp, công danh, địa vị xã hội, cách làm việc và con đường thăng tiến.',
  'Nô Bộc': 'Bạn bè, đồng nghiệp, cấp dưới, người giúp việc; sự trợ lực hay phiền lụy từ người ngoài.',
  'Thiên Di': 'Di chuyển, xuất ngoại, giao tiếp xã hội và vận may khi ra ngoài.',
  'Tật Ách': 'Sức khỏe, bệnh tật, tai ách và điểm yếu cơ thể.',
  'Tài Bạch': 'Tiền bạc, cách kiếm tiền, giữ tiền và quan niệm về của cải.',
  'Tử Tức': 'Con cái, học trò, sản phẩm tinh thần; duyên với con và quan hệ cha mẹ – con.',
  'Phu Thê': 'Hôn nhân, người bạn đời, chuyện tình cảm và đời sống vợ chồng.',
  'Huynh Đệ': 'Anh chị em, bạn thân, đối tác gần gũi; sự tương trợ trong gia đình.'
};

const Y_NGHIA_SAO = {
  // ---- 14 chính tinh ----
  'Tử Vi': 'Đế tinh, chủ quyền quý, lãnh đạo, tôn nghiêm; miếu vượng thì cao sang, có người phò tá, hãm thì cô độc, hay tự ái.',
  'Thiên Cơ': 'Sao trí tuệ, mưu lược, linh hoạt, khéo tính toán; thích hợp nghề tham mưu, kỹ thuật, tư vấn.',
  'Thái Dương': 'Mặt trời, chủ quang minh, danh tiếng, phụ thân và nam nhân; sáng thì rực rỡ, hãm thì lao lực, bất đắc chí.',
  'Vũ Khúc': 'Tài tinh, cương quyết, giỏi tiền bạc và kinh doanh; cô khắc, nữ mệnh dễ vất vả tình duyên.',
  'Thiên Đồng': 'Phúc tinh, ôn hòa, hưởng thụ, biết dung hòa; hãm thì lười nhác, thiếu quyết đoán.',
  'Liêm Trinh': 'Sao tù tinh kiêm đào hoa, cương trực nhưng dễ cực đoan; miếu thì công danh, hãm thì tai tiếng, kiện tụng.',
  'Thiên Phủ': 'Kho tài lộc, chủ ổn định, bao dung, giỏi quản lý tiền bạc và sản nghiệp.',
  'Thái Âm': 'Mặt trăng, chủ điền trạch, mẫu thân và nữ nhân; sáng thì giàu sang, dịu dàng, hãm thì buồn phiền, hao tài.',
  'Tham Lang': 'Sao dục vọng, đa tài đa nghệ, giao thiệp rộng; hay đào hoa, ham vui, cần tiết chế.',
  'Cự Môn': 'Ám tinh, chủ khẩu thiệt, thị phi; sáng thì ăn nói có uy, nghề luật sư, giảng dạy, hãm thì cãi cọ, cô đơn.',
  'Thiên Tướng': 'Ấn tinh, trung hậu, công chính, thích giúp người; chủ chức vụ, ấn tín.',
  'Thiên Lương': 'Ấm tinh, nhân hậu, che chở, hóa giải tai nạn; nghề y, giáo dục, công tác xã hội.',
  'Thất Sát': 'Tướng tinh, cương dũng, quyết liệt, thích mạo hiểm; sáng thì uy quyền, hãm thì bôn ba, hình thương.',
  'Phá Quân': 'Hao tinh, phá cũ lập mới, mạnh mẽ, bất chấp; đời nhiều biến động, hợp nghề khai phá.',
  // ---- Lục cát, lục sát, Tứ Hóa ----
  'Tả Phù': 'Trợ tinh, có quý nhân, bạn bè giúp đỡ; tăng sức mạnh cho chính tinh.',
  'Hữu Bật': 'Trợ tinh, được nâng đỡ, nhiều người phò tá; giỏi phối hợp.',
  'Văn Xương': 'Văn tinh, học hành thi cử, văn chương, chữ nghĩa; thông minh, nho nhã.',
  'Văn Khúc': 'Văn tinh, tài ăn nói, nghệ thuật, khéo léo; đắc thì khoa bảng.',
  'Thiên Khôi': 'Quý nhân ban ngày, thi cử đỗ đạt, được người trên nâng đỡ.',
  'Thiên Việt': 'Quý nhân ban đêm, gặp may mắn nhờ người khác, âm thầm trợ giúp.',
  'Lộc Tồn': 'Lộc tinh, chủ tài lộc bền vững, tiết kiệm, có của để dành; sợ gặp Không Kiếp.',
  'Kình Dương': 'Hình tinh, cương mãnh, tranh đấu; đắc thì quyết đoán thành công, hãm thì hình thương, tai nạn.',
  'Đà La': 'Ám tinh, trì trệ, dây dưa, thị phi ngầm; đắc địa thì kiên trì.',
  'Hỏa Tinh': 'Sát tinh nóng nảy, bất ngờ; đắc địa thì phát nhanh, hãm thì tai họa bất chợt.',
  'Linh Tinh': 'Sát tinh âm thầm, nóng tính nhưng giấu kín; hãm thì bệnh tật, hao tán.',
  'Địa Không': 'Không tinh, phá tán, hư ảo, dễ mất mát; hợp người tu hành, nghiên cứu.',
  'Địa Kiếp': 'Kiếp tinh, hao tài, trắc trở, biến cố; cần đề phòng tiểu nhân, đầu tư mạo hiểm.',
  'Hóa Lộc': 'Tài lộc, may mắn, thuận lợi; sao đi cùng thêm phần hanh thông.',
  'Hóa Quyền': 'Quyền uy, thăng tiến, được giao trọng trách; tính khí cứng cỏi.',
  'Hóa Khoa': 'Danh tiếng, học vấn, thi cử, được tiếng tốt; hóa giải hung tinh.',
  'Hóa Kỵ': 'Trắc trở, thị phi, ghen ghét, hao tổn; cần cẩn trọng lời nói và giấy tờ.',
  // ---- Theo năm ----
  'Thiên Mã': 'Dịch mã, di chuyển, xuất ngoại, năng động; gặp Lộc Tồn thành Lộc Mã giao trì rất tốt về tài.',
  'Hoa Cái': 'Nghệ thuật, tôn giáo, cô cao, thích tĩnh lặng; có tài hoa.',
  'Kiếp Sát': 'Tiểu sát tinh, hao tán, bị cướp đoạt, gặp tiểu nhân.',
  'Đào Hoa': 'Duyên dáng, được yêu mến, hợp giao tế; quá vượng thì phong lưu.',
  'Phá Toái': 'Hao tán nhỏ, bất mãn, làm việc dễ dở dang.',
  'Thiên Không': 'Hư không, ảo tưởng, phá hoại ngầm; hợp tu đạo, triết lý.',
  'Thiên Khốc': 'Buồn phiền, than khóc, lo nghĩ; đắc địa thì có tiếng tăm nhờ gian nan.',
  'Thiên Hư': 'Hư hao, trống rỗng, hay lo âu; đắc địa thì khéo giao thiệp.',
  'Long Trì': 'Quý tinh, vinh hiển, thi cử đỗ đạt; đi với Phượng Các thành cặp Long Phượng tốt đẹp.',
  'Phượng Các': 'Quý tinh, nhan sắc, danh dự, hôn nhân tốt.',
  'Hồng Loan': 'Hỷ tinh, hôn nhân, tình duyên, vui mừng; dễ sớm lập gia đình.',
  'Thiên Hỷ': 'Hỷ sự, sinh nở, vui vẻ, lạc quan.',
  'Cô Thần': 'Cô độc, ít duyên với người thân, nam mệnh cô quả.',
  'Quả Tú': 'Cô quả, lẻ loi, nữ mệnh dễ muộn duyên.',
  'Thiên Đức': 'Phúc đức, nhân từ, hóa giải tai ương.',
  'Nguyệt Đức': 'Đức tinh, hiền hòa, giải trừ hung họa.',
  'Thiên Tài': 'Tài năng, khéo léo nhưng hay thay đổi; giảm bớt uy lực hung tinh.',
  'Thiên Thọ': 'Trường thọ, hiền lành, nhẫn nại.',
  'Giải Thần': 'Giải tai ách, hóa giải điều xấu.',
  'Thiên Quan': 'Quý nhân, được che chở, ít gặp họa.',
  'Thiên Phúc': 'Phúc lộc, may mắn, được hưởng ấm.',
  'Lưu Hà': 'Tai nạn sông nước, đi lại; nữ mệnh phòng sản nạn.',
  'Thiên Trù': 'Lộc ăn uống, no đủ, hưởng thụ.',
  'Văn Tinh': 'Học vấn, văn chương, lưu niên văn tinh trợ thi cử.',
  'Quốc Ấn': 'Ấn tín, chức quyền, uy tín trong công việc.',
  'Đường Phù': 'Quý hiển, được tiếng tốt, gặp may trong công danh.',
  'Đẩu Quân': 'Nguyệt tướng, cứng cỏi, hay bận rộn, chủ tháng Giêng của lưu nguyệt.',
  'Thiên La': 'Lưới trời (cung Thìn), ràng buộc, khó bứt phá.',
  'Địa Võng': 'Lưới đất (cung Tuất), vướng mắc, chậm trễ.',
  'Thiên Thương': 'Hao tổn, tang thương, mất mát (tại Nô Bộc).',
  'Thiên Sứ': 'Tai ách, bệnh tật, tai nạn (tại Tật Ách).',
  // ---- Theo tháng ----
  'Thiên Hình': 'Hình pháp, kỷ luật, cứng rắn; đắc địa thì hợp quân đội, pháp luật, y khoa; hãm thì kiện tụng, mổ xẻ.',
  'Thiên Riêu': 'Dâm tinh, đa tình, mơ mộng; đắc địa thì tài hoa, nghệ thuật.',
  'Thiên Y': 'Sao y dược, sức khỏe, hợp nghề y; giảm bệnh tật.',
  'Thiên Giải': 'Giải trừ tai họa từ trời.',
  'Địa Giải': 'Giải trừ tai họa dưới đất, hóa hung thành cát.',
  // ---- Theo giờ / ngày ----
  'Thai Phụ': 'Quý tinh về văn chương, ấn tín, được giúp đỡ trong thi cử.',
  'Phong Cáo': 'Sắc phong, khen thưởng, danh dự.',
  'Ân Quang': 'Ân huệ, được thưởng, quý nhân giúp đỡ.',
  'Thiên Quý': 'Quý hiển, được trọng vọng.',
  'Tam Thai': 'Địa vị, quyền chức, tôn quý; đi cặp với Bát Tọa.',
  'Bát Tọa': 'Ngôi vị, thăng tiến, hậu thuẫn.',
  // ---- Vòng Thái Tuế ----
  'Thái Tuế': 'Thị phi, cãi cọ, kiện tụng; bù lại có khí phách, ăn nói sắc bén.',
  'Thiếu Dương': 'Vui vẻ, may mắn nhỏ, nhanh nhẹn.',
  'Tang Môn': 'Tang chế, buồn rầu, mất mát; đắc địa thì nghề liên quan tang lễ, y tế.',
  'Thiếu Âm': 'Ôn hòa, kín đáo, được quý nhân nữ giúp.',
  'Quan Phù': 'Quan sự, giấy tờ, kiện tụng nhỏ.',
  'Tử Phù': 'Lo buồn, bệnh tật nhỏ, trì trệ.',
  'Tuế Phá': 'Phá hoại, hao tán, bất hòa.',
  'Long Đức': 'Phúc đức, nhân từ, hóa giải điều xấu.',
  'Bạch Hổ': 'Tai nạn, máu huyết, tang tóc; đắc địa thì uy dũng, hợp võ nghiệp.',
  'Phúc Đức': 'Phúc thọ, an lành, hưởng phúc.',
  'Điếu Khách': 'Tang khó, tin buồn, thị phi.',
  'Trực Phù': 'Quan sự, hình phạt, ràng buộc.',
  // ---- Vòng Lộc Tồn ----
  'Bác Sĩ': 'Thông minh, học rộng, được tín nhiệm.',
  'Lực Sĩ': 'Sức mạnh, uy quyền, hành động.',
  'Thanh Long': 'Hỷ tinh, vui mừng, hanh thông, tài lộc.',
  'Tiểu Hao': 'Hao tốn nhỏ, chi tiêu, thất thoát.',
  'Tướng Quân': 'Uy dũng, quả cảm, nhưng dễ cứng nhắc, tranh đấu.',
  'Tấu Thư': 'Văn thư, biểu tấu, giấy tờ, lời nói có trọng lượng.',
  'Phi Liêm': 'Thay đổi, bôn ba, dễ bị đàm tiếu.',
  'Hỷ Thần': 'Vui mừng, hỷ sự, hòa khí.',
  'Bệnh Phù': 'Bệnh tật, ốm yếu, uể oải.',
  'Đại Hao': 'Hao tài lớn, phá tán, chi tiêu quá độ.',
  'Phục Binh': 'Tiểu nhân ám hại, phục kích, mưu mô ngầm.',
  'Quan Phủ': 'Quan sự, thị phi, kiện cáo.',
  // ---- Vòng Tràng Sinh ----
  'Tràng Sinh': 'Khởi đầu, sinh sôi, phát triển; chủ sức sống và sự tăng trưởng.',
  'Mộc Dục': 'Tắm gội, đào hoa, bất ổn; dễ thay đổi, thích làm đẹp.',
  'Quan Đới': 'Trưởng thành, đội mũ, bắt đầu công danh.',
  'Lâm Quan': 'Đắc chí, thành đạt, có địa vị.',
  'Đế Vượng': 'Cực thịnh, mạnh mẽ, đỉnh cao.',
  'Suy': 'Suy yếu, giảm sút, thụ động.',
  'Bệnh': 'Ốm đau, trì trệ, thiếu sinh lực.',
  'Tử': 'Tĩnh lặng, chấm dứt, bế tắc; hợp suy ngẫm.',
  'Mộ': 'Chôn cất, tích trữ, kín đáo; chủ kho tàng, tiết kiệm.',
  'Tuyệt': 'Đoạn tuyệt, cô lập, biến đổi lớn.',
  'Thai': 'Thai nghén, manh nha, chuẩn bị.',
  'Dưỡng': 'Nuôi dưỡng, phục hồi, được chăm sóc.'
};

const DO_SANG_GIAI_THICH = { 'M': 'Miếu địa – sao sáng nhất, phát huy trọn vẹn mặt tốt', 'V': 'Vượng địa – sao mạnh, thuận lợi', 'Đ': 'Đắc địa – sao tốt vừa phải', 'B': 'Bình hòa – trung tính', 'H': 'Hãm địa – sao yếu, dễ lộ mặt xấu' };
function giaiThichDoSang(ky) { return DO_SANG_GIAI_THICH[ky] || ''; }

/* ---- lunar.js ---- */
/* Bản ES Module – sinh tự động từ ../../js/lunar.js (Hồ Ngọc Đức) */
/*
 * Thuật toán Âm lịch Việt Nam – Hồ Ngọc Đức (2004)
 * Nguồn: https://www.informatik.uni-leipzig.de/~duc/amlich/
 * Múi giờ Việt Nam: UTC+7
 */

var PI = Math.PI;
var TIMEZONE = 7.0;

function INT(d) { return Math.floor(d); }

/** Số ngày Julius (JDN) của ngày dd/mm/yyyy (lịch Gregory, tự chuyển Julius trước 1582) */
function jdFromDate(dd, mm, yy) {
  var a = INT((14 - mm) / 12);
  var y = yy + 4800 - a;
  var m = mm + 12 * a - 3;
  var jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  }
  return jd;
}

/** JDN -> [dd, mm, yyyy] */
function jdToDate(jd) {
  var a, b, c, d, e, m, day, month, year;
  if (jd > 2299160) {
    a = jd + 32044;
    b = INT((4 * a + 3) / 146097);
    c = a - INT((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  d = INT((4 * c + 3) / 1461);
  e = c - INT((1461 * d) / 4);
  m = INT((5 * e + 2) / 153);
  day = e - INT((153 * m + 2) / 5) + 1;
  month = m + 3 - 12 * INT(m / 10);
  year = b * 100 + d - 4800 + INT(m / 10);
  return [day, month, year];
}

/** Ngày Sóc thứ k kể từ 1/1/1900 (theo múi giờ) */
function getNewMoonDay(k, timeZone) {
  var T, T2, T3, dr, Jd1, M, Mpr, F, C1, deltat, JdNew;
  T = k / 1236.85;
  T2 = T * T;
  T3 = T2 * T;
  dr = PI / 180;
  Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  JdNew = Jd1 + C1 - deltat;
  return INT(JdNew + 0.5 + timeZone / 24);
}

/** Kinh độ Mặt Trời (radian, 0..2π) lúc 0h địa phương của ngày jdn */
function sunLongitudeRad(jdn, timeZone) {
  var T, T2, dr, M, L0, DL, L;
  T = (jdn - 2451545.5 - timeZone / 24) / 36525;
  T2 = T * T;
  dr = PI / 180;
  M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
  L = L0 + DL;
  L = L * dr;
  L = L - PI * 2 * INT(L / (PI * 2));
  return L;
}

/** Kinh độ Mặt Trời chia 12 cung (0..11) – dùng để xác định tháng nhuận */
function getSunLongitude(jdn, timeZone) {
  return INT(sunLongitudeRad(jdn, timeZone) / PI * 6);
}

/** Kinh độ Mặt Trời chia 24 tiết khí (0 = Xuân phân) */
function getSunLongitude24(jdn, timeZone) {
  return INT(sunLongitudeRad(jdn, timeZone) / PI * 12);
}

/** Ngày bắt đầu tháng 11 âm lịch của năm yy */
function getLunarMonth11(yy, timeZone) {
  var k, off, nm, sunLong;
  off = jdFromDate(31, 12, yy) - 2415021;
  k = INT(off / 29.530588853);
  nm = getNewMoonDay(k, timeZone);
  sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

/** Vị trí tháng nhuận (offset so với tháng 11 năm trước) */
function getLeapMonthOffset(a11, timeZone) {
  var k, last, arc, i;
  k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  last = 0;
  i = 1;
  arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

/**
 * Dương lịch -> Âm lịch
 * @returns {{day, month, year, leap, jd, monthStart, monthLength}}
 */
function solar2Lunar(dd, mm, yy, timeZone) {
  if (timeZone === undefined) timeZone = TIMEZONE;
  var k, dayNumber, monthStart, nextMonthStart, a11, b11, lunarDay, lunarMonth, lunarYear, lunarLeap, diff, leapMonthDiff;
  dayNumber = jdFromDate(dd, mm, yy);
  k = INT((dayNumber - 2415021.076998695) / 29.530588853);
  monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    nextMonthStart = monthStart;
    monthStart = getNewMoonDay(k, timeZone);
  } else {
    nextMonthStart = getNewMoonDay(k + 2, timeZone);
  }
  a11 = getLunarMonth11(yy, timeZone);
  b11 = a11;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }
  lunarDay = dayNumber - monthStart + 1;
  diff = INT((monthStart - a11) / 29);
  lunarLeap = 0;
  lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = 1;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }
  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    leap: lunarLeap === 1,
    jd: dayNumber,
    monthStart: monthStart,
    monthLength: nextMonthStart - monthStart   // 29 (thiếu) hoặc 30 (đủ)
  };
}

/** Âm lịch -> Dương lịch: [dd, mm, yyyy] ([0,0,0] nếu ngày không tồn tại) */
function lunar2Solar(lunarDay, lunarMonth, lunarYear, lunarLeap, timeZone) {
  if (timeZone === undefined) timeZone = TIMEZONE;
  var k, a11, b11, off, leapOff, leapMonth, monthStart;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }
  k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  off = lunarMonth - 11;
  if (off < 0) {
    off += 12;
  }
  if (b11 - a11 > 365) {
    leapOff = getLeapMonthOffset(a11, timeZone);
    leapMonth = leapOff - 2;
    if (leapMonth < 0) {
      leapMonth += 12;
    }
    if (lunarLeap && lunarMonth !== leapMonth) {
      return [0, 0, 0];
    } else if (lunarLeap || off >= leapOff) {
      off += 1;
    }
  }
  monthStart = getNewMoonDay(k + off, timeZone);
  return jdToDate(monthStart + lunarDay - 1);
}

/* ---- chart.js ---- */
/* Lập Lá số Tử Vi */




/* ------------------------------------------------------------------ */
/* 1. Chuẩn hoá input                                                  */
/* ------------------------------------------------------------------ */

/**
 * @typedef {Object} TuViInput
 * @property {number} day
 * @property {number} month
 * @property {number} year
 * @property {'solar'|'lunar'} [calendar='solar']  Loại lịch của ngày sinh
 * @property {boolean} [leap=false]                Tháng nhuận (chỉ dùng khi calendar='lunar')
 * @property {number} [hour]                       Giờ sinh 0-23
 * @property {string|number} [hourChi]             Hoặc chi của giờ: 'Tý' | 0..11
 * @property {'nam'|'nữ'|'male'|'female'} gender
 * @property {'half'|'same'} [leapMonthRule='half'] Cách xử lý tháng nhuận: 'half' = nửa đầu tính tháng đó,
 *                                                  nửa sau tính tháng kế; 'same' = tính như tháng chính
 * @property {'vn'|'cn'} [hoaLinhRule='vn']        'vn': chiều an Hỏa/Linh theo Âm Dương Nam Nữ; 'cn': cả hai đi thuận
 */

function normalizeInput(input) {
  if (!input || typeof input !== 'object') throw new TypeError('Thiếu thông tin đầu vào');
  const { day, month, year } = input;
  if (![day, month, year].every(Number.isInteger)) throw new TypeError('day/month/year phải là số nguyên');

  const calendar = input.calendar === 'lunar' ? 'lunar' : 'solar';

  let hourChi;
  if (input.hourChi !== undefined && input.hourChi !== null) hourChi = parseChi(input.hourChi);
  else if (Number.isInteger(input.hour) && input.hour >= 0 && input.hour <= 23) hourChi = chiGio(input.hour);
  else throw new TypeError('Cần hour (0-23) hoặc hourChi (Tý..Hợi)');

  const g = String(input.gender || '').trim().toLowerCase();
  let gender;
  if (['nam', 'male', 'm'].includes(g)) gender = 'Nam';
  else if (['nữ', 'nu', 'female', 'f'].includes(g)) gender = 'Nữ';
  else throw new TypeError('gender phải là "nam" hoặc "nữ"');

  const viewedYear = Number.isInteger(input.viewedYear) ? input.viewedYear : new Date().getFullYear();

  return {
    name: typeof input.name === 'string' ? input.name.trim() : '',
    viewedYear,
    day, month, year, calendar,
    leap: !!input.leap,
    hour: Number.isInteger(input.hour) ? input.hour : null,
    hourChi, gender,
    leapMonthRule: input.leapMonthRule === 'same' ? 'same' : 'half',
    hoaLinhRule: input.hoaLinhRule === 'cn' ? 'cn' : 'vn'
  };
}

/* ------------------------------------------------------------------ */
/* 2. Âm lịch & Can Chi                                                */
/* ------------------------------------------------------------------ */

function resolveLunar(inp) {
  let solar, lunar;
  if (inp.calendar === 'lunar') {
    const s = lunar2Solar(inp.day, inp.month, inp.year, inp.leap);
    if (s[0] === 0) throw new RangeError(`Ngày âm lịch không tồn tại: ${inp.day}/${inp.month}${inp.leap ? ' nhuận' : ''}/${inp.year}`);
    solar = { day: s[0], month: s[1], year: s[2] };
    lunar = solar2Lunar(s[0], s[1], s[2]);
    // Ngày 30 của tháng thiếu sẽ "tràn" sang tháng sau -> không hợp lệ
    if (lunar.day !== inp.day || lunar.month !== inp.month || lunar.leap !== inp.leap) {
      throw new RangeError(`Ngày âm lịch không tồn tại: ${inp.day}/${inp.month}${inp.leap ? ' nhuận' : ''}/${inp.year} (tháng chỉ có 29 ngày)`);
    }
  } else {
    solar = { day: inp.day, month: inp.month, year: inp.year };
    lunar = solar2Lunar(inp.day, inp.month, inp.year);
  }

  // Tháng dùng để an sao (xử lý tháng nhuận)
  let monthForChart = lunar.month;
  if (lunar.leap && inp.leapMonthRule === 'half' && lunar.day > 15) monthForChart = (lunar.month % 12) + 1;

  const nam = canChiNam(lunar.year);
  const thang = canChiThang(nam.can, lunar.month);
  const ngay = canChiNgay(jdFromDate(solar.day, solar.month, solar.year));
  const gio = canChiGio(ngay.can, inp.hourChi);

  return {
    solar,
    lunar: { day: lunar.day, month: lunar.month, year: lunar.year, leap: lunar.leap, monthLength: lunar.monthLength },
    monthForChart,
    canChi: { nam, thang, ngay, gio }
  };
}

/* ------------------------------------------------------------------ */
/* 3. Mệnh, Thân, Cục                                                  */
/* ------------------------------------------------------------------ */

/** Cung Mệnh: từ Dần đếm thuận đến tháng sinh, rồi đếm nghịch đến giờ sinh */
const cungMenh = (month, hourChi) => mod(2 + (month - 1) - hourChi, 12);

/** Cung Thân: từ Dần đếm thuận đến tháng sinh, rồi đếm thuận đến giờ sinh */
const cungThan = (month, hourChi) => mod(2 + (month - 1) + hourChi, 12);

/** Cục: nạp âm của can-chi cung Mệnh */
function tinhCuc(yearCan, menhChi) {
  const can = canCung(yearCan, menhChi);
  const na = napAm(can, menhChi);
  const hanh = hanhCuaNapAm(na);
  return { hanh, so: CUC[hanh].so, ten: CUC[hanh].ten, canChiCungMenh: canChiName(can, menhChi), napAm: na };
}

/* ------------------------------------------------------------------ */
/* 4. An sao                                                           */
/* ------------------------------------------------------------------ */

/** Vị trí Tử Vi theo Cục và ngày sinh âm lịch */
function viTriTuVi(cucSo, day) {
  const q = Math.ceil(day / cucSo);          // số cung đếm từ Dần
  const r = q * cucSo - day;                 // phần dư
  let pos = 2 + (q - 1);
  pos = r % 2 === 0 ? pos + r : pos - r;     // dư chẵn đếm thuận, dư lẻ đếm nghịch
  return mod(pos, 12);
}

/** 14 chính tinh -> { tênSao: chi } */
function anChinhTinh(tuVi) {
  const phu = mod(16 - tuVi, 12);            // Thiên Phủ đối xứng Tử Vi qua trục Dần–Thân
  return {
    'Tử Vi': tuVi,
    'Thiên Cơ': mod(tuVi - 1, 12),
    'Thái Dương': mod(tuVi - 3, 12),
    'Vũ Khúc': mod(tuVi - 4, 12),
    'Thiên Đồng': mod(tuVi - 5, 12),
    'Liêm Trinh': mod(tuVi - 8, 12),
    'Thiên Phủ': phu,
    'Thái Âm': mod(phu + 1, 12),
    'Tham Lang': mod(phu + 2, 12),
    'Cự Môn': mod(phu + 3, 12),
    'Thiên Tướng': mod(phu + 4, 12),
    'Thiên Lương': mod(phu + 5, 12),
    'Thất Sát': mod(phu + 6, 12),
    'Phá Quân': mod(phu + 10, 12)
  };
}

/** Phụ tinh cơ bản -> { tênSao: chi } */
function anPhuTinh({ month, hourChi, yearCan, yearChi, duongNamAmNu, hoaLinhRule }) {
  const locTon = LOC_TON_THEO_CAN[yearCan];
  const khoi = HOA_LINH_KHOI[yearChi];
  const hoaThuan = hoaLinhRule === 'cn' ? true : duongNamAmNu;
  return {
    'Tả Phù': mod(4 + (month - 1), 12),       // Thìn đếm thuận theo tháng
    'Hữu Bật': mod(10 - (month - 1), 12),     // Tuất đếm nghịch theo tháng
    'Văn Xương': mod(10 - hourChi, 12),       // Tuất đếm nghịch theo giờ
    'Văn Khúc': mod(4 + hourChi, 12),         // Thìn đếm thuận theo giờ
    'Lộc Tồn': locTon,
    'Kình Dương': mod(locTon + 1, 12),
    'Đà La': mod(locTon - 1, 12),
    'Địa Kiếp': mod(11 + hourChi, 12),        // Hợi đếm thuận theo giờ
    'Địa Không': mod(11 - hourChi, 12),       // Hợi đếm nghịch theo giờ
    'Hỏa Tinh': mod(khoi.hoa + (hoaThuan ? hourChi : -hourChi), 12),
    'Linh Tinh': mod(khoi.linh + (hoaThuan ? -hourChi : hourChi), 12)
  };
}

/** Tứ Hóa theo Can năm -> { tênSao: 'Hóa Lộc' | ... } và dạng tra cứu ngược */
function anTuHoa(yearCan) {
  const list = TU_HOA_THEO_CAN[yearCan];
  const byStar = {};
  const byHoa = {};
  list.forEach((star, i) => { byStar[star] = TU_HOA_TEN[i]; byHoa[TU_HOA_TEN[i]] = star; });
  return { byStar, byHoa };
}

/* ------------------------------------------------------------------ */
/* 5. Đại hạn                                                          */
/* ------------------------------------------------------------------ */

/** Tuổi khởi đại hạn từng cung -> Map chi -> { tuoiBatDau, tuoiKetThuc, thuTu } */
function tinhDaiHan(menhChi, cucSo, thuan) {
  const map = {};
  for (let i = 0; i < 12; i++) {
    const chi = mod(menhChi + (thuan ? i : -i), 12);
    map[chi] = { thuTu: i + 1, tuoiBatDau: cucSo + 10 * i, tuoiKetThuc: cucSo + 10 * i + 9 };
  }
  return map;
}

/* ------------------------------------------------------------------ */
/* 6. Lập lá số                                                        */
/* ------------------------------------------------------------------ */

/**
 * Lập lá số Tử Vi.
 * @param {TuViInput} input
 * @returns {object} Lá số dạng JSON
 */
function lapLaSo(input) {
  const inp = normalizeInput(input);
  const { solar, lunar, monthForChart, canChi } = resolveLunar(inp);
  const yearCan = canChi.nam.can;
  const yearChi = canChi.nam.chi;

  // Âm dương nam nữ
  const namDuong = yearCan % 2 === 0;
  const amDuong = `${namDuong ? 'Dương' : 'Âm'} ${inp.gender}`;
  const duongNamAmNu = (namDuong && inp.gender === 'Nam') || (!namDuong && inp.gender === 'Nữ');

  // Mệnh, Thân, Cục
  const menh = cungMenh(monthForChart, inp.hourChi);
  const than = cungThan(monthForChart, inp.hourChi);
  const cuc = tinhCuc(yearCan, menh);
  const banMenh = napAm(yearCan, yearChi);

  // An sao
  const tuVi = viTriTuVi(cuc.so, lunar.day);
  const chinhTinh = anChinhTinh(tuVi);
  const phuTinh = anPhuTinh({ month: monthForChart, hourChi: inp.hourChi, yearCan, yearChi, duongNamAmNu, hoaLinhRule: inp.hoaLinhRule });
  const tuHoa = anTuHoa(yearCan);

  // Đại hạn
  const daiHanThuan = duongNamAmNu;
  const daiHan = tinhDaiHan(menh, cuc.so, daiHanThuan);

  // Phụ tinh mở rộng, vòng Tràng Sinh, Tuần Triệt
  const moRong = anSaoMoRong({
    yearCan, yearChi, month: monthForChart, day: lunar.day, hourChi: inp.hourChi, menh, than,
    cucHanh: cuc.hanh, duongNamAmNu, isNam: inp.gender === 'Nam',
    locTon: phuTinh['Lộc Tồn'], vanXuong: phuTinh['Văn Xương'], vanKhuc: phuTinh['Văn Khúc'],
    taPhu: phuTinh['Tả Phù'], huuBat: phuTinh['Hữu Bật']
  });

  // Tiểu hạn, nguyệt hạn theo năm xem
  const namXemCan = mod(inp.viewedYear + 6, 10), namXemChi = mod(inp.viewedYear + 8, 12);
  const isNam = inp.gender === 'Nam';
  const tieuHan = bangTieuHan(yearChi, isNam);
  const nguyetHan = bangNguyetHan(yearChi, isNam, namXemChi, monthForChart, inp.hourChi);

  // Gom sao theo cung
  const saoTheoCung = Array.from({ length: 12 }, () => []);
  const pushSao = (ten, chi, loai) => {
    const info = SAO_INFO[ten] || { hanh: '', cat: true };
    const sao = { ten, loai, hanh: info.hanh, cat: info.cat };
    if (CHINH_TINH[ten]) sao.amDuong = CHINH_TINH[ten].amDuong;
    const ds = doSang(ten, chi);
    if (ds) sao.doSang = ds.ky;
    if (tuHoa.byStar[ten]) sao.hoa = tuHoa.byStar[ten];
    saoTheoCung[chi].push(sao);
  };
  Object.entries(chinhTinh).forEach(([ten, chi]) => pushSao(ten, chi, 'chính tinh'));
  Object.entries(phuTinh).forEach(([ten, chi]) => pushSao(ten, chi, 'phụ tinh'));
  Object.entries(tuHoa.byHoa).forEach(([hoa, star]) => {
    const chi = chinhTinh[star] !== undefined ? chinhTinh[star] : phuTinh[star];
    if (chi !== undefined) pushSao(hoa, chi, 'phụ tinh');
  });
  Object.entries(moRong.sao).forEach(([ten, chi]) => pushSao(ten, chi, 'phụ tinh'));
  Object.entries(moRong.trangSinh).forEach(([chi, ten]) => pushSao(ten, Number(chi), 'tràng sinh'));

  // 12 cung theo thứ tự địa bàn Dần -> Sửu
  const cung = DIA_BAN_ORDER.map((chi) => {
    const offset = mod(chi - menh, 12);
    const can = canCung(yearCan, chi);
    const dh = daiHan[chi];
    return {
      viTri: chi,
      chi: chiName(chi),
      canChi: canChiName(can, chi),
      ten: CUNG_CHUC_NANG[offset],
      laCungThan: chi === than,
      daiHan: { thuTu: dh.thuTu, tuoiBatDau: dh.tuoiBatDau, tuoiKetThuc: dh.tuoiKetThuc, nhan: `${dh.tuoiBatDau}–${dh.tuoiKetThuc}` },
      tieuHan: chiName(tieuHan[chi]),
      nguyetHan: nguyetHan[chi],
      trangSinh: moRong.trangSinh[chi],
      tuan: moRong.tuan.includes(chi),
      triet: moRong.triet.includes(chi),
      sao: saoTheoCung[chi]
    };
  });

  return {
    input: {
      name: inp.name, viewedYear: inp.viewedYear,
      calendar: inp.calendar, day: inp.day, month: inp.month, year: inp.year, leap: inp.leap,
      hour: inp.hour, hourChi: chiName(inp.hourChi), gender: inp.gender,
      leapMonthRule: inp.leapMonthRule, hoaLinhRule: inp.hoaLinhRule
    },
    duongLich: solar,
    amLich: Object.assign({}, lunar, {
      thangAnSao: monthForChart,
      canChi: {
        nam: canChiName(canChi.nam.can, canChi.nam.chi),
        thang: canChiName(canChi.thang.can, canChi.thang.chi),
        ngay: canChiName(canChi.ngay.can, canChi.ngay.chi),
        gio: canChiName(canChi.gio.can, canChi.gio.chi)
      }
    }),
    tongQuan: {
      hoTen: inp.name,
      gioiTinh: inp.gender,
      amDuong,
      amDuongThuanLy: duongNamAmNu ? 'Âm dương thuận lý' : 'Âm dương nghịch lý',
      banMenh,
      menhNguHanh: hanhCuaNapAm(banMenh),
      cuc: { ten: cuc.ten, hanh: cuc.hanh, so: cuc.so, canChiCungMenh: cuc.canChiCungMenh, napAm: cuc.napAm },
      cungMenh: chiName(menh),
      cungThan: chiName(than),
      thanCuCung: CUNG_CHUC_NANG[mod(than - menh, 12)],
      tuViTai: chiName(tuVi),
      thienPhuTai: chiName(chinhTinh['Thiên Phủ']),
      daiHan: { chieu: daiHanThuan ? 'thuận' : 'nghịch', khoiTuoi: cuc.so },
      cucMenh: quanHeCucMenh(cuc.hanh, hanhCuaNapAm(banMenh)),
      menhChu: MENH_CHU[menh],
      thanChu: THAN_CHU[than],
      namXem: { nam: inp.viewedYear, canChi: canChiName(namXemCan, namXemChi), tuoi: inp.viewedYear - lunar.year + 1 },
      tuan: moRong.tuan.map(chiName),
      triet: moRong.triet.map(chiName)
    },
    tuHoa: tuHoa.byHoa,
    cung
  };
}

/* ---- format.js ---- */
/* In lá số dạng bảng 4x4 ra console (tiện kiểm tra) */

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

function formatLaSo(laSo) {
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

global.TuVi = {
  lapLaSo, formatLaSo, cungMenh, cungThan, tinhCuc, viTriTuVi, anChinhTinh, anPhuTinh, anTuHoa, tinhDaiHan,
  CAN, CHI, DIA_BAN_ORDER, CUNG_CHUC_NANG, TU_HOA_TEN, SAO_INFO, VONG_TRANG_SINH, Y_NGHIA_SAO, Y_NGHIA_CUNG, giaiThichDoSang
};
})(typeof window !== 'undefined' ? window : globalThis);
