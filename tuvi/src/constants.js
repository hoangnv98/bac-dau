/* Hằng số Tử Vi Đẩu Số */

export const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
export const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

/** Thứ tự 12 cung trên địa bàn, bắt đầu từ Dần (chi index 2) */
export const DIA_BAN_ORDER = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];

/** Ngũ hành nạp âm – 30 cặp của Lục thập hoa giáp, index = floor(idx60 / 2) */
export const NAP_AM = [
  'Hải Trung Kim', 'Lư Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim',
  'Sơn Đầu Hỏa', 'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc',
  'Tuyền Trung Thủy', 'Ốc Thượng Thổ', 'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy',
  'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc', 'Bích Thượng Thổ', 'Kim Bạch Kim',
  'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Trạch Thổ', 'Thoa Xuyến Kim', 'Tang Đố Mộc',
  'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy'
];

/** Ngũ hành cục */
export const CUC = {
  'Thủy': { so: 2, ten: 'Thủy Nhị Cục' },
  'Mộc': { so: 3, ten: 'Mộc Tam Cục' },
  'Kim': { so: 4, ten: 'Kim Tứ Cục' },
  'Thổ': { so: 5, ten: 'Thổ Ngũ Cục' },
  'Hỏa': { so: 6, ten: 'Hỏa Lục Cục' }
};

/** 12 cung chức năng, tính thuận từ cung Mệnh */
export const CUNG_CHUC_NANG = [
  'Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc',
  'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'
];

/** 14 chính tinh: ngũ hành & âm dương */
export const CHINH_TINH = {
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
export const PHU_TINH = {
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
export const LOC_TON_THEO_CAN = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];

/**
 * Cung khởi Hỏa Tinh / Linh Tinh theo tam hợp Chi năm (index = chi năm)
 * Dần Ngọ Tuất: Hỏa khởi Sửu, Linh khởi Mão
 * Thân Tý Thìn: Hỏa khởi Dần, Linh khởi Tuất
 * Tỵ Dậu Sửu : Hỏa khởi Mão, Linh khởi Tuất
 * Hợi Mão Mùi: Hỏa khởi Dậu, Linh khởi Tuất
 */
export const HOA_LINH_KHOI = [
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
export const TU_HOA_THEO_CAN = [
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

export const TU_HOA_TEN = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'];
