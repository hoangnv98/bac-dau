/* Ghép prompt luận giải lá số Tử Vi để copy sang Gemini / ChatGPT (trình duyệt); server/server.js chỉ lấy DEFAULT_SYSTEM */
(function (global) {
  'use strict';

  var DEFAULT_SYSTEM = 'Bạn là chuyên gia Tử Vi Đẩu Số. Hãy luận giải lá số dưới đây bằng tiếng Việt, rõ ràng, có cấu trúc.';

  var DO_SANG = { M: 'Miếu', V: 'Vượng', 'Đ': 'Đắc', B: 'Bình hòa', H: 'Hãm' };
  var THU_TU_CUNG = ['Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'];

  function tenSao(s, chiTiet) {
    var extra = [];
    if (s.doSang) extra.push(DO_SANG[s.doSang] || s.doSang);
    if (chiTiet && s.hanh) extra.push('hành ' + s.hanh);
    if (s.hoa) extra.push(s.hoa);
    return s.ten + (extra.length ? ' (' + extra.join(', ') + ')' : '');
  }

  function chinhTinh(c) {
    var ct = c.sao.filter(function (s) { return s.loai === 'chính tinh'; });
    return ct.length ? ct.map(function (s) { return s.ten; }).join(', ') : 'vô chính diệu';
  }

  /* Mô tả lá số bằng văn bản tiếng Việt – người đọc hiểu được, mô hình AI cũng đủ dữ liệu */
  function moTaLaSo(ls) {
    var t = ls.tongQuan || {};
    var al = ls.amLich || {};
    var cc = al.canChi || {};
    var nx = t.namXem || {};
    var dh = t.daiHan || {};
    var tuHoa = ls.tuHoa || {};
    var cung = (ls.cung || []).slice();
    var theoChi = {};
    cung.forEach(function (c) { theoChi[c.viTri] = c; });
    var namXemChi = nx.canChi ? nx.canChi.split(' ')[1] : '';
    var daiHanNay = cung.filter(function (c) { return nx.tuoi >= c.daiHan.tuoiBatDau && nx.tuoi <= c.daiHan.tuoiKetThuc; })[0];
    var tieuHanNay = cung.filter(function (c) { return c.tieuHan === namXemChi; })[0];
    var L = [];

    L.push('THÔNG TIN CHUNG');
    L.push('- Họ tên: ' + (t.hoTen || '(không ghi)') + ' · ' + t.gioiTinh + ' · ' + t.amDuong + ' (' + t.amDuongThuanLy + ')');
    L.push('- Sinh ngày ' + ls.duongLich.day + '/' + ls.duongLich.month + '/' + ls.duongLich.year + ' dương lịch, tức ' + al.day + '/' + al.month + (al.leap ? ' (nhuận)' : '') + '/' + al.year + ' âm lịch');
    L.push('- Năm ' + cc.nam + ', tháng ' + cc.thang + ', ngày ' + cc.ngay + ', giờ ' + cc.gio);
    L.push('- Bản mệnh: ' + t.banMenh + (t.menhNguHanh ? ' (hành ' + t.menhNguHanh + ')' : '') + ' · Cục: ' + (t.cuc && t.cuc.ten) + ' – ' + t.cucMenh);
    L.push('- Mệnh chủ: ' + t.menhChu + ' · Thân chủ: ' + t.thanChu);
    L.push('- Cung Mệnh ở ' + t.cungMenh + ', cung Thân ở ' + t.cungThan + ' (Thân cư ' + t.thanCuCung + ') · Sao Tử Vi ở ' + t.tuViTai);
    L.push('- Đại hạn đi ' + dh.chieu + ', bắt đầu từ ' + dh.khoiTuoi + ' tuổi · Tuần ở ' + (t.tuan || []).join('–') + ' · Triệt ở ' + (t.triet || []).join('–'));
    L.push('- Tứ Hóa năm sinh: ' + Object.keys(tuHoa).map(function (k) { return k + ' → ' + tuHoa[k]; }).join(', '));
    L.push('');
    L.push('NĂM ĐANG XEM: ' + nx.nam + ' (' + nx.canChi + '), ' + nx.tuoi + ' tuổi âm');
    if (daiHanNay) L.push('- Đang ở đại hạn cung ' + daiHanNay.ten + ' (' + daiHanNay.daiHan.nhan + ' tuổi)');
    if (tieuHanNay) L.push('- Tiểu hạn năm nay ở cung ' + tieuHanNay.ten);
    L.push('');
    L.push('12 CUNG (độ sáng: Miếu > Vượng > Đắc > Bình hòa > Hãm)');

    cung.sort(function (a, b) {
      var ia = THU_TU_CUNG.indexOf(a.ten), ib = THU_TU_CUNG.indexOf(b.ten);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    cung.forEach(function (c) {
      var ghi = ['đại hạn ' + c.daiHan.nhan + ' tuổi', 'Tràng sinh: ' + c.trangSinh];
      if (c.laCungThan) ghi.push('kiêm cung Thân');
      if (c.tuan) ghi.push('bị Tuần');
      if (c.triet) ghi.push('bị Triệt');
      if (c === daiHanNay) ghi.push('ĐẠI HẠN HIỆN TẠI');
      if (c === tieuHanNay) ghi.push('TIỂU HẠN ' + nx.nam);
      var ct = c.sao.filter(function (s) { return s.loai === 'chính tinh'; });
      var tot = c.sao.filter(function (s) { return s.loai === 'phụ tinh' && s.cat; });
      var xau = c.sao.filter(function (s) { return s.loai === 'phụ tinh' && !s.cat; });
      var lk = function (d) { var x = theoChi[(c.viTri + d) % 12]; return x ? x.ten + ' (' + x.chi + ': ' + chinhTinh(x) + ')' : ''; };
      L.push('');
      L.push('[CUNG ' + c.ten.toUpperCase() + '] tại ' + c.chi + ' (' + c.canChi + ') · ' + ghi.join(' · '));
      L.push('- Chính tinh: ' + (ct.length ? ct.map(function (s) { return tenSao(s, true); }).join('; ') : 'Vô chính diệu (không có chính tinh)'));
      L.push('- Sao tốt: ' + (tot.length ? tot.map(function (s) { return tenSao(s); }).join(', ') : 'không có'));
      L.push('- Sao xấu: ' + (xau.length ? xau.map(function (s) { return tenSao(s); }).join(', ') : 'không có'));
      L.push('- Tam hợp: ' + lk(4) + ' và ' + lk(8) + ' · Xung chiếu: ' + lk(6));
    });
    return L.join('\n');
  }

  /* Phần lá số (kèm yêu cầu thêm nếu có) nối sau prompt luận giải */
  function userText(laSo, cauHoi) {
    var extra = typeof cauHoi === 'string' && cauHoi.trim() ? '\n\nYÊU CẦU THÊM: ' + cauHoi.trim() : '';
    return 'LÁ SỐ TỬ VI CẦN LUẬN\n\n' + moTaLaSo(laSo) + extra;
  }

  /* Prompt trọn gói để copy dán vào Gemini / ChatGPT / Claude… */
  function copyText(system, laSo, cauHoi) {
    return (system || DEFAULT_SYSTEM) + '\n\n==============================\n\n' + userText(laSo, cauHoi);
  }

  global.TuViPrompt = { DEFAULT_SYSTEM: DEFAULT_SYSTEM, moTaLaSo: moTaLaSo, userText: userText, copyText: copyText };
})(typeof globalThis !== 'undefined' ? globalThis : window);
