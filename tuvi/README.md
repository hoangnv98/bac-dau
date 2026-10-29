# tuvi-lasso – Module lập Lá số Tử Vi (Node.js / ES6)

Không phụ thuộc thư viện ngoài. Dùng thuật toán âm lịch Hồ Ngọc Đức (bản ESM trong `src/lunar.js`).

```bash
npm test      # chạy bộ test (node:test)
npm run demo  # in lá số mẫu dạng bảng + JSON
```

## Sử dụng

```js
import { lapLaSo, formatLaSo } from './tuvi/index.js';

const laSo = lapLaSo({
  day: 24, month: 10, year: 2026,  // ngày sinh
  calendar: 'solar',               // 'solar' (mặc định) | 'lunar'
  leap: false,                     // tháng nhuận (chỉ khi calendar = 'lunar')
  hour: 7,                         // giờ sinh 0-23  (hoặc hourChi: 'Thìn' | 4)
  gender: 'nam'                    // 'nam' | 'nữ' | 'male' | 'female'
});

console.log(formatLaSo(laSo));     // bảng 4x4 trên console
console.log(JSON.stringify(laSo)); // cấu trúc JSON
```

### Tuỳ chọn

| Tuỳ chọn | Giá trị | Ý nghĩa |
|----------|---------|---------|
| `leapMonthRule` | `'half'` (mặc định) / `'same'` | Sinh tháng nhuận: `half` = ngày 1–15 tính tháng đó, 16–30 tính tháng kế; `same` = tính như tháng chính |
| `hoaLinhRule` | `'vn'` (mặc định) / `'cn'` | `vn`: Dương Nam/Âm Nữ Hỏa thuận – Linh nghịch, Âm Nam/Dương Nữ ngược lại; `cn`: cả hai an thuận theo giờ |

## Cấu trúc JSON trả về

```jsonc
{
  "input": { ... },                       // input đã chuẩn hoá
  "duongLich": { "day", "month", "year" },
  "amLich": {
    "day", "month", "year", "leap", "monthLength", "thangAnSao",
    "canChi": { "nam": "Bính Ngọ", "thang": "Mậu Tuất", "ngay": "Tân Mùi", "gio": "Nhâm Thìn" }
  },
  "tongQuan": {
    "gioiTinh": "Nam", "amDuong": "Dương Nam",
    "banMenh": "Thiên Hà Thủy", "menhNguHanh": "Thủy",
    "cuc": { "ten": "Kim Tứ Cục", "hanh": "Kim", "so": 4, "canChiCungMenh": "Giáp Ngọ", "napAm": "Sa Trung Kim" },
    "cungMenh": "Ngọ", "cungThan": "Dần", "thanCuCung": "Tài Bạch",
    "tuViTai": "Thìn", "thienPhuTai": "Tý",
    "daiHan": { "chieu": "thuận", "khoiTuoi": 4 }
  },
  "tuHoa": { "Hóa Lộc": "Thiên Đồng", "Hóa Quyền": "Thiên Cơ", "Hóa Khoa": "Văn Xương", "Hóa Kỵ": "Liêm Trinh" },
  "cung": [                               // 12 cung theo thứ tự Dần, Mão, ..., Tý, Sửu
    {
      "viTri": 2, "chi": "Dần", "canChi": "Canh Dần",
      "ten": "Tài Bạch", "laCungThan": true,
      "daiHan": { "thuTu": 9, "tuoiBatDau": 84, "tuoiKetThuc": 93, "nhan": "84–93" },
      "sao": [
        { "ten": "Tham Lang", "loai": "chính tinh", "hanh": "Thủy", "amDuong": "Âm" },
        { "ten": "Hữu Bật", "loai": "phụ tinh", "hanh": "Thổ" }
        // sao có Tứ Hóa sẽ kèm "hoa": "Hóa Lộc" | "Hóa Quyền" | "Hóa Khoa" | "Hóa Kỵ"
      ]
    }
    // ... 11 cung còn lại
  ]
}
```

### Trường bổ sung (bản đầy đủ)

- `input.viewedYear` (năm xem, mặc định năm hiện tại) và `input.name`.
- Mỗi sao: `cat` (true = cát tinh, false = hung tinh), `doSang` (`M` Miếu, `V` Vượng, `Đ` Đắc, `B` Bình hòa, `H` Hãm – chỉ với sao có xét), `loai` thêm giá trị `'tràng sinh'`.
- Mỗi cung: `tieuHan` (chi năm có tiểu hạn tại cung), `nguyetHan` (tháng 1–12 của năm xem), `trangSinh`, `tuan`, `triet`.
- `tongQuan`: `hoTen`, `amDuongThuanLy`, `cucMenh` (Cục sinh/khắc/hòa Bản Mệnh), `menhChu`, `thanChu`, `namXem {nam, canChi, tuoi}`, `tuan`, `triet`.
- `src/stars.js` chứa toàn bộ bảng an sao mở rộng và bảng độ sáng `DO_SANG` (12 ký tự Tý→Hợi) – chỉnh tại đây nếu theo trường phái khác.

## Quy tắc an sao đã cài đặt

- **Can Chi**: năm `(y+6)%10, (y+8)%12`; tháng theo Ngũ hổ độn; ngày theo số Julius; giờ theo Ngũ thử độn.
- **Cung Mệnh**: từ Dần đếm thuận tới tháng sinh, đếm nghịch tới giờ sinh. **Cung Thân**: đếm thuận cả hai.
- **12 cung chức năng**: thuận từ Mệnh → Phụ Mẫu → Phúc Đức → Điền Trạch → Quan Lộc → Nô Bộc → Thiên Di → Tật Ách → Tài Bạch → Tử Tức → Phu Thê → Huynh Đệ.
- **Cục**: nạp âm của can–chi cung Mệnh (Thủy 2, Mộc 3, Kim 4, Thổ 5, Hỏa 6).
- **Tử Vi**: `q = ⌈ngày / cục⌉`, `r = q·cục − ngày`; từ Dần đếm `q` cung, dư chẵn tiến `r`, dư lẻ lùi `r`.
- **Chính tinh**: Tử Vi → nghịch: Thiên Cơ (−1), Thái Dương (−3), Vũ Khúc (−4), Thiên Đồng (−5), Liêm Trinh (−8). Thiên Phủ đối xứng Tử Vi qua trục Dần–Thân → thuận: Thái Âm (+1), Tham Lang (+2), Cự Môn (+3), Thiên Tướng (+4), Thiên Lương (+5), Thất Sát (+6), Phá Quân (+10).
- **Phụ tinh**: Tả Phù (Thìn thuận theo tháng), Hữu Bật (Tuất nghịch theo tháng), Văn Xương (Tuất nghịch theo giờ), Văn Khúc (Thìn thuận theo giờ), Lộc Tồn theo can năm, Kình Dương (Lộc+1), Đà La (Lộc−1), Địa Kiếp (Hợi thuận theo giờ), Địa Không (Hợi nghịch theo giờ), Hỏa Tinh / Linh Tinh khởi theo tam hợp chi năm.
- **Tứ Hóa**: bảng theo can năm trong `src/constants.js` (`TU_HOA_THEO_CAN`), sửa tại đó nếu theo trường phái khác (năm Canh, Nhâm có dị bản).
- **Đại hạn**: Dương Nam / Âm Nữ thuận, Âm Nam / Dương Nữ nghịch; khởi tại Mệnh bằng số Cục, mỗi cung +10.
- **Tiểu hạn**: khởi Thìn (Dần Ngọ Tuất), Tuất (Thân Tý Thìn), Mùi (Tỵ Dậu Sửu), Sửu (Hợi Mão Mùi); Nam thuận, Nữ nghịch.
- **Nguyệt hạn**: từ cung tiểu hạn của năm xem đếm nghịch tới tháng sinh rồi thuận tới giờ sinh = tháng 1, các tháng sau thuận.
- **Vòng Tràng Sinh**: Thủy/Thổ khởi Thân, Mộc khởi Hợi, Kim khởi Tỵ, Hỏa khởi Dần; Dương Nam Âm Nữ thuận.
- **Vòng Lộc Tồn**: Bác Sĩ tại Lộc Tồn, Dương Nam Âm Nữ thuận. **Vòng Thái Tuế**: Thái Tuế tại chi năm, luôn thuận.
- **Tuần**: hai chi sau tuần Giáp của năm sinh. **Triệt**: Giáp Kỷ Thân Dậu, Ất Canh Ngọ Mùi, Bính Tân Thìn Tỵ, Đinh Nhâm Dần Mão, Mậu Quý Tý Sửu.
- **Mệnh chủ** theo chi cung Mệnh, **Thân chủ** theo chi cung Thân.

## Cấu trúc thư mục

```
tuvi/
├── index.js            # entry point (export lapLaSo, formatLaSo, ...)
├── src/
│   ├── lunar.js        # âm lịch Hồ Ngọc Đức (ESM)
│   ├── constants.js    # Can Chi, Nạp âm, Cục, sao, Tứ Hóa, Lộc Tồn, Hỏa Linh
│   ├── canchi.js       # tiện ích Can Chi
│   ├── stars.js        # phụ tinh mở rộng, vòng sao, Tuần Triệt, độ sáng, tiểu/nguyệt hạn
│   ├── meanings.js     # ý nghĩa 109 sao & 12 cung (tra cứu)
│   ├── chart.js        # lập lá số
│   └── format.js       # in bảng 4x4
├── examples/demo.js
└── test/chart.test.js
```
