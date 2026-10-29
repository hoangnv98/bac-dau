/* Ngày của tôi: sinh nhật, ngày giỗ, kỷ niệm... do người dùng tự thêm, lưu trong localStorage của trình duyệt */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'customEvents';
  var items = load();

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.map(normalize).filter(Boolean) : [];
    } catch (e) { return []; }
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); return true; } catch (e) { return false; }
  }

  /** Chuẩn hóa một mục; trả về null nếu không hợp lệ.
   *  { id, name, type: 'solar'|'lunar', d, m, y? (năm gốc, để tính "tròn N năm") } */
  function normalize(o) {
    if (!o || typeof o !== 'object') return null;
    var name = String(o.name || '').trim().slice(0, 80);
    var type = o.type === 'lunar' ? 'lunar' : 'solar';
    var d = parseInt(o.d, 10), m = parseInt(o.m, 10), y = parseInt(o.y, 10);
    if (!name || !(m >= 1 && m <= 12) || !(d >= 1 && d <= (type === 'lunar' ? 30 : 31))) return null;
    var it = { id: String(o.id || newId()), name: name, type: type, d: d, m: m };
    if (y >= 1800 && y <= 2199) it.y = y;
    return it;
  }

  function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  function list() { return items.slice(); }

  function get(id) {
    for (var i = 0; i < items.length; i++) if (items[i].id === id) return items[i];
    return null;
  }

  /** Thêm mới (không có id) hoặc cập nhật (có id). Trả về mục đã lưu hoặc null. */
  function put(o) {
    var it = normalize(o);
    if (!it) return null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === it.id) { items[i] = it; save(); return it; }
    }
    items.push(it);
    save();
    return it;
  }

  function remove(id) {
    items = items.filter(function (it) { return it.id !== id; });
    save();
  }

  function exportJson() { return JSON.stringify({ app: 'van-nien', version: 1, events: items }, null, 2); }

  /** Nhập từ JSON (gộp, bỏ trùng id). Trả về số mục đã nhập. */
  function importJson(text) {
    var data = JSON.parse(text);
    var arr = Array.isArray(data) ? data : (data && data.events) || [];
    var n = 0;
    arr.forEach(function (o) {
      var it = normalize(o);
      if (!it) return;
      var found = false;
      for (var i = 0; i < items.length; i++) if (items[i].id === it.id) { items[i] = it; found = true; }
      if (!found) items.push(it);
      n++;
    });
    save();
    return n;
  }

  global.MyEvents = { list: list, get: get, put: put, remove: remove, exportJson: exportJson, importJson: importJson };
})(window);
