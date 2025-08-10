/* eslint-disable react/no-unescaped-entities */
import React from "react";

const Page = (): React.ReactElement => {
  return (
    <div className="p-4">
      <h1>Sổ giao dịch</h1>
      Color và Background CSS cung cấp nhiều cách để định nghĩa màu sắc và quản lý nền cho các phần tử, tạo nên phong
      cách và bố cục trực quan cho các trang web. 1. Color (Màu sắc) Màu sắc trong CSS có thể được áp dụng cho văn bản,
      đường viền, bóng, và nhiều yếu tố khác. Bạn có thể sử dụng các phương pháp định nghĩa màu sắc như: Tên màu (Color
      Names): CSS hỗ trợ nhiều tên màu có sẵn như red, blue, green, black, white, v.v. Ví dụ: color: red; Mã màu HEX:
      Biểu diễn màu bằng mã HEX với dấu # theo sau là sáu ký tự hexadecimals. Ví dụ: color: #ff0000; (màu đỏ) RGB và
      RGBA: Sử dụng hệ màu RGB (Red, Green, Blue), giá trị trong khoảng 0-255. RGBA thêm giá trị alpha để chỉ định độ
      trong suốt (0 là trong suốt, 1 là không trong suốt). Ví dụ: color: rgb(255, 0, 0); (màu đỏ) Ví dụ: color:
      rgba(255, 0, 0, 0.5); (màu đỏ 50% trong suốt) HSL và HSLA: Hệ màu HSL (Hue, Saturation, Lightness) định nghĩa màu
      dựa trên độ hue (sắc độ), độ bão hòa, và độ sáng. HSLA thêm giá trị alpha cho độ trong suốt. Ví dụ: color: hsl(0,
      100%, 50%); (màu đỏ) Ví dụ: color: hsla(0, 100%, 50%, 0.5); (màu đỏ 50% trong suốt) 2. Background (Nền) Thuộc tính
      background trong CSS được sử dụng để định nghĩa màu nền, hình nền, và các hiệu ứng liên quan. Màu nền (Background
      Color): Được định nghĩa tương tự như color, có thể sử dụng tên màu, mã HEX, RGB, HSL, v.v. Ví dụ:
      background-color: lightblue; Hình nền (Background Image): Đặt hình ảnh làm nền cho phần tử. Ví dụ: // //
      eslint-disable-next-line react/no-unescaped-entities eslint-disable-next-line react/no-unescaped-entities
      background-image: url('image.png'); Background Position: Xác định vị trí hình nền trong phần tử. Các giá trị phổ
      biến là top, bottom, center, left, right. Ví dụ: background-position: center center; Background Size: Điều chỉnh
      kích thước của hình nền. Các giá trị phổ biến là cover, contain, hoặc kích thước cụ thể như 100px, 50%. Ví dụ:
      background-size: cover; Background Repeat: Xác định cách lặp lại hình nền (repeat, no-repeat, repeat-x, repeat-y).
      Ví dụ: background-repeat: no-repeat; Background Attachment: Điều khiển cách hình nền di chuyển khi cuộn trang
      (scroll, fixed, local). Ví dụ: background-attachment: fixed; (hình nền cố định khi cuộn)
    </div>
  );
};

export default Page;
