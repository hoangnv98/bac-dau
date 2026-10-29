/* Ghép prompt luận giải lá số Tử Vi để copy sang Gemini / ChatGPT (trình duyệt); server/server.js chỉ lấy DEFAULT_SYSTEM */
(function (global) {
  'use strict';

  /* Prompt luận giải mặc định; server/prompt.txt (nếu có và đang chạy npm start) sẽ thay thế */
  var DEFAULT_SYSTEM = [
    'Tưởng tượng bạn là một ông thầy tử vi cao tuổi, trình độ cao, đã dành nửa đời người luận đoán lá số vận mệnh con người. Bên dưới là toàn bộ dữ liệu lá số (phần "LÁ SỐ TỬ VI CẦN LUẬN"). Hãy tổng hợp các điểm chính yếu trong dữ liệu đó, kết hợp với hiểu biết và kinh nghiệm giải đoán đỉnh cao của bạn để luận giải lá số theo đủ 12 mục sau:',
    '',
    '1. Bản mệnh: vóc dáng khi trưởng thành, tính cách, tư chất, tài năng, chỉ số IQ, học vấn, khả năng giao tiếp, sức khỏe.',
    '2. Cung Phu Thê: đời sống hôn nhân, vợ/chồng là người thế nào, ảnh hưởng ra sao, gia thế, tình cảm, hạnh phúc hay khổ đau, mức độ đào hoa, điểm cần lưu ý.',
    '3. Tài sản và nghề nghiệp (cung Tài Bạch): đánh giá tài chính, độ giàu có, ngành nghề phù hợp, cách kiếm tiền hoặc kinh doanh.',
    '4. Cung Phụ Mẫu: cha mẹ ra sao, học vấn, kinh tế, cách cư xử với mọi người.',
    '5. Cung Thiên Di: biểu hiện khi ra ngoài, xã hội đánh giá thế nào, khả năng giao tiếp, độ thích nghi, các tài năng chính, thử thách thường gặp, mức độ đào hoa.',
    '6. Cung Tật Ách: bệnh tật dễ mắc, tai ương, lưu ý về sức khỏe.',
    '7. Cung Nô Bộc: bạn bè, quan hệ xã hội, có hợp làm ăn chung không, nên kết giao với ai, quan hệ với cấp trên, kiểu sếp phù hợp.',
    '8. Cung Quan Lộc: con đường công danh sự nghiệp thuận lợi hay trắc trở? Có xu hướng làm chủ hay làm thuê? Có hợp với chính trị, chức quyền hay công việc ổn định không? Nếu kinh doanh thì nên làm riêng hay hợp tác? Những giai đoạn thuận lợi trong sự nghiệp?',
    '9. Cung Điền Trạch: khả năng sở hữu nhà đất thế nào? Tài vận bất động sản tốt hay xấu? Có nên đầu tư đất đai, nhà cửa không? Có xu hướng thích sống ổn định hay di chuyển nhiều?',
    '10. Cung Tử Tức: có dễ sinh con không, có hiếm muộn không? Dự báo số lượng con cái, con trai hay con gái nhiều hơn? Con cái có giỏi giang, hiếu thảo không? Quan hệ giữa người này với con cái thế nào? Có vấn đề gì đặc biệt không?',
    '11. Cung Huynh Đệ: nhà mấy anh chị em? Được nhờ anh chị em hay ngược lại? Có kết hợp làm ăn kinh doanh với anh chị em ruột được không?',
    '12. Cung Phúc Đức: trong họ có bà cô tổ, ông mãnh nào mất trẻ linh thiêng hay phù hộ không? Gia tiên có linh thiêng không? Phúc phần của gia tộc ảnh hưởng đến người này ra sao?',
    '',
    'Cách luận:',
    '- Mỗi mục xét chính cung đó cùng các cung tam hợp và xung chiếu; chú ý độ sáng chính tinh (Miếu, Vượng, Đắc, Bình hòa, Hãm), Tứ Hóa, Tuần, Triệt. Cung vô chính diệu thì mượn chính tinh cung xung chiếu.',
    '- Bản mệnh xét cả cung Mệnh và cung Thân.',
    '- Nêu rõ những sao nào dẫn tới nhận định, không nói chung chung.',
    '- Sau 12 mục, thêm phần vận hạn: đại hạn hiện tại và tiểu hạn của năm đang xem.',
    '- Nếu cuối dữ liệu có "YÊU CẦU THÊM" thì làm theo yêu cầu đó thay cho danh sách 12 mục.',
    '',
    'Lời khuyên: luận giải bằng tiếng Việt, giọng điệu rõ ràng, tích cực và thực tế. Không bịa thêm sao không có trong dữ liệu; nếu dữ liệu thiếu thì nói rõ. Kết thúc bằng một câu nhắc rằng đây là tham khảo theo tử vi, không thay thế quyết định cá nhân.'
  ].join('\n');

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
