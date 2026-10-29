import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lapLaSo, viTriTuVi, cungMenh, cungThan, tinhCuc } from '../index.js';

const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const idx = (name) => CHI.indexOf(name);
const cungCo = (laSo, tenSao) => laSo.cung.find((c) => c.sao.some((s) => s.ten === tenSao)).chi;

test('Vị trí Tử Vi theo bảng chuẩn (ngày 1 của mỗi cục)', () => {
  assert.equal(viTriTuVi(2, 1), idx('Sửu'));
  assert.equal(viTriTuVi(3, 1), idx('Thìn'));
  assert.equal(viTriTuVi(4, 1), idx('Hợi'));
  assert.equal(viTriTuVi(5, 1), idx('Ngọ'));
  assert.equal(viTriTuVi(6, 1), idx('Dậu'));
});

test('Vị trí Tử Vi – Mộc Tam Cục ngày 1..15', () => {
  const expect = ['Thìn', 'Sửu', 'Dần', 'Tỵ', 'Dần', 'Mão', 'Ngọ', 'Mão', 'Thìn', 'Mùi', 'Thìn', 'Tỵ', 'Thân', 'Tỵ', 'Ngọ'];
  expect.forEach((chi, i) => assert.equal(CHI[viTriTuVi(3, i + 1)], chi, `ngày ${i + 1}`));
});

test('Cung Mệnh / Thân', () => {
  assert.equal(cungMenh(1, 0), idx('Dần'));   // tháng Giêng giờ Tý
  assert.equal(cungThan(1, 0), idx('Dần'));
  assert.equal(cungMenh(9, 4), idx('Ngọ'));   // tháng 9 giờ Thìn
  assert.equal(cungThan(9, 4), idx('Dần'));
});

test('Cục theo nạp âm cung Mệnh (năm Giáp)', () => {
  assert.equal(tinhCuc(0, idx('Tý')).ten, 'Thủy Nhị Cục');
  assert.equal(tinhCuc(0, idx('Dần')).ten, 'Hỏa Lục Cục');
  assert.equal(tinhCuc(0, idx('Thìn')).ten, 'Mộc Tam Cục');
  assert.equal(tinhCuc(0, idx('Ngọ')).ten, 'Thổ Ngũ Cục');
  assert.equal(tinhCuc(0, idx('Thân')).ten, 'Kim Tứ Cục');
});

test('Lá số 24/10/2026 giờ Thìn, Nam', () => {
  const ls = lapLaSo({ day: 24, month: 10, year: 2026, hour: 7, gender: 'nam' });
  assert.deepEqual([ls.amLich.day, ls.amLich.month, ls.amLich.year], [15, 9, 2026]);
  assert.equal(ls.amLich.canChi.nam, 'Bính Ngọ');
  assert.equal(ls.amLich.canChi.thang, 'Mậu Tuất');
  assert.equal(ls.amLich.canChi.ngay, 'Tân Mùi');
  assert.equal(ls.amLich.canChi.gio, 'Nhâm Thìn');
  assert.equal(ls.tongQuan.amDuong, 'Dương Nam');
  assert.equal(ls.tongQuan.banMenh, 'Thiên Hà Thủy');
  assert.equal(ls.tongQuan.cuc.ten, 'Kim Tứ Cục');
  assert.equal(ls.tongQuan.cungMenh, 'Ngọ');
  assert.equal(ls.tongQuan.cungThan, 'Dần');
  assert.equal(ls.tongQuan.thanCuCung, 'Tài Bạch');
  assert.equal(ls.tongQuan.tuViTai, 'Thìn');
  assert.equal(ls.tongQuan.daiHan.chieu, 'thuận');

  // Các cách cục kinh điển
  assert.equal(cungCo(ls, 'Thiên Tướng'), 'Thìn');  // Tử Tướng đồng cung
  assert.equal(cungCo(ls, 'Thiên Phủ'), 'Tý');
  assert.equal(cungCo(ls, 'Vũ Khúc'), 'Tý');        // Vũ Phủ đồng cung
  assert.equal(cungCo(ls, 'Thái Dương'), 'Sửu');
  assert.equal(cungCo(ls, 'Thái Âm'), 'Sửu');       // Nhật Nguyệt đồng cung
  assert.equal(cungCo(ls, 'Thiên Cơ'), 'Mão');
  assert.equal(cungCo(ls, 'Cự Môn'), 'Mão');        // Cơ Cự đồng cung
  assert.equal(cungCo(ls, 'Lộc Tồn'), 'Tỵ');
  assert.equal(cungCo(ls, 'Kình Dương'), 'Ngọ');
  assert.equal(cungCo(ls, 'Đà La'), 'Thìn');
  assert.equal(cungCo(ls, 'Tả Phù'), 'Tý');
  assert.equal(cungCo(ls, 'Hữu Bật'), 'Dần');
  assert.equal(cungCo(ls, 'Văn Xương'), 'Ngọ');
  assert.equal(cungCo(ls, 'Văn Khúc'), 'Thân');
  assert.equal(cungCo(ls, 'Địa Kiếp'), 'Mão');
  assert.equal(cungCo(ls, 'Địa Không'), 'Mùi');
  assert.equal(cungCo(ls, 'Hỏa Tinh'), 'Tỵ');
  assert.equal(cungCo(ls, 'Linh Tinh'), 'Hợi');

  // Tứ hóa năm Bính
  assert.deepEqual(ls.tuHoa, { 'Hóa Lộc': 'Thiên Đồng', 'Hóa Quyền': 'Thiên Cơ', 'Hóa Khoa': 'Văn Xương', 'Hóa Kỵ': 'Liêm Trinh' });

  // Đại hạn thuận từ Mệnh (Ngọ), khởi 4 tuổi
  const menh = ls.cung.find((c) => c.ten === 'Mệnh');
  assert.equal(menh.daiHan.nhan, '4–13');
  assert.equal(ls.cung.find((c) => c.ten === 'Phụ Mẫu').daiHan.nhan, '14–23');
  assert.equal(ls.cung.find((c) => c.ten === 'Huynh Đệ').daiHan.nhan, '114–123');

  // Cấu trúc output
  assert.equal(ls.cung.length, 12);
  assert.equal(ls.cung[0].chi, 'Dần');
  assert.equal(ls.cung[11].chi, 'Sửu');
  const tongSao = ls.cung.reduce((n, c) => n + c.sao.length, 0);
  assert.ok(tongSao >= 25, 'có đủ 14 chính tinh + phụ tinh'); // 14 chính tinh + 11 phụ tinh cơ bản + mở rộng
});

test('Âm Nữ -> đại hạn thuận; Dương Nữ -> nghịch', () => {
  const amNu = lapLaSo({ day: 10, month: 3, year: 2025, hour: 12, gender: 'nữ' });  // Ất Tỵ
  assert.equal(amNu.tongQuan.amDuong, 'Âm Nữ');
  assert.equal(amNu.tongQuan.daiHan.chieu, 'thuận');
  const duongNu = lapLaSo({ day: 10, month: 3, year: 2024, hour: 12, gender: 'female' }); // Giáp Thìn
  assert.equal(duongNu.tongQuan.amDuong, 'Dương Nữ');
  assert.equal(duongNu.tongQuan.daiHan.chieu, 'nghịch');
});

test('Nhập ngày âm lịch cho kết quả giống nhập dương lịch tương ứng', () => {
  const a = lapLaSo({ calendar: 'lunar', day: 15, month: 9, year: 2026, hourChi: 'Thìn', gender: 'nam' });
  const b = lapLaSo({ day: 24, month: 10, year: 2026, hour: 8, gender: 'nam' });
  assert.deepEqual(a.cung, b.cung);
  assert.deepEqual(a.duongLich, { day: 24, month: 10, year: 2026 });
});

test('Tháng nhuận: quy tắc half/same', () => {
  // 20/6 nhuận Ất Tỵ 2025 -> nửa sau: an sao theo tháng 7
  const half = lapLaSo({ calendar: 'lunar', day: 20, month: 6, year: 2025, leap: true, hour: 0, gender: 'nam' });
  assert.equal(half.amLich.leap, true);
  assert.equal(half.amLich.thangAnSao, 7);
  const same = lapLaSo({ calendar: 'lunar', day: 20, month: 6, year: 2025, leap: true, hour: 0, gender: 'nam', leapMonthRule: 'same' });
  assert.equal(same.amLich.thangAnSao, 6);
});

test('Giờ 23h thuộc giờ Tý', () => {
  const ls = lapLaSo({ day: 1, month: 1, year: 2000, hour: 23, gender: 'nam' });
  assert.equal(ls.input.hourChi, 'Tý');
});

test('Input không hợp lệ ném lỗi', () => {
  assert.throws(() => lapLaSo({ day: 1, month: 1, year: 2000, gender: 'nam' }), /hour/);
  assert.throws(() => lapLaSo({ day: 1, month: 1, year: 2000, hour: 1 }), /gender/);
  assert.throws(() => lapLaSo({ calendar: 'lunar', day: 30, month: 6, year: 2025, leap: true, hour: 1, gender: 'nam' }), /không tồn tại/);
});

test('Đối chiếu với lá số tham chiếu aituvi.com: ÂM LỊCH 28/12/1998 giờ Dậu, Nam', () => {
  const ls = lapLaSo({ calendar: 'lunar', day: 28, month: 12, year: 1998, hour: 17, gender: 'nam' });
  assert.deepEqual(ls.duongLich, { day: 13, month: 2, year: 1999 });
  assert.deepEqual(ls.amLich.canChi, { nam: 'Mậu Dần', thang: 'Ất Sửu', ngay: 'Bính Thân', gio: 'Đinh Dậu' });
  assert.equal(ls.tongQuan.amDuong, 'Dương Nam');
  assert.equal(ls.tongQuan.cuc.ten, 'Thổ Ngũ Cục');
  assert.equal(ls.tongQuan.cungMenh, 'Thìn');
  assert.equal(ls.tongQuan.cungThan, 'Tuất');
  assert.equal(ls.tongQuan.thanCuCung, 'Thiên Di');
  const vi = {
    'Tử Vi': 'Dậu', 'Tham Lang': 'Dậu', 'Thiên Cơ': 'Thân', 'Thái Âm': 'Thân', 'Thiên Phủ': 'Mùi',
    'Thái Dương': 'Ngọ', 'Vũ Khúc': 'Tỵ', 'Phá Quân': 'Tỵ', 'Thiên Đồng': 'Thìn', 'Cự Môn': 'Tuất',
    'Thiên Tướng': 'Hợi', 'Thiên Lương': 'Tý', 'Liêm Trinh': 'Sửu', 'Thất Sát': 'Sửu',
    'Lộc Tồn': 'Tỵ', 'Kình Dương': 'Ngọ', 'Đà La': 'Thìn', 'Tả Phù': 'Mão', 'Hữu Bật': 'Hợi',
    'Văn Xương': 'Sửu', 'Văn Khúc': 'Sửu', 'Địa Không': 'Dần', 'Địa Kiếp': 'Thân', 'Hỏa Tinh': 'Tuất', 'Linh Tinh': 'Ngọ'
  };
  Object.keys(vi).forEach((sao) => assert.equal(cungCo(ls, sao), vi[sao], sao));
  assert.deepEqual(ls.tuHoa, { 'Hóa Lộc': 'Tham Lang', 'Hóa Quyền': 'Thái Âm', 'Hóa Khoa': 'Hữu Bật', 'Hóa Kỵ': 'Thiên Cơ' });
  const han = {}; ls.cung.forEach((c) => { han[c.ten] = c.daiHan.tuoiBatDau; });
  assert.deepEqual(han, { 'Mệnh': 5, 'Phụ Mẫu': 15, 'Phúc Đức': 25, 'Điền Trạch': 35, 'Quan Lộc': 45, 'Nô Bộc': 55, 'Thiên Di': 65, 'Tật Ách': 75, 'Tài Bạch': 85, 'Tử Tức': 95, 'Phu Thê': 105, 'Huynh Đệ': 115 });
});

test('Phụ tinh mở rộng, vòng sao, Tuần Triệt, tiểu hạn, nguyệt hạn khớp lá số tham chiếu (năm xem 2026)', () => {
  const ls = lapLaSo({ calendar: 'lunar', day: 28, month: 12, year: 1998, hour: 17, gender: 'nam', viewedYear: 2026 });
  const vi = {
    'Thiên Khôi': 'Sửu', 'Thiên Việt': 'Mùi', 'Thiên Quan': 'Mão', 'Thiên Phúc': 'Mão', 'Lưu Hà': 'Tỵ', 'Thiên Trù': 'Ngọ', 'Văn Tinh': 'Thân',
    'Quốc Ấn': 'Sửu', 'Đường Phù': 'Tuất', 'Thiên Mã': 'Thân', 'Hoa Cái': 'Tuất', 'Kiếp Sát': 'Hợi', 'Đào Hoa': 'Mão', 'Phá Toái': 'Dậu',
    'Cô Thần': 'Tỵ', 'Quả Tú': 'Sửu', 'Thiên Không': 'Mão', 'Thiên Khốc': 'Thìn', 'Thiên Hư': 'Thân', 'Long Trì': 'Ngọ', 'Phượng Các': 'Thân',
    'Giải Thần': 'Thân', 'Hồng Loan': 'Sửu', 'Thiên Hỷ': 'Mùi', 'Thiên Đức': 'Hợi', 'Nguyệt Đức': 'Mùi', 'Thiên Tài': 'Ngọ', 'Thiên Thọ': 'Tý',
    'Đẩu Quân': 'Tý', 'Thiên Hình': 'Thân', 'Thiên Riêu': 'Tý', 'Thiên Y': 'Tý', 'Thiên Giải': 'Mùi', 'Địa Giải': 'Ngọ',
    'Phong Cáo': 'Hợi', 'Ân Quang': 'Mão', 'Thiên Quý': 'Hợi', 'Tam Thai': 'Ngọ', 'Bát Tọa': 'Thân',
    'Thiên La': 'Thìn', 'Địa Võng': 'Tuất', 'Thiên Thương': 'Dậu', 'Thiên Sứ': 'Hợi',
    'Thái Tuế': 'Dần', 'Thiếu Dương': 'Mão', 'Tang Môn': 'Thìn', 'Thiếu Âm': 'Tỵ', 'Quan Phù': 'Ngọ', 'Tử Phù': 'Mùi', 'Tuế Phá': 'Thân',
    'Long Đức': 'Dậu', 'Bạch Hổ': 'Tuất', 'Phúc Đức': 'Hợi', 'Điếu Khách': 'Tý', 'Trực Phù': 'Sửu',
    'Bác Sĩ': 'Tỵ', 'Lực Sĩ': 'Ngọ', 'Thanh Long': 'Mùi', 'Tiểu Hao': 'Thân', 'Tướng Quân': 'Dậu', 'Tấu Thư': 'Tuất', 'Phi Liêm': 'Hợi',
    'Hỷ Thần': 'Tý', 'Bệnh Phù': 'Sửu', 'Đại Hao': 'Dần', 'Phục Binh': 'Mão', 'Quan Phủ': 'Thìn',
    'Hóa Lộc': 'Dậu', 'Hóa Quyền': 'Thân', 'Hóa Khoa': 'Hợi', 'Hóa Kỵ': 'Thân',
    'Tràng Sinh': 'Thân', 'Mộc Dục': 'Dậu', 'Quan Đới': 'Tuất', 'Lâm Quan': 'Hợi', 'Đế Vượng': 'Tý', 'Suy': 'Sửu',
    'Bệnh': 'Dần', 'Tử': 'Mão', 'Mộ': 'Thìn', 'Tuyệt': 'Tỵ', 'Thai': 'Ngọ', 'Dưỡng': 'Mùi'
  };
  Object.keys(vi).forEach((sao) => assert.equal(cungCo(ls, sao), vi[sao], sao));
  assert.deepEqual(ls.tongQuan.tuan, ['Thân', 'Dậu']);
  assert.deepEqual(ls.tongQuan.triet, ['Tý', 'Sửu']);
  assert.equal(ls.tongQuan.menhChu, 'Liêm Trinh');
  assert.equal(ls.tongQuan.thanChu, 'Văn Xương');
  assert.equal(ls.tongQuan.banMenh, 'Thành Đầu Thổ');
  assert.equal(ls.tongQuan.cucMenh, 'Cục hòa Bản Mệnh');
  assert.deepEqual(ls.tongQuan.namXem, { nam: 2026, canChi: 'Bính Ngọ', tuoi: 29 });

  // Độ sáng
  const ds = (sao) => ls.cung.flatMap((c) => c.sao).find((s) => s.ten === sao).doSang;
  const expectDs = { 'Vũ Khúc': 'H', 'Phá Quân': 'H', 'Thái Dương': 'M', 'Thiên Phủ': 'Đ', 'Thiên Cơ': 'V', 'Thái Âm': 'M', 'Thiên Đồng': 'H',
    'Tử Vi': 'B', 'Tham Lang': 'H', 'Cự Môn': 'H', 'Liêm Trinh': 'Đ', 'Thất Sát': 'Đ', 'Thiên Lương': 'V', 'Thiên Tướng': 'Đ',
    'Kình Dương': 'H', 'Linh Tinh': 'Đ', 'Địa Kiếp': 'Đ', 'Hóa Kỵ': 'Đ', 'Tiểu Hao': 'Đ', 'Thiên Hư': 'H', 'Thiên Hình': 'Đ', 'Thiên Mã': 'H',
    'Đà La': 'Đ', 'Tang Môn': 'Đ', 'Thiên Khốc': 'Đ', 'Hỏa Tinh': 'H', 'Bạch Hổ': 'H', 'Địa Không': 'Đ', 'Đại Hao': 'Đ', 'Văn Khúc': 'Đ', 'Văn Xương': 'Đ', 'Thiên Riêu': 'H' };
  Object.keys(expectDs).forEach((sao) => assert.equal(ds(sao), expectDs[sao], 'độ sáng ' + sao));

  // Tiểu hạn & nguyệt hạn (năm xem Bính Ngọ 2026)
  const byChi = {}; ls.cung.forEach((c) => { byChi[c.chi] = c; });
  assert.equal(byChi['Thìn'].tieuHan, 'Dần');
  assert.equal(byChi['Tỵ'].tieuHan, 'Mão');
  assert.equal(byChi['Thân'].tieuHan, 'Ngọ');
  assert.equal(byChi['Ngọ'].nguyetHan, 1);
  assert.equal(byChi['Tỵ'].nguyetHan, 12);
  assert.equal(byChi['Thìn'].nguyetHan, 11);
  assert.equal(byChi['Tỵ'].trangSinh, 'Tuyệt');
  assert.ok(byChi['Dậu'].tuan && byChi['Thân'].tuan);
  assert.ok(byChi['Tý'].triet && byChi['Sửu'].triet);
});

test('Mọi sao trên lá số đều có ý nghĩa tra cứu', async () => {
  const { Y_NGHIA_SAO, Y_NGHIA_CUNG } = await import('../src/meanings.js');
  const ls = lapLaSo({ calendar: 'lunar', day: 28, month: 12, year: 1998, hour: 17, gender: 'nam' });
  const thieu = [];
  ls.cung.forEach((c) => { assert.ok(Y_NGHIA_CUNG[c.ten], 'cung ' + c.ten); c.sao.forEach((s) => { if (!Y_NGHIA_SAO[s.ten]) thieu.push(s.ten); }); });
  assert.deepEqual(thieu, []);
});
