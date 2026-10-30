---
name: Bắc Đẩu
description: Tử vi · Lịch vạn niên – bầu trời đêm chỉ đường cho cả nhà
colors:
  cham: "#2A2E86"
  ho-phach: "#BF7310"
  suong: "#EEF0FA"
  dem-sau: "#14173d"
  dem-cham: "#1b1e52"
  cham-khuya: "#22266a"
  cham-khuya-hover: "#2b307a"
  suong-mo: "#a2a6d2"
  khoi-cham: "#8489c0"
  anh-sao-lam: "#a9b0ff"
  ho-phach-sang: "#f2a93b"
  son: "#ff8080"
  ngoc: "#7edba8"
  giay-trang: "#ffffff"
  muc-cham: "#1b1e52"
  muc-cham-nhat: "#5c6096"
  vien-suong: "#dfe1f2"
  hanh-kim: "#5f656e"
  hanh-moc: "#13703a"
  hanh-thuy: "#1e293b"
  hanh-hoa: "#c81e1e"
  hanh-tho: "#a14b07"
typography:
  display:
    fontFamily: "Unbounded, Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "6.4rem"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Unbounded, Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "1.55rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Be Vietnam Pro, Inter, system-ui, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "Be Vietnam Pro, Inter, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Be Vietnam Pro, Inter, system-ui, sans-serif"
    fontSize: "max(0.76rem, 11px)"
    fontWeight: 600
    letterSpacing: "0.2em"
rounded:
  xs: "0.3rem"
  sm: "0.45rem"
  md: "0.6rem"
  lg: "0.8rem"
  xl: "1rem"
  pill: "999px"
spacing:
  xs: "0.3rem"
  sm: "0.5rem"
  md: "0.9rem"
  lg: "1.4rem"
components:
  button-primary:
    backgroundColor: "{colors.ho-phach-sang}"
    textColor: "{colors.dem-cham}"
    rounded: "{rounded.md}"
    padding: "0.55rem 1.1rem"
  button-default:
    backgroundColor: "{colors.cham-khuya}"
    textColor: "{colors.suong}"
    rounded: "{rounded.md}"
    padding: "0.55rem 1.1rem"
  button-default-hover:
    backgroundColor: "{colors.cham-khuya-hover}"
  button-primary-light:
    backgroundColor: "{colors.cham}"
    textColor: "{colors.giay-trang}"
    rounded: "{rounded.md}"
    padding: "0.55rem 1.1rem"
  tag:
    textColor: "{colors.ho-phach-sang}"
    rounded: "{rounded.pill}"
    padding: "0.3rem 0.7rem"
  day-cell:
    backgroundColor: "{colors.cham-khuya}"
    textColor: "{colors.suong}"
    rounded: "0.65rem"
    padding: "0.5rem 0.65rem"
  input:
    backgroundColor: "{colors.dem-sau}"
    textColor: "{colors.suong}"
    rounded: "0.55rem"
    height: "2.6rem"
    padding: "0 0.75rem"
---

# Design System: Bắc Đẩu

## Overview

**Creative North Star: "Bầu trời đêm chỉ đường"**

Bắc Đẩu là một bầu trời đêm. Nền là các sắc Chàm, sâu dần từ ngoài vào trong. Chữ là ánh Sương, như ánh sao. Hổ phách là ngôi sao dẫn đường duy nhất: nó đánh dấu hôm nay, ngày âm và hành động chính, không trang trí gì khác. Cảm giác cần đạt là trầm, yên và đáng tin. Người xem là cả gia đình nhiều thế hệ, và số liệu (ngày, giờ, sao) là nhân vật chính, không phải giao diện.

Mật độ cao nhưng có trật tự. Trên TV và máy tính, màn lịch chia hai cột cố định 35/65 và không cuộn. Lá số Tử Vi là một "bản đồ sao" nền sáng, dày đặc thông tin. Thành phần giao diện đi theo hướng tinh gọn, tối giản: ít viền, ít nền. Thứ bậc đến từ màu chữ, độ đậm và khoảng trống, không đến từ khung hộp.

Chiều sâu tạo bằng các lớp màu Chàm, không bằng bóng đổ. Bóng chỉ xuất hiện ở hộp thoại nổi lên trên lịch và ở ô đang được chọn bằng remote.

**Key Characteristics:**
- Nền Chàm nhiều lớp. Chữ màu Sương. Hổ phách là điểm nhấn duy nhất.
- Font hiển thị Unbounded rộng, đậm, dùng cho số ngày và tiêu đề. Nội dung dùng Be Vietnam Pro.
- Cỡ chữ co giãn theo chiều cao màn hình (1rem = 100vh/54) và không nhỏ hơn 11px.
- Lá số dùng nền sáng (Giấy trắng, mực Chàm), là ngoại lệ có chủ đích của thế giới đêm.
- Phẳng, tối giản. Chỉ trạng thái mới tạo độ nổi.

## Colors

Bảng màu đêm Chàm, với một ngôi sao Hổ phách và vài màu ngữ nghĩa cố định.

### Primary
- **Chàm** (#2A2E86): màu thương hiệu. Dùng cho logo trên nền sáng, nút chính và chữ nhấn trong lá số, viền ô cung đang chọn.
- **Hổ phách sáng** (#f2a93b): ngôi sao trên nền tối. Dùng cho ô hôm nay (số và viền), số ngày âm lớn, ngày mùng 1 và rằm, nút chính ("Thêm", "Đi tới"), thẻ ngày lễ âm lịch.
- **Hổ phách** (#BF7310): bản gốc của ngôi sao. Chỉ dùng trên nền sáng (ngôi sao trong logo, nét xung chiếu trong lá số).

### Secondary
- **Ánh sao lam** (#a9b0ff): thông tin phụ trên nền tối, như "còn N ngày", nút phân đoạn đang bật, viền ô đang ghim.

### Neutral
- **Đêm sâu** (#14173d): nền trang, nền ô nhập.
- **Đêm Chàm** (#1b1e52): nền cột thông tin ngày, nền hộp thoại.
- **Chàm khuya** (#22266a): nền ô ngày, nút thường, thẻ giờ hoàng đạo. Khi rê chuột dùng **Chàm khuya sáng** (#2b307a).
- **Sương** (#EEF0FA): chữ chính trên nền tối, nền sáng nhạt trong lá số.
- **Sương mờ** (#a2a6d2): chữ phụ (thứ, tháng, giờ, số ngày âm).
- **Khói Chàm** (#8489c0): chữ mờ nhất còn đọc được (gợi ý phím, ngày của tháng khác).
- **Giấy trắng** (#ffffff), **Mực Chàm** (#1b1e52), **Mực Chàm nhạt** (#5c6096), **Viền Sương** (#dfe1f2): bộ màu nền sáng của lá số, tra cứu và bảng Copy prompt.

### Semantic
- **Son** (#ff8080): Chủ nhật, ngày lễ dương lịch, Hóa Kỵ, ngày xấu (hắc đạo).
- **Ngọc** (#7edba8): giờ hoàng đạo, chấm ngày hoàng đạo, "Ngày của tôi", Hóa Lộc.
- **Ngũ hành** (chỉ dùng trên nền sáng của lá số): Kim (#5f656e), Mộc (#13703a), Thủy (#1e293b), Hỏa (#c81e1e), Thổ (#a14b07).

### Named Rules
**The One Star Rule.** Hổ phách là ngôi sao duy nhất. Nó chỉ đánh dấu điều người xem cần tìm (hôm nay, ngày âm, hành động chính), không bao giờ dùng để trang trí.

**The Meaning-Locked Rule.** Son, Ngọc và năm màu ngũ hành mang nghĩa cố định. Không dùng chúng cho mục đích khác, kể cả khi màu "hợp mắt".

**The Readable Night Rule.** Mọi chữ đạt tương phản tối thiểu 4,5:1 với nền thực tế. Làm mờ bằng cách đổi màu chữ, không bằng `opacity` lên cả khối.

## Typography

**Display Font:** Unbounded (fallback Be Vietnam Pro, system-ui)
**Body Font:** Be Vietnam Pro (fallback Inter, system-ui)

**Character:** Unbounded rộng và chắc, mang chất logo vào những con số lớn. Be Vietnam Pro mềm, dễ đọc, dấu tiếng Việt rõ, nên gánh toàn bộ nội dung.

### Hierarchy
- **Display** (700, 6.4rem, 0.9): số ngày dương lịch lớn trong cột thông tin. Số ngày âm dùng cùng kiểu, cỡ 4rem, màu Hổ phách sáng.
- **Headline** (700, 1.55rem, 1.2): tiêu đề tháng. Tiêu đề hộp thoại dùng cùng font, cỡ 1.2rem; tên "Bắc Đẩu" ở header dùng cỡ 1.2rem, độ đậm 800.
- **Title** (600, 1.4rem, 1.2): thứ trong tuần, tên tháng âm.
- **Body** (400, 0.85rem, 1.5): Can Chi, Hoàng đạo, danh sách sắp tới, sự kiện trong tháng.
- **Section** (600, 0.95rem, chữ thường, màu Sương): tiêu đề khu vực ("Giờ hoàng đạo", "Sắp tới"). Trạng thái "Hôm nay / Đang xem" cùng cỡ, độ đậm 500, màu Sương mờ.
- **Label** (600, max(0.76rem, 11px), chữ hoa, giãn 0.1em): chỉ dùng cho nhãn ô nhập trong hộp thoại.
- Số ô lịch dùng Unbounded 600, 1.35rem.

### Named Rules
**The 11px Floor Rule.** Không chữ nào nhỏ hơn 11px trên bất kỳ màn hình nào: mọi cỡ dưới 0.84rem viết dạng `max(Xrem, 11px)`.

**The Display-for-Numbers Rule.** Unbounded dành cho con số và tiêu đề. Không dùng cho đoạn văn, nút hay nhãn.

## Layout

Màn lịch trên TV và máy tính (rộng ≥ 900px và cao ≥ 520px) là lưới hai cột cố định 35/65, cao đúng 100vh, không cuộn.
- **Cột trái** (Đêm Chàm): ngày đang xem, thông tin, giờ hoàng đạo; phần "Sắp tới" đẩy xuống đáy.
- **Cột phải**: header ba cột (logo, tiêu đề tháng, công cụ và gợi ý phím), lưới 7×6 ô ngày giãn đều, hàng sự kiện trong tháng ở dưới.

Cỡ mọi thứ đi theo `1rem = 100vh / 54`, nên giao diện co giãn theo chiều cao màn hình. Khoảng cách dùng đơn vị vh/vw cho bố cục lớn và rem cho bên trong thành phần.

Dưới 900px chiều rộng hoặc dưới 520px chiều cao:
- Trang xếp dọc và cuộn được. Lịch lên trên, chi tiết ngày xuống dưới.
- 1rem lấy `clamp(14px, 3.9vw, 18px)`.
- Có thanh nút chạm 3×2.
- Ô ngày vuông (tỉ lệ 1:1.12) và ẩn tên sự kiện.

Lá số là lưới 4×4: 12 cung bao quanh một khối trung tâm 2×2. Hàng cao ít nhất bằng nội dung (`minmax(min-content, 1fr)`), nên màn thấp thì hộp lá số cuộn thay vì cắt sao. Trên điện thoại lá số chuyển thành 2 cột, khối trung tâm lên đầu.

## Elevation & Depth

Hệ thống phẳng, chiều sâu bằng các lớp màu: Đêm sâu, rồi Đêm Chàm, rồi Chàm khuya, càng vào trong càng sáng. Đường kẻ là Sương ở 8% độ đậm.

### Shadow Vocabulary
- **Hộp thoại** (`box-shadow: 0 2rem 4rem rgba(5, 6, 30, 0.6)`): khi hộp thoại mở, nền lịch phía sau bị làm mờ (`blur(6px) brightness(0.6)`).
- **Ô đang chọn bằng remote** (`box-shadow: 0 0 0 0.25rem rgba(255,255,255,0.18), 0 0.6rem 1.6rem rgba(5,6,30,0.4)`): kèm viền trắng 2px và phóng to 1.03 lần.
- **Ô hôm nay** (`box-shadow: inset 0 0 0 2px rgba(242,169,59,0.85)`): vòng Hổ phách vẽ bên trong ô, không đổi màu nền.

### Named Rules
**The Flat-By-Default Rule.** Bề mặt phẳng khi đứng yên. Độ nổi chỉ dành cho trạng thái (đang chọn, hộp thoại đang mở).

## Shapes

Bo góc vừa phải, nhất quán:
- ô ngày (0.65rem);
- nút và trường nhập (0.55–0.6rem);
- nút công cụ (0.45rem);
- khung form và danh sách (0.8rem);
- hộp thoại (1rem);
- thẻ sự kiện bo tròn hẳn hai đầu (999px).

Lá số là ngoại lệ: góc vuông và nét kẻ mảnh như lưới lá số truyền thống. Nhãn Tuần/Triệt là con dấu nhỏ màu Mực Chàm nằm trên đường biên giữa hai cung.

Biểu tượng thương hiệu là ngôi sao bốn cánh (hai cạnh lõm), dùng cho logo và favicon.

## Components

Tinh gọn, tối giản: thành phần lùi lại để số liệu nói. Thêm viền hay nền phải có lý do chức năng.

### Buttons
- **Shape:** bo nhẹ (0.6rem). Nút công cụ trên header bo 0.45rem, chữ 0.75rem.
- **Primary:** nền Hổ phách sáng, chữ Đêm Chàm, đệm 0.55rem × 1.1rem. Mỗi màn hình chỉ có một nút này.
- **Default:** nền Chàm khuya, chữ Sương, viền Sương 8%. Rê chuột sáng lên Chàm khuya sáng.
- **Ghost:** không nền, chỉ chữ, dùng cho "Đóng" và hành động phụ.
- **Danger:** chữ và viền Son. Xóa phải bấm hai lần (lần đầu nút đổi thành "Xóa?").
- **Trên nền sáng (lá số):** Primary là nền Chàm, chữ trắng; nút thường nền Sương.

### Chips
- **Thẻ sự kiện:** bo tròn hai đầu, nền 14% của màu ngữ nghĩa, không viền. Hổ phách cho lễ âm lịch, Son cho lễ dương lịch, Ngọc cho Ngày của tôi, Ánh sao lam cho mùng 1 và rằm.
- **Phân đoạn (Dương lịch / Âm lịch):** nền Chàm khuya, mục đang bật có nền Ánh sao lam 16% và chữ Ánh sao lam.

### Cards / Containers
- **Ô ngày:** nền Chàm khuya, bo 0.65rem, đệm 0.5rem × 0.65rem. Số dương ở góc trên trái (Unbounded), số âm ở góc dưới phải, tên sự kiện ở giữa.
  - Chủ nhật và ngày lễ: số màu Son.
  - Hôm nay: số và vòng viền Hổ phách.
  - Tháng khác: nền nhạt hơn, số màu Khói Chàm.
- **Giờ hoàng đạo:** danh sách 3 cột không khung, tên giờ màu Ngọc đậm, khung giờ màu Sương mờ ngay bên cạnh.
- **Hộp thoại:** nền Đêm Chàm, bo 1rem, đệm 1.6rem × 1.8rem. Trên điện thoại trượt lên từ đáy, chỉ bo hai góc trên.

### Inputs / Fields
- **Style:** cao 2.6rem, nền Đêm sâu, viền Sương 8%, bo 0.55rem, chữ đậm 600.
- **Focus:** viền Ánh sao lam và quầng 0.2rem Ánh sao lam 16%.
- **Ô đang chọn bằng remote** (hộp thoại Đi tới ngày): viền trắng 2px cùng quầng trắng.

### Navigation
- Không có thanh điều hướng. Header gồm logo chòm sao kèm "Bắc Đẩu / Tử vi · Lịch vạn niên", tiêu đề tháng, ba nút công cụ (Đi tới ngày, Ngày của tôi, Lá số Tử Vi) dạng chữ không khung (Sương mờ, rê chuột sáng lên Sương). Phím tắt nằm trong chú thích khi rê chuột (`title`), không in thành dòng gợi ý.
- Trên điện thoại, logo nằm giữa và thanh nút chạm 3×2 (nền Chàm khuya, không viền) thay cho nút công cụ.

### Lá số Tử Vi (signature)
- Bản đồ sao nền Giấy trắng, lưới kẻ Viền Sương.
- Mỗi cung có ba dòng:
  - đầu: Can Chi, tên cung, tuổi đại hạn;
  - giữa: chính tinh (đậm, giữa ô), phụ tinh cát bên trái và hung bên phải, tô màu theo ngũ hành;
  - chân: tiểu hạn, Tràng sinh, nguyệt hạn.
- Cung Mệnh có nền Sương ấm (#fdf6ea) và tên cung màu Hổ phách đậm (#8f5306).
- Cung đang chọn có viền Chàm 2px. Đường nối tới tam hợp là nét liền, tới xung chiếu là nét đứt Hổ phách.

## Do's and Don'ts

### Do:
- **Do** dùng Hổ phách sáng (#f2a93b) cho đúng một ý mỗi chỗ: hôm nay, ngày âm, hành động chính.
- **Do** viết mọi cỡ chữ dưới 0.84rem dạng `max(Xrem, 11px)`.
- **Do** kiểm tra tương phản 4,5:1 trên nền thật, gồm cả nền Sương ấm của cung Mệnh và nền ô đang chọn.
- **Do** tạo thứ bậc bằng màu chữ, độ đậm và khoảng trống trước khi nghĩ tới viền hay nền.
- **Do** viết tiêu đề khu vực bằng chữ thường; không đặt nhãn chữ hoa giãn cách phía trên tiêu đề hay con số.
- **Do** để lá số tự giãn theo nội dung và cuộn được, thay vì cắt bớt sao.

### Don't:
- **Don't** làm mờ cả khối bằng `opacity` cho trạng thái "phụ". Đổi màu chữ sang Khói Chàm.
- **Don't** tô nền Hổ phách lên nền Chàm: hai màu pha nhau thành nâu đục. Dùng viền hoặc màu chữ.
- **Don't** dùng Son, Ngọc hay màu ngũ hành cho mục đích trang trí.
- **Don't** dùng Unbounded cho đoạn văn, nút hay nhãn nhỏ.
- **Don't** thêm gradient, thẻ lồng thẻ hay ô icon bo góc trên mỗi tiêu đề.
