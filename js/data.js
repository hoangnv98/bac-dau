/* Dữ liệu tra cứu: Can Chi, Tiết khí, Hoàng/Hắc đạo, Trực, Nhị thập bát tú, Nạp âm, Ngày lễ */
(function (global) {
  'use strict';

  var CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  var CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

  /* Khung giờ theo 12 chi */
  var HOUR_RANGE = ['23-1', '1-3', '3-5', '5-7', '7-9', '9-11', '11-13', '13-15', '15-17', '17-19', '19-21', '21-23'];

  /* Giờ hoàng đạo theo chi của ngày (index = chiNgày % 6), mỗi ký tự ứng với giờ Tý..Hợi, '1' = hoàng đạo */
  var GIO_HOANG_DAO = [
    '110100101100', // Tý, Ngọ
    '001101001011', // Sửu, Mùi
    '110011010010', // Dần, Thân
    '101100110100', // Mão, Dậu
    '001011001101', // Thìn, Tuất
    '010010110011'  // Tỵ, Hợi
  ];

  /* 24 tiết khí, bắt đầu từ Xuân phân (kinh độ Mặt Trời 0°) */
  var TIET_KHI = [
    'Xuân phân', 'Thanh minh', 'Cốc vũ', 'Lập hạ', 'Tiểu mãn', 'Mang chủng',
    'Hạ chí', 'Tiểu thử', 'Đại thử', 'Lập thu', 'Xử thử', 'Bạch lộ',
    'Thu phân', 'Hàn lộ', 'Sương giáng', 'Lập đông', 'Tiểu tuyết', 'Đại tuyết',
    'Đông chí', 'Tiểu hàn', 'Đại hàn', 'Lập xuân', 'Vũ thủy', 'Kinh trập'
  ];

  /* 12 thần Hoàng đạo / Hắc đạo (chu kỳ bắt đầu từ Thanh Long) */
  var THAN = [
    { name: 'Thanh Long', good: true },
    { name: 'Minh Đường', good: true },
    { name: 'Thiên Hình', good: false },
    { name: 'Chu Tước', good: false },
    { name: 'Kim Quỹ', good: true },
    { name: 'Kim Đường', good: true },
    { name: 'Bạch Hổ', good: false },
    { name: 'Ngọc Đường', good: true },
    { name: 'Thiên Lao', good: false },
    { name: 'Nguyên Vũ', good: false },
    { name: 'Tư Mệnh', good: true },
    { name: 'Câu Trận', good: false }
  ];

  /* 12 Trực (Thập nhị kiến trừ) */
  var TRUC = ['Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp', 'Phá', 'Nguy', 'Thành', 'Thu', 'Khai', 'Bế'];

  /* Nhị thập bát tú */
  var SAO = [
    'Giác', 'Cang', 'Đê', 'Phòng', 'Tâm', 'Vĩ', 'Cơ',
    'Đẩu', 'Ngưu', 'Nữ', 'Hư', 'Nguy', 'Thất', 'Bích',
    'Khuê', 'Lâu', 'Vị', 'Mão', 'Tất', 'Chủy', 'Sâm',
    'Tỉnh', 'Quỷ', 'Liễu', 'Tinh', 'Trương', 'Dực', 'Chẩn'
  ];

  /* Ngũ hành nạp âm – 30 cặp của Lục thập hoa giáp (Giáp Tý/Ất Sửu -> Nhâm Tuất/Quý Hợi) */
  var NAP_AM = [
    'Hải Trung Kim', 'Lư Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim',
    'Sơn Đầu Hỏa', 'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc',
    'Tuyền Trung Thủy', 'Ốc Thượng Thổ', 'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy',
    'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc', 'Bích Thượng Thổ', 'Kim Bạch Kim',
    'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Trạch Thổ', 'Thoa Xuyến Kim', 'Tang Đố Mộc',
    'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy'
  ];

  var LUNAR_MONTH_NAMES = ['Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười Một', 'Chạp'];

  var WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  var WEEKDAYS_SHORT = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  /* Ngày lễ dương lịch. major = ngày lễ lớn / nghỉ (tô đỏ trên lịch) */
  var SOLAR_HOLIDAYS = [
    { d: 1, m: 1, name: 'Tết Dương lịch', major: true },
    { d: 14, m: 2, name: 'Lễ Tình nhân' },
    { d: 27, m: 2, name: 'Thầy thuốc Việt Nam' },
    { d: 8, m: 3, name: 'Quốc tế Phụ nữ' },
    { d: 26, m: 3, name: 'Thành lập Đoàn TNCS HCM' },
    { d: 30, m: 4, name: 'Giải phóng miền Nam', major: true },
    { d: 1, m: 5, name: 'Quốc tế Lao động', major: true },
    { d: 7, m: 5, name: 'Chiến thắng Điện Biên Phủ' },
    { d: 19, m: 5, name: 'Sinh nhật Chủ tịch Hồ Chí Minh' },
    { d: 1, m: 6, name: 'Quốc tế Thiếu nhi' },
    { d: 21, m: 6, name: 'Báo chí Cách mạng Việt Nam' },
    { d: 28, m: 6, name: 'Gia đình Việt Nam' },
    { d: 27, m: 7, name: 'Thương binh Liệt sĩ' },
    { d: 19, m: 8, name: 'Cách mạng tháng Tám' },
    { d: 2, m: 9, name: 'Quốc khánh', major: true },
    { d: 10, m: 10, name: 'Giải phóng Thủ đô' },
    { d: 13, m: 10, name: 'Doanh nhân Việt Nam' },
    { d: 20, m: 10, name: 'Phụ nữ Việt Nam' },
    { d: 31, m: 10, name: 'Halloween' },
    { d: 9, m: 11, name: 'Pháp luật Việt Nam' },
    { d: 20, m: 11, name: 'Nhà giáo Việt Nam' },
    { d: 22, m: 12, name: 'Quân đội Nhân dân Việt Nam' },
    { d: 24, m: 12, name: 'Đêm Giáng sinh' },
    { d: 25, m: 12, name: 'Lễ Giáng sinh' }
  ];

  /* Ngày lễ âm lịch (không tính tháng nhuận) */
  var LUNAR_HOLIDAYS = [
    { d: 1, m: 1, name: 'Tết Nguyên Đán', major: true },
    { d: 2, m: 1, name: 'Mùng 2 Tết', major: true },
    { d: 3, m: 1, name: 'Mùng 3 Tết', major: true },
    { d: 15, m: 1, name: 'Rằm tháng Giêng (Nguyên Tiêu)' },
    { d: 3, m: 3, name: 'Tết Hàn thực' },
    { d: 10, m: 3, name: 'Giỗ Tổ Hùng Vương', major: true },
    { d: 15, m: 4, name: 'Lễ Phật Đản' },
    { d: 5, m: 5, name: 'Tết Đoan Ngọ' },
    { d: 15, m: 7, name: 'Lễ Vu Lan' },
    { d: 15, m: 8, name: 'Tết Trung Thu' },
    { d: 9, m: 9, name: 'Tết Trùng Cửu' },
    { d: 10, m: 10, name: 'Tết Thường Tân' },
    { d: 23, m: 12, name: 'Ông Công Ông Táo' }
  ];

  global.CalData = {
    CAN: CAN,
    CHI: CHI,
    HOUR_RANGE: HOUR_RANGE,
    GIO_HOANG_DAO: GIO_HOANG_DAO,
    TIET_KHI: TIET_KHI,
    THAN: THAN,
    TRUC: TRUC,
    SAO: SAO,
    NAP_AM: NAP_AM,
    LUNAR_MONTH_NAMES: LUNAR_MONTH_NAMES,
    WEEKDAYS: WEEKDAYS,
    WEEKDAYS_SHORT: WEEKDAYS_SHORT,
    SOLAR_HOLIDAYS: SOLAR_HOLIDAYS,
    LUNAR_HOLIDAYS: LUNAR_HOLIDAYS
  };
})(typeof window !== 'undefined' ? window : globalThis);
