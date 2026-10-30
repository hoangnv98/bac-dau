# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Chủ yếu là gia đình của chủ dự án, người Việt nhiều thế hệ. Họ mở Bắc Đẩu trên trình duyệt máy tính và điện thoại cho tiện. Họ dùng nó để xem ngày âm dương, ngày lễ, ngày tốt xấu, giờ hoàng đạo, nhớ sinh nhật và ngày giỗ trong nhà, và lập lá số Tử Vi cho người thân. Chưa xác định việc mở rộng ra người dùng công khai.

## Product Purpose

Bắc Đẩu gộp Lịch vạn niên và lá số Tử Vi vào một trang web nhỏ, dùng ngay không cần cài. Hai phần quan trọng ngang nhau, đúng như dòng phụ đề "Tử vi · Lịch vạn niên". Dùng tốt nghĩa là cả nhà tra được ngày cần tìm, không quên ngày giỗ hay sinh nhật, và lập được lá số đúng để tự mang đi luận.

## Positioning

- Lịch âm tính bằng thuật toán của Hồ Ngọc Đức, theo giờ Việt Nam (UTC+7).
- Lá số đủ bộ 109 sao, đã đối chiếu 1:1 với lá số mẫu của aituvi.com.
- Bắc Đẩu không tự gọi AI. Nó ghép prompt luận giải 12 mục cùng toàn bộ lá số, viết bằng tiếng Việt dễ đọc, để người dùng tự dán vào Gemini, ChatGPT hoặc Claude. Không cần API key, và lá số không bị gửi đi đâu.

## Operating Context

- Dùng trên trình duyệt máy tính và điện thoại. Giao diện TV 16:9 điều khiển bằng remote (D-pad, OK, Back, nút màu) vẫn được hỗ trợ.
- Mở thẳng `index.html` là chạy được. Cũng có thể chạy server tĩnh bằng `npm start`.
- Những việc thường làm:
  - xem tháng, đi tới một ngày dương hoặc âm cụ thể;
  - thêm ngày giỗ hoặc sinh nhật theo âm lịch;
  - lập lá số theo ngày giờ sinh, chọn cung để xem tam hợp và xung chiếu, tra cứu ý nghĩa sao;
  - copy prompt sang AI để luận giải.

## Capabilities and Constraints

- **Lịch:** âm dương, tháng nhuận, Can Chi, tiết khí, Hoàng đạo/Hắc đạo, Trực, Nhị thập bát tú, Nạp âm, giờ hoàng đạo, ngày lễ dương lịch và âm lịch.
- **Ngày của tôi:** sự kiện riêng theo lịch dương hoặc âm, có thể ghi năm gốc để hiện "N năm". Lưu trong `localStorage`, xuất và nhập được bằng file JSON.
- **Lá số Tử Vi:** đủ 109 sao, độ sáng, ngũ hành, Tứ Hóa, Tuần, Triệt, đại hạn, tiểu hạn, nguyệt hạn. Có tab Tra cứu và thư viện ý nghĩa sao.
- **Copy prompt:** có prompt mặc định trong `js/tuvi-prompt.js`. Nếu có `server/prompt.txt` và đang chạy server thì dùng file đó thay thế.
- **Kỹ thuật:** JavaScript thuần (ES5, không build), Tailwind và Google Fonts nạp qua CDN, layout cốt lõi nằm trong `css/style.css`. Không có backend dữ liệu.
- **Bắt buộc:** không thu thập dữ liệu người dùng. Ngày riêng và lá số chỉ ở trên máy người dùng, không gửi đi đâu.

## Brand Commitments

- Tên là **Bắc Đẩu**, phụ đề "Tử vi · Lịch vạn niên".
- Biểu tượng là chòm Bắc Đẩu kèm một ngôi sao bốn cánh màu hổ phách. Các file logo và icon nằm trong `img/`.
- Màu nhận diện do chủ dự án chốt: Chàm `#2A2E86`, Hổ phách `#BF7310`, Sương `#EEF0FA`.
- Toàn bộ giao diện và nội dung bằng tiếng Việt.

## Evidence on Hand

- Lá số mẫu dùng để đối chiếu: âm lịch 28/12/1998, giờ Dậu, Nam (`tuvi/test/chart.test.js`).
- Thư viện ý nghĩa 109 sao và 12 cung: `tuvi/src/meanings.js`.
- Chưa có người dùng ngoài gia đình, chưa có đánh giá hay số liệu sử dụng. Không được bịa ra những thứ này.

## Product Principles

1. **Riêng tư trước hết.** Dữ liệu của gia đình ở lại trên máy họ.
2. **Đúng trước, đẹp sau.** Số liệu âm lịch và lá số phải khớp nguồn đối chiếu. Giao diện không được che hay làm sai dữ liệu.
3. **Ai trong nhà cũng dùng được.** Thao tác ít bước, chữ rõ, dùng tốt trên cả máy tính lẫn điện thoại.
4. **Không cần cài hay đăng ký.** Mở là dùng, không tài khoản, không API key.

## Accessibility & Inclusion

- Người dùng gồm nhiều thế hệ trong một gia đình.
- Chữ nội dung không nhỏ hơn 11px. Tương phản chữ và nền đạt tối thiểu 4,5:1 (WCAG AA). Mức này đã áp dụng trên toàn trang.
