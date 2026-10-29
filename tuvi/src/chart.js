/* Lập Lá số Tử Vi */
import { solar2Lunar, lunar2Solar, jdFromDate } from './lunar.js';
import {
  CHI, DIA_BAN_ORDER, CUC, CUNG_CHUC_NANG, CHINH_TINH, PHU_TINH,
  LOC_TON_THEO_CAN, HOA_LINH_KHOI, TU_HOA_THEO_CAN, TU_HOA_TEN
} from './constants.js';
import {
  mod, canName, chiName, canChiName, napAm, hanhCuaNapAm,
  canChiNam, canChiThang, canChiNgay, chiGio, canChiGio, canCung, parseChi
} from './canchi.js';
import {
  SAO_INFO, doSang, anSaoMoRong, bangTieuHan, bangNguyetHan, quanHeCucMenh, MENH_CHU, THAN_CHU
} from './stars.js';

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
export const cungMenh = (month, hourChi) => mod(2 + (month - 1) - hourChi, 12);

/** Cung Thân: từ Dần đếm thuận đến tháng sinh, rồi đếm thuận đến giờ sinh */
export const cungThan = (month, hourChi) => mod(2 + (month - 1) + hourChi, 12);

/** Cục: nạp âm của can-chi cung Mệnh */
export function tinhCuc(yearCan, menhChi) {
  const can = canCung(yearCan, menhChi);
  const na = napAm(can, menhChi);
  const hanh = hanhCuaNapAm(na);
  return { hanh, so: CUC[hanh].so, ten: CUC[hanh].ten, canChiCungMenh: canChiName(can, menhChi), napAm: na };
}

/* ------------------------------------------------------------------ */
/* 4. An sao                                                           */
/* ------------------------------------------------------------------ */

/** Vị trí Tử Vi theo Cục và ngày sinh âm lịch */
export function viTriTuVi(cucSo, day) {
  const q = Math.ceil(day / cucSo);          // số cung đếm từ Dần
  const r = q * cucSo - day;                 // phần dư
  let pos = 2 + (q - 1);
  pos = r % 2 === 0 ? pos + r : pos - r;     // dư chẵn đếm thuận, dư lẻ đếm nghịch
  return mod(pos, 12);
}

/** 14 chính tinh -> { tênSao: chi } */
export function anChinhTinh(tuVi) {
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
export function anPhuTinh({ month, hourChi, yearCan, yearChi, duongNamAmNu, hoaLinhRule }) {
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
export function anTuHoa(yearCan) {
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
export function tinhDaiHan(menhChi, cucSo, thuan) {
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
export function lapLaSo(input) {
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

export { CHI, canName, chiName };
