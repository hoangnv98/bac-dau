/* Bắc Đẩu (Lịch vạn niên) – logic giao diện & điều khiển TV */
(function () {
  'use strict';

  var D = window.CalData;
  var L = window.Lunar;

  function $(id) { return document.getElementById(id); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- Mã phím remote (Tizen / webOS / bàn phím) ---------- */
  var KEY = {
    LEFT: [37], RIGHT: [39], UP: [38], DOWN: [40],
    OK: [13],
    PREV_MONTH: [33, 428],         // PageUp, ChannelDown
    NEXT_MONTH: [34, 427],         // PageDown, ChannelUp
    TODAY: [36, 405, 10009, 461, 27], // Home, Yellow, Back(Tizen), Back(webOS), Esc
    GOTO: [404],                      // Green
    TUVI: [406],                      // Blue
    MINE: [403]                       // Red
  };
  var KEY_CHAR_GOTO = ['g', 'G'];
  var KEY_CHAR_TUVI = ['v', 'V'];
  var KEY_CHAR_MINE = ['n', 'N'];
  var KEY_CHAR_PREV = ['[', '-', ','];
  var KEY_CHAR_NEXT = [']', '=', '.'];
  var KEY_CHAR_TODAY = ['t', 'T', 'h', 'H'];

  /* ---------- Trạng thái ---------- */
  var state = {
    todayJd: 0,
    focusJd: 0,     // ô đang di chuyển bằng D-pad
    selectedJd: 0,  // ô đã bấm OK
    viewMonth: 1,
    viewYear: 2000
  };

  /* ---------- Thông tin ngày (có cache) ---------- */
  var cache = {};

  function lunarMonthName(lu) {
    return D.LUNAR_MONTH_NAMES[lu.month - 1] + (lu.leap ? ' nhuận' : '');
  }

  function getEvents(solar, lu) {
    var ev = [], i, h;
    for (i = 0; i < D.SOLAR_HOLIDAYS.length; i++) {
      h = D.SOLAR_HOLIDAYS[i];
      if (h.d === solar[0] && h.m === solar[1]) ev.push({ name: h.name, type: 'solar', major: !!h.major });
    }
    if (!lu.leap) {
      for (i = 0; i < D.LUNAR_HOLIDAYS.length; i++) {
        h = D.LUNAR_HOLIDAYS[i];
        if (h.d === lu.day && h.m === lu.month) ev.push({ name: h.name, type: 'lunar', major: !!h.major });
      }
      if (lu.month === 12 && lu.day === lu.monthLength) ev.push({ name: 'Tất niên · Giao thừa', type: 'lunar', major: true });
    }
    addMyEvents(ev, solar, lu);
    var hasLunar = ev.some(function (e) { return e.type === 'lunar'; });
    if (!hasLunar) {
      if (lu.day === 1) ev.push({ name: 'Mùng 1 tháng ' + lunarMonthName(lu), type: 'moon' });
      if (lu.day === 15) ev.push({ name: 'Rằm tháng ' + lunarMonthName(lu), type: 'moon' });
    }
    return ev;
  }

  function isLeapYear(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }

  /* Ngày của tôi (js/myevents.js). Ngày 29/2 rơi vào 28/2 năm thường; ngày âm 30 rơi vào 29 tháng thiếu. */
  function addMyEvents(ev, solar, lu) {
    if (!window.MyEvents) return;
    window.MyEvents.list().forEach(function (it) {
      var hit, year;
      if (it.type === 'solar') {
        hit = it.m === solar[1] && (it.d === solar[0] ||
          (it.d === 29 && it.m === 2 && solar[0] === 28 && !isLeapYear(solar[2])));
        year = solar[2];
      } else {
        hit = !lu.leap && it.m === lu.month && (it.d === lu.day ||
          (it.d === 30 && lu.monthLength === 29 && lu.day === 29));
        year = lu.year;
      }
      if (!hit) return;
      var n = it.y ? year - it.y : 0;
      if (n < 0) return;                      // chưa tới năm gốc
      ev.push({ name: it.name + (n > 0 ? ' · ' + n + ' năm' : ''), type: 'mine', id: it.id });
    });
  }

  function dayInfo(jd) {
    if (cache[jd]) return cache[jd];
    var solar = L.jdToDate(jd);
    var lu = L.solar2Lunar(solar[0], solar[1], solar[2]);

    var dayCan = (jd + 9) % 10, dayChi = (jd + 1) % 12;
    var monthCan = (lu.year * 12 + lu.month + 3) % 10, monthChi = (lu.month + 1) % 12;
    var yearCan = (lu.year + 6) % 10, yearChi = (lu.year + 8) % 12;

    var tk = L.getSunLongitude24(jd, L.TIMEZONE);                 // 0..23, 0 = Xuân phân
    var tkMonthChi = (Math.floor(((tk - 21 + 24) % 24) / 2) + 2) % 12; // tháng theo tiết khí (Lập xuân -> Dần)
    var truc = D.TRUC[(dayChi - tkMonthChi + 12) % 12];

    var than = D.THAN[(dayChi - ((lu.month - 1) % 6) * 2 + 12) % 12];
    var sao = D.SAO[(jd + 11) % 28];
    var napAm = D.NAP_AM[Math.floor(((jd + 49) % 60) / 2)];

    var pattern = D.GIO_HOANG_DAO[dayChi % 6], gio = [], i;
    for (i = 0; i < 12; i++) {
      if (pattern.charAt(i) === '1') gio.push({ chi: D.CHI[i], range: D.HOUR_RANGE[i] });
    }

    var info = {
      jd: jd,
      d: solar[0], m: solar[1], y: solar[2],
      weekday: (jd + 1) % 7,          // 0 = Chủ Nhật
      lunar: lu,
      canChiDay: D.CAN[dayCan] + ' ' + D.CHI[dayChi],
      canChiMonth: D.CAN[monthCan] + ' ' + D.CHI[monthChi],
      canChiYear: D.CAN[yearCan] + ' ' + D.CHI[yearChi],
      tietKhi: D.TIET_KHI[tk],
      truc: truc,
      than: than,
      sao: sao,
      napAm: napAm,
      gioHoangDao: gio,
      events: getEvents(solar, lu)
    };
    cache[jd] = info;
    return info;
  }

  function todayJd() {
    var now = new Date();
    return L.jdFromDate(now.getDate(), now.getMonth() + 1, now.getFullYear());
  }

  /* ---------- Render cột trái ---------- */
  function renderLeft() {
    var info = dayInfo(state.focusJd);
    var lu = info.lunar;

    $('eyebrow').textContent = info.jd === state.todayJd ? 'Hôm nay' : 'Đang xem';
    $('solarDay').textContent = info.d;
    $('weekday').textContent = D.WEEKDAYS[info.weekday];
    $('solarMY').textContent = 'Tháng ' + info.m + ', ' + info.y;

    $('lunarDay').textContent = lu.day;
    $('lunarMonth').textContent = 'Tháng ' + lunarMonthName(lu) + ' (' + (lu.monthLength === 30 ? 'đủ' : 'thiếu') + ')';
    $('lunarYear').textContent = 'Năm ' + info.canChiYear;

    var tags = info.events.map(function (e) {
      return '<span class="tag ' + e.type + '">' + esc(e.name) + '</span>';
    }).join('');
    $('dayTags').innerHTML = tags;
    $('dayTags').style.display = tags ? '' : 'none';

    $('canChi').innerHTML = 'Ngày <b>' + esc(info.canChiDay) + '</b><span class="sep">·</span>Tháng <b>' + esc(info.canChiMonth) + '</b><span class="sep">·</span>Năm <b>' + esc(info.canChiYear) + '</b>';
    $('hoangDao').innerHTML = 'Ngày <span class="' + (info.than.good ? 'good' : 'bad') + '">' + (info.than.good ? 'hoàng đạo' : 'hắc đạo') + '</span><span class="sep">·</span>' + esc(info.than.name) + '<span class="sep">|</span>Tiết <b>' + esc(info.tietKhi) + '</b>';
    $('trucSao').innerHTML = 'Trực <b>' + esc(info.truc) + '</b><span class="sep">·</span>Sao <b>' + esc(info.sao) + '</b><span class="sep">·</span>' + esc(info.napAm);

    $('gioHD').innerHTML = info.gioHoangDao.map(function (g) {
      return '<div class="gio"><b>' + g.chi + '</b><span>' + g.range + '</span></div>';
    }).join('');

    renderUpcoming(info.jd);
  }

  function renderUpcoming(fromJd) {
    var items = [], i, info, j, e, left;
    for (i = 1; i <= 400 && items.length < 5; i++) {
      info = dayInfo(fromJd + i);
      for (j = 0; j < info.events.length && items.length < 5; j++) {
        e = info.events[j];
        if (e.type === 'moon') continue;
        items.push({ d: info.d, m: info.m, name: e.name, days: i, type: e.type });
      }
    }
    $('upcoming').innerHTML = items.map(function (it) {
      left = it.days === 1 ? 'ngày mai' : 'còn ' + it.days + ' ngày';
      return '<li><span class="date">' + pad2(it.d) + '/' + pad2(it.m) + '</span><span class="name">' + esc(it.name) + '</span><span class="left' + (it.days <= 7 ? ' soon' : '') + '">' + left + '</span></li>';
    }).join('');
  }

  /* ---------- Render cột phải ---------- */
  /* Sự kiện hiển thị trong ô: lễ lớn > ngày của tôi > lễ thường > mùng 1/rằm */
  function evRank(e) { return e.major ? 3 : e.type === 'mine' ? 2 : e.type === 'moon' ? 0 : 1; }

  function renderGrid() {
    var first = L.jdFromDate(1, state.viewMonth, state.viewYear);
    var offset = ((first + 1) % 7 + 6) % 7;   // số ô trống trước ngày 1 (tuần bắt đầu Thứ Hai)
    var start = first - offset;
    var html = '', i, jd, info, lu, cls, lunarTxt, lunarCls, evHtml, mainEv;

    for (i = 0; i < 42; i++) {
      jd = start + i;
      info = dayInfo(jd);
      lu = info.lunar;
      cls = 'cell';
      if (info.m !== state.viewMonth) cls += ' other';
      if (info.weekday === 0) cls += ' sun';
      if (info.weekday === 6) cls += ' sat';
      if (jd === state.todayJd) cls += ' today';
      if (jd === state.selectedJd) cls += ' selected';
      if (jd === state.focusJd) cls += ' focus';

      mainEv = null;
      info.events.forEach(function (e) {
        if (!mainEv || evRank(e) > evRank(mainEv)) mainEv = e;
      });
      if (mainEv && mainEv.major) cls += ' holiday';

      lunarCls = 'lunar';
      if (lu.day === 1) { lunarTxt = '1/' + lu.month + (lu.leap ? 'n' : ''); lunarCls += ' first'; }
      else { lunarTxt = lu.day; if (lu.day === 15) lunarCls += ' full'; }

      evHtml = mainEv ? '<div class="ev ' + mainEv.type + '-ev">' + esc(mainEv.name) + '</div>' : '<div class="ev"></div>';

      html += '<div class="' + cls + '" data-jd="' + jd + '">' +
        '<div class="cell-top"><span class="solar">' + info.d + '</span>' + (info.than.good ? '<span class="hd" title="Ngày hoàng đạo"></span>' : '') + '</div>' +
        evHtml +
        '<div class="' + lunarCls + '">' + lunarTxt + '</div>' +
        '</div>';
    }
    $('grid').innerHTML = html;
    $('monthTitle').textContent = 'Tháng ' + state.viewMonth + ' · ' + state.viewYear;
    renderMonthEvents();
  }

  function renderMonthEvents() {
    var first = L.jdFromDate(1, state.viewMonth, state.viewYear);
    var html = '', jd, info, j, e;
    for (jd = first; jd < first + 31; jd++) {
      info = dayInfo(jd);
      if (info.m !== state.viewMonth) break;
      for (j = 0; j < info.events.length; j++) {
        e = info.events[j];
        html += '<span class="' + e.type + '-ev"><b>' + pad2(info.d) + '/' + pad2(info.m) + '</b>' + esc(e.name) + '</span>';
      }
    }
    $('monthEvents').innerHTML = (html || '<span class="empty">Không có sự kiện nổi bật trong tháng.</span>') +
      '<span class="legend-hd"><i class="hd"></i>Ngày hoàng đạo</span>';
  }

  function renderAll() {
    renderLeft();
    renderGrid();
  }

  /* ---------- Điều hướng ---------- */
  function setFocus(jd, select) {
    state.focusJd = jd;
    if (select) state.selectedJd = jd;
    var d = L.jdToDate(jd);
    state.viewMonth = d[1];
    state.viewYear = d[2];
    renderAll();
  }

  function moveFocus(delta) { setFocus(state.focusJd + delta, false); }

  function shiftMonth(delta) {
    var d = L.jdToDate(state.focusJd);
    var m = d[1] + delta, y = d[2];
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    var lastDay = L.jdFromDate(1, m === 12 ? 1 : m + 1, m === 12 ? y + 1 : y) - L.jdFromDate(1, m, y);
    setFocus(L.jdFromDate(Math.min(d[0], lastDay), m, y), false);
  }

  function goToday() {
    state.todayJd = todayJd();
    setFocus(state.todayJd, true);
  }

  function has(list, code) { return list.indexOf(code) !== -1; }

  function onKey(e) {
    var code = e.keyCode || e.which, ch = e.key;
    var handled = true;
    if (has(KEY.LEFT, code)) moveFocus(-1);
    else if (has(KEY.RIGHT, code)) moveFocus(1);
    else if (has(KEY.UP, code)) moveFocus(-7);
    else if (has(KEY.DOWN, code)) moveFocus(7);
    else if (has(KEY.OK, code)) setFocus(state.focusJd, true);
    else if (has(KEY.PREV_MONTH, code) || KEY_CHAR_PREV.indexOf(ch) !== -1) shiftMonth(-1);
    else if (has(KEY.NEXT_MONTH, code) || KEY_CHAR_NEXT.indexOf(ch) !== -1) shiftMonth(1);
    else if (has(KEY.TODAY, code) || KEY_CHAR_TODAY.indexOf(ch) !== -1) goToday();
    else if ((has(KEY.GOTO, code) || KEY_CHAR_GOTO.indexOf(ch) !== -1) && window.Dialogs) window.Dialogs.openGoto();
    else if ((has(KEY.TUVI, code) || KEY_CHAR_TUVI.indexOf(ch) !== -1) && window.Dialogs) window.Dialogs.openTuVi();
    else if ((has(KEY.MINE, code) || KEY_CHAR_MINE.indexOf(ch) !== -1) && window.Dialogs) window.Dialogs.openMine();
    else handled = false;
    if (handled) e.preventDefault();
  }

  function onGridClick(e) {
    var el = e.target;
    while (el && el !== this && !el.getAttribute('data-jd')) el = el.parentNode;
    if (el && el.getAttribute && el.getAttribute('data-jd')) setFocus(parseInt(el.getAttribute('data-jd'), 10), true);
  }

  /* Đăng ký phím đặc thù Samsung Tizen (nếu có) */
  function registerTvKeys() {
    try {
      if (window.tizen && tizen.tvinputdevice) {
        ['ChannelUp', 'ChannelDown', 'ColorF0Red', 'ColorF1Green', 'ColorF2Yellow', 'ColorF3Blue'].forEach(function (k) {
          try { tizen.tvinputdevice.registerKey(k); } catch (err) { /* ignore */ }
        });
      }
    } catch (err) { /* không phải Tizen */ }
  }

  /* ---------- Đồng hồ & tự cập nhật qua nửa đêm ---------- */
  function tick() {
    var now = new Date();
    $('clock').textContent = pad2(now.getHours()) + ':' + pad2(now.getMinutes());
    var tj = todayJd();
    if (tj !== state.todayJd) {
      var wasOnToday = state.focusJd === state.todayJd;
      state.todayJd = tj;
      if (wasOnToday) setFocus(tj, true); else renderAll();
    }
  }

  /* ---------- Khởi động ---------- */
  function init() {
    registerTvKeys();
    state.todayJd = todayJd();
    state.focusJd = state.selectedJd = state.todayJd;
    // Deep link: index.html#d=2026-10-24 (có thể kết hợp: #d=2026-10-24&tuvi)
    var m = /d=(\d{4})-(\d{1,2})-(\d{1,2})/.exec(location.hash);
    if (m) state.focusJd = state.selectedJd = L.jdFromDate(parseInt(m[3], 10), parseInt(m[2], 10), parseInt(m[1], 10));
    var d = L.jdToDate(state.focusJd);
    state.viewMonth = d[1];
    state.viewYear = d[2];
    renderAll();
    tick();
    setInterval(tick, 15000);
    document.addEventListener('keydown', onKey);
    $('grid').addEventListener('click', onGridClick);
    bindTouch();
  }

  /* ---------- Cảm ứng (điện thoại): nút & vuốt ngang đổi tháng ---------- */
  function bindTouch() {
    $('btnPrev').addEventListener('click', function () { shiftMonth(-1); });
    $('btnNext').addEventListener('click', function () { shiftMonth(1); });
    $('btnToday').addEventListener('click', goToday);
    $('navPrev').addEventListener('click', function () { shiftMonth(-1); });
    $('navNext').addEventListener('click', function () { shiftMonth(1); });
    $('navToday').addEventListener('click', goToday);

    var grid = $('grid'), startX = 0, startY = 0, tracking = false;
    grid.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
    }, { passive: true });
    grid.addEventListener('touchend', function (e) {
      if (!tracking) return;
      tracking = false;
      var t = e.changedTouches[0];
      var dx = t.clientX - startX, dy = t.clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) shiftMonth(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* API cho các hộp thoại (js/dialogs.js) */
  window.CalendarApp = {
    getFocusJd: function () { return state.focusJd; },
    getTodayJd: function () { return state.todayJd; },
    dayInfo: dayInfo,
    setFocus: setFocus,
    shiftMonth: shiftMonth,
    goToday: goToday,
    lunarMonthName: lunarMonthName,
    refresh: function () { cache = {}; renderAll(); }   // gọi sau khi sửa Ngày của tôi
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
