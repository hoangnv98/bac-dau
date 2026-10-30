# Bắc Đẩu · Tử vi · Lịch vạn niên

![Bắc Đẩu](img/logo.png)

Ứng dụng web một trang (SPA) hiển thị Lịch vạn niên và lá số Tử Vi, tối ưu cho màn hình ngang 16:9 / Smart TV, chạy cả trên điện thoại.

## Nhận diện

| Màu | Mã | Dùng cho |
|-----|----|----------|
| Chàm | `#2A2E86` | Màu chính: logo, nút, chữ trên nền sáng; nền app là các sắc Chàm đậm (`#14173D`, `#1B1E52`) |
| Hổ phách | `#BF7310` | Ngôi sao, điểm nhấn (trên nền tối dùng bản sáng `#F2A93B`) |
| Sương | `#EEF0FA` | Nền sáng, chữ trên nền tối |

- Font: **Unbounded** cho tên, tiêu đề và số lớn; **Be Vietnam Pro** cho nội dung (Google Fonts, đều có tiếng Việt).
- `img/`: `mark.svg` (chòm sao, nền sáng), `mark-light.svg` (nền tối), `icon.svg` / `icon-192.png` / `icon-512.png` / `apple-touch-icon.png` (icon app),
  `icon-small.svg` (favicon, chỉ ngôi sao), `logo.png` / `logo-dark.png` (logo đầy đủ kèm chữ).

## Chạy

Mở trực tiếp `index.html` bằng trình duyệt, hoặc phục vụ qua HTTP:

```bash
npx serve .          # hoặc: python3 -m http.server 8080
```

Không cần build. Tailwind CSS được nạp qua CDN; toàn bộ layout cốt lõi nằm trong `css/style.css` nên vẫn hiển thị đúng khi TV không có mạng.

## Cấu trúc

| File | Vai trò |
|------|---------|
| `index.html` | Khung giao diện 2 cột (35% / 65%) |
| `manifest.webmanifest` | Tên, màu, icon khi cài lên màn hình chính điện thoại |
| `css/style.css` | Theme Chàm theo bảng màu Bắc Đẩu, tỉ lệ chữ theo chiều cao màn hình (`1rem = 100vh/54`) |
| `js/lunar.js` | Thuật toán Âm lịch Việt Nam của Hồ Ngọc Đức (JDN, sóc, tiết khí, nhuận) |
| `js/data.js` | Can Chi, Tiết khí, 12 thần Hoàng/Hắc đạo, Trực, Nhị thập bát tú, Nạp âm, Ngày lễ |
| `js/myevents.js` | "Ngày của tôi": sinh nhật, ngày giỗ, kỷ niệm do người dùng thêm, lưu ở `localStorage` (key `customEvents`) |
| `js/app.js` | Render giao diện, điều khiển D-pad / bàn phím / cảm ứng |
| `js/dialogs.js` | Hộp thoại "Đi tới ngày" (dương/âm lịch), "Ngày của tôi" và màn hình "Lá số Tử Vi" |
| `js/tuvi.bundle.js` | Bản đóng gói của module Tử Vi cho trình duyệt (sinh bởi `npm run build:tuvi`) |
| `js/tuvi-prompt.js` | Ghép prompt luận giải (mô tả lá số bằng văn bản) – dùng chung cho server và nút "Copy prompt" |
| `server/server.js` | Server tĩnh + `GET /api/prompt` trả `server/prompt.txt` nếu có (thay prompt mặc định) |
| `tuvi/` | Module Node.js lập Lá số Tử Vi (xem `tuvi/README.md`) |

## Responsive

- Màn hình ≥ 900px (TV, desktop): bố cục 2 cột cố định, không cuộn, cỡ chữ theo chiều cao màn hình.
- Màn hình < 900px (điện thoại): xếp dọc, lịch tháng ở trên, chi tiết ngày ở dưới, cuộn dọc; có thanh nút
  *Tháng trước / Hôm nay / Tháng sau / Đi tới ngày / Ngày của tôi / Lá số Tử Vi*; vuốt ngang trên lưới để đổi tháng.

## Điều khiển

| Phím / Remote | Chức năng |
|---------------|-----------|
| ← → ↑ ↓ (D-pad) | Di chuyển giữa các ngày (tự chuyển tháng khi vượt biên) |
| Enter / OK | Chọn (ghim) ngày |
| PageUp / PageDown, `[` / `]`, CH− / CH+ | Chuyển tháng |
| Home, `T`, nút Vàng, Back, Esc | Về hôm nay |
| `G`, nút Xanh lá | Mở "Đi tới ngày": ← → chọn ô, ↑ ↓ đổi giá trị (hoặc gõ số), OK đi tới; hỗ trợ cả ngày âm lịch (có tháng nhuận) |
| `N`, nút Đỏ | Mở "Ngày của tôi": thêm/sửa/xóa sinh nhật, ngày giỗ… theo dương hoặc âm lịch; xuất/nhập file JSON để sao lưu |
| `V`, nút Xanh dương | Mở "Lá số Tử Vi" cho ngày đang chọn. Trong lá số: ← ↑ → ↓ chọn cung (nối tam hợp/xung chiếu), Xanh lá / `H` đổi giờ sinh, Vàng / `N` đổi giới tính, `A` đổi âm/dương lịch, CH± hoặc `[` `]` đổi năm xem, Đỏ / `P` copy prompt, Back đóng |
| Chuột / chạm | Click ô ngày, nút công cụ, vuốt ngang đổi tháng (điện thoại) |

## Deep link

- `index.html#d=2026-10-24` mở sẵn ngày 24/10/2026
- `index.html#goto` mở hộp thoại Đi tới ngày; `index.html#mine` mở Ngày của tôi; `index.html#d=2026-10-24&tuvi` mở lá số Tử Vi của ngày đó
- Tham số thêm cho lá số: `cal=lunar` (coi ngày là âm lịch), `h=9` (chi giờ 0–11), `g=nam|nữ`, `y=2026` (năm xem), `name=Tên`, `focus=9` (cung được chọn), `tab=tracuu`, `ai` (mở sẵn bảng Copy prompt).
  Ví dụ: `index.html#d=1998-12-28&tuvi&cal=lunar&h=9&g=nam&y=2026`

## Lá số Tử Vi (đủ bộ sao, bố cục kiểu aituvi)

- 14 chính tinh, Tứ Hóa, lục cát, lục sát, Khôi Việt, Thiên Mã, Đào Hồng Hỷ, Long Phượng, Tam Thai Bát Tọa, Ân Quang Thiên Quý,
  Thai Phụ Phong Cáo, Thiên Hình Riêu Y, Khốc Hư, Cô Quả, Kiếp Sát, Phá Toái, Hoa Cái, Thiên La Địa Võng, Thiên Thương Thiên Sứ,
  Thiên Đức Nguyệt Đức, Thiên Quan Thiên Phúc, Thiên Tài Thiên Thọ, Thiên Trù, Lưu Hà, Văn Tinh, Quốc Ấn, Đường Phù, Đẩu Quân,
  vòng Thái Tuế (12), vòng Lộc Tồn (12), vòng Tràng Sinh (12), Tuần, Triệt – tổng cộng 109 sao.
- Độ sáng Miếu / Vượng / Đắc / Bình hòa / Hãm; màu sao theo ngũ hành (Kim xám, Mộc xanh, Thủy đen, Hỏa đỏ, Thổ cam).
- Mệnh chủ, Thân chủ, Âm dương thuận/nghịch lý, quan hệ Cục – Bản mệnh, năm xem (tuổi, tiểu hạn ở góc trái, nguyệt hạn T.1–T.12 ở góc phải mỗi cung).
- Di chuột / chạm / phím mũi tên tới một cung sẽ vẽ đường nối từ viền cung đó tới 2 cung tam hợp và cung xung chiếu; bấm để ghim.
- Tab **Tra cứu** (phím `C`): danh sách 12 cung theo thứ tự Mệnh → Huynh Đệ với chính tinh, phụ tinh (màu ngũ hành, độ sáng),
  ô tìm kiếm sao, cột "Tra cứu nhanh" bấm vào sao để nhảy tới cung chứa sao đó, mục "Ý nghĩa các sao" (thư viện ý nghĩa
  109 sao + 12 cung có sẵn trong `tuvi/src/meanings.js`) và nút "Copy prompt cung này" (kèm yêu cầu chỉ luận riêng cung đó).
- Đã đối chiếu 1:1 với lá số mẫu của aituvi.com (âm lịch 28/12/1998, giờ Dậu, Nam): `tuvi/test/chart.test.js`.

## Copy prompt luận giải

Nút **Copy prompt** (phím `P` / nút Đỏ) chép vào clipboard một đoạn văn bản gồm prompt luận giải và lá số
viết bằng tiếng Việt: thông tin chung, Tứ Hóa, đại hạn/tiểu hạn năm đang xem, rồi từng cung với chính tinh (độ sáng, ngũ hành),
sao tốt, sao xấu, tam hợp và xung chiếu. Người dùng tự dán vào Gemini / ChatGPT / Claude – không cần API key.
Trong tab Tra cứu, *Copy prompt cung này* thêm yêu cầu chỉ luận riêng một cung.

```bash
#  (tùy chọn) tạo server/prompt.txt để thay prompt mặc định
npm start                            # http://localhost:8080
```

- Prompt mặc định (thầy tử vi luận 12 mục: bản mệnh, phu thê, tài sản, phụ mẫu, thiên di, tật ách, nô bộc, quan lộc, điền trạch,
  tử tức, huynh đệ, phúc đức, rồi vận hạn) và phần mô tả lá số nằm ở `js/tuvi-prompt.js` (`DEFAULT_SYSTEM`, `moTaLaSo`),
  nên mở thẳng `index.html` không cần server vẫn dùng được.
- Nếu có `server/prompt.txt` và đang chạy server, prompt đó được lấy qua `GET /api/prompt` thay cho mặc định (ai mở được giao diện cũng đọc được).
- Nếu mở `index.html` trực tiếp (file://), giao diện sẽ gọi `http://localhost:8080`; có thể đổi bằng `localStorage.setItem('aiApiBase', 'https://may-chu-cua-ban')`.
- Đổi cổng: `PORT=3000 npm start`.

## Chạy module Tử Vi riêng (Node.js)

```bash
cd tuvi
npm run demo          # in lá số mẫu dạng bảng + JSON
npm test              # chạy bộ test
npm run build:browser # đóng gói lại js/tuvi.bundle.js sau khi sửa module
```

## Cách tính

- **Âm lịch, tháng nhuận, tháng đủ/thiếu**: Hồ Ngọc Đức, múi giờ UTC+7.
- **Can Chi**: Năm `(y+6)%10 / (y+8)%12`; Tháng `(y*12+m+3)%10 / (m+1)%12`; Ngày `(jd+9)%10 / (jd+1)%12`.
- **Hoàng đạo / Hắc đạo**: 12 thần theo tháng âm lịch (Thanh Long khởi Tý ở tháng 1 & 7, Dần ở tháng 2 & 8…).
- **Trực**: theo tháng tiết khí (Lập xuân → tháng Dần), Trực Kiến tại ngày cùng chi với tháng.
- **Giờ hoàng đạo**: bảng theo chi ngày (Tý/Ngọ, Sửu/Mùi, …).
- **Sao (28 tú)**: chu kỳ 28 ngày theo JDN, `SAO[(jd+11)%28]`.
- **Nạp âm**: 60 hoa giáp, `NAP_AM[((jd+49)%60)/2]`.
