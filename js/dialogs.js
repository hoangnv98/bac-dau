/* Hộp thoại "Đi tới ngày", "Ngày của tôi" và màn hình "Lá số Tử Vi" – điều khiển bằng remote, bàn phím và cảm ứng */
(function () {
  'use strict';

  var App = window.CalendarApp;
  var L = window.Lunar;
  var D = window.CalData;

  function $(id) { return document.getElementById(id); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var BACK_CODES = [27, 10009, 461, 8];   // Esc, Back Tizen, Back webOS, Backspace
  var openModal = null;                   // 'goto' | 'mine' | 'tuvi' | null

  /* ================================================================ */
  /* Khung chung                                                      */
  /* ================================================================ */
  function show(id) { $(id).hidden = false; document.body.classList.add('modal-open'); }
  function hideAll() {
    $('modalGoto').hidden = true;
    $('modalMine').hidden = true;
    $('modalTuVi').hidden = true;
    document.body.classList.remove('modal-open');
    openModal = null;
  }

  /* ================================================================ */
  /* 1. Đi tới ngày                                                   */
  /* ================================================================ */
  var goto = { type: 'solar', fieldIdx: 1 };
  var GOTO_FIELDS_SOLAR = ['type', 'day', 'month', 'year', 'ok'];
  var GOTO_FIELDS_LUNAR = ['type', 'day', 'month', 'year', 'leap', 'ok'];

  function gotoFields() { return goto.type === 'lunar' ? GOTO_FIELDS_LUNAR : GOTO_FIELDS_SOLAR; }

  function openGoto() {
    var info = App.dayInfo(App.getFocusJd());
    goto.type = 'solar';
    goto.fieldIdx = 1;
    $('gotoDay').value = info.d;
    $('gotoMonth').value = info.m;
    $('gotoYear').value = info.y;
    $('gotoLeap').checked = false;
    applyGotoType();
    show('modalGoto');
    openModal = 'goto';
    highlightGotoField();
    updateGotoPreview();
  }

  function applyGotoType() {
    qsa('#modalGoto .seg-btn').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-type') === goto.type); });
    $('gotoLeapWrap').hidden = goto.type !== 'lunar';
    if (goto.type !== 'lunar') $('gotoLeap').checked = false;
    $('gotoDay').max = goto.type === 'lunar' ? 30 : 31;
  }

  function highlightGotoField() {
    var name = gotoFields()[goto.fieldIdx];
    qsa('#modalGoto .field').forEach(function (f) { f.classList.toggle('active', f.getAttribute('data-field') === name); });
    var input = $('modalGoto').querySelector('.field.active input');
    if (input && input.type === 'number') { try { input.focus({ preventScroll: true }); input.select(); } catch (e) { input.focus(); } }
    else if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }

  function readGoto() {
    return {
      d: parseInt($('gotoDay').value, 10),
      m: parseInt($('gotoMonth').value, 10),
      y: parseInt($('gotoYear').value, 10),
      leap: $('gotoLeap').checked
    };
  }

  /** Trả về JD đích hoặc null nếu ngày không hợp lệ */
  function resolveGoto() {
    var v = readGoto();
    if (!(v.d >= 1 && v.m >= 1 && v.m <= 12 && v.y >= 1800 && v.y <= 2199)) return null;
    if (goto.type === 'lunar') {
      if (v.d > 30) return null;
      var s = L.lunar2Solar(v.d, v.m, v.y, v.leap);
      if (s[0] === 0) return null;
      var back = L.solar2Lunar(s[0], s[1], s[2]);
      if (back.day !== v.d || back.month !== v.m || back.leap !== v.leap) return null; // ngày 30 tháng thiếu
      return L.jdFromDate(s[0], s[1], s[2]);
    }
    if (v.d > 31) return null;
    var jd = L.jdFromDate(v.d, v.m, v.y);
    var chk = L.jdToDate(jd);
    if (chk[0] !== v.d || chk[1] !== v.m || chk[2] !== v.y) return null;        // 31/4, 30/2...
    return jd;
  }

  function updateGotoPreview() {
    var jd = resolveGoto();
    var el = $('gotoPreview');
    if (jd === null) {
      el.innerHTML = '<span class="bad">Ngày không hợp lệ</span>';
      $('gotoOk').disabled = true;
      return;
    }
    $('gotoOk').disabled = false;
    var info = App.dayInfo(jd), lu = info.lunar;
    var diff = jd - App.getTodayJd();
    var rel = diff === 0 ? 'hôm nay' : diff > 0 ? 'còn ' + diff + ' ngày' : diff + ' ngày (đã qua)';
    el.innerHTML = '<b>' + D.WEEKDAYS[info.weekday] + ', ' + pad2(info.d) + '/' + pad2(info.m) + '/' + info.y + '</b>' +
      '<span class="sep">·</span>Âm lịch ' + lu.day + '/' + lu.month + (lu.leap ? ' nhuận' : '') + ' năm ' + esc(info.canChiYear) +
      '<span class="sep">·</span>' + rel;
  }

  function commitGoto() {
    var jd = resolveGoto();
    if (jd === null) return;
    hideAll();
    App.setFocus(jd, true);
  }

  function stepGotoValue(delta) {
    var name = gotoFields()[goto.fieldIdx];
    if (name === 'type') { goto.type = goto.type === 'solar' ? 'lunar' : 'solar'; applyGotoType(); }
    else if (name === 'leap') { $('gotoLeap').checked = !$('gotoLeap').checked; }
    else if (name === 'day' || name === 'month' || name === 'year') {
      var input = $('goto' + name.charAt(0).toUpperCase() + name.slice(1));
      var min = parseInt(input.min, 10), max = parseInt(input.max, 10);
      var v = parseInt(input.value, 10); if (isNaN(v)) v = min;
      v += delta;
      if (v > max) v = min; if (v < min) v = max;
      input.value = v;
    }
    updateGotoPreview();
  }

  function onGotoKey(e) {
    var code = e.keyCode || e.which;
    if (BACK_CODES.indexOf(code) !== -1 && !(code === 8 && e.target.tagName === 'INPUT')) { hideAll(); return true; }
    if (code === 37) { goto.fieldIdx = (goto.fieldIdx - 1 + gotoFields().length) % gotoFields().length; highlightGotoField(); return true; }
    if (code === 39) { goto.fieldIdx = (goto.fieldIdx + 1) % gotoFields().length; highlightGotoField(); return true; }
    if (code === 38) { stepGotoValue(1); return true; }
    if (code === 40) { stepGotoValue(-1); return true; }
    if (code === 13) {
      var name = gotoFields()[goto.fieldIdx];
      if (name === 'type' || name === 'leap') stepGotoValue(1); else commitGoto();
      return true;
    }
    return false; // để gõ số bình thường
  }

  function bindGoto() {
    qsa('#modalGoto .seg-btn').forEach(function (b) {
      b.addEventListener('click', function () { goto.type = b.getAttribute('data-type'); goto.fieldIdx = 1; applyGotoType(); highlightGotoField(); updateGotoPreview(); });
    });
    ['gotoDay', 'gotoMonth', 'gotoYear'].forEach(function (id, i) {
      $(id).addEventListener('input', updateGotoPreview);
      $(id).addEventListener('focus', function () { goto.fieldIdx = i + 1; qsa('#modalGoto .field').forEach(function (f) { f.classList.toggle('active', f.getAttribute('data-field') === gotoFields()[goto.fieldIdx]); }); });
    });
    $('gotoLeap').addEventListener('change', updateGotoPreview);
    $('gotoOk').addEventListener('click', commitGoto);
  }

  /* ================================================================ */
  /* 2. Ngày của tôi (dữ liệu: js/myevents.js)                        */
  /* ================================================================ */
  var mine = { type: 'solar', editId: null, confirmId: null };
  var ME = window.MyEvents;

  function openMine() {
    resetMineForm();
    show('modalMine');
    openModal = 'mine';
    renderMineList();
    try { $('mineName').focus({ preventScroll: true }); } catch (e) { $('mineName').focus(); }
  }

  /** Điền ngày/tháng theo ngày đang chọn trên lịch (dương hoặc âm tùy loại) */
  function fillMineFromFocus() {
    var info = App.dayInfo(App.getFocusJd());
    $('mineDay').value = mine.type === 'lunar' ? info.lunar.day : info.d;
    $('mineMonth').value = mine.type === 'lunar' ? info.lunar.month : info.m;
  }

  function applyMineType() {
    qsa('#mineType .seg-btn').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-type') === mine.type); });
    $('mineDay').max = mine.type === 'lunar' ? 30 : 31;
  }

  function resetMineForm() {
    mine.type = 'solar';
    mine.editId = null;
    mine.confirmId = null;
    $('mineName').value = '';
    $('mineYear').value = '';
    applyMineType();
    fillMineFromFocus();
    $('mineSave').textContent = 'Thêm';
    $('mineCancel').hidden = true;
    $('mineMsg').textContent = '';
  }

  function editMine(id) {
    var it = ME.get(id);
    if (!it) return;
    mine.editId = id;
    mine.type = it.type;
    applyMineType();
    $('mineName').value = it.name;
    $('mineDay').value = it.d;
    $('mineMonth').value = it.m;
    $('mineYear').value = it.y || '';
    $('mineSave').textContent = 'Lưu';
    $('mineCancel').hidden = false;
    $('mineMsg').textContent = '';
    $('mineName').focus();
  }

  function saveMine(e) {
    if (e) e.preventDefault();
    var d = parseInt($('mineDay').value, 10), m = parseInt($('mineMonth').value, 10);
    var yRaw = $('mineYear').value.trim(), y = parseInt(yRaw, 10);
    var msg = '';
    if (!$('mineName').value.trim()) msg = 'Nhập tên sự kiện';
    else if (!(m >= 1 && m <= 12)) msg = 'Tháng không hợp lệ';
    else if (!(d >= 1 && d <= (mine.type === 'lunar' ? 30 : [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]))) msg = 'Ngày không hợp lệ';
    else if (yRaw && !(y >= 1800 && y <= 2199)) msg = 'Năm gốc phải trong khoảng 1800–2199';
    if (msg) { $('mineMsg').innerHTML = '<span class="bad">' + msg + '</span>'; return; }

    var saved = ME.put({ id: mine.editId || undefined, name: $('mineName').value, type: mine.type, d: d, m: m, y: yRaw ? y : undefined });
    if (!saved) { $('mineMsg').innerHTML = '<span class="bad">Không lưu được</span>'; return; }
    resetMineForm();
    $('mineMsg').textContent = 'Đã lưu "' + saved.name + '"';
    App.refresh();
    renderMineList();
  }

  function removeMine(id) {
    if (mine.confirmId !== id) { mine.confirmId = id; renderMineList(); return; }   // bấm lần 2 mới xóa
    ME.remove(id);
    if (mine.editId === id) resetMineForm();
    mine.confirmId = null;
    App.refresh();
    renderMineList();
  }

  /** Số ngày tới lần gần nhất của từng sự kiện (tính từ hôm nay) */
  function nextOccurrences() {
    var res = {}, today = App.getTodayJd(), left = ME.list().length, i, j, ev;
    for (i = 0; i <= 400 && left > 0; i++) {
      ev = App.dayInfo(today + i).events;
      for (j = 0; j < ev.length; j++) {
        if (ev[j].type === 'mine' && res[ev[j].id] === undefined) { res[ev[j].id] = { days: i, jd: today + i }; left--; }
      }
    }
    return res;
  }

  function renderMineList() {
    var items = ME.list(), next = nextOccurrences();
    items.sort(function (a, b) {
      var na = next[a.id] ? next[a.id].days : 9999, nb = next[b.id] ? next[b.id].days : 9999;
      return na - nb || a.name.localeCompare(b.name, 'vi');
    });
    if (!items.length) { $('mineList').innerHTML = '<li class="empty">Chưa có ngày nào. Thêm sinh nhật, ngày giỗ, kỷ niệm… ở trên.</li>'; return; }
    $('mineList').innerHTML = items.map(function (it) {
      var nx = next[it.id], left = '';
      if (nx) left = nx.days === 0 ? 'hôm nay' : nx.days === 1 ? 'ngày mai' : 'còn ' + nx.days + ' ngày';
      var date = pad2(it.d) + '/' + pad2(it.m) + (it.y ? '/' + it.y : '') + (it.type === 'lunar' ? ' ÂL' : '');
      return '<li data-id="' + esc(it.id) + '">' +
        '<button type="button" class="mine-go" title="Xem trên lịch"' + (nx ? ' data-jd="' + nx.jd + '"' : '') + '>' +
        '<span class="date' + (it.type === 'lunar' ? ' lunar' : '') + '">' + date + '</span>' +
        '<span class="name">' + esc(it.name) + '</span>' +
        '<span class="left' + (nx && nx.days <= 7 ? ' soon' : '') + '">' + left + '</span></button>' +
        '<button type="button" class="btn ghost small act-edit">Sửa</button>' +
        '<button type="button" class="btn ghost small act-del' + (mine.confirmId === it.id ? ' danger' : '') + '">' + (mine.confirmId === it.id ? 'Xóa?' : 'Xóa') + '</button>' +
        '</li>';
    }).join('');
  }

  function exportMine() {
    var blob = new Blob([ME.exportJson()], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ngay-cua-toi.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }

  function importMine(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var n = ME.importJson(String(reader.result));
        $('mineMsg').textContent = 'Đã nhập ' + n + ' mục';
        App.refresh();
        renderMineList();
      } catch (err) {
        $('mineMsg').innerHTML = '<span class="bad">File không hợp lệ</span>';
      }
    };
    reader.readAsText(file);
  }

  function onMineKey(e) {
    var code = e.keyCode || e.which, tag = e.target && e.target.tagName;
    if (code === 27 || code === 10009 || code === 461) {
      if (mine.editId) resetMineForm(); else hideAll();
      return true;
    }
    if (code === 8 && tag !== 'INPUT') { hideAll(); return true; }
    return false; // còn lại: gõ chữ, Tab, Enter (submit form) chạy mặc định
  }

  function bindMine() {
    qsa('#mineType .seg-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = b.getAttribute('data-type');
        if (t === mine.type) return;
        mine.type = t;
        applyMineType();
        if (!mine.editId) fillMineFromFocus();
      });
    });
    $('mineForm').addEventListener('submit', saveMine);
    $('mineCancel').addEventListener('click', resetMineForm);
    $('mineList').addEventListener('click', function (e) {
      var btn = e.target.closest('button'), li = e.target.closest('li[data-id]');
      if (!btn || !li) return;
      var id = li.getAttribute('data-id');
      if (btn.classList.contains('act-edit')) editMine(id);
      else if (btn.classList.contains('act-del')) removeMine(id);
      else if (btn.classList.contains('mine-go') && btn.getAttribute('data-jd')) { hideAll(); App.setFocus(parseInt(btn.getAttribute('data-jd'), 10), true); }
    });
    $('mineExport').addEventListener('click', exportMine);
    $('mineImport').addEventListener('click', function () { $('mineFile').click(); });
    $('mineFile').addEventListener('change', function () { if (this.files[0]) importMine(this.files[0]); this.value = ''; });
  }

  /* ================================================================ */
  /* 3. Lá số Tử Vi (bố cục kiểu aituvi)                              */
  /* ================================================================ */
  var tuvi = { hourChi: 0, gender: 'nam', cal: 'solar', jd: 0, viewedYear: new Date().getFullYear(), name: '', laSo: null, focusChi: -1, hoverChi: -1 };

  /* Vị trí 12 cung trên bảng 4x4: chi -> [hàng, cột] (1-based) */
  var LAYOUT = { 5: [1, 1], 6: [1, 2], 7: [1, 3], 8: [1, 4], 4: [2, 1], 9: [2, 4], 3: [3, 1], 10: [3, 4], 2: [4, 1], 1: [4, 2], 0: [4, 3], 11: [4, 4] };
  var HANH_CLASS = { 'Kim': 'h-kim', 'Mộc': 'h-moc', 'Thủy': 'h-thuy', 'Hỏa': 'h-hoa', 'Thổ': 'h-tho' };
  var HOA_CLASS = { 'Hóa Lộc': 'loc', 'Hóa Quyền': 'quyen', 'Hóa Khoa': 'khoa', 'Hóa Kỵ': 'ky' };
  var CAN_SHORT = { 'Giáp': 'G', 'Ất': 'Ấ', 'Bính': 'B', 'Đinh': 'Đ', 'Mậu': 'M', 'Kỷ': 'K', 'Canh': 'C', 'Tân': 'T', 'Nhâm': 'N', 'Quý': 'Q' };

  function hourText(chi) {
    var start = chi === 0 ? 23 : chi * 2 - 1;
    var end = chi === 0 ? 0 : chi * 2;
    return start + 'h - ' + end + 'h59';
  }

  function loadTuViPrefs() {
    try {
      var p = JSON.parse(localStorage.getItem('tuviPrefs') || 'null');
      if (!p) return;
      if (Number.isInteger(p.hourChi)) tuvi.hourChi = p.hourChi % 12;
      if (p.gender === 'nam' || p.gender === 'nữ') tuvi.gender = p.gender;
      if (p.cal === 'solar' || p.cal === 'lunar') tuvi.cal = p.cal;
      if (typeof p.name === 'string') { tuvi.name = p.name; $('tuviName').value = p.name; }
    } catch (e) { /* ignore */ }
  }
  function saveTuViPrefs() {
    try { localStorage.setItem('tuviPrefs', JSON.stringify({ hourChi: tuvi.hourChi, gender: tuvi.gender, cal: tuvi.cal, name: tuvi.name })); } catch (e) { /* ignore */ }
  }

  function openTuVi() {
    if (!window.TuVi) { alert('Chưa tải được module Tử Vi (js/tuvi.bundle.js).'); return; }
    tuvi.jd = App.getFocusJd();
    loadTuViPrefs();
    var y = L.jdToDate(tuvi.jd)[2];
    tuvi.viewedYear = Math.max(y, new Date().getFullYear());
    tuvi.focusChi = -1;
    // Deep link: #d=1998-12-28&tuvi&cal=lunar&h=9&g=nam&y=2026&name=A&ai
    var q = {}; location.hash.replace(/^#/, '').split('&').forEach(function (kv) { var p = kv.split('='); q[p[0]] = p.length > 1 ? decodeURIComponent(p[1]) : true; });
    if (q.cal === 'lunar' || q.cal === 'solar') tuvi.cal = q.cal;
    if (q.h !== undefined && !isNaN(parseInt(q.h, 10))) tuvi.hourChi = parseInt(q.h, 10) % 12;
    if (q.g === 'nam' || q.g === 'nữ' || q.g === 'nu') tuvi.gender = q.g === 'nu' ? 'nữ' : q.g;
    if (q.y && !isNaN(parseInt(q.y, 10))) tuvi.viewedYear = parseInt(q.y, 10);
    if (typeof q.name === 'string') { tuvi.name = q.name; $('tuviName').value = q.name; }
    if (q.focus !== undefined && !isNaN(parseInt(q.focus, 10))) tuvi.focusChi = parseInt(q.focus, 10) % 12;
    fillYearSelect(y);
    setTab(q.tab === 'tracuu' ? 'tracuu' : 'laso');
    show('modalTuVi');
    openModal = 'tuvi';
    closeAi();
    renderTuVi();
    loadSysPrompt();
    if (q.ai === true) copyPrompt();
    location.hash = '';
  }

  function fillYearSelect(birthYear) {
    var sel = $('tuviYear'), html = '';
    for (var yy = birthYear; yy <= birthYear + 100; yy++) html += '<option value="' + yy + '">' + yy + '</option>';
    sel.innerHTML = html;
  }

  function starHtml(s) {
    var cls = 's ' + (HANH_CLASS[s.hanh] || '');
    return '<span class="' + cls + '">' + esc(s.ten) + (s.doSang ? ' (' + s.doSang + ')' : '') + '</span>';
  }

  function renderTuVi() {
    var sd = L.jdToDate(tuvi.jd);
    $('tuviDob').textContent = pad2(sd[0]) + '/' + pad2(sd[1]) + '/' + sd[2];
    $('tuviHour').value = tuvi.hourChi;
    $('tuviYear').value = tuvi.viewedYear;
    qsa('#tuviGender .seg-btn').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-gender') === tuvi.gender); });
    qsa('#tuviCal .seg-btn').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-cal') === tuvi.cal); });

    var ls;
    try {
      ls = window.TuVi.lapLaSo({
        calendar: tuvi.cal, day: sd[0], month: sd[1], year: sd[2],
        hourChi: tuvi.hourChi, gender: tuvi.gender, viewedYear: tuvi.viewedYear, name: tuvi.name
      });
    } catch (err) {
      tuvi.laSo = null;
      $('btnCopyPrompt').disabled = true;
      $('tuviBoard').innerHTML = '<div class="av-error"><b>' + esc(err.message) + '</b><br>' +
        (tuvi.cal === 'lunar' ? 'Chuyển "Ngày sinh" sang Dương lịch, hoặc đóng lá số và chọn một ngày khác trên lịch.' : 'Đóng lá số và chọn một ngày khác trên lịch.') + '</div>';
      return;
    }
    tuvi.laSo = ls;
    $('btnCopyPrompt').disabled = false;
    saveTuViPrefs();
    var t = ls.tongQuan, al = ls.amLich, dl = ls.duongLich, html = '';

    ls.cung.forEach(function (c) {
      var pos = LAYOUT[c.viTri];
      var chinh = c.sao.filter(function (s) { return s.loai === 'chính tinh'; });
      var phu = c.sao.filter(function (s) { return s.loai === 'phụ tinh'; });
      var ts = c.sao.filter(function (s) { return s.loai === 'tràng sinh'; })[0];
      var cat = phu.filter(function (s) { return s.cat; }), hung = phu.filter(function (s) { return !s.cat; });
      var canChi = c.canChi.split(' ');
      var order = window.TuVi.CUNG_CHUC_NANG.indexOf(c.ten);

      var chip = (c.tuan ? '<i class="av-chip">Tuần</i>' : '') + (c.triet ? '<i class="av-chip">Triệt</i>' : '');

      html += '<div class="av-cell' + (c.ten === 'Mệnh' ? ' is-menh' : '') + (c.laCungThan ? ' is-than' : '') +
        '" data-chi="' + c.viTri + '" style="grid-row:' + pos[0] + ';grid-column:' + pos[1] + ';order:' + order + '">' +
        '<div class="av-head"><span class="av-canchi">' + CAN_SHORT[canChi[0]] + '.' + esc(canChi[1]) + '</span>' +
        '<span class="av-ten">' + esc(c.ten) + (c.laCungThan ? '<em class="av-than">Thân</em>' : '') + chip + '</span>' +
        '<span class="av-dh">' + c.daiHan.tuoiBatDau + '</span></div>' +
        '<div class="av-chinh">' + (chinh.length ? chinh.map(starHtml).join('') : '<span class="av-none">&nbsp;</span>') + '</div>' +
        '<div class="av-phu"><div class="av-col cat">' + cat.map(starHtml).join('') + '</div><div class="av-col hung">' + hung.map(starHtml).join('') + '</div></div>' +
        '<div class="av-foot"><span class="av-tieuhan">' + esc(c.tieuHan) + '</span>' +
        '<span class="av-ts ' + (ts ? HANH_CLASS[ts.hanh] : '') + '">' + (ts ? esc(ts.ten) : '') + '</span>' +
        '<span class="av-nh">T.' + c.nguyetHan + '</span></div>' +
        '</div>';
    });

    var dOrA = function (duong, am) { return duong === am ? String(duong) : duong + ' <small>(' + am + ')</small>'; };
    html += '<div class="av-center">' +
      '<table>' +
      '<tr><td>Họ tên</td><td colspan="2"><b>' + (t.hoTen ? esc(t.hoTen) : '—') + '</b></td></tr>' +
      '<tr><td>Năm</td><td>' + dOrA(dl.year, al.year) + '</td><td><b>' + esc(al.canChi.nam) + '</b></td></tr>' +
      '<tr><td>Tháng</td><td>' + dOrA(dl.month, al.month + (al.leap ? 'n' : '')) + '</td><td><b>' + esc(al.canChi.thang) + '</b></td></tr>' +
      '<tr><td>Ngày</td><td>' + dOrA(dl.day, al.day) + '</td><td><b>' + esc(al.canChi.ngay) + '</b></td></tr>' +
      '<tr><td>Giờ</td><td>' + hourText(tuvi.hourChi) + '</td><td><b>' + esc(al.canChi.gio) + '</b></td></tr>' +
      '<tr><td>Năm xem</td><td>' + t.namXem.nam + '</td><td><b>' + esc(t.namXem.canChi) + '</b> · ' + t.namXem.tuoi + ' tuổi</td></tr>' +
      '<tr class="sp"><td>Âm Dương</td><td colspan="2"><b>' + esc(t.amDuong) + '</b><br>' + esc(t.amDuongThuanLy) + '</td></tr>' +
      '<tr><td>Mệnh</td><td colspan="2"><b>' + esc(t.banMenh) + '</b></td></tr>' +
      '<tr><td>Cục</td><td colspan="2"><b>' + esc(t.cuc.ten) + '</b> <small>(' + esc(t.cuc.canChiCungMenh) + ' · ' + esc(t.cuc.napAm) + ')</small><br>' + esc(t.cucMenh) + '</td></tr>' +
      '<tr><td>Mệnh chủ</td><td colspan="2"><b>' + esc(t.menhChu) + '</b></td></tr>' +
      '<tr><td>Thân chủ</td><td colspan="2"><b>' + esc(t.thanChu) + '</b></td></tr>' +
      '</table>' +
      '<div class="av-tuhoa">' + Object.keys(ls.tuHoa).map(function (k) { return '<span><i>' + k.replace('Hóa ', '') + '</i> ' + esc(ls.tuHoa[k]) + '</span>'; }).join('') + '</div>' +
      '</div>' +
      '<svg class="av-links" aria-hidden="true"></svg><div class="av-edges"></div>';
    $('tuviBoard').innerHTML = html;
    if (tuvi.focusChi < 0) tuvi.focusChi = D.CHI.indexOf(t.cungMenh);
    drawLinks();
    drawEdges();
    renderLookup();
  }

  /* ================================================================ */
  /* 2b. Tra cứu theo cung / theo sao                                  */
  /* ================================================================ */
  var lookup = { tab: 'laso', query: '', open: {} };

  function setTab(tab) {
    lookup.tab = tab;
    qsa('#tuviTabs .tab-btn').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-tab') === tab); });
    $('tuviLookup').hidden = tab !== 'tracuu';
    var wrap = document.querySelector('.av-wrap'); if (wrap) wrap.hidden = tab === 'tracuu';
    if (tab === 'laso') { drawLinks(); drawEdges(); }
  }

  function saoLabel(s) { return s.ten + (s.doSang ? ' (' + s.doSang + ')' : ''); }
  function saoSpan(s, extra) {
    var q = lookup.query, hit = q && s.ten.toLowerCase().indexOf(q) !== -1;
    return '<span class="lk-sao ' + (HANH_CLASS[s.hanh] || '') + (hit ? ' hit' : '') + (extra || '') + '" data-sao="' + esc(s.ten) + '">' + esc(saoLabel(s)) + '</span>';
  }

  var CHEVRON = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* Bỏ dấu tiếng Việt để tìm "thai duong" vẫn ra "Thái Dương" */
  function boDau(str) {
    if (!str.normalize) return str.toLowerCase();
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  }

  function renderLookup() {
    var ls = tuvi.laSo; if (!ls) return;
    var T = window.TuVi;
    var cungs = ls.cung.slice().sort(function (a, b) { return T.CUNG_CHUC_NANG.indexOf(a.ten) - T.CUNG_CHUC_NANG.indexOf(b.ten); });
    var q = lookup.query;

    // Cột trái: danh sách sao
    var chinh = [], phu = [];
    cungs.forEach(function (c) {
      c.sao.forEach(function (s) {
        if (q && boDau(s.ten).indexOf(q) === -1) return;
        var item = '<li><button type="button" class="lk-link ' + (HANH_CLASS[s.hanh] || '') + '" data-sao="' + esc(s.ten) + '" data-chi="' + c.viTri + '">' + esc(saoLabel(s)) + '<small>' + esc(c.ten) + '</small></button></li>';
        (s.loai === 'chính tinh' ? chinh : phu).push(item);
      });
    });
    var none = '<li class="lk-empty">' + (q ? 'Không có sao nào khớp' : 'Không có') + '</li>';
    $('lkChinh').innerHTML = chinh.join('') || none;
    $('lkPhu').innerHTML = phu.join('') || none;

    // Cột phải: thẻ 12 cung
    var html = '';
    cungs.forEach(function (c, i) {
      var ct = c.sao.filter(function (s) { return s.loai === 'chính tinh'; });
      var pt = c.sao.filter(function (s) { return s.loai !== 'chính tinh'; });
      var isOpen = !!lookup.open[c.viTri] || (q && c.sao.some(function (s) { return s.ten.toLowerCase().indexOf(q) !== -1; }));
      var detail = '<p class="lk-cung-desc">' + esc(T.Y_NGHIA_CUNG[c.ten] || '') + '</p><dl>';
      c.sao.forEach(function (s) {
        detail += '<dt>' + saoSpan(s) + (s.hoa ? ' <i class="hoa ' + HOA_CLASS[s.hoa] + '">' + s.hoa.replace('Hóa ', '') + '</i>' : '') + '</dt>' +
          '<dd>' + esc(T.Y_NGHIA_SAO[s.ten] || '—') + (s.doSang ? ' <small>(' + esc(T.giaiThichDoSang(s.doSang)) + ')</small>' : '') + '</dd>';
      });
      detail += '</dl><div class="lk-actions"><button type="button" class="btn primary small lk-copy" data-chi="' + c.viTri + '">Copy prompt cung này</button></div>';
      html += '<div class="lk-card' + (c.ten === 'Mệnh' ? ' is-menh' : '') + '" id="lkCung' + c.viTri + '" data-chi="' + c.viTri + '">' +
        '<div class="lk-card-head"><h4>Cung ' + esc(c.ten) + (c.laCungThan ? ' <em class="av-than">Thân</em>' : '') +
        '<small>' + esc(c.canChi) + ' · đại hạn ' + c.daiHan.nhan + ' · ' + esc(c.trangSinh) + (c.tuan ? ' · Tuần' : '') + (c.triet ? ' · Triệt' : '') + '</small></h4>' +
        '</div>' +
        '<div class="lk-chinh">' + (ct.length ? ct.map(function (s) { return saoSpan(s); }).join(', ') : '<span class="lk-vcd">Vô chính diệu</span>') + '</div>' +
        '<div class="lk-phu">' + pt.map(function (s) { return saoSpan(s); }).join(', ') + '</div>' +
        '<button type="button" class="lk-toggle' + (isOpen ? ' is-open' : '') + '" data-chi="' + c.viTri + '" aria-expanded="' + isOpen + '">' + CHEVRON + (isOpen ? 'Thu gọn' : 'Xem ý nghĩa các sao') + '</button>' +
        '<div class="lk-detail"' + (isOpen ? '' : ' hidden') + '>' + detail + '</div>' +
        '</div>';
    });
    $('lkMain').innerHTML = html;
  }

  function bindLookup() {
    qsa('#tuviTabs .tab-btn').forEach(function (b) { b.addEventListener('click', function () { setTab(b.getAttribute('data-tab')); }); });
    $('lkSearch').addEventListener('input', function () { lookup.query = boDau($('lkSearch').value.trim()); renderLookup(); });
    $('tuviLookup').addEventListener('click', function (e) {
      var t = e.target;
      while (t && t !== this && !(t.getAttribute && (t.classList.contains('lk-toggle') || t.classList.contains('lk-link') || t.classList.contains('lk-copy')))) t = t.parentNode;
      if (!t || t === this) return;
      var chi = Number(t.getAttribute('data-chi'));
      if (t.classList.contains('lk-toggle')) { lookup.open[chi] = !lookup.open[chi]; renderLookup(); return; }
      if (t.classList.contains('lk-link')) {
        lookup.open[chi] = true; renderLookup();
        var card = $('lkCung' + chi); if (card) { try { card.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (err) { card.scrollIntoView(); } }
        var sao = t.getAttribute('data-sao');
        qsa('#lkCung' + chi + ' .lk-sao').forEach(function (el) { if (el.getAttribute('data-sao') === sao) el.classList.add('hit'); });
        return;
      }
      if (t.classList.contains('lk-copy')) {
        var c = tuvi.laSo.cung.filter(function (x) { return x.viTri === chi; })[0]; if (!c) return;
        copyPrompt(cungCauHoi(c), 'cung ' + c.ten);
      }
    });
  }

  /** Yêu cầu chỉ luận một cung */
  function cungCauHoi(c) {
    var fmt = function (s) { return saoLabel(s); };
    return 'Chỉ luận giải chi tiết CUNG ' + c.ten.toUpperCase() + ' (tại ' + c.chi + ', ' + c.canChi + ', đại hạn ' + c.daiHan.nhan + '). Chính tinh: ' +
      (c.sao.filter(function (s) { return s.loai === 'chính tinh'; }).map(fmt).join(', ') || 'vô chính diệu') + '. Phụ tinh: ' +
      c.sao.filter(function (s) { return s.loai !== 'chính tinh'; }).map(fmt).join(', ') + '. Có xét tam hợp và xung chiếu của cung này. Không luận các cung khác.';
  }

  /* Nhãn Tuần / Triệt đặt trên viền chung của 2 cung (lớp phủ riêng, không bị ô cắt) */
  function drawEdges() {
    var board = $('tuviBoard'), layer = board.querySelector('.av-edges');
    if (!layer || !tuvi.laSo) return;
    var br = board.getBoundingClientRect(), html = '';
    var rect = function (chi) { var el = board.querySelector('.av-cell[data-chi="' + chi + '"]'); return el ? el.getBoundingClientRect() : null; };
    [['Tuần', tuvi.laSo.tongQuan.tuan], ['Triệt', tuvi.laSo.tongQuan.triet]].forEach(function (item) {
      var a = rect(D.CHI.indexOf(item[1][0])), b = rect(D.CHI.indexOf(item[1][1]));
      if (!a || !b) return;
      var x, y;
      if (Math.abs(a.left - b.left) < 2) {            // cùng cột: viền ngang giữa 2 ô
        x = a.left - br.left + a.width * 0.74;
        y = (a.top < b.top ? a.bottom : a.top) - br.top;
      } else {                                         // cùng hàng: viền dọc giữa 2 ô
        x = (a.left < b.left ? a.right : a.left) - br.left;
        y = a.top - br.top + a.height * 0.16;
      }
      html += '<span class="av-edge" style="left:' + x + 'px;top:' + y + 'px">' + item[0] + '</span>';
    });
    layer.innerHTML = html;
  }

  /* ---------- Nối cung đang chọn với tam hợp & xung chiếu ---------- */
  function relatedChi(chi) { return [(chi + 4) % 12, (chi + 8) % 12, (chi + 6) % 12]; }

  function drawLinks() {
    var board = $('tuviBoard'), svg = board.querySelector('.av-links');
    if (!svg) return;
    var chi = tuvi.hoverChi >= 0 ? tuvi.hoverChi : tuvi.focusChi;
    var cells = qsa('.av-cell', board);
    cells.forEach(function (el) { el.classList.remove('is-focus', 'is-related'); });
    if (chi < 0) { svg.innerHTML = ''; return; }
    var byChi = {};
    cells.forEach(function (el) { byChi[el.getAttribute('data-chi')] = el; });
    var from = byChi[chi];
    if (!from) return;
    from.classList.add('is-focus');
    var br = board.getBoundingClientRect();
    if (!br.width || !br.height) { svg.innerHTML = ''; return; }   // bảng đang ẩn (tab Tra cứu)
    var rectOf = function (el) { var r = el.getBoundingClientRect(); return { x: r.left - br.left, y: r.top - br.top, w: r.width, h: r.height, cx: r.left - br.left + r.width / 2, cy: r.top - br.top + r.height / 2 }; };
    // điểm trên viền của ô `r` theo hướng từ tâm r tới điểm (tx, ty)
    var edgePoint = function (r, tx, ty) {
      var dx = tx - r.cx, dy = ty - r.cy;
      if (!dx && !dy) return [r.cx, r.cy];
      var t = Math.min(dx !== 0 ? (r.w / 2) / Math.abs(dx) : Infinity, dy !== 0 ? (r.h / 2) / Math.abs(dy) : Infinity);
      return [r.cx + dx * t, r.cy + dy * t];
    };
    // Điểm neo = chỗ ô chạm khối trung tâm (trung điểm cạnh trong với ô cạnh, góc trong với ô góc).
    // Mọi điểm neo nằm trên viền khối trung tâm (lồi) nên đường nối chỉ đi qua vùng giữa, không cắt ô khác.
    var is4x4 = Math.round(br.width / rectOf(from).w) >= 4 && Math.round(br.height / rectOf(from).h) >= 4;
    var anchor = function (r, c) {
      var pos = LAYOUT[c] || [2, 2];
      return [pos[1] === 1 ? r.x + r.w : pos[1] === 4 ? r.x : r.cx,
              pos[0] === 1 ? r.y + r.h : pos[0] === 4 ? r.y : r.cy];
    };
    var a = rectOf(from), paths = '';
    relatedChi(chi).forEach(function (rc) {
      var el = byChi[rc]; if (!el) return;
      el.classList.add('is-related');
      var b = rectOf(el);
      var p1 = is4x4 ? anchor(a, chi) : edgePoint(a, b.cx, b.cy);
      var p2 = is4x4 ? anchor(b, rc) : edgePoint(b, a.cx, a.cy);
      paths += '<line x1="' + p1[0] + '" y1="' + p1[1] + '" x2="' + p2[0] + '" y2="' + p2[1] + '"/>';
    });
    svg.setAttribute('viewBox', '0 0 ' + br.width + ' ' + br.height);
    svg.setAttribute('width', br.width); svg.setAttribute('height', br.height);
    svg.innerHTML = paths;
  }

  /** Di chuyển focus theo hình học bảng 4x4 (qua ô trung tâm thì nhảy sang phía đối diện) */
  function moveCell(dr, dc) {
    var chi = tuvi.focusChi < 0 ? 4 : tuvi.focusChi;
    var pos = LAYOUT[chi], r = pos[0], c = pos[1];
    for (var step = 0; step < 4; step++) {
      r += dr; c += dc;
      if (r < 1 || r > 4 || c < 1 || c > 4) return;
      for (var k in LAYOUT) if (LAYOUT[k][0] === r && LAYOUT[k][1] === c) {
        tuvi.focusChi = Number(k); drawLinks();
        var el = $('tuviBoard').querySelector('.av-cell[data-chi="' + k + '"]');
        if (el) { try { el.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) { /* ignore */ } }
        return;
      }
    }
  }

  function onTuViKey(e) {
    var code = e.keyCode || e.which, ch = e.key;
    var tag = e.target && e.target.tagName;
    if (tag === 'INPUT' && code !== 27 && code !== 10009 && code !== 461) return false; // đang gõ họ tên
    if (BACK_CODES.indexOf(code) !== -1 || code === 406 || ch === 'v' || ch === 'V') {
      if (!$('aiPanel').hidden) closeAi(); else hideAll();
      return true;
    }
    if (code === 403 || ch === 'p' || ch === 'P') { copyPrompt(); return true; }
    if (ch === 'c' || ch === 'C') { setTab(lookup.tab === 'laso' ? 'tracuu' : 'laso'); return true; }
    if (tag === 'SELECT') return false;
    if (!$('aiPanel').hidden && (code === 38 || code === 40)) {       // cuộn phần luận giải
      var b = $('aiBody'); b.scrollTop += (code === 40 ? 1 : -1) * b.clientHeight * 0.6; return true;
    }
    if (code === 37) { moveCell(0, -1); return true; }
    if (code === 39) { moveCell(0, 1); return true; }
    if (code === 38) { moveCell(-1, 0); return true; }
    if (code === 40) { moveCell(1, 0); return true; }
    if (code === 404 || ch === 'h' || ch === 'H') { tuvi.hourChi = (tuvi.hourChi + 1) % 12; renderTuVi(); return true; }
    if (code === 405 || ch === 'n' || ch === 'N') { tuvi.gender = tuvi.gender === 'nam' ? 'nữ' : 'nam'; renderTuVi(); return true; }
    if (ch === 'a' || ch === 'A') { tuvi.cal = tuvi.cal === 'solar' ? 'lunar' : 'solar'; renderTuVi(); return true; }
    if (code === 33 || code === 428 || ch === '[') { tuvi.viewedYear--; renderTuVi(); return true; }
    if (code === 34 || code === 427 || ch === ']') { tuvi.viewedYear++; renderTuVi(); return true; }
    return code === 13;
  }

  function bindTuVi() {
    var sel = $('tuviHour');
    sel.innerHTML = D.CHI.map(function (c, i) { return '<option value="' + i + '">' + c + ' (' + hourText(i) + ')</option>'; }).join('');
    sel.addEventListener('change', function () { tuvi.hourChi = parseInt(sel.value, 10); renderTuVi(); });
    $('tuviYear').addEventListener('change', function () { tuvi.viewedYear = parseInt($('tuviYear').value, 10); renderTuVi(); });
    $('tuviName').addEventListener('input', function () { tuvi.name = $('tuviName').value; renderTuVi(); });
    qsa('#tuviGender .seg-btn').forEach(function (b) {
      b.addEventListener('click', function () { tuvi.gender = b.getAttribute('data-gender'); renderTuVi(); });
    });
    qsa('#tuviCal .seg-btn').forEach(function (b) {
      b.addEventListener('click', function () { tuvi.cal = b.getAttribute('data-cal'); renderTuVi(); });
    });
    var board = $('tuviBoard');
    var cellOf = function (e) { var t = e.target; while (t && t !== board && !(t.classList && t.classList.contains('av-cell'))) t = t.parentNode; return t && t !== board ? t : null; };
    var touching = false;
    board.addEventListener('mousemove', function (e) {
      if (touching) return;
      var el = cellOf(e), chi = el ? Number(el.getAttribute('data-chi')) : -1;
      if (chi !== tuvi.hoverChi) { tuvi.hoverChi = chi; drawLinks(); }
    });
    board.addEventListener('mouseleave', function () { if (tuvi.hoverChi !== -1) { tuvi.hoverChi = -1; drawLinks(); } });
    board.addEventListener('touchstart', function () { touching = true; }, { passive: true });
    board.addEventListener('click', function (e) {
      var el = cellOf(e); if (!el) return;
      tuvi.focusChi = Number(el.getAttribute('data-chi')); tuvi.hoverChi = -1; drawLinks();
    });
    var relayout = function () { if (openModal === 'tuvi' && lookup.tab === 'laso') { drawLinks(); drawEdges(); } };
    window.addEventListener('resize', relayout);
    // mở/đóng bảng Copy prompt làm lá số co giãn mà cửa sổ không đổi cỡ → vẽ lại Tuần/Triệt & đường nối
    if (window.ResizeObserver) new ResizeObserver(relayout).observe(board);
    $('btnCopyPrompt').addEventListener('click', function () { copyPrompt(); });
    $('aiBody').addEventListener('click', function (e) {
      if (e.target.id === 'aiCopyAgain') copyText($('aiCopyText').value).then(function (ok) { $('aiStatus').textContent = ok ? 'Đã sao chép lại' : 'Trình duyệt chặn sao chép – hãy bôi đen ô bên dưới rồi Ctrl/Cmd+C'; });
    });
    bindLookup();
    $('aiClose').addEventListener('click', closeAi);
  }

  /* ================================================================ */
  /* 4. Copy prompt: chép prompt + lá số để tự dán vào Gemini / ChatGPT */
  /* ================================================================ */
  var API_BASE = (function () {
    try { var v = localStorage.getItem('aiApiBase'); if (v) return v.replace(/\/$/, ''); } catch (e) { /* ignore */ }
    return location.protocol === 'file:' ? 'http://localhost:8080' : '';
  })();

  function closeAi() { $('aiPanel').hidden = true; }

  /* ---------- Copy prompt: tự dán sang Gemini / ChatGPT thay vì gọi API ---------- */
  var sysPrompt = null;   // { prompt, custom } lấy từ GET /api/prompt (server/prompt.txt)

  /** Tải sẵn prompt khi mở lá số để lúc bấm Copy có thể chép ngay (Safari chỉ cho chép ngay sau khi người dùng bấm) */
  function loadSysPrompt() {
    return fetch(API_BASE + '/api/prompt', { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (j) { sysPrompt = j; return j; })
      .catch(function () { return null; });
  }

  function copyText(text) {
    var fallback = function () {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) { /* ignore */ }
      ta.remove();
      return ok;
    };
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallback(); });
    }
    return Promise.resolve(fallback());
  }

  function copyPrompt(cauHoi, label) {
    if (!tuvi.laSo) return;
    var ready = sysPrompt ? Promise.resolve(sysPrompt) : loadSysPrompt();
    ready.then(function (sp) {
      var text = window.TuViPrompt.copyText(sp ? sp.prompt : '', tuvi.laSo, cauHoi);
      $('aiPanel').hidden = false;
      $('aiBody').innerHTML =
        '<div class="ai-copy">' +
        '<p>Gồm <b>prompt luận giải</b> và <b>toàn bộ dữ liệu lá số</b>' + (label ? ' (chỉ luận ' + esc(label) + ')' : '') + ' · ' + text.length.toLocaleString('vi-VN') + ' ký tự. Mở một trang dưới đây và dán vào ô chat:</p>' +
        '<div class="ai-copy-links">' +
        '<a class="btn ghost small" href="https://gemini.google.com/app" target="_blank" rel="noopener">Gemini ↗</a>' +
        '<a class="btn ghost small" href="https://chatgpt.com/" target="_blank" rel="noopener">ChatGPT ↗</a>' +
        '<a class="btn ghost small" href="https://claude.ai/new" target="_blank" rel="noopener">Claude ↗</a>' +
        '<button type="button" class="btn primary small" id="aiCopyAgain">Sao chép lại</button></div>' +
        '<textarea id="aiCopyText" class="ai-copy-text" readonly></textarea></div>';
      $('aiCopyText').value = text;
      try { $('aiPanel').scrollIntoView({ block: 'nearest' }); } catch (e) { /* ignore */ }
      return copyText(text);
    }).then(function (ok) {
      $('aiStatus').textContent = ok ? 'Đã sao chép prompt' : 'Bấm "Sao chép lại" hoặc bôi đen ô bên dưới để chép';
    });
  }

  /* ================================================================ */
  /* Phím & nút                                                       */
  /* ================================================================ */
  function onKeyCapture(e) {
    if (!openModal) return;
    var handled = openModal === 'goto' ? onGotoKey(e) : openModal === 'mine' ? onMineKey(e) : onTuViKey(e);
    e.stopPropagation();                 // không cho lịch phía sau nhận phím
    if (handled) e.preventDefault();
  }

  function init() {
    bindGoto();
    bindMine();
    bindTuVi();
    qsa('.act-goto').forEach(function (b) { b.addEventListener('click', openGoto); });
    qsa('.act-mine').forEach(function (b) { b.addEventListener('click', openMine); });
    qsa('.act-tuvi').forEach(function (b) { b.addEventListener('click', openTuVi); });
    qsa('.modal .act-close').forEach(function (b) { b.addEventListener('click', hideAll); });
    qsa('.modal').forEach(function (m) { m.addEventListener('click', function (e) { if (e.target === m) hideAll(); }); });
    document.addEventListener('keydown', onKeyCapture, true);

    // Deep link: index.html#goto | #tuvi
    if (/(^#|&)tuvi\b/.test(location.hash)) openTuVi();
    else if (/(^#|&)goto\b/.test(location.hash)) openGoto();
    else if (/(^#|&)mine\b/.test(location.hash)) openMine();
  }

  window.Dialogs = { openGoto: openGoto, openMine: openMine, openTuVi: openTuVi, close: hideAll };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
