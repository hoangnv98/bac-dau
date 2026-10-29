/*
 * Thuật toán Âm lịch Việt Nam – Hồ Ngọc Đức (2004)
 * Nguồn: https://www.informatik.uni-leipzig.de/~duc/amlich/
 * Múi giờ Việt Nam: UTC+7
 */
(function (global) {
  'use strict';

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

  global.Lunar = {
    TIMEZONE: TIMEZONE,
    jdFromDate: jdFromDate,
    jdToDate: jdToDate,
    getNewMoonDay: getNewMoonDay,
    getSunLongitude: getSunLongitude,
    getSunLongitude24: getSunLongitude24,
    solar2Lunar: solar2Lunar,
    lunar2Solar: lunar2Solar
  };
})(typeof window !== 'undefined' ? window : globalThis);
